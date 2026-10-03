import React, { useState } from 'react';
import {
  Briefcase,
  Sparkles,
  FileText,
  Code2,
  Layers,
  UserCheck,
  MessageSquare,
  Users,
  FolderOpen,
  ArrowRight,
  Play,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  ChevronRight,
  BookOpen,
  Building2,
  Target,
} from 'lucide-react';
import { useCareer } from '../../context/CareerContext';
import { useNavigation } from '../../context/NavigationContext';
import { CareerRoleCategory } from '../../types/career';
import { ResumeBulletImproverModal } from './ResumeBulletImproverModal';
import { ProjectExplanationStudioModal } from './ProjectExplanationStudioModal';
import { TechnicalExplanationModal } from './TechnicalExplanationModal';
import { InterviewSimulatorModal } from './InterviewSimulatorModal';
import { CareerPhraseBankModal } from './CareerPhraseBankModal';
import { CareerPortfolioModal } from './CareerPortfolioModal';
import { SelfIntroductionModal } from './SelfIntroductionModal';
import { GroupDiscussionModal } from './GroupDiscussionModal';
import { CareerIntelligenceDashboard } from '../careerIntelligence/CareerIntelligenceDashboard';
import { WorkplaceMasteryDashboard } from '../workplaceMastery/WorkplaceMasteryDashboard';

const ROLE_OPTIONS: Array<{ id: CareerRoleCategory; label: string }> = [
  { id: 'software_developer', label: 'Software Engineer / Full Stack' },
  { id: 'frontend_developer', label: 'Frontend Developer' },
  { id: 'backend_developer', label: 'Backend / Systems Engineer' },
  { id: 'data_analyst', label: 'Data Analyst / Scientist' },
  { id: 'product_manager', label: 'Product Manager' },
  { id: 'qa_engineer', label: 'QA / Automation Engineer' },
  { id: 'student_fresher', label: 'Graduate / Fresher' },
  { id: 'general_professional', label: 'General Tech Professional' },
];

