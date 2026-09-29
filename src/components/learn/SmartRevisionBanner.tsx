import React from 'react';
import { SMART_REVISION_ITEMS } from '../../data/curriculumData';
import { useNavigation } from '../../context/NavigationContext';
import { RotateCcw, AlertTriangle, Sparkles, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export const SmartRevisionBanner: React.FC = () => {
  const { navigate } = useNavigation();

  return (
    <div className="rounded-3xl bg-card border border-border p-6 sm:p-7 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <RotateCcw size={18} className="text-amber-500 animate-spin" style={{ animationDuration: '12s' }} />
            <h3 className="text-base sm:text-lg font-black text-text tracking-tight">
              Smart AI Revision Engine
            </h3>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Auto-generated revision workouts based on your specific conversation mistakes
          </p>
        </div>

        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 self-start sm:self-auto">
          Personalized from Recent Mistakes
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {SMART_REVISION_ITEMS.slice(0, 2).map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-surface border border-border hover:border-amber-400/50 hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  {item.category}
                </span>
                <span className="text-[11px] text-text-muted italic">Spotted in speaking</span>
              </div>

              <h4 className="text-sm font-bold text-text mb-1">
                {item.topic}
              </h4>
              <p className="text-xs text-text-muted leading-relaxed mb-3">
                {item.triggerReason}
              </p>
            </div>

            <div className="pt-2 border-t border-border flex items-center justify-between">
              <span className="text-[11px] font-semibold text-text truncate max-w-[200px]">
                {item.actionPrompt}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (item.lessonIdRef) {
                    navigate(`/learn/lesson/${item.lessonIdRef}`);
                  } else {
                    navigate('/talk/speed');
                  }
                }}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1"
              >
                <span>Drill</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
