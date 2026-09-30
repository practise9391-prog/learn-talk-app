import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  ActivityHistoryItem,
  UnifiedMistake,
  Achievement,
  GoalDefinition,
  SpeakingComparisonData,
  LearnerInsight,
  RevisionItem,
  RevisionPriority,
} from '../types/history';
import {
  SAMPLE_ACTIVITIES,
  SAMPLE_UNIFIED_MISTAKES,
  SAMPLE_ACHIEVEMENTS,
  SAMPLE_GOALS,
  SAMPLE_COMPARISON,
  SAMPLE_INSIGHTS,
} from '../data/historyData';

interface HistoryContextType {
  activities: ActivityHistoryItem[];
  mistakes: UnifiedMistake[];
  achievements: Achievement[];
  goals: GoalDefinition[];
  activeGoalId: string;
  activeGoal: GoalDefinition;
  comparisonData: SpeakingComparisonData;
  insights: LearnerInsight[];
  revisionQueue: RevisionItem[];
  logActivity: (activity: Omit<ActivityHistoryItem, 'id' | 'createdAt'>) => string;
  deleteActivity: (id: string) => void;
  deleteRecording: (id: string) => void;
  logMistake: (mistake: Omit<UnifiedMistake, 'id' | 'firstSeen' | 'lastSeen' | 'occurrenceCount' | 'correctedCount' | 'masteryScore' | 'status' | 'evolutionHistory'>) => void;
  resolveMistake: (id: string, success: boolean) => void;
  runRevisionItem: (itemId: string, success: boolean) => void;
  setActiveGoalId: (goalId: string) => void;
  exportUserData: () => void;
  clearAllHistory: () => void;
  getAiCoachSummary: () => string;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<ActivityHistoryItem[]>(() => {
    const saved = localStorage.getItem('learntalk_history_activities');
    return saved ? JSON.parse(saved) : SAMPLE_ACTIVITIES;
  });

  const [mistakes, setMistakes] = useState<UnifiedMistake[]>(() => {
    const saved = localStorage.getItem('learntalk_unified_mistakes');
    return saved ? JSON.parse(saved) : SAMPLE_UNIFIED_MISTAKES;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('learntalk_achievements');
    return saved ? JSON.parse(saved) : SAMPLE_ACHIEVEMENTS;
  });

  const [activeGoalId, setActiveGoalId] = useState<string>(() => {
    return localStorage.getItem('learntalk_active_goal') || 'goal-workplace';
  });

  const [insights] = useState<LearnerInsight[]>(SAMPLE_INSIGHTS);
  const [comparisonData] = useState<SpeakingComparisonData>(SAMPLE_COMPARISON);

