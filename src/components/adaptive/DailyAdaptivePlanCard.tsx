import React from 'react';
import { useAdaptiveLearning } from '../../context/AdaptiveLearningContext';
import { useNavigation } from '../../context/NavigationContext';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  ArrowRight,
  Flame,
  Target,
  Sparkles,
} from 'lucide-react';

export const DailyAdaptivePlanCard: React.FC = () => {
  const { dailyPlan, setDailyPlanTier, completePlanItem, activeGoal } = useAdaptiveLearning();
  const { navigate } = useNavigation();

  const currentItems =
    dailyPlan.selectedTier === 'quick5'
      ? dailyPlan.quick5
      : dailyPlan.selectedTier === 'deep30'
      ? dailyPlan.deep30
      : dailyPlan.standard15;

  const completedCount = currentItems.filter((i) => i.completed).length;
  const progressPercent = Math.round((completedCount / currentItems.length) * 100);

  return (
    <div className="rounded-3xl bg-card border border-border p-5 sm:p-6 shadow-xs space-y-4">
      {/* Header and Tier Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-primary" />
            <h3 className="text-base sm:text-lg font-black text-text">
              Today's Adaptive Learning Plan
            </h3>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Personalized for <strong>{activeGoal.title}</strong> based on your available time today.
          </p>
        </div>

        {/* Time Tier Switcher Tabs (Section 33) */}
        <div className="flex items-center gap-1 p-1 bg-surface rounded-2xl border border-border self-start sm:self-auto">
          {[
            { id: 'quick5', label: '5 Mins', icon: 'â¡' },
            { id: 'standard15', label: '15 Mins', icon: 'ð¯' },
            { id: 'deep30', label: '30 Mins', icon: 'ð' },
          ].map((tier) => (
            <button
              key={tier.id}
              type="button"
              onClick={() => setDailyPlanTier(tier.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                dailyPlan.selectedTier === tier.id
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              <span>{tier.icon}</span>
              <span>{tier.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Progress Metric Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-text-muted">
            {completedCount} of {currentItems.length} activities completed today
          </span>
          <span className="font-bold text-primary">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-surface overflow-hidden border border-border/60">
          <div
            className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Activities Checklist */}
      <div className="space-y-2">
        {currentItems.map((item, idx) => (
          <div
            key={item.id}
            className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
              item.completed
                ? 'bg-surface/40 border-border/60 opacity-75'
                : 'bg-surface border-border hover:border-primary/40'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => completePlanItem(item.id)}
                className="text-text-muted hover:text-primary transition-colors shrink-0"
                title={item.completed ? 'Mark uncompleted' : 'Mark completed'}
              >
                {item.completed ? (
                  <CheckCircle2 size={18} className="text-emerald-500" />
                ) : (
                  <Circle size={18} />
                )}
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold truncate ${item.completed ? 'line-through text-text-muted' : 'text-text'}`}>
                    {item.title}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.2 rounded-md bg-card border border-border text-text-muted hidden xs:inline-block">
                    {item.type}
                  </span>
                </div>
                <span className="text-[11px] text-text-muted flex items-center gap-1 mt-0.5">
                  <Clock size={11} />
                  <span>{item.durationMinutes} mins</span>
                  <span>â¢</span>
                  <span className="capitalize">{item.skillTag.replace('_', ' ')}</span>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate(item.actionRoute, item.actionParams)}
              className="p-2 rounded-xl bg-card hover:bg-primary hover:text-white border border-border text-primary transition-colors shrink-0 shadow-2xs"
              title="Launch activity"
            >
              <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Goal Milestone Progress Bar (Section 36) */}
      <div className="pt-2 border-t border-border/60">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
            <Target size={13} className="text-primary" />
            <span>Goal Milestones: {activeGoal.title}</span>
          </span>
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="text-[11px] font-semibold text-primary hover:underline"
          >
            Change Goal
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {activeGoal.milestones.slice(0, 4).map((m) => (
            <div
              key={m.id}
              className="p-2.5 rounded-xl bg-surface/60 border border-border/70 flex items-center justify-between gap-2"
            >
              <span className="truncate text-text font-medium">{m.label}</span>
              {m.completed ? (
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full shrink-0">
                  Completed â
                </span>
              ) : (
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                  {m.progressPercentage}%
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
