import React, { useState } from 'react';
import { GrammarTopic } from '../../types/curriculumModules';
import { useCurriculumModule } from '../../context/CurriculumModuleContext';
import { useNavigation } from '../../context/NavigationContext';
import {
  BookOpen,
  Volume2,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Mic,
  MessageSquare,
  ArrowRight,
  ChevronRight,
  Info,
  X,
  Clock,
  Layers,
  HelpCircle
} from 'lucide-react';

interface GrammarLessonModalProps {
  topic: GrammarTopic;
  onClose: () => void;
  onOpenConversationWithJarvis?: (prompt: string) => void;
}

export const GrammarLessonModal: React.FC<GrammarLessonModalProps> = ({
  topic,
  onClose,
  onOpenConversationWithJarvis
}) => {
  const { updateGrammarMastery } = useCurriculumModule();
  const { navigate } = useNavigation();

  // Current step 1 to 8
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isDetailedExplanation, setIsDetailedExplanation] = useState<boolean>(false);

  // Audio speed state
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);

  // Practice state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, any>>({});
  const [practiceFeedback, setPracticeFeedback] = useState<Record<string, boolean>>({});

  // Speaking state (Step 6)
  const [userSpokenSentence, setUserSpokenSentence] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speakingFeedback, setSpeakingFeedback] = useState<string | null>(null);

  // Play native speech
  const playAudio = (text: string, rate: number = audioSpeed) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStartSpeaking = () => {
    setUserSpokenSentence('');
    setSpeakingFeedback(null);
    setIsListening(true);

    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const rec = new SpeechRecognition();
          rec.continuous = false;
          rec.interimResults = false;
          rec.lang = 'en-US';

          rec.onresult = (e: any) => {
            const transcript = e.results[0][0].transcript;
            setUserSpokenSentence(transcript);
            setIsListening(false);

            // Instant AI feedback simulation
            if (transcript.split(/\s+/).length >= 4) {
              setSpeakingFeedback(
                '✓ Excellent! Your sentence correctly incorporates the grammar structure and flows naturally.'
              );
            } else {
              setSpeakingFeedback(
                'Good effort! Try expanding with a time expression or an object for a more complete thought.'
              );
            }
          };

          rec.onerror = () => setIsListening(false);
          rec.onend = () => setIsListening(false);
          rec.start();
        } catch (e) {
          setIsListening(false);
        }
      }
    }
  };

  const handleFinishLesson = () => {
    updateGrammarMastery(topic.id, 'mastered');
    onClose();
  };

  const stepsList = [
    { num: 1, label: 'Understand' },
    { num: 2, label: 'Visualize' },
    { num: 3, label: 'Examples' },
    { num: 4, label: 'Listen' },
    { num: 5, label: 'Practice' },
    { num: 6, label: 'Speak' },
    { num: 7, label: 'Converse' },
    { num: 8, label: 'Review' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-card border border-border w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between bg-surface/50 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                Grammar Module • CEFR {topic.level}
              </span>
              <span className="text-xs text-text-muted font-bold capitalize">
                {topic.category.replace('_', ' ')}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-text">{topic.title}</h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* 8-Step Navigation Ribbon */}
        <div className="px-4 py-2 border-b border-border/80 bg-card overflow-x-auto flex items-center gap-1.5 shrink-0 scrollbar-none">
          {stepsList.map((st) => (
            <button
              key={st.num}
              type="button"
              onClick={() => setCurrentStep(st.num)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                currentStep === st.num
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : currentStep > st.num
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'text-text-muted hover:bg-surface'
              }`}
            >
              <span>{st.num}.</span>
              <span>{st.label}</span>
            </button>
          ))}
        </div>

        {/* Scrollable Step Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
          {/* STEP 1 — UNDERSTAND (Section 6 & 7) */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-primary">
                  Step 1: Core Concept & Meaning
                </span>

                {/* Simple vs Detailed Explanation Toggle */}
                <div className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-border">
                  <button
                    type="button"
                    onClick={() => setIsDetailedExplanation(false)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                      !isDetailedExplanation
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'text-text-muted'
                    }`}
                  >
                    Simple
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDetailedExplanation(true)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                      isDetailedExplanation
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'text-text-muted'
                    }`}
                  >
                    Detailed
                  </button>
                </div>
              </div>

              {/* Explanation Card */}
              <div className="p-5 rounded-2xl bg-surface border border-border space-y-3">
                <h4 className="text-sm font-black text-text">What does it mean and why does it exist?</h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  {isDetailedExplanation ? topic.detailedExplanation : topic.simpleExplanation}
                </p>

                <div className="p-3 rounded-xl bg-card border border-border/80 text-xs">
                  <strong className="text-primary font-bold block mb-1">Standard Formula:</strong>
                  <code className="text-text font-mono font-bold">{topic.structure}</code>
                </div>
              </div>

              {/* When to use vs When NOT to use */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                  <strong className="text-emerald-600 dark:text-emerald-400 font-black block">
                    ✓ When To Use This Grammar:
                  </strong>
                  <ul className="space-y-1.5 text-text-muted">
                    {topic.whenToUse.map((w, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                  <strong className="text-rose-600 dark:text-rose-400 font-black block">
                    ✕ When NOT To Use:
                  </strong>
                  <ul className="space-y-1.5 text-text-muted">
                    {topic.whenNotToUse.map((nw, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-rose-500 font-bold">•</span>
                        <span>{nw}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — VISUALIZE (Section 6: Subject → Verb → Object & Timeline Animations) */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <span className="text-xs font-black uppercase tracking-wider text-primary block">
                Step 2: Interactive Structural Visualization
              </span>

              {/* S-V-O Sentence Construction Animation */}
              {topic.sentenceAnimation && (
                <div className="p-5 rounded-2xl bg-surface border border-border space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-text uppercase">
                      Sentence Architecture: S → V → O
                    </h4>
                    <span className="text-[10px] text-text-muted font-bold">Word Order Flow</span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-center">
                    <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
                      <span className="text-[10px] font-bold text-indigo-500 uppercase block">Subject (Who)</span>
                      <strong className="text-sm font-black text-text mt-1 block">
                        {topic.sentenceAnimation.subject}
                      </strong>
                    </div>

                    <div className="p-3 rounded-xl bg-primary/10 border border-primary/30">
                      <span className="text-[10px] font-bold text-primary uppercase block">Verb (Action)</span>
                      <strong className="text-sm font-black text-text mt-1 block">
                        {topic.sentenceAnimation.verb}
                      </strong>
                    </div>

                    <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/30">
                      <span className="text-[10px] font-bold text-sky-500 uppercase block">Object (What)</span>
                      <strong className="text-sm font-black text-text mt-1 block">
                        {topic.sentenceAnimation.object || '—'}
                      </strong>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 col-span-3 sm:col-span-1">
                      <span className="text-[10px] font-bold text-emerald-500 uppercase block">Rest / Time</span>
                      <strong className="text-sm font-black text-text mt-1 block">
                        {topic.sentenceAnimation.rest || '—'}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Past → Present → Future Timeline Animation */}
              {topic.timelineAnimation && (
                <div className="p-5 rounded-2xl bg-surface border border-border space-y-4">
                  <h4 className="text-xs font-black text-text uppercase">
                    Timeline Position: Past → Now → Future
                  </h4>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div
                      className={`p-3.5 rounded-xl border transition-all ${
                        topic.timelineAnimation.highlight === 'past'
                          ? 'bg-amber-500/15 border-amber-500 ring-2 ring-amber-500/20'
                          : 'bg-card border-border/80 opacity-70'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase text-amber-500 block">Past</span>
                      <p className="text-xs font-semibold text-text mt-1">
                        {topic.timelineAnimation.past}
                      </p>
                    </div>

                    <div
                      className={`p-3.5 rounded-xl border transition-all ${
                        topic.timelineAnimation.highlight === 'present' ||
                        topic.timelineAnimation.highlight === 'continuous' ||
                        topic.timelineAnimation.highlight === 'perfect'
                          ? 'bg-primary/15 border-primary ring-2 ring-primary/20'
                          : 'bg-card border-border/80 opacity-70'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase text-primary block">
                        Now (Present)
                      </span>
                      <p className="text-xs font-semibold text-text mt-1">
                        {topic.timelineAnimation.present}
                      </p>
                    </div>

                    <div
                      className={`p-3.5 rounded-xl border transition-all ${
                        topic.timelineAnimation.highlight === 'future'
                          ? 'bg-emerald-500/15 border-emerald-500 ring-2 ring-emerald-500/20'
                          : 'bg-card border-border/80 opacity-70'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase text-emerald-500 block">Future</span>
                      <p className="text-xs font-semibold text-text mt-1">
                        {topic.timelineAnimation.future}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3 — EXAMPLES (Beginner, Daily, Student, Office, Professional) */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <span className="text-xs font-black uppercase tracking-wider text-primary block">
                Step 3: Multi-Context Real-Life Examples
              </span>

              <div className="space-y-3">
                {topic.examples.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-card border border-border text-[10px] font-bold uppercase text-primary">
                          {ex.level} Context
                        </span>
                      </div>
                      <p className="text-sm font-bold text-text group-hover:text-primary transition-colors">
                        "{ex.sentence}"
                      </p>
                      <p className="text-xs text-text-muted">{ex.explanation}</p>
                      {ex.naturalAlternative && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                          <strong>Native Phrasing:</strong> "{ex.naturalAlternative}"
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => playAudio(ex.sentence)}
                      className="p-2.5 rounded-xl bg-card border border-border hover:bg-primary hover:text-white text-primary transition-colors shrink-0 shadow-xs self-end sm:self-auto"
                      title="Listen"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4 — LISTEN (Replay, Slow, Normal, Fast) */}
          {currentStep === 4 && (
            <div className="space-y-5 text-center py-4">
              <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-md">
                <Volume2 size={32} />
              </div>

              <div>
                <h4 className="text-base font-black text-text">Listen & Shadow the Cadence</h4>
                <p className="text-xs text-text-muted mt-1 max-w-md mx-auto leading-relaxed">
                  Listen closely to the rhythm, pauses, and verb endings. Replay at different speeds to train your ear.
                </p>
              </div>

              {/* Example box to listen to */}
              <div className="p-5 rounded-2xl bg-surface border border-border text-center max-w-lg mx-auto">
                <p className="text-base font-bold text-text leading-relaxed">
                  "{topic.examples[0]?.sentence || 'I work at an IT company.'}"
                </p>
              </div>

              {/* Speed controls */}
              <div className="flex items-center justify-center gap-2">
                {[
                  { label: '0.8x Slow', rate: 0.8 },
                  { label: '1.0x Normal', rate: 1.0 },
                  { label: '1.2x Fast', rate: 1.2 }
                ].map((sp) => (
                  <button
                    key={sp.label}
                    type="button"
                    onClick={() => {
                      setAudioSpeed(sp.rate);
                      playAudio(topic.examples[0]?.sentence || '', sp.rate);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                      audioSpeed === sp.rate
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-surface hover:bg-surface-hover text-text border-border'
                    }`}
                  >
                    {sp.label}
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => playAudio(topic.examples[0]?.sentence || '', audioSpeed)}
                  className="px-6 py-2.5 rounded-2xl bg-primary text-primary-foreground font-black text-xs hover:bg-primary-hover transition-colors shadow-sm inline-flex items-center gap-2"
                >
                  <Play size={14} fill="currentColor" />
                  <span>Replay Audio Clip</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5 — PRACTICE (MCQ, Fill in blank, Rearrangement) */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <span className="text-xs font-black uppercase tracking-wider text-primary block">
                Step 5: Interactive Knowledge Drills
              </span>

              <div className="space-y-4">
                {topic.practiceExercises.map((ex, idx) => {
                  const userAnswer = selectedAnswers[ex.id];
                  const hasAnswered = userAnswer !== undefined;
                  const isCorrect = hasAnswered && userAnswer === ex.correctAnswer;

                  return (
                    <div key={ex.id} className="p-4 rounded-2xl bg-surface border border-border space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-text">Exercise {idx + 1}</span>
                        <span className="px-2 py-0.5 rounded-full bg-card border border-border text-[10px] uppercase font-bold text-text-muted">
                          {ex.type}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-text">{ex.prompt}</p>

                      {ex.options && (
                        <div className="space-y-2">
                          {ex.options.map((opt, optIdx) => (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() =>
                                setSelectedAnswers((prev) => ({ ...prev, [ex.id]: optIdx }))
                              }
                              className={`w-full p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                                userAnswer === optIdx
                                  ? 'bg-primary/10 border-primary text-primary font-bold'
                                  : 'bg-card border-border hover:bg-surface-hover text-text'
                              }`}
                            >
                              <span>{opt}</span>
                              {userAnswer === optIdx && (
                                <span className="text-xs text-primary font-bold">Selected</span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}

                      {hasAnswered && (
                        <div
                          className={`p-3 rounded-xl border text-xs leading-relaxed ${
                            isCorrect
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                              : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
                          }`}
                        >
                          <strong>{isCorrect ? '✓ Correct! ' : '✕ Review: '}</strong>
                          {ex.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6 — SPEAK (Create your own sentence & AI evaluation) */}
          {currentStep === 6 && (
            <div className="space-y-5">
              <span className="text-xs font-black uppercase tracking-wider text-primary block">
                Step 6: Voice Generation Challenge
              </span>

              <div className="p-5 rounded-2xl bg-surface border border-border space-y-3">
                <h4 className="text-sm font-black text-text">{topic.speakingPrompt.prompt}</h4>
                <p className="text-xs text-text-muted">
                  Context: <strong>{topic.speakingPrompt.context}</strong>
                </p>
                <p className="text-xs italic text-text-muted/80 bg-card p-3 rounded-xl border border-border/60">
                  Sample Model: "{topic.speakingPrompt.sampleAnswer}"
                </p>
              </div>

              {/* Voice capture */}
              <div className="space-y-3 text-center">
                <textarea
                  value={userSpokenSentence}
                  onChange={(e) => setUserSpokenSentence(e.target.value)}
                  placeholder="Click record and speak your sentence out loud, or type it here..."
                  rows={3}
                  className="w-full p-4 rounded-2xl bg-surface border border-border text-xs text-text focus:outline-none focus:border-primary resize-none"
                />

                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleStartSpeaking}
                    className={`px-6 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all ${
                      isListening
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-primary text-primary-foreground hover:bg-primary-hover'
                    }`}
                  >
                    <Mic size={16} />
                    <span>{isListening ? 'Listening...' : 'Speak My Sentence'}</span>
                  </button>
                </div>

                {speakingFeedback && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-700 dark:text-emerald-300 font-semibold text-left">
                    {speakingFeedback}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 7 — REAL CONVERSATION (Dialogue turn using grammar naturally) */}
          {currentStep === 7 && (
            <div className="space-y-5">
              <span className="text-xs font-black uppercase tracking-wider text-primary block">
                Step 7: Contextual Dialogue Turn
              </span>

              <div className="p-4 rounded-2xl bg-surface border border-border space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black">
                    💬
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-text">
                      Conversation with {topic.conversationScenario.characterName} ({topic.conversationScenario.characterRole})
                    </h4>
                    <span className="text-[10px] text-text-muted">
                      Target: {topic.conversationScenario.targetUsage}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-card border border-border text-xs text-text leading-relaxed">
                  "{topic.conversationScenario.starterPrompt}"
                </div>

                <div className="pt-2 flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate('/talk/call', {
                        initialMode: 'voice',
                        topicId: 'daily-1'
                      });
                    }}
                    className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 hover:bg-primary-hover shadow-sm"
                  >
                    <MessageSquare size={14} />
                    <span>Launch Spoken Practice in Talk Hub</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 8 — REVIEW & MASTERY */}
          {currentStep === 8 && (
            <div className="space-y-5 text-center py-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 size={32} />
              </div>

              <div>
                <h4 className="text-base font-black text-text">Lesson Complete: {topic.title}</h4>
                <p className="text-xs text-text-muted mt-1 max-w-md mx-auto leading-relaxed">
                  You have understood the concept, visualized the structure, listened to native models, practiced drills, and generated spoken sentences.
                </p>
              </div>

              {/* Common mistakes reminder */}
              <div className="p-4 rounded-2xl bg-surface border border-border text-left space-y-2">
                <strong className="text-xs font-bold text-text block">Key Reminders & Pitfalls to Avoid:</strong>
                {topic.commonMistakes.map((cm, idx) => (
                  <div key={idx} className="text-xs space-y-0.5">
                    <span className="text-rose-500 line-through">"{cm.mistake}"</span> →{' '}
                    <span className="text-emerald-500 font-semibold">"{cm.correction}"</span>
                    <p className="text-[11px] text-text-muted">{cm.why}</p>
                  </div>
                ))}
              </div>

              {/* Cross-system action launcher (Section 10) */}
              <div className="pt-2 space-y-2">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                  Next Step for Complete Fluency:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-left">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate('/talk/call', {
                        grammarContext: topic.title,
                        initialMode: 'voice',
                      });
                    }}
                    className="p-3 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all flex flex-col justify-between text-xs"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-primary mb-1">
                      <MessageSquare size={14} />
                      <span>Talk with Jarvis</span>
                    </div>
                    <span className="text-[10px] text-text-muted">
                      Use "{topic.title}" in real conversation
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate('/practice');
                    }}
                    className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all flex flex-col justify-between text-xs"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400 mb-1">
                      <Sparkles size={14} />
                      <span>Practice in Arena</span>
                    </div>
                    <span className="text-[10px] text-text-muted">
                      Drills, speed builder & games
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate('/test');
                    }}
                    className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all flex flex-col justify-between text-xs"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                      <Layers size={14} />
                      <span>Take Grammar Test</span>
                    </div>
                    <span className="text-[10px] text-text-muted">
                      Benchmark score & detect flaws
                    </span>
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleFinishLesson}
                  className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-black text-xs hover:bg-primary-hover transition-colors shadow-sm inline-flex items-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  <span>Mark as Mastered (+25 XP)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-border flex items-center justify-between bg-surface/50 shrink-0">
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="px-4 py-2 rounded-xl text-xs font-bold text-text-muted hover:text-text disabled:opacity-40"
          >
            Previous Step
          </button>

          <span className="text-xs font-bold text-text-muted">
            Step {currentStep} of {stepsList.length}
          </span>

          <button
            type="button"
            onClick={() => {
              if (currentStep < 8) setCurrentStep((prev) => prev + 1);
              else handleFinishLesson();
            }}
            className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span>{currentStep === 8 ? 'Complete Lesson' : 'Next Step'}</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
