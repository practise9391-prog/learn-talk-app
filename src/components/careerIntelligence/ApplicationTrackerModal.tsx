import React, { useState } from 'react';
import {
  X,
  Briefcase,
  Plus,
  Trash2,
  Calendar,
  Building2,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { useCareerIntelligence } from '../../context/CareerIntelligenceContext';
import { ApplicationStatus, ApplicationTrackerItem } from '../../types/careerIntelligence';

interface ApplicationTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchInterview?: () => void;
  onLaunchRecruiter?: () => void;
}

export const ApplicationTrackerModal: React.FC<ApplicationTrackerModalProps> = ({
  isOpen,
  onClose,
  onLaunchInterview,
  onLaunchRecruiter,
}) => {
  const { applicationTracker, addApplication, updateApplicationStatus, deleteApplication } =
    useCareerIntelligence();

  const [isAdding, setIsAdding] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newLocation, setNewLocation] = useState('Remote / US');
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('applied');

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!newCompany.trim() || !newTitle.trim()) return;
    addApplication({
      companyName: newCompany,
      jobTitle: newTitle,
      location: newLocation,
      status: newStatus,
      linkedPracticeAction: {
        label: newStatus === 'interview_scheduled' ? 'Prepare Interview' : 'Practice Recruiter Call',
        actionType: newStatus === 'interview_scheduled' ? 'interview' : 'recruiter',
      },
    });
    setNewCompany('');
    setNewTitle('');
    setIsAdding(false);
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'interview_scheduled':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/30';
      case 'recruiter_contact':
        return 'bg-indigo-500/10 text-indigo-600 border-indigo-500/30';
      case 'offer':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30';
      case 'applied':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/30';
      default:
        return 'bg-surface text-text-muted border-border';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[92vh] bg-surface rounded-3xl border border-border shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-card/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Briefcase size={20} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                Application Pipeline & English Coach
              </span>
              <h2 className="text-base sm:text-lg font-black text-text">
                Job Application Tracker
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(!isAdding)}
              className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 hover:opacity-90"
            >
              <Plus size={14} />
              <span>Add Job</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-card transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Add Job Form */}
          {isAdding && (
            <div className="p-4 rounded-2xl bg-card border border-primary/30 space-y-3 animate-fadeIn">
              <span className="text-xs font-bold text-text block">Track New Job Application:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder="Company name (e.g. Stripe)"
                  className="px-3 py-2 rounded-xl bg-surface border border-border text-xs text-text focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                />
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Job title (e.g. Backend Lead)"
                  className="px-3 py-2 rounded-xl bg-surface border border-border text-xs text-text focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                />
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
                  className="px-3 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-text focus:outline-hidden focus:ring-2 focus:ring-primary/40 cursor-pointer"
                >
                  <option value="saved">Saved</option>
                  <option value="applied">Applied</option>
                  <option value="recruiter_contact">Recruiter Contact</option>
                  <option value="interview_scheduled">Interview Scheduled</option>
                  <option value="interview_completed">Interview Completed</option>
                  <option value="offer">Offer</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs font-bold text-text"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreate}
                  className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold"
                >
                  Save Application
                </button>
              </div>
            </div>
          )}

          {/* Applications List */}
          <div className="space-y-3">
            {applicationTracker.map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-text">{app.companyName}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border capitalize ${getStatusBadge(
                        app.status
                      )}`}
                    >
                      {app.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-text-muted">
                    {app.jobTitle} • {app.location}
                  </div>
                  {app.interviewDate && (
                    <div className="text-[11px] font-bold text-purple-600 flex items-center gap-1 pt-0.5">
                      <Calendar size={12} />
                      <span>{app.interviewDate}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (app.linkedPracticeAction.actionType === 'interview' && onLaunchInterview) {
                        onLaunchInterview();
                      } else if (onLaunchRecruiter) {
                        onLaunchRecruiter();
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <span>{app.linkedPracticeAction.label}</span>
                    <ArrowRight size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteApplication(app.id)}
                    className="p-2 text-text-muted hover:text-red-500 rounded-lg"
                    title="Delete application"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
