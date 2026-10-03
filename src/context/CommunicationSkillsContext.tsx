import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ListeningContentItem,
  ReadingContentItem,
  WritingPromptItem,
  CommunicationChallenge,
  WritingSubmission,
  ListeningSpeed,
  TranscriptMode,
  CommunicationSkillSummary,
} from '../types/communication';
import {
  SAMPLE_LISTENING_CONTENT,
  SAMPLE_READING_CONTENT,
  SAMPLE_WRITING_PROMPTS,
  SAMPLE_COMMUNICATION_CHALLENGES,
  INITIAL_COMMUNICATION_SUMMARY,
} from '../data/communicationData';
import { CommunicationEvaluationService } from '../services/communicationEvaluationService';
import { useGamification } from './GamificationContext';
import { useAdaptiveLearning } from './AdaptiveLearningContext';
import { useHistory } from './HistoryContext';

interface CommunicationSkillsContextType {
  listeningItems: ListeningContentItem[];
  readingItems: ReadingContentItem[];
  writingPrompts: WritingPromptItem[];
  communicationChallenges: CommunicationChallenge[];
  writingSubmissions: WritingSubmission[];
  savedListeningPhrases: { id: string; phrase: string; audioText: string; sourceTitle: string; timestamp: string }[];
  savedPassageNotes: { id: string; passageId: string; note: string; highlightedText: string; createdAt: string }[];
  communicationSkillSummary: CommunicationSkillSummary;

  playbackSpeed: ListeningSpeed;
  transcriptMode: TranscriptMode;
  currentPlayingId: string | null;
  isPlaying: boolean;

  setPlaybackSpeed: (speed: ListeningSpeed) => void;
  setTranscriptMode: (mode: TranscriptMode) => void;
  playAudio: (text: string, voiceGender?: 'male' | 'female', id?: string) => void;
  stopAudio: () => void;

  submitDictation: (
    contentId: string,
    dictationId: string,
    userText: string
  ) => { accuracy: number; isExactMatch: boolean; feedback: string };

  submitWritingDraft: (
    promptId: string,
    text: string
  ) => WritingSubmission;

  completeChallengeStep: (
    challengeId: string,
    stepNumber: number,
    score?: number
  ) => void;

  saveListeningPhrase: (phrase: string, audioText: string, sourceTitle: string) => void;
  savePassageHighlight: (passageId: string, highlightedText: string, note?: string) => void;
}

const CommunicationSkillsContext = createContext<CommunicationSkillsContextType | undefined>(undefined);

