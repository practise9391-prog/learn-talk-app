import React, { useState } from 'react';
import { useCurriculumModule, SentenceAnalysisResult } from '../../context/CurriculumModuleContext';
import { HelpCircle, Mic, RotateCcw, CheckCircle2, ArrowRight, X, AlertTriangle, Sparkles } from 'lucide-react';

interface WhyIsThisWrongModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSentence?: string;
  onOpenGrammarTopic?: (slug: string) => void;
}

export const WhyIsThisWrongModal: React.FC<WhyIsThisWrongModalProps> = ({
  isOpen,
  onClose,
  initialSentence = 'He go to office every day.',
  onOpenGrammarTopic
}) => {
  const { analyzeSentenceWithWhy } = useCurriculumModule();
  const [inputSentence, setInputSentence] = useState<string>(initialSentence);
  const [analysis, setAnalysis] = useState<SentenceAnalysisResult | null>(() =>
    analyzeSentenceWithWhy(initialSentence)
  );
  const [isListening, setIsListening] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleAnalyze = () => {
    if (!inputSentence.trim()) return;
    const result = analyzeSentenceWithWhy(inputSentence);
    setAnalysis(result);
  };

  const handleStartVoice = () => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const rec = new SpeechRecognition();
          rec.continuous = false;
          rec.interimResults = false;
          rec.lang = 'en-US';

          rec.onresult = (e: any) => {
            const transcript = e.results[0][0].transcript;
            setInputSentence(transcript);
            const res = analyzeSentenceWithWhy(transcript);
            setAnalysis(res);
            setIsListening(false);
          };

          rec.onerror = () => setIsListening(false);
          rec.onend = () => setIsListening(false);
          rec.start();
          setIsListening(true);
        } catch (e) {
          setIsListening(false);
        }
      }
    }
  };

  const samplePresets = [
    'He go to office every day.',
    'I discussed about the project with my boss.',
    'I am knowing the answer.',
    'I didn’t saw the email yesterday.'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-card border border-border w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-surface/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-black">
              <HelpCircle size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                Sentence Diagnostic
              </span>
              <h3 className="text-base sm:text-lg font-black text-text">
                "Why Is This Wrong?" Explanation Engine
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

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          {/* Sentence Input Box */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-text">
              Type or speak any English sentence you are unsure about:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputSentence}
                onChange={(e) => setInputSentence(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAnalyze();
                }}
                placeholder="e.g. He go to office every day..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none focus:border-primary"
              />

              <button
                type="button"
                onClick={handleStartVoice}
                title="Speak sentence"
                className={`p-2.5 rounded-xl border transition-colors ${
                  isListening
                    ? 'bg-rose-500 text-white border-rose-500 animate-pulse'
                    : 'bg-surface hover:bg-surface-hover text-text border-border'
                }`}
              >
                <Mic size={16} />
              </button>

              <button
                type="button"
                onClick={handleAnalyze}
                className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover shadow-xs"
              >
                Check
              </button>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] text-text-muted font-bold">Try examples:</span>
              {samplePresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInputSentence(preset);
                    setAnalysis(analyzeSentenceWithWhy(preset));
                  }}
                  className="px-2 py-0.5 rounded-md bg-surface hover:bg-surface-hover border border-border text-[11px] text-text-muted hover:text-text"
                >
                  "{preset}"
                </button>
              ))}
            </div>
          </div>

          {/* Analysis Feedback Card */}
          {analysis && (
            <div className="p-5 rounded-2xl bg-surface border border-border space-y-4">
              {/* Sentences comparison */}
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-card border border-border flex items-start gap-2">
                  <span className="text-[10px] font-black uppercase text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md shrink-0">
                    Your sentence
                  </span>
                  <span className="font-semibold text-text line-through">
                    "{analysis.inputSentence}"
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2">
                  <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-md shrink-0">
                    Corrected
                  </span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">
                    "{analysis.correctedSentence}"
                  </span>
                </div>
              </div>

              {/* In-depth why explanation */}
              <div className="space-y-2">
                <strong className="text-xs font-black text-text block">
                  Grammar Rule Breakdown & Explanation:
                </strong>
                <p className="text-xs text-text-muted leading-relaxed">
                  {analysis.ruleExplanation}
                </p>

                <ul className="space-y-1.5 text-xs text-text-muted pt-1">
                  {analysis.whyPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Natural native alternative */}
              {analysis.naturalAlternative && (
                <div className="p-3 rounded-xl bg-card border border-border/80 text-xs">
                  <span className="text-[10px] font-bold text-primary uppercase block">
                    More Natural Native Formulation:
                  </span>
                  <p className="text-text font-semibold mt-0.5">
                    "{analysis.naturalAlternative}"
                  </p>
                </div>
              )}

              {/* Try Again CTA */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setInputSentence('');
                    setAnalysis(null);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-card hover:bg-surface border border-border text-xs font-bold text-text flex items-center gap-1.5 shadow-xs"
                >
                  <RotateCcw size={13} />
                  <span>Try Another Sentence</span>
                </button>

                {analysis.relatedGrammarTopicSlug && onOpenGrammarTopic && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenGrammarTopic(analysis.relatedGrammarTopicSlug!);
                    }}
                    className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Study Grammar Topic</span>
                    <ArrowRight size={13} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex justify-end bg-surface/50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
