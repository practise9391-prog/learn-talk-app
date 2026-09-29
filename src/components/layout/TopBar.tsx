import React, { useState } from 'react';
import { Flame, Sparkles, Sun, Moon, Palette, Bell, Volume2, Shield } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { useNavigation } from '../../context/NavigationContext';
import { ThemePalette } from '../../types';

export const TopBar: React.FC = () => {
  const { mode, palette, isDark, setMode, setPalette } = useTheme();
  const { user } = useUser();
  const { navigate } = useNavigation();
  const [showPaletteMenu, setShowPaletteMenu] = useState(false);

  const palettes: { id: ThemePalette; label: string; color: string }[] = [
    { id: 'purple', label: 'Purple Indigo', color: '#6366f1' },
    { id: 'ocean', label: 'Ocean Cyan', color: '#0284c7' },
    { id: 'forest', label: 'Forest Green', color: '#059669' },
    { id: 'sunset', label: 'Sunset Coral', color: '#f97316' },
    { id: 'minimal', label: 'Monochrome', color: '#71717a' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-surface/80 backdrop-blur-md border-b border-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand & Level */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            onClick={() => navigate('/home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-black text-xl shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
              LT
            </div>
            <div className="hidden sm:block">
              <span className="font-extrabold text-lg tracking-tight text-text">
                Learn<span className="text-primary">Talk</span>
              </span>
              <p className="text-[10px] text-text-muted font-medium -mt-1 truncate">
                Think in English. Speak with Confidence.
              </p>
            </div>
          </div>

          {/* Current Level Pill */}
          <button
            type="button"
            onClick={() => navigate('/learn')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold hover:bg-primary/20 transition-colors"
            title="Click to view learning path"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>{user.currentLevel} Beginner</span>
          </button>
        </div>

        {/* User Stats & Global Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Daily Streak */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold"
            title={`${user.streakDays} Day Continuous Speaking Streak`}
          >
            <Flame size={15} className="fill-amber-500 text-amber-500 animate-bounce-subtle" />
            <span>{user.streakDays}d</span>
          </div>

          {/* XP Token */}
          <div
            className="hidden xs:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold"
            title={`${user.xp} Practice XP Earned`}
          >
            <Sparkles size={14} className="fill-indigo-500 text-indigo-500" />
            <span>{user.xp} XP</span>
          </div>

          {/* Speaking Minutes Today */}
          <div
            onClick={() => navigate('/progress')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold cursor-pointer hover:bg-emerald-500/20 transition-colors"
            title="Today's Speaking Minutes: click to view progress"
          >
            <Volume2 size={14} />
            <span>{user.minutesSpokenToday}/{user.dailyGoalMinutes}m</span>
          </div>

          <div className="h-5 w-[1px] bg-border mx-0.5" />

          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            onClick={() => setMode(isDark ? 'light' : 'dark')}
            className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-card border border-transparent hover:border-border transition-colors"
            aria-label="Toggle Light and Dark Mode"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
          >
            {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
          </button>

          {/* Theme Palette Picker Popover */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPaletteMenu(!showPaletteMenu)}
              className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-card border border-transparent hover:border-border transition-colors"
              aria-label="Customize Theme Palette"
              title="Change color theme"
            >
              <Palette size={18} />
            </button>

            {showPaletteMenu && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowPaletteMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 py-2 bg-surface rounded-2xl border border-border shadow-xl z-40 animate-fadeIn">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-text-muted uppercase tracking-wider">
                    Select Theme Palette
                  </div>
                  {palettes.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setPalette(p.id);
                        setShowPaletteMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold hover:bg-card transition-colors ${
                        palette === p.id ? 'text-primary' : 'text-text'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10"
                          style={{ backgroundColor: p.color }}
                        />
                        {p.label}
                      </span>
                      {palette === p.id && <span className="text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* User Profile Avatar / Settings Shortcut */}
          <button
            type="button"
            onClick={() => navigate('/settings')}
            className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 border border-border flex items-center justify-center text-xs font-bold text-text hover:ring-2 hover:ring-primary/40 transition-all ml-1"
            title="User Profile & Settings"
          >
            {user.name.slice(0, 2).toUpperCase()}
          </button>
        </div>
      </div>
    </header>
  );
};
