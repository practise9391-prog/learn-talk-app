// Part 18: Advanced Workplace Communication Context
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  WorkplaceRoadmapLevel,
  WorkplaceRoadmapLevelId,
  AudienceAwareScenario,
  AudienceType,
  ManagerScenario,
  ConflictScenario,
  FeedbackTrainingCase,
  ExecutiveBriefingCase,
  ClientCommunicationCase,
  TechBusinessTranslationCase,
  NegotiationSimulationCase,
  MeetingFacilitationCase,
  ThinkOnYourFeetDrill,
} from '../types/workplace';
import {
  WORKPLACE_ROADMAP_LEVELS,
  AUDIENCE_AWARE_SCENARIOS,
  MANAGER_SCENARIOS,
  CONFLICT_SCENARIOS,
  FEEDBACK_TRAINING_CASES,
  EXECUTIVE_BRIEFING_CASES,
  CLIENT_COMMUNICATION_CASES,
  TECH_BUSINESS_TRANSLATION_CASES,
  NEGOTIATION_CASES,
  MEETING_FACILITATION_CASES,
  THINK_ON_YOUR_FEET_DRILLS,
} from '../data/advancedWorkplaceData';
import {
  WorkplaceCommunicationService,
  AudienceEvaluationResult,
  ManagerEvaluationResult,
  ExecutiveEvaluationResult,
} from '../services/workplaceCommunicationService';
import { useGamification } from './GamificationContext';
import { useAdaptiveLearning } from './AdaptiveLearningContext';
import { useHistory } from './HistoryContext';

interface WorkplaceCommunicationContextType {
  roadmapLevels: WorkplaceRoadmapLevel[];
  activeLevel: WorkplaceRoadmapLevelId;
  audienceScenarios: AudienceAwareScenario[];
  managerScenarios: ManagerScenario[];
  conflictScenarios: ConflictScenario[];
  feedbackCases: FeedbackTrainingCase[];
  executiveCases: ExecutiveBriefingCase[];
  clientCases: ClientCommunicationCase[];
  translationCases: TechBusinessTranslationCase[];
  negotiationCases: NegotiationSimulationCase[];
  meetingCases: MeetingFacilitationCase[];
  thinkDrills: ThinkOnYourFeetDrill[];

  completedDrillCount: number;

  setActiveLevel: (level: WorkplaceRoadmapLevelId) => void;
  evaluateAudienceDraft: (
    scenarioId: string,
    audience: AudienceType,
    userText: string
  ) => AudienceEvaluationResult;
  evaluateManagerDraft: (scenarioId: string, userText: string) => ManagerEvaluationResult;
  evaluateExecutiveDraft: (caseId: string, userText: string) => ExecutiveEvaluationResult;
}

const WorkplaceCommunicationContext = createContext<
  WorkplaceCommunicationContextType | undefined
>(undefined);

