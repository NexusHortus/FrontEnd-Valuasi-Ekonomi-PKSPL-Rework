import React from 'react';
import { Database, Plus, Search, BookOpen, Layers, Receipt, Trees, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminMasterDataPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 text-slate-800">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 md:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <span className="text-blue-600">Super Admin</span>
            <span>•</span>
            <span>Katalog Master Global</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5 mt-0.5">
            <Database className="w-6 h-6 text-blue-600" />
            <span>Master Data Global</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Standardisasi data referensi nasional: taksonomi vegetasi ekosistem, parameter shadow price, dan regulasi objek pajak pesisir.
          </p>
        </div>

        <button
          onClick={() => alert('Fitur Tambah Master Data baru akan tersedia di rilis berikutnya.')}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Referensi Baru</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Taksonomi Vegetasi</span>
            <Trees className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">42 Spesies</div>
          <p className="text-[11px] text-slate-500">Mangrove, lamun, alga terdaftar</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Objek Pajak & Retribusi</span>
            <Receipt className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">18 Regulasi</div>
          <p className="text-[11px] text-slate-500">NJOP, perda provinsi, dan retribusi</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Parameter Konversi</span>
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">14 Nilai Baku</div>
          <p className="text-[11px] text-slate-500">IPCC Karbon, faktor biomassa</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Layer Batas Wilayah</span>
            <Layers className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">6 Peta Spasial</div>
          <p className="text-[11px] text-slate-500">CRS EPSG:4326 WGS 84 terverifikasi</p>
        </div>
      </div>

      {/* Notice Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-xs text-blue-900 flex items-start gap-3">
        <Database className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-sm">Halaman Manajemen Penuh Master Data (Coming Soon)</div>
          <p className="text-blue-800 leading-relaxed">
            Halaman ini disiapkan untuk pengelolaan CRUD parameter global sistem. Saat ini fokus implementasi berada pada Super Admin Dashboard dan navigasi sidebar.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="text-blue-700 hover:text-blue-900 font-bold underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Kembali ke Dashboard Super Admin</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMasterDataPage;
