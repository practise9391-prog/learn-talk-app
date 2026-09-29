import React from 'react';
import { Sparkles, ArrowRight, Play } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useNavigation } from '../../context/NavigationContext';

export const WelcomeSection: React.FC = () => {
  const { user } = useUser();
  const { navigate } = useNavigation();

  // Dynamic greeting based on current local hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/15 via-secondary/10 to-card border border-primary/20 p-6 sm:p-8 mb-6 shadow-sm">
      {/* Decorative background aura */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-10 w-40 h-40 bg-secondary/15 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface/80 border border-border text-xs font-bold text-text-muted mb-3 shadow-xs">
            <span className="text-primary font-black">Level {user.currentLevel}</span>
            <span>•</span>
            <span>Beginner Foundation</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-text tracking-tight">
            {getGreeting()}, {user.name} 👋
          </h1>
          <p className="text-sm sm:text-base text-text-muted mt-2 font-medium leading-relaxed">
            Ready to speak English today? Remember: don't worry about making mistakes. Every mistake is a stepping stone to fluency!
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              type="button"
              onClick={() => navigate('/talk/jarvis')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-bold text-sm rounded-xl shadow-lg shadow-primary/25 hover:bg-primary-hover hover:scale-102 active:scale-98 transition-all"
            >
              <Play size={16} fill="currentColor" />
              <span>Start Speaking Now</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/learn')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface text-text font-bold text-sm rounded-xl border border-border hover:bg-card hover:border-primary/40 transition-all shadow-xs"
            >
              <span>Continue Lessons</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Today's Goal Quick Badge */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center p-4 sm:p-5 rounded-2xl bg-surface/80 border border-border backdrop-blur-sm shrink-0 min-w-[200px]">
          <div className="text-left sm:text-right">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
              Today's Goal
            </span>
            <span className="text-base sm:text-lg font-black text-text flex items-center sm:justify-end gap-1.5 mt-0.5">
              <span>🎯</span>
              <span>Speak for {user.dailyGoalMinutes} min</span>
            </span>
            <p className="text-xs text-text-muted mt-0.5">
              {user.minutesSpokenToday} of {user.dailyGoalMinutes} min completed
            </p>
          </div>

          <div className="w-24 sm:w-36 mt-0 sm:mt-3">
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (user.minutesSpokenToday / user.dailyGoalMinutes) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
