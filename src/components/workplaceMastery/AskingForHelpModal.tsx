import React, { useState } from 'react';
import {
  X,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Code2,
  UserCheck,
  RotateCcw,
} from 'lucide-react';
import { ASKING_FOR_HELP_SCENARIOS } from '../../data/workplaceMasteryData';
import { AskingForHelpScenario } from '../../types/workplaceMastery';
import { workplaceMasteryService, EvaluationResult } from '../../services/workplaceMasteryService';
import { useWorkplaceMastery } from '../../context/WorkplaceMasteryContext';
import { DictationMicButton } from '../proLab/DictationMicButton';

interface AskingForHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AskingForHelpModal: React.FC<AskingForHelpModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { recordCompletedDrill } = useWorkplaceMastery();
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [userText, setUserText] = useState('');
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  const scenario = ASKING_FOR_HELP_SCENARIOS[scenarioIdx];

  if (!isOpen) return null;

  const handleEvaluate = () => {
    if (!userText.trim()) return;
    const result = workplaceMasteryService.evaluateHelpRequest(userText, scenario);
    setEvaluation(result);
    recordCompletedDrill('asking_help', scenario.title, result);
  };

  const handleNext = () => {
    setEvaluation(null);
    setUserText('');
    setScenarioIdx((prev) => (prev + 1) % ASKING_FOR_HELP_SCENARIOS.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-surface-hover/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">
                Asking for Help Lab (4-Part Framework)
              </h2>
              <p className="text-sm text-text-secondary">
                Context $\rightarrow$ What I Tried $\rightarrow$ What’s Unclear $\rightarrow$ Specific Question
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

        {/* Case Selector */}
        <div className="flex border-b border-border bg-background px-6 pt-2 gap-2 overflow-x-auto">
          {ASKING_FOR_HELP_SCENARIOS.map((sc, idx) => (
            <button
              key={sc.id}
              onClick={() => {
                setScenarioIdx(idx);
                setEvaluation(null);
                setUserText('');
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
                scenarioIdx === idx
                  ? 'border-primary text-primary bg-surface'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              {sc.title}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Situation Brief */}
          <div className="p-5 rounded-2xl bg-surface-hover border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Target Recipient: {scenario.targetPerson.toUpperCase()}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                4-Part Method
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-background rounded-xl border border-border">
                <span className="font-semibold text-text-primary block mb-1 text-[11px] uppercase">
                  1. Problem Context
                </span>
                <p className="text-text-secondary leading-relaxed">{scenario.problemContext}</p>
              </div>
              <div className="p-3 bg-background rounded-xl border border-border">
                <span className="font-semibold text-text-primary block mb-1 text-[11px] uppercase">
                  2. What You Already Tried
                </span>
                <p className="text-text-secondary leading-relaxed">{scenario.whatTriedContext}</p>
              </div>
              <div className="p-3 bg-background rounded-xl border border-border">
                <span className="font-semibold text-text-primary block mb-1 text-[11px] uppercase">
                  3. What You Don’t Understand
                </span>
                <p className="text-text-secondary leading-relaxed">{scenario.missingInformation}</p>
              </div>
            </div>
          </div>

          {/* Input Area */}
          {!evaluation ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Draft Your Professional Help Request
                </label>
                <DictationMicButton
                  onTranscript={(txt) => setUserText((prev) => (prev ? `${prev} ${txt}` : txt))}
                  label="Dictate Message"
                />
              </div>
              <textarea
                rows={4}
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
                placeholder="Hi [Name], do you have a few minutes? I'm working on... I already checked... but I'm still trying to understand... Could you point me to...?"
                className="w-full p-4 bg-background border border-border rounded-xl text-text-primary placeholder:text-text-tertiary text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleEvaluate}
                  disabled={!userText.trim()}
                  className="px-6 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
                >
                  Evaluate Request
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Score header */}
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
                  Structure Score: {evaluation.score}% -{' '}
                  {evaluation.isPassed ? 'Passed' : 'Needs Polish'}
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
                  Model Benchmark Phrasing
                </span>
                <p className="text-text-primary leading-relaxed italic">
                  "{evaluation.betterAlternative}"
                </p>
              </div>

              {/* Action buttons */}
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
                  Next Scenario <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
