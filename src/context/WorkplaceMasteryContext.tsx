import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  WorkplaceProfile,
  MultiDaySimState,
  CareerGrowthTrack,
  CareerGrowthTrackId,
  WorkplaceReadinessDimension,
} from '../types/workplaceMastery';
import {
  DEFAULT_WORKPLACE_PROFILE,
  INITIAL_MULTI_DAY_SIM_STATE,
  CAREER_GROWTH_TRACKS,
  DEFAULT_WORKPLACE_READINESS_DIMENSIONS,
} from '../data/workplaceMasteryData';
import { workplaceMasteryService, EvaluationResult } from '../services/workplaceMasteryService';
import { useGamification } from './GamificationContext';
import { useAdaptiveLearning } from './AdaptiveLearningContext';
import { useHistory } from './HistoryContext';

interface WorkplaceMasteryContextType {
  profile: WorkplaceProfile;
  updateProfile: (updates: Partial<WorkplaceProfile>) => void;
  multiDaySim: MultiDaySimState;
  advanceMultiDaySim: (activityName: string) => void;
  resetMultiDaySim: () => void;
  growthTracks: CareerGrowthTrack[];
  activeTrackId: CareerGrowthTrackId;
  setActiveTrackId: (id: CareerGrowthTrackId) => void;
  readinessDimensions: WorkplaceReadinessDimension[];
  recommendedDrill: {
    dimension: WorkplaceReadinessDimension;
    moduleKey: string;
    rationale: string;
  };
  recordCompletedDrill: (
    moduleKey: string,
    drillTitle: string,
    evaluation: EvaluationResult
  ) => void;
  totalCompletedDrills: number;
}

const WorkplaceMasteryContext = createContext<WorkplaceMasteryContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'ltt_workplace_mastery_profile',
  MULTI_DAY: 'ltt_workplace_mastery_multiday',
  TRACK_ID: 'ltt_workplace_mastery_active_track',
  DIMENSIONS: 'ltt_workplace_mastery_dimensions',
  DRILL_COUNT: 'ltt_workplace_mastery_drill_count',
};

