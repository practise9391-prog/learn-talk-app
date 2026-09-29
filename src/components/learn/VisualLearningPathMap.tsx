import React from 'react';
import { MASTER_CURRICULUM } from '../../data/curriculumData';
import { useNavigation } from '../../context/NavigationContext';
import {
  Check,
  Lock,
  Star,
  Play,
  ArrowDown,
  Sparkles,
  ChevronRight,
  Compass
} from 'lucide-react';

export const VisualLearningPathMap: React.FC = () => {
  const { navigate } = useNavigation();

  // Aggregate all units across levels into a unified visual progression path
  const allUnits = MASTER_CURRICULUM.flatMap((lvl) =>
    lvl.units.map((u) => ({
      ...u,
      levelLabel: lvl.label,
      levelCategory: lvl.category,
    }))
  );

  return (
    <div className="rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Compass size={20} className="text-primary" />
            <h3 className="text-lg sm:text-xl font-black text-text tracking-tight">
              Visual English Learning Roadmap
            </h3>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Your step-by-step path from absolute beginner to spontaneous professional mastery
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-bold text-text-muted bg-surface px-3 py-1.5 rounded-xl border border-border">
          <span className="flex items-center gap-1"><Lock size={11} /> Locked</span>
          <span>•</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full border border-text-muted" /> Available</span>
          <span>•</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Learning</span>
          <span>•</span>
          <span className="flex items-center gap-1 text-emerald-500"><Check size={12} /> Completed</span>
          <span>•</span>
          <span className="flex items-center gap-1 text-amber-500"><Star size={12} fill="currentColor" /> Mastered</span>
        </div>
      </div>

      {/* Vertical Interactive Node Path */}
      <div className="relative max-w-2xl mx-auto py-4">
        {/* Continuous Connecting Line */}
        <div className="absolute top-8 bottom-8 left-8 sm:left-1/2 transform sm:-translate-x-1/2 w-1 bg-gradient-to-b from-primary via-emerald-500 to-slate-200 dark:to-slate-800 rounded-full pointer-events-none" />

        <div className="space-y-6">
          {allUnits.slice(0, 10).map((unit, idx) => {
            const isCompleted = idx < 2;
            const isLearning = idx === 2;
            const isAvailable = idx === 3;
            const isLocked = idx > 3;

            return (
              <div
                key={unit.id}
                className={`relative flex items-center gap-4 sm:gap-8 ${
                  idx % 2 === 0 ? 'sm:flex-row-reverse' : ''
                }`}
              >
                {/* Content Card */}
                <div
                  onClick={() => {
                    if (!isLocked) {
                      navigate(`/learn/unit/${unit.id}`);
                    }
                  }}
                  className={`
                    flex-1 p-4 rounded-2xl border transition-all select-none
                    ${
                      isLocked
                        ? 'bg-card/50 border-border opacity-50 cursor-not-allowed'
                        : isLearning
                        ? 'bg-card border-primary ring-2 ring-primary/20 shadow-md cursor-pointer hover:border-primary'
                        : isCompleted
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 cursor-pointer'
                        : 'bg-card border-border hover:border-primary/40 cursor-pointer shadow-xs'
                    }
                  `}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      {unit.levelLabel}
                    </span>
                    {isCompleted ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                        <Check size={11} /> Completed
                      </span>
                    ) : isLearning ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary flex items-center gap-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Active
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-text-muted">
                        {isLocked ? 'Locked' : 'Available'}
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-black text-text">
                    {unit.title}
                  </h4>
                  <p className="text-xs text-text-muted mt-0.5 line-clamp-1">
                    {unit.subtitle}
                  </p>
                </div>

                {/* Central Milestone Pin */}
                <div
                  className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 z-10 transition-transform shadow-md
                    ${
                      isCompleted
                        ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/20'
                        : isLearning
                        ? 'bg-primary text-white ring-4 ring-primary/30 animate-bounce-subtle'
                        : isAvailable
                        ? 'bg-surface border-2 border-primary text-primary'
                        : 'bg-slate-200 dark:bg-slate-800 text-text-muted border border-border'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check size={20} strokeWidth={3} />
                  ) : isLocked ? (
                    <Lock size={16} />
                  ) : (
                    <span>{unit.icon}</span>
                  )}
                </div>

                {/* Balance placeholder for alternate row layout on desktop */}
                <div className="hidden sm:block flex-1" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
