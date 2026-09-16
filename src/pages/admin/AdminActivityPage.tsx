import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  AUDIT_LOGS_DATA,
  AUDIT_SUMMARY_STATS,
  AuditRecord,
  ActivityType,
  UserRole
} from '../../mock/auditMock';
import { AdminActivityDetailModal } from '../../components/admin/activity/AdminActivityDetailModal';
import {
  Activity,
  Users,
  Database,
  ShieldAlert,
  Search,
  Filter,
  Download,
  RotateCcw,
  Eye,
  Calendar,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  X,
  FileSpreadsheet,
  FileText,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import * as XLSX from 'xlsx';

export const AdminActivityPage: React.FC = () => {
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [projectFilter, setProjectFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('ALL');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Detail Modal State
  const [selectedActivity, setSelectedActivity] = useState<AuditRecord | null>(null);

  // Export Dropdown State
  const [isExportOpen, setIsExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setIsExportOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Extract unique project list for filter dropdown
  const projectOptions = useMemo(() => {
    const set = new Set<string>();
    AUDIT_LOGS_DATA.forEach((log) => {
      if (log.projectCode) {
        set.add(`${log.projectCode} • ${log.projectName || ''}`);
      }
    });
    return Array.from(set);
  }, []);

  // Filtering Logic
  const filteredLogs = useMemo(() => {
    return AUDIT_LOGS_DATA.filter((log) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchUser = log.userName.toLowerCase().includes(q) || log.userEmail.toLowerCase().includes(q);
        const matchTitle = log.actionTitle.toLowerCase().includes(q) || log.actionDetail.toLowerCase().includes(q);
        const matchProj =
          (log.projectCode && log.projectCode.toLowerCase().includes(q)) ||
          (log.projectName && log.projectName.toLowerCase().includes(q));
        const matchModule = log.moduleName.toLowerCase().includes(q);
        const matchId = log.id.toLowerCase().includes(q);

        if (!matchUser && !matchTitle && !matchProj && !matchModule && !matchId) {
          return false;
        }
      }

      // 2. Role Filter
      if (roleFilter !== 'ALL' && log.userRole !== roleFilter) {
        return false;
      }

      // 3. Activity Type Filter
      if (typeFilter !== 'ALL' && log.activityType !== typeFilter) {
        return false;
      }

      // 4. Project Filter
      if (projectFilter !== 'ALL') {
        if (projectFilter === 'NON_PROJECT') {
          if (log.projectCode) return false;
        } else {
          const code = projectFilter.split(' • ')[0];
          if (log.projectCode !== code) return false;
        }
      }

      // 5. Date Filter (Mock logic based on timestamp string)
      if (dateFilter !== 'ALL') {
        if (dateFilter === 'TODAY' && !log.relativeTime.includes('Menit') && !log.relativeTime.includes('Jam')) {
          return false;
        }
        if (dateFilter === '7DAYS' && log.relativeTime.includes('Bulan')) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, roleFilter, typeFilter, projectFilter, dateFilter]);

  // Reset page on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, typeFilter, projectFilter, dateFilter, pageSize]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, currentPage, pageSize]);

  // Reset all filters to default
  const handleResetFilters = () => {
    setSearchQuery('');
    setRoleFilter('ALL');
    setTypeFilter('ALL');
    setProjectFilter('ALL');
    setDateFilter('ALL');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    roleFilter !== 'ALL' ||
    typeFilter !== 'ALL' ||
    projectFilter !== 'ALL' ||
    dateFilter !== 'ALL';

  // Export handlers
  const handleExport = (format: 'xlsx' | 'csv') => {
    setIsExportOpen(false);

    const exportRows = filteredLogs.map((log, idx) => ({
      No: idx + 1,
      'ID Log': log.id,
      Waktu: log.timeDisplay,
      Pengguna: log.userName,
      Email: log.userEmail,
      Role: log.userRole,
      'Tipe Aktivitas': log.activityType,
      'Judul Tindakan': log.actionTitle,
      Deskripsi: log.actionDetail,
      'Kode Proyek': log.projectCode || '-',
      'Nama Proyek': log.projectName || '-',
      Modul: log.moduleName,
      'IP Address': log.ipAddress,
      Status: log.status,
      'Latency (ms)': log.durationMs,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Riwayat_Aktivitas');

    const fileName = `Audit_Log_PKSPL_${new Date().toISOString().slice(0, 10)}.${format}`;

    if (format === 'xlsx') {
      XLSX.writeFile(workbook, fileName);
    } else {
      XLSX.writeFile(workbook, fileName, { bookType: 'csv' });
    }
  };

  const getActivityTypeBadge = (type: ActivityType) => {
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
      case 'Login':
      case 'Logout':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getRoleBadge = (role: UserRole) => {
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
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 text-slate-800">
      {/* ------------------------------------------------------------- */}
      {/* 1. PAGE HEADER                                                */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <span className="text-blue-600 font-bold">Super Admin</span>
            <span>•</span>
            <span>Audit Trail & Security</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0F172A] tracking-tight mt-0.5">
            Riwayat Aktivitas
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Pantau seluruh aktivitas pengguna dan perubahan data dalam sistem.
          </p>
        </div>

        {/* Right Export Dropdown */}
        <div ref={exportRef} className="relative self-start sm:self-auto shrink-0">
          <button
            onClick={() => setIsExportOpen(!isExportOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-[#2563EA] hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExportOpen ? 'rotate-180' : ''}`} />
          </button>

          {isExportOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-20 p-1.5 space-y-1 text-xs text-slate-700 animate-in fade-in slide-in-from-top-2 duration-150">
              <button
                onClick={() => handleExport('xlsx')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-left cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Excel (.xlsx)</span>
              </button>
              <button
                onClick={() => handleExport('csv')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-left cursor-pointer"
              >
                <FileText className="w-4 h-4 text-blue-600" />
                <span>CSV (.csv)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. 4 COMPACT SUMMARY CARDS                                    */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Aktivitas Hari Ini */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Aktivitas Hari Ini
            </span>
            <div className="text-2xl font-black text-[#0F172A] mt-0.5">
              {AUDIT_SUMMARY_STATS.todayActivities}
            </div>
            <span className="text-[11px] font-semibold text-emerald-600">
              {AUDIT_SUMMARY_STATS.todayGrowth}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Pengguna Aktif */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Pengguna Aktif
            </span>
            <div className="text-2xl font-black text-[#0F172A] mt-0.5">
              {AUDIT_SUMMARY_STATS.activeUsers}
            </div>
            <span className="text-[11px] text-slate-500">
              {AUDIT_SUMMARY_STATS.activeUsersDesc}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Perubahan Data */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Perubahan Data
            </span>
            <div className="text-2xl font-black text-[#0F172A] mt-0.5">
              {AUDIT_SUMMARY_STATS.dataChanges}
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              {AUDIT_SUMMARY_STATS.dataChangesDesc}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Aktivitas Penting */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Aktivitas Penting
            </span>
            <div className="text-2xl font-black text-[#0F172A] mt-0.5">
              {AUDIT_SUMMARY_STATS.importantActivities}
            </div>
            <span className="text-[11px] text-slate-500">
              {AUDIT_SUMMARY_STATS.importantActivitiesDesc}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. FILTER AREA (THE CORE CONTROL CENTER)                      */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-2xs space-y-3.5">
        {/* Top search bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama user, project, atau aktivitas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-[#2563EA] rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Bottom filter row with dropdowns & reset button */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5 pt-1 text-xs">
          {/* Role Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Role Pengguna
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ALL">Semua Role</option>
              <option value="Peneliti">Peneliti</option>
              <option value="Analyst">Analyst</option>
              <option value="Super Admin">Super Admin</option>
            </select>
          </div>

          {/* Activity Type Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Tipe Aktivitas
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ALL">Semua Aktivitas</option>
              <option value="Login">Login</option>
              <option value="Logout">Logout</option>
              <option value="Create">Create</option>
              <option value="Update">Update</option>
              <option value="Delete">Delete</option>
              <option value="Import">Import</option>
              <option value="Export">Export</option>
              <option value="Submit">Submit</option>
              <option value="Review">Review</option>
              <option value="Approve">Approve</option>
              <option value="Reject">Reject</option>
            </select>
          </div>

          {/* Project Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Proyek Terkait
            </label>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer truncate"
            >
              <option value="ALL">Semua Project</option>
              {projectOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
              <option value="NON_PROJECT">Sistem / Master Data (Non-Project)</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Rentang Waktu
            </label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ALL">Semua Waktu</option>
              <option value="TODAY">Hari ini</option>
              <option value="7DAYS">7 hari terakhir</option>
              <option value="30DAYS">30 hari terakhir</option>
            </select>
          </div>

          {/* Reset Filter Button */}
          <div className="flex items-end">
            <button
              onClick={handleResetFilters}
              disabled={!hasActiveFilters}
              className={`
                w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-semibold transition-colors
                ${
                  hasActiveFilters
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 cursor-pointer'
                    : 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed'
                }
              `}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filter</span>
            </button>
          </div>
        </div>

        {/* Filter status indicator */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span>
              Menampilkan <strong>{filteredLogs.length}</strong> aktivitas
              {hasActiveFilters && ' (hasil penyaringan)'}
            </span>
            {hasActiveFilters && (
              <span className="px-2 py-0.2 rounded bg-blue-50 text-blue-700 font-bold">
                Filter Aktif
              </span>
            )}
          </div>

          <span className="text-slate-400">
            Klik baris tabel untuk melihat rincian audit log lengkap
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. ACTIVITY TABLE (SCAN ACTIVITY)                             */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 w-44">Waktu</th>
                <th className="py-3 px-4 w-52">Pengguna</th>
                <th className="py-3 px-4 w-28 text-center">Tipe</th>
                <th className="py-3 px-4">Deskripsi Tindakan</th>
                <th className="py-3 px-4 w-56">Proyek / Modul</th>
                <th className="py-3 px-4 w-24 text-center">Status</th>
                <th className="py-3 px-4 w-24 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 space-y-2">
                    <Activity className="w-8 h-8 mx-auto text-slate-300" />
                    <div className="font-semibold text-slate-600">Tidak ada aktivitas ditemukan</div>
                    <p className="text-[11px] max-w-sm mx-auto">
                      Coba sesuaikan kata kunci pencarian atau bersihkan filter yang aktif.
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-2 px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-bold text-xs cursor-pointer"
                    >
                      Reset Semua Filter
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedActivity(log)}
                    className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                  >
                    {/* Waktu */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{log.timeDisplay}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{log.relativeTime}</span>
                      </div>
                    </td>

                    {/* Pengguna */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-full bg-gradient-to-tr ${log.userAvatarBg} text-white font-bold text-[10px] flex items-center justify-center shrink-0 shadow-2xs`}
                        >
                          {log.userInitials}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 truncate">{log.userName}</div>
                          <span
                            className={`inline-block text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider border mt-0.5 ${getRoleBadge(
                              log.userRole
                            )}`}
                          >
                            {log.userRole}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Tipe Aktivitas */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-md border ${getActivityTypeBadge(
                          log.activityType
                        )}`}
                      >
                        {log.activityType}
                      </span>
                    </td>

                    {/* Deskripsi Tindakan */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {log.actionTitle}
                      </div>
                      <p className="text-slate-500 text-[11px] line-clamp-1 mt-0.5">
                        {log.actionDetail}
                      </p>
                    </td>

                    {/* Proyek / Modul */}
                    <td className="py-3 px-4">
                      {log.projectCode ? (
                        <div>
                          <span className="font-mono text-[11px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                            {log.projectCode}
                          </span>
                          <div className="text-[11px] text-slate-700 font-medium truncate mt-0.5">
                            {log.projectName}
                          </div>
                        </div>
                      ) : (
                        <div className="text-slate-600 font-medium">{log.projectName || 'Sistem Global'}</div>
                      )}
                      <div className="text-[10px] text-slate-400 mt-0.5">{log.moduleName}</div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      {log.status === 'SUCCESS' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>Sukses</span>
                        </span>
                      ) : log.status === 'WARNING' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <AlertTriangle className="w-3 h-3 text-amber-500" />
                          <span>Revisi</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          <X className="w-3 h-3 text-rose-500" />
                          <span>Gagal</span>
                        </span>
                      )}
                    </td>

                    {/* Aksi */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedActivity(log);
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-lg text-slate-700 text-[11px] font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer"
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

        {/* ------------------------------------------------------------- */}
        {/* 5. PAGINATION FOOTER                                          */}
        {/* ------------------------------------------------------------- */}
        <div className="p-4 bg-slate-50/70 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span>
              Menampilkan{' '}
              <strong>{filteredLogs.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> -{' '}
              <strong>{Math.min(currentPage * pageSize, filteredLogs.length)}</strong> dari{' '}
              <strong>{filteredLogs.length}</strong> aktivitas
            </span>

            <span className="text-slate-300">|</span>

            <div className="flex items-center gap-1.5">
              <span>Per halaman:</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="bg-white border border-slate-300 rounded px-2 py-0.5 text-xs font-semibold cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors ${
                currentPage === 1
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300 cursor-pointer'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Sebelumnya</span>
            </button>

            <span className="px-3 py-1 font-mono font-bold text-slate-800 bg-white border border-slate-200 rounded-lg">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors ${
                currentPage === totalPages
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300 cursor-pointer'
              }`}
            >
              <span className="hidden sm:inline">Selanjutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 6. DETAIL MODAL                                               */}
      {/* ------------------------------------------------------------- */}
      <AdminActivityDetailModal
        activity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
      />
    </div>
  );
};

export default AdminActivityPage;
