import React, { useState } from 'react';
import { useCommunity } from '../../context/CommunityContext';
import { useNavigation } from '../../context/NavigationContext';
import { PracticeConnection, PracticeRequest } from '../../types/community';
import {
  Users2,
  Send,
  Check,
  X,
  RotateCcw,
  Clock,
  Sparkles,
  MessageSquare,
  ShieldAlert,
  ArrowRight,
  Flame,
} from 'lucide-react';

export const CommunityConnectionsView: React.FC = () => {
  const {
    connections,
    incomingRequests,
    outgoingRequests,
    acceptPracticeRequest,
    declinePracticeRequest,
    cancelPracticeRequest,
    sendPracticeRequest,
  } = useCommunity();

  const { navigate } = useNavigation();
  const [activeTab, setActiveTab] = useState<'partners' | 'invitations'>('partners');

  const handleAccept = (reqId: string) => {
    acceptPracticeRequest(reqId);
    navigate('/community/room');
  };

  const handlePracticeAgain = (conn: PracticeConnection) => {
    sendPracticeRequest(conn.partnerId, {
      topic: conn.lastTopic || 'English Practice',
      difficulty: 'normal',
      durationMinutes: 10,
      format: 'structured',
      message: `Hi ${conn.partner.displayName}, let's practice again!`,
    });
    alert(`Practice invitation sent to ${conn.partner.displayName}!`);
  };

  return (
    <div className="space-y-5">
      {/* Top Selector Tabs */}
      <div className="p-1 rounded-2xl bg-surface border border-border flex max-w-sm text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('partners')}
          className={`flex-1 py-2 rounded-xl transition-all ${
            activeTab === 'partners'
              ? 'bg-card text-text shadow-2xs'
              : 'text-text-muted hover:text-text'
          }`}
        >
          My Practice Partners ({connections.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('invitations')}
          className={`relative flex-1 py-2 rounded-xl transition-all ${
            activeTab === 'invitations'
              ? 'bg-card text-text shadow-2xs'
              : 'text-text-muted hover:text-text'
          }`}
        >
          Invitations ({incomingRequests.length})
          {incomingRequests.length > 0 && (
            <span className="ml-1 w-2 h-2 rounded-full bg-primary inline-block" />
          )}
        </button>
      </div>

      {activeTab === 'partners' ? (
        <div className="space-y-4">
          {connections.length === 0 ? (
            <div className="p-12 text-center text-text-muted text-xs bg-card border border-border rounded-3xl space-y-2">
              <Users2 size={32} className="mx-auto opacity-50" />
              <p className="font-bold text-text">No saved practice partners yet</p>
              <p>Practice with compatible learners in Quick Match to save ongoing connections.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connections.map((conn) => (
                <div
                  key={conn.id}
                  className="p-5 rounded-3xl bg-card border border-border shadow-xs hover:border-primary/40 transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center text-white font-black text-lg">
                        {conn.partner.displayName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-text">{conn.partner.displayName}</h4>
                          {conn.partner.isOnline && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          )}
                        </div>
                        <span className="text-xs text-text-muted">
                          {conn.partner.speakingLevel} • Native {conn.partner.nativeLanguage}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-surface border border-border space-y-1 text-xs">
                      <div className="flex items-center justify-between text-[11px] text-text-muted">
                        <span>Sessions Together: <strong>{conn.totalSessionsWithPartner}</strong></span>
                        <span>Last: <strong>{conn.lastPracticedDate}</strong></span>
                      </div>
                      <p className="text-text font-medium text-[11px] line-clamp-1">
                        Last Topic: <em>{conn.lastTopic}</em>
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between">
                    <span className="text-[11px] text-text-muted font-medium">
                      Connected {conn.connectedSince}
                    </span>

                    <button
                      type="button"
                      onClick={() => handlePracticeAgain(conn)}
                      className="px-4 py-1.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1.5 hover:bg-primary-hover shadow-2xs transition-all"
                    >
                      <RotateCcw size={12} />
                      <span>Practice Again</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Invitations Inbox */
        <div className="space-y-5">
          {/* Incoming */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text">
              Incoming Practice Requests ({incomingRequests.length})
            </h3>

            {incomingRequests.length === 0 ? (
              <p className="text-xs text-text-muted italic bg-card p-6 rounded-2xl border border-border text-center">
                No pending requests. Check back soon or send an invite to a peer!
              </p>
            ) : (
              <div className="space-y-3">
                {incomingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-3xl bg-card border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-text">{req.senderName}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-primary/10 text-primary">
                          Level {req.senderLevel}
                        </span>
                        <span className="text-[10px] text-text-muted">• {req.createdAt}</span>
                      </div>
                      <p className="text-xs font-bold text-primary mt-1">Topic: {req.topic}</p>
                      {req.message && (
                        <p className="text-[11px] text-text-muted italic mt-0.5">"{req.message}"</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => declinePracticeRequest(req.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-surface border border-border text-xs font-bold text-text-muted hover:text-text transition-all"
                      >
                        Decline
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAccept(req.id)}
                        className="px-4 py-1.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1.5 hover:bg-primary-hover shadow-xs transition-all"
                      >
                        <Check size={13} />
                        <span>Accept & Start Call</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Outgoing */}
          {outgoingRequests.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-border">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Sent Invitations ({outgoingRequests.length})
              </h3>
              <div className="space-y-2">
                {outgoingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3 rounded-2xl bg-surface border border-border flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-text">To: {req.recipientName}</span>
                      <span className="text-text-muted ml-2">• Topic: {req.topic}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => cancelPracticeRequest(req.id)}
                      className="text-text-muted hover:text-rose-500 font-semibold text-[11px]"
                    >
                      Cancel
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
