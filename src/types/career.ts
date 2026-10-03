// Part 17: Complete Career English, Professional Communication, Interviews & Job Readiness Types
import { CEFRLevel } from './index';

export type CareerRoleCategory =
  | 'software_developer'
  | 'frontend_developer'
  | 'backend_developer'
  | 'data_analyst'
  | 'product_manager'
  | 'qa_engineer'
  | 'student_fresher'
  | 'business_analyst'
  | 'customer_success'
  | 'general_professional';

export type InterviewType = 'hr' | 'behavioral' | 'technical' | 'project' | 'mock_full';

export type InterviewDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type IntroDuration = '15s' | '30s' | '60s' | '2min' | '5min';

export type CandidateArchetype = 'student' | 'technical' | 'non_technical' | 'experienced' | 'career_switcher';

export type ExplanationLevel = 1 | 2 | 3 | 4 | 5; // Child, Beginner, College Student, Technical Interviewer, Principal Engineer

export interface ProfessionalIntroTemplate {
  id: string;
  duration: IntroDuration;
  archetype: CandidateArchetype;
  title: string;
  targetSeconds: number;
  structureSteps: string[];
  modelScript: string;
  tips: string[];
}

export interface TellMeAboutYourselfGuide {
  id: string;
  archetype: CandidateArchetype;
  label: string;
  interviewerIntent: string;
  whatToInclude: string[];
  whatToAvoid: string[];
  recommendedStructure: string;
  modelAnswer: string;
  weakAnswerExample: string;
  weaknessExplanation: string;
}

export interface ResumeBulletRefinement {
  id: string;
  originalDraft: string;
  detectedActionVerb?: string;
  missingDimensions: ('technology' | 'responsibility' | 'problem' | 'result')[];
  versions: {
    simple: string;
    professional: string;
    achievementFocused: string;
    technical: string;
  };
}

export interface ProjectExplanationProfile {
  id: string;
  projectName: string;
  problemSolved: string;
  targetUsers: string;
  techStack: string[];
  myKeyResponsibilities: string;
  majorChallenge: string;
  debuggingStory: string;
  outcomeResult: string;
  futureImprovements: string;
}

export interface TechnicalConceptTopic {
  id: string;
  conceptName: string; // e.g. "REST API", "Database Indexing", "Recursion", "State Management"
  category: 'web' | 'database' | 'algorithms' | 'cloud' | 'architecture';
  summary: string;
  levels: {
    level: ExplanationLevel;
    levelName: string;
    modelExplanation: string;
    keyAnalogy?: string;
  }[];
}

export interface GroupDiscussionScenario {
  id: string;
  topicTitle: string;
  category: 'technology' | 'workplace' | 'business' | 'education' | 'society';
  starterPrompt: string;
  participantCount: number;
  aiPeers: {
    name: string;
    stance: 'pro' | 'con' | 'neutral';
    openingStatement: string;
  }[];
  usefulPhrases: {
    intent: 'agree' | 'disagree' | 'interrupt_politely' | 'add_point' | 'summarize';
    phrase: string;
  }[];
}

export interface InterviewQuestionItem {
  id: string;
  category: InterviewType;
  question: string;
  intentExplanation: string;
  idealFramework: string; // e.g., "STAR (Situation, Task, Action, Result)"
  keyPointsToCover: string[];
  modelAnswer: string;
  sampleFollowUps: string[];
}

export interface MockInterviewSession {
  id: string;
  jobRole: CareerRoleCategory;
  interviewType: InterviewType;
  difficulty: InterviewDifficulty;
  totalQuestions: number;
  currentQuestionIndex: number;
  questions: InterviewQuestionItem[];
  turns: {
    questionId: string;
    question: string;
    userAnswerText: string;
    durationSeconds: number;
    audioRecorded?: boolean;
    feedback?: {
      starCoverage?: { situation: boolean; task: boolean; action: boolean; result: boolean };
      clarityScore: number;
      toneScore: number;
      grammarIssues: string[];
      betterAlternative: string;
      fillersDetected: number;
    };
  }[];
  overallReport?: {
    overallScore: number;
    communicationScore: number;
    grammarScore: number;
    relevanceScore: number;
    starMethodScore: number;
    fillerCount: number;
    topStrengths: string[];
    priorityImprovements: string[];
  };
  status: 'in_progress' | 'completed';
  createdAt: string;
}

export interface ProfessionalPhraseItem {
  id: string;
  category:
    | 'introductions'
    | 'meetings'
    | 'emails'
    | 'presentations'
    | 'interviews'
    | 'networking'
    | 'disagreement'
    | 'clarification'
    | 'negotiation';
  phrase: string;
  meaning: string;
  formality: 'polite' | 'professional' | 'executive';
  contextUsage: string;
  casualAlternative: string;
  exampleSentence: string;
  audioText: string;
}

export interface CareerPortfolioItem {
  id: string;
  itemType: 'self_intro' | 'resume_bullet' | 'project_summary' | 'interview_answer' | 'cover_letter';
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  lastUpdated: string;
}
