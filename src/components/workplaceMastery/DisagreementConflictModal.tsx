import React, { useState } from 'react';
import {
  X,
  Scale,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { DISAGREEMENT_CONFLICT_CASES } from '../../data/workplaceMasteryData';
import { DisagreementConflictCase } from '../../types/workplaceMastery';
import { workplaceMasteryService, EvaluationResult } from '../../services/workplaceMasteryService';
import { useWorkplaceMastery } from '../../context/WorkplaceMasteryContext';
import { DictationMicButton } from '../proLab/DictationMicButton';

interface DisagreementConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DisagreementConflictModal: React.FC<DisagreementConflictModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { recordCompletedDrill } = useWorkplaceMastery();
  const [caseIdx, setCaseIdx] = useState(0);
  const [userText, setUserText] = useState('');
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  const disputeCase = DISAGREEMENT_CONFLICT_CASES[caseIdx];

  if (!isOpen) return null;

  const handleEvaluate = () => {
    if (!userText.trim()) return;
    const result = workplaceMasteryService.evaluateDisagreement(userText, disputeCase);
    setEvaluation(result);
    recordCompletedDrill('disagreement', disputeCase.topicTitle, result);
  };

  const handleNext = () => {
    setEvaluation(null);
    setUserText('');
    setCaseIdx((prev) => (prev + 1) % DISAGREEMENT_CONFLICT_CASES.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-surface-hover/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">
                Professional Disagreement & Conflict Arena
              </h2>
              <p className="text-sm text-text-secondary">
                Separate ideas from people, articulate concrete trade-offs, and establish mutual alignment
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

        {/* Case tabs */}
        <div className="flex border-b border-border bg-background px-6 pt-2 gap-2">
          {DISAGREEMENT_CONFLICT_CASES.map((c, idx) => (
            <button
              key={c.id}
              onClick={() => {
                setCaseIdx(idx);
                setEvaluation(null);
                setUserText('');
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${
                caseIdx === idx
                  ? 'border-primary text-primary bg-surface'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              <span className="uppercase text-[10px] block opacity-70">
                {c.isConflict ? 'Interpersonal Friction' : 'Technical Disagreement'}
              </span>
              {c.topicTitle.split('for')[0]}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Situation Box */}
          <div className="p-5 rounded-2xl bg-surface-hover border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-text-primary">
                {disputeCase.topicTitle}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 font-medium">
                Counterpart: {disputeCase.counterpartRole}
              </span>
            </div>

            <p className="text-xs text-text-secondary">
              <strong>Counterpart's Stance:</strong> {disputeCase.counterpartStance}
            </p>
            <p className="text-xs text-text-secondary">
              <strong>Core Tension / Constraint:</strong> {disputeCase.rootIssue}
            </p>

            <div className="p-3 bg-background rounded-xl border border-border text-xs space-y-1">
              <span className="font-bold text-text-secondary uppercase tracking-wider block text-[10px]">
                Recommended Diplomatic Steps
              </span>
              <p className="text-text-secondary">
                1. <strong>Acknowledge:</strong> "{disputeCase.recommendedSteps.acknowledge}"
              </p>
              <p className="text-text-secondary">
                2. <strong>Objective Evidence:</strong> "{disputeCase.recommendedSteps.factsAndEvidence}"
              </p>
              <p className="text-text-secondary">
                3. <strong>Collaborative Compromise:</strong> "{disputeCase.recommendedSteps.collaborativeAlternative}"
              </p>
            </div>
          </div>

          {/* User Input */}
          {!evaluation ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Deliver Your Principled & Collaborative Position
                </label>
                <DictationMicButton
                  onTranscript={(txt) => setUserText((prev) => (prev ? `${prev} ${txt}` : txt))}
                  label="Dictate Response"
                />
              </div>
              <textarea
                rows={4}
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
                placeholder="I completely agree with the value of... However, our system constraint is... Could we explore an alternative like... Let's sync to benchmark..."
                className="w-full p-4 bg-background border border-border rounded-xl text-text-primary placeholder:text-text-tertiary text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleEvaluate}
                  disabled={!userText.trim()}
                  className="px-6 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
                >
                  Evaluate Diplomacy & Alignment
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
                  Disagreement Score: {evaluation.score}% -{' '}
                  {evaluation.isPassed ? 'High Alignment' : 'Needs Diplomacy'}
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
                  Model Benchmark Dialogue
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
                  <RotateCcw className="w-3.5 h-3.5" /> Retry
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-hover transition-colors flex items-center gap-1.5"
                >
                  Next Dispute Case <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
