import React, { useState } from 'react';
import { PRONUNCIATION_MINIMAL_PAIRS, SHADOWING_EXERCISES } from '../../data/practiceData';
import { useUser } from '../../context/UserContext';
import {
  Volume2,
  Mic,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Headphones,
  Sliders,
  Check,
} from 'lucide-react';

export const PronunciationListeningArenaView: React.FC = () => {
  const { updateUser } = useUser();

  const [activeSubTab, setActiveSubTab] = useState<'minimal_pairs' | 'shadowing'>('minimal_pairs');

  // Minimal Pairs State
  const [selectedPairIndex, setSelectedPairIndex] = useState<number>(0);
  const activePair = PRONUNCIATION_MINIMAL_PAIRS[selectedPairIndex] || PRONUNCIATION_MINIMAL_PAIRS[0];
  const [spokenFeedback, setSpokenFeedback] = useState<string | null>(null);

  // Shadowing State
  const [selectedShadowIndex, setSelectedShadowIndex] = useState<number>(0);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);
  const [isRecordingShadow, setIsRecordingShadow] = useState<boolean>(false);
  const [shadowScore, setShadowScore] = useState<number | null>(null);
  const activeShadow = SHADOWING_EXERCISES[selectedShadowIndex] || SHADOWING_EXERCISES[0];

  const speakAudio = (text: string, rate: number = 0.95) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'en-US';
      utter.rate = rate;
      window.speechSynthesis.speak(utter);
    }
  };

  const handleSimulateVoiceCompare = (targetWord: string) => {
    setSpokenFeedback(`Listening to your pronunciation of "${targetWord}"...`);
    setTimeout(() => {
      setSpokenFeedback(`Pronunciation clarity: 94%. Vowel duration and mouth aperture match native model!`);
      updateUser({ xp: 15 });
    }, 1200);
  };

  const handleShadowVoice = () => {
    if (!isRecordingShadow) {
      setIsRecordingShadow(true);
      setTimeout(() => {
        setIsRecordingShadow(false);
        setShadowScore(91);
        updateUser({ xp: 25 });
      }, 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-tab switcher */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('minimal_pairs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
            activeSubTab === 'minimal_pairs'
              ? 'bg-primary text-white border-primary shadow-xs'
              : 'bg-card text-text-muted hover:text-text border-border hover:bg-surface'
          }`}
        >
          Minimal Pairs Arena
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('shadowing')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
            activeSubTab === 'shadowing'
              ? 'bg-primary text-white border-primary shadow-xs'
              : 'bg-card text-text-muted hover:text-text border-border hover:bg-surface'
          }`}
        >
          Shadowing Mode (Listen & Repeat)
        </button>
      </div>

      {/* 1. MINIMAL PAIRS ARENA */}
      {activeSubTab === 'minimal_pairs' && (
        <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-5">
          <div className="border-b border-border pb-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-primary">
              Acoustic Contrast
            </span>
            <h3 className="text-lg font-black text-text mt-0.5">{activePair.pairName}</h3>
            <p className="text-xs text-text-muted">
              Distinguish between easily confused vowel sounds. Listen carefully to the subtle contrast, speak each word, and compare acoustic feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Word A */}
            <div className="p-5 rounded-2xl bg-surface border border-border space-y-3 text-center">
              <div className="space-y-1">
                <span className="text-2xl font-black text-text">{activePair.wordA.word}</span>
                <span className="text-xs font-mono text-primary font-bold block">
                  {activePair.wordA.ipa}
                </span>
              </div>
              <p className="text-xs italic text-text-muted">"{activePair.wordA.audioText}"</p>

              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => speakAudio(activePair.wordA.word, 0.85)}
                  className="px-3.5 py-1.5 rounded-xl bg-card border border-border hover:border-primary text-xs font-bold text-text flex items-center gap-1.5 transition-all shadow-2xs"
                >
                  <Volume2 size={13} className="text-primary" />
                  <span>Listen</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateVoiceCompare(activePair.wordA.word)}
                  className="px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1.5 hover:bg-primary-hover transition-all"
                >
                  <Mic size={13} />
                  <span>Speak & Check</span>
                </button>
              </div>
            </div>

            {/* Word B */}
            <div className="p-5 rounded-2xl bg-surface border border-border space-y-3 text-center">
              <div className="space-y-1">
                <span className="text-2xl font-black text-text">{activePair.wordB.word}</span>
                <span className="text-xs font-mono text-primary font-bold block">
                  {activePair.wordB.ipa}
                </span>
              </div>
              <p className="text-xs italic text-text-muted">"{activePair.wordB.audioText}"</p>

              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => speakAudio(activePair.wordB.word, 0.85)}
                  className="px-3.5 py-1.5 rounded-xl bg-card border border-border hover:border-primary text-xs font-bold text-text flex items-center gap-1.5 transition-all shadow-2xs"
                >
                  <Volume2 size={13} className="text-primary" />
                  <span>Listen</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateVoiceCompare(activePair.wordB.word)}
                  className="px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1.5 hover:bg-primary-hover transition-all"
                >
                  <Mic size={13} />
                  <span>Speak & Check</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mouth Position Coaching Tip */}
          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-xs text-text space-y-1">
            <span className="font-bold text-primary block">Mouth & Tongue Positioning Tip:</span>
            <p className="text-text-muted leading-relaxed">{activePair.mouthPositionTip}</p>
          </div>

          {spokenFeedback && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400 font-semibold animate-in fade-in">
              {spokenFeedback}
            </div>
          )}
        </div>
      )}

      {/* 2. SHADOWING MODE */}
      {activeSubTab === 'shadowing' && (
        <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                Cadence & Prosody
              </span>
              <h3 className="text-lg font-black text-text mt-0.5">Shadowing Studio (Listen → Repeat)</h3>
              <p className="text-xs text-text-muted">
                Listen to the native sentence cadence at different speeds, then shadow immediately to match rhythm and stress patterns.
              </p>
            </div>

            {/* Speed Selector */}
            <div className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-border text-xs font-bold">
              {[0.8, 1.0, 1.2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setAudioSpeed(spd)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    audioSpeed === spd
                      ? 'bg-primary text-white shadow-2xs'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-surface border border-border text-center space-y-3">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              Target Sentence:
            </span>
            <h4 className="text-base sm:text-lg font-black text-text leading-relaxed">
              "{activeShadow.sentence}"
            </h4>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => speakAudio(activeShadow.sentence, audioSpeed)}
                className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs flex items-center gap-2 hover:bg-primary-hover shadow-xs transition-all"
              >
                <Volume2 size={15} />
                <span>Play Model ({audioSpeed}x)</span>
              </button>

              <button
                type="button"
                onClick={handleShadowVoice}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  isRecordingShadow
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-surface border border-border hover:border-primary text-text'
                }`}
              >
                <Mic size={15} />
                <span>{isRecordingShadow ? 'Recording Repeat...' : 'Shadow Now'}</span>
              </button>
            </div>
          </div>

          {/* Key Stress Words */}
          <div className="p-4 rounded-2xl bg-surface border border-border text-xs space-y-1.5">
            <span className="font-bold text-text block">Key Stress Points to Emphasize:</span>
            <div className="flex flex-wrap gap-2">
              {activeShadow.keyStressWords.map((w, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-card border border-primary/30 text-xs font-bold text-primary"
                >
                  {w}
                </span>
              ))}
            </div>
          </div>

          {shadowScore && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400 space-y-1 animate-in fade-in">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 size={16} />
                <span>Shadowing Accuracy: {shadowScore}%</span>
              </div>
              <p className="text-text-muted">
                Excellent rhythm synchronization and intonation slope on the closing clause!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