export const CommunicationSkillsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { awardXP } = useGamification();
  const { recordEvidence } = useAdaptiveLearning();
  const { logActivity } = useHistory();

  const [listeningItems] = useState<ListeningContentItem[]>(SAMPLE_LISTENING_CONTENT);
  const [readingItems] = useState<ReadingContentItem[]>(SAMPLE_READING_CONTENT);
  const [writingPrompts] = useState<WritingPromptItem[]>(SAMPLE_WRITING_PROMPTS);
  const [communicationChallenges, setCommunicationChallenges] = useState<CommunicationChallenge[]>(() => {
    const saved = localStorage.getItem('learntalk_communication_challenges');
    return saved ? JSON.parse(saved) : SAMPLE_COMMUNICATION_CHALLENGES;
  });

  const [writingSubmissions, setWritingSubmissions] = useState<WritingSubmission[]>(() => {
    const saved = localStorage.getItem('learntalk_writing_submissions');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'sub-sample-1',
        promptId: 'write-email-leave-request',
        promptTitle: 'Email: Requesting Two Days of Personal Leave',
        writingType: 'email',
        draftNumber: 1,
        text: 'Dear Maya,\nI would like to request leave for two days next week on October 15-16. Sarah will cover my client work. Thank you,\nAlex',
        status: 'submitted',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        evaluation: {
          overallScore: 82,
          qualityTier: 'natural',
          feedbackSummary: 'Clear and concise. Adding a formal subject line and emergency contact information will make it fully professional.',
          corrections: [],
          betterAlternativeVersions: [],
          rubricScores: {
            taskCompletion: 80,
            grammar: 88,
            vocabulary: 80,
            organization: 80,
            tone: 85,
          },
        },
      },
    ];
  });

  const [savedListeningPhrases, setSavedListeningPhrases] = useState<{
    id: string;
    phrase: string;
    audioText: string;
    sourceTitle: string;
    timestamp: string;
  }[]>(() => {
    const saved = localStorage.getItem('learntalk_saved_listening_phrases');
    return saved ? JSON.parse(saved) : [];
  });

  const [savedPassageNotes, setSavedPassageNotes] = useState<{
    id: string;
    passageId: string;
    note: string;
    highlightedText: string;
    createdAt: string;
  }[]>(() => {
    const saved = localStorage.getItem('learntalk_saved_passage_notes');
    return saved ? JSON.parse(saved) : [];
  });

  const [communicationSkillSummary, setCommunicationSkillSummary] = useState<CommunicationSkillSummary>(() => {
    const saved = localStorage.getItem('learntalk_communication_skill_summary');
    return saved ? JSON.parse(saved) : INITIAL_COMMUNICATION_SUMMARY;
  });

  // Audio player state
  const [playbackSpeed, setPlaybackSpeed] = useState<ListeningSpeed>('1x');
  const [transcriptMode, setTranscriptMode] = useState<TranscriptMode>('on');
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioCancelRef, setAudioCancelRef] = useState<{ cancel: () => void } | null>(null);

  useEffect(() => {
    localStorage.setItem('learntalk_communication_challenges', JSON.stringify(communicationChallenges));
  }, [communicationChallenges]);

  useEffect(() => {
    localStorage.setItem('learntalk_writing_submissions', JSON.stringify(writingSubmissions));
  }, [writingSubmissions]);

  useEffect(() => {
    localStorage.setItem('learntalk_saved_listening_phrases', JSON.stringify(savedListeningPhrases));
  }, [savedListeningPhrases]);

  useEffect(() => {
    localStorage.setItem('learntalk_saved_passage_notes', JSON.stringify(savedPassageNotes));
  }, [savedPassageNotes]);

  useEffect(() => {
    localStorage.setItem('learntalk_communication_skill_summary', JSON.stringify(communicationSkillSummary));
  }, [communicationSkillSummary]);

  const playAudio = (text: string, voiceGender: 'male' | 'female' = 'female', id: string = 'global-audio') => {
    if (audioCancelRef) {
      audioCancelRef.cancel();
    }
    setCurrentPlayingId(id);
    setIsPlaying(true);

    const controller = CommunicationEvaluationService.speakText(text, playbackSpeed, voiceGender, () => {
      setIsPlaying(false);
      setCurrentPlayingId(null);
    });

    setAudioCancelRef(controller);
  };

  const stopAudio = () => {
    if (audioCancelRef) {
      audioCancelRef.cancel();
    }
    setIsPlaying(false);
    setCurrentPlayingId(null);
  };

  /**
   * Submit and evaluate listening dictation
   */
  const submitDictation = (
    contentId: string,
    dictationId: string,
    userText: string
  ) => {
    const item = listeningItems.find((l) => l.id === contentId);
    const dictItem = item?.dictationItems?.find((d) => d.id === dictationId);
    if (!dictItem) {
      return { accuracy: 0, isExactMatch: false, feedback: 'Dictation item not found.' };
    }

    const result = CommunicationEvaluationService.evaluateDictation(userText, dictItem.targetSentence);

    // Register learning evidence
    recordEvidence({
      sourceType: 'listening',
      sourceTitle: item?.title || 'Dictation Practice',
      targetSkill: 'listening',
      accuracyScore: result.accuracy,
      difficulty: 'normal',
      hintsUsedCount: 0,
      contextType: 'sentence',
    });

    // Award XP
    if (result.accuracy >= 60) {
      awardXP('listening' as any, dictationId, 'dictation_transcription_success', Math.round(result.accuracy * 0.4), 45);
    }

    // Bump skill score slightly
    setCommunicationSkillSummary((prev) => ({
      ...prev,
      listening: Math.min(100, prev.listening + (result.isExactMatch ? 1 : 0.5)),
    }));

    return result;
  };

  /**
   * Submit writing draft with AI rubric evaluation and version history
   */
  const submitWritingDraft = (promptId: string, text: string): WritingSubmission => {
    const prompt = writingPrompts.find((p) => p.id === promptId);
    const existingSubmissions = writingSubmissions.filter((s) => s.promptId === promptId);
    const draftNumber = existingSubmissions.length + 1;

    let evaluation = undefined;
    if (prompt) {
      evaluation = CommunicationEvaluationService.evaluateWriting(text, prompt);
    }

    const newSubmission: WritingSubmission = {
      id: `sub-${Date.now()}`,
      promptId,
      promptTitle: prompt?.title || 'Writing Practice',
      writingType: prompt?.writingType || 'guided_paragraph',
      draftNumber,
      text,
      status: 'submitted',
      evaluation,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setWritingSubmissions((prev) => [newSubmission, ...prev]);

    // Record learning evidence
    if (evaluation) {
      recordEvidence({
        sourceType: 'writing',
        sourceTitle: prompt?.title || 'Writing Composition',
        targetSkill: 'writing',
        accuracyScore: evaluation.overallScore,
        difficulty: 'normal',
        hintsUsedCount: 0,
        contextType: 'sentence',
      });

      // Award XP
      awardXP(
        'lesson' as any,
        promptId,
        'writing_submission_evaluated',
        Math.round(evaluation.overallScore * 0.5),
        120
      );

      // Add to History
      logActivity({
        userId: 'u-1',
        activityType: 'writing',
        title: `Writing: ${prompt?.title || 'Composition'}`,
        subtitle: `${text.split(/\s+/).length} words • ${evaluation.qualityTier} tier`,
        timestamp: 'Just now',
        durationSeconds: 120,
        skill: 'writing',
        score: evaluation.overallScore,
        hasRecording: false,
        hasTranscript: true,
        hasFeedback: true,
        saved: false,
        correctionsCount: evaluation.corrections.length,
      });

      // Update skill summary
      setCommunicationSkillSummary((prev) => ({
        ...prev,
        writing: Math.min(100, Math.round(prev.writing * 0.95 + evaluation.overallScore * 0.05)),
      }));
    }

    return newSubmission;
  };

  /**
   * Complete a step in a multi-modal challenge
   */
  const completeChallengeStep = (challengeId: string, stepNumber: number, score: number = 85) => {
    setCommunicationChallenges((prev) =>
      prev.map((c) => {
        if (c.id !== challengeId) return c;
        const newSteps = c.steps.map((st) =>
          st.stepNumber === stepNumber ? { ...st, completed: true, score } : st
        );
        const allDone = newSteps.every((s) => s.completed);
        return {
          ...c,
          steps: newSteps,
          completed: allDone,
        };
      })
    );

    awardXP('lesson' as any, `${challengeId}-step-${stepNumber}`, 'challenge_step_completed', 35, 90);
  };

  const saveListeningPhrase = (phrase: string, audioText: string, sourceTitle: string) => {
    const item = {
      id: `lp-${Date.now()}`,
      phrase,
      audioText,
      sourceTitle,
      timestamp: new Date().toISOString(),
    };
    setSavedListeningPhrases((prev) => [item, ...prev]);
  };

  const savePassageHighlight = (passageId: string, highlightedText: string, note: string = '') => {
    const item = {
      id: `note-${Date.now()}`,
      passageId,
      highlightedText,
      note,
      createdAt: new Date().toISOString(),
    };
    setSavedPassageNotes((prev) => [item, ...prev]);
  };

  return (
    <CommunicationSkillsContext.Provider
      value={{
        listeningItems,
        readingItems,
        writingPrompts,
        communicationChallenges,
        writingSubmissions,
        savedListeningPhrases,
        savedPassageNotes,
        communicationSkillSummary,
        playbackSpeed,
        transcriptMode,
        currentPlayingId,
        isPlaying,
        setPlaybackSpeed,
        setTranscriptMode,
        playAudio,
        stopAudio,
        submitDictation,
        submitWritingDraft,
        completeChallengeStep,
        saveListeningPhrase,
        savePassageHighlight,
      }}
    >
      {children}
    </CommunicationSkillsContext.Provider>
  );
};

export const useCommunicationSkills = (): CommunicationSkillsContextType => {
  const context = useContext(CommunicationSkillsContext);
  if (!context) {
    throw new Error('useCommunicationSkills must be used within a CommunicationSkillsProvider');
  }
  return context;
};
