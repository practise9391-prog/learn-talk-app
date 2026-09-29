import React, { useState } from 'react';
import { Lesson } from '../../types';
import { AudioPlayer } from '../common/AudioPlayer';
import { VoiceButton, VoiceButtonState } from '../common/VoiceButton';
import { ConceptAnimation } from './ConceptAnimation';
import { useUser } from '../../context/UserContext';
import { useNavigation } from '../../context/NavigationContext';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Volume2,
  Mic,
  Sparkles,
  HelpCircle,
  Lightbulb,
  Award,
} from 'lucide-react';

interface LessonPlayerShellProps {
  lesson: Lesson;
}

export const LessonPlayerShell: React.FC<LessonPlayerShellProps> = ({ lesson }) => {
  const { completeLesson, addSpokenMinutes } = useUser();
  const { navigate } = useNavigation();

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [voiceState, setVoiceState] = useState<VoiceButtonState>('idle');
  const [hasRecordedTurn, setHasRecordedTurn] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(lesson.completed);

  const steps = [
    { id: 'learn', title: '1. Learn', description: 'Core Concept & Why it Matters' },
    { id: 'see', title: '2. See Examples', description: 'Visual Grammar Structure' },
    { id: 'listen', title: '3. Listen', description: 'Native Pronunciation & Tone' },
    { id: 'repeat', title: '4. Repeat', description: 'Shadowing & Mouth Articulation' },
    { id: 'practice', title: '5. Practice', description: 'Interactive Sentence Building' },
    { id: 'speak', title: '6. Speak', description: 'Produce Your Own Spoken Thought' },
    { id: 'converse', title: '7. Converse', description: 'Natural AI Dialogue' },
    { id: 'correct', title: '8. AI Correction', description: 'Constructive Feedback & Nuance' },
    { id: 'review', title: '9. Review', description: 'Saved Mistake & Mastery Confirmation' },
  ];

  const currentStep = steps[currentStepIndex];

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setIsCompleted(true);
      completeLesson(lesson.id);
      addSpokenMinutes(2);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const toggleRecording = () => {
    if (voiceState === 'idle') {
      setVoiceState('listening');
      setTimeout(() => setVoiceState('recording'), 500);
    } else if (voiceState === 'recording') {
      setVoiceState('processing');
      setTimeout(() => {
        setVoiceState('idle');
        setHasRecordedTurn(true);
      }, 1500);
    }
  };

  return (
    <div className="rounded-3xl bg-card border border-border p-6 sm:p-8 max-w-4xl mx-auto shadow-sm">
      {/* Header with Step Progress Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-border">
        <div>
          <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">
            {lesson.category.toUpperCase()} MASTERCLASS
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-text mt-0.5">
            {lesson.title}
          </h2>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-bold text-text-muted bg-surface px-3 py-1 rounded-full border border-border">
            Step {currentStepIndex + 1} of {steps.length}
          </span>
        </div>
      </div>

      {/* 9-Step Progress Track */}
      <div className="grid grid-cols-9 gap-1 my-5">
        {steps.map((s, idx) => (
          <div
            key={s.id}
            onClick={() => setCurrentStepIndex(idx)}
            className="cursor-pointer group flex flex-col items-center"
            title={`${s.title}: ${s.description}`}
          >
            <div
              className={`w-full h-2 rounded-full transition-all duration-300 ${
                idx === currentStepIndex
                  ? 'bg-primary ring-2 ring-primary/30'
                  : idx < currentStepIndex || isCompleted
                  ? 'bg-emerald-500'
                  : 'bg-slate-200 dark:bg-slate-800'
              }`}
            />
            <span
              className={`text-[9px] font-bold mt-1 hidden sm:block ${
                idx === currentStepIndex
                  ? 'text-primary'
                  : idx < currentStepIndex
                  ? 'text-emerald-500'
                  : 'text-text-muted'
              }`}
            >
              {idx + 1}
            </span>
          </div>
        ))}
      </div>

      {/* Dynamic Content View based on active step */}
      <div className="py-6 min-h-[340px] flex flex-col justify-between">
        {currentStepIndex === 0 && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/20">
              <Lightbulb className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-bold text-text">The Concept</h3>
                <p className="text-sm text-text-muted mt-1 leading-relaxed">
                  {lesson.conceptSummary}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-border">
              <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                Why this matters in real conversation:
              </h4>
              <p className="text-sm text-text leading-relaxed">
                When you translate directly from your mother tongue, you might say "I want tea" or "I am having doubt". In English, polite conversational conventions use modal expressions such as "I'd like..." or "I have a question."
              </p>
            </div>
          </div>
        )}

        {currentStepIndex === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-text">Visual Grammar & Structure</h3>
            <ConceptAnimation type="svo" />
          </div>
        )}

        {currentStepIndex === 2 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-text">Listen to Natural Speech</h3>
            <p className="text-xs text-text-muted">
              Listen carefully to the rhythm, intonation, and where the speaker pauses.
            </p>

            <AudioPlayer
              title="Daily Routine: Morning Narrative"
              duration="0:18"
              className="mt-2"
            />

            <div className="p-4 rounded-2xl bg-surface border border-border text-xs space-y-2">
              <div className="font-bold text-text">Transcript:</div>
              <p className="italic text-text-muted">
                "Every morning, I usually get up around 7 o'clock. I drink a glass of water, and then I go for a quick twenty-minute walk before getting ready."
              </p>
            </div>
          </div>
        )}

        {currentStepIndex === 3 && (
          <div className="space-y-4 text-center">
            <h3 className="text-base font-bold text-text">Shadowing & Repeat</h3>
            <p className="text-xs text-text-muted max-w-md mx-auto">
              Tap the microphone and repeat the sentence out loud. Don't worry about being perfect.
            </p>

            <div className="py-4">
              <span className="text-lg sm:text-xl font-bold text-primary block mb-6">
                "Every morning, I usually get up around 7 o'clock."
              </span>

              <VoiceButton
                state={voiceState}
                onClick={toggleRecording}
                size="giant"
                label="Tap to Repeat Out Loud"
              />
            </div>

            {hasRecordedTurn && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                ✓ Recorded clearly. Great natural rhythm!
              </div>
            )}
          </div>
        )}

        {currentStepIndex === 4 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-text">Interactive Practice: Form Your Thought</h3>
            <p className="text-xs text-text-muted">
              Which phrase sounds most natural when telling a friend about your routine?
            </p>

            <div className="space-y-2.5 mt-3">
              {[
                { text: "I am waking up at 7 AM daily.", correct: false, note: "Present continuous implies right now, not a daily routine." },
                { text: "I usually wake up around 7 AM.", correct: true, note: "Correct! Simple present with frequency adverb 'usually' is natural." },
                { text: "Daily I wake up at 7 o'clock time.", correct: false, note: "Unnecessary repetition: 'o'clock' already specifies time." },
              ].map((opt, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl border border-border bg-surface hover:border-primary/50 cursor-pointer transition-all"
                >
                  <div className="text-sm font-bold text-text">{opt.text}</div>
                  <div className="text-xs text-text-muted mt-1">{opt.note}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStepIndex >= 5 && currentStepIndex <= 7 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-text">AI Conversational Practice</h3>
              <span className="text-xs font-bold text-primary">Context: Daily Routine</span>
            </div>

            <div className="p-4 rounded-2xl bg-surface border border-border space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-lg shrink-0">
                  🤖
                </div>
                <div className="p-3 rounded-2xl bg-card border border-border text-xs text-text max-w-md">
                  "Hi Pavan! Tell me, what is the very first thing you do right after your alarm rings in the morning?"
                </div>
              </div>

              {hasRecordedTurn && (
                <div className="flex items-start gap-3 justify-end">
                  <div className="p-3 rounded-2xl bg-primary text-primary-foreground text-xs max-w-md">
                    "I turn off the alarm, drink some warm water, and then stretch for 5 minutes."
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-text shrink-0">
                    YOU
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center pt-2">
              <VoiceButton
                state={voiceState}
                onClick={toggleRecording}
                size="md"
                label={hasRecordedTurn ? "Speak another turn" : "Answer using your microphone"}
              />
            </div>
          </div>
        )}

        {currentStepIndex === 8 && (
          <div className="space-y-4 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2 text-3xl">
              <Award className="w-9 h-9" />
            </div>

            <h3 className="text-xl font-black text-text">
              Lesson Complete!
            </h3>
            <p className="text-sm text-text-muted max-w-md mx-auto">
              You've completed all 9 steps of the learning loop: learned the concept, listened to native speech, practiced shadowing, and applied it in speech.
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={16} />
              <span>+50 XP Earned • 2 Spoken Minutes Added</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-5 border-t border-border mt-4">
        <button
          type="button"
          onClick={handlePrevStep}
          disabled={currentStepIndex === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border text-xs font-bold text-text-muted hover:text-text hover:bg-surface disabled:opacity-30 disabled:pointer-events-none transition-all"
        >
          <ArrowLeft size={14} />
          <span>Previous Step</span>
        </button>

        <button
          type="button"
          onClick={
            currentStepIndex === steps.length - 1
              ? () => navigate('/learn')
              : handleNextStep
          }
          className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md shadow-primary/20 hover:bg-primary-hover active:scale-98 transition-all"
        >
          <span>
            {currentStepIndex === steps.length - 1
              ? 'Return to Curriculum'
              : 'Continue to Next Step'}
          </span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
