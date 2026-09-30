import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  ContentStatus,
  ContentType,
  ManagedContentItem,
  AdminAuditLog,
  ManagedUserAccount,
  SystemHealthData,
} from '../types/admin';

interface AdminContextType {
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
  managedContent: ManagedContentItem[];
  managedUsers: ManagedUserAccount[];
  auditLogs: AdminAuditLog[];
  systemHealth: SystemHealthData;
  featureFlags: { [key: string]: boolean };
  toggleFeatureFlag: (flagName: string) => void;
  submitForReview: (contentId: string) => void;
  approveContent: (contentId: string) => void;
  publishContent: (contentId: string) => void;
  archiveContent: (contentId: string) => void;
  createDraftContent: (item: Omit<ManagedContentItem, 'id' | 'version' | 'status' | 'updatedAt'>) => string;
  updateUserStatus: (userId: string, status: 'active' | 'suspended') => void;
  updateUserRole: (userId: string, role: UserRole) => void;
  generateAiContentDraft: (type: ContentType, topic: string, level: any) => string;
}

const INITIAL_MANAGED_CONTENT: ManagedContentItem[] = [
  {
    id: 'cnt-001',
    title: 'Present Perfect Continuous in Workplace Updates',
    type: 'grammar_topic',
    level: 'B1',
    version: 1,
    status: 'draft',
    author: 'AI Assistant',
    updatedAt: '2 hours ago',
    summary: 'Teach "have been working on" for ongoing sprint projects vs "have finished" for completed tasks.',
    contentData: {},
  },
  {
    id: 'cnt-002',
    title: 'Salary Negotiation & Offer Counter Roleplay',
    type: 'roleplay_scenario',
    level: 'B2',
    version: 2,
    status: 'review',
    author: 'Elena (Content Team)',
    reviewer: 'Marcus (Lead Linguist)',
    updatedAt: 'Yesterday',
    summary: 'Polite negotiation formulas and justification structures for candidate compensation discussion.',
    contentData: {},
  },
  {
    id: 'cnt-003',
    title: 'Professional Technical Collocations Bank',
    type: 'vocabulary_item',
    level: 'B1',
    version: 1,
    status: 'approved',
    author: 'David (Curriculum)',
    reviewer: 'Elena',
    updatedAt: '3 days ago',
    summary: 'High-frequency verb + noun pairings: allocate resources, encounter roadblocks, streamline workflow.',
    contentData: {},
  },
  {
    id: 'cnt-004',
    title: 'Unit 2: Talking About Daily Routines',
    type: 'curriculum_lesson',
    level: 'A1',
    version: 3,
    status: 'published',
    author: 'Sarah (Head of Pedagogy)',
    reviewer: 'Marcus',
    updatedAt: '1 week ago',
    summary: '7-step foundation lesson on Simple Present and time prepositions.',
    contentData: {},
  },
];

const INITIAL_USERS: ManagedUserAccount[] = [
  {
    id: 'usr-1',
    name: 'Pavan (Current Learner)',
    email: 'pavan@example.com',
    role: 'admin',
    currentLevel: 'A1',
    status: 'active',
    joinedDate: '2 weeks ago',
    lastActive: 'Today at 09:20 AM',
    lessonsCompleted: 8,
    speakingMinutes: 48,
  },
  {
    id: 'usr-2',
    name: 'Ananya Sharma',
    email: 'ananya@example.com',
    role: 'learner',
    currentLevel: 'B1',
    status: 'active',
    joinedDate: '1 month ago',
    lastActive: 'Yesterday',
    lessonsCompleted: 24,
    speakingMinutes: 120,
  },
  {
    id: 'usr-3',
    name: 'Rohan Verma',
    email: 'rohan@example.com',
    role: 'content_editor',
    currentLevel: 'B2',
    status: 'active',
    joinedDate: '3 weeks ago',
    lastActive: '2 days ago',
    lessonsCompleted: 15,
    speakingMinutes: 72,
  },
  {
    id: 'usr-4',
    name: 'Vikram Rao',
    email: 'vikram@example.com',
    role: 'learner',
    currentLevel: 'A2',
    status: 'suspended',
    joinedDate: '2 months ago',
    lastActive: '1 week ago',
    lessonsCompleted: 4,
    speakingMinutes: 14,
  },
];

const INITIAL_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: 'log-1',
    actor: 'Sarah (Admin)',
    action: 'Published Lesson',
    target: 'Unit 2: Daily Routines (v3)',
    timestamp: 'Today at 08:30 AM',
    details: 'Verified natural audio recordings and phonetic keys.',
  },
  {
    id: 'log-2',
    actor: 'Marcus (Reviewer)',
    action: 'Approved Content',
    target: 'Workplace Collocations Set',
    timestamp: 'Yesterday',
    details: 'Validated collocation nuance explanations for Indian English learners.',
  },
  {
    id: 'log-3',
    actor: 'System Engine',
    action: 'Health Check Verification',
    target: 'LLM & ASR Endpoints',
    timestamp: 'Yesterday',
    details: 'All 6 microservices operational with avg latency 182ms.',
  },
];

