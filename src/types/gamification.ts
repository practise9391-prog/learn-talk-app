// Part 15: Advanced Gamification, Motivation, Achievements & Reward System Types
import { CEFRLevel } from './index';

export type XPSourceType =
  | 'lesson'
  | 'speaking'
  | 'roleplay'
  | 'peer'
  | 'revision'
  | 'test'
  | 'pronunciation'
  | 'daily_goal';

export interface LearningXPTransaction {
  id: string;
  userId: string;
  sourceType: XPSourceType;
  sourceId: string;
  eventType: string; // e.g., 'lesson_completed', 'roleplay_finished', 'speaking_turn', 'spaced_review_success'
  xpAmount: number;
  createdAt: string; // ISO 8601
  metadata?: {
    durationSeconds?: number;
    accuracy?: number;
    wpm?: number;
    concept?: string;
    difficulty?: string;
    partnerId?: string;
  };
}

export interface AntiGamingRule {
  sourceType: XPSourceType;
  cooldownSeconds: number; // Minimal wait time between identical activities
  minDurationSeconds: number; // Minimum valid time spent to avoid rapid clicking
  maxDailyXP: number; // Daily ceiling cap to prevent binge gaming over sleep/retention
  repeatContentMaxPerDay: number; // Max times exact same content item yields full XP in 24h
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string; // YYYY-MM-DD
  streakStartDate: string; // YYYY-MM-DD
  freezesAvailable: number;
  freezesMax: number;
  freezeUsedDates: string[]; // YYYY-MM-DD
  isProtectedToday: boolean;
  missedYesterday: boolean;
  canRepairStreak: boolean;
  repairTaskCompleted: boolean;
}

export interface PersonalBestRecord {
  longestConversationSeconds: number;
  highestFluencyWPM: number;
  lowestFillerCountInSession: number;
  highestSpeakingScore: number;
  longestStreakDays: number;
  mostActivitiesInOneDay: number;
  wordsMasteredCount: number;
  lastUpdated: string;
}

export interface GamificationLevel {
  level: number;
  title: string; // e.g., "Novice Communicator", "Curious Speaker", "Conversationalist", "Eloquent Thinker"
  currentLevelXP: number; // XP within current level
  nextLevelXP: number; // XP needed to advance to next level
  totalXP: number;
  progressPercent: number; // 0 - 100
}

export interface GamificationSettings {
  showXP: boolean;
  showStreak: boolean;
  showAchievements: boolean;
  showCelebrationModals: boolean;
  reducedMotion: boolean;
  focusMode: boolean; // Calm, distraction-free view without gamification badges or animations
  timezone: string; // e.g. 'auto', 'Asia/Kolkata', 'America/New_York', 'UTC'
}

export interface DailyAdaptiveGoalPlan {
  targetMinutes: number;
  completedMinutes: number;
  targetActivities: number;
  completedActivities: number;
  isGoalAchieved: boolean;
  bonusQuests: {
    id: string;
    title: string;
    description: string;
    skill: string;
    xpReward: number;
    completed: boolean;
    route: string;
  }[];
}

export interface MasterAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'speaking' | 'fluency' | 'vocabulary' | 'grammar' | 'roleplay' | 'revision' | 'community' | 'consistency';
  tier: 'bronze' | 'silver' | 'gold' | 'diamond';
  xpReward: number;
  requirementDescription: string;
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  educationalBenefit: string;
}

export interface LevelUpCelebration {
  level: number;
  title: string;
  totalXp: number;
  unlockedPerk?: string;
}
