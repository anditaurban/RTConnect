import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatDate } from '../../utils/formatters';
import { Card, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Input, Textarea } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import {
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  FileSpreadsheet,
  Calendar,
  Receipt,
  FileCheck,
  TrendingUp,
  Edit2,
  Ban,
  ShieldAlert,
} from 'lucide-react';

export function KeuanganPengurus() {
  const {
    financeTransactions,
    financeSummary,
    addFinanceTransaction,
    updateFinanceTransaction,
    voidFinanceTransaction,
    currentUser,
  } = useApp();

  const canManage = ['bendahara', 'ketua_rt', 'ketua_rw'].includes(currentUser.role);

  const [filterType, setFilterType] = useState('all'); // all, in, out
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [voidingTx, setVoidingTx] = useState(null);
  const [voidReason, setVoidReason] = useState('');

  // Form states
  const [txType, setTxType] = useState('in');
  const [txCategory, setTxCategory] = useState('Iuran Warga');
  const [txAmount, setTxAmount] = useState('');
  const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);
  const [txDescription, setTxDescription] = useState('');
  const [txAuditNote, setTxAuditNote] = useState('');
  const [error, setError] = useState('');

  const filteredTransactions = filterType === 'all'
    ? financeTransactions
    : financeTransactions.filter(t => t.type === filterType);

  const handleOpenAdd = () => {
    setTxType('in');
    setTxCategory('Iuran Warga');
    setTxAmount('');
    setTxDate(new Date().toISOString().split('T')[0]);
    setTxDescription('');
    setTxAuditNote('');
    setError('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (tx) => {
    setEditingTx(tx);
    setTxType(tx.type);
    setTxCategory(tx.category);
    setTxAmount(String(tx.amount));
    setTxDate(tx.date);
    setTxDescription(tx.description);
    setTxAuditNote(tx.auditNote || '');
    setError('');
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    setError('');

    const parsedAmount = parseInt(txAmount, 10);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Nominal harus berupa angka lebih dari 0.');
      return;
    }

    if (!txDescription.trim()) {
      setError('Keterangan transaksi wajib diisi.');
      return;
    }

    addFinanceTransaction({
      date: txDate,
      type: txType,
      category: txCategory,
      amount: parsedAmount,
      description: txDescription.trim(),
      auditNote: txAuditNote.trim() || null,
      receiptUrl: null,
    });

    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingTx) return;

    const parsedAmount = parseInt(txAmount, 10);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Nominal harus berupa angka lebih dari 0.');
      return;
    }

    if (!txDescription.trim()) {
      setError('Keterangan transaksi wajib diisi.');
      return;
    }

    updateFinanceTransaction(editingTx.id, {
      date: txDate,
      type: txType,
      category: txCategory,
      amount: parsedAmount,
      description: txDescription.trim(),
      auditNote: txAuditNote.trim() || 'Koreksi pembukuan oleh bendahara',
    });

    setEditingTx(null);
  };

  const handleConfirmVoid = () => {
    if (!voidingTx) return;
    if (!voidReason.trim()) {
      setError('Alasan pembatalan (void) wajib diisi untuk jejak audit.');
      return;
    }

    voidFinanceTransaction(voidingTx.id, voidReason.trim());
    setVoidingTx(null);
    setVoidReason('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Keuangan & Buku Kas Lingkungan
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pencatatan kas masuk, kas keluar, saldo riil, serta jejak audit perbendaharaan RT 01.
          </p>
        </div>
        {canManage ? (
          <Button
            variant="primary"
            icon={Plus}
            onClick={handleOpenAdd}
          >
            Catat Transaksi Kas
          </Button>
        ) : (
          <div className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span>Mode Baca (Pengelolaan kas ditangani Bendahara & Ketua RT)</span>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-emerald-100 dark:border-emerald-900/60 bg-gradient-to-br from-white to-emerald-50/40 dark:from-slate-800 dark:to-emerald-950/20">
          <CardBody className="p-5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Saldo Kas RT
            </span>
            <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-300 mt-1 tabular-nums">
              {formatRupiah(financeSummary.balance)}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Saldo akumulatif saat ini</p>
          </CardBody>
        </Card>

        <Card className="border-blue-100 dark:border-blue-900/60 bg-gradient-to-br from-white to-blue-50/40 dark:from-slate-800 dark:to-blue-950/20">
          <CardBody className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Kas Masuk
              </span>
              <ArrowDownRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1 tabular-nums">
              {formatRupiah(financeSummary.totalIn)}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Iuran warga & sumbangan donasi</p>
          </CardBody>
        </Card>

        <Card className="border-rose-100 dark:border-rose-900/60 bg-gradient-to-br from-white to-rose-50/40 dark:from-slate-800 dark:to-rose-950/20">
          <CardBody className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Kas Keluar
              </span>
              <ArrowUpRight className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1 tabular-nums">
              {formatRupiah(financeSummary.totalOut)}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Operasional sampah, lampu & ronda</p>
          </CardBody>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            filterType === 'all'
              ? 'bg-brand-600 text-white font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Semua Transaksi ({financeTransactions.length})
        </button>
        <button
          onClick={() => setFilterType('in')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            filterType === 'in'
              ? 'bg-emerald-600 text-white font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Kas Masuk ({financeTransactions.filter(t => t.type === 'in').length})
        </button>
        <button
          onClick={() => setFilterType('out')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            filterType === 'out'
              ? 'bg-rose-600 text-white font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Kas Keluar ({financeTransactions.filter(t => t.type === 'out').length})
        </button>
      </div>

      {/* Table: Buku Kas */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Kategori & Keterangan</th>
                <th className="py-3 px-4">Pencatat</th>
                <th className="py-3 px-4">Jenis Kas</th>
                <th className="py-3 px-4 text-right">Nominal</th>
                {canManage && <th className="py-3 px-4 text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-slate-700 dark:text-slate-300">
              {filteredTransactions.map((tx) => {
                const isVoid = tx.category.startsWith('[BATAL/VOID]');
                return (
                  <tr key={tx.id} className={`hover:bg-slate-50/70 dark:hover:bg-slate-700/30 transition-colors ${isVoid ? 'opacity-50' : ''}`}>
                    <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-900 dark:text-slate-100">
                      {formatDate(tx.date)}
                    </td>
                    <td className="py-3.5 px-4 max-w-md">
                      <p className={`font-bold ${isVoid ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                        {tx.category}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{tx.description}</p>
                      {tx.auditNote && (
                        <p className="text-[10px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded mt-1 inline-block border border-amber-200 dark:border-amber-900/60">
                          Audit: {tx.auditNote}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                      {tx.recordedBy}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        tx.type === 'in'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                      }`}>
                        {tx.type === 'in' ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                        <span>{tx.type === 'in' ? 'Kas Masuk' : 'Kas Keluar'}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap font-bold text-sm tabular-nums">
                      <span className={tx.type === 'in' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'}>
                        {tx.type === 'in' ? '+' : '-'}{formatRupiah(tx.amount)}
                      </span>
                    </td>
                    {canManage && (
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {!isVoid && (
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              icon={Edit2}
                              onClick={() => handleOpenEdit(tx)}
                              title="Koreksi Transaksi"
                            >
                              Edit
                            </Button>
                            <button
                              type="button"
                              onClick={() => {
                                setVoidingTx(tx);
                                setVoidReason('');
                                setError('');
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
                              title="Batalkan (Void) Transaksi"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal: Catat Transaksi Baru */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Catat Transaksi Buku Kas"
        description="Pastikan nominal dan bukti transaksi tercatat dengan akurat untuk pertanggungjawaban kas warga."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleSaveAdd}>
              Simpan Transaksi
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveAdd} className="space-y-3">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Jenis Kas"
              value={txType}
              onChange={(e) => {
                setTxType(e.target.value);
                setTxCategory(e.target.value === 'in' ? 'Iuran Warga' : 'Kebersihan & Lingkungan');
              }}
              options={[
                { value: 'in', label: 'Kas Masuk (+)' },
                { value: 'out', label: 'Kas Keluar (-)' },
              ]}
              required
            />

            <Input
              label="Tanggal Transaksi"
              type="date"
              value={txDate}
              onChange={(e) => setTxDate(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Kategori Transaksi"
              value={txCategory}
              onChange={(e) => setTxCategory(e.target.value)}
              options={
                txType === 'in'
                  ? ['Iuran Warga', 'Sumbangan & Donasi', 'Saldo Awal', 'Pendapatan Lain-lain']
                  : [
                      'Kebersihan & Lingkungan',
                      'Pemeliharaan Fasilitas',
                      'Kesehatan & Fogging',
                      'Keamanan & Ronda',
                      'Kegiatan Warga & HUT RI',
                      'Sosial & Duka Cita',
                      'Operasional Sekretariat',
                    ]
              }
              required
            />

            <Input
              label="Nominal (Rupiah)"
              type="number"
              value={txAmount}
              onChange={(e) => setTxAmount(e.target.value)}
              placeholder="Contoh: 500000"
              required
            />
          </div>

          <Textarea
            label="Keterangan & Rincian Penggunaan Kas"
            value={txDescription}
            onChange={(e) => setTxDescription(e.target.value)}
            placeholder="Contoh: Pembelian lampu penerangan gang 3 toko Sinar Terang..."
            rows={2}
            required
          />

          <Input
            label="Catatan Audit / Nomor Nota (Opsional)"
            value={txAuditNote}
            onChange={(e) => setTxAuditNote(e.target.value)}
            placeholder="Contoh: Nota fisik tersimpan di buku kas bendahara No. #042"
          />
        </form>
      </Modal>

      {/* Modal: Edit Transaksi Kas */}
      <Modal
        isOpen={!!editingTx}
        onClose={() => setEditingTx(null)}
        title="Koreksi Transaksi Buku Kas"
        description="Pembaruan transaksi akan mencatat identitas pengubah pada jejak audit."
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditingTx(null)}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleSaveEdit}>
              Simpan Koreksi
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveEdit} className="space-y-3">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Jenis Kas"
              value={txType}
              onChange={(e) => setTxType(e.target.value)}
              options={[
                { value: 'in', label: 'Kas Masuk (+)' },
                { value: 'out', label: 'Kas Keluar (-)' },
              ]}
              required
            />

            <Input
              label="Tanggal Transaksi"
              type="date"
              value={txDate}
              onChange={(e) => setTxDate(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Kategori"
              value={txCategory}
              onChange={(e) => setTxCategory(e.target.value)}
              required
            />

            <Input
              label="Nominal (Rupiah)"
              type="number"
              value={txAmount}
              onChange={(e) => setTxAmount(e.target.value)}
              required
            />
          </div>

          <Textarea
            label="Keterangan Transaksi"
            value={txDescription}
            onChange={(e) => setTxDescription(e.target.value)}
            rows={2}
            required
          />

          <Input
            label="Alasan Koreksi Audit (Wajib)"
            value={txAuditNote}
            onChange={(e) => setTxAuditNote(e.target.value)}
            placeholder="Contoh: Koreksi penyesuaian nominal struk toko asli"
            required
          />
        </form>
      </Modal>

      {/* Confirmation Dialog: Void Transaksi */}
      <ConfirmDialog
        isOpen={!!voidingTx}
        onClose={() => setVoidingTx(null)}
        onConfirm={handleConfirmVoid}
        title="Batalkan (Void) Transaksi Kas"
        message={`Sesuai aturan akuntansi RT/RW, transaksi ini tidak dihapus permanen, melainkan dinolkan (void) dan dicatat pada audit log.`}
        confirmLabel="Ya, Batalkan Transaksi"
        variant="warning"
      >
        <div className="pt-2">
          <Input
            label="Alasan Pembatalan / Void Transaksi"
            value={voidReason}
            onChange={(e) => setVoidReason(e.target.value)}
            placeholder="Contoh: Kesalahan input ganda oleh bendahara"
            required
          />
        </div>
      </ConfirmDialog>
    </div>
  );
}
