import React from 'react';
import { Sparkles, Award, ArrowRight, ShieldCheck, X } from 'lucide-react';
import { useGamification } from '../../context/GamificationContext';
import { useUser } from '../../context/UserContext';

export const LevelUpModal: React.FC = () => {
  const { activeLevelUp, dismissLevelUp, gamificationSettings } = useGamification();
  const { user } = useUser();

  if (!activeLevelUp || gamificationSettings.focusMode) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-card border border-primary/30 shadow-2xl text-center space-y-6">
        {/* Close Button */}
        <button
          type="button"
          onClick={dismissLevelUp}
          className="absolute top-4 right-4 p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface transition-colors"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Level Icon Aura */}
        <div className="relative mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
          <Sparkles size={36} className="text-white fill-white" />
          <div className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-surface border border-border text-[11px] font-black text-primary shadow-xs">
            LVL {activeLevelUp.level}
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-primary block">
            Practice Milestone Reached
          </span>
          <h2 className="text-2xl font-black text-text">
            Level {activeLevelUp.level}: {activeLevelUp.title}
          </h2>
          <p className="text-xs text-text-muted leading-relaxed">
            Your daily consistency is strengthening your automatic speech pathways. Keep practicing out loud!
          </p>
        </div>

        {/* Clear Distinction from CEFR */}
        <div className="p-3.5 rounded-2xl bg-surface border border-border flex items-start gap-3 text-left">
          <ShieldCheck size={18} className="text-primary shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-text block">Consistency vs CEFR Proficiency</span>
            <p className="text-text-muted text-[11px] mt-0.5 leading-relaxed">
              Learner Level tracks your dedicated practice volume. Your formal English proficiency remains{' '}
              <strong className="text-primary font-bold">CEFR {user.currentLevel}</strong> based on evaluated communication tests.
            </p>
          </div>
        </div>

        {/* Perk Unlocked */}
        {activeLevelUp.unlockedPerk && (
          <div className="p-3 rounded-2xl bg-primary/5 border border-primary/20 text-xs text-left">
            <span className="font-bold text-primary block mb-0.5">Unlocked Practice Capability:</span>
            <p className="text-text-muted text-[11px]">{activeLevelUp.unlockedPerk}</p>
          </div>
        )}

        <button
          type="button"
          onClick={dismissLevelUp}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md shadow-primary/25 hover:bg-primary-hover transition-all flex items-center justify-center gap-2"
        >
          <span>Continue Learning</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
