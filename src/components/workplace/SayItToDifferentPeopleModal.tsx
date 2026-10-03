import React, { useState } from 'react';
import {
  X,
  Users,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Mic,
  MicOff,
  ArrowRight,
  ShieldCheck,
  Building,
  UserCheck,
  Briefcase,
  Terminal,
} from 'lucide-react';
import { useWorkplaceCommunication } from '../../context/WorkplaceCommunicationContext';
import { AudienceType, AudienceAwareScenario } from '../../types/workplace';
import { AudienceEvaluationResult } from '../../services/workplaceCommunicationService';

interface SayItToDifferentPeopleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AUDIENCE_TABS: Array<{
  id: AudienceType;
  label: string;
  icon: any;
  color: string;
}> = [
  { id: 'teammate', label: '1. Teammate', icon: Users, color: 'text-sky-500 bg-sky-500/10' },
  { id: 'manager', label: '2. Manager', icon: Briefcase, color: 'text-indigo-500 bg-indigo-500/10' },
  { id: 'customer', label: '3. Customer / Client', icon: Building, color: 'text-emerald-500 bg-emerald-500/10' },
  { id: 'executive', label: '4. Executive / C-Suite', icon: ShieldCheck, color: 'text-amber-500 bg-amber-500/10' },
  { id: 'technical_expert', label: '5. Principal Architect', icon: Terminal, color: 'text-purple-500 bg-purple-500/10' },
];

export const SayItToDifferentPeopleModal: React.FC<SayItToDifferentPeopleModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { audienceScenarios, evaluateAudienceDraft } = useWorkplaceCommunication();

  const [activeScenario, setActiveScenario] = useState<AudienceAwareScenario>(audienceScenarios[0]);
  const [selectedAudience, setSelectedAudience] = useState<AudienceType>('manager');
  const [userInput, setUserInput] = useState('');
  const [evaluation, setEvaluation] = useState<AudienceEvaluationResult | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentProfile = activeScenario.audienceProfiles[selectedAudience];

  const handleEvaluate = () => {
    if (!userInput.trim()) return;
    const result = evaluateAudienceDraft(activeScenario.id, selectedAudience, userInput);
    setEvaluation(result);
  };

  const handlePlayModelAudio = () => {
    if (!('speechSynthesis' in window)) return;
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentProfile.modelPhrasing);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentProfile.modelPhrasing);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl bg-card border border-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <Users size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-text">“Say It to Different People” Studio</h2>
              <p className="text-xs text-text-muted">
                Frame the same high-stakes workplace reality appropriately for Teammates, Managers, Clients, and Executives
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (isPlayingAudio) window.speechSynthesis?.cancel();
              onClose();
            }}
            className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Scenario Selector & Situation Brief */}
          <div className="p-5 rounded-3xl bg-surface border border-border space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                Active Workplace Situation
              </span>
              <div className="flex items-center gap-1.5">
                {audienceScenarios.map((sc) => (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => {
                      setActiveScenario(sc);
                      setEvaluation(null);
                      setUserInput('');
                      if (isPlayingAudio) window.speechSynthesis?.cancel();
                    }}
                    className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all ${
                      activeScenario.id === sc.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card text-text-muted hover:text-text border border-border'
                    }`}
                  >
                    {sc.situationTitle.split(':')[0]}
                  </button>
                ))}
              </div>
            </div>

            <h3 className="text-base font-black text-text">{activeScenario.situationTitle}</h3>
            <p className="text-xs text-text-muted leading-relaxed">{activeScenario.situationContext}</p>

            <div className="flex flex-wrap gap-2 pt-1 border-t border-border/60">
              {activeScenario.coreFacts.map((fact, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-card border border-border text-[11px] text-text font-medium"
                >
                  • {fact}
                </span>
              ))}
            </div>
          </div>

          {/* 5 Audience Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {AUDIENCE_TABS.map((tab) => {
              const Icon = tab.icon;
              const isSelected = selectedAudience === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setSelectedAudience(tab.id);
                    setEvaluation(null);
                    if (isPlayingAudio) window.speechSynthesis?.cancel();
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                    isSelected
                      ? 'bg-primary/5 border-primary shadow-xs ring-1 ring-primary/40'
                      : 'bg-surface border-border hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${tab.color}`}>
                      <Icon size={14} />
                    </div>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <div>
                    <span className="text-xs font-black text-text block">{tab.label}</span>
                    <span className="text-[10px] text-text-muted block truncate">
                      {activeScenario.audienceProfiles[tab.id].roleTitle}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Audience Profile & Guidance Card */}
          <div className="p-4 rounded-2xl bg-surface border border-border grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <span className="text-[10px] font-black uppercase text-primary block">Priority Focus</span>
              <p className="text-xs text-text mt-0.5">{currentProfile.priorityFocus}</p>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-emerald-600 block">Tone Recommendation</span>
              <p className="text-xs text-text mt-0.5">{currentProfile.toneRecommendation}</p>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-rose-500 block">Critical Pitfall to Avoid</span>
              <p className="text-xs text-text mt-0.5">{currentProfile.keyPitfall}</p>
            </div>
          </div>

          {/* Practice Input Box */}
          <div className="p-5 rounded-3xl bg-surface border border-primary/30 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-text-muted">
                Your Tailored Spoken / Written Message to {currentProfile.roleTitle}
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
              rows={3}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={`Write or dictate how you explain this situation to your ${selectedAudience}...`}
              className="w-full p-4 rounded-2xl bg-card border border-border text-xs sm:text-sm text-text placeholder:text-text-muted/60 focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none"
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleEvaluate}
                disabled={!userInput.trim()}
                className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity shadow-xs"
              >
                <Sparkles size={14} />
                <span>Evaluate Audience Fit</span>
              </button>
            </div>
          </div>

          {/* AI Diagnostic Feedback */}
          {evaluation && (
            <div className="p-5 rounded-3xl bg-card border border-border space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-text">Audience Alignment Score:</span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-primary/10 text-primary font-mono font-black text-sm">
                    {evaluation.overallScore}%
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span>Clarity: <b>{evaluation.clarityScore}%</b></span>
                  <span>Tone: <b>{evaluation.toneScore}%</b></span>
                  <span>Relevance: <b>{evaluation.audienceRelevanceScore}%</b></span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-emerald-600 block">✓ Strengths Detected:</span>
                  <ul className="space-y-1 text-xs text-text">
                    {evaluation.detectedStrengths.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-amber-500 block">⚠ Priority Fixes:</span>
                  <ul className="space-y-1 text-xs text-text">
                    {evaluation.priorityFixes.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Master Model Answer */}
              <div className="p-4 rounded-2xl bg-surface border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase text-primary">
                    Master Executive / Audience-Tuned Formulation:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handlePlayModelAudio}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isPlayingAudio
                          ? 'bg-rose-500 text-white border-rose-500 animate-pulse'
                          : 'bg-card border-border text-text hover:text-primary'
                      }`}
                    >
                      {isPlayingAudio ? <VolumeX size={13} /> : <Volume2 size={13} />}
                    </button>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="p-1.5 rounded-lg bg-card border border-border text-text hover:text-primary"
                    >
                      {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-text leading-relaxed">
                  "{evaluation.suggestedAlternative}"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-surface/30 flex items-center justify-between">
          <span className="text-xs text-text-muted">
            The same truth must be translated across different cognitive filters and accountability needs.
          </span>
          <button
            type="button"
            onClick={() => {
              if (isPlayingAudio) window.speechSynthesis?.cancel();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-text hover:bg-card transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