export const WorkplaceCommunicationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { awardXP } = useGamification();
  const { recordEvidence } = useAdaptiveLearning();
  const { logActivity } = useHistory();

  const [activeLevel, setActiveLevelState] = useState<WorkplaceRoadmapLevelId>(() => {
    const saved = localStorage.getItem('learntalk_workplace_level');
    return saved ? (parseInt(saved, 10) as WorkplaceRoadmapLevelId) : 1;
  });

  const [completedDrillCount, setCompletedDrillCount] = useState<number>(() => {
    const saved = localStorage.getItem('learntalk_workplace_completed_count');
    return saved ? parseInt(saved, 10) : 3;
  });

  useEffect(() => {
    localStorage.setItem('learntalk_workplace_level', activeLevel.toString());
  }, [activeLevel]);

  useEffect(() => {
    localStorage.setItem('learntalk_workplace_completed_count', completedDrillCount.toString());
  }, [completedDrillCount]);

  const setActiveLevel = (level: WorkplaceRoadmapLevelId) => {
    setActiveLevelState(level);
  };

  const evaluateAudienceDraft = (
    scenarioId: string,
    audience: AudienceType,
    userText: string
  ): AudienceEvaluationResult => {
    const scenario =
      AUDIENCE_AWARE_SCENARIOS.find((s) => s.id === scenarioId) || AUDIENCE_AWARE_SCENARIOS[0];
    const result = WorkplaceCommunicationService.evaluateAudienceAdaptation(
      userText,
      scenario,
      audience
    );

    // Gamification & Adaptive Learning Record
    awardXP('speaking', scenarioId, 'audience_adaptation_drill', Math.round(result.overallScore * 0.4), 60);
    recordEvidence({
      sourceType: 'roleplay',
      sourceTitle: `Audience Drill: ${audience.toUpperCase()} - ${scenario.situationTitle}`,
      targetSkill: 'professional_communication',
      accuracyScore: result.overallScore,
      difficulty: 'normal',
      hintsUsedCount: 0,
      contextType: 'spontaneous_speaking',
    });

    logActivity({
      userId: 'current-user',
      activityType: 'roleplay',
      title: `Audience Awareness: ${audience.toUpperCase()}`,
      subtitle: scenario.situationTitle,
      timestamp: new Date().toISOString(),
      durationSeconds: 45,
      skill: 'speaking',
      score: result.overallScore,
      hasRecording: false,
      hasTranscript: true,
      hasFeedback: true,
      saved: true,
      correctionsCount: result.priorityFixes.length,
    });

    setCompletedDrillCount((prev) => prev + 1);
    return result;
  };

  const evaluateManagerDraft = (
    scenarioId: string,
    userText: string
  ): ManagerEvaluationResult => {
    const scenario =
      MANAGER_SCENARIOS.find((s) => s.id === scenarioId) || MANAGER_SCENARIOS[0];
    const result = WorkplaceCommunicationService.evaluateManagerResponse(userAnswer(userText), scenario);

    awardXP('speaking', scenarioId, 'manager_communication_drill', Math.round(result.overallScore * 0.45), 75);
    recordEvidence({
      sourceType: 'roleplay',
      sourceTitle: `Manager Sync: ${scenario.title}`,
      targetSkill: 'professional_communication',
      accuracyScore: result.overallScore,
      difficulty: 'challenging',
      hintsUsedCount: 0,
      contextType: 'spontaneous_speaking',
    });

    logActivity({
      userId: 'current-user',
      activityType: 'roleplay',
      title: `Manager Sync: ${scenario.title}`,
      subtitle: `Persona: ${scenario.managerPersona.name} (${scenario.managerPersona.role})`,
      timestamp: new Date().toISOString(),
      durationSeconds: 60,
      skill: 'speaking',
      score: result.overallScore,
      hasRecording: false,
      hasTranscript: true,
      hasFeedback: true,
      saved: true,
      correctionsCount: 0,
    });

    setCompletedDrillCount((prev) => prev + 1);
    return result;
  };

  const evaluateExecutiveDraft = (
    caseId: string,
    userText: string
  ): ExecutiveEvaluationResult => {
    const briefingCase =
      EXECUTIVE_BRIEFING_CASES.find((c) => c.id === caseId) || EXECUTIVE_BRIEFING_CASES[0];
    const result = WorkplaceCommunicationService.evaluateExecutiveBriefing(userText, briefingCase);

    awardXP('speaking', caseId, 'executive_briefing_drill', Math.round(result.overallScore * 0.5), 45);
    recordEvidence({
      sourceType: 'roleplay',
      sourceTitle: `Executive Briefing (${briefingCase.duration}): ${briefingCase.topicTitle}`,
      targetSkill: 'professional_communication',
      accuracyScore: result.overallScore,
      difficulty: 'challenging',
      hintsUsedCount: 0,
      contextType: 'spontaneous_speaking',
    });

    setCompletedDrillCount((prev) => prev + 1);
    return result;
  };

  function userAnswer(t: string): string {
    return t;
  }

  return (
    <WorkplaceCommunicationContext.Provider
      value={{
        roadmapLevels: WORKPLACE_ROADMAP_LEVELS,
        activeLevel,
        audienceScenarios: AUDIENCE_AWARE_SCENARIOS,
        managerScenarios: MANAGER_SCENARIOS,
        conflictScenarios: CONFLICT_SCENARIOS,
        feedbackCases: FEEDBACK_TRAINING_CASES,
        executiveCases: EXECUTIVE_BRIEFING_CASES,
        clientCases: CLIENT_COMMUNICATION_CASES,
        translationCases: TECH_BUSINESS_TRANSLATION_CASES,
        negotiationCases: NEGOTIATION_CASES,
        meetingCases: MEETING_FACILITATION_CASES,
        thinkDrills: THINK_ON_YOUR_FEET_DRILLS,
        completedDrillCount,
        setActiveLevel,
        evaluateAudienceDraft,
        evaluateManagerDraft,
        evaluateExecutiveDraft,
      }}
    >
      {children}
    </WorkplaceCommunicationContext.Provider>
  );
};

export const useWorkplaceCommunication = (): WorkplaceCommunicationContextType => {
  const context = useContext(WorkplaceCommunicationContext);
  if (!context) {
    throw new Error(
      'useWorkplaceCommunication must be used within a WorkplaceCommunicationProvider'
    );
  }
  return context;
};
