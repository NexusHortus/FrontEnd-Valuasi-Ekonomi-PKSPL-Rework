import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import {
  INITIAL_VEGETASI,
  INITIAL_OBJEK_PAJAK,
  INITIAL_DATA_PENDUKUNG,
  MasterVegetasi,
  MasterObjekPajak,
  MasterDataPendukung
} from '../mock/masterMock';
import {
  Database,
  Layers,
  Trees,
  Receipt,
  BookOpen,
  Search,
  Plus,
  Trash2,
  Edit2,
  ArrowRight
} from 'lucide-react';

type TabType = 'peta' | 'vegetasi' | 'pajak' | 'pendukung';

export const DataMasterPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeProject, activeProjectId, layers } = useProject();
  const [activeTab, setActiveTab] = useState<TabType>('peta');
  const [searchTerm, setSearchTerm] = useState('');

  const [vegetasiList] = useState<MasterVegetasi[]>(INITIAL_VEGETASI);
  const [pajakList] = useState<MasterObjekPajak[]>(INITIAL_OBJEK_PAJAK);
  const [pendukungList] = useState<MasterDataPendukung[]>(INITIAL_DATA_PENDUKUNG);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          <span>Tahap 04</span>
          <span>•</span>
          <span className="text-blue-600">Standardisasi Referensi</span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5 mt-0.5">
          <Database className="w-6 h-6 text-blue-600" />
          <span>Data Master</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Katalog layer spasial, taksonomi vegetasi ekosistem, objek pajak penilaian, dan parameter pendukung valuasi.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('peta')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'peta'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Peta & SHP ({layers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('vegetasi')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'vegetasi'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <Trees className="w-4 h-4" />
          <span>Vegetasi ({vegetasiList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pajak')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'pajak'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Objek Pajak ({pajakList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pendukung')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'pendukung'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Data Pendukung ({pendukungList.length})</span>
        </button>
      </div>

      {/* Tab Content 1: Peta & SHP */}
      {activeTab === 'peta' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Daftar Layer Spasial Terdaftar
            </h3>
            <span className="text-xs text-slate-500">
              Proyek: <strong>{activeProject?.name}</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 text-[11px] uppercase">
                  <th className="py-2.5 px-4 w-12 text-center">No</th>
                  <th className="py-2.5 px-4">Nama Layer</th>
                  <th className="py-2.5 px-4">Tipe Fitur</th>
                  <th className="py-2.5 px-4 text-center">Jumlah Feature</th>
                  <th className="py-2.5 px-4">Sistem Proyeksi (CRS)</th>
                  <th className="py-2.5 px-4">Terakhir Diperbarui</th>
                  <th className="py-2.5 px-4 text-center w-20">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {layers.map((layer, idx) => (
                  <tr key={layer.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 text-center font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: layer.color }}></span>
                      <span>{layer.name}</span>
                    </td>
                    <td className="py-3 px-4 capitalize text-slate-600">{layer.type}</td>
                    <td className="py-3 px-4 text-center font-mono font-medium">{layer.featureCount}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{layer.crs}</td>
                    <td className="py-3 px-4 text-slate-500">{layer.updatedAt}</td>
                    <td className="py-3 px-4 text-center">
                      <button className="text-slate-400 hover:text-blue-600 p-1" title="Edit Layer">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 2: Vegetasi */}
      {activeTab === 'vegetasi' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Katalog Spesies Vegetasi Mangrove
            </h3>
            <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Vegetasi</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 text-[11px] uppercase">
                  <th className="py-2.5 px-4 w-12 text-center">No</th>
                  <th className="py-2.5 px-4 w-28">Kode</th>
                  <th className="py-2.5 px-4">Nama Spesies Ilmiah / Lokal</th>
                  <th className="py-2.5 px-4">Famili</th>
                  <th className="py-2.5 px-4 text-center">Satuan Default</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                  <th className="py-2.5 px-4 text-center w-20">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {vegetasiList.map((veg, idx) => (
                  <tr key={veg.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 text-center font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-blue-700">{veg.kode}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{veg.nama}</td>
                    <td className="py-3 px-4 italic text-slate-600">{veg.famili}</td>
                    <td className="py-3 px-4 text-center font-mono text-slate-600">{veg.satuan}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        veg.status === 'Dilindungi'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {veg.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button className="text-slate-400 hover:text-blue-600 p-1">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 3: Objek Pajak */}
      {activeTab === 'pajak' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Daftar Objek Penilaian Pajak & Retribusi
            </h3>
            <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Objek Pajak</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 text-[11px] uppercase">
                  <th className="py-2.5 px-4 w-12 text-center">No</th>
                  <th className="py-2.5 px-4 w-28">Kode</th>
                  <th className="py-2.5 px-4">Nama Objek Penilaian</th>
                  <th className="py-2.5 px-4">Jenis Klasifikasi</th>
                  <th className="py-2.5 px-4">Dasar Hukum Regulasi</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                  <th className="py-2.5 px-4 text-center w-20">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {pajakList.map((pjk, idx) => (
                  <tr key={pjk.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 text-center font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-blue-700">{pjk.kode}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{pjk.nama}</td>
                    <td className="py-3 px-4 text-slate-600">{pjk.jenis}</td>
                    <td className="py-3 px-4 text-slate-500">{pjk.dasarHukum}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                        {pjk.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button className="text-slate-400 hover:text-blue-600 p-1">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 4: Data Pendukung */}
      {activeTab === 'pendukung' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Parameter Referensi & Koefisien Valuasi
            </h3>
            <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Parameter</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 text-[11px] uppercase">
                  <th className="py-2.5 px-4 w-12 text-center">No</th>
                  <th className="py-2.5 px-4 w-28">Kode</th>
                  <th className="py-2.5 px-4">Parameter Valuasi</th>
                  <th className="py-2.5 px-4 text-right font-mono">Nilai Standar</th>
                  <th className="py-2.5 px-4">Satuan</th>
                  <th className="py-2.5 px-4">Sumber Referensi Ilmiah</th>
                  <th className="py-2.5 px-4 text-center">Kategori</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {pendukungList.map((sup, idx) => (
                  <tr key={sup.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 text-center font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-blue-700">{sup.kode}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{sup.parameter}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">{sup.nilai}</td>
                    <td className="py-3 px-4 text-slate-600">{sup.satuan}</td>
                    <td className="py-3 px-4 text-slate-500 italic">{sup.sumberReferensi}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-medium">
                        {sup.kategori}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Next Step Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-5 rounded-xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">Tahap Selanjutnya • Langkah 05</div>
          <div className="text-sm font-semibold text-white mt-0.5">
            Konfigurasi Jasa Ekosistem & Pilihan Metode Valuasi Ilmiah
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Tentukan 4 pilar jasa ekosistem (Provisioning, Regulating, Supporting, Cultural) dan metode valuasi (Market Price, TCM, CVM, dll) per area tutupan lahan.
          </p>
        </div>
        <button
          onClick={() => navigate(`/projects/${activeProjectId}/services-methods`)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-sm whitespace-nowrap self-start sm:self-auto"
        >
          <span>Lanjut ke 05 Jasa & Metode</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
