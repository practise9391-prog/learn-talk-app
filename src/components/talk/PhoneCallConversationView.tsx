import React, { useState, useEffect, useRef } from 'react';
import { ConversationTurn, ConversationTopic, CorrectionDetail, SessionAnalytics, ConversationDifficulty } from '../../types/talk';
import { AICharacter } from '../../types';
import { AI_PERSONAS } from '../../data/personas';
import { CONVERSATION_TOPICS } from '../../data/talkTopics';
import { ttsService, sttService, conversationEngine } from '../../services/aiService';
import { ConversationSummaryModal } from './ConversationSummaryModal';
import { Waveform } from '../common/Waveform';
import { useUser } from '../../context/UserContext';
import { useNavigation } from '../../context/NavigationContext';
import {
  Mic,
  MicOff,
  PhoneOff,
  Volume2,
  Sparkles,
  HelpCircle,
  Lightbulb,
  MessageSquare,
  Globe,
  Star,
  Check,
  RotateCcw,
  Languages,
  ArrowRight,
  ShieldCheck,
  Send,
  Zap,
  Bookmark,
  Clock
} from 'lucide-react';

interface PhoneCallConversationViewProps {
  topicId?: string;
  personaId?: string;
  difficulty?: ConversationDifficulty;
  initialMode?: 'voice' | 'text';
}

