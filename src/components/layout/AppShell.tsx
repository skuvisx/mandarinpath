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
  Info,
  Compass
} from 'lucide-react';
import { useLearner } from '@/context/LearnerContext';
import { Badge } from '@/components/ui/Badge';

const NAV_ITEMS = [
  { href: '/', label: 'Beranda Belajar', icon: Home },
  { href: '/diagnostic', label: 'Penilaian Diagnostik', icon: Compass },
  { href: '/vocabulary', label: 'Kamus & Kartu SRS', icon: Layers },
  { href: '/curriculum', label: 'Jalur Kurikulum HSK', icon: BookOpen },
  { href: '/listening', label: 'Lab Mendengarkan', icon: Headphones },
  { href: '/grammar', label: 'Tata Bahasa & Kalimat', icon: FileText },
  { href: '/quiz', label: 'Kuis & Simulasi Ujian', icon: CheckSquare },
  { href: '/analytics', label: 'Progres & Pengaturan', icon: BarChart3 },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { profile, dailyGoalStatus, dueCards, isGuest, isSupabaseActive } = useLearner();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
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
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-teal-700 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
                道
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight text-slate-900 group-hover:text-brand-700 transition-colors">
                  MandarinPath
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                  汉语之路
                </span>
              </div>
            </Link>
          </div>

          {/* Quick Header Indicators */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Streak Counter */}
            <div 
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-700 text-xs font-semibold shadow-2xs"
              title={`Rentetan Belajar: ${profile.study_streak} Hari Berturut-turut`}
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
              <span>{profile.study_streak} Hari</span>
            </div>

            {/* Target Level */}
            <div 
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold"
              title={`Target Ujian: ${profile.target_exam_level}`}
            >
              <Target className="w-3.5 h-3.5 text-brand-600" />
              <span>Target: {profile.target_exam_level}</span>
            </div>

            {/* Daily Goal Quick Badge */}
            <div 
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium"
              title={`Target Harian: ${dailyGoalStatus.minutesStudiedToday}/${dailyGoalStatus.targetMinutes} Menit (${dailyGoalStatus.percentCompleted}%)`}
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="hidden xs:inline">Target:</span>
              <span className="font-semibold">{dailyGoalStatus.minutesStudiedToday}/{dailyGoalStatus.targetMinutes}m</span>
            </div>

            {/* Storage Mode Pill */}
            <Badge 
              variant={isSupabaseActive ? 'success' : 'neutral'} 
              size="sm"
              className="hidden lg:inline-flex"
            >
              {isSupabaseActive ? 'Supabase Terhubung' : 'Mode Demo Lokal'}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-8">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:block w-64 shrink-0">
          <nav className="sticky top-24 space-y-1.5 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Menu Pembelajaran
            </div>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const isVocab = item.href === '/vocabulary';
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isVocab && dueCards.length > 0 && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-white text-brand-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                      title={`${dueCards.length} kartu kosakata siap di-review hari ini`}
                    >
                      {dueCards.length}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Persona Quick Info Box */}
            <div className="mt-6 pt-4 border-t border-slate-100 px-3">
              <div className="p-3 bg-brand-50/60 rounded-xl border border-brand-100">
                <div className="flex items-center gap-2 text-brand-900 font-semibold text-xs mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                  <span>Jalur Reaktivasi Mandiri</span>
                </div>
                <p className="text-xs text-brand-700 leading-relaxed">
                  Dirancang khusus untuk pelajar Indonesia yang ingin memulihkan memori Hanzi dan kelancaran berbicara.
                </p>
              </div>
            </div>
          </nav>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="fixed inset-y-0 left-0 w-72 bg-white p-5 shadow-2xl flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-sm">
                      道
                    </div>
                    <span className="font-bold text-slate-900">MandarinPath</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
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

              <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
                <p>Status: {isSupabaseActive ? 'Supabase Terhubung' : 'Demo Lokal Offline'}</p>
                <p className="mt-1">Kurikulum: HSK 2.0 / 3.0 Bridge</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 pb-16 lg:pb-0">{children}</main>
      </div>

      {/* Mobile Sticky Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 py-1.5 px-3">
        <div className="flex items-center justify-around">
          {NAV_ITEMS.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition-colors ${
                  isActive ? 'text-brand-600 font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon className="w-5 h-5 mb-0.5" />
                <span className="truncate max-w-[64px]">{item.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
