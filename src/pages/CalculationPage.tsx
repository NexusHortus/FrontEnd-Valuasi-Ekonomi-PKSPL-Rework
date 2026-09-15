import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { useSpreadsheet } from '../context/SpreadsheetContext';
import { getMethodSchema } from '../types/methodSchemas';
import { EcosystemServiceId } from '../types/valuation';
import { formatIDR, formatNumber } from '../utils/formatter';
import {
  Calculator,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Info,
  Layers,
  TableProperties,
  Eye,
  X,
  ExternalLink,
  Coins,
  ShieldCheck,
  TreePine,
  Sparkles,
  Compass
} from 'lucide-react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

interface RowFormulaBreakdown {
  no: number;
  item: string;
  parameters: string;
  formulaText: string;
  resultValue: number;
  source: string;
  areaName?: string;
}

const CalculationPageContent: React.FC = () => {
  const params = useParams<{ projectId?: string }>();
  const { projects, activeProject, activeProjectId, setActiveProjectId, landCovers, getAreaConfig } = useProject();
  const { getServiceSubtotal, getGrandTotalForArea, getRows } = useSpreadsheet();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const routeProjId = params.projectId || activeProjectId;
  const currentProject = projects.find(p => p.id === routeProjId || p.code === routeProjId) || activeProject;

  React.useEffect(() => {
    if (params.projectId && params.projectId !== activeProjectId) {
      const found = projects.find(p => p.id === params.projectId || p.code === params.projectId);
      if (found) {
        setActiveProjectId(found.id);
      }
    }
  }, [params.projectId, activeProjectId, projects, setActiveProjectId]);

  // Area filter: 'ALL' or specific landcover id
  const selectedAreaId = searchParams.get('area') || 'ALL';

  const handleSelectArea = (areaId: string) => {
    if (areaId === 'ALL') {
      searchParams.delete('area');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ area: areaId });
    }
  };

  // Active modal state for [ Lihat Detail Perhitungan ]
  const [detailModalService, setDetailModalService] = useState<EcosystemServiceId | null>(null);

  // Filtered land covers based on selected scope
  const targetLandCovers = selectedAreaId === 'ALL'
    ? landCovers
    : landCovers.filter(lc => lc.id === selectedAreaId);

  const currentArea = landCovers.find(lc => lc.id === selectedAreaId);

  // Total Luas in scope
  const totalLuasScope = targetLandCovers.reduce((s, c) => s + c.areaHa, 0);

  // Total Luas across entire project
  const projectTotalLuas = landCovers.reduce((s, c) => s + c.areaHa, 0);

  // Dynamic subtotals per service for target scope
  const provTotal = targetLandCovers.reduce((sum, lc) => {
    const cfg = getAreaConfig(lc.id);
    if (!cfg.activeServices.provisioning) return sum;
    const sub = getServiceSubtotal(activeProjectId, lc.id, 'provisioning', cfg.selectedMethods.provisioning, 'flora');
    return sum + sub;
  }, 0);

  const regTotal = targetLandCovers.reduce((sum, lc) => {
    const cfg = getAreaConfig(lc.id);
    if (!cfg.activeServices.regulating) return sum;
    const sub = getServiceSubtotal(activeProjectId, lc.id, 'regulating', cfg.selectedMethods.regulating);
    return sum + sub;
  }, 0);

  const suppTotal = targetLandCovers.reduce((sum, lc) => {
    const cfg = getAreaConfig(lc.id);
    if (!cfg.activeServices.supporting) return sum;
    const sub = getServiceSubtotal(activeProjectId, lc.id, 'supporting', cfg.selectedMethods.supporting);
    return sum + sub;
  }, 0);

  const cultTotal = targetLandCovers.reduce((sum, lc) => {
    const cfg = getAreaConfig(lc.id);
    if (!cfg.activeServices.cultural) return sum;
    const sub = getServiceSubtotal(activeProjectId, lc.id, 'cultural', cfg.selectedMethods.cultural);
    return sum + sub;
  }, 0);

  const tevScope = provTotal + regTotal + suppTotal + cultTotal;

  // Project-wide Grand TEV
  const projectGrandTEV = landCovers.reduce((sum, lc) => {
    const cfg = getAreaConfig(lc.id);
    return sum + getGrandTotalForArea(activeProjectId, lc.id, cfg.activeServices, cfg.selectedMethods, 'flora');
  }, 0);

  // Representative method schemas
  const refAreaId = selectedAreaId !== 'ALL' ? selectedAreaId : (landCovers[0]?.id || 'lc-01');
  const refConfig = getAreaConfig(refAreaId);

  const provSchema = getMethodSchema('provisioning', refConfig.selectedMethods.provisioning, 'flora');
  const regSchema = getMethodSchema('regulating', refConfig.selectedMethods.regulating);
  const suppSchema = getMethodSchema('supporting', refConfig.selectedMethods.supporting);
  const cultSchema = getMethodSchema('cultural', refConfig.selectedMethods.cultural);

  // Count rows in scope per service
  const getRowCount = (serviceId: EcosystemServiceId): number => {
    return targetLandCovers.reduce((acc, lc) => {
      const cfg = getAreaConfig(lc.id);
      if (!cfg.activeServices[serviceId]) return acc;
      const mId = cfg.selectedMethods[serviceId];
      const r = getRows(activeProjectId, lc.id, serviceId, mId, serviceId === 'provisioning' ? 'flora' : undefined);
      return acc + r.length;
    }, 0);
  };

  // Helper to construct row breakdown data for detail modal
  const getBreakdownRows = (serviceId: EcosystemServiceId): RowFormulaBreakdown[] => {
    const breakdownList: RowFormulaBreakdown[] = [];

    targetLandCovers.forEach((lc) => {
      const cfg = getAreaConfig(lc.id);
      if (!cfg.activeServices[serviceId]) return;

      const mId = cfg.selectedMethods[serviceId];
      const rawRows = getRows(activeProjectId, lc.id, serviceId, mId, serviceId === 'provisioning' ? 'flora' : undefined);

      rawRows.forEach((r, idx) => {
        let params = '';
        let formulaText = '';
        const total = Number(r.totalNilai) || 0;

        if (serviceId === 'provisioning') {
          if (mId === 'effect-on-production') {
            const q = Number(r.outputQty) || 0;
            const p = Number(r.hargaOutput) || 0;
            const c = Number(r.biayaTambahan) || 0;
            params = `Output: ${formatNumber(q)} kg | Margin: Rp ${formatNumber(Math.max(0, p - c))}`;
            formulaText = `${formatNumber(q)} kg × (Rp ${formatNumber(p)} - Rp ${formatNumber(c)}) = ${formatIDR(total)}`;
          } else {
            // Market Price Flora
            const prod = Number(r.produktivitas) || 0;
            const luas = Number(r.luasHa) || lc.areaHa;
            const harga = Number(r.hargaUnit) || 0;
            const vol = Number(r.jumlah) || (prod * luas);
            params = `Prod: ${formatNumber(prod)} m³/ha | Luas: ${formatNumber(luas)} ha | Harga: Rp ${formatNumber(harga)}/m³`;
            formulaText = `${formatNumber(prod)} m³/ha × ${formatNumber(luas)} ha × Rp ${formatNumber(harga)} = ${formatIDR(total)}`;
          }
        } else if (serviceId === 'regulating') {
          if (mId === 'carbon-storage') {
            const c = Number(r.stokKarbon) || 0;
            const luas = Number(r.luasHa) || lc.areaHa;
            const harga = Number(r.hargaKarbon) || 0;
            params = `Stok: ${formatNumber(c)} ton C/ha | Luas: ${formatNumber(luas)} ha | Harga: Rp ${formatNumber(harga)}/ton`;
            formulaText = `${formatNumber(c)} ton C/ha × ${formatNumber(luas)} ha × 3.67 (CO₂e) × Rp ${formatNumber(harga)} = ${formatIDR(total)}`;
          } else if (mId === 'damage-cost') {
            const prob = Number(r.probabilitas) || 0;
            const aset = Number(r.nilaiAset) || 0;
            params = `Probabilitas: ${prob}% | Nilai Aset: Rp ${formatNumber(aset)}`;
            formulaText = `${prob}% × Rp ${formatNumber(aset)} = ${formatIDR(total)}`;
          } else {
            // Replacement Cost
            const pjg = Number(r.panjangUnit) || 0;
            const bPengganti = Number(r.biayaPengganti) || 0;
            const bMaint = Number(r.biayaPemeliharaan) || 0;
            params = `Panjang: ${formatNumber(pjg)} m | Biaya: Rp ${formatNumber(bPengganti)}/m | Maint: Rp ${formatNumber(bMaint)}`;
            formulaText = `(${formatNumber(pjg)} m × Rp ${formatNumber(bPengganti)}) + Rp ${formatNumber(bMaint)} = ${formatIDR(total)}`;
          }
        } else if (serviceId === 'supporting') {
          const luas = Number(r.luasHa) || lc.areaHa;
          const k = Number(r.kontribusiPerHa) || 0;
          const ef = Number(r.efektivitas) || 100;
          params = `Luas: ${formatNumber(luas)} ha | Kontribusi: Rp ${formatNumber(k)}/ha | Efektivitas: ${ef}%`;
          formulaText = `${formatNumber(luas)} ha × Rp ${formatNumber(k)}/ha × (${ef}%) = ${formatIDR(total)}`;
        } else if (serviceId === 'cultural') {
          if (mId === 'cvm') {
            const pop = Number(r.populasi) || 0;
            const wtp = Number(r.wtp) || 0;
            const bProg = Number(r.biayaProgram) || 0;
            params = `Populasi: ${formatNumber(pop)} KK | WTP: Rp ${formatNumber(wtp)}/KK | Biaya: Rp ${formatNumber(bProg)}`;
            formulaText = `(${formatNumber(pop)} KK × Rp ${formatNumber(wtp)}) - Rp ${formatNumber(bProg)} = ${formatIDR(total)}`;
          } else if (mId === 'choice-experiment') {
            const resp = Number(r.responden) || 0;
            const mwtp = Number(r.mwtp) || 0;
            params = `Responden: ${formatNumber(resp)} | MWTP: Rp ${formatNumber(mwtp)}`;
            formulaText = `${formatNumber(resp)} responden × Rp ${formatNumber(mwtp)} = ${formatIDR(total)}`;
          } else {
            // TCM
            const q = Number(r.kunjungan) || 0;
            const bp = Number(r.biayaPerjalanan) || 0;
            const bt = Number(r.biayaTiket) || 0;
            params = `Kunjungan: ${formatNumber(q)} org/th | Travel: Rp ${formatNumber(bp)} | Tiket: Rp ${formatNumber(bt)}`;
            formulaText = `${formatNumber(q)} org × (Rp ${formatNumber(bp)} + Rp ${formatNumber(bt)}) = ${formatIDR(total)}`;
          }
        }

        breakdownList.push({
          no: breakdownList.length + 1,
          item: r.item || r.fungsi || r.spesies || `Komponen #${idx + 1}`,
          parameters: params,
          formulaText,
          resultValue: total,
          source: r.source || r.dasarRujukan || 'Survei & Rujukan PKSPL',
          areaName: lc.name,
        });
      });
    });

    return breakdownList;
  };

  // 4 Cards configuration
  const calculationCards = [
    {
      id: 'provisioning' as EcosystemServiceId,
      category: 'Provisioning Services',
      nameId: 'Jasa Penyediaan',
      tagColor: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      borderColor: 'border-l-cyan-600',
      bgColor: 'bg-cyan-50/30',
      icon: TreePine,
      method: provSchema.methodName,
      formulaSnippet: 'Total = Produktivitas (m³/ha) × Luas (ha) × Harga Unit (Rp)',
      subtotal: provTotal,
      rowCount: getRowCount('provisioning'),
      type: 'Direct Use Value',
    },
    {
      id: 'regulating' as EcosystemServiceId,
      category: 'Regulating Services',
      nameId: 'Jasa Pengaturan',
      tagColor: 'bg-blue-100 text-blue-800 border-blue-200',
      borderColor: 'border-l-blue-600',
      bgColor: 'bg-blue-50/30',
      icon: ShieldCheck,
      method: regSchema.methodName,
      formulaSnippet: 'Total = (Panjang Pantai × Biaya Tanggul) + Pemeliharaan / Stok C',
      subtotal: regTotal,
      rowCount: getRowCount('regulating'),
      type: 'Indirect Use Value',
    },
    {
      id: 'supporting' as EcosystemServiceId,
      category: 'Supporting Services',
      nameId: 'Jasa Pendukung & Habitat',
      tagColor: 'bg-purple-100 text-purple-800 border-purple-200',
      borderColor: 'border-l-purple-600',
      bgColor: 'bg-purple-50/30',
      icon: Coins,
      method: suppSchema.methodName,
      formulaSnippet: 'Total = Luas Habitat (ha) × Kontribusi Ekologis (Rp/ha) × Efektivitas',
      subtotal: suppTotal,
      rowCount: getRowCount('supporting'),
      type: 'Ecosystem Function',
    },
    {
      id: 'cultural' as EcosystemServiceId,
      category: 'Cultural Services',
      nameId: 'Jasa Budaya & Rekreasi',
      tagColor: 'bg-amber-100 text-amber-800 border-amber-200',
      borderColor: 'border-l-amber-600',
      bgColor: 'bg-amber-50/30',
      icon: Compass,
      method: cultSchema.methodName,
      formulaSnippet: 'Total = Kunjungan (org/th) × (Biaya Travel + Tiket Masuk)',
      subtotal: cultTotal,
      rowCount: getRowCount('cultural'),
      type: 'Direct & Option Value',
    }
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* 1. Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Tahap 07</span>
            <span>•</span>
            <span className="text-blue-600">Pusat Hasil Kalkulasi</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5 mt-0.5">
            <Calculator className="w-6 h-6 text-blue-600" />
            <span>Perhitungan Total Economic Value (TEV)</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Pusat hasil agregasi valuasi ekonomi pesisir otomatis berdasarkan data dari Data Valuasi. Read-only.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => navigate(`/projects/${activeProjectId}/valuation-data${selectedAreaId !== 'ALL' ? `?area=${selectedAreaId}` : ''}`)}
            className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>Kembali ke Data Valuasi</span>
          </button>
          <button
            onClick={() => navigate(`/projects/${activeProjectId}/analytics`)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <span>Lanjut ke 08 Analitik</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Read-Only Notice Banner */}
      <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-blue-900">
        <div className="flex items-start gap-3">
          <div className="p-1 rounded bg-blue-200 text-blue-800 flex-shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-xs text-blue-950">
              Pusat Hasil Kalkulasi Matematika (Read-Only)
            </div>
            <p className="text-[11.5px] text-blue-800 mt-0.5 leading-relaxed">
              Seluruh angka dan subtotal pada halaman ini dihitung secara otomatis dan konsisten dari tabel ilmiah pada <strong>06 Data Valuasi</strong>.
              Jika Anda ingin memperbarui angka parameter, harga unit, atau menambah spesies, silakan gunakan menu Data Valuasi.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate(`/projects/${activeProjectId}/valuation-data${selectedAreaId !== 'ALL' ? `?area=${selectedAreaId}` : ''}`)}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-xs transition-colors whitespace-nowrap self-start sm:self-auto cursor-pointer shadow-2xs"
        >
          Buka Data Valuasi
        </button>
      </div>

      {/* 3. Scope & Area Selector */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Cakupan Analisis Area:
          </span>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedAreaId}
            onChange={(e) => handleSelectArea(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-bold focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="ALL">
              🌍 Semua Area — Agregasi Menyeluruh Proyek ({formatNumber(projectTotalLuas)} ha)
            </option>
            {landCovers.map((lc) => (
              <option key={lc.id} value={lc.id}>
                📍 {lc.name} ({formatNumber(lc.areaHa)} ha) — {lc.indexCode}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Main Grand TEV Hero Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-xl p-6 md:p-8 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none"></div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>
                {selectedAreaId === 'ALL'
                  ? 'Grand Total Economic Value (TEV) — Seluruh Kawasan Proyek'
                  : `Total Economic Value (TEV) — ${currentArea?.name}`}
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-blue-200 text-xs font-mono">
              {targetLandCovers.length} Area Spasial
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-baseline justify-between gap-4">
            <div>
              <div className="text-3xl sm:text-5xl font-extrabold tracking-tight font-mono text-white">
                {formatIDR(tevScope)}
              </div>
              <div className="text-xs text-blue-200 mt-1">
                Kawasan Pesisir: {activeProject?.name} • Kode: {activeProject?.code}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-blue-100 bg-white/10 p-3 rounded-lg backdrop-blur-xs">
              <div>
                <span className="opacity-70">Luas Cakupan:</span>{' '}
                <strong className="text-white font-mono">{formatNumber(totalLuasScope)} ha</strong>
              </div>
              <span className="opacity-40">•</span>
              <div>
                <span className="opacity-70">Rata-rata/Ha:</span>{' '}
                <strong className="text-white font-mono">
                  {totalLuasScope > 0 ? `${formatIDR(tevScope / totalLuasScope, true)}/ha` : 'Rp 0'}
                </strong>
              </div>
              <span className="opacity-40">•</span>
              <div>
                <span className="opacity-70">Total Variabel:</span>{' '}
                <strong className="text-white font-mono">
                  {getRowCount('provisioning') + getRowCount('regulating') + getRowCount('supporting') + getRowCount('cultural')} baris
                </strong>
              </div>
            </div>
          </div>

          {/* Scientific Formula TEV Equation breakdown */}
          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs font-mono text-blue-200">
            <span className="font-bold text-white">TEV</span>
            <span>=</span>
            <span className="bg-cyan-500/20 px-2 py-0.5 rounded text-cyan-200">
              Direct ({formatIDR(provTotal)})
            </span>
            <span>+</span>
            <span className="bg-blue-500/20 px-2 py-0.5 rounded text-blue-200">
              Indirect ({formatIDR(regTotal)})
            </span>
            <span>+</span>
            <span className="bg-purple-500/20 px-2 py-0.5 rounded text-purple-200">
              Supporting ({formatIDR(suppTotal)})
            </span>
            <span>+</span>
            <span className="bg-amber-500/20 px-2 py-0.5 rounded text-amber-200">
              Cultural ({formatIDR(cultTotal)})
            </span>
          </div>
        </div>
      </div>

      {/* 5. 4 Cards Jasa Ekosistem with [ Lihat Detail Perhitungan ] */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Subtotal per Jasa Ekosistem & Detail Rumus Matematis
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Klik "Lihat Detail Perhitungan" untuk menginspeksi breakdown baris
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {calculationCards.map((card) => {
            const Icon = card.icon;
            const percentOfTEV = tevScope > 0 ? ((card.subtotal / tevScope) * 100).toFixed(1) : '0.0';

            return (
              <div
                key={card.id}
                className={`bg-white rounded-xl border border-slate-200 border-l-4 ${card.borderColor} p-5 shadow-2xs flex flex-col justify-between space-y-4`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-lg ${card.bgColor}`}>
                        <Icon className="w-5 h-5 text-slate-800" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{card.category}</h3>
                        <span className="text-[11px] text-slate-500 font-medium">{card.nameId}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${card.tagColor}`}>
                      {card.type}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Metode Ilmiah:</span>
                      <strong className="text-slate-800">{card.method}</strong>
                    </div>

                    <div className="font-mono text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-blue-900 leading-relaxed">
                      {card.formulaSnippet}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Jumlah Komponen Dihitung:</span>
                      <span className="font-bold text-slate-700">{card.rowCount} baris variabel</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-500 font-medium">Subtotal Terkalkulasi:</span>
                    <div className="text-right">
                      <div className="text-lg font-bold font-mono text-slate-900">
                        {formatIDR(card.subtotal)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {percentOfTEV}% dari Total TEV
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setDetailModalService(card.id)}
                    className="w-full py-2 bg-slate-50 hover:bg-blue-50 text-blue-700 hover:text-blue-800 border border-slate-200 hover:border-blue-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lihat Detail Perhitungan</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Kontribusi per Area Tutupan Lahan */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Distribusi Nilai Valuasi Berdasarkan Area Tutupan Lahan
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Klik pada baris area untuk memfilter hasil kalkulasi ke area tersebut
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium bg-white px-2.5 py-1 rounded border border-slate-200">
            {landCovers.length} Area Spasial Terdaftar
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 text-[11px] uppercase">
                <th className="py-3 px-4">Area Tutupan Lahan</th>
                <th className="py-3 px-4 w-28">Index</th>
                <th className="py-3 px-4 text-right w-28">Luas (Ha)</th>
                <th className="py-3 px-4">Jasa Aktif</th>
                <th className="py-3 px-4 text-right min-w-[180px]">Total Nilai Area (Rp)</th>
                <th className="py-3 px-4 text-right w-28">Kontribusi TEV</th>
                <th className="py-3 px-4 text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {landCovers.map((lc) => {
                const cfg = getAreaConfig(lc.id);
                const areaTotal = getGrandTotalForArea(activeProjectId, lc.id, cfg.activeServices, cfg.selectedMethods, 'flora');
                const percent = projectGrandTEV > 0 ? ((areaTotal / projectGrandTEV) * 100).toFixed(1) : '0.0';
                const activeServiceList = (Object.keys(cfg.activeServices) as (keyof typeof cfg.activeServices)[]).filter(s => cfg.activeServices[s]);
                const isSelected = selectedAreaId === lc.id;

                return (
                  <tr
                    key={lc.id}
                    className={`hover:bg-blue-50/40 transition-colors ${isSelected ? 'bg-blue-50/60 font-semibold' : ''}`}
                  >
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>}
                        <span>{lc.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-normal capitalize">
                        {lc.type.replace('_', ' ')}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-blue-700">{lc.indexCode}</td>
                    <td className="py-3 px-4 text-right font-mono">{formatNumber(lc.areaHa)}</td>
                    <td className="py-3 px-4 text-slate-600">
                      <div className="flex flex-wrap gap-1">
                        {activeServiceList.map(s => (
                          <span key={s} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] uppercase font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {formatIDR(areaTotal)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600 font-semibold">
                      {percent}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleSelectArea(isSelected ? 'ALL' : lc.id)}
                        className={`text-[11px] px-2 py-1 rounded font-semibold cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isSelected ? 'Reset Filter' : 'Filter Area'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. Next Step Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-5 rounded-xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">Tahap Selanjutnya • Langkah 08</div>
          <div className="text-sm font-semibold text-white mt-0.5">
            Analitik Komparatif & Visualisasi Grafik Interaktif
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Eksplorasi diagram kontribusi TEV, komposisi valuasi per tutupan lahan, dan komparasi metode valuasi.
          </p>
        </div>
        <button
          onClick={() => navigate(`/projects/${activeProjectId}/analytics`)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-sm whitespace-nowrap self-start sm:self-auto"
        >
          <span>Lanjut ke 08 Analitik</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 8. MODAL DETAIL PERHITUNGAN (Formula Breakdown Per Row) */}
      {/* ========================================================================= */}
      {detailModalService && (() => {
        const activeCard = calculationCards.find(c => c.id === detailModalService);
        const breakdownRows = getBreakdownRows(detailModalService);
        const totalBreakdown = breakdownRows.reduce((acc, r) => acc + r.resultValue, 0);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
              {/* Modal Header */}
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
                    <Calculator className="w-4 h-4" />
                    <span>Breakdown Formula Matematis Per Baris</span>
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-slate-900 mt-0.5">
                    {activeCard?.category} ({activeCard?.nameId})
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Metode: <strong>{activeCard?.method}</strong> • Cakupan:{' '}
                    <strong>{selectedAreaId === 'ALL' ? 'Semua Area Proyek' : currentArea?.name}</strong>
                  </div>
                </div>

                <button
                  onClick={() => setDetailModalService(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scientific Formula Schema Header */}
              <div className="px-6 py-3 bg-blue-50/60 border-b border-blue-100 flex items-center justify-between flex-wrap gap-2 text-xs font-mono text-blue-900">
                <div>
                  <span className="font-bold text-slate-700 font-sans text-xs mr-2">Formula Perhitungan:</span>
                  <span className="bg-white px-2.5 py-1 rounded border border-blue-200 font-semibold">
                    {activeCard?.formulaSnippet}
                  </span>
                </div>
                <div className="text-[11px] text-blue-700 font-sans">
                  Nilai dihitung otomatis tanpa pembulatan prematur
                </div>
              </div>

              {/* Rows Breakdown Table */}
              <div className="p-6 overflow-y-auto space-y-4 flex-1">
                {breakdownRows.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    Belum ada baris data yang dimasukkan untuk jasa ini pada area yang dipilih.
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 text-[11px] uppercase">
                          <th className="py-3 px-3 w-10 text-center">No</th>
                          <th className="py-3 px-4 min-w-[200px]">Komponen / Spesies</th>
                          {selectedAreaId === 'ALL' && <th className="py-3 px-3 w-28">Area Spasial</th>}
                          <th className="py-3 px-4 min-w-[240px]">Penjabaran Rumus Matematis</th>
                          <th className="py-3 px-4 text-right min-w-[160px]">Subtotal (Rp)</th>
                          <th className="py-3 px-4 min-w-[150px]">Dasar Rujukan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {breakdownRows.map((row) => (
                          <tr key={row.no} className="hover:bg-slate-50/70">
                            <td className="py-3 px-3 text-center font-mono text-slate-400">{row.no}</td>
                            <td className="py-3 px-4 font-semibold text-slate-900">
                              {row.item}
                              <div className="text-[10.5px] text-slate-500 font-normal font-mono mt-0.5">
                                {row.parameters}
                              </div>
                            </td>
                            {selectedAreaId === 'ALL' && (
                              <td className="py-3 px-3 text-slate-600 text-[11px]">
                                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                                  {row.areaName}
                                </span>
                              </td>
                            )}
                            <td className="py-3 px-4">
                              <span className="font-mono text-[11px] bg-slate-50 text-blue-900 px-2.5 py-1 rounded border border-slate-200 inline-block font-semibold">
                                {row.formulaText}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                              {formatIDR(row.resultValue)}
                            </td>
                            <td className="py-3 px-4 text-slate-500 text-[11px] italic">
                              {row.source}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-slate-50 border-t-2 border-slate-300 font-bold text-xs">
                          <td colSpan={selectedAreaId === 'ALL' ? 4 : 3} className="py-3 px-4 text-right text-slate-700">
                            Total Subtotal {activeCard?.nameId}:
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-sm text-blue-900">
                            {formatIDR(totalBreakdown)}
                          </td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  Ingin merevisi angka parameter?{' '}
                  <button
                    onClick={() => {
                      setDetailModalService(null);
                      navigate(`/projects/${activeProjectId}/valuation-data?area=${selectedAreaId !== 'ALL' ? selectedAreaId : 'lc-01'}&service=${detailModalService}`);
                    }}
                    className="text-blue-600 hover:text-blue-800 font-semibold underline cursor-pointer"
                  >
                    Buka Data Valuasi
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDetailModalService(null)}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export const CalculationPage: React.FC = () => {
  return (
    <ErrorBoundary
      fallbackTitle="Terjadi masalah saat memuat Perhitungan TEV."
      fallbackMessage="Komponen kalkulasi mengalami kendala render. Silakan coba muat ulang halaman atau atur kembali data di Data Valuasi."
    >
      <CalculationPageContent />
    </ErrorBoundary>
  );
};

export default CalculationPage;
