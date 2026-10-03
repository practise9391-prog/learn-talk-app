// Part 20: Career Intelligence Context
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CareerGoalProfile,
  CareerSkillGapItem,
  CareerRoadmapStage,
  JobDescriptionAnalysis,
  RecruiterSimulationCase,
  NetworkingSimulationCase,
  ApplicationTrackerItem,
  CareerDailyPlan,
  CareerTransferChallenge,
  ApplicationStatus,
} from '../types/careerIntelligence';
import {
  DEFAULT_CAREER_GOAL_PROFILE,
  CAREER_ROADMAP_STAGES,
  SAMPLE_JOB_DESCRIPTIONS,
  RECRUITER_SIMULATION_CASES,
  NETWORKING_CASES,
  CAREER_TRANSFER_CHALLENGES,
  DEFAULT_APPLICATION_TRACKER_ITEMS,
} from '../data/careerIntelligenceData';
import { CareerIntelligenceService } from '../services/careerIntelligenceService';
import { useGamification } from './GamificationContext';
import { useAdaptiveLearning } from './AdaptiveLearningContext';
import { useHistory } from './HistoryContext';

interface CareerIntelligenceContextType {
  goalProfile: CareerGoalProfile;
  updateGoalProfile: (partial: Partial<CareerGoalProfile>) => void;

  roadmapStages: CareerRoadmapStage[];
  updateStageStatus: (stageId: string, status: 'completed' | 'in_progress' | 'locked') => void;

  skillGapItems: CareerSkillGapItem[];

  analyzedJDs: JobDescriptionAnalysis[];
  analyzeJobDescription: (rawText: string, roleTitle?: string, companyName?: string) => JobDescriptionAnalysis;

  recruiterCases: RecruiterSimulationCase[];
  networkingCases: NetworkingSimulationCase[];
  transferChallenges: CareerTransferChallenge[];

  applicationTracker: ApplicationTrackerItem[];
  addApplication: (item: Omit<ApplicationTrackerItem, 'id' | 'dateAdded' | 'lastUpdated'>) => void;
  updateApplicationStatus: (id: string, newStatus: ApplicationStatus) => void;
  deleteApplication: (id: string) => void;

  dailyPlan: CareerDailyPlan;
  setPlanDuration: (minutes: number) => void;
  togglePlanTask: (taskId: string) => void;

  evaluateRecruiterScreening: (
    caseObj: RecruiterSimulationCase,
    text: string
  ) => { score: number; toneScore: number; clarityScore: number; feedback: string[]; strengths: string[] };

  evaluateNetworkingOutreach: (
    caseObj: NetworkingSimulationCase,
    text: string
  ) => { score: number; feedback: string[]; strengths: string[] };
}

const CareerIntelligenceContext = createContext<CareerIntelligenceContextType | undefined>(undefined);

