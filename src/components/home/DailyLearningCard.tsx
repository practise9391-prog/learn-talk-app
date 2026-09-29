import React from 'react';
import { Sparkles, CheckCircle2, Circle, ArrowRight, Play, Clock, BookOpen } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';

export const DailyLearningCard: React.FC = () => {
  const { navigate } = useNavigation();

  const stages = [
    { label: 'Learn', status: 'completed' },
    { label: 'Listen', status: 'completed' },
    { label: 'Speak', status: 'active' },
    { label: 'Practice', status: 'pending' },
    { label: 'Conversation', status: 'pending' },
  ];

  return (
    <div className="rounded-3xl bg-card border border-border p-6 sm:p-7 mb-6 shadow-sm hover:border-primary/40 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-black text-xs uppercase tracking-wider">
            Day 12
          </span>
          <span className="text-xs font-semibold text-text-muted flex items-center gap-1">
            <Clock size={13} />
            12 min session
          </span>
        </div>
        <span className="text-xs font-bold text-amber-500 flex items-center gap-1 self-start sm:self-auto">
          <Sparkles size={14} />
          Recommended Next Step
        </span>
      </div>

      <div className="mb-5">
        <h2 className="text-xl sm:text-2xl font-black text-text tracking-tight mb-1">
          Talking About My Daily Routine
        </h2>
        <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
          Master simple present sentences with time prepositions: waking up, morning coffee, commuting to work, and relaxing after hours.
        </p>
      </div>

      {/* Learning Loop Stages Indicator */}
      <div className="grid grid-cols-5 gap-2 py-3 px-4 rounded-2xl bg-surface border border-border mb-6">
        {stages.map((stage, idx) => (
          <div key={stage.label} className="flex flex-col items-center text-center">
            <div className="mb-1 flex items-center justify-center">
              {stage.status === 'completed' ? (
                <CheckCircle2 size={18} className="text-emerald-500 fill-emerald-500/20" />
              ) : stage.status === 'active' ? (
                <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center ring-4 ring-primary/20 animate-pulse">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              ) : (
                <Circle size={18} className="text-slate-300 dark:text-slate-700" />
              )}
            </div>
            <span
              className={`text-[10px] sm:text-xs font-bold ${
                stage.status === 'completed'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : stage.status === 'active'
                  ? 'text-primary'
                  : 'text-text-muted'
              }`}
            >
              {stage.label}
            </span>
          </div>
        ))}
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-border">
        <div className="flex items-center gap-2 text-xs font-semibold text-text-muted">
          <BookOpen size={15} className="text-primary" />
          <span>Unit 3: Daily Routine & Present Simple</span>
        </div>

        <button
          type="button"
          onClick={() => navigate('/learn/lesson/l-6')}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold text-sm rounded-xl shadow-md shadow-primary/25 hover:bg-primary-hover active:scale-98 transition-all"
        >
          <Play size={16} fill="currentColor" />
          <span>Start Today's Practice</span>
        </button>
      </div>
    </div>
  );
};
