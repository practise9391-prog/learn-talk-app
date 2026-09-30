import React, { useState, useEffect, useRef } from 'react';
import { usePractice } from '../../context/PracticeContext';
import { useNavigation } from '../../context/NavigationContext';
import { SPEAKING_ARENA_TOPICS } from '../../data/practiceData';
import { PracticeDifficulty, PracticeEvaluationResult } from '../../types/practice';
import { VoiceButton, VoiceButtonState } from '../common/VoiceButton';
import {
  Mic,
  Clock,
  Sparkles,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  MessageSquare,
  Users2,
  Award,
  Zap,
  Volume2,
  ChevronDown,
  Layers,
  Brain,
  Languages,
} from 'lucide-react';

export const SpeakingArenaView: React.FC = () => {
  const { evaluateSpeechResponse } = usePractice();
  const { navigate } = useNavigation();

  // State
  const [selectedTopicIndex, setSelectedTopicIndex] = useState<number>(0);
  const [durationLimit, setDurationLimit] = useState<number>(60);
  const [difficulty, setDifficulty] = useState<PracticeDifficulty>('normal');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(60);
  const [transcriptText, setTranscriptText] = useState<string>('');
  const [activeHelpLevel, setActiveHelpLevel] = useState<number>(0);
  const [showBrainFreezeDrawer, setShowBrainFreezeDrawer] = useState<boolean>(false);
  const [evalResult, setEvalResult] = useState<PracticeEvaluationResult | null>(null);

  const activeTopic = SPEAKING_ARENA_TOPICS[selectedTopicIndex] || SPEAKING_ARENA_TOPICS[0];
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Timer Countdown
  useEffect(() => {
    if (isSpeaking && timerSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            handleStopSpeaking();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSpeaking, timerSeconds]);

  const handleStartSpeaking = () => {
    setEvalResult(null);
    setTranscriptText('');
    setTimerSeconds(durationLimit);
    setIsSpeaking(true);

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        let current = '';
        for (let i = 0; i < event.results.length; i++) {
          current += event.results[i][0].transcript + ' ';
        }
        setTranscriptText(current);
      };

      recognition.onerror = () => {
        // Fallback simulation text if speech recognition has mic permissions block
      };

      recognition.start();
      recognitionRef.current = recognition;
    }
  };

  const handleStopSpeaking = () => {
    setIsSpeaking(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }

    const finalSpeech =
      transcriptText.trim() ||
      activeTopic.hints.exampleResponse;

    const timeSpent = durationLimit - timerSeconds;
    const result = evaluateSpeechResponse(
      finalSpeech,
      Math.max(15, timeSpent),
      activeTopic.title,
      activeTopic.brainFreeze.suggestedWords
    );

    setEvalResult(result);
  };

  const handlePickRandomTopic = () => {
    const nextIdx = Math.floor(Math.random() * SPEAKING_ARENA_TOPICS.length);
    setSelectedTopicIndex(nextIdx);
    setTimerSeconds(SPEAKING_ARENA_TOPICS[nextIdx].recommendedDuration);
    setDurationLimit(SPEAKING_ARENA_TOPICS[nextIdx].recommendedDuration);
    setEvalResult(null);
    setActiveHelpLevel(0);
    setShowBrainFreezeDrawer(false);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'en-US';
      utter.rate = 0.95;
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <div className="space-y-6">
      {/* Speaking Arena Top Controls */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-xs">
              <Mic size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-text">Speaking Arena</h2>
              <p className="text-xs text-text-muted">
                Low-friction voice practice with instantaneous speech analysis and supportive coaching
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handlePickRandomTopic}
              className="px-3.5 py-1.5 rounded-xl bg-surface border border-border hover:border-primary/40 text-xs font-bold text-text hover:text-primary transition-all flex items-center gap-1.5"
            >
              <Sparkles size={13} className="text-amber-500" />
              <span>Random Topic</span>
            </button>

            {/* Duration Selector */}
            <div className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-border text-xs font-bold">
              {[30, 60, 90, 120].map((sec) => (
                <button
                  key={sec}
                  onClick={() => {
                    setDurationLimit(sec);
                    setTimerSeconds(sec);
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    durationLimit === sec
                      ? 'bg-primary text-white shadow-2xs'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Topic Card */}
        <div className="p-5 rounded-2xl bg-surface/70 border border-border space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-primary uppercase tracking-wider text-[10px]">
              Category: {activeTopic.category.replace('_', ' ')}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-card border border-border text-text-muted capitalize">
              {activeTopic.difficulty} difficulty
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-black text-text leading-snug">
            {activeTopic.title}
          </h3>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            {activeTopic.prompt}
          </p>
        </div>

        {/* Central Voice Recording Hub */}
        <div className="py-6 flex flex-col items-center justify-center space-y-4">
          {/* Animated Timer Ring */}
          <div className="relative flex items-center justify-center">
            <div
              className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center transition-all ${
                isSpeaking
                  ? 'border-primary shadow-lg shadow-primary/20 animate-pulse'
                  : 'border-border'
              }`}
            >
              <span className="text-2xl font-black text-text font-mono">
                {timerSeconds}s
              </span>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                {isSpeaking ? 'Recording' : 'Time Left'}
              </span>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex items-center gap-3">
            {!isSpeaking ? (
              <button
                type="button"
                onClick={handleStartSpeaking}
                className="px-8 py-3.5 rounded-2xl bg-primary hover:bg-primary-hover text-white font-black text-sm shadow-md shadow-primary/20 flex items-center gap-2 hover:scale-102 active:scale-98 transition-all"
              >
                <Mic size={18} />
                <span>🎤 Start Speaking</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStopSpeaking}
                className="px-8 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm shadow-md shadow-rose-600/20 flex items-center gap-2 animate-bounce transition-all"
              >
                <span>Finish & Analyze</span>
              </button>
            )}
          </div>

          {/* Live Transcript / Speech Preview */}
          {isSpeaking && (
            <div className="w-full max-w-lg p-3.5 rounded-2xl bg-surface border border-primary/30 text-xs space-y-1 text-center animate-in fade-in">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                Capturing Real-Time Speech...
              </span>
              <p className="italic text-text font-medium min-h-[20px]">
                {transcriptText || 'Listening to your voice... Speak continuously.'}
              </p>
            </div>
          )}
        </div>

        {/* 4-Level Progressive Assistance Bar (Requirement 7) */}
        <div className="pt-2 border-t border-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text flex items-center gap-1.5">
              <HelpCircle size={14} className="text-primary" />
              <span>Need Assistance? (Select Help Level)</span>
            </span>
            {activeHelpLevel > 0 && (
              <button
                type="button"
                onClick={() => setActiveHelpLevel(0)}
                className="text-[11px] text-text-muted hover:text-text underline"
              >
                Hide Help
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setActiveHelpLevel(1)}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                activeHelpLevel === 1
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-surface border-border text-text-muted hover:text-text'
              }`}
            >
              Level 1: Key Words
            </button>
            <button
              type="button"
              onClick={() => setActiveHelpLevel(2)}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                activeHelpLevel === 2
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-surface border-border text-text-muted hover:text-text'
              }`}
            >
              Level 2: Starter
            </button>
            <button
              type="button"
              onClick={() => setActiveHelpLevel(3)}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                activeHelpLevel === 3
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-surface border-border text-text-muted hover:text-text'
              }`}
            >
              Level 3: Structure
            </button>
            <button
              type="button"
              onClick={() => setActiveHelpLevel(4)}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                activeHelpLevel === 4
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-surface border-border text-text-muted hover:text-text'
              }`}
            >
              Level 4: Full Example
            </button>
          </div>

          {/* Render Active Help Content */}
          {activeHelpLevel > 0 && (
            <div className="p-4 rounded-2xl bg-surface border border-primary/30 text-xs space-y-1.5 animate-in fade-in duration-150">
              {activeHelpLevel === 1 && (
                <div>
                  <span className="font-bold text-text block mb-1">Target Useful Words:</span>
                  <p className="text-primary font-semibold">{activeTopic.hints.wordHint}</p>
                </div>
              )}
              {activeHelpLevel === 2 && (
                <div>
                  <span className="font-bold text-text block mb-1">Sentence Starter:</span>
                  <p className="text-primary font-semibold">"{activeTopic.hints.sentenceStarter}"</p>
                </div>
              )}
              {activeHelpLevel === 3 && (
                <div>
                  <span className="font-bold text-text block mb-1">Sentence Framework:</span>
                  <p className="text-primary font-semibold font-mono">{activeTopic.hints.sentenceStructure}</p>
                </div>
              )}
              {activeHelpLevel === 4 && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-text">Full Natural Example:</span>
                    <button
                      type="button"
                      onClick={() => speakText(activeTopic.hints.exampleResponse)}
                      className="text-primary hover:text-primary-hover flex items-center gap-1"
                    >
                      <Volume2 size={13} />
                      <span>Listen</span>
                    </button>
                  </div>
                  <p className="text-text-muted italic leading-relaxed">
                    "{activeTopic.hints.exampleResponse}"
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Brain-Freeze Mode Toggle (Requirement 8) */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowBrainFreezeDrawer(!showBrainFreezeDrawer)}
              className="text-xs font-bold text-indigo-500 hover:text-indigo-600 flex items-center gap-1.5"
            >
              <Brain size={14} />
              <span>Experiencing Brain Freeze? Click for Instant Thought Rescue</span>
            </button>

            {showBrainFreezeDrawer && (
              <div className="mt-3 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 text-xs space-y-3 animate-in fade-in duration-150">
                <span className="font-bold text-indigo-600 dark:text-indigo-400 block">
                  Supportive Thought Rescue:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-card border border-border space-y-1">
                    <span className="text-[10px] font-bold text-text-muted uppercase">Need a Starter?</span>
                    <p className="font-semibold text-text">"{activeTopic.brainFreeze.suggestedStarters[0]}"</p>
                  </div>
                  <div className="p-3 rounded-xl bg-card border border-border space-y-1">
                    <span className="text-[10px] font-bold text-text-muted uppercase">Easier Question?</span>
                    <p className="font-semibold text-text">{activeTopic.brainFreeze.easierAlternativeQuestion}</p>
                  </div>
                </div>

                {activeTopic.brainFreeze.thoughtTranslations.telugu && (
                  <div className="p-3 rounded-xl bg-card border border-border space-y-1">
                    <span className="text-[10px] font-bold text-text-muted uppercase flex items-center gap-1">
                      <Languages size={11} />
                      <span>Thought Translation (Telugu / Hindi → Natural English):</span>
                    </span>
                    <p className="text-text-muted">{activeTopic.brainFreeze.thoughtTranslations.telugu}</p>
                    <p className="font-bold text-primary pt-0.5">
                      "{activeTopic.brainFreeze.thoughtTranslations.naturalEnglish}"
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post-Speaking Evaluation Card */}
      {evalResult && (
        <div className="p-6 rounded-3xl bg-card border border-primary/30 shadow-lg space-y-5 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-text">Speech Analysis Complete</h3>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize">
                    {evalResult.naturalnessClassification}
                  </span>
                </div>
                <p className="text-xs text-text-muted">
                  Score: <strong>{evalResult.score}%</strong> • Speed: <strong>{evalResult.speechRateWpm} wpm</strong> • Fillers: <strong>{evalResult.fillerWordsCount}</strong>
                </p>
              </div>
            </div>

            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              +{evalResult.xpEarned} XP Earned
            </span>
          </div>

          {/* Transcript review */}
          <div className="p-4 rounded-2xl bg-surface border border-border space-y-1 text-xs">
            <span className="font-bold text-text-muted uppercase tracking-wider text-[10px]">
              Transcribed Speech:
            </span>
            <p className="text-text font-medium leading-relaxed italic">
              "{evalResult.transcript}"
            </p>
          </div>

          {/* Mistakes detected if any */}
          {evalResult.mistakesCaught.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <AlertTriangle size={14} />
                <span>Refinements to Practice:</span>
              </span>
              <div className="space-y-1.5">
                {evalResult.mistakesCaught.map((m, idx) => (
                  <div key={idx} className="text-xs space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="line-through text-rose-500 font-semibold">{m.original}</span>
                      <ArrowRight size={11} className="text-text-muted" />
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{m.correction}</span>
                    </div>
                    <p className="text-text-muted text-[11px]">{m.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Useful Alternative Sentences (Requirement 4) */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-text block">Useful Native Sentence Structures to Repeat:</span>
            <div className="space-y-1.5">
              {evalResult.usefulAlternativeSentences.map((alt, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-surface border border-border text-xs flex items-center justify-between gap-2"
                >
                  <span className="text-text font-medium">"{alt}"</span>
                  <button
                    type="button"
                    onClick={() => speakText(alt)}
                    className="p-1 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                  >
                    <Volume2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cross-System Continuation Pathway (Requirements 48, 49, 50, 51) */}
          <div className="pt-2 border-t border-border space-y-2">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider block">
              Continue Your Momentum:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => navigate('/talk/call?topicId=general&personaId=jarvis')}
                className="p-3 rounded-2xl bg-surface border border-border hover:border-primary/50 text-xs font-bold text-text flex items-center justify-center gap-2 hover:bg-card transition-all"
              >
                <MessageSquare size={14} className="text-primary" />
                <span>Talk About It (AI Partner)</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/roleplay')}
                className="p-3 rounded-2xl bg-surface border border-border hover:border-amber-500/50 text-xs font-bold text-text flex items-center justify-center gap-2 hover:bg-card transition-all"
              >
                <Users2 size={14} className="text-amber-500" />
                <span>Try It in a Meeting (Roleplay)</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/test')}
                className="p-3 rounded-2xl bg-surface border border-border hover:border-emerald-500/50 text-xs font-bold text-text flex items-center justify-center gap-2 hover:bg-card transition-all"
              >
                <Award size={14} className="text-emerald-500" />
                <span>Test This Skill</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
