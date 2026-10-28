'use client';

import React, { useState, useRef } from 'react';
import {
  Volume2,
  Star,
  Mic,
  Sliders,
  AlertCircle,
  Play,
  Square,
  Headphones,
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
}

const LISTENING_DIALOGUES: { id: string; title: string; level: string; theme: string; lines: DialogueLine[] }[] = [
  {
    id: 'dia-1',
    title: 'Pemesanan Makanan di Restoran (餐厅点餐)',
    level: 'HSK 2–3',
    theme: 'Kehidupan Sehari-hari & Kuliner',
    lines: [
      {
        id: 'd1-1',
        speaker: '服务员 (Pelayan)',
        chinese: '您好，请问两位想吃点什么？这是我们的菜单。',
        pinyin: 'Nín hǎo, qǐngwèn liǎng wèi xiǎng chī diǎn shénme? Zhè shì wǒmen de càidān.',
        indonesian: 'Halo, boleh tahu Anda berdua ingin makan apa? Ini buku menu kami.',
      },
      {
        id: 'd1-2',
        speaker: '顾客 (Pelanggan)',
        chinese: '我们要一份宫保鸡丁，一碗酸辣汤，米饭要两碗。',
        pinyin: 'Wǒmen yào yí fèn gōngbǎojīdīng, yì wǎn suānlàtāng, mǐfàn yào liǎng wǎn.',
        indonesian: 'Kami pesan satu porsi ayam kungpao, satu mangkuk sup asam pedas, dan dua mangkuk nasi putih.',
      },
      {
        id: 'd1-3',
        speaker: '服务员 (Pelayan)',
        chinese: '好的，请问对口味有什么要求吗？需要少放辣椒吗？',
        pinyin: 'Hǎo de, qǐngwèn duì kǒuwèi yǒu shénme yāoqiú ma? Xūyào shǎo fàng làjiāo ma?',
        indonesian: 'Baik, apakah ada permintaan khusus untuk rasa? Perlu dikurangi cabainya?',
      },
      {
        id: 'd1-4',
        speaker: '顾客 (Pelanggan)',
        chinese: '请少放一点辣，再给我们来一壶热绿茶，谢谢。',
        pinyin: 'Qǐng shǎo fàng yìdiǎn là, zài gěi wǒmen lái yì hú rè lǜchá, xièxie.',
        indonesian: 'Tolong beri sedikit pedas saja, dan bawakan kami satu teko teh hijau hangat, terima kasih.',
      },
    ],
  },
  {
    id: 'dia-2',
    title: 'Menanyakan Arah di Kampus (校园问路)',
    level: 'HSK 2–3',
    theme: 'Kehidupan Kampus & Arah',
    lines: [
      {
        id: 'd2-1',
        speaker: '新生 (Mahasiswa Baru)',
        chinese: '学长你好，请问留学生教学楼在哪里？',
        pinyin: 'Xuézhǎng nǐ hǎo, qǐngwèn liúxuéshēng jiàoxuélóu zài nǎlǐ?',
        indonesian: 'Halo Kak Senior, boleh tanya gedung perkuliahan mahasiswa asing ada di mana?',
      },
      {
        id: 'd2-2',
        speaker: '学长 (Senior)',
        chinese: '你沿着这条路往前走，过了图书馆后向左拐就是了。',
        pinyin: 'Nǐ yánzhe zhè tiáo lù wǎng qián zǒu, guò le túshūguǎn hòu xiàng zuǒ guǎi jiù shì le.',
        indonesian: 'Kamu jalan menyusuri jalan ini lurus ke depan, setelah melewati perpustakaan belok kiri langsung sampai.',
      },
    ],
  },
  {
    id: 'dia-3',
    title: 'Rapat Proyek Lintas Negara (跨国项目会议)',
    level: 'HSK 4–5',
    theme: 'Dunia Kerja & Kolaborasi',
    lines: [
      {
        id: 'd3-1',
        speaker: '王经理 (Manajer Wang)',
        chinese: '这次跟印尼分公司的合作项目进展得非常顺利，大家的沟通效率很高。',
        pinyin: 'Zhè cì gēn Yìnní fēngōngsī de hézuò xiàngmù jìnzhǎn de fēicháng shùnlì, dàjiā de gōutōng xiàolǜ hěn gāo.',
        indonesian: 'Proyek kerja sama dengan cabang Indonesia kali ini berjalan sangat lancar, efisiensi komunikasi semuanya sangat tinggi.',
      },
      {
        id: 'd3-2',
        speaker: '李明 (Li Ming)',
        chinese: '是的，我们把客户提出的关键需求都整理好了，下午就可以发给他们确认。',
        pinyin: 'Shì de, wǒmen bǎ kèhù tíchū de guānjiàn xūqiú dōu zhěnglǐ hǎo le, xiàwǔ jiù kěyǐ fā gěi tāmen quèrèn.',
        indonesian: 'Benar, kami telah merapikan semua kebutuhan utama yang diajukan klien, sore ini sudah bisa dikirimkan kepada mereka untuk dikonfirmasi.',
      },
    ],
  },
];

