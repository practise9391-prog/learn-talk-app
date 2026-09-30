import React, { createContext, useContext, useState } from 'react';
import {
  DailyChallengeItem,
  PracticeDifficulty,
  PracticeEvaluationResult,
  PracticeCategory,
} from '../types/practice';
import { TODAY_DAILY_CHALLENGE, ROTATING_DAILY_CHALLENGES } from '../data/practiceData';
import { useHistory } from './HistoryContext';
import { useUser } from './UserContext';

interface PracticeContextType {
  dailyChallenge: DailyChallengeItem;
  completedChallengesCount: number;
  completeDailyChallenge: (result: PracticeEvaluationResult) => void;
  evaluateSpeechResponse: (
    spokenText: string,
    durationSeconds: number,
    topic: string,
    targetVocab?: string[],
    targetGrammar?: string
  ) => PracticeEvaluationResult;
}

const PracticeContext = createContext<PracticeContextType | undefined>(undefined);

export const PracticeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logActivity, logMistake } = useHistory();
  const { updateUser, addSpokenMinutes } = useUser();

  const [dailyChallenge, setDailyChallenge] = useState<DailyChallengeItem>(() => {
    const saved = localStorage.getItem('learntalk_daily_challenge');
    return saved ? JSON.parse(saved) : TODAY_DAILY_CHALLENGE;
  });

  const [completedChallengesCount, setCompletedChallengesCount] = useState<number>(() => {
    const saved = localStorage.getItem('learntalk_completed_challenges_count');
    return saved ? parseInt(saved, 10) : 4;
  });

  const evaluateSpeechResponse = (
    spokenText: string,
    durationSeconds: number,
    topic: string,
    targetVocab: string[] = [],
    targetGrammar?: string
  ): PracticeEvaluationResult => {
    const lower = spokenText.toLowerCase();
    const words = spokenText.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // Detect filler words
    const fillerMatches = lower.match(/\b(um|uh|like|basically|actually|you know|i mean)\b/g) || [];
    const fillerWordsCount = fillerMatches.length;

    // Speech rate (words per minute)
    const effectiveMins = Math.max(0.2, durationSeconds / 60);
    const speechRateWpm = Math.round(wordCount / effectiveMins);

    // Check vocabulary usage
    const vocabularyUsed = targetVocab.filter((v) => lower.includes(v.toLowerCase()));

    // Check common mistakes
    const mistakesCaught: PracticeEvaluationResult['mistakesCaught'] = [];

    if (lower.includes('discuss about')) {
      mistakesCaught.push({
        original: 'discuss about',
        correction: 'discuss',
        explanation: "'Discuss' directly takes an object. 'About' is redundant.",
        category: 'Preposition Redundancy',
      });
      logMistake({
        userId: 'user-001',
        sourceType: 'challenge',
        sourceTitle: topic,
        skill: 'naturalness',
        category: 'preposition',
        originalInput: 'I want to discuss about the project.',
        correctedInput: 'I want to discuss the project.',
        explanation: "'Discuss' is a transitive verb that directly takes an object.",
        severity: 'moderate',
        nextReviewDate: new Date(Date.now() + 86400000).toISOString(),
      });
    }

    if (lower.includes('i am knowing') || lower.includes('am knowing')) {
      mistakesCaught.push({
        original: 'am knowing',
        correction: 'know',
        explanation: "'Know' is a stative verb and is not used in continuous -ing tenses.",
        category: 'Stative Verbs',
      });
      logMistake({
        userId: 'user-001',
        sourceType: 'challenge',
        sourceTitle: topic,
        skill: 'grammar',
        category: 'tense',
        originalInput: 'I am knowing the answer.',
        correctedInput: 'I know the answer.',
        explanation: 'Stative verbs expressing mental states cannot take continuous tense.',
        severity: 'important',
        nextReviewDate: new Date(Date.now() + 86400000).toISOString(),
      });
    }

    if (lower.includes('yesterday i go') || lower.includes('yesterday i meet')) {
      mistakesCaught.push({
        original: 'yesterday I go / meet',
        correction: 'yesterday I went / met',
        explanation: "Finished past time words like 'yesterday' require Simple Past tense forms.",
        category: 'Past Tense Consistency',
      });
      logMistake({
        userId: 'user-001',
        sourceType: 'challenge',
        sourceTitle: topic,
        skill: 'grammar',
        category: 'tense',
        originalInput: 'Yesterday I go there.',
        correctedInput: 'Yesterday I went there.',
        explanation: "Use past tense 'went' when referring to finished past times.",
        severity: 'important',
        nextReviewDate: new Date(Date.now() + 86400000).toISOString(),
      });
    }

    // Naturalness classification
    let naturalnessClassification: PracticeEvaluationResult['naturalnessClassification'] = 'natural';
    let baseScore = 75;

    if (mistakesCaught.length > 1) {
      naturalnessClassification = 'acceptable';
      baseScore = 65;
    } else if (mistakesCaught.length === 1) {
      naturalnessClassification = 'acceptable';
      baseScore = 72;
    } else if (vocabularyUsed.length >= 2 && speechRateWpm >= 110) {
      naturalnessClassification = 'professional';
      baseScore = 92;
    } else if (wordCount >= 20 && fillerWordsCount <= 2) {
      naturalnessClassification = 'more_natural';
      baseScore = 85;
    }

    // Award XP
    const xpEarned = Math.round(baseScore / 2);
    updateUser({ xp: xpEarned });
    addSpokenMinutes(Math.max(1, Math.round(durationSeconds / 60)));

    // Useful alternative sentences
    const usefulAlternativeSentences = [
      'In my experience, maintaining a consistent daily routine makes a significant difference.',
      'From a professional standpoint, addressing project bottlenecks early prevents team friction.',
      'Whenever unexpected challenges arise, I prioritize open communication with my colleagues.',
    ];

    // Log to History
    logActivity({
      userId: 'user-001',
      activityType: 'speaking',
      title: `Practice Arena: ${topic}`,
      subtitle: `${durationSeconds}s Spoken Practice (${naturalnessClassification})`,
      timestamp: 'Just now',
      durationSeconds,
      skill: 'speaking',
      score: baseScore,
      topic,
      difficulty: 'B1',
      hasRecording: false,
      hasTranscript: true,
      hasFeedback: true,
      saved: true,
      correctionsCount: mistakesCaught.length,
      metrics: {
        grammar: Math.max(60, 95 - mistakesCaught.length * 15),
        vocabulary: Math.min(100, 70 + vocabularyUsed.length * 10),
        fluency: Math.max(50, Math.min(95, Math.round(speechRateWpm * 0.7))),
        wordsSpoken: wordCount,
        fillerWordCount: fillerWordsCount,
        speechRateWpm,
      },
      transcriptSegments: [
        {
          id: `pt-${Date.now()}`,
          timestamp: '00:00',
          timestampSeconds: 0,
          speaker: 'user',
          text: spokenText,
        },
      ],
      sessionSummary: {
        whatYouDidWell: [
          'Maintained speech continuity across the duration.',
          'Addressed the central core prompt directly.',
          vocabularyUsed.length > 0
            ? `Successfully integrated target vocabulary: ${vocabularyUsed.join(', ')}.`
            : 'Clear vocal projection.',
        ],
        whatToImprove:
          mistakesCaught.length > 0
            ? mistakesCaught.map((m) => `${m.category}: ${m.explanation}`)
            : ['Continue eliminating minor hesitation pauses before complex sentences.'],
        newWords: vocabularyUsed.map((v) => ({ word: v, meaning: 'Target vocabulary practiced in drill' })),
        recommendedPractice: [
          { title: 'Spontaneous Speaking Challenges', route: '/practice', type: 'Speaking' },
          { title: 'Review Active Mistakes', route: '/mistakes', type: 'Mistakes' },
        ],
      },
    });

    return {
      transcript: spokenText,
      naturalnessClassification,
      score: baseScore,
      vocabularyUsed,
      fillerWordsCount,
      speechRateWpm,
      usefulAlternativeSentences,
      mistakesCaught,
      xpEarned,
    };
  };

  const completeDailyChallenge = (result: PracticeEvaluationResult) => {
    const updated = { ...dailyChallenge, completed: true };
    setDailyChallenge(updated);
    setCompletedChallengesCount((prev) => {
      const next = prev + 1;
      localStorage.setItem('learntalk_completed_challenges_count', next.toString());
      return next;
    });
    localStorage.setItem('learntalk_daily_challenge', JSON.stringify(updated));
  };

  return (
    <PracticeContext.Provider
      value={{
        dailyChallenge,
        completedChallengesCount,
        completeDailyChallenge,
        evaluateSpeechResponse,
      }}
    >
      {children}
    </PracticeContext.Provider>
  );
};

export const usePractice = () => {
  const context = useContext(PracticeContext);
  if (!context) {
    throw new Error('usePractice must be used within a PracticeProvider');
  }
  return context;
};
