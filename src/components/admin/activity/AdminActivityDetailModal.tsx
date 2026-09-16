import React from 'react';
import { AuditRecord } from '../../../mock/auditMock';
import {
  X,
  Activity,
  User,
  ShieldCheck,
  Building,
  Globe,
  Monitor,
  FolderKanban,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ArrowRight,
  Clock,
  Code
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminActivityDetailModalProps {
  activity: AuditRecord | null;
  onClose: () => void;
}

export const AdminActivityDetailModal: React.FC<AdminActivityDetailModalProps> = ({
  activity,
  onClose,
}) => {
  const navigate = useNavigate();

  if (!activity) return null;

  const getActivityTypeBadge = (type: string) => {
    switch (type) {
      case 'Create':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Update':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Delete':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Submit':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Approve':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Reject':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Import':
      case 'Export':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Super Admin':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Analyst':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Detail Log Aktivitas
                </h3>
                <span className="font-mono text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {activity.id}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{activity.timeDisplay}</span>
                <span>•</span>
                <span className="font-semibold text-slate-700">{activity.relativeTime}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-5 text-xs text-slate-700">
          {/* Section 1: User / Aktor */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Aktor / Pengguna
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-full bg-gradient-to-tr ${activity.userAvatarBg} text-white font-bold text-sm flex items-center justify-center shadow-xs ring-2 ring-white shrink-0`}
                >
                  {activity.userInitials}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{activity.userName}</div>
                  <div className="text-slate-500 font-mono text-[11px]">{activity.userEmail}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${getRoleBadge(activity.userRole)}`}>
                  {activity.userRole}
                </span>
              </div>
            </div>

            {/* Network & Device Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200/80 text-[11px]">
              <div className="flex items-center gap-2 text-slate-600">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>IP Address:</span>
                <strong className="font-mono text-slate-800">{activity.ipAddress}</strong>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Monitor className="w-3.5 h-3.5 text-slate-400" />
                <span>Platform:</span>
                <strong className="text-slate-800 truncate">{activity.userAgent}</strong>
              </div>
            </div>
          </div>

          {/* Section 2: Aktivitas & Status */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2.5 shadow-2xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Tindakan & Eksekusi
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${getActivityTypeBadge(activity.activityType)}`}>
                {activity.activityType}
              </span>
              <span className="font-bold text-slate-900 text-sm">
                {activity.actionTitle}
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed text-xs">
              {activity.actionDetail}
            </p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5">
                {activity.status === 'SUCCESS' ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Status: Berhasil (200 OK)</span>
                  </span>
                ) : activity.status === 'WARNING' ? (
                  <span className="inline-flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    <span>Status: Perhatian / Revisi</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    <X className="w-3.5 h-3.5 text-rose-500" />
                    <span>Status: Gagal</span>
                  </span>
                )}
              </div>

              <div className="text-slate-400 font-mono">
                Latency: <strong>{activity.durationMs} ms</strong>
              </div>
            </div>
          </div>

          {/* Section 3: Objek & Proyek Terkait */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Modul & Proyek Terkait
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900">
                  {activity.projectName || 'Sistem Global PKSPL'}
                </div>
                {activity.projectCode && (
                  <div className="font-mono text-blue-600 font-semibold text-[11px]">
                    Kode Proyek: {activity.projectCode}
                  </div>
                )}
                <div className="text-slate-500 text-[11px]">
                  Modul Sistem: <strong className="text-slate-700">{activity.moduleName}</strong>
                </div>
              </div>

              {activity.projectCode && (
                <button
                  onClick={() => {
                    onClose();
                    navigate(`/projects/${activity.projectCode}/maps`);
                  }}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
                >
                  <span>Buka Proyek</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Section 4: Audit Changes Diff (if any) */}
          {activity.changes && activity.changes.length > 0 && (
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2.5 shadow-2xs">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <Code className="w-3.5 h-3.5 text-blue-600" />
                <span>Rincian Perubahan Data (Data Diff)</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <th className="py-2 px-3">Field / Parameter</th>
                      <th className="py-2 px-3 text-rose-700">Nilai Sebelum</th>
                      <th className="py-2 px-3 text-emerald-700">Nilai Sesudah</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {activity.changes.map((ch, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-semibold text-slate-800">{ch.field}</td>
                        <td className="py-2 px-3 text-rose-600 bg-rose-50/40">{ch.oldValue}</td>
                        <td className="py-2 px-3 text-emerald-600 bg-emerald-50/40">{ch.newValue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
