import React, { useState } from 'react';
import { useHistory } from '../../context/HistoryContext';
import { RevisionItem } from '../../types/history';
import {
  X,
  Sparkles,
  CheckCircle2,
  Clock,
  RotateCcw,
  Check,
  AlertTriangle,
  ArrowRight,
  Volume2,
  BookOpen,
} from 'lucide-react';

interface TodayReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TodayReviewModal: React.FC<TodayReviewModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { revisionQueue, runRevisionItem } = useHistory();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [revealed, setRevealed] = useState<boolean>(false);
  const [completedCount, setCompletedCount] = useState<number>(0);

  if (!isOpen) return null;

  const currentItem: RevisionItem | undefined = revisionQueue[currentIndex];
  const totalEstimatedMins = Math.ceil(
    revisionQueue.reduce((sum, item) => sum + item.estimatedSeconds, 0) / 60
  );

  const handleResult = (success: boolean) => {
    if (currentItem) {
      runRevisionItem(currentItem.id, success);
    }
    setCompletedCount((prev) => prev + 1);
    setRevealed(false);
    if (currentIndex + 1 < revisionQueue.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(revisionQueue.length);
    }
  };

  const isFinished = currentIndex >= revisionQueue.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border w-full max-w-xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-surface/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="text-sm font-black text-text">Today's Smart Review</h3>
              <p className="text-[11px] text-text-muted flex items-center gap-1.5">
                <Clock size={11} />
                <span>{totalEstimatedMins} mins estimated • {revisionQueue.length} items due</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-text-muted hover:text-text hover:bg-surface transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-surface w-full">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{
              width: `${(currentIndex / Math.max(1, revisionQueue.length)) * 100}%`,
            }}
          />
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {!isFinished && currentItem ? (
            <div className="space-y-5">
              {/* Item Metadata */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                      currentItem.priority === 'high'
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        : currentItem.priority === 'medium'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    {currentItem.priority === 'high' ? 'Review Now' : currentItem.priority === 'medium' ? 'Review Soon' : 'Looking Strong'}
                  </span>
                  <span className="text-text-muted capitalize">
                    {currentItem.itemType}
                  </span>
                </div>
                <span className="font-semibold text-text-muted">
                  {currentIndex + 1} of {revisionQueue.length}
                </span>
              </div>

              {/* Prompt Card */}
              <div className="p-6 rounded-3xl bg-surface border border-border text-center space-y-3 min-h-[160px] flex flex-col justify-center">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                  {currentItem.title}
                </span>
                <h4 className="text-base sm:text-lg font-black text-text leading-snug">
                  {currentItem.subtitle}
                </h4>

                <p className="text-xs text-text-muted max-w-sm mx-auto pt-1">
                  Reason: {currentItem.reason}
                </p>
              </div>

              {/* Reveal Explanation / Answer */}
              {revealed ? (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-xs text-text space-y-1">
                    <span className="font-bold text-primary block">Correction & Review Guide:</span>
                    <p className="leading-relaxed">
                      Make sure to actively speak the polished version out loud 2–3 times so that your vocal cords and speech motor memory internalize the pattern.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => handleResult(false)}
                      className="py-3 px-4 rounded-2xl bg-surface border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <RotateCcw size={14} />
                      <span>Review Again Soon</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleResult(true)}
                      className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                    >
                      <Check size={14} />
                      <span>Recalled Correctly</span>
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setRevealed(true)}
                  className="w-full py-3.5 rounded-2xl bg-primary text-white font-bold text-xs hover:bg-primary-hover shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles size={14} />
                  <span>Show Answer & Practice</span>
                </button>
              )}
            </div>
          ) : (
            /* Completed Screen */
            <div className="p-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-3xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                <CheckCircle2 size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-text">Daily Review Completed!</h3>
                <p className="text-xs text-text-muted max-w-sm mx-auto">
                  You reviewed <strong>{completedCount} items</strong> today. Spaced repetition intervals have been updated to optimize your memory retention.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-surface border border-border hover:bg-card text-xs font-bold text-text transition-all"
              >
                Close Review
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
