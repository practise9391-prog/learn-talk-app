// Part 19: Professional English Lab, Real-World Simulations & Career Readiness Types

export type SimulationRole =
  | 'software_developer'
  | 'engineer'
  | 'data_analyst'
  | 'product_manager'
  | 'team_lead'
  | 'engineering_manager'
  | 'consultant'
  | 'customer_support'
  | 'qa_engineer'
  | 'junior_employee'
  | 'general_professional';

export type SimulationMode =
  | 'guided'
  | 'learning'
  | 'realistic'
  | 'challenge'
  | 'assessment';

export interface SimulatedOrganization {
  id: string;
  name: string;
  industry: string;
  department: string;
  culture: string;
  communicationStyle: 'concise_async' | 'collaborative_warm' | 'formal_hierarchical';
}

export interface SimulatedProjectState {
  id: string;
  name: string;
  objective: string;
  deadline: string;
  currentSprint: string;
  team: Array<{ name: string; role: string }>;
  tasks: Array<{ id: string; title: string; status: 'completed' | 'in_progress' | 'blocked' }>;
  knownRisks: string[];
  unresolvedIssues: string[];
  clientRequests: string[];
  recordedDecisions: string[];
}

// 1. Workday Simulation ("My Professional Day")
export type WorkdayTimeSlot =
  | '9:00 AM'
  | '10:30 AM'
  | '1:00 PM'
  | '2:30 PM'
  | '3:45 PM'
  | '5:00 PM';

export type WorkdayStageType =
  | 'standup'
  | 'manager_sync'
  | 'chat_thread'
  | 'client_call'
  | 'incident_alert'
  | 'end_of_day_update';

export interface WorkdayChoiceBranch {
  id: string;
  label: string;
  summary: string;
  aiReaction: string;
  impactOnProject: string;
  consequenceLevel: 'positive' | 'neutral' | 'friction';
}

export interface WorkdayStage {
  id: string;
  timeSlot: WorkdayTimeSlot;
  stageType: WorkdayStageType;
  title: string;
  interlocutor: {
    name: string;
    role: string;
    avatar?: string;
  };
  contextPrompt: string;
  initialDialogue: string;
  choiceBranches?: WorkdayChoiceBranch[];
  guidingTips: string[];
  modelResponse: string;
  requiredElements: string[];
}

export interface WorkdayScenario {
  id: string;
  title: string;
  organization: SimulatedOrganization;
  initialProjectState: SimulatedProjectState;
  stages: WorkdayStage[];
}

// 2. Email Thread Lab
export interface EmailMessage {
  id: string;
  sender: string;
  senderEmail: string;
  recipient: string;
  timestamp: string;
  subject: string;
  body: string;
  isLearner: boolean;
}

export interface EmailThreadCase {
  id: string;
  title: string;
  category: 'status_inquiry' | 'client_concern' | 'cross_team_request' | 'executive_followup';
  scenarioDescription: string;
  participants: Array<{ name: string; role: string; email: string }>;
  initialThread: EmailMessage[];
  learnerTask: string;
  keyRequirements: string[];
  modelReply: string;
  simulatedFollowUpReply: string;
}

export interface EmailEvaluationResult {
  score: number;
  clarity: number;
  toneProfessionalism: number;
  actionableCommitments: boolean;
  addressedAllQuestions: boolean;
  feedback: string[];
  strengths: string[];
  improvements: string[];
}

// 3. Chat Thread Simulation (Slack / Teams)
export interface ChatMessage {
  id: string;
  sender: string;
  role: string;
  avatarColor: string;
  timestamp: string;
  content: string;
  isLearner?: boolean;
}

export interface ChatThreadCase {
  id: string;
  channelName: string;
  channelTopic: string;
  situation: string;
  messages: ChatMessage[];
  learnerGoal: string;
  quickReplyOptions: string[];
  recommendedBestPractice: string;
}

// 4. Meeting Series & Minutes Lab
export interface MeetingEpisode {
  id: string;
  seriesId: string;
  episodeNumber: number;
  title: string;
  objective: string;
  participants: string[];
  audioTranscript: Array<{ speaker: string; text: string }>;
  keyDecisionsMade: string[];
  actualActionItems: Array<{ owner: string; task: string; deadline: string }>;
  unresolvedQuestions: string[];
}

export interface MeetingMinutesDraft {
  summary: string;
  decisions: string[];
  actionItems: Array<{ owner: string; task: string; deadline: string }>;
  unresolvedQuestions: string[];
}

export interface MeetingMinutesEvaluation {
  score: number;
  capturedDecisionsCount: number;
  totalDecisions: number;
  capturedActionItemsCount: number;
  totalActionItems: number;
  whoWhatWhenClarityScore: number;
  feedback: string[];
}

// 5. Presentation Lab
export type PresentationRehearsalMode =
  | 'practice'
  | 'realistic'
  | 'pressure'
  | 'assessment';

export interface PresentationQACase {
  id: string;
  interviewerRole: string;
  question: string;
  questionIntent: string;
  uncertaintyHandlingTips: string[];
  modelAnswer: string;
  modelUncertaintyAnswer: string;
}

export interface PresentationLabCase {
  id: string;
  title: string;
  targetDurationMinutes: number;
  slides: Array<{
    slideNumber: number;
    title: string;
    keyBullets: string[];
    speakerNotes: string;
    modelAudioTranscript: string;
  }>;
  audienceContext: string;
  qaQuestions: PresentationQACase[];
}

// 6. Communication Decision Lab ("What Would You Say?")
export interface DecisionApproach {
  id: string;
  approachName: string;
  rationale: string;
  pros: string;
  cons: string;
  recommendedPhrasing: string;
}

export interface DecisionLabCase {
  id: string;
  situationTitle: string;
  dilemmaContext: string;
  stakeholdersInvolved: string[];
  urgency: 'low' | 'moderate' | 'high' | 'critical';
  approaches: DecisionApproach[];
  bestPracticeGuidance: string;
}

// 7. Incident & Crisis Communication Lab
export interface IncidentCase {
  id: string;
  title: string;
  severity: 'P1 - Critical Outage' | 'P2 - Major Degradation' | 'P3 - Moderate Defect';
  factsKnown: string[];
  factsUnderInvestigation: string[];
  impactSummary: string;
  currentMitigation: string;
  modelBroadcastMessage: string;
  pitfallsToAvoid: string[];
}

// 8. Business Case Lab
export interface BusinessCaseStudy {
  id: string;
  title: string;
  companyContext: string;
  symptom: string;
  dataPoints: string[];
  coreProblemQuestion: string;
  frameworkSteps: string[];
  modelRecommendationSummary: string;
}

// 9. Career Communication Readiness Assessment
export type ReadinessDimension =
  | 'speaking_fluency'
  | 'listening_comprehension'
  | 'professional_writing'
  | 'workplace_clarity'
  | 'meeting_participation'
  | 'presentation_delivery'
  | 'client_communication'
  | 'technical_explanation'
  | 'leadership_influence'
  | 'crisis_composure';

export interface ReadinessScoreRecord {
  dimension: ReadinessDimension;
  label: string;
  score: number; // 0 - 100
  evidenceCount: number;
  benchmarkTarget: number;
  summary: string;
}

export interface CareerReadinessAssessment {
  id: string;
  dateTaken: string;
  overallScore: number;
  dimensionScores: ReadinessScoreRecord[];
  topStrengths: string[];
  priorityImprovements: string[];
  recommendedWeeklyPlan: string[];
}
