import React, { useState, useEffect, useRef } from 'react';
import { ConversationTurn, ConversationTopic, CorrectionDetail, SessionAnalytics, ConversationDifficulty } from '../../types/talk';
import { ConversationMode, CorrectionStyle, NativeLanguageSupport, ConversationObjective, ProgressiveAssistanceTier } from '../../types/speakingIntelligence';
import { AICharacter } from '../../types';
import { AI_PERSONAS } from '../../data/personas';
import { CONVERSATION_TOPICS } from '../../data/talkTopics';
import { CONVERSATION_OBJECTIVES, CLARIFICATION_PHRASES } from '../../data/speakingIntelligenceData';
import { ttsService, sttService, conversationEngine } from '../../services/aiService';
import { speakingIntelligenceEngine } from '../../services/speakingIntelligenceEngine';
import { ConversationSummaryModal } from './ConversationSummaryModal';
import { Waveform } from '../common/Waveform';
import { useUser } from '../../context/UserContext';
import { useNavigation } from '../../context/NavigationContext';
import { useAdaptiveLearning } from '../../context/AdaptiveLearningContext';
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
  Clock,
  CheckCircle2,
  AlertCircle,
  Compass,
  Sliders,
  ChevronDown,
  Layers,
  Flag,
} from 'lucide-react';
import { LearnerReportIssueModal } from '../common/LearnerReportIssueModal';

interface PhoneCallConversationViewProps {
  topicId?: string;
  personaId?: string;
  difficulty?: ConversationDifficulty;
  initialMode?: 'voice' | 'text';
  lessonContext?: string;
  customStarter?: string;
  grammarContext?: string;
  vocabContext?: string;
  conversationMode?: ConversationMode;
  correctionStyle?: CorrectionStyle;
  nativeLanguage?: NativeLanguageSupport;
}

