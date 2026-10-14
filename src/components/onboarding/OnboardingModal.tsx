import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useUser } from '../../context/UserContext';
import { CEFRLevel } from '../../types';
import { AgeGroup, ExplanationLanguage, SpeakingComfortLevel } from '../../types/coreJourney';
import { SUPPORTED_LANGUAGES } from '../../data/topics';
import { Sparkles, ArrowRight, ArrowLeft, Check, CheckCircle2, User, Globe, Volume2, Shield } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, finishOnboarding } = useUser();
  const [step, setStep] = useState<number>(1);

  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup>('professional');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    'Speak confidently',
    'Think in English',
  ]);
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>('A1');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['Telugu', 'Hindi']);
  const [selectedExplanationLang, setSelectedExplanationLang] = useState<ExplanationLanguage>('english');
  const [selectedSpeakingComfort, setSelectedSpeakingComfort] = useState<SpeakingComfortLevel>('confident');
  const [dailyMinutes, setDailyMinutes] = useState<number>(10);

  if (!isOnboardingOpen) return null;

  const ageGroupOptions: Array<{ id: AgeGroup; label: string; desc: string; icon: string }> = [
    { id: 'children', label: 'Young Child', desc: 'First English words, pictures & friendly sounds', icon: '🧒' },
    { id: 'student_teen', label: 'School Student / Teen', desc: 'Classroom speaking, vocabulary & exams', icon: '🎒' },
    { id: 'college', label: 'College Student', desc: 'Campus discussions, seminars & campus placement', icon: '🎓' },
    { id: 'professional', label: 'Working Professional', desc: 'Workplace meetings, presentations & career English', icon: '💼' },
    { id: 'adult_beginner', label: 'Adult Beginner', desc: 'Dignified, patient & completely shame-free start', icon: '🌱' },
    { id: 'older_adult', label: 'Adult 50+ & Senior', desc: 'Calm pacing, large text & comfortable practice', icon: '☕' },
  ];

  const goalOptions = [
    'Speaking for everyday life',
    'Speaking confidently with friends',
    'Think in English without translating',
    'Improve school & exam performance',
    'College seminars & placement prep',
    'Job interviews & career English',
    'Workplace meetings & presentations',
    'Travelling internationally',
    'Clear pronunciation & phonics',
    'Understanding native English speed',
  ];

  const levels: { id: CEFRLevel; title: string; desc: string }[] = [
    { id: 'A1', title: 'Beginner 1 (Start from Zero)', desc: 'Learning alphabet, letter sounds, first words, or basic greetings' },
    { id: 'A2', title: 'Beginner 2 (Everyday Communication)', desc: 'Can form simple sentences but hesitate or translate in head' },
    { id: 'B1', title: 'Intermediate 1 (Independent Speaking)', desc: 'Can converse but lack natural phrasing, idioms, and confidence' },
    { id: 'B2', title: 'Intermediate 2 (Natural Conversation)', desc: 'Good English, preparing for workplace syncs, debates and interviews' },
    { id: 'C1', title: 'Advanced (Professional & Social Fluency)', desc: 'Fluent, refining leadership communication, nuance and diplomacy' },
  ];

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const handleFinish = () => {
    finishOnboarding({
      level: selectedLevel,
      goals: selectedGoals,
      nativeLanguages: selectedLanguages,
      dailyGoalMinutes: dailyMinutes,
      ageGroup: selectedAgeGroup,
      preferredExplanationLanguage: selectedExplanationLang,
      comfortSpeakingAloud: selectedSpeakingComfort,
    });
  };

  return (
    <Modal isOpen={isOnboardingOpen} onClose={() => {}} maxWidth="lg">
      <div className="flex flex-col gap-6 py-2">
        {/* Step Progress Pills */}
        <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-border">
          <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
            Step {step} of 7
          </span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={i}
                className={`w-5 h-1.5 rounded-full transition-all ${
                  i <= step ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Welcome & Age Group */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-center py-2 space-y-2">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-3xl text-white shadow-lg shadow-primary/30 mx-auto">
                LT
              </div>
              <h2 className="text-2xl font-black text-text">Welcome to LearnTalk</h2>
              <p className="text-xs text-text-muted max-w-md mx-auto leading-relaxed">
                Personalized AI English speaking coach for learners of every age, speed, and confidence level.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-text uppercase tracking-wider block mb-2">
                Who is practicing English today?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ageGroupOptions.map((opt) => {
                  const isSelected = selectedAgeGroup === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedAgeGroup(opt.id)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-primary/10 border-primary ring-2 ring-primary/20 shadow-xs'
                          : 'bg-surface border-border hover:bg-card'
                      }`}
                    >
                      <span className="text-xl block mb-1">{opt.icon}</span>
                      <h4 className="text-xs font-bold text-text">{opt.label}</h4>
                      <p className="text-[10px] text-text-muted line-clamp-2 mt-0.5">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Goal Selection */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-black text-text">What are your primary speaking goals?</h3>
              <p className="text-xs text-text-muted mt-0.5">Select what matters most to your journey</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {goalOptions.map((goal) => {
                const isSelected = selectedGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleGoal(goal)}
                    className={`p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-xs'
                        : 'bg-surface text-text border-border hover:bg-card'
                    }`}
                  >
                    <span>{goal}</span>
                    {isSelected && <Check size={14} />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Current Level */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-black text-text">What is your current English speaking level?</h3>
              <p className="text-xs text-text-muted mt-0.5">We will meet you gently where you are right now</p>
            </div>
            <div className="space-y-2">
              {levels.map((lvl) => {
                const isSelected = selectedLevel === lvl.id;
                return (
                  <div
                    key={lvl.id}
                    onClick={() => setSelectedLevel(lvl.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-primary/10 border-primary ring-2 ring-primary/20 shadow-xs'
                        : 'bg-surface border-border hover:bg-card'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-text">{lvl.title}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-card border border-border text-primary">
                          {lvl.id}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted mt-0.5">{lvl.desc}</p>
                    </div>
                    {isSelected && <CheckCircle2 className="text-primary shrink-0" size={18} />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Native Languages & Explanation Language */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-black text-text">Language Support & Explanations</h3>
              <p className="text-xs text-text-muted mt-0.5">
                We support English-first teaching with toggleable Telugu and Hindi grammar explanations
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-text uppercase tracking-wider block mb-2">
                Preferred Explanation Language:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'english', label: 'English Only', sub: 'Immersion practice' },
                    { id: 'telugu', label: 'Telugu + English', sub: 'తెలుగు వివరణలతో' },
                    { id: 'hindi', label: 'Hindi + English', sub: 'हिंदी स्पष्टीकरण के साथ' },
                  ] as const
                ).map((lang) => (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => setSelectedExplanationLang(lang.id)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      selectedExplanationLang === lang.id
                        ? 'bg-primary text-white border-primary shadow-xs'
                        : 'bg-surface text-text border-border hover:bg-card'
                    }`}
                  >
                    <span className="text-xs font-bold block">{lang.label}</span>
                    <span className="text-[10px] opacity-80 block">{lang.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-text uppercase tracking-wider block mb-2">
                Languages You Speak at Home:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SUPPORTED_LANGUAGES.filter((l) => l.name !== 'English').map((lang) => {
                  const isSelected = selectedLanguages.includes(lang.name);
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => toggleLanguage(lang.name)}
                      className={`p-2.5 rounded-xl border text-center transition-all flex items-center justify-between px-3 ${
                        isSelected
                          ? 'bg-primary text-white border-primary shadow-xs'
                          : 'bg-surface text-text border-border hover:bg-card'
                      }`}
                    >
                      <span className="text-xs font-bold">{lang.name}</span>
                      <span className="text-[10px] opacity-80">{lang.nativeName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Speaking Comfort */}
        {step === 5 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-black text-text">Are you comfortable speaking aloud right now?</h3>
              <p className="text-xs text-text-muted mt-0.5">We will adapt the audio and mic cues accordingly</p>
            </div>
            <div className="space-y-2.5">
              {(
                [
                  {
                    id: 'confident',
                    title: 'Yes, ready to speak aloud',
                    desc: 'Full microphone practice with real-time speech recognition & feedback',
                    icon: Volume2,
                  },
                  {
                    id: 'shy',
                    title: 'I feel a bit shy / nervous',
                    desc: 'Confidence-building mode with gentle hints and zero judgment',
                    icon: Shield,
                  },
                  {
                    id: 'quiet_environment',
                    title: 'I am in a quiet or public place',
                    desc: 'Start with listening, text exercises, and sentence building first',
                    icon: Globe,
                  },
                ] as const
              ).map((opt) => {
                const isSelected = selectedSpeakingComfort === opt.id;
                const Icon = opt.icon;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedSpeakingComfort(opt.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3.5 ${
                      isSelected
                        ? 'bg-primary/10 border-primary ring-2 ring-primary/20 shadow-xs'
                        : 'bg-surface border-border hover:bg-card'
                    }`}
                  >
                    <div className="p-2.5 rounded-xl bg-card border border-border text-primary">
                      <Icon size={18} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-text">{opt.title}</h4>
                      <p className="text-[11px] text-text-muted mt-0.5">{opt.desc}</p>
                    </div>
                    {isSelected && <CheckCircle2 className="text-primary shrink-0" size={18} />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 6: Where would you like to practice? */}
        {step === 6 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-black text-text">Choose your favorite starting area</h3>
              <p className="text-xs text-text-muted mt-0.5">You can switch between any area anytime with 1 click</p>
            </div>
            <div className="space-y-2.5">
              {[
                { title: 'Interactive World Map Scenarios', desc: 'Tea shop, airport, railway station, market, and temple', icon: '🌎' },
                { title: 'Jarvis 24×7 Speaking Assistant', desc: 'Guided & independent conversation coaching with progressive hints', icon: '🤖' },
                { title: 'Structured Lessons (From Zero)', desc: 'Phonics, sentence laboratory, action verbs, and grammar formulas', icon: '📚' },
                { title: 'Career & Workplace Roleplay', desc: 'Daily standups, 1:1 syncs, disagreements, and executive briefings', icon: '💼' },
              ].map((p, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-surface border border-border flex items-center gap-3.5 hover:border-primary/50 cursor-pointer transition-all"
                >
                  <span className="text-2xl">{p.icon}</span>
                  <div>
                    <h4 className="text-xs font-bold text-text">{p.title}</h4>
                    <p className="text-[11px] text-text-muted">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 7: Daily Target & Finish */}
        {step === 7 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-black text-text">Set your daily speaking target</h3>
              <p className="text-xs text-text-muted mt-0.5">How many minutes can you practice each day?</p>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[5, 10, 15, 20, 30].map((min) => (
                <button
                  key={min}
                  type="button"
                  onClick={() => setDailyMinutes(min)}
                  className={`py-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                    dailyMinutes === min
                      ? 'bg-primary text-white border-primary shadow-xs font-bold'
                      : 'bg-surface text-text border-border hover:bg-card'
                  }`}
                >
                  <span className="text-base font-black">{min}</span>
                  <span className="text-[10px] opacity-80">min</span>
                </button>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800 text-center">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 block">
                Your personalized LearnTalk speaking environment is ready!
              </span>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                Every speaking turn will help you think directly in English with zero embarrassment.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-border mt-2">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-text-muted hover:text-text transition-colors flex items-center gap-1"
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 7 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl shadow-md shadow-primary/20 hover:bg-primary-hover transition-all flex items-center gap-1.5"
            >
              <span>Continue</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-8 py-3 bg-primary text-primary-foreground text-xs font-black rounded-xl shadow-lg shadow-primary/30 hover:bg-primary-hover active:scale-98 transition-all flex items-center gap-2"
            >
              <span>Start Speaking English</span>
              <Sparkles size={15} />
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
