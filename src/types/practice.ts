import { CEFRLevel, SkillProgress } from './index';
import { SkillType } from './history';

export type PracticeCategory =
  | 'speaking_arena'
  | 'daily_challenge'
  | 'quick_60s'
  | 'jam'
  | 'word_association'
  | 'three_word_story'
  | 'picture_description'
  | 'story_builder'
  | 'word_chain'
  | 'sentence_builder'
  | 'sentence_transformation'
  | 'error_detective'
  | 'natural_or_not'
  | 'formal_vs_casual'
  | 'translate_thought'
  | 'pronunciation_pairs'
  | 'shadowing'
  | 'listening_challenge'
  | 'rapid_response'
  | 'debate'
  | 'pros_cons'
  | 'workplace_drills'
  | 'travel_drills'
  | 'mixed_session';

export type PracticeDifficulty = 'easy' | 'normal' | 'challenging' | 'advanced';

export type DomainContext =
  | 'daily_life'
  | 'college'
  | 'workplace'
  | 'travel'
  | 'professional'
  | 'abstract'
  | 'random';

export interface AssistanceHints {
  wordHint: string;
  sentenceStarter: string;
  sentenceStructure: string;
  exampleResponse: string;
}

export interface BrainFreezeSupport {
  suggestedWords: string[];
  suggestedStarters: string[];
  easierAlternativeQuestion: string;
  thoughtTranslations: {
    telugu?: string;
    hindi?: string;
    naturalEnglish: string;
  };
}

export interface DailyChallengeItem {
  id: string;
  date: string;
  title: string;
  category: PracticeCategory;
  topic: string;
  prompt: string;
  targetDurationSeconds: number;
  targetVocabulary: string[];
  targetGrammar: string;
  difficulty: PracticeDifficulty;
  xpReward: number;
  completed: boolean;
}

export interface PracticeEvaluationResult {
  transcript: string;
  naturalnessClassification: 'incorrect' | 'acceptable' | 'natural' | 'more_natural' | 'professional';
  score: number; // 0-100
  grammarFeedback?: string;
  vocabularyUsed: string[];
  fillerWordsCount: number;
  speechRateWpm: number;
  usefulAlternativeSentences: string[];
  mistakesCaught: {
    original: string;
    correction: string;
    explanation: string;
    category: string;
  }[];
  xpEarned: number;
}

export interface GenericPracticeActivity {
  id: string;
  type: PracticeCategory;
  skill: SkillType;
  difficulty: PracticeDifficulty;
  domain: DomainContext;
  title: string;
  instructions: string;
  prompt: string;
  timeLimitSeconds?: number;
  hints?: AssistanceHints;
  brainFreeze?: BrainFreezeSupport;
  interactiveData?: any;
}
