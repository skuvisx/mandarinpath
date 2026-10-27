'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  RotateCcw, 
  HelpCircle, 
  Sparkles, 
  Layers, 
  BookOpen, 
  ArrowRight,
  Lightbulb
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AudioPlayerButton } from '@/components/ui/AudioPlayerButton';

interface SentenceExercise {
  id: string;
  pattern: string;
  theme: string;
  meaningIndonesian: string;
  tokens: string[];
  correctOrder: string;
  grammarRule: string;
  explanation: string;
}

const GRAMMAR_EXERCISES: SentenceExercise[] = [
  {
    id: 'gram-1',
    pattern: 'Kalimat 把 (Struktur Disposisi)',
    theme: 'Kehidupan Sehari-hari & Rumah',
    meaningIndonesian: 'Tolong matikan lampu kamar sebelum tidur.',
    tokens: ['睡觉前', '请把', '房间的灯', '关上'],
    correctOrder: '睡觉前 请把 房间的灯 关上',
    grammarRule: 'Keterangan Waktu + 请把 + Objek Spesifik + Kata Kerja + Pelengkap Hasil',
    explanation: 'Dalam kalimat 把, objek (房间的灯) ditarik ke depan kata kerja (关), dan wajib memiliki pelengkap hasil seperti 关上 (mematikan rapat).'
  },
  {
    id: 'gram-2',
    pattern: 'Konstruksi Penekanan 是...的',
    theme: 'Perkenalan & Riwayat Masa Lalu',
    meaningIndonesian: 'Dia datang ke Beijing naik kereta cepat kemarin.',
    tokens: ['他是', '昨天', '坐高铁', '来北京的'],
    correctOrder: '他是 昨天 坐高铁 来北京的',
    grammarRule: 'Subjek + 是 + [Keterangan Waktu / Cara] + Kata Kerja + 的',
    explanation: 'Karena aksi datang ke Beijing sudah terjadi, adalah konstruksi 是...的 yang menekankan cara (坐高铁) dan waktu (昨天).'
  },
  {
    id: 'gram-3',
    pattern: 'Kalimat Perbandingan (比)',
    theme: 'Kampus & Belanja',
    meaningIndonesian: 'Kamus ini 20 Yuan lebih mahal daripada kamus itu.',
    tokens: ['这本词典', '比那本', '贵', '二十块钱'],
    correctOrder: '这本词典 比那本 贵 二十块钱',
    grammarRule: 'Objek A + 比 + Objek B + Kata Sifat + Selisih Harga/Ukuran',
    explanation: 'Dalam perbandingan Mandarin, selisih kuantitas (二十块钱) selalu diletakkan setelah kata sifat predikat (贵).'
  },
  {
    id: 'gram-4',
    pattern: 'Pengalaman Lampau (过)',
    theme: 'Perjalanan & Budaya',
    meaningIndonesian: 'Saya pernah makan bebek panggang Beijing dua kali.',
    tokens: ['我吃过', '两次', '北京烤鸭'],
    correctOrder: '我吃过 两次 北京烤鸭',
    grammarRule: 'Subjek + Kata Kerja + 过 + Frekuensi Waktu + Objek',
    explanation: 'Partikel aspek 过 diletakkan menempel tepat di belakang kata kerja untuk menandai pengalaman yang pernah dilakukan.'
  }
];

