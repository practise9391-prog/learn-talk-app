// Types for Part 22 to Final Part: Core Learning Journey, Progressive Curriculum,
// Jarvis Assistant, Map Locations, Sentence Building, Think-in-English, and Recovery.

export type AgeGroup =
  | 'children'
  | 'student_teen'
  | 'college'
  | 'professional'
  | 'adult_beginner'
  | 'older_adult';

export type ExplanationLanguage = 'english' | 'telugu' | 'hindi';

export type SpeakingComfortLevel = 'confident' | 'shy' | 'quiet_environment';

export type TextSizePreference = 'normal' | 'large' | 'extra_large';

// 1. Core Learning Journey Steps (Part 22)
export type CoreJourneyStage =
  | 'choose_level'
  | 'learn_concept'
  | 'understand_examples'
  | 'sentence_building'
  | 'speak_guided'
  | 'receive_feedback'
  | 'correct_mistakes'
  | 'repeat_independent'
  | 'take_test'
  | 'review_progress'
  | 'next_lesson';

export interface CoreJourneyPlanItem {
  id: string;
  stepNumber: number;
  stage: CoreJourneyStage;
  title: string;
  subtitle: string;
  description: string;
  actionRequired: string;
  completed: boolean;
  targetRoute: string;
  routeTarget: string;
  estimatedMinutes: number;
}

// 2. Sentence-Building Laboratory (Part L requirement 18)
export interface SentenceElement {
  id: string;
  type: 'subject' | 'verb' | 'object' | 'modifier' | 'polite_ending';
  text: string;
  explanation: string;
  teluguTranslation?: string;
  hindiTranslation?: string;
}

export interface SentenceBuildingExercise {
  id: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  situationContext: string;
  intendedMeaning: string;
  availableElements: SentenceElement[];
  correctSequence: string[]; // array of element IDs
  standardSentence: string;
  naturalAlternative: string;
  explanationWhyBetter: string;
  teluguExplanation?: string;
  hindiExplanation?: string;
}

// 3. Think-in-English Training (Part L requirement 17)
export interface ThinkInEnglishItem {
  id: string;
  objectName: string;
  iconOrVisual: string;
  level: 'level1_see_say' | 'level2_describe' | 'level3_opinion' | 'level4_story';
  targetWord: string;
  audioPromptSentence: string;
  audioQuestionPrompt: string;
  modelSpokenResponse: string;
  teluguHelp?: string;
  hindiHelp?: string;
  conversationExtension: string;
}

// 4. Real-World Conversation Recovery (Part L requirement 19)
export type RecoveryCategory =
  | 'forgot_word'
  | 'ask_speak_slowly'
  | 'did_not_understand'
  | 'correct_misunderstanding'
  | 'buying_thinking_time'
  | 'rephrase_differently';

export interface ConversationRecoveryCard {
  id: string;
  category: RecoveryCategory;
  categoryTitle: string;
  situation: string;
  primaryPhrase: string;
  alternatives: string[];
  whenToUse: string;
  audioExampleText: string;
}

// 5. Confidence and Speaking Journal (Part L requirement 20)
export interface ConfidenceJournalEntry {
  id: string;
  timestamp: string;
  dateFormatted: string;
  title: string;
  whatPracticed: string;
  whatFeltDifficult: string;
  breakthrough: string;
  confidenceRating: number; // 1 to 5
  notes?: string;
}

// 6. Extended Map Destination Scenarios (Part 26)
export type LocationCategoryType =
  | 'education'
  | 'daily_life'
  | 'travel'
  | 'professional'
  | 'civic_community';

export interface LocationScenarioDetail {
  id: string;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  starterPrompt: string;
  samplePhrases: string[];
  completed: boolean;
}

export interface FullMapLocation {
  id: string;
  name: string;
  category: LocationCategoryType;
  icon: string;
  tagline: string;
  description: string;
  environmentDescription: string;
  defaultPersonaId: string;
  greetingPhrase: string;
  coordinates: { x: number; y: number };
  unlocked: boolean;
  scenarios: LocationScenarioDetail[];
}

// 7. Jarvis Coach Conversation Modes (Part 25)
export type JarvisCoachMode =
  | 'guided'
  | 'independent'
  | 'practice'
  | 'challenge'
  | 'correction'
  | 'fluency'
  | 'listening';

export interface ProgressiveHintState {
  level: 0 | 1 | 2 | 3; // 0 = none, 1 = situation clue, 2 = starting words, 3 = complete model
  clueText?: string;
  starterPhrase?: string;
  fullModel?: string;
}
