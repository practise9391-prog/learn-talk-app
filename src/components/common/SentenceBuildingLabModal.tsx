import React, { useState } from 'react';
import {
  X,
  Layers,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Volume2,
  HelpCircle,
  Languages,
} from 'lucide-react';
import { SENTENCE_BUILDING_EXERCISES } from '../../data/coreJourneyData';
import { SentenceBuildingExercise, SentenceElement } from '../../types/coreJourney';
import { useCoreJourney } from '../../context/CoreJourneyContext';
import { useGamification } from '../../context/GamificationContext';
import { ttsService } from '../../services/aiService';

interface SentenceBuildingLabModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SentenceBuildingLabModal: React.FC<SentenceBuildingLabModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { explanationLanguage } = useCoreJourney();
  const { awardXP } = useGamification();
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const exercise = SENTENCE_BUILDING_EXERCISES[exerciseIndex];

  if (!isOpen) return null;

  const handleAddElement = (id: string) => {
    if (selectedElementIds.includes(id) || submitted) return;
    setSelectedElementIds([...selectedElementIds, id]);
  };

  const handleRemoveElement = (id: string) => {
    if (submitted) return;
    setSelectedElementIds(selectedElementIds.filter((elId) => elId !== id));
  };

  const handleReset = () => {
    setSelectedElementIds([]);
    setSubmitted(false);
    setIsCorrect(false);
  };

  const handleCheck = () => {
    if (selectedElementIds.length === 0) return;
    const correct =
      selectedElementIds.length === exercise.correctSequence.length &&
      selectedElementIds.every((id, idx) => id === exercise.correctSequence[idx]);

    setIsCorrect(correct);
    setSubmitted(true);

    if (correct) {
      awardXP('lesson', exercise.id, 'sentence_assembled', 35, 90);
    }
  };

  const handleNext = () => {
    handleReset();
    setExerciseIndex((prev) => (prev + 1) % SENTENCE_BUILDING_EXERCISES.length);
  };

  const playSpokenAlternative = () => {
    ttsService.speak(exercise.naturalAlternative, { rate: 0.95 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-surface-hover/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">
                Sentence-Building Laboratory
              </h2>
              <p className="text-sm text-text-secondary">
                Assemble sentences from core elements & discover natural conversational phrasing
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
          {/* Situation Brief */}
          <div className="p-5 rounded-2xl bg-surface-hover border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Level: {exercise.level.toUpperCase()}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                Exercise {exerciseIndex + 1} of {SENTENCE_BUILDING_EXERCISES.length}
              </span>
            </div>
            <p className="text-sm text-text-primary font-semibold">
              Situation: {exercise.situationContext}
            </p>
            <p className="text-xs text-text-secondary italic">
              Goal: "{exercise.intendedMeaning}"
            </p>
          </div>

          {/* Construction Bench */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block">
              Your Assembled Sentence:
            </label>
            <div className="min-h-[64px] p-4 bg-background rounded-2xl border-2 border-dashed border-border flex flex-wrap items-center gap-2">
              {selectedElementIds.length === 0 ? (
                <span className="text-xs text-text-tertiary italic">
                  Click the blocks below in order to construct the sentence...
                </span>
              ) : (
                selectedElementIds.map((id) => {
                  const el = exercise.availableElements.find((e) => e.id === id);
                  if (!el) return null;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleRemoveElement(id)}
                      disabled={submitted}
                      className="px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:bg-red-500 transition-colors flex items-center gap-1.5"
                    >
                      <span>{el.text}</span>
                      {!submitted && <span className="text-[10px] opacity-70">×</span>}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Available Word Blocks */}
          {!submitted && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block">
                Available Sentence Elements:
              </label>
              <div className="flex flex-wrap gap-2.5">
                {exercise.availableElements.map((el) => {
                  const isSelected = selectedElementIds.includes(el.id);
                  return (
                    <button
                      key={el.id}
                      type="button"
                      onClick={() => handleAddElement(el.id)}
                      disabled={isSelected}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'opacity-40 bg-surface border-border cursor-not-allowed'
                          : 'bg-surface hover:bg-card border-border hover:border-primary text-text-primary shadow-xs'
                      }`}
                    >
                      <span className="text-xs font-bold block">{el.text}</span>
                      <span className="text-[10px] text-text-tertiary block mt-0.5">
                        {el.type.replace('_', ' ')}
                      </span>
                      {explanationLanguage === 'telugu' && el.teluguTranslation && (
                        <span className="text-[10px] text-primary/80 block">
                          {el.teluguTranslation}
                        </span>
                      )}
                      {explanationLanguage === 'hindi' && el.hindiTranslation && (
                        <span className="text-[10px] text-primary/80 block">
                          {el.hindiTranslation}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 border border-border rounded-xl text-xs font-semibold text-text-secondary hover:bg-surface transition-colors"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleCheck}
                  disabled={selectedElementIds.length === 0}
                  className="px-6 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  Check Assembly
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Result & Why Better Comparison */}
          {submitted && (
            <div className="space-y-4 animate-fadeIn">
              <div
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  isCorrect
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  {isCorrect ? 'Correct Grammatical Assembly!' : 'Close! Review the word order:'}
                </div>
                <button
                  type="button"
                  onClick={playSpokenAlternative}
                  className="flex items-center gap-1.5 px-3 py-1 bg-surface border border-border rounded-lg text-xs font-semibold text-text-primary hover:bg-surface-hover"
                >
                  <Volume2 className="w-3.5 h-3.5 text-primary" /> Hear Native Audio
                </button>
              </div>

              {/* Standard vs Natural Contrast */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-background rounded-xl border border-border space-y-1">
                  <span className="font-bold text-text-tertiary uppercase tracking-wider text-[10px] block">
                    Standard Textbook Phrasing
                  </span>
                  <p className="text-text-secondary font-medium">
                    "{exercise.standardSentence}"
                  </p>
                </div>
                <div className="p-3.5 bg-primary/5 rounded-xl border border-primary/20 space-y-1">
                  <span className="font-bold text-primary uppercase tracking-wider text-[10px] block flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Natural Native Polish
                  </span>
                  <p className="text-text-primary font-bold">
                    "{exercise.naturalAlternative}"
                  </p>
                </div>
              </div>

              {/* Explanation Why Better */}
              <div className="p-4 bg-background rounded-xl border border-border text-xs space-y-1.5">
                <span className="font-bold text-text-primary block text-[11px] uppercase tracking-wider">
                  Why the Natural Version Works Better:
                </span>
                <p className="text-text-secondary leading-relaxed">
                  {exercise.explanationWhyBetter}
                </p>
                {explanationLanguage === 'telugu' && exercise.teluguExplanation && (
                  <p className="text-primary/90 font-medium pt-1">
                    తెలుగు వివరణ: {exercise.teluguExplanation}
                  </p>
                )}
                {explanationLanguage === 'hindi' && exercise.hindiExplanation && (
                  <p className="text-primary/90 font-medium pt-1">
                    हिंदी स्पष्टीकरण: {exercise.hindiExplanation}
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 border border-border rounded-xl text-xs font-semibold text-text-secondary hover:bg-surface transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retry
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-hover transition-colors flex items-center gap-1.5"
                >
                  Next Exercise <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
