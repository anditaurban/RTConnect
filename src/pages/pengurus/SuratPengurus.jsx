import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatDate, formatDateTime } from '../../utils/formatters';
import { Card, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Textarea, Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { SuratPrintDocument } from '../../components/print/SuratPrintDocument';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Printer,
  Eye,
  Filter,
  FileCheck,
  Trash2,
  Edit2,
  ShieldAlert,
} from 'lucide-react';

export function SuratPengurus() {
  const { letterRequests, letterTypes, reviewLetterRequest, deleteLetterRequest, currentUser } = useApp();

  const [filterStatus, setFilterStatus] = useState('Semua');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewAction, setReviewAction] = useState('Disetujui');
  const [reviewNotes, setReviewNotes] = useState('');
  const [customLetterNumber, setCustomLetterNumber] = useState('');
  const [printRequest, setPrintRequest] = useState(null);
  const [deletingRequest, setDeletingRequest] = useState(null);

  const canReview = ['ketua_rw', 'ketua_rt', 'sekretaris'].includes(currentUser.role);

  const filtered = filterStatus === 'Semua'
    ? letterRequests
    : letterRequests.filter(r => r.status === filterStatus);

  const handleOpenReview = (req) => {
    setSelectedRequest(req);
    setReviewAction(req.status === 'Diajukan' ? 'Disetujui' : req.status);
    setReviewNotes(req.notes || '');
    setCustomLetterNumber(req.letterNumber || '');
  };

  const handleSaveReview = () => {
    if (!selectedRequest) return;
    reviewLetterRequest(
      selectedRequest.id,
      reviewAction,
      reviewNotes.trim(),
      customLetterNumber.trim() || null
    );
    setSelectedRequest(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingRequest) return;
    deleteLetterRequest(deletingRequest.id);
    setDeletingRequest(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Administrasi & Antrean Surat Warga
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Verifikasi kelayakan berkas permohonan surat, penerbitan nomor surat resmi, dan cetak dokumen.
          </p>
        </div>
        {!canReview && (
          <div className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span>Mode Baca (Verifikasi dilakukan oleh Sekretaris / Ketua RT)</span>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1 overflow-x-auto">
        {['Semua', 'Diajukan', 'Diproses', 'Disetujui', 'Perlu Revisi', 'Ditolak', 'Selesai'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              filterStatus === status
                ? 'bg-brand-600 text-white font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {status} ({status === 'Semua' ? letterRequests.length : letterRequests.filter(r => r.status === status).length})
          </button>
        ))}
      </div>

      {/* Table / List */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Surat & Pemohon</th>
                <th className="py-3 px-4">Keperluan</th>
                <th className="py-3 px-4">No. Ref & Tanggal</th>
                <th className="py-3 px-4">No. Surat Resmi</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-slate-700 dark:text-slate-300">
              {filtered.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900 dark:text-slate-100">{req.letterName}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Pemohon: <strong className="text-slate-700 dark:text-slate-300">{req.residentName}</strong> ({req.rt})
                    </p>
                    <p className="text-[10px] font-mono text-slate-400">NIK: {req.nik}</p>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="line-clamp-2 text-slate-600 dark:text-slate-300">{req.purpose}</p>
                    {req.notes && (
                      <p className="text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded mt-1 line-clamp-1 border border-amber-100 dark:border-amber-900/60">
                        Catatan: {req.notes}
                      </p>
                    )}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <p className="font-mono font-medium text-slate-800 dark:text-slate-200">{req.referenceNo}</p>
                    <p className="text-[11px] text-slate-400">{formatDateTime(req.createdAt)}</p>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-brand-700 dark:text-brand-400 whitespace-nowrap">
                    {req.letterNumber || '-'}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Badge status={req.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      {canReview && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenReview(req)}
                        >
                          Verifikasi
                        </Button>
                      )}
                      {(req.status === 'Disetujui' || req.status === 'Selesai') && (
                        <Button
                          size="sm"
                          variant="teal"
                          icon={Printer}
                          onClick={() => setPrintRequest(req)}
                          title="Cetak Surat Resmi"
                        >
                          Cetak
                        </Button>
                      )}
                      {canReview && (
                        <button
                          type="button"
                          onClick={() => setDeletingRequest(req)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Hapus / Batalkan Berkas Surat"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Tidak ada pengajuan surat pada kategori ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal: Verifikasi & Aksi Surat */}
      <Modal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        title="Verifikasi Pengajuan Surat"
        description={`Pemohon: ${selectedRequest?.residentName} (${selectedRequest?.letterName})`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setSelectedRequest(null)}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleSaveReview}>
              Simpan Keputusan
            </Button>
          </>
        }
      >
        {selectedRequest && (
          <div className="space-y-4">
            {/* Request Summary */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
              <p><strong>Keperluan Warga:</strong> {selectedRequest.purpose}</p>
              <p><strong>Nomor Referensi:</strong> <span className="font-mono">{selectedRequest.referenceNo}</span></p>
              <div>
                <strong>Lampiran Pemohon:</strong>
                <ul className="list-disc pl-4 mt-1 text-slate-600 dark:text-slate-400">
                  {selectedRequest.attachments?.map((att, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <FileCheck className="w-3.5 h-3.5 text-brand-600" />
                      <span>{att.name} ({att.size})</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Decision Select */}
            <Select
              label="Tindakan Keputusan Status"
              value={reviewAction}
              onChange={(e) => setReviewAction(e.target.value)}
              options={[
                { value: 'Disetujui', label: 'Setujui & Terbitkan Nomor Surat Resmi' },
                { value: 'Diproses', label: 'Tandai Sedang Diproses' },
                { value: 'Perlu Revisi', label: 'Minta Revisi Berkas ke Warga' },
                { value: 'Ditolak', label: 'Tolak Permohonan Surat' },
                { value: 'Selesai', label: 'Tandai Selesai (Dokumen Telah Diterima Warga)' },
              ]}
              required
            />

            {reviewAction === 'Disetujui' && (
              <Input
                label="Nomor Surat Resmi (Otomatis / Kustom)"
                value={customLetterNumber}
                onChange={(e) => setCustomLetterNumber(e.target.value)}
                placeholder="470/018/RT.01-RW.05/VIII/2026 (Kosongkan untuk nomor otomatis)"
                helperText="Format baku: No/Urut/RT.RW/Bulan/Tahun"
              />
            )}

            <Textarea
              label="Catatan Verifikasi untuk Warga (Opsional / Wajib jika revisi)"
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Tuliskan catatan penjelasan, alasan penolakan, atau instruksi perbaikan berkas..."
              rows={3}
            />
          </div>
        )}
      </Modal>

      {/* Confirmation Dialog: Hapus Surat */}
      <ConfirmDialog
        isOpen={!!deletingRequest}
        onClose={() => setDeletingRequest(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus / Batalkan Berkas Surat"
        message={`Apakah Anda yakin ingin menghapus permohonan surat ${deletingRequest?.letterName} an. ${deletingRequest?.residentName} (Ref: ${deletingRequest?.referenceNo})?`}
        confirmLabel="Ya, Hapus Berkas"
      />

      {/* Official Printable Sheet */}
      {printRequest && (
        <SuratPrintDocument
          letterRequest={printRequest}
          onClose={() => setPrintRequest(null)}
        />
      )}
    </div>
  );
}
