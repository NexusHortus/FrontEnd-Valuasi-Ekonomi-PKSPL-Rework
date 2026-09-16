import React from 'react';
import { MessageSquare, ShieldCheck, Sparkles } from 'lucide-react';

export const EmptyChatState: React.FC = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shadow-xs mb-4">
        <MessageSquare className="w-8 h-8 text-blue-600" />
      </div>

      <h3 className="text-lg font-bold text-slate-900 tracking-tight">
        Pilih percakapan
      </h3>
      <p className="text-xs md:text-sm text-slate-500 max-w-sm mt-1.5 leading-relaxed">
        Pilih pengguna dari daftar di sebelah kiri untuk memulai percakapan, koordinasi riset, atau verifikasi data valuasi.
      </p>

      <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-600">
        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
        <span>Saluran Komunikasi Resmi PKSPL IPB University</span>
      </div>
    </div>
  );
};
