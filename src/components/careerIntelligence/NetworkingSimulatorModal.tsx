import React, { useState } from 'react';
import {
  X,
  Users2,
  Sparkles,
  CheckCircle2,
  Copy,
  Coffee,
  Linkedin,
} from 'lucide-react';
import { useCareerIntelligence } from '../../context/CareerIntelligenceContext';
import { DictationMicButton } from '../proLab/DictationMicButton';

interface NetworkingSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NetworkingSimulatorModal: React.FC<NetworkingSimulatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { networkingCases, evaluateNetworkingOutreach } = useCareerIntelligence();

  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
  const [userText, setUserText] = useState('');
  const [evaluation, setEvaluation] = useState<{
    score: number;
    feedback: string[];
    strengths: string[];
  } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentCase = networkingCases[selectedCaseIndex] || networkingCases[0];

  const handleEvaluate = () => {
    if (!userText.trim()) return;
    const res = evaluateNetworkingOutreach(currentCase, userText);
    setEvaluation(res);
  };

  const handleCopyModel = () => {
    navigator.clipboard.writeText(currentCase.modelMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[92vh] bg-surface rounded-3xl border border-border shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-card/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Users2 size={20} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 px-2.5 py-0.5 rounded-full">
                Networking & LinkedIn Simulator
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
          {/* Situation Card */}
          <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <div>
                <span className="text-xs font-bold text-text">{currentCase.persona.name}</span>
                <span className="text-[11px] text-text-muted block">
                  {currentCase.persona.title} • {currentCase.persona.organization}
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface border border-border text-text-muted uppercase">
                {currentCase.contextType.replace('_', ' ')}
              </span>
            </div>

            <p className="text-xs text-text-muted leading-relaxed">
              {currentCase.situationPrompt}
            </p>

            <div className="space-y-1 pt-1">
              <span className="text-[10px] font-bold text-text-muted uppercase block">
                Recommended 4-Part Structure:
              </span>
              <ul className="text-xs text-text-muted space-y-1 list-disc list-inside">
                {currentCase.recommendedStructure.map((st, i) => (
                  <li key={i}>{st}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Composer */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-text">Your Spoken / Written Outreach:</label>
              <DictationMicButton
                onTranscript={(t: string) => setUserText((prev) => (prev ? `${prev} ${t}` : t))}
              />
            </div>

            <textarea
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              placeholder="Draft your introduction or message..."
              rows={5}
              className="w-full p-4 rounded-2xl bg-card border border-border text-xs text-text placeholder:text-text-muted/60 focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none leading-relaxed"
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleEvaluate}
                disabled={!userText.trim()}
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity shadow-xs"
              >
                <Sparkles size={14} />
                <span>Evaluate Outreach Message</span>
              </button>
            </div>
          </div>

          {/* Evaluation Results */}
          {evaluation && (
            <div className="p-5 rounded-2xl bg-card border border-primary/30 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-text">Networking Impact Score</span>
                <span className="font-mono font-black text-sm text-primary px-2.5 py-0.5 rounded bg-primary/10">
                  {evaluation.score}%
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <span className="font-bold text-text">Feedback:</span>
                <ul className="text-text-muted list-disc list-inside space-y-1">
                  {evaluation.strengths.map((str, i) => (
                    <li key={`s_${i}`} className="text-emerald-600">✓ {str}</li>
                  ))}
                  {evaluation.feedback.map((fb, i) => (
                    <li key={`f_${i}`}>{fb}</li>
                  ))}
                </ul>
              </div>

              {/* Model Message */}
              <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-text">
                  <span>Professional Model Script:</span>
                  <button
                    type="button"
                    onClick={handleCopyModel}
                    className="text-primary hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <Copy size={12} />
                    <span>{copied ? 'Copied' : 'Copy Template'}</span>
                  </button>
                </div>
                <p className="text-xs text-text-muted whitespace-pre-line leading-relaxed font-sans bg-card p-3 rounded-xl border border-border/40">
                  {currentCase.modelMessage}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
