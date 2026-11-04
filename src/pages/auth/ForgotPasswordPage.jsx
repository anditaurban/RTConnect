import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card, CardBody } from '../../components/common/Card';
import { ArrowLeft, Mail, CheckCircle2, Moon, Sun } from 'lucide-react';

export function ForgotPasswordPage({ onBackToLogin }) {
  const { theme, toggleTheme } = useApp();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 400);
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
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Atur Ulang Kata Sandi
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Masukkan email atau kontak yang terdaftar untuk menerima instruksi pemulihan.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="shadow-lg border-slate-200 dark:border-slate-800">
          <CardBody className="p-6 sm:p-8">
            {submitted ? (
              <div className="text-center py-4 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">Instruksi Terkirim</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Jika email <strong className="text-slate-800 dark:text-slate-100">{email}</strong> terdaftar di sistem kami, tautan verifikasi telah dikirimkan.
                </p>
                <div className="pt-4">
                  <Button variant="outline" onClick={onBackToLogin} className="w-full">
                    Kembali ke Halaman Masuk
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email Terdaftar"
                  type="email"
                  icon={Mail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  required
                />
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  className="w-full"
                >
                  Kirim Instruksi Pemulihan
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  icon={ArrowLeft}
                  onClick={onBackToLogin}
                  className="w-full"
                >
                  Kembali ke Halaman Masuk
                </Button>
              </form>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