export const CareerIntelligenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [goalProfile, setGoalProfile] = useState<CareerGoalProfile>(() => {
    const saved = localStorage.getItem('learntalk_career_goal_profile');
    return saved ? JSON.parse(saved) : DEFAULT_CAREER_GOAL_PROFILE;
  });

  const [roadmapStages, setRoadmapStages] = useState<CareerRoadmapStage[]>(CAREER_ROADMAP_STAGES);
  const [analyzedJDs, setAnalyzedJDs] = useState<JobDescriptionAnalysis[]>(SAMPLE_JOB_DESCRIPTIONS);
  const [recruiterCases] = useState<RecruiterSimulationCase[]>(RECRUITER_SIMULATION_CASES);
  const [networkingCases] = useState<NetworkingSimulationCase[]>(NETWORKING_CASES);
  const [transferChallenges] = useState<CareerTransferChallenge[]>(CAREER_TRANSFER_CHALLENGES);
  const [applicationTracker, setApplicationTracker] = useState<ApplicationTrackerItem[]>(() => {
    const saved = localStorage.getItem('learntalk_application_tracker');
    return saved ? JSON.parse(saved) : DEFAULT_APPLICATION_TRACKER_ITEMS;
  });

  const [dailyPlan, setDailyPlan] = useState<CareerDailyPlan>(() =>
    CareerIntelligenceService.generateDailyPlan(30)
  );

  const [skillGapItems, setSkillGapItems] = useState<CareerSkillGapItem[]>(() =>
    CareerIntelligenceService.calculateSkillGaps(goalProfile.targetRole, {
      speaking: 84,
      writing: 81,
      interview: 79,
      tech: 85,
    })
  );

  // Integrations
  const { awardXP } = useGamification();
  const { recordEvidence } = useAdaptiveLearning();
  const { logActivity } = useHistory();

  useEffect(() => {
    localStorage.setItem('learntalk_career_goal_profile', JSON.stringify(goalProfile));
    setSkillGapItems(
      CareerIntelligenceService.calculateSkillGaps(goalProfile.targetRole, {
        speaking: 84,
        writing: 81,
        interview: 79,
        tech: 85,
      })
    );
  }, [goalProfile]);

  useEffect(() => {
    localStorage.setItem('learntalk_application_tracker', JSON.stringify(applicationTracker));
  }, [applicationTracker]);

  const updateGoalProfile = (partial: Partial<CareerGoalProfile>) => {
    setGoalProfile((prev) => ({
      ...prev,
      ...partial,
      lastUpdated: new Date().toISOString(),
    }));
  };

  const updateStageStatus = (stageId: string, status: 'completed' | 'in_progress' | 'locked') => {
    setRoadmapStages((prev) =>
      prev.map((s) => (s.id === stageId ? { ...s, status } : s))
    );
  };

  const analyzeJobDescription = (
    rawText: string,
    roleTitle = 'Software Engineer',
    companyName = 'Target Company'
  ): JobDescriptionAnalysis => {
    const analysis = CareerIntelligenceService.parseJobDescription(rawText, roleTitle, companyName);
    setAnalyzedJDs((prev) => [analysis, ...prev]);

    awardXP('roleplay', analysis.id, 'job_description_analysis', 35, 120);
    recordEvidence({
      sourceType: 'roleplay',
      sourceTitle: `Job Description Analyzed: ${analysis.title}`,
      targetSkill: 'professional_communication',
      accuracyScore: 88,
      difficulty: 'normal',
      hintsUsedCount: 0,
      contextType: 'dialogue',
    });

    logActivity({
      userId: 'current-user',
      activityType: 'reading',
      title: `Job Description Lab: ${analysis.title}`,
      subtitle: `${companyName} — Keyword & requirement extraction`,
      timestamp: new Date().toISOString(),
      durationSeconds: 120,
      skill: 'reading',
      score: 88,
      hasRecording: false,
      hasTranscript: true,
      hasFeedback: true,
      saved: true,
      correctionsCount: 0,
    });

    return analysis;
  };

  const addApplication = (item: Omit<ApplicationTrackerItem, 'id' | 'dateAdded' | 'lastUpdated'>) => {
    const newItem: ApplicationTrackerItem = {
      ...item,
      id: `app_${Date.now()}`,
      dateAdded: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    setApplicationTracker((prev) => [newItem, ...prev]);
  };

  const updateApplicationStatus = (id: string, newStatus: ApplicationStatus) => {
    setApplicationTracker((prev) =>
      prev.map((app) =>
        app.id === id
          ? {
              ...app,
              status: newStatus,
              lastUpdated: new Date().toISOString().split('T')[0],
            }
          : app
      )
    );
  };

  const deleteApplication = (id: string) => {
    setApplicationTracker((prev) => prev.filter((app) => app.id !== id));
  };

  const setPlanDuration = (minutes: number) => {
    setDailyPlan(CareerIntelligenceService.generateDailyPlan(minutes));
  };

  const togglePlanTask = (taskId: string) => {
    setDailyPlan((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
    }));
  };

  const evaluateRecruiterScreening = (caseObj: RecruiterSimulationCase, text: string) => {
    const res = CareerIntelligenceService.evaluateRecruiterResponse(caseObj, text);

    awardXP('roleplay', caseObj.id, 'recruiter_screening_call', 45, 180);
    recordEvidence({
      sourceType: 'roleplay',
      sourceTitle: `Recruiter Screen: ${caseObj.title}`,
      targetSkill: 'professional_communication',
      accuracyScore: res.score,
      difficulty: 'normal',
      hintsUsedCount: 0,
      contextType: 'spontaneous_speaking',
    });

    logActivity({
      userId: 'current-user',
      activityType: 'speaking',
      title: `Recruiter Screen: ${caseObj.recruiterName}`,
      subtitle: `Score: ${res.score}% — Salary & Timeline communication`,
      timestamp: new Date().toISOString(),
      durationSeconds: 180,
      skill: 'speaking',
      score: res.score,
      hasRecording: false,
      hasTranscript: true,
      hasFeedback: true,
      saved: false,
      correctionsCount: res.feedback.length,
    });

    return res;
  };

  const evaluateNetworkingOutreach = (caseObj: NetworkingSimulationCase, text: string) => {
    const res = CareerIntelligenceService.evaluateNetworkingMessage(caseObj, text);

    awardXP('roleplay', caseObj.id, 'networking_outreach', 40, 150);
    recordEvidence({
      sourceType: 'roleplay',
      sourceTitle: `Networking Outreach: ${caseObj.title}`,
      targetSkill: 'professional_communication',
      accuracyScore: res.score,
      difficulty: 'normal',
      hintsUsedCount: 0,
      contextType: 'dialogue',
    });

    logActivity({
      userId: 'current-user',
      activityType: 'writing',
      title: `Networking Outreach: ${caseObj.persona.name}`,
      subtitle: `Score: ${res.score}% — 15-min chat message`,
      timestamp: new Date().toISOString(),
      durationSeconds: 150,
      skill: 'writing',
      score: res.score,
      hasRecording: false,
      hasTranscript: true,
      hasFeedback: true,
      saved: false,
      correctionsCount: res.feedback.length,
    });

    return res;
  };

  return (
    <CareerIntelligenceContext.Provider
      value={{
        goalProfile,
        updateGoalProfile,
        roadmapStages,
        updateStageStatus,
        skillGapItems,
        analyzedJDs,
        analyzeJobDescription,
        recruiterCases,
        networkingCases,
        transferChallenges,
        applicationTracker,
        addApplication,
        updateApplicationStatus,
        deleteApplication,
        dailyPlan,
        setPlanDuration,
        togglePlanTask,
        evaluateRecruiterScreening,
        evaluateNetworkingOutreach,
      }}
    >
      {children}
    </CareerIntelligenceContext.Provider>
  );
};

export const useCareerIntelligence = () => {
  const context = useContext(CareerIntelligenceContext);
  if (!context) {
    throw new Error('useCareerIntelligence must be used within a CareerIntelligenceProvider');
  }
  return context;
};
