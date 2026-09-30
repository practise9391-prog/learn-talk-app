import { CEFRLevel } from './index';

export type UserRole = 'learner' | 'content_editor' | 'reviewer' | 'admin' | 'super_admin';

export type ContentStatus = 'draft' | 'review' | 'approved' | 'published' | 'archived';

export type ContentType =
  | 'curriculum_lesson'
  | 'grammar_topic'
  | 'vocabulary_item'
  | 'idiom'
  | 'phrasal_verb'
  | 'roleplay_scenario'
  | 'speaking_test'
  | 'practice_activity';

export interface ManagedContentItem {
  id: string;
  title: string;
  type: ContentType;
  level: CEFRLevel;
  version: number;
  status: ContentStatus;
  author: string;
  reviewer?: string;
  updatedAt: string;
  summary: string;
  contentData: any;
}

export interface AdminAuditLog {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  details: string;
}

export interface ManagedUserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  currentLevel: CEFRLevel;
  status: 'active' | 'suspended';
  joinedDate: string;
  lastActive: string;
  lessonsCompleted: number;
  speakingMinutes: number;
}

export interface ServiceHealthMetric {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  latencyMs: number;
  uptimePercent: number;
  lastChecked: string;
}

export interface SystemHealthData {
  services: ServiceHealthMetric[];
  activeFeatureFlags: { [key: string]: boolean };
  errorRatePercent: number;
  totalApiCalls24h: number;
}
