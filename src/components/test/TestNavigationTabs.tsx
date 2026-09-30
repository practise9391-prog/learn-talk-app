import React, { useState } from 'react';
import { useTest } from '../../context/TestContext';
import { TestDefinition, TestType } from '../../types/test';
import {
  Mic,
  Award,
  Zap,
  BookOpen,
  Sparkles,
  Headphones,
  Activity,
  MessageSquare,
  Flame,
  Clock,
  Play,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface TestNavigationTabsProps {
  onStartTest: (testId: string) => void;
}

export const TestNavigationTabs: React.FC<TestNavigationTabsProps> = ({ onStartTest }) => {
  const { allTests, attempts } = useTest();
  const [activeTab, setActiveTab] = useState<string>('quick');

  const tabs = [
    { id: 'quick', label: 'Quick Test', icon: Mic },
    { id: 'level', label: 'Level Test', icon: Award },
    { id: 'speaking', label: 'Speaking Test', icon: Mic },
    { id: 'grammar', label: 'Grammar Test', icon: BookOpen },
    { id: 'vocabulary', label: 'Vocabulary Test', icon: Sparkles },
    { id: 'pronunciation', label: 'Pronunciation Test', icon: Headphones },
    { id: 'listening', label: 'Listening Test', icon: Activity },
    { id: 'fluency', label: 'Fluency Test', icon: Zap },
    { id: 'conversation', label: 'Conversation Test', icon: MessageSquare },
    { id: 'challenges', label: 'Challenge Tests', icon: Flame }
  ];

  const getFilteredTests = (): TestDefinition[] => {
    switch (activeTab) {
      case 'quick':
        return allTests.filter((t) => t.type === 'quick_speaking');
      case 'level':
        return allTests.filter((t) => t.type === 'level_assessment' || t.type === 'placement');
      case 'speaking':
        return allTests.filter(
          (t) =>
            t.type === 'quick_speaking' ||
            t.type === 'picture_description' ||
            t.type === 'three_word_story' ||
            t.type === 'random_object_pitch'
        );
      case 'grammar':
        return allTests.filter((t) => t.type === 'grammar');
      case 'vocabulary':
        return allTests.filter((t) => t.type === 'vocabulary' || t.type === 'word_association');
      case 'pronunciation':
        return allTests.filter((t) => t.type === 'pronunciation' || t.type === 'shadowing');
      case 'listening':
        return allTests.filter((t) => t.type === 'listening');
      case 'fluency':
        return allTests.filter((t) => t.type === 'fluency' || t.type === 'jam' || t.type === 'no_fillers');
      case 'conversation':
        return allTests.filter((t) => t.type === 'conversation' || t.type === 'pros_cons_debate');
      case 'challenges':
        return allTests.filter(
          (t) =>
            t.type === 'random_object_pitch' ||
            t.type === 'no_fillers' ||
            t.type === 'pros_cons_debate' ||
            t.type === 'word_association' ||
            t.type === 'three_word_story' ||
            t.type === 'jam'
        );
      default:
        return allTests;
    }
  };

  const filteredTests = getFilteredTests();

  return (
    <div className="space-y-4">
      {/* Category Tabs Scrollable Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all shadow-xs ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm scale-102'
                  : 'bg-card hover:bg-surface border border-border text-text-muted hover:text-text'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTests.map((test) => {
          const recentAttempt = attempts.find((a) => a.testId === test.id);

          return (
            <div
              key={test.id}
              className="p-5 sm:p-6 rounded-3xl bg-card border border-border hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-wider">
                      {test.badge || test.primarySkill}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface border border-border text-text-muted">
                      {test.level}
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-text-muted flex items-center gap-1">
                    <Clock size={12} />
                    {test.durationMinutes} min
                  </span>
                </div>

                <h4 className="text-base font-black text-text mb-1 group-hover:text-primary transition-colors">
                  {test.title}
                </h4>
                <p className="text-xs font-medium text-text-muted mb-2">
                  {test.subtitle}
                </p>
                <p className="text-xs text-text-muted/80 leading-relaxed mb-4">
                  {test.description}
                </p>

                {recentAttempt && (
                  <div className="mb-4 p-2.5 rounded-xl bg-surface border border-border/70 flex items-center justify-between text-xs">
                    <span className="text-text-muted font-medium">Last Score:</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400">
                      {recentAttempt.scores.overallCommunication}% ({recentAttempt.timestamp})
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onStartTest(test.id)}
                  className="w-full py-2.5 px-4 rounded-xl bg-surface hover:bg-primary hover:text-white text-text font-bold text-xs border border-border transition-colors flex items-center justify-center gap-2 shadow-xs group-hover:bg-primary group-hover:text-white"
                >
                  <Play size={13} fill="currentColor" />
                  <span>{recentAttempt ? 'Retake Test' : 'Start Assessment'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
