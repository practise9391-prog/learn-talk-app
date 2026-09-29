import React, { useState } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { useUser } from '../../context/UserContext';
import { FilterBar } from '../common/FilterBar';
import { VoiceButton, VoiceButtonState } from '../common/VoiceButton';
import { ErrorCategory, Mistake } from '../../types';
import {
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Sparkles,
  RotateCcw,
  Volume2,
  Check,
  HelpCircle
} from 'lucide-react';

export const MistakesView: React.FC = () => {
  const { mistakes, resolveMistake } = useUser();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePracticeMistake, setActivePracticeMistake] = useState<Mistake | null>(null);
  const [practiceVoiceState, setPracticeVoiceState] = useState<VoiceButtonState>('idle');
  const [hasPracticed, setHasPracticed] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'All Mistakes', count: mistakes.length },
    { id: 'Article usage', label: 'Article Usage', count: mistakes.filter((m) => m.category === 'Article usage').length },
    { id: 'Naturalness', label: 'Naturalness', count: mistakes.filter((m) => m.category === 'Naturalness').length },
    { id: 'Preposition', label: 'Prepositions', count: mistakes.filter((m) => m.category === 'Preposition').length },
    { id: 'Tense', label: 'Tenses', count: mistakes.filter((m) => m.category === 'Tense').length },
    { id: 'Subject-verb agreement', label: 'Subject-Verb', count: mistakes.filter((m) => m.category === 'Subject-verb agreement').length },
  ];

  const filteredMistakes = mistakes.filter(
    (m) => selectedCategory === 'all' || m.category === selectedCategory
  );

  const handlePracticeVoiceToggle = (mistake: Mistake) => {
    if (practiceVoiceState === 'idle') {
      setPracticeVoiceState('listening');
      setTimeout(() => setPracticeVoiceState('recording'), 400);
    } else if (practiceVoiceState === 'recording') {
      setPracticeVoiceState('processing');
      setTimeout(() => {
        setPracticeVoiceState('idle');
        setHasPracticed(true);
        resolveMistake(mistake.id);
      }, 1200);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <PageHeader
        title="My Common Mistakes & Why They Matter"
        subtitle="LearnTalk treats mistakes as learning opportunities. Understand the reason and practice saying it right."
        badge="Zero Shame"
      />

      {/* Philosophy Callout Banner (Requirement 2 & 18) */}
      <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="text-xs">
          <h4 className="font-bold text-text">Never just say "Wrong"</h4>
          <p className="text-text-muted mt-0.5 leading-relaxed">
            Every mistake listed below breaks down what you said, why the natural phrasing works better in context, and provides an example to repeat out loud.
          </p>
        </div>
      </div>

      <FilterBar
        options={categories}
        selectedId={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* List of Mistake Cards */}
      <div className="space-y-4">
        {filteredMistakes.map((m) => {
          const isPracticingThis = activePracticeMistake?.id === m.id;

          return (
            <div
              key={m.id}
              className={`
                p-6 rounded-3xl bg-card border transition-all shadow-xs
                ${m.resolved ? 'border-border opacity-75' : 'border-amber-300 dark:border-amber-900/40'}
              `}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                    {m.category}
                  </span>
                  {m.repeatedCount > 1 && (
                    <span className="text-[11px] font-semibold text-text-muted">
                      Repeated {m.repeatedCount} times
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-muted">{m.timestamp}</span>
                  {m.resolved && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 size={13} /> Resolved
                    </span>
                  )}
                </div>
              </div>

              {/* Before vs After comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
                <div className="p-3.5 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50">
                  <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider block mb-1">
                    What You Said:
                  </span>
                  <p className="text-sm font-semibold text-text line-through decoration-red-400">
                    "{m.originalText}"
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1">
                    Natural / Polished Phrasing:
                  </span>
                  <p className="text-sm font-bold text-text">
                    "{m.correctedText}"
                  </p>
                </div>
              </div>

              {/* "Why?" Deep Explanation (Requirement 18) */}
              <div className="p-4 rounded-2xl bg-surface border border-border text-xs space-y-2 mb-4">
                <div className="flex items-center gap-1.5 font-bold text-text">
                  <Sparkles size={14} className="text-amber-500" />
                  <span>Why does this correction matter?</span>
                </div>
                <p className="text-text-muted leading-relaxed">
                  {m.whyExplanation}
                </p>

                <div className="pt-2 border-t border-border flex items-center justify-between text-text">
                  <span>
                    <span className="font-semibold text-text-muted">Real Example: </span>
                    <span className="italic font-medium">"{m.exampleSentence}"</span>
                  </span>
                  <Volume2 size={14} className="text-primary shrink-0 cursor-pointer" />
                </div>
              </div>

              {/* Practice Speaking Again Action */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setActivePracticeMistake(isPracticingThis ? null : m);
                    setHasPracticed(false);
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw size={13} />
                  <span>{isPracticingThis ? 'Close Practice' : 'Practice Saying It Right'}</span>
                </button>

                {!m.resolved && (
                  <button
                    type="button"
                    onClick={() => resolveMistake(m.id)}
                    className="text-xs font-semibold text-text-muted hover:text-emerald-500 flex items-center gap-1"
                  >
                    <Check size={13} />
                    <span>Mark as Mastered</span>
                  </button>
                )}
              </div>

              {/* Inline Repeat Practice Recording Drawer */}
              {isPracticingThis && (
                <div className="mt-4 p-5 rounded-2xl bg-surface border border-primary/30 text-center animate-fadeIn">
                  <p className="text-xs font-semibold text-text mb-3">
                    Say this out loud: <span className="font-black text-primary">"{m.correctedText}"</span>
                  </p>
                  <div className="flex justify-center py-2">
                    <VoiceButton
                      state={practiceVoiceState}
                      onClick={() => handlePracticeVoiceToggle(m)}
                      size="md"
                      label="Tap and Repeat"
                    />
                  </div>
                  {hasPracticed && (
                    <div className="mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      ✓ Fantastic pronunciation attempt recorded! Mistake marked as resolved.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
