import React, { useState } from 'react';
import { ADMIN_USERS_LIST } from '../../mock/adminMock';
import { Users, Plus, Search, ShieldCheck, Mail, Building, CheckCircle2, UserPlus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminUsersPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const filteredUsers = ADMIN_USERS_LIST.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.institution.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 text-slate-800">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 md:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <span className="text-blue-600">Super Admin</span>
            <span>•</span>
            <span>Otoritas Pengguna</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5 mt-0.5">
            <Users className="w-6 h-6 text-blue-600" />
            <span>Manajemen Pengguna</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Daftar seluruh akun peneliti, analyst, dan super administrator terdaftar di PKSPL IPB.
          </p>
        </div>

        <button
          onClick={() => alert('Modal Tambah User Baru akan dibuka.')}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Tambah Pengguna</span>
        </button>
      </div>

      {/* Users Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama, email, institusi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            {['ALL', 'Peneliti', 'Analyst', 'Super Admin'].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                  roleFilter === r
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {r === 'ALL' ? 'Semua Role' : r}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Nama Pengguna</th>
                <th className="py-3 px-4">Role Akses</th>
                <th className="py-3 px-4">Institusi / Unit</th>
                <th className="py-3 px-4 text-center">Proyek Terkait</th>
                <th className="py-3 px-4">Aktivitas Terakhir</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{user.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>{user.email}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                        user.role === 'Super Admin'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : user.role === 'Analyst'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium">
                    {user.institution}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-slate-800">
                    {user.assignedProjectsCount}
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                    {user.lastActive}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>{user.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
