// Part 21: Career Growth, Workplace Mastery & Lifelong Professional Communication Types

export type WorkplaceExperienceLevel =
  | 'student'
  | 'job_seeker'
  | 'new_hire'
  | 'team_member'
  | 'experienced'
  | 'senior'
  | 'team_lead'
  | 'manager'
  | 'executive';

export type TeamWorkMode = 'sync_heavy' | 'async_heavy' | 'balanced';
export type TeamStructureType = 'co_located' | 'remote' | 'hybrid' | 'cross_functional';

export interface WorkplaceProfile {
  id: string;
  currentRole: string;
  industry: string;
  experienceLevel: WorkplaceExperienceLevel;
  teamType: TeamStructureType;
  workMode: TeamWorkMode;
  communicationFrequency: 'daily_syncs' | 'mixed' | 'mostly_written';
  managerCommunicationLevel: 'needs_guidance' | 'independent' | 'strategic_partner';
  clientCommunicationLevel: 'none' | 'occasional' | 'frequent_critical';
  leadershipLevel: 'individual_contributor' | 'mentoring' | 'team_lead' | 'org_leader';
  technicalCommunicationLevel: 'beginner' | 'intermediate' | 'advanced_specialist';
  presentationFrequency: 'rare' | 'monthly' | 'weekly';
  meetingFrequency: 'low' | 'moderate' | 'high';
  professionalGoals: string[];
}

// 1. New Employee Path
export type OnboardingPhase = 'first_day' | 'first_week' | 'first_month';

export interface OnboardingScenario {
  id: string;
  phase: OnboardingPhase;
  title: string;
  scenarioContext: string;
  interlocutor: {
    name: string;
    role: string;
    avatar?: string;
  };
  promptMessage: string;
  audienceType: 'team' | 'manager' | 'client' | 'cross_functional' | 'project';
  recommendedStructure: string[];
  keySamplePhrases: string[];
  hints: string[];
}

// 2. Asking for Help (4-part framework)
export interface AskingForHelpScenario {
  id: string;
  title: string;
  targetPerson: 'teammate' | 'senior' | 'manager' | 'technical_expert' | 'client';
  problemContext: string;
  whatTriedContext: string;
  missingInformation: string;
  modelAnswer: string;
}

// 3. Task Understanding Simulation
export interface TaskUnderstandingCase {
  id: string;
  managerName: string;
  audioPromptText: string;
  taskTitle: string;
  correctDetails: {
    coreDeliverable: string;
    deadline: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    keyDependencies: string[];
  };
  sampleConfirmationPhrasing: string;
}

// 4. Daily Standup Practice
export interface StandupDrill {
  id: string;
  roleContext: string;
  sprintGoal: string;
  yesterdayActivities: string[];
  todayPlan: string[];
  blockerIssue?: string;
  isConciseFocus: boolean;
  modelDelivery: string;
}

// 5. Project Status Lab (Green / Yellow / Red)
export type ProjectHealthStatus = 'green' | 'yellow' | 'red';

export interface ProjectStatusCase {
  id: string;
  projectName: string;
  health: ProjectHealthStatus;
  progressSummary: string;
  risksIdentified: string[];
  dependencies: string[];
  delays: string[];
  recommendedNextSteps: string[];
  requiredSupport: string;
  modelStatusReport: string;
}

// 6. Deadline & Priority Communication
export interface DeadlineCommunicationCase {
  id: string;
  taskTitle: string;
  originalDeadline: string;
  delayReason: string;
  impactAssessment: string;
  realisticNewDeadline: string;
  mitigationActions: string[];
  modelMessage: string;
}

// 7. Manager 1:1 Meeting Simulation
export type OneOnOneTopic =
  | 'progress_priorities'
  | 'workload_burnout'
  | 'career_growth'
  | 'feedback_seeking'
  | 'addressing_blocker'
  | 'promotion_readiness';

export interface OneOnOneSession {
  id: string;
  managerName: string;
  managerStyle: 'supportive' | 'direct_results' | 'analytical';
  mode: 'manager_led' | 'employee_led';
  topic: OneOnOneTopic;
  discussionPrompts: string[];
  talkingPointsGuide: string[];
  modelDialogue: Array<{ speaker: 'manager' | 'learner'; text: string }>;
}

// 8. Feedback Lab (Receiving & Giving)
export interface FeedbackCase {
  id: string;
  type: 'receiving' | 'giving';
  recipientOrGiver: string;
  feedbackFlavor: 'positive' | 'corrective' | 'mixed' | 'vague';
  situation: string;
  feedbackText: string;
  guidelines: string[];
  modelResponse: string;
}

// 9. Professional Disagreement & Conflict
export interface DisagreementConflictCase {
  id: string;
  isConflict: boolean;
  topicTitle: string;
  counterpartRole: string;
  counterpartStance: string;
  rootIssue: string;
  recommendedSteps: {
    acknowledge: string;
    factsAndEvidence: string;
    impactExplanation: string;
    collaborativeAlternative: string;
    alignmentAction: string;
  };
  sampleDialogue: string;
}

