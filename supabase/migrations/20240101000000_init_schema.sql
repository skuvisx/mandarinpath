-- MandarinPath PostgreSQL & Supabase Database Migration
-- Includes RLS (Row Level Security) and indexes for optimal performance

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PUBLIC CURRICULUM: CURRICULUM VERSIONS
CREATE TABLE IF NOT EXISTS public.curriculums (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PUBLIC CURRICULUM: VOCABULARY
CREATE TABLE IF NOT EXISTS public.vocabulary (
  id TEXT PRIMARY KEY,
  hanzi TEXT NOT NULL,
  pinyin TEXT NOT NULL,
  meaning_id TEXT NOT NULL,
  part_of_speech TEXT NOT NULL,
  hsk_level TEXT NOT NULL, -- HSK1, HSK2, HSK3, etc.
  hsk_version TEXT NOT NULL DEFAULT 'both', -- '2.0', '3.0', 'both'
  topic TEXT NOT NULL,
  radicals TEXT,
  component_breakdown TEXT,
  example_chinese TEXT NOT NULL,
  example_pinyin TEXT NOT NULL,
  example_indonesian TEXT NOT NULL,
  audio_url TEXT,
  confusion_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PUBLIC CURRICULUM: LESSONS
CREATE TABLE IF NOT EXISTS public.lessons (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  level TEXT NOT NULL,
  module_number INT NOT NULL,
  lesson_number INT NOT NULL,
  title TEXT NOT NULL,
  title_chinese TEXT NOT NULL,
  title_pinyin TEXT NOT NULL,
  description TEXT NOT NULL,
  topic TEXT NOT NULL,
  estimated_minutes INT DEFAULT 20,
  learning_objectives JSONB DEFAULT '[]'::jsonb,
  dialogue JSONB DEFAULT '[]'::jsonb,
  grammar_points JSONB DEFAULT '[]'::jsonb,
  vocabulary_ids TEXT[] DEFAULT ARRAY[]::TEXT[],
  practice_questions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. USER PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT NOT NULL,
  avatar_url TEXT,
  daily_goal_minutes INT DEFAULT 25,
  study_duration_preference INT DEFAULT 25,
  target_exam_level TEXT DEFAULT 'HSK3',
  current_proficiency TEXT DEFAULT 'rusty_elementary',
  preferred_topics TEXT[] DEFAULT ARRAY['Percakapan Sehari-hari', 'Kehidupan Kampus']::TEXT[],
  focus_area TEXT DEFAULT 'balanced', -- 'conversation', 'hsk_exam', 'balanced'
  study_streak INT DEFAULT 0,
  last_study_date DATE,
  total_study_minutes INT DEFAULT 0,
  diagnostic_completed BOOLEAN DEFAULT FALSE,
  diagnostic_result JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. USER PRIVATE DATA: VOCABULARY PROGRESS (SRS SM-2)
CREATE TABLE IF NOT EXISTS public.user_vocabulary_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vocab_id TEXT NOT NULL REFERENCES public.vocabulary(id) ON DELETE CASCADE,
  repetition INT DEFAULT 0,
  interval_days INT DEFAULT 0,
  ease_factor NUMERIC(4,2) DEFAULT 2.50,
  next_review_date DATE NOT NULL DEFAULT CURRENT_DATE,
  last_reviewed_at TIMESTAMPTZ DEFAULT NOW(),
  state TEXT DEFAULT 'new', -- 'new', 'learning', 'review', 'mastered'
  recognition_history BOOLEAN[] DEFAULT ARRAY[]::BOOLEAN[],
  recall_history BOOLEAN[] DEFAULT ARRAY[]::BOOLEAN[],
  is_bookmarked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_vocab UNIQUE (user_id, vocab_id)
);

-- 7. USER PRIVATE DATA: LESSON PROGRESS
CREATE TABLE IF NOT EXISTS public.user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  score INT DEFAULT 100,
  completed_at TIMESTAMPTZ,
  practice_records JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_lesson UNIQUE (user_id, lesson_id)
);

-- 8. USER PRIVATE DATA: QUIZ ATTEMPTS & MISTAKES
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_type TEXT NOT NULL, -- 'daily_micro', 'topic_review', 'mock_exam'
  hsk_level TEXT,
  total_questions INT NOT NULL,
  correct_count INT NOT NULL,
  score_percentage NUMERIC(5,2) NOT NULL,
  duration_seconds INT NOT NULL,
  mistakes JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_mistakes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  prompt TEXT NOT NULL,
  user_answer TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT NOT NULL,
  category TEXT NOT NULL,
  hsk_level TEXT NOT NULL,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- 9. USER PRIVATE DATA: STUDY SESSIONS (STREAK & ANALYTICS)
CREATE TABLE IF NOT EXISTS public.study_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  duration_minutes INT NOT NULL,
  activity_type TEXT NOT NULL, -- 'flashcards', 'lesson', 'listening', 'quiz', 'diagnostic'
  cards_reviewed_count INT DEFAULT 0,
  score_percentage NUMERIC(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_vocab_level ON public.vocabulary(hsk_level);
CREATE INDEX IF NOT EXISTS idx_vocab_topic ON public.vocabulary(topic);
CREATE INDEX IF NOT EXISTS idx_user_srs_due ON public.user_vocabulary_progress(user_id, next_review_date);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_date ON public.study_sessions(user_id, date);
CREATE INDEX IF NOT EXISTS idx_user_mistakes_user_resolved ON public.user_mistakes(user_id, resolved);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.curriculums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_vocabulary_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_mistakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

-- 1. Public curriculum content is readable by all authenticated and anonymous visitors
CREATE POLICY "Public curriculums are readable by everyone" ON public.curriculums FOR SELECT USING (true);
CREATE POLICY "Public vocabulary is readable by everyone" ON public.vocabulary FOR SELECT USING (true);
CREATE POLICY "Public lessons are readable by everyone" ON public.lessons FOR SELECT USING (true);

-- 2. User Profiles: users can only read and update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 3. User Vocabulary Progress (SRS)
CREATE POLICY "Users can read own vocab progress" ON public.user_vocabulary_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own vocab progress" ON public.user_vocabulary_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own vocab progress" ON public.user_vocabulary_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own vocab progress" ON public.user_vocabulary_progress FOR DELETE USING (auth.uid() = user_id);

-- 4. User Lesson Progress
CREATE POLICY "Users can read own lesson progress" ON public.user_lesson_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own lesson progress" ON public.user_lesson_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own lesson progress" ON public.user_lesson_progress FOR UPDATE USING (auth.uid() = user_id);

-- 5. Quiz Attempts & Mistakes
CREATE POLICY "Users can manage own quiz attempts" ON public.quiz_attempts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own mistakes" ON public.user_mistakes FOR ALL USING (auth.uid() = user_id);

-- 6. Study Sessions
CREATE POLICY "Users can manage own study sessions" ON public.study_sessions FOR ALL USING (auth.uid() = user_id);
