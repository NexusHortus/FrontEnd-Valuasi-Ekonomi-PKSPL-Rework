import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Database,
  Users,
  FolderKanban,
  Activity,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  UserCheck,
  LogOut,
  ShieldCheck,
  ExternalLink,
  Settings,
  Sparkles,
  X
} from 'lucide-react';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  collapsed,
  onToggleCollapse,
  isMobileOpen = false,
  onMobileClose,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navigation Items
  const navItems = [
    {
      title: 'Dashboard',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
      badge: undefined,
    },
    {
      title: 'Master Data',
      path: '/admin/master-data',
      icon: Database,
      badge: 'Global',
    },
    {
      title: 'Manajemen Pengguna',
      path: '/admin/users',
      icon: Users,
      badge: '38',
    },
    {
      title: 'Manajemen Proyek',
      path: '/admin/projects',
      icon: FolderKanban,
      badge: '18',
    },
    {
      title: 'Riwayat Aktivitas',
      path: '/admin/activity',
      icon: Activity,
      badge: undefined,
    },
    {
      title: 'Pesan',
      path: '/admin/messages',
      icon: MessageSquare,
      badge: '3 Baru',
      badgeColor: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          bg-[#0F172A] text-slate-300 border-r border-slate-800
          flex flex-col transition-all duration-300 ease-in-out select-none
          ${isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'}
          ${collapsed ? 'md:w-20' : 'md:w-64'}
        `}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/50">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Logo Badge */}
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-900/30 shrink-0 ring-1 ring-white/15">
              PK
            </div>

            {(!collapsed || isMobileOpen) && (
              <div className="leading-tight truncate">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white tracking-wider">PKSPL</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    Super Admin
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium truncate">
                  Sistem Valuasi Ekonomi
                </div>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={onToggleCollapse}
            title={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
            className="hidden md:flex p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          {isMobileOpen && (
            <button
              onClick={onMobileClose}
              className="md:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Global Context Tag (Expanded only) */}
        {(!collapsed || isMobileOpen) && (
          <div className="px-4 py-2.5 bg-slate-950/30 border-b border-slate-800/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">Lingkup Otoritas:</span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Sistem Global
            </span>
          </div>
        )}

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {(!collapsed || isMobileOpen) && (
            <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Menu Utama
            </div>
          )}

          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={collapsed && !isMobileOpen ? item.title : undefined}
                className={`
                  relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 group cursor-pointer
                  ${
                    isActive
                      ? 'bg-[#2563EA] text-white shadow-sm font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }
                  ${collapsed && !isMobileOpen ? 'justify-center px-0' : ''}
                `}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white rounded-r-full" />
                )}

                <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />

                {(!collapsed || isMobileOpen) && (
                  <div className="flex-1 flex items-center justify-between truncate">
                    <span className="truncate">{item.title}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                          isActive
                            ? 'bg-blue-800 text-blue-100'
                            : item.badgeColor || 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </NavLink>
            );
          })}

          {/* Separator */}
          <div className="my-3 border-t border-slate-800/80" />

          {/* Switch Role Quick Action */}
          {(!collapsed || isMobileOpen) ? (
            <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Mode Tampilan</span>
                <span className="font-semibold text-blue-400">Admin</span>
              </div>
              <button
                onClick={() => navigate('/projects')}
                className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded text-[11px] font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
              >
                <span>Buka Role Peneliti</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/projects')}
              title="Buka Role Peneliti (/projects)"
              className="w-full flex items-center justify-center py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* SIDEBAR PROFILE SECTION (VERY BOTTOM)                             */}
        {/* ----------------------------------------------------------------- */}
        <div ref={profileRef} className="relative p-3 border-t border-slate-800 bg-slate-950/60">
          {/* Dropdown Menu Popover */}
          {profileMenuOpen && (
            <div
              className={`
                absolute bottom-full mb-2 bg-[#0F172A] border border-slate-700 rounded-xl shadow-2xl z-50 text-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-150
                ${collapsed && !isMobileOpen ? 'left-3 w-64' : 'left-3 right-3'}
              `}
            >
              {/* Profile Card Header */}
              <div className="p-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-blue-400/30 shrink-0">
                  DA
                </div>
                <div className="leading-tight overflow-hidden">
                  <div className="text-xs font-bold text-white truncate">Daffa Arynt</div>
                  <div className="text-[11px] text-blue-400 font-medium">superadmin@pkspl.ipb.ac.id</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">PKSPL IPB University</div>
                </div>
              </div>

              {/* Menu Options */}
              <div className="p-1.5 space-y-0.5 text-xs font-medium">
                <button
                  onClick={() => {
                    setProfileMenuOpen(false);
                    navigate('/admin/users');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors text-left cursor-pointer"
                >
                  <UserCheck className="w-4 h-4 text-slate-400" />
                  <span>Profil Super Admin</span>
                </button>

                <button
                  onClick={() => {
                    setProfileMenuOpen(false);
                    navigate('/admin/activity');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors text-left cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Pengaturan Sistem</span>
                </button>

                <div className="my-1 border-t border-slate-800" />

                <button
                  onClick={() => {
                    setProfileMenuOpen(false);
                    navigate('/projects');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-blue-300 hover:text-blue-100 hover:bg-blue-900/30 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span>Masuk sebagai Peneliti</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-blue-400" />
                </button>

                <button
                  onClick={() => {
                    setProfileMenuOpen(false);
                    alert('Sesi simulasi Super Admin. Gunakan switch role untuk berganti peran.');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>Keluar</span>
                </button>
              </div>
            </div>
          )}

          {/* Profile Trigger Button */}
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className={`
              w-full flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer group text-left
              ${profileMenuOpen ? 'bg-slate-800 ring-1 ring-slate-700' : 'hover:bg-slate-800/70'}
              ${collapsed && !isMobileOpen ? 'justify-center p-1.5' : ''}
            `}
            title="Daffa Arynt (Super Admin) - Klik untuk menu profil"
          >
            {/* Avatar with status indicator */}
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-1 ring-white/20">
                DA
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0F172A]" />
            </div>

            {/* Name & Role */}
            {(!collapsed || isMobileOpen) && (
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white truncate group-hover:text-blue-300 transition-colors">
                  Daffa Arynt
                </div>
                <div className="text-[11px] text-slate-400 font-medium truncate flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-blue-400 inline shrink-0" />
                  <span>Super Admin</span>
                </div>
              </div>
            )}

            {/* Dropdown Chevron / Indicator */}
            {(!collapsed || isMobileOpen) && (
              <MoreVertical className="w-4 h-4 text-slate-400 group-hover:text-slate-200 shrink-0" />
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
