'use client';

import React, { useState } from 'react';
import { 
  Headphones, 
  Volume2, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Star, 
  Mic, 
  Sparkles, 
  Sliders, 
  AlertCircle,
  Play,
  Square,
  CheckCircle2
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { speechService } from '@/lib/audio/tts';
import { useLearner } from '@/context/LearnerContext';

interface DialogueLine {
  id: string;
  speaker: string;
  chinese: string;
  pinyin: string;
  indonesian: string;
  notes?: string;
}

const LISTENING_DIALOGUES: { id: string; title: string; theme: string; lines: DialogueLine[] }[] = [
  {
    id: 'dia-1',
    title: 'Pemesanan Makanan di Restoran (餐厅点餐)',
    theme: 'Kehidupan Sehari-hari & Kuliner',
    lines: [
      {
        id: 'd1-1',
        speaker: '服务员 (Pelayan)',
        chinese: '您好，请问两位想吃点什么？这是我们的菜单。',
        pinyin: 'Nín hǎo, qǐngwèn liǎng wèi xiǎng chī diǎn shénme? Zhè shì wǒmen de càidān.',
        indonesian: 'Halo, boleh tahu Anda berdua ingin makan apa? Ini buku menu kami.'
      },
      {
        id: 'd1-2',
        speaker: '顾客 (Pelanggan)',
        chinese: '我们要一份宫保鸡丁，一碗酸辣汤，米饭要两碗。',
        pinyin: 'Wǒmen yào yí fèn gōngbǎojīdīng, yì wǎn suānlàtāng, mǐfàn yào liǎng wǎn.',
        indonesian: 'Kami pesan satu porsi ayam kungpao, satu mangkuk sup asam pedas, dan dua mangkuk nasi putih.'
      },
      {
        id: 'd1-3',
        speaker: '服务员 (Pelayan)',
        chinese: '好的，请问对口味有什么要求吗？需要少放辣椒吗？',
        pinyin: 'Hǎo de, qǐngwèn duì kǒuwèi yǒu shénme yāoqiú ma? Xūyào shǎo fàng làjiāo ma?',
        indonesian: 'Baik, apakah ada permintaan khusus untuk rasa? Perlu dikurangi cabainya?'
      },
      {
        id: 'd1-4',
        speaker: '顾客 (Pelanggan)',
        chinese: '请少放一点辣，再给我们来一壶热绿茶，谢谢。',
        pinyin: 'Qǐng shǎo fàng yìdiǎn là, zài gěi wǒmen lái yì hú rè lǜchá, xièxie.',
        indonesian: 'Tolong beri sedikit pedas saja, dan bawakan kami satu teko teh hijau hangat, terima kasih.'
      }
    ]
  },
  {
    id: 'dia-2',
    title: 'Menanyakan Arah di Kampus (校园问路)',
    theme: 'Kehidupan Kampus & Arah',
    lines: [
      {
        id: 'd2-1',
        speaker: '新生 (Mahasiswa Baru)',
        chinese: '学长你好，请问留学生教学楼在哪里？',
        pinyin: 'Xuézhǎng nǐ hǎo, qǐngwèn liúxuéshēng jiàoxuélóu zài nǎlǐ?',
        indonesian: 'Senior halo, boleh tanya gedung perkuliahan mahasiswa asing ada di mana?'
      },
      {
        id: 'd2-2',
        speaker: '学长 (Senior)',
        chinese: '你沿着这条路往前走，过了图书馆后向左拐就是了。',
        pinyin: 'Nǐ yánzhe zhè tiáo lù wǎng qián zǒu, guò le túshūguǎn hòu xiàng zuǒ guǎi jiù shì le.',
        indonesian: 'Kamu jalan menyusuri jalan ini lurus ke depan, setelah melewati perpustakaan belok kiri langsung sampai.'
      }
    ]
  }
];

export default function ListeningLabPage() {
  const { recordStudyActivity } = useLearner() as any;
  const [selectedDialogueId, setSelectedDialogueId] = useState(LISTENING_DIALOGUES[0].id);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [showPinyin, setShowPinyin] = useState(false);
  const [showIndonesian, setShowIndonesian] = useState(false);
  const [activePlayingLineId, setActivePlayingLineId] = useState<string | null>(null);

  // Shadowing interactive state
  const [shadowRatings, setShadowRatings] = useState<Record<string, number>>({});
  const [isRecordingSimulated, setIsRecordingSimulated] = useState<Record<string, boolean>>({});

  const dialogue = LISTENING_DIALOGUES.find((d) => d.id === selectedDialogueId) || LISTENING_DIALOGUES[0];

  const handlePlayLine = (lineId: string, text: string) => {
    if (activePlayingLineId === lineId) {
      speechService.stop();
      setActivePlayingLineId(null);
      return;
    }

    setActivePlayingLineId(lineId);
    speechService.speak(text, {
      rate: playbackSpeed,
      onEnd: () => setActivePlayingLineId(null),
      onError: () => setActivePlayingLineId(null),
    });
  };

  const handlePlayFullDialogue = () => {
    speechService.stop();
    const fullText = dialogue.lines.map((l) => `${l.speaker}。${l.chinese}`).join(' ');
    setActivePlayingLineId('all');
    speechService.speak(fullText, {
      rate: playbackSpeed,
      onEnd: () => setActivePlayingLineId(null),
      onError: () => setActivePlayingLineId(null),
    });
  };

  const handleSimulateShadowingRecord = (lineId: string) => {
    setIsRecordingSimulated((prev) => ({ ...prev, [lineId]: true }));
    setTimeout(() => {
      setIsRecordingSimulated((prev) => ({ ...prev, [lineId]: false }));
    }, 3000);
  };

  const handleRateShadowing = (lineId: string, star: number) => {
    setShadowRatings((prev) => ({ ...prev, [lineId]: star }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="brand">Laboratorium Mendengarkan & Pelafalan</Badge>
          <Badge variant="neutral">Web Speech API Fallback</Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Latihan Menyimak & Shadowing
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Latih telinga Anda untuk menangkap percakapan Mandarin tempo alami dan tirukan intonasinya secara aktif.
        </p>

        {/* Disclaimer on Synthetic Speech and Self Rating */}
        <div className="mt-3 p-3 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <span>
            <strong>Transparansi Audio & Penilaian:</strong> Suara audio dihasilkan menggunakan mesin sintesis peramban (Web Speech API Mandarin zh-CN) tanpa pemutaran otomatis tak terduga. Penilaian shadowing adalah <em>penilaian mandiri (self-assessment)</em> secara jujur untuk memantau kemajuan pelafalan Anda.
          </span>
        </div>
      </div>

      {/* Control Panel: Dialogue selector & Speed */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Pilih Topik Dialog:</span>
            <select
              value={selectedDialogueId}
              onChange={(e) => setSelectedDialogueId(e.target.value)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800"
            >
              {LISTENING_DIALOGUES.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title}
                </option>
              ))}
            </select>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5" /> Kecepatan:
            </span>
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs font-semibold">
              {[0.75, 1.0, 1.25].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    playbackSpeed === speed
                      ? 'bg-brand-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Global Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <Button
            size="sm"
            variant="primary"
            onClick={handlePlayFullDialogue}
            className="text-xs"
          >
            {activePlayingLineId === 'all' ? (
              <>
                <Square className="w-3.5 h-3.5 mr-1" /> Hentikan Audio
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 mr-1" /> Putar Semua Dialog ({playbackSpeed}x)
              </>
            )}
          </Button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPinyin(!showPinyin)}
              className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
                showPinyin
                  ? 'bg-brand-50 border-brand-200 text-brand-700'
                  : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              {showPinyin ? 'Sembunyikan Pinyin' : 'Tampilkan Pinyin'}
            </button>

            <button
              onClick={() => setShowIndonesian(!showIndonesian)}
              className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
                showIndonesian
                  ? 'bg-brand-50 border-brand-200 text-brand-700'
                  : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              {showIndonesian ? 'Sembunyikan Arti ID' : 'Tampilkan Arti ID'}
            </button>
          </div>
        </div>
      </Card>

      {/* Dialogue Lines & Shadowing Player */}
      <div className="space-y-4">
        {dialogue.lines.map((line) => {
          const isPlaying = activePlayingLineId === line.id;
          const isRecording = Boolean(isRecordingSimulated[line.id]);
          const rating = shadowRatings[line.id] || 0;

          return (
            <Card
              key={line.id}
              className={`p-5 transition-all border ${
                isPlaying ? 'border-brand-500 ring-1 ring-brand-500 bg-brand-50/20' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                  {line.speaker}
                </span>

                <button
                  type="button"
                  onClick={() => handlePlayLine(line.id, line.chinese)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isPlaying
                      ? 'bg-brand-600 text-white animate-pulse'
                      : 'bg-brand-50 text-brand-700 hover:bg-brand-100'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isPlaying ? 'Memutar...' : `Dengarkan (${playbackSpeed}x)`}</span>
                </button>
              </div>

              {/* Chinese text */}
              <div className="py-3 space-y-1">
                <p className="text-lg font-bold text-slate-900 font-hanzi tracking-wide">
                  {line.chinese}
                </p>

                {showPinyin && (
                  <p className="text-xs text-brand-700 font-mono">{line.pinyin}</p>
                )}

                {showIndonesian && (
                  <p className="text-xs text-slate-600 italic">{line.indonesian}</p>
                )}
              </div>

              {/* Shadowing Practice Action Bar */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Step 1: Speak Aloud Practice */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={isRecording ? 'danger' : 'outline'}
                    onClick={() => handleSimulateShadowingRecord(line.id)}
                    className="text-xs"
                    disabled={isRecording}
                  >
                    <Mic className="w-3.5 h-3.5 mr-1" />
                    {isRecording ? 'Ucapkan sekarang...' : 'Ucapkan Nyaring (Shadowing)'}
                  </Button>

                  {isRecording && (
                    <span className="text-xs text-rose-600 font-bold animate-pulse">
                      ● Mendengarkan suara Anda...
                    </span>
                  )}
                </div>

                {/* Step 2: Self-Rating (1-5 stars) */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-500 font-medium">Nilai Sendiri:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRateShadowing(line.id, star)}
                        className="p-1 hover:scale-125 transition-transform"
                        title={`Nilai ${star} dari 5 bintang`}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
