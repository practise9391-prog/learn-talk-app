import React from 'react';
import {
  Sliders,
  Eye,
  EyeOff,
  Flame,
  Sparkles,
  Shield,
  Clock,
  CheckCircle2,
  X,
  Volume2,
} from 'lucide-react';
import { useGamification } from '../../context/GamificationContext';

export const GamificationSettingsModal: React.FC = () => {
  const {
    gamificationSettings,
    updateGamificationSettings,
    streakData,
    useStreakFreeze,
    isSettingsModalOpen,
    closeSettingsModal,
  } = useGamification();

  if (!isSettingsModalOpen) return null;

  const timezones = [
    { id: 'auto', label: 'Automatic (Browser Local)' },
    { id: 'UTC', label: 'UTC (Universal Coordinated)' },
    { id: 'America/New_York', label: 'Eastern Time (US / Canada)' },
    { id: 'America/Los_Angeles', label: 'Pacific Time (US / Canada)' },
    { id: 'Europe/London', label: 'London (GMT / BST)' },
    { id: 'Asia/Kolkata', label: 'India Standard Time (IST)' },
    { id: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { id: 'Australia/Sydney', label: 'Sydney (AEST)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg p-6 sm:p-7 rounded-3xl bg-card border border-border shadow-2xl space-y-6">
        <button
          type="button"
          onClick={closeSettingsModal}
          className="absolute top-4 right-4 p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface transition-colors"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Sliders size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-text">Motivation & Focus Settings</h2>
            <p className="text-xs text-text-muted">
              Customize how rewards, streaks, and gamification behave to fit your learning style.
            </p>
          </div>
        </div>

        {/* Focus Mode Master Switch */}
        <div className="p-4 rounded-2xl bg-surface border border-border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {gamificationSettings.focusMode ? (
                <EyeOff size={18} className="text-amber-500" />
              ) : (
                <Eye size={18} className="text-primary" />
              )}
              <div>
                <span className="text-sm font-bold text-text block">Focus Mode (Calm Learning)</span>
                <span className="text-[11px] text-text-muted block">
                  Hides XP, streaks, level celebrations, and badges for a quiet, distraction-free space.
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => updateGamificationSettings({ focusMode: !gamificationSettings.focusMode })}
              className={`w-12 h-6.5 rounded-full transition-colors relative flex items-center px-0.5 ${
                gamificationSettings.focusMode ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-5.5 h-5.5 rounded-full bg-white transition-transform ${
                  gamificationSettings.focusMode ? 'translate-x-5.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Individual Toggles (active if not in Focus Mode) */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted block">
            Interface Elements
          </span>

          {/* Show XP */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border/80">
            <div className="flex items-center gap-2.5">
              <Sparkles size={16} className="text-indigo-500" />
              <div className="text-xs">
                <span className="font-bold text-text block">Display XP Points</span>
                <span className="text-[11px] text-text-muted">Show practice points on activities and top bar</span>
              </div>
            </div>
            <button
              type="button"
              disabled={gamificationSettings.focusMode}
              onClick={() => updateGamificationSettings({ showXP: !gamificationSettings.showXP })}
              className={`w-10 h-5.5 rounded-full transition-colors relative flex items-center px-0.5 ${
                gamificationSettings.showXP && !gamificationSettings.focusMode
                  ? 'bg-primary'
                  : 'bg-slate-300 dark:bg-slate-700 opacity-60'
              }`}
            >
              <div
                className={`w-4.5 h-4.5 rounded-full bg-white transition-transform ${
                  gamificationSettings.showXP && !gamificationSettings.focusMode ? 'translate-x-4.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Show Streak */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border/80">
            <div className="flex items-center gap-2.5">
              <Flame size={16} className="text-amber-500 fill-amber-500" />
              <div className="text-xs">
                <span className="font-bold text-text block">Display Habit Streak</span>
                <span className="text-[11px] text-text-muted">Show daily consecutive practice count</span>
              </div>
            </div>
            <button
              type="button"
              disabled={gamificationSettings.focusMode}
              onClick={() => updateGamificationSettings({ showStreak: !gamificationSettings.showStreak })}
              className={`w-10 h-5.5 rounded-full transition-colors relative flex items-center px-0.5 ${
                gamificationSettings.showStreak && !gamificationSettings.focusMode
                  ? 'bg-primary'
                  : 'bg-slate-300 dark:bg-slate-700 opacity-60'
              }`}
            >
              <div
                className={`w-4.5 h-4.5 rounded-full bg-white transition-transform ${
                  gamificationSettings.showStreak && !gamificationSettings.focusMode ? 'translate-x-4.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Celebration Modals & Animations */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border/80">
            <div className="flex items-center gap-2.5">
              <Volume2 size={16} className="text-primary" />
              <div className="text-xs">
                <span className="font-bold text-text block">Level Up & Milestone Celebrations</span>
                <span className="text-[11px] text-text-muted">Pop-ups celebrating practice achievements</span>
              </div>
            </div>
            <button
              type="button"
              disabled={gamificationSettings.focusMode}
              onClick={() =>
                updateGamificationSettings({ showCelebrationModals: !gamificationSettings.showCelebrationModals })
              }
              className={`w-10 h-5.5 rounded-full transition-colors relative flex items-center px-0.5 ${
                gamificationSettings.showCelebrationModals && !gamificationSettings.focusMode
                  ? 'bg-primary'
                  : 'bg-slate-300 dark:bg-slate-700 opacity-60'
              }`}
            >
              <div
                className={`w-4.5 h-4.5 rounded-full bg-white transition-transform ${
                  gamificationSettings.showCelebrationModals && !gamificationSettings.focusMode
                    ? 'translate-x-4.5'
                    : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Timezone Preference */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-text-muted block">
            Streak Reset Timezone
          </label>
          <select
            value={gamificationSettings.timezone}
            onChange={(e) => updateGamificationSettings({ timezone: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none focus:border-primary"
          >
            {timezones.map((tz) => (
              <option key={tz.id} value={tz.id}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>

        {/* Streak Freeze Management */}
        <div className="p-4 rounded-2xl bg-surface border border-border space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-cyan-500" />
              <span className="font-bold text-text">Streak Protection Freezes</span>
            </div>
            <span className="font-mono font-bold text-text">
              {streakData.freezesAvailable} / {streakData.freezesMax} Freezes
            </span>
          </div>
          <p className="text-[11px] text-text-muted leading-relaxed">
            Freezes automatically safeguard your continuous practice streak if you are unable to practice for a single day.
          </p>

          <div className="pt-1">
            <button
              type="button"
              disabled={streakData.freezesAvailable <= 0 || streakData.isProtectedToday}
              onClick={useStreakFreeze}
              className={`w-full py-2 rounded-xl text-xs font-bold border transition-colors ${
                streakData.isProtectedToday
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                  : streakData.freezesAvailable > 0
                  ? 'bg-card border-border hover:border-cyan-500/40 text-text'
                  : 'bg-surface border-border text-text-muted opacity-50 cursor-not-allowed'
              }`}
            >
              {streakData.isProtectedToday
                ? 'Streak is already protected for today'
                : streakData.freezesAvailable > 0
                ? 'Activate Streak Freeze for Today'
                : 'No Streak Freezes remaining'}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={closeSettingsModal}
          className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md shadow-primary/25 hover:bg-primary-hover transition-all"
        >
          Save & Close
        </button>
      </div>
    </div>
  );
};
