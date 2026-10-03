import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Bookmark,
  Clock,
  UserCheck,
  Mic,
  MicOff,
  Lightbulb,
  ArrowRight,
  User,
} from 'lucide-react';
import {
  PROFESSIONAL_INTRO_TEMPLATES,
  TELL_ME_ABOUT_YOURSELF_GUIDES,
} from '../../data/careerData';
import {
  ProfessionalIntroTemplate,
  TellMeAboutYourselfGuide,
  IntroDuration,
  CandidateArchetype,
} from '../../types/career';
import { useCareer } from '../../context/CareerContext';

interface SelfIntroductionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SelfIntroductionModal: React.FC<SelfIntroductionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { savePortfolioItem } = useCareer();
  const [activeTab, setActiveTab] = useState<'duration' | 'archetype'>('duration');

  // Duration State
  const [selectedDuration, setSelectedDuration] = useState<IntroDuration>('60s');
  const [activeTemplate, setActiveTemplate] = useState<ProfessionalIntroTemplate>(
    PROFESSIONAL_INTRO_TEMPLATES.find((t) => t.duration === '60s') || PROFESSIONAL_INTRO_TEMPLATES[0]
  );

  // Archetype State
  const [selectedArchetype, setSelectedArchetype] = useState<CandidateArchetype>('technical');
  const [activeGuide, setActiveGuide] = useState<TellMeAboutYourselfGuide>(
    TELL_ME_ABOUT_YOURSELF_GUIDES.find((g) => g.archetype === 'technical') ||
      TELL_ME_ABOUT_YOURSELF_GUIDES[0]
  );

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Practice state
  const [practiceAnswer, setPracticeAnswer] = useState('');
  const [practiceTime, setPracticeTime] = useState(0);
  const [isTiming, setIsTiming] = useState(false);

  if (!isOpen) return null;

  const currentScript =
    activeTab === 'duration' ? activeTemplate.modelScript : activeGuide.modelAnswer;

  const handlePlayAudio = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentScript);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToPortfolio = () => {
    savePortfolioItem({
      itemType: 'self_intro',
      title:
        activeTab === 'duration'
          ? `Self-Intro (${activeTemplate.duration}): ${activeTemplate.title}`
          : `"Tell Me About Yourself" (${activeGuide.label})`,
      content: currentScript,
      tags: ['Self-Introduction', activeTab === 'duration' ? activeTemplate.duration : activeGuide.archetype],
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl bg-card border border-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <UserCheck size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-text">Self-Introduction & "Tell Me About Yourself" Studio</h2>
              <p className="text-xs text-text-muted">
                Master 15s to 2min elevator pitches and archetype-specific conversational openers
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
          {/* Studio Mode Tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-surface border border-border">
            <button
              type="button"
              onClick={() => {
                setActiveTab('duration');
                if (isPlayingAudio) window.speechSynthesis?.cancel();
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'duration'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              <Clock size={14} />
              <span>By Timing (15s, 30s, 60s, 2min)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('archetype');
                if (isPlayingAudio) window.speechSynthesis?.cancel();
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'archetype'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              <User size={14} />
              <span>By Candidate Archetype</span>
            </button>
          </div>

          {/* TAB 1: BY TIMING */}
          {activeTab === 'duration' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Duration Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PROFESSIONAL_INTRO_TEMPLATES.map((tmpl) => {
                  const isSelected = selectedDuration === tmpl.duration;
                  return (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => {
                        setSelectedDuration(tmpl.duration);
                        setActiveTemplate(tmpl);
                        if (isPlayingAudio) window.speechSynthesis?.cancel();
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-primary/10 border-primary shadow-xs ring-1 ring-primary/40'
                          : 'bg-surface border-border hover:border-primary/40'
                      }`}
                    >
                      <span className="font-mono font-black text-xs text-primary block">
                        ⏱ {tmpl.duration}
                      </span>
                      <span className="text-xs font-bold text-text block mt-0.5">{tmpl.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* Template Card */}
              <div className="p-6 rounded-3xl bg-surface border border-border space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                      Ideal Target Duration: {activeTemplate.duration}
                    </span>
                    <h3 className="text-base font-black text-text">{activeTemplate.title}</h3>
                    <p className="text-xs text-text-muted mt-0.5">{activeTemplate.tips[0] || `Target duration: ${activeTemplate.targetSeconds}s`}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePlayAudio}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                        isPlayingAudio
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-card border border-border text-text hover:bg-card/80'
                      }`}
                    >
                      {isPlayingAudio ? <VolumeX size={13} /> : <Volume2 size={13} />}
                      <span>{isPlayingAudio ? 'Stop' : 'Listen Native Model'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopy}
                      className="px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-bold text-text hover:bg-card/80 flex items-center gap-1.5 transition-colors"
                    >
                      {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveToPortfolio}
                      className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                    >
                      <Bookmark size={13} />
                      <span>{savedSuccess ? 'Saved!' : 'Save to Vault'}</span>
                    </button>
                  </div>
                </div>

                {/* Model Script Display */}
                <div className="p-5 rounded-2xl bg-card border border-border text-sm text-text leading-relaxed font-normal">
                  "{activeTemplate.modelScript}"
                </div>

                {/* Key Pillars */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                    Structure Steps:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeTemplate.structureSteps.map((p, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl bg-card border border-border text-xs font-bold text-text"
                      >
                        ✓ {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BY CANDIDATE ARCHETYPE */}
          {activeTab === 'archetype' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Archetype Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TELL_ME_ABOUT_YOURSELF_GUIDES.map((g) => {
                  const isSelected = selectedArchetype === g.archetype;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => {
                        setSelectedArchetype(g.archetype);
                        setActiveGuide(g);
                        if (isPlayingAudio) window.speechSynthesis?.cancel();
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-primary/10 border-primary shadow-xs ring-1 ring-primary/40'
                          : 'bg-surface border-border hover:border-primary/40'
                      }`}
                    >
                      <span className="text-[10px] font-black uppercase text-primary block">
                        {g.archetype.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-bold text-text block mt-0.5">{g.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Archetype Breakdown Card */}
              <div className="p-6 rounded-3xl bg-surface border border-border space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                      {activeGuide.archetype.replace('_', ' ')}
                    </span>
                    <h3 className="text-base font-black text-text">{activeGuide.label}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePlayAudio}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                        isPlayingAudio
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-card border border-border text-text hover:bg-card/80'
                      }`}
                    >
                      {isPlayingAudio ? <VolumeX size={13} /> : <Volume2 size={13} />}
                      <span>{isPlayingAudio ? 'Stop Voice' : 'Listen Native Model'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopy}
                      className="px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-bold text-text hover:bg-card/80 flex items-center gap-1.5 transition-colors"
                    >
                      {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveToPortfolio}
                      className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                    >
                      <Bookmark size={13} />
                      <span>{savedSuccess ? 'Saved!' : 'Save to Vault'}</span>
                    </button>
                  </div>
                </div>

                {/* 3-Stage Blueprint */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-primary block">
                      Recommended Structure & Intent
                    </span>
                    <p className="text-xs text-text font-bold leading-relaxed">{activeGuide.recommendedStructure}</p>
                    <p className="text-xs text-text-muted">{activeGuide.interviewerIntent}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 block">
                      Key Highlights to Include
                    </span>
                    <ul className="space-y-1 text-xs text-text">
                      {activeGuide.whatToInclude.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Complete Script */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                    Full Mastered Spoken Script:
                  </span>
                  <div className="p-5 rounded-2xl bg-card border border-border text-sm text-text leading-relaxed font-normal whitespace-pre-line">
                    "{activeGuide.modelAnswer}"
                  </div>
                </div>

                {/* Common Pitfall Warning */}
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-700 dark:text-rose-400 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold">
                    <Lightbulb size={16} />
                    <span>Avoid Weak Framing:</span>
                  </div>
                  <p className="italic">"{activeGuide.weakAnswerExample}"</p>
                  <p className="font-medium text-[11px] text-text-muted">
                    <span className="font-bold text-text">Why this hurts:</span> {activeGuide.weaknessExplanation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-surface/30 flex items-center justify-between">
          <span className="text-xs text-text-muted">
            The secret of "Tell me about yourself": It is not your autobiography; it is your pitch for this specific role.
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
