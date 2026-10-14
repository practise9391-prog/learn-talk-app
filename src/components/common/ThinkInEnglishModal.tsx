import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Volume2,
  Mic,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import { THINK_IN_ENGLISH_EXERCISES } from '../../data/coreJourneyData';
import { ThinkInEnglishItem } from '../../types/coreJourney';
import { useCoreJourney } from '../../context/CoreJourneyContext';
import { useGamification } from '../../context/GamificationContext';
import { ttsService } from '../../services/aiService';
import { DictationMicButton } from '../proLab/DictationMicButton';

interface ThinkInEnglishModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThinkInEnglishModal: React.FC<ThinkInEnglishModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { explanationLanguage } = useCoreJourney();
  const { awardXP } = useGamification();
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [trainingStep, setTrainingStep] = useState<1 | 2 | 3 | 4>(1);
  const [userSpokenText, setUserSpokenText] = useState('');
  const [completed, setCompleted] = useState(false);

  const item = THINK_IN_ENGLISH_EXERCISES[exerciseIndex];

  if (!isOpen) return null;

  const playPromptAudio = () => {
    ttsService.speak(item.audioPromptSentence, { rate: 0.95 });
  };

  const playQuestionAudio = () => {
    ttsService.speak(item.audioQuestionPrompt, { rate: 0.95 });
  };

  const handleNextStep = () => {
    if (trainingStep === 1) {
      setTrainingStep(2);
      playQuestionAudio();
    } else if (trainingStep === 2) {
      setTrainingStep(3);
    } else if (trainingStep === 3) {
      setTrainingStep(4);
      setCompleted(true);
      awardXP('speaking', item.id, 'think_in_english', 40, 100);
    }
  };

  const handleNextExercise = () => {
    setTrainingStep(1);
    setUserSpokenText('');
    setCompleted(false);
    setExerciseIndex((prev) => (prev + 1) % THINK_IN_ENGLISH_EXERCISES.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-surface-hover/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">
                Think-in-English Training
              </h2>
              <p className="text-sm text-text-secondary">
                Connect visuals directly to English words without translating in your head
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-tertiary hover:text-text-primary rounded-lg hover:bg-surface-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Visual Focus Card */}
          <div className="text-center p-8 bg-surface-hover rounded-3xl border border-border space-y-3">
            <span className="text-7xl block animate-bounce-subtle">{item.iconOrVisual}</span>
            <h3 className="text-xl font-black text-text-primary">{item.objectName}</h3>
            <p className="text-xs text-text-secondary">
              Direct Concept: <strong className="text-primary">{item.targetWord}</strong>
            </p>
          </div>

          {/* Step 1: See & Hear */}
          {trainingStep === 1 && (
            <div className="space-y-4 text-center">
              <div className="p-4 bg-background rounded-2xl border border-border space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary block">
                  Step 1: See & Hear the Concept
                </span>
                <p className="text-base font-bold text-text-primary italic">
                  "{item.audioPromptSentence}"
                </p>
                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={playPromptAudio}
                    className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-bold transition-colors"
                  >
                    <Volume2 className="w-4 h-4" /> Listen to Model Audio
                  </button>
                </div>
              </div>

              {explanationLanguage === 'telugu' && item.teluguHelp && (
                <p className="text-xs text-text-secondary italic">
                  చిట్కా: {item.teluguHelp}
                </p>
              )}
              {explanationLanguage === 'hindi' && item.hindiHelp && (
                <p className="text-xs text-text-secondary italic">
                  सुझाव: {item.hindiHelp}
                </p>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-hover flex items-center gap-1.5 transition-colors"
                >
                  Continue to Speak <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Prompt Question */}
          {trainingStep === 2 && (
            <div className="space-y-4">
              <div className="p-4 bg-background rounded-2xl border border-border space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-primary block">
                  Step 2: Answer the Spoken Question
                </span>
                <p className="text-sm font-semibold text-text-primary">
                  Coach asks: "{item.audioQuestionPrompt}"
                </p>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={playQuestionAudio}
                    className="flex items-center gap-1.5 text-xs text-primary font-bold hover:underline"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Replay Question
                  </button>
                  <DictationMicButton
                    onTranscript={(txt) =>
                      setUserSpokenText((prev) => (prev ? `${prev} ${txt}` : txt))
                    }
                    label="Speak Your Answer"
                  />
                </div>

                <textarea
                  rows={2}
                  value={userSpokenText}
                  onChange={(e) => setUserSpokenText(e.target.value)}
                  placeholder="Speak or type your answer in English..."
                  className="w-full p-3 bg-surface border border-border rounded-xl text-text-primary text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-hover flex items-center gap-1.5 transition-colors"
                >
                  Check & Describe <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Describe & Expand */}
          {trainingStep === 3 && (
            <div className="space-y-4">
              <div className="p-4 bg-background rounded-2xl border border-border space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary block">
                  Step 3: Benchmark Model Response
                </span>
                <p className="text-sm font-bold text-text-primary italic">
                  "{item.modelSpokenResponse}"
                </p>
                <div className="pt-2">
                  <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block">
                    Conversation Extension Challenge:
                  </span>
                  <p className="text-xs text-text-primary mt-1">
                    "{item.conversationExtension}"
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-hover flex items-center gap-1.5 transition-colors"
                >
                  Complete Object Training <CheckCircle2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Finished */}
          {completed && (
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
              <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                Think-in-English Milestone Complete (+40 XP)
              </div>
              <p className="text-xs text-text-secondary max-w-md mx-auto">
                By seeing objects and saying their English names immediately, your brain skips mother-tongue translation, building natural fluency!
              </p>
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={handleNextExercise}
                  className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-hover transition-colors flex items-center gap-1.5"
                >
                  Next Visual Concept <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

