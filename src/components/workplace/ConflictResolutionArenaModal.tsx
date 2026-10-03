import React, { useState } from 'react';
import {
  X,
  Scale,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ChevronRight,
  Shield,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useWorkplaceCommunication } from '../../context/WorkplaceCommunicationContext';
import { ConflictScenario } from '../../types/workplace';

interface ConflictResolutionArenaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConflictResolutionArenaModal: React.FC<ConflictResolutionArenaModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { conflictScenarios } = useWorkplaceCommunication();

  const [activeScenario, setActiveScenario] = useState<ConflictScenario>(conflictScenarios[0]);
  const [activeStyle, setActiveStyle] = useState<'direct' | 'diplomatic' | 'technical'>('diplomatic');
  const [copied, setCopied] = useState(false);
  const [userPracticeText, setUserPracticeText] = useState('');
  const [practiceFeedback, setPracticeFeedback] = useState<any | null>(null);

  if (!isOpen) return null;

  const currentPhrase = activeScenario.disagreementStyles[activeStyle];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentPhrase);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEvaluatePractice = () => {
    if (!userPracticeText.trim()) return;
    const lower = userPracticeText.toLowerCase();

    const hasAcknowledge = lower.includes('understand') || lower.includes('agree') || lower.includes('point') || lower.includes('perspective');
    const hasEvidence = lower.includes('because') || lower.includes('data') || lower.includes('risk') || lower.includes('cost') || lower.includes('latency');
    const hasAlternative = lower.includes('what if') || lower.includes('propose') || lower.includes('instead') || lower.includes('could we');

    const score = Math.round(
      (hasAcknowledge ? 33 : 15) + (hasEvidence ? 34 : 20) + (hasAlternative ? 33 : 15)
    );

    setPracticeFeedback({
      score,
      hasAcknowledge,
      hasEvidence,
      hasAlternative,
      verdict:
        score >= 85
          ? 'Exceptional constructive disagreement! You validated their perspective, backed your counterpoint with evidence, and offered a collaborative path forward.'
          : 'Good foundation. Make sure to first acknowledge their goal before proposing the alternative.',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl bg-card border border-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
              <Scale size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-text">Conflict Resolution & Disagreement Arena</h2>
              <p className="text-xs text-text-muted">
                Navigate technical impasses, scope collisions, and priority friction through structured de-escalation
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
          {/* Conflict Selector */}
          <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-surface border border-border">
            <span className="text-xs font-bold text-text-muted mr-1">Scenario:</span>
            {conflictScenarios.map((cs) => (
              <button
                key={cs.id}
                type="button"
                onClick={() => {
                  setActiveScenario(cs);
                  setPracticeFeedback(null);
                  setUserPracticeText('');
                }}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                  activeScenario.id === cs.id
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-card hover:bg-border text-text'
                }`}
              >
                {cs.title}
              </button>
            ))}
          </div>

          {/* Scenario Overview Card */}
          <div className="p-6 rounded-3xl bg-surface border border-border space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-2.5">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-500 block">
                  Category: {activeScenario.category.replace('_', ' ')}
                </span>
                <h3 className="text-base font-black text-text mt-0.5">{activeScenario.title}</h3>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                <span className="font-bold text-text">Parties:</span>
                <span>{activeScenario.partiesInvolved.join(' vs ')}</span>
              </div>
            </div>

            <p className="text-xs text-text leading-relaxed">
              <span className="font-bold text-text">Underlying Tension:</span> {activeScenario.underlyingTension}
            </p>
          </div>

          {/* 6-Step De-Escalation Roadmap */}
          <div className="p-6 rounded-3xl bg-surface border border-border space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-primary">
              6-Step Principled De-Escalation Framework
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { step: '1. Understand', text: activeScenario.frameworkSteps.understand },
                { step: '2. Clarify', text: activeScenario.frameworkSteps.clarify },
                { step: '3. Explain', text: activeScenario.frameworkSteps.explain },
                { step: '4. Common Ground', text: activeScenario.frameworkSteps.findCommonGround },
                { step: '5. Propose Solution', text: activeScenario.frameworkSteps.proposeSolution },
                { step: '6. Confirm Next Step', text: activeScenario.frameworkSteps.confirmNextStep },
              ].map((s, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
                  <span className="text-[11px] font-black uppercase text-primary block">{s.step}</span>
                  <p className="text-xs text-text leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Disagreement Style Switcher */}
          <div className="p-6 rounded-3xl bg-surface border border-border space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-primary block">
                  3 Professional Disagreement Formulations
                </span>
                <h4 className="text-sm font-black text-text">Select Delivery Strategy</h4>
              </div>

              <div className="flex items-center gap-1.5 bg-card p-1 rounded-2xl border border-border">
                {(['direct', 'diplomatic', 'technical'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setActiveStyle(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                      activeStyle === st
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'text-text-muted hover:text-text'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border flex items-start justify-between gap-4">
              <p className="text-xs sm:text-sm text-text leading-relaxed font-normal">
                "{currentPhrase}"
              </p>
              <button
                type="button"
                onClick={handleCopy}
                className="p-2 rounded-xl bg-surface border border-border text-text hover:text-primary transition-colors shrink-0"
                title="Copy phrasing"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          {/* Interactive Disagreement Practice */}
          <div className="p-6 rounded-3xl bg-surface border border-primary/30 space-y-4">
            <h4 className="text-sm font-black text-text">Practice Crafting Your Disagreement</h4>
            <p className="text-xs text-text-muted">
              Respond to this impasse in your own words using the formula: Acknowledge Goal → State Evidence/Risk → Propose Collaborative Next Step.
            </p>

            <textarea
              rows={3}
              value={userPracticeText}
              onChange={(e) => setUserPracticeText(e.target.value)}
              placeholder="e.g. I see the value in independent deployment, however given our current team size..."
              className="w-full p-4 rounded-2xl bg-card border border-border text-xs sm:text-sm text-text placeholder:text-text-muted/60 focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none"
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleEvaluatePractice}
                disabled={!userPracticeText.trim()}
                className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                <Sparkles size={14} />
                <span>Evaluate Diplomatic Tone</span>
              </button>
            </div>

            {practiceFeedback && (
              <div className="p-4 rounded-2xl bg-card border border-border space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-text">Conflict De-Escalation Score:</span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-primary/10 text-primary font-mono font-bold text-xs">
                    {practiceFeedback.score}%
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div
                    className={`p-2 rounded-xl border ${
                      practiceFeedback.hasAcknowledge
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 font-bold'
                        : 'bg-surface border-border text-text-muted'
                    }`}
                  >
                    1. Acknowledgment
                  </div>
                  <div
                    className={`p-2 rounded-xl border ${
                      practiceFeedback.hasEvidence
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 font-bold'
                        : 'bg-surface border-border text-text-muted'
                    }`}
                  >
                    2. Objective Evidence
                  </div>
                  <div
                    className={`p-2 rounded-xl border ${
                      practiceFeedback.hasAlternative
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 font-bold'
                        : 'bg-surface border-border text-text-muted'
                    }`}
                  >
                    3. Actionable Alternative
                  </div>
                </div>

                <p className="text-xs text-text font-medium">{practiceFeedback.verdict}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-surface/30 flex items-center justify-between">
          <span className="text-xs text-text-muted">
            Executive posture: Separate the person from the problem; be soft on the people, hard on the facts.
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
