import React, { useState } from 'react';
import { Conversation } from '../../mock/chatMock';
import {
  Search,
  Plus,
  MoreVertical,
  Filter,
  CheckCheck,
  User,
  ShieldCheck,
  Building,
  Sparkles,
  X
} from 'lucide-react';

interface ConversationListPanelProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation?: (name: string, role: 'Peneliti' | 'Analyst', initialMsg: string) => void;
}

export const ConversationListPanel: React.FC<ConversationListPanelProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRoleFilter, setActiveRoleFilter] = useState<'ALL' | 'Peneliti' | 'Analyst'>('ALL');
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<'Peneliti' | 'Analyst'>('Peneliti');
  const [newInitialMsg, setNewInitialMsg] = useState('');

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessageSnippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.projectCode && c.projectCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.projectName && c.projectName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = activeRoleFilter === 'ALL' || c.userRole === activeRoleFilter;

    return matchesSearch && matchesRole;
  });

  const handleCreateNewChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) return;
    if (onNewConversation) {
      onNewConversation(
        newUserName.trim(),
        newUserRole,
        newInitialMsg.trim() || 'Halo, saya ingin mendiskusikan valuasi ekonomi terkait riset Anda.'
      );
    }
    setNewUserName('');
    setNewInitialMsg('');
    setIsNewChatModalOpen(false);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white border-r border-slate-200 select-none">
      {/* 1. Header: Pesan + New Chat & Options */}
      <div className="h-16 px-4 md:px-5 flex items-center justify-between border-b border-slate-200/90 bg-white shrink-0">
        <div className="flex items-center gap-2.5">
          <h2 className="text-lg font-bold text-[#0F172A] tracking-tight">
            Pesan
          </h2>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
            {conversations.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* New Chat Button */}
          <button
            onClick={() => setIsNewChatModalOpen(true)}
            title="Mulai Percakapan Baru"
            className="p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
          >
            <Plus className="w-5 h-5" />
          </button>

          {/* More Options Button */}
          <button
            onClick={() => alert('Opsi Pengaturan Pesan: Tandai semua telah dibaca, arsip percakapan, atau ekspor riwayat chat.')}
            title="Opsi Pesan"
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Search Bar */}
      <div className="px-4 py-2.5 bg-white shrink-0">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari pengguna atau percakapan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-[#2563EA] rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Category / Role Filter Pills */}
      <div className="px-4 pb-3 flex items-center gap-1.5 shrink-0 border-b border-slate-100">
        {(['ALL', 'Peneliti', 'Analyst'] as const).map((role) => {
          const isActive = activeRoleFilter === role;
          const label = role === 'ALL' ? 'Semua' : role;
          return (
            <button
              key={role}
              onClick={() => setActiveRoleFilter(role)}
              className={`
                px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer
                ${
                  isActive
                    ? 'bg-[#2563EA] text-white shadow-xs shadow-blue-500/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-800'
                }
              `}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* 4. Scrollable Conversation List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100/80">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs space-y-1">
            <p className="font-semibold text-slate-600">Tidak ada percakapan ditemukan</p>
            <p className="text-[11px]">Coba cari dengan kata kunci lain atau ubah filter role.</p>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isSelected = conv.id === activeConversationId;

            return (
              <div
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`
                  relative flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-150 group
                  ${
                    isSelected
                      ? 'bg-blue-50/80 border-l-4 border-l-[#2563EA]'
                      : 'hover:bg-slate-50/90 border-l-4 border-l-transparent'
                  }
                `}
              >
                {/* Avatar with Online/Offline Indicator */}
                <div className="relative shrink-0">
                  <div
                    className={`w-11 h-11 rounded-full bg-gradient-to-tr ${conv.userAvatarBg} text-white font-bold text-xs flex items-center justify-center shadow-xs ring-2 ${
                      isSelected ? 'ring-blue-300' : 'ring-white'
                    }`}
                  >
                    {conv.userInitials}
                  </div>
                  <span
                    className={`
                      absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white
                      ${conv.isOnline ? 'bg-emerald-500' : 'bg-slate-300'}
                    `}
                    title={conv.isOnline ? 'Online' : 'Offline'}
                  />
                </div>

                {/* Conversation Details */}
                <div className="flex-1 min-w-0">
                  {/* Top line: Name & Timestamp */}
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <span
                        className={`text-xs font-bold truncate ${
                          isSelected ? 'text-blue-950 font-extrabold' : 'text-[#0F172A]'
                        }`}
                      >
                        {conv.userName}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-mono shrink-0 ${
                        conv.unreadCount > 0 ? 'text-[#2563EA] font-bold' : 'text-slate-400'
                      }`}
                    >
                      {conv.lastMessageTime}
                    </span>
                  </div>

                  {/* Middle line: Role badge & Project code */}
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-semibold uppercase tracking-wider ${
                        conv.userRole === 'Analyst'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200/80'
                          : 'bg-cyan-50 text-cyan-700 border border-cyan-200/80'
                      }`}
                    >
                      {conv.userRole}
                    </span>
                    {conv.projectCode && (
                      <span className="text-[10px] font-mono text-slate-400 truncate">
                        • {conv.projectCode}
                      </span>
                    )}
                  </div>

                  {/* Bottom line: Last message snippet & Unread badge */}
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <p
                      className={`text-xs truncate ${
                        conv.unreadCount > 0
                          ? 'text-slate-900 font-semibold'
                          : 'text-slate-500 group-hover:text-slate-700'
                      }`}
                    >
                      {conv.lastMessageSnippet}
                    </p>

                    {conv.unreadCount > 0 && (
                      <span className="shrink-0 bg-[#2563EA] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[18px] text-center shadow-xs">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 5. Modal: New Chat Simulation */}
      {isNewChatModalOpen && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Mulai Percakapan Baru</h3>
              </div>
              <button
                onClick={() => setIsNewChatModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewChat} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Pengguna:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Maya Sartika, S.Kel"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Peran (Role):</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as 'Peneliti' | 'Analyst')}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="Peneliti">Peneliti / Researcher</option>
                  <option value="Analyst">Analyst / Reviewer</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pesan Awal:</label>
                <textarea
                  rows={3}
                  placeholder="Tulis pesan pembuka untuk pengguna ini..."
                  value={newInitialMsg}
                  onChange={(e) => setNewInitialMsg(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewChatModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#2563EA] hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Mulai Obrolan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
