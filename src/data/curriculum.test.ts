import { describe, it, expect } from 'vitest';
import { INITIAL_VOCABULARY } from './vocabulary';
import { LESSONS } from './lessons';
import { DIAGNOSTIC_QUESTIONS } from './diagnostic';
import { HSK3_MOCK_EXAM_SECTIONS } from './mockExam';

describe('Curriculum & Content Integrity', () => {
  it('ensures all vocabulary items have valid Hanzi, Pinyin, Indonesian translation and examples', () => {
    expect(INITIAL_VOCABULARY.length).toBeGreaterThan(5);

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
