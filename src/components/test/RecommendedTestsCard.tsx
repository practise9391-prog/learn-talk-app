import React from 'react';
import { useTest } from '../../context/TestContext';
import { Sparkles, Clock, Play, ArrowRight, Zap, Target } from 'lucide-react';

interface RecommendedTestsCardProps {
  onStartTest: (testId: string) => void;
}

export const RecommendedTestsCard: React.FC<RecommendedTestsCardProps> = ({ onStartTest }) => {
  const { getRecommendations } = useTest();
  const recommendations = getRecommendations();

  return (
    <div className="rounded-3xl bg-card border border-border p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Target size={18} className="text-primary" />
            <h3 className="text-lg font-black text-text">Recommended For You</h3>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Calibrated using your recent error patterns, skill recency, and fluency pacing
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-4 rounded-2xl bg-surface border border-border hover:border-primary/40 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase">
                  {rec.skill}
                </span>
                <span className="text-xs text-text-muted font-semibold flex items-center gap-1">
                  <Clock size={12} />
                  {rec.estimatedMinutes}m
                </span>
              </div>

              <h4 className="text-sm font-black text-text mb-1 group-hover:text-primary transition-colors">
                {rec.title}
              </h4>
              <p className="text-xs text-text-muted leading-relaxed mb-4">
                {rec.reason}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onStartTest(rec.testId)}
              className="w-full py-2 px-3 rounded-xl bg-card hover:bg-primary hover:text-white text-text font-bold text-xs border border-border transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Play size={12} fill="currentColor" />
              <span>Take Test</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
