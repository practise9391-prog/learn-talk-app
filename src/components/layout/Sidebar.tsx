import React from 'react';
import {
  Home,
  BookOpen,
  MessageSquare,
  Users2,
  Award,
  Zap,
  BookmarkCheck,
  AlertTriangle,
  History,
  TrendingUp,
  FileAudio,
  Settings,
  Sparkles,
  Compass,
  Layers,
  Mic,
  Shield,
  User,
  HeartHandshake,
  Briefcase,
  Building2,
  FlaskConical
} from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';

export const Sidebar: React.FC = () => {
  const { currentRoute, navigate } = useNavigation();

  const mainItems = [
    { id: '/home', label: 'Home', icon: Home },
    { id: '/learn', label: 'Learn Curriculum', icon: BookOpen },
    { id: '/career', label: 'Career English', icon: Briefcase },
    { id: '/workplace', label: 'Workplace & Leadership', icon: Building2 },
    { id: '/pro-lab', label: 'Professional Lab', icon: FlaskConical },
    { id: '/communication', label: 'Communication Hub', icon: Layers },
    { id: '/talk', label: 'Talk & Jarvis', icon: MessageSquare },
    { id: '/practice', label: 'Practice Arena', icon: Zap },
    { id: '/community', label: 'Community Practice', icon: HeartHandshake },
    { id: '/roleplay', label: 'Roleplay Scenarios', icon: Users2 },
    { id: '/test', label: 'Tests & Levels', icon: Award },
  ];

  const knowledgeItems = [
    { id: '/grammar', label: 'Grammar Modules', icon: BookmarkCheck },
    { id: '/vocabulary', label: 'Vocabulary Bank', icon: Sparkles },
    { id: '/idioms', label: 'Idioms & Metaphors', icon: Compass },
    { id: '/phrasal-verbs', label: 'Phrasal Verbs', icon: Layers },
    { id: '/talk/pronunciation-studio', label: 'Pronunciation Studio', icon: Mic },
    { id: '/talk/spontaneous', label: 'Spontaneous Challenge', icon: Zap },
  ];

  const progressItems = [
    { id: '/history', label: 'Practice History', icon: History },
    { id: '/mistakes', label: 'Common Mistakes', icon: AlertTriangle },
    { id: '/progress', label: 'Skills & Analytics', icon: TrendingUp },
    { id: '/recordings', label: 'Voice Recordings', icon: FileAudio },
    { id: '/talk/saved-phrases', label: 'Saved Phrases', icon: BookmarkCheck },
  ];

  const accountItems = [
    { id: '/profile', label: 'Learner Profile', icon: User },
    { id: '/settings', label: 'Settings', icon: Settings },
    { id: '/admin', label: 'Admin CMS', icon: Shield },
  ];

  const isCurrentActive = (path: string) => {
    if (path === '/home') return currentRoute.path === '/home' || currentRoute.path === '/';
    return currentRoute.path === path || currentRoute.path.startsWith(`${path}/`);
  };

  const renderNavGroup = (title: string, items: Array<{ id: string; label: string; icon: any }>) => (
    <div className="mb-5">
      <div className="px-3 mb-1.5 text-[11px] font-bold text-text-muted uppercase tracking-wider">
        {title}
      </div>
      <div className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isCurrentActive(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left
                ${
                  active
                    ? 'bg-primary text-primary-foreground shadow-xs shadow-primary/20 font-bold'
                    : 'text-text-muted hover:text-text hover:bg-card'
                }
              `}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={16} className={active ? 'text-white' : 'shrink-0'} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside
      aria-label="Desktop primary navigation"
      className="hidden lg:flex flex-col w-64 h-[calc(100vh-4rem)] sticky top-16 bg-surface/50 border-r border-border shrink-0 overflow-y-auto px-4 py-5 select-none transition-colors"
    >
      {/* 1. Main Navigation */}
      {renderNavGroup('Main', mainItems)}

      {/* 2. Knowledge Bank */}
      {renderNavGroup('Knowledge Bank', knowledgeItems)}

      {/* 3. Progress & Insights */}
      {renderNavGroup('Progress & Insights', progressItems)}

      {/* 4. Account & Tools */}
      {renderNavGroup('Account & System', accountItems)}

      {/* Pedagogical Mission Footer */}
      <div className="mt-auto pt-3 border-t border-border/60">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-transparent border border-primary/20 text-xs">
          <div className="flex items-center gap-2 mb-1 text-primary font-bold">
            <HeartHandshake size={14} />
            <span>Spoken Fluency First</span>
          </div>
          <p className="text-[11px] text-text-muted leading-relaxed">
            Every grammar rule and vocabulary word connects forward to voice practice.
          </p>
        </div>
      </div>
    </aside>
  );
};
