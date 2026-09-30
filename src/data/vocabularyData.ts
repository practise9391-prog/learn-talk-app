import { VocabularyWord } from '../types/curriculumModules';

export const VOCABULARY_DATABASE: VocabularyWord[] = [
  // ==========================================
  // WORKPLACE & PROFESSIONAL
  // ==========================================
  {
    id: 'vw-deadline',
    word: 'deadline',
    pronunciation: {
      ipa: '/ˈded.laɪn/',
      audioGuide: 'DED-line'
    },
    partOfSpeech: 'noun',
    meaning: 'The latest time or date by which something must be finished or submitted.',
    simpleMeaning: 'The final date or time to complete a task.',
    category: 'workplace',
    level: 'B1',
    formality: 'professional',
    examples: [
      {
        context: 'daily',
        sentence: 'I have a strict deadline for my tax filing this Friday.'
      },
      {
        context: 'office',
        sentence: 'We need to finish the client presentation before the 5 PM deadline.'
      },
      {
        context: 'professional',
        sentence: 'Could you please confirm whether the engineering team can meet the revised project deadline?'
      },
      {
        context: 'college',
        sentence: 'The professor announced that the research paper deadline has been extended to Monday.'
      }
    ],
    synonyms: [
      { word: 'due date', nuance: 'More common for assignments, bills, and routine tasks', formality: 'conversational' },
      { word: 'target date', nuance: 'Implies an aspirational goal rather than a hard cutoff', formality: 'professional' },
      { word: 'cutoff', nuance: 'Strict stopping point after which nothing is accepted', formality: 'formal' }
    ],
    antonyms: [
      { word: 'extension', nuance: 'Extra time granted beyond the original cutoff' }
    ],
    wordFamily: {
      noun: 'deadline'
    },
    collocations: [
      { phrase: 'meet a deadline', type: 'natural', note: 'To complete on time (standard English)' },
      { phrase: 'miss a deadline', type: 'natural', note: 'To fail to complete on time' },
      { phrase: 'tight deadline', type: 'natural', note: 'Very little time remaining' },
      { phrase: 'extend a deadline', type: 'natural', note: 'Grant more time' },
      { phrase: 'reach a deadline', type: 'possible_uncommon', note: 'Better to say "meet a deadline"' },
      { phrase: 'do a deadline', type: 'incorrect', note: 'Unnatural collocation in English' }
    ],
    translations: {
      telugu: 'గడువు తేదీ (Gadavu thedi)',
      hindi: 'अंतिम समय सीमा (Antim samay seema)',
      pronunciationTip: 'Stress on DED: DED-line'
    },
    relatedWords: ['schedule', 'timeline', 'milestone', 'deliverable'],
    usageGuidelines: {
      whereToUse: 'Workplace emails, team status meetings, college submissions, project plans',
      whoToUseWith: 'Managers, colleagues, clients, professors',
      commonMistake: 'Saying "I crossed the deadline" instead of "I missed the deadline".',
      correction: 'Use "miss a deadline" when you are late.'
    },
    isBookmarked: true,
    collections: ['My Office Words', 'My Interview Words'],
    masteryState: 'strong',
    recallStrength: 85,
    reviewCount: 4,
    lastReviewedDate: '2026-09-28',
    nextReviewDate: '2026-10-05'
  },
  {
    id: 'vw-collaborate',
    word: 'collaborate',
    pronunciation: {
      ipa: '/kəˈlæb.ə.reɪt/',
      audioGuide: 'kuh-LAB-uh-rate'
    },
    partOfSpeech: 'verb',
    meaning: 'To work jointly with others or together especially in an intellectual or business endeavor.',
    simpleMeaning: 'To work together with someone to achieve a common goal.',
    category: 'workplace',
    level: 'B1',
    formality: 'professional',
    examples: [
      {
        context: 'daily',
        sentence: 'My brother and I collaborated on organizing our parents’ anniversary party.'
      },
      {
        context: 'office',
        sentence: 'Our marketing team collaborated with the design agency to create the new logo.'
      },
      {
        context: 'professional',
        sentence: 'We look forward to collaborating closely with your enterprise security division.'
      }
    ],
    synonyms: [
      { word: 'cooperate', nuance: 'Willingness to assist, often in following rules', formality: 'formal' },
      { word: 'team up', nuance: 'Casual, conversational equivalent', formality: 'conversational' },
      { word: 'partner', nuance: 'Implies shared strategic ownership', formality: 'professional' }
    ],
    antonyms: [
      { word: 'compete', nuance: 'Opposing effort' },
      { word: 'work independently', nuance: 'Operating solo' }
    ],
    wordFamily: {
      noun: 'collaboration',
      verb: 'collaborate',
      adjective: 'collaborative',
      adverb: 'collaboratively'
    },
    collocations: [
      { phrase: 'collaborate with [someone]', type: 'natural', note: 'Standard preposition for persons/teams' },
      { phrase: 'collaborate on [a project]', type: 'natural', note: 'Standard preposition for topics/tasks' },
      { phrase: 'collaborate to [someone]', type: 'incorrect', note: 'Incorrect preposition' }
    ],
    translations: {
      telugu: 'కలిసి పనిచేయడం (Kalisi panicheyadam)',
      hindi: 'सहयोग करना (Sahayog karna)',
      pronunciationTip: 'Stress the second syllable: kuh-LAB-uh-rate'
    },
    relatedWords: ['teamwork', 'synergy', 'partnership', 'cross-functional'],
    usageGuidelines: {
      whereToUse: 'Resumes, job interviews, client proposals, project kickoff meetings',
      whoToUseWith: 'Hiring managers, cross-department teams, clients',
      commonMistake: 'Saying "collaborate together" (redundant, since collaborate already means work together).',
      correction: 'Simply say "We collaborated on the proposal".'
    },
    isBookmarked: false,
    collections: ['My Interview Words'],
    masteryState: 'familiar',
    recallStrength: 75,
    reviewCount: 3,
    lastReviewedDate: '2026-09-29',
    nextReviewDate: '2026-10-03'
  },
  {
    id: 'vw-resilient',
    word: 'resilient',
    pronunciation: {
      ipa: '/rɪˈzɪl.jənt/',
      audioGuide: 'rih-ZIL-yunt'
    },
    partOfSpeech: 'adjective',
    meaning: 'Able to withstand or recover quickly from difficult conditions, failures, or emotional stress.',
    simpleMeaning: 'Strong enough to bounce back after tough times.',
    category: 'professional',
    level: 'B2',
    formality: 'professional',
    examples: [
      {
        context: 'daily',
        sentence: 'Children are remarkably resilient and adapt quickly to new surroundings.'
      },
      {
        context: 'office',
        sentence: 'Our infrastructure proved resilient during the unexpected traffic surge.'
      },
      {
        context: 'professional',
        sentence: 'A resilient supply chain is critical to navigating international market fluctuations.'
      }
    ],
    synonyms: [
      { word: 'adaptable', nuance: 'Focuses on adjusting methods easily', formality: 'conversational' },
      { word: 'tenacious', nuance: 'Focuses on persistent stubborn refusal to give up', formality: 'formal' },
      { word: 'robust', nuance: 'Focuses on structural toughness in systems', formality: 'professional' }
    ],
    antonyms: [
      { word: 'fragile', nuance: 'Easily broken under pressure' },
      { word: 'vulnerable', nuance: 'Exposed to harm' }
    ],
    wordFamily: {
      noun: 'resilience',
      adjective: 'resilient',
      adverb: 'resiliently'
    },
    collocations: [
      { phrase: 'highly resilient', type: 'natural', note: 'Standard emphatic collocation' },
      { phrase: 'resilient architecture', type: 'natural', note: 'Common in engineering and computing' },
      { phrase: 'build resilience', type: 'natural', note: 'Personal and organizational development' }
    ],
    translations: {
      telugu: 'ఓర్పుగల / తట్టుకునే శక్తి గల (Oorpugala / Thattukune shakthi gala)',
      hindi: 'लचीला / विपत्ति से उबरने वाला (Lacheela / Vipatti se ubharne wala)'
    },
    relatedWords: ['grit', 'perseverance', 'endurance', 'adaptability'],
    usageGuidelines: {
      whereToUse: 'Performance appraisals, leadership speeches, psychological discussions, technical design',
      whoToUseWith: 'Executive leaders, colleagues, interviewers',
      commonMistake: 'Confusing "resilient" (adjective) with "resilience" (noun).',
      correction: 'Say "He showed great resilience" or "He is a resilient leader".'
    },
    isBookmarked: true,
    collections: ['Words I Keep Forgetting'],
    masteryState: 'practicing',
    recallStrength: 60,
    reviewCount: 2,
    lastReviewedDate: '2026-09-25',
    nextReviewDate: '2026-09-30'
  },
  {
    id: 'vw-clarify',
    word: 'clarify',
    pronunciation: {
      ipa: '/ˈklær.ɪ.faɪ/',
      audioGuide: 'KLAR-ih-fye'
    },
    partOfSpeech: 'verb',
    meaning: 'To make something clearer or easier to understand.',
    simpleMeaning: 'To explain clearly so there is no confusion.',
    category: 'workplace',
    level: 'B1',
    formality: 'professional',
    examples: [
      {
        context: 'office',
        sentence: 'Could you please clarify what you meant by the third requirement?'
      },
      {
        context: 'professional',
        sentence: 'Allow me to clarify our position regarding data ownership.'
      }
    ],
    synonyms: [
      { word: 'explain', nuance: 'More basic and conversational', formality: 'conversational' },
      { word: 'illuminate', nuance: 'Poetic or academic', formality: 'formal' },
      { word: 'elaborate on', nuance: 'Provide more detail rather than just clearing confusion', formality: 'professional' }
    ],
    wordFamily: {
      noun: 'clarification',
      verb: 'clarify',
      adjective: 'clear',
      adverb: 'clearly'
    },
    collocations: [
      { phrase: 'clarify a point', type: 'natural', note: 'Standard professional phrase' },
      { phrase: 'seek clarification', type: 'natural', note: 'Formal request for explanation' },
      { phrase: 'clarifyment', type: 'incorrect', note: 'Non-existent word; noun is "clarification"' }
    ],
    translations: {
      telugu: 'స్పష్టం చేయడం (Spashtam cheyadam)',
      hindi: 'स्पष्ट करना (Spasht karna)'
    },
    relatedWords: ['explain', 'demystify', 'disambiguate'],
    usageGuidelines: {
      whereToUse: 'Meetings when you did not understand a point, email exchanges, legal discussions',
      whoToUseWith: 'Clients, managers, colleagues',
      commonMistake: 'Saying "Please clear this doubt" (Indian English) instead of "Could you please clarify this point?" (Global English).',
      correction: '"Could you please clarify this?" is the global natural standard.'
    },
    isBookmarked: false,
    collections: ['My Office Words'],
    masteryState: 'mastered',
    recallStrength: 95,
    reviewCount: 5,
    lastReviewedDate: '2026-09-29',
    nextReviewDate: '2026-10-10'
  },

  // ==========================================
  // TECHNOLOGY & APPS
  // ==========================================
  {
    id: 'vw-prototype',
    word: 'prototype',
    pronunciation: {
      ipa: '/ˈproʊ.t̬ə.taɪp/',
      audioGuide: 'PROH-tuh-type'
    },
    partOfSpeech: 'noun',
    meaning: 'A first, typical or preliminary model of something from which other forms are developed.',
    simpleMeaning: 'An early sample or mock version of a product built to test ideas.',
    category: 'technology',
    level: 'B1',
    formality: 'professional',
    examples: [
      {
        context: 'office',
        sentence: 'We tested the interactive prototype with ten potential users yesterday.'
      },
      {
        context: 'professional',
        sentence: 'Developing a functional prototype will help validate our core assumptions before mass manufacturing.'
      }
    ],
    synonyms: [
      { word: 'mockup', nuance: 'Often visual or non-functional design model', formality: 'conversational' },
      { word: 'proof of concept (PoC)', nuance: 'Demonstrates theoretical feasibility', formality: 'professional' },
      { word: 'MVP (Minimum Viable Product)', nuance: 'Functional version released to real users', formality: 'professional' }
    ],
    wordFamily: {
      noun: 'prototype',
      verb: 'prototype',
      adjective: 'prototypical'
    },
    collocations: [
      { phrase: 'build a prototype', type: 'natural', note: 'Standard verb pairing' },
      { phrase: 'working prototype', type: 'natural', note: 'Functional early version' },
      { phrase: 'rapid prototyping', type: 'natural', note: 'Iterative design methodology' }
    ],
    translations: {
      telugu: 'నమూనా (Namoona)',
      hindi: 'मूलरूप / प्रोटोटाइप (Moolroop / Prototype)'
    },
    relatedWords: ['wireframe', 'iteration', 'usability', 'beta'],
    usageGuidelines: {
      whereToUse: 'Software engineering, design sprints, investor pitches, hardware engineering',
      whoToUseWith: 'Engineers, product managers, designers, founders',
      commonMistake: 'Treating a prototype as a final finished product.',
      correction: 'A prototype is an experiment to learn, not the finished release.'
    },
    isBookmarked: false,
    collections: [],
    masteryState: 'familiar',
    recallStrength: 70,
    reviewCount: 3,
    lastReviewedDate: '2026-09-27',
    nextReviewDate: '2026-10-04'
  },

  // ==========================================
  // EVERYDAY & TRAVEL
  // ==========================================
  {
    id: 'vw-itinerary',
    word: 'itinerary',
    pronunciation: {
      ipa: '/aɪˈtɪn.ə.rer.i/',
      audioGuide: 'eye-TIN-uh-rair-ee'
    },
    partOfSpeech: 'noun',
    meaning: 'A planned route or journey, including a detailed timetable and dates.',
    simpleMeaning: 'A travel plan with dates, times, and places you will visit.',
    category: 'travel',
    level: 'B1',
    formality: 'conversational',
    examples: [
      {
        context: 'daily',
        sentence: 'Have you printed our flight and hotel itinerary for the trip?'
      },
      {
        context: 'professional',
        sentence: 'The CEO’s travel itinerary includes visits to our Tokyo and Seoul offices.'
      }
    ],
    synonyms: [
      { word: 'travel plan', nuance: 'Simpler everyday phrase', formality: 'conversational' },
      { word: 'schedule', nuance: 'General timetable not limited to travel', formality: 'conversational' }
    ],
    wordFamily: {
      noun: 'itinerary'
    },
    collocations: [
      { phrase: 'detailed itinerary', type: 'natural', note: 'Comprehensive minute-by-minute plan' },
      { phrase: 'planned itinerary', type: 'natural', note: 'Confirmed trip schedule' }
    ],
    translations: {
      telugu: 'ప్రయాణ ప్రణాళిక (Prayana pranaalika)',
      hindi: 'यात्रा कार्यक्रम (Yatra karyakram)',
      pronunciationTip: 'Starts with "eye": eye-TIN-er-air-ee'
    },
    relatedWords: ['reservation', 'boarding pass', 'layover', 'destination'],
    usageGuidelines: {
      whereToUse: 'Vacation planning, business trips, hotel bookings, airport counters',
      whoToUseWith: 'Travel agents, hotel staff, travel partners',
      commonMistake: 'Mispronouncing as "iti-nerry".',
      correction: 'Pronounce the 4 syllables clearly: eye-TIN-uh-rair-ee.'
    },
    isBookmarked: true,
    collections: ['My Travel Words'],
    masteryState: 'familiar',
    recallStrength: 72,
    reviewCount: 2,
    lastReviewedDate: '2026-09-26',
    nextReviewDate: '2026-10-02'
  }
];

export const INITIAL_PERSONAL_COLLECTIONS = [
  {
    id: 'col-office',
    name: 'My Office Words',
    icon: 'Briefcase',
    description: 'High-frequency vocabulary for daily status meetings, emails, and presentations.',
    wordIds: ['vw-deadline', 'vw-collaborate', 'vw-clarify']
  },
  {
    id: 'col-interview',
    name: 'My Interview Words',
    icon: 'UserCheck',
    description: 'Powerful verbs and adjectives to describe achievements and leadership.',
    wordIds: ['vw-deadline', 'vw-collaborate', 'vw-resilient']
  },
  {
    id: 'col-travel',
    name: 'My Travel Words',
    icon: 'Plane',
    description: 'Essential words for airports, hotels, and navigating international transit.',
    wordIds: ['vw-itinerary']
  },
  {
    id: 'col-forgetting',
    name: 'Words I Keep Forgetting',
    icon: 'AlertCircle',
    description: 'Flagged for daily spaced-repetition drills until recall reaches 100%.',
    wordIds: ['vw-resilient']
  }
];
