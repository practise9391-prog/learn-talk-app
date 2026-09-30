import React from 'react';
import { useTest } from '../../context/TestContext';
import { Sparkles, CheckCircle2, Play, Flame, Clock } from 'lucide-react';

interface DailyChallengeBannerProps {
  onStartTest: (testId: string) => void;
}

export const DailyChallengeBanner: React.FC<DailyChallengeBannerProps> = ({ onStartTest }) => {
  const { dailyChallengeTest, isDailyChallengeCompleted } = useTest();

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-card border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
          <Flame size={24} />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              Daily Challenge
            </span>
            <span className="text-xs font-semibold text-text-muted flex items-center gap-1">
              <Clock size={12} />
              {dailyChallengeTest.durationMinutes} min activity
            </span>
            {isDailyChallengeCompleted && (
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 size={13} />
                Completed Today
              </span>
            )}
          </div>

          <h3 className="text-lg font-black text-text">
            {dailyChallengeTest.title}
          </h3>
          <p className="text-xs text-text-muted mt-0.5 max-w-xl leading-relaxed">
            {dailyChallengeTest.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
        <button
          type="button"
          onClick={() => onStartTest(dailyChallengeTest.id)}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-sm ${
            isDailyChallengeCompleted
              ? 'bg-surface hover:bg-surface-hover text-text border border-border'
              : 'bg-amber-500 hover:bg-amber-600 text-white'
          }`}
        >
          {isDailyChallengeCompleted ? (
            <>
              <CheckCircle2 size={14} className="text-emerald-500" />
              <span>Practice Again (+25 XP)</span>
            </>
          ) : (
            <>
              <Play size={14} fill="currentColor" />
              <span>Start Daily Challenge (+100 XP)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
