import React, { useState } from 'react';
import { RoleplayScenario, RoleplayFeedbackData, RoleplayTurn, RoleplayDifficulty } from '../../types/roleplay';
import { ttsService } from '../../services/aiService';
import { useNavigation } from '../../context/NavigationContext';
import {
  Award,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  BookOpen,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Volume2,
  VolumeX,
  Target,
  FileText,
  ChevronDown,
  ChevronUp,
  Layers
} from 'lucide-react';

interface RoleplayFeedbackModalProps {
  scenario: RoleplayScenario;
  feedback: RoleplayFeedbackData;
  turns: RoleplayTurn[];
  durationMinutes: number;
  onRetry: (difficulty: RoleplayDifficulty) => void;
  onClose: () => void;
}

export const RoleplayFeedbackModal: React.FC<RoleplayFeedbackModalProps> = ({
  scenario,
  feedback,
  turns,
  durationMinutes,
  onRetry,
  onClose
}) => {
  const { navigate } = useNavigation();
  const [activeTab, setActiveTab] = useState<'feedback' | 'transcript' | 'comparisons'>('feedback');
  const [playingTurnId, setPlayingTurnId] = useState<string | null>(null);

  const handleSpeakText = (text: string, id: string) => {
    if (playingTurnId === id) {
      ttsService.stop();
      setPlayingTurnId(null);
      return;
    }
    ttsService.stop();
    setPlayingTurnId(id);
    ttsService.speak(text, {
      rate: 0.95,
      onEnd: () => setPlayingTurnId(null)
    });
  };

  const handleContinueWithJarvis = () => {
    onClose();
    navigate('/talk/call', {
      topicId: 'topic-career',
      personaId: 'jarvis',
      difficulty: 'normal'
    });
  };

  const handlePracticeCurriculumLesson = () => {
    onClose();
    if (feedback.recommendedCurriculumLesson?.lessonId) {
      navigate(`/learn/lesson/${feedback.recommendedCurriculumLesson.lessonId}`);
    } else {
      navigate('/learn');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-3xl rounded-3xl bg-card border border-border shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Top Header Bar */}
        <div className="p-6 border-b border-border bg-surface/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-indigo-600 text-white flex items-center justify-center text-2xl font-black shadow-md shadow-primary/20 shrink-0">
              {feedback.overallScore}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-text">Roleplay Performance</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {feedback.outcome}
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                {scenario.title} • {durationMinutes} mins spoken • {turns.length} turns
              </p>
            </div>
          </div>

          {/* Tab buttons */}
          <div className="flex items-center bg-card p-1 rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setActiveTab('feedback')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'feedback'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              Feedback & Scores
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('comparisons')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'comparisons'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              Better Phrasing
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('transcript')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'transcript'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              Transcript ({turns.length})
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'feedback' && (
            <>
              {/* Detailed Performance Scores with Explanations (Requirement 42) */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-text-muted mb-3">
                  Core Communication Breakdown
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(feedback.scores).map(([key, item]) => (
                    <div
                      key={key}
                      className="p-3.5 rounded-2xl bg-surface border border-border/80 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-black capitalize text-text">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </span>
                        <span className="text-xs font-black text-primary px-2 py-0.5 rounded-md bg-primary/10">
                          {item.score}%
                        </span>
                      </div>
                      <p className="text-[11px] text-text-muted leading-relaxed">
                        {item.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* What You Did Well & Improve (Requirement 43) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2.5">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-xs uppercase tracking-wider">
                    <CheckCircle2 size={16} />
                    <span>What You Did Well</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-text">
                    {feedback.whatYouDidWell.map((w, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold shrink-0">✓</span>
                        <span className="leading-relaxed">{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2.5">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black text-xs uppercase tracking-wider">
                    <AlertCircle size={16} />
                    <span>Focus Areas to Improve</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-text">
                    {feedback.areasToImprove.map((imp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold shrink-0">•</span>
                        <span className="leading-relaxed">{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Roleplay -> Learn Connection (Requirement 48) */}
              {feedback.recommendedCurriculumLesson && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-indigo-500/10 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-primary block">
                        Recommended Curriculum Connection
                      </span>
                      <p className="text-sm font-black text-text">
                        {feedback.recommendedCurriculumLesson.title}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">
                        {feedback.recommendedCurriculumLesson.level} • {feedback.recommendedCurriculumLesson.focus}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handlePracticeCurriculumLesson}
                    className="px-4 py-2 bg-primary text-primary-foreground text-xs font-black rounded-xl hover:bg-primary-hover transition-all shrink-0 flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Practice Lesson</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </>
          )}

          {/* Tab 2: Best Answer Comparison (Requirement 44) */}
          {activeTab === 'comparisons' && (
            <div className="space-y-4">
              <p className="text-xs text-text-muted leading-relaxed">
                Compare your spoken phrasing with natural conversational English and elevated corporate/professional registers.
              </p>

              {scenario.bestAnswerComparisons.map((comp, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-surface border border-border space-y-3.5"
                >
                  <div>
                    <span className="text-[10px] uppercase font-bold text-text-muted block mb-1">
                      Learner Hypothesis:
                    </span>
                    <p className="text-xs font-semibold text-rose-500 dark:text-rose-400 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
                      "{comp.userSpokenHypothesis}"
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-card border border-border">
                      <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                        Natural Spoken English:
                      </span>
                      <p className="text-xs font-bold text-text">
                        "{comp.naturalVersion}"
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-card border border-border">
                      <span className="text-[10px] uppercase font-bold text-primary block mb-1">
                        Professional Polish:
                      </span>
                      <p className="text-xs font-bold text-text">
                        "{comp.professionalVersion}"
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/15 text-xs text-text flex items-start gap-2">
                    <Sparkles size={14} className="text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[11px] uppercase tracking-wider text-primary block">
                        Why this wording is preferred:
                      </span>
                      <p className="text-text-muted mt-0.5">{comp.whyExplanation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Transcript Replay (Requirement 45) */}
          {activeTab === 'transcript' && (
            <div className="space-y-3">
              <p className="text-xs text-text-muted leading-relaxed">
                Review every conversational turn and re-listen to pronunciation using the audio button.
              </p>

              <div className="space-y-2.5">
                {turns.map((t) => {
                  const isAI = t.sender === 'ai';
                  const isPlaying = playingTurnId === t.id;

                  return (
                    <div
                      key={t.id}
                      className={`p-3.5 rounded-2xl border text-xs leading-relaxed flex items-start justify-between gap-3 ${
                        isAI
                          ? 'bg-surface border-border text-text'
                          : 'bg-primary/10 border-primary/20 text-text'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-black text-[11px] uppercase tracking-wider text-text-muted">
                            {isAI ? scenario.aiRole : scenario.userRole}
                          </span>
                          <span className="text-[10px] text-text-muted">{t.timestamp}</span>
                          {t.hintUsed && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 font-bold">
                              Hint used ({t.hintUsed})
                            </span>
                          )}
                        </div>
                        <p className="text-xs">{t.text}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSpeakText(t.text, t.id)}
                        className={`p-2 rounded-xl shrink-0 transition-colors ${
                          isPlaying
                            ? 'bg-primary text-primary-foreground animate-pulse'
                            : 'bg-card border border-border text-text-muted hover:text-text'
                        }`}
                        title="Replay Audio"
                      >
                        {isPlaying ? <VolumeX size={14} /> : <Volume2 size={14} />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions (Requirements 47 & 49) */}
        <div className="p-4 sm:p-5 border-t border-border bg-surface/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Retry with Different Difficulty (Requirement 47) */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onRetry('Beginner')}
              className="px-2.5 py-1.5 rounded-lg bg-card border border-border text-[11px] font-bold text-text-muted hover:text-text hover:bg-surface"
            >
              Retry Easier
            </button>
            <button
              type="button"
              onClick={() => onRetry(scenario.difficulty)}
              className="px-3 py-1.5 rounded-lg bg-card border border-border text-[11px] font-bold text-text hover:bg-surface flex items-center gap-1"
            >
              <RotateCcw size={12} />
              <span>Retry Same Level</span>
            </button>
            <button
              type="button"
              onClick={() => onRetry('Advanced')}
              className="px-2.5 py-1.5 rounded-lg bg-card border border-border text-[11px] font-bold text-text-muted hover:text-text hover:bg-surface"
            >
              Retry Harder
            </button>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {/* Roleplay -> Talk Connection (Requirement 49) */}
            <button
              type="button"
              onClick={handleContinueWithJarvis}
              className="px-4 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-text hover:bg-surface-hover flex items-center gap-1.5"
            >
              <MessageSquare size={14} className="text-primary" />
              <span>Continue with Jarvis</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-black hover:bg-primary-hover shadow-sm"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
