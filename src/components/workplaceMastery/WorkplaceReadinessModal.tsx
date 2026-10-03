import React from 'react';
import {
  X,
  Award,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react';
import { useWorkplaceMastery } from '../../context/WorkplaceMasteryContext';
import { WorkplaceReadinessDimension } from '../../types/workplaceMastery';

interface WorkplaceReadinessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkplaceReadinessModal: React.FC<WorkplaceReadinessModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { readinessDimensions, recommendedDrill } = useWorkplaceMastery();

  if (!isOpen) return null;

  const getProficiencyBadge = (level: string) => {
    switch (level) {
      case 'master':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30';
      case 'fluent':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'competent':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30';
      case 'emerging':
      default:
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-surface-hover/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">
                Workplace Readiness Evidence Profile
              </h2>
              <p className="text-sm text-text-secondary">
                Comprehensive 12-dimension communication evidence without arbitrary single-score simplifications
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
          {/* Recommendation Banner */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary shrink-0" />
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wider block">
                  Adaptive Focus Recommendation
                </span>
                <p className="text-xs text-text-secondary mt-0.5">
                  {recommendedDrill.rationale}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl shrink-0 transition-colors"
            >
              Practice Recommended
            </button>
          </div>

          {/* 12 Dimensions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {readinessDimensions.map((dim) => (
              <div
                key={dim.id}
                className="p-4 rounded-xl bg-background border border-border hover:border-primary/40 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-text-primary text-xs truncate max-w-[200px]">
                    {dim.name}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-text-tertiary font-semibold">
                      {dim.evidenceCount} Evidences
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${getProficiencyBadge(
                        dim.proficiencyLevel
                      )}`}
                    >
                      {dim.proficiencyLevel}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <p className="text-text-secondary">
                    <strong className="text-text-primary">Demonstrated Strength:</strong>{' '}
                    {dim.strengthSummary}
                  </p>
                  <p className="text-text-tertiary text-[11px]">
                    <strong className="text-primary font-medium">Growth Area:</strong>{' '}
                    {dim.nextFocusArea}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-border bg-surface-hover/30">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
