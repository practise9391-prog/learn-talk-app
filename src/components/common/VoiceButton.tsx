import React from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';

export type VoiceButtonState = 'idle' | 'listening' | 'recording' | 'processing' | 'disabled';

interface VoiceButtonProps {
  state: VoiceButtonState;
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg' | 'giant';
  label?: string;
  disabled?: boolean;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  state,
  onClick,
  size = 'lg',
  label,
  disabled = false,
}) => {
  const isRecording = state === 'recording' || state === 'listening';
  const isProcessing = state === 'processing';

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

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        disabled={disabled || isProcessing}
        onClick={onClick}
        aria-label={label || 'Voice input button'}
        className={`
          relative flex items-center justify-center rounded-full transition-all duration-300
          ${sizeClasses[size]}
          ${
            isRecording
              ? 'bg-red-500 text-white shadow-xl shadow-red-500/30 scale-105 animate-pulse'
              : isProcessing
              ? 'bg-amber-500 text-white cursor-wait'
              : 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:scale-105 active:scale-95'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {isRecording && (
          <span className="absolute inset-0 rounded-full bg-red-400 opacity-40 animate-ping pointer-events-none" />
        )}
        {isProcessing ? (
          <Loader2 size={iconSizes[size]} className="animate-spin" />
        ) : isRecording ? (
          <Square size={iconSizes[size] - 6} fill="currentColor" />
        ) : (
          <Mic size={iconSizes[size]} />
        )}
      </button>

      {label && (
        <span className="text-xs font-semibold text-text-muted select-none">
          {state === 'recording'
            ? 'Recording... Tap to Stop'
            : state === 'listening'
            ? 'Listening to speech...'
            : state === 'processing'
            ? 'Analyzing speech...'
            : label}
        </span>
      )}
    </div>
  );
};
