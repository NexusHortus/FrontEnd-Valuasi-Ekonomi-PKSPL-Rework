import React, { useState, useRef, useEffect } from 'react';
import { Conversation, ChatMessage } from '../../mock/chatMock';
import {
  ArrowLeft,
  Search,
  MoreVertical,
  Paperclip,
  Send,
  CheckCheck,
  Check,
  Sparkles,
  ExternalLink,
  FileText,
  Image,
  MapPin,
  FolderKanban,
  X,
  Phone,
  Video
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ChatWindowPanelProps {
  conversation: Conversation;
  onSendMessage: (text: string, attachment?: { name: string; type: 'file' | 'image' | 'shp'; size: string }) => void;
  onBackMobile: () => void;
}

export const ChatWindowPanel: React.FC<ChatWindowPanelProps> = ({
  conversation,
  onSendMessage,
  onBackMobile,
}) => {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [searchInChatQuery, setSearchInChatQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [simulatedAttachment, setSimulatedAttachment] = useState<{
    name: string;
    type: 'file' | 'image' | 'shp';
    size: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages]);

  // Focus input when conversation changes
  useEffect(() => {
    inputRef.current?.focus();
  }, [conversation.id]);

  const handleSend = () => {
    if (!inputText.trim() && !simulatedAttachment) return;

    onSendMessage(inputText.trim(), simulatedAttachment || undefined);
    setInputText('');
    setSimulatedAttachment(null);
    setShowAttachmentMenu(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Filter messages if search within chat is active
  const displayedMessages = searchInChatQuery.trim()
    ? conversation.messages.filter((m) =>
        m.text.toLowerCase().includes(searchInChatQuery.toLowerCase())
      )
    : conversation.messages;

  // Quick reply suggestions relevant to PKSPL Valuation
  const quickReplies = [
    'Baik, saya akan cek kembali datanya.',
    'Data valuasi mangrove sudah kami verifikasi.',
    'Mohon perbaiki harga satuan flora di spreadsheet.',
    'Template excel sudah diperbarui ke versi terbaru.',
  ];

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 relative overflow-hidden">
      {/* ------------------------------------------------------------- */}
      {/* 1. CHAT HEADER                                                */}
      {/* ------------------------------------------------------------- */}
      <div className="h-16 px-4 md:px-6 bg-white border-b border-slate-200/90 flex items-center justify-between shrink-0 shadow-2xs z-10">
        {/* Left: Mobile Back Button + Avatar & User Info */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile Back Button */}
          <button
            onClick={onBackMobile}
            title="Kembali ke daftar percakapan"
            className="md:hidden p-1.5 -ml-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* User Avatar */}
          <div className="relative shrink-0">
            <div
              className={`w-10 h-10 rounded-full bg-gradient-to-tr ${conversation.userAvatarBg} text-white font-bold text-xs flex items-center justify-center shadow-xs ring-2 ring-slate-100`}
            >
              {conversation.userInitials}
            </div>
            <span
              className={`
                absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white
                ${conversation.isOnline ? 'bg-emerald-500' : 'bg-slate-300'}
              `}
            />
          </div>

          {/* Name & Online / Role Status */}
          <div className="min-w-0 leading-tight">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#0F172A] truncate">
                {conversation.userName}
              </h3>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase tracking-wider ${
                  conversation.userRole === 'Analyst'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200/80'
                    : 'bg-cyan-50 text-cyan-700 border border-cyan-200/80'
                }`}
              >
                {conversation.userRole}
              </span>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5 truncate">
              {conversation.isOnline ? (
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  Online
                </span>
              ) : (
                <span className="text-slate-400">
                  Terakhir dilihat {conversation.lastSeen || 'Hari ini'}
                </span>
              )}

              {conversation.projectCode && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-blue-600 font-mono font-medium truncate">
                    {conversation.projectCode}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1 md:gap-1.5 shrink-0">
          {/* Project Direct Link (if available) */}
          {conversation.projectCode && (
            <button
              onClick={() => navigate(`/projects/${conversation.projectCode}/maps`)}
              title={`Buka proyek ${conversation.projectCode} di modul spasial`}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <FolderKanban className="w-3.5 h-3.5 text-blue-600" />
              <span>Lihat Proyek</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>
          )}

          {/* Toggle Search within messages */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            title="Cari dalam percakapan ini"
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isSearchOpen ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Search className="w-4 h-4" />
          </button>

          {/* More options */}
          <button
            onClick={() => alert(`Informasi kontak: ${conversation.userName} (${conversation.userRole})\nProyek: ${conversation.projectCode || '-'}`)}
            title="Info Pengguna & Opsi"
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Optional Search bar inside chat */}
      {isSearchOpen && (
        <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 flex items-center gap-2 animate-in slide-in-from-top-2 duration-150 shrink-0">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari kata dalam obrolan..."
            value={searchInChatQuery}
            onChange={(e) => setSearchInChatQuery(e.target.value)}
            className="flex-1 bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          {searchInChatQuery && (
            <button
              onClick={() => setSearchInChatQuery('')}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => {
              setIsSearchOpen(false);
              setSearchInChatQuery('');
            }}
            className="p-1 text-slate-400 hover:text-slate-700"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. CHAT MESSAGE AREA (Scrollable)                             */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {/* Project Context Banner in Chat */}
        {conversation.projectName && (
          <div className="max-w-md mx-auto my-2 p-2.5 rounded-xl bg-blue-50/80 border border-blue-200/70 text-center text-xs text-blue-900 shadow-2xs">
            <span className="font-semibold text-blue-950">Topik Proyek: </span>
            <span className="font-bold">{conversation.projectName}</span>{' '}
            <span className="font-mono text-[11px] text-blue-600">({conversation.projectCode})</span>
          </div>
        )}

        {/* Date Separator */}
        <div className="flex items-center justify-center my-3">
          <span className="px-3 py-1 rounded-full bg-slate-200/80 text-[11px] font-semibold text-slate-600 shadow-2xs">
            Hari ini
          </span>
        </div>

        {/* Messages List */}
        {displayedMessages.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Tidak ada pesan yang cocok dengan pencarian &ldquo;{searchInChatQuery}&rdquo;.
          </div>
        ) : (
          displayedMessages.map((msg) => {
            const isMe = msg.isOutgoing;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group`}
              >
                {/* Sender Name if incoming */}
                {!isMe && (
                  <span className="text-[10px] font-semibold text-slate-500 ml-1 mb-1">
                    {msg.senderName}
                  </span>
                )}

                {/* Message Bubble Container */}
                <div
                  className={`
                    max-w-[85%] sm:max-w-md md:max-w-lg lg:max-w-xl p-3.5 text-xs leading-relaxed transition-shadow
                    ${
                      isMe
                        ? 'bg-[#2563EA] text-white rounded-2xl rounded-tr-xs shadow-xs'
                        : 'bg-white text-slate-800 border border-slate-200/90 rounded-2xl rounded-tl-xs shadow-2xs'
                    }
                  `}
                >
                  {/* Optional File Attachment rendering */}
                  {msg.attachment && (
                    <div
                      className={`
                        mb-2.5 p-2 rounded-xl flex items-center gap-2.5
                        ${isMe ? 'bg-blue-700/60 text-white' : 'bg-slate-100 text-slate-800'}
                      `}
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                        {msg.attachment.type === 'shp' ? (
                          <MapPin className="w-4 h-4" />
                        ) : msg.attachment.type === 'image' ? (
                          <Image className="w-4 h-4" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold truncate text-[11px]">{msg.attachment.name}</div>
                        <div className="text-[10px] opacity-75">{msg.attachment.size}</div>
                      </div>
                    </div>
                  )}

                  {/* Message Text */}
                  <p className="whitespace-pre-wrap break-words">{msg.text}</p>

                  {/* Timestamp and Read Status */}
                  <div
                    className={`
                      flex items-center justify-end gap-1 mt-1 text-[10px] select-none
                      ${isMe ? 'text-blue-100' : 'text-slate-400'}
                    `}
                  >
                    <span>{msg.timestamp}</span>
                    {isMe && (
                      <span title="Terkirim & Terbaca">
                        {msg.status === 'read' ? (
                          <CheckCheck className="w-3.5 h-3.5 text-white" />
                        ) : (
                          <Check className="w-3.5 h-3.5 text-blue-200" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. QUICK SUGGESTION PILLS                                     */}
      {/* ------------------------------------------------------------- */}
      <div className="px-4 py-1.5 bg-slate-100/70 border-t border-slate-200/60 flex items-center gap-2 overflow-x-auto shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 shrink-0">
          <Sparkles className="w-3 h-3 text-blue-600" />
          Template Cepat:
        </span>
        {quickReplies.map((reply, idx) => (
          <button
            key={idx}
            onClick={() => setInputText(reply)}
            className="text-[11px] px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 whitespace-nowrap transition-colors cursor-pointer shadow-2xs"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. STICKY MESSAGE COMPOSER / INPUT AREA                       */}
      {/* ------------------------------------------------------------- */}
      <div className="p-3 md:p-4 bg-white border-t border-slate-200 shrink-0 relative">
        {/* Simulated Attachment Preview Banner if picked */}
        {simulatedAttachment && (
          <div className="mb-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-900 animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>
                Lampiran terpilih: <strong>{simulatedAttachment.name}</strong> ({simulatedAttachment.size})
              </span>
            </div>
            <button
              onClick={() => setSimulatedAttachment(null)}
              className="text-slate-400 hover:text-rose-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Attachment Menu Popup */}
        {showAttachmentMenu && (
          <div className="absolute bottom-full mb-2 left-4 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-20 space-y-1 text-xs text-slate-700 w-52 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <button
              onClick={() => {
                setSimulatedAttachment({
                  name: `Template_Valuasi_${conversation.projectCode || 'PKSPL'}.xlsx`,
                  type: 'file',
                  size: '245 KB',
                });
                setShowAttachmentMenu(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors text-left cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Lampirkan Template Excel</span>
            </button>

            <button
              onClick={() => {
                setSimulatedAttachment({
                  name: `Layer_Tutupan_${conversation.projectCode || 'Benoa'}.zip`,
                  type: 'shp',
                  size: '4.8 MB',
                });
                setShowAttachmentMenu(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors text-left cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Lampirkan SHP GIS (.zip)</span>
            </button>

            <button
              onClick={() => {
                setSimulatedAttachment({
                  name: 'Grafik_Analitik_TEV.png',
                  type: 'image',
                  size: '1.2 MB',
                });
                setShowAttachmentMenu(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors text-left cursor-pointer"
            >
              <Image className="w-4 h-4 text-purple-600" />
              <span>Lampirkan Gambar Bagan</span>
            </button>
          </div>
        )}

        {/* Main Input Form */}
        <div className="flex items-end gap-2">
          {/* Attachment Button */}
          <button
            type="button"
            onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
            title="Lampirkan dokumen, data spasial, atau gambar"
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer shrink-0 ${
              showAttachmentMenu || simulatedAttachment
                ? 'bg-blue-50 border-blue-300 text-blue-600'
                : 'bg-slate-100 hover:bg-slate-200 border-transparent text-slate-600'
            }`}
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Textarea Input */}
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ketik pesan..."
              className="w-full max-h-32 px-4 py-2.5 bg-slate-100/90 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-[#2563EA] rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
            />
          </div>

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={!inputText.trim() && !simulatedAttachment}
            title="Kirim Pesan (Enter)"
            className={`
              p-2.5 rounded-xl flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-xs
              ${
                inputText.trim() || simulatedAttachment
                  ? 'bg-[#2563EA] hover:bg-blue-700 text-white hover:scale-105 active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }
            `}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
