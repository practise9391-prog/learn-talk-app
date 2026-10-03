import {
  LearningXPTransaction,
  AntiGamingRule,
  StreakData,
  PersonalBestRecord,
  GamificationLevel,
  MasterAchievement,
  XPSourceType,
} from '../types/gamification';
import { LEVEL_TITLES, DEFAULT_ANTI_GAMING_RULES } from '../data/gamificationData';

export class RewardEngine {
  /**
   * Calculates the gamification learner level from total XP.
   * Learner level is an indicator of practice consistency,
   * completely distinct from CEFR proficiency (A1-C2).
   */
  public static calculateLevel(totalXP: number): GamificationLevel {
    let currentLevel = LEVEL_TITLES[0];
    let nextLevel = LEVEL_TITLES[1] || null;

    for (let i = LEVEL_TITLES.length - 1; i >= 0; i--) {
      if (totalXP >= LEVEL_TITLES[i].minXP) {
        currentLevel = LEVEL_TITLES[i];
        nextLevel = LEVEL_TITLES[i + 1] || null;
        break;
      }
    }

    const currentLevelXP = totalXP - currentLevel.minXP;
    const nextLevelXP = nextLevel ? nextLevel.minXP - currentLevel.minXP : 2000;
    const progressPercent = nextLevel
      ? Math.min(100, Math.max(0, Math.round((currentLevelXP / nextLevelXP) * 100)))
      : 100;

    return {
      level: currentLevel.level,
      title: currentLevel.title,
      currentLevelXP,
      nextLevelXP,
      totalXP,
      progressPercent,
    };
  }

  /**
   * Anti-Gaming XP Verification:
   * Prevents mindless clicking, script spam, binge gaming, and instant skips.
   */
  public static validateXPAward(
    sourceType: XPSourceType,
    sourceId: string,
    requestedXP: number,
    durationSeconds: number,
    historyTransactions: LearningXPTransaction[],
    customRules: Record<string, AntiGamingRule> = DEFAULT_ANTI_GAMING_RULES
  ): { approved: boolean; allowedXP: number; reason?: string } {
    const rule = customRules[sourceType] || DEFAULT_ANTI_GAMING_RULES[sourceType];

    if (!rule) {
      return { approved: true, allowedXP: requestedXP };
    }

    const now = Date.now();
    const todayStr = new Date().toISOString().split('T')[0];

    // Filter today's transactions for this source type
    const todayTransactions = historyTransactions.filter(
      (tx) => tx.sourceType === sourceType && tx.createdAt.startsWith(todayStr)
    );

    // 1. Daily Cap Check
    const totalTodayXP = todayTransactions.reduce((sum, tx) => sum + tx.xpAmount, 0);
    if (totalTodayXP >= rule.maxDailyXP) {
      return {
        approved: false,
        allowedXP: 0,
        reason: `Daily ${sourceType} XP ceiling (${rule.maxDailyXP} XP) reached for today. Take a mindful break!`,
      };
    }

    // 2. Minimum Duration Check (prevents rapid clicking/skipping without learning)
    if (rule.minDurationSeconds > 0 && durationSeconds < rule.minDurationSeconds) {
      return {
        approved: false,
        allowedXP: 0,
        reason: `Activity duration (${durationSeconds}s) is below pedagogical minimum (${rule.minDurationSeconds}s).`,
      };
    }

    // 3. Cooldown Check (same source item completed too quickly in succession)
    const recentIdentical = historyTransactions.find(
      (tx) =>
        tx.sourceType === sourceType &&
        tx.sourceId === sourceId &&
        now - new Date(tx.createdAt).getTime() < rule.cooldownSeconds * 1000
    );

    if (recentIdentical) {
      return {
        approved: false,
        allowedXP: 0,
        reason: `Cooldown in effect: please wait ${rule.cooldownSeconds}s before repeating identical practice.`,
      };
    }

    // 4. Repeated content check
    const timesRepeatedToday = todayTransactions.filter((tx) => tx.sourceId === sourceId).length;
    let allowedXP = requestedXP;
    if (timesRepeatedToday >= rule.repeatContentMaxPerDay) {
      // Diminishing returns: 50% for 3rd repeat, then 0%
      allowedXP = Math.floor(requestedXP * 0.25);
      if (allowedXP <= 0) {
        return {
          approved: false,
          allowedXP: 0,
          reason: `Content repeated ${timesRepeatedToday} times today. Explore new topics to continue earning!`,
        };
      }
    }

    // Ensure we don't exceed the daily cap with this award
    const remainingToCap = Math.max(0, rule.maxDailyXP - totalTodayXP);
    const finalXP = Math.min(allowedXP, remainingToCap);

    return {
      approved: finalXP > 0,
      allowedXP: finalXP,
    };
  }

  /**
   * Evaluates streak status taking into account timezone and streak freezes.
   */
  public static evaluateStreak(
    currentStreakData: StreakData,
    userTimezone: string = 'auto'
  ): StreakData {
    const today = new Date().toISOString().split('T')[0];
    const lastActive = currentStreakData.lastActivityDate;

    // Same day activity: maintain state
    if (lastActive === today) {
      return {
        ...currentStreakData,
        isProtectedToday: true,
        missedYesterday: false,
      };
    }

    // Check difference in days
    const lastDate = new Date(lastActive);
    const currDate = new Date(today);
    const diffTime = Math.abs(currDate.getTime() - lastDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Just yesterday was the last activity; streak is intact, waiting for today's practice
      return {
        ...currentStreakData,
        isProtectedToday: false,
        missedYesterday: false,
      };
    }

    if (diffDays === 2) {
      // Missed 1 day (yesterday). Check for streak freeze protection!
      if (currentStreakData.freezesAvailable > 0) {
        const yesterdayDate = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        return {
          ...currentStreakData,
          freezesAvailable: currentStreakData.freezesAvailable - 1,
          freezeUsedDates: [...currentStreakData.freezeUsedDates, yesterdayDate],
          missedYesterday: false,
          isProtectedToday: true,
        };
      } else {
        // Can repair streak by completing a 3-minute revision session
        return {
          ...currentStreakData,
          missedYesterday: true,
          canRepairStreak: true,
        };
      }
    }

    // Missed multiple days without freezes: gracefully suggest a fresh habit start
    return {
      ...currentStreakData,
      currentStreak: 1, // Soft reset to 1 rather than punishing 0
      streakStartDate: today,
      missedYesterday: false,
      canRepairStreak: false,
    };
  }

