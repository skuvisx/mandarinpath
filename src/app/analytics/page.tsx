'use client';

import React, { useState } from 'react';
import { 
  BarChart3, 
  Flame, 
  Clock, 
  Layers, 
  CheckCircle2, 
  Download, 
  Upload, 
  RotateCcw, 
  Target, 
  Settings, 
  BookOpen, 
  Check, 
  AlertCircle,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useLearner } from '@/context/LearnerContext';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { HskLevel, UserProficiency } from '@/types';

export default function AnalyticsAndSettingsPage() {
  const { 
    profile, 
    updateProfile, 
    vocabProgress, 
    vocabList, 
    dueCards, 
    lessonProgress, 
    lessons, 
    quizAttempts, 
    mistakes, 
    resolveMistake,
    exportData, 
    importData, 
    resetAll 
  } = useLearner();

  // Profile Edit State
  const [name, setName] = useState(profile.name);
  const [dailyGoal, setDailyGoal] = useState(profile.daily_goal_minutes || 25);
  const [targetLevel, setTargetLevel] = useState<HskLevel>(profile.target_exam_level || 'HSK3');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Import JSON state
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Statistics calculation
  const progressList = Object.values(vocabProgress);
  const masteredCount = progressList.filter((p) => p.state === 'mastered').length;
  const learningCount = progressList.filter((p) => p.state === 'learning' || p.state === 'review').length;
  const totalCompletedLessons = Object.values(lessonProgress).filter((l) => l.completed).length;

  // Average Quiz Accuracy
  const avgQuizAccuracy =
    quizAttempts.length > 0
      ? Math.round(
          quizAttempts.reduce((acc, curr) => acc + curr.score_percentage, 0) / quizAttempts.length
        )
      : 0;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      daily_goal_minutes: Number(dailyGoal),
      study_duration_preference: Number(dailyGoal),
      target_exam_level: targetLevel,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleExport = () => {
    const jsonStr = exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mandarinpath_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = () => {
    if (!importJsonText.trim()) return;
    const ok = importData(importJsonText);
    if (ok) {
      setImportStatus('Berhasil memulihkan data kemajuan!');
      setImportJsonText('');
    } else {
      setImportStatus('Format JSON tidak valid atau data rusak.');
    }
    setTimeout(() => setImportStatus(null), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="brand">Analisis Kemajuan & Pengaturan</Badge>
          <Badge variant="neutral">Data Riwayat Nyata</Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Dasbor Progres Belajar & Profil
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Pantau retensi kosakata Spaced Repetition, akurasi kuis, dan kelola target belajar harian.
        </p>
      </div>

      {/* Real Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Kosakata Dikuasai
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
              {masteredCount}
            </span>
            <span className="text-xs text-slate-400">/ {vocabList.length}</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {learningCount} sedang dipelajari
          </span>
        </Card>

        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Total Waktu Belajar
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-brand-600">
              {profile.total_study_minutes}
            </span>
            <span className="text-xs text-slate-400">menit</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Target: {profile.daily_goal_minutes}m / hari
          </span>
        </Card>

        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Modul Selesai
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {totalCompletedLessons}
            </span>
            <span className="text-xs text-slate-400">/ {lessons.length}</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Kurikulum HSK 2-3
          </span>
        </Card>

        <Card className="p-4">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Rata-rata Akurasi Kuis
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-purple-600">
              {avgQuizAccuracy}%
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Dari {quizAttempts.length} sesi kuis
          </span>
        </Card>
      </div>

      {/* Mistake Notebook (Koleksi Kesalahan) */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <CardTitle>Buku Catatan Kesalahan (错题本)</CardTitle>
            <CardDescription>
              Pertanyaan dari kuis yang pernah salah dijawab, disimpan untuk diuji kembali.
            </CardDescription>
          </div>
          <Badge variant={mistakes.filter((m) => !m.resolved).length > 0 ? 'warning' : 'success'}>
            {mistakes.filter((m) => !m.resolved).length} Perlu Diperbaiki
          </Badge>
        </div>

        {mistakes.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500">
            Belum ada kesalahan yang dicatat. Buku catatan akan terisi otomatis saat Anda mengerjakan kuis.
          </div>
        ) : (
          <div className="space-y-3">
            {mistakes.map((m) => (
              <div
                key={m.id}
                className={`p-3.5 rounded-xl border text-xs space-y-1.5 transition-colors ${
                  m.resolved
                    ? 'bg-slate-50/60 border-slate-200 opacity-60'
                    : 'bg-amber-50/50 border-amber-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{m.prompt}</span>
                  {!m.resolved ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-7"
                      onClick={() => resolveMistake(m.id)}
                    >
                      <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Tandai Sudah Paham
                    </Button>
                  ) : (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Telah Dituntaskan
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-slate-600">
                  <span>Jawaban salah: <del className="text-rose-600">{m.user_answer}</del></span>
                  <span>Kunci: <strong className="text-emerald-700">{m.correct_answer}</strong></span>
                </div>

                <p className="text-slate-500 italic pt-1 border-t border-slate-200/60">
                  {m.explanation}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Learner Profile Settings */}
      <Card className="p-6 space-y-5">
        <div className="pb-3 border-b border-slate-100">
          <CardTitle>Pengaturan Profil & Target Pembelajaran</CardTitle>
          <CardDescription>
            Sesuaikan durasi belajar harian dan level ujian sasaran Anda.
          </CardDescription>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Nama Pelajar:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Target Ujian Sertifikasi:
              </label>
              <select
                value={targetLevel}
                onChange={(e) => setTargetLevel(e.target.value as HskLevel)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-brand-500"
              >
                <option value="HSK1">HSK 1 (Dasar Awal)</option>
                <option value="HSK2">HSK 2 (Percakapan Sehari-hari)</option>
                <option value="HSK3">HSK 3 (Menengah - Reaktivasi Target)</option>
                <option value="HSK4">HSK 4 (Lancar Percakapan Mandiri)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Komitmen Belajar Harian:
              </label>
              <select
                value={dailyGoal}
                onChange={(e) => setDailyGoal(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-brand-500"
              >
                <option value={15}>15 Menit / Hari (Santai)</option>
                <option value={20}>20 Menit / Hari (Rekomendasi Pemulihan)</option>
                <option value={25}>25 Menit / Hari (Optimal - Sesuai Persona)</option>
                <option value={30}>30 Menit / Hari (Intensif)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Fokus Utama Pembelajaran:
              </label>
              <div className="py-2 text-xs text-slate-600">
                Seimbang: Percakapan Lisan + Persiapan Ujian HSK
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" variant="primary" size="sm">
              Simpan Perubahan
            </Button>
            {saveSuccess && (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Berhasil disimpan!
              </span>
            )}
          </div>
        </form>
      </Card>

      {/* Data Export, Backup & Import */}
      <Card className="p-6 space-y-4">
        <div className="pb-3 border-b border-slate-100">
          <CardTitle>Ekspor, Pencadangan, dan Pemulihan Data</CardTitle>
          <CardDescription>
            Unduh seluruh kemajuan belajar Anda ke berkas JSON atau pulihkan data di perangkat lain.
          </CardDescription>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-1.5" /> Unduh Cadangan Progres (JSON)
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              if (confirm('Yakin ingin mereset seluruh progres belajar ke kondisi awal?')) {
                resetAll();
              }
            }}
          >
            <RotateCcw className="w-4 h-4 mr-1.5" /> Reset Semua Data
          </Button>
        </div>

        {/* Import JSON Form */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <label className="text-xs font-semibold text-slate-700 block">
            Pulihkan dari Berkas JSON Cadangan:
          </label>
          <textarea
            value={importJsonText}
            onChange={(e) => setImportJsonText(e.target.value)}
            placeholder="Tempel teks JSON cadangan di sini..."
            rows={3}
            className="w-full p-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:ring-brand-500"
          />
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleImportSubmit}
              disabled={!importJsonText.trim()}
            >
              <Upload className="w-4 h-4 mr-1.5" /> Impor & Terapkan Data
            </Button>
            {importStatus && <span className="text-xs font-semibold text-brand-700">{importStatus}</span>}
          </div>
        </div>
      </Card>
    </div>
  );
}
