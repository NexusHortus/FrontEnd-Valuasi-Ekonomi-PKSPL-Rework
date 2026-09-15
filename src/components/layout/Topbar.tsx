import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { AutosaveIndicator } from './AutosaveIndicator';
import { StatusBadge } from '../common/StatusBadge';
import { FolderGit2, ChevronRight, UserCircle, RefreshCw } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface TopbarProps {
  onToggleSidebar?: () => void;
}

export const Topbar: React.FC<TopbarProps> = () => {
  const { activeProject, projects, setActiveProjectId, resetAllData } = useProject();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract step from path
  const pathParts = location.pathname.split('/').filter(Boolean);
  let currentStepName = '01 Daftar Proyek';
  if (pathParts.includes('maps')) currentStepName = '02 Maps Spasial';
  else if (pathParts.includes('index')) currentStepName = '03 Index Kawasan';
  else if (pathParts.includes('data-master')) currentStepName = '04 Data Master';
  else if (pathParts.includes('services-methods') || pathParts.includes('identification')) currentStepName = '05 Jasa & Metode';
  else if (pathParts.includes('valuation-data') || pathParts.includes('input')) currentStepName = '06 Data Valuasi';
  else if (pathParts.includes('calculation')) currentStepName = '07 Perhitungan (TEV)';
  else if (pathParts.includes('analytics')) currentStepName = '08 Analitik & Visualisasi';
  else if (pathParts.includes('review')) currentStepName = '09 Review & Laporan';

  const currentRouteId = pathParts[0] === 'projects' ? pathParts[1] : undefined;
  const selectedProj = (currentRouteId && projects.find(p => p.id === currentRouteId || p.code === currentRouteId)) || activeProject;
  const selectedProjId = selectedProj?.id || activeProject?.id;

  const handleProjectSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    setActiveProjectId(newId);
    // If inside a project page, stay in the same section with the new project
    const currentSubPath = pathParts.slice(2).join('/');
    if (currentSubPath) {
      navigate(`/projects/${newId}/${currentSubPath}`);
    } else {
      navigate(`/projects/${newId}/maps`);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      {/* Left: Breadcrumbs & Project Selector */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
          <span className="text-slate-800 font-semibold tracking-tight">PKSPL</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <span className="hidden sm:inline">Sistem Valuasi</span>
          <ChevronRight className="w-4 h-4 text-slate-400 hidden sm:inline" />
          <span className="text-blue-700 font-medium bg-blue-50 px-2 py-0.5 rounded text-xs">
            {currentStepName}
          </span>
        </div>

        {/* Project Switcher Dropdown */}
        {selectedProj && (
          <div className="flex items-center gap-2 pl-3 border-l border-slate-200 ml-2">
            <FolderGit2 className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedProjId}
              onChange={handleProjectSelect}
              className="text-xs bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded px-2.5 py-1 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 max-w-xs truncate cursor-pointer"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.code} — {p.name}
                </option>
              ))}
            </select>
            <StatusBadge status={selectedProj.status} size="sm" />
          </div>
        )}
      </div>

      {/* Right: Autosave Indicator, Reset Data, and User Profile */}
      <div className="flex items-center gap-3">
        {/* Autosave badge */}
        <AutosaveIndicator />

        {/* Reset Mock State Button */}
        <button
          onClick={() => {
            if (confirm('Reset ulang data prototype ke kondisi awal mock data?')) {
              resetAllData();
              window.location.reload();
            }
          }}
          title="Reset semua data mock ke default"
          className="hidden md:flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 px-2 py-1 rounded hover:bg-slate-100 border border-slate-200"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset Demo</span>
        </button>

        {/* User Peneliti profile */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
            P
          </div>
          <div className="hidden md:block text-left leading-tight">
            <div className="text-xs font-semibold text-slate-800">Dr. Ir. Retno Wulandari</div>
            <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Peneliti Utama
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
