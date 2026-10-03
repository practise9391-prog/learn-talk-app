import React, { useState } from 'react';
import {
  X,
  UserCheck,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Volume2,
} from 'lucide-react';
import { ONE_ON_ONE_SESSIONS } from '../../data/workplaceMasteryData';
import { OneOnOneSession } from '../../types/workplaceMastery';
import { useWorkplaceMastery } from '../../context/WorkplaceMasteryContext';
import { DictationMicButton } from '../proLab/DictationMicButton';

interface ManagerOneOnOneModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManagerOneOnOneModal: React.FC<ManagerOneOnOneModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { recordCompletedDrill } = useWorkplaceMastery();
  const [sessionIdx, setSessionIdx] = useState(0);
  const [userSpeech, setUserSpeech] = useState('');
  const [dialogueHistory, setDialogueHistory] = useState<Array<{ speaker: string; text: string }>>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const session = ONE_ON_ONE_SESSIONS[sessionIdx];

  if (!isOpen) return null;

  const handleSend = () => {
    if (!userSpeech.trim()) return;

    const newHistory = [
      ...dialogueHistory,
      { speaker: 'You (Learner)', text: userSpeech.trim() },
      {
        speaker: session.managerName,
        text:
          session.modelDialogue.find((d) => d.speaker === 'manager')?.text ||
          'Thanks for bringing this up directly. Let us set actionable milestones for next sprint.',
      },
    ];

    setDialogueHistory(newHistory);
    setUserSpeech('');
    setIsCompleted(true);

    recordCompletedDrill('one_on_one', `1:1 with ${session.managerName}`, {
      score: 90,
      isPassed: true,
      structureCheck: [
        {
          label: 'Proactive Agenda Framing',
          passed: true,
          feedback: 'Clearly took the lead on structuring the 1:1 discussion topic.',
        },
        {
          label: 'Constructive Career Focus',
          passed: true,
          feedback: 'Articulated career milestones and workload considerations professionally.',
        },
      ],
      overallFeedback: 'Excellent employee-led 1:1 engagement!',
      betterAlternative: session.modelDialogue[0].text,
    });
  };

  const handleReset = () => {
    setDialogueHistory([]);
    setUserSpeech('');
    setIsCompleted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-surface-hover/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">
                Manager 1:1 Sync Simulator
              </h2>
              <p className="text-sm text-text-secondary">
                Practice employee-led syncs, career trajectory discussions, and workload balancing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-tertiary hover:text-text-primary rounded-lg hover:bg-surface-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sessions tabs */}
        <div className="flex border-b border-border bg-background px-6 pt-2 gap-2">
          {ONE_ON_ONE_SESSIONS.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setSessionIdx(idx);
                handleReset();
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${
                sessionIdx === idx
                  ? 'border-primary text-primary bg-surface'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              {s.topic.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Manager Persona card */}
          <div className="p-4 rounded-xl bg-surface-hover border border-border flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-text-primary text-sm">{session.managerName}</h4>
              <p className="text-xs text-text-secondary">
                Management Style: {session.managerStyle.toUpperCase()} | Format: {session.mode.replace('_', ' ').toUpperCase()}
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
              Topic: {session.topic.replace('_', ' ')}
            </span>
          </div>

          {/* Talking points guide */}
          <div className="p-4 rounded-xl bg-background border border-border">
            <h5 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Recommended Talking Points Guide
            </h5>
            <ul className="text-xs text-text-secondary space-y-1 list-disc list-inside">
              {session.talkingPointsGuide.map((tp, i) => (
                <li key={i}>{tp}</li>
              ))}
            </ul>
          </div>

          {/* Dialogue history */}
          {dialogueHistory.length > 0 && (
            <div className="space-y-3">
              {dialogueHistory.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl text-xs space-y-1 ${
                    item.speaker.startsWith('You')
                      ? 'bg-primary/10 border border-primary/20 text-text-primary ml-6'
                      : 'bg-surface-hover border border-border text-text-primary mr-6'
                  }`}
                >
                  <span className="font-bold block text-[11px] text-text-secondary">
                    {item.speaker}
                  </span>
                  <p className="leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* Input */}
          {!isCompleted ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Open the 1:1 Discussion
                </label>
                <DictationMicButton
                  onTranscript={(txt) => setUserSpeech((prev) => (prev ? `${prev} ${txt}` : txt))}
                  label="Dictate Opener"
                />
              </div>
              <textarea
                rows={3}
                value={userSpeech}
                onChange={(e) => setUserSpeech(e.target.value)}
                placeholder="Thanks for making time today... For this 1:1, I'd like to focus on..."
                className="w-full p-4 bg-background border border-border rounded-xl text-text-primary placeholder:text-text-tertiary text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!userSpeech.trim()}
                  className="px-6 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
                >
                  Deliver Talking Points
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                1:1 Discussion Milestone Achieved (+45 XP)
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 border border-border rounded-lg text-xs font-medium text-text-secondary hover:bg-surface transition-colors"
              >
                Reset Conversation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
