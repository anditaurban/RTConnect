import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatDate, formatDateTime } from '../../utils/formatters';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card, CardBody } from '../../components/common/Card';
import { Modal } from '../../components/common/Modal';
import { Select } from '../../components/common/Select';
import { EmptyState } from '../../components/common/EmptyState';
import {
  CreditCard,
  Building,
  CheckCircle2,
  Clock,
  AlertCircle,
  Upload,
  Receipt,
  Copy,
  Check,
} from 'lucide-react';

export function IuranWarga() {
  const { duesBills, regionSettings, payDuesBill, showToast } = useApp();

  const [selectedBillForPay, setSelectedBillForPay] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Transfer Bank BCA');
  const [proofImageName, setProofImageName] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('Semua'); // Semua, Belum Dibayar, Lunas

  const myBills = duesBills.filter(b => b.residentId === 'res-01');

  const filteredBills = activeTab === 'Semua'
    ? myBills
    : activeTab === 'Belum Dibayar'
    ? myBills.filter(b => b.status === 'Belum Dibayar' || b.status === 'Menunggu Verifikasi')
    : myBills.filter(b => b.status === 'Lunas');

  const totalUnpaid = myBills
    .filter(b => b.status === 'Belum Dibayar' || b.status === 'Terlambat')
    .reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

  const pendingVerificationCount = myBills.filter(b => b.status === 'Menunggu Verifikasi').length;

  const handleCopyAccount = () => {
    navigator.clipboard?.writeText(regionSettings.bankAccount.accountNumber);
    setCopied(true);
    showToast('info', 'Nomor rekening bank berhasil disalin.');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPayment = () => {
    if (!selectedBillForPay) return;
    payDuesBill(
      selectedBillForPay.id,
      paymentMethod,
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop&q=80'
    );
    setSelectedBillForPay(null);
    setProofImageName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Iuran & Tagihan Lingkungan
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Pantau kewajiban iuran bulanan keluarga, konfirmasi pembayaran transfer, dan riwayat transaksi.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-brand-100 dark:border-brand-900 bg-gradient-to-br from-white dark:from-slate-800 to-brand-50/40 dark:to-brand-950/20">
          <CardBody className="p-4 sm:p-5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Tagihan Tertunda
            </span>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1 tabular-nums">
              {formatRupiah(totalUnpaid)}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {totalUnpaid === 0 ? 'Semua tagihan lunas' : 'Segera lakukan konfirmasi'}
            </p>
          </CardBody>
        </Card>

        <Card className="border-amber-100 dark:border-amber-900 bg-gradient-to-br from-white dark:from-slate-800 to-amber-50/40 dark:to-amber-950/20">
          <CardBody className="p-4 sm:p-5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Menunggu Verifikasi
            </span>
            <p className="text-xl sm:text-2xl font-bold text-amber-700 dark:text-amber-400 mt-1 tabular-nums">
              {pendingVerificationCount} Tagihan
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Sedang dicek bendahara</p>
          </CardBody>
        </Card>

        <Card className="border-emerald-100 dark:border-emerald-900 bg-gradient-to-br from-white dark:from-slate-800 to-emerald-50/40 dark:to-emerald-950/20">
          <CardBody className="p-4 sm:p-5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Rekening Resmi Kas RT
            </span>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
              {regionSettings.bankAccount.bankName}
            </p>
            <div className="flex items-center justify-between mt-0.5">
              <span className="font-mono text-xs font-bold text-brand-700 dark:text-brand-400">
                {regionSettings.bankAccount.accountNumber}
              </span>
              <button
                onClick={handleCopyAccount}
                className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-1">
        {['Semua', 'Belum Dibayar', 'Lunas'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === tab
                ? 'bg-brand-600 text-white font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Bills List */}
      {filteredBills.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="Tidak Ada Tagihan"
          description="Tidak ada catatan tagihan iuran pada kategori ini."
        />
      ) : (
        <div className="space-y-3">
          {filteredBills.map((bill) => (
            <Card key={bill.id} hover>
              <CardBody className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                        {bill.duesName}
                      </h3>
                      <Badge status={bill.status} />
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Periode: <strong className="text-slate-700 dark:text-slate-300">{bill.period}</strong> • No. Tagihan:{' '}
                      <span className="font-mono text-slate-600 dark:text-slate-400">{bill.billNumber}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                      <span>
                        Nominal: <strong className="text-slate-900 dark:text-slate-100 font-bold tabular-nums text-sm">{formatRupiah(bill.amount)}</strong>
                      </span>
                      <span>Jatuh Tempo: {formatDate(bill.dueDate)}</span>
                    </div>

                    {bill.verificationNotes && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic mt-1">
                        Catatan: {bill.verificationNotes}
                      </p>
                    )}
                  </div>

                  {/* Action */}
                  <div className="shrink-0 flex items-center justify-end">
                    {bill.status === 'Belum Dibayar' || bill.status === 'Terlambat' ? (
                      <Button
                        variant="primary"
                        size="sm"
                        icon={Upload}
                        onClick={() => setSelectedBillForPay(bill)}
                      >
                        Konfirmasi Pembayaran
                      </Button>
                    ) : bill.status === 'Menunggu Verifikasi' ? (
                      <div className="text-right">
                        <span className="text-xs text-amber-700 dark:text-amber-400 font-medium block">
                          Menunggu Verifikasi
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">Bukti telah diunggah</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Lunas ({bill.paymentMethod})</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Modal: Form Konfirmasi Pembayaran */}
      <Modal
        isOpen={!!selectedBillForPay}
        onClose={() => setSelectedBillForPay(null)}
        title="Konfirmasi Pembayaran Iuran"
        description={`Kirim bukti transfer untuk tagihan ${selectedBillForPay?.duesName}`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setSelectedBillForPay(null)}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleConfirmPayment}>
              Kirim Bukti Pembayaran
            </Button>
          </>
        }
      >
        {selectedBillForPay && (
          <div className="space-y-4">
            {/* Amount & Bank Info Card */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Total Tagihan yang Harus Ditransfer:</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-slate-100 tabular-nums">
                  {formatRupiah(selectedBillForPay.amount)}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Rekening Tujuan Kas RT:</p>
                <div className="flex items-center justify-between mt-1 text-xs">
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{regionSettings.bankAccount.bankName}</p>
                    <p className="font-mono text-brand-700 dark:text-brand-400 font-bold">{regionSettings.bankAccount.accountNumber}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">an. {regionSettings.bankAccount.accountHolder}</p>
                  </div>
                  <button
                    onClick={handleCopyAccount}
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Rekening</span>
                  </button>
                </div>
              </div>
            </div>

            <Select
              label="Metode Pembayaran"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              options={[
                { value: 'Transfer Bank BCA', label: 'Transfer Bank BCA' },
                { value: 'Transfer Bank Mandiri / BNI / BRI', label: 'Transfer Bank Lain (Online/BI-FAST)' },
                { value: 'E-Wallet (GoPay / OVO / Dana)', label: 'E-Wallet (GoPay / OVO / DANA)' },
                { value: 'Tunai ke Bendahara', label: 'Tunai Langsung ke Bendahara' },
              ]}
              required
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Unggah Bukti Struk / Screenshot Transfer
              </label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center hover:border-brand-400 transition-colors bg-slate-50/50 dark:bg-slate-900/50">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {proofImageName ? proofImageName : 'Pilih screenshot bukti bayar'}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                  Format: JPG, PNG (Maks. 3 MB)
                </p>
                <input
                  type="file"
                  id="proof-upload"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setProofImageName(e.target.files[0].name);
                    }
                  }}
                />
                <label
                  htmlFor="proof-upload"
                  className="mt-2.5 inline-block text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 cursor-pointer"
                >
                  Pilih dari Galeri / Dokumen
                </label>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
