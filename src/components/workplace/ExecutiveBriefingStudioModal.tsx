import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Volume2,
  VolumeX,
  Sparkles,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Zap,
} from 'lucide-react';
import { useWorkplaceCommunication } from '../../context/WorkplaceCommunicationContext';
import { ExecutiveBriefingCase, ExecutiveDuration } from '../../types/workplace';
import { ExecutiveEvaluationResult } from '../../services/workplaceCommunicationService';

interface ExecutiveBriefingStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DURATION_TABS: Array<{ id: ExecutiveDuration; label: string; wordLimit: number }> = [
  { id: '15s', label: '15-Second BLUF', wordLimit: 35 },
  { id: '30s', label: '30-Second Snapshot', wordLimit: 65 },
  { id: '1m', label: '1-Minute Brief', wordLimit: 120 },
  { id: '3m', label: '3-Minute Board Update', wordLimit: 300 },
];

export const ExecutiveBriefingStudioModal: React.FC<ExecutiveBriefingStudioModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { executiveCases, evaluateExecutiveDraft } = useWorkplaceCommunication();

  const [selectedDuration, setSelectedDuration] = useState<ExecutiveDuration>('30s');
  const [activeCase, setActiveCase] = useState<ExecutiveBriefingCase>(
    executiveCases.find((c) => c.duration === '30s') || executiveCases[0]
  );
  const [userDraft, setUserDraft] = useState('');
  const [evaluation, setEvaluation] = useState<ExecutiveEvaluationResult | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentTab = DURATION_TABS.find((t) => t.id === selectedDuration) || DURATION_TABS[1];
  const wordCount = userDraft.trim().split(/\s+/).filter(Boolean).length;

  const handleEvaluate = () => {
    if (!userDraft.trim()) return;
    const result = evaluateExecutiveDraft(activeCase.id, userDraft);
    setEvaluation(result);
  };

  const handlePlayAudio = () => {
    if (!('speechSynthesis' in window)) return;
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(activeCase.modelBriefing);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCase.modelBriefing);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl bg-card border border-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-text">Executive Briefing & BLUF Studio</h2>
              <p className="text-xs text-text-muted">
                Deliver high-stakes decisions and quantifiable outcomes using the Bottom-Line-Up-Front framework
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (isPlayingAudio) window.speechSynthesis?.cancel();
              onClose();
            }}
            className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Duration Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {DURATION_TABS.map((tab) => {
              const isSelected = selectedDuration === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setSelectedDuration(tab.id);
                    const matched = executiveCases.find((c) => c.duration === tab.id) || executiveCases[0];
                    setActiveCase(matched);
                    setEvaluation(null);
                    setUserDraft('');
                    if (isPlayingAudio) window.speechSynthesis?.cancel();
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-primary/10 border-primary shadow-xs ring-1 ring-primary/40'
                      : 'bg-surface border-border hover:border-primary/40'
                  }`}
                >
                  <span className="font-mono font-black text-xs text-primary block">⏱ {tab.id}</span>
                  <span className="text-xs font-bold text-text block mt-0.5">{tab.label}</span>
                  <span className="text-[10px] text-text-muted block">Target: ~{tab.wordLimit} words</span>
                </button>
              );
            })}
          </div>

          {/* Scenario Dossier */}
          <div className="p-6 rounded-3xl bg-surface border border-border space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-500">
                  Business Context
                </span>
                <h3 className="text-base font-black text-text mt-0.5">{activeCase.topicTitle}</h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePlayAudio}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    isPlayingAudio
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-card border border-border text-text hover:bg-card/80'
                  }`}
                >
                  {isPlayingAudio ? <VolumeX size={13} /> : <Volume2 size={13} />}
                  <span>{isPlayingAudio ? 'Stop' : 'Listen Native Model'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-bold text-text hover:bg-card/80 flex items-center gap-1.5"
                >
                  {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
                <span className="text-[10px] font-bold text-text-muted uppercase">1. Core Takeaway</span>
                <p className="font-bold text-text">{activeCase.keyTakeaway}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
                <span className="text-[10px] font-bold text-text-muted uppercase">2. Quantified Impact</span>
                <p className="font-bold text-emerald-600">{activeCase.quantifiedImpact}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
                <span className="text-[10px] font-bold text-text-muted uppercase">3. Decision Required</span>
                <p className="font-bold text-primary">{activeCase.recommendedDecision}</p>
              </div>
            </div>

            {/* Model Briefing */}
            <div className="p-4 rounded-2xl bg-card border border-border text-xs sm:text-sm text-text leading-relaxed font-medium">
              "{activeCase.modelBriefing}"
            </div>
          </div>

          {/* Interactive Summarization Drill */}
          <div className="p-6 rounded-3xl bg-surface border border-primary/30 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-text">Practice Your Executive Summary</h4>
                <p className="text-xs text-text-muted">
                  Distill the dossier into a concise briefing. Lead with the Bottom Line Up Front (BLUF).
                </p>
              </div>

              <div
                className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg ${
                  wordCount > currentTab.wordLimit * 1.2
                    ? 'bg-rose-500/10 text-rose-600'
                    : 'bg-card border border-border text-text'
                }`}
              >
                {wordCount} / {currentTab.wordLimit} words
              </div>
            </div>

            <textarea
              rows={3}
              value={userDraft}
              onChange={(e) => setUserDraft(e.target.value)}
              placeholder="BLUF: [Outcome / Risk]... Due to [Reason]... We propose [Recommendation]... We need your approval for [Decision]..."
              className="w-full p-4 rounded-2xl bg-card border border-border text-xs sm:text-sm text-text placeholder:text-text-muted/60 focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none"
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleEvaluate}
                disabled={!userDraft.trim()}
                className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50 transition-opacity shadow-xs"
              >
                <Sparkles size={14} />
                <span>Evaluate Conciseness & Impact</span>
              </button>
            </div>

            {evaluation && (
              <div className="p-4 rounded-2xl bg-card border border-border space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-text">Executive Delivery Score:</span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-primary/10 text-primary font-mono font-bold text-xs">
                    {evaluation.overallScore}%
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-surface border border-border">
                    <span className="text-[10px] text-text-muted uppercase block">Conciseness</span>
                    <span className="font-bold text-text">{evaluation.concisenessScore}%</span>
                  </div>
                  <div className="p-2 rounded-xl bg-surface border border-border">
                    <span className="text-[10px] text-text-muted uppercase block">Decision Clarity</span>
                    <span className="font-bold text-text">{evaluation.decisionClarityScore}%</span>
                  </div>
                  <div className="p-2 rounded-xl bg-surface border border-border">
                    <span className="text-[10px] text-text-muted uppercase block">Metric Impact</span>
                    <span className="font-bold text-text">{evaluation.impactScore}%</span>
                  </div>
                </div>

                <p className="text-xs text-text font-medium">{evaluation.verdict}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-surface/30 flex items-center justify-between">
          <span className="text-xs text-text-muted">
            The golden rule of executive communication: Answer the question "So what, and what do you need from me?" in your first 15 seconds.
          </span>
          <button
            type="button"
            onClick={() => {
              if (isPlayingAudio) window.speechSynthesis?.cancel();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-text hover:bg-card transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
