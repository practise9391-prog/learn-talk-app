import React, { useState } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { useHistory } from '../../context/HistoryContext';
import { useNavigation } from '../../context/NavigationContext';
import { UnifiedMistake, MistakeSeverity, MistakeStatus } from '../../types/history';
import { MistakePracticeModal } from './MistakePracticeModal';
import {
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Sparkles,
  RotateCcw,
  Volume2,
  Check,
  HelpCircle,
  Play,
  ArrowRight,
  TrendingUp,
  Clock,
  Layers,
} from 'lucide-react';

export const MistakesView: React.FC = () => {
  const { mistakes } = useHistory();
  const { navigate } = useNavigation();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedPracticeMistake, setSelectedPracticeMistake] = useState<UnifiedMistake | null>(null);

  const tabs = [
    { id: 'all', label: 'All Mistakes', count: mistakes.length },
    {
      id: 'frequent',
      label: 'Most Frequent',
      count: mistakes.filter((m) => m.occurrenceCount >= 3).length,
    },
    {
      id: 'grammar',
      label: 'Grammar',
      count: mistakes.filter((m) => m.skill === 'grammar').length,
    },
    {
      id: 'vocabulary',
      label: 'Vocabulary',
      count: mistakes.filter((m) => m.skill === 'vocabulary').length,
    },
    {
      id: 'fluency',
      label: 'Fluency & Fillers',
      count: mistakes.filter((m) => m.skill === 'fluency').length,
    },
    {
      id: 'naturalness',
      label: 'Naturalness',
      count: mistakes.filter((m) => m.skill === 'naturalness').length,
    },
    {
      id: 'needs_review',
      label: 'Needs Review',
      count: mistakes.filter((m) => m.status !== 'resolved' && m.status !== 'mastered').length,
    },
    {
      id: 'resolved',
      label: 'Resolved & Strong',
      count: mistakes.filter((m) => m.status === 'resolved' || m.status === 'mastered' || m.status === 'strong').length,
    },
  ];

  const filteredMistakes = mistakes.filter((m) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'frequent') return m.occurrenceCount >= 3;
    if (activeTab === 'grammar') return m.skill === 'grammar';
    if (activeTab === 'vocabulary') return m.skill === 'vocabulary';
    if (activeTab === 'fluency') return m.skill === 'fluency';
    if (activeTab === 'naturalness') return m.skill === 'naturalness';
    if (activeTab === 'needs_review') return m.status !== 'resolved' && m.status !== 'mastered';
    if (activeTab === 'resolved') return m.status === 'resolved' || m.status === 'mastered' || m.status === 'strong';
    return true;
  });

  const getSeverityBadge = (sev: MistakeSeverity) => {
    switch (sev) {
      case 'critical':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      case 'important':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'moderate':
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
      case 'minor':
      default:
        return 'bg-surface text-text-muted border-border';
    }
  };

  const getStatusBadge = (status: MistakeStatus) => {
    switch (status) {
      case 'mastered':
      case 'resolved':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'strong':
      case 'improving':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'repeated':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      case 'learning':
      case 'new':
      default:
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'en-US';
      utter.rate = 0.95;
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-12">
      <PageHeader
        title="My Common Mistakes & Why They Matter"
        subtitle="LearnTalk treats mistakes as learning milestones. Understand the root cause, observe evolution, and practice saying it right."
        badge="Zero Shame"
      />

      {/* Philosophy Callout Banner */}
      <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="text-xs">
          <h4 className="font-bold text-text">Never just say "Wrong"</h4>
          <p className="text-text-muted mt-0.5 leading-relaxed">
            Every mistake below breaks down what you said, why the natural phrasing works better in English context, and gives you one-click voice drills to lock in conversational habit.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 border ${
                isActive
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-card text-text-muted hover:text-text border-border hover:bg-surface'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-surface text-text-muted'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mistake Cards */}
      <div className="space-y-4">
        {filteredMistakes.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-card border border-border space-y-2">
            <CheckCircle2 size={36} className="mx-auto text-emerald-500 opacity-80" />
            <h4 className="text-base font-bold text-text">No mistakes in this filter</h4>
            <p className="text-xs text-text-muted max-w-sm mx-auto">
              Great job! Your spoken English in this category is looking strong.
            </p>
          </div>
        ) : (
          filteredMistakes.map((m) => {
            return (
              <div
                key={m.id}
                className="p-5 sm:p-6 rounded-3xl bg-card border border-border shadow-xs hover:border-primary/30 transition-all space-y-4"
              >
                {/* Card Top Meta */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-surface border border-border text-text">
                      {m.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getSeverityBadge(m.severity)}`}>
                      {m.severity} severity
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize border ${getStatusBadge(m.status)}`}>
                      {m.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-text-muted">
                    <span>
                      Seen <strong>{m.occurrenceCount}</strong> times • Corrected <strong>{m.correctedCount}</strong> times
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-text">{m.lastSeen}</span>
                  </div>
                </div>

                {/* Before vs After comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50">
                    <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block mb-1">
                      What You Said:
                    </span>
                    <p className="text-sm font-semibold text-text line-through decoration-rose-400">
                      "{m.originalInput}"
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1">
                      Natural / Polished Phrasing:
                    </span>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-text">
                        "{m.correctedInput}"
                      </p>
                      <button
                        type="button"
                        onClick={() => speakText(m.correctedInput)}
                        className="p-1 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                        title="Listen to native pronunciation"
                      >
                        <Volume2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* "Why?" Deep Explanation */}
                <div className="p-4 rounded-2xl bg-surface border border-border text-xs space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-text">
                    <Sparkles size={14} className="text-amber-500" />
                    <span>Why does this correction matter?</span>
                  </div>
                  <p className="text-text-muted leading-relaxed">
                    {m.explanation}
                  </p>
                </div>

                {/* Mistake Evolution Journey (Requirement 14) */}
                {m.evolutionHistory && m.evolutionHistory.length > 1 && (
                  <div className="p-3.5 rounded-2xl bg-surface/50 border border-border/80 space-y-2">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
                      <TrendingUp size={11} className="text-primary" />
                      <span>Your Improvement Journey on this Rule:</span>
                    </span>
                    <div className="space-y-1.5 pl-2 border-l-2 border-primary/30">
                      {m.evolutionHistory.map((step, idx) => (
                        <div key={idx} className="text-xs flex items-center justify-between gap-2">
                          <span className="font-mono text-[11px] text-text-muted">{step.date}:</span>
                          <span className="font-semibold text-text truncate max-w-xs">"{step.input}"</span>
                          <span className="text-[10px] text-primary italic font-medium">{step.note}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions: One-Click Practice & Related Lessons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedPracticeMistake(m)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary-hover shadow-xs transition-all"
                  >
                    <RotateCcw size={14} />
                    <span>Practice This Now (One-Click)</span>
                  </button>

                  {m.relatedGrammarId && (
                    <button
                      type="button"
                      onClick={() => navigate('/grammar')}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1 self-center"
                    >
                      <Layers size={13} />
                      <span>Study Full Grammar Topic</span>
                      <ArrowRight size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* One-Click Practice Modal */}
      {selectedPracticeMistake && (
        <MistakePracticeModal
          mistake={selectedPracticeMistake}
          onClose={() => setSelectedPracticeMistake(null)}
        />
      )}
    </div>
  );
};
