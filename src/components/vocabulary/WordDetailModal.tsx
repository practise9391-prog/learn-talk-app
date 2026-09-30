import React, { useState } from 'react';
import { VocabularyWord } from '../../types/curriculumModules';
import { useCurriculumModule } from '../../context/CurriculumModuleContext';
import { useNavigation } from '../../context/NavigationContext';
import {
  Volume2,
  Bookmark,
  CheckCircle2,
  Sparkles,
  Info,
  Layers,
  Languages,
  Plus,
  ArrowRight,
  X,
  Share2,
  MessageSquare
} from 'lucide-react';

interface WordDetailModalProps {
  word: VocabularyWord;
  onClose: () => void;
  onPracticeWord?: (word: VocabularyWord) => void;
}

export const WordDetailModal: React.FC<WordDetailModalProps> = ({
  word,
  onClose,
  onPracticeWord
}) => {
  const {
    toggleBookmarkWord,
    updateWordMastery,
    personalCollections,
    addWordToCollection,
    removeWordFromCollection
  } = useCurriculumModule();
  const { navigate } = useNavigation();

  const [activeTab, setActiveTab] = useState<'overview' | 'collocations' | 'synonyms' | 'translations'>('overview');
  const [showCollectionMenu, setShowCollectionMenu] = useState<boolean>(false);

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-card border border-border w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Top Word Card Header */}
        <div className="p-5 sm:p-6 border-b border-border bg-surface/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">
                {word.partOfSpeech} • {word.level}
              </span>
              <span className="text-[10px] font-bold text-text-muted uppercase">
                {word.category}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-black text-text tracking-tight">
                {word.word}
              </h2>
              <button
                type="button"
                onClick={() => playAudio(word.word)}
                className="p-2 rounded-xl bg-card border border-border hover:bg-primary hover:text-white text-primary transition-colors shadow-xs"
                title="Listen Pronunciation"
              >
                <Volume2 size={18} />
              </button>
            </div>

            <span className="text-xs text-text-muted font-mono mt-0.5 block">
              {word.pronunciation.ipa} ({word.pronunciation.audioGuide})
            </span>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => toggleBookmarkWord(word.id)}
              className={`p-2.5 rounded-xl border transition-colors shadow-xs ${
                word.isBookmarked
                  ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                  : 'bg-card border-border text-text-muted hover:text-text'
              }`}
              title="Bookmark Word"
            >
              <Bookmark size={16} fill={word.isBookmarked ? 'currentColor' : 'none'} />
            </button>

            <button
              type="button"
              onClick={() => setShowCollectionMenu(!showCollectionMenu)}
              className="px-3 py-2 rounded-xl bg-card border border-border text-xs font-bold text-text hover:bg-surface flex items-center gap-1.5 shadow-xs"
            >
              <Plus size={14} />
              <span>Collection</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Collections Dropdown */}
        {showCollectionMenu && (
          <div className="p-4 bg-surface border-b border-border text-xs space-y-2">
            <span className="font-bold text-text block mb-1">Add to Personal Collection:</span>
            <div className="flex items-center gap-2 flex-wrap">
              {personalCollections.map((col) => {
                const isInCol = col.wordIds.includes(word.id);
                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => {
                      if (isInCol) removeWordFromCollection(col.id, word.id);
                      else addWordToCollection(col.id, word.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                      isInCol
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card border-border text-text hover:bg-surface-hover'
                    }`}
                  >
                    {isInCol ? '✓ ' : '+ '} {col.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab Ribbon */}
        <div className="px-5 py-2 border-b border-border/80 bg-card flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
          {[
            { id: 'overview', label: 'Overview & Usage' },
            { id: 'collocations', label: 'Natural Collocations' },
            { id: 'synonyms', label: 'Synonyms & Nuances' },
            { id: 'translations', label: 'Telugu & Hindi' }
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                activeTab === t.id
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-text-muted hover:bg-surface'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          {/* TAB 1: OVERVIEW & USAGE */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Meaning */}
              <div className="p-4 rounded-2xl bg-surface border border-border space-y-1.5">
                <span className="text-[10px] font-bold text-primary uppercase block">Simple Meaning</span>
                <p className="text-sm font-bold text-text">{word.simpleMeaning}</p>
                <p className="text-xs text-text-muted leading-relaxed mt-1">{word.meaning}</p>
              </div>

              {/* Contextual Examples */}
              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-text block">
                  Contextual Examples
                </span>
                <div className="space-y-2">
                  {word.examples.map((ex, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl bg-surface border border-border flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <span className="text-[10px] font-bold text-primary uppercase block mb-0.5">
                          {ex.context}
                        </span>
                        <p className="font-semibold text-text">"{ex.sentence}"</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => playAudio(ex.sentence)}
                        className="p-2 rounded-xl text-primary hover:bg-card transition-colors shrink-0"
                      >
                        <Volume2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Word Usage Guide (Section 12) */}
              <div className="p-4 rounded-2xl bg-card border border-border space-y-2 text-xs">
                <strong className="text-xs font-black text-text block">Word Usage Blueprint:</strong>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-text-muted">
                  <div>
                    <span className="text-[10px] text-text font-bold block">Where to use:</span>
                    <span>{word.usageGuidelines.whereToUse}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-text font-bold block">Who to use with:</span>
                    <span>{word.usageGuidelines.whoToUseWith}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/80">
                  <span className="text-rose-500 font-bold block">Common Mistake:</span>
                  <p className="text-text-muted">{word.usageGuidelines.commonMistake}</p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                    Fix: {word.usageGuidelines.correction}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COLLOCATIONS (Section 16: Natural vs Uncommon vs Incorrect) */}
          {activeTab === 'collocations' && (
            <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-primary block">
                Collocation System: Natural Word Pairings
              </span>

              <div className="space-y-2">
                {word.collocations.map((col, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                      col.type === 'natural'
                        ? 'bg-emerald-500/10 border-emerald-500/20'
                        : col.type === 'possible_uncommon'
                        ? 'bg-amber-500/10 border-amber-500/20'
                        : 'bg-rose-500/10 border-rose-500/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-black text-text">"{col.phrase}"</strong>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.2 rounded-full ${
                            col.type === 'natural'
                              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                              : col.type === 'possible_uncommon'
                              ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                              : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {col.type.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-[11px] text-text-muted mt-0.5">{col.note}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => playAudio(col.phrase)}
                      className="p-2 rounded-xl text-primary hover:bg-card transition-colors self-end sm:self-auto shrink-0"
                    >
                      <Volume2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SYNONYMS & NUANCES (Section 13 & 15 Word Families) */}
          {activeTab === 'synonyms' && (
            <div className="space-y-4">
              <span className="text-xs font-black uppercase tracking-wider text-primary block">
                Synonyms With Formality & Nuance Differences
              </span>

              <div className="space-y-2">
                {word.synonyms.map((syn, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-surface border border-border flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-black text-text">{syn.word}</strong>
                        <span className="text-[10px] font-bold text-text-muted px-2 py-0.2 rounded-md bg-card border border-border">
                          {syn.formality}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted mt-1">{syn.nuance}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => playAudio(syn.word)}
                      className="p-2 rounded-xl text-primary hover:bg-card transition-colors shrink-0"
                    >
                      <Volume2 size={15} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Word Family (Section 15) */}
              {word.wordFamily && (
                <div className="p-4 rounded-2xl bg-surface border border-border space-y-2 text-xs">
                  <strong className="text-xs font-black text-text block">Word Family Derivatives:</strong>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {word.wordFamily.noun && (
                      <div className="p-2 rounded-xl bg-card border border-border/80 text-center">
                        <span className="text-[10px] text-text-muted uppercase block">Noun</span>
                        <strong className="text-text">{word.wordFamily.noun}</strong>
                      </div>
                    )}
                    {word.wordFamily.verb && (
                      <div className="p-2 rounded-xl bg-card border border-border/80 text-center">
                        <span className="text-[10px] text-text-muted uppercase block">Verb</span>
                        <strong className="text-text">{word.wordFamily.verb}</strong>
                      </div>
                    )}
                    {word.wordFamily.adjective && (
                      <div className="p-2 rounded-xl bg-card border border-border/80 text-center">
                        <span className="text-[10px] text-text-muted uppercase block">Adjective</span>
                        <strong className="text-text">{word.wordFamily.adjective}</strong>
                      </div>
                    )}
                    {word.wordFamily.adverb && (
                      <div className="p-2 rounded-xl bg-card border border-border/80 text-center">
                        <span className="text-[10px] text-text-muted uppercase block">Adverb</span>
                        <strong className="text-text">{word.wordFamily.adverb}</strong>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: TRANSLATIONS (Section 11 & 35: Telugu & Hindi) */}
          {activeTab === 'translations' && (
            <div className="space-y-4">
              <span className="text-xs font-black uppercase tracking-wider text-primary block">
                Multilingual Bridge (Telugu & Hindi)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-surface border border-border space-y-1.5">
                  <span className="text-[10px] font-bold text-primary uppercase block">Telugu Translation</span>
                  <strong className="text-base font-black text-text block">{word.translations.telugu}</strong>
                  <p className="text-[11px] text-text-muted">
                    Helps map your native language mental concept directly to natural English usage.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-surface border border-border space-y-1.5">
                  <span className="text-[10px] font-bold text-sky-500 uppercase block">Hindi Translation</span>
                  <strong className="text-base font-black text-text block">{word.translations.hindi}</strong>
                  <p className="text-[11px] text-text-muted">
                    Direct contextual equivalence for Indian bilingual learners.
                  </p>
                </div>
              </div>

              {word.translations.pronunciationTip && (
                <div className="p-3.5 rounded-xl bg-card border border-border text-xs text-text-muted">
                  <strong>Pronunciation Advice:</strong> {word.translations.pronunciationTip}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface/50 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => updateWordMastery(word.id, 'mastered', 20)}
              className="px-3.5 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <CheckCircle2 size={14} />
              <span>Mark Mastered</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                navigate('/talk/call', {
                  vocabContext: word.word,
                  initialMode: 'voice',
                });
              }}
              className="px-3.5 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
              title="Launch spoken conversation using this word"
            >
              <MessageSquare size={14} />
              <span>Use in Conversation</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {onPracticeWord && (
              <button
                type="button"
                onClick={() => onPracticeWord(word)}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover transition-colors shadow-sm"
              >
                Practice Word
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-card border border-border text-text font-bold text-xs hover:bg-surface"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
