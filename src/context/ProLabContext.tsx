// Part 19: Professional English Lab Context
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SimulationRole,
  SimulationMode,
  SimulatedOrganization,
  SimulatedProjectState,
  WorkdayScenario,
  EmailThreadCase,
  EmailEvaluationResult,
  ChatThreadCase,
  MeetingEpisode,
  MeetingMinutesDraft,
  MeetingMinutesEvaluation,
  PresentationLabCase,
  DecisionLabCase,
  DecisionApproach,
  IncidentCase,
  BusinessCaseStudy,
  ReadinessScoreRecord,
} from '../types/proLab';
import {
  SIMULATED_ORGANIZATIONS,
  INITIAL_PROJECT_STATE,
  WORKDAY_SCENARIOS,
  EMAIL_THREAD_CASES,
  CHAT_THREAD_CASES,
  MEETING_EPISODES,
  PRESENTATION_LAB_CASES,
  DECISION_LAB_CASES,
  INCIDENT_CASES,
  BUSINESS_CASE_STUDIES,
  INITIAL_READINESS_SCORES,
} from '../data/proLabData';
import {
  ProLabService,
  StageEvaluationResult,
  IncidentEvaluationResult,
} from '../services/proLabService';
import { useGamification } from './GamificationContext';
import { useAdaptiveLearning } from './AdaptiveLearningContext';
import { useHistory } from './HistoryContext';

interface ProLabContextType {
  activeRole: SimulationRole;
  setActiveRole: (role: SimulationRole) => void;
  simulationMode: SimulationMode;
  setSimulationMode: (mode: SimulationMode) => void;

  activeOrg: SimulatedOrganization;
  setActiveOrg: (org: SimulatedOrganization) => void;
  projectState: SimulatedProjectState;

  // Workday Simulation
  activeWorkday: WorkdayScenario;
  currentStageIndex: number;
  stageAnswers: Record<string, string>;
  stageBranchDecisions: Record<string, string>;
  advanceWorkdayStage: (stageId: string, answer: string, chosenBranchId?: string) => void;
  resetWorkday: () => void;

  // Lab Cases
  emailCases: EmailThreadCase[];
  chatCases: ChatThreadCase[];
  meetingEpisodes: MeetingEpisode[];
  presentationCases: PresentationLabCase[];
  decisionCases: DecisionLabCase[];
  incidentCases: IncidentCase[];
  businessCases: BusinessCaseStudy[];
  readinessScores: ReadinessScoreRecord[];

  completedLabCount: number;

  // Evaluation methods
  evaluateWorkdayStage: (stageId: string, text: string) => StageEvaluationResult;
  evaluateEmailReply: (caseId: string, text: string) => EmailEvaluationResult;
  evaluateMeetingMinutes: (meetingId: string, draft: MeetingMinutesDraft) => MeetingMinutesEvaluation;
  evaluateIncident: (incidentId: string, text: string) => IncidentEvaluationResult;
  evaluateDecision: (caseId: string, approach: DecisionApproach, text: string) => { score: number; alignment: string; feedback: string[] };
}

const ProLabContext = createContext<ProLabContextType | undefined>(undefined);

