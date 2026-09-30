import React, { useState } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { useCurriculumModule } from '../../context/CurriculumModuleContext';
import { useNavigation } from '../../context/NavigationContext';
import { PhrasalVerbItem } from '../../types/curriculumModules';
import {
  Compass,
  Volume2,
  Bookmark,
  Play,
  CheckCircle2,
  Mic,
  MessageSquare,
  Search,
  Sparkles,
  ArrowRight,
  X,
  Split,
  Layers
} from 'lucide-react';

export const PhrasalVerbsHubView: React.FC = () => {
  const { phrasalVerbs, toggleBookmarkPhrasalVerb } = useCurriculumModule();
  const { navigate } = useNavigation();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeVerb, setActiveVerb] = useState<PhrasalVerbItem | null>(null);

  // Practice state
  const [practiceAnswer, setPracticeAnswer] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Phrasal Verbs' },
    { id: 'workplace', label: 'Workplace & Business' },
    { id: 'everyday', label: 'Everyday Life' }
  ];

  const filteredVerbs = phrasalVerbs.filter((pv) => {
    const matchesCat = selectedCategory === 'all' || pv.category === selectedCategory;
    const matchesQuery =
      !searchQuery ||
      pv.phrase.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pv.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pv.baseVerb.toLowerCase().includes(searchQuery.toLowerCase());
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
        title="Phrasal Verbs in Context"
        subtitle="Verb + Particle = Brand New Meaning. Master separable rules and formal alternatives."
        badge="Natural Fluency"
      />

      {/* Visual Mechanism Banner (Section 22 & 33) */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-primary/10 via-secondary/10 to-card border border-border flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xs">
        <div>
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
            Core Linguistic Mechanism
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-text mt-0.5">
            Base Verb + Preposition / Particle → Brand New Meaning
          </h3>
          <p className="text-xs text-text-muted mt-1 max-w-xl leading-relaxed">
            Native speakers naturally use phrasal verbs in 80% of spoken conversation. Learn how "call off" replaces "cancel" and "look into" replaces "investigate".
          </p>
        </div>

        {/* Visual Formula Card */}
        <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-card border border-border shrink-0 text-center font-mono font-bold text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary">Verb (Look)</span>
          <span className="text-text-muted">+</span>
          <span className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-500">Particle (Into)</span>
          <span className="text-text-muted">=</span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500">Investigate</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-card hover:bg-surface text-text-muted border border-border/70'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search phrasal verbs or base verbs..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-card border border-border text-xs text-text focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {filteredVerbs.map((pv) => (
            <div
              key={pv.id}
              className="p-5 rounded-3xl bg-card border border-border hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-primary/10 text-primary uppercase">
                      {pv.level}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        pv.grammarBehavior.separable
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-indigo-500/10 text-indigo-500'
                      }`}
                    >
                      {pv.grammarBehavior.separable ? 'Separable' : 'Inseparable'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleBookmarkPhrasalVerb(pv.id)}
                    className={`p-1.5 rounded-lg text-text-muted hover:text-amber-500 transition-colors ${
                      pv.isBookmarked ? 'text-amber-500' : ''
                    }`}
                  >
                    <Bookmark size={14} fill={pv.isBookmarked ? 'currentColor' : 'none'} />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h4
                    onClick={() => setActiveVerb(pv)}
                    className="text-lg font-black text-text group-hover:text-primary transition-colors cursor-pointer"
                  >
                    "{pv.phrase}"
                  </h4>
                  <button
                    type="button"
                    onClick={() => playAudio(pv.phrase)}
                    className="p-1.5 text-text-muted hover:text-primary transition-colors"
                  >
                    <Volume2 size={16} />
                  </button>
                </div>

                <p className="text-xs font-semibold text-text mb-1">
                  {pv.simpleMeaning}
                </p>

                {/* Formal Alternative Comparison (Section 22) */}
                <div className="p-2.5 rounded-xl bg-surface border border-border/80 text-[11px] mb-3 flex items-center justify-between">
                  <span className="text-text-muted">Formal Alternative:</span>
                  <strong className="text-primary font-mono">{pv.formalAlternative}</strong>
                </div>

                <p className="text-xs text-text-muted italic leading-relaxed mb-4">
                  "{pv.examples[0]}"
                </p>
              </div>

              <div className="pt-2 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setActiveVerb(pv)}
                  className="w-full py-2 px-3 rounded-xl bg-surface hover:bg-primary hover:text-white text-text font-bold text-xs border border-border transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>Explore Grammar Rules & Practice</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail & Practice Modal */}
      {activeVerb && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-card border border-border w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
            <div className="p-5 border-b border-border bg-surface/50 flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] font-black uppercase text-primary tracking-wider block">
                  Phrasal Verb Detail • {activeVerb.level}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <h3 className="text-xl font-black text-text">"{activeVerb.phrase}"</h3>
                  <button
                    type="button"
                    onClick={() => playAudio(activeVerb.phrase)}
                    className="p-1.5 text-primary hover:bg-card rounded-lg"
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveVerb(null)}
                className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-5 overflow-y-auto text-xs">
              {/* Grammar Behavior (Separable vs Inseparable) */}
              <div className="p-4 rounded-2xl bg-surface border border-border space-y-2">
                <strong className="text-xs font-black text-text block">Grammar Pattern & Placement:</strong>
                <p className="text-xs font-mono font-bold text-primary">
                  {activeVerb.grammarBehavior.pattern}
                </p>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  {activeVerb.grammarBehavior.separable
                    ? 'This phrasal verb is separable. You can place the object between the verb and particle, or after the particle (e.g. "find it out" or "find out the truth").'
                    : 'This phrasal verb is inseparable. The object must always follow the particle directly (e.g. "look into the problem", never "look the problem into").'}
                </p>
              </div>

              {/* Conversational Examples */}
              <div className="space-y-2">
                <strong className="text-xs font-black text-text block">Everyday Sentence Examples:</strong>
                <div className="space-y-2">
                  {activeVerb.examples.map((ex, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-surface border border-border/80 flex items-center justify-between gap-2"
                    >
                      <span className="font-semibold text-text">"{ex}"</span>
                      <button
                        type="button"
                        onClick={() => playAudio(ex)}
                        className="p-1.5 text-primary hover:bg-card rounded-md shrink-0"
                      >
                        <Volume2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dialogue Snippet */}
              <div className="space-y-2">
                <strong className="text-xs font-black text-text block">Conversational Turn:</strong>
                <div className="space-y-2 p-3.5 rounded-2xl bg-card border border-border">
                  {activeVerb.conversationSnippet.map((line, idx) => (
                    <div key={idx}>
                      <strong className="text-primary">{line.speaker}:</strong>{' '}
                      <span className="text-text font-medium">"{line.text}"</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comparison Differences */}
              {activeVerb.comparisonDiff && activeVerb.comparisonDiff.length > 0 && (
                <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
                  <strong className="text-xs font-black text-text block">How it differs from single-word verbs:</strong>
                  {activeVerb.comparisonDiff.map((diff, idx) => (
                    <p key={idx} className="text-text-muted leading-relaxed">
                      <strong>vs "{diff.word}":</strong> {diff.explanation}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border flex items-center justify-between bg-surface/50 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setActiveVerb(null);
                  navigate('/talk/call', { initialMode: 'voice', topicId: 'work-1' });
                }}
                className="px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare size={13} />
                <span>Practice with Jarvis</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveVerb(null)}
                className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
