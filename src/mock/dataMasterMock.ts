// =============================================================================
// Data Master Mock — Valuasi Ekonomi Ekosistem Laut
// Sesuai Skema Database (Tanpa atribut jenis_data)
// =============================================================================

// ─── Shared Types ────────────────────────────────────────────────────────────

export type UsageStatus =
  | { used: false }
  | { used: true; indexCode: string; indexName: string };

export interface DaerahOption {
  id: string;
  label: string;
}

export interface EkosistemOption {
  id: string;
  label: string;
}

// ─── Filter Options ──────────────────────────────────────────────────────────

export const DAERAH_OPTIONS: DaerahOption[] = [
  { id: 'jakarta', label: 'Jakarta' },
  { id: 'kepulauan-seribu', label: 'Kepulauan Seribu' },
  { id: 'nusa-penida', label: 'Nusa Penida' },
  { id: 'badung', label: 'Kabupaten Badung' },
];

export const EKOSISTEM_OPTIONS: EkosistemOption[] = [
  { id: 'lamun', label: 'Lamun' },
  { id: 'mangrove', label: 'Mangrove' },
  { id: 'terumbu-karang', label: 'Terumbu Karang' },
  { id: 'estuari', label: 'Estuari' },
];

// ─── TAB 1: PROVISIONING ────────────────────────────────────────────────────

export interface ProvisioningItem {
  id: string;
  namaIndonesia: string;
  namaLatin: string;
  namaDaerah: string;
  daerah: string;
  daerahId: string;
  ekosistemId: string;
  usage: UsageStatus;
}

export const PROVISIONING_DATA: ProvisioningItem[] = [
  {
    id: 'prov-1',
    namaIndonesia: 'Lamun Tunjung',
    namaLatin: 'Enhalus acoroides',
    namaDaerah: 'Lamun Tunjung',
    daerah: 'Jakarta Utara',
    daerahId: 'jakarta',
    ekosistemId: 'lamun',
    usage: { used: true, indexCode: 'Index 01', indexName: 'Lamun' },
  },
  {
    id: 'prov-2',
    namaIndonesia: 'Lamun Bulat',
    namaLatin: 'Thalassia hemprichii',
    namaDaerah: 'Lamun Sisir',
    daerah: 'Kepulauan Seribu',
    daerahId: 'jakarta',
    ekosistemId: 'lamun',
    usage: { used: true, indexCode: 'Index 02', indexName: 'Padang Lamun' },
  },
  {
    id: 'prov-3',
    namaIndonesia: 'Lamun Jarum',
    namaLatin: 'Syringodium isoetifolium',
    namaDaerah: 'Lamun Jarum',
    daerah: 'Kepulauan Seribu',
    daerahId: 'jakarta',
    ekosistemId: 'lamun',
    usage: { used: false },
  },
  {
    id: 'prov-4',
    namaIndonesia: 'Lamun Berduri',
    namaLatin: 'Halophila ovalis',
    namaDaerah: 'Lamun Sendok',
    daerah: 'Jakarta Utara',
    daerahId: 'jakarta',
    ekosistemId: 'lamun',
    usage: { used: false },
  },
  {
    id: 'prov-5',
    namaIndonesia: 'Penyu Hijau',
    namaLatin: 'Chelonia mydas',
    namaDaerah: 'Penyu',
    daerah: 'Kepulauan Seribu',
    daerahId: 'jakarta',
    ekosistemId: 'lamun',
    usage: { used: false },
  },
  {
    id: 'prov-6',
    namaIndonesia: 'Dugong',
    namaLatin: 'Dugong dugon',
    namaDaerah: 'Duyung',
    daerah: 'Kepulauan Seribu',
    daerahId: 'jakarta',
    ekosistemId: 'lamun',
    usage: { used: true, indexCode: 'Index 01', indexName: 'Lamun' },
  },
  {
    id: 'prov-7',
    namaIndonesia: 'Teripang Pasir',
    namaLatin: 'Holothuria scabra',
    namaDaerah: 'Teripang',
    daerah: 'Jakarta Utara',
    daerahId: 'jakarta',
    ekosistemId: 'lamun',
    usage: { used: false },
  },
  {
    id: 'prov-8',
    namaIndonesia: 'Bakau Minyak',
    namaLatin: 'Rhizophora apiculata',
    namaDaerah: 'Bakau',
    daerah: 'Jakarta Utara',
    daerahId: 'jakarta',
    ekosistemId: 'mangrove',
    usage: { used: true, indexCode: 'Index 03', indexName: 'Mangrove' },
  },
  {
    id: 'prov-9',
    namaIndonesia: 'Api-api Putih',
    namaLatin: 'Avicennia marina',
    namaDaerah: 'Api-api',
    daerah: 'Kepulauan Seribu',
    daerahId: 'jakarta',
    ekosistemId: 'mangrove',
    usage: { used: false },
  },
  {
    id: 'prov-10',
    namaIndonesia: 'Lamun Pita',
    namaLatin: 'Cymodocea rotundata',
    namaDaerah: 'Lamun Pita',
    daerah: 'Nusa Penida',
    daerahId: 'nusa-penida',
    ekosistemId: 'lamun',
    usage: { used: false },
  },
];

