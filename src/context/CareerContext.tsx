import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CareerRoleCategory,
  InterviewType,
  InterviewDifficulty,
  ProfessionalIntroTemplate,
  TellMeAboutYourselfGuide,
  TechnicalConceptTopic,
  GroupDiscussionScenario,
  InterviewQuestionItem,
  MockInterviewSession,
  ProfessionalPhraseItem,
  CareerPortfolioItem,
  ProjectExplanationProfile,
  ResumeBulletRefinement,
} from '../types/career';
import {
  PROFESSIONAL_INTRO_TEMPLATES,
  TELL_ME_ABOUT_YOURSELF_GUIDES,
  TECHNICAL_CONCEPTS_LIBRARY,
  SAMPLE_INTERVIEW_QUESTIONS,
  SAMPLE_GD_SCENARIOS,
  CAREER_PHRASES_MASTER,
} from '../data/careerData';
import { CareerEvaluationService } from '../services/careerEvaluationService';
import { useGamification } from './GamificationContext';
import { useAdaptiveLearning } from './AdaptiveLearningContext';
import { useHistory } from './HistoryContext';

interface CareerContextType {
  activeJobRole: CareerRoleCategory;
  introTemplates: ProfessionalIntroTemplate[];
  tellMeAboutYourselfGuides: TellMeAboutYourselfGuide[];
  technicalTopics: TechnicalConceptTopic[];
  sampleQuestions: InterviewQuestionItem[];
  gdScenarios: GroupDiscussionScenario[];
  careerPhrases: ProfessionalPhraseItem[];
  portfolioItems: CareerPortfolioItem[];
  savedProjects: ProjectExplanationProfile[];
  activeMockInterview: MockInterviewSession | null;
  interviewHistory: MockInterviewSession[];
  resumeBulletRefinements: ResumeBulletRefinement[];

  setActiveJobRole: (role: CareerRoleCategory) => void;
  savePortfolioItem: (item: Omit<CareerPortfolioItem, 'id' | 'createdAt' | 'lastUpdated'>) => void;
  deletePortfolioItem: (id: string) => void;
  saveProjectProfile: (project: ProjectExplanationProfile) => void;
  refineBullet: (rawBullet: string, context?: any) => ResumeBulletRefinement;

  startMockInterview: (
    role: CareerRoleCategory,
    type: InterviewType,
    difficulty: InterviewDifficulty,
    customQuestions?: InterviewQuestionItem[]
  ) => MockInterviewSession;

  submitInterviewAnswer: (
    questionId: string,
    answerText: string,
    durationSeconds: number
  ) => any;

  finishMockInterview: () => MockInterviewSession | null;
}

const CareerContext = createContext<CareerContextType | undefined>(undefined);

