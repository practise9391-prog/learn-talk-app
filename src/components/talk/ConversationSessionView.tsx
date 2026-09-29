import React, { useState } from 'react';
import { ConversationMessage, LocationScenario, AICharacter, ConfidenceMode } from '../../types';
import { AI_PERSONAS } from '../../data/personas';
import { SPEAKING_WORLD_LOCATIONS } from '../../data/locations';
import { VoiceButton, VoiceButtonState } from '../common/VoiceButton';
import { Waveform } from '../common/Waveform';
import { SpeakingHelpModal } from './SpeakingHelpModal';
import { PageHeader } from '../layout/PageHeader';
import { useUser } from '../../context/UserContext';
import { useNavigation } from '../../context/NavigationContext';
import {
  Mic,
  Send,
  HelpCircle,
  Lightbulb,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Volume2
} from 'lucide-react';

interface ConversationSessionViewProps {
  locationId?: string;
  personaId?: string;
  confidenceMode?: ConfidenceMode;
}

export const ConversationSessionView: React.FC<ConversationSessionViewProps> = ({
  locationId = 'tea-shop',
  personaId = 'shopkeeper',
  confidenceMode = 'real_conversation',
}) => {
  const { user, addSpokenMinutes, saveNewRecording } = useUser();
  const { navigate } = useNavigation();

  const location = SPEAKING_WORLD_LOCATIONS.find((l) => l.id === locationId) || SPEAKING_WORLD_LOCATIONS[0];
  const persona = AI_PERSONAS.find((p) => p.id === personaId) || AI_PERSONAS[0];

  const [voiceState, setVoiceState] = useState<VoiceButtonState>('idle');
  const [inputText, setInputText] = useState<string>('');
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [activeAnalysisMsgId, setActiveAnalysisMsgId] = useState<string | null>('msg-1');

  // Initial conversational messages
  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      id: 'msg-0',
      sessionId: 'sess-live-1',
      sender: 'ai',
      text: location.greetingPhrase,
      timestamp: 'Just now',
    },
    {
      id: 'msg-1',
      sessionId: 'sess-live-1',
      sender: 'user',
      text: "I want one tea with less sugar.",
      timestamp: 'Just now',
      naturalVersion: "I'd like a cup of tea with less sugar, please.",
      casualVersion: "I'll take a tea, less sweet please.",
      politeVersion: "Could I please have a cup of tea with less sugar?",
      explanation: "Using 'I'd like...' or 'Could I have...' sounds polite and natural in ordering scenarios. 'I want' can feel abrupt to native ears.",
    },
    {
      id: 'msg-2',
      sessionId: 'sess-live-1',
      sender: 'ai',
      text: "Sure thing! Would you like masala chai or ginger tea? And should I get you some hot samosas with that?",
      timestamp: 'Just now',
    }
  ]);

  const handleVoiceToggle = () => {
    if (voiceState === 'idle') {
      setVoiceState('listening');
      setTimeout(() => setVoiceState('recording'), 400);
    } else if (voiceState === 'recording') {
      setVoiceState('processing');
      // Simulate live transcription & context-locked turn
      setTimeout(() => {
        setVoiceState('idle');
        const userMsg: ConversationMessage = {
          id: `msg-${Date.now()}`,
          sessionId: 'sess-live-1',
          sender: 'user',
          text: "I want ginger tea, and also how much for samosa?",
          timestamp: 'Just now',
          naturalVersion: "I'll go with the ginger tea, thanks. How much are the samosas?",
          casualVersion: "Ginger tea, please! How much for the samosas?",
          politeVersion: "I would love the ginger tea. Could you also tell me the price of the samosas?",
          explanation: "'How much for samosa' needs plural/article agreement: 'How much are the samosas?'. 'I'll go with...' is very natural when selecting between options.",
        };
        const aiMsg: ConversationMessage = {
          id: `msg-${Date.now() + 1}`,
          sessionId: 'sess-live-1',
          sender: 'ai',
          text: "Ginger tea it is! Samosas are twenty rupees each, freshly fried and piping hot. Shall I pack two?",
          timestamp: 'Just now',
        };
        setMessages((prev) => [...prev, userMsg, aiMsg]);
        setActiveAnalysisMsgId(userMsg.id);
        addSpokenMinutes(1);
      }, 1500);
    }
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ConversationMessage = {
      id: `msg-${Date.now()}`,
      sessionId: 'sess-live-1',
      sender: 'user',
      text: inputText,
      timestamp: 'Just now',
      naturalVersion: inputText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      const aiReply: ConversationMessage = {
        id: `msg-${Date.now() + 1}`,
        sessionId: 'sess-live-1',
        sender: 'ai',
        text: "Understood! Everything is getting prepared. Would you like to pay with UPI or cash?",
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 1000);
  };

  const handleEndSession = () => {
    saveNewRecording({
      sessionId: `sess-${Date.now()}`,
      title: `${location.name} Speaking Session`,
      scenarioName: location.name,
      durationSeconds: 160,
      hasAudio: true,
      transcriptText: messages.filter((m) => m.sender === 'user').map((m) => m.text).join(' '),
      correctionsCount: 2,
      savedLocally: true,
    });
    navigate('/talk');
  };

  return (
    <div className="flex flex-col gap-5 max-w-4xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title={`${location.name} Conversation`}
        subtitle={`${location.tagline} • Partner: ${persona.name}`}
        badge={confidenceMode.replace('_', ' ')}
        showBack={true}
        actions={
          <button
            type="button"
            onClick={handleEndSession}
            className="px-4 py-2 bg-card border border-border text-xs font-bold text-text-muted hover:text-text rounded-xl hover:bg-surface shadow-xs transition-colors"
          >
            End & Save
          </button>
        }
      />

      {/* Context Locking Status Pill (Requirement 13) */}
      <div className="p-3.5 rounded-2xl bg-surface border border-border flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-500" />
          <span className="font-bold text-text">Context Locked:</span>
          <span className="text-text-muted">
            {location.name} • {persona.role} • Level {user.currentLevel}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsHelpOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary font-bold text-xs rounded-xl hover:bg-primary/20 transition-colors"
        >
          <HelpCircle size={14} />
          <span>Brain Freeze? Get a Hint</span>
        </button>
      </div>

      {/* Main Chat Stream */}
      <div className="rounded-3xl bg-card border border-border p-4 sm:p-6 shadow-sm min-h-[420px] flex flex-col justify-between">
        <div className="space-y-4 mb-6 overflow-y-auto max-h-[480px] pr-1">
          {messages.map((msg) => {
            const isAI = msg.sender === 'ai';
            const isSelectedForAnalysis = activeAnalysisMsgId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
              >
                {isAI && (
                  <div className="w-10 h-10 rounded-2xl bg-surface border border-border flex items-center justify-center text-xl shrink-0 shadow-xs">
                    {persona.avatar}
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[75%] ${isAI ? '' : 'items-end'}`}>
                  <div
                    className={`
                      p-4 rounded-3xl text-sm leading-relaxed
                      ${
                        isAI
                          ? 'bg-surface border border-border text-text rounded-tl-sm'
                          : 'bg-primary text-primary-foreground rounded-tr-sm shadow-sm'
                      }
                    `}
                  >
                    {msg.text}
                  </div>

                  {/* Coaching Trigger for User Messages */}
                  {!isAI && msg.naturalVersion && msg.naturalVersion !== msg.text && (
                    <button
                      type="button"
                      onClick={() =>
                        setActiveAnalysisMsgId(isSelectedForAnalysis ? null : msg.id)
                      }
                      className="mt-1 text-[11px] font-bold text-primary hover:underline flex items-center gap-1 float-right"
                    >
                      <Sparkles size={12} className="text-amber-500" />
                      <span>{isSelectedForAnalysis ? 'Hide phrasing tip' : 'See natural native phrasing'}</span>
                    </button>
                  )}

                  {/* Natural English Coaching Card (Requirement 14, 18, 19) */}
                  {!isAI && isSelectedForAnalysis && msg.naturalVersion && (
                    <div className="clear-both mt-2 p-4 rounded-2xl bg-surface border border-primary/30 shadow-xs text-xs space-y-2.5 animate-fadeIn">
                      <div className="flex items-center justify-between border-b border-border pb-1.5">
                        <span className="font-extrabold text-primary flex items-center gap-1.5">
                          <Lightbulb size={13} className="text-amber-500" />
                          Natural English Coaching
                        </span>
                        <span className="text-[10px] text-text-muted">Polite Service Register</span>
                      </div>

                      <div>
                        <span className="text-text-muted block text-[10px] font-semibold uppercase">
                          What you said:
                        </span>
                        <span className="font-medium text-text">"{msg.text}"</span>
                      </div>

                      <div>
                        <span className="text-emerald-600 dark:text-emerald-400 block text-[10px] font-bold uppercase">
                          Natural Spoken English:
                        </span>
                        <span className="font-bold text-text">"{msg.naturalVersion}"</span>
                      </div>

                      {msg.casualVersion && (
                        <div>
                          <span className="text-sky-600 dark:text-sky-400 block text-[10px] font-bold uppercase">
                            Casual / Street English:
                          </span>
                          <span className="text-text font-medium">"{msg.casualVersion}"</span>
                        </div>
                      )}

                      {msg.politeVersion && (
                        <div>
                          <span className="text-purple-600 dark:text-purple-400 block text-[10px] font-bold uppercase">
                            Professional / Courteous:
                          </span>
                          <span className="text-text font-medium">"{msg.politeVersion}"</span>
                        </div>
                      )}

                      {msg.explanation && (
                        <div className="pt-1.5 border-t border-border text-text-muted leading-relaxed">
                          <span className="font-bold text-text">Why? </span>
                          {msg.explanation}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {!isAI && (
                  <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-black text-text shrink-0">
                    YOU
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Real-time Speaking Voice Controls */}
        <div className="pt-4 border-t border-border flex flex-col items-center gap-3">
          {voiceState !== 'idle' && (
            <div className="w-full max-w-xs">
              <Waveform active={voiceState === 'recording'} height={32} />
            </div>
          )}

          <div className="flex items-center gap-4">
            <VoiceButton
              state={voiceState}
              onClick={handleVoiceToggle}
              size="lg"
              label="Tap to Speak Spontaneously"
            />
          </div>

          {/* Or type fallback */}
          <form onSubmit={handleSendText} className="w-full flex items-center gap-2 mt-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Or type what you want to say in English..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-surface border border-border text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-primary text-primary-foreground disabled:opacity-40 transition-colors shadow-sm"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Speaking Brain Freeze Modal */}
      <SpeakingHelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        scenarioTopic={location.name}
      />
    </div>
  );
};
