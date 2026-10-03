// Part 14: Peer Learning, Community Practice, Social Speaking & Safe Human Interaction Types
import { CEFRLevel, ErrorCategory } from './index';
import { ConversationDifficulty } from './talk';
import { NativeLanguageSupport } from './speakingIntelligence';

export type SpeakingPracticePreference =
  | 'ai_only'
  | 'ai_self'
  | 'ai_peer'
  | 'all_modes';

export type ProfileVisibility =
  | 'private'
  | 'compatible_only'
  | 'connections_only'
  | 'community';

export type PracticeConversationType =
  | 'casual'
  | 'structured'
  | 'qa'
  | 'debate'
  | 'storytelling'
  | 'interview'
  | 'roleplay';

export type AIFacilitatorMode = 'none' | 'guide' | 'moderator' | 'coach';

export type ConnectionQuality = 'excellent' | 'good' | 'weak' | 'reconnecting';

export type RequestStatus = 'pending' | 'accepted' | 'declined' | 'cancelled' | 'expired';

export type RoomParticipantRole = 'host' | 'moderator' | 'participant';

export type GroupSpeakingMode =
  | 'free'
  | 'guided'
  | 'round_table'
  | 'debate'
  | 'interview_circle'
  | 'story_circle'
  | 'topic_discussion';

export interface PeerProfile {
  id: string;
  displayName: string;
  avatarSeed: string;
  currentLevel: CEFRLevel;
  speakingLevel: string; // e.g. "B1 Intermediate"
  nativeLanguage: string; // e.g. "Telugu", "Hindi", "Tamil"
  learningGoals: string[];
  practiceTopics: string[];
  preferredStyle: 'casual' | 'structured' | 'professional' | 'academic';
  preferredPace: 'relaxed' | 'moderate' | 'brisk';
  availabilityDays: string[]; // e.g. ["Mon", "Wed", "Sat"]
  availabilityTimeWindow: string; // e.g. "Evening (6 PM - 10 PM IST)"
  timezone: string;
  sessionsCompleted: number;
  streakDays: number;
  learningBio?: string;
  isOnline: boolean;
  lastActive: string;
  isDiscoveryEnabled: boolean;
  visibility: ProfileVisibility;
}

export interface PartnerCompatibility {
  partner: PeerProfile;
  matchScore: number; // 0 - 100 internal
  badge: 'Top Match' | 'Great Match' | 'Good Match';
  commonReasons: string[];
}

export interface PracticeRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderLevel: CEFRLevel;
  recipientId: string;
  recipientName: string;
  topic: string;
  difficulty: ConversationDifficulty;
  durationMinutes: number;
  format: PracticeConversationType;
  message?: string;
  status: RequestStatus;
  createdAt: string;
  expiresAt: string;
}

export interface PracticeConnection {
  id: string;
  partnerId: string;
  partner: PeerProfile;
  connectedSince: string;
  totalSessionsWithPartner: number;
  lastPracticedDate: string;
  lastTopic: string;
  favoriteTopics: string[];
}

export interface ConversationConsent {
  recordingConsent: boolean;
  transcriptionConsent: boolean;
  aiAnalysisConsent: boolean;
  updatedAt: string;
}

export interface RoomParticipant {
  id: string;
  displayName: string;
  currentLevel: CEFRLevel;
  role: RoomParticipantRole;
  isMuted: boolean;
  isSpeaking: boolean;
  hasHandRaised: boolean;
  audioQuality: ConnectionQuality;
  joinedAt: string;
}

export interface RoomChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isSystemNote?: boolean;
}

export interface PracticeRoom {
  id: string;
  title: string;
  topic: string;
  category: string;
  difficulty: ConversationDifficulty;
  durationMinutes: number;
  format: PracticeConversationType;
  groupMode?: GroupSpeakingMode;
  maxParticipants: number;
  participants: RoomParticipant[];
  facilitatorMode: AIFacilitatorMode;
  isLocked: boolean;
  requiresConsent: boolean;
  status: 'waiting' | 'active' | 'completed';
  createdAt: string;
  structuredPrompts: string[];
  activePromptIndex: number;
  currentSpeakerId?: string;
  timerSecondsRemaining: number;
  roleplayScenarioId?: string;
}

export interface PeerSessionSummary {
  id: string;
  roomId: string;
  topic: string;
  partnerName: string;
  partnerId: string;
  durationMinutes: number;
  date: string;
  skillsPracticed: string[];
  selectedGoal: string;
  goalAchieved: boolean;
  goalProgressText: string;
  vocabularyPracticed: string[];
  grammarFocusPoints: string[];
  aiFeedbackSummary?: {
    strengths: string[];
    growthAreas: string[];
    repeatedMistakesCount: number;
    naturalnessTip: string;
  };
  recommendedNextLesson?: {
    id: string;
    title: string;
    level: string;
  };
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  topic: string;
  level: CEFRLevel;
  startTime: string; // e.g., "Saturday at 7:00 PM IST"
  durationMinutes: number;
  maxParticipants: number;
  enrolledCount: number;
  format: string;
  hostName: string;
  rules: string[];
  isEnrolled: boolean;
  tags: string[];
}

export interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  totalDays: number;
  currentDay: number;
  rewardXP: number;
  badgeName: string;
  days: {
    dayNumber: number;
    title: string;
    task: string;
    suggestedMode: 'solo' | 'ai' | 'peer' | 'group';
    isCompleted: boolean;
  }[];
}

export interface UserBlock {
  blockedUserId: string;
  blockedUserName: string;
  blockedAt: string;
  reason?: string;
}

export interface UserReport {
  id: string;
  reportedUserId: string;
  reportedUserName: string;
  reporterUserId: string;
  category:
    | 'harassment'
    | 'spam'
    | 'inappropriate_behavior'
    | 'impersonation'
    | 'abusive_language'
    | 'off_topic'
    | 'unsafe_behavior'
    | 'other';
  description: string;
  sessionId?: string;
  status: 'pending' | 'under_review' | 'action_taken' | 'dismissed';
  createdAt: string;
  adminNotes?: string;
}

export interface CommunityPrivacySettings {
  practicePreference: SpeakingPracticePreference;
  isDiscoveryEnabled: boolean;
  profileVisibility: ProfileVisibility;
  allowIncomingRequests: boolean;
  allowDirectPracticeMessages: boolean;
  allowGroupRoomInvites: boolean;
  eventRemindersEnabled: boolean;
  defaultRecordingConsent: boolean;
  defaultAiAnalysisConsent: boolean;
}
