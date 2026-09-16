export interface ChatMessage {
  id: string;
  senderId: string; // 'superadmin' or user id
  senderName: string;
  text: string;
  timestamp: string;
  isOutgoing: boolean;
  status?: 'sent' | 'delivered' | 'read';
  attachment?: {
    name: string;
    type: 'file' | 'image' | 'shp';
    size: string;
  };
}

export interface Conversation {
  id: string;
  userId: string;
  userName: string;
  userRole: 'Peneliti' | 'Analyst';
  userAvatarBg: string;
  userInitials: string;
  isOnline: boolean;
  lastSeen?: string;
  projectCode?: string;
  projectName?: string;
  unreadCount: number;
  lastMessageSnippet: string;
  lastMessageTime: string;
  messages: ChatMessage[];
}

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    userId: 'usr-juandi',
    userName: 'Juandi For One',
    userRole: 'Peneliti',
    userAvatarBg: 'from-blue-600 to-indigo-600',
    userInitials: 'JF',
    isOnline: true,
    projectCode: 'PKS-994KY1',
    projectName: 'Revitalisasi Mangrove Teluk Benoa',
    unreadCount: 2,
    lastMessageSnippet: 'Saya sudah memperbaiki data valuasi mangrove...',
    lastMessageTime: '15:42',
    messages: [
      {
        id: 'msg-1-1',
        senderId: 'usr-juandi',
        senderName: 'Juandi For One',
        text: 'Selamat sore Pak, saya sudah memperbaiki data valuasi mangrove pada project saya.',
        timestamp: '15:30',
        isOutgoing: false,
      },
      {
        id: 'msg-1-2',
        senderId: 'superadmin',
        senderName: 'Daffa Arynt',
        text: 'Baik, saya akan cek kembali datanya.',
        timestamp: '15:35',
        isOutgoing: true,
        status: 'read',
      },
      {
        id: 'msg-1-3',
        senderId: 'usr-juandi',
        senderName: 'Juandi For One',
        text: 'Untuk data karbon, saya masih menggunakan referensi tahun 2024. Apakah diperbolehkan?',
        timestamp: '15:37',
        isOutgoing: false,
      },
      {
        id: 'msg-1-4',
        senderId: 'superadmin',
        senderName: 'Daffa Arynt',
        text: 'Silakan gunakan referensi yang paling relevan dan cantumkan sumber serta tahun datanya di kolom Sumber Data.',
        timestamp: '15:39',
        isOutgoing: true,
        status: 'read',
      },
      {
        id: 'msg-1-5',
        senderId: 'usr-juandi',
        senderName: 'Juandi For One',
        text: 'Baik, terima kasih Pak.',
        timestamp: '15:40',
        isOutgoing: false,
      },
      {
        id: 'msg-1-6',
        senderId: 'usr-juandi',
        senderName: 'Juandi For One',
        text: 'Saya sudah memperbaiki data valuasi mangrove dan poligon zona barat sekarang sudah terhubung dengan index IDX-001.',
        timestamp: '15:42',
        isOutgoing: false,
      },
    ],
  },
  {
    id: 'conv-2',
    userId: 'usr-guling',
    userName: 'Guling Putri Pamungkas',
    userRole: 'Analyst',
    userAvatarBg: 'from-amber-600 to-rose-600',
    userInitials: 'GP',
    isOnline: false,
    lastSeen: '14:30',
    projectCode: 'PKS-994KY1',
    projectName: 'Revitalisasi Mangrove Teluk Benoa',
    unreadCount: 1,
    lastMessageSnippet: 'Project Valuasi Teluk Benoa sudah saya review...',
    lastMessageTime: '14:28',
    messages: [
      {
        id: 'msg-2-1',
        senderId: 'superadmin',
        senderName: 'Daffa Arynt',
        text: 'Selamat siang Bu Guling, mohon informasi apakah pengajuan review project Teluk Benoa sudah sempat ditelaah?',
        timestamp: '13:10',
        isOutgoing: true,
        status: 'read',
      },
      {
        id: 'msg-2-2',
        senderId: 'usr-guling',
        senderName: 'Guling Putri Pamungkas',
        text: 'Siang Pak Daffa. Sedang saya telaah untuk indikator perlindungan fisik abrasi dan replacement cost tanggul.',
        timestamp: '13:45',
        isOutgoing: false,
      },
      {
        id: 'msg-2-3',
        senderId: 'usr-guling',
        senderName: 'Guling Putri Pamungkas',
        text: 'Project Valuasi Teluk Benoa sudah saya review, seluruh indikator nursery ground dan seawall sudah valid. Ada satu catatan kecil di harga unit flora.',
        timestamp: '14:28',
        isOutgoing: false,
      },
    ],
  },
  {
    id: 'conv-3',
    userId: 'usr-devino',
    userName: 'Devino Reski',
    userRole: 'Peneliti',
    userAvatarBg: 'from-emerald-600 to-teal-600',
    userInitials: 'DR',
    isOnline: true,
    projectCode: 'PKS-KKPRIV',
    projectName: 'Kajian Hutan Kota Jakarta',
    unreadCount: 1,
    lastMessageSnippet: 'Apakah template data karbon sudah diperbarui?',
    lastMessageTime: '13:51',
    messages: [
      {
        id: 'msg-3-1',
        senderId: 'usr-devino',
        senderName: 'Devino Reski',
        text: 'Selamat siang Pak Admin, izin bertanya terkait template excel impor.',
        timestamp: '13:42',
        isOutgoing: false,
      },
      {
        id: 'msg-3-2',
        senderId: 'usr-devino',
        senderName: 'Devino Reski',
        text: 'Apakah template data karbon sudah diperbarui? Kemarin saat coba upload muncul notifikasi ketidakcocokan template.',
        timestamp: '13:51',
        isOutgoing: false,
      },
    ],
  },
  {
    id: 'conv-4',
    userId: 'usr-arjoni',
    userName: 'Arjoni Rolanda Putra',
    userRole: 'Peneliti',
    userAvatarBg: 'from-purple-600 to-indigo-600',
    userInitials: 'AR',
    isOnline: false,
    lastSeen: 'Kemarin',
    projectCode: 'PKS-UW8J6F',
    projectName: 'Pemantauan Terumbu Karang Nusa Penida',
    unreadCount: 0,
    lastMessageSnippet: 'Terima kasih atas informasinya.',
    lastMessageTime: 'Kemarin',
    messages: [
      {
        id: 'msg-4-1',
        senderId: 'usr-arjoni',
        senderName: 'Arjoni Rolanda Putra',
        text: 'Halo Pak Daffa, untuk batas akhir finalisasi laporan valuasi terumbu karang Nusa Penida kapan ya?',
        timestamp: 'Kemarin 10:15',
        isOutgoing: false,
      },
      {
        id: 'msg-4-2',
        senderId: 'superadmin',
        senderName: 'Daffa Arynt',
        text: 'Halo Mas Arjoni. Jadwal pengajuan ke Analyst dibuka sampai akhir bulan ini ya.',
        timestamp: 'Kemarin 10:20',
        isOutgoing: true,
        status: 'read',
      },
      {
        id: 'msg-4-3',
        senderId: 'usr-arjoni',
        senderName: 'Arjoni Rolanda Putra',
        text: 'Terima kasih atas informasinya.',
        timestamp: 'Kemarin 10:22',
        isOutgoing: false,
      },
    ],
  },
  {
    id: 'conv-5',
    userId: 'usr-retno',
    userName: 'Dr. Ir. Retno Wulandari, M.Si.',
    userRole: 'Peneliti',
    userAvatarBg: 'from-cyan-600 to-blue-700',
    userInitials: 'RW',
    isOnline: true,
    projectCode: 'PKS-994KY1',
    projectName: 'Revitalisasi Mangrove Teluk Benoa',
    unreadCount: 0,
    lastMessageSnippet: 'Dokumen ekspor 13-sheet workbook sudah lengkap dan sesuai format.',
    lastMessageTime: 'Kemarin',
    messages: [
      {
        id: 'msg-5-1',
        senderId: 'usr-retno',
        senderName: 'Dr. Ir. Retno Wulandari, M.Si.',
        text: 'Selamat pagi Mas Daffa, kami telah memverifikasi seluruh kalkulasi TEV di tahap 07 bersama tim peneliti lapangan.',
        timestamp: 'Kemarin 09:10',
        isOutgoing: false,
      },
      {
        id: 'msg-5-2',
        senderId: 'superadmin',
        senderName: 'Daffa Arynt',
        text: 'Terima kasih infonya Bu Retno. Apakah dokumen cetak PDF dan ekspor Excel sudah dicek kembali?',
        timestamp: 'Kemarin 09:25',
        isOutgoing: true,
        status: 'read',
      },
      {
        id: 'msg-5-3',
        senderId: 'usr-retno',
        senderName: 'Dr. Ir. Retno Wulandari, M.Si.',
        text: 'Dokumen ekspor 13-sheet workbook sudah lengkap dan sesuai format. Kami siap untuk proses pengesahan.',
        timestamp: 'Kemarin 09:30',
        isOutgoing: false,
      },
    ],
  },
  {
    id: 'conv-6',
    userId: 'usr-hendra',
    userName: 'Dr. Hendra Kusuma, M.Econ',
    userRole: 'Analyst',
    userAvatarBg: 'from-orange-600 to-amber-600',
    userInitials: 'HK',
    isOnline: false,
    lastSeen: '2 Hari lalu',
    projectCode: 'PKS-R49A12',
    projectName: 'Valuasi Ekosistem Lamun Teluk Banten',
    unreadCount: 0,
    lastMessageSnippet: 'Catatan revisi parameter shadow price sudah dikirim ke peneliti.',
    lastMessageTime: '13 Sep',
    messages: [
      {
        id: 'msg-6-1',
        senderId: 'usr-hendra',
        senderName: 'Dr. Hendra Kusuma, M.Econ',
        text: 'Pak Daffa, saya telah mengecek proyek padang lamun Banten. Nilai unit price rekrutmen biota per ha perlu dicek ulang.',
        timestamp: '13 Sep 14:05',
        isOutgoing: false,
      },
      {
        id: 'msg-6-2',
        senderId: 'superadmin',
        senderName: 'Daffa Arynt',
        text: 'Siap Pak Hendra, status proyek telah kami ubah ke PERLU_PERBAIKAN agar peneliti dapat memperbarui tabel input.',
        timestamp: '13 Sep 14:15',
        isOutgoing: true,
        status: 'read',
      },
      {
        id: 'msg-6-3',
        senderId: 'usr-hendra',
        senderName: 'Dr. Hendra Kusuma, M.Econ',
        text: 'Catatan revisi parameter shadow price sudah dikirim ke peneliti.',
        timestamp: '13 Sep 14:20',
        isOutgoing: false,
      },
    ],
  },
];
