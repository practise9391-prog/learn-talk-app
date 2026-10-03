import React, { useState } from 'react';
import {
  X,
  FileSearch,
  Sparkles,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Copy,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useCareerIntelligence } from '../../context/CareerIntelligenceContext';
import { JobDescriptionAnalysis } from '../../types/careerIntelligence';

interface JobDescriptionLabModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JobDescriptionLabModal: React.FC<JobDescriptionLabModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { analyzedJDs, analyzeJobDescription } = useCareerIntelligence();

  const [rawText, setRawText] = useState('');
  const [roleTitle, setRoleTitle] = useState('Senior Full Stack Engineer');
  const [companyName, setCompanyName] = useState('Fintech Systems');
  const [activeAnalysis, setActiveAnalysis] = useState<JobDescriptionAnalysis>(
    analyzedJDs[0] || null
  );
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleParse = () => {
    if (!rawText.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      const result = analyzeJobDescription(rawText, roleTitle, companyName);
      setActiveAnalysis(result);
      setIsProcessing(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[92vh] bg-surface rounded-3xl border border-border shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-card/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <FileSearch size={20} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-500 px-2.5 py-0.5 rounded-full">
                Job Description English Lab
              </span>
              <h2 className="text-base sm:text-lg font-black text-text">
                Keyword Extraction & Interview Alignment
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-card transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Input Accordion / Area */}
          <div className="p-5 rounded-3xl bg-card border border-border space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 space-y-1">
                <label className="text-[11px] font-bold text-text-muted uppercase">Target Role</label>
                <input
                  type="text"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs text-text focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-[11px] font-bold text-text-muted uppercase">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Stripe, NovaPay"
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs text-text focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-text-muted uppercase">
                Paste Job Description Text (or use current sample below):
              </label>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste the About the Role, Key Responsibilities, and Qualifications sections here..."
                rows={4}
                className="w-full p-3 rounded-xl bg-surface border border-border text-xs text-text focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none leading-relaxed"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleParse}
                disabled={!rawText.trim() || isProcessing}
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity shadow-xs"
              >
                <Sparkles size={14} />
                <span>{isProcessing ? 'Analyzing JD...' : 'Analyze Job Description'}</span>
              </button>
            </div>
          </div>

          {/* Parsed Results Canvas */}
          {activeAnalysis && (
            <div className="space-y-6 animate-fadeIn">
              {/* Header Title */}
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-base font-black text-text">{activeAnalysis.title}</h3>
                  <span className="text-xs text-text-muted">{activeAnalysis.companyName}</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase">
                  ✓ Ready for Practice
                </span>
              </div>

              {/* Responsibilities & Skills Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
                  <span className="text-xs font-black text-text uppercase block">
                    Key Responsibilities Extracted:
                  </span>
                  <ul className="text-xs text-text-muted space-y-2 list-disc list-inside leading-relaxed">
                    {activeAnalysis.keyResponsibilities.map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
                  <span className="text-xs font-black text-text uppercase block">
                    Core Technical & Domain Skills:
                  </span>
                  <ul className="text-xs text-text-muted space-y-2 list-disc list-inside leading-relaxed">
                    {activeAnalysis.requiredSkills.map((sk, i) => (
                      <li key={i}>{sk}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* High-Value Professional Vocabulary Cards */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-text uppercase tracking-wider">
                    Repeated Professional Vocabulary & Collocations:
                  </span>
                  <span className="text-[11px] text-text-muted">High-signal terms</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeAnalysis.repeatedVocabulary.map((v, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl bg-card border border-border space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-primary">{v.word}</span>
                        <span className="text-[9px] uppercase font-bold text-text-muted">Term</span>
                      </div>
                      <p className="text-[11px] text-text-muted leading-relaxed">{v.meaning}</p>
                      <div className="p-2 rounded-lg bg-surface text-[10px] text-text italic">
                        "{v.contextSentence}"
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Generated Interview Questions */}
              <div className="p-5 rounded-3xl bg-surface border border-border space-y-3">
                <div className="flex items-center gap-2">
                  <HelpCircle size={18} className="text-amber-500" />
                  <span className="text-xs font-black text-text uppercase tracking-wider">
                    Tailored Interview Questions Derived from this JD:
                  </span>
                </div>

                <div className="space-y-2">
                  {activeAnalysis.interviewQuestions.map((q, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-card border border-border text-xs text-text leading-relaxed font-medium flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-md bg-primary/10 text-primary font-bold text-[11px] flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