  /**
   * Evaluates incoming activity metrics against learner's Personal Best records.
   */
  public static evaluatePersonalBests(
    current: PersonalBestRecord,
    session: {
      durationSeconds?: number;
      fluencyWPM?: number;
      fillerCount?: number;
      speakingScore?: number;
      currentStreakDays?: number;
      wordsMastered?: number;
    }
  ): { updated: PersonalBestRecord; newBests: string[] } {
    const newBests: string[] = [];
    const updated = { ...current };

    if (session.durationSeconds && session.durationSeconds > updated.longestConversationSeconds) {
      updated.longestConversationSeconds = session.durationSeconds;
      newBests.push(`Longest conversation (${Math.round(session.durationSeconds / 60)} min)`);
    }

    if (session.fluencyWPM && session.fluencyWPM > updated.highestFluencyWPM) {
      updated.highestFluencyWPM = session.fluencyWPM;
      newBests.push(`Highest speaking pace (${session.fluencyWPM} WPM)`);
    }

    if (
      session.fillerCount !== undefined &&
      session.durationSeconds &&
      session.durationSeconds >= 60 &&
      session.fillerCount < updated.lowestFillerCountInSession
    ) {
      updated.lowestFillerCountInSession = session.fillerCount;
      newBests.push(`Clean speech record (${session.fillerCount} fillers in 60s)`);
    }

    if (session.speakingScore && session.speakingScore > updated.highestSpeakingScore) {
      updated.highestSpeakingScore = session.speakingScore;
      newBests.push(`Highest speaking score (${session.speakingScore}%)`);
    }

    if (session.currentStreakDays && session.currentStreakDays > updated.longestStreakDays) {
      updated.longestStreakDays = session.currentStreakDays;
      newBests.push(`All-time streak record (${session.currentStreakDays} days)`);
    }

    if (session.wordsMastered && session.wordsMastered > updated.wordsMasteredCount) {
      updated.wordsMasteredCount = session.wordsMastered;
    }

    if (newBests.length > 0) {
      updated.lastUpdated = new Date().toISOString();
    }

    return { updated, newBests };
  }

  /**
   * Progresses and unlocks master achievements based on learner milestones.
   */
  public static evaluateAchievements(
    currentAchievements: MasterAchievement[],
    event: {
      type: string;
      value?: number;
      increment?: number;
    }
  ): { updated: MasterAchievement[]; unlocked: MasterAchievement[] } {
    const unlocked: MasterAchievement[] = [];
    const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const updated = currentAchievements.map((ach) => {
      if (ach.isUnlocked) return ach;

      let newProgress = ach.progress;

      switch (ach.id) {
        case 'first_voice':
          if (event.type === 'speaking_turn') newProgress = 1;
          break;
        case 'talk_marathon':
          if (event.type === 'speaking_session_duration' && event.value) {
            newProgress = Math.max(newProgress, event.value);
          }
          break;
        case 'spontaneous_master':
          if (event.type === 'spontaneous_challenge_completed') {
            newProgress = Math.min(ach.maxProgress, newProgress + (event.increment || 1));
          }
          break;
        case 'zero_fillers':
          if (event.type === 'zero_fillers_session') newProgress = 1;
          break;
        case 'vocab_50':
          if (event.type === 'vocab_spoken') {
            newProgress = Math.min(ach.maxProgress, newProgress + (event.increment || 1));
          }
          break;
        case 'idiom_naturalist':
          if (event.type === 'idiom_spoken') {
            newProgress = Math.min(ach.maxProgress, newProgress + (event.increment || 1));
          }
          break;
        case 'error_slayer':
          if (event.type === 'mistake_resolved') {
            newProgress = Math.min(ach.maxProgress, newProgress + (event.increment || 1));
          }
          break;
        case 'interview_champ':
          if (event.type === 'interview_roleplay_completed') newProgress = 1;
          break;
        case 'workplace_diplomat':
          if (event.type === 'workplace_roleplay_completed') {
            newProgress = Math.min(ach.maxProgress, newProgress + 1);
          }
          break;
        case 'streak_7':
        case 'streak_30':
          if (event.type === 'streak_updated' && event.value) {
            newProgress = Math.min(ach.maxProgress, event.value);
          }
          break;
        case 'peer_icebreaker':
          if (event.type === 'peer_session_completed') newProgress = 1;
          break;
        case 'group_contributor':
          if (event.type === 'group_session_completed') {
            newProgress = Math.min(ach.maxProgress, newProgress + 1);
          }
          break;
      }

      const justUnlocked = newProgress >= ach.maxProgress;
      if (justUnlocked) {
        const newlyUnlockedAch: MasterAchievement = {
          ...ach,
          progress: ach.maxProgress,
          isUnlocked: true,
          unlockedAt: nowStr,
        };
        unlocked.push(newlyUnlockedAch);
        return newlyUnlockedAch;
      }

      return {
        ...ach,
        progress: newProgress,
      };
    });

    return { updated, unlocked };
  }
}
