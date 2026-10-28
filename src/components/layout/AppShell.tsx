'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Layers,
  BookOpen,
  Headphones,
  FileText,
  CheckSquare,
  BarChart3,
  Menu,
  X,
  Flame,
  Target,
  Sparkles,
  Compass,
  PenTool,
  Music,
  UserCheck,
  Smartphone,
} from 'lucide-react';
import { useLearner } from '@/context/LearnerContext';
import { Badge } from '@/components/ui/Badge';

const NAV_ITEMS = [
  { href: '/', label: 'Beranda Belajar', shortLabel: 'Beranda', icon: Home },
  { href: '/vocabulary', label: 'Kamus HSK 1–6 & SRS', shortLabel: 'Kamus', icon: Layers },
  { href: '/writing', label: 'Lab Menulis Guratan', shortLabel: 'Tulis', icon: PenTool },
  { href: '/tones', label: 'Lab Nada & Pinyin', shortLabel: 'Nada', icon: Music },
  { href: '/curriculum', label: 'Jalur Kurikulum HSK', shortLabel: 'Materi', icon: BookOpen },
  { href: '/listening', label: 'Lab Mendengarkan', shortLabel: 'Audio', icon: Headphones },
  { href: '/grammar', label: 'Tata Bahasa & Kalimat', shortLabel: 'Kalimat', icon: FileText },
  { href: '/quiz', label: 'Kuis & Simulasi Ujian', shortLabel: 'Ujian', icon: CheckSquare },
  { href: '/diagnostic', label: 'Penilaian Diagnostik', shortLabel: 'Tes Awal', icon: Compass },
  { href: '/analytics', label: 'Progres & Pengaturan', shortLabel: 'Progres', icon: BarChart3 },
  { href: '/auth', label: 'Akun & Sinkronisasi', shortLabel: 'Akun', icon: UserCheck },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { profile, dailyGoalStatus, dueCards, strokeRecords, authUser, isSupabaseActive } =
    useLearner();

  const practicedStrokesCount = Object.keys(strokeRecords).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label="Buka menu navigasi"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-900 via-brand-700 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-105 transition-transform font-hanzi">
                道
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-brand-700 transition-colors">
                    MandarinPath
                  </span>
                  <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200 font-hanzi">
                    汉语之路
                  </span>
                </div>
                <span className="hidden md:block text-[10px] text-slate-400 font-medium -mt-0.5">
                  HSK 1–6 Complete • By @skuvis_
                </span>
              </div>
            </Link>
          </div>

          {/* Quick Header Indicators */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak Counter */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-700 text-xs font-semibold"
              title={`Rentetan Belajar: ${profile.study_streak} Hari Berturut-turut`}
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{profile.study_streak}h</span>
            </div>

            {/* Target Level */}
            <Link
              href="/analytics"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold hover:bg-brand-100 transition-colors"
              title={`Target Ujian: ${profile.target_exam_level}`}
            >
              <Target className="w-3.5 h-3.5 text-brand-600" />
              <span>Target: {profile.target_exam_level}</span>
            </Link>

            {/* Daily Goal Quick Badge */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium"
              title={`Target Harian: ${dailyGoalStatus.minutesStudiedToday}/${dailyGoalStatus.targetMinutes} Menit (${dailyGoalStatus.percentCompleted}%)`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  dailyGoalStatus.isGoalAchieved ? 'bg-emerald-500' : 'bg-brand-500'
                }`}
              />
              <span className="font-semibold">
                {dailyGoalStatus.minutesStudiedToday}/{dailyGoalStatus.targetMinutes}m
              </span>
            </div>

            {/* Auth / Storage Mode Link */}
            <Link href="/auth" className="hidden sm:inline-flex">
              <Badge variant={authUser ? 'success' : isSupabaseActive ? 'brand' : 'neutral'} size="sm">
                {authUser ? 'Cloud Aktif' : isSupabaseActive ? 'Masuk Cloud' : 'Mode Lokal'}
              </Badge>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-7">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:block w-64 shrink-0">
          <nav className="sticky top-22 space-y-1 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Menu Utama & Akselerator
            </div>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== '/' && pathname?.startsWith(item.href));
              const isVocab = item.href === '/vocabulary';
              const isWriting = item.href === '/writing';
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isVocab && dueCards.length > 0 && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-white text-brand-700' : 'bg-rose-100 text-rose-700'
                      }`}
                      title={`${dueCards.length} kartu kosakata siap di-review hari ini`}
                    >
                      {dueCards.length}
                    </span>
                  )}
                  {isWriting && practicedStrokesCount > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {practicedStrokesCount}字
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Multi-device & Corpus Info Box */}
            <div className="mt-4 pt-3 border-t border-slate-100 px-2">
              <div className="p-3 bg-gradient-to-br from-brand-50/80 to-teal-50/60 rounded-xl border border-brand-100 space-y-1.5">
                <div className="flex items-center gap-1.5 text-brand-900 font-bold text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                  <span>Kamus Penuh HSK 1–6</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Mencakup <strong>4.991 kata HSK 2.0</strong> & <strong>10.969 kata HSK 3.0</strong>, kanvas tulis guratan, serta mode PWA untuk Windows, Android & iOS.
                </p>
                <div className="pt-1 text-[10px] font-bold text-brand-800">
                  Trademark @skuvis_
                </div>
              </div>
            </div>
          </nav>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="fixed inset-y-0 left-0 w-72 bg-white p-5 shadow-2xl flex flex-col justify-between overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-sm font-hanzi">
                      道
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block leading-none">
                        MandarinPath
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">@skuvis_</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                    aria-label="Tutup menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      pathname === item.href ||
                      (item.href !== '/' && pathname?.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                          isActive
                            ? 'bg-brand-600 text-white font-semibold'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.href === '/vocabulary' && dueCards.length > 0 && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-rose-100 text-rose-700">
                            {dueCards.length}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                <p className="font-semibold text-slate-700">
                  © MandarinPath • Trademark <span className="text-brand-700 font-bold">@skuvis_</span>
                </p>
                <p>Kompatibel: Windows Web • Android • iOS</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area + Footer */}
        <div className="flex-1 min-w-0 flex flex-col justify-between pb-20 lg:pb-4">
          <main className="flex-1">{children}</main>

          {/* Persistent Brand & Trademark Footer */}
          <footer className="mt-14 pt-6 border-t border-slate-200/90 text-xs text-slate-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-slate-900">MandarinPath (汉语之路)</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900 text-white font-mono text-[11px] font-bold">
                    ™ @skuvis_
                  </span>
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-600 font-medium">
                    Full HSK 1–6 (4.991 Kata) & HSK 3.0 (10.969 Kata)
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Dirancang untuk pembelajar bahasa Mandarin Indonesia di Windows Web, Android, dan iOS. Hak cipta & merek dagang{' '}
                  <strong className="text-slate-700">@skuvis_</strong>.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-600">
                <Link href="/vocabulary" className="hover:text-brand-600">
                  Kamus HSK 1–6
                </Link>
                <Link href="/writing" className="hover:text-brand-600">
                  Tulis Guratan
                </Link>
                <Link href="/tones" className="hover:text-brand-600">
                  Lab Nada
                </Link>
                <Link href="/auth" className="hover:text-brand-600 flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5" /> Pasang Aplikasi / Sinkron
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Mobile Sticky Bottom Nav (Android & iOS Safe Area Friendly) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 py-1.5 px-2 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-around">
          {[NAV_ITEMS[0], NAV_ITEMS[1], NAV_ITEMS[2], NAV_ITEMS[3], NAV_ITEMS[4], NAV_ITEMS[7]].map(
            (item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== '/' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
                    isActive ? 'text-brand-600 font-bold bg-brand-50/70' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 mb-0.5" />
                  <span className="truncate max-w-[58px]">{item.shortLabel}</span>
                </Link>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}
