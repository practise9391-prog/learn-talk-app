import React, { useState } from 'react';
import {
  X,
  Headphones,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Volume2,
  Calendar,
  AlertTriangle,
  GitBranch,
} from 'lucide-react';
import { TASK_UNDERSTANDING_CASES } from '../../data/workplaceMasteryData';
import { TaskUnderstandingCase } from '../../types/workplaceMastery';
import { workplaceMasteryService, EvaluationResult } from '../../services/workplaceMasteryService';
import { useWorkplaceMastery } from '../../context/WorkplaceMasteryContext';
import { DictationMicButton } from '../proLab/DictationMicButton';

interface TaskUnderstandingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TaskUnderstandingModal: React.FC<TaskUnderstandingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { recordCompletedDrill } = useWorkplaceMastery();
  const [caseIdx, setCaseIdx] = useState(0);
  const [userText, setUserText] = useState('');
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  const taskCase = TASK_UNDERSTANDING_CASES[caseIdx];

  if (!isOpen) return null;

  const playManagerAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(taskCase.audioPromptText);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleEvaluate = () => {
    if (!userText.trim()) return;
    const result = workplaceMasteryService.evaluateTaskConfirmation(userText, taskCase);
    setEvaluation(result);
    recordCompletedDrill('task_understanding', taskCase.taskTitle, result);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-surface-hover/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">
                Task Understanding & Confirmation Lab
              </h2>
              <p className="text-sm text-text-secondary">
                Listen to spoken requirements, identify constraints, and confirm understanding
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
          {/* Spoken Manager Instruction */}
          <div className="p-5 rounded-2xl bg-surface-hover border border-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-text-primary text-sm">
                  {taskCase.managerName}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-medium">
                  Spoken Instruction
                </span>
              </div>
              <button
                type="button"
                onClick={playManagerAudio}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold rounded-xl transition-colors"
              >
                <Volume2 className="w-4 h-4" /> Listen to Audio
              </button>
            </div>

            <p className="text-sm text-text-primary italic border-l-2 border-purple-500 pl-3 py-1 bg-background/50 rounded-r-lg">
              "{taskCase.audioPromptText}"
            </p>
          </div>

          {/* Key Parameters to Catch */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-background rounded-xl border border-border flex items-start gap-2">
              <Calendar className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-text-primary block">Target Deadline</span>
                <span className="text-text-secondary">{taskCase.correctDetails.deadline}</span>
              </div>
            </div>
            <div className="p-3 bg-background rounded-xl border border-border flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-text-primary block">Priority Level</span>
                <span className="text-text-secondary uppercase">{taskCase.correctDetails.priority}</span>
              </div>
            </div>
            <div className="p-3 bg-background rounded-xl border border-border flex items-start gap-2">
              <GitBranch className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-text-primary block">Dependencies</span>
                <span className="text-text-secondary">Mobile team compatibility</span>
              </div>
            </div>
          </div>

          {/* User Confirmation Input */}
          {!evaluation ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Confirm Understanding to Manager ("Just to confirm...")
                </label>
                <DictationMicButton
                  onTranscript={(txt) => setUserText((prev) => (prev ? `${prev} ${txt}` : txt))}
                  label="Dictate Confirmation"
                />
              </div>
              <textarea
                rows={4}
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
                placeholder="Just to confirm I have the full picture: The deliverable is... by Thursday... with mobile team dependencies..."
                className="w-full p-4 bg-background border border-border rounded-xl text-text-primary placeholder:text-text-tertiary text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleEvaluate}
                  disabled={!userText.trim()}
                  className="px-6 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
                >
                  Verify Understanding
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
                  Listening & Paraphrasing: {evaluation.score}% -{' '}
                  {evaluation.isPassed ? 'Confirmed' : 'Missed Points'}
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
                  Model Paraphrasing Phrasing
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
                  onClick={onClose}
                  className="px-5 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-hover transition-colors flex items-center gap-1.5"
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
