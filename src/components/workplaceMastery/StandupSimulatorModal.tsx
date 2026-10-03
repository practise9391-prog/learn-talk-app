import React, { useState } from 'react';
import {
  X,
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Layers,
  RotateCcw,
  Volume2,
} from 'lucide-react';
import { STANDUP_DRILLS } from '../../data/workplaceMasteryData';
import { StandupDrill } from '../../types/workplaceMastery';
import { workplaceMasteryService, EvaluationResult } from '../../services/workplaceMasteryService';
import { useWorkplaceMastery } from '../../context/WorkplaceMasteryContext';
import { DictationMicButton } from '../proLab/DictationMicButton';

interface StandupSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StandupSimulatorModal: React.FC<StandupSimulatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { recordCompletedDrill } = useWorkplaceMastery();
  const [drillIdx, setDrillIdx] = useState(0);
  const [userSpeech, setUserSpeech] = useState('');
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  const drill = STANDUP_DRILLS[drillIdx];

  if (!isOpen) return null;

  const handleEvaluate = () => {
    if (!userSpeech.trim()) return;
    const result = workplaceMasteryService.evaluateStandup(userSpeech, drill);
    setEvaluation(result);
    recordCompletedDrill('standup', `Standup: ${drill.roleContext}`, result);
  };

  const handleNext = () => {
    setEvaluation(null);
    setUserSpeech('');
    setDrillIdx((prev) => (prev + 1) % STANDUP_DRILLS.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-surface-hover/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">
                Daily Standup Simulator
              </h2>
              <p className="text-sm text-text-secondary">
                Practice Yesterday $\rightarrow$ Today $\rightarrow$ Blockers with concise, high-visibility delivery
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

        {/* Drill Tabs */}
        <div className="flex border-b border-border bg-background px-6 pt-2 gap-2">
          {STANDUP_DRILLS.map((d, idx) => (
            <button
              key={d.id}
              onClick={() => {
                setDrillIdx(idx);
                setEvaluation(null);
                setUserSpeech('');
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${
                drillIdx === idx
                  ? 'border-primary text-primary bg-surface'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              {d.roleContext}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Situation Brief */}
          <div className="p-5 rounded-2xl bg-surface-hover border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Sprint Objective: {drill.sprintGoal}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium">
                Target: Under 90 words
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-background rounded-xl border border-border">
                <span className="font-semibold text-text-primary block mb-1 text-[11px] uppercase">
                  Yesterday’s Items
                </span>
                <ul className="text-text-secondary space-y-1 list-disc list-inside">
                  {drill.yesterdayActivities.map((act, i) => (
                    <li key={i}>{act}</li>
                  ))}
                </ul>
              </div>
              <div className="p-3 bg-background rounded-xl border border-border">
                <span className="font-semibold text-text-primary block mb-1 text-[11px] uppercase">
                  Today’s Focus
                </span>
                <ul className="text-text-secondary space-y-1 list-disc list-inside">
                  {drill.todayPlan.map((act, i) => (
                    <li key={i}>{act}</li>
                  ))}
                </ul>
              </div>
              <div className="p-3 bg-background rounded-xl border border-border">
                <span className="font-semibold text-text-primary block mb-1 text-[11px] uppercase">
                  Blocker Issue
                </span>
                <p className="text-text-secondary">
                  {drill.blockerIssue || 'None reported.'}
                </p>
              </div>
            </div>
          </div>

          {/* Delivery input */}
          {!evaluation ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Deliver Your Standup Update
                </label>
                <DictationMicButton
                  onTranscript={(txt) =>
                    setUserSpeech((prev) => (prev ? `${prev} ${txt}` : txt))
                  }
                  label="Speak Standup"
                />
              </div>
              <textarea
                rows={4}
                value={userSpeech}
                onChange={(e) => setUserSpeech(e.target.value)}
                placeholder="Yesterday, I finished... Today, I'm working on... My blocker is..."
                className="w-full p-4 bg-background border border-border rounded-xl text-text-primary placeholder:text-text-tertiary text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              />
              <div className="flex justify-between items-center text-xs text-text-tertiary">
                <span>Word count: {userSpeech.trim() ? userSpeech.trim().split(/\s+/).length : 0} words</span>
                <button
                  type="button"
                  onClick={handleEvaluate}
                  disabled={!userSpeech.trim()}
                  className="px-6 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
                >
                  Analyze Standup
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  evaluation.isPassed
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  {evaluation.isPassed ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                  Delivery Score: {evaluation.score}% -{' '}
                  {evaluation.isPassed ? 'Passed' : 'Needs Work'}
                </div>
                <span className="text-xs opacity-90">{evaluation.overallFeedback}</span>
              </div>

              {/* Rubric checks */}
              <div className="space-y-2">
                {evaluation.structureCheck.map((check, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-background rounded-xl border border-border flex items-start gap-3 text-xs"
                  >
                    {check.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-semibold text-text-primary">{check.label}</span>
                      <p className="text-text-secondary mt-0.5">{check.feedback}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Model Alternative */}
              <div className="p-4 bg-background rounded-xl border border-border text-xs space-y-1">
                <span className="font-bold text-text-secondary uppercase tracking-wider block text-[10px]">
                  Model Benchmark Delivery
                </span>
                <p className="text-text-primary leading-relaxed italic">
                  "{evaluation.betterAlternative}"
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEvaluation(null)}
                  className="px-4 py-2 border border-border rounded-xl text-xs font-semibold text-text-secondary hover:bg-surface transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Try Again
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-hover transition-colors flex items-center gap-1.5"
                >
                  Next Standup <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
