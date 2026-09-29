import { User, SkillProgress } from '../types';

export const INITIAL_USER: User = {
  id: 'user-001',
  name: 'Pavan',
  email: 'pavan@example.com',
  avatarUrl: '',
  currentLevel: 'A1',
  streakDays: 5,
  xp: 420,
  minutesSpokenToday: 6,
  dailyGoalMinutes: 10,
  nativeLanguages: ['Telugu', 'Hindi'],
  goals: ['Speak confidently', 'Think in English', 'Prepare for interviews', 'Workplace communication'],
  settings: {
    themeMode: 'system',
    themePalette: 'purple',
    reducedMotion: false,
    hapticFeedback: true,
    recordingPermissionsGranted: true,
    autoSaveRecordings: true,
    speakingPace: 'normal',
    preferredAssistanceLevel: 2,
    activePersonaId: 'jarvis',
    autoListenSlow: false,
    soundEffects: true
  }
};

// Skill progress calculated based on verified completed lesson tasks and verified speaking sessions:
export const INITIAL_SKILL_PROGRESS: SkillProgress = {
  grammar: 32,
  vocabulary: 45,
  pronunciation: 28,
  fluency: 24,
  listening: 50,
  speaking: 28,
  conversation: 25,
  confidence: 35
};
