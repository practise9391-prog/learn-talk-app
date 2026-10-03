import React, { useState } from 'react';
import {
  X,
  Briefcase,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Zap,
  HelpCircle,
} from 'lucide-react';
import { EXECUTIVE_BRIEFING_CASES } from '../../data/workplaceMasteryData';
import { ExecutiveBriefingCase } from '../../types/workplaceMastery';
import { workplaceMasteryService, EvaluationResult } from '../../services/workplaceMasteryService';
import { useWorkplaceMastery } from '../../context/WorkplaceMasteryContext';
import { DictationMicButton } from '../proLab/DictationMicButton';

interface ExecutiveBriefingLabModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExecutiveBriefingLabModal: React.FC<ExecutiveBriefingLabModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { recordCompletedDrill } = useWorkplaceMastery();
  const [caseIdx, setCaseIdx] = useState(0);
  const [userText, setUserText] = useState('');
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [answeredQuestion, setAnsweredQuestion] = useState(false);

  const execCase = EXECUTIVE_BRIEFING_CASES[caseIdx];

  if (!isOpen) return null;

  const handleEvaluate = () => {
    if (!userText.trim()) return;
    const result = workplaceMasteryService.evaluateExecutiveBriefing(userText, execCase);
    setEvaluation(result);
    recordCompletedDrill('exec_briefing', `BLUF: ${execCase.executiveTitle}`, result);
  };

  const handleAnswerQuestion = () => {
    if (!userAnswer.trim()) return;
    setAnsweredQuestion(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-surface-hover/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">
                Executive Briefing & Rapid Q&A Lab
              </h2>
              <p className="text-sm text-text-secondary">
                Deliver Bottom-Line-Up-Front (BLUF) updates and handle tough C-suite follow-ups
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
          {/* Situation Brief */}
          <div className="p-5 rounded-2xl bg-surface-hover border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-text-primary">
                Executive Recipient: {execCase.executiveTitle}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                BLUF Protocol (&lt;110 words)
              </span>
            </div>

            <p className="text-xs text-text-secondary">
              <strong>Core Situation:</strong> {execCase.coreSituation}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-background rounded-xl border border-border space-y-1">
                <span className="font-semibold text-text-primary block">Business Impact:</span>
                <p className="text-text-secondary">{execCase.businessImpact}</p>
              </div>
              <div className="p-3 bg-background rounded-xl border border-border space-y-1">
                <span className="font-semibold text-text-primary block">Decision Needed:</span>
                <p className="text-text-secondary">{execCase.decisionNeeded}</p>
              </div>
            </div>
          </div>

          {/* User Input or Evaluation */}
          {!evaluation ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Deliver Your BLUF Executive Briefing
                </label>
                <DictationMicButton
                  onTranscript={(txt) => setUserText((prev) => (prev ? `${prev} ${txt}` : txt))}
                  label="Dictate BLUF"
                />
              </div>
              <textarea
                rows={4}
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
                placeholder="Bottom line up front: We can save $14,000 monthly by... The business impact is... We recommend... We need your approval to..."
                className="w-full p-4 bg-background border border-border rounded-xl text-text-primary placeholder:text-text-tertiary text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              />
              <div className="flex justify-between items-center text-xs text-text-tertiary">
                <span>Word count: {userText.trim() ? userText.trim().split(/\s+/).length : 0} words</span>
                <button
                  type="button"
                  onClick={handleEvaluate}
                  disabled={!userText.trim()}
                  className="px-6 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
                >
                  Analyze Executive Brief
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
                  Executive Score: {evaluation.score}% -{' '}
                  {evaluation.isPassed ? 'Actionable & Crisp' : 'Needs Compression'}
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

              {/* Rapid Q&A section */}
              <div className="p-4 bg-surface-hover rounded-xl border border-border space-y-3">
                <h5 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-primary" /> Rapid-Fire Executive Follow-Up Questions
                </h5>
                <div className="space-y-2">
                  {execCase.rapidQuestions.map((q, qIdx) => (
                    <div
                      key={qIdx}
                      className="p-3 bg-background rounded-xl border border-border text-xs space-y-2"
                    >
                      <span className="font-semibold text-text-primary block">
                        CTO: "{q.question}"
                      </span>
                      {activeQuestionIdx === qIdx ? (
                        <div className="space-y-2 pt-1">
                          {!answeredQuestion ? (
                            <>
                              <textarea
                                rows={2}
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                placeholder="Give a concise direct answer..."
                                className="w-full p-2.5 bg-surface border border-border rounded-lg text-text-primary text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                              />
                              <div className="flex justify-end">
                                <button
                                  type="button"
                                  onClick={handleAnswerQuestion}
                                  className="px-3 py-1 bg-primary text-white font-medium rounded-lg text-xs"
                                >
                                  Answer CTO
                                </button>
                              </div>
                            </>
                          ) : (
                            <div className="p-2.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-xs space-y-1">
                              <span className="font-semibold text-emerald-600 block">
                                Benchmark Executive Response:
                              </span>
                              <p className="text-text-primary italic">"{q.idealAnswer}"</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveQuestionIdx(qIdx);
                            setUserAnswer('');
                            setAnsweredQuestion(false);
                          }}
                          className="px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-xs font-medium"
                        >
                          Respond to this question
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEvaluation(null)}
                  className="px-4 py-2 border border-border rounded-xl text-xs font-semibold text-text-secondary hover:bg-surface transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retry Briefing
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-hover transition-colors flex items-center gap-1.5"
                >
                  Complete Lab
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
