# Rancangan Frontend Peneliti - Sistem Valuasi Ekonomi PKSPL

Prototype & blueprint antarmuka frontend baru khusus untuk **Role PENELITI** pada aplikasi Sistem Valuasi Ekonomi PKSPL (Pusat Kajian Sumberdaya Pesisir dan Lautan - IPB University).

Project ini dibangun secara **independen dan standalone** tanpa backend (menggunakan reactive local state dan `localStorage` engine untuk mensimulasikan seluruh alur kerja penelitian).

---

## 🚀 Cara Menjalankan Project

Masuk ke direktori project:
```bash
cd "Rancangan Frontend Peneliti"
```

Jalankan mode development:
```bash
npm run dev
```
Buka peramban di `http://localhost:5173` (atau port yang tertera pada terminal).

Untuk membuat build produksi:
```bash
npm run build
```

---

## 🛠️ Teknologi yang Digunakan

- **React 18** (Functional components, custom hooks, context API)
- **TypeScript** (Strict static typing untuk domain valuasi ekonomi)
- **Vite 5** (Fast HMR & build bundler)
- **Tailwind CSS** (Design system profesional, whitespace cukup, tanpa capsule berlebihan)
- **React Router v6** (Nested routes, workflow stepper, and state preservation)
- **Leaflet & React Leaflet** (Peta spasial GIS, polygon tutupan lahan, layer toggle, drawer click)
- **Recharts** (Grafik analitik Direct vs Indirect value & perbandingan jasa ekosistem)
- **SheetJS (XLSX)** (Download template terikat konteks, parsing validasi import, dan ekspor multi-sheet 14 halaman)
- **Lucide React** (Icon set modern dan ringan)

---

## 🗺️ Struktur Navigasi & Routing

| Tahap | Rute URL | Deskripsi |
|---|---|---|
| **01. Proyek** | `/projects` | Daftar proyek penelitian, filter status, pencarian, dan modal buat proyek baru. |
| **02. Maps** | `/projects/:id/maps` | Peta GIS Leaflet, legenda warna ArcGIS, layer control, klik poligon ke drawer detail, dan modal upload SHP (ZIP). |
| **03. Data Master** | `/projects/:id/data-master` | Tab katalog terstruktur: Peta & SHP, Vegetasi, Objek Pajak, dan Data Pendukung. |
| **04. Identifikasi** | `/projects/:id/identification` | Pemilihan Area Tutupan Lahan, aktivasi 4 Jasa Ekosistem, dan pemilihan metode ilmiah yang sesuai konteks. |
| **05. Input Data** | `/projects/:id/input` | Workspace spreadsheet Excel-like dengan inline edit, formula kolom otomatis (read-only), autosave debounce, download template, dan modal import terikat konteks. |
| **06. Perhitungan** | `/projects/:id/calculation` | Agregasi Total Economic Value (TEV), kartu transparansi formula dan parameter. |
| **07. Analitik** | `/projects/:id/analytics` | Dashboard visual: Direct vs Indirect value (Donut), perbandingan 4 jasa ekosistem (Bar), dan nilai per area tutupan lahan. |
| **08. Review & Laporan** | `/projects/:id/review` | Evaluasi 10 indikator kelayakan proyek, ekspor 14-sheet Excel, dan pengajuan resmi ke Analyst. |
| **Cetak Laporan** | `/projects/:id/review/preview` | Tampilan formal cetak/PDF dokumen laporan valuasi dengan kop PKSPL IPB dan lembar tanda tangan. |

---

## ✨ Fitur Utama yang Berfungsi

1. **Workflow Stepper Sidebar**:
   - Terinspirasi AdminLTE modern (dapat diciutkan menjadi icon-only).
   - Indikator status tahapan dinamis: `✓` (selesai), `●` (aktif), `○` (belum).
2. **Interaksi Spasial Peta (Polygon Click-to-Detail)**:
   - Poligon tutupan lahan (Mangrove, Lamun, Terumbu Karang, Perairan) dapat diklik langsung di peta.
   - Membuka drawer samping kanan yang merinci Luas, Index, Jasa Ekosistem, dan Nilai Nominal.
   - Tombol `[Lihat Data Valuasi]` langsung membawa peneliti ke spreadsheet terkait tanpa mencari Index manual.
3. **Modal Upload SHP**:
   - Menerima arsip ZIP shapefile (.shp, .shx, .dbf, .prj).
   - Validasi CRS WGS 1984 dan geometri polygon.
4. **Spreadsheet Workspace Excel-Like**:
   - Pengetikan sel tabel langsung (inline cell editing).
   - Kolom **Total Nilai Ekonomi** bersifat *read-only* dan terkalkulasi otomatis berdasarkan formula:
     $$\text{Total} = \text{Produktivitas} \times \text{Luas Ha} \times \text{Harga Unit}$$
5. **Autosave Engine**:
   - Debounce 800ms setelah pengetikan selesai.
   - Status live: `Menyimpan...` $\rightarrow$ `✓ Tersimpan otomatis • 18:42`.
   - Data tersimpan di `localStorage` dan tidak hilang saat browser ditutup atau direfresh.
6. **Import Excel Terikat Konteks**:
   - Validasi ketat nama template (contoh: `Provisioning_MarketPrice_Flora.xlsx`).
   - Menolak jika template tidak cocok (misal file Regulating diunggah ke halaman Provisioning).
   - Dialog Preview Import menampilkan total baris, jumlah baris valid, dan rincian baris error.
   - Tombol uji coba simulasi disediakan untuk mempermudah demonstrasi.
7. **Ekspor Multi-Sheet Excel (14 Lembar Kerja)**:
   - Menghasilkan workbook asli `.xlsx` dengan 14 sheet: Ringkasan, Informasi Proyek, Data Peta & SHP, Vegetasi, Objek Pajak, Data Pendukung, Identifikasi, Provisioning Services, Regulating Services, Supporting Services, Cultural Services, Perhitungan, Analitik, Review.
8. **Alur Pengajuan & Revisi Analyst**:
   - Tombol `[Kirim ke Analyst]` hanya aktif jika 10 indikator checklist terpenuhi.
   - Modal konfirmasi perubahan status menjadi `Menunggu Review Analyst`.
   - Tombol simulasi "Revisi Analyst" untuk menguji skenario status `Perlu Perbaikan`.
   - Banner temuan analis muncul dengan tombol `[Lihat Data]` yang langsung melompat dan menyorot sel bermasalah di spreadsheet.

---

## 🔒 Catatan Integrasi Masa Depan (Bagian Mock yang Membutuhkan Backend)

Ketika prototype ini siap dihubungkan ke backend production:
1. **API Proyek**: Endpoint CRUD `/api/projects` untuk sinkronisasi proyek ke PostgreSQL/MySQL.
2. **GeoServer / PostGIS**: Layer SHP yang diunggah dapat diproses oleh service GIS backend untuk konversi GeoJSON dinamis dan penyimpanan layer spasial.
3. **Analyst Workflow Hub**: Role-based access control (RBAC) dan socket notifikasi real-time saat Analyst mengajukan revisi atau menyetujui laporan valuasi.
