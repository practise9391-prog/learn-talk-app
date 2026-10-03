import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  BookOpen,
  Mic,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
  ArrowRight,
  Eye,
  EyeOff,
  Sliders,
  Bookmark,
} from 'lucide-react';
import { ListeningContentItem, ListeningSpeed, TranscriptMode } from '../../types/communication';
import { useCommunicationSkills } from '../../context/CommunicationSkillsContext';
import { useNavigation } from '../../context/NavigationContext';

interface ListeningSessionModalProps {
  item: ListeningContentItem | null;
  onClose: () => void;
}

export const ListeningSessionModal: React.FC<ListeningSessionModalProps> = ({ item, onClose }) => {
  const {
    playAudio,
    stopAudio,
    isPlaying,
    currentPlayingId,
    playbackSpeed,
    setPlaybackSpeed,
    transcriptMode,
    setTranscriptMode,
    submitDictation,
    saveListeningPhrase,
  } = useCommunicationSkills();

  const { navigate } = useNavigation();

  // Tab inside modal
  const [activeTab, setActiveTab] = useState<'listen' | 'dictation' | 'questions' | 'connected_speech'>('listen');

  // Dictation state
  const [dictationAnswers, setDictationAnswers] = useState<Record<string, string>>({});
  const [dictationResults, setDictationResults] = useState<Record<string, any>>({});

  // Question state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<boolean>(false);

  // Cross-skill voice feedback state
  const [isRecordingSummary, setIsRecordingSummary] = useState<boolean>(false);
  const [spokenSummaryFeedback, setSpokenSummaryFeedback] = useState<string | null>(null);

  if (!item) return null;

  const fullAudioScript = item.transcript.map((t) => `${t.speakerName}: ${t.text}`).join(' ');

  const handlePlayFull = () => {
    if (isPlaying && currentPlayingId === item.id) {
      stopAudio();
    } else {
      playAudio(fullAudioScript, item.speakers[0]?.voiceGender || 'female', item.id);
    }
  };

  const handlePlayTurn = (turnId: string, text: string, gender: 'male' | 'female' = 'female') => {
    if (isPlaying && currentPlayingId === turnId) {
      stopAudio();
    } else {
      playAudio(text, gender, turnId);
    }
  };

  const handleCheckDictation = (dictId: string) => {
    const text = dictationAnswers[dictId] || '';
    if (!text.trim()) return;
    const res = submitDictation(item.id, dictId, text);
    setDictationResults((prev) => ({ ...prev, [dictId]: res }));
  };

  const handleSimulateVoiceSummary = () => {
    setIsRecordingSummary(true);
    setTimeout(() => {
      setIsRecordingSummary(false);
      setSpokenSummaryFeedback(
        'Speech Analyzed: Great verbal synthesis! You accurately captured the database migration problem and the 2:30 PM meeting time with clear intonation (Pace: 122 WPM, Accuracy: 94%).'
      );
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-border flex items-start justify-between gap-4 bg-surface/50">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">
                Listening Studio
              </span>
              <span className="px-2 py-0.5 rounded-md bg-card border border-border text-[10px] font-bold text-text-muted">
                CEFR {item.cefrLevel}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-card border border-border text-[10px] font-semibold text-text-muted capitalize">
                Context: {item.contextPlace}
              </span>
            </div>
            <h2 className="text-xl font-black text-text">{item.title}</h2>
            <p className="text-xs text-text-muted">{item.subtitle}</p>
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

        {/* Audio Controller Bar */}
        <div className="px-5 py-3.5 bg-card border-b border-border flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Main Play / Stop Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePlayFull}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
                isPlaying && currentPlayingId === item.id
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary-hover'
              }`}
            >
              {isPlaying && currentPlayingId === item.id ? (
                <>
                  <Pause size={15} />
                  <span>Pause Audio</span>
                </>
              ) : (
                <>
                  <Play size={15} fill="currentColor" />
                  <span>Listen to Full Conversation</span>
                </>
              )}
            </button>

            {isPlaying && (
              <div className="flex items-center gap-1 text-[11px] text-primary font-bold animate-pulse px-2">
                <Volume2 size={15} />
                <span>Playing at {playbackSpeed}...</span>
              </div>
            )}
          </div>

          {/* Speed & Transcript Mode Selectors */}
          <div className="flex items-center gap-2">
            {/* Speed Control */}
            <div className="flex items-center bg-surface p-1 rounded-xl border border-border text-[11px]">
              {(['0.75x', '1x', '1.25x', '1.5x'] as ListeningSpeed[]).map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                    playbackSpeed === spd
                      ? 'bg-primary text-white shadow-2xs'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  {spd}
                </button>
              ))}
            </div>

            {/* Transcript Mode */}
            <div className="flex items-center bg-surface p-1 rounded-xl border border-border text-[11px]">
              <button
                type="button"
                onClick={() => setTranscriptMode(transcriptMode === 'off' ? 'on' : 'off')}
                className={`px-2.5 py-0.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                  transcriptMode === 'off'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    : 'bg-card text-text'
                }`}
                title="Toggle transcript visibility to test pure listening comprehension"
              >
                {transcriptMode === 'off' ? (
                  <>
                    <EyeOff size={13} />
                    <span>Transcript Hidden</span>
                  </>
                ) : (
                  <>
                    <Eye size={13} />
                    <span>Transcript Visible</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Sub-tabs navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-border bg-surface/30 overflow-x-auto no-scrollbar">
          {[
            { id: 'listen', label: 'Conversation Stream' },
            { id: 'dictation', label: `Dictation (${item.dictationItems?.length || 0})` },
            { id: 'questions', label: `Comprehension (${item.questions.length})` },
            { id: 'connected_speech', label: 'Connected Speech & Phonetics' },
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

        {/* Modal Body */}
        <div className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-6">
          {/* TAB 1: CONVERSATION STREAM */}
          {activeTab === 'listen' && (
            <div className="space-y-4">
              {transcriptMode === 'off' ? (
                <div className="p-8 rounded-2xl bg-surface border border-border text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mx-auto">
                    <EyeOff size={24} />
                  </div>
                  <h3 className="text-sm font-bold text-text">Pure Listening Mode Active</h3>
                  <p className="text-xs text-text-muted max-w-md mx-auto leading-relaxed">
                    The transcript is hidden so your brain focuses purely on phonetic comprehension and audio decoding. Listen 1–2 times, then reveal the transcript to verify your understanding.
                  </p>
                  <button
                    type="button"
                    onClick={() => setTranscriptMode('on')}
                    className="px-4 py-2 rounded-xl bg-card border border-border text-xs font-bold text-primary hover:border-primary/40 transition-colors"
                  >
                    Reveal Transcript
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {item.transcript.map((turn) => {
                    const isTurnPlaying = isPlaying && currentPlayingId === turn.id;
                    const speakerGender = item.speakers.find((s) => s.id === turn.speakerId)?.voiceGender || 'female';

                    return (
                      <div
                        key={turn.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          isTurnPlaying
                            ? 'bg-primary/5 border-primary/40 shadow-xs'
                            : 'bg-surface/50 border-border/80'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-primary">{turn.speakerName}</span>
                            <span className="text-[10px] font-mono text-text-muted">{turn.timestamp}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handlePlayTurn(turn.id, turn.text, speakerGender)}
                              className="p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-card transition-colors"
                              title="Listen to this line"
                            >
                              <Volume2 size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => saveListeningPhrase(turn.text, turn.text, item.title)}
                              className="p-1.5 rounded-lg text-text-muted hover:text-amber-500 hover:bg-card transition-colors"
                              title="Save line to saved phrases"
                            >
                              <Bookmark size={14} />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-text font-medium leading-relaxed">
                          {turn.text}
                        </p>

                        {turn.translation && (
                          <p className="text-[11px] text-text-muted italic mt-1 pt-1 border-t border-border/40">
                            {turn.translation}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Cross-Skill Follow-Up */}
              {item.followUpCrossSkill && (
                <div className="p-4 sm:p-5 rounded-2xl bg-card border border-primary/20 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-primary" />
                    <span className="text-xs font-black uppercase tracking-wider text-text">
                      Cross-Skill Transfer: Listen â†’ Speak
                    </span>
                  </div>
                  <p className="text-xs text-text-muted">{item.followUpCrossSkill.prompt}</p>

                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="button"
                      disabled={isRecordingSummary}
                      onClick={handleSimulateVoiceSummary}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                        isRecordingSummary
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-primary text-primary-foreground hover:bg-primary-hover shadow-md shadow-primary/20'
                      }`}
                    >
                      <Mic size={14} />
                      <span>{isRecordingSummary ? 'Listening to your summary...' : 'Record Spoken Summary'}</span>
                    </button>
                  </div>

                  {spokenSummaryFeedback && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                      {spokenSummaryFeedback}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DICTATION */}
          {activeTab === 'dictation' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-surface border border-border">
                <h3 className="text-xs font-bold text-text uppercase tracking-wider mb-1">
                  Active Ear-to-Text Transcription
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Listen to the audio snippet and type what you hear. Dictation converts auditory sound waves into structured orthography and grammatical memory.
                </p>
              </div>

              {item.dictationItems?.map((dict) => {
                const result = dictationResults[dict.id];
                return (
                  <div key={dict.id} className="p-4 sm:p-5 rounded-2xl bg-card border border-border space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-text">{dict.grammarFocus}</span>
                      <button
                        type="button"
                        onClick={() => playAudio(dict.audioSnippetText, 'female', dict.id)}
                        className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary font-bold text-xs hover:bg-primary/20 transition-colors flex items-center gap-1.5"
                      >
                        <Volume2 size={14} />
                        <span>Play Audio Clip</span>
                      </button>
                    </div>

                    <p className="text-xs text-text-muted italic">{dict.hint}</p>

                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Type what you hear..."
                        value={dictationAnswers[dict.id] || ''}
                        onChange={(e) =>
                          setDictationAnswers((prev) => ({ ...prev, [dict.id]: e.target.value }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none focus:border-primary"
                      />

                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={() => handleCheckDictation(dict.id)}
                          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:bg-primary-hover transition-colors"
                        >
                          Check Dictation
                        </button>
                      </div>
                    </div>

                    {result && (
                      <div className="p-3.5 rounded-xl bg-surface border border-border space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-text">Transcription Score:</span>
                          <span className="font-mono font-black text-primary">{result.accuracy}% Accuracy</span>
                        </div>

                        <div className="p-2.5 rounded-lg bg-card border border-border font-mono text-xs">
                          Original: <strong className="text-text font-bold">{dict.targetSentence}</strong>
                        </div>

                        <p className="text-[11px] text-text-muted">{result.feedback}</p>
                      </div>
                    )}
                  </div>
                );
              })}
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

                  {q.type === 'mcq' && q.options && (
                    <div className="space-y-2">
                      {q.options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setSelectedAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                          className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                            selectedAnswers[q.id] === opt
                              ? 'bg-primary/10 border-primary text-primary'
                              : 'bg-card border-border text-text hover:bg-surface'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {q.type === 'open_ended' && (
                    <input
                      type="text"
                      placeholder="Type your answer in English..."
                      value={selectedAnswers[q.id] || ''}
                      onChange={(e) => setSelectedAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-border text-xs text-text focus:outline-none focus:border-primary"
                    />
                  )}

                  {submittedQuestions && (
                    <div className="p-3.5 rounded-xl bg-card border border-primary/20 space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                        <CheckCircle2 size={14} />
                        <span>Evidence Quote:</span>
                      </div>
                      <p className="text-text font-medium italic">"{q.evidenceQuote}"</p>
                      <p className="text-[11px] text-text-muted mt-1">{q.explanation}</p>
                    </div>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => setSubmittedQuestions(true)}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md shadow-primary/25 hover:bg-primary-hover transition-colors"
              >
                Submit Answers & Check Evidence
              </button>
            </div>
          )}

          {/* TAB 4: CONNECTED SPEECH & MINIMAL PAIRS */}
          {activeTab === 'connected_speech' && (
            <div className="space-y-5">
              {/* Minimal Pairs */}
              {item.minimalPairs && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-text uppercase tracking-wider">
                    Minimal Pair Sound Contrasts
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {item.minimalPairs.map((mp) => (
                      <div key={mp.id} className="p-4 rounded-2xl bg-surface border border-border space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-text">
                            {mp.wordA} vs {mp.wordB}
                          </span>
                          <button
                            type="button"
                            onClick={() => playAudio(mp.audioSnippetText, 'female', mp.id)}
                            className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          >
                            <Volume2 size={14} />
                          </button>
                        </div>
                        <span className="text-[11px] font-mono text-primary font-bold block">{mp.phonemeContrast}</span>
                        <p className="text-xs text-text-muted">{mp.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Connected Speech Tips */}
              {item.connectedSpeechTips && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-text uppercase tracking-wider">
                    Connected Speech & Reductions
                  </h3>
                  <div className="space-y-2.5">
                    {item.connectedSpeechTips.map((cs) => (
                      <div key={cs.id} className="p-4 rounded-2xl bg-card border border-border space-y-1.5 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-black text-amber-500">{cs.casualForm}</span>
                          <span className="text-text-muted">â†’</span>
                          <span className="font-mono font-bold text-text">{cs.formalForm}</span>
                          <span className="px-2 py-0.5 rounded bg-surface border border-border text-[9px] font-bold text-text-muted uppercase ml-auto">
                            {cs.ruleType}
                          </span>
                        </div>
                        <p className="text-text-muted">{cs.explanation}</p>
                        <p className="text-[10px] text-text-muted italic">{cs.contextUsage}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