export const ProLabProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRole] = useState<SimulationRole>('software_developer');
  const [simulationMode, setSimulationMode] = useState<SimulationMode>('realistic');
  const [activeOrg, setActiveOrg] = useState<SimulatedOrganization>(SIMULATED_ORGANIZATIONS[0]);
  const [projectState, setProjectState] = useState<SimulatedProjectState>(INITIAL_PROJECT_STATE);

  // Workday Simulation State
  const [activeWorkday] = useState<WorkdayScenario>(WORKDAY_SCENARIOS[0]);
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [stageAnswers, setStageAnswers] = useState<Record<string, string>>({});
  const [stageBranchDecisions, setStageBranchDecisions] = useState<Record<string, string>>({});

  // Labs data
  const [emailCases] = useState<EmailThreadCase[]>(EMAIL_THREAD_CASES);
  const [chatCases] = useState<ChatThreadCase[]>(CHAT_THREAD_CASES);
  const [meetingEpisodes] = useState<MeetingEpisode[]>(MEETING_EPISODES);
  const [presentationCases] = useState<PresentationLabCase[]>(PRESENTATION_LAB_CASES);
  const [decisionCases] = useState<DecisionLabCase[]>(DECISION_LAB_CASES);
  const [incidentCases] = useState<IncidentCase[]>(INCIDENT_CASES);
  const [businessCases] = useState<BusinessCaseStudy[]>(BUSINESS_CASE_STUDIES);
  const [readinessScores, setReadinessScores] = useState<ReadinessScoreRecord[]>(INITIAL_READINESS_SCORES);
  const [completedLabCount, setCompletedLabCount] = useState<number>(14);

  // Context integrations
  const { awardXP } = useGamification();
  const { recordEvidence } = useAdaptiveLearning();
  const { logActivity } = useHistory();

  const advanceWorkdayStage = (stageId: string, answer: string, chosenBranchId?: string) => {
    setStageAnswers((prev) => ({ ...prev, [stageId]: answer }));
    if (chosenBranchId) {
      setStageBranchDecisions((prev) => ({ ...prev, [stageId]: chosenBranchId }));

      // Update project memory if branch affects project
      const stageObj = activeWorkday.stages.find((s) => s.id === stageId);
      const branch = stageObj?.choiceBranches?.find((b) => b.id === chosenBranchId);
      if (branch) {
        setProjectState((prev) => ({
          ...prev,
          recordedDecisions: [...prev.recordedDecisions, branch.summary],
        }));
      }
    }

    if (currentStageIndex < activeWorkday.stages.length - 1) {
      setCurrentStageIndex((prev) => prev + 1);
    }

    // Award XP and log activity
    awardXP('roleplay', stageId, 'workday_simulation_stage', 50, 180);
    recordEvidence({
      sourceType: 'roleplay',
      sourceTitle: `Workday Simulation: ${stageId}`,
      targetSkill: 'professional_communication',
      accuracyScore: 88,
      difficulty: 'normal',
      hintsUsedCount: 0,
      contextType: 'spontaneous_speaking',
    });
    setCompletedLabCount((prev) => prev + 1);

    logActivity({
      userId: 'current-user',
      activityType: 'roleplay',
      title: `Workday Simulation: ${stageId}`,
      subtitle: `${activeOrg.name} — Stage completed`,
      timestamp: new Date().toISOString(),
      durationSeconds: 180,
      skill: 'speaking',
      score: 88,
      hasRecording: false,
      hasTranscript: true,
      hasFeedback: true,
      saved: false,
      correctionsCount: 0,
    });
  };

  const resetWorkday = () => {
    setCurrentStageIndex(0);
    setStageAnswers({});
    setStageBranchDecisions({});
    setProjectState(INITIAL_PROJECT_STATE);
  };

  const evaluateWorkdayStage = (stageId: string, text: string): StageEvaluationResult => {
    const stage = activeWorkday.stages.find((s) => s.id === stageId) || activeWorkday.stages[0];
    const result = ProLabService.evaluateWorkdayStage(stage, text);
    setReadinessScores((prev) =>
      ProLabService.updateReadinessScores(prev, 'workplace_clarity', result.score)
    );
    return result;
  };

  const evaluateEmailReply = (caseId: string, text: string): EmailEvaluationResult => {
    const caseStudy = emailCases.find((c) => c.id === caseId) || emailCases[0];
    const result = ProLabService.evaluateEmailReply(caseStudy, text);

    awardXP('roleplay', caseId, 'email_thread_lab', 40, 240);
    recordEvidence({
      sourceType: 'roleplay',
      sourceTitle: `Email Lab: ${caseStudy.title}`,
      targetSkill: 'professional_communication',
      accuracyScore: result.score,
      difficulty: 'normal',
      hintsUsedCount: 0,
      contextType: 'dialogue',
    });
    setCompletedLabCount((prev) => prev + 1);
    setReadinessScores((prev) =>
      ProLabService.updateReadinessScores(prev, 'professional_writing', result.score)
    );

    logActivity({
      userId: 'current-user',
      activityType: 'writing',
      title: `Email Lab: ${caseStudy.title}`,
      subtitle: `Score: ${result.score}% — Thread response sent`,
      timestamp: new Date().toISOString(),
      durationSeconds: 240,
      skill: 'writing',
      score: result.score,
      hasRecording: false,
      hasTranscript: true,
      hasFeedback: true,
      saved: false,
      correctionsCount: result.improvements.length,
    });

    return result;
  };

  const evaluateMeetingMinutes = (
    meetingId: string,
    draft: MeetingMinutesDraft
  ): MeetingMinutesEvaluation => {
    const meeting = meetingEpisodes.find((m) => m.id === meetingId) || meetingEpisodes[0];
    const result = ProLabService.evaluateMeetingMinutes(meeting, draft);

    awardXP('roleplay', meetingId, 'meeting_minutes_lab', 45, 300);
    recordEvidence({
      sourceType: 'roleplay',
      sourceTitle: `Meeting Minutes: ${meeting.title}`,
      targetSkill: 'professional_communication',
      accuracyScore: result.score,
      difficulty: 'normal',
      hintsUsedCount: 0,
      contextType: 'dialogue',
    });
    setCompletedLabCount((prev) => prev + 1);
    setReadinessScores((prev) =>
      ProLabService.updateReadinessScores(prev, 'meeting_participation', result.score)
    );

    logActivity({
      userId: 'current-user',
      activityType: 'writing',
      title: `Meeting Minutes Lab: ${meeting.title}`,
      subtitle: `Score: ${result.score}% — Minutes & Action Items recorded`,
      timestamp: new Date().toISOString(),
      durationSeconds: 300,
      skill: 'writing',
      score: result.score,
      hasRecording: false,
      hasTranscript: true,
      hasFeedback: true,
      saved: false,
      correctionsCount: 0,
    });

    return result;
  };

  const evaluateIncident = (incidentId: string, text: string): IncidentEvaluationResult => {
    const incident = incidentCases.find((i) => i.id === incidentId) || incidentCases[0];
    const result = ProLabService.evaluateIncidentBroadcast(incident, text);

    awardXP('roleplay', incidentId, 'incident_communication_lab', 45, 180);
    recordEvidence({
      sourceType: 'roleplay',
      sourceTitle: `Incident Broadcast: ${incident.title}`,
      targetSkill: 'professional_communication',
      accuracyScore: result.score,
      difficulty: 'normal',
      hintsUsedCount: 0,
      contextType: 'spontaneous_speaking',
    });
    setCompletedLabCount((prev) => prev + 1);
    setReadinessScores((prev) =>
      ProLabService.updateReadinessScores(prev, 'crisis_composure', result.score)
    );

    logActivity({
      userId: 'current-user',
      activityType: 'speaking',
      title: `Incident Broadcast: ${incident.title}`,
      subtitle: `Score: ${result.score}% — Facts & Mitigation broadcast`,
      timestamp: new Date().toISOString(),
      durationSeconds: 180,
      skill: 'speaking',
      score: result.score,
      hasRecording: false,
      hasTranscript: true,
      hasFeedback: true,
      saved: false,
      correctionsCount: result.speculationFlagged ? 1 : 0,
    });

    return result;
  };

  const evaluateDecision = (
    caseId: string,
    approach: DecisionApproach,
    text: string
  ): { score: number; alignment: string; feedback: string[] } => {
    const decisionCase = decisionCases.find((d) => d.id === caseId) || decisionCases[0];
    const result = ProLabService.evaluateDecisionResponse(decisionCase, approach, text);

    awardXP('roleplay', caseId, 'decision_lab', 40, 150);
    recordEvidence({
      sourceType: 'roleplay',
      sourceTitle: `Decision Stance: ${approach.approachName}`,
      targetSkill: 'professional_communication',
      accuracyScore: result.score,
      difficulty: 'normal',
      hintsUsedCount: 0,
      contextType: 'spontaneous_speaking',
    });
    setCompletedLabCount((prev) => prev + 1);
    setReadinessScores((prev) =>
      ProLabService.updateReadinessScores(prev, 'leadership_influence', result.score)
    );

    return result;
  };

  return (
    <ProLabContext.Provider
      value={{
        activeRole,
        setActiveRole,
        simulationMode,
        setSimulationMode,
        activeOrg,
        setActiveOrg,
        projectState,
        activeWorkday,
        currentStageIndex,
        stageAnswers,
        stageBranchDecisions,
        advanceWorkdayStage,
        resetWorkday,
        emailCases,
        chatCases,
        meetingEpisodes,
        presentationCases,
        decisionCases,
        incidentCases,
        businessCases,
        readinessScores,
        completedLabCount,
        evaluateWorkdayStage,
        evaluateEmailReply,
        evaluateMeetingMinutes,
        evaluateIncident,
        evaluateDecision,
      }}
    >
      {children}
    </ProLabContext.Provider>
  );
};

export const useProLab = () => {
  const context = useContext(ProLabContext);
  if (!context) {
    throw new Error('useProLab must be used within a ProLabProvider');
  }
  return context;
};
