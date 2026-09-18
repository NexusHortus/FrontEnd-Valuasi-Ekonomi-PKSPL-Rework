import React, { useState } from 'react';
import { LandCoverPolygon } from '../../types/spatial';
import { formatIDR, formatNumber } from '../../utils/formatter';
import { X, ExternalLink, ArrowRight, Check, MapPin, Tag, AlertTriangle, Plus, Link2, Unlink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';

interface PolygonDetailDrawerProps {
  polygon: LandCoverPolygon | null;
  onClose: () => void;
  onOpenIndex?: (indexCode: string) => void;
}

export const PolygonDetailDrawer: React.FC<PolygonDetailDrawerProps> = ({
  polygon,
  onClose,
}) => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { 
    activeProjectId, 
    indices, 
    createIndexFromPolygon, 
    linkPolygonToIndex, 
    unlinkPolygonFromIndex 
  } = useProject();

  const [selectedLinkIndexId, setSelectedLinkIndexId] = useState<string>('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [reminderSent, setReminderSent] = useState(false);

  if (!polygon) return null;

  const hasIndex = Boolean(polygon.indexId || polygon.indexCode);

  const handleOpenValuation = (serviceId?: string, method?: string) => {
    const sId = serviceId || polygon.activeServices[0] || 'provisioning';
    const mId = method ? method.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'market-price';
    navigate(`/projects/${activeProjectId}/valuation-data?area=${polygon.id}&service=${sId}&method=${mId}&biota=flora`);
  };

  const handleOpenServicesMethods = () => {
    navigate(`/projects/${activeProjectId}/services-methods?area=${polygon.id}`);
  };

  const handleOpenIndexPage = () => {
    navigate(`/projects/${activeProjectId}/index`);
  };

  const handleCreateNewIndex = () => {
    const newIdx = createIndexFromPolygon(polygon.id);
    setActionSuccessMsg(`Index ${newIdx.code} berhasil dibuat & dihubungkan!`);
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  const handleLinkExisting = () => {
    if (!selectedLinkIndexId) return;
    linkPolygonToIndex(polygon.id, selectedLinkIndexId);
    setSelectedLinkIndexId('');
    setActionSuccessMsg('Berhasil menghubungkan area ke index terpilih!');
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  const handleUnlink = () => {
    if (confirm('Putuskan hubungan area tutupan lahan ini dari Index?')) {
      unlinkPolygonFromIndex(polygon.id);
      setActionSuccessMsg('Hubungan index telah diputuskan.');
      setTimeout(() => setActionSuccessMsg(null), 3000);
    }
  };

  return (
    <div className="absolute top-0 right-0 bottom-0 w-full sm:w-96 bg-white border-l border-slate-200 shadow-xl z-30 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-slate-800 text-sm tracking-tight uppercase">Detail Area Spasial</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 text-sm">
        {/* Success toast */}
        {actionSuccessMsg && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in duration-150">
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-medium">{actionSuccessMsg}</span>
          </div>
        )}

        {/* Land cover banner */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Area Tutupan Lahan
            </div>
            <div className="text-base font-bold text-slate-900 flex items-center gap-2 mt-0.5">
              <span>{polygon.name}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium capitalize">
                {polygon.type.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/70">
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Luas Area</div>
              <div className="text-sm font-bold text-slate-800 mt-0.5">
                {formatNumber(polygon.areaHa)} ha
              </div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Status Index</div>
              {hasIndex ? (
                <div className="text-sm font-mono font-bold text-blue-700 mt-0.5 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3 text-blue-500" />
                    {polygon.indexCode}
                  </span>
                  <button
                    onClick={handleUnlink}
                    title="Putuskan hubungan index"
                    className="text-[10px] font-sans text-slate-400 hover:text-rose-600 flex items-center gap-0.5 font-normal cursor-pointer"
                  >
                    <Unlink className="w-2.5 h-2.5" />
                    <span>Unlink</span>
                  </button>
                </div>
              ) : (
                <div className="text-xs font-semibold text-amber-700 mt-0.5 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-500" />
                  <span>Tanpa Index</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Warning if no index connected */}
        {!hasIndex && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs space-y-2.5">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>⚠ Area Belum Memiliki Index</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              {isAdmin
                ? 'Area poligon ini belum terikat dengan kode index perhitungan. Anda dapat mengirim pengingat ke peneliti.'
                : 'Area poligon ini belum terikat dengan kode index perhitungan. Buat index baru atau hubungkan ke index yang sudah ada:'}
            </p>
            <div className="space-y-2 pt-1">
              {isAdmin ? (
                <>
                  <button
                    onClick={() => {
                      setReminderSent(true);
                      setTimeout(() => setReminderSent(false), 3000);
                    }}
                    disabled={reminderSent}
                    className="w-full py-1.5 px-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    {reminderSent ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Pengingat Sudah Terkirim</span>
                      </>
                    ) : (
                      <span>Ingatkan ke Peneliti</span>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleCreateNewIndex}
                    className="w-full py-1.5 px-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Buat Index dari Area Ini</span>
                  </button>

                  <div className="pt-1.5 border-t border-amber-200/80">
                    <label className="text-[10px] uppercase font-bold text-amber-900 mb-1 block">
                      Atau Hubungkan ke Index:
                    </label>
                    <div className="flex gap-1.5">
                      <select
                        value={selectedLinkIndexId}
                        onChange={(e) => setSelectedLinkIndexId(e.target.value)}
                        className="flex-1 text-xs bg-white border border-amber-300 rounded px-2 py-1 text-slate-800 focus:outline-none"
                      >
                        <option value="">-- Pilih Index --</option>
                        {indices.map(i => (
                          <option key={i.id} value={i.id}>
                            {i.code} - {i.name} ({i.spatialStatus === 'connected' ? 'Terhubung' : 'Draft'})
                          </option>
                        ))}
                      </select>
                      <button
                        disabled={!selectedLinkIndexId}
                        onClick={handleLinkExisting}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white text-xs font-semibold rounded transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Link2 className="w-3 h-3" />
                        <span>Hubungkan</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Active Ecosystem Services */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Jasa Ekosistem Terpilih
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            {['provisioning', 'regulating', 'supporting', 'cultural'].map(serviceId => {
              const isActive = polygon.activeServices.includes(serviceId as any);
              const label = serviceId === 'provisioning' ? 'Provisioning Services' :
                            serviceId === 'regulating' ? 'Regulating Services' :
                            serviceId === 'supporting' ? 'Supporting Services' : 'Cultural Services';
              return (
                <div
                  key={serviceId}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium border ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-slate-50 text-slate-400 border-slate-200/60'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    isActive ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'
                  }`}>
                    {isActive ? <Check className="w-2.5 h-2.5" /> : '○'}
                  </span>
                  <span>{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Valuation Value Breakdown */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Rincian Nilai Valuasi
          </div>
          <div className="space-y-2.5">
            {polygon.serviceDetails.map(detail => {
              const label = detail.serviceId === 'provisioning' ? 'Provisioning Services' :
                            detail.serviceId === 'regulating' ? 'Regulating Services' :
                            detail.serviceId === 'supporting' ? 'Supporting Services' : 'Cultural Services';
              return (
                <div key={detail.serviceId} className="p-3 rounded border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-2xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{label}</span>
                    <button
                      onClick={() => handleOpenValuation(detail.serviceId, detail.methodName)}
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-0.5 text-xs hover:underline cursor-pointer"
                    >
                      <span>Data Valuasi</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 font-medium">
                    Metode: {detail.methodName}
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-1 font-mono">
                    {formatIDR(detail.value)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Total Value */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-blue-700 uppercase">Total Nilai Area</div>
            <div className="text-base font-bold text-blue-900 font-mono mt-0.5">
              {formatIDR(polygon.totalValue)}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation Buttons */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
        <button
          onClick={() => handleOpenValuation()}
          className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
        >
          <span>Buka Data Valuasi</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleOpenServicesMethods}
            className="py-2 px-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span>Jasa & Metode</span>
          </button>
          <button
            onClick={handleOpenIndexPage}
            className="py-2 px-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Tag className="w-3.5 h-3.5 text-slate-500" />
            <span>Kelola Index</span>
          </button>
        </div>
      </div>
    </div>
  );
};
