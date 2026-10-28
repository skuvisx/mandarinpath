'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  Layers,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Check,
  RefreshCw,
  Eye,
  Filter,
  Calendar,
  PenTool,
  Plus,
  Sparkles,
  X,
  Database,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useLearner } from '@/context/LearnerContext';
import { VocabularyItem, ReviewRating } from '@/types';
import {
  fetchHskLevel,
  fetchHskMeta,
  RawHskEntry,
  HskMeta,
  rawEntryToVocabularyItem,
} from '@/lib/hsk/loader';
import { HanziStrokePad } from '@/components/writing/HanziStrokePad';
import { AudioPlayerButton } from '@/components/ui/AudioPlayerButton';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatIntervalLabelIndonesian } from '@/lib/srs/sm2';

function stripTones(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export default function VocabularyPage() {
  const {
    vocabList,
    vocabProgress,
    dueCards,
    recordVocabReview,
    addVocabToSrs,
    toggleBookmark,
  } = useLearner();

  const [activeTab, setActiveTab] = useState<'flashcards' | 'full_hsk' | 'curated'>('full_hsk');

  // Flashcard Review Session State
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [showInlineStrokePad, setShowInlineStrokePad] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Full HSK 1-6 / 3.0 Corpus State
  const [hskStandard, setHskStandard] = useState<'hsk2' | 'hsk3'>('hsk2');
  const [hskLevelNum, setHskLevelNum] = useState<number>(1);
  const [corpusEntries, setCorpusEntries] = useState<RawHskEntry[]>([]);
  const [corpusLoading, setCorpusLoading] = useState<boolean>(false);
  const [meta, setMeta] = useState<HskMeta | null>(null);
  const [corpusSearch, setCorpusSearch] = useState<string>('');
  const [corpusPosFilter, setCorpusPosFilter] = useState<string>('all');
  const [page, setPage] = useState<number>(1);
  const PAGE_SIZE = 48;

  // Interactive Stroke Modal State
  const [strokeModalItem, setStrokeModalItem] = useState<{
    word: string;
    pinyin: string;
    meaning: string;
  } | null>(null);

  // Curated Dictionary Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);

  useEffect(() => {
    fetchHskMeta().then(setMeta);
  }, []);

  useEffect(() => {
    let active = true;
    setCorpusLoading(true);
    fetchHskLevel(hskStandard, hskLevelNum).then((data) => {
      if (!active) return;
      setCorpusEntries(data);
      setPage(1);
      setCorpusLoading(false);
    });
    return () => {
      active = false;
    };
  }, [hskStandard, hskLevelNum]);

  // Review queue
  const reviewQueue = dueCards.length > 0 ? dueCards : vocabList.slice(0, 10);
  const currentCard: VocabularyItem | undefined = reviewQueue[currentCardIndex];
  const currentCardProgress = currentCard ? vocabProgress[currentCard.id] : null;

  const handleNextCard = useCallback(() => {
    setIsAnswerRevealed(false);
    setShowInlineStrokePad(false);
    if (currentCardIndex + 1 < reviewQueue.length) {
      setCurrentCardIndex((prev) => prev + 1);
    } else {
      setSessionCompleted(true);
    }
  }, [currentCardIndex, reviewQueue.length]);

  const handleRateCard = useCallback(
    (rating: ReviewRating) => {
      if (!currentCard) return;
      recordVocabReview(currentCard.id, rating);
      handleNextCard();
    },
    [currentCard, recordVocabReview, handleNextCard]
  );

  // Keyboard shortcuts for Flashcard mode on desktop
  useEffect(() => {
    if (activeTab !== 'flashcards' || sessionCompleted || showInlineStrokePad) return;
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsAnswerRevealed(true);
      } else if (isAnswerRevealed) {
        if (e.key === '1') handleRateCard(1);
        if (e.key === '2') handleRateCard(2);
        if (e.key === '3') handleRateCard(4);
        if (e.key === '4') handleRateCard(5);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeTab, sessionCompleted, showInlineStrokePad, isAnswerRevealed, handleRateCard]);

  const handleRestartSession = () => {
    setCurrentCardIndex(0);
    setIsAnswerRevealed(false);
    setShowInlineStrokePad(false);
    setSessionCompleted(false);
  };

  // POS tags available in current corpus level
  const availablePosTags = useMemo(() => {
    const s = new Set<string>();
    corpusEntries.forEach((e) => (e.pos || []).forEach((p) => s.add(p)));
    return Array.from(s);
  }, [corpusEntries]);

  // Filtered full corpus entries
  const filteredCorpus = useMemo(() => {
    const q = corpusSearch.trim().toLowerCase();
    const qToneless = stripTones(q);
    return corpusEntries.filter((entry) => {
      if (corpusPosFilter !== 'all' && !(entry.pos || []).includes(corpusPosFilter)) {
        return false;
      }
      if (!q) return true;
      return (
        entry.s.includes(q) ||
        (entry.t && entry.t.includes(q)) ||
        entry.p.toLowerCase().includes(q) ||
        stripTones(entry.p).includes(qToneless) ||
        entry.id.toLowerCase().includes(q) ||
        entry.e.some((m) => m.toLowerCase().includes(q))
      );
    });
  }, [corpusEntries, corpusSearch, corpusPosFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredCorpus.length / PAGE_SIZE));
  const pagedCorpus = filteredCorpus.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Set of hanzi already in SRS
  const srsHanziSet = useMemo(() => new Set(vocabList.map((v) => v.hanzi)), [vocabList]);

  // Curated items filter
  const filteredCurated = vocabList.filter((item) => {
    const matchesSearch =
      item.hanzi.includes(searchTerm) ||
      item.pinyin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stripTones(item.pinyin).includes(stripTones(searchTerm)) ||
      item.meaning_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || item.hsk_level === selectedLevel;
    const isBookmarked = Boolean(vocabProgress[item.id]?.is_bookmarked);
    const matchesBookmark = !onlyBookmarked || isBookmarked;
    return matchesSearch && matchesLevel && matchesBookmark;
  });

  const maxLevel = hskStandard === 'hsk2' ? 6 : 7;

  return (
    <div className="space-y-6">
      {/* Header and Mode Switcher */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Kamus Lengkap HSK 1–6 & Kartu SRS
            </h1>
            <Badge variant="brand">4.991 Kata HSK 2.0 + 10.969 Kata HSK 3.0</Badge>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Telusuri seluruh kosakata resmi HSK 1–6 (dan HSK 3.0 Band 1–9), dengarkan pelafalan, latih urutan guratan Hanzi, dan jadwalkan review SM-2.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-200/80 rounded-xl w-full lg:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('full_hsk')}
            className={`flex-1 lg:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'full_hsk'
                ? 'bg-white text-brand-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Kamus Lengkap HSK 1–6</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('flashcards')}
            className={`flex-1 lg:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'flashcards'
                ? 'bg-white text-brand-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Kartu Review SRS</span>
            {dueCards.length > 0 && (
              <span className="px-1.5 py-0.2 bg-rose-100 text-rose-700 rounded-full text-[10px]">
                {dueCards.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('curated')}
            className={`flex-1 lg:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'curated'
                ? 'bg-white text-brand-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Dek SRS Saya ({vocabList.length})</span>
          </button>
        </div>
      </div>

      {/* ==================== TAB 1: FULL HSK 1-6 & HSK 3.0 CORPUS ==================== */}
      {activeTab === 'full_hsk' && (
        <div className="space-y-4">
          {/* Standard Switcher & Level Selector Bar */}
          <Card className="p-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Standar Kurikulum:
                </span>
                <div className="inline-flex p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setHskStandard('hsk2');
                      if (hskLevelNum > 6) setHskLevelNum(6);
                    }}
                    className={`px-3 py-1 rounded-md transition-all ${
                      hskStandard === 'hsk2'
                        ? 'bg-brand-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    HSK 2.0 (Level 1–6 • 4.991 Kata)
                  </button>
                  <button
                    type="button"
                    onClick={() => setHskStandard('hsk3')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      hskStandard === 'hsk3'
                        ? 'bg-brand-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    HSK 3.0 Baru (Level 1–9 • 10.969 Kata)
                  </button>
                </div>
              </div>

              <span className="text-xs text-slate-500">
                Sumber terbuka: CC-CEDICT (CC BY-SA 4.0) & HSK Wordlists (MIT)
              </span>
            </div>

            {/* Level Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {Array.from({ length: maxLevel }, (_, i) => i + 1).map((lv) => {
                const count =
                  hskStandard === 'hsk2' ? meta?.hsk2?.[lv] : meta?.hsk3?.[lv];
                const isSelected = hskLevelNum === lv;
                return (
                  <button
                    key={lv}
                    type="button"
                    onClick={() => setHskLevelNum(lv)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-brand-300'
                    }`}
                  >
                    <span>{lv === 7 ? 'HSK 7–9 (Mahir)' : `HSK ${lv}`}</span>
                    {count !== undefined && (
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {count} kata
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Search & POS Filter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={corpusSearch}
                  onChange={(e) => {
                    setCorpusSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder={`Cari di HSK ${hskLevelNum === 7 ? '7–9' : hskLevelNum}: Hanzi, Pinyin (mis. xihuan / xǐhuan), arti Indonesia atau Inggris...`}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>

              <select
                value={corpusPosFilter}
                onChange={(e) => {
                  setCorpusPosFilter(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700"
              >
                <option value="all">Semua Kelas Kata</option>
                {availablePosTags.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>

              <span className="text-xs text-slate-500 whitespace-nowrap self-center">
                Ditemukan: <strong className="text-slate-900">{filteredCorpus.length}</strong> kata
              </span>
            </div>
          </Card>

          {/* Corpus Grid */}
          {corpusLoading ? (
            <Card className="p-12 text-center text-sm text-slate-500">
              Memuat daftar kosakata HSK {hskLevelNum}...
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {pagedCorpus.map((entry, idx) => {
                  const inSrs = srsHanziSet.has(entry.s);
                  return (
                    <div
                      key={`${entry.s}-${idx}`}
                      className="p-4 bg-white rounded-xl border border-slate-200/90 hover:border-brand-300 transition-all shadow-2xs flex flex-col justify-between gap-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className="text-2xl font-extrabold text-slate-900 font-hanzi">
                                {entry.s}
                              </span>
                              {entry.t && (
                                <span
                                  className="text-sm text-slate-400 font-hanzi"
                                  title="Karakter Tradisional"
                                >
                                  ({entry.t})
                                </span>
                              )}
                              <span className="text-sm font-bold text-brand-700 font-mono">
                                {entry.p}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <AudioPlayerButton text={entry.s} size="sm" />
                            {entry.o && <Badge variant="brand">HSK {entry.o}</Badge>}
                            {entry.n && (
                              <Badge variant="purple">
                                3.0 L{entry.n === 7 ? '7–9' : entry.n}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Indonesian Meaning */}
                        <p className="text-sm font-semibold text-slate-800 leading-snug">
                          {entry.id}
                        </p>

                        {/* English CC-CEDICT Secondary Gloss */}
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                          <span className="font-semibold text-slate-400">EN:</span>{' '}
                          {entry.e.join('; ')}
                        </p>

                        {/* POS, Radical & Frequency metadata */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-500">
                          {entry.pos && entry.pos.length > 0 && (
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                              {entry.pos.slice(0, 2).join(', ')}
                            </span>
                          )}
                          {entry.r && (
                            <span
                              className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200/60"
                              title={entry.rn || 'Radikal Kangxi'}
                            >
                              Radikal: <strong className="font-hanzi">{entry.r}</strong>
                              {entry.rn ? ` (${entry.rn.split('(')[0].trim()})` : ''}
                            </span>
                          )}
                          {entry.f && (
                            <span className="text-slate-400 ml-auto" title="Peringkat frekuensi kata">
                              #{entry.f}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons: Practice Strokes & Add to SRS */}
                      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setStrokeModalItem({
                              word: entry.s,
                              pinyin: entry.p,
                              meaning: entry.id,
                            })
                          }
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                        >
                          <PenTool className="w-3.5 h-3.5" />
                          <span>Tulis Guratan</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (!inSrs) {
                              addVocabToSrs(rawEntryToVocabularyItem(entry));
                            }
                          }}
                          disabled={inSrs}
                          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                            inSrs
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                              : 'bg-brand-600 text-white hover:bg-brand-700 shadow-2xs'
                          }`}
                        >
                          {inSrs ? (
                            <>
                              <Check className="w-3.5 h-3.5" /> Di Dek SRS
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" /> + Dek SRS
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Halaman Sebelumnya
                  </Button>
                  <span className="text-xs font-semibold text-slate-600">
                    Halaman {page} dari {totalPages} ({filteredCorpus.length} kosakata)
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Halaman Berikutnya <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ==================== TAB 2: FLASHCARDS SRS ==================== */}
      {activeTab === 'flashcards' && (
        <div className="max-w-2xl mx-auto space-y-6">
          {!sessionCompleted && currentCard ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold uppercase tracking-wider">
                  Kartu {currentCardIndex + 1} dari {reviewQueue.length}
                </span>

                <div className="flex items-center gap-3">
                  {currentCardProgress && (
                    <span className="flex items-center gap-1 text-slate-600">
                      <Calendar className="w-3.5 h-3.5 text-brand-600" />
                      Interval: {formatIntervalLabelIndonesian(currentCardProgress.interval_days)}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => toggleBookmark(currentCard.id)}
                    className="p-1.5 text-slate-400 hover:text-amber-500 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Tandai / Bookmark Kosakata Ini"
                  >
                    {currentCardProgress?.is_bookmarked ? (
                      <BookmarkCheck className="w-5 h-5 text-amber-500 fill-amber-500" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Card className="min-h-[380px] p-6 sm:p-8 flex flex-col justify-between border-2 border-slate-200/90 shadow-sm relative overflow-hidden bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="brand">{currentCard.hsk_level}</Badge>
                    <span className="text-xs text-slate-500 font-medium">{currentCard.topic}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant={showInlineStrokePad ? 'primary' : 'outline'}
                      onClick={() => setShowInlineStrokePad((prev) => !prev)}
                    >
                      <PenTool className="w-3.5 h-3.5 mr-1" />
                      {showInlineStrokePad ? 'Tutup Kanvas Tulis' : 'Uji Tulis Guratan'}
                    </Button>
                    <AudioPlayerButton text={currentCard.hanzi} size="md" showLabel />
                  </div>
                </div>

                {/* Inline Stroke Pad or Character Display */}
                {showInlineStrokePad ? (
                  <div className="py-4">
                    <HanziStrokePad
                      word={currentCard.hanzi}
                      pinyin={currentCard.pinyin}
                      meaning={currentCard.meaning_id}
                      size={230}
                      initialMode="quiz"
                    />
                  </div>
                ) : (
                  <div className="text-center py-6 space-y-3">
                    <div className="text-6xl sm:text-7xl font-bold text-slate-900 font-hanzi tracking-wider hover:scale-105 transition-transform inline-block">
                      {currentCard.hanzi}
                    </div>

                    {!isAnswerRevealed && (
                      <div className="pt-4 flex flex-col items-center gap-2">
                        <p className="text-xs text-slate-500">
                          Ingat Pinyin dan arti bahasa Indonesianya sebelum membuka jawaban (Pintasan: Spasi):
                        </p>
                        <Button
                          variant="primary"
                          size="md"
                          onClick={() => setIsAnswerRevealed(true)}
                          className="mt-2"
                        >
                          <Eye className="w-4 h-4 mr-2" /> Buka Arti & Pinyin
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {isAnswerRevealed && (
                  <div className="pt-4 border-t border-slate-100 space-y-4 animate-fade-in">
                    <div className="text-center space-y-1">
                      <div className="text-xl sm:text-2xl font-bold text-brand-700 font-mono">
                        {currentCard.pinyin}
                      </div>
                      <div className="text-base font-semibold text-slate-800">
                        {currentCard.meaning_id}
                      </div>
                      <span className="inline-block text-xs text-slate-500 italic bg-slate-50 px-2 py-0.5 rounded">
                        {currentCard.part_of_speech}
                      </span>
                    </div>

                    {currentCard.radicals && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                        <span className="font-bold text-slate-900">Radikal & Komponen: </span>
                        <span>{currentCard.radicals}</span>
                        {currentCard.component_breakdown && (
                          <p className="text-slate-600 mt-0.5">{currentCard.component_breakdown}</p>
                        )}
                      </div>
                    )}

                    <div className="p-3.5 rounded-xl bg-brand-50/50 border border-brand-100 flex items-start justify-between gap-3">
                      <div className="space-y-0.5 text-xs">
                        <p className="font-hanzi text-sm text-slate-900 font-semibold">
                          {currentCard.example_chinese}
                        </p>
                        <p className="text-slate-500 font-mono text-[11px]">{currentCard.example_pinyin}</p>
                        <p className="text-slate-700 italic pt-0.5">{currentCard.example_indonesian}</p>
                      </div>
                      <AudioPlayerButton text={currentCard.example_chinese} size="sm" />
                    </div>

                    {currentCard.confusion_notes && (
                      <div className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                        <strong>Catatan:</strong> {currentCard.confusion_notes}
                      </div>
                    )}
                  </div>
                )}

                {isAnswerRevealed && (
                  <div className="pt-4 border-t border-slate-200/80">
                    <p className="text-xs text-center text-slate-500 font-medium mb-3">
                      Bagaimana tingkat ingatan Anda terhadap kosakata ini? (Pintasan keyboard: 1–4)
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      <button
                        type="button"
                        onClick={() => handleRateCard(1)}
                        className="p-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100 text-center transition-colors"
                      >
                        <span className="block font-bold text-xs sm:text-sm">1. Lupa</span>
                        <span className="text-[10px] text-rose-600">Ulang besok</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRateCard(2)}
                        className="p-2 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 text-center transition-colors"
                      >
                        <span className="block font-bold text-xs sm:text-sm">2. Sulit</span>
                        <span className="text-[10px] text-amber-600">+1 hari</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRateCard(4)}
                        className="p-2 rounded-xl border border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100 text-center transition-colors"
                      >
                        <span className="block font-bold text-xs sm:text-sm">3. Cukup</span>
                        <span className="text-[10px] text-blue-600">Interval × EF</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRateCard(5)}
                        className="p-2 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-center transition-colors"
                      >
                        <span className="block font-bold text-xs sm:text-sm">4. Mudah</span>
                        <span className="text-[10px] text-emerald-600">Mantap!</span>
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          ) : (
            <Card className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Sesi Review Hari Ini Selesai!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Semua kartu dalam antrean telah diperbarui jadwalnya menggunakan algoritma SM-2. Anda dapat menambah kosakata baru dari tab Kamus Lengkap HSK 1–6 kapan saja.
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <Button variant="outline" size="sm" onClick={handleRestartSession}>
                  <RefreshCw className="w-4 h-4 mr-1.5" /> Ulangi Sesi Latihan
                </Button>
                <Button variant="primary" size="sm" onClick={() => setActiveTab('full_hsk')}>
                  Telusuri Kamus HSK 1–6
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* ==================== TAB 3: CURATED & PERSONAL SRS DECK ==================== */}
      {activeTab === 'curated' && (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari di Dek SRS Anda: Hanzi, Pinyin, atau arti Indonesia..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter:</span>
              </div>

              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700"
              >
                <option value="all">Semua Level (HSK 1–6)</option>
                <option value="HSK1">HSK 1</option>
                <option value="HSK2">HSK 2</option>
                <option value="HSK3">HSK 3</option>
                <option value="HSK4">HSK 4</option>
                <option value="HSK5">HSK 5</option>
                <option value="HSK6">HSK 6</option>
              </select>

              <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-white cursor-pointer select-none text-slate-700">
                <input
                  type="checkbox"
                  checked={onlyBookmarked}
                  onChange={(e) => setOnlyBookmarked(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
                <span>Hanya yang Ditandai (★)</span>
              </label>

              <span className="ml-auto text-slate-400">
                Menampilkan <strong>{filteredCurated.length}</strong> kosakata di Dek SRS
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCurated.map((item) => {
              const progress = vocabProgress[item.id];
              const isBookmarked = Boolean(progress?.is_bookmarked);

              return (
                <div
                  key={item.id}
                  className="p-4 bg-white rounded-xl border border-slate-200/90 hover:border-brand-300 transition-all shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-slate-900 font-hanzi">
                          {item.hanzi}
                        </span>
                        <span className="text-sm font-semibold text-brand-700 font-mono">
                          {item.pinyin}
                        </span>
                        <AudioPlayerButton text={item.hanzi} size="sm" />
                      </div>
                      <p className="text-sm font-medium text-slate-800 mt-1">{item.meaning_id}</p>
                      <span className="text-[11px] text-slate-400 italic">{item.part_of_speech}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Badge variant="brand">{item.hsk_level}</Badge>
                      <button
                        type="button"
                        onClick={() =>
                          setStrokeModalItem({
                            word: item.hanzi,
                            pinyin: item.pinyin,
                            meaning: item.meaning_id,
                          })
                        }
                        className="p-1.5 rounded-lg text-slate-500 hover:text-brand-700 hover:bg-brand-50"
                        title="Latih menulis guratan karakter ini"
                      >
                        <PenTool className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleBookmark(item.id)}
                        className="p-1 text-slate-400 hover:text-amber-500"
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {item.radicals && (
                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg space-y-0.5">
                      <div>
                        <span className="font-semibold text-slate-800">Radikal:</span> {item.radicals}
                      </div>
                      {item.component_breakdown && (
                        <div className="text-slate-500">{item.component_breakdown}</div>
                      )}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex items-start justify-between gap-2 text-xs">
                    <div>
                      <p className="font-hanzi text-slate-900 font-medium">{item.example_chinese}</p>
                      <p className="text-slate-400 font-mono text-[11px]">{item.example_pinyin}</p>
                      <p className="text-slate-600 italic mt-0.5">{item.example_indonesian}</p>
                    </div>
                    <AudioPlayerButton text={item.example_chinese} size="sm" />
                  </div>

                  {item.confusion_notes && (
                    <div className="text-[11px] text-amber-900 bg-amber-50/80 px-2.5 py-1.5 rounded-lg border border-amber-200/70">
                      <strong>Tips Pemakaian:</strong> {item.confusion_notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Interactive Stroke Order & Writing Checker Modal */}
      {strokeModalItem && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setStrokeModalItem(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <Badge variant="brand">Kanvas Kaligrafi & Pengecek Guratan</Badge>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                  Latihan Menulis: <span className="font-hanzi">{strokeModalItem.word}</span> ({strokeModalItem.pinyin})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setStrokeModalItem(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <HanziStrokePad
              word={strokeModalItem.word}
              pinyin={strokeModalItem.pinyin}
              meaning={strokeModalItem.meaning}
              size={250}
              initialMode="quiz"
            />
          </div>
        </div>
      )}
    </div>
  );
}
