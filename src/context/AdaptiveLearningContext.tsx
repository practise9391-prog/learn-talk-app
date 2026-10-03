import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  LearnerSkillProfile,
  LearningEvidence,
  MasteryRecord,
  PersonalizedRecommendation,
  DailyAdaptivePlan,
  WeeklyPlan,
  ErrorCluster,
  SkillDependencyNode,
  LearningGoalId,
  LearningGoalConfig,
  SkillName,
  SkillProficiencyLevel,
  AdaptiveDifficultyLevel,
} from '../types/adaptive';
import {
  LEARNING_GOALS_CONFIG,
  INITIAL_SKILL_PROFILE,
  SEED_MASTERY_RECORDS,
  SEED_ERROR_CLUSTERS,
  SEED_SKILL_GRAPH_NODES,
  INITIAL_DAILY_PLAN,
  INITIAL_WEEKLY_PLAN,
  INITIAL_RECOMMENDATIONS,
} from '../data/adaptiveData';

interface AdaptiveLearningContextType {
  skillProfile: LearnerSkillProfile;
  masteryRecords: MasteryRecord[];
  recommendations: PersonalizedRecommendation[];
  primaryRecommendation: PersonalizedRecommendation;
  dailyPlan: DailyAdaptivePlan;
  weeklyPlan: WeeklyPlan;
  errorClusters: ErrorCluster[];
  skillGraph: SkillDependencyNode[];
  goalsConfig: Record<string, LearningGoalConfig>;
  activeGoal: LearningGoalConfig;
  activeRecurringMistake: ErrorCluster | null;
  overdueMasteryCount: number;

  // Actions
  recordEvidence: (evidence: Omit<LearningEvidence, 'id' | 'timestamp'>) => void;
  setPrimaryGoal: (goalId: LearningGoalId) => void;
  setSecondaryGoals: (goalIds: LearningGoalId[]) => void;
  setDailyPlanTier: (tier: 'quick5' | 'standard15' | 'deep30') => void;
  completePlanItem: (itemId: string) => void;
  resolveMasteryReview: (recordId: string, performanceScore: number) => void;
  getWhyThisExplanation: (recId: string) => string;
  dismissRecurringMistakeAlert: () => void;
  adjustDifficulty: (level: AdaptiveDifficultyLevel) => void;
}

const AdaptiveLearningContext = createContext<AdaptiveLearningContextType | undefined>(undefined);

