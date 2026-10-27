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
});
