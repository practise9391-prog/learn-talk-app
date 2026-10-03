import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  LearningXPTransaction,
  AntiGamingRule,
  StreakData,
  PersonalBestRecord,
  GamificationLevel,
  GamificationSettings,
  DailyAdaptiveGoalPlan,
  MasterAchievement,
  LevelUpCelebration,
  XPSourceType,
} from '../types/gamification';
import {
  MASTER_ACHIEVEMENTS,
  DEFAULT_ANTI_GAMING_RULES,
  DEFAULT_GAMIFICATION_SETTINGS,
  INITIAL_STREAK_DATA,
  INITIAL_PERSONAL_BESTS,
  LEVEL_TITLES,
} from '../data/gamificationData';
import { RewardEngine } from '../services/rewardEngine';
import { useUser } from './UserContext';
import { useAdaptiveLearning } from './AdaptiveLearningContext';

interface GamificationContextType {
  userLevel: GamificationLevel;
  streakData: StreakData;
  personalBests: PersonalBestRecord;
  achievements: MasterAchievement[];
  xpTransactions: LearningXPTransaction[];
  gamificationSettings: GamificationSettings;
  antiGamingRules: Record<string, AntiGamingRule>;
  dailyPlan: DailyAdaptiveGoalPlan;
  activeLevelUp: LevelUpCelebration | null;
  activeCelebration: { title: string; subtitle: string; xp: number; icon: string } | null;
  activeAchievementModal: MasterAchievement | null;
  isSettingsModalOpen: boolean;

  awardXP: (
    sourceType: XPSourceType,
    sourceId: string,
    eventType: string,
    requestedXP: number,
    durationSeconds?: number,
    metadata?: any
  ) => { awarded: boolean; xp: number; reason?: string };

