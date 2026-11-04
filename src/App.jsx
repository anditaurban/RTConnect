import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Shell } from './components/layout/Shell';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// Warga Pages
import { BerandaWarga } from './pages/warga/BerandaWarga';
import { SuratWarga } from './pages/warga/SuratWarga';
import { IuranWarga } from './pages/warga/IuranWarga';
import { PengumumanWarga } from './pages/warga/PengumumanWarga';
import { AspirasiWarga } from './pages/warga/AspirasiWarga';
import { ProfilWarga } from './pages/warga/ProfilWarga';

// Pengurus Pages
import { DashboardPengurus } from './pages/pengurus/DashboardPengurus';
import { WargaPengurus } from './pages/pengurus/WargaPengurus';
import { SuratPengurus } from './pages/pengurus/SuratPengurus';
import { KeuanganPengurus } from './pages/pengurus/KeuanganPengurus';
import { IuranPengurus } from './pages/pengurus/IuranPengurus';
import { PengumumanPengurus } from './pages/pengurus/PengumumanPengurus';
import { AspirasiPengurus } from './pages/pengurus/AspirasiPengurus';
import { AgendaPengurus } from './pages/pengurus/AgendaPengurus';
import { InventarisPengurus } from './pages/pengurus/InventarisPengurus';
import { PengaturanPengurus } from './pages/pengurus/PengaturanPengurus';

// Error Pages
import { Forbidden403 } from './pages/errors/Forbidden403';
import { NotFound404 } from './pages/errors/NotFound404';

export function App() {
  const { activeRole, currentUser } = useApp();

  // Auth flow states
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default true for demo convenience
  const [authView, setAuthView] = useState('login'); // login or forgot

  // Tab navigation states
  const [wargaTab, setWargaTab] = useState('beranda');
  const [pengurusTab, setPengurusTab] = useState('dashboard');

  // If user is logged out, show auth views
  if (!isAuthenticated) {
    if (authView === 'forgot') {
      return <ForgotPasswordPage onBackToLogin={() => setAuthView('login')} />;
    }
    return (
      <LoginPage
        onLoginSuccess={() => setIsAuthenticated(true)}
        onForgotPassword={() => setAuthView('forgot')}
      />
    );
  }

  const isWarga = activeRole === 'warga';

  // Title mapper
  const getPageTitle = () => {
    if (isWarga) {
      switch (wargaTab) {
        case 'beranda': return 'Beranda Warga';
        case 'surat': return 'Layanan Administrasi Surat';
        case 'iuran': return 'Iuran & Tagihan Lingkungan';
        case 'pengumuman': return 'Warta & Agenda Kegiatan';
        case 'aspirasi': return 'Aspirasi & Lapor Keluhan';
        case 'profil': return 'Profil Warga & Kartu Keluarga';
        default: return 'Portal Warga';
      }
    } else {
      switch (pengurusTab) {
        case 'dashboard': return `Dashboard ${currentUser.roleLabel}`;
        case 'warga-kk': return 'Data Kependudukan (Warga & KK)';
        case 'surat': return 'Administrasi & Antrean Surat';
        case 'keuangan': return 'Buku Kas & Saldo Lingkungan';
        case 'iuran': return 'Iuran & Verifikasi Pembayaran';
        case 'pengumuman': return 'Pengelolaan Pengumuman';
        case 'aspirasi': return 'Antrean Aspirasi & Keluhan';
        case 'agenda': return 'Agenda & Kegiatan Wilayah';
        case 'inventaris': return 'Inventaris Sarana Lingkungan';
        case 'pengaturan': return 'Pengaturan Wilayah & Akun';
        default: return 'Portal Pengurus RT/RW';
      }
    }
  };

  // Render active content
  const renderContent = () => {
    if (isWarga) {
      switch (wargaTab) {
        case 'beranda':
          return <BerandaWarga onNavigateTab={(tab) => setWargaTab(tab)} />;
        case 'surat':
          return <SuratWarga />;
        case 'iuran':
          return <IuranWarga />;
        case 'pengumuman':
          return <PengumumanWarga />;
        case 'aspirasi':
          return <AspirasiWarga />;
        case 'profil':
          return <ProfilWarga />;
        default:
          return <NotFound404 onBack={() => setWargaTab('beranda')} />;
      }
    } else {
      switch (pengurusTab) {
        case 'dashboard':
          return <DashboardPengurus onNavigateTab={(tab) => setPengurusTab(tab)} />;
        case 'warga-kk':
          return <WargaPengurus />;
        case 'surat':
          return <SuratPengurus />;
        case 'keuangan':
          return <KeuanganPengurus />;
        case 'iuran':
          return <IuranPengurus />;
        case 'pengumuman':
          return <PengumumanPengurus />;
        case 'aspirasi':
          return <AspirasiPengurus />;
        case 'agenda':
          return <AgendaPengurus />;
        case 'inventaris':
          return <InventarisPengurus />;
        case 'pengaturan':
          return <PengaturanPengurus />;
        default:
          return <NotFound404 onBack={() => setPengurusTab('dashboard')} />;
      }
    }
  };

  return (
    <Shell
      currentTab={isWarga ? wargaTab : pengurusTab}
      onSelectTab={isWarga ? setWargaTab : setPengurusTab}
      activePageTitle={getPageTitle()}
      onLogout={() => setIsAuthenticated(false)}
    >
      {renderContent()}
    </Shell>
  );
}

export default App;

