import React from 'react';
import {
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  BookOpen,
  Shield,
  Users,
  Flame,
  X,
  Lightbulb,
} from 'lucide-react';
import { useGamification } from '../../context/GamificationContext';
import { MasterAchievement } from '../../types/gamification';

export const AchievementDetailModal: React.FC = () => {
  const { activeAchievementModal, closeAchievementModal, gamificationSettings } = useGamification();

  if (!activeAchievementModal) return null;

  const ach = activeAchievementModal;

  const renderIcon = (name: string) => {
    const props = { size: 28, className: ach.isUnlocked ? 'text-primary' : 'text-text-muted' };
    switch (name) {
      case 'Flame':
        return <Flame {...props} className={ach.isUnlocked ? 'text-amber-500 fill-amber-500' : 'text-text-muted'} />;
      case 'Award':
        return <Award {...props} />;
      case 'Clock':
        return <Clock {...props} />;
      case 'TrendingUp':
        return <TrendingUp {...props} />;
      case 'BookOpen':
        return <BookOpen {...props} />;
      case 'Shield':
        return <Shield {...props} />;
      case 'Users':
        return <Users {...props} />;
      default:
        return <Sparkles {...props} />;
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'diamond':
        return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20';
      case 'gold':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'silver':
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
      default:
        return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
    }
  };

  const progressPercent = Math.min(100, Math.round((ach.progress / ach.maxProgress) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg p-6 sm:p-7 rounded-3xl bg-card border border-border shadow-2xl space-y-6">
        <button
          type="button"
          onClick={closeAchievementModal}
          className="absolute top-4 right-4 p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface transition-colors"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center shrink-0 shadow-xs">
            {renderIcon(ach.icon)}
          </div>

          <div className="space-y-1.5 flex-1 min-w-0 pr-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getTierBadge(ach.tier)}`}>
                {ach.tier} Tier
              </span>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                Category: {ach.category}
              </span>
            </div>
            <h2 className="text-xl font-black text-text leading-tight">{ach.title}</h2>
            <p className="text-xs text-text-muted">{ach.description}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="p-4 rounded-2xl bg-surface border border-border space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-text">Completion Progress</span>
            <span className="font-mono font-black text-primary">
              {ach.progress} / {ach.maxProgress} ({progressPercent}%)
            </span>
          </div>

          <div className="w-full bg-card h-2.5 rounded-full overflow-hidden border border-border/50">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                ach.isUnlocked ? 'bg-emerald-500' : 'bg-primary'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between pt-1 text-[11px] text-text-muted">
            <span>
              {ach.isUnlocked ? (
                <span className="text-emerald-500 font-bold flex items-center gap-1">
                  <CheckCircle2 size={13} />
                  Unlocked on {ach.unlockedAt || 'Recently'}
                </span>
              ) : (
                'In Progress'
              )}
            </span>
            {gamificationSettings.showXP && (
              <span className="font-bold text-indigo-500">+{ach.xpReward} XP Reward</span>
            )}
          </div>
        </div>

        {/* Transparent Requirement Description */}
        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-text-muted block">
            Requirement Criteria
          </span>
          <p className="text-xs text-text bg-surface p-3.5 rounded-xl border border-border leading-relaxed font-medium">
            {ach.requirementDescription}
          </p>
        </div>

        {/* Pedagogical Benefit */}
        <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/20 flex items-start gap-3">
          <Lightbulb size={18} className="text-primary shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-text block mb-0.5">Why this matters for your English</span>
            <p className="text-text-muted text-[11px] leading-relaxed">
              {ach.educationalBenefit}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={closeAchievementModal}
          className="w-full py-2.5 rounded-xl bg-surface border border-border text-xs font-bold text-text hover:bg-card transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
