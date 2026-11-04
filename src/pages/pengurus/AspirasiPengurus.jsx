import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatDate, formatDateTime } from '../../utils/formatters';
import { Card, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input, Textarea } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import {
  MessageSquareWarning,
  MapPin,
  Clock,
  User,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Pencil,
  Trash2,
  Send,
  Plus,
} from 'lucide-react';

export function AspirasiPengurus() {
  const {
    complaints,
    respondToComplaint,
    updateComplaint,
    deleteComplaint,
    addComplaint,
    currentUser,
  } = useApp();

  const [filterStatus, setFilterStatus] = useState('Semua');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Response Form states
  const [newStatus, setNewStatus] = useState('Ditindaklanjuti');
  const [assignedTo, setAssignedTo] = useState('Bpk. Agus Saputra (Petugas)');
  const [responseText, setResponseText] = useState('');
  const [responseError, setResponseError] = useState('');

  // Edit / Create Form states
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Fasilitas Umum');
  const [formLocation, setFormLocation] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formError, setFormError] = useState('');

  const canManage = ['ketua_rw', 'ketua_rt', 'sekretaris', 'petugas'].includes(currentUser.role);

  const filtered = filterStatus === 'Semua'
    ? complaints
    : complaints.filter(c => c.status === filterStatus);

  const handleOpenAction = (item) => {
    setSelectedComplaint(item);
    setNewStatus(item.status === 'Baru' ? 'Ditindaklanjuti' : item.status);
    setAssignedTo(item.assignedTo || 'Bpk. Agus Saputra (Petugas)');
    setResponseText('');
    setResponseError('');
  };

  const handleSaveResponse = () => {
    if (!responseText.trim()) {
      setResponseError('Mohon tuliskan tanggapan atau instruksi tindak lanjut untuk warga.');
      return;
    }

    respondToComplaint(selectedComplaint.id, responseText.trim(), newStatus, assignedTo);
    setSelectedComplaint(null);
  };

  const handleOpenEdit = (item) => {
    setEditingComplaint(item);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormLocation(item.location);
    setFormDescription(item.description);
    setFormError('');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formLocation.trim() || !formDescription.trim()) {
      setFormError('Mohon lengkapi seluruh kolom formulir.');
      return;
    }

    updateComplaint(editingComplaint.id, {
      title: formTitle.trim(),
      category: formCategory,
      location: formLocation.trim(),
      description: formDescription.trim(),
    });
    setEditingComplaint(null);
  };

  const handleSaveCreate = (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formLocation.trim() || !formDescription.trim()) {
      setFormError('Mohon lengkapi seluruh kolom formulir.');
      return;
    }

    addComplaint({
      title: formTitle.trim(),
      category: formCategory,
      location: formLocation.trim(),
      description: formDescription.trim(),
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      reporterPhone: '0812-3456-7890',
    });
    setIsCreateOpen(false);
    setFormTitle('');
    setFormLocation('');
    setFormDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Antrean Aspirasi & Pengaduan Warga
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pantau laporan fasilitas lingkungan rusak, sampah, dan tindak lanjut penugasan petugas RT.
          </p>
        </div>
        {canManage && (
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => {
              setFormTitle('');
              setFormCategory('Fasilitas Umum');
              setFormLocation('');
              setFormDescription('');
              setFormError('');
              setIsCreateOpen(true);
            }}
          >
            Catat Pengaduan Internal
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-1 overflow-x-auto">
        {['Semua', 'Baru', 'Ditinjau', 'Ditindaklanjuti', 'Selesai', 'Ditolak'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              filterStatus === status
                ? 'bg-brand-600 text-white font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {status} ({status === 'Semua' ? complaints.length : complaints.filter(c => c.status === status).length})
          </button>
        ))}
      </div>

      {/* Complaints Cards List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <Card key={item.id} hover>
            <CardBody className="p-4 sm:p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 rounded border border-brand-100 dark:border-brand-800">
                      {item.category}
                    </span>
                    <Badge status={item.status} />
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 pt-0.5">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400 dark:text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{item.location}</span>
                    </span>
                    <span>
                      Pelapor: <strong className="text-slate-700 dark:text-slate-300">{item.reporterName}</strong> ({item.reporterPhone})
                    </span>
                    <span>Waktu: {formatDateTime(item.createdAt)}</span>
                    {item.assignedTo && (
                      <span className="text-brand-700 dark:text-brand-400 font-semibold">Petugas: {item.assignedTo}</span>
                    )}
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2 justify-end">
                  {canManage && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenAction(item)}
                      >
                        Tanggapi
                      </Button>
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit Aduan"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        title="Hapus / Void Aduan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* History of responses */}
              {item.responses && item.responses.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs space-y-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Tanggapan Pengurus:</span>
                  {item.responses.map((res, idx) => (
                    <div key={idx} className="border-t border-slate-200/60 dark:border-slate-800 pt-1.5 first:border-0 first:pt-0">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{res.author}</span>
                        <span>{formatDateTime(res.date)}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 mt-0.5">{res.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-xs text-slate-400">
            Tidak ada laporan aspirasi pada kategori ini.
          </div>
        )}
      </div>

      {/* Modal: Tanggapi Aduan */}
      <Modal
        isOpen={!!selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        title="Tanggapan & Pembaruan Status Laporan"
        description={`Pelapor: ${selectedComplaint?.reporterName} (${selectedComplaint?.category})`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setSelectedComplaint(null)}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleSaveResponse}>
              Kirim Tanggapan
            </Button>
          </>
        }
      >
        {selectedComplaint && (
          <div className="space-y-3 text-xs">
            {responseError && (
              <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-medium">
                {responseError}
              </div>
            )}

            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-slate-100">{selectedComplaint.title}</h4>
              <p className="text-slate-600 dark:text-slate-300">{selectedComplaint.description}</p>
              <p className="text-slate-500 dark:text-slate-400 pt-1">
                Lokasi: <strong>{selectedComplaint.location}</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Perbarui Status Penanganan"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                options={['Ditinjau', 'Ditindaklanjuti', 'Selesai', 'Ditolak']}
                required
              />

              <Select
                label="Tugaskan Petugas Penanggung Jawab"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                options={[
                  'Bpk. Agus Saputra (Petugas)',
                  'Bpk. Joko Widodo M. (Ketua RT)',
                  'Petugas Kebersihan TPS',
                  'Tim Ronda Malam',
                ]}
              />
            </div>

            <Textarea
              label="Tulis Tanggapan Resmi untuk Warga"
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Contoh: Petugas Pak Agus telah membeli lampu LED dan proses penggantian dilakukan sore ini..."
              rows={3}
              required
            />
          </div>
        )}
      </Modal>

      {/* Modal: Edit Aduan */}
      <Modal
        isOpen={!!editingComplaint}
        onClose={() => setEditingComplaint(null)}
        title="Edit Data Pengaduan"
        description="Perbaiki rincian laporan atau klasifikasi kategori aduan."
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditingComplaint(null)}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleSaveEdit}>
              Simpan Perubahan
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveEdit} className="space-y-3">
          {formError && (
            <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium">
              {formError}
            </div>
          )}
          <Input
            label="Judul Laporan"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Kategori"
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              options={['Fasilitas Umum', 'Kebersihan & Sampah', 'Keamanan Lingkungan', 'Ketertiban Warga', 'Usulan & Saran']}
              required
            />
            <Input
              label="Lokasi Titik Masalah"
              value={formLocation}
              onChange={(e) => setFormLocation(e.target.value)}
              required
            />
          </div>
          <Textarea
            label="Deskripsi Masalah"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            rows={3}
            required
          />
        </form>
      </Modal>

      {/* Modal: Catat Pengaduan Internal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Catat Pengaduan / Keluhan Lapangan"
        description="Pencatatan temuan fasilitas rusak langsung oleh pengurus atau petugas lingkungan."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleSaveCreate}>
              Simpan Laporan
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveCreate} className="space-y-3">
          {formError && (
            <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium">
              {formError}
            </div>
          )}
          <Input
            label="Judul Laporan"
            placeholder="Contoh: Kerusakan Pipa Air Balai Warga"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Kategori"
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              options={['Fasilitas Umum', 'Kebersihan & Sampah', 'Keamanan Lingkungan', 'Ketertiban Warga', 'Usulan & Saran']}
              required
            />
            <Input
              label="Lokasi Spesifik"
              placeholder="Contoh: Belakang Balai RT 01"
              value={formLocation}
              onChange={(e) => setFormLocation(e.target.value)}
              required
            />
          </div>
          <Textarea
            label="Keterangan Rinci"
            placeholder="Jelaskan kondisi dan tingkat urgensi..."
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            rows={3}
            required
          />
        </form>
      </Modal>

      {/* Confirm Dialog: Hapus Aduan */}
      <ConfirmDialog
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={() => {
          deleteComplaint(confirmDeleteId);
          setConfirmDeleteId(null);
        }}
        title="Hapus Laporan Aspirasi"
        message="Apakah Anda yakin ingin menghapus laporan aspirasi ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus Laporan"
        variant="danger"
      />
    </div>
  );
}
