// Part 20: Career Intelligence, Job Search English & Complete Employment Journey Types
import { CareerRoleCategory } from './career';

export type ExperienceLevel =
  | 'fresher_student'
  | 'junior_1_2_years'
  | 'mid_3_5_years'
  | 'senior_6_plus_years'
  | 'lead_manager';

export type CompanyTypePreference =
  | 'fast_paced_startup'
  | 'global_enterprise'
  | 'tech_product_company'
  | 'consulting_services'
  | 'remote_international';

export interface CareerGoalProfile {
  targetRole: CareerRoleCategory;
  customRoleTitle?: string;
  industry: string;
  experienceLevel: ExperienceLevel;
  educationLevel: string;
  targetCompanyType: CompanyTypePreference;
  targetCountry: string;
  communicationGoal: string;
  prioritySkills: string[];
  lastUpdated: string;
}

export interface RoleCommunicationRequirement {
  skillName: string;
  importance: 'essential' | 'high' | 'moderate';
  benchmarkScore: number;
  description: string;
}

export interface RoleCareerRequirement {
  milestoneName: string;
  deliverableType: 'resume' | 'cover_letter' | 'recruiter_call' | 'interview' | 'presentation' | 'workplace';
  description: string;
}

export interface RoleRequirementMap {
  role: CareerRoleCategory;
  title: string;
  communicationRequirements: RoleCommunicationRequirement[];
  careerRequirements: RoleCareerRequirement[];
  typicalInterviewQuestions: string[];
}

export interface CareerSkillGapItem {
  skillName: string;
  status: 'weak' | 'developing' | 'strong' | 'transfer_ready';
  currentScore: number;
  benchmarkScore: number;
  evidenceCount: number;
  recommendation: string;
}

export type RoadmapStageStatus = 'completed' | 'in_progress' | 'locked';

export interface CareerRoadmapStage {
  stageNumber: number;
  id: string;
  title: string;
  category: 'foundation' | 'application' | 'recruiter' | 'interview' | 'workplace';
  status: RoadmapStageStatus;
  description: string;
  actionLabel: string;
  prerequisites: string[];
}

export interface JobDescriptionAnalysis {
  id: string;
  title: string;
  companyName: string;
  rawText: string;
  extractedRole: string;
  keyResponsibilities: string[];
  requiredSkills: string[];
  preferredQualifications: string[];
  repeatedVocabulary: Array<{ word: string; meaning: string; contextSentence: string }>;
  interviewQuestions: string[];
  suggestedActionVerbs: string[];
}

export interface RecruiterSimulationTurn {
  id: string;
  speaker: 'recruiter' | 'candidate';
  text: string;
  timestamp: string;
}

export interface RecruiterSimulationCase {
  id: string;
  recruiterName: string;
  recruiterCompany: string;
  scenarioType:
    | 'initial_screening'
    | 'salary_expectations'
    | 'notice_period_availability'
    | 'reschedule_request'
    | 'next_round_update';
  title: string;
  contextPrompt: string;
  recruiterOpeningMessage: string;
  guidingTips: string[];
  modelResponse: string;
  keyEvaluationCriteria: string[];
}

export interface NetworkingSimulationCase {
  id: string;
  title: string;
  contextType: 'conference' | 'career_fair' | 'alumni_outreach' | 'linkedin_inmail';
  persona: { name: string; title: string; organization: string };
  situationPrompt: string;
  modelMessage: string;
  recommendedStructure: string[];
}

export type ApplicationStatus =
  | 'saved'
  | 'applied'
  | 'recruiter_contact'
  | 'interview_scheduled'
  | 'interview_completed'
  | 'follow_up'
  | 'offer'
  | 'closed';

export interface ApplicationTrackerItem {
  id: string;
  companyName: string;
  jobTitle: string;
  location: string;
  status: ApplicationStatus;
  dateAdded: string;
  lastUpdated: string;
  interviewDate?: string;
  linkedPracticeAction: {
    label: string;
    actionType: 'resume' | 'recruiter' | 'interview' | 'follow_up';
  };
}

export interface CareerDailyPlanTask {
  id: string;
  durationMinutes: number;
  category: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface CareerDailyPlan {
  totalMinutes: number;
  tasks: CareerDailyPlanTask[];
}

export interface CareerTransferChallenge {
  id: string;
  topicTitle: string;
  coreConcept: string;
  audiences: Array<{
    targetAudience: 'technical_interviewer' | 'business_manager' | 'enterprise_client' | 'junior_mentee';
    audienceLabel: string;
    focusNeed: string;
    modelExplanation: string;
  }>;
}
