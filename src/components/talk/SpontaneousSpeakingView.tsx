import React, { useState, useEffect, useRef } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { SPONTANEOUS_PROMPTS, SPEAKING_STRUCTURES_GUIDE } from '../../data/speakingIntelligenceData';
import { SpontaneousPromptItem, SpeakingStructureGuide } from '../../types/speakingIntelligence';
import { speakingIntelligenceEngine } from '../../services/speakingIntelligenceEngine';
import { ttsService, sttService } from '../../services/aiService';
import { useUser } from '../../context/UserContext';
import { useAdaptiveLearning } from '../../context/AdaptiveLearningContext';
import {
  Mic,
  MicOff,
  Sparkles,
  RotateCcw,
  Clock,
  Layers,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Shuffle,
  Volume2,
  Flame,
  ArrowRight,
} from 'lucide-react';

export const SpontaneousSpeakingView: React.FC = () => {
  const { addSpokenMinutes } = useUser();
  const { recordEvidence } = useAdaptiveLearning();

  const [selectedPrompt, setSelectedPrompt] = useState<SpontaneousPromptItem>(SPONTANEOUS_PROMPTS[0]);
  const [phase, setPhase] = useState<'idle' | 'prep' | 'speaking' | 'feedback'>('idle');
  const [prepSecondsLeft, setPrepSecondsLeft] = useState<number>(15);
  const [speakSecondsLeft, setSpeakSecondsLeft] = useState<number>(45);

  const [userTranscript, setUserTranscript] = useState<string>('');
  const [isSTTListening, setIsSTTListening] = useState<boolean>(false);
  const [fluencyAnalysis, setFluencyAnalysis] = useState<any>(null);

  const prepTimerRef = useRef<any>(null);
  const speakTimerRef = useRef<any>(null);

  const matchedStructure: SpeakingStructureGuide =
    SPEAKING_STRUCTURES_GUIDE.find((s) => s.id === selectedPrompt.recommendedStructureId) ||
    SPEAKING_STRUCTURES_GUIDE[0];

  // Prep Countdown
  useEffect(() => {
    if (phase === 'prep') {
      if (prepSecondsLeft > 0) {
        prepTimerRef.current = setTimeout(() => {
          setPrepSecondsLeft((prev) => prev - 1);
        }, 1000);
      } else {
        startSpeaking();
      }
    }
    return () => clearTimeout(prepTimerRef.current);
  }, [phase, prepSecondsLeft]);

  // Speaking Countdown
  useEffect(() => {
    if (phase === 'speaking') {
      if (speakSecondsLeft > 0) {
        speakTimerRef.current = setTimeout(() => {
          setSpeakSecondsLeft((prev) => prev - 1);
        }, 1000);
      } else {
        finishSpeaking();
      }
    }
    return () => clearTimeout(speakTimerRef.current);
  }, [phase, speakSecondsLeft]);

  const handleStartChallenge = () => {
    setPhase('prep');
    setPrepSecondsLeft(15);
    setSpeakSecondsLeft(45);
    setUserTranscript('');
    setFluencyAnalysis(null);
  };

  const startSpeaking = () => {
    setPhase('speaking');
    setSpeakSecondsLeft(45);
    setIsSTTListening(true);

    const started = sttService.start({
      onResult: (transcript) => {
        setUserTranscript(transcript);
      },
      onError: () => {
        setIsSTTListening(false);
      },
    });

    if (!started) {
      setUserTranscript("I believe flexible arrangements benefit both teams and individuals because it saves valuable commuting time.");
    }
  };

  const finishSpeaking = () => {
    sttService.stop();
    setIsSTTListening(false);
    setPhase('feedback');

    const transcriptToAnalyze =
      userTranscript.trim() ||
      "In my perspective, working with modern software tools offers higher productivity because it eliminates repetitive steps.";

    const metrics = speakingIntelligenceEngine.analyzeFluency(transcriptToAnalyze, 45 - speakSecondsLeft || 30);
    setFluencyAnalysis(metrics);
    addSpokenMinutes(1);

    // Record evidence to adaptive engine
    recordEvidence({
      sourceType: 'talk',
      sourceTitle: selectedPrompt.category,
      targetSkill: 'fluency',
      accuracyScore: metrics.continuityScore,
      difficulty: 'normal',
      hintsUsedCount: 0,
      contextType: 'spontaneous_speaking',
    });
  };

  const handlePickRandom = () => {
    const next = SPONTANEOUS_PROMPTS[Math.floor(Math.random() * SPONTANEOUS_PROMPTS.length)];
    setSelectedPrompt(next);
    setPhase('idle');
    setUserTranscript('');
    setFluencyAnalysis(null);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-16">
      <PageHeader
        title="Spontaneous Speaking Challenge"
        subtitle="Train your brain to structure thoughts quickly and speak under realistic pressure"
        badge="Fluency Reflex"
        showBack={true}
        actions={
          <button
            type="button"
            onClick={handlePickRandom}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-card border border-border text-xs font-bold text-text hover:bg-surface transition-colors"
          >
            <Shuffle size={14} className="text-primary" />
            <span>Random Prompt</span>
          </button>
        }
      />

      {/* Main Challenge Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-6">
        {/* Level badge & category */}
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider">
            {selectedPrompt.level} • {selectedPrompt.category}
          </span>
          <button
            type="button"
            onClick={() => ttsService.speak(selectedPrompt.prompt)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-border text-xs font-bold text-text hover:bg-surface/80"
          >
            <Volume2 size={14} className="text-primary" />
            <span>Read Prompt</span>
          </button>
        </div>

        {/* Prompt Question */}
        <h3 className="text-2xl sm:text-3xl font-black text-text leading-tight">
          "{selectedPrompt.prompt}"
        </h3>

        {/* Scaffold Starter Hint */}
        <div className="p-4 rounded-2xl bg-surface/70 border border-border flex items-start gap-3">
          <Sparkles size={18} className="text-amber-500 shrink-0 mt-0.5" />
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-text-secondary block mb-0.5">
              Sentence Starter Idea
            </span>
            <p className="text-xs font-semibold text-text">{selectedPrompt.starterHint}</p>
          </div>
        </div>

        {/* Thinking Cues Chips */}
        <div>
          <span className="text-xs font-bold text-text-secondary block mb-2">Key Ideas to Mention:</span>
          <div className="flex flex-wrap gap-2">
            {selectedPrompt.thinkingCues.map((cue, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-xl bg-secondary/10 text-secondary text-xs font-semibold"
              >
                {cue}
              </span>
            ))}
          </div>
        </div>

        {/* Recommended Framework Accordion/Guide */}
        <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-3">
          <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-wider">
            <Layers size={16} />
            <span>Recommended Structure: {matchedStructure.title}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {matchedStructure.steps.map((st, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-card border border-border">
                <span className="text-[10px] font-black uppercase text-primary block mb-0.5">
                  Step {idx + 1}: {st.name}
                </span>
                <p className="text-[11px] text-text-secondary line-clamp-2">{st.cuePrompt}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Status / Countdown Banner */}
        {phase === 'prep' && (
          <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-center space-y-2 animate-pulse">
            <Clock size={32} className="mx-auto text-amber-500" />
            <div className="text-3xl font-black text-amber-500">{prepSecondsLeft}s</div>
            <p className="text-xs font-bold text-amber-600 dark:text-amber-400">
              Gather your thoughts! Speaking starts automatically when the timer reaches zero.
            </p>
          </div>
        )}

        {phase === 'speaking' && (
          <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center mx-auto animate-pulse">
              <Mic size={24} />
            </div>
            <div className="text-4xl font-black text-rose-500">{speakSecondsLeft}s</div>
            <p className="text-xs font-bold text-text-secondary">
              Speak now! Keep speaking steadily until the clock finishes.
            </p>
            {userTranscript && (
              <div className="p-3.5 rounded-2xl bg-card border border-border text-xs text-text italic">
                "{userTranscript}"
              </div>
            )}
            <button
              type="button"
              onClick={finishSpeaking}
              className="px-6 py-2 rounded-xl bg-rose-500 text-white text-xs font-black hover:bg-rose-600 transition-colors"
            >
              Done Speaking Early
            </button>
          </div>
        )}

        {phase === 'idle' && (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={handleStartChallenge}
              className="px-8 py-3.5 rounded-2xl bg-primary text-white font-black text-sm flex items-center gap-2 hover:bg-primary/90 transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <Mic size={18} />
              <span>Start 45s Speaking Challenge</span>
            </button>
          </div>
        )}

        {/* Phase Feedback */}
        {phase === 'feedback' && fluencyAnalysis && (
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-black text-text">Speech Analysis & Fluency Metrics</h4>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-black">
                Continuity: {fluencyAnalysis.continuityScore}%
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-surface border border-border text-center">
                <span className="text-[10px] text-text-secondary font-bold block">Speaking Pace</span>
                <span className="text-lg font-black text-text">{fluencyAnalysis.speakingRateWpm} WPM</span>
              </div>
              <div className="p-3 rounded-2xl bg-surface border border-border text-center">
                <span className="text-[10px] text-text-secondary font-bold block">Response Depth</span>
                <span className="text-lg font-black text-primary capitalize">{fluencyAnalysis.responseDepth}</span>
              </div>
              <div className="p-3 rounded-2xl bg-surface border border-border text-center">
                <span className="text-[10px] text-text-secondary font-bold block">Natural Pauses</span>
                <span className="text-lg font-black text-emerald-500">{fluencyAnalysis.thinkingPausesCount}</span>
              </div>
              <div className="p-3 rounded-2xl bg-surface border border-border text-center">
                <span className="text-[10px] text-text-secondary font-bold block">Filler Words</span>
                <span className="text-lg font-black text-amber-500">{fluencyAnalysis.fillerOccurrences.length}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleStartChallenge}
                className="px-4 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-text hover:bg-surface/80"
              >
                Retry Prompt
              </button>
              <button
                type="button"
                onClick={handlePickRandom}
                className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-black hover:bg-primary/90"
              >
                Next Challenge
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
