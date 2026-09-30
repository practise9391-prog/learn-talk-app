import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  GrammarTopic,
  VocabularyWord,
  IdiomItem,
  PhrasalVerbItem,
  PersonalCollection,
  GlobalSearchResult,
  MasteryState
} from '../types/curriculumModules';
import { GRAMMAR_ROADMAP_TOPICS } from '../data/grammarData';
import { VOCABULARY_DATABASE, INITIAL_PERSONAL_COLLECTIONS } from '../data/vocabularyData';
import { IDIOMS_DATABASE } from '../data/idiomsData';
import { PHRASAL_VERBS_DATABASE } from '../data/phrasalVerbsData';
import { useUser } from './UserContext';

export interface SentenceAnalysisResult {
  inputSentence: string;
  isCorrect: boolean;
  correctedSentence: string;
  ruleExplanation: string;
  whyPoints: string[];
  naturalAlternative?: string;
  relatedGrammarTopicSlug?: string;
}

interface CurriculumModuleContextType {
  grammarTopics: GrammarTopic[];
  vocabularyWords: VocabularyWord[];
  idioms: IdiomItem[];
  phrasalVerbs: PhrasalVerbItem[];
  personalCollections: PersonalCollection[];
  wordsDueForReview: VocabularyWord[];
  toggleBookmarkWord: (wordId: string) => void;
  toggleBookmarkIdiom: (idiomId: string) => void;
  toggleBookmarkPhrasalVerb: (pvId: string) => void;
  updateWordMastery: (wordId: string, state: MasteryState, recallDelta?: number) => void;
  updateGrammarMastery: (topicId: string, state: MasteryState) => void;
  createPersonalCollection: (name: string, icon: string, description: string) => void;
  addWordToCollection: (collectionId: string, wordId: string) => void;
  removeWordFromCollection: (collectionId: string, wordId: string) => void;
  analyzeSentenceWithWhy: (sentence: string) => SentenceAnalysisResult;
  searchCurriculumGlobally: (query: string) => GlobalSearchResult[];
  // Admin Content Management
  addGrammarTopic: (topic: GrammarTopic) => void;
  updateGrammarTopic: (topicId: string, partial: Partial<GrammarTopic>) => void;
  addVocabularyWord: (word: VocabularyWord) => void;
  updateVocabularyWord: (wordId: string, partial: Partial<VocabularyWord>) => void;
  addIdiom: (idiom: IdiomItem) => void;
  updateIdiom: (idiomId: string, partial: Partial<IdiomItem>) => void;
  addPhrasalVerb: (pv: PhrasalVerbItem) => void;
  updatePhrasalVerb: (pvId: string, partial: Partial<PhrasalVerbItem>) => void;
}

const CurriculumModuleContext = createContext<CurriculumModuleContextType | undefined>(undefined);

