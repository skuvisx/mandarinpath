'use client';

import React, { useState } from 'react';
import {
  Volume2,
  CheckCircle2,
  XCircle,
  Sparkles,
  RotateCcw,
  Ear,
  Music,
  BookOpen,
} from 'lucide-react';
import { AudioPlayerButton } from '@/components/ui/AudioPlayerButton';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { speechService } from '@/lib/audio/tts';
import { useLearner } from '@/context/LearnerContext';

const TONE_CONTOURS = [
  {
    tone: 'Nada 1 (阴平 • 55)',
    mark: 'ā ē ī ō ū ǖ',
    pitch: '5 → 5 (Tinggi & Datar)',
    path: 'M 10 20 L 90 20',
    color: '#0284c7',
    example: '妈 (mā) — ibu; 高 (gāo) — tinggi',
    tipId: 'Pertahankan suara tinggi dan stabil seperti sedang menahan nada musik.',
  },
  {
    tone: 'Nada 2 (阳平 • 35)',
    mark: 'á é í ó ú ǘ',
    pitch: '3 → 5 (Menanjak Naik)',
    path: 'M 10 65 L 90 18',
    color: '#0d9488',
    example: '麻 (má) — rami/kebas; 来 (lái) — datang',
    tipId: 'Mirip intonasi bertanya "Hah? Apa?" dalam bahasa Indonesia, naik dari tengah ke tinggi.',
  },
  {
    tone: 'Nada 3 (上声 • 214)',
    mark: 'ǎ ě ǐ ǒ ǔ ǚ',
    pitch: '2 → 1 → 4 (Rendah Mengayun)',
    path: 'M 10 58 L 45 85 L 90 35',
    color: '#7c3aed',
    example: '马 (mǎ) — kuda; 好 (hǎo) — baik',
    tipId: 'Di tengah kalimat diucapkan sebagai "setengah nada 3" (cukup turun rendah 2→1 tanpa naik tinggi).',
  },
  {
    tone: 'Nada 4 (去声 • 51)',
    mark: 'à è ì ò ù ǜ',
    pitch: '5 → 1 (Menukik Tegas)',
    path: 'M 10 18 L 90 85',
    color: '#dc2626',
    example: '骂 (mà) — memarahi; 去 (qù) — pergi',
    tipId: 'Jatuhkan suara dari tinggi ke rendah dengan singkat dan tegas, seperti kata seru "Jangan!".',
  },
];

const TONE_PAIR_MATRIX: {
  first: string;
  pairs: { combo: string; hanzi: string; pinyin: string; meaning: string }[];
}[] = [
  {
    first: 'Awalan Nada 1 (55)',
    pairs: [
      { combo: '1 + 1', hanzi: '今天', pinyin: 'jīntiān', meaning: 'hari ini' },
      { combo: '1 + 2', hanzi: '今年', pinyin: 'jīnnián', meaning: 'tahun ini' },
      { combo: '1 + 3', hanzi: '机场', pinyin: 'jīchǎng', meaning: 'bandara' },
      { combo: '1 + 4', hanzi: '知道', pinyin: 'zhīdào', meaning: 'tahu' },
      { combo: '1 + 0', hanzi: '先生', pinyin: 'xiānsheng', meaning: 'tuan / bapak' },
    ],
  },
  {
    first: 'Awalan Nada 2 (35)',
    pairs: [
      { combo: '2 + 1', hanzi: '明天', pinyin: 'míngtiān', meaning: 'besok' },
      { combo: '2 + 2', hanzi: '留学', pinyin: 'liúxué', meaning: 'studi luar negeri' },
      { combo: '2 + 3', hanzi: '牛奶', pinyin: 'niúnǎi', meaning: 'susu sapi' },
      { combo: '2 + 4', hanzi: '习惯', pinyin: 'xíguàn', meaning: 'kebiasaan' },
      { combo: '2 + 0', hanzi: '明白', pinyin: 'míngbai', meaning: 'mengerti' },
    ],
  },
  {
    first: 'Awalan Nada 3 (214)',
    pairs: [
      { combo: '3 + 1', hanzi: '喜欢', pinyin: 'xǐhuan', meaning: 'menyukai' },
      { combo: '3 + 2', hanzi: '起床', pinyin: 'qǐchuáng', meaning: 'bangun tidur' },
      { combo: '3 + 3 → 2 + 3', hanzi: '你好', pinyin: 'nǐ hǎo (ní hǎo)', meaning: 'halo (sandhi)' },
      { combo: '3 + 4', hanzi: '准备', pinyin: 'zhǔnbèi', meaning: 'mempersiapkan' },
      { combo: '3 + 0', hanzi: '我们', pinyin: 'wǒmen', meaning: 'kami / kita' },
    ],
  },
  {
    first: 'Awalan Nada 4 (51)',
    pairs: [
      { combo: '4 + 1', hanzi: '地方', pinyin: 'dìfang', meaning: 'tempat' },
      { combo: '4 + 2', hanzi: '问题', pinyin: 'wèntí', meaning: 'masalah / pertanyaan' },
      { combo: '4 + 3', hanzi: '汉语', pinyin: 'Hànyǔ', meaning: 'bahasa Mandarin' },
      { combo: '4 + 4', hanzi: '现在', pinyin: 'xiànzài', meaning: 'sekarang' },
      { combo: '4 + 0', hanzi: '认识', pinyin: 'rènshi', meaning: 'mengenal' },
    ],
  },
];

