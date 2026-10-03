import React from 'react';
import {
  Volume2,
  BookOpen,
  Edit3,
  Mic,
  ArrowRight,
  TrendingUp,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useCommunicationSkills } from '../../context/CommunicationSkillsContext';
import { useNavigation } from '../../context/NavigationContext';

export const CommunicationDashboardCard: React.FC = () => {
  const { communicationSkillSummary } = useCommunicationSkills();
  const { navigate } = useNavigation();

  const skills = [
    { name: 'Speaking', score: communicationSkillSummary.speaking, icon: Mic, color: 'text-primary bg-primary/10' },
    { name: 'Listening', score: communicationSkillSummary.listening, icon: Volume2, color: 'text-indigo-500 bg-indigo-500/10' },
    { name: 'Reading', score: communicationSkillSummary.reading, icon: BookOpen, color: 'text-emerald-500 bg-emerald-500/10' },
    { name: 'Writing', score: communicationSkillSummary.writing, icon: Edit3, color: 'text-amber-500 bg-amber-500/10' },
  ];

  return (
    <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Layers size={16} />
          </div>
          <div>
            <h3 className="text-base font-black text-text">Core Communication Skills</h3>
            <p className="text-xs text-text-muted">Multimodal learning evidence across all four linguistic pillars</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/communication')}
          className="text-xs font-bold text-primary hover:underline flex items-center gap-1 self-start sm:self-auto"
        >
          <span>Open Communication Hub</span>
          <ArrowRight size={13} />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {skills.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.name} className="p-3.5 rounded-2xl bg-surface border border-border space-y-2">
              <div className="flex items-center justify-between">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${s.color}`}>
                  <Icon size={14} />
                </div>
                <span className="font-mono font-black text-xs text-text">{s.score}%</span>
              </div>
              <span className="text-xs font-bold text-text block">{s.name}</span>
              <div className="w-full bg-card h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500"
                  style={{ width: `${s.score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
