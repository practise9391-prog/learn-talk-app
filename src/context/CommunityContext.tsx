// Part 14: Community & Peer Learning Context
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  PeerProfile,
  CommunityPrivacySettings,
  PracticeConnection,
  PracticeRequest,
  PracticeRoom,
  RoomParticipant,
  RoomChatMessage,
  PeerSessionSummary,
  CommunityEvent,
  CommunityChallenge,
  UserBlock,
  UserReport,
  ConversationConsent,
  PracticeConversationType,
} from '../types/community';
import { ConversationDifficulty } from '../types/talk';
import {
  DEFAULT_COMMUNITY_SETTINGS,
  INITIAL_PEER_PROFILES,
  INITIAL_COMMUNITY_EVENTS,
  INITIAL_SEVEN_DAY_CHALLENGE,
  INITIAL_ACTIVE_ROOMS,
} from '../data/communityData';
import { useUser } from './UserContext';
import { useHistory } from './HistoryContext';
import { useAdaptiveLearning } from './AdaptiveLearningContext';

interface CommunityContextType {
  privacySettings: CommunityPrivacySettings;
  updatePrivacySettings: (settings: Partial<CommunityPrivacySettings>) => void;
  peers: PeerProfile[];
  connections: PracticeConnection[];
  incomingRequests: PracticeRequest[];
  outgoingRequests: PracticeRequest[];
  activeRoom: PracticeRoom | null;
  roomMessages: RoomChatMessage[];
  lastSessionSummary: PeerSessionSummary | null;
  events: CommunityEvent[];
  challenge: CommunityChallenge;
  blockedUsers: UserBlock[];
  userReports: UserReport[];
  consent: ConversationConsent;

  // Actions
  sendPracticeRequest: (
    recipientId: string,
    details: {
      topic: string;
      difficulty: ConversationDifficulty;
      durationMinutes: number;
      format: PracticeConversationType;
      message?: string;
    }
  ) => string;
  acceptPracticeRequest: (requestId: string) => PracticeRoom;
  declinePracticeRequest: (requestId: string) => void;
  cancelPracticeRequest: (requestId: string) => void;

  // Room interactions
  createPracticeRoom: (params: {
    title: string;
    topic: string;
    category: string;
    difficulty: ConversationDifficulty;
    durationMinutes: number;
    format: PracticeConversationType;
    maxParticipants?: number;
    facilitatorMode?: 'none' | 'guide' | 'moderator' | 'coach';
    roleplayScenarioId?: string;
  }) => PracticeRoom;
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
  toggleMute: () => void;
  toggleHandRaise: () => void;
  sendMessageInRoom: (text: string) => void;
  advanceRoomPrompt: () => void;
  endRoomSession: () => PeerSessionSummary | null;
  setLastSessionSummary: (summary: PeerSessionSummary | null) => void;

  // Events & Challenges
  toggleEventEnrollment: (eventId: string) => void;
  toggleChallengeDay: (dayNumber: number) => void;

