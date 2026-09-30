import React from 'react';
import { useTest } from '../../context/TestContext';
import { useNavigation } from '../../context/NavigationContext';
import { WeakArea } from '../../types/test';
import { AlertCircle, ArrowRight, CheckCircle2, Flame, Layers, MessageSquare, Sparkles } from 'lucide-react';

interface WeakAreasCardProps {
  onPracticeWithJarvis: (prompt: string) => void;
}

export const WeakAreasCard: React.FC<WeakAreasCardProps> = ({ onPracticeWithJarvis }) => {
  const { weakAreas, resolveWeakArea } = useTest();
  const { navigate } = useNavigation();

  const handleAction = (item: WeakArea) => {
    const act = item.practiceAction;
    if (act.type === 'talk') {
      onPracticeWithJarvis(
        `I would like to focus on practicing ${item.topic}. Can you help me practice using it naturally in real conversation?`
      );
    } else if (act.type === 'grammar') {
      navigate('/grammar');
    } else if (act.type === 'vocabulary') {
      navigate('/vocabulary');
    } else if (act.type === 'pronunciation') {
      navigate('/pronunciation');
    } else if (act.type === 'roleplay') {
      navigate('/roleplay');
    } else {
      navigate('/learn');
    }
  };

  return (
    <div className="rounded-3xl bg-card border border-border p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <h3 className="text-lg font-black text-text">Multi-Source Weakness Detection</h3>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Aggregated across Lessons, Talk / Jarvis sessions, Roleplays, and Tests. Only persistent patterns are flagged.
          </p>
        </div>

        <span className="text-[11px] font-bold text-text-muted bg-surface px-3 py-1 rounded-full border border-border self-start sm:self-auto">
          {weakAreas.length} Active Targets
        </span>
      </div>

      {weakAreas.length === 0 ? (
        <div className="p-8 rounded-2xl bg-surface text-center flex flex-col items-center">
          <CheckCircle2 size={32} className="text-emerald-500 mb-2" />
          <h4 className="text-sm font-bold text-text">No Persistent Weaknesses Detected!</h4>
          <p className="text-xs text-text-muted mt-1 max-w-sm">
            Keep practicing across talk and tests. As repeated patterns emerge, actionable drills will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {weakAreas.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-surface border border-border hover:border-primary/40 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header tag */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-[10px] uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-bold text-text-muted">
                    {item.totalMistakes} recorded occurrences
                  </span>
                </div>

                <h4 className="text-sm font-black text-text mb-1">{item.topic}</h4>

                {/* Multi-source matrix (Section 30 requirement) */}
                <div className="grid grid-cols-4 gap-1 p-2 rounded-xl bg-card border border-border/70 my-2 text-center text-[10px]">
                  <div>
                    <span className="text-text-muted block">Lesson</span>
                    <strong className="text-text font-bold">{item.sources.lessonMistakes}</strong>
                  </div>
                  <div>
                    <span className="text-text-muted block">Talk</span>
                    <strong className="text-primary font-bold">{item.sources.talkMistakes}</strong>
                  </div>
                  <div>
                    <span className="text-text-muted block">Roleplay</span>
                    <strong className="text-indigo-500 font-bold">{item.sources.roleplayMistakes}</strong>
                  </div>
                  <div>
                    <span className="text-text-muted block">Tests</span>
                    <strong className="text-amber-500 font-bold">{item.sources.testMistakes}</strong>
                  </div>
                </div>

                {/* Example sentence */}
                <div className="space-y-1 text-xs my-2.5">
                  <div className="text-rose-600 dark:text-rose-400 line-through">
                    <span className="text-text-muted text-[10px] font-bold uppercase mr-1">You said:</span>
                    "{item.sampleMistake.youSaid}"
                  </div>
                  <div className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span className="text-text-muted text-[10px] font-bold uppercase mr-1">Better:</span>
                    "{item.sampleMistake.better}"
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-border/60 mt-2">
                <button
                  type="button"
                  onClick={() => handleAction(item)}
                  className="flex-1 py-2 px-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>{item.practiceAction.label}</span>
                  <ArrowRight size={13} />
                </button>

                <button
                  type="button"
                  onClick={() => resolveWeakArea(item.id)}
                  title="Mark as Mastered"
                  className="p-2 rounded-xl bg-card border border-border hover:bg-emerald-500/10 hover:text-emerald-600 text-text-muted transition-colors"
                >
                  <CheckCircle2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
