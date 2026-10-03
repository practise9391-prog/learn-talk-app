import React, { useState } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { useAdmin } from '../../context/AdminContext';
import { useNavigation } from '../../context/NavigationContext';
import { useAdaptiveLearning } from '../../context/AdaptiveLearningContext';
import { ManagedContentItem, ContentStatus, ContentType, UserRole } from '../../types/admin';
import {
  Shield,
  Layers,
  Users,
  Activity,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Search,
  Sliders,
  Check,
  X,
  Eye,
  Plus,
  ArrowRight,
  TrendingUp,
  Cpu,
  Database,
  Cloud,
  Mic,
  Volume2,
  Copy,
  Edit3,
  Download,
  Upload,
  Flag,
  RotateCw,
  GitBranch,
  BookOpen,
  Filter,
  HeartHandshake,
  Trophy,
} from 'lucide-react';
import { useCommunity } from '../../context/CommunityContext';
import { useGamification } from '../../context/GamificationContext';
import { ContentAuthoringModal } from './ContentAuthoringModal';
import { ContentPreviewModal } from './ContentPreviewModal';
import { ContentImportExportModal } from './ContentImportExportModal';
import { ContentIssueTrackerModal } from './ContentIssueTrackerModal';

export const AdminDashboardView: React.FC = () => {
  const {
    currentUserRole,
    setCurrentUserRole,
    managedContent,
    managedUsers,
    auditLogs,
    systemHealth,
    featureFlags,
    toggleFeatureFlag,
    submitForReview,
    approveContent,
    publishContent,
    unpublishContent,
    archiveContent,
    restoreContent,
    duplicateContentItem,
    bulkPublish,
    bulkArchive,
    contentIssues,
    contentVersions,
    rollbackToVersion,
    updateUserStatus,
    updateUserRole,
    generateAiContentDraft,
  } = useAdmin();

  const { navigate } = useNavigation();
  const { errorClusters, skillGraph } = useAdaptiveLearning();
  const { peers, blockedUsers, userReports, events } = useCommunity();
  const { antiGamingRules, updateAntiGamingRule, xpTransactions } = useGamification();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'content' | 'adaptive' | 'community' | 'gamification' | 'users' | 'health' | 'audit'
  >('overview');
  const [contentStatusFilter, setContentStatusFilter] = useState<string>('all');
  const [contentSearchQuery, setContentSearchQuery] = useState<string>('');
  const [userSearchQuery, setUserSearchQuery] = useState<string>('');
  const [selectedContentIds, setSelectedContentIds] = useState<string[]>([]);

  // Modal States
  const [isAuthoringOpen, setIsAuthoringOpen] = useState<boolean>(false);
  const [editingContentItem, setEditingContentItem] = useState<ManagedContentItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [previewContentItem, setPreviewContentItem] = useState<ManagedContentItem | null>(null);
  const [isImportExportOpen, setIsImportExportOpen] = useState<boolean>(false);
  const [isIssueTrackerOpen, setIsIssueTrackerOpen] = useState<boolean>(false);

  // AI Content Generator state
  const [aiGenType, setAiGenType] = useState<ContentType>('grammar_topic');
  const [aiGenTopic, setAiGenTopic] = useState<string>('');
  const [aiGenLevel, setAiGenLevel] = useState<string>('B1');
  const [aiGenSuccessMessage, setAiGenSuccessMessage] = useState<string | null>(null);

  const handleGenerateAiDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiGenTopic.trim()) return;
    const id = generateAiContentDraft(aiGenType, aiGenTopic.trim(), aiGenLevel as any);
    setAiGenSuccessMessage(`AI draft "${aiGenTopic}" successfully created in Draft status for human review.`);
    setAiGenTopic('');
    setTimeout(() => setAiGenSuccessMessage(null), 4000);
  };

  const filteredContent = managedContent.filter((c) => {
    if (contentStatusFilter !== 'all' && c.status !== contentStatusFilter) return false;
    if (contentSearchQuery.trim()) {
      const q = contentSearchQuery.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchType = c.type.toLowerCase().includes(q);
      const matchAuthor = (c.author || '').toLowerCase().includes(q);
      const matchSlug = (c.contentData?.slug || '').toLowerCase().includes(q);
      if (!matchTitle && !matchType && !matchAuthor && !matchSlug) return false;
    }
    return true;
  });

  const handleToggleSelect = (id: string) => {
    setSelectedContentIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedContentIds.length === filteredContent.length) {
      setSelectedContentIds([]);
    } else {
      setSelectedContentIds(filteredContent.map((c) => c.id));
    }
  };

  const handleBulkPublish = () => {
    if (selectedContentIds.length === 0) return;
    bulkPublish(selectedContentIds);
    setSelectedContentIds([]);
  };

  const handleBulkArchive = () => {
    if (selectedContentIds.length === 0) return;
    bulkArchive(selectedContentIds);
    setSelectedContentIds([]);
  };

  const handleOpenAuthoring = (item?: ManagedContentItem | null) => {
    setEditingContentItem(item || null);
    setIsAuthoringOpen(true);
  };

  const handleOpenPreview = (item: ManagedContentItem) => {
    setPreviewContentItem(item);
    setIsPreviewOpen(true);
  };

  const filteredUsers = managedUsers.filter((u) => {
    if (!userSearchQuery.trim()) return true;
    const q = userSearchQuery.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  const getStatusBadge = (status: ContentStatus) => {
    switch (status) {
      case 'published':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'approved':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'review':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'draft':
        return 'bg-surface text-text-muted border-border';
      case 'archived':
      default:
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Admin CMS & System Observability"
          subtitle="Curriculum lifecycle, content publishing workflow, user permissions, and microservice health"
          badge="Admin Console"
          showBack={true}
        />

        {/* Role Switcher for Admin preview */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-surface p-1.5 rounded-2xl border border-border">
          <span className="text-[10px] font-bold text-text-muted uppercase px-2">Role:</span>
          {(['admin', 'reviewer', 'content_editor'] as UserRole[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setCurrentUserRole(r)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold capitalize transition-all ${
                currentUserRole === r
                  ? 'bg-primary text-white shadow-2xs'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              {r.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'overview', label: 'Admin Dashboard', icon: Activity },
          { id: 'content', label: 'Curriculum & CMS', icon: Layers },
          { id: 'adaptive', label: 'Adaptive Intelligence & Quality', icon: Sparkles },
          { id: 'community', label: 'Community & Safety', icon: HeartHandshake },
          { id: 'gamification', label: 'Rewards & Anti-Gaming', icon: Trophy },
          { id: 'users', label: 'User Management', icon: Users },
          { id: 'health', label: 'System Health & Flags', icon: Cpu },
          { id: 'audit', label: 'Audit Logs', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 border ${
                isActive
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-card text-text-muted hover:text-text border-border hover:bg-surface'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. OVERVIEW DASHBOARD */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Aggregate Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-card border border-border shadow-xs text-center">
              <span className="text-[10px] font-bold text-text-muted uppercase block">Total Learners</span>
              <span className="text-2xl font-black text-text mt-1 block">1,840</span>
              <span className="text-[10px] text-emerald-500 font-semibold">+14% this month</span>
            </div>
            <div className="p-4 rounded-2xl bg-card border border-border shadow-xs text-center">
              <span className="text-[10px] font-bold text-text-muted uppercase block">Active Today</span>
              <span className="text-2xl font-black text-text mt-1 block">412</span>
              <span className="text-[10px] text-primary font-semibold">28% voice speaking</span>
            </div>
            <div className="p-4 rounded-2xl bg-card border border-border shadow-xs text-center">
              <span className="text-[10px] font-bold text-text-muted uppercase block">Lessons Completed</span>
              <span className="text-2xl font-black text-text mt-1 block">6,240</span>
              <span className="text-[10px] text-indigo-500 font-semibold">89% completion rate</span>
            </div>
            <div className="p-4 rounded-2xl bg-card border border-border shadow-xs text-center">
              <span className="text-[10px] font-bold text-text-muted uppercase block">System Health</span>
              <span className="text-2xl font-black text-emerald-500 mt-1 block">99.9%</span>
              <span className="text-[10px] text-text-muted font-semibold">Avg Latency 142ms</span>
            </div>
          </div>

          {/* Quick CMS Action Callout */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-primary/10 via-indigo-500/10 to-purple-500/10 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                  Content Governance
                </span>
                <span className="text-xs text-text-muted">•</span>
                <span className="text-xs font-semibold text-text-muted">
                  {managedContent.filter((c) => c.status === 'review').length} Items Awaiting Review
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-text mt-0.5">
                Maintain Educational Quality & Pedagogy
              </h3>
              <p className="text-xs text-text-muted mt-1 leading-relaxed max-w-xl">
                All AI-generated content enters the Draft queue and must be approved by a linguist before publishing to learner curriculum.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('content')}
              className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-2 shadow-xs hover:bg-primary-hover transition-all shrink-0"
            >
              <span>Manage Content CMS</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* 2. CONTENT CMS & WORKFLOW */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          {/* Production Content Suite Header Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-3xl bg-card border border-border shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                  Learning Content Platform
                </span>
                <span className="text-xs text-text-muted">•</span>
                <span className="text-xs font-semibold text-text-muted">
                  Block Authoring, Quality Validation & Publishing
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-text mt-0.5">
                Curriculum & Pedagogical Asset Engine
              </h3>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => handleOpenAuthoring(null)}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1.5 shadow-xs hover:bg-primary-hover transition-all"
              >
                <Plus size={14} />
                <span>New Content</span>
              </button>

              <button
                type="button"
                onClick={() => setIsImportExportOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-surface border border-border text-text hover:border-primary text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Download size={13} />
                <span>Import / Export</span>
              </button>

              <button
                type="button"
                onClick={() => setIsIssueTrackerOpen(true)}
                className="relative px-3.5 py-2 rounded-xl bg-surface border border-border text-text hover:border-rose-500 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Flag size={13} className="text-rose-500" />
                <span>Learner Issues</span>
                {contentIssues.filter((i) => i.status === 'reported' || i.status === 'under_review').length > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black">
                    {contentIssues.filter((i) => i.status === 'reported' || i.status === 'under_review').length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Curriculum Health & Graph Validation Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3.5 rounded-2xl bg-card border border-border text-center shadow-xs">
              <span className="text-[10px] font-bold text-text-muted uppercase block">Total Items</span>
              <span className="text-xl font-black text-text mt-0.5 block">{managedContent.length}</span>
              <span className="text-[10px] text-text-muted">Master assets</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-card border border-border text-center shadow-xs">
              <span className="text-[10px] font-bold text-text-muted uppercase block">Published Live</span>
              <span className="text-xl font-black text-emerald-500 mt-0.5 block">
                {managedContent.filter((c) => c.status === 'published').length}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Active in app</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-card border border-border text-center shadow-xs">
              <span className="text-[10px] font-bold text-text-muted uppercase block">Awaiting Review</span>
              <span className="text-xl font-black text-blue-500 mt-0.5 block">
                {managedContent.filter((c) => c.status === 'review').length}
              </span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">Editorial queue</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-card border border-border text-center shadow-xs">
              <span className="text-[10px] font-bold text-text-muted uppercase block">Drafts</span>
              <span className="text-xl font-black text-amber-500 mt-0.5 block">
                {managedContent.filter((c) => c.status === 'draft').length}
              </span>
              <span className="text-[10px] text-text-muted font-semibold">Work in progress</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-card border border-border text-center shadow-xs col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-text-muted uppercase block">Prerequisite Graph</span>
              <span className="text-xl font-black text-emerald-500 mt-0.5 block flex items-center justify-center gap-1">
                <CheckCircle2 size={16} />
                <span>Acyclic</span>
              </span>
              <span className="text-[10px] text-text-muted font-semibold">0 circular cycles</span>
            </div>
          </div>

          {/* AI Content Assistant Generator Box */}
          <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-primary" />
                <h3 className="text-sm font-black text-text">AI Pedagogical Content Assistant</h3>
              </div>
              <span className="text-[11px] text-text-muted">Direct output into Drafts queue for human review</span>
            </div>

            <form onSubmit={handleGenerateAiDraft} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <select
                value={aiGenType}
                onChange={(e) => setAiGenType(e.target.value as any)}
                className="p-2.5 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none"
              >
                <option value="grammar_topic">Grammar Topic</option>
                <option value="vocabulary_item">Vocabulary Bank</option>
                <option value="roleplay_scenario">Roleplay Scenario</option>
                <option value="curriculum_lesson">Curriculum Lesson</option>
              </select>

              <input
                type="text"
                value={aiGenTopic}
                onChange={(e) => setAiGenTopic(e.target.value)}
                placeholder="Topic name (e.g. Past Continuous in Meetings)..."
                className="sm:col-span-2 px-3 py-2.5 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none focus:border-primary"
              />

              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-primary text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-primary-hover shadow-xs transition-all"
              >
                <Plus size={14} />
                <span>Create Draft</span>
              </button>
            </form>

            {aiGenSuccessMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 size={14} />
                <span>{aiGenSuccessMessage}</span>
              </div>
            )}
          </div>

          {/* Workflow Status & Search Filter Bar */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Search Box */}
              <div className="relative flex-1 max-w-sm">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  value={contentSearchQuery}
                  onChange={(e) => setContentSearchQuery(e.target.value)}
                  placeholder="Search by title, slug, type, or author..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-surface border border-border text-xs text-text placeholder:text-text-muted focus:outline-none focus:border-primary"
                />
              </div>

              {/* Status Chips */}
              <div className="flex items-center gap-1 overflow-x-auto text-xs">
                {(['all', 'draft', 'review', 'approved', 'published', 'archived'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setContentStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl capitalize font-bold transition-all border ${
                      contentStatusFilter === st
                        ? 'bg-primary text-white border-primary shadow-2xs'
                        : 'bg-card text-text-muted hover:text-text border-border'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Bulk Selection Bar */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-surface border border-border text-xs">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-text">
                  <input
                    type="checkbox"
                    checked={filteredContent.length > 0 && selectedContentIds.length === filteredContent.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded text-primary border-border focus:ring-primary/20"
                  />
                  <span>Select All ({filteredContent.length})</span>
                </label>

                {selectedContentIds.length > 0 && (
                  <span className="font-bold text-primary">
                    {selectedContentIds.length} item{selectedContentIds.length > 1 ? 's' : ''} selected
                  </span>
                )}
              </div>

              {selectedContentIds.length > 0 ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleBulkPublish}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-all shadow-2xs"
                  >
                    Bulk Publish
                  </button>
                  <button
                    type="button"
                    onClick={handleBulkArchive}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-bold hover:bg-rose-500/20 transition-all"
                  >
                    Bulk Archive
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedContentIds([])}
                    className="px-2.5 py-1.5 text-text-muted hover:text-text font-semibold"
                  >
                    Deselect
                  </button>
                </div>
              ) : (
                <span className="text-text-muted font-medium">
                  Showing <strong>{filteredContent.length}</strong> items
                </span>
              )}
            </div>
          </div>

          {/* Managed Content Cards */}
          <div className="space-y-3">
            {filteredContent.length === 0 ? (
              <div className="p-12 text-center text-text-muted text-xs bg-card border border-border rounded-3xl space-y-2">
                <BookOpen size={32} className="mx-auto opacity-50" />
                <p className="font-bold text-text">No content matches the selected filter</p>
                <p>Try modifying your search query or selecting a different status filter.</p>
              </div>
            ) : (
              filteredContent.map((item) => {
                const isSelected = selectedContentIds.includes(item.id);
                const hasVersions = contentVersions[item.id] && contentVersions[item.id].length > 1;

                return (
                  <div
                    key={item.id}
                    className={`p-5 rounded-3xl bg-card border transition-all space-y-3 ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/20 shadow-xs'
                        : 'border-border hover:border-primary/40 shadow-xs'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(item.id)}
                          className="w-4 h-4 rounded text-primary border-border focus:ring-primary/20"
                        />
                        <span className="text-xs font-bold text-text uppercase tracking-wider">
                          {item.type.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] font-black px-1.5 py-0.2 rounded-md bg-surface text-text-muted border border-border">
                          {item.level}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-text-muted">
                          v{item.version}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize border ${getStatusBadge(item.status)}`}>
                          {item.status}
                        </span>
                        {item.contentData?.slug && (
                          <span className="text-[10px] font-mono text-text-muted hidden md:inline">
                            /{item.contentData.slug}
                          </span>
                        )}
                      </div>

                      <span className="text-xs text-text-muted">
                        Updated {item.updatedAt} by <strong>{item.author}</strong>
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-text">{item.title}</h4>
                      <p className="text-xs text-text-muted leading-relaxed mt-0.5">{item.summary}</p>
                    </div>

                    {/* Prerequisites & Objectives tags */}
                    {item.contentData?.prerequisites && item.contentData.prerequisites.length > 0 && (
                      <div className="flex items-center gap-1.5 text-[10px] text-text-muted flex-wrap">
                        <span className="font-bold text-text">Prerequisites:</span>
                        {item.contentData.prerequisites.map((prereq: string) => (
                          <span key={prereq} className="px-2 py-0.5 rounded bg-surface border border-border font-mono">
                            {prereq}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Workflow Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-border flex-wrap gap-2 text-xs">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => handleOpenPreview(item)}
                          className="font-bold text-primary hover:underline flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-primary/5"
                        >
                          <Eye size={13} />
                          <span>Preview as Learner</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenAuthoring(item)}
                          className="font-bold text-text hover:text-primary flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface border border-border hover:border-primary transition-all"
                        >
                          <Edit3 size={13} />
                          <span>Edit in Studio</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => duplicateContentItem(item.id)}
                          className="font-bold text-text-muted hover:text-text flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-surface transition-all"
                          title="Duplicate this item into Draft"
                        >
                          <Copy size={12} />
                          <span>Duplicate</span>
                        </button>

                        {/* Version rollback button if versions exist */}
                        {hasVersions && (
                          <button
                            type="button"
                            onClick={() => {
                              const v = item.version > 1 ? item.version - 1 : 1;
                              rollbackToVersion(item.id, v);
                            }}
                            className="font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-purple-500/10 transition-all text-[11px]"
                            title="Roll back to previous version"
                          >
                            <RotateCw size={11} />
                            <span>Rollback (v{item.version - 1})</span>
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {item.status === 'draft' && (
                          <button
                            type="button"
                            onClick={() => submitForReview(item.id)}
                            className="px-3 py-1 rounded-xl bg-surface border border-border hover:border-primary text-xs font-bold text-text transition-all"
                          >
                            Submit for Review
                          </button>
                        )}

                        {item.status === 'review' && (
                          <button
                            type="button"
                            onClick={() => approveContent(item.id)}
                            className="px-3 py-1 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-bold transition-all"
                          >
                            Approve Content
                          </button>
                        )}

                        {item.status === 'approved' && (
                          <button
                            type="button"
                            onClick={() => publishContent(item.id)}
                            className="px-3 py-1 rounded-xl bg-emerald-500 text-white text-xs font-bold shadow-2xs hover:bg-emerald-600 transition-all"
                          >
                            Publish to Live App
                          </button>
                        )}

                        {item.status === 'published' && (
                          <button
                            type="button"
                            onClick={() => unpublishContent(item.id)}
                            className="px-3 py-1 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold transition-all"
                          >
                            Unpublish
                          </button>
                        )}

                        {item.status === 'archived' ? (
                          <button
                            type="button"
                            onClick={() => restoreContent(item.id)}
                            className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold transition-all"
                          >
                            Restore
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => archiveContent(item.id)}
                            className="px-3 py-1 rounded-xl bg-surface border border-border text-xs text-text-muted hover:text-rose-500 transition-all"
                          >
                            Archive
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 2.5 ADAPTIVE LEARNING & CONTENT QUALITY (Part 11: Sections 59, 60, 61, 62) */}
      {activeTab === 'adaptive' && (
        <div className="space-y-6">
          {/* Key Adaptive Observability Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-card border border-border text-center space-y-1 shadow-xs">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                Recommendation Acceptance
              </span>
              <span className="text-2xl font-black text-primary">88.4%</span>
              <span className="text-[11px] text-emerald-500 font-semibold block">Learners follow "What Next"</span>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border text-center space-y-1 shadow-xs">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                Spaced Revision Success
              </span>
              <span className="text-2xl font-black text-emerald-500">84.2%</span>
              <span className="text-[11px] text-text-muted font-semibold block">SM-2 memory retention</span>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border text-center space-y-1 shadow-xs">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                Auto-Difficulty Easing
              </span>
              <span className="text-2xl font-black text-amber-500">14.1%</span>
              <span className="text-[11px] text-text-muted font-semibold block">Confidence scaffolding active</span>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border text-center space-y-1 shadow-xs">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                Hesitation Bridge Triggered
              </span>
              <span className="text-2xl font-black text-indigo-500">92.0%</span>
              <span className="text-[11px] text-emerald-500 font-semibold block">Brain-freeze recovered</span>
            </div>
          </div>

          {/* Most Common Error Clusters (Section 60) */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-text">Aggregate Error Pattern Clusters</h3>
                <p className="text-xs text-text-muted">
                  Auto-grouped linguistic weaknesses across speaking calls, roleplays, and quizzes
                </p>
              </div>
              <span className="text-xs font-bold text-primary px-2.5 py-1 rounded-full bg-primary/10">
                {errorClusters.length} Active Clusters
              </span>
            </div>

            <div className="space-y-3">
              {errorClusters.map((cluster) => (
                <div
                  key={cluster.patternId}
                  className="p-4 rounded-2xl bg-surface border border-border space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-text">{cluster.title}</span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        {cluster.category}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-text-muted">
                      {cluster.occurrences} recorded incidents
                    </span>
                  </div>

                  <p className="text-xs text-text-muted">
                    <strong>Root Cause Rule: </strong>{cluster.rootCauseRule}
                  </p>

                  <div className="p-2.5 rounded-xl bg-card border border-border text-xs flex items-center justify-between">
                    <span className="text-text-muted italic truncate">
                      "{cluster.sampleMistakes[0]}"
                    </span>
                    <span className="text-primary font-bold text-[11px] shrink-0 ml-2">
                      Target: {cluster.targetedExerciseTopic}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Difficult Lessons & High Hesitation Points (Section 60) */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-black text-text">Difficult Lessons & Abandonment Points</h3>
              <p className="text-xs text-text-muted">
                Curriculum segments with higher-than-average retry and hesitation signals
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                { title: 'Unit 3 Lesson 2: Past Perfect Narratives', hesitationRate: '28%', retryRate: '34%', status: 'Flagged for Simplified Audio Scaffolding' },
                { title: 'Unit 4 Lesson 1: Polite Workplace Disagreements', hesitationRate: '22%', retryRate: '19%', status: 'Sufficient Scaffolding' },
                { title: 'Unit 5 Lesson 3: Mixed Conditionals', hesitationRate: '31%', retryRate: '40%', status: 'Recommended: Add 2 Pre-drills' },
                { title: 'Unit 6 Lesson 2: Salary Negotiation Roleplay', hesitationRate: '25%', retryRate: '21%', status: 'Good Naturalness' },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-surface border border-border space-y-2">
                  <h4 className="font-bold text-text">{item.title}</h4>
                  <div className="flex items-center gap-3 text-text-muted">
                    <span>Hesitation: <strong className="text-amber-500">{item.hesitationRate}</strong></span>
                    <span>•</span>
                    <span>Retries: <strong className="text-rose-500">{item.retryRate}</strong></span>
                  </div>
                  <span className="text-[11px] font-semibold text-primary block">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Content Quality Feedback Loop (Section 61 & 62) */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-text">Content Quality Feedback Loop</h3>
                <p className="text-xs text-text-muted">
                  Questions flagged by algorithms due to abnormal failure rates (over 35% failure indicates question ambiguity)
                </p>
              </div>
              <span className="text-xs font-bold text-rose-500 bg-rose-500/10 px-2.5 py-1 rounded-full">
                2 Items Under Review
              </span>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'Q-402',
                  lesson: 'Grammar: Prepositions of Place',
                  issue: 'Ambiguous Distractor: Options "at the corner" and "on the corner" both colloquial.',
                  failRate: '42%',
                  action: 'Add regional context note or change distractor to "in the corner".',
                },
                {
                  id: 'Q-519',
                  lesson: 'Vocabulary: Action Verbs in Resumes',
                  issue: 'Unclear Audio Guide: Synthesis pronunciation of "orchestrated" had muted syllable.',
                  failRate: '38%',
                  action: 'Native studio audio replacement scheduled.',
                },
              ].map((flag) => (
                <div key={flag.id} className="p-4 rounded-2xl bg-surface border border-border space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-text">{flag.lesson} ({flag.id})</span>
                    <span className="text-rose-600 dark:text-rose-400 font-bold">Failure Rate: {flag.failRate}</span>
                  </div>
                  <p className="text-text-muted"><strong>Identified Problem: </strong>{flag.issue}</p>
                  <div className="p-2.5 rounded-xl bg-card border border-border flex items-center justify-between">
                    <span className="text-[11px] text-primary font-semibold">Action: {flag.action}</span>
                    <button
                      type="button"
                      onClick={() => alert(`Reviewing content ${flag.id}`)}
                      className="px-3 py-1 rounded-lg bg-primary text-white text-[10px] font-bold hover:bg-primary-hover"
                    >
                      Resolve & Update Content
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2.8 COMMUNITY PRACTICE & SAFETY GOVERNANCE (Part 14) */}
      {activeTab === 'community' && (
        <div className="space-y-6">
          {/* Key Community Observability Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-card border border-border text-center space-y-1 shadow-xs">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                Community Peers
              </span>
              <span className="text-2xl font-black text-primary">{peers.length}</span>
              <span className="text-[11px] text-emerald-500 font-semibold block">Discovery Enabled</span>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border text-center space-y-1 shadow-xs">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                Active Speaking Rooms
              </span>
              <span className="text-2xl font-black text-indigo-500">3</span>
              <span className="text-[11px] text-text-muted font-semibold block">1-on-1 & Round Tables</span>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border text-center space-y-1 shadow-xs">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                Safety Reports
              </span>
              <span className="text-2xl font-black text-rose-500">{userReports.length}</span>
              <span className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold block">Moderation Queue</span>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border text-center space-y-1 shadow-xs">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                Scheduled Events
              </span>
              <span className="text-2xl font-black text-emerald-500">{events.length}</span>
              <span className="text-[11px] text-text-muted font-semibold block">Speaking Clubs</span>
            </div>
          </div>

          {/* Moderation Queue */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-text">Community Moderation & Safety Reports</h3>
                <p className="text-xs text-text-muted">
                  Confidential reports submitted by learners during peer speaking practice
                </p>
              </div>
              <span className="text-xs font-bold text-rose-500 bg-rose-500/10 px-2.5 py-1 rounded-full">
                {userReports.length} Action Items
              </span>
            </div>

            {userReports.length === 0 ? (
              <p className="text-xs text-text-muted italic py-3">No active safety reports. Community conversations are respectful.</p>
            ) : (
              <div className="space-y-3">
                {userReports.map((rep) => (
                  <div key={rep.id} className="p-4 rounded-2xl bg-surface border border-border space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-text">
                        Report against: <strong>{rep.reportedUserName}</strong>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 uppercase">
                        {rep.category.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-text-muted leading-relaxed">"{rep.description}"</p>
                    <div className="flex items-center justify-between pt-1 border-t border-border/60">
                      <span className="text-[10px] text-text-muted">Status: {rep.status.replace('_', ' ')}</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => alert(`Warning dispatched to ${rep.reportedUserName}`)}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 font-bold hover:bg-amber-500/20 text-[11px]"
                        >
                          Issue Warning
                        </button>
                        <button
                          type="button"
                          onClick={() => alert(`Account restricted for ${rep.reportedUserName}`)}
                          className="px-2.5 py-1 rounded-lg bg-rose-500 text-white font-bold hover:bg-rose-600 text-[11px]"
                        >
                          Restrict Account
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Safety & Moderation Rules Strip */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
            <h3 className="text-base font-black text-text">Platform Community Safeguards</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1">
                <span className="font-bold text-text flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span>Audio-First Policy Enforced</span>
                </span>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  No video broadcast required. Learners practice speaking without camera pressure or appearance anxiety.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1">
                <span className="font-bold text-text flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span>Topic-Locked Context Guarantees</span>
                </span>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  Rooms remain locked to chosen pedagogical topics (job interviews, office standups, travel check-ins).
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1">
                <span className="font-bold text-text flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span>Non-Intrusive Peer Learning</span>
                </span>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  Peer practice is 100% optional. Learners selecting "AI Only" never receive requests or appear in discovery.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1">
                <span className="font-bold text-text flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span>Strict Anti-Spam & Rate Limits</span>
                </span>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  Rate limits of maximum 5 partner requests per hour prevent request flooding and unwanted contacts.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-text">Learner & Staff Accounts</h3>
              <p className="text-xs text-text-muted">Manage roles, review activity, and moderate status</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredUsers.map((u) => (
              <div
                key={u.id}
                className="p-4 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-text">{u.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-card border border-border uppercase">
                      {u.role.replace('_', ' ')}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                        u.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {u.status}
                    </span>
                  </div>
                  <span className="text-text-muted block">{u.email} • Level: {u.currentLevel}</span>
                  <span className="text-[10px] text-text-muted">
                    {u.lessonsCompleted} lessons • {u.speakingMinutes} spoken mins • Active {u.lastActive}
                  </span>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() =>
                      updateUserStatus(u.id, u.status === 'active' ? 'suspended' : 'active')
                    }
                    className="px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-semibold hover:bg-surface transition-all"
                  >
                    {u.status === 'active' ? 'Suspend' : 'Reactivate'}
                  </button>
                  <select
                    value={u.role}
                    onChange={(e) => updateUserRole(u.id, e.target.value as UserRole)}
                    className="px-2 py-1 rounded-xl bg-card border border-border text-xs text-text font-semibold focus:outline-none"
                  >
                    <option value="learner">Learner</option>
                    <option value="content_editor">Content Editor</option>
                    <option value="reviewer">Reviewer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SYSTEM HEALTH & FEATURE FLAGS */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          {/* Microservices Health Metrics */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu size={18} className="text-emerald-500" />
                <h3 className="text-base font-black text-text">Microservices & Infrastructure Health</h3>
              </div>
              <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                <CheckCircle2 size={13} />
                <span>All Systems Operational</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {systemHealth.services.map((svc) => (
                <div
                  key={svc.service}
                  className="p-4 rounded-2xl bg-surface border border-border space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-text truncate max-w-[180px]">{svc.service}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 capitalize">
                      {svc.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-text-muted text-[11px]">
                    <span>Latency: <strong>{svc.latencyMs}ms</strong></span>
                    <span>Uptime: <strong>{svc.uptimePercent}%</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Centralized Feature Flags (Requirement 50) */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Sliders size={18} className="text-primary" />
              <h3 className="text-base font-black text-text">Production Feature Flags</h3>
            </div>
            <p className="text-xs text-text-muted">
              Dynamically roll out features or toggle experimental capabilities without redeployment.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {Object.entries(featureFlags).map(([key, isEnabled]) => (
                <div
                  key={key}
                  className="p-3.5 rounded-2xl bg-surface border border-border flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-text block">{key}</span>
                    <span className="text-[10px] text-text-muted">
                      {isEnabled ? 'Active in production' : 'Disabled'}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={() => toggleFeatureFlag(key)}
                    className="w-4 h-4 rounded accent-primary cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4.5 REWARDS & ANTI-GAMING GOVERNANCE */}
      {activeTab === 'gamification' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Trophy size={18} className="text-amber-500" />
                <h3 className="text-base font-black text-text">Pedagogical Reward Rules & Anti-Gaming Limits</h3>
              </div>
              <span className="text-xs text-text-muted font-semibold">
                Guarantees rewards reflect real English study, not mindless clicking
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(antiGamingRules).map(([sourceKey, rule]) => (
                <div
                  key={sourceKey}
                  className="p-4 rounded-2xl bg-surface border border-border space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-text uppercase text-xs tracking-wider">
                      {sourceKey.replace('_', ' ')} Practice
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-card border border-border text-[10px] font-mono font-bold text-text-muted">
                      Cap: {rule.maxDailyXP} XP/day
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div>
                      <label className="text-[10px] font-semibold text-text-muted block mb-1">
                        Min Duration (sec)
                      </label>
                      <input
                        type="number"
                        value={rule.minDurationSeconds}
                        onChange={(e) =>
                          updateAntiGamingRule(sourceKey, {
                            minDurationSeconds: Math.max(0, parseInt(e.target.value) || 0),
                          })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-card border border-border text-text font-mono text-xs focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-text-muted block mb-1">
                        Cooldown (sec)
                      </label>
                      <input
                        type="number"
                        value={rule.cooldownSeconds}
                        onChange={(e) =>
                          updateAntiGamingRule(sourceKey, {
                            cooldownSeconds: Math.max(0, parseInt(e.target.value) || 0),
                          })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-card border border-border text-text font-mono text-xs focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-text-muted block mb-1">
                        Daily XP Ceiling
                      </label>
                      <input
                        type="number"
                        value={rule.maxDailyXP}
                        onChange={(e) =>
                          updateAntiGamingRule(sourceKey, {
                            maxDailyXP: Math.max(50, parseInt(e.target.value) || 50),
                          })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-card border border-border text-text font-mono text-xs focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-text-muted block mb-1">
                        Repeat Limit/Day
                      </label>
                      <input
                        type="number"
                        value={rule.repeatContentMaxPerDay}
                        onChange={(e) =>
                          updateAntiGamingRule(sourceKey, {
                            repeatContentMaxPerDay: Math.max(1, parseInt(e.target.value) || 1),
                          })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-card border border-border text-text font-mono text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* XP Transactions Audit Trail */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-primary" />
                <h3 className="text-base font-black text-text">Live Practice XP Ledger Audit</h3>
              </div>
              <span className="text-xs text-text-muted font-semibold">
                {xpTransactions.length} Verified Educational Transactions
              </span>
            </div>

            <div className="space-y-2">
              {xpTransactions.slice(0, 8).map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 rounded-xl bg-surface border border-border flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-text capitalize">
                        {tx.eventType.replace(/_/g, ' ')}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-card border border-border text-[9px] uppercase font-bold text-text-muted">
                        {tx.sourceType}
                      </span>
                      <span className="text-emerald-500 font-semibold text-[10px] flex items-center gap-0.5">
                        <CheckCircle2 size={11} /> Verified Anti-Gaming
                      </span>
                    </div>
                    <span className="text-[10px] text-text-muted block">
                      {new Date(tx.createdAt).toLocaleString()} • Duration: {tx.metadata?.durationSeconds || 60}s
                    </span>
                  </div>

                  <span className="font-mono font-bold text-indigo-500 text-sm shrink-0">
                    +{tx.xpAmount} XP
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-primary" />
              <h3 className="text-base font-black text-text">Administrative Audit Trail</h3>
            </div>
            <span className="text-xs text-text-muted font-semibold">
              Immutable logging for security & compliance
            </span>
          </div>

          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-surface border border-border text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-text">{log.actor}</span>
                    <span className="text-primary font-semibold">• {log.action}</span>
                  </div>
                  <span className="font-mono text-[10px] text-text-muted">{log.timestamp}</span>
                </div>
                <p className="text-text-muted">Target: <strong>{log.target}</strong></p>
                <p className="text-[11px] text-text-muted italic">{log.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 1. Production Content Authoring Studio Modal */}
      <ContentAuthoringModal
        isOpen={isAuthoringOpen}
        onClose={() => {
          setIsAuthoringOpen(false);
          setEditingContentItem(null);
        }}
        editItem={editingContentItem}
      />

      {/* 2. Isolated Learner Preview Modal */}
      <ContentPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setPreviewContentItem(null);
        }}
        contentItem={previewContentItem}
      />

      {/* 3. Sanitized Import / Export Modal */}
      <ContentImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
      />

      {/* 4. Learner Issue & Pedagogical Feedback Inbox */}
      <ContentIssueTrackerModal
        isOpen={isIssueTrackerOpen}
        onClose={() => setIsIssueTrackerOpen(false)}
        onOpenContentEditor={(contentId) => {
          const it = managedContent.find((c) => c.id === contentId);
          if (it) {
            handleOpenAuthoring(it);
          }
        }}
      />
    </div>
  );
};
