import React, { useState } from 'react';
import { useAdaptiveLearning } from '../../context/AdaptiveLearningContext';
import { useNavigation } from '../../context/NavigationContext';
import {
  Sparkles,
  ArrowRight,
  HelpCircle,
  Clock,
  Compass,
  CheckCircle2,
  AlertCircle,
  X,
  Zap,
  TrendingUp,
} from 'lucide-react';

export const WhatShouldILearnNextCard: React.FC = () => {
  const { primaryRecommendation, activeGoal, skillProfile } = useAdaptiveLearning();
  const { navigate } = useNavigation();
  const [showWhyModal, setShowWhyModal] = useState<boolean>(false);

  const handleStart = () => {
    navigate(primaryRecommendation.actionRoute, primaryRecommendation.actionParams);
  };

  return (
    <>
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-primary/10 via-secondary/10 to-card border border-primary/20 shadow-xs space-y-4">
        {/* Header Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs">
              <Sparkles size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-black uppercase tracking-wider text-primary">
                  Recommended Next
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                  {primaryRecommendation.tag}
                </span>
                {skillProfile.autoEased && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
                    Difficulty Eased for Confidence
                  </span>
                )}
                {skillProfile.challengeMode && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    Challenge Level Increased
                  </span>
                )}
              </div>
              <p className="text-[11px] text-text-muted">Targeting Goal: {activeGoal.title}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowWhyModal(true)}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-semibold text-text-muted hover:text-text hover:bg-surface transition-colors shadow-2xs"
            title="Understand why this was recommended"
          >
            <HelpCircle size={14} className="text-primary" />
            <span>Why this?</span>
          </button>
        </div>

        {/* Main Recommendation Body */}
        <div>
          <h2 className="text-lg sm:text-xl font-black text-text tracking-tight">
            {primaryRecommendation.title}
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mt-1 leading-relaxed">
            {primaryRecommendation.subtitle}
          </p>
        </div>

        {/* Reason & Benefit Pill */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-2xl bg-surface/70 border border-border">
            <span className="text-[10px] font-bold text-text-muted uppercase block mb-0.5">
              Identified Need
            </span>
            <p className="text-text leading-relaxed">{primaryRecommendation.reason}</p>
          </div>

          <div className="p-3 rounded-2xl bg-surface/70 border border-border">
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase block mb-0.5">
              Expected Benefit
            </span>
            <p className="text-text leading-relaxed">{primaryRecommendation.expectedBenefit}</p>
          </div>
        </div>

        {/* Actions & Alternatives */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleStart}
              className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-primary/25 hover:bg-primary-hover active:scale-98 transition-all"
            >
              <span>{primaryRecommendation.actionLabel}</span>
              <ArrowRight size={14} />
            </button>

            <span className="text-xs font-semibold text-text-muted flex items-center gap-1 px-2">
              <Clock size={12} />
              ~{primaryRecommendation.estimatedMinutes} mins
            </span>
          </div>

          {/* User Control & Alternative Options (Section 54) */}
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => navigate('/learn')}
              className="text-text-muted hover:text-text font-medium underline"
            >
              Browse Curriculum
            </button>
            <span className="text-text-muted">â¢</span>
            <button
              type="button"
              onClick={() => navigate('/talk')}
              className="text-text-muted hover:text-text font-medium underline"
            >
              Talk with Jarvis
            </button>
          </div>
        </div>
      </div>

      {/* "Why am I seeing this?" Transparency Modal (Section 53 & 57) */}
      {showWhyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-lg rounded-3xl shadow-2xl p-6 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle size={18} className="text-primary" />
                <h3 className="text-base font-black text-text">Why Was This Recommended?</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowWhyModal(false)}
                className="p-1 rounded-xl text-text-muted hover:text-text"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1">
                <span className="font-bold text-text block">1. Learning Evidence:</span>
                <p className="text-text-muted">{primaryRecommendation.whyThisText}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1">
                <span className="font-bold text-text block">2. Goal Alignment:</span>
                <p className="text-text-muted">
                  You selected <strong>{activeGoal.title}</strong> as your primary goal. This activity directly unlocks the next required speaking milestone.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1">
                <span className="font-bold text-text block">3. 10-Factor Adaptive Priority:</span>
                <p className="text-text-muted">
                  Ranked at <strong>{primaryRecommendation.priorityScore}% priority</strong> considering repeated mistakes, active goal relevance, and recent improvement trends.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowWhyModal(false);
                  handleStart();
                }}
                className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-hover transition-colors"
              >
                Start Recommended Activity
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
