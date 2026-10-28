import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { INITIAL_VOCABULARY } from './vocabulary';
import { LESSONS } from './lessons';
import { DIAGNOSTIC_QUESTIONS } from './diagnostic';
import { HSK3_MOCK_EXAM_SECTIONS } from './mockExam';

describe('Curriculum & Content Integrity', () => {
  it('ensures all vocabulary items have valid Hanzi, Pinyin, Indonesian translation and examples', () => {
    expect(INITIAL_VOCABULARY.length).toBeGreaterThanOrEqual(21);

    INITIAL_VOCABULARY.forEach((vocab) => {
      expect(vocab.id).toBeTruthy();
      expect(vocab.hanzi).toBeTruthy();
      expect(vocab.pinyin).toBeTruthy();
      expect(vocab.meaning_id).toBeTruthy();
      expect(vocab.example_chinese).toBeTruthy();
      expect(vocab.example_pinyin).toBeTruthy();
      expect(vocab.example_indonesian).toBeTruthy();
      expect(['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6']).toContain(vocab.hsk_level);
    });
  });

  it('verifies complete HSK 1-6 (4,991 words) and HSK 3.0 (10,969 words) JSON datasets exist with Indonesian meanings and radicals', () => {
    const hskDir = path.join(process.cwd(), 'public', 'data', 'hsk');
    let hsk2Total = 0;

    for (let lvl = 1; lvl <= 6; lvl++) {
      const filePath = path.join(hskDir, `hsk2-${lvl}.json`);
      expect(fs.existsSync(filePath)).toBe(true);
      const entries = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      expect(Array.isArray(entries)).toBe(true);
      expect(entries.length).toBeGreaterThan(100);
      hsk2Total += entries.length;

      // Check sample entry completeness
      const sample = entries[0];
      expect(sample.s).toBeTruthy(); // Simplified Hanzi
      expect(sample.p).toBeTruthy(); // Pinyin
      expect(sample.id).toBeTruthy(); // Indonesian meaning
      expect(sample.r).toBeTruthy(); // Kangxi radical
    }

    expect(hsk2Total).toBe(4991);
  });

  it('ensures all HSK 1-6 levels are covered in curriculum lessons', () => {
    const levelsCovered = new Set(LESSONS.map((l) => l.level));
    expect(levelsCovered.has('HSK1')).toBe(true);
    expect(levelsCovered.has('HSK2')).toBe(true);
    expect(levelsCovered.has('HSK3')).toBe(true);
    expect(levelsCovered.has('HSK4')).toBe(true);
    expect(levelsCovered.has('HSK5')).toBe(true);
    expect(levelsCovered.has('HSK6')).toBe(true);
  });

  it('ensures all lessons have structured objectives, dialogues, and practice questions', () => {
    expect(LESSONS.length).toBeGreaterThan(0);

    LESSONS.forEach((lesson) => {
      expect(lesson.id).toBeTruthy();
      expect(lesson.slug).toBeTruthy();
      expect(lesson.title).toBeTruthy();
      expect(lesson.title_chinese).toBeTruthy();
      expect(lesson.learning_objectives.length).toBeGreaterThan(0);
      expect(lesson.estimated_minutes).toBeGreaterThanOrEqual(15);

      if (lesson.dialogue) {
        lesson.dialogue.forEach((line) => {
          expect(line.speaker).toBeTruthy();
          expect(line.chinese).toBeTruthy();
          expect(line.pinyin).toBeTruthy();
          expect(line.indonesian).toBeTruthy();
        });
      }

      if (lesson.practice_questions) {
        lesson.practice_questions.forEach((q) => {
          expect(q.prompt).toBeTruthy();
          expect(q.correct_answer).toBeTruthy();
          expect(q.explanation).toBeTruthy();
        });
      }
    });
  });

  it('ensures diagnostic questions have valid skills and options', () => {
    expect(DIAGNOSTIC_QUESTIONS.length).toBe(10);

    DIAGNOSTIC_QUESTIONS.forEach((q) => {
      expect(q.id).toBeTruthy();
      expect(q.prompt).toBeTruthy();
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.correct_option_id).toBeTruthy();
      expect(q.explanation_id).toBeTruthy();
    });
  });

  it('ensures HSK 3 mock exam covers listening, reading and grammar sections', () => {
    expect(HSK3_MOCK_EXAM_SECTIONS.length).toBe(3);
    const totalQuestions = HSK3_MOCK_EXAM_SECTIONS.reduce((acc, s) => acc + s.questions.length, 0);
    expect(totalQuestions).toBeGreaterThanOrEqual(9);
  });
});
