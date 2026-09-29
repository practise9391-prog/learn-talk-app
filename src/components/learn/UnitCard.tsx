import React from 'react';
import { Unit, Lesson } from '../../types';
import { CheckCircle2, Lock, ArrowRight, Play, BookOpen, Clock } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';

export const LessonCard: React.FC<{ lesson: Lesson }> = ({ lesson }) => {
  const { navigate } = useNavigation();

  return (
    <div
      onClick={() => navigate(`/learn/lesson/${lesson.id}`)}
      className={`
        p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 group
        ${
          lesson.completed
            ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
            : lesson.active
            ? 'bg-card border-primary ring-2 ring-primary/20 shadow-sm'
            : 'bg-card border-border hover:border-slate-300 dark:hover:border-slate-700'
        }
      `}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div
          className={`
            w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold
            ${
              lesson.completed
                ? 'bg-emerald-500 text-white'
                : lesson.active
                ? 'bg-primary text-primary-foreground'
                : 'bg-slate-200 dark:bg-slate-800 text-text-muted'
            }
          `}
        >
          {lesson.completed ? (
            <CheckCircle2 size={18} />
          ) : (
            <Play size={14} fill="currentColor" />
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-xs sm:text-sm font-bold text-text truncate group-hover:text-primary transition-colors">
              {lesson.title}
            </h4>
            <span className="text-[10px] uppercase font-bold px-2 py-0.2 rounded-md bg-surface border border-border text-text-muted">
              {lesson.category}
            </span>
          </div>
          <p className="text-[11px] text-text-muted truncate mt-0.5">
            {lesson.conceptSummary}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[11px] font-semibold text-text-muted flex items-center gap-1">
          <Clock size={12} />
          {lesson.estimatedMinutes}m
        </span>
        <ArrowRight size={14} className="text-text-muted group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
      </div>
    </div>
  );
};

export const UnitCard: React.FC<{ unit: Unit }> = ({ unit }) => {
  const isLocked = unit.status === 'locked';
  const isCompleted = unit.status === 'completed';

  return (
    <div
      className={`
        rounded-3xl border p-5 sm:p-6 transition-all
        ${
          isLocked
            ? 'bg-card/50 border-border opacity-70'
            : isCompleted
            ? 'bg-card border-border shadow-xs'
            : 'bg-card border-primary/40 shadow-sm'
        }
      `}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-2xl shadow-xs shrink-0">
            {unit.icon}
          </div>
          <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
              Unit {unit.unitNumber}
            </span>
            <h3 className="text-base sm:text-lg font-black text-text">
              {unit.title}
            </h3>
            <p className="text-xs text-text-muted font-medium mt-0.5">
              {unit.subtitle}
            </p>
          </div>
        </div>

        <div className="self-start sm:self-auto">
          {isLocked ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-text-muted text-xs font-bold">
              <Lock size={12} /> Locked
            </span>
          ) : isCompleted ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold">
              <CheckCircle2 size={13} /> Completed
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold">
              In Progress
            </span>
          )}
        </div>
      </div>

      <p className="text-xs text-text-muted mb-4 leading-relaxed">
        {unit.description}
      </p>

      {/* Lesson List */}
      <div className="space-y-2.5">
        {unit.lessons.length > 0 ? (
          unit.lessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))
        ) : (
          <div className="p-4 rounded-xl bg-surface text-center text-xs text-text-muted border border-border/80">
            Lessons unlocking upon completion of earlier units.
          </div>
        )}
      </div>
    </div>
  );
};
