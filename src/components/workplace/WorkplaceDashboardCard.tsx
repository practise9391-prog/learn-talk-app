import React from 'react';
import {
  Building2,
  ArrowRight,
  Sparkles,
  Users,
  ShieldAlert,
  Zap,
  Award,
  Briefcase,
} from 'lucide-react';
import { useWorkplaceCommunication } from '../../context/WorkplaceCommunicationContext';
import { useNavigation } from '../../context/NavigationContext';

export const WorkplaceDashboardCard: React.FC = () => {
  const { activeLevel, roadmapLevels, completedDrillCount } = useWorkplaceCommunication();
  const { navigate } = useNavigation();

  const currentLevelObj = roadmapLevels.find((lvl) => lvl.level === activeLevel) || roadmapLevels[0];

  return (
    <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Building2 size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-text">Workplace & Leadership Mastery</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 uppercase">
                Level {currentLevelObj.level}: {currentLevelObj.title}
              </span>
            </div>
            <p className="text-xs text-text-muted">
              Audience-aware framing, manager syncs, 6-step mediation, BLUF executive updates, and negotiation
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/workplace')}
          className="text-xs font-bold text-primary hover:underline flex items-center gap-1 self-start sm:self-auto"
        >
          <span>Open Workplace Hub</span>
          <ArrowRight size={13} />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-primary bg-primary/10">
              <Users size={14} />
            </div>
            <span className="font-mono font-black text-xs text-text">5 Personas</span>
          </div>
          <span className="text-xs font-bold text-text block">Audience Adaptation</span>
          <span className="text-[10px] text-text-muted block">Teammate to Architect</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-amber-500 bg-amber-500/10">
              <Briefcase size={14} />
            </div>
            <span className="font-mono font-black text-xs text-text">3 Archetypes</span>
          </div>
          <span className="text-xs font-bold text-text block">Manager Syncs</span>
          <span className="text-[10px] text-text-muted block">Direct & solution-focused</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-indigo-500 bg-indigo-500/10">
              <ShieldAlert size={14} />
            </div>
            <span className="font-mono font-black text-xs text-text">6 Steps</span>
          </div>
          <span className="text-xs font-bold text-text block">Conflict Mediation</span>
          <span className="text-[10px] text-text-muted block">Diplomatic disagreement</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-emerald-500 bg-emerald-500/10">
              <Zap size={14} />
            </div>
            <span className="font-mono font-black text-xs text-text">
              {completedDrillCount}
            </span>
          </div>
          <span className="text-xs font-bold text-text block">Drills Completed</span>
          <span className="text-[10px] text-text-muted block">Real-time mastery exercises</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <span className="text-xs text-text-muted">
          Active Focus: {currentLevelObj.focusArea}
        </span>
        <button
          type="button"
          onClick={() => navigate('/workplace')}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 hover:opacity-90 transition-opacity shadow-xs"
        >
          <Sparkles size={13} />
          <span>Launch Workplace Studio</span>
        </button>
      </div>
    </div>
  );
};
