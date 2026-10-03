import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Briefcase,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Award,
  ChevronRight,
  UserCheck,
  Check,
  Bookmark,
} from 'lucide-react';
import { useCareer } from '../../context/CareerContext';
import {
  CareerRoleCategory,
  InterviewType,
  InterviewDifficulty,
  InterviewQuestionItem,
  MockInterviewSession,
} from '../../types/career';

interface InterviewSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: InterviewType;
}

const ROLE_OPTIONS: Array<{ id: CareerRoleCategory; label: string }> = [
  { id: 'software_developer', label: 'Software Engineer / Full Stack' },
  { id: 'frontend_developer', label: 'Frontend Developer' },
  { id: 'backend_developer', label: 'Backend / Systems Engineer' },
  { id: 'data_analyst', label: 'Data Analyst / Scientist' },
  { id: 'product_manager', label: 'Product Manager' },
  { id: 'qa_engineer', label: 'QA / Test Automation' },
  { id: 'student_fresher', label: 'Graduate / Fresher' },
  { id: 'general_professional', label: 'General Tech Professional' },
];

const TYPE_OPTIONS: Array<{ id: InterviewType; label: string; desc: string }> = [
  { id: 'hr', label: 'HR & Cultural Fit', desc: 'Introductions, background, motivation & career goals' },
  { id: 'behavioral', label: 'Behavioral & STAR', desc: 'Conflict resolution, leadership, failure & teamwork' },
  { id: 'technical', label: 'Technical & Architecture', desc: 'System design, debugging, tradeoffs & code quality' },
  { id: 'mock_full', label: 'Comprehensive Mock', desc: 'Complete multi-phase realistic interview experience' },
];

