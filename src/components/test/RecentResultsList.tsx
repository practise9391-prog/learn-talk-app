import React, { useState } from 'react';
import { useTest } from '../../context/TestContext';
import { TestAttempt, SkillType } from '../../types/test';
import { Award, Clock, RotateCcw, Eye, Filter, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface RecentResultsListProps {
  onReviewAttempt: (attempt: TestAttempt) => void;
  onRetakeTest: (testId: string) => void;
  onPracticeWeakAreas: () => void;
}

export const RecentResultsList: React.FC<RecentResultsListProps> = ({
  onReviewAttempt,
  onRetakeTest,
  onPracticeWeakAreas
}) => {
  const { attempts } = useTest();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filteredAttempts = attempts.filter((att) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'speaking') {
      return (
        att.testType === 'quick_speaking' ||
        att.testType === 'picture_description' ||
        att.testType === 'three_word_story' ||
        att.testType === 'random_object_pitch'
      );
    }
    if (selectedFilter === 'fluency') {
      return att.testType === 'jam' || att.testType === 'no_fillers' || att.testType === 'fluency';
    }
    if (selectedFilter === 'grammar') return att.testType === 'grammar';
    if (selectedFilter === 'pronunciation') {
      return att.testType === 'pronunciation' || att.testType === 'shadowing';
    }
    return true;
  });

  return (
    <div className="rounded-3xl bg-card border border-border p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-black text-text">Recent Test Results & Performance</h3>
          <p className="text-xs text-text-muted mt-0.5">
            Review your AI evidence breakdowns, compare retake deltas, and practice target gaps
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Tests' },
            { id: 'speaking', label: 'Speaking' },
            { id: 'fluency', label: 'Fluency' },
            { id: 'grammar', label: 'Grammar' },
            { id: 'pronunciation', label: 'Pronunciation' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedFilter === tab.id
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-surface hover:bg-surface-hover text-text-muted border border-border/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filteredAttempts.length === 0 ? (
        <div className="p-8 text-center bg-surface rounded-2xl">
          <p className="text-xs font-semibold text-text-muted">
            No completed tests found under this filter. Take a test above to record your first diagnostic!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAttempts.map((attempt) => (
            <div
              key={attempt.id}
              className="p-4 rounded-2xl bg-surface border border-border hover:border-primary/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 font-black text-sm">
                  {attempt.scores.overallCommunication}%
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-text truncate">{attempt.testTitle}</h4>
                    {attempt.isRetake && (
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                        Retake
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5 flex-wrap">
                    <span>{attempt.timestamp}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {Math.floor(attempt.durationSeconds / 60)}m {attempt.durationSeconds % 60}s
                    </span>
                    <span>•</span>
                    <span className="text-primary font-bold">
                      Speaking: {attempt.scores.speaking}%
                    </span>
                    <span>•</span>
                    <span className="text-emerald-500 font-bold">
                      Grammar: {attempt.scores.grammar}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => onReviewAttempt(attempt)}
                  className="px-3 py-1.5 rounded-xl bg-card border border-border hover:bg-surface-hover text-text font-bold text-xs flex items-center gap-1 transition-colors shadow-xs"
                >
                  <Eye size={13} />
                  <span>Review Evidence</span>
                </button>

                <button
                  type="button"
                  onClick={() => onRetakeTest(attempt.testId)}
                  className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <RotateCcw size={13} />
                  <span>Retake</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
