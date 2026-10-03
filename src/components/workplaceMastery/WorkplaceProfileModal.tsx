import React, { useState } from 'react';
import {
  X,
  Briefcase,
  Building2,
  Users,
  Clock,
  Compass,
  CheckCircle2,
  Save,
  Target,
} from 'lucide-react';
import { useWorkplaceMastery } from '../../context/WorkplaceMasteryContext';
import {
  WorkplaceExperienceLevel,
  TeamWorkMode,
  TeamStructureType,
} from '../../types/workplaceMastery';

interface WorkplaceProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkplaceProfileModal: React.FC<WorkplaceProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { profile, updateProfile } = useWorkplaceMastery();

  const [currentRole, setCurrentRole] = useState(profile.currentRole);
  const [industry, setIndustry] = useState(profile.industry);
  const [experienceLevel, setExperienceLevel] = useState<WorkplaceExperienceLevel>(
    profile.experienceLevel
  );
  const [teamType, setTeamType] = useState<TeamStructureType>(profile.teamType);
  const [workMode, setWorkMode] = useState<TeamWorkMode>(profile.workMode);
  const [newGoal, setNewGoal] = useState('');
  const [goals, setGoals] = useState<string[]>(profile.professionalGoals);

  if (!isOpen) return null;

  const handleSave = () => {
    updateProfile({
      currentRole,
      industry,
      experienceLevel,
      teamType,
      workMode,
      professionalGoals: goals,
    });
    onClose();
  };

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      setGoals([...goals, newGoal.trim()]);
      setNewGoal('');
    }
  };

  const handleRemoveGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-surface-hover/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">
                Workplace Profile & Context
              </h2>
              <p className="text-sm text-text-secondary">
                Configure your current role, team dynamics, and long-term communication goals
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
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Role and Industry */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                Current Role / Target Title
              </label>
              <input
                type="text"
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
                placeholder="e.g. Full Stack Engineer, Product Manager"
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                Industry & Domain
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. Fintech, Healthcare, SaaS, E-Commerce"
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
              />
            </div>
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
              Career Experience Stage
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                [
                  { id: 'new_hire', label: 'New Hire / Fresher' },
                  { id: 'team_member', label: 'Team Member' },
                  { id: 'senior', label: 'Senior / Specialist' },
                  { id: 'team_lead', label: 'Team Lead' },
                  { id: 'manager', label: 'Manager' },
                  { id: 'executive', label: 'Director / Exec' },
                ] as const
              ).map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setExperienceLevel(lvl.id)}
                  className={`px-3 py-2 text-xs font-medium rounded-xl border text-center transition-all ${
                    experienceLevel === lvl.id
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-background border-border text-text-secondary hover:border-primary/50'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Team Structure & Work Mode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                Team Structure
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: 'co_located', label: 'In-Office' },
                    { id: 'remote', label: 'Fully Remote' },
                    { id: 'hybrid', label: 'Hybrid' },
                    { id: 'cross_functional', label: 'Cross-Functional' },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTeamType(t.id)}
                    className={`px-3 py-2 text-xs font-medium rounded-xl border text-center transition-all ${
                      teamType === t.id
                        ? 'bg-primary text-white border-primary'
                        : 'bg-background border-border text-text-secondary hover:border-primary/50'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                Cadence & Work Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'balanced', label: 'Balanced' },
                    { id: 'async_heavy', label: 'Async-Heavy' },
                    { id: 'sync_heavy', label: 'Meeting-Heavy' },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setWorkMode(m.id)}
                    className={`px-3 py-2 text-xs font-medium rounded-xl border text-center transition-all ${
                      workMode === m.id
                        ? 'bg-primary text-white border-primary'
                        : 'bg-background border-border text-text-secondary hover:border-primary/50'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Professional Communication Goals */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
              Current Workplace Communication Goals
            </label>
            <div className="space-y-2 mb-3">
              {goals.map((g, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-3 py-2 bg-background border border-border rounded-xl text-sm"
                >
                  <div className="flex items-center gap-2 text-text-primary">
                    <Target className="w-4 h-4 text-primary shrink-0" />
                    <span>{g}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveGoal(idx)}
                    className="text-text-tertiary hover:text-red-500 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddGoal())}
                placeholder="Add a custom goal (e.g. Master executive summaries)..."
                className="flex-1 px-4 py-2 bg-background border border-border rounded-xl text-text-primary placeholder:text-text-tertiary text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button
                type="button"
                onClick={handleAddGoal}
                className="px-4 py-2 bg-surface hover:bg-surface-hover border border-border text-text-primary font-medium text-sm rounded-xl transition-colors"
              >
                Add Goal
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-surface-hover/30">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-border rounded-xl text-sm font-medium text-text-secondary hover:bg-surface transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};
