import React from 'react';
import {
  Home,
  BookOpen,
  MessageSquare,
  Users2,
  Award,
  Globe2,
  Mic,
  Zap,
  Languages,
  HelpCircle,
  History,
  FileAudio,
  AlertTriangle,
  TrendingUp,
  Settings,
  Sparkles,
  BookmarkCheck,
  Compass,
  FileText
} from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';

export const Sidebar: React.FC = () => {
  const { currentRoute, navigate } = useNavigation();

  const primaryItems = [
    { id: '/home', label: 'Home', icon: Home },
    { id: '/learn', label: 'Learn Curriculum', icon: BookOpen },
    { id: '/talk', label: 'Talk & Jarvis', icon: MessageSquare },
    { id: '/roleplay', label: 'Roleplay Scenarios', icon: Users2 },
    { id: '/test', label: 'Tests & Levels', icon: Award },
  ];

  const toolsItems = [
    { id: '/talk/saved-phrases', label: 'My Saved Phrases', icon: BookmarkCheck },
    { id: '/talk/translate', label: 'Translate', icon: Languages },
    { id: '/talk/speaking-help', label: 'Speaking Help (Hints)', icon: HelpCircle },
    { id: '/talk/speed', label: 'Speed Practice', icon: Zap },
    { id: '/recordings', label: 'Voice Recordings', icon: FileAudio },
    { id: '/mistakes', label: 'My Common Mistakes', icon: AlertTriangle },
    { id: '/history', label: 'Practice History', icon: History },
    { id: '/progress', label: 'Skills & Analytics', icon: TrendingUp },
    { id: '/settings', label: 'Settings', icon: Settings },
  ];

  const skillCurriculumItems = [
    { id: '/grammar', label: 'Grammar Modules', icon: BookmarkCheck },
    { id: '/vocabulary', label: 'Vocabulary Bank', icon: Sparkles },
    { id: '/pronunciation', label: 'Pronunciation Lab', icon: Mic },
    { id: '/idioms', label: 'Idioms & Phrasal Verbs', icon: Compass },
  ];

  const isCurrentActive = (path: string) => {
    if (path === '/home') return currentRoute.path === '/home';
    return currentRoute.path === path || currentRoute.path.startsWith(`${path}/`);
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 h-[calc(100vh-4rem)] sticky top-16 bg-surface/50 border-r border-border shrink-0 overflow-y-auto px-4 py-5 select-none transition-colors">
      {/* Primary Section */}
      <div className="mb-6">
        <div className="px-3 mb-2 text-[11px] font-bold text-text-muted uppercase tracking-wider">
          Primary
        </div>
        <div className="space-y-1">
          {primaryItems.map((item) => {
            const Icon = item.icon;
            const active = isCurrentActive(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all
                  ${
                    active
                      ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                      : 'text-text-muted hover:text-text hover:bg-card'
                  }
                `}
              >
                <Icon size={18} className={active ? 'text-white' : ''} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Speaking Tools */}
      <div className="mb-6">
        <div className="px-3 mb-2 text-[11px] font-bold text-text-muted uppercase tracking-wider">
          Speaking Tools
        </div>
        <div className="space-y-1">
          {toolsItems.map((item) => {
            const Icon = item.icon;
            const active = isCurrentActive(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all
                  ${
                    active
                      ? 'bg-primary/10 text-primary font-bold'
                      : 'text-text-muted hover:text-text hover:bg-card'
                  }
                `}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Curriculum Shortcuts */}
      <div className="mb-4">
        <div className="px-3 mb-2 text-[11px] font-bold text-text-muted uppercase tracking-wider">
          Curriculum Focus
        </div>
        <div className="space-y-1">
          {skillCurriculumItems.map((item) => {
            const Icon = item.icon;
            const active = isCurrentActive(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all
                  ${
                    active
                      ? 'bg-primary/10 text-primary font-bold'
                      : 'text-text-muted hover:text-text hover:bg-card'
                  }
                `}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pro Support Card */}
      <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-transparent border border-primary/20">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-lg">🎯</span>
          <span className="text-xs font-bold text-text">Speaking Goal</span>
        </div>
        <p className="text-[11px] text-text-muted mb-3 leading-snug">
          Speak 10 mins today to maintain your 5-day streak!
        </p>
        <button
          type="button"
          onClick={() => navigate('/talk/practice')}
          className="w-full py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-lg shadow-sm hover:bg-primary-hover transition-colors"
        >
          Quick Practice
        </button>
      </div>
    </aside>
  );
};
