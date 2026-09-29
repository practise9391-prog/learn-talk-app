import React from 'react';
import { Home, BookOpen, MessageSquare, Users2, Award } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';

export const BottomNavigation: React.FC = () => {
  const { currentRoute, navigate } = useNavigation();

  const navItems = [
    { id: '/home', label: 'Home', icon: Home },
    { id: '/learn', label: 'Learn', icon: BookOpen },
    { id: '/talk', label: 'Talk', icon: MessageSquare, highlight: true },
    { id: '/roleplay', label: 'Roleplay', icon: Users2 },
    { id: '/test', label: 'Test', icon: Award },
  ];

  const isCurrentActive = (path: string) => {
    if (path === '/home') return currentRoute.path === '/home';
    return currentRoute.path.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface/90 backdrop-blur-lg border-t border-border lg:hidden transition-colors safe-area-pb">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isCurrentActive(item.id);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.id)}
              className={`
                relative flex flex-col items-center justify-center flex-1 h-full py-1 transition-all select-none
                ${active ? 'text-primary' : 'text-text-muted hover:text-text'}
              `}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
            >
              <div
                className={`
                  relative flex items-center justify-center rounded-2xl transition-all duration-200
                  ${
                    item.highlight && active
                      ? 'w-11 h-8 bg-primary text-primary-foreground shadow-md shadow-primary/30'
                      : active
                      ? 'w-10 h-7 bg-primary/10'
                      : 'w-10 h-7'
                  }
                `}
              >
                <Icon size={19} className={item.highlight && active ? 'text-white' : ''} />
              </div>
              <span className={`text-[11px] font-bold tracking-tight mt-0.5 ${active ? 'text-primary font-extrabold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
