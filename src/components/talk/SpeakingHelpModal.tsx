import React, { useState } from 'react';
import { AssistanceLevel } from '../../types';
import { Modal } from '../common/Modal';
import { HelpCircle, Sparkles, ChevronRight, Volume2 } from 'lucide-react';

interface SpeakingHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenarioTopic?: string;
}

export const SpeakingHelpModal: React.FC<SpeakingHelpModalProps> = ({
  isOpen,
  onClose,
  scenarioTopic = "Ordering at a tea shop or discussing routine",
}) => {
  const [level, setLevel] = useState<AssistanceLevel>(2);

  const helpLevels = [
    {
      lvl: 1 as AssistanceLevel,
      name: 'Level 1: Subtle Hint',
      desc: 'Just a gentle direction of thought without giving away words.',
      content: 'Think about stating what you want politely, using a friendly opening greeting.',
    },
    {
      lvl: 2 as AssistanceLevel,
      name: 'Level 2: 3 Suggested Words',
      desc: 'Three vocabulary options to unfreeze your mind.',
      content: ['"cup of chai"', '"less sugar"', '"hot snack"'],
      isWords: true,
    },
    {
      lvl: 3 as AssistanceLevel,
      name: 'Level 3: Phrase Suggestion',
      desc: 'A ready-to-use phrase starter.',
      content: '"Could I please get... / I would prefer..."',
    },
    {
      lvl: 4 as AssistanceLevel,
      name: 'Level 4: Sentence Framework',
      desc: 'Sentence blueprint where you fill in the blanks.',
      content: '"Hi! I\'d like to order [item] with [customization], please."',
    },
    {
      lvl: 5 as AssistanceLevel,
      name: 'Level 5: Full Native Example',
      desc: 'A complete polished natural sentence to shadow.',
      content: '"Hi there! Could I get a hot cup of ginger tea with less sugar, please?"',
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Speaking Brain-Freeze Support" maxWidth="lg">
      <div className="flex flex-col gap-5">
        <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-text">You're in control of the help level</h4>
            <p className="text-[11px] text-text-muted mt-0.5">
              Choose how much assistance you need right now without spoiling your own thinking process.
            </p>
          </div>
        </div>

        {/* Level Selector Pills */}
        <div className="grid grid-cols-5 gap-1.5">
          {helpLevels.map((h) => (
            <button
              key={h.lvl}
              type="button"
              onClick={() => setLevel(h.lvl)}
              className={`
                py-2 rounded-xl text-xs font-bold border transition-all text-center
                ${
                  level === h.lvl
                    ? 'bg-primary text-white border-primary shadow-xs'
                    : 'bg-card text-text-muted border-border hover:text-text'
                }
              `}
            >
              Lvl {h.lvl}
            </button>
          ))}
        </div>

        {/* Active Assistance Level View */}
        {(() => {
          const current = helpLevels.find((h) => h.lvl === level)!;
          return (
            <div className="p-5 rounded-2xl bg-surface border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  {current.name}
                </span>
                <span className="text-[11px] text-text-muted">{current.desc}</span>
              </div>

              <div className="mt-4 p-4 rounded-xl bg-card border border-border">
                {current.isWords && Array.isArray(current.content) ? (
                  <div className="flex flex-wrap gap-2">
                    {current.content.map((word, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-bold text-sm border border-primary/20"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm font-semibold text-text leading-relaxed">
                    {current.content as string}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary-hover transition-colors shadow-xs"
        >
          Got It, Let Me Speak
        </button>
      </div>
    </Modal>
  );
};
