export interface MasterVegetasi {
  id: string;
  kode: string;
  nama: string;
  famili: string;
  satuan: string;
  status: 'Tersedia' | 'Dilindungi' | 'Rentan';
  updatedAt: string;
}

export interface MasterObjekPajak {
  id: string;
  kode: string;
  nama: string;
  jenis: string;
  dasarHukum: string;
  status: 'Aktif' | 'Nonaktif';
  updatedAt: string;
}

export interface MasterDataPendukung {
  id: string;
  kode: string;
  parameter: string;
  nilai: string;
  satuan: string;
  sumberReferensi: string;
  kategori: string;
}

export const INITIAL_VEGETASI: MasterVegetasi[] = [
  {
    id: 'veg-1',
    kode: 'VEG-001',
    nama: 'Rhizophora apiculata (Bakau Minyak)',
    famili: 'Rhizophoraceae',
    satuan: 'm³/ha',
    status: 'Dilindungi',
    updatedAt: '2025-08-10'
  },
  {
    id: 'veg-2',
    kode: 'VEG-002',
    nama: 'Avicennia marina (Api-api Putih)',
    famili: 'Acanthaceae',
    satuan: 'm³/ha',
    status: 'Tersedia',
    updatedAt: '2025-08-12'
  },
  {
    id: 'veg-3',
    kode: 'VEG-003',
    nama: 'Sonneratia alba (Pedada)',
    famili: 'Lythraceae',
    satuan: 'm³/ha',
    status: 'Tersedia',
    updatedAt: '2025-08-12'
  },
  {
    id: 'veg-4',
    kode: 'VEG-004',
    nama: 'Casuarina equisetifolia (Cemara Laut)',
    famili: 'Casuarinaceae',
    satuan: 'm³/ha',
    status: 'Tersedia',
    updatedAt: '2025-08-15'
  },
  {
    id: 'veg-5',
    kode: 'VEG-005',
    nama: 'Falcataria moluccana (Sengon Laut)',
    famili: 'Fabaceae',
    satuan: 'm³/ha',
    status: 'Tersedia',
    updatedAt: '2025-08-15'
  },
  {
    id: 'veg-6',
    kode: 'VEG-006',
    nama: 'Neolamarckia macrophylla (Jabon Merah)',
    famili: 'Rubiaceae',
    satuan: 'm³/ha',
    status: 'Tersedia',
    updatedAt: '2025-08-18'
  }
];

export const INITIAL_OBJEK_PAJAK: MasterObjekPajak[] = [
  {
    id: 'pjk-1',
    kode: 'PJK-001',
    nama: 'NJOP Bumi Sektor Perikanan Budidaya',
    jenis: 'Bumi dan Bangunan',
    dasarHukum: 'UU HKPD / Perda Badung No. 7/2023',
    status: 'Aktif',
    updatedAt: '2025-08-01'
  },
  {
    id: 'pjk-2',
    kode: 'PJK-002',
    nama: 'Retribusi Pemanfaatan Jasa Lingkungan Pesisir',
    jenis: 'Retribusi Daerah',
    dasarHukum: 'Perda Provinsi Bali No. 1/2020',
    status: 'Aktif',
    updatedAt: '2025-08-01'
  },
  {
    id: 'pjk-3',
    kode: 'PJK-003',
    nama: 'Pajak Pengambilan Air Tanah Estuari',
    jenis: 'Pajak Daerah',
    dasarHukum: 'Pergub Bali No. 12/2022',
    status: 'Aktif',
    updatedAt: '2025-08-05'
  }
];

export const INITIAL_DATA_PENDUKUNG: MasterDataPendukung[] = [
  {
    id: 'sup-1',
    kode: 'PAR-001',
    parameter: 'Biomass Carbon Conversion Factor',
    nilai: '0.47',
    satuan: 'ton C / ton biomasa',
    sumberReferensi: 'IPCC Wetlands Supplement (2013)',
    kategori: 'Regulating'
  },
  {
    id: 'sup-2',
    kode: 'PAR-002',
    parameter: 'Harga Shadow Karbon Domestik',
    nilai: '210.000',
    satuan: 'Rp / ton CO2e',
    sumberReferensi: 'Bursa Karbon Indonesia (IDXCarbon 2024)',
    kategori: 'Regulating'
  },
  {
    id: 'sup-3',
    kode: 'PAR-003',
    parameter: 'Biaya Penggantian Tanggul Beton Pesisir',
    nilai: '4.500.000',
    satuan: 'Rp / meter lari',
    sumberReferensi: 'Standar Biaya Umum Dinas PUPR Bali 2024',
    kategori: 'Regulating'
  },
  {
    id: 'sup-4',
    kode: 'PAR-004',
    parameter: 'Nilai Rekrutmen Nursery Ground',
    nilai: '19.052.268',
    satuan: 'Rp / ha / tahun',
    sumberReferensi: 'Riset Balai Riset Perikanan Budidaya',
    kategori: 'Supporting'
  }
];
