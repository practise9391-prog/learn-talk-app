import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AgeGroup,
  ExplanationLanguage,
  SpeakingComfortLevel,
  TextSizePreference,
  CoreJourneyPlanItem,
  ConfidenceJournalEntry,
  SentenceBuildingExercise,
  ThinkInEnglishItem,
  ConversationRecoveryCard,
} from '../types/coreJourney';
import {
  CORE_JOURNEY_STEPS,
  SENTENCE_BUILDING_EXERCISES,
  THINK_IN_ENGLISH_EXERCISES,
  CONVERSATION_RECOVERY_CARDS,
  INITIAL_CONFIDENCE_JOURNAL,
} from '../data/coreJourneyData';
import { useUser } from './UserContext';
import { useGamification } from './GamificationContext';

interface CoreJourneyContextType {
  // 1. Core Journey Flow
  journeySteps: CoreJourneyPlanItem[];
  currentStepIndex: number;
  currentJourneyStage: number;
  advanceJourneyStage: () => void;
  setJourneyStage: (stage: number) => void;
  completeCurrentStep: () => void;
  jumpToStep: (index: number) => void;
  resetJourney: () => void;

  // 2. Personalization & Age Adaptation
  ageGroup: AgeGroup;
  setAgeGroup: (group: AgeGroup) => void;
  explanationLanguage: ExplanationLanguage;
  setExplanationLanguage: (lang: ExplanationLanguage) => void;
  speakingComfort: SpeakingComfortLevel;
  setSpeakingComfort: (comfort: SpeakingComfortLevel) => void;

  // 3. Accessibility
  textSize: TextSizePreference;
  setTextSize: (size: TextSizePreference) => void;
  highContrast: boolean;
  setHighContrast: (contrast: boolean) => void;

  // 4. Confidence & Speaking Journal
  journalEntries: ConfidenceJournalEntry[];
  addJournalEntry: (entry: Omit<ConfidenceJournalEntry, 'id' | 'timestamp' | 'dateFormatted'>) => void;
  deleteJournalEntry: (id: string) => void;

  // 5. Offline & Connectivity
  isOfflineMode: boolean;
  setIsOfflineMode: (offline: boolean) => void;
  offlineCachedCount: number;
  offlineReady: boolean;

  // 6. Sentence Lab & Think in English Data
  sentenceExercises: SentenceBuildingExercise[];
  thinkInEnglishItems: ThinkInEnglishItem[];
  recoveryCards: ConversationRecoveryCard[];
}

const CoreJourneyContext = createContext<CoreJourneyContextType | undefined>(undefined);

const STORAGE_KEYS = {
  JOURNEY_STEPS: 'ltt_core_journey_steps',
  AGE_GROUP: 'ltt_user_age_group',
  EXP_LANG: 'ltt_explanation_language',
  COMFORT: 'ltt_speaking_comfort',
  TEXT_SIZE: 'ltt_text_size_pref',
  HIGH_CONTRAST: 'ltt_high_contrast',
  JOURNAL: 'ltt_confidence_journal',
};

