import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/common/Button';

export function Forbidden403({ onBack }) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">403 — Akses Ditolak</h1>
      <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
        Anda tidak memiliki izin untuk membuka halaman atau data wilayah ini. Akses dibatasi sesuai peran dan kewenangan Anda.
      </p>
      <div className="mt-6">
        <Button variant="primary" icon={ArrowLeft} onClick={onBack}>
          Kembali ke Beranda
        </Button>
      </div>
    </div>
  );
}
