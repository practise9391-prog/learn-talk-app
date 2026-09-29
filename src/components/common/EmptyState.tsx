import React from 'react';
import { LucideIcon, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  emoji?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  emoji = '🌱',
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 rounded-2xl bg-card border border-dashed border-border ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 text-3xl select-none">
        {Icon ? <Icon className="w-8 h-8 text-primary" /> : emoji}
      </div>
      <h3 className="text-base font-bold text-text mb-1">{title}</h3>
      <p className="text-sm text-text-muted max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary-hover transition-colors shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
