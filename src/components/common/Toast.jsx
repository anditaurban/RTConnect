import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function Toast() {
  const { toast, closeToast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-brand-500 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/95 dark:bg-emerald-950/90 text-emerald-900 dark:text-emerald-200',
    warning: 'border-amber-200 dark:border-amber-800 bg-amber-50/95 dark:bg-amber-950/90 text-amber-900 dark:text-amber-200',
    error: 'border-rose-200 dark:border-rose-800 bg-rose-50/95 dark:bg-rose-950/90 text-rose-900 dark:text-rose-200',
    info: 'border-brand-200 dark:border-brand-800 bg-brand-50/95 dark:bg-brand-950/90 text-brand-900 dark:text-brand-200',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md ${
          borders[toast.type] || borders.info
        }`}
      >
        {icons[toast.type] || icons.info}
        <div className="flex-1 text-xs font-medium pr-2 leading-relaxed">
          {toast.message}
        </div>
        <button
          onClick={closeToast}
          className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors"
          aria-label="Tutup notifikasi"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

