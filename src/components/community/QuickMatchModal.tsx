import React, { useState } from 'react';
import { useCommunity } from '../../context/CommunityContext';
import { useUser } from '../../context/UserContext';
import { communityMatchingEngine } from '../../services/communityMatchingEngine';
import { ConversationDifficulty } from '../../types/talk';
import { PracticeConversationType, AIFacilitatorMode } from '../../types/community';
import {
  X,
  Zap,
  Clock,
  Sparkles,
  Compass,
  MessageSquare,
  Users2,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Send,
} from 'lucide-react';

interface QuickMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoomReady: (roomId: string) => void;
}

export const QuickMatchModal: React.FC<QuickMatchModalProps> = ({
  isOpen,
  onClose,
  onRoomReady,
}) => {
  const { peers, blockedUsers, createPracticeRoom } = useCommunity();
  const { user } = useUser();

  const [duration, setDuration] = useState<number>(10);
  const [difficulty, setDifficulty] = useState<ConversationDifficulty>('normal');
  const [topic, setTopic] = useState<string>('Daily Life & Weekend Plans');
  const [conversationType, setConversationType] = useState<PracticeConversationType>('structured');
  const [facilitatorMode, setFacilitatorMode] = useState<AIFacilitatorMode>('guide');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [matchResult, setMatchResult] = useState<{ name: string; reasons: string[] } | null>(null);

  if (!isOpen) return null;

  const topicsList = [
    'Daily Life & Weekend Plans',
    'Office English & Project Updates',
    'Job Interview Practice',
    'Travel & Airport Conversations',
    'Technology & Future Innovations',
    'Food, Dining & Restaurant Etiquette',
    'Movies, Books & Pop Culture',
    'Debate: Remote vs Office Work',
    'Free Spontaneous Conversation',
  ];

  const conversationTypes: { key: PracticeConversationType; label: string; desc: string }[] = [
    { key: 'casual', label: 'Casual', desc: 'Friendly, low-pressure everyday dialogue' },
    { key: 'structured', label: 'Structured', desc: 'Guided progressive question cards' },
    { key: 'interview', label: 'Mock Interview', desc: 'Interviewer & candidate roles' },
    { key: 'debate', label: 'Mini Debate', desc: 'Express arguments and polite counters' },
    { key: 'storytelling', label: 'Story Building', desc: 'Collaborative imaginative narrative' },
    { key: 'qa', label: 'Rapid Q&A', desc: 'Practice spontaneous thinking speed' },
  ];

  const handleStartMatch = () => {
    setIsSearching(true);

    const currentUserCriteria = {
      id: user?.id || 'current-user',
      currentLevel: user?.currentLevel || 'B1',
      goals: user?.goals || ['Fluency', 'Workplace'],
      preferredTopics: [topic],
      preferredStyle: 'structured' as const,
    };

    const bestMatch = communityMatchingEngine.quickMatch(
      currentUserCriteria,
      peers,
      { topic, durationMinutes: duration, format: conversationType },
      blockedUsers
    );

    setTimeout(() => {
      const partnerName = bestMatch ? bestMatch.partner.displayName : 'Priya K.';
      const reasons = bestMatch
        ? bestMatch.commonReasons
        : ['Similar English speaking proficiency', 'Both available for a 10-minute session'];

      setMatchResult({ name: partnerName, reasons });

      setTimeout(() => {
        const room = createPracticeRoom({
          title: `${topic} Practice`,
          topic,
          category: 'Quick Match',
          difficulty,
          durationMinutes: duration,
          format: conversationType,
          maxParticipants: 2,
          facilitatorMode,
        });

        setIsSearching(false);
        setMatchResult(null);
        onClose();
        onRoomReady(room.id);
      }, 1500);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-card border border-border w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <Zap size={20} />
            </div>
            <div>
              <h3 className="text-base font-black text-text">Quick Match Practice Call</h3>
              <p className="text-xs text-text-muted">Instant compatible English speaking partner</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSearching}
            className="p-1.5 rounded-xl text-text-muted hover:text-text hover:bg-surface border border-transparent hover:border-border transition-all disabled:opacity-30"
          >
            <X size={18} />
          </button>
        </div>

        {isSearching ? (
          <div className="py-10 text-center space-y-4">
            {matchResult ? (
              <div className="space-y-3 animate-in zoom-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-500">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="text-base font-black text-text">Found Practice Match: {matchResult.name}!</h4>
                <div className="space-y-1 max-w-xs mx-auto">
                  {matchResult.reasons.map((r, i) => (
                    <div key={i} className="text-xs text-text-muted flex items-center justify-center gap-1.5 font-medium">
                      <span className="text-emerald-500">✓</span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-primary font-bold animate-pulse pt-2">Connecting to human practice room...</p>
              </div>
            ) : (
              <div className="space-y-3">
                <Loader2 size={36} className="mx-auto text-primary animate-spin" />
                <h4 className="text-sm font-black text-text">Finding Compatible English Speaker...</h4>
                <p className="text-xs text-text-muted max-w-xs mx-auto">
                  Matching on level ({user?.currentLevel || 'B1'}), availability, and learning goals.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            {/* 1. Practice Duration */}
            <div className="space-y-1.5">
              <label className="font-bold text-text flex items-center gap-1.5">
                <Clock size={13} className="text-primary" />
                <span>Practice Duration</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 15].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`py-2 rounded-xl font-bold border transition-all text-center ${
                      duration === d
                        ? 'bg-primary text-white border-primary shadow-xs'
                        : 'bg-surface hover:bg-card border-border text-text'
                    }`}
                  >
                    {d} Minutes
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Topic Selector */}
            <div className="space-y-1.5">
              <label className="font-bold text-text flex items-center gap-1.5">
                <Compass size={13} className="text-primary" />
                <span>Practice Topic</span>
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none focus:border-primary font-medium"
              >
                {topicsList.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Conversation Format */}
            <div className="space-y-1.5">
              <label className="font-bold text-text flex items-center gap-1.5">
                <MessageSquare size={13} className="text-primary" />
                <span>Conversation Format</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {conversationTypes.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setConversationType(c.key)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      conversationType === c.key
                        ? 'bg-primary/10 border-primary text-text shadow-2xs'
                        : 'bg-surface hover:bg-card border-border text-text'
                    }`}
                  >
                    <span className="font-bold text-text block leading-tight">{c.label}</span>
                    <span className="text-[10px] text-text-muted block mt-0.5 leading-tight">{c.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. AI Facilitator Mode */}
            <div className="space-y-1.5">
              <label className="font-bold text-text flex items-center gap-1.5">
                <Sparkles size={13} className="text-primary" />
                <span>AI Facilitator Role</span>
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { key: 'guide', label: 'AI Guide', desc: 'Prompts & questions' },
                  { key: 'moderator', label: 'Moderator', desc: 'Keeps on topic' },
                  { key: 'coach', label: 'Coach', desc: 'Post-call feedback' },
                  { key: 'none', label: 'None', desc: 'Human-only talk' },
                ].map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setFacilitatorMode(m.key as any)}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      facilitatorMode === m.key
                        ? 'bg-primary text-white border-primary shadow-xs font-bold'
                        : 'bg-surface hover:bg-card border-border text-text'
                    }`}
                  >
                    <span className="text-xs block font-bold">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span>Audio-only • Safe learning environment</span>
              </div>

              <button
                type="button"
                onClick={handleStartMatch}
                className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold flex items-center gap-2 hover:bg-primary-hover shadow-md shadow-primary/20 active:scale-98 transition-all"
              >
                <Zap size={14} />
                <span>Find Partner</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