// ─── TAB 2: REGULATING ──────────────────────────────────────────────────────

export interface RegulatingItem {
  id: string;
  namaParameter: string;
  daerah: string;
  daerahId: string;
  ekosistemId: string;
  usage: UsageStatus;
}

export const REGULATING_DATA: RegulatingItem[] = [
  {
    id: 'reg-1',
    namaParameter: 'Pencegah erosi',
    daerah: 'Jakarta Utara',
    daerahId: 'jakarta',
    ekosistemId: 'lamun',
    usage: { used: true, indexCode: 'Index 01', indexName: 'Lamun' },
  },
  {
    id: 'reg-2',
    namaParameter: 'Penyerapan air',
    daerah: 'Kepulauan Seribu',
    daerahId: 'jakarta',
    ekosistemId: 'lamun',
    usage: { used: false },
  },
  {
    id: 'reg-3',
    namaParameter: 'Serasah',
    daerah: 'Jakarta Utara',
    daerahId: 'jakarta',
    ekosistemId: 'lamun',
    usage: { used: true, indexCode: 'Index 01', indexName: 'Lamun' },
  },
  {
    id: 'reg-4',
    namaParameter: 'Penghasil Oksigen',
    daerah: 'Kepulauan Seribu',
    daerahId: 'jakarta',
    ekosistemId: 'lamun',
    usage: { used: false },
  },
  {
    id: 'reg-5',
    namaParameter: 'Penyerapan CO2 (Carbon Stock)',
    daerah: 'Jakarta Utara',
    daerahId: 'jakarta',
    ekosistemId: 'lamun',
    usage: { used: true, indexCode: 'Index 02', indexName: 'Padang Lamun' },
  },
  {
    id: 'reg-6',
    namaParameter: 'Laju Sekuestrasi Karbon Lamun',
    daerah: 'Jakarta Utara',
    daerahId: 'jakarta',
    ekosistemId: 'lamun',
    usage: { used: false },
  },
  {
    id: 'reg-7',
    namaParameter: 'Pengolahan Limbah & Filtrasi Nitrogen',
    daerah: 'Kepulauan Seribu',
    daerahId: 'jakarta',
    ekosistemId: 'lamun',
    usage: { used: false },
  },
  {
    id: 'reg-8',
    namaParameter: 'Pencegah erosi',
    daerah: 'Jakarta Utara',
    daerahId: 'jakarta',
    ekosistemId: 'mangrove',
    usage: { used: true, indexCode: 'Index 03', indexName: 'Mangrove' },
  },
];

// ─── TAB 3: SUPPORTING ─────────────────────────────────────────────────────

export interface SupportingItem {
  id: string;
  klasifikasi: string; // Misal: "Habitat • Reptil", "Habitat • Burung", "Habitat • Mamalia", "Nursery Ground", "Pembentukan Tanah", "Biodiversitas"
  daerah: string;
  daerahId: string;
  ekosistemId: string;
  usage: UsageStatus;
}

