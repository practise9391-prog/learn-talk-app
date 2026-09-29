import React, { useState } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { SpeakingWorldMap } from '../map/SpeakingWorldMap';
import { useNavigation } from '../../context/NavigationContext';
import { useUser } from '../../context/UserContext';
import { CONVERSATION_TOPICS } from '../../data/talkTopics';
import { AI_PERSONAS } from '../../data/personas';
import { ConversationDifficulty } from '../../types/talk';
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
  Award
} from 'lucide-react';

export const TalkHomeView: React.FC = () => {
  const { navigate } = useNavigation();
  const { user } = useUser();

  // Start Conversation Modal state
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('topic-my-day');
  const [customTopicText, setCustomTopicText] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<ConversationDifficulty>('normal');
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('jarvis');
  const [preferredMode, setPreferredMode] = useState<'voice' | 'text'>('voice');

  // Recording Privacy Consent Modal
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [rememberConsent, setRememberConsent] = useState(true);
  const [pendingLaunchParams, setPendingLaunchParams] = useState<{
    topicId: string;
    personaId: string;
    difficulty: ConversationDifficulty;
    mode: 'voice' | 'text';
  } | null>(null);

  // Check consent status from localStorage
  const checkConsentAndLaunch = (
    topicId: string,
    personaId: string,
    difficulty: ConversationDifficulty,
    mode: 'voice' | 'text'
  ) => {
    const hasConsented = localStorage.getItem('learntalk_recording_consent');
    if (mode === 'voice' && !hasConsented) {
      setPendingLaunchParams({ topicId, personaId, difficulty, mode });
      setShowConsentModal(true);
      return;
    }

    launchDirectly(topicId, personaId, difficulty, mode);
  };

  const launchDirectly = (
    topicId: string,
    personaId: string,
    difficulty: ConversationDifficulty,
    mode: 'voice' | 'text'
  ) => {
    if (mode === 'voice') {
      navigate('/talk/call', { topicId, personaId, difficulty, initialMode: 'voice' });
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
      const { topicId, personaId, difficulty, mode } = pendingLaunchParams;
      launchDirectly(topicId, personaId, difficulty, mode);
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

  const handleModalLaunch = () => {
    setIsStartModalOpen(false);
    checkConsentAndLaunch(selectedTopicId, selectedPersonaId, selectedDifficulty, preferredMode);
  };

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <PageHeader
        title="Talk with Jarvis"
        subtitle="Your AI English Conversation Partner — Practice speaking naturally with zero judgment"
        badge="Live AI Speaking"
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
                  Strict Context Lock
                </span>
              </div>
              <p className="text-xs sm:text-sm text-text-muted mt-2 max-w-2xl leading-relaxed">
                "Hello {user.name}! I'm Jarvis. I'm here to listen, reply naturally, gently point out better words, and help you think directly in English without hesitations."
              </p>

              {/* Speaking Quota & 24x7 limit indicator */}
              <div className="mt-3 flex items-center gap-4 text-xs font-semibold text-text-muted">
                <div className="flex items-center gap-1.5 text-text">
                  <Clock size={14} className="text-primary" />
                  <span>Today's Speaking: <strong>{user.minutesSpokenToday} mins</strong> spoken</span>
                </div>
                <span className="text-border">|</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  Unlimited Conversational Turns
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsStartModalOpen(true)}
              className="px-7 py-3.5 bg-primary text-primary-foreground font-black text-sm rounded-2xl shadow-lg shadow-primary/30 hover:bg-primary-hover active:scale-98 transition-all flex items-center justify-center gap-2.5"
            >
              <Mic size={18} className="animate-pulse" />
              <span>🎙 Start Talking Now</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/talk/jarvis')}
              className="px-5 py-2.5 bg-surface border border-border text-text font-bold text-xs rounded-xl hover:bg-surface-hover active:scale-98 transition-all flex items-center justify-center gap-2"
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
          <h3 className="text-xs font-black uppercase tracking-wider text-text-muted">
            Quick Actions
          </h3>
          <span className="text-xs text-text-muted">Instant tools to support your speaking</span>
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
            <span className="text-[10px] text-text-muted">Type & learn</span>
          </button>

          <button
            type="button"
            onClick={() => checkConsentAndLaunch('topic-my-day', 'jarvis', 'normal', 'voice')}
            className="p-4 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-xs transition-all flex flex-col items-center text-center gap-2"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Mic size={18} />
            </div>
            <span className="text-xs font-bold text-text">Voice Chat</span>
            <span className="text-[10px] text-text-muted">Phone-call style</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/talk/speaking-help')}
            className="p-4 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-xs transition-all flex flex-col items-center text-center gap-2"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <HelpCircle size={18} />
            </div>
            <span className="text-xs font-bold text-text">Speaking Help</span>
            <span className="text-[10px] text-text-muted">Starters & stems</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/talk/translate')}
            className="p-4 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-xs transition-all flex flex-col items-center text-center gap-2"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Languages size={18} />
            </div>
            <span className="text-xs font-bold text-text">Translate</span>
            <span className="text-[10px] text-text-muted">Telugu & Hindi</span>
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
            <span className="text-[10px] text-text-muted">Your phrasebook</span>
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
            <span className="text-[10px] text-text-muted">Past talks</span>
          </button>
        </div>
      </div>

      {/* Practice Modes Section */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-black uppercase tracking-wider text-text-muted">
            Practice Modes
          </h3>
          <span className="text-xs text-text-muted">Choose how you want to train today</span>
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
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
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
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
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
            onClick={() => setIsStartModalOpen(true)}
            className="cursor-pointer group p-5 rounded-3xl bg-card border border-border hover:border-primary/40 hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                🎯
              </div>
              <div>
                <h4 className="text-base font-black text-text group-hover:text-primary transition-colors">
                  Choose a Topic
                </h4>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  Select from 10 structured topics (Cricket, Travel, Tech, Food) or type your custom idea.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-bold text-primary">
              <span>Browse Catalog</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 4. Interview Practice */}
          <div
            onClick={() => checkConsentAndLaunch('topic-interview', 'vikram', 'normal', 'voice')}
            className="cursor-pointer group p-5 rounded-3xl bg-card border border-border hover:border-primary/40 hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                💼
              </div>
              <div>
                <h4 className="text-base font-black text-text group-hover:text-primary transition-colors">
                  Job Interview Simulator
                </h4>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  Practice self-introductions, technical questions, project storytelling, and salary talks.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-bold text-primary">
              <span>Start Interview</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 5. Office & Workplace Conversation */}
          <div
            onClick={() => checkConsentAndLaunch('topic-office', 'jarvis', 'normal', 'voice')}
            className="cursor-pointer group p-5 rounded-3xl bg-card border border-border hover:border-primary/40 hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                🏢
              </div>
              <div>
                <h4 className="text-base font-black text-text group-hover:text-primary transition-colors">
                  Office & Standup Sync
                </h4>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  Practice agile updates, deadline negotiations, requesting help, and 1:1 manager syncs.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-bold text-primary">
              <span>Enter Office Sync</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 6. Roleplay Directory */}
          <div
            onClick={() => navigate('/roleplay')}
            className="cursor-pointer group p-5 rounded-3xl bg-card border border-border hover:border-primary/40 hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                🎭
              </div>
              <div>
                <h4 className="text-base font-black text-text group-hover:text-primary transition-colors">
                  Roleplay Directory
                </h4>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  Hotel check-ins, ordering food, complaining to customer care, buying tickets, and doctor visits.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-bold text-primary">
              <span>Explore Scenarios</span>
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
            <p className="text-xs sm:text-sm text-text-muted mt-0.5">
              Choose a place to practice contextual conversations — Hotel, Tea Stall, Supermarket, Airport & more
            </p>
          </div>
        </div>

        <SpeakingWorldMap />
      </div>

      {/* Start Conversation Setup Modal */}
      {isStartModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl rounded-3xl bg-card border border-border p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🎙</span>
                <div>
                  <h3 className="text-lg font-black text-text">Start a Conversation with Jarvis</h3>
                  <p className="text-xs text-text-muted">Strict context locking will keep Jarvis focused on your choice</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsStartModalOpen(false)}
                className="text-text-muted hover:text-text font-bold text-sm px-2 py-1"
              >
                ✕
              </button>
            </div>

            {/* Step 1: Select Topic */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-text-muted mb-2">
                1. Select Topic
              </label>

              {/* Custom Topic Input */}
              <div className="mb-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customTopicText}
                    onChange={(e) => {
                      setCustomTopicText(e.target.value);
                      if (e.target.value) {
                        setSelectedTopicId('custom');
                      }
                    }}
                    placeholder="I want to talk about (e.g. My favorite sci-fi movies)..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-surface border border-border text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  {customTopicText && (
                    <span className="text-[11px] font-bold text-primary px-2 py-1 rounded bg-primary/10">
                      Custom Selected
                    </span>
                  )}
                </div>
              </div>

              {/* Topic Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1 border border-border/40 rounded-2xl bg-surface/50">
                {CONVERSATION_TOPICS.map((top) => {
                  const isSelected = selectedTopicId === top.id && !customTopicText;
                  return (
                    <button
                      key={top.id}
                      type="button"
                      onClick={() => {
                        setSelectedTopicId(top.id);
                        setCustomTopicText('');
                      }}
                      className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                        isSelected
                          ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                          : 'bg-card border-border hover:bg-surface text-text'
                      }`}
                    >
                      <span className="text-lg">{top.icon}</span>
                      <div className="truncate">
                        <p className="text-xs font-bold truncate">{top.title}</p>
                        <p className={`text-[10px] truncate ${isSelected ? 'text-primary-foreground/80' : 'text-text-muted'}`}>
                          {top.category}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Choose Difficulty */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-text-muted mb-2">
                2. Conversation Difficulty
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['easy', 'normal', 'challenging', 'advanced'] as ConversationDifficulty[]).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all ${
                      selectedDifficulty === diff
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'bg-surface border border-border text-text-muted hover:text-text'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Choose Persona */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-text-muted mb-2">
                3. Conversational Partner
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {AI_PERSONAS.slice(0, 5).map((p) => {
                  const isSelected = selectedPersonaId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPersonaId(p.id)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                        isSelected
                          ? 'bg-primary/10 border-primary text-text'
                          : 'bg-surface border-border text-text-muted hover:text-text'
                      }`}
                    >
                      <span className="text-xl">{p.avatar}</span>
                      <div className="truncate">
                        <p className="text-xs font-bold text-text truncate">{p.name}</p>
                        <p className="text-[10px] text-text-muted truncate">{p.tone} • {p.role}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Mode Selection */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-text-muted mb-2">
                4. Experience Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPreferredMode('voice')}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    preferredMode === 'voice'
                      ? 'bg-primary/10 border-primary text-text'
                      : 'bg-surface border-border text-text-muted'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                    <Mic size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-text">Phone Call (Voice)</p>
                    <p className="text-[10px] text-text-muted">Real-time voice with barge-in</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPreferredMode('text')}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    preferredMode === 'text'
                      ? 'bg-primary/10 border-primary text-text'
                      : 'bg-surface border-border text-text-muted'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-surface border border-border text-text flex items-center justify-center shrink-0">
                    <MessageSquare size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-text">Text Chat</p>
                    <p className="text-[10px] text-text-muted">Type and read corrections</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Launch Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setIsStartModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-text-muted hover:bg-surface"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleModalLaunch}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary-hover shadow-md flex items-center gap-2"
              >
                <span>Launch Conversation</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recording Consent Prompt Modal (Requirement 40) */}
      {showConsentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-card border border-border p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto text-2xl">
              🎙
            </div>

            <div className="text-center">
              <h3 className="text-lg font-black text-text">Conversation Recording & Privacy</h3>
              <p className="text-xs text-text-muted mt-2 leading-relaxed">
                LearnTalk can save your speaking turns locally so you can re-listen to your voice, compare your pronunciation, track your pace, and review corrections in your Recordings Hub.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface border border-border text-xs text-text-muted space-y-2">
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
                className="px-4 py-2.5 rounded-xl bg-surface border border-border text-xs font-bold text-text-muted hover:text-text hover:bg-surface-hover"
              >
                Continue Without Recording
              </button>
              <button
                type="button"
                onClick={() => handleConsentChoice(true)}
                className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary-hover shadow-sm"
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
