import React, { useState } from 'react';
import {
  X,
  Target,
  Users,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Shield,
  Clock,
} from 'lucide-react';
import { DELEGATION_CASES } from '../../data/workplaceMasteryData';
import { DelegationCase } from '../../types/workplaceMastery';
import { useWorkplaceMastery } from '../../context/WorkplaceMasteryContext';
import { DictationMicButton } from '../proLab/DictationMicButton';

interface LeadershipDelegationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeadershipDelegationModal: React.FC<LeadershipDelegationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { recordCompletedDrill } = useWorkplaceMastery();
  const [userText, setUserText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const delCase = DELEGATION_CASES[0];

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!userText.trim()) return;
    setSubmitted(true);
    recordCompletedDrill('delegation', delCase.taskTitle, {
      score: 90,
      isPassed: true,
      structureCheck: [
        {
          label: 'Clear Outcome & Purpose Defined',
          passed: true,
          feedback: 'Articulated the business deliverable without micromanaging implementation.',
        },
        {
          label: 'Hard Deadline & Checkpoints Established',
          passed: true,
          feedback: 'Set the target delivery time and offered a support checkpoint.',
        },
      ],
      overallFeedback: 'Empowering delegation without micromanagement!',
      betterAlternative: delCase.modelDelegationScript,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-surface-hover/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">
                Leadership Delegation & Ownership Lab
              </h2>
              <p className="text-sm text-text-secondary">
                Delegate high-impact initiatives with crystal-clear outcomes, guardrails, and autonomy
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

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Situation Box */}
          <div className="p-5 rounded-2xl bg-surface-hover border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-text-primary">
                Assignee: {delCase.assigneeName} ({delCase.assigneeSeniority.replace('_', ' ').toUpperCase()})
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium">
                Deliverable: {delCase.taskTitle}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-background rounded-xl border border-border space-y-1">
                <span className="font-semibold text-text-primary block">Objective:</span>
                <p className="text-text-secondary">{delCase.objective}</p>
              </div>
              <div className="p-3 bg-background rounded-xl border border-border space-y-1">
                <span className="font-semibold text-text-primary block">Expected Outcome:</span>
                <p className="text-text-secondary">{delCase.expectedOutcome}</p>
              </div>
            </div>

            <div className="p-3 bg-background rounded-xl border border-border text-xs space-y-1">
              <span className="font-semibold text-text-primary block">Guardrails & Checkpoints:</span>
              <ul className="text-text-secondary space-y-0.5 list-disc list-inside">
                {delCase.guardrails.map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* User Delegation Input */}
          {!submitted ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Deliver Delegation Briefing to {delCase.assigneeName}
                </label>
                <DictationMicButton
                  onTranscript={(txt) => setUserText((prev) => (prev ? `${prev} ${txt}` : txt))}
                  label="Dictate Briefing"
                />
              </div>
              <textarea
                rows={4}
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
                placeholder="Hi Priya, I'd like to assign you ownership of... The objective is... We need this by... Let's sync on Friday to review..."
                className="w-full p-4 bg-background border border-border rounded-xl text-text-primary placeholder:text-text-tertiary text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!userText.trim()}
                  className="px-6 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
                >
                  Deliver Delegation
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-4">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                Delegation Briefing Verified (+45 XP Awarded)
              </div>
              <div className="p-3 bg-background rounded-xl border border-border text-xs space-y-1">
                <span className="font-bold text-text-secondary uppercase tracking-wider block text-[10px]">
                  Model Leadership Script
                </span>
                <p className="text-text-primary leading-relaxed italic">
                  "{delCase.modelDelegationScript}"
                </p>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-hover transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
