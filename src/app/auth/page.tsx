'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  UserCheck,
  LogIn,
  UserPlus,
  KeyRound,
  CloudUpload,
  LogOut,
  ShieldCheck,
  Smartphone,
  Laptop,
  AlertCircle,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { useLearner } from '@/context/LearnerContext';
import {
  signIn,
  signUp,
  signOut,
  requestPasswordReset,
  deleteMyCloudData,
} from '@/lib/supabase/auth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function AuthAndSyncPage() {
  const {
    profile,
    authUser,
    isSupabaseActive,
    syncToCloud,
    resetAll,
  } = useLearner();

  const [tab, setTab] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    const res = await signIn({ email, password });
    setLoading(false);
    setFeedback({
      ok: res.ok,
      text: res.ok ? 'Berhasil masuk! Progres Anda siap disinkronkan.' : res.error,
    });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    const res = await signUp({ name, email, password });
    setLoading(false);
    setFeedback({
      ok: res.ok,
      text: res.ok ? res.message || 'Pendaftaran berhasil!' : res.error,
    });
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    const res = await requestPasswordReset(email);
    setLoading(false);
    setFeedback({
      ok: res.ok,
      text: res.ok ? res.message || 'Email terkirim.' : res.error,
    });
  };

  const handleSync = async () => {
    setLoading(true);
    const res = await syncToCloud();
    setLoading(false);
    setFeedback({ ok: res.ok, text: res.message });
  };

  const handleSignOut = async () => {
    setLoading(true);
    await signOut();
    setLoading(false);
    setFeedback({ ok: true, text: 'Anda telah keluar dari sesi Cloud. Data lokal tetap aman.' });
  };

  const handleDeleteCloud = async () => {
    if (!confirm('Hapus seluruh data progres Anda dari server Cloud Supabase?')) return;
    setLoading(true);
    const res = await deleteMyCloudData();
    setLoading(false);
    setFeedback({ ok: res.ok, text: res.ok ? res.message || 'Terhapus.' : res.error });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="brand">Akun & Sinkronisasi Lintas Perangkat</Badge>
          <Badge variant={isSupabaseActive ? 'success' : 'neutral'}>
            {isSupabaseActive ? 'Cloud Supabase Aktif' : 'Mode Penyimpanan Lokal'}
          </Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Masuk, Daftar & Sinkronisasi (Windows • Android • iOS)
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Simpan progres HSK, jadwal kartu SM-2, dan rekor menulis guratan Hanzi agar tersinkronisasi di laptop Windows, ponsel Android, maupun iPhone/iPad.
        </p>
      </div>

      {/* Multi-Platform Install Guide Card */}
      <Card className="p-5 bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white space-y-3">
        <div className="flex items-center gap-2 text-brand-300 text-xs font-bold uppercase tracking-wider">
          <Smartphone className="w-4 h-4" />
          <Laptop className="w-4 h-4" />
          <span>Dukungan Aplikasi Web Progresif (PWA) Lintas Platform</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-200">
          <div className="p-3 rounded-xl bg-white/10 border border-white/15">
            <strong className="text-white block mb-1">💻 Windows (Chrome / Edge):</strong>
            Klik ikon <em>Install MandarinPath</em> di bilah alamat kanan atas untuk memasang sebagai aplikasi desktop mandiri.
          </div>
          <div className="p-3 rounded-xl bg-white/10 border border-white/15">
            <strong className="text-white block mb-1">🤖 Android (Chrome):</strong>
            Ketuk menu titik tiga (⋮) → pilih <strong>Tambahkan ke Layar Utama / Install App</strong> untuk layar penuh seperti aplikasi native.
          </div>
          <div className="p-3 rounded-xl bg-white/10 border border-white/15">
            <strong className="text-white block mb-1">🍎 iOS / iPadOS (Safari):</strong>
            Ketuk tombol <strong>Bagikan (Share)</strong> di bawah → pilih <strong>Tambah ke Layar Utama (Add to Home Screen)</strong>.
          </div>
        </div>
      </Card>

      {feedback && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center gap-2.5 ${
            feedback.ok
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          {feedback.ok ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {authUser ? (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Masuk sebagai {authUser.email}</h3>
                <p className="text-xs text-slate-500">ID Pengguna: {authUser.id.slice(0, 12)}…</p>
              </div>
            </div>
            <Badge variant="success">Sesi Aktif</Badge>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
            <Button variant="primary" size="sm" onClick={handleSync} isLoading={loading}>
              <CloudUpload className="w-4 h-4 mr-1.5" /> Sinkronkan Progres ke Cloud Sekarang
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut} disabled={loading}>
              <LogOut className="w-4 h-4 mr-1.5" /> Keluar Akun
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteCloud} disabled={loading}>
              <Trash2 className="w-4 h-4 mr-1.5" /> Hapus Data Cloud Saya
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="p-6 space-y-5">
          {!isSupabaseActive && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Mode Demo Lokal Aktif (Tanpa Kredensial Supabase)</span>
              </div>
              <p>
                Seluruh progres belajar Anda otomatis tersimpan di penyimpanan perangkat ini dan dapat diekspor/diimpor melalui halaman{' '}
                <Link href="/analytics" className="underline font-bold">
                  Progres & Pengaturan
                </Link>
                . Untuk mengaktifkan login Cloud, isi <code>NEXT_PUBLIC_SUPABASE_URL</code> dan{' '}
                <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> pada <code>.env.local</code> atau Vercel Environment Variables.
              </p>
            </div>
          )}

          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <button
              type="button"
              onClick={() => setTab('signin')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                tab === 'signin'
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" /> Masuk
            </button>
            <button
              type="button"
              onClick={() => setTab('signup')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                tab === 'signup'
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" /> Daftar Akun Baru
            </button>
            <button
              type="button"
              onClick={() => setTab('reset')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                tab === 'reset'
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" /> Lupa Kata Sandi
            </button>
          </div>

          {tab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1" htmlFor="signin-email">
                  Alamat Email
                </label>
                <input
                  id="signin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1" htmlFor="signin-password">
                  Kata Sandi
                </label>
                <input
                  id="signin-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                />
              </div>
              <Button type="submit" variant="primary" size="md" isLoading={loading}>
                Masuk ke MandarinPath
              </Button>
            </form>
          )}

          {tab === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1" htmlFor="signup-name">
                  Nama Lengkap / Panggilan
                </label>
                <input
                  id="signup-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1" htmlFor="signup-email">
                  Alamat Email
                </label>
                <input
                  id="signup-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1" htmlFor="signup-password">
                  Kata Sandi Baru (Min. 8 karakter)
                </label>
                <input
                  id="signup-password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                />
              </div>
              <Button type="submit" variant="primary" size="md" isLoading={loading}>
                Buat Akun & Aktifkan Sinkronisasi
              </Button>
            </form>
          )}

          {tab === 'reset' && (
            <form onSubmit={handleReset} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1" htmlFor="reset-email">
                  Email Terdaftar
                </label>
                <input
                  id="reset-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                />
              </div>
              <Button type="submit" variant="primary" size="md" isLoading={loading}>
                Kirim Tautan Reset Kata Sandi
              </Button>
            </form>
          )}
        </Card>
      )}

      {/* Privacy & Data Ownership Notice */}
      <Card className="p-5 space-y-2 text-xs text-slate-600">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Kebijakan Privasi & Kendali Penuh Data Pembelajar</span>
        </div>
        <p className="leading-relaxed">
          Data pembelajaran Anda (riwayat SRS, latihan guratan, dan skor kuis) adalah milik Anda sepenuhnya. Dalam Mode Lokal, data tidak pernah meninggalkan perangkat Anda. Dalam Mode Cloud Supabase, kebijakan Row Level Security (RLS) memastikan hanya akun Anda yang dapat membaca, mengubah, atau menghapus data Anda. Anda dapat mengekspor seluruh data ke berkas JSON atau menghapusnya secara permanen kapan saja.
        </p>
      </Card>
    </div>
  );
}
