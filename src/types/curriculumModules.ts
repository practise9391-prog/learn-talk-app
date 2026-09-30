import { CEFRLevel, ErrorCategory } from './index';

export type GrammarCategory =
  | 'sentence_basics'
  | 'nouns_pronouns'
  | 'verbs_be'
  | 'tenses'
  | 'modals'
  | 'comparisons'
  | 'adverbs_conjunctions'
  | 'questions'
  | 'gerunds_infinitives'
  | 'conditionals'
  | 'passive_voice'
  | 'reported_speech'
  | 'relative_clauses'
  | 'advanced_structures'
  | 'prepositions'
  | 'determiners'
  | 'subject_verb_agreement'
  | 'professional';

export type MasteryState =
  | 'locked'
  | 'available'
  | 'learning'
  | 'practicing'
  | 'familiar'
  | 'strong'
  | 'mastered';

export interface GrammarExercise {
  id: string;
  type: 'mcq' | 'fill_blank' | 'rearrange' | 'error_fix' | 'transform';
  prompt: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
}

export interface GrammarTopic {
  id: string;
  title: string;
  slug: string;
  level: CEFRLevel;
  category: GrammarCategory;
  levelCategory: 'beginner' | 'tenses' | 'intermediate' | 'advanced';
  simpleExplanation: string;
  detailedExplanation: string;
  structure: string;
  formula?: string;
  timelineAnimation?: {
    past: string;
    present: string;
    future: string;
    highlight: 'past' | 'present' | 'future' | 'continuous' | 'perfect';
  };
  sentenceAnimation?: {
    subject: string;
    verb: string;
    object?: string;
    rest?: string;
  };
  examples: {
    level: 'beginner' | 'daily' | 'student' | 'office' | 'professional';
    sentence: string;
    explanation: string;
    naturalAlternative?: string;
  }[];
  whenToUse: string[];
  whenNotToUse: string[];
  commonMistakes: {
    mistake: string;
    correction: string;
    why: string;
  }[];
  practiceExercises: GrammarExercise[];
  speakingPrompt: {
    prompt: string;
    sampleAnswer: string;
    context: string;
  };
  conversationScenario: {
    characterName: string;
    characterRole: string;
    starterPrompt: string;
    targetUsage: string;
  };
  relatedTopics: string[];
  status: MasteryState;
}

export type VocabCategory =
  | 'everyday'
  | 'college'
  | 'workplace'
  | 'technology'
  | 'travel'
  | 'social'
  | 'professional';

export interface VocabularyWord {
  id: string;
  word: string;
  pronunciation: {
    ipa: string;
    audioGuide: string;
  };
  partOfSpeech: string;
  meaning: string;
  simpleMeaning: string;
  category: VocabCategory;
  level: CEFRLevel;
  formality: 'informal' | 'conversational' | 'formal' | 'professional';
  examples: {
    context: 'daily' | 'office' | 'professional' | 'college';
    sentence: string;
  }[];
  synonyms: {
    word: string;
    nuance: string;
    formality: string;
  }[];
  antonyms?: {
    word: string;
    nuance?: string;
  }[];
  wordFamily?: {
    noun?: string;
    verb?: string;
    adjective?: string;
    adverb?: string;
  };
  collocations: {
    phrase: string;
    type: 'natural' | 'possible_uncommon' | 'incorrect';
    note: string;
  }[];
  translations: {
    telugu: string;
    hindi: string;
    pronunciationTip?: string;
  };
  relatedWords: string[];
  usageGuidelines: {
    whereToUse: string;
    whoToUseWith: string;
    commonMistake: string;
    correction: string;
  };
  isBookmarked?: boolean;
  collections?: string[];
  masteryState: MasteryState;
  recallStrength: number; // 0 to 100
  reviewCount: number;
  lastReviewedDate?: string;
  nextReviewDate?: string;
}

export interface IdiomItem {
  id: string;
  phrase: string;
  literalMeaning: string;
  actualMeaning: string;
  simpleExplanation: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  formality: 'casual' | 'conversational' | 'professional';
  examples: string[];
  conversationSnippet: {
    speaker: string;
    text: string;
  }[];
  culturalContext?: string;
  similarExpression?: string;
  oppositeExpression?: string;
  speakingChallenge: string;
  audioText: string;
  isBookmarked?: boolean;
  masteryState: MasteryState;
}

export interface PhrasalVerbItem {
  id: string;
  phrase: string;
  baseVerb: string;
  particle: string;
  meaning: string;
  simpleMeaning: string;
  level: CEFRLevel;
  category: string;
  grammarBehavior: {
    separable: boolean;
    transitive: boolean;
    pattern: string;
  };
  formalAlternative: string;
  examples: string[];
  conversationSnippet: {
    speaker: string;
    text: string;
  }[];
  comparisonDiff?: {
    word: string;
    explanation: string;
  }[];
  isBookmarked?: boolean;
  masteryState: MasteryState;
}

export interface PersonalCollection {
  id: string;
  name: string;
  icon: string;
  description: string;
  wordIds: string[];
}

export interface GlobalSearchResult {
  id: string;
  title: string;
  type: 'grammar' | 'vocabulary' | 'idiom' | 'phrasal_verb' | 'lesson';
  subtitle: string;
  category: string;
  level: string;
  linkPath: string;
}
