import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useUser } from '../../context/UserContext';
import { CEFRLevel } from '../../types';
import { SUPPORTED_LANGUAGES } from '../../data/topics';
import { Sparkles, ArrowRight, ArrowLeft, Check, CheckCircle2 } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, finishOnboarding } = useUser();
  const [step, setStep] = useState<number>(1);

  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    'Speak confidently',
    'Think in English',
  ]);
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>('A1');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['Telugu', 'Hindi']);
  const [dailyMinutes, setDailyMinutes] = useState<number>(10);

  if (!isOnboardingOpen) return null;

  const goalOptions = [
    'Speak confidently',
    'Improve pronunciation',
    'Improve grammar',
    'Prepare for interviews',
    'Improve workplace English',
    'Travel English',
    'Daily conversation',
    'Think in English',
    'Improve everything',
  ];

  const levels: { id: CEFRLevel; title: string; desc: string }[] = [
    { id: 'A1', title: 'Beginner', desc: 'Starting from scratch or know very basic words' },
    { id: 'A2', title: 'Elementary', desc: 'Can form simple sentences but hesitate often' },
    { id: 'B1', title: 'Intermediate', desc: 'Can converse but lack natural phrasing and confidence' },
    { id: 'B2', title: 'Upper Intermediate', desc: 'Good English, preparing for workplace/interviews' },
    { id: 'C1', title: 'Advanced', desc: 'Fluent, polishing nuances, idioms and leadership speaking' },
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
    });
  };

  return (
    <Modal isOpen={isOnboardingOpen} onClose={() => {}} maxWidth="lg">
      <div className="flex flex-col gap-6 py-2">
        {/* Step Progress Pills */}
        <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-border">
          <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
            Step {step} of 6
          </span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className={`w-6 h-1.5 rounded-full transition-all ${
                  i <= step ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="text-center py-6 space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-4xl text-white shadow-xl shadow-primary/30 mx-auto animate-bounce-subtle">
              LT
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-text">
              Welcome to LearnTalk
            </h2>
            <p className="text-xs sm:text-sm text-text-muted max-w-md mx-auto leading-relaxed">
              Your AI-powered English speaking environment. We don't just teach grammar rules — we train you to think in English and speak with confidence!
            </p>
          </div>
        )}

        {/* Step 2: Goal Selection */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-black text-text">What is your primary speaking goal?</h3>
              <p className="text-xs text-text-muted mt-0.5">Select all that matter to you</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {goalOptions.map((goal) => {
                const isSelected = selectedGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleGoal(goal)}
                    className={`
                      p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between
                      ${
                        isSelected
                          ? 'bg-primary text-white border-primary shadow-xs'
                          : 'bg-surface text-text border-border hover:bg-card'
                      }
                    `}
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
              <h3 className="text-lg font-black text-text">What is your current speaking level?</h3>
              <p className="text-xs text-text-muted mt-0.5">Be honest — we meet you exactly where you are</p>
            </div>
            <div className="space-y-2">
              {levels.map((lvl) => {
                const isSelected = selectedLevel === lvl.id;
                return (
                  <div
                    key={lvl.id}
                    onClick={() => setSelectedLevel(lvl.id)}
                    className={`
                      p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between
                      ${
                        isSelected
                          ? 'bg-primary/10 border-primary ring-2 ring-primary/20 shadow-xs'
                          : 'bg-surface border-border hover:bg-card'
                      }
                    `}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-text">{lvl.title}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-card border border-border text-primary">
                          Level {lvl.id}
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

        {/* Step 4: Native Languages */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-black text-text">What languages do you use at home?</h3>
              <p className="text-xs text-text-muted mt-0.5">
                Helps us spot translation-based interference and explain grammar naturally
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SUPPORTED_LANGUAGES.filter((l) => l.name !== 'English').map((lang) => {
                const isSelected = selectedLanguages.includes(lang.name);
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => toggleLanguage(lang.name)}
                    className={`
                      p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center
                      ${
                        isSelected
                          ? 'bg-primary text-white border-primary shadow-xs'
                          : 'bg-surface text-text border-border hover:bg-card'
                      }
                    `}
                  >
                    <span className="text-xs font-bold">{lang.name}</span>
                    <span className="text-[11px] opacity-80">{lang.nativeName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 5: What would you like to practice? */}
        {step === 5 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-black text-text">Where do you want to practice first?</h3>
              <p className="text-xs text-text-muted mt-0.5">You can switch between any mode anytime</p>
            </div>
            <div className="space-y-2.5">
              {[
                { title: 'Speaking World Scenarios', desc: 'Tea shop, office, restaurants, hotels, airports', icon: '🌎' },
                { title: 'Free Conversation with Jarvis', desc: 'Open-ended speaking partner available 24×7', icon: '🤖' },
                { title: 'Structured Curriculum Lessons', desc: 'Sentence building, action verbs, tenses and grammar', icon: '📚' },
                { title: 'Job Interview & Workplace Roleplays', desc: 'Simulate high-stakes discussions with managers', icon: '💼' },
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

        {/* Step 6: Daily Speaking Goal */}
        {step === 6 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-black text-text">Set your daily speaking target</h3>
              <p className="text-xs text-text-muted mt-0.5">How many minutes can you speak each day?</p>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[5, 10, 15, 20, 30].map((min) => (
                <button
                  key={min}
                  type="button"
                  onClick={() => setDailyMinutes(min)}
                  className={`
                    py-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center
                    ${
                      dailyMinutes === min
                        ? 'bg-primary text-white border-primary shadow-xs font-bold'
                        : 'bg-surface text-text border-border hover:bg-card'
                    }
                  `}
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
                Every speaking turn will help you think directly in English.
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

          {step < 6 ? (
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
