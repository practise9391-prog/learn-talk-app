import React, { useState } from 'react';
import {
  X,
  MessageSquareHeart,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
} from 'lucide-react';
import { useWorkplaceCommunication } from '../../context/WorkplaceCommunicationContext';
import { FeedbackTrainingCase } from '../../types/workplace';

interface FeedbackTrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackTrainingModal: React.FC<FeedbackTrainingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { feedbackCases } = useWorkplaceCommunication();

  const [activeDirection, setActiveDirection] = useState<'giving' | 'receiving'>('giving');
  const [activeCase, setActiveCase] = useState<FeedbackTrainingCase>(
    feedbackCases.find((c) => c.direction === 'giving') || feedbackCases[0]
  );
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePlayAudio = () => {
    if (!('speechSynthesis' in window)) return;
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(activeCase.professionalModel);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCase.professionalModel);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-card border border-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <MessageSquareHeart size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-text">Constructive Feedback Studio</h2>
              <p className="text-xs text-text-muted">
                Master giving evidence-based feedback and converting defensive reflexes into professional growth
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
          {/* Direction Switcher */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-surface border border-border">
            <button
              type="button"
              onClick={() => {
                setActiveDirection('giving');
                const matched = feedbackCases.find((c) => c.direction === 'giving');
                if (matched) setActiveCase(matched);
                if (isPlayingAudio) window.speechSynthesis?.cancel();
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeDirection === 'giving'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              <span>1. Giving Feedback ("Bad Feedback → Improve It")</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveDirection('receiving');
                const matched = feedbackCases.find((c) => c.direction === 'receiving');
                if (matched) setActiveCase(matched);
                if (isPlayingAudio) window.speechSynthesis?.cancel();
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeDirection === 'receiving'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              <span>2. Receiving Feedback ("Defensive → Professional")</span>
            </button>
          </div>

          {/* Scenario Context */}
          <div className="p-5 rounded-3xl bg-surface border border-border space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-primary">
              Workplace Situation
            </span>
            <p className="text-xs sm:text-sm text-text font-medium leading-relaxed">
              {activeCase.situation}
            </p>
          </div>

          {/* Comparison Cards: Flawed vs Master Formulation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Flawed / Defensive Response */}
            <div className="p-5 rounded-3xl bg-rose-500/5 border border-rose-500/20 space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                  <ThumbsDown size={16} />
                  <span className="text-xs font-black uppercase tracking-wider">
                    {activeDirection === 'giving' ? 'Flawed / Harsh Draft' : 'Defensive Reactive Response'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-card border border-rose-500/20 text-xs text-text italic">
                  "{activeCase.flawedDraft}"
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
                    Diagnostic Errors:
                  </span>
                  <ul className="space-y-1 text-xs text-text-muted">
                    {activeCase.flawsIdentified.map((flaw, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-rose-500 font-bold">•</span>
                        <span>{flaw}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Professional Model */}
            <div className="p-5 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <ThumbsUp size={16} />
                    <span className="text-xs font-black uppercase tracking-wider">
                      {activeDirection === 'giving' ? 'Actionable Constructive Model' : 'Growth-Oriented Response'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handlePlayAudio}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isPlayingAudio
                          ? 'bg-rose-500 text-white border-rose-500 animate-pulse'
                          : 'bg-card border-border text-text hover:text-primary'
                      }`}
                      title="Listen"
                    >
                      {isPlayingAudio ? <VolumeX size={13} /> : <Volume2 size={13} />}
                    </button>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="p-1.5 rounded-lg bg-card border border-border text-text hover:text-primary"
                      title="Copy"
                    >
                      {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-card border border-emerald-500/20 text-xs sm:text-sm text-text leading-relaxed font-medium">
                  "{activeCase.professionalModel}"
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                    Why This Succeeds:
                  </span>
                  <ul className="space-y-1 text-xs text-text">
                    {activeCase.actionableCriteria.map((crit, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">✓</span>
                        <span>{crit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-surface/30 flex items-center justify-between">
          <span className="text-xs text-text-muted">
            Feedback rule: Praise publicly, critique privately, and anchor every point to observable evidence.
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
