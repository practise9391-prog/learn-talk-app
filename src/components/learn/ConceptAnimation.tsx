import React, { useState } from 'react';
import { Play, RotateCcw, ArrowRight } from 'lucide-react';

export const ConceptAnimation: React.FC<{ type?: 'svo' | 'tense' | 'progression' }> = ({
  type = 'svo',
}) => {
  const [step, setStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const svoSteps = [
    { title: 'Who is acting?', label: 'SUBJECT', word: 'I', color: 'bg-indigo-500 text-white', note: 'First person pronoun' },
    { title: 'What is the action?', label: 'VERB', word: 'eat', color: 'bg-emerald-500 text-white', note: 'Base action verb (Present)' },
    { title: 'What receives the action?', label: 'OBJECT', word: 'rice', color: 'bg-amber-500 text-white', note: 'Noun / target' },
  ];

  const handleAnimate = () => {
    setIsPlaying(true);
    setStep(1);
    setTimeout(() => setStep(2), 1000);
    setTimeout(() => {
      setStep(3);
      setIsPlaying(false);
    }, 2000);
  };

  const handleReset = () => {
    setStep(0);
    setIsPlaying(false);
  };

  return (
    <div className="p-5 rounded-2xl bg-surface border border-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
            Interactive Grammar Visualizer
          </span>
          <h4 className="text-sm font-bold text-text">
            Sentence Architecture: Subject + Verb + Object
          </h4>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleAnimate}
            disabled={isPlaying}
            className="px-2.5 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-lg flex items-center gap-1 hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            <Play size={12} fill="currentColor" />
            <span>Animate</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-1 text-text-muted hover:text-text rounded-lg hover:bg-card"
            title="Reset"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Visual Animation Flow */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 py-4">
        {svoSteps.map((s, idx) => {
          const isHighlighted = step === 0 || step > idx;
          return (
            <React.Fragment key={s.label}>
              <div
                className={`
                  flex-1 w-full max-w-[150px] p-3 rounded-xl border text-center transition-all duration-500
                  ${
                    isHighlighted
                      ? `${s.color} shadow-md scale-102`
                      : 'bg-card border-border text-text-muted opacity-40'
                  }
                `}
              >
                <span className="text-[10px] font-black uppercase tracking-wider opacity-80 block">
                  {s.label}
                </span>
                <span className="text-xl font-black block my-1">"{s.word}"</span>
                <span className="text-[10px] opacity-90 block">{s.note}</span>
              </div>

              {idx < svoSteps.length - 1 && (
                <div className="hidden sm:block text-text-muted">
                  <ArrowRight size={16} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Complete Connected Sentence */}
      <div className="mt-3 p-3 rounded-xl bg-card border border-border text-center">
        <span className="text-xs text-text-muted font-medium">Resulting Spoken Sentence: </span>
        <span className="text-sm font-black text-text ml-1">
          "I eat rice for lunch every afternoon."
        </span>
      </div>
    </div>
  );
};
