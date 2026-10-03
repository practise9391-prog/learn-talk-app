import React from 'react';
import {
  Flame,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Sliders,
  Play,
} from 'lucide-react';
import { useGamification } from '../../context/GamificationContext';
import { useNavigation } from '../../context/NavigationContext';

export const DailyGoalCard: React.FC = () => {
  const {
    dailyPlan,
    streakData,
    gamificationSettings,
    useStreakFreeze,
    repairStreakWithTask,
    openSettingsModal,
    completeDailyBonusQuest,
  } = useGamification();

  const { navigate } = useNavigation();

  const minutesProgress = Math.min(
    100,
    Math.round((dailyPlan.completedMinutes / dailyPlan.targetMinutes) * 100)
  );

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-card border border-border shadow-xs space-y-6">
      {/* Header: Title, Streak & Settings */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider">
              Today's Practice Blueprint
            </span>
            {gamificationSettings.focusMode && (
              <span className="px-2 py-0.5 rounded-full bg-surface border border-border text-[10px] font-bold text-text-muted">
                Focus Mode Active
              </span>
            )}
          </div>
          <h2 className="text-xl font-black text-text">Consistent Speaking Practice</h2>
          <p className="text-xs text-text-muted">
            Small daily conversational habits rewire English fluency faster than weekly cramming.
          </p>
        </div>

        {/* Streak Pill & Settings */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {gamificationSettings.showStreak && !gamificationSettings.focusMode && (
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border text-xs font-black ${
                streakData.isProtectedToday
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                  : 'bg-surface border-border text-text'
              }`}
            >
              <Flame size={16} className="text-amber-500 fill-amber-500 shrink-0" />
              <span>{streakData.currentStreak} Day Streak</span>

              {streakData.freezesAvailable > 0 && (
                <span
                  title={`${streakData.freezesAvailable} Streak Freezes available`}
                  className="w-2 h-2 rounded-full bg-cyan-500"
                />
              )}
            </div>
          )}

          <button
            type="button"
            onClick={openSettingsModal}
            className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface border border-border transition-colors"
            title="Gamification & Goal Preferences"
            aria-label="Gamification Settings"
          >
            <Sliders size={16} />
          </button>
        </div>
      </div>

      {/* Streak Missed / Repair Banner */}
      {streakData.missedYesterday && streakData.canRepairStreak && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <ShieldAlert size={20} className="text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-text block">You missed yesterday's speaking practice!</span>
              <p className="text-text-muted text-[11px] mt-0.5">
                Don't worry—complete a quick 3-minute revision session right now to repair and restore your streak.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={repairStreakWithTask}
            className="px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs shadow-md hover:bg-amber-600 transition-colors flex items-center justify-center gap-1.5 shrink-0"
          >
            <RotateCcw size={14} />
            <span>Repair Streak Now</span>
          </button>
        </div>
      )}

      {/* Speaking Minutes Ring / Progress Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-card stroke-current"
                strokeWidth="3.5"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-primary stroke-current transition-all duration-700"
                strokeDasharray={`${minutesProgress}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute text-center">
              <Clock size={16} className="text-primary mx-auto" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-text">
                {dailyPlan.completedMinutes} of {dailyPlan.targetMinutes} Spoken Minutes
              </span>
              {dailyPlan.isGoalAchieved && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                  <CheckCircle2 size={11} /> Goal Reached
                </span>
              )}
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              {dailyPlan.isGoalAchieved
                ? 'Target achieved! Any extra speaking reinforces long-term conversational memory.'
                : `${dailyPlan.targetMinutes - dailyPlan.completedMinutes} minutes remaining to hit your daily speaking target.`}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/talk/jarvis')}
          className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md shadow-primary/20 hover:bg-primary-hover transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Play size={14} fill="currentColor" />
          <span>Speak with Jarvis</span>
        </button>
      </div>

      {/* Adaptive Daily Quests */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={15} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-text">
              Targeted Adaptive Quests ({dailyPlan.completedActivities}/{dailyPlan.bonusQuests.length})
            </h3>
          </div>
          <span className="text-[11px] text-text-muted font-medium">
            Personalized to your learning gaps
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {dailyPlan.bonusQuests.map((quest) => (
            <div
              key={quest.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                quest.completed
                  ? 'bg-surface/50 border-emerald-500/30'
                  : 'bg-card border-border hover:border-primary/40'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-surface text-[10px] font-bold text-text-muted uppercase tracking-wider border border-border/60">
                    {quest.skill}
                  </span>
                  {quest.completed ? (
                    <span className="text-emerald-500 flex items-center gap-1 text-[11px] font-bold">
                      <CheckCircle2 size={14} /> Done
                    </span>
                  ) : (
                    gamificationSettings.showXP && (
                      <span className="text-[10px] font-bold text-indigo-500">
                        +{quest.xpReward} XP
                      </span>
                    )
                  )}
                </div>

                <h4 className="text-xs font-bold text-text">{quest.title}</h4>
                <p className="text-[11px] text-text-muted leading-relaxed line-clamp-2">
                  {quest.description}
                </p>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => navigate(quest.route)}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <span>Start Practice</span>
                  <ArrowRight size={13} />
                </button>

                {!quest.completed && (
                  <button
                    type="button"
                    onClick={() => completeDailyBonusQuest(quest.id)}
                    className="text-[10px] font-semibold text-text-muted hover:text-text px-2 py-1 rounded-lg hover:bg-surface transition-colors"
                  >
                    Mark Done
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
