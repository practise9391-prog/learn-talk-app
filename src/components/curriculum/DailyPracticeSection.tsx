import React, { useState } from 'react';
import { useCurriculumModule } from '../../context/CurriculumModuleContext';
import { useNavigation } from '../../context/NavigationContext';
import {
  Calendar,
  BookOpen,
  Sparkles,
  Layers,
  Compass,
  Mic,
  MessageSquare,
  CheckCircle2,
  Play,
  ArrowRight,
  Flame
} from 'lucide-react';

export const DailyPracticeSection: React.FC = () => {
  const { grammarTopics, vocabularyWords, idioms, phrasalVerbs } = useCurriculumModule();
  const { navigate } = useNavigation();

  // Completed daily check items
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({
    grammar: false,
    vocab: false,
    phrasal: false,
    idiom: false,
    speaking: false,
    conversation: false
  });

  const toggleItem = (key: string) => {
    setCompletedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const completedCount = Object.values(completedItems).filter(Boolean).length;

  const dailyModules = [
    {
      id: 'grammar',
      title: 'Target Grammar Drill',
      subtitle: '5 targeted questions on Simple Present vs Present Continuous',
      icon: BookOpen,
      color: 'text-indigo-500 bg-indigo-500/10',
      action: () => navigate('/grammar')
    },
    {
      id: 'vocab',
      title: 'Daily Vocabulary Retention',
      subtitle: 'Review 10 difficult & high-frequency workplace words',
      icon: Sparkles,
      color: 'text-sky-500 bg-sky-500/10',
      action: () => navigate('/vocabulary')
    },
    {
      id: 'phrasal',
      title: '3 Review Phrasal Verbs',
      subtitle: 'Master: "find out", "look into", and "call off"',
      icon: Layers,
      color: 'text-emerald-500 bg-emerald-500/10',
      action: () => navigate('/phrasal-verbs')
    },
    {
      id: 'idiom',
      title: '2 Conversational Idioms',
      subtitle: '"Break the ice" & "Hit the nail on the head"',
      icon: Compass,
      color: 'text-amber-500 bg-amber-500/10',
      action: () => navigate('/idioms')
    },
    {
      id: 'speaking',
      title: 'Impromptu Speaking Challenge',
      subtitle: '60-second response using today’s vocabulary',
      icon: Mic,
      color: 'text-rose-500 bg-rose-500/10',
      action: () => navigate('/test')
    },
    {
      id: 'conversation',
      title: 'Quick Spoken Dialogue with Jarvis',
      subtitle: '4-turn conversation applying today’s grammar',
      icon: MessageSquare,
      color: 'text-primary bg-primary/10',
      action: () => navigate('/talk/call', { initialMode: 'voice', topicId: 'daily-1' })
    }
  ];

  return (
    <div className="rounded-3xl bg-card border border-border p-6 sm:p-7 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black shadow-xs">
            <Flame size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                Section 41 • Today's English
              </span>
              <span className="text-xs text-text-muted font-bold">
                {completedCount} of 6 Completed
              </span>
            </div>
            <h3 className="text-lg font-black text-text mt-0.5">
              Personalized Daily English Workout
            </h3>
          </div>
        </div>

        <div className="w-full sm:w-48 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden self-center sm:self-auto">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* Grid of 6 daily workout items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {dailyModules.map((mod) => {
          const Icon = mod.icon;
          const isDone = completedItems[mod.id];

          return (
            <div
              key={mod.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                isDone
                  ? 'bg-emerald-500/5 border-emerald-500/30'
                  : 'bg-surface border-border hover:border-primary/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${mod.color}`}>
                    <Icon size={16} />
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleItem(mod.id)}
                    className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs transition-colors ${
                      isDone
                        ? 'bg-emerald-500 border-emerald-500 text-white font-bold'
                        : 'border-border text-transparent hover:border-text-muted'
                    }`}
                    title={isDone ? 'Mark as incomplete' : 'Mark as completed'}
                  >
                    ✓
                  </button>
                </div>

                <h4 className="text-xs font-black text-text mb-1">{mod.title}</h4>
                <p className="text-[11px] text-text-muted leading-relaxed mb-3">
                  {mod.subtitle}
                </p>
              </div>

              <button
                type="button"
                onClick={mod.action}
                className="w-full py-2 px-3 rounded-xl bg-card hover:bg-primary hover:text-white text-text font-bold text-xs border border-border transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>Practice Now</span>
                <ArrowRight size={12} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
