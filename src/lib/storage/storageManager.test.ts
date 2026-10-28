import { describe, it, expect, beforeEach } from 'vitest';
import { storageManager, DEFAULT_GUEST_PROFILE } from './storageManager';
import { formatDate } from '../srs/sm2';

describe('StorageManager & Persistence Layer', () => {
  beforeEach(() => {
    // Clear storage mockup before each test
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  });

  it('provides a default guest profile tailored to rusty learners', () => {
    const profile = storageManager.getProfile();
    expect(profile).toBeDefined();
    expect(profile.target_exam_level).toBe('HSK3');
    expect(profile.daily_goal_minutes).toBe(25);
    expect(profile.current_proficiency).toBe('rusty_elementary');
  });

  it('allows updating profile settings', () => {
    const updated = storageManager.updateProfile({
      name: 'Dewi Lestari',
      daily_goal_minutes: 30,
      target_exam_level: 'HSK4',
    });

    expect(updated.name).toBe('Dewi Lestari');
    expect(updated.daily_goal_minutes).toBe(30);
    expect(updated.target_exam_level).toBe('HSK4');
  });

  it('records review answers and schedules next review via SM-2', () => {
    const vocabId = 'v-h1-01'; // 认识
    const progress = storageManager.recordReviewAnswer(vocabId, 4); // Good rating

    expect(progress.vocab_id).toBe(vocabId);
    expect(progress.repetition).toBeGreaterThan(0);
    expect(progress.interval_days).toBeGreaterThan(0);
    expect(progress.next_review_date).toBeDefined();
  });

  it('toggles bookmarks reliably', () => {
    const vocabId = 'v-h1-02';
    const state1 = storageManager.toggleBookmark(vocabId);
    expect(typeof state1).toBe('boolean');

    const state2 = storageManager.toggleBookmark(vocabId);
    expect(state2).toBe(!state1);
  });

  it('saves quiz attempts and adds wrong answers to the Mistake Bank', () => {
    const attempt = storageManager.saveQuizAttempt({
      quiz_type: 'daily_micro',
      hsk_level: 'HSK2',
      total_questions: 2,
      correct_count: 1,
      score_percentage: 50,
      duration_seconds: 120,
      mistakes: [
        {
          question_id: 'q-test-1',
          prompt: 'Karakter untuk "认识" adalah?',
          user_answer: '喜欢',
          correct_answer: '认识',
          explanation: '认识 memiliki radikal bicara 讠.',
        },
      ],
    });

    expect(attempt.id).toBeDefined();
    expect(attempt.score_percentage).toBe(50);

    const mistakes = storageManager.getMistakes();
    expect(mistakes.length).toBeGreaterThan(0);
    const found = mistakes.find((m) => m.question_id === 'q-test-1');
    expect(found).toBeDefined();
    expect(found?.resolved).toBe(false);

    // Resolve mistake
    if (found) {
      storageManager.resolveMistake(found.id);
      const updatedMistakes = storageManager.getMistakes();
      const updatedFound = updatedMistakes.find((m) => m.id === found.id);
      expect(updatedFound?.resolved).toBe(true);
    }
  });

  it('exports and imports user data correctly', () => {
    storageManager.updateProfile({ name: 'Pengguna Ekspor Uji' });
    const exportedStr = storageManager.exportUserData();
    expect(exportedStr).toContain('Pengguna Ekspor Uji');

    const parsed = JSON.parse(exportedStr);
    expect(parsed.version).toBe('1.0');
    expect(parsed.profile.name).toBe('Pengguna Ekspor Uji');

    const importSuccess = storageManager.importUserData(exportedStr);
    expect(importSuccess).toBe(true);
  });

  it('adds custom HSK 1-6 vocabulary into the SRS deck and surfaces it in getAllVocabulary()', () => {
    const customItem = {
      id: 'hsk2-6-9999',
      hanzi: '再接再厉',
      pinyin: 'zài jiē zài lì',
      meaning_id: 'terus berjuang dan melipatgandakan usaha',
      part_of_speech: 'Chengyu (Idiom)',
      hsk_level: 'HSK6' as const,
      curriculum_version: 'HSK2.0_2012' as const,
      topic: 'akademik',
      example_chinese: '希望大家再接再厉。',
      example_pinyin: 'Xīwàng dàjiā zàijiē-zàilì.',
      example_indonesian: 'Semoga semuanya terus berjuang meningkatkan usaha.',
    };

    const progress = storageManager.addVocabToSrs(customItem);
    expect(progress.vocab_id).toBe('hsk2-6-9999');
    expect(progress.state).toBe('learning');

    const allVocab = storageManager.getAllVocabulary();
    expect(allVocab.some((v) => v.id === 'hsk2-6-9999')).toBe(true);
  });

  it('records interactive Hanzi stroke writing accuracy and mastery', () => {
    const rec1 = storageManager.recordStrokePractice('永', 2, 5);
    expect(rec1.char).toBe('永');
    expect(rec1.times_practiced).toBe(1);
    expect(rec1.best_accuracy).toBe(80);
    expect(rec1.mastered).toBe(false);

    const rec2 = storageManager.recordStrokePractice('永', 0, 5);
    expect(rec2.times_practiced).toBe(2);
    expect(rec2.best_accuracy).toBe(100);
    expect(rec2.mastered).toBe(true);
  });
});
