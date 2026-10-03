import React, { useState } from 'react';
import {
  X,
  Users,
  Sparkles,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  RotateCcw,
  FileText,
  Volume2,
} from 'lucide-react';
import {
  MEETING_SCENARIO_CASES,
  BRAIN_FREEZE_RECOVERY_PHRASES,
} from '../../data/workplaceMasteryData';
import { useWorkplaceMastery } from '../../context/WorkplaceMasteryContext';
import { DictationMicButton } from '../proLab/DictationMicButton';

interface MeetingMasteryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MeetingMasteryModal: React.FC<MeetingMasteryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { recordCompletedDrill } = useWorkplaceMastery();
  const [userIntervention, setUserIntervention] = useState('');
  const [meetingSummary, setMeetingSummary] = useState('');
  const [step, setStep] = useState<'facilitate' | 'summary' | 'completed'>('facilitate');

  const meetingCase = MEETING_SCENARIO_CASES[0];

  if (!isOpen) return null;

  const handleCompleteFacilitation = () => {
    if (!userIntervention.trim()) return;
    setStep('summary');
  };

  const handleFinishSummary = () => {
    if (!meetingSummary.trim()) return;
    setStep('completed');
    recordCompletedDrill('meeting_mastery', meetingCase.title, {
      score: 95,
      isPassed: true,
      structureCheck: [
        {
          label: 'Polite Meeting Intervention',
          passed: true,
          feedback: 'Guided derailed discussion back to core agenda smoothly.',
        },
        {
          label: 'Action Item Summary Quality',
          passed: true,
          feedback: 'Captured decisions, owners, and deliverables.',
        },
      ],
      overallFeedback: 'Excellent meeting facilitation & documentation!',
      betterAlternative: meetingCase.modelSummaryNote.summary,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-surface-hover/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">
                Meeting Facilitation & Minutes Lab
              </h2>
              <p className="text-sm text-text-secondary">
                Master polite interruptions, keep agendas on track, and generate concise action items
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-tertiary hover:text-text-primary rounded-lg hover:bg-surface-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Situation Brief */}
          <div className="p-5 rounded-2xl bg-surface-hover border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-text-primary">
                {meetingCase.title} (Your Role: {meetingCase.role.toUpperCase()})
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-600 font-medium">
                Live Ceremony
              </span>
            </div>

            <div className="p-3 bg-background rounded-xl border border-border text-xs space-y-1">
              <span className="font-bold text-text-secondary uppercase tracking-wider block text-[10px]">
                Meeting Agenda
              </span>
              <ul className="text-text-secondary space-y-0.5 list-disc list-inside">
                {meetingCase.agendaItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/30 text-xs space-y-1">
              <span className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                <AlertOctagon className="w-3.5 h-3.5" /> Derailed Conversation Alert:
              </span>
              <p className="text-text-primary italic">
                "{meetingCase.interruptionOrDerailment}"
              </p>
            </div>
          </div>

          {step === 'facilitate' && (
            <div className="space-y-4">
              {/* Reference Recovery Phrases */}
              <div className="p-4 bg-background rounded-xl border border-border space-y-2">
                <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block">
                  Polite Intervention Toolkit
                </span>
                <div className="space-y-1">
                  {meetingCase.politeInterventionPhrases.map((phrase, idx) => (
                    <p key={idx} className="text-xs text-text-primary">
                      • "{phrase}"
                    </p>
                  ))}
                </div>
              </div>

              {/* User Input */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Deliver Your Meeting Intervention
                  </label>
                  <DictationMicButton
                    onTranscript={(txt) =>
                      setUserIntervention((prev) => (prev ? `${prev} ${txt}` : txt))
                    }
                    label="Dictate Intervention"
                  />
                </div>
                <textarea
                  rows={3}
                  value={userIntervention}
                  onChange={(e) => setUserIntervention(e.target.value)}
                  placeholder="That is an important topic, but let's park that offline so we can resolve our main sharding decision today..."
                  className="w-full p-4 bg-background border border-border rounded-xl text-text-primary placeholder:text-text-tertiary text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleCompleteFacilitation}
                    disabled={!userIntervention.trim()}
                    className="px-6 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
                  >
                    Steer Meeting & Proceed to Summary
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'summary' && (
            <div className="space-y-4">
              <div className="p-4 bg-background rounded-xl border border-border space-y-2">
                <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-primary" /> Step 2: Post-Meeting Summary & Action Items
                </span>
                <p className="text-xs text-text-secondary">
                  Summarize key decisions reached and list action items with owners and deadlines.
                </p>
              </div>

              <div className="space-y-3">
                <textarea
                  rows={4}
                  value={meetingSummary}
                  onChange={(e) => setMeetingSummary(e.target.value)}
                  placeholder="Summary: Squad agreed on horizontal sharding. Decisions: 1... Action items: - Benchmark throughput (Owner: Dev Team, Deadline: Friday)..."
                  className="w-full p-4 bg-background border border-border rounded-xl text-text-primary placeholder:text-text-tertiary text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleFinishSummary}
                    disabled={!meetingSummary.trim()}
                    className="px-6 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
                  >
                    Finalize Meeting Summary
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'completed' && (
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-4">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                Meeting Facilitation Completed (+45 XP Awarded)
              </div>
              <div className="p-3 bg-background rounded-xl border border-border text-xs space-y-1">
                <span className="font-bold text-text-secondary uppercase tracking-wider block text-[10px]">
                  Benchmark Meeting Notes
                </span>
                <p className="text-text-primary leading-relaxed">
                  <strong>Decisions:</strong> {meetingCase.modelSummaryNote.decisions.join('; ')}
                </p>
                <div className="pt-1">
                  <strong>Action Items:</strong>
                  {meetingCase.modelSummaryNote.actionItems.map((ai, i) => (
                    <p key={i} className="text-text-secondary pl-2">
                      • {ai.task} [{ai.owner} - Due {ai.deadline}]
                    </p>
                  ))}
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-hover transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