  useEffect(() => {
    localStorage.setItem('learntalk_history_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('learntalk_unified_mistakes', JSON.stringify(mistakes));
  }, [mistakes]);

  useEffect(() => {
    localStorage.setItem('learntalk_achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('learntalk_active_goal', activeGoalId);
  }, [activeGoalId]);

  const activeGoal = useMemo(() => {
    return SAMPLE_GOALS.find((g) => g.id === activeGoalId) || SAMPLE_GOALS[0];
  }, [activeGoalId]);

  // Compute revision queue using Spaced Repetition / Leitner & urgency algorithms
  const revisionQueue = useMemo<RevisionItem[]>(() => {
    const queue: RevisionItem[] = [];

    // 1. Add recurring mistakes
    mistakes
      .filter((m) => m.status !== 'mastered')
      .forEach((m) => {
        const forgettingRisk = Math.max(10, 100 - m.masteryScore);
        const priorityScore = (m.occurrenceCount * 1.5 + (m.severity === 'critical' ? 40 : m.severity === 'important' ? 25 : 10)) * (forgettingRisk / 100);
        let priority: RevisionPriority = 'low';
        if (priorityScore > 20 || m.status === 'repeated') priority = 'high';
        else if (priorityScore > 10) priority = 'medium';

        queue.push({
          id: `rev-mistake-${m.id}`,
          itemType: 'mistake',
          title: `Mistake: ${m.category.toUpperCase()}`,
          subtitle: `"${m.originalInput}" → "${m.correctedInput}"`,
          priority,
          priorityScore,
          forgettingRisk,
          reason: `Seen ${m.occurrenceCount} times (${m.status}). Need practice to avoid habitual error.`,
          nextReview: m.nextReviewDate,
          estimatedSeconds: 120,
          dataRef: m,
        });
      });

    // 2. Add grammar concepts that had lower scores
    const weakGrammarActivities = activities.filter(
      (a) => a.activityType === 'grammar' && a.score < 85
    );
    if (weakGrammarActivities.length > 0) {
      queue.push({
        id: 'rev-grammar-present-perfect',
        itemType: 'grammar',
        title: 'Present Perfect vs Simple Past',
        subtitle: 'Review timeline & unfinished time expressions',
        priority: 'high',
        priorityScore: 28,
        forgettingRisk: 65,
        reason: 'Low score in recent practice. Tense confusion observed in speaking.',
        nextReview: 'Today',
        estimatedSeconds: 180,
      });
    }

    // 3. Add vocabulary flashcards due
    queue.push({
      id: 'rev-vocab-collocations',
      itemType: 'vocab',
      title: 'Workplace Collocations (5 words)',
      subtitle: 'discuss the issue, reach an agreement, meet deadlines',
      priority: 'medium',
      priorityScore: 16,
      forgettingRisk: 45,
      reason: 'Scheduled spaced repetition review (Day 3 interval).',
      nextReview: 'Today',
      estimatedSeconds: 150,
    });

    // Sort by priorityScore descending
    return queue.sort((a, b) => b.priorityScore - a.priorityScore);
  }, [mistakes, activities]);

  const logActivity = (activity: Omit<ActivityHistoryItem, 'id' | 'createdAt'>) => {
    const id = `act-${Date.now()}`;
    const newAct: ActivityHistoryItem = {
      ...activity,
      id,
      createdAt: new Date().toISOString(),
    };
    setActivities((prev) => [newAct, ...prev]);

    // Check achievement triggers
    setAchievements((prev) =>
      prev.map((ach) => {
        if (ach.id === 'ach-first-convo' && activity.activityType === 'talk') {
          return { ...ach, isUnlocked: true, unlockedAt: 'Just now' };
        }
        if (ach.id === 'ach-first-roleplay' && activity.activityType === 'roleplay') {
          return { ...ach, isUnlocked: true, unlockedAt: 'Just now' };
        }
        return ach;
      })
    );

    return id;
  };

  const deleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
  };

  const deleteRecording = (id: string) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, hasRecording: false, audioBlobUrl: undefined } : a))
    );
  };

  const logMistake = (
    mistakeData: Omit<UnifiedMistake, 'id' | 'firstSeen' | 'lastSeen' | 'occurrenceCount' | 'correctedCount' | 'masteryScore' | 'status' | 'evolutionHistory'>
  ) => {
    const existingIndex = mistakes.findIndex(
      (m) =>
        m.category.toLowerCase() === mistakeData.category.toLowerCase() &&
        (m.originalInput.toLowerCase() === mistakeData.originalInput.toLowerCase() ||
          m.correctedInput.toLowerCase() === mistakeData.correctedInput.toLowerCase())
    );

    if (existingIndex >= 0) {
      setMistakes((prev) => {
        const copy = [...prev];
        const item = copy[existingIndex];
        const newOccurrences = item.occurrenceCount + 1;
        const newStatus =
          item.status === 'resolved'
            ? 'repeated'
            : newOccurrences > 4
            ? 'repeated'
            : 'learning';

        copy[existingIndex] = {
          ...item,
          occurrenceCount: newOccurrences,
          lastSeen: 'Just now',
          status: newStatus,
          evolutionHistory: [
            ...item.evolutionHistory,
            {
              date: 'Today',
              input: mistakeData.originalInput,
              note: `Repeated in ${mistakeData.sourceType}`,
            },
          ],
        };
        return copy;
      });
    } else {
      const newMistake: UnifiedMistake = {
        ...mistakeData,
        id: `m-${Date.now()}`,
        firstSeen: 'Just now',
        lastSeen: 'Just now',
        occurrenceCount: 1,
        correctedCount: 0,
        masteryScore: 35,
        status: 'new',
        evolutionHistory: [
          {
            date: 'Today',
            input: mistakeData.originalInput,
            note: `First detected in ${mistakeData.sourceType}`,
          },
        ],
      };
      setMistakes((prev) => [newMistake, ...prev]);
    }
  };

  const resolveMistake = (id: string, success: boolean) => {
    setMistakes((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const newScore = success ? Math.min(100, m.masteryScore + 20) : Math.max(0, m.masteryScore - 15);
        let status = m.status;
        if (newScore >= 90) status = 'mastered';
        else if (newScore >= 75) status = 'resolved';
        else if (newScore >= 60) status = 'strong';
        else if (success) status = 'improving';
        else status = 'repeated';

        return {
          ...m,
          correctedCount: success ? m.correctedCount + 1 : m.correctedCount,
          masteryScore: newScore,
          status,
          lastSeen: 'Just now',
          evolutionHistory: success
            ? [
                ...m.evolutionHistory,
                {
                  date: 'Today',
                  input: m.correctedInput,
                  note: 'Corrected in focused practice session',
                },
              ]
            : m.evolutionHistory,
        };
      })
    );
  };

  const runRevisionItem = (itemId: string, success: boolean) => {
    // If it's a mistake item, resolve it
    if (itemId.startsWith('rev-mistake-')) {
      const mistakeId = itemId.replace('rev-mistake-', '');
      resolveMistake(mistakeId, success);
    }
  };

  const exportUserData = () => {
    const data = {
      exportDate: new Date().toISOString(),
      user: {
        activeGoal: activeGoal.title,
      },
      activities,
      mistakes,
      achievements,
      comparison: comparisonData,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `learntalk_data_export_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearAllHistory = () => {
    setActivities([]);
    localStorage.removeItem('learntalk_history_activities');
  };

  const getAiCoachSummary = () => {
    const totalSpeakingSecs = activities
      .filter((a) => a.hasRecording || a.activityType === 'speaking' || a.activityType === 'talk')
      .reduce((sum, a) => sum + a.durationSeconds, 0);

    const recurringTenseMistakes = mistakes.filter((m) => m.category === 'tense' && m.status !== 'mastered').length;

    return `You have practiced ${Math.round(totalSpeakingSecs / 60)} minutes of active spoken English this week. Your sentence structure has noticeably improved in structured drills, but you still tend to hesitate or drop the past tense when answering unexpected workplace questions. Next, try a 3-minute spontaneous workplace conversation with Alex to lock in past tense fluency.`;
  };

  return (
    <HistoryContext.Provider
      value={{
        activities,
        mistakes,
        achievements,
        goals: SAMPLE_GOALS,
        activeGoalId,
        activeGoal,
        comparisonData,
        insights,
        revisionQueue,
        logActivity,
        deleteActivity,
        deleteRecording,
        logMistake,
        resolveMistake,
        runRevisionItem,
        setActiveGoalId,
        exportUserData,
        clearAllHistory,
        getAiCoachSummary,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};
