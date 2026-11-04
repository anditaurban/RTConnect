import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Button } from './Button';
import { Modal } from './Modal';

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi Penghapusan',
  message = 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.',
  confirmLabel,
  confirmText,
  cancelLabel = 'Batal',
  variant = 'danger', // danger or warning
  loading = false,
  children,
}) {
  const finalConfirmLabel = confirmText || confirmLabel || 'Ya, Hapus Data';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="max-w-md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={loading}
            icon={variant === 'danger' ? Trash2 : AlertTriangle}
          >
            {finalConfirmLabel}
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-xl shrink-0 ${
            variant === 'danger' ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600' : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600'
          }`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-0.5">
            {message}
          </p>
        </div>
        {children}
      </div>
    </Modal>
  );
}
