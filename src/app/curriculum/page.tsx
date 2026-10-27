'use client';

import React from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Layers, 
  ArrowRight, 
  Award,
  AlertCircle 
} from 'lucide-react';
import { useLearner } from '@/context/LearnerContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function CurriculumOverviewPage() {
  const { lessons, lessonProgress, profile } = useLearner();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="brand">Jalur Kurikulum Terstruktur</Badge>
          <Badge variant="purple">HSK 2.0 & 3.0 Bridge</Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Kurikulum Pembelajaran & Sertifikasi HSK
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Diorganisasi berdasarkan kompetensi percakapan nyata dan format standar ujian kemahiran bahasa Mandarin.
        </p>

        {/* HSK Standard Version Explanation Box */}
        <div className="mt-4 p-4 rounded-xl bg-slate-100/90 border border-slate-200 text-xs text-slate-700 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <AlertCircle className="w-4 h-4 text-brand-600" />
            <span>Keterangan Standar Kurikulum: HSK 2.0 vs HSK 3.0</span>
          </div>
          <p className="leading-relaxed">
            MandarinPath menggunakan pendekatan <strong>Bridge HSK 2.0 / 3.0</strong>:
            Tata bahasa dan kosakata inti didasarkan pada HSK 2 dan 3 yang saat ini diujikan secara luas di Indonesia,
            sekaligus menyertakan kolokasi lisan dan kecepatan audio adaptif yang dipersyaratkan dalam standar baru HSK 3.0.
          </p>
        </div>
      </div>

      {/* Module List */}
      <div className="space-y-4">
        {lessons.map((lesson) => {
          const isCompleted = lessonProgress[lesson.id]?.completed;

          return (
            <Card
              key={lesson.id}
              className={`p-6 border transition-all ${
                isCompleted
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : 'border-slate-200 hover:border-brand-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={isCompleted ? 'success' : 'brand'}>{lesson.level}</Badge>
                    <span className="text-xs font-semibold text-slate-500">
                      Modul {lesson.module_number}.{lesson.lesson_number} • {lesson.topic}
                    </span>
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{lesson.title}</h3>

                  <p className="text-sm font-hanzi text-slate-700">
                    {lesson.title_chinese}{' '}
                    <span className="font-sans text-xs text-slate-500 font-normal">
                      ({lesson.title_pinyin})
                    </span>
                  </p>

                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                    {lesson.description}
                  </p>

                  {/* Objectives summary */}
                  <div className="pt-2">
                    <span className="text-xs font-semibold text-slate-700 block mb-1">
                      Target Pembelajaran:
                    </span>
                    <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                      {lesson.learning_objectives.map((obj, i) => (
                        <li key={i}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{lesson.estimated_minutes} Menit</span>
                  </div>

                  <Link href={`/curriculum/${lesson.slug}`}>
                    <Button
                      size="sm"
                      variant={isCompleted ? 'outline' : 'primary'}
                      className="whitespace-nowrap"
                    >
                      {isCompleted ? 'Buka Kembali' : 'Mulai Belajar'}
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
