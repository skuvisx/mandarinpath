import { 
  UserProfile, 
  VocabProgress, 
  LessonProgress, 
  QuizAttempt, 
  UserMistake, 
  StudySession, 
  VocabularyItem, 
  Lesson,
  ReviewRating,
  StrokePracticeRecord
} from '@/types';
import { INITIAL_VOCABULARY } from '@/data/vocabulary';
import { LESSONS } from '@/data/lessons';
import { calculateSM2, formatDate, isDueForReview } from '@/lib/srs/sm2';

const STORAGE_KEYS = {
  PROFILE: 'mandarinpath_profile_v1',
  VOCAB_PROGRESS: 'mandarinpath_vocab_progress_v1',
  CUSTOM_VOCAB: 'mandarinpath_custom_vocab_v1',
  STROKE_RECORDS: 'mandarinpath_stroke_records_v1',
  LESSON_PROGRESS: 'mandarinpath_lesson_progress_v1',
  QUIZ_ATTEMPTS: 'mandarinpath_quiz_attempts_v1',
  MISTAKES: 'mandarinpath_mistakes_v1',
  SESSIONS: 'mandarinpath_sessions_v1',
};

// Default profile designed for our target persona
export const DEFAULT_GUEST_PROFILE: UserProfile = {
  id: 'guest-learner-01',
  name: '@skuvis_',
  email: 'learner@mandarinpath.app',
  daily_goal_minutes: 25,
  study_duration_preference: 25,
  target_exam_level: 'HSK3',
  current_proficiency: 'rusty_elementary',
  preferred_topics: ['Percakapan Sehari-hari', 'Kehidupan Kampus', 'Ujian HSK', 'Komunikasi Praktis'],
  focus_area: 'balanced',
  study_streak: 3,
  last_study_date: formatDate(new Date()),
  total_study_minutes: 185,
  diagnostic_completed: false,
  created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
};

// Initial seed progress for a rusty student with some cards in review
function getInitialVocabProgress(): Record<string, VocabProgress> {
  const today = formatDate(new Date());
  return {
    'v-h1-01': {
      vocab_id: 'v-h1-01',
      user_id: 'guest-learner-01',
      repetition: 3,
      interval_days: 6,
      ease_factor: 2.5,
      next_review_date: today,
      last_reviewed_at: new Date(Date.now() - 6 * 86400000).toISOString(),
      state: 'review',
      recognition_history: [true, true, true],
      recall_history: [true, false, true],
      is_bookmarked: false,
    },
    'v-h1-02': {
      vocab_id: 'v-h1-02',
      user_id: 'guest-learner-01',
      repetition: 2,
      interval_days: 3,
      ease_factor: 2.4,
      next_review_date: today,
      last_reviewed_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      state: 'review',
      recognition_history: [true, true],
      recall_history: [true, true],
      is_bookmarked: true,
    },
    'v-h2-01': {
      vocab_id: 'v-h2-01',
      user_id: 'guest-learner-01',
      repetition: 1,
      interval_days: 1,
      ease_factor: 2.3,
      next_review_date: today,
      last_reviewed_at: new Date(Date.now() - 86400000).toISOString(),
      state: 'learning',
      recognition_history: [true],
      recall_history: [false],
      is_bookmarked: true,
    },
  };
}

class StorageManager {
  private memoryStorage: Record<string, string> = {};

