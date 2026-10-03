import React, { useState } from 'react';
import {
  X,
  Layers,
  Volume2,
  VolumeX,
  Sparkles,
  Baby,
  Briefcase,
  GraduationCap,
  Terminal,
  ShieldCheck,
  CheckCircle,
  Copy,
  Check,
  Mic,
  MicOff,
} from 'lucide-react';
import { TECHNICAL_CONCEPTS_LIBRARY } from '../../data/careerData';
import { TechnicalConceptTopic, ExplanationLevel } from '../../types/career';

interface TechnicalExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AUDIENCE_LEVELS: Array<{
  id: ExplanationLevel;
  label: string;
  sub: string;
  icon: any;
  color: string;
}> = [
  { id: 1, label: '1. Child (ELI5)', sub: 'Playful analogy, zero jargon', icon: Baby, color: 'text-amber-500 bg-amber-500/10' },
  { id: 2, label: '2. Non-Technical', sub: 'Everyday workplace comparison', icon: Briefcase, color: 'text-emerald-500 bg-emerald-500/10' },
  { id: 3, label: '3. Student / Junior', sub: 'Mechanics, syntax & standard protocols', icon: GraduationCap, color: 'text-sky-500 bg-sky-500/10' },
  { id: 4, label: '4. Tech Interviewer', sub: 'Tradeoffs, complexity & edge cases', icon: Terminal, color: 'text-indigo-500 bg-indigo-500/10' },
  { id: 5, label: '5. Principal Architect', sub: 'Distributed scale, failure modes & CAP', icon: ShieldCheck, color: 'text-purple-500 bg-purple-500/10' },
];

export const TechnicalExplanationModal: React.FC<TechnicalExplanationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<TechnicalConceptTopic>(TECHNICAL_CONCEPTS_LIBRARY[0]);
  const [selectedLevel, setSelectedLevel] = useState<ExplanationLevel>(1);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [userPracticeText, setUserPracticeText] = useState('');
  const [practiceFeedback, setPracticeFeedback] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentLevelData =
    selectedTopic.levels.find((l) => l.level === selectedLevel) || selectedTopic.levels[0];

  const handlePlayAudio = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentLevelData.modelExplanation);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentLevelData.modelExplanation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEvaluatePractice = () => {
    if (!userPracticeText.trim()) return;

    const words = userPracticeText.toLowerCase().split(/\s+/);
    const lengthScore = Math.min(100, Math.round((words.length / 35) * 100));
    const overallScore = Math.max(65, Math.min(95, lengthScore));

    setPracticeFeedback({
      overallScore,
      wordCount: words.length,
      verdict:
        overallScore >= 80
          ? 'Exceptional audience-adapted delivery! Clear mental model and vocabulary suited for this target depth.'
          : 'Good start. Remember to keep jargon minimal for non-technical levels, or emphasize distributed tradeoffs for senior levels.',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl bg-card border border-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
              <Layers size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-text">5-Level Technical Concept Studio</h2>
              <p className="text-xs text-text-muted">
                Learn to adapt complex engineering ideas from a 5-year-old child to a Staff/Principal Architect
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Topic Selector Bar */}
          <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-surface border border-border">
            <span className="text-xs font-bold text-text-muted mr-1">Concept Topic:</span>
            {TECHNICAL_CONCEPTS_LIBRARY.map((topic) => (
              <button
                key={topic.id}
                type="button"
                onClick={() => {
                  setSelectedTopic(topic);
                  setPracticeFeedback(null);
                  setUserPracticeText('');
                  if (isPlayingAudio) window.speechSynthesis?.cancel();
                }}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                  selectedTopic.id === topic.id
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-card hover:bg-border text-text'
                }`}
              >
                {topic.conceptName}
              </button>
            ))}
          </div>

          {/* 5-Level Audience Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {AUDIENCE_LEVELS.map((lvl) => {
              const Icon = lvl.icon;
              const isSelected = selectedLevel === lvl.id;
              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => {
                    setSelectedLevel(lvl.id);
                    setPracticeFeedback(null);
                    setUserPracticeText('');
                    if (isPlayingAudio) window.speechSynthesis?.cancel();
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                    isSelected
                      ? 'bg-primary/5 border-primary shadow-xs ring-1 ring-primary/40'
                      : 'bg-surface border-border hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${lvl.color}`}>
                      <Icon size={14} />
                    </div>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <div>
                    <span className="text-xs font-black text-text block">{lvl.label}</span>
                    <span className="text-[10px] text-text-muted leading-tight block">{lvl.sub}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Level Display Card */}
          <div className="p-6 rounded-3xl bg-surface border border-border space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                  Target Depth & Audience: Level {currentLevelData.level}
                </span>
                <h3 className="text-base font-black text-text">
                  {selectedTopic.conceptName} — {currentLevelData.levelName}
                </h3>
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
                  <span>{isPlayingAudio ? 'Stop Voice' : 'Listen Model'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-bold text-text hover:bg-card/80 flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Model Explanation */}
            <div className="p-4 rounded-2xl bg-card border border-border text-sm text-text leading-relaxed font-normal">
              "{currentLevelData.modelExplanation}"
            </div>

            {/* Key Analogy Anchor */}
            {currentLevelData.keyAnalogy && (
              <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                  Core Analogy / Mental Anchor:
                </span>
                <p className="text-xs text-text italic">"{currentLevelData.keyAnalogy}"</p>
              </div>
            )}
          </div>

          {/* Interactive Practice Arena */}
          <div className="p-6 rounded-3xl bg-surface border border-primary/30 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-text">Practice Explaining This Level</h4>
                <p className="text-xs text-text-muted">
                  Explain {selectedTopic.conceptName} in your own words for: {currentLevelData.levelName}
                </p>
              </div>
              <span className="text-xs font-bold text-primary">Audience Adaptation Drill</span>
            </div>

            <div className="space-y-2">
              <textarea
                rows={3}
                value={userPracticeText}
                onChange={(e) => setUserPracticeText(e.target.value)}
                placeholder={`Speak or write your explanation tailored for ${currentLevelData.levelName}...`}
                className="w-full p-4 rounded-2xl bg-card border border-border text-xs sm:text-sm text-text placeholder:text-text-muted/60 focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none"
              />

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-text-muted">
                  Tip: Adjust complexity and avoid technical buzzwords for junior audiences.
                </span>
                <button
                  type="button"
                  onClick={handleEvaluatePractice}
                  disabled={!userPracticeText.trim()}
                  className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50 transition-opacity shadow-xs"
                >
                  <Sparkles size={14} />
                  <span>Check Delivery & Depth</span>
                </button>
              </div>
            </div>

            {/* Practice Feedback Results */}
            {practiceFeedback && (
              <div className="p-4 rounded-2xl bg-card border border-border space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-text">Delivery Score:</span>
                    <span className="px-2.5 py-0.5 rounded-md bg-primary/10 text-primary font-mono font-bold text-xs">
                      {practiceFeedback.overallScore}%
                    </span>
                  </div>
                  <span className="text-xs text-text-muted font-medium">
                    {practiceFeedback.wordCount} words
                  </span>
                </div>

                <p className="text-xs font-bold text-text">{practiceFeedback.verdict}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-surface/30 flex items-center justify-between">
          <span className="text-xs text-text-muted">
            Audience awareness is the #1 indicator of engineering communication maturity.
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
