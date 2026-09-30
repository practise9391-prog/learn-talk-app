import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  TestDefinition,
  TestAttempt,
  WeakArea,
  RecommendedTest,
  ComparisonResult,
  TestScoreMetrics
} from '../types/test';
import { ALL_TEST_DEFINITIONS, INITIAL_TEST_ATTEMPTS, INITIAL_WEAK_AREAS } from '../data/testQuestions';
import { useUser } from './UserContext';
import { CEFRLevel } from '../types';

interface TestContextType {
  allTests: TestDefinition[];
  attempts: TestAttempt[];
  weakAreas: WeakArea[];
  dailyChallengeTest: TestDefinition;
  isDailyChallengeCompleted: boolean;
  completeDailyChallenge: () => void;
  recordTestAttempt: (attempt: Omit<TestAttempt, 'id' | 'timestamp' | 'dateIso'>) => TestAttempt;
  getTestById: (id: string) => TestDefinition | undefined;
  getRecommendations: () => RecommendedTest[];
  getComparison: (testId: string) => ComparisonResult | null;
  getRecentAttemptForTest: (testId: string) => TestAttempt | undefined;
  resolveWeakArea: (weakAreaId: string) => void;
  clearAllAttempts: () => void;
}

const TestContext = createContext<TestContextType | undefined>(undefined);

