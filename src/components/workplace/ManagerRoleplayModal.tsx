import React, { useState } from 'react';
import {
  X,
  Briefcase,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Mic,
  MicOff,
  UserCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useWorkplaceCommunication } from '../../context/WorkplaceCommunicationContext';
import { ManagerScenario } from '../../types/workplace';
import { ManagerEvaluationResult } from '../../services/workplaceCommunicationService';

interface ManagerRoleplayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManagerRoleplayModal: React.FC<ManagerRoleplayModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { managerScenarios, evaluateManagerDraft } = useWorkplaceCommunication();

  const [activeScenario, setActiveScenario] = useState<ManagerScenario>(managerScenarios[0]);
  const [userResponse, setUserResponse] = useState('');
  const [evaluation, setEvaluation] = useState<ManagerEvaluationResult | null>(null);
  const [isSpeakingPrompt, setIsSpeakingPrompt] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showFramework, setShowFramework] = useState(false);

  if (!isOpen) return null;

  const handlePlayPrompt = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeakingPrompt) {
      window.speechSynthesis.cancel();
      setIsSpeakingPrompt(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(activeScenario.managerOpeningPrompt);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeakingPrompt(false);
    utterance.onerror = () => setIsSpeakingPrompt(false);
    setIsSpeakingPrompt(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleEvaluate = () => {
    if (!userResponse.trim()) return;
    const result = evaluateManagerDraft(activeScenario.id, userResponse);
    setEvaluation(result);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-card border border-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Briefcase size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-text">Manager Communication & Sync Simulator</h2>
              <p className="text-xs text-text-muted">
                Practice upward reporting, respectful disagreement, admitting mistakes, and managing workload with diverse manager personas
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (isSpeakingPrompt) window.speechSynthesis?.cancel();
              onClose();
            }}
            className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Scenario Selector Pills */}
          <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-surface border border-border">
            <span className="text-xs font-bold text-text-muted mr-1">Topic:</span>
            {managerScenarios.map((sc) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => {
                  setActiveScenario(sc);
                  setEvaluation(null);
                  setUserResponse('');
                  if (isSpeakingPrompt) window.speechSynthesis?.cancel();
                }}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeScenario.id === sc.id
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-card hover:bg-border text-text'
                }`}
              >
                {sc.title.split(':')[0]}
              </button>
            ))}
          </div>

          {/* Manager Prompter Card */}
          <div className="p-6 rounded-3xl bg-surface border border-border space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-black text-base shrink-0">
                  {activeScenario.managerPersona.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-text">{activeScenario.managerPersona.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-card border border-border text-text-muted uppercase">
                      Style: {activeScenario.managerPersona.style.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-xs text-text-muted block">{activeScenario.managerPersona.role}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePlayPrompt}
                className={`p-2.5 rounded-xl border transition-colors shrink-0 ${
                  isSpeakingPrompt
                    ? 'bg-rose-500 text-white border-rose-500 animate-pulse'
                    : 'bg-card border-border text-text hover:text-primary'
                }`}
                title="Listen to manager"
              >
                {isSpeakingPrompt ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </div>

            {/* Manager Question */}
            <div className="p-4 rounded-2xl bg-card border border-border text-sm text-text font-medium leading-relaxed">
              {activeScenario.managerOpeningPrompt}
            </div>

            {/* Context & Framework Guidance */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">
                  <span className="font-bold text-text">Context:</span> {activeScenario.context}
                </span>
                <button
                  type="button"
                  onClick={() => setShowFramework(!showFramework)}
                  className="font-bold text-primary hover:underline flex items-center gap-1 shrink-0 ml-2"
                >
                  <span>{showFramework ? 'Hide Framework' : 'Show Framework'}</span>
                  <ChevronRight size={13} className={showFramework ? 'rotate-90' : ''} />
                </button>
              </div>

              {showFramework && (
                <div className="p-4 rounded-2xl bg-card border border-primary/20 space-y-2 animate-fadeIn text-xs">
                  <div className="font-bold text-primary">
                    Recommended Framework: {activeScenario.recommendedFramework}
                  </div>
                  <ul className="space-y-1 text-text">
                    {activeScenario.keyPrinciples.map((kp, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{kp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* User Response Form */}
          <div className="p-5 rounded-3xl bg-surface border border-primary/30 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-text-muted">
                Your Spoken / Written Upward Response
              </label>
              <button
                type="button"
                onClick={() => setIsRecording(!isRecording)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  isRecording
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-card border border-border text-text hover:bg-card/80'
                }`}
              >
                {isRecording ? <MicOff size={13} /> : <Mic size={13} />}
                <span>{isRecording ? 'Listening...' : 'Voice Dictate'}</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              placeholder="State your answer directly: acknowledge commitments, explain blockers with data, present concrete options, and ask for directional approval..."
              className="w-full p-4 rounded-2xl bg-card border border-border text-xs sm:text-sm text-text placeholder:text-text-muted/60 focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none"
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleEvaluate}
                disabled={!userResponse.trim()}
                className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity shadow-xs"
              >
                <Sparkles size={14} />
                <span>Evaluate Manager Upward Sync</span>
              </button>
            </div>
          </div>

          {/* Evaluation Card */}
          {evaluation && (
            <div className="p-5 rounded-3xl bg-card border border-border space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-text">Manager Communication Score:</span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-primary/10 text-primary font-mono font-black text-sm">
                    {evaluation.overallScore}%
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span>Directness: <b>{evaluation.directnessScore}%</b></span>
                  <span>Solution Focus: <b>{evaluation.solutionFocusScore}%</b></span>
                  <span>Professionalism: <b>{evaluation.professionalismScore}%</b></span>
                </div>
              </div>

              <p className="text-xs text-text font-medium">{evaluation.feedbackSummary}</p>

              {/* Model Alternative */}
              <div className="p-4 rounded-2xl bg-surface border border-border space-y-1.5">
                <span className="text-[11px] font-black uppercase text-primary block">
                  Senior Staff / Lead Formulation:
                </span>
                <p className="text-xs sm:text-sm text-text leading-relaxed">
                  "{evaluation.betterAlternative}"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-surface/30 flex items-center justify-between">
          <span className="text-xs text-text-muted">
            Rule of thumb: Never bring a problem to leadership without at least two structured options.
          </span>
          <button
            type="button"
            onClick={() => {
              if (isSpeakingPrompt) window.speechSynthesis?.cancel();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-text hover:bg-card transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
