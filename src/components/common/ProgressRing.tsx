import React from 'react';

interface ProgressRingProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  color?: string;
  trackColor?: string;
  children?: React.ReactNode;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 10,
  label,
  sublabel,
  color = 'var(--color-primary)',
  trackColor = 'rgba(148, 163, 184, 0.2)',
  children,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 pointer-events-none">
        {children ? (
          children
        ) : (
          <>
            <span className="text-xl font-bold tracking-tight text-text">
              {Math.round(clampedProgress)}%
            </span>
            {label && <span className="text-xs font-semibold text-text-muted mt-0.5">{label}</span>}
            {sublabel && <span className="text-[10px] text-text-muted">{sublabel}</span>}
          </>
        )}
      </div>
    </div>
  );
};

export const ProgressBar: React.FC<{
  progress: number;
  color?: string;
  height?: number;
  className?: string;
  showPercent?: boolean;
}> = ({ progress, color = 'bg-primary', height = 8, className = '', showPercent = false }) => {
  const clamped = Math.min(100, Math.max(0, progress));
  return (
    <div className={`w-full ${className}`}>
      <div
        className="w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden"
        style={{ height }}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${color}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showPercent && (
        <div className="flex justify-end mt-1 text-xs font-medium text-text-muted">
          {Math.round(clamped)}%
        </div>
      )}
    </div>
  );
};
