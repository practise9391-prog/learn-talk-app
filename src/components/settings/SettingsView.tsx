import React, { useState } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { useHistory } from '../../context/HistoryContext';
import { useNotifications } from '../../context/NotificationContext';
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
  Eye,
  Bell,
  Download,
  AlertTriangle,
  User,
  Sliders,
  Compass,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { mode, palette, isDark, setMode, setPalette } = useTheme();
  const { user, updateUser, updateSettings, deleteRecording, recordings } = useUser();
  const { exportUserData } = useHistory();
  const { reminderPreferences, updateReminderPreferences } = useNotifications();

  const [activeSection, setActiveSection] = useState<
    'account' | 'learning' | 'ai' | 'audio' | 'appearance' | 'privacy' | 'notifications'
  >('learning');

  const [correctionLevel, setCorrectionLevel] = useState<'gentle' | 'balanced' | 'detailed'>('balanced');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

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

  const dailyGoals = [5, 10, 15, 20, 30];

  const handleClearAllRecordings = () => {
    if (confirm('Permanently delete all stored voice audio files? Transcripts and progress will be preserved.')) {
      recordings.forEach((r) => deleteRecording(r.id));
      alert('All voice recordings have been safely deleted.');
    }
  };

  const handleDeleteAccount = () => {
    localStorage.clear();
    alert('Your account and local learning data have been completely deleted.');
    window.location.reload();
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-12">
      <PageHeader
        title="Settings & Preferences"
        subtitle="Manage your learner account, AI coaching style, appearance, privacy, and notifications"
        badge="Preferences"
        showBack={true}
      />

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'learning', label: 'Learning & Goals', icon: Compass },
          { id: 'ai', label: 'AI & Coach Style', icon: Bot },
          { id: 'appearance', label: 'Appearance', icon: Palette },
          { id: 'audio', label: 'Audio & Speech', icon: Volume2 },
          { id: 'notifications', label: 'Reminders', icon: Bell },
          { id: 'privacy', label: 'Privacy & Data', icon: Shield },
          { id: 'account', label: 'Account', icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 border ${
                isActive
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-card text-text-muted hover:text-text border-border hover:bg-surface'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. LEARNING SECTION */}
      {activeSection === 'learning' && (
        <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-6">
          <h3 className="text-base font-black text-text flex items-center gap-2">
            <Compass size={18} className="text-primary" />
            <span>Learning Goals & Daily Targets</span>
          </h3>

          {/* Daily Practice Target */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider block">
              Daily Speaking Target (Minutes)
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {dailyGoals.map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => updateUser({ dailyGoalMinutes: mins })}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    user.dailyGoalMinutes === mins
                      ? 'bg-primary text-white border-primary shadow-2xs'
                      : 'bg-surface border-border text-text hover:bg-card'
                  }`}
                >
                  {mins} Minutes / day
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Support Language */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider block">
              Native Language Support
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { name: 'Telugu', desc: 'తెలుగు వివరణలు & అర్థాలు' },
                { name: 'Hindi', desc: 'हिंदी अनुवाद और स्पष्टीकरण' },
                { name: 'English Only', desc: 'Full immersive English' },
              ].map((lang) => (
                <div
                  key={lang.name}
                  onClick={() =>
                    updateUser({
                      nativeLanguages: [lang.name],
                    })
                  }
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-0.5 ${
                    user.nativeLanguages.includes(lang.name) ||
                    (lang.name === 'English Only' && user.nativeLanguages.length === 0)
                      ? 'bg-primary/10 border-primary text-primary font-bold'
                      : 'bg-surface border-border text-text hover:bg-card'
                  }`}
                >
                  <span className="text-xs block">{lang.name}</span>
                  <span className="text-[11px] text-text-muted font-normal">{lang.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. AI & COACH STYLE */}
      {activeSection === 'ai' && (
        <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-6">
          <h3 className="text-base font-black text-text flex items-center gap-2">
            <Bot size={18} className="text-primary" />
            <span>AI Coach & Correction Preferences</span>
          </h3>

          {/* Correction Level (Requirement 6) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider block">
              Feedback Frequency & Strictness
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'gentle',
                  title: 'Gentle Coaching',
                  desc: 'Corrects only major mistakes that impede basic comprehension.',
                },
                {
                  id: 'balanced',
                  title: 'Balanced (Recommended)',
                  desc: 'Identifies important grammar, tense, and vocabulary collocations.',
                },
                {
                  id: 'detailed',
                  title: 'Detailed Master',
                  desc: 'Provides comprehensive nuance, pronunciation, and native phrasing tips.',
                },
              ].map((c) => (
                <div
                  key={c.id}
                  onClick={() => setCorrectionLevel(c.id as any)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-1 ${
                    correctionLevel === c.id
                      ? 'bg-primary/10 border-primary text-primary shadow-2xs'
                      : 'bg-surface border-border text-text hover:bg-card'
                  }`}
                >
                  <span className="text-xs font-bold block">{c.title}</span>
                  <p className="text-[11px] text-text-muted leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Personality (Requirement 7) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider block">
              AI Presentation Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                'Friendly Friend',
                'Supportive Teacher',
                'Professional Lead',
                'Patient Coach',
                'Corporate Interviewer',
                'Conversation Partner',
              ].map((style) => (
                <div
                  key={style}
                  className="p-3 rounded-xl bg-surface border border-border text-xs font-semibold text-text hover:border-primary cursor-pointer transition-colors"
                >
                  {style}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. APPEARANCE */}
      {activeSection === 'appearance' && (
        <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-6">
          <h3 className="text-base font-black text-text flex items-center gap-2">
            <Palette size={18} className="text-primary" />
            <span>Theme & Display Customization</span>
          </h3>

          {/* Mode Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider block">
              Interface Mode
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
                    className={`p-3.5 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-xs'
                        : 'bg-surface text-text border-border hover:bg-card'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Palette Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider block">
              Accent Color Palette
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {palettes.map((p) => {
                const isSelected = palette === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPalette(p.id)}
                    className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/30 bg-surface'
                        : 'border-border bg-surface hover:bg-card'
                    }`}
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
      )}

      {/* 4. AUDIO & SPEECH */}
      {activeSection === 'audio' && (
        <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-6">
          <h3 className="text-base font-black text-text flex items-center gap-2">
            <Volume2 size={18} className="text-primary" />
            <span>Audio Playback & Speaking Cadence</span>
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface border border-border">
              <div>
                <h4 className="text-xs font-bold text-text">Autoplay Audio Models</h4>
                <p className="text-[11px] text-text-muted">Automatically speak example sentences in lessons</p>
              </div>
              <input
                type="checkbox"
                defaultChecked={true}
                className="w-4 h-4 rounded accent-primary cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface border border-border">
              <div>
                <h4 className="text-xs font-bold text-text">Interactive Sound Effects</h4>
                <p className="text-[11px] text-text-muted">Chimes on quiz completion and challenge milestones</p>
              </div>
              <input
                type="checkbox"
                checked={user.settings.soundEffects}
                onChange={(e) => updateSettings({ soundEffects: e.target.checked })}
                className="w-4 h-4 rounded accent-primary cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* 5. NOTIFICATIONS */}
      {activeSection === 'notifications' && (
        <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-6">
          <h3 className="text-base font-black text-text flex items-center gap-2">
            <Bell size={18} className="text-primary" />
            <span>Practice Reminders & Notification Schedules</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface border border-border">
              <div>
                <h4 className="font-bold text-text">Enable Practice Reminders</h4>
                <p className="text-text-muted">Friendly prompts to protect your speaking habit streak</p>
              </div>
              <input
                type="checkbox"
                checked={reminderPreferences.enabled}
                onChange={(e) => updateReminderPreferences({ enabled: e.target.checked })}
                className="w-4 h-4 rounded accent-primary cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface border border-border">
              <div>
                <h4 className="font-bold text-text">Spaced Repetition Review Alerts</h4>
                <p className="text-text-muted">Notifies when vocabulary cards are at risk of forgetting</p>
              </div>
              <input
                type="checkbox"
                checked={reminderPreferences.revisionReminders}
                onChange={(e) => updateReminderPreferences({ revisionReminders: e.target.checked })}
                className="w-4 h-4 rounded accent-primary cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface border border-border">
              <div>
                <h4 className="font-bold text-text">Daily Speaking Challenge</h4>
                <p className="text-text-muted">Alerts when a fresh 60-second challenge is unlocked</p>
              </div>
              <input
                type="checkbox"
                checked={reminderPreferences.dailyChallengeReminders}
                onChange={(e) => updateReminderPreferences({ dailyChallengeReminders: e.target.checked })}
                className="w-4 h-4 rounded accent-primary cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* 6. PRIVACY & DATA */}
      {activeSection === 'privacy' && (
        <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-6">
          <h3 className="text-base font-black text-text flex items-center gap-2">
            <Shield size={18} className="text-primary" />
            <span>Privacy, Consent & Data Ownership</span>
          </h3>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400 space-y-1">
            <span className="font-bold block">Private by Default Guarantee:</span>
            <p className="leading-relaxed">
              Audio recordings and transcripts are never exposed publicly or shared with third parties. Recordings are securely stored with authenticated access only.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-surface border border-border">
              <div>
                <h4 className="text-xs font-bold text-text">Explicit Voice Recording Consent</h4>
                <p className="text-[11px] text-text-muted">Allow local saving of speaking sessions for self-review</p>
              </div>
              <input
                type="checkbox"
                checked={user.settings.recordingPermissionsGranted}
                onChange={(e) => updateSettings({ recordingPermissionsGranted: e.target.checked })}
                className="w-4 h-4 rounded accent-primary cursor-pointer"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-surface border border-border">
              <div>
                <h4 className="text-xs font-bold text-text">Download All My Data (JSON)</h4>
                <p className="text-[11px] text-text-muted">Export your full history, transcripts, and mistake logs</p>
              </div>
              <button
                type="button"
                onClick={exportUserData}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs hover:bg-primary-hover transition-all"
              >
                <Download size={13} />
                <span>Export Data</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-surface border border-border">
              <div>
                <h4 className="text-xs font-bold text-text">Delete Voice Audio Recordings</h4>
                <p className="text-[11px] text-text-muted">Purge audio files while preserving educational progress</p>
              </div>
              <button
                type="button"
                onClick={handleClearAllRecordings}
                className="px-4 py-2 rounded-xl bg-surface border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all flex items-center gap-1.5"
              >
                <Trash2 size={13} />
                <span>Delete Audio</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. ACCOUNT */}
      {activeSection === 'account' && (
        <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-6">
          <h3 className="text-base font-black text-text flex items-center gap-2">
            <User size={18} className="text-primary" />
            <span>Account Security & Management</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-surface border border-border space-y-2">
              <span className="font-bold text-text block">Account Credentials</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-text-muted uppercase block">Name</span>
                  <span className="font-semibold text-text">{user.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-text-muted uppercase block">Email Address</span>
                  <span className="font-semibold text-text">{user.email}</span>
                </div>
              </div>
            </div>

            {/* Account Deletion Workflow (Requirement 34) */}
            <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 space-y-3">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs">
                <AlertTriangle size={15} />
                <h4>Danger Zone: Account Deletion</h4>
              </div>
              <p className="text-text-muted leading-relaxed">
                Deleting your account will permanently purge your learning streak, completed lessons, verified speaking recordings, and customized vocabulary collections.
              </p>

              {!showDeleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors"
                >
                  Delete My Account
                </button>
              ) : (
                <div className="flex items-center gap-2 pt-1 animate-in fade-in">
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors"
                  >
                    Confirm Permanent Deletion
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-3 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-text hover:bg-card"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
