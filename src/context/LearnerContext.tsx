'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  UserProfile, 
  VocabProgress, 
  LessonProgress, 
  QuizAttempt, 
  UserMistake, 
  VocabularyItem, 
  Lesson,
  ReviewRating,
  StrokePracticeRecord,
  StudySession
} from '@/types';
import { storageManager, DEFAULT_GUEST_PROFILE } from '@/lib/storage/storageManager';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { pushSnapshot, pullSnapshot } from '@/lib/supabase/auth';
import { formatDate } from '@/lib/srs/sm2';

interface DailyGoalStatus {
  targetMinutes: number;
  minutesStudiedToday: number;
  percentCompleted: number;
  isGoalAchieved: boolean;
}

interface AuthUserInfo {
  id: string;
  email?: string;
}

interface LearnerContextType {
  profile: UserProfile;
  authUser: AuthUserInfo | null;
  isGuest: boolean;
  isSupabaseActive: boolean;
  vocabList: VocabularyItem[];
  vocabProgress: Record<string, VocabProgress>;
  dueCards: VocabularyItem[];
  strokeRecords: Record<string, StrokePracticeRecord>;
  lessons: Lesson[];
  lessonProgress: Record<string, LessonProgress>;
  mistakes: UserMistake[];
  quizAttempts: QuizAttempt[];
  dailyGoalStatus: DailyGoalStatus;
  isLoading: boolean;
  
  // Actions
  updateProfile: (updates: Partial<UserProfile>) => void;
  recordVocabReview: (vocabId: string, rating: ReviewRating) => void;
  addVocabToSrs: (item: VocabularyItem) => VocabProgress;
  recordStrokePractice: (
    char: string,
    mistakes: number,
    strokeCount: number,
    pinyin?: string,
    meaning?: string
  ) => StrokePracticeRecord;
  recordStudyActivity: (
    durationMinutes: number,
    activityType: StudySession['activity_type'],
    cardsCount?: number,
    scorePercentage?: number
  ) => void;
  toggleBookmark: (vocabId: string) => boolean;
  completeLesson: (lessonId: string, score?: number) => void;
  resolveMistake: (mistakeId: string) => void;
  saveQuizAttempt: (attempt: Omit<QuizAttempt, 'id' | 'created_at'>) => QuizAttempt;
  refreshData: () => void;
  exportData: () => string;
  importData: (jsonStr: string) => boolean;
  resetAll: () => void;
  syncToCloud: () => Promise<{ ok: boolean; message: string }>;
}

const LearnerContext = createContext<LearnerContextType | undefined>(undefined);

