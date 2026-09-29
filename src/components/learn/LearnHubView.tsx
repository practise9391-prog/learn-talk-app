import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { LEARNING_LEVELS } from '../../data/levels';
import { UnitCard } from './UnitCard';
import { CEFRLevel } from '../../types';
import { PageHeader } from '../layout/PageHeader';
import { BookOpen, Sparkles, Filter, PlusCircle, Compass } from 'lucide-react';

export const LearnHubView: React.FC = () => {
  const { units } = useUser();
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>('A1');

  const currentLevelData = LEARNING_LEVELS.find((l) => l.id === selectedLevel) || LEARNING_LEVELS[0];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="English Mastery Curriculum"
        subtitle="Step-by-step roadmap from beginner foundation to spontaneous professional fluency"
        badge="CEFR Standard"
      />

      {/* Level Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {LEARNING_LEVELS.map((lvl) => {
          const isSelected = lvl.id === selectedLevel;
          return (
            <button
              key={lvl.id}
              type="button"
              onClick={() => setSelectedLevel(lvl.id)}
              className={`
                p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-between
                ${
                  isSelected
                    ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-102'
                    : 'bg-card text-text border-border hover:border-slate-300 dark:hover:border-slate-700'
                }
              `}
            >
              <span className="text-base font-black tracking-tight">{lvl.name}</span>
              <span className={`text-[11px] font-semibold truncate ${isSelected ? 'text-white/90' : 'text-text-muted'}`}>
                {lvl.label}
              </span>
              <span
                className={`text-[10px] mt-2 px-2 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-surface text-text-muted'
                }`}
              >
                {lvl.unitsCount} Units
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Level Overview Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-primary/10 via-secondary/10 to-card border border-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground font-black text-xs">
                Level {currentLevelData.name}
              </span>
              <h2 className="text-lg font-black text-text">
                {currentLevelData.label} Competency
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-text-muted mt-2 max-w-2xl leading-relaxed">
              {currentLevelData.description}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-surface border border-border shrink-0 max-w-sm">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">
              Target Speaking Competency
            </span>
            <p className="text-xs text-text italic leading-relaxed">
              "{currentLevelData.targetCompetency}"
            </p>
          </div>
        </div>
      </div>

      {/* Units in Current Level */}
      <div className="space-y-4">
        {units.map((unit) => (
          <UnitCard key={unit.id} unit={unit} />
        ))}
      </div>

      {/* Custom Course Generation Architecture Foundation (Requirement 59) */}
      <div className="p-6 rounded-3xl bg-surface border border-dashed border-primary/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1.5 mb-1">
            <Sparkles size={14} /> Custom AI Course Builder
          </span>
          <h3 className="text-base font-black text-text">
            Need customized English for your exact profession?
          </h3>
          <p className="text-xs text-text-muted mt-0.5 max-w-lg">
            Software engineers, doctors, sales managers, or interview prep. Generate tailored courses based on your profession and weaknesses.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert("Custom Course Builder will connect to AI curriculum synthesis in subsequent updates.")}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 hover:bg-primary text-primary hover:text-white font-bold text-xs rounded-xl border border-primary/30 transition-all shrink-0 shadow-xs"
        >
          <PlusCircle size={15} />
          <span>Create Custom Course</span>
        </button>
      </div>
    </div>
  );
};
