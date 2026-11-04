import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardBody, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, Textarea } from '../../components/common/Input';
import {
  Settings,
  Building,
  CreditCard,
  FileText,
  Save,
  CheckCircle2,
  Moon,
  Sun,
  Palette,
} from 'lucide-react';

export function PengaturanPengurus() {
  const { regionSettings, updateRegionSettings, showToast, theme, toggleTheme, currentUser } = useApp();

  const [rwName, setRwName] = useState(regionSettings.rwName);
  const [subdistrict, setSubdistrict] = useState(regionSettings.subdistrict);
  const [district, setDistrict] = useState(regionSettings.district);
  const [city, setCity] = useState(regionSettings.city);
  const [contactCenter, setContactCenter] = useState(regionSettings.contactCenter);

  // Bank Account
  const [bankName, setBankName] = useState(regionSettings.bankAccount.bankName);
  const [accountNumber, setAccountNumber] = useState(regionSettings.bankAccount.accountNumber);
  const [accountHolder, setAccountHolder] = useState(regionSettings.bankAccount.accountHolder);

  // Letter Header
  const [govHeader, setGovHeader] = useState(regionSettings.letterHeader.government);
  const [distHeader, setDistHeader] = useState(regionSettings.letterHeader.district);
  const [neighHeader, setNeighHeader] = useState(regionSettings.letterHeader.neighborhood);
  const [addressHeader, setAddressHeader] = useState(regionSettings.letterHeader.address);

  const canManage = ['ketua_rw', 'ketua_rt', 'sekretaris'].includes(currentUser.role);

  const handleSave = (e) => {
    e.preventDefault();
    if (!canManage) {
      showToast('error', 'Hanya Ketua RT/RW dan Sekretaris yang berwenang mengubah konfigurasi wilayah.');
      return;
    }

    updateRegionSettings({
      rwName,
      subdistrict,
      district,
      city,
      contactCenter,
      bankAccount: {
        bankName,
        accountNumber,
        accountHolder,
      },
      letterHeader: {
        government: govHeader,
        district: distHeader,
        neighborhood: neighHeader,
        address: addressHeader,
      },
    });
    showToast('success', 'Pengaturan wilayah & rekening kas berhasil disimpan.');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Pengaturan Wilayah & Preferensi Sistem
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Konfigurasi nama wilayah RT/RW, rekening bank resmi penerimaan iuran, kop surat, dan mode tema tampilan.
        </p>
      </div>

      {/* Section 0: Preferensi Tampilan Mode Gelap / Terang */}
      <Card>
        <CardHeader
          title="Preferensi Tampilan Aplikasi (Theme)"
          subtitle="Pilih tema visual antarmuka sistem sesuai kenyamanan mata"
        />
        <CardBody className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {theme === 'dark' ? 'Mode Gelap (Dark Mode) Aktif' : 'Mode Terang (Light Mode) Aktif'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {theme === 'dark'
                    ? 'Tampilan bernuansa gelap mengurangi ketegangan mata di pencahayaan redup.'
                    : 'Tampilan standar bernuansa terang dengan kontras optimal.'}
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

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Data Wilayah */}
        <Card>
          <CardHeader
            title="Profil Lingkungan Rukun Warga / Rukun Tetangga"
            subtitle="Identitas legal domisili administrasi pemerintahan lokal"
          />
          <CardBody className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nama Rukun Warga (RW)"
                value={rwName}
                onChange={(e) => setRwName(e.target.value)}
                disabled={!canManage}
                required
              />
              <Input
                label="Nomor Kontak Sekretariat / Call Center"
                value={contactCenter}
                onChange={(e) => setContactCenter(e.target.value)}
                disabled={!canManage}
                required
              />
              <Input
                label="Kelurahan / Desa"
                value={subdistrict}
                onChange={(e) => setSubdistrict(e.target.value)}
                disabled={!canManage}
                required
              />
              <Input
                label="Kecamatan"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                disabled={!canManage}
                required
              />
              <Input
                label="Kota / Kabupaten"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={!canManage}
                required
              />
            </div>
          </CardBody>
        </Card>

        {/* Section 2: Rekening Kas RT */}
        <Card>
          <CardHeader
            title="Rekening Resmi Kas RT / RW"
            subtitle="Ditampilkan kepada warga saat melakukan konfirmasi pembayaran transfer"
          />
          <CardBody className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Nama Bank"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Bank Central Asia (BCA)"
                disabled={!canManage}
                required
              />
              <Input
                label="Nomor Rekening"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="8820-xxxx-xx"
                disabled={!canManage}
                required
              />
              <Input
                label="Atas Nama Pemilik Rekening"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                placeholder="KAS RT 01 RW 05"
                disabled={!canManage}
                required
              />
            </div>
          </CardBody>
        </Card>

        {/* Section 3: Format Kop Surat Resmi */}
        <Card>
          <CardHeader
            title="Format Kop Surat Resmi Administrasi"
            subtitle="Teks yang tercetak di bagian atas lembar surat pengantar warga"
          />
          <CardBody className="p-5 space-y-4">
            <Input
              label="Baris 1: Pemerintah Wilayah"
              value={govHeader}
              onChange={(e) => setGovHeader(e.target.value)}
              disabled={!canManage}
              required
            />
            <Input
              label="Baris 2: Kecamatan & Kelurahan"
              value={distHeader}
              onChange={(e) => setDistHeader(e.target.value)}
              disabled={!canManage}
              required
            />
            <Input
              label="Baris 3: Rukun Warga & Rukun Tetangga"
              value={neighHeader}
              onChange={(e) => setNeighHeader(e.target.value)}
              disabled={!canManage}
              required
            />
            <Textarea
              label="Baris 4: Alamat Sekretariat & Kontak"
              value={addressHeader}
              onChange={(e) => setAddressHeader(e.target.value)}
              rows={2}
              disabled={!canManage}
              required
            />
          </CardBody>
        </Card>

        {/* Submit Button */}
        {canManage && (
          <div className="flex justify-end">
            <Button type="submit" variant="primary" icon={Save} size="lg">
              Simpan Seluruh Pengaturan
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
