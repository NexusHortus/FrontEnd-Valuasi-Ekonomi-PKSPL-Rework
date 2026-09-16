import React from 'react';
import { useSpreadsheet } from '../../context/SpreadsheetContext';
import { CheckCircle2, Loader2, AlertCircle, WifiOff } from 'lucide-react';

export const AutosaveIndicator: React.FC = () => {
  const { isSaving, lastSavedText, saveError, isOffline, retrySave, toggleOfflineSimulation } = useSpreadsheet();

  return (
    <div className="flex items-center gap-2 text-xs shrink-0 whitespace-nowrap">
      {/* Offline toggle simulator for testing */}
      <button
        onClick={toggleOfflineSimulation}
        title={isOffline ? "Klik untuk mensimulasikan kembali ONLINE" : "Klik untuk mensimulasikan OFFLINE"}
        className={`px-2 py-1 rounded text-xs border flex items-center gap-1.5 transition-colors shrink-0 ${
          isOffline 
            ? 'bg-amber-100 text-amber-800 border-amber-300 font-medium' 
            : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
        }`}
      >
        {isOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-600" /> : <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>}
        <span className="hidden sm:inline">{isOffline ? 'Offline' : 'Online'}</span>
      </button>

      {/* Main Save Status */}
      {isSaving ? (
        <span className="flex items-center gap-1.5 text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded border border-blue-200">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Menyimpan...
        </span>
      ) : saveError ? (
        <span className="flex items-center gap-1.5 text-rose-600 font-medium bg-rose-50 px-2 py-1 rounded border border-rose-200">
          <AlertCircle className="w-3.5 h-3.5" />
          Gagal menyimpan
          <button 
            onClick={retrySave}
            className="underline hover:text-rose-800 ml-1 font-bold"
          >
            Coba lagi
          </button>
        </span>
      ) : (
        <span className="flex items-center gap-1.5 text-slate-600 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>{lastSavedText}</span>
        </span>
      )}
    </div>
  );
};
