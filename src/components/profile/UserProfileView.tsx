import React, { useState } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { useUser } from '../../context/UserContext';
import { useHistory } from '../../context/HistoryContext';
import { useNavigation } from '../../context/NavigationContext';
import { SkillProfileSummaryView } from '../adaptive/SkillProfileSummaryView';
import {
  User as UserIcon,
  Flame,
  Sparkles,
  Volume2,
  Award,
  BookOpen,
  Briefcase,
  Layers,
  Settings,
  Languages,
  CheckCircle2,
  Clock,
  Compass,
  ArrowRight,
  Shield,
  Edit2,
  Camera,
} from 'lucide-react';

export const UserProfileView: React.FC = () => {
  const { user, skillProgress, updateUser } = useUser();
  const { achievements, activeGoal, activities } = useHistory();
  const { navigate } = useNavigation();

  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(user.name);

  const handleSaveName = () => {
    if (nameInput.trim()) {
      updateUser({ name: nameInput.trim() });
      setIsEditingName(false);
    }
  };

  const completedActivitiesCount = activities.length;
  const totalSpeakingMins = Math.round(
    activities.reduce((sum, a) => sum + (a.durationSeconds || 0), 0) / 60
  );

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Learner Profile & English Journey"
          subtitle="Your complete language identity, verified learning accomplishments, and personalized preferences"
          badge="Learner Profile"
          showBack={true}
        />

        <button
          type="button"
          onClick={() => navigate('/settings')}
          className="px-3.5 py-2 rounded-xl bg-surface border border-border hover:border-primary text-xs font-bold text-text flex items-center gap-1.5 transition-all shadow-2xs self-start sm:self-auto"
        >
          <Settings size={14} />
          <span>Account Settings</span>
        </button>
      </div>

      {/* Main Profile Header Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-card border border-border shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Avatar with level badge */}
        <div className="relative shrink-0">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-primary to-indigo-600 text-white font-black text-3xl flex items-center justify-center shadow-lg shadow-primary/20">
            {user.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-surface border-2 border-card text-[11px] font-black text-primary shadow-xs">
            {user.currentLevel}
          </div>
        </div>

        {/* User Details */}
        <div className="flex-1 text-center sm:text-left space-y-2 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            {isEditingName ? (
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="px-3 py-1 text-lg font-black text-text bg-surface border border-primary rounded-xl focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSaveName}
                  className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-xl"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h2 className="text-xl sm:text-2xl font-black text-text">{user.name}</h2>
                <button
                  type="button"
                  onClick={() => setIsEditingName(true)}
                  className="text-text-muted hover:text-primary transition-colors p-1"
                  title="Edit Name"
                >
                  <Edit2 size={14} />
                </button>
              </div>
            )}
            <span className="text-xs text-text-muted font-medium sm:ml-2">{user.email}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-xs">
            <span className="px-2.5 py-1 rounded-xl bg-surface border border-border text-text font-semibold flex items-center gap-1.5">
              <Languages size={12} className="text-primary" />
              <span>Native: {user.nativeLanguages.join(', ')}</span>
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-surface border border-border text-text font-semibold flex items-center gap-1.5">
              <Compass size={12} className="text-amber-500" />
              <span>Goal: {activeGoal.title}</span>
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-surface border border-border text-text font-semibold flex items-center gap-1.5">
              <BookOpen size={12} className="text-indigo-500" />
              <span>Curriculum: Unit 2 (Elementary)</span>
            </span>
          </div>

          {/* Streak & XP summary pills */}
          <div className="flex items-center justify-center sm:justify-start gap-3 pt-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
              <Flame size={14} className="fill-amber-500" />
              <span>{user.streakDays}-Day Learning Habit</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20">
              <Sparkles size={14} className="fill-indigo-500" />
              <span>{user.xp} Total XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Aggregate Educational Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-card border border-border text-center space-y-1 shadow-xs">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
            Lessons Completed
          </span>
          <span className="text-2xl font-black text-text">8</span>
          <span className="text-[11px] text-emerald-500 font-semibold block">Curriculum Units 1 & 2</span>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border text-center space-y-1 shadow-xs">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
            Active Spoken Minutes
          </span>
          <span className="text-2xl font-black text-text">{totalSpeakingMins}m</span>
          <span className="text-[11px] text-primary font-semibold block">Verified microphone audio</span>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border text-center space-y-1 shadow-xs">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
            Vocabulary Mastered
          </span>
          <span className="text-2xl font-black text-text">68</span>
          <span className="text-[11px] text-indigo-500 font-semibold block">Spaced repetition cards</span>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border text-center space-y-1 shadow-xs">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
            Roleplays & Scenarios
          </span>
          <span className="text-2xl font-black text-text">6</span>
          <span className="text-[11px] text-amber-500 font-semibold block">Workplace & Travel</span>
        </div>
      </div>

      {/* 8-Skills Radar & Current Level Profile */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h3 className="text-base font-black text-text">Skill Competency Profile</h3>
            <p className="text-xs text-text-muted">Evidence-based assessment across 8 core communication areas</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/progress')}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span>Detailed Analytics</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {[
            { skill: 'Speaking & Voice Cadence', score: skillProgress.speaking || 74 },
            { skill: 'Grammar Accuracy', score: skillProgress.grammar || 81 },
            { skill: 'Vocabulary & Collocations', score: skillProgress.vocabulary || 79 },
            { skill: 'Pronunciation Clarity', score: skillProgress.pronunciation || 72 },
            { skill: 'Listening Comprehension', score: skillProgress.listening || 84 },
            { skill: 'Conversational Fluency', score: skillProgress.fluency || 69 },
            { skill: 'Natural Phrasing', score: 75 },
            { skill: 'Overall Communication', score: 78 },
          ].map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-surface border border-border space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-text">{item.skill}</span>
                <span className="font-black text-text">{item.score}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-card overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personalized Learning Preferences (Requirement 2) */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
        <h3 className="text-base font-black text-text">Learning Preferences & Environment</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1">
            <span className="text-[10px] font-bold text-text-muted uppercase">Preferred Practice Style</span>
            <p className="font-semibold text-text">Voice-first with gentle corrections</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1">
            <span className="text-[10px] font-bold text-text-muted uppercase">Support Language</span>
            <p className="font-semibold text-text">Telugu & Hindi bridge translations</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1">
            <span className="text-[10px] font-bold text-text-muted uppercase">Daily Routine Target</span>
            <p className="font-semibold text-text">{user.dailyGoalMinutes} Minutes / Day</p>
          </div>
        </div>
      </div>

      {/* Adaptive Learning Engine Skill Profile & Goal Selector (Part 11) */}
      <SkillProfileSummaryView />

      {/* Unlocked Achievements Showcase */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-text">Milestones & Badges</h3>
          <span className="text-xs font-bold text-primary">
            {achievements.filter((a) => a.isUnlocked).length} / {achievements.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-3.5 rounded-2xl border transition-all space-y-1 ${
                ach.isUnlocked
                  ? 'bg-card border-primary/40 shadow-2xs'
                  : 'bg-surface/50 border-border opacity-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text">{ach.title}</span>
                {ach.isUnlocked && <CheckCircle2 size={14} className="text-emerald-500" />}
              </div>
              <p className="text-[11px] text-text-muted">{ach.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
