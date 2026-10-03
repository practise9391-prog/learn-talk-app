// Part 18: Advanced Workplace, Business, Leadership & Professional Communication Mastery Types

export type WorkplaceRoadmapLevelId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface WorkplaceRoadmapLevel {
  level: WorkplaceRoadmapLevelId;
  title: string;
  focusArea: string;
  consequences: string;
  audienceScope: string;
  ambiguityLevel: 'low' | 'moderate' | 'high' | 'strategic';
  timePressure: 'flexible' | 'moderate' | 'high' | 'immediate';
  coreSkills: string[];
}

export type AudienceType =
  | 'teammate'
  | 'manager'
  | 'customer'
  | 'executive'
  | 'technical_expert';

export interface AudienceProfile {
  roleTitle: string;
  priorityFocus: string;
  toneRecommendation: string;
  modelPhrasing: string;
  keyPitfall: string;
}

export interface AudienceAwareScenario {
  id: string;
  situationTitle: string;
  situationContext: string;
  coreFacts: string[];
  audienceProfiles: Record<AudienceType, AudienceProfile>;
}

export type ManagerCommunicationTopic =
  | 'progress_update'
  | 'delay_reporting'
  | 'priority_conflict'
  | 'resource_request'
  | 'workload_management'
  | 'mistake_admission'
  | 'seeking_feedback'
  | 'career_growth';

export interface ManagerScenario {
  id: string;
  topic: ManagerCommunicationTopic;
  title: string;
  context: string;
  managerPersona: {
    name: string;
    role: string;
    style: 'direct_results' | 'supportive_coach' | 'analytical_skeptic';
  };
  managerOpeningPrompt: string;
  keyPrinciples: string[];
  recommendedFramework: string;
  modelResponse: string;
}

export type ConflictCategory =
  | 'teammate_disagreement'
  | 'deadline_conflict'
  | 'responsibility_confusion'
  | 'technical_disagreement'
  | 'resource_conflict'
  | 'client_friction';

export interface ConflictScenario {
  id: string;
  category: ConflictCategory;
  title: string;
  partiesInvolved: string[];
  underlyingTension: string;
  frameworkSteps: {
    understand: string;
    clarify: string;
    explain: string;
    findCommonGround: string;
    proposeSolution: string;
    confirmNextStep: string;
  };
  disagreementStyles: {
    direct: string;
    diplomatic: string;
    technical: string;
  };
}

export interface FeedbackTrainingCase {
  id: string;
  direction: 'giving' | 'receiving';
  situation: string;
  flawedDraft: string;
  flawsIdentified: string[];
  professionalModel: string;
  actionableCriteria: string[];
}

export type ExecutiveDuration = '15s' | '30s' | '1m' | '3m';

export interface ExecutiveBriefingCase {
  id: string;
  duration: ExecutiveDuration;
  topicTitle: string;
  verboseContext: string;
  keyTakeaway: string;
  quantifiedImpact: string;
  recommendedDecision: string;
  modelBriefing: string;
}

export type ClientCommunicationTopic =
  | 'requirement_gathering'
  | 'product_demo'
  | 'handling_tough_questions'
  | 'expectation_reset'
  | 'escalation';

export interface ClientCommunicationCase {
  id: string;
  topic: ClientCommunicationTopic;
  title: string;
  clientPrompt: string;
  clientPersona: {
    name: string;
    company: string;
    temperament: 'demanding' | 'inquisitive' | 'cautious';
  };
  fiveStepHandling: {
    acknowledge: string;
    clarify: string;
    explain: string;
    setExpectation: string;
    offerNextStep: string;
  };
  prohibitedPractices: string[];
}

export interface TechBusinessTranslationCase {
  id: string;
  direction: 'tech_to_business' | 'business_to_tech';
  scenarioTitle: string;
  sourceStatement: string;
  developerVersion: string;
  managerVersion: string;
  customerVersion: string;
  executiveVersion: string;
  jargonToAvoid: string[];
}

export interface NegotiationSimulationCase {
  id: string;
  topic: 'salary' | 'project_scope' | 'deadlines' | 'resource_allocation' | 'vendor_contract';
  title: string;
  backgroundContext: string;
  counterpartGoal: string;
  learnerObjective: string;
  stages: {
    stage: 'preparation' | 'opening' | 'inquiry' | 'proposal' | 'counterproposal' | 'compromise' | 'agreement';
    label: string;
    guidingQuestions: string[];
    modelPhrases: string[];
  }[];
}

export interface MeetingFacilitationCase {
  id: string;
  meetingTitle: string;
  agenda: string[];
  difficultMoment:
    | 'quiet_participant'
    | 'derailed_topic'
    | 'aggressive_interruption'
    | 'running_out_of_time';
  contextDescription: string;
  facilitatorInterventionPhrases: string[];
  modelActionPlan: string;
}

export interface ThinkOnYourFeetDrill {
  id: string;
  unexpectedQuestion: string;
  workplaceContext: string;
  brainFreezeSupport: {
    firstPhrase: string;
    keywords: string[];
    structureAnchor: string;
    modelAnswer: string;
  };
  targetSeconds: number;
}
