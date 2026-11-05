import React from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardBody, CardHeader } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  User,
  Users,
  Shield,
  MapPin,
  Phone,
  Home,
  CheckCircle2,
  Lock,
  Moon,
  Sun,
} from 'lucide-react';

export function ProfilWarga() {
  const { currentUser, residents, families, theme, toggleTheme } = useApp();

  const currentResident = residents.find(r => r.nik === currentUser?.nik || r.id === currentUser?.residentId) || {
    name: currentUser?.name || 'Warga',
    nik: currentUser?.nik || '-',
    noKK: currentUser?.noKK || '-',
    statusKependudukan: 'Aktif',
    statusDomisili: 'Tetap',
    address: currentUser?.region || 'RT 01 / RW 05',
    rt: 'RT 01',
    rw: 'RW 05',
    phone: currentUser?.phone || '-',
    gender: 'Laki-laki',
    birthPlace: 'Jakarta',
    birthDate: '1990-01-01',
    job: 'Karyawan',
    religion: 'Islam',
    familyRole: 'Kepala Keluarga',
  };
  const myFamily = families.find(f => f.noKK === currentResident.noKK) || null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Profil Warga & Data Keluarga
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Informasi identitas kependudukan terdaftar dalam administrasi RT 01 / RW 05.
        </p>
      </div>

      {/* Main Profile Card */}
      <Card>
        <CardBody className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-slate-100 dark:border-slate-800">
            <img
              src={currentUser.avatar}
              alt={currentResident.name}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-brand-100 dark:ring-brand-900"
            />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{currentResident.name}</h2>
                <Badge status={currentResident.statusKependudukan} />
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                  Domisili {currentResident.statusDomisili}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentResident.address}, {currentResident.rt} / {currentResident.rw}</span>
              </p>
            </div>
          </div>

          {/* Identity Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 dark:text-slate-500 font-medium">Nomor Induk Kependudukan (NIK)</span>
              <p className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm tracking-wide">
                {currentResident.nik}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 dark:text-slate-500 font-medium">Nomor Kartu Keluarga (KK)</span>
              <p className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm tracking-wide">
                {currentResident.noKK}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 dark:text-slate-500 font-medium">Status dalam Keluarga</span>
              <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{currentResident.familyRole}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 dark:text-slate-500 font-medium">Pekerjaan</span>
              <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{currentResident.job}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 dark:text-slate-500 font-medium">Tempat, Tanggal Lahir</span>
              <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                {currentResident.birthPlace}, {currentResident.birthDate}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 dark:text-slate-500 font-medium">Nomor Kontak / WhatsApp</span>
              <p className="font-bold text-brand-700 dark:text-brand-400 text-sm font-mono">{currentResident.phone}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Kartu Keluarga Members Card */}
      <Card>
        <CardHeader
          title="Anggota Keluarga Terdaftar (KK)"
          subtitle={`No. KK: ${currentResident.noKK} — Kepala Keluarga: ${myFamily?.headName || currentResident.name}`}
        />
        <CardBody className="p-0">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {myFamily?.members && myFamily.members.length > 0 ? (
              myFamily.members.map((member, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold flex items-center justify-center text-xs">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-800 dark:text-slate-200">{member}</p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">Terverifikasi di database kependudukan RT</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-800">
                    Aktif
                  </span>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 dark:text-slate-500">
                Data Kartu Keluarga tercatat resmi di database kependudukan wilayah.
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Theme Preferences Card */}
      <Card>
        <CardHeader
          title="Pengaturan Tampilan Aplikasi (Theme)"
          subtitle="Pilih tema tampilan yang nyaman untuk mata Anda"
        />
        <CardBody className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {theme === 'dark' ? 'Mode Gelap Aktif' : 'Mode Terang Aktif'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {theme === 'dark'
                    ? 'Tampilan gelap membantu menghemat daya dan lebih nyaman di malam hari.'
                    : 'Tampilan terang memberikan kejelasan teks maksimal di siang hari.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant={theme === 'light' ? 'primary' : 'outline'}
                icon={Sun}
                onClick={() => {
                  if (theme !== 'light') toggleTheme();
                }}
              >
                Terang
              </Button>
              <Button
                type="button"
                size="sm"
                variant={theme === 'dark' ? 'primary' : 'outline'}
                icon={Moon}
                onClick={() => {
                  if (theme !== 'dark') toggleTheme();
                }}
              >
                Gelap
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Data Security & Privacy Banner */}
      <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900 flex items-start gap-3 text-xs text-blue-900 dark:text-blue-300">
        <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <p className="font-bold">Keamanan Data Pribadi Warga Terjamin</p>
          <p className="text-blue-800/90 dark:text-blue-300/90 mt-0.5">
            Nomor NIK, KK, dan dokumen administrasi Anda diproteksi dengan enkripsi dan hanya dapat diakses oleh petugas yang berwenang untuk keperluan verifikasi surat dan iuran.
          </p>
        </div>
      </div>
    </div>
  );
}