// 10. Escalation & Incident Communication
export interface IncidentCommunicationCase {
  id: string;
  incidentTitle: string;
  severity: 'sev1_critical' | 'sev2_major' | 'sev3_minor';
  rootCauseSummary: string;
  audienceBriefs: {
    team: string;
    manager: string;
    customer: string;
    executive: string;
  };
}

// 11. Customer Communication & Complaint
export interface CustomerSimulationCase {
  id: string;
  customerName: string;
  companyName: string;
  customerStyle: 'confused' | 'frustrated' | 'impatient' | 'technical' | 'unclear';
  complaintOrRequest: string;
  underlyingNeed: string;
  handlingPhases: string[];
  modelResponse: string;
}

// 12. Bidirectional Technical Communication
export interface BidiTechCase {
  id: string;
  direction: 'tech_to_non_tech' | 'business_to_tech';
  title: string;
  rawInput: string;
  variants: {
    technical: string;
    professional: string;
    businessOutcome: string;
    simpleAnalogy: string;
  };
}

// 13. Meeting Mastery, Facilitation & Summary
export interface MeetingScenarioCase {
  id: string;
  title: string;
  role: 'attendee' | 'facilitator';
  agendaItems: string[];
  interruptionOrDerailment?: string;
  politeInterventionPhrases: string[];
  modelSummaryNote: {
    summary: string;
    decisions: string[];
    actionItems: Array<{ task: string; owner: string; deadline: string }>;
  };
}

// 14. Async Communication Decision Matrix
export type CommChannelType = 'chat' | 'email' | 'meeting' | 'document';

export interface AsyncCommMatrixItem {
  id: string;
  scenario: string;
  recommendedChannel: CommChannelType;
  rationale: string;
  templateFormat: string;
  exampleDraft: string;
}

// 15. Response Pressure & Brain Freeze Recovery
export type ResponsePressureSpeed = 'relaxed' | 'normal' | 'rapid' | 'challenge';

export interface BrainFreezeRecoveryPhrase {
  id: string;
  category: 'organize' | 'rephrase' | 'clarify' | 'give_example' | 'restart';
  phrase: string;
  whenToUse: string;
}

// 16. Professional Storytelling (CARL: Context, Action, Result, Learning)
export interface ProfessionalStoryItem {
  id: string;
  title: string;
  category: 'achievement' | 'challenge_overcome' | 'failure_learning' | 'leadership' | 'customer_success';
  context: string;
  challenge: string;
  actionTaken: string;
  resultMetric: string;
  keyLearning: string;
}

// 17. Leadership, Delegation & Change
export interface DelegationCase {
  id: string;
  taskTitle: string;
  assigneeName: string;
  assigneeSeniority: 'junior' | 'mid_level' | 'peer';
  objective: string;
  expectedOutcome: string;
  hardDeadline: string;
  guardrails: string[];
  modelDelegationScript: string;
}

// 18. Executive Communication & Rapid Q&A
export interface ExecutiveBriefingCase {
  id: string;
  executiveTitle: string;
  coreSituation: string;
  keyPointBLUF: string;
  businessImpact: string;
  recommendation: string;
  decisionNeeded: string;
  rapidQuestions: Array<{ question: string; idealAnswer: string }>;
}

// 19. Multi-Day Workplace Simulation (Context Memory)
export interface MultiDaySimState {
  currentDay: number; // 1 to 5 (Week 1) or up to 20 (Month 1)
  simulatedOrgName: string;
  roleTitle: string;
  teamMembers: Array<{ name: string; role: string; relationshipScore: number }>;
  activeSprintTasks: Array<{ id: string; title: string; status: 'todo' | 'in_progress' | 'done' | 'delayed' }>;
  unresolvedBlockers: string[];
  recordedDecisions: string[];
  completedEvents: string[];
  managerTrustLevel: number; // 0 to 100
  recentFeedback: string[];
}

// 20. Career Growth Tracks
export type CareerGrowthTrackId =
  | 'track_a_new_employee'
  | 'track_b_pro_comm'
  | 'track_c_tech_comm'
  | 'track_d_client_comm'
  | 'track_e_leadership'
  | 'track_f_management'
  | 'track_g_executive_comm'
  | 'track_h_business_comm';

export interface CareerGrowthTrack {
  id: CareerGrowthTrackId;
  title: string;
  subtitle: string;
  targetSeniority: string;
  keySkills: string[];
  recommendedModules: string[];
  progressPercent: number;
}

// 21. Workplace Readiness Evidence (12 dimensions, non-simplistic score)
export interface WorkplaceReadinessDimension {
  id: string;
  name: string;
  category: 'core' | 'collaboration' | 'advanced' | 'leadership';
  evidenceCount: number;
  proficiencyLevel: 'emerging' | 'competent' | 'fluent' | 'master';
  strengthSummary: string;
  nextFocusArea: string;
}
