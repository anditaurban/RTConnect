import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

export function EmptyState({
  icon: Icon = Inbox,
  title = 'Belum Ada Data',
  description = 'Data tidak ditemukan atau belum ada pencatatan untuk kategori ini.',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div className={`text-center py-12 px-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 ${className}`}>
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-300 mb-3">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-4">
          <Button size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