export const CareerHubView: React.FC = () => {
  const {
    activeJobRole,
    setActiveJobRole,
    portfolioItems,
    interviewHistory,
    resumeBulletRefinements,
    savedProjects,
  } = useCareer();
  const { navigate } = useNavigation();

  // Modals state
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [isBulletOpen, setIsBulletOpen] = useState(false);
  const [isProjectOpen, setIsProjectOpen] = useState(false);
  const [isTechOpen, setIsTechOpen] = useState(false);
  const [isInterviewOpen, setIsInterviewOpen] = useState(false);
  const [isPhrasesOpen, setIsPhrasesOpen] = useState(false);
  const [isGdOpen, setIsGdOpen] = useState(false);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'workplace' | 'intelligence' | 'studios'>('workplace');

  const careerModules = [
    {
      id: 'intro',
      title: 'Self-Introduction & "Tell Me About Yourself"',
      desc: 'Master 15s elevator pitches, 60s interview openers, and archetype scripts for freshers, engineers, and career switchers.',
      icon: UserCheck,
      color: 'text-primary bg-primary/10',
      badge: 'Core Foundation',
      action: () => setIsIntroOpen(true),
    },
    {
      id: 'bullets',
      title: 'Resume Bullet Point Refiner',
      desc: 'Transform passive duties into strong, metric-ready accomplishment statements without fabricating fake achievements.',
      icon: FileText,
      color: 'text-amber-500 bg-amber-500/10',
      badge: 'Job Applications',
      action: () => setIsBulletOpen(true),
    },
    {
      id: 'project',
      title: '"Explain My Project" Studio',
      desc: 'Structure architecture choices, technical challenges, debugging stories, and generate tailored interview follow-ups.',
      icon: Code2,
      color: 'text-indigo-500 bg-indigo-500/10',
      badge: 'Technical Interviews',
      action: () => setIsProjectOpen(true),
    },
    {
      id: 'technical_levels',
      title: '5-Level Technical Concept Explanations',
      desc: 'Adapt technical concepts from Child (ELI5) to Non-Technical Stakeholder, Junior Developer, Interviewer, and Principal Architect.',
      icon: Layers,
      color: 'text-purple-500 bg-purple-500/10',
      badge: 'Communication Depth',
      action: () => setIsTechOpen(true),
    },
    {
      id: 'interview_sim',
      title: 'AI Mock Interview Simulator',
      desc: 'Practice multi-turn HR, STAR Behavioral, and Technical interviews with real-time feedback, tone analysis, and model formulations.',
      icon: Briefcase,
      color: 'text-emerald-500 bg-emerald-500/10',
      badge: 'Live Simulation',
      action: () => setIsInterviewOpen(true),
    },
    {
      id: 'phrases',
      title: 'Workplace & Interview Phrase Bank',
      desc: 'High-impact phrasing for standups, respectful disagreement, executive updates, and reverse-interview questions.',
      icon: MessageSquare,
      color: 'text-sky-500 bg-sky-500/10',
      badge: 'Daily Fluency',
      action: () => setIsPhrasesOpen(true),
    },
    {
      id: 'gd',
      title: 'Meeting & Group Discussion Simulator',
      desc: 'Practice polite interruptions, consensus-building, and balanced argumentation in multi-stakeholder meetings.',
      icon: Users,
      color: 'text-rose-500 bg-rose-500/10',
      badge: 'Collaborative Skills',
      action: () => setIsGdOpen(true),
    },
    {
      id: 'portfolio',
      title: 'Private Career Portfolio Vault',
      desc: 'Review and export all your saved self-introductions, polished resume bullets, project explanations, and interview debriefs.',
      icon: FolderOpen,
      color: 'text-amber-600 bg-amber-600/10',
      badge: `${portfolioItems.length} Assets`,
      action: () => setIsPortfolioOpen(true),
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-12">
      {/* Top Level Section Switcher */}
      <div className="flex items-center gap-2 p-1.5 bg-card border border-border rounded-2xl w-fit overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('workplace')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'workplace'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-text-muted hover:text-text'
          }`}
        >
          <Building2 size={14} />
          <span>🏢 Workplace Mastery & Growth (Part 21)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('intelligence')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'intelligence'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-text-muted hover:text-text'
          }`}
        >
          <Target size={14} />
          <span>🎯 Career Intelligence & Journey (Part 20)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('studios')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'studios'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-text-muted hover:text-text'
          }`}
        >
          <Briefcase size={14} />
          <span>💼 Practice Studios & Interview Simulator (Part 17)</span>
        </button>
      </div>

      {activeTab === 'workplace' ? (
        <WorkplaceMasteryDashboard />
      ) : activeTab === 'intelligence' ? (
        <CareerIntelligenceDashboard />
      ) : (
        <>
          {/* Hero Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-primary/15 via-amber-500/10 to-card border border-primary/20 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-primary/20 text-primary font-bold text-xs uppercase tracking-wider">
                💼 Career English & Job Readiness
              </span>
              <span className="text-xs text-text-muted">Part 17 Integrated</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-text tracking-tight">
              Master Professional Workplace English
            </h1>
            <p className="text-xs sm:text-sm text-text-muted max-w-2xl leading-relaxed">
              From introducing yourself with poise to explaining distributed architectures, passing behavioral interviews,
              and contributing confidently in high-stakes meetings.
            </p>
          </div>

          {/* Role Selector Dropdown */}
          <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1.5 shrink-0">
            <label className="text-[10px] font-black uppercase tracking-wider text-text-muted block">
              Target Career Role
            </label>
            <select
              value={activeJobRole}
              onChange={(e) => setActiveJobRole(e.target.value as CareerRoleCategory)}
              className="px-3 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-text focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary cursor-pointer"
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Readiness Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-border/60">
          <div className="p-3.5 rounded-2xl bg-card/80 border border-border space-y-1">
            <span className="text-[10px] font-bold text-text-muted uppercase">Mock Interviews</span>
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-lg text-text">{interviewHistory.length}</span>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                STAR Ready
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-card/80 border border-border space-y-1">
            <span className="text-[10px] font-bold text-text-muted uppercase">Bullets Refined</span>
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-lg text-text">
                {resumeBulletRefinements.length}
              </span>
              <span className="text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                Impact Tuned
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-card/80 border border-border space-y-1">
            <span className="text-[10px] font-bold text-text-muted uppercase">Saved Projects</span>
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-lg text-text">{savedProjects.length}</span>
              <span className="text-[10px] font-semibold text-indigo-500 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                Deep Dive
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-card/80 border border-border space-y-1">
            <span className="text-[10px] font-bold text-text-muted uppercase">Portfolio Assets</span>
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-lg text-text">{portfolioItems.length}</span>
              <span className="text-[10px] font-semibold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">
                Private Vault
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Quick Challenge Bar */}
      <div className="p-5 rounded-3xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black text-text">Today's Fast Sprint: 60-Second Elevator Pitch</h3>
            <p className="text-xs text-text-muted">
              Polish and record your 60-second introduction for {activeJobRole.replace('_', ' ')}.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsIntroOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-2 hover:opacity-90 transition-opacity self-start sm:self-auto shadow-xs"
        >
          <Play size={14} />
          <span>Launch Sprint (2 min)</span>
        </button>
      </div>

      {/* Part 18: Advanced Workplace & Leadership Spotlight Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-primary/10 via-secondary/10 to-indigo-500/10 border-2 border-primary/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-sm mt-0.5">
            <Building2 size={24} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-primary/20 text-primary px-2.5 py-0.5 rounded-full">
                Advanced Stage • Part 18
              </span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                7 Progression Levels
              </span>
            </div>
            <h3 className="text-base font-black text-text">
              Advanced Workplace, Business & Leadership Mastery
            </h3>
            <p className="text-xs text-text-muted max-w-xl leading-relaxed">
              Communicate like an experienced senior leader: Say It to Different People, Manager Syncs, 6-Step Conflict Mediation, Executive BLUF Briefings, Principled Negotiation, and Think-on-Your-Feet Drills.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/workplace')}
          className="px-5 py-3 rounded-2xl bg-primary text-primary-foreground font-black text-xs flex items-center gap-2 hover:opacity-95 transition-all shadow-md shrink-0 self-stretch md:self-auto justify-center"
        >
          <span>Launch Workplace Studio</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Main Studio Modules Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-text">Career English Learning & Practice Studios</h2>
          <span className="text-xs text-text-muted">8 Interactive Modules</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {careerModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                className="p-5 rounded-3xl bg-card border border-border hover:border-primary/40 transition-all flex flex-col justify-between gap-4 group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${mod.color}`}>
                      <Icon size={20} />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-surface border border-border text-text-muted uppercase tracking-wider">
                      {mod.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-text group-hover:text-primary transition-colors">
                    {mod.title}
                  </h3>

                  <p className="text-xs text-text-muted leading-relaxed">{mod.desc}</p>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-end">
                  <button
                    type="button"
                    onClick={mod.action}
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
      </>
      )}

      {/* Modals Mounting */}
      <SelfIntroductionModal isOpen={isIntroOpen} onClose={() => setIsIntroOpen(false)} />
      <ResumeBulletImproverModal isOpen={isBulletOpen} onClose={() => setIsBulletOpen(false)} />
      <ProjectExplanationStudioModal isOpen={isProjectOpen} onClose={() => setIsProjectOpen(false)} />
      <TechnicalExplanationModal isOpen={isTechOpen} onClose={() => setIsTechOpen(false)} />
      <InterviewSimulatorModal isOpen={isInterviewOpen} onClose={() => setIsInterviewOpen(false)} />
      <CareerPhraseBankModal isOpen={isPhrasesOpen} onClose={() => setIsPhrasesOpen(false)} />
      <GroupDiscussionModal isOpen={isGdOpen} onClose={() => setIsGdOpen(false)} />
      <CareerPortfolioModal isOpen={isPortfolioOpen} onClose={() => setIsPortfolioOpen(false)} />
    </div>
  );
};
