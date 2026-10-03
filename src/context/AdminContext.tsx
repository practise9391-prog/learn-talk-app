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
import {
  ContentRelationship,
  ContentVersion,
  ContentIssueReport,
  MediaResource,
} from '../types/contentManagement';
import { contentManagementService } from '../services/contentManagementService';

interface AdminContextType {
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
  managedContent: ManagedContentItem[];
  managedUsers: ManagedUserAccount[];
  auditLogs: AdminAuditLog[];
  systemHealth: SystemHealthData;
  featureFlags: { [key: string]: boolean };
  contentIssues: ContentIssueReport[];
  relationships: ContentRelationship[];
  mediaResources: MediaResource[];
  previewContentModalItem: ManagedContentItem | null;
  setPreviewContentModalItem: (item: ManagedContentItem | null) => void;

  // Publishing Actions
  submitForReview: (contentId: string) => void;
  approveContent: (contentId: string) => void;
  publishContent: (contentId: string) => void;
  unpublishContent: (contentId: string) => void;
  archiveContent: (contentId: string) => void;
  restoreContent: (contentId: string) => void;

  // CRUD Actions
  createDraftContent: (item: Omit<ManagedContentItem, 'id' | 'version' | 'status' | 'updatedAt'>) => string;
  updateContentItem: (contentId: string, updates: Partial<ManagedContentItem>, changeSummary?: string) => void;
  deleteContentItem: (contentId: string) => void;
  duplicateContentItem: (contentId: string) => string;

  // Bulk Actions
  bulkPublish: (contentIds: string[]) => void;
  bulkArchive: (contentIds: string[]) => void;

  // Issue Tracking
  reportContentIssue: (report: Omit<ContentIssueReport, 'id' | 'createdAt' | 'status'>) => string;
  updateIssueStatus: (issueId: string, status: ContentIssueReport['status'], adminNotes?: string) => void;

  // Relationships
  addRelationship: (rel: Omit<ContentRelationship, 'id'>) => void;
  removeRelationship: (relId: string) => void;

  // Version Rollback
  contentVersions: Record<string, ContentVersion[]>;
  rollbackToVersion: (contentId: string, versionNumber: number) => void;

  // Import / Export
  importContentJson: (jsonString: string) => { success: boolean; importedCount: number; errors: string[] };
  exportContentJson: () => string;

  // System & Users
  toggleFeatureFlag: (flagName: string) => void;
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
    contentData: {
      slug: 'present-perfect-continuous-workplace',
      category: 'tenses',
      prerequisites: ['past-simple-basics'],
    },
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
    contentData: {
      slug: 'salary-negotiation-offer',
      userRole: 'Job Candidate',
      aiRole: 'Hiring Manager',
    },
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
    contentData: {
      slug: 'professional-technical-collocations',
      word: 'streamline',
    },
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
    contentData: {
      slug: 'unit-2-talking-about-daily-routines',
      estimatedMinutes: 15,
      learningObjectives: ['Describe morning routine using Simple Present', 'Use prepositions at, in, on accurately'],
    },
  },
  {
    id: 'cnt-005',
    title: 'Client Demo & Architecture Presentation',
    type: 'speaking_test',
    level: 'B2',
    version: 1,
    status: 'published',
    author: 'Sarah (Head of Pedagogy)',
    reviewer: 'Elena',
    updatedAt: '5 days ago',
    summary: '15-minute diagnostic test evaluating clarity, slide transition phrasing, and technical explanations.',
    contentData: {
      slug: 'client-demo-presentation-test',
    },
  },
];

