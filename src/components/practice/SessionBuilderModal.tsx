import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { useHistory } from '../../context/HistoryContext';
import { useNavigation } from '../../context/NavigationContext';
import {
  X,
  Sparkles,
  Sliders,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

interface SessionBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SessionBuilderModal: React.FC<SessionBuilderModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { updateUser } = useUser();
  const { logActivity } = useHistory();
  const { navigate } = useNavigation();

  // Builder configuration options
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Speaking', 'Grammar', 'Vocabulary']);
  const [selectedDuration, setSelectedDuration] = useState<'quick' | 'short' | 'standard' | 'extended'>('quick');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'normal' | 'challenging' | 'advanced'>('normal');
  const [selectedContext, setSelectedContext] = useState<string>('workplace');

  // Workout runner state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [workoutFinished, setWorkoutFinished] = useState<boolean>(false);

  if (!isOpen) return null;

  const workoutSteps = [
    { type: 'Grammar', title: 'Article & Preposition Quick Diagnostic', durationSec: 60 },
    { type: 'Vocabulary', title: 'Workplace Collocation Matching', durationSec: 90 },
    { type: 'Speaking', title: '60-Second Standup Update Speech', durationSec: 60 },
    { type: 'Pronunciation', title: 'Ending Consonant Shadowing Drill', durationSec: 60 },
    { type: 'Fluency', title: 'Spontaneous Response to Unexpected Question', durationSec: 45 },
  ];

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleStartWorkout = () => {
    setIsRunning(true);
    setCurrentStep(0);
    setWorkoutFinished(false);
  };

  const handleNextStep = () => {
    if (currentStep + 1 < workoutSteps.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setWorkoutFinished(true);
      updateUser({ xp: 75 });
      logActivity({
        userId: 'user-001',
        activityType: 'challenge',
        title: 'Mixed Practice Workout',
        subtitle: `5-part custom workout (${selectedContext} • ${selectedDifficulty})`,
        timestamp: 'Just now',
        durationSeconds: 315,
        skill: 'speaking',
        score: 88,
        hasRecording: false,
        hasTranscript: true,
        hasFeedback: true,
        saved: true,
        correctionsCount: 1,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border w-full max-w-xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-surface/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Sliders size={16} />
            </div>
            <div>
              <h3 className="text-sm font-black text-text">Practice Session Builder</h3>
              <p className="text-[11px] text-text-muted">
                Compose a targeted, mixed-skill English workout tailored to your goals
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-text-muted hover:text-text hover:bg-surface transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {!isRunning && !workoutFinished ? (
            <div className="space-y-5">
              {/* Skill Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-text block">1. Target Skills to Combine:</label>
                <div className="flex flex-wrap gap-2">
                  {['Speaking', 'Grammar', 'Vocabulary', 'Listening', 'Pronunciation', 'Fluency'].map((sk) => {
                    const isSelected = selectedSkills.includes(sk);
                    return (
                      <button
                        key={sk}
                        type="button"
                        onClick={() => toggleSkill(sk)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-primary text-white border-primary shadow-2xs'
                            : 'bg-surface border-border text-text-muted hover:text-text'
                        }`}
                      >
                        {sk}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Duration Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-text block">2. Desired Duration:</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'quick', label: 'Quick', desc: '5 min' },
                    { id: 'short', label: 'Short', desc: '10 min' },
                    { id: 'standard', label: 'Standard', desc: '15 min' },
                    { id: 'extended', label: 'Deep', desc: '25 min' },
                  ].map((dur) => (
                    <button
                      key={dur.id}
                      type="button"
                      onClick={() => setSelectedDuration(dur.id as any)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        selectedDuration === dur.id
                          ? 'bg-primary/10 border-primary text-primary font-bold'
                          : 'bg-surface border-border text-text-muted hover:text-text'
                      }`}
                    >
                      <span className="text-xs block">{dur.label}</span>
                      <span className="text-[10px] text-text-muted font-normal">{dur.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Context Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-text block">3. Contextual Domain:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'workplace', label: 'Workplace' },
                    { id: 'daily_life', label: 'Daily Life' },
                    { id: 'college', label: 'College' },
                    { id: 'travel', label: 'Travel' },
                    { id: 'professional', label: 'Interviews' },
                    { id: 'random', label: 'Random Mix' },
                  ].map((ctx) => (
                    <button
                      key={ctx.id}
                      type="button"
                      onClick={() => setSelectedContext(ctx.id)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold capitalize transition-all ${
                        selectedContext === ctx.id
                          ? 'bg-primary/10 border-primary text-primary font-bold'
                          : 'bg-surface border-border text-text-muted hover:text-text'
                      }`}
                    >
                      {ctx.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleStartWorkout}
                className="w-full py-3.5 rounded-2xl bg-primary text-white font-bold text-xs hover:bg-primary-hover shadow-xs transition-all flex items-center justify-center gap-2 mt-4"
              >
                <Sparkles size={16} />
                <span>Generate & Start Personalized Workout</span>
              </button>
            </div>
          ) : isRunning && !workoutFinished ? (
            /* Active Workout Step Runner */
            <div className="space-y-5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                  Step {currentStep + 1} of {workoutSteps.length} • {workoutSteps[currentStep].type}
                </span>
                <span className="font-semibold text-text-muted">
                  {workoutSteps[currentStep].durationSec}s target
                </span>
              </div>

              <div className="p-6 rounded-3xl bg-surface border border-border text-center space-y-3">
                <h4 className="text-base sm:text-lg font-black text-text">
                  {workoutSteps[currentStep].title}
                </h4>
                <p className="text-xs text-text-muted max-w-sm mx-auto">
                  Focus on clear sentence structure, eliminating hesitation pauses, and using natural connectors.
                </p>
              </div>

              <button
                type="button"
                onClick={handleNextStep}
                className="w-full py-3 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-hover shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <span>Complete Step & Continue</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            /* Workout Result Screen (Requirement 43) */
            <div className="p-6 text-center space-y-5 animate-in fade-in">
              <div className="w-14 h-14 rounded-3xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                <CheckCircle2 size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-text">Workout Completed!</h3>
                <p className="text-xs text-text-muted">
                  Completed 5 activities • +75 XP earned
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-left text-xs">
                <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block">Strong Areas:</span>
                  <p className="text-text-muted">Vocabulary Collocations, Speech Cadence</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1">
                  <span className="font-bold text-amber-600 dark:text-amber-400 block">Practice More:</span>
                  <p className="text-text-muted">Definite Articles, Past Tense Verbs</p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-hover transition-all"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
