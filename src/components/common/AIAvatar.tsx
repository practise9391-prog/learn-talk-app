import React from 'react';

interface AIAvatarProps {
  emoji?: string;
  name?: string;
  status?: 'speaking' | 'listening' | 'idle' | 'thinking';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const AIAvatar: React.FC<AIAvatarProps> = ({
  emoji = '🤖',
  name,
  status = 'idle',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-11 h-11 text-xl',
    lg: 'w-16 h-16 text-3xl',
    xl: 'w-24 h-24 text-5xl',
  };

  const statusRing = {
    speaking: 'ring-4 ring-primary ring-offset-2 dark:ring-offset-card animate-pulse',
    listening: 'ring-4 ring-emerald-500 ring-offset-2 dark:ring-offset-card animate-pulse',
    thinking: 'ring-4 ring-amber-500 ring-offset-2 dark:ring-offset-card animate-pulse-subtle',
    idle: 'ring-1 ring-border',
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <div
        className={`
          ${sizeClasses[size]}
          ${statusRing[status]}
          rounded-2xl bg-gradient-to-tr from-primary/10 via-primary/5 to-secondary/10
          flex items-center justify-center select-none shadow-sm transition-all
        `}
      >
        <span>{emoji}</span>
      </div>
      {status === 'speaking' && (
        <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-primary border-2 border-surface"></span>
        </span>
      )}
      {status === 'listening' && (
        <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-surface"></span>
        </span>
      )}
    </div>
  );
};
