// Core Domain Models & Types for LearnTalk Platform

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type ErrorCategory =
  | 'Grammar'
  | 'Vocabulary'
  | 'Pronunciation'
  | 'Word choice'
  | 'Sentence structure'
  | 'Article usage'
  | 'Preposition'
  | 'Tense'
  | 'Subject-verb agreement'
  | 'Word order'
  | 'Naturalness'
  | 'Formality'
  | 'Casual English'
  | 'Filler word'
  | 'Repetition'
  | 'Translation-based English'
  | 'Incomplete sentence';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ThemePalette = 'ocean' | 'midnight' | 'forest' | 'sunset' | 'purple' | 'minimal';

export type SpeakingPace = 'slow' | 'normal' | 'fast' | 'challenge';

export type ConfidenceMode =
  | 'learn_first'
  | 'listen_first'
  | 'practice'
  | 'real_conversation'
  | 'challenge';

export type AssistanceLevel = 1 | 2 | 3 | 4 | 5; // Hint, 3 words, Phrase, Sentence framework, Full example

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  currentLevel: CEFRLevel;
  streakDays: number;
  xp: number;
  minutesSpokenToday: number;
  dailyGoalMinutes: number;
  nativeLanguages: string[];
  goals: string[];
  settings: UserSettings;
}

export interface UserSettings {
  themeMode: ThemeMode;
  themePalette: ThemePalette;
  reducedMotion: boolean;
  hapticFeedback: boolean;
  recordingPermissionsGranted: boolean;
  autoSaveRecordings: boolean;
  speakingPace: SpeakingPace;
  preferredAssistanceLevel: AssistanceLevel;
  activePersonaId: string;
  autoListenSlow: boolean;
  soundEffects: boolean;
}

export interface SkillProgress {
  grammar: number; // 0 - 100%
  vocabulary: number;
  pronunciation: number;
  fluency: number;
  listening: number;
  speaking: number;
  conversation: number;
  confidence: number;
}

export interface LearningLevel {
  id: CEFRLevel;
  name: string;
  label: string; // e.g. "Beginner", "Elementary"
  description: string;
  targetCompetency: string;
  unitsCount: number;
  completedUnitsCount: number;
  status: 'locked' | 'current' | 'completed';
  order: number;
}

export interface Unit {
  id: string;
  levelId: CEFRLevel;
  unitNumber: number;
  title: string;
  subtitle: string;
  description: string;
  lessons: Lesson[];
  status: 'locked' | 'active' | 'completed';
  icon: string;
}

export type LessonType = 'grammar' | 'vocabulary' | 'pronunciation' | 'speaking' | 'conversation' | 'listening' | 'reading' | 'writing';

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  category: LessonType;
  estimatedMinutes: number;
  completed: boolean;
  active: boolean;
  conceptSummary: string;
  keyPhrases: string[];
  steps: {
    learn: boolean;
    see: boolean;
    listen: boolean;
    repeat: boolean;
    practice: boolean;
    speak: boolean;
    converse: boolean;
    correct: boolean;
    review: boolean;
  };
}

export interface LocationScenario {
  id: string;
  name: string;
  category: 'daily_life' | 'work_study' | 'travel_transit' | 'social_community';
  icon: string;
  tagline: string;
  description: string;
  environmentDescription: string;
  defaultPersonaId: string;
  greetingPhrase: string;
  coordinates: { x: number; y: number }; // Relative coordinates on the speaking world map (0-100%)
  unlocked: boolean;
  samplePhrases: string[];
  conversationMilestones: string[];
}

export interface AICharacter {
  id: string;
  name: string;
  role: string;
  personaType:
    | 'friendly_friend'
    | 'teacher'
    | 'interviewer'
    | 'manager'
    | 'customer'
    | 'hotel_receptionist'
    | 'shopkeeper'
    | 'travel_partner'
    | 'strict_coach'
    | 'supportive_coach';
  avatar: string;
  tone: string;
  speakingSpeed: SpeakingPace;
  description: string;
  correctionStyle: 'supportive' | 'detailed' | 'strict' | 'casual';
}

export interface ConversationMessage {
  id: string;
  sessionId: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  audioUrl?: string;
  durationSeconds?: number;
  naturalVersion?: string;
  casualVersion?: string;
  politeVersion?: string;
  explanation?: string;
  mistakes?: Mistake[];
}

export interface Mistake {
  id: string;
  userId: string;
  sessionId?: string;
  category: ErrorCategory;
  originalText: string;
  correctedText: string;
  whyExplanation: string;
  contextUsage: string;
  exampleSentence: string;
  timestamp: string;
  repeatedCount: number;
  resolved: boolean;
}

export interface ConversationSession {
  sessionId: string;
  userId: string;
  scenarioId?: string;
  locationId?: string;
  personaId: string;
  lessonId?: string;
  level: CEFRLevel;
  confidenceMode: ConfidenceMode;
  startedAt: string;
  endedAt?: string;
  durationSeconds: number;
  messages: ConversationMessage[];
  status: 'active' | 'completed' | 'abandoned';
  score?: SpeakingScore;
  recordingId?: string;
}

export interface SpeakingScore {
  overall: number; // 0-100
  fluencyScore?: number;
  grammarScore?: number;
  vocabularyScore?: number;
  clarityScore?: number;
  wordsSpoken: number;
  turnCount: number;
  isRealCalculated: boolean; // Must be false if no real audio engine evaluated it yet
}

export interface Recording {
  id: string;
  sessionId: string;
  title: string;
  scenarioName: string;
  timestamp: string;
  durationSeconds: number;
  audioBlobUrl?: string;
  hasAudio: boolean;
  transcriptText: string;
  correctionsCount: number;
  savedLocally: boolean;
}

export interface RoleplayTask {
  id: string;
  title: string;
  category: 'interview' | 'corporate' | 'daily_life' | 'negotiation' | 'spontaneous';
  description: string;
  difficulty: CEFRLevel;
  personaId: string;
  expectedDurationMin: number;
  goals: string[];
}

export interface Test {
  id: string;
  title: string;
  type: 'placement' | 'diagnostic' | 'unit_eval' | 'speaking_readiness';
  description: string;
  durationMinutes: number;
  questionsCount: number;
  cefrFocus: CEFRLevel;
}

export interface TranslationQuery {
  sourceText: string;
  fromLanguage: string;
  toLanguage: string;
  naturalEnglish: string;
  grammaticalEnglish?: string;
  meaning: string;
  phonetics?: string;
  usageContext: string;
  exampleSentence: string;
}