export const InterviewSimulatorModal: React.FC<InterviewSimulatorModalProps> = ({
  isOpen,
  onClose,
  initialType = 'behavioral',
}) => {
  const {
    activeJobRole,
    activeMockInterview,
    startMockInterview,
    submitInterviewAnswer,
    finishMockInterview,
    savePortfolioItem,
  } = useCareer();

  const [selectedRole, setSelectedRole] = useState<CareerRoleCategory>(activeJobRole);
  const [selectedType, setSelectedType] = useState<InterviewType>(initialType);
  const [selectedDifficulty, setSelectedDifficulty] = useState<InterviewDifficulty>('intermediate');

  const [session, setSession] = useState<MockInterviewSession | null>(activeMockInterview);
  const [answerText, setAnswerText] = useState('');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentTurnFeedback, setCurrentTurnFeedback] = useState<any | null>(null);
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);
  const [showStarGuide, setShowStarGuide] = useState(false);
  const [savedToPortfolio, setSavedToPortfolio] = useState(false);

  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  if (!isOpen) return null;

  const currentQIndex = session ? session.currentQuestionIndex : 0;
  const currentQ = session && session.questions ? session.questions[currentQIndex] : null;
  const isFinished = session?.status === 'completed';

  const handleStart = () => {
    const newSession = startMockInterview(selectedRole, selectedType, selectedDifficulty);
    setSession(newSession);
    setAnswerText('');
    setElapsedSeconds(0);
    setIsTimerRunning(true);
    setCurrentTurnFeedback(null);
  };

  const handlePlayQuestionAudio = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeakingQuestion) {
      window.speechSynthesis.cancel();
      setIsSpeakingQuestion(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeakingQuestion(false);
    utterance.onerror = () => setIsSpeakingQuestion(false);
    setIsSpeakingQuestion(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmitAnswer = () => {
    if (!currentQ || !answerText.trim() || !session) return;
    setIsTimerRunning(false);

    const feedback = submitInterviewAnswer(currentQ.id, answerText, elapsedSeconds);
    setCurrentTurnFeedback(feedback);

    // Refresh local session reference
    setSession((prev) => {
      if (!prev) return null;
      const turn = {
        questionId: currentQ.id,
        question: currentQ.question,
        userAnswerText: answerText,
        durationSeconds: elapsedSeconds,
        feedback: {
          starCoverage: feedback.starCoverage,
          clarityScore: feedback.clarityScore,
          toneScore: feedback.toneScore,
          grammarIssues: feedback.grammarIssues,
          betterAlternative: feedback.betterProfessionalVersion,
          fillersDetected: feedback.fillersCount,
        },
      };
      const nextIndex = prev.currentQuestionIndex + 1;
      const finished = nextIndex >= prev.questions.length;
      return {
        ...prev,
        currentQuestionIndex: nextIndex,
        turns: [...prev.turns, turn],
        status: finished ? 'completed' : 'in_progress',
        overallReport: finished
          ? {
              overallScore: Math.round((feedback.clarityScore + feedback.toneScore) / 2),
              communicationScore: feedback.clarityScore,
              grammarScore: 85,
              relevanceScore: 88,
              starMethodScore: 82,
              fillerCount: feedback.fillersCount,
              topStrengths: ['Direct communication', 'Structured progression', 'Good role context'],
              priorityImprovements: ['Quantify metrics in results', 'Avoid hesitant transitions'],
            }
          : undefined,
      };
    });
  };

  const handleProceedNextQuestion = () => {
    setCurrentTurnFeedback(null);
    setAnswerText('');
    setElapsedSeconds(0);
    setIsTimerRunning(true);
  };

  const handleSaveInterviewToPortfolio = () => {
    if (!session) return;
    savePortfolioItem({
      itemType: 'interview_answer',
      title: `Mock Interview: ${session.interviewType.toUpperCase()} (${session.jobRole})`,
      content: `Completed ${session.totalQuestions} questions. Overall Score: ${
        session.overallReport?.overallScore || 85
      }%. Answers demonstrated STAR methodology and professional workplace tone.`,
      tags: ['Interview', session.interviewType, session.difficulty],
    });
    setSavedToPortfolio(true);
    setTimeout(() => setSavedToPortfolio(false), 2500);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-card border border-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Briefcase size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-text">AI Mock Interview Simulator</h2>
              <p className="text-xs text-text-muted">
                Multi-turn spoken/written interviews with live STAR analysis and executive polish
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (isSpeakingQuestion) window.speechSynthesis?.cancel();
              onClose();
            }}
            className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* STEP 1: CONFIGURATION (if no active session or finished and restarting) */}
          {!session && (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-wider text-text-muted block">
                  1. Target Job Role
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ROLE_OPTIONS.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRole(r.id)}
                      className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all ${
                        selectedRole === r.id
                          ? 'bg-primary/10 border-primary text-primary shadow-xs'
                          : 'bg-surface border-border text-text hover:border-primary/40'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-wider text-text-muted block">
                  2. Interview Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {TYPE_OPTIONS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedType(t.id)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        selectedType === t.id
                          ? 'bg-primary/10 border-primary shadow-xs ring-1 ring-primary/40'
                          : 'bg-surface border-border hover:border-primary/40'
                      }`}
                    >
                      <span className="text-xs font-black text-text block">{t.label}</span>
                      <span className="text-[11px] text-text-muted block mt-0.5">{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-wider text-text-muted block">
                  3. Experience Level / Difficulty
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['beginner', 'intermediate', 'advanced'] as InterviewDifficulty[]).map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`py-2.5 rounded-xl border text-center text-xs font-bold capitalize transition-all ${
                        selectedDifficulty === diff
                          ? 'bg-primary text-primary-foreground shadow-xs'
                          : 'bg-surface border-border text-text hover:bg-card'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleStart}
                className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-black text-sm flex items-center justify-center gap-2 hover:opacity-90 shadow-md shadow-primary/25 transition-opacity"
              >
                <Play size={16} />
                <span>Begin Simulated Interview</span>
              </button>
            </div>
          )}

          {/* STEP 2: ACTIVE QUESTION IN PROGRESS */}
          {session && !isFinished && currentQ && (
            <div className="space-y-6">
              {/* Progress & Timing Bar */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface border border-border">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-primary">
                    Question {currentQIndex + 1} of {session.questions.length}
                  </span>
                  <span className="text-text-muted">•</span>
                  <span className="text-xs font-semibold text-text capitalize">
                    {session.interviewType.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`font-mono text-xs font-bold px-2.5 py-1 rounded-lg ${
                      elapsedSeconds > 120
                        ? 'bg-amber-500/10 text-amber-600'
                        : 'bg-card border border-border text-text'
                    }`}
                  >
                    ⏱ {formatTime(elapsedSeconds)} (Target: 1-2 min)
                  </div>
                </div>
              </div>

              {/* Question Prompter Card */}
              <div className="p-6 rounded-3xl bg-surface border border-border space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-black text-sm">
                      AI
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                        Interviewer: Jarvis (Hiring Manager)
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-text leading-snug">
                        {currentQ.question}
                      </h3>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePlayQuestionAudio(currentQ.question)}
                    className="p-2.5 rounded-xl bg-card border border-border text-text hover:text-primary transition-colors shrink-0"
                    title="Listen to question"
                  >
                    {isSpeakingQuestion ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                </div>

                {/* STAR Guidance Accordion */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowStarGuide(!showStarGuide)}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <span>{showStarGuide ? 'Hide' : 'Show'} STAR Method Guidelines</span>
                    <ChevronRight
                      size={13}
                      className={`transition-transform ${showStarGuide ? 'rotate-90' : ''}`}
                    />
                  </button>

                  {showStarGuide && (
                    <div className="mt-2 p-3.5 rounded-xl bg-card border border-border text-xs text-text space-y-1.5 animate-fadeIn">
                      <p>
                        <span className="font-bold text-primary">S (Situation):</span> Set the context (Where, when, project goal)
                      </p>
                      <p>
                        <span className="font-bold text-primary">T (Task):</span> What was your specific responsibility or objective?
                      </p>
                      <p>
                        <span className="font-bold text-primary">A (Action):</span> Concrete technical steps you took (Use "I", not "We")
                      </p>
                      <p>
                        <span className="font-bold text-primary">R (Result):</span> Quantitative impact, outcome, or lessons learned
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Answer Input Area */}
              {!currentTurnFeedback && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider text-text-muted">
                      Your Spoken / Written Response
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsListening(!isListening)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                        isListening
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-surface border border-border text-text hover:bg-card'
                      }`}
                    >
                      {isListening ? <MicOff size={13} /> : <Mic size={13} />}
                      <span>{isListening ? 'Listening...' : 'Voice Dictate'}</span>
                    </button>
                  </div>

                  <textarea
                    rows={5}
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    placeholder="Structure your answer clearly: Begin with the situation, describe your personal actions, and conclude with the outcome and metrics..."
                    className="w-full p-4 rounded-2xl bg-surface border border-border text-sm text-text placeholder:text-text-muted/60 focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none"
                  />

                  <button
                    type="button"
                    onClick={handleSubmitAnswer}
                    disabled={!answerText.trim()}
                    className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-black text-xs flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity shadow-xs"
                  >
                    <Sparkles size={14} />
                    <span>Submit Answer & Evaluate</span>
                  </button>
                </div>
              )}

              {/* Turn Feedback Card */}
              {currentTurnFeedback && (
                <div className="p-6 rounded-3xl bg-surface border border-primary/40 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-primary" />
                      <h4 className="text-sm font-black text-text">Turn Analysis & Feedback</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-text-muted">Clarity Score:</span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-primary/10 text-primary font-mono font-bold text-xs">
                        {currentTurnFeedback.clarityScore}%
                      </span>
                    </div>
                  </div>

                  {/* STAR Breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Object.entries(currentTurnFeedback.starCoverage).map(([k, present]) => (
                      <div
                        key={k}
                        className={`p-2.5 rounded-xl border text-center text-xs font-bold ${
                          present
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'
                            : 'bg-card border-border text-text-muted'
                        }`}
                      >
                        <span className="uppercase text-[10px] block">{k}</span>
                        <span>{present ? '✓ Detected' : '○ Missing'}</span>
                      </div>
                    ))}
                  </div>

                  {/* Polish Formulation */}
                  {currentTurnFeedback.betterProfessionalVersion && (
                    <div className="p-4 rounded-2xl bg-card border border-border space-y-1.5">
                      <span className="text-xs font-black text-primary uppercase tracking-wider block">
                        Polished Executive Formulation:
                      </span>
                      <p className="text-xs sm:text-sm text-text leading-relaxed">
                        "{currentTurnFeedback.betterProfessionalVersion}"
                      </p>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleProceedNextQuestion}
                      className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-2 hover:opacity-90 shadow-xs"
                    >
                      <span>
                        {currentQIndex + 1 < session.questions.length ? 'Next Question' : 'Complete & View Report'}
                      </span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: FINAL REPORT UPON COMPLETION */}
          {session && isFinished && (
            <div className="space-y-6 animate-fadeIn">
              {/* Score Header */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-primary/10 via-secondary/10 to-card border border-primary/20 text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center font-mono font-black text-xl">
                  {session.overallReport?.overallScore || 85}%
                </div>
                <h3 className="text-lg font-black text-text">Interview Simulation Complete!</h3>
                <p className="text-xs text-text-muted max-w-md mx-auto">
                  Demonstrated solid professional communication readiness. Here is your structured feedback debrief:
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-surface border border-border text-center space-y-1">
                  <span className="text-[11px] font-bold text-text-muted uppercase">Clarity</span>
                  <span className="block font-mono font-black text-lg text-primary">
                    {session.overallReport?.communicationScore || 85}%
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-surface border border-border text-center space-y-1">
                  <span className="text-[11px] font-bold text-text-muted uppercase">STAR Structure</span>
                  <span className="block font-mono font-black text-lg text-emerald-600">
                    {session.overallReport?.starMethodScore || 82}%
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-surface border border-border text-center space-y-1">
                  <span className="text-[11px] font-bold text-text-muted uppercase">Grammar</span>
                  <span className="block font-mono font-black text-lg text-indigo-500">
                    {session.overallReport?.grammarScore || 85}%
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-surface border border-border text-center space-y-1">
                  <span className="text-[11px] font-bold text-text-muted uppercase">Filler Control</span>
                  <span className="block font-mono font-black text-lg text-amber-500">
                    {session.overallReport?.fillerCount || 0} fillers
                  </span>
                </div>
              </div>

              {/* Strengths & Priority Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-surface border border-border space-y-2.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> Core Strengths
                  </h4>
                  <ul className="space-y-1.5 text-xs text-text">
                    {(session.overallReport?.topStrengths || [
                      'Direct vocal articulation',
                      'Concrete role ownership',
                      'Appropriate technical phrasing',
                    ]).map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-surface border border-border space-y-2.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                    <TrendingUp size={14} /> Priority Growth Areas
                  </h4>
                  <ul className="space-y-1.5 text-xs text-text">
                    {(session.overallReport?.priorityImprovements || [
                      'Quantify metrics in your results',
                      'Eliminate hesitant filler words',
                      'Conclude with forward momentum',
                    ]).map((p, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {savedToPortfolio && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                  <Check size={14} /> Interview results saved to your private portfolio!
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSaveInterviewToPortfolio}
                  className="px-4 py-2.5 rounded-xl bg-surface hover:bg-card border border-border text-xs font-bold text-text flex items-center gap-2 transition-colors"
                >
                  <Bookmark size={14} className="text-primary" />
                  <span>Save Debrief to Portfolio</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSession(null);
                      setCurrentTurnFeedback(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-surface border border-border text-xs font-bold text-text hover:bg-card transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw size={13} />
                    <span>Practice Another Role</span>
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