  useStreakFreeze: () => boolean;
  repairStreakWithTask: () => void;
  updateGamificationSettings: (partial: Partial<GamificationSettings>) => void;
  updateAntiGamingRule: (sourceType: string, partial: Partial<AntiGamingRule>) => void;
  openAchievementModal: (achievement: MasterAchievement) => void;
  closeAchievementModal: () => void;
  dismissLevelUp: () => void;
  dismissCelebration: () => void;
  openSettingsModal: () => void;
  closeSettingsModal: () => void;
  recordSessionMetrics: (metrics: {
    durationSeconds?: number;
    fluencyWPM?: number;
    fillerCount?: number;
    speakingScore?: number;
    wordsMastered?: number;
  }) => void;
  completeDailyBonusQuest: (questId: string) => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateUser } = useUser();
  const { recommendations } = useAdaptiveLearning();

  // 1. Settings state
  const [gamificationSettings, setGamificationSettings] = useState<GamificationSettings>(() => {
    const saved = localStorage.getItem('learntalk_gamification_settings');
    return saved ? JSON.parse(saved) : DEFAULT_GAMIFICATION_SETTINGS;
  });

  // 2. Anti-Gaming rules
  const [antiGamingRules, setAntiGamingRules] = useState<Record<string, AntiGamingRule>>(() => {
    const saved = localStorage.getItem('learntalk_antigaming_rules');
    return saved ? JSON.parse(saved) : DEFAULT_ANTI_GAMING_RULES;
  });

  // 3. Transactions ledger
  const [xpTransactions, setXpTransactions] = useState<LearningXPTransaction[]>(() => {
    const saved = localStorage.getItem('learntalk_xp_transactions');
    if (saved) return JSON.parse(saved);
    // Initial sample transaction seed
    return [
      {
        id: 'tx-init-1',
        userId: user.id || 'u-1',
        sourceType: 'speaking',
        sourceId: 'talk-session-daily',
        eventType: 'speaking_session_duration',
        xpAmount: 70,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        metadata: { durationSeconds: 420, wpm: 128 },
      },
      {
        id: 'tx-init-2',
        userId: user.id || 'u-1',
        sourceType: 'lesson',
        sourceId: 'lesson-present-tense',
        eventType: 'lesson_completed',
        xpAmount: 50,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        metadata: { accuracy: 92 },
      },
    ];
  });

  // 4. Streak state
  const [streakData, setStreakData] = useState<StreakData>(() => {
    const saved = localStorage.getItem('learntalk_streak_data');
    const initial = saved ? JSON.parse(saved) : INITIAL_STREAK_DATA;
    return RewardEngine.evaluateStreak(initial, gamificationSettings.timezone);
  });

  // 5. Personal Bests
  const [personalBests, setPersonalBests] = useState<PersonalBestRecord>(() => {
    const saved = localStorage.getItem('learntalk_personal_bests');
    return saved ? JSON.parse(saved) : INITIAL_PERSONAL_BESTS;
  });

  // 6. Master Achievements
  const [achievements, setAchievements] = useState<MasterAchievement[]>(() => {
    const saved = localStorage.getItem('learntalk_master_achievements');
    return saved ? JSON.parse(saved) : MASTER_ACHIEVEMENTS;
  });

  // 7. Modals & Notifications
  const [activeLevelUp, setActiveLevelUp] = useState<LevelUpCelebration | null>(null);
  const [activeCelebration, setActiveCelebration] = useState<{
    title: string;
    subtitle: string;
    xp: number;
    icon: string;
  } | null>(null);
  const [activeAchievementModal, setActiveAchievementModal] = useState<MasterAchievement | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  // 8. Daily Goal Plan with dynamic Adaptive quests
  const [dailyPlan, setDailyPlan] = useState<DailyAdaptiveGoalPlan>(() => {
    const topRec = recommendations[0];
    return {
      targetMinutes: user.dailyGoalMinutes || 15,
      completedMinutes: user.minutesSpokenToday || 7,
      targetActivities: 3,
      completedActivities: 2,
      isGoalAchieved: (user.minutesSpokenToday || 0) >= (user.dailyGoalMinutes || 15),
      bonusQuests: [
        {
          id: 'quest-voice-1',
          title: '3-Minute Free Voice Practice',
          description: 'Engage with Jarvis AI on any topic of your choice without hesitation.',
          skill: 'Speaking',
          xpReward: 35,
          completed: true,
          route: '/talk/jarvis',
        },
        {
          id: 'quest-adaptive-weakness',
          title: topRec?.title || 'Targeted Tenses Revision',
          description: topRec?.reason || 'Review irregular past tense verbs in spontaneous sentences.',
          skill: topRec?.tag || 'Grammar',
          xpReward: 40,
          completed: false,
          route: topRec?.actionRoute || '/grammar',
        },
        {
          id: 'quest-roleplay-1',
          title: 'Workplace Phone Simulation',
          description: 'Answer an incoming business call and clarify meeting timings.',
          skill: 'Roleplay',
          xpReward: 50,
          completed: false,
          route: '/talk/phone',
        },
      ],
    };
  });

  // Persist state updates to localStorage
  useEffect(() => {
    localStorage.setItem('learntalk_gamification_settings', JSON.stringify(gamificationSettings));
  }, [gamificationSettings]);

  useEffect(() => {
    localStorage.setItem('learntalk_antigaming_rules', JSON.stringify(antiGamingRules));
  }, [antiGamingRules]);

  useEffect(() => {
    localStorage.setItem('learntalk_xp_transactions', JSON.stringify(xpTransactions));
  }, [xpTransactions]);

  useEffect(() => {
    localStorage.setItem('learntalk_streak_data', JSON.stringify(streakData));
  }, [streakData]);

  useEffect(() => {
    localStorage.setItem('learntalk_personal_bests', JSON.stringify(personalBests));
  }, [personalBests]);

  useEffect(() => {
    localStorage.setItem('learntalk_master_achievements', JSON.stringify(achievements));
  }, [achievements]);

  // Derived user level from total XP
  const userLevel = RewardEngine.calculateLevel(user.xp || 420);

  // Sync daily plan with user minutes spoken
  useEffect(() => {
    setDailyPlan((prev) => ({
      ...prev,
      targetMinutes: user.dailyGoalMinutes || 15,
      completedMinutes: user.minutesSpokenToday || 0,
      isGoalAchieved: (user.minutesSpokenToday || 0) >= (user.dailyGoalMinutes || 15),
    }));
  }, [user.minutesSpokenToday, user.dailyGoalMinutes]);

  /**
   * Main Award XP pipeline with anti-gaming validation, level detection, and celebrations
   */
  const awardXP = (
    sourceType: XPSourceType,
    sourceId: string,
    eventType: string,
    requestedXP: number,
    durationSeconds: number = 60,
    metadata?: any
  ): { awarded: boolean; xp: number; reason?: string } => {
    // 1. Validate with Anti-Gaming Engine
    const validation = RewardEngine.validateXPAward(
      sourceType,
      sourceId,
      requestedXP,
      durationSeconds,
      xpTransactions,
      antiGamingRules
    );

    if (!validation.approved || validation.allowedXP <= 0) {
      return { awarded: false, xp: 0, reason: validation.reason };
    }

    const awardedXP = validation.allowedXP;
    const oldXP = user.xp || 0;
    const newXP = oldXP + awardedXP;

    // 2. Create transaction record
    const newTx: LearningXPTransaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: user.id || 'u-1',
      sourceType,
      sourceId,
      eventType,
      xpAmount: awardedXP,
      createdAt: new Date().toISOString(),
      metadata: { durationSeconds, ...metadata },
    };

    setXpTransactions((prev) => [newTx, ...prev]);

    // 3. Update User Context XP
    updateUser({ xp: newXP });

    // 4. Update today's streak activity
    const todayStr = new Date().toISOString().split('T')[0];
    if (streakData.lastActivityDate !== todayStr) {
      setStreakData((prev) => ({
        ...prev,
        currentStreak: prev.currentStreak + 1,
        longestStreak: Math.max(prev.longestStreak, prev.currentStreak + 1),
        lastActivityDate: todayStr,
        isProtectedToday: true,
        missedYesterday: false,
      }));
    }

    // 5. Level Up check
    const oldLevelObj = RewardEngine.calculateLevel(oldXP);
    const newLevelObj = RewardEngine.calculateLevel(newXP);

    if (newLevelObj.level > oldLevelObj.level) {
      const perkInfo = LEVEL_TITLES.find((l) => l.level === newLevelObj.level)?.perk;
      if (gamificationSettings.showCelebrationModals && !gamificationSettings.focusMode) {
        setActiveLevelUp({
          level: newLevelObj.level,
          title: newLevelObj.title,
          totalXp: newXP,
          unlockedPerk: perkInfo,
        });
      }
    } else if (gamificationSettings.showCelebrationModals && !gamificationSettings.focusMode && awardedXP >= 40) {
      // Minor celebration toast for significant learning milestone
      setActiveCelebration({
        title: `+${awardedXP} XP Earned!`,
        subtitle: eventType.replace(/_/g, ' '),
        xp: awardedXP,
        icon: 'Sparkles',
      });
    }

    // 6. Evaluate achievements
    const { updated, unlocked } = RewardEngine.evaluateAchievements(achievements, {
      type: eventType,
      value: durationSeconds,
      increment: 1,
    });

    if (unlocked.length > 0) {
      setAchievements(updated);
      const topUnlocked = unlocked[0];
      if (gamificationSettings.showCelebrationModals && !gamificationSettings.focusMode) {
        setActiveCelebration({
          title: `Achievement Unlocked!`,
          subtitle: topUnlocked.title,
          xp: topUnlocked.xpReward,
          icon: topUnlocked.icon,
        });
      }
    }

    return { awarded: true, xp: awardedXP };
  };

  /**
   * Consume a streak freeze
   */
  const useStreakFreeze = (): boolean => {
    if (streakData.freezesAvailable <= 0) return false;
    const todayStr = new Date().toISOString().split('T')[0];
    setStreakData((prev) => ({
      ...prev,
      freezesAvailable: prev.freezesAvailable - 1,
      freezeUsedDates: [...prev.freezeUsedDates, todayStr],
      isProtectedToday: true,
      missedYesterday: false,
    }));
    return true;
  };

  /**
   * Complete targeted revision task to repair a missed day streak
   */
  const repairStreakWithTask = () => {
    setStreakData((prev) => ({
      ...prev,
      missedYesterday: false,
      canRepairStreak: false,
      repairTaskCompleted: true,
      currentStreak: prev.currentStreak,
      lastActivityDate: new Date().toISOString().split('T')[0],
      isProtectedToday: true,
    }));
    awardXP('revision', 'streak-repair', 'streak_repaired_successfully', 30, 180);
  };

  const updateGamificationSettings = (partial: Partial<GamificationSettings>) => {
    setGamificationSettings((prev) => ({ ...prev, ...partial }));
  };

  const updateAntiGamingRule = (sourceType: string, partial: Partial<AntiGamingRule>) => {
    setAntiGamingRules((prev) => ({
      ...prev,
      [sourceType]: {
        ...(prev[sourceType] || DEFAULT_ANTI_GAMING_RULES[sourceType]),
        ...partial,
      },
    }));
  };

  const recordSessionMetrics = (metrics: {
    durationSeconds?: number;
    fluencyWPM?: number;
    fillerCount?: number;
    speakingScore?: number;
    wordsMastered?: number;
  }) => {
    const { updated, newBests } = RewardEngine.evaluatePersonalBests(personalBests, {
      ...metrics,
      currentStreakDays: streakData.currentStreak,
    });
    setPersonalBests(updated);

    if (newBests.length > 0 && gamificationSettings.showCelebrationModals && !gamificationSettings.focusMode) {
      setActiveCelebration({
        title: 'New Personal Record!',
        subtitle: newBests[0],
        xp: 25,
        icon: 'Award',
      });
    }
  };

  const completeDailyBonusQuest = (questId: string) => {
    const quest = dailyPlan.bonusQuests.find((q) => q.id === questId);
    if (!quest || quest.completed) return;

    setDailyPlan((prev) => ({
      ...prev,
      bonusQuests: prev.bonusQuests.map((q) => (q.id === questId ? { ...q, completed: true } : q)),
      completedActivities: prev.completedActivities + 1,
    }));

    awardXP('daily_goal', questId, 'daily_quest_completed', quest.xpReward, 60);
  };

  return (
    <GamificationContext.Provider
      value={{
        userLevel,
        streakData,
        personalBests,
        achievements,
        xpTransactions,
        gamificationSettings,
        antiGamingRules,
        dailyPlan,
        activeLevelUp,
        activeCelebration,
        activeAchievementModal,
        isSettingsModalOpen,
        awardXP,
        useStreakFreeze,
        repairStreakWithTask,
        updateGamificationSettings,
        updateAntiGamingRule,
        openAchievementModal: (ach) => setActiveAchievementModal(ach),
        closeAchievementModal: () => setActiveAchievementModal(null),
        dismissLevelUp: () => setActiveLevelUp(null),
        dismissCelebration: () => setActiveCelebration(null),
        openSettingsModal: () => setIsSettingsModalOpen(true),
        closeSettingsModal: () => setIsSettingsModalOpen(false),
        recordSessionMetrics,
        completeDailyBonusQuest,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = (): GamificationContextType => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};
