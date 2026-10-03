import React, { useState } from 'react';
import {
  X,
  Presentation,
  Volume2,
  HelpCircle,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Mic,
} from 'lucide-react';
import { useProLab } from '../../context/ProLabContext';
import { PresentationRehearsalMode } from '../../types/proLab';
import { DictationMicButton } from './DictationMicButton';

interface PresentationLabModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PresentationLabModal: React.FC<PresentationLabModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { presentationCases } = useProLab();
  const currentCase = presentationCases[0];

  const [activeMode, setActiveMode] = useState<PresentationRehearsalMode>('practice');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [activeQAIndex, setActiveQAIndex] = useState(0);
  const [userQAReply, setUserQAReply] = useState('');
  const [qaFeedback, setQaFeedback] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  if (!isOpen) return null;

  const currentSlide = currentCase.slides[currentSlideIndex];
  const currentQA = currentCase.qaQuestions[activeQAIndex];

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleEvaluateQA = () => {
    if (!userQAReply.trim()) return;
    const lower = userQAReply.toLowerCase();
    const hasUncertaintyCheck =
      lower.includes('let me verify') ||
      lower.includes('double-check') ||
      lower.includes('follow up') ||
      lower.includes('confirm with');

    if (hasUncertaintyCheck) {
      setQaFeedback(
        'Outstanding! You handled uncertainty with poise—acknowledging the core boundary, maintaining credibility, and committing to follow up.'
      );
    } else {
      setQaFeedback(
        'Strong technical content. If you are ever unsure of exact parameters under pressure, remember to commit to a specific verification timeline.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[92vh] bg-surface rounded-3xl border border-border shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-card/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Presentation size={20} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-500 px-2.5 py-0.5 rounded-full">
                Presentation & Q&A Lab
              </span>
              <h2 className="text-base sm:text-lg font-black text-text">
                {currentCase.title}
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

        {/* Mode Selector Strip */}
        <div className="px-6 py-2.5 bg-surface-elevated/70 border-b border-border flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-bold text-text-muted uppercase mr-1">Mode:</span>
          {(['practice', 'realistic', 'pressure', 'assessment'] as PresentationRehearsalMode[]).map(
            (mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setActiveMode(mode)}
                className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all ${
                  activeMode === mode
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-card border border-border text-text-muted hover:text-text'
                }`}
              >
                {mode === 'pressure' ? '🔥 Pressure' : mode}
              </button>
            )
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Slide Deck Canvas */}
          <div className="p-6 rounded-3xl bg-card border-2 border-border shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-primary px-2.5 py-0.5 rounded-full bg-primary/10">
                  Slide {currentSlide.slideNumber} of {currentCase.slides.length}
                </span>
                <span className="text-xs font-bold text-text">{currentSlide.title}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentSlideIndex((prev) => Math.max(prev - 1, 0))}
                  disabled={currentSlideIndex === 0}
                  className="p-1.5 rounded-lg border border-border text-text-muted hover:text-text disabled:opacity-30"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentSlideIndex((prev) => Math.min(prev + 1, currentCase.slides.length - 1))
                  }
                  disabled={currentSlideIndex === currentCase.slides.length - 1}
                  className="p-1.5 rounded-lg border border-border text-text-muted hover:text-text disabled:opacity-30"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Bullets */}
            <ul className="space-y-2.5 py-2">
              {currentSlide.keyBullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-text">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{bullet}</span>
                </li>
              ))}
            </ul>

            {/* Speaker Notes */}
            <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1 text-xs">
              <span className="text-[10px] font-bold text-text-muted uppercase">Speaker Strategy:</span>
              <p className="text-text-muted leading-relaxed">{currentSlide.speakerNotes}</p>
            </div>

            {/* Listen to Model Presentation */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-text-muted">
                Listen to native cadence and professional transitions:
              </span>
              <button
                type="button"
                onClick={() => handleSpeak(currentSlide.modelAudioTranscript)}
                className="px-3.5 py-1.5 rounded-xl bg-surface border border-border text-xs font-bold text-primary hover:bg-primary/10 flex items-center gap-1.5 transition-colors"
              >
                <Volume2 size={14} />
                <span>{isSpeaking ? 'Pause Model' : 'Play Model Voice'}</span>
              </button>
            </div>
          </div>

          {/* Q&A Defense Studio */}
          <div className="p-5 rounded-3xl bg-surface border border-border space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle size={18} className="text-amber-500" />
                <h3 className="text-sm font-black text-text">
                  Post-Presentation Q&A Challenge
                </h3>
              </div>
              <span className="text-[10px] font-bold text-text-muted uppercase">
                Audience: {currentQA.interviewerRole}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
              <span className="text-xs font-bold text-text">
                "{currentQA.question}"
              </span>
              <p className="text-[11px] text-text-muted">
                Intent: {currentQA.questionIntent}
              </p>
            </div>

            {/* Professional Uncertainty Lifeline */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
              <span className="font-bold text-amber-600 block">
                "I Don't Know" Professional Phrasing Lifeline:
              </span>
              <p className="text-text-muted text-[11px] italic">
                "{currentQA.modelUncertaintyAnswer}"
              </p>
            </div>

            {/* Answer Composer */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-text">Your Spoken/Written Defense:</label>
                <DictationMicButton
                  onTranscript={(t: string) => setUserQAReply((prev) => (prev ? `${prev} ${t}` : t))}
                />
              </div>

              <textarea
                value={userQAReply}
                onChange={(e) => setUserQAReply(e.target.value)}
                placeholder="Address the question clearly, or acknowledge what is known and commit to follow-up..."
                rows={3}
                className="w-full p-3.5 rounded-2xl bg-card border border-border text-xs text-text focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none leading-relaxed"
              />

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleEvaluateQA}
                  disabled={!userQAReply.trim()}
                  className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50 transition-opacity shadow-xs"
                >
                  <Sparkles size={13} />
                  <span>Evaluate Q&A Response</span>
                </button>
              </div>
            </div>

            {qaFeedback && (
              <div className="p-3.5 rounded-2xl bg-card border border-primary/30 text-xs text-text space-y-1 animate-fadeIn">
                <span className="font-bold text-primary block">Evaluation:</span>
                <p className="text-text-muted leading-relaxed">{qaFeedback}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
