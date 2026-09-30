import React, { useState, useEffect, useRef } from 'react';
import { TestDefinition, TestQuestion, TestAttempt } from '../../types/test';
import { QUESTION_BANKS } from '../../data/testQuestions';
import { TestEvaluationEngine } from '../../services/testEvaluationEngine';
import { useTest } from '../../context/TestContext';
import { PageHeader } from '../layout/PageHeader';
import { VoiceButtonState } from '../common/VoiceButton';
import {
  Mic,
  Volume2,
  Clock,
  Play,
  Square,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Info,
  ShieldAlert,
  HelpCircle,
  Flame,
  ChevronRight
} from 'lucide-react';

interface TestRunnerViewProps {
  test: TestDefinition;
  onClose: () => void;
  onFinish: (attempt: TestAttempt) => void;
}

export const TestRunnerView: React.FC<TestRunnerViewProps> = ({ test, onClose, onFinish }) => {
  const { recordTestAttempt } = useTest();

  // Test stage: 'briefing' | 'running' | 'evaluating'
  const [stage, setStage] = useState<'briefing' | 'running' | 'evaluating'>('briefing');

  // Questions for this test
  const [questions, setQuestions] = useState<TestQuestion[]>(() => {
    const bank = QUESTION_BANKS[test.type] || [];
    return bank.length > 0 ? bank : QUESTION_BANKS.quick_speaking;
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const currentQuestion = questions[currentQuestionIndex] || questions[0];

  // User responses keyed by question ID
  const [responses, setResponses] = useState<Record<string, any>>({});

  // Voice recording state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [liveTranscript, setLiveTranscript] = useState<string>('');

  // Dual timer for debate
  const [debatePhase, setDebatePhase] = useState<'for' | 'against'>('for');

  // Timer states
  const totalDuration =
    currentQuestion.expectedDurationSeconds || test.durationMinutes * 60 || 60;
  const [timeLeft, setTimeLeft] = useState<number>(totalDuration);
  const [totalElapsedSeconds, setTotalElapsedSeconds] = useState<number>(0);
  const [autoStopOnZero, setAutoStopOnZero] = useState<boolean>(true);

  // Anti-gaming warning state
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  // Live filler analysis for No Fillers challenge
  const liveFillers = TestEvaluationEngine.analyzeFillers(liveTranscript);

  // Word association chain items
  const [chainWords, setChainWords] = useState<string[]>([]);
  const [inputWord, setInputWord] = useState<string>('');

  // Speech Recognition instance ref
  const recognitionRef = useRef<any>(null);
  const timerIntervalRef = useRef<any>(null);

  // Reset timer on question change
  useEffect(() => {
    const qDuration = currentQuestion.expectedDurationSeconds || 60;
    setTimeLeft(qDuration);
    setLiveTranscript(responses[currentQuestion.id]?.transcript || '');
    setWarningMessage(null);
  }, [currentQuestionIndex]);

  // Timer tick
  useEffect(() => {
    if (stage === 'running' && isRecording) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (test.type === 'pros_cons_debate' && debatePhase === 'for') {
              // Transition to against
              setDebatePhase('against');
              return 30;
            }
            if (autoStopOnZero) {
              handleStopRecording();
            }
            return 0;
          }
          return prev - 1;
        });
        setTotalElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [stage, isRecording, debatePhase, autoStopOnZero]);

  // Audio speech synthesis helper
  const playNativeAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Start recording
  const handleStartRecording = () => {
    setWarningMessage(null);
    setIsRecording(true);

    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        try {
          const rec = new SpeechRecognition();
          rec.continuous = true;
          rec.interimResults = true;
          rec.lang = 'en-US';

          rec.onresult = (event: any) => {
            let fullText = '';
            for (let i = 0; i < event.results.length; ++i) {
              fullText += event.results[i][0].transcript + ' ';
            }
            setLiveTranscript(fullText.trim());
          };

          rec.onerror = () => {
            // gracefully fallback
          };

          rec.start();
          recognitionRef.current = rec;
        } catch (e) {
          // ignore
        }
      }
    }
  };

  // Stop recording
  const handleStopRecording = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }

    // Save response for current question
    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        transcript: liveTranscript,
        recordedDuration:
          (currentQuestion.expectedDurationSeconds || 60) - timeLeft
      }
    }));
  };

  // Handle structured question option selection
  const handleSelectOption = (idx: number) => {
    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        answer: idx
      }
    }));
  };

  // Word association chain submission
  const handleAddChainWord = (word: string) => {
    const trimmed = word.trim();
    if (!trimmed) return;
    setChainWords((prev) => [...prev, trimmed]);
    setLiveTranscript((prev) => (prev ? `${prev} → ${trimmed}` : trimmed));
    setInputWord('');
  };

  // Move to next question or evaluate
  const handleNextQuestion = () => {
    // If speaking question and still recording, stop it
    if (isRecording) {
      handleStopRecording();
    }

    // Anti-gaming check on open speaking
    if (
      currentQuestion.type === 'open_speaking' ||
      currentQuestion.type === 'debate' ||
      currentQuestion.type === 'story_prompt'
    ) {
      const check = TestEvaluationEngine.checkAntiGaming(
        liveTranscript,
        currentQuestion,
        totalElapsedSeconds
      );
      if (!check.passed) {
        setWarningMessage(check.reason || 'Please provide a spoken response before proceeding.');
        return;
      }
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      finishAndEvaluate();
    }
  };

  const finishAndEvaluate = () => {
    if (isRecording) {
      handleStopRecording();
    }

    setStage('evaluating');

    setTimeout(() => {
      const evaluation = TestEvaluationEngine.evaluateTest(
        test,
        questions,
        responses,
        Math.max(30, totalElapsedSeconds)
      );

      const combinedTranscript = Object.values(responses)
        .map((r) => r.transcript)
        .filter(Boolean)
        .join('\n\n');

      const newAttempt = recordTestAttempt({
        testId: test.id,
        testType: test.type,
        testTitle: test.title,
        durationSeconds: Math.max(35, totalElapsedSeconds),
        scores: evaluation.scores,
        whatYouDidWell: evaluation.whatYouDidWell,
        whatToImprove: evaluation.whatToImprove,
        errorBreakdown: evaluation.errorBreakdown,
        scoreExplanations: evaluation.scoreExplanations,
        fillerAnalysis: evaluation.fillerAnalysis,
        transcript: combinedTranscript,
        responses,
        isPlacement: test.type === 'placement'
      });

      onFinish(newAttempt);
    }, 1400);
  };

  // Timer display formatting
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer visual states (Normal, Almost finished <15s, Time complete 0s)
  const getTimerVisualClass = () => {
    if (timeLeft === 0) return 'text-rose-500 bg-rose-500/10 border-rose-500/30';
    if (timeLeft <= 15) return 'text-amber-500 bg-amber-500/10 border-amber-500/30 animate-pulse';
    return 'text-primary bg-primary/10 border-primary/20';
  };

  // 1. Briefing Screen (Section 52: What am I testing? Duration, Skill, Criteria, Retry)
  if (stage === 'briefing') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <PageHeader
          title={test.title}
          subtitle={test.subtitle}
          badge={`Level ${test.level}`}
          showBack={true}
          onBack={onClose}
        />

        <div className="p-6 sm:p-7 rounded-3xl bg-card border border-border shadow-sm space-y-6">
          {/* Metadata quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-surface border border-border">
              <span className="text-[10px] font-bold text-text-muted uppercase block">Duration</span>
              <strong className="text-sm font-black text-text mt-0.5 block">
                {test.durationMinutes} min
              </strong>
            </div>
            <div className="p-3 rounded-2xl bg-surface border border-border">
              <span className="text-[10px] font-bold text-text-muted uppercase block">Primary Skill</span>
              <strong className="text-sm font-black text-primary capitalize mt-0.5 block">
                {test.primarySkill}
              </strong>
            </div>
            <div className="p-3 rounded-2xl bg-surface border border-border">
              <span className="text-[10px] font-bold text-text-muted uppercase block">Tasks / Items</span>
              <strong className="text-sm font-black text-text mt-0.5 block">
                {questions.length} items
              </strong>
            </div>
            <div className="p-3 rounded-2xl bg-surface border border-border">
              <span className="text-[10px] font-bold text-text-muted uppercase block">Retry Policy</span>
              <strong className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                Unlimited
              </strong>
            </div>
          </div>

          {/* Test Instructions */}
          <div>
            <h4 className="text-sm font-black text-text mb-2.5 flex items-center gap-1.5">
              <Info size={15} className="text-primary" />
              <span>Assessment Instructions</span>
            </h4>
            <ul className="space-y-2 text-xs text-text-muted">
              {test.instructions.map((inst, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{inst}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Evaluation Criteria */}
          <div>
            <h4 className="text-sm font-black text-text mb-2.5 flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-500" />
              <span>What Will Be Evaluated?</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {test.evaluationCriteria.map((crit, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-surface border border-border/70 flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span className="text-text font-medium">{crit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Auto-stop recording toggle */}
          <div className="pt-2 border-t border-border flex items-center justify-between">
            <div className="text-xs">
              <span className="font-bold text-text block">Calm Timer Flow</span>
              <span className="text-text-muted">
                {autoStopOnZero ? 'Automatically completes when timer hits zero' : 'Recording continues after 0:00'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setAutoStopOnZero(!autoStopOnZero)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                autoStopOnZero
                  ? 'bg-primary/10 text-primary border-primary/20'
                  : 'bg-surface text-text-muted border-border'
              }`}
            >
              {autoStopOnZero ? 'Auto-Complete: ON' : 'Continuous: ON'}
            </button>
          </div>

          {/* Start CTA */}
          <button
            type="button"
            onClick={() => {
              setStage('running');
              setTimeLeft(currentQuestion.expectedDurationSeconds || test.durationMinutes * 60);
            }}
            className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-black text-sm hover:bg-primary-hover transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Play size={16} fill="currentColor" />
            <span>Begin Assessment Now</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. Evaluating Spinner Screen
  if (stage === 'evaluating') {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto animate-bounce shadow-md">
          <Sparkles size={32} />
        </div>
        <h3 className="text-xl font-black text-text">Synthesizing AI Evaluation...</h3>
        <p className="text-xs text-text-muted leading-relaxed">
          Analyzing acoustic pacing, filler ratios, grammatical structures, and cross-session weakness links...
        </p>
      </div>
    );
  }

  // 3. Active Running Test Stage
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Top Runner Header */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border shadow-xs">
        <div>
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
            Task {currentQuestionIndex + 1} of {questions.length} • {test.title}
          </span>
          <h3 className="text-sm font-black text-text">{currentQuestion.prompt.slice(0, 45)}...</h3>
        </div>

        {/* Visual Timer Display */}
        <div className="flex items-center gap-3">
          <div
            className={`px-3.5 py-1.5 rounded-xl border font-mono font-black text-sm flex items-center gap-1.5 transition-all ${getTimerVisualClass()}`}
          >
            <Clock size={14} />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xs text-text-muted hover:text-text font-bold px-2 py-1"
          >
            Exit
          </button>
        </div>
      </div>

      {/* Anti-gaming warning notification if triggered */}
      {warningMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-600 dark:text-rose-400">
          <ShieldAlert size={16} className="shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong>Check Response:</strong> {warningMessage}
          </div>
        </div>
      )}

      {/* Main Question Execution Card */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-5">
        {/* Prompt Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">
              {currentQuestion.skill}
            </span>
            <span className="text-[10px] font-bold text-text-muted">
              CEFR {currentQuestion.difficulty}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-black text-text leading-snug whitespace-pre-line">
            {currentQuestion.prompt}
          </h2>

          {currentQuestion.subtitle && (
            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              {currentQuestion.subtitle}
            </p>
          )}
        </div>

        {/* SPECIFIC TEST TYPE RENDERERS */}

        {/* 1. Listening Comprehension */}
        {currentQuestion.listeningScript && (
          <div className="p-4 rounded-2xl bg-surface border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text flex items-center gap-1.5">
                <Volume2 size={16} className="text-primary" />
                <span>Audio Excerpt</span>
              </span>
              <button
                type="button"
                onClick={() => playNativeAudio(currentQuestion.listeningScript!)}
                className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 hover:bg-primary-hover shadow-xs"
              >
                <Play size={12} fill="currentColor" />
                <span>Play Audio Clip</span>
              </button>
            </div>
            <p className="text-xs text-text-muted italic bg-card p-3 rounded-xl border border-border/60">
              "{currentQuestion.listeningScript}"
            </p>
          </div>
        )}

        {/* 2. Structured Multiple Choice */}
        {currentQuestion.options && currentQuestion.options.length > 0 && (
          <div className="space-y-2.5">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = responses[currentQuestion.id]?.answer === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-3.5 rounded-2xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-primary/10 border-primary text-primary font-bold shadow-xs'
                      : 'bg-surface hover:bg-surface-hover border-border text-text'
                  }`}
                >
                  <span>{opt}</span>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'border-primary bg-primary text-white'
                        : 'border-border bg-card'
                    }`}
                  >
                    {isSelected && <span className="text-[10px]">✓</span>}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* 3. Shadowing / Pronunciation Passage */}
        {currentQuestion.passageText && (
          <div className="p-4 rounded-2xl bg-surface border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text">Native Model Passage</span>
              <button
                type="button"
                onClick={() => playNativeAudio(currentQuestion.passageText!)}
                className="px-3 py-1.5 rounded-xl bg-surface hover:bg-surface-hover border border-border text-primary font-bold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Volume2 size={13} />
                <span>Listen Native Audio</span>
              </button>
            </div>
            <blockquote className="text-sm font-semibold text-text border-l-4 border-primary pl-3 py-1 leading-relaxed">
              "{currentQuestion.passageText}"
            </blockquote>
          </div>
        )}

        {/* 4. Pronunciation Target Words (UK vs US, Syllable Stress) */}
        {currentQuestion.targetWords && currentQuestion.targetWords.length > 0 && (
          <div className="space-y-3">
            {currentQuestion.targetWords.map((tw, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-surface border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-base font-black text-text">{tw.word}</span>
                  <button
                    type="button"
                    onClick={() => playNativeAudio(tw.word)}
                    className="p-1.5 rounded-xl bg-card border border-border text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    <Volume2 size={15} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-card border border-border/70">
                    <span className="text-[10px] text-text-muted block">UK Phonetics</span>
                    <strong className="text-text font-mono">{tw.phoneticsUK}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-card border border-border/70">
                    <span className="text-[10px] text-text-muted block">US Phonetics</span>
                    <strong className="text-text font-mono">{tw.phoneticsUS}</strong>
                  </div>
                </div>

                <p className="text-[11px] text-text-muted leading-relaxed">
                  <strong className="text-primary font-semibold">Stress Pattern:</strong>{' '}
                  {tw.syllableStress} • {tw.tips}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* 5. Picture Description Scene Card */}
        {currentQuestion.imageScene && (
          <div className="p-4 rounded-2xl bg-surface border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Illustrated Visual Scene
              </span>
              <span className="text-xs font-semibold text-text">
                {currentQuestion.imageScene.title}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-card border border-border/80 text-xs text-text-muted leading-relaxed">
              <p className="font-medium text-text mb-2">
                {currentQuestion.imageScene.descriptionPrompt}
              </p>
              <div className="space-y-1 mt-2">
                <strong className="text-[11px] text-text block uppercase">Key Scene Elements:</strong>
                {currentQuestion.imageScene.keyElements.map((el, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>{el}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 6. Pros & Cons Debate Dual Phase */}
        {currentQuestion.debatePhases && (
          <div className="p-4 rounded-2xl bg-surface border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-primary">
                Debate Phase: {debatePhase === 'for' ? 'Side A (FOR — 30s)' : 'Side B (AGAINST — 30s)'}
              </span>
              <button
                type="button"
                onClick={() => setDebatePhase(debatePhase === 'for' ? 'against' : 'for')}
                className="text-xs font-bold text-primary underline"
              >
                Switch Phase
              </button>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border text-xs text-text">
              {debatePhase === 'for'
                ? currentQuestion.debatePhases[0]?.prompt
                : currentQuestion.debatePhases[1]?.prompt}
            </div>

            {/* Useful connectors suggestions */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] font-bold text-text-muted">Connectors:</span>
              {(debatePhase === 'for'
                ? currentQuestion.debatePhases[0]?.suggestedConnectors
                : currentQuestion.debatePhases[1]?.suggestedConnectors
              )?.map((conn, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-card border border-border text-[11px] text-text font-semibold"
                >
                  {conn}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 7. Word Association Chain Runner */}
        {currentQuestion.type === 'word_chain' && (
          <div className="p-4 rounded-2xl bg-surface border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text">Word Association Chain</span>
              <span className="text-xs font-bold text-primary">{chainWords.length} words added</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap min-h-12 p-3 bg-card rounded-xl border border-border">
              {chainWords.length === 0 ? (
                <span className="text-xs text-text-muted italic">
                  Say or type related words rapidly (e.g. Travel → Airport → Flight → Luggage)...
                </span>
              ) : (
                chainWords.map((w, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-xs font-bold flex items-center gap-1"
                  >
                    <span>{w}</span>
                    {idx < chainWords.length - 1 && <span className="text-text-muted">→</span>}
                  </span>
                ))
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={inputWord}
                onChange={(e) => setInputWord(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddChainWord(inputWord);
                }}
                placeholder="Type a related word and press Enter..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-card border border-border text-xs text-text focus:outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={() => handleAddChainWord(inputWord)}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* 8. Persuasion Structure Guide (JAM & Random Object Pitch) */}
        {currentQuestion.persuasionStructure && (
          <div className="p-3.5 rounded-2xl bg-surface border border-border/80">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-1.5">
              Suggested Presentation Architecture (Non-Mandatory)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-text-muted">
              {currentQuestion.persuasionStructure.map((st, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span>{st}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. Live Filler Word Counter for No Fillers challenge */}
        {test.type === 'no_fillers' && isRecording && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Flame size={16} className="text-amber-500" />
              <span className="font-bold text-text">Live Filler Counter:</span>
            </div>
            <div className="flex items-center gap-3">
              <span>
                Total: <strong className="font-mono">{liveFillers.totalWords}</strong> words
              </span>
              <span>
                Fillers: <strong className="text-rose-500 font-mono">{liveFillers.fillerCount}</strong>
              </span>
              <span>
                Ratio:{' '}
                <strong
                  className={`font-mono ${
                    liveFillers.fillerRatio > 5 ? 'text-rose-500' : 'text-emerald-500'
                  }`}
                >
                  {liveFillers.fillerRatio}%
                </strong>
              </span>
            </div>
          </div>
        )}

        {/* Spoken Recording Controller & Live Transcript Box */}
        {(currentQuestion.type === 'open_speaking' ||
          currentQuestion.type === 'debate' ||
          currentQuestion.type === 'story_prompt' ||
          currentQuestion.type === 'picture' ||
          currentQuestion.type === 'shadowing' ||
          currentQuestion.type === 'pronunciation_repeat' ||
          currentQuestion.type === 'word_chain') && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text">Your Spoken Response</span>
              <span className="text-[11px] text-text-muted font-medium">
                {isRecording ? 'Listening live...' : 'Press to record response'}
              </span>
            </div>

            {/* Live speech transcription text area / feedback */}
            <div className="relative">
              <textarea
                value={liveTranscript}
                onChange={(e) => setLiveTranscript(e.target.value)}
                placeholder="Click the microphone below and speak clearly. Your speech will transcribe here in real-time, or you can type directly..."
                rows={4}
                className="w-full p-4 rounded-2xl bg-surface border border-border text-xs text-text focus:outline-none focus:border-primary leading-relaxed resize-none"
              />

              {isRecording && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-bold border border-rose-500/20 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>RECORDING</span>
                </div>
              )}
            </div>

            {/* Mic trigger button */}
            <div className="flex items-center justify-center gap-3 pt-1">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={handleStartRecording}
                  className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover transition-all flex items-center gap-2 shadow-sm"
                >
                  <Mic size={16} />
                  <span>Start Recording Answer</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStopRecording}
                  className="px-6 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-sm animate-pulse"
                >
                  <Square size={16} fill="currentColor" />
                  <span>Stop & Save Recording</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Footer Navigation Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <button
            type="button"
            onClick={() => {
              if (currentQuestionIndex > 0) {
                setCurrentQuestionIndex((prev) => prev - 1);
              }
            }}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 rounded-xl text-xs font-bold text-text-muted hover:text-text disabled:opacity-40"
          >
            Previous
          </button>

          <button
            type="button"
            onClick={handleNextQuestion}
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span>
              {currentQuestionIndex === questions.length - 1 ? 'Finish & Evaluate' : 'Next Task'}
            </span>
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
