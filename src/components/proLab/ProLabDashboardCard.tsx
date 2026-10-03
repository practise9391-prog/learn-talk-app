import React from 'react';
import {
  FlaskConical,
  ArrowRight,
  Clock,
  Sparkles,
  Award,
  CheckCircle2,
  Building2,
  Mail,
} from 'lucide-react';
import { useProLab } from '../../context/ProLabContext';
import { useNavigation } from '../../context/NavigationContext';

export const ProLabDashboardCard: React.FC = () => {
  const {
    activeRole,
    activeOrg,
    completedLabCount,
    readinessScores,
    currentStageIndex,
    activeWorkday,
  } = useProLab();
  const { navigate } = useNavigation();

  const averageReadiness = Math.round(
    readinessScores.reduce((acc, c) => acc + c.score, 0) / readinessScores.length
  );

  return (
    <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <FlaskConical size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-text">Professional English Lab</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary uppercase">
                {activeRole.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-text-muted">
              End-to-end workday simulation, multi-turn email threads, war-room chats, and crisis communication
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/pro-lab')}
          className="text-xs font-bold text-primary hover:underline flex items-center gap-1 self-start sm:self-auto"
        >
          <span>Open Simulation Lab</span>
          <ArrowRight size={13} />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-primary bg-primary/10">
              <Clock size={14} />
            </div>
            <span className="font-mono font-black text-xs text-text">
              Stage {currentStageIndex + 1}/6
            </span>
          </div>
          <span className="text-xs font-bold text-text block">Workday Progress</span>
          <span className="text-[10px] text-text-muted block">
            Next: {activeWorkday.stages[currentStageIndex]?.timeSlot || 'Done'}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-amber-500 bg-amber-500/10">
              <Award size={14} />
            </div>
            <span className="font-mono font-black text-xs text-text">{averageReadiness}%</span>
          </div>
          <span className="text-xs font-bold text-text block">Readiness Radar</span>
          <span className="text-[10px] text-text-muted block">10 core competencies</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-emerald-500 bg-emerald-500/10">
              <CheckCircle2 size={14} />
            </div>
            <span className="font-mono font-black text-xs text-text">{completedLabCount}</span>
          </div>
          <span className="text-xs font-bold text-text block">Simulations Run</span>
          <span className="text-[10px] text-text-muted block">Real-world scenarios</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-indigo-500 bg-indigo-500/10">
              <Building2 size={14} />
            </div>
            <span className="font-mono font-black text-xs text-text truncate max-w-[80px]">
              {activeOrg.name.split(' ')[0]}
            </span>
          </div>
          <span className="text-xs font-bold text-text block">Org Context</span>
          <span className="text-[10px] text-text-muted block">Persistent state</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <span className="text-xs text-text-muted">
          Active Environment: {activeOrg.name} — {activeOrg.department}
        </span>
        <button
          type="button"
          onClick={() => navigate('/pro-lab')}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 hover:opacity-90 transition-opacity shadow-xs"
        >
          <Sparkles size={13} />
          <span>Launch Professional Lab</span>
        </button>
      </div>
    </div>
  );
};
