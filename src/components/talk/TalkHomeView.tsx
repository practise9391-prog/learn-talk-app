import React, { useState } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { SpeakingWorldMap } from '../map/SpeakingWorldMap';
import { useNavigation } from '../../context/NavigationContext';
import { useUser } from '../../context/UserContext';
import { CONVERSATION_TOPICS } from '../../data/talkTopics';
import { AI_PERSONAS } from '../../data/personas';
import { ConversationDifficulty } from '../../types/talk';
import { ConversationMode, CorrectionStyle, NativeLanguageSupport } from '../../types/speakingIntelligence';
import { ConversationModeSelectorModal } from './ConversationModeSelectorModal';
import { NativeThinkingBridgeModal } from './NativeThinkingBridgeModal';
import {
  Mic,
  MessageSquare,
  Sparkles,
  Shuffle,
  Calendar,
  Compass,
  Briefcase,
  Coffee,
  Globe,
  HelpCircle,
  Languages,
  Bookmark,
  History,
  Clock,
  Play,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Layers,
  Award,
  Zap,
  Volume2,
  Image as ImageIcon,
  Flame,
  Presentation,
  Code2,
} from 'lucide-react';

export const TalkHomeView: React.FC = () => {
  const { navigate } = useNavigation();
  const { user } = useUser();

  // Mode Selector Modal state
  const [isModeSelectorOpen, setIsModeSelectorOpen] = useState(false);
  // Native Thinking Bridge Modal state
  const [isBridgeModalOpen, setIsBridgeModalOpen] = useState(false);

  // Recording Privacy Consent Modal
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [rememberConsent, setRememberConsent] = useState(true);
  const [pendingLaunchParams, setPendingLaunchParams] = useState<{
    topicId: string;
    personaId: string;
    difficulty: ConversationDifficulty;
    mode: 'voice' | 'text';
    conversationMode?: ConversationMode;
    correctionStyle?: CorrectionStyle;
    nativeLanguage?: NativeLanguageSupport;
  } | null>(null);

  // Check consent status from localStorage
  const checkConsentAndLaunch = (
    topicId: string,
    personaId: string,
    difficulty: ConversationDifficulty,
    mode: 'voice' | 'text',
    conversationMode?: ConversationMode,
    correctionStyle?: CorrectionStyle,
    nativeLanguage?: NativeLanguageSupport
  ) => {
    const hasConsented = localStorage.getItem('learntalk_recording_consent');
    if (mode === 'voice' && !hasConsented) {
      setPendingLaunchParams({ topicId, personaId, difficulty, mode, conversationMode, correctionStyle, nativeLanguage });
      setShowConsentModal(true);
      return;
    }

    launchDirectly(topicId, personaId, difficulty, mode, conversationMode, correctionStyle, nativeLanguage);
  };

  const launchDirectly = (
    topicId: string,
    personaId: string,
    difficulty: ConversationDifficulty,
    mode: 'voice' | 'text',
    conversationMode?: ConversationMode,
    correctionStyle?: CorrectionStyle,
    nativeLanguage?: NativeLanguageSupport
  ) => {
    if (mode === 'voice') {
      navigate('/talk/call', {
        topicId,
        personaId,
        difficulty,
        initialMode: 'voice',
        conversationMode: conversationMode || 'guided',
        correctionStyle: correctionStyle || 'balanced',
        nativeLanguage: nativeLanguage || 'telugu',
      });
    } else {
      navigate('/talk/jarvis', { topicId, personaId, difficulty });
    }
  };

  const handleConsentChoice = (allowed: boolean) => {
    if (rememberConsent) {
      localStorage.setItem('learntalk_recording_consent', allowed ? 'allowed' : 'declined');
    }
    setShowConsentModal(false);
    if (pendingLaunchParams) {
      const { topicId, personaId, difficulty, mode, conversationMode, correctionStyle, nativeLanguage } = pendingLaunchParams;
      launchDirectly(topicId, personaId, difficulty, mode, conversationMode, correctionStyle, nativeLanguage);
      setPendingLaunchParams(null);
    }
  };

  const handleStartRandom = () => {
    const randomTopic = CONVERSATION_TOPICS[Math.floor(Math.random() * CONVERSATION_TOPICS.length)];
    checkConsentAndLaunch(randomTopic.id, 'jarvis', 'normal', 'voice');
  };

  const handleStartToday = () => {
    checkConsentAndLaunch('topic-my-day', 'jarvis', 'normal', 'voice');
  };

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <PageHeader
        title="Talk with Jarvis"
        subtitle="Your AI English Conversation Partner — Practice speaking naturally with zero judgment"
        badge="Part 12 Speaking Intelligence"
      />

      {/* Hero Jarvis Banner with 24x7 Status & Instant Start */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-card to-card border border-primary/25 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <div className="relative w-20 h-20 rounded-3xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-4xl shrink-0 shadow-md">
              🤖
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-card"></span>
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-black text-text">Jarvis Conversational Partner</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/20">
                  Online 24×7
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-xs border border-primary/20">
                  Adaptive Intelligence
                </span>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary mt-2 max-w-2xl leading-relaxed">
                "Hello {user.name}! I'm Jarvis. I'm here to listen, reply naturally, gently point out better words, and help you think directly in English without hesitations."
              </p>

              {/* Speaking Quota & 24x7 limit indicator */}
              <div className="mt-3 flex items-center gap-4 text-xs font-semibold text-text-secondary">
                <div className="flex items-center gap-1.5 text-text">
                  <Clock size={14} className="text-primary" />
                  <span>Today's Speaking: <strong>{user.minutesSpokenToday} mins</strong> spoken</span>
                </div>
                <span className="text-border">|</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  Evidence-Based Fluency Coaching
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsModeSelectorOpen(true)}
              className="px-7 py-3.5 bg-primary text-white font-black text-sm rounded-2xl shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-98 transition-all flex items-center justify-center gap-2.5"
            >
              <Mic size={18} className="animate-pulse" />
              <span>🎙 Start Talking (Select Mode)</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/talk/jarvis')}
              className="px-5 py-2.5 bg-surface border border-border text-text font-bold text-xs rounded-xl hover:bg-surface/80 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare size={14} />
              <span>Switch to Text Chat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Bar */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-black uppercase tracking-wider text-text-secondary">
            Quick Actions
          </h3>
          <span className="text-xs text-text-secondary">Instant tools to support your speaking</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <button
            type="button"
            onClick={() => navigate('/talk/jarvis')}
            className="p-4 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-xs transition-all flex flex-col items-center text-center gap-2"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <MessageSquare size={18} />
            </div>
            <span className="text-xs font-bold text-text">Text Chat</span>
            <span className="text-[10px] text-text-secondary">Type & learn</span>
          </button>

          <button
            type="button"
            onClick={() => checkConsentAndLaunch('topic-my-day', 'jarvis', 'normal', 'voice')}
            className="p-4 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-xs transition-all flex flex-col items-center text-center gap-2"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Mic size={18} />
            </div>
            <span className="text-xs font-bold text-text">Voice Call</span>
            <span className="text-[10px] text-text-secondary">Phone-call style</span>
          </button>

          <button
            type="button"
            onClick={() => setIsBridgeModalOpen(true)}
            className="p-4 rounded-2xl bg-card border border-border hover:border-secondary/40 hover:shadow-xs transition-all flex flex-col items-center text-center gap-2"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Languages size={18} />
            </div>
            <span className="text-xs font-bold text-text">Thinking Bridge</span>
            <span className="text-[10px] text-text-secondary">Native to English</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/talk/pronunciation-studio')}
            className="p-4 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-xs transition-all flex flex-col items-center text-center gap-2"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Volume2 size={18} />
            </div>
            <span className="text-xs font-bold text-text">Pronunciation</span>
            <span className="text-[10px] text-text-secondary">Stress & Pairs</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/talk/saved-phrases')}
            className="p-4 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-xs transition-all flex flex-col items-center text-center gap-2"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Bookmark size={18} />
            </div>
            <span className="text-xs font-bold text-text">Saved Phrases</span>
            <span className="text-[10px] text-text-secondary">Your phrasebook</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/history')}
            className="p-4 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-xs transition-all flex flex-col items-center text-center gap-2"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-500/10 text-slate-600 dark:text-slate-400 flex items-center justify-center">
              <History size={18} />
            </div>
            <span className="text-xs font-bold text-text">History</span>
            <span className="text-[10px] text-text-secondary">Past talks</span>
          </button>
        </div>
      </div>

      {/* Part 12 Advanced Speaking Intelligence & Fluency Studio */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-primary" />
              <h3 className="text-base font-black text-text">
                Speaking Intelligence & Natural Fluency Arenas
              </h3>
            </div>
            <p className="text-xs text-text-secondary">
              Master pronunciation, bypass translation delays, and practice workplace communication
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. Pronunciation & Stress Studio */}
          <div
            onClick={() => navigate('/talk/pronunciation-studio')}
            className="cursor-pointer group p-5 rounded-3xl bg-card border border-border hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                🔊
              </div>
              <div>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase">
                  Studio
                </span>
                <h4 className="text-base font-black text-text group-hover:text-primary transition-colors mt-1">
                  Pronunciation & Stress Lab
                </h4>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  Syllable stress breakdowns, minimal pairs (ship vs sheep), sentence meaning shifts, and shadowing.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-bold text-primary">
              <span>Open Studio</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. Spontaneous 45s Challenge */}
          <div
            onClick={() => navigate('/talk/spontaneous')}
            className="cursor-pointer group p-5 rounded-3xl bg-card border border-border hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                ⚡
              </div>
              <div>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase">
                  Fluency Reflex
                </span>
                <h4 className="text-base font-black text-text group-hover:text-primary transition-colors mt-1">
                  Spontaneous 45s Speaking
                </h4>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  15-second prep timer with OREO & STAR structure guides to respond under realistic speaking pressure.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-bold text-primary">
              <span>Take Challenge</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3. Rapid Fire Response Drill */}
          <div
            onClick={() => navigate('/talk/rapid')}
            className="cursor-pointer group p-5 rounded-3xl bg-card border border-border hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                🎯
              </div>
              <div>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase">
                  Quick Formation
                </span>
                <h4 className="text-base font-black text-text group-hover:text-primary transition-colors mt-1">
                  Rapid Fire Response Drill
                </h4>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  Fast 10-second prompt drills to eliminate translation hesitation and build instant conversational reflexes.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-bold text-primary">
              <span>Start Rapid Drill</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 4. Professional & Technical Speaking */}
          <div
            onClick={() => navigate('/talk/professional')}
            className="cursor-pointer group p-5 rounded-3xl bg-card border border-border hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                💼
              </div>
              <div>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase">
                  Workplace
                </span>
                <h4 className="text-base font-black text-text group-hover:text-primary transition-colors mt-1">
                  Professional & Technical
                </h4>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  Daily standups, polite disagreement, presentations, system architecture trade-offs, and negotiations.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-bold text-primary">
              <span>Practice Workplace</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 5. Picture Description & Visual Speaking */}
          <div
            onClick={() => navigate('/talk/picture')}
            className="cursor-pointer group p-5 rounded-3xl bg-card border border-border hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                🖼️
              </div>
              <div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase">
                  Visual Fluency
                </span>
                <h4 className="text-base font-black text-text group-hover:text-primary transition-colors mt-1">
                  Picture Speaking & Story
                </h4>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  Describe objects, actions, infer feelings, and narrate what happens next in lively visual scenes.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-bold text-primary">
              <span>View Visual Scenes</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 6. Native-to-English Thinking Bridge */}
          <div
            onClick={() => setIsBridgeModalOpen(true)}
            className="cursor-pointer group p-5 rounded-3xl bg-card border border-border hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                🌐
              </div>
              <div>
                <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-[10px] font-black uppercase">
                  Scaffolding
                </span>
                <h4 className="text-base font-black text-text group-hover:text-primary transition-colors mt-1">
                  Thinking Bridge & Contrasts
                </h4>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  Transform Telugu/Hindi/Tamil thoughts into Natural & Professional English + "Why This Word?" rules.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-bold text-primary">
              <span>Open Thinking Bridge</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Practice Modes Section */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-black uppercase tracking-wider text-text-secondary">
            Classic Conversation Topics
          </h3>
          <span className="text-xs text-text-secondary">Choose how you want to train today</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. Random Conversation */}
          <div
            onClick={handleStartRandom}
            className="cursor-pointer group p-5 rounded-3xl bg-card border border-border hover:border-primary/40 hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                🎲
              </div>
              <div>
                <h4 className="text-base font-black text-text group-hover:text-primary transition-colors">
                  Random Conversation
                </h4>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  Surprise spontaneous topic to train your brain to think and reply fast without overthinking.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-bold text-primary">
              <span>Start Random</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. Today's Topic */}
          <div
            onClick={handleStartToday}
            className="cursor-pointer group p-5 rounded-3xl bg-card border border-border hover:border-primary/40 hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                📅
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-base font-black text-text group-hover:text-primary transition-colors">
                    Today's Topic
                  </h4>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    Daily
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  "My Day & Routine" — Discuss morning habits, office tasks, and evening unwind routines.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-bold text-primary">
              <span>Start Daily Topic</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3. Choose a Topic */}
          <div
            onClick={() => setIsModeSelectorOpen(true)}
            className="cursor-pointer group p-5 rounded-3xl bg-card border border-border hover:border-primary/40 hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                🎯
              </div>
              <div>
                <h4 className="text-base font-black text-text group-hover:text-primary transition-colors">
                  Customize Mode & Goal
                </h4>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  Configure Free, Guided, Interview, or Professional mode with target milestones.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-bold text-primary">
              <span>Customize Mode</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Signature Section: Speaking World (Interactive Realistic Environments) */}
      <div className="pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Globe size={20} className="text-primary" />
              <h2 className="text-xl font-black text-text">
                Speaking World: Interactive Realistic Environments
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
              Choose a place to practice contextual conversations — Hotel, Tea Stall, Supermarket, Airport & more
            </p>
          </div>
        </div>

        <SpeakingWorldMap />
      </div>

      {/* Mode Selector Modal */}
      <ConversationModeSelectorModal
        isOpen={isModeSelectorOpen}
        onClose={() => setIsModeSelectorOpen(false)}
        onLaunch={(cfg) => {
          setIsModeSelectorOpen(false);
          checkConsentAndLaunch(
            cfg.topicId,
            cfg.personaId,
            cfg.difficulty,
            cfg.preferredInput,
            cfg.mode,
            cfg.correctionStyle,
            cfg.nativeLanguage
          );
        }}
      />

      {/* Native Thinking Bridge Modal */}
      <NativeThinkingBridgeModal
        isOpen={isBridgeModalOpen}
        onClose={() => setIsBridgeModalOpen(false)}
        defaultLang="telugu"
      />

      {/* Recording Consent Prompt Modal */}
      {showConsentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-card border border-border p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto text-2xl">
              🎙
            </div>

            <div className="text-center">
              <h3 className="text-lg font-black text-text">Conversation Recording & Privacy</h3>
              <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                LearnTalk saves your speaking turns locally in your browser so you can re-listen to your voice, compare your pronunciation, track your pace, and review corrections in your Recordings Hub.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface border border-border text-xs text-text-secondary space-y-2">
              <div className="flex items-center gap-2 text-text font-semibold">
                <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
                <span>Your privacy is completely protected</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                All voice recognition is handled in your browser via Web Speech API. You can delete or practice without saving anytime.
              </p>
            </div>

            <label className="flex items-center gap-2 text-xs font-semibold text-text cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberConsent}
                onChange={(e) => setRememberConsent(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <span>Remember my choice for future conversations</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => handleConsentChoice(false)}
                className="px-4 py-2.5 rounded-xl bg-surface border border-border text-xs font-bold text-text-secondary hover:text-text hover:bg-surface/80"
              >
                Continue Without Recording
              </button>
              <button
                type="button"
                onClick={() => handleConsentChoice(true)}
                className="px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 shadow-xs"
              >
                Allow Recording
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
