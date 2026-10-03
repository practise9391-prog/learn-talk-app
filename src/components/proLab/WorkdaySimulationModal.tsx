import React, { useState } from 'react';
import {
  X,
  Clock,
  Briefcase,
  Users,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Volume2,
  Send,
  Building2,
  FileText,
  Shield,
  Layers,
} from 'lucide-react';
import { useProLab } from '../../context/ProLabContext';
import { DictationMicButton } from './DictationMicButton';
import { StageEvaluationResult } from '../../services/proLabService';

interface WorkdaySimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkdaySimulationModal: React.FC<WorkdaySimulationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    activeWorkday,
    currentStageIndex,
    stageAnswers,
    stageBranchDecisions,
    advanceWorkdayStage,
    resetWorkday,
    evaluateWorkdayStage,
    projectState,
    activeOrg,
  } = useProLab();

  const [inputText, setInputText] = useState('');
  const [selectedBranchId, setSelectedBranchId] = useState<string | undefined>(undefined);
  const [evaluation, setEvaluation] = useState<StageEvaluationResult | null>(null);
  const [isSpeakingModel, setIsSpeakingModel] = useState(false);
  const [showProjectContext, setShowProjectContext] = useState(false);

  if (!isOpen) return null;

  const currentStage = activeWorkday.stages[currentStageIndex];
  const isLastStage = currentStageIndex === activeWorkday.stages.length - 1;
  const isDayCompleted = currentStageIndex === activeWorkday.stages.length - 1 && !!stageAnswers[currentStage.id];

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (isSpeakingModel) {
      setIsSpeakingModel(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeakingModel(false);
    utterance.onerror = () => setIsSpeakingModel(false);
    setIsSpeakingModel(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleEvaluate = () => {
    if (!inputText.trim()) return;
    const res = evaluateWorkdayStage(currentStage.id, inputText);
    setEvaluation(res);
  };

  const handleProceedNext = () => {
    advanceWorkdayStage(currentStage.id, inputText, selectedBranchId);
    setInputText('');
    setSelectedBranchId(undefined);
    setEvaluation(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[92vh] bg-surface rounded-3xl border border-border shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-card/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Briefcase size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                  Workday Simulation
                </span>
                <span className="text-[10px] font-bold text-text-muted">
                  {activeOrg.name}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-text">
                {activeWorkday.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowProjectContext(!showProjectContext)}
              className="px-3 py-1.5 rounded-xl border border-border text-xs font-bold text-text-muted hover:text-text hover:bg-card flex items-center gap-1.5 transition-colors"
            >
              <FileText size={14} />
              <span className="hidden sm:inline">Project State</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-card transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Project State Banner Collapsible */}
        {showProjectContext && (
          <div className="px-6 py-3.5 bg-surface-elevated/70 border-b border-border text-xs space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between font-bold text-text">
              <span>Project: {projectState.name}</span>
              <span className="text-primary font-mono">{projectState.currentSprint}</span>
            </div>
            <p className="text-text-muted text-[11px]">{projectState.objective}</p>
            <div className="flex flex-wrap gap-2 text-[10px]">
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold">
                Deadline: {projectState.deadline}
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">
                Decisions: {projectState.recordedDecisions.length} recorded
              </span>
            </div>
          </div>
        )}

        {/* Timeline Stepper Strip */}
        <div className="px-6 py-3 bg-card/40 border-b border-border overflow-x-auto flex items-center gap-2 scrollbar-none">
          {activeWorkday.stages.map((stg, idx) => {
            const isCompleted = idx < currentStageIndex || (idx === currentStageIndex && isDayCompleted);
            const isCurrent = idx === currentStageIndex && !isDayCompleted;
            return (
              <div
                key={stg.id}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  isCurrent
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                    : 'bg-surface border border-border text-text-muted'
                }`}
              >
                <Clock size={12} />
                <span>{stg.timeSlot}</span>
                <span className="text-[11px] opacity-90 hidden md:inline">
                  {stg.title.split(':')[0]}
                </span>
                {isCompleted && <CheckCircle2 size={12} className="text-emerald-500" />}
              </div>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isDayCompleted ? (
            /* Day Completed Screen */
            <div className="text-center py-10 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-xl font-black text-text">
                Full Workday Successfully Completed!
              </h3>
              <p className="text-xs sm:text-sm text-text-muted max-w-md mx-auto">
                You successfully navigated morning standup, manager 1-on-1 trade-offs, war-room chats, client pushback, P1 staging triage, and delivered the executive end-of-day summary.
              </p>
              <div className="p-4 rounded-2xl bg-card border border-border max-w-lg mx-auto text-left space-y-2 text-xs">
                <div className="font-bold text-text">Recorded Workday Decisions:</div>
                <ul className="list-disc list-inside text-text-muted space-y-1">
                  {projectState.recordedDecisions.map((dec, i) => (
                    <li key={i}>{dec}</li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center justify-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={resetWorkday}
                  className="px-5 py-2.5 rounded-xl border border-border text-xs font-bold text-text hover:bg-card flex items-center gap-2"
                >
                  <RotateCcw size={14} />
                  <span>Restart Simulation</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Active Stage View */
            <div className="space-y-6 animate-fadeIn">
              {/* Context Callout */}
              <div className="p-4 rounded-2xl bg-card border border-border flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Clock size={16} />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-black text-text">
                    {currentStage.timeSlot} — {currentStage.title}
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {currentStage.contextPrompt}
                  </p>
                </div>
              </div>

              {/* Interlocutor Dialogue Card */}
              <div className="p-5 rounded-2xl bg-surface border border-border/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-500 font-black text-xs flex items-center justify-center">
                      {currentStage.interlocutor.name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-text block">
                        {currentStage.interlocutor.name}
                      </span>
                      <span className="text-[10px] text-text-muted block">
                        {currentStage.interlocutor.role}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSpeak(currentStage.initialDialogue)}
                    className="p-1.5 rounded-lg border border-border text-text-muted hover:text-text hover:bg-card transition-colors"
                    title="Listen to dialogue"
                  >
                    <Volume2 size={15} />
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-card border border-border text-xs text-text leading-relaxed font-medium">
                  "{currentStage.initialDialogue}"
                </div>
              </div>

              {/* Choice Branches if present */}
              {currentStage.choiceBranches && currentStage.choiceBranches.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-text uppercase tracking-wider block">
                    Strategic Trade-Off Decision:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentStage.choiceBranches.map((branch) => {
                      const isSelected = selectedBranchId === branch.id;
                      return (
                        <div
                          key={branch.id}
                          onClick={() => setSelectedBranchId(branch.id)}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'border-primary bg-primary/10 shadow-xs'
                              : 'border-border bg-card hover:border-primary/40'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-black text-text">
                              {branch.label}
                            </span>
                            <span
                              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                branch.consequenceLevel === 'positive'
                                  ? 'bg-emerald-500/10 text-emerald-600'
                                  : 'bg-amber-500/10 text-amber-500'
                              }`}
                            >
                              {branch.consequenceLevel}
                            </span>
                          </div>
                          <p className="text-[11px] text-text-muted leading-relaxed">
                            {branch.summary}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Learner Input Area */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-text">
                    Your Response to {currentStage.interlocutor.name}:
                  </label>
                  <DictationMicButton
                    onTranscript={(t: string) => setInputText((prev) => (prev ? `${prev} ${t}` : t))}
                  />
                </div>

                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Speak or write your response... Address: ${currentStage.requiredElements.join(', ')}`}
                  rows={4}
                  className="w-full p-4 rounded-2xl bg-card border border-border text-xs text-text placeholder:text-text-muted/60 focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none leading-relaxed"
                />

                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {currentStage.requiredElements.map((req, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-surface border border-border text-[10px] text-text-muted font-medium"
                      >
                        ✓ {req}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleEvaluate}
                    disabled={!inputText.trim()}
                    className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50 transition-opacity shadow-xs shrink-0"
                  >
                    <Sparkles size={13} />
                    <span>Evaluate Response</span>
                  </button>
                </div>
              </div>

              {/* Evaluation Feedback Card */}
              {evaluation && (
                <div className="p-5 rounded-2xl bg-card border border-primary/30 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-text">Evaluation Score</span>
                      <span className="font-mono font-black text-sm text-primary px-2 py-0.5 rounded bg-primary/10">
                        {evaluation.score}%
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">
                      {evaluation.toneFeedback}
                    </span>
                  </div>

                  {evaluation.actionableFeedback.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-bold text-text-muted uppercase">Feedback & Next Step:</div>
                      <ul className="text-xs text-text-muted space-y-1 list-disc list-inside">
                        {evaluation.actionableFeedback.map((fb, idx) => (
                          <li key={idx}>{fb}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Model Phrase comparison */}
                  <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-text">
                      <span>Native Professional Model Response:</span>
                      <button
                        type="button"
                        onClick={() => handleSpeak(currentStage.modelResponse)}
                        className="text-primary hover:underline flex items-center gap-1 text-[11px]"
                      >
                        <Volume2 size={12} />
                        <span>Listen</span>
                      </button>
                    </div>
                    <p className="text-xs text-text-muted italic leading-relaxed">
                      "{currentStage.modelResponse}"
                    </p>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={handleProceedNext}
                      className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-2 hover:opacity-95 shadow-sm"
                    >
                      <span>
                        {isLastStage ? 'Finish Workday' : `Proceed to ${activeWorkday.stages[currentStageIndex + 1]?.timeSlot}`}
                      </span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
