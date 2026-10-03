import React, { useState } from 'react';
import {
  X,
  Handshake,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Copy,
  Check,
  Target,
  ArrowRight,
} from 'lucide-react';
import { useWorkplaceCommunication } from '../../context/WorkplaceCommunicationContext';
import { NegotiationSimulationCase } from '../../types/workplace';

interface NegotiationStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NegotiationStudioModal: React.FC<NegotiationStudioModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { negotiationCases } = useWorkplaceCommunication();

  const [activeCase, setActiveCase] = useState<NegotiationSimulationCase>(negotiationCases[0]);
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const currentStage = activeCase.stages[activeStageIndex];

  const handleCopyPhrase = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl bg-card border border-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <Handshake size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-text">Principled Negotiation Studio</h2>
              <p className="text-xs text-text-muted">
                Navigate scope trade-offs, deadlines, and commercial terms without creating resentment
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Negotiation Overview Card */}
          <div className="p-6 rounded-3xl bg-surface border border-border space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 block">
                  Scenario Focus: {activeCase.topic.replace('_', ' ')}
                </span>
                <h3 className="text-base font-black text-text mt-0.5">{activeCase.title}</h3>
              </div>
            </div>

            <p className="text-xs text-text-muted leading-relaxed">{activeCase.backgroundContext}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
                <span className="text-[10px] font-bold text-rose-500 uppercase">Counterpart Stakeholder Goal:</span>
                <p className="text-xs text-text">{activeCase.counterpartGoal}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
                <span className="text-[10px] font-bold text-primary uppercase">Your Strategic Objective:</span>
                <p className="text-xs text-text">{activeCase.learnerObjective}</p>
              </div>
            </div>
          </div>

          {/* 5-Stage Stepper Navigation */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-surface border border-border">
            {activeCase.stages.map((stg, idx) => {
              const isSelected = activeStageIndex === idx;
              return (
                <button
                  key={stg.stage}
                  type="button"
                  onClick={() => setActiveStageIndex(idx)}
                  className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition-all text-center ${
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'text-text-muted hover:text-text hover:bg-card'
                  }`}
                >
                  {stg.label}
                </button>
              );
            })}
          </div>

          {/* Active Stage Card */}
          <div className="p-6 rounded-3xl bg-surface border border-border space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h4 className="text-sm font-black text-text">{currentStage.label}</h4>
              <span className="text-xs font-mono text-text-muted">
                Stage {activeStageIndex + 1} of {activeCase.stages.length}
              </span>
            </div>

            {/* Guiding Strategic Questions */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">
                Key Strategic Questions to Ask Yourself:
              </span>
              <ul className="space-y-1 text-xs text-text">
                {currentStage.guidingQuestions.map((q, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-primary font-bold">•</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Model Negotiation Phrasing */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                High-Impact Principled Phrasing:
              </span>
              <div className="space-y-2">
                {currentStage.modelPhrases.map((phrase, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-card border border-border flex items-start justify-between gap-3"
                  >
                    <p className="text-xs sm:text-sm text-text leading-relaxed font-medium">
                      "{phrase}"
                    </p>
                    <button
                      type="button"
                      onClick={() => handleCopyPhrase(phrase, idx)}
                      className="p-1.5 rounded-lg bg-surface border border-border text-text hover:text-primary transition-colors shrink-0"
                    >
                      {copiedIndex === idx ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Stage Button */}
            <div className="pt-2 flex justify-end">
              {activeStageIndex + 1 < activeCase.stages.length ? (
                <button
                  type="button"
                  onClick={() => setActiveStageIndex((prev) => prev + 1)}
                  className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 hover:opacity-90"
                >
                  <span>Next Stage</span>
                  <ArrowRight size={13} />
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 size={14} /> Full Negotiation Loop Mastered
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-surface/30 flex items-center justify-between">
          <span className="text-xs text-text-muted">
            Negotiate on interests and shared goals, never on rigid positional demands.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-text hover:bg-card transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