export const SUPPORTING_DATA: SupportingItem[] = [
  // ── Habitat: Reptil
  {
    id: 'sup-1',
    klasifikasi: 'Habitat • Reptil',
    daerah: 'Kepulauan Seribu',
    daerahId: 'jakarta',
    ekosistemId: 'lamun',
    usage: { used: true, indexCode: 'Index 01', indexName: 'Lamun' },
  },
  {
    id: 'sup-2',
    klasifikasi: 'Habitat • Reptil',
    daerah: 'Kepulauan Seribu',
    daerahId: 'jakarta',
    ekosistemId: 'lamun',
    usage: { used: false },
  },
  // ── Habitat: Burung
  {
    id: 'sup-3',
    klasifikasi: 'Habitat • Burung',
    daerah: 'Jakarta Utara',
    daerahId: 'jakarta',
    ekosistemId: 'lamun',
    usage: { used: false },
  },
  {
    id: 'sup-4',
    klasifikasi: 'Habitat • Burung',
    daerah: 'Kepulauan Seribu',
    daerahId: 'jakarta',
    ekosistemId: 'lamun',
    usage: { used: true, indexCode: 'Index 02', indexName: 'Padang Lamun' },
  },
  // ── Habitat: Mamalia
  {
    id: 'sup-5',
    klasifikasi: 'Habitat • Mamalia',
    daerah: 'Kepulauan Seribu',
    daerahId: 'jakarta',
    ekosistemId: 'lamun',
    usage: { used: true, indexCode: 'Index 01', indexName: 'Lamun' },
  },
  // ── Nursery Ground
  {
    id: 'sup-6',
    klasifikasi: 'Nursery Ground',
    daerah: 'Kepulauan Seribu',
    daerahId: 'jakarta',
    ekosistemId: 'lamun',
    usage: { used: false },
  },
  {
    id: 'sup-7',
    klasifikasi: 'Nursery Ground',
    daerah: 'Jakarta Utara',
    daerahId: 'jakarta',
    ekosistemId: 'lamun',
    usage: { used: true, indexCode: 'Index 01', indexName: 'Lamun' },
  },
  // ── Pembentukan Tanah
  {
    id: 'sup-8',
    klasifikasi: 'Pembentukan Tanah',
    daerah: 'Jakarta Utara',
    daerahId: 'jakarta',
    ekosistemId: 'lamun',
    usage: { used: false },
  },
  {
    id: 'sup-9',
    klasifikasi: 'Pembentukan Tanah',
    daerah: 'Kepulauan Seribu',
    daerahId: 'jakarta',
    ekosistemId: 'lamun',
    usage: { used: true, indexCode: 'Index 02', indexName: 'Padang Lamun' },
  },
  // ── Biodiversitas
  {
    id: 'sup-10',
    klasifikasi: 'Biodiversitas',
    daerah: 'Jakarta Utara',
    daerahId: 'jakarta',
    ekosistemId: 'lamun',
    usage: { used: true, indexCode: 'Index 01', indexName: 'Lamun' },
  },
  {
    id: 'sup-11',
    klasifikasi: 'Biodiversitas',
    daerah: 'Kepulauan Seribu',
    daerahId: 'jakarta',
    ekosistemId: 'lamun',
    usage: { used: false },
  },
];

// ─── TAB 4: CULTURAL ────────────────────────────────────────────────────────

export interface CulturalItem {
  id: string;
  namaObjek: string;
  deskripsi: string;
  daerah: string;
  daerahId: string;
  ekosistemId: string;
  usage: UsageStatus;
}

export const CULTURAL_DATA: CulturalItem[] = [
  {
    id: 'cul-1',
    namaObjek: 'Snorkeling Padang Lamun',
    deskripsi: 'Area snorkeling populer di padang lamun',
    daerah: 'Kepulauan Seribu',
    daerahId: 'jakarta',
    ekosistemId: 'lamun',
    usage: { used: true, indexCode: 'Index 01', indexName: 'Lamun' },
  },
  {
    id: 'cul-2',
    namaObjek: 'Diving Terumbu Karang',
    deskripsi: 'Spot penyelaman terumbu karang utama',
    daerah: 'Kepulauan Seribu',
    daerahId: 'jakarta',
    ekosistemId: 'lamun',
    usage: { used: false },
  },
  {
    id: 'cul-3',
    namaObjek: 'Stasiun Riset Lamun LIPI',
    deskripsi: 'Stasiun penelitian ekosistem lamun',
    daerah: 'Jakarta Utara',
    daerahId: 'jakarta',
    ekosistemId: 'lamun',
    usage: { used: true, indexCode: 'Index 02', indexName: 'Padang Lamun' },
  },
  {
    id: 'cul-4',
    namaObjek: 'Laboratorium Kelautan UI',
    deskripsi: 'Fasilitas pendidikan kelautan universitas',
    daerah: 'Jakarta Utara',
    daerahId: 'jakarta',
    ekosistemId: 'lamun',
    usage: { used: false },
  },
  {
    id: 'cul-5',
    namaObjek: 'Tradisi Nelayan Suku Betawi',
    deskripsi: 'Kearifan lokal masyarakat pesisir',
    daerah: 'Jakarta Utara',
    daerahId: 'jakarta',
    ekosistemId: 'lamun',
    usage: { used: false },
  },
  {
    id: 'cul-6',
    namaObjek: 'Panorama Padang Lamun',
    deskripsi: 'Pemandangan estetika area lamun',
    daerah: 'Kepulauan Seribu',
    daerahId: 'jakarta',
    ekosistemId: 'lamun',
    usage: { used: true, indexCode: 'Index 01', indexName: 'Lamun' },
  },
  {
    id: 'cul-7',
    namaObjek: 'Kayaking Mangrove Trail',
    deskripsi: 'Wisata kayak hutan mangrove',
    daerah: 'Jakarta Utara',
    daerahId: 'jakarta',
    ekosistemId: 'mangrove',
    usage: { used: false },
  },
  {
    id: 'cul-8',
    namaObjek: 'Sunset Point Nusa Penida',
    deskripsi: 'Titik panorama padang lamun saat senja',
    daerah: 'Nusa Penida',
    daerahId: 'nusa-penida',
    ekosistemId: 'lamun',
    usage: { used: false },
  },
];
