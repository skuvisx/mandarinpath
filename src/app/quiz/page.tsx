'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Clock, 
  Award, 
  AlertCircle, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  Volume2, 
  CheckCircle2, 
  XCircle, 
  History,
  Sparkles
} from 'lucide-react';
import { HSK3_MOCK_EXAM_SECTIONS, MockExamSection } from '@/data/mockExam';
import { QuizQuestion, QuizAttempt } from '@/types';
import { useLearner } from '@/context/LearnerContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AudioPlayerButton } from '@/components/ui/AudioPlayerButton';

export default function QuizAndMockExamPage() {
  const { quizAttempts, saveQuizAttempt } = useLearner();

  // Mode: 'selector' | 'exam' | 'result'
  const [viewMode, setViewMode] = useState<'selector' | 'exam' | 'result'>('selector');

  // Exam state
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(900); // 15 mins default
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [lastAttemptResult, setLastAttemptResult] = useState<QuizAttempt | null>(null);

  const sections = HSK3_MOCK_EXAM_SECTIONS;
  const currentSection = sections[currentSectionIndex];
  const allExamQuestions: QuizQuestion[] = sections.flatMap((s) => s.questions);

  // Flattened index for navigation
  const flatQuestions = sections.flatMap((s) =>
    s.questions.map((q) => ({ ...q, sectionTitle: s.title }))
  );
  const currentQ = flatQuestions[currentQuestionIndex];

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timeRemainingSeconds > 0) {
      interval = setInterval(() => {
        setTimeRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval!);
            handleAutoSubmitOnTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timeRemainingSeconds]);

  const handleStartExam = (durationMinutes: number = 15) => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setTimeRemainingSeconds(durationMinutes * 60);
    setIsTimerRunning(true);
    setViewMode('exam');
  };

  const handleSelectAnswer = (qId: string, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: optionIndex,
    }));
  };

  const handleAutoSubmitOnTimeout = () => {
    handleSubmitExam();
  };

  const handleSubmitExam = () => {
    setIsTimerRunning(false);

    let correctCount = 0;
    const mistakes: QuizAttempt['mistakes'] = [];

    flatQuestions.forEach((q) => {
      const userAnsIndex = answers[q.id];
      const isCorrect = userAnsIndex === q.correct_index;
      if (isCorrect) {
        correctCount += 1;
      } else {
        mistakes.push({
          question_id: q.id,
          prompt: q.prompt,
          user_answer: userAnsIndex !== undefined ? q.options[userAnsIndex] : 'Tidak dijawab',
          correct_answer: q.options[q.correct_index],
          explanation: q.explanation,
        });
      }
    });

    const scorePercentage = Math.round((correctCount / flatQuestions.length) * 100);
    const totalDuration = 900 - timeRemainingSeconds;

    const saved = saveQuizAttempt({
      quiz_type: 'mock_exam',
      hsk_level: 'HSK3',
      total_questions: flatQuestions.length,
      correct_count: correctCount,
      score_percentage: scorePercentage,
      duration_seconds: totalDuration,
      mistakes,
    });

    setLastAttemptResult(saved);
    setViewMode('result');
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="brand">Simulasi Ujian & Kuis Harian</Badge>
          <Badge variant="warning">Unofficial Exam Bank</Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Pusat Kuis & Simulasi Ujian HSK 3
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Latihan berbatas waktu dengan evaluasi otomatis, penjelasan analisis jawaban, dan penyimpanan riwayat nilai.
        </p>

        {/* Disclaimer */}
        <div className="mt-3 p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Pernyataan Resmi:</strong> Simulasi ini disusun secara independen berdasarkan format ujian HSK standar untuk melatih ketangkasan manajemen waktu. Nilai yang diperoleh adalah simulasi latihan, bukan sertifikat kemahiran resmi Hanban/CTI.
          </span>
        </div>
      </div>

      {/* VIEW 1: Selector / History */}
      {viewMode === 'selector' && (
        <div className="space-y-6">
          <Card className="p-6 bg-gradient-to-r from-slate-900 to-brand-950 text-white space-y-4">
            <div className="space-y-1">
              <Badge variant="brand" className="bg-white/20 text-white border-white/30">
                Simulasi Standar HSK 3
              </Badge>
              <h2 className="text-xl sm:text-2xl font-bold">Simulasi Ujian Berwaktu (15 Menit)</h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Terdiri dari 3 seksi: Mendengarkan (Tīnglì), Membaca (Yuèdú), dan Tata Bahasa (Yǔfǎ).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2 border-t border-white/10">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-brand-300" /> Waktu: 15 Menit
              </span>
              <span className="flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-brand-300" /> Jumlah Soal: {flatQuestions.length} Soal
              </span>
            </div>

            <Button
              size="lg"
              variant="primary"
              className="bg-brand-500 hover:bg-brand-600 text-white font-bold"
              onClick={() => handleStartExam(15)}
            >
              Mulai Simulasi Ujian Sekarang
            </Button>
          </Card>

          {/* Past Attempts History */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-slate-600" />
              <h3 className="text-base font-bold text-slate-900">Riwayat Nilai Latihan Sebelumnya</h3>
            </div>

            {quizAttempts.length === 0 ? (
              <div className="p-6 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500">
                Belum ada riwayat kuis tersimpan. Selesaikan simulasi pertama Anda di atas!
              </div>
            ) : (
              <div className="space-y-2">
                {quizAttempts.slice(0, 5).map((att) => (
                  <div
                    key={att.id}
                    className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant={att.score_percentage >= 70 ? 'success' : 'danger'}>
                          {att.hsk_level} • {att.score_percentage}%
                        </Badge>
                        <span className="text-xs text-slate-500">
                          {att.correct_count} / {att.total_questions} Benar
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        Dikerjakan pada {att.created_at.replace('T', ' ').slice(0, 16)} • Durasi:{' '}
                        {Math.round(att.duration_seconds / 60)} menit
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-semibold text-slate-700">
                        {att.mistakes?.length || 0} Kesalahan
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: Active Exam Screen */}
      {viewMode === 'exam' && currentQ && (
        <Card className="p-6 space-y-6">
          {/* Exam Header: Question Counter & Countdown Timer */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-semibold text-brand-700 uppercase tracking-wider block">
                {currentQ.sectionTitle}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Soal {currentQuestionIndex + 1} dari {flatQuestions.length}
              </span>
            </div>

            {/* Countdown Badge */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold ${
                timeRemainingSeconds < 120
                  ? 'bg-rose-100 text-rose-700 animate-pulse'
                  : 'bg-slate-100 text-slate-800'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Sisa Waktu: {formatTimer(timeRemainingSeconds)}</span>
            </div>
          </div>

          {/* Question Prompt */}
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {currentQ.prompt}
            </h3>

            {currentQ.audio_text && (
              <div className="p-3.5 bg-brand-50/70 border border-brand-100 rounded-xl flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-brand-900">
                  Dengarkan Rekaman Soal Ini:
                </span>
                <AudioPlayerButton text={currentQ.audio_text} size="sm" showLabel />
              </div>
            )}

            {/* Multiple Choice Options */}
            <div className="space-y-2.5 pt-2">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = answers[currentQ.id] === optIdx;
                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelectAnswer(currentQ.id, optIdx)}
                    className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50 text-brand-950 font-semibold ring-1 ring-brand-600'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                        isSelected
                          ? 'border-brand-600 bg-brand-600 text-white'
                          : 'border-slate-300 bg-white text-slate-500'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </div>
                    <span className="font-hanzi">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Sebelumnya
            </Button>

            {currentQuestionIndex === flatQuestions.length - 1 ? (
              <Button
                variant="primary"
                size="md"
                onClick={handleSubmitExam}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                Kumpulkan Ujian Sekarang
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
              >
                Selanjutnya <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* VIEW 3: Result Breakdown & Mistake Review */}
      {viewMode === 'result' && lastAttemptResult && (
        <div className="space-y-6 animate-fade-in">
          <Card className="p-6 text-center space-y-4 bg-gradient-to-b from-white to-brand-50/20 border-brand-200">
            <div className="w-16 h-16 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center mx-auto">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <Badge variant="brand">Hasil Skor Simulasi</Badge>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Skor Anda: {lastAttemptResult.score_percentage}%
              </h2>
              <p className="text-sm text-slate-600">
                Berhasil menjawab {lastAttemptResult.correct_count} dari{' '}
                {lastAttemptResult.total_questions} pertanyaan dengan benar.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <Button variant="outline" size="sm" onClick={() => setViewMode('selector')}>
                Kembali ke Beranda Kuis
              </Button>
              <Button variant="primary" size="sm" onClick={() => handleStartExam(15)}>
                <RotateCcw className="w-4 h-4 mr-1.5" /> Ulangi Simulasi Ujian
              </Button>
            </div>
          </Card>

          {/* Mistake Review Section */}
          {lastAttemptResult.mistakes && lastAttemptResult.mistakes.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900">
                Ulasan Kesalahan & Pembahasan ({lastAttemptResult.mistakes.length} Soal)
              </h3>
              <p className="text-xs text-slate-500">
                Semua kesalahan telah dicatat secara otomatis ke Buku Kesalahan Anda untuk latihan berikutnya.
              </p>

              <div className="space-y-3">
                {lastAttemptResult.mistakes.map((m, idx) => (
                  <Card key={idx} className="p-4 space-y-2 border-rose-200 bg-rose-50/20">
                    <p className="text-sm font-bold text-slate-900">
                      #{idx + 1}. {m.prompt}
                    </p>

                    <div className="text-xs space-y-1 pt-1">
                      <p className="text-rose-700 flex items-center gap-1.5">
                        <XCircle className="w-4 h-4 shrink-0" />
                        <span>Jawaban Anda: <strong>{m.user_answer}</strong></span>
                      </p>
                      <p className="text-emerald-700 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Jawaban Benar: <strong>{m.correct_answer}</strong></span>
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200 text-xs text-slate-700 leading-relaxed">
                      <span className="font-semibold text-slate-900">Pembahasan: </span>
                      {m.explanation}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
