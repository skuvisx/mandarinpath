'use client';

import React, { useEffect, useState } from 'react';
import {
  PenTool,
  Search,
  CheckCircle2,
  Sparkles,
  Award,
  Layers,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { HanziStrokePad } from '@/components/writing/HanziStrokePad';
import { fetchHskLevel, RawHskEntry } from '@/lib/hsk/loader';
import { useLearner } from '@/context/LearnerContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function WritingLabPage() {
  const { strokeRecords } = useLearner();

  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [levelWords, setLevelWords] = useState<RawHskEntry[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [customInput, setCustomInput] = useState<string>('');
  const [activeCustomWord, setActiveCustomWord] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    fetchHskLevel('hsk2', selectedLevel).then((data) => {
      if (!mounted) return;
      setLevelWords(data);
      setSelectedIndex(0);
    });
    return () => {
      mounted = false;
    };
  }, [selectedLevel]);

  const filteredWords = levelWords.filter(
    (w) =>
      !searchFilter.trim() ||
      w.s.includes(searchFilter.trim()) ||
      w.p.toLowerCase().includes(searchFilter.toLowerCase()) ||
      w.id.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const currentEntry: RawHskEntry = filteredWords[selectedIndex] ||
    levelWords[0] || {
      s: '汉字',
      p: 'Hànzì',
      id: 'karakter Han / aksara Tionghoa',
      e: ['Chinese character'],
    };

  const targetWord = activeCustomWord || currentEntry.s;
  const targetPinyin = activeCustomWord ? 'Karakter Kustom' : currentEntry.p;
  const targetMeaning = activeCustomWord
    ? 'Ketuk karakter di atas kanvas untuk berlatih urutan guratannya'
    : `${currentEntry.id}${currentEntry.r ? ` • Radikal: ${currentEntry.r} (${currentEntry.rn || ''})` : ''}`;

  const practicedList = Object.values(strokeRecords);
  const masteredCount = practicedList.filter((r) => r.mastered).length;
  const avgAccuracy =
    practicedList.length > 0
      ? Math.round(practicedList.reduce((acc, r) => acc + r.best_accuracy, 0) / practicedList.length)
      : 0;

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = Array.from(customInput)
      .filter((c) => /[\u4e00-\u9fff]/.test(c))
      .join('');
    if (cleaned) {
      setActiveCustomWord(cleaned);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="brand">Lab Menulis Hanzi & Cek Guratan</Badge>
            <Badge variant="purple">HSK 1–6 Stroke Checker</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Latihan Menulis Guratan Hanzi (汉字笔顺练习)
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Tulis langsung di atas kotak kaligrafi MiZiGe menggunakan mouse, layar sentuh (Android/iOS), atau stylus untuk validasi urutan guratan otomatis.
          </p>
        </div>

        {/* Mastery Summary Pills */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-center">
            <span className="block text-[10px] font-bold uppercase text-slate-400">Dilatih</span>
            <span className="text-base font-extrabold text-slate-900">{practicedList.length} 字</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
            <span className="block text-[10px] font-bold uppercase text-emerald-700">Dikuasai</span>
            <span className="text-base font-extrabold text-emerald-700">{masteredCount} 字</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-brand-50 border border-brand-200 text-center">
            <span className="block text-[10px] font-bold uppercase text-brand-700">Akurasi</span>
            <span className="text-base font-extrabold text-brand-700">{avgAccuracy}%</span>
          </div>
        </div>
      </div>

      {/* Level Selector + Custom Hanzi Input */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <Card className="lg:col-span-7 p-4 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Pilih Level HSK:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {[1, 2, 3, 4, 5, 6].map((lv) => (
              <button
                key={lv}
                type="button"
                onClick={() => {
                  setActiveCustomWord(null);
                  setSelectedLevel(lv);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  !activeCustomWord && selectedLevel === lv
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                HSK {lv}
              </button>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-5 p-4">
          <form onSubmit={handleApplyCustom} className="flex items-center gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Ketik/tempel Hanzi apa saja (mis. 永, 龙, 赢)..."
              className="flex-1 px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 font-hanzi"
            />
            <Button type="submit" size="sm" variant="primary">
              Latih Huruf
            </Button>
          </form>
        </Card>
      </div>

      {/* Main Interactive Stroke Canvas */}
      <Card className="p-6 border-2 border-brand-100">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Badge variant="brand">{activeCustomWord ? 'Huruf Kustom' : `HSK ${selectedLevel}`}</Badge>
            {!activeCustomWord && (
              <span className="text-xs text-slate-500 font-medium">
                Kata {selectedIndex + 1} dari {filteredWords.length}
              </span>
            )}
          </div>

          {!activeCustomWord && (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedIndex((prev) => Math.max(0, prev - 1))}
                disabled={selectedIndex === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Sebelumnya
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setSelectedIndex((prev) => Math.min(filteredWords.length - 1, prev + 1))
                }
                disabled={selectedIndex >= filteredWords.length - 1}
              >
                Berikutnya <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </div>

        <HanziStrokePad
          word={targetWord}
          pinyin={targetPinyin}
          meaning={targetMeaning}
          size={270}
          initialMode="quiz"
          onCompleteWord={() => {
            if (!activeCustomWord && selectedIndex + 1 < filteredWords.length) {
              setSelectedIndex((prev) => prev + 1);
            }
          }}
        />
      </Card>

      {/* Character Picker Grid for Current Level */}
      <Card className="p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Daftar Kosakata & Karakter HSK {selectedLevel} ({filteredWords.length} kata)
            </h3>
            <p className="text-xs text-slate-500">
              Klik kata mana saja di bawah untuk langsung melatih urutan guratannya di kanvas atas.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => {
                setSearchFilter(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Cari Hanzi, Pinyin, atau arti..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-80 overflow-y-auto pr-1">
          {filteredWords.slice(0, 180).map((item, idx) => {
            const isSelected = !activeCustomWord && idx === selectedIndex;
            const firstChar = Array.from(item.s)[0];
            const isMastered = Boolean(strokeRecords[firstChar]?.mastered);
            return (
              <button
                key={`${item.s}-${idx}`}
                type="button"
                onClick={() => {
                  setActiveCustomWord(null);
                  setSelectedIndex(idx);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-brand-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold font-hanzi">{item.s}</span>
                  {isMastered && (
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-200' : 'text-emerald-600'}`}
                    />
                  )}
                </div>
                <span
                  className={`block text-[11px] font-mono truncate ${
                    isSelected ? 'text-brand-100' : 'text-brand-700'
                  }`}
                >
                  {item.p}
                </span>
                <span
                  className={`block text-[10px] truncate ${
                    isSelected ? 'text-white/80' : 'text-slate-500'
                  }`}
                >
                  {item.id}
                </span>
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
