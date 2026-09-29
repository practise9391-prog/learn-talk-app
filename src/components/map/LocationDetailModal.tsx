import React, { useState } from 'react';
import { LocationScenario, ConfidenceMode } from '../../types';
import { AI_PERSONAS } from '../../data/personas';
import { Modal } from '../common/Modal';
import { useNavigation } from '../../context/NavigationContext';
import {
  MessageSquare,
  BookOpen,
  Headphones,
  Mic,
  Zap,
  Sparkles,
  CheckCircle2,
  Volume2
} from 'lucide-react';

interface LocationDetailModalProps {
  location: LocationScenario | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LocationDetailModal: React.FC<LocationDetailModalProps> = ({
  location,
  isOpen,
  onClose,
}) => {
  const { navigate } = useNavigation();
  const [selectedConfidenceMode, setSelectedConfidenceMode] = useState<ConfidenceMode>('real_conversation');

  if (!location) return null;

  const persona = AI_PERSONAS.find((p) => p.id === location.defaultPersonaId) || AI_PERSONAS[0];

  const handleStartSession = (mode: ConfidenceMode) => {
    onClose();
    navigate(`/talk/location/${location.id}`, { mode });
  };

  const confidenceModes = [
    {
      id: 'real_conversation' as ConfidenceMode,
      title: 'Real Conversation',
      subtitle: 'Spontaneous speaking with conversational AI. No pre-set script.',
      icon: MessageSquare,
      badge: 'Recommended',
      color: 'border-primary bg-primary/5 text-primary',
    },
    {
      id: 'learn_first' as ConfidenceMode,
      title: 'Learn Useful Phrases',
      subtitle: 'Review essential phrases, idioms and vocabulary before speaking.',
      icon: BookOpen,
      badge: 'Beginner Safe',
      color: 'border-indigo-400 bg-indigo-50/40 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400',
    },
    {
      id: 'listen_first' as ConfidenceMode,
      title: 'Listen First',
      subtitle: 'Hear a natural dialog play out to get comfortable with the context.',
      icon: Headphones,
      badge: 'Passive Practice',
      color: 'border-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400',
    },
    {
      id: 'practice' as ConfidenceMode,
      title: 'Practice with Hints',
      subtitle: 'Speak with real-time brain-freeze support and sentence frameworks.',
      icon: Mic,
      badge: 'Guided',
      color: 'border-amber-400 bg-amber-50/40 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400',
    },
    {
      id: 'challenge' as ConfidenceMode,
      title: 'Challenge Mode',
      subtitle: 'Fast speech, unexpected questions, and advanced natural phrasing.',
      icon: Zap,
      badge: 'Advanced',
      color: 'border-rose-400 bg-rose-50/40 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400',
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl">
      <div className="flex flex-col gap-6">
        {/* Location Environment Banner */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary/20 via-secondary/15 to-accent/15 p-6 border border-border">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-surface border border-border shadow-md flex items-center justify-center text-4xl shrink-0">
                {location.icon}
              </div>
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  Location Speaking Lab
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-text">
                  {location.name}
                </h2>
                <p className="text-xs sm:text-sm text-text-muted mt-0.5 font-medium">
                  {location.tagline}
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-text-muted mt-4 bg-surface/70 backdrop-blur-sm p-3 rounded-xl border border-border/60">
            {location.environmentDescription}
          </p>
        </div>

        {/* AI Character Partner Preview */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface border border-border">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary/10 to-secondary/20 flex items-center justify-center text-2xl shrink-0">
            {persona.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-text">{persona.name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                {persona.role}
              </span>
            </div>
            <p className="text-xs text-text-muted italic mt-0.5 truncate">
              "{location.greetingPhrase}"
            </p>
          </div>
        </div>

        {/* Choose Confidence Mode */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-text">
              How would you like to practice?
            </h3>
            <span className="text-[11px] text-text-muted">Choose your comfort level</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {confidenceModes.map((mode) => {
              const Icon = mode.icon;
              const isSelected = selectedConfidenceMode === mode.id;

              return (
                <div
                  key={mode.id}
                  onClick={() => setSelectedConfidenceMode(mode.id)}
                  className={`
                    p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between
                    ${
                      isSelected
                        ? `${mode.color} ring-2 ring-primary/30 shadow-xs font-medium`
                        : 'border-border bg-card hover:bg-surface hover:border-slate-300 dark:hover:border-slate-700'
                    }
                  `}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <Icon size={16} />
                      <span className="text-xs font-bold text-text">{mode.title}</span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-surface border border-border">
                      {mode.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-muted line-clamp-2">
                    {mode.subtitle}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sample Useful Phrases Accordion Preview */}
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-text flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-500" />
              Key Phrases for {location.name}
            </span>
            <span className="text-[10px] text-text-muted">Tap to preview speech</span>
          </div>
          <div className="space-y-1.5">
            {location.samplePhrases.slice(0, 3).map((phrase, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-2 p-2 rounded-lg bg-card border border-border/70 text-xs text-text"
              >
                <span className="truncate">"{phrase}"</span>
                <Volume2 size={13} className="text-primary shrink-0 cursor-pointer" />
              </div>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => handleStartSession(selectedConfidenceMode)}
            className="w-full py-3.5 bg-primary text-primary-foreground font-black text-sm rounded-xl shadow-lg shadow-primary/25 hover:bg-primary-hover active:scale-99 transition-all flex items-center justify-center gap-2"
          >
            <span>Enter {location.name}</span>
            <span className="text-xs font-normal opacity-90">({selectedConfidenceMode.replace('_', ' ')})</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
