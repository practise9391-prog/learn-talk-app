import React, { useState } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { useCommunity } from '../../context/CommunityContext';
import { useNavigation } from '../../context/NavigationContext';
import { useUser } from '../../context/UserContext';
import { INITIAL_ACTIVE_ROOMS } from '../../data/communityData';
import { communityMatchingEngine } from '../../services/communityMatchingEngine';
import { FindPartnerView } from './FindPartnerView';
import { CommunityChallengesEventsView } from './CommunityChallengesEventsView';
import { CommunityConnectionsView } from './CommunityConnectionsView';
import { QuickMatchModal } from './QuickMatchModal';
import { CommunitySafetySettingsModal } from './CommunitySafetySettingsModal';
import { PeerProfileModal } from './PeerProfileModal';
import { PeerProfile } from '../../types/community';
import {
  Users2,
  Zap,
  Search,
  Shield,
  Volume2,
  Clock,
  Sparkles,
  ArrowRight,
  Flame,
  Award,
  CheckCircle2,
  Settings,
  HeartHandshake,
  MessageSquare,
  Lock,
} from 'lucide-react';

export const CommunityHomeView: React.FC = () => {
  const { privacySettings, peers, blockedUsers, joinRoom, challenge, connections, incomingRequests } = useCommunity();
  const { user } = useUser();
  const { navigate } = useNavigation();

  const [activeTab, setActiveTab] = useState<'overview' | 'find' | 'rooms' | 'challenges' | 'connections'>('overview');
  const [isQuickMatchOpen, setIsQuickMatchOpen] = useState<boolean>(false);
  const [isSafetyOpen, setIsSafetyOpen] = useState<boolean>(false);
  const [selectedPeerProfile, setSelectedPeerProfile] = useState<PeerProfile | null>(null);

  // Top recommended partner (Requirement 54)
  const topPartnerMatch = React.useMemo(() => {
    const criteria = {
      id: user?.id || 'current-user',
      currentLevel: user?.currentLevel || 'B1',
      goals: user?.goals || ['Fluency', 'Workplace'],
      preferredTopics: ['Office English', 'Job Interview'],
    };
    const ranked = communityMatchingEngine.findRankedMatches(criteria, peers, blockedUsers);
    return ranked.length > 0 ? ranked[0] : null;
  }, [peers, blockedUsers, user]);

  const handleJoinRoom = (roomId: string) => {
    joinRoom(roomId);
    navigate('/community/room');
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-12">
      {/* Header with Title & Safety Settings */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Practice English With People"
          subtitle="Practice speaking in a friendly, structured and respectful environment."
          badge="Community Practice"
          showBack={false}
        />

        <button
          type="button"
          onClick={() => setIsSafetyOpen(true)}
          className="self-start sm:self-auto px-3.5 py-2 rounded-2xl bg-surface border border-border hover:border-primary text-xs font-bold text-text flex items-center gap-2 shadow-2xs transition-all"
        >
          <Shield size={14} className="text-emerald-500" />
          <span>Safety & Privacy</span>
        </button>
      </div>

      {/* Optional Peer Practice Notice (Requirement 2) */}
      {privacySettings.practicePreference === 'ai_only' && (
        <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400 flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <span className="font-bold block">Peer Practice is Currently Disabled</span>
            <p className="text-[11px] leading-relaxed">
              Your settings are configured to "AI Only". You will never receive random invitations or appear in discovery.
              You can re-enable peer practice at any time in Safety & Privacy.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsSafetyOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-bold text-text shrink-0"
          >
            Configure
          </button>
        </div>
      )}

      {/* Primary Action Hero Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* 1. Quick Match */}
        <button
          type="button"
          onClick={() => setIsQuickMatchOpen(true)}
          className="p-5 rounded-3xl bg-gradient-to-tr from-primary to-indigo-600 text-white text-left shadow-md shadow-primary/20 hover:scale-[1.01] active:scale-98 transition-all flex flex-col justify-between h-40"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <Zap size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20">
              5–15 Mins
            </span>
          </div>
          <div>
            <h3 className="text-base font-black">Quick Match</h3>
            <p className="text-xs text-white/80 mt-0.5">Instant 1-on-1 audio call with a compatible learner</p>
          </div>
        </button>

        {/* 2. Find Partner */}
        <button
          type="button"
          onClick={() => setActiveTab('find')}
          className="p-5 rounded-3xl bg-card border border-border text-left shadow-xs hover:border-primary/40 hover:scale-[1.01] active:scale-98 transition-all flex flex-col justify-between h-40"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
              <Search size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-text-muted">
              {peers.length} Learners
            </span>
          </div>
          <div>
            <h3 className="text-base font-black text-text">Find Practice Partner</h3>
            <p className="text-xs text-text-muted mt-0.5">Match by English level, topics, and learning style</p>
          </div>
        </button>

        {/* 3. Speaking Rooms */}
        <button
          type="button"
          onClick={() => setActiveTab('rooms')}
          className="p-5 rounded-3xl bg-card border border-border text-left shadow-xs hover:border-primary/40 hover:scale-[1.01] active:scale-98 transition-all flex flex-col justify-between h-40"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center">
              <Users2 size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-500">
              Active Now
            </span>
          </div>
          <div>
            <h3 className="text-base font-black text-text">Speaking Rooms</h3>
            <p className="text-xs text-text-muted mt-0.5">Join structured 1-on-1 calls and round tables</p>
          </div>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold border-b border-border pb-1">
        {[
          { key: 'overview', label: 'Community Overview' },
          { key: 'find', label: 'Find Partner' },
          { key: 'rooms', label: 'Speaking Rooms' },
          { key: 'challenges', label: 'Challenges & Events' },
          {
            key: 'connections',
            label: `My Connections ${
              incomingRequests.length > 0 ? `(${incomingRequests.length})` : ''
            }`,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-primary text-white shadow-2xs font-bold'
                : 'text-text-muted hover:text-text hover:bg-surface'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Recommended Practice Partner Banner (Requirement 54) */}
          {topPartnerMatch && (
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-primary/10 via-indigo-500/10 to-purple-500/10 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    Recommended Partner
                  </span>
                  <span className="text-xs text-text-muted">•</span>
                  <span className="text-xs text-text-muted font-semibold">
                    {topPartnerMatch.badge} ({topPartnerMatch.matchScore}% Compatibility)
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-indigo-600 text-white font-black text-lg flex items-center justify-center">
                    {topPartnerMatch.partner.displayName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-text">{topPartnerMatch.partner.displayName}</h4>
                    <p className="text-xs text-text-muted">{topPartnerMatch.partner.speakingLevel} • Native {topPartnerMatch.partner.nativeLanguage}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-text-muted">
                  {topPartnerMatch.commonReasons.map((r, i) => (
                    <span key={i} className="flex items-center gap-1 font-medium">
                      <span className="text-emerald-500">✓</span> {r}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPeerProfile(topPartnerMatch.partner)}
                className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-2 shadow-xs hover:bg-primary-hover transition-all shrink-0"
              >
                <span>View Profile & Invite</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* Active Speaking Rooms */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-text">Active Practice Rooms</h3>
                <p className="text-xs text-text-muted">Tap to connect directly into an audio practice room</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('rooms')}
                className="text-xs font-bold text-primary hover:underline"
              >
                View all ({INITIAL_ACTIVE_ROOMS.length})
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {INITIAL_ACTIVE_ROOMS.map((room) => (
                <div
                  key={room.id}
                  className="p-5 rounded-3xl bg-card border border-border shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between h-48"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface border border-border text-text-muted capitalize">
                        {room.format}
                      </span>
                      <span className="text-[11px] font-semibold text-text-muted flex items-center gap-1">
                        <Clock size={11} />
                        {room.durationMinutes}m
                      </span>
                    </div>

                    <h4 className="text-xs font-black text-text line-clamp-1">{room.title}</h4>
                    <p className="text-[11px] text-text-muted line-clamp-2 leading-relaxed">
                      Topic: {room.topic}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between">
                    <span className="text-[10px] text-text-muted font-medium">
                      {room.participants.length} / {room.maxParticipants} Speakers
                    </span>

                    <button
                      type="button"
                      onClick={() => handleJoinRoom(room.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-2xs transition-all"
                    >
                      Join Call
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Habit Challenge Banner */}
          <div className="p-5 rounded-3xl bg-card border border-border flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
                <Flame size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                  Community Challenge
                </span>
                <h4 className="text-sm font-black text-text">{challenge.title}</h4>
                <p className="text-xs text-text-muted">
                  {challenge.days.filter((d) => d.isCompleted).length} of {challenge.totalDays} Days Completed
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('challenges')}
              className="px-4 py-2 rounded-xl bg-surface border border-border hover:border-primary text-xs font-bold text-text transition-all"
            >
              Continue Day {challenge.currentDay}
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: FIND PARTNER */}
      {activeTab === 'find' && <FindPartnerView />}

      {/* TAB 3: SPEAKING ROOMS */}
      {activeTab === 'rooms' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INITIAL_ACTIVE_ROOMS.map((room) => (
              <div
                key={room.id}
                className="p-5 rounded-3xl bg-card border border-border shadow-xs hover:border-primary/40 transition-all space-y-3.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 capitalize">
                      {room.format}
                    </span>
                    <span className="text-xs text-text-muted">•</span>
                    <span className="text-xs font-semibold text-text-muted">
                      {room.durationMinutes} Minutes
                    </span>
                  </div>

                  <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Waiting for Partner</span>
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-black text-text">{room.title}</h4>
                  <p className="text-xs text-text-muted leading-relaxed mt-0.5">Topic: {room.topic}</p>
                </div>

                <div className="p-3 rounded-2xl bg-surface border border-border text-xs space-y-1">
                  <span className="font-bold text-text block text-[11px]">Guiding Prompts Preview:</span>
                  <p className="text-text-muted italic text-[11px]">"{room.structuredPrompts[0]}"</p>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <span>Host: <strong>{room.participants[0]?.displayName}</strong></span>
                    <span>•</span>
                    <span>AI {room.facilitatorMode}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleJoinRoom(room.id)}
                    className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-2xs transition-all"
                  >
                    Enter Room
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CHALLENGES & EVENTS */}
      {activeTab === 'challenges' && <CommunityChallengesEventsView />}

      {/* TAB 5: MY CONNECTIONS */}
      {activeTab === 'connections' && <CommunityConnectionsView />}

      {/* Modals */}
      <QuickMatchModal
        isOpen={isQuickMatchOpen}
        onClose={() => setIsQuickMatchOpen(false)}
        onRoomReady={(roomId) => navigate('/community/room')}
      />

      <CommunitySafetySettingsModal
        isOpen={isSafetyOpen}
        onClose={() => setIsSafetyOpen(false)}
      />

      <PeerProfileModal
        isOpen={!!selectedPeerProfile}
        onClose={() => setSelectedPeerProfile(null)}
        peer={selectedPeerProfile}
        onInviteToPractice={(peer) => {
          setSelectedPeerProfile(null);
          setActiveTab('find');
        }}
      />
    </div>
  );
};
