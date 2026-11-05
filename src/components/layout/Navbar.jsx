import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  ChevronRight,
  ShieldCheck,
  CheckCheck,
  FileText,
  CreditCard,
  X,
  User,
  LogOut,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';

export function Navbar({
  onToggleMobileSidebar,
  onToggleDesktopCollapse,
  isDesktopCollapsed,
  isWarga,
  currentTab,
  activePageTitle,
  onSelectTab,
  onLogout,
}) {
  const { currentUser, regionSettings, letterRequests, duesBills, theme, toggleTheme } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Notification items
  const pendingLetters = letterRequests.filter(r => r.status === 'Diajukan');
  const pendingDues = duesBills.filter(b => b.status === 'Menunggu Verifikasi');
  const totalUnread = pendingLetters.length + pendingDues.length;

  return (
    <header className="sticky top-0 z-30 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Side: Sidebar Toggles & Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile drawer toggle */}
          {!isWarga && onToggleMobileSidebar && (
            <button
              type="button"
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Buka navigasi mobile"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Desktop collapse rail toggle */}
          {!isWarga && onToggleDesktopCollapse && (
            <button
              type="button"
              onClick={onToggleDesktopCollapse}
              className="hidden lg:flex p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label={isDesktopCollapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
              title={isDesktopCollapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
            >
              {isDesktopCollapsed ? (
                <PanelLeftOpen className="w-5 h-5" />
              ) : (
                <PanelLeftClose className="w-5 h-5" />
              )}
            </button>
          )}

          {/* Contextual Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 min-w-0">
            <span className="font-bold text-slate-800 dark:text-slate-200 tracking-tight shrink-0 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-600" />
              <span>RTConnect</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px] shrink-0">
              {currentUser.role === 'ketua_rw' ? 'RW 05' : 'RT 01'}
            </span>
            {activePageTitle && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0 hidden sm:block" />
                <span className="font-semibold text-slate-900 dark:text-slate-100 truncate hidden sm:block">
                  {activePageTitle}
                </span>
              </>
            )}
          </nav>
        </div>

        {/* Center / Search Bar (Desktop) */}
        <div className="hidden md:flex items-center flex-1 max-w-xs mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari warga, nomor surat, iuran..."
              className="w-full pl-9 pr-12 py-1.5 text-xs bg-slate-50/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900 transition-all outline-none"
            />
            <kbd className="absolute right-2.5 top-2 px-1.5 py-0.5 text-[9px] font-mono text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-2xs pointer-events-none">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right Side: Theme Toggle, Notifications, User Info & Logout */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Theme Toggle (Light / Dark Mode) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
            title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>

          {/* Notification Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Lihat notifikasi"
            >
              <Bell className="w-5 h-5" />
              {totalUnread > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-850 dark:bg-slate-800 shadow-xl border border-slate-200/90 dark:border-slate-700 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">Tugas & Antrean Perlu Tindakan</h4>
                    <span className="text-xs bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold px-2 py-0.5 rounded-full">
                      {totalUnread} item
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                  {pendingLetters.map((l) => (
                    <div
                      key={l.id}
                      onClick={() => {
                        if (onSelectTab) onSelectTab('surat');
                        setShowNotifications(false);
                      }}
                      className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 hover:border-blue-200 dark:hover:border-blue-800 cursor-pointer transition-colors flex items-start gap-3"
                    >
                      <div className="p-1.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg shrink-0 mt-0.5">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="text-xs flex-1">
                        <p className="font-bold text-slate-800 dark:text-slate-200">{l.letterName}</p>
                        <p className="text-slate-600 dark:text-slate-400 mt-0.5">{l.residentName} ({l.rt})</p>
                        <p className="text-[10px] text-slate-400 mt-1">Ref: {l.referenceNo}</p>
                      </div>
                    </div>
                  ))}

                  {pendingDues.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => {
                        if (onSelectTab) onSelectTab('iuran');
                        setShowNotifications(false);
                      }}
                      className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900 hover:border-amber-200 dark:hover:border-amber-800 cursor-pointer transition-colors flex items-start gap-3"
                    >
                      <div className="p-1.5 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-lg shrink-0 mt-0.5">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div className="text-xs flex-1">
                        <p className="font-bold text-slate-800 dark:text-slate-200">Verifikasi Iuran Masuk</p>
                        <p className="text-slate-600 dark:text-slate-400 mt-0.5">{b.residentName} ({b.duesName})</p>
                        <p className="text-[10px] font-bold text-slate-900 dark:text-slate-100 mt-1">Rp {b.amount.toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                  ))}

                  {totalUnread === 0 && (
                    <div className="text-center py-8 text-xs text-slate-400 dark:text-slate-500">
                      <CheckCheck className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-1.5" />
                      Semua antrean telah diproses.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200 dark:border-slate-800">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-200 dark:ring-brand-800 shrink-0"
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                {currentUser.name}
              </p>
              <p className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold leading-tight">
                {currentUser.roleLabel}
              </p>
            </div>

            {/* Logout Action Button */}
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="ml-1 p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors flex items-center gap-1.5"
                title="Keluar dari akun dan kembali ke halaman Login"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:inline text-xs font-semibold text-rose-600 dark:text-rose-400">Keluar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