export const CareerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { awardXP } = useGamification();
  const { recordEvidence } = useAdaptiveLearning();
  const { logActivity } = useHistory();

  const [activeJobRole, setActiveJobRole] = useState<CareerRoleCategory>(() => {
    const saved = localStorage.getItem('learntalk_career_active_role');
    return (saved as CareerRoleCategory) || 'software_developer';
  });

  const [portfolioItems, setPortfolioItems] = useState<CareerPortfolioItem[]>(() => {
    const saved = localStorage.getItem('learntalk_career_portfolio');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'port-1',
        itemType: 'self_intro',
        title: '60-Second Full-Stack Interview Opener',
        content:
          'Hello, I am Alex, a full-stack engineer with 3 years of experience building high-throughput web applications with TypeScript and Node.js.',
        tags: ['Interview', 'Intro', 'Technical'],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        lastUpdated: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'port-2',
        itemType: 'resume_bullet',
        title: 'Payments Microservice Bullet Point',
        content:
          'Architected an event-driven payments microservice handling 20,000+ daily transactions, reducing checkout timeout latency by 42%.',
        tags: ['Resume', 'Kafka', 'Node.js'],
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      },
    ];
  });

  const [savedProjects, setSavedProjects] = useState<ProjectExplanationProfile[]>(() => {
    const saved = localStorage.getItem('learntalk_career_saved_projects');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'proj-default-1',
        projectName: 'SmartTransit Realtime Tracker',
        problemSolved: 'Unreliable city bus tracking causing commuter delays',
        targetUsers: 'Daily urban commuters and municipal transit dispatchers',
        techStack: ['React', 'TypeScript', 'Node.js', 'WebSockets', 'PostgreSQL'],
        myKeyResponsibilities: 'Engineered the WebSocket ingestion stream and map visualization components',
        majorChallenge: 'High memory consumption under 10,000 concurrent client connections',
        debuggingStory: 'Isolated memory leaks via heap snapshots and transitioned to chunked connection pools',
        outcomeResult: 'Scaled service reliably to 15,000 active concurrent commuters',
        futureImprovements: 'Integrate predictive arrival algorithms based on historical traffic patterns',
      },
    ];
  });

  const [activeMockInterview, setActiveMockInterview] = useState<MockInterviewSession | null>(null);
  const [interviewHistory, setInterviewHistory] = useState<MockInterviewSession[]>(() => {
    const saved = localStorage.getItem('learntalk_career_interview_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [resumeBulletRefinements, setResumeBulletRefinements] = useState<ResumeBulletRefinement[]>(() => {
    const saved = localStorage.getItem('learntalk_career_bullet_refinements');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('learntalk_career_active_role', activeJobRole);
  }, [activeJobRole]);

  useEffect(() => {
    localStorage.setItem('learntalk_career_portfolio', JSON.stringify(portfolioItems));
  }, [portfolioItems]);

  useEffect(() => {
    localStorage.setItem('learntalk_career_saved_projects', JSON.stringify(savedProjects));
  }, [savedProjects]);

  useEffect(() => {
    localStorage.setItem('learntalk_career_interview_history', JSON.stringify(interviewHistory));
  }, [interviewHistory]);

  useEffect(() => {
    localStorage.setItem('learntalk_career_bullet_refinements', JSON.stringify(resumeBulletRefinements));
  }, [resumeBulletRefinements]);

  const savePortfolioItem = (item: Omit<CareerPortfolioItem, 'id' | 'createdAt' | 'lastUpdated'>) => {
    const newItem: CareerPortfolioItem = {
      ...item,
      id: `port-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    setPortfolioItems((prev) => [newItem, ...prev]);
  };

  const deletePortfolioItem = (id: string) => {
    setPortfolioItems((prev) => prev.filter((p) => p.id !== id));
  };

  const saveProjectProfile = (project: ProjectExplanationProfile) => {
    setSavedProjects((prev) => {
      const idx = prev.findIndex((p) => p.id === project.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = project;
        return copy;
      }
      return [project, ...prev];
    });
  };

  const refineBullet = (rawBullet: string, context?: any): ResumeBulletRefinement => {
    const result = CareerEvaluationService.refineResumeBullet(rawBullet, context);
    setResumeBulletRefinements((prev) => [result, ...prev]);
    return result;
  };

  const startMockInterview = (
    role: CareerRoleCategory,
    type: InterviewType,
    difficulty: InterviewDifficulty,
    customQuestions?: InterviewQuestionItem[]
  ): MockInterviewSession => {
    const questionsToUse =
      customQuestions && customQuestions.length > 0
        ? customQuestions
        : SAMPLE_INTERVIEW_QUESTIONS.filter((q) => q.category === type || type === 'mock_full');

    const session: MockInterviewSession = {
      id: `mock-${Date.now()}`,
      jobRole: role,
      interviewType: type,
      difficulty,
      totalQuestions: Math.max(1, questionsToUse.length),
      currentQuestionIndex: 0,
      questions: questionsToUse.length > 0 ? questionsToUse : [SAMPLE_INTERVIEW_QUESTIONS[0]],
      turns: [],
      status: 'in_progress',
      createdAt: new Date().toISOString(),
    };

    setActiveMockInterview(session);
    return session;
  };

  const submitInterviewAnswer = (questionId: string, answerText: string, durationSeconds: number) => {
    if (!activeMockInterview) return null;

    const currentQ =
      activeMockInterview.questions.find((q) => q.id === questionId) ||
      activeMockInterview.questions[activeMockInterview.currentQuestionIndex];

    const evaluation = CareerEvaluationService.evaluateInterviewAnswer(answerText, currentQ);

    const turn = {
      questionId: currentQ.id,
      question: currentQ.question,
      userAnswerText: answerText,
      durationSeconds,
      feedback: {
        starCoverage: evaluation.starCoverage,
        clarityScore: evaluation.clarityScore,
        toneScore: evaluation.toneScore,
        grammarIssues: evaluation.grammarIssues,
        betterAlternative: evaluation.betterProfessionalVersion,
        fillersDetected: evaluation.fillersCount,
      },
    };

    const nextIndex = activeMockInterview.currentQuestionIndex + 1;
    const isFinished = nextIndex >= activeMockInterview.questions.length;

    const updatedSession: MockInterviewSession = {
      ...activeMockInterview,
      currentQuestionIndex: nextIndex,
      turns: [...activeMockInterview.turns, turn],
      status: isFinished ? 'completed' : 'in_progress',
    };

    setActiveMockInterview(updatedSession);

    // Record evidence in Adaptive Learning
    recordEvidence({
      sourceType: 'roleplay',
      sourceTitle: `Career Interview: ${currentQ.question.substring(0, 30)}...`,
      targetSkill: 'professional_communication',
      accuracyScore: evaluation.overallScore,
      difficulty: 'normal',
      hintsUsedCount: 0,
      contextType: 'spontaneous_speaking',
    });

    // Award XP
    awardXP('speaking', currentQ.id, 'interview_question_answered', Math.round(evaluation.overallScore * 0.4), durationSeconds);

    if (isFinished) {
      finishMockInterview();
    }

    return evaluation;
  };

  const finishMockInterview = (): MockInterviewSession | null => {
    if (!activeMockInterview) return null;

    const turns = activeMockInterview.turns;
    const avgClarity = turns.length > 0 ? Math.round(turns.reduce((s, t) => s + (t.feedback?.clarityScore || 70), 0) / turns.length) : 75;
    const avgTone = turns.length > 0 ? Math.round(turns.reduce((s, t) => s + (t.feedback?.toneScore || 75), 0) / turns.length) : 80;
    const totalFillers = turns.reduce((s, t) => s + (t.feedback?.fillersDetected || 0), 0);

    const completedSession: MockInterviewSession = {
      ...activeMockInterview,
      status: 'completed',
      overallReport: {
        overallScore: Math.round((avgClarity + avgTone) / 2),
        communicationScore: avgClarity,
        grammarScore: 85,
        relevanceScore: 88,
        starMethodScore: 82,
        fillerCount: totalFillers,
        topStrengths: [
          'Direct, confident vocal articulation',
          'Good technical vocabulary usage in contextual scenarios',
          'Demonstrated clear ownership of tasks',
        ],
        priorityImprovements: [
          'State concrete quantitative metrics in STAR results',
          'Reduce filler transitions ("basically", "you know")',
          'Conclude with forward-looking enthusiasm',
        ],
      },
    };

    setInterviewHistory((prev) => [completedSession, ...prev]);

    // Log to History
    logActivity({
      userId: 'u-1',
      activityType: 'roleplay',
      title: `Career Interview Simulation: ${activeMockInterview.jobRole.replace('_', ' ')}`,
      subtitle: `${activeMockInterview.interviewType.toUpperCase()} Interview • ${turns.length} turns`,
      timestamp: 'Just now',
      durationSeconds: turns.reduce((sum, t) => sum + t.durationSeconds, 0),
      skill: 'speaking',
      score: completedSession.overallReport?.overallScore || 80,
      hasRecording: false,
      hasTranscript: true,
      hasFeedback: true,
      saved: false,
      correctionsCount: totalFillers,
    });

    return completedSession;
  };

  return (
    <CareerContext.Provider
      value={{
        activeJobRole,
        introTemplates: PROFESSIONAL_INTRO_TEMPLATES,
        tellMeAboutYourselfGuides: TELL_ME_ABOUT_YOURSELF_GUIDES,
        technicalTopics: TECHNICAL_CONCEPTS_LIBRARY,
        sampleQuestions: SAMPLE_INTERVIEW_QUESTIONS,
        gdScenarios: SAMPLE_GD_SCENARIOS,
        careerPhrases: CAREER_PHRASES_MASTER,
        portfolioItems,
        savedProjects,
        activeMockInterview,
        interviewHistory,
        resumeBulletRefinements,
        setActiveJobRole,
        savePortfolioItem,
        deletePortfolioItem,
        saveProjectProfile,
        refineBullet,
        startMockInterview,
        submitInterviewAnswer,
        finishMockInterview,
      }}
    >
      {children}
    </CareerContext.Provider>
  );
};

export const useCareer = (): CareerContextType => {
  const context = useContext(CareerContext);
  if (!context) {
    throw new Error('useCareer must be used within a CareerProvider');
  }
  return context;
};
