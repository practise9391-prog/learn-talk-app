import React, { useState } from 'react';
import { useCommunity } from '../../context/CommunityContext';
import { useUser } from '../../context/UserContext';
import { useNavigation } from '../../context/NavigationContext';
import { RoomParticipant, GroupSpeakingMode } from '../../types/community';
import {
  Users2,
  Mic,
  MicOff,
  Hand,
  Volume2,
  Clock,
  Sparkles,
  ShieldCheck,
  PhoneOff,
  ArrowRight,
  MoreVertical,
  UserX,
  Lock,
} from 'lucide-react';

export const GroupSpeakingRoomView: React.FC = () => {
  const { activeRoom, leaveRoom, toggleMute, toggleHandRaise, endRoomSession } = useCommunity();
  const { user } = useUser();
  const { navigate } = useNavigation();

  const [activeSpeakerId, setActiveSpeakerId] = useState<string>('peer-rahul');
  const [turnTimerSeconds, setTurnTimerSeconds] = useState<number>(90);

  if (!activeRoom) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 rounded-3xl bg-card border border-border text-center space-y-4">
        <Users2 size={32} className="mx-auto text-text-muted" />
        <h3 className="text-base font-black text-text">No Active Group Room</h3>
        <button
          type="button"
          onClick={() => navigate('/community')}
          className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold"
        >
          Return to Community Hub
        </button>
      </div>
    );
  }

  const currentUserParticipant = activeRoom.participants.find(
    (p) => p.id === (user?.id || 'current-user')
  ) || activeRoom.participants[0];

  const isHostOrMod =
    currentUserParticipant.role === 'host' || currentUserParticipant.role === 'moderator';

  const handleNextSpeaker = () => {
    const list = activeRoom.participants;
    const currentIdx = list.findIndex((p) => p.id === activeSpeakerId);
    const nextIdx = (currentIdx + 1) % list.length;
    setActiveSpeakerId(list[nextIdx].id);
    setTurnTimerSeconds(90);
  };

  const handleLeaveOrEnd = () => {
    endRoomSession();
    navigate('/community');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Header Bar */}
      <div className="p-5 rounded-3xl bg-card border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
            <Users2 size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-500">
                Group Speaking Room ({activeRoom.groupMode?.replace('_', ' ') || 'Round Table'})
              </span>
              <span className="text-xs text-text-muted">•</span>
              <span className="text-xs text-text-muted font-semibold">
                {activeRoom.participants.length} / {activeRoom.maxParticipants} Members
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-text mt-0.5">{activeRoom.title}</h2>
          </div>
        </div>

        {/* Turn Timer & Exit */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-surface border border-border text-xs font-mono font-bold text-text flex items-center gap-1.5">
            <Clock size={13} className="text-primary" />
            <span>Turn: {turnTimerSeconds}s</span>
          </div>

          {isHostOrMod && (
            <button
              type="button"
              onClick={handleNextSpeaker}
              className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1 shadow-xs"
            >
              <span>Next Speaker</span>
              <ArrowRight size={13} />
            </button>
          )}

          <button
            type="button"
            onClick={handleLeaveOrEnd}
            className="px-3.5 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 transition-all flex items-center gap-1"
          >
            <PhoneOff size={13} />
            <span>Leave</span>
          </button>
        </div>
      </div>

      {/* Participants Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
        {activeRoom.participants.map((participant) => {
          const isCurrentSpeaker = participant.id === activeSpeakerId;

          return (
            <div
              key={participant.id}
              className={`p-4 rounded-3xl bg-card border text-center space-y-3 transition-all relative overflow-hidden ${
                isCurrentSpeaker
                  ? 'border-primary ring-2 ring-primary/30 shadow-md'
                  : 'border-border'
              }`}
            >
              {isCurrentSpeaker && (
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-primary text-white text-[9px] font-black uppercase tracking-wider">
                  Speaking Turn
                </div>
              )}

              {participant.hasHandRaised && (
                <div className="absolute top-2 right-2 p-1 rounded-full bg-amber-500 text-white" title="Hand raised">
                  <Hand size={11} />
                </div>
              )}

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xl mx-auto mt-2">
                {participant.displayName.substring(0, 2).toUpperCase()}
              </div>

              <div>
                <h4 className="text-xs font-black text-text line-clamp-1">{participant.displayName}</h4>
                <div className="flex items-center justify-center gap-1 mt-0.5 text-[10px] text-text-muted">
                  <span className="capitalize">{participant.role}</span>
                  <span>•</span>
                  <span>Lvl {participant.currentLevel}</span>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-center gap-2">
                <span className={`p-1.5 rounded-full text-xs ${
                  participant.isMuted ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'
                }`}>
                  {participant.isMuted ? <MicOff size={12} /> : <Mic size={12} />}
                </span>

                <span className="text-[10px] font-semibold text-text-muted">
                  {participant.isMuted ? 'Muted' : 'Speaking'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Turn Control Toolbar */}
      <div className="p-4 rounded-3xl bg-surface border border-border flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={toggleMute}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            currentUserParticipant.isMuted
              ? 'bg-rose-500 text-white'
              : 'bg-primary text-white'
          }`}
        >
          {currentUserParticipant.isMuted ? <MicOff size={14} /> : <Mic size={14} />}
          <span>{currentUserParticipant.isMuted ? 'Unmute Mic' : 'Mute Mic'}</span>
        </button>

        <button
          type="button"
          onClick={toggleHandRaise}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
            currentUserParticipant.hasHandRaised
              ? 'bg-amber-500 text-white border-amber-500'
              : 'bg-card text-text border-border hover:border-amber-500'
          }`}
        >
          <Hand size={14} />
          <span>{currentUserParticipant.hasHandRaised ? 'Lower Hand' : 'Raise Hand'}</span>
        </button>
      </div>
    </div>
  );
};
