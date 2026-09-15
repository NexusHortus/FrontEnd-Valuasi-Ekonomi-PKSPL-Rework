import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { IndexItem, LandCoverType } from '../types/spatial';
import { formatNumber } from '../utils/formatter';
import {
  Layers,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Link2,
  Unlink,
  ArrowRight,
  Edit2,
  Trash2,
  X,
  FileSpreadsheet,
  Compass,
  Tag
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const IndexPage: React.FC = () => {
  const {
    activeProject,
    activeProjectId,
    indices,
    landCovers,
    createIndex,
    updateIndex,
    deleteIndex,
    linkPolygonToIndex,
    unlinkPolygonFromIndex
  } = useProject();

  const navigate = useNavigate();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'Draft' | 'Selesai'>('ALL');
  const [filterSpatial, setFilterSpatial] = useState<'ALL' | 'connected' | 'unconnected'>('ALL');

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [targetIndexForLink, setTargetIndexForLink] = useState<IndexItem | null>(null);

  // Form state for creating new index
  const [formCode, setFormCode] = useState(() => `IDX-00${indices.length + 1}`);
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<string>('Mangrove');
  const [formAreaHa, setFormAreaHa] = useState<number>(75.0);
  const [formUnit, setFormUnit] = useState('ha');
  const [formDesc, setFormDesc] = useState('');

  // Filtered indices list
  const filteredIndices = indices.filter(item => {
    const matchesSearch =
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.landCoverType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus;
    const matchesSpatial = filterSpatial === 'ALL' || item.spatialStatus === filterSpatial;

    return matchesSearch && matchesStatus && matchesSpatial;
  });

  const handleOpenCreateModal = () => {
    const nextNum = indices.length + 1;
    setFormCode(`IDX-00${nextNum}`);
    setFormName('');
    setFormType('Mangrove');
    setFormAreaHa(75.0);
    setFormUnit('ha');
    setFormDesc('');
    setIsCreateModalOpen(true);
  };

  const handleSaveNewIndex = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Nama Index wajib diisi.');
      return;
    }

    createIndex({
      code: formCode.trim().toUpperCase(),
      name: formName.trim(),
      landCoverType: formType,
      landCoverName: formName.trim(),
      areaHa: Number(formAreaHa) || 0,
      unit: formUnit,
      description: formDesc.trim() || 'Index dibuat secara mandiri oleh peneliti.',
      status: 'Draft',
      spatialStatus: 'unconnected',
    });

    setIsCreateModalOpen(false);
  };

  const handleOpenLinkModal = (indexItem: IndexItem) => {
    setTargetIndexForLink(indexItem);
    setIsLinkModalOpen(true);
  };

  const handleConfirmLinkPolygon = (polygonId: string) => {
    if (!targetIndexForLink) return;
    linkPolygonToIndex(polygonId, targetIndexForLink.id);
    setIsLinkModalOpen(false);
    setTargetIndexForLink(null);
  };

  // Unlinked polygons available for linking
  const unlinkedPolygons = landCovers.filter(p => !p.indexId);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Tahap 03</span>
            <span>•</span>
            <span className="text-blue-600">Katalog Area Penilaian</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5 mt-0.5">
            <Layers className="w-6 h-6 text-blue-600" />
            <span>Index Tutupan Lahan</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            {activeProject?.name} • Kelola identitas wilayah tutupan lahan secara mandiri dengan atau tanpa data spasial SHP.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs md:text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Buat Index</span>
        </button>
      </div>

      {/* Info Notice: Index Independence */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-3 text-xs text-slate-600">
        <Compass className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-slate-800">
            Index tidak bergantung pada ketersediaan berkas SHP.
          </span>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            Anda dapat mendaftarkan Index wilayah terlebih dahulu secara manual, kemudian menghubungkannya dengan polygon spasial peta di Tahap 02 Maps kapan saja bila data spasial sudah siap.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kode index, nama, tutupan..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">Semua Status</option>
            <option value="Draft">Draft</option>
            <option value="Selesai">Selesai</option>
          </select>

          <select
            value={filterSpatial}
            onChange={(e) => setFilterSpatial(e.target.value as any)}
            className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">Semua Data Spasial</option>
            <option value="connected">Terhubung ke Peta</option>
            <option value="unconnected">Belum Terhubung</option>
          </select>
        </div>
      </div>

      {/* Index Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 text-[11px] uppercase">
                <th className="py-2.5 px-4 w-28">Kode Index</th>
                <th className="py-2.5 px-4">Nama Index</th>
                <th className="py-2.5 px-4 w-36">Area Tutupan</th>
                <th className="py-2.5 px-4 text-right w-28">Luas</th>
                <th className="py-2.5 px-4 w-28 text-center">Status</th>
                <th className="py-2.5 px-4 w-40 text-center">Data Spasial</th>
                <th className="py-2.5 px-4 text-right min-w-[200px]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredIndices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Tidak ada data index yang cocok dengan pencarian / filter.
                  </td>
                </tr>
              ) : (
                filteredIndices.map((item) => {
                  const isConnected = item.spatialStatus === 'connected';
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70">
                      {/* Kode Index */}
                      <td className="py-3 px-4 font-mono font-bold text-blue-700 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-blue-500" />
                        <span>{item.code}</span>
                      </td>

                      {/* Nama */}
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {item.name}
                        {item.description && (
                          <div className="text-[11px] text-slate-400 font-normal truncate max-w-xs mt-0.5">
                            {item.description}
                          </div>
                        )}
                      </td>

                      {/* Area Tutupan Lahan */}
                      <td className="py-3 px-4 text-slate-700">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                          {item.landCoverType}
                        </span>
                      </td>

                      {/* Luas */}
                      <td className="py-3 px-4 text-right font-mono text-slate-800">
                        {formatNumber(item.areaHa)} {item.unit || 'ha'}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.status === 'Selesai'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* Data Spasial */}
                      <td className="py-3 px-4 text-center">
                        {isConnected ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>✓ Terhubung</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleOpenLinkModal(item)}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 px-2 py-0.5 rounded border border-slate-300 hover:border-blue-300 transition-colors"
                            title="Klik untuk menghubungkan index ini dengan polygon spasial peta"
                          >
                            <Link2 className="w-3 h-3 text-slate-400" />
                            <span>○ Belum terhubung</span>
                          </button>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          onClick={() => navigate(`/projects/${activeProjectId}/services-methods?area=${item.landCoverId || item.id}`)}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded text-[11px] border border-blue-200 transition-colors inline-flex items-center gap-1"
                        >
                          <span>Atur Jasa & Metode</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Hapus Index ${item.code} (${item.name})?`)) {
                              deleteIndex(item.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                          title="Hapus Index"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Next Step Banner */}
      <div className="p-4 bg-white border border-blue-200 rounded-lg shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
            ✓
          </div>
          <div>
            <div className="font-bold text-slate-800 text-xs">Index sudah terdaftar.</div>
            <div className="text-slate-500 text-[11px]">
              Langkah berikutnya: Tentukan jasa ekosistem dan metode valuasi untuk setiap Area Tutupan Lahan.
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate(`/projects/${activeProjectId}/services-methods`)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs self-start sm:self-auto flex-shrink-0"
        >
          <span>Lanjut ke Jasa & Metode</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Modal: + Buat Index Mandiri Tanpa SHP */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-2xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Buat Index Baru</h3>
                <p className="text-[11px] text-slate-500">Mendaftarkan unit tutupan lahan penelitian secara mandiri.</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewIndex} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kode Index</label>
                <input
                  type="text"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded font-mono font-bold text-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Index / Area</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Mangrove Barat Zona Konservasi"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tipe Tutupan</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  >
                    <option value="Mangrove">Mangrove</option>
                    <option value="Lamun">Padang Lamun</option>
                    <option value="Terumbu Karang">Terumbu Karang</option>
                    <option value="Perairan">Perairan Teluk</option>
                    <option value="Lainnya">Lainnya / Pesisir</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Luas (Ha)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formAreaHa}
                    onChange={(e) => setFormAreaHa(parseFloat(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-right font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deskripsi & Catatan</label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Karakteristik ekologis atau zonasi..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-500 space-y-1">
                <div className="font-semibold text-slate-700">Status Awal:</div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span>Status: <strong className="text-amber-700 font-semibold">Draft</strong></span>
                  <span>•</span>
                  <span>Data Spasial: <strong className="text-slate-600">Belum terhubung</strong></span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold shadow-xs"
                >
                  Buat Index
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Hubungkan Index ke Polygon SHP */}
      {isLinkModalOpen && targetIndexForLink && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-2xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Hubungkan ke Data Spasial</h3>
                <p className="text-[11px] text-slate-500">
                  Tautkan Index <strong>{targetIndexForLink.code} ({targetIndexForLink.name})</strong> ke polygon peta.
                </p>
              </div>
              <button
                onClick={() => setIsLinkModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                Pilih salah satu polygon spasial yang belum memiliki index untuk dihubungkan:
              </p>

              {unlinkedPolygons.length === 0 ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded text-amber-800 text-center space-y-2">
                  <AlertCircle className="w-5 h-5 mx-auto text-amber-600" />
                  <div className="font-semibold">Semua polygon pada peta telah memiliki Index.</div>
                  <div className="text-[11px] text-amber-700">
                    Anda dapat mengunggah berkas layer SHP baru di menu <strong>02 Maps</strong>.
                  </div>
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {unlinkedPolygons.map(poly => (
                    <div
                      key={poly.id}
                      className="p-3 bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 rounded flex items-center justify-between transition-colors"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{poly.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {poly.type.replace('_', ' ')} • {formatNumber(poly.areaHa)} ha
                        </div>
                      </div>
                      <button
                        onClick={() => handleConfirmLinkPolygon(poly.id)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs shadow-xs"
                      >
                        Tautkan
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-end pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(false)}
                  className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded font-medium"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
