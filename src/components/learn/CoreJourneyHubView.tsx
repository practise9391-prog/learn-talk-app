import React, { useState } from 'react';
import { useCoreJourney } from '../../context/CoreJourneyContext';
import { useUser } from '../../context/UserContext';
import { useNavigation } from '../../context/NavigationContext';
import { CORE_JOURNEY_STEPS, ZERO_LEVEL_FOUNDATIONS_UNIT } from '../../data/coreJourneyData';
import { SentenceBuildingLabModal } from '../common/SentenceBuildingLabModal';
import { ThinkInEnglishModal } from '../common/ThinkInEnglishModal';
import { ConversationRecoveryModal } from '../common/ConversationRecoveryModal';
import { SpeakingJournalModal } from '../common/SpeakingJournalModal';
import {
  Compass,
  Sparkles,
  Layers,
  Brain,
  LifeBuoy,
  BookOpen,
  Mic,
  MessageSquare,
  Award,
  ArrowRight,
  CheckCircle2,
  Volume2,
  Globe,
  Sliders,
  Type,
  Eye,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const CoreJourneyHubView: React.FC = () => {
  const { user } = useUser();
  const { navigate } = useNavigation();
  const {
    currentJourneyStage,
    advanceJourneyStage,
    setJourneyStage,
    ageGroup,
    setAgeGroup,
    explanationLanguage,
    setExplanationLanguage,
    textSize,
    setTextSize,
    highContrast,
    setHighContrast,
    offlineReady
  } = useCoreJourney();

  // Studio Modal States
  const [isSentenceLabOpen, setIsSentenceLabOpen] = useState(false);
  const [isThinkInEnglishOpen, setIsThinkInEnglishOpen] = useState(false);
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);
  const [isJournalOpen, setIsJournalOpen] = useState(false);

  const activeStep = CORE_JOURNEY_STEPS.find((s) => s.stepNumber === currentJourneyStage) || CORE_JOURNEY_STEPS[0];

  const studios = [
    {
      id: 'sentence-lab',
      title: 'Sentence-Building Laboratory',
      subtitle: 'Part 24 & Part L',
      desc: 'Assemble phrases from word elements without getting stuck. See natural alternatives immediately.',
      icon: Layers,
      color: 'from-blue-600 to-indigo-600',
      action: () => setIsSentenceLabOpen(true),
      tag: 'Grammar Without Confusion'
    },
    {
      id: 'think-in-english',
      title: 'Think-in-English Training Gym',
      subtitle: 'Part L & Part 24',
      desc: 'Train your brain to link thoughts directly to English words without translating from mother tongue.',
      icon: Brain,
      color: 'from-amber-500 to-orange-600',
      action: () => setIsThinkInEnglishOpen(true),
      tag: 'Bypass Mother-Tongue Translation'
    },
    {
      id: 'conversation-recovery',
      title: 'Conversation Recovery Lifesavers',
      subtitle: 'Part L & Part 25',
      desc: 'Never freeze again! Master instant recovery phrases when you forget a word, need time, or miss a sentence.',
      icon: LifeBuoy,
      color: 'from-rose-500 to-red-600',
      action: () => setIsRecoveryOpen(true),
      tag: 'Zero Brain-Freeze Safety Net'
    },
    {
      id: 'speaking-journal',
      title: 'Speaking & Confidence Journal',
      subtitle: 'Part L & Part 30',
      desc: 'Private learner logbook for speaking breakthroughs, daily progress, and private deletion controls.',
      icon: Sparkles,
      color: 'from-emerald-600 to-teal-600',
      action: () => setIsJournalOpen(true),
      tag: '100% Private Self-Reflection'
    },
    {
      id: 'speaking-map',
      title: 'Illustrated Interactive World Map',
      subtitle: 'Part 26',
      desc: 'Explore 14 interactive environments: Education, Everyday Life, Travel, Corporate & Civic.',
      icon: Compass,
      color: 'from-purple-600 to-indigo-700',
      action: () => navigate('/map'),
      tag: 'Full 5 Life Domains'
    },
    {
      id: 'jarvis-coach',
      title: 'Jarvis 7-Mode AI Speaking Partner',
      subtitle: 'Part 25',
      desc: 'Real Web Speech STT, synthesized voice with barge-in interruption, and 3-tier scaffolding hints.',
      icon: Mic,
      color: 'from-sky-600 to-cyan-600',
      action: () => navigate('/talk/jarvis'),
      tag: 'Real-Time Voice AI'
    }
  ];

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-12">
      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-primary/20 via-indigo-900/30 to-purple-900/20 border border-primary/30 p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-primary text-primary-foreground">
                Part 22 – Final Part Master Journey
              </span>
              {offlineReady && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck size={12} /> Offline Ready
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-text">
              Complete English Learning & Speaking System
            </h1>
            <p className="text-sm text-text-muted mt-1.5 max-w-2xl leading-relaxed">
              Personalized for your age, comfort level, and language preference. Follow the 11-step learning journey from absolute zero to independent, spontaneous communication.
            </p>
          </div>

          {/* Quick Zero-Level Jump */}
          <div className="flex flex-col gap-2 shrink-0">
            <button
              type="button"
              onClick={() => navigate('/learn/lesson/b1-u0-l1')}
              className="px-5 py-3 rounded-2xl bg-primary text-primary-foreground font-black text-sm shadow-md hover:bg-primary-hover flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
            >
              <BookOpen size={18} />
              <span>Start Absolute Zero Foundations</span>
              <ArrowRight size={16} />
            </button>
            <span className="text-[11px] text-text-muted text-center">
              Alphabet, Letter Sounds, Phonics & Numbers
            </span>
          </div>
        </div>

        {/* Personalized Adaptation Bar */}
        <div className="mt-6 pt-5 border-t border-border/40 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Age Group */}
          <div className="bg-card/70 border border-border/60 rounded-xl p-2.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-text-muted uppercase font-bold block">Learner Age Group</span>
              <span className="text-xs font-bold capitalize text-text">
                {ageGroup.replace('_', ' ')}
              </span>
            </div>
            <select
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value as any)}
              className="bg-surface text-xs font-semibold rounded-lg px-2 py-1 border border-border focus:outline-none"
            >
              <option value="children">Children (6-12)</option>
              <option value="student_teen">Teens (13-17)</option>
              <option value="college">College Student</option>
              <option value="professional">Working Professional</option>
              <option value="adult_beginner">Adult Beginner</option>
              <option value="older_adult">Older Adult (50+)</option>
            </select>
          </div>

          {/* Bilingual Explanations */}
          <div className="bg-card/70 border border-border/60 rounded-xl p-2.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-text-muted uppercase font-bold block">Bilingual Explanations</span>
              <span className="text-xs font-bold capitalize text-text">
                {explanationLanguage}
              </span>
            </div>
            <select
              value={explanationLanguage}
              onChange={(e) => setExplanationLanguage(e.target.value as any)}
              className="bg-surface text-xs font-semibold rounded-lg px-2 py-1 border border-border focus:outline-none"
            >
              <option value="english">English Only</option>
              <option value="telugu">English + Telugu</option>
              <option value="hindi">English + Hindi</option>
            </select>
          </div>

          {/* Text Size Scale */}
          <div className="bg-card/70 border border-border/60 rounded-xl p-2.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-text-muted uppercase font-bold block">Text Font Size</span>
              <span className="text-xs font-bold capitalize text-text">
                {textSize.replace('_', ' ')}
              </span>
            </div>
            <div className="flex gap-1">
              {(['normal', 'large', 'extra_large'] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setTextSize(size)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-colors ${
                    textSize === size ? 'bg-primary text-white' : 'bg-surface text-text-muted hover:text-text'
                  }`}
                  title={`Set text size to ${size}`}
                >
                  {size === 'normal' ? 'A' : size === 'large' ? 'A+' : 'A++'}
                </button>
              ))}
            </div>
          </div>

          {/* High Contrast Toggle */}
          <div className="bg-card/70 border border-border/60 rounded-xl p-2.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-text-muted uppercase font-bold block">Accessibility Mode</span>
              <span className="text-xs font-bold text-text">
                {highContrast ? 'High Contrast' : 'Standard'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setHighContrast(!highContrast)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                highContrast ? 'bg-amber-500 text-black' : 'bg-surface text-text-muted hover:text-text'
              }`}
            >
              {highContrast ? 'Enabled' : 'Toggle'}
            </button>
          </div>
        </div>
      </div>

      {/* 11-Step Core Learning Journey Stepper (Part 22) */}
      <div className="rounded-3xl bg-card border border-border p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Part 22 Engine
            </span>
            <h2 className="text-lg sm:text-xl font-black text-text">
              The 11-Step Master Learning Cycle
            </h2>
            <p className="text-xs text-text-muted">
              Structured cycle: Understand the rule $\rightarrow$ see examples $\rightarrow$ speak aloud $\rightarrow$ get instant feedback $\rightarrow$ fix mistakes $\rightarrow$ advance.
            </p>
          </div>
          <button
            type="button"
            onClick={advanceJourneyStage}
            className="px-3.5 py-1.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <span>Advance Step</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Horizontal Steps Bar */}
        <div className="overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none">
          <div className="flex items-center gap-2 min-w-[840px]">
            {CORE_JOURNEY_STEPS.map((step) => {
              const isActive = step.stepNumber === currentJourneyStage;
              const isPast = step.stepNumber < currentJourneyStage;
              return (
                <button
                  key={step.stepNumber}
                  type="button"
                  onClick={() => setJourneyStage(step.stepNumber)}
                  className={`flex-1 flex flex-col items-center p-3 rounded-2xl border text-center transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm scale-[1.03]'
                      : isPast
                      ? 'bg-card border-emerald-500/30 text-text hover:border-primary/40'
                      : 'bg-surface/50 border-border text-text-muted hover:text-text'
                  }`}
                >
                  <div className="flex items-center gap-1 text-[11px] font-bold mb-1">
                    {isPast ? <CheckCircle2 size={13} className="text-emerald-500" /> : null}
                    <span>Step {step.stepNumber}</span>
                  </div>
                  <span className="text-xs font-extrabold truncate w-full">{step.title}</span>
                  <span className={`text-[10px] mt-0.5 truncate w-full ${isActive ? 'text-white/80' : 'text-text-muted'}`}>
                    {step.subtitle}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Stage Details Card */}
        <div className="mt-4 p-4 rounded-2xl bg-surface/60 border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-black text-sm shrink-0">
              {activeStep.stepNumber}
            </div>
            <div>
              <h3 className="text-sm font-bold text-text">
                Current Step: {activeStep.title} — {activeStep.subtitle}
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                {activeStep.description}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  Learner Action:
                </span>
                <span className="text-xs font-medium text-text bg-card px-2.5 py-0.5 rounded-md border border-border">
                  {activeStep.actionRequired}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate(activeStep.routeTarget)}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary-hover flex items-center justify-center gap-1.5 shrink-0 self-start sm:self-auto shadow-xs"
          >
            <span>Launch This Step</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Part 23: Zero-Level Foundations Spotlight */}
      <div className="rounded-3xl bg-card border border-border p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">
                Part 23 • Beginner 1 (Unit 0)
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                True Absolute Zero
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-text mt-0.5">
              {ZERO_LEVEL_FOUNDATIONS_UNIT.title}
            </h2>
            <p className="text-xs text-text-muted">
              {ZERO_LEVEL_FOUNDATIONS_UNIT.description}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/learn')}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span>View Full 6-Stage Curriculum</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ZERO_LEVEL_FOUNDATIONS_UNIT.lessons.map((lesson: any) => (
            <div
              key={lesson.id}
              className="rounded-2xl border border-border bg-surface/50 p-4 flex flex-col justify-between hover:border-primary/40 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-primary">
                    Lesson {lesson.lessonNumber}
                  </span>
                  <span className="text-[11px] text-text-muted">
                    {lesson.estimatedMinutes} mins
                  </span>
                </div>
                <h4 className="text-sm font-bold text-text group-hover:text-primary transition-colors">
                  {lesson.title}
                </h4>
                <p className="text-xs text-text-muted mt-1 line-clamp-2">
                  {lesson.subtitle}
                </p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {lesson.targetPhrases?.slice(0, 2).map((phrase: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-card px-2 py-0.5 rounded-md border border-border text-text font-medium truncate max-w-full"
                    >
                      "{phrase}"
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/learn/lesson/${lesson.id}`)}
                className="mt-4 w-full py-2 rounded-xl bg-card border border-border text-xs font-bold text-text hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center justify-center gap-1.5"
              >
                <span>Start Lesson</span>
                <ArrowRight size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Specialized Studios Grid (Parts 24, 25, 26, L, 30) */}
      <div>
        <div className="mb-4">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            Interactive Studios & Laboratories
          </span>
          <h2 className="text-lg sm:text-xl font-black text-text">
            Specialized English Laboratories
          </h2>
          <p className="text-xs text-text-muted">
            High-impact tools to build sentence confidence, practice natural speech, and overcome anxiety.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {studios.map((studio) => {
            const Icon = studio.icon;
            return (
              <div
                key={studio.id}
                className="rounded-3xl border border-border bg-card p-5 flex flex-col justify-between hover:shadow-md hover:border-primary/40 transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${studio.color} text-white flex items-center justify-center shadow-sm`}>
                      <Icon size={22} />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                      {studio.tag}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                    {studio.subtitle}
                  </span>
                  <h3 className="text-base font-bold text-text mt-0.5 group-hover:text-primary transition-colors">
                    {studio.title}
                  </h3>
                  <p className="text-xs text-text-muted mt-1.5 leading-relaxed">
                    {studio.desc}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={studio.action}
                  className="mt-5 w-full py-2.5 rounded-xl bg-surface border border-border font-bold text-xs text-text hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center justify-center gap-2 group-hover:shadow-xs"
                >
                  <span>Open Studio</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Modals */}
      <SentenceBuildingLabModal
        isOpen={isSentenceLabOpen}
        onClose={() => setIsSentenceLabOpen(false)}
      />
      <ThinkInEnglishModal
        isOpen={isThinkInEnglishOpen}
        onClose={() => setIsThinkInEnglishOpen(false)}
      />
      <ConversationRecoveryModal
        isOpen={isRecoveryOpen}
        onClose={() => setIsRecoveryOpen(false)}
      />
      <SpeakingJournalModal
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
      />
    </div>
  );
};
