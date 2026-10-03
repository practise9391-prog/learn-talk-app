import React, { useState } from 'react';
import {
  Briefcase,
  Sparkles,
  Clock,
  Mail,
  MessageSquare,
  Users,
  Presentation,
  Compass,
  AlertOctagon,
  TrendingDown,
  Award,
  Play,
  ArrowRight,
  Shield,
  Building2,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { useProLab } from '../../context/ProLabContext';
import { SimulationRole } from '../../types/proLab';
import { SIMULATED_ORGANIZATIONS } from '../../data/proLabData';

// Modals
import { WorkdaySimulationModal } from './WorkdaySimulationModal';
import { EmailThreadLabModal } from './EmailThreadLabModal';
import { ChatThreadLabModal } from './ChatThreadLabModal';
import { MeetingMinutesLabModal } from './MeetingMinutesLabModal';
import { PresentationLabModal } from './PresentationLabModal';
import { CommunicationDecisionModal } from './CommunicationDecisionModal';
import { IncidentCommunicationModal } from './IncidentCommunicationModal';
import { BusinessCaseLabModal } from './BusinessCaseLabModal';
import { CareerReadinessAssessmentModal } from './CareerReadinessAssessmentModal';

const ROLE_OPTIONS: Array<{ id: SimulationRole; label: string }> = [
  { id: 'software_developer', label: 'Software Engineer / Developer' },
  { id: 'engineer', label: 'Systems / DevOps Engineer' },
  { id: 'data_analyst', label: 'Data Analyst / Scientist' },
  { id: 'product_manager', label: 'Product Manager' },
  { id: 'team_lead', label: 'Engineering Team Lead' },
  { id: 'engineering_manager', label: 'Engineering / People Manager' },
  { id: 'consultant', label: 'Tech Consultant / Solutions Architect' },
  { id: 'customer_support', label: 'Customer Success / Support Lead' },
  { id: 'qa_engineer', label: 'QA / Automation Engineer' },
  { id: 'junior_employee', label: 'Junior / Graduate Professional' },
  { id: 'general_professional', label: 'General Corporate Professional' },
];

export const ProLabView: React.FC = () => {
  const {
    activeRole,
    setActiveRole,
    activeOrg,
    setActiveOrg,
    projectState,
    completedLabCount,
    readinessScores,
  } = useProLab();

  // Modals state
  const [isWorkdayOpen, setIsWorkdayOpen] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMinutesOpen, setIsMinutesOpen] = useState(false);
  const [isPresOpen, setIsPresOpen] = useState(false);
  const [isDecisionOpen, setIsDecisionOpen] = useState(false);
  const [isIncidentOpen, setIsIncidentOpen] = useState(false);
  const [isCaseOpen, setIsCaseOpen] = useState(false);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);

  const averageReadiness = Math.round(
    readinessScores.reduce((acc, c) => acc + c.score, 0) / readinessScores.length
  );

  const labModules = [
    {
      id: 'workday',
      title: 'Full Workday Simulation ("My Professional Day")',
      desc: 'Enter a realistic chronological day: 9:00 AM Standup → 10:30 AM Manager 1-on-1 → 1:00 PM Slack War-Room → 2:30 PM Client Call → 3:45 PM Incident Triage → 5:00 PM Executive Briefing.',
      icon: Clock,
      color: 'text-primary bg-primary/10',
      badge: 'Flagship Experience',
      action: () => setIsWorkdayOpen(true),
    },
    {
      id: 'email',
      title: 'Professional Email Thread Lab',
      desc: 'Master multi-turn email chains with demanding clients and managers, remembering context, commitments, and deadlines.',
      icon: Mail,
      color: 'text-amber-500 bg-amber-500/10',
      badge: 'Client & SLA Writing',
      action: () => setIsEmailOpen(true),
    },
    {
      id: 'chat',
      title: 'Slack / Teams Project Chat Lab',
      desc: 'Practice high-signal asynchronous communication: concise updates, reporting blockers, and war-room coordination.',
      icon: MessageSquare,
      color: 'text-indigo-500 bg-indigo-500/10',
      badge: 'Async Channels',
      action: () => setIsChatOpen(true),
    },
    {
      id: 'meeting',
      title: 'Meeting Series & Minutes Lab',
      desc: 'Listen to multi-speaker technical syncs and extract professional meeting minutes and action items (Who • What • When).',
      icon: Users,
      color: 'text-emerald-500 bg-emerald-500/10',
      badge: 'Listening & Synthesis',
      action: () => setIsMinutesOpen(true),
    },
    {
      id: 'presentation',
      title: 'Presentation & Q&A Defense Lab',
      desc: 'Deliver slide presentations across 4 modes (Practice, Realistic, Pressure, Assessment) and defend technical decisions.',
      icon: Presentation,
      color: 'text-purple-500 bg-purple-500/10',
      badge: 'Speaking & Q&A Defense',
      action: () => setIsPresOpen(true),
    },
    {
      id: 'decision',
      title: 'Communication Decision Lab ("What Would You Say?")',
      desc: 'Navigate tough workplace dilemmas: select strategic stances and communicate rationale with consequence simulation.',
      icon: Compass,
      color: 'text-blue-500 bg-blue-500/10',
      badge: 'Judgment & Strategy',
      action: () => setIsDecisionOpen(true),
    },
    {
      id: 'incident',
      title: 'Incident & Crisis Communication Lab',
      desc: 'Broadcast P1 outage updates: separate facts known from unverified speculation, report impact, and announce next update time.',
      icon: AlertOctagon,
      color: 'text-red-500 bg-red-500/10',
      badge: 'High-Stakes Crisis',
      action: () => setIsIncidentOpen(true),
    },
    {
      id: 'case',
      title: 'Business Case & Churn Analysis Lab',
      desc: 'Analyze customer churn telemetry, structure a 6-step proposal, and defend executive recommendations.',
      icon: TrendingDown,
      color: 'text-rose-500 bg-rose-500/10',
      badge: 'Executive Problem Solving',
      action: () => setIsCaseOpen(true),
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12 animate-fadeIn">
      {/* Top Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-1.5">
                <Sparkles size={12} />
                <span>Part 19 • Professional English Lab</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                Simulated Work Environment
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-text tracking-tight">
              Real-World Workplace Simulations & Career Readiness
            </h1>
            <p className="text-xs sm:text-sm text-text-muted max-w-2xl leading-relaxed">
              Experience end-to-end professional situations across connected meetings, emails, client calls, incident triage, and executive summaries with context-retaining AI memory.
            </p>
          </div>

          {/* Selectors for Role & Organization */}
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <div className="p-3 rounded-2xl bg-surface border border-border space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-text-muted block">
                Simulated Role
              </label>
              <select
                value={activeRole}
                onChange={(e) => setActiveRole(e.target.value as SimulationRole)}
                className="px-2.5 py-1.5 rounded-xl bg-card border border-border text-xs font-bold text-text focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary cursor-pointer"
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 rounded-2xl bg-surface border border-border space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-text-muted block">
                Fictional Organization
              </label>
              <select
                value={activeOrg.id}
                onChange={(e) => {
                  const found = SIMULATED_ORGANIZATIONS.find((o) => o.id === e.target.value);
                  if (found) setActiveOrg(found);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-card border border-border text-xs font-bold text-text focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary cursor-pointer"
              >
                {SIMULATED_ORGANIZATIONS.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name.split('(')[0]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Readiness Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-border/60">
          <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1">
            <span className="text-[10px] font-bold text-text-muted uppercase">Readiness Index</span>
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-lg text-text">{averageReadiness}%</span>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                Target: 85%
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1">
            <span className="text-[10px] font-bold text-text-muted uppercase">Labs Completed</span>
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-lg text-text">{completedLabCount}</span>
              <span className="text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                +50 XP each
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1">
            <span className="text-[10px] font-bold text-text-muted uppercase">Project Context</span>
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-xs text-text truncate max-w-[110px]">
                {projectState.name.split(' ')[0]}
              </span>
              <span className="text-[10px] font-semibold text-indigo-500 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                Persistent
              </span>
            </div>
          </div>

          <div
            onClick={() => setIsAssessmentOpen(true)}
            className="p-3.5 rounded-2xl bg-primary/10 border border-primary/30 space-y-1 cursor-pointer hover:bg-primary/15 transition-colors"
          >
            <span className="text-[10px] font-bold text-primary uppercase flex items-center justify-between">
              <span>Readiness Radar</span>
              <ArrowRight size={12} />
            </span>
            <div className="flex items-center justify-between">
              <span className="font-black text-xs text-text">10 Dimensions</span>
              <span className="text-[10px] font-bold text-primary">View Report</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Banner: My Professional Day */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-primary/15 via-secondary/15 to-indigo-500/15 border-2 border-primary/40 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-sm mt-0.5">
            <Clock size={24} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-primary/20 text-primary px-2.5 py-0.5 rounded-full">
                Full Chronological Simulation
              </span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                6 Connected Stages
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-text">
              My Professional Day: A High-Stakes Day at NovaPay
            </h3>
            <p className="text-xs text-text-muted max-w-xl leading-relaxed">
              Step through a complete workday with persistent project memory: Standup at 9:00 AM, Manager trade-off at 10:30 AM, War-Room chat at 1:00 PM, Client pushback at 2:30 PM, Staging memory spike at 3:45 PM, and VP briefing at 5:00 PM.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsWorkdayOpen(true)}
          className="px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground font-black text-xs flex items-center gap-2 hover:opacity-95 transition-all shadow-md shrink-0 self-stretch md:self-auto justify-center"
        >
          <Play size={15} />
          <span>Enter Simulated Workday</span>
        </button>
      </div>

      {/* Main Simulation Modules Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-text">
            Professional Practice Labs & Real-World Simulation Arenas
          </h2>
          <span className="text-xs text-text-muted">8 Interactive Labs</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {labModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                className="p-5 rounded-3xl bg-card border border-border hover:border-primary/40 transition-all flex flex-col justify-between gap-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-2xl ${mod.color}`}>
                      <Icon size={20} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-surface border border-border text-text-muted">
                      {mod.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-text group-hover:text-primary transition-colors">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-text-muted leading-relaxed mt-1">
                      {mod.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-text-muted flex items-center gap-1">
                    <Sparkles size={12} className="text-primary" />
                    <span>Real-world evaluation</span>
                  </span>

                  <button
                    type="button"
                    onClick={mod.action}
                    className="px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <span>Launch Lab</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <WorkdaySimulationModal isOpen={isWorkdayOpen} onClose={() => setIsWorkdayOpen(false)} />
      <EmailThreadLabModal isOpen={isEmailOpen} onClose={() => setIsEmailOpen(false)} />
      <ChatThreadLabModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <MeetingMinutesLabModal isOpen={isMinutesOpen} onClose={() => setIsMinutesOpen(false)} />
      <PresentationLabModal isOpen={isPresOpen} onClose={() => setIsPresOpen(false)} />
      <CommunicationDecisionModal isOpen={isDecisionOpen} onClose={() => setIsDecisionOpen(false)} />
      <IncidentCommunicationModal isOpen={isIncidentOpen} onClose={() => setIsIncidentOpen(false)} />
      <BusinessCaseLabModal isOpen={isCaseOpen} onClose={() => setIsCaseOpen(false)} />
      <CareerReadinessAssessmentModal
        isOpen={isAssessmentOpen}
        onClose={() => setIsAssessmentOpen(false)}
      />
    </div>
  );
};
