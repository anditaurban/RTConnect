import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatDate, formatDateTime } from '../../utils/formatters';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card, CardBody } from '../../components/common/Card';
import { Modal } from '../../components/common/Modal';
import { Input, Textarea } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import {
  MessageSquareWarning,
  Plus,
  MapPin,
  Clock,
  User,
  Upload,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Pencil,
  Trash2,
} from 'lucide-react';

export function AspirasiWarga() {
  const { complaints, addComplaint, updateComplaint, deleteComplaint } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('Semua');

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Fasilitas Umum');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [photoName, setPhotoName] = useState('');
  const [error, setError] = useState('');

  // Filter complaints for current user
  const myComplaints = complaints.filter(c => c.reporterId === 'res-01');
  const filtered = filterStatus === 'Semua'
    ? myComplaints
    : myComplaints.filter(c => c.status === filterStatus);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim() || !location.trim()) {
      setError('Mohon lengkapi judul, lokasi, dan penjelasan aduan.');
      return;
    }

    addComplaint({
      title: title.trim(),
      category,
      location: location.trim(),
      description: description.trim(),
      photoUrl: photoName ? 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80' : null,
    });

    setIsModalOpen(false);
    resetForm();
  };

  const handleOpenEdit = (item) => {
    setEditingComplaint(item);
    setTitle(item.title);
    setCategory(item.category);
    setLocation(item.location);
    setDescription(item.description);
    setError('');
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim() || !location.trim()) {
      setError('Mohon lengkapi seluruh kolom formulir.');
      return;
    }

    updateComplaint(editingComplaint.id, {
      title: title.trim(),
      category,
      location: location.trim(),
      description: description.trim(),
    });

    setEditingComplaint(null);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setLocation('');
    setDescription('');
    setPhotoName('');
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Aspirasi & Pengaduan Warga
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Sampaikan keluhan fasilitas rusak, masalah kebersihan, atau usulan perbaikan lingkungan RT 01.
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="shrink-0"
        >
          Buat Laporan Baru
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-1 overflow-x-auto">
        {['Semua', 'Baru', 'Ditinjau', 'Ditindaklanjuti', 'Selesai'].map((status) => (
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

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={MessageSquareWarning}
          title="Belum Ada Pengaduan"
          description="Anda belum memiliki pengaduan aktif pada status ini."
          actionLabel="Buat Laporan Baru"
          onAction={() => {
            resetForm();
            setIsModalOpen(true);
          }}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const canModify = item.status === 'Baru';

            return (
              <Card key={item.id} hover>
                <CardBody className="p-4 sm:p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 rounded border border-brand-100 dark:border-brand-800">
                          {item.category}
                        </span>
                        <Badge status={item.status} />
                      </div>

                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 pt-1">
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400 dark:text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-slate-600 dark:text-slate-300 font-medium">{item.location}</span>
                        </span>
                        <span>Dilaporkan: {formatDateTime(item.createdAt)}</span>
                        {item.assignedTo && (
                          <span>Petugas: <strong className="text-slate-700 dark:text-slate-200">{item.assignedTo}</strong></span>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedComplaint(item)}
                      >
                        Lihat Tanggapan ({item.responses?.length || 0})
                      </Button>

                      {canModify && (
                        <>
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Edit Laporan"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                            title="Batalkan / Hapus Laporan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Latest response snippet if exists */}
                  {item.responses && item.responses.length > 0 && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200 mb-1">
                        <MessageCircle className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                        <span>Tanggapan Terakhir dari {item.responses[item.responses.length - 1].author}:</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 pl-5">
                        "{item.responses[item.responses.length - 1].message}"
                      </p>
                    </div>
                  )}
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal: Form Pengaduan Baru */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Buat Laporan Aspirasi / Keluhan"
        description="Sampaikan informasi fasilitas atau ketertiban lingkungan yang perlu penanganan pengurus."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Kirim Laporan
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 font-medium">
              {error}
            </div>
          )}

          <Input
            label="Judul Laporan Singkat"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Lampu penerangan gang 2 mati"
            required
          />

          <Select
            label="Kategori Masalah"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[
              { value: 'Fasilitas Umum', label: 'Fasilitas Umum (Lampu, Jalan, Gapura)' },
              { value: 'Kebersihan & Lingkungan', label: 'Kebersihan & Sampah / Saluran Got' },
              { value: 'Keamanan Lingkungan', label: 'Keamanan Lingkungan & Ronda' },
              { value: 'Ketertiban Warga', label: 'Ketertiban & Kenyamanan Lingkungan' },
              { value: 'Usulan & Saran', label: 'Usulan / Saran Kegiatan Lingkungan' },
            ]}
            required
          />

          <Input
            label="Lokasi Spesifik / Titik Kejadian"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Contoh: Depan rumah No. B2/14 atau pertigaan pos ronda"
            required
          />

          <Textarea
            label="Penjelasan Rinci Keluhan"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Jelaskan kondisi permasalahan dan dampak yang dialami warga..."
            rows={3}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Lampirkan Foto Kondisi (Opsional)
            </label>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center hover:border-brand-400 transition-colors bg-slate-50/50 dark:bg-slate-900/50">
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {photoName ? photoName : 'Pilih foto atau ambil gambar'}
              </p>
              <input
                type="file"
                id="photo-upload"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setPhotoName(e.target.files[0].name);
                  }
                }}
              />
              <label
                htmlFor="photo-upload"
                className="mt-2.5 inline-block text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 cursor-pointer"
              >
                Pilih Foto dari Galeri
              </label>
            </div>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Pengaduan (Sebelum diproses) */}
      <Modal
        isOpen={!!editingComplaint}
        onClose={() => setEditingComplaint(null)}
        title="Edit Laporan Aspirasi"
        description="Perbaiki data laporan sebelum diproses oleh pengurus."
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditingComplaint(null)}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleUpdate}>
              Simpan Perubahan
            </Button>
          </>
        }
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 font-medium">
              {error}
            </div>
          )}

          <Input
            label="Judul Laporan Singkat"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Select
            label="Kategori Masalah"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[
              { value: 'Fasilitas Umum', label: 'Fasilitas Umum (Lampu, Jalan, Gapura)' },
              { value: 'Kebersihan & Lingkungan', label: 'Kebersihan & Sampah / Saluran Got' },
              { value: 'Keamanan Lingkungan', label: 'Keamanan Lingkungan & Ronda' },
              { value: 'Ketertiban Warga', label: 'Ketertiban & Kenyamanan Lingkungan' },
              { value: 'Usulan & Saran', label: 'Usulan / Saran Kegiatan Lingkungan' },
            ]}
            required
          />

          <Input
            label="Lokasi Spesifik / Titik Kejadian"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          <Textarea
            label="Penjelasan Rinci Keluhan"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
          />
        </form>
      </Modal>

      {/* Modal: Detail Complaint & Responses */}
      <Modal
        isOpen={!!selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        title="Detail & Tanggapan Pengurus"
        description={`Kategori: ${selectedComplaint?.category}`}
        footer={
          <Button variant="secondary" onClick={() => setSelectedComplaint(null)}>
            Tutup
          </Button>
        }
      >
        {selectedComplaint && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-500 dark:text-slate-400">Status Tindak Lanjut:</span>
                <Badge status={selectedComplaint.status} />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{selectedComplaint.title}</h4>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{selectedComplaint.description}</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1">
                Lokasi: <strong className="text-slate-600 dark:text-slate-300">{selectedComplaint.location}</strong>
              </p>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Riwayat Tanggapan Pengurus ({selectedComplaint.responses?.length || 0})
              </h5>
              {selectedComplaint.responses && selectedComplaint.responses.length > 0 ? (
                <div className="space-y-2">
                  {selectedComplaint.responses.map((res, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-brand-50/60 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-800 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900 dark:text-slate-100">{res.author}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">{formatDateTime(res.date)}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300">{res.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Belum ada tanggapan dari pengurus.</p>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm Dialog: Batalkan / Hapus Laporan */}
      <ConfirmDialog
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={() => {
          deleteComplaint(confirmDeleteId);
          setConfirmDeleteId(null);
        }}
        title="Batalkan Laporan Aspirasi"
        message="Apakah Anda yakin ingin membatalkan dan menghapus laporan ini? Tindakan ini tidak dapat dikembalikan."
        confirmText="Batalkan Laporan"
        variant="danger"
      />
    </div>
  );
}