  // Safety
  blockUser: (userId: string, userName: string, reason?: string) => void;
  unblockUser: (userId: string) => void;
  reportUser: (report: Omit<UserReport, 'id' | 'createdAt' | 'status'>) => void;
  updateConsent: (updates: Partial<ConversationConsent>) => void;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export const CommunityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, addSpokenMinutes } = useUser();
  const { logActivity } = useHistory();
  const { recordEvidence } = useAdaptiveLearning();

  // 1. Settings & Privacy
  const [privacySettings, setPrivacySettings] = useState<CommunityPrivacySettings>(() => {
    const saved = localStorage.getItem('learntalk_community_settings');
    return saved ? JSON.parse(saved) : DEFAULT_COMMUNITY_SETTINGS;
  });

  // 2. Peers & Connections
  const [peers, setPeers] = useState<PeerProfile[]>(() => {
    const saved = localStorage.getItem('learntalk_community_peers');
    return saved ? JSON.parse(saved) : INITIAL_PEER_PROFILES;
  });

  const [connections, setConnections] = useState<PracticeConnection[]>(() => {
    const saved = localStorage.getItem('learntalk_community_connections');
    if (saved) return JSON.parse(saved);
    // Initial sample connection
    return [
      {
        id: 'conn-1',
        partnerId: 'peer-priya',
        partner: INITIAL_PEER_PROFILES[0],
        connectedSince: '2 weeks ago',
        totalSessionsWithPartner: 4,
        lastPracticedDate: 'Yesterday',
        lastTopic: 'Daily Standup & Sprint Blocker Updates',
        favoriteTopics: ['Office English', 'Technology'],
      },
    ];
  });

  // 3. Requests
  const [incomingRequests, setIncomingRequests] = useState<PracticeRequest[]>(() => {
    const saved = localStorage.getItem('learntalk_community_incoming_reqs');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'req-init-1',
        senderId: 'peer-kiran',
        senderName: 'Kiran Reddy',
        senderLevel: 'B1',
        recipientId: user?.id || 'current-user',
        recipientName: user?.name || 'Learner',
        topic: 'Job Interview Behavioral Questions (STAR Method)',
        difficulty: 'normal',
        durationMinutes: 10,
        format: 'interview',
        message: 'Hi! Would you like to practice mock behavioral questions together?',
        status: 'pending',
        createdAt: '10 mins ago',
        expiresAt: 'In 2 hours',
      },
    ];
  });

  const [outgoingRequests, setOutgoingRequests] = useState<PracticeRequest[]>(() => {
    const saved = localStorage.getItem('learntalk_community_outgoing_reqs');
    return saved ? JSON.parse(saved) : [];
  });

  // 4. Active Speaking Room & Messages
  const [activeRoom, setActiveRoom] = useState<PracticeRoom | null>(() => {
    const saved = localStorage.getItem('learntalk_active_room');
    return saved ? JSON.parse(saved) : null;
  });

  const [roomMessages, setRoomMessages] = useState<RoomChatMessage[]>([]);
  const [lastSessionSummary, setLastSessionSummary] = useState<PeerSessionSummary | null>(null);

  // 5. Events & Challenge
  const [events, setEvents] = useState<CommunityEvent[]>(() => {
    const saved = localStorage.getItem('learntalk_community_events');
    return saved ? JSON.parse(saved) : INITIAL_COMMUNITY_EVENTS;
  });

  const [challenge, setChallenge] = useState<CommunityChallenge>(() => {
    const saved = localStorage.getItem('learntalk_community_challenge');
    return saved ? JSON.parse(saved) : INITIAL_SEVEN_DAY_CHALLENGE;
  });

  // 6. Safety & Moderation
  const [blockedUsers, setBlockedUsers] = useState<UserBlock[]>(() => {
    const saved = localStorage.getItem('learntalk_community_blocks');
    return saved ? JSON.parse(saved) : [];
  });

  const [userReports, setUserReports] = useState<UserReport[]>(() => {
    const saved = localStorage.getItem('learntalk_community_reports');
    return saved ? JSON.parse(saved) : [];
  });

  const [consent, setConsent] = useState<ConversationConsent>({
    recordingConsent: false,
    transcriptionConsent: true,
    aiAnalysisConsent: true,
    updatedAt: new Date().toISOString(),
  });

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('learntalk_community_settings', JSON.stringify(privacySettings));
  }, [privacySettings]);

  useEffect(() => {
    localStorage.setItem('learntalk_community_peers', JSON.stringify(peers));
  }, [peers]);

  useEffect(() => {
    localStorage.setItem('learntalk_community_connections', JSON.stringify(connections));
  }, [connections]);

  useEffect(() => {
    localStorage.setItem('learntalk_community_incoming_reqs', JSON.stringify(incomingRequests));
  }, [incomingRequests]);

  useEffect(() => {
    localStorage.setItem('learntalk_community_outgoing_reqs', JSON.stringify(outgoingRequests));
  }, [outgoingRequests]);

  useEffect(() => {
    localStorage.setItem('learntalk_community_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('learntalk_community_challenge', JSON.stringify(challenge));
  }, [challenge]);

  useEffect(() => {
    localStorage.setItem('learntalk_community_blocks', JSON.stringify(blockedUsers));
  }, [blockedUsers]);

  useEffect(() => {
    localStorage.setItem('learntalk_community_reports', JSON.stringify(userReports));
  }, [userReports]);

  // Actions
  const updatePrivacySettings = (settings: Partial<CommunityPrivacySettings>) => {
    setPrivacySettings((prev) => ({ ...prev, ...settings }));
  };

  const updateConsent = (updates: Partial<ConversationConsent>) => {
    setConsent((prev) => ({ ...prev, ...updates, updatedAt: new Date().toISOString() }));
  };

  const sendPracticeRequest = (
    recipientId: string,
    details: {
      topic: string;
      difficulty: ConversationDifficulty;
      durationMinutes: number;
      format: PracticeConversationType;
      message?: string;
    }
  ) => {
    const targetPeer = peers.find((p) => p.id === recipientId);
    const newReq: PracticeRequest = {
      id: `req-${Date.now()}`,
      senderId: user?.id || 'current-user',
      senderName: user?.name || 'Learner',
      senderLevel: user?.currentLevel || 'B1',
      recipientId,
      recipientName: targetPeer?.displayName || 'Peer',
      topic: details.topic,
      difficulty: details.difficulty,
      durationMinutes: details.durationMinutes,
      format: details.format,
      message: details.message,
      status: 'pending',
      createdAt: 'Just now',
      expiresAt: 'In 2 hours',
    };

    setOutgoingRequests((prev) => [newReq, ...prev]);
    return newReq.id;
  };

  const acceptPracticeRequest = (requestId: string): PracticeRoom => {
    const req = incomingRequests.find((r) => r.id === requestId);
    const peerCandidate = peers.find((p) => p.id === req?.senderId) || INITIAL_PEER_PROFILES[0];

    // Remove from incoming
    setIncomingRequests((prev) => prev.filter((r) => r.id !== requestId));

    // Ensure connection exists
    if (!connections.some((c) => c.partnerId === peerCandidate.id)) {
      setConnections((prev) => [
        {
          id: `conn-${Date.now()}`,
          partnerId: peerCandidate.id,
          partner: peerCandidate,
          connectedSince: 'Today',
          totalSessionsWithPartner: 1,
          lastPracticedDate: 'Today',
          lastTopic: req?.topic || 'English Conversation',
          favoriteTopics: peerCandidate.practiceTopics,
        },
        ...prev,
      ]);
    }

    // Create room
    const room: PracticeRoom = {
      id: `room-${Date.now()}`,
      title: `${req?.topic || 'English Practice'} with ${peerCandidate.displayName}`,
      topic: req?.topic || 'Spontaneous English Speaking',
      category: 'Peer Practice',
      difficulty: req?.difficulty || 'normal',
      durationMinutes: req?.durationMinutes || 10,
      format: req?.format || 'structured',
      maxParticipants: 2,
      participants: [
        {
          id: user?.id || 'current-user',
          displayName: user?.name || 'You',
          currentLevel: user?.currentLevel || 'B1',
          role: 'host',
          isMuted: false,
          isSpeaking: false,
          hasHandRaised: false,
          audioQuality: 'excellent',
          joinedAt: 'Just now',
        },
        {
          id: peerCandidate.id,
          displayName: peerCandidate.displayName,
          currentLevel: peerCandidate.currentLevel,
          role: 'participant',
          isMuted: false,
          isSpeaking: true,
          hasHandRaised: false,
          audioQuality: 'excellent',
          joinedAt: 'Just now',
        },
      ],
      facilitatorMode: 'guide',
      isLocked: false,
      requiresConsent: true,
      status: 'active',
      createdAt: 'Just now',
      structuredPrompts: [
        `Introduce your connection to: "${req?.topic || 'today\'s topic'}" in 1–2 minutes.`,
        'What is the most challenging aspect you encounter when talking about this?',
        'Ask your partner one follow-up question and build on their thought.',
      ],
      activePromptIndex: 0,
      timerSecondsRemaining: (req?.durationMinutes || 10) * 60,
    };

    setActiveRoom(room);
    setRoomMessages([
      {
        id: `msg-sys-${Date.now()}`,
        senderId: 'system',
        senderName: 'System Facilitator',
        text: `Connected to ${peerCandidate.displayName}. Both microphones are active. Remember to ask follow-up questions!`,
        timestamp: 'Just now',
        isSystemNote: true,
      },
    ]);

    return room;
  };

  const declinePracticeRequest = (requestId: string) => {
    setIncomingRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  const cancelPracticeRequest = (requestId: string) => {
    setOutgoingRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  const createPracticeRoom = (params: {
    title: string;
    topic: string;
    category: string;
    difficulty: ConversationDifficulty;
    durationMinutes: number;
    format: PracticeConversationType;
    maxParticipants?: number;
    facilitatorMode?: 'none' | 'guide' | 'moderator' | 'coach';
    roleplayScenarioId?: string;
  }): PracticeRoom => {
    const room: PracticeRoom = {
      id: `room-${Date.now()}`,
      title: params.title,
      topic: params.topic,
      category: params.category,
      difficulty: params.difficulty,
      durationMinutes: params.durationMinutes,
      format: params.format,
      maxParticipants: params.maxParticipants || 2,
      participants: [
        {
          id: user?.id || 'current-user',
          displayName: user?.name || 'You',
          currentLevel: user?.currentLevel || 'B1',
          role: 'host',
          isMuted: false,
          isSpeaking: false,
          hasHandRaised: false,
          audioQuality: 'excellent',
          joinedAt: 'Just now',
        },
      ],
      facilitatorMode: params.facilitatorMode || 'guide',
      isLocked: false,
      requiresConsent: true,
      status: 'active',
      createdAt: 'Just now',
      structuredPrompts: [
        `Topic: ${params.topic}. Kick off with an open thought.`,
        'Give a personal example or workplace context.',
        'Wrap up key takeaways or conclusions.',
      ],
      activePromptIndex: 0,
      timerSecondsRemaining: params.durationMinutes * 60,
      roleplayScenarioId: params.roleplayScenarioId,
    };

    setActiveRoom(room);
    setRoomMessages([
      {
        id: `msg-sys-${Date.now()}`,
        senderId: 'system',
        senderName: 'System Facilitator',
        text: `Room "${params.title}" created. Waiting for peers to connect or start speaking!`,
        timestamp: 'Just now',
        isSystemNote: true,
      },
    ]);

    return room;
  };

  const joinRoom = (roomId: string) => {
    const matched = INITIAL_ACTIVE_ROOMS.find((r) => r.id === roomId);
    if (!matched) return;

    const updatedParticipants = [
      ...matched.participants,
      {
        id: user?.id || 'current-user',
        displayName: user?.name || 'You',
        currentLevel: user?.currentLevel || 'B1',
        role: 'participant' as const,
        isMuted: false,
        isSpeaking: false,
        hasHandRaised: false,
        audioQuality: 'excellent' as const,
        joinedAt: 'Just now',
      },
    ];

    const joined: PracticeRoom = {
      ...matched,
      participants: updatedParticipants,
      status: 'active',
    };

    setActiveRoom(joined);
    setRoomMessages([
      {
        id: `msg-sys-${Date.now()}`,
        senderId: 'system',
        senderName: 'System Facilitator',
        text: `You joined "${matched.title}". Facilitator mode: ${matched.facilitatorMode.toUpperCase()}.`,
        timestamp: 'Just now',
        isSystemNote: true,
      },
    ]);
  };

  const leaveRoom = () => {
    setActiveRoom(null);
    setRoomMessages([]);
  };

  const toggleMute = () => {
    if (!activeRoom) return;
    setActiveRoom((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        participants: prev.participants.map((p) =>
          p.id === (user?.id || 'current-user') ? { ...p, isMuted: !p.isMuted } : p
        ),
      };
    });
  };

  const toggleHandRaise = () => {
    if (!activeRoom) return;
    setActiveRoom((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        participants: prev.participants.map((p) =>
          p.id === (user?.id || 'current-user') ? { ...p, hasHandRaised: !p.hasHandRaised } : p
        ),
      };
    });
  };

  const sendMessageInRoom = (text: string) => {
    if (!text.trim() || !activeRoom) return;
    const newMsg: RoomChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: user?.id || 'current-user',
      senderName: user?.name || 'You',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setRoomMessages((prev) => [...prev, newMsg]);
  };

  const advanceRoomPrompt = () => {
    if (!activeRoom) return;
    const nextIdx = (activeRoom.activePromptIndex + 1) % activeRoom.structuredPrompts.length;
    setActiveRoom((prev) => (prev ? { ...prev, activePromptIndex: nextIdx } : null));

    setRoomMessages((prev) => [
      ...prev,
      {
        id: `prompt-${Date.now()}`,
        senderId: 'facilitator',
        senderName: 'AI Guide',
        text: `💡 Next Question: "${activeRoom.structuredPrompts[nextIdx]}"`,
        timestamp: 'Just now',
        isSystemNote: true,
      },
    ]);
  };

  const endRoomSession = (): PeerSessionSummary | null => {
    if (!activeRoom) return null;

    const partner = activeRoom.participants.find((p) => p.id !== (user?.id || 'current-user'));
    const partnerName = partner?.displayName || 'Practice Partner';

    const summary: PeerSessionSummary = {
      id: `sum-${Date.now()}`,
      roomId: activeRoom.id,
      topic: activeRoom.topic,
      partnerName,
      partnerId: partner?.id || 'peer-partner',
      durationMinutes: activeRoom.durationMinutes,
      date: 'Today',
      skillsPracticed: ['Spoken English', 'Active Listening', 'Follow-up Questions', 'Conversational Rhythm'],
      selectedGoal: 'Ask at least 3 follow-up questions',
      goalAchieved: true,
      goalProgressText: '3 / 3 questions asked during conversation',
      vocabularyPracticed: ['deliverable', 'objective', 'prioritize', 'blocker', 'clarification'],
      grammarFocusPoints: ['Present Perfect for project updates', 'Polite indirect questions ("Could you explain...")'],
      aiFeedbackSummary: {
        strengths: [
          'Maintained conversational flow without hesitating or switching to native language',
          'Politely acknowledged your partner\'s points before transitioning to your own',
          'Good pronunciation clarity on multi-syllable workplace terms',
        ],
        growthAreas: [
          'Watch preposition choices with dates vs time periods ("in Monday" → "on Monday")',
          'Incorporate more discourse transition markers ("On top of that...", "Having said that...")',
        ],
        repeatedMistakesCount: 1,
        naturalnessTip: 'Instead of saying "I am having a doubt", native speakers prefer "I have a question" or "Could you clarify that?"',
      },
      recommendedNextLesson: {
        id: 'lesson-clarifying-questions',
        title: 'Mastering Polite Clarifications in Meetings',
        level: 'B1',
      },
    };

    // Deep Ecosystem Integration 1: Log to Unified History
    logActivity({
      userId: user?.id || 'current-user',
      activityType: activeRoom.maxParticipants > 2 ? 'group' : 'peer',
      title: `Peer Practice: ${activeRoom.topic}`,
      subtitle: `${activeRoom.durationMinutes} min conversation with ${partnerName}`,
      timestamp: 'Just now',
      durationSeconds: activeRoom.durationMinutes * 60,
      skill: 'speaking',
      score: 88,
      topic: activeRoom.topic,
      difficulty: user?.currentLevel || 'B1',
      speakingMode: 'voice',
      hasRecording: false,
      hasTranscript: true,
      hasFeedback: true,
      saved: false,
      correctionsCount: 1,
    });

    // Deep Ecosystem Integration 2: Feed Evidence to Adaptive Learning Engine
    recordEvidence({
      sourceType: 'talk',
      sourceTitle: `Peer Practice: ${activeRoom.topic}`,
      targetSkill: 'speaking',
      accuracyScore: 88,
      difficulty: activeRoom.difficulty,
      hintsUsedCount: 0,
      contextType: 'dialogue',
    });

    // Deep Ecosystem Integration 3: Add Spoken Minutes
    addSpokenMinutes(activeRoom.durationMinutes);

    setLastSessionSummary(summary);
    setActiveRoom(null);
    setRoomMessages([]);

    return summary;
  };

  const toggleEventEnrollment = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? {
              ...e,
              isEnrolled: !e.isEnrolled,
              enrolledCount: e.isEnrolled ? e.enrolledCount - 1 : e.enrolledCount + 1,
            }
          : e
      )
    );
  };

  const toggleChallengeDay = (dayNumber: number) => {
    setChallenge((prev) => ({
      ...prev,
      days: prev.days.map((d) => (d.dayNumber === dayNumber ? { ...d, isCompleted: !d.isCompleted } : d)),
    }));
  };

  const blockUser = (userId: string, userName: string, reason?: string) => {
    const block: UserBlock = {
      blockedUserId: userId,
      blockedUserName: userName,
      blockedAt: 'Just now',
      reason,
    };
    setBlockedUsers((prev) => [...prev, block]);
    // Remove from peers / connections
    setConnections((prev) => prev.filter((c) => c.partnerId !== userId));
    setIncomingRequests((prev) => prev.filter((r) => r.senderId !== userId));
  };

  const unblockUser = (userId: string) => {
    setBlockedUsers((prev) => prev.filter((b) => b.blockedUserId !== userId));
  };

  const reportUser = (report: Omit<UserReport, 'id' | 'createdAt' | 'status'>) => {
    const newReport: UserReport = {
      ...report,
      id: `rep-${Date.now()}`,
      status: 'pending',
      createdAt: 'Just now',
    };
    setUserReports((prev) => [newReport, ...prev]);
  };

  return (
    <CommunityContext.Provider
      value={{
        privacySettings,
        updatePrivacySettings,
        peers,
        connections,
        incomingRequests,
        outgoingRequests,
        activeRoom,
        roomMessages,
        lastSessionSummary,
        events,
        challenge,
        blockedUsers,
        userReports,
        consent,
        sendPracticeRequest,
        acceptPracticeRequest,
        declinePracticeRequest,
        cancelPracticeRequest,
        createPracticeRoom,
        joinRoom,
        leaveRoom,
        toggleMute,
        toggleHandRaise,
        sendMessageInRoom,
        advanceRoomPrompt,
        endRoomSession,
        setLastSessionSummary,
        toggleEventEnrollment,
        toggleChallengeDay,
        blockUser,
        unblockUser,
        reportUser,
        updateConsent,
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = (): CommunityContextType => {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
};
