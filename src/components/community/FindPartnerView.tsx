import React, { useState } from 'react';
import { useCommunity } from '../../context/CommunityContext';
import { useUser } from '../../context/UserContext';
import { communityMatchingEngine } from '../../services/communityMatchingEngine';
import { PeerProfile, PartnerCompatibility } from '../../types/community';
import { PeerProfileModal } from './PeerProfileModal';
import {
  Search,
  Filter,
  Users2,
  Sparkles,
  Send,
  Eye,
  CheckCircle2,
  Flame,
  Globe,
  Clock,
  Compass,
} from 'lucide-react';

export const FindPartnerView: React.FC = () => {
  const { peers, blockedUsers, sendPracticeRequest } = useCommunity();
  const { user } = useUser();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [onlineOnly, setOnlineOnly] = useState<boolean>(false);

  const [selectedPeerForProfile, setSelectedPeerForProfile] = useState<PeerProfile | null>(null);
  const [selectedPeerForInvite, setSelectedPeerForInvite] = useState<PeerProfile | null>(null);
  const [inviteTopic, setInviteTopic] = useState<string>('Job Interview Practice');
  const [inviteSuccessMsg, setInviteSuccessMsg] = useState<string | null>(null);

  const currentUserCriteria = {
    id: user?.id || 'current-user',
    currentLevel: user?.currentLevel || 'B1',
    goals: user?.goals || ['Fluency', 'Workplace'],
    preferredTopics: ['Office English', 'Job Interview'],
    preferredStyle: 'structured' as const,
  };

  // Evaluate candidate compatibilities
  const rankedMatches: PartnerCompatibility[] = communityMatchingEngine.findRankedMatches(
    currentUserCriteria,
    peers,
    blockedUsers
  );

  const filteredMatches = rankedMatches.filter(({ partner }) => {
    if (levelFilter !== 'all' && partner.currentLevel !== levelFilter) return false;
    if (onlineOnly && !partner.isOnline) return false;
    if (topicFilter !== 'all' && !partner.practiceTopics.some((t) => t.toLowerCase().includes(topicFilter.toLowerCase()))) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = partner.displayName.toLowerCase().includes(q);
      const matchLang = partner.nativeLanguage.toLowerCase().includes(q);
      const matchBio = (partner.learningBio || '').toLowerCase().includes(q);
      const matchGoals = partner.learningGoals.some((g) => g.toLowerCase().includes(q));
      if (!matchName && !matchLang && !matchBio && !matchGoals) return false;
    }
    return true;
  });

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPeerForInvite) return;

    sendPracticeRequest(selectedPeerForInvite.id, {
      topic: inviteTopic,
      difficulty: 'normal',
      durationMinutes: 10,
      format: 'structured',
      message: `Hi ${selectedPeerForInvite.displayName}, would you like to practice ${inviteTopic} together?`,
    });

    setInviteSuccessMsg(`Practice invitation sent to ${selectedPeerForInvite.displayName}!`);
    setTimeout(() => {
      setInviteSuccessMsg(null);
      setSelectedPeerForInvite(null);
    }, 2500);
  };

  return (
    <div className="space-y-5">
      {/* Search and Filters Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-card border border-border shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, language, goals..."
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-surface border border-border text-xs text-text placeholder:text-text-muted focus:outline-none focus:border-primary"
            />
          </div>

          {/* Quick Filter Selectors */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-surface border border-border text-text focus:outline-none"
            >
              <option value="all">All Levels</option>
              <option value="A1">A1 Beginner</option>
              <option value="A2">A2 Elementary</option>
              <option value="B1">B1 Intermediate</option>
              <option value="B2">B2 Upper-Intermediate</option>
              <option value="C1">C1 Advanced</option>
            </select>

            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-surface border border-border text-text focus:outline-none"
            >
              <option value="all">All Topics</option>
              <option value="Office">Office English</option>
              <option value="Interview">Job Interview</option>
              <option value="Technology">Technology</option>
              <option value="Travel">Travel</option>
              <option value="Daily">Daily Life</option>
            </select>

            <label className="flex items-center gap-1.5 cursor-pointer px-2.5 py-1.5 rounded-xl bg-surface border border-border font-semibold text-text">
              <input
                type="checkbox"
                checked={onlineOnly}
                onChange={(e) => setOnlineOnly(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-primary border-border"
              />
              <span>Online Now</span>
            </label>
          </div>
        </div>
      </div>

      {/* Candidate Peers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMatches.length === 0 ? (
          <div className="md:col-span-2 p-12 text-center text-text-muted text-xs bg-card border border-border rounded-3xl space-y-2">
            <Users2 size={32} className="mx-auto opacity-50" />
            <p className="font-bold text-text">No practice partners found</p>
            <p>Try clearing some filters or searching for a different topic.</p>
          </div>
        ) : (
          filteredMatches.map(({ partner, matchScore, badge, commonReasons }) => (
            <div
              key={partner.id}
              className="p-5 rounded-3xl bg-card border border-border hover:border-primary/40 shadow-xs transition-all space-y-3.5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Peer Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
                      {partner.displayName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-text">{partner.displayName}</h4>
                        {partner.isOnline && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Online" />
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-text-muted mt-0.5">
                        <span className="font-bold text-primary px-1.5 py-0.2 rounded bg-primary/10">
                          {partner.speakingLevel}
                        </span>
                        <span>•</span>
                        <span>Native: {partner.nativeLanguage}</span>
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                    badge === 'Top Match'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                      : 'bg-primary/10 text-primary border-primary/20'
                  }`}>
                    {badge}
                  </span>
                </div>

                {/* Compatibility Reasons */}
                <div className="space-y-1">
                  {commonReasons.map((r, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-text-muted font-medium">
                      <span className="text-emerald-500">✓</span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>

                {/* Bio snippet */}
                {partner.learningBio && (
                  <p className="text-xs text-text-muted line-clamp-2 leading-relaxed italic bg-surface/60 p-2.5 rounded-xl border border-border">
                    "{partner.learningBio}"
                  </p>
                )}

                {/* Topics pills */}
                <div className="flex flex-wrap gap-1">
                  {partner.practiceTopics.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-lg bg-surface border border-border text-[10px] font-medium text-text-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPeerForProfile(partner)}
                  className="px-3 py-1.5 rounded-xl bg-surface border border-border hover:border-primary text-xs font-bold text-text flex items-center gap-1 transition-all"
                >
                  <Eye size={12} />
                  <span>Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPeerForInvite(partner)}
                  className="px-4 py-1.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1.5 hover:bg-primary-hover shadow-2xs transition-all"
                >
                  <Send size={12} />
                  <span>Invite to Practice</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Full Profile Modal */}
      <PeerProfileModal
        isOpen={!!selectedPeerForProfile}
        onClose={() => setSelectedPeerForProfile(null)}
        peer={selectedPeerForProfile}
        onInviteToPractice={(peer) => setSelectedPeerForInvite(peer)}
      />

      {/* Invite Setup Modal Dialog */}
      {selectedPeerForInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-card border border-border w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-black text-text">Invite {selectedPeerForInvite.displayName}</h3>
              <button
                type="button"
                onClick={() => setSelectedPeerForInvite(null)}
                className="p-1 rounded-lg text-text-muted hover:text-text"
              >
                ✕
              </button>
            </div>

            {inviteSuccessMsg ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 size={36} className="mx-auto text-emerald-500 animate-in zoom-in" />
                <p className="text-xs font-bold text-text">{inviteSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleSendInvite} className="space-y-3.5 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-text">Select Practice Topic</label>
                  <select
                    value={inviteTopic}
                    onChange={(e) => setInviteTopic(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none focus:border-primary font-medium"
                  >
                    <option value="Job Interview Practice">Job Interview Practice</option>
                    <option value="Office English & Standup Updates">Office English & Standup Updates</option>
                    <option value="Travel & Airport Scenarios">Travel & Airport Scenarios</option>
                    <option value="Daily Routine & Hobbies">Daily Routine & Hobbies</option>
                    <option value="Mini Debate: Remote Work">Mini Debate: Remote Work</option>
                  </select>
                </div>

                <div className="p-3 rounded-2xl bg-surface border border-border space-y-1 text-[11px] text-text-muted">
                  <p>• <strong>Duration:</strong> 10 Minutes</p>
                  <p>• <strong>Format:</strong> Structured Speaking with AI Guide</p>
                  <p>• <strong>Audio:</strong> Safe, audio-only practice call</p>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setSelectedPeerForInvite(null)}
                    className="px-3.5 py-2 rounded-xl bg-surface border border-border text-text-muted font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-primary text-white font-bold flex items-center gap-1.5 hover:bg-primary-hover shadow-xs transition-all"
                  >
                    <Send size={12} />
                    <span>Send Invitation</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