interface MinimalPairQuestion {
  id: string;
  targetHanzi: string;
  targetPinyin: string;
  targetMeaning: string;
  contrastNote: string;
  options: { hanzi: string; pinyin: string; meaning: string }[];
  correctIdx: number;
}

const MINIMAL_PAIR_QUIZ: MinimalPairQuestion[] = [
  {
    id: 'mp-1',
    targetHanzi: '买东西',
    targetPinyin: 'mǎi dōngxi',
    targetMeaning: 'membeli barang (买 mǎi = nada 3)',
    contrastNote: '买 (mǎi, nada 3 rendah-mengayun) = membeli vs 卖 (mài, nada 4 menukik tegas) = menjual.',
    options: [
      { hanzi: '买东西', pinyin: 'mǎi dōngxi', meaning: 'membeli barang (Nada 3)' },
      { hanzi: '卖东西', pinyin: 'mài dōngxi', meaning: 'menjual barang (Nada 4)' },
    ],
    correctIdx: 0,
  },
  {
    id: 'mp-2',
    targetHanzi: '水饺',
    targetPinyin: 'shuǐjiǎo',
    targetMeaning: 'pangsit rebus (水饺 shuǐjiǎo = nada 3 + 3)',
    contrastNote: '水饺 (shuǐjiǎo, dibaca shuíjiǎo karena sandhi 3+3) = pangsit rebus vs 睡觉 (shuìjiào, nada 4+4) = tidur.',
    options: [
      { hanzi: '睡觉', pinyin: 'shuìjiào', meaning: 'tidur (Nada 4 + 4)' },
      { hanzi: '水饺', pinyin: 'shuǐjiǎo', meaning: 'pangsit rebus (Nada 3 + 3)' },
    ],
    correctIdx: 1,
  },
  {
    id: 'mp-3',
    targetHanzi: '眼镜',
    targetPinyin: 'yǎnjìng',
    targetMeaning: 'kacamata (镜 jìng = nada 4)',
    contrastNote: '眼睛 (yǎnjing, nada netral di akhir) = mata vs 眼镜 (yǎnjìng, nada 4 tegas di akhir) = kacamata.',
    options: [
      { hanzi: '眼睛', pinyin: 'yǎnjing', meaning: 'mata (Nada 3 + Netral)' },
      { hanzi: '眼镜', pinyin: 'yǎnjìng', meaning: 'kacamata (Nada 3 + Nada 4)' },
    ],
    correctIdx: 1,
  },
  {
    id: 'mp-4',
    targetHanzi: '练习',
    targetPinyin: 'liànxí',
    targetMeaning: 'berlatih (liànxí = nada 4 + nada 2)',
    contrastNote: '联系 (liánxì, nada 2 + 4) = menghubungi vs 练习 (liànxí, nada 4 + 2) = berlatih.',
    options: [
      { hanzi: '练习', pinyin: 'liànxí', meaning: 'berlatih (Nada 4 + Nada 2)' },
      { hanzi: '联系', pinyin: 'liánxì', meaning: 'menghubungi (Nada 2 + Nada 4)' },
    ],
    correctIdx: 0,
  },
  {
    id: 'mp-5',
    targetHanzi: '其实',
    targetPinyin: 'qíshí',
    targetMeaning: 'sebenarnya (qíshí = palatal q + retrofleks sh)',
    contrastNote: 'Perhatikan perbedaan inisial q (lidah datar menyentuh langit-langit depan) dan sh (lidah melengkung ke atas/retrofleks).',
    options: [
      { hanzi: '其实', pinyin: 'qíshí', meaning: 'sebenarnya (qí + shí)' },
      { hanzi: '即使', pinyin: 'jíshǐ', meaning: 'kalaupun / meskipun (jí + shǐ)' },
    ],
    correctIdx: 0,
  },
];

