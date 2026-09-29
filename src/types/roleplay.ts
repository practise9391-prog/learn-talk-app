// LearnTalk - Part 4 Roleplay, Real-World Scenarios & Professional Speaking Practice Types

export type RoleplayCategory =
  | 'interview'
  | 'office'
  | 'daily_life'
  | 'travel'
  | 'shopping'
  | 'restaurant'
  | 'college'
  | 'customer_service'
  | 'social'
  | 'public_speaking';

export type RoleplayDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface RoleplayHint {
  wordHint: string;
  sentenceHint: string;
  fullHint: string;
}

export interface ConversationBranch {
  triggerKeywords: string[];
  nextAiPrompt: string;
}

export interface RoleplayStep {
  stepIndex: number;
  aiPrompt: string;
  expectedResponseConcept: string;
  hints: RoleplayHint;
  suggestedStarters: string[];
  branches?: ConversationBranch[];
}

export interface EvaluationRule {
  criteria: string;
  recommendation?: string;
  recommendedLessonId?: string;
  recommendedLessonTitle?: string;
}

export interface RoleplayScenario {
  id: string;
  category: RoleplayCategory;
  title: string;
  description: string;
  difficulty: RoleplayDifficulty;
  userRole: string;
  aiRole: string;
  alternativeUserRole?: string; // For dual-role scenarios like Customer vs Support Agent
  alternativeAiRole?: string;
  estimatedDurationMin: number;
  expectedSkills: string[];
  objective: string;
  context: string;
  openingMessage: string;
  vocabulary: string[];
  grammarTargets: string[];
  conversationSteps: RoleplayStep[];
  evaluationRules: EvaluationRule[];
  bestAnswerComparisons: {
    userSpokenHypothesis: string;
    naturalVersion: string;
    professionalVersion: string;
    whyExplanation: string;
  }[];
}

export interface RoleplayTurn {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  durationSeconds?: number;
  hintUsed?: 'word' | 'sentence' | 'full';
}

export interface RoleplayPerformanceScores {
  communication: { score: number; explanation: string };
  grammar: { score: number; explanation: string };
  vocabulary: { score: number; explanation: string };
  pronunciation: { score: number; explanation: string };
  fluency: { score: number; explanation: string };
  clarity: { score: number; explanation: string };
  contextHandling: { score: number; explanation: string };
}

export interface RoleplayFeedbackData {
  overallScore: number;
  outcome: 'Complete' | 'Needs more practice' | 'Retry recommended';
  scores: RoleplayPerformanceScores;
  whatYouDidWell: string[];
  areasToImprove: string[];
  recommendedCurriculumLesson?: {
    lessonId: string;
    title: string;
    level: string;
    focus: string;
  };
}

export interface RoleplayHistoryRecord {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  category: RoleplayCategory;
  difficulty: RoleplayDifficulty;
  date: string;
  score: number;
  durationMin: number;
  turnsCount: number;
  feedback: RoleplayFeedbackData;
  transcript: RoleplayTurn[];
}

// Extensible domain models for future real-person practice / peer learning (Requirement 52)
export interface PeerLearningRoom {
  id: string;
  topicTitle: string;
  targetLevel: RoleplayDifficulty;
  status: 'waiting' | 'in_progress' | 'completed';
  moderationActive: boolean;
  participantIds: string[];
}
