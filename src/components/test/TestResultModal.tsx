import React, { useState } from 'react';
import { TestAttempt, ComparisonResult } from '../../types/test';
import { useTest } from '../../context/TestContext';
import { useNavigation } from '../../context/NavigationContext';
import {
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Flame,
  Info,
  Layers,
  MessageSquare,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  ArrowRight,
  X
} from 'lucide-react';

interface TestResultModalProps {
  attempt: TestAttempt;
  onClose: () => void;
  onRetake: (testId: string) => void;
  onPracticeWithJarvis: (prompt: string) => void;
}

export const TestResultModal: React.FC<TestResultModalProps> = ({
  attempt,
  onClose,
  onRetake,
  onPracticeWithJarvis
}) => {
  const { getComparison } = useTest();
  const { navigate } = useNavigation();

  const comparison: ComparisonResult | null = getComparison(attempt.testId);

  // Expanded error accordion
  const [expandedErrorIdx, setExpandedErrorIdx] = useState<number | null>(0);

  const scores = attempt.scores;

  const handleActionClick = (link: string) => {
    onClose();
    navigate(link);
  };

  const handlePracticeErrorItem = (item: any) => {
    if (item.practiceType === 'talk') {
      onPracticeWithJarvis(
        `Let's practice saying "${item.better}" in natural conversation. I recently said "${item.youSaid}".`
      );
    } else if (item.practiceType === 'grammar') {
      onClose();
      navigate('/grammar');
    } else if (item.practiceType === 'vocabulary') {
      onClose();
      navigate('/vocabulary');
    } else if (item.practiceType === 'pronunciation') {
      onClose();
      navigate('/pronunciation');
    } else {
      onClose();
      navigate('/learn');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-card border border-border w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-border flex items-center justify-between bg-surface/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-black">
              🎉
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                Assessment Completed
              </span>
              <h3 className="text-base sm:text-lg font-black text-text">
                {attempt.testTitle}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
          {/* Main Score Banner */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-primary/15 via-primary/5 to-surface border border-primary/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                Overall Task Performance
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-black text-primary tracking-tight">
                  {scores.overallCommunication}%
                </span>
                <span className="text-xs font-bold text-text-muted">Communication Index</span>
              </div>
              <p className="text-xs text-text-muted mt-1 leading-relaxed max-w-md">
                Reflects speech clarity, task responsiveness, grammar consistency, and lexical precision observed during this activity.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 shrink-0">
              <div className="p-2.5 rounded-xl bg-card border border-border text-center">
                <span className="text-[10px] text-text-muted block">Speaking</span>
                <strong className="text-sm font-black text-indigo-500">{scores.speaking}%</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border text-center">
                <span className="text-[10px] text-text-muted block">Grammar</span>
                <strong className="text-sm font-black text-sky-500">{scores.grammar}%</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border text-center">
                <span className="text-[10px] text-text-muted block">Vocabulary</span>
                <strong className="text-sm font-black text-purple-500">{scores.vocabulary}%</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border text-center">
                <span className="text-[10px] text-text-muted block">Fluency</span>
                <strong className="text-sm font-black text-amber-500">{scores.fluency}%</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border text-center">
                <span className="text-[10px] text-text-muted block">Pronunciation</span>
                <strong className="text-sm font-black text-rose-500">{scores.pronunciation}%</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border text-center">
                <span className="text-[10px] text-text-muted block">Clarity</span>
                <strong className="text-sm font-black text-emerald-500">{scores.clarity}%</strong>
              </div>
            </div>
          </div>

          {/* Practice metric disclaimer */}
          <div className="p-3 rounded-xl bg-surface border border-border/80 text-[11px] text-text-muted flex items-start gap-2">
            <Info size={14} className="text-primary shrink-0 mt-0.5" />
            <span>
              <strong>Ethical Scoring Principle:</strong> This evaluation reflects demonstrated performance in this specific practice activity. It does not measure your intelligence or total real-world potential.
            </span>
          </div>

          {/* BEFORE / AFTER RETAKE COMPARISON (Section 36) */}
          {comparison && (
            <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/25 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <Sparkles size={14} />
                  <span>Before & After Retake Comparison</span>
                </span>
                <span className="text-[10px] font-bold text-text-muted">Retake Verified</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-card border border-border">
                  <span className="text-[10px] text-text-muted block">Previous Attempt</span>
                  <strong className="text-text font-bold">
                    {comparison.previousAttempt.scores.overallCommunication}%
                  </strong>
                </div>
                <div className="p-2.5 rounded-xl bg-card border border-border">
                  <span className="text-[10px] text-text-muted block">Current Attempt</span>
                  <strong className="text-primary font-bold">
                    {comparison.currentAttempt.scores.overallCommunication}%
                  </strong>
                </div>
                <div className="p-2.5 rounded-xl bg-card border border-border">
                  <span className="text-[10px] text-text-muted block">Net Gain</span>
                  <strong
                    className={`font-black ${
                      (comparison.scoreDeltas.overallCommunication || 0) >= 0
                        ? 'text-emerald-500'
                        : 'text-amber-500'
                    }`}
                  >
                    {(comparison.scoreDeltas.overallCommunication || 0) >= 0 ? '+' : ''}
                    {comparison.scoreDeltas.overallCommunication || 0}%
                  </strong>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                    ✓ Improved Areas:
                  </span>
                  <ul className="space-y-1 text-text">
                    {comparison.improvedItems.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <span className="font-bold text-amber-600 dark:text-amber-400 block mb-1">
                    ⚡ Still Practicing:
                  </span>
                  <ul className="space-y-1 text-text">
                    {comparison.stillPracticingItems.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* WHAT YOU DID WELL (Section 27) */}
          <div className="space-y-2.5">
            <h4 className="text-sm font-black text-text flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span>What You Did Well</span>
            </h4>
            <div className="space-y-2">
              {attempt.whatYouDidWell.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-text flex items-start gap-2.5"
                >
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* WHAT TO IMPROVE — Clickable Action Links (Section 28) */}
          <div className="space-y-2.5">
            <h4 className="text-sm font-black text-text flex items-center gap-1.5">
              <Sparkles size={16} className="text-primary" />
              <span>Recommended Target Areas (Clickable Practice Drills)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {attempt.whatToImprove.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleActionClick(item.actionLink)}
                  className="p-4 rounded-2xl bg-surface border border-border hover:border-primary/50 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <h5 className="text-xs font-black text-text group-hover:text-primary transition-colors">
                      {item.target}
                    </h5>
                    <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
                      {item.reason}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-primary mt-3 pt-2 border-t border-border/60">
                    <span>{item.actionLabel}</span>
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ERROR BREAKDOWN (Section 29) */}
          {attempt.errorBreakdown.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-black text-text flex items-center gap-1.5">
                <Layers size={16} className="text-rose-500" />
                <span>Error Breakdown & In-Depth Contextual Why</span>
              </h4>

              <div className="space-y-2.5">
                {attempt.errorBreakdown.map((cat, catIdx) => (
                  <div key={catIdx} className="rounded-2xl border border-border overflow-hidden">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedErrorIdx(expandedErrorIdx === catIdx ? null : catIdx)
                      }
                      className="w-full p-3.5 bg-surface hover:bg-surface-hover flex items-center justify-between text-xs font-bold text-text transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase">
                          {cat.category}
                        </span>
                        <span>{cat.count} issue(s) detected</span>
                      </div>
                      <ChevronDown
                        size={15}
                        className={`text-text-muted transition-transform ${
                          expandedErrorIdx === catIdx ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {expandedErrorIdx === catIdx && (
                      <div className="p-4 bg-card border-t border-border space-y-3">
                        {cat.items.map((err, errIdx) => (
                          <div key={errIdx} className="space-y-2 text-xs">
                            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                              <span className="text-[10px] font-bold uppercase block text-text-muted">
                                You said:
                              </span>
                              "{err.youSaid}"
                            </div>
                            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                              <span className="text-[10px] font-bold uppercase block text-text-muted">
                                Better:
                              </span>
                              "{err.better}"
                            </div>
                            <p className="text-[11px] text-text-muted leading-relaxed">
                              <strong>Why:</strong> {err.why}
                            </p>
                            <button
                              type="button"
                              onClick={() => handlePracticeErrorItem(err)}
                              className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 hover:bg-primary-hover shadow-xs mt-1"
                            >
                              <span>Practice Saying This Right</span>
                              <ArrowRight size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SCORE EXPLANATIONS: "Why did I receive this result?" (Section 44) */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-text flex items-center gap-1.5">
              <Info size={16} className="text-primary" />
              <span>Score Explanations — Why Did I Receive This Result?</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {attempt.scoreExplanations.map((exp, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-surface border border-border text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <strong className="text-text font-black">{exp.skill}</strong>
                    <span className="font-mono font-bold text-primary">{exp.score}%</span>
                  </div>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                    <strong>Strength:</strong> {exp.strength}
                  </p>
                  <p className="text-[11px] text-text-muted">
                    <strong>Practice target:</strong> {exp.practice}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* FILLER WORDS DETAILED BREAKDOWN (Section 8) */}
          {attempt.fillerAnalysis && attempt.fillerAnalysis.fillerCount > 0 && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-black text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <Flame size={14} />
                  <span>Filler Word Analysis</span>
                </span>
                <span className="font-bold text-text">
                  {attempt.fillerAnalysis.fillerRatio}% ratio ({attempt.fillerAnalysis.fillerCount} fillers in {attempt.fillerAnalysis.totalWords} words)
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {attempt.fillerAnalysis.fillersDetected.map((f, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-card border border-border text-[11px] font-semibold text-text"
                  >
                    "{f.word}": {f.count}
                  </span>
                ))}
              </div>
              {attempt.fillerAnalysis.pauseAdvice.map((adv, i) => (
                <p key={i} className="text-[11px] text-text-muted leading-relaxed">
                  • {adv}
                </p>
              ))}
            </div>
          )}

          {/* Transcript Snippet */}
          {attempt.transcript && (
            <div className="p-4 rounded-2xl bg-surface border border-border space-y-2">
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider block">
                Saved Spoken Transcript (Linked to History & Recordings)
              </span>
              <p className="text-xs text-text italic leading-relaxed whitespace-pre-line bg-card p-3 rounded-xl border border-border/60">
                "{attempt.transcript}"
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface/50 shrink-0">
          <button
            type="button"
            onClick={() => onRetake(attempt.testId)}
            className="px-4 py-2.5 rounded-xl bg-card hover:bg-surface border border-border text-text font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <RotateCcw size={13} />
            <span>Retake With Fresh Questions</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                onPracticeWithJarvis(
                  `I just finished my ${attempt.testTitle}. My score was ${scores.overallCommunication}%. Can you help me practice my weak areas in a friendly spoken dialogue?`
                )
              }
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <MessageSquare size={13} />
              <span>Practice with Jarvis</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover transition-colors shadow-sm"
            >
              Done & Return
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
