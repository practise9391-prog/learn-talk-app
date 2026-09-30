import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { AppShell } from './components/layout/AppShell';
import { HomeView } from './components/home/HomeView';
import { LearnDashboardView } from './components/learn/LearnDashboardView';
import { InteractiveLessonEngine } from './components/learn/InteractiveLessonEngine';
import { TalkHubView } from './components/talk/TalkHubView';
import { TalkHomeView } from './components/talk/TalkHomeView';
import { PhoneCallConversationView } from './components/talk/PhoneCallConversationView';
import { MySavedPhrasesView } from './components/talk/MySavedPhrasesView';
import { JarvisPartnerView } from './components/talk/JarvisPartnerView';
import { ConversationSessionView } from './components/talk/ConversationSessionView';
import { Practice247View } from './components/talk/Practice247View';
import { SpeedPracticeView } from './components/talk/SpeedPracticeView';
import { TranslationView } from './components/talk/TranslationView';
import { SpeakingHelpModal } from './components/talk/SpeakingHelpModal';
import { RoleplayDirectoryView } from './components/roleplay/RoleplayDirectoryView';
import { TestHubView } from './components/test/TestHubView';
import { TestProvider } from './context/TestContext';
import { RecordingsView } from './components/recordings/RecordingsView';
import { HistoryView } from './components/history/HistoryView';
import { MistakesView } from './components/mistakes/MistakesView';
import { ProgressView } from './components/progress/ProgressView';
import { SettingsView } from './components/settings/SettingsView';
import { CurriculumFeatureView } from './components/learn/CurriculumFeatureView';
import { GrammarHubView } from './components/grammar/GrammarHubView';
import { VocabularyHubView } from './components/vocabulary/VocabularyHubView';
import { IdiomsHubView } from './components/idioms/IdiomsHubView';
import { PhrasalVerbsHubView } from './components/phrasal/PhrasalVerbsHubView';
import { CurriculumModuleProvider } from './context/CurriculumModuleContext';
import { HistoryProvider } from './context/HistoryContext';
import { PracticeProvider } from './context/PracticeContext';
import { PracticeHubView } from './components/practice/PracticeHubView';
import { NotificationProvider } from './context/NotificationContext';
import { AdminProvider } from './context/AdminContext';
import { UserProfileView } from './components/profile/UserProfileView';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { AdaptiveLearningProvider } from './context/AdaptiveLearningContext';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { MASTER_CURRICULUM } from './data/curriculumData';
import { ConfidenceMode } from './types';
import { ConversationDifficulty } from './types/talk';

const RouterOutlet: React.FC = () => {
  const { currentRoute, navigate } = useNavigation();
  const path = currentRoute.path;
  const params = currentRoute.params || {};

  // Find active lesson for /learn/lesson/:id in MASTER_CURRICULUM
  if (path.startsWith('/learn/lesson/')) {
    const lessonId = path.replace('/learn/lesson/', '');
    let matchedLesson = null;

    for (const lvl of MASTER_CURRICULUM) {
      for (const unit of lvl.units) {
        const found = unit.lessons.find((l) => l.id === lessonId);
        if (found) {
          matchedLesson = found;
          break;
        }
      }
      if (matchedLesson) break;
    }

    const defaultLesson = MASTER_CURRICULUM[0].units[1].lessons[0];
    return <InteractiveLessonEngine lesson={matchedLesson || defaultLesson} />;
  }

  // Conversation in location
  if (path.startsWith('/talk/location/')) {
    const locationId = path.replace('/talk/location/', '');
    return (
      <ConversationSessionView
        locationId={locationId}
        personaId={params.personaId}
        confidenceMode={(params.mode as ConfidenceMode) || 'real_conversation'}
      />
    );
  }

  // Dedicated routes
  switch (path) {
    case '/home':
    case '/':
      return <HomeView />;

    case '/learn':
      return <LearnDashboardView />;

    case '/talk':
      return <TalkHomeView />;

    case '/talk/call':
      return (
        <PhoneCallConversationView
          topicId={params.topicId}
          personaId={params.personaId}
          difficulty={params.difficulty as ConversationDifficulty}
          initialMode={params.initialMode as 'voice' | 'text'}
          lessonContext={params.lessonContext}
          customStarter={params.customStarter}
          grammarContext={params.grammarContext}
          vocabContext={params.vocabContext}
        />
      );

    case '/talk/saved-phrases':
      return <MySavedPhrasesView />;

    case '/talk/jarvis':
      return <JarvisPartnerView />;

    case '/talk/practice':
      return <Practice247View />;

    case '/talk/speed':
      return <SpeedPracticeView />;

    case '/talk/translate':
      return <TranslationView />;

    case '/talk/speaking-help':
      return (
        <div className="max-w-2xl mx-auto">
          <SpeakingHelpModal
            isOpen={true}
            onClose={() => navigate('/talk')}
            scenarioTopic="General Conversation"
          />
        </div>
      );

    case '/roleplay':
      return <RoleplayDirectoryView />;

    case '/test':
      return <TestHubView />;

    case '/recordings':
      return <RecordingsView />;

    case '/history':
      return <HistoryView />;

    case '/mistakes':
      return <MistakesView />;

    case '/progress':
      return <ProgressView />;

    case '/settings':
      return <SettingsView />;

    case '/grammar':
      return <GrammarHubView />;

    case '/vocabulary':
      return <VocabularyHubView />;

    case '/idioms':
      return <IdiomsHubView />;

    case '/phrasal-verbs':
      return <PhrasalVerbsHubView />;

    case '/pronunciation':
      return <CurriculumFeatureView type="pronunciation" />;

    case '/practice':
      return <PracticeHubView />;

    case '/profile':
      return <UserProfileView />;

    case '/admin':
      return <AdminDashboardView />;

    default:
      if (path.startsWith('/test')) {
        return <TestHubView />;
      }
      return <HomeView />;
  }
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <TestProvider>
          <CurriculumModuleProvider>
            <HistoryProvider>
              <PracticeProvider>
                <AdaptiveLearningProvider>
                  <NotificationProvider>
                    <AdminProvider>
                      <NavigationProvider>
                        <AppShell>
                          <RouterOutlet />
                          <OnboardingModal />
                        </AppShell>
                      </NavigationProvider>
                    </AdminProvider>
                  </NotificationProvider>
                </AdaptiveLearningProvider>
              </PracticeProvider>
            </HistoryProvider>
          </CurriculumModuleProvider>
        </TestProvider>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
