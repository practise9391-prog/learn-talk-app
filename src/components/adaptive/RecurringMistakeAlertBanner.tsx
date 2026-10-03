import React from 'react';
import { useAdaptiveLearning } from '../../context/AdaptiveLearningContext';
import { useNavigation } from '../../context/NavigationContext';
import { AlertTriangle, ArrowRight, X, ShieldAlert, BookOpen } from 'lucide-react';

export const RecurringMistakeAlertBanner: React.FC = () => {
  const { activeRecurringMistake, dismissRecurringMistakeAlert } = useAdaptiveLearning();
  const { navigate } = useNavigation();

  if (!activeRecurringMistake) return null;

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm animate-fadeIn">
      <div className="flex items-start gap-3.5 min-w-0">
        <div className="p-2.5 rounded-2xl bg-amber-500 text-white shrink-0 mt-0.5 shadow-xs">
          <AlertTriangle size={20} />
        </div>

        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              Recurring Mistake Pattern Detected ({activeRecurringMistake.occurrences}x)
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-extrabold text-text">
            {activeRecurringMistake.title}
          </h3>

          <p className="text-xs text-text-muted leading-relaxed">
            {activeRecurringMistake.rootCauseRule}
          </p>

          <div className="text-[11px] text-text-muted bg-surface/60 p-2 rounded-xl border border-border inline-block mt-1">
            <strong className="text-amber-600 dark:text-amber-400">Recent sentence: </strong>
            <span className="italic">"{activeRecurringMistake.sampleMistakes[0]}"</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
        <button
          type="button"
          onClick={() => navigate(activeRecurringMistake.relatedRoute)}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-98"
        >
          <span>Practice Root Cause Rule</span>
          <ArrowRight size={14} />
        </button>

        <button
          type="button"
          onClick={dismissRecurringMistakeAlert}
          className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface transition-colors"
          title="Dismiss warning"
          aria-label="Dismiss warning"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