export const WorkplaceMasteryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { awardXP } = useGamification();
  const { recordEvidence } = useAdaptiveLearning();
  const { logActivity } = useHistory();

  // 1. Profile State
  const [profile, setProfile] = useState<WorkplaceProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : DEFAULT_WORKPLACE_PROFILE;
    } catch {
      return DEFAULT_WORKPLACE_PROFILE;
    }
  });

  // 2. Multi-Day Simulation State
  const [multiDaySim, setMultiDaySim] = useState<MultiDaySimState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MULTI_DAY);
      return saved ? JSON.parse(saved) : INITIAL_MULTI_DAY_SIM_STATE;
    } catch {
      return INITIAL_MULTI_DAY_SIM_STATE;
    }
  });

  // 3. Active Growth Track
  const [activeTrackId, setActiveTrackId] = useState<CareerGrowthTrackId>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRACK_ID);
      return (saved as CareerGrowthTrackId) || 'track_a_new_employee';
    } catch {
      return 'track_a_new_employee';
    }
  });

  // 4. Growth Tracks
  const [growthTracks, setGrowthTracks] = useState<CareerGrowthTrack[]>(CAREER_GROWTH_TRACKS);

  // 5. Readiness Dimensions
  const [readinessDimensions, setReadinessDimensions] = useState<WorkplaceReadinessDimension[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DIMENSIONS);
      return saved ? JSON.parse(saved) : DEFAULT_WORKPLACE_READINESS_DIMENSIONS;
    } catch {
      return DEFAULT_WORKPLACE_READINESS_DIMENSIONS;
    }
  });

  // 6. Total Completed Drills
  const [totalCompletedDrills, setTotalCompletedDrills] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DRILL_COUNT);
      return saved ? parseInt(saved, 10) : 18;
    } catch {
      return 18;
    }
  });

  // Persist Profile
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn('Failed to persist workplace profile:', e);
    }
  }, [profile]);

  // Persist MultiDay
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MULTI_DAY, JSON.stringify(multiDaySim));
    } catch (e) {
      console.warn('Failed to persist multi-day sim:', e);
    }
  }, [multiDaySim]);

  // Persist Active Track
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRACK_ID, activeTrackId);
    } catch (e) {
      console.warn('Failed to persist track id:', e);
    }
  }, [activeTrackId]);

  // Persist Readiness Dimensions
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DIMENSIONS, JSON.stringify(readinessDimensions));
    } catch (e) {
      console.warn('Failed to persist dimensions:', e);
    }
  }, [readinessDimensions]);

  // Persist Drill Count
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DRILL_COUNT, totalCompletedDrills.toString());
    } catch (e) {
      console.warn('Failed to persist drill count:', e);
    }
  }, [totalCompletedDrills]);

  const updateProfile = (updates: Partial<WorkplaceProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const advanceMultiDaySim = (activityName: string) => {
    setMultiDaySim((prev) => workplaceMasteryService.progressMultiDaySimulation(prev, activityName));
  };

  const resetMultiDaySim = () => {
    setMultiDaySim(INITIAL_MULTI_DAY_SIM_STATE);
  };

  const recordCompletedDrill = (
    moduleKey: string,
    drillTitle: string,
    evaluation: EvaluationResult
  ) => {
    setTotalCompletedDrills((prev) => prev + 1);

    // Map module to readiness dimension
    const dimMap: Record<string, string> = {
      standup: 'dim_speaking',
      onboarding: 'dim_speaking',
      asking_help: 'dim_speaking',
      task_understanding: 'dim_listening',
      async_matrix: 'dim_writing',
      meeting_mastery: 'dim_meetings',
      one_on_one: 'dim_manager',
      customer_sim: 'dim_client',
      bidi_tech: 'dim_technical',
      disagreement: 'dim_conflict',
      incident_lab: 'dim_incident',
      delegation: 'dim_leadership',
      exec_briefing: 'dim_executive',
      storytelling: 'dim_growth',
    };

    const targetDimId = dimMap[moduleKey];
    if (targetDimId) {
      setReadinessDimensions((prev) =>
        prev.map((dim) => {
          if (dim.id === targetDimId) {
            const nextCount = dim.evidenceCount + 1;
            let nextProficiency = dim.proficiencyLevel;
            if (nextCount >= 8) nextProficiency = 'master';
            else if (nextCount >= 6) nextProficiency = 'fluent';
            else if (nextCount >= 4) nextProficiency = 'competent';
            return {
              ...dim,
              evidenceCount: nextCount,
              proficiencyLevel: nextProficiency,
            };
          }
          return dim;
        })
      );
    }

    // Award XP
    awardXP('roleplay', `wp_${moduleKey}`, 'completed', 45, 120, {
      title: drillTitle,
      score: evaluation.score,
    });

    // Record Adaptive Learning Evidence
    recordEvidence({
      sourceType: 'roleplay',
      sourceTitle: `Workplace Mastery: ${drillTitle}`,
      targetSkill: 'professional_communication',
      accuracyScore: evaluation.score,
      difficulty: 'normal',
      hintsUsedCount: 0,
      contextType: 'dialogue',
    });

    // History Log
    logActivity({
      userId: 'current-user',
      activityType: 'roleplay',
      title: `Workplace Mastery: ${drillTitle}`,
      subtitle: `Scored ${evaluation.score}% - ${evaluation.isPassed ? 'Passed' : 'Needs Practice'}`,
      timestamp: new Date().toISOString(),
      durationSeconds: 120,
      skill: 'speaking',
      score: evaluation.score,
      hasRecording: false,
      hasTranscript: true,
      correctionsCount: evaluation.isPassed ? 0 : 1,
      hasFeedback: true,
      saved: false,
    });

    // Advance MultiDaySim
    advanceMultiDaySim(drillTitle);
  };

  const recommendedDrill = workplaceMasteryService.recommendNextDrill(
    profile,
    readinessDimensions
  );

  return (
    <WorkplaceMasteryContext.Provider
      value={{
        profile,
        updateProfile,
        multiDaySim,
        advanceMultiDaySim,
        resetMultiDaySim,
        growthTracks,
        activeTrackId,
        setActiveTrackId,
        readinessDimensions,
        recommendedDrill,
        recordCompletedDrill,
        totalCompletedDrills,
      }}
    >
      {children}
    </WorkplaceMasteryContext.Provider>
  );
};

export const useWorkplaceMastery = () => {
  const context = useContext(WorkplaceMasteryContext);
  if (!context) {
    throw new Error('useWorkplaceMastery must be used within a WorkplaceMasteryProvider');
  }
  return context;
};
