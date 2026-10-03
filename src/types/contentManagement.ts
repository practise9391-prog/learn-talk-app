// LearnTalk - Part 13: Content Management, Content Authoring & Learning Content Engine Types
import { CEFRLevel } from './index';
import { ContentStatus, ContentType, UserRole } from './admin';

export type BlockType =
  | 'heading'
  | 'text'
  | 'audio'
  | 'example'
  | 'vocabulary_item'
  | 'grammar_point'
  | 'dialogue'
  | 'speaking_prompt'
  | 'interactive_question'
  | 'pronunciation_focus'
  | 'cultural_note';

export interface ContentBlock {
  id: string;
  type: BlockType;
  order: number;
  title?: string;
  content: string;
  metadata?: {
    audioUrl?: string;
    speakerRole?: string;
    phoneticIpa?: string;
    translationTelugu?: string;
    translationHindi?: string;
    canonicalRefId?: string;
    questionOptions?: string[];
    correctAnswer?: string;
    acceptedAlternatives?: string[];
    explanation?: string;
  };
}

export interface ContentRelationship {
  id: string;
  sourceId: string;
  sourceType: ContentType;
  targetId: string;
  targetType: ContentType;
  relationshipType:
    | 'requires_grammar'
    | 'teaches_vocabulary'
    | 'reinforced_by_roleplay'
    | 'tested_in'
    | 'prerequisite_of'
    | 'practice_companion';
  targetTitle: string;
}

export interface ContentVersion {
  versionNumber: number;
  updatedAt: string;
  author: string;
  changeSummary: string;
  snapshotData: any;
}

export interface PublishingValidationCheck {
  id: string;
  label: string;
  status: 'passed' | 'warning' | 'failed';
  message: string;
}

export interface PublishingValidationReport {
  isValid: boolean;
  score: number; // 0 - 100
  checks: PublishingValidationCheck[];
  missingFields: string[];
  duplicateWarnings: string[];
  brokenReferences: string[];
}

export type IssueCategory =
  | 'confusing_explanation'
  | 'incorrect_answer'
  | 'audio_problem'
  | 'broken_activity'
  | 'suggestion'
  | 'other';

export type IssueStatus =
  | 'reported'
  | 'under_review'
  | 'confirmed'
  | 'fix_in_progress'
  | 'resolved'
  | 'dismissed';

export interface ContentIssueReport {
  id: string;
  contentId: string;
  contentTitle: string;
  contentType: ContentType;
  reportedBy: string;
  category: IssueCategory;
  details: string;
  status: IssueStatus;
  createdAt: string;
  resolvedAt?: string;
  adminNotes?: string;
}

export interface MediaResource {
  id: string;
  title: string;
  fileName: string;
  fileType: 'audio' | 'image' | 'video' | 'document';
  url: string;
  sizeBytes: number;
  uploadedAt: string;
  referencedByCount: number;
  status: 'active' | 'missing' | 'unused';
}

export interface ContentTranslationState {
  language: 'en' | 'te' | 'hi' | 'ta';
  languageLabel: string;
  status: 'draft' | 'review' | 'published';
  translatedTitle?: string;
  translatedSummary?: string;
  localizedExplanation?: string;
  updatedAt: string;
}

export interface ReusableLessonDraft {
  id: string;
  unitId: string;
  level: CEFRLevel;
  title: string;
  slug: string;
  difficulty: 'easy' | 'normal' | 'challenging' | 'advanced';
  estimatedMinutes: number;
  learningObjectives: string[];
  prerequisites: string[];
  tags: string[];
  status: ContentStatus;
  version: number;
  author: string;
  reviewer?: string;
  sections: {
    id: string;
    name: 'introduction' | 'explanation' | 'examples' | 'vocabulary' | 'grammar' | 'speaking' | 'practice' | 'review';
    order: number;
    blocks: ContentBlock[];
  }[];
  relationships: ContentRelationship[];
  translations: ContentTranslationState[];
  versions: ContentVersion[];
  createdAt: string;
  updatedAt: string;
}
