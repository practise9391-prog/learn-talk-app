// LearnTalk - Part 3 AI Talk & Jarvis Conversational Partner Types

export type ConversationDifficulty = 'easy' | 'normal' | 'challenging' | 'advanced';

export type ErrorClassification =
  | 'Grammar'
  | 'Wrong Word'
  | 'Pronunciation'
  | 'Tense'
  | 'Article'
  | 'Preposition'
  | 'Word Order'
  | 'Plural/Singular'
  | 'Subject-Verb Agreement'
  | 'Unnatural Phrase'
  | 'Vocabulary'
  | 'Fluency'
  | 'Filler Word'
  | 'Pause'
  | 'Sentence Structure';

export type PhraseCategory =
  | 'Work'
  | 'Interview'
  | 'Travel'
  | 'Daily Life'
  | 'Social'
  | 'Grammar'
  | 'Personal';

export interface SavedPhrase {
  id: string;
  phrase: string;
  category: PhraseCategory;
  naturalAlternative: string;
  contextUsage: string;
  whyThisWord?: string;
  savedAt: string;
}

export interface ConversationTopic {
  id: string;
  title: string;
  category: 'daily' | 'work' | 'interests' | 'career' | 'spontaneous';
  icon: string;
  description: string;
  initialPrompt: string;
  followUpProgression: string[];
  brainFreezeIdeas: string[];
  contextLockRules: string;
}

export interface CorrectionDetail {
  id: string;
  originalText: string;
  simpleEnglish: string;
  naturalEnglish: string;
  professionalEnglish: string;
  whyExplanation: string;
  errorCategory: ErrorClassification;
  whyThisWord?: {
    recommendedWord: string;
    explanation: string;
    similarWords: string[];
    difference: string;
  };
  pronunciationTip?: {
    word: string;
    phoneticFocus: string;
    accuracyPercent?: number;
  };
}

export interface ConversationTurn {
  id: string;
  sender: 'jarvis' | 'user';
  text: string;
  timestamp: string;
  durationSeconds?: number;
  correction?: CorrectionDetail;
  suggestedFollowUps?: string[];
  wasInterrupted?: boolean;
}

export interface SessionAnalytics {
  sessionId: string;
  topicTitle: string;
  personaName: string;
  difficulty: ConversationDifficulty;
  totalDurationSeconds: number;
  speakingDurationSeconds: number;
  wordsSpoken: number;
  speakingRateWpm: number;
  fluencyScore: number;
  grammarScore: number;
  vocabularyScore: number;
  pronunciationScore: number;
  clarityScore: number;
  fillerWordCounts: {
    um: number;
    like: number;
    basically: number;
    actually: number;
    youKnow: number;
  };
  commonMistakes: {
    category: ErrorClassification;
    count: number;
    examples: string[];
  }[];
  whatYouDidWell: string[];
  whatToImprove: string[];
  specificJarvisFeedback: string;
  recommendedPractice: {
    title: string;
    route: string;
    reason: string;
  };
}
