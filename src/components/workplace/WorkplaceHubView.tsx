import React, { useState } from 'react';
import {
  Building2,
  Users,
  Briefcase,
  Scale,
  MessageSquareHeart,
  ShieldCheck,
  Binary,
  Handshake,
  Zap,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  Sparkles,
  CheckCircle2,
  FlaskConical,
} from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';
import { useWorkplaceCommunication } from '../../context/WorkplaceCommunicationContext';
import { WorkplaceRoadmapLevelId } from '../../types/workplace';
import { SayItToDifferentPeopleModal } from './SayItToDifferentPeopleModal';
import { ManagerRoleplayModal } from './ManagerRoleplayModal';
import { ConflictResolutionArenaModal } from './ConflictResolutionArenaModal';
import { FeedbackTrainingModal } from './FeedbackTrainingModal';
import { ExecutiveBriefingStudioModal } from './ExecutiveBriefingStudioModal';
import { TechBusinessTranslationModal } from './TechBusinessTranslationModal';
import { NegotiationStudioModal } from './NegotiationStudioModal';
import { ThinkOnYourFeetModal } from './ThinkOnYourFeetModal';

export const WorkplaceHubView: React.FC = () => {
  const { roadmapLevels, activeLevel, setActiveLevel, completedDrillCount } =
    useWorkplaceCommunication();
  const { navigate } = useNavigation();

  // Modals state
  const [isAudienceOpen, setIsAudienceOpen] = useState(false);
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [isConflictOpen, setIsConflictOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isExecOpen, setIsExecOpen] = useState(false);
  const [isTransOpen, setIsTransOpen] = useState(false);
  const [isNegOpen, setIsNegOpen] = useState(false);
  const [isFeetOpen, setIsFeetOpen] = useState(false);

  const studios = [
    {
      id: 'audience',
      title: '“Say It to Different People”',
      desc: 'Frame the same situation to Teammates, Managers, Clients, Executives, and Principal Architects.',
      icon: Users,
      color: 'text-indigo-500 bg-indigo-500/10',
      badge: 'Audience Awareness',
      action: () => setIsAudienceOpen(true),
    },
    {
      id: 'manager',
      title: 'Manager Communication & Sync',
      desc: 'Practice reporting delays, admitting mistakes, and disagreeing respectfully with diverse manager personas.',
      icon: Briefcase,
      color: 'text-primary bg-primary/10',
      badge: 'Upward Influence',
      action: () => setIsManagerOpen(true),
    },
    {
      id: 'conflict',
      title: 'Conflict Resolution & Disagreement',
      desc: 'Master the 6-step de-escalation framework and direct, diplomatic, or technical disagreement styles.',
      icon: Scale,
      color: 'text-rose-500 bg-rose-500/10',
      badge: 'Impasse Mediation',
      action: () => setIsConflictOpen(true),
    },
    {
      id: 'feedback',
      title: 'Feedback Studio: Giving & Receiving',
      desc: 'Transform harsh feedback into actionable coaching, and convert defensive reactions into professional inquiry.',
      icon: MessageSquareHeart,
      color: 'text-emerald-500 bg-emerald-500/10',
      badge: 'Growth Mindset',
      action: () => setIsFeedbackOpen(true),
    },
    {
      id: 'executive',
      title: 'Executive Briefings & BLUF Studio',
      desc: 'Master 15s to 3m high-stakes summaries with Bottom-Line-Up-Front decision framing.',
      icon: ShieldCheck,
      color: 'text-amber-500 bg-amber-500/10',
      badge: 'C-Suite Precision',
      action: () => setIsExecOpen(true),
    },
    {
      id: 'translation',
      title: 'Technical ↔ Business Translation',
      desc: 'Translate complex distributed systems failures into business impact and customer reassurance.',
      icon: Binary,
      color: 'text-purple-500 bg-purple-500/10',
      badge: 'Cross-Functional',
      action: () => setIsTransOpen(true),
    },
    {
      id: 'negotiation',
      title: 'Principled Negotiation Masterclass',
      desc: 'Navigate scope trade-offs, deadlines, and contracts across 5 strategic stages without burning bridges.',
      icon: Handshake,
      color: 'text-sky-500 bg-sky-500/10',
      badge: 'Win-Win Commercial',
      action: () => setIsNegOpen(true),
    },
    {
      id: 'think_feet',
      title: '“Think on Your Feet” & Brain-Freeze',
      desc: 'Answer unexpected high-pressure executive ambush questions with countdown timers and lifeline assistance.',
      icon: Zap,
      color: 'text-amber-600 bg-amber-600/10',
      badge: 'Spontaneous Poise',
      action: () => setIsFeetOpen(true),
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-12">
      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-500/15 via-primary/10 to-card border border-indigo-500/20 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
                🏢 Advanced Professional English
              </span>
              <span className="text-xs text-text-muted">Part 18 Workplace Mastery</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-text tracking-tight">
              Workplace, Leadership & Executive Communication
            </h1>
            <p className="text-xs sm:text-sm text-text-muted max-w-2xl leading-relaxed">
              Communicate appropriately across Audience + Context + Goal + Formality + Urgency + Consequence.
              Elevate from individual contributor to trusted leader, negotiator, and executive communicator.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border text-center space-y-1 shrink-0">
            <span className="text-[10px] font-bold text-text-muted uppercase">Active Level</span>
            <span className="font-mono font-black text-2xl text-primary block">Level {activeLevel}</span>
            <span className="text-[10px] text-emerald-600 font-bold">
              {completedDrillCount} Drills Completed
            </span>
          </div>
        </div>

        {/* 7-Level Roadmap Stepper Bar */}
        <div className="mt-6 pt-6 border-t border-border/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-text-muted">
              7-Level Professional Progression Roadmap
            </span>
            <span className="text-xs font-semibold text-primary">
              Progression by Ambiguity & Consequence
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {roadmapLevels.map((lvl) => {
              const isSelected = activeLevel === lvl.level;
              return (
                <button
                  key={lvl.level}
                  type="button"
                  onClick={() => setActiveLevel(lvl.level as WorkplaceRoadmapLevelId)}
                  className={`p-2.5 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-primary/10 border-primary text-primary shadow-xs ring-1 ring-primary/40'
                      : 'bg-card/70 border-border text-text hover:border-primary/40'
                  }`}
                >
                  <span className="text-[10px] font-mono font-black block">Lvl {lvl.level}</span>
                  <span className="text-xs font-bold block truncate mt-0.5">{lvl.title.replace(' Communication', '')}</span>
                  <span className="text-[9px] text-text-muted block truncate mt-0.5">
                    {lvl.ambiguityLevel} ambiguity
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Level Overview Card */}
      {(() => {
        const currentLvl = roadmapLevels.find((l) => l.level === activeLevel) || roadmapLevels[0];
        return (
          <div className="p-6 rounded-3xl bg-card border border-border space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                  Level {currentLvl.level} Focus
                </span>
                <h3 className="text-base font-black text-text mt-0.5">{currentLvl.title}</h3>
                <p className="text-xs text-text-muted mt-0.5">{currentLvl.focusArea}</p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-surface border border-border text-text">
                  Scope: <b>{currentLvl.audienceScope}</b>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-surface border border-border text-text">
                  Consequences: <b>{currentLvl.consequences}</b>
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs font-bold text-text-muted mr-1">Target Competencies:</span>
              {currentLvl.coreSkills.map((sk, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-surface border border-border text-xs font-bold text-primary"
                >
                  ✓ {sk}
                </span>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Part 19: Professional English Lab Spotlight Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-primary/10 via-secondary/10 to-indigo-500/10 border-2 border-primary/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-sm mt-0.5">
            <FlaskConical size={24} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-primary/20 text-primary px-2.5 py-0.5 rounded-full">
                Real-World Simulation Lab • Part 19
              </span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Full Workday & Incidents
              </span>
            </div>
            <h3 className="text-base font-black text-text">
              Professional English Lab: "My Professional Day"
            </h3>
            <p className="text-xs text-text-muted max-w-xl leading-relaxed">
              Step into complete chronological workdays with persistent project memory: connected meetings, multi-turn email chains, Slack war-rooms, P1 incident alerts, and executive briefings.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/pro-lab')}
          className="px-5 py-3 rounded-2xl bg-primary text-primary-foreground font-black text-xs flex items-center gap-2 hover:opacity-95 transition-all shadow-md shrink-0 self-stretch md:self-auto justify-center"
        >
          <span>Launch Simulation Lab</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* 8 Interactive Studios Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-text">Advanced Professional Practice Studios</h2>
          <span className="text-xs text-text-muted">8 Mastery Simulators</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studios.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                className="p-5 rounded-3xl bg-card border border-border hover:border-primary/40 transition-all flex flex-col justify-between gap-4 group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${s.color}`}>
                      <Icon size={20} />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-surface border border-border text-text-muted uppercase tracking-wider">
                      {s.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-text group-hover:text-primary transition-colors">
                    {s.title}
                  </h3>

                  <p className="text-xs text-text-muted leading-relaxed">{s.desc}</p>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-end">
                  <button
                    type="button"
                    onClick={s.action}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1.5"
                  >
                    <span>Launch Studio</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals Mounting */}
      <SayItToDifferentPeopleModal isOpen={isAudienceOpen} onClose={() => setIsAudienceOpen(false)} />
      <ManagerRoleplayModal isOpen={isManagerOpen} onClose={() => setIsManagerOpen(false)} />
      <ConflictResolutionArenaModal isOpen={isConflictOpen} onClose={() => setIsConflictOpen(false)} />
      <FeedbackTrainingModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
      <ExecutiveBriefingStudioModal isOpen={isExecOpen} onClose={() => setIsExecOpen(false)} />
      <TechBusinessTranslationModal isOpen={isTransOpen} onClose={() => setIsTransOpen(false)} />
      <NegotiationStudioModal isOpen={isNegOpen} onClose={() => setIsNegOpen(false)} />
      <ThinkOnYourFeetModal isOpen={isFeetOpen} onClose={() => setIsFeetOpen(false)} />
    </div>
  );
};
