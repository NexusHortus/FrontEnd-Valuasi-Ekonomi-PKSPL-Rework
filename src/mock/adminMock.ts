export interface AdminProjectItem {
  id: string;
  code: string;
  name: string;
  location: string;
  ecosystem: string;
  lead: string;
  areaHa: number;
  totalTev: number;
  status: 'DIKERJAKAN' | 'MENUNGGU_ANALYST' | 'PERLU_PERBAIKAN' | 'SELESAI' | 'DRAFT';
  updatedAt: string;
  createdAt: string;
}

export interface SystemActivityItem {
  id: string;
  userName: string;
  userRole: 'Peneliti' | 'Analyst' | 'Super Admin';
  userAvatar?: string;
  action: string;
  target: string;
  timestamp: string;
  category: 'project' | 'data' | 'user' | 'review' | 'system';
  badgeColor: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'warning' | 'success';
}

export interface SystemUserItem {
  id: string;
  name: string;
  email: string;
  role: 'Peneliti' | 'Analyst' | 'Super Admin';
  institution: string;
  status: 'Aktif' | 'Nonaktif';
  lastActive: string;
  assignedProjectsCount: number;
}

export const ADMIN_SYSTEM_STATS = {
  totalTevNominal: 142850000000, // Rp 142.85 Miliar
  totalTevGrowth: '+14.2%',
  totalProjects: 18,
  projectsActive: 8,
  projectsPendingReview: 4,
  projectsNeedsRevision: 2,
  projectsCompleted: 4,
  totalAreaHa: 1845.6,
  areaGrowth: '+8.5%',
  totalUsers: 38,
  usersPeneliti: 24,
  usersAnalyst: 10,
  usersAdmin: 4,
  systemUptime: '99.98%',
  lastBackup: 'Hari ini, 03:00 WIB'
};

export const ECOSYSTEM_VALUATION_DISTRIBUTION = [
  { name: 'Mangrove', value: 84500000000, valueFormatted: '84.5 M', percentage: 59.2, color: '#0F766E', areaHa: 980.4 },
  { name: 'Padang Lamun', value: 28200000000, valueFormatted: '28.2 M', percentage: 19.7, color: '#0284C7', areaHa: 410.2 },
  { name: 'Terumbu Karang', value: 22400000000, valueFormatted: '22.4 M', percentage: 15.7, color: '#2563EB', areaHa: 285.0 },
  { name: 'Estuari & Perairan', value: 7750000000, valueFormatted: '7.75 M', percentage: 5.4, color: '#6366F1', areaHa: 170.0 },
];

export const PROJECT_STATUS_BREAKDOWN = [
  { name: 'Dikerjakan', count: 8, color: '#2563EB', percentage: 44.4 },
  { name: 'Menunggu Review', count: 4, color: '#EAB308', percentage: 22.2 },
  { name: 'Perlu Perbaikan', count: 2, color: '#E11D48', percentage: 11.1 },
  { name: 'Selesai', count: 4, color: '#10B981', percentage: 22.2 },
];

export const MONTHLY_TREND_DATA = [
  { month: 'Apr', proyekBaru: 2, proyekSelesai: 1, akumulasiTevMiliar: 98.4 },
  { month: 'Mei', proyekBaru: 3, proyekSelesai: 2, akumulasiTevMiliar: 108.2 },
  { month: 'Jun', proyekBaru: 4, proyekSelesai: 2, akumulasiTevMiliar: 119.5 },
  { month: 'Jul', proyekBaru: 2, proyekSelesai: 1, akumulasiTevMiliar: 125.8 },
  { month: 'Agt', proyekBaru: 5, proyekSelesai: 3, akumulasiTevMiliar: 136.0 },
  { month: 'Sep', proyekBaru: 2, proyekSelesai: 1, akumulasiTevMiliar: 142.85 },
];

export const ADMIN_PROJECTS_LIST: AdminProjectItem[] = [
  {
    id: 'PKS-994KY1',
    code: 'PKS-994KY1',
    name: 'Revitalisasi Mangrove Teluk Benoa',
    location: 'Badung & Denpasar, Bali',
    ecosystem: 'Mangrove & Estuari',
    lead: 'Dr. Ir. Retno Wulandari, M.Si.',
    areaHa: 236.46,
    totalTev: 48949677785,
    status: 'MENUNGGU_ANALYST',
    updatedAt: '15 Menit lalu',
    createdAt: '2025-08-10'
  },
  {
    id: 'PKS-KKPRIV',
    code: 'PKS-KKPRIV',
    name: 'Kajian Hutan Kota & Wetland Jakarta',
    location: 'Pantai Indah Kapuk, DKI Jakarta',
    ecosystem: 'Urban Wetland',
    lead: 'Budi Santoso, S.Kel., M.Sc.',
    areaHa: 145.20,
    totalTev: 18500000000,
    status: 'DIKERJAKAN',
    updatedAt: '2 Jam lalu',
    createdAt: '2025-09-01'
  },
  {
    id: 'PKS-UW8J6F',
    code: 'PKS-UW8J6F',
    name: 'Pemantauan Terumbu Karang Nusa Penida',
    location: 'Klungkung, Bali',
    ecosystem: 'Terumbu Karang & Lamun',
    lead: 'Prof. Dr. Wayan Sudarma, M.Env.',
    areaHa: 380.00,
    totalTev: 34200000000,
    status: 'SELESAI',
    updatedAt: '1 Hari lalu',
    createdAt: '2024-11-15'
  },
  {
    id: 'PKS-R49A12',
    code: 'PKS-R49A12',
    name: 'Valuasi Ekosistem Lamun Teluk Banten',
    location: 'Serang, Banten',
    ecosystem: 'Padang Lamun',
    lead: 'Dr. Ahmad Fauzi, M.Si.',
    areaHa: 190.50,
    totalTev: 16800000000,
    status: 'PERLU_PERBAIKAN',
    updatedAt: '3 Jam lalu',
    createdAt: '2025-07-22'
  },
  {
    id: 'PKS-B78M90',
    code: 'PKS-B78M90',
    name: 'Konservasi Mangrove Muara Gembong',
    location: 'Bekasi, Jawa Barat',
    ecosystem: 'Mangrove Primer',
    lead: 'Siti Rahmawati, S.Pi., M.Sc.',
    areaHa: 310.80,
    totalTev: 24400000000,
    status: 'DIKERJAKAN',
    updatedAt: '5 Jam lalu',
    createdAt: '2025-08-04'
  }
];

