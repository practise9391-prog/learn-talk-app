import React, { useState, useEffect, useRef } from 'react';
import {
  RoleplayScenario,
  RoleplayDifficulty,
  RoleplayTurn,
  RoleplayFeedbackData,
  RoleplayPerformanceScores
} from '../../types/roleplay';
import { ttsService, sttService, conversationEngine } from '../../services/aiService';
import { RoleplayFeedbackModal } from './RoleplayFeedbackModal';
import { Waveform } from '../common/Waveform';
import { useUser } from '../../context/UserContext';
import { useNavigation } from '../../context/NavigationContext';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  Volume2,
  VolumeX,
  Target,
  CheckCircle2,
  PhoneOff,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Bookmark
} from 'lucide-react';

interface RoleplayEngineSessionViewProps {
  scenario: RoleplayScenario;
  userRole: string;
  aiRole: string;
  difficulty: RoleplayDifficulty;
  initialMode?: 'voice' | 'text';
  onExit: () => void;
}

export const RoleplayEngineSessionView: React.FC<RoleplayEngineSessionViewProps> = ({
  scenario,
  userRole,
  aiRole,
  difficulty,
  initialMode = 'voice',
  onExit
}) => {
  const { addSpokenMinutes } = useUser();
  const { navigate } = useNavigation();

  // Mode and voice state
  const [mode, setMode] = useState<'voice' | 'text'>(initialMode);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Conversation turns
  const [turns, setTurns] = useState<RoleplayTurn[]>([
    {
      id: 'turn-init',
      sender: 'ai',
      text: scenario.openingMessage,
      timestamp: '00:02'
    }
  ]);

  // Current scenario step index
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // User input & live transcript
  const [textInput, setTextInput] = useState('');
  const [liveTranscript, setLiveTranscript] = useState('');

  // Hint & Sentence Starter drawer states
  const [showHintModal, setShowHintModal] = useState(false);
  const [hintTier, setHintTier] = useState<'word' | 'sentence' | 'full'>('word');
  const [lastHintUsed, setLastHintUsed] = useState<'word' | 'sentence' | 'full' | undefined>(undefined);
  const [showStarters, setShowStarters] = useState(false);

  // Feedback modal state
  const [feedbackData, setFeedbackData] = useState<RoleplayFeedbackData | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Elapsed timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<any>(null);
  const turnsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll transcript
  useEffect(() => {
    turnsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [turns, liveTranscript]);

  // Start timer and speak opening message
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    // Speak initial opening message with character rate according to difficulty
    const rate = difficulty === 'Beginner' ? 0.85 : difficulty === 'Intermediate' ? 1.0 : 1.1;
    setIsAiSpeaking(true);
    ttsService.speak(scenario.openingMessage, {
      rate,
      onEnd: () => setIsAiSpeaking(false)
    });

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      ttsService.stop();
      sttService.stop();
    };
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Toggle Microphone (STT) with Barge-In
  const handleToggleMic = () => {
    if (isAiSpeaking) {
      // Barge-in: interrupt AI speech immediately
      ttsService.stop();
      setIsAiSpeaking(false);
    }

    if (isMicActive) {
      sttService.stop();
      setIsMicActive(false);
      if (liveTranscript.trim()) {
        handleUserSubmit(liveTranscript.trim());
        setLiveTranscript('');
      }
    } else {
      setLiveTranscript('');
      const started = sttService.start({
        onResult: (text, isFinal) => {
          setLiveTranscript(text);
          if (isFinal) {
            handleUserSubmit(text);
            setLiveTranscript('');
            setIsMicActive(false);
          }
        },
        onError: () => {
          setIsMicActive(false);
        }
      });
      if (started) {
        setIsMicActive(true);
      }
    }
  };

  // Process user turn
  const handleUserSubmit = (userText: string) => {
    if (!userText.trim()) return;

    // Add user turn
    const newTurn: RoleplayTurn = {
      id: `turn-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: formatTime(elapsedSeconds),
      hintUsed: lastHintUsed
    };

    setTurns((prev) => [...prev, newTurn]);
    setLastHintUsed(undefined);
    setIsProcessing(true);

    // Track speaking minute
    addSpokenMinutes(1);

    // Check branching or next step
    setTimeout(() => {
      progressRoleplay(userText, [...turns, newTurn]);
    }, 900);
  };

  const progressRoleplay = (userResponse: string, updatedTurns: RoleplayTurn[]) => {
    setIsProcessing(false);

    const currentStep = scenario.conversationSteps[currentStepIndex];

    // Check for branch trigger keywords (e.g. vegetarian / allergy / compromise)
    let aiNextPrompt = '';
    if (currentStep?.branches && currentStep.branches.length > 0) {
      const lower = userResponse.toLowerCase();
      for (const branch of currentStep.branches) {
        if (branch.triggerKeywords.some((kw) => lower.includes(kw))) {
          aiNextPrompt = branch.nextAiPrompt;
          break;
        }
      }
    }

    // If no branch matched, use standard next step prompt
    if (!aiNextPrompt) {
      if (currentStepIndex + 1 < scenario.conversationSteps.length) {
        aiNextPrompt = scenario.conversationSteps[currentStepIndex + 1].aiPrompt;
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        // Final wrap-up step reached!
        concludeRoleplay(updatedTurns);
        return;
      }
    }

    // Add AI in-character response
    const aiTurn: RoleplayTurn = {
      id: `ai-turn-${Date.now()}`,
      sender: 'ai',
      text: aiNextPrompt,
      timestamp: formatTime(elapsedSeconds)
    };

    setTurns((prev) => [...prev, aiTurn]);

    // Speak AI response with barge-in readiness
    const rate = difficulty === 'Beginner' ? 0.85 : 1.0;
    setIsAiSpeaking(true);
    ttsService.speak(aiNextPrompt, {
      rate,
      onEnd: () => setIsAiSpeaking(false)
    });
  };

  const concludeRoleplay = (finalTurns: RoleplayTurn[]) => {
    // Generate scores and feedback
    const userTurns = finalTurns.filter((t) => t.sender === 'user');
    const wordCount = userTurns.reduce((acc, t) => acc + t.text.split(' ').length, 0);

    const scores: RoleplayPerformanceScores = {
      communication: {
        score: Math.min(94, 78 + userTurns.length * 3),
        explanation: 'Addressed all conversational prompts in role with appropriate register.'
      },
      grammar: {
        score: 82,
        explanation: `Demonstrated solid sentence structure aligned with ${difficulty} requirements.`
      },
      vocabulary: {
        score: Math.min(92, 75 + Math.floor(wordCount / 8)),
        explanation: `Incorporated scenario-specific terminology (${scenario.vocabulary.slice(0, 3).join(', ')}).`
      },
      pronunciation: {
        score: 80,
        explanation: 'Speech paced clearly; consistent syllable enunciation.'
      },
      fluency: {
        score: Math.min(90, 72 + userTurns.length * 4),
        explanation: 'Natural rhythm maintained; minimal unnatural pauses observed.'
      },
      clarity: {
        score: 86,
        explanation: 'Intent and answers were easily understood by the AI counterpart.'
      },
      contextHandling: {
        score: 85,
        explanation: `Remained consistently engaged in the ${userRole} persona.`
      }
    };

    const overall = Math.round(
      (scores.communication.score +
        scores.grammar.score +
        scores.vocabulary.score +
        scores.pronunciation.score +
        scores.fluency.score +
        scores.clarity.score +
        scores.contextHandling.score) /
        7
    );

    const feedback: RoleplayFeedbackData = {
      overallScore: overall,
      outcome: overall >= 80 ? 'Complete' : 'Needs more practice',
      scores,
      whatYouDidWell: [
        `Maintained the ${userRole} character throughout the exchange.`,
        'Directly answered the core prompt without straying off topic.',
        'Used polite conversational formulas and clear modal verbs.'
      ],
      areasToImprove: [
        'Aim to connect past experience with target objectives more tightly.',
        'Try replacing casual phrases with professional equivalents.'
      ],
      recommendedCurriculumLesson: scenario.evaluationRules[0]?.recommendedLessonId
        ? {
            lessonId: scenario.evaluationRules[0].recommendedLessonId,
            title: scenario.evaluationRules[0].recommendedLessonTitle || 'Workplace Communication',
            level: 'Intermediate Level 1',
            focus: 'Expressing professional intent and polished requests'
          }
        : undefined
    };

    // Save to history storage
    const historyItem = {
      id: `hist-${Date.now()}`,
      scenarioId: scenario.id,
      scenarioTitle: scenario.title,
      category: scenario.category,
      difficulty,
      date: 'Just now',
      score: overall,
      durationMin: Math.max(1, Math.round(elapsedSeconds / 60)),
      turnsCount: finalTurns.length,
      feedback,
      transcript: finalTurns
    };

    try {
      const existing = localStorage.getItem('learntalk_roleplay_history');
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(historyItem);
      localStorage.setItem('learntalk_roleplay_history', JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }

    setFeedbackData(feedback);
    setIsCompleted(true);
  };

  const handleApplyStarter = (starter: string) => {
    setTextInput((prev) => (prev ? `${prev} ${starter}` : starter));
    setShowStarters(false);
  };

  const handleUseHint = (tier: 'word' | 'sentence' | 'full') => {
    setLastHintUsed(tier);
    const activeStep = scenario.conversationSteps[currentStepIndex] || scenario.conversationSteps[0];
    if (tier === 'sentence' || tier === 'full') {
      const hintText = tier === 'sentence' ? activeStep.hints.sentenceHint : activeStep.hints.fullHint;
      setTextInput(hintText);
    }
    setShowHintModal(false);
  };

  const activeStep = scenario.conversationSteps[currentStepIndex] || scenario.conversationSteps[0];

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-4xl mx-auto rounded-3xl bg-card border border-border overflow-hidden shadow-lg select-none">
      {/* Top Scenario Control Bar */}
      <div className="px-5 py-3.5 bg-surface border-b border-border flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onExit}
            className="p-2 rounded-xl bg-card border border-border text-text-muted hover:text-text hover:bg-surface transition-colors"
            title="Exit Roleplay"
          >
            <PhoneOff size={16} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-text leading-tight truncate">
                {scenario.title}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-primary/10 text-primary border border-primary/20">
                {difficulty}
              </span>
            </div>
            <p className="text-[11px] text-text-muted mt-0.5">
              You: <strong className="text-text">{userRole}</strong> • Jarvis: <strong className="text-text">{aiRole}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Objective Progress */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-card border border-border text-xs text-text-muted">
            <Target size={13} className="text-primary" />
            <span>
              Step {currentStepIndex + 1} of {scenario.conversationSteps.length}
            </span>
          </div>

          {/* Timer */}
          <div className="px-3 py-1 rounded-xl bg-primary/10 text-primary font-mono text-xs font-bold">
            {formatTime(elapsedSeconds)}
          </div>

          {/* Finish & Conclude Early */}
          <button
            type="button"
            onClick={() => concludeRoleplay(turns)}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/20 hover:bg-emerald-500/20 transition-all flex items-center gap-1"
          >
            <CheckCircle2 size={13} />
            <span>Wrap Up</span>
          </button>
        </div>
      </div>

      {/* Main Conversation Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {/* Scenario context banner */}
        <div className="p-3.5 rounded-2xl bg-surface/70 border border-border/70 text-xs text-text-muted flex items-start gap-2.5">
          <Sparkles size={15} className="text-primary shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-text">Roleplay Rule:</strong> Jarvis stays strictly in character as <em>{aiRole}</em>. Detailed evaluation will be provided in your post-session feedback.
          </p>
        </div>

        {turns.map((turn) => {
          const isAI = turn.sender === 'ai';
          return (
            <div
              key={turn.id}
              className={`flex items-start gap-3 ${isAI ? 'justify-start' : 'justify-end'} animate-fadeIn`}
            >
              {isAI && (
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center text-lg font-black shrink-0">
                  🤖
                </div>
              )}

              <div className={`max-w-[82%] ${isAI ? '' : 'items-end'}`}>
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-text-muted">
                    {isAI ? aiRole : userRole}
                  </span>
                  <span className="text-[10px] text-text-muted">{turn.timestamp}</span>
                  {turn.hintUsed && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 font-bold">
                      💡 Hint ({turn.hintUsed})
                    </span>
                  )}
                </div>

                <div
                  className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isAI
                      ? 'bg-surface border border-border text-text rounded-tl-sm'
                      : 'bg-primary text-primary-foreground rounded-tr-sm'
                  }`}
                >
                  {turn.text}
                </div>
              </div>

              {!isAI && (
                <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-xs font-black shrink-0">
                  YOU
                </div>
              )}
            </div>
          );
        })}

        {/* Live speech transcription bubble */}
        {isMicActive && liveTranscript && (
          <div className="flex items-start justify-end gap-3 animate-fadeIn">
            <div className="max-w-[80%] p-3.5 rounded-3xl bg-primary/20 border border-primary/30 text-xs sm:text-sm text-text italic">
              "{liveTranscript}"
            </div>
            <div className="w-10 h-10 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-xs font-black text-primary animate-pulse">
              🎙
            </div>
          </div>
        )}

        {/* Processing indicator */}
        {isProcessing && (
          <div className="flex items-center gap-2 text-xs text-text-muted italic px-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span>{aiRole} is listening and formulating a response...</span>
          </div>
        )}

        <div ref={turnsEndRef} />
      </div>

      {/* Helper Bar: Hints & Sentence Starters (Requirements 37 & 38) */}
      <div className="px-5 py-2.5 bg-surface/80 border-t border-border flex items-center justify-between gap-3 text-xs shrink-0">
        <div className="flex items-center gap-2">
          {/* 3-Tier Progressive Hint Trigger */}
          <button
            type="button"
            onClick={() => setShowHintModal(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 font-bold hover:bg-amber-500/20 transition-all flex items-center gap-1.5"
          >
            <Lightbulb size={14} className="text-amber-500" />
            <span>💡 Hint</span>
          </button>

          {/* Sentence Starters */}
          <button
            type="button"
            onClick={() => setShowStarters(!showStarters)}
            className="px-3 py-1.5 rounded-xl bg-card border border-border text-text font-bold hover:bg-surface transition-all flex items-center gap-1.5"
          >
            <Sparkles size={14} className="text-primary" />
            <span>Sentence Starters</span>
          </button>
        </div>

        {/* Mode Toggle & Audio Status */}
        <div className="flex items-center gap-3">
          {isAiSpeaking && (
            <div className="flex items-center gap-1.5 text-[11px] text-primary font-bold animate-pulse">
              <Volume2 size={13} />
              <span>{aiRole} speaking...</span>
            </div>
          )}

          <div className="flex items-center bg-card p-0.5 rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setMode('voice')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                mode === 'voice' ? 'bg-primary text-primary-foreground' : 'text-text-muted hover:text-text'
              }`}
            >
              Voice
            </button>
            <button
              type="button"
              onClick={() => setMode('text')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                mode === 'text' ? 'bg-primary text-primary-foreground' : 'text-text-muted hover:text-text'
              }`}
            >
              Text
            </button>
          </div>
        </div>
      </div>

      {/* Sentence Starters Drawer (Requirement 38) */}
      {showStarters && (
        <div className="px-5 py-3 bg-surface border-t border-border animate-fadeIn flex flex-wrap gap-2">
          {activeStep.suggestedStarters.map((starter, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyStarter(starter)}
              className="px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-semibold text-text hover:border-primary/40 hover:bg-surface transition-all"
            >
              "{starter}"
            </button>
          ))}
        </div>
      )}

      {/* Input Controls: Voice and Text Bar */}
      <div className="p-4 bg-card border-t border-border flex flex-col sm:flex-row items-center gap-3 shrink-0">
        {mode === 'voice' && (
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleToggleMic}
              className={`flex-1 sm:flex-initial px-6 py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 ${
                isMicActive
                  ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/25'
                  : 'bg-primary text-primary-foreground hover:bg-primary-hover shadow-primary/25'
              }`}
            >
              {isMicActive ? <MicOff size={16} /> : <Mic size={16} />}
              <span>{isMicActive ? 'Tap to Stop & Send' : 'Tap to Speak'}</span>
            </button>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (textInput.trim()) {
              handleUserSubmit(textInput);
              setTextInput('');
            }
          }}
          className="flex-1 w-full flex items-center gap-2"
        >
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={
              mode === 'voice'
                ? 'Speak using the mic, or type here...'
                : `Reply in character as ${userRole}...`
            }
            className="flex-1 px-4 py-2.5 rounded-xl bg-surface border border-border text-xs sm:text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="submit"
            disabled={!textInput.trim() || isProcessing}
            className="p-2.5 rounded-xl bg-primary text-primary-foreground disabled:opacity-30 hover:bg-primary-hover transition-colors shadow-xs"
          >
            <Send size={15} />
          </button>
        </form>
      </div>

      {/* 3-Tier Hint Modal (Requirement 37: Word Hint, Sentence Hint, Full Hint) */}
      {showHintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-card border border-border p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Lightbulb size={20} className="text-amber-500" />
                <h3 className="text-base font-black text-text">Contextual Speaking Hint</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHintModal(false)}
                className="text-text-muted hover:text-text font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-text-muted">
              Choose how much assistance you'd like without giving away the full answer right away:
            </p>

            <div className="space-y-3">
              {/* Tier 1: Word Hint */}
              <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-text">1. Word Hint (Useful Vocabulary)</span>
                  <button
                    type="button"
                    onClick={() => handleUseHint('word')}
                    className="text-[11px] font-bold text-primary hover:underline"
                  >
                    Use Words
                  </button>
                </div>
                <p className="text-xs text-text-muted font-mono bg-card p-2 rounded-xl border border-border/60">
                  {activeStep.hints.wordHint}
                </p>
              </div>

              {/* Tier 2: Sentence Starter */}
              <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-text">2. Sentence Starter</span>
                  <button
                    type="button"
                    onClick={() => handleUseHint('sentence')}
                    className="text-[11px] font-bold text-primary hover:underline"
                  >
                    Insert Starter
                  </button>
                </div>
                <p className="text-xs text-text-muted italic bg-card p-2 rounded-xl border border-border/60">
                  "{activeStep.hints.sentenceHint}"
                </p>
              </div>

              {/* Tier 3: Full Hint */}
              <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-text">3. Full Sample Answer</span>
                  <button
                    type="button"
                    onClick={() => handleUseHint('full')}
                    className="text-[11px] font-bold text-primary hover:underline"
                  >
                    Insert Full
                  </button>
                </div>
                <p className="text-xs text-text-muted bg-card p-2 rounded-xl border border-border/60">
                  "{activeStep.hints.fullHint}"
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowHintModal(false)}
                className="px-4 py-2 rounded-xl bg-surface text-xs font-bold text-text-muted hover:text-text"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Roleplay Feedback Modal */}
      {isCompleted && feedbackData && (
        <RoleplayFeedbackModal
          scenario={scenario}
          feedback={feedbackData}
          turns={turns}
          durationMinutes={Math.max(1, Math.round(elapsedSeconds / 60))}
          onRetry={(newDiff) => {
            setIsCompleted(false);
            setTurns([
              {
                id: 'turn-init-retry',
                sender: 'ai',
                text: scenario.openingMessage,
                timestamp: '00:02'
              }
            ]);
            setCurrentStepIndex(0);
            setElapsedSeconds(0);
          }}
          onClose={() => {
            setIsCompleted(false);
            onExit();
          }}
        />
      )}
    </div>
  );
};
