import { SpreadsheetRow } from '../types/spreadsheet';
import { Project } from '../types/project';
import { LandCoverPolygon, IndexItem } from '../types/spatial';
import { calculateRowTotal, calculateRowQuantity } from './formulas';
import { getMethodSchema } from '../types/methodSchemas';
import { parseIndonesianNumber } from './formatter';

// Safe resolver for SheetJS loaded via index.html or npm
const getXLSX = () => {
  if (typeof window !== 'undefined' && (window as any).XLSX) {
    return (window as any).XLSX;
  }
  return null;
};

import { CustomColumnType } from '../types/methodSchemas';

export interface DetectedCustomColumn {
  key: string;
  label: string;
  type: CustomColumnType;
}

export interface ParseResult {
  isCompatible: boolean;
  mismatchReason?: string;
  totalRows: number;
  validRowsCount: number;
  errorRowsCount: number;
  errors: { row: number; column: string; message: string }[];
  validRows: SpreadsheetRow[];
  allRowsPreview: (SpreadsheetRow & { hasError: boolean; errorMsg?: string })[];
  systemColumnsCount: number;
  detectedCustomColumns: DetectedCustomColumn[];
}

/**
 * Generate dan unduh template resmi Excel terikat konteks
 */
export const downloadContextTemplate = (
  service: string,
  method: string,
  category: string = 'Flora'
): void => {
  const XLSX = getXLSX();
  const schema = getMethodSchema(service, method, category.toLowerCase());
  const fileName = schema?.templateFileName || `${service}_${method}_${category}.xlsx`;
  const sheetName = 'Template_Input';

  // Metadata headers to strictly identify the template context
  const cols = schema?.columns || [];
  const headers = cols.map(c => c.label);

  // Sample data rows from schema initial rows
  const sampleData = (schema?.initialRows || []).map((r, idx) => {
    return cols.map(c => {
      if (c.key === 'no') return idx + 1;
      return r[c.key] ?? '';
    });
  });

  const wsData = [
    [`#CONTEXT:SERVICE=${service};METHOD=${method};CATEGORY=${category};VERSION=1.0`],
    headers,
    ...sampleData
  ];

  if (!XLSX) {
    // CSV fallback download
    const csvContent = wsData.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", fileName.replace(/\.xlsx$/, '.csv'));
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  ws['!cols'] = cols.map(() => ({ wch: 22 }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, fileName);
};

/**
 * Validasi dan parse file Excel yang diunggah
 */
export const validateAndParseExcel = async (
  file: File,
  expectedService: string,
  expectedMethod: string,
  expectedCategory: string = 'Flora'
): Promise<ParseResult> => {
  return new Promise((resolve, reject) => {
    const XLSX = getXLSX();
    if (!XLSX) {
      return reject(new Error('Library SheetJS belum selesai dimuat. Silakan tunggu sesaat atau periksa koneksi internet.'));
    }
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        if (workbook.SheetNames.length === 0) {
          return resolve({
            isCompatible: false,
            mismatchReason: 'File spreadsheet tidak memiliki lembar kerja (worksheet).',
            totalRows: 0,
            validRowsCount: 0,
            errorRowsCount: 0,
            errors: [],
            validRows: [],
            allRowsPreview: []
          });
        }

        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawAoa: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

        if (rawAoa.length < 2) {
          return resolve({
            isCompatible: false,
            mismatchReason: 'File tidak memiliki baris data yang cukup untuk diproses.',
            totalRows: 0,
            validRowsCount: 0,
            errorRowsCount: 0,
            errors: [],
            validRows: [],
            allRowsPreview: []
          });
        }

        // Cek context baris 1 atau nama file
        let detectedService = '';
        let detectedMethod = '';
        let detectedCategory = '';

        const metaLine = String(rawAoa[0]?.[0] || '');
        if (metaLine.startsWith('#CONTEXT:')) {
          const matchService = metaLine.match(/SERVICE=([^;]+)/);
          const matchMethod = metaLine.match(/METHOD=([^;]+)/);
          const matchCat = metaLine.match(/CATEGORY=([^;]+)/);
          if (matchService) detectedService = matchService[1];
          if (matchMethod) detectedMethod = matchMethod[1];
          if (matchCat) detectedCategory = matchCat[1];
        } else {
          // Cek dari nama file jika baris metadata hilang
          const fname = file.name.toLowerCase();
          if (fname.includes('regulating') || fname.includes('replacement')) {
            detectedService = 'Regulating';
            detectedMethod = 'ReplacementCost';
          } else if (fname.includes('cultural') || fname.includes('travelcost')) {
            detectedService = 'Cultural';
            detectedMethod = 'TravelCost';
          }
        }

        // Cek ketidaksesuaian template
        const normExpectedServ = expectedService.toLowerCase().replace(/[^a-z0-9]/g, '');
        const normExpectedMeth = expectedMethod.toLowerCase().replace(/[^a-z0-9]/g, '');

        if (detectedService && detectedService.toLowerCase().replace(/[^a-z0-9]/g, '') !== normExpectedServ) {
          return resolve({
            isCompatible: false,
            mismatchReason: `File tidak sesuai dengan data ${expectedService}. Silakan gunakan template ${expectedService}.`,
            totalRows: 0,
            validRowsCount: 0,
            errorRowsCount: 0,
            errors: [],
            validRows: [],
            allRowsPreview: [],
            systemColumnsCount: 0,
            detectedCustomColumns: []
          });
        }

        // Identify header row and schema system columns
        const headerRowIndex = metaLine.startsWith('#CONTEXT:') ? 1 : 0;
        const headerRow: any[] = rawAoa[headerRowIndex] || [];
        const schema = getMethodSchema(expectedService, expectedMethod, expectedCategory.toLowerCase());
        const systemCols = schema.columns.filter(c => !c.isTotal && c.type !== 'readonly_calculated' && c.key !== 'totalNilai');
        const systemColumnsCount = systemCols.length;

        // Detect any additional custom columns present in header beyond system columns
        const detectedCustomColumns: DetectedCustomColumn[] = [];
        const customColHeaderIndices: { headerIdx: number; colDef: DetectedCustomColumn }[] = [];

        for (let c = 0; c < headerRow.length; c++) {
          const rawHeader = String(headerRow[c] || '').trim();
          if (!rawHeader) continue;

          // Check if this header matches any system column label
          const isSystem = systemCols.some(sc => sc.label.toLowerCase() === rawHeader.toLowerCase());
          if (!isSystem && c >= 1) { // Skip index 0 (No)
            const rawKey = rawHeader.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
            const key = `c_${rawKey || 'col'}_${c}`;
            const customCol: DetectedCustomColumn = {
              key,
              label: rawHeader,
              type: 'text',
            };
            detectedCustomColumns.push(customCol);
            customColHeaderIndices.push({ headerIdx: c, colDef: customCol });
          }
        }

        // Start reading data rows (skip meta if present, skip headers)
        const startRowIndex = metaLine.startsWith('#CONTEXT:') ? 2 : 1;
        const rowsToProcess = rawAoa.slice(startRowIndex).filter(r => r.some((c: any) => String(c).trim() !== ''));

        const errors: { row: number; column: string; message: string }[] = [];
        const validRows: SpreadsheetRow[] = [];
        const allRowsPreview: (SpreadsheetRow & { hasError: boolean; errorMsg?: string })[] = [];

        rowsToProcess.forEach((r, idx) => {
          const rowNum = idx + 1;
          const itemName = String(r[1] || '').trim();
          const prodRaw = r[2];
          const satuan = String(r[3] || 'm³/ha').trim();
          const hargaRaw = r[4];
          const luasHaRaw = r[5];
          const sumberData = String(r[6] || '').trim();
          const catatan = String(r[7] || '').trim();

          const prod = parseIndonesianNumber(prodRaw);
          const harga = parseIndonesianNumber(hargaRaw);
          const luas = parseIndonesianNumber(luasHaRaw) ?? 79.86;

          let rowError: string | null = null;

          if (!itemName) {
            rowError = 'Nama jenis flora/fauna tidak boleh kosong';
            errors.push({ row: rowNum, column: 'Jenis Flora', message: rowError });
          } else if (harga === null || harga <= 0) {
            rowError = 'Harga/Unit harus berupa nilai numerik valid > 0';
            errors.push({ row: rowNum, column: 'Harga/Unit', message: rowError });
          }

          // Extract values for detected custom columns
          const customValues: Record<string, any> = {};
          customColHeaderIndices.forEach(({ headerIdx, colDef }) => {
            const rawVal = r[headerIdx];
            if (rawVal !== undefined && rawVal !== '') {
              customValues[colDef.key] = rawVal;
            }
          });

          const partialRow: Record<string, any> = {
            id: `IMP-${Date.now()}-${idx}`,
            no: rowNum,
            item: itemName || `Baris ${rowNum} (Kosong)`,
            produktivitas: prod,
            satuan: satuan,
            hargaUnit: harga,
            luasHa: luas,
            source: sumberData,
            note: catatan,
            ...customValues,
            status: rowError ? 'invalid' : 'valid',
            validationError: rowError || undefined
          };

          const calculatedTotal = calculateRowTotal(partialRow as any);
          const calculatedQty = calculateRowQuantity(partialRow as any);

          const finalRow: SpreadsheetRow = {
            ...partialRow as SpreadsheetRow,
            jumlah: calculatedQty,
            totalNilai: calculatedTotal
          };

          if (rowError) {
            allRowsPreview.push({ ...finalRow, hasError: true, errorMsg: rowError });
          } else {
            validRows.push(finalRow);
            allRowsPreview.push({ ...finalRow, hasError: false });
          }
        });

        resolve({
          isCompatible: true,
          totalRows: rowsToProcess.length,
          validRowsCount: validRows.length,
          errorRowsCount: errors.length,
          errors,
          validRows,
          allRowsPreview,
          systemColumnsCount,
          detectedCustomColumns
        });
      } catch (err: any) {
        reject(new Error('Gagal memproses file Excel: ' + err.message));
      }
    };

    reader.onerror = () => reject(new Error('Gagal membaca file dari sistem.'));
    reader.readAsArrayBuffer(file);
  });
};

