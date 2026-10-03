import React, { useState } from 'react';
import {
  X,
  Bot,
  Send,
  Sparkles,
  HelpCircle,
  Briefcase,
  User,
} from 'lucide-react';
import { useCareerIntelligence } from '../../context/CareerIntelligenceContext';

interface CareerAICoachModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CareerAICoachModal: React.FC<CareerAICoachModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { goalProfile } = useCareerIntelligence();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'coach' | 'user'; text: string }>>([
    {
      sender: 'coach',
      text: `Hello! I am your Career Communication Coach. I see your target role is ${goalProfile.targetRole.replace(
        '_',
        ' '
      )} in the ${goalProfile.industry} industry. How can I help you elevate your professional communication today?`,
    },
  ]);

  if (!isOpen) return null;

  const quickPrompts = [
    'How should I frame my project explanation in an interview?',
    'How do I answer salary expectations without giving a rigid number?',
    'What are the best phrases to buy thinking time gracefully?',
    'How do I explain a production bug without sounding incompetent?',
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputQuery;
    if (!text.trim()) return;

    const userMsg = { sender: 'user' as const, text };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');

    // Simulated high-signal career coaching response
    setTimeout(() => {
      let coachReply = `That is an excellent career communication question. For ${goalProfile.targetRole.replace(
        '_',
        ' '
      )} roles, hiring managers look for structural clarity and accountability.`;

      if (text.toLowerCase().includes('salary')) {
        coachReply =
          'When recruiters ask for your salary expectations, avoid throwing out a rigid single number. Anchor on market research and value: "Based on my research for this role level and the impact I look forward to delivering, I am targeting a base range of $X to $Y, but I am open to discussing total compensation. What is the budgeted band for this role?"';
      } else if (text.toLowerCase().includes('project')) {
        coachReply =
          'Use the 6-stage project explanation framework: 1. The Business Problem, 2. The Solution, 3. The Architecture & Tech Stack, 4. Your Specific Ownership, 5. The Biggest Engineering Bottleneck Solved, and 6. The Quantified Outcome.';
      } else if (text.toLowerCase().includes('thinking')) {
        coachReply =
          'Never panic or say "Uhhh". Use professional bridging statements: "That is an insightful question. Let me structure my thoughts for a moment," or "I would approach that in two parts: first from an architectural perspective, then operational."';
      } else {
        coachReply =
          'Remember to keep your response structured, concise, and focused on business value. Emphasize your personal contribution, how you collaborated across teams, and the concrete outcome achieved.';
      }

      setMessages((prev) => [...prev, { sender: 'coach', text: coachReply }]);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-3xl max-h-[92vh] bg-surface rounded-3xl border border-border shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-card/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Bot size={20} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                AI Career Communication Coach
              </span>
              <h2 className="text-base sm:text-lg font-black text-text">
                Personalized Career Mentorship
              </h2>
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

        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 text-xs ${
                m.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  m.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-indigo-500/10 text-indigo-500'
                }`}
              >
                {m.sender === 'user' ? <User size={15} /> : <Bot size={15} />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-4 border space-y-1 ${
                  m.sender === 'user'
                    ? 'bg-primary text-primary-foreground border-primary/40 rounded-tr-xs'
                    : 'bg-card text-text border-border rounded-tl-xs'
                }`}
              >
                <span
                  className={`text-[10px] font-bold block ${
                    m.sender === 'user' ? 'text-primary-foreground/80' : 'text-text-muted'
                  }`}
                >
                  {m.sender === 'user' ? 'You' : 'Career Coach'}
                </span>
                <p className="leading-relaxed font-sans whitespace-pre-wrap">{m.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Prompts */}
        <div className="px-6 py-2.5 bg-surface-elevated/40 border-t border-border flex flex-wrap gap-2">
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(qp)}
              className="px-2.5 py-1 rounded-lg bg-card border border-border text-[11px] font-medium text-text hover:border-primary/50 transition-colors"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-border bg-card/60 flex items-center gap-3">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask your career coach anything..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-surface border border-border text-xs text-text placeholder:text-text-muted/60 focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary"
          />
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!inputQuery.trim()}
            className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
