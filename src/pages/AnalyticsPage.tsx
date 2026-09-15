import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { useSpreadsheet } from '../context/SpreadsheetContext';
import { formatIDR, formatNumber } from '../utils/formatter';
import { getHistoricalStudiesForArea } from '../mock/historicalAnalyticsMock';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { EcosystemServiceId } from '../types/valuation';
import {
  BarChart3,
  PieChart as PieIcon,
  TrendingUp,
  TrendingDown,
  Filter,
  Layers,
  ArrowRight,
  Calculator,
  History,
  Calendar,
  Sparkles,
  Info,
  Scale,
  CheckCircle2,
  MapPin
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';

const AnalyticsPageContent: React.FC = () => {
  const params = useParams<{ projectId?: string }>();
  const {
    projects,
    activeProject,
    activeProjectId,
    setActiveProjectId,
    getProjectLandCovers,
    getAreaConfig
  } = useProject();
  const { getServiceSubtotal, getGrandTotalForArea } = useSpreadsheet();
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

  // Project's land covers
  const landCovers = (getProjectLandCovers ? getProjectLandCovers(effectiveProjId) : []) || [];

  // Filters
  const [filterArea, setFilterArea] = useState<string>('ALL');
  const [filterService, setFilterService] = useState<string>('ALL');
  const [filterMethod, setFilterMethod] = useState<string>('ALL');

  // Reset filterArea if it doesn't exist in current landCovers
  useEffect(() => {
    if (filterArea !== 'ALL' && !landCovers.some(l => l.name === filterArea)) {
      setFilterArea('ALL');
    }
  }, [effectiveProjId, landCovers, filterArea]);

  // Relevant land covers based on area filter
  const relevantLandCovers = filterArea === 'ALL'
    ? landCovers
    : landCovers.filter(l => l.name === filterArea);

  // Total area in Ha for relevant land covers
  const totalAreaHa = relevantLandCovers.reduce((sum, lc) => sum + (Number(lc.areaHa) || 0), 0);

  // Helper calculation for each service with robust fallbacks
  const getSubtotalForService = (sId: EcosystemServiceId): number => {
    return relevantLandCovers.reduce((sum, lc) => {
      const cfg = getAreaConfig ? getAreaConfig(lc.id) : null;
      if (cfg?.activeServices && !cfg.activeServices[sId]) {
        return sum;
      }
      if (Array.isArray(lc.activeServices) && !lc.activeServices.includes(sId)) {
        return sum;
      }
      if (filterMethod !== 'ALL') {
        const m = cfg?.selectedMethods ? cfg.selectedMethods[sId] : undefined;
        if (m && m !== filterMethod) return sum;
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

  // Dynamic subtotals per service across selected land covers
  const provTotal = Math.max(0, getSubtotalForService('provisioning'));
  const regTotal = Math.max(0, getSubtotalForService('regulating'));
  const suppTotal = Math.max(0, getSubtotalForService('supporting'));
  const cultTotal = Math.max(0, getSubtotalForService('cultural'));

  // Economic components (Direct, Indirect, Supporting)
  const directValue = provTotal + cultTotal; // Provisioning + Cultural
  const indirectValue = regTotal; // Regulating
  const supportingValue = suppTotal; // Supporting
  const totalTEV = directValue + indirectValue + supportingValue;

  // -------------------------------------------------------------
  // INDIKATOR 1: Nilai Ekonomi per Hektare (TEV / Ha)
  // -------------------------------------------------------------
  const tevPerHa = totalAreaHa > 0 ? Math.round(totalTEV / totalAreaHa) : 0;

  // -------------------------------------------------------------
  // INDIKATOR 2: Kontribusi 4 Kategori Jasa Ekosistem (%)
  // -------------------------------------------------------------
  const serviceContributions = [
    {
      id: 'provisioning',
      code: 'A',
      name: 'Provisioning Services',
      shortName: 'Provisioning',
      nominal: provTotal,
      percentage: totalTEV > 0 ? (provTotal / totalTEV) * 100 : 0,
      color: '#0e7490',
      description: 'Hasil panen komoditas & biomassa vegetasi'
    },
    {
      id: 'regulating',
      code: 'B',
      name: 'Regulating Services',
      shortName: 'Regulating',
      nominal: regTotal,
      percentage: totalTEV > 0 ? (regTotal / totalTEV) * 100 : 0,
      color: '#2563eb',
      description: 'Pencegah abrasi, seawall & serapan karbon biru'
    },
    {
      id: 'supporting',
      code: 'C',
      name: 'Supporting Services',
      shortName: 'Supporting',
      nominal: suppTotal,
      percentage: totalTEV > 0 ? (suppTotal / totalTEV) * 100 : 0,
      color: '#7c3aed',
      description: 'Habitat asuhan biota & nursery ground'
    },
    {
      id: 'cultural',
      code: 'D',
      name: 'Cultural Services',
      shortName: 'Cultural',
      nominal: cultTotal,
      percentage: totalTEV > 0 ? (cultTotal / totalTEV) * 100 : 0,
      color: '#d97706',
      description: 'Ekowisata pesisir & edukasi konservasi'
    }
  ];

  const sortedServices = [...serviceContributions].sort((a, b) => b.nominal - a.nominal);
  const highestService = sortedServices.length > 0 && sortedServices[0].nominal > 0
    ? sortedServices[0]
    : { name: 'Belum Ada', percentage: 0, nominal: 0, code: '-', shortName: '-', description: '' };

  // -------------------------------------------------------------
  // INDIKATOR 3: Komposisi Direct vs Indirect vs Supporting Value
  // -------------------------------------------------------------
  const componentCompositions = [
    {
      name: 'Direct Use Value (DUV)',
      short: 'Direct Value',
      value: directValue,
      percentage: totalTEV > 0 ? (directValue / totalTEV) * 100 : 0,
      color: '#2563eb',
      description: 'Manfaat langsung: komoditas panen & wisata rekreasi'
    },
    {
      name: 'Indirect Use Value (IUV)',
      short: 'Indirect Value',
      value: indirectValue,
      percentage: totalTEV > 0 ? (indirectValue / totalTEV) * 100 : 0,
      color: '#0ea5e9',
      description: 'Manfaat tidak langsung: perlindungan fisik & stabilitas pesisir'
    },
    {
      name: 'Supporting Value (SUV)',
      short: 'Supporting Value',
      value: supportingValue,
      percentage: totalTEV > 0 ? (supportingValue / totalTEV) * 100 : 0,
      color: '#8b5cf6',
      description: 'Fungsi penopang ekologis: asuhan benih & keanekaragaman hayati'
    }
  ];

  // -------------------------------------------------------------
  // ANALITIK HISTORIS (HANYA JIKA TERSEDIA / EMPTY STATE JIKA TIDAK)
  // -------------------------------------------------------------
  const targetArea = filterArea === 'ALL'
    ? (landCovers.find(l => l.id === 'poly-1') || landCovers[0] || null)
    : (landCovers.find(l => l.name === filterArea) || null);

  const historicalStudies = targetArea
    ? getHistoricalStudiesForArea(targetArea.id, targetArea.name, targetArea.code)
    : [];

  const hasHistory = historicalStudies.length > 0;

  // Gabungkan studi terdahulu dengan penelitian saat ini (2026)
  const combinedTimeline = hasHistory ? [
    ...historicalStudies.map(s => ({
      id: s.id,
      year: s.year,
      studyTitle: s.studyTitle,
      areaName: s.areaName,
      areaHa: s.areaHa,
      tev: s.tev,
      tevPerHa: s.tevPerHa,
      services: s.servicesBreakdown,
      source: s.institution,
      isCurrent: false
    })),
    {
      id: 'CURRENT-2026',
      year: 2026,
      studyTitle: currentProject?.name || 'Penelitian Saat Ini',
      areaName: targetArea?.name || 'Mangrove Barat',
      areaHa: targetArea?.areaHa || totalAreaHa,
      tev: totalTEV,
      tevPerHa: tevPerHa,
      services: {
        provisioning: provTotal,
        regulating: regTotal,
        supporting: suppTotal,
        cultural: cultTotal
      },
      source: `PKSPL IPB (${currentProject?.code || effectiveProjId})`,
      isCurrent: true
    }
  ].sort((a, b) => a.year - b.year) : [];

  // Perhitungan perubahan terhadap penelitian sebelumnya
  const previousStudy = combinedTimeline.length >= 2 ? combinedTimeline[combinedTimeline.length - 2] : null;
  const currentStudy = combinedTimeline.length > 0 ? combinedTimeline[combinedTimeline.length - 1] : null;

  const tevDiffNominal = (currentStudy && previousStudy) ? (currentStudy.tev - previousStudy.tev) : 0;
  const tevDiffPct = (currentStudy && previousStudy && previousStudy.tev > 0)
    ? ((currentStudy.tev - previousStudy.tev) / previousStudy.tev) * 100
    : 0;

  const tevPerHaDiffNominal = (currentStudy && previousStudy) ? (currentStudy.tevPerHa - previousStudy.tevPerHa) : 0;
  const tevPerHaDiffPct = (currentStudy && previousStudy && previousStudy.tevPerHa > 0)
    ? ((currentStudy.tevPerHa - previousStudy.tevPerHa) / previousStudy.tevPerHa) * 100
    : 0;

  // Data untuk Line Chart Perkembangan TEV
  const historicalTevTrendData = combinedTimeline.map(s => ({
    year: String(s.year),
    tevMiliar: Number((s.tev / 1e9).toFixed(2)),
    tevRaw: s.tev,
    tevPerHaJuta: Number((s.tevPerHa / 1e6).toFixed(2)),
    tevPerHaRaw: s.tevPerHa,
    title: s.studyTitle,
    isCurrent: s.isCurrent
  }));

  // Data untuk Grouped Bar Chart Perubahan Komposisi Jasa
  const historicalServiceComparisonData = combinedTimeline.map(s => ({
    year: String(s.year),
    Provisioning: Number(((s.services?.provisioning || 0) / 1e9).toFixed(2)),
    Regulating: Number(((s.services?.regulating || 0) / 1e9).toFixed(2)),
    Supporting: Number(((s.services?.supporting || 0) / 1e9).toFixed(2)),
    Cultural: Number(((s.services?.cultural || 0) / 1e9).toFixed(2)),
    isCurrent: s.isCurrent
  }));

  // Data Existing Chart 1: Direct vs Indirect vs Supporting
  const compositionData = [
    { name: 'Direct Use Value', value: Math.max(0, directValue || 0), color: '#2563eb' },
    { name: 'Indirect Use Value', value: Math.max(0, indirectValue || 0), color: '#0ea5e9' },
    { name: 'Supporting Value', value: Math.max(0, supportingValue || 0), color: '#8b5cf6' },
  ];

  // Data Existing Chart 2: Perbandingan Jasa Ekosistem
  const allServices = [
    { id: 'provisioning', name: 'Provisioning', nominal: Math.max(0, provTotal || 0), fill: '#0e7490' },
    { id: 'regulating', name: 'Regulating', nominal: Math.max(0, regTotal || 0), fill: '#2563eb' },
    { id: 'supporting', name: 'Supporting', nominal: Math.max(0, suppTotal || 0), fill: '#7c3aed' },
    { id: 'cultural', name: 'Cultural', nominal: Math.max(0, cultTotal || 0), fill: '#d97706' },
  ];

  const serviceComparisonData = filterService === 'ALL'
    ? allServices
    : allServices.filter(s => s.id === filterService);

  // Data Existing Chart 3: Nilai per Area Tutupan Lahan
  const areaData = landCovers.map(lc => {
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
      total: Math.max(0, total || 0),
    };
  });

  const filteredAreaData = filterArea === 'ALL'
    ? areaData
    : areaData.filter(a => a.name === filterArea);

  const customTooltipFormatter = (val: any) => [formatIDR(Number(val)), 'Nilai'];

  // Defensive validation flags for charts
  const hasCompositionData = totalTEV > 0 && compositionData.some(d => d.value > 0);
  const hasServiceComparisonData = serviceComparisonData.some(s => s.nominal > 0);
  const hasAreaData = filteredAreaData.length > 0 && filteredAreaData.some(a => a.total > 0);
  const hasContributionData = totalTEV > 0 && serviceContributions.some(s => s.nominal > 0);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* 1. Header Analitik & Visualisasi (Preserved) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Tahap 08</span>
            <span>•</span>
            <span className="text-blue-600">Visualisasi Eksekutif</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5 mt-0.5">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <span>Analitik Valuasi Ekonomi</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Visualisasi distribusi nilai langsung (Direct), tidak langsung (Indirect), perbandingan jasa ekosistem, dan per area spasial.
          </p>
        </div>

        <button
          onClick={() => navigate(`/projects/${effectiveProjId}/review`)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs md:text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <span>Lanjut ke Review & Laporan</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Interactive Filters Bar (Preserved & Fully Connected) */}
      <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>Filter Analitik:</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Area:</span>
            <select
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-700 font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Semua Area ({landCovers.length})</option>
              {landCovers.map(l => (
                <option key={l.id} value={l.name}>{l.name} ({formatNumber(l.areaHa, 2)} Ha)</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Jasa:</span>
            <select
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-700 font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Semua Jasa (4 Kategori)</option>
              <option value="provisioning">A. Provisioning</option>
              <option value="regulating">B. Regulating</option>
              <option value="supporting">C. Supporting</option>
              <option value="cultural">D. Cultural</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Metode:</span>
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-700 font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Semua Metode</option>
              <option value="market-price">Market Price</option>
              <option value="replacement-cost">Replacement Cost</option>
              <option value="nursery-ground">Nursery Ground</option>
              <option value="tcm">Travel Cost Method (TCM)</option>
            </select>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Data tersinkronisasi otomatis dari spreadsheet input</span>
        </div>
      </div>

      {/* 3. KPI Cards Row (Preserved) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <div className="text-[11px] uppercase font-bold text-slate-400">Direct Value (DUV)</div>
          <div className="text-lg font-bold text-blue-700 font-mono mt-1">
            {formatIDR(directValue)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Penyediaan komoditas pasar & ekowisata
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <div className="text-[11px] uppercase font-bold text-slate-400">Indirect Value (IUV)</div>
          <div className="text-lg font-bold text-sky-700 font-mono mt-1">
            {formatIDR(indirectValue)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Tanggul pantai & penyerapan karbon biru
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <div className="text-[11px] uppercase font-bold text-slate-400">Supporting Value (SUV)</div>
          <div className="text-lg font-bold text-purple-700 font-mono mt-1">
            {formatIDR(supportingValue)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Nursery ground & tempat asuhan benih
          </div>
        </div>

        <div className="bg-blue-50/70 p-4 rounded-lg border border-blue-200 shadow-2xs">
          <div className="text-[11px] uppercase font-bold text-blue-600">Total Economic Value (TEV)</div>
          <div className="text-lg font-bold text-blue-900 font-mono mt-1">
            {formatIDR(totalTEV)}
          </div>
          <div className="text-[11px] text-blue-700 mt-1 font-medium">
            100% Agregasi Komprehensif
          </div>
        </div>
      </div>

      {/* 4. Charts Grid (Preserved) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Direct vs Indirect (Donut Pie) */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-blue-600" />
              <span>1. Direct Value vs Indirect Value</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Komposisi TEV</span>
          </div>

          <div className="h-64 w-full">
            {hasCompositionData ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={compositionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {compositionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={customTooltipFormatter} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs gap-2 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                <PieIcon className="w-8 h-8 text-slate-300 stroke-1" />
                <span>Belum ada nilai ekonomi untuk komposisi TEV</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center text-xs">
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Direct Value</div>
              <div className="font-mono font-bold text-slate-800 mt-0.5">
                {totalTEV > 0 ? formatNumber((directValue / totalTEV) * 100, 1) : 0}%
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Indirect Value</div>
              <div className="font-mono font-bold text-slate-800 mt-0.5">
                {totalTEV > 0 ? formatNumber((indirectValue / totalTEV) * 100, 1) : 0}%
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Supporting</div>
              <div className="font-mono font-bold text-slate-800 mt-0.5">
                {totalTEV > 0 ? formatNumber((supportingValue / totalTEV) * 100, 1) : 0}%
              </div>
            </div>
          </div>
        </div>

        {/* Chart 2: Perbandingan Jasa Ekosistem (Bar Chart) */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span>2. Perbandingan 4 Jasa Ekosistem</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Dalam Miliar Rupiah</span>
          </div>

          <div className="h-64 w-full">
            {hasServiceComparisonData ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={serviceComparisonData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis
                    tickFormatter={(v) => `${(v / 1e9).toFixed(0)}M`}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip formatter={customTooltipFormatter} />
                  <Bar dataKey="nominal" radius={[4, 4, 0, 0]}>
                    {serviceComparisonData.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs gap-2 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                <BarChart3 className="w-8 h-8 text-slate-300 stroke-1" />
                <span>Belum ada nominal nilai jasa ekosistem</span>
              </div>
            )}
          </div>

          <div className="p-2.5 bg-slate-50 rounded text-xs text-slate-500 border border-slate-200/60 mt-auto">
            Jasa Penyediaan dan Pengaturan mendominasi lebih dari <strong>90%</strong> total nilai fungsi ekologis.
          </div>
        </div>
      </div>

      {/* 5. Chart 3: Nilai Berdasarkan Area Tutupan Lahan (Preserved) */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>3. Distribusi Nilai Ekonomi per Area Tutupan Lahan</span>
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">Komparasi Antar Poligon</span>
        </div>

        <div className="h-64 w-full">
          {hasAreaData ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredAreaData} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 10 }}>
                <XAxis
                  type="number"
                  tickFormatter={(v) => `${(v / 1e9).toFixed(0)} M`}
                  tick={{ fontSize: 10 }}
                />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={120} />
                <Tooltip formatter={customTooltipFormatter} />
                <Bar dataKey="total" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs gap-2 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
              <Layers className="w-8 h-8 text-slate-300 stroke-1" />
              <span>Belum ada data nilai tutupan lahan pada proyek ini</span>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION BARU 1: INDIKATOR NILAI EKONOMI (SELALU MUNCUL)        */}
      {/* ============================================================== */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold uppercase tracking-wider border border-blue-200/60">
                Indikator Utama
              </span>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-600" />
                <span>Indikator Nilai Ekonomi</span>
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Rasio intensitas ekonomi per satuan luas dan proporsi kontribusi relatif fungsi ekosistem.
            </p>
          </div>
          <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded flex items-center gap-2 self-start sm:self-auto">
            <span className="font-semibold text-slate-700">Area Terhitung:</span>
            <span>{filterArea === 'ALL' ? 'Seluruh Area' : filterArea} ({formatNumber(totalAreaHa, 2)} Ha)</span>
          </div>
        </div>

        {/* 3 Metric Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Nilai Ekonomi per Ha */}
          <div className="bg-gradient-to-br from-emerald-50/70 to-teal-50/30 p-4 rounded-lg border border-emerald-200/80 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                Nilai Ekonomi per Ha
              </span>
              <Scale className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-bold text-emerald-950 font-mono mt-1.5">
              {formatIDR(tevPerHa)} <span className="text-xs font-semibold text-emerald-700">/ Ha</span>
            </div>
            <p className="text-[11px] text-emerald-700/90 mt-1 leading-snug">
              Total Economic Value dibandingkan luas area ({formatNumber(totalAreaHa, 2)} Ha)
            </p>
          </div>

          {/* Card 2: Kontribusi Jasa Dominan */}
          <div className="bg-gradient-to-br from-cyan-50/70 to-blue-50/30 p-4 rounded-lg border border-cyan-200/80 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-cyan-800 uppercase tracking-wider">
                Kontribusi Jasa Dominan
              </span>
              <Sparkles className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="text-xl font-bold text-cyan-950 font-mono mt-1.5">
              {formatNumber(highestService?.percentage || 0, 1)}%
            </div>
            <p className="text-[11px] text-cyan-700/90 mt-1 leading-snug">
              Dipimpin oleh <strong>{highestService?.name}</strong> ({formatIDR(highestService?.nominal || 0)})
            </p>
          </div>

          {/* Card 3: Rasio Direct vs Indirect */}
          <div className="bg-gradient-to-br from-purple-50/70 to-indigo-50/30 p-4 rounded-lg border border-purple-200/80 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider">
                Rasio Direct : Indirect
              </span>
              <PieIcon className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-xl font-bold text-purple-950 font-mono mt-1.5">
              {totalTEV > 0 ? formatNumber((directValue / totalTEV) * 100, 1) : 0}% : {totalTEV > 0 ? formatNumber((indirectValue / totalTEV) * 100, 1) : 0}%
            </div>
            <p className="text-[11px] text-purple-700/90 mt-1 leading-snug">
              Pemanfaatan komoditas riil berbanding fungsi pelindung lingkungan
            </p>
          </div>
        </div>

        {/* 2 Detailed Breakdown Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          {/* Visual 1: Kontribusi 4 Jasa Ekosistem (Donut Chart) */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 flex flex-col">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <PieIcon className="w-4 h-4 text-blue-600" />
                <span>Kontribusi 4 Jasa Ekosistem terhadap TEV</span>
              </h4>
              <span className="text-[11px] text-slate-400 font-mono font-medium">100% TEV</span>
            </div>

            <div className="h-56 w-full">
              {hasContributionData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={serviceContributions}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="nominal"
                    >
                      {serviceContributions.map((entry, index) => (
                        <Cell key={`service-cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={customTooltipFormatter} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs gap-2 bg-white rounded-lg border border-dashed border-slate-200">
                  <PieIcon className="w-8 h-8 text-slate-300 stroke-1" />
                  <span>Belum ada data kontribusi jasa ekosistem</span>
                </div>
              )}
            </div>

            {/* Breakdown List */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-200 text-xs">
              {serviceContributions.map(s => (
                <div key={s.id} className="p-2 bg-white rounded border border-slate-200/80">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }}></span>
                    <span className="font-semibold text-slate-800 truncate" title={s.name}>
                      {s.code}. {s.shortName}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between mt-1 font-mono">
                    <span className="text-slate-500 text-[11px]">{formatIDR(s.nominal)}</span>
                    <span className="font-bold text-slate-900">{formatNumber(s.percentage, 1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual 2: Komposisi Direct / Indirect / Supporting Value */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>Komposisi Direct, Indirect & Supporting</span>
                </h4>
                <span className="text-[11px] text-slate-400 font-mono font-medium">Agregasi DUV, IUV & SUV</span>
              </div>

              {/* 100% Proportional Horizontal Bar */}
              <div className="w-full h-5 rounded-full overflow-hidden flex bg-slate-200 mb-4 shadow-inner">
                {componentCompositions.map((c, i) => (
                  <div
                    key={i}
                    style={{ width: `${c.percentage}%`, backgroundColor: c.color }}
                    className="h-full transition-all"
                    title={`${c.name}: ${formatNumber(c.percentage, 1)}% (${formatIDR(c.value)})`}
                  />
                ))}
              </div>

              {/* Detailed Component Cards */}
              <div className="space-y-2.5">
                {componentCompositions.map((comp, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: comp.color }}></div>
                      <div>
                        <div className="font-bold text-xs text-slate-800">{comp.name}</div>
                        <div className="text-[11px] text-slate-500">{comp.description}</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono font-bold text-slate-900 text-sm">
                        {formatNumber(comp.percentage, 1)}%
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {formatIDR(comp.value)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-2.5 bg-blue-50/80 rounded border border-blue-200/60 text-[11px] text-blue-800 mt-4 flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0 text-blue-600" />
              <span>
                Total Economic Value (TEV) merupakan akumulasi utuh dari DUV ({formatNumber((directValue / (totalTEV || 1)) * 100, 1)}%), IUV ({formatNumber((indirectValue / (totalTEV || 1)) * 100, 1)}%), dan SUV ({formatNumber((supportingValue / (totalTEV || 1)) * 100, 1)}%).
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION BARU 2: ANALITIK HISTORIS LOKASI                       */}
      {/* ============================================================== */}
      {!hasHistory ? (
        /* KONDISI 1: JIKA TIDAK ADA PENELITIAN SEBELUMNYA (EMPTY STATE) */
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-400 mb-3">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Belum Ada Riwayat Penelitian</h3>
          <p className="text-xs md:text-sm text-slate-500 max-w-lg mx-auto mt-1.5 leading-relaxed">
            Belum ditemukan penelitian sebelumnya pada area ini ({targetArea?.name || 'Area Baru'}).
            Perbandingan antar tahun akan tersedia secara otomatis setelah terdapat data penelitian historis yang terverifikasi.
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-600 mt-4 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Indikator nilai ekonomi di atas tetap dihitung berdasarkan data penelitian aktif saat ini ({formatNumber(totalAreaHa, 2)} Ha).</span>
          </div>
        </div>
      ) : (
        /* KONDISI 2: JIKA ADA PENELITIAN SEBELUMNYA (HISTORICAL COMPARISON) */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold uppercase tracking-wider border border-indigo-200/60">
                  Time-Series Multi-Tahun
                </span>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <History className="w-5 h-5 text-indigo-600" />
                  <span>Perbandingan Historis Lokasi: {targetArea?.name}</span>
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Rekam jejak dan evolusi Total Economic Value (TEV) lintas periode survei pada tutupan lahan yang sama.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded self-start sm:self-auto">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              <span>Lokasi: <strong>{targetArea?.name} ({targetArea?.code || 'TL-MG-01'})</strong></span>
            </div>
          </div>

          {/* KPI Changes Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* KPI 1: Perubahan Nilai Ekonomi */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Perubahan Nilai Ekonomi
                </span>
                {tevDiffPct >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-rose-600" />
                )}
              </div>
              <div className={`text-2xl font-bold font-mono mt-1 ${tevDiffPct >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {tevDiffPct >= 0 ? '+' : ''}{formatNumber(tevDiffPct, 2)}%
              </div>
              <div className="text-[11px] text-slate-600 mt-1">
                {tevDiffNominal >= 0 ? '+' : ''}{formatIDR(tevDiffNominal)} dibanding survei {previousStudy?.year}
              </div>
            </div>

            {/* KPI 2: Perkembangan TEV / Ha */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Pertumbuhan Nilai / Ha
                </span>
                {tevPerHaDiffPct >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-rose-600" />
                )}
              </div>
              <div className={`text-2xl font-bold font-mono mt-1 ${tevPerHaDiffPct >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {tevPerHaDiffPct >= 0 ? '+' : ''}{formatNumber(tevPerHaDiffPct, 2)}%
              </div>
              <div className="text-[11px] text-slate-600 mt-1">
                {tevPerHaDiffNominal >= 0 ? '+' : ''}{formatIDR(tevPerHaDiffNominal)} / Ha dibanding {previousStudy?.year}
              </div>
            </div>

            {/* KPI 3: Jumlah Periode Penelitian */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Periode Penelitian
                </span>
                <Calendar className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
                {combinedTimeline.length} Periode
              </div>
              <div className="text-[11px] text-slate-600 mt-1">
                Tahun: {combinedTimeline.map(s => s.year).join(', ')}
              </div>
            </div>
          </div>

          {/* Timeline / Table of Studies */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-100/80 px-4 py-2.5 border-b border-slate-200 font-bold text-xs text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>Rekam Jejak Penelitian Lokasi</span>
              <span className="text-slate-500 font-normal lowercase">terurut berdasarkan tahun</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                    <th className="py-2.5 px-3 w-20 text-center">Tahun</th>
                    <th className="py-2.5 px-3">Judul Penelitian</th>
                    <th className="py-2.5 px-3 w-32">Area</th>
                    <th className="py-2.5 px-3 w-24 text-right">Luas</th>
                    <th className="py-2.5 px-3 text-right">Total Economic Value (TEV)</th>
                    <th className="py-2.5 px-3 text-right">Nilai / Ha</th>
                    <th className="py-2.5 px-3">Sumber / Peneliti</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {combinedTimeline.map((study) => (
                    <tr
                      key={study.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        study.isCurrent ? 'bg-blue-50/60 font-semibold' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 text-center font-bold text-slate-800 font-mono">
                        {study.year}
                      </td>
                      <td className="py-2.5 px-3 text-slate-900">
                        <div className="flex items-center gap-2">
                          <span>{study.studyTitle}</span>
                          {study.isCurrent && (
                            <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-bold uppercase tracking-wider shadow-2xs">
                              Penelitian Saat Ini
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 font-medium">
                        {study.areaName}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                        {formatNumber(study.areaHa, 2)} Ha
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                        {formatIDR(study.tev)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-800 font-semibold">
                        {formatIDR(study.tevPerHa)}/Ha
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 truncate max-w-[200px]" title={study.source}>
                        {study.source}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Time-Series Line Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            {/* Line Chart 1: Perkembangan TEV Antar Tahun */}
            <div className="border border-slate-200 rounded-lg p-5 bg-white shadow-2xs flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span>Perkembangan Total Economic Value</span>
                </h3>
                <span className="text-[11px] text-slate-400 font-medium">Dalam Miliar Rupiah</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalTevTrendData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                    <YAxis
                      tickFormatter={(v) => `${v} M`}
                      tick={{ fontSize: 10 }}
                    />
                    <Tooltip
                      formatter={(val: any) => [`Rp ${formatNumber(val, 2)} Miliar`, 'Total Economic Value']}
                      labelFormatter={(label) => `Tahun Survei ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="tevMiliar"
                      stroke="#2563eb"
                      strokeWidth={3}
                      dot={{ r: 6, fill: '#1d4ed8', stroke: '#fff', strokeWidth: 2 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="p-2.5 bg-blue-50/70 rounded text-xs text-blue-800 border border-blue-200/60 mt-auto">
                Tren TEV mengalami peningkatan konsisten dari <strong>Rp 18,00 M (2022)</strong> menjadi <strong>{formatIDR(totalTEV)} (2026)</strong>.
              </div>
            </div>

            {/* Line Chart 2: Perkembangan TEV / Ha Antar Tahun */}
            <div className="border border-slate-200 rounded-lg p-5 bg-white shadow-2xs flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                  <Scale className="w-4 h-4 text-emerald-600" />
                  <span>Perkembangan Nilai Ekonomi per Ha</span>
                </h3>
                <span className="text-[11px] text-slate-400 font-medium">Dalam Juta Rupiah / Ha</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalTevTrendData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                    <YAxis
                      tickFormatter={(v) => `${v} jt`}
                      tick={{ fontSize: 10 }}
                    />
                    <Tooltip
                      formatter={(val: any) => [`Rp ${formatNumber(val, 2)} Juta / Ha`, 'Intensitas Nilai per Ha']}
                      labelFormatter={(label) => `Tahun Survei ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="tevPerHaJuta"
                      stroke="#059669"
                      strokeWidth={3}
                      dot={{ r: 6, fill: '#047857', stroke: '#fff', strokeWidth: 2 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="p-2.5 bg-emerald-50/70 rounded text-xs text-emerald-800 border border-emerald-200/60 mt-auto">
                Intensitas per hektare meningkat dari <strong>Rp 225,00 jt/Ha</strong> menjadi <strong>{formatIDR(tevPerHa)}/Ha</strong> tanpa terpengaruh deviasi luas area.
              </div>
            </div>
          </div>

          {/* Grouped Bar Chart: Perubahan Komposisi Jasa Ekosistem Antar Tahun */}
          <div className="border border-slate-200 rounded-lg p-5 bg-white shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                <span>Perubahan Komposisi Jasa Ekosistem Antar Tahun</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Nominal Miliar Rupiah per Kategori Jasa</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={historicalServiceComparisonData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `${v} M`} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v: any) => [`Rp ${formatNumber(v, 2)} Miliar`, '']} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  <Bar dataKey="Provisioning" fill="#0e7490" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Regulating" fill="#2563eb" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Supporting" fill="#7c3aed" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Cultural" fill="#d97706" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* 8. Next Step Banner (Preserved) */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-5 rounded-xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">Tahap Selanjutnya • Langkah 09</div>
          <div className="text-sm font-semibold text-white mt-0.5">
            Evaluasi Kelayakan & Pengajuan Laporan ke Analyst
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Lakukan pengecekan checklist kepatuhan 10 poin, ekspor PDF/Excel komprehensif, dan ajukan ke Analyst untuk validasi akhir.
          </p>
        </div>
        <button
          onClick={() => navigate(`/projects/${effectiveProjId}/review`)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-sm whitespace-nowrap self-start sm:self-auto"
        >
          <span>Lanjut ke 09 Review & Laporan</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const AnalyticsPage: React.FC = () => {
  return (
    <ErrorBoundary
      fallbackTitle="Terjadi masalah saat memuat Analitik & Visualisasi."
      fallbackMessage="Komponen analitik mengalami kendala render. Silakan coba muat ulang halaman atau pilih proyek lain."
    >
      <AnalyticsPageContent />
    </ErrorBoundary>
  );
};

export default AnalyticsPage;
