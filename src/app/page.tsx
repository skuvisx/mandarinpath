'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Flame, 
  Target, 
  Clock, 
  ArrowRight, 
  BookOpen, 
  Layers, 
  Headphones, 
  FileText, 
  CheckSquare, 
  Compass, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useLearner } from '@/context/LearnerContext';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function DashboardPage() {
  const { profile, dailyGoalStatus, dueCards, lessons, lessonProgress, vocabList, vocabProgress } = useLearner();

  // Find next lesson to continue
  const completedLessonIds = new Set(
    Object.keys(lessonProgress).filter((id) => lessonProgress[id]?.completed)
  );
  const nextLesson = lessons.find((l) => !completedLessonIds.has(l.id)) || lessons[0];

  // Count mastered and learning cards
  const progressList = Object.values(vocabProgress);
  const masteredCount = progressList.filter((p) => p.state === 'mastered').length;
  const learningCount = progressList.filter((p) => p.state === 'learning' || p.state === 'review').length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome & Persona Focus Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Program Reaktivasi Bahasa Mandarin</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Selamat Datang Kembali, {profile.name}!
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Target harian Anda adalah <strong className="text-white">{profile.daily_goal_minutes} menit</strong> untuk memulihkan kelancaran percakapan dan mempersiapkan sertifikasi <strong className="text-brand-300">{profile.target_exam_level}</strong>.
          </p>

          {/* Diagnostic Prompt if not yet taken */}
          {!profile.diagnostic_completed && (
            <div className="mt-4 p-4 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-white text-sm">Belum Mengikuti Penilaian Penempatan?</p>
                <p className="text-slate-300 text-xs">Uji kemampuan informal (10 soal) untuk menentukan titik mulai belajar yang ideal.</p>
              </div>
              <Link href="/diagnostic">
                <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold whitespace-nowrap">
                  Mulai Penilaian (5 Mnt)
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Decorative Chinese Character in Background */}
        <div className="absolute right-4 -bottom-6 text-9xl font-bold text-white/5 select-none pointer-events-none font-hanzi">
          学
        </div>
      </div>

      {/* Top 3 Core Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Metric 1: Daily Goal Progress */}
        <Card className="hover:border-brand-200 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Target Belajar Hari Ini</span>
            <Target className="w-4 h-4 text-brand-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{dailyGoalStatus.minutesStudiedToday}</span>
            <span className="text-sm text-slate-500">/ {dailyGoalStatus.targetMinutes} menit</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-brand-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${dailyGoalStatus.percentCompleted}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {dailyGoalStatus.isGoalAchieved ? '🎉 Target tercapai hari ini!' : `${dailyGoalStatus.percentCompleted}% tercapai`}
          </p>
        </Card>

        {/* Metric 2: Spaced Repetition Due Queue */}
        <Card className="hover:border-brand-200 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Review Kosakata (SRS)</span>
            <Layers className="w-4 h-4 text-rose-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-600">{dueCards.length}</span>
            <span className="text-sm text-slate-500">kartu siap diulang</span>
          </div>
          <div className="mt-3 flex items-center gap-3 text-xs text-slate-600">
            <span>Matang: <strong className="text-emerald-700">{masteredCount}</strong></span>
            <span>•</span>
            <span>Belajar: <strong className="text-brand-700">{learningCount}</strong></span>
          </div>
          <div className="mt-3">
            <Link href="/vocabulary">
              <Button size="sm" variant={dueCards.length > 0 ? 'primary' : 'outline'} className="w-full text-xs">
                {dueCards.length > 0 ? 'Buka Review Sekarang' : 'Lihat Kamus Kosakata'}
              </Button>
            </Link>
          </div>
        </Card>

        {/* Metric 3: Study Streak */}
        <Card className="hover:border-brand-200 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Rentetan Belajar</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600">{profile.study_streak}</span>
            <span className="text-sm text-slate-500">hari berturut-turut</span>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            Total waktu belajar: <strong className="text-slate-800">{profile.total_study_minutes} menit</strong>
          </p>
          <div className="mt-3">
            <Link href="/analytics">
              <Button size="sm" variant="outline" className="w-full text-xs">
                Lihat Kalender & Analisis
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Suggested 20-30 Minute Daily Study Flow */}
      <Card className="border-brand-100 bg-gradient-to-b from-white to-brand-50/20">
        <CardHeader>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Rencana Belajar 20–30 Menit Hari Ini</CardTitle>
              <Badge variant="brand">Rekomendasi Terstruktur</Badge>
            </div>
            <CardDescription>
              Urutan harian berbobot seimbang untuk mengaktifkan kembali pemahaman dan kemampuan berbicara.
            </CardDescription>
          </div>
        </CardHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Step 1: Review */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">Langkah 1 (5m)</span>
                <Layers className="w-4 h-4 text-brand-600" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Review Kartu SRS</h4>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                Ulangi {dueCards.length} kosakata yang jatuh tempo hari ini agar tidak lupa lagi.
              </p>
            </div>
            <Link href="/vocabulary" className="mt-3">
              <Button size="sm" variant="outline" className="w-full text-xs">
                Mulai Review
              </Button>
            </Link>
          </div>

          {/* Step 2: New Lesson */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">Langkah 2 (10m)</span>
                <BookOpen className="w-4 h-4 text-brand-600" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Materi & Dialog</h4>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                {nextLesson.title} ({nextLesson.level})
              </p>
            </div>
            <Link href={`/curriculum/${nextLesson.slug}`} className="mt-3">
              <Button size="sm" variant="primary" className="w-full text-xs">
                Buka Pelajaran
              </Button>
            </Link>
          </div>

          {/* Step 3: Listening & Shadowing */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">Langkah 3 (5m)</span>
                <Headphones className="w-4 h-4 text-brand-600" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Lab Mendengarkan</h4>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                Latihan shadowing intonasi dan pengenalan audio percakapan tempo nyata.
              </p>
            </div>
            <Link href="/listening" className="mt-3">
              <Button size="sm" variant="outline" className="w-full text-xs">
                Latihan Audio
              </Button>
            </Link>
          </div>

          {/* Step 4: Sentence Builder */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">Langkah 4 (5m)</span>
                <FileText className="w-4 h-4 text-brand-600" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Penyusun Kalimat</h4>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                Latihan menyusun urutan kata Mandarin (pola 把, 是...的, 比).
              </p>
            </div>
            <Link href="/grammar" className="mt-3">
              <Button size="sm" variant="outline" className="w-full text-xs">
                Susun Kalimat
              </Button>
            </Link>
          </div>

          {/* Step 5: Daily Micro Quiz */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">Langkah 5 (5m)</span>
                <CheckSquare className="w-4 h-4 text-brand-600" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Kuis Evaluasi</h4>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                5 soal singkat untuk mengukur retensi materi dan mencatat kesalahan.
              </p>
            </div>
            <Link href="/quiz" className="mt-3">
              <Button size="sm" variant="outline" className="w-full text-xs">
                Mulai Kuis
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Continue Learning Highlight & Lesson Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Modul Kurikulum Terkini</h3>
            <Link href="/curriculum" className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1">
              <span>Semua Pelajaran</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {lessons.map((lesson) => {
              const isCompleted = lessonProgress[lesson.id]?.completed;
              return (
                <div
                  key={lesson.id}
                  className="p-4 rounded-xl bg-white border border-slate-200/90 hover:border-brand-300 transition-all shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={isCompleted ? 'success' : 'brand'}>{lesson.level}</Badge>
                      <span className="text-xs text-slate-500 font-medium">Modul {lesson.module_number}.{lesson.lesson_number}</span>
                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-slate-900 text-base">{lesson.title}</h4>
                    <p className="text-sm text-slate-600 font-hanzi">
                      {lesson.title_chinese} <span className="text-slate-400 font-sans text-xs">({lesson.title_pinyin})</span>
                    </p>
                  </div>

                  <Link href={`/curriculum/${lesson.slug}`}>
                    <Button
                      size="sm"
                      variant={isCompleted ? 'outline' : 'primary'}
                      className="whitespace-nowrap"
                    >
                      {isCompleted ? 'Ulas Kembali' : 'Mulai Belajar'}
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Diagnostic / Placement Summary */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Status Penempatan</h3>
          <Card className="p-5">
            {profile.diagnostic_completed && profile.diagnostic_result ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="success">Hasil Penempatan</Badge>
                  <span className="text-xs text-slate-400">
                    {profile.diagnostic_result.assessed_at?.split('T')[0]}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-lg">
                  Tingkat: {profile.diagnostic_result.assessed_level}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {profile.diagnostic_result.starting_path_recommendation}
                </p>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Skor: {profile.diagnostic_result.score_percentage}%</span>
                  <Link href="/diagnostic" className="text-brand-600 font-medium hover:underline">
                    Ulangi Tes
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-center py-2">
                <Compass className="w-10 h-10 text-brand-600 mx-auto" />
                <h4 className="font-bold text-slate-900">Belum Ada Hasil Diagnostik</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Ikuti tes penempatan awal untuk mendiagnosis kelemahan kosakata, pinyin, tata bahasa, dan mendengarkan.
                </p>
                <Link href="/diagnostic" className="block pt-2">
                  <Button size="sm" variant="primary" className="w-full text-xs">
                    Ikuti Tes Penempatan
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
