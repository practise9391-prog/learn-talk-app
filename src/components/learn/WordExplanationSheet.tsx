import React, { useState } from 'react';
import { VocabularyWord } from '../../types/curriculum';
import { BottomSheet } from '../common/BottomSheet';
import { Volume2, Bookmark, BookmarkCheck, Sparkles, Languages, Check, ArrowRight } from 'lucide-react';

interface WordExplanationSheetProps {
  wordData: VocabularyWord | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveWord?: (wordId: string) => void;
  isSaved?: boolean;
}

export const WordExplanationSheet: React.FC<WordExplanationSheetProps> = ({
  wordData,
  isOpen,
  onClose,
  onSaveWord,
  isSaved = false,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'telugu' | 'hindi'>('telugu');
  const [savedLocally, setSavedLocally] = useState<boolean>(isSaved);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  if (!wordData) return null;

  const handleSave = () => {
    setSavedLocally(!savedLocally);
    if (onSaveWord) onSaveWord(wordData.id);
  };

  const playPronunciation = () => {
    setIsPlayingAudio(true);
    // Use Web Speech API if supported in browser for instant real native voice
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(wordData.word);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingAudio(false), 1200);
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Word & Phrase Guide">
      <div className="flex flex-col gap-4 text-text">
        {/* Word Header with Audio & Bookmark */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-border">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-2xl font-black text-primary tracking-tight">
                {wordData.word}
              </h2>
              <button
                type="button"
                onClick={playPronunciation}
                className={`p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors ${
                  isPlayingAudio ? 'ring-2 ring-primary animate-pulse' : ''
                }`}
                title="Hear native pronunciation"
                aria-label="Hear pronunciation"
              >
                <Volume2 size={18} />
              </button>
            </div>
            {wordData.pronunciation && (
              <span className="text-xs font-mono text-text-muted mt-1 block">
                Pronunciation: {wordData.pronunciation}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleSave}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              savedLocally
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : 'bg-card border-border text-text-muted hover:text-text'
            }`}
          >
            {savedLocally ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
            <span>{savedLocally ? 'Saved' : 'Save Word'}</span>
          </button>
        </div>

        {/* Simple Meaning & Core Meaning */}
        <div className="p-4 rounded-2xl bg-surface border border-border space-y-2">
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
              Simple Meaning (In Plain English)
            </span>
            <p className="text-sm font-bold text-text mt-0.5">
              {wordData.simpleMeaning}
            </p>
          </div>

          <div className="pt-2 border-t border-border">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
              Full Meaning
            </span>
            <p className="text-xs text-text-muted leading-relaxed mt-0.5">
              {wordData.meaning}
            </p>
          </div>
        </div>

        {/* Real-World Example Sentence */}
        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-1">
            Real Spoken Example
          </span>
          <p className="text-sm font-semibold text-text italic">
            "{wordData.example}"
          </p>
        </div>

        {/* "Use it when..." Context Guide (Requirement 18) */}
        {wordData.usageContext && (
          <div className="p-3.5 rounded-2xl bg-surface border border-border text-xs">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">
              Use it when:
            </span>
            <p className="text-text leading-relaxed">
              {wordData.usageContext}
            </p>
          </div>
        )}

        {/* Indian Language Translation Toggle (Requirement 18) */}
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-text flex items-center gap-1.5">
              <Languages size={14} className="text-primary" />
              <span>Native Language Translation</span>
            </span>

            <div className="flex items-center gap-1 bg-card p-0.5 rounded-lg border border-border text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setSelectedLanguage('telugu')}
                className={`px-2 py-0.5 rounded-md transition-colors ${
                  selectedLanguage === 'telugu' ? 'bg-primary text-white' : 'text-text-muted hover:text-text'
                }`}
              >
                Telugu
              </button>
              <button
                type="button"
                onClick={() => setSelectedLanguage('hindi')}
                className={`px-2 py-0.5 rounded-md transition-colors ${
                  selectedLanguage === 'hindi' ? 'bg-primary text-white' : 'text-text-muted hover:text-text'
                }`}
              >
                Hindi
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-card border border-border text-sm font-bold text-text">
            {selectedLanguage === 'telugu'
              ? wordData.teluguTranslation || 'తెలుగు అర్థం అందుబాటులో ఉంది'
              : wordData.hindiTranslation || 'हिंदी अर्थ उपलब्ध है'}
          </div>
        </div>

        {/* Collocations & Common Phrases */}
        {wordData.collocations && wordData.collocations.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-surface border border-border text-xs">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-2">
              Common Phrases & Collocations:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {wordData.collocations.map((c, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-card border border-border text-[11px] font-semibold text-text"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 bg-primary text-primary-foreground font-bold text-xs rounded-xl shadow-sm hover:bg-primary-hover transition-colors"
        >
          Got It, Continue Lesson
        </button>
      </div>
    </BottomSheet>
  );
};
