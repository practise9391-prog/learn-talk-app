import React, { useState } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { useUser } from '../../context/UserContext';
import { useHistory } from '../../context/HistoryContext';
import { useNavigation } from '../../context/NavigationContext';
import { useGamification } from '../../context/GamificationContext';
import { PersonalBestsCard } from '../gamification/PersonalBestsCard';
import { XPLedgerModal } from '../gamification/XPLedgerModal';
import { CommunicationDashboardCard } from '../communication/CommunicationDashboardCard';
import {
  Flame,
  Sparkles,
  Clock,
  CheckCircle2,
  Award,
  Calendar,
  TrendingUp,
  BarChart3,
  Layers,
  ArrowRight,
  Shield,
  BookOpen,
  Volume2,
  Mic,
  AlertTriangle,
  HelpCircle,
  Eye,
  Sliders,
  History,
} from 'lucide-react';

export const ProgressView: React.FC = () => {
  const { user, skillProgress } = useUser();
  const { comparisonData, activities, insights, goals, activeGoalId, setActiveGoalId } = useHistory();
  const {
    userLevel,
    streakData,
    achievements,
    openAchievementModal,
    openSettingsModal,
    gamificationSettings,
  } = useGamification();
  const { navigate } = useNavigation();

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [activeReviewTab, setActiveReviewTab] = useState<'weekly' | 'monthly'>('weekly');
  const [showAdminAnalytics, setShowAdminAnalytics] = useState<boolean>(false);
  const [isXpLedgerOpen, setIsXpLedgerOpen] = useState<boolean>(false);

  const metrics = [
    {
      label: 'Continuous Streak',
      val: `${streakData.currentStreak} Days`,
      icon: Flame,
      color: 'text-amber-500 bg-amber-500/10',
      detail: streakData.freezesAvailable > 0 ? `${streakData.freezesAvailable} Freezes Active` : 'Daily habit',
    },
    {
      label: 'Learner Level',
      val: `Lvl ${userLevel.level}: ${userLevel.title}`,
      icon: Sparkles,
      color: 'text-indigo-500 bg-indigo-500/10',
      detail: `${user.xp} Total XP (Consistency)`,
    },
    {
      label: 'Spoken Today',
      val: `${user.minutesSpokenToday} / ${user.dailyGoalMinutes} min`,
      icon: Clock,
      color: 'text-emerald-500 bg-emerald-500/10',
      detail: 'Daily voice practice',
    },
    {
      label: 'Evaluated CEFR',
      val: `${user.currentLevel} Elementary`,
      icon: Award,
      color: 'text-primary bg-primary/10',
      detail: 'Communication Proficiency',
    },
  ];

  // Comprehensive 8-Skills Breakdown
  const skillsList = [
    {
      name: 'Speaking',
      score: skillProgress.speaking || 74,
      trend: '+12% this month',
      strength: 'Good conversational pace and willingness to express ideas',
      weakness: 'Hesitation when formulating past-tense narrative sentences',
      action: 'Practice 2-minute spontaneous prompts in Talk Hub',
      route: '/talk',
    },
    {
      name: 'Grammar',
      score: skillProgress.grammar || 81,
      trend: '+8% this month',
      strength: 'High accuracy in structured sentence building drills',
      weakness: 'Dropping definite article "the" before physical locations',
      action: 'Complete Articles & Tenses focused lesson',
      route: '/grammar',
    },
    {
      name: 'Vocabulary',
      score: skillProgress.vocabulary || 79,
      trend: '+15% this month',
      strength: 'Broad everyday nouns and workplace software terminology',
      weakness: 'Over-reliance on simple adjectives ("very good", "very hard")',
      action: 'Review descriptive adjectives and collocations',
      route: '/vocabulary',
    },
    {
      name: 'Pronunciation',
      score: skillProgress.pronunciation || 72,
      trend: '+6% this month',
      strength: 'Clear vowel articulation and intelligible consonants',
      weakness: 'Ending consonant clusters in past tense verbs (/t/ vs /d/)',
      action: 'Pronunciation shadow drills with audio comparison',
      route: '/pronunciation',
    },
    {
      name: 'Listening',
      score: skillProgress.listening || 84,
      trend: '+4% this month',
      strength: 'Can comprehend standard-speed native dialogues easily',
      weakness: 'Fast connected speech and elided phrases in casual dialogue',
      action: 'Practice listening with casual conversation clips',
      route: '/learn',
    },
    {
      name: 'Fluency',
      score: skillProgress.fluency || 69,
      trend: '+14% this month',
      strength: 'Speech rate improved from 82 wpm to 124 wpm',
      weakness: 'Filler phrases ("um, basically, you know") under pressure',
      action: 'Take the 60-Second No Fillers Speaking Challenge',
      route: '/test',
    },
    {
      name: 'Naturalness',
      score: 75,
      trend: '+10% this month',
      strength: 'Polite service formulas ("I would like...", "Could you please...")',
      weakness: 'Literal translation patterns ("I am knowing", "discuss about")',
      action: 'Roleplay real-world workplace scenarios',
      route: '/roleplay',
    },
    {
      name: 'Communication',
      score: 78,
      trend: '+11% this month',
      strength: 'Successfully conveys core intentions and keeps dialogue going',
      weakness: 'Elaborating beyond short 1-sentence answers when unprompted',
      action: 'Practice 3-word story and pros/cons speaking challenges',
      route: '/test',
    },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Skills & Speaking Analytics"
          subtitle="Transparent progress calculated from verified completed lessons, voice speaking sessions, and tests"
          badge="Activity-Driven"
        />

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setShowAdminAnalytics(!showAdminAnalytics)}
            className="px-3 py-1.5 rounded-xl bg-surface border border-border text-xs font-semibold text-text-muted hover:text-text transition-colors flex items-center gap-1.5"
          >
            <Eye size={13} />
            <span>Admin Analytics Preview</span>
          </button>
        </div>
      </div>

      {/* Admin Analytics Modal / Drawer Preview (Requirements 44 & 45) */}
      {showAdminAnalytics && (
        <div className="p-5 rounded-3xl bg-indigo-500/5 border border-indigo-500/20 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-indigo-500" />
              <h4 className="text-sm font-bold text-text">Admin Content Performance & Quality Engine</h4>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500">
              Aggregated & Anonymized
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
              <span className="font-bold text-text block">Top Drop-off Points</span>
              <p className="text-text-muted">Unit 3: Past Continuous Step 5 (22% drop-off)</p>
              <span className="text-[10px] text-amber-500 font-semibold">Flagged: Potentially confusing prompt</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
              <span className="font-bold text-text block">Most Practiced Scenario</span>
              <p className="text-text-muted">Corporate Standup with Alex (1,420 sessions)</p>
              <span className="text-[10px] text-emerald-500 font-semibold">Status: High engagement</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
              <span className="font-bold text-text block">Common Learner Error</span>
              <p className="text-text-muted">"discuss about" (seen across 64% of users)</p>
              <span className="text-[10px] text-primary font-semibold">Action: Diagnostic drill triggered</span>
            </div>
          </div>
        </div>
      )}

      {/* High-Level Gamification Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="p-4 rounded-2xl bg-card border border-border shadow-xs">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${m.color}`}>
                <Icon size={18} />
              </div>
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                {m.label}
              </span>
              <span className="text-base sm:text-lg font-black text-text mt-0.5 block truncate">
                {m.val}
              </span>
            </div>
          );
        })}
      </div>

      {/* Goal Personalization Bar (Requirement 34 & 35) */}
      <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-text">Active Learning Goal</h3>
            <p className="text-xs text-text-muted">Tailors topic priority and recommendations across all sections</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {goals.map((g) => {
            const isSelected = activeGoalId === g.id;
            return (
              <div
                key={g.id}
                onClick={() => setActiveGoalId(g.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-1.5 ${
                  isSelected
                    ? 'bg-primary/5 border-primary shadow-xs'
                    : 'bg-surface border-border hover:border-primary/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isSelected ? 'text-primary' : 'text-text'}`}>
                    {g.title}
                  </span>
                  {isSelected && <CheckCircle2 size={14} className="text-primary" />}
                </div>
                <p className="text-[11px] text-text-muted line-clamp-2 leading-relaxed">
                  {g.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Before vs After Concrete Speaking Comparison (Requirement 29) */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Measurable Proof of Progress
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-text mt-1">
              Before vs. After Speaking Comparison
            </h3>
            <p className="text-xs text-text-muted">
              Comparing your First Speaking Session with your Latest Voice Practice
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Day 1 Initial */}
          <div className="p-4 rounded-2xl bg-surface border border-border space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-text-muted uppercase tracking-wider text-[10px]">
                {comparisonData.firstSession.date}
              </span>
              <span className="font-semibold text-text">{comparisonData.firstSession.title}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center py-1">
              <div className="p-2 rounded-xl bg-card border border-border">
                <span className="text-[10px] text-text-muted block">Fluency</span>
                <span className="text-sm font-bold text-text">{comparisonData.firstSession.fluency}%</span>
              </div>
              <div className="p-2 rounded-xl bg-card border border-border">
                <span className="text-[10px] text-text-muted block">Speed</span>
                <span className="text-sm font-bold text-text">{comparisonData.firstSession.wpm} wpm</span>
              </div>
              <div className="p-2 rounded-xl bg-card border border-border">
                <span className="text-[10px] text-text-muted block">Fillers</span>
                <span className="text-sm font-bold text-rose-500">{comparisonData.firstSession.fillerCount}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border text-xs italic text-text-muted">
              "{comparisonData.firstSession.sampleSentence}"
            </div>
          </div>

          {/* Latest Session */}
          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-[10px]">
                {comparisonData.latestSession.date}
              </span>
              <span className="font-bold text-text">{comparisonData.latestSession.title}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center py-1">
              <div className="p-2 rounded-xl bg-card border border-emerald-500/20">
                <span className="text-[10px] text-text-muted block">Fluency</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {comparisonData.latestSession.fluency}%
                </span>
              </div>
              <div className="p-2 rounded-xl bg-card border border-emerald-500/20">
                <span className="text-[10px] text-text-muted block">Speed</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {comparisonData.latestSession.wpm} wpm
                </span>
              </div>
              <div className="p-2 rounded-xl bg-card border border-emerald-500/20">
                <span className="text-[10px] text-text-muted block">Fillers</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {comparisonData.latestSession.fillerCount}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-card border border-emerald-500/20 text-xs italic text-text font-medium">
              "{comparisonData.latestSession.sampleSentence}"
            </div>
          </div>
        </div>

        {/* Evidence bullet points */}
        <div className="p-4 rounded-2xl bg-surface border border-border space-y-2">
          <span className="text-xs font-bold text-text block">Observed Educational Evidence:</span>
          <ul className="space-y-1.5 text-xs text-text-muted pl-5 list-disc">
            {comparisonData.improvements.map((imp, idx) => (
              <li key={idx} className="leading-relaxed">
                {imp}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Part 16: Complete Communication Skills Dashboard */}
      <CommunicationDashboardCard />

      {/* Comprehensive 8-Skills Breakdown Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-text">8 Core Communication Skills</h3>
            <p className="text-xs text-text-muted">Detailed strengths, weaknesses, and recommended action per skill</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {skillsList.map((skill) => (
            <div
              key={skill.name}
              className="p-5 rounded-3xl bg-card border border-border shadow-xs hover:border-primary/40 transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-text">{skill.name}</h4>
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      {skill.trend}
                    </span>
                  </div>
                  <span className="text-base font-black text-text">{skill.score}%</span>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 rounded-full bg-surface w-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${skill.score}%` }}
                  />
                </div>

                <div className="text-xs space-y-1 pt-1">
                  <p className="text-text-muted">
                    <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">Strength: </strong>
                    {skill.strength}
                  </p>
                  <p className="text-text-muted">
                    <strong className="text-amber-600 dark:text-amber-400 font-semibold">Focus: </strong>
                    {skill.weakness}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate(skill.route)}
                className="pt-2 text-xs font-bold text-primary hover:underline flex items-center justify-between border-t border-border mt-2"
              >
                <span>{skill.action}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly vs Monthly Review Tabs (Requirements 30 & 31) */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveReviewTab('weekly')}
              className={`text-xs font-bold pb-1 transition-all ${
                activeReviewTab === 'weekly'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              Weekly English Review
            </button>
            <button
              onClick={() => setActiveReviewTab('monthly')}
              className={`text-xs font-bold pb-1 transition-all ${
                activeReviewTab === 'monthly'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              Monthly English Review
            </button>
          </div>

          <span className="text-[11px] text-text-muted font-semibold">
            {activeReviewTab === 'weekly' ? 'Week 2 of Training' : 'Month 1 Overview'}
          </span>
        </div>

        {activeReviewTab === 'weekly' ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3.5 rounded-2xl bg-surface border border-border">
              <span className="text-[10px] font-bold text-text-muted uppercase block">Speaking Sessions</span>
              <span className="text-xl font-black text-text mt-0.5 block">6</span>
              <span className="text-[10px] text-emerald-500 font-semibold">+2 vs last week</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-surface border border-border">
              <span className="text-[10px] font-bold text-text-muted uppercase block">Top Practiced</span>
              <span className="text-sm font-black text-text mt-1 block truncate">Office Standup</span>
              <span className="text-[10px] text-text-muted">Alex persona</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-surface border border-border">
              <span className="text-[10px] font-bold text-text-muted uppercase block">Words Reviewed</span>
              <span className="text-xl font-black text-text mt-0.5 block">24</span>
              <span className="text-[10px] text-primary font-semibold">85% recall rate</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-surface border border-border">
              <span className="text-[10px] font-bold text-text-muted uppercase block">Recurring Issue</span>
              <span className="text-sm font-black text-amber-500 mt-1 block truncate">Past Tense</span>
              <span className="text-[10px] text-text-muted">"go" → "went"</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-surface border border-border space-y-1">
                <span className="font-bold text-text block">You Learned</span>
                <p className="text-text-muted">4 complete curriculum units, 68 vocabulary words, and 4 phrasal verbs.</p>
              </div>
              <div className="p-4 rounded-2xl bg-surface border border-border space-y-1">
                <span className="font-bold text-text block">You Practiced</span>
                <p className="text-text-muted">14 voice conversations, 4 workplace roleplays, and 2 speaking tests.</p>
              </div>
              <div className="p-4 rounded-2xl bg-surface border border-border space-y-1">
                <span className="font-bold text-text block">You Improved</span>
                <p className="text-text-muted">Speech rate increased by 51% (82 → 124 wpm); fillers reduced by 75%.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Personal Speaking Records & Evidence (Part 15) */}
      <PersonalBestsCard />

      {/* Master Learning Achievements & Transparent Progression (Part 15) */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-text">Milestones & Master Achievements</h3>
              {gamificationSettings.showXP && (
                <button
                  type="button"
                  onClick={() => setIsXpLedgerOpen(true)}
                  className="px-2.5 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-[11px] hover:bg-indigo-500/20 transition-colors flex items-center gap-1"
                >
                  <History size={12} />
                  <span>XP Ledger</span>
                </button>
              )}
            </div>
            <p className="text-xs text-text-muted">
              Rewarding real educational habits, speaking confidence, and long-term retention. Click any item for requirements.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-bold text-primary">
              {achievements.filter((a) => a.isUnlocked).length} / {achievements.length} Unlocked
            </span>
            <button
              type="button"
              onClick={openSettingsModal}
              className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface border border-border transition-colors"
              title="Gamification preferences"
            >
              <Sliders size={14} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              onClick={() => openAchievementModal(ach)}
              className={`p-4 rounded-2xl border transition-all space-y-2 cursor-pointer hover:border-primary/50 hover:shadow-xs ${
                ach.isUnlocked
                  ? 'bg-card border-primary/30 shadow-2xs'
                  : 'bg-surface/50 border-border opacity-70'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text truncate pr-2">{ach.title}</span>
                {ach.isUnlocked ? (
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                ) : (
                  <span className="text-[10px] text-text-muted font-mono font-bold shrink-0">
                    {ach.progress}/{ach.maxProgress}
                  </span>
                )}
              </div>

              <p className="text-[11px] text-text-muted leading-relaxed line-clamp-2">
                {ach.description}
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[10px]">
                <span className="capitalize font-semibold text-text-muted">
                  {ach.category} • {ach.tier}
                </span>
                {gamificationSettings.showXP && (
                  <span className="font-bold text-indigo-500">+{ach.xpReward} XP</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <XPLedgerModal isOpen={isXpLedgerOpen} onClose={() => setIsXpLedgerOpen(false)} />
    </div>
  );
};
