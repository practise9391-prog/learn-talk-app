import React, { useState } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { Clock, Play, Sparkles, CheckCircle2, Shield } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';

export const Practice247View: React.FC = () => {
  const { navigate } = useNavigation();
  const [selectedDuration, setSelectedDuration] = useState<number>(10);
  const [customDuration, setCustomDuration] = useState<string>('20');
  const [isCustom, setIsCustom] = useState<boolean>(false);

  const durationOptions = [5, 10, 15, 30, 60];

  const handleStart = () => {
    const finalDuration = isCustom ? parseInt(customDuration, 10) || 10 : selectedDuration;
    navigate('/talk/jarvis', { duration: finalDuration.toString() });
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <PageHeader
        title="24×7 Spoken English Practice"
        subtitle="Uninterrupted voice conversation whenever you have free time in your day"
        badge="Adaptive Duration"
        showBack={true}
      />

      <div className="rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl bg-primary/10 border border-primary/20">
          <Clock className="w-6 h-6 text-primary shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-text">Choose your session target</h3>
            <p className="text-xs text-text-muted mt-0.5">
              Consistent 10-15 minute daily practice builds speech reflexes much faster than one long weekend cram session.
            </p>
          </div>
        </div>

        <div className="mb-6">
          <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-3">
            Select Practice Duration:
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
            {durationOptions.map((min) => {
              const isSelected = !isCustom && selectedDuration === min;
              return (
                <button
                  key={min}
                  type="button"
                  onClick={() => {
                    setIsCustom(false);
                    setSelectedDuration(min);
                  }}
                  className={`
                    py-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center
                    ${
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-md shadow-primary/20 scale-102 font-bold'
                        : 'bg-surface text-text border-border hover:border-slate-300 dark:hover:border-slate-700 font-semibold'
                    }
                  `}
                >
                  <span className="text-base font-black">{min}</span>
                  <span className="text-[10px] opacity-80">minutes</span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setIsCustom(true)}
              className={`
                py-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center
                ${
                  isCustom
                    ? 'bg-primary text-white border-primary shadow-md shadow-primary/20 scale-102 font-bold'
                    : 'bg-surface text-text border-border hover:border-slate-300 dark:hover:border-slate-700 font-semibold'
                }
              `}
            >
              <span className="text-sm font-black">Custom</span>
              <span className="text-[10px] opacity-80">time</span>
            </button>
          </div>

          {isCustom && (
            <div className="mt-4 p-4 rounded-2xl bg-surface border border-border flex items-center gap-3">
              <span className="text-xs font-bold text-text">Enter minutes:</span>
              <input
                type="number"
                min="1"
                max="180"
                value={customDuration}
                onChange={(e) => setCustomDuration(e.target.value)}
                className="w-24 px-3 py-1.5 rounded-xl bg-card border border-border text-sm font-bold text-text focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <span className="text-xs text-text-muted">minutes</span>
            </div>
          )}
        </div>

        {/* Benefits bullets */}
        <div className="space-y-2 mb-8 p-4 rounded-2xl bg-surface border border-border text-xs">
          <div className="flex items-center gap-2 text-text">
            <CheckCircle2 size={14} className="text-emerald-500" />
            <span>AI partner adapts to your pace and vocabulary comfort zone</span>
          </div>
          <div className="flex items-center gap-2 text-text">
            <CheckCircle2 size={14} className="text-emerald-500" />
            <span>Live natural phrasing suggestions without interrupting your train of thought</span>
          </div>
          <div className="flex items-center gap-2 text-text">
            <CheckCircle2 size={14} className="text-emerald-500" />
            <span>Spoken minutes are automatically added to your daily progress</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleStart}
          className="w-full py-4 bg-primary text-primary-foreground font-black text-sm rounded-2xl shadow-lg shadow-primary/25 hover:bg-primary-hover active:scale-99 transition-all flex items-center justify-center gap-2"
        >
          <Play size={18} fill="currentColor" />
          <span>Start {isCustom ? customDuration : selectedDuration}-Minute Voice Practice</span>
        </button>
      </div>
    </div>
  );
};
