import React, { useState } from 'react';
import {
  X,
  TrendingDown,
  Sparkles,
  Layers,
  CheckCircle2,
  FileText,
  Copy,
} from 'lucide-react';
import { useProLab } from '../../context/ProLabContext';
import { DictationMicButton } from './DictationMicButton';

interface BusinessCaseLabModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BusinessCaseLabModal: React.FC<BusinessCaseLabModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { businessCases } = useProLab();
  const currentCase = businessCases[0];

  const [userRecommendation, setUserRecommendation] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleEvaluate = () => {
    if (!userRecommendation.trim()) return;
    const wordCount = userRecommendation.split(/\s+/).filter(Boolean).length;
    if (wordCount < 40) {
      setFeedback('Expand your strategic analysis to include specific implementation phases and risk mitigation.');
    } else {
      setFeedback(
        'Comprehensive business recommendation! You effectively connected root cause telemetry to actionable developer-experience solutions.'
      );
    }
  };

  const handleCopyModel = () => {
    navigator.clipboard.writeText(currentCase.modelRecommendationSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[92vh] bg-surface rounded-3xl border border-border shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-card/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <TrendingDown size={20} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-500 px-2.5 py-0.5 rounded-full">
                Business Case Lab
              </span>
              <h2 className="text-base sm:text-lg font-black text-text">
                {currentCase.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-card transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Company Context & Symptom */}
          <div className="p-4 rounded-2xl bg-card border border-border space-y-2 text-xs">
            <div className="font-bold text-text">Background Context:</div>
            <p className="text-text-muted leading-relaxed">{currentCase.companyContext}</p>
            <div className="p-3 rounded-xl bg-surface border border-border/60 text-text">
              <span className="font-bold text-amber-500">Core Symptom: </span>
              {currentCase.symptom}
            </div>
          </div>

          {/* Key Data Points */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-text uppercase tracking-wider block">
              Observed Data Points & Telemetry:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {currentCase.dataPoints.map((dp, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-card border border-border text-xs text-text-muted leading-relaxed">
                  {dp}
                </div>
              ))}
            </div>
          </div>

          {/* Core Question */}
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 text-xs space-y-1">
            <span className="font-bold text-primary block">Strategic Question:</span>
            <p className="text-text font-medium leading-relaxed">{currentCase.coreProblemQuestion}</p>
          </div>

          {/* Recommendation Composer */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-text">
                Your Strategic Recommendation Presentation:
              </label>
              <DictationMicButton
                onTranscript={(t: string) => setUserRecommendation((prev) => (prev ? `${prev} ${t}` : t))}
              />
            </div>

            <textarea
              value={userRecommendation}
              onChange={(e) => setUserRecommendation(e.target.value)}
              placeholder="Structure your proposal: 1. Root Cause, 2. Recommended Solution, 3. Phased Rollout, 4. Target Outcome Metrics..."
              rows={5}
              className="w-full p-4 rounded-2xl bg-card border border-border text-xs text-text placeholder:text-text-muted/60 focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none leading-relaxed"
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleEvaluate}
                disabled={!userRecommendation.trim()}
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity shadow-xs"
              >
                <Sparkles size={14} />
                <span>Evaluate Strategic Case</span>
              </button>
            </div>
          </div>

          {feedback && (
            <div className="p-5 rounded-2xl bg-card border border-primary/30 space-y-3 animate-fadeIn">
              <span className="text-xs font-black text-text block">Evaluation Feedback:</span>
              <p className="text-xs text-text-muted leading-relaxed">{feedback}</p>

              <div className="p-4 rounded-xl bg-surface border border-border space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-text">
                  <span>Executive Model Recommendation:</span>
                  <button
                    type="button"
                    onClick={handleCopyModel}
                    className="text-primary hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <Copy size={12} />
                    <span>{copied ? 'Copied' : 'Copy Summary'}</span>
                  </button>
                </div>
                <p className="text-text-muted leading-relaxed">
                  {currentCase.modelRecommendationSummary}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
