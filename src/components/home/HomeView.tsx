import React from 'react';
import { WelcomeSection } from './WelcomeSection';
import { PersonalizedIntelligenceSection } from './PersonalizedIntelligenceSection';
import { DailyGoalCard } from '../gamification/DailyGoalCard';
import { DailyPracticeSection } from '../curriculum/DailyPracticeSection';
import { DailyLearningCard } from './DailyLearningCard';
import { SkillProgressOverview } from './SkillProgressOverview';
import { LearningPathJourney } from './LearningPathJourney';
import { SpeakingWorldPreview } from './SpeakingWorldPreview';
import { CommunicationDashboardCard } from '../communication/CommunicationDashboardCard';
import { CareerDashboardCard } from '../career/CareerDashboardCard';
import { WorkplaceDashboardCard } from '../workplace/WorkplaceDashboardCard';
import { ProLabDashboardCard } from '../proLab/ProLabDashboardCard';
import { QuickPracticeGrid } from './QuickPracticeGrid';
import { RecentActivityList } from './RecentActivityList';

export const HomeView: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <WelcomeSection />
      <DailyGoalCard />
      <PersonalizedIntelligenceSection />
      <DailyPracticeSection />
      <DailyLearningCard />
      <CommunicationDashboardCard />
      <CareerDashboardCard />
      <WorkplaceDashboardCard />
      <ProLabDashboardCard />
      <SpeakingWorldPreview />
      <QuickPracticeGrid />
      <LearningPathJourney />
      <SkillProgressOverview />
      <RecentActivityList />
    </div>
  );
};
