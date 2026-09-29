import React from 'react';

interface WaveformProps {
  active?: boolean;
  barCount?: number;
  height?: number;
  color?: string;
  className?: string;
}

export const Waveform: React.FC<WaveformProps> = ({
  active = false,
  barCount = 18,
  height = 40,
  color = 'bg-primary',
  className = '',
}) => {
  const bars = Array.from({ length: barCount }, (_, i) => i);

  return (
    <div
      className={`flex items-center justify-center gap-1 overflow-hidden px-2 ${className}`}
      style={{ height }}
      role="presentation"
      aria-label="Audio waveform indicator"
    >
      {bars.map((bar) => {
        // Randomize height factor when active, flat when inactive
        const delay = (bar * 0.08) % 1.2;
        const baseHeight = active ? 25 + ((bar * 17) % 65) : 15;

        return (
          <div
            key={bar}
            className={`w-1 rounded-full transition-all duration-200 ${color}`}
            style={{
              height: active ? `${baseHeight}%` : '15%',
              animation: active ? `wave 1.1s ease-in-out infinite alternate` : 'none',
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
    </div>
  );
};
