'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Layers, 
  BookOpen, 
  Bookmark, 
  BookmarkCheck, 
  Volume2, 
  Check, 
  X, 
  RefreshCw, 
  Eye, 
  Filter, 
  ChevronRight, 
  Flame, 
  Sparkles, 
  Calendar 
} from 'lucide-react';
import { useLearner } from '@/context/LearnerContext';
import { VocabularyItem, ReviewRating, HskLevel } from '@/types';
import { AudioPlayerButton } from '@/components/ui/AudioPlayerButton';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatIntervalLabelIndonesian } from '@/lib/srs/sm2';

export default function VocabularyPage() {
  const { 
    vocabList, 
    vocabProgress, 
    dueCards, 
    recordVocabReview, 
    toggleBookmark 
  } = useLearner();

  const [activeTab, setActiveTab] = useState<'flashcards' | 'dictionary'>('flashcards');

  // Flashcard Review Session State
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [recognitionPassed, setRecognitionPassed] = useState<boolean | null>(null);

  // Dictionary Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);

  // Topics list
  const topics = Array.from(new Set(vocabList.map((v) => v.topic)));

  // Due cards or fallback to all if queue empty
  const reviewQueue = dueCards.length > 0 ? dueCards : vocabList.slice(0, 5);
  const currentCard: VocabularyItem | undefined = reviewQueue[currentCardIndex];
  const currentCardProgress = currentCard ? vocabProgress[currentCard.id] : null;

  const handleNextCard = () => {
    setIsAnswerRevealed(false);
    setRecognitionPassed(null);
    if (currentCardIndex + 1 < reviewQueue.length) {
      setCurrentCardIndex((prev) => prev + 1);
    } else {
      setSessionCompleted(true);
    }
  };

  const handleRateCard = (rating: ReviewRating) => {
    if (!currentCard) return;
    recordVocabReview(currentCard.id, rating);
    handleNextCard();
  };

  const handleRestartSession = () => {
    setCurrentCardIndex(0);
    setIsAnswerRevealed(false);
    setSessionCompleted(false);
    setRecognitionPassed(null);
  };

  // Filter dictionary items
  const filteredVocab = vocabList.filter((item) => {
    const matchesSearch =
      item.hanzi.includes(searchTerm) ||
      item.pinyin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.meaning_id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel = selectedLevel === 'all' || item.hsk_level === selectedLevel;
    const matchesTopic = selectedTopic === 'all' || item.topic === selectedTopic;
    const isBookmarked = Boolean(vocabProgress[item.id]?.is_bookmarked);
    const matchesBookmark = !onlyBookmarked || isBookmarked;

    return matchesSearch && matchesLevel && matchesTopic && matchesBookmark;
  });

  return (
    <div className="space-y-6">
      {/* Header and Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Kamus & Kartu Kosakata (SRS)
            </h1>
            <Badge variant="brand">SuperMemo SM-2</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Pengulangan berjarak terotomatisasi untuk memulihkan daya ingat Hanzi dan pelafalan Pinyin.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-xl">
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
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
            onClick={() => setActiveTab('dictionary')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'dictionary'
                ? 'bg-white text-brand-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Daftar Kosakata Lengkap</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Flashcards SRS */}
      {activeTab === 'flashcards' && (
        <div className="max-w-2xl mx-auto space-y-6">
          {!sessionCompleted && currentCard ? (
            <div className="space-y-4">
              {/* Session Header / Counter */}
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

              {/* Flashcard Box */}
              <Card className="min-h-[380px] p-6 sm:p-8 flex flex-col justify-between border-2 border-slate-200/90 shadow-sm relative overflow-hidden bg-white">
                {/* Level & Topic Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="brand">{currentCard.hsk_level}</Badge>
                    <span className="text-xs text-slate-500 font-medium">{currentCard.topic}</span>
                  </div>
                  <AudioPlayerButton text={currentCard.hanzi} size="md" showLabel />
                </div>

                {/* Question Front: Hanzi Character */}
                <div className="text-center py-6 space-y-3">
                  <div className="text-6xl sm:text-7xl font-bold text-slate-900 font-hanzi tracking-wider hover:scale-105 transition-transform inline-block">
                    {currentCard.hanzi}
                  </div>

                  {/* Recognition Prompt: Does user recognize the Hanzi before revealing? */}
                  {!isAnswerRevealed && (
                    <div className="pt-4 flex flex-col items-center gap-2">
                      <p className="text-xs text-slate-500">
                        Coba lafalkan dan ingat arti dalam bahasa Indonesia sebelum melihat jawaban:
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

                {/* Revealed Back Details */}
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

                    {/* Radical & Etymology */}
                    {currentCard.radicals && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                        <span className="font-bold text-slate-900">Radikal & Komponen: </span>
                        <span>{currentCard.radicals}</span>
                        {currentCard.component_breakdown && (
                          <p className="text-slate-600 mt-0.5">{currentCard.component_breakdown}</p>
                        )}
                      </div>
                    )}

                    {/* Example Sentence with Audio */}
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

                    {/* Confusion Notes if any */}
                    {currentCard.confusion_notes && (
                      <div className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                        <strong>Catatan:</strong> {currentCard.confusion_notes}
                      </div>
                    )}
                  </div>
                )}

                {/* Rating Bar (SM-2 Quality 1 to 5) */}
                {isAnswerRevealed && (
                  <div className="pt-4 border-t border-slate-200/80">
                    <p className="text-xs text-center text-slate-500 font-medium mb-3">
                      Bagaimana tingkat ingatan Anda terhadap kosakata ini?
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      <button
                        onClick={() => handleRateCard(1)}
                        className="p-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100 text-center transition-colors focus:ring-2 focus:ring-rose-400"
                      >
                        <span className="block font-bold text-xs sm:text-sm">Lupa</span>
                        <span className="text-[10px] text-rose-600">Besok lagi</span>
                      </button>

                      <button
                        onClick={() => handleRateCard(2)}
                        className="p-2 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 text-center transition-colors focus:ring-2 focus:ring-amber-400"
                      >
                        <span className="block font-bold text-xs sm:text-sm">Sulit</span>
                        <span className="text-[10px] text-amber-600">+1 hari</span>
                      </button>

                      <button
                        onClick={() => handleRateCard(4)}
                        className="p-2 rounded-xl border border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100 text-center transition-colors focus:ring-2 focus:ring-blue-400"
                      >
                        <span className="block font-bold text-xs sm:text-sm">Cukup</span>
                        <span className="text-[10px] text-blue-600">Interval x EF</span>
                      </button>

                      <button
                        onClick={() => handleRateCard(5)}
                        className="p-2 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-center transition-colors focus:ring-2 focus:ring-emerald-400"
                      >
                        <span className="block font-bold text-xs sm:text-sm">Mudah</span>
                        <span className="text-[10px] text-emerald-600">Mantap!</span>
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          ) : (
            /* Session Completed Screen */
            <Card className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Sesi Review Hari Ini Selesai!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Semua kartu dalam antrean telah diperbarui jadwalnya menggunakan algoritma SM-2.
                Ingatan jangka panjang Anda sedang terbentuk.
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <Button variant="outline" size="sm" onClick={handleRestartSession}>
                  <RefreshCw className="w-4 h-4 mr-1.5" /> Ulangi Sesi Latihan
                </Button>
                <Button variant="primary" size="sm" onClick={() => setActiveTab('dictionary')}>
                  Buka Kamus Kosakata
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Mode 2: Dictionary (Daftar Kosakata Lengkap) */}
      {activeTab === 'dictionary' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari Hanzi (认识), Pinyin (renshi), atau arti bahasa Indonesia..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-colors"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter:</span>
              </div>

              {/* Level Filter */}
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 focus:ring-brand-500"
              >
                <option value="all">Semua Level HSK</option>
                <option value="HSK1">HSK 1</option>
                <option value="HSK2">HSK 2</option>
                <option value="HSK3">HSK 3</option>
                <option value="HSK4">HSK 4</option>
              </select>

              {/* Topic Filter */}
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 focus:ring-brand-500"
              >
                <option value="all">Semua Topik</option>
                {topics.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              {/* Bookmarked Only */}
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
                Menampilkan <strong>{filteredVocab.length}</strong> kosakata
              </span>
            </div>
          </div>

          {/* Vocabulary Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVocab.map((item) => {
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

                  {/* Components or Radicals */}
                  {item.radicals && (
                    <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg">
                      <span className="font-semibold text-slate-700">Komponen:</span> {item.radicals}
                    </div>
                  )}

                  {/* Example */}
                  <div className="pt-2 border-t border-slate-100 flex items-start justify-between gap-2 text-xs">
                    <div>
                      <p className="font-hanzi text-slate-900 font-medium">{item.example_chinese}</p>
                      <p className="text-slate-500 italic mt-0.5">{item.example_indonesian}</p>
                    </div>
                    <AudioPlayerButton text={item.example_chinese} size="sm" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
