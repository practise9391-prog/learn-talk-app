import React from 'react';
import {
  X,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Users,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';
import { useWorkplaceMastery } from '../../context/WorkplaceMasteryContext';

interface MultiDayWorkdaySimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MultiDayWorkdaySimulationModal: React.FC<MultiDayWorkdaySimulationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { multiDaySim, advanceMultiDaySim, resetMultiDaySim } = useWorkplaceMastery();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-surface-hover/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">
                Multi-Day Workplace Journey Simulator
              </h2>
              <p className="text-sm text-text-secondary">
                Context-aware workplace memory: Sprint tasks, manager trust, and cross-day decisions
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
          {/* Company & Day Bar */}
          <div className="p-5 rounded-2xl bg-surface-hover border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Simulated Organization
              </span>
              <h3 className="text-base font-bold text-text-primary">
                {multiDaySim.simulatedOrgName}
              </h3>
              <p className="text-xs text-text-secondary">
                Your Role: {multiDaySim.roleTitle}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-background border border-border rounded-xl text-center">
                <span className="text-[10px] text-text-tertiary uppercase font-bold block">
                  Simulated Timeline
                </span>
                <span className="text-base font-bold text-primary">
                  Day {multiDaySim.currentDay} of 20
                </span>
              </div>

              <div className="px-4 py-2 bg-background border border-border rounded-xl text-center">
                <span className="text-[10px] text-text-tertiary uppercase font-bold block">
                  Manager Trust Level
                </span>
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                  {multiDaySim.managerTrustLevel}%
                </span>
              </div>
            </div>
          </div>

          {/* Active Sprint Task Board */}
          <div>
            <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">
              Active Sprint Tasks & Commitments
            </h4>
            <div className="space-y-2">
              {multiDaySim.activeSprintTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3.5 bg-background border border-border rounded-xl text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    {task.status === 'done' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : task.status === 'in_progress' ? (
                      <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-border shrink-0" />
                    )}
                    <span className="font-semibold text-text-primary">{task.title}</span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      task.status === 'done'
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : task.status === 'in_progress'
                        ? 'bg-blue-500/10 text-blue-600'
                        : 'bg-surface text-text-tertiary'
                    }`}
                  >
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Team Members & Stakeholders */}
          <div>
            <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">
              Team Squad Relationships
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {multiDaySim.teamMembers.map((member, i) => (
                <div
                  key={i}
                  className="p-3 bg-background border border-border rounded-xl text-xs space-y-1"
                >
                  <span className="font-bold text-text-primary block truncate">
                    {member.name}
                  </span>
                  <span className="text-[10px] text-text-secondary block truncate">
                    {member.role}
                  </span>
                  <div className="flex items-center justify-between text-[10px] text-emerald-600 font-semibold pt-1">
                    <span>Alignment:</span>
                    <span>{member.relationshipScore}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Feedback from Context Memory */}
          <div className="p-4 bg-background rounded-xl border border-border space-y-2">
            <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Persistent Manager Feedback & Milestones
            </h4>
            <div className="space-y-1.5 text-xs text-text-primary">
              {multiDaySim.recentFeedback.slice(-3).map((fb, idx) => (
                <p key={idx} className="italic text-text-secondary">
                  • {fb}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-surface-hover/30">
          <button
            type="button"
            onClick={resetMultiDaySim}
            className="flex items-center gap-1.5 px-4 py-2 border border-border rounded-xl text-xs font-semibold text-text-secondary hover:bg-surface transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Simulation
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
