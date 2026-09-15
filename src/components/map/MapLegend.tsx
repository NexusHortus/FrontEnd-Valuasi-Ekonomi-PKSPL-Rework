import React from 'react';

export const MapLegend: React.FC = () => {
  const legendItems = [
    { label: 'Mangrove', color: 'bg-emerald-600', border: 'border-emerald-700' },
    { label: 'Lamun', color: 'bg-teal-600', border: 'border-teal-700' },
    { label: 'Terumbu Karang', color: 'bg-orange-500', border: 'border-orange-600' },
    { label: 'Perairan Teluk', color: 'bg-sky-500', border: 'border-sky-600' },
    { label: 'Lainnya', color: 'bg-amber-500', border: 'border-amber-600' },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-xs border border-slate-200 rounded-md p-3 shadow-md text-xs w-44 select-none">
      <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2 pb-1 border-b border-slate-100 flex items-center justify-between">
        <span>Legenda</span>
        <span className="text-[10px] text-slate-400 font-normal">GIS Arc</span>
      </div>
      <div className="space-y-1.5">
        {legendItems.map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <span className={`w-3.5 h-3.5 rounded-xs ${item.color} border ${item.border} shadow-xs`}></span>
            <span className="text-slate-700 font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
