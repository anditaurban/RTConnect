import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatDate, formatDateTime } from '../../utils/formatters';
import { Card, CardBody, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import {
  Users,
  FileText,
  Wallet,
  CreditCard,
  MessageSquareWarning,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Filter,
} from 'lucide-react';

export function DashboardPengurus({ onNavigateTab }) {
  const {
    currentUser,
    residents,
    families,
    letterRequests,
    financeSummary,
    financeTransactions,
    duesBills,
    complaints,
    events,
  } = useApp();

  const [selectedRTFilter, setSelectedRTFilter] = useState('Semua');

  // Filter pending items that need action
  const pendingLetters = letterRequests.filter(r => r.status === 'Diajukan');
  const pendingDues = duesBills.filter(b => b.status === 'Menunggu Verifikasi');
  const activeComplaints = complaints.filter(c => c.status === 'Baru' || c.status === 'Ditinjau');

  const isRW = currentUser.role === 'ketua_rw';

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/50 px-2 py-0.5 rounded border border-brand-100 dark:border-brand-800">
              Dashboard {currentUser.roleLabel}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">Wilayah: {currentUser.region}</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Ringkasan Operasional Administrasi Lingkungan
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isRW
              ? 'Memantau agregat seluruh rukun tetangga di bawah RW 05 Melati Asri.'
              : 'Pusat pengelolaan layanan warga, verifikasi pengajuan, dan keuangan RT 01.'}
          </p>
        </div>

        {/* RT Scope Filter (active for Ketua RW) */}
        {isRW && (
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Filter RT:</span>
            <select
              value={selectedRTFilter}
              onChange={(e) => setSelectedRTFilter(e.target.value)}
              className="text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-2.5 py-1 font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="Semua">Semua RT (RW 05)</option>
              <option value="RT 01">RT 01</option>
              <option value="RT 02">RT 02</option>
              <option value="RT 03">RT 03</option>
              <option value="RT 04">RT 04</option>
              <option value="RT 05">RT 05</option>
            </select>
          </div>
        )}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Warga & KK */}
        <Card hover onClick={() => onNavigateTab('warga-kk')} className="cursor-pointer">
          <CardBody className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Warga Aktif
              </span>
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2 tabular-nums">
              {isRW ? '875' : residents.length * 22} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">Jiwa</span>
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Terdaftar dalam <strong className="text-slate-700 dark:text-slate-300">{isRW ? '240' : families.length * 12} KK</strong>
            </p>
          </CardBody>
        </Card>

        {/* KPI 2: Saldo Kas */}
        <Card hover onClick={() => onNavigateTab('keuangan')} className="cursor-pointer">
          <CardBody className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Saldo Kas Lingkungan
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2 tabular-nums">
              {formatRupiah(financeSummary.balance)}
            </p>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
              <TrendingUp className="w-3 h-3" />
              <span>Kas Masuk Bln ini: {formatRupiah(financeSummary.totalIn)}</span>
            </div>
          </CardBody>
        </Card>

        {/* KPI 3: Surat Tertunda */}
        <Card hover onClick={() => onNavigateTab('surat')} className="cursor-pointer">
          <CardBody className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Surat Perlu Verifikasi
              </span>
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2 tabular-nums">
              {pendingLetters.length} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">Berkas</span>
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {pendingLetters.length > 0 ? 'Menunggu review sekretaris' : 'Semua surat diproses'}
            </p>
          </CardBody>
        </Card>

        {/* KPI 4: Verifikasi Iuran */}
        <Card hover onClick={() => onNavigateTab('iuran')} className="cursor-pointer">
          <CardBody className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Iuran Menunggu Konfirmasi
              </span>
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2 tabular-nums">
              {pendingDues.length} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">Pembayaran</span>
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Perlu dicek mutasi bank
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Two Column Section: Action Queue & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Antrean Tindakan Mendesak */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Antrean Tugas & Tindakan Segera</span>
            </h2>
            <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full font-medium">
              {pendingLetters.length + pendingDues.length + activeComplaints.length} Item
            </span>
          </div>

          <div className="space-y-3">
            {/* Pending Letters */}
            {pendingLetters.map((req) => (
              <div
                key={req.id}
                onClick={() => onNavigateTab('surat')}
                className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-600 hover:shadow-sm transition-all cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{req.letterName}</span>
                      <Badge status={req.status} size="sm" />
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      Pemohon: <strong className="text-slate-800 dark:text-slate-200">{req.residentName}</strong> ({req.rt})
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">Keperluan: {req.purpose}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Periksa
                </Button>
              </div>
            ))}

            {/* Pending Payments */}
            {pendingDues.map((bill) => (
              <div
                key={bill.id}
                onClick={() => onNavigateTab('iuran')}
                className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-600 hover:shadow-sm transition-all cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 mt-0.5">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{bill.duesName}</span>
                      <Badge status={bill.status} size="sm" />
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      Warga: <strong className="text-slate-800 dark:text-slate-200">{bill.residentName}</strong> • {formatRupiah(bill.amount)}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">Metode: {bill.paymentMethod}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Verifikasi
                </Button>
              </div>
            ))}

            {/* Active Complaints */}
            {activeComplaints.map((cmp) => (
              <div
                key={cmp.id}
                onClick={() => onNavigateTab('aspirasi')}
                className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-600 hover:shadow-sm transition-all cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 mt-0.5">
                    <MessageSquareWarning className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{cmp.title}</span>
                      <Badge status={cmp.status} size="sm" />
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      Lokasi: <strong className="text-slate-800 dark:text-slate-200">{cmp.location}</strong> • Pelapor: {cmp.reporterName}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Tindak Lanjuti
                </Button>
              </div>
            ))}

            {pendingLetters.length === 0 && pendingDues.length === 0 && activeComplaints.length === 0 && (
              <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                Seluruh tugas tertunda telah selesai diproses.
              </div>
            )}
          </div>
        </div>

        {/* Right (1 col): Ringkasan Keuangan Kas & Agenda */}
        <div className="space-y-4">
          <Card>
            <CardHeader
              title="Aktivitas Kas Terbaru"
              action={
                <button
                  onClick={() => onNavigateTab('keuangan')}
                  className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  Buku Kas
                </button>
              }
            />
            <CardBody className="p-4 space-y-3">
              {financeTransactions.slice(0, 4).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg ${tx.type === 'in' ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'}`}>
                      {tx.type === 'in' ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[140px]">{tx.category}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">{formatDate(tx.date)}</p>
                    </div>
                  </div>
                  <span className={`font-bold tabular-nums ${tx.type === 'in' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'}`}>
                    {tx.type === 'in' ? '+' : '-'}{formatRupiah(tx.amount)}
                  </span>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Agenda Terdekat"
              action={
                <button
                  onClick={() => onNavigateTab('agenda')}
                  className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  Semua
                </button>
              }
            />
            <CardBody className="p-4 space-y-2.5">
              {events.slice(0, 2).map((evt) => (
                <div key={evt.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{evt.title}</span>
                    <Badge status={evt.status} size="sm" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {formatDate(evt.date)}, {evt.time}
                  </p>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
