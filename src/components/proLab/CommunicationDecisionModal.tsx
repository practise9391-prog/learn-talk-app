import React, { useState } from 'react';
import {
  X,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react';
import { useProLab } from '../../context/ProLabContext';
import { DecisionApproach } from '../../types/proLab';
import { DictationMicButton } from './DictationMicButton';

interface CommunicationDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommunicationDecisionModal: React.FC<CommunicationDecisionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { decisionCases, evaluateDecision } = useProLab();
  const currentCase = decisionCases[0];

  const [selectedApproach, setSelectedApproach] = useState<DecisionApproach | null>(null);
  const [userRationale, setUserRationale] = useState('');
  const [evaluation, setEvaluation] = useState<{
    score: number;
    alignment: string;
    feedback: string[];
  } | null>(null);

  if (!isOpen) return null;

  const handleEvaluate = () => {
    if (!selectedApproach || !userRationale.trim()) return;
    const res = evaluateDecision(currentCase.id, selectedApproach, userRationale);
    setEvaluation(res);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[92vh] bg-surface rounded-3xl border border-border shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-card/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Compass size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 px-2.5 py-0.5 rounded-full">
                  Decision Lab • What Would You Say?
                </span>
                <span className="text-[10px] font-bold text-amber-500 px-2 py-0.5 rounded-full bg-amber-500/10 uppercase">
                  Urgency: {currentCase.urgency}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-text">
                {currentCase.situationTitle}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-card transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Situation Context */}
          <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
            <span className="text-xs font-bold text-text block">The Dilemma:</span>
            <p className="text-xs text-text-muted leading-relaxed">
              {currentCase.dilemmaContext}
            </p>
            <div className="text-[11px] text-text-muted">
              Stakeholders Involved: {currentCase.stakeholdersInvolved.join(', ')}
            </div>
          </div>

          {/* Step 1: Choose Strategic Approach */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-text uppercase tracking-wider block">
              Step 1: Select Your Communication Stance
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentCase.approaches.map((app) => {
                const isSelected = selectedApproach?.id === app.id;
                return (
                  <div
                    key={app.id}
                    onClick={() => {
                      setSelectedApproach(app);
                      setEvaluation(null);
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'border-primary bg-primary/10 shadow-xs'
                        : 'border-border bg-card hover:border-primary/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black text-text">{app.approachName}</span>
                        {isSelected && <CheckCircle2 size={15} className="text-primary" />}
                      </div>
                      <p className="text-[11px] text-text-muted leading-relaxed">{app.rationale}</p>
                    </div>

                    <div className="space-y-1 pt-2 border-t border-border/50 text-[11px]">
                      <div className="text-emerald-600 font-medium">✓ Pro: {app.pros}</div>
                      <div className="text-amber-500 font-medium">⚠ Con: {app.cons}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Speak or Write actual communication */}
          {selectedApproach && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-text">
                  Step 2: Speak or Write What You Would Actually Say:
                </label>
                <DictationMicButton
                  onTranscript={(t: string) => setUserRationale((prev) => (prev ? `${prev} ${t}` : t))}
                />
              </div>

              <textarea
                value={userRationale}
                onChange={(e) => setUserRationale(e.target.value)}
                placeholder={`Frame your response using the "${selectedApproach.approachName}" stance. State the facts, risk mitigation, and recommended plan...`}
                rows={4}
                className="w-full p-4 rounded-2xl bg-card border border-border text-xs text-text placeholder:text-text-muted/60 focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none leading-relaxed"
              />

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-text-muted">
                  Recommended approach phrasing: "{selectedApproach.recommendedPhrasing}"
                </span>

                <button
                  type="button"
                  onClick={handleEvaluate}
                  disabled={!userRationale.trim()}
                  className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50 transition-opacity shadow-xs shrink-0"
                >
                  <Sparkles size={13} />
                  <span>Evaluate Stance</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Evaluation & Consequence Feedback */}
          {evaluation && (
            <div className="p-5 rounded-2xl bg-card border border-primary/30 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-text">{evaluation.alignment}</span>
                <span className="font-mono font-black text-sm text-primary px-2.5 py-0.5 rounded bg-primary/10">
                  {evaluation.score}%
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <span className="font-bold text-text">Communication Consequences & Feedback:</span>
                <ul className="text-text-muted list-disc list-inside space-y-1">
                  {evaluation.feedback.map((fb, i) => (
                    <li key={i}>{fb}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-surface border border-border text-xs space-y-1">
                <span className="font-bold text-text block text-[11px] uppercase">
                  Best Practice Principle:
                </span>
                <p className="text-text-muted leading-relaxed">
                  {currentCase.bestPracticeGuidance}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
