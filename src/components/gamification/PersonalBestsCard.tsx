import React from 'react';
import { Trophy, Clock, Zap, Mic, Flame, BookOpen, ShieldCheck } from 'lucide-react';
import { useGamification } from '../../context/GamificationContext';

export const PersonalBestsCard: React.FC = () => {
  const { personalBests, gamificationSettings } = useGamification();

  if (gamificationSettings.focusMode) {
    return null;
  }

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSecs = sec % 60;
    return `${mins}m ${remainingSecs > 0 ? `${remainingSecs}s` : ''}`;
  };

  const records = [
    {
      label: 'Longest Spoken Session',
      val: formatSeconds(personalBests.longestConversationSeconds),
      icon: Clock,
      detail: 'Continuous speech flow',
      color: 'text-indigo-500 bg-indigo-500/10',
    },
    {
      label: 'Highest Speaking Pace',
      val: `${personalBests.highestFluencyWPM} WPM`,
      icon: Zap,
      detail: 'Natural conversational tempo',
      color: 'text-amber-500 bg-amber-500/10',
    },
    {
      label: 'Cleanest 60s Session',
      val: `${personalBests.lowestFillerCountInSession} filler`,
      icon: Mic,
      detail: 'Minimizing "um" and "like"',
      color: 'text-emerald-500 bg-emerald-500/10',
    },
    {
      label: 'Highest Speaking Score',
      val: `${personalBests.highestSpeakingScore}%`,
      icon: Trophy,
      detail: 'Scored speaking assessment',
      color: 'text-primary bg-primary/10',
    },
    {
      label: 'Longest Habit Streak',
      val: `${personalBests.longestStreakDays} Days`,
      icon: Flame,
      detail: 'Daily consistent practice',
      color: 'text-rose-500 bg-rose-500/10',
    },
    {
      label: 'Active Words Mastered',
      val: `${personalBests.wordsMasteredCount} Words`,
      icon: BookOpen,
      detail: 'Retained in long-term memory',
      color: 'text-cyan-500 bg-cyan-500/10',
    },
  ];

  return (
    <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Trophy size={18} />
          </div>
          <div>
            <h3 className="text-base font-black text-text">Personal Speaking Records</h3>
            <p className="text-xs text-text-muted">Evidence of your authentic communication progress</p>
          </div>
        </div>
        <span className="text-[11px] text-text-muted font-mono font-medium">
          Updated {new Date(personalBests.lastUpdated).toLocaleDateString()}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {records.map((r, idx) => {
          const Icon = r.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-surface border border-border/80 space-y-1.5 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-text-muted truncate block">{r.label}</span>
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${r.color}`}>
                  <Icon size={13} />
                </div>
              </div>
              <span className="text-lg font-black text-text block">{r.val}</span>
              <span className="text-[10px] text-text-muted block leading-tight">{r.detail}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
