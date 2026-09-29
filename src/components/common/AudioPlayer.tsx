import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react';
import { Waveform } from './Waveform';

interface AudioPlayerProps {
  title?: string;
  duration?: string;
  onPlay?: () => void;
  className?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  title = 'Native Audio Example',
  duration = '0:14',
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<'normal' | 'slow'>('normal');

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleSpeed = () => {
    setSpeed(speed === 'normal' ? 'slow' : 'normal');
  };

  return (
    <div
      className={`flex items-center gap-3 p-3 bg-surface rounded-xl border border-border ${className}`}
    >
      <button
        type="button"
        onClick={togglePlay}
        className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 hover:bg-primary-hover transition-colors shadow-sm"
        aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} className="translate-x-0.5" />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-xs font-semibold text-text truncate flex items-center gap-1.5">
            <Volume2 size={13} className="text-primary" />
            {title}
          </span>
          <span className="text-[11px] text-text-muted shrink-0">{duration}</span>
        </div>
        <Waveform active={isPlaying} height={20} barCount={24} />
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={toggleSpeed}
          className={`px-2 py-1 rounded-md text-xs font-semibold border transition-colors ${
            speed === 'slow'
              ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
              : 'bg-card text-text-muted border-border hover:text-text'
          }`}
          title="Toggle Slow / Normal pronunciation speed"
        >
          {speed === 'slow' ? '0.75x Slow' : '1.0x Normal'}
        </button>

        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          className="p-1.5 text-text-muted hover:text-text rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          title="Replay from start"
        >
          <RotateCcw size={15} />
        </button>
      </div>
    </div>
  );
};
