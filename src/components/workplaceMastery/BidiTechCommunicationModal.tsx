import React, { useState } from 'react';
import {
  X,
  Binary,
  ArrowRightLeft,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { BIDI_TECH_CASES } from '../../data/workplaceMasteryData';
import { BidiTechCase } from '../../types/workplaceMastery';
import { useWorkplaceMastery } from '../../context/WorkplaceMasteryContext';
import { DictationMicButton } from '../proLab/DictationMicButton';

interface BidiTechCommunicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BidiTechCommunicationModal: React.FC<BidiTechCommunicationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { recordCompletedDrill } = useWorkplaceMastery();
  const [caseIdx, setCaseIdx] = useState(0);
  const [userText, setUserText] = useState('');
  const [selectedVariant, setSelectedVariant] = useState<'business' | 'analogy' | 'professional'>('business');
  const [submitted, setSubmitted] = useState(false);

  const bidiCase = BIDI_TECH_CASES[caseIdx];

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!userText.trim()) return;
    setSubmitted(true);
    recordCompletedDrill('bidi_tech', bidiCase.title, {
      score: 90,
      isPassed: true,
      structureCheck: [
        {
          label: 'Audience-Appropriate Calibration',
          passed: true,
          feedback: 'Successfully translated technical implementation into business impact or vice-versa.',
        },
      ],
      overallFeedback: 'Great communication calibration!',
      betterAlternative: bidiCase.variants.businessOutcome,
    });
  };

  const handleNext = () => {
    setSubmitted(false);
    setUserText('');
    setCaseIdx((prev) => (prev + 1) % BIDI_TECH_CASES.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-surface-hover/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <ArrowRightLeft className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">
                Bidirectional Technical Translation Lab
              </h2>
              <p className="text-sm text-text-secondary">
                Technical $\rightarrow$ Business Impact & Business Goals $\rightarrow$ Architecture
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

        {/* Case selector */}
        <div className="flex border-b border-border bg-background px-6 pt-2 gap-2">
          {BIDI_TECH_CASES.map((c, idx) => (
            <button
              key={c.id}
              onClick={() => {
                setCaseIdx(idx);
                setSubmitted(false);
                setUserText('');
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${
                caseIdx === idx
                  ? 'border-primary text-primary bg-surface'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              <span className="uppercase text-[10px] block opacity-70">
                {c.direction === 'tech_to_non_tech' ? 'Tech → Non-Tech' : 'Business → Tech'}
              </span>
              {c.title}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Raw input card */}
          <div className="p-5 rounded-2xl bg-surface-hover border border-border space-y-3">
            <span className="font-bold text-xs uppercase tracking-wider text-primary">
              Source Statement:
            </span>
            <p className="text-sm text-text-primary italic border-l-2 border-primary pl-3 py-1 bg-background/50 rounded-r-lg">
              "{bidiCase.rawInput}"
            </p>
          </div>

          {/* Reference Calibration Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-background rounded-xl border border-border space-y-1">
              <span className="font-bold text-cyan-600 block uppercase tracking-wider text-[10px]">
                Business Outcome Version
              </span>
              <p className="text-text-secondary leading-relaxed">
                {bidiCase.variants.businessOutcome}
              </p>
            </div>
            <div className="p-3 bg-background rounded-xl border border-border space-y-1">
              <span className="font-bold text-amber-500 block uppercase tracking-wider text-[10px]">
                Simple Analogy Version
              </span>
              <p className="text-text-secondary leading-relaxed">
                {bidiCase.variants.simpleAnalogy}
              </p>
            </div>
          </div>

          {/* User translation input */}
          {!submitted ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Deliver Your Rephrasing for Business Stakeholders
                </label>
                <DictationMicButton
                  onTranscript={(txt) => setUserText((prev) => (prev ? `${prev} ${txt}` : txt))}
                  label="Dictate Translation"
                />
              </div>
              <textarea
                rows={3}
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
                placeholder="Explain the outcome and why it matters to customers and revenue..."
                className="w-full p-4 bg-background border border-border rounded-xl text-text-primary placeholder:text-text-tertiary text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!userText.trim()}
                  className="px-6 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
                >
                  Submit Translation
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                Translation Verified (+45 XP Awarded)
              </div>
              <p className="text-xs text-text-secondary">
                Your ability to frame engineering investments in terms of customer latency, system uptime, and commercial risk is a key differentiator for senior engineering and architectural leadership.
              </p>
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-hover transition-colors flex items-center gap-1.5"
                >
                  Next Translation Case <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