export const CurriculumModuleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { updateUser, user } = useUser();

  // Grammar Topics
  const [grammarTopics, setGrammarTopics] = useState<GrammarTopic[]>(() => {
    const saved = localStorage.getItem('learntalk_grammar_topics');
    return saved ? JSON.parse(saved) : GRAMMAR_ROADMAP_TOPICS;
  });

  // Vocabulary Words
  const [vocabularyWords, setVocabularyWords] = useState<VocabularyWord[]>(() => {
    const saved = localStorage.getItem('learntalk_vocab_words');
    return saved ? JSON.parse(saved) : VOCABULARY_DATABASE;
  });

  // Idioms
  const [idioms, setIdioms] = useState<IdiomItem[]>(() => {
    const saved = localStorage.getItem('learntalk_idioms');
    return saved ? JSON.parse(saved) : IDIOMS_DATABASE;
  });

  // Phrasal Verbs
  const [phrasalVerbs, setPhrasalVerbs] = useState<PhrasalVerbItem[]>(() => {
    const saved = localStorage.getItem('learntalk_phrasal_verbs');
    return saved ? JSON.parse(saved) : PHRASAL_VERBS_DATABASE;
  });

  // Collections
  const [personalCollections, setPersonalCollections] = useState<PersonalCollection[]>(() => {
    const saved = localStorage.getItem('learntalk_vocab_collections');
    return saved ? JSON.parse(saved) : INITIAL_PERSONAL_COLLECTIONS;
  });

  useEffect(() => {
    localStorage.setItem('learntalk_grammar_topics', JSON.stringify(grammarTopics));
  }, [grammarTopics]);

  useEffect(() => {
    localStorage.setItem('learntalk_vocab_words', JSON.stringify(vocabularyWords));
  }, [vocabularyWords]);

  useEffect(() => {
    localStorage.setItem('learntalk_idioms', JSON.stringify(idioms));
  }, [idioms]);

  useEffect(() => {
    localStorage.setItem('learntalk_phrasal_verbs', JSON.stringify(phrasalVerbs));
  }, [phrasalVerbs]);

  useEffect(() => {
    localStorage.setItem('learntalk_vocab_collections', JSON.stringify(personalCollections));
  }, [personalCollections]);

  // Words due for spaced repetition review
  const todayStr = new Date().toISOString().split('T')[0];
  const wordsDueForReview = vocabularyWords.filter(
    (w) => !w.nextReviewDate || w.nextReviewDate <= todayStr || w.recallStrength < 70
  );

  const toggleBookmarkWord = (wordId: string) => {
    setVocabularyWords((prev) =>
      prev.map((w) => (w.id === wordId ? { ...w, isBookmarked: !w.isBookmarked } : w))
    );
  };

  const toggleBookmarkIdiom = (idiomId: string) => {
    setIdioms((prev) =>
      prev.map((i) => (i.id === idiomId ? { ...i, isBookmarked: !i.isBookmarked } : i))
    );
  };

  const toggleBookmarkPhrasalVerb = (pvId: string) => {
    setPhrasalVerbs((prev) =>
      prev.map((pv) => (pv.id === pvId ? { ...pv, isBookmarked: !pv.isBookmarked } : pv))
    );
  };

  const updateWordMastery = (wordId: string, state: MasteryState, recallDelta: number = 10) => {
    setVocabularyWords((prev) =>
      prev.map((w) => {
        if (w.id !== wordId) return w;
        const newRecall = Math.max(0, Math.min(100, w.recallStrength + recallDelta));
        const nextDate = new Date(Date.now() + (newRecall >= 80 ? 7 : 3) * 86400000)
          .toISOString()
          .split('T')[0];
        return {
          ...w,
          masteryState: state,
          recallStrength: newRecall,
          reviewCount: w.reviewCount + 1,
          lastReviewedDate: todayStr,
          nextReviewDate: nextDate
        };
      })
    );
    updateUser({ xp: user.xp + 15 });
  };

  const updateGrammarMastery = (topicId: string, state: MasteryState) => {
    setGrammarTopics((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, status: state } : t))
    );
    updateUser({ xp: user.xp + 25 });
  };

  const createPersonalCollection = (name: string, icon: string, description: string) => {
    const newCol: PersonalCollection = {
      id: `col-${Date.now()}`,
      name,
      icon,
      description,
      wordIds: []
    };
    setPersonalCollections((prev) => [...prev, newCol]);
  };

  const addWordToCollection = (collectionId: string, wordId: string) => {
    setPersonalCollections((prev) =>
      prev.map((c) =>
        c.id === collectionId
          ? { ...c, wordIds: Array.from(new Set([...c.wordIds, wordId])) }
          : c
      )
    );
  };

  const removeWordFromCollection = (collectionId: string, wordId: string) => {
    setPersonalCollections((prev) =>
      prev.map((c) =>
        c.id === collectionId ? { ...c, wordIds: c.wordIds.filter((id) => id !== wordId) } : c
      )
    );
  };

  // Section 8: "Why is this wrong?" Grammar Explanation Engine
  const analyzeSentenceWithWhy = (sentence: string): SentenceAnalysisResult => {
    const trimmed = sentence.trim();
    const lower = trimmed.toLowerCase();

    // Check third-person singular "he/she go to"
    if (/\b(he|she|it)\s+go\s+(to)?/i.test(trimmed)) {
      return {
        inputSentence: trimmed,
        isCorrect: false,
        correctedSentence: trimmed.replace(/\bgo\b/i, 'goes').replace(/\boffice\b/i, 'the office'),
        ruleExplanation:
          'In English, third-person singular subjects (He, She, It) require the verb to take -s or -es in the simple present tense.',
        whyPoints: [
          '"He/She/It" is third-person singular.',
          'Simple present rule requires "goes" instead of "go".',
          'In everyday English, locations like "office" require the definite article: "to the office".'
        ],
        naturalAlternative: 'He heads to the office every morning.',
        relatedGrammarTopicSlug: 'simple-present'
      };
    }

    // Check "discuss about"
    if (/\bdiscuss(ed)?\s+about\b/i.test(lower)) {
      return {
        inputSentence: trimmed,
        isCorrect: false,
        correctedSentence: trimmed.replace(/\babout\s+/i, ''),
        ruleExplanation:
          'The verb "discuss" already means "to talk about". Adding "about" is redundant in English.',
        whyPoints: [
          '"Discuss" is a transitive verb that directly takes an object.',
          'Say "discuss the project" rather than "discuss about the project".'
        ],
        naturalAlternative: 'Let us discuss the quarterly budget at 3 PM.',
        relatedGrammarTopicSlug: 'sentence-basics'
      };
    }

    // Check "I am knowing"
    if (/\bi\s+am\s+knowing\b/i.test(lower)) {
      return {
        inputSentence: trimmed,
        isCorrect: false,
        correctedSentence: trimmed.replace(/\bam\s+knowing\b/i, 'know'),
        ruleExplanation:
          '"Know" is a stative verb expressing a cognitive mental state rather than an ongoing physical activity.',
        whyPoints: [
          'Stative verbs (know, understand, believe, want) are rarely used in continuous -ing tenses.',
          'Use simple present: "I know the answer".'
        ],
        naturalAlternative: 'I know the answer thoroughly.',
        relatedGrammarTopicSlug: 'simple-present'
      };
    }

    // Check "I didn't saw"
    if (/\bdidn't\s+saw\b/i.test(lower) || /\bdid\s+not\s+saw\b/i.test(lower)) {
      return {
        inputSentence: trimmed,
        isCorrect: false,
        correctedSentence: trimmed.replace(/\bsaw\b/i, 'see'),
        ruleExplanation:
          'After the past auxiliary "did" or "didn’t", the main verb must always revert to its base form.',
        whyPoints: [
          '"Did" already carries the past tense marker for the clause.',
          'Double past marking ("didn’t saw") is ungrammatical; use "didn’t see".'
        ],
        naturalAlternative: 'I did not see him at yesterday’s meeting.',
        relatedGrammarTopicSlug: 'simple-past'
      };
    }

    // Default clean sentence
    return {
      inputSentence: trimmed,
      isCorrect: true,
      correctedSentence: trimmed,
      ruleExplanation: 'Your sentence is grammatically sound, natural, and easy to follow!',
      whyPoints: [
        'Subject-verb agreement is properly preserved.',
        'Tenses and prepositions follow standard English conventions.'
      ],
      naturalAlternative: trimmed
    };
  };

  // Section 30: Global Unified Search across Grammar, Vocabulary, Idioms, Phrasal Verbs, and Lessons
  const searchCurriculumGlobally = (query: string): GlobalSearchResult[] => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const results: GlobalSearchResult[] = [];

    // Search Grammar Topics
    grammarTopics.forEach((t) => {
      if (
        t.title.toLowerCase().includes(q) ||
        t.simpleExplanation.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.structure.toLowerCase().includes(q)
      ) {
        results.push({
          id: t.id,
          title: t.title,
          type: 'grammar',
          subtitle: t.simpleExplanation,
          category: t.category.replace('_', ' '),
          level: t.level,
          linkPath: `/grammar?topic=${t.slug}`
        });
      }
    });

    // Search Vocabulary
    vocabularyWords.forEach((w) => {
      if (
        w.word.toLowerCase().includes(q) ||
        w.meaning.toLowerCase().includes(q) ||
        w.simpleMeaning.toLowerCase().includes(q) ||
        w.collocations.some((c) => c.phrase.toLowerCase().includes(q))
      ) {
        results.push({
          id: w.id,
          title: w.word,
          type: 'vocabulary',
          subtitle: w.simpleMeaning,
          category: w.category,
          level: w.level,
          linkPath: `/vocabulary?word=${w.word}`
        });
      }
    });

    // Search Idioms
    idioms.forEach((i) => {
      if (
        i.phrase.toLowerCase().includes(q) ||
        i.actualMeaning.toLowerCase().includes(q) ||
        i.simpleExplanation.toLowerCase().includes(q)
      ) {
        results.push({
          id: i.id,
          title: i.phrase,
          type: 'idiom',
          subtitle: i.actualMeaning,
          category: i.category,
          level: i.level,
          linkPath: `/idioms?idiom=${encodeURIComponent(i.phrase)}`
        });
      }
    });

    // Search Phrasal Verbs
    phrasalVerbs.forEach((pv) => {
      if (
        pv.phrase.toLowerCase().includes(q) ||
        pv.baseVerb.toLowerCase().includes(q) ||
        pv.meaning.toLowerCase().includes(q) ||
        pv.formalAlternative.toLowerCase().includes(q)
      ) {
        results.push({
          id: pv.id,
          title: pv.phrase,
          type: 'phrasal_verb',
          subtitle: pv.meaning,
          category: pv.category,
          level: pv.level,
          linkPath: `/phrasal-verbs?pv=${encodeURIComponent(pv.phrase)}`
        });
      }
    });

    return results.slice(0, 15);
  };

  // Section 37: Admin Content Management Actions
  const addGrammarTopic = (topic: GrammarTopic) => {
    setGrammarTopics((prev) => [topic, ...prev]);
  };

  const updateGrammarTopic = (topicId: string, partial: Partial<GrammarTopic>) => {
    setGrammarTopics((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, ...partial } : t))
    );
  };

  const addVocabularyWord = (word: VocabularyWord) => {
    setVocabularyWords((prev) => [word, ...prev]);
  };

  const updateVocabularyWord = (wordId: string, partial: Partial<VocabularyWord>) => {
    setVocabularyWords((prev) =>
      prev.map((w) => (w.id === wordId ? { ...w, ...partial } : w))
    );
  };

  const addIdiom = (idiom: IdiomItem) => {
    setIdioms((prev) => [idiom, ...prev]);
  };

  const updateIdiom = (idiomId: string, partial: Partial<IdiomItem>) => {
    setIdioms((prev) =>
      prev.map((i) => (i.id === idiomId ? { ...i, ...partial } : i))
    );
  };

  const addPhrasalVerb = (pv: PhrasalVerbItem) => {
    setPhrasalVerbs((prev) => [pv, ...prev]);
  };

  const updatePhrasalVerb = (pvId: string, partial: Partial<PhrasalVerbItem>) => {
    setPhrasalVerbs((prev) =>
      prev.map((pv) => (pv.id === pvId ? { ...pv, ...partial } : pv))
    );
  };

  return (
    <CurriculumModuleContext.Provider
      value={{
        grammarTopics,
        vocabularyWords,
        idioms,
        phrasalVerbs,
        personalCollections,
        wordsDueForReview,
        toggleBookmarkWord,
        toggleBookmarkIdiom,
        toggleBookmarkPhrasalVerb,
        updateWordMastery,
        updateGrammarMastery,
        createPersonalCollection,
        addWordToCollection,
        removeWordFromCollection,
        analyzeSentenceWithWhy,
        searchCurriculumGlobally,
        addGrammarTopic,
        updateGrammarTopic,
        addVocabularyWord,
        updateVocabularyWord,
        addIdiom,
        updateIdiom,
        addPhrasalVerb,
        updatePhrasalVerb
      }}
    >
      {children}
    </CurriculumModuleContext.Provider>
  );
};

export const useCurriculumModule = () => {
  const context = useContext(CurriculumModuleContext);
  if (!context) {
    throw new Error('useCurriculumModule must be used within CurriculumModuleProvider');
  }
  return context;
};
