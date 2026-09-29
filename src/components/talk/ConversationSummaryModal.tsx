import React from 'react';
import { SessionAnalytics } from '../../types/talk';
import { Modal } from '../common/Modal';
import { useNavigation } from '../../context/NavigationContext';
import {
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  RotateCcw,
  Volume2,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

interface ConversationSummaryModalProps {
  analytics: SessionAnalytics | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ConversationSummaryModal: React.FC<ConversationSummaryModalProps> = ({
  analytics,
  isOpen,
  onClose,
}) => {
  const { navigate } = useNavigation();

  if (!analytics) return null;

  const handleLaunchPractice = (route: string) => {
    onClose();
    navigate(route);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Conversation Performance Report" maxWidth="xl">
      <div className="flex flex-col gap-6 text-text">
        {/* Celebration Header */}
        <div className="text-center py-2 space-y-2">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-3xl shadow-sm">
            🎉
          </div>
          <h2 className="text-2xl font-black text-text tracking-tight">
            Conversation Complete!
          </h2>
          <p className="text-xs text-text-muted max-w-md mx-auto">
            Session with <span className="font-bold text-text">{analytics.personaName}</span> on <span className="font-bold text-primary">{analytics.topicTitle}</span>
          </p>
        </div>

        {/* Primary Metrics Grid (Requirement 34) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3.5 rounded-2xl bg-surface border border-border">
            <span className="text-[10px] font-bold text-text-muted uppercase block">Total Duration</span>
            <span className="text-base font-black text-text mt-0.5 block">
              {Math.floor(analytics.totalDurationSeconds / 60)}m {analytics.totalDurationSeconds % 60}s
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface border border-border">
            <span className="text-[10px] font-bold text-text-muted uppercase block">Speaking Time</span>
            <span className="text-base font-black text-primary mt-0.5 block">
              {Math.floor(analytics.speakingDurationSeconds / 60)}m {analytics.speakingDurationSeconds % 60}s
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface border border-border">
            <span className="text-[10px] font-bold text-text-muted uppercase block">Words Spoken</span>
            <span className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block">
              {analytics.wordsSpoken} words
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface border border-border">
            <span className="text-[10px] font-bold text-text-muted uppercase block">Speaking Pace</span>
            <span className="text-base font-black text-amber-500 mt-0.5 block">
              {analytics.speakingRateWpm} WPM
            </span>
          </div>
        </div>

        {/* 5-Skill Competency Breakdown */}
        <div className="p-5 rounded-2xl bg-surface border border-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text flex items-center gap-1.5">
              <TrendingUp size={15} className="text-primary" />
              <span>Skill Performance Breakdown</span>
            </span>
            <span className="text-xs font-bold text-primary">
              Fluency: {analytics.fluencyScore}/100
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { label: 'Grammar', score: analytics.grammarScore, color: 'text-indigo-500' },
              { label: 'Vocabulary', score: analytics.vocabularyScore, color: 'text-sky-500' },
              { label: 'Pronunciation', score: analytics.pronunciationScore, color: 'text-rose-500' },
              { label: 'Clarity', score: analytics.clarityScore, color: 'text-teal-500' },
            ].map((sk) => (
              <div key={sk.label} className="p-2.5 rounded-xl bg-card border border-border text-center">
                <span className="text-[10px] font-bold text-text-muted uppercase block">{sk.label}</span>
                <span className={`text-base font-black ${sk.color} mt-0.5 block`}>{sk.score}%</span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-text-muted italic leading-relaxed pt-1">
            "Your speech was generally easy to follow with natural sentence boundaries. Short deliberate pauses helped maintain steady articulation."
          </p>
        </div>

        {/* Filler Word Detection Analysis (Requirement 20) */}
        <div className="p-4 rounded-2xl bg-surface border border-border space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-text flex items-center gap-1.5">
              <Zap size={14} className="text-amber-500" />
              <span>Filler Word Usage Analysis</span>
            </span>
            <span className="text-[10px] text-text-muted">Target: Replace with short silent pauses</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {Object.entries(analytics.fillerWordCounts).map(([filler, count]) => (
              <span
                key={filler}
                className="px-3 py-1 rounded-xl bg-card border border-border font-medium flex items-center gap-2"
              >
                <span className="text-text font-bold">"{filler}"</span>
                <span className="text-[11px] px-1.5 py-0.2 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
                  {count}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Clickable Common Mistakes (Requirement 35) */}
        {analytics.commonMistakes && analytics.commonMistakes.length > 0 && (
          <div className="p-5 rounded-2xl bg-card border border-amber-300 dark:border-amber-900/40 space-y-3">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
              Most Common Mistakes (Click to Launch Targeted Drill):
            </span>

            <div className="space-y-2">
              {analytics.commonMistakes.map((m, i) => (
                <div
                  key={i}
                  onClick={() => handleLaunchPractice('/mistakes')}
                  className="p-3 rounded-xl bg-surface border border-border hover:border-primary/50 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-text group-hover:text-primary">
                        {m.category}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
                        {m.count} {m.count === 1 ? 'occurrence' : 'occurrences'}
                      </span>
                    </div>
                    {m.examples[0] && (
                      <span className="text-[11px] text-text-muted italic block mt-0.5">
                        "{m.examples[0]}"
                      </span>
                    )}
                  </div>
                  <ArrowRight size={14} className="text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* What You Did Well & What to Improve (Requirement 34) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 space-y-1.5">
            <span className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
              <CheckCircle2 size={13} /> You Did Well
            </span>
            {analytics.whatYouDidWell.map((w, i) => (
              <div key={i} className="text-text flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>{w}</span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 space-y-1.5">
            <span className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
              <Lightbulb size={13} /> Focus Next
            </span>
            {analytics.whatToImprove.map((imp, i) => (
              <div key={i} className="text-text flex items-start gap-1.5">
                <span className="text-amber-500 font-bold">•</span>
                <span>{imp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Specific Encouragement from Jarvis (Requirement 54) */}
        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-start gap-3 text-xs">
          <span className="text-2xl shrink-0">🤖</span>
          <div>
            <span className="font-bold text-primary block mb-0.5">Jarvis says:</span>
            <p className="text-text leading-relaxed italic">
              "{analytics.specificJarvisFeedback}"
            </p>
          </div>
        </div>

        {/* Personalized Recommended Practice Action (Requirement 36) */}
        <div className="p-4 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
              Recommended Next Practice
            </span>
            <span className="text-sm font-bold text-text">
              {analytics.recommendedPractice.title}
            </span>
            <p className="text-[11px] text-text-muted mt-0.5">
              {analytics.recommendedPractice.reason}
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleLaunchPractice(analytics.recommendedPractice.route)}
            className="px-5 py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-xl shadow-sm hover:bg-primary-hover transition-colors shrink-0 flex items-center justify-center gap-1.5"
          >
            <span>Practice Now</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 bg-surface hover:bg-card border border-border text-text font-bold text-xs rounded-xl transition-colors"
        >
          Close & Return to Hub
        </button>
      </div>
    </Modal>
  );
};
