export type ActivityType =
  | 'Login'
  | 'Logout'
  | 'Create'
  | 'Update'
  | 'Delete'
  | 'Import'
  | 'Export'
  | 'Submit'
  | 'Review'
  | 'Approve'
  | 'Reject';

export type UserRole = 'Peneliti' | 'Analyst' | 'Super Admin';

export interface AuditRecord {
  id: string;
  timestamp: string; // ISO date string or formatted date
  timeDisplay: string;
  relativeTime: string;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  userAvatarBg: string;
  userInitials: string;
  activityType: ActivityType;
  actionTitle: string;
  actionDetail: string;
  projectCode?: string;
  projectName?: string;
  moduleName: string;
  ipAddress: string;
  userAgent: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  durationMs: number;
  changes?: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
}

export const AUDIT_SUMMARY_STATS = {
  todayActivities: 128,
  todayGrowth: '+14% dari kemarin',
  activeUsers: 37,
  activeUsersDesc: 'Melakukan aktivitas hari ini',
  dataChanges: 64,
  dataChangesDesc: 'Create / Update / Delete',
  importantActivities: 12,
  importantActivitiesDesc: 'Approval, submission, revision',
};

export const AUDIT_LOGS_DATA: AuditRecord[] = [
  {
    id: 'LOG-20260916-0128',
    timestamp: '2026-09-16T15:42:18',
    timeDisplay: '16 Sep 2026, 15:42',
    relativeTime: '15 Menit lalu',
    userName: 'Juandi For One',
    userEmail: 'juandi@apps.ipb.ac.id',
    userRole: 'Peneliti',
    userAvatarBg: 'from-blue-600 to-indigo-600',
    userInitials: 'JF',
    activityType: 'Update',
    actionTitle: 'Memperbarui formula harga unit flora mangrove',
    actionDetail: 'Mengubah nilai harga satuan Rhizophora apiculata pada tabel Provisioning Flora baris 1 zona barat.',
    projectCode: 'PKS-994KY1',
    projectName: 'Revitalisasi Mangrove Teluk Benoa',
    moduleName: 'Tahap 06 Data Valuasi',
    ipAddress: '182.253.14.82',
    userAgent: 'Chrome 128 (Windows 11)',
    status: 'SUCCESS',
    durationMs: 142,
    changes: [
      { field: 'hargaUnit', oldValue: 'Rp 2.800.000', newValue: 'Rp 3.231.311' },
      { field: 'totalNilai', oldValue: 'Rp 7.419.300.000', newValue: 'Rp 8.562.456.960' }
    ]
  },
  {
    id: 'LOG-20260916-0127',
    timestamp: '2026-09-16T15:20:05',
    timeDisplay: '16 Sep 2026, 15:20',
    relativeTime: '37 Menit lalu',
    userName: 'Dr. Ir. Retno Wulandari, M.Si.',
    userEmail: 'retno.w@apps.ipb.ac.id',
    userRole: 'Peneliti',
    userAvatarBg: 'from-cyan-600 to-blue-700',
    userInitials: 'RW',
    activityType: 'Submit',
    actionTitle: 'Mengajukan dokumen penelitian untuk review Analyst',
    actionDetail: 'Mengirimkan berkas final laporan valuasi ekonomi ke antrean verifikasi analis setelah 10 indikator checklist terpenuhi.',
    projectCode: 'PKS-994KY1',
    projectName: 'Revitalisasi Mangrove Teluk Benoa',
    moduleName: 'Tahap 09 Review & Laporan',
    ipAddress: '103.84.152.19',
    userAgent: 'Firefox 130 (macOS)',
    status: 'SUCCESS',
    durationMs: 380,
    changes: [
      { field: 'projectStatus', oldValue: 'DIKERJAKAN', newValue: 'MENUNGGU_ANALYST' }
    ]
  },
  {
    id: 'LOG-20260916-0126',
    timestamp: '2026-09-16T14:45:30',
    timeDisplay: '16 Sep 2026, 14:45',
    relativeTime: '1 Jam lalu',
    userName: 'Guling Putri Pamungkas',
    userEmail: 'guling.putri@pkspl.ipb.ac.id',
    userRole: 'Analyst',
    userAvatarBg: 'from-amber-600 to-rose-600',
    userInitials: 'GP',
    activityType: 'Review',
    actionTitle: 'Menyelesaikan telaah kelayakan indikator seawall',
    actionDetail: 'Memberikan verifikasi validasi pada metode Replacement Cost penahan abrasi zona barat Teluk Benoa.',
    projectCode: 'PKS-994KY1',
    projectName: 'Revitalisasi Mangrove Teluk Benoa',
    moduleName: 'Modul Telaah Analyst',
    ipAddress: '114.122.204.65',
    userAgent: 'Edge 128 (Windows 11)',
    status: 'SUCCESS',
    durationMs: 210,
    changes: [
      { field: 'regulatingStatus', oldValue: 'Pending', newValue: 'Verified' }
    ]
  },
  {
    id: 'LOG-20260916-0125',
    timestamp: '2026-09-16T13:51:12',
    timeDisplay: '16 Sep 2026, 13:51',
    relativeTime: '2 Jam lalu',
    userName: 'Devino Reski',
    userEmail: 'devino.reski@alumni.ipb.ac.id',
    userRole: 'Peneliti',
    userAvatarBg: 'from-emerald-600 to-teal-600',
    userInitials: 'DR',
    activityType: 'Import',
    actionTitle: 'Mengimpor lembar kerja spreadsheet data karbon',
    actionDetail: 'Mengunggah file Regulating_CarbonStorage.xlsx (12 baris data stok allometrik). Validasi skema berhasil.',
    projectCode: 'PKS-KKPRIV',
    projectName: 'Kajian Hutan Kota Jakarta',
    moduleName: 'Tahap 06 Data Valuasi',
    ipAddress: '180.252.88.112',
    userAgent: 'Chrome 128 (Windows 10)',
    status: 'SUCCESS',
    durationMs: 640,
    changes: [
      { field: 'importedRows', oldValue: '0 baris', newValue: '12 baris valid' }
    ]
  },
  {
    id: 'LOG-20260916-0124',
    timestamp: '2026-09-16T13:15:40',
    timeDisplay: '16 Sep 2026, 13:15',
    relativeTime: '2 Jam lalu',
    userName: 'Dr. Hendra Kusuma, M.Econ',
    userEmail: 'hendra.k@pkspl.ipb.ac.id',
    userRole: 'Analyst',
    userAvatarBg: 'from-orange-600 to-amber-600',
    userInitials: 'HK',
    activityType: 'Reject',
    actionTitle: 'Mengembalikan proyek dengan catatan perbaikan',
    actionDetail: 'Memberikan temuan analitik pada parameter shadow price rekrutmen larva biota. Status proyek diubah menjadi Perlu Perbaikan.',
    projectCode: 'PKS-R49A12',
    projectName: 'Valuasi Ekosistem Lamun Teluk Banten',
    moduleName: 'Modul Telaah Analyst',
    ipAddress: '103.84.152.44',
    userAgent: 'Chrome 128 (macOS)',
    status: 'WARNING',
    durationMs: 310,
    changes: [
      { field: 'projectStatus', oldValue: 'MENUNGGU_ANALYST', newValue: 'PERLU_PERBAIKAN' },
      { field: 'feedbackComment', oldValue: '-', newValue: 'Mohon periksa kembali acuan harga satuan biota per ha.' }
    ]
  },
  {
    id: 'LOG-20260916-0123',
    timestamp: '2026-09-16T12:02:18',
    timeDisplay: '16 Sep 2026, 12:02',
    relativeTime: '3 Jam lalu',
    userName: 'Daffa Arynt',
    userEmail: 'daffa.arynt@pkspl.ipb.ac.id',
    userRole: 'Super Admin',
    userAvatarBg: 'from-blue-600 to-indigo-600',
    userInitials: 'DA',
    activityType: 'Update',
    actionTitle: 'Memperbarui standar acuan harga shadow karbon',
    actionDetail: 'Menyesuaikan acuan IDXCarbon 2024 dari Rp 180.000/ton CO2e menjadi Rp 210.000/ton CO2e pada Master Data.',
    projectCode: undefined,
    projectName: 'Master Data Global',
    moduleName: 'Data Master: Parameter Pendukung',
    ipAddress: '10.10.1.25',
    userAgent: 'Chrome 128 (Windows 11)',
    status: 'SUCCESS',
    durationMs: 95,
    changes: [
      { field: 'PAR-002 Nilai', oldValue: '180.000 Rp/ton CO2e', newValue: '210.000 Rp/ton CO2e' }
    ]
  },
  {
    id: 'LOG-20260916-0122',
    timestamp: '2026-09-16T11:40:55',
    timeDisplay: '16 Sep 2026, 11:40',
    relativeTime: '4 Jam lalu',
    userName: 'Budi Santoso, S.Kel., M.Sc.',
    userEmail: 'budi.santoso@alumni.ipb.ac.id',
    userRole: 'Peneliti',
    userAvatarBg: 'from-teal-600 to-emerald-700',
    userInitials: 'BS',
    activityType: 'Create',
    actionTitle: 'Mengunggah Shapefile batas tutupan lahan baru',
    actionDetail: 'Mengunggah file Batas_Wetland_Jakarta_WGS84.zip. Terdeteksi 3 poligon baru dengan proyeksi EPSG:4326.',
    projectCode: 'PKS-KKPRIV',
    projectName: 'Kajian Hutan Kota Jakarta',
    moduleName: 'Tahap 02 Maps Spasial',
    ipAddress: '182.1.210.45',
    userAgent: 'Firefox 129 (Linux)',
    status: 'SUCCESS',
    durationMs: 1250,
    changes: [
      { field: 'layerAdded', oldValue: '-', newValue: 'Batas Tutupan Lahan Wetland (3 Polygons)' }
    ]
  },
  {
    id: 'LOG-20260916-0121',
    timestamp: '2026-09-16T10:18:22',
    timeDisplay: '16 Sep 2026, 10:18',
    relativeTime: '5 Jam lalu',
    userName: 'Prof. Dr. Wayan Sudarma, M.Env.',
    userEmail: 'wayan.s@unud.ac.id',
    userRole: 'Peneliti',
    userAvatarBg: 'from-blue-700 to-indigo-800',
    userInitials: 'WS',
    activityType: 'Export',
    actionTitle: 'Mengekspor laporan multi-sheet 13 workbook Excel',
    actionDetail: 'Mengunduh laporan komprehensif 13 lembar kerja proyek pemantauan terumbu karang Nusa Penida.',
    projectCode: 'PKS-UW8J6F',
    projectName: 'Pemantauan Terumbu Karang Nusa Penida',
    moduleName: 'Tahap 09 Review & Laporan',
    ipAddress: '111.94.75.12',
    userAgent: 'Safari 17.5 (macOS)',
    status: 'SUCCESS',
    durationMs: 820
  },
  {
    id: 'LOG-20260916-0120',
    timestamp: '2026-09-16T09:30:10',
    timeDisplay: '16 Sep 2026, 09:30',
    relativeTime: '6 Jam lalu',
    userName: 'Dr. Hendra Kusuma, M.Econ',
    userEmail: 'hendra.k@pkspl.ipb.ac.id',
    userRole: 'Analyst',
    userAvatarBg: 'from-orange-600 to-amber-600',
    userInitials: 'HK',
    activityType: 'Approve',
    actionTitle: 'Memberikan persetujuan akhir kelayakan valuasi',
    actionDetail: 'Menyetujui secara resmi seluruh 10 indikator kelayakan proyek Pemantauan Terumbu Karang Nusa Penida.',
    projectCode: 'PKS-UW8J6F',
    projectName: 'Pemantauan Terumbu Karang Nusa Penida',
    moduleName: 'Modul Telaah Analyst',
    ipAddress: '103.84.152.44',
    userAgent: 'Chrome 128 (macOS)',
    status: 'SUCCESS',
    durationMs: 440,
    changes: [
      { field: 'projectStatus', oldValue: 'MENUNGGU_ANALYST', newValue: 'SELESAI' }
    ]
  },
  {
    id: 'LOG-20260916-0119',
    timestamp: '2026-09-16T08:50:00',
    timeDisplay: '16 Sep 2026, 08:50',
    relativeTime: '7 Jam lalu',
    userName: 'Juandi For One',
    userEmail: 'juandi@apps.ipb.ac.id',
    userRole: 'Peneliti',
    userAvatarBg: 'from-blue-600 to-indigo-600',
    userInitials: 'JF',
    activityType: 'Login',
    actionTitle: 'Autentikasi sesi pengguna berhasil',
    actionDetail: 'Login berhasil via Single Sign-On (SSO IPB University) dari browser Chrome Windows.',
    projectCode: undefined,
    projectName: 'Sistem Autentikasi',
    moduleName: 'Security & Auth',
    ipAddress: '182.253.14.82',
    userAgent: 'Chrome 128 (Windows 11)',
    status: 'SUCCESS',
    durationMs: 85
  },
  {
    id: 'LOG-20260916-0118',
    timestamp: '2026-09-16T08:15:33',
    timeDisplay: '16 Sep 2026, 08:15',
    relativeTime: '7 Jam lalu',
    userName: 'Daffa Arynt',
    userEmail: 'daffa.arynt@pkspl.ipb.ac.id',
    userRole: 'Super Admin',
    userAvatarBg: 'from-blue-600 to-indigo-600',
    userInitials: 'DA',
    activityType: 'Login',
    actionTitle: 'Autentikasi Super Administrator berhasil',
    actionDetail: 'Login akun administratif dari jaringan internal PKSPL IPB.',
    projectCode: undefined,
    projectName: 'Portal Super Administrator',
    moduleName: 'Security & Auth',
    ipAddress: '10.10.1.25',
    userAgent: 'Chrome 128 (Windows 11)',
    status: 'SUCCESS',
    durationMs: 70
  },
  {
    id: 'LOG-20260915-0117',
    timestamp: '2026-09-15T16:40:11',
    timeDisplay: '15 Sep 2026, 16:40',
    relativeTime: 'Kemarin',
    userName: 'Maya Sartika, S.Kel',
    userEmail: 'maya.sartika@apps.ipb.ac.id',
    userRole: 'Peneliti',
    userAvatarBg: 'from-purple-600 to-pink-600',
    userInitials: 'MS',
    activityType: 'Create',
    actionTitle: 'Pendaftaran akun peneliti baru',
    actionDetail: 'Pengajuan akun peneliti baru dari Departemen Manajemen Sumberdaya Perairan IPB.',
    projectCode: undefined,
    projectName: 'Manajemen Pengguna',
    moduleName: 'Portal Registrasi User',
    ipAddress: '114.124.180.20',
    userAgent: 'Safari 17.4 (iOS)',
    status: 'SUCCESS',
    durationMs: 290
  },
  {
    id: 'LOG-20260915-0116',
    timestamp: '2026-09-15T14:10:45',
    timeDisplay: '15 Sep 2026, 14:10',
    relativeTime: 'Kemarin',
    userName: 'Arjoni Rolanda Putra',
    userEmail: 'arjoni.putra@unud.ac.id',
    userRole: 'Peneliti',
    userAvatarBg: 'from-purple-600 to-indigo-600',
    userInitials: 'AR',
    activityType: 'Delete',
    actionTitle: 'Menghapus baris observasi flora duplikat',
    actionDetail: 'Menghapus 1 baris input data flora Avicennia alba yang terduplikasi pada zona timur.',
    projectCode: 'PKS-UW8J6F',
    projectName: 'Pemantauan Terumbu Karang Nusa Penida',
    moduleName: 'Tahap 06 Data Valuasi',
    ipAddress: '180.251.102.50',
    userAgent: 'Edge 128 (Windows 10)',
    status: 'SUCCESS',
    durationMs: 115,
    changes: [
      { field: 'deletedRow', oldValue: 'Baris #4 (Avicennia alba)', newValue: '-' }
    ]
  },
  {
    id: 'LOG-20260915-0115',
    timestamp: '2026-09-15T11:25:30',
    timeDisplay: '15 Sep 2026, 11:25',
    relativeTime: 'Kemarin',
    userName: 'Siti Rahmawati, S.Pi., M.Sc.',
    userEmail: 'siti.rahma@dkp.jabarprov.go.id',
    userRole: 'Peneliti',
    userAvatarBg: 'from-pink-600 to-rose-600',
    userInitials: 'SR',
    activityType: 'Create',
    actionTitle: 'Membuat proyek penelitian valuasi baru',
    actionDetail: 'Inisialisasi proyek PKS-B78M90 untuk kawasan konservasi mangrove Muara Gembong, Bekasi.',
    projectCode: 'PKS-B78M90',
    projectName: 'Konservasi Mangrove Muara Gembong',
    moduleName: 'Tahap 01 Daftar Proyek',
    ipAddress: '103.111.201.8',
    userAgent: 'Chrome 127 (Windows 11)',
    status: 'SUCCESS',
    durationMs: 510,
    changes: [
      { field: 'projectCode', oldValue: '-', newValue: 'PKS-B78M90' }
    ]
  },
  {
    id: 'LOG-20260914-0114',
    timestamp: '2026-09-14T17:05:00',
    timeDisplay: '14 Sep 2026, 17:05',
    relativeTime: '2 Hari lalu',
    userName: 'Juandi For One',
    userEmail: 'juandi@apps.ipb.ac.id',
    userRole: 'Peneliti',
    userAvatarBg: 'from-blue-600 to-indigo-600',
    userInitials: 'JF',
    activityType: 'Logout',
    actionTitle: 'Sesi pengguna berakhir',
    actionDetail: 'Pengguna melakukan logout manual dari sistem.',
    projectCode: undefined,
    projectName: 'Sistem Autentikasi',
    moduleName: 'Security & Auth',
    ipAddress: '182.253.14.82',
    userAgent: 'Chrome 128 (Windows 11)',
    status: 'SUCCESS',
    durationMs: 40
  }
];
