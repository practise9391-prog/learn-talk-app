import React, { useState } from 'react';
import {
  Briefcase,
  Sparkles,
  Calendar,
  Users,
  Target,
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  ChevronRight,
  Building2,
  HelpCircle,
  MessageSquare,
  Layers,
  UserCheck,
  MessageSquareHeart,
  Scale,
  Zap,
  ArrowRightLeft,
  FileText,
  Send,
  BookOpen,
} from 'lucide-react';
import { useWorkplaceMastery } from '../../context/WorkplaceMasteryContext';
import { CareerGrowthTrackId } from '../../types/workplaceMastery';

// Modals
import { WorkplaceProfileModal } from './WorkplaceProfileModal';
import { NewEmployeePathModal } from './NewEmployeePathModal';
import { AskingForHelpModal } from './AskingForHelpModal';
import { StandupSimulatorModal } from './StandupSimulatorModal';
import { TaskUnderstandingModal } from './TaskUnderstandingModal';
import { ProjectStatusLabModal } from './ProjectStatusLabModal';
import { ManagerOneOnOneModal } from './ManagerOneOnOneModal';
import { FeedbackLabModal } from './FeedbackLabModal';
import { DisagreementConflictModal } from './DisagreementConflictModal';
import { ExecutiveBriefingLabModal } from './ExecutiveBriefingLabModal';
import { BidiTechCommunicationModal } from './BidiTechCommunicationModal';
import { MeetingMasteryModal } from './MeetingMasteryModal';
import { AsyncDecisionMatrixModal } from './AsyncDecisionMatrixModal';
import { LeadershipDelegationModal } from './LeadershipDelegationModal';
import { MultiDayWorkdaySimulationModal } from './MultiDayWorkdaySimulationModal';
import { CareerStoryBuilderModal } from './CareerStoryBuilderModal';
import { WorkplaceReadinessModal } from './WorkplaceReadinessModal';

