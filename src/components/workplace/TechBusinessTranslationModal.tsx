import React, { useState } from 'react';
import {
  X,
  Binary,
  ArrowRightLeft,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Sparkles,
  AlertOctagon,
  ArrowRight,
  Code2,
  Briefcase,
  Building,
  ShieldCheck,
} from 'lucide-react';
import { useWorkplaceCommunication } from '../../context/WorkplaceCommunicationContext';
import { TechBusinessTranslationCase } from '../../types/workplace';

interface TechBusinessTranslationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechBusinessTranslationModal: React.FC<TechBusinessTranslationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { translationCases } = useWorkplaceCommunication();

  const [activeCase, setActiveCase] = useState<TechBusinessTranslationCase>(translationCases[0]);
  const [selectedPersona, setSelectedPersona] = useState<'developer' | 'manager' | 'customer' | 'executive'>('manager');
  const [userPractice, setUserPractice] = useState('');
  const [feedback, setFeedback] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentTranslation =
    selectedPersona === 'developer'
      ? activeCase.developerVersion
      : selectedPersona === 'manager'
      ? activeCase.managerVersion
      : selectedPersona === 'customer'
      ? activeCase.customerVersion
      : activeCase.executiveVersion;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentTranslation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEvaluate = () => {
    if (!userPractice.trim()) return;
    const lower = userPractice.toLowerCase();
    const hasJargon = activeCase.jargonToAvoid.some((j) => lower.includes(j.toLowerCase()));

    const score = hasJargon ? 65 : 90;
    setFeedback({
      score,
      hasJargon,
      verdict: hasJargon
        ? 'Identified internal technical jargon. For this audience, explain the functional consequence instead of the infrastructure detail.'
        : 'Superb translation! You eliminated complex jargon and focused directly on user experience and business continuity.',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl bg-card border border-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <Binary size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-text">Technical ↔ Business Translation Studio</h2>
              <p className="text-xs text-text-muted">
                Bridge the communication gap between engineering implementation and commercial business value
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
          {/* Source Technical Statement */}
          <div className="p-6 rounded-3xl bg-surface border border-border space-y-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-primary">
              Raw Engineering Statement:
            </span>
            <div className="p-4 rounded-2xl bg-card border border-border font-mono text-xs text-text leading-relaxed">
              "{activeCase.sourceStatement}"
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-bold text-rose-500 flex items-center gap-1">
                <AlertOctagon size={13} /> Jargon to avoid when translating:
              </span>
              {activeCase.jargonToAvoid.map((j, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono text-[10px]"
                >
                  {j}
                </span>
              ))}
            </div>
          </div>

          {/* Persona Translations Tabs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-text-muted">
                Audience-Tuned Translations
              </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'developer', label: '1. Developer', icon: Code2, color: 'text-purple-500' },
                { id: 'manager', label: '2. Manager', icon: Briefcase, color: 'text-indigo-500' },
                { id: 'customer', label: '3. Customer', icon: Building, color: 'text-emerald-500' },
                { id: 'executive', label: '4. Executive', icon: ShieldCheck, color: 'text-amber-500' },
              ].map((p) => {
                const Icon = p.icon;
                const isSelected = selectedPersona === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedPersona(p.id as any);
                      setFeedback(null);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'bg-primary/10 border-primary shadow-xs'
                        : 'bg-surface border-border hover:border-primary/40'
                    }`}
                  >
                    <Icon size={16} className={p.color} />
                    <span className="text-xs font-bold text-text">{p.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Translation Card */}
            <div className="p-5 rounded-2xl bg-surface border border-border flex items-start justify-between gap-4">
              <p className="text-xs sm:text-sm text-text leading-relaxed font-medium">
                "{currentTranslation}"
              </p>
              <button
                type="button"
                onClick={handleCopy}
                className="p-2 rounded-xl bg-card border border-border text-text hover:text-primary transition-colors shrink-0"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          {/* Interactive Translation Practice */}
          <div className="p-6 rounded-3xl bg-surface border border-primary/30 space-y-4">
            <h4 className="text-sm font-black text-text">Practice Translating This Issue</h4>
            <p className="text-xs text-text-muted">
              Explain the database connection exhaustion issue to a non-technical customer or business manager without using database buzzwords.
            </p>

            <textarea
              rows={3}
              value={userPractice}
              onChange={(e) => setUserPractice(e.target.value)}
              placeholder="e.g. Our servers experienced high traffic during peak hours, and we are adding connection traffic management to keep page loads fast..."
              className="w-full p-4 rounded-2xl bg-card border border-border text-xs sm:text-sm text-text placeholder:text-text-muted/60 focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none"
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleEvaluate}
                disabled={!userPractice.trim()}
                className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                <Sparkles size={14} />
                <span>Test Translation Clarity</span>
              </button>
            </div>

            {feedback && (
              <div className="p-4 rounded-2xl bg-card border border-border space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-text">Translation Score:</span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-primary/10 text-primary font-mono font-bold text-xs">
                    {feedback.score}%
                  </span>
                </div>
                <p className="text-xs text-text">{feedback.verdict}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-surface/30 flex items-center justify-between">
          <span className="text-xs text-text-muted">
            The mark of engineering mastery is explaining complex architectures in plain, intuitive language.
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