export default function ToneTrainerPage() {
  const { recordStudyActivity } = useLearner();
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  const currentQ = MINIMAL_PAIR_QUIZ[quizIdx];

  const handleSelectOption = (idx: number) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);
    const isCorrect = idx === currentQ.correctIdx;
    if (isCorrect) setScore((s) => s + 1);
    setAnsweredCount((c) => c + 1);
    recordStudyActivity(1, 'tones', 1, isCorrect ? 100 : 0);
  };

  const handleNextQuestion = () => {
    setSelectedOpt(null);
    setQuizIdx((prev) => (prev + 1) % MINIMAL_PAIR_QUIZ.length);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="brand">Akselerator Pelafalan & Pendengaran</Badge>
          <Badge variant="purple">Tone Pair & Minimal Pairs</Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Laboratorium Nada, Pinyin & Pasangan Minimal
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Kunci tercepat memulihkan kefasihan berbicara Mandarin adalah menguasai 20 kombinasi pasangan nada dua suku kata dan perubahan nada (Tone Sandhi).
        </p>
      </div>

      {/* Section 1: Visual Pitch Contour Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {TONE_CONTOURS.map((t) => (
          <Card key={t.tone} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-900">{t.tone}</span>
              <span className="text-xs font-mono font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                {t.mark.split(' ')[0]}
              </span>
            </div>

            {/* Pitch SVG Diagram */}
            <div className="h-20 bg-slate-50 rounded-xl border border-slate-200/80 p-2 relative">
              <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                <line x1="0" y1="20" x2="100" y2="20" stroke="#e2e8f0" strokeDasharray="2,2" strokeWidth="1" />
                <line x1="0" y1="52" x2="100" y2="52" stroke="#e2e8f0" strokeDasharray="2,2" strokeWidth="1" />
                <line x1="0" y1="85" x2="100" y2="85" stroke="#e2e8f0" strokeDasharray="2,2" strokeWidth="1" />
                <path
                  d={t.path}
                  fill="none"
                  stroke={t.color}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="absolute right-2 bottom-1 text-[10px] font-mono text-slate-400">
                {t.pitch}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="font-hanzi font-semibold text-slate-800">{t.example}</span>
              <AudioPlayerButton text={t.example.split(' ')[0]} size="sm" />
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">{t.tipId}</p>
          </Card>
        ))}
      </div>

      {/* Section 2: Minimal Pairs Ear-Training Quiz */}
      <Card className="p-6 border-2 border-brand-100 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Ear className="w-5 h-5 text-brand-600" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Latihan Telinga: Pasangan Minimal (Minimal Pairs)
              </h2>
              <p className="text-xs text-slate-500">
                Dengarkan audio lalu tebak kata dan nada mana yang diucapkan.
              </p>
            </div>
          </div>

          <Badge variant="success">
            Skor Telinga: {score} / {answeredCount} Benar
          </Badge>
        </div>

        <div className="p-4 rounded-xl bg-brand-50/70 border border-brand-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-bold text-brand-800 uppercase tracking-wider">
              Soal #{quizIdx + 1} dari {MINIMAL_PAIR_QUIZ.length}
            </span>
            <p className="text-sm text-slate-700">
              Putar rekaman suara di sebelah kanan, kemudian pilih karakter & nada yang tepat:
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => speechService.speak(currentQ.targetHanzi, { rate: 0.9 })}
          >
            <Volume2 className="w-4 h-4 mr-2" /> Putar Suara Soal
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentQ.options.map((opt, idx) => {
            const isChosen = selectedOpt === idx;
            const isCorrect = idx === currentQ.correctIdx;
            const showResult = selectedOpt !== null;

            return (
              <button
                key={opt.hanzi}
                type="button"
                onClick={() => handleSelectOption(idx)}
                disabled={showResult}
                className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                  showResult
                    ? isCorrect
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-1 ring-emerald-500'
                      : isChosen
                      ? 'bg-rose-50 border-rose-500 text-rose-950'
                      : 'border-slate-200 opacity-60'
                    : 'bg-white border-slate-200 hover:border-brand-400 hover:bg-brand-50/30'
                }`}
              >
                <div>
                  <span className="text-2xl font-extrabold font-hanzi block">{opt.hanzi}</span>
                  <span className="text-sm font-mono font-bold text-brand-700">{opt.pinyin}</span>
                  <span className="block text-xs text-slate-600 mt-0.5">{opt.meaning}</span>
                </div>
                {showResult &&
                  (isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  ) : isChosen ? (
                    <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                  ) : null)}
              </button>
            );
          })}
        </div>

        {selectedOpt !== null && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-slate-900">Analisis Kontras Bunyi: </span>
              <span className="text-slate-700">{currentQ.contrastNote}</span>
            </div>
            <Button size="sm" variant="primary" onClick={handleNextQuestion}>
              Soal Berikutnya
            </Button>
          </div>
        )}
      </Card>

      {/* Section 3: 20 Tone Pair Matrix */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-brand-600" />
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Matriks 20 Kombinasi Pasangan Nada (双音节声调搭配)
            </h2>
            <p className="text-xs text-slate-500">
              Klik kartu mana saja untuk mendengarkan dan menirukan ritme alaminya.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {TONE_PAIR_MATRIX.map((row) => (
            <div key={row.first} className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                {row.first}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {row.pairs.map((p) => (
                  <button
                    key={p.combo}
                    type="button"
                    onClick={() => speechService.speak(p.hanzi, { rate: 0.95 })}
                    className="p-3 rounded-xl border border-slate-200 bg-white hover:border-brand-400 hover:bg-brand-50/30 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 group-hover:text-brand-600">
                      <span>Nada {p.combo}</span>
                      <Volume2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-lg font-extrabold font-hanzi text-slate-900 mt-1">
                      {p.hanzi}
                    </div>
                    <div className="text-xs font-mono text-brand-700 font-semibold">{p.pinyin}</div>
                    <div className="text-[11px] text-slate-500 truncate">{p.meaning}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Section 4: Tone Sandhi Reference Rules */}
      <Card className="p-6 space-y-4 bg-gradient-to-b from-white to-slate-50">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-brand-600" />
          <h2 className="text-lg font-bold text-slate-900">
            3 Hukum Perubahan Nada Wajib (变调规则 — Tone Sandhi)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
            <Badge variant="brand">Hukum 1: Nada 3 + Nada 3</Badge>
            <h3 className="font-bold text-slate-900 text-sm">3 + 3 Berubah Menjadi 2 + 3</h3>
            <p className="text-slate-600 leading-relaxed">
              Ketika dua suku kata bernada ke-3 bertemu berurutan, suku kata pertama wajib diucapkan dengan nada ke-2, meskipun penulisan Pinyin-nya tetap nada ke-3.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-50 font-mono text-slate-800 space-y-1">
              <div>你好 nǐ hǎo → dibaca <strong>ní hǎo</strong></div>
              <div>可以 kěyǐ → dibaca <strong>kéyǐ</strong></div>
              <div>很远 hěn yuǎn → dibaca <strong>hén yuǎn</strong></div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
            <Badge variant="purple">Hukum 2: Perubahan Nada 不 (bù)</Badge>
            <h3 className="font-bold text-slate-900 text-sm">bù Menjadi bú di Depan Nada 4</h3>
            <p className="text-slate-600 leading-relaxed">
              Kata negasi 不 secara default bernada ke-4 (bù), namun berubah menjadi nada ke-2 (bú) ketika diikuti oleh suku kata bernada ke-4.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-50 font-mono text-slate-800 space-y-1">
              <div>不是 bù + shì → <strong>bú shì</strong></div>
              <div>不错 bù + cuò → <strong>bú cuò</strong></div>
              <div>不客气 bù + kèqi → <strong>bú kèqi</strong></div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
            <Badge variant="success">Hukum 3: Perubahan Nada 一 (yī)</Badge>
            <h3 className="font-bold text-slate-900 text-sm">yī → yí (depan Nada 4) / yì (depan 1,2,3)</h3>
            <p className="text-slate-600 leading-relaxed">
              Saat menghitung (一二三), 一 tetap dibaca yī. Di depan nada 4 berubah jadi yí (nada 2); di depan nada 1, 2, atau 3 berubah jadi yì (nada 4).
            </p>
            <div className="p-2.5 rounded-lg bg-slate-50 font-mono text-slate-800 space-y-1">
              <div>一个 yī + gè → <strong>yí gè</strong></div>
              <div>一天 yī + tiān → <strong>yì tiān</strong></div>
              <div>一起 yī + qǐ → <strong>yì qǐ</strong></div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