export default function ListeningLabPage() {
  const { recordStudyActivity } = useLearner();
  const [selectedDialogueId, setSelectedDialogueId] = useState(LISTENING_DIALOGUES[0].id);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [showPinyin, setShowPinyin] = useState(true);
  const [showIndonesian, setShowIndonesian] = useState(true);
  const [activePlayingLineId, setActivePlayingLineId] = useState<string | null>(null);

  // Real Microphone Recording State (MediaRecorder)
  const [recordingLineId, setRecordingLineId] = useState<string | null>(null);
  const [recordedAudioUrls, setRecordedAudioUrls] = useState<Record<string, string>>({});
  const [micError, setMicError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Self-assessment star ratings
  const [shadowRatings, setShadowRatings] = useState<Record<string, number>>({});

  const dialogue =
    LISTENING_DIALOGUES.find((d) => d.id === selectedDialogueId) || LISTENING_DIALOGUES[0];

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
    if (activePlayingLineId === 'all') {
      setActivePlayingLineId(null);
      return;
    }
    const fullText = dialogue.lines.map((l) => l.chinese).join('。');
    setActivePlayingLineId('all');
    speechService.speak(fullText, {
      rate: playbackSpeed,
      onEnd: () => {
        setActivePlayingLineId(null);
        recordStudyActivity(3, 'listening', dialogue.lines.length);
      },
      onError: () => setActivePlayingLineId(null),
    });
  };

  const handleToggleRecordVoice = async (lineId: string) => {
    setMicError(null);
    if (recordingLineId === lineId && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecordingLineId(null);
      return;
    }

    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      setMicError('Peramban ini tidak mendukung perekaman mikrofon langsung. Silakan ucapkan nyaring secara mandiri lalu beri penilaian bintang.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrls((prev) => ({ ...prev, [lineId]: url }));
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecordingLineId(lineId);
    } catch {
      setMicError('Izin mikrofon belum diberikan atau mikrofon tidak terdeteksi. Anda tetap dapat berlatih mengucapkan secara nyaring dan memberi nilai mandiri.');
    }
  };

  const handleRateShadowing = (lineId: string, star: number) => {
    setShadowRatings((prev) => ({ ...prev, [lineId]: star }));
    recordStudyActivity(2, 'listening', 1, star * 20);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="brand">Laboratorium Mendengarkan & Shadowing</Badge>
          <Badge variant="purple">Perekam Suara Mandiri</Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Latihan Menyimak & Perekam Shadowing
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Dengarkan dialog dengan kecepatan 0.75x–1.25x, rekam suara Anda sendiri melalui mikrofon untuk membandingkan intonasi, lalu beri penilaian mandiri.
        </p>

        <div className="mt-3 p-3 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <span>
            <strong>Transparansi Audio & Penilaian:</strong> Suara model menggunakan sintesis Web Speech API Mandarin (`zh-CN`). Perekam mikrofon menyimpan audio sementara di memori peramban Anda agar Anda dapat memutar ulang dan membandingkannya langsung dengan model.
          </span>
        </div>

        {micError && (
          <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
            {micError}
          </div>
        )}
      </div>

      {/* Control Panel */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Pilih Dialog:</span>
            <select
              value={selectedDialogueId}
              onChange={(e) => setSelectedDialogueId(e.target.value)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800"
            >
              {LISTENING_DIALOGUES.map((d) => (
                <option key={d.id} value={d.id}>
                  [{d.level}] {d.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5" /> Kecepatan:
            </span>
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs font-semibold">
              {[0.75, 1.0, 1.25].map((speed) => (
                <button
                  key={speed}
                  type="button"
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

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <Button size="sm" variant="primary" onClick={handlePlayFullDialogue} className="text-xs">
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
              type="button"
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
              type="button"
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

      {/* Dialogue Lines & Shadowing Recorder */}
      <div className="space-y-4">
        {dialogue.lines.map((line) => {
          const isPlaying = activePlayingLineId === line.id;
          const isRecording = recordingLineId === line.id;
          const recordedUrl = recordedAudioUrls[line.id];
          const rating = shadowRatings[line.id] || 0;

          return (
            <Card
              key={line.id}
              className={`p-5 transition-all border ${
                isPlaying
                  ? 'border-brand-500 ring-1 ring-brand-500 bg-brand-50/20'
                  : 'border-slate-200'
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
                  <span>{isPlaying ? 'Memutar...' : `Putar Model (${playbackSpeed}x)`}</span>
                </button>
              </div>

              <div className="py-3 space-y-1">
                <p className="text-lg font-bold text-slate-900 font-hanzi tracking-wide">
                  {line.chinese}
                </p>

                {showPinyin && <p className="text-xs text-brand-700 font-mono">{line.pinyin}</p>}

                {showIndonesian && (
                  <p className="text-xs text-slate-600 italic">{line.indonesian}</p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    variant={isRecording ? 'danger' : 'outline'}
                    onClick={() => handleToggleRecordVoice(line.id)}
                    className="text-xs"
                  >
                    <Mic className="w-3.5 h-3.5 mr-1.5" />
                    {isRecording ? 'Hentikan Rekaman' : 'Rekam Suara Saya'}
                  </Button>

                  {isRecording && (
                    <span className="text-xs text-rose-600 font-bold animate-pulse">
                      ● Merekam mikrofon...
                    </span>
                  )}

                  {recordedUrl && !isRecording && (
                    <audio
                      controls
                      src={recordedUrl}
                      className="h-8 max-w-[200px]"
                      title="Putar rekaman suara Anda"
                    />
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-500 font-medium">Nilai Kemiripan:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
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
