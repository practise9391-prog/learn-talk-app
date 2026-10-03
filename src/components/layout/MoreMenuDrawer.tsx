import React from 'react';
import {
  X,
  BookOpen,
  Sparkles,
  Compass,
  Layers,
  Mic,
  Users2,
  Award,
  History,
  AlertTriangle,
  TrendingUp,
  FileAudio,
  BookmarkCheck,
  User,
  Settings,
  Shield,
  Search,
  Moon,
  Sun,
  Flame,
  Volume2,
  HeartHandshake,
  Briefcase,
  Building2,
  FlaskConical,
} from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';

interface MoreMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}

export const MoreMenuDrawer: React.FC<MoreMenuDrawerProps> = ({
  isOpen,
  onClose,
  onOpenSearch,
}) => {
  const { navigate, currentRoute } = useNavigation();
  const { isDark, setMode } = useTheme();
  const { user } = useUser();

  if (!isOpen) return null;

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  const isCurrent = (path: string) => currentRoute.path === path;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-Up Drawer */}
      <div className="fixed bottom-0 left-0 right-0 max-h-[88vh] bg-surface border-t border-border rounded-t-3xl shadow-2xl overflow-y-auto flex flex-col z-10 animate-slideUp safe-area-pb">
        {/* Header */}
        <div className="sticky top-0 bg-surface/95 backdrop-blur-md px-5 py-4 border-b border-border flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-black text-sm shadow-xs">
              LT
            </div>
            <div>
              <h2 className="text-base font-black text-text">Explore All Features</h2>
              <p className="text-[11px] text-text-muted">Learn â¢ Talk â¢ Think Ecosystem</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSearch();
              }}
              className="p-2 rounded-xl bg-card border border-border text-text-muted hover:text-text"
              title="Search Curriculum"
              aria-label="Search Curriculum"
            >
              <Search size={16} />
            </button>

            <button
              type="button"
              onClick={() => setMode(isDark ? 'light' : 'dark')}
              className="p-2 rounded-xl bg-card border border-border text-text-muted hover:text-text"
              title="Toggle Theme"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-card border border-border text-text-muted hover:text-text"
              aria-label="Close menu"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* User Summary Pill */}
        <div className="px-5 py-3 bg-surface-elevated/40 border-b border-border flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-text">{user.name}</span>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-extrabold">
              {user.currentLevel}
            </span>
          </div>

          <div className="flex items-center gap-3 font-semibold text-text-muted">
            <span className="flex items-center gap-1 text-amber-500 font-bold">
              <Flame size={13} fill="currentColor" /> {user.streakDays}d
            </span>
            <span className="flex items-center gap-1 text-emerald-500 font-bold">
              <Volume2 size={13} /> {user.minutesSpokenToday}m
            </span>
          </div>
        </div>

        <div className="p-5 space-y-6">
          {/* Section 1: Knowledge Bank */}
          <div>
            <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2.5 px-1">
              Knowledge Bank
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { path: '/grammar', label: 'Grammar Modules', icon: BookOpen, desc: 'Rules & Tenses' },
                { path: '/vocabulary', label: 'Vocabulary Bank', icon: Sparkles, desc: 'Words & Flashcards' },
                { path: '/idioms', label: 'Idioms & Metaphors', icon: Compass, desc: 'Expressive Talk' },
                { path: '/phrasal-verbs', label: 'Phrasal Verbs', icon: Layers, desc: 'Everyday Actions' },
                { path: '/pronunciation', label: 'Pronunciation Lab', icon: Mic, desc: 'Speech Clarity' },
                { path: '/talk/saved-phrases', label: 'Saved Phrases', icon: BookmarkCheck, desc: 'Saved Words' },
              ].map((item) => {
                const Icon = item.icon;
                const active = isCurrent(item.path);
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => handleNav(item.path)}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                      active
                        ? 'bg-primary/10 border-primary shadow-xs'
                        : 'bg-card border-border hover:border-primary/40'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-text block truncate">{item.label}</span>
                      <span className="text-[10px] text-text-muted block truncate">{item.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Interactive Speaking & Tests */}
          <div>
            <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2.5 px-1">
              Interactive & Assessment
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { path: '/career', label: 'Career English', icon: Briefcase, desc: 'Interviews & Resume' },
                { path: '/workplace', label: 'Workplace Mastery', icon: Building2, desc: 'Leadership & Syncs' },
                { path: '/pro-lab', label: 'Professional Lab', icon: FlaskConical, desc: 'Workday & Incidents' },
                { path: '/communication', label: 'Communication Hub', icon: Layers, desc: 'Listen, Read & Write' },
                { path: '/community', label: 'Community Practice', icon: HeartHandshake, desc: 'Practice with People' },
                { path: '/roleplay', label: 'Roleplay Scenarios', icon: Users2, desc: 'Real Simulations' },
                { path: '/test', label: 'Tests & Assessments', icon: Award, desc: 'CEFR Assessment' },
              ].map((item) => {
                const Icon = item.icon;
                const active = isCurrent(item.path);
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => handleNav(item.path)}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                      active
                        ? 'bg-primary/10 border-primary shadow-xs'
                        : 'bg-card border-border hover:border-primary/40'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 shrink-0 mt-0.5">
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-text block truncate">{item.label}</span>
                      <span className="text-[10px] text-text-muted block truncate">{item.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Progress & History */}
          <div>
            <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2.5 px-1">
              Progress & History
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { path: '/history', label: 'Practice History', icon: History, desc: 'All Past Activity' },
                { path: '/mistakes', label: 'Common Mistakes', icon: AlertTriangle, desc: 'Target Weakness' },
                { path: '/progress', label: 'Skills & Analytics', icon: TrendingUp, desc: 'Mastery Trends' },
                { path: '/recordings', label: 'Voice Recordings', icon: FileAudio, desc: 'Speech Audio' },
              ].map((item) => {
                const Icon = item.icon;
                const active = isCurrent(item.path);
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => handleNav(item.path)}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                      active
                        ? 'bg-primary/10 border-primary shadow-xs'
                        : 'bg-card border-border hover:border-primary/40'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 shrink-0 mt-0.5">
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-text block truncate">{item.label}</span>
                      <span className="text-[10px] text-text-muted block truncate">{item.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Account & Admin */}
          <div>
            <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2.5 px-1">
              Account & Settings
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { path: '/profile', label: 'Profile', icon: User },
                { path: '/settings', label: 'Settings', icon: Settings },
                { path: '/admin', label: 'Admin CMS', icon: Shield },
              ].map((item) => {
                const Icon = item.icon;
                const active = isCurrent(item.path);
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => handleNav(item.path)}
                    className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                      active
                        ? 'bg-primary/10 border-primary shadow-xs'
                        : 'bg-card border-border hover:border-primary/40'
                    }`}
                  >
                    <Icon size={18} className={active ? 'text-primary' : 'text-text-muted'} />
                    <span className="text-xs font-bold text-text">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
