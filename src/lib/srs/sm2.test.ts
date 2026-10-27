import { describe, it, expect } from 'vitest';
import { calculateSM2, formatDate, addDays, isDueForReview } from './sm2';
import { VocabProgress } from '@/types';

describe('SM-2 Spaced Repetition Algorithm', () => {
  it('correctly formats date to YYYY-MM-DD', () => {
    const testDate = new Date(2026, 9, 28); // Month is 0-indexed, so 9 is October
    expect(formatDate(testDate)).toBe('2026-10-28');
  });

  it('resets repetition and sets interval to 1 on failed recall (rating < 3)', () => {
    const today = new Date(2026, 9, 28);
    const result = calculateSM2(
      {
        repetition: 4,
        interval_days: 15,
        ease_factor: 2.5,
        rating: 2, // Sulit / Gagal
      },
      today
    );

    expect(result.repetition).toBe(0);
    expect(result.interval_days).toBe(1);
    expect(result.state).toBe('learning');
    expect(result.next_review_date).toBe('2026-10-29');
    expect(result.ease_factor).toBeLessThan(2.5); // Ease factor penalty
  });

  it('advances repetition from 0 to 1 with 1 day interval on first good recall', () => {
    const today = new Date(2026, 9, 28);
    const result = calculateSM2(
      {
        repetition: 0,
        interval_days: 0,
        ease_factor: 2.5,
        rating: 4, // Baik
      },
      today
    );

    expect(result.repetition).toBe(1);
    expect(result.interval_days).toBe(1);
    expect(result.next_review_date).toBe('2026-10-29');
    expect(result.state).toBe('review');
  });

  it('advances repetition from 1 to 2 with 6 days interval on second good recall', () => {
    const today = new Date(2026, 9, 28);
    const result = calculateSM2(
      {
        repetition: 1,
        interval_days: 1,
        ease_factor: 2.5,
        rating: 4,
      },
      today
    );

    expect(result.repetition).toBe(2);
    expect(result.interval_days).toBe(6);
    expect(result.next_review_date).toBe('2026-11-03');
  });

  it('multiplies interval by ease factor on subsequent successful reviews', () => {
    const today = new Date(2026, 9, 28);
    const result = calculateSM2(
      {
        repetition: 2,
        interval_days: 6,
        ease_factor: 2.5,
        rating: 5, // Sangat mudah
      },
      today
    );

    expect(result.repetition).toBe(3);
    expect(result.interval_days).toBe(15); // Math.round(6 * 2.5) = 15
    expect(result.ease_factor).toBeGreaterThan(2.5);
  });

  it('does not allow ease factor to drop below minimum 1.3', () => {
    const today = new Date(2026, 9, 28);
    let ef = 1.35;
    for (let i = 0; i < 5; i++) {
      const res = calculateSM2(
        {
          repetition: 1,
          interval_days: 2,
          ease_factor: ef,
          rating: 1, // Completely blank
        },
        today
      );
      ef = res.ease_factor;
    }
    expect(ef).toBe(1.3);
  });

  it('correctly determines whether a card is due for review', () => {
    const mockProgress: VocabProgress = {
      vocab_id: 'test-1',
      user_id: 'guest',
      repetition: 2,
      interval_days: 3,
      ease_factor: 2.5,
      next_review_date: '2026-10-28',
      last_reviewed_at: '2026-10-25',
      state: 'review',
      recognition_history: [true, true],
      recall_history: [true, true],
    };

    expect(isDueForReview(mockProgress, '2026-10-28')).toBe(true);
    expect(isDueForReview(mockProgress, '2026-10-29')).toBe(true);
    expect(isDueForReview(mockProgress, '2026-10-27')).toBe(false);
  });
});
