// LearnTalk - Part 12: Advanced Speaking Intelligence, Pronunciation, Fluency & Natural Conversation Types

export type ConversationMode =
  | 'free'
  | 'guided'
  | 'learning'
  | 'roleplay'
  | 'interview'
  | 'professional'
  | 'travel'
  | 'daily';

export type CorrectionStyle = 'gentle' | 'balanced' | 'detailed';

export type CorrectionTier =
  | 'incorrect'
  | 'understandable'
  | 'acceptable'
  | 'natural'
  | 'more_natural'
  | 'professional';

export type NativeLanguageSupport = 'telugu' | 'hindi' | 'tamil' | 'kannada' | 'spanish' | 'none';

export interface ConversationObjective {
  id: string;
  title: string;
  description: string;
  milestones: {
    id: string;
    description: string;
    completed: boolean;
    requiredIntent?: string;
  }[];
  isCompleted: boolean;
}

export interface SessionEntityMemory {
  userName?: string;
  city?: string;
  profession?: string;
  company?: string;
  familyMentioned?: string[];
  projectMentioned?: string;
  hobbies?: string[];
  statedGoals?: string[];
  pastEvents?: string[];
  customEntities: Record<string, string>;
}

export interface FluencyMetrics {
  continuityScore: number; // 0-100
  thinkingPausesCount: number; // Normal pauses (< 2.5s)
  disruptivePausesCount: number; // Prolonged hesitation (> 3.5s)
  speakingRateWpm: number;
  totalWords: number;
  userSpeakingRatioPercent: number; // User words vs Total session words
  fillerOccurrences: {
    word: string;
    count: number;
    isNaturalDiscourse: boolean;
    feedbackTip?: string;
  }[];
  repetitionsDetected: {
    phrase: string;
    count: number;
    advice: string;
  }[];
  selfCorrections: {
    rawUtterance: string;
    correctedVersion: string;
    isSuccessful: boolean;
    praiseMessage: string;
  }[];
  responseDepth: 'one_word' | 'short' | 'complete' | 'explained' | 'rich';
  questionsAskedCount: number;
}

export interface PronunciationInsight {
  word: string;
  ipa: string;
  syllables: string[];
  stressedIndex: number;
  commonMispronunciation: string;
  intelligibilityRating: 'clear' | 'minor_uncertainty' | 'needs_practice';
  audioClue: string;
  explanation: string;
}

export interface MinimalPairItem {
  id: string;
  soundA: string;
  soundB: string;
  wordA: string;
  ipaA: string;
  exampleA: string;
  wordB: string;
  ipaB: string;
  exampleB: string;
  distinctionTip: string;
}

export interface SentenceStressPattern {
  id: string;
  baseSentence: string;
  variations: {
    stressedWord: string;
    conveyedMeaning: string;
    contextExample: string;
  }[];
}

export interface ConnectedSpeechItem {
  id: string;
  writtenForm: string;
  spokenForm: string;
  ipa: string;
  ruleExplanation: string;
  exampleSentence: string;
}

export interface SpeakingStructureGuide {
  id: 'opinion' | 'story' | 'star' | 'explanation';
  title: string;
  description: string;
  steps: {
    name: string;
    cuePrompt: string;
    examplePhrasing: string;
  }[];
}

export interface SpontaneousPromptItem {
  id: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  prompt: string;
  recommendedStructureId: 'opinion' | 'story' | 'star' | 'explanation';
  starterHint: string;
  thinkingCues: string[];
}

export interface RapidFirePromptItem {
  id: string;
  category: string;
  question: string;
  idealLengthWords: number;
  quickSample: string;
}

export interface PictureSpeakingSceneItem {
  id: string;
  title: string;
  category: string;
  scenePrompt: string;
  visualTheme: string;
  svgIconName: string;
  tasks: {
    step: 1 | 2 | 3 | 4;
    title: string;
    instruction: string;
    scaffoldingPhrases: string[];
  }[];
  modelNarratives: {
    beginner: string;
    intermediate: string;
    advanced: string;
  };
}

export interface NativeThinkingBridgeItem {
  id: string;
  sourceLang: 'telugu' | 'hindi' | 'tamil' | 'kannada';
  nativePhrase: string;
  nativeScript: string;
  literalEnglishDraft: string;
  simpleEnglish: string;
  naturalEnglish: string;
  professionalEnglish: string;
  structuralExplanation: string;
}

export interface WhyThisWordComparison {
  id: string;
  learnerWord: string;
  recommendedWord: string;
  contextUsage: string;
  formalityDifference: string;
  commonCollocations: string[];
  learnerSentence: string;
  betterSentence: string;
  ruleExplanation: string;
}

export interface ClarificationPhrase {
  id: string;
  category: 'clarification' | 'recovery' | 'brain_freeze' | 'transition';
  phrase: string;
  contextSituation: string;
  politenessTier: 'casual' | 'natural' | 'professional';
}

export interface ProgressiveAssistanceTier {
  tier: 1 | 2 | 3 | 4 | 5;
  label: string;
  content: string;
}
