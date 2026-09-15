import React from 'react';
import { MessageSquare, Send, Search, UserCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminMessagesPage: React.FC = () => {
  const navigate = useNavigate();

  const messagesList = [
    {
      id: 'MSG-01',
      sender: 'Dr. Ir. Retno Wulandari',
      role: 'Peneliti',
      project: 'PKS-994KY1',
      snippet: 'Pak Daffa, dokumen review valuasi mangrove Benoa sudah kami kirimkan ke Analyst...',
      time: '15 Menit lalu',
      unread: true,
    },
    {
      id: 'MSG-02',
      sender: 'Dr. Hendra Kusuma',
      role: 'Analyst',
      project: 'PKS-R49A12',
      snippet: 'Mohon konfirmasi standar acuan shadow price yang digunakan untuk lamun Banten.',
      time: '2 Jam lalu',
      unread: true,
    },
    {
      id: 'MSG-03',
      sender: 'Budi Santoso',
      role: 'Peneliti',
      project: 'PKS-KKPRIV',
      snippet: 'File SHP poligon hutan kota Jakarta sudah diunggah ulang dan diverifikasi.',
      time: 'Kemarin',
      unread: false,
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 text-slate-800">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 md:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <span className="text-blue-600">Super Admin</span>
            <span>•</span>
            <span>Komunikasi Tim</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5 mt-0.5">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            <span>Pesan & Komunikasi Sistem</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Saluran koordinasi terintegrasi antara Super Administrator, Peneliti, dan Analyst.
          </p>
        </div>

        <button
          onClick={() => alert('Fitur Tulis Pesan Baru akan dibuka.')}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>+ Tulis Pesan</span>
        </button>
      </div>

      {/* Messages List Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs divide-y divide-slate-100 overflow-hidden">
        {messagesList.map((msg) => (
          <div
            key={msg.id}
            className={`p-5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs cursor-pointer ${
              msg.unread ? 'bg-blue-50/20' : ''
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                {msg.sender.charAt(0)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{msg.sender}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-semibold">
                    {msg.role}
                  </span>
                  <span className="text-[11px] font-mono text-blue-600 font-semibold">
                    [{msg.project}]
                  </span>
                  {msg.unread && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                  )}
                </div>
                <p className="text-slate-600 line-clamp-1">{msg.snippet}</p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 text-slate-400 pl-13 sm:pl-0">
              <span className="font-mono text-[11px]">{msg.time}</span>
              <button
                onClick={() => alert(`Buka percakapan dengan ${msg.sender}`)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white rounded text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer"
              >
                Buka
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMessagesPage;
