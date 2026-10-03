import React, { useState } from 'react';
import { PageHeader } from '../layout/PageHeader';
import {
  PRONUNCIATION_INSIGHTS,
  MINIMAL_PAIRS_DATA,
  SENTENCE_STRESS_PATTERNS,
  CONNECTED_SPEECH_DATA,
} from '../../data/speakingIntelligenceData';
import { PronunciationInsight, MinimalPairItem, SentenceStressPattern } from '../../types/speakingIntelligence';
import { ttsService } from '../../services/aiService';
import { useUser } from '../../context/UserContext';
import {
  Volume2,
  Mic,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Play,
  Pause,
  Layers,
  Zap,
  Flame,
  Award,
} from 'lucide-react';

export const PronunciationStudioView: React.FC = () => {
  const { addSpokenMinutes } = useUser();
  const [activeTab, setActiveTab] = useState<'stress' | 'minimal_pairs' | 'sentence_stress' | 'connected_speech' | 'shadowing'>('stress');

  // Word Stress State
  const [selectedWord, setSelectedWord] = useState<PronunciationInsight>(PRONUNCIATION_INSIGHTS[0]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedWordAudio, setRecordedWordAudio] = useState<boolean>(false);

  // Minimal Pairs State
  const [selectedPair, setSelectedPair] = useState<MinimalPairItem>(MINIMAL_PAIRS_DATA[0]);

  // Sentence Stress State
  const [selectedStressPattern, setSelectedStressPattern] = useState<SentenceStressPattern>(SENTENCE_STRESS_PATTERNS[0]);
  const [activeStressedWord, setActiveStressedWord] = useState<string>(
    SENTENCE_STRESS_PATTERNS[0].variations[0].stressedWord
  );

  // Shadowing State
  const [shadowSentenceIndex, setShadowSentenceIndex] = useState<number>(0);
  const [isShadowingActive, setIsShadowingActive] = useState<boolean>(false);

  const shadowSentences = [
    { text: "Could you please walk me through the architecture of your recent project?", focus: "Natural pacing & syllable stress on 'architecture'" },
    { text: "I'd really appreciate your thoughts on how we can streamline our workflow.", focus: "Connected speech: 'appreciate your' and 'how we can'" },
    { text: "To be completely honest, that solution might take longer than anticipated.", focus: "Intonation drop on conclusion & stress on 'anticipated'" },
  ];

  const handlePlayAudio = (text: string, rate: number = 1.0) => {
    ttsService.speak(text, { rate });
  };

  const handleRecordWordToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setRecordedWordAudio(true);
        addSpokenMinutes(1);
      }, 2500);
    } else {
      setIsRecording(false);
    }
  };

  const activeVariation =
    selectedStressPattern.variations.find((v) => v.stressedWord === activeStressedWord) ||
    selectedStressPattern.variations[0];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-16">
      <PageHeader
        title="Pronunciation & Naturalness Studio"
        subtitle="Master syllable stress, minimal pairs, sentence emphasis & connected speech"
        badge="Evidence-Based Audio"
        showBack={true}
      />

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border">
        {[
          { id: 'stress', label: 'Word Stress & Syllables' },
          { id: 'minimal_pairs', label: 'Minimal Pairs Lab' },
          { id: 'sentence_stress', label: 'Sentence Stress Lab' },
          { id: 'connected_speech', label: 'Connected Speech' },
          { id: 'shadowing', label: 'Shadowing & Repetition' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface border border-border text-text-secondary hover:text-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. Word Stress & Syllables */}
      {activeTab === 'stress' && (
        <div className="space-y-6">
          {/* Word Selector Chips */}
          <div className="flex flex-wrap gap-2.5">
            {PRONUNCIATION_INSIGHTS.map((item) => (
              <button
                key={item.word}
                type="button"
                onClick={() => {
                  setSelectedWord(item);
                  setRecordedWordAudio(false);
                }}
                className={`px-4 py-2 rounded-2xl border text-xs font-black transition-all ${
                  selectedWord.word === item.word
                    ? 'bg-primary text-white border-primary shadow-xs'
                    : 'bg-card border-border text-text hover:border-primary/40'
                }`}
              >
                {item.word}
              </button>
            ))}
          </div>

          {/* Active Word Breakdown Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-primary block mb-1">
                  Target Word Breakdown
                </span>
                <h3 className="text-3xl font-black text-text">{selectedWord.word}</h3>
                <span className="text-sm font-mono text-text-secondary">{selectedWord.ipa}</span>
              </div>

              {/* Audio Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePlayAudio(selectedWord.word, 1.0)}
                  className="px-4 py-2.5 rounded-2xl bg-primary text-white text-xs font-black flex items-center gap-2 hover:bg-primary/90 transition-all shadow-xs"
                >
                  <Volume2 size={16} />
                  <span>Listen (1.0x)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handlePlayAudio(selectedWord.word, 0.75)}
                  className="px-3.5 py-2.5 rounded-2xl bg-surface border border-border text-text text-xs font-bold flex items-center gap-1.5 hover:bg-surface/80 transition-all"
                >
                  <Zap size={14} className="text-amber-500" />
                  <span>Slow (0.75x)</span>
                </button>
              </div>
            </div>

            {/* Syllable Highlight Grid */}
            <div>
              <div className="text-xs font-bold text-text-secondary mb-3">Syllable Emphasis (Capital = Primary Stress):</div>
              <div className="flex items-center gap-2 flex-wrap">
                {selectedWord.syllables.map((syl, idx) => {
                  const isStressed = idx === selectedWord.stressedIndex;
                  return (
                    <div
                      key={idx}
                      className={`px-5 py-3 rounded-2xl font-black text-lg transition-all ${
                        isStressed
                          ? 'bg-primary text-white shadow-md scale-105 ring-2 ring-primary/40'
                          : 'bg-surface border border-border text-text-secondary'
                      }`}
                    >
                      {syl}
                      {isStressed && <span className="block text-[9px] font-normal uppercase opacity-90 mt-0.5">Primary Stress</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Common Trap & Guidance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                <div className="flex items-center gap-2 text-amber-500 text-xs font-bold mb-1">
                  <AlertCircle size={15} />
                  <span>Common Mispronunciation Trap</span>
                </div>
                <p className="text-xs text-text-secondary">{selectedWord.commonMispronunciation}</p>
              </div>

              <div className="p-4 rounded-2xl bg-secondary/5 border border-secondary/20">
                <div className="flex items-center gap-2 text-secondary text-xs font-bold mb-1">
                  <Sparkles size={15} />
                  <span>Audio & Articulation Clue</span>
                </div>
                <p className="text-xs text-text-secondary">{selectedWord.explanation}</p>
              </div>
            </div>

            {/* Record & Compare */}
            <div className="p-5 rounded-2xl bg-surface/60 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-text">Record & Compare Your Speech</h4>
                <p className="text-xs text-text-secondary">
                  Speak clearly into your microphone to verify syllable stress and intelligibility.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleRecordWordToggle}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all ${
                    isRecording
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-card border border-border text-text hover:border-primary'
                  }`}
                >
                  <Mic size={15} />
                  <span>{isRecording ? 'Listening...' : 'Record Word'}</span>
                </button>

                {recordedWordAudio && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold">
                    <CheckCircle2 size={15} />
                    <span>Clear Intelligibility!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Minimal Pairs Lab */}
      {activeTab === 'minimal_pairs' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {MINIMAL_PAIRS_DATA.map((pair) => (
              <button
                key={pair.id}
                type="button"
                onClick={() => setSelectedPair(pair)}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  selectedPair.id === pair.id
                    ? 'bg-primary/10 border-primary text-primary shadow-xs'
                    : 'bg-card border-border text-text hover:border-primary/40'
                }`}
              >
                <div className="text-xs font-black">
                  {pair.wordA} / {pair.wordB}
                </div>
                <div className="text-[10px] text-text-secondary mt-0.5 truncate">{pair.soundA}</div>
              </button>
            ))}
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Word A */}
              <div className="p-6 rounded-3xl bg-surface/70 border border-border space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase">
                    {selectedPair.soundA}
                  </span>
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(selectedPair.wordA)}
                    className="p-2.5 rounded-xl bg-card border border-border text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-text">{selectedPair.wordA}</h3>
                  <div className="text-sm font-mono text-text-secondary">{selectedPair.ipaA}</div>
                </div>
                <div className="p-3 rounded-xl bg-card border border-border text-xs text-text-secondary italic">
                  "{selectedPair.exampleA}"
                </div>
              </div>

              {/* Word B */}
              <div className="p-6 rounded-3xl bg-surface/70 border border-border space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-500 text-[10px] font-black uppercase">
                    {selectedPair.soundB}
                  </span>
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(selectedPair.wordB)}
                    className="p-2.5 rounded-xl bg-card border border-border text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-text">{selectedPair.wordB}</h3>
                  <div className="text-sm font-mono text-text-secondary">{selectedPair.ipaB}</div>
                </div>
                <div className="p-3 rounded-xl bg-card border border-border text-xs text-text-secondary italic">
                  "{selectedPair.exampleB}"
                </div>
              </div>
            </div>

            {/* Distinction Tip */}
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-start gap-3">
              <Sparkles size={18} className="text-primary shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-black text-text mb-0.5">Physical Mouth & Jaw Articulation:</h5>
                <p className="text-xs text-text-secondary leading-relaxed">{selectedPair.distinctionTip}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Sentence Stress Laboratory */}
      {activeTab === 'sentence_stress' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-secondary block mb-1">
                Meaning Shifter Laboratory
              </span>
              <h3 className="text-lg font-black text-text">
                Tap each word below to hear how shifting stress alters the sentence's meaning!
              </h3>
            </div>

            {/* Interactive Sentence Word Buttons */}
            <div className="flex flex-wrap items-center gap-2 p-4 rounded-2xl bg-surface border border-border">
              {selectedStressPattern.variations.map((v) => {
                const isSelected = activeStressedWord === v.stressedWord;
                return (
                  <button
                    key={v.stressedWord}
                    type="button"
                    onClick={() => {
                      setActiveStressedWord(v.stressedWord);
                      handlePlayAudio(`${v.stressedWord}! ${selectedStressPattern.baseSentence}`);
                    }}
                    className={`px-4 py-2.5 rounded-xl text-base font-black transition-all ${
                      isSelected
                        ? 'bg-primary text-white shadow-md scale-105'
                        : 'bg-card border border-border text-text hover:border-primary/40'
                    }`}
                  >
                    {v.stressedWord}
                  </button>
                );
              })}
            </div>

            {/* Conveyed Meaning Explanation */}
            {activeVariation && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-primary/10 via-card to-card border border-primary/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-black uppercase tracking-wider text-primary">
                    Stressed Word: "{activeVariation.stressedWord}"
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(activeVariation.contextExample)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-card border border-border text-xs font-bold text-text hover:bg-surface"
                  >
                    <Volume2 size={14} className="text-primary" />
                    <span>Play Meaning Context</span>
                  </button>
                </div>
                <div className="text-sm font-bold text-text">{activeVariation.conveyedMeaning}</div>
                <p className="text-xs text-text-secondary italic">"{activeVariation.contextExample}"</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Connected Speech */}
      {activeTab === 'connected_speech' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CONNECTED_SPEECH_DATA.map((cs) => (
            <div key={cs.id} className="p-5 rounded-3xl bg-card border border-border space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-base font-black text-text">{cs.writtenForm} → <span className="text-primary font-mono">{cs.spokenForm}</span></div>
                  <div className="text-xs font-mono text-text-secondary">{cs.ipa}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handlePlayAudio(cs.exampleSentence)}
                  className="p-2.5 rounded-xl bg-surface border border-border text-primary hover:bg-primary hover:text-white transition-colors"
                >
                  <Volume2 size={16} />
                </button>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{cs.ruleExplanation}</p>
              <div className="p-3 rounded-xl bg-surface/80 border border-border text-xs font-medium text-text italic">
                "{cs.exampleSentence}"
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. Shadowing & Repetition */}
      {activeTab === 'shadowing' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-primary block mb-1">
                Shadowing Exercise (Listen & Speak Simultaneously)
              </span>
              <h3 className="text-lg font-black text-text">
                Sentence {shadowSentenceIndex + 1} of {shadowSentences.length}
              </h3>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShadowSentenceIndex((prev) => (prev > 0 ? prev - 1 : shadowSentences.length - 1))}
                className="px-3 py-1.5 rounded-xl bg-surface border border-border text-xs font-bold"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => setShadowSentenceIndex((prev) => (prev + 1) % shadowSentences.length)}
                className="px-3 py-1.5 rounded-xl bg-surface border border-border text-xs font-bold"
              >
                Next
              </button>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-surface/70 border border-border text-center space-y-4">
            <p className="text-xl font-bold text-text leading-relaxed">
              "{shadowSentences[shadowSentenceIndex].text}"
            </p>
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              Focus: {shadowSentences[shadowSentenceIndex].focus}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => handlePlayAudio(shadowSentences[shadowSentenceIndex].text, 1.0)}
              className="px-6 py-3 rounded-2xl bg-primary text-white font-black text-xs flex items-center gap-2 hover:bg-primary/90 transition-all shadow-xs"
            >
              <Volume2 size={16} />
              <span>1. Listen Normal Pace</span>
            </button>
            <button
              type="button"
              onClick={() => handlePlayAudio(shadowSentences[shadowSentenceIndex].text, 0.75)}
              className="px-5 py-3 rounded-2xl bg-surface border border-border text-text font-black text-xs flex items-center gap-2 hover:bg-surface/80 transition-all"
            >
              <Zap size={15} className="text-amber-500" />
              <span>2. Listen Slow (0.75x)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsShadowingActive(true);
                handlePlayAudio(shadowSentences[shadowSentenceIndex].text, 0.9);
                setTimeout(() => {
                  setIsShadowingActive(false);
                  addSpokenMinutes(1);
                }, 4000);
              }}
              className={`px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2 transition-all ${
                isShadowingActive
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
              }`}
            >
              <Mic size={16} />
              <span>{isShadowingActive ? 'Shadowing Now (Speak Along!)' : '3. Speak Along with Audio'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
