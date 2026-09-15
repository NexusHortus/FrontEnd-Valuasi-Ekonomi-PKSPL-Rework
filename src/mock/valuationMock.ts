import { EcosystemServiceConfig } from '../types/valuation';
import { SpreadsheetRow } from '../types/spreadsheet';

export const ECOSYSTEM_SERVICES_CONFIG: EcosystemServiceConfig[] = [
  {
    id: 'provisioning',
    name: 'Provisioning Services',
    nameId: 'Jasa Penyediaan',
    description: 'Produk material dan komoditas fisik yang dipanen langsung dari ekosistem pesisir dan mangrove.',
    badgeColor: '#0e7490',
    badgeBg: '#e0f2fe',
    methods: [
      {
        id: 'market-price',
        name: 'Market Price',
        subtitle: 'Nilai Pasar Aktual',
        category: 'provisioning',
        description: 'Menilai barang/komoditas yang diperdagangkan secara riil di pasar berdasarkan harga transaksi dan produktivitas.',
        allowedBiota: ['flora', 'fauna'],
        formulaDescription: 'Total = Produktivitas (satuan/ha) × Luas (ha) × Harga Pasar per Unit'
      },
      {
        id: 'effect-production',
        name: 'Effect on Production',
        subtitle: 'Efek terhadap Produksi',
        category: 'provisioning',
        description: 'Mengukur fungsi ekosistem sebagai input perantara bagi output ekonomi perikanan atau tambak sekitar.',
        allowedBiota: ['flora', 'fauna'],
        formulaDescription: 'Total = Kuantitas Output Terpengaruh × (Harga Output - Biaya Input Tambahan)'
      }
    ]
  },
  {
    id: 'regulating',
    name: 'Regulating Services',
    nameId: 'Jasa Pengaturan',
    description: 'Manfaat penting yang diperoleh dari regulasi proses ekologis, penyerapan karbon, dan pencegahan bencana pesisir.',
    badgeColor: '#2563eb',
    badgeBg: '#dbeafe',
    methods: [
      {
        id: 'replacement-cost',
        name: 'Replacement Cost',
        subtitle: 'Biaya Penggantian / Bangunan Fisik',
        category: 'regulating',
        description: 'Menilai fungsi perlindungan pantai setara dengan biaya konstruksi seawall / pemecah gelombang buatan.',
        formulaDescription: 'Total = Panjang Garis Pantai / Unit Aset × Biaya Konstruksi Pengganti per Satuan'
      },
      {
        id: 'carbon-storage',
        name: 'Climate / Carbon Storage',
        subtitle: 'Cadangan & Penyerapan Karbon Biru',
        category: 'regulating',
        description: 'Menilai kapasitas biomasa mangrove dan padang lamun dalam mengunci emisi karbon (blue carbon).',
        formulaDescription: 'Total = Stok Karbon (ton C/ha) × Luas (ha) × Harga Shadow Karbon (Rp/ton)'
      },
      {
        id: 'avoided-cost',
        name: 'Avoided Cost',
        subtitle: 'Biaya Kerusakan yang Dihindari',
        category: 'regulating',
        description: 'Mengukur potensi kerugian ekonomi permukiman dan tambak yang terhindar dari abrasi dan banjir rob.',
        formulaDescription: 'Total = Probabilitas Bencana × Nilai Risiko Kerusakan Terhindar'
      },
      {
        id: 'hpm',
        name: 'HPM (Hedonic Pricing)',
        subtitle: 'Hedonic Pricing Method',
        category: 'regulating',
        description: 'Menilai kualitas lingkungan dari premi harga tanah atau properti residensial di sekitarnya.',
        formulaDescription: 'Total = Jumlah Unit Properti × Selisih Premi Kualitas Lingkungan'
      }
    ]
  },
  {
    id: 'supporting',
    name: 'Supporting Services',
    nameId: 'Jasa Pendukung',
    description: 'Layanan dasar alam yang menjamin keberlangsungan seluruh kehidupan biota dan fungsi ekosistem lainnya.',
    badgeColor: '#7c3aed',
    badgeBg: '#ede9fe',
    methods: [
      {
        id: 'nursery-ground',
        name: 'Habitat & Nursery Ground',
        subtitle: 'Tempat Asuhan & Pemijahan Biota',
        category: 'supporting',
        description: 'Menilai kontribusi akar mangrove sebagai tempat pembesaran larva udang, kepiting, dan ikan karang.',
        formulaDescription: 'Total = Luas Habitat (ha) × Kontribusi Nilai Rekrutmen Benih per Hektar'
      },
      {
        id: 'nutrient-cycling',
        name: 'Nutrient Cycling',
        subtitle: 'Siklus Nutrisi & Perangkap Sedimen',
        category: 'supporting',
        description: 'Menilai pengendapan lumpur kaya hara dan pencegahan kekeruhan air laut lepas pantai.',
        formulaDescription: 'Total = Laju Sedimentasi (ton/ha/th) × Nilai Konservasi Nutrisi Tanah'
      }
    ]
  },
  {
    id: 'cultural',
    name: 'Cultural Services',
    nameId: 'Jasa Budaya',
    description: 'Manfaat non-material seperti rekreasi ekowisata, riset pendidikan, estetika bentang alam, dan nilai spiritual.',
    badgeColor: '#d97706',
    badgeBg: '#fef3c7',
    methods: [
      {
        id: 'tcm',
        name: 'Travel Cost Method (TCM)',
        subtitle: 'Metode Biaya Perjalanan Wisatawan',
        category: 'cultural',
        description: 'Menilai surplus konsumen pengunjung kawasan ekowisata mangrove berdasarkan pengeluaran perjalanan.',
        formulaDescription: 'Total = Jumlah Kunjungan per Tahun × Rata-rata Biaya Perjalanan per Pengunjung'
      },
      {
        id: 'cvm',
        name: 'Contingent Valuation (CVM)',
        subtitle: 'Kesediaan Membayar (Willingness to Pay)',
        category: 'cultural',
        description: 'Mengukur kesediaan membayar masyarakat untuk melestarikan ekosistem melalui kuesioner hipotetis terstruktur.',
        formulaDescription: 'Total = Jumlah Populasi Terkait × Rata-rata WTP Tahunan'
      },
      {
        id: 'choice-experiment',
        name: 'Choice Experiment',
        subtitle: 'Eksperimen Pilihan Preferensi Masyarakat',
        category: 'cultural',
        description: 'Menilai preferensi masyarakat atas atribut kualitas jasa lingkungan secara simultan.',
        formulaDescription: 'Total = (Jumlah Responden × Nilai Marginal Atribut) - Biaya Skema'
      }
    ]
  }
];

