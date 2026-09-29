import React from 'react';
import { LEARNING_LEVELS } from '../../data/levels';
import { useNavigation } from '../../context/NavigationContext';
import { Check, Lock, ChevronRight, Compass } from 'lucide-react';

export const LearningPathJourney: React.FC = () => {
  const { navigate } = useNavigation();

  return (
    <div className="rounded-3xl bg-card border border-border p-6 sm:p-7 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass size={18} className="text-primary" />
            <h2 className="text-lg sm:text-xl font-black text-text tracking-tight">
              Your English Journey
            </h2>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Structured CEFR roadmap from beginner confidence to spontaneous fluency
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/learn')}
          className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5"
        >
          <span>Full Curriculum</span>
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Horizontal / Wrapped Path */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-2">
        {LEARNING_LEVELS.map((level, idx) => {
          const isCurrent = level.status === 'current';
          const isCompleted = level.status === 'completed';
          const isLocked = level.status === 'locked';

          return (
            <div
              key={level.id}
              onClick={() => navigate(`/learn`)}
              className={`
                relative p-4 rounded-2xl border transition-all text-center flex flex-col items-center justify-between cursor-pointer group
                ${
                  isCurrent
                    ? 'bg-primary/10 border-primary ring-2 ring-primary/20 shadow-sm'
                    : isCompleted
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                    : 'bg-surface/50 border-border opacity-70 hover:opacity-100 hover:border-border'
                }
              `}
            >
              {/* Status Badge */}
              <div className="mb-2">
                {isCompleted ? (
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold mx-auto shadow-sm">
                    <Check size={16} strokeWidth={3} />
                  </div>
                ) : isCurrent ? (
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-black mx-auto ring-4 ring-primary/20 animate-pulse">
                    {level.name}
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-text-muted flex items-center justify-center mx-auto">
                    <Lock size={14} />
                  </div>
                )}
              </div>

              <div>
                <span className="font-extrabold text-sm text-text block group-hover:text-primary transition-colors">
                  {level.name}
                </span>
                <span className="text-[11px] font-semibold text-text-muted block truncate max-w-[100px] mx-auto">
                  {level.label}
                </span>
              </div>

              <div className="mt-3 w-full">
                <span
                  className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isCurrent
                      ? 'bg-primary text-white'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      : 'bg-slate-200 dark:bg-slate-800 text-text-muted'
                  }`}
                >
                  {isCompleted ? 'Completed' : isCurrent ? 'Active Level' : 'Locked'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