const INITIAL_USERS: ManagedUserAccount[] = [
  {
    id: 'usr-1',
    name: 'Pavan (Current Learner)',
    email: 'pavan@example.com',
    role: 'super_admin',
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
    role: 'reviewer',
    currentLevel: 'A2',
    status: 'active',
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

const INITIAL_CONTENT_ISSUES: ContentIssueReport[] = [
  {
    id: 'iss-1',
    contentId: 'cnt-004',
    contentTitle: 'Unit 2: Talking About Daily Routines',
    contentType: 'curriculum_lesson',
    reportedBy: 'Ananya Sharma',
    category: 'confusing_explanation',
    details: 'Step 3 explanation for "at night" vs "in the night" felt ambiguous for Telugu native speaker.',
    status: 'under_review',
    createdAt: '1 day ago',
    adminNotes: 'Reviewing localized note to contrast "at night" (general habit) with "in the night" (specific occasion).',
  },
  {
    id: 'iss-2',
    contentId: 'cnt-001',
    contentTitle: 'Present Perfect Continuous',
    contentType: 'grammar_topic',
    reportedBy: 'Rohan Verma',
    category: 'suggestion',
    details: 'Add an audio example showing how native speakers pronounce "have been" as /hævbɪn/ or /əvbɪn/.',
    status: 'reported',
    createdAt: '3 days ago',
  },
];

const INITIAL_RELATIONSHIPS: ContentRelationship[] = [
  {
    id: 'rel-1',
    sourceId: 'cnt-004',
    sourceType: 'curriculum_lesson',
    targetId: 'gt-simple-present',
    targetType: 'grammar_topic',
    relationshipType: 'requires_grammar',
    targetTitle: 'Simple Present Tense Basics',
  },
  {
    id: 'rel-2',
    sourceId: 'cnt-004',
    sourceType: 'curriculum_lesson',
    targetId: 'vw-routine-words',
    targetType: 'vocabulary_item',
    relationshipType: 'teaches_vocabulary',
    targetTitle: 'Everyday Routine Vocabulary Set',
  },
  {
    id: 'rel-3',
    sourceId: 'cnt-002',
    sourceType: 'roleplay_scenario',
    targetId: 'cnt-005',
    targetType: 'speaking_test',
    relationshipType: 'tested_in',
    targetTitle: 'Client Demo & Architecture Presentation',
  },
];

const INITIAL_MEDIA_RESOURCES: MediaResource[] = [
  {
    id: 'med-1',
    title: 'Native Speaker Daily Routine Dialogue',
    fileName: 'daily_routine_dialogue_us.mp3',
    fileType: 'audio',
    url: '/audio/daily_routine_dialogue_us.mp3',
    sizeBytes: 1240000,
    uploadedAt: '1 week ago',
    referencedByCount: 3,
    status: 'active',
  },
  {
    id: 'med-2',
    title: 'Airport Terminal High-Res Illustration',
    fileName: 'airport_scene_4k.webp',
    fileType: 'image',
    url: '/images/airport_scene_4k.webp',
    sizeBytes: 420000,
    uploadedAt: '3 days ago',
    referencedByCount: 2,
    status: 'active',
  },
];

const INITIAL_SYSTEM_HEALTH: SystemHealthData = {
  services: [
    { service: 'Core API Gateway', status: 'healthy', latencyMs: 24, uptimePercent: 99.98, lastChecked: 'Just now' },
    { service: 'Database (PostgreSQL / Storage)', status: 'healthy', latencyMs: 18, uptimePercent: 100, lastChecked: 'Just now' },
    { service: 'LLM Reasoning Service', status: 'healthy', latencyMs: 210, uptimePercent: 99.92, lastChecked: 'Just now' },
    { service: 'ASR Speech Recognition Engine', status: 'healthy', latencyMs: 180, uptimePercent: 99.88, lastChecked: 'Just now' },
    { service: 'TTS Neural Voice Audio Synthesizer', status: 'healthy', latencyMs: 140, uptimePercent: 99.95, lastChecked: 'Just now' },
    { service: 'Secure Object Storage (Audio & Media)', status: 'healthy', latencyMs: 45, uptimePercent: 100, lastChecked: 'Just now' },
  ],
  activeFeatureFlags: {
    voiceShadowing: true,
    aiPhoneCalls: true,
    jamArena: true,
    experimentalSpeedDrill: true,
    nativeThoughtBridging: true,
    offlinePwaCache: true,
    blockBasedLessonAuthoring: true,
  },
  errorRatePercent: 0.08,
  totalApiCalls24h: 18450,
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('super_admin');

  const [managedContent, setManagedContent] = useState<ManagedContentItem[]>(() => {
    const saved = localStorage.getItem('learntalk_managed_content_v3');
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

  const [contentIssues, setContentIssues] = useState<ContentIssueReport[]>(() => {
    const saved = localStorage.getItem('learntalk_content_issues');
    return saved ? JSON.parse(saved) : INITIAL_CONTENT_ISSUES;
  });

  const [relationships, setRelationships] = useState<ContentRelationship[]>(() => {
    const saved = localStorage.getItem('learntalk_content_relationships');
    return saved ? JSON.parse(saved) : INITIAL_RELATIONSHIPS;
  });

  const [mediaResources, setMediaResources] = useState<MediaResource[]>(() => {
    const saved = localStorage.getItem('learntalk_media_resources');
    return saved ? JSON.parse(saved) : INITIAL_MEDIA_RESOURCES;
  });

  const [contentVersions, setContentVersions] = useState<Record<string, ContentVersion[]>>({});
  const [previewContentModalItem, setPreviewContentModalItem] = useState<ManagedContentItem | null>(null);

  const [featureFlags, setFeatureFlags] = useState<{ [key: string]: boolean }>(
    INITIAL_SYSTEM_HEALTH.activeFeatureFlags
  );

  useEffect(() => {
    localStorage.setItem('learntalk_managed_content_v3', JSON.stringify(managedContent));
  }, [managedContent]);

  useEffect(() => {
    localStorage.setItem('learntalk_content_issues', JSON.stringify(contentIssues));
  }, [contentIssues]);

  useEffect(() => {
    localStorage.setItem('learntalk_content_relationships', JSON.stringify(relationships));
  }, [relationships]);

  useEffect(() => {
    localStorage.setItem('learntalk_media_resources', JSON.stringify(mediaResources));
  }, [mediaResources]);

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

  // Publishing Workflow
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
    logAudit('Approved Content', contentId, 'Content approved and cleared for release');
  };

  const publishContent = (contentId: string) => {
    setManagedContent((prev) =>
      prev.map((c) => {
        if (c.id === contentId) {
          const nextVersion = c.version + 1;
          // Record version snapshot
          const newVersionSnapshot: ContentVersion = {
            versionNumber: nextVersion,
            updatedAt: new Date().toISOString(),
            author: c.author,
            changeSummary: `Published version ${nextVersion}`,
            snapshotData: c.contentData,
          };
          setContentVersions((v) => ({
            ...v,
            [contentId]: [...(v[contentId] || []), newVersionSnapshot],
          }));

          return { ...c, status: 'published', version: nextVersion, updatedAt: 'Just now' };
        }
        return c;
      })
    );
    logAudit('Published Live Content', contentId, 'Content deployed to production curriculum');
  };

  const unpublishContent = (contentId: string) => {
    setManagedContent((prev) =>
      prev.map((c) => (c.id === contentId ? { ...c, status: 'draft', updatedAt: 'Just now' } : c))
    );
    logAudit('Unpublished Content', contentId, 'Content withdrawn back to Draft status');
  };

  const archiveContent = (contentId: string) => {
    setManagedContent((prev) =>
      prev.map((c) => (c.id === contentId ? { ...c, status: 'archived', updatedAt: 'Just now' } : c))
    );
    logAudit('Archived Content', contentId, 'Content retired from active catalog');
  };

  const restoreContent = (contentId: string) => {
    setManagedContent((prev) =>
      prev.map((c) => (c.id === contentId ? { ...c, status: 'draft', updatedAt: 'Just now' } : c))
    );
    logAudit('Restored Archived Content', contentId, 'Moved from Archived back to Draft');
  };

  // CRUD
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

  const updateContentItem = (
    contentId: string,
    updates: Partial<ManagedContentItem>,
    changeSummary: string = 'Updated content attributes'
  ) => {
    setManagedContent((prev) =>
      prev.map((c) => {
        if (c.id === contentId) {
          return {
            ...c,
            ...updates,
            updatedAt: 'Just now',
          };
        }
        return c;
      })
    );
    logAudit('Updated Content', contentId, changeSummary);
  };

  const deleteContentItem = (contentId: string) => {
    setManagedContent((prev) => prev.filter((c) => c.id !== contentId));
    logAudit('Deleted Content', contentId, 'Permanently removed content from repository');
  };

  const duplicateContentItem = (contentId: string): string => {
    const existing = managedContent.find((c) => c.id === contentId);
    if (!existing) return '';

    const newId = `cnt-${Date.now()}`;
    const duplicated: ManagedContentItem = {
      ...existing,
      id: newId,
      title: `${existing.title} (Copy)`,
      version: 1,
      status: 'draft',
      updatedAt: 'Just now',
      contentData: {
        ...existing.contentData,
        slug: `${existing.contentData?.slug || 'content'}-copy-${Date.now().toString().slice(-4)}`,
      },
    };

    setManagedContent((prev) => [duplicated, ...prev]);
    logAudit('Duplicated Content', contentId, `Created copy ${newId}`);
    return newId;
  };

  // Bulk Actions
  const bulkPublish = (contentIds: string[]) => {
    setManagedContent((prev) =>
      prev.map((c) =>
        contentIds.includes(c.id) ? { ...c, status: 'published', version: c.version + 1, updatedAt: 'Just now' } : c
      )
    );
    logAudit('Bulk Published Content', `${contentIds.length} items`, `Published: ${contentIds.join(', ')}`);
  };

  const bulkArchive = (contentIds: string[]) => {
    setManagedContent((prev) =>
      prev.map((c) => (contentIds.includes(c.id) ? { ...c, status: 'archived', updatedAt: 'Just now' } : c))
    );
    logAudit('Bulk Archived Content', `${contentIds.length} items`, `Archived: ${contentIds.join(', ')}`);
  };

  // Content Issues Workflow
  const reportContentIssue = (report: Omit<ContentIssueReport, 'id' | 'createdAt' | 'status'>): string => {
    const id = `iss-${Date.now()}`;
    const newIssue: ContentIssueReport = {
      ...report,
      id,
      status: 'reported',
      createdAt: 'Just now',
    };
    setContentIssues((prev) => [newIssue, ...prev]);
    logAudit('Learner Reported Content Issue', report.contentTitle, `${report.category}: ${report.details.slice(0, 50)}...`);
    return id;
  };

  const updateIssueStatus = (issueId: string, status: ContentIssueReport['status'], adminNotes?: string) => {
    setContentIssues((prev) =>
      prev.map((iss) =>
        iss.id === issueId
          ? {
              ...iss,
              status,
              adminNotes: adminNotes || iss.adminNotes,
              resolvedAt: status === 'resolved' ? new Date().toISOString() : iss.resolvedAt,
            }
          : iss
      )
    );
    logAudit('Updated Issue Status', issueId, `Marked status as ${status}`);
  };

  // Relationships
  const addRelationship = (rel: Omit<ContentRelationship, 'id'>) => {
    const newRel: ContentRelationship = {
      ...rel,
      id: `rel-${Date.now()}`,
    };
    setRelationships((prev) => [newRel, ...prev]);
    logAudit('Added Content Relationship', rel.sourceId, `${rel.relationshipType} -> ${rel.targetTitle}`);
  };

  const removeRelationship = (relId: string) => {
    setRelationships((prev) => prev.filter((r) => r.id !== relId));
    logAudit('Removed Content Relationship', relId, 'Unlinked dependency');
  };

  // Version Rollback
  const rollbackToVersion = (contentId: string, versionNumber: number) => {
    const versions = contentVersions[contentId] || [];
    const target = versions.find((v) => v.versionNumber === versionNumber);
    if (!target) return;

    setManagedContent((prev) =>
      prev.map((c) =>
        c.id === contentId
          ? {
              ...c,
              version: c.version + 1,
              contentData: target.snapshotData,
              updatedAt: 'Just now',
            }
          : c
      )
    );
    logAudit('Rolled Back Content Version', contentId, `Restored content state from version v${versionNumber}`);
  };

  // Import / Export
  const importContentJson = (jsonString: string) => {
    const validation = contentManagementService.validateImportJson(jsonString);
    if (!validation.isValid) {
      return { success: false, importedCount: 0, errors: validation.errors };
    }

    const itemsToImport: ManagedContentItem[] = validation.validItems.map((v) => ({
      id: v.id || `cnt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: v.title,
      type: v.type,
      level: v.level || 'B1',
      version: v.version || 1,
      status: 'draft', // Imported items always land in draft safely!
      author: 'Import Pipeline',
      updatedAt: 'Just now',
      summary: v.summary || 'Imported curriculum module',
      contentData: v.contentData || {},
    }));

    setManagedContent((prev) => [...itemsToImport, ...prev]);
    logAudit('Imported Content Batch', `${itemsToImport.length} items`, 'Structured JSON insertion into Drafts');
    return { success: true, importedCount: itemsToImport.length, errors: [] };
  };

  const exportContentJson = (): string => {
    return contentManagementService.exportSanitizedContentJson(managedContent);
  };

  // Users
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
      contentData: {
        slug: topic.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        generatedBy: 'LLM Educational Assistant',
        validated: true,
        sections: [
          {
            name: 'introduction',
            blocks: [{ id: 'b1', type: 'heading', content: `Welcome to ${topic}` }],
          },
          {
            name: 'explanation',
            blocks: [{ id: 'b2', type: 'text', content: `Key core concepts and practical usage of ${topic}.` }],
          },
        ],
      },
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
        contentIssues,
        relationships,
        mediaResources,
        previewContentModalItem,
        setPreviewContentModalItem,
        submitForReview,
        approveContent,
        publishContent,
        unpublishContent,
        archiveContent,
        restoreContent,
        createDraftContent,
        updateContentItem,
        deleteContentItem,
        duplicateContentItem,
        bulkPublish,
        bulkArchive,
        reportContentIssue,
        updateIssueStatus,
        addRelationship,
        removeRelationship,
        contentVersions,
        rollbackToVersion,
        importContentJson,
        exportContentJson,
        toggleFeatureFlag,
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
