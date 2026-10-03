import React, { useState } from 'react';
import {
  X,
  Send,
  MessageSquare,
  Mail,
  FileText,
  Video,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { ASYNC_COMM_MATRIX_ITEMS } from '../../data/workplaceMasteryData';
import { CommChannelType, AsyncCommMatrixItem } from '../../types/workplaceMastery';
import { useWorkplaceMastery } from '../../context/WorkplaceMasteryContext';

interface AsyncDecisionMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AsyncDecisionMatrixModal: React.FC<AsyncDecisionMatrixModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { recordCompletedDrill } = useWorkplaceMastery();
  const [caseIdx, setCaseIdx] = useState(0);
  const [selectedChannel, setSelectedChannel] = useState<CommChannelType | null>(null);
  const [userDraft, setUserDraft] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const matrixItem = ASYNC_COMM_MATRIX_ITEMS[caseIdx];

  if (!isOpen) return null;

  const handleSelectChannel = (channel: CommChannelType) => {
    setSelectedChannel(channel);
  };

  const handleSubmit = () => {
    if (!selectedChannel) return;
    setSubmitted(true);
    const isCorrectChannel = selectedChannel === matrixItem.recommendedChannel;
    recordCompletedDrill('async_matrix', matrixItem.scenario.slice(0, 30), {
      score: isCorrectChannel ? 95 : 65,
      isPassed: isCorrectChannel,
      structureCheck: [
        {
          label: 'Channel Appropriateness',
          passed: isCorrectChannel,
          feedback: isCorrectChannel
            ? 'Correct channel selection based on complexity and urgency.'
            : `Recommended channel was ${matrixItem.recommendedChannel.toUpperCase()} because: ${matrixItem.rationale}`,
        },
      ],
      overallFeedback: isCorrectChannel ? 'Optimal channel chosen!' : 'Consider asynchronous trade-offs.',
      betterAlternative: matrixItem.exampleDraft,
    });
  };

  const handleNext = () => {
    setSubmitted(false);
    setSelectedChannel(null);
    setUserDraft('');
    setCaseIdx((prev) => (prev + 1) % ASYNC_COMM_MATRIX_ITEMS.length);
  };

  const getChannelIcon = (type: CommChannelType) => {
    switch (type) {
      case 'chat':
        return <MessageSquare className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'document':
        return <FileText className="w-4 h-4" />;
      case 'meeting':
        return <Video className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-surface-hover/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">
                Async Communication Decision Matrix
              </h2>
              <p className="text-sm text-text-secondary">
                Master when to use Slack/Teams vs Email vs RFC Document vs Synchronous Meeting
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-tertiary hover:text-text-primary rounded-lg hover:bg-surface-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Scenario prompt */}
          <div className="p-5 rounded-2xl bg-surface-hover border border-border space-y-2">
            <span className="font-bold text-xs uppercase tracking-wider text-primary">
              Workplace Communication Scenario:
            </span>
            <p className="text-sm text-text-primary font-medium leading-relaxed">
              "{matrixItem.scenario}"
            </p>
          </div>

          {/* Channel selector options */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
              Select the Most Effective Channel:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(
                [
                  { id: 'chat', label: 'Chat (Slack/Teams)', desc: 'Quick / Low friction' },
                  { id: 'email', label: 'Email', desc: 'Formal / External' },
                  { id: 'document', label: 'RFC Document', desc: 'Complex / Asynchronous' },
                  { id: 'meeting', label: 'Meeting', desc: 'Urgent sync / War room' },
                ] as const
              ).map((ch) => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => handleSelectChannel(ch.id)}
                  disabled={submitted}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedChannel === ch.id
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-background border-border text-text-primary hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {getChannelIcon(ch.id)}
                    <span className="text-xs font-bold">{ch.label}</span>
                  </div>
                  <span
                    className={`text-[10px] block ${
                      selectedChannel === ch.id ? 'text-white/80' : 'text-text-secondary'
                    }`}
                  >
                    {ch.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Draft text area */}
          {selectedChannel && !submitted && (
            <div className="space-y-3">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Draft Message in Selected Channel Format ({selectedChannel.toUpperCase()})
              </label>
              <textarea
                rows={3}
                value={userDraft}
                onChange={(e) => setUserDraft(e.target.value)}
                placeholder="Type your draft message here..."
                className="w-full p-4 bg-background border border-border rounded-xl text-text-primary placeholder:text-text-tertiary text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
                >
                  Check Decision & Draft
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Result view */}
          {submitted && (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  selectedChannel === matrixItem.recommendedChannel
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  {selectedChannel === matrixItem.recommendedChannel ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                  Recommended: {matrixItem.recommendedChannel.toUpperCase()}
                </div>
                <span className="text-xs">{matrixItem.rationale}</span>
              </div>

              <div className="p-4 bg-background rounded-xl border border-border text-xs space-y-1">
                <span className="font-bold text-text-secondary uppercase tracking-wider block text-[10px]">
                  Model Benchmark Message ({matrixItem.recommendedChannel.toUpperCase()})
                </span>
                <p className="text-text-primary leading-relaxed italic">
                  "{matrixItem.exampleDraft}"
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-hover transition-colors flex items-center gap-1.5"
                >
                  Next Scenario <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
