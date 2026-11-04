import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, UserCheck, LogOut } from 'lucide-react';
import { MOCK_USERS } from '../../data/mockData';

export function DemoRoleBar({ onLogout }) {
  const { activeRole, switchRole } = useApp();

  return (
    <div className="h-10 bg-slate-900 text-slate-100 text-xs border-b border-slate-800 z-50 sticky top-0 shadow-xs shrink-0 select-none">
      <div className="h-full px-3 sm:px-6 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        {/* Left Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex items-center gap-1.5 font-bold text-brand-300 bg-brand-950 px-2 py-0.5 rounded border border-brand-800/80 text-[11px]">
            <Shield className="w-3.5 h-3.5 text-brand-400" />
            <span>Phase 1 Demo</span>
          </span>
          <span className="hidden xl:inline text-slate-400 text-[11px]">
            Pilih simulasi peran:
          </span>
        </div>

        {/* Roles Quick Switcher & Logout Button */}
        <div className="flex items-center gap-1.5 shrink-0">
          {MOCK_USERS.map((user) => {
            const isActive = activeRole === user.role;
            return (
              <button
                key={user.role}
                type="button"
                onClick={() => switchRole(user.role)}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 text-[11px] font-medium whitespace-nowrap ${
                  isActive
                    ? 'bg-brand-600 text-white font-bold shadow-xs ring-1 ring-brand-400'
                    : 'bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white'
                }`}
                title={`${user.name} — ${user.roleLabel} (${user.region})`}
              >
                {isActive && <UserCheck className="w-3 h-3 text-brand-200" />}
                <span>{user.roleLabel}</span>
              </button>
            );
          })}

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="ml-1 px-2.5 py-1 rounded-lg text-rose-300 hover:text-white bg-rose-950/70 hover:bg-rose-900 border border-rose-800/60 font-medium flex items-center gap-1.5 text-[11px] whitespace-nowrap transition-colors"
              title="Keluar dari akun dan buka halaman login"
            >
              <LogOut className="w-3 h-3 text-rose-400" />
              <span>Halaman Login</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
