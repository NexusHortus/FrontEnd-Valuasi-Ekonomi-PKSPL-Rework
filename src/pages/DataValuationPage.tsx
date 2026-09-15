import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { useSpreadsheet } from '../context/SpreadsheetContext';
import { DynamicServiceSection } from '../components/spreadsheet/DynamicServiceSection';
import { ExcelImportModal } from '../components/spreadsheet/ExcelImportModal';
import { DetectedCustomColumn } from '../utils/excelEngine';
import { formatNumber } from '../utils/formatter';
import { EcosystemServiceId } from '../types/valuation';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import {
  TableProperties,
  ArrowRight,
  FolderX,
  Layers,
  SlidersHorizontal,
  CheckCircle2
} from 'lucide-react';

const DataValuationPageContent: React.FC = () => {
  const params = useParams<{ projectId?: string }>();
  const {
    projects,
    activeProject,
    activeProjectId,
    setActiveProjectId,
    landCovers,
    getAreaConfig,
    updateAreaConfig,
  } = useProject();

  const { importRows, addMultipleCustomColumns } = useSpreadsheet();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Resolve project from route param or activeProjectId
  const routeProjId = params.projectId || activeProjectId;
  const currentProject = projects.find(p => p.id === routeProjId || p.code === routeProjId) || activeProject;

  // Sync activeProjectId if param is different
  useEffect(() => {
    if (params.projectId && params.projectId !== activeProjectId) {
      const found = projects.find(p => p.id === params.projectId || p.code === params.projectId);
      if (found) {
        setActiveProjectId(found.id);
      }
    }
  }, [params.projectId, activeProjectId, projects, setActiveProjectId]);

  // Selected area from query param or first land cover
  const queryArea = searchParams.get('area');
  const selectedAreaId = (queryArea && landCovers.some(lc => lc.id === queryArea))
    ? queryArea
    : landCovers[0]?.id || 'poly-1';
  const highlightParam = searchParams.get('highlight');

  const currentArea = landCovers.find(lc => lc.id === selectedAreaId) || landCovers[0];
  const areaConfig = getAreaConfig(selectedAreaId);

  // Accordion state: controls which sections are expanded on this single page
  const [openSections, setOpenSections] = useState<Record<EcosystemServiceId, boolean>>({
    provisioning: true,
    regulating: false,
    supporting: false,
    cultural: false,
  });

  // Modal import state
  const [importModalConfig, setImportModalConfig] = useState<{
    isOpen: boolean;
    serviceName: string;
    methodName: string;
    categoryName: string;
  }>({
    isOpen: false,
    serviceName: '',
    methodName: '',
    categoryName: 'Flora',
  });

  const toggleSection = (serviceId: EcosystemServiceId) => {
    setOpenSections(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  const handleExpandAll = () => {
    setOpenSections({
      provisioning: true,
      regulating: true,
      supporting: true,
      cultural: true,
    });
  };

  const handleCollapseAll = () => {
    setOpenSections({
      provisioning: false,
      regulating: false,
      supporting: false,
      cultural: false,
    });
  };

  const handleAreaChange = (newAreaId: string) => {
    setSearchParams({ area: newAreaId });
  };

  const handleMethodChange = (serviceId: EcosystemServiceId, newMethodId: string) => {
    updateAreaConfig(selectedAreaId, {
      selectedMethods: {
        ...areaConfig.selectedMethods,
        [serviceId]: newMethodId
      }
    });
  };

  const handleBiotaChange = (newBiota: 'flora' | 'fauna') => {
    updateAreaConfig(selectedAreaId, { biota: newBiota });
  };

  const handleOpenImport = (serviceName: string, methodName: string, category: string) => {
    setImportModalConfig({
      isOpen: true,
      serviceName,
      methodName,
      categoryName: category,
    });
  };

  const handleConfirmImportRows = (newRows: Record<string, any>[], detectedCustomColumns?: DetectedCustomColumn[]) => {
    const sId: EcosystemServiceId = importModalConfig.serviceName.toLowerCase().includes('provisioning') ? 'provisioning' :
                importModalConfig.serviceName.toLowerCase().includes('regulating') ? 'regulating' :
                importModalConfig.serviceName.toLowerCase().includes('supporting') ? 'supporting' : 'cultural';
    const mId = areaConfig.selectedMethods?.[sId] || (
      sId === 'provisioning' ? 'market-price' :
      sId === 'regulating' ? 'replacement-cost' :
      sId === 'supporting' ? 'nursery-ground' : 'tcm'
    );
    const biotaParam = sId === 'provisioning' ? areaConfig.biota || 'flora' : undefined;

    // Automatically register any newly detected custom columns from the Excel file
    if (detectedCustomColumns && detectedCustomColumns.length > 0) {
      addMultipleCustomColumns(
        currentProject?.id || routeProjId,
        selectedAreaId,
        sId,
        mId,
        biotaParam,
        detectedCustomColumns.map(c => ({ label: c.label, type: c.type }))
      );
    }

    importRows(
      currentProject?.id || routeProjId,
      selectedAreaId,
      sId,
      mId,
      sId === 'provisioning' ? areaConfig.biota || 'flora' : 'none',
      newRows
    );
    setImportModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  // -------------------------------------------------------------
  // FALLBACK 1: Project Not Found
  // -------------------------------------------------------------
  if (!currentProject) {
    return (
      <div className="p-8 max-w-2xl mx-auto my-12 bg-white border border-slate-200 rounded-lg shadow-sm text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <FolderX className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Project Tidak Ditemukan</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Project dengan kode atau ID &ldquo;<span className="font-mono font-bold text-slate-700">{routeProjId}</span>&rdquo; tidak ditemukan di dalam sistem.
        </p>
        <button
          onClick={() => navigate('/projects')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold cursor-pointer"
        >
          Kembali ke Daftar Proyek
        </button>
      </div>
    );
  }

  // -------------------------------------------------------------
  // FALLBACK 2: No Land Covers / Polygons in Project
  // -------------------------------------------------------------
  if (!landCovers || landCovers.length === 0) {
    return (
      <div className="p-8 max-w-2xl mx-auto my-12 bg-white border border-slate-200 rounded-lg shadow-sm text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
          <Layers className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Belum Ada Area Tutupan Lahan (SHP / Index)</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Project <strong>{currentProject.name}</strong> belum memiliki polygon tutupan lahan atau indeks kawasan.
          Silakan tentukan kawasan spasial terlebih dahulu pada tahap Maps & Index.
        </p>
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => navigate(`/projects/${routeProjId}/maps`)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold cursor-pointer"
          >
            Buka Peta Spasial (02 Maps)
          </button>
          <button
            onClick={() => navigate(`/projects/${routeProjId}/index`)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold cursor-pointer border border-slate-200"
          >
            Kelola Index (03 Index)
          </button>
        </div>
      </div>
    );
  }

  // Active services map (fallback to all 4 enabled if undefined)
  const activeServices = areaConfig.activeServices || {
    provisioning: true,
    regulating: true,
    supporting: true,
    cultural: true,
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto flex flex-col min-h-screen text-slate-800">
      {/* 1. Header (Restored Original Header with Project Context) */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Tahap 06</span>
            <span>•</span>
            <span className="text-blue-600">Spreadsheet Input Workspace</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5 mt-0.5">
            <TableProperties className="w-6 h-6 text-blue-600" />
            <span>Data Valuasi</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Pengisian variabel ilmiah seluruh jasa ekosistem aktif dalam lembar kerja spreadsheet terpisah dengan formula otomatis dan autosave.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
              {currentProject.code}
            </span>
            <span className="text-xs font-bold text-slate-800">{currentProject.name}</span>
          </div>
        </div>

        {/* Navigation forward button to 07 Perhitungan */}
        <button
          onClick={() => navigate(`/projects/${routeProjId}/calculation?area=${selectedAreaId}`)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs md:text-sm font-semibold flex items-center gap-2 transition-colors shadow-xs self-start md:self-auto cursor-pointer"
        >
          <span>Lanjut ke Perhitungan</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Area Selector Bar & Active Services Badges */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="text-slate-700 font-bold uppercase text-[11px] tracking-wider">
            Area Tutupan Lahan:
          </span>
          <select
            value={selectedAreaId}
            onChange={(e) => handleAreaChange(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-slate-900 font-bold focus:ring-1 focus:ring-blue-500 focus:outline-none cursor-pointer"
          >
            {landCovers.map(lc => (
              <option key={lc.id} value={lc.id}>
                {lc.name} ({formatNumber(lc.areaHa)} ha) — {lc.indexCode || lc.code}
              </option>
            ))}
          </select>
        </div>

        {/* Active service badges & Accordion Expand/Collapse Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400 text-[11px]">Jasa Aktif:</span>
            {activeServices.provisioning && (
              <span className="px-2 py-0.5 rounded bg-cyan-50 text-cyan-800 border border-cyan-200 text-[10px] font-semibold">
                A. Provisioning
              </span>
            )}
            {activeServices.regulating && (
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-semibold">
                B. Regulating
              </span>
            )}
            {activeServices.supporting && (
              <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200 text-[10px] font-semibold">
                C. Supporting
              </span>
            )}
            {activeServices.cultural && (
              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-semibold">
                D. Cultural
              </span>
            )}
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

          {/* Quick toggle all accordions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExpandAll}
              className="text-[11px] text-blue-600 hover:text-blue-800 font-medium hover:underline cursor-pointer"
            >
              Buka Semua
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={handleCollapseAll}
              className="text-[11px] text-slate-500 hover:text-slate-700 font-medium hover:underline cursor-pointer"
            >
              Tutup Semua
            </button>
          </div>
        </div>
      </div>

      {/* 3. Accordion Sections for All 4 Ecosystem Services (ALL 4 ON ONE PAGE) */}
      <div className="space-y-4">
        {/* SECTION A: Provisioning Services */}
        {activeServices.provisioning && (
          <DynamicServiceSection
            projectId={currentProject.id}
            prefixLetter="A"
            serviceId="provisioning"
            serviceName="Provisioning Services (Jasa Penyediaan)"
            methodId={areaConfig.selectedMethods?.provisioning || 'market-price'}
            biota={areaConfig.biota || 'flora'}
            areaId={selectedAreaId}
            areaName={currentArea?.name || 'Area'}
            areaHa={currentArea?.areaHa || 79.86}
            isOpen={openSections.provisioning}
            onToggleOpen={() => toggleSection('provisioning')}
            onMethodChange={(m) => handleMethodChange('provisioning', m)}
            onBiotaChange={handleBiotaChange}
            onOpenImportModal={handleOpenImport}
            highlightedRowId={highlightParam}
          />
        )}

        {/* SECTION B: Regulating Services */}
        {activeServices.regulating && (
          <DynamicServiceSection
            projectId={currentProject.id}
            prefixLetter="B"
            serviceId="regulating"
            serviceName="Regulating Services (Jasa Pengaturan)"
            methodId={areaConfig.selectedMethods?.regulating || 'replacement-cost'}
            areaId={selectedAreaId}
            areaName={currentArea?.name || 'Area'}
            areaHa={currentArea?.areaHa || 79.86}
            isOpen={openSections.regulating}
            onToggleOpen={() => toggleSection('regulating')}
            onMethodChange={(m) => handleMethodChange('regulating', m)}
            onOpenImportModal={handleOpenImport}
          />
        )}

        {/* SECTION C: Supporting Services */}
        {activeServices.supporting && (
          <DynamicServiceSection
            projectId={currentProject.id}
            prefixLetter="C"
            serviceId="supporting"
            serviceName="Supporting Services (Jasa Pendukung)"
            methodId={areaConfig.selectedMethods?.supporting || 'nursery-ground'}
            areaId={selectedAreaId}
            areaName={currentArea?.name || 'Area'}
            areaHa={currentArea?.areaHa || 79.86}
            isOpen={openSections.supporting}
            onToggleOpen={() => toggleSection('supporting')}
            onMethodChange={(m) => handleMethodChange('supporting', m)}
            onOpenImportModal={handleOpenImport}
          />
        )}

        {/* SECTION D: Cultural Services */}
        {activeServices.cultural && (
          <DynamicServiceSection
            projectId={currentProject.id}
            prefixLetter="D"
            serviceId="cultural"
            serviceName="Cultural Services (Jasa Budaya & Rekreasi)"
            methodId={areaConfig.selectedMethods?.cultural || 'tcm'}
            areaId={selectedAreaId}
            areaName={currentArea?.name || 'Area'}
            areaHa={currentArea?.areaHa || 79.86}
            isOpen={openSections.cultural}
            onToggleOpen={() => toggleSection('cultural')}
            onMethodChange={(m) => handleMethodChange('cultural', m)}
            onOpenImportModal={handleOpenImport}
          />
        )}
      </div>

      {/* 4. Bottom Navigation Banner (PURE INPUT STATE: NO RUPIAH / NO TEV / NO CALCULATION OUTPUT) */}
      <div className="p-5 bg-white rounded-lg border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs md:text-sm font-bold text-slate-900">
              Data Variabel Valuasi Siap Dihitung
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Seluruh variabel data ekosistem tersimpan otomatis. Perhitungan nilai nominal ekonomi (Rp) dan agregasi TEV diproses pada tahap selanjutnya.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate(`/projects/${routeProjId}/calculation?area=${selectedAreaId}`)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs md:text-sm font-semibold flex items-center gap-2 transition-colors shadow-xs self-start sm:self-auto cursor-pointer shrink-0"
        >
          <span>Lanjut ke 07 Perhitungan</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Context-bound Excel Import Modal */}
      <ExcelImportModal
        isOpen={importModalConfig.isOpen}
        onClose={() => setImportModalConfig(prev => ({ ...prev, isOpen: false }))}
        serviceName={importModalConfig.serviceName}
        methodName={importModalConfig.methodName}
        categoryName={importModalConfig.categoryName}
        onConfirmImport={handleConfirmImportRows}
      />
    </div>
  );
};

export const DataValuationPage: React.FC = () => {
  return (
    <ErrorBoundary
      fallbackTitle="Terjadi masalah saat memuat Data Valuasi."
      fallbackMessage="Komponen mengalami kendala render. Silakan coba muat ulang atau sesuaikan konfigurasi jasa dan metode."
    >
      <DataValuationPageContent />
    </ErrorBoundary>
  );
};

export default DataValuationPage;
