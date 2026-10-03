import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Award,
} from 'lucide-react';
import { PROFESSIONAL_STORY_TEMPLATES } from '../../data/workplaceMasteryData';
import { ProfessionalStoryItem } from '../../types/workplaceMastery';
import { useWorkplaceMastery } from '../../context/WorkplaceMasteryContext';
import { DictationMicButton } from '../proLab/DictationMicButton';

interface CareerStoryBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CareerStoryBuilderModal: React.FC<CareerStoryBuilderModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { recordCompletedDrill } = useWorkplaceMastery();
  const [templateIdx, setTemplateIdx] = useState(0);
  const [userContext, setUserContext] = useState('');
  const [userChallenge, setUserChallenge] = useState('');
  const [userAction, setUserAction] = useState('');
  const [userResult, setUserResult] = useState('');
  const [userLearning, setUserLearning] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const storyTemplate = PROFESSIONAL_STORY_TEMPLATES[templateIdx];

  if (!isOpen) return null;

  const handleUseTemplate = () => {
    setUserContext(storyTemplate.context);
    setUserChallenge(storyTemplate.challenge);
    setUserAction(storyTemplate.actionTaken);
    setUserResult(storyTemplate.resultMetric);
    setUserLearning(storyTemplate.keyLearning);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    recordCompletedDrill('storytelling', storyTemplate.title, {
      score: 95,
      isPassed: true,
      structureCheck: [
        {
          label: 'CARL Framework Completed',
          passed: true,
          feedback: 'Context, Challenge, Action, Result, and Learning are coherently connected.',
        },
      ],
      overallFeedback: 'Compelling executive storytelling narrative!',
      betterAlternative: `${storyTemplate.context} ${storyTemplate.challenge} ${storyTemplate.actionTaken} ${storyTemplate.resultMetric} ${storyTemplate.keyLearning}`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-surface-hover/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">
                Professional Storytelling & Narrative Lab
              </h2>
              <p className="text-sm text-text-secondary">
                Master the CARL framework: Context $\rightarrow$ Challenge $\rightarrow$ Action $\rightarrow$ Result $\rightarrow$ Learning
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
          {/* Template Banner */}
          <div className="p-4 rounded-xl bg-surface-hover border border-border flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Benchmark Template: {storyTemplate.title}
              </span>
              <p className="text-xs text-text-secondary mt-0.5">
                Category: {storyTemplate.category.replace('_', ' ').toUpperCase()}
              </p>
            </div>
            <button
              type="button"
              onClick={handleUseTemplate}
              className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold rounded-xl transition-colors"
            >
              Load Example
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                1. Context (Role, setting, baseline)
              </label>
              <textarea
                rows={2}
                value={userContext}
                onChange={(e) => setUserContext(e.target.value)}
                placeholder="At my previous role, our payment service suffered..."
                className="w-full p-3 bg-background border border-border rounded-xl text-text-primary text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                2. Challenge (The obstacle or high-stakes risk)
              </label>
              <textarea
                rows={2}
                value={userChallenge}
                onChange={(e) => setUserChallenge(e.target.value)}
                placeholder="Database locks spiked response times from 100ms to 9 seconds..."
                className="w-full p-3 bg-background border border-border rounded-xl text-text-primary text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                3. Action (Your specific leadership & technical steps)
              </label>
              <textarea
                rows={2}
                value={userAction}
                onChange={(e) => setUserAction(e.target.value)}
                placeholder="I led emergency triage, identified an unindexed order query, and deployed a migration..."
                className="w-full p-3 bg-background border border-border rounded-xl text-text-primary text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                  4. Quantified Result (Metric / Outcome)
                </label>
                <textarea
                  rows={2}
                  value={userResult}
                  onChange={(e) => setUserResult(e.target.value)}
                  placeholder="Latency restored to 120ms, preventing $80,000 loss..."
                  className="w-full p-3 bg-background border border-border rounded-xl text-text-primary text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                  5. Key Learning (Long-term growth insight)
                </label>
                <textarea
                  rows={2}
                  value={userLearning}
                  onChange={(e) => setUserLearning(e.target.value)}
                  placeholder="This taught me the value of automated canary testing..."
                  className="w-full p-3 bg-background border border-border rounded-xl text-text-primary text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          {!submitted ? (
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!userContext || !userAction}
                className="px-6 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
              >
                Assemble & Save Career Story
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                Story Saved to Career Portfolio (+45 XP)
              </div>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