export const CoreJourneyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateUser, updateSettings } = useUser();
  const { awardXP } = useGamification();

  // 1. Journey Steps
  const [journeySteps, setJourneySteps] = useState<CoreJourneyPlanItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.JOURNEY_STEPS);
      return saved ? JSON.parse(saved) : CORE_JOURNEY_STEPS;
    } catch {
      return CORE_JOURNEY_STEPS;
    }
  });

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // 2. Age Group & Preferences
  const [ageGroup, setAgeGroupState] = useState<AgeGroup>(() => {
    try {
      return (localStorage.getItem(STORAGE_KEYS.AGE_GROUP) as AgeGroup) || user.ageGroup || 'professional';
    } catch {
      return 'professional';
    }
  });

  const [explanationLanguage, setExplanationLanguageState] = useState<ExplanationLanguage>(() => {
    try {
      return (localStorage.getItem(STORAGE_KEYS.EXP_LANG) as ExplanationLanguage) || user.preferredExplanationLanguage || 'english';
    } catch {
      return 'english';
    }
  });

  const [speakingComfort, setSpeakingComfortState] = useState<SpeakingComfortLevel>(() => {
    try {
      return (localStorage.getItem(STORAGE_KEYS.COMFORT) as SpeakingComfortLevel) || user.comfortSpeakingAloud || 'confident';
    } catch {
      return 'confident';
    }
  });

  // 3. Accessibility Preferences
  const [textSize, setTextSizeState] = useState<TextSizePreference>(() => {
    try {
      return (localStorage.getItem(STORAGE_KEYS.TEXT_SIZE) as TextSizePreference) || 'normal';
    } catch {
      return 'normal';
    }
  });

  const [highContrast, setHighContrastState] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.HIGH_CONTRAST) === 'true';
    } catch {
      return false;
    }
  });

  // 4. Confidence Journal
  const [journalEntries, setJournalEntries] = useState<ConfidenceJournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.JOURNAL);
      return saved ? JSON.parse(saved) : INITIAL_CONFIDENCE_JOURNAL;
    } catch {
      return INITIAL_CONFIDENCE_JOURNAL;
    }
  });

  // 5. Offline status
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const offlineCachedCount = 28; // cached core units & audio phrases

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.JOURNEY_STEPS, JSON.stringify(journeySteps));
    } catch (e) {
      console.warn('Failed to save journey steps:', e);
    }
  }, [journeySteps]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AGE_GROUP, ageGroup);
      updateUser({ ageGroup });
    } catch (e) {
      console.warn('Failed to save age group:', e);
    }
  }, [ageGroup]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EXP_LANG, explanationLanguage);
      updateUser({ preferredExplanationLanguage: explanationLanguage });
    } catch (e) {
      console.warn('Failed to save explanation language:', e);
    }
  }, [explanationLanguage]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMFORT, speakingComfort);
      updateUser({ comfortSpeakingAloud: speakingComfort });
    } catch (e) {
      console.warn('Failed to save speaking comfort:', e);
    }
  }, [speakingComfort]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TEXT_SIZE, textSize);
      updateSettings({ textSizePreference: textSize });
    } catch (e) {
      console.warn('Failed to save text size:', e);
    }
  }, [textSize]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HIGH_CONTRAST, highContrast ? 'true' : 'false');
      updateSettings({ highContrastMode: highContrast });
    } catch (e) {
      console.warn('Failed to save high contrast:', e);
    }
  }, [highContrast]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(journalEntries));
    } catch (e) {
      console.warn('Failed to save journal:', e);
    }
  }, [journalEntries]);

  // Methods
  const completeCurrentStep = () => {
    setJourneySteps((prev) =>
      prev.map((step, idx) => (idx === currentStepIndex ? { ...step, completed: true } : step))
    );
    if (currentStepIndex < journeySteps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
    awardXP('lesson', `journey_step_${currentStepIndex}`, 'completed', 35, 120);
  };

  const jumpToStep = (index: number) => {
    if (index >= 0 && index < journeySteps.length) {
      setCurrentStepIndex(index);
    }
  };

  const resetJourney = () => {
    setJourneySteps(CORE_JOURNEY_STEPS);
    setCurrentStepIndex(0);
  };

  const setAgeGroup = (group: AgeGroup) => {
    setAgeGroupState(group);
  };

  const setExplanationLanguage = (lang: ExplanationLanguage) => {
    setExplanationLanguageState(lang);
  };

  const setSpeakingComfort = (comfort: SpeakingComfortLevel) => {
    setSpeakingComfortState(comfort);
  };

  const setTextSize = (size: TextSizePreference) => {
    setTextSizeState(size);
  };

  const setHighContrast = (contrast: boolean) => {
    setHighContrastState(contrast);
  };

  const addJournalEntry = (
    entry: Omit<ConfidenceJournalEntry, 'id' | 'timestamp' | 'dateFormatted'>
  ) => {
    const newEntry: ConfidenceJournalEntry = {
      ...entry,
      id: `journal-${Date.now()}`,
      timestamp: new Date().toISOString(),
      dateFormatted: 'Just now',
    };
    setJournalEntries((prev) => [newEntry, ...prev]);
    awardXP('roleplay', newEntry.id, 'journal_entry', 25, 60);
  };

  const deleteJournalEntry = (id: string) => {
    setJournalEntries((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <CoreJourneyContext.Provider
      value={{
        journeySteps,
        currentStepIndex,
        currentJourneyStage: currentStepIndex + 1,
        advanceJourneyStage: completeCurrentStep,
        setJourneyStage: (stage: number) => jumpToStep(Math.max(0, stage - 1)),
        completeCurrentStep,
        jumpToStep,
        resetJourney,
        ageGroup,
        setAgeGroup,
        explanationLanguage,
        setExplanationLanguage,
        speakingComfort,
        setSpeakingComfort,
        textSize,
        setTextSize,
        highContrast,
        setHighContrast,
        journalEntries,
        addJournalEntry,
        deleteJournalEntry,
        isOfflineMode,
        setIsOfflineMode,
        offlineCachedCount,
        offlineReady: !isOfflineMode || offlineCachedCount > 0,
        sentenceExercises: SENTENCE_BUILDING_EXERCISES,
        thinkInEnglishItems: THINK_IN_ENGLISH_EXERCISES,
        recoveryCards: CONVERSATION_RECOVERY_CARDS,
      }}
    >
      {children}
    </CoreJourneyContext.Provider>
  );
};

export const useCoreJourney = () => {
  const context = useContext(CoreJourneyContext);
  if (!context) {
    throw new Error('useCoreJourney must be used within a CoreJourneyProvider');
  }
  return context;
};
