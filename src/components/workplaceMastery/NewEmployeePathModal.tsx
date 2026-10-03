import React, { useState } from 'react';
import {
  X,
  Compass,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  User,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { ONBOARDING_SCENARIOS } from '../../data/workplaceMasteryData';
import { OnboardingScenario } from '../../types/workplaceMastery';
import { useWorkplaceMastery } from '../../context/WorkplaceMasteryContext';
import { DictationMicButton } from '../proLab/DictationMicButton';

interface NewEmployeePathModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewEmployeePathModal: React.FC<NewEmployeePathModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { recordCompletedDrill } = useWorkplaceMastery();
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const scenario = ONBOARDING_SCENARIOS[selectedScenarioIndex];

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!userResponse.trim()) return;

    const wordCount = userResponse.trim().split(/\s+/).length;
    const isQuality = wordCount >= 15;
    const score = isQuality ? 90 : 70;

    recordCompletedDrill('onboarding', scenario.title, {
      score,
      isPassed: score >= 75,
      structureCheck: [
        {
          label: 'Warm Professional Tone',
          passed: true,
          feedback: 'Approachable, collaborative, and clear phrasing.',
        },
        {
          label: 'Context & Relevance',
          passed: wordCount >= 12,
          feedback:
            wordCount >= 12
              ? 'Included meaningful context for colleagues.'
              : 'Add more substance regarding your specific tasks or questions.',
        },
      ],
      overallFeedback:
        score >= 75
          ? 'Great delivery! Balanced warmth with clear workplace focus.'
          : 'Good start. Remember to state what you are excited about or what you need clearly.',
      betterAlternative: scenario.keySamplePhrases.join(' '),
    });

    setSubmitted(true);
  };

  const handleNext = () => {
    setSubmitted(false);
    setUserResponse('');
    setSelectedScenarioIndex((prev) => (prev + 1) % ONBOARDING_SCENARIOS.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-surface-hover/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">
                New Employee Onboarding Path
              </h2>
              <p className="text-sm text-text-secondary">
                Master Day 1 introductions, asking where things are, and setting 30-day expectations
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

        {/* Phase Tabs */}
        <div className="flex border-b border-border bg-background px-6 pt-2 overflow-x-auto gap-2">
          {ONBOARDING_SCENARIOS.map((sc, idx) => (
            <button
              key={sc.id}
              onClick={() => {
                setSelectedScenarioIndex(idx);
                setSubmitted(false);
                setUserResponse('');
              }}
              className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
                selectedScenarioIndex === idx
                  ? 'border-primary text-primary bg-surface'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              <span className="uppercase tracking-wider opacity-70 block text-[10px]">
                {sc.phase.replace('_', ' ')}
              </span>
              {sc.title}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Interlocutor Prompt */}
          <div className="p-5 rounded-2xl bg-surface-hover border border-border/80 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                {scenario.interlocutor.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-text-primary">
                  {scenario.interlocutor.name}
                </h4>
                <p className="text-xs text-text-secondary">{scenario.interlocutor.role}</p>
              </div>
              <span className="ml-auto text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                Audience: {scenario.audienceType}
              </span>
            </div>
            <p className="text-sm text-text-primary italic border-l-2 border-primary pl-3 py-1">
              "{scenario.promptMessage}"
            </p>
            <p className="text-xs text-text-secondary">
              <strong>Context:</strong> {scenario.scenarioContext}
            </p>
          </div>

          {/* Guidelines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-background border border-border">
              <h5 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" /> Recommended Structure
              </h5>
              <ul className="text-xs text-text-secondary space-y-1.5 list-disc list-inside">
                {scenario.recommendedStructure.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-background border border-border">
              <h5 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-amber-500" /> Pro Tips
              </h5>
              <ul className="text-xs text-text-secondary space-y-1.5 list-disc list-inside">
                {scenario.hints.map((hint, idx) => (
                  <li key={idx}>{hint}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* User Input or Result */}
          {!submitted ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Your Workplace Response
                </label>
                <DictationMicButton
                  onTranscript={(txt) => setUserResponse((prev) => (prev ? `${prev} ${txt}` : txt))}
                  label="Speak Response"
                />
              </div>
              <textarea
                rows={4}
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
                placeholder="Type or dictate your workplace response here..."
                className="w-full p-4 bg-background border border-border rounded-xl text-text-primary placeholder:text-text-tertiary text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!userResponse.trim()}
                  className="px-6 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
                >
                  Submit & Evaluate
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-4">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                Drill Completed (+45 XP Awarded)
              </div>
              <div>
                <h5 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">
                  Model Professional Script
                </h5>
                <div className="p-3 bg-background rounded-xl border border-border text-xs text-text-primary space-y-1">
                  {scenario.keySamplePhrases.map((phrase, idx) => (
                    <p key={idx} className="leading-relaxed">
                      • {phrase}
                    </p>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-hover transition-colors flex items-center gap-1.5"
                >
                  Next Onboarding Scenario
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
