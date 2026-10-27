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
  ReviewRating
} from '@/types';
import { storageManager, DEFAULT_GUEST_PROFILE } from '@/lib/storage/storageManager';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { formatDate } from '@/lib/srs/sm2';

interface DailyGoalStatus {
  targetMinutes: number;
  minutesStudiedToday: number;
  percentCompleted: number;
  isGoalAchieved: boolean;
}

interface LearnerContextType {
  profile: UserProfile;
  isGuest: boolean;
  isSupabaseActive: boolean;
  vocabList: VocabularyItem[];
  vocabProgress: Record<string, VocabProgress>;
  dueCards: VocabularyItem[];
  lessons: Lesson[];
  lessonProgress: Record<string, LessonProgress>;
  mistakes: UserMistake[];
  quizAttempts: QuizAttempt[];
  dailyGoalStatus: DailyGoalStatus;
  isLoading: boolean;
  
  // Actions
  updateProfile: (updates: Partial<UserProfile>) => void;
  recordVocabReview: (vocabId: string, rating: ReviewRating) => void;
  toggleBookmark: (vocabId: string) => boolean;
  completeLesson: (lessonId: string, score?: number) => void;
  resolveMistake: (mistakeId: string) => void;
  saveQuizAttempt: (attempt: Omit<QuizAttempt, 'id' | 'created_at'>) => QuizAttempt;
  refreshData: () => void;
  exportData: () => string;
  importData: (jsonStr: string) => boolean;
  resetAll: () => void;
}

const LearnerContext = createContext<LearnerContextType | undefined>(undefined);

export function LearnerProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_GUEST_PROFILE);
  const [vocabProgress, setVocabProgress] = useState<Record<string, VocabProgress>>({});
  const [lessonProgress, setLessonProgress] = useState<Record<string, LessonProgress>>({});
  const [dueCards, setDueCards] = useState<VocabularyItem[]>([]);
  const [mistakes, setMistakes] = useState<UserMistake[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = useCallback(() => {
    const prof = storageManager.getProfile();
    const vProg = storageManager.getAllVocabProgress();
    const lProg = storageManager.getLessonProgressMap();
    const due = storageManager.getDueReviewCards();
    const mist = storageManager.getMistakes();
    const qAtt = storageManager.getQuizAttempts();

    setProfile(prof);
    setVocabProgress(vProg);
    setLessonProgress(lProg);
    setDueCards(due);
    setMistakes(mist);
    setQuizAttempts(qAtt);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    const updated = storageManager.updateProfile(updates);
    setProfile(updated);
  };

  const recordVocabReview = (vocabId: string, rating: ReviewRating) => {
    storageManager.recordReviewAnswer(vocabId, rating);
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

  // Calculate today's study minutes
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
        isGuest: true, // Guest / local mode is standard fallback when no cloud auth
        isSupabaseActive: isSupabaseConfigured,
        vocabList: storageManager.getAllVocabulary(),
        vocabProgress,
        dueCards,
        lessons: storageManager.getLessons(),
        lessonProgress,
        mistakes,
        quizAttempts,
        dailyGoalStatus,
        isLoading,
        updateProfile,
        recordVocabReview,
        toggleBookmark,
        completeLesson,
        resolveMistake,
        saveQuizAttempt,
        refreshData,
        exportData,
        importData,
        resetAll,
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
