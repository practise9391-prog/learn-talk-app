import React, { useState } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { VoiceButton, VoiceButtonState } from '../common/VoiceButton';
import { Waveform } from '../common/Waveform';
import { QUICK_TOPICS } from '../../data/topics';
import { useUser } from '../../context/UserContext';
import { Bot, Sparkles, Shuffle, Send, Lightbulb } from 'lucide-react';

export const JarvisPartnerView: React.FC = () => {
  const { addSpokenMinutes } = useUser();
  const [activeTopic, setActiveTopic] = useState(QUICK_TOPICS[0]);
  const [voiceState, setVoiceState] = useState<VoiceButtonState>('idle');
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; naturalTip?: string }>>([
    {
      sender: 'ai',
      text: "Hi, I'm Jarvis, your conversational partner! I'm here so you can practice speaking English freely with zero judgment. What would you like to talk about today?",
    },
    {
      sender: 'ai',
      text: QUICK_TOPICS[0].starterPrompt,
    },
  ]);
  const [inputVal, setInputVal] = useState('');

  const handlePickRandomTopic = () => {
    const next = QUICK_TOPICS[Math.floor(Math.random() * QUICK_TOPICS.length)];
    setActiveTopic(next);
    setMessages((prev) => [
      ...prev,
      {
        sender: 'ai',
        text: `Let's switch topics! ${next.starterPrompt}`,
      },
    ]);
  };

  const handleVoiceToggle = () => {
    if (voiceState === 'idle') {
      setVoiceState('listening');
      setTimeout(() => setVoiceState('recording'), 500);
    } else if (voiceState === 'recording') {
      setVoiceState('processing');
      setTimeout(() => {
        setVoiceState('idle');
        const userMsg = {
          sender: 'user' as const,
          text: "On Saturday mornings, I usually wake up around 8 AM. I enjoy drinking hot chai and reading tech news on my phone.",
          naturalTip: "Great sentence! A very natural native flourish is: 'I like to start my Saturday by easing into the morning with a hot chai.'",
        };
        const aiMsg = {
          sender: 'ai' as const,
          text: "That sounds like a relaxing morning routine! Do you usually cook your own breakfast on weekends, or do you prefer going to a nearby cafe?",
        };
        setMessages((prev) => [...prev, userMsg, aiMsg]);
        addSpokenMinutes(1);
      }, 1500);
    }
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: inputVal },
      { sender: 'ai', text: "That is interesting! Tell me more about what you think." },
    ]);
    setInputVal('');
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <PageHeader
        title="Jarvis AI Speaking Partner"
        subtitle="Open-ended English speaking practice on any topic with gentle coaching"
        badge="Friendly Friend"
        showBack={true}
        actions={
          <button
            type="button"
            onClick={handlePickRandomTopic}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-card border border-border text-xs font-bold text-text hover:bg-surface rounded-xl shadow-xs transition-colors"
          >
            <Shuffle size={14} className="text-primary" />
            <span>Random Topic</span>
          </button>
        }
      />

      {/* Active Conversation Container */}
      <div className="rounded-3xl bg-card border border-border p-6 shadow-sm min-h-[460px] flex flex-col justify-between">
        {/* Messages list */}
        <div className="space-y-4 mb-6 overflow-y-auto max-h-[480px]">
          {messages.map((m, idx) => {
            const isAI = m.sender === 'ai';
            return (
              <div
                key={idx}
                className={`flex items-start gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
              >
                {isAI && (
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xl shrink-0">
                    🤖
                  </div>
                )}
                <div className={`max-w-[80%] ${isAI ? '' : 'items-end'}`}>
                  <div
                    className={`
                      p-4 rounded-3xl text-sm leading-relaxed
                      ${
                        isAI
                          ? 'bg-surface border border-border text-text rounded-tl-sm'
                          : 'bg-primary text-primary-foreground rounded-tr-sm'
                      }
                    `}
                  >
                    {m.text}
                  </div>

                  {m.naturalTip && (
                    <div className="mt-1.5 p-3 rounded-xl bg-surface border border-primary/20 text-xs text-text-muted flex items-start gap-2">
                      <Lightbulb size={14} className="text-amber-500 shrink-0 mt-0.5" />
                      <span>{m.naturalTip}</span>
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

        {/* Voice and input controls */}
        <div className="pt-4 border-t border-border flex flex-col items-center gap-3">
          {voiceState !== 'idle' && (
            <div className="w-full max-w-xs">
              <Waveform active={voiceState === 'recording'} height={30} />
            </div>
          )}

          <VoiceButton
            state={voiceState}
            onClick={handleVoiceToggle}
            size="lg"
            label="Tap to Speak with Jarvis"
          />

          <form onSubmit={handleSendText} className="w-full flex items-center gap-2 mt-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Or type a message to Jarvis..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-surface border border-border text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="p-2.5 rounded-xl bg-primary text-primary-foreground disabled:opacity-40 transition-colors shadow-sm"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
