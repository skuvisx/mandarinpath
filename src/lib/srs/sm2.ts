import { VocabProgress, ReviewRating } from '@/types';

export interface SM2Input {
  repetition: number;
  interval_days: number;
  ease_factor: number;
  rating: ReviewRating; // 1: Lupa/Gagal, 2: Sulit, 3: Ragu/Cukup, 4: Baik, 5: Mudah
}

export interface SM2Output {
  repetition: number;
  interval_days: number;
  ease_factor: number;
  next_review_date: string; // YYYY-MM-DD
  state: 'new' | 'learning' | 'review' | 'mastered';
}

/**
 * Format a Date object to YYYY-MM-DD in local time
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Add days to a Date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Calculates new Spaced Repetition interval based on SuperMemo SM-2 algorithm.
 */
export function calculateSM2(input: SM2Input, currentDate: Date = new Date()): SM2Output {
  const { repetition, interval_days, ease_factor, rating } = input;

  let newRepetition = repetition;
  let newInterval = interval_days;
  let newEaseFactor = ease_factor;

  // Rating 1-2 indicates failure to recall; reset repetition streak
  if (rating < 3) {
    newRepetition = 0;
    newInterval = 1;
  } else {
    // Rating 3-5 is successful recall
    if (repetition === 0) {
      newInterval = 1;
    } else if (repetition === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval_days * ease_factor);
    }
    newRepetition = repetition + 1;
  }

  // Calculate new Ease Factor:
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  const qDiff = 5 - rating;
  newEaseFactor = ease_factor + (0.1 - qDiff * (0.08 + qDiff * 0.02));

  // Minimum Ease Factor is 1.3 in SM-2
  if (newEaseFactor < 1.3) {
    newEaseFactor = 1.3;
  }
  // Round ease factor to 2 decimal places for clean storage
  newEaseFactor = Math.round(newEaseFactor * 100) / 100;

  const nextDate = addDays(currentDate, newInterval);
  const next_review_date = formatDate(nextDate);

  let state: 'new' | 'learning' | 'review' | 'mastered' = 'learning';
  if (newRepetition >= 5 && rating >= 4) {
    state = 'mastered';
  } else if (newRepetition > 0) {
    state = 'review';
  } else {
    state = 'learning';
  }

  return {
    repetition: newRepetition,
    interval_days: newInterval,
    ease_factor: newEaseFactor,
    next_review_date,
    state,
  };
}

/**
 * Check if a card is due for review on or before the target date
 */
export function isDueForReview(progress: VocabProgress, targetDate: string = formatDate(new Date())): boolean {
  return progress.next_review_date <= targetDate;
}

/**
 * Human-readable interval description in Indonesian
 */
export function formatIntervalLabelIndonesian(intervalDays: number): string {
  if (intervalDays === 0) return 'Hari ini';
  if (intervalDays === 1) return 'Besok (1 hari)';
  if (intervalDays < 7) return `${intervalDays} hari lagi`;
  if (intervalDays < 30) {
    const weeks = Math.round(intervalDays / 7);
    return `${weeks} minggu lagi (${intervalDays} hari)`;
  }
  const months = Math.round(intervalDays / 30);
  return `${months} bulan lagi (${intervalDays} hari)`;
}
