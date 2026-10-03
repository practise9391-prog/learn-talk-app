import React, { useState } from 'react';
import { ManagedContentItem } from '../../types/admin';
import { ttsService } from '../../services/aiService';
import {
  X,
  Smartphone,
  Monitor,
  Sun,
  Moon,
  Volume2,
  CheckCircle2,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Layers,
} from 'lucide-react';

interface ContentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentItem: ManagedContentItem | null;
}

export const ContentPreviewModal: React.FC<ContentPreviewModalProps> = ({
  isOpen,
  onClose,
  contentItem,
}) => {
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [activeStep, setActiveStep] = useState<number>(0);

  if (!isOpen || !contentItem) return null;

  const sections = contentItem.contentData?.sections || [
    {
      name: 'explanation',
      blocks: [
        { id: 'b1', type: 'heading', content: contentItem.title },
        { id: 'b2', type: 'text', content: contentItem.summary },
        { id: 'b3', type: 'example', content: '"Could you please walk me through the architecture of your recent project?"' },
      ],
    },
  ];

  const allBlocks = sections.flatMap((s: any) => s.blocks || []);

  const handlePlayAudio = (text: string) => {
    ttsService.speak(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-card border border-border shadow-2xl p-6 sm:p-7 my-8 text-text max-h-[92vh] flex flex-col justify-between overflow-hidden">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-border gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              👁
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-text truncate max-w-sm">{contentItem.title}</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase">
                  Preview Mode
                </span>
              </div>
              <p className="text-[11px] text-text-secondary">
                Simulated Learner View • Zero Progress Mutation Guaranteed
              </p>
            </div>
          </div>

          {/* Viewport and Theme toggles */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-surface border border-border rounded-xl p-0.5">
              <button
                type="button"
                onClick={() => setViewport('desktop')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                  viewport === 'desktop' ? 'bg-primary text-white shadow-xs' : 'text-text-secondary'
                }`}
                title="Desktop viewport"
              >
                <Monitor size={15} />
              </button>
              <button
                type="button"
                onClick={() => setViewport('mobile')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                  viewport === 'mobile' ? 'bg-primary text-white shadow-xs' : 'text-text-secondary'
                }`}
                title="Mobile viewport"
              >
                <Smartphone size={15} />
              </button>
            </div>

            <div className="flex items-center bg-surface border border-border rounded-xl p-0.5">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                  theme === 'light' ? 'bg-primary text-white shadow-xs' : 'text-text-secondary'
                }`}
                title="Light theme"
              >
                <Sun size={15} />
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                  theme === 'dark' ? 'bg-primary text-white shadow-xs' : 'text-text-secondary'
                }`}
                title="Dark theme"
              >
                <Moon size={15} />
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-text-secondary hover:text-text hover:bg-surface transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Viewport Simulation Container */}
        <div className="flex-1 overflow-y-auto py-6 flex justify-center bg-surface/40 rounded-2xl my-4">
          <div
            className={`transition-all duration-300 overflow-y-auto p-6 rounded-3xl border shadow-lg ${
              theme === 'light' ? 'bg-white text-slate-900 border-slate-200' : 'bg-slate-950 text-slate-100 border-slate-800'
            } ${viewport === 'mobile' ? 'w-[360px] min-h-[500px]' : 'w-full max-w-2xl'}`}
          >
            {/* Simulation Header */}
            <div className="space-y-2 pb-4 border-b border-border/40">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase">
                  {contentItem.level} • {contentItem.type.replace('_', ' ')}
                </span>
                <span className="text-[10px] opacity-70">Estimated 15 mins</span>
              </div>
              <h2 className="text-xl font-black leading-snug">{contentItem.title}</h2>
              <p className="text-xs opacity-80 leading-relaxed">{contentItem.summary}</p>
            </div>

            {/* Interactive Blocks list */}
            <div className="space-y-4 py-4">
              {allBlocks.map((block: any, idx: number) => {
                if (block.type === 'heading') {
                  return (
                    <h3 key={idx} className="text-base font-black pt-2">
                      {block.content}
                    </h3>
                  );
                }
                if (block.type === 'example') {
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-primary/10 border border-primary/20 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                          {block.metadata?.speakerRole || 'Model Expression'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(block.content)}
                          className="p-1 rounded-lg hover:bg-primary/20 text-primary transition-colors"
                        >
                          <Volume2 size={15} />
                        </button>
                      </div>
                      <p className="text-xs font-semibold italic">{block.content}</p>
                    </div>
                  );
                }
                return (
                  <p key={idx} className="text-xs leading-relaxed opacity-90">
                    {block.content}
                  </p>
                );
              })}
            </div>

            {/* Practice Step Simulation */}
            <div className="p-4 rounded-2xl bg-surface/80 border border-border/60 space-y-2 mt-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-secondary">
                Interactive Practice Step
              </span>
              <p className="text-xs font-bold">"Try using this in your next conversation."</p>
              <button
                type="button"
                onClick={() => alert('Simulated practice step clicked. Learner progress was NOT mutated.')}
                className="w-full py-2.5 rounded-xl bg-primary text-white text-xs font-black hover:bg-primary/90 transition-all shadow-xs"
              >
                Complete Practice Step
              </button>
            </div>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span>Preview Mode is read-only. Learner streaks, scores, and history are safe.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-surface border border-border text-text text-xs font-bold hover:bg-card"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
