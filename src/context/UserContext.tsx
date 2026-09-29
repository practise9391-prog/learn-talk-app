import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, SkillProgress, Mistake, Recording, Unit } from '../types';
import { INITIAL_USER, INITIAL_SKILL_PROGRESS } from '../data/initialData';
import { INITIAL_UNITS } from '../data/levels';
import { SAMPLE_MISTAKES } from '../data/mistakes';
import { SAMPLE_RECORDINGS } from '../data/recordings';

interface UserContextType {
  user: User;
  skillProgress: SkillProgress;
  units: Unit[];
  mistakes: Mistake[];
  recordings: Recording[];
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  updateUser: (partial: Partial<User>) => void;
  updateSettings: (partialSettings: Partial<User['settings']>) => void;
  completeLesson: (lessonId: string) => void;
  addSpokenMinutes: (minutes: number) => void;
  resolveMistake: (mistakeId: string) => void;
  deleteRecording: (recordingId: string) => void;
  saveNewRecording: (rec: Omit<Recording, 'id' | 'timestamp'>) => void;
  finishOnboarding: (data: { level: User['currentLevel']; goals: string[]; nativeLanguages: string[]; dailyGoalMinutes: number }) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('learntalk_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [skillProgress, setSkillProgress] = useState<SkillProgress>(() => {
    const saved = localStorage.getItem('learntalk_skill_progress');
    return saved ? JSON.parse(saved) : INITIAL_SKILL_PROGRESS;
  });

  const [units, setUnits] = useState<Unit[]>(() => {
    const saved = localStorage.getItem('learntalk_units');
    return saved ? JSON.parse(saved) : INITIAL_UNITS;
  });

  const [mistakes, setMistakes] = useState<Mistake[]>(() => {
    const saved = localStorage.getItem('learntalk_mistakes');
    return saved ? JSON.parse(saved) : SAMPLE_MISTAKES;
  });

  const [recordings, setRecordings] = useState<Recording[]>(() => {
    const saved = localStorage.getItem('learntalk_recordings');
    return saved ? JSON.parse(saved) : SAMPLE_RECORDINGS;
  });

  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => {
    return !localStorage.getItem('learntalk_onboarding_completed');
  });

  useEffect(() => {
    localStorage.setItem('learntalk_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('learntalk_skill_progress', JSON.stringify(skillProgress));
  }, [skillProgress]);

  useEffect(() => {
    localStorage.setItem('learntalk_units', JSON.stringify(units));
  }, [units]);

  useEffect(() => {
    localStorage.setItem('learntalk_mistakes', JSON.stringify(mistakes));
  }, [mistakes]);

  useEffect(() => {
    localStorage.setItem('learntalk_recordings', JSON.stringify(recordings));
  }, [recordings]);

  const updateUser = (partial: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...partial }));
  };

  const updateSettings = (partialSettings: Partial<User['settings']>) => {
    setUser((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...partialSettings },
    }));
  };

  const completeLesson = (lessonId: string) => {
    setUnits((prevUnits) =>
      prevUnits.map((u) => ({
        ...u,
        lessons: u.lessons.map((l) =>
          l.id === lessonId ? { ...l, completed: true, active: false } : l
        ),
      }))
    );
    // Award XP
    setUser((prev) => ({
      ...prev,
      xp: prev.xp + 50,
    }));
    // Bump progress slightly
    setSkillProgress((prev) => ({
      ...prev,
      grammar: Math.min(100, prev.grammar + 1),
      speaking: Math.min(100, prev.speaking + 2),
      vocabulary: Math.min(100, prev.vocabulary + 1),
    }));
  };

  const addSpokenMinutes = (minutes: number) => {
    setUser((prev) => ({
      ...prev,
      minutesSpokenToday: Math.min(prev.dailyGoalMinutes, prev.minutesSpokenToday + minutes),
      xp: prev.xp + minutes * 10,
    }));
  };

  const resolveMistake = (mistakeId: string) => {
    setMistakes((prev) =>
      prev.map((m) => (m.id === mistakeId ? { ...m, resolved: true } : m))
    );
  };

  const deleteRecording = (recordingId: string) => {
    setRecordings((prev) => prev.filter((r) => r.id !== recordingId));
  };

  const saveNewRecording = (rec: Omit<Recording, 'id' | 'timestamp'>) => {
    const newRec: Recording = {
      ...rec,
      id: `rec-${Date.now()}`,
      timestamp: 'Just now',
    };
    setRecordings((prev) => [newRec, ...prev]);
  };

  const finishOnboarding = (data: {
    level: User['currentLevel'];
    goals: string[];
    nativeLanguages: string[];
    dailyGoalMinutes: number;
  }) => {
    setUser((prev) => ({
      ...prev,
      currentLevel: data.level,
      goals: data.goals,
      nativeLanguages: data.nativeLanguages,
      dailyGoalMinutes: data.dailyGoalMinutes,
    }));
    localStorage.setItem('learntalk_onboarding_completed', 'true');
    setIsOnboardingOpen(false);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        skillProgress,
        units,
        mistakes,
        recordings,
        isOnboardingOpen,
        setIsOnboardingOpen,
        updateUser,
        updateSettings,
        completeLesson,
        addSpokenMinutes,
        resolveMistake,
        deleteRecording,
        saveNewRecording,
        finishOnboarding,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};
