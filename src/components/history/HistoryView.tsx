import React from 'react';
import { PageHeader } from '../layout/PageHeader';
import { useUser } from '../../context/UserContext';
import { useNavigation } from '../../context/NavigationContext';
import { History, Clock, Mic, AlertTriangle, CheckCircle2, ChevronRight, Play } from 'lucide-react';

export const HistoryView: React.FC = () => {
  const { recordings } = useUser();
  const { navigate } = useNavigation();

  // Buckets for sessions
  const sections = [
    { title: 'Today', items: recordings.filter((r) => r.timestamp.includes('Today')) },
    { title: 'Yesterday', items: recordings.filter((r) => r.timestamp.includes('Yesterday')) },
    { title: 'This Week', items: recordings.filter((r) => r.timestamp.includes('days ago')) },
    { title: 'Older', items: recordings.filter((r) => r.timestamp.includes('week ago')) },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <PageHeader
        title="Speaking Session History"
        subtitle="Chronological record of every conversation, roleplay, and pronunciation session"
        badge="Session Timeline"
        showBack={true}
      />

      <div className="space-y-6">
        {sections.map((section) => {
          if (section.items.length === 0) return null;

          return (
            <div key={section.title} className="space-y-3">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider px-2">
                {section.title}
              </h3>

              <div className="space-y-2.5">
                {section.items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate('/recordings')}
                    className="p-4 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-xs transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Mic size={18} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-text truncate group-hover:text-primary transition-colors">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5">
                          <span className="font-semibold text-text">{item.scenarioName}</span>
                          <span>•</span>
                          <span>{item.timestamp}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                      <span className="text-xs font-semibold text-text-muted flex items-center gap-1">
                        <Clock size={12} />
                        {Math.floor(item.durationSeconds / 60)}m {item.durationSeconds % 60}s
                      </span>

                      {item.correctionsCount > 0 ? (
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                          <AlertTriangle size={12} />
                          {item.correctionsCount} tips
                        </span>
                      ) : (
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          Smooth turn
                        </span>
                      )}

                      <button
                        type="button"
                        className="p-1.5 rounded-xl bg-surface border border-border text-primary group-hover:bg-primary group-hover:text-white transition-colors"
                        title="Replay Audio"
                      >
                        <Play size={13} fill="currentColor" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