export const TestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateUser, saveNewRecording, resolveMistake, mistakes } = useUser();

  // Load test attempts from localStorage
  const [attempts, setAttempts] = useState<TestAttempt[]>(() => {
    const saved = localStorage.getItem('learntalk_test_attempts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_TEST_ATTEMPTS;
  });

  // Weak areas state
  const [weakAreas, setWeakAreas] = useState<WeakArea[]>(() => {
    const saved = localStorage.getItem('learntalk_weak_areas');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_WEAK_AREAS;
  });

  // Daily challenge state
  const [dailyCompletedDate, setDailyCompletedDate] = useState<string>(() => {
    return localStorage.getItem('learntalk_daily_challenge_date') || '';
  });

  const todayIso = new Date().toISOString().split('T')[0];
  const isDailyChallengeCompleted = dailyCompletedDate === todayIso;

  // Daily rotated challenge
  const dailyChallengeTest = useMemo(() => {
    const dayOfWeek = new Date().getDay();
    const rotatedTests = [
      'test-jam',
      'test-no-fillers',
      'test-pros-cons-debate',
      'test-three-word-story',
      'test-random-object-pitch',
      'test-picture-description',
      'test-word-association'
    ];
    const targetId = rotatedTests[dayOfWeek % rotatedTests.length];
    return ALL_TEST_DEFINITIONS.find((t) => t.id === targetId) || ALL_TEST_DEFINITIONS[0];
  }, []);

  useEffect(() => {
    localStorage.setItem('learntalk_test_attempts', JSON.stringify(attempts));
  }, [attempts]);

  useEffect(() => {
    localStorage.setItem('learntalk_weak_areas', JSON.stringify(weakAreas));
  }, [weakAreas]);

  const completeDailyChallenge = () => {
    setDailyCompletedDate(todayIso);
    localStorage.setItem('learntalk_daily_challenge_date', todayIso);
    updateUser({ xp: user.xp + 100 });
  };

  const getTestById = (id: string): TestDefinition | undefined => {
    return ALL_TEST_DEFINITIONS.find((t) => t.id === id);
  };

  const getRecentAttemptForTest = (testId: string): TestAttempt | undefined => {
    return attempts.find((a) => a.testId === testId);
  };

  const recordTestAttempt = (
    newAttemptData: Omit<TestAttempt, 'id' | 'timestamp' | 'dateIso'>
  ): TestAttempt => {
    const previousAttempt = attempts.find((a) => a.testId === newAttemptData.testId);

    const newAttempt: TestAttempt = {
      ...newAttemptData,
      id: `att-${Date.now()}`,
      timestamp: 'Just now',
      dateIso: new Date().toISOString(),
      isRetake: Boolean(previousAttempt),
      previousAttemptId: previousAttempt?.id
    };

    setAttempts((prev) => [newAttempt, ...prev]);

    // Integrate with User Recordings & History
    saveNewRecording({
      sessionId: `test-session-${newAttempt.id}`,
      title: `🎙 ${newAttempt.testTitle}`,
      scenarioName: 'Assessment & Test',
      durationSeconds: newAttempt.durationSeconds || 60,
      hasAudio: true,
      transcriptText: newAttempt.transcript || 'Spoken response submitted for evaluation.',
      correctionsCount: newAttempt.errorBreakdown.reduce((acc, curr) => acc + curr.count, 0),
      savedLocally: true
    });

    // Award XP
    updateUser({
      xp: user.xp + 75
    });

    // If placement test, calibrate level
    if (newAttempt.isPlacement || newAttempt.testType === 'placement') {
      const overall = newAttempt.scores.overallCommunication;
      let recommendedLevel: CEFRLevel = 'A2';
      if (overall >= 85) recommendedLevel = 'B2';
      else if (overall >= 70) recommendedLevel = 'B1';
      else if (overall >= 55) recommendedLevel = 'A2';
      else recommendedLevel = 'A1';

      updateUser({ currentLevel: recommendedLevel });
    }

    // Mark daily challenge if applicable
    if (newAttempt.testId === dailyChallengeTest.id) {
      completeDailyChallenge();
    }

    return newAttempt;
  };

  const getComparison = (testId: string): ComparisonResult | null => {
    const testAttempts = attempts.filter((a) => a.testId === testId);
    if (testAttempts.length < 2) return null;

    const current = testAttempts[0];
    const previous = testAttempts[1];

    const deltas: Partial<Record<keyof TestScoreMetrics, number>> = {};
    const keys: (keyof TestScoreMetrics)[] = [
      'overallCommunication',
      'speaking',
      'grammar',
      'vocabulary',
      'pronunciation',
      'fluency',
      'listening',
      'clarity'
    ];

    keys.forEach((k) => {
      deltas[k] = current.scores[k] - previous.scores[k];
    });

    const improvedItems: string[] = [];
    const stillPracticingItems: string[] = [];

    if ((deltas.grammar || 0) > 0) improvedItems.push('Grammar accuracy & tense consistency');
    else stillPracticingItems.push('Grammar: tense consistency under pressure');

    if ((deltas.fluency || 0) > 0) improvedItems.push('Speech continuity and pause distribution');
    else stillPracticingItems.push('Fluency: reducing hesitation pauses');

    if ((deltas.vocabulary || 0) > 0) improvedItems.push('Lexical range and descriptive adjectives');
    else stillPracticingItems.push('Vocabulary: using varied collocations');

    return {
      previousAttempt: {
        date: previous.timestamp,
        scores: previous.scores
      },
      currentAttempt: {
        date: current.timestamp,
        scores: current.scores
      },
      scoreDeltas: deltas,
      improvedItems: improvedItems.length > 0 ? improvedItems : ['Maintained consistent effort across sessions'],
      stillPracticingItems:
        stillPracticingItems.length > 0 ? stillPracticingItems : ['Continue active speaking turn drills']
    };
  };

  const getRecommendations = (): RecommendedTest[] => {
    const recs: RecommendedTest[] = [];

    // Check pronunciation recency
    const hasRecentPron = attempts.some(
      (a) =>
        (a.testType === 'pronunciation' || a.testType === 'shadowing') &&
        Date.now() - new Date(a.dateIso).getTime() < 3 * 86400000
    );
    if (!hasRecentPron) {
      recs.push({
        id: 'rec-pron',
        testId: 'test-shadowing',
        title: 'Shadowing & Pronunciation Test',
        reason: "You haven't practiced pronunciation or acoustic shadowing recently.",
        skill: 'pronunciation',
        estimatedMinutes: 3,
        urgency: 'high'
      });
    }

    // Check fluency
    const recentFluency = attempts.find((a) => a.scores.fluency < 76);
    if (recentFluency) {
      recs.push({
        id: 'rec-fluency',
        testId: 'test-jam',
        title: 'JAM — Just A Minute',
        reason: 'Your speaking is improving, but fluency remains an active practice area.',
        skill: 'fluency',
        estimatedMinutes: 1,
        urgency: 'medium'
      });
    }

    // Check debate or argumentation
    recs.push({
      id: 'rec-debate',
      testId: 'test-pros-cons-debate',
      title: 'Pros & Cons Debate',
      reason: 'Strengthen transition phrases and persuasive communication structure.',
      skill: 'conversation',
      estimatedMinutes: 2,
      urgency: 'normal'
    });

    return recs;
  };

  const resolveWeakArea = (weakAreaId: string) => {
    setWeakAreas((prev) => prev.filter((w) => w.id !== weakAreaId));
  };

  const clearAllAttempts = () => {
    setAttempts([]);
    localStorage.removeItem('learntalk_test_attempts');
  };

  return (
    <TestContext.Provider
      value={{
        allTests: ALL_TEST_DEFINITIONS,
        attempts,
        weakAreas,
        dailyChallengeTest,
        isDailyChallengeCompleted,
        completeDailyChallenge,
        recordTestAttempt,
        getTestById,
        getRecommendations,
        getComparison,
        getRecentAttemptForTest,
        resolveWeakArea,
        clearAllAttempts
      }}
    >
      {children}
    </TestContext.Provider>
  );
};

export const useTest = () => {
  const context = useContext(TestContext);
  if (!context) throw new Error('useTest must be used within TestProvider');
  return context;
};
