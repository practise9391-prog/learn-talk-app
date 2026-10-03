import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  Send,
  Sparkles,
  CheckCircle2,
  Hash,
  Users,
  Info,
} from 'lucide-react';
import { useProLab } from '../../context/ProLabContext';

interface ChatThreadLabModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatThreadLabModal: React.FC<ChatThreadLabModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { chatCases } = useProLab();
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState(chatCases[0]?.messages || []);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentCase = chatCases[selectedCaseIndex] || chatCases[0];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const newMsg = {
      id: `learner_${Date.now()}`,
      sender: 'You',
      role: 'Engineer / Lead',
      avatarColor: 'bg-primary',
      timestamp: 'Just now',
      content: text,
      isLearner: true,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Instant feedback on chat message
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    if (wordCount < 10) {
      setFeedback('A bit too brief. Ensure your message mentions the specific PR, impact, or proposed timeline.');
    } else if (wordCount > 60) {
      setFeedback('Chat messages should be concise. For long technical analysis, post a brief summary and link a document.');
    } else {
      setFeedback('Great high-signal chat message! Direct, action-oriented, and clearly flags the necessary owners.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-3xl max-h-[92vh] bg-surface rounded-3xl border border-border shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-card/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Hash size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-text">{currentCase.channelName}</span>
                <span className="text-[10px] text-text-muted hidden sm:inline">• Slack / Teams Channel</span>
              </div>
              <p className="text-[11px] text-text-muted">{currentCase.channelTopic}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-card transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Situation Banner */}
        <div className="px-6 py-3 bg-surface-elevated/80 border-b border-border text-xs flex items-start gap-2.5">
          <Info size={15} className="text-primary shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-text">Situation:</span>
            <p className="text-text-muted leading-relaxed">{currentCase.situation}</p>
          </div>
        </div>

        {/* Chat History Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 text-xs ${
                msg.isLearner ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl ${msg.avatarColor} text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs`}
              >
                {msg.sender.charAt(0)}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-4 border space-y-1 ${
                  msg.isLearner
                    ? 'bg-primary text-primary-foreground border-primary/40 rounded-tr-xs'
                    : 'bg-card text-text border-border rounded-tl-xs'
                }`}
              >
                <div
                  className={`flex items-center justify-between gap-3 text-[10px] ${
                    msg.isLearner ? 'text-primary-foreground/80' : 'text-text-muted'
                  }`}
                >
                  <span className="font-bold">{msg.sender}</span>
                  <span>{msg.timestamp}</span>
                </div>
                <p className="leading-relaxed font-sans whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {feedback && (
            <div className="p-3.5 rounded-2xl bg-surface border border-primary/30 text-xs text-text flex items-start gap-2 animate-fadeIn">
              <Sparkles size={14} className="text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-primary block">Communication Feedback:</span>
                <p className="text-text-muted leading-relaxed">{feedback}</p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Reply Suggestions */}
        <div className="px-6 py-2.5 bg-surface-elevated/40 border-t border-border flex flex-wrap gap-2">
          <span className="text-[10px] font-bold text-text-muted uppercase self-center mr-1">
            Quick Options:
          </span>
          {currentCase.quickReplyOptions.map((opt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(opt)}
              className="px-2.5 py-1 rounded-lg bg-card border border-border text-[11px] font-medium text-text hover:border-primary/50 transition-colors"
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-border bg-card/60 flex items-center gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Message ${currentCase.channelName}...`}
            className="flex-1 px-4 py-2.5 rounded-xl bg-surface border border-border text-xs text-text placeholder:text-text-muted/60 focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary"
          />
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
