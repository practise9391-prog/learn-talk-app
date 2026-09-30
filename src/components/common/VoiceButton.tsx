import React from 'react';
import { Mic, Square, Loader2, Volume2, Pause, AlertTriangle } from 'lucide-react';

export type VoiceButtonState =
  | 'idle'
  | 'ready'
  | 'listening'
  | 'recording'
  | 'processing'
  | 'ai_speaking'
  | 'paused'
  | 'error'
  | 'disabled';

interface VoiceButtonProps {
  state: VoiceButtonState;
  onClick: () => void;
  onInterrupt?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'giant';
  label?: string;
  disabled?: boolean;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  state,
  onClick,
  onInterrupt,
  size = 'lg',
  label,
  disabled = false,
}) => {
  const isRecording = state === 'recording' || state === 'listening';
  const isProcessing = state === 'processing';
  const isAiSpeaking = state === 'ai_speaking';
  const isPaused = state === 'paused';
  const isError = state === 'error';

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    giant: 'w-28 h-28',
  };

  const iconSizes = {
    sm: 18,
    md: 24,
    lg: 32,
    giant: 44,
  };

  const handleClick = () => {
    if (isAiSpeaking && onInterrupt) {
      onInterrupt();
    } else {
      onClick();
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <button
        type="button"
        disabled={disabled || isProcessing}
        onClick={handleClick}
        aria-label={
          isAiSpeaking
            ? 'AI is speaking. Tap to interrupt.'
            : isRecording
            ? 'Microphone is listening. Tap to finish speaking.'
            : isError
            ? 'Microphone error. Tap to retry.'
            : label || 'Voice input button'
        }
        className={`
          relative flex items-center justify-center rounded-full transition-all duration-300
          ${sizeClasses[size]}
          ${
            isRecording
              ? 'bg-rose-500 text-white shadow-xl shadow-rose-500/30 scale-105 animate-pulse'
              : isProcessing
              ? 'bg-amber-500 text-white cursor-wait'
              : isAiSpeaking
              ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 animate-bounce-subtle'
              : isPaused
              ? 'bg-slate-500 text-white'
              : isError
              ? 'bg-rose-600 text-white'
              : 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:scale-105 active:scale-95'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {isRecording && (
          <span className="absolute inset-0 rounded-full bg-rose-400 opacity-40 animate-ping pointer-events-none" />
        )}
        {isAiSpeaking && (
          <span className="absolute inset-0 rounded-full bg-indigo-400 opacity-30 animate-ping pointer-events-none" />
        )}

        {isProcessing ? (
          <Loader2 size={iconSizes[size]} className="animate-spin" />
        ) : isRecording ? (
          <Square size={iconSizes[size] - 6} fill="currentColor" />
        ) : isAiSpeaking ? (
          <Volume2 size={iconSizes[size]} className="animate-pulse" />
        ) : isPaused ? (
          <Pause size={iconSizes[size]} />
        ) : isError ? (
          <AlertTriangle size={iconSizes[size]} />
        ) : (
          <Mic size={iconSizes[size]} />
        )}
      </button>

      {/* State Text Indicator */}
      <span className="text-xs font-semibold text-text-muted select-none text-center">
        {isAiSpeaking ? (
          <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
            <span>AI Speaking</span>
            <span className="text-[10px] text-text-muted">(Tap to interrupt)</span>
          </span>
        ) : state === 'recording' ? (
          <span className="text-rose-500 font-bold">Recording... Tap when finished</span>
        ) : state === 'listening' ? (
          <span className="text-rose-500 font-bold">Listening... Speak now</span>
        ) : state === 'processing' ? (
          <span className="text-amber-500 font-bold">Analyzing your speech...</span>
        ) : state === 'ready' ? (
          <span className="text-emerald-500 font-bold">Ready • Tap to speak</span>
        ) : state === 'paused' ? (
          <span className="text-text-muted font-bold">Paused • Tap to resume</span>
        ) : state === 'error' ? (
          <span className="text-rose-500 font-bold">Microphone error • Tap to retry</span>
        ) : (
          label || 'Tap to speak'
        )}
      </span>
    </div>
  );
};
