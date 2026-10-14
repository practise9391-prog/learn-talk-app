import React, { useState } from 'react';
import {
  X,
  Shield,
  Volume2,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  HelpCircle,
} from 'lucide-react';
import { CONVERSATION_RECOVERY_CARDS } from '../../data/coreJourneyData';
import { ConversationRecoveryCard } from '../../types/coreJourney';
import { useGamification } from '../../context/GamificationContext';
import { ttsService } from '../../services/aiService';

interface ConversationRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConversationRecoveryModal: React.FC<ConversationRecoveryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { awardXP } = useGamification();
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [practicedCards, setPracticedCards] = useState<string[]>([]);

  const card = CONVERSATION_RECOVERY_CARDS[selectedCardIndex];

  if (!isOpen) return null;

  const playPrimaryPhrase = () => {
    ttsService.speak(card.primaryPhrase, { rate: 0.95 });
  };

  const playAlternative = (text: string) => {
    ttsService.speak(text, { rate: 0.95 });
  };

  const markPracticed = () => {
    if (!practicedCards.includes(card.id)) {
      setPracticedCards([...practicedCards, card.id]);
      awardXP('speaking', card.id, 'recovery_phrase', 20, 60);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-surface-hover/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">
                Conversation Recovery & Fluency Lifesavers
              </h2>
              <p className="text-sm text-text-secondary">
                Techniques to stay calm when you forget a word, need thinking time, or someone speaks too fast
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-tertiary hover:text-text-primary rounded-lg hover:bg-surface-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex border-b border-border bg-background px-6 pt-2 gap-2 overflow-x-auto">
          {CONVERSATION_RECOVERY_CARDS.map((c, idx) => (
            <button
              key={c.id}
              onClick={() => setSelectedCardIndex(idx)}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
                selectedCardIndex === idx
                  ? 'border-primary text-primary bg-surface'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              {c.categoryTitle}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Situation Box */}
          <div className="p-5 rounded-2xl bg-surface-hover border border-border space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Workplace / Social Situation
            </span>
            <p className="text-sm font-semibold text-text-primary">
              {card.situation}
            </p>
            <p className="text-xs text-text-secondary italic">
              Pro Insight: {card.whenToUse}
            </p>
          </div>

          {/* Primary Lifesaver Phrase */}
          <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Primary Lifesaver Phrase:
              </span>
              <button
                type="button"
                onClick={playPrimaryPhrase}
                className="flex items-center gap-1.5 px-3 py-1 bg-surface border border-border rounded-xl text-xs font-bold text-primary hover:bg-surface-hover shadow-xs"
              >
                <Volume2 className="w-4 h-4" /> Listen
              </button>
            </div>
            <p className="text-lg font-black text-text-primary tracking-tight">
              "{card.primaryPhrase}"
            </p>
          </div>

          {/* Alternative Formulations */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block">
              Natural Alternative Variations:
            </label>
            <div className="space-y-2">
              {card.alternatives.map((alt, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 bg-background border border-border rounded-xl text-xs"
                >
                  <span className="font-semibold text-text-primary">"{alt}"</span>
                  <button
                    type="button"
                    onClick={() => playAlternative(alt)}
                    className="p-1.5 text-text-tertiary hover:text-primary rounded-lg hover:bg-surface transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-surface-hover/30">
          <button
            type="button"
            onClick={markPracticed}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              practicedCards.includes(card.id)
                ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
                : 'bg-surface hover:bg-surface-hover border border-border text-text-primary'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {practicedCards.includes(card.id) ? 'Mastered (+20 XP)' : 'Mark as Practiced'}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

