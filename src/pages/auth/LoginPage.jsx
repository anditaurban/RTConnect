import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_USERS } from '../../data/mockData';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card, CardBody } from '../../components/common/Card';
import { ShieldCheck, LogIn, KeyRound, Mail, Sparkles, Moon, Sun } from 'lucide-react';

export function LoginPage({ onLoginSuccess, onForgotPassword }) {
  const { switchRole, showToast, theme, toggleTheme } = useApp();
  const [email, setEmail] = useState('warga@rtconnect.id');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Mohon lengkapi email dan kata sandi.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const matched = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (matched) {
        switchRole(matched.role);
        showToast('success', `Selamat datang kembali, ${matched.name}!`);
        onLoginSuccess();
      } else {
        // Fallback or default to warga
        switchRole('warga');
        showToast('success', 'Berhasil masuk.');
        onLoginSuccess();
      }
      setLoading(false);
    }, 400);
  };

  const handleQuickLogin = (user) => {
    setEmail(user.email);
    setPassword('demo-pass-2026');
    switchRole(user.role);
    showToast('info', `Login sebagai ${user.name} (${user.roleLabel})`);
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative transition-colors duration-200">
      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 shadow-sm transition-colors"
          title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md font-bold text-xl">
          RT
        </div>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          RTConnect
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Sistem Pengelolaan Administrasi Lingkungan RT/RW Modern
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="shadow-lg border-slate-200 dark:border-slate-800">
          <CardBody className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 font-medium">
                  {error}
                </div>
              )}

              <Input
                label="Email atau Nomor Telepon"
                type="email"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                required
              />

              <Input
                label="Kata Sandi"
                type="password"
                icon={KeyRound}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded text-brand-600 focus:ring-brand-500 border-slate-300 dark:border-slate-600 dark:bg-slate-800"
                  />
                  <span>Ingat saya</span>
                </label>
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300"
                >
                  Lupa kata sandi?
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                loading={loading}
                icon={LogIn}
                className="w-full mt-2"
              >
                Masuk ke Aplikasi
              </Button>
            </form>

            {/* Quick Demo Access Buttons */}
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                <span>Uji Coba Cepat (Akun Demo):</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {MOCK_USERS.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleQuickLogin(user)}
                    className="p-2 text-left rounded-lg border border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-600 hover:bg-brand-50/50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <p className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] truncate">{user.roleLabel}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user.name}</p>
                  </button>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-6">
          © 2026 RTConnect — RW 05 Melati Asri. Hak cipta dilindungi.
        </p>
      </div>
    </div>
  );
}
