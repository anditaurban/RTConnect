import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/formatters';
import { Card, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Input, Textarea } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import {
  Megaphone,
  Plus,
  Calendar,
  AlertCircle,
  Archive,
  Edit2,
  Trash2,
  Eye,
  ShieldAlert,
} from 'lucide-react';

export function PengumumanPengurus() {
  const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement, currentUser } = useApp();

  const canManage = ['ketua_rw', 'ketua_rt', 'sekretaris'].includes(currentUser.role);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [deletingAnnouncement, setDeletingAnnouncement] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [targetRegion, setTargetRegion] = useState('Semua RT (RW 05)');
  const [priority, setPriority] = useState('Biasa');
  const [status, setStatus] = useState('Dipublikasikan');
  const [content, setContent] = useState('');
  const [validUntil, setValidUntil] = useState('2026-08-31');
  const [error, setError] = useState('');

  const handleOpenAdd = () => {
    setTitle('');
    setTargetRegion('Semua RT (RW 05)');
    setPriority('Biasa');
    setStatus('Dipublikasikan');
    setContent('');
    setValidUntil('2026-08-31');
    setError('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (ann) => {
    setEditingAnnouncement(ann);
    setTitle(ann.title);
    setTargetRegion(ann.targetRegion);
    setPriority(ann.priority);
    setStatus(ann.status);
    setContent(ann.content);
    setValidUntil(ann.validUntil || '2026-08-31');
    setError('');
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Judul dan isi pengumuman wajib diisi.');
      return;
    }

    addAnnouncement({
      title: title.trim(),
      targetRegion,
      priority,
      status,
      content: content.trim(),
      validUntil,
      attachments: [],
    });

    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingAnnouncement) return;

    if (!title.trim() || !content.trim()) {
      setError('Judul dan isi pengumuman wajib diisi.');
      return;
    }

    updateAnnouncement(editingAnnouncement.id, {
      title: title.trim(),
      targetRegion,
      priority,
      status,
      content: content.trim(),
      validUntil,
    });

    setEditingAnnouncement(null);
  };

  const handleArchive = (id) => {
    updateAnnouncement(id, { status: 'Diarsipkan' });
  };

  const handleConfirmDelete = () => {
    if (!deletingAnnouncement) return;
    deleteAnnouncement(deletingAnnouncement.id);
    setDeletingAnnouncement(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Pengelolaan Informasi & Pengumuman
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Terbitkan warta resmi RT/RW, himbauan darurat, dan informasi ketertiban lingkungan.
          </p>
        </div>
        {canManage ? (
          <Button
            variant="primary"
            icon={Plus}
            onClick={handleOpenAdd}
          >
            Buat Pengumuman Baru
          </Button>
        ) : (
          <div className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span>Mode Baca (Pengumuman dikelola oleh Sekretaris / Ketua RT/RW)</span>
          </div>
        )}
      </div>

      {/* Announcements List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {announcements.map((ann) => (
          <Card key={ann.id} hover className="flex flex-col justify-between">
            <CardBody className="p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <Badge status={ann.status === 'Dipublikasikan' ? 'Disetujui' : ann.status === 'Draft' ? 'Draft' : 'Nonaktif'} label={ann.status} size="sm" />
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    ann.priority === 'Penting'
                      ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {ann.priority}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">{formatDate(ann.date)}</span>
              </div>

              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 leading-snug">
                  {ann.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 line-clamp-3 leading-relaxed">
                  {ann.content}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Sasaran: <strong className="text-slate-600 dark:text-slate-300">{ann.targetRegion}</strong></span>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedAnnouncement(ann)}
                  >
                    Detail
                  </Button>
                  {canManage && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(ann)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/40 transition-colors"
                        title="Edit Pengumuman"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {ann.status !== 'Diarsipkan' && (
                        <button
                          type="button"
                          onClick={() => handleArchive(ann.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Arsipkan Pengumuman"
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setDeletingAnnouncement(ann)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Hapus Pengumuman"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Modal: Buat Pengumuman Baru */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Terbitkan Pengumuman Baru"
        description="Pesan akan tampil di beranda aplikasi warga sesuai target wilayah yang dipilih."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleSaveAdd}>
              Publikasikan
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

          <Input
            label="Judul Pengumuman"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Pemberitahuan Fogging Serentak Musim Hujan"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              label="Sasaran Wilayah"
              value={targetRegion}
              onChange={(e) => setTargetRegion(e.target.value)}
              options={['Semua RT (RW 05)', 'RT 01', 'RT 02', 'RT 03', 'Khusus Pengurus RT/RW']}
              required
            />
            <Select
              label="Prioritas Tampilan"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              options={['Biasa', 'Penting']}
              required
            />
            <Select
              label="Status Publikasi"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={['Dipublikasikan', 'Draft']}
              required
            />
          </div>

          <Textarea
            label="Isi Pengumuman Lengkap"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tuliskan detail pengumuman yang jelas untuk warga..."
            rows={4}
            required
          />

          <Input
            label="Masa Berlaku Pengumuman Hingga"
            type="date"
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
          />
        </form>
      </Modal>

      {/* Modal: Edit Pengumuman */}
      <Modal
        isOpen={!!editingAnnouncement}
        onClose={() => setEditingAnnouncement(null)}
        title="Ubah Pengumuman"
        description="Perbarui konten atau masa berlaku pengumuman."
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditingAnnouncement(null)}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleSaveEdit}>
              Simpan Perubahan
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

          <Input
            label="Judul Pengumuman"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              label="Sasaran Wilayah"
              value={targetRegion}
              onChange={(e) => setTargetRegion(e.target.value)}
              options={['Semua RT (RW 05)', 'RT 01', 'RT 02', 'RT 03', 'Khusus Pengurus RT/RW']}
              required
            />
            <Select
              label="Prioritas"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              options={['Biasa', 'Penting']}
              required
            />
            <Select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={['Dipublikasikan', 'Draft', 'Diarsipkan']}
              required
            />
          </div>

          <Textarea
            label="Isi Pengumuman"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            required
          />

          <Input
            label="Masa Berlaku Hingga"
            type="date"
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
          />
        </form>
      </Modal>

      {/* Modal: Detail Pengumuman */}
      <Modal
        isOpen={!!selectedAnnouncement}
        onClose={() => setSelectedAnnouncement(null)}
        title="Rincian Pengumuman"
        footer={
          <Button variant="secondary" onClick={() => setSelectedAnnouncement(null)}>
            Tutup
          </Button>
        }
      >
        {selectedAnnouncement && (
          <div className="space-y-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <Badge status="Baru" label={selectedAnnouncement.priority} />
              <span className="text-slate-400">Tanggal: {formatDate(selectedAnnouncement.date)}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {selectedAnnouncement.title}
            </h3>
            <p className="whitespace-pre-line text-sm text-slate-700 dark:text-slate-300">
              {selectedAnnouncement.content}
            </p>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              <p>Penulis: <strong>{selectedAnnouncement.author}</strong></p>
              <p>Target Wilayah: <strong>{selectedAnnouncement.targetRegion}</strong></p>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm: Hapus Pengumuman */}
      <ConfirmDialog
        isOpen={!!deletingAnnouncement}
        onClose={() => setDeletingAnnouncement(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Pengumuman"
        message={`Apakah Anda yakin ingin menghapus pengumuman "${deletingAnnouncement?.title}" secara permanen?`}
        confirmLabel="Ya, Hapus Pengumuman"
      />
    </div>
  );
}
