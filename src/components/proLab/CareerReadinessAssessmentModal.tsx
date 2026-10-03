import React from 'react';
import {
  X,
  Award,
  CheckCircle2,
  TrendingUp,
  Target,
  Sparkles,
  Layers,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import { useProLab } from '../../context/ProLabContext';

interface CareerReadinessAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CareerReadinessAssessmentModal: React.FC<CareerReadinessAssessmentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { readinessScores } = useProLab();

  if (!isOpen) return null;

  const averageScore = Math.round(
    readinessScores.reduce((acc, curr) => acc + curr.score, 0) / readinessScores.length
  );

  const topStrengths = [...readinessScores].sort((a, b) => b.score - a.score).slice(0, 3);
  const areasToImprove = [...readinessScores].sort((a, b) => a.score - b.score).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[92vh] bg-surface rounded-3xl border border-border shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-card/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Award size={20} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                Career Communication Readiness Assessment
              </span>
              <h2 className="text-base sm:text-lg font-black text-text">
                10-Dimension Workplace Proficiency Radar
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
          {/* Readiness Index Hero Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-primary/10 via-secondary/10 to-indigo-500/10 border-2 border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                Overall Career Readiness Index
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-text font-mono">
                  {averageScore}%
                </span>
                <span className="text-xs text-text-muted font-semibold">
                  (Benchmark Target: 85%)
                </span>
              </div>
              <p className="text-xs text-text-muted max-w-md">
                Synthesized across real-world workday simulations, stakeholder emails, meeting minutes, technical defenses, and crisis broadcasts.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1 shrink-0 text-center">
              <span className="text-[10px] font-bold text-text-muted uppercase block">
                Evidence Portfolio
              </span>
              <span className="text-xl font-mono font-black text-primary block">
                {readinessScores.reduce((acc, c) => acc + c.evidenceCount, 0)}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold block">
                Practice Evidences Logged
              </span>
            </div>
          </div>

          {/* 10 Dimension Bars Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-text uppercase tracking-wider">
                Readiness Breakdown Across 10 Core Competencies
              </span>
              <span className="text-xs text-text-muted">Target: 80–85%+</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {readinessScores.map((rec) => {
                const isMeetingTarget = rec.score >= rec.benchmarkTarget;
                return (
                  <div
                    key={rec.dimension}
                    className="p-3.5 rounded-2xl bg-card border border-border space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-text">{rec.label}</span>
                      <span
                        className={`font-mono font-black ${
                          isMeetingTarget ? 'text-emerald-600' : 'text-amber-500'
                        }`}
                      >
                        {rec.score}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-surface border border-border/40 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isMeetingTarget ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${rec.score}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-text-muted leading-relaxed line-clamp-2">
                      {rec.summary}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strengths & Focus Areas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
              <span className="text-xs font-bold text-emerald-600 uppercase flex items-center gap-1.5">
                <CheckCircle2 size={14} />
                <span>Top Demonstrated Strengths:</span>
              </span>
              <ul className="space-y-2 text-xs text-text-muted">
                {topStrengths.map((str) => (
                  <li key={str.dimension} className="flex items-start gap-2">
                    <span className="font-bold text-text">{str.label} ({str.score}%):</span>
                    <span>{str.summary}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
              <span className="text-xs font-bold text-amber-500 uppercase flex items-center gap-1.5">
                <Target size={14} />
                <span>Priority Practice Areas:</span>
              </span>
              <ul className="space-y-2 text-xs text-text-muted">
                {areasToImprove.map((imp) => (
                  <li key={imp.dimension} className="flex items-start gap-2">
                    <span className="font-bold text-text">{imp.label} ({imp.score}%):</span>
                    <span>{imp.summary}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommended Weekly Learning Plan */}
          <div className="p-4 rounded-2xl bg-surface border border-border space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-text">
              <Calendar size={15} className="text-primary" />
              <span>Personalized Weekly Communication Plan:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px] text-text-muted">
              <div className="p-2.5 rounded-xl bg-card border border-border">
                <span className="font-bold text-primary block">Mon & Tue:</span>
                Client de-escalation practice & immediate workaround framing
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border">
                <span className="font-bold text-indigo-500 block">Wed & Thu:</span>
                Meeting Minutes synthesis (Who • What • When precision)
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border">
                <span className="font-bold text-emerald-600 block">Friday:</span>
                One complete Workday Simulation run with zero retries
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
