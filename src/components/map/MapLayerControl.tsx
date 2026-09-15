import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { Layers } from 'lucide-react';

export const MapLayerControl: React.FC = () => {
  const { layers, toggleLayerVisibility } = useProject();

  return (
    <div className="bg-white/95 backdrop-blur-xs border border-slate-200 rounded-md p-3 shadow-md text-xs w-52 select-none">
      <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2 pb-1 border-b border-slate-100 flex items-center gap-1.5">
        <Layers className="w-3.5 h-3.5 text-blue-600" />
        <span>Layer Peta</span>
      </div>
      <div className="space-y-1.5">
        {layers.map(layer => (
          <label
            key={layer.id}
            className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors"
          >
            <input
              type="checkbox"
              checked={layer.visible}
              onChange={() => toggleLayerVisibility(layer.id)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
            />
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: layer.color }}></span>
            <span className={`text-slate-700 font-medium ${layer.visible ? 'text-slate-900' : 'text-slate-400'}`}>
              {layer.name}
            </span>
            <span className="text-[10px] text-slate-400 ml-auto">({layer.featureCount})</span>
          </label>
        ))}
      </div>
    </div>
  );
};
