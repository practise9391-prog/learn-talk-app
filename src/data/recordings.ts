import { Recording } from '../types';

export const SAMPLE_RECORDINGS: Recording[] = [
  {
    id: 'rec-001',
    sessionId: 'sess-today-1',
    title: 'Morning Routine Practice',
    scenarioName: 'Daily Routine (Unit 3)',
    timestamp: 'Today at 08:30 AM',
    durationSeconds: 142,
    hasAudio: true,
    transcriptText: "Usually I wake up at seven AM. Then I wash my face and prepare a hot black coffee. After that I read the news for fifteen minutes before leaving for the office.",
    correctionsCount: 1,
    savedLocally: true
  },
  {
    id: 'rec-002',
    sessionId: 'sess-yest-1',
    title: 'Tea Shop Conversation',
    scenarioName: 'Tea Shop (Speaking World)',
    timestamp: 'Yesterday at 04:15 PM',
    durationSeconds: 215,
    hasAudio: true,
    transcriptText: "Hello, I would like one cup of ginger tea. Could you please put less sugar? Also do you have any freshly made samosas available?",
    correctionsCount: 2,
    savedLocally: true
  },
  {
    id: 'rec-003',
    sessionId: 'sess-week-1',
    title: 'Project Standup Simulation',
    scenarioName: 'Office / Standup (Roleplay)',
    timestamp: '3 days ago at 11:00 AM',
    durationSeconds: 310,
    hasAudio: false, // Transcript preserved
    transcriptText: "Good morning team. Yesterday I completed the database indexing. Today I am collaborating with Priya on API security endpoints. No blockers at this moment.",
    correctionsCount: 0,
    savedLocally: true
  },
  {
    id: 'rec-004',
    sessionId: 'sess-older-1',
    title: 'First Self Introduction',
    scenarioName: 'Unit 1: First Impressions',
    timestamp: '1 week ago',
    durationSeconds: 180,
    hasAudio: true,
    transcriptText: "Hello everyone. My name is Pavan and I come from Hyderabad. I work in software engineering and I want to improve my spontaneous English speaking.",
    correctionsCount: 1,
    savedLocally: true
  }
];
