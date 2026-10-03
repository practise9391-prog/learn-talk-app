import React, { useState } from 'react';
import { useAdaptiveLearning } from '../../context/AdaptiveLearningContext';
import { useNavigation } from '../../context/NavigationContext';
import {
  RotateCcw,
  X,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
  BookmarkCheck,
} from 'lucide-react';

interface SmartRevisionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SmartRevisionModal: React.FC<SmartRevisionModalProps> = ({ isOpen, onClose }) => {
  const { masteryRecords, resolveMasteryReview } = useAdaptiveLearning();
  const { navigate } = useNavigation();

  // Combine decayed/due concepts
  const reviewQueue = masteryRecords.filter(
    (m) => m.isDecayed || m.status === 'practicing' || m.status === 'developing'
  );

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [completedCount, setCompletedCount] = useState<number>(0);

  if (!isOpen) return null;

  const currentItem = reviewQueue[currentIndex];

  const handleScoreResponse = (score: number) => {
    if (currentItem) {
      resolveMasteryReview(currentItem.id, score);
      setCompletedCount((prev) => prev + 1);
    }

    setIsRevealed(false);
    if (currentIndex < reviewQueue.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Done with batch!
      setCurrentIndex(reviewQueue.length);
    }
  };

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-card border border-border w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden my-6 flex flex-col animate-scaleUp">
        {/* Header */}
        <div className="p-5 border-b border-border bg-surface/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary text-white shadow-xs">
              <RotateCcw size={18} />
            </div>
            <div>
              <h2 className="text-base font-black text-text">Central Smart Revision Hub</h2>
              <p className="text-[11px] text-text-muted">
                Overdue vocabulary, recurring grammar & weak speaking items
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-text-muted hover:text-text"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {currentIndex >= reviewQueue.length ? (
            /* All Items Reviewed Congratulations */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto text-3xl">
                ð
              </div>
              <div>
                <h3 className="text-lg font-black text-text">All Revision Complete!</h3>
                <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
                  You refreshed {completedCount} high-risk items. Your spaced repetition retention intervals have been successfully extended.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow-sm hover:bg-primary-hover transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Batch Progress Counter */}
              <div className="flex items-center justify-between text-xs font-semibold text-text-muted">
                <span>
                  Item {currentIndex + 1} of {reviewQueue.length}
                </span>
                <span className="capitalize text-primary font-bold">
                  {currentItem.category} â¢ {currentItem.status}
                </span>
              </div>

              {/* Decay Warning Ribbon (Section 12) */}
              {currentItem.isDecayed && (
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400">
                  <AlertTriangle size={15} className="shrink-0" />
                  <span>
                    <strong>Spaced Decay Alert: </strong>
                    {currentItem.decayWarning || 'This skill is due for a quick review.'}
                  </span>
                </div>
              )}

              {/* Concept Card */}
              <div className="p-6 rounded-3xl bg-surface border border-border text-center space-y-3 shadow-2xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-text-muted">
                  Concept Title
                </span>

                <div className="flex items-center justify-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-black text-text">
                    {currentItem.title}
                  </h3>
                  <button
                    type="button"
                    onClick={() => playAudio(currentItem.title)}
                    className="p-1.5 rounded-xl hover:bg-card text-primary transition-colors"
                    title="Listen pronunciation"
                  >
                    <Volume2 size={18} />
                  </button>
                </div>

                {/* Evidence Context Metrics */}
                <div className="flex items-center justify-center gap-3 text-[11px] text-text-muted font-medium pt-1">
                  <span>Quiz Accuracy: <strong className="text-text">{currentItem.contextEvidence.quizScore || 85}%</strong></span>
                  <span>â¢</span>
                  <span>Speaking Usage: <strong className={currentItem.contextEvidence.speakingScore && currentItem.contextEvidence.speakingScore < 60 ? 'text-amber-500' : 'text-text'}>{currentItem.contextEvidence.speakingScore || 50}%</strong></span>
                </div>

                {/* Contextual Reveal Button */}
                {!isRevealed ? (
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => setIsRevealed(true)}
                      className="px-5 py-2.5 rounded-xl bg-card border border-border text-text font-bold text-xs hover:border-primary transition-all shadow-2xs"
                    >
                      Reveal Usage & Examples
                    </button>
                  </div>
                ) : (
                  <div className="pt-3 text-left space-y-2 border-t border-border animate-fadeIn text-xs">
                    <div className="p-3 rounded-xl bg-card border border-border">
                      <strong className="text-text block mb-0.5">Tested In Contexts:</strong>
                      <span className="text-text-muted">{currentItem.transferContextsTested.join(' â¢ ')}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                      <strong>Spoken Recall Goal: </strong>
                      <span>Aim to use this naturally in your next conversation with Jarvis!</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Recall Rating Buttons (Spaced Repetition SM-2 logic) */}
              {isRevealed && (
                <div className="space-y-2 animate-fadeIn">
                  <span className="text-[11px] font-bold text-text-muted text-center block">
                    How confidently did you recall this concept?
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleScoreResponse(40)}
                      className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs hover:bg-rose-500 hover:text-white transition-all text-center"
                    >
                      <span className="block">Struggled</span>
                      <span className="text-[10px] font-normal opacity-80">Review tomorrow</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleScoreResponse(75)}
                      className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs hover:bg-amber-500 hover:text-white transition-all text-center"
                    >
                      <span className="block">Good</span>
                      <span className="text-[10px] font-normal opacity-80">+3 days</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleScoreResponse(95)}
                      className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs hover:bg-emerald-500 hover:text-white transition-all text-center"
                    >
                      <span className="block">Mastered</span>
                      <span className="text-[10px] font-normal opacity-80">+7 days</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
