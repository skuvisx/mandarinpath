'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Flame,
  Target,
  ArrowRight,
  BookOpen,
  Layers,
  Headphones,
  FileText,
  CheckSquare,
  Compass,
  CheckCircle2,
  PenTool,
  Music,
  Database,
  Smartphone,
  Edit3,
  Check,
} from 'lucide-react';
import { useLearner } from '@/context/LearnerContext';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const HSK_OVERVIEW_LEVELS = [
  { level: 1, words2: 150, words3: 506, desc: 'Fondasi sapaan, angka, waktu & kalimat dasar' },
  { level: 2, words2: 147, words3: 750, desc: 'Percakapan harian, perbandingan & aktivitas' },
  { level: 3, words2: 298, words3: 953, desc: 'Transisi mandiri, kalimat 把, 是…的 & kampus' },
  { level: 4, words2: 598, words3: 972, desc: 'Diskusi lancar, kalimat pasif 被 & dunia kerja' },
  { level: 5, words2: 1298, words3: 1059, desc: 'Teks berita, pidato, negosiasi & argumen formal' },
  { level: 6, words2: 2500, words3: 1123, desc: 'Idiom Chengyu (成语), sastra & kefasihan penuh' },
];

export default function DashboardPage() {
  const {
    profile,
    updateProfile,
    dailyGoalStatus,
    dueCards,
    strokeRecords,
    lessons,
    lessonProgress,
    vocabProgress,
  } = useLearner();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (trimmed) {
      updateProfile({ name: trimmed });
    }
    setIsEditingName(false);
  };

  const completedLessonIds = new Set(
    Object.keys(lessonProgress).filter((id) => lessonProgress[id]?.completed)
  );
  const nextLesson = lessons.find((l) => !completedLessonIds.has(l.id)) || lessons[0];

  const progressList = Object.values(vocabProgress);
  const masteredCount = progressList.filter((p) => p.state === 'mastered').length;
  const learningCount = progressList.filter(
    (p) => p.state === 'learning' || p.state === 'review'
  ).length;
  const practicedCharsCount = Object.keys(strokeRecords).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-brand-950 to-teal-950 text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full HSK 1–6 & HSK 3.0 Platform</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-mono font-bold text-teal-300">
              ™ @skuvis_
            </span>
          </div>

          {isEditingName ? (
            <form onSubmit={handleSaveName} className="flex flex-wrap items-center gap-2 pt-1">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Masukkan nama Anda..."
                autoFocus
                className="px-3 py-1.5 rounded-lg bg-white/15 border border-white/30 text-white placeholder-slate-300 text-base sm:text-lg font-bold focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              <Button
                type="submit"
                size="sm"
                className="bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold"
              >
                <Check className="w-4 h-4 mr-1" /> Simpan Nama
              </Button>
            </form>
          ) : (
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Selamat Datang Kembali, {profile.name}!
              </h1>
              <button
                type="button"
                onClick={() => {
                  setNameInput(profile.name === 'Pelajar Mandarin' ? '' : profile.name);
                  setIsEditingName(true);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-medium text-slate-200 transition-colors"
                title="Ubah nama panggilan Anda"
              >
                <Edit3 className="w-3.5 h-3.5" /> Ubah Nama
              </button>
            </div>
          )}

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Target harian Anda adalah <strong className="text-white">{profile.daily_goal_minutes} menit</strong> untuk memulihkan kelancaran percakapan, penguasaan guratan Hanzi, dan sertifikasi{' '}
            <strong className="text-teal-300">{profile.target_exam_level}</strong>.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            <Link href="/vocabulary">
              <Button size="sm" className="bg-brand-500 hover:bg-brand-600 text-white font-bold">
                <Database className="w-4 h-4 mr-1.5" /> Buka Kamus Lengkap HSK 1–6
              </Button>
            </Link>
            <Link href="/writing">
              <Button
                size="sm"
                variant="outline"
                className="bg-white/10 border-white/25 text-white hover:bg-white/20"
              >
                <PenTool className="w-4 h-4 mr-1.5" /> Latih Menulis Guratan
              </Button>
            </Link>
            <Link href="/tones">
              <Button
                size="sm"
                variant="outline"
                className="bg-white/10 border-white/25 text-white hover:bg-white/20"
              >
                <Music className="w-4 h-4 mr-1.5" /> Lab Nada & Pinyin
              </Button>
            </Link>
          </div>

          {!profile.diagnostic_completed && (
            <div className="mt-4 p-4 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-white text-sm">
                  Belum Mengikuti Penilaian Penempatan?
                </p>
                <p className="text-slate-300 text-xs">
                  Uji kemampuan informal (10 soal) untuk menentukan titik mulai belajar yang ideal.
                </p>
              </div>
              <Link href="/diagnostic">
                <Button
                  size="sm"
                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold whitespace-nowrap"
                >
                  Mulai Penilaian (5 Mnt)
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="absolute right-4 -bottom-6 text-9xl font-bold text-white/5 select-none pointer-events-none font-hanzi">
          道
        </div>
      </div>

      {/* Top 4 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:border-brand-200 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Target Belajar Hari Ini
            </span>
            <Target className="w-4 h-4 text-brand-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {dailyGoalStatus.minutesStudiedToday}
            </span>
            <span className="text-sm text-slate-500">/ {dailyGoalStatus.targetMinutes} menit</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-brand-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${dailyGoalStatus.percentCompleted}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {dailyGoalStatus.isGoalAchieved
              ? 'Target harian tercapai!'
              : `${dailyGoalStatus.percentCompleted}% dari target harian`}
          </p>
        </Card>

        <Card className="hover:border-brand-200 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Antrean Review SRS
            </span>
            <Layers className="w-4 h-4 text-rose-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-600">{dueCards.length}</span>
            <span className="text-sm text-slate-500">kartu jatuh tempo</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
            <span>
              Matang: <strong className="text-emerald-700">{masteredCount}</strong>
            </span>
            <span>•</span>
            <span>
              Aktif: <strong className="text-brand-700">{learningCount}</strong>
            </span>
          </div>
          <Link href="/vocabulary" className="block mt-3">
            <Button size="sm" variant="primary" className="w-full text-xs">
              Review & Kamus HSK 1–6
            </Button>
          </Link>
        </Card>

        <Card className="hover:border-brand-200 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Latihan Guratan Hanzi
            </span>
            <PenTool className="w-4 h-4 text-teal-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-teal-700">{practicedCharsCount}</span>
            <span className="text-sm text-slate-500">karakter dilatih</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Validasi urutan goresan interaktif
          </p>
          <Link href="/writing" className="block mt-3">
            <Button size="sm" variant="outline" className="w-full text-xs">
              Buka Kanvas Guratan
            </Button>
          </Link>
        </Card>

        <Card className="hover:border-brand-200 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Rentetan & Perangkat
            </span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600">{profile.study_streak}</span>
            <span className="text-sm text-slate-500">hari berturut-turut</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Total belajar: <strong className="text-slate-800">{profile.total_study_minutes}m</strong>
          </p>
          <Link href="/auth" className="block mt-3">
            <Button size="sm" variant="outline" className="w-full text-xs">
              <Smartphone className="w-3.5 h-3.5 mr-1" /> Sinkron & Pasang App
            </Button>
          </Link>
        </Card>
      </div>

      {/* Complete HSK 1-6 Syllabus Overview Cards */}
      <Card className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Peta Penguasaan Kosakata Lengkap HSK 1 – HSK 6</CardTitle>
              <Badge variant="brand">Full Syllabus</Badge>
            </div>
            <CardDescription>
              Akses penuh seluruh 4.991 kata HSK 2.0 dan 10.969 kata HSK 3.0 lengkap dengan Pinyin, Radikal, Audio, dan Pengecek Guratan.
            </CardDescription>
          </div>
          <Link href="/vocabulary">
            <Button size="sm" variant="primary">
              Jelajahi Semua Kosakata <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {HSK_OVERVIEW_LEVELS.map((item) => (
            <Link
              key={item.level}
              href="/vocabulary"
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-brand-400 transition-all group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-base font-extrabold text-slate-900 group-hover:text-brand-700">
                  HSK Level {item.level}
                </span>
                <div className="flex items-center gap-1">
                  <Badge variant="brand">{item.words2} kata (2.0)</Badge>
                  <Badge variant="purple">{item.words3} (3.0)</Badge>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </Link>
          ))}
        </div>
      </Card>

      {/* Suggested 20-30 Minute Daily Study Flow (6 Accelerator Steps) */}
      <Card className="border-brand-100 bg-gradient-to-b from-white to-brand-50/20">
        <CardHeader>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Alur Akselerasi Harian 20–30 Menit</CardTitle>
              <Badge variant="brand">6 Langkah Terpadu</Badge>
            </div>
            <CardDescription>
              Dirancang untuk mempercepat pemulihan ingatan Hanzi, ketepatan guratan, pendengaran, dan kelancaran bicara.
            </CardDescription>
          </div>
        </CardHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                  Langkah 1 (5m)
                </span>
                <Layers className="w-4 h-4 text-brand-600" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Review Kartu SRS (SM-2)</h4>
              <p className="text-xs text-slate-500 mt-1">
                Ulangi {dueCards.length} kartu jatuh tempo & tambah kata baru dari kamus HSK 1–6.
              </p>
            </div>
            <Link href="/vocabulary" className="mt-3">
              <Button size="sm" variant="outline" className="w-full text-xs">
                Mulai Review SRS
              </Button>
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                  Langkah 2 (5m)
                </span>
                <PenTool className="w-4 h-4 text-teal-600" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Tulis & Cek Guratan Hanzi</h4>
              <p className="text-xs text-slate-500 mt-1">
                Goreskan karakter HSK di kanvas kaligrafi MiZiGe dengan deteksi urutan otomatis.
              </p>
            </div>
            <Link href="/writing" className="mt-3">
              <Button size="sm" variant="outline" className="w-full text-xs">
                Latih Menulis Hanzi
              </Button>
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                  Langkah 3 (4m)
                </span>
                <Music className="w-4 h-4 text-purple-600" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Pasangan Nada & Minimal Pairs</h4>
              <p className="text-xs text-slate-500 mt-1">
                Pertajam pembedaan nada 1–4, aturan sandhi 不/一, dan kontras bunyi Pinyin.
              </p>
            </div>
            <Link href="/tones" className="mt-3">
              <Button size="sm" variant="outline" className="w-full text-xs">
                Buka Lab Nada
              </Button>
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                  Langkah 4 (6m)
                </span>
                <BookOpen className="w-4 h-4 text-brand-600" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Modul Kurikulum ({nextLesson.level})</h4>
              <p className="text-xs text-slate-500 mt-1">{nextLesson.title}</p>
            </div>
            <Link href={`/curriculum/${nextLesson.slug}`} className="mt-3">
              <Button size="sm" variant="primary" className="w-full text-xs">
                Buka Pelajaran
              </Button>
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                  Langkah 5 (5m)
                </span>
                <Headphones className="w-4 h-4 text-brand-600" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Shadowing & Rekam Suara</h4>
              <p className="text-xs text-slate-500 mt-1">
                Dengarkan dialog, rekam suara Anda sendiri, dan bandingkan intonasinya.
              </p>
            </div>
            <Link href="/listening" className="mt-3">
              <Button size="sm" variant="outline" className="w-full text-xs">
                Latihan Audio
              </Button>
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                  Langkah 6 (5m)
                </span>
                <CheckSquare className="w-4 h-4 text-brand-600" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Susun Kalimat & Simulasi HSK</h4>
              <p className="text-xs text-slate-500 mt-1">
                Uji struktur kalimat 把/被/是…的 dan kerjakan simulasi berwaktu.
              </p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link href="/grammar">
                <Button size="sm" variant="outline" className="w-full text-xs">
                  Kalimat
                </Button>
              </Link>
              <Link href="/quiz">
                <Button size="sm" variant="outline" className="w-full text-xs">
                  Ujian
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>

      {/* Curriculum Modules List (HSK 1 to HSK 6) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">
            Jalur Modul Kurikulum Terpadu (HSK 1 – HSK 6)
          </h3>
          <Link
            href="/curriculum"
            className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1"
          >
            <span>Lihat Semua Modul</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {lessons.map((lesson) => {
            const isCompleted = lessonProgress[lesson.id]?.completed;
            return (
              <div
                key={lesson.id}
                className="p-4 rounded-xl bg-white border border-slate-200/90 hover:border-brand-300 transition-all shadow-2xs flex flex-col justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={isCompleted ? 'success' : 'brand'}>{lesson.level}</Badge>
                    <span className="text-xs text-slate-500 font-medium">
                      Modul {lesson.module_number}.{lesson.lesson_number} • {lesson.topic}
                    </span>
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold ml-auto">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">{lesson.title}</h4>
                  <p className="text-sm text-slate-600 font-hanzi">
                    {lesson.title_chinese}{' '}
                    <span className="text-slate-400 font-sans text-xs">
                      ({lesson.title_pinyin})
                    </span>
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xs text-slate-400">~{lesson.estimated_minutes} menit</span>
                  <Link href={`/curriculum/${lesson.slug}`}>
                    <Button size="sm" variant={isCompleted ? 'outline' : 'primary'}>
                      {isCompleted ? 'Ulas Kembali' : 'Mulai Belajar'}
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