const INITIAL_SYSTEM_HEALTH: SystemHealthData = {
  services: [
    { service: 'Core API Gateway', status: 'healthy', latencyMs: 24, uptimePercent: 99.98, lastChecked: 'Just now' },
    { service: 'Database (PostgreSQL / Storage)', status: 'healthy', latencyMs: 18, uptimePercent: 100, lastChecked: 'Just now' },
    { service: 'LLM Reasoning Service', status: 'healthy', latencyMs: 210, uptimePercent: 99.92, lastChecked: 'Just now' },
    { service: 'ASR Speech Recognition Engine', status: 'healthy', latencyMs: 180, uptimePercent: 99.88, lastChecked: 'Just now' },
    { service: 'TTS Neural Voice Audio Synthesizer', status: 'healthy', latencyMs: 140, uptimePercent: 99.95, lastChecked: 'Just now' },
    { service: 'Secure Object Storage (Audio & Recordings)', status: 'healthy', latencyMs: 45, uptimePercent: 100, lastChecked: 'Just now' },
  ],
  activeFeatureFlags: {
    voiceShadowing: true,
    aiPhoneCalls: true,
    jamArena: true,
    experimentalSpeedDrill: true,
    nativeThoughtBridging: true,
    offlinePwaCache: true,
  },
  errorRatePercent: 0.08,
  totalApiCalls24h: 18450,
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('admin');

  const [managedContent, setManagedContent] = useState<ManagedContentItem[]>(() => {
    const saved = localStorage.getItem('learntalk_managed_content');
    return saved ? JSON.parse(saved) : INITIAL_MANAGED_CONTENT;
  });

  const [managedUsers, setManagedUsers] = useState<ManagedUserAccount[]>(() => {
    const saved = localStorage.getItem('learntalk_managed_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(() => {
    const saved = localStorage.getItem('learntalk_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [featureFlags, setFeatureFlags] = useState<{ [key: string]: boolean }>(
    INITIAL_SYSTEM_HEALTH.activeFeatureFlags
  );

  useEffect(() => {
    localStorage.setItem('learntalk_managed_content', JSON.stringify(managedContent));
  }, [managedContent]);

  useEffect(() => {
    localStorage.setItem('learntalk_managed_users', JSON.stringify(managedUsers));
  }, [managedUsers]);

  useEffect(() => {
    localStorage.setItem('learntalk_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const logAudit = (action: string, target: string, details: string) => {
    const newLog: AdminAuditLog = {
      id: `log-${Date.now()}`,
      actor: `${currentUserRole.toUpperCase()} (Current)`,
      action,
      target,
      timestamp: 'Just now',
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const toggleFeatureFlag = (flagName: string) => {
    setFeatureFlags((prev) => {
      const next = { ...prev, [flagName]: !prev[flagName] };
      logAudit('Toggled Feature Flag', flagName, `State changed to ${next[flagName]}`);
      return next;
    });
  };

  const submitForReview = (contentId: string) => {
    setManagedContent((prev) =>
      prev.map((c) => (c.id === contentId ? { ...c, status: 'review', updatedAt: 'Just now' } : c))
    );
    logAudit('Submitted Content for Review', contentId, 'Moved from Draft to Review queue');
  };

  const approveContent = (contentId: string) => {
    setManagedContent((prev) =>
      prev.map((c) =>
        c.id === contentId
          ? { ...c, status: 'approved', reviewer: 'Admin (Current)', updatedAt: 'Just now' }
          : c
      )
    );
    logAudit('Approved Content', contentId, 'Content marked Approved and ready for publish');
  };

  const publishContent = (contentId: string) => {
    setManagedContent((prev) =>
      prev.map((c) =>
        c.id === contentId
          ? { ...c, status: 'published', version: c.version + 1, updatedAt: 'Just now' }
          : c
      )
    );
    logAudit('Published Live Content', contentId, 'Content deployed to production curriculum');
  };

  const archiveContent = (contentId: string) => {
    setManagedContent((prev) =>
      prev.map((c) => (c.id === contentId ? { ...c, status: 'archived', updatedAt: 'Just now' } : c))
    );
    logAudit('Archived Content', contentId, 'Content retired from live learner view');
  };

  const createDraftContent = (
    item: Omit<ManagedContentItem, 'id' | 'version' | 'status' | 'updatedAt'>
  ) => {
    const id = `cnt-${Date.now()}`;
    const newContent: ManagedContentItem = {
      ...item,
      id,
      version: 1,
      status: 'draft',
      updatedAt: 'Just now',
    };
    setManagedContent((prev) => [newContent, ...prev]);
    logAudit('Created Content Draft', newContent.title, `Type: ${newContent.type}, Level: ${newContent.level}`);
    return id;
  };

  const updateUserStatus = (userId: string, status: 'active' | 'suspended') => {
    setManagedUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status } : u))
    );
    logAudit('Updated User Status', userId, `Changed status to ${status}`);
  };

  const updateUserRole = (userId: string, role: UserRole) => {
    setManagedUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role } : u))
    );
    logAudit('Updated User Role', userId, `Role changed to ${role}`);
  };

  const generateAiContentDraft = (type: ContentType, topic: string, level: any) => {
    const title = `${topic} Educational Module`;
    const summary = `AI-generated draft for ${topic} targeting ${level} CEFR learners. Validated for grammatical consistency.`;
    const id = createDraftContent({
      title,
      type,
      level,
      author: 'AI Content Assistant',
      summary,
      contentData: { generatedBy: 'LLM Orchestrator v2', validated: true },
    });
    return id;
  };

  return (
    <AdminContext.Provider
      value={{
        currentUserRole,
        setCurrentUserRole,
        managedContent,
        managedUsers,
        auditLogs,
        systemHealth: {
          ...INITIAL_SYSTEM_HEALTH,
          activeFeatureFlags: featureFlags,
        },
        featureFlags,
        toggleFeatureFlag,
        submitForReview,
        approveContent,
        publishContent,
        archiveContent,
        createDraftContent,
        updateUserStatus,
        updateUserRole,
        generateAiContentDraft,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
