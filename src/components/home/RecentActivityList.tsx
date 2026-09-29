import React from 'react';
import { useUser } from '../../context/UserContext';
import { useNavigation } from '../../context/NavigationContext';
import { Mic, ArrowRight, Play, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

export const RecentActivityList: React.FC = () => {
  const { recordings, mistakes } = useUser();
  const { navigate } = useNavigation();

  return (
    <div className="rounded-3xl bg-card border border-border p-6 sm:p-7 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-text tracking-tight">
            Recent Activity
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Your latest spoken conversations and recorded sessions
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/history')}
          className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
        >
          <span>View All History</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="space-y-3">
        {recordings.slice(0, 3).map((rec) => (
          <div
            key={rec.id}
            onClick={() => navigate('/recordings')}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-surface border border-border hover:border-primary/40 hover:shadow-xs transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Mic size={18} />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-text truncate">
                  {rec.title}
                </h4>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-text-muted">
                  <span>{rec.scenarioName}</span>
                  <span>•</span>
                  <span>{rec.timestamp}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
              <span className="text-xs font-semibold text-text-muted flex items-center gap-1">
                <Clock size={12} />
                {Math.floor(rec.durationSeconds / 60)}m {rec.durationSeconds % 60}s
              </span>

              {rec.correctionsCount > 0 ? (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                  <AlertTriangle size={11} />
                  {rec.correctionsCount} {rec.correctionsCount === 1 ? 'tip' : 'tips'}
                </span>
              ) : (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 size={11} />
                  Fluent turn
                </span>
              )}

              <button
                type="button"
                className="p-1.5 rounded-lg bg-card border border-border text-primary hover:bg-primary hover:text-white transition-colors"
                title="Review recording transcript"
              >
                <Play size={13} fill="currentColor" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