export const ADMIN_ACTIVITY_LOGS: SystemActivityItem[] = [
  {
    id: 'ACT-01',
    userName: 'Dr. Ir. Retno Wulandari',
    userRole: 'Peneliti',
    action: 'Mengajukan dokumen final proyek',
    target: 'Revitalisasi Mangrove Teluk Benoa (PKS-994KY1)',
    timestamp: '15 Menit lalu',
    category: 'review',
    badgeColor: 'bg-amber-100 text-amber-800'
  },
  {
    id: 'ACT-02',
    userName: 'Dr. Hendra Kusuma',
    userRole: 'Analyst',
    action: 'Memberikan catatan revisi indikator harga pasar',
    target: 'Valuasi Ekosistem Lamun Teluk Banten (PKS-R49A12)',
    timestamp: '3 Jam lalu',
    category: 'review',
    badgeColor: 'bg-rose-100 text-rose-800'
  },
  {
    id: 'ACT-03',
    userName: 'Budi Santoso',
    userRole: 'Peneliti',
    action: 'Mengunggah file Shapefile tutupan lahan (.ZIP)',
    target: 'Kajian Hutan Kota Jakarta (PKS-KKPRIV)',
    timestamp: '5 Jam lalu',
    category: 'data',
    badgeColor: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'ACT-04',
    userName: 'Daffa Arynt',
    userRole: 'Super Admin',
    action: 'Memperbarui parameter konversi karbon (IPCC 2024)',
    target: 'Katalog Data Master Global',
    timestamp: 'Kemarin, 16:40',
    category: 'system',
    badgeColor: 'bg-emerald-100 text-emerald-800'
  },
  {
    id: 'ACT-05',
    userName: 'Maya Sartika, S.Kel',
    userRole: 'Peneliti',
    action: 'Mendaftar akun peneliti baru & verifikasi IPB',
    target: 'Manajemen Pengguna',
    timestamp: 'Kemarin, 11:20',
    category: 'user',
    badgeColor: 'bg-purple-100 text-purple-800'
  }
];

export const ADMIN_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 'NOTIF-01',
    title: 'Pengajuan Review Proyek',
    message: 'Proyek PKS-994KY1 diajukan oleh Dr. Retno Wulandari untuk verifikasi analis.',
    timestamp: '15 Menit lalu',
    read: false,
    type: 'info'
  },
  {
    id: 'NOTIF-02',
    title: 'Catatan Revisi Analyst',
    message: 'Analyst mengirimkan 1 catatan penting pada proyek PKS-R49A12.',
    timestamp: '3 Jam lalu',
    read: false,
    type: 'warning'
  },
  {
    id: 'NOTIF-03',
    title: 'Pendaftaran Akun Baru',
    message: '1 peneliti baru (Maya Sartika) memerlukan persetujuan aktivasi hak akses.',
    timestamp: 'Kemarin',
    read: true,
    type: 'success'
  }
];

export const ADMIN_USERS_LIST: SystemUserItem[] = [
  {
    id: 'USR-01',
    name: 'Daffa Arynt',
    email: 'daffa.arynt@pkspl.ipb.ac.id',
    role: 'Super Admin',
    institution: 'PKSPL IPB University',
    status: 'Aktif',
    lastActive: 'Sedang Online',
    assignedProjectsCount: 18
  },
  {
    id: 'USR-02',
    name: 'Dr. Ir. Retno Wulandari, M.Si.',
    email: 'retno.w@apps.ipb.ac.id',
    role: 'Peneliti',
    institution: 'PKSPL IPB / FPIK IPB',
    status: 'Aktif',
    lastActive: '15 Menit lalu',
    assignedProjectsCount: 3
  },
  {
    id: 'USR-03',
    name: 'Dr. Hendra Kusuma, M.Econ',
    email: 'hendra.k@pkspl.ipb.ac.id',
    role: 'Analyst',
    institution: 'Departemen Ekonomi Sumberdaya IPB',
    status: 'Aktif',
    lastActive: '2 Jam lalu',
    assignedProjectsCount: 7
  },
  {
    id: 'USR-04',
    name: 'Budi Santoso, S.Kel., M.Sc.',
    email: 'budi.santoso@alumni.ipb.ac.id',
    role: 'Peneliti',
    institution: 'PKSPL IPB',
    status: 'Aktif',
    lastActive: '5 Jam lalu',
    assignedProjectsCount: 2
  },
  {
    id: 'USR-05',
    name: 'Prof. Dr. Wayan Sudarma, M.Env.',
    email: 'wayan.s@unud.ac.id',
    role: 'Peneliti',
    institution: 'Konsorsium Riset Pesisir Bali',
    status: 'Aktif',
    lastActive: '1 Hari lalu',
    assignedProjectsCount: 4
  }
];