export interface WorkbookExportOptions {
  indices?: IndexItem[];
  provRows?: any[];
  regRows?: any[];
  suppRows?: any[];
  cultRows?: any[];
  tevTotals?: {
    prov: number;
    reg: number;
    supp: number;
    cult: number;
    grand: number;
  };
}

/**
 * Multi-sheet Excel workbook export simulasi 13 sheet terstruktur sesuai spesifikasi riset
 */
export const exportFullProjectWorkbook = (
  project: Project,
  landCovers: LandCoverPolygon[],
  currentRows: SpreadsheetRow[] = [],
  options?: WorkbookExportOptions
): void => {
  const XLSX = getXLSX();
  if (!XLSX) {
    alert('Library SheetJS belum selesai dimuat. Silakan muat ulang halaman.');
    return;
  }
  const wb = XLSX.utils.book_new();

  const provSum = options?.tevTotals?.prov ?? 19920297915;
  const regSum = options?.tevTotals?.reg ?? 17761500000;
  const suppSum = options?.tevTotals?.supp ?? 1521514120;
  const cultSum = options?.tevTotals?.cult ?? 1127000000;
  const grandTEV = options?.tevTotals?.grand ?? (provSum + regSum + suppSum + cultSum);

  // 01 Ringkasan
  const summaryAoa = [
    ['SISTEM VALUASI EKONOMI PKSPL - RINGKASAN PENELITIAN'],
    ['Kode Proyek', project.code],
    ['Nama Penelitian', project.name],
    ['Peneliti Penanggung Jawab', project.lead],
    ['Lokasi', project.location],
    ['Ekosistem', project.ecosystem],
    ['Tahun', project.year],
    ['Status Alur', project.status],
    ['Tanggal Dibuat', project.createdAt],
    ['Tanggal Ekspor', new Date().toISOString()],
    [],
    ['REKAPITULASI TOTAL NILAI EKONOMI (TEV)'],
    ['Area Tutupan Lahan', 'Tipe', 'Luas (Ha)', 'Provisioning (Rp)', 'Regulating (Rp)', 'Supporting (Rp)', 'Cultural (Rp)', 'Total (Rp)']
  ];

  let sumAreas = 0;
  landCovers.forEach((lc) => {
    const pVal = lc.serviceDetails.find(s => s.serviceId === 'provisioning')?.value || 0;
    const rVal = lc.serviceDetails.find(s => s.serviceId === 'regulating')?.value || 0;
    const sVal = lc.serviceDetails.find(s => s.serviceId === 'supporting')?.value || 0;
    const cVal = lc.serviceDetails.find(s => s.serviceId === 'cultural')?.value || 0;
    sumAreas += lc.totalValue;

    summaryAoa.push([
      lc.name,
      lc.type.toUpperCase(),
      lc.areaHa,
      pVal,
      rVal,
      sVal,
      cVal,
      lc.totalValue
    ]);
  });

  summaryAoa.push(['TOTAL TEV KAWASAN', '', '', '', '', '', '', grandTEV > 0 ? grandTEV : sumAreas]);
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summaryAoa), '01 Ringkasan');

  // 02 Informasi Proyek
  const infoAoa = [
    ['PARAMETER', 'NILAI'],
    ['ID Internal', project.id],
    ['Kode Proyek', project.code],
    ['Nama Lengkap', project.name],
    ['Deskripsi', project.description],
    ['Lead Researcher', project.lead],
    ['Kabupaten/Kota', project.location],
    ['Tipe Ekosistem', project.ecosystem],
    ['Tahun Evaluasi', project.year],
    ['Status Saat Ini', project.status]
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(infoAoa), '02 Informasi Proyek');

  // 03 Index
  const indexList = options?.indices && options.indices.length > 0 ? options.indices : [
    { code: 'IDX-001', name: 'Mangrove Barat', landCoverType: 'Mangrove', areaHa: 79.86, spatialStatus: 'connected', status: 'Draft' },
    { code: 'IDX-002', name: 'Mangrove Timur', landCoverType: 'Mangrove', areaHa: 62.40, spatialStatus: 'connected', status: 'Draft' },
    { code: 'IDX-003', name: 'Lamun Utara', landCoverType: 'Lamun', areaHa: 34.20, spatialStatus: 'unconnected', status: 'Draft' },
    { code: 'IDX-004', name: 'Terumbu Karang', landCoverType: 'Terumbu Karang', areaHa: 18.75, spatialStatus: 'unconnected', status: 'Draft' }
  ];
  const idxAoa = [
    ['Kode Index', 'Nama Index', 'Tipe Tutupan', 'Luas Area (Ha)', 'Status Spasial GIS', 'Status Index'],
    ...indexList.map(i => [
      i.code,
      i.name,
      (i as any).landCoverType || 'Mangrove',
      i.areaHa || 50,
      i.spatialStatus === 'connected' ? 'Terhubung (SHP)' : 'Belum Terhubung',
      i.status || 'Draft'
    ])
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(idxAoa), '03 Index');

  // 04 Data Spasial
  const shpAoa = [
    ['Nama Layer', 'Tipe Feature', 'Jumlah Polygon', 'Sistem Proyeksi CRS', 'Status'],
    ['Batas Proyek Teluk Benoa', 'Polygon', 1, 'WGS 1984 / UTM Zone 50S', 'Tervalidasi'],
    ['Area Tutupan Lahan', 'Polygon Multi-Feature', landCovers.length, 'WGS 1984 / UTM Zone 50S', 'Tervalidasi'],
    ['Zonasi Konservasi Mangrove', 'Polygon', 3, 'WGS 1984 / UTM Zone 50S', 'Tervalidasi'],
    ['Jaringan Aliran Sungai & Muara', 'LineString', 8, 'WGS 1984 / UTM Zone 50S', 'Tervalidasi']
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(shpAoa), '04 Data Spasial');

  // 05 Data Master
  const masterAoa = [
    ['Kategori Master', 'Kode', 'Nama Referensi / Spesies / Objek', 'Satuan / Nilai', 'Keterangan'],
    ['Vegetasi', 'VEG-001', 'Rhizophora apiculata (Bakau Minyak)', 'm³/ha', 'Dilindungi'],
    ['Vegetasi', 'VEG-002', 'Avicennia marina (Api-api Putih)', 'm³/ha', 'Tersedia'],
    ['Vegetasi', 'VEG-003', 'Sonneratia alba (Pedada)', 'm³/ha', 'Tersedia'],
    ['Vegetasi', 'VEG-004', 'Casuarina equisetifolia (Cemara Laut)', 'm³/ha', 'Tersedia'],
    ['Objek Pajak', 'PJK-001', 'NJOP Bumi Sektor Perikanan', 'Bumi & Bangunan', 'UU HKPD / Perda Badung'],
    ['Objek Pajak', 'PJK-002', 'Retribusi Jasa Lingkungan Pesisir', 'Retribusi Daerah', 'Perda Prov. Bali No. 1 2020'],
    ['Data Pendukung', 'PAR-001', 'Biomass Carbon Conversion Factor', '0.47 ton C / ton biomasa', 'IPCC Wetlands Supplement 2013'],
    ['Data Pendukung', 'PAR-002', 'Harga Shadow Karbon Domestik', 'Rp 210.000 / ton CO2e', 'Bursa Karbon Indonesia (IDXCarbon)'],
    ['Data Pendukung', 'PAR-003', 'Biaya Penggantian Tanggul Beton', 'Rp 4.500.000 / meter', 'Dinas PUPR Prov. Bali']
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(masterAoa), '05 Data Master');

  // 06 Jasa & Metode
  const idAoa = [
    ['Area Tutupan Lahan', 'Index Terkait', 'Jasa Ekosistem Terpilih', 'Metode Valuasi Ilmiah'],
    ['Mangrove Barat (79.86 ha)', 'IDX-001', 'Provisioning, Regulating, Supporting, Cultural', 'Market Price, Replacement Cost, Nursery Ground, TCM'],
    ['Mangrove Timur (62.40 ha)', 'IDX-002', 'Provisioning, Regulating', 'Market Price, Carbon Storage'],
    ['Lamun Utara (34.20 ha)', 'IDX-003', 'Regulating, Supporting', 'Carbon Storage, Nursery Ground'],
    ['Terumbu Karang (18.75 ha)', 'IDX-004', 'Cultural, Supporting', 'Travel Cost Method (TCM), Habitat Function']
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(idAoa), '06 Jasa & Metode');

  // 07 Provisioning
  const pRows = options?.provRows && options.provRows.length > 0 ? options.provRows : currentRows;
  const provAoa = [
    ['No', 'Jenis Komoditas / Biota', 'Produktivitas', 'Satuan', 'Harga/Unit (Rp)', 'Luas Ha', 'Volume/Jumlah', 'Total Nilai (Rp)', 'Sumber Data', 'Status'],
    ...pRows.map((r, i) => [
      r.no || i + 1,
      r.item || r.namaKomoditas || '-',
      r.produktivitas || '-',
      r.satuan || '-',
      r.hargaUnit || r.hargaKomoditas || 0,
      r.luasHa || 79.86,
      r.jumlah || r.volumeOutput || '-',
      r.totalNilai || 0,
      r.source || r.sumberData || 'Survei Peneliti',
      (r.status || 'valid').toUpperCase()
    ])
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(provAoa), '07 Provisioning');

  // 08 Regulating
  const rRows = options?.regRows && options.regRows.length > 0 ? options.regRows : [
    { no: 1, item: 'Penyimpanan Stok Karbon Pesisir (Blue Carbon)', method: 'Climate / Carbon Storage', param: '3.150 ton CO2e', unitPrice: 210000, totalNilai: 661500000 },
    { no: 2, item: 'Perlindungan Abrasi & Pemecah Gelombang', method: 'Replacement Cost', param: '3.800 meter garis pantai', unitPrice: 4500000, totalNilai: 17100000000 }
  ];
  const regAoa = [
    ['No', 'Fungsi / Aset Pengaturan', 'Satuan / Variabel', 'Biaya / Harga Unit (Rp)', 'Total Nilai (Rp)', 'Sumber / Dasar Rujukan'],
    ...rRows.map((r, i) => [
      r.no || i + 1,
      r.item || r.fungsi || r.zona || '-',
      r.param || r.panjangUnit || r.stokKarbon || '-',
      r.unitPrice || r.biayaUnit || r.hargaKarbon || 0,
      r.totalNilai || 0,
      r.source || r.dasarRujukan || 'Survei Dinas PU'
    ])
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(regAoa), '08 Regulating');

  // 09 Supporting
  const sRows = options?.suppRows && options.suppRows.length > 0 ? options.suppRows : [
    { no: 1, item: 'Tempat Pemijahan & Asuhan Biota (Nursery Ground)', method: 'Habitat Function', luasHa: 79.86, unitVal: 19052268, totalNilai: 1521514120 }
  ];
  const suppAoa = [
    ['No', 'Fungsi Penopang / Biota Asuhan', 'Luas Ekosistem (Ha)', 'Kontribusi Rekrutmen / Ha (Rp)', 'Total Nilai (Rp)', 'Dasar Rujukan'],
    ...sRows.map((r, i) => [
      r.no || i + 1,
      r.item || r.fungsi || '-',
      r.luasHa || 79.86,
      r.unitVal || r.nilaiKontribusiHa || 0,
      r.totalNilai || 0,
      r.source || 'Studi Valuasi PKSPL IPB'
    ])
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(suppAoa), '09 Supporting');

  // 10 Cultural
  const cRows = options?.cultRows && options.cultRows.length > 0 ? options.cultRows : [
    { no: 1, item: 'Ekowisata Susur Mangrove & Rekreasi', method: 'Travel Cost Method (TCM)', visit: 24500, cost: 46000, totalNilai: 1127000000 }
  ];
  const cultAoa = [
    ['No', 'Program / Objek Wisata Budaya', 'Jumlah Kunjungan / Responden', 'Biaya / WTP per Satuan (Rp)', 'Total Nilai (Rp)', 'Sumber Data Survei'],
    ...cRows.map((r, i) => [
      r.no || i + 1,
      r.item || r.program || '-',
      r.visit || r.jumlahKunjungan || r.jumlahResponden || 0,
      r.cost || r.biayaTrip || r.wtp || 0,
      r.totalNilai || 0,
      r.source || 'Kuesioner Pengunjung'
    ])
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(cultAoa), '10 Cultural');

  // 11 Perhitungan
  const directSum = provSum + cultSum;
  const calcAoa = [
    ['Komponen Valuasi', 'Metodologi Agregasi', 'Rumus Singkat', 'Hasil Agregasi (Rp)'],
    ['Direct Use Value (DUV)', 'Penjumlahan Jasa Penyediaan & Budaya/Wisata', 'DUV = Provisioning + Cultural', directSum],
    ['Indirect Use Value (IUV)', 'Penjumlahan Jasa Pengaturan Lingkungan', 'IUV = Regulating Services', regSum],
    ['Supporting Use Value (SUV)', 'Penjumlahan Jasa Penopang Nursery Ground', 'SUV = Supporting Services', suppSum],
    ['Total Economic Value (TEV)', 'Agregasi Komprehensif Seluruh Nilai Ekologis', 'TEV = DUV + IUV + SUV', grandTEV]
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(calcAoa), '11 Perhitungan');

  // 12 Rekapitulasi
  const recapAoa = [
    ['Kategori Jasa Ekosistem', 'Nilai Nominal (Rp)', 'Kontribusi (%)'],
    ['Provisioning Services', provSum, grandTEV > 0 ? ((provSum / grandTEV) * 100).toFixed(2) + '%' : '0%'],
    ['Regulating Services', regSum, grandTEV > 0 ? ((regSum / grandTEV) * 100).toFixed(2) + '%' : '0%'],
    ['Supporting Services', suppSum, grandTEV > 0 ? ((suppSum / grandTEV) * 100).toFixed(2) + '%' : '0%'],
    ['Cultural Services', cultSum, grandTEV > 0 ? ((cultSum / grandTEV) * 100).toFixed(2) + '%' : '0%'],
    ['TOTAL ECONOMIC VALUE (TEV)', grandTEV, '100.00%']
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(recapAoa), '12 Rekapitulasi');

  // 13 Analitik
  const dPct = grandTEV > 0 ? ((directSum / grandTEV) * 100).toFixed(2) + '%' : '0.00%';
  const iPct = grandTEV > 0 ? ((regSum / grandTEV) * 100).toFixed(2) + '%' : '0.00%';
  const sPct = grandTEV > 0 ? ((suppSum / grandTEV) * 100).toFixed(2) + '%' : '0.00%';
  const analAoa = [
    ['Kategori Analitik', 'Persentase Kontribusi (%)', 'Nilai Nominal (Rp)'],
    ['Direct Use Value', dPct, directSum],
    ['Indirect Use Value', iPct, regSum],
    ['Supporting Value', sPct, suppSum],
    ['Total Proporsi', '100.00%', grandTEV]
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(analAoa), '13 Analitik');

  XLSX.writeFile(wb, `PKSPL_Laporan_Valuasi_${project.code}.xlsx`);
};