export default function GrammarBuilderPage() {
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState(0);
  const [constructedTokens, setConstructedTokens] = useState<string[]>([]);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const activeEx = GRAMMAR_EXERCISES[selectedExerciseIndex];

  const handleAddToken = (token: string) => {
    if (isAnswerChecked) return;
    setConstructedTokens((prev) => [...prev, token]);
  };

  const handleRemoveToken = (indexToRemove: number) => {
    if (isAnswerChecked) return;
    setConstructedTokens((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleCheck = () => {
    const userString = constructedTokens.join(' ');
    const correct = userString.trim() === activeEx.correctOrder.trim();
    setIsCorrect(correct);
    setIsAnswerChecked(true);
  };

  const handleReset = () => {
    setConstructedTokens([]);
    setIsAnswerChecked(false);
    setIsCorrect(false);
  };

  const handleNext = () => {
    handleReset();
    setSelectedExerciseIndex((prev) => (prev + 1) % GRAMMAR_EXERCISES.length);
  };

  // Remaining tokens not yet selected
  const availableTokens = activeEx.tokens.filter((t) => {
    const countInActive = activeEx.tokens.filter((x) => x === t).length;
    const countInConstructed = constructedTokens.filter((x) => x === t).length;
    return countInConstructed < countInActive;
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="brand">Tata Bahasa & Sintaksis</Badge>
          <Badge variant="purple">Penyusun Kalimat Interaktif</Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Laboratorium Penyusun Kalimat Mandarin
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Kuasai hukum urutan kata Mandarin yang sering membingungkan penutur Indonesia melalui latihan token interaktif.
        </p>
      </div>

      {/* Exercise Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {GRAMMAR_EXERCISES.map((ex, idx) => (
          <button
            key={ex.id}
            onClick={() => {
              handleReset();
              setSelectedExerciseIndex(idx);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              selectedExerciseIndex === idx
                ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'
            }`}
          >
            Latihan {idx + 1}: {ex.pattern.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Main Exercise Card */}
      <Card className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <Badge variant="brand" size="sm">{activeEx.theme}</Badge>
            <h3 className="text-lg font-bold text-slate-900 mt-1">{activeEx.pattern}</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Latihan {selectedExerciseIndex + 1} dari {GRAMMAR_EXERCISES.length}
          </span>
        </div>

        {/* Indonesian Target Sentence */}
        <div className="p-4 bg-brand-50/60 rounded-xl border border-brand-100 space-y-1">
          <span className="text-xs font-bold text-brand-800 uppercase tracking-wider">
            Arti Kalimat yang Ingin Disusun:
          </span>
          <p className="text-base font-bold text-slate-900">"{activeEx.meaningIndonesian}"</p>
        </div>

        {/* Word Token Construction Box */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-slate-600 block">
            Slot Susunan Kata Anda (Ketuk token di bawah untuk memasukkan):
          </span>

          <div
            className={`min-h-[64px] p-3 rounded-xl border-2 border-dashed flex flex-wrap gap-2 items-center transition-colors ${
              isAnswerChecked
                ? isCorrect
                  ? 'border-emerald-500 bg-emerald-50/30'
                  : 'border-rose-500 bg-rose-50/30'
                : 'border-slate-300 bg-slate-50'
            }`}
          >
            {constructedTokens.map((token, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleRemoveToken(idx)}
                disabled={isAnswerChecked}
                className="px-3.5 py-1.5 bg-brand-600 text-white rounded-lg text-sm font-hanzi font-bold shadow-xs hover:bg-brand-700 transition-colors flex items-center gap-1.5"
              >
                <span>{token}</span>
                <span className="text-xs text-white/70">✕</span>
              </button>
            ))}

            {constructedTokens.length === 0 && (
              <span className="text-xs text-slate-400 italic">
                Ketuk kata-kata di bawah sesuai urutan tata bahasa yang benar...
              </span>
            )}
          </div>
        </div>

        {/* Available Tokens Pool */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Pilihan Kata:
          </span>
          <div className="flex flex-wrap gap-2.5">
            {activeEx.tokens.map((token, idx) => {
              const isUsed = !availableTokens.includes(token);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddToken(token)}
                  disabled={isUsed || isAnswerChecked}
                  className={`px-4 py-2 rounded-xl text-base font-hanzi font-semibold border transition-all ${
                    isUsed
                      ? 'opacity-30 bg-slate-100 border-slate-200 cursor-not-allowed text-slate-400'
                      : 'bg-white border-slate-300 hover:border-brand-500 hover:bg-brand-50/40 text-slate-800 shadow-2xs'
                  }`}
                >
                  {token}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={constructedTokens.length === 0 && !isAnswerChecked}
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Ulangi
          </Button>

          {!isAnswerChecked ? (
            <Button
              variant="primary"
              size="md"
              onClick={handleCheck}
              disabled={constructedTokens.length === 0}
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" /> Periksa Susunan
            </Button>
          ) : (
            <Button variant="primary" size="md" onClick={handleNext}>
              Soal Selanjutnya <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          )}
        </div>

        {/* Explanation & Audio Feedback */}
        {isAnswerChecked && (
          <div
            className={`p-4 rounded-xl border space-y-3 animate-fade-in ${
              isCorrect
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                : 'bg-rose-50/70 border-rose-200 text-rose-950'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm">
                {isCorrect ? '🎉 Susunan Anda Tepat Sekali!' : '⚠️ Urutan Kata Belum Sesuai Kaidah'}
              </span>
              <AudioPlayerButton text={activeEx.correctOrder.replace(/\s+/g, '')} size="sm" showLabel />
            </div>

            <div className="text-xs space-y-1.5">
              <p>
                <strong>Kunci Kalimat: </strong>
                <span className="font-hanzi font-bold text-sm">
                  {activeEx.correctOrder.replace(/\s+/g, '')}
                </span>
              </p>
              <p>
                <strong>Rumus Pola: </strong>
                <code>{activeEx.grammarRule}</code>
              </p>
              <p className="leading-relaxed">
                <strong>Analisis: </strong>
                {activeEx.explanation}
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
