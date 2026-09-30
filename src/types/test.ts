import { CEFRLevel, ErrorCategory } from './index';

export type TestCategory = 'structured' | 'speaking_challenge';

export type TestType =
  | 'quick_speaking'
  | 'level_assessment'
  | 'placement'
  | 'random_object_pitch'
  | 'no_fillers'
  | 'pros_cons_debate'
  | 'word_association'
  | 'three_word_story'
  | 'picture_description'
  | 'jam'
  | 'shadowing'
  | 'listening'
  | 'grammar'
  | 'vocabulary'
  | 'pronunciation'
  | 'fluency'
  | 'conversation'
  | 'challenge';

export type SkillType =
  | 'speaking'
  | 'grammar'
  | 'vocabulary'
  | 'pronunciation'
  | 'listening'
  | 'fluency'
  | 'reading'
  | 'writing'
  | 'conversation'
  | 'professional';

export type QuestionType =
  | 'multiple_choice'
  | 'fill_blank'
  | 'error_correction'
  | 'sentence_transformation'
  | 'rearrangement'
  | 'situation_based'
  | 'open_speaking'
  | 'shadowing'
  | 'picture'
  | 'debate'
  | 'word_chain'
  | 'story_prompt'
  | 'listening_comprehension'
  | 'pronunciation_repeat';

export interface PictureSceneData {
  title: string;
  descriptionPrompt: string;
  keyElements: string[];
  suggestedPhrases: string[];
  imageUrl?: string;
  themeColor: string;
}

export interface DebatePhaseData {
  phase: 'for' | 'against';
  durationSeconds: number;
  prompt: string;
  suggestedConnectors: string[];
}

export interface TargetWordData {
  word: string;
  phoneticsUK: string;
  phoneticsUS: string;
  syllableStress: string;
  tips: string;
  audioSample?: string;
}

export interface TestQuestion {
  id: string;
  testId?: string;
  type: QuestionType;
  skill: SkillType;
  difficulty: CEFRLevel;
  prompt: string;
  subtitle?: string;
  audioUrl?: string;
  listeningScript?: string;
  passageText?: string;
  imageScene?: PictureSceneData;
  options?: string[];
  correctAnswer?: string | number | string[];
  acceptableAnswers?: string[];
  explanation?: string;
  debatePhases?: DebatePhaseData[];
  starterWords?: string[];
  targetWords?: TargetWordData[];
  persuasionStructure?: string[];
  expectedDurationSeconds?: number;
  rubricCriteria?: { criteria: string; weight: number }[];
}

export interface TestDefinition {
  id: string;
  type: TestType;
  category: TestCategory;
  title: string;
  subtitle: string;
  description: string;
  durationMinutes: number;
  questionsCount: number;
  primarySkill: SkillType;
  level: CEFRLevel;
  iconName: string;
  badge?: string;
  instructions: string[];
  evaluationCriteria: string[];
  allowRetake: boolean;
  isDailyChallenge?: boolean;
}

export interface ErrorItem {
  youSaid: string;
  better: string;
  why: string;
  practiceType: 'grammar' | 'vocabulary' | 'pronunciation' | 'learn' | 'roleplay' | 'talk';
  practiceTarget: string;
  category: ErrorCategory;
}

export interface ErrorCategoryBreakdown {
  category: string;
  count: number;
  items: ErrorItem[];
}

export interface ScoreExplanation {
  skill: string;
  score: number;
  strength: string;
  practice: string;
}

export interface FillerAnalysis {
  totalWords: number;
  fillerCount: number;
  fillerRatio: number;
  fillersDetected: { word: string; count: number }[];
  pauseAdvice: string[];
}

export interface TestScoreMetrics {
  overallCommunication: number;
  speaking: number;
  grammar: number;
  vocabulary: number;
  pronunciation: number;
  listening: number;
  fluency: number;
  clarity: number;
}

export interface TestAttempt {
  id: string;
  testId: string;
  testType: TestType;
  testTitle: string;
  timestamp: string;
  dateIso: string;
  durationSeconds: number;
  scores: TestScoreMetrics;
  whatYouDidWell: string[];
  whatToImprove: {
    target: string;
    reason: string;
    actionLink: string;
    actionLabel: string;
  }[];
  errorBreakdown: ErrorCategoryBreakdown[];
  scoreExplanations: ScoreExplanation[];
  fillerAnalysis?: FillerAnalysis;
  transcript?: string;
  audioBlobUrl?: string;
  recordingId?: string;
  responses: Record<string, any>;
  isPlacement?: boolean;
  isRetake?: boolean;
  previousAttemptId?: string;
}

export interface WeakArea {
  id: string;
  topic: string;
  category: string;
  sources: {
    lessonMistakes: number;
    talkMistakes: number;
    roleplayMistakes: number;
    testMistakes: number;
  };
  totalMistakes: number;
  severity: 'high' | 'medium' | 'low';
  lastEncountered: string;
  sampleMistake: {
    youSaid: string;
    better: string;
  };
  practiceAction: {
    type: 'grammar' | 'learn' | 'vocabulary' | 'pronunciation' | 'roleplay' | 'talk';
    targetId: string;
    label: string;
  };
}

export interface ComparisonResult {
  previousAttempt: {
    date: string;
    scores: TestScoreMetrics;
  };
  currentAttempt: {
    date: string;
    scores: TestScoreMetrics;
  };
  scoreDeltas: Partial<Record<keyof TestScoreMetrics, number>>;
  improvedItems: string[];
  stillPracticingItems: string[];
}

export interface RecommendedTest {
  id: string;
  testId: string;
  title: string;
  reason: string;
  skill: SkillType;
  estimatedMinutes: number;
  urgency: 'high' | 'medium' | 'normal';
}

