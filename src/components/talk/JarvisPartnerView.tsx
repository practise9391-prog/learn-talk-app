import React, { useState, useEffect, useRef } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { VoiceButton, VoiceButtonState } from '../common/VoiceButton';
import { Waveform } from '../common/Waveform';
import { QUICK_TOPICS } from '../../data/topics';
import { useUser } from '../../context/UserContext';
import { useCoreJourney } from '../../context/CoreJourneyContext';
import { JarvisCoachMode, ProgressiveHintState } from '../../types/coreJourney';
import { ttsService, sttService, conversationEngine } from '../../services/aiService';
import { speakingIntelligenceEngine } from '../../services/speakingIntelligenceEngine';
import {
  Bot,
  Sparkles,
  Shuffle,
  Send,
  Lightbulb,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Languages,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  correctionFeedback?: string;
  naturalAlternative?: string;
  teluguTip?: string;
  hindiTip?: string;
}

export const JarvisPartnerView: React.FC = () => {
  const { user, addSpokenMinutes } = useUser();
  const { explanationLanguage } = useCoreJourney();

  const [activeTopic, setActiveTopic] = useState(QUICK_TOPICS[0]);
  const [activeMode, setActiveMode] = useState<JarvisCoachMode>('guided');
  const [voiceState, setVoiceState] = useState<VoiceButtonState>('idle');
  const [isSpeakingAI, setIsSpeakingAI] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hintTier, setHintTier] = useState<number>(0);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: "Hello! I'm Jarvis, your personal English speaking coach. Today we are practicing: " + QUICK_TOPICS[0].title + ". I will help you speak clearly and confidently.",
      timestamp: 'Just now',
    },
    {
      id: 'init-2',
      sender: 'ai',
      text: QUICK_TOPICS[0].starterPrompt,
      timestamp: 'Just now',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speakText = (text: string) => {
    if (isMuted) return;
    setIsSpeakingAI(true);
    ttsService.speak(text, {
      rate: 0.95,
      pitch: 1.0,
      onStart: () => setIsSpeakingAI(true),
      onEnd: () => setIsSpeakingAI(false),
    });
  };

  const stopAudio = () => {
    ttsService.stop();
    setIsSpeakingAI(false);
  };

  const handlePickRandomTopic = () => {
    stopAudio();
    const next = QUICK_TOPICS[Math.floor(Math.random() * QUICK_TOPICS.length)];
    setActiveTopic(next);
    setHintTier(0);
    const switchMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: `Let's practice a new topic: ${next.title}. ${next.starterPrompt}`,
      timestamp: 'Just now',
    };
    setMessages((prev) => [...prev, switchMsg]);
    speakText(switchMsg.text);
  };

  const handleProcessUserText = (userText: string) => {
    if (!userText.trim()) return;
    stopAudio();
    addSpokenMinutes(1);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText.trim(),
      timestamp: 'Just now',
    };

    // Analyze response through intelligence engine
    const evalResult = speakingIntelligenceEngine.evaluateTurnWithStyle(userText, 'balanced');
    const feedback = {
      grammarIssues: evalResult.hasCorrection && evalResult.correction ? [evalResult.correction.whyExplanation] : [],
      suggestedModelAnswer: evalResult.correction?.naturalEnglish || evalResult.correction?.simpleEnglish || userText,
    };

    // Formulate contextual AI coach response based on mode
    let aiResponseText = '';
    if (activeMode === 'correction' && feedback.grammarIssues.length > 0) {
      aiResponseText = `Good effort! To sound more natural, let's refine: "${feedback.suggestedModelAnswer}". Could you try saying that?`;
    } else if (activeMode === 'challenge') {
      aiResponseText = `Interesting perspective. But what would happen if the schedule suddenly changed and you had only 10 minutes? How would you handle that?`;
    } else {
      aiResponseText = `That makes total sense! Could you tell me more about what you enjoy most about it?`;
    }

    const aiMessage: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: aiResponseText,
      timestamp: 'Just now',
      correctionFeedback: feedback.grammarIssues.length > 0 ? feedback.grammarIssues[0] : undefined,
      naturalAlternative: feedback.suggestedModelAnswer,
    };

    setMessages((prev) => [...prev, userMessage, aiMessage]);
    setHintTier(0);
    speakText(aiResponseText);
  };

  const handleVoiceToggle = () => {
    if (voiceState === 'idle') {
      // Barge-in: stop AI speaking immediately if talking
      stopAudio();
      setVoiceState('listening');

      const started = sttService.startListening({
        onResult: (transcript, isFinal) => {
          if (isFinal && transcript.trim()) {
            sttService.stopListening();
            setVoiceState('processing');
            setTimeout(() => {
              setVoiceState('idle');
              handleProcessUserText(transcript);
            }, 600);
          }
        },
        onError: () => {
          setVoiceState('idle');
        },
      });

      if (!started) {
        setVoiceState('idle');
      }
    } else {
      sttService.stopListening();
      setVoiceState('idle');
    }
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const txt = inputVal;
    setInputVal('');
    handleProcessUserText(txt);
  };

  const getProgressiveHint = () => {
    const nextTier = Math.min(hintTier + 1, 3);
    setHintTier(nextTier);
  };

  const modesList: Array<{ id: JarvisCoachMode; label: string; desc: string }> = [
    { id: 'guided', label: 'Guided', desc: 'Step-by-step assistance with hints' },
    { id: 'independent', label: 'Independent', desc: 'No starter sentences; speak freely' },
    { id: 'practice', label: 'Practice', desc: 'Repeat phrases & refine flow' },
    { id: 'challenge', label: 'Challenge', desc: 'Unexpected follow-up questions' },
    { id: 'correction', label: 'Correction', desc: 'Immediate grammar & word focus' },
    { id: 'fluency', label: 'Fluency', desc: 'Speak without pause; feedback at end' },
  ];

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 animate-fadeIn pb-12">
      <PageHeader
        title="Jarvis AI Personal Speaking Coach"
        subtitle="Adaptive one-on-one English speaking practice with progressive hints and zero judgment"
        badge="Part 25 • Coach Jarvis"
        showBack={true}
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="p-2.5 rounded-xl bg-card border border-border text-text hover:bg-surface transition-colors"
              title={isMuted ? 'Unmute AI Voice' : 'Mute AI Voice'}
            >
              {isMuted ? <VolumeX size={15} className="text-red-500" /> : <Volume2 size={15} className="text-primary" />}
            </button>
            <button
              type="button"
              onClick={handlePickRandomTopic}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-card border border-border text-xs font-bold text-text hover:bg-surface rounded-xl shadow-xs transition-colors"
            >
              <Shuffle size={14} className="text-primary" />
              <span>Switch Topic</span>
            </button>
          </div>
        }
      />

      {/* Mode Switcher Bar */}
      <div className="flex items-center gap-1.5 p-1.5 bg-card border border-border rounded-2xl overflow-x-auto">
        {modesList.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setActiveMode(m.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeMode === m.id
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-text-muted hover:text-text'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Active Conversation Container */}
      <div className="rounded-3xl bg-card border border-border p-6 shadow-sm min-h-[500px] flex flex-col justify-between">
        {/* Messages List */}
        <div className="space-y-4 mb-6 overflow-y-auto max-h-[460px] pr-2">
          {messages.map((m) => {
            const isAI = m.sender === 'ai';
            return (
              <div
                key={m.id}
                className={`flex items-start gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
              >
                {isAI && (
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                    <Bot size={15} />
                  </div>
                )}
                <div className={`max-w-[85%] space-y-1.5 ${isAI ? 'items-start' : 'items-end'}`}>
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isAI
                        ? 'bg-surface border border-border text-text rounded-tl-sm'
                        : 'bg-primary text-primary-foreground rounded-tr-sm font-medium shadow-xs'
                    }`}
                  >
                    {m.text}
                  </div>

                  {/* Corrections or Alternatives */}
                  {m.naturalAlternative && (
                    <div className="p-3 bg-primary/5 rounded-xl border border-primary/20 text-xs space-y-1">
                      <span className="font-bold text-primary flex items-center gap-1 text-[10px] uppercase">
                        <Sparkles size={11} /> Natural Alternative:
                      </span>
                      <p className="text-text italic font-medium">"{m.naturalAlternative}"</p>
                    </div>
                  )}

                  {m.correctionFeedback && (
                    <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400">
                      💡 {m.correctionFeedback}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Progressive Hint Drawer (Prevents Answer Dependency) */}
        {hintTier > 0 && (
          <div className="p-3.5 mb-4 rounded-2xl bg-surface border border-border text-xs space-y-1.5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="font-bold text-primary text-[10px] uppercase tracking-wider flex items-center gap-1">
                <Lightbulb size={12} /> Coach Scaffolding (Tier {hintTier} of 3)
              </span>
              <button
                type="button"
                onClick={() => setHintTier(0)}
                className="text-text-muted hover:text-text text-[10px]"
              >
                Hide
              </button>
            </div>
            {hintTier === 1 && (
              <p className="text-text-muted">
                <strong>Clue 1:</strong> Think about your immediate routine. What is the very first thing you do in the morning?
              </p>
            )}
            {hintTier === 2 && (
              <p className="text-text-muted">
                <strong>Clue 2:</strong> Start your sentence with: <em>"On Saturday mornings, I usually..."</em>
              </p>
            )}
            {hintTier === 3 && (
              <p className="text-text">
                <strong>Model:</strong> <em>"On Saturday mornings, I like to wake up around eight o'clock and relax with tea."</em> Now try saying your own routine!
              </p>
            )}
          </div>
        )}

        {/* Controls Bar */}
        <div className="space-y-3 pt-3 border-t border-border">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={getProgressiveHint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface hover:bg-card border border-border text-text font-semibold transition-colors"
              >
                <Lightbulb size={13} className="text-amber-500" />
                <span>Need a Hint? ({hintTier}/3)</span>
              </button>
            </div>

            {isSpeakingAI && (
              <span className="text-primary font-bold text-[11px] flex items-center gap-1 animate-pulse">
                <Volume2 size={13} /> Jarvis is speaking... (start speaking to barge-in)
              </span>
            )}
          </div>

          <form onSubmit={handleSendText} className="flex items-center gap-2">
            <VoiceButton state={voiceState} onClick={handleVoiceToggle} size="md" />

            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Or type a response to Jarvis..."
              className="flex-1 px-4 py-3 bg-surface border border-border rounded-2xl text-xs sm:text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
            />

            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="p-3 bg-primary text-primary-foreground rounded-2xl disabled:opacity-40 hover:bg-primary-hover transition-colors shadow-xs"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
