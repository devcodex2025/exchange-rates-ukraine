import React from 'react';
import { Globe } from 'lucide-react';

export const ADS_ENABLED = false;

interface AdPlaceholderProps {
  label: string;
  className?: string;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ label, className = "" }) => {
  if (!ADS_ENABLED) return null;
  return (
    <div className={`bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-4 flex flex-col items-center justify-center min-h-[100px] transition-all hover:bg-slate-200 dark:hover:bg-slate-750 ${className}`}>
      <Globe className="text-slate-400 dark:text-slate-600 mb-2" size={24} />
      <span className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold">{label}</span>
      <span className="text-[8px] text-slate-400 dark:text-slate-600 mt-1 uppercase font-medium">Google AdSense Space</span>
    </div>
  );
};
