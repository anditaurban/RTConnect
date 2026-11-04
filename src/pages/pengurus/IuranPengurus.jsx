import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatDate, formatDateTime } from '../../utils/formatters';
import { Card, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Input, Textarea } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  ExternalLink,
  Layers,
  FileCheck,
  Plus,
  Edit2,
  Trash2,
  ShieldAlert,
} from 'lucide-react';

export function IuranPengurus() {
  const {
    duesBills,
    duesTypes,
    residents,
    verifyDuesBill,
    addDuesBill,
    updateDuesBill,
    deleteDuesBill,
    addDuesType,
    updateDuesType,
    deleteDuesType,
    currentUser,
  } = useApp();

  const canManage = ['bendahara', 'ketua_rt', 'ketua_rw'].includes(currentUser.role);

  const [activeTab, setActiveTab] = useState('verifikasi'); // verifikasi, tagihan, tarif
  const [selectedBillForVerify, setSelectedBillForVerify] = useState(null);
  const [verifyNotes, setVerifyNotes] = useState('');

  // Modals for Bill CRUD
  const [isAddBillOpen, setIsAddBillOpen] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [deletingBill, setDeletingBill] = useState(null);

  // Form states for Bill
  const [billResidentId, setBillResidentId] = useState(residents[0]?.id || '');
  const [billDuesName, setBillDuesName] = useState('Iuran Lingkungan Terpadu');
  const [billPeriod, setBillPeriod] = useState('September 2026');
  const [billAmount, setBillAmount] = useState('100000');
  const [billDueDate, setBillDueDate] = useState('2026-09-15');
  const [billStatus, setBillStatus] = useState('Belum Dibayar');
  const [billError, setBillError] = useState('');

  // Modals for DuesType CRUD
  const [isAddTypeOpen, setIsAddTypeOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [deletingType, setDeletingType] = useState(null);

  // Form states for DuesType
  const [typeCode, setTypeCode] = useState('');
  const [typeName, setTypeName] = useState('');
  const [typeAmount, setTypeAmount] = useState('');
  const [typeBillingType, setTypeBillingType] = useState('per_kk');
  const [typePeriod, setTypePeriod] = useState('Bulanan');
  const [typeDesc, setTypeDesc] = useState('');
  const [typeError, setTypeError] = useState('');

  const pendingBills = duesBills.filter(b => b.status === 'Menunggu Verifikasi');

  const handleApprove = () => {
    if (!selectedBillForVerify) return;
    verifyDuesBill(selectedBillForVerify.id, true, verifyNotes.trim() || 'Pembayaran diverifikasi sah oleh bendahara.');
    setSelectedBillForVerify(null);
  };

  const handleReject = () => {
    if (!selectedBillForVerify) return;
    verifyDuesBill(selectedBillForVerify.id, false, verifyNotes.trim() || 'Bukti transfer tidak valid atau nominal tidak sesuai.');
    setSelectedBillForVerify(null);
  };

  // Bill CRUD handlers
  const handleOpenAddBill = () => {
    setBillDuesName('Iuran Lingkungan Terpadu');
    setBillPeriod('September 2026');
    setBillAmount('100000');
    setBillDueDate('2026-09-15');
    setBillError('');
    setIsAddBillOpen(true);
  };

  const handleSaveAddBill = (e) => {
    e.preventDefault();
    const res = residents.find(r => r.id === billResidentId) || residents[0];
    const parsedAmount = parseInt(billAmount, 10);
    if (!parsedAmount || parsedAmount <= 0) {
      setBillError('Nominal tagihan harus berupa angka lebih dari 0.');
      return;
    }

    addDuesBill({
      billNumber: `TAG-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`,
      duesTypeId: 'dt-01',
      duesName: billDuesName,
      period: billPeriod,
      amount: parsedAmount,
      dueDate: billDueDate,
      residentId: res.id,
      residentName: res.name,
      noKK: res.noKK,
      rt: res.rt,
      rw: 'RW 05',
    });
    setIsAddBillOpen(false);
  };

  const handleOpenEditBill = (b) => {
    setEditingBill(b);
    setBillDuesName(b.duesName);
    setBillPeriod(b.period);
    setBillAmount(String(b.amount));
    setBillDueDate(b.dueDate);
    setBillStatus(b.status);
    setBillError('');
  };

  const handleSaveEditBill = (e) => {
    e.preventDefault();
    if (!editingBill) return;
    updateDuesBill(editingBill.id, {
      duesName: billDuesName,
      period: billPeriod,
      amount: parseInt(billAmount, 10) || editingBill.amount,
      dueDate: billDueDate,
      status: billStatus,
    });
    setEditingBill(null);
  };

  const handleConfirmDeleteBill = () => {
    if (!deletingBill) return;
    deleteDuesBill(deletingBill.id);
    setDeletingBill(null);
  };

  // DuesType CRUD handlers
  const handleOpenAddType = () => {
    setTypeCode('');
    setTypeName('');
    setTypeAmount('');
    setTypeDesc('');
    setTypeError('');
    setIsAddTypeOpen(true);
  };

  const handleSaveAddType = (e) => {
    e.preventDefault();
    if (!typeCode.trim() || !typeName.trim() || !typeAmount) {
      setTypeError('Mohon lengkapi kode, nama iuran, dan nominal.');
      return;
    }

    addDuesType({
      code: typeCode.trim().toUpperCase(),
      name: typeName.trim(),
      amount: parseInt(typeAmount, 10) || 0,
      billingType: typeBillingType,
      billingPeriod: typePeriod,
      description: typeDesc.trim(),
    });
    setIsAddTypeOpen(false);
  };

  const handleOpenEditType = (dt) => {
    setEditingType(dt);
    setTypeCode(dt.code);
    setTypeName(dt.name);
    setTypeAmount(String(dt.amount));
    setTypeBillingType(dt.billingType);
    setTypePeriod(dt.billingPeriod);
    setTypeDesc(dt.description || '');
    setTypeError('');
  };

  const handleSaveEditType = (e) => {
    e.preventDefault();
    if (!editingType) return;
    updateDuesType(editingType.id, {
      code: typeCode.trim().toUpperCase(),
      name: typeName.trim(),
      amount: parseInt(typeAmount, 10) || editingType.amount,
      billingType: typeBillingType,
      billingPeriod: typePeriod,
      description: typeDesc.trim(),
    });
    setEditingType(null);
  };

  const handleConfirmDeleteType = () => {
    if (!deletingType) return;
    deleteDuesType(deletingType.id);
    setDeletingType(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Iuran Warga & Verifikasi Pembayaran
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Validasi mutasi transfer warga, rekapitulasi status pembayaran per KK, dan konfigurasi tarif iuran.
          </p>
        </div>
        {canManage && (
          <div className="flex items-center gap-2">
            {activeTab === 'tagihan' && (
              <Button variant="primary" icon={Plus} onClick={handleOpenAddBill}>
                Tambah Tagihan
              </Button>
            )}
            {activeTab === 'tarif' && (
              <Button variant="primary" icon={Plus} onClick={handleOpenAddType}>
                Tambah Tarif Iuran
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1">
        <button
          onClick={() => setActiveTab('verifikasi')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'verifikasi'
              ? 'bg-brand-600 text-white font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Verifikasi Pembayaran ({pendingBills.length})
        </button>
        <button
          onClick={() => setActiveTab('tagihan')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'tagihan'
              ? 'bg-brand-600 text-white font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Semua Tagihan Warga ({duesBills.length})
        </button>
        <button
          onClick={() => setActiveTab('tarif')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'tarif'
              ? 'bg-brand-600 text-white font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Tarif Iuran Lingkungan ({duesTypes.length})
        </button>
      </div>

      {/* Tab 1: Verifikasi Pembayaran Masuk */}
      {activeTab === 'verifikasi' && (
        <div className="space-y-4">
          {pendingBills.length === 0 ? (
            <Card>
              <CardBody className="py-12 text-center text-xs text-slate-500 dark:text-slate-400">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">Semua Pembayaran Telah Terverifikasi</p>
                <p className="mt-1 text-slate-400">Tidak ada bukti transfer yang sedang menunggu pengecekan bendahara.</p>
              </CardBody>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingBills.map((bill) => (
                <Card key={bill.id} hover className="border-amber-200/80 dark:border-amber-900/60">
                  <CardBody className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{bill.duesName}</span>
                      <Badge status={bill.status} size="sm" />
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1 text-slate-700 dark:text-slate-300">
                      <p>Warga: <strong className="text-slate-900 dark:text-slate-100">{bill.residentName}</strong> ({bill.rt})</p>
                      <p>Nomor Tagihan: <span className="font-mono">{bill.billNumber}</span></p>
                      <p>Nominal Tagihan: <strong className="text-slate-900 dark:text-slate-100 font-bold tabular-nums">{formatRupiah(bill.amount)}</strong></p>
                      <p>Metode Bayar: <span className="text-brand-700 dark:text-brand-400 font-semibold">{bill.paymentMethod}</span></p>
                      <p className="text-[11px] text-slate-400">Dibayar: {formatDateTime(bill.paymentDate)}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Bukti struk terlampir</span>
                      {canManage ? (
                        <Button
                          size="sm"
                          variant="primary"
                          icon={Eye}
                          onClick={() => {
                            setSelectedBillForVerify(bill);
                            setVerifyNotes('');
                          }}
                        >
                          Periksa Bukti & Validasi
                        </Button>
                      ) : (
                        <span className="text-xs text-amber-600 font-medium">Perlu verifikasi Bendahara</span>
                      )}
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Tabel Semua Tagihan */}
      {activeTab === 'tagihan' && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">No. Tagihan</th>
                  <th className="py-3 px-4">Nama Warga & Wilayah</th>
                  <th className="py-3 px-4">Nama Iuran / Periode</th>
                  <th className="py-3 px-4">Jatuh Tempo</th>
                  <th className="py-3 px-4">Nominal</th>
                  <th className="py-3 px-4">Status</th>
                  {canManage && <th className="py-3 px-4 text-right">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-slate-700 dark:text-slate-300">
                {duesBills.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-800 dark:text-slate-200">{b.billNumber}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{b.residentName}</div>
                      <div className="text-[11px] text-slate-400">{b.rt} / {b.rw}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div>{b.duesName}</div>
                      <div className="text-[11px] text-slate-400">Periode: {b.period}</div>
                    </td>
                    <td className="py-3.5 px-4">{formatDate(b.dueDate)}</td>
                    <td className="py-3.5 px-4 font-bold tabular-nums text-slate-900 dark:text-slate-100">
                      {formatRupiah(b.amount)}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge status={b.status} />
                    </td>
                    {canManage && (
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            icon={Edit2}
                            onClick={() => handleOpenEditBill(b)}
                            title="Edit Tagihan"
                          >
                            Edit
                          </Button>
                          <button
                            type="button"
                            onClick={() => setDeletingBill(b)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Hapus Tagihan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Tab 3: Jenis & Tarif Iuran */}
      {activeTab === 'tarif' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {duesTypes.map((dt) => (
            <Card key={dt.id}>
              <CardBody className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded border border-brand-100 dark:border-brand-900">
                    {dt.code}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full">
                      Aktif
                    </span>
                    {canManage && (
                      <div className="flex items-center gap-1 pl-2 border-l border-slate-200 dark:border-slate-700">
                        <button
                          type="button"
                          onClick={() => handleOpenEditType(dt)}
                          className="p-1 rounded-md text-slate-400 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                          title="Edit Tarif"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingType(dt)}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          title="Hapus Tarif"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{dt.name}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">{dt.description}</p>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Penagihan: <strong>{dt.billingType === 'per_kk' ? 'Per KK (Rumah)' : 'Per Jiwa (Warga)'}</strong>
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm tabular-nums">
                    {formatRupiah(dt.amount)} / {dt.billingPeriod}
                  </span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Modal: Review Bukti Bayar */}
      <Modal
        isOpen={!!selectedBillForVerify}
        onClose={() => setSelectedBillForVerify(null)}
        title="Verifikasi Bukti Pembayaran Warga"
        description={`Warga: ${selectedBillForVerify?.residentName} (${selectedBillForVerify?.duesName})`}
        footer={
          <div className="flex items-center justify-between w-full">
            <Button variant="danger" icon={XCircle} onClick={handleReject}>
              Tolak Bukti Bayar
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => setSelectedBillForVerify(null)}>
                Batal
              </Button>
              <Button variant="teal" icon={CheckCircle2} onClick={handleApprove}>
                Setujui & Bukukan ke Kas
              </Button>
            </div>
          </div>
        }
      >
        {selectedBillForVerify && (
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
              <div>
                <span className="text-slate-400">Total Nominal:</span>
                <p className="font-bold text-slate-900 dark:text-slate-100 text-sm tabular-nums">
                  {formatRupiah(selectedBillForVerify.amount)}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Metode Pengiriman:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedBillForVerify.paymentMethod}</p>
              </div>
            </div>

            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Foto Struk / Tangkapan Layar Transfer:</p>
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900/5 max-h-64 flex items-center justify-center">
                <img
                  src={selectedBillForVerify.paymentProofUrl}
                  alt="Bukti Transfer Warga"
                  className="max-h-64 object-contain"
                />
              </div>
            </div>

            <Textarea
              label="Catatan Verifikasi (Alasan jika menolak / konfirmasi jika sah)"
              value={verifyNotes}
              onChange={(e) => setVerifyNotes(e.target.value)}
              placeholder="Contoh: Mutasi rekening BCA telah cocok dan dana masuk ke rekening RT."
              rows={2}
            />
          </div>
        )}
      </Modal>

      {/* Modal: Tambah Tagihan Baru */}
      <Modal
        isOpen={isAddBillOpen}
        onClose={() => setIsAddBillOpen(false)}
        title="Buat Tagihan Iuran Warga"
        description="Terbitkan tagihan baru untuk kepala keluarga atau warga tertentu."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsAddBillOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleSaveAddBill}>
              Terbitkan Tagihan
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveAddBill} className="space-y-3">
          {billError && (
            <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 text-xs font-medium">
              {billError}
            </div>
          )}

          <Select
            label="Pilih Warga / Kepala Keluarga"
            value={billResidentId}
            onChange={(e) => setBillResidentId(e.target.value)}
            options={residents.map(r => ({ value: r.id, label: `${r.name} (${r.rt} - KK: ${r.noKK})` }))}
            required
          />

          <Input
            label="Nama Iuran"
            value={billDuesName}
            onChange={(e) => setBillDuesName(e.target.value)}
            placeholder="Contoh: Iuran Kebersihan & Keamanan"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Periode Tagihan"
              value={billPeriod}
              onChange={(e) => setBillPeriod(e.target.value)}
              placeholder="Contoh: September 2026"
              required
            />
            <Input
              label="Nominal (Rupiah)"
              type="number"
              value={billAmount}
              onChange={(e) => setBillAmount(e.target.value)}
              required
            />
          </div>

          <Input
            label="Tanggal Jatuh Tempo"
            type="date"
            value={billDueDate}
            onChange={(e) => setBillDueDate(e.target.value)}
            required
          />
        </form>
      </Modal>

      {/* Modal: Edit Tagihan */}
      <Modal
        isOpen={!!editingBill}
        onClose={() => setEditingBill(null)}
        title="Ubah Tagihan Iuran"
        description={`No. Tagihan: ${editingBill?.billNumber}`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditingBill(null)}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleSaveEditBill}>
              Simpan Perubahan
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveEditBill} className="space-y-3">
          <Input
            label="Nama Iuran"
            value={billDuesName}
            onChange={(e) => setBillDuesName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Periode"
              value={billPeriod}
              onChange={(e) => setBillPeriod(e.target.value)}
              required
            />
            <Input
              label="Nominal (Rupiah)"
              type="number"
              value={billAmount}
              onChange={(e) => setBillAmount(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Jatuh Tempo"
              type="date"
              value={billDueDate}
              onChange={(e) => setBillDueDate(e.target.value)}
              required
            />
            <Select
              label="Status Tagihan"
              value={billStatus}
              onChange={(e) => setBillStatus(e.target.value)}
              options={['Belum Dibayar', 'Menunggu Verifikasi', 'Lunas', 'Terlambat', 'Dibatalkan']}
              required
            />
          </div>
        </form>
      </Modal>

      {/* Modal: Tambah Tarif Iuran */}
      <Modal
        isOpen={isAddTypeOpen}
        onClose={() => setIsAddTypeOpen(false)}
        title="Tambah Jenis & Tarif Iuran Baru"
        description="Atur jenis retribusi iuran lingkungan RT/RW."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsAddTypeOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleSaveAddType}>
              Simpan Jenis Iuran
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveAddType} className="space-y-3">
          {typeError && (
            <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 text-xs font-medium">
              {typeError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Kode Iuran"
              value={typeCode}
              onChange={(e) => setTypeCode(e.target.value)}
              placeholder="IUR-POS"
              required
            />
            <Input
              label="Besaran Tarif (Rp)"
              type="number"
              value={typeAmount}
              onChange={(e) => setTypeAmount(e.target.value)}
              placeholder="35000"
              required
            />
          </div>

          <Input
            label="Nama Jenis Iuran"
            value={typeName}
            onChange={(e) => setTypeName(e.target.value)}
            placeholder="Contoh: Iuran Pemeliharaan Pos Ronda"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Dasar Penagihan"
              value={typeBillingType}
              onChange={(e) => setTypeBillingType(e.target.value)}
              options={[
                { value: 'per_kk', label: 'Per Kartu Keluarga (Rumah)' },
                { value: 'per_resident', label: 'Per Jiwa (Warga)' },
              ]}
              required
            />
            <Select
              label="Periode Penagihan"
              value={typePeriod}
              onChange={(e) => setTypePeriod(e.target.value)}
              options={['Bulanan', 'Sekali', 'Tahunan']}
              required
            />
          </div>

          <Textarea
            label="Deskripsi & Peruntukan"
            value={typeDesc}
            onChange={(e) => setTypeDesc(e.target.value)}
            placeholder="Penjelasan peruntukan dana iuran..."
            rows={2}
          />
        </form>
      </Modal>

      {/* Modal: Edit Tarif Iuran */}
      <Modal
        isOpen={!!editingType}
        onClose={() => setEditingType(null)}
        title="Ubah Tarif Jenis Iuran"
        description={`Kode: ${editingType?.code}`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditingType(null)}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleSaveEditType}>
              Simpan Perubahan
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveEditType} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Kode Iuran"
              value={typeCode}
              onChange={(e) => setTypeCode(e.target.value)}
              required
            />
            <Input
              label="Besaran Tarif (Rp)"
              type="number"
              value={typeAmount}
              onChange={(e) => setTypeAmount(e.target.value)}
              required
            />
          </div>

          <Input
            label="Nama Jenis Iuran"
            value={typeName}
            onChange={(e) => setTypeName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Dasar Penagihan"
              value={typeBillingType}
              onChange={(e) => setTypeBillingType(e.target.value)}
              options={[
                { value: 'per_kk', label: 'Per Kartu Keluarga (Rumah)' },
                { value: 'per_resident', label: 'Per Jiwa (Warga)' },
              ]}
              required
            />
            <Select
              label="Periode"
              value={typePeriod}
              onChange={(e) => setTypePeriod(e.target.value)}
              options={['Bulanan', 'Sekali', 'Tahunan']}
              required
            />
          </div>

          <Textarea
            label="Deskripsi"
            value={typeDesc}
            onChange={(e) => setTypeDesc(e.target.value)}
            rows={2}
          />
        </form>
      </Modal>

      {/* Confirm: Delete Bill */}
      <ConfirmDialog
        isOpen={!!deletingBill}
        onClose={() => setDeletingBill(null)}
        onConfirm={handleConfirmDeleteBill}
        title="Hapus Tagihan Iuran"
        message={`Apakah Anda yakin ingin menghapus tagihan ${deletingBill?.duesName} an. ${deletingBill?.residentName} (${deletingBill?.billNumber})?`}
        confirmLabel="Ya, Hapus Tagihan"
      />

      {/* Confirm: Delete Type */}
      <ConfirmDialog
        isOpen={!!deletingType}
        onClose={() => setDeletingType(null)}
        onConfirm={handleConfirmDeleteType}
        title="Hapus Jenis Iuran"
        message={`Apakah Anda yakin ingin menghapus jenis tarif iuran ${deletingType?.name} (${deletingType?.code})?`}
        confirmLabel="Ya, Hapus Jenis Iuran"
      />
    </div>
  );
}
