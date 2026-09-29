import { LearningLevel, Unit } from '../types';

export const LEARNING_LEVELS: LearningLevel[] = [
  {
    id: 'A1',
    name: 'A1',
    label: 'Beginner',
    description: 'Build foundational vocabulary, introduce yourself, order food, and express simple daily needs.',
    targetCompetency: 'Can understand and use familiar everyday expressions and basic phrases aimed at the satisfaction of concrete needs.',
    unitsCount: 10,
    completedUnitsCount: 4,
    status: 'current',
    order: 1,
  },
  {
    id: 'A2',
    name: 'A2',
    label: 'Elementary',
    description: 'Describe your routine, talk about past experiences, shop, travel, and navigate everyday social situations.',
    targetCompetency: 'Can communicate in simple and routine tasks requiring a simple and direct exchange of information on familiar topics.',
    unitsCount: 12,
    completedUnitsCount: 0,
    status: 'locked',
    order: 2,
  },
  {
    id: 'B1',
    name: 'B1',
    label: 'Intermediate',
    description: 'Express opinions, narrate stories, handle workplace conversations, and communicate spontaneously.',
    targetCompetency: 'Can deal with most situations likely to arise whilst travelling and enter unprepared into conversation on familiar topics.',
    unitsCount: 14,
    completedUnitsCount: 0,
    status: 'locked',
    order: 3,
  },
  {
    id: 'B2',
    name: 'B2',
    label: 'Upper Intermediate',
    description: 'Lead discussions, participate in job interviews, present ideas clearly, and converse naturally with native speakers.',
    targetCompetency: 'Can interact with a degree of fluency and spontaneity that makes regular interaction with native speakers quite possible.',
    unitsCount: 16,
    completedUnitsCount: 0,
    status: 'locked',
    order: 4,
  },
  {
    id: 'C1',
    name: 'C1',
    label: 'Advanced',
    description: 'Master professional communication, debate complex issues, articulate nuanced thoughts, and express humor naturally.',
    targetCompetency: 'Can express ideas fluently and spontaneously without much obvious searching for expressions.',
    unitsCount: 16,
    completedUnitsCount: 0,
    status: 'locked',
    order: 5,
  },
  {
    id: 'C2',
    name: 'C2',
    label: 'Mastery / Fluency',
    description: 'Spontaneous, precise speaking on sophisticated themes with native-like idiomatic confidence.',
    targetCompetency: 'Can express oneself spontaneously, very fluently and precisely, differentiating finer shades of meaning.',
    unitsCount: 12,
    completedUnitsCount: 0,
    status: 'locked',
    order: 6,
  },
];

