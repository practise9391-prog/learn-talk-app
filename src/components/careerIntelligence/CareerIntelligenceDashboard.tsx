import React, { useState } from 'react';
import {
  Briefcase,
  Target,
  Sparkles,
  FileSearch,
  PhoneCall,
  Users2,
  Share2,
  Bot,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Layers,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useCareerIntelligence } from '../../context/CareerIntelligenceContext';

// Modals
import { CareerGoalSetupModal } from './CareerGoalSetupModal';
import { JobDescriptionLabModal } from './JobDescriptionLabModal';
import { RecruiterSimulationModal } from './RecruiterSimulationModal';
import { NetworkingSimulatorModal } from './NetworkingSimulatorModal';
import { ApplicationTrackerModal } from './ApplicationTrackerModal';
import { CareerAICoachModal } from './CareerAICoachModal';
import { CareerTransferChallengeModal } from './CareerTransferChallengeModal';

export const CareerIntelligenceDashboard: React.FC = () => {
  const {
    goalProfile,
    roadmapStages,
    skillGapItems,
    applicationTracker,
    dailyPlan,
    setPlanDuration,
    togglePlanTask,
  } = useCareerIntelligence();

  // Modals state
  const [isGoalOpen, setIsGoalOpen] = useState(false);
  const [isJdOpen, setIsJdOpen] = useState(false);
  const [isRecruiterOpen, setIsRecruiterOpen] = useState(false);
  const [isNetworkingOpen, setIsNetworkingOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isCoachOpen, setIsCoachOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  const completedStagesCount = roadmapStages.filter((s) => s.status === 'completed').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Hero Goal & Readiness Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-primary/10 via-secondary/10 to-indigo-500/10 border-2 border-primary/25 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-primary/20 text-primary px-3 py-1 rounded-full flex items-center gap-1.5">
                <Sparkles size={12} />
                <span>Part 20 • Career Intelligence System</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                Active Employment Journey
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-text tracking-tight">
              {goalProfile.customRoleTitle || goalProfile.targetRole.replace('_', ' ')}
            </h2>
            <p className="text-xs text-text-muted max-w-2xl leading-relaxed">
              Targeting <b>{goalProfile.industry}</b> ({goalProfile.targetCompanyType.replace(/_/g, ' ')}) in <b>{goalProfile.targetCountry}</b>. Complete English preparation from job discovery to executive promotion.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsCoachOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-surface border border-border hover:border-primary/40 text-xs font-bold text-text flex items-center gap-2 shadow-xs transition-colors"
            >
              <Bot size={15} className="text-primary" />
              <span>Ask AI Coach</span>
            </button>

            <button
              type="button"
              onClick={() => setIsGoalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-2 hover:opacity-90 shadow-xs"
            >
              <Target size={15} />
              <span>Edit Career Goal</span>
            </button>
          </div>
        </div>

        {/* Quick Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border/60">
          <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
            <span className="text-[10px] font-bold text-text-muted uppercase">Roadmap Progress</span>
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-sm text-text">
                {completedStagesCount} / 12 Stages
              </span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                Active
              </span>
            </div>
          </div>

          <div
            onClick={() => setIsTrackerOpen(true)}
            className="p-3.5 rounded-2xl bg-card border border-border space-y-1 cursor-pointer hover:border-primary/40 transition-colors"
          >
            <span className="text-[10px] font-bold text-text-muted uppercase flex items-center justify-between">
              <span>Active Job Pipeline</span>
              <ArrowRight size={11} />
            </span>
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-sm text-text">
                {applicationTracker.length} Roles Tracked
              </span>
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                View All
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
            <span className="text-[10px] font-bold text-text-muted uppercase">Benchmark Standing</span>
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-sm text-text">82% Verified</span>
              <span className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                Transfer Ready
              </span>
            </div>
          </div>

          <div
            onClick={() => setIsTransferOpen(true)}
            className="p-3.5 rounded-2xl bg-card border border-border space-y-1 cursor-pointer hover:border-amber-500/40 transition-colors"
          >
            <span className="text-[10px] font-bold text-text-muted uppercase flex items-center justify-between">
              <span>Transfer Challenges</span>
              <ArrowRight size={11} />
            </span>
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-sm text-text">4 Audiences</span>
              <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">
                Multi-Stakeholder
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Fast Action Launchers */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          type="button"
          onClick={() => setIsJdOpen(true)}
          className="p-3.5 rounded-2xl bg-card border border-border hover:border-primary/40 text-left space-y-2 transition-all group"
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <FileSearch size={16} />
          </div>
          <div>
            <span className="text-xs font-bold text-text block group-hover:text-primary transition-colors">
              Job Description Lab
            </span>
            <span className="text-[10px] text-text-muted block truncate">Extract keywords & JDs</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setIsRecruiterOpen(true)}
          className="p-3.5 rounded-2xl bg-card border border-border hover:border-primary/40 text-left space-y-2 transition-all group"
        >
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <PhoneCall size={16} />
          </div>
          <div>
            <span className="text-xs font-bold text-text block group-hover:text-primary transition-colors">
              Recruiter Simulator
            </span>
            <span className="text-[10px] text-text-muted block truncate">Salary & screening calls</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setIsNetworkingOpen(true)}
          className="p-3.5 rounded-2xl bg-card border border-border hover:border-primary/40 text-left space-y-2 transition-all group"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Users2 size={16} />
          </div>
          <div>
            <span className="text-xs font-bold text-text block group-hover:text-primary transition-colors">
              Networking Lab
            </span>
            <span className="text-[10px] text-text-muted block truncate">Alumni & LinkedIn outreach</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setIsTransferOpen(true)}
          className="p-3.5 rounded-2xl bg-card border border-border hover:border-primary/40 text-left space-y-2 transition-all group"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Share2 size={16} />
          </div>
          <div>
            <span className="text-xs font-bold text-text block group-hover:text-primary transition-colors">
              Transfer Challenge
            </span>
            <span className="text-[10px] text-text-muted block truncate">4-Audience explanations</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setIsCoachOpen(true)}
          className="p-3.5 rounded-2xl bg-card border border-border hover:border-primary/40 text-left space-y-2 transition-all group col-span-2 sm:col-span-1"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
            <Bot size={16} />
          </div>
          <div>
            <span className="text-xs font-bold text-text block group-hover:text-primary transition-colors">
              Career AI Coach
            </span>
            <span className="text-[10px] text-text-muted block truncate">Instant advice & queries</span>
          </div>
        </button>
      </div>

      {/* Two Column Section: Skill Gap Map + Adaptive Daily Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Career Skill Gap Map */}
        <div className="p-5 sm:p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div>
              <h3 className="text-sm font-black text-text">Career Skill Gap Map</h3>
              <p className="text-[11px] text-text-muted">
                Evidence verified against {goalProfile.targetRole.replace('_', ' ')} requirements
              </p>
            </div>
            <span className="text-[10px] font-bold text-primary uppercase">No Peer Ranking</span>
          </div>

          <div className="space-y-3">
            {skillGapItems.map((item, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-surface border border-border/60 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-text">{item.skillName}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        item.status === 'transfer_ready'
                          ? 'bg-purple-500/10 text-purple-600'
                          : item.status === 'strong'
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : 'bg-amber-500/10 text-amber-500'
                      }`}
                    >
                      {item.status.replace('_', ' ')}
                    </span>
                    <span className="font-mono font-bold text-text">{item.currentScore}%</span>
                  </div>
                </div>

                <div className="w-full h-1.5 rounded-full bg-card overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      item.currentScore >= item.benchmarkScore ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${item.currentScore}%` }}
                  />
                </div>

                <span className="text-[10px] text-text-muted block">{item.recommendation}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Adaptive Career Daily Plan */}
        <div className="p-5 sm:p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div>
              <h3 className="text-sm font-black text-text">Personalized Career Daily Plan</h3>
              <p className="text-[11px] text-text-muted">
                Targeted practice based on your active gaps and available time
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-surface p-1 rounded-xl border border-border">
              {[15, 30, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setPlanDuration(mins)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    dailyPlan.totalMinutes === mins
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            {dailyPlan.tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => togglePlanTask(task.id)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                  task.completed
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-text-muted'
                    : 'bg-surface border-border hover:border-primary/40'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                    task.completed
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-border bg-card'
                  }`}
                >
                  {task.completed && <CheckCircle2 size={13} />}
                </div>

                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        task.completed ? 'line-through text-text-muted' : 'text-text'
                      }`}
                    >
                      {task.title}
                    </span>
                    <span className="text-[10px] font-mono text-primary font-bold">
                      {task.durationMinutes}m
                    </span>
                  </div>
                  <p className="text-[11px] text-text-muted leading-relaxed line-clamp-1">
                    {task.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 12-Stage Career Learning Roadmap Accordion/Grid */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h3 className="text-base font-black text-text">
              12-Stage Career English Preparation Roadmap
            </h3>
            <p className="text-xs text-text-muted">
              From Self-Introduction and Resume Bullets to Interview Pressure and Continuous Transfer
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-primary">
            {completedStagesCount} of 12 Completed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {roadmapStages.map((stage) => {
            const isCompleted = stage.status === 'completed';
            const isInProgress = stage.status === 'in_progress';

            return (
              <div
                key={stage.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between space-y-2 ${
                  isCompleted
                    ? 'bg-emerald-500/5 border-emerald-500/20'
                    : isInProgress
                    ? 'bg-surface border-primary/30 shadow-xs'
                    : 'bg-surface/50 border-border opacity-70'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-primary">
                      Stage {stage.stageNumber}
                    </span>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        isCompleted
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : isInProgress
                          ? 'bg-primary/10 text-primary'
                          : 'bg-card text-text-muted'
                      }`}
                    >
                      {stage.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-text">{stage.title}</h4>
                  <p className="text-[11px] text-text-muted leading-relaxed line-clamp-2">
                    {stage.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                  <span className="text-[10px] text-text-muted capitalize font-bold">
                    {stage.category}
                  </span>
                  <span className="text-[10px] text-primary font-bold flex items-center gap-1">
                    <span>{stage.actionLabel}</span>
                    <ChevronRight size={11} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <CareerGoalSetupModal isOpen={isGoalOpen} onClose={() => setIsGoalOpen(false)} />
      <JobDescriptionLabModal isOpen={isJdOpen} onClose={() => setIsJdOpen(false)} />
      <RecruiterSimulationModal isOpen={isRecruiterOpen} onClose={() => setIsRecruiterOpen(false)} />
      <NetworkingSimulatorModal isOpen={isNetworkingOpen} onClose={() => setIsNetworkingOpen(false)} />
      <ApplicationTrackerModal isOpen={isTrackerOpen} onClose={() => setIsTrackerOpen(false)} />
      <CareerAICoachModal isOpen={isCoachOpen} onClose={() => setIsCoachOpen(false)} />
      <CareerTransferChallengeModal isOpen={isTransferOpen} onClose={() => setIsTransferOpen(false)} />
    </div>
  );
};
