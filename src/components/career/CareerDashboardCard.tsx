import React from 'react';
import {
  Briefcase,
  ArrowRight,
  Sparkles,
  FileText,
  UserCheck,
  TrendingUp,
  Layers,
  Award,
} from 'lucide-react';
import { useCareer } from '../../context/CareerContext';
import { useNavigation } from '../../context/NavigationContext';

export const CareerDashboardCard: React.FC = () => {
  const {
    activeJobRole,
    portfolioItems,
    interviewHistory,
    resumeBulletRefinements,
  } = useCareer();
  const { navigate } = useNavigation();

  const roleFormatted = activeJobRole.replace('_', ' ');

  return (
    <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Briefcase size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-text">Career English & Job Readiness</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary uppercase">
                {roleFormatted}
              </span>
            </div>
            <p className="text-xs text-text-muted">
              Professional self-introductions, resume bullets, project explanations, and AI mock interviews
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/career')}
          className="text-xs font-bold text-primary hover:underline flex items-center gap-1 self-start sm:self-auto"
        >
          <span>Open Career Hub</span>
          <ArrowRight size={13} />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-primary bg-primary/10">
              <UserCheck size={14} />
            </div>
            <span className="font-mono font-black text-xs text-text">
              {interviewHistory.length}
            </span>
          </div>
          <span className="text-xs font-bold text-text block">Interviews Taken</span>
          <span className="text-[10px] text-text-muted block">STAR practice sessions</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-amber-500 bg-amber-500/10">
              <FileText size={14} />
            </div>
            <span className="font-mono font-black text-xs text-text">
              {resumeBulletRefinements.length}
            </span>
          </div>
          <span className="text-xs font-bold text-text block">Bullets Refined</span>
          <span className="text-[10px] text-text-muted block">Impact & metric statements</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-emerald-500 bg-emerald-500/10">
              <Award size={14} />
            </div>
            <span className="font-mono font-black text-xs text-text">
              {portfolioItems.length}
            </span>
          </div>
          <span className="text-xs font-bold text-text block">Portfolio Assets</span>
          <span className="text-[10px] text-text-muted block">Vault items saved</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-indigo-500 bg-indigo-500/10">
              <TrendingUp size={14} />
            </div>
            <span className="font-mono font-black text-xs text-text">86%</span>
          </div>
          <span className="text-xs font-bold text-text block">Readiness Index</span>
          <span className="text-[10px] text-text-muted block">Executive communication</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <span className="text-xs text-text-muted">
          Active track: Mastering 60-second introductions and technical project explanations
        </span>
        <button
          type="button"
          onClick={() => navigate('/career')}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 hover:opacity-90 transition-opacity shadow-xs"
        >
          <Sparkles size={13} />
          <span>Launch AI Interview Simulator</span>
        </button>
      </div>
    </div>
  );
};