export const INITIAL_UNITS: Unit[] = [
  {
    id: 'u-1',
    levelId: 'A1',
    unitNumber: 1,
    title: 'First Impressions & Greetings',
    subtitle: 'Saying hello, introducing yourself and polite small talk',
    description: 'Master how to greet people naturally in morning, afternoon, and evening contexts without hesitation.',
    status: 'completed',
    icon: '👋',
    lessons: [
      {
        id: 'l-1',
        unitId: 'u-1',
        title: 'Natural Greetings & Time of Day',
        category: 'speaking',
        estimatedMinutes: 8,
        completed: true,
        active: false,
        conceptSummary: 'Learn the difference between formal "Good morning" and casual "Hey there / How is it going?".',
        keyPhrases: ['Good morning', "How are you doing?", 'Nice to meet you', 'Have a great day'],
        steps: { learn: true, see: true, listen: true, repeat: true, practice: true, speak: true, converse: true, correct: true, review: true }
      },
      {
        id: 'l-2',
        unitId: 'u-1',
        title: 'Introducing Yourself & Your Background',
        category: 'conversation',
        estimatedMinutes: 10,
        completed: true,
        active: false,
        conceptSummary: 'Sharing your name, city, and what you do without feeling awkward.',
        keyPhrases: ["I'm from...", 'I work as a...', 'Pleased to meet you'],
        steps: { learn: true, see: true, listen: true, repeat: true, practice: true, speak: true, converse: true, correct: true, review: true }
      }
    ]
  },
  {
    id: 'u-2',
    levelId: 'A1',
    unitNumber: 2,
    title: 'Ordering Food & Drinks',
    subtitle: 'Tea shops, cafes, and street food interactions',
    description: 'Transition from "I want" to polite, natural phrasing like "I\'d like..." and "Could I get...".',
    status: 'completed',
    icon: '☕',
    lessons: [
      {
        id: 'l-3',
        unitId: 'u-2',
        title: 'Polite Requests vs Demands',
        category: 'grammar',
        estimatedMinutes: 10,
        completed: true,
        active: false,
        conceptSummary: 'Use modal phrases "I\'d like" and "Could I have" instead of literal native translation "I want".',
        keyPhrases: ["I'd like a hot chai, please", 'Could I get the bill?', 'How much is this?'],
        steps: { learn: true, see: true, listen: true, repeat: true, practice: true, speak: true, converse: true, correct: true, review: true }
      },
      {
        id: 'l-4',
        unitId: 'u-2',
        title: 'Customizing Orders & Asking Prices',
        category: 'speaking',
        estimatedMinutes: 12,
        completed: true,
        active: false,
        conceptSummary: 'Asking for less sugar, extra napkins, and checking payment options comfortably.',
        keyPhrases: ['With less sugar please', 'Do you take UPI or card?', 'Can I get it to go?'],
        steps: { learn: true, see: true, listen: true, repeat: true, practice: true, speak: true, converse: true, correct: true, review: true }
      }
    ]
  },
  {
    id: 'u-3',
    levelId: 'A1',
    unitNumber: 3,
    title: 'Daily Routine & Present Simple',
    subtitle: 'Talking About My Daily Routine',
    description: 'Construct effortless sentences describing what you do every day from waking up to going to bed.',
    status: 'active',
    icon: '⏰',
    lessons: [
      {
        id: 'l-5',
        unitId: 'u-3',
        title: 'Action Verbs for Morning Routines',
        category: 'vocabulary',
        estimatedMinutes: 8,
        completed: true,
        active: false,
        conceptSummary: 'Wake up vs get up, brush, shower, have breakfast, commute.',
        keyPhrases: ['I usually wake up around 7 AM', 'I grab a quick coffee', 'I head to office'],
        steps: { learn: true, see: true, listen: true, repeat: true, practice: true, speak: true, converse: false, correct: false, review: false }
      },
      {
        id: 'l-6',
        unitId: 'u-3',
        title: 'Talking About My Daily Routine (Today)',
        category: 'speaking',
        estimatedMinutes: 12,
        completed: false,
        active: true,
        conceptSummary: 'Subject + Verb + Object structure with time prepositions (at 8, in the morning, on weekdays).',
        keyPhrases: ['Every morning I...', 'After work I like to...', 'On weekends I relax with my family'],
        steps: { learn: true, see: true, listen: true, repeat: true, practice: false, speak: false, converse: false, correct: false, review: false }
      },
      {
        id: 'l-7',
        unitId: 'u-3',
        title: 'Asking Others About Their Day',
        category: 'conversation',
        estimatedMinutes: 10,
        completed: false,
        active: false,
        conceptSummary: 'Forming natural questions with Do/Does without mixing up third-person singular.',
        keyPhrases: ['What time do you start?', 'How do you commute?', 'What do you do after work?'],
        steps: { learn: false, see: false, listen: false, repeat: false, practice: false, speak: false, converse: false, correct: false, review: false }
      }
    ]
  },
  {
    id: 'u-4',
    levelId: 'A1',
    unitNumber: 4,
    title: 'Directions & Getting Around',
    subtitle: 'Asking for places, taxi rides, and landmarks',
    description: 'Never feel lost. Learn how to ask where things are and give clear instructions to drivers.',
    status: 'locked',
    icon: '🧭',
    lessons: [
      {
        id: 'l-8',
        unitId: 'u-4',
        title: 'Excuse Me, Where Is The...',
        category: 'speaking',
        estimatedMinutes: 10,
        completed: false,
        active: false,
        conceptSummary: 'Polite attention-getters and directional prepositions (next to, opposite, straight ahead).',
        keyPhrases: ['Excuse me, is there an ATM nearby?', 'Go straight and turn left at the signal'],
        steps: { learn: false, see: false, listen: false, repeat: false, practice: false, speak: false, converse: false, correct: false, review: false }
      }
    ]
  },
  {
    id: 'u-5',
    levelId: 'A1',
    unitNumber: 5,
    title: 'Shopping & Bargaining Naturally',
    subtitle: 'Supermarkets, clothing stores, and sizes',
    description: 'Inquire about prices, colors, sizes, and returns with confidence.',
    status: 'locked',
    icon: '🛍️',
    lessons: []
  }
];
