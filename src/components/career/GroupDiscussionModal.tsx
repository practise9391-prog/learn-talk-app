import React, { useState } from 'react';
import {
  X,
  Users,
  MessageSquare,
  Sparkles,
  Send,
  Volume2,
  VolumeX,
  CheckCircle2,
  Lightbulb,
  ThumbsUp,
  RotateCcw,
} from 'lucide-react';
import { SAMPLE_GD_SCENARIOS } from '../../data/careerData';
import { GroupDiscussionScenario } from '../../types/career';

interface GroupDiscussionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GroupDiscussionModal: React.FC<GroupDiscussionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<GroupDiscussionScenario>(SAMPLE_GD_SCENARIOS[0]);
  const [learnerContribution, setLearnerContribution] = useState('');
  const [submittedContributions, setSubmittedContributions] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!learnerContribution.trim()) return;

    setSubmittedContributions((prev) => [...prev, learnerContribution.trim()]);

    const text = learnerContribution.toLowerCase();
    const hasConsensusPhrase =
      text.includes('building on') ||
      text.includes('i agree with') ||
      text.includes('from a different angle') ||
      text.includes('to summarize');
    const hasTradeoff = text.includes('however') || text.includes('tradeoff') || text.includes('balance');

    setFeedback({
      consensusScore: hasConsensusPhrase ? 90 : 70,
      balanceScore: hasTradeoff ? 92 : 72,
      recommendation: hasConsensusPhrase
        ? 'Great consensus-building! You acknowledged the team and added fresh insight.'
        : 'Good point! Next time, try bridging to another participant: "Building on Alex\'s point..."',
    });

    setLearnerContribution('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-card border border-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-500">
              <Users size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-text">Workplace Meeting & GD Simulator</h2>
              <p className="text-xs text-text-muted">
                Practice polite interruption, summarizing consensus, and balanced argumentation in multi-party discussions
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Scenario Selector */}
          <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-surface border border-border">
            <span className="text-xs font-bold text-text-muted mr-1">Topic:</span>
            {SAMPLE_GD_SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => {
                  setSelectedScenario(sc);
                  setSubmittedContributions([]);
                  setFeedback(null);
                }}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                  selectedScenario.id === sc.id
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-card hover:bg-border text-text'
                }`}
              >
                {sc.topicTitle}
              </button>
            ))}
          </div>

          {/* Scenario Card */}
          <div className="p-5 rounded-3xl bg-surface border border-border space-y-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                Discussion Brief ({selectedScenario.category})
              </span>
              <h3 className="text-base font-black text-text mt-0.5">{selectedScenario.topicTitle}</h3>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                {selectedScenario.starterPrompt}
              </p>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-text-muted uppercase">Recommended Discussion Phrases:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedScenario.usefulPhrases.map((up, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-card border border-border text-[11px] text-text font-medium"
                  >
                    "{up.phrase}"
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Discussion Thread */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-text-muted">
              Meeting Dialogue Stream
            </h4>

            <div className="space-y-3">
              {selectedScenario.aiPeers.map((p, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-surface border border-border space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center">
                        {p.name[0]}
                      </div>
                      <span className="text-xs font-bold text-text">{p.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-text-muted uppercase px-2 py-0.5 rounded bg-card border border-border">
                      Stance: {p.stance}
                    </span>
                  </div>
                  <p className="text-xs text-text pl-8 leading-relaxed">"{p.openingStatement}"</p>
                </div>
              ))}

              {submittedContributions.map((c, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-primary/10 border border-primary/30 space-y-1 animate-fadeIn"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center">
                      You
                    </div>
                    <span className="text-xs font-black text-primary">Your Spoken Contribution</span>
                  </div>
                  <p className="text-xs sm:text-sm text-text pl-8 font-medium leading-relaxed">"{c}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Card */}
          {feedback && (
            <div className="p-4 rounded-2xl bg-surface border border-emerald-500/30 space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> Team Facilitation Evaluation
                </span>
                <span className="text-xs font-bold text-text-muted">
                  Balance Score: {feedback.balanceScore}%
                </span>
              </div>
              <p className="text-xs text-text">{feedback.recommendation}</p>
            </div>
          )}

          {/* Contribution Input Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Add Your Spoken Point / Counter-Perspective
              </label>
              <span className="text-[11px] text-text-muted">
                Pro-tip: Acknowledge previous speaker + state tradeoff + recommend path forward
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={learnerContribution}
                onChange={(e) => setLearnerContribution(e.target.value)}
                placeholder="e.g., Building on Maya's point about focus, while remote is productive for deep work..."
                className="flex-1 px-4 py-3 rounded-2xl bg-surface border border-border text-xs sm:text-sm text-text placeholder:text-text-muted/60 focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary"
              />
              <button
                type="submit"
                disabled={!learnerContribution.trim()}
                className="px-5 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                <Send size={14} />
                <span>Speak</span>
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-surface/30 flex items-center justify-between">
          <span className="text-xs text-text-muted">
            The most valued meeting participants bridge divergent perspectives toward actionable consensus.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-text hover:bg-card transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
