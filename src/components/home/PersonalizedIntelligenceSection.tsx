import React, { useState } from 'react';
import { useHistory } from '../../context/HistoryContext';
import { useNavigation } from '../../context/NavigationContext';
import { useAdaptiveLearning } from '../../context/AdaptiveLearningContext';
import { TodayReviewModal } from '../revision/TodayReviewModal';
import { MistakePracticeModal } from '../mistakes/MistakePracticeModal';
import { WhatShouldILearnNextCard } from '../adaptive/WhatShouldILearnNextCard';
import { DailyAdaptivePlanCard } from '../adaptive/DailyAdaptivePlanCard';
import { RecurringMistakeAlertBanner } from '../adaptive/RecurringMistakeAlertBanner';
import { SmartRevisionModal } from '../adaptive/SmartRevisionModal';
import { SkillGraphModal } from '../adaptive/SkillGraphModal';
import { UnifiedMistake } from '../../types/history';
import {
  Sparkles,
  Bot,
  RotateCcw,
  ArrowRight,
  AlertTriangle,
  Mic,
  BookOpen,
  Layers,
  CheckCircle2,
  Clock,
  Compass,
  Network,
} from 'lucide-react';

export const PersonalizedIntelligenceSection: React.FC = () => {
  const { getAiCoachSummary, revisionQueue, mistakes, activeGoal } = useHistory();
  const { overdueMasteryCount, skillProfile } = useAdaptiveLearning();
  const { navigate } = useNavigation();

  const [isSmartRevisionOpen, setIsSmartRevisionOpen] = useState<boolean>(false);
  const [isGraphModalOpen, setIsGraphModalOpen] = useState<boolean>(false);
  const [selectedPracticeMistake, setSelectedPracticeMistake] = useState<UnifiedMistake | null>(null);

  const topRecurringMistake =
    mistakes.find((m) => m.status === 'repeated' || m.status === 'learning') || mistakes[0];
  const dueRevisionCount = revisionQueue.length + overdueMasteryCount;
  const estimatedMins = Math.max(
    3,
    Math.ceil(revisionQueue.reduce((acc, item) => acc + item.estimatedSeconds, 0) / 60)
  );

  return (
    <div className="space-y-5 mb-8">
      {/* 1. Recurring Mistake Alert Banner (Section 29: Root-cause remediation) */}
      <RecurringMistakeAlertBanner />

      {/* 2. "What Should I Learn Next?" Central Adaptive Action (Section 7, 8, 53) */}
      <WhatShouldILearnNextCard />

      {/* 3. Jarvis AI Coach Summary */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-primary/10 via-indigo-500/10 to-purple-500/10 border border-primary/20 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs">
              <Bot size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-text">Jarvis AI Adaptive Coach</h3>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-primary/20 text-primary uppercase tracking-wider">
                  Calibrated to {skillProfile.overallDerivedLevel}
                </span>
              </div>
              <p className="text-[11px] text-text-muted">Targeting Goal: {activeGoal.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsGraphModalOpen(true)}
              className="text-xs font-bold text-primary hover:underline hidden sm:flex items-center gap-1"
              title="View skill graph"
            >
              <Network size={13} />
              <span>Skill Graph</span>
            </button>
            <span className="text-text-muted hidden sm:inline">•</span>
            <button
              type="button"
              onClick={() => navigate('/progress')}
              className="text-xs font-bold text-primary hover:underline hidden sm:flex items-center gap-1"
            >
              <span>Trends</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-text leading-relaxed font-medium">
          "{getAiCoachSummary()}"
        </p>

        <div className="flex items-center gap-2 pt-1 flex-wrap">
          <button
            type="button"
            onClick={() => navigate('/talk/call?topicId=office-standup&personaId=alex')}
            className="px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs hover:bg-primary-hover transition-all"
          >
            <Mic size={13} />
            <span>Spontaneous Workplace Call with Alex</span>
          </button>

          <button
            type="button"
            onClick={() => setIsSmartRevisionOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-surface border border-border text-xs font-bold text-text hover:text-primary transition-all flex items-center gap-1.5"
          >
            <RotateCcw size={13} />
            <span>Review Spaced Flashcards ({dueRevisionCount})</span>
          </button>
        </div>
      </div>

      {/* 4. Today's Adaptive Learning Plan (Section 32 & 33: 5m/15m/30m tiers) */}
      <DailyAdaptivePlanCard />

      {/* 5. 4-Part Adaptive Intelligence Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Continue Learning */}
        <div
          onClick={() => navigate('/learn')}
          className="p-4 rounded-2xl bg-card border border-border hover:border-primary/50 cursor-pointer transition-all space-y-2 group shadow-2xs"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] font-black uppercase tracking-wider text-primary">
              Continue Learning
            </span>
            <BookOpen size={14} className="text-text-muted group-hover:text-primary transition-colors" />
          </div>
          <h4 className="text-sm font-bold text-text group-hover:text-primary transition-colors truncate">
            Unit 2: Talking About Routines
          </h4>
          <p className="text-[11px] text-text-muted line-clamp-2">
            Step 3 of 7 in progress. Practice your morning routine narrative.
          </p>
        </div>

        {/* Smart Revision Entry ("Review Now" - Section 39) */}
        <div
          onClick={() => setIsSmartRevisionOpen(true)}
          className="p-4 rounded-2xl bg-card border border-border hover:border-amber-500/50 cursor-pointer transition-all space-y-2 group shadow-2xs"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-500">
              Review Now ({dueRevisionCount})
            </span>
            <RotateCcw size={14} className="text-amber-500" />
          </div>
          <h4 className="text-sm font-bold text-text group-hover:text-amber-600 transition-colors truncate">
            {estimatedMins} Mins Spaced Queue
          </h4>
          <p className="text-[11px] text-text-muted line-clamp-2">
            Overdue vocabulary, recurring grammar & weak speaking items ready for recall.
          </p>
        </div>

        {/* Practice Your Weakness */}
        <div
          onClick={() => topRecurringMistake && setSelectedPracticeMistake(topRecurringMistake)}
          className="p-4 rounded-2xl bg-card border border-border hover:border-rose-500/50 cursor-pointer transition-all space-y-2 group shadow-2xs"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-500">
              Practice Weakness
            </span>
            <AlertTriangle size={14} className="text-rose-500" />
          </div>
          <h4 className="text-sm font-bold text-text group-hover:text-rose-600 transition-colors truncate">
            {topRecurringMistake ? topRecurringMistake.category.toUpperCase() : 'Grammar Drill'}
          </h4>
          <p className="text-[11px] text-text-muted line-clamp-2">
            "{topRecurringMistake?.originalInput}" • Click for instant 1-minute drill.
          </p>
        </div>

        {/* Try Speaking */}
        <div
          onClick={() => navigate('/roleplay')}
          className="p-4 rounded-2xl bg-card border border-border hover:border-emerald-500/50 cursor-pointer transition-all space-y-2 group shadow-2xs"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500">
              Try Speaking
            </span>
            <Mic size={14} className="text-emerald-500" />
          </div>
          <h4 className="text-sm font-bold text-text group-hover:text-emerald-600 transition-colors truncate">
            Workplace Roleplay
          </h4>
          <p className="text-[11px] text-text-muted line-clamp-2">
            Simulate an agile standup or asking your manager for task clarification.
          </p>
        </div>
      </div>

      {/* Smart Spaced Revision Modal (Section 39) */}
      {isSmartRevisionOpen && (
        <SmartRevisionModal
          isOpen={isSmartRevisionOpen}
          onClose={() => setIsSmartRevisionOpen(false)}
        />
      )}

      {/* Interconnected Skill Graph Modal (Section 37 & 38) */}
      {isGraphModalOpen && (
        <SkillGraphModal
          isOpen={isGraphModalOpen}
          onClose={() => setIsGraphModalOpen(false)}
        />
      )}

      {/* Mistake Practice Modal */}
      {selectedPracticeMistake && (
        <MistakePracticeModal
          mistake={selectedPracticeMistake}
          onClose={() => setSelectedPracticeMistake(null)}
        />
      )}
    </div>
  );
};
