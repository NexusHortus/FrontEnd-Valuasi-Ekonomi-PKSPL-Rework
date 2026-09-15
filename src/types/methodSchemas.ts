import { EcosystemServiceId } from './valuation';

export interface ColumnDefinition {
  key: string;
  label: string;
  type: 'text' | 'number' | 'readonly_calculated';
  unit?: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  placeholder?: string;
  isTotal?: boolean;
}

export type CustomColumnType = 'text' | 'integer' | 'decimal' | 'date' | 'boolean';

export interface CustomColumnDefinition {
  id: string;
  key: string;
  label: string;
  type: CustomColumnType;
  required?: boolean;
  isCustom: true;
}

export interface MethodSchema {
  serviceId: EcosystemServiceId;
  methodId: string;
  methodName: string;
  subtitle: string;
  formulaDescription: string;
  templateFileName: string;
  columns: ColumnDefinition[];
  calculateRow: (row: Record<string, any>) => { quantity: number; total: number };
  defaultNewRow: (nextNo: number, areaHa: number) => Record<string, any>;
  initialRows: Record<string, any>[];
  serviceTitle?: string;
}

export const METHOD_SCHEMAS: Record<string, MethodSchema> = {
  // -------------------------------------------------------------
  // PROVISIONING - MARKET PRICE (FLORA)
  // -------------------------------------------------------------
  'provisioning_market-price_flora': {
    serviceId: 'provisioning',
    methodId: 'market-price',
    methodName: 'Market Price (Flora)',
    subtitle: 'Nilai Pasar Aktual - Vegetasi Mangrove',
    formulaDescription: 'Total = Produktivitas (m³/ha) × Luas (Ha) × Harga/Unit (Rp)',
    templateFileName: 'Provisioning_MarketPrice_Flora.xlsx',
    columns: [
      { key: 'no', label: 'No', type: 'number', width: 'w-12', align: 'center' },
      { key: 'item', label: 'Jenis Flora', type: 'text', width: 'min-w-[220px]', align: 'left', placeholder: 'Contoh: Rhizophora apiculata' },
      { key: 'produktivitas', label: 'Produktivitas', type: 'number', unit: 'm³/ha', width: 'w-28', align: 'right', placeholder: '0.00' },
      { key: 'satuan', label: 'Satuan', type: 'text', width: 'w-20', align: 'center' },
      { key: 'hargaUnit', label: 'Harga / Unit (Rp)', type: 'number', width: 'w-36', align: 'right', placeholder: '0' },
      { key: 'jumlah', label: 'Volume (m³)', type: 'number', width: 'w-28', align: 'right', placeholder: '0.00' },
      { key: 'luasHa', label: 'Luas (Ha)', type: 'number', width: 'w-24', align: 'right' },
      { key: 'totalNilai', label: 'Total Nilai (Rp)', type: 'readonly_calculated', width: 'min-w-[180px]', align: 'right', isTotal: true },
      { key: 'source', label: 'Sumber Data', type: 'text', width: 'min-w-[180px]', align: 'left', placeholder: 'Survei Pasar 2024' },
    ],
    calculateRow: (r) => {
      const prod = Number(r.produktivitas) || 0;
      const luas = Number(r.luasHa) || 0;
      const harga = Number(r.hargaUnit) || 0;
      const vol = prod > 0 && luas > 0 ? Number((prod * luas).toFixed(2)) : (Number(r.jumlah) || 0);
      const total = vol > 0 && harga > 0 ? Math.round(vol * harga) : 0;
      return { quantity: vol, total };
    },
    defaultNewRow: (no, luasHa) => ({
      id: `ROW-PRV-${Date.now()}-${no}`,
      no,
      item: '',
      produktivitas: null,
      satuan: 'm³/ha',
      hargaUnit: null,
      jumlah: null,
      luasHa,
      totalNilai: 0,
      source: 'Survei Lapangan Peneliti'
    }),
    initialRows: [
      {
        id: 'ROW-PRV-1',
        no: 1,
        item: 'Cemara Laut (Casuarina equisetifolia)',
        produktivitas: 33.18,
        satuan: 'm³/ha',
        hargaUnit: 3231311,
        jumlah: 2649.75,
        luasHa: 79.86,
        totalNilai: 8562456960,
        source: 'Dinas Kehutanan Provinsi Bali'
      },
      {
        id: 'ROW-PRV-2',
        no: 2,
        item: 'Sengon Laut (Falcataria moluccana)',
        produktivitas: 23.93,
        satuan: 'm³/ha',
        hargaUnit: 1090107,
        jumlah: 1911.05,
        luasHa: 79.86,
        totalNilai: 2083272580,
        source: 'Survei Lapangan Peneliti PKSPL'
      },
      {
        id: 'ROW-PRV-3',
        no: 3,
        item: 'Jabon Merah (Neolamarckia macrophylla)',
        produktivitas: 18.50,
        satuan: 'm³/ha',
        hargaUnit: 2098361,
        jumlah: 1477.41,
        luasHa: 79.86,
        totalNilai: 3099980000,
        source: 'Rencana Kelola Ekosistem 2024'
      },
      {
        id: 'ROW-PRV-4',
        no: 4,
        item: 'Rhizophora apiculata (Bakau Minyak)',
        produktivitas: 45.20,
        satuan: 'm³/ha',
        hargaUnit: 1710000,
        jumlah: 3609.67,
        luasHa: 79.86,
        totalNilai: 6174588375,
        source: 'Data Inventarisasi Tegakan 2024'
      }
    ]
  },

  // -------------------------------------------------------------
  // PROVISIONING - EFFECT ON PRODUCTION
  // -------------------------------------------------------------
  'provisioning_effect-production_flora': {
    serviceId: 'provisioning',
    methodId: 'effect-production',
    methodName: 'Effect on Production',
    subtitle: 'Efek terhadap Produksi Perikanan/Tambak',
    formulaDescription: 'Total = Output Terpengaruh (kg) × (Harga Pasar Output - Biaya Input Tambahan)',
    templateFileName: 'Provisioning_EffectOnProduction.xlsx',
    columns: [
      { key: 'no', label: 'No', type: 'number', width: 'w-12', align: 'center' },
      { key: 'item', label: 'Komoditas Terpengaruh', type: 'text', width: 'min-w-[220px]', align: 'left', placeholder: 'Contoh: Ikan Bandeng Tambak' },
      { key: 'outputQty', label: 'Output Terpengaruh (Q)', type: 'number', unit: 'kg/th', width: 'w-36', align: 'right', placeholder: '0' },
      { key: 'hargaOutput', label: 'Harga Output (Rp/kg)', type: 'number', width: 'w-36', align: 'right', placeholder: '0' },
      { key: 'biayaTambahan', label: 'Biaya Input Tambahan (Rp)', type: 'number', width: 'w-36', align: 'right', placeholder: '0' },
      { key: 'totalNilai', label: 'Total Nilai (Rp)', type: 'readonly_calculated', width: 'min-w-[180px]', align: 'right', isTotal: true },
      { key: 'source', label: 'Sumber Data', type: 'text', width: 'min-w-[180px]', align: 'left', placeholder: 'Survei Tambak 2024' },
    ],
    calculateRow: (r) => {
      const q = Number(r.outputQty) || 0;
      const p = Number(r.hargaOutput) || 0;
      const c = Number(r.biayaTambahan) || 0;
      const margin = Math.max(0, p - c);
      return { quantity: q, total: Math.round(q * margin) };
    },
    defaultNewRow: (no) => ({
      id: `ROW-EOP-${Date.now()}-${no}`,
      no,
      item: '',
      outputQty: null,
      hargaOutput: null,
      biayaTambahan: 0,
      totalNilai: 0,
      source: 'Dinas Perikanan'
    }),
    initialRows: [
      {
        id: 'ROW-EOP-1',
        no: 1,
        item: 'Produksi Ikan Bandeng Tambak Payau',
        outputQty: 48000,
        hargaOutput: 38000,
        biayaTambahan: 12000,
        totalNilai: 1248000000,
        source: 'Dinas Perikanan Kab. Badung'
      }
    ]
  },

  // -------------------------------------------------------------
  // REGULATING - REPLACEMENT COST
  // -------------------------------------------------------------
  'regulating_replacement-cost': {
    serviceId: 'regulating',
    methodId: 'replacement-cost',
    methodName: 'Replacement Cost',
    subtitle: 'Biaya Penggantian Bangunan Fisik Penahan Gelombang',
    formulaDescription: 'Total = (Panjang Garis Pantai × Biaya Konstruksi Seawall) + Biaya Pemeliharaan',
    templateFileName: 'Regulating_ReplacementCost.xlsx',
    columns: [
      { key: 'no', label: 'No', type: 'number', width: 'w-12', align: 'center' },
      { key: 'item', label: 'Area / Aset Perlindungan', type: 'text', width: 'min-w-[240px]', align: 'left', placeholder: 'Contoh: Sabuk Hijau Pesisir Barat' },
      { key: 'panjangUnit', label: 'Panjang Garis Pantai', type: 'number', unit: 'meter', width: 'w-32', align: 'right', placeholder: '0' },
      { key: 'biayaPengganti', label: 'Biaya Seawall (Rp/m)', type: 'number', width: 'w-36', align: 'right', placeholder: '0' },
      { key: 'biayaPemeliharaan', label: 'Biaya Pemeliharaan (Rp)', type: 'number', width: 'w-36', align: 'right', placeholder: '0' },
      { key: 'totalNilai', label: 'Total Nilai (Rp)', type: 'readonly_calculated', width: 'min-w-[180px]', align: 'right', isTotal: true },
      { key: 'source', label: 'Sumber Data', type: 'text', width: 'min-w-[180px]', align: 'left', placeholder: 'Standar Biaya Dinas PUPR' },
    ],
    calculateRow: (r) => {
      const pjg = Number(r.panjangUnit) || 0;
      const bPengganti = Number(r.biayaPengganti) || 0;
      const bMaint = Number(r.biayaPemeliharaan) || 0;
      const total = Math.round(pjg * bPengganti + bMaint);
      return { quantity: pjg, total };
    },
    defaultNewRow: (no) => ({
      id: `ROW-REG-RC-${Date.now()}-${no}`,
      no,
      item: '',
      panjangUnit: null,
      biayaPengganti: 4500000,
      biayaPemeliharaan: 0,
      totalNilai: 0,
      source: 'Standar Biaya Khusus PUPR Bali'
    }),
    initialRows: [
      {
        id: 'ROW-REG-RC-1',
        no: 1,
        item: 'Tanggul Penahan Gelombang & Abrasi Zona Barat',
        panjangUnit: 480,
        biayaPengganti: 4500000,
        biayaPemeliharaan: 197865750,
        totalNilai: 2357865750,
        source: 'Dinas PUPR Provinsi Bali'
      }
    ]
  },

  // -------------------------------------------------------------
  // REGULATING - CARBON STORAGE
  // -------------------------------------------------------------
  'regulating_carbon-storage': {
    serviceId: 'regulating',
    methodId: 'carbon-storage',
    methodName: 'Climate / Carbon Storage',
    subtitle: 'Cadangan & Penyerapan Karbon Biru (Blue Carbon)',
    formulaDescription: 'Total = Stok Karbon (ton C/ha) × Luas (Ha) × 3.67 × Harga Karbon (Rp/ton CO2e)',
    templateFileName: 'Regulating_CarbonStorage.xlsx',
    columns: [
      { key: 'no', label: 'No', type: 'number', width: 'w-12', align: 'center' },
      { key: 'item', label: 'Komponen Karbon Biru', type: 'text', width: 'min-w-[240px]', align: 'left', placeholder: 'Contoh: Karbon Biomassa Atas Permukaan' },
      { key: 'stokKarbon', label: 'Stok Karbon', type: 'number', unit: 'ton C/ha', width: 'w-32', align: 'right', placeholder: '0.00' },
      { key: 'luasHa', label: 'Luas (Ha)', type: 'number', width: 'w-24', align: 'right' },
      { key: 'hargaKarbon', label: 'Harga Karbon (Rp/ton)', type: 'number', width: 'w-36', align: 'right', placeholder: '210000' },
      { key: 'totalNilai', label: 'Total Nilai (Rp)', type: 'readonly_calculated', width: 'min-w-[180px]', align: 'right', isTotal: true },
      { key: 'source', label: 'Sumber Data', type: 'text', width: 'min-w-[180px]', align: 'left', placeholder: 'Bursa Karbon IDX' },
    ],
    calculateRow: (r) => {
      const c = Number(r.stokKarbon) || 0;
      const l = Number(r.luasHa) || 0;
      const p = Number(r.hargaKarbon) || 0;
      // Konversi ton C ke ton CO2e = x 3.67
      const total = Math.round(c * l * 3.67 * p);
      return { quantity: Number((c * l).toFixed(2)), total };
    },
    defaultNewRow: (no, luasHa) => ({
      id: `ROW-REG-CS-${Date.now()}-${no}`,
      no,
      item: '',
      stokKarbon: 120,
      luasHa,
      hargaKarbon: 210000,
      totalNilai: 0,
      source: 'Faktor Emisi Nasional KLHK'
    }),
    initialRows: [
      {
        id: 'ROW-REG-CS-1',
        no: 1,
        item: 'Cadangan Karbon Biomassa Atas & Bawah Tanah (AGC+BGC)',
        stokKarbon: 135.5,
        luasHa: 79.86,
        hargaKarbon: 210000,
        totalNilai: 8345712000,
        source: 'Hasil Analisis Allometrik PKSPL 2024'
      }
    ]
  },

  // -------------------------------------------------------------
  // SUPPORTING - HABITAT & NURSERY GROUND
  // -------------------------------------------------------------
  'supporting_nursery-ground': {
    serviceId: 'supporting',
    methodId: 'nursery-ground',
    methodName: 'Habitat & Nursery Ground',
    subtitle: 'Fungsi Asuhan & Pemijahan Benih Biota Laut',
    formulaDescription: 'Total = Luas Habitat (Ha) × Nilai Rekrutmen per Ha × (Tingkat Kerapatan % / 100)',
    templateFileName: 'Supporting_HabitatNursery.xlsx',
    columns: [
      { key: 'no', label: 'No', type: 'number', width: 'w-12', align: 'center' },
      { key: 'item', label: 'Zona Fungsi Habitat Biota', type: 'text', width: 'min-w-[240px]', align: 'left', placeholder: 'Contoh: Tempat Asuhan Larva Udang & Kepiting' },
      { key: 'luasHa', label: 'Luas Habitat (Ha)', type: 'number', width: 'w-28', align: 'right' },
      { key: 'kontribusiPerHa', label: 'Nilai Rekrutmen (Rp/ha/th)', type: 'number', width: 'w-36', align: 'right', placeholder: '0' },
      { key: 'efektivitas', label: 'Kerapatan (%)', type: 'number', width: 'w-24', align: 'right', placeholder: '100' },
      { key: 'totalNilai', label: 'Total Nilai (Rp)', type: 'readonly_calculated', width: 'min-w-[180px]', align: 'right', isTotal: true },
      { key: 'source', label: 'Sumber Data', type: 'text', width: 'min-w-[180px]', align: 'left', placeholder: 'Balai Riset Perikanan' },
    ],
    calculateRow: (r) => {
      const l = Number(r.luasHa) || 0;
      const n = Number(r.kontribusiPerHa) || 0;
      const ef = (Number(r.efektivitas) || 100) / 100;
      const total = Math.round(l * n * ef);
      return { quantity: l, total };
    },
    defaultNewRow: (no, luasHa) => ({
      id: `ROW-SUP-${Date.now()}-${no}`,
      no,
      item: '',
      luasHa,
      kontribusiPerHa: 19052268,
      efektivitas: 100,
      totalNilai: 0,
      source: 'Balai Riset Perikanan Budidaya'
    }),
    initialRows: [
      {
        id: 'ROW-SUP-1',
        no: 1,
        item: 'Daerah Asuhan Benih Kepiting Bakau (Scylla serrata)',
        luasHa: 79.86,
        kontribusiPerHa: 19052268,
        efektivitas: 100,
        totalNilai: 1521514120,
        source: 'Hasil Riset Ekologi Pesisir Balai Riset Perikanan'
      }
    ]
  },

  // -------------------------------------------------------------
  // CULTURAL - TRAVEL COST METHOD (TCM)
  // -------------------------------------------------------------
  'cultural_tcm': {
    serviceId: 'cultural',
    methodId: 'tcm',
    methodName: 'Travel Cost Method (TCM)',
    subtitle: 'Metode Biaya Perjalanan Wisatawan Ekowisata',
    formulaDescription: 'Total = Jumlah Kunjungan (orang/th) × (Rata-rata Biaya Perjalanan + Tiket Masuk)',
    templateFileName: 'Cultural_TCM.xlsx',
    columns: [
      { key: 'no', label: 'No', type: 'number', width: 'w-12', align: 'center' },
      { key: 'item', label: 'Lokasi / Klaster Pengunjung', type: 'text', width: 'min-w-[240px]', align: 'left', placeholder: 'Contoh: Wisatawan Mancanegara Ekowisata Benoa' },
      { key: 'kunjungan', label: 'Jumlah Kunjungan (org/th)', type: 'number', width: 'w-36', align: 'right', placeholder: '0' },
      { key: 'biayaPerjalanan', label: 'Biaya Travel (Rp/org)', type: 'number', width: 'w-36', align: 'right', placeholder: '0' },
      { key: 'biayaTiket', label: 'Tiket Masuk (Rp/org)', type: 'number', width: 'w-32', align: 'right', placeholder: '0' },
      { key: 'totalNilai', label: 'Total Nilai (Rp)', type: 'readonly_calculated', width: 'min-w-[180px]', align: 'right', isTotal: true },
      { key: 'source', label: 'Sumber Data', type: 'text', width: 'min-w-[180px]', align: 'left', placeholder: 'Survei Pengunjung 2024' },
    ],
    calculateRow: (r) => {
      const q = Number(r.kunjungan) || 0;
      const bp = Number(r.biayaPerjalanan) || 0;
      const bt = Number(r.biayaTiket) || 0;
      const total = Math.round(q * (bp + bt));
      return { quantity: q, total };
    },
    defaultNewRow: (no) => ({
      id: `ROW-CUL-TCM-${Date.now()}-${no}`,
      no,
      item: '',
      kunjungan: null,
      biayaPerjalanan: null,
      biayaTiket: 25000,
      totalNilai: 0,
      source: 'Pengelola Ekowisata Mangrove'
    }),
    initialRows: [
      {
        id: 'ROW-CUL-TCM-1',
        no: 1,
        item: 'Pengunjung Domestik Jalur Boardwalk Mangrove',
        kunjungan: 18500,
        biayaPerjalanan: 35000,
        biayaTiket: 15000,
        totalNilai: 925000000,
        source: 'Buku Tamu Pengelola Boardwalk Benoa'
      },
      {
        id: 'ROW-CUL-TCM-2',
        no: 2,
        item: 'Rombongan Edukasi Kampus & Pelajar',
        kunjungan: 4200,
        biayaPerjalanan: 25000,
        biayaTiket: 10000,
        totalNilai: 147000000,
        source: 'Registrasi Program Edukasi Pesisir'
      }
    ]
  },

  // -------------------------------------------------------------
  // CULTURAL - CONTINGENT VALUATION METHOD (CVM)
  // -------------------------------------------------------------
  'cultural_cvm': {
    serviceId: 'cultural',
    methodId: 'cvm',
    methodName: 'Contingent Valuation Method (CVM)',
    subtitle: 'Kesediaan Membayar (WTP) Konservasi Hipotetis',
    formulaDescription: 'Total = (Jumlah Populasi / Responden × Rata-rata WTP per Tahun) - Biaya Program',
    templateFileName: 'Cultural_CVM.xlsx',
    columns: [
      { key: 'no', label: 'No', type: 'number', width: 'w-12', align: 'center' },
      { key: 'item', label: 'Kelompok Responden / Masyarakat', type: 'text', width: 'min-w-[240px]', align: 'left', placeholder: 'Contoh: Rumah Tangga Pesisir Barat' },
      { key: 'populasi', label: 'Jumlah Populasi / KK', type: 'number', width: 'w-32', align: 'right', placeholder: '0' },
      { key: 'wtp', label: 'Rata-rata WTP (Rp/KK/th)', type: 'number', width: 'w-36', align: 'right', placeholder: '0' },
      { key: 'biayaProgram', label: 'Biaya Program (Rp)', type: 'number', width: 'w-32', align: 'right', placeholder: '0' },
      { key: 'totalNilai', label: 'Total Nilai (Rp)', type: 'readonly_calculated', width: 'min-w-[180px]', align: 'right', isTotal: true },
      { key: 'source', label: 'Sumber Data', type: 'text', width: 'min-w-[180px]', align: 'left', placeholder: 'Kuesioner WTP 2024' },
    ],
    calculateRow: (r) => {
      const pop = Number(r.populasi) || 0;
      const w = Number(r.wtp) || 0;
      const c = Number(r.biayaProgram) || 0;
      const total = Math.max(0, Math.round(pop * w - c));
      return { quantity: pop, total };
    },
    defaultNewRow: (no) => ({
      id: `ROW-CUL-CVM-${Date.now()}-${no}`,
      no,
      item: '',
      populasi: null,
      wtp: null,
      biayaProgram: 0,
      totalNilai: 0,
      source: 'Hasil Kuesioner WTP Warga'
    }),
    initialRows: [
      {
        id: 'ROW-CUL-CVM-1',
        no: 1,
        item: 'Rumah Tangga Sekitar Pesisir Teluk Benoa',
        populasi: 3200,
        wtp: 180000,
        biayaProgram: 26000000,
        totalNilai: 550000000,
        source: 'Kuesioner WTP Rumah Tangga 2024'
      },
      {
        id: 'ROW-CUL-CVM-2',
        no: 2,
        item: 'Pengusaha Restoran & Usaha Pariwisata Lokal',
        populasi: 250,
        wtp: 1200000,
        biayaProgram: 0,
        totalNilai: 300000000,
        source: 'Wawancara Terstruktur Pelaku Usaha'
      }
    ]
  },

  // -------------------------------------------------------------
  // CULTURAL - CHOICE EXPERIMENT
  // -------------------------------------------------------------
  'cultural_choice-experiment': {
    serviceId: 'cultural',
    methodId: 'choice-experiment',
    methodName: 'Choice Experiment',
    subtitle: 'Preferensi Masyarakat atas Atribut Jasa Lingkungan',
    formulaDescription: 'Total = (Jumlah Responden × Nilai Marginal Atribut) - Biaya Skema Pengelolaan',
    templateFileName: 'Cultural_ChoiceExperiment.xlsx',
    columns: [
      { key: 'no', label: 'No', type: 'number', width: 'w-12', align: 'center' },
      { key: 'item', label: 'Skenario Atribut Kebijakan', type: 'text', width: 'min-w-[240px]', align: 'left', placeholder: 'Contoh: Skenario Perlindungan Kualitas Air & Satwa' },
      { key: 'responden', label: 'Jumlah Responden (N)', type: 'number', width: 'w-32', align: 'right', placeholder: '0' },
      { key: 'nilaiMarginal', label: 'Nilai Marginal (Rp/N)', type: 'number', width: 'w-36', align: 'right', placeholder: '0' },
      { key: 'biayaSkema', label: 'Biaya Skema (Rp)', type: 'number', width: 'w-32', align: 'right', placeholder: '0' },
      { key: 'totalNilai', label: 'Total Nilai (Rp)', type: 'readonly_calculated', width: 'min-w-[180px]', align: 'right', isTotal: true },
      { key: 'source', label: 'Sumber Data', type: 'text', width: 'min-w-[180px]', align: 'left', placeholder: 'Model Logit Eksperimen' },
    ],
    calculateRow: (r) => {
      const n = Number(r.responden) || 0;
      const m = Number(r.nilaiMarginal) || 0;
      const c = Number(r.biayaSkema) || 0;
      const total = Math.max(0, Math.round(n * m - c));
      return { quantity: n, total };
    },
    defaultNewRow: (no) => ({
      id: `ROW-CUL-CE-${Date.now()}-${no}`,
      no,
      item: '',
      responden: null,
      nilaiMarginal: null,
      biayaSkema: 0,
      totalNilai: 0,
      source: 'Analisis Choice Experiment PKSPL'
    }),
    initialRows: [
      {
        id: 'ROW-CUL-CE-1',
        no: 1,
        item: 'Atribut Kejernihan Air Muara & Keberadaan Burung Air',
        responden: 1200,
        nilaiMarginal: 450000,
        biayaSkema: 40000000,
        totalNilai: 500000000,
        source: 'Hasil Estimasi Model Logit Multinominal'
      },
      {
        id: 'ROW-CUL-CE-2',
        no: 2,
        item: 'Atribut Zonasi Suaka Ikan Tradisional',
        responden: 1200,
        nilaiMarginal: 320000,
        biayaSkema: 34000000,
        totalNilai: 350000000,
        source: 'Estimasi Kesediaan Membayar Atribut Pesisir'
      }
    ]
  }
};

/**
 * Helper untuk mengambil schema yang tepat berdasarkan serviceId, methodId, dan biota
 */
export const getMethodSchema = (serviceId?: string, methodId?: string, biota?: string): MethodSchema => {
  const normService = (serviceId || 'provisioning').toLowerCase();
  const normMethod = (methodId || '').toLowerCase();

  // Try direct match
  if (normMethod) {
    const key1 = `${normService}_${normMethod}_${biota || 'flora'}`;
    if (METHOD_SCHEMAS[key1]) return METHOD_SCHEMAS[key1];

    const key2 = `${normService}_${normMethod}`;
    if (METHOD_SCHEMAS[key2]) return METHOD_SCHEMAS[key2];
  }

  // Default fallbacks per service
  if (normService === 'provisioning') return METHOD_SCHEMAS['provisioning_market-price_flora'];
  if (normService === 'regulating') return METHOD_SCHEMAS['regulating_replacement-cost'];
  if (normService === 'supporting') return METHOD_SCHEMAS['supporting_nursery-ground'];
  if (normService === 'cultural') return METHOD_SCHEMAS['cultural_tcm'];

  return METHOD_SCHEMAS['provisioning_market-price_flora'];
};
