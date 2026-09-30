import React, { useState } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { useTest } from '../../context/TestContext';
import { useNavigation } from '../../context/NavigationContext';
import { TestDashboardHeader } from './TestDashboardHeader';
import { DailyChallengeBanner } from './DailyChallengeBanner';
import { TestNavigationTabs } from './TestNavigationTabs';
import { WeakAreasCard } from './WeakAreasCard';
import { RecommendedTestsCard } from './RecommendedTestsCard';
import { RecentResultsList } from './RecentResultsList';
import { TestRunnerView } from './TestRunnerView';
import { TestResultModal } from './TestResultModal';
import { MyEnglishReportModal } from './MyEnglishReportModal';
import { WeeklyMonthlyReviewModal } from './WeeklyMonthlyReviewModal';
import { TestAttempt, TestDefinition } from '../../types/test';
import { Calendar, Award, Sparkles, FileText, Compass, ShieldAlert } from 'lucide-react';

export const TestHubView: React.FC = () => {
  const { allTests, getTestById } = useTest();
  const { navigate } = useNavigation();

  // Active running test
  const [runningTest, setRunningTest] = useState<TestDefinition | null>(null);

  // Active review modal for attempt
  const [selectedAttempt, setSelectedAttempt] = useState<TestAttempt | null>(null);

  // My English Report Modal
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);

  // Weekly / Monthly Review Modal
  const [reviewModalMode, setReviewModalMode] = useState<'weekly' | 'monthly' | null>(null);

  const handleStartTestById = (testId: string) => {
    const found = getTestById(testId);
    if (found) {
      setRunningTest(found);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePracticeWithJarvis = (prompt: string) => {
    // Navigate to Jarvis / phone call conversation with customized weak area prompt
    navigate('/talk/call', {
      initialMode: 'voice',
      difficulty: 'normal',
      topicId: 'daily-1'
    });
  };

  const handlePracticeWeakAreas = () => {
    const el = document.getElementById('weak-areas-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If a test is currently running, render the runner view
  if (runningTest) {
    return (
      <TestRunnerView
        test={runningTest}
        onClose={() => setRunningTest(null)}
        onFinish={(attempt) => {
          setRunningTest(null);
          setSelectedAttempt(attempt);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-12">
      {/* Top Page Header */}
      <PageHeader
        title="Tests, Assessments & Skill Diagnostics"
        subtitle="Objective competency diagnostics grounded in real speaking performance and the CEFR framework"
        badge="Zero Pressure Diagnostics"
      />

      {/* Test Dashboard Section (Section 2 & 51) */}
      <TestDashboardHeader
        onOpenReport={() => setIsReportOpen(true)}
        onStartPlacement={() => handleStartTestById('test-placement')}
      />

      {/* Daily Challenge Banner (Section 38) */}
      <DailyChallengeBanner onStartTest={handleStartTestById} />

      {/* Weekly & Monthly Review Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <button
          type="button"
          onClick={() => setReviewModalMode('weekly')}
          className="p-4 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all flex items-center justify-between text-left group shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Calendar size={18} />
            </div>
            <div>
              <h4 className="text-xs font-black text-text group-hover:text-primary transition-colors">
                Weekly Speaking Review
              </h4>
              <p className="text-[11px] text-text-muted mt-0.5">
                7-day speaking time, new vocabulary, repeated slips, and next week focus
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-primary shrink-0 ml-2">View →</span>
        </button>

        <button
          type="button"
          onClick={() => setReviewModalMode('monthly')}
          className="p-4 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all flex items-center justify-between text-left group shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <Award size={18} />
            </div>
            <div>
              <h4 className="text-xs font-black text-text group-hover:text-amber-500 transition-colors">
                Monthly English Review
              </h4>
              <p className="text-[11px] text-text-muted mt-0.5">
                Comprehensive 30-day activity, milestones, and CEFR level progression
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-500 shrink-0 ml-2">View →</span>
        </button>
      </div>

      {/* Test Navigation & Category Tabs (Section 1 & 3–20) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-text">Choose an Assessment or Speaking Challenge</h3>
          <span className="text-xs text-text-muted font-semibold">10 Specialized Formats</span>
        </div>

        <TestNavigationTabs onStartTest={handleStartTestById} />
      </div>

      {/* Multi-Source Weakness Detection (Section 30) */}
      <div id="weak-areas-section" className="pt-2">
        <WeakAreasCard onPracticeWithJarvis={handlePracticeWithJarvis} />
      </div>

      {/* Evidence-Based Recommendations (Section 37) */}
      <RecommendedTestsCard onStartTest={handleStartTestById} />

      {/* Recent Results List & Retake Center (Section 33 & 34) */}
      <RecentResultsList
        onReviewAttempt={(attempt) => setSelectedAttempt(attempt)}
        onRetakeTest={handleStartTestById}
        onPracticeWeakAreas={handlePracticeWeakAreas}
      />

      {/* Modals */}
      {selectedAttempt && (
        <TestResultModal
          attempt={selectedAttempt}
          onClose={() => setSelectedAttempt(null)}
          onRetake={(testId) => {
            setSelectedAttempt(null);
            handleStartTestById(testId);
          }}
          onPracticeWithJarvis={handlePracticeWithJarvis}
        />
      )}

      <MyEnglishReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        onPracticeWithJarvis={handlePracticeWithJarvis}
      />

      <WeeklyMonthlyReviewModal
        isOpen={Boolean(reviewModalMode)}
        initialMode={reviewModalMode || 'weekly'}
        onClose={() => setReviewModalMode(null)}
        onPracticeWithJarvis={handlePracticeWithJarvis}
      />
    </div>
  );
};
