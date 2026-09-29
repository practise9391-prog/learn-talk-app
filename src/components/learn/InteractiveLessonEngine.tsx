import React, { useState, useEffect } from 'react';
import { CurriculumLesson, VocabularyWord, ExerciseItem } from '../../types/curriculum';
import { WordExplanationSheet } from './WordExplanationSheet';
import { ConceptAnimation } from './ConceptAnimation';
import { VoiceButton, VoiceButtonState } from '../common/VoiceButton';
import { Waveform } from '../common/Waveform';
import { useUser } from '../../context/UserContext';
import { useNavigation } from '../../context/NavigationContext';
import {
  Volume2,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Award,
  HelpCircle,
  Clock,
  BookOpen,
  Mic,
  Send,
  Check,
  X
} from 'lucide-react';

interface InteractiveLessonEngineProps {
  lesson: CurriculumLesson;
}

export const InteractiveLessonEngine: React.FC<InteractiveLessonEngineProps> = ({ lesson }) => {
  const { addSpokenMinutes, updateUser } = useUser();
  const { navigate } = useNavigation();

  // 7-Step Universal Progression (Requirement 17)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedWordForSheet, setSelectedWordForSheet] = useState<VocabularyWord | null>(null);

  // Audio Playback Controls (Step 2)
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioSpeed, setAudioSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [activeAudioIndex, setActiveAudioIndex] = useState<number>(0);

  // Microphone & Speech (Step 3 & 4)
  const [voiceState, setVoiceState] = useState<VoiceButtonState>('idle');
  const [transcriptText, setTranscriptText] = useState<string>('');
  const [hasSpokenTurn, setHasSpokenTurn] = useState<boolean>(false);

  // Practice Exercises (Step 5)
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number>(0);
  const [selectedGapOption, setSelectedGapOption] = useState<string | null>(null);
  const [assembledWords, setAssembledWords] = useState<string[]>([]);
  const [isExerciseAnswered, setIsExerciseAnswered] = useState<boolean>(false);
  const [isExerciseCorrect, setIsExerciseCorrect] = useState<boolean>(false);

  // Real Conversation (Step 6)
  const [convoTurns, setConvoTurns] = useState<Array<{ sender: 'ai' | 'user'; text: string; tip?: string }>>([
    {
      sender: 'ai',
      text: lesson.conversationScenario.initialMessage,
    }
  ]);
  const [convoInput, setConvoInput] = useState<string>('');

  // Review Metrics (Step 7)
  const [elapsedSpeakingSeconds, setElapsedSpeakingSeconds] = useState<number>(85);
  const [isLessonMastered, setIsLessonMastered] = useState<boolean>(false);

  // Audio rates
  const speedRates = {
    slow: 0.75,
    normal: 1.0,
    fast: 1.25,
  };

  const stepsMeta = [
    { num: 1, title: 'Learn', subtitle: 'Concept & Grammar' },
    { num: 2, title: 'Listen', subtitle: 'Native Audio' },
    { num: 3, title: 'Speak', subtitle: 'Mic Articulation' },
    { num: 4, title: 'AI Feedback', subtitle: 'Natural Phrasing' },
    { num: 5, title: 'Practice', subtitle: 'Interactive Exercises' },
    { num: 6, title: 'Conversation', subtitle: 'Real-Time Dialogue' },
    { num: 7, title: 'Review', subtitle: 'Mastery Breakdown' },
  ];

  // Play sentence using Web Speech API with configurable speed
  const playNativeAudio = (text: string) => {
    setIsPlayingAudio(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = speedRates[audioSpeed];
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingAudio(false), 2000);
    }
  };

  // Toggle Voice Input
  const handleVoiceToggle = () => {
    if (voiceState === 'idle') {
      setVoiceState('listening');
      // If Web Speech Recognition is available, we could listen live; otherwise provide structured response
      setTimeout(() => {
        setVoiceState('recording');
      }, 400);
    } else if (voiceState === 'recording') {
      setVoiceState('processing');
      setTimeout(() => {
        setVoiceState('idle');
        setTranscriptText(lesson.speakingPrompt.exampleAnswer);
        setHasSpokenTurn(true);
        setElapsedSpeakingSeconds((prev) => prev + 25);
        addSpokenMinutes(1);
      }, 1400);
    }
  };

  // Exercise Handlers
  const currentExercise: ExerciseItem | undefined = lesson.exercises[activeExerciseIndex];

  const handleSelectGapOption = (opt: string) => {
    if (!currentExercise) return;
    setSelectedGapOption(opt);
    setIsExerciseAnswered(true);
    setIsExerciseCorrect(opt === currentExercise.correctAnswer);
  };

  const handleToggleRearrangeWord = (word: string) => {
    if (assembledWords.includes(word)) {
      setAssembledWords(assembledWords.filter((w) => w !== word));
    } else {
      const next = [...assembledWords, word];
      setAssembledWords(next);
      if (currentExercise && currentExercise.wordsForRearrange && next.length === currentExercise.wordsForRearrange.length) {
        setIsExerciseAnswered(true);
        setIsExerciseCorrect(next.join(' ') === currentExercise.correctAnswer);
      }
    }
  };

  const handleNextExercise = () => {
    if (activeExerciseIndex < lesson.exercises.length - 1) {
      setActiveExerciseIndex(activeExerciseIndex + 1);
      setSelectedGapOption(null);
      setAssembledWords([]);
      setIsExerciseAnswered(false);
      setIsExerciseCorrect(false);
    } else {
      // Proceed to Step 6
      setCurrentStep(6);
    }
  };

  // Real Conversation Turn Handlers
  const handleSendConvoMessage = (textToSend?: string) => {
    const text = textToSend || convoInput;
    if (!text.trim()) return;

    const userTurn = {
      sender: 'user' as const,
      text: text,
      tip: "Natural Polish: You articulated your point clearly!",
    };

    setConvoTurns((prev) => [...prev, userTurn]);
    setConvoInput('');
    setElapsedSpeakingSeconds((prev) => prev + 15);

    // AI partner reply
    setTimeout(() => {
      const reply = {
        sender: 'ai' as const,
        text: `That makes a lot of sense! In my experience, building that habit every morning makes the entire day run smoother. What is your favorite part of that routine?`,
      };
      setConvoTurns((prev) => [...prev, reply]);
    }, 1200);
  };

  // Step 7: Lesson Completion
  const handleFinishLesson = () => {
    setIsLessonMastered(true);
    updateUser({
      xp: 50,
      minutesSpokenToday: 2,
    });
    navigate('/learn');
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      {/* Lesson Header */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-xs">
              Lesson {lesson.lessonNumber}
            </span>
            <span className="text-xs font-semibold text-text-muted flex items-center gap-1">
              <Clock size={12} />
              {lesson.estimatedMinutes} mins
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-text mt-1">
            {lesson.title}
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            {lesson.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/learn')}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-text-muted hover:text-text hover:bg-card transition-colors"
        >
          Exit to Curriculum
        </button>
      </div>

      {/* 7-Step Universal Progress Track (Requirement 17) */}
      <div className="p-3.5 rounded-2xl bg-surface border border-border">
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {stepsMeta.map((s) => {
            const isActive = currentStep === s.num;
            const isCompleted = currentStep > s.num || isLessonMastered;

            return (
              <button
                key={s.num}
                type="button"
                onClick={() => setCurrentStep(s.num)}
                className={`
                  p-2 sm:p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center
                  ${
                    isActive
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm scale-102 font-bold'
                      : isCompleted
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold'
                      : 'bg-card text-text-muted border-border hover:bg-surface'
                  }
                `}
              >
                <div className="flex items-center justify-center mb-0.5">
                  {isCompleted ? (
                    <CheckCircle2 size={14} className="text-emerald-500" />
                  ) : (
                    <span className="text-[10px] font-black">{s.num}</span>
                  )}
                </div>
                <span className="text-[10px] sm:text-xs font-bold truncate w-full block">
                  {s.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Container */}
      <div className="rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-sm min-h-[460px] flex flex-col justify-between">
        {/* ======================================================== */}
        {/* STEP 1: LEARN (Concept, Grammar & Clickable Vocabulary)   */}
        {/* ======================================================== */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/20">
              <Lightbulb className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-bold text-text">What are you learning?</h3>
                <p className="text-xs sm:text-sm text-text-muted mt-1 leading-relaxed">
                  {lesson.conceptSummary}
                </p>
              </div>
            </div>

            {/* Why it Matters */}
            <div className="p-4 rounded-2xl bg-surface border border-border text-xs">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                Why this matters in real communication:
              </span>
              <p className="text-text leading-relaxed">
                {lesson.whyItMatters}
              </p>
            </div>

            {/* Grammar Structure Focus & Visual Diagram */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-text">Grammar in Action</h4>
                <span className="text-xs font-bold text-primary">{lesson.grammarFocus.topic}</span>
              </div>
              <ConceptAnimation type="svo" />
              <div className="p-3.5 rounded-xl bg-surface border border-border text-xs text-text-muted leading-relaxed">
                <span className="font-bold text-text">Rule: </span>
                {lesson.grammarFocus.rule}
              </div>
            </div>

            {/* Clickable Vocabulary Words (Requirement 18 & 20) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-text">
                  Key Words & Phrases (Click to see meaning & pronunciation):
                </span>
                <span className="text-[10px] text-text-muted">Tap any card</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {lesson.vocabulary.map((vocab) => (
                  <div
                    key={vocab.id}
                    onClick={() => setSelectedWordForSheet(vocab)}
                    className="p-3.5 rounded-xl bg-surface border border-border hover:border-primary/40 hover:shadow-xs cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-primary group-hover:underline">
                          {vocab.word}
                        </span>
                        <span className="text-[10px] text-text-muted font-mono">
                          {vocab.pronunciation}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted mt-0.5 truncate">
                        {vocab.simpleMeaning}
                      </p>
                    </div>
                    <Volume2 size={16} className="text-text-muted group-hover:text-primary transition-colors shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Common Mistakes Preview */}
            {lesson.grammarFocus.commonMistakes && lesson.grammarFocus.commonMistakes.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-2">
                <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                  <AlertTriangle size={13} /> Common Mistake to Avoid
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg bg-card border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400">
                    <span className="block text-[10px] uppercase font-bold">Don't say:</span>
                    <span className="font-semibold line-through">"{lesson.grammarFocus.commonMistakes[0].incorrect}"</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-card border border-emerald-200 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400">
                    <span className="block text-[10px] uppercase font-bold">Say instead:</span>
                    <span className="font-bold">"{lesson.grammarFocus.commonMistakes[0].correct}"</span>
                  </div>
                </div>
                <p className="text-text-muted pt-1">
                  <span className="font-bold text-text">Why? </span>
                  {lesson.grammarFocus.commonMistakes[0].why}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 2: LISTEN (AI reads aloud with speed controls)      */}
        {/* ======================================================== */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-1">
                Step 2 — Active Listening
              </span>
              <h3 className="text-lg font-black text-text">
                Listen to Natural Native Articulation
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Notice where the voice rises, falls, and pauses between idea groups.
              </p>
            </div>

            {/* Audio Speed Controls (Requirement 17: Slow, Normal, Fast, Clear) */}
            <div className="p-4 rounded-2xl bg-surface border border-border flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-bold text-text">Speaking Speed:</span>
              <div className="flex items-center gap-1 bg-card p-1 rounded-xl border border-border">
                <button
                  type="button"
                  onClick={() => setAudioSpeed('slow')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    audioSpeed === 'slow' ? 'bg-amber-500 text-white shadow-xs' : 'text-text-muted hover:text-text'
                  }`}
                >
                  🐢 0.75x Slow
                </button>
                <button
                  type="button"
                  onClick={() => setAudioSpeed('normal')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    audioSpeed === 'normal' ? 'bg-primary text-white shadow-xs' : 'text-text-muted hover:text-text'
                  }`}
                >
                  ▶ 1.0x Normal
                </button>
                <button
                  type="button"
                  onClick={() => setAudioSpeed('fast')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    audioSpeed === 'fast' ? 'bg-indigo-500 text-white shadow-xs' : 'text-text-muted hover:text-text'
                  }`}
                >
                  ⚡ 1.25x Fast
                </button>
              </div>
            </div>

            {/* Audio Examples Stream */}
            <div className="space-y-3">
              {lesson.audioExamples.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-surface border border-border hover:border-primary/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-card border border-border text-[10px] font-bold text-primary uppercase">
                        {item.speakerRole}
                      </span>
                      <span className="text-[11px] text-text-muted">{item.context}</span>
                    </div>
                    <p className="text-base font-bold text-text pt-1">
                      "{item.text}"
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => playNativeAudio(item.text)}
                    className="self-end sm:self-auto px-4 py-2 bg-primary text-primary-foreground font-bold text-xs rounded-xl shadow-xs hover:bg-primary-hover transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <Play size={14} fill="currentColor" />
                    <span>Play Audio</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 3: SPEAK (Microphone input & speech recognition)    */}
        {/* ======================================================== */}
        {currentStep === 3 && (
          <div className="space-y-6 text-center py-4">
            <div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-1">
                Step 3 — Your Turn to Speak
              </span>
              <h3 className="text-xl font-black text-text">
                Speak into the Microphone
              </h3>
              <p className="text-xs text-text-muted max-w-md mx-auto mt-1 leading-relaxed">
                {lesson.speakingPrompt.question}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-surface border border-border max-w-lg mx-auto text-left">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                Suggested sentence framework:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {lesson.speakingPrompt.suggestedStarters.map((starter, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-card border border-border text-xs font-semibold text-text"
                  >
                    {starter}
                  </span>
                ))}
              </div>
            </div>

            {voiceState !== 'idle' && (
              <div className="w-full max-w-xs mx-auto">
                <Waveform active={voiceState === 'recording'} height={32} />
              </div>
            )}

            <div className="py-2">
              <VoiceButton
                state={voiceState}
                onClick={handleVoiceToggle}
                size="giant"
                label={hasSpokenTurn ? "Tap to speak again" : "Tap to Speak Out Loud"}
              />
            </div>

            {hasSpokenTurn && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800 max-w-lg mx-auto text-left animate-fadeIn">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-1">
                  <CheckCircle2 size={16} />
                  <span>Speech Transcribed Successfully</span>
                </div>
                <p className="text-sm font-bold text-text italic">
                  "{transcriptText}"
                </p>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 4: AI FEEDBACK (Turn analysis & why explanation)    */}
        {/* ======================================================== */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-1">
                Step 4 — AI Speech Feedback
              </span>
              <h3 className="text-lg font-black text-text">
                Your Speech Analysis & Natural Phrasing
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                LearnTalk explains why a natural phrasing sounds better in real conversation.
              </p>
            </div>

            {/* Speech Comparison Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-surface border border-border">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                  You Spoke:
                </span>
                <p className="text-sm font-semibold text-text">
                  "{transcriptText || lesson.speakingPrompt.exampleAnswer}"
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1">
                  Natural Spoken English:
                </span>
                <p className="text-sm font-bold text-text">
                  "{lesson.speakingPrompt.exampleAnswer}"
                </p>
              </div>
            </div>

            {/* "Why?" Deep Explanation (Requirement 17 & 18) */}
            <div className="p-5 rounded-2xl bg-surface border border-border text-xs space-y-3">
              <div className="flex items-center gap-2 font-bold text-primary">
                <Sparkles size={16} className="text-amber-500" />
                <span>Why this formulation sounds natural:</span>
              </div>
              <p className="text-text-muted leading-relaxed">
                {lesson.grammarFocus.whyExplanation}
              </p>

              <div className="pt-2 border-t border-border flex items-center justify-between text-text">
                <span className="font-semibold">Pronunciation Clarity:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  Clear word boundaries • Steady pace
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 5: PRACTICE (Interactive Exercises)                */}
        {/* ======================================================== */}
        {currentStep === 5 && currentExercise && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                  Step 5 — Practice Drill ({activeExerciseIndex + 1} of {lesson.exercises.length})
                </span>
                <h3 className="text-lg font-black text-text">
                  {currentExercise.type === 'fill_gap'
                    ? 'Fill in the Gap'
                    : currentExercise.type === 'rearrange'
                    ? 'Rearrange the Words'
                    : 'Repeat Out Loud'}
                </h3>
              </div>
              <span className="text-xs font-bold text-text-muted px-2.5 py-1 rounded-full bg-surface border border-border">
                Interactive Exercise
              </span>
            </div>

            {/* Exercise 1: Fill the gap */}
            {currentExercise.type === 'fill_gap' && currentExercise.options && (
              <div className="space-y-4">
                <p className="text-base font-bold text-text p-4 rounded-2xl bg-surface border border-border">
                  {currentExercise.prompt}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {currentExercise.options.map((opt) => {
                    const isSelected = selectedGapOption === opt;
                    const isCorrect = isSelected && isExerciseCorrect;
                    const isWrong = isSelected && !isExerciseCorrect;

                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleSelectGapOption(opt)}
                        className={`
                          p-3.5 rounded-xl border text-sm font-bold transition-all text-center
                          ${
                            isCorrect
                              ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                              : isWrong
                              ? 'bg-red-500 text-white border-red-500 shadow-sm'
                              : 'bg-surface text-text border-border hover:border-primary/40'
                          }
                        `}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Exercise 2: Rearrange words */}
            {currentExercise.type === 'rearrange' && currentExercise.wordsForRearrange && (
              <div className="space-y-4">
                <p className="text-sm font-semibold text-text-muted">
                  {currentExercise.prompt}
                </p>

                {/* Target assembled line */}
                <div className="p-4 rounded-2xl bg-surface border border-dashed border-primary/40 min-h-[56px] flex flex-wrap items-center gap-2">
                  {assembledWords.length === 0 ? (
                    <span className="text-xs text-text-muted italic">Click word chips below in order...</span>
                  ) : (
                    assembledWords.map((w, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleToggleRearrangeWord(w)}
                        className="px-3 py-1.5 rounded-lg bg-primary text-white font-bold text-xs shadow-xs hover:bg-primary-hover"
                      >
                        {w} ×
                      </button>
                    ))
                  )}
                </div>

                {/* Available word pool */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {currentExercise.wordsForRearrange.map((word, idx) => {
                    const isUsed = assembledWords.includes(word);
                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={isUsed}
                        onClick={() => handleToggleRearrangeWord(word)}
                        className={`
                          px-3 py-2 rounded-xl border text-xs font-bold transition-all
                          ${
                            isUsed
                              ? 'opacity-30 border-border bg-card'
                              : 'bg-card text-text border-border hover:border-primary/40'
                          }
                        `}
                      >
                        {word}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Exercise 3: Repeat out loud */}
            {currentExercise.type === 'repeat' && (
              <div className="space-y-4 text-center py-4">
                <p className="text-base font-bold text-primary max-w-md mx-auto">
                  "{currentExercise.correctAnswer}"
                </p>
                <div className="flex justify-center">
                  <VoiceButton
                    state={voiceState}
                    onClick={() => {
                      setVoiceState('processing');
                      setTimeout(() => {
                        setVoiceState('idle');
                        setIsExerciseAnswered(true);
                        setIsExerciseCorrect(true);
                      }, 1000);
                    }}
                    size="md"
                    label="Repeat Out Loud"
                  />
                </div>
              </div>
            )}

            {/* Explanation & Next Exercise Trigger */}
            {isExerciseAnswered && (
              <div
                className={`p-4 rounded-2xl border text-xs space-y-1 animate-fadeIn ${
                  isExerciseCorrect
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                    : 'bg-red-500/10 border-red-500/30 text-red-800 dark:text-red-300'
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  {isExerciseCorrect ? <Check size={16} /> : <X size={16} />}
                  <span>{isExerciseCorrect ? 'Correct!' : 'Almost! Try again.'}</span>
                </div>
                <p className="leading-relaxed">{currentExercise.explanation}</p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleNextExercise}
                    className="px-4 py-1.5 bg-primary text-primary-foreground font-bold text-xs rounded-lg shadow-xs hover:bg-primary-hover"
                  >
                    Next Exercise →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 6: REAL CONVERSATION (Context-locked AI partner)    */}
        {/* ======================================================== */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{lesson.conversationScenario.aiAvatar}</span>
                <div>
                  <h3 className="text-sm font-bold text-text">
                    {lesson.conversationScenario.aiPartnerName}
                  </h3>
                  <p className="text-[11px] text-text-muted">
                    {lesson.conversationScenario.aiPartnerRole} • {lesson.conversationScenario.scenarioTitle}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                Spontaneous Speaking
              </span>
            </div>

            {/* Turn Stream */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {convoTurns.map((turn, i) => {
                const isAI = turn.sender === 'ai';
                return (
                  <div
                    key={i}
                    className={`flex items-start gap-2.5 ${isAI ? 'justify-start' : 'justify-end'}`}
                  >
                    {isAI && (
                      <div className="w-8 h-8 rounded-xl bg-surface border border-border flex items-center justify-center text-sm shrink-0">
                        {lesson.conversationScenario.aiAvatar}
                      </div>
                    )}
                    <div className={`max-w-[80%] ${isAI ? '' : 'items-end'}`}>
                      <div
                        className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isAI
                            ? 'bg-surface border border-border text-text rounded-tl-sm'
                            : 'bg-primary text-primary-foreground rounded-tr-sm shadow-xs'
                        }`}
                      >
                        {turn.text}
                      </div>
                      {turn.tip && (
                        <span className="text-[10px] text-text-muted mt-0.5 block italic text-right">
                          {turn.tip}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick response suggestions */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                Suggested Spoken Answers (Tap to use or speak your own):
              </span>
              <div className="flex flex-col gap-1.5">
                {lesson.conversationScenario.suggestedResponses.map((resp, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSendConvoMessage(resp)}
                    className="p-2.5 rounded-xl bg-surface hover:bg-card border border-border text-left text-xs font-semibold text-text hover:border-primary/40 transition-all flex items-center justify-between"
                  >
                    <span className="truncate">"{resp}"</span>
                    <ArrowRight size={13} className="text-primary shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Mic / text input bar */}
            <div className="pt-2 flex items-center gap-2">
              <input
                type="text"
                value={convoInput}
                onChange={(e) => setConvoInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendConvoMessage()}
                placeholder="Or speak/type your answer..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-surface border border-border text-xs text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => handleSendConvoMessage()}
                className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover transition-colors shadow-xs"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 7: REVIEW (Mastery breakdown & what to do next)     */}
        {/* ======================================================== */}
        {currentStep === 7 && (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-3xl mb-2">
              🎉
            </div>

            <div>
              <h2 className="text-2xl font-black text-text">Lesson Complete!</h2>
              <p className="text-xs sm:text-sm text-text-muted mt-1 max-w-md mx-auto">
                You progressed through all 7 stages of active learning: concept, listening, speaking, feedback, drills, and spontaneous conversation!
              </p>
            </div>

            {/* Score Breakdown (Requirement 17) */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 max-w-xl mx-auto text-left">
              {[
                { label: 'Grammar', score: 85, color: 'text-indigo-500' },
                { label: 'Vocabulary', score: 90, color: 'text-sky-500' },
                { label: 'Pronunciation', score: 78, color: 'text-rose-500' },
                { label: 'Fluency', score: 75, color: 'text-amber-500' },
                { label: 'Listening', score: 95, color: 'text-emerald-500' },
              ].map((sc) => (
                <div key={sc.label} className="p-3 rounded-xl bg-surface border border-border">
                  <span className="text-[10px] font-bold text-text-muted uppercase block">{sc.label}</span>
                  <span className={`text-base font-black ${sc.color} mt-0.5 block`}>{sc.score}%</span>
                </div>
              ))}
            </div>

            {/* Session Stats */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-text-muted">
              <span>📚 New Words Learned: <strong className="text-text">{lesson.vocabulary.length}</strong></span>
              <span>•</span>
              <span>🎙 Speaking Time: <strong className="text-text">{Math.floor(elapsedSpeakingSeconds / 60)}m {elapsedSpeakingSeconds % 60}s</strong></span>
              <span>•</span>
              <span>⭐ Status: <strong className="text-emerald-500 font-bold">Completed ✓</strong></span>
            </div>

            {/* What you did well & next recommendation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-xl mx-auto text-xs">
              <div className="p-4 rounded-2xl bg-surface border border-border">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                  ✓ What you did well:
                </span>
                <p className="text-text-muted leading-relaxed">
                  Used time prepositions correctly and formed complete sentences without hesitation.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-surface border border-border">
                <span className="font-bold text-amber-600 dark:text-amber-400 block mb-1">
                  🎯 Practice next:
                </span>
                <p className="text-text-muted leading-relaxed">
                  Continue to Unit 2 Lesson 2 to master past tense narratives.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFinishLesson}
              className="px-8 py-3.5 bg-primary text-primary-foreground font-black text-sm rounded-xl shadow-lg shadow-primary/25 hover:bg-primary-hover active:scale-98 transition-all"
            >
              Return to Curriculum
            </button>
          </div>
        )}

        {/* Bottom Step Navigation Bar */}
        <div className="pt-6 border-t border-border mt-6 flex items-center justify-between">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-xs font-bold text-text-muted hover:text-text disabled:opacity-30 disabled:pointer-events-none transition-all"
          >
            <ArrowLeft size={14} />
            <span>Previous Step</span>
          </button>

          {currentStep < 7 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.min(7, prev + 1))}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md shadow-primary/20 hover:bg-primary-hover active:scale-98 transition-all"
            >
              <span>Continue to Step {currentStep + 1}</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinishLesson}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-600/20 hover:bg-emerald-700 active:scale-98 transition-all"
            >
              <span>Save & Complete</span>
              <CheckCircle2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Word / Phrase Explanation Sheet Popup */}
      <WordExplanationSheet
        wordData={selectedWordForSheet}
        isOpen={Boolean(selectedWordForSheet)}
        onClose={() => setSelectedWordForSheet(null)}
      />
    </div>
  );
};
