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
} from 'lucide-react';

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
    archiveContent,
    updateUserStatus,
    updateUserRole,
    generateAiContentDraft,
  } = useAdmin();

  const { navigate } = useNavigation();
  const { errorClusters, skillGraph } = useAdaptiveLearning();

  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'adaptive' | 'users' | 'health' | 'audit'>('overview');
  const [contentStatusFilter, setContentStatusFilter] = useState<string>('all');
  const [userSearchQuery, setUserSearchQuery] = useState<string>('');
  const [selectedPreviewContent, setSelectedPreviewContent] = useState<ManagedContentItem | null>(null);

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

  const filteredContent = managedContent.filter((c) =>
    contentStatusFilter === 'all' ? true : c.status === contentStatusFilter
  );

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
          {/* AI Content Assistant Generator Box (Requirements 22 & 23) */}
          <div className="p-5 sm:p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-primary" />
              <h3 className="text-sm font-black text-text">AI Pedagogical Content Assistant</h3>
            </div>
            <p className="text-xs text-text-muted">
              Generate structured educational drafts (Grammar, Vocabulary, Roleplay) into the <strong>Draft</strong> queue for editorial review.
            </p>

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

          {/* Workflow Status Filter Bar */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
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

            <span className="text-xs text-text-muted font-semibold">
              Showing <strong>{filteredContent.length}</strong> items
            </span>
          </div>

          {/* Managed Content List */}
          <div className="space-y-3">
            {filteredContent.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-card border border-border shadow-xs hover:border-primary/40 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
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
                  </div>

                  <span className="text-xs text-text-muted">
                    Updated {item.updatedAt} by <strong>{item.author}</strong>
                  </span>
                </div>

                <h4 className="text-sm font-black text-text">{item.title}</h4>
                <p className="text-xs text-text-muted leading-relaxed">{item.summary}</p>

                {/* Workflow Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-border flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPreviewContent(item)}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <Eye size={13} />
                    <span>Preview as Learner</span>
                  </button>

                  <div className="flex items-center gap-2">
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
                    {item.status !== 'archived' && (
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
            ))}
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

      {/* Preview Modal as Learner (Requirement 55) */}
      {selectedPreviewContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase">Learner Preview Mode</span>
                <h3 className="text-base font-black text-text">{selectedPreviewContent.title}</h3>
              </div>
              <button
                onClick={() => setSelectedPreviewContent(null)}
                className="p-1.5 rounded-xl text-text-muted hover:text-text hover:bg-surface"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-4 rounded-2xl bg-surface border border-border space-y-2 text-xs">
              <span className="font-bold text-text">Content Summary:</span>
              <p className="text-text-muted leading-relaxed">{selectedPreviewContent.summary}</p>
              <div className="pt-2 flex items-center gap-2 text-[10px] text-text-muted">
                <span>Level: <strong>{selectedPreviewContent.level}</strong></span>
                <span>•</span>
                <span>Status: <strong>{selectedPreviewContent.status}</strong></span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedPreviewContent(null)}
              className="w-full py-2.5 rounded-xl bg-primary text-white text-xs font-bold"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
