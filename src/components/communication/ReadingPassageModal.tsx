import React, { useState } from 'react';
import {
  BookOpen,
  Volume2,
  Mic,
  CheckCircle2,
  Sparkles,
  Bookmark,
  X,
  ArrowRight,
  HelpCircle,
  Lightbulb,
  Edit3,
} from 'lucide-react';
import { ReadingContentItem, VocabularyAnnotation } from '../../types/communication';
import { useCommunicationSkills } from '../../context/CommunicationSkillsContext';
import { useUser } from '../../context/UserContext';
import { useNavigation } from '../../context/NavigationContext';

interface ReadingPassageModalProps {
  item: ReadingContentItem | null;
  onClose: () => void;
}

export const ReadingPassageModal: React.FC<ReadingPassageModalProps> = ({ item, onClose }) => {
  const { playAudio, stopAudio, isPlaying, savePassageHighlight } = useCommunicationSkills();
  const { navigate } = useNavigation();

  const [activeTab, setActiveTab] = useState<'read' | 'read_aloud' | 'questions'>('read');
  const [selectedWord, setSelectedWord] = useState<VocabularyAnnotation | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<boolean>(false);
  const [isReadingAloud, setIsReadingAloud] = useState<boolean>(false);
  const [readAloudFeedback, setReadAloudFeedback] = useState<string | null>(null);
  const [customNote, setCustomNote] = useState<string>('');
  const [savedNoteSuccess, setSavedNoteSuccess] = useState<boolean>(false);

  if (!item) return null;

  const handlePlayNarration = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      playAudio(item.passage, 'female', item.id);
    }
  };

  const handleSimulateReadAloud = () => {
    setIsReadingAloud(true);
    setTimeout(() => {
      setIsReadingAloud(false);
      setReadAloudFeedback(
        'Speech Analyzed: Excellent pronunciation of key terminology ("adaptability", "protocols"). Your reading pace was 118 WPM (Target: 120 WPM) with natural sentence boundary pausing.'
      );
    }, 2800);
  };

  const handleSaveNote = () => {
    if (!customNote.trim()) return;
    savePassageHighlight(item.id, item.title, customNote);
    setSavedNoteSuccess(true);
    setTimeout(() => setSavedNoteSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-border flex items-start justify-between gap-4 bg-surface/50">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">
                Reading Studio
              </span>
              <span className="px-2 py-0.5 rounded-md bg-card border border-border text-[10px] font-bold text-text-muted">
                CEFR {item.cefrLevel}
              </span>
              <span className="text-[10px] text-text-muted font-medium">
                {item.estimatedMinutes} min read • {item.wordCount} words
              </span>
            </div>
            <h2 className="text-xl font-black text-text">{item.title}</h2>
            <p className="text-xs text-text-muted">{item.topic}</p>
          </div>

          <button
            type="button"
            onClick={() => {
              stopAudio();
              onClose();
            }}
            className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface transition-colors"
            aria-label="Close studio"
          >
            <X size={18} />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="px-5 py-3 bg-card border-b border-border flex flex-wrap items-center justify-between gap-3 text-xs">
          <button
            type="button"
            onClick={handlePlayNarration}
            className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
              isPlaying
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-primary/10 text-primary hover:bg-primary/20'
            }`}
          >
            <Volume2 size={15} />
            <span>{isPlaying ? 'Pause Narration' : 'Read + Listen Multimodal'}</span>
          </button>

          <span className="text-[11px] text-text-muted italic">
            Tip: Click highlighted words to inspect definitions & examples
          </span>
        </div>

        {/* Sub-tabs navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-border bg-surface/30 overflow-x-auto no-scrollbar">
          {[
            { id: 'read', label: 'Interactive Passage' },
            { id: 'read_aloud', label: 'Read Aloud Speech Studio' },
            { id: 'questions', label: `Comprehension Questions (${item.questions.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-2 text-xs font-bold transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-muted hover:text-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-6">
          {/* TAB 1: INTERACTIVE PASSAGE */}
          {activeTab === 'read' && (
            <div className="space-y-6">
              {/* Reading Strategies Banner */}
              <div className="p-3.5 rounded-2xl bg-surface border border-border flex items-center gap-3">
                <Lightbulb size={18} className="text-amber-500 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-text block">Recommended Reading Strategies:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {item.readingStrategies.map((st, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-card border border-border text-[10px] text-text-muted font-medium">
                        {st}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Passage text with interactive vocabulary buttons */}
              <div className="p-5 sm:p-6 rounded-3xl bg-surface border border-border text-sm leading-relaxed text-text font-normal space-y-4 whitespace-pre-line font-serif">
                {item.passage}
              </div>

              {/* Annotated Vocabulary Bank */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-text uppercase tracking-wider">
                  Interactive Key Vocabulary (Click to Inspect)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {item.vocabularyAnnotations.map((anno) => (
                    <button
                      key={anno.word}
                      type="button"
                      onClick={() => setSelectedWord(anno)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                        selectedWord?.word === anno.word
                          ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                          : 'bg-card border-border text-text hover:border-primary/40'
                      }`}
                    >
                      <Sparkles size={12} className={selectedWord?.word === anno.word ? 'text-white' : 'text-primary'} />
                      <span>{anno.word}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Word Popover / Inspector */}
              {selectedWord && (
                <div className="p-4 sm:p-5 rounded-2xl bg-card border border-primary/30 shadow-md space-y-3 animate-fade-in">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-black text-text capitalize">{selectedWord.word}</h4>
                        <span className="text-[10px] font-mono text-primary font-bold">
                          {selectedWord.partOfSpeech}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted mt-0.5">{selectedWord.simpleExplanation}</p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => playAudio(selectedWord.word, 'female', `word-${selectedWord.word}`)}
                        className="p-1.5 rounded-lg bg-surface text-text-muted hover:text-primary transition-colors"
                        title="Pronounce word"
                      >
                        <Volume2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-surface border border-border text-xs space-y-1">
                    <span className="text-[10px] font-bold text-text-muted uppercase block">Example in Context:</span>
                    <p className="text-text italic font-medium">"{selectedWord.exampleSentence}"</p>
                  </div>

                  {selectedWord.synonyms.length > 0 && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-text-muted font-semibold">Synonyms:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedWord.synonyms.map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded bg-surface text-[10px] font-medium text-text">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Note Taking Box */}
              <div className="p-4 rounded-2xl bg-surface border border-border space-y-2">
                <span className="text-xs font-bold text-text block">Personal Study Notes & Highlights:</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Jot down a reflection or key phrase from this passage..."
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-card border border-border text-xs text-text focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={handleSaveNote}
                    className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover transition-colors shrink-0"
                  >
                    Save Note
                  </button>
                </div>
                {savedNoteSuccess && (
                  <span className="text-[11px] text-emerald-500 font-bold block">âœ“ Note saved to portfolio!</span>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: READ ALOUD SPEECH STUDIO */}
          {activeTab === 'read_aloud' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-surface border border-border">
                <h3 className="text-xs font-bold text-text uppercase tracking-wider mb-1">
                  Oral Reading Aloud & Intonation Studio
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Reading passages aloud bridges reading comprehension into spoken vocal fluency. Tap record and read the paragraph at a steady, natural pace.
                </p>
              </div>

              {item.readAloudPrompt && (
                <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-text">Target Paragraph:</span>
                    <span className="text-[11px] font-mono text-primary font-bold">
                      Goal: {item.readAloudPrompt.fluencyGoalWPM} WPM
                    </span>
                  </div>

                  <p className="text-sm font-medium text-text leading-relaxed p-4 rounded-xl bg-surface border border-border/80 font-serif">
                    "{item.readAloudPrompt.targetParagraph}"
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      disabled={isReadingAloud}
                      onClick={handleSimulateReadAloud}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                        isReadingAloud
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-primary text-primary-foreground hover:bg-primary-hover shadow-md shadow-primary/20'
                      }`}
                    >
                      <Mic size={15} />
                      <span>{isReadingAloud ? 'Recording your speech...' : 'Record & Analyze Speech'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => playAudio(item.readAloudPrompt!.targetParagraph, 'female', 'read-aloud-demo')}
                      className="px-3 py-1.5 rounded-xl bg-surface border border-border text-xs font-bold text-text-muted hover:text-text"
                    >
                      Hear Native Cadence
                    </button>
                  </div>

                  {readAloudFeedback && (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 font-medium leading-relaxed">
                      {readAloudFeedback}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: COMPREHENSION QUESTIONS */}
          {activeTab === 'questions' && (
            <div className="space-y-5">
              {item.questions.map((q, idx) => (
                <div key={q.id} className="p-5 rounded-2xl bg-surface border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                      Question {idx + 1}
                    </span>
                    <span className="text-[10px] font-bold text-primary capitalize">{q.type.replace('_', ' ')}</span>
                  </div>

                  <h3 className="text-sm font-bold text-text">{q.question}</h3>

                  <div className="space-y-2">
                    {q.options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                        className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                          selectedAnswers[q.id] === opt
                            ? 'bg-primary/10 border-primary text-primary font-bold'
                            : 'bg-card border-border text-text hover:bg-surface'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {submittedAnswers && (
                    <div className="p-3.5 rounded-xl bg-card border border-primary/20 space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                        <CheckCircle2 size={14} />
                        <span>Passage Evidence:</span>
                      </div>
                      <p className="text-text font-medium italic">"{q.passageEvidenceQuote}"</p>
                      <p className="text-[11px] text-text-muted mt-1">{q.explanation}</p>
                    </div>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => setSubmittedAnswers(true)}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md shadow-primary/25 hover:bg-primary-hover transition-colors"
              >
                Submit Answers & Review Evidence Quotes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
