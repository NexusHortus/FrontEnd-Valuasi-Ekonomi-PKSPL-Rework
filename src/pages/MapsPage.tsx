import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { MapView } from '../components/map/MapView';
import { UploadShpModal } from '../components/map/UploadShpModal';
import { LandCoverPolygon } from '../types/spatial';
import {
  Map as MapIcon,
  MapPin,
  Upload,
  Search,
  Info,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const MapsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { projectId } = useParams<{ projectId?: string }>();
  const {
    projects,
    activeProject,
    activeProjectId,
    setActiveProjectId,
    getProjectLandCovers,
    getProjectIndices,
    getProjectLayers,
  } = useProject();

  const routeProjId = projectId || activeProjectId;
  const currentProject = projects.find(p => p.id === routeProjId || p.code === routeProjId) || activeProject;
  const effectiveProjId = currentProject?.id || routeProjId;

  const landCovers = getProjectLandCovers ? getProjectLandCovers(effectiveProjId) : [];
  const indices = getProjectIndices ? getProjectIndices(effectiveProjId) : [];
  const layers = getProjectLayers ? getProjectLayers(effectiveProjId) : [];

  // Sync activeProjectId if route parameter differs
  useEffect(() => {
    if (projectId && projectId !== activeProjectId) {
      const found = projects.find(p => p.id === projectId || p.code === projectId);
      if (found) {
        setActiveProjectId(found.id);
      }
    }
  }, [projectId, activeProjectId, projects, setActiveProjectId]);

  const hasShp = Boolean(currentProject?.hasShp);

  const [isShpModalOpen, setIsShpModalOpen] = useState(false);
  const [selectedPolygonId, setSelectedPolygonId] = useState<string | null>(null);
  const [selectedIndexFilter, setSelectedIndexFilter] = useState<string>('ALL');
  const [selectedTutupanFilter, setSelectedTutupanFilter] = useState<string>('ALL');
  const [mapSearch, setMapSearch] = useState('');

  const handlePolygonSelect = (poly: LandCoverPolygon | null) => {
    setSelectedPolygonId(poly ? poly.id : null);
  };

  const handleIndexFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedIndexFilter(val);
    if (val === 'ALL') {
      setSelectedPolygonId(null);
    } else {
      const matched = landCovers.find(l => l.indexCode === val || l.indexId === val);
      if (matched) setSelectedPolygonId(matched.id);
    }
  };

  const handleTutupanFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedTutupanFilter(val);
    if (val === 'ALL') {
      setSelectedPolygonId(null);
    } else {
      const matched = landCovers.find(l => l.id === val);
      if (matched) setSelectedPolygonId(matched.id);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-6 space-y-4">
      {/* Header & Proyek Aktif */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Tahap 02</span>
            <span>•</span>
            <span className="text-blue-600">Sistem Spasial GIS</span>
          </div>
          <h1 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2 mt-0.5">
            <MapIcon className="w-5 h-5 text-blue-600" />
            <span>Maps & Tutupan Lahan</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Proyek Aktif: <strong className="text-slate-800">{currentProject?.name}</strong>{' '}
            <span className="font-mono text-blue-600 font-semibold">({currentProject?.code})</span>
          </p>
        </div>

        {/* Toolbar Top Action: Only displayed when SHP is available */}
        {hasShp && !isAdmin && (
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={() => setIsShpModalOpen(true)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>+ Upload SHP</span>
            </button>
          </div>
        )}
      </div>

      {/* CONDITIONAL RENDERING: EMPTY STATE vs EXISTING MAP UI */}
      {!hasShp ? (
        /* ========================================================================= */
        /* EMPTY STATE: WHEN PROJECT DOES NOT HAVE SHP DATA YET                      */
        /* ========================================================================= */
        <div className="flex-1 flex items-center justify-center p-2 min-h-[420px]">
          <div className="w-full max-w-xl bg-white rounded-xl border border-slate-200 shadow-2xs p-8 md:p-10 text-center animate-in fade-in zoom-in-95 duration-150">
            {/* ICON MAP/GIS */}
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-2xs">
              <MapPin className="w-8 h-8" />
            </div>

            {/* Belum Ada Data SHP */}
            <h2 className="text-lg md:text-xl font-bold text-slate-900">
              Belum Ada Data SHP
            </h2>

            <p className="text-xs md:text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
              Upload file SHP untuk mulai membuat peta wilayah proyek.
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
              Data SHP tidak wajib saat membuat proyek dan dapat ditambahkan kapan saja melalui halaman Maps.
            </p>

            {/* [ + Upload SHP ] */}
            {!isAdmin && (
              <>
                <button
                  type="button"
                  onClick={() => setIsShpModalOpen(true)}
                  className="mt-6 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs md:text-sm font-semibold shadow-xs flex items-center gap-2 mx-auto transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>+ Upload SHP</span>
                </button>

                {/* Format yang didukung */}
                <p className="text-[11px] text-slate-400 mt-2 font-medium">
                  Format yang didukung: <strong>ZIP Shapefile</strong> • <strong>WGS 1984</strong>
                </p>
              </>
            )}

            {/* Divider: atau */}
            <div className="relative my-6 max-w-xs mx-auto">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-slate-400 font-medium">atau</span>
              </div>
            </div>

            {/* Opsi Lewati */}
            <div className="space-y-1.5">
              <div className="text-xs md:text-sm font-semibold text-slate-700">
                Tidak punya data SHP?
              </div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Anda tetap dapat melanjutkan proses penelitian. Data spasial dapat ditambahkan nanti.
              </p>

              <button
                type="button"
                onClick={() => navigate(`/projects/${currentProject?.id || activeProjectId}/index`)}
                className="mt-3 px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 mx-auto transition-colors cursor-pointer shadow-2xs"
              >
                <span>Lewati untuk Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* EXISTING MAP UI: 100% PRESERVED WHEN SHP DATA EXISTS                      */
        /* ========================================================================= */
        <>
          {/* Spatial Toolbar Filters */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Index Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-medium">Index:</span>
                <select
                  value={selectedIndexFilter}
                  onChange={handleIndexFilterChange}
                  className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-700 font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">Semua Index ({indices.length})</option>
                  {indices.map(idx => (
                    <option key={idx.id} value={idx.code}>
                      {idx.code} — {idx.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tutupan Lahan Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-medium">Tutupan Lahan:</span>
                <select
                  value={selectedTutupanFilter}
                  onChange={handleTutupanFilterChange}
                  className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-700 font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">Semua Tutupan ({landCovers.length})</option>
                  {landCovers.map(tl => (
                    <option key={tl.id} value={tl.id}>
                      {tl.name} ({tl.areaHa} ha)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search on Map */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari fitur spasial..."
                value={mapSearch}
                onChange={(e) => setMapSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1 bg-slate-50 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* GIS Leaflet Map Container */}
          <div className="flex-1 w-full min-h-[520px]">
            <MapView
              selectedPolygonId={selectedPolygonId}
              onPolygonSelect={handlePolygonSelect}
              landCovers={landCovers}
              layers={layers}
            />
          </div>

          {/* Helper notice */}
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded text-xs text-blue-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>
                <strong>Panduan Interaksi GIS:</strong> Klik sembarang polygon di atas untuk memunculkan <strong>Detail Drawer</strong> di sebelah kanan dan langsung menuju data valuasi terkait tanpa pencarian manual.
              </span>
            </div>
          </div>

          {/* Next Step Banner */}
          <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">Tahap Selanjutnya • Langkah 03</div>
              <div className="text-sm font-semibold text-white mt-0.5">
                Kelola Master Index & Integrasikan Poligon Spasial dengan Kode Index Kawasan
              </div>
            </div>
            <button
              onClick={() => navigate(`/projects/${currentProject?.id || activeProjectId}/index`)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs whitespace-nowrap self-start sm:self-auto"
            >
              <span>Lanjut ke 03 Index Kawasan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}

      {/* Upload SHP Modal */}
      <UploadShpModal
        isOpen={isShpModalOpen}
        onClose={() => setIsShpModalOpen(false)}
        targetProjectId={currentProject?.id || effectiveProjId}
        targetProjectName={currentProject?.name}
      />
    </div>
  );
};
