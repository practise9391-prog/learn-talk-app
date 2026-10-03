import React, { useState } from 'react';
import {
  Edit3,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  BookOpen,
  MessageSquare,
  History,
  X,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { WritingPromptItem, WritingSubmission } from '../../types/communication';
import { useCommunicationSkills } from '../../context/CommunicationSkillsContext';
import { useNavigation } from '../../context/NavigationContext';

interface WritingStudioModalProps {
  prompt: WritingPromptItem | null;
  onClose: () => void;
}

export const WritingStudioModal: React.FC<WritingStudioModalProps> = ({ prompt, onClose }) => {
  const { submitWritingDraft, writingSubmissions } = useCommunicationSkills();
  const { navigate } = useNavigation();

  // State
  const [editorText, setEditorText] = useState<string>('');
  const [latestSubmission, setLatestSubmission] = useState<WritingSubmission | null>(null);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'write' | 'feedback' | 'history'>('write');

  if (!prompt) return null;

  const promptHistory = writingSubmissions.filter((s) => s.promptId === prompt.id);
  const words = editorText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const handleAddToken = (token: string) => {
    const newTokens = [...selectedTokens, token];
    setSelectedTokens(newTokens);
    setEditorText(newTokens.join(' '));
  };

  const handleResetTokens = () => {
    setSelectedTokens([]);
    setEditorText('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editorText.trim()) return;

    const sub = submitWritingDraft(prompt.id, editorText);
    setLatestSubmission(sub);
    setActiveTab('feedback');
  };

  const handleStartRevision = () => {
    setActiveTab('write');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-border flex items-start justify-between gap-4 bg-surface/50">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">
                Writing Studio
              </span>
              <span className="px-2 py-0.5 rounded-md bg-card border border-border text-[10px] font-bold text-text-muted">
                CEFR {prompt.cefrLevel}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-card border border-border text-[10px] font-bold text-text-muted capitalize">
                Tone: {prompt.tone}
              </span>
            </div>
            <h2 className="text-xl font-black text-text">{prompt.title}</h2>
            <p className="text-xs text-text-muted">{prompt.instruction}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface transition-colors"
            aria-label="Close studio"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-border bg-surface/30">
          {[
            { id: 'write', label: 'Editor & Scaffolding' },
            { id: 'feedback', label: 'AI Evaluation & Rubric' },
            { id: 'history', label: `Version History (${promptHistory.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-2 text-xs font-bold transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-muted hover:text-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content body */}
        <div className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-6">
          {/* TAB 1: EDITOR & SCAFFOLDING */}
          {activeTab === 'write' && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Sentence Builder Words Scaffolding */}
              {prompt.writingType === 'sentence_builder' && prompt.sentenceBuilder && (
                <div className="p-4 rounded-2xl bg-surface border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text uppercase tracking-wider">
                      Tap words to construct sentence:
                    </span>
                    <button
                      type="button"
                      onClick={handleResetTokens}
                      className="text-xs text-primary font-semibold hover:underline"
                    >
                      Reset Words
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {prompt.sentenceBuilder.shuffledWords.map((token, idx) => {
                      const isUsed = selectedTokens.includes(token);
                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={isUsed}
                          onClick={() => handleAddToken(token)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                            isUsed
                              ? 'bg-surface border-border text-text-muted opacity-40 cursor-not-allowed'
                              : 'bg-card border-border hover:border-primary text-text shadow-xs'
                          }`}
                        >
                          {token}
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-[11px] text-text-muted italic">{prompt.sentenceBuilder.hint}</p>
                </div>
              )}

              {/* Sentence Transformation Scaffolding */}
              {prompt.writingType === 'transformation' && prompt.transformation && (
                <div className="p-4 rounded-2xl bg-surface border border-border space-y-2">
                  <span className="text-[10px] font-bold text-text-muted uppercase block">Original Sentence:</span>
                  <div className="p-3 rounded-xl bg-card border border-border text-xs font-semibold text-text">
                    "{prompt.transformation.originalSentence}"
                  </div>
                  <span className="text-[11px] text-primary font-semibold block">
                    Goal: {prompt.transformation.transformationGoal}
                  </span>
                </div>
              )}

              {/* Target Keywords tracker */}
              {prompt.targetKeywords.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-text uppercase tracking-wider">
                    Target Keywords to Include:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {prompt.targetKeywords.map((kw) => {
                      const isIncluded = editorText.toLowerCase().includes(kw.toLowerCase());
                      return (
                        <span
                          key={kw}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1 transition-all ${
                            isIncluded
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold'
                              : 'bg-surface border-border text-text-muted'
                          }`}
                        >
                          {isIncluded && <Check size={12} />}
                          <span>{kw}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Editor Textarea */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-text">Your Composition:</span>
                  <span
                    className={`font-mono font-bold ${
                      wordCount >= prompt.targetLengthWords.min ? 'text-emerald-500' : 'text-text-muted'
                    }`}
                  >
                    {wordCount} / {prompt.targetLengthWords.min}–{prompt.targetLengthWords.max} Words
                  </span>
                </div>

                <textarea
                  rows={6}
                  value={editorText}
                  onChange={(e) => setEditorText(e.target.value)}
                  placeholder="Type your response here in English. Use complete sentences..."
                  className="w-full p-4 rounded-2xl bg-surface border border-border text-xs sm:text-sm text-text focus:outline-none focus:border-primary leading-relaxed resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-text-muted">
                  Drafts autosave locally and remain strictly private to your account.
                </span>

                <button
                  type="submit"
                  disabled={!editorText.trim()}
                  className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md shadow-primary/25 hover:bg-primary-hover disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  <Sparkles size={14} />
                  <span>Submit & Evaluate Writing</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: AI EVALUATION & RUBRIC */}
          {activeTab === 'feedback' && (
            <div className="space-y-6">
              {!latestSubmission?.evaluation ? (
                <div className="p-8 text-center text-xs text-text-muted bg-surface rounded-2xl border border-border">
                  Submit a draft in the Editor tab to view instant AI rubric evaluation and corrections.
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Overall Score Header */}
                  <div className="p-5 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-text">
                          Score: {latestSubmission.evaluation.overallScore}%
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs capitalize">
                          {latestSubmission.evaluation.qualityTier} Quality Tier
                        </span>
                      </div>
                      <p className="text-xs text-text-muted mt-1">
                        {latestSubmission.evaluation.feedbackSummary}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleStartRevision}
                      className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:bg-primary-hover transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                    >
                      <RotateCcw size={14} />
                      <span>Revise This Draft</span>
                    </button>
                  </div>

                  {/* Rubric Breakdown Grid */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-text-muted block">
                      Rubric Dimension Scores
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      {Object.entries(latestSubmission.evaluation.rubricScores).map(([key, score]) => (
                        <div key={key} className="p-3 rounded-xl bg-card border border-border text-center space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block capitalize">
                            {key}
                          </span>
                          <span className="text-base font-black text-text">{score}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actionable Corrections List */}
                  {latestSubmission.evaluation.corrections.length > 0 && (
                    <div className="space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-text block">
                        Grammar & Tone Refinements ({latestSubmission.evaluation.corrections.length})
                      </span>
                      <div className="space-y-2.5">
                        {latestSubmission.evaluation.corrections.map((corr) => (
                          <div key={corr.id} className="p-4 rounded-xl bg-surface border border-border space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="px-2 py-0.5 rounded bg-card border border-border text-[10px] font-bold text-amber-600 dark:text-amber-400">
                                {corr.issueType}: {corr.ruleName || 'Syntax'}
                              </span>
                            </div>
                            <div className="text-text font-medium">
                              Suggestion: <strong className="text-primary font-bold">{corr.suggestedCorrection}</strong>
                            </div>
                            <p className="text-[11px] text-text-muted">{corr.explanation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Alternative Natural & Professional Formulations */}
                  {latestSubmission.evaluation.betterAlternativeVersions.length > 0 && (
                    <div className="space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-text block">
                        Native Formulations & Models
                      </span>
                      <div className="space-y-2.5">
                        {latestSubmission.evaluation.betterAlternativeVersions.map((alt, i) => (
                          <div key={i} className="p-4 rounded-2xl bg-card border border-primary/20 space-y-2 text-xs">
                            <span className="font-bold text-primary block">{alt.tone}:</span>
                            <p className="text-text font-medium italic leading-relaxed">"{alt.text}"</p>
                            <p className="text-[11px] text-text-muted">{alt.explanation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cross-Skill Follow-Up: Talk with Jarvis */}
                  {prompt.followUpCrossSkill && (
                    <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-text block">Next Step: Spoken Transfer</span>
                        <p className="text-[11px] text-text-muted">{prompt.followUpCrossSkill.prompt}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          navigate('/talk/jarvis');
                        }}
                        className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:bg-primary-hover transition-colors shrink-0 flex items-center gap-1.5"
                      >
                        <MessageSquare size={14} />
                        <span>Discuss with Jarvis</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: VERSION HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {promptHistory.length === 0 ? (
                <div className="p-8 text-center text-xs text-text-muted">No prior drafts recorded.</div>
              ) : (
                promptHistory.map((sub) => (
                  <div key={sub.id} className="p-4 rounded-2xl bg-surface border border-border space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-text">Draft #{sub.draftNumber}</span>
                      <span className="font-mono text-[10px] text-text-muted">
                        {new Date(sub.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="p-3 rounded-xl bg-card border border-border text-text font-mono text-[11px] whitespace-pre-line">
                      {sub.text}
                    </p>
                    {sub.evaluation && (
                      <span className="text-[11px] text-primary font-bold block pt-1">
                        Score: {sub.evaluation.overallScore}% ({sub.evaluation.qualityTier})
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
