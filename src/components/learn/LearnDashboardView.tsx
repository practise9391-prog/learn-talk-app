import React, { useState } from 'react';
import { MASTER_CURRICULUM } from '../../data/curriculumData';
import { CurriculumLevelId, CurriculumUnit } from '../../types/curriculum';
import { VisualLearningPathMap } from './VisualLearningPathMap';
import { SmartRevisionBanner } from './SmartRevisionBanner';
import { useUser } from '../../context/UserContext';
import { useNavigation } from '../../context/NavigationContext';
import {
  BookOpen,
  Headphones,
  Mic,
  Sparkles,
  MessageSquare,
  Clock,
  Play,
  CheckCircle2,
  Lock,
  ArrowRight,
  TrendingUp,
  Flame,
  Award,
  Filter,
  Layers,
  MapPin
} from 'lucide-react';

export const LearnDashboardView: React.FC = () => {
  const { user } = useUser();
  const { navigate } = useNavigation();

  const [activeLevelId, setActiveLevelId] = useState<CurriculumLevelId>('beginner_1');
  const [viewMode, setViewMode] = useState<'units' | 'map'>('units');

  const activeLevel = MASTER_CURRICULUM.find((lvl) => lvl.id === activeLevelId) || MASTER_CURRICULUM[0];

  // Skill-Specific Progress Breakdown (Requirement 3)
  const skillsProgress = [
    { label: 'Speaking', percent: 70, color: 'bg-primary' },
    { label: 'Grammar', percent: 60, color: 'bg-indigo-500' },
    { label: 'Vocabulary', percent: 80, color: 'bg-sky-500' },
    { label: 'Pronunciation', percent: 65, color: 'bg-rose-500' },
    { label: 'Listening', percent: 72, color: 'bg-emerald-500' },
    { label: 'Fluency', percent: 50, color: 'bg-amber-500' },
  ];

  // Today's recommended practice modalities (Requirement 5)
  const todayPractices = [
    { label: 'Listening', emoji: '🎧', desc: 'Native Morning Narrative', action: () => navigate('/learn/lesson/b1-u2-l1') },
    { label: 'Speaking', emoji: '🗣', desc: 'Daily Routine Spoken Drill', action: () => navigate('/learn/lesson/b1-u2-l1') },
    { label: 'Vocabulary', emoji: '📚', desc: 'Commute & Travel Verbs', action: () => navigate('/vocabulary') },
    { label: 'Grammar', emoji: '✍', desc: 'Simple Present vs Past', action: () => navigate('/grammar') },
    { label: 'Conversation', emoji: '💬', desc: 'Alex Coffee Pantry Chat', action: () => navigate('/talk/jarvis') },
  ];

  // Dynamic greeting based on hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Greeting Banner (Requirement 3) */}
      <div className="rounded-3xl bg-gradient-to-r from-primary/15 via-secondary/15 to-card border border-primary/20 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">
              Active Curriculum Level: {activeLevel.label}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-text">
              {getGreeting()}, {user.name} 👋
            </h1>
            <p className="text-xs sm:text-sm text-text-muted mt-1 max-w-xl">
              Continue your English journey: step-by-step listening, speaking, grammar, and spontaneous conversation practice.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto bg-surface p-1 rounded-2xl border border-border">
            <button
              type="button"
              onClick={() => setViewMode('units')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                viewMode === 'units' ? 'bg-primary text-white shadow-xs' : 'text-text-muted hover:text-text'
              }`}
            >
              Curriculum Units
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                viewMode === 'map' ? 'bg-primary text-white shadow-xs' : 'text-text-muted hover:text-text'
              }`}
            >
              Visual Roadmap
            </button>
          </div>
        </div>
      </div>

      {/* Prominent Continue Learning Card (Requirement 4) */}
      <div className="rounded-3xl bg-card border-2 border-primary/40 p-6 sm:p-7 shadow-sm hover:border-primary transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-wider">
                Continue Learning
              </span>
              <span className="text-xs text-text-muted font-medium">
                Beginner Level 1 • Unit 2 (Me and My Day)
              </span>
            </div>
            <h2 className="text-xl font-black text-text">
              Lesson 1: Talking About My Morning Routine
            </h2>
            <p className="text-xs sm:text-sm text-text-muted max-w-xl leading-relaxed">
              Resume right where you stopped: complete your speaking turn and dialogue with Elena.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/learn/lesson/b1-u2-l1')}
            className="px-6 py-3.5 bg-primary text-primary-foreground font-black text-xs sm:text-sm rounded-xl shadow-md shadow-primary/25 hover:bg-primary-hover active:scale-98 transition-all shrink-0 flex items-center justify-center gap-2"
          >
            <Play size={16} fill="currentColor" />
            <span>Continue Lesson</span>
          </button>
        </div>
      </div>

      {/* Skill-Specific Progress Radar / Bars (Requirement 3) */}
      <div className="rounded-3xl bg-card border border-border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-primary" />
            <h3 className="text-base font-black text-text">
              Skill-Specific Proficiency
            </h3>
          </div>
          <span className="text-xs font-semibold text-text-muted">
            Independent Skill Tracking
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {skillsProgress.map((sk) => (
            <div key={sk.label} className="p-3.5 rounded-2xl bg-surface border border-border flex flex-col justify-between">
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-xs font-bold text-text truncate">{sk.label}</span>
                <span className="text-xs font-black text-text">{sk.percent}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${sk.color}`}
                  style={{ width: `${sk.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Recommended Practice Modalities (Requirement 5) */}
      <div className="rounded-3xl bg-card border border-border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-black text-text">Today's Practice</h3>
            <p className="text-xs text-text-muted mt-0.5">
              Targeted exercises based on previous mistakes and active speaking goals
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {todayPractices.map((p) => (
            <div
              key={p.label}
              onClick={p.action}
              className="p-3.5 rounded-2xl bg-surface border border-border hover:border-primary/50 hover:shadow-xs cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">
                  {p.emoji}
                </span>
                <h4 className="text-xs font-bold text-text group-hover:text-primary transition-colors">
                  {p.label}
                </h4>
                <p className="text-[11px] text-text-muted mt-0.5 leading-snug">
                  {p.desc}
                </p>
              </div>
              <span className="text-[10px] font-bold text-primary mt-3 flex items-center gap-0.5">
                <span>Start</span>
                <span>→</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Revision Component */}
      <SmartRevisionBanner />

      {/* View Mode: Map vs Units */}
      {viewMode === 'map' ? (
        <VisualLearningPathMap />
      ) : (
        <>
          {/* Level Selection Tabs (Requirement 2) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {MASTER_CURRICULUM.map((lvl) => {
              const isSelected = lvl.id === activeLevelId;
              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setActiveLevelId(lvl.id)}
                  className={`
                    p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-between
                    ${
                      isSelected
                        ? 'bg-primary text-primary-foreground border-primary shadow-sm scale-102 font-bold'
                        : 'bg-card text-text border-border hover:bg-surface'
                    }
                  `}
                >
                  <span className="text-sm font-black tracking-tight">{lvl.label}</span>
                  <span className={`text-[10px] truncate ${isSelected ? 'text-white/80' : 'text-text-muted'}`}>
                    {lvl.proficiencyName}
                  </span>
                  <span className="text-[10px] mt-1 font-bold">
                    {lvl.units.length} Units
                  </span>
                </button>
              );
            })}
          </div>

          {/* Level Outcome Summary */}
          <div className="p-5 rounded-2xl bg-surface border border-border flex items-start gap-3">
            <Award className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-text uppercase tracking-wider">
                {activeLevel.label} Competency Target:
              </h4>
              <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                "{activeLevel.competencyOutcome}"
              </p>
            </div>
          </div>

          {/* Units Stream */}
          <div className="space-y-4">
            {activeLevel.units.map((unit) => (
              <div
                key={unit.id}
                className="rounded-3xl bg-card border border-border p-5 sm:p-6 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-2xl shrink-0 shadow-xs">
                      {unit.icon}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                        Unit {unit.unitNumber}
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-text">
                        {unit.title}
                      </h3>
                      <p className="text-xs text-text-muted font-medium">
                        {unit.subtitle}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-text-muted self-start sm:self-auto">
                    {unit.lessons.length} {unit.lessons.length === 1 ? 'Lesson' : 'Lessons'}
                  </span>
                </div>

                <p className="text-xs text-text-muted mb-4 leading-relaxed">
                  {unit.description}
                </p>

                {/* Lesson List */}
                <div className="space-y-2.5">
                  {unit.lessons.length > 0 ? (
                    unit.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        onClick={() => navigate(`/learn/lesson/${lesson.id}`)}
                        className="p-4 rounded-2xl bg-surface border border-border hover:border-primary/50 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-4 group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center text-xs font-bold shrink-0 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                            {lesson.status === 'completed' ? (
                              <CheckCircle2 size={16} className="text-emerald-500" />
                            ) : (
                              <Play size={13} fill="currentColor" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold text-text truncate group-hover:text-primary transition-colors">
                              {lesson.title}
                            </h4>
                            <p className="text-[11px] text-text-muted truncate mt-0.5">
                              {lesson.conceptSummary}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] font-semibold text-text-muted flex items-center gap-1">
                            <Clock size={11} />
                            {lesson.estimatedMinutes}m
                          </span>
                          <ArrowRight size={14} className="text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-xl bg-surface border border-border/70 text-center text-xs text-text-muted">
                      Full unit lessons unlocking upon completing foundational units.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
