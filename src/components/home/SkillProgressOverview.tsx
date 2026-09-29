import React from 'react';
import { ProgressRing } from '../common/ProgressRing';
import { useUser } from '../../context/UserContext';
import {
  BookOpen,
  Sparkles,
  Mic,
  Zap,
  Headphones,
  MessageSquare,
  Users2,
  HeartHandshake,
  TrendingUp,
} from 'lucide-react';

export const SkillProgressOverview: React.FC = () => {
  const { skillProgress } = useUser();

  const skills = [
    { key: 'grammar', label: 'Grammar', value: skillProgress.grammar, icon: BookOpen, color: 'text-indigo-500', barColor: 'bg-indigo-500' },
    { key: 'vocabulary', label: 'Vocabulary', value: skillProgress.vocabulary, icon: Sparkles, color: 'text-sky-500', barColor: 'bg-sky-500' },
    { key: 'pronunciation', label: 'Pronunciation', value: skillProgress.pronunciation, icon: Mic, color: 'text-rose-500', barColor: 'bg-rose-500' },
    { key: 'fluency', label: 'Fluency', value: skillProgress.fluency, icon: Zap, color: 'text-amber-500', barColor: 'bg-amber-500' },
    { key: 'listening', label: 'Listening', value: skillProgress.listening, icon: Headphones, color: 'text-emerald-500', barColor: 'bg-emerald-500' },
    { key: 'speaking', label: 'Speaking', value: skillProgress.speaking, icon: MessageSquare, color: 'text-purple-500', barColor: 'bg-purple-500' },
    { key: 'conversation', label: 'Conversation', value: skillProgress.conversation, icon: Users2, color: 'text-teal-500', barColor: 'bg-teal-500' },
    { key: 'confidence', label: 'Confidence', value: skillProgress.confidence, icon: HeartHandshake, color: 'text-pink-500', barColor: 'bg-pink-500' },
  ];

  // Overall average
  const overallScore = Math.round(
    Object.values(skillProgress).reduce((a, b) => a + b, 0) / skills.length
  );

  return (
    <div className="rounded-3xl bg-card border border-border p-6 sm:p-7 mb-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-primary" />
            <h2 className="text-lg sm:text-xl font-black text-text tracking-tight">
              Skill Mastery Progress
            </h2>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Real progress calculated from completed speaking turns, lessons, and mistake reviews
          </p>
        </div>
        <span className="text-[11px] font-bold text-text-muted bg-surface px-2.5 py-1 rounded-full border border-border self-start sm:self-auto">
          Updated in Real-time
        </span>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Central Progress Ring */}
        <div className="flex flex-col items-center shrink-0">
          <ProgressRing progress={overallScore} size={140} strokeWidth={12}>
            <span className="text-3xl font-black text-text tracking-tight">
              {overallScore}%
            </span>
            <span className="text-xs font-bold text-primary mt-0.5">Overall</span>
            <span className="text-[10px] text-text-muted">A1 Foundation</span>
          </ProgressRing>
          <span className="text-xs font-semibold text-text-muted mt-3 text-center">
            Consistent Speaking Growth
          </span>
        </div>

        {/* 8 Skills Grid */}
        <div className="flex-1 w-full grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {skills.map((skill) => {
            const Icon = skill.icon;
            return (
              <div
                key={skill.key}
                className="p-3.5 rounded-2xl bg-surface border border-border hover:border-primary/30 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-1 mb-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Icon size={14} className={skill.color} />
                    <span className="text-xs font-bold text-text truncate">
                      {skill.label}
                    </span>
                  </div>
                  <span className="text-xs font-black text-text shrink-0">
                    {skill.value}%
                  </span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${skill.barColor}`}
                    style={{ width: `${skill.value}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
