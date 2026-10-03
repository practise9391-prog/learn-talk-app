import React, { useState } from 'react';
import {
  X,
  Layers,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { PROJECT_STATUS_CASES } from '../../data/workplaceMasteryData';
import { ProjectStatusCase, ProjectHealthStatus } from '../../types/workplaceMastery';
import { workplaceMasteryService, EvaluationResult } from '../../services/workplaceMasteryService';
import { useWorkplaceMastery } from '../../context/WorkplaceMasteryContext';
import { DictationMicButton } from '../proLab/DictationMicButton';

interface ProjectStatusLabModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectStatusLabModal: React.FC<ProjectStatusLabModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { recordCompletedDrill } = useWorkplaceMastery();
  const [caseIdx, setCaseIdx] = useState(0);
  const [userText, setUserText] = useState('');
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  const statusCase = PROJECT_STATUS_CASES[caseIdx];

  if (!isOpen) return null;

  const handleEvaluate = () => {
    if (!userText.trim()) return;
    const result = workplaceMasteryService.evaluateProjectStatus(userText, statusCase);
    setEvaluation(result);
    recordCompletedDrill('status_lab', statusCase.projectName, result);
  };

  const handleNext = () => {
    setEvaluation(null);
    setUserText('');
    setCaseIdx((prev) => (prev + 1) % PROJECT_STATUS_CASES.length);
  };

  const getBadgeStyle = (health: ProjectHealthStatus) => {
    switch (health) {
      case 'green':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30';
      case 'yellow':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/30';
      case 'red':
        return 'bg-rose-500/10 text-rose-600 border-rose-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-surface-hover/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">
                Project Status Lab (Green / Yellow / Red)
              </h2>
              <p className="text-sm text-text-secondary">
                Communicate progress, risks, delays, next actions, and required stakeholder decisions
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
          {PROJECT_STATUS_CASES.map((sc, idx) => (
            <button
              key={sc.id}
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
              {sc.projectName}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Situation Box */}
          <div className="p-5 rounded-2xl bg-surface-hover border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-text-primary">
                {statusCase.projectName}
              </span>
              <span
                className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider border ${getBadgeStyle(
                  statusCase.health
                )}`}
              >
                Status: {statusCase.health}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-background rounded-xl border border-border space-y-1">
                <span className="font-semibold text-text-primary block">Progress Accomplished:</span>
                <p className="text-text-secondary">{statusCase.progressSummary}</p>
              </div>
              <div className="p-3 bg-background rounded-xl border border-border space-y-1">
                <span className="font-semibold text-text-primary block">Active Risks & Bottlenecks:</span>
                <ul className="text-text-secondary space-y-0.5 list-disc list-inside">
                  {statusCase.risksIdentified.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-3 bg-background rounded-xl border border-border text-xs">
              <span className="font-semibold text-text-primary block mb-0.5">Required Stakeholder Support:</span>
              <p className="text-text-secondary">{statusCase.requiredSupport}</p>
            </div>
          </div>

          {/* User Status Report Input */}
          {!evaluation ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Deliver Your Project Status Report
                </label>
                <DictationMicButton
                  onTranscript={(txt) => setUserText((prev) => (prev ? `${prev} ${txt}` : txt))}
                  label="Dictate Update"
                />
              </div>
              <textarea
                rows={4}
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
                placeholder="Project status is [YELLOW/RED]. We have completed... The primary risk is... Next steps include... What we need from leadership is..."
                className="w-full p-4 bg-background border border-border rounded-xl text-text-primary placeholder:text-text-tertiary text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleEvaluate}
                  disabled={!userText.trim()}
                  className="px-6 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
                >
                  Analyze Status Report
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
                  Report Score: {evaluation.score}% -{' '}
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
                  Model Professional Status Report
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
                  Next Project Case <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
