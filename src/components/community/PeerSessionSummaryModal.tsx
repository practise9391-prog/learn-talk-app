import React, { useState } from 'react';
import { PeerSessionSummary } from '../../types/community';
import { useNavigation } from '../../context/NavigationContext';
import {
  CheckCircle2,
  Sparkles,
  Award,
  ArrowRight,
  BookOpen,
  ThumbsUp,
  MessageSquare,
  Volume2,
  Clock,
  RotateCcw,
  X,
  Target,
  ShieldCheck,
} from 'lucide-react';

interface PeerSessionSummaryModalProps {
  summary: PeerSessionSummary | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PeerSessionSummaryModal: React.FC<PeerSessionSummaryModalProps> = ({
  summary,
  isOpen,
  onClose,
}) => {
  const { navigate } = useNavigation();
  const [partnerRating, setPartnerRating] = useState<'helpful' | 'neutral' | 'not_helpful' | null>(null);
  const [tagsSelected, setTagsSelected] = useState<string[]>([]);
  const [feedbackSent, setFeedbackSent] = useState<boolean>(false);

  if (!isOpen || !summary) return null;

  const toggleTag = (t: string) => {
    setTagsSelected((prev) =>
      prev.includes(t) ? prev.filter((i) => i !== t) : [...prev, t]
    );
  };

  const handleStartRecommendedLesson = () => {
    onClose();
    if (summary.recommendedNextLesson) {
      navigate('/learn');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-card border border-border w-full max-w-xl rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
        {/* Celebration Header */}
        <div className="text-center space-y-1.5 pb-3 border-b border-border">
          <div className="w-14 h-14 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 size={32} />
          </div>
          <span className="text-[11px] font-black uppercase tracking-wider text-primary">
            Speaking Practice Complete 🎉
          </span>
          <h2 className="text-xl font-black text-text">{summary.topic}</h2>
          <div className="flex items-center justify-center gap-2 text-xs text-text-muted">
            <span>With <strong>{summary.partnerName}</strong></span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {summary.durationMinutes} Minutes Spoken
            </span>
          </div>
        </div>

        {/* Goal Achievement Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-indigo-500/10 border border-primary/20 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
              <Target size={14} />
              <span>Today's Speaking Goal</span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
              Achieved!
            </span>
          </div>
          <p className="text-sm font-black text-text">{summary.selectedGoal}</p>
          <p className="text-[11px] text-text-muted">{summary.goalProgressText}</p>
        </div>

        {/* AI Constructive Feedback */}
        {summary.aiFeedbackSummary && (
          <div className="p-4 rounded-2xl bg-surface border border-border space-y-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-text">
              <Sparkles size={14} className="text-primary" />
              <span>AI Speaking Coach Analysis</span>
            </div>

            {/* Strengths */}
            <div className="space-y-1">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 block text-[11px] uppercase tracking-wider">
                What went well:
              </span>
              <ul className="space-y-1 pl-4 list-disc text-text-muted leading-relaxed">
                {summary.aiFeedbackSummary.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            {/* Growth areas */}
            <div className="space-y-1 pt-1 border-t border-border/50">
              <span className="font-bold text-amber-600 dark:text-amber-400 block text-[11px] uppercase tracking-wider">
                Focus for next time:
              </span>
              <ul className="space-y-1 pl-4 list-disc text-text-muted leading-relaxed">
                {summary.aiFeedbackSummary.growthAreas.map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </div>

            {/* Naturalness Tip */}
            {summary.aiFeedbackSummary.naturalnessTip && (
              <div className="p-2.5 rounded-xl bg-card border border-border/80 text-[11px] text-text leading-relaxed">
                <span className="font-bold text-primary">💡 Natural Phrasing: </span>
                <span>{summary.aiFeedbackSummary.naturalnessTip}</span>
              </div>
            )}
          </div>
        )}

        {/* Vocabulary & Grammar Focus */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1.5">
            <span className="font-bold text-text block">Vocabulary Practiced</span>
            <div className="flex flex-wrap gap-1">
              {summary.vocabularyPracticed.map((v) => (
                <span key={v} className="px-2 py-0.5 rounded bg-card border border-border text-[11px] font-mono text-text">
                  {v}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1.5">
            <span className="font-bold text-text block">Grammar Review Patterns</span>
            <div className="space-y-1 text-[11px] text-text-muted leading-relaxed">
              {summary.grammarFocusPoints.map((gp, i) => (
                <p key={i}>• {gp}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Anonymous Partner Feedback */}
        <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-2 text-xs">
          <span className="font-bold text-text block">How was practicing with {summary.partnerName}?</span>
          {feedbackSent ? (
            <p className="text-emerald-500 font-bold text-[11px]">Thank you for your constructive feedback!</p>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'helpful', label: '👍 Very Helpful' },
                  { key: 'neutral', label: '🤝 Good Talk' },
                  { key: 'not_helpful', label: '👎 Had Issues' },
                ].map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => {
                      setPartnerRating(r.key as any);
                      setFeedbackSent(true);
                    }}
                    className={`py-1.5 rounded-xl border text-center transition-all ${
                      partnerRating === r.key
                        ? 'bg-primary text-white border-primary font-bold'
                        : 'bg-card hover:bg-surface border-border text-text'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {['Respectful partner', 'Structured conversation', 'Good audio clarity', 'Engaging topic'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-0.5 rounded-full border text-[10px] transition-all ${
                      tagsSelected.includes(tag)
                        ? 'bg-primary/10 border-primary text-primary font-bold'
                        : 'bg-card text-text-muted border-border'
                    }`}
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recommended Next Step & Exit */}
        <div className="pt-2 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Saved to Unified Practice History & Adaptive Profile</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-surface border border-border text-xs font-bold text-text hover:bg-card transition-all"
            >
              Done
            </button>

            {summary.recommendedNextLesson && (
              <button
                type="button"
                onClick={handleStartRecommendedLesson}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-primary-hover shadow-xs transition-all"
              >
                <span>Recommended Lesson</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
