import React, { useState } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { usePractice } from '../../context/PracticeContext';
import { useHistory } from '../../context/HistoryContext';
import { useNavigation } from '../../context/NavigationContext';
import { SpeakingArenaView } from './SpeakingArenaView';
import { GamesArenaView } from './GamesArenaView';
import { PronunciationListeningArenaView } from './PronunciationListeningArenaView';
import { SessionBuilderModal } from './SessionBuilderModal';
import {
  Mic,
  Zap,
  Sparkles,
  Gamepad2,
  Headphones,
  Award,
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sliders,
  History,
  Target,
  Flame,
} from 'lucide-react';

export const PracticeHubView: React.FC = () => {
  const { dailyChallenge, completedChallengesCount } = usePractice();
  const { mistakes, activities } = useHistory();
  const { navigate } = useNavigation();

  const [activeTab, setActiveTab] = useState<'home' | 'speaking' | 'games' | 'pronunciation' | 'history'>('home');
  const [isBuilderModalOpen, setIsBuilderModalOpen] = useState<boolean>(false);

  const topWeakness = mistakes.find((m) => m.status === 'repeated' || m.status === 'learning') || mistakes[0];

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Speaking Practice Arena & Interactive Games"
          subtitle="Low-friction daily drills, spontaneous speaking challenges, and language games designed to build conversational muscle memory"
          badge="Interactive Arena"
        />

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setIsBuilderModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1.5 shadow-xs hover:bg-primary-hover transition-all"
          >
            <Sliders size={14} />
            <span>Custom Workout</span>
          </button>
        </div>
      </div>

      {/* Arena Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'home', label: 'Practice Home', icon: Target },
          { id: 'speaking', label: 'Speaking Arena', icon: Mic },
          { id: 'games', label: 'Word & Sentence Games', icon: Gamepad2 },
          { id: 'pronunciation', label: 'Pronunciation & Shadowing', icon: Headphones },
          { id: 'history', label: 'Practice History', icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 border ${
                isActive
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-card text-text-muted hover:text-text border-border hover:bg-surface'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: HOME */}
      {activeTab === 'home' && (
        <div className="space-y-6">
          {/* Today's Personalized Daily Challenge Banner (Requirements 9 & 10) */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-primary/10 via-amber-500/10 to-orange-500/10 border border-primary/20 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <Flame size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      Today's Challenge
                    </span>
                    <span className="text-xs text-text-muted">•</span>
                    <span className="text-xs font-semibold text-text-muted">
                      {completedChallengesCount} Completed this month
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-text mt-0.5">
                    {dailyChallenge.title}
                  </h3>
                </div>
              </div>

              <span className="text-xs font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 self-start sm:self-auto">
                +{dailyChallenge.xpReward} XP Reward
              </span>
            </div>

            <p className="text-xs sm:text-sm text-text leading-relaxed font-medium">
              "{dailyChallenge.prompt}"
            </p>

            {/* Target requirements */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-xl bg-card border border-border text-text font-semibold flex items-center gap-1">
                <Clock size={12} className="text-primary" />
                <span>Min: {dailyChallenge.targetDurationSeconds}s</span>
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-card border border-border text-text font-semibold">
                Target Grammar: <strong className="text-primary">{dailyChallenge.targetGrammar}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-card border border-border text-text font-semibold">
                Keywords: <strong className="text-primary">{dailyChallenge.targetVocabulary.join(', ')}</strong>
              </span>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('speaking')}
                className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-hover shadow-xs transition-all flex items-center gap-2"
              >
                <Mic size={14} />
                <span>Start Daily Challenge</span>
              </button>
            </div>
          </div>

          {/* 3 Main Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Speaking Arena Quick Start */}
            <div
              onClick={() => setActiveTab('speaking')}
              className="p-5 rounded-3xl bg-card border border-border hover:border-primary/50 cursor-pointer transition-all space-y-3 group shadow-2xs"
            >
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                <Mic size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-text group-hover:text-primary transition-colors">
                  Speaking Arena
                </h4>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  Start voice speaking instantly. Select topics, JAM, or spontaneous workplace conversations.
                </p>
              </div>
              <span className="text-xs font-bold text-primary flex items-center gap-1 pt-1">
                <span>Open Arena</span>
                <ArrowRight size={13} />
              </span>
            </div>

            {/* Practice Your Weakness */}
            <div
              onClick={() => navigate('/mistakes')}
              className="p-5 rounded-3xl bg-card border border-border hover:border-amber-500/50 cursor-pointer transition-all space-y-3 group shadow-2xs"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-text group-hover:text-amber-600 transition-colors">
                  Practice Weakness
                </h4>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  Target your recurring mistake: <strong>"{topWeakness ? topWeakness.category : 'Tense'}"</strong>.
                </p>
              </div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 pt-1">
                <span>Target Mistake</span>
                <ArrowRight size={13} />
              </span>
            </div>

            {/* Quick 5-Min Practice */}
            <div
              onClick={() => setIsBuilderModalOpen(true)}
              className="p-5 rounded-3xl bg-card border border-border hover:border-indigo-500/50 cursor-pointer transition-all space-y-3 group shadow-2xs"
            >
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Zap size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-text group-hover:text-indigo-600 transition-colors">
                  Quick 5-Min Workout
                </h4>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  Mixed-skill session combining grammar, vocabulary, pronunciation, and speech.
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-500 flex items-center gap-1 pt-1">
                <span>Build Workout</span>
                <ArrowRight size={13} />
              </span>
            </div>
          </div>

          {/* Interactive Games Showcase */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-text">Word & Sentence Games</h3>
                <p className="text-xs text-text-muted">Gamified activities designed to build fast vocabulary and sentence structure</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('games')}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>View All Games</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Word Association', desc: 'Speed recall chain', action: 'games' },
                { label: 'Sentence Builder', desc: 'Syntax & word order', action: 'games' },
                { label: 'Error Detective', desc: 'Spot grammar flaws', action: 'games' },
                { label: 'Natural or Not?', desc: 'Nuance & registers', action: 'games' },
              ].map((g, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveTab(g.action as any)}
                  className="p-4 rounded-2xl bg-card border border-border hover:border-primary/50 cursor-pointer transition-all space-y-1 group"
                >
                  <span className="text-xs font-bold text-text group-hover:text-primary transition-colors block">
                    {g.label}
                  </span>
                  <span className="text-[11px] text-text-muted block">{g.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: SPEAKING ARENA */}
      {activeTab === 'speaking' && <SpeakingArenaView />}

      {/* TAB CONTENT: GAMES */}
      {activeTab === 'games' && <GamesArenaView />}

      {/* TAB CONTENT: PRONUNCIATION */}
      {activeTab === 'pronunciation' && <PronunciationListeningArenaView />}

      {/* TAB CONTENT: PRACTICE HISTORY */}
      {activeTab === 'history' && (
        <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-base font-black text-text">My Practice History</h3>
              <p className="text-xs text-text-muted">Recent speaking drills, challenges, and games</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/history')}
              className="text-xs font-bold text-primary hover:underline"
            >
              Open Full Activity Log →
            </button>
          </div>

          <div className="space-y-2.5">
            {activities
              .filter((a) => a.activityType === 'speaking' || a.activityType === 'challenge')
              .slice(0, 5)
              .map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-surface border border-border flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-bold text-text block">{item.title}</span>
                    <span className="text-text-muted text-[11px]">{item.subtitle} • {item.timestamp}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full font-bold bg-primary/10 text-primary">
                    {item.score}%
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Session Builder Modal */}
      {isBuilderModalOpen && (
        <SessionBuilderModal
          isOpen={isBuilderModalOpen}
          onClose={() => setIsBuilderModalOpen(false)}
        />
      )}
    </div>
  );
};
