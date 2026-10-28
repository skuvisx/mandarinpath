'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Play,
  PenTool,
  RotateCcw,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  Volume2,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AudioPlayerButton } from '@/components/ui/AudioPlayerButton';
import { useLearner } from '@/context/LearnerContext';

interface HanziStrokePadProps {
  word: string;
  pinyin?: string;
  meaning?: string;
  size?: number;
  initialMode?: 'animate' | 'quiz';
  onCompleteWord?: () => void;
}

export function HanziStrokePad({
  word,
  pinyin,
  meaning,
  size = 260,
  initialMode = 'quiz',
  onCompleteWord,
}: HanziStrokePadProps) {
  const { recordStrokePractice, strokeRecords } = useLearner();

  // Extract individual CJK characters from the word
  const chars = Array.from(word).filter((c) => /[\u4e00-\u9fff]/.test(c));
  const [charIndex, setCharIndex] = useState(0);
  const activeChar = chars[charIndex] || word[0] || '汉';

  const containerRef = useRef<HTMLDivElement | null>(null);
  const writerRef = useRef<any>(null);

  const [mode, setMode] = useState<'animate' | 'quiz'>(initialMode);
  const [showOutline, setShowOutline] = useState(true);
  const [speed, setSpeed] = useState<number>(1);
  const [strokeCount, setStrokeCount] = useState<number>(0);
  const [currentStroke, setCurrentStroke] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [lastHintMsg, setLastHintMsg] = useState<string>('Goreskan sesuai urutan guratan standar dari atas ke bawah, kiri ke kanan.');
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [accuracyScore, setAccuracyScore] = useState<number | null>(null);
  const [loadError, setLoadError] = useState<boolean>(false);

  // Reset character index when word changes
  useEffect(() => {
    setCharIndex(0);
  }, [word]);

  const startQuizMode = useCallback(
    (writerInstance: any, totalStrokes: number) => {
      if (!writerInstance) return;
      setQuizCompleted(false);
      setCurrentStroke(0);
      setMistakes(0);
      setAccuracyScore(null);
      setLastHintMsg('Tulis guratan ke-1 pada kotak di atas (bisa pakai mouse, jari di layar sentuh, atau stylus).');

      writerInstance.quiz({
        showHintAfterMisses: 2,
        highlightOnComplete: true,
        markStrokeCorrectAfterMisses: false,
        onCorrectStroke: (data: any) => {
          const nextNum = data.strokeNum + 1;
          setCurrentStroke(nextNum);
          setLastHintMsg(
            nextNum < totalStrokes
              ? `Bagus! Guratan ke-${nextNum} tepat. Lanjutkan guratan ke-${nextNum + 1}.`
              : 'Luar biasa! Seluruh guratan selesai dengan tepat!'
          );
        },
        onMistake: (data: any) => {
          setMistakes(data.totalMistakes);
          setLastHintMsg(
            `Guratan ke-${data.strokeNum + 1} belum tepat (${data.mistakesOnStroke}x). Perhatikan arah awal dan urutan goresan.`
          );
        },
        onComplete: (summary: any) => {
          setQuizCompleted(true);
          const totalM = summary.totalMistakes || 0;
          const acc = Math.max(
            0,
            Math.min(100, Math.round(((totalStrokes * 2 - totalM) / (totalStrokes * 2)) * 100))
          );
          setAccuracyScore(acc);
          setLastHintMsg(`Selesai! Akurasi penulisan "${activeChar}": ${acc}% (${totalM} kesalahan).`);
          recordStrokePractice(activeChar, totalM, totalStrokes, pinyin, meaning);
        },
      });
    },
    [activeChar, meaning, pinyin, recordStrokePractice]
  );

  useEffect(() => {
    let cancelled = false;
    setLoadError(false);
    setQuizCompleted(false);
    setCurrentStroke(0);
    setMistakes(0);
    setAccuracyScore(null);

    async function initWriter() {
      if (!containerRef.current) return;
      containerRef.current.innerHTML = '';

      try {
        const HanziWriterModule = await import('hanzi-writer');
        const HanziWriter = HanziWriterModule.default || HanziWriterModule;

        if (cancelled || !containerRef.current) return;

        const writer = HanziWriter.create(containerRef.current, activeChar, {
          width: size,
          height: size,
          padding: 14,
          showOutline: showOutline,
          showCharacter: mode === 'animate',
          strokeAnimationSpeed: speed,
          delayBetweenStrokes: Math.round(220 / speed),
          strokeColor: '#0f172a',
          radicalColor: '#026bc9',
          outlineColor: '#cbd5e1',
          drawingColor: '#0284c7',
          drawingWidth: 22,
          highlightColor: '#14b8a6',
          onLoadCharDataSuccess: (charData: any) => {
            if (cancelled) return;
            const total = charData?.strokes?.length || 0;
            setStrokeCount(total);
            if (mode === 'quiz') {
              startQuizMode(writer, total);
            } else {
              writer.animateCharacter();
            }
          },
          onLoadCharDataError: () => {
            if (!cancelled) setLoadError(true);
          },
        });

        writerRef.current = writer;
      } catch {
        if (!cancelled) setLoadError(true);
      }
    }

    initWriter();

    return () => {
      cancelled = true;
    };
  }, [activeChar, size, mode, showOutline, speed, startQuizMode]);

  const handleAnimate = () => {
    if (mode !== 'animate') {
      setMode('animate');
    } else if (writerRef.current) {
      writerRef.current.animateCharacter();
    }
  };

  const handleSwitchToQuiz = () => {
    if (mode !== 'quiz') {
      setMode('quiz');
    } else if (writerRef.current) {
      startQuizMode(writerRef.current, strokeCount || 1);
    }
  };

  const existingRecord = strokeRecords[activeChar];

  return (
    <div className="space-y-4">
      {/* Multi-character selector tabs if word has >1 character */}
      {chars.length > 1 && (
        <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100">
          <span className="text-xs font-semibold text-slate-500">
            Pilih Karakter dari Kata <strong className="text-slate-900 font-hanzi">{word}</strong>:
          </span>
          <div className="flex items-center gap-1.5">
            {chars.map((c, idx) => {
              const rec = strokeRecords[c];
              return (
                <button
                  key={`${c}-${idx}`}
                  type="button"
                  onClick={() => setCharIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl font-hanzi text-lg font-bold border transition-all flex items-center gap-1 ${
                    charIndex === idx
                      ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-brand-300'
                  }`}
                >
                  <span>{c}</span>
                  {rec?.mastered && (
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${charIndex === idx ? 'text-emerald-200' : 'text-emerald-600'}`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Left: Interactive MiZiGe Grid Canvas */}
        <div className="md:col-span-6 flex flex-col items-center">
          <div
            className="relative rounded-2xl bg-amber-50/40 border-2 border-slate-300 shadow-inner overflow-hidden select-none touch-none"
            style={{ width: size, height: size }}
          >
            {/* Traditional MiZiGe (米字格) Calligraphy Guide Lines */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <line x1="0" y1="50" x2="100" y2="50" stroke="#e2e8f0" strokeWidth="0.7" strokeDasharray="3,2" />
              <line x1="50" y1="0" x2="50" y2="100" stroke="#e2e8f0" strokeWidth="0.7" strokeDasharray="3,2" />
              <line x1="0" y1="0" x2="100" y2="100" stroke="#f1f5f9" strokeWidth="0.6" strokeDasharray="2,3" />
              <line x1="100" y1="0" x2="0" y2="100" stroke="#f1f5f9" strokeWidth="0.6" strokeDasharray="2,3" />
            </svg>

            {/* Hanzi Writer Target Div */}
            <div ref={containerRef} className="relative z-10 w-full h-full cursor-crosshair" />

            {loadError && (
              <div className="absolute inset-0 z-20 bg-white/95 p-4 flex flex-col items-center justify-center text-center">
                <span className="text-6xl font-hanzi font-bold text-slate-800 mb-2">{activeChar}</span>
                <p className="text-xs text-slate-600">
                  Data vektor guratan untuk karakter ini membutuhkan koneksi internet pada pemuatan pertama.
                </p>
              </div>
            )}
          </div>

          {/* Stroke Progress Counter Pill */}
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
            <Badge variant="brand">
              {strokeCount > 0 ? `${strokeCount} Guratan` : 'Memuat guratan...'}
            </Badge>
            {mode === 'quiz' && strokeCount > 0 && (
              <Badge variant={mistakes === 0 ? 'success' : 'warning'}>
                Progres: {currentStroke}/{strokeCount} • Salah: {mistakes}x
              </Badge>
            )}
            {existingRecord && (
              <Badge variant="purple">
                Rekor: {existingRecord.best_accuracy}% ({existingRecord.times_practiced}x)
              </Badge>
            )}
          </div>
        </div>

        {/* Right: Controls, Feedback & Character Info */}
        <div className="md:col-span-6 space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-extrabold font-hanzi text-slate-900">{activeChar}</span>
                {pinyin && <span className="text-base font-mono font-bold text-brand-700">{pinyin}</span>}
                <AudioPlayerButton text={activeChar} size="sm" />
              </div>
              {meaning && <p className="text-xs sm:text-sm text-slate-600 mt-1">{meaning}</p>}
            </div>

            <Badge variant={mode === 'quiz' ? 'success' : 'brand'}>
              {mode === 'quiz' ? 'Mode Cek Tulis' : 'Mode Animasi'}
            </Badge>
          </div>

          {/* Mode & Outline Controls */}
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={mode === 'quiz' ? 'primary' : 'outline'}
              onClick={handleSwitchToQuiz}
            >
              <PenTool className="w-3.5 h-3.5 mr-1.5" />
              {mode === 'quiz' ? 'Ulangi Tes Tulis' : 'Mulai Tulis & Cek'}
            </Button>

            <Button
              size="sm"
              variant={mode === 'animate' ? 'primary' : 'outline'}
              onClick={handleAnimate}
            >
              <Play className="w-3.5 h-3.5 mr-1.5" />
              Putar Animasi Guratan
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowOutline((prev) => !prev)}
              title="Sembunyikan bayangan karakter untuk menguji ingatan murni"
            >
              {showOutline ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 mr-1" /> Mode Hafalan (Tanpa Bayangan)
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 mr-1" /> Tampilkan Bayangan
                </>
              )}
            </Button>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Kecepatan Animasi:</span>
            {[0.5, 1, 2].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpeed(s)}
                className={`px-2.5 py-1 rounded-lg border font-semibold transition-colors ${
                  speed === s
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Real-time Guidance & Feedback Box */}
          <div
            className={`p-3.5 rounded-xl border text-xs leading-relaxed transition-colors ${
              quizCompleted
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : mistakes > 0
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <div className="font-bold mb-0.5 flex items-center gap-1.5">
              {quizCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Penulisan Karakter Selesai!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-brand-600" />
                  <span>Panduan Guratan Interaktif:</span>
                </>
              )}
            </div>
            <p>{lastHintMsg}</p>

            {quizCompleted && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {charIndex + 1 < chars.length ? (
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => setCharIndex((prev) => prev + 1)}
                  >
                    Lanjut Karakter Berikutnya ({chars[charIndex + 1]}) <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  onCompleteWord && (
                    <Button size="sm" variant="success" onClick={onCompleteWord}>
                      Kata Berikutnya <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  )
                )}
              </div>
            )}
          </div>

          {/* Standard Stroke Order Rules Reminder */}
          <div className="p-3 rounded-xl bg-brand-50/50 border border-brand-100 text-[11px] text-slate-600 space-y-1">
            <span className="font-bold text-brand-900 block">7 Hukum Dasar Urutan Guratan Hanzi (笔顺规则):</span>
            <p>
              1. Datar dulu baru tegak (先横后竖) • 2. Miring kiri dulu baru kanan (先撇后捺) • 3. Atas ke bawah (从上到下) • 4. Kiri ke kanan (从左到右) • 5. Luar dulu baru dalam (先外后内) • 6. Isi dulu baru tutup kotak (先里头后封口) • 7. Tengah dulu baru sisi kiri-kanan (先中间后两边).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
