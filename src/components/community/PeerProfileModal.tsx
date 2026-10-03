import React, { useState } from 'react';
import { PeerProfile } from '../../types/community';
import { useCommunity } from '../../context/CommunityContext';
import {
  X,
  Shield,
  Clock,
  Sparkles,
  Flame,
  Award,
  Globe,
  BookOpen,
  MessageSquare,
  AlertTriangle,
  UserX,
  Send,
  CheckCircle2,
} from 'lucide-react';

interface PeerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  peer: PeerProfile | null;
  onInviteToPractice?: (peer: PeerProfile) => void;
}

export const PeerProfileModal: React.FC<PeerProfileModalProps> = ({
  isOpen,
  onClose,
  peer,
  onInviteToPractice,
}) => {
  const { blockUser, reportUser } = useCommunity();
  const [showSafetyMenu, setShowSafetyMenu] = useState<boolean>(false);
  const [reportReason, setReportReason] = useState<string>('');
  const [isReporting, setIsReporting] = useState<boolean>(false);
  const [reportSuccess, setReportSuccess] = useState<boolean>(false);

  if (!isOpen || !peer) return null;

  const handleBlock = () => {
    if (window.confirm(`Are you sure you want to block ${peer.displayName}? You will no longer match or see each other.`)) {
      blockUser(peer.id, peer.displayName, 'User requested block');
      onClose();
    }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason.trim()) return;

    reportUser({
      reportedUserId: peer.id,
      reportedUserName: peer.displayName,
      reporterUserId: 'current-user',
      category: 'other',
      description: reportReason.trim(),
    });

    setReportSuccess(true);
    setTimeout(() => {
      setReportSuccess(false);
      setIsReporting(false);
      setReportReason('');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-card border border-border w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md">
              {peer.displayName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-text">{peer.displayName}</h3>
                {peer.isOnline && (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Online now" />
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-text-muted">
                <span className="font-bold text-primary px-1.5 py-0.2 rounded bg-primary/10">
                  {peer.speakingLevel}
                </span>
                <span>•</span>
                <span>Native: {peer.nativeLanguage}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-text-muted hover:text-text hover:bg-surface border border-transparent hover:border-border transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Bio */}
        {peer.learningBio && (
          <div className="p-3.5 rounded-2xl bg-surface border border-border text-xs text-text leading-relaxed italic">
            "{peer.learningBio}"
          </div>
        )}

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="p-3 rounded-2xl bg-surface border border-border">
            <span className="text-[10px] font-bold text-text-muted uppercase block">Sessions</span>
            <span className="text-lg font-black text-text mt-0.5 block">{peer.sessionsCompleted}</span>
            <span className="text-[10px] text-emerald-500 font-semibold">Completed</span>
          </div>

          <div className="p-3 rounded-2xl bg-surface border border-border">
            <span className="text-[10px] font-bold text-text-muted uppercase block">Practice Streak</span>
            <span className="text-lg font-black text-amber-500 mt-0.5 block flex items-center justify-center gap-0.5">
              <Flame size={16} />
              <span>{peer.streakDays}d</span>
            </span>
            <span className="text-[10px] text-text-muted">Consistent</span>
          </div>

          <div className="p-3 rounded-2xl bg-surface border border-border">
            <span className="text-[10px] font-bold text-text-muted uppercase block">Style</span>
            <span className="text-xs font-bold text-text mt-1.5 block capitalize">{peer.preferredStyle}</span>
            <span className="text-[10px] text-text-muted capitalize">{peer.preferredPace} pace</span>
          </div>
        </div>

        {/* Learning Goals */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-text uppercase tracking-wider block">Learning Goals</span>
          <div className="flex flex-wrap gap-1.5">
            {peer.learningGoals.map((g) => (
              <span
                key={g}
                className="px-2.5 py-1 rounded-xl bg-primary/10 text-primary border border-primary/20 text-xs font-semibold"
              >
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Practice Topics */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-text uppercase tracking-wider block">Favorite Practice Topics</span>
          <div className="flex flex-wrap gap-1.5">
            {peer.practiceTopics.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 rounded-xl bg-surface text-text-muted border border-border text-xs font-medium"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="p-3 rounded-2xl bg-surface border border-border flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-text-muted" />
            <span className="font-bold text-text">Usual Availability:</span>
          </div>
          <span className="text-text-muted font-medium">{peer.availabilityTimeWindow}</span>
        </div>

        {/* Safety & Action Controls */}
        <div className="space-y-3 pt-2 border-t border-border">
          {isReporting ? (
            <form onSubmit={handleReportSubmit} className="space-y-2.5 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs">
              <span className="font-bold text-rose-600 dark:text-rose-400 block">Report {peer.displayName}</span>
              {reportSuccess ? (
                <div className="text-center py-2 text-emerald-600 font-bold flex items-center justify-center gap-1">
                  <CheckCircle2 size={16} />
                  <span>Report submitted confidentially to moderation team.</span>
                </div>
              ) : (
                <>
                  <textarea
                    rows={2}
                    required
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="Briefly describe the inappropriate behavior or safety concern..."
                    className="w-full p-2.5 rounded-xl bg-card border border-border text-xs text-text focus:outline-none focus:border-rose-500 resize-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsReporting(false)}
                      className="px-3 py-1 rounded-lg bg-surface border border-border text-text-muted font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 rounded-lg bg-rose-500 text-white font-bold"
                    >
                      Submit Report
                    </button>
                  </div>
                </>
              )}
            </form>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsReporting(true)}
                  className="p-2 rounded-xl text-text-muted hover:text-rose-500 hover:bg-surface border border-border transition-all text-xs flex items-center gap-1 font-semibold"
                  title="Report inappropriate behavior"
                >
                  <AlertTriangle size={13} />
                  <span>Report</span>
                </button>

                <button
                  type="button"
                  onClick={handleBlock}
                  className="p-2 rounded-xl text-text-muted hover:text-rose-500 hover:bg-surface border border-border transition-all text-xs flex items-center gap-1 font-semibold"
                  title="Block this learner"
                >
                  <UserX size={13} />
                  <span>Block</span>
                </button>
              </div>

              {onInviteToPractice && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onInviteToPractice(peer);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-primary/20 hover:bg-primary-hover active:scale-98 transition-all"
                >
                  <Send size={13} />
                  <span>Invite to Practice</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
