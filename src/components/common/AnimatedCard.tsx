import React from 'react';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
  glow?: boolean;
  borderActive?: boolean;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = '',
  onClick,
  hoverEffect = true,
  glow = false,
  borderActive = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative rounded-2xl bg-card border transition-all duration-200
        ${borderActive ? 'border-primary shadow-sm' : 'border-border'}
        ${hoverEffect ? 'hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 cursor-pointer' : ''}
        ${glow ? 'ring-2 ring-primary/20 shadow-lg shadow-primary/10' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
