import React, { useState } from 'react';
import {
  NATIVE_THINKING_BRIDGES,
  WHY_THIS_WORD_DATA,
} from '../../data/speakingIntelligenceData';
import { NativeThinkingBridgeItem, WhyThisWordComparison } from '../../types/speakingIntelligence';
import {
  Globe,
  Sparkles,
  ArrowRight,
  HelpCircle,
  BookOpen,
  Volume2,
  CheckCircle2,
  X,
  Lightbulb,
} from 'lucide-react';

interface NativeThinkingBridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultLang?: 'telugu' | 'hindi' | 'tamil' | 'kannada';
}

export const NativeThinkingBridgeModal: React.FC<NativeThinkingBridgeModalProps> = ({
  isOpen,
  onClose,
  defaultLang = 'telugu',
}) => {
  const [activeTab, setActiveTab] = useState<'bridge' | 'why_this_word'>('bridge');
  const [selectedLang, setSelectedLang] = useState<'telugu' | 'hindi' | 'tamil' | 'kannada'>(defaultLang);
  const [selectedBridge, setSelectedBridge] = useState<NativeThinkingBridgeItem>(
    NATIVE_THINKING_BRIDGES.find((b) => b.sourceLang === defaultLang) || NATIVE_THINKING_BRIDGES[0]
  );
  const [selectedWtw, setSelectedWtw] = useState<WhyThisWordComparison>(WHY_THIS_WORD_DATA[0]);

  if (!isOpen) return null;

  const filteredBridges = NATIVE_THINKING_BRIDGES.filter((b) => b.sourceLang === selectedLang);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-card border border-border shadow-2xl p-6 sm:p-8 my-8 text-text max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary">
              <Globe size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-text">Native-to-English Thinking Bridge</h2>
              <p className="text-xs text-text-secondary">
                Transform thoughts in your mother tongue directly into Natural & Professional English
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-text-secondary hover:text-text hover:bg-surface transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex gap-2 pt-5 border-b border-border/40 pb-4">
          <button
            type="button"
            onClick={() => setActiveTab('bridge')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'bridge'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface text-text-secondary hover:text-text'
            }`}
          >
            Mother Tongue Bridge
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('why_this_word')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'why_this_word'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface text-text-secondary hover:text-text'
            }`}
          >
            "Why This Word?" Contrasts
          </button>
        </div>

        {activeTab === 'bridge' ? (
          <div className="space-y-6 pt-5">
            {/* Language Selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {(['telugu', 'hindi', 'tamil'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => {
                    setSelectedLang(lang);
                    const match = NATIVE_THINKING_BRIDGES.find((b) => b.sourceLang === lang);
                    if (match) setSelectedBridge(match);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black capitalize transition-all ${
                    selectedLang === lang
                      ? 'bg-secondary/15 text-secondary border border-secondary/30'
                      : 'bg-surface text-text-secondary border border-border hover:text-text'
                  }`}
                >
                  {lang === 'telugu' ? 'తెలుగు (Telugu)' : lang === 'hindi' ? 'हिन्दी (Hindi)' : 'தமிழ் (Tamil)'}
                </button>
              ))}
            </div>

            {/* List of expressions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredBridges.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedBridge(b)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selectedBridge.id === b.id
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-surface/50 border-border text-text hover:border-primary/30'
                  }`}
                >
                  <div className="text-xs font-bold font-serif mb-1">{b.nativeScript}</div>
                  <div className="text-[11px] text-text-secondary italic line-clamp-1">{b.nativePhrase}</div>
                </button>
              ))}
            </div>

            {/* Bridge Progression Card */}
            {selectedBridge && (
              <div className="p-5 rounded-3xl bg-surface/80 border border-border space-y-4">
                <div className="p-3.5 rounded-2xl bg-card border border-border">
                  <span className="text-[10px] font-black uppercase tracking-wider text-secondary block mb-1">
                    Native Thought (Mother Tongue)
                  </span>
                  <div className="text-base font-bold text-text font-serif mb-0.5">{selectedBridge.nativeScript}</div>
                  <div className="text-xs text-text-secondary italic">"{selectedBridge.nativePhrase}"</div>
                </div>

                {/* Progression steps */}
                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-card border border-border/80 flex items-start gap-3">
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase mt-0.5">
                      Draft / Literal
                    </span>
                    <div className="text-xs text-text-secondary">
                      <span className="line-through">{selectedBridge.literalEnglishDraft}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-card border border-border/80 flex items-start gap-3">
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase mt-0.5">
                      Simple English
                    </span>
                    <div className="text-xs font-bold text-text">{selectedBridge.simpleEnglish}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/30 flex items-start gap-3">
                    <span className="px-2 py-0.5 rounded-md bg-primary/20 text-primary text-[10px] font-black uppercase mt-0.5">
                      Natural English
                    </span>
                    <div className="text-xs font-black text-primary">{selectedBridge.naturalEnglish}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase mt-0.5">
                      Professional
                    </span>
                    <div className="text-xs font-black text-emerald-500">{selectedBridge.professionalEnglish}</div>
                  </div>
                </div>

                {/* Explanation */}
                <div className="p-3.5 rounded-2xl bg-secondary/5 border border-secondary/20 flex items-start gap-2.5 text-xs text-text-secondary">
                  <Lightbulb size={16} className="text-secondary shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{selectedBridge.structuralExplanation}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 pt-5">
            {/* Why This Word tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {WHY_THIS_WORD_DATA.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setSelectedWtw(w)}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    selectedWtw.id === w.id
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-surface border-border text-text hover:border-primary/40'
                  }`}
                >
                  <div className="text-xs font-black truncate">{w.recommendedWord}</div>
                  <div className="text-[10px] text-text-secondary truncate mt-0.5">vs {w.learnerWord}</div>
                </button>
              ))}
            </div>

            {/* Why this word comparison card */}
            {selectedWtw && (
              <div className="p-5 rounded-3xl bg-surface/80 border border-border space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20">
                    <span className="text-[10px] font-black uppercase text-rose-500 block mb-1">Common Pitfall</span>
                    <div className="text-sm font-bold text-text mb-1">"{selectedWtw.learnerWord}"</div>
                    <div className="text-xs text-rose-500/80 italic">"{selectedWtw.learnerSentence}"</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                    <span className="text-[10px] font-black uppercase text-emerald-500 block mb-1">Natural Expression</span>
                    <div className="text-sm font-bold text-text mb-1">"{selectedWtw.recommendedWord}"</div>
                    <div className="text-xs text-emerald-500/80 italic">"{selectedWtw.betterSentence}"</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
                  <div className="text-xs font-bold text-text">Why usage differs:</div>
                  <p className="text-xs text-text-secondary leading-relaxed">{selectedWtw.ruleExplanation}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-card border border-border flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold text-text-secondary">Common Collocations:</span>
                  {selectedWtw.commonCollocations.map((col, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold"
                    >
                      {col}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
