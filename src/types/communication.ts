// Part 16: Complete Listening, Reading, Writing & Communication Skills System Types
import { CEFRLevel } from './index';
import { SkillName } from './adaptive';

export type CommunicationSkillType = 'listening' | 'reading' | 'writing' | 'speaking';

// ----------------------------------------------------
// 1. LISTENING SYSTEM TYPES
// ----------------------------------------------------

export type ListeningSpeed = '0.75x' | '1x' | '1.25x' | '1.5x';

export type TranscriptMode = 'off' | 'on' | 'sentence' | 'keywords_only';

export type ListeningContentType =
  | 'dialogue'
  | 'story'
  | 'announcement'
  | 'phone_call'
  | 'interview'
  | 'workplace_meeting'
  | 'instruction'
  | 'travel';

export interface SpeakerProfile {
  id: string;
  name: string;
  role: string;
  voiceGender: 'male' | 'female';
  accent?: 'US' | 'UK' | 'Neutral' | 'Australian';
}

export interface TranscriptSegment {
  id: string;
  speakerId: string;
  speakerName: string;
  text: string;
  timestamp: string; // e.g. "00:04"
  startSeconds: number;
  endSeconds: number;
  hintKeywords?: string[];
  translation?: string;
}

export interface DictationItem {
  id: string;
  targetSentence: string;
  audioSnippetText: string;
  isPartial: boolean;
  maskedTokens?: string[]; // e.g. ["yesterday", "office"]
  grammarFocus: string;
  hint: string;
}

export interface MinimalPairItem {
  id: string;
  wordA: string;
  wordB: string;
  targetWord: string;
  phonemeContrast: string; // e.g. "/Éª/ vs /iË /" (ship vs sheep)
  explanation: string;
  audioSnippetText: string;
}

export interface ConnectedSpeechItem {
  id: string;
  casualForm: string; // e.g. "whaddya think?"
  formalForm: string; // e.g. "what do you think?"
  ruleType: 'reduction' | 'elision' | 'linking' | 'assimilation';
  explanation: string;
  contextUsage: string; // e.g. "Everyday casual talk with peers; avoid in formal written reports."
}

export interface ListeningQuestion {
  id: string;
  question: string;
  type: 'mcq' | 'true_false' | 'open_ended' | 'sequence';
  options?: string[];
  correctAnswer: string | string[];
  acceptableAnswers?: string[];
  explanation: string;
  evidenceQuote: string;
}

export interface ListeningContentItem {
  id: string;
  title: string;
  subtitle: string;
  contentType: ListeningContentType;
  cefrLevel: CEFRLevel;
  difficultyPace: 'slow' | 'natural' | 'fast' | 'real_world';
  durationSeconds: number;
  speakers: SpeakerProfile[];
  transcript: TranscriptSegment[];
  questions: ListeningQuestion[];
  dictationItems?: DictationItem[];
  minimalPairs?: MinimalPairItem[];
  connectedSpeechTips?: ConnectedSpeechItem[];
  contextPlace: string; // e.g. "Airport", "Office", "CafÃ©"
  followUpCrossSkill?: {
    type: 'speak_summary' | 'write_summary' | 'roleplay_continue';
    prompt: string;
    guidance: string;
    targetRoute?: string;
  };
}

// ----------------------------------------------------
// 2. READING SYSTEM TYPES
// ----------------------------------------------------

export type ReadingContentType =
  | 'article'
  | 'dialogue'
  | 'email'
  | 'workplace_doc'
  | 'story'
  | 'notice'
  | 'job_description';

export interface VocabularyAnnotation {
  word: string;
  partOfSpeech: string;
  definition: string;
  simpleExplanation: string;
  exampleSentence: string;
  synonyms: string[];
  grammarNote?: string;
}

export interface ReadingQuestion {
  id: string;
  question: string;
  type: 'main_idea' | 'detail' | 'inference' | 'vocabulary' | 'author_purpose';
  options: string[];
  correctAnswer: string;
  explanation: string;
  passageEvidenceQuote: string;
}

export interface ReadAloudPrompt {
  targetParagraph: string;
  fluencyGoalWPM: number;
  pronunciationTargets: string[];
}

