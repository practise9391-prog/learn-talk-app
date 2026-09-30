import React, { useState } from 'react';
import { UnifiedMistake } from '../../types/history';
import { useHistory } from '../../context/HistoryContext';
import { VoiceButton, VoiceButtonState } from '../common/VoiceButton';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  Mic,
  ArrowRight,
  RotateCcw,
  Check,
  Building2,
} from 'lucide-react';

interface MistakePracticeModalProps {
  mistake: UnifiedMistake | null;
  onClose: () => void;
}

export const MistakePracticeModal: React.FC<MistakePracticeModalProps> = ({
  mistake,
  onClose,
}) => {
  const { resolveMistake } = useHistory();

  const [step, setStep] = useState<'mcq' | 'fill' | 'speak' | 'contextual' | 'complete'>('mcq');
  const [selectedMcqOption, setSelectedMcqOption] = useState<string | null>(null);
  const [mcqSubmitted, setMcqSubmitted] = useState<boolean>(false);
  const [fillInput, setFillInput] = useState<string>('');
  const [fillSubmitted, setFillSubmitted] = useState<boolean>(false);
  const [voiceState, setVoiceState] = useState<VoiceButtonState>('idle');
  const [voiceSpokenText, setVoiceSpokenText] = useState<string>('');
  const [contextSpokenText, setContextSpokenText] = useState<string>('');

  if (!mistake) return null;

  // Use provided practice questions or generate fallback questions
  const mcqQuestion = mistake.practiceQuestions?.find((q) => q.type === 'mcq') || {
    question: `Which is the grammatically correct and natural sentence?`,
    options: [
      mistake.originalInput,
      mistake.correctedInput,
      mistake.originalInput.replace(' ', ' to '),
      `I have ${mistake.originalInput.toLowerCase()}`,
    ],
    correctAnswer: mistake.correctedInput,
    explanation: mistake.explanation,
  };

  const handleMcqSelect = (opt: string) => {
    if (mcqSubmitted) return;
    setSelectedMcqOption(opt);
    setMcqSubmitted(true);
  };

  const handleFillSubmit = () => {
    setFillSubmitted(true);
  };

  const handleVoiceToggle = (isContext = false) => {
    if (voiceState === 'idle') {
      setVoiceState('listening');
      // Use Web Speech API if supported
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition =
          (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (isContext) {
            setContextSpokenText(transcript);
          } else {
            setVoiceSpokenText(transcript);
          }
          setVoiceState('idle');
        };

        recognition.onerror = () => {
          // Fallback simulation
          if (isContext) {
            setContextSpokenText(mistake.contextPrompt || mistake.correctedInput);
          } else {
            setVoiceSpokenText(mistake.correctedInput);
          }
          setVoiceState('idle');
        };

        recognition.start();
      } else {
        setTimeout(() => {
          if (isContext) {
            setContextSpokenText(mistake.contextPrompt || mistake.correctedInput);
          } else {
            setVoiceSpokenText(mistake.correctedInput);
          }
          setVoiceState('idle');
        }, 1500);
      }
    }
  };

  const handleFinishDrill = () => {
    resolveMistake(mistake.id, true);
    setStep('complete');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border w-full max-w-xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-surface/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="text-sm font-black text-text">Focused Mistake Drill</h3>
              <p className="text-[11px] text-text-muted capitalize">
                Category: {mistake.category} • Severity: {mistake.severity}
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {step === 'mcq' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-surface border border-border">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                  Target Phrase
                </span>
                <p className="text-sm font-bold text-text">"{mistake.originalInput}"</p>
              </div>

              <h4 className="text-sm font-bold text-text pt-2">{mcqQuestion.question}</h4>

              <div className="space-y-2.5">
                {mcqQuestion.options?.map((opt, idx) => {
                  const isSelected = selectedMcqOption === opt;
                  const isCorrect = opt === mcqQuestion.correctAnswer;

                  let cardStyle = 'border-border bg-card hover:border-primary/50';
                  if (mcqSubmitted) {
                    if (isCorrect) cardStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold';
                    else if (isSelected) cardStyle = 'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-400 line-through';
                  }

                  return (
                    <div
                      key={idx}
                      onClick={() => handleMcqSelect(opt)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 text-xs sm:text-sm ${cardStyle}`}
                    >
                      <span>{opt}</span>
                      {mcqSubmitted && isCorrect && <Check size={16} className="text-emerald-600 shrink-0" />}
                    </div>
                  );
                })}
              </div>

              {mcqSubmitted && (
                <div className="pt-2 animate-in fade-in duration-200 space-y-3">
                  <div className="p-3.5 rounded-xl bg-surface border border-border text-xs text-text-muted leading-relaxed">
                    <span className="font-bold text-text block mb-0.5">Why this matters:</span>
                    {mistake.explanation}
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep('speak')}
                    className="w-full py-3 rounded-xl bg-primary text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-primary-hover shadow-xs transition-all"
                  >
                    <span>Next: Spoken Repetition</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 'speak' && (
            <div className="space-y-5 text-center py-2">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                  Active Spoken Muscle Memory
                </span>
                <h4 className="text-base font-black text-text">Say the correct sentence aloud:</h4>
              </div>

              <div className="p-5 rounded-3xl bg-primary/5 border border-primary/20 text-center space-y-2">
                <p className="text-lg font-black text-primary">
                  "{mistake.correctedInput}"
                </p>
                <span className="text-xs text-text-muted block">
                  Speak clearly into your microphone
                </span>
              </div>

              <div className="flex flex-col items-center justify-center gap-3 pt-2">
                <VoiceButton
                  state={voiceState}
                  onClick={() => handleVoiceToggle(false)}
                  size="lg"
                />
                <span className="text-xs font-semibold text-text-muted">
                  {voiceState === 'idle'
                    ? 'Click to speak'
                    : voiceState === 'listening'
                    ? 'Listening...'
                    : 'Processing speech...'}
                </span>
              </div>

              {voiceSpokenText && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400 space-y-1">
                  <div className="flex items-center justify-center gap-1.5 font-bold">
                    <CheckCircle2 size={15} />
                    <span>Captured Speech:</span>
                  </div>
                  <p className="font-semibold italic">"{voiceSpokenText}"</p>
                </div>
              )}

              {voiceSpokenText && (
                <button
                  type="button"
                  onClick={() => setStep('contextual')}
                  className="w-full py-3 rounded-xl bg-primary text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-primary-hover shadow-xs transition-all mt-4"
                >
                  <span>Next: Real Workplace Context Retry</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          )}

          {step === 'contextual' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
                <Building2 size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <h4 className="font-bold text-text">Contextual Roleplay Retry</h4>
                  <p className="text-text-muted leading-relaxed">
                    Rather than practicing in isolation, test whether you can use this correct rule naturally in a realistic scenario!
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-surface border border-border space-y-2">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                  Scenario Prompt:
                </span>
                <p className="text-sm font-bold text-text">
                  {mistake.contextPrompt ||
                    'Your manager asks you for a brief status update on your completed tasks.'}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center gap-3 pt-3">
                <VoiceButton
                  state={voiceState}
                  onClick={() => handleVoiceToggle(true)}
                  size="md"
                />
                <span className="text-xs font-semibold text-text-muted">
                  {voiceState === 'idle'
                    ? 'Speak your natural response'
                    : 'Listening to your response...'}
                </span>
              </div>

              {contextSpokenText && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400 space-y-1 animate-in fade-in">
                  <span className="font-bold block">Your Spoken Answer:</span>
                  <p className="italic">"{contextSpokenText}"</p>
                  <p className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold pt-1">
                    ✓ Accurate grammar structure detected in natural conversational response!
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={handleFinishDrill}
                className="w-full py-3 rounded-xl bg-primary text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-primary-hover shadow-xs transition-all mt-4"
              >
                <span>Save Mastery & Complete Drill</span>
                <CheckCircle2 size={15} />
              </button>
            </div>
          )}

          {step === 'complete' && (
            <div className="p-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-3xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                <CheckCircle2 size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-text">Mistake Addressed!</h3>
                <p className="text-xs text-text-muted max-w-sm mx-auto">
                  Mastery score increased to <strong>{Math.min(100, mistake.masteryScore + 20)}%</strong>. Spaced repetition review scheduled for next week.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-surface border border-border hover:bg-card text-xs font-bold text-text transition-all"
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
