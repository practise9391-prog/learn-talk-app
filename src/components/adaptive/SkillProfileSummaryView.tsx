import React, { useState } from 'react';
import { useAdaptiveLearning } from '../../context/AdaptiveLearningContext';
import { useNavigation } from '../../context/NavigationContext';
import { LearningGoalId, AdaptiveDifficultyLevel } from '../../types/adaptive';
import { SkillGraphModal } from './SkillGraphModal';
import {
  TrendingUp,
  Target,
  Network,
  Zap,
  CheckCircle2,
  Sparkles,
  Award,
  ChevronRight,
  ShieldCheck,
  Flame,
} from 'lucide-react';

export const SkillProfileSummaryView: React.FC = () => {
  const {
    skillProfile,
    goalsConfig,
    activeGoal,
    setPrimaryGoal,
    adjustDifficulty,
  } = useAdaptiveLearning();
  const { navigate } = useNavigation();

  const [isGraphModalOpen, setIsGraphModalOpen] = useState<boolean>(false);

  const skillsList = Object.values(skillProfile.skills);

  const difficultyLevels: { id: AdaptiveDifficultyLevel; label: string; desc: string }[] = [
    { id: 'easy', label: 'Easy (Confidence)', desc: 'Slower audio, shorter sentences, high assistance' },
    { id: 'normal', label: 'Normal (Standard)', desc: 'Everyday speed with structured sentence scaffolding' },
    { id: 'challenging', label: 'Challenging', desc: 'Faster pace, fewer hints, unexpected conversational turns' },
    { id: 'advanced', label: 'Advanced', desc: 'Complex idioms, professional vocabulary, unscripted dialogues' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: Derived Skill Stage & Primary Goal */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-primary/10 via-secondary/10 to-card border border-primary/20 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-black uppercase tracking-wider">
              Overall Stage: {skillProfile.overallDerivedLevel}
            </span>
            <span className="text-xs font-semibold text-text-muted">
              (Multi-Skill Derived)
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-text">
            Adaptive Learner Skill Profile
          </h2>
          <p className="text-xs text-text-muted max-w-xl leading-relaxed">
            Skills are continuously calibrated from your lessons, voice calls, roleplays, and assessment testsânot static exam scores.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsGraphModalOpen(true)}
          className="self-start md:self-auto px-4 py-2.5 rounded-2xl bg-card border border-border hover:border-primary text-text font-bold text-xs flex items-center gap-2 shadow-2xs transition-all"
        >
          <Network size={16} className="text-primary" />
          <span>View Interconnected Skill Graph</span>
        </button>
      </div>

      {/* Goal Priority Selector (Section 4 & 5) */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Target size={18} className="text-primary" />
            <h3 className="text-base font-black text-text">Active Learning Goal Priority</h3>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Selecting a primary goal emphasizes relevant lessons, roleplays, and daily recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.values(goalsConfig).map((goal) => {
            const isPrimary = skillProfile.primaryGoal === goal.id;
            return (
              <div
                key={goal.id}
                onClick={() => setPrimaryGoal(goal.id as LearningGoalId)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isPrimary
                    ? 'bg-primary/10 border-primary ring-2 ring-primary/20 shadow-xs'
                    : 'bg-surface border-border hover:border-primary/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-2xl">{goal.icon}</span>
                    {isPrimary ? (
                      <span className="px-2 py-0.5 rounded-full bg-primary text-white text-[10px] font-extrabold">
                        Primary Target â
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-text-muted hover:text-text">
                        Tap to activate
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-text">{goal.title}</h4>
                  <p className="text-xs text-text-muted mt-0.5 line-clamp-2 leading-relaxed">
                    {goal.tagline}
                  </p>
                </div>

                <div className="text-[11px] text-text-muted pt-2 border-t border-border/60">
                  <span>Top focus: <strong>{goal.focusAreas[0]}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skill-Specific Levels Grid (Section 2 & 3) */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-primary" />
            <h3 className="text-base font-black text-text">Individual Skill Proficiencies</h3>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Different skills develop at different speeds. Here is your evidence-based breakdown.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {skillsList.map((skill) => (
            <div
              key={skill.skill}
              className="p-4 rounded-2xl bg-surface border border-border space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text truncate">{skill.label}</span>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                    skill.level === 'Advanced' || skill.level === 'Fluent'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                      : skill.level.startsWith('Intermediate')
                      ? 'bg-primary/10 text-primary border-primary/20'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                  }`}
                >
                  {skill.level}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-text-muted font-semibold">
                  <span>Score: {skill.score}%</span>
                  <span>Trend: {skill.trend === 'improving' ? 'â Improving' : 'â Stable'}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-card overflow-hidden border border-border/60">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${skill.score}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-text-muted pt-1 border-t border-border/60">
                <span>{skill.evidenceCount} evidence points</span>
                <span>Last demonstrated: {skill.lastDemonstrated}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detected Strengths & Confidence (Section 30) */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-amber-500" />
          <h3 className="text-base font-black text-text">Detected Learner Strengths</h3>
        </div>
        <p className="text-xs text-text-muted">
          We recognize your strongest communication attributes to build confidence and guide next-level challenge.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {skillProfile.detectedStrengths.map((strength, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-surface border border-border flex items-start gap-2.5 text-xs"
            >
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-text font-medium leading-relaxed">{strength}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Adaptive Difficulty Preference (Section 17, 18, 19) */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-primary" />
            <h3 className="text-base font-black text-text">Adaptive Practice Difficulty</h3>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            The engine automatically eases complexity if you hesitate, or increases challenge when you succeed. You can also manually guide it.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {difficultyLevels.map((lvl) => {
            const isSelected = skillProfile.currentDifficulty === lvl.id;
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => adjustDifficulty(lvl.id)}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'bg-primary/10 border-primary ring-2 ring-primary/20 shadow-xs'
                    : 'bg-surface border-border hover:border-primary/40'
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-text block mb-1">{lvl.label}</span>
                  <span className="text-[11px] text-text-muted leading-relaxed block">{lvl.desc}</span>
                </div>
                {isSelected && (
                  <span className="text-[10px] font-bold text-primary mt-2">Active Level â</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Skill Graph Modal */}
      <SkillGraphModal
        isOpen={isGraphModalOpen}
        onClose={() => setIsGraphModalOpen(false)}
      />
    </div>
  );
};
