import React, { useState } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { useCurriculumModule } from '../../context/CurriculumModuleContext';
import { useNavigation } from '../../context/NavigationContext';
import { GrammarTopic } from '../../types/curriculumModules';
import { GrammarLessonModal } from './GrammarLessonModal';
import { WhyIsThisWrongModal } from './WhyIsThisWrongModal';
import {
  BookOpen,
  Sparkles,
  HelpCircle,
  Play,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ArrowRight,
  Layers,
  Award,
  Zap
} from 'lucide-react';

export const GrammarHubView: React.FC = () => {
  const { grammarTopics } = useCurriculumModule();
  const { navigate } = useNavigation();

  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<GrammarTopic | null>(null);
  const [isWhyWrongModalOpen, setIsWhyWrongModalOpen] = useState<boolean>(false);

  const categoryTabs = [
    { id: 'all', label: 'Complete Roadmap' },
    { id: 'beginner', label: 'Level 1: Absolute Beginner' },
    { id: 'tenses', label: '12 Tenses System' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced & Professional' }
  ];

  const filteredTopics = grammarTopics.filter((t) => {
    const matchesCategory =
      activeCategoryTab === 'all' || t.levelCategory === activeCategoryTab;
    const matchesSearch =
      !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.simpleExplanation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const masteredCount = grammarTopics.filter((t) => t.status === 'mastered').length;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-12">
      {/* Page Header */}
      <PageHeader
        title="Complete English Grammar System"
        subtitle="Learn → Understand → See → Hear → Practice → Speak → Apply → Review"
        badge="Zero Textbook"
      />

      {/* Top Value Banner & Why Is This Wrong Quick Launcher */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-primary/10 via-secondary/10 to-card border border-border flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xs">
        <div>
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
            Living Communication Engine
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-text mt-0.5">
            Grammar in Spoken Action
          </h3>
          <p className="text-xs text-text-muted mt-1 max-w-xl leading-relaxed">
            Every grammar rule connects directly to real workplace scenarios, phone conversations with Jarvis, and natural everyday speaking patterns.
          </p>

          <div className="flex items-center gap-3 mt-3">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 size={14} />
              {masteredCount} of {grammarTopics.length} Topics Mastered
            </span>
            <span className="text-text-muted">•</span>
            <span className="text-xs font-semibold text-text-muted">100% Speaking Integrated</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsWhyWrongModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-card hover:bg-surface border border-border text-text font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
          >
            <HelpCircle size={15} className="text-amber-500" />
            <span>"Why is this wrong?" Tester</span>
          </button>
        </div>
      </div>

      {/* Search and Category Filter Ribbon */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategoryTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  activeCategoryTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-card hover:bg-surface text-text-muted border border-border/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search grammar topics..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-card border border-border text-xs text-text focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {filteredTopics.map((topic) => (
            <div
              key={topic.id}
              className="p-5 rounded-3xl bg-card border border-border hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase">
                      Level {topic.level}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface border border-border text-text-muted capitalize">
                      {topic.category.replace('_', ' ')}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                      topic.status === 'mastered'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : topic.status === 'learning'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'bg-surface text-text-muted'
                    }`}
                  >
                    {topic.status}
                  </span>
                </div>

                <h4 className="text-base font-black text-text mb-1 group-hover:text-primary transition-colors">
                  {topic.title}
                </h4>
                <p className="text-xs text-text-muted leading-relaxed mb-3">
                  {topic.simpleExplanation}
                </p>

                <div className="p-2.5 rounded-xl bg-surface border border-border/80 text-[11px] mb-4">
                  <strong className="text-primary font-mono block mb-0.5">Structure:</strong>
                  <code className="text-text font-mono font-bold block truncate">
                    {topic.structure}
                  </code>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setSelectedTopic(topic)}
                  className="flex-1 py-2 px-3 rounded-xl bg-surface group-hover:bg-primary group-hover:text-white text-text font-bold text-xs border border-border transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Play size={12} fill="currentColor" />
                  <span>Start 8-Step Lesson</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {selectedTopic && (
        <GrammarLessonModal
          topic={selectedTopic}
          onClose={() => setSelectedTopic(null)}
          onOpenConversationWithJarvis={(prompt) => {
            setSelectedTopic(null);
            navigate('/talk/call', {
              initialMode: 'voice',
              topicId: 'daily-1'
            });
          }}
        />
      )}

      <WhyIsThisWrongModal
        isOpen={isWhyWrongModalOpen}
        onClose={() => setIsWhyWrongModalOpen(false)}
        onOpenGrammarTopic={(slug) => {
          const matched = grammarTopics.find((t) => t.slug === slug);
          if (matched) setSelectedTopic(matched);
        }}
      />
    </div>
  );
};