export interface ReadingContentItem {
  id: string;
  title: string;
  topic: string;
  contentType: ReadingContentType;
  cefrLevel: CEFRLevel;
  estimatedMinutes: number;
  wordCount: number;
  passage: string; // Multiline text or paragraphs
  vocabularyAnnotations: VocabularyAnnotation[];
  readingStrategies: string[]; // e.g. "Skimming for Main Idea", "Contextual Clues"
  questions: ReadingQuestion[];
  audioNarrationText?: string;
  readAloudPrompt?: ReadAloudPrompt;
  followUpCrossSkill?: {
    type: 'verbal_summary' | 'written_reflection';
    prompt: string;
    targetRoute?: string;
  };
}

// ----------------------------------------------------
// 3. WRITING SYSTEM TYPES
// ----------------------------------------------------

export type WritingType =
  | 'sentence_builder'
  | 'transformation'
  | 'guided_paragraph'
  | 'email'
  | 'workplace_message'
  | 'opinion'
  | 'story';

export type WritingTone =
  | 'friendly'
  | 'neutral'
  | 'professional'
  | 'formal'
  | 'persuasive'
  | 'apologetic';

export interface SentenceBuilderScaffolding {
  shuffledWords: string[];
  targetSentence: string;
  hint: string;
}

export interface SentenceTransformationScaffolding {
  originalSentence: string;
  transformationGoal: string; // e.g. "Convert to Past Tense" or "Make Polite/Professional"
  modelExample: string;
}

export interface EmailWritingStructure {
  subject: string;
  greetingPlaceholder: string;
  openingPlaceholder: string;
  purposePlaceholder: string;
  detailsPlaceholder: string;
  requestPlaceholder: string;
  closingPlaceholder: string;
}

export interface WritingPromptItem {
  id: string;
  title: string;
  writingType: WritingType;
  cefrLevel: CEFRLevel;
  tone: WritingTone;
  promptText: string;
  instruction: string;
  targetLengthWords: { min: number; max: number };
  targetKeywords: string[];
  targetGrammarRules: string[];
  sentenceBuilder?: SentenceBuilderScaffolding;
  transformation?: SentenceTransformationScaffolding;
  emailStructure?: EmailWritingStructure;
  rubricCriteria: {
    taskCompletion: number;
    grammarAccuracy: number;
    vocabularyRichness: number;
    coherenceOrganization: number;
    toneAppropriateness: number;
  };
  modelResponses: {
    text: string;
    quality: 'acceptable' | 'natural' | 'professional';
    explanation: string;
  }[];
  followUpCrossSkill?: {
    type: 'talk_with_jarvis' | 'roleplay_scenario';
    prompt: string;
  };
}

export interface WritingCorrection {
  id: string;
  originalSnippet: string;
  suggestedCorrection: string;
  issueType: 'Grammar' | 'Vocabulary' | 'Structure' | 'Clarity' | 'Spelling' | 'Punctuation' | 'Tone';
  explanation: string;
  ruleName?: string;
}

export interface WritingEvaluationResult {
  overallScore: number; // 0 - 100
  qualityTier: 'needs_revision' | 'acceptable' | 'natural' | 'professional';
  feedbackSummary: string;
  corrections: WritingCorrection[];
  betterAlternativeVersions: {
    tone: string;
    text: string;
    explanation: string;
  }[];
  rubricScores: {
    taskCompletion: number;
    grammar: number;
    vocabulary: number;
    organization: number;
    tone: number;
  };
}

export interface WritingSubmission {
  id: string;
  promptId: string;
  promptTitle: string;
  writingType: WritingType;
  draftNumber: number;
  text: string;
  evaluation?: WritingEvaluationResult;
  status: 'draft' | 'submitted' | 'revised';
  createdAt: string;
  updatedAt: string;
}

// ----------------------------------------------------
// 4. CROSS-SKILL MULTI-MODAL CHALLENGES
// ----------------------------------------------------

export interface CommunicationChallengeStep {
  stepNumber: number;
  skill: 'listen' | 'read' | 'write' | 'speak';
  label: string;
  instruction: string;
  contentRefId: string;
  completed: boolean;
  score?: number;
}

export interface CommunicationChallenge {
  id: string;
  title: string;
  scenario: string;
  context: string;
  cefrLevel: CEFRLevel;
  estimatedMinutes: number;
  steps: CommunicationChallengeStep[];
  xpReward: number;
  completed: boolean;
}

export interface CommunicationSkillSummary {
  speaking: number;
  listening: number;
  reading: number;
  writing: number;
  grammar: number;
  vocabulary: number;
  pronunciation: number;
  fluency: number;
}