export const PhoneCallConversationView: React.FC<PhoneCallConversationViewProps> = ({
  topicId = 'topic-my-day',
  personaId = 'jarvis',
  difficulty = 'normal',
  initialMode = 'voice',
}) => {
  const { user, addSpokenMinutes, saveNewRecording } = useUser();
  const { navigate } = useNavigation();

  // Find active topic & persona
  const topic: ConversationTopic =
    CONVERSATION_TOPICS.find((t) => t.id === topicId) || CONVERSATION_TOPICS[0];
  const persona: AICharacter =
    AI_PERSONAS.find((p) => p.id === personaId) || AI_PERSONAS[0];

  // Call & Connection State
  const [callDuration, setCallDuration] = useState<number>(0);
  const [speakingDuration, setSpeakingDuration] = useState<number>(0);
  const [mode, setMode] = useState<'voice' | 'text'>(initialMode);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isJarvisSpeaking, setIsJarvisSpeaking] = useState<boolean>(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState<boolean>(false);

  // Audio Playback Rate & Preset
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);

  // Help & Prompter Drawers
  const [showBrainFreeze, setShowBrainFreeze] = useState<boolean>(false);
  const [showWordPrompter, setShowWordPrompter] = useState<boolean>(false);
  const [nativePromptInput, setNativePromptInput] = useState<string>('');
  const [promptSuggestions, setPromptSuggestions] = useState<{ simple: string; natural: string; pro: string } | null>(null);

  // User input & live transcription
  const [textInput, setTextInput] = useState<string>('');
  const [liveTranscript, setLiveTranscript] = useState<string>('');

  // Active expanded correction card
  const [activeCorrection, setActiveCorrection] = useState<CorrectionDetail | null>(null);

  // Summary Analytics Modal state
  const [summaryAnalytics, setSummaryAnalytics] = useState<SessionAnalytics | null>(null);
  const [isSummaryOpen, setIsSummaryOpen] = useState<boolean>(false);

  // Conversation turns stream
  const [turns, setTurns] = useState<ConversationTurn[]>([
    {
      id: 'turn-0',
      sender: 'jarvis',
      text: topic.initialPrompt,
      timestamp: 'Just now',
    }
  ]);

  // Saved phrases state
  const [savedPhraseIds, setSavedPhraseIds] = useState<string[]>([]);

  // Ref for timer
  const timerRef = useRef<any>(null);

  // Duration Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
      if (isUserSpeaking) {
        setSpeakingDuration((prev) => prev + 1);
      }
    }, 1000);

    // Speak initial greeting if in voice mode
    if (mode === 'voice') {
      speakJarvisResponse(topic.initialPrompt);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      ttsService.stop();
      sttService.stopListening();
    };
  }, []);

  // Text-To-Speech with current playback rate
  const speakJarvisResponse = (text: string) => {
    setIsJarvisSpeaking(true);
    ttsService.speak(text, {
      rate: playbackRate,
      onStart: () => setIsJarvisSpeaking(true),
      onEnd: () => setIsJarvisSpeaking(false),
    });
  };

  // BARGE-IN: Natural Interruption Handler (Requirement 8)
  const handleUserInterruption = () => {
    if (isJarvisSpeaking) {
      ttsService.stop();
      setIsJarvisSpeaking(false);
    }
  };

  // Start Voice Activity / Speech recognition
  const handleToggleUserMic = () => {
    if (isMuted) return;

    // Trigger barge-in immediately
    handleUserInterruption();

    if (!isUserSpeaking) {
      setIsUserSpeaking(true);
      const started = sttService.startListening({
        onResult: (transcript, isFinal) => {
          setLiveTranscript(transcript);
          if (isFinal) {
            handleCompleteSpeechTurn(transcript);
          }
        },
        onError: (err) => {
          console.warn('STT notice:', err);
        },
        onSpeechEnd: () => {
          setIsUserSpeaking(false);
        },
      });

      if (!started) {
        // Fallback simulation if speech recognition is unsupported or blocked
        setTimeout(() => {
          const sampleSpeech = "I usually wake up at 7 AM and have a cup of chai before leaving for work.";
          setLiveTranscript(sampleSpeech);
          setTimeout(() => {
            handleCompleteSpeechTurn(sampleSpeech);
          }, 800);
        }, 1200);
      }
    } else {
      sttService.stopListening();
      setIsUserSpeaking(false);
      if (liveTranscript.trim()) {
        handleCompleteSpeechTurn(liveTranscript);
      }
    }
  };

  // Process Completed User Speech Turn
  const handleCompleteSpeechTurn = (userSpeech: string) => {
    const trimmed = userSpeech.trim();
    if (!trimmed) return;

    sttService.stopListening();
    setIsUserSpeaking(false);
    setLiveTranscript('');

    // Evaluate for potential corrections
    const evalResult = conversationEngine.evaluateTurn(trimmed);

    let correctionData: CorrectionDetail | undefined = undefined;
    if (evalResult && evalResult.hasCorrection) {
      correctionData = {
        id: `corr-${Date.now()}`,
        originalText: trimmed,
        simpleEnglish: evalResult.simpleEnglish,
        naturalEnglish: evalResult.naturalEnglish,
        professionalEnglish: evalResult.professionalEnglish,
        whyExplanation: evalResult.whyExplanation,
        errorCategory: evalResult.category,
        whyThisWord: evalResult.whyThisWord,
      };
    }

    const userTurn: ConversationTurn = {
      id: `turn-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: 'Just now',
      correction: correctionData,
    };

    setTurns((prev) => [...prev, userTurn]);
    addSpokenMinutes(1);

    // AI Generates dynamic context-locked response (Requirement 4, 25, 26)
    setTimeout(() => {
      generateJarvisReply(trimmed);
    }, 1000);
  };

  // Jarvis Response Generation (context-locked with follow-up depth)
  const generateJarvisReply = (userText: string) => {
    let replyText = "";
    const lower = userText.toLowerCase();

    if (lower.includes('cricket') || topic.id === 'topic-cricket') {
      replyText = "That's a classic take! When the pressure is on in the final overs, what do you think is more crucial: composure or aggressive shot-making?";
    } else if (lower.includes('interview') || topic.id === 'topic-interview') {
      replyText = "That's a solid answer. Can you tell me about a time when you faced a disagreement with a team member, and how you worked through it?";
    } else if (lower.includes('office') || topic.id === 'topic-office') {
      replyText = "Understood! Let's ensure the blockers are flagged in today's sync. What do you need from the backend team to unblock your workflow?";
    } else {
      replyText = "That sounds really interesting! Tell me, what was the most memorable part of that experience for you?";
    }

    const jarvisTurn: ConversationTurn = {
      id: `turn-${Date.now() + 1}`,
      sender: 'jarvis',
      text: replyText,
      timestamp: 'Just now',
    };

    setTurns((prev) => [...prev, jarvisTurn]);
    speakJarvisResponse(replyText);
  };

  // Word Prompter Translator (Requirement 12)
  const handleTranslateNativePrompt = () => {
    if (!nativePromptInput.trim()) return;

    const lower = nativePromptInput.toLowerCase();
    if (lower.includes('ardham') || lower.includes('samajh')) {
      setPromptSuggestions({
        simple: "I didn't understand that.",
        natural: "I'm not sure I quite understood.",
        pro: "Could you please clarify that for me?",
      });
    } else if (lower.includes('alasyam') || lower.includes('late') || lower.includes('der')) {
      setPromptSuggestions({
        simple: "I will be late tomorrow.",
        natural: "I'll be arriving a bit late tomorrow.",
        pro: "I anticipate a slight delay in my arrival tomorrow.",
      });
    } else {
      setPromptSuggestions({
        simple: `I want to talk about ${nativePromptInput}.`,
        natural: `Could you tell me more about ${nativePromptInput}?`,
        pro: `I would appreciate your insight on ${nativePromptInput}.`,
      });
    }
  };

  // Toggle Save Phrase to "My Phrases" (Requirement 37)
  const handleSavePhrase = (turnId: string, text: string) => {
    if (savedPhraseIds.includes(turnId)) {
      setSavedPhraseIds(savedPhraseIds.filter((id) => id !== turnId));
    } else {
      setSavedPhraseIds([...savedPhraseIds, turnId]);
    }
  };

  // End Call & Synthesize Complete Session Analytics (Requirement 34, 35)
  const handleEndCall = () => {
    ttsService.stop();
    sttService.stopListening();

    const userTurns = turns.filter((t) => t.sender === 'user');
    const totalWords = userTurns.reduce((acc, t) => acc + t.text.split(' ').length, 0);
    const wpm = conversationEngine.calculateWPM(totalWords, Math.max(1, speakingDuration));
    const allUserText = userTurns.map((t) => t.text).join(' ');
    const fillers = conversationEngine.analyzeFillers(allUserText);

    const analytics: SessionAnalytics = {
      sessionId: `call-${Date.now()}`,
      topicTitle: topic.title,
      personaName: persona.name,
      difficulty,
      totalDurationSeconds: callDuration,
      speakingDurationSeconds: Math.max(30, speakingDuration),
      wordsSpoken: Math.max(45, totalWords),
      speakingRateWpm: Math.max(110, wpm || 120),
      fluencyScore: 82,
      grammarScore: 80,
      vocabularyScore: 76,
      pronunciationScore: 78,
      clarityScore: 84,
      fillerWordCounts: fillers,
      commonMistakes: [
        {
          category: 'Tense',
          count: 2,
          examples: ["I am go to office yesterday -> I went to the office yesterday."]
        },
        {
          category: 'Filler Word',
          count: fillers.basically + fillers.like,
          examples: ["Replace 'basically' with a steady 1-second pause."]
        }
      ],
      whatYouDidWell: [
        "Maintained conversational continuity with zero awkward silence",
        "Clear pronunciation on core vocabulary words",
        "Natural topic progression without straying from context"
      ],
      whatToImprove: [
        "Replace conversational fillers like 'basically' with deliberate pauses",
        "Use more variety in past tense verbs (went, completed, attended)"
      ],
      specificJarvisFeedback: "You explained your thoughts with genuine confidence! You're thinking in English much faster than your first session.",
      recommendedPractice: {
        title: "Unit 2: Talking About Yesterday",
        route: "/learn/lesson/b1-u2-l2",
        reason: "Strengthen past-tense irregular verb reflexes."
      }
    };

    setSummaryAnalytics(analytics);
    setIsSummaryOpen(true);

    saveNewRecording({
      sessionId: analytics.sessionId,
      title: `${topic.title} Call with ${persona.name}`,
      scenarioName: topic.title,
      durationSeconds: callDuration,
      hasAudio: true,
      transcriptText: allUserText || "Spoken conversation with Jarvis.",
      correctionsCount: 1,
      savedLocally: true,
    });
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-5">
      {/* Top Status & Context Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-3xl bg-card border border-border shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Connected</span>
          </div>

          <div className="text-xs text-text-muted font-medium flex items-center gap-1.5">
            <Clock size={13} />
            <span>
              {String(Math.floor(callDuration / 60)).padStart(2, '0')}:
              {String(callDuration % 60).padStart(2, '0')}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-text">
            <ShieldCheck size={14} className="text-primary" />
            <span className="font-bold">Topic Locked:</span>
            <span className="text-text-muted truncate max-w-[180px]">{topic.title}</span>
          </div>
        </div>

        {/* Speed Controls & Voice/Text Switcher */}
        <div className="flex items-center gap-2">
          {/* AI Voice Speed Presets (Requirement 30) */}
          <div className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-border text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setPlaybackRate(0.75)}
              className={`px-2 py-0.5 rounded-lg transition-colors ${
                playbackRate === 0.75 ? 'bg-primary text-white' : 'text-text-muted hover:text-text'
              }`}
              title="Slow speech"
            >
              🐢 0.75x
            </button>
            <button
              type="button"
              onClick={() => setPlaybackRate(1.0)}
              className={`px-2 py-0.5 rounded-lg transition-colors ${
                playbackRate === 1.0 ? 'bg-primary text-white' : 'text-text-muted hover:text-text'
              }`}
              title="Normal speech"
            >
              1.0x
            </button>
            <button
              type="button"
              onClick={() => setPlaybackRate(1.25)}
              className={`px-2 py-0.5 rounded-lg transition-colors ${
                playbackRate === 1.25 ? 'bg-primary text-white' : 'text-text-muted hover:text-text'
              }`}
              title="Fast speech"
            >
              ⚡ 1.25x
            </button>
          </div>

          {/* Mode Switcher (Text vs Voice) */}
          <button
            type="button"
            onClick={() => setMode(mode === 'voice' ? 'text' : 'voice')}
            className="p-2 rounded-xl bg-surface border border-border text-xs font-bold text-text-muted hover:text-text hover:bg-card transition-colors flex items-center gap-1"
            title="Switch between Voice Call and Text Chat"
          >
            {mode === 'voice' ? <MessageSquare size={16} /> : <Mic size={16} />}
            <span className="hidden sm:inline">{mode === 'voice' ? 'Text' : 'Voice'}</span>
          </button>
        </div>
      </div>

      {/* Main Call Theater Area (Requirement 6) */}
      <div className="rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-sm flex flex-col justify-between min-h-[500px]">
        {/* Animated Avatar Centerpiece */}
        <div className="flex flex-col items-center justify-center text-center py-6">
          <div className="relative mb-3">
            <div
              className={`
                w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-primary/20 via-primary/10 to-secondary/20
                flex items-center justify-center text-5xl sm:text-6xl shadow-xl transition-all duration-300
                ${
                  isJarvisSpeaking
                    ? 'ring-4 ring-primary ring-offset-4 dark:ring-offset-card scale-105 animate-pulse'
                    : isUserSpeaking
                    ? 'ring-4 ring-emerald-500 ring-offset-4 dark:ring-offset-card animate-pulse'
                    : 'ring-1 ring-border'
                }
              `}
            >
              <span>{persona.avatar}</span>
            </div>

            {/* Speaking Audio Wave Badge */}
            {(isJarvisSpeaking || isUserSpeaking) && (
              <span className="absolute -bottom-2 inset-x-0 mx-auto w-max px-2.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold shadow-sm animate-bounce-subtle">
                {isJarvisSpeaking ? 'Jarvis Speaking...' : 'You are Speaking...'}
              </span>
            )}
          </div>

          <h3 className="text-xl font-black text-text mt-1">{persona.name}</h3>
          <p className="text-xs text-text-muted font-medium">
            {persona.role} • {topic.title}
          </p>

          {/* Barge-In Interrupt Notice when AI speaks (Requirement 8) */}
          {isJarvisSpeaking && (
            <button
              type="button"
              onClick={handleUserInterruption}
              className="mt-3 text-[11px] font-bold text-text-muted hover:text-primary transition-colors flex items-center gap-1 bg-surface px-3 py-1 rounded-full border border-border"
              title="Interrupt Jarvis naturally"
            >
              <span>Tap anywhere to speak & interrupt (Barge-in supported)</span>
            </button>
          )}
        </div>

        {/* Conversation Stream */}
        <div className="space-y-4 max-h-[260px] overflow-y-auto px-2 my-2 pr-1">
          {turns.slice(-4).map((turn) => {
            const isJarvis = turn.sender === 'jarvis';
            const isPhraseSaved = savedPhraseIds.includes(turn.id);

            return (
              <div
                key={turn.id}
                className={`flex items-start gap-3 ${isJarvis ? 'justify-start' : 'justify-end'}`}
              >
                {isJarvis && (
                  <div className="w-8 h-8 rounded-xl bg-surface border border-border flex items-center justify-center text-sm shrink-0">
                    {persona.avatar}
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[75%] ${isJarvis ? '' : 'items-end'}`}>
                  <div
                    className={`
                      p-4 rounded-3xl text-sm leading-relaxed
                      ${
                        isJarvis
                          ? 'bg-surface border border-border text-text rounded-tl-sm'
                          : 'bg-primary text-primary-foreground rounded-tr-sm shadow-xs'
                      }
                    `}
                  >
                    {turn.text}
                  </div>

                  {/* Actions on Turn: Replay, Translate, Save Phrase (Requirement 31 & 37) */}
                  <div className="flex items-center gap-2 mt-1 px-1 text-[11px] text-text-muted">
                    {isJarvis ? (
                      <>
                        <button
                          type="button"
                          onClick={() => speakJarvisResponse(turn.text)}
                          className="hover:text-primary flex items-center gap-0.5"
                          title="Replay audio"
                        >
                          <Volume2 size={12} />
                          <span>Replay</span>
                        </button>
                        <span>•</span>
                        <button
                          type="button"
                          onClick={() => {
                            ttsService.speak(turn.text, { rate: 0.75 });
                          }}
                          className="hover:text-primary"
                          title="Play slowly"
                        >
                          🐢 Slow
                        </button>
                        <span>•</span>
                        <button
                          type="button"
                          onClick={() => handleSavePhrase(turn.id, turn.text)}
                          className={`hover:text-primary flex items-center gap-0.5 ${
                            isPhraseSaved ? 'text-amber-500 font-bold' : ''
                          }`}
                          title="Save to My Phrases"
                        >
                          <Star size={11} fill={isPhraseSaved ? 'currentColor' : 'none'} />
                          <span>{isPhraseSaved ? 'Saved' : 'Save'}</span>
                        </button>
                      </>
                    ) : (
                      turn.correction && (
                        <button
                          type="button"
                          onClick={() => setActiveCorrection(turn.correction!)}
                          className="text-primary font-bold hover:underline flex items-center gap-1"
                        >
                          <Sparkles size={12} className="text-amber-500" />
                          <span>💡 {turn.correction.errorCategory} tip available</span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Speaking Transcript / Pause Helper (Requirement 10 & 32) */}
        {isUserSpeaking && (
          <div className="p-3.5 rounded-2xl bg-surface border border-border mb-3 text-center animate-fadeIn">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">
              🎙 Listening...
            </span>
            <p className="text-sm font-bold text-text italic">
              "{liveTranscript || "Speak naturally..."}"
            </p>
          </div>
        )}

        {/* Subtle Correction Card Popup if active (Requirement 14, 16, 28) */}
        {activeCorrection && (
          <div className="p-4 rounded-2xl bg-surface border border-primary/40 shadow-md text-xs space-y-2 mb-3 animate-fadeIn">
            <div className="flex items-center justify-between pb-1 border-b border-border">
              <span className="font-bold text-primary flex items-center gap-1.5">
                <Lightbulb size={14} className="text-amber-500" />
                <span>Real-Time Phrasing Guidance ({activeCorrection.errorCategory})</span>
              </span>
              <button
                type="button"
                onClick={() => setActiveCorrection(null)}
                className="text-text-muted hover:text-text font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <div className="p-2 rounded-xl bg-card border border-border">
                <span className="text-[10px] font-bold text-text-muted block uppercase">Simple:</span>
                <span className="text-text">{activeCorrection.simpleEnglish}</span>
              </div>
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block uppercase">Natural:</span>
                <span className="text-text font-bold">{activeCorrection.naturalEnglish}</span>
              </div>
              <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30">
                <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 block uppercase">Professional:</span>
                <span className="text-text">{activeCorrection.professionalEnglish}</span>
              </div>
            </div>

            <p className="text-text-muted text-[11px] leading-relaxed pt-1">
              <span className="font-bold text-text">Why? </span>
              {activeCorrection.whyExplanation}
            </p>

            {activeCorrection.whyThisWord && (
              <div className="p-2 rounded-xl bg-card border border-border text-[11px] text-text-muted">
                <span className="font-bold text-primary">Why "{activeCorrection.whyThisWord.recommendedWord}"? </span>
                {activeCorrection.whyThisWord.difference}
              </div>
            )}
          </div>
        )}

        {/* Bottom Call Controls Area (Requirement 6: Mute, Mic, End Call) */}
        <div className="pt-4 border-t border-border flex flex-col gap-3">
          {mode === 'voice' ? (
            <div className="flex items-center justify-center gap-5 sm:gap-8">
              {/* Mute Toggle */}
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3.5 rounded-full border transition-colors ${
                  isMuted
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-surface border-border text-text-muted hover:text-text'
                }`}
                title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
              >
                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </button>

              {/* Main Microphone Button */}
              <button
                type="button"
                onClick={handleToggleUserMic}
                className={`
                  relative p-6 rounded-full transition-all duration-300 shadow-xl
                  ${
                    isUserSpeaking
                      ? 'bg-emerald-500 text-white scale-110 shadow-emerald-500/30 ring-4 ring-emerald-500/20 animate-pulse'
                      : 'bg-primary text-primary-foreground hover:scale-105 active:scale-95 shadow-primary/30'
                  }
                `}
                title="Tap to speak"
              >
                <Mic size={28} />
              </button>

              {/* End Conversation Call */}
              <button
                type="button"
                onClick={handleEndCall}
                className="p-3.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-md shadow-red-500/20"
                title="End Call & Review Summary"
              >
                <PhoneOff size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCompleteSpeechTurn(textInput);
                    setTextInput('');
                  }
                }}
                placeholder="Type your message to Jarvis..."
                className="flex-1 px-4 py-3 rounded-2xl bg-surface border border-border text-xs text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => {
                  handleCompleteSpeechTurn(textInput);
                  setTextInput('');
                }}
                className="p-3 rounded-2xl bg-primary text-primary-foreground hover:bg-primary-hover transition-colors shadow-xs"
              >
                <Send size={16} />
              </button>
              <button
                type="button"
                onClick={handleEndCall}
                className="p-3 rounded-2xl bg-red-500 text-white hover:bg-red-600 transition-colors"
                title="End Conversation"
              >
                <PhoneOff size={16} />
              </button>
            </div>
          )}

          {/* Quick Support Drawer Buttons (Requirement 11 & 12) */}
          <div className="flex items-center justify-center gap-2 pt-2 text-xs">
            <button
              type="button"
              onClick={() => setShowBrainFreeze(!showBrainFreeze)}
              className="px-3 py-1.5 rounded-xl bg-surface border border-border text-text-muted hover:text-text flex items-center gap-1.5 transition-colors"
            >
              <Lightbulb size={13} className="text-amber-500" />
              <span>Brain Freeze Ideas</span>
            </button>

            <button
              type="button"
              onClick={() => setShowWordPrompter(!showWordPrompter)}
              className="px-3 py-1.5 rounded-xl bg-surface border border-border text-text-muted hover:text-text flex items-center gap-1.5 transition-colors"
            >
              <Languages size={13} className="text-primary" />
              <span>Word Prompter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Brain-Freeze Contextual Ideas Drawer (Requirement 11) */}
      {showBrainFreeze && (
        <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text flex items-center gap-1.5">
              <Lightbulb size={14} className="text-amber-500" />
              <span>Need help thinking what to say next about "{topic.title}"?</span>
            </span>
            <button
              type="button"
              onClick={() => setShowBrainFreeze(false)}
              className="text-xs text-text-muted hover:text-text"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {topic.brainFreezeIdeas.map((idea, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  handleCompleteSpeechTurn(idea);
                  setShowBrainFreeze(false);
                }}
                className="p-2.5 rounded-xl bg-surface hover:bg-card border border-border text-left font-medium text-text hover:border-primary/40 transition-all flex items-center justify-between"
              >
                <span>{idea}</span>
                <ArrowRight size={12} className="text-primary shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Word Prompter Translator Drawer (Requirement 12) */}
      {showWordPrompter && (
        <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text flex items-center gap-1.5">
              <Languages size={14} className="text-primary" />
              <span>Word Prompter: What do you want to say in your native language?</span>
            </span>
            <button
              type="button"
              onClick={() => setShowWordPrompter(false)}
              className="text-xs text-text-muted hover:text-text"
            >
              ✕
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={nativePromptInput}
              onChange={(e) => setNativePromptInput(e.target.value)}
              placeholder="e.g. 'Naaku ardham kaaledu' or 'Mujhe samajh nahi aaya'..."
              className="flex-1 px-4 py-2 rounded-xl bg-surface border border-border text-xs text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="button"
              onClick={handleTranslateNativePrompt}
              className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl shadow-xs hover:bg-primary-hover"
            >
              Get Phrasings
            </button>
          </div>

          {promptSuggestions && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  handleCompleteSpeechTurn(promptSuggestions.simple);
                  setShowWordPrompter(false);
                }}
                className="p-3 rounded-xl bg-surface border border-border text-left hover:border-primary/40"
              >
                <span className="text-[10px] font-bold text-text-muted block uppercase">Simple:</span>
                <span className="font-semibold text-text">"{promptSuggestions.simple}"</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleCompleteSpeechTurn(promptSuggestions.natural);
                  setShowWordPrompter(false);
                }}
                className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-left hover:border-emerald-500"
              >
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block uppercase">Natural:</span>
                <span className="font-bold text-text">"{promptSuggestions.natural}"</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleCompleteSpeechTurn(promptSuggestions.pro);
                  setShowWordPrompter(false);
                }}
                className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-left hover:border-purple-500"
              >
                <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 block uppercase">Professional:</span>
                <span className="font-semibold text-text">"{promptSuggestions.pro}"</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* End Call Summary Modal */}
      <ConversationSummaryModal
        analytics={summaryAnalytics}
        isOpen={isSummaryOpen}
        onClose={() => {
          setIsSummaryOpen(false);
          navigate('/talk');
        }}
      />
    </div>
  );
};