export const WorkplaceMasteryDashboard: React.FC = () => {
  const {
    profile,
    multiDaySim,
    growthTracks,
    activeTrackId,
    setActiveTrackId,
    recommendedDrill,
    totalCompletedDrills,
  } = useWorkplaceMastery();

  // Modals state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isStandupOpen, setIsStandupOpen] = useState(false);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isOneOnOneOpen, setIsOneOnOneOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isDisputeOpen, setIsDisputeOpen] = useState(false);
  const [isExecOpen, setIsExecOpen] = useState(false);
  const [isBidiOpen, setIsBidiOpen] = useState(false);
  const [isMeetingOpen, setIsMeetingOpen] = useState(false);
  const [isAsyncOpen, setIsAsyncOpen] = useState(false);
  const [isDelegationOpen, setIsDelegationOpen] = useState(false);
  const [isMultiDayOpen, setIsMultiDayOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isReadinessOpen, setIsReadinessOpen] = useState(false);

  const activeTrack =
    growthTracks.find((t) => t.id === activeTrackId) || growthTracks[0];

  const handleLaunchModule = (key: string) => {
    switch (key) {
      case 'onboarding':
        setIsOnboardingOpen(true);
        break;
      case 'asking_help':
        setIsHelpOpen(true);
        break;
      case 'standup':
        setIsStandupOpen(true);
        break;
      case 'task_understanding':
        setIsTaskOpen(true);
        break;
      case 'status_lab':
        setIsStatusOpen(true);
        break;
      case 'one_on_one':
        setIsOneOnOneOpen(true);
        break;
      case 'feedback_lab':
        setIsFeedbackOpen(true);
        break;
      case 'disagreement':
        setIsDisputeOpen(true);
        break;
      case 'exec_briefing':
        setIsExecOpen(true);
        break;
      case 'bidi_tech':
        setIsBidiOpen(true);
        break;
      case 'meeting_mastery':
        setIsMeetingOpen(true);
        break;
      case 'async_matrix':
        setIsAsyncOpen(true);
        break;
      case 'delegation':
        setIsDelegationOpen(true);
        break;
      case 'storytelling':
        setIsStoryOpen(true);
        break;
      default:
        setIsStandupOpen(true);
    }
  };

  const workplaceModules = [
    {
      id: 'onboarding',
      title: 'New Employee Path',
      desc: 'Master Day 1 introductions, asking where resources live, and setting 30-day goals.',
      icon: Users,
      color: 'text-teal-600 dark:text-teal-400 bg-teal-500/10',
      badge: 'Day 1 → Month 1',
      action: () => setIsOnboardingOpen(true),
    },
    {
      id: 'asking_help',
      title: 'Asking for Help (4-Part Method)',
      desc: 'Frame requests: Context → What I tried → What’s unclear → Specific low-friction ask.',
      icon: HelpCircle,
      color: 'text-amber-500 bg-amber-500/10',
      badge: 'Engineering Etiquette',
      action: () => setIsHelpOpen(true),
    },
    {
      id: 'standup',
      title: 'Daily Standup Simulator',
      desc: 'Deliver high-visibility updates: Yesterday → Today → Blockers in under 90 words.',
      icon: Clock,
      color: 'text-blue-500 bg-blue-500/10',
      badge: 'Daily Routine',
      action: () => setIsStandupOpen(true),
    },
    {
      id: 'task_understanding',
      title: 'Task Understanding & Paraphrasing',
      desc: 'Listen to spoken instructions, identify constraints, and confirm with zero assumptions.',
      icon: MessageSquare,
      color: 'text-purple-500 bg-purple-500/10',
      badge: 'Active Listening',
      action: () => setIsTaskOpen(true),
    },
    {
      id: 'status_lab',
      title: 'Project Status Lab (Green/Yellow/Red)',
      desc: 'Lead with health status, articulate risks without panic, and request clear stakeholder support.',
      icon: Layers,
      color: 'text-emerald-500 bg-emerald-500/10',
      badge: 'Status Reporting',
      action: () => setIsStatusOpen(true),
    },
    {
      id: 'one_on_one',
      title: 'Manager 1:1 Sync Simulator',
      desc: 'Lead proactive 1:1 syncs on career milestones, on-call alert fatigue, and workload balance.',
      icon: UserCheck,
      color: 'text-indigo-500 bg-indigo-500/10',
      badge: 'Upward Influence',
      action: () => setIsOneOnOneOpen(true),
    },
    {
      id: 'feedback_lab',
      title: 'Feedback Lab: Receiving & Giving',
      desc: 'Deconstruct vague comments calmly and deliver constructive feedback using the SBI model.',
      icon: MessageSquareHeart,
      color: 'text-pink-500 bg-pink-500/10',
      badge: 'SBI Framework',
      action: () => setIsFeedbackOpen(true),
    },
    {
      id: 'disagreement',
      title: 'Disagreement & Conflict Arena',
      desc: 'Disagree on technical architectures and shared API contracts with principled diplomacy.',
      icon: Scale,
      color: 'text-orange-500 bg-orange-500/10',
      badge: 'Diplomacy',
      action: () => setIsDisputeOpen(true),
    },
    {
      id: 'exec_briefing',
      title: 'Executive Briefing & Rapid Q&A',
      desc: 'Deliver Bottom-Line-Up-Front (BLUF) briefs to CTOs and defend proposals under pressure.',
      icon: Zap,
      color: 'text-amber-600 bg-amber-600/10',
      badge: 'BLUF Protocol',
      action: () => setIsExecOpen(true),
    },
    {
      id: 'bidi_tech',
      title: 'Bidirectional Technical Translation',
      desc: 'Calibrate between technical depth, business outcome, and memorable analogies.',
      icon: ArrowRightLeft,
      color: 'text-cyan-500 bg-cyan-500/10',
      badge: 'Cross-Functional',
      action: () => setIsBidiOpen(true),
    },
    {
      id: 'meeting_mastery',
      title: 'Meeting Facilitation & Minutes',
      desc: 'Intervene politely when conversations derail, manage agendas, and draft crisp action items.',
      icon: Users,
      color: 'text-violet-500 bg-violet-500/10',
      badge: 'Facilitation',
      action: () => setIsMeetingOpen(true),
    },
    {
      id: 'async_matrix',
      title: 'Async Communication Decision Matrix',
      desc: 'Know when to use Slack/Teams vs Email vs RFC Documents vs Synchronous War Rooms.',
      icon: Send,
      color: 'text-blue-600 bg-blue-600/10',
      badge: 'Async Channels',
      action: () => setIsAsyncOpen(true),
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Profile & Multi-Day Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-surface to-background border border-border p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary text-white uppercase tracking-wider">
                Part 21 • Workplace Mastery
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-surface border border-border text-text-secondary font-medium">
                {profile.experienceLevel.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              Succeeding & Leading in the Workplace
            </h1>
            <p className="text-sm text-text-secondary leading-relaxed">
              Lifelong professional communication: From Day 1 onboarding and daily standups to manager 1:1s, high-stakes disagreements, and C-suite briefings.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-text-secondary">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-surface rounded-lg border border-border">
                <Briefcase className="w-3.5 h-3.5 text-primary" />
                <span>{profile.currentRole}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-surface rounded-lg border border-border">
                <Building2 className="w-3.5 h-3.5 text-primary" />
                <span>{profile.industry}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-surface rounded-lg border border-border">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>{profile.workMode.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsMultiDayOpen(true)}
              className="flex items-center justify-between gap-3 px-5 py-3 rounded-2xl bg-surface hover:bg-surface-hover border border-border text-xs font-semibold text-text-primary transition-all shadow-sm group"
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-primary" />
                <div className="text-left">
                  <span className="block text-text-secondary text-[10px] uppercase font-bold">
                    Context Memory Journey
                  </span>
                  <span>Day {multiDaySim.currentDay} of 20 (Trust: {multiDaySim.managerTrustLevel}%)</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-text-tertiary group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsProfileOpen(true)}
                className="flex-1 px-4 py-2.5 bg-surface hover:bg-surface-hover border border-border rounded-xl text-xs font-semibold text-text-primary transition-colors text-center"
              >
                Edit Context Profile
              </button>
              <button
                type="button"
                onClick={() => setIsReadinessOpen(true)}
                className="flex-1 px-4 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl text-xs font-semibold transition-colors text-center"
              >
                12-Skill Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Adaptive Recommendation Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-primary/5 via-surface to-background border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider block">
              Personalized Adaptive Focus Drill
            </span>
            <p className="text-xs sm:text-sm text-text-primary mt-0.5">
              {recommendedDrill.rationale}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => handleLaunchModule(recommendedDrill.moduleKey)}
          className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl shrink-0 transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          Launch Drill Now
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3. Growth Tracks Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-text-primary">
              Professional Growth Tracks
            </h3>
            <p className="text-xs text-text-secondary">
              Select an optional development path tailored to your immediate career goals
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {growthTracks.slice(0, 4).map((track) => (
            <button
              key={track.id}
              onClick={() => setActiveTrackId(track.id as CareerGrowthTrackId)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                activeTrackId === track.id
                  ? 'bg-primary/5 border-primary shadow-sm'
                  : 'bg-surface border-border hover:border-primary/40'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary block mb-1">
                {track.targetSeniority}
              </span>
              <h4 className="text-xs font-bold text-text-primary truncate mb-1.5">
                {track.title.split(':')[1] || track.title}
              </h4>
              <div className="w-full bg-border/60 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500"
                  style={{ width: `${track.progressPercent}%` }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. 12 Core Practice Studios Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-text-primary">
              Workplace Practice Studios
            </h3>
            <p className="text-xs text-text-secondary">
              12 realistic interactive labs covering standups, 1:1s, status updates, disputes, and executive briefs
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsDelegationOpen(true)}
              className="px-3 py-1.5 bg-surface hover:bg-surface-hover border border-border text-text-secondary hover:text-text-primary rounded-xl text-xs font-medium transition-colors"
            >
              Delegation Lab
            </button>
            <button
              type="button"
              onClick={() => setIsStoryOpen(true)}
              className="px-3 py-1.5 bg-surface hover:bg-surface-hover border border-border text-text-secondary hover:text-text-primary rounded-xl text-xs font-medium transition-colors"
            >
              CARL Story Builder
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workplaceModules.map((module) => {
            const Icon = module.icon;
            return (
              <div
                key={module.id}
                onClick={module.action}
                className="group p-5 rounded-2xl bg-surface border border-border hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl ${module.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-surface-hover border border-border text-text-secondary">
                      {module.badge}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">
                      {module.title}
                    </h4>
                    <p className="text-xs text-text-secondary mt-1 leading-relaxed line-clamp-2">
                      {module.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between text-xs font-semibold text-primary">
                  <span>Enter Studio</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals Mounting */}
      <WorkplaceProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      <NewEmployeePathModal isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} />
      <AskingForHelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <StandupSimulatorModal isOpen={isStandupOpen} onClose={() => setIsStandupOpen(false)} />
      <TaskUnderstandingModal isOpen={isTaskOpen} onClose={() => setIsTaskOpen(false)} />
      <ProjectStatusLabModal isOpen={isStatusOpen} onClose={() => setIsStatusOpen(false)} />
      <ManagerOneOnOneModal isOpen={isOneOnOneOpen} onClose={() => setIsOneOnOneOpen(false)} />
      <FeedbackLabModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
      <DisagreementConflictModal isOpen={isDisputeOpen} onClose={() => setIsDisputeOpen(false)} />
      <ExecutiveBriefingLabModal isOpen={isExecOpen} onClose={() => setIsExecOpen(false)} />
      <BidiTechCommunicationModal isOpen={isBidiOpen} onClose={() => setIsBidiOpen(false)} />
      <MeetingMasteryModal isOpen={isMeetingOpen} onClose={() => setIsMeetingOpen(false)} />
      <AsyncDecisionMatrixModal isOpen={isAsyncOpen} onClose={() => setIsAsyncOpen(false)} />
      <LeadershipDelegationModal isOpen={isDelegationOpen} onClose={() => setIsDelegationOpen(false)} />
      <MultiDayWorkdaySimulationModal isOpen={isMultiDayOpen} onClose={() => setIsMultiDayOpen(false)} />
      <CareerStoryBuilderModal isOpen={isStoryOpen} onClose={() => setIsStoryOpen(false)} />
      <WorkplaceReadinessModal isOpen={isReadinessOpen} onClose={() => setIsReadinessOpen(false)} />
    </div>
  );
};
