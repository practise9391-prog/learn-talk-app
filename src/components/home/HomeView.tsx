import React from 'react';
import { WelcomeSection } from './WelcomeSection';
import { PersonalizedIntelligenceSection } from './PersonalizedIntelligenceSection';
import { DailyPracticeSection } from '../curriculum/DailyPracticeSection';
import { DailyLearningCard } from './DailyLearningCard';
import { SkillProgressOverview } from './SkillProgressOverview';
import { LearningPathJourney } from './LearningPathJourney';
import { SpeakingWorldPreview } from './SpeakingWorldPreview';
import { QuickPracticeGrid } from './QuickPracticeGrid';
import { RecentActivityList } from './RecentActivityList';

export const HomeView: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <WelcomeSection />
      <PersonalizedIntelligenceSection />
      <DailyPracticeSection />
      <DailyLearningCard />
      <SpeakingWorldPreview />
      <QuickPracticeGrid />
      <LearningPathJourney />
      <SkillProgressOverview />
      <RecentActivityList />
    </div>
  );
};
