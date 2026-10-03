import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { ContentIssueReport, IssueCategory, IssueStatus } from '../../types/contentManagement';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Filter,
  HelpCircle,
  MessageSquare,
  Search,
  Volume2,
  Wrench,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Send,
} from 'lucide-react';

interface ContentIssueTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenContentEditor?: (contentId: string) => void;
}

export const ContentIssueTrackerModal: React.FC<ContentIssueTrackerModalProps> = ({
  isOpen,
  onClose,
  onOpenContentEditor,
}) => {
  const { contentIssues, updateIssueStatus, managedContent } = useAdmin();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<string>('');

  if (!isOpen) return null;

  const filteredIssues = contentIssues.filter((issue) => {
    if (statusFilter !== 'all' && issue.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && issue.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = issue.contentTitle.toLowerCase().includes(q);
      const matchDetails = issue.details.toLowerCase().includes(q);
      const matchReporter = (issue.reportedBy || '').toLowerCase().includes(q);
      if (!matchTitle && !matchDetails && !matchReporter) return false;
    }
    return true;
  });

  const selectedIssue = contentIssues.find((i) => i.id === selectedIssueId) || filteredIssues[0] || null;

  const handleSelectIssue = (issue: ContentIssueReport) => {
    setSelectedIssueId(issue.id);
    setEditingNotes(issue.adminNotes || '');
  };

  const handleStatusChange = (newStatus: IssueStatus) => {
    if (!selectedIssue) return;
    updateIssueStatus(selectedIssue.id, newStatus, editingNotes.trim() || undefined);
  };

  const handleSaveNotes = () => {
    if (!selectedIssue) return;
    updateIssueStatus(selectedIssue.id, selectedIssue.status, editingNotes.trim() || undefined);
  };

  const getCategoryIcon = (category: IssueCategory) => {
    switch (category) {
      case 'audio_problem':
        return <Volume2 size={14} className="text-amber-500" />;
      case 'incorrect_answer':
        return <AlertCircle size={14} className="text-rose-500" />;
      case 'confusing_explanation':
        return <HelpCircle size={14} className="text-indigo-500" />;
      case 'broken_activity':
        return <Wrench size={14} className="text-purple-500" />;
      case 'suggestion':
        return <MessageSquare size={14} className="text-emerald-500" />;
      default:
        return <AlertCircle size={14} className="text-text-muted" />;
    }
  };

  const getStatusBadge = (status: IssueStatus) => {
    switch (status) {
      case 'resolved':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'fix_in_progress':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      case 'confirmed':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'under_review':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'dismissed':
        return 'bg-surface text-text-muted border-border line-through';
      case 'reported':
      default:
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 font-bold';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-card border border-border w-full max-w-5xl h-[88vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between bg-surface/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
              <AlertCircle size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-text">Learner Content Issues & Feedback</h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  {contentIssues.filter((i) => i.status === 'reported' || i.status === 'under_review').length} Actionable
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Review ambiguity reports, audio bugs, and learner suggestions directly connected to curriculum nodes.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface border border-transparent hover:border-border transition-all"
            aria-label="Close Issue Tracker"
          >
            <X size={18} />
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="p-3 sm:px-5 border-b border-border bg-card/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1 min-w-[220px]">
            <div className="relative w-full max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search issues, lessons, or reporters..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-surface border border-border text-xs text-text placeholder:text-text-muted focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex items-center gap-1">
              <Filter size={13} className="text-text-muted ml-2" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="reported">Reported</option>
                <option value="under_review">Under Review</option>
                <option value="confirmed">Confirmed</option>
                <option value="fix_in_progress">Fix in Progress</option>
                <option value="resolved">Resolved</option>
                <option value="dismissed">Dismissed</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none"
              >
                <option value="all">All Categories</option>
                <option value="confusing_explanation">Confusing Explanation</option>
                <option value="incorrect_answer">Incorrect Answer</option>
                <option value="audio_problem">Audio Problem</option>
                <option value="broken_activity">Broken Activity</option>
                <option value="suggestion">Learner Suggestion</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <span className="text-text-muted font-medium text-[11px]">
            Showing <strong>{filteredIssues.length}</strong> of {contentIssues.length} issues
          </span>
        </div>

        {/* Content Body: Split Master-Detail */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0 overflow-hidden">
          {/* Issue List Column */}
          <div className="md:col-span-5 border-r border-border overflow-y-auto divide-y divide-border bg-surface/30">
            {filteredIssues.length === 0 ? (
              <div className="p-8 text-center text-text-muted text-xs space-y-2">
                <CheckCircle2 size={32} className="mx-auto text-emerald-500 opacity-60" />
                <p className="font-bold text-text">No issues match current filters</p>
                <p className="text-[11px]">All curriculum feedback is clear or resolved.</p>
              </div>
            ) : (
              filteredIssues.map((issue) => {
                const isSelected = selectedIssue?.id === issue.id;
                return (
                  <button
                    key={issue.id}
                    type="button"
                    onClick={() => handleSelectIssue(issue)}
                    className={`w-full p-4 text-left transition-all flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-primary/10 border-l-4 border-l-primary'
                        : 'hover:bg-surface/80 border-l-4 border-l-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        {getCategoryIcon(issue.category)}
                        <span className="text-[11px] font-bold text-text capitalize">
                          {issue.category.replace('_', ' ')}
                        </span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border capitalize ${getStatusBadge(issue.status)}`}>
                        {issue.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h4 className="text-xs font-black text-text line-clamp-1">{issue.contentTitle}</h4>
                    <p className="text-[11px] text-text-muted line-clamp-2 leading-relaxed">
                      {issue.details}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[10px] text-text-muted">
                      <span>By <strong>{issue.reportedBy || 'Learner'}</strong></span>
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {issue.createdAt}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Issue Detail View */}
          <div className="md:col-span-7 overflow-y-auto p-5 space-y-5 bg-card flex flex-col justify-between">
            {selectedIssue ? (
              <div className="space-y-5">
                {/* Issue Header Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-bold capitalize ${getStatusBadge(selectedIssue.status)}`}>
                      {selectedIssue.status.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-text-muted flex items-center gap-1">
                      <Clock size={12} />
                      Reported {selectedIssue.createdAt}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-text">{selectedIssue.contentTitle}</h3>

                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <span className="font-semibold text-text uppercase text-[10px] px-2 py-0.5 rounded bg-surface border border-border">
                      {selectedIssue.contentType.replace('_', ' ')}
                    </span>
                    <span>•</span>
                    <span>Reporter: <strong>{selectedIssue.reportedBy || 'Anonymous Learner'}</strong></span>
                  </div>
                </div>

                {/* Report Details Box */}
                <div className="p-4 rounded-2xl bg-surface border border-border space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-text">
                    {getCategoryIcon(selectedIssue.category)}
                    <span className="capitalize">{selectedIssue.category.replace('_', ' ')} Report</span>
                  </div>
                  <p className="text-xs text-text leading-relaxed whitespace-pre-wrap">
                    {selectedIssue.details}
                  </p>
                </div>

                {/* Associated Content Quick Jump */}
                {onOpenContentEditor && (
                  <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-primary uppercase block">Target Content Item</span>
                      <span className="text-xs font-bold text-text">{selectedIssue.contentTitle}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenContentEditor(selectedIssue.contentId)}
                      className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1.5 hover:bg-primary-hover shadow-xs transition-all"
                    >
                      <span>Open in Editor</span>
                      <ExternalLink size={12} />
                    </button>
                  </div>
                )}

                {/* Workflow Resolution Actions */}
                <div className="space-y-2.5 pt-2 border-t border-border">
                  <label className="text-xs font-bold text-text block">Update Issue Resolution Status</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleStatusChange('under_review')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-center ${
                        selectedIssue.status === 'under_review'
                          ? 'bg-blue-500 text-white border-blue-500 shadow-xs'
                          : 'bg-surface hover:bg-card border-border text-text'
                      }`}
                    >
                      Under Review
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange('confirmed')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-center ${
                        selectedIssue.status === 'confirmed'
                          ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                          : 'bg-surface hover:bg-card border-border text-text'
                      }`}
                    >
                      Confirm Bug
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange('fix_in_progress')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-center ${
                        selectedIssue.status === 'fix_in_progress'
                          ? 'bg-purple-500 text-white border-purple-500 shadow-xs'
                          : 'bg-surface hover:bg-card border-border text-text'
                      }`}
                    >
                      Fix in Progress
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange('resolved')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-center ${
                        selectedIssue.status === 'resolved'
                          ? 'bg-emerald-500 text-white border-emerald-500 shadow-xs'
                          : 'bg-surface hover:bg-card border-border text-text'
                      }`}
                    >
                      Mark Resolved
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange('dismissed')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-center ${
                        selectedIssue.status === 'dismissed'
                          ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                          : 'bg-surface hover:bg-card border-border text-text'
                      }`}
                    >
                      Dismiss / Inaccurate
                    </button>
                  </div>
                </div>

                {/* Admin / Reviewer Notes Box */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-text">Pedagogical / Editorial Resolution Notes</label>
                    <button
                      type="button"
                      onClick={handleSaveNotes}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      <Send size={11} />
                      <span>Save Note</span>
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={editingNotes}
                    onChange={(e) => setEditingNotes(e.target.value)}
                    placeholder="Document root cause, grammar clarification, or changes made in the latest draft..."
                    className="w-full p-3 rounded-2xl bg-surface border border-border text-xs text-text placeholder:text-text-muted focus:outline-none focus:border-primary resize-none"
                  />
                  {selectedIssue.adminNotes && selectedIssue.adminNotes !== editingNotes && (
                    <p className="text-[10px] text-amber-500 font-semibold">Unsaved notes. Click "Save Note" to persist.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-text-muted text-xs">
                Select an issue on the left to review and resolve.
              </div>
            )}

            {/* Modal Bottom Close */}
            <div className="pt-4 border-t border-border flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-text hover:bg-card transition-all"
              >
                Close Inbox
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
