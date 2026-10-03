import React, { useState, useEffect, useRef } from 'react';
import { useCommunity } from '../../context/CommunityContext';
import { useUser } from '../../context/UserContext';
import { useNavigation } from '../../context/NavigationContext';
import { PeerSessionSummaryModal } from './PeerSessionSummaryModal';
import {
  Mic,
  MicOff,
  PhoneOff,
  Volume2,
  Sparkles,
  HelpCircle,
  Lightbulb,
  Compass,
  Clock,
  ShieldCheck,
  Send,
  MessageSquare,
  AlertTriangle,
  ArrowRight,
  Languages,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';

export const HumanSpeakingRoomView: React.FC = () => {
  const {
    activeRoom,
    leaveRoom,
    toggleMute,
    sendMessageInRoom,
    roomMessages,
    advanceRoomPrompt,
    endRoomSession,
    lastSessionSummary,
    setLastSessionSummary,
    reportUser,
    blockUser,
  } = useCommunity();

  const { user } = useUser();
  const { navigate } = useNavigation();

  const [activeTab, setActiveTab] = useState<'guidance' | 'chat'>('guidance');
  const [chatInput, setChatInput] = useState<string>('');
  const [timerSeconds, setTimerSeconds] = useState<number>(activeRoom?.timerSecondsRemaining || 600);
  const [showBrainFreeze, setShowBrainFreeze] = useState<boolean>(false);
  const [nativeThought, setNativeThought] = useState<string>('');
  const [thoughtTranslations, setThoughtTranslations] = useState<{
    simple: string;
    natural: string;
    pro: string;
  } | null>(null);

  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Timer countdown
  useEffect(() => {
    if (!activeRoom) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeRoom]);

  // Scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [roomMessages]);

  if (!activeRoom) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 rounded-3xl bg-card border border-border text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center mx-auto text-text-muted">
          <PhoneOff size={24} />
        </div>
        <h3 className="text-base font-black text-text">No Active Practice Session</h3>
        <p className="text-xs text-text-muted">
          You are not currently in a speaking call. Choose Quick Match or join a practice room from the Community hub.
        </p>
        <button
          type="button"
          onClick={() => navigate('/community')}
          className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-xs transition-all"
        >
          Go to Community Home
        </button>
      </div>
    );
  }

  const currentUserParticipant = activeRoom.participants.find((p) => p.id === (user?.id || 'current-user')) || activeRoom.participants[0];
  const partnerParticipant = activeRoom.participants.find((p) => p.id !== (user?.id || 'current-user')) || {
    id: 'peer-partner',
    displayName: 'Practice Partner',
    currentLevel: 'B1',
    role: 'participant',
    isMuted: false,
    isSpeaking: true,
    hasHandRaised: false,
    audioQuality: 'excellent',
    joinedAt: 'Just now',
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendMessageInRoom(chatInput.trim());
    setChatInput('');
  };

  const handleTranslateThought = () => {
    if (!nativeThought.trim()) return;
    const query = nativeThought.trim().toLowerCase();

    if (query.includes('nenu') || query.includes('cheppali') || query.includes('doubt')) {
      setThoughtTranslations({
        simple: 'I have a question about this project.',
        natural: 'Could you clarify what you meant by that?',
        pro: 'I would appreciate some additional perspective on that deliverable.',
      });
    } else {
      setThoughtTranslations({
        simple: `Regarding ${nativeThought}: here is my thought.`,
        natural: `Speaking of ${nativeThought}, from my experience it works best when organized.`,
        pro: `In light of ${nativeThought}, our core focus should be consistency and clarity.`,
      });
    }
  };

  const handleEndCall = () => {
    const summary = endRoomSession();
    if (summary) {
      setShowSummaryModal(true);
    } else {
      leaveRoom();
      navigate('/community');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Top Session Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-card border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Compass size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                Topic-Locked Practice
              </span>
              <span className="text-xs text-text-muted">•</span>
              <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Audio Connected</span>
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-text mt-0.5">{activeRoom.topic}</h2>
          </div>
        </div>

        {/* Timer & Facilitator Mode */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-surface border border-border text-xs font-mono font-bold text-text flex items-center gap-1.5">
            <Clock size={13} className="text-primary" />
            <span>
              {String(Math.floor(timerSeconds / 60)).padStart(2, '0')}:
              {String(timerSeconds % 60).padStart(2, '0')}
            </span>
          </div>

          <div className="px-2.5 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-xs font-bold text-primary flex items-center gap-1">
            <Sparkles size={12} />
            <span className="capitalize">AI {activeRoom.facilitatorMode}</span>
          </div>

          <button
            type="button"
            onClick={handleEndCall}
            className="px-4 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 shadow-xs transition-all flex items-center gap-1"
          >
            <PhoneOff size={13} />
            <span>End Call</span>
          </button>
        </div>
      </div>

      {/* Main Call Stage */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left: Speaker Audio Stage */}
        <div className="md:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-6">
            {/* Visual Speaker Avatars */}
            <div className="grid grid-cols-2 gap-4">
              {/* Partner Card */}
              <div className="p-5 rounded-2xl bg-surface border border-border text-center space-y-3 relative overflow-hidden">
                <div className="relative inline-block">
                  <div className={`w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-2xl shadow-lg transition-all ${
                    partnerParticipant.isSpeaking ? 'ring-4 ring-primary/40 scale-105' : ''
                  }`}>
                    {partnerParticipant.displayName.substring(0, 2).toUpperCase()}
                  </div>
                  {partnerParticipant.isSpeaking && (
                    <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 text-white shadow-xs">
                      <Volume2 size={12} />
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-black text-text">{partnerParticipant.displayName}</h4>
                  <span className="text-[11px] text-text-muted block">Level {partnerParticipant.currentLevel}</span>
                </div>

                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-card border border-border text-[10px] text-emerald-500 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Excellent Quality</span>
                </div>
              </div>

              {/* Current User Card */}
              <div className="p-5 rounded-2xl bg-surface border border-border text-center space-y-3 relative overflow-hidden">
                <div className="relative inline-block">
                  <div className={`w-20 h-20 rounded-3xl bg-gradient-to-tr from-primary to-emerald-500 flex items-center justify-center text-white font-black text-2xl shadow-lg transition-all ${
                    !currentUserParticipant.isMuted ? 'ring-4 ring-primary/40' : 'opacity-80'
                  }`}>
                    {currentUserParticipant.displayName.substring(0, 2).toUpperCase()}
                  </div>
                  {currentUserParticipant.isMuted && (
                    <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-rose-500 text-white shadow-xs">
                      <MicOff size={12} />
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-black text-text">You ({currentUserParticipant.displayName})</h4>
                  <span className="text-[11px] text-text-muted block">Level {currentUserParticipant.currentLevel}</span>
                </div>

                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-card border border-border text-[10px] text-text-muted font-semibold">
                  <span>{currentUserParticipant.isMuted ? 'Muted' : 'Mic Active'}</span>
                </div>
              </div>
            </div>

            {/* Audio Controls Toolbar */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={toggleMute}
                className={`p-3.5 rounded-2xl font-bold flex items-center gap-2 text-xs transition-all shadow-xs ${
                  currentUserParticipant.isMuted
                    ? 'bg-rose-500 text-white hover:bg-rose-600'
                    : 'bg-primary text-white hover:bg-primary-hover'
                }`}
              >
                {currentUserParticipant.isMuted ? <MicOff size={16} /> : <Mic size={16} />}
                <span>{currentUserParticipant.isMuted ? 'Unmute Mic' : 'Mute Mic'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowBrainFreeze(!showBrainFreeze)}
                className="px-4 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-bold text-xs flex items-center gap-1.5 hover:bg-amber-500/20 transition-all"
              >
                <HelpCircle size={15} />
                <span>Need Help? (Brain-Freeze)</span>
              </button>
            </div>
          </div>

          {/* Brain-Freeze Helper Drawer */}
          {showBrainFreeze && (
            <div className="p-5 rounded-3xl bg-surface border border-primary/30 shadow-md space-y-3.5 animate-in fade-in">
              <div className="flex items-center justify-between pb-1 border-b border-border">
                <div className="flex items-center gap-2">
                  <Lightbulb size={16} className="text-amber-500" />
                  <span className="text-xs font-bold text-text">Brain-Freeze & Thought Prompter</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBrainFreeze(false)}
                  className="text-text-muted hover:text-text font-bold text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Thought translation prompt */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-text-muted block">
                  Thinking in Telugu or Hindi? Type your thought to get natural English options:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={nativeThought}
                    onChange={(e) => setNativeThought(e.target.value)}
                    placeholder="e.g. nenu project gurinchi cheppali..."
                    className="flex-1 px-3 py-2 rounded-xl bg-card border border-border text-xs text-text placeholder:text-text-muted focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={handleTranslateThought}
                    className="px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1 shrink-0"
                  >
                    <Languages size={13} />
                    <span>Bridge</span>
                  </button>
                </div>
              </div>

              {thoughtTranslations && (
                <div className="space-y-2 pt-2 animate-in zoom-in">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                    Choose and speak out loud:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-card border border-border">
                      <span className="text-[10px] font-bold text-primary block uppercase">Simple:</span>
                      <p className="text-text font-semibold mt-0.5">{thoughtTranslations.simple}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block uppercase">Natural:</span>
                      <p className="text-text font-bold mt-0.5">{thoughtTranslations.natural}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
                      <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 block uppercase">Professional:</span>
                      <p className="text-text font-semibold mt-0.5">{thoughtTranslations.pro}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Conversation Guidance & Text Fallback */}
        <div className="md:col-span-5 flex flex-col space-y-3">
          {/* Tab selector */}
          <div className="p-1 rounded-2xl bg-surface border border-border flex text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('guidance')}
              className={`flex-1 py-1.5 rounded-xl transition-all ${
                activeTab === 'guidance'
                  ? 'bg-card text-text shadow-2xs'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              Conversation Guidance
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-1.5 rounded-xl transition-all ${
                activeTab === 'chat'
                  ? 'bg-card text-text shadow-2xs'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              Text Chat ({roomMessages.length})
            </button>
          </div>

          {activeTab === 'guidance' ? (
            <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-4 flex-1">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-xs font-bold text-text">Structured Questions</span>
                <span className="text-[11px] font-semibold text-text-muted">
                  Prompt {activeRoom.activePromptIndex + 1} of {activeRoom.structuredPrompts.length}
                </span>
              </div>

              {/* Active Prompt Card */}
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-primary">Current Question</span>
                <p className="text-sm font-bold text-text leading-relaxed">
                  "{activeRoom.structuredPrompts[activeRoom.activePromptIndex]}"
                </p>
              </div>

              {/* Guidance Tips */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-text block">Practice Tips:</span>
                <ul className="space-y-1.5 text-text-muted pl-4 list-disc leading-relaxed text-[11px]">
                  <li>Listen without interrupting while your partner speaks.</li>
                  <li>Build on their point: "That reminds me of...", "Interesting, why did you choose that?"</li>
                  <li>Avoid simple yes/no answers — provide one concrete example.</li>
                </ul>
              </div>

              <button
                type="button"
                onClick={advanceRoomPrompt}
                className="w-full py-2.5 rounded-xl bg-surface border border-border hover:border-primary text-xs font-bold text-text hover:text-primary transition-all flex items-center justify-center gap-1.5"
              >
                <span>Advance to Next Question</span>
                <ArrowRight size={13} />
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-3xl bg-card border border-border shadow-xs flex-1 flex flex-col justify-between h-[360px]">
              {/* Message List */}
              <div className="overflow-y-auto space-y-2.5 pr-1 flex-1 text-xs">
                {roomMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-2.5 rounded-2xl ${
                      msg.isSystemNote
                        ? 'bg-surface/80 border border-border text-[11px] text-text-muted italic text-center'
                        : msg.senderId === (user?.id || 'current-user')
                        ? 'bg-primary text-white ml-auto max-w-[80%]'
                        : 'bg-surface border border-border text-text max-w-[80%]'
                    }`}
                  >
                    {!msg.isSystemNote && (
                      <span className="text-[10px] font-bold block opacity-80 mb-0.5">{msg.senderName}</span>
                    )}
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="pt-2 border-t border-border flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type a word or sentence..."
                  className="flex-1 px-3 py-2 rounded-xl bg-surface border border-border text-xs text-text placeholder:text-text-muted focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="p-2 rounded-xl bg-primary text-white disabled:opacity-40"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Post-Session Summary Modal */}
      <PeerSessionSummaryModal
        summary={lastSessionSummary}
        isOpen={showSummaryModal}
        onClose={() => {
          setShowSummaryModal(false);
          setLastSessionSummary(null);
          navigate('/community');
        }}
      />
    </div>
  );
};