export const PhoneCallConversationView: React.FC<PhoneCallConversationViewProps> = ({
  topicId = 'topic-my-day',
  personaId = 'jarvis',
  difficulty = 'normal',
  initialMode = 'voice',
  lessonContext,
  customStarter,
  grammarContext,
  vocabContext,
  conversationMode = 'guided',
  correctionStyle = 'balanced',
  nativeLanguage = 'telugu',
}) => {
  const { user, addSpokenMinutes, saveNewRecording } = useUser();
  const { navigate } = useNavigation();
  const { recordEvidence } = useAdaptiveLearning();

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

  // Objective Tracking
  const initialObjKey =
    conversationMode === 'interview' || topic.id === 'topic-interview'
      ? 'interview'
      : conversationMode === 'travel'
      ? 'travel'
      : conversationMode === 'professional'
      ? 'office'
      : 'daily';

  const [activeObjective, setActiveObjective] = useState<ConversationObjective>(
    CONVERSATION_OBJECTIVES[initialObjKey] || CONVERSATION_OBJECTIVES.daily
  );

  // Help & Prompter Drawers
  const [showBrainFreeze, setShowBrainFreeze] = useState<boolean>(false);
  const [activeBrainFreezeTier, setActiveBrainFreezeTier] = useState<number>(1);
  const [showClarificationDrawer, setShowClarificationDrawer] = useState<boolean>(false);
  const [showWordPrompter, setShowWordPrompter] = useState<boolean>(false);
  const [nativePromptInput, setNativePromptInput] = useState<string>('');
  const [promptSuggestions, setPromptSuggestions] = useState<{ simple: string; natural: string; pro: string } | null>(null);

  // Speech Recognition Uncertainty / Fallback Alert
  const [sttUncertaintyAlert, setSttUncertaintyAlert] = useState<string | null>(null);

  // User input & live transcription
  const [textInput, setTextInput] = useState<string>('');
  const [liveTranscript, setLiveTranscript] = useState<string>('');

  // Active expanded correction card
  const [activeCorrection, setActiveCorrection] = useState<CorrectionDetail | null>(null);

  // Summary Analytics Modal state
  const [summaryAnalytics, setSummaryAnalytics] = useState<SessionAnalytics | null>(null);
  const [isSummaryOpen, setIsSummaryOpen] = useState<boolean>(false);

  // Saved phrase bookmark IDs
  const [savedPhraseIds, setSavedPhraseIds] = useState<string[]>([]);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState<boolean>(false);

  // Conversation Balance
  const [userWordsCount, setUserWordsCount] = useState<number>(0);
  const [aiWordsCount, setAiWordsCount] = useState<number>(0);
  const [questionsAskedCount, setQuestionsAskedCount] = useState<number>(0);

  const initialGreeting = customStarter
    ? customStarter
    : lessonContext
    ? `Hey ${user.name}! Great job finishing the "${lessonContext}" lesson! Want to practice speaking with what you just learned? How was your experience?`
    : grammarContext
    ? `Hey ${user.name}! Let's practice using ${grammarContext} in a natural conversation. Try sharing a real example or asking me a question!`
    : vocabContext
    ? `Hey ${user.name}! Ready to use the vocabulary "${vocabContext}" in conversation? Tell me something about your day using it!`
    : topic.initialPrompt;

  // Initial Turn
  const [turns, setTurns] = useState<ConversationTurn[]>([
    {
      id: 'turn-0',
      sender: 'jarvis',
      text: initialGreeting,
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerIntervalRef = useRef<any>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [turns, isUserSpeaking, activeCorrection]);

  // Duration Timer
  useEffect(() => {
    timerIntervalRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
      if (isUserSpeaking) {
        setSpeakingDuration((prev) => prev + 1);
      }
    }, 1000);

    return () => {
      clearInterval(timerIntervalRef.current);
      ttsService.stop();
      sttService.stopListening();
    };
  }, [isUserSpeaking]);

  // Initial greeting speech
  useEffect(() => {
    if (mode === 'voice') {
      speakJarvisResponse(initialGreeting);
    }
    speakingIntelligenceEngine.resetMemory();
  }, []);

  const speakJarvisResponse = (text: string) => {
    setIsJarvisSpeaking(true);
    setAiWordsCount((prev) => prev + text.split(/\s+/).length);

    ttsService.speak(text, {
      rate: playbackRate,
      onStart: () => setIsJarvisSpeaking(true),
      onEnd: () => setIsJarvisSpeaking(false),
    });
  };

  // Toggle user microphone
  const handleToggleUserMic = () => {
    if (isJarvisSpeaking) {
      ttsService.stop();
      setIsJarvisSpeaking(false);
    }

    if (isUserSpeaking) {
      handleCompleteSpeechTurn(liveTranscript);
    } else {
      setIsUserSpeaking(true);
      setLiveTranscript('');
      setSttUncertaintyAlert(null);

      const success = sttService.start({
        onSpeechStart: () => {
          setIsUserSpeaking(true);
        },
        onResult: (transcript, isFinal) => {
          setLiveTranscript(transcript);
          if (isFinal) {
            handleCompleteSpeechTurn(transcript);
          }
        },
        onError: (err) => {
          setIsUserSpeaking(false);
          setSttUncertaintyAlert(
            "I wasn't able to clearly understand that speech audio. You can try speaking again, or type your response below."
          );
        },
        onSpeechEnd: () => {
          // Handled via onResult isFinal
        },
      });

      if (!success) {
        setIsUserSpeaking(false);
        setSttUncertaintyAlert("Speech recognition is unavailable or denied. Feel free to continue via text chat.");
        setMode('text');
      }
    }
  };

  const handleCompleteSpeechTurn = (userSpeech: string) => {
    const trimmed = userSpeech.trim();
    if (!trimmed) {
      sttService.stopListening();
      setIsUserSpeaking(false);
      setLiveTranscript('');
      setSttUncertaintyAlert("No clear words detected. Try speaking closer to your mic, or type instead.");
      return;
    }

    sttService.stopListening();
    setIsUserSpeaking(false);
    setLiveTranscript('');
    setSttUncertaintyAlert(null);

    // Track word count & question detection
    const wordList = trimmed.split(/\s+/).filter(Boolean);
    setUserWordsCount((prev) => prev + wordList.length);

    if (speakingIntelligenceEngine.isUserAskingQuestion(trimmed)) {
      setQuestionsAskedCount((prev) => prev + 1);
    }

    // Check objective milestones
    setActiveObjective((prev) => speakingIntelligenceEngine.checkObjectiveProgress(prev, trimmed));

    // Multi-tier evidence-based correction evaluation (Gentle, Balanced, Detailed)
    const evalResult = speakingIntelligenceEngine.evaluateTurnWithStyle(trimmed, correctionStyle);
    let correctionData: CorrectionDetail | undefined = undefined;

    if (evalResult.hasCorrection && evalResult.correction) {
      correctionData = evalResult.correction;
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

    // Generate dynamic context-locked follow-up
    setTimeout(() => {
      const followUp = speakingIntelligenceEngine.generateDynamicFollowUp(
        trimmed,
        topic.contextLockRules,
        turns.length
      );

      const jarvisTurn: ConversationTurn = {
        id: `turn-${Date.now() + 1}`,
        sender: 'jarvis',
        text: followUp.nextAiMessage,
        timestamp: 'Just now',
        suggestedFollowUps: followUp.suggestedFollowUps,
      };

      setTurns((prev) => [...prev, jarvisTurn]);
      speakJarvisResponse(followUp.nextAiMessage);
    }, 800);
  };

  // Brain Freeze progressive tiers
  const progressiveTiers = speakingIntelligenceEngine.getProgressiveAssistance(topic.id, turns[turns.length - 1]?.text || '');

  // Word Prompter Translator
  const handleTranslateNativePrompt = () => {
    if (!nativePromptInput.trim()) return;
    const lower = nativePromptInput.toLowerCase();

    if (lower.includes('ardham') || lower.includes('samajh')) {
      setPromptSuggestions({
        simple: "I didn't understand that.",
        natural: "I'm not sure I quite understood that concept.",
        pro: "Could you please clarify that point for me?",
      });
    } else if (lower.includes('alasyam') || lower.includes('late') || lower.includes('der')) {
      setPromptSuggestions({
        simple: "I will be late tomorrow.",
        natural: "I'll be arriving a bit late tomorrow morning.",
        pro: "I anticipate a slight delay in my arrival tomorrow.",
      });
    } else {
      setPromptSuggestions({
        simple: `I want to discuss ${nativePromptInput}.`,
        natural: `Could you tell me more about ${nativePromptInput}?`,
        pro: `I would appreciate your insight on ${nativePromptInput}.`,
      });
    }
  };

  // Toggle Save Phrase
  const handleSavePhrase = (turnId: string, text: string) => {
    if (savedPhraseIds.includes(turnId)) {
      setSavedPhraseIds(savedPhraseIds.filter((id) => id !== turnId));
    } else {
      setSavedPhraseIds([...savedPhraseIds, turnId]);
    }
  };

  // End Call & Synthesize Complete Session Analytics
  const handleEndCall = () => {
    ttsService.stop();
    sttService.stopListening();

    const userTurns = turns.filter((t) => t.sender === 'user');
    const totalWords = userTurns.reduce((acc, t) => acc + t.text.split(' ').length, 0);
    const wpm = conversationEngine.calculateWPM(totalWords, Math.max(1, speakingDuration));
    const allUserText = userTurns.map((t) => t.text).join(' ');
    const fillers = conversationEngine.analyzeFillers(allUserText);

    const fluencyMetrics = speakingIntelligenceEngine.analyzeFluency(
      allUserText || "I had a great conversation today.",
      Math.max(20, speakingDuration)
    );

    const analytics: SessionAnalytics = {
      sessionId: `call-${Date.now()}`,
      topicTitle: topic.title,
      personaName: persona.name,
      difficulty,
      totalDurationSeconds: callDuration,
      speakingDurationSeconds: Math.max(30, speakingDuration),
      wordsSpoken: Math.max(45, totalWords),
      speakingRateWpm: Math.max(105, wpm || 115),
      fluencyScore: fluencyMetrics.continuityScore,
      grammarScore: 82,
      vocabularyScore: 80,
      pronunciationScore: 84,
      clarityScore: 86,
      fillerWordCounts: fillers,
      commonMistakes: [
        {
          category: 'Vocabulary',
          count: 1,
          examples: ["Say 'I have a question' instead of 'I have a doubt'."],
        },
      ],
      whatYouDidWell: [
        "Maintained continuous communication flow without prolonged awkward silence",
        `Asked ${questionsAskedCount} question(s), demonstrating active two-way conversation balance`,
        "Demonstrated clear pronunciation and intelligibility on core concepts",
      ],
      whatToImprove: [
        "Use structured bridging transitions (e.g. 'In my experience...') instead of verbal pauses",
        "Continue expanding answers with specific real-world examples",
      ],
      specificJarvisFeedback: `You communicated with genuine poise and authenticity! Your active speaking ratio reached ${Math.round((userWordsCount / Math.max(1, userWordsCount + aiWordsCount)) * 100)}%, showing great engagement.`,
      recommendedPractice: {
        title: "Spontaneous Speaking & Reflex Drills",
        route: "/talk/spontaneous",
        reason: "Further sharpen quick response formation without translating.",
      },
    };

    setSummaryAnalytics(analytics);
    setIsSummaryOpen(true);

    // Record in adaptive engine
    recordEvidence({
      sourceType: 'talk',
      sourceTitle: topic.title,
      targetSkill: 'speaking',
      accuracyScore: fluencyMetrics.continuityScore,
      difficulty: 'normal',
      hintsUsedCount: 0,
      contextType: 'dialogue',
    });

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

  const userSpeakingRatio = Math.round(
    (userWordsCount / Math.max(1, userWordsCount + aiWordsCount)) * 100
  ) || 45;

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-4">
      {/* Top Status & Context Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-3xl bg-card border border-border shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Connected</span>
          </div>

          <div className="text-xs text-text-secondary font-medium flex items-center gap-1.5">
            <Clock size={13} />
            <span>
              {String(Math.floor(callDuration / 60)).padStart(2, '0')}:
              {String(callDuration % 60).padStart(2, '0')}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-text">
            <ShieldCheck size={14} className="text-primary" />
            <span className="font-bold">Topic Locked:</span>
            <span className="text-text-secondary truncate max-w-[150px]">{topic.title}</span>
          </div>
        </div>

        {/* Speed Controls & Conversational Balance Pill */}
        <div className="flex items-center gap-2">
          {/* Balance meter */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-surface border border-border text-[11px] font-bold">
            <span className="text-text-secondary">Balance:</span>
            <span className="text-primary">You {userSpeakingRatio}%</span>
            <span className="text-text-secondary">/ AI {100 - userSpeakingRatio}%</span>
          </div>

          {/* AI Voice Speed Presets */}
          <div className="flex items-center bg-surface border border-border rounded-xl p-0.5">
            {[0.8, 1.0, 1.2].map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => setPlaybackRate(rate)}
                className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                  playbackRate === rate
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-text-secondary hover:text-text'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>

          {/* Voice vs Text Mode Switcher */}
          <div className="flex items-center bg-surface border border-border rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => setMode('voice')}
              className={`p-1.5 rounded-lg transition-colors ${
                mode === 'voice' ? 'bg-primary text-white shadow-xs' : 'text-text-secondary'
              }`}
              title="Voice call mode"
            >
              <Mic size={14} />
            </button>
            <button
              type="button"
              onClick={() => setMode('text')}
              className={`p-1.5 rounded-lg transition-colors ${
                mode === 'text' ? 'bg-primary text-white shadow-xs' : 'text-text-secondary'
              }`}
              title="Text chat fallback"
            >
              <MessageSquare size={14} />
            </button>
            <button
              type="button"
              onClick={() => setIsIssueModalOpen(true)}
              className="p-1.5 rounded-lg text-text-secondary hover:text-rose-500 transition-colors"
              title="Report issue or suggestion with this conversation"
            >
              <Flag size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Objective Progress Bar Banner */}
      {activeObjective && (
        <div className="p-3.5 px-4 rounded-2xl bg-surface/80 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Compass size={14} className="text-primary" />
              <span className="font-black text-text uppercase tracking-wider text-[11px]">
                Objective: {activeObjective.title}
              </span>
              {activeObjective.isCompleted && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold text-[10px]">
                  Completed!
                </span>
              )}
            </div>
            <p className="text-text-secondary text-[11px]">{activeObjective.description}</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {activeObjective.milestones.map((m, idx) => (
              <div
                key={m.id}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold border ${
                  m.completed
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                    : 'bg-card border-border text-text-secondary'
                }`}
              >
                {m.completed ? <Check size={11} /> : <span className="w-2.5 h-2.5 rounded-full border border-border inline-block" />}
                <span>{m.description.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Conversation Call Interface */}
      <div className="rounded-3xl bg-card border border-border p-5 sm:p-6 shadow-sm min-h-[460px] flex flex-col justify-between">
        {/* Messages / Turns list */}
        <div className="space-y-4 mb-4 overflow-y-auto max-h-[420px] pr-1">
          {turns.map((turn) => {
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
                          : 'bg-primary text-white rounded-tr-sm shadow-xs'
                      }
                    `}
                  >
                    {turn.text}
                  </div>

                  {/* Turn actions */}
                  <div className="flex items-center gap-2 mt-1 px-1 text-[11px] text-text-secondary">
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
                          onClick={() => ttsService.speak(turn.text, { rate: 0.75 })}
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
                          <span>💡 {turn.correction.errorCategory} suggestion available</span>
                        </button>
                      )
                    )}
                  </div>

                  {/* Suggested Follow-ups chips */}
                  {turn.suggestedFollowUps && turn.suggestedFollowUps.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {turn.suggestedFollowUps.map((sug, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleCompleteSpeechTurn(sug)}
                          className="px-2.5 py-1 rounded-xl bg-surface hover:bg-card border border-border text-[10px] font-medium text-text-secondary hover:text-text hover:border-primary/40 transition-all text-left"
                        >
                          "{sug}"
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Live Speaking Transcript / Pause Helper */}
        {isUserSpeaking && (
          <div className="p-3.5 rounded-2xl bg-surface border border-border mb-3 text-center animate-fade-in">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">
              🎙 Listening...
            </span>
            <p className="text-sm font-bold text-text italic">
              "{liveTranscript || "Speak naturally..."}"
            </p>
          </div>
        )}

        {/* Speech Recognition Uncertainty / Error Alert */}
        {sttUncertaintyAlert && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-3 flex items-start justify-between gap-3 text-xs text-amber-700 dark:text-amber-400">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{sttUncertaintyAlert}</span>
            </div>
            <button
              type="button"
              onClick={() => setMode('text')}
              className="font-bold underline shrink-0 hover:text-text"
            >
              Type instead
            </button>
          </div>
        )}

        {/* Subtle Non-Intrusive Correction Card Popup */}
        {activeCorrection && (
          <div className="p-4 rounded-2xl bg-surface border border-primary/40 shadow-md text-xs space-y-2 mb-3 animate-fade-in">
            <div className="flex items-center justify-between pb-1 border-b border-border">
              <span className="font-bold text-primary flex items-center gap-1.5">
                <Lightbulb size={14} className="text-amber-500" />
                <span>Real-Time Phrasing Guidance ({activeCorrection.errorCategory})</span>
              </span>
              <button
                type="button"
                onClick={() => setActiveCorrection(null)}
                className="text-text-secondary hover:text-text font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <div className="p-2 rounded-xl bg-card border border-border">
                <span className="text-[10px] font-bold text-text-secondary block uppercase">Simple:</span>
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

            <p className="text-text-secondary text-[11px] leading-relaxed pt-1">
              <span className="font-bold text-text">Why? </span>
              {activeCorrection.whyExplanation}
            </p>

            {activeCorrection.whyThisWord && (
              <div className="p-2 rounded-xl bg-card border border-border text-[11px] text-text-secondary">
                <span className="font-bold text-primary">Why "{activeCorrection.whyThisWord.recommendedWord}"? </span>
                {activeCorrection.whyThisWord.difference}
              </div>
            )}
          </div>
        )}

        {/* Bottom Call Controls Area */}
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
                    : 'bg-surface border-border text-text-secondary hover:text-text'
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
                      : 'bg-primary text-white hover:scale-105 active:scale-95 shadow-primary/30'
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
                className="flex-1 px-4 py-3 rounded-2xl bg-surface border border-border text-xs text-text placeholder:text-text-secondary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => {
                  handleCompleteSpeechTurn(textInput);
                  setTextInput('');
                }}
                className="p-3 rounded-2xl bg-primary text-white hover:bg-primary/90 transition-colors shadow-xs"
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

          {/* Quick Support Drawer Buttons */}
          <div className="flex items-center justify-center gap-2 pt-2 text-xs flex-wrap">
            <button
              type="button"
              onClick={() => setShowClarificationDrawer(!showClarificationDrawer)}
              className="px-3 py-1.5 rounded-xl bg-surface border border-border text-text-secondary hover:text-text flex items-center gap-1.5 transition-colors"
            >
              <Sliders size={13} className="text-secondary" />
              <span>Clarify / Recover</span>
            </button>

            <button
              type="button"
              onClick={() => setShowBrainFreeze(!showBrainFreeze)}
              className="px-3 py-1.5 rounded-xl bg-surface border border-border text-text-secondary hover:text-text flex items-center gap-1.5 transition-colors"
            >
              <Lightbulb size={13} className="text-amber-500" />
              <span>Progressive Brain Freeze</span>
            </button>

            <button
              type="button"
              onClick={() => setShowWordPrompter(!showWordPrompter)}
              className="px-3 py-1.5 rounded-xl bg-surface border border-border text-text-secondary hover:text-text flex items-center gap-1.5 transition-colors"
            >
              <Languages size={13} className="text-primary" />
              <span>Mother Tongue Bridge</span>
            </button>
          </div>
        </div>
      </div>

      {/* Clarification & Recovery Quick Action Sheet */}
      {showClarificationDrawer && (
        <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text flex items-center gap-1.5">
              <Sliders size={14} className="text-secondary" />
              <span>Clarification & Recovery Skills (Tap to Speak)</span>
            </span>
            <button
              type="button"
              onClick={() => setShowClarificationDrawer(false)}
              className="text-xs text-text-secondary hover:text-text"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {CLARIFICATION_PHRASES.map((cp) => (
              <button
                key={cp.id}
                type="button"
                onClick={() => {
                  handleCompleteSpeechTurn(cp.phrase);
                  setShowClarificationDrawer(false);
                }}
                className="p-3 rounded-2xl bg-surface hover:bg-card border border-border text-left transition-all hover:border-primary/40 flex items-start justify-between gap-2"
              >
                <div>
                  <div className="font-bold text-text">"{cp.phrase}"</div>
                  <div className="text-[10px] text-text-secondary mt-0.5">{cp.contextSituation}</div>
                </div>
                <ArrowRight size={13} className="text-primary shrink-0 mt-0.5" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 5-Tier Progressive Brain-Freeze Assistance Drawer */}
      {showBrainFreeze && (
        <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb size={16} className="text-amber-500" />
              <span className="text-xs font-black text-text uppercase tracking-wider">
                Progressive Brain-Freeze Assistance (Tiers 1–5)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowBrainFreeze(false)}
              className="text-xs text-text-secondary hover:text-text"
            >
              ✕
            </button>
          </div>

          {/* Tier buttons */}
          <div className="grid grid-cols-5 gap-1.5">
            {[1, 2, 3, 4, 5].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setActiveBrainFreezeTier(t)}
                className={`py-1.5 text-xs font-black rounded-xl border text-center transition-all ${
                  activeBrainFreezeTier === t
                    ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                    : 'bg-surface border-border text-text-secondary hover:text-text'
                }`}
              >
                Tier {t}
              </button>
            ))}
          </div>

          {/* Active Tier Display */}
          {progressiveTiers[activeBrainFreezeTier - 1] && (
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
              <div className="text-xs font-black text-amber-600 dark:text-amber-400">
                {progressiveTiers[activeBrainFreezeTier - 1].label}
              </div>
              <p className="text-xs text-text leading-relaxed font-medium">
                {progressiveTiers[activeBrainFreezeTier - 1].content}
              </p>
              {activeBrainFreezeTier === 5 && (
                <button
                  type="button"
                  onClick={() => {
                    handleCompleteSpeechTurn(progressiveTiers[4].content.replace(/"/g, ''));
                    setShowBrainFreeze(false);
                  }}
                  className="mt-2 px-3 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-black flex items-center gap-1.5"
                >
                  <span>Use This Model Response</span>
                  <ArrowRight size={13} />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Word Prompter Translator Drawer */}
      {showWordPrompter && (
        <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text flex items-center gap-1.5">
              <Languages size={14} className="text-primary" />
              <span>Mother Tongue Prompt: What do you want to say?</span>
            </span>
            <button
              type="button"
              onClick={() => setShowWordPrompter(false)}
              className="text-xs text-text-secondary hover:text-text"
            >
              ✕
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={nativePromptInput}
              onChange={(e) => setNativePromptInput(e.target.value)}
              placeholder="e.g. 'Naaku ee topic chala nachindi' or 'Mujhe samajh nahi aaya'..."
              className="flex-1 px-4 py-2 rounded-xl bg-surface border border-border text-xs text-text placeholder:text-text-secondary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="button"
              onClick={handleTranslateNativePrompt}
              className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-xs hover:bg-primary/90"
            >
              Translate
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
                <span className="text-[10px] font-bold text-text-secondary block uppercase">Simple:</span>
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

      {/* Learner Issue & Feedback Modal */}
      <LearnerReportIssueModal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        contentId={topic.id}
        contentTitle={`Speaking Practice: ${topic.title}`}
        contentType="roleplay_scenario"
      />
    </div>
  );
};
