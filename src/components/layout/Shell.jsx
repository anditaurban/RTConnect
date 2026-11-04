import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { DemoRoleBar } from './DemoRoleBar';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { Toast } from '../common/Toast';
import {
  Home,
  FileText,
  CreditCard,
  Megaphone,
  MessageSquareWarning,
  User,
} from 'lucide-react';

export function Shell({
  children,
  currentTab,
  onSelectTab,
  activePageTitle,
  onLogout,
}) {
  const { activeRole } = useApp();
  const isWarga = activeRole === 'warga';

  // Desktop sidebar collapse state & mobile drawer state
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Keyboard shortcut listener: Ctrl + [ to toggle sidebar rail
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '[') {
        e.preventDefault();
        setIsDesktopCollapsed(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Warga secondary tab navigation
  const wargaNavTabs = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'surat', label: 'Layanan Surat', icon: FileText },
    { id: 'iuran', label: 'Iuran & Tagihan', icon: CreditCard },
    { id: 'pengumuman', label: 'Pengumuman & Agenda', icon: Megaphone },
    { id: 'aspirasi', label: 'Aspirasi & Keluhan', icon: MessageSquareWarning },
    { id: 'profil', label: 'Profil Saya', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans antialiased text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* 1. Global Demo Role Bar (Sticky top-0, h-10) */}
      <DemoRoleBar onLogout={onLogout} />

      <div className="flex-1 flex min-h-[calc(100vh-40px)]">
        {/* 2. Pengurus Sidebar with Collapsible Nodes & Rail Mode */}
        {!isWarga && (
          <Sidebar
            currentTab={currentTab}
            onSelectTab={onSelectTab}
            isOpen={mobileSidebarOpen}
            onClose={() => setMobileSidebarOpen(false)}
            isCollapsed={isDesktopCollapsed}
            onToggleCollapse={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
          />
        )}

        {/* 3. Main Content Wrapper */}
        <div
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
            !isWarga ? (isDesktopCollapsed ? 'lg:pl-20' : 'lg:pl-64') : ''
          }`}
        >
          {/* Top Navbar */}
          <Navbar
            onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
            onToggleDesktopCollapse={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
            isDesktopCollapsed={isDesktopCollapsed}
            isWarga={isWarga}
            currentTab={currentTab}
            activePageTitle={activePageTitle}
            onSelectTab={onSelectTab}
            onLogout={onLogout}
          />

          {/* Warga Desktop Secondary Navigation Tab Bar */}
          {isWarga && (
            <div className="hidden sm:block bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800 shadow-2xs transition-colors">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex space-x-2 py-2 overflow-x-auto">
                  {wargaNavTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = currentTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => onSelectTab(tab.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 font-bold border border-brand-200 dark:border-brand-800 shadow-2xs'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Page Content Body */}
          <main className={`flex-1 ${isWarga ? 'pb-20 sm:pb-8' : 'pb-10'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* 4. Mobile Bottom Navigation for Warga */}
      {isWarga && (
        <BottomNav currentTab={currentTab} onSelectTab={onSelectTab} />
      )}

      {/* 5. Global Toast Floating Container */}
      <Toast />
    </div>
  );
}
