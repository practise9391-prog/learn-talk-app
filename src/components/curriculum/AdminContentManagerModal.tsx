import React, { useState } from 'react';
import { useCurriculumModule } from '../../context/CurriculumModuleContext';
import { CEFRLevel } from '../../types';
import {
  Layers,
  Plus,
  BookOpen,
  Sparkles,
  Compass,
  CheckCircle2,
  X,
  Save,
  Trash2
} from 'lucide-react';

interface AdminContentManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminContentManagerModal: React.FC<AdminContentManagerModalProps> = ({
  isOpen,
  onClose
}) => {
  const {
    grammarTopics,
    vocabularyWords,
    idioms,
    phrasalVerbs,
    addGrammarTopic,
    addVocabularyWord,
    addIdiom,
    addPhrasalVerb
  } = useCurriculumModule();

  const [activeTab, setActiveTab] = useState<'grammar' | 'vocabulary' | 'idiom' | 'phrasal_verb'>('vocabulary');
  const [saveNotification, setSaveNotification] = useState<string | null>(null);

  // New Word Form State
  const [newWord, setNewWord] = useState({
    word: '',
    ipa: '',
    meaning: '',
    simpleMeaning: '',
    category: 'workplace' as any,
    level: 'B1' as CEFRLevel,
    example: '',
    telugu: '',
    hindi: ''
  });

  // New Grammar Topic State
  const [newGrammar, setNewGrammar] = useState({
    title: '',
    slug: '',
    level: 'A2' as CEFRLevel,
    category: 'sentence_basics' as any,
    levelCategory: 'beginner' as any,
    simpleExplanation: '',
    structure: '',
    example: ''
  });

  if (!isOpen) return null;

  const handleCreateWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.word || !newWord.simpleMeaning) return;

    addVocabularyWord({
      id: `vw-${Date.now()}`,
      word: newWord.word.trim(),
      pronunciation: {
        ipa: newWord.ipa || `/${newWord.word.toLowerCase()}/`,
        audioGuide: newWord.word
      },
      partOfSpeech: 'noun',
      meaning: newWord.meaning || newWord.simpleMeaning,
      simpleMeaning: newWord.simpleMeaning,
      category: newWord.category,
      level: newWord.level,
      formality: 'professional',
      examples: [
        {
          context: 'office',
          sentence: newWord.example || `This is an example sentence using ${newWord.word}.`
        }
      ],
      synonyms: [],
      collocations: [
        { phrase: `use ${newWord.word}`, type: 'natural', note: 'Standard usage' }
      ],
      translations: {
        telugu: newWord.telugu || 'అర్థం',
        hindi: newWord.hindi || 'अर्थ'
      },
      relatedWords: [],
      usageGuidelines: {
        whereToUse: 'General professional contexts',
        whoToUseWith: 'Colleagues and clients',
        commonMistake: 'Using incorrect prepositions',
        correction: 'Ensure standard word collocation'
      },
      masteryState: 'available',
      recallStrength: 50,
      reviewCount: 0
    });

    setSaveNotification(`Successfully added vocabulary entry: "${newWord.word}"`);
    setNewWord({
      word: '',
      ipa: '',
      meaning: '',
      simpleMeaning: '',
      category: 'workplace',
      level: 'B1',
      example: '',
      telugu: '',
      hindi: ''
    });
    setTimeout(() => setSaveNotification(null), 3000);
  };

  const handleCreateGrammar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGrammar.title || !newGrammar.simpleExplanation) return;

    addGrammarTopic({
      id: `gt-${Date.now()}`,
      title: newGrammar.title.trim(),
      slug: newGrammar.slug || newGrammar.title.toLowerCase().replace(/\s+/g, '-'),
      level: newGrammar.level,
      category: newGrammar.category,
      levelCategory: newGrammar.levelCategory,
      simpleExplanation: newGrammar.simpleExplanation,
      detailedExplanation: newGrammar.simpleExplanation,
      structure: newGrammar.structure || 'Subject + Verb + Object',
      examples: [
        {
          level: 'daily',
          sentence: newGrammar.example || 'Example sentence demonstrating the structure.',
          explanation: 'Standard application.'
        }
      ],
      whenToUse: ['In clear spoken communication'],
      whenNotToUse: ['Avoid inappropriate tense shifts'],
      commonMistakes: [],
      practiceExercises: [],
      speakingPrompt: {
        prompt: `Create a sentence using ${newGrammar.title}.`,
        sampleAnswer: newGrammar.example || 'Sample sentence.',
        context: 'Daily conversation'
      },
      conversationScenario: {
        characterName: 'Jarvis',
        characterRole: 'Coach',
        starterPrompt: `Let’s practice ${newGrammar.title}.`,
        targetUsage: 'Use target grammar'
      },
      relatedTopics: [],
      status: 'available'
    });

    setSaveNotification(`Successfully added grammar topic: "${newGrammar.title}"`);
    setNewGrammar({
      title: '',
      slug: '',
      level: 'A2',
      category: 'sentence_basics',
      levelCategory: 'beginner',
      simpleExplanation: '',
      structure: '',
      example: ''
    });
    setTimeout(() => setSaveNotification(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-card border border-border w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-border bg-surface/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black">
              <Layers size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                Administrative Authoring Suite
              </span>
              <h3 className="text-base sm:text-lg font-black text-text">
                Curriculum Content Manager (Section 37)
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 py-2 border-b border-border bg-card flex items-center gap-2 shrink-0">
          {[
            { id: 'vocabulary', label: `Vocabulary (${vocabularyWords.length})` },
            { id: 'grammar', label: `Grammar (${grammarTopics.length})` },
            { id: 'idiom', label: `Idioms (${idioms.length})` },
            { id: 'phrasal_verb', label: `Phrasal Verbs (${phrasalVerbs.length})` }
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === t.id
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-text-muted hover:bg-surface'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          {saveNotification && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{saveNotification}</span>
            </div>
          )}

          {activeTab === 'vocabulary' && (
            <form onSubmit={handleCreateWord} className="space-y-4">
              <h4 className="text-sm font-black text-text">Publish New Vocabulary Entry</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-text-muted block mb-1">Word *</label>
                  <input
                    type="text"
                    required
                    value={newWord.word}
                    onChange={(e) => setNewWord({ ...newWord, word: e.target.value })}
                    placeholder="e.g. streamline"
                    className="w-full p-2.5 rounded-xl bg-surface border border-border text-text focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="font-bold text-text-muted block mb-1">IPA Phonetics</label>
                  <input
                    type="text"
                    value={newWord.ipa}
                    onChange={(e) => setNewWord({ ...newWord, ipa: e.target.value })}
                    placeholder="e.g. /ˈstriːm.laɪn/"
                    className="w-full p-2.5 rounded-xl bg-surface border border-border text-text focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-text-muted block mb-1">Simple Meaning *</label>
                  <input
                    type="text"
                    required
                    value={newWord.simpleMeaning}
                    onChange={(e) => setNewWord({ ...newWord, simpleMeaning: e.target.value })}
                    placeholder="e.g. To make a system or organization simpler and more efficient."
                    className="w-full p-2.5 rounded-xl bg-surface border border-border text-text focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="font-bold text-text-muted block mb-1">Category</label>
                  <select
                    value={newWord.category}
                    onChange={(e) => setNewWord({ ...newWord, category: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-surface border border-border text-text focus:outline-none focus:border-primary"
                  >
                    <option value="workplace">Workplace</option>
                    <option value="professional">Professional</option>
                    <option value="technology">Technology</option>
                    <option value="everyday">Everyday</option>
                    <option value="college">College</option>
                    <option value="travel">Travel</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-text-muted block mb-1">CEFR Level</label>
                  <select
                    value={newWord.level}
                    onChange={(e) => setNewWord({ ...newWord, level: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-surface border border-border text-text focus:outline-none focus:border-primary"
                  >
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                    <option value="C1">C1</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-text-muted block mb-1">Example Sentence</label>
                  <input
                    type="text"
                    value={newWord.example}
                    onChange={(e) => setNewWord({ ...newWord, example: e.target.value })}
                    placeholder="e.g. We streamlined our onboarding workflow."
                    className="w-full p-2.5 rounded-xl bg-surface border border-border text-text focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="font-bold text-text-muted block mb-1">Telugu Translation</label>
                  <input
                    type="text"
                    value={newWord.telugu}
                    onChange={(e) => setNewWord({ ...newWord, telugu: e.target.value })}
                    placeholder="e.g. సరళీకృతం చేయడం"
                    className="w-full p-2.5 rounded-xl bg-surface border border-border text-text focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="font-bold text-text-muted block mb-1">Hindi Translation</label>
                  <input
                    type="text"
                    value={newWord.hindi}
                    onChange={(e) => setNewWord({ ...newWord, hindi: e.target.value })}
                    placeholder="e.g. सरल बनाना"
                    className="w-full p-2.5 rounded-xl bg-surface border border-border text-text focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover flex items-center gap-2 shadow-xs"
              >
                <Plus size={14} />
                <span>Save & Publish Vocabulary Word</span>
              </button>
            </form>
          )}

          {activeTab === 'grammar' && (
            <form onSubmit={handleCreateGrammar} className="space-y-4">
              <h4 className="text-sm font-black text-text">Publish New Grammar Topic</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-text-muted block mb-1">Topic Title *</label>
                  <input
                    type="text"
                    required
                    value={newGrammar.title}
                    onChange={(e) => setNewGrammar({ ...newGrammar, title: e.target.value })}
                    placeholder="e.g. Future Perfect Continuous"
                    className="w-full p-2.5 rounded-xl bg-surface border border-border text-text focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="font-bold text-text-muted block mb-1">Level Category</label>
                  <select
                    value={newGrammar.levelCategory}
                    onChange={(e) => setNewGrammar({ ...newGrammar, levelCategory: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-surface border border-border text-text focus:outline-none focus:border-primary"
                  >
                    <option value="beginner">Level 1: Absolute Beginner</option>
                    <option value="tenses">12 Tenses System</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced & Professional</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-text-muted block mb-1">Simple Explanation *</label>
                  <textarea
                    rows={2}
                    required
                    value={newGrammar.simpleExplanation}
                    onChange={(e) => setNewGrammar({ ...newGrammar, simpleExplanation: e.target.value })}
                    placeholder="Explain clearly what the structure means in living English..."
                    className="w-full p-2.5 rounded-xl bg-surface border border-border text-text focus:outline-none focus:border-primary resize-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-text-muted block mb-1">Syntactic Formula</label>
                  <input
                    type="text"
                    value={newGrammar.structure}
                    onChange={(e) => setNewGrammar({ ...newGrammar, structure: e.target.value })}
                    placeholder="e.g. S + will have been + V-ing"
                    className="w-full p-2.5 rounded-xl bg-surface border border-border text-text focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="font-bold text-text-muted block mb-1">Example Sentence</label>
                  <input
                    type="text"
                    value={newGrammar.example}
                    onChange={(e) => setNewGrammar({ ...newGrammar, example: e.target.value })}
                    placeholder="e.g. By 2028, I will have been working here for 5 years."
                    className="w-full p-2.5 rounded-xl bg-surface border border-border text-text focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover flex items-center gap-2 shadow-xs"
              >
                <Plus size={14} />
                <span>Save & Publish Grammar Topic</span>
              </button>
            </form>
          )}

          {activeTab === 'idiom' && (
            <div className="p-8 text-center text-xs text-text-muted bg-surface rounded-2xl">
              Add idioms with literal vs actual meanings directly via the Authoring Engine.
            </div>
          )}

          {activeTab === 'phrasal_verb' && (
            <div className="p-8 text-center text-xs text-text-muted bg-surface rounded-2xl">
              Configure separable verbs, particles, and formal equivalents directly via the Authoring Engine.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex justify-end bg-surface/50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-card border border-border font-bold text-xs hover:bg-surface"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
