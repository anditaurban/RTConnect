import React from 'react';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/common/Button';

export function NotFound404({ onBack }) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center mb-4">
        <FileQuestion className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">404 — Halaman Tidak Ditemukan</h1>
      <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
        Halaman yang Anda cari tidak tersedia atau tautan telah dipindahkan.
      </p>
      <div className="mt-6">
        <Button variant="primary" icon={ArrowLeft} onClick={onBack}>
          Kembali ke Beranda
        </Button>
      </div>
    </div>
  );
}
