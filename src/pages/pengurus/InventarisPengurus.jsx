import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input, Textarea } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import {
  PackageCheck,
  Plus,
  MapPin,
  User,
  Wrench,
  CheckCircle2,
  AlertCircle,
  Pencil,
  Trash2,
} from 'lucide-react';

export function InventarisPengurus() {
  const { assets, addAsset, updateAsset, deleteAsset, currentUser } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [editingAsset, setEditingAsset] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState('Peralatan Sanitasi');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('Unit');
  const [condition, setCondition] = useState('Baik');
  const [location, setLocation] = useState('Gudang Balai Warga');
  const [pic, setPic] = useState('Bpk. Agus Saputra (Petugas)');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const canManage = ['ketua_rw', 'ketua_rt', 'sekretaris', 'petugas'].includes(currentUser.role);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !code.trim() || !location.trim()) {
      setError('Mohon lengkapi kode aset, nama barang, dan lokasi penyimpanan.');
      return;
    }

    addAsset({
      code: code.trim().toUpperCase(),
      name: name.trim(),
      category,
      quantity: parseInt(quantity, 10) || 1,
      unit,
      condition,
      location: location.trim(),
      pic: pic.trim(),
      notes: notes.trim(),
    });

    setIsModalOpen(false);
    resetForm();
  };

  const handleOpenEdit = (ast) => {
    setEditingAsset(ast);
    setCode(ast.code);
    setName(ast.name);
    setCategory(ast.category);
    setQuantity(String(ast.quantity));
    setUnit(ast.unit);
    setCondition(ast.condition);
    setLocation(ast.location);
    setPic(ast.pic);
    setNotes(ast.notes || '');
    setError('');
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !code.trim() || !location.trim()) {
      setError('Mohon lengkapi kode aset, nama barang, dan lokasi penyimpanan.');
      return;
    }

    updateAsset(editingAsset.id, {
      code: code.trim().toUpperCase(),
      name: name.trim(),
      category,
      quantity: parseInt(quantity, 10) || 1,
      unit,
      condition,
      location: location.trim(),
      pic: pic.trim(),
      notes: notes.trim(),
    });

    setEditingAsset(null);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setCode('');
    setNotes('');
    setError('');
  };

  const handleUpdateCondition = (newCond) => {
    if (!selectedAsset) return;
    updateAsset(selectedAsset.id, { condition: newCond });
    setSelectedAsset(prev => ({ ...prev, condition: newCond }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Inventaris & Aset Sarana Lingkungan
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pencatatan kepemilikan aset warga (tenda, kursi, sound system, mesin fogging, dan gerobak).
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
            Tambah Aset Baru
          </Button>
        )}
      </div>

      {/* Grid of Assets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assets.map((asset) => (
          <Card key={asset.id} hover className="flex flex-col justify-between">
            <CardBody className="p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 rounded border border-brand-100 dark:border-brand-800">
                  {asset.code}
                </span>
                <Badge status={asset.condition} size="sm" />
              </div>

              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                  {asset.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Kategori: {asset.category}</p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800 text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Jumlah Barang:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums text-sm">
                    {asset.quantity} {asset.unit}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{asset.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <User className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">PIC: {asset.pic}</span>
                </div>
              </div>

              {asset.notes && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 italic line-clamp-2">
                  Catatan: {asset.notes}
                </p>
              )}

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedAsset(asset)}
                >
                  Kondisi
                </Button>

                {canManage && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(asset)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Edit Aset"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(asset.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Hapus Aset"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Modal: Tambah Aset Baru */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Catat Barang Inventaris Baru"
        description="Daftarkan sarana/prasarana lingkungan milik RT/RW."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Simpan Aset
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

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Kode Aset"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="AST-TND-02"
              required
            />
            <Select
              label="Kategori"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={['Tenda & Terpal', 'Mebel & Perlengkapan', 'Elektronik & Audio', 'Peralatan Sanitasi', 'Kebersihan']}
              required
            />
          </div>

          <Input
            label="Nama Barang / Fasilitas"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Kabel Roll Gulung 50 Meter"
            required
          />

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Jumlah"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              required
            />
            <Input
              label="Satuan"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="Unit / Buah / Set"
              required
            />
            <Select
              label="Kondisi Fisik"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              options={['Baik', 'Perlu Perbaikan', 'Rusak']}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Lokasi Penyimpanan"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Gudang Balai Warga"
              required
            />
            <Input
              label="Penanggung Jawab (PIC)"
              value={pic}
              onChange={(e) => setPic(e.target.value)}
              placeholder="Bpk. Agus Saputra"
              required
            />
          </div>

          <Textarea
            label="Catatan Tambahan (Spesifikasi / Kelengkapan)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Kondisi baut lengkap, siap pakai..."
            rows={2}
          />
        </form>
      </Modal>

      {/* Modal: Edit Aset Lengkap */}
      <Modal
        isOpen={!!editingAsset}
        onClose={() => setEditingAsset(null)}
        title="Edit Data Inventaris Aset"
        description="Perbarui informasi kepemilikan, lokasi penyimpanan, atau penanggung jawab."
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditingAsset(null)}>
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

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Kode Aset"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <Select
              label="Kategori"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={['Tenda & Terpal', 'Mebel & Perlengkapan', 'Elektronik & Audio', 'Peralatan Sanitasi', 'Kebersihan']}
              required
            />
          </div>

          <Input
            label="Nama Barang / Fasilitas"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Jumlah"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              required
            />
            <Input
              label="Satuan"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              required
            />
            <Select
              label="Kondisi Fisik"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              options={['Baik', 'Perlu Perbaikan', 'Rusak']}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Lokasi Penyimpanan"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
            <Input
              label="Penanggung Jawab (PIC)"
              value={pic}
              onChange={(e) => setPic(e.target.value)}
              required
            />
          </div>

          <Textarea
            label="Catatan Tambahan (Spesifikasi / Kelengkapan)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
          />
        </form>
      </Modal>

      {/* Modal: Kelola Kondisi Aset Cepat */}
      <Modal
        isOpen={!!selectedAsset}
        onClose={() => setSelectedAsset(null)}
        title="Kelola Kondisi & Lokasi Barang"
        description={`Kode: ${selectedAsset?.code} — ${selectedAsset?.name}`}
        footer={
          <Button variant="secondary" onClick={() => setSelectedAsset(null)}>
            Tutup
          </Button>
        }
      >
        {selectedAsset && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-600 dark:text-slate-400">Kondisi Terkini:</span>
                <Badge status={selectedAsset.condition} />
              </div>
              <p className="text-slate-700 dark:text-slate-300">Jumlah: <strong>{selectedAsset.quantity} {selectedAsset.unit}</strong></p>
              <p className="text-slate-700 dark:text-slate-300">Lokasi Penyimpanan: <strong>{selectedAsset.location}</strong></p>
              <p className="text-slate-700 dark:text-slate-300">Penanggung Jawab: <strong>{selectedAsset.pic}</strong></p>
            </div>

            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Ubah Status Kondisi Cepat:</p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  size="sm"
                  variant={selectedAsset.condition === 'Baik' ? 'teal' : 'outline'}
                  onClick={() => handleUpdateCondition('Baik')}
                >
                  Kondisi Baik
                </Button>
                <Button
                  size="sm"
                  variant={selectedAsset.condition === 'Perlu Perbaikan' ? 'primary' : 'outline'}
                  onClick={() => handleUpdateCondition('Perlu Perbaikan')}
                >
                  Perlu Servis
                </Button>
                <Button
                  size="sm"
                  variant={selectedAsset.condition === 'Rusak' ? 'danger' : 'outline'}
                  onClick={() => handleUpdateCondition('Rusak')}
                >
                  Rusak / Afkir
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm Dialog: Hapus Aset */}
      <ConfirmDialog
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={() => {
          deleteAsset(confirmDeleteId);
          setConfirmDeleteId(null);
        }}
        title="Hapus Data Inventaris"
        message="Apakah Anda yakin ingin menghapus data inventaris aset ini? Data yang dihapus tidak dapat dipulihkan."
        confirmText="Hapus Aset"
        variant="danger"
      />
    </div>
  );
}
