import React, { useState, useEffect } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { SavedPhrase, PhraseCategory } from '../../types/talk';
import { INITIAL_SAVED_PHRASES } from '../../data/talkTopics';
import { ttsService } from '../../services/aiService';
import { useNavigation } from '../../context/NavigationContext';
import {
  Bookmark,
  Volume2,
  Copy,
  Check,
  Plus,
  Trash2,
  Search,
  Filter,
  Lightbulb,
  Sparkles,
  ArrowRight,
  BookOpen
} from 'lucide-react';

const CATEGORIES: ('All' | PhraseCategory)[] = [
  'All',
  'Work',
  'Interview',
  'Travel',
  'Daily Life',
  'Social',
  'Grammar',
  'Personal'
];

export const MySavedPhrasesView: React.FC = () => {
  const { navigate } = useNavigation();
  const [phrases, setPhrases] = useState<SavedPhrase[]>(() => {
    const saved = localStorage.getItem('learntalk_saved_phrases');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_SAVED_PHRASES;
      }
    }
    return INITIAL_SAVED_PHRASES;
  });

  const [selectedCategory, setSelectedCategory] = useState<'All' | PhraseCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Add Phrase Modal State
  const [isAddingOpen, setIsAddingOpen] = useState(false);
  const [newPhrase, setNewPhrase] = useState('');
  const [newCategory, setNewCategory] = useState<PhraseCategory>('Work');
  const [newAlternative, setNewAlternative] = useState('');
  const [newContext, setNewContext] = useState('');
  const [newWhy, setNewWhy] = useState('');

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('learntalk_saved_phrases', JSON.stringify(phrases));
  }, [phrases]);

  const handleCopy = (phrase: string, id: string) => {
    navigator.clipboard.writeText(phrase);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text: string, id: string) => {
    if (playingId === id) {
      ttsService.stop();
      setPlayingId(null);
      return;
    }
    ttsService.stop();
    setPlayingId(id);
    ttsService.speak(text, {
      rate: 0.9,
      onEnd: () => setPlayingId(null)
    });
  };

  const handleDelete = (id: string) => {
    setPhrases((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddPhrase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhrase.trim()) return;

    const item: SavedPhrase = {
      id: `saved-${Date.now()}`,
      phrase: newPhrase.trim(),
      category: newCategory,
      naturalAlternative: newAlternative.trim() || newPhrase.trim(),
      contextUsage: newContext.trim() || 'Used in conversation',
      whyThisWord: newWhy.trim() || undefined,
      savedAt: 'Just now'
    };

    setPhrases([item, ...phrases]);
    setNewPhrase('');
    setNewAlternative('');
    setNewContext('');
    setNewWhy('');
    setIsAddingOpen(false);
  };

  const filteredPhrases = phrases.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.phrase.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.naturalAlternative.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.contextUsage.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        title="My Saved Phrases & Vocabulary"
        subtitle="Key expressions, natural corrections, and professional phrases collected during your Jarvis chats"
        badge="Personal Phrasebook"
        showBack={true}
        actions={
          <button
            type="button"
            onClick={() => setIsAddingOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-xl shadow-sm hover:bg-primary-hover active:scale-95 transition-all"
          >
            <Plus size={16} />
            <span>Add Custom Phrase</span>
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved expressions, words, or contexts..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Categories scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-card border border-border text-text-muted hover:text-text hover:bg-surface'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Phrase count summary */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-bold text-text-muted">
          Showing {filteredPhrases.length} {filteredPhrases.length === 1 ? 'phrase' : 'phrases'}
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
        </p>
        <button
          type="button"
          onClick={() => navigate('/talk/call', { topicId: 'topic-office' })}
          className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
        >
          <span>Practice these in a Call</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Phrase Cards Grid */}
      {filteredPhrases.length === 0 ? (
        <div className="rounded-3xl bg-card border border-border p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center text-3xl mb-4 text-text-muted">
            📖
          </div>
          <h3 className="text-lg font-black text-text">No Saved Phrases Found</h3>
          <p className="text-sm text-text-muted mt-1 max-w-md">
            {searchQuery
              ? `No phrases matched your search "${searchQuery}". Try a different keyword.`
              : 'Save phrases during your voice conversations with Jarvis using the "⭐ Save Phrase" button!'}
          </p>
          <button
            type="button"
            onClick={() => setIsAddingOpen(true)}
            className="mt-6 px-5 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl shadow-sm hover:bg-primary-hover transition-all"
          >
            Add Your First Phrase
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPhrases.map((phrase) => {
            const isPlaying = playingId === phrase.id;
            const isCopied = copiedId === phrase.id;

            return (
              <div
                key={phrase.id}
                className="group rounded-3xl bg-card border border-border p-5 hover:border-primary/40 transition-all flex flex-col justify-between shadow-xs hover:shadow-md"
              >
                <div>
                  {/* Category badge & Actions */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                      {phrase.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleSpeak(phrase.phrase, phrase.id)}
                        className={`p-2 rounded-xl transition-all ${
                          isPlaying
                            ? 'bg-primary text-primary-foreground animate-pulse'
                            : 'bg-surface text-text-muted hover:text-text hover:bg-surface-hover'
                        }`}
                        title="Listen to pronunciation"
                      >
                        <Volume2 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopy(phrase.phrase, phrase.id)}
                        className="p-2 rounded-xl bg-surface text-text-muted hover:text-text hover:bg-surface-hover transition-all"
                        title="Copy phrase"
                      >
                        {isCopied ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(phrase.id)}
                        className="p-2 rounded-xl bg-surface text-text-muted hover:text-rose-500 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
                        title="Delete phrase"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Primary Phrase */}
                  <h4 className="text-base font-black text-text leading-snug">
                    "{phrase.phrase}"
                  </h4>

                  {/* Natural Alternative */}
                  {phrase.naturalAlternative && phrase.naturalAlternative !== phrase.phrase && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-surface border border-border text-xs text-text-muted">
                      <span className="font-bold text-text block mb-0.5 text-[11px] uppercase tracking-wider">
                        Natural Alternative:
                      </span>
                      <p className="text-text font-medium">"{phrase.naturalAlternative}"</p>
                    </div>
                  )}

                  {/* Context Usage */}
                  {phrase.contextUsage && (
                    <div className="mt-2 text-xs text-text-muted flex items-start gap-1.5">
                      <BookOpen size={13} className="shrink-0 mt-0.5 text-primary" />
                      <span>{phrase.contextUsage}</span>
                    </div>
                  )}

                  {/* Why this word explanation */}
                  {phrase.whyThisWord && (
                    <div className="mt-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                      <Lightbulb size={13} className="shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                      <span className="leading-relaxed">{phrase.whyThisWord}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-text-muted">
                  <span>Saved {phrase.savedAt}</span>
                  <button
                    type="button"
                    onClick={() => handleSpeak(phrase.phrase, phrase.id)}
                    className="font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <span>Practice Pronunciation</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Custom Phrase Modal */}
      {isAddingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-card border border-border p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Bookmark size={20} className="text-primary" />
                <h3 className="text-base font-black text-text">Add Phrase to My Library</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingOpen(false)}
                className="text-text-muted hover:text-text font-bold text-sm px-2 py-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPhrase} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-muted mb-1">
                  Expression or Phrase *
                </label>
                <input
                  type="text"
                  required
                  value={newPhrase}
                  onChange={(e) => setNewPhrase(e.target.value)}
                  placeholder="e.g. Could you please give me a quick walkthrough?"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-text-muted mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as PhraseCategory)}
                    className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-sm text-text focus:outline-none"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-muted mb-1">
                    Natural / Pro Alternative
                  </label>
                  <input
                    type="text"
                    value={newAlternative}
                    onChange={(e) => setNewAlternative(e.target.value)}
                    placeholder="e.g. Would you mind walking me through this?"
                    className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-muted mb-1">
                  When & How to Use It
                </label>
                <input
                  type="text"
                  value={newContext}
                  onChange={(e) => setNewContext(e.target.value)}
                  placeholder="e.g. During onboarding or code reviews when requesting an explanation."
                  className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-muted mb-1">
                  Why this word / nuance tip (Optional)
                </label>
                <textarea
                  rows={2}
                  value={newWhy}
                  onChange={(e) => setNewWhy(e.target.value)}
                  placeholder="e.g. 'Walkthrough' sounds conversational and collaborative compared to 'explain everything to me'."
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAddingOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-text-muted hover:bg-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm"
                >
                  Save Phrase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
