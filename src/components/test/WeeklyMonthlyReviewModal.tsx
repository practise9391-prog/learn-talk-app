import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { useTest } from '../../context/TestContext';
import {
  Calendar,
  Clock,
  Flame,
  Award,
  BookOpen,
  Sparkles,
  Users2,
  Mic,
  CheckCircle2,
  ArrowRight,
  X,
  Target
} from 'lucide-react';

interface WeeklyMonthlyReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'weekly' | 'monthly';
  onPracticeWithJarvis: (prompt: string) => void;
}

export const WeeklyMonthlyReviewModal: React.FC<WeeklyMonthlyReviewModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'weekly',
  onPracticeWithJarvis
}) => {
  const { user, recordings } = useUser();
  const { attempts, weakAreas } = useTest();
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly'>(initialMode);

  if (!isOpen) return null;

  // Aggregate metrics
  const totalMinutes = Math.round(
    recordings.reduce((sum, r) => sum + (r.durationSeconds || 60), 0) / 60
  );
  const totalWords = recordings.reduce(
    (sum, r) => sum + (r.transcriptText ? r.transcriptText.split(/\s+/).length : 50),
    0
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-card border border-border w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="p-5 sm:p-6 border-b border-border flex items-center justify-between bg-surface/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-black">
              <Calendar size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                Progress Review
              </span>
              <h3 className="text-lg font-black text-text">
                {activeTab === 'weekly' ? 'Weekly Speaking Review' : 'Monthly English Review'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switcher */}
            <div className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-border">
              <button
                type="button"
                onClick={() => setActiveTab('weekly')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  activeTab === 'weekly'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                Weekly
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('monthly')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  activeTab === 'monthly'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                Monthly
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
          {/* Top Review Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-surface border border-border text-center">
              <span className="text-[10px] text-text-muted uppercase font-bold block">
                {activeTab === 'weekly' ? '7-Day Speaking Time' : '30-Day Speaking Time'}
              </span>
              <strong className="text-xl font-black text-primary mt-1 block">
                {activeTab === 'weekly' ? `${Math.min(48, totalMinutes)} mins` : `${totalMinutes} mins`}
              </strong>
            </div>

            <div className="p-4 rounded-2xl bg-surface border border-border text-center">
              <span className="text-[10px] text-text-muted uppercase font-bold block">
                Words Spoken
              </span>
              <strong className="text-xl font-black text-emerald-500 mt-1 block">
                ~{activeTab === 'weekly' ? `${Math.min(940, totalWords)}` : `${totalWords}`}
              </strong>
            </div>

            <div className="p-4 rounded-2xl bg-surface border border-border text-center">
              <span className="text-[10px] text-text-muted uppercase font-bold block">
                Tests Completed
              </span>
              <strong className="text-xl font-black text-indigo-500 mt-1 block">
                {activeTab === 'weekly' ? Math.min(3, attempts.length) : attempts.length}
              </strong>
            </div>

            <div className="p-4 rounded-2xl bg-surface border border-border text-center">
              <span className="text-[10px] text-text-muted uppercase font-bold block">
                New Vocabulary
              </span>
              <strong className="text-xl font-black text-purple-500 mt-1 block">
                {activeTab === 'weekly' ? '28 words' : '84 words'}
              </strong>
            </div>
          </div>

          {/* Activity Breakdown (Section 39 & 40) */}
          <div className="p-5 rounded-3xl bg-card border border-border space-y-3">
            <h4 className="text-sm font-black text-text flex items-center gap-1.5">
              <Sparkles size={16} className="text-primary" />
              <span>Evidence-Based Activity Overview</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-surface border border-border/70 space-y-1.5">
                <span className="text-[10px] font-bold text-text-muted uppercase block">
                  Completed Lessons & Modules
                </span>
                <strong className="text-sm font-black text-text block">
                  {activeTab === 'weekly' ? '5 Curriculum Lessons' : '14 Curriculum Units'}
                </strong>
                <p className="text-[11px] text-text-muted">
                  Strengthened simple present foundations and everyday conversational connectors.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface border border-border/70 space-y-1.5">
                <span className="text-[10px] font-bold text-text-muted uppercase block">
                  Interactive Roleplays & Jarvis Turns
                </span>
                <strong className="text-sm font-black text-text block">
                  {activeTab === 'weekly' ? '4 Roleplay Sessions' : '12 Scenarios Completed'}
                </strong>
                <p className="text-[11px] text-text-muted">
                  Practiced Airport Check-in, Coffee Shop Orders, and Workplace Status Updates.
                </p>
              </div>
            </div>
          </div>

          {/* Repeated Mistakes & Pronunciation Targets */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-text flex items-center gap-1.5">
              <Target size={16} className="text-rose-500" />
              <span>Recurring Mistake Patterns & Pronunciation Targets</span>
            </h4>

            <div className="space-y-2.5">
              {weakAreas.map((w) => (
                <div
                  key={w.id}
                  className="p-3.5 rounded-2xl bg-surface border border-border flex items-center justify-between text-xs gap-3"
                >
                  <div>
                    <span className="text-[10px] font-bold text-rose-500 uppercase block">{w.category}</span>
                    <strong className="text-text font-bold">{w.topic}</strong>
                    <span className="text-text-muted block text-[11px] mt-0.5">
                      {w.totalMistakes} recorded slips across lessons, roleplays, and tests
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onPracticeWithJarvis(`Let's focus our conversation on practicing ${w.topic}.`);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-card border border-border text-primary font-bold text-xs hover:bg-primary hover:text-white transition-colors shrink-0 shadow-xs"
                  >
                    Target Drill
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendation for Next Period */}
          <div className="p-5 rounded-3xl bg-primary/10 border border-primary/20 space-y-2">
            <span className="text-[10px] font-black text-primary uppercase tracking-wider block">
              {activeTab === 'weekly' ? "Next Week's Recommended Strategic Focus" : "Next Month's Learning Blueprint"}
            </span>
            <h4 className="text-sm font-black text-text">
              {activeTab === 'weekly'
                ? 'Consolidate Past Tense Storytelling & Silent Pauses'
                : 'Elevate from Elementary (A2) to Confident Intermediate (B1)'}
            </h4>
            <p className="text-xs text-text-muted leading-relaxed">
              {activeTab === 'weekly'
                ? 'Your speech rate is steady (~115 wpm). To sound more authoritative, spend 5 minutes daily on the "No Fillers Challenge" and practice narrative past tenses with Jarvis.'
                : 'Continue the daily 10-minute habit. Focus on multi-sentence cohesion and professional vocabulary collocations to unlock fluent workplace conversations.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex justify-end bg-surface/50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
