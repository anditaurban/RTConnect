// Formatting utilities for RTConnect

/**
 * Format integer/number to Indonesian Rupiah (e.g. Rp 50.000)
 */
export function formatRupiah(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format ISO date string to Indonesian localized format (e.g. 14 Agu 2026)
 */
export function formatDate(dateStr, includeDay = false) {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...(includeDay && { weekday: 'long' }),
    };
    return new Intl.DateTimeFormat('id-ID', options).format(date);
  } catch {
    return dateStr;
  }
}

/**
 * Format ISO datetime string to Indonesian localized format (e.g. 14 Agu 2026, 09:30 WIB)
 */
export function formatDateTime(dateStr) {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    const datePart = new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
    const timePart = new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
    return `${datePart}, ${timePart} WIB`;
  } catch {
    return dateStr;
  }
}

/**
 * Get semantic badge classes based on status and domain
 */
export function getStatusBadgeConfig(status) {
  switch (status) {
    // Surat & Pembayaran & Aspirasi Success states
    case 'Disetujui':
    case 'Lunas':
    case 'Selesai':
    case 'Aktif':
    case 'Baik':
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
        dot: 'bg-emerald-500',
      };

    // Pending / Review states
    case 'Diajukan':
    case 'Menunggu Verifikasi':
    case 'Ditinjau':
    case 'Diproses':
    case 'Ditindaklanjuti':
    case 'Akan Datang':
    case 'Berlangsung':
      return {
        bg: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
        dot: 'bg-blue-500',
      };

    // Warning / Need Attention states
    case 'Perlu Revisi':
    case 'Draft':
    case 'Baru':
    case 'Perlu Perbaikan':
      return {
        bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
        dot: 'bg-amber-500',
      };

    // Danger / Negative states
    case 'Ditolak':
    case 'Terlambat':
    case 'Dibatalkan':
    case 'Nonaktif':
    case 'Meninggal':
    case 'Rusak':
      return {
        bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
        dot: 'bg-rose-500',
      };

    // Neutral / Unpaid states
    case 'Belum Dibayar':
      return {
        bg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
        dot: 'bg-slate-400',
      };
    case 'Pindah':
      return {
        bg: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
        dot: 'bg-purple-500',
      };

    default:
      return {
        bg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
        dot: 'bg-slate-400',
      };
  }
}

