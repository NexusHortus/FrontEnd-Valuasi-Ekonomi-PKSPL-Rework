import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ADMIN_SYSTEM_STATS,
  ECOSYSTEM_VALUATION_DISTRIBUTION,
  PROJECT_STATUS_BREAKDOWN,
  MONTHLY_TREND_DATA,
  ADMIN_PROJECTS_LIST,
  ADMIN_ACTIVITY_LOGS,
  ADMIN_USERS_LIST
} from '../../mock/adminMock';
import { formatIDR, formatNumber } from '../../utils/formatter';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Coins,
  FolderKanban,
  MapPin,
  Users,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Activity,
  Layers,
  Search,
  Filter,
  Eye,
  ExternalLink,
  Download,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Database,
  Calendar
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
  Legend
} from 'recharts';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // Search & Filter state for Projects table
  const [projectSearch, setProjectSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Filtered projects
  const filteredProjects = ADMIN_PROJECTS_LIST.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.code.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.lead.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.location.toLowerCase().includes(projectSearch.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 text-slate-800">
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP BANNER / OVERVIEW BAR                                   */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 md:p-6 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <span className="text-blue-600 font-bold">Portal Super Administrator</span>
            <span>•</span>
            <span>PKSPL IPB University</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Ringkasan Ekosistem & Valuasi Ekonomi Nasional
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Monitoring terpusat atas seluruh portofolio penelitian, status validasi analyst, dan agregasi Total Economic Value (TEV).
          </p>
        </div>

        {/* Quick Actions & Last Backup */}
        <div className="flex items-center flex-wrap gap-2.5 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Sinkronisasi: <strong>{ADMIN_SYSTEM_STATS.lastBackup}</strong></span>
          </div>

          <button
            onClick={() => alert('Fitur Ekspor Executive Summary (PDF / Excel) disimulasikan siap diunduh.')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-300" />
            <span>Ekspor Ringkasan</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. 4 GLOBAL KPI CARDS                                         */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* Card 1: Grand TEV */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs relative overflow-hidden group hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Economic Value (TEV)
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Rp 142,85 <span className="text-sm font-semibold text-slate-500">Miliar</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{ADMIN_SYSTEM_STATS.totalTevGrowth} dari tahun lalu</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Dari 18 Proyek Pesisir</span>
            <span className="font-semibold text-slate-700">Rata-rata: Rp 7,9 M/proyek</span>
          </div>
        </div>

        {/* Card 2: Total Projects */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs relative overflow-hidden group hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Proyek Penelitian
            </span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <FolderKanban className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              {ADMIN_SYSTEM_STATS.totalProjects}{' '}
              <span className="text-sm font-semibold text-slate-500">Proyek Riset</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-600 mt-1">
              <span className="font-semibold text-blue-600">{ADMIN_SYSTEM_STATS.projectsActive} Aktif</span>
              <span>•</span>
              <span className="font-semibold text-amber-600">{ADMIN_SYSTEM_STATS.projectsPendingReview} Review</span>
              <span>•</span>
              <span className="font-semibold text-emerald-600">{ADMIN_SYSTEM_STATS.projectsCompleted} Selesai</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Perlu Perbaikan: <strong className="text-rose-600">{ADMIN_SYSTEM_STATS.projectsNeedsRevision}</strong></span>
            <span
              onClick={() => navigate('/admin/projects')}
              className="font-semibold text-blue-600 hover:underline cursor-pointer flex items-center gap-0.5"
            >
              <span>Kelola</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Card 3: Total Area */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs relative overflow-hidden group hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Luas Kawasan
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              {formatNumber(ADMIN_SYSTEM_STATS.totalAreaHa)}{' '}
              <span className="text-sm font-semibold text-slate-500">Hektare</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{ADMIN_SYSTEM_STATS.areaGrowth} cakupan spasial</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>4 Jenis Tutupan Lahan</span>
            <span className="font-semibold text-slate-700">142 Poligon GIS</span>
          </div>
        </div>

        {/* Card 4: Total Users */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs relative overflow-hidden group hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pengguna Terdaftar
            </span>
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              {ADMIN_SYSTEM_STATS.totalUsers}{' '}
              <span className="text-sm font-semibold text-slate-500">Pengguna</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-600 mt-1">
              <span>{ADMIN_SYSTEM_STATS.usersPeneliti} Peneliti</span>
              <span>•</span>
              <span>{ADMIN_SYSTEM_STATS.usersAnalyst} Analyst</span>
              <span>•</span>
              <span>{ADMIN_SYSTEM_STATS.usersAdmin} Admin</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Status Sistem</span>
            <span className="font-semibold text-emerald-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {ADMIN_SYSTEM_STATS.systemUptime} Uptime
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. CHARTS ROW: VALUATION BY ECOSYSTEM & STATUS DONUT          */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
        {/* Chart A: Ecosystem Valuation Distribution (Bar Chart - 7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 md:p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <h2 className="text-sm md:text-base font-bold text-slate-900">
                Distribusi Nilai Valuasi Berdasarkan Ekosistem Pesisir
              </h2>
              <p className="text-xs text-slate-500">
                Total akumulasi moneter per tipe tutupan lahan dalam seluruh penelitian
              </p>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded self-start sm:self-auto">
              Satuan: Miliar Rupiah (Rp)
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ECOSYSTEM_VALUATION_DISTRIBUTION.map((d) => ({
                  name: d.name,
                  miliar: Number((d.value / 1e9).toFixed(1)),
                  fullValue: d.value,
                  color: d.color,
                  areaHa: d.areaHa,
                }))}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickFormatter={(val) => `${val} M`}
                />
                <Tooltip
                  formatter={(value: any, name: any, item: any) => [
                    `${formatIDR(item.payload.fullValue)} (${item.payload.areaHa} Ha)`,
                    'Nilai Valuasi',
                  ]}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '12px',
                    border: 'none',
                  }}
                  itemStyle={{ color: '#93C5FD' }}
                />
                <Bar dataKey="miliar" radius={[6, 6, 0, 0]}>
                  {ECOSYSTEM_VALUATION_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Mini legend & summary under chart */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
            {ECOSYSTEM_VALUATION_DISTRIBUTION.map((eco) => (
              <div key={eco.name} className="p-2 rounded bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-600 text-[11px] truncate">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: eco.color }} />
                  <span className="truncate">{eco.name}</span>
                </div>
                <div className="font-bold text-slate-900 mt-0.5">Rp {eco.valueFormatted}</div>
                <div className="text-[10px] text-slate-400">{eco.percentage}% dari TEV</div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart B: Project Status Breakdown (Donut Chart - 5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 md:p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-sm md:text-base font-bold text-slate-900">
              Status Alur Kerja Proyek
            </h2>
            <p className="text-xs text-slate-500">
              Distribusi 18 proyek penelitian dalam pipeline sistem
            </p>
          </div>

          <div className="h-52 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PROJECT_STATUS_BREAKDOWN}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {PROJECT_STATUS_BREAKDOWN.map((entry, idx) => (
                    <Cell key={`status-cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} Proyek`, name]}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Centered label inside donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-slate-900">18</span>
              <span className="text-[10px] font-medium text-slate-400 uppercase">Total Proyek</span>
            </div>
          </div>

          {/* Legend Table */}
          <div className="space-y-1.5 text-xs pt-2 border-t border-slate-100">
            {PROJECT_STATUS_BREAKDOWN.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700 font-medium">{item.name}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-bold text-slate-900">{item.count}</span>
                  <span className="text-slate-400 text-[11px]">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. HISTORICAL VALUATION & SUBMISSION TREND (AREA CHART)        */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white p-5 md:p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <h2 className="text-sm md:text-base font-bold text-slate-900">
              Tren Pertumbuhan Valuasi & Aktivitas Penelitian (6 Bulan Terakhir)
            </h2>
            <p className="text-xs text-slate-500">
              Perkembangan akumulasi nilai moneter TEV (Miliar Rp) serta laju proyek baru dan selesai
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded self-start sm:self-auto flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Akumulasi: Rp 142.85 Miliar</span>
          </span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MONTHLY_TREND_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="tevGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748B' }}
                tickFormatter={(val) => `${val} M`}
                domain={[80, 160]}
              />
              <Tooltip
                formatter={(val: any, name: any) => [
                  name === 'akumulasiTevMiliar' ? `Rp ${val} Miliar` : val,
                  name === 'akumulasiTevMiliar' ? 'Akumulasi TEV' : name === 'proyekBaru' ? 'Proyek Baru' : 'Proyek Selesai',
                ]}
                contentStyle={{
                  backgroundColor: '#0F172A',
                  color: '#fff',
                  borderRadius: '8px',
                  fontSize: '12px',
                  border: 'none',
                }}
              />
              <Area
                type="monotone"
                dataKey="akumulasiTevMiliar"
                stroke="#2563EB"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#tevGradient)"
                name="akumulasiTevMiliar"
                dot={{ r: 4.5, fill: '#2563EB', stroke: '#FFFFFF', strokeWidth: 2 }}
                activeDot={{ r: 6.5, fill: '#1D4ED8', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 5. DUAL LOWER SECTION: RECENT PROJECTS & SYSTEM AUDIT FEED     */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
        {/* Left: Recent Projects Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-slate-200 bg-slate-50/50 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-sm md:text-base font-bold text-slate-900">
                  Daftar Proyek Penelitian Sistem
                </h2>
                <p className="text-xs text-slate-500">
                  Pengawasan portofolio valuasi seluruh peneliti di PKSPL IPB
                </p>
              </div>

              <button
                onClick={() => navigate('/admin/projects')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
              >
                <span>Lihat Semua Proyek ({ADMIN_PROJECTS_LIST.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 text-xs">
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari kode, nama, lokasi..."
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Status filter tabs */}
              <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
                {['ALL', 'MENUNGGU_ANALYST', 'DIKERJAKAN', 'SELESAI'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      statusFilter === st
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {st === 'ALL'
                      ? 'Semua'
                      : st === 'MENUNGGU_ANALYST'
                      ? 'Menunggu Review'
                      : st === 'DIKERJAKAN'
                      ? 'Dikerjakan'
                      : 'Selesai'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Proyek & Kode</th>
                  <th className="py-3 px-4">Ekosistem & Lokasi</th>
                  <th className="py-3 px-4">Peneliti Utama</th>
                  <th className="py-3 px-4 text-right">Nilai TEV (Rp)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Tidak ada proyek yang sesuai dengan kriteria pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((proj) => (
                    <tr key={proj.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-medium">
                        <div className="font-bold text-slate-900">{proj.name}</div>
                        <div className="font-mono text-[11px] text-blue-600">{proj.code}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <div className="font-medium text-slate-800">{proj.ecosystem}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[160px]">{proj.location}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {proj.lead}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        {formatIDR(proj.totalTev)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <StatusBadge status={proj.status} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => navigate(`/projects/${proj.id}/maps`)}
                          title="Buka proyek di modul penelitian"
                          className="px-2 py-1 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 rounded border border-slate-200 text-[11px] font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Detail</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Menampilkan {filteredProjects.length} dari {ADMIN_PROJECTS_LIST.length} proyek penelitian</span>
            <span className="font-medium text-slate-600">Terakhir diperbarui: Hari ini</span>
          </div>
        </div>

        {/* Right: Recent Audit Activity Feed (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Riwayat Aktivitas Terkini
                </h3>
              </div>
              <button
                onClick={() => navigate('/admin/activity')}
                className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                Lihat Semua
              </button>
            </div>

            {/* Feed items */}
            <div className="space-y-3.5">
              {ADMIN_ACTIVITY_LOGS.map((act) => (
                <div key={act.id} className="flex items-start gap-2.5 text-xs">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  <div className="space-y-0.5 flex-1 leading-relaxed">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-slate-800 truncate">{act.userName}</span>
                      <span className={`text-[9px] px-1 py-0.2 rounded font-semibold ${act.badgeColor}`}>
                        {act.userRole}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      {act.action}: <strong className="text-slate-700">{act.target}</strong>
                    </p>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {act.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mini User Summary Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                <h3 className="font-bold text-sm text-slate-900">Pengguna & Akses</h3>
              </div>
              <button
                onClick={() => navigate('/admin/users')}
                className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                Kelola ({ADMIN_USERS_LIST.length})
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-100">
                <div className="text-base font-bold text-blue-700">24</div>
                <div className="text-[10px] text-slate-500 font-medium">Peneliti</div>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-100">
                <div className="text-base font-bold text-amber-700">10</div>
                <div className="text-[10px] text-slate-500 font-medium">Analyst</div>
              </div>
              <div className="p-2.5 rounded-lg bg-indigo-50/60 border border-indigo-100">
                <div className="text-base font-bold text-indigo-700">4</div>
                <div className="text-[10px] text-slate-500 font-medium">Admin</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
