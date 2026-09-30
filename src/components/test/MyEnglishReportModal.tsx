import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { useTest } from '../../context/TestContext';
import { useNavigation } from '../../context/NavigationContext';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Flame,
  LineChart,
  Mic,
  Sparkles,
  TrendingUp,
  X,
  Zap,
  ArrowRight
} from 'lucide-react';

interface MyEnglishReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPracticeWithJarvis: (prompt: string) => void;
}

export const MyEnglishReportModal: React.FC<MyEnglishReportModalProps> = ({
  isOpen,
  onClose,
  onPracticeWithJarvis
}) => {
  const { user, skillProgress, recordings } = useUser();
  const { attempts, weakAreas } = useTest();
  const { navigate } = useNavigation();

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '3m' | 'all'>('30d');

  if (!isOpen) return null;

  // 10 Detailed Skills Breakdown (Section 31)
  const fullSkills = [
    { name: 'Speaking', val: skillProgress.speaking || 74, color: 'text-indigo-500', bar: 'bg-indigo-500' },
    { name: 'Grammar', val: skillProgress.grammar || 81, color: 'text-sky-500', bar: 'bg-sky-500' },
    { name: 'Vocabulary', val: skillProgress.vocabulary || 79, color: 'text-purple-500', bar: 'bg-purple-500' },
    { name: 'Pronunciation', val: skillProgress.pronunciation || 72, color: 'text-rose-500', bar: 'bg-rose-500' },
    { name: 'Fluency', val: skillProgress.fluency || 69, color: 'text-amber-500', bar: 'bg-amber-500' },
    { name: 'Listening', val: skillProgress.listening || 84, color: 'text-emerald-500', bar: 'bg-emerald-500' },
    { name: 'Reading', val: 78, color: 'text-teal-500', bar: 'bg-teal-500' },
    { name: 'Writing', val: 70, color: 'text-cyan-500', bar: 'bg-cyan-500' },
    { name: 'Conversation', val: skillProgress.conversation || 75, color: 'text-blue-500', bar: 'bg-blue-500' },
    { name: 'Professional English', val: 71, color: 'text-fuchsia-500', bar: 'bg-fuchsia-500' }
  ];

  // Total speaking time calculated
  const totalSpeakingSeconds = recordings.reduce((acc, r) => acc + (r.durationSeconds || 60), 0);
  const totalSpeakingMinutes = Math.round(totalSpeakingSeconds / 60);

  // Approximate words spoken
  const totalWordsSpoken = recordings.reduce((acc, r) => {
    return acc + (r.transcriptText ? r.transcriptText.split(/\s+/).length : 40);
  }, 0);

  // Time progress sample points (Section 32)
  const progressPoints = [
    { week: 'Week 1', score: 58 },
    { week: 'Week 2', score: 63 },
    { week: 'Week 3', score: 68 },
    { week: 'Week 4', score: 74 },
    { week: 'Current', score: 78 }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-card border border-border w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-border flex items-center justify-between bg-surface/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black">
              <FileText size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                Holistic Competency Diagnostic
              </span>
              <h3 className="text-lg font-black text-text">My English Report</h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
          {/* Executive Overview Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-primary/15 via-secondary/10 to-card border border-border flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                Learner Profile Standings
              </span>
              <h3 className="text-2xl font-black text-text mt-1">
                Level {user.currentLevel} • Intermediate Communicator
              </h3>
              <p className="text-xs text-text-muted mt-1 max-w-xl leading-relaxed">
                You can engage confidently in predictable everyday discussions, express opinions with supporting reasons, and handle service interactions. Active practice targets center on irregular past tenses and pause smoothing.
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="p-3.5 rounded-2xl bg-card border border-border text-center">
                <span className="text-[10px] text-text-muted block uppercase font-bold">Speaking Time</span>
                <strong className="text-base font-black text-primary">{totalSpeakingMinutes} mins</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-card border border-border text-center">
                <span className="text-[10px] text-text-muted block uppercase font-bold">Spoken Words</span>
                <strong className="text-base font-black text-emerald-500">~{totalWordsSpoken}</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-card border border-border text-center">
                <span className="text-[10px] text-text-muted block uppercase font-bold">Tests Done</span>
                <strong className="text-base font-black text-indigo-500">{attempts.length}</strong>
              </div>
            </div>
          </div>

          {/* 10-Skills Detailed Matrix (Section 31) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-text flex items-center gap-1.5">
                <Sparkles size={16} className="text-primary" />
                <span>Comprehensive 10-Skill Competency Profile</span>
              </h4>
              <span className="text-[10px] font-bold text-text-muted uppercase">Continuous Live Index</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {fullSkills.map((sk) => (
                <div
                  key={sk.name}
                  className="p-3 rounded-2xl bg-surface border border-border flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-xs font-bold text-text truncate">{sk.name}</span>
                    <span className={`text-xs font-black ${sk.color}`}>{sk.val}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${sk.bar}`}
                      style={{ width: `${sk.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Over Time Visual Chart (Section 32) */}
          <div className="p-5 rounded-3xl bg-card border border-border space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-black text-text flex items-center gap-1.5">
                  <TrendingUp size={16} className="text-emerald-500" />
                  <span>Speaking Progression Over Time</span>
                </h4>
                <p className="text-xs text-text-muted mt-0.5">
                  Composite speaking score derived from weekly test attempts and conversation turns
                </p>
              </div>

              {/* Time Range Filter Buttons */}
              <div className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-border self-start sm:self-auto">
                {(['7d', '30d', '3m', 'all'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setTimeRange(r)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                      timeRange === r
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'text-text-muted hover:text-text'
                    }`}
                  >
                    {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : r === '3m' ? '3 Months' : 'All Time'}
                  </button>
                ))}
              </div>
            </div>

            {/* Simple Clean Bar Graph Representation */}
            <div className="pt-4 grid grid-cols-5 gap-3 items-end h-40 border-b border-border/80 pb-2">
              {progressPoints.map((pt, i) => (
                <div key={i} className="flex flex-col items-center h-full justify-end group">
                  <span className="text-[10px] font-bold text-primary mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {pt.score}%
                  </span>
                  <div
                    className="w-full max-w-[42px] bg-primary/20 hover:bg-primary rounded-t-xl transition-all duration-500 relative flex items-start justify-center pt-2"
                    style={{ height: `${pt.score}%` }}
                  >
                    <span className="text-[10px] font-black text-text">{pt.score}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-text-muted mt-2">{pt.week}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Weakness Summary */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-text">Active Improvement Targets</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {weakAreas.map((w) => (
                <div
                  key={w.id}
                  className="p-3.5 rounded-2xl bg-surface border border-border flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="text-[10px] font-bold text-rose-500 uppercase block">{w.category}</span>
                    <strong className="text-xs font-bold text-text">{w.topic}</strong>
                    <span className="text-[10px] text-text-muted block mt-0.5">
                      {w.totalMistakes} logged instances across practice
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onPracticeWithJarvis(`Let's practice correcting ${w.topic} in realistic dialogue.`);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-card border border-border text-primary font-bold text-xs hover:bg-primary hover:text-white transition-colors shadow-xs shrink-0"
                  >
                    Practice Drill
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex justify-end bg-surface/50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover transition-colors"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
