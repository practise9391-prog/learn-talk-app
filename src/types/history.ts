// Part 7: History, Progress, Analytics, Mistake Tracking & Personalized Revision Types
import { CEFRLevel, ErrorCategory } from './index';

export type ActivityType =
  | 'speaking'
  | 'talk'
  | 'roleplay'
  | 'test'
  | 'lesson'
  | 'grammar'
  | 'vocab'
  | 'idiom'
  | 'phrasal_verb'
  | 'challenge'
  | 'peer'
  | 'group'
  | 'listening'
  | 'reading'
  | 'writing';

export type SkillType =
  | 'speaking'
  | 'grammar'
  | 'vocabulary'
  | 'pronunciation'
  | 'listening'
  | 'reading'
  | 'writing'
  | 'fluency'
  | 'naturalness';

export type MistakeSeverity = 'minor' | 'moderate' | 'important' | 'critical';

export type MistakeStatus =
  | 'new'
  | 'learning'
  | 'improving'
  | 'repeated'
  | 'strong'
  | 'resolved'
  | 'mastered';

export type RevisionPriority = 'high' | 'medium' | 'low'; // Review Now / Review Soon / Looking Strong

export interface TranscriptTurn {
  id: string;
  timestamp: string; // e.g., '00:12'
  timestampSeconds: number;
  speaker: 'user' | 'ai';
  text: string;
  correctedText?: string;
  feedback?: {
    type: SkillType;
    title: string;
    explanation: string;
    betterAlternative: string;
  };
}

export interface TimestampedFeedbackItem {
  id: string;
  timestamp: string; // e.g., '00:18'
  timestampSeconds: number;
  type: 'grammar' | 'vocabulary' | 'filler' | 'pronunciation' | 'naturalness';
  title: string;
  originalSnippet: string;
  improvedSnippet: string;
  explanation: string;
}

export interface SessionSummaryData {
  whatYouDidWell: string[];
  whatToImprove: string[];
  newWords: { word: string; meaning: string }[];
  recommendedPractice: { title: string; route: string; type: string }[];
}

export interface ActivityHistoryItem {
  id: string;
  userId: string;
  activityType: ActivityType;
  title: string;
  subtitle: string;
  timestamp: string; // Display string, e.g., 'Today at 09:20 AM'
  createdAt: string; // ISO 8601 string for sorting/filtering
  durationSeconds: number;
  skill: SkillType;
  score: number; // 0-100
  metrics?: {
    grammar?: number;
    vocabulary?: number;
    fluency?: number;
    pronunciation?: number;
    clarity?: number;
    wordsSpoken?: number;
    fillerWordCount?: number;
    fillerRatio?: number;
    pauseCount?: number;
    speechRateWpm?: number;
  };
  topic?: string;
  scenarioId?: string;
  scenarioName?: string;
  personaName?: string;
  difficulty?: CEFRLevel;
  speakingMode?: 'voice' | 'text' | 'interactive';
  hasRecording: boolean;
  audioBlobUrl?: string;
  hasTranscript: boolean;
  hasFeedback: boolean;
  saved: boolean;
  correctionsCount: number;
  transcriptSegments?: TranscriptTurn[];
  timestampedFeedback?: TimestampedFeedbackItem[];
  sessionSummary?: SessionSummaryData;
}

export interface MistakeEvolutionEntry {
  date: string;
  input: string;
  note: string;
}

export interface MistakePracticeQuestion {
  id: string;
  type: 'mcq' | 'fill' | 'rearrange' | 'speak';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  contextScenario?: string;
}

export interface UnifiedMistake {
  id: string;
  userId: string;
  sourceType: ActivityType;
  sourceId?: string;
  sourceTitle?: string;
  skill: SkillType;
  category: string; // e.g. "tense", "article", "preposition", "collocation"
  originalInput: string;
  correctedInput: string;
  explanation: string;
  severity: MistakeSeverity;
  firstSeen: string;
  lastSeen: string;
  occurrenceCount: number;
  correctedCount: number;
  masteryScore: number; // 0-100
  status: MistakeStatus;
  evolutionHistory: MistakeEvolutionEntry[];
  relatedGrammarId?: string;
  relatedVocabId?: string;
  relatedLessonId?: string;
  nextReviewDate: string;
  contextPrompt?: string; // Real-world context retry
  practiceQuestions?: MistakePracticeQuestion[];
}

export interface RevisionItem {
  id: string;
  itemType: 'mistake' | 'vocab' | 'grammar' | 'phrasal' | 'idiom';
  title: string;
  subtitle: string;
  priority: RevisionPriority;
  priorityScore: number; // weakness * frequency * forgetting risk * relevance
  forgettingRisk: number; // 0 - 100%
  reason: string;
  nextReview: string;
  estimatedSeconds: number;
  dataRef?: any;
}

export interface LearnerInsight {
  id: string;
  category: 'speaking_habit' | 'vocabulary' | 'grammar_trend' | 'contextual';
  title: string;
  description: string;
  evidence: string;
  recommendedAction: string;
  actionRoute: string;
  date: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isUnlocked: boolean;
  progress: number;
  maxProgress: number;
  category: 'milestone' | 'speaking' | 'consistency' | 'mastery';
}

export interface SpeakingComparisonData {
  firstSession: {
    date: string;
    title: string;
    fluency: number;
    grammar: number;
    vocabulary: number;
    pronunciation: number;
    wpm: number;
    fillerCount: number;
    sampleSentence: string;
  };
  latestSession: {
    date: string;
    title: string;
    fluency: number;
    grammar: number;
    vocabulary: number;
    pronunciation: number;
    wpm: number;
    fillerCount: number;
    sampleSentence: string;
  };
  improvements: string[];
}

export interface GoalDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  prioritizedTopics: string[];
  targetMilestones: {
    roleplays: number;
    speakingTests: number;
    vocabReviews: number;
    completedRoleplays: number;
    completedSpeakingTests: number;
    completedVocabReviews: number;
  };
}
