import React from 'react';
import {
  Home,
  FileText,
  CreditCard,
  Megaphone,
  MessageSquareWarning,
  User,
} from 'lucide-react';

export function BottomNav({ currentTab, onSelectTab }) {
  const tabs = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'surat', label: 'Surat', icon: FileText },
    { id: 'iuran', label: 'Iuran', icon: CreditCard },
    { id: 'pengumuman', label: 'Warta', icon: Megaphone },
    { id: 'aspirasi', label: 'Lapor', icon: MessageSquareWarning },
    { id: 'profil', label: 'Profil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 shadow-lg sm:hidden transition-colors">
      <div className="grid grid-cols-6 h-16 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center transition-colors ${
                isActive ? 'text-brand-600 dark:text-brand-400 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-brand-50 dark:bg-brand-950/60' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span className="text-[10px] mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
