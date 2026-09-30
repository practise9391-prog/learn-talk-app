import React, { useState } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { useCurriculumModule } from '../../context/CurriculumModuleContext';
import { useNavigation } from '../../context/NavigationContext';
import { IdiomItem } from '../../types/curriculumModules';
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
  X
} from 'lucide-react';

export const IdiomsHubView: React.FC = () => {
  const { idioms, toggleBookmarkIdiom } = useCurriculumModule();
  const { navigate } = useNavigation();

  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeIdiom, setActiveIdiom] = useState<IdiomItem | null>(null);

  // Speaking state for modal
  const [userSpeech, setUserSpeech] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speakingFeedback, setSpeakingFeedback] = useState<string | null>(null);

  const levelTabs = [
    { id: 'all', label: 'All Idioms' },
    { id: 'beginner', label: 'Beginner (Everyday)' },
    { id: 'intermediate', label: 'Intermediate (Social & Workplace)' },
    { id: 'advanced', label: 'Advanced (Nuanced & Leadership)' }
  ];

  const filteredIdioms = idioms.filter((i) => {
    const matchesLevel = selectedLevel === 'all' || i.level === selectedLevel;
    const matchesQuery =
      !searchQuery ||
      i.phrase.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.actualMeaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.simpleExplanation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesQuery;
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

  const handleStartSpeaking = () => {
    setUserSpeech('');
    setSpeakingFeedback(null);
    setIsListening(true);

    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const rec = new SpeechRecognition();
          rec.continuous = false;
          rec.interimResults = false;
          rec.lang = 'en-US';

          rec.onresult = (e: any) => {
            const transcript = e.results[0][0].transcript;
            setUserSpeech(transcript);
            setIsListening(false);
            setSpeakingFeedback(
              '✓ Excellent! You naturally incorporated the idiom into a cohesive spoken thought.'
            );
          };

          rec.onerror = () => setIsListening(false);
          rec.onend = () => setIsListening(false);
          rec.start();
        } catch (e) {
          setIsListening(false);
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-12">
      {/* Page Header */}
      <PageHeader
        title="Idioms & Conversational Metaphors"
        subtitle="Master real-life expressions native speakers use daily instead of formal textbook vocabulary"
        badge="Natural Expressions"
      />

      {/* Hero Overview */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-primary/10 via-secondary/10 to-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
            Beyond Literal Translation
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-text mt-0.5">
            Literal Meaning vs Actual Meaning
          </h3>
          <p className="text-xs text-text-muted mt-1 max-w-xl leading-relaxed">
            Idioms cannot be understood by translating word-by-word. Learn the story, cultural origin, and conversational context behind every popular phrase.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {levelTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedLevel(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedLevel === tab.id
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-card hover:bg-surface text-text-muted border border-border/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search idioms or meanings..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-card border border-border text-xs text-text focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Idioms Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {filteredIdioms.map((idiom) => (
            <div
              key={idiom.id}
              className="p-5 rounded-3xl bg-card border border-border hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-primary/10 text-primary uppercase">
                    {idiom.level} • {idiom.category}
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleBookmarkIdiom(idiom.id)}
                    className={`p-1.5 rounded-lg text-text-muted hover:text-amber-500 transition-colors ${
                      idiom.isBookmarked ? 'text-amber-500' : ''
                    }`}
                  >
                    <Bookmark size={14} fill={idiom.isBookmarked ? 'currentColor' : 'none'} />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4
                    onClick={() => setActiveIdiom(idiom)}
                    className="text-lg font-black text-text group-hover:text-primary transition-colors cursor-pointer"
                  >
                    "{idiom.phrase}"
                  </h4>
                  <button
                    type="button"
                    onClick={() => playAudio(idiom.phrase)}
                    className="p-1.5 text-text-muted hover:text-primary transition-colors"
                  >
                    <Volume2 size={16} />
                  </button>
                </div>

                {/* Literal vs Actual Comparison (Section 20 & 33) */}
                <div className="space-y-1.5 text-xs mb-3">
                  <div className="p-2.5 rounded-xl bg-surface border border-border/80 text-text-muted">
                    <span className="text-[10px] uppercase font-bold text-text-muted block">
                      Literal:
                    </span>
                    <span className="italic">{idiom.literalMeaning}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                    <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">
                      Actual Meaning:
                    </span>
                    <strong>{idiom.actualMeaning}</strong>
                  </div>
                </div>

                <p className="text-xs text-text-muted leading-relaxed mb-4">
                  "{idiom.examples[0]}"
                </p>
              </div>

              <div className="pt-2 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setActiveIdiom(idiom)}
                  className="w-full py-2 px-3 rounded-xl bg-surface hover:bg-primary hover:text-white text-text font-bold text-xs border border-border transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>Explore Dialogue & Speaking Challenge</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Idiom Detail & Speaking Challenge Modal */}
      {activeIdiom && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-card border border-border w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
            <div className="p-5 border-b border-border bg-surface/50 flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] font-black uppercase text-primary tracking-wider block">
                  Idiom Profile • {activeIdiom.level}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <h3 className="text-xl font-black text-text">"{activeIdiom.phrase}"</h3>
                  <button
                    type="button"
                    onClick={() => playAudio(activeIdiom.phrase)}
                    className="p-1.5 text-primary hover:bg-card rounded-lg"
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveIdiom(null);
                  setSpeakingFeedback(null);
                  setUserSpeech('');
                }}
                className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-5 overflow-y-auto text-xs">
              {/* Meaning breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-surface border border-border">
                  <span className="text-[10px] font-bold text-text-muted uppercase block">Literal Imagery</span>
                  <p className="text-text-muted mt-1 italic">{activeIdiom.literalMeaning}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase block">Actual Native Meaning</span>
                  <p className="text-emerald-700 dark:text-emerald-300 font-bold mt-1">{activeIdiom.actualMeaning}</p>
                </div>
              </div>

              {/* Cultural Context if available */}
              {activeIdiom.culturalContext && (
                <div className="p-3.5 rounded-xl bg-card border border-border/80 text-text-muted leading-relaxed">
                  <strong className="text-primary font-bold block mb-1">Cultural & Historical Origin:</strong>
                  {activeIdiom.culturalContext}
                </div>
              )}

              {/* Short Conversation Snippet */}
              <div className="space-y-2">
                <span className="text-xs font-black uppercase text-text block">Conversational Dialogue:</span>
                <div className="space-y-2 p-3.5 rounded-2xl bg-surface border border-border">
                  {activeIdiom.conversationSnippet.map((line, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <strong className="text-primary font-bold">{line.speaker}:</strong>{' '}
                      <span className="text-text font-medium">"{line.text}"</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Speaking Challenge */}
              <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
                <div className="flex items-center gap-2">
                  <Mic size={16} className="text-primary" />
                  <strong className="text-xs font-black text-text">Speaking Challenge:</strong>
                </div>
                <p className="text-text-muted">{activeIdiom.speakingChallenge}</p>

                <textarea
                  value={userSpeech}
                  onChange={(e) => setUserSpeech(e.target.value)}
                  placeholder="Click record and speak your response naturally..."
                  rows={3}
                  className="w-full p-3 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none focus:border-primary resize-none"
                />

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleStartSpeaking}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isListening
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-primary text-primary-foreground hover:bg-primary-hover shadow-xs'
                    }`}
                  >
                    <Mic size={14} />
                    <span>{isListening ? 'Listening...' : 'Speak Challenge'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveIdiom(null);
                      navigate('/talk/call', { initialMode: 'voice', topicId: 'interests-1' });
                    }}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <span>Practice in Talk with Jarvis →</span>
                  </button>
                </div>

                {speakingFeedback && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold">
                    {speakingFeedback}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-border flex justify-end bg-surface/50 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setActiveIdiom(null);
                  setSpeakingFeedback(null);
                  setUserSpeech('');
                }}
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
