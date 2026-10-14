import React, { useState } from 'react';
import { useCoreJourney } from '../../context/CoreJourneyContext';
import { useNavigation } from '../../context/NavigationContext';
import { SentenceBuildingLabModal } from '../common/SentenceBuildingLabModal';
import { ThinkInEnglishModal } from '../common/ThinkInEnglishModal';
import { ConversationRecoveryModal } from '../common/ConversationRecoveryModal';
import {
  Compass,
  Sparkles,
  Layers,
  Brain,
  LifeBuoy,
  ArrowRight,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

export const MasterJourneyCard: React.FC = () => {
  const { currentJourneyStage, ageGroup, explanationLanguage } = useCoreJourney();
  const { navigate } = useNavigation();

  const [isSentenceLabOpen, setIsSentenceLabOpen] = useState(false);
  const [isThinkInEnglishOpen, setIsThinkInEnglishOpen] = useState(false);
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);

  return (
    <div className="rounded-3xl bg-gradient-to-br from-primary/15 via-indigo-950/20 to-card border border-primary/25 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground">
              Part 22 – Final Part Journey
            </span>
            <span className="text-[10px] font-bold text-text-muted capitalize">
              {ageGroup.replace('_', ' ')} • {explanationLanguage}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-text">
            11-Step Learning Cycle & Interactive Studios
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Active Stage {currentJourneyStage} of 11. Practice sentence structure, think directly in English, and eliminate speaking fear.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/journey')}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-black text-xs hover:bg-primary-hover transition-colors flex items-center justify-center gap-1.5 self-start sm:self-auto shrink-0 shadow-xs"
        >
          <span>Open Journey Hub</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Quick Studio Action Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
        <button
          type="button"
          onClick={() => setIsSentenceLabOpen(true)}
          className="p-3 rounded-2xl bg-card border border-border/80 hover:border-primary/50 text-left transition-all group flex flex-col justify-between"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-2">
            <Layers size={16} />
          </div>
          <div>
            <span className="text-xs font-bold text-text group-hover:text-primary block">
              Sentence Lab
            </span>
            <span className="text-[10px] text-text-muted">Assemble blocks</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setIsThinkInEnglishOpen(true)}
          className="p-3 rounded-2xl bg-card border border-border/80 hover:border-primary/50 text-left transition-all group flex flex-col justify-between"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-2">
            <Brain size={16} />
          </div>
          <div>
            <span className="text-xs font-bold text-text group-hover:text-primary block">
              Think in English
            </span>
            <span className="text-[10px] text-text-muted">Visual gym</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setIsRecoveryOpen(true)}
          className="p-3 rounded-2xl bg-card border border-border/80 hover:border-primary/50 text-left transition-all group flex flex-col justify-between"
        >
          <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-2">
            <LifeBuoy size={16} />
          </div>
          <div>
            <span className="text-xs font-bold text-text group-hover:text-primary block">
              Recovery Phrases
            </span>
            <span className="text-[10px] text-text-muted">Brain-freeze shield</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => navigate('/learn/lesson/b1-u0-l1')}
          className="p-3 rounded-2xl bg-card border border-border/80 hover:border-primary/50 text-left transition-all group flex flex-col justify-between"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-2">
            <BookOpen size={16} />
          </div>
          <div>
            <span className="text-xs font-bold text-text group-hover:text-primary block">
              Zero Foundations
            </span>
            <span className="text-[10px] text-text-muted">Alphabet & phonics</span>
          </div>
        </button>
      </div>

      <SentenceBuildingLabModal
        isOpen={isSentenceLabOpen}
        onClose={() => setIsSentenceLabOpen(false)}
      />
      <ThinkInEnglishModal
        isOpen={isThinkInEnglishOpen}
        onClose={() => setIsThinkInEnglishOpen(false)}
      />
      <ConversationRecoveryModal
        isOpen={isRecoveryOpen}
        onClose={() => setIsRecoveryOpen(false)}
      />
    </div>
  );
};

