-- MandarinPath: cross-device progress sync (Windows / Android / iOS)
-- One JSON snapshot per user. Last-write-wins using client-provided updated_at.
-- Private data only: RLS restricts every row to its owner.

CREATE TABLE IF NOT EXISTS public.user_progress_snapshots (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  schema_version TEXT NOT NULL DEFAULT '2',
  client_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT snapshot_size_limit CHECK (pg_column_size(data) < 5000000)
);

ALTER TABLE public.user_progress_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own snapshot" ON public.user_progress_snapshots;
DROP POLICY IF EXISTS "Users insert own snapshot" ON public.user_progress_snapshots;
DROP POLICY IF EXISTS "Users update own snapshot" ON public.user_progress_snapshots;
DROP POLICY IF EXISTS "Users delete own snapshot" ON public.user_progress_snapshots;

CREATE POLICY "Users read own snapshot" ON public.user_progress_snapshots
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own snapshot" ON public.user_progress_snapshots
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own snapshot" ON public.user_progress_snapshots
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own snapshot" ON public.user_progress_snapshots
  FOR DELETE USING (auth.uid() = user_id);

-- Tighten earlier FOR ALL policies with explicit WITH CHECK so a user can never
-- insert/update rows on behalf of another user_id.
DROP POLICY IF EXISTS "Users can manage own quiz attempts" ON public.quiz_attempts;
DROP POLICY IF EXISTS "Users can manage own mistakes" ON public.user_mistakes;
DROP POLICY IF EXISTS "Users can manage own study sessions" ON public.study_sessions;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own vocab progress" ON public.user_vocabulary_progress;
DROP POLICY IF EXISTS "Users can update own lesson progress" ON public.user_lesson_progress;

CREATE POLICY "Users can manage own quiz attempts" ON public.quiz_attempts
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage own mistakes" ON public.user_mistakes
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage own study sessions" ON public.study_sessions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own vocab progress" ON public.user_vocabulary_progress
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own lesson progress" ON public.user_lesson_progress
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Account deletion: a signed-in user may delete their own private data.
-- (Deleting the auth.users row itself requires the service role; see docs/PRIVASI.md.)
CREATE OR REPLACE FUNCTION public.delete_my_data()
RETURNS void
LANGUAGE sql
SECURITY INVOKER
AS $$
  DELETE FROM public.user_progress_snapshots WHERE user_id = auth.uid();
  DELETE FROM public.user_vocabulary_progress WHERE user_id = auth.uid();
  DELETE FROM public.user_lesson_progress WHERE user_id = auth.uid();
  DELETE FROM public.quiz_attempts WHERE user_id = auth.uid();
  DELETE FROM public.user_mistakes WHERE user_id = auth.uid();
  DELETE FROM public.study_sessions WHERE user_id = auth.uid();
$$;
