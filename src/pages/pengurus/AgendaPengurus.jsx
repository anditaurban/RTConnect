import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/formatters';
import { Card, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input, Textarea } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import {
  Calendar,
  Plus,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Pencil,
  Trash2,
} from 'lucide-react';

export function AgendaPengurus() {
  const { events, addEvent, updateEvent, deleteEvent, currentUser } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('Semua');

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Kerja Bakti');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('08:00 - 11:00 WIB');
  const [location, setLocation] = useState('Balai Warga RW 05');
  const [organizer, setOrganizer] = useState('Pengurus RT 01');
  const [description, setDescription] = useState('');
  const [statusVal, setStatusVal] = useState('Akan Datang');
  const [error, setError] = useState('');

  const canManage = ['ketua_rw', 'ketua_rt', 'sekretaris'].includes(currentUser.role);

  const filtered = filterStatus === 'Semua'
    ? events
    : events.filter(e => e.status === filterStatus);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !date || !location.trim()) {
      setError('Mohon lengkapi judul kegiatan, tanggal, dan lokasi.');
      return;
    }

    addEvent({
      title: title.trim(),
      category,
      date,
      time,
      location: location.trim(),
      organizer: organizer.trim(),
      description: description.trim(),
    });

    setIsModalOpen(false);
    resetForm();
  };

  const handleOpenEdit = (evt) => {
    setEditingEvent(evt);
    setTitle(evt.title);
    setCategory(evt.category);
    setDate(evt.date);
    setTime(evt.time);
    setLocation(evt.location);
    setOrganizer(evt.organizer);
    setDescription(evt.description);
    setStatusVal(evt.status);
    setError('');
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !date || !location.trim()) {
      setError('Mohon lengkapi judul kegiatan, tanggal, dan lokasi.');
      return;
    }

    updateEvent(editingEvent.id, {
      title: title.trim(),
      category,
      date,
      time,
      location: location.trim(),
      organizer: organizer.trim(),
      description: description.trim(),
      status: statusVal,
    });

    setEditingEvent(null);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDate('');
    setDescription('');
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Agenda & Kegiatan Lingkungan
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Penjadwalan rapat warga, posyandu, kerja bakti berkala, dan acara kemasyarakatan.
          </p>
        </div>
        {canManage && (
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
          >
            Tambah Agenda Baru
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-1 overflow-x-auto">
        {['Semua', 'Akan Datang', 'Berlangsung', 'Selesai', 'Dibatalkan'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              filterStatus === status
                ? 'bg-brand-600 text-white font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {status} ({status === 'Semua' ? events.length : events.filter(e => e.status === status).length})
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((evt) => (
          <Card key={evt.id} hover className="flex flex-col justify-between">
            <CardBody className="p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 rounded border border-brand-100 dark:border-brand-800">
                  {evt.category}
                </span>
                <Badge status={evt.status} size="sm" />
              </div>

              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                  {evt.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                  {evt.description}
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{formatDate(evt.date, true)} ({evt.time})</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{evt.location}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800">
                <span>Penyelenggara: {evt.organizer}</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">{evt.attendeesCount} warga</span>
                  {canManage && (
                    <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-2">
                      <button
                        onClick={() => handleOpenEdit(evt)}
                        className="p-1 rounded text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit Agenda"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(evt.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        title="Hapus Agenda"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full p-8 text-center bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-xs text-slate-400">
            Tidak ada agenda kegiatan pada status ini.
          </div>
        )}
      </div>

      {/* Modal: Tambah Agenda Baru */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Jadwalkan Agenda Kegiatan Baru"
        description="Kegiatan akan masuk ke kalender dan dapat dilihat oleh seluruh warga RT/RW."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Simpan Agenda
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          <Input
            label="Nama Kegiatan / Agenda"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Kerja Bakti Massal Menyambut HUT RI"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Kategori"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={['Kerja Bakti', 'Peringatan Hari Besar', 'Kesehatan / Posyandu', 'Rapat RT/RW', 'Olahraga Bersama']}
              required
            />
            <Input
              label="Tanggal Pelaksanaan"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Waktu / Jam"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="Contoh: 07:00 - 10:30 WIB"
              required
            />
            <Input
              label="Penyelenggara"
              value={organizer}
              onChange={(e) => setOrganizer(e.target.value)}
              placeholder="Contoh: Pengurus RT 01"
              required
            />
          </div>

          <Input
            label="Lokasi Acara"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Contoh: Balai Warga RW 05 / Lapangan RT 01"
            required
          />

          <Textarea
            label="Keterangan & Imbauan untuk Warga"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Contoh: Mohon membawa peralatan cangkul dan sapu..."
            rows={2}
          />
        </form>
      </Modal>

      {/* Modal: Edit Agenda */}
      <Modal
        isOpen={!!editingEvent}
        onClose={() => setEditingEvent(null)}
        title="Edit Data Agenda Kegiatan"
        description="Perbarui jadwal pelaksanaan, lokasi, atau status kegiatan."
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditingEvent(null)}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleUpdate}>
              Simpan Perubahan
            </Button>
          </>
        }
      >
        <form onSubmit={handleUpdate} className="space-y-3">
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          <Input
            label="Nama Kegiatan / Agenda"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Kategori"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={['Kerja Bakti', 'Peringatan Hari Besar', 'Kesehatan / Posyandu', 'Rapat RT/RW', 'Olahraga Bersama']}
              required
            />
            <Select
              label="Status Agenda"
              value={statusVal}
              onChange={(e) => setStatusVal(e.target.value)}
              options={['Akan Datang', 'Berlangsung', 'Selesai', 'Dibatalkan']}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Tanggal Pelaksanaan"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <Input
              label="Waktu / Jam"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Lokasi Acara"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
            <Input
              label="Penyelenggara"
              value={organizer}
              onChange={(e) => setOrganizer(e.target.value)}
              required
            />
          </div>

          <Textarea
            label="Keterangan & Imbauan untuk Warga"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </form>
      </Modal>

      {/* Confirm Dialog: Hapus Agenda */}
      <ConfirmDialog
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={() => {
          deleteEvent(confirmDeleteId);
          setConfirmDeleteId(null);
        }}
        title="Hapus Agenda Kegiatan"
        message="Apakah Anda yakin ingin menghapus agenda kegiatan ini dari kalender warga?"
        confirmText="Hapus Agenda"
        variant="danger"
      />
    </div>
  );
}
