import React, { useState } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { ConceptAnimation } from './ConceptAnimation';
import { AudioPlayer } from '../common/AudioPlayer';
import { VoiceButton, VoiceButtonState } from '../common/VoiceButton';
import { NATURAL_ENGLISH_COMPARISONS } from '../../data/mistakes';
import { Sparkles, Mic, BookOpen, Volume2, CheckCircle2 } from 'lucide-react';

interface CurriculumFeatureViewProps {
  type: 'grammar' | 'vocabulary' | 'pronunciation' | 'idioms';
}

export const CurriculumFeatureView: React.FC<CurriculumFeatureViewProps> = ({ type }) => {
  const [voiceState, setVoiceState] = useState<VoiceButtonState>('idle');
  const [hasPracticed, setHasPracticed] = useState<boolean>(false);

  const configs = {
    grammar: {
      title: 'Grammar in Action (Not in a Textbook)',
      subtitle: 'Understand why sentence structures work and how native speakers naturally frame thoughts',
      badge: 'Action Grammar',
    },
    vocabulary: {
      title: 'Active Vocabulary Bank',
      subtitle: 'Learn words in complete conversational chunks rather than isolated flashcard lists',
      badge: 'Collocations',
    },
    pronunciation: {
      title: 'Pronunciation & Articulation Lab',
      subtitle: 'Master mouth positioning, syllable stress, intonation, and rhythm',
      badge: 'Acoustics & Rhythm',
    },
    idioms: {
      title: 'Natural Idioms & Phrasal Verbs',
      subtitle: 'Real-life expressions native speakers use daily instead of formal textbook vocabulary',
      badge: 'Native Phrasing',
    },
  };

  const current = configs[type];

  const handleVoiceToggle = () => {
    if (voiceState === 'idle') {
      setVoiceState('listening');
      setTimeout(() => setVoiceState('recording'), 400);
    } else if (voiceState === 'recording') {
      setVoiceState('processing');
      setTimeout(() => {
        setVoiceState('idle');
        setHasPracticed(true);
      }, 1200);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <PageHeader
        title={current.title}
        subtitle={current.subtitle}
        badge={current.badge}
        showBack={true}
      />

      {type === 'grammar' && (
        <div className="space-y-6">
          <ConceptAnimation type="svo" />

          <div className="p-6 rounded-3xl bg-card border border-border shadow-sm">
            <h3 className="text-base font-black text-text mb-4">
              Real-Life Tone Comparisons (Natural vs Textbook)
            </h3>
            <div className="space-y-3">
              {NATURAL_ENGLISH_COMPARISONS.map((comp, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-surface border border-border space-y-2 text-xs">
                  <div className="font-bold text-primary">{comp.scenario}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="p-2.5 rounded-xl bg-card border border-border">
                      <span className="text-[10px] text-text-muted font-bold block uppercase">Grammatical:</span>
                      <span className="text-text">{comp.grammaticallyCorrect}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block uppercase">Natural Spoken:</span>
                      <span className="font-bold text-text">{comp.natural}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30">
                      <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold block uppercase">Professional:</span>
                      <span className="font-bold text-text">{comp.professionalPolite}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-text-muted italic">{comp.contextNote}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {type === 'pronunciation' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-card border border-border shadow-sm text-center">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-2">
              Syllable Stress & Connected Speech
            </span>
            <p className="text-lg font-black text-text mb-4">
              "Pleased to <span className="text-primary underline decoration-2">meet</span> you."
            </p>
            <AudioPlayer title="Native Speaker Articulation" duration="0:05" className="max-w-md mx-auto mb-4" />

            <div className="py-2">
              <VoiceButton
                state={voiceState}
                onClick={handleVoiceToggle}
                size="md"
                label="Tap to Practice Pronunciation"
              />
            </div>

            {hasPracticed && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs max-w-sm mx-auto">
                ✓ Articulation recorded clearly with steady stress.
              </div>
            )}
          </div>
        </div>
      )}

      {type === 'vocabulary' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { word: 'Pick up', meaning: 'To collect someone / answer the phone', example: 'I will pick you up from the railway station at 5 PM.' },
            { word: 'Run out of', meaning: 'To have no more of something left', example: 'We have run out of coffee beans; could you buy some?' },
            { word: 'Follow up', meaning: 'To check in on a previous request', example: 'Let me follow up with the manager tomorrow morning.' },
            { word: 'Count on', meaning: 'To rely or depend on someone', example: 'You can always count on me for speaking practice!' },
          ].map((v, i) => (
            <div key={i} className="p-5 rounded-2xl bg-card border border-border shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-base font-black text-primary">{v.word}</h4>
                <Volume2 size={15} className="text-text-muted hover:text-primary cursor-pointer" />
              </div>
              <p className="text-xs text-text font-medium mb-2">{v.meaning}</p>
              <p className="text-xs text-text-muted italic bg-surface p-2.5 rounded-xl border border-border">
                "{v.example}"
              </p>
            </div>
          ))}
        </div>
      )}

      {type === 'idioms' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { idiom: 'On the same page', literal: 'Reading the same book page', spokenMeaning: 'Having the same understanding or agreement', naturalExample: "Let's do a quick sync to make sure we're on the same page." },
            { idiom: 'A piece of cake', literal: 'A slice of pastry', spokenMeaning: 'Very easy to accomplish', naturalExample: 'Once you practice daily, ordering food in English is a piece of cake!' },
            { idiom: 'Touch base', literal: 'Touching baseball base', spokenMeaning: 'To briefly connect or communicate', naturalExample: 'I will touch base with you after the meeting.' },
            { idiom: 'Call it a day', literal: 'Naming the day', spokenMeaning: 'To stop working for the rest of the day', naturalExample: "We've made great progress today, let's call it a day." },
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-2xl bg-card border border-border shadow-xs">
              <h4 className="text-base font-black text-text mb-1">"{item.idiom}"</h4>
              <p className="text-xs font-semibold text-primary mb-2">{item.spokenMeaning}</p>
              <div className="p-3 rounded-xl bg-surface border border-border text-xs text-text-muted italic">
                "{item.naturalExample}"
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
