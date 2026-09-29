import React from 'react';
import { Bot, Clock, Shuffle, Zap, Languages, HelpCircle } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';

export const QuickPracticeGrid: React.FC = () => {
  const { navigate } = useNavigation();

  const options = [
    {
      id: '/talk/jarvis',
      title: 'Talk to Jarvis',
      description: 'Open conversation with your friendly AI partner. Free-flow speaking.',
      icon: Bot,
      color: 'bg-primary/10 text-primary border-primary/20',
      action: () => navigate('/talk/jarvis'),
    },
    {
      id: '/talk/practice',
      title: '24×7 Practice',
      description: 'Timed speaking sessions (5, 10, 15, 30 min) to build rhythm.',
      icon: Clock,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      action: () => navigate('/talk/practice'),
    },
    {
      id: '/talk/speed',
      title: 'Speed & Clarity',
      description: 'Master slow, normal, and challenge speaking paces.',
      icon: Zap,
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      action: () => navigate('/talk/speed'),
    },
    {
      id: '/talk/translate',
      title: 'Native → Natural English',
      description: 'Translate Indian languages directly into polite, natural spoken English.',
      icon: Languages,
      color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
      action: () => navigate('/talk/translate'),
    },
  ];

  return (
    <div className="rounded-3xl bg-card border border-border p-6 sm:p-7 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-text tracking-tight">
            Quick Practice Modes
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Choose how you want to exercise your English voice right now
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {options.map((opt) => {
          const Icon = opt.icon;
          return (
            <div
              key={opt.title}
              onClick={opt.action}
              className="p-4 rounded-2xl bg-surface border border-border hover:border-primary/50 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 border ${opt.color} group-hover:scale-110 transition-transform`}
                >
                  <Icon size={20} />
                </div>
                <h3 className="text-sm font-bold text-text group-hover:text-primary transition-colors">
                  {opt.title}
                </h3>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  {opt.description}
                </p>
              </div>

              <div className="mt-3 pt-2 text-xs font-bold text-primary flex items-center gap-1">
                <span>Start</span>
                <span>→</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
