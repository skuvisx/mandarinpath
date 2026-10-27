'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Compass, 
  CheckCircle2, 
  HelpCircle, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle, 
  RotateCcw,
  Sparkles,
  Award
} from 'lucide-react';
import { DIAGNOSTIC_QUESTIONS } from '@/data/diagnostic';
import { DiagnosticResult, HskLevel } from '@/types';
import { useLearner } from '@/context/LearnerContext';
import { AudioPlayerButton } from '@/components/ui/AudioPlayerButton';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function DiagnosticPage() {
  const { profile, updateProfile } = useLearner();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [skipListening, setSkipListening] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(profile.diagnostic_result || null);

  const activeQuestions = DIAGNOSTIC_QUESTIONS.filter(
    (q) => !skipListening || q.type !== 'listening_dialogue'
  );

  const currentQ = activeQuestions[currentIndex];
  const isLastQuestion = currentIndex === activeQuestions.length - 1;

  const handleSelectOption = (optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionId,
    }));
  };

  const handleCalculateResult = () => {
    let correctCount = 0;
    let readingScore = 0;
    let readingTotal = 0;
    let listeningScore = 0;
    let listeningTotal = 0;
    let grammarScore = 0;
    let grammarTotal = 0;
    let vocabScore = 0;
    let vocabTotal = 0;

    activeQuestions.forEach((q) => {
      const isCorrect = selectedAnswers[q.id] === q.correct_option_id;
      if (isCorrect) correctCount += 1;

      if (q.skill === 'reading') {
        readingTotal += 1;
        if (isCorrect) readingScore += 1;
      } else if (q.skill === 'listening') {
        listeningTotal += 1;
        if (isCorrect) listeningScore += 1;
      } else if (q.skill === 'grammar') {
        grammarTotal += 1;
        if (isCorrect) grammarScore += 1;
      } else if (q.skill === 'vocabulary' || q.skill === 'pinyin') {
        vocabTotal += 1;
        if (isCorrect) vocabScore += 1;
      }
    });

    const percentage = Math.round((correctCount / activeQuestions.length) * 100);

    // Estimate Level without dropping the rusty learner to zero
    let assessed_level: HskLevel = 'HSK2';
    let pathRecommendation = '';
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    if (percentage >= 80) {
      assessed_level = 'HSK4';
      pathRecommendation =
        'Jalur Akselerasi Mandiri: Anda memiliki dasar memori Hanzi dan pemahaman sintaksis yang sangat solid. Fokus langsung pada pelafalan idiom dan transisi HSK 4.';
    } else if (percentage >= 50) {
      assessed_level = 'HSK3';
      pathRecommendation =
        'Jalur Reaktivasi Menengah (HSK 2-3 Bridge): Anda masih mengingat fondasi Hanzi dengan baik, namun memerlukan penyegaran pada nada Pinyin, struktur 把, dan kecepatan menyimak.';
    } else {
      assessed_level = 'HSK2';
      pathRecommendation =
        'Jalur Pemulihan Terarah (HSK 2 Foundation): Tidak perlu mengulang dari nol mutlak. Fokus pada mengaitkan kembali Hanzi dasar dengan arti bahasa Indonesia dan latihan pendengaran santai.';
    }

    if (vocabScore / (vocabTotal || 1) >= 0.7) strengths.push('Pengenalan Hanzi & Kosakata');
    else weaknesses.push('Pengenalan Nada & Kosakata Detail');

    if (grammarScore / (grammarTotal || 1) >= 0.7) strengths.push('Struktur Urutan Kalimat & Pola Tata Bahasa');
    else weaknesses.push('Struktur Kalimat Khusus (把 & 是...的)');

    if (listeningScore / (listeningTotal || 1) >= 0.7) strengths.push('Kemampuan Menyimak Percakapan');
    else weaknesses.push('Kecepatan Tangkap Audio Lisan');

    const evalResult: DiagnosticResult = {
      assessed_level,
      score_percentage: percentage,
      reading_score: readingTotal ? Math.round((readingScore / readingTotal) * 100) : 100,
      listening_score: listeningTotal ? Math.round((listeningScore / listeningTotal) * 100) : 100,
      grammar_score: grammarTotal ? Math.round((grammarScore / grammarTotal) * 100) : 100,
      vocabulary_score: vocabTotal ? Math.round((vocabScore / vocabTotal) * 100) : 100,
      starting_path_recommendation: pathRecommendation,
      strengths,
      weaknesses,
      recommended_daily_minutes: 25,
      assessed_at: new Date().toISOString(),
    };

    setResult(evalResult);
    setIsSubmitted(true);

    // Save to profile
    updateProfile({
      diagnostic_completed: true,
      diagnostic_result: evalResult,
      target_exam_level: assessed_level === 'HSK4' ? 'HSK4' : 'HSK3',
    });
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setIsSubmitted(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header & Disclaimer */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="brand">Penilaian Penempatan Awal</Badge>
          <span className="text-xs text-slate-500 font-medium">Informal Placement Assessment</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Diagnosis Kemampuan Bahasa Mandarin
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Tes ini dirancang untuk mendeteksi bagian yang masih Anda ingat dan bagian yang perlu disegarkan kembali.
        </p>

        {/* Clear Official Disclaimer */}
        <div className="mt-3 p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Pemberitahuan Resmi:</strong> Ini adalah penilaian informal internal MandarinPath untuk personalisasi kurikulum, bukan sertifikasi resmi HSK dari Hanban/CTI.
          </span>
        </div>
      </div>

      {!isSubmitted ? (
        <Card className="p-6">
          {/* Progress Bar & Skip Audio Toggle */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Soal {currentIndex + 1} dari {activeQuestions.length}
            </span>

            <div className="flex items-center gap-3">
              <label className="text-xs text-slate-600 flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={skipListening}
                  onChange={(e) => setSkipListening(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
                <span>Lewati Soal Audio</span>
              </label>
            </div>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-1.5 mb-6 overflow-hidden">
            <div
              className="bg-brand-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / activeQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question Body */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="neutral">Kategori: {currentQ.skill.toUpperCase()}</Badge>
              <Badge variant="brand">Taksiran: {currentQ.level_estimate}</Badge>
            </div>

            <h3 className="text-lg font-bold text-slate-900 leading-snug">
              {currentQ.prompt}
            </h3>

            {/* Optional Pinyin or Audio Text */}
            {currentQ.audio_text && (
              <div className="p-4 rounded-xl bg-brand-50/60 border border-brand-100 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-brand-800">Dengarkan Rekaman Audio:</span>
                  <p className="text-sm font-hanzi text-slate-800">{currentQ.audio_text}</p>
                  {currentQ.pinyin_prompt && (
                    <p className="text-xs text-slate-500 font-mono">{currentQ.pinyin_prompt}</p>
                  )}
                </div>
                <AudioPlayerButton text={currentQ.audio_text} size="lg" showLabel />
              </div>
            )}

            {/* Options */}
            <div className="space-y-2.5 pt-3">
              {currentQ.options.map((opt) => {
                const isSelected = selectedAnswers[currentQ.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50/70 text-brand-950 font-semibold shadow-xs ring-1 ring-brand-600'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? 'border-brand-600 bg-brand-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-hanzi">{opt.text}</span>
                      {opt.pinyin && (
                        <span className="block text-xs text-slate-500 font-mono mt-0.5">{opt.pinyin}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-8 border-t border-slate-100 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Sebelumnya
            </Button>

            {isLastQuestion ? (
              <Button
                variant="primary"
                size="md"
                onClick={handleCalculateResult}
                disabled={!selectedAnswers[currentQ.id]}
              >
                Selesaikan Penilaian <CheckCircle2 className="w-4 h-4 ml-1.5" />
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                disabled={!selectedAnswers[currentQ.id]}
              >
                Selanjutnya <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            )}
          </div>
        </Card>
      ) : (
        /* Results View */
        result && (
          <div className="space-y-6 animate-fade-in">
            <Card className="p-6 bg-gradient-to-b from-white to-brand-50/30 border-brand-200">
              <div className="text-center space-y-3 pb-6 border-b border-slate-100">
                <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <Award className="w-8 h-8" />
                </div>
                <Badge variant="brand" size="md">Hasil Diagnosis Kemampuan</Badge>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Rekomendasi Tingkat: {result.assessed_level}
                </h2>
                <p className="text-slate-600 text-sm max-w-xl mx-auto leading-relaxed">
                  {result.starting_path_recommendation}
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                  <span>Skor Akurasi Diagnostik:</span>
                  <span className="text-brand-700 font-bold">{result.score_percentage}%</span>
                </div>
              </div>

              {/* Sub-skill Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-100 text-center">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">Kosakata & Hanzi</span>
                  <p className="text-xl font-extrabold text-slate-900 mt-1">{result.vocabulary_score}%</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">Tata Bahasa</span>
                  <p className="text-xl font-extrabold text-slate-900 mt-1">{result.grammar_score}%</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">Membaca (Reading)</span>
                  <p className="text-xl font-extrabold text-slate-900 mt-1">{result.reading_score}%</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">Mendengarkan</span>
                  <p className="text-xl font-extrabold text-slate-900 mt-1">{result.listening_score}%</p>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
                    Kekuatan Terdeteksi:
                  </h4>
                  <ul className="text-xs text-emerald-900 space-y-1">
                    {result.strengths.map((s, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 mb-2">
                    Area Fokus Pemulihan:
                  </h4>
                  <ul className="text-xs text-rose-900 space-y-1">
                    {result.weaknesses.map((w, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
                <Button variant="outline" size="sm" onClick={handleRetake}>
                  <RotateCcw className="w-4 h-4 mr-1.5" /> Ulangi Penilaian
                </Button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Link href="/vocabulary" className="w-full sm:w-auto">
                    <Button variant="outline" size="sm" className="w-full">
                      Mulai Review Kartu
                    </Button>
                  </Link>
                  <Link href="/curriculum" className="w-full sm:w-auto">
                    <Button variant="primary" size="sm" className="w-full">
                      Masuk Kurikulum {result.assessed_level} <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        )
      )}
    </div>
  );
}
