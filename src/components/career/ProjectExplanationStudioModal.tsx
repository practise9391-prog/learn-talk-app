import React, { useState } from 'react';
import {
  X,
  Code2,
  Sparkles,
  HelpCircle,
  Bookmark,
  Check,
  ChevronRight,
  Send,
  Mic,
  MicOff,
  Layers,
  Cpu,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { useCareer } from '../../context/CareerContext';
import { ProjectExplanationProfile, InterviewQuestionItem } from '../../types/career';
import { CareerEvaluationService } from '../../services/careerEvaluationService';

interface ProjectExplanationStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_PROJECTS: ProjectExplanationProfile[] = [
  {
    id: 'preset-transit',
    projectName: 'SmartTransit Realtime Telemetry',
    problemSolved: 'Unreliable city bus tracking causing commuter anxiety and transit delays',
    targetUsers: 'Daily urban commuters and municipal transit dispatchers',
    techStack: ['React', 'TypeScript', 'Node.js', 'WebSockets', 'Redis', 'PostgreSQL'],
    myKeyResponsibilities: 'Engineered the WebSocket ingestion stream and live map rendering components',
    majorChallenge: 'High memory leaks under 10,000 concurrent client connections',
    debuggingStory: 'Isolated memory leaks using Node heap dumps and implemented chunked connection pools with backpressure',
    outcomeResult: 'Scaled telemetry service reliably to 25,000 active concurrent commuters with sub-second latency',
    futureImprovements: 'Integrate predictive arrival algorithms based on historical traffic patterns',
  },
  {
    id: 'preset-checkout',
    projectName: 'Fault-Tolerant Checkout Gateway',
    problemSolved: 'Abandoned carts and double charges due to synchronous payment gateway timeouts during flash sales',
    targetUsers: 'High-volume e-commerce shoppers and operations teams',
    techStack: ['Python', 'FastAPI', 'Kafka', 'PostgreSQL', 'Docker', 'AWS'],
    myKeyResponsibilities: 'Implemented idempotency keys, dead-letter queues, and asynchronous webhook retry workers',
    majorChallenge: 'Race conditions when duplicate webhook callbacks arrived out-of-order from the payment provider',
    debuggingStory: 'Applied distributed locks via Redis and strict database transaction isolation levels',
    outcomeResult: 'Reduced checkout payment timeout errors by 94% during peak seasonal traffic spikes',
    futureImprovements: 'Add automated multi-region active-active failover for zero-downtime database upgrades',
  },
];

export const ProjectExplanationStudioModal: React.FC<ProjectExplanationStudioModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { savedProjects, saveProjectProfile, savePortfolioItem } = useCareer();

  const [activeProject, setActiveProject] = useState<ProjectExplanationProfile>(() => {
    return savedProjects[0] || PRESET_PROJECTS[0];
  });

  const [generatedQuestions, setGeneratedQuestions] = useState<InterviewQuestionItem[]>(() => {
    return CareerEvaluationService.generateProjectQuestions(savedProjects[0] || PRESET_PROJECTS[0]);
  });

  const [selectedQuestion, setSelectedQuestion] = useState<InterviewQuestionItem | null>(null);
  const [practiceAnswer, setPracticeAnswer] = useState('');
  const [practiceFeedback, setPracticeFeedback] = useState<any | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [savedStatus, setSavedStatus] = useState(false);

  if (!isOpen) return null;

  const handleFieldChange = (field: keyof ProjectExplanationProfile, value: any) => {
    setActiveProject((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTechStackChange = (val: string) => {
    const list = val.split(',').map((t) => t.trim()).filter(Boolean);
    setActiveProject((prev) => ({ ...prev, techStack: list }));
  };

  const handleGenerateQuestions = () => {
    const questions = CareerEvaluationService.generateProjectQuestions(activeProject);
    setGeneratedQuestions(questions);
    setSelectedQuestion(questions[0] || null);
    setPracticeAnswer('');
    setPracticeFeedback(null);
  };

  const handleSelectPreset = (preset: ProjectExplanationProfile) => {
    setActiveProject(preset);
    const questions = CareerEvaluationService.generateProjectQuestions(preset);
    setGeneratedQuestions(questions);
    setSelectedQuestion(questions[0] || null);
    setPracticeAnswer('');
    setPracticeFeedback(null);
  };

  const handleSaveProject = () => {
    saveProjectProfile(activeProject);
    savePortfolioItem({
      itemType: 'project_summary',
      title: `Project: ${activeProject.projectName}`,
      content: `${activeProject.projectName}: Solved "${activeProject.problemSolved}" using ${activeProject.techStack.join(', ')}. My role: ${activeProject.myKeyResponsibilities}. Outcome: ${activeProject.outcomeResult}.`,
      tags: ['Project', 'Technical', ...activeProject.techStack.slice(0, 3)],
    });
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2500);
  };

  const handleEvaluatePracticeAnswer = () => {
    if (!practiceAnswer.trim() || !selectedQuestion) return;
    const feedback = CareerEvaluationService.evaluateInterviewAnswer(practiceAnswer, selectedQuestion);
    setPracticeFeedback(feedback);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl bg-card border border-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <Code2 size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-text">"Explain My Project" Studio</h2>
              <p className="text-xs text-text-muted">
                Structure your engineering stories, prepare architecture deep-dives, and practice answering technical follow-ups
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Preset Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-surface border border-border">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-text-muted">Load Blueprint:</span>
              {PRESET_PROJECTS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all ${
                    activeProject.projectName === preset.projectName
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'bg-card hover:bg-border text-text'
                  }`}
                >
                  {preset.projectName}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleSaveProject}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-card hover:bg-primary/10 border border-border hover:border-primary text-text flex items-center gap-1.5 transition-colors"
            >
              <Bookmark size={13} className="text-primary" />
              <span>Save Blueprint to Profile</span>
            </button>
          </div>

          {savedStatus && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <Check size={14} /> Project Profile & Explanation Blueprint saved to your portfolio!
            </div>
          )}

          {/* Project Details Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left: Foundation & Tech */}
            <div className="p-5 rounded-2xl bg-surface border border-border space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-text flex items-center gap-2">
                <Layers size={14} className="text-primary" /> 1. Project Overview & Architecture
              </h3>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-muted">Project Name</label>
                <input
                  type="text"
                  value={activeProject.projectName}
                  onChange={(e) => handleFieldChange('projectName', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-card border border-border text-xs text-text focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-muted">Problem Solved & Target Users</label>
                <textarea
                  rows={2}
                  value={activeProject.problemSolved}
                  onChange={(e) => handleFieldChange('problemSolved', e.target.value)}
                  className="w-full p-3 rounded-xl bg-card border border-border text-xs text-text focus:outline-hidden focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-muted">Tech Stack (comma-separated)</label>
                <input
                  type="text"
                  value={activeProject.techStack.join(', ')}
                  onChange={(e) => handleTechStackChange(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-card border border-border text-xs text-text focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeProject.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-card border border-border font-mono text-[10px] text-primary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-muted">My Direct Ownership & Responsibilities</label>
                <textarea
                  rows={2}
                  value={activeProject.myKeyResponsibilities}
                  onChange={(e) => handleFieldChange('myKeyResponsibilities', e.target.value)}
                  className="w-full p-3 rounded-xl bg-card border border-border text-xs text-text focus:outline-hidden focus:ring-1 focus:ring-primary resize-none"
                />
              </div>
            </div>

            {/* Right: Technical Challenges & Debugging */}
            <div className="p-5 rounded-2xl bg-surface border border-border space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-text flex items-center gap-2">
                <Cpu size={14} className="text-indigo-500" /> 2. Technical Depth & Debugging Story
              </h3>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-muted">Major Technical Challenge Encountered</label>
                <textarea
                  rows={2}
                  value={activeProject.majorChallenge}
                  onChange={(e) => handleFieldChange('majorChallenge', e.target.value)}
                  placeholder="e.g. Database locking under high write contention"
                  className="w-full p-3 rounded-xl bg-card border border-border text-xs text-text focus:outline-hidden focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-muted">Step-by-Step Debugging Story & Solution</label>
                <textarea
                  rows={2}
                  value={activeProject.debuggingStory}
                  onChange={(e) => handleFieldChange('debuggingStory', e.target.value)}
                  placeholder="e.g. Ran EXPLAIN ANALYZE on query plans, identified missing composite index..."
                  className="w-full p-3 rounded-xl bg-card border border-border text-xs text-text focus:outline-hidden focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-muted">Measurable Outcome / Business Impact</label>
                <input
                  type="text"
                  value={activeProject.outcomeResult}
                  onChange={(e) => handleFieldChange('outcomeResult', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-card border border-border text-xs text-text focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGenerateQuestions}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <Sparkles size={14} />
                  <span>Generate Tailored Interview Follow-Ups</span>
                </button>
              </div>
            </div>
          </div>

          {/* Generated Follow-up Questions & Practice Arena */}
          {generatedQuestions.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-text">
                    Tailored Interview Questions for this Project
                  </h3>
                  <p className="text-xs text-text-muted">
                    Questions generated strictly from your declared architecture, technologies, and debugging story
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {generatedQuestions.map((q) => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      setSelectedQuestion(q);
                      setPracticeAnswer('');
                      setPracticeFeedback(null);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                      selectedQuestion?.id === q.id
                        ? 'bg-primary/5 border-primary shadow-xs ring-1 ring-primary/30'
                        : 'bg-surface border-border hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary px-2 py-0.5 rounded-md bg-primary/10">
                        {q.category}
                      </span>
                      <ChevronRight size={14} className="text-text-muted" />
                    </div>
                    <p className="text-xs font-bold text-text leading-snug">{q.question}</p>
                    <span className="text-[10px] text-text-muted">
                      Focus: {q.idealFramework}
                    </span>
                  </button>
                ))}
              </div>

              {/* Interactive Practice Box for Selected Question */}
              {selectedQuestion && (
                <div className="p-5 rounded-2xl bg-surface border border-primary/30 space-y-4 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-primary block">
                        Practicing Spoken or Written Response:
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-text mt-0.5">
                        {selectedQuestion.question}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsRecording(!isRecording)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                          isRecording
                            ? 'bg-rose-500 text-white animate-pulse'
                            : 'bg-card border border-border text-text hover:bg-card/80'
                        }`}
                      >
                        {isRecording ? <MicOff size={13} /> : <Mic size={13} />}
                        <span>{isRecording ? 'Listening...' : 'Record Voice'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <textarea
                      rows={3}
                      value={practiceAnswer}
                      onChange={(e) => setPracticeAnswer(e.target.value)}
                      placeholder="Type or dictate your structured answer here (State your role, technical choice, tradeoffs, and impact)..."
                      className="w-full p-3.5 rounded-xl bg-card border border-border text-xs sm:text-sm text-text placeholder:text-text-muted/60 focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none"
                    />

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-text-muted">
                        Ideal response structure: Context (15s) → Technical Decision & Action (45s) → Result & Tradeoff (20s)
                      </span>
                      <button
                        type="button"
                        onClick={handleEvaluatePracticeAnswer}
                        disabled={!practiceAnswer.trim()}
                        className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50 transition-opacity"
                      >
                        <Sparkles size={13} />
                        <span>Evaluate Answer</span>
                      </button>
                    </div>
                  </div>

                  {/* Feedback on Practice */}
                  {practiceFeedback && (
                    <div className="p-4 rounded-xl bg-card border border-border space-y-3 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-text">AI Evaluation & Star Analysis:</span>
                        <span className="px-2.5 py-0.5 rounded-md bg-primary/10 text-primary font-mono font-bold text-xs">
                          Clarity: {practiceFeedback.clarityScore}%
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {Object.entries(practiceFeedback.starCoverage).map(([key, val]) => (
                          <div
                            key={key}
                            className={`p-2 rounded-lg border text-center text-xs font-bold ${
                              val
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'
                                : 'bg-surface border-border text-text-muted'
                            }`}
                          >
                            <span className="uppercase text-[10px] block">{key}</span>
                            <span>{val ? '✓ Included' : '○ Missing'}</span>
                          </div>
                        ))}
                      </div>

                      {practiceFeedback.betterProfessionalVersion && (
                        <div className="p-3 rounded-lg bg-surface border border-border space-y-1">
                          <span className="text-[11px] font-bold text-primary block">
                            Senior Engineer Formulation:
                          </span>
                          <p className="text-xs text-text leading-relaxed">
                            {practiceFeedback.betterProfessionalVersion}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-surface/30 flex items-center justify-between">
          <span className="text-xs text-text-muted">
            Remember: Real interviewers test your direct contribution, not just the team's overall result.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-text hover:bg-card transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
