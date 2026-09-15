import React from 'react';
import { ADMIN_ACTIVITY_LOGS } from '../../mock/adminMock';
import { Activity, ShieldCheck, Filter, Download, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminActivityPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 text-slate-800">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 md:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <span className="text-blue-600">Super Admin</span>
            <span>•</span>
            <span>Audit Trail & Log</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5 mt-0.5">
            <Activity className="w-6 h-6 text-blue-600" />
            <span>Riwayat Aktivitas Sistem</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Rekam jejak seluruh aktivitas pengguna, perubahan data valuasi, pengajuan review, dan pembaruan sistem.
          </p>
        </div>

        <button
          onClick={() => alert('Fitur Ekspor Log Audit (.CSV / .JSON) akan diunduh.')}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Ekspor Log Audit</span>
        </button>
      </div>

      {/* Activity Timeline Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Aktivitas Terkini (Real-Time Audit Feed)
          </h2>
          <span className="text-xs text-slate-500">Menampilkan 5 aktivitas terbaru</span>
        </div>

        <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
          {ADMIN_ACTIVITY_LOGS.map((act) => (
            <div key={act.id} className="relative flex items-start gap-4">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs ring-4 ring-white shrink-0 z-10">
                <Activity className="w-3.5 h-3.5" />
              </div>

              <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{act.userName}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${act.badgeColor}`}>
                      {act.userRole}
                    </span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">{act.timestamp}</span>
                </div>

                <p className="text-slate-700 leading-relaxed">
                  <span className="font-semibold text-slate-800">{act.action}</span> pada sasaran:{' '}
                  <strong className="text-blue-700">{act.target}</strong>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminActivityPage;
