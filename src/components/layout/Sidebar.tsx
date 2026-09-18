import React from 'react';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import {
  FolderKanban,
  Map,
  Layers,
  Database,
  SlidersHorizontal,
  TableProperties,
  Calculator,
  BarChart3,
  FileCheck2,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Sliders,
  Home
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const { activeProject, activeProjectId, simulateAnalystRejection } = useProject();
  const { isAdmin } = useAuth();
  const location = useLocation();
  const params = useParams<{ projectId?: string }>();
  const projId = params.projectId || activeProjectId || 'PKS-994KY1';

  // Navigation workflow items (9 Steps)
  const allWorkflowItems = [
    {
      num: '01',
      title: 'Proyek',
      path: '/projects',
      icon: FolderKanban,
      match: (p: string) => p === '/projects' || p === '/projects/new',
    },
    {
      num: '02',
      title: 'Maps',
      path: `/projects/${projId}/maps`,
      icon: Map,
      match: (p: string) => p.includes('/maps'),
    },
    {
      num: '03',
      title: 'Index',
      path: `/projects/${projId}/index`,
      icon: Layers,
      match: (p: string) => p.includes('/index'),
    },
    {
      num: '04',
      title: 'Data Master',
      path: `/projects/${projId}/data-master`,
      icon: Database,
      match: (p: string) => p.includes('/data-master'),
    },
    {
      num: '05',
      title: 'Jasa & Metode',
      path: `/projects/${projId}/services-methods`,
      icon: SlidersHorizontal,
      match: (p: string) => p.includes('/services-methods') || p.includes('/identification'),
    },
    {
      num: '06',
      title: 'Data Valuasi',
      path: `/projects/${projId}/valuation-data`,
      icon: TableProperties,
      match: (p: string) => p.includes('/valuation-data') || p.includes('/input'),
    },
    {
      num: '07',
      title: 'Perhitungan',
      path: `/projects/${projId}/calculation`,
      icon: Calculator,
      match: (p: string) => p.includes('/calculation'),
    },
    {
      num: '08',
      title: 'Analitik',
      path: `/projects/${projId}/analytics`,
      icon: BarChart3,
      match: (p: string) => p.includes('/analytics'),
    },
    {
      num: '09',
      title: 'Review & Laporan',
      path: `/projects/${projId}/review`,
      icon: FileCheck2,
      match: (p: string) => p.includes('/review'),
    },
  ];

  // Admin users cannot see "01 Proyek" step
  const workflowItems = isAdmin
    ? allWorkflowItems.filter(item => item.num !== '01')
    : allWorkflowItems;

  // Helper to determine status marker (✓ completed, ● current, ○ pending)
  const getStepStatus = (itemIndex: number, isCurrent: boolean) => {
    if (isCurrent) return { symbol: '●', color: 'text-blue-600 font-bold' };
    // Simulated completion logic: previous steps marked completed
    const currentActiveIndex = workflowItems.findIndex(i => i.match(location.pathname));
    if (currentActiveIndex >= 0 && itemIndex < currentActiveIndex) {
      return { symbol: '✓', color: 'text-emerald-600 font-bold' };
    }
    return { symbol: '○', color: 'text-slate-400' };
  };

  return (
    <aside
      className={`bg-slate-900 text-slate-300 flex flex-col transition-all duration-200 ease-in-out border-r border-slate-800 z-40 select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800 bg-slate-950/40">
        {!collapsed && (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
              PK
            </div>
            <div className="leading-tight truncate">
              <div className="text-sm font-bold text-white tracking-wider">PKSPL</div>
              <div className="text-[11px] text-slate-400 font-medium">Sistem Valuasi</div>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 mx-auto rounded bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            PK
          </div>
        )}

        <button
          onClick={onToggle}
          title={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Active Project Banner in Sidebar */}
      {!collapsed && activeProject && (
        <div className="px-4 py-3 bg-slate-800/40 border-b border-slate-800/70">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
            Proyek Aktif
          </div>
          <div className="text-xs font-semibold text-white truncate" title={activeProject.name}>
            {activeProject.name}
          </div>
          <div className="text-[11px] font-mono text-blue-400 mt-0.5">
            {activeProject.code}
          </div>
        </div>
      )}

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {!collapsed && (
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Workflow Penelitian
          </div>
        )}

        {workflowItems.map((item, idx) => {
          const isCurrent = item.match(location.pathname);
          const status = getStepStatus(idx, isCurrent);
          const Icon = item.icon;

          return (
            <NavLink
              key={item.num}
              to={item.path}
              title={collapsed ? `${item.num} ${item.title}` : undefined}
              className={({ isActive }) => {
                const active = isCurrent || isActive;
                return `flex items-center gap-3 px-3 py-2 rounded text-xs transition-colors ${
                  active
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`;
              }}
            >
              <div className="flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4" />
              </div>

              {!collapsed && (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono opacity-60">{item.num}</span>
                    <span className="truncate">{item.title}</span>
                  </div>
                  <span className={`text-xs ${isCurrent ? 'text-white' : status.color}`}>
                    {status.symbol}
                  </span>
                </div>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="p-2 border-t border-slate-800 space-y-1">
        {/* Simulation button for Perlu Perbaikan */}
        {!collapsed ? (
          <button
            onClick={simulateAnalystRejection}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs text-rose-300 bg-rose-950/40 border border-rose-900/50 hover:bg-rose-900/50 transition-colors"
            title="Klik untuk mensimulasikan Analyst mengembalikan proyek dengan catatan perbaikan"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <div className="text-left truncate">
              <div className="font-medium">Simulasi Revisi Analyst</div>
              <div className="text-[10px] text-rose-400/80">Trigger status Perlu Perbaikan</div>
            </div>
          </button>
        ) : (
          <button
            onClick={simulateAnalystRejection}
            title="Simulasi Revisi Analyst (Status Perlu Perbaikan)"
            className="w-full flex items-center justify-center p-2 rounded text-rose-400 hover:bg-rose-950/40"
          >
            <ShieldAlert className="w-4 h-4" />
          </button>
        )}

        {/* Settings / Info */}
        {!collapsed && (
          <>
            <div className="flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-slate-200 cursor-pointer rounded hover:bg-slate-800/60">
              <Sliders className="w-4 h-4" />
              <span>Pengaturan Workflow</span>
            </div>
            
            <NavLink
              to="/"
              className="flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-blue-400 cursor-pointer rounded hover:bg-slate-800/60 transition-colors mt-1"
            >
              <Home className="w-4 h-4" />
              <span>Kembali ke Halaman Awal</span>
            </NavLink>
          </>
        )}
      </div>
    </aside>
  );
};
