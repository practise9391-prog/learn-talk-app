import React, { useState } from 'react';
import {
  X,
  AlertOctagon,
  Sparkles,
  ShieldAlert,
  Clock,
  Radio,
  Copy,
  CheckCircle2,
} from 'lucide-react';
import { useProLab } from '../../context/ProLabContext';
import { DictationMicButton } from './DictationMicButton';
import { IncidentEvaluationResult } from '../../services/proLabService';

interface IncidentCommunicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IncidentCommunicationModal: React.FC<IncidentCommunicationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { incidentCases, evaluateIncident } = useProLab();
  const currentIncident = incidentCases[0];

  const [broadcastDraft, setBroadcastDraft] = useState('');
  const [evaluation, setEvaluation] = useState<IncidentEvaluationResult | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleEvaluate = () => {
    if (!broadcastDraft.trim()) return;
    const res = evaluateIncident(currentIncident.id, broadcastDraft);
    setEvaluation(res);
  };

  const handleCopyModel = () => {
    navigator.clipboard.writeText(currentIncident.modelBroadcastMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[92vh] bg-surface rounded-3xl border border-border shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-card/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center">
              <AlertOctagon size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-red-500/10 text-red-500 px-2.5 py-0.5 rounded-full">
                  Incident & Crisis Lab
                </span>
                <span className="text-[10px] font-bold text-red-600 bg-red-500/10 px-2 py-0.5 rounded-full">
                  {currentIncident.severity}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-text">
                {currentIncident.title}
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
          {/* Diagnostic Facts Split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
              <span className="text-xs font-bold text-emerald-600 uppercase flex items-center gap-1.5">
                <CheckCircle2 size={14} />
                <span>Verified Facts (What We Know)</span>
              </span>
              <ul className="text-xs text-text-muted space-y-1 list-disc list-inside leading-relaxed">
                {currentIncident.factsKnown.map((fact, i) => (
                  <li key={i}>{fact}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
              <span className="text-xs font-bold text-amber-500 uppercase flex items-center gap-1.5">
                <Clock size={14} />
                <span>Under Active Investigation</span>
              </span>
              <ul className="text-xs text-text-muted space-y-1 list-disc list-inside leading-relaxed">
                {currentIncident.factsUnderInvestigation.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Current Mitigation & Impact */}
          <div className="p-4 rounded-2xl bg-surface border border-border space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-text">Customer Impact: {currentIncident.impactSummary}</span>
            </div>
            <div className="text-text-muted">
              Current Engineering Action: {currentIncident.currentMitigation}
            </div>
          </div>

          {/* Pitfalls to Avoid */}
          <div className="p-3.5 rounded-xl bg-red-500/5 border border-red-500/20 text-xs space-y-1">
            <span className="font-bold text-red-600 block">Critical Communication Pitfalls to Avoid:</span>
            <ul className="text-text-muted text-[11px] space-y-1 list-disc list-inside">
              {currentIncident.pitfallsToAvoid.map((pitfall, i) => (
                <li key={i}>{pitfall}</li>
              ))}
            </ul>
          </div>

          {/* Broadcast Composer */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-text">
                Your Incident Update Broadcast (Facts → Impact → Action → Next Update):
              </label>
              <DictationMicButton
                onTranscript={(t: string) => setBroadcastDraft((prev) => (prev ? `${prev} ${t}` : t))}
              />
            </div>

            <textarea
              value={broadcastDraft}
              onChange={(e) => setBroadcastDraft(e.target.value)}
              placeholder="**[INCIDENT UPDATE]**\n- Impact: ...\n- What We Know: ...\n- What We Are Investigating: ...\n- Next Update: 15:00 UTC"
              rows={5}
              className="w-full p-4 rounded-2xl bg-card border border-border text-xs text-text font-mono placeholder:text-text-muted/60 focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none leading-relaxed"
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleEvaluate}
                disabled={!broadcastDraft.trim()}
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity shadow-xs"
              >
                <Radio size={14} />
                <span>Evaluate Broadcast Message</span>
              </button>
            </div>
          </div>

          {/* Evaluation Results */}
          {evaluation && (
            <div className="p-5 rounded-2xl bg-card border border-primary/30 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-text">Crisis Communication Integrity</span>
                <span className="font-mono font-black text-sm text-primary px-2.5 py-0.5 rounded bg-primary/10">
                  {evaluation.score}%
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div
                  className={`p-2 rounded-xl border ${
                    evaluation.hasFacts ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600' : 'bg-surface border-border text-text-muted'
                  }`}
                >
                  Facts Checked
                </div>
                <div
                  className={`p-2 rounded-xl border ${
                    evaluation.hasImpact ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600' : 'bg-surface border-border text-text-muted'
                  }`}
                >
                  Impact Stated
                </div>
                <div
                  className={`p-2 rounded-xl border ${
                    evaluation.hasInvestigation ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600' : 'bg-surface border-border text-text-muted'
                  }`}
                >
                  Investigation Scope
                </div>
                <div
                  className={`p-2 rounded-xl border ${
                    evaluation.hasNextUpdate ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600' : 'bg-surface border-border text-text-muted'
                  }`}
                >
                  Next Timestamp
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <span className="font-bold text-text">Diagnostic Feedback:</span>
                <ul className="text-text-muted list-disc list-inside space-y-1">
                  {evaluation.feedback.map((fb, i) => (
                    <li key={i}>{fb}</li>
                  ))}
                </ul>
              </div>

              {/* Model broadcast */}
              <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-text">
                  <span>Golden Model Incident Broadcast:</span>
                  <button
                    type="button"
                    onClick={handleCopyModel}
                    className="text-primary hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <Copy size={12} />
                    <span>{copied ? 'Copied' : 'Copy Template'}</span>
                  </button>
                </div>
                <div className="text-xs text-text-muted whitespace-pre-line leading-relaxed font-mono bg-card p-3 rounded-xl border border-border/40">
                  {currentIncident.modelBroadcastMessage}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
