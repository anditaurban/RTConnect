import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  FileText,
  Wallet,
  CreditCard,
  Megaphone,
  MessageSquareWarning,
  CalendarDays,
  PackageCheck,
  Settings,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Shield,
  FolderOpen,
  Folder,
} from 'lucide-react';

export function Sidebar({
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
}) {
  const { currentUser, letterRequests, duesBills, complaints } = useApp();

  const pendingLettersCount = letterRequests.filter(r => r.status === 'Diajukan').length;
  const pendingDuesCount = duesBills.filter(b => b.status === 'Menunggu Verifikasi').length;
  const activeComplaintsCount = complaints.filter(c => c.status === 'Baru' || c.status === 'Ditinjau').length;

  // Hierarchical node structure
  const navigationNodes = [
    {
      id: 'node-ringkasan',
      title: 'Ikhtisar',
      collapsible: false,
      items: [
        {
          id: 'dashboard',
          name: 'Dashboard Operasional',
          icon: LayoutDashboard,
          badge: null,
        },
      ],
    },
    {
      id: 'node-kependudukan',
      title: 'Pelayanan & Warga',
      collapsible: true,
      defaultOpen: true,
      items: [
        {
          id: 'warga-kk',
          name: 'Data Warga & KK',
          icon: Users,
          badge: null,
        },
        {
          id: 'surat',
          name: 'Administrasi Surat',
          icon: FileText,
          badge: pendingLettersCount > 0 ? pendingLettersCount : null,
          badgeColor: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
        },
        {
          id: 'aspirasi',
          name: 'Aspirasi & Keluhan',
          icon: MessageSquareWarning,
          badge: activeComplaintsCount > 0 ? activeComplaintsCount : null,
          badgeColor: 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300',
        },
      ],
    },
    {
      id: 'node-keuangan',
      title: 'Keuangan & Kas RT',
      collapsible: true,
      defaultOpen: true,
      items: [
        {
          id: 'keuangan',
          name: 'Buku Kas Lingkungan',
          icon: Wallet,
          badge: null,
        },
        {
          id: 'iuran',
          name: 'Iuran & Verifikasi Transfer',
          icon: CreditCard,
          badge: pendingDuesCount > 0 ? pendingDuesCount : null,
          badgeColor: 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300',
        },
      ],
    },
    {
      id: 'node-komunikasi',
      title: 'Publikasi & Agenda',
      collapsible: true,
      defaultOpen: true,
      items: [
        {
          id: 'pengumuman',
          name: 'Pengumuman Wilayah',
          icon: Megaphone,
          badge: null,
        },
        {
          id: 'agenda',
          name: 'Agenda Kegiatan',
          icon: CalendarDays,
          badge: null,
        },
      ],
    },
    {
      id: 'node-aset',
      title: 'Fasilitas & Konfigurasi',
      collapsible: true,
      defaultOpen: false,
      items: [
        {
          id: 'inventaris',
          name: 'Inventaris Sarana RT',
          icon: PackageCheck,
          badge: null,
        },
        {
          id: 'pengaturan',
          name: 'Pengaturan Wilayah',
          icon: Settings,
          badge: null,
        },
      ],
    },
  ];

  // State to track open/closed state of each collapsible node
  const [openNodes, setOpenNodes] = useState({
    'node-kependudukan': true,
    'node-keuangan': true,
    'node-komunikasi': true,
    'node-aset': true,
  });

  // Ensure node containing currentTab is automatically expanded
  useEffect(() => {
    navigationNodes.forEach((node) => {
      if (node.collapsible && node.items.some(item => item.id === currentTab)) {
        setOpenNodes(prev => ({ ...prev, [node.id]: true }));
      }
    });
  }, [currentTab]);

  const toggleNode = (nodeId) => {
    setOpenNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const handleToggleAll = (expand) => {
    const next = {};
    navigationNodes.forEach(node => {
      if (node.collapsible) next[node.id] = expand;
    });
    setOpenNodes(next);
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        className={`fixed top-10 bottom-0 left-0 z-40 bg-white dark:bg-slate-900 border-r border-slate-200/90 dark:border-slate-800 flex flex-col transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'} w-72`}
      >
        {/* Sidebar Header Brand */}
        <div className="h-16 px-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-xs font-bold text-sm shrink-0">
              RT
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 dark:text-slate-100 tracking-tight text-sm">
                    RTConnect
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                    SaaS
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {currentUser.role === 'ketua_rw' ? 'RW 05 Melati Asri' : 'RT 01 / RW 05'}
                </p>
              </div>
            )}
          </div>

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Scope Capsule (when expanded) */}
        {!isCollapsed ? (
          <div className="p-3 mx-3 mt-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/80 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Akses Pengurus</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 truncate">{currentUser.name}</p>
            <p className="text-[11px] text-brand-600 dark:text-brand-400 font-medium truncate">{currentUser.roleLabel}</p>
          </div>
        ) : (
          <div className="p-2 mx-auto mt-3 shrink-0" title={`${currentUser.name} (${currentUser.roleLabel})`}>
            <div className="w-9 h-9 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 font-bold flex items-center justify-center text-xs">
              {currentUser.name.charAt(0)}
            </div>
          </div>
        )}

        {/* Node Collapse/Expand Quick Control (Desktop expanded only) */}
        {!isCollapsed && (
          <div className="px-4 pt-3 pb-1 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Menu Navigasi</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleToggleAll(true)}
                className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                title="Buka semua kategori"
              >
                Buka
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => handleToggleAll(false)}
                className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                title="Ciutkan semua kategori"
              >
                Ciutkan
              </button>
            </div>
          </div>
        )}

        {/* Navigation Nodes List */}
        <nav className="flex-1 px-3 py-2 space-y-3 overflow-y-auto overflow-x-hidden">
          {navigationNodes.map((node) => {
            const isOpenNode = openNodes[node.id] !== false;
            const nodeBadgeCount = node.items.reduce((sum, item) => sum + (Number(item.badge) || 0), 0);

            return (
              <div key={node.id} className="space-y-1">
                {/* Node Accordion Header */}
                {node.collapsible ? (
                  !isCollapsed ? (
                    <button
                      type="button"
                      onClick={() => toggleNode(node.id)}
                      className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        {isOpenNode ? (
                          <FolderOpen className="w-3.5 h-3.5 text-brand-500" />
                        ) : (
                          <Folder className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                        )}
                        <span className="tracking-wide">{node.title}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {!isOpenNode && nodeBadgeCount > 0 && (
                          <span className="w-2 h-2 rounded-full bg-rose-500" />
                        )}
                        {isOpenNode ? (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                        )}
                      </div>
                    </button>
                  ) : (
                    <div className="border-t border-slate-100 dark:border-slate-800 my-2 pt-1" />
                  )
                ) : (
                  !isCollapsed && (
                    <div className="px-2 py-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {node.title}
                    </div>
                  )
                )}

                {/* Node Child Items */}
                {(isOpenNode || !node.collapsible || isCollapsed) && (
                  <div className={`space-y-0.5 ${!isCollapsed && node.collapsible ? 'pl-2 border-l border-slate-100 dark:border-slate-800 ml-2.5 my-0.5' : ''}`}>
                    {node.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentTab === item.id;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            onSelectTab(item.id);
                            if (onClose) onClose();
                          }}
                          title={isCollapsed ? item.name : undefined}
                          className={`w-full flex items-center ${
                            isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
                          } rounded-xl text-xs font-medium transition-all group relative ${
                            isActive
                              ? 'bg-brand-600 text-white font-semibold shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon
                              className={`w-4 h-4 shrink-0 transition-colors ${
                                isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
                              }`}
                            />
                            {!isCollapsed && (
                              <span className="truncate">{item.name}</span>
                            )}
                          </div>

                          {!isCollapsed && item.badge && (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isActive ? 'bg-white/20 text-white' : item.badgeColor
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}

                          {/* Rail Tooltip on hover when collapsed */}
                          {isCollapsed && item.badge && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer: Desktop Collapse Toggle Button */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 shrink-0 hidden lg:block">
          <button
            type="button"
            onClick={onToggleCollapse}
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center' : 'justify-between'
            } px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors`}
            title={isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
          >
            <div className="flex items-center gap-2">
              {isCollapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              ) : (
                <PanelLeftClose className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              )}
              {!isCollapsed && <span>Ciutkan Sidebar</span>}
            </div>
            {!isCollapsed && (
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded">
                Ctrl+[
              </kbd>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
