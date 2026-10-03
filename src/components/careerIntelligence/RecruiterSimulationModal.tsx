import React, { useState } from 'react';
import {
  X,
  PhoneCall,
  Volume2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  ArrowRight,
  User,
  Building,
} from 'lucide-react';
import { useCareerIntelligence } from '../../context/CareerIntelligenceContext';
import { RecruiterSimulationCase } from '../../types/careerIntelligence';
import { DictationMicButton } from '../proLab/DictationMicButton';

interface RecruiterSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RecruiterSimulationModal: React.FC<RecruiterSimulationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { recruiterCases, evaluateRecruiterScreening } = useCareerIntelligence();

  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
  const [candidateResponse, setCandidateResponse] = useState('');
  const [evaluation, setEvaluation] = useState<{
    score: number;
    toneScore: number;
    clarityScore: number;
    feedback: string[];
    strengths: string[];
  } | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentCase = recruiterCases[selectedCaseIndex] || recruiterCases[0];

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleEvaluate = () => {
    if (!candidateResponse.trim()) return;
    const res = evaluateRecruiterScreening(currentCase, candidateResponse);
    setEvaluation(res);
  };

  const handleCopyModel = () => {
    navigator.clipboard.writeText(currentCase.modelResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[92vh] bg-surface rounded-3xl border border-border shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-card/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <PhoneCall size={20} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                Recruiter Communication Simulator
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
          {/* Recruiter Card */}
          <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-indigo-500/20 text-indigo-500 font-black text-xs flex items-center justify-center">
                  {currentCase.recruiterName.charAt(0)}
                </div>
                <div>
                  <span className="text-xs font-bold text-text block">
                    {currentCase.recruiterName}
                  </span>
                  <span className="text-[10px] text-text-muted block">
                    {currentCase.recruiterCompany}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSpeak(currentCase.recruiterOpeningMessage)}
                className="px-3 py-1.5 rounded-xl border border-border text-xs font-bold text-primary hover:bg-surface flex items-center gap-1.5 transition-colors"
              >
                <Volume2 size={13} />
                <span>Play Recruiter Voice</span>
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-surface border border-border/60 text-xs text-text leading-relaxed font-medium">
              "{currentCase.recruiterOpeningMessage}"
            </div>

            <div className="flex flex-wrap gap-2 text-[10px] text-text-muted pt-1">
              {currentCase.guidingTips.map((tip, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-md bg-card border border-border">
                  💡 {tip}
                </span>
              ))}
            </div>
          </div>

          {/* Response Composer */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-text">
                Your Spoken / Written Response to {currentCase.recruiterName}:
              </label>
              <DictationMicButton
                onTranscript={(t: string) =>
                  setCandidateResponse((prev) => (prev ? `${prev} ${t}` : t))
                }
              />
            </div>

            <textarea
              value={candidateResponse}
              onChange={(e) => setCandidateResponse(e.target.value)}
              placeholder="State your appreciation, salary expectations range, and notice period timeline..."
              rows={5}
              className="w-full p-4 rounded-2xl bg-card border border-border text-xs text-text placeholder:text-text-muted/60 focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none leading-relaxed"
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleEvaluate}
                disabled={!candidateResponse.trim()}
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity shadow-xs"
              >
                <Sparkles size={14} />
                <span>Evaluate Recruiter Response</span>
              </button>
            </div>
          </div>

          {/* Evaluation Results */}
          {evaluation && (
            <div className="p-5 rounded-2xl bg-card border border-primary/30 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-text">Evaluation Score</span>
                  <span className="font-mono font-black text-sm text-primary px-2.5 py-0.5 rounded bg-primary/10">
                    {evaluation.score}%
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span>Tone: <b>{evaluation.toneScore}%</b></span>
                  <span>Clarity: <b>{evaluation.clarityScore}%</b></span>
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
                    Feedback & Refinements:
                  </span>
                  <ul className="text-text-muted space-y-1 list-disc list-inside">
                    {evaluation.feedback.length > 0 ? (
                      evaluation.feedback.map((fb, i) => <li key={i}>{fb}</li>)
                    ) : (
                      <li>Clean negotiation phrasing and polite, clear timeline.</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Model Response */}
              <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-text">
                  <span>Native Candidate Model Script:</span>
                  <button
                    type="button"
                    onClick={handleCopyModel}
                    className="text-primary hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <Copy size={12} />
                    <span>{copied ? 'Copied' : 'Copy Response'}</span>
                  </button>
                </div>
                <p className="text-xs text-text-muted italic leading-relaxed">
                  "{currentCase.modelResponse}"
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
