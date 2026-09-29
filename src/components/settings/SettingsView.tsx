import React from 'react';
import { PageHeader } from '../layout/PageHeader';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { AI_PERSONAS } from '../../data/personas';
import { SUPPORTED_LANGUAGES } from '../../data/topics';
import { ThemeMode, ThemePalette, SpeakingPace } from '../../types';
import {
  Sun,
  Moon,
  Laptop,
  Palette,
  Shield,
  Trash2,
  Volume2,
  Clock,
  Sparkles,
  Bot,
  Languages,
  Check,
  Zap,
  Eye
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { mode, palette, setMode, setPalette } = useTheme();
  const { user, updateUser, updateSettings, deleteRecording, recordings } = useUser();

  const themeModes: { id: ThemeMode; label: string; icon: typeof Sun }[] = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Laptop },
  ];

  const palettes: { id: ThemePalette; label: string; color: string }[] = [
    { id: 'purple', label: 'Purple Indigo', color: '#6366f1' },
    { id: 'ocean', label: 'Ocean Cyan', color: '#0284c7' },
    { id: 'forest', label: 'Forest Green', color: '#059669' },
    { id: 'sunset', label: 'Sunset Coral', color: '#f97316' },
    { id: 'minimal', label: 'Monochrome', color: '#71717a' },
  ];

  const paces: { id: SpeakingPace; label: string; desc: string }[] = [
    { id: 'slow', label: 'Slow', desc: 'Extended pauses & deliberate pronunciation' },
    { id: 'normal', label: 'Normal', desc: 'Standard natural conversational cadence' },
    { id: 'fast', label: 'Fast', desc: 'Fast-paced everyday communication' },
    { id: 'challenge', label: 'Challenge', desc: 'Rapid speech and spontaneous thought' },
  ];

  const dailyGoals = [5, 10, 15, 20, 30];

  const handleClearAllRecordings = () => {
    if (confirm("Are you sure you want to permanently delete all stored voice recordings? This cannot be undone.")) {
      recordings.forEach((r) => deleteRecording(r.id));
      alert("All voice recordings have been deleted.");
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <PageHeader
        title="Settings & Preferences"
        subtitle="Customize your AI persona, appearance, privacy, and speaking cadence"
        badge="Preferences"
      />

      {/* Theme & Display Section */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-5">
        <h3 className="text-base font-black text-text flex items-center gap-2">
          <Palette size={18} className="text-primary" />
          <span>Appearance & Color Theme</span>
        </h3>

        {/* Mode Toggle */}
        <div>
          <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">
            Theme Mode
          </label>
          <div className="grid grid-cols-3 gap-3">
            {themeModes.map((m) => {
              const Icon = m.icon;
              const isSelected = mode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id)}
                  className={`
                    p-3.5 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold transition-all
                    ${
                      isSelected
                        ? 'bg-primary text-primary-foreground border-primary shadow-sm scale-102'
                        : 'bg-surface text-text border-border hover:bg-card'
                    }
                  `}
                >
                  <Icon size={16} />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Palette Selector */}
        <div>
          <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">
            Accent Palette
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {palettes.map((p) => {
              const isSelected = palette === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPalette(p.id)}
                  className={`
                    p-3 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all
                    ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/30 bg-surface'
                        : 'border-border bg-surface hover:bg-card'
                    }
                  `}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: p.color }}
                  />
                  <span className="truncate">{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Persona Selection (Requirement 23) */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-text flex items-center gap-2">
            <Bot size={18} className="text-primary" />
            <span>Active AI Conversational Persona</span>
          </h3>
          <span className="text-xs text-text-muted">Affects vocabulary, tone and speed</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {AI_PERSONAS.map((p) => {
            const isSelected = user.settings.activePersonaId === p.id;
            return (
              <div
                key={p.id}
                onClick={() => updateSettings({ activePersonaId: p.id })}
                className={`
                  p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between
                  ${
                    isSelected
                      ? 'bg-primary/10 border-primary ring-2 ring-primary/30 shadow-xs'
                      : 'bg-surface border-border hover:bg-card'
                  }
                `}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{p.avatar}</span>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-text block truncate">
                      {p.name}
                    </span>
                    <span className="text-[10px] text-text-muted">{p.role}</span>
                  </div>
                </div>
                <p className="text-[11px] text-text-muted line-clamp-2 leading-relaxed">
                  {p.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Speaking Cadence & Daily Goals */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-5">
        <h3 className="text-base font-black text-text flex items-center gap-2">
          <Zap size={18} className="text-primary" />
          <span>Speaking Speed & Daily Practice Goals</span>
        </h3>

        {/* Daily Goal Minutes */}
        <div>
          <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">
            Daily Speaking Goal
          </label>
          <div className="grid grid-cols-5 gap-2">
            {dailyGoals.map((mins) => {
              const isSelected = user.dailyGoalMinutes === mins;
              return (
                <button
                  key={mins}
                  type="button"
                  onClick={() => updateUser({ dailyGoalMinutes: mins })}
                  className={`
                    py-2.5 rounded-xl border text-xs font-bold transition-all
                    ${
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-xs'
                        : 'bg-surface text-text border-border hover:bg-card'
                    }
                  `}
                >
                  {mins} min
                </button>
              );
            })}
          </div>
        </div>

        {/* Default Speaking Pace */}
        <div>
          <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">
            Target Speaking Cadence
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {paces.map((pace) => {
              const isSelected = user.settings.speakingPace === pace.id;
              return (
                <div
                  key={pace.id}
                  onClick={() => updateSettings({ speakingPace: pace.id })}
                  className={`
                    p-3 rounded-xl border cursor-pointer transition-all
                    ${
                      isSelected
                        ? 'bg-primary/10 border-primary ring-2 ring-primary/30'
                        : 'bg-surface border-border hover:bg-card'
                    }
                  `}
                >
                  <span className="text-xs font-bold text-text block">{pace.label}</span>
                  <span className="text-[11px] text-text-muted mt-0.5 block">{pace.desc}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Privacy, Storage & Recordings (Requirement 22) */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4">
        <h3 className="text-base font-black text-text flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <Shield size={18} />
          <span>Privacy & Voice Recording Safeguards</span>
        </h3>

        <p className="text-xs text-text-muted leading-relaxed">
          LearnTalk prioritizes your privacy. Your voice audio is never publicly shared, sold, or used for model training without explicit consent.
        </p>

        <div className="p-4 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-text">Stored Voice Recordings</h4>
            <p className="text-[11px] text-text-muted mt-0.5">
              You currently have {recordings.length} session recordings saved locally.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClearAllRecordings}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white rounded-xl text-xs font-bold transition-all border border-red-500/30"
          >
            <Trash2 size={13} />
            <span>Delete All Recordings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
