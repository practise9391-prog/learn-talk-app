import React, { useState } from 'react';
import {
  X,
  Mail,
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Clock,
  User,
  RotateCcw,
} from 'lucide-react';
import { useProLab } from '../../context/ProLabContext';
import { DictationMicButton } from './DictationMicButton';
import { EmailEvaluationResult } from '../../types/proLab';

interface EmailThreadLabModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmailThreadLabModal: React.FC<EmailThreadLabModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { emailCases, evaluateEmailReply } = useProLab();
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
  const [userReply, setUserReply] = useState('');
  const [evaluation, setEvaluation] = useState<EmailEvaluationResult | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentCase = emailCases[selectedCaseIndex] || emailCases[0];

  const handleEvaluate = () => {
    if (!userReply.trim()) return;
    const res = evaluateEmailReply(currentCase.id, userReply);
    setEvaluation(res);
  };

  const handleCopyModel = () => {
    navigator.clipboard.writeText(currentCase.modelReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[92vh] bg-surface rounded-3xl border border-border shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-card/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Mail size={20} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-500 px-2.5 py-0.5 rounded-full">
                Professional Email Lab
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Thread Card (Incoming Email) */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
              Incoming Email Thread:
            </span>
            {currentCase.initialThread.map((msg) => (
              <div
                key={msg.id}
                className="p-5 rounded-2xl bg-card border border-border space-y-3 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs border-b border-border/60 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-text">{msg.sender}</span>
                    <span className="text-text-muted text-[11px]">&lt;{msg.senderEmail}&gt;</span>
                  </div>
                  <span className="text-text-muted text-[11px]">{msg.timestamp}</span>
                </div>

                <div className="text-xs font-bold text-text">Subject: {msg.subject}</div>

                <div className="text-xs text-text-muted whitespace-pre-line leading-relaxed font-sans bg-surface/50 p-3 rounded-xl border border-border/50">
                  {msg.body}
                </div>
              </div>
            ))}
          </div>

          {/* Prompt / Task */}
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-1.5 text-xs">
            <span className="font-bold text-primary">Your Objective:</span>
            <p className="text-text-muted">{currentCase.learnerTask}</p>
            <div className="flex flex-wrap gap-2 pt-1 text-[10px] text-text-muted">
              {currentCase.keyRequirements.map((req, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-surface border border-border">
                  • {req}
                </span>
              ))}
            </div>
          </div>

          {/* Response Composer */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-text">
                Your Professional Reply Draft:
              </label>
              <DictationMicButton
                onTranscript={(t: string) => setUserReply((prev) => (prev ? `${prev} ${t}` : t))}
              />
            </div>

            <textarea
              value={userReply}
              onChange={(e) => setUserReply(e.target.value)}
              placeholder="Hi Marcus,\n\nThank you for reaching out..."
              rows={7}
              className="w-full p-4 rounded-2xl bg-card border border-border text-xs text-text font-mono placeholder:text-text-muted/60 focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none leading-relaxed"
            />

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-text-muted">
                Words: {userReply.trim() ? userReply.trim().split(/\s+/).length : 0}
              </span>

              <button
                type="button"
                onClick={handleEvaluate}
                disabled={!userReply.trim()}
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity shadow-xs"
              >
                <Sparkles size={14} />
                <span>Evaluate & Send Reply</span>
              </button>
            </div>
          </div>

          {/* Evaluation Results */}
          {evaluation && (
            <div className="p-5 rounded-2xl bg-card border border-primary/30 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-text">Email Evaluation</span>
                  <span className="font-mono font-black text-sm text-primary px-2.5 py-0.5 rounded bg-primary/10">
                    {evaluation.score}%
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[11px] text-text-muted">Tone Score:</span>
                  <span className="font-bold text-text">{evaluation.toneProfessionalism}%</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1.5">
                  <span className="font-bold text-emerald-600 block text-[11px] uppercase">
                    Strengths:
                  </span>
                  <ul className="text-text-muted space-y-1 list-disc list-inside">
                    {evaluation.strengths.map((str, i) => (
                      <li key={i}>{str}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1.5">
                  <span className="font-bold text-amber-500 block text-[11px] uppercase">
                    Refinements Needed:
                  </span>
                  <ul className="text-text-muted space-y-1 list-disc list-inside">
                    {evaluation.improvements.length > 0 ? (
                      evaluation.improvements.map((imp, i) => <li key={i}>{imp}</li>)
                    ) : (
                      <li>No critical flaws detected. Tone and commitments are clear!</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Native Model Email */}
              <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-text">
                  <span>Native Professional Model Email:</span>
                  <button
                    type="button"
                    onClick={handleCopyModel}
                    className="text-primary hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <Copy size={12} />
                    <span>{copied ? 'Copied' : 'Copy Template'}</span>
                  </button>
                </div>
                <div className="text-xs text-text-muted whitespace-pre-line leading-relaxed font-sans bg-card p-3 rounded-xl border border-border/40">
                  {currentCase.modelReply}
                </div>
              </div>

              {/* Simulated Client Follow-up */}
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1">
                <span className="font-bold text-emerald-600 block">
                  Simulated Stakeholder Follow-Up Response:
                </span>
                <p className="text-text leading-relaxed">
                  "{currentCase.simulatedFollowUpReply}"
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
