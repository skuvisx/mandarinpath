export type HskLevel = 'HSK1' | 'HSK2' | 'HSK3' | 'HSK4' | 'HSK5' | 'HSK6';

export type UserProficiency = 'beginner' | 'rusty_elementary' | 'intermediate' | 'advanced';

export interface UserProfile {
  id: string;
  email?: string;
  name: string;
  avatar_url?: string;
  daily_goal_minutes: number;
  study_duration_preference: number; // e.g. 20, 25, 30
  target_exam_level: HskLevel;
  current_proficiency: UserProficiency;
  preferred_topics: string[];
  focus_area: 'conversation' | 'hsk_exam' | 'balanced';
  study_streak: number;
  last_study_date?: string;
  total_study_minutes: number;
  diagnostic_completed: boolean;
  diagnostic_result?: DiagnosticResult;
  created_at: string;
}

export interface VocabularyItem {
  id: string;
  hanzi: string;
  pinyin: string;
  meaning_id: string;
  part_of_speech: string;
  hsk_level: HskLevel;
  hsk_version: '2.0' | '3.0' | 'both';
  topic: string;
  radicals?: string;
  component_breakdown?: string;
  example_chinese: string;
  example_pinyin: string;
  example_indonesian: string;
  audio_url?: string;
  confusion_notes?: string;
}

export type ReviewRating = 1 | 2 | 3 | 4 | 5; // 1: Blank/Lupa, 2: Sulit/Salah, 3: Ragu/Hard, 4: Baik/Good, 5: Mudah/Easy

export interface VocabProgress {
  vocab_id: string;
  user_id: string;
  repetition: number;
  interval_days: number;
  ease_factor: number;
  next_review_date: string; // ISO date string (YYYY-MM-DD)
  last_reviewed_at: string;
  state: 'new' | 'learning' | 'review' | 'mastered';
  recognition_history: boolean[];
  recall_history: boolean[];
  is_bookmarked?: boolean;
}

export interface DiagnosticQuestion {
  id: string;
  type: 'hanzi_recognition' | 'pinyin_identification' | 'grammar_order' | 'reading_comprehension' | 'listening_dialogue';
  skill: 'reading' | 'pinyin' | 'grammar' | 'listening' | 'vocabulary';
  level_estimate: HskLevel;
  prompt: string;
  pinyin_prompt?: string;
  audio_text?: string;
  options: {
    id: string;
    text: string;
    pinyin?: string;
  }[];
  correct_option_id: string;
  explanation_id: string;
}

export interface DiagnosticResult {
  assessed_level: HskLevel;
  score_percentage: number;
  reading_score: number;
  listening_score: number;
  grammar_score: number;
  vocabulary_score: number;
  starting_path_recommendation: string;
  strengths: string[];
  weaknesses: string[];
  recommended_daily_minutes: number;
  assessed_at: string;
}

export interface Lesson {
  id: string;
  slug: string;
  level: HskLevel;
  module_number: number;
  lesson_number: number;
  title: string;
  title_chinese: string;
  title_pinyin: string;
  description: string;
  topic: string;
  estimated_minutes: number;
  learning_objectives: string[];
  dialogue?: {
    speaker: string;
    chinese: string;
    pinyin: string;
    indonesian: string;
  }[];
  grammar_points: {
    pattern: string;
    title: string;
    explanation_id: string;
    structure: string;
    examples: {
      chinese: string;
      pinyin: string;
      indonesian: string;
      breakdown?: string;
    }[];
  }[];
  vocabulary_ids: string[];
  practice_questions: LessonPracticeQuestion[];
}

export interface LessonPracticeQuestion {
  id: string;
  type: 'word_order' | 'multiple_choice' | 'fill_in_the_blank' | 'shadowing_practice';
  prompt: string;
  pinyin_prompt?: string;
  audio_text?: string;
  tokens?: string[]; // for word_order
  options?: string[]; // for multiple_choice
  correct_answer: string; // or joined tokens
  explanation: string;
}

export interface LessonProgress {
  lesson_id: string;
  user_id: string;
  completed: boolean;
  score?: number;
  completed_at?: string;
  practice_records?: Record<string, boolean>;
}

export interface QuizQuestion {
  id: string;
  category: 'vocabulary' | 'grammar' | 'reading' | 'listening' | 'sentence_structure';
  hsk_level: HskLevel;
  prompt: string;
  pinyin_prompt?: string;
  audio_text?: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export interface QuizAttempt {
  id: string;
  quiz_type: 'daily_micro' | 'topic_review' | 'mock_exam';
  hsk_level?: HskLevel;
  total_questions: number;
  correct_count: number;
  score_percentage: number;
  duration_seconds: number;
  mistakes: {
    question_id: string;
    prompt: string;
    user_answer: string;
    correct_answer: string;
    explanation: string;
  }[];
  created_at: string;
}

export interface UserMistake {
  id: string;
  question_id: string;
  prompt: string;
  user_answer: string;
  correct_answer: string;
  explanation: string;
  category: string;
  hsk_level: HskLevel;
  resolved: boolean;
  created_at: string;
  resolved_at?: string;
}

export interface StudySession {
  id: string;
  date: string;
  duration_minutes: number;
  activity_type: 'flashcards' | 'lesson' | 'listening' | 'quiz' | 'diagnostic' | 'writing' | 'tones';
  cards_reviewed_count: number;
  score_percentage?: number;
}

export interface StrokePracticeRecord {
  char: string;
  pinyin?: string;
  meaning?: string;
  times_practiced: number;
  total_mistakes: number;
  best_accuracy: number;
  mastered: boolean;
  last_practiced_at: string;
}
