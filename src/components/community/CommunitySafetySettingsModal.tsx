import React from 'react';
import { useCommunity } from '../../context/CommunityContext';
import {
  SpeakingPracticePreference,
  ProfileVisibility,
} from '../../types/community';
import {
  X,
  Shield,
  Eye,
  Bell,
  Lock,
  Mic,
  Sparkles,
  UserX,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface CommunitySafetySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommunitySafetySettingsModal: React.FC<CommunitySafetySettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { privacySettings, updatePrivacySettings, blockedUsers, unblockUser } = useCommunity();

  if (!isOpen) return null;

  const practicePreferences: { key: SpeakingPracticePreference; title: string; desc: string }[] = [
    { key: 'all_modes', title: 'All Practice Modes (Recommended)', desc: 'AI, self-talk, roleplays, and friendly human peer practice' },
    { key: 'ai_peer', title: 'AI + Peer Practice', desc: 'Focus on AI coaching and 1-on-1 human speaking sessions' },
    { key: 'ai_self', title: 'AI + Self Practice', desc: 'Solo shadowing drills, audio playback, and Jarvis AI calls' },
    { key: 'ai_only', title: 'AI Only', desc: 'Completely private — no peer discovery or community invitations' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-card border border-border w-full max-w-xl rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Shield size={20} />
            </div>
            <div>
              <h3 className="text-base font-black text-text">Community Safety & Privacy</h3>
              <p className="text-xs text-text-muted">You control discovery, invitations, and practice modes</p>
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

        <div className="space-y-5 text-xs">
          {/* 1. Practice Preference */}
          <div className="space-y-2">
            <label className="font-bold text-text block text-sm">Speaking Practice Preference</label>
            <div className="space-y-2">
              {practicePreferences.map((pref) => (
                <button
                  key={pref.key}
                  type="button"
                  onClick={() => updatePrivacySettings({ practicePreference: pref.key })}
                  className={`w-full p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    privacySettings.practicePreference === pref.key
                      ? 'bg-primary/10 border-primary shadow-2xs'
                      : 'bg-surface hover:bg-card border-border text-text'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                    privacySettings.practicePreference === pref.key
                      ? 'border-primary bg-primary'
                      : 'border-border'
                  }`}>
                    {privacySettings.practicePreference === pref.key && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-text block">{pref.title}</span>
                    <span className="text-[11px] text-text-muted block mt-0.5 leading-relaxed">{pref.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Partner Discovery & Profile Visibility */}
          <div className="space-y-3 pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-bold text-text block">Allow Practice Partner Discovery</label>
                <p className="text-[11px] text-text-muted mt-0.5">
                  When enabled, compatible learners can discover your learning profile to invite you to practice.
                </p>
              </div>

              <input
                type="checkbox"
                checked={privacySettings.isDiscoveryEnabled}
                onChange={(e) => updatePrivacySettings({ isDiscoveryEnabled: e.target.checked })}
                className="w-5 h-5 rounded text-primary border-border focus:ring-primary/20 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-text block">Profile Visibility</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'compatible_only', label: 'Compatible Learners Only' },
                  { key: 'community', label: 'All Community Learners' },
                  { key: 'connections_only', label: 'My Connections Only' },
                  { key: 'private', label: 'Completely Hidden' },
                ].map((v) => (
                  <button
                    key={v.key}
                    type="button"
                    onClick={() => updatePrivacySettings({ profileVisibility: v.key as ProfileVisibility })}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      privacySettings.profileVisibility === v.key
                        ? 'bg-primary text-white border-primary font-bold shadow-2xs'
                        : 'bg-surface hover:bg-card border-border text-text'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Communication Safeguards */}
          <div className="space-y-2.5 pt-3 border-t border-border">
            <label className="font-bold text-text block text-sm">Interaction Rules</label>

            <div className="space-y-2">
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-surface border border-border cursor-pointer">
                <span className="font-semibold text-text">Allow incoming 1-on-1 practice invitations</span>
                <input
                  type="checkbox"
                  checked={privacySettings.allowIncomingRequests}
                  onChange={(e) => updatePrivacySettings({ allowIncomingRequests: e.target.checked })}
                  className="w-4 h-4 rounded text-primary border-border"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-surface border border-border cursor-pointer">
                <span className="font-semibold text-text">Allow learning-focused practice direct messages</span>
                <input
                  type="checkbox"
                  checked={privacySettings.allowDirectPracticeMessages}
                  onChange={(e) => updatePrivacySettings({ allowDirectPracticeMessages: e.target.checked })}
                  className="w-4 h-4 rounded text-primary border-border"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-surface border border-border cursor-pointer">
                <span className="font-semibold text-text">Allow group speaking room invitations</span>
                <input
                  type="checkbox"
                  checked={privacySettings.allowGroupRoomInvites}
                  onChange={(e) => updatePrivacySettings({ allowGroupRoomInvites: e.target.checked })}
                  className="w-4 h-4 rounded text-primary border-border"
                />
              </label>
            </div>
          </div>

          {/* 4. Blocked Users Management */}
          <div className="space-y-2 pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <label className="font-bold text-text block">Blocked Learners ({blockedUsers.length})</label>
              <span className="text-[11px] text-text-muted">Blocked users cannot match, call, or see your profile</span>
            </div>

            {blockedUsers.length === 0 ? (
              <p className="text-[11px] text-text-muted italic py-1">No blocked learners. Your interactions are clear.</p>
            ) : (
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {blockedUsers.map((b) => (
                  <div
                    key={b.blockedUserId}
                    className="p-2.5 rounded-xl bg-surface border border-border flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-text block">{b.blockedUserName}</span>
                      <span className="text-[10px] text-text-muted">Blocked {b.blockedAt}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => unblockUser(b.blockedUserId)}
                      className="px-2.5 py-1 rounded-lg bg-card border border-border text-[11px] font-bold text-text hover:text-primary transition-all"
                    >
                      Unblock
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-border flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-hover shadow-xs transition-all"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
