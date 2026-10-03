import React, { useState } from 'react';
import {
  X,
  Users,
  CheckCircle2,
  Sparkles,
  Plus,
  Trash2,
  FileCheck,
  Volume2,
  Calendar,
} from 'lucide-react';
import { useProLab } from '../../context/ProLabContext';
import { MeetingMinutesEvaluation } from '../../types/proLab';

interface MeetingMinutesLabModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MeetingMinutesLabModal: React.FC<MeetingMinutesLabModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { meetingEpisodes, evaluateMeetingMinutes } = useProLab();
  const currentMeeting = meetingEpisodes[0];

  const [summary, setSummary] = useState('');
  const [decisions, setDecisions] = useState<string[]>(['']);
  const [actionItems, setActionItems] = useState<Array<{ owner: string; task: string; deadline: string }>>([
    { owner: '', task: '', deadline: '' },
  ]);
  const [evaluation, setEvaluation] = useState<MeetingMinutesEvaluation | null>(null);

  if (!isOpen) return null;

  const handleAddDecision = () => setDecisions([...decisions, '']);
  const handleUpdateDecision = (index: number, val: string) => {
    const next = [...decisions];
    next[index] = val;
    setDecisions(next);
  };
  const handleRemoveDecision = (index: number) => {
    setDecisions(decisions.filter((_, i) => i !== index));
  };

  const handleAddActionItem = () =>
    setActionItems([...actionItems, { owner: '', task: '', deadline: '' }]);
  const handleUpdateActionItem = (index: number, field: string, val: string) => {
    const next = [...actionItems];
    next[index] = { ...next[index], [field]: val };
    setActionItems(next);
  };
  const handleRemoveActionItem = (index: number) => {
    setActionItems(actionItems.filter((_, i) => i !== index));
  };

  const handleEvaluate = () => {
    const res = evaluateMeetingMinutes(currentMeeting.id, {
      summary,
      decisions: decisions.filter(Boolean),
      actionItems: actionItems.filter((a) => a.owner && a.task),
      unresolvedQuestions: [],
    });
    setEvaluation(res);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[92vh] bg-surface rounded-3xl border border-border shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-card/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Users size={20} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                Meeting Series & Minutes Lab
              </span>
              <h2 className="text-base sm:text-lg font-black text-text">
                {currentMeeting.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-card transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Transcript Snippet */}
          <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
            <span className="text-xs font-black text-text block">
              Meeting Audio Transcript ({currentMeeting.participants.join(', ')}):
            </span>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {currentMeeting.audioTranscript.map((t, idx) => (
                <div key={idx} className="text-xs">
                  <span className="font-bold text-primary">{t.speaker}:</span>{' '}
                  <span className="text-text-muted">{t.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Executive Summary */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text">
                Meeting Executive Summary:
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Briefly state the core objective discussed and agreement reached..."
                rows={3}
                className="w-full p-3.5 rounded-2xl bg-card border border-border text-xs text-text focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none leading-relaxed"
              />
            </div>

            {/* Decisions Made */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-text">
                  Key Decisions Agreed ({decisions.filter(Boolean).length}):
                </label>
                <button
                  type="button"
                  onClick={handleAddDecision}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <Plus size={13} />
                  <span>Add Decision</span>
                </button>
              </div>

              {decisions.map((dec, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={dec}
                    onChange={(e) => handleUpdateDecision(i, e.target.value)}
                    placeholder="e.g. Approved 2.5-second hard timeout for bank APIs"
                    className="flex-1 px-3 py-2 rounded-xl bg-card border border-border text-xs text-text focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  />
                  {decisions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDecision(i)}
                      className="p-2 text-text-muted hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Action Items (Who, What, When) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-text">
                  Action Items (Who • What • When):
                </label>
                <button
                  type="button"
                  onClick={handleAddActionItem}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <Plus size={13} />
                  <span>Add Action Item</span>
                </button>
              </div>

              {actionItems.map((item, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={item.owner}
                    onChange={(e) => handleUpdateActionItem(i, 'owner', e.target.value)}
                    placeholder="Owner (e.g. Maya)"
                    className="w-full sm:w-36 px-3 py-2 rounded-xl bg-card border border-border text-xs text-text focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  />
                  <input
                    type="text"
                    value={item.task}
                    onChange={(e) => handleUpdateActionItem(i, 'task', e.target.value)}
                    placeholder="Action task (e.g. Deliver async queue mock API contracts)"
                    className="flex-1 px-3 py-2 rounded-xl bg-card border border-border text-xs text-text focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  />
                  <input
                    type="text"
                    value={item.deadline}
                    onChange={(e) => handleUpdateActionItem(i, 'deadline', e.target.value)}
                    placeholder="Deadline (e.g. Wed 3:00 PM)"
                    className="w-full sm:w-36 px-3 py-2 rounded-xl bg-card border border-border text-xs text-text focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  />
                  {actionItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveActionItem(i)}
                      className="p-2 text-text-muted hover:text-red-500 self-center"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleEvaluate}
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-2 hover:opacity-90 shadow-xs"
              >
                <FileCheck size={14} />
                <span>Evaluate Meeting Minutes</span>
              </button>
            </div>
          </div>

          {/* Evaluation Results */}
          {evaluation && (
            <div className="p-5 rounded-2xl bg-card border border-primary/30 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-text">Minutes Evaluation</span>
                <span className="font-mono font-black text-sm text-primary px-2.5 py-0.5 rounded bg-primary/10">
                  {evaluation.score}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-surface border border-border">
                  <span className="text-[10px] text-text-muted uppercase block">Decisions Captured:</span>
                  <span className="font-mono font-bold text-text">
                    {evaluation.capturedDecisionsCount} of {evaluation.totalDecisions}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-surface border border-border">
                  <span className="text-[10px] text-text-muted uppercase block">Who/What/When Score:</span>
                  <span className="font-mono font-bold text-text">
                    {evaluation.whoWhatWhenClarityScore}%
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <span className="font-bold text-text">Feedback:</span>
                <ul className="text-text-muted list-disc list-inside space-y-1">
                  {evaluation.feedback.map((fb, i) => (
                    <li key={i}>{fb}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
