import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { useSpreadsheet } from '../context/SpreadsheetContext';
import { exportFullProjectWorkbook } from '../utils/excelEngine';
import { formatIDR, formatNumber, formatDate } from '../utils/formatter';
import { StatusBadge } from '../components/common/StatusBadge';
import { EcosystemServiceId } from '../types/valuation';
import { getHistoricalStudiesForArea } from '../mock/historicalAnalyticsMock';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import {
  FileCheck2,
  Download,
  Eye,
  Send,
  Sparkles,
  ExternalLink,
  MapPin,
  Tag,
  Layers,
  Database,
  SlidersHorizontal,
  TableProperties,
  Calculator,
  BarChart3,
  PieChart as PieIcon,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Check,
  ChevronDown,
  ChevronUp,
  X,
  Info,
  TrendingUp,
  Scale,
  History
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';

const ReviewReportPageContent: React.FC = () => {
  const params = useParams<{ projectId?: string }>();
  const {
    projects,
    activeProject,
    activeProjectId,
    setActiveProjectId,
    getProjectLandCovers,
    getProjectIndices,
    getProjectLayers,
    getAreaConfig,
    updateProjectStatus,
    simulateAnalystRejection,
    analystFeedback,
    resolveFeedback
  } = useProject();

  const {
    getRows,
    getServiceSubtotal,
    getGrandTotalForArea,
    getAllProjectRows
  } = useSpreadsheet();

  const navigate = useNavigate();

  // Route synchronization
  const routeProjId = params.projectId || activeProjectId;
  const currentProject = projects.find(p => p.id === routeProjId || p.code === routeProjId) || activeProject;
  const effectiveProjId = currentProject?.id || routeProjId || 'PKS-994KY1';

  // Sync activeProjectId if route parameter differs
  useEffect(() => {
    if (params.projectId && params.projectId !== activeProjectId) {
      const found = projects.find(p => p.id === params.projectId || p.code === params.projectId);
      if (found) {
        setActiveProjectId(found.id);
      }
    }
  }, [params.projectId, activeProjectId, projects, setActiveProjectId]);

  // Project's dynamic spatial items
  const currentLandCovers = (getProjectLandCovers ? getProjectLandCovers(effectiveProjId) : []) || [];
  const currentIndices = (getProjectIndices ? getProjectIndices(effectiveProjId) : []) || [];
  const currentLayers = (getProjectLayers ? getProjectLayers(effectiveProjId) : []) || [];

  // State management
  const [selectedAreaId, setSelectedAreaId] = useState<string>(currentLandCovers[0]?.id || 'poly-1');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Sync selectedAreaId when currentLandCovers change
  useEffect(() => {
    if (currentLandCovers.length > 0 && !currentLandCovers.some(lc => lc.id === selectedAreaId)) {
      setSelectedAreaId(currentLandCovers[0].id);
    }
  }, [currentLandCovers, selectedAreaId]);

  // Accordion state for read-only tables in Input Data section
  const [openSections, setOpenSections] = useState<Record<EcosystemServiceId, boolean>>({
    provisioning: true,
    regulating: true,
    supporting: false,
    cultural: false
  });

  const toggleSection = (serviceId: EcosystemServiceId) => {
    setOpenSections(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  const allProjectRows = getAllProjectRows(effectiveProjId);
  const currentArea = currentLandCovers.find(lc => lc.id === selectedAreaId) || currentLandCovers[0];
  const currentAreaConfig = getAreaConfig(selectedAreaId);

  // Helper calculation for each service with robust fallbacks (exact same as AnalyticsPage)
  const getSubtotalForService = (sId: EcosystemServiceId): number => {
    return currentLandCovers.reduce((sum, lc) => {
      const cfg = getAreaConfig ? getAreaConfig(lc.id) : null;
      if (cfg?.activeServices && !cfg.activeServices[sId]) {
        return sum;
      }
      if (Array.isArray(lc.activeServices) && !lc.activeServices.includes(sId)) {
        return sum;
      }
      const m = cfg?.selectedMethods ? cfg.selectedMethods[sId] : undefined;
      const sub = getServiceSubtotal(effectiveProjId, lc.id, sId, m || '', sId === 'provisioning' ? (cfg?.biota || 'flora') : undefined);
      if (sub > 0) return sum + sub;

      // Fallback to pre-calculated serviceDetails if available on polygon
      if (Array.isArray(lc.serviceDetails)) {
        const detail = lc.serviceDetails.find(d => d.serviceId === sId);
        if (detail && detail.value > 0) {
          return sum + detail.value;
        }
      }

      return sum + (sub || 0);
    }, 0);
  };

  // Dynamic Totals per Ecosystem Service across all landcovers
  const provTotal = Math.max(0, getSubtotalForService('provisioning'));
  const regTotal = Math.max(0, getSubtotalForService('regulating'));
  const suppTotal = Math.max(0, getSubtotalForService('supporting'));
  const cultTotal = Math.max(0, getSubtotalForService('cultural'));

  const directValue = provTotal + cultTotal;
  const indirectValue = regTotal;
  const supportingValue = suppTotal;
  const grandTEV = provTotal + regTotal + suppTotal + cultTotal;

  // Validation readiness
  const isReadyForReview = Boolean(currentProject && currentIndices.length > 0 && (allProjectRows.length > 0 || grandTEV > 0) && grandTEV > 0);
  const isSubmitted = currentProject?.status === 'MENUNGGU_ANALYST';
  const isNeedsRevision = currentProject?.status === 'PERLU_PERBAIKAN';
  const isCompleted = currentProject?.status === 'SELESAI';

  // Analytics Chart Data
  const compositionData = [
    { name: 'Direct Use Value', value: Math.max(0, directValue), color: '#2563eb' },
    { name: 'Indirect Use Value', value: Math.max(0, indirectValue), color: '#0ea5e9' },
    { name: 'Supporting Value', value: Math.max(0, supportingValue), color: '#8b5cf6' }
  ];

  const serviceBarData = [
    { name: 'Provisioning', value: Math.max(0, provTotal), fill: '#0e7490' },
    { name: 'Regulating', value: Math.max(0, regTotal), fill: '#2563eb' },
    { name: 'Supporting', value: Math.max(0, suppTotal), fill: '#7c3aed' },
    { name: 'Cultural', value: Math.max(0, cultTotal), fill: '#d97706' }
  ];

  const areaComparisonData = currentLandCovers.map(lc => {
    let total = 0;
    const cfg = getAreaConfig ? getAreaConfig(lc.id) : null;
    if (cfg?.activeServices && cfg?.selectedMethods) {
      total = getGrandTotalForArea(effectiveProjId, lc.id, cfg.activeServices, cfg.selectedMethods, 'flora');
    }
    if ((!total || total === 0) && lc.totalValue) {
      total = lc.totalValue;
    }
    return {
      name: lc.name || 'Area',
      luas: lc.areaHa || 0,
      total: Math.max(0, total || 0)
    };
  });

  // Defensive flags for charts to prevent NaN
  const hasCompositionData = grandTEV > 0 && compositionData.some(d => d.value > 0);
  const hasServiceData = serviceBarData.some(s => s.value > 0);
  const hasAreaData = areaComparisonData.length > 0 && areaComparisonData.some(a => a.total > 0);

  // Top area for summary
  const sortedAreas = [...areaComparisonData].sort((a, b) => b.total - a.total);
  const topArea = sortedAreas[0];

  // Dominant service
  const sortedServices = [...serviceBarData].sort((a, b) => b.value - a.value);
  const dominantService = sortedServices[0];

  // -------------------------------------------------------------
  // HISTORICAL ANALYTICS DATA (SESUAI DENGAN ANALYTICS TERBARU)
  // -------------------------------------------------------------
  const targetArea = currentLandCovers.find(l => l.id === 'poly-1') || currentLandCovers[0] || null;
  const historicalStudies = targetArea
    ? getHistoricalStudiesForArea(targetArea.id, targetArea.name, targetArea.code)
    : [];

  const totalAreaHa = currentLandCovers.reduce((sum, lc) => sum + (Number(lc.areaHa) || 0), 0);
  const targetAreaHa = Number(targetArea?.areaHa) || totalAreaHa;
  const tevPerHa = totalAreaHa > 0 ? Math.round(grandTEV / totalAreaHa) : 0;
  const targetTevPerHa = targetAreaHa > 0 ? Math.round((targetArea?.totalValue || grandTEV) / targetAreaHa) : tevPerHa;

  const combinedTimeline = historicalStudies.length > 0 ? [
    ...historicalStudies.map(s => ({
      id: s.id,
      year: s.year,
      studyTitle: s.studyTitle,
      areaName: s.areaName,
      areaHa: s.areaHa,
      tev: s.tev,
      tevPerHa: s.tevPerHa,
      source: s.institution,
      isCurrent: false
    })),
    {
      id: 'CURRENT-2026',
      year: 2026,
      studyTitle: currentProject?.name || 'Penelitian Saat Ini',
      areaName: targetArea?.name || 'Area Penelitian',
      areaHa: targetAreaHa,
      tev: targetArea?.totalValue || grandTEV,
      tevPerHa: targetTevPerHa,
      source: `PKSPL IPB (${currentProject?.code || effectiveProjId})`,
      isCurrent: true
    }
  ].sort((a, b) => a.year - b.year) : [];

  const totalPeriods = combinedTimeline.length;
  const previousStudy = combinedTimeline.length >= 2 ? combinedTimeline[combinedTimeline.length - 2] : null;
  const currentStudy = combinedTimeline.length > 0 ? combinedTimeline[combinedTimeline.length - 1] : null;

  const tevDiffNominal = (currentStudy && previousStudy) ? (currentStudy.tev - previousStudy.tev) : 0;
  const tevDiffPct = (currentStudy && previousStudy && previousStudy.tev > 0)
    ? ((currentStudy.tev - previousStudy.tev) / previousStudy.tev) * 100
    : 0;

  // Data Line Chart
  const historicalLineData = combinedTimeline.map(s => ({
    year: String(s.year),
    tevMiliar: Number((s.tev / 1e9).toFixed(2)),
    tevRaw: s.tev,
    tevPerHaJuta: Number((s.tevPerHa / 1e6).toFixed(2)),
    tevPerHaRaw: s.tevPerHa,
    title: s.studyTitle,
    isCurrent: s.isCurrent
  }));

  const customTooltipFormatter = (val: any) => [formatIDR(Number(val)), 'Nilai'];

  // Export Excel 13-sheet
  const handleExportExcel = () => {
    if (!currentProject) return;
    setIsExporting(true);
    try {
      const refAreaId = currentLandCovers[0]?.id || 'poly-1';
      const refConfig = getAreaConfig(refAreaId);
      const provRows = getRows(effectiveProjId, refAreaId, 'provisioning', refConfig.selectedMethods.provisioning, 'flora');
      const regRows = getRows(effectiveProjId, refAreaId, 'regulating', refConfig.selectedMethods.regulating);
      const suppRows = getRows(effectiveProjId, refAreaId, 'supporting', refConfig.selectedMethods.supporting);
      const cultRows = getRows(effectiveProjId, refAreaId, 'cultural', refConfig.selectedMethods.cultural);

      exportFullProjectWorkbook(currentProject, currentLandCovers, provRows as any, {
        indices: currentIndices,
        provRows,
        regRows,
        suppRows,
        cultRows,
        tevTotals: { prov: provTotal, reg: regTotal, supp: suppTotal, cult: cultTotal, grand: grandTEV }
      });
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleConfirmSubmit = () => {
    if (!currentProject) return;
    updateProjectStatus(currentProject.id, 'MENUNGGU_ANALYST');
    setIsConfirmModalOpen(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 text-slate-800">
      {/* 1. Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 bg-white p-5 rounded-xl shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Tahap 09</span>
            <span>•</span>
            <span className="text-blue-600">Dokumen Final Peneliti</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5 mt-0.5">
            <FileCheck2 className="w-6 h-6 text-blue-600" />
            <span>Review & Laporan</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Periksa kembali seluruh data dan hasil penelitian sebelum diajukan kepada Analyst.
          </p>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
              {currentProject?.code}
            </span>
            <span className="text-xs font-bold text-slate-800">{currentProject?.name}</span>
            <span className="text-slate-300">•</span>
            <StatusBadge status={isNeedsRevision ? 'PERLU_PERBAIKAN' : isSubmitted ? 'MENUNGGU_ANALYST' : isReadyForReview ? 'DRAFT' : 'DRAFT'} />
            {isReadyForReview && !isSubmitted && !isNeedsRevision && (
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                ✓ Siap Review
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons: Preview & Export */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={() => navigate(`/projects/${effectiveProjId}/review/preview`)}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Eye className="w-4 h-4 text-slate-500" />
            <span>Preview Laporan</span>
          </button>

          <button
            onClick={handleExportExcel}
            disabled={isExporting}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            title="Ekspor seluruh 13 lembar kerja riset"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Mengekspor...' : 'Export Excel'}</span>
          </button>
        </div>
      </div>

      {/* Analyst Feedback Banner if Returned */}
      {isNeedsRevision && (
        <div className="p-4 bg-rose-50 border-l-4 border-rose-600 rounded-r-lg shadow-2xs space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-rose-900 text-sm">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <span>⚠ Proyek Memerlukan Perbaikan dari Analyst</span>
            </div>
            <button
              onClick={resolveFeedback}
              className="text-xs bg-white text-rose-700 border border-rose-300 hover:bg-rose-100 font-semibold px-2.5 py-1 rounded cursor-pointer transition-colors"
            >
              Tandai Telah Diperbaiki
            </button>
          </div>
          <div className="text-xs text-rose-800 leading-relaxed bg-white/80 p-3 rounded border border-rose-200">
            <div className="font-semibold text-rose-900">
              Temuan Analyst: Provisioning Services → Market Price → Flora → Cemara Laut
            </div>
            <p className="mt-0.5 text-rose-700">
              Komentar: "Harga unit kayu Cemara Laut (Casuarina equisetifolia) perlu disesuaikan dengan standar batas atas HET Regional Bali tahun 2026."
            </p>
          </div>
          <div className="text-right">
            <button
              onClick={() => navigate(`/projects/${effectiveProjId}/valuation-data?area=${selectedAreaId}&service=provisioning`)}
              className="text-xs font-bold text-rose-700 hover:text-rose-900 underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>[ Lihat Data Sumber & Perbaiki ]</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Internal Validation Status Indicator */}
      {!isSubmitted && (
        <div className={`p-4 rounded-lg border text-xs flex items-center justify-between ${
          isReadyForReview ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}>
          <div className="flex items-center gap-2.5">
            {isReadyForReview ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            )}
            <div>
              <span className="font-bold uppercase tracking-wider text-[11px] block">
                {isReadyForReview ? 'Status Kelengkapan: Siap Review' : 'Status Kelengkapan: Belum Lengkap'}
              </span>
              <p className="mt-0.5">
                {isReadyForReview
                  ? 'Seluruh data penelitian telah terisi lengkap, teragregasi secara otomatis, dan siap diajukan ke Analyst.'
                  : 'Masih ada data input spreadsheet atau index yang perlu diisi sebelum dapat dikirim ke Analyst.'}
              </p>
            </div>
          </div>

          {!isReadyForReview && (
            <button
              onClick={() => navigate(`/projects/${effectiveProjId}/valuation-data`)}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold cursor-pointer whitespace-nowrap"
            >
              Lengkapi Data
            </button>
          )}
        </div>
      )}

      {/* 2. SECTION INFORMASI PROYEK (Read-Only) */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Informasi Proyek
            </h2>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Read-Only</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
          <div>
            <span className="text-slate-400 font-bold uppercase text-[10px]">Kode Proyek</span>
            <div className="text-sm font-mono font-bold text-blue-700 mt-0.5">{currentProject?.code}</div>
          </div>
          <div>
            <span className="text-slate-400 font-bold uppercase text-[10px]">Nama Penelitian</span>
            <div className="text-sm font-bold text-slate-900 mt-0.5">{currentProject?.name}</div>
          </div>
          <div>
            <span className="text-slate-400 font-bold uppercase text-[10px]">Penanggung Jawab</span>
            <div className="text-sm font-semibold text-slate-800 mt-0.5">{currentProject?.lead}</div>
          </div>
          <div>
            <span className="text-slate-400 font-bold uppercase text-[10px]">Lokasi Kawasan</span>
            <div className="text-sm text-slate-700 mt-0.5">{currentProject?.location}</div>
          </div>
          <div>
            <span className="text-slate-400 font-bold uppercase text-[10px]">Tipe Ekosistem</span>
            <div className="text-sm text-slate-700 mt-0.5">{currentProject?.ecosystem}</div>
          </div>
          <div>
            <span className="text-slate-400 font-bold uppercase text-[10px]">Status Berkas</span>
            <div className="mt-1">
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-semibold text-[11px]">
                {currentProject?.status === 'MENUNGGU_ANALYST' ? 'Menunggu Review Analyst' : 'Siap Review'}
              </span>
            </div>
          </div>
          <div className="md:col-span-2 lg:col-span-3 pt-2 border-t border-slate-100">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Deskripsi Penelitian</span>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{currentProject?.description}</p>
          </div>
        </div>
      </section>

      {/* 3. SECTION 01: INDEX & AREA TUTUPAN LAHAN (Read-Only) */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              01. Index & Area Tutupan Lahan
            </h2>
          </div>
          <button
            onClick={() => navigate(`/projects/${effectiveProjId}/index`)}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer hover:underline"
          >
            <span>[ Lihat Data ]</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs border border-slate-200">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 border-r border-slate-200 w-28">Kode Index</th>
                <th className="py-2.5 px-3 border-r border-slate-200">Nama Index</th>
                <th className="py-2.5 px-3 border-r border-slate-200">Area Tutupan Lahan</th>
                <th className="py-2.5 px-3 border-r border-slate-200 text-right w-28">Luas</th>
                <th className="py-2.5 px-3 border-r border-slate-200 text-center w-36">Data Spasial</th>
                <th className="py-2.5 px-3 text-center w-28">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {currentIndices.map(idx => (
                <tr key={idx.id} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-mono font-bold text-blue-700 border-r border-slate-200">
                    {idx.code}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800 border-r border-slate-200">
                    {idx.name}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 border-r border-slate-200">
                    {idx.landCoverName || idx.landCoverType || 'Mangrove'}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-medium border-r border-slate-200">
                    {formatNumber(idx.areaHa || 50)} {idx.unit || 'ha'}
                  </td>
                  <td className="py-2.5 px-3 text-center border-r border-slate-200">
                    {idx.spatialStatus === 'connected' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold border border-emerald-200">
                        <Check className="w-3 h-3" />
                        Terhubung
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium">
                        ○ Belum terhubung
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="text-[11px] text-slate-600 font-medium px-2 py-0.5 rounded bg-slate-100">
                      {idx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. SECTION 02: DATA SPASIAL (Read-Only) */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              02. Data Spasial
            </h2>
          </div>
          <button
            onClick={() => navigate(`/projects/${effectiveProjId}/maps`)}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer hover:underline"
          >
            <span>[ Buka Peta GIS ]</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {currentLayers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Layer Aktif</span>
              <div className="font-bold text-slate-800 text-sm mt-0.5">Area Tutupan Lahan</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Vector Polygon GIS</div>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Status Integrasi</span>
              <div className="font-bold text-emerald-700 text-sm mt-0.5 flex items-center gap-1">
                <Check className="w-4 h-4" />
                ✓ Terhubung
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">CRS & Geometri Sinkron</div>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Jumlah Polygon</span>
              <div className="font-bold text-slate-900 text-sm mt-0.5">{currentLandCovers.length} Feature Poligon</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Total Luas: {formatNumber(currentLandCovers.reduce((s, c) => s + c.areaHa, 0))} ha</div>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Sistem Koordinat (CRS)</span>
              <div className="font-bold text-slate-800 text-sm mt-0.5">WGS 1984 / UTM 50S</div>
              <div className="text-[11px] text-slate-500 mt-0.5">EPSG: 4326 Datum Standar</div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>Data spasial tidak digunakan pada penelitian ini (opsional). Seluruh perhitungan berbasis luas tabulasi statistik.</span>
          </div>
        )}
      </section>

      {/* 5. SECTION 03: DATA MASTER (Read-Only) */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              03. Data Master
            </h2>
          </div>
          <button
            onClick={() => navigate(`/projects/${effectiveProjId}/data-master`)}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer hover:underline"
          >
            <span>[ Lihat Data ]</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px]">Katalog Vegetasi</span>
              <div className="text-lg font-bold text-slate-900 mt-0.5">24 data spesies</div>
              <p className="text-[11px] text-slate-500 mt-0.5">Rhizophora, Avicennia, Sonneratia, dll.</p>
            </div>
            <button
              onClick={() => navigate(`/projects/${effectiveProjId}/data-master`)}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline"
            >
              Lihat
            </button>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px]">Objek / Komoditas Pajak</span>
              <div className="text-lg font-bold text-slate-900 mt-0.5">12 data standar</div>
              <p className="text-[11px] text-slate-500 mt-0.5">NJOP perikanan & retribusi jasa</p>
            </div>
            <button
              onClick={() => navigate(`/projects/${effectiveProjId}/data-master`)}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline"
            >
              Lihat
            </button>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px]">Parameter Pendukung</span>
              <div className="text-lg font-bold text-slate-900 mt-0.5">8 data referensi</div>
              <p className="text-[11px] text-slate-500 mt-0.5">Biomass carbon factor & shadow price</p>
            </div>
            <button
              onClick={() => navigate(`/projects/${effectiveProjId}/data-master`)}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline"
            >
              Lihat
            </button>
          </div>
        </div>
      </section>

      {/* 6. SECTION 04: JASA & METODE (Read-Only) */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              04. Jasa & Metode
            </h2>
          </div>
          <button
            onClick={() => navigate(`/projects/${effectiveProjId}/services-methods`)}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer hover:underline"
          >
            <span>[ Lihat Konfigurasi Jasa ]</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Provisioning */}
          <div className="p-4 rounded-lg border border-cyan-200 bg-cyan-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-cyan-900 text-xs">Provisioning Services</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium text-[10px]">
                ✓ Dikonfigurasi
              </span>
            </div>
            <div className="text-sm font-semibold text-slate-900">Market Price</div>
            <div className="text-[11px] text-slate-500">Biota: Flora & Fauna Mangrove</div>
            <div className="pt-2 border-t border-cyan-200/60 flex justify-end">
              <button
                onClick={() => navigate(`/projects/${effectiveProjId}/services-methods`)}
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline text-[11px]"
              >
                [ Lihat Data ]
              </button>
            </div>
          </div>

          {/* Regulating */}
          <div className="p-4 rounded-lg border border-blue-200 bg-blue-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-900 text-xs">Regulating Services</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium text-[10px]">
                ✓ Dikonfigurasi
              </span>
            </div>
            <div className="text-sm font-semibold text-slate-900">Replacement Cost</div>
            <div className="text-[11px] text-slate-500">Pemecah Gelombang & Carbon Blue</div>
            <div className="pt-2 border-t border-blue-200/60 flex justify-end">
              <button
                onClick={() => navigate(`/projects/${effectiveProjId}/services-methods`)}
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline text-[11px]"
              >
                [ Lihat Data ]
              </button>
            </div>
          </div>

          {/* Supporting */}
          <div className="p-4 rounded-lg border border-purple-200 bg-purple-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-900 text-xs">Supporting Services</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium text-[10px]">
                ✓ Dikonfigurasi
              </span>
            </div>
            <div className="text-sm font-semibold text-slate-900">Habitat & Nursery Ground</div>
            <div className="text-[11px] text-slate-500">Tempat Asuhan & Rekrutmen Benih</div>
            <div className="pt-2 border-t border-purple-200/60 flex justify-end">
              <button
                onClick={() => navigate(`/projects/${effectiveProjId}/services-methods`)}
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline text-[11px]"
              >
                [ Lihat Data ]
              </button>
            </div>
          </div>

          {/* Cultural */}
          <div className="p-4 rounded-lg border border-amber-200 bg-amber-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-900 text-xs">Cultural Services</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium text-[10px]">
                ✓ Dikonfigurasi
              </span>
            </div>
            <div className="text-sm font-semibold text-slate-900">TCM (Travel Cost Method)</div>
            <div className="text-[11px] text-slate-500">Ekowisata & Rekreasi Pantai</div>
            <div className="pt-2 border-t border-amber-200/60 flex justify-end">
              <button
                onClick={() => navigate(`/projects/${effectiveProjId}/services-methods`)}
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline text-[11px]"
              >
                [ Lihat Data ]
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SECTION 05: DATA VALUASI — SELURUH TABEL (Bagian Terpenting, Read-Only) */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <TableProperties className="w-5 h-5 text-blue-600" />
              <h2 className="text-sm md:text-base font-bold uppercase tracking-wider text-slate-900">
                05. Data Valuasi — Seluruh Tabel Penelitian
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Tabel lengkap variabel penelitian dari seluruh seksi jasa ekosistem aktif. Seluruh sel bersifat <strong>Read-Only</strong>.
            </p>
          </div>

          {/* Area Selector Switcher */}
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200 text-xs self-start sm:self-auto">
            <span className="font-semibold text-slate-600 text-[11px] pl-1">Area Tutupan:</span>
            <select
              value={selectedAreaId}
              onChange={(e) => setSelectedAreaId(e.target.value)}
              className="bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-900 font-bold focus:outline-none cursor-pointer"
            >
              {currentLandCovers.map(lc => (
                <option key={lc.id} value={lc.id}>
                  {lc.name} ({lc.areaHa} ha) — {lc.indexCode}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Accordions for All 4 Services */}
        <div className="space-y-4">
          {/* A. PROVISIONING SERVICES TABLE */}
          {currentAreaConfig.activeServices.provisioning && (() => {
            const pRows = getRows(effectiveProjId, selectedAreaId, 'provisioning', currentAreaConfig.selectedMethods.provisioning, 'flora');
            const pSub = getServiceSubtotal(effectiveProjId, selectedAreaId, 'provisioning', currentAreaConfig.selectedMethods.provisioning, 'flora');

            return (
              <div className="border border-cyan-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <div
                  onClick={() => toggleSection('provisioning')}
                  className="px-5 py-3.5 bg-cyan-50/60 flex items-center justify-between cursor-pointer hover:bg-cyan-50 transition-colors border-b border-cyan-100"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded bg-cyan-600 text-white font-bold flex items-center justify-center text-xs">
                      A
                    </span>
                    <div>
                      <span className="font-bold text-slate-900 text-xs">
                        Provisioning Services (Jasa Penyediaan)
                      </span>
                      <div className="text-[11px] text-slate-500">
                        Metode: Market Price • {pRows.length} baris data
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-mono font-bold text-cyan-900 text-sm">
                      {formatIDR(pSub)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/projects/${effectiveProjId}/valuation-data?area=${selectedAreaId}&service=provisioning`);
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 font-semibold hover:underline hidden sm:inline cursor-pointer"
                    >
                      [ Buka di Data Valuasi ]
                    </button>
                    {openSections.provisioning ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {openSections.provisioning && (
                  <div className="overflow-x-auto p-4">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100/70 text-slate-700 font-semibold border-b border-slate-200 text-[11px] uppercase">
                          <th className="py-2.5 px-3 w-10 text-center">No</th>
                          <th className="py-2.5 px-3">Jenis Komoditas / Biota</th>
                          <th className="py-2.5 px-3 text-right">Produktivitas</th>
                          <th className="py-2.5 px-3 text-center">Satuan</th>
                          <th className="py-2.5 px-3 text-right">Harga / Unit</th>
                          <th className="py-2.5 px-3 text-right">Jumlah / Volume</th>
                          <th className="py-2.5 px-3 text-right">Luas (Ha)</th>
                          <th className="py-2.5 px-3 text-right font-bold">Total Nilai</th>
                          <th className="py-2.5 px-3">Sumber Data</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {pRows.map((r, idx) => (
                          <tr key={r.id || idx} className="hover:bg-slate-50/60">
                            <td className="py-2.5 px-3 text-center font-mono text-slate-400">{idx + 1}</td>
                            <td className="py-2.5 px-3 font-semibold text-slate-900">{r.item || r.namaKomoditas}</td>
                            <td className="py-2.5 px-3 text-right font-mono">{r.produktivitas || '-'}</td>
                            <td className="py-2.5 px-3 text-center text-slate-500">{r.satuan}</td>
                            <td className="py-2.5 px-3 text-right font-mono">{formatIDR(r.hargaUnit || r.hargaKomoditas || 0)}</td>
                            <td className="py-2.5 px-3 text-right font-mono">{r.volumeOutput || r.jumlah || '-'}</td>
                            <td className="py-2.5 px-3 text-right font-mono">{r.luasHa || currentArea.areaHa}</td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">{formatIDR(r.totalNilai || 0)}</td>
                            <td className="py-2.5 px-3 text-slate-500 text-[11px] italic">{r.source || 'Survei Peneliti'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })()}

          {/* B. REGULATING SERVICES TABLE */}
          {currentAreaConfig.activeServices.regulating && (() => {
            const rRows = getRows(effectiveProjId, selectedAreaId, 'regulating', currentAreaConfig.selectedMethods.regulating);
            const rSub = getServiceSubtotal(effectiveProjId, selectedAreaId, 'regulating', currentAreaConfig.selectedMethods.regulating);

            return (
              <div className="border border-blue-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <div
                  onClick={() => toggleSection('regulating')}
                  className="px-5 py-3.5 bg-blue-50/60 flex items-center justify-between cursor-pointer hover:bg-blue-50 transition-colors border-b border-blue-100"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                      B
                    </span>
                    <div>
                      <span className="font-bold text-slate-900 text-xs">
                        Regulating Services (Jasa Pengaturan)
                      </span>
                      <div className="text-[11px] text-slate-500">
                        Metode: Replacement Cost / Carbon • {rRows.length} baris data
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-mono font-bold text-blue-900 text-sm">
                      {formatIDR(rSub)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/projects/${effectiveProjId}/valuation-data?area=${selectedAreaId}&service=regulating`);
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 font-semibold hover:underline hidden sm:inline cursor-pointer"
                    >
                      [ Buka di Data Valuasi ]
                    </button>
                    {openSections.regulating ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {openSections.regulating && (
                  <div className="overflow-x-auto p-4">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100/70 text-slate-700 font-semibold border-b border-slate-200 text-[11px] uppercase">
                          <th className="py-2.5 px-3 w-10 text-center">No</th>
                          <th className="py-2.5 px-3">Fungsi / Aset Pengaturan</th>
                          <th className="py-2.5 px-3">Satuan / Parameter</th>
                          <th className="py-2.5 px-3 text-right">Biaya / Harga Unit</th>
                          <th className="py-2.5 px-3 text-right font-bold">Total Nilai</th>
                          <th className="py-2.5 px-3">Sumber Rujukan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {rRows.map((r, idx) => (
                          <tr key={r.id || idx} className="hover:bg-slate-50/60">
                            <td className="py-2.5 px-3 text-center font-mono text-slate-400">{idx + 1}</td>
                            <td className="py-2.5 px-3 font-semibold text-slate-900">{r.item || r.fungsi || r.zona}</td>
                            <td className="py-2.5 px-3 text-slate-600">{r.param || r.panjangUnit || r.stokKarbon || '-'}</td>
                            <td className="py-2.5 px-3 text-right font-mono">{formatIDR(r.unitPrice || r.biayaUnit || r.hargaKarbon || 0)}</td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">{formatIDR(r.totalNilai || 0)}</td>
                            <td className="py-2.5 px-3 text-slate-500 text-[11px] italic">{r.source || r.dasarRujukan || 'Dinas PU & IPCC'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })()}

          {/* C. SUPPORTING SERVICES TABLE */}
          {currentAreaConfig.activeServices.supporting && (() => {
            const sRows = getRows(effectiveProjId, selectedAreaId, 'supporting', currentAreaConfig.selectedMethods.supporting);
            const sSub = getServiceSubtotal(effectiveProjId, selectedAreaId, 'supporting', currentAreaConfig.selectedMethods.supporting);

            return (
              <div className="border border-purple-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <div
                  onClick={() => toggleSection('supporting')}
                  className="px-5 py-3.5 bg-purple-50/60 flex items-center justify-between cursor-pointer hover:bg-purple-50 transition-colors border-b border-purple-100"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded bg-purple-600 text-white font-bold flex items-center justify-center text-xs">
                      C
                    </span>
                    <div>
                      <span className="font-bold text-slate-900 text-xs">
                        Supporting Services (Jasa Pendukung)
                      </span>
                      <div className="text-[11px] text-slate-500">
                        Metode: Habitat & Nursery Ground • {sRows.length} baris data
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-mono font-bold text-purple-900 text-sm">
                      {formatIDR(sSub)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/projects/${effectiveProjId}/valuation-data?area=${selectedAreaId}&service=supporting`);
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 font-semibold hover:underline hidden sm:inline cursor-pointer"
                    >
                      [ Buka di Data Valuasi ]
                    </button>
                    {openSections.supporting ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {openSections.supporting && (
                  <div className="overflow-x-auto p-4">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100/70 text-slate-700 font-semibold border-b border-slate-200 text-[11px] uppercase">
                          <th className="py-2.5 px-3 w-10 text-center">No</th>
                          <th className="py-2.5 px-3">Fungsi Penopang / Biota Asuhan</th>
                          <th className="py-2.5 px-3 text-right">Luas Ekosistem (Ha)</th>
                          <th className="py-2.5 px-3 text-right">Kontribusi Rekrutmen / Ha</th>
                          <th className="py-2.5 px-3 text-right font-bold">Total Nilai</th>
                          <th className="py-2.5 px-3">Dasar Rujukan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {sRows.map((r, idx) => (
                          <tr key={r.id || idx} className="hover:bg-slate-50/60">
                            <td className="py-2.5 px-3 text-center font-mono text-slate-400">{idx + 1}</td>
                            <td className="py-2.5 px-3 font-semibold text-slate-900">{r.item || r.fungsi}</td>
                            <td className="py-2.5 px-3 text-right font-mono">{r.luasHa || currentArea.areaHa}</td>
                            <td className="py-2.5 px-3 text-right font-mono">{formatIDR(r.unitVal || r.nilaiKontribusiHa || 0)}</td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">{formatIDR(r.totalNilai || 0)}</td>
                            <td className="py-2.5 px-3 text-slate-500 text-[11px] italic">{r.source || 'Studi Valuasi PKSPL'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })()}

          {/* D. CULTURAL SERVICES TABLE */}
          {currentAreaConfig.activeServices.cultural && (() => {
            const cRows = getRows(effectiveProjId, selectedAreaId, 'cultural', currentAreaConfig.selectedMethods.cultural);
            const cSub = getServiceSubtotal(effectiveProjId, selectedAreaId, 'cultural', currentAreaConfig.selectedMethods.cultural);

            return (
              <div className="border border-amber-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <div
                  onClick={() => toggleSection('cultural')}
                  className="px-5 py-3.5 bg-amber-50/60 flex items-center justify-between cursor-pointer hover:bg-amber-50 transition-colors border-b border-amber-100"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded bg-amber-600 text-white font-bold flex items-center justify-center text-xs">
                      D
                    </span>
                    <div>
                      <span className="font-bold text-slate-900 text-xs">
                        Cultural Services (Jasa Budaya & Rekreasi)
                      </span>
                      <div className="text-[11px] text-slate-500">
                        Metode: Travel Cost Method (TCM) • {cRows.length} baris data
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-mono font-bold text-amber-900 text-sm">
                      {formatIDR(cSub)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/projects/${effectiveProjId}/valuation-data?area=${selectedAreaId}&service=cultural`);
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 font-semibold hover:underline hidden sm:inline cursor-pointer"
                    >
                      [ Buka di Data Valuasi ]
                    </button>
                    {openSections.cultural ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {openSections.cultural && (
                  <div className="overflow-x-auto p-4">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100/70 text-slate-700 font-semibold border-b border-slate-200 text-[11px] uppercase">
                          <th className="py-2.5 px-3 w-10 text-center">No</th>
                          <th className="py-2.5 px-3">Program / Objek Wisata</th>
                          <th className="py-2.5 px-3 text-right">Jumlah Kunjungan / Responden</th>
                          <th className="py-2.5 px-3 text-right">Biaya / WTP per Satuan</th>
                          <th className="py-2.5 px-3 text-right font-bold">Total Nilai</th>
                          <th className="py-2.5 px-3">Sumber Data Survei</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {cRows.map((r, idx) => (
                          <tr key={r.id || idx} className="hover:bg-slate-50/60">
                            <td className="py-2.5 px-3 text-center font-mono text-slate-400">{idx + 1}</td>
                            <td className="py-2.5 px-3 font-semibold text-slate-900">{r.item || r.program}</td>
                            <td className="py-2.5 px-3 text-right font-mono">{formatNumber(r.visit || r.jumlahKunjungan || r.jumlahResponden || 0)}</td>
                            <td className="py-2.5 px-3 text-right font-mono">{formatIDR(r.cost || r.biayaTrip || r.wtp || 0)}</td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">{formatIDR(r.totalNilai || 0)}</td>
                            <td className="py-2.5 px-3 text-slate-500 text-[11px] italic">{r.source || 'Kuesioner Pengunjung'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </section>

      {/* 8. SECTION 06: PERHITUNGAN (Read-Only) */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              06. Perhitungan
            </h2>
          </div>
          <button
            onClick={() => navigate(`/projects/${effectiveProjId}/calculation`)}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer hover:underline"
          >
            <span>[ Lihat Agregasi Perhitungan ]</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-cyan-50/60 border border-cyan-200 rounded-lg">
            <div className="text-[10px] font-bold text-cyan-800 uppercase">Provisioning Services</div>
            <div className="text-base font-mono font-bold text-slate-900 mt-1">{formatIDR(provTotal)}</div>
            <p className="text-[10px] text-slate-500 mt-1">Produktivitas × Luas × Harga Pasar</p>
          </div>

          <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-lg">
            <div className="text-[10px] font-bold text-blue-800 uppercase">Regulating Services</div>
            <div className="text-base font-mono font-bold text-slate-900 mt-1">{formatIDR(regTotal)}</div>
            <p className="text-[10px] text-slate-500 mt-1">Replacement Cost + Blue Carbon</p>
          </div>

          <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-lg">
            <div className="text-[10px] font-bold text-purple-800 uppercase">Supporting Services</div>
            <div className="text-base font-mono font-bold text-slate-900 mt-1">{formatIDR(suppTotal)}</div>
            <p className="text-[10px] text-slate-500 mt-1">Habitat Function × Kontribusi Rekrutmen</p>
          </div>

          <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-lg">
            <div className="text-[10px] font-bold text-amber-800 uppercase">Cultural Services</div>
            <div className="text-base font-mono font-bold text-slate-900 mt-1">{formatIDR(cultTotal)}</div>
            <p className="text-[10px] text-slate-500 mt-1">Travel Cost Method / Surplus Konsumen</p>
          </div>
        </div>
      </section>

      {/* 9. SECTION 07: REKAPITULASI NILAI EKONOMI (Tabel Resmi) */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              07. Rekapitulasi Nilai Ekonomi
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Komposisi kontribusi nominal dan persentase nilai ekonomi per kategori jasa ekosistem.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs border border-slate-200">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-[11px] uppercase">
              <tr>
                <th className="py-2.5 px-4 border-r border-slate-200 w-12 text-center">No</th>
                <th className="py-2.5 px-4 border-r border-slate-200">Kategori Jasa Ekosistem</th>
                <th className="py-2.5 px-4 border-r border-slate-200">Metodologi Valuasi</th>
                <th className="py-2.5 px-4 text-right border-r border-slate-200 min-w-[200px]">Nilai Nominal (Rp)</th>
                <th className="py-2.5 px-4 text-right w-28">Kontribusi (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="py-3 px-4 text-center font-mono text-slate-400 border-r border-slate-200">1</td>
                <td className="py-3 px-4 font-semibold text-slate-900 border-r border-slate-200">Provisioning Services (Jasa Penyediaan)</td>
                <td className="py-3 px-4 text-slate-600 border-r border-slate-200">Market Price & Effect on Production</td>
                <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 border-r border-slate-200">{formatIDR(provTotal)}</td>
                <td className="py-3 px-4 text-right font-mono text-slate-700 font-semibold">
                  {grandTEV > 0 ? formatNumber((provTotal / grandTEV) * 100, 2) : '0,00'}%
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-center font-mono text-slate-400 border-r border-slate-200">2</td>
                <td className="py-3 px-4 font-semibold text-slate-900 border-r border-slate-200">Regulating Services (Jasa Pengaturan)</td>
                <td className="py-3 px-4 text-slate-600 border-r border-slate-200">Replacement Cost & Blue Carbon Storage</td>
                <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 border-r border-slate-200">{formatIDR(regTotal)}</td>
                <td className="py-3 px-4 text-right font-mono text-slate-700 font-semibold">
                  {grandTEV > 0 ? formatNumber((regTotal / grandTEV) * 100, 2) : '0,00'}%
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-center font-mono text-slate-400 border-r border-slate-200">3</td>
                <td className="py-3 px-4 font-semibold text-slate-900 border-r border-slate-200">Supporting Services (Jasa Pendukung)</td>
                <td className="py-3 px-4 text-slate-600 border-r border-slate-200">Habitat / Nursery Ground Function</td>
                <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 border-r border-slate-200">{formatIDR(suppTotal)}</td>
                <td className="py-3 px-4 text-right font-mono text-slate-700 font-semibold">
                  {grandTEV > 0 ? formatNumber((suppTotal / grandTEV) * 100, 2) : '0,00'}%
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-center font-mono text-slate-400 border-r border-slate-200">4</td>
                <td className="py-3 px-4 font-semibold text-slate-900 border-r border-slate-200">Cultural Services (Jasa Budaya & Rekreasi)</td>
                <td className="py-3 px-4 text-slate-600 border-r border-slate-200">Travel Cost Method (TCM)</td>
                <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 border-r border-slate-200">{formatIDR(cultTotal)}</td>
                <td className="py-3 px-4 text-right font-mono text-slate-700 font-semibold">
                  {grandTEV > 0 ? formatNumber((cultTotal / grandTEV) * 100, 2) : '0,00'}%
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-blue-50 font-bold border-t-2 border-blue-300">
                <td colSpan={3} className="py-3 px-4 text-right uppercase border-r border-blue-200 text-blue-900">
                  Total Economic Value (TEV):
                </td>
                <td className="py-3 px-4 text-right font-mono text-sm text-blue-950 border-r border-blue-200">
                  {formatIDR(grandTEV)}
                </td>
                <td className="py-3 px-4 text-right font-mono text-blue-950">
                  100,00%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {/* 10. SECTION 08: ANALITIK & VISUALISASI (Read-Only) */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              08. Analitik & Visualisasi
            </h2>
          </div>
          <button
            onClick={() => navigate(`/projects/${effectiveProjId}/analytics`)}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer hover:underline"
          >
            <span>[ Lihat Analitik Lengkap ]</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart 1: Direct vs Indirect */}
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-2">
              <PieIcon className="w-4 h-4 text-blue-600" />
              Direct vs Indirect Value
            </span>
            <div className="h-48 w-full">
              {hasCompositionData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={compositionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {compositionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={customTooltipFormatter} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs gap-1.5 bg-white rounded border border-dashed border-slate-200">
                  <PieIcon className="w-6 h-6 text-slate-300 stroke-1" />
                  <span>Belum ada nilai TEV</span>
                </div>
              )}
            </div>
            <div className="text-[11px] text-slate-500 text-center mt-auto border-t border-slate-200/60 pt-2 space-y-0.5">
              <div>
                Direct: <strong>{formatNumber(grandTEV > 0 ? (directValue / grandTEV) * 100 : 0, 1)}%</strong> • Indirect: <strong>{formatNumber(grandTEV > 0 ? (indirectValue / grandTEV) * 100 : 0, 1)}%</strong>
                {supportingValue > 0 && (
                  <> • Supporting: <strong>{formatNumber((supportingValue / grandTEV) * 100, 1)}%</strong></>
                )}
              </div>
              <div className="text-[10px] text-blue-700 font-semibold">
                Rasio Direct : Indirect = {formatNumber(grandTEV > 0 ? (directValue / grandTEV) * 100 : 0, 1)}% : {formatNumber(grandTEV > 0 ? (indirectValue / grandTEV) * 100 : 0, 1)}%
              </div>
            </div>
          </div>

          {/* Chart 2: Nilai per Jasa */}
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              Nilai per Jasa Ekosistem
            </span>
            <div className="h-48 w-full">
              {hasServiceData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={serviceBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                    <YAxis tickFormatter={(v) => `${(v / 1e9).toFixed(0)}M`} tick={{ fontSize: 9 }} />
                    <RechartsTooltip formatter={customTooltipFormatter} />
                    <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                      {serviceBarData.map((entry, index) => (
                        <Cell key={`bar-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs gap-1.5 bg-white rounded border border-dashed border-slate-200">
                  <BarChart3 className="w-6 h-6 text-slate-300 stroke-1" />
                  <span>Belum ada data nilai jasa</span>
                </div>
              )}
            </div>
            <div className="text-[11px] text-slate-500 text-center mt-auto border-t border-slate-200/60 pt-2">
              {dominantService && dominantService.value > 0 ? (
                <>Jasa <strong>{dominantService.name}</strong> mendominasi ({formatNumber(grandTEV > 0 ? (dominantService.value / grandTEV) * 100 : 0, 1)}%)</>
              ) : (
                <>Distribusi 4 kategori jasa ekosistem</>
              )}
            </div>
          </div>

          {/* Chart 3: Nilai per Area Tutupan */}
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-2">
              <Layers className="w-4 h-4 text-blue-600" />
              Nilai per Area Tutupan Lahan
            </span>
            <div className="h-48 w-full">
              {hasAreaData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={areaComparisonData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <XAxis type="number" tickFormatter={(v) => `${(v / 1e9).toFixed(0)}M`} tick={{ fontSize: 9 }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={80} />
                    <RechartsTooltip formatter={customTooltipFormatter} />
                    <Bar dataKey="total" fill="#3b82f6" radius={[0, 3, 3, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs gap-1.5 bg-white rounded border border-dashed border-slate-200">
                  <Layers className="w-6 h-6 text-slate-300 stroke-1" />
                  <span>Belum ada nilai tutupan lahan</span>
                </div>
              )}
            </div>
            <div className="text-[11px] text-slate-500 text-center mt-auto border-t border-slate-200/60 pt-2">
              {topArea && topArea.total > 0 ? (
                <><strong>{topArea.name}</strong> menyumbang nilai tertinggi ({formatIDR(topArea.total)})</>
              ) : (
                <>Perbandingan nilai ekonomi antar area spasial</>
              )}
            </div>
          </div>
        </div>

        {/* Riwayat & Perbandingan Historis Lokasi (Kondisional: Sesuai Requirement 3, 4, 5, 6) */}
        {totalPeriods >= 2 ? (
          /* KONDISI A: TERDAPAT MINIMAL 2 PERIODE PENELITIAN */
          <div className="pt-5 border-t border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Riwayat Penelitian Lokasi ({targetArea?.name || 'Kawasan'})
                </h3>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded border border-indigo-200">
                  {totalPeriods} Periode Penelitian
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Data aktual rekam jejak survei pada tutupan lahan yang sama
              </span>
            </div>

            {/* Ringkasan Sederhana Riwayat Penelitian Lokasi (Requirement 3) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {combinedTimeline.map(item => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-lg border text-xs flex flex-col justify-between gap-2 ${
                    item.isCurrent
                      ? 'bg-blue-50/70 border-blue-200 shadow-2xs'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                        item.isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {item.year}
                      </span>
                      {item.isCurrent && (
                        <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded border border-blue-200">
                          Penelitian Saat Ini
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-slate-900 line-clamp-2" title={item.studyTitle}>
                      {item.studyTitle}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      {item.source} • {formatNumber(item.areaHa, 2)} Ha
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-baseline justify-between font-mono">
                    <span className="text-slate-500 text-[11px]">TEV:</span>
                    <span className="font-bold text-slate-900">{formatIDR(item.tev)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Line Charts Multi-Tahun (Requirement 6) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              {/* Line Chart A: Perkembangan Total Economic Value (TEV) */}
              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    Perkembangan Total Economic Value (TEV)
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Dalam Miliar Rp</span>
                </div>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalLineData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                      <YAxis tickFormatter={(v) => `${v} M`} tick={{ fontSize: 9 }} />
                      <RechartsTooltip
                        formatter={(val: any) => [`Rp ${formatNumber(val, 2)} Miliar`, 'TEV']}
                        labelFormatter={(label) => `Tahun Survei ${label}`}
                      />
                      <Line
                        type="monotone"
                        dataKey="tevMiliar"
                        stroke="#2563eb"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: '#1d4ed8' }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-[11px] text-slate-500 text-center mt-auto border-t border-slate-200/60 pt-2">
                  {previousStudy ? (
                    <>Tren TEV meningkat <strong>+{formatNumber(tevDiffPct, 2)}%</strong> ({formatIDR(tevDiffNominal)}) dibanding survei {previousStudy.year}</>
                  ) : (
                    <>Tren perkembangan nilai TEV multi-tahun</>
                  )}
                </div>
              </div>

              {/* Line Chart B: Perkembangan Nilai Ekonomi per Ha */}
              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-emerald-600" />
                    Perkembangan Nilai Ekonomi per Ha
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Dalam Juta Rp / Ha</span>
                </div>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalLineData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                      <YAxis tickFormatter={(v) => `${v} jt`} tick={{ fontSize: 9 }} />
                      <RechartsTooltip
                        formatter={(val: any) => [`Rp ${formatNumber(val, 2)} Juta / Ha`, 'Nilai/Ha']}
                        labelFormatter={(label) => `Tahun Survei ${label}`}
                      />
                      <Line
                        type="monotone"
                        dataKey="tevPerHaJuta"
                        stroke="#059669"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: '#047857' }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-[11px] text-slate-500 text-center mt-auto border-t border-slate-200/60 pt-2">
                  Intensitas per Ha saat ini <strong>{formatIDR(targetTevPerHa)}/Ha</strong> ({targetArea?.name || 'Area Penelitian'})
                </div>
              </div>
            </div>
          </div>
        ) : currentLandCovers.length > 0 ? (
          /* KONDISI B: HANYA 1 PERIODE PENELITIAN (Requirement 5) */
          <div className="pt-4 border-t border-slate-200">
            <div className="p-4 bg-slate-50/70 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold font-mono text-xs shrink-0">
                  2026
                </div>
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>Periode Penelitian: Tahun 2026 (Penelitian Saat Ini)</span>
                    <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded font-semibold">
                      1 Periode Penelitian
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Riwayat penelitian sebelumnya belum tersedia pada lokasi {currentProject?.location || currentProject?.name}. Seluruh analitik dihitung berbasis survei primer tahun 2026.
                  </p>
                </div>
              </div>
              <div className="text-right sm:text-right font-mono self-start sm:self-auto shrink-0">
                <div className="font-bold text-slate-900">{formatIDR(grandTEV)}</div>
                <div className="text-[11px] text-slate-500">{formatNumber(totalAreaHa, 2)} Ha</div>
              </div>
            </div>
          </div>
        ) : (
          /* KONDISI C: TIDAK ADA PENELITIAN TERDAHULU MAUPUN DATA SPASIAL (Requirement 4) */
          <div className="pt-4 border-t border-slate-200">
            <div className="p-4 bg-slate-50/70 rounded-lg border border-slate-200 text-center text-xs space-y-1">
              <div className="font-bold text-slate-700">Belum Ada Riwayat Penelitian</div>
              <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                Belum tersedia penelitian terdahulu pada lokasi ini. Perbandingan historis akan tersedia setelah terdapat data penelitian pada lokasi ini.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* 11. FINAL TOTAL ECONOMIC VALUE BANNER */}
      <section className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-xl p-6 md:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
              Hasil Akhir Penelitian Valuasi Sumberdaya Alam
            </div>
            <div className="text-sm font-semibold text-slate-300 mt-0.5">
              TOTAL ECONOMIC VALUE (TEV) {currentProject?.name?.toUpperCase() || 'KAWASAN PENELITIAN'}
            </div>
            <div className="text-2xl md:text-3xl font-extrabold font-mono text-white mt-1">
              {formatIDR(grandTEV)}
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Agregasi menyeluruh dari seluruh jasa ekosistem (Direct Use + Indirect Use + Supporting Use) berdasarkan formulasi saintifik dan verifikasi lapangan.
            </p>
          </div>

          <div className="text-right">
            <button
              onClick={() => navigate(`/projects/${effectiveProjId}/review/preview`)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-blue-300" />
              <span>Pratinjau Dokumen Cetak</span>
            </button>
          </div>
        </div>
      </section>

      {/* 12. PENGIRIMAN KE ANALYST (Aksi Terakhir) */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        {isSubmitted ? (
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-purple-950">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-purple-950">
                  ● Proyek Sedang Menunggu Review Analyst
                </div>
                <p className="text-purple-800 mt-0.5">
                  Telah dikirim pada: <strong>{formatDate(currentProject?.submittedAt || new Date().toISOString())}</strong>. Peneliti tidak dapat mengubah data sampai proses telaah selesai.
                </p>
              </div>
            </div>

            <button
              onClick={simulateAnalystRejection}
              className="px-3.5 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
              title="Simulasi jika Analyst menemukan hal yang perlu diperbaiki"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulasi Dikembalikan Analyst</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div>
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Seluruh data penelitian telah siap diajukan.</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Pastikan Anda telah memeriksa kembali seluruh lembar kerja di atas sebelum mengirimkannya ke meja kerja Analyst.
              </p>
            </div>

            <button
              onClick={() => setIsConfirmModalOpen(true)}
              disabled={!isReadyForReview}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs md:text-sm font-bold flex items-center gap-2 transition-colors shadow-sm cursor-pointer whitespace-nowrap self-start sm:self-auto"
            >
              <Send className="w-4 h-4" />
              <span>Kirim ke Analyst</span>
            </button>
          </div>
        )}
      </section>

      {/* Confirmation Modal: Kirim ke Analyst */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden text-sm">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Send className="w-4 h-4 text-blue-600" />
                <span>Kirim Proyek ke Analyst?</span>
              </div>
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-600 leading-relaxed">
              <p>
                Setelah dikirim, status proyek <strong>{currentProject?.name}</strong> akan masuk ke proses review Analyst. Pastikan seluruh data telah diperiksa.
              </p>

              {/* Ringkasan Proyek */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5 font-medium text-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-500">Project:</span>
                  <span className="font-bold">{currentProject?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kode Proyek:</span>
                  <span className="font-mono font-bold text-blue-700">{currentProject?.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Index Kawasan:</span>
                  <span className="font-bold">{currentIndices.length} Index</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Area Tutupan Lahan:</span>
                  <span className="font-bold">{currentLandCovers.length} Area</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Jasa Ekosistem:</span>
                  <span className="font-bold">4 Kategori Aktif</span>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-slate-200 font-bold text-slate-900">
                  <span>Total Economic Value:</span>
                  <span className="font-mono text-blue-900">{formatIDR(grandTEV)}</span>
                </div>
              </div>

              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-amber-900 text-[11px]">
                <strong>Catatan:</strong> Input data akan dikunci sementara selama Analyst meninjau berkas penelitian Anda.
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim ke Analyst</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const ReviewReportPage: React.FC = () => {
  return (
    <ErrorBoundary
      fallbackTitle="Terjadi kendala saat memuat Review & Laporan."
      fallbackMessage="Komponen review laporan mengalami kendala render. Silakan coba muat ulang halaman."
    >
      <ReviewReportPageContent />
    </ErrorBoundary>
  );
};

export default ReviewReportPage;
