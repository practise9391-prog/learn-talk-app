import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Copy,
  Check,
  Bookmark,
  AlertCircle,
  TrendingUp,
  Award,
  Lightbulb,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { useCareer } from '../../context/CareerContext';
import { ResumeBulletRefinement } from '../../types/career';

interface ResumeBulletImproverModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_BULLETS = [
  'Worked on payment API and fixed some bugs',
  'Built machine learning model for user recommendations',
  'Managed sprint meetings and coordinated with developers',
  'Created React components for the customer dashboard',
  'Helped improve database queries that were running slow',
];

export const ResumeBulletImproverModal: React.FC<ResumeBulletImproverModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { refineBullet, savePortfolioItem } = useCareer();
  const [rawBullet, setRawBullet] = useState('');
  const [result, setResult] = useState<ResumeBulletRefinement | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleRefine = () => {
    if (!rawBullet.trim()) return;
    const refined = refineBullet(rawBullet.trim());
    setResult(refined);
    setSavedSuccess(false);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveToPortfolio = (title: string, content: string) => {
    savePortfolioItem({
      itemType: 'resume_bullet',
      title: title || 'Refined Resume Bullet',
      content,
      tags: ['Resume', 'Refined Bullet', 'Career'],
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-card border border-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-text">Resume Bullet Point Refiner</h2>
              <p className="text-xs text-text-muted">
                Transform passive duties into impactful, metric-ready accomplishment statements
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
          {/* Informational Alert */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 flex items-start gap-3">
            <Lightbulb size={18} className="shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">Strict Ethical Accuracy Rule:</span>
              Our AI refines sentence structure, active verbs, and presentation without fabricating false accomplishments. Where metric placeholders appear (e.g.{' '}
              <span className="font-mono bg-amber-500/20 px-1 py-0.5 rounded">[by X%]</span>), insert your true verifiable numbers.
            </div>
          </div>

          {/* Input Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Paste Your Current Resume Bullet
              </label>
              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                <span>Try sample:</span>
                {SAMPLE_BULLETS.slice(0, 3).map((sample, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRawBullet(sample)}
                    className="text-[11px] px-2 py-0.5 rounded-lg bg-surface border border-border hover:border-primary text-text-muted hover:text-primary transition-colors truncate max-w-[120px]"
                  >
                    {sample.split(' ')[0]} {sample.split(' ')[1]}...
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <textarea
                value={rawBullet}
                onChange={(e) => setRawBullet(e.target.value)}
                placeholder="e.g., Developed API endpoints using Node.js and improved response times."
                rows={3}
                className="w-full p-4 rounded-2xl bg-surface border border-border text-sm text-text placeholder:text-text-muted/60 focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none"
              />
              <button
                type="button"
                onClick={handleRefine}
                disabled={!rawBullet.trim()}
                className="mt-2 w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity shadow-xs shadow-primary/25"
              >
                <Sparkles size={14} />
                <span>Refine & Generate Variations</span>
              </button>
            </div>
          </div>

          {/* Results Display */}
          {result && (
            <div className="space-y-6 pt-4 border-t border-border animate-fadeIn">
              {/* Analysis Badges */}
              <div className="p-4 rounded-2xl bg-surface border border-border space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-text-muted">Diagnostic Analysis:</span>
                  <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-mono text-xs font-bold">
                    Action Verb: {result.detectedActionVerb || 'Engineered'}
                  </span>
                  {result.missingDimensions.map((dim, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-1 capitalize"
                    >
                      <AlertCircle size={12} />
                      Missing {dim}
                    </span>
                  ))}
                  {result.missingDimensions.length === 0 && (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-semibold flex items-center gap-1">
                      <Check size={12} /> Complete Dimensions
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-muted">
                  <span className="font-bold text-text">Pro-tip for metrics:</span> State quantifiable impact such as latency reduced (e.g. by 40%), active users supported, or deployment hours saved.
                </p>
              </div>

              {/* 4 Formulations Grid */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  4 Tailored Formulations
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 1. Simple Professional */}
                  <div className="p-4 rounded-2xl bg-surface border border-border hover:border-primary/40 transition-all flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-black uppercase tracking-wider text-primary px-2 py-0.5 rounded-md bg-primary/10">
                          1. Clear Standard
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(result.versions.simple, 'simple')}
                          className="text-xs text-text-muted hover:text-text flex items-center gap-1 font-semibold"
                        >
                          {copiedKey === 'simple' ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                          <span>{copiedKey === 'simple' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-text leading-relaxed">
                        {result.versions.simple}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSaveToPortfolio('Clear Standard Bullet', result.versions.simple)}
                      className="text-[11px] font-bold text-text-muted hover:text-primary flex items-center gap-1 self-start mt-2"
                    >
                      <Bookmark size={12} /> Save to Portfolio
                    </button>
                  </div>

                  {/* 2. Strong Action & Impact */}
                  <div className="p-4 rounded-2xl bg-surface border border-border hover:border-primary/40 transition-all flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-500/10">
                          2. Impact & Results Focused
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(result.versions.achievementFocused, 'impact')}
                          className="text-xs text-text-muted hover:text-text flex items-center gap-1 font-semibold"
                        >
                          {copiedKey === 'impact' ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                          <span>{copiedKey === 'impact' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-text leading-relaxed">
                        {result.versions.achievementFocused}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSaveToPortfolio('Impact Focused Bullet', result.versions.achievementFocused)}
                      className="text-[11px] font-bold text-text-muted hover:text-primary flex items-center gap-1 self-start mt-2"
                    >
                      <Bookmark size={12} /> Save to Portfolio
                    </button>
                  </div>

                  {/* 3. Technical Depth */}
                  <div className="p-4 rounded-2xl bg-surface border border-border hover:border-primary/40 transition-all flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-black uppercase tracking-wider text-indigo-500 px-2 py-0.5 rounded-md bg-indigo-500/10">
                          3. Technical Depth
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(result.versions.technical, 'tech')}
                          className="text-xs text-text-muted hover:text-text flex items-center gap-1 font-semibold"
                        >
                          {copiedKey === 'tech' ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                          <span>{copiedKey === 'tech' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-text leading-relaxed">
                        {result.versions.technical}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSaveToPortfolio('Technical Depth Bullet', result.versions.technical)}
                      className="text-[11px] font-bold text-text-muted hover:text-primary flex items-center gap-1 self-start mt-2"
                    >
                      <Bookmark size={12} /> Save to Portfolio
                    </button>
                  </div>

                  {/* 4. Professional Formulation */}
                  <div className="p-4 rounded-2xl bg-surface border border-border hover:border-primary/40 transition-all flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-black uppercase tracking-wider text-amber-500 px-2 py-0.5 rounded-md bg-amber-500/10">
                          4. Cross-Functional Professional
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(result.versions.professional, 'prof')}
                          className="text-xs text-text-muted hover:text-text flex items-center gap-1 font-semibold"
                        >
                          {copiedKey === 'prof' ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                          <span>{copiedKey === 'prof' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-text leading-relaxed">
                        {result.versions.professional}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSaveToPortfolio('Professional Bullet', result.versions.professional)}
                      className="text-[11px] font-bold text-text-muted hover:text-primary flex items-center gap-1 self-start mt-2"
                    >
                      <Bookmark size={12} /> Save to Portfolio
                    </button>
                  </div>
                </div>
              </div>

              {savedSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                  <Check size={14} /> Saved to your Career Portfolio!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-surface/30 flex items-center justify-between">
          <span className="text-xs text-text-muted">
            Tip: Strong bullet formula = [Active Verb] + [What You Did] + [Tech Used] + [Quantifiable Impact]
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-text hover:bg-card transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