export const INITIAL_SPREADSHEET_ROWS: SpreadsheetRow[] = [
  {
    id: 'ROW-001',
    no: 1,
    item: 'Cemara Laut (Casuarina equisetifolia)',
    produktivitas: 33.18,
    satuan: 'm³/ha',
    hargaUnit: 3231311,
    jumlah: 2649.75,
    luasHa: 79.86,
    totalNilai: 8562456960,
    source: 'Dinas Kehutanan Provinsi Bali',
    note: 'Inventarisasi tegakan zona barat',
    status: 'valid'
  },
  {
    id: 'ROW-002',
    no: 2,
    item: 'Sengon Laut (Falcataria moluccana)',
    produktivitas: 23.93,
    satuan: 'm³/ha',
    hargaUnit: 1090107,
    jumlah: 1911.05,
    luasHa: 79.86,
    totalNilai: 2083272580,
    source: 'Survei Lapangan Peneliti PKSPL',
    note: 'Tegakan penyangga sabuk hijau',
    status: 'valid'
  },
  {
    id: 'ROW-003',
    no: 3,
    item: 'Jabon Merah (Neolamarckia macrophylla)',
    produktivitas: 18.50,
    satuan: 'm³/ha',
    hargaUnit: 2098361,
    jumlah: 1477.41,
    luasHa: 79.86,
    totalNilai: 3099980000,
    source: 'Rencana Kelola Ekosistem 2024',
    note: 'Area rehabilitasi suplesi',
    status: 'valid'
  },
  {
    id: 'ROW-004',
    no: 4,
    item: 'Rhizophora apiculata (Bakau Minyak)',
    produktivitas: 45.20,
    satuan: 'm³/ha',
    hargaUnit: 1710000,
    jumlah: 3609.67,
    luasHa: 79.86,
    totalNilai: 6174588375,
    source: 'Data Inventarisasi Tegakan 2024',
    note: 'Spesies dominan terpadat',
    status: 'valid'
  }
];
