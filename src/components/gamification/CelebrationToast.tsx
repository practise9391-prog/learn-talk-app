import React, { useEffect } from 'react';
import { Sparkles, Award, CheckCircle2, Flame, X } from 'lucide-react';
import { useGamification } from '../../context/GamificationContext';

export const CelebrationToast: React.FC = () => {
  const { activeCelebration, dismissCelebration, gamificationSettings } = useGamification();

  useEffect(() => {
    if (!activeCelebration) return;
    const timer = setTimeout(() => {
      dismissCelebration();
    }, 4500);
    return () => clearTimeout(timer);
  }, [activeCelebration, dismissCelebration]);

  if (!activeCelebration || gamificationSettings.focusMode || !gamificationSettings.showCelebrationModals) {
    return null;
  }

  const getIcon = () => {
    switch (activeCelebration.icon) {
      case 'Flame':
        return <Flame size={20} className="text-amber-500 fill-amber-500" />;
      case 'Award':
        return <Award size={20} className="text-emerald-500" />;
      case 'CheckCircle2':
        return <CheckCircle2 size={20} className="text-primary" />;
      default:
        return <Sparkles size={20} className="text-indigo-500 fill-indigo-500" />;
    }
  };

  return (
    <div
      role="alert"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-card/95 border border-primary/30 shadow-xl backdrop-blur-md max-w-sm transition-all duration-300 ${
        gamificationSettings.reducedMotion ? '' : 'animate-bounce-subtle'
      }`}
    >
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        {getIcon()}
      </div>

      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-black text-text">{activeCelebration.title}</span>
          {activeCelebration.xp > 0 && gamificationSettings.showXP && (
            <span className="text-[10px] font-bold text-indigo-500 px-1.5 py-0.5 rounded-md bg-indigo-500/10">
              +{activeCelebration.xp} XP
            </span>
          )}
        </div>
        <p className="text-[11px] text-text-muted capitalize truncate mt-0.5">
          {activeCelebration.subtitle}
        </p>
      </div>

      <button
        type="button"
        onClick={dismissCelebration}
        className="p-1 rounded-lg text-text-muted hover:text-text hover:bg-surface transition-colors"
        aria-label="Dismiss toast"
      >
        <X size={15} />
      </button>
    </div>
  );
};
