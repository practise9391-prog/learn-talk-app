import React, { useState } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { useCurriculumModule } from '../../context/CurriculumModuleContext';
import { useNavigation } from '../../context/NavigationContext';
import { VocabularyWord, VocabCategory } from '../../types/curriculumModules';
import { WordDetailModal } from './WordDetailModal';
import {
  Sparkles,
  Search,
  Filter,
  Volume2,
  Bookmark,
  Clock,
  CheckCircle2,
  BookMarked,
  ArrowRight,
  Flame,
  Zap,
  Play
} from 'lucide-react';

export const VocabularyHubView: React.FC = () => {
  const {
    vocabularyWords,
    wordsDueForReview,
    personalCollections,
    toggleBookmarkWord
  } = useCurriculumModule();
  const { navigate } = useNavigation();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(null);

  const categories = [
    { id: 'all', label: 'All Words' },
    { id: 'workplace', label: 'Workplace' },
    { id: 'professional', label: 'Professional' },
    { id: 'technology', label: 'Technology' },
    { id: 'everyday', label: 'Everyday' },
    { id: 'college', label: 'College' },
    { id: 'travel', label: 'Travel' },
    { id: 'social', label: 'Social' }
  ];

  const filteredWords = vocabularyWords.filter((w) => {
    if (selectedCollectionId) {
      const col = personalCollections.find((c) => c.id === selectedCollectionId);
      if (!col || !col.wordIds.includes(w.id)) return false;
    }
    const matchesCat = selectedCategory === 'all' || w.category === selectedCategory;
    const matchesQuery =
      !searchQuery ||
      w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.simpleMeaning.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

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
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-12">
      {/* Page Header */}
      <PageHeader
        title="Active Vocabulary Bank & Collocations"
        subtitle="Meaning → Context → Pronunciation → Example → Usage → Practice → Conversation"
        badge="Contextual Lexicon"
      />

      {/* Spaced Repetition Alert Banner (Section 19) */}
      {wordsDueForReview.length > 0 && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-card border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black shrink-0 shadow-sm">
              <Clock size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                Spaced Repetition Schedule
              </span>
              <h4 className="text-base font-black text-text">
                {wordsDueForReview.length} Words Due for Retention Review Today
              </h4>
              <p className="text-xs text-text-muted mt-0.5">
                Strengthen neural recall before these words fade from active memory.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSelectedWord(wordsDueForReview[0])}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-sm transition-colors"
          >
            <Play size={13} fill="currentColor" />
            <span>Review Now</span>
          </button>
        </div>
      )}

      {/* "My Words" Personal Area & Collections (Section 18) */}
      <div className="rounded-3xl bg-card border border-border p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-text flex items-center gap-2">
              <BookMarked size={18} className="text-primary" />
              <span>My Words & Custom Collections</span>
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Personalized word banks for interviews, workplace meetings, and recurring slips
            </p>
          </div>

          {selectedCollectionId && (
            <button
              type="button"
              onClick={() => setSelectedCollectionId(null)}
              className="text-xs font-bold text-primary hover:underline"
            >
              Clear Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {personalCollections.map((col) => {
            const isSelected = selectedCollectionId === col.id;
            return (
              <div
                key={col.id}
                onClick={() =>
                  setSelectedCollectionId(isSelected ? null : col.id)
                }
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-primary/10 border-primary ring-2 ring-primary/20 shadow-xs'
                    : 'bg-surface border-border hover:border-primary/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black text-text">{col.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-card border border-border text-primary">
                      {col.wordIds.length}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-muted line-clamp-2">{col.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Ribbon & Search */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSelectedCollectionId(null);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id && !selectedCollectionId
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-card hover:bg-surface text-text-muted border border-border/70'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search words, meanings, collocations..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-card border border-border text-xs text-text focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Word Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {filteredWords.map((word) => (
            <div
              key={word.id}
              className="p-5 rounded-3xl bg-card border border-border hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase">
                      {word.level}
                    </span>
                    <span className="text-[10px] font-bold text-text-muted capitalize">
                      {word.partOfSpeech}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleBookmarkWord(word.id)}
                    className={`p-1.5 rounded-lg text-text-muted hover:text-amber-500 transition-colors ${
                      word.isBookmarked ? 'text-amber-500' : ''
                    }`}
                  >
                    <Bookmark size={14} fill={word.isBookmarked ? 'currentColor' : 'none'} />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4
                    onClick={() => setSelectedWord(word)}
                    className="text-lg font-black text-text group-hover:text-primary transition-colors cursor-pointer"
                  >
                    {word.word}
                  </h4>
                  <button
                    type="button"
                    onClick={() => playAudio(word.word)}
                    className="p-1.5 text-text-muted hover:text-primary transition-colors"
                  >
                    <Volume2 size={16} />
                  </button>
                </div>

                <p className="text-xs font-medium text-text mb-2 line-clamp-2">
                  {word.simpleMeaning}
                </p>

                {/* Collocation preview */}
                <div className="p-2.5 rounded-xl bg-surface border border-border/80 text-[11px] mb-3">
                  <span className="text-text-muted text-[10px] uppercase font-bold block mb-0.5">
                    Key Collocation:
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    "{word.collocations[0]?.phrase || word.word}"
                  </span>
                </div>
              </div>

              {/* Retention indicator and explore button */}
              <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${word.recallStrength}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-text-muted">
                    {word.recallStrength}% Recall
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedWord(word)}
                  className="px-3 py-1 rounded-xl bg-surface hover:bg-primary hover:text-white text-text font-bold text-xs border border-border transition-colors shadow-xs"
                >
                  Explore Word
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Word Detail Modal */}
      {selectedWord && (
        <WordDetailModal
          word={selectedWord}
          onClose={() => setSelectedWord(null)}
          onPracticeWord={(w) => {
            setSelectedWord(null);
            navigate('/talk/call', {
              initialMode: 'voice',
              topicId: 'work-1'
            });
          }}
        />
      )}
    </div>
  );
};
