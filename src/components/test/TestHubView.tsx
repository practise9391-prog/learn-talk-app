import React, { useState } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { Award, Clock, HelpCircle, CheckCircle2, Play, Sparkles } from 'lucide-react';
import { Test } from '../../types';
import { useUser } from '../../context/UserContext';

export const TestHubView: React.FC = () => {
  const { user } = useUser();
  const [activeTest, setActiveTest] = useState<Test | null>(null);

  const tests: Test[] = [
    {
      id: 'test-placement',
      title: 'CEFR Official Level Placement Test',
      type: 'placement',
      description: 'Find your precise starting level (A1 to C2) through listening comprehension, grammar structure, and spoken prompts.',
      durationMinutes: 15,
      questionsCount: 25,
      cefrFocus: 'A1',
    },
    {
      id: 'test-diagnostic',
      title: '5-Minute Speaking Diagnostics',
      type: 'diagnostic',
      description: 'Quick checkup on article usage, prepositions, and natural phrasing.',
      durationMinutes: 5,
      questionsCount: 10,
      cefrFocus: 'A1',
    },
    {
      id: 'test-unit-3',
      title: 'Unit 3 Mastery: Daily Routine & Present Simple',
      type: 'unit_eval',
      description: 'Demonstrate competency in simple present tenses and everyday action verbs.',
      durationMinutes: 10,
      questionsCount: 15,
      cefrFocus: 'A1',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Evaluations & Placement Tests"
        subtitle="Objective competency diagnostics grounded in the CEFR international framework"
        badge="Zero Pressure"
      />

      {/* Current Level Status Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-primary/10 via-secondary/10 to-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
            Current Verified CEFR Standing
          </span>
          <h3 className="text-xl font-black text-text mt-0.5">
            Level {user.currentLevel} (Beginner Foundation)
          </h3>
          <p className="text-xs text-text-muted mt-1 max-w-lg">
            Complete the full A1 curriculum units or take the level advancement assessment to unlock A2 Elementary!
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveTest(tests[0])}
          className="px-5 py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-xl shadow-sm hover:bg-primary-hover transition-colors shrink-0"
        >
          Take Level Advancement Test
        </button>
      </div>

      {/* Available Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tests.map((test) => (
          <div
            key={test.id}
            className="p-6 rounded-3xl bg-card border border-border hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface border border-border text-primary uppercase">
                  {test.type.replace('_', ' ')}
                </span>
                <span className="text-xs font-semibold text-text-muted flex items-center gap-1">
                  <Clock size={12} />
                  {test.durationMinutes}m
                </span>
              </div>

              <h4 className="text-base font-black text-text mb-2">{test.title}</h4>
              <p className="text-xs text-text-muted leading-relaxed mb-4">
                {test.description}
              </p>

              <div className="text-xs font-semibold text-text-muted mb-6 flex items-center gap-1.5">
                <Award size={14} className="text-amber-500" />
                <span>{test.questionsCount} questions • Instant feedback</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert(`Starting "${test.title}". Question engine will connect in curriculum stage.`)}
              className="w-full py-2.5 bg-surface hover:bg-primary hover:text-white text-text font-bold text-xs rounded-xl border border-border transition-colors flex items-center justify-center gap-2"
            >
              <Play size={13} fill="currentColor" />
              <span>Start Assessment</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
