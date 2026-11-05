import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatDate } from '../../utils/formatters';
import { Badge } from '../../components/common/Badge';
import { Card, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import {
  FileText,
  CreditCard,
  MessageSquareWarning,
  Calendar,
  AlertCircle,
  Megaphone,
  ArrowRight,
  PhoneCall,
  Clock,
  Sparkles,
} from 'lucide-react';

export function BerandaWarga({ onNavigateTab }) {
  const { currentUser, duesBills, letterRequests, announcements, events } = useApp();

  const targetResId = currentUser?.residentId || 'res-01';
  // Find latest unpaid or waiting dues bill for current resident
  const myBills = duesBills.filter(b => b.residentId === targetResId || b.residentId === 'res-01' || !b.residentId);
  const activeBill = myBills.find(b => b.status === 'Belum Dibayar' || b.status === 'Menunggu Verifikasi') || myBills[0];

  // Find latest letter request for current resident
  const myLetters = letterRequests.filter(r => r.residentId === targetResId || r.residentId === 'res-01' || !r.residentId);
  const activeLetter = myLetters[0];

  // Top announcements & upcoming events
  const latestAnnouncement = announcements.find(a => a.status === 'Dipublikasikan');

  return (
    <div className="space-y-6">
      {/* Salutation Hero */}
      <div className="rounded-2xl bg-gradient-to-r from-brand-700 via-brand-600 to-indigo-800 p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-medium text-brand-100 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brand-200" />
            <span>Portal Mandiri Warga RT 01 / RW 05</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Halo, {currentUser?.name || 'Warga'}!
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-brand-100 leading-relaxed">
            Selamat datang di RTConnect. Kelola pengajuan surat, cek tagihan iuran keluarga, dan pantau pengumuman lingkungan dengan mudah.
          </p>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Aksi Cepat Layanan
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigateTab('surat')}
            className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-500 hover:shadow-md transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Ajukan Surat</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Surat domisili, KTP, dll</p>
          </button>

          <button
            onClick={() => onNavigateTab('iuran')}
            className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-500 hover:shadow-md transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Iuran Lingkungan</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Konfirmasi bayar & riwayat</p>
          </button>

          <button
            onClick={() => onNavigateTab('aspirasi')}
            className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-500 hover:shadow-md transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <MessageSquareWarning className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Lapor Masalah</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Fasilitas / sampah got</p>
          </button>

          <button
            onClick={() => onNavigateTab('pengumuman')}
            className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-500 hover:shadow-md transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Agenda Warga</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Jadwal kerja bakti, dll</p>
          </button>
        </div>
      </div>

      {/* Two Column Active Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Active Dues Card */}
        <Card>
          <CardBody className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400 rounded-lg">
                  <CreditCard className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Tagihan Iuran Terkini</h3>
              </div>
              {activeBill && <Badge status={activeBill.status} />}
            </div>

            {activeBill ? (
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{activeBill.duesName}</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5 tabular-nums">
                    {formatRupiah(activeBill.amount)}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Jatuh tempo: <strong className="text-slate-700 dark:text-slate-300">{formatDate(activeBill.dueDate)}</strong>
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {activeBill.status === 'Lunas' ? 'Sudah terbayar' : 'Metode: Transfer Bank / Tunai'}
                  </span>
                  <Button
                    size="sm"
                    variant={activeBill.status === 'Belum Dibayar' ? 'primary' : 'outline'}
                    onClick={() => onNavigateTab('iuran')}
                  >
                    {activeBill.status === 'Belum Dibayar' ? 'Bayar Sekarang' : 'Lihat Detail'}
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-3">Tidak ada tagihan aktif saat ini.</p>
            )}
          </CardBody>
        </Card>

        {/* Active Letter Request Card */}
        <Card>
          <CardBody className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 rounded-lg">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Permohonan Surat Aktif</h3>
              </div>
              {activeLetter && <Badge status={activeLetter.status} />}
            </div>

            {activeLetter ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{activeLetter.letterName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{activeLetter.purpose}</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                    No. Ref: <span className="font-mono text-slate-600 dark:text-slate-400">{activeLetter.referenceNo}</span>
                  </p>
                </div>

                {activeLetter.notes && (
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Catatan Pengurus:</span> {activeLetter.notes}
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
                  <Button size="sm" variant="outline" onClick={() => onNavigateTab('surat')}>
                    Lihat Progres Surat
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">Belum ada pengajuan surat yang sedang berjalan.</p>
                <Button size="sm" variant="outline" className="mt-2" onClick={() => onNavigateTab('surat')}>
                  Ajukan Surat Baru
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Announcements & Upcoming Agenda Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Latest Announcement */}
        <Card className="lg:col-span-2">
          <CardBody className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Warta Lingkungan Terkini</h3>
              </div>
              <button
                onClick={() => onNavigateTab('pengumuman')}
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {latestAnnouncement ? (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge status="Baru" label={latestAnnouncement.priority} size="sm" />
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    {formatDate(latestAnnouncement.date)} • {latestAnnouncement.targetRegion}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {latestAnnouncement.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                  {latestAnnouncement.content}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 italic pt-1">
                  Diumumkan oleh: {latestAnnouncement.author}
                </p>
              </div>
            ) : null}
          </CardBody>
        </Card>

        {/* Emergency & Quick Contacts */}
        <Card>
          <CardBody className="p-5 space-y-4">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Kontak Pengurus RT 01</h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">Bpk. Joko Widodo M.</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Ketua RT 01</p>
                </div>
                <span className="font-mono text-xs font-semibold text-brand-700 dark:text-brand-400">0813-1122-3344</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">Ibu Siti Rahayu</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Sekretaris RT 01</p>
                </div>
                <span className="font-mono text-xs font-semibold text-brand-700 dark:text-brand-400">0812-4455-6677</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">Bpk. Agus Saputra</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Petugas Keamanan</p>
                </div>
                <span className="font-mono text-xs font-semibold text-brand-700 dark:text-brand-400">0815-3344-5566</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