export const AdaptiveLearningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [skillProfile, setSkillProfile] = useState<LearnerSkillProfile>(() => {
    const saved = localStorage.getItem('learntalk_skill_profile_v2');
    return saved ? JSON.parse(saved) : INITIAL_SKILL_PROFILE;
  });

  const [masteryRecords, setMasteryRecords] = useState<MasteryRecord[]>(() => {
    const saved = localStorage.getItem('learntalk_mastery_records');
    return saved ? JSON.parse(saved) : SEED_MASTERY_RECORDS;
  });

  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>(() => {
    const saved = localStorage.getItem('learntalk_recommendations');
    return saved ? JSON.parse(saved) : INITIAL_RECOMMENDATIONS;
  });

  const [dailyPlan, setDailyPlan] = useState<DailyAdaptivePlan>(() => {
    const saved = localStorage.getItem('learntalk_daily_plan');
    return saved ? JSON.parse(saved) : INITIAL_DAILY_PLAN;
  });

  const [weeklyPlan] = useState<WeeklyPlan>(INITIAL_WEEKLY_PLAN);
  const [errorClusters, setErrorClusters] = useState<ErrorCluster[]>(SEED_ERROR_CLUSTERS);
  const [skillGraph, setSkillGraph] = useState<SkillDependencyNode[]>(SEED_SKILL_GRAPH_NODES);
  const [dismissedClusterId, setDismissedClusterId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('learntalk_skill_profile_v2', JSON.stringify(skillProfile));
  }, [skillProfile]);

  useEffect(() => {
    localStorage.setItem('learntalk_mastery_records', JSON.stringify(masteryRecords));
  }, [masteryRecords]);

  useEffect(() => {
    localStorage.setItem('learntalk_recommendations', JSON.stringify(recommendations));
  }, [recommendations]);

  useEffect(() => {
    localStorage.setItem('learntalk_daily_plan', JSON.stringify(dailyPlan));
  }, [dailyPlan]);

  const activeGoal = LEARNING_GOALS_CONFIG[skillProfile.primaryGoal] || LEARNING_GOALS_CONFIG.job_interview;

  // Primary recommendation: top scored item
  const primaryRecommendation = recommendations[0] || INITIAL_RECOMMENDATIONS[0];

  // Active recurring mistake warning (occurrences >= 3 and not dismissed)
  const activeRecurringMistake =
    errorClusters.find((c) => c.status === 'active' && c.occurrences >= 3 && c.patternId !== dismissedClusterId) || null;

  const overdueMasteryCount = masteryRecords.filter((m) => m.isDecayed).length;

  // Record evidence and continuously adapt the system (Section 1, 16, 18, 19, 21)
  const recordEvidence = (evidenceData: Omit<LearningEvidence, 'id' | 'timestamp'>) => {
    const evidence: LearningEvidence = {
      ...evidenceData,
      id: `ev-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    setSkillProfile((prev) => {
      const targetSkill = prev.skills[evidence.targetSkill];
      if (!targetSkill) return prev;

      // Update skill score using weighted moving average (70% previous, 30% new evidence)
      const newScore = Math.min(100, Math.max(0, Math.round(targetSkill.score * 0.7 + evidence.accuracyScore * 0.3)));
      const newCount = targetSkill.evidenceCount + 1;
      const trend = newScore > targetSkill.score ? 'improving' : newScore < targetSkill.score ? 'declining' : 'stable';

      // Compute level from score
      let newLevel: SkillProficiencyLevel = 'Beginner';
      if (newScore >= 90) newLevel = 'Fluent';
      else if (newScore >= 80) newLevel = 'Advanced';
      else if (newScore >= 72) newLevel = 'Intermediate+';
      else if (newScore >= 65) newLevel = 'Intermediate';
      else if (newScore >= 55) newLevel = 'Beginner+';

      const updatedSkills = {
        ...prev.skills,
        [evidence.targetSkill]: {
          ...targetSkill,
          score: newScore,
          level: newLevel,
          trend,
          evidenceCount: newCount,
          lastDemonstrated: 'Just now',
        },
      };

      // Difficulty adaptation (Section 16, 18, 19)
      let newStreak = prev.recentSuccessStreak;
      let newStruggle = prev.recentStruggleCount;
      let autoEased = prev.autoEased;
      let challengeMode = prev.challengeMode;
      let currentDifficulty = prev.currentDifficulty;

      if (evidence.accuracyScore >= 85) {
        newStreak += 1;
        newStruggle = Math.max(0, newStruggle - 1);
        if (newStreak >= 4 && currentDifficulty !== 'advanced') {
          challengeMode = true;
          autoEased = false;
          if (currentDifficulty === 'easy') currentDifficulty = 'normal';
          else if (currentDifficulty === 'normal') currentDifficulty = 'challenging';
          else if (currentDifficulty === 'challenging') currentDifficulty = 'advanced';
        }
      } else if (evidence.accuracyScore < 55) {
        newStruggle += 1;
        newStreak = 0;
        if (newStruggle >= 2 && currentDifficulty !== 'easy') {
          autoEased = true;
          challengeMode = false;
          if (currentDifficulty === 'advanced') currentDifficulty = 'challenging';
          else if (currentDifficulty === 'challenging') currentDifficulty = 'normal';
          else if (currentDifficulty === 'normal') currentDifficulty = 'easy';
        }
      }

      // Brain-freeze / hesitation detection (Section 21)
      const hesitationDetected = (evidence.hesitationCount || 0) >= 3;
      const hesitationPrompt = hesitationDetected
        ? "Let's practice starting answers quickly with structured sentence frames!"
        : undefined;

      return {
        ...prev,
        skills: updatedSkills,
        recentSuccessStreak: newStreak,
        recentStruggleCount: newStruggle,
        autoEased,
        challengeMode,
        currentDifficulty,
        hesitationDetected,
        hesitationPrompt,
        lastActiveDate: 'Today',
      };
    });

    // If mistakes made, update or cluster error patterns (Section 26 & 27)
    if (evidence.mistakesMade && evidence.mistakesMade.length > 0) {
      setErrorClusters((prev) =>
        prev.map((cluster) => {
          const matched = evidence.mistakesMade?.some((m) =>
            m.toLowerCase().includes(cluster.category) || cluster.sampleMistakes.some((s) => m.toLowerCase().includes(s.slice(0, 8).toLowerCase()))
          );
          if (matched) {
            return {
              ...cluster,
              occurrences: cluster.occurrences + 1,
              status: 'active',
            };
          }
          return cluster;
        })
      );
    }
  };

  const setPrimaryGoal = (goalId: LearningGoalId) => {
    setSkillProfile((prev) => ({
      ...prev,
      primaryGoal: goalId,
    }));

    // Reprioritize recommendations dynamically for selected goal
    const goalTitle = LEARNING_GOALS_CONFIG[goalId]?.title || 'Daily English';
    setDailyPlan((prev) => ({
      ...prev,
      primaryGoalTitle: goalTitle,
    }));
  };

  const setSecondaryGoals = (goalIds: LearningGoalId[]) => {
    setSkillProfile((prev) => ({
      ...prev,
      secondaryGoals: goalIds,
    }));
  };

  const setDailyPlanTier = (tier: 'quick5' | 'standard15' | 'deep30') => {
    setDailyPlan((prev) => ({
      ...prev,
      selectedTier: tier,
    }));
  };

  const completePlanItem = (itemId: string) => {
    setDailyPlan((prev) => {
      const updateTier = (items: typeof prev.quick5) =>
        items.map((item) => (item.id === itemId ? { ...item, completed: true } : item));
      return {
        ...prev,
        quick5: updateTier(prev.quick5),
        standard15: updateTier(prev.standard15),
        deep30: updateTier(prev.deep30),
      };
    });
  };

  const resolveMasteryReview = (recordId: string, performanceScore: number) => {
    setMasteryRecords((prev) =>
      prev.map((rec) => {
        if (rec.id === recordId) {
          const newInterval = performanceScore >= 80 ? rec.intervalDays * 2 : Math.max(1, Math.round(rec.intervalDays / 2));
          return {
            ...rec,
            isDecayed: false,
            decayWarning: undefined,
            masteryScore: Math.min(100, Math.round(rec.masteryScore * 0.8 + performanceScore * 0.2)),
            demonstrationCount: rec.demonstrationCount + 1,
            lastPracticed: 'Just now',
            intervalDays: newInterval,
            nextReviewDate: `In ${newInterval} days`,
          };
        }
        return rec;
      })
    );
  };

  const getWhyThisExplanation = (recId: string): string => {
    const found = recommendations.find((r) => r.id === recId);
    return found?.whyThisText || 'Recommended based on your current learning goal and recent performance patterns.';
  };

  const dismissRecurringMistakeAlert = () => {
    if (activeRecurringMistake) {
      setDismissedClusterId(activeRecurringMistake.patternId);
    }
  };

  const adjustDifficulty = (level: AdaptiveDifficultyLevel) => {
    setSkillProfile((prev) => ({
      ...prev,
      currentDifficulty: level,
      autoEased: false,
      challengeMode: false,
    }));
  };

  return (
    <AdaptiveLearningContext.Provider
      value={{
        skillProfile,
        masteryRecords,
        recommendations,
        primaryRecommendation,
        dailyPlan,
        weeklyPlan,
        errorClusters,
        skillGraph,
        goalsConfig: LEARNING_GOALS_CONFIG,
        activeGoal,
        activeRecurringMistake,
        overdueMasteryCount,
        recordEvidence,
        setPrimaryGoal,
        setSecondaryGoals,
        setDailyPlanTier,
        completePlanItem,
        resolveMasteryReview,
        getWhyThisExplanation,
        dismissRecurringMistakeAlert,
        adjustDifficulty,
      }}
    >
      {children}
    </AdaptiveLearningContext.Provider>
  );
};

export const useAdaptiveLearning = () => {
  const context = useContext(AdaptiveLearningContext);
  if (!context) throw new Error('useAdaptiveLearning must be used within AdaptiveLearningProvider');
  return context;
};
