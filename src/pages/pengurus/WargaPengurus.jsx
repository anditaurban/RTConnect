import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Home,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';

export function WargaPengurus() {
  const { residents, families, addResident, updateResident, deleteResident, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState('warga'); // warga, kk
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRT, setFilterRT] = useState('Semua');
  const [filterStatus, setFilterStatus] = useState('Semua');

  // Role based permission: RW, RT, and Sekretaris have full management rights
  const canManage = ['ketua_rw', 'ketua_rt', 'sekretaris'].includes(currentUser.role);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingResident, setEditingResident] = useState(null);
  const [selectedResident, setSelectedResident] = useState(null);
  const [deletingResident, setDeletingResident] = useState(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formNIK, setFormNIK] = useState('');
  const [formKK, setFormKK] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formRT, setFormRT] = useState('RT 01');
  const [formAddress, setFormAddress] = useState('');
  const [formDomisili, setFormDomisili] = useState('Tetap');
  const [formStatus, setFormStatus] = useState('Aktif');
  const [formFamilyRole, setFormFamilyRole] = useState('Kepala Keluarga');
  const [formJob, setFormJob] = useState('Wiraswasta');
  const [formError, setFormError] = useState('');

  // Filter logic
  const filteredResidents = residents.filter((r) => {
    const matchQuery =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.nik.includes(searchQuery) ||
      r.noKK.includes(searchQuery);
    const matchRT = filterRT === 'Semua' || r.rt === filterRT;
    const matchStatus = filterStatus === 'Semua' || r.statusKependudukan === filterStatus;
    return matchQuery && matchRT && matchStatus;
  });

  const filteredFamilies = families.filter((f) => {
    const matchQuery =
      f.headName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.noKK.includes(searchQuery);
    const matchRT = filterRT === 'Semua' || f.rt === filterRT;
    return matchQuery && matchRT;
  });

  const handleOpenAdd = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (r) => {
    setEditingResident(r);
    setFormName(r.name);
    setFormNIK(r.nik);
    setFormKK(r.noKK);
    setFormPhone(r.phone || '');
    setFormRT(r.rt || 'RT 01');
    setFormAddress(r.address || '');
    setFormDomisili(r.statusDomisili || 'Tetap');
    setFormStatus(r.statusKependudukan || 'Aktif');
    setFormFamilyRole(r.familyRole || 'Kepala Keluarga');
    setFormJob(r.job || 'Wiraswasta');
    setFormError('');
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formName.trim() || !formNIK.trim() || !formKK.trim() || !formAddress.trim()) {
      setFormError('Mohon lengkapi nama, NIK (16 digit), No. KK, dan alamat.');
      return;
    }

    if (formNIK.length !== 16 || isNaN(formNIK)) {
      setFormError('NIK harus berupa 16 digit angka valid.');
      return;
    }

    addResident({
      name: formName.trim(),
      nik: formNIK.trim(),
      noKK: formKK.trim(),
      phone: formPhone.trim() || '-',
      rt: formRT,
      rw: 'RW 05',
      address: formAddress.trim(),
      statusDomisili: formDomisili,
      statusKependudukan: formStatus,
      familyRole: formFamilyRole,
      job: formJob,
      gender: 'Laki-laki',
      birthPlace: 'Jakarta',
      birthDate: '1990-01-01',
    });

    setIsAddModalOpen(false);
    resetForm();
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingResident) return;

    if (!formName.trim() || !formNIK.trim() || !formKK.trim() || !formAddress.trim()) {
      setFormError('Mohon lengkapi seluruh field wajib.');
      return;
    }

    updateResident(editingResident.id, {
      name: formName.trim(),
      nik: formNIK.trim(),
      noKK: formKK.trim(),
      phone: formPhone.trim() || '-',
      rt: formRT,
      address: formAddress.trim(),
      statusDomisili: formDomisili,
      statusKependudukan: formStatus,
      familyRole: formFamilyRole,
      job: formJob,
    });

    setEditingResident(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingResident) return;
    deleteResident(deletingResident.id);
    setDeletingResident(null);
  };

  const resetForm = () => {
    setFormName('');
    setFormNIK('');
    setFormKK('');
    setFormPhone('');
    setFormAddress('');
    setFormDomisili('Tetap');
    setFormStatus('Aktif');
    setFormFamilyRole('Kepala Keluarga');
    setFormJob('Wiraswasta');
    setFormError('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Data Kependudukan (Warga & KK)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Master pencatatan warga, kartu keluarga, dan status domisili lingkungan RW 05 / RT 01.
          </p>
        </div>
        {canManage ? (
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              icon={UserPlus}
              onClick={handleOpenAdd}
            >
              Tambah Warga Baru
            </Button>
          </div>
        ) : (
          <div className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span>Mode Baca (Pengelolaan data dibatasi untuk Ketua RT/RW & Sekretaris)</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1">
        <button
          onClick={() => setActiveTab('warga')}
          className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'warga'
              ? 'bg-brand-600 text-white font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Daftar Warga ({residents.length})
        </button>
        <button
          onClick={() => setActiveTab('kk')}
          className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'kk'
              ? 'bg-brand-600 text-white font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Daftar Kartu Keluarga ({families.length})
        </button>
      </div>

      {/* Search & Filters Card */}
      <Card>
        <CardBody className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan nama warga, NIK, atau No. KK..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <select
              value={filterRT}
              onChange={(e) => setFilterRT(e.target.value)}
              className="text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="Semua">Semua RT</option>
              <option value="RT 01">RT 01</option>
              <option value="RT 02">RT 02</option>
              <option value="RT 03">RT 03</option>
            </select>

            {activeTab === 'warga' && (
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="Semua">Semua Status</option>
                <option value="Aktif">Aktif</option>
                <option value="Pindah">Pindah</option>
                <option value="Meninggal">Meninggal</option>
              </select>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Table: Data Warga */}
      {activeTab === 'warga' && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Nama Lengkap</th>
                  <th className="py-3 px-4">NIK & No. KK</th>
                  <th className="py-3 px-4">Wilayah / Alamat</th>
                  <th className="py-3 px-4">Domisili</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-slate-700 dark:text-slate-300">
                {filteredResidents.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{r.name}</div>
                      <div className="text-[11px] text-slate-400">{r.familyRole} • {r.gender}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <div>NIK: <span className="font-semibold text-slate-800 dark:text-slate-200">{r.nik}</span></div>
                      <div className="text-slate-400">KK: {r.noKK}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{r.rt} / {r.rw}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">{r.address}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        r.statusDomisili === 'Tetap' ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300' : 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                      }`}>
                        {r.statusDomisili}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge status={r.statusKependudukan} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={Eye}
                          onClick={() => setSelectedResident(r)}
                          title="Lihat Detail"
                        >
                          Detail
                        </Button>
                        {canManage && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              icon={Edit2}
                              onClick={() => handleOpenEdit(r)}
                              title="Edit Data Warga"
                            >
                              Edit
                            </Button>
                            <button
                              type="button"
                              onClick={() => setDeletingResident(r)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              title="Hapus Warga"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredResidents.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Tidak ada data warga yang cocok dengan kriteria pencarian.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Table: Data KK */}
      {activeTab === 'kk' && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">No. Kartu Keluarga</th>
                  <th className="py-3 px-4">Kepala Keluarga</th>
                  <th className="py-3 px-4">Wilayah & Alamat</th>
                  <th className="py-3 px-4">Jumlah Jiwa</th>
                  <th className="py-3 px-4">Anggota Terdaftar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-slate-700 dark:text-slate-300">
                {filteredFamilies.map((f) => (
                  <tr key={f.noKK} className="hover:bg-slate-50/70 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                      {f.noKK}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800 dark:text-slate-200">{f.headName}</div>
                      <div className="text-[11px] font-mono text-slate-400">NIK: {f.nikHead}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{f.rt} / {f.rw}</div>
                      <div className="text-[11px] text-slate-400">{f.address}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                      {f.membersCount} Orang
                    </td>
                    <td className="py-3.5 px-4 text-[11px] text-slate-500 dark:text-slate-400">
                      {f.members?.join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modal: Tambah Warga Baru */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Pendaftaran Warga Baru"
        description="Lengkapi data kependudukan warga untuk registrasi ke sistem administrasi RT."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleSaveAdd}>
              Simpan Data Warga
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveAdd} className="space-y-3">
          {formError && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 font-medium">
              {formError}
            </div>
          )}

          <Input
            label="Nama Lengkap Sesuai KTP"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Contoh: Budi Prasetyo"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Nomor Induk Kependudukan (NIK)"
              value={formNIK}
              onChange={(e) => setFormNIK(e.target.value)}
              placeholder="16 Digit NIK"
              maxLength={16}
              required
            />
            <Input
              label="Nomor Kartu Keluarga (KK)"
              value={formKK}
              onChange={(e) => setFormKK(e.target.value)}
              placeholder="16 Digit No. KK"
              maxLength={16}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              label="Wilayah RT"
              value={formRT}
              onChange={(e) => setFormRT(e.target.value)}
              options={['RT 01', 'RT 02', 'RT 03', 'RT 04', 'RT 05']}
              required
            />
            <Select
              label="Status Domisili"
              value={formDomisili}
              onChange={(e) => setFormDomisili(e.target.value)}
              options={['Tetap', 'Kontrak']}
              required
            />
            <Select
              label="Peran Keluarga"
              value={formFamilyRole}
              onChange={(e) => setFormFamilyRole(e.target.value)}
              options={['Kepala Keluarga', 'Istri', 'Anak', 'Famili Lain']}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Nomor Telepon / WhatsApp"
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
              placeholder="0812-xxxx-xxxx"
            />
            <Input
              label="Pekerjaan"
              value={formJob}
              onChange={(e) => setFormJob(e.target.value)}
              placeholder="Karyawan Swasta / Wiraswasta"
            />
          </div>

          <Input
            label="Alamat Lengkap / Nomor Rumah"
            value={formAddress}
            onChange={(e) => setFormAddress(e.target.value)}
            placeholder="Jl. Mawar Indah Blok B2 No. xx"
            required
          />
        </form>
      </Modal>

      {/* Modal: Edit Warga */}
      <Modal
        isOpen={!!editingResident}
        onClose={() => setEditingResident(null)}
        title="Ubah Data Warga"
        description={`Mengubah data kependudukan ${editingResident?.name}`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditingResident(null)}>
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
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 font-medium">
              {formError}
            </div>
          )}

          <Input
            label="Nama Lengkap"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="NIK"
              value={formNIK}
              onChange={(e) => setFormNIK(e.target.value)}
              maxLength={16}
              required
            />
            <Input
              label="Nomor KK"
              value={formKK}
              onChange={(e) => setFormKK(e.target.value)}
              maxLength={16}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              label="Status Kependudukan"
              value={formStatus}
              onChange={(e) => setFormStatus(e.target.value)}
              options={['Aktif', 'Pindah', 'Meninggal', 'Nonaktif']}
              required
            />
            <Select
              label="Status Domisili"
              value={formDomisili}
              onChange={(e) => setFormDomisili(e.target.value)}
              options={['Tetap', 'Kontrak']}
              required
            />
            <Select
              label="Wilayah RT"
              value={formRT}
              onChange={(e) => setFormRT(e.target.value)}
              options={['RT 01', 'RT 02', 'RT 03', 'RT 04', 'RT 05']}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Pekerjaan"
              value={formJob}
              onChange={(e) => setFormJob(e.target.value)}
            />
            <Input
              label="Nomor Telepon"
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
            />
          </div>

          <Input
            label="Alamat Lengkap"
            value={formAddress}
            onChange={(e) => setFormAddress(e.target.value)}
            required
          />
        </form>
      </Modal>

      {/* Modal: Detail Warga */}
      <Modal
        isOpen={!!selectedResident}
        onClose={() => setSelectedResident(null)}
        title="Detail Data Kependudukan"
        description={`NIK: ${selectedResident?.nik}`}
        footer={
          <Button variant="secondary" onClick={() => setSelectedResident(null)}>
            Tutup
          </Button>
        }
      >
        {selectedResident && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400">Nama Lengkap:</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5">{selectedResident.name}</p>
              </div>
              <div>
                <span className="text-slate-400">Status Kependudukan:</span>
                <div className="mt-0.5"><Badge status={selectedResident.statusKependudukan} /></div>
              </div>
              <div>
                <span className="text-slate-400">No. Kartu Keluarga:</span>
                <p className="font-mono font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{selectedResident.noKK}</p>
              </div>
              <div>
                <span className="text-slate-400">Status Domisili:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{selectedResident.statusDomisili}</p>
              </div>
              <div>
                <span className="text-slate-400">Peran Keluarga:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{selectedResident.familyRole}</p>
              </div>
              <div>
                <span className="text-slate-400">Pekerjaan:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{selectedResident.job}</p>
              </div>
              <div>
                <span className="text-slate-400">Kontak:</span>
                <p className="font-mono font-semibold text-brand-700 dark:text-brand-400 mt-0.5">{selectedResident.phone}</p>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400">Alamat Lengkap:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {selectedResident.address}, {selectedResident.rt} / {selectedResident.rw}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirmation Dialog: Hapus Warga */}
      <ConfirmDialog
        isOpen={!!deletingResident}
        onClose={() => setDeletingResident(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Data Warga"
        message={`Apakah Anda yakin ingin menghapus data warga an. ${deletingResident?.name} (NIK: ${deletingResident?.nik}) dari database RT? Data yang dihapus tidak dapat dipulihkan.`}
        confirmLabel="Ya, Hapus Data Warga"
      />
    </div>
  );
}