export function LearnerProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_GUEST_PROFILE);
  const [authUser, setAuthUser] = useState<AuthUserInfo | null>(null);
  const [vocabList, setVocabList] = useState<VocabularyItem[]>([]);
  const [vocabProgress, setVocabProgress] = useState<Record<string, VocabProgress>>({});
  const [strokeRecords, setStrokeRecords] = useState<Record<string, StrokePracticeRecord>>({});
  const [lessonProgress, setLessonProgress] = useState<Record<string, LessonProgress>>({});
  const [dueCards, setDueCards] = useState<VocabularyItem[]>([]);
  const [mistakes, setMistakes] = useState<UserMistake[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = useCallback(() => {
    const prof = storageManager.getProfile();
    const vList = storageManager.getAllVocabulary();
    const vProg = storageManager.getAllVocabProgress();
    const sRec = storageManager.getStrokeRecords();
    const lProg = storageManager.getLessonProgressMap();
    const due = storageManager.getDueReviewCards();
    const mist = storageManager.getMistakes();
    const qAtt = storageManager.getQuizAttempts();

    setProfile(prof);
    setVocabList(vList);
    setVocabProgress(vProg);
    setStrokeRecords(sRec);
    setLessonProgress(lProg);
    setDueCards(due);
    setMistakes(mist);
    setQuizAttempts(qAtt);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshData();

    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    if (supabase) {
      supabase.auth.getSession().then(({ data }) => {
        const u = data.session?.user;
        if (u) {
          setAuthUser({ id: u.id, email: u.email });
          const metaName =
            (u.user_metadata?.full_name as string | undefined)?.trim() ||
            u.email?.split('@')[0];
          if (metaName) {
            const currentProf = storageManager.getProfile();
            if (currentProf.name === DEFAULT_GUEST_PROFILE.name || !currentProf.name) {
              storageManager.updateProfile({ name: metaName, email: u.email });
              refreshData();
            }
          }
          pullSnapshot(u.id).then((res) => {
            if (res.ok && res.json) {
              storageManager.importUserData(res.json);
              refreshData();
            }
          });
        }
      });

      const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
        const u = session?.user;
        if (u) {
          setAuthUser({ id: u.id, email: u.email });
          const metaName =
            (u.user_metadata?.full_name as string | undefined)?.trim() ||
            u.email?.split('@')[0];
          if (metaName) {
            const currentProf = storageManager.getProfile();
            if (currentProf.name === DEFAULT_GUEST_PROFILE.name || !currentProf.name) {
              storageManager.updateProfile({ name: metaName, email: u.email });
              refreshData();
            }
          }
        } else {
          setAuthUser(null);
        }
      });

      return () => {
        sub.subscription.unsubscribe();
      };
    }
  }, [refreshData]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    const updated = storageManager.updateProfile(updates);
    setProfile(updated);
  };

  const recordVocabReview = (vocabId: string, rating: ReviewRating) => {
    storageManager.recordReviewAnswer(vocabId, rating);
    refreshData();
  };

  const addVocabToSrs = (item: VocabularyItem) => {
    const res = storageManager.addVocabToSrs(item);
    refreshData();
    return res;
  };

  const recordStrokePractice = (
    char: string,
    mistakesCount: number,
    strokeCount: number,
    pinyin?: string,
    meaning?: string
  ) => {
    const rec = storageManager.recordStrokePractice(char, mistakesCount, strokeCount, pinyin, meaning);
    refreshData();
    return rec;
  };

  const recordStudyActivity = (
    durationMinutes: number,
    activityType: StudySession['activity_type'],
    cardsCount: number = 0,
    scorePercentage?: number
  ) => {
    storageManager.recordStudyActivity(durationMinutes, activityType, cardsCount, scorePercentage);
    refreshData();
  };

  const toggleBookmark = (vocabId: string) => {
    const state = storageManager.toggleBookmark(vocabId);
    refreshData();
    return state;
  };

  const completeLesson = (lessonId: string, score: number = 100) => {
    storageManager.markLessonComplete(lessonId, score);
    refreshData();
  };

  const resolveMistake = (mistakeId: string) => {
    storageManager.resolveMistake(mistakeId);
    refreshData();
  };

  const saveQuizAttempt = (attempt: Omit<QuizAttempt, 'id' | 'created_at'>) => {
    const res = storageManager.saveQuizAttempt(attempt);
    refreshData();
    return res;
  };

  const exportData = () => storageManager.exportUserData();

  const importData = (jsonStr: string) => {
    const success = storageManager.importUserData(jsonStr);
    if (success) refreshData();
    return success;
  };

  const resetAll = () => {
    storageManager.resetAllProgress();
    refreshData();
  };

  const syncToCloud = async (): Promise<{ ok: boolean; message: string }> => {
    if (!authUser) {
      return { ok: false, message: 'Silakan masuk akun terlebih dahulu untuk menyinkronkan ke cloud.' };
    }
    const json = storageManager.exportUserData();
    const res = await pushSnapshot(authUser.id, json);
    if (!res.ok) return { ok: false, message: res.error };
    return { ok: true, message: 'Progres berhasil disinkronkan ke Cloud!' };
  };

  const todayStr = formatDate(new Date());
  const sessions = storageManager.getStudySessions();
  const todaySessions = sessions.filter((s) => s.date === todayStr);
  const minutesStudiedToday = todaySessions.reduce((acc, curr) => acc + curr.duration_minutes, 0);
  const targetMinutes = profile.daily_goal_minutes || 25;
  const percentCompleted = Math.min(100, Math.round((minutesStudiedToday / targetMinutes) * 100));
  const isGoalAchieved = minutesStudiedToday >= targetMinutes;

  const dailyGoalStatus: DailyGoalStatus = {
    targetMinutes,
    minutesStudiedToday,
    percentCompleted,
    isGoalAchieved,
  };

  return (
    <LearnerContext.Provider
      value={{
        profile,
        authUser,
        isGuest: !authUser,
        isSupabaseActive: isSupabaseConfigured,
        vocabList,
        vocabProgress,
        dueCards,
        strokeRecords,
        lessons: storageManager.getLessons(),
        lessonProgress,
        mistakes,
        quizAttempts,
        dailyGoalStatus,
        isLoading,
        updateProfile,
        recordVocabReview,
        addVocabToSrs,
        recordStrokePractice,
        recordStudyActivity,
        toggleBookmark,
        completeLesson,
        resolveMistake,
        saveQuizAttempt,
        refreshData,
        exportData,
        importData,
        resetAll,
        syncToCloud,
      }}
    >
      {children}
    </LearnerContext.Provider>
  );
}

export function useLearner() {
  const context = useContext(LearnerContext);
  if (!context) {
    throw new Error('useLearner must be used within a LearnerProvider');
  }
  return context;
}
