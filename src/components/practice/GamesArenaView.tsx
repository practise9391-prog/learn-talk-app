import React, { useState } from 'react';
import {
  WORD_ASSOCIATION_DATA,
  THREE_WORD_STORIES,
  PICTURE_DESCRIPTIONS,
  SENTENCE_BUILDER_ITEMS,
  SENTENCE_TRANSFORMATION_ITEMS,
  ERROR_DETECTIVE_ITEMS,
  NATURAL_OR_NOT_ITEMS,
  FORMAL_VS_CASUAL_ITEMS,
} from '../../data/practiceData';
import { useUser } from '../../context/UserContext';
import { useHistory } from '../../context/HistoryContext';
import {
  Gamepad2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Volume2,
  Mic,
  ArrowRight,
  Check,
  Languages,
  BookOpen,
  Image as ImageIcon,
} from 'lucide-react';

export const GamesArenaView: React.FC = () => {
  const { updateUser } = useUser();
  const { logActivity } = useHistory();

  // Sub-game selection
  const [activeGame, setActiveGame] = useState<
    | 'word_assoc'
    | 'sentence_builder'
    | 'three_word'
    | 'error_detective'
    | 'natural_or_not'
    | 'formal_casual'
    | 'sentence_trans'
    | 'picture_desc'
    | 'translate_thought'
  >('word_assoc');

  // Word Association state
  const [waWords, setWaWords] = useState<string[]>([]);
  const [waInput, setWaInput] = useState<string>('');

  // Sentence Builder state
  const [sbActiveItem] = useState(SENTENCE_BUILDER_ITEMS[0]);
  const [sbPlacedWords, setSbPlacedWords] = useState<string[]>([]);
  const [sbAvailableWords, setSbAvailableWords] = useState<string[]>(
    SENTENCE_BUILDER_ITEMS[0].scrambledWords
  );
  const [sbSubmitted, setSbSubmitted] = useState<boolean>(false);

  // Error Detective state
  const [edIndex, setEdIndex] = useState<number>(0);
  const [edFound, setEdFound] = useState<boolean>(false);
  const activeEd = ERROR_DETECTIVE_ITEMS[edIndex] || ERROR_DETECTIVE_ITEMS[0];

  // Natural or Not state
  const [nonIndex, setNonIndex] = useState<number>(0);
  const [nonSelected, setNonSelected] = useState<'A' | 'B' | null>(null);
  const activeNon = NATURAL_OR_NOT_ITEMS[nonIndex] || NATURAL_OR_NOT_ITEMS[0];

  // Formal vs Casual state
  const [fvcIndex, setFvcIndex] = useState<number>(0);
  const activeFvc = FORMAL_VS_CASUAL_ITEMS[fvcIndex] || FORMAL_VS_CASUAL_ITEMS[0];

  // Translate My Thought state
  const [userThought, setUserThought] = useState<string>('');
  const [translatedVersions, setTranslatedVersions] = useState<{
    simple: string;
    natural: string;
    professional: string;
  } | null>(null);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'en-US';
      utter.rate = 0.95;
      window.speechSynthesis.speak(utter);
    }
  };

  const handleAddWaWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waInput.trim()) return;
    const clean = waInput.trim().toLowerCase();
    if (!waWords.includes(clean)) {
      setWaWords((prev) => [...prev, clean]);
      updateUser({ xp: 5 });
    }
    setWaInput('');
  };

  const handleWordClickBuilder = (word: string, fromAvailable: boolean) => {
    if (sbSubmitted) return;
    if (fromAvailable) {
      setSbAvailableWords((prev) => {
        const idx = prev.indexOf(word);
        if (idx === -1) return prev;
        const copy = [...prev];
        copy.splice(idx, 1);
        return copy;
      });
      setSbPlacedWords((prev) => [...prev, word]);
    } else {
      setSbPlacedWords((prev) => {
        const idx = prev.indexOf(word);
        if (idx === -1) return prev;
        const copy = [...prev];
        copy.splice(idx, 1);
        return copy;
      });
      setSbAvailableWords((prev) => [...prev, word]);
    }
  };

  const handleCheckSentenceBuilder = () => {
    setSbSubmitted(true);
    updateUser({ xp: 20 });
    logActivity({
      userId: 'user-001',
      activityType: 'challenge',
      title: 'Sentence Builder Puzzle',
      subtitle: sbPlacedWords.join(' '),
      timestamp: 'Just now',
      durationSeconds: 45,
      skill: 'grammar',
      score: 90,
      hasRecording: false,
      hasTranscript: true,
      hasFeedback: true,
      saved: false,
      correctionsCount: 0,
    });
  };

  const handleTranslateThought = () => {
    if (!userThought.trim()) return;
    setTranslatedVersions({
      simple: 'I have a meeting today with my manager to discuss the project.',
      natural: 'I am syncing with my manager today to talk over the project roadmap.',
      professional: 'I have a scheduled briefing with my manager today to review key project milestones.',
    });
    updateUser({ xp: 25 });
  };

  const gameButtons = [
    { id: 'word_assoc', label: 'Word Association' },
    { id: 'sentence_builder', label: 'Sentence Builder' },
    { id: 'error_detective', label: 'Error Detective' },
    { id: 'natural_or_not', label: 'Natural or Not?' },
    { id: 'formal_casual', label: 'Formal vs Casual' },
    { id: 'three_word', label: '3-Word Story' },
    { id: 'picture_desc', label: 'Picture Description' },
    { id: 'translate_thought', label: 'Translate My Thought' },
  ];

  return (
    <div className="space-y-6">
      {/* Games Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {gameButtons.map((g) => {
          const isActive = activeGame === g.id;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => setActiveGame(g.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all border ${
                isActive
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-card text-text-muted hover:text-text border-border hover:bg-surface'
              }`}
            >
              {g.label}
            </button>
          );
        })}
      </div>

      {/* 1. WORD ASSOCIATION GAME */}
      {activeGame === 'word_assoc' && (
        <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                Speed & Fluency Game
              </span>
              <h3 className="text-lg font-black text-text mt-0.5">Word Association Chain</h3>
              <p className="text-xs text-text-muted">
                Type or speak related English words without hesitating. Builds neural pathways for fast word retrieval!
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-surface border border-border text-text">
              Chain: <strong>{waWords.length}</strong> words
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 text-center space-y-2">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Seed Keyword:
            </span>
            <h2 className="text-3xl font-black text-primary tracking-wider">
              {WORD_ASSOCIATION_DATA[0].seedWord}
            </h2>
            <p className="text-xs text-text-muted">
              Produce related words ({WORD_ASSOCIATION_DATA[0].category})
            </p>
          </div>

          {/* Words chain chips */}
          <div className="flex flex-wrap gap-2 min-h-[48px] p-3 rounded-2xl bg-surface border border-border">
            {waWords.length === 0 ? (
              <span className="text-xs text-text-muted italic self-center">
                Start typing or speaking associated words (e.g. flight, hotel, ticket...)
              </span>
            ) : (
              waWords.map((w, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-card border border-primary/30 text-xs font-bold text-text flex items-center gap-1.5 animate-in zoom-in-90 duration-150"
                >
                  <span className="text-primary font-mono text-[10px]">#{idx + 1}</span>
                  <span>{w}</span>
                </span>
              ))
            )}
          </div>

          <form onSubmit={handleAddWaWord} className="flex items-center gap-2">
            <input
              type="text"
              value={waInput}
              onChange={(e) => setWaInput(e.target.value)}
              placeholder="Type an associated word..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-hover transition-all"
            >
              Add Word
            </button>
          </form>
        </div>
      )}

      {/* 2. SENTENCE BUILDER */}
      {activeGame === 'sentence_builder' && (
        <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-5">
          <div className="border-b border-border pb-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-primary">
              Grammar & Syntax Game
            </span>
            <h3 className="text-lg font-black text-text mt-0.5">Sentence Builder</h3>
            <p className="text-xs text-text-muted">
              Rearrange scrambled words into standard English word order, speak it aloud, and unlock the natural professional version.
            </p>
          </div>

          {/* Constructed Sentence Slot */}
          <div className="p-4 rounded-2xl bg-surface border border-dashed border-primary/40 min-h-[64px] flex items-center flex-wrap gap-2">
            {sbPlacedWords.length === 0 ? (
              <span className="text-xs text-text-muted italic">
                Click words below to assemble your sentence...
              </span>
            ) : (
              sbPlacedWords.map((w, idx) => (
                <button
                  key={idx}
                  onClick={() => handleWordClickBuilder(w, false)}
                  className="px-3.5 py-1.5 rounded-xl bg-card border border-primary text-xs font-bold text-primary shadow-2xs hover:bg-rose-500/10 hover:border-rose-500 hover:text-rose-500 transition-all"
                >
                  {w}
                </button>
              ))
            )}
          </div>

          {/* Available Word Chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            {sbAvailableWords.map((w, idx) => (
              <button
                key={idx}
                onClick={() => handleWordClickBuilder(w, true)}
                className="px-3.5 py-2 rounded-xl bg-card border border-border text-xs font-semibold text-text hover:border-primary/50 hover:bg-surface transition-all"
              >
                {w}
              </button>
            ))}
          </div>

          {!sbSubmitted ? (
            <button
              type="button"
              disabled={sbPlacedWords.length === 0}
              onClick={handleCheckSentenceBuilder}
              className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-hover disabled:opacity-50 transition-all"
            >
              Verify Sentence Order
            </button>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 size={15} />
                  <span>Correct! "{sbActiveItem.correctSentence}"</span>
                </span>
                <button
                  type="button"
                  onClick={() => speakText(sbActiveItem.correctSentence)}
                  className="text-emerald-600 dark:text-emerald-400 p-1"
                >
                  <Volume2 size={15} />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-card border border-border text-xs space-y-1">
                <span className="font-bold text-primary block">Make it even more natural:</span>
                <p className="text-text font-medium italic">"{sbActiveItem.moreNaturalAlternative}"</p>
                <p className="text-text-muted text-[11px] pt-1">{sbActiveItem.explanation}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. ERROR DETECTIVE */}
      {activeGame === 'error_detective' && (
        <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-5">
          <div className="border-b border-border pb-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-500">
              Grammar Accuracy Drill
            </span>
            <h3 className="text-lg font-black text-text mt-0.5">Error Detective</h3>
            <p className="text-xs text-text-muted">
              Spot the subtle grammatical mistake in the sentence and explain why it is wrong.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-surface border border-border text-center space-y-2">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              Sentence to inspect:
            </span>
            <h4 className="text-base sm:text-lg font-black text-text">
              "{activeEd.erroneousSentence}"
            </h4>
          </div>

          {!edFound ? (
            <div className="space-y-3">
              <span className="text-xs font-bold text-text block">Which part contains the error?</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {activeEd.erroneousSentence.split(' ').map((word, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (word.toLowerCase().includes(activeEd.incorrectWord.toLowerCase())) {
                        setEdFound(true);
                        updateUser({ xp: 20 });
                      } else {
                        alert(`"${word}" is grammatically valid here. Keep searching!`);
                      }
                    }}
                    className="p-3 rounded-xl bg-card border border-border hover:border-primary text-xs font-bold text-text hover:bg-surface transition-all"
                  >
                    "{word}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2 animate-in fade-in">
              <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 size={16} />
                <span>Found it! "{activeEd.incorrectWord}" → "{activeEd.correctWord}"</span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                {activeEd.explanation}
              </p>
              <div className="pt-2 text-xs">
                <span className="font-bold text-text">Full Polished Sentence: </span>
                <span className="font-bold text-primary">"{activeEd.fullCorrectSentence}"</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. NATURAL OR NOT? */}
      {activeGame === 'natural_or_not' && (
        <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-5">
          <div className="border-b border-border pb-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-500">
              Pragmatics & Idiomatic English
            </span>
            <h3 className="text-lg font-black text-text mt-0.5">Natural or Not?</h3>
            <p className="text-xs text-text-muted">
              Both options may convey meaning, but one sounds far more natural in international professional communication.
            </p>
          </div>

          <span className="text-xs font-bold text-text-muted uppercase tracking-wider block">
            Context: {activeNon.context}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div
              onClick={() => setNonSelected('A')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                nonSelected === 'A'
                  ? activeNon.optionA.isNatural
                    ? 'bg-emerald-500/10 border-emerald-500'
                    : 'bg-rose-500/10 border-rose-500'
                  : 'bg-surface border-border hover:border-primary/50'
              }`}
            >
              <span className="text-xs font-bold text-text-muted">Option A</span>
              <p className="text-sm font-bold text-text">"{activeNon.optionA.text}"</p>
              {nonSelected && (
                <p className="text-[11px] text-text-muted">{activeNon.optionA.nuance}</p>
              )}
            </div>

            <div
              onClick={() => setNonSelected('B')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                nonSelected === 'B'
                  ? activeNon.optionB.isNatural
                    ? 'bg-emerald-500/10 border-emerald-500'
                    : 'bg-rose-500/10 border-rose-500'
                  : 'bg-surface border-border hover:border-primary/50'
              }`}
            >
              <span className="text-xs font-bold text-text-muted">Option B</span>
              <p className="text-sm font-bold text-text">"{activeNon.optionB.text}"</p>
              {nonSelected && (
                <p className="text-[11px] text-text-muted">{activeNon.optionB.nuance}</p>
              )}
            </div>
          </div>

          {nonSelected && (
            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-xs text-text space-y-1 animate-in fade-in">
              <span className="font-bold text-primary block">Why this matters:</span>
              <p className="text-text-muted leading-relaxed">{activeNon.explanation}</p>
            </div>
          )}
        </div>
      )}

      {/* 5. FORMAL VS CASUAL */}
      {activeGame === 'formal_casual' && (
        <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-5">
          <div className="border-b border-border pb-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-primary">
              Register & Etiquette
            </span>
            <h3 className="text-lg font-black text-text mt-0.5">Formal vs. Casual Polish</h3>
            <p className="text-xs text-text-muted">
              Learn how to elevate casual phrasing into executive professional communication without sounding stiff.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-surface border border-border space-y-1.5">
              <span className="text-[10px] font-bold text-text-muted uppercase">Casual (Friends)</span>
              <p className="text-sm font-bold text-text">"{activeFvc.casualVersion}"</p>
            </div>

            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-1.5">
              <span className="text-[10px] font-bold text-primary uppercase">
                Professional ({activeFvc.targetAudience})
              </span>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-text">"{activeFvc.professionalVersion}"</p>
                <button
                  type="button"
                  onClick={() => speakText(activeFvc.professionalVersion)}
                  className="p-1 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                >
                  <Volume2 size={15} />
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface border border-border text-xs space-y-1">
            <span className="font-bold text-text block">Polite Speaking Strategy:</span>
            <p className="text-text-muted leading-relaxed">{activeFvc.tip}</p>
          </div>
        </div>
      )}

      {/* 6. TRANSLATE MY THOUGHT */}
      {activeGame === 'translate_thought' && (
        <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-5">
          <div className="border-b border-border pb-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-primary">
              Native Language Thought Bridging
            </span>
            <h3 className="text-lg font-black text-text mt-0.5">Translate My Thought</h3>
            <p className="text-xs text-text-muted">
              Express what you want to say in Telugu, Hindi, or simple English. The AI bridges your thinking into 3 polished English registers!
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-text">Your Thought (Telugu, Hindi, or Broken English):</label>
            <textarea
              rows={3}
              value={userThought}
              onChange={(e) => setUserThought(e.target.value)}
              placeholder="e.g. నేడు మేనేజర్‌తో ప్రాజెక్ట్ గురించి మాట్లాడాలి / आज मुझे मैनेजर से बात करनी है..."
              className="w-full p-3.5 rounded-2xl bg-surface border border-border text-xs text-text focus:outline-none focus:border-primary"
            />
          </div>

          <button
            type="button"
            onClick={handleTranslateThought}
            className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-hover shadow-xs transition-all"
          >
            Bridge to Polished English
          </button>

          {translatedVersions && (
            <div className="space-y-3 pt-2 animate-in fade-in duration-200">
              <div className="p-3.5 rounded-2xl bg-surface border border-border text-xs space-y-1">
                <span className="text-[10px] font-bold text-text-muted uppercase">1. Simple English</span>
                <p className="font-semibold text-text">"{translatedVersions.simple}"</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  2. Natural Conversational English
                </span>
                <p className="font-bold text-text">"{translatedVersions.natural}"</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-1">
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                  3. Executive Professional English
                </span>
                <p className="font-bold text-text">"{translatedVersions.professional}"</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 7. THREE-WORD STORY */}
      {activeGame === 'three_word' && (
        <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-5">
          <div className="border-b border-border pb-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-primary">
              Spontaneous Narrative
            </span>
            <h3 className="text-lg font-black text-text mt-0.5">Three-Word Story Challenge</h3>
            <p className="text-xs text-text-muted">
              Connect 3 unrelated words into a smooth 60-second spoken story.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            {THREE_WORD_STORIES[0].words.map((w, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-surface border border-border">
                <span className="text-base sm:text-lg font-black text-primary">{w}</span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-surface border border-border text-xs space-y-1">
            <span className="font-bold text-text block">Story Starter Suggestion:</span>
            <p className="text-text-muted italic">"{THREE_WORD_STORIES[0].suggestedStarter}"</p>
          </div>
        </div>
      )}

      {/* 8. PICTURE DESCRIPTION */}
      {activeGame === 'picture_desc' && (
        <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-5">
          <div className="border-b border-border pb-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-primary">
              Descriptive Fluency
            </span>
            <h3 className="text-lg font-black text-text mt-0.5">Picture Description Arena</h3>
            <p className="text-xs text-text-muted">
              Describe what you see using present continuous verbs, spatial prepositions, and vivid adjectives.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-primary/5 to-purple-500/10 border border-border text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center mx-auto text-primary">
              <ImageIcon size={24} />
            </div>
            <h4 className="text-base font-bold text-text">{PICTURE_DESCRIPTIONS[0].title}</h4>
            <p className="text-xs text-text-muted max-w-md mx-auto">
              "{PICTURE_DESCRIPTIONS[0].sceneDescription}"
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-text block">Recommended Descriptive Keywords:</span>
            <div className="flex flex-wrap gap-2">
              {PICTURE_DESCRIPTIONS[0].keywords.map((kw, idx) => (
                <span key={idx} className="px-3 py-1 rounded-xl bg-surface border border-border text-xs font-semibold text-text">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
