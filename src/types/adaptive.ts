// Domain Models for Part 11: Adaptive Learning Engine, Personalization & Mastery System

export type SkillName =
  | 'grammar'
  | 'vocabulary'
  | 'pronunciation'
  | 'listening'
  | 'speaking'
  | 'reading'
  | 'writing'
  | 'fluency'
  | 'comprehension'
  | 'sentence_construction'
  | 'naturalness'
  | 'conversation_ability'
  | 'professional_communication';

export type SkillProficiencyLevel =
  | 'Beginner'
  | 'Beginner+'
  | 'Intermediate'
  | 'Intermediate+'
  | 'Advanced'
  | 'Fluent';

export type AdaptiveDifficultyLevel = 'easy' | 'normal' | 'challenging' | 'advanced';

export type HintLevel =
  | 'no_hint'
  | 'word_hint'
  | 'phrase_hint'
  | 'sentence_starter'
  | 'structure'
  | 'example';

export type MasteryState =
  | 'not_started'
  | 'introduced'
  | 'practicing'
  | 'developing'
  | 'proficient'
  | 'mastered';

export type LearningGoalId =
  | 'general_conversation'
  | 'job_interview'
  | 'office_communication'
  | 'travel'
  | 'academic';

export interface SkillMetric {
  skill: SkillName;
  label: string;
  score: number; // 0 - 100
  level: SkillProficiencyLevel;
  confidence: number; // 0 - 100
  trend: 'improving' | 'stable' | 'declining';
  evidenceCount: number;
  lastDemonstrated: string;
}

export interface LearningGoalConfig {
  id: LearningGoalId;
  title: string;
  tagline: string;
  icon: string;
  focusAreas: string[];
  recommendedPersonas: string[];
  keyTopics: string[];
  milestones: {
    id: string;
    label: string;
    completed: boolean;
    progressPercentage: number;
  }[];
}

export interface LearnerSkillProfile {
  skills: Record<SkillName, SkillMetric>;
  overallDerivedLevel: SkillProficiencyLevel;
  primaryGoal: LearningGoalId;
  secondaryGoals: LearningGoalId[];
  detectedStrengths: string[];
  currentDifficulty: AdaptiveDifficultyLevel;
  autoEased: boolean;
  challengeMode: boolean;
  recentSuccessStreak: number;
  recentStruggleCount: number;
  preferredHintLevel: HintLevel;
  hesitationDetected: boolean;
  hesitationPrompt?: string;
  lastActiveDate: string;
  daysSinceLastPractice: number;
}

export interface LearningEvidence {
  id: string;
  timestamp: string;
  sourceType: 'lesson' | 'practice' | 'talk' | 'roleplay' | 'test' | 'drill' | 'listening' | 'reading' | 'writing' | 'communication';
  sourceTitle: string;
  targetSkill: SkillName;
  accuracyScore: number; // 0 - 100
  difficulty: AdaptiveDifficultyLevel;
  hintsUsedCount: number;
  speakingSeconds?: number;
  hesitationCount?: number;
  contextType: 'quiz' | 'sentence' | 'spontaneous_speaking' | 'dialogue';
  mistakesMade?: string[];
}

export interface MasteryRecord {
  id: string;
  conceptId: string;
  conceptType: 'grammar' | 'vocabulary' | 'idiom' | 'phrasal_verb' | 'lesson';
  title: string;
  category: string;
  status: MasteryState;
  masteryScore: number; // 0 - 100
  contextEvidence: {
    quizScore?: number;
    sentencePracticeScore?: number;
    speakingScore?: number;
    roleplayScore?: number;
    testScore?: number;
  };
  demonstrationCount: number;
  lastPracticed: string;
  isDecayed: boolean;
  decayWarning?: string;
  nextReviewDate: string;
  intervalDays: number;
  transferContextsTested: string[];
}

export interface PersonalizedRecommendation {
  id: string;
  title: string;
  subtitle: string;
  reason: string;
  expectedBenefit: string;
  actionLabel: string;
  actionRoute: string;
  actionParams?: Record<string, string>;
  category:
    | 'weakness_repair'
    | 'new_learning'
    | 'revision'
    | 'goal_preparation'
    | 'strength_development'
    | 'speaking_practice';
  priorityScore: number; // Calculated across 10 weighting factors
  whyThisText: string;
  difficulty: AdaptiveDifficultyLevel;
  estimatedMinutes: number;
  tag: string;
}

export interface PlanItem {
  id: string;
  title: string;
  type: string;
  durationMinutes: number;
  actionRoute: string;
  actionParams?: Record<string, string>;
  completed: boolean;
  skillTag: SkillName;
}

export interface DailyAdaptivePlan {
  date: string;
  primaryGoalTitle: string;
  quick5: PlanItem[];
  standard15: PlanItem[];
  deep30: PlanItem[];
  selectedTier: 'quick5' | 'standard15' | 'deep30';
}

export interface WeeklyPlan {
  weekLabel: string;
  grammarFocus: string;
  vocabFocus: string;
  speakingFocus: string;
  roleplayFocus: string;
  testFocus: string;
}

export interface ErrorCluster {
  patternId: string;
  title: string;
  category: 'grammar' | 'vocabulary' | 'speaking' | 'naturalness';
  occurrences: number;
  sampleMistakes: string[];
  rootCauseRule: string;
  targetedExerciseTopic: string;
  relatedRoute: string;
  status: 'active' | 'improving' | 'resolved';
}

export interface SkillDependencyNode {
  id: string;
  name: string;
  category: SkillName;
  level: SkillProficiencyLevel;
  prerequisites: string[];
  status: MasteryState;
  description: string;
  icon: string;
}
