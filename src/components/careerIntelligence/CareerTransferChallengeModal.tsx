import React, { useState } from 'react';
import {
  X,
  Share2,
  Users,
  Terminal,
  Briefcase,
  Building,
  GraduationCap,
  Sparkles,
  Volume2,
  Copy,
} from 'lucide-react';
import { useCareerIntelligence } from '../../context/CareerIntelligenceContext';
import { DictationMicButton } from '../proLab/DictationMicButton';

interface CareerTransferChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CareerTransferChallengeModal: React.FC<CareerTransferChallengeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { transferChallenges } = useCareerIntelligence();
  const currentChallenge = transferChallenges[0];

  const [selectedAudienceIdx, setSelectedAudienceIdx] = useState(0);
  const [userDraft, setUserDraft] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentAudience = currentChallenge.audiences[selectedAudienceIdx];

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
    if (!userDraft.trim()) return;
    const words = userDraft.split(/\s+/).filter(Boolean).length;
    if (words < 20) {
      setFeedback('A bit brief for this audience. Make sure to tailor your vocabulary to their primary priority.');
    } else {
      setFeedback(
        `Strong audience calibration! Your explanation effectively prioritized the concerns of the ${currentAudience.audienceLabel}.`
      );
    }
  };

  const handleCopyModel = () => {
    navigator.clipboard.writeText(currentAudience.modelExplanation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getIcon = (audience: string) => {
    switch (audience) {
      case 'technical_interviewer':
        return <Terminal size={16} />;
      case 'business_manager':
        return <Briefcase size={16} />;
      case 'enterprise_client':
        return <Building size={16} />;
      default:
        return <GraduationCap size={16} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[92vh] bg-surface rounded-3xl border border-border shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-card/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Share2 size={20} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 px-2.5 py-0.5 rounded-full">
                Career Transfer Challenge
              </span>
              <h2 className="text-base sm:text-lg font-black text-text">
                {currentChallenge.topicTitle}
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

        {/* 4 Audience Tabs */}
        <div className="px-6 py-2.5 bg-surface-elevated/70 border-b border-border flex items-center gap-2 overflow-x-auto">
          {currentChallenge.audiences.map((aud, idx) => (
            <button
              key={aud.targetAudience}
              type="button"
              onClick={() => {
                setSelectedAudienceIdx(idx);
                setFeedback(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                selectedAudienceIdx === idx
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-card border border-border text-text-muted hover:text-text'
              }`}
            >
              {getIcon(aud.targetAudience)}
              <span>{aud.audienceLabel}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Audience Focus Card */}
          <div className="p-4 rounded-2xl bg-card border border-border space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-text">
                Target Stakeholder: {currentAudience.audienceLabel}
              </span>
              <span className="text-[10px] uppercase font-bold text-primary">Core Expectation</span>
            </div>
            <p className="text-text-muted leading-relaxed">
              Focus Need: <b>{currentAudience.focusNeed}</b>
            </p>
          </div>

          {/* Model Explanation Card */}
          <div className="p-4 rounded-2xl bg-surface border border-border space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-text">
              <span>Audience-Calibrated Model Phrasing:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSpeak(currentAudience.modelExplanation)}
                  className="text-primary hover:underline flex items-center gap-1 text-[11px]"
                >
                  <Volume2 size={12} />
                  <span>{isSpeaking ? 'Pause' : 'Listen'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyModel}
                  className="text-primary hover:underline flex items-center gap-1 text-[11px]"
                >
                  <Copy size={12} />
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
            <p className="text-xs text-text-muted italic leading-relaxed">
              "{currentAudience.modelExplanation}"
            </p>
          </div>

          {/* Practice Area */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-text">
                Dictate or Write Your Version for this Stakeholder:
              </label>
              <DictationMicButton
                onTranscript={(t: string) => setUserDraft((prev) => (prev ? `${prev} ${t}` : t))}
              />
            </div>

            <textarea
              value={userDraft}
              onChange={(e) => setUserDraft(e.target.value)}
              placeholder={`Explain ${currentChallenge.topicTitle} to a ${currentAudience.audienceLabel}...`}
              rows={4}
              className="w-full p-4 rounded-2xl bg-card border border-border text-xs text-text placeholder:text-text-muted/60 focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none leading-relaxed"
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleEvaluate}
                disabled={!userDraft.trim()}
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity shadow-xs"
              >
                <Sparkles size={14} />
                <span>Evaluate Transfer Calibration</span>
              </button>
            </div>
          </div>

          {feedback && (
            <div className="p-4 rounded-2xl bg-card border border-primary/30 text-xs text-text space-y-1 animate-fadeIn">
              <span className="font-bold text-primary block">Calibration Feedback:</span>
              <p className="text-text-muted leading-relaxed">{feedback}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
