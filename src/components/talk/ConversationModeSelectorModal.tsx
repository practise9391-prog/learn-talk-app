import React, { useState } from 'react';
import { ConversationMode, CorrectionStyle, NativeLanguageSupport } from '../../types/speakingIntelligence';
import { ConversationDifficulty } from '../../types/talk';
import { CONVERSATION_TOPICS } from '../../data/talkTopics';
import { AI_PERSONAS } from '../../data/personas';
import { CONVERSATION_OBJECTIVES } from '../../data/speakingIntelligenceData';
import {
  Mic,
  Settings,
  Sparkles,
  Bot,
  Globe,
  Sliders,
  Check,
  X,
  ArrowRight,
  Shield,
  Briefcase,
  Coffee,
  Plane,
  Compass,
  GraduationCap,
  MessageSquare,
  Volume2
} from 'lucide-react';

interface ConversationModeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunch: (config: {
    mode: ConversationMode;
    topicId: string;
    difficulty: ConversationDifficulty;
    personaId: string;
    correctionStyle: CorrectionStyle;
    nativeLanguage: NativeLanguageSupport;
    preferredInput: 'voice' | 'text';
  }) => void;
}

export const ConversationModeSelectorModal: React.FC<ConversationModeSelectorModalProps> = ({
  isOpen,
  onClose,
  onLaunch,
}) => {
  const [selectedMode, setSelectedMode] = useState<ConversationMode>('guided');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('topic-my-day');
  const [selectedDifficulty, setSelectedDifficulty] = useState<ConversationDifficulty>('normal');
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('jarvis');
  const [correctionStyle, setCorrectionStyle] = useState<CorrectionStyle>('balanced');
  const [nativeLanguage, setNativeLanguage] = useState<NativeLanguageSupport>('telugu');
  const [preferredInput, setPreferredInput] = useState<'voice' | 'text'>('voice');

  if (!isOpen) return null;

  const modes: { id: ConversationMode; label: string; desc: string; icon: any }[] = [
    { id: 'free', label: 'Free Talk', desc: 'Unscripted casual practice with zero pressure', icon: MessageSquare },
    { id: 'guided', label: 'Guided Talk', desc: 'Structured prompts with goal milestones', icon: Compass },
    { id: 'learning', label: 'Learning Talk', desc: 'Focus on targeted grammar & vocabulary', icon: GraduationCap },
    { id: 'interview', label: 'Interview Talk', desc: 'Behavioral & technical job questions (STAR)', icon: Briefcase },
    { id: 'professional', label: 'Professional Talk', desc: 'Meetings, updates & polite disagreement', icon: Sliders },
    { id: 'travel', label: 'Travel Talk', desc: 'Airports, hotels, ordering & directions', icon: Plane },
    { id: 'daily', label: 'Daily Talk', desc: 'Routines, hobbies, culture & weekend stories', icon: Coffee },
  ];

  const correctionStyles: { id: CorrectionStyle; label: string; desc: string }[] = [
    { id: 'gentle', label: 'Gentle', desc: 'Only highlights errors that impede basic communication' },
    { id: 'balanced', label: 'Balanced', desc: 'Polishes grammar, vocabulary & naturalness smoothly' },
    { id: 'detailed', label: 'Detailed', desc: 'In-depth explanations with multiple native alternatives' },
  ];

  const languages: { id: NativeLanguageSupport; label: string }[] = [
    { id: 'telugu', label: 'Telugu (తెలుగు)' },
    { id: 'hindi', label: 'Hindi (हिन्दी)' },
    { id: 'tamil', label: 'Tamil (தமிழ்)' },
    { id: 'kannada', label: 'Kannada (ಕನ್ನಡ)' },
    { id: 'spanish', label: 'Spanish (Español)' },
    { id: 'none', label: 'English Only' },
  ];

  const currentObjective =
    selectedMode === 'interview'
      ? CONVERSATION_OBJECTIVES.interview
      : selectedMode === 'travel'
      ? CONVERSATION_OBJECTIVES.travel
      : selectedMode === 'professional'
      ? CONVERSATION_OBJECTIVES.office
      : CONVERSATION_OBJECTIVES.daily;

  const handleStart = () => {
    onLaunch({
      mode: selectedMode,
      topicId: selectedTopicId,
      difficulty: selectedDifficulty,
      personaId: selectedPersonaId,
      correctionStyle,
      nativeLanguage,
      preferredInput,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-card border border-border shadow-2xl p-6 sm:p-8 my-8 text-text max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Sparkles size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-text">Customize Your Conversation</h2>
              <p className="text-xs text-text-secondary">
                Configure your speaking goal, AI partner persona, and coaching intensity
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-text-secondary hover:text-text hover:bg-surface transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 pt-6">
          {/* 1. Mode Selector */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-text-secondary mb-3 block">
              1. Choose Speaking Mode
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {modes.map((m) => {
                const Icon = m.icon;
                const isSelected = selectedMode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMode(m.id)}
                    className={`flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-primary/10 border-primary text-primary shadow-xs'
                        : 'bg-surface/50 border-border text-text hover:border-primary/40'
                    }`}
                  >
                    <Icon size={18} className="mb-2" />
                    <span className="text-xs font-black">{m.label}</span>
                    <span className="text-[10px] text-text-secondary line-clamp-1 mt-0.5">{m.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Objective Milestone Preview */}
          {currentObjective && (
            <div className="p-4 rounded-2xl bg-secondary/5 border border-secondary/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-full bg-secondary/20 text-secondary text-[10px] font-black uppercase">
                  Session Objective
                </span>
                <span className="text-xs font-bold text-text">{currentObjective.title}</span>
              </div>
              <p className="text-xs text-text-secondary mb-3">{currentObjective.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentObjective.milestones.map((ms, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[11px] text-text-secondary">
                    <div className="w-4 h-4 rounded-full border border-secondary/40 flex items-center justify-center text-[9px] font-bold text-secondary">
                      {idx + 1}
                    </div>
                    <span>{ms.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Topic & Difficulty Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-text-secondary mb-2 block">
                2. Conversation Topic
              </label>
              <select
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-text text-sm font-semibold focus:outline-hidden focus:border-primary"
              >
                {CONVERSATION_TOPICS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.icon} {t.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-text-secondary mb-2 block">
                3. Difficulty Level
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['easy', 'normal', 'challenging', 'advanced'] as ConversationDifficulty[]).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`py-2 text-xs font-bold capitalize rounded-xl border transition-all ${
                      selectedDifficulty === diff
                        ? 'bg-primary text-white border-primary shadow-xs'
                        : 'bg-surface border-border text-text-secondary hover:text-text'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4. AI Persona & Correction Style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-text-secondary mb-2 block">
                4. AI Partner Persona
              </label>
              <div className="grid grid-cols-2 gap-2">
                {AI_PERSONAS.slice(0, 4).map((p) => {
                  const isSelected = selectedPersonaId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPersonaId(p.id)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                        isSelected
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'bg-surface border-border text-text hover:border-primary/40'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center text-base">
                        {p.avatar}
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold truncate">{p.name}</div>
                        <div className="text-[10px] text-text-secondary truncate">{p.role}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-text-secondary mb-2 block">
                5. Feedback / Correction Style
              </label>
              <div className="space-y-1.5">
                {correctionStyles.map((cs) => {
                  const isSelected = correctionStyle === cs.id;
                  return (
                    <button
                      key={cs.id}
                      type="button"
                      onClick={() => setCorrectionStyle(cs.id)}
                      className={`w-full p-2 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'bg-surface border-border text-text-secondary hover:text-text'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold">{cs.label}</div>
                        <div className="text-[10px] opacity-80">{cs.desc}</div>
                      </div>
                      {isSelected && <Check size={16} />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 5. Native Thinking Language Support */}
          <div className="p-4 rounded-2xl bg-surface/70 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-primary" />
                <span className="text-xs font-bold text-text">Native-Language Thinking Support</span>
              </div>
              <p className="text-[11px] text-text-secondary">
                Provides translation scaffolding from your mother tongue to Simple → Natural → Professional English
              </p>
            </div>
            <select
              value={nativeLanguage}
              onChange={(e) => setNativeLanguage(e.target.value as NativeLanguageSupport)}
              className="px-3 py-1.5 rounded-xl bg-card border border-border text-text text-xs font-bold focus:outline-hidden focus:border-primary"
            >
              {languages.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* 6. Mode of Input (Voice vs Text fallback) */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-text-secondary">Preferred Input:</span>
              <div className="inline-flex p-1 rounded-xl bg-surface border border-border">
                <button
                  type="button"
                  onClick={() => setPreferredInput('voice')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    preferredInput === 'voice' ? 'bg-primary text-white shadow-xs' : 'text-text-secondary'
                  }`}
                >
                  <Mic size={13} />
                  <span>Voice Call</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreferredInput('text')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    preferredInput === 'text' ? 'bg-primary text-white shadow-xs' : 'text-text-secondary'
                  }`}
                >
                  <MessageSquare size={13} />
                  <span>Text Chat</span>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleStart}
              className="px-6 py-3 rounded-2xl bg-primary text-white font-black text-sm shadow-md hover:bg-primary/90 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Start Speaking</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
