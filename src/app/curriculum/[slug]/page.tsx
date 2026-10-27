'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Volume2, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  RotateCcw, 
  Sparkles,
  BookOpen,
  MessageSquare,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { LESSONS } from '@/data/lessons';
import { useLearner } from '@/context/LearnerContext';
import { AudioPlayerButton } from '@/components/ui/AudioPlayerButton';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function LessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { lessonProgress, completeLesson } = useLearner();

  const lesson = LESSONS.find((l) => l.slug === slug);

  // Dialogue Display Toggles
  const [showPinyin, setShowPinyin] = useState(true);
  const [showIndonesian, setShowIndonesian] = useState(true);

  // Practice Questions State
  const [wordOrderTokens, setWordOrderTokens] = useState<Record<string, string[]>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, string>>({});
  const [questionFeedback, setQuestionFeedback] = useState<Record<string, boolean>>({});

  if (!lesson) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Pelajaran tidak ditemukan</h2>
        <Link href="/curriculum">
          <Button variant="primary">Kembali ke Daftar Kurikulum</Button>
        </Link>
      </div>
    );
  }

  const isCompleted = Boolean(lessonProgress[lesson.id]?.completed);

  // Word order helper
  const handleSelectWordToken = (qId: string, token: string) => {
    const current = wordOrderTokens[qId] || [];
    if (current.includes(token)) {
      setWordOrderTokens((prev) => ({
        ...prev,
        [qId]: current.filter((t) => t !== token),
      }));
    } else {
      setWordOrderTokens((prev) => ({
        ...prev,
        [qId]: [...current, token],
      }));
    }
  };

  const handleCheckWordOrder = (qId: string, correctAnswer: string) => {
    const userSelected = (wordOrderTokens[qId] || []).join(' ');
    const isCorrect = userSelected.trim() === correctAnswer.trim();
    setSubmittedAnswers((prev) => ({ ...prev, [qId]: userSelected }));
    setQuestionFeedback((prev) => ({ ...prev, [qId]: isCorrect }));
  };

  const handleCheckMultipleChoice = (qId: string, selectedOption: string, correctAnswer: string) => {
    const isCorrect = selectedOption === correctAnswer;
    setSubmittedAnswers((prev) => ({ ...prev, [qId]: selectedOption }));
    setQuestionFeedback((prev) => ({ ...prev, [qId]: isCorrect }));
  };

  const handleFinishLesson = () => {
    completeLesson(lesson.id, 100);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Back and Status Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/curriculum"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-brand-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Kurikulum</span>
        </Link>

        {isCompleted && (
          <Badge variant="success" size="md">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Telah Selesai Dipelajari
          </Badge>
        )}
      </div>

      {/* Lesson Header */}
      <div className="space-y-3 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Badge variant="brand">{lesson.level}</Badge>
          <span className="text-xs text-slate-500 font-medium">
            Modul {lesson.module_number}.{lesson.lesson_number} • {lesson.topic}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {lesson.title}
        </h1>

        <div className="p-3 bg-brand-50/50 rounded-xl border border-brand-100 flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-bold text-brand-950 font-hanzi">{lesson.title_chinese}</p>
            <p className="text-xs text-brand-700 font-mono">{lesson.title_pinyin}</p>
          </div>
          <AudioPlayerButton text={lesson.title_chinese} size="md" showLabel />
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">{lesson.description}</p>

        {/* Objectives */}
        <div className="pt-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
            Target Pembelajaran:
          </span>
          <ul className="text-xs text-slate-600 space-y-1">
            {lesson.learning_objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-brand-600 font-bold">•</span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Section 1: Dialogue */}
      {lesson.dialogue && lesson.dialogue.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand-600" />
              <h2 className="text-lg font-bold text-slate-900">Dialog Percakapan Nyata</h2>
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setShowPinyin(!showPinyin)}
                className={`px-2.5 py-1 rounded-lg border transition-colors ${
                  showPinyin
                    ? 'bg-brand-50 border-brand-200 text-brand-700 font-medium'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                Pinyin {showPinyin ? 'Aktif' : 'Nonaktif'}
              </button>

              <button
                onClick={() => setShowIndonesian(!showIndonesian)}
                className={`px-2.5 py-1 rounded-lg border transition-colors ${
                  showIndonesian
                    ? 'bg-brand-50 border-brand-200 text-brand-700 font-medium'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                Arti ID {showIndonesian ? 'Aktif' : 'Nonaktif'}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {lesson.dialogue.map((line, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-2 hover:border-brand-200 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">{line.speaker}</span>
                  <AudioPlayerButton text={line.chinese} size="sm" />
                </div>

                <p className="text-base font-semibold text-slate-900 font-hanzi tracking-wide">
                  {line.chinese}
                </p>

                {showPinyin && (
                  <p className="text-xs text-brand-700 font-mono">{line.pinyin}</p>
                )}

                {showIndonesian && (
                  <p className="text-xs text-slate-600 italic pt-1 border-t border-slate-100">
                    {line.indonesian}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section 2: Grammar Explanations */}
      {lesson.grammar_points && lesson.grammar_points.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-600" />
            <h2 className="text-lg font-bold text-slate-900">Tata Bahasa & Struktur Kalimat</h2>
          </div>

          <div className="space-y-4">
            {lesson.grammar_points.map((gp, idx) => (
              <Card key={idx} className="p-5 space-y-3 border-brand-100">
                <div className="flex items-center gap-2">
                  <Badge variant="purple">Pola {idx + 1}</Badge>
                  <h3 className="font-bold text-slate-900 text-base">{gp.pattern}</h3>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-brand-800 font-semibold">
                  {gp.structure}
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">{gp.explanation_id}</p>

                {/* Examples */}
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Contoh Alami:
                  </span>
                  {gp.examples.map((ex, exIdx) => (
                    <div
                      key={exIdx}
                      className="p-3 rounded-lg bg-brand-50/40 border border-brand-100/70 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <p className="font-hanzi font-semibold text-slate-900 text-sm">
                          {ex.chinese}
                        </p>
                        <p className="text-slate-500 font-mono">{ex.pinyin}</p>
                        <p className="text-slate-700 italic">{ex.indonesian}</p>
                        {ex.breakdown && (
                          <p className="text-[11px] text-brand-800 pt-1 font-sans">
                            💡 {ex.breakdown}
                          </p>
                        )}
                      </div>
                      <AudioPlayerButton text={ex.chinese} size="sm" />
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Section 3: Interactive Practice Questions */}
      {lesson.practice_questions && lesson.practice_questions.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-brand-600" />
            <h2 className="text-lg font-bold text-slate-900">Latihan Penguatan Materi</h2>
          </div>

          <div className="space-y-4">
            {lesson.practice_questions.map((q, idx) => {
              const isSubmitted = submittedAnswers[q.id] !== undefined;
              const isCorrect = questionFeedback[q.id];

              return (
                <Card key={q.id} className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Soal Latihan #{idx + 1} • {q.type === 'word_order' ? 'Susun Kata' : 'Pilihan Ganda'}
                    </span>
                    {isSubmitted && (
                      <Badge variant={isCorrect ? 'success' : 'danger'}>
                        {isCorrect ? 'Benar!' : 'Belum Tepat'}
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm font-semibold text-slate-900">{q.prompt}</p>

                  {/* Word Order Exercise */}
                  {q.type === 'word_order' && q.tokens && (
                    <div className="space-y-3 pt-2">
                      {/* Active Slot */}
                      <div className="min-h-[48px] p-2.5 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-wrap gap-2 items-center">
                        {(wordOrderTokens[q.id] || []).map((token) => (
                          <button
                            key={token}
                            type="button"
                            onClick={() => !isSubmitted && handleSelectWordToken(q.id, token)}
                            disabled={isSubmitted}
                            className="px-3 py-1 bg-brand-600 text-white rounded-lg text-sm font-hanzi font-bold shadow-2xs hover:bg-brand-700 transition-colors"
                          >
                            {token} ✕
                          </button>
                        ))}
                        {(wordOrderTokens[q.id] || []).length === 0 && (
                          <span className="text-xs text-slate-400 italic">
                            Ketuk kata-kata di bawah untuk menyusun kalimat ke sini...
                          </span>
                        )}
                      </div>

                      {/* Available Word Tokens */}
                      <div className="flex flex-wrap gap-2">
                        {q.tokens.map((token) => {
                          const isUsed = (wordOrderTokens[q.id] || []).includes(token);
                          return (
                            <button
                              key={token}
                              type="button"
                              onClick={() => !isSubmitted && handleSelectWordToken(q.id, token)}
                              disabled={isUsed || isSubmitted}
                              className={`px-3 py-1.5 rounded-lg text-sm font-hanzi font-medium border transition-all ${
                                isUsed
                                  ? 'opacity-30 bg-slate-100 border-slate-200 cursor-not-allowed'
                                  : 'bg-white border-slate-300 hover:border-brand-500 text-slate-800'
                              }`}
                            >
                              {token}
                            </button>
                          );
                        })}
                      </div>

                      {!isSubmitted && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleCheckWordOrder(q.id, q.correct_answer)}
                          disabled={(wordOrderTokens[q.id] || []).length === 0}
                        >
                          Periksa Urutan
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Multiple Choice Exercise */}
                  {q.type === 'multiple_choice' && q.options && (
                    <div className="space-y-2 pt-2">
                      {q.options.map((opt) => {
                        const isChosen = submittedAnswers[q.id] === opt;
                        const isTheCorrectOne = opt === q.correct_answer;

                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() =>
                              !isSubmitted && handleCheckMultipleChoice(q.id, opt, q.correct_answer)
                            }
                            disabled={isSubmitted}
                            className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-hanzi transition-all ${
                              isSubmitted
                                ? isTheCorrectOne
                                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold'
                                  : isChosen
                                  ? 'bg-rose-50 border-rose-500 text-rose-950'
                                  : 'border-slate-200 opacity-60'
                                : 'border-slate-200 hover:border-brand-400 hover:bg-slate-50 text-slate-800'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Explanation feedback */}
                  {isSubmitted && (
                    <div
                      className={`p-3 rounded-lg text-xs leading-relaxed ${
                        isCorrect
                          ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                          : 'bg-rose-50 border border-rose-200 text-rose-900'
                      }`}
                    >
                      <span className="font-bold">Penjelasan: </span>
                      {q.explanation}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* Completion Action Card */}
      <Card className="p-6 text-center space-y-4 bg-gradient-to-b from-white to-brand-50/30 border-brand-200">
        <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center mx-auto">
          <FileCheck className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-slate-900">
          {isCompleted ? 'Pelajaran Ini Sudah Selesai' : 'Siap Menyelesaikan Modul Ini?'}
        </h3>

        <p className="text-xs text-slate-600 max-w-md mx-auto">
          Menandai modul ini sebagai selesai akan mencatat waktu belajar Anda ke target harian dan memperbarui rentetan belajar (streak).
        </p>

        <div className="pt-2 flex items-center justify-center gap-3">
          <Link href="/curriculum">
            <Button variant="outline" size="md">
              Kembali ke Kurikulum
            </Button>
          </Link>

          {!isCompleted ? (
            <Button variant="primary" size="md" onClick={handleFinishLesson}>
              <CheckCircle2 className="w-4 h-4 mr-1.5" /> Tandai Selesai
            </Button>
          ) : (
            <Link href="/quiz">
              <Button variant="primary" size="md">
                Uji Pemahaman di Kuis Harian
              </Button>
            </Link>
          )}
        </div>
      </Card>
    </div>
  );
}
