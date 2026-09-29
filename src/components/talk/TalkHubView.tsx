import React from 'react';
import { PageHeader } from '../layout/PageHeader';
import { SpeakingWorldMap } from '../map/SpeakingWorldMap';
import { useNavigation } from '../../context/NavigationContext';
import {
  Bot,
  Clock,
  Zap,
  Languages,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Globe
} from 'lucide-react';

export const TalkHubView: React.FC = () => {
  const { navigate } = useNavigation();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Spoken English Practice Hub"
        subtitle="Conversational AI partners, real-world locations, and fluency drills"
        badge="Zero Judgment"
      />

      {/* Primary Talk Partner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/15 via-secondary/15 to-card border border-primary/20 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center text-4xl shrink-0 shadow-sm">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-text">Meet Jarvis</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] border border-emerald-500/20">
                  Online 24×7
                </span>
              </div>
              <p className="text-xs sm:text-sm text-text-muted mt-1 max-w-md">
                "Hi, I'm Jarvis, your conversational partner. Chat with me on movies, hobbies, workplace updates, or daily thoughts."
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/talk/jarvis')}
            className="px-6 py-3 bg-primary text-primary-foreground font-black text-sm rounded-xl shadow-md shadow-primary/25 hover:bg-primary-hover active:scale-98 transition-all shrink-0 flex items-center justify-center gap-2"
          >
            <span>Start Talking with Jarvis</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Signature Speaking World Section */}
      <div className="mt-2">
        <div className="flex items-center gap-2 mb-3">
          <Globe size={18} className="text-primary" />
          <h2 className="text-lg font-black text-text">
            Speaking World: Interactive Realistic Environments
          </h2>
        </div>
        <SpeakingWorldMap />
      </div>
    </div>
  );
};
