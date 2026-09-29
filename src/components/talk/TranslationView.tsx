import React, { useState } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { SUPPORTED_LANGUAGES, SAMPLE_TRANSLATION_EXAMPLES } from '../../data/topics';
import { Languages, ArrowRight, Volume2, Sparkles, Copy, Check } from 'lucide-react';

export const TranslationView: React.FC = () => {
  const [fromLang, setFromLang] = useState('Telugu');
  const [toLang, setToLang] = useState('English');
  const [inputText, setInputText] = useState('నేను రేపు ఆఫీస్ కి కొంచెం ఆలస్యంగా వస్తాను');
  const [activeResult, setActiveResult] = useState(SAMPLE_TRANSLATION_EXAMPLES[0]);
  const [copied, setCopied] = useState(false);

  const handleTranslate = () => {
    // If text matches Hindi example or custom
    if (inputText.includes('चाय') || fromLang === 'Hindi') {
      setActiveResult(SAMPLE_TRANSLATION_EXAMPLES[1]);
    } else {
      setActiveResult(SAMPLE_TRANSLATION_EXAMPLES[0]);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeResult.naturalEnglish);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <PageHeader
        title="Native Language → Natural English"
        subtitle="Translate thought-for-thought instead of word-for-word to speak natural English"
        badge="Contextual Translation"
        showBack={true}
      />

      {/* Language selectors */}
      <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between gap-4">
        <div className="flex-1">
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">
            From Language
          </label>
          <select
            value={fromLang}
            onChange={(e) => setFromLang(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-surface border border-border text-sm font-bold text-text focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {SUPPORTED_LANGUAGES.filter((l) => l.name !== 'English').map((l) => (
              <option key={l.code} value={l.name}>
                {l.name} ({l.nativeName})
              </option>
            ))}
          </select>
        </div>

        <div className="p-2 rounded-xl bg-surface border border-border text-text-muted mt-5">
          <ArrowRight size={18} />
        </div>

        <div className="flex-1">
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">
            To Language
          </label>
          <select
            value={toLang}
            onChange={(e) => setToLang(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-surface border border-border text-sm font-bold text-text focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="English">Natural Spoken English</option>
          </select>
        </div>
      </div>

      {/* Input Text Box */}
      <div className="rounded-3xl bg-card border border-border p-5 shadow-sm">
        <label className="text-xs font-bold text-text mb-2 block">
          Enter word, phrase or sentence in your mother tongue:
        </label>
        <textarea
          rows={3}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type or paste in your native language..."
          className="w-full p-4 rounded-2xl bg-surface border border-border text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
        />

        <div className="flex justify-between items-center mt-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setInputText('నేను రేపు ఆఫీస్ కి కొంచెం ఆలస్యంగా వస్తాను');
                setFromLang('Telugu');
                setActiveResult(SAMPLE_TRANSLATION_EXAMPLES[0]);
              }}
              className="px-2.5 py-1 rounded-lg bg-surface border border-border text-xs text-text-muted hover:text-text"
            >
              Try Telugu Example
            </button>
            <button
              type="button"
              onClick={() => {
                setInputText('मुझे चाय में चीनी कम पसंद है');
                setFromLang('Hindi');
                setActiveResult(SAMPLE_TRANSLATION_EXAMPLES[1]);
              }}
              className="px-2.5 py-1 rounded-lg bg-surface border border-border text-xs text-text-muted hover:text-text"
            >
              Try Hindi Example
            </button>
          </div>

          <button
            type="button"
            onClick={handleTranslate}
            className="px-5 py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-xl shadow-sm hover:bg-primary-hover transition-colors"
          >
            Convert to Natural English
          </button>
        </div>
      </div>

      {/* Structured Result (Requirement 26) */}
      {activeResult && (
        <div className="rounded-3xl bg-card border border-border p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles size={14} /> Natural Spoken Version
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 text-text-muted hover:text-text rounded-lg hover:bg-surface border border-border transition-colors flex items-center gap-1 text-xs"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-surface border border-border flex items-center justify-between">
            <div>
              <span className="text-lg font-black text-text block">
                "{activeResult.naturalEnglish}"
              </span>
              {activeResult.phonetics && (
                <span className="text-xs font-mono text-text-muted mt-1 block">
                  Phonetics: {activeResult.phonetics}
                </span>
              )}
            </div>
            <button
              type="button"
              className="p-2.5 rounded-xl bg-card border border-border text-primary hover:bg-primary hover:text-white transition-colors"
              title="Hear natural audio"
            >
              <Volume2 size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-surface border border-border">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                Literal / Textbook Translation:
              </span>
              <p className="text-text-muted font-medium">"{activeResult.grammaticalEnglish}"</p>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
                Grammatically acceptable, but less idiomatic in real conversation.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface border border-border">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                Context & Tone:
              </span>
              <p className="text-text">{activeResult.usageContext}</p>
              <p className="text-text-muted mt-1 leading-relaxed">{activeResult.meaning}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface border border-border text-xs">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">
              Example in a Full Sentence:
            </span>
            <p className="text-text font-semibold italic">"{activeResult.exampleSentence}"</p>
          </div>
        </div>
      )}
    </div>
  );
};
