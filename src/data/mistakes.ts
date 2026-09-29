import { Mistake } from '../types';

export const SAMPLE_MISTAKES: Mistake[] = [
  {
    id: 'm-1',
    userId: 'u-current',
    category: 'Article usage',
    originalText: 'I went to restaurant yesterday.',
    correctedText: 'I went to a restaurant yesterday.',
    whyExplanation: "Use 'a' because 'restaurant' is a singular countable noun and this is the first time you are mentioning it in the conversation.",
    contextUsage: 'Everyday past narrative / General dining out',
    exampleSentence: 'We decided to try a new Indian restaurant downtown.',
    timestamp: '2 hours ago',
    repeatedCount: 2,
    resolved: false
  },
  {
    id: 'm-2',
    userId: 'u-current',
    category: 'Naturalness',
    originalText: 'I want one tea.',
    correctedText: "I'd like a cup of tea, please.",
    whyExplanation: "'I want' can sound blunt or like a demand in English service situations. 'I'd like...' (I would like) softens the request and sounds polite and native.",
    contextUsage: 'Ordering food, beverages, and service requests',
    exampleSentence: "I'd like a hot cappuccino with oat milk, please.",
    timestamp: 'Yesterday',
    repeatedCount: 3,
    resolved: false
  },
  {
    id: 'm-3',
    userId: 'u-current',
    category: 'Preposition',
    originalText: 'I discussed about the project with my manager.',
    correctedText: 'I discussed the project with my manager.',
    whyExplanation: "The verb 'discuss' already means 'to talk about'. Adding 'about' after 'discuss' is a common redundancy caused by literal native language translation.",
    contextUsage: 'Workplace updates, meetings, and business communication',
    exampleSentence: 'Let us discuss the quarterly budget at 3 PM.',
    timestamp: '2 days ago',
    repeatedCount: 1,
    resolved: true
  },
  {
    id: 'm-4',
    userId: 'u-current',
    category: 'Tense',
    originalText: 'I am knowing the answer.',
    correctedText: 'I know the answer.',
    whyExplanation: "'Know' is a stative verb expressing a state of mind rather than a physical activity. Stative verbs are rarely used in continuous (-ing) tenses.",
    contextUsage: 'Expressing knowledge, belief, or understanding',
    exampleSentence: 'Do you know when the flight is scheduled to arrive?',
    timestamp: '3 days ago',
    repeatedCount: 1,
    resolved: true
  },
  {
    id: 'm-5',
    userId: 'u-current',
    category: 'Subject-verb agreement',
    originalText: 'Everyone have submitted their reports.',
    correctedText: 'Everyone has submitted their report.',
    whyExplanation: "Indefinite pronouns such as 'everyone', 'everybody', 'someone', and 'anybody' are grammatically singular in English and require the singular verb 'has'.",
    contextUsage: 'Corporate reporting and group coordination',
    exampleSentence: 'Everyone has an equal opportunity to speak.',
    timestamp: '4 days ago',
    repeatedCount: 2,
    resolved: false
  }
];

export const NATURAL_ENGLISH_COMPARISONS = [
  {
    scenario: "Ordering tea in a shop",
    grammaticallyCorrect: "I want to have tea.",
    natural: "I'd like some tea.",
    casual: "I'll grab a chai.",
    professionalPolite: "Could I have a cup of tea, please?",
    contextNote: "Use 'Could I have...' in cafes or hotels; use 'I'll grab...' with close colleagues or street stalls."
  },
  {
    scenario: "Asking for a colleague's time",
    grammaticallyCorrect: "Do you have time now?",
    natural: "Got a quick minute?",
    casual: "Hey, free right now?",
    professionalPolite: "Do you have a few minutes to connect regarding the update?",
    contextNote: "'Got a quick minute?' strikes the ideal balance between warmth and efficiency."
  },
  {
    scenario: "Disagreeing in a discussion",
    grammaticallyCorrect: "You are wrong.",
    natural: "I see it a bit differently.",
    casual: "I'm not so sure about that.",
    professionalPolite: "I understand your point, but from another perspective...",
    contextNote: "Direct disagreement can shut down conversation; softer framing fosters collaboration."
  }
];
