import React from 'react';
import { PageHeader } from '../layout/PageHeader';
import { useUser } from '../../context/UserContext';
import { SkillProgressOverview } from '../home/SkillProgressOverview';
import { Flame, Sparkles, Clock, CheckCircle2, Award, Calendar, TrendingUp } from 'lucide-react';

export const ProgressView: React.FC = () => {
  const { user } = useUser();

  const metrics = [
    { label: 'Continuous Streak', val: `${user.streakDays} Days`, icon: Flame, color: 'text-amber-500 bg-amber-500/10' },
    { label: 'Fluency Practice XP', val: `${user.xp} XP`, icon: Sparkles, color: 'text-indigo-500 bg-indigo-500/10' },
    { label: 'Spoken Today', val: `${user.minutesSpokenToday} / ${user.dailyGoalMinutes} min`, icon: Clock, color: 'text-emerald-500 bg-emerald-500/10' },
    { label: 'Active CEFR Level', val: `${user.currentLevel} Beginner`, icon: Award, color: 'text-primary bg-primary/10' },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <PageHeader
        title="Skills & Speaking Analytics"
        subtitle="Transparent progress calculated from verified completed lessons and voice speaking sessions"
        badge="Activity-Driven"
      />

      {/* Gamification Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="p-4 rounded-2xl bg-card border border-border shadow-xs">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${m.color}`}>
                <Icon size={18} />
              </div>
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                {m.label}
              </span>
              <span className="text-base sm:text-lg font-black text-text mt-0.5 block truncate">
                {m.val}
              </span>
            </div>
          );
        })}
      </div>

      {/* Comprehensive 8 Skills Progress Overview */}
      <SkillProgressOverview />

      {/* Weekly Goal Tracker */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-black text-text">Weekly Consistency</h3>
            <p className="text-xs text-text-muted mt-0.5">Your speaking habit over the last 7 days</p>
          </div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            5 / 7 Days Active
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
            const completed = idx < 5;
            return (
              <div key={day} className="flex flex-col items-center">
                <span className="text-[11px] font-semibold text-text-muted mb-2">{day}</span>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                    completed
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'bg-surface border border-border text-text-muted'
                  }`}
                >
                  {completed ? '✓' : ''}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