  private getItem(key: string): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(key);
    }
    return this.memoryStorage[key] || null;
  }

  private setItem(key: string, value: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, value);
    }
    this.memoryStorage[key] = value;
  }

  private removeItem(key: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(key);
    }
    delete this.memoryStorage[key];
  }

  // --- Profile Management ---
  public getProfile(): UserProfile {
    const raw = this.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) {
      this.saveProfile(DEFAULT_GUEST_PROFILE);
      return DEFAULT_GUEST_PROFILE;
    }
    try {
      const parsed: UserProfile = JSON.parse(raw);
      if (parsed.name === 'Budi Santoso (Pelajar Tamu)' || parsed.name === 'Budi Santoso') {
        parsed.name = DEFAULT_GUEST_PROFILE.name;
        parsed.email = DEFAULT_GUEST_PROFILE.email;
        this.saveProfile(parsed);
      }
      return parsed;
    } catch {
      return DEFAULT_GUEST_PROFILE;
    }
  }

  public saveProfile(profile: UserProfile): void {
    this.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }

  public updateProfile(updates: Partial<UserProfile>): UserProfile {
    const current = this.getProfile();
    const updated = { ...current, ...updates };
    this.saveProfile(updated);
    return updated;
  }

  // --- Vocabulary & SRS Progress ---
  public getCustomVocabulary(): VocabularyItem[] {
    const raw = this.getItem(STORAGE_KEYS.CUSTOM_VOCAB);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public addVocabToSrs(item: VocabularyItem): VocabProgress {
    const custom = this.getCustomVocabulary();
    const existsInInitial = INITIAL_VOCABULARY.some((v) => v.id === item.id || v.hanzi === item.hanzi);
    const existingCustomIdx = custom.findIndex((v) => v.id === item.id || v.hanzi === item.hanzi);

    let targetId = item.id;
    if (existsInInitial) {
      const found = INITIAL_VOCABULARY.find((v) => v.id === item.id || v.hanzi === item.hanzi)!;
      targetId = found.id;
    } else if (existingCustomIdx >= 0) {
      targetId = custom[existingCustomIdx].id;
    } else {
      custom.unshift(item);
      this.setItem(STORAGE_KEYS.CUSTOM_VOCAB, JSON.stringify(custom.slice(0, 2000)));
    }

    const allProgress = this.getAllVocabProgress();
    const today = formatDate(new Date());
    const progress: VocabProgress = allProgress[targetId] || {
      vocab_id: targetId,
      user_id: this.getProfile().id,
      repetition: 0,
      interval_days: 0,
      ease_factor: 2.5,
      next_review_date: today,
      last_reviewed_at: new Date().toISOString(),
      state: 'learning',
      recognition_history: [],
      recall_history: [],
      is_bookmarked: true,
    };
    progress.next_review_date = today;
    progress.is_bookmarked = true;
    allProgress[targetId] = progress;
    this.saveAllVocabProgress(allProgress);
    return progress;
  }

  public getAllVocabulary(): VocabularyItem[] {
    const custom = this.getCustomVocabulary();
    const seen = new Set(INITIAL_VOCABULARY.map((v) => v.id));
    const merged = [...INITIAL_VOCABULARY];
    for (const c of custom) {
      if (!seen.has(c.id)) {
        seen.add(c.id);
        merged.push(c);
      }
    }
    return merged;
  }

  public getAllVocabProgress(): Record<string, VocabProgress> {
    const raw = this.getItem(STORAGE_KEYS.VOCAB_PROGRESS);
    if (!raw) {
      const initial = getInitialVocabProgress();
      this.saveAllVocabProgress(initial);
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return getInitialVocabProgress();
    }
  }

  public saveAllVocabProgress(progressMap: Record<string, VocabProgress>): void {
    this.setItem(STORAGE_KEYS.VOCAB_PROGRESS, JSON.stringify(progressMap));
  }

  public getVocabProgress(vocabId: string): VocabProgress | null {
    const all = this.getAllVocabProgress();
    return all[vocabId] || null;
  }

  public getDueReviewCards(): VocabularyItem[] {
    const allProgress = this.getAllVocabProgress();
    const allVocab = this.getAllVocabulary();
    const today = formatDate(new Date());
    const dueIds = new Set(
      Object.values(allProgress)
        .filter((p) => isDueForReview(p, today))
        .map((p) => p.vocab_id)
    );
    return allVocab.filter((v) => dueIds.has(v.id));
  }

  // --- Hanzi Stroke Writing Records ---
  public getStrokeRecords(): Record<string, StrokePracticeRecord> {
    const raw = this.getItem(STORAGE_KEYS.STROKE_RECORDS);
    if (!raw) return {};
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }

  public recordStrokePractice(
    char: string,
    mistakes: number,
    strokeCount: number,
    pinyin?: string,
    meaning?: string
  ): StrokePracticeRecord {
    const all = this.getStrokeRecords();
    const prev = all[char];
    const accuracy = Math.max(0, Math.min(100, Math.round(((strokeCount * 2 - mistakes) / (strokeCount * 2)) * 100)));
    const record: StrokePracticeRecord = {
      char,
      pinyin: pinyin || prev?.pinyin,
      meaning: meaning || prev?.meaning,
      times_practiced: (prev?.times_practiced || 0) + 1,
      total_mistakes: (prev?.total_mistakes || 0) + mistakes,
      best_accuracy: Math.max(prev?.best_accuracy || 0, accuracy),
      mastered: accuracy >= 90 || Boolean(prev?.mastered),
      last_practiced_at: new Date().toISOString(),
    };
    all[char] = record;
    this.setItem(STORAGE_KEYS.STROKE_RECORDS, JSON.stringify(all));
    this.recordStudyActivity(2, 'writing', 1, accuracy);
    return record;
  }

  public recordReviewAnswer(vocabId: string, rating: ReviewRating, recognitionPassed: boolean = true): VocabProgress {
    const allProgress = this.getAllVocabProgress();
    const currentProgress = allProgress[vocabId] || {
      vocab_id: vocabId,
      user_id: this.getProfile().id,
      repetition: 0,
      interval_days: 0,
      ease_factor: 2.5,
      next_review_date: formatDate(new Date()),
      last_reviewed_at: new Date().toISOString(),
      state: 'new',
      recognition_history: [],
      recall_history: [],
      is_bookmarked: false,
    };

    const sm2Result = calculateSM2({
      repetition: currentProgress.repetition,
      interval_days: currentProgress.interval_days,
      ease_factor: currentProgress.ease_factor,
      rating,
    });

    const updated: VocabProgress = {
      ...currentProgress,
      ...sm2Result,
      last_reviewed_at: new Date().toISOString(),
      recognition_history: [...(currentProgress.recognition_history || []), recognitionPassed],
      recall_history: [...(currentProgress.recall_history || []), rating >= 3],
    };

    allProgress[vocabId] = updated;
    this.saveAllVocabProgress(allProgress);

    // Track study session minutes and streak
    this.recordStudyActivity(2, 'flashcards', 1);

    return updated;
  }

  public toggleBookmark(vocabId: string): boolean {
    const allProgress = this.getAllVocabProgress();
    const current = allProgress[vocabId] || {
      vocab_id: vocabId,
      user_id: this.getProfile().id,
      repetition: 0,
      interval_days: 0,
      ease_factor: 2.5,
      next_review_date: formatDate(new Date()),
      last_reviewed_at: new Date().toISOString(),
      state: 'new',
      recognition_history: [],
      recall_history: [],
      is_bookmarked: false,
    };

    const newBookmarkState = !current.is_bookmarked;
    allProgress[vocabId] = {
      ...current,
      is_bookmarked: newBookmarkState,
    };
    this.saveAllVocabProgress(allProgress);
    return newBookmarkState;
  }

  // --- Lessons ---
  public getLessons(): Lesson[] {
    return LESSONS;
  }

  public getLessonProgressMap(): Record<string, LessonProgress> {
    const raw = this.getItem(STORAGE_KEYS.LESSON_PROGRESS);
    if (!raw) return {};
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }

  public markLessonComplete(lessonId: string, score: number = 100): void {
    const all = this.getLessonProgressMap();
    all[lessonId] = {
      lesson_id: lessonId,
      user_id: this.getProfile().id,
      completed: true,
      score,
      completed_at: new Date().toISOString(),
    };
    this.setItem(STORAGE_KEYS.LESSON_PROGRESS, JSON.stringify(all));

    // Record study activity
    this.recordStudyActivity(20, 'lesson', 0, score);
  }

  // --- Quiz & Mistake Bank ---
  public getQuizAttempts(): QuizAttempt[] {
    const raw = this.getItem(STORAGE_KEYS.QUIZ_ATTEMPTS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public saveQuizAttempt(attempt: Omit<QuizAttempt, 'id' | 'created_at'>): QuizAttempt {
    const fullAttempt: QuizAttempt = {
      ...attempt,
      id: `quiz-att-${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    const all = this.getQuizAttempts();
    all.unshift(fullAttempt);
    this.setItem(STORAGE_KEYS.QUIZ_ATTEMPTS, JSON.stringify(all.slice(0, 50)));

    // If there were mistakes, add to Mistake Bank
    if (attempt.mistakes && attempt.mistakes.length > 0) {
      const currentMistakes = this.getMistakes();
      attempt.mistakes.forEach((m) => {
        currentMistakes.unshift({
          id: `mistake-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          question_id: m.question_id,
          prompt: m.prompt,
          user_answer: m.user_answer,
          correct_answer: m.correct_answer,
          explanation: m.explanation,
          category: 'Quiz',
          hsk_level: attempt.hsk_level || 'HSK3',
          resolved: false,
          created_at: new Date().toISOString(),
        });
      });
      this.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(currentMistakes));
    }

    this.recordStudyActivity(
      Math.max(3, Math.round(attempt.duration_seconds / 60)),
      'quiz',
      0,
      attempt.score_percentage
    );

    return fullAttempt;
  }

  public getMistakes(): UserMistake[] {
    const raw = this.getItem(STORAGE_KEYS.MISTAKES);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public resolveMistake(mistakeId: string): void {
    const mistakes = this.getMistakes().map((m) =>
      m.id === mistakeId ? { ...m, resolved: true, resolved_at: new Date().toISOString() } : m
    );
    this.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(mistakes));
  }

  // --- Study Sessions & Activity Streak ---
  public getStudySessions(): StudySession[] {
    const raw = this.getItem(STORAGE_KEYS.SESSIONS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public recordStudyActivity(
    durationMinutes: number,
    activityType: StudySession['activity_type'],
    cardsCount: number = 0,
    scorePercentage?: number
  ): void {
    const today = formatDate(new Date());
    const profile = this.getProfile();

    // Check streak
    let newStreak = profile.study_streak;
    if (profile.last_study_date !== today) {
      const yesterday = formatDate(new Date(Date.now() - 86400000));
      if (profile.last_study_date === yesterday) {
        newStreak += 1;
      } else if (!profile.last_study_date) {
        newStreak = 1;
      } else {
        newStreak = 1;
      }
    }

    this.updateProfile({
      study_streak: newStreak,
      last_study_date: today,
      total_study_minutes: (profile.total_study_minutes || 0) + durationMinutes,
    });

    const sessions = this.getStudySessions();
    sessions.unshift({
      id: `session-${Date.now()}`,
      date: today,
      duration_minutes: durationMinutes,
      activity_type: activityType,
      cards_reviewed_count: cardsCount,
      score_percentage: scorePercentage,
    });

    this.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions.slice(0, 100)));
  }

  // --- Export and Import User Data ---
  public exportUserData(): string {
    const data = {
      profile: this.getProfile(),
      vocab_progress: this.getAllVocabProgress(),
      custom_vocab: this.getCustomVocabulary(),
      stroke_records: this.getStrokeRecords(),
      lesson_progress: this.getLessonProgressMap(),
      quiz_attempts: this.getQuizAttempts(),
      mistakes: this.getMistakes(),
      sessions: this.getStudySessions(),
      exported_at: new Date().toISOString(),
      version: '1.0',
    };
    return JSON.stringify(data, null, 2);
  }

  public importUserData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.profile) this.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(data.profile));
      if (data.vocab_progress) this.setItem(STORAGE_KEYS.VOCAB_PROGRESS, JSON.stringify(data.vocab_progress));
      if (data.custom_vocab) this.setItem(STORAGE_KEYS.CUSTOM_VOCAB, JSON.stringify(data.custom_vocab));
      if (data.stroke_records) this.setItem(STORAGE_KEYS.STROKE_RECORDS, JSON.stringify(data.stroke_records));
      if (data.lesson_progress) this.setItem(STORAGE_KEYS.LESSON_PROGRESS, JSON.stringify(data.lesson_progress));
      if (data.quiz_attempts) this.setItem(STORAGE_KEYS.QUIZ_ATTEMPTS, JSON.stringify(data.quiz_attempts));
      if (data.mistakes) this.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(data.mistakes));
      if (data.sessions) this.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(data.sessions));
      return true;
    } catch {
      return false;
    }
  }

  public resetAllProgress(): void {
    this.removeItem(STORAGE_KEYS.PROFILE);
    this.removeItem(STORAGE_KEYS.VOCAB_PROGRESS);
    this.removeItem(STORAGE_KEYS.CUSTOM_VOCAB);
    this.removeItem(STORAGE_KEYS.STROKE_RECORDS);
    this.removeItem(STORAGE_KEYS.LESSON_PROGRESS);
    this.removeItem(STORAGE_KEYS.QUIZ_ATTEMPTS);
    this.removeItem(STORAGE_KEYS.MISTAKES);
    this.removeItem(STORAGE_KEYS.SESSIONS);
    this.memoryStorage = {};
  }
}

export const storageManager = new StorageManager();
