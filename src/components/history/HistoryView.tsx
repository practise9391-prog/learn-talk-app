import React, { useState } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { useHistory } from '../../context/HistoryContext';
import { useNavigation } from '../../context/NavigationContext';
import { ActivityHistoryItem, ActivityType } from '../../types/history';
import { SessionDetailModal } from './SessionDetailModal';
import { EmptyState } from '../common/EmptyState';
import {
  History,
  Clock,
  Mic,
  AlertTriangle,
  CheckCircle2,
  Play,
  Download,
  Filter,
  Trash2,
  Search,
  MessageSquare,
  Briefcase,
  Award,
  BookOpen,
  Layers,
  Sparkles,
  ChevronRight,
  Shield,
} from 'lucide-react';

export const HistoryView: React.FC = () => {
  const { activities, exportUserData, clearAllHistory } = useHistory();
  const { navigate } = useNavigation();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'yesterday' | '7days' | '30days'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedActivity, setSelectedActivity] = useState<ActivityHistoryItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Activity', icon: History, count: activities.length },
    {
      id: 'speaking',
      label: 'Speaking & Talk',
      icon: Mic,
      count: activities.filter((a) => a.activityType === 'speaking' || a.activityType === 'talk').length,
    },
    {
      id: 'roleplay',
      label: 'Roleplay',
      icon: Briefcase,
      count: activities.filter((a) => a.activityType === 'roleplay').length,
    },
    {
      id: 'test',
      label: 'Tests & Quizzes',
      icon: Award,
      count: activities.filter((a) => a.activityType === 'test').length,
    },
    {
      id: 'lesson',
      label: 'Lessons',
      icon: BookOpen,
      count: activities.filter((a) => a.activityType === 'lesson').length,
    },
    {
      id: 'curriculum',
      label: 'Grammar & Vocab',
      icon: Layers,
      count: activities.filter((a) => a.activityType === 'grammar' || a.activityType === 'vocab').length,
    },
    {
      id: 'recordings',
      label: 'Recordings',
      icon: Play,
      count: activities.filter((a) => a.hasRecording).length,
    },
  ];

  // Filtering
  const filteredActivities = activities.filter((item) => {
    // Category match
    if (activeCategory === 'speaking' && item.activityType !== 'speaking' && item.activityType !== 'talk') return false;
    if (activeCategory === 'roleplay' && item.activityType !== 'roleplay') return false;
    if (activeCategory === 'test' && item.activityType !== 'test') return false;
    if (activeCategory === 'lesson' && item.activityType !== 'lesson') return false;
    if (activeCategory === 'curriculum' && item.activityType !== 'grammar' && item.activityType !== 'vocab') return false;
    if (activeCategory === 'recordings' && !item.hasRecording) return false;

    // Date filter
    if (dateFilter === 'today' && !item.timestamp.includes('Today')) return false;
    if (dateFilter === 'yesterday' && !item.timestamp.includes('Yesterday')) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        (item.topic && item.topic.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  // Group by relative time
  const sections = [
    { title: 'Today', items: filteredActivities.filter((a) => a.timestamp.includes('Today')) },
    { title: 'Yesterday', items: filteredActivities.filter((a) => a.timestamp.includes('Yesterday')) },
    { title: 'Earlier This Week', items: filteredActivities.filter((a) => a.timestamp.includes('days ago')) },
    { title: 'Older Sessions', items: filteredActivities.filter((a) => !a.timestamp.includes('Today') && !a.timestamp.includes('Yesterday') && !a.timestamp.includes('days ago')) },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Activity & Speaking History"
          subtitle="Unified chronological log of every conversation, lesson, test, and roleplay"
          badge="Activity Stream"
          showBack={true}
        />

        {/* Data Ownership & Privacy Controls (Requirement 41 & 42) */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={exportUserData}
            className="px-3.5 py-2 rounded-xl bg-surface border border-border hover:border-primary/40 text-xs font-bold text-text flex items-center gap-1.5 transition-all shadow-2xs hover:text-primary"
            title="Download My Data (JSON)"
          >
            <Download size={14} />
            <span>Export Data</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm('Clear your entire local activity history? This cannot be undone.')) {
                clearAllHistory();
              }
            }}
            className="p-2 rounded-xl bg-surface border border-border hover:border-rose-500/40 text-xs text-text-muted hover:text-rose-500 transition-all shadow-2xs"
            title="Clear History"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Privacy Notice Banner */}
      <div className="p-3.5 rounded-2xl bg-surface border border-border flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-text-muted">
          <Shield size={16} className="text-emerald-500 shrink-0" />
          <span>Private by default. Audio recordings are stored locally with explicit consent and can be deleted anytime.</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 border ${
                isActive
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-card text-text-muted hover:text-text border-border hover:bg-surface'
              }`}
            >
              <Icon size={14} />
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-surface text-text-muted'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Date Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by topic, partner, or lesson title..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-card border border-border text-xs text-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto overflow-x-auto w-full sm:w-auto">
          {(['all', 'today', 'yesterday'] as const).map((df) => (
            <button
              key={df}
              type="button"
              onClick={() => setDateFilter(df)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                dateFilter === df
                  ? 'bg-primary/10 text-primary font-bold border border-primary/20'
                  : 'text-text-muted hover:text-text bg-surface'
              }`}
            >
              {df}
            </button>
          ))}
        </div>
      </div>

      {activities.length === 0 ? (
        <EmptyState
          icon={History}
          title="No Learning History Yet"
          description="Every time you speak with Jarvis, complete a curriculum lesson, practice roleplays, or test your skills, your progress and detailed analytics are recorded here."
          actionLabel="Start First Practice Session"
          onAction={() => navigate('/talk')}
          className="my-6"
        />
      ) : (
        /* Activity Timeline List */
        <div className="space-y-6">
          {filteredActivities.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-card border border-border space-y-3">
              <History size={36} className="mx-auto text-text-muted opacity-50" />
              <h4 className="text-base font-bold text-text">No activity matching filter</h4>
              <p className="text-xs text-text-muted max-w-sm mx-auto">
                Try adjusting your date filters or category selection, or complete a quick speaking drill.
              </p>
            </div>
          ) : (
          sections.map((section) => {
            if (section.items.length === 0) return null;

            return (
              <div key={section.title} className="space-y-3">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider px-2">
                  {section.title} ({section.items.length})
                </h3>

                <div className="space-y-2.5">
                  {section.items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedActivity(item)}
                      className="p-4 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-xs transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            item.activityType === 'speaking' || item.activityType === 'talk'
                              ? 'bg-primary/10 text-primary'
                              : item.activityType === 'roleplay'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              : item.activityType === 'grammar'
                              ? 'bg-indigo-500/10 text-indigo-500'
                              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {item.activityType === 'speaking' || item.activityType === 'talk' ? (
                            <Mic size={18} />
                          ) : item.activityType === 'roleplay' ? (
                            <Briefcase size={18} />
                          ) : item.activityType === 'grammar' ? (
                            <Layers size={18} />
                          ) : (
                            <Award size={18} />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-text truncate group-hover:text-primary transition-colors">
                              {item.title}
                            </h4>
                            {item.difficulty && (
                              <span className="text-[10px] font-black px-1.5 py-0.2 rounded-md bg-surface text-text-muted border border-border">
                                {item.difficulty}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5">
                            {item.personaName && (
                              <>
                                <span className="font-semibold text-text">{item.personaName}</span>
                                <span>•</span>
                              </>
                            )}
                            <span>{item.timestamp}</span>
                            {item.durationSeconds > 0 && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Clock size={11} />
                                  {Math.floor(item.durationSeconds / 60)}m {item.durationSeconds % 60}s
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
                        {item.score > 0 && (
                          <span
                            className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                              item.score >= 80
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                : item.score >= 70
                                ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                            }`}
                          >
                            {item.score}%
                          </span>
                        )}

                        {item.correctionsCount > 0 ? (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                            <AlertTriangle size={11} />
                            {item.correctionsCount} tips
                          </span>
                        ) : (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                            <CheckCircle2 size={11} />
                            Smooth
                          </span>
                        )}

                        {item.hasRecording && (
                          <button
                            type="button"
                            className="p-1.5 rounded-xl bg-surface border border-border text-primary group-hover:bg-primary group-hover:text-white transition-colors"
                            title="Play Recording"
                          >
                            <Play size={12} fill="currentColor" />
                          </button>
                        )}

                        <ChevronRight size={16} className="text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
      )}

      {/* Session Detail Modal */}
      {selectedActivity && (
        <SessionDetailModal
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
        />
      )}
    </div>
  );
};
