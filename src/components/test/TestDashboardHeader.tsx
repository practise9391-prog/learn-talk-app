import React from 'react';
import { useUser } from '../../context/UserContext';
import { useTest } from '../../context/TestContext';
import { Award, Compass, FileText, Info, Sparkles, TrendingUp, Zap, HelpCircle } from 'lucide-react';

interface TestDashboardHeaderProps {
  onOpenReport: () => void;
  onStartPlacement: () => void;
}

export const TestDashboardHeader: React.FC<TestDashboardHeaderProps> = ({
  onOpenReport,
  onStartPlacement
}) => {
  const { user, skillProgress } = useUser();
  const { attempts } = useTest();

  // Calculate composite metrics based on latest tests or baseline skill progress
  const latestAttempt = attempts[0];
  const speakingScore = latestAttempt?.scores.speaking ?? skillProgress.speaking ?? 74;
  const grammarScore = latestAttempt?.scores.grammar ?? skillProgress.grammar ?? 81;
  const vocabScore = latestAttempt?.scores.vocabulary ?? skillProgress.vocabulary ?? 79;
  const pronScore = latestAttempt?.scores.pronunciation ?? skillProgress.pronunciation ?? 72;
  const listeningScore = latestAttempt?.scores.listening ?? skillProgress.listening ?? 84;
  const fluencyScore = latestAttempt?.scores.fluency ?? skillProgress.fluency ?? 69;

  const overallComm = Math.round(
    (speakingScore * 1.4 + grammarScore + vocabScore + pronScore + listeningScore + fluencyScore * 1.2) / 6.6
  );

  const levelNameMap: Record<string, string> = {
    A1: 'Beginner',
    A2: 'Elementary',
    B1: 'Intermediate',
    B2: 'Upper Intermediate',
    C1: 'Advanced',
    C2: 'Proficient Mastery'
  };

  const currentLevelLabel = levelNameMap[user.currentLevel] || 'Intermediate';

  return (
    <div className="rounded-3xl bg-card border border-border p-6 sm:p-7 shadow-xs relative overflow-hidden">
      {/* Background soft glow accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider">
              Diagnostic Standing
            </span>
            <span className="text-xs text-text-muted flex items-center gap-1 font-semibold">
              <Sparkles size={13} className="text-amber-500" />
              Dynamic Task Metrics
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-text tracking-tight">
            Your Assessment Dashboard
          </h2>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-semibold text-text-muted">Current Verified Level:</span>
            <span className="text-sm font-black text-primary px-2.5 py-0.5 rounded-lg bg-primary/10 border border-primary/20">
              {user.currentLevel} — {currentLevelLabel}
            </span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={onStartPlacement}
            className="px-4 py-2.5 rounded-xl bg-surface hover:bg-surface-hover text-text font-bold text-xs border border-border transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Compass size={14} className="text-primary" />
            <span>Find My Level</span>
          </button>

          <button
            type="button"
            onClick={onOpenReport}
            className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover transition-all flex items-center gap-1.5 shadow-sm"
          >
            <FileText size={14} />
            <span>My English Report</span>
          </button>
        </div>
      </div>

      {/* Transparent Disclaimer Banner (Requirement 2 & 51) */}
      <div className="my-4 p-3 rounded-xl bg-surface/70 border border-border/80 flex items-start gap-2.5 text-xs text-text-muted">
        <Info size={16} className="text-primary shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-text font-bold">Practice metric note:</strong> These numbers are
          application-generated practice metrics based on your observed speaking and quiz tasks. They represent
          performance in these specific exercises, rather than an absolute measurement of overall human language ability.
        </p>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-2">
        {/* Overall Communication Primary Card */}
        <div className="col-span-2 sm:col-span-4 lg:col-span-1 p-4 rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-surface border border-primary/30 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
              Overall
            </span>
            <span className="text-xs font-bold text-text mt-0.5 block">Communication</span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-primary tracking-tight">{overallComm}%</span>
            <span className="text-[10px] text-text-muted block mt-0.5">Weighted Index</span>
          </div>
        </div>

        {/* 6 Sub-skills */}
        {[
          { label: 'Speaking', val: speakingScore, color: 'text-indigo-500', bar: 'bg-indigo-500' },
          { label: 'Grammar', val: grammarScore, color: 'text-sky-500', bar: 'bg-sky-500' },
          { label: 'Vocabulary', val: vocabScore, color: 'text-purple-500', bar: 'bg-purple-500' },
          { label: 'Pronunciation', val: pronScore, color: 'text-rose-500', bar: 'bg-rose-500' },
          { label: 'Listening', val: listeningScore, color: 'text-emerald-500', bar: 'bg-emerald-500' },
          { label: 'Fluency', val: fluencyScore, color: 'text-amber-500', bar: 'bg-amber-500' }
        ].map((item) => (
          <div
            key={item.label}
            className="p-3.5 rounded-2xl bg-surface border border-border/80 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-bold text-text-muted">{item.label}</span>
              <span className={`text-base font-black ${item.color}`}>{item.val}%</span>
            </div>

            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
              <div
                className={`h-full rounded-full transition-all duration-700 ${item.bar}`}
                style={{ width: `${item.val}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
