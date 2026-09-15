import React from 'react';
import { ProjectStatus } from '../../types/project';

interface StatusBadgeProps {
  status: ProjectStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = status.toUpperCase().replace(/\s+/g, '_');

  let bg = 'bg-slate-100 text-slate-700 border-slate-200';
  let dot = 'bg-slate-400';
  let label = status;

  switch (normalized) {
    case 'DRAFT':
      bg = 'bg-slate-100 text-slate-600 border-slate-200';
      dot = 'bg-slate-400';
      label = 'Draft';
      break;
    case 'DIKERJAKAN':
      bg = 'bg-blue-50 text-blue-700 border-blue-200';
      dot = 'bg-blue-500';
      label = 'Dikerjakan';
      break;
    case 'SIAP_REVIEW':
      bg = 'bg-amber-50 text-amber-700 border-amber-200';
      dot = 'bg-amber-500';
      label = 'Siap Review';
      break;
    case 'MENUNGGU_ANALYST':
    case 'MENUNGGU_REVIEW':
      bg = 'bg-purple-50 text-purple-700 border-purple-200';
      dot = 'bg-purple-500';
      label = 'Menunggu Analyst';
      break;
    case 'PERLU_PERBAIKAN':
      bg = 'bg-rose-50 text-rose-700 border-rose-200';
      dot = 'bg-rose-500 animate-pulse';
      label = 'Perlu Perbaikan';
      break;
    case 'SELESAI':
      bg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      dot = 'bg-emerald-500';
      label = 'Selesai';
      break;
  }

  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-xs' 
    : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded border ${bg} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`}></span>
      {label}
    </span>
  );
};
