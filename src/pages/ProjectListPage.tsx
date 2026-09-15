import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { Project, ProjectStatus } from '../types/project';
import { StatusBadge } from '../components/common/StatusBadge';
import { generateProjectCode } from '../utils/formatter';
import {
  Plus,
  Search,
  FolderKanban,
  MoreVertical,
  ExternalLink,
  Map,
  TableProperties,
  FileCheck2,
  X,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProjectListPage: React.FC = () => {
  const { projects, createProject, setActiveProjectId } = useProject();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // New project modal form state
  const [newProjCode, setNewProjCode] = useState(generateProjectCode());
  const [newProjName, setNewProjName] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [formError, setFormError] = useState('');

  const handleOpenCreateModal = () => {
    setNewProjCode(generateProjectCode());
    setNewProjName('');
    setNewProjDesc('');
    setFormError('');
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) {
      setFormError('Nama penelitian wajib diisi.');
      return;
    }

    const created = createProject(newProjName.trim(), newProjDesc.trim());
    setIsCreateModalOpen(false);
    // User directly directed to project workspace (Maps)
    navigate(`/projects/${created.id}/maps`);
  };

  const handleOpenProject = (project: Project) => {
    setActiveProjectId(project.id);
    navigate(`/projects/${project.id}/maps`);
  };

  // Filter and search
  const filteredProjects = projects.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'ALL') return matchSearch;
    return matchSearch && p.status === statusFilter;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <FolderKanban className="w-6 h-6 text-blue-600" />
            <span>Proyek Penelitian</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Kelola proyek valuasi ekonomi dan lanjutkan pekerjaan penelitian.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs md:text-sm font-semibold transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>+ Proyek Baru</span>
        </button>
      </div>

      {/* Toolbar: Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari proyek berdasarkan nama atau kode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-md text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none placeholder:text-slate-400"
          />
        </div>

        {/* Filter by Status */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 whitespace-nowrap font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 bg-white border border-slate-300 rounded-md text-xs text-slate-700 font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none"
          >
            <option value="ALL">Semua Status</option>
            <option value="DRAFT">Draft</option>
            <option value="DIKERJAKAN">Dikerjakan</option>
            <option value="SIAP_REVIEW">Siap Review</option>
            <option value="MENUNGGU_ANALYST">Menunggu Analyst</option>
            <option value="PERLU_PERBAIKAN">Perlu Perbaikan</option>
            <option value="SELESAI">Selesai</option>
          </select>
        </div>
      </div>

      {/* Clean Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4 w-32">Kode Proyek</th>
                <th className="py-3 px-4 min-w-[240px]">Nama Penelitian</th>
                <th className="py-3 px-4 min-w-[280px]">Deskripsi</th>
                <th className="py-3 px-4 w-36">Status</th>
                <th className="py-3 px-4 w-32">Last Update</th>
                <th className="py-3 px-4 w-16 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Tidak ditemukan proyek yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((proj, idx) => (
                  <tr
                    key={proj.id}
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                    onClick={() => handleOpenProject(proj)}
                  >
                    <td className="py-3 px-4 text-center font-mono text-slate-400 font-medium">
                      {idx + 1}
                    </td>

                    <td className="py-3 px-4 font-mono font-semibold text-blue-700">
                      {proj.code}
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                      <div className="flex items-center gap-1.5">
                        <span>{proj.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-blue-600 transition-opacity" />
                      </div>
                      <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                        Peneliti: {proj.lead}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-500 line-clamp-2 pr-6">
                      {proj.description || '-'}
                    </td>

                    <td className="py-3 px-4">
                      <StatusBadge status={proj.status} />
                    </td>

                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{proj.updatedAt}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center relative" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === proj.id ? null : proj.id)}
                        className="p-1.5 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
                        title="Opsi tindakan"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenuId === proj.id && (
                        <div className="absolute right-4 top-10 w-48 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-30 text-xs">
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              handleOpenProject(proj);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-2"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                            <span>Buka Workspace</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              setActiveProjectId(proj.id);
                              navigate(`/projects/${proj.id}/maps`);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                          >
                            <Map className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Lihat Peta Spasial</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              setActiveProjectId(proj.id);
                              navigate(`/projects/${proj.id}/valuation-data`);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                          >
                            <TableProperties className="w-3.5 h-3.5 text-amber-600" />
                            <span>Buka Data Valuasi</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              setActiveProjectId(proj.id);
                              navigate(`/projects/${proj.id}/review`);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 border-t border-slate-100"
                          >
                            <FileCheck2 className="w-3.5 h-3.5 text-purple-600" />
                            <span>Review & Laporan</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sederhana: Modal Buat Proyek Baru (Tanpa SHP) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full overflow-hidden text-sm">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">Buat Proyek Baru</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-4">
              {formError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kode Proyek
                </label>
                <input
                  type="text"
                  value={newProjCode}
                  disabled
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded text-xs font-mono font-bold text-slate-600 cursor-not-allowed"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Kode proyek dibuat otomatis oleh sistem.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Penelitian <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Valuasi Ekosistem Mangrove Teluk Benoa"
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deskripsi Penelitian
                </label>
                <textarea
                  rows={3}
                  placeholder="Jelaskan ringkas tujuan penelitian, lokasi kajian, dan lingkup valuasi..."
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                <strong>Catatan:</strong> Data spasial peta dan SHP bersifat opsional dan dapat diunggah kemudian di halaman <strong>02 Maps</strong>.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-100 rounded text-xs font-medium text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold shadow-xs"
                >
                  Buat Proyek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
