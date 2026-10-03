import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Zap,
  Volume2,
  VolumeX,
  Sparkles,
  LifeBuoy,
  Clock,
  Play,
  RotateCcw,
  Check,
  Copy,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { useWorkplaceCommunication } from '../../context/WorkplaceCommunicationContext';
import { ThinkOnYourFeetDrill } from '../../types/workplace';

interface ThinkOnYourFeetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThinkOnYourFeetModal: React.FC<ThinkOnYourFeetModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { thinkDrills } = useWorkplaceCommunication();

  const [activeDrill, setActiveDrill] = useState<ThinkOnYourFeetDrill>(thinkDrills[0]);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(activeDrill.targetSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showBrainFreeze, setShowBrainFreeze] = useState(false);
  const [userSpokenAnswer, setUserSpokenAnswer] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);

  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isTimerRunning && secondsRemaining > 0) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, secondsRemaining]);

  if (!isOpen) return null;

  const handleStartTimer = () => {
    setSecondsRemaining(activeDrill.targetSeconds);
    setIsTimerRunning(true);
    setUserSpokenAnswer('');
  };

  const handleReset = () => {
    setIsTimerRunning(false);
    setSecondsRemaining(activeDrill.targetSeconds);
  };

  const handlePlayModelAudio = () => {
    if (!('speechSynthesis' in window)) return;
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(activeDrill.brainFreezeSupport.modelAnswer);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeDrill.brainFreezeSupport.modelAnswer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-card border border-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <Zap size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-text">“Think on Your Feet” Studio</h2>
              <p className="text-xs text-text-muted">
                Respond with poise under unexpected executive pressure and overcome conversational brain-freeze
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
          {/* Question Selector Bar */}
          <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-surface border border-border">
            <span className="text-xs font-bold text-text-muted mr-1">Unexpected Prompt:</span>
            {thinkDrills.map((d, i) => (
              <button
                key={d.id}
                type="button"
                onClick={() => {
                  setActiveDrill(d);
                  setIsTimerRunning(false);
                  setSecondsRemaining(d.targetSeconds);
                  setShowBrainFreeze(false);
                  setUserSpokenAnswer('');
                  if (isPlayingAudio) window.speechSynthesis?.cancel();
                }}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                  activeDrill.id === d.id
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-card hover:bg-border text-text'
                }`}
              >
                Drill {i + 1}: {d.unexpectedQuestion.substring(1, 30)}...
              </button>
            ))}
          </div>

          {/* High-Pressure Prompt Box */}
          <div className="p-6 rounded-3xl bg-surface border border-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-500">
                Executive Ambush Context: {activeDrill.workplaceContext}
              </span>

              <div className="flex items-center gap-2">
                <span
                  className={`font-mono font-black text-xs px-2.5 py-1 rounded-lg ${
                    secondsRemaining < 10
                      ? 'bg-rose-500/10 text-rose-600 animate-pulse'
                      : 'bg-card border border-border text-text'
                  }`}
                >
                  ⏱ {secondsRemaining}s
                </span>
                {!isTimerRunning ? (
                  <button
                    type="button"
                    onClick={handleStartTimer}
                    className="p-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
                    title="Start countdown"
                  >
                    <Play size={13} fill="currentColor" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="p-1.5 rounded-lg bg-card border border-border text-text hover:bg-surface"
                    title="Reset countdown"
                  >
                    <RotateCcw size={13} />
                  </button>
                )}
              </div>
            </div>

            <h3 className="text-base sm:text-lg font-black text-text leading-snug">
              {activeDrill.unexpectedQuestion}
            </h3>

            {/* Brain-Freeze Support Lifeline */}
            <div>
              <button
                type="button"
                onClick={() => setShowBrainFreeze(!showBrainFreeze)}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1.5"
              >
                <LifeBuoy size={14} />
                <span>{showBrainFreeze ? 'Hide Brain-Freeze Lifeline' : 'Stuck? Open Brain-Freeze Support'}</span>
                <ChevronRight size={13} className={showBrainFreeze ? 'rotate-90' : ''} />
              </button>

              {showBrainFreeze && (
                <div className="mt-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-2.5 animate-fadeIn">
                  <div>
                    <span className="font-bold text-amber-700 dark:text-amber-300 block">First Phrase Hook:</span>
                    <p className="font-mono text-xs text-text mt-0.5">"{activeDrill.brainFreezeSupport.firstPhrase}"</p>
                  </div>

                  <div>
                    <span className="font-bold text-amber-700 dark:text-amber-300 block">Anchor Keywords:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {activeDrill.brainFreezeSupport.keywords.map((kw, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-card border border-border text-[11px] font-bold text-text">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-amber-700 dark:text-amber-300 block">Strategic Structural Rule:</span>
                    <p className="text-text mt-0.5">{activeDrill.brainFreezeSupport.structureAnchor}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Model Answer Showcase */}
          <div className="p-6 rounded-3xl bg-surface border border-border space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-[11px] font-black uppercase text-primary">
                Executive-Level Model Answer:
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePlayModelAudio}
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

            <p className="text-xs sm:text-sm text-text leading-relaxed font-normal">
              "{activeDrill.brainFreezeSupport.modelAnswer}"
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-surface/30 flex items-center justify-between">
          <span className="text-xs text-text-muted">
            When asked for impossible theoretical certainty, reframe into concrete defense-in-depth risk controls.
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
