// LearnTalk - Part 2 Curriculum Domain Models & Types

export type CurriculumLevelId =
  | 'beginner_1'
  | 'beginner_2'
  | 'intermediate_1'
  | 'intermediate_2'
  | 'advanced_1'
  | 'advanced_2';

export type ProficiencyRating = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
// 1: Absolute Beginner
// 2: Beginner
// 3: Elementary
// 4: Lower Intermediate
// 5: Intermediate
// 6: Upper Intermediate
// 7: Advanced
// 8: Professional / Fluent

export type LessonMasteryStatus =
  | 'locked'      // 🔒 Cannot access yet
  | 'available'   // ○ Unlocked and ready
  | 'learning'    // ◉ In progress
  | 'completed'   // ✓ Completed all 7 steps
  | 'mastered';   // ⭐ Completed with high accuracy and repeated practice

export type ExerciseType =
  | 'repeat'
  | 'fill_gap'
  | 'rearrange'
  | 'free_speak'
  | 'multiple_choice';

export interface VocabularyWord {
  id: string;
  word: string;
  meaning: string;
  simpleMeaning: string;
  example: string;
  pronunciation: string;
  teluguTranslation: string;
  hindiTranslation: string;
  usageContext: string;
  collocations?: string[];
  commonPhrases?: string[];
  synonyms?: string[];
}

export interface GrammarFocus {
  topic: string;
  rule: string;
  formula: string;
  visualDiagramType?: 'svo' | 'tense_past' | 'tense_present' | 'question_word' | 'commute_flow';
  whyExplanation: string;
  commonMistakes: {
    incorrect: string;
    correct: string;
    why: string;
  }[];
}

export interface ExerciseItem {
  id: string;
  type: ExerciseType;
  prompt: string;
  options?: string[];
  correctAnswer: string;
  wordsForRearrange?: string[];
  explanation: string;
  hint?: string;
}

export interface DialogueTurn {
  sender: 'ai' | 'user';
  text: string;
  audioUrl?: string;
  naturalAlternative?: string;
  phrasingTip?: string;
}

export interface CurriculumLesson {
  id: string;
  unitId: string;
  lessonNumber: number;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  proficiencyLevel: ProficiencyRating;
  status: LessonMasteryStatus;
  
  // Concept & Objectives
  conceptSummary: string;
  whyItMatters: string;
  realLifeApplication: string;
  targetPhrases: string[];

  // 7-Step Content
  grammarFocus: GrammarFocus;
  vocabulary: VocabularyWord[];
  audioExamples: {
    text: string;
    context: string;
    speakerRole: string;
    highlightWord?: string;
  }[];
  speakingPrompt: {
    question: string;
    context: string;
    exampleAnswer: string;
    suggestedStarters: string[];
  };
  exercises: ExerciseItem[];
  conversationScenario: {
    scenarioTitle: string;
    context: string;
    aiPartnerName: string;
    aiPartnerRole: string;
    aiAvatar: string;
    initialMessage: string;
    suggestedResponses: string[];
  };
}

export interface CurriculumUnit {
  id: string;
  levelId: CurriculumLevelId;
  unitNumber: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  themeColor: string;
  status: 'locked' | 'available' | 'active' | 'completed' | 'mastered';
  lessons: CurriculumLesson[];
}

export interface CurriculumLevel {
  id: CurriculumLevelId;
  title: string;
  label: string; // "Beginner Level 1"
  category: 'Beginner' | 'Intermediate' | 'Advanced';
  proficiencyRating: ProficiencyRating;
  proficiencyName: string; // e.g. "Absolute Beginner"
  description: string;
  competencyOutcome: string;
  units: CurriculumUnit[];
  status: 'locked' | 'current' | 'completed';
}

export interface SmartRevisionItem {
  id: string;
  topic: string;
  category: 'grammar' | 'pronunciation' | 'vocabulary' | 'fillers' | 'tense';
  triggerReason: string; // e.g. "You hesitated on Past Simple in yesterday's conversation"
  actionPrompt: string;
  lessonIdRef?: string;
  completed: boolean;
}

export interface LessonAttemptResult {
  lessonId: string;
  timestamp: string;
  grammarScore: number;
  vocabularyScore: number;
  pronunciationScore: number;
  fluencyScore: number;
  listeningScore: number;
  overallScore: number;
  wordsLearned: number;
  speakingTimeSeconds: number;
  whatYouDidWell: string[];
  whatToImprove: string[];
  nextRecommendedStep: string;
}
