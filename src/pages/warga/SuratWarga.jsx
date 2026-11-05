import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatDate, formatDateTime } from '../../utils/formatters';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card, CardBody } from '../../components/common/Card';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Input, Textarea } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { EmptyState } from '../../components/common/EmptyState';
import { SuratPrintDocument } from '../../components/print/SuratPrintDocument';
import {
  FileText,
  Plus,
  Clock,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Upload,
  FileCheck,
  ChevronRight,
  Info,
  Edit2,
  Trash2,
} from 'lucide-react';

export function SuratWarga() {
  const { currentUser, letterRequests, letterTypes, addLetterRequest, updateLetterRequest, deleteLetterRequest } = useApp();

  const [filterStatus, setFilterStatus] = useState('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [deletingRequest, setDeletingRequest] = useState(null);

  // Form states
  const [selectedType, setSelectedType] = useState(letterTypes[0]?.id || '');
  const [purpose, setPurpose] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [error, setError] = useState('');
  const [selectedPrintRequest, setSelectedPrintRequest] = useState(null);
  const [selectedDetailRequest, setSelectedDetailRequest] = useState(null);

  // Filter requests for current citizen
  const targetResId = currentUser?.residentId || 'res-01';
  const myRequests = letterRequests.filter(r => r.residentId === targetResId || r.residentId === 'res-01' || !r.residentId);
  const filteredRequests = filterStatus === 'Semua'
    ? myRequests
    : myRequests.filter(r => r.status === filterStatus);

  const currentTypeConfig = letterTypes.find(t => t.id === selectedType);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!purpose.trim()) {
      setError('Mohon isi keperluan pengajuan surat secara jelas.');
      return;
    }

    if (editingRequest) {
      updateLetterRequest(editingRequest.id, {
        purpose: purpose.trim(),
        attachments: attachmentName
          ? [{ name: attachmentName, size: '1.4 MB' }]
          : editingRequest.attachments,
        status: editingRequest.status === 'Perlu Revisi' ? 'Diajukan' : editingRequest.status,
      });
      setEditingRequest(null);
    } else {
      addLetterRequest({
        letterTypeId: selectedType,
        purpose: purpose.trim(),
        attachments: attachmentName
          ? [{ name: attachmentName, size: '1.4 MB' }]
          : [{ name: 'Dokumen_Persyaratan_Warga.pdf', size: '1.2 MB' }],
      });
      setIsModalOpen(false);
    }

    setPurpose('');
    setAttachmentName('');
  };

  const handleOpenEdit = (req) => {
    setEditingRequest(req);
    setSelectedType(req.letterTypeId);
    setPurpose(req.purpose);
    setAttachmentName(req.attachments?.[0]?.name || '');
    setError('');
  };

  const handleConfirmDelete = () => {
    if (!deletingRequest) return;
    deleteLetterRequest(deletingRequest.id);
    setDeletingRequest(null);
  };

  return (
    <div className="space-y-6">
      {/* Header & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Layanan & Administrasi Surat
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Ajukan surat pengantar resmi RT/RW dan pantau proses verifikasi tanpa perlu antre di kantor.
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => {
            setEditingRequest(null);
            setPurpose('');
            setAttachmentName('');
            setIsModalOpen(true);
          }}
          className="shrink-0"
        >
          Ajukan Surat Baru
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        {['Semua', 'Diajukan', 'Perlu Revisi', 'Diproses', 'Disetujui', 'Selesai'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              filterStatus === status
                ? 'bg-brand-600 text-white font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Letters List */}
      {filteredRequests.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Tidak Ada Pengajuan Surat"
          description="Anda belum memiliki pengajuan surat pada kategori status ini."
          actionLabel="Ajukan Surat Sekarang"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="space-y-3">
          {filteredRequests.map((req) => (
            <Card key={req.id} hover className="overflow-hidden">
              <CardBody className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                        {req.letterName}
                      </h3>
                      <Badge status={req.status} />
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">Keperluan:</span> {req.purpose}
                    </p>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-[11px] text-slate-400">
                      <span>No. Ref: <strong className="font-mono text-slate-600 dark:text-slate-300">{req.referenceNo}</strong></span>
                      {req.letterNumber && (
                        <span>No. Surat: <strong className="font-mono text-brand-700 dark:text-brand-400">{req.letterNumber}</strong></span>
                      )}
                      <span>Diajukan: {formatDateTime(req.createdAt)}</span>
                    </div>

                    {req.notes && (
                      <div className={`mt-2 p-2.5 rounded-lg text-xs ${
                        req.status === 'Perlu Revisi'
                          ? 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300'
                          : req.status === 'Ditolak'
                          ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300'
                          : 'bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}>
                        <div className="flex items-center gap-1.5 font-semibold mb-0.5">
                          {req.status === 'Perlu Revisi' ? <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> : <Info className="w-3.5 h-3.5 text-brand-600" />}
                          <span>Catatan Pengurus ({req.reviewedBy || 'Sekretaris'}):</span>
                        </div>
                        <p>{req.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 pt-2 sm:pt-0 shrink-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedDetailRequest(req)}
                    >
                      Timeline
                    </Button>

                    {(req.status === 'Diajukan' || req.status === 'Perlu Revisi') && (
                      <>
                        <Button
                          size="sm"
                          variant="secondary"
                          icon={Edit2}
                          onClick={() => handleOpenEdit(req)}
                          title="Perbaiki / Edit Data"
                        >
                          Edit
                        </Button>
                        <button
                          type="button"
                          onClick={() => setDeletingRequest(req)}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Batalkan Pengajuan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {(req.status === 'Disetujui' || req.status === 'Selesai') && (
                      <Button
                        size="sm"
                        variant="teal"
                        icon={Printer}
                        onClick={() => setSelectedPrintRequest(req)}
                      >
                        Cetak Surat
                      </Button>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Modal: Form Pengajuan / Edit Surat */}
      <Modal
        isOpen={isModalOpen || !!editingRequest}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRequest(null);
        }}
        title={editingRequest ? 'Perbaiki / Edit Permohonan Surat' : 'Ajukan Permohonan Surat'}
        description="Pilih jenis surat dan lengkapi rincian permohonan Anda untuk diverifikasi pengurus RT/RW."
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setIsModalOpen(false);
                setEditingRequest(null);
              }}
            >
              Batal
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {editingRequest ? 'Simpan Perubahan' : 'Kirim Pengajuan'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 font-medium">
              {error}
            </div>
          )}

          <Select
            label="Pilih Jenis Surat"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            options={letterTypes.map(t => ({ value: t.id, label: `${t.code} — ${t.name}` }))}
            disabled={!!editingRequest}
            required
          />

          {currentTypeConfig && (
            <div className="p-3.5 rounded-xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900/60 text-xs space-y-2">
              <p className="font-semibold text-brand-900 dark:text-brand-300">{currentTypeConfig.description}</p>
              <div>
                <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">Persyaratan Dokumen:</p>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-600 dark:text-slate-400">
                  {currentTypeConfig.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Estimasi Proses: <strong className="text-slate-700 dark:text-slate-300">{currentTypeConfig.processingTime}</strong>
              </p>
            </div>
          )}

          <Textarea
            label="Keperluan Pengajuan Surat"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="Contoh: Persyaratan pembukaan rekening bank baru / pendaftaran sekolah anak"
            rows={3}
            required
            helperText="Jelaskan secara spesifik agar pengurus dapat memproses permohonan dengan tepat."
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Lampirkan Dokumen Pendukung (Foto KTP / KK / Bukti)
            </label>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center hover:border-brand-400 transition-colors bg-slate-50/50 dark:bg-slate-900/50">
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {attachmentName ? attachmentName : 'Pilih file atau seret ke sini'}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Format didukung: JPG, PNG, PDF (Maks. 5 MB)
              </p>
              <input
                type="file"
                className="hidden"
                id="doc-upload"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setAttachmentName(e.target.files[0].name);
                  }
                }}
              />
              <label
                htmlFor="doc-upload"
                className="mt-2.5 inline-block text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 cursor-pointer"
              >
                Jelajahi Berkas Komputer
              </label>
            </div>
          </div>
        </form>
      </Modal>

      {/* Modal: Timeline Detail */}
      <Modal
        isOpen={!!selectedDetailRequest}
        onClose={() => setSelectedDetailRequest(null)}
        title="Riwayat Pelacakan Surat"
        description={`No. Referensi: ${selectedDetailRequest?.referenceNo}`}
        footer={
          <Button variant="secondary" onClick={() => setSelectedDetailRequest(null)}>
            Tutup
          </Button>
        }
      >
        {selectedDetailRequest && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{selectedDetailRequest.letterName}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                <strong>Keperluan:</strong> {selectedDetailRequest.purpose}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">Status Terkini:</span>
                <Badge status={selectedDetailRequest.status} />
              </div>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                Timeline Riwayat Proses
              </h5>
              <div className="space-y-3 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                {selectedDetailRequest.timeline?.map((step, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-brand-500 border-2 border-white dark:border-slate-800 shadow-xs" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{step.status}</span>
                        <span className="text-[10px] text-slate-400">{formatDateTime(step.date)}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{step.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirmation Dialog: Batalkan Surat */}
      <ConfirmDialog
        isOpen={!!deletingRequest}
        onClose={() => setDeletingRequest(null)}
        onConfirm={handleConfirmDelete}
        title="Batalkan Pengajuan Surat"
        message={`Apakah Anda yakin ingin membatalkan pengajuan ${deletingRequest?.letterName} (Ref: ${deletingRequest?.referenceNo})?`}
        confirmLabel="Ya, Batalkan Pengajuan"
      />

      {/* Printable Sheet View */}
      {selectedPrintRequest && (
        <SuratPrintDocument
          letterRequest={selectedPrintRequest}
          onClose={() => setSelectedPrintRequest(null)}
        />
      )}
    </div>
  );
}
