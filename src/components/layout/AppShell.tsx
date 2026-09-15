import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useProject } from '../../context/ProjectContext';
import { AlertCircle, ArrowRight, X } from 'lucide-react';

export const AppShell: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const { activeProject, analystFeedback, resolveFeedback } = useProject();
  const navigate = useNavigate();

  const isRevising = activeProject?.status === 'PERLU_PERBAIKAN' && analystFeedback;

  const handleJumpToFeedback = () => {
    if (!analystFeedback) return;
    const { area, service, method, biota, highlightRow } = analystFeedback.targetQuery;
    navigate(`/projects/${activeProject?.id}/valuation-data?area=${area}&service=${service}&method=${method}&biota=${biota || 'flora'}&highlight=${highlightRow}`);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(prev => !prev)}
      />

      {/* Main App Canvas */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar onToggleSidebar={() => setSidebarCollapsed(prev => !prev)} />

        {/* Global Analyst Feedback Banner if project needs revision */}
        {isRevising && (
          <div className="bg-rose-50 border-b border-rose-200 px-4 md:px-6 py-2.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <span className="p-1 rounded bg-rose-100 text-rose-600">
                <AlertCircle className="w-4 h-4" />
              </span>
              <div>
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wide mr-2">
                  Status: Perlu Perbaikan
                </span>
                <span className="text-xs text-rose-700">
                  Temuan Analyst: <strong>{analystFeedback.serviceName} → {analystFeedback.methodName} → {analystFeedback.itemName}</strong>.
                  {' '}"{analystFeedback.comment}"
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleJumpToFeedback}
                className="px-2.5 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded flex items-center gap-1 transition-colors shadow-xs"
              >
                <span>Lihat Data</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={resolveFeedback}
                title="Selesaikan temuan (Kembalikan status Siap Review)"
                className="p-1 text-rose-400 hover:text-rose-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Page Outlet */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
