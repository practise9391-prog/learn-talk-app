import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useUser } from '../../context/UserContext';
import { IssueCategory } from '../../types/contentManagement';
import { ContentType } from '../../types/admin';
import {
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  Volume2,
  Wrench,
  X,
  Send,
} from 'lucide-react';

interface LearnerReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: string;
  contentTitle: string;
  contentType?: ContentType;
}

export const LearnerReportIssueModal: React.FC<LearnerReportIssueModalProps> = ({
  isOpen,
  onClose,
  contentId,
  contentTitle,
  contentType = 'curriculum_lesson',
}) => {
  const { reportContentIssue } = useAdmin();
  const { user } = useUser();

  const [category, setCategory] = useState<IssueCategory>('confusing_explanation');
  const [details, setDetails] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    reportContentIssue({
      contentId,
      contentTitle,
      contentType,
      reportedBy: user?.name || 'Learner',
      category,
      details: details.trim(),
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDetails('');
      onClose();
    }, 2200);
  };

  const categories: { key: IssueCategory; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      key: 'confusing_explanation',
      label: 'Confusing Explanation',
      desc: 'Grammar rule or instruction was hard to understand',
      icon: <HelpCircle size={16} className="text-indigo-500" />,
    },
    {
      key: 'incorrect_answer',
      label: 'Incorrect Answer',
      desc: 'Answer key or feedback seems grammatically wrong',
      icon: <AlertCircle size={16} className="text-rose-500" />,
    },
    {
      key: 'audio_problem',
      label: 'Audio / Pronunciation Issue',
      desc: 'Native audio is unclear, robotic, or mismatched',
      icon: <Volume2 size={16} className="text-amber-500" />,
    },
    {
      key: 'broken_activity',
      label: 'Interactive Glitch',
      desc: 'Button, speech recognition, or card not responding',
      icon: <Wrench size={16} className="text-purple-500" />,
    },
    {
      key: 'suggestion',
      label: 'Suggestion / Improvement',
      desc: 'Idea to make this lesson more practical or engaging',
      icon: <MessageSquare size={16} className="text-emerald-500" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-card border border-border w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <MessageSquare size={16} />
            </div>
            <div>
              <h3 className="text-sm font-black text-text">Report Issue or Suggestion</h3>
              <p className="text-[11px] text-text-muted line-clamp-1">{contentTitle}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-text-muted hover:text-text hover:bg-surface border border-transparent hover:border-border transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 size={40} className="mx-auto text-emerald-500 animate-in zoom-in" />
            <h4 className="text-sm font-black text-text">Thank You for Your Feedback!</h4>
            <p className="text-xs text-text-muted max-w-xs mx-auto">
              Our linguistics and curriculum team will review your report to continuously improve our learning content.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text">What would you like to report?</label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {categories.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setCategory(c.key)}
                    className={`w-full p-2.5 rounded-xl text-left border flex items-center gap-2.5 transition-all text-xs ${
                      category === c.key
                        ? 'bg-primary/10 border-primary shadow-2xs'
                        : 'bg-surface hover:bg-card border-border text-text'
                    }`}
                  >
                    <div className="shrink-0">{c.icon}</div>
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-text block leading-tight">{c.label}</span>
                      <span className="text-[10px] text-text-muted block leading-tight">{c.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text">Details & Context</label>
              <textarea
                required
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe what was confusing or what you suggest improving..."
                className="w-full p-3 rounded-2xl bg-surface border border-border text-xs text-text placeholder:text-text-muted focus:outline-none focus:border-primary resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-text-muted hover:text-text"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!details.trim()}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1.5 hover:bg-primary-hover shadow-xs transition-all disabled:opacity-50"
              >
                <Send size={12} />
                <span>Submit Feedback</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
