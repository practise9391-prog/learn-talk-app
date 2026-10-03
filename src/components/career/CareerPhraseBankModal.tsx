import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Search,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Bookmark,
  MessageSquare,
  ThumbsDown,
  ThumbsUp,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { CAREER_PHRASES_MASTER } from '../../data/careerData';
import { ProfessionalPhraseItem } from '../../types/career';
import { useCareer } from '../../context/CareerContext';

interface CareerPhraseBankModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PhraseCategory = ProfessionalPhraseItem['category'] | 'all';

const CATEGORIES: Array<{ id: PhraseCategory; label: string }> = [
  { id: 'all', label: 'All Phrases' },
  { id: 'meetings', label: 'Meetings & Standups' },
  { id: 'disagreement', label: 'Disagreement & Pushback' },
  { id: 'clarification', label: 'Clarifying Requirements' },
  { id: 'presentations', label: 'Executive Updates' },
  { id: 'emails', label: 'Email & Slack' },
  { id: 'interviews', label: 'Interview Questions' },
  { id: 'negotiation', label: 'Negotiation' },
];

export const CareerPhraseBankModal: React.FC<CareerPhraseBankModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { savePortfolioItem } = useCareer();
  const [selectedCat, setSelectedCat] = useState<PhraseCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredPhrases = CAREER_PHRASES_MASTER.filter((item) => {
    const matchesCat = selectedCat === 'all' || item.category === selectedCat;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.phrase.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.contextUsage.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handlePlayAudio = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (playingId === id) {
      window.speechSynthesis.cancel();
      setPlayingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setPlayingId(null);
    utterance.onerror = () => setPlayingId(null);

    setPlayingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveToPortfolio = (item: ProfessionalPhraseItem) => {
    savePortfolioItem({
      itemType: 'interview_answer',
      title: `Career Phrase: ${item.phrase.substring(0, 30)}...`,
      content: `Phrase: "${item.phrase}"\nMeaning: ${item.meaning}\nContext: ${item.contextUsage}\nInstead of casual: "${item.casualAlternative}"\nExample: "${item.exampleSentence}"`,
      tags: ['Workplace Phrase', item.category, item.formality],
    });
    setSavedId(item.id);
    setTimeout(() => setSavedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl bg-card border border-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <MessageSquare size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-text">Workplace & Interview Phrase Bank</h2>
              <p className="text-xs text-text-muted">
                Executive-level phrasing for standups, constructive pushback, negotiations, and requirements
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (playingId) window.speechSynthesis?.cancel();
              onClose();
            }}
            className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Search & Categories Bar */}
          <div className="space-y-3">
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search phrases by keyword, meaning, or workplace situation..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-surface border border-border text-xs sm:text-sm text-text placeholder:text-text-muted/60 focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCat(cat.id)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all ${
                    selectedCat === cat.id
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'bg-surface hover:bg-card border border-border text-text'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Phrases Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPhrases.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-surface border border-border hover:border-primary/40 transition-all flex flex-col justify-between gap-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-card border border-border text-[10px] font-bold text-text-muted uppercase tracking-wider">
                      {item.category} • {item.formality}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(item.id, item.audioText || item.phrase)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          playingId === item.id
                            ? 'bg-rose-500 text-white border-rose-500 animate-pulse'
                            : 'bg-card border-border text-text hover:text-primary'
                        }`}
                        title="Listen to phrase"
                      >
                        {playingId === item.id ? <VolumeX size={13} /> : <Volume2 size={13} />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopy(item.id, item.phrase)}
                        className="p-1.5 rounded-lg bg-card border border-border text-text hover:text-primary transition-colors"
                        title="Copy phrase"
                      >
                        {copiedId === item.id ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xs sm:text-sm font-black text-text leading-snug">
                    "{item.phrase}"
                  </h3>

                  <p className="text-xs text-text leading-relaxed">
                    <span className="font-bold text-text">Meaning:</span> {item.meaning}
                  </p>

                  <p className="text-xs text-text-muted leading-relaxed">
                    <span className="font-bold text-text">Context:</span> {item.contextUsage}
                  </p>
                </div>

                {/* What to avoid vs example */}
                <div className="pt-2 border-t border-border space-y-1.5 text-[11px]">
                  {item.casualAlternative && (
                    <div className="flex items-start gap-1.5 text-rose-600 dark:text-rose-400">
                      <ThumbsDown size={12} className="shrink-0 mt-0.5" />
                      <span>
                        <span className="font-bold">Instead of:</span> "{item.casualAlternative}"
                      </span>
                    </div>
                  )}

                  {item.exampleSentence && (
                    <div className="flex items-start gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <ThumbsUp size={12} className="shrink-0 mt-0.5" />
                      <span>
                        <span className="font-bold">Example:</span> "{item.exampleSentence}"
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => handleSaveToPortfolio(item)}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      <Bookmark size={11} />
                      <span>{savedId === item.id ? 'Saved!' : 'Save to Vault'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPhrases.length === 0 && (
            <div className="p-12 text-center text-xs text-text-muted">
              No career phrases found matching "{searchQuery}".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-surface/30 flex items-center justify-between">
          <span className="text-xs text-text-muted">
            Executive tip: Confident workplace phrases frame problems around tradeoffs, not personal friction.
          </span>
          <button
            type="button"
            onClick={() => {
              if (playingId) window.speechSynthesis?.cancel();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-text hover:bg-card transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
