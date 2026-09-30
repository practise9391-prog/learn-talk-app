import {
  DailyChallengeItem,
  GenericPracticeActivity,
  PracticeDifficulty,
  DomainContext,
} from '../types/practice';

export const TODAY_DAILY_CHALLENGE: DailyChallengeItem = {
  id: 'dc-today',
  date: new Date().toISOString().slice(0, 10),
  title: 'Speak About a Skill You Want to Improve',
  category: 'daily_challenge',
  topic: 'Personal Growth & Fluency',
  prompt: 'Speak for 60 seconds about an English or career skill you are currently working on. Explain why it is important to you and how you plan to master it.',
  targetDurationSeconds: 60,
  targetVocabulary: ['consistency', 'articulate', 'progress'],
  targetGrammar: 'Present Perfect or Future Continuous',
  difficulty: 'normal',
  xpReward: 100,
  completed: false,
};

export const ROTATING_DAILY_CHALLENGES: DailyChallengeItem[] = [
  TODAY_DAILY_CHALLENGE,
  {
    id: 'dc-2',
    date: 'Tomorrow',
    title: 'The Pros & Cons of Remote Working',
    category: 'debate',
    topic: 'Workplace Trends',
    prompt: 'Deliver 30 seconds of advantages followed by 30 seconds of disadvantages of working from home.',
    targetDurationSeconds: 60,
    targetVocabulary: ['flexibility', 'collaboration', 'productivity'],
    targetGrammar: 'Connectors: "On the other hand", "Furthermore"',
    difficulty: 'challenging',
    xpReward: 120,
    completed: false,
  },
  {
    id: 'dc-3',
    date: 'Day 3',
    title: 'Three-Word Spontaneous Story',
    category: 'three_word_story',
    topic: 'Creativity & Narrative',
    prompt: 'Construct a coherent short story in 60 seconds incorporating: Airport, Rain, and Friend.',
    targetDurationSeconds: 60,
    targetVocabulary: ['unexpectedly', 'delighted', 'reminisce'],
    targetGrammar: 'Simple Past & Past Continuous',
    difficulty: 'normal',
    xpReward: 90,
    completed: false,
  },
];

export const SPEAKING_ARENA_TOPICS: {
  id: string;
  category: DomainContext;
  title: string;
  prompt: string;
  difficulty: PracticeDifficulty;
  recommendedDuration: number;
  hints: {
    wordHint: string;
    sentenceStarter: string;
    sentenceStructure: string;
    exampleResponse: string;
  };
  brainFreeze: {
    suggestedWords: string[];
    suggestedStarters: string[];
    easierAlternativeQuestion: string;
    thoughtTranslations: {
      telugu?: string;
      hindi?: string;
      naturalEnglish: string;
    };
  };
}[] = [
  // Daily Life
  {
    id: 'topic-dl-1',
    category: 'daily_life',
    title: 'Describe Your Morning Routine',
    prompt: 'Walk through your typical morning from the moment your alarm rings until you start your first task of the day.',
    difficulty: 'easy',
    recommendedDuration: 60,
    hints: {
      wordHint: 'commute, freshen up, energetic',
      sentenceStarter: 'Usually, my day begins when my alarm rings at...',
      sentenceStructure: 'First I ___, and then I usually ___ before ___.',
      exampleResponse: 'Usually, I wake up at seven AM. First I drink a glass of warm water, wash my face, and brew a hot cup of coffee. After that, I spend twenty minutes reading the news before preparing for work.',
    },
    brainFreeze: {
      suggestedWords: ['wake up', 'breakfast', 'coffee', 'commute', 'prepare'],
      suggestedStarters: ['Every morning I...', 'The first thing I do is...', 'After waking up, I...'],
      easierAlternativeQuestion: 'What is the very first thing you do after waking up?',
      thoughtTranslations: {
        telugu: 'నేను ప్రతిరోజూ ఉదయం 7 గంటలకు లేస్తాను.',
        hindi: 'मैं हर सुबह 7 बजे उठता हूँ।',
        naturalEnglish: 'I usually wake up at 7 AM every morning.',
      },
    },
  },
  {
    id: 'topic-dl-2',
    category: 'daily_life',
    title: 'Your Favorite Way to Spend Weekends',
    prompt: 'Explain what activities recharge your energy over Saturday and Sunday.',
    difficulty: 'easy',
    recommendedDuration: 60,
    hints: {
      wordHint: 'unwind, rejuvenate, leisure',
      sentenceStarter: 'On weekends, I prefer spending time...',
      sentenceStructure: 'Whenever I have free time on Sunday, I love to ___ because ___.',
      exampleResponse: 'On weekends, I enjoy unwinding with friends or catching up on reading. Cooking a relaxed lunch on Sunday is one of my favorite ways to recharge for the coming week.',
    },
    brainFreeze: {
      suggestedWords: ['relax', 'friends', 'cooking', 'movies', 'recharge'],
      suggestedStarters: ['On Saturdays, I like to...', 'My ideal weekend involves...'],
      easierAlternativeQuestion: 'Do you prefer staying home or going out on weekends?',
      thoughtTranslations: {
        telugu: 'వారాంతాల్లో నేను స్నేహితులతో సమయం గడపడానికి ఇష్టపడతాను.',
        hindi: 'सप्ताहांत पर मुझे दोस्तों के साथ समय बिताना पसंद है।',
        naturalEnglish: 'On weekends, I enjoy spending quality time with my friends.',
      },
    },
  },

  // Workplace
  {
    id: 'topic-wp-1',
    category: 'workplace',
    title: 'Summarize Your Current Project & Role',
    prompt: 'Deliver a concise 60-second summary of what your current team or project is building, and your specific responsibilities.',
    difficulty: 'normal',
    recommendedDuration: 60,
    hints: {
      wordHint: 'collaborate, deliverable, milestone, optimize',
      sentenceStarter: 'Currently, I am working on a project focused on...',
      sentenceStructure: 'My primary role involves ___ in order to ensure ___.',
      exampleResponse: 'Currently, I am working as a software engineer on a customer portal project. My primary responsibility is building secure API endpoints and collaborating with our frontend team to optimize load speeds.',
    },
    brainFreeze: {
      suggestedWords: ['project', 'responsibilities', 'team', 'endpoints', 'deadline'],
      suggestedStarters: ['In my current role, I focus on...', 'Our team is developing...'],
      easierAlternativeQuestion: 'What is one main task you worked on this week?',
      thoughtTranslations: {
        telugu: 'ప్రస్తుతం నేను ఒక సాఫ్ట్‌వేర్ ప్రాజెక్ట్ మీద పనిచేస్తున్నాను.',
        hindi: 'वर्तमान में मैं एक सॉफ्टवेयर प्रोजेक्ट पर काम कर रहा हूँ।',
        naturalEnglish: 'Currently, I am contributing to a key software project.',
      },
    },
  },
  {
    id: 'topic-wp-2',
    category: 'workplace',
    title: 'How You Handle an Unexpected Deadline Shift',
    prompt: 'Describe a situation where a deadline was moved forward or requirements changed suddenly. How did you react?',
    difficulty: 'challenging',
    recommendedDuration: 90,
    hints: {
      wordHint: 'prioritize, stakeholder, clarify, bandwidth',
      sentenceStarter: 'Whenever a deadline shifts unexpectedly, the first step I take is...',
      sentenceStructure: 'Instead of panicking, I ___ by discussing with ___ to agree on ___.',
      exampleResponse: 'When deadlines shift unexpectedly, I immediately align with my manager to reprioritize high-impact deliverables. Clarifying what is essential prevents burnout and ensures quality delivery.',
    },
    brainFreeze: {
      suggestedWords: ['prioritize', 'manager', 'urgent', 'delivery', 'clarify'],
      suggestedStarters: ['When deadlines change, I usually...', 'I communicate early to...'],
      easierAlternativeQuestion: 'What do you do first when you have too much work?',
      thoughtTranslations: {
        telugu: 'డెడ్‌లైన్ మారినప్పుడు నేను ముఖ్యమైన పనులకు ప్రాధాన్యత ఇస్తాను.',
        hindi: 'जब समय सीमा बदलती है तो मैं सबसे महत्वपूर्ण कामों को प्राथमिकता देता हूँ।',
        naturalEnglish: 'When deadlines change, I prioritize the most critical deliverables first.',
      },
    },
  },

  // Professional / Career
  {
    id: 'topic-prof-1',
    category: 'professional',
    title: 'Tell Me About Yourself (Executive Pitch)',
    prompt: 'Deliver a structured 90-second professional self-introduction suitable for a hiring manager or executive interview.',
    difficulty: 'normal',
    recommendedDuration: 90,
    hints: {
      wordHint: 'track record, passionate, specialized, impact',
      sentenceStarter: 'I have spent the past several years developing expertise in...',
      sentenceStructure: 'Over the last ___ years, I have specialized in ___, where I recently achieved ___.',
      exampleResponse: 'Hello, my name is Pavan. Over the past few years, I have specialized in full-stack software development with a passion for high-performance applications. Recently, I led a database migration that improved query latency by 40%.',
    },
    brainFreeze: {
      suggestedWords: ['experience', 'specialized', 'passion', 'results', 'contribution'],
      suggestedStarters: ['My background is in...', 'I am passionate about...', 'Recently, I focused on...'],
      easierAlternativeQuestion: 'What is one major skill you are most confident in?',
      thoughtTranslations: {
        telugu: 'నా పేరు పవన్, నేను సాఫ్ట్‌వేర్ ఇంజనీర్‌గా పనిచేస్తున్నాను.',
        hindi: 'मेरा नाम पवन है और मैं एक सॉफ्टवेयर इंजीनियर के रूप में काम करता हूँ।',
        naturalEnglish: 'My name is Pavan, and I specialize in software engineering.',
      },
    },
  },

  // Abstract / Spontaneous
  {
    id: 'topic-abs-1',
    category: 'abstract',
    title: 'Will Artificial Intelligence Replace or Empower Professionals?',
    prompt: 'State your perspective on how generative AI is transforming career landscapes. Support with 2 reasons.',
    difficulty: 'advanced',
    recommendedDuration: 90,
    hints: {
      wordHint: 'automation, augment, adapt, critical thinking',
      sentenceStarter: 'In my perspective, AI will primarily empower rather than replace workers because...',
      sentenceStructure: 'While routine tasks may be automated, human skills like ___ will remain indispensable.',
      exampleResponse: 'In my perspective, AI will augment human productivity rather than outright replace professionals. While routine repetitive tasks will be automated, human creativity, empathy, and strategic judgment will become even more valuable.',
    },
    brainFreeze: {
      suggestedWords: ['productivity', 'future', 'tools', 'creativity', 'judgment'],
      suggestedStarters: ['I believe artificial intelligence...', 'The biggest advantage of AI is...'],
      easierAlternativeQuestion: 'Do you use AI tools in your daily work or studies?',
      thoughtTranslations: {
        telugu: 'AI మన పనిని సులభతరం చేస్తుందని నేను నమ్ముతున్నాను.',
        hindi: 'मेरा मानना है कि एआई हमारे काम को आसान और उत्पादक बनाता है।',
        naturalEnglish: 'I believe artificial intelligence serves as an empowering productivity tool.',
      },
    },
  },
];

export const WORD_ASSOCIATION_DATA = [
  {
    id: 'wa-travel',
    seedWord: 'TRAVEL',
    category: 'Travel & Exploration',
    expectedAssociations: ['airport', 'flight', 'ticket', 'hotel', 'luggage', 'passport', 'beach', 'mountain', 'vacation', 'explore', 'journey', 'tourist', 'reservation'],
  },
  {
    id: 'wa-career',
    seedWord: 'CAREER',
    category: 'Work & Growth',
    expectedAssociations: ['job', 'interview', 'promotion', 'salary', 'resume', 'skills', 'experience', 'manager', 'company', 'mentor', 'leadership', 'achievement'],
  },
  {
    id: 'wa-technology',
    seedWord: 'TECHNOLOGY',
    category: 'Innovation',
    expectedAssociations: ['computer', 'internet', 'software', 'mobile', 'coding', 'artificial intelligence', 'data', 'cloud', 'security', 'digital', 'algorithm', 'device'],
  },
];

export const THREE_WORD_STORIES = [
  {
    id: 'tws-1',
    words: ['Airport', 'Rain', 'Friend'],
    prompt: 'Weave these three unrelated words into an engaging 60-second spoken story.',
    suggestedStarter: 'It was pouring rain outside when I finally arrived at the airport...',
  },
  {
    id: 'tws-2',
    words: ['Coffee', 'Train', 'Meeting'],
    prompt: 'Create a short story connecting a hot coffee, a morning train, and an important meeting.',
    suggestedStarter: 'Holding my steaming coffee cup, I dashed toward the morning train...',
  },
  {
    id: 'tws-3',
    words: ['Key', 'Sunset', 'Decision'],
    prompt: 'Tell a narrative where a forgotten key and a beautiful sunset lead to a life decision.',
    suggestedStarter: 'As the golden sunset lit up the horizon, I realized I had misplaced the key...',
  },
];

export const PICTURE_DESCRIPTIONS = [
  {
    id: 'pic-airport',
    title: 'Bustling International Airport Terminal',
    sceneDescription: 'A vibrant international airport departure hall with passengers checking electronic flight boards, rolling suitcases, and walking toward boarding gates.',
    keywords: ['departure board', 'rolling luggage', 'passengers', 'security checkpoint', 'boarding gate', 'duty free'],
    guidingQuestions: [
      'What are the passengers doing right now?',
      'Where do you think they are traveling to?',
      'Describe the atmosphere and lighting in the terminal.',
    ],
  },
  {
    id: 'pic-office',
    title: 'Modern Agile Tech Workplace',
    sceneDescription: 'An open-plan office space where software engineers and product managers collaborate around a white board filled with sticky notes and laptop screens.',
    keywords: ['whiteboard', 'open workspace', 'collaboration', 'sticky notes', 'dual monitors', 'brainstorming'],
    guidingQuestions: [
      'What is the team discussing at the whiteboard?',
      'How would you describe their body language and engagement?',
      'What tools and gadgets are visible on their desks?',
    ],
  },
];

export const SENTENCE_BUILDER_ITEMS = [
  {
    id: 'sb-1',
    scrambledWords: ['yesterday', 'office', 'I', 'went', 'the', 'to'],
    correctSentence: 'I went to the office yesterday.',
    moreNaturalAlternative: 'Yesterday, I went to the office and met with my team.',
    explanation: 'Standard English word order: Subject (I) + Verb (went) + Prepositional phrase (to the office) + Time adverbial (yesterday).',
  },
  {
    id: 'sb-2',
    scrambledWords: ['discussed', 'we', 'client', 'the', 'requirements', 'with'],
    correctSentence: 'We discussed requirements with the client.',
    moreNaturalAlternative: 'We thoroughly discussed the project requirements with the client.',
    explanation: 'Notice that "discuss" does not take "about". It connects directly to the object "requirements".',
  },
  {
    id: 'sb-3',
    scrambledWords: ['would', 'I', 'like', 'a', 'please', 'tea', 'cup', 'of'],
    correctSentence: 'I would like a cup of tea please.',
    moreNaturalAlternative: "I'd like a hot cup of ginger tea, please.",
    explanation: 'Polite service request pattern: "I would like..." rather than "I want...".',
  },
];

export const SENTENCE_TRANSFORMATION_ITEMS = [
  {
    id: 'st-1',
    baseSentence: 'I work at an IT company.',
    instructions: [
      { step: 'negative', prompt: 'Make it negative', answer: "I don't work at an IT company." },
      { step: 'question', prompt: 'Make it a question', answer: 'Do you work at an IT company?' },
      { step: 'past', prompt: 'Make it past tense', answer: 'I worked at an IT company.' },
      { step: 'continuous', prompt: 'Make it present continuous', answer: 'I am working at an IT company.' },
    ],
  },
  {
    id: 'st-2',
    baseSentence: 'She drinks black coffee.',
    instructions: [
      { step: 'negative', prompt: 'Make it negative', answer: "She doesn't drink black coffee." },
      { step: 'question', prompt: 'Make it a question', answer: 'Does she drink black coffee?' },
      { step: 'past', prompt: 'Make it past tense', answer: 'She drank black coffee.' },
    ],
  },
];

export const ERROR_DETECTIVE_ITEMS = [
  {
    id: 'ed-1',
    erroneousSentence: 'She go to college every day by bus.',
    incorrectWord: 'go',
    correctWord: 'goes',
    fullCorrectSentence: 'She goes to college every day by bus.',
    explanation: 'Third-person singular subjects (he, she, it) require the verb to take -s or -es in the simple present tense.',
    category: 'Subject-Verb Agreement',
  },
  {
    id: 'ed-2',
    erroneousSentence: 'We must discuss about the new budget proposal.',
    incorrectWord: 'about',
    correctWord: '',
    fullCorrectSentence: 'We must discuss the new budget proposal.',
    explanation: 'The verb "discuss" is transitive. Adding "about" is redundant.',
    category: 'Preposition Redundancy',
  },
  {
    id: 'ed-3',
    erroneousSentence: 'I am knowing the correct solution to this problem.',
    incorrectWord: 'am knowing',
    correctWord: 'know',
    fullCorrectSentence: 'I know the correct solution to this problem.',
    explanation: '"Know" is a stative verb expressing a state of cognition. It is not used in continuous (-ing) tenses.',
    category: 'Stative Verbs',
  },
];

export const NATURAL_OR_NOT_ITEMS = [
  {
    id: 'non-1',
    optionA: {
      text: 'I am having a doubt regarding the sprint timeline.',
      isNatural: false,
      nuance: 'Common Indian English expression, but considered confusing or awkward in international business English.',
    },
    optionB: {
      text: 'I have a question regarding the sprint timeline.',
      isNatural: true,
      nuance: 'Standard, universally understood professional expression.',
    },
    context: 'Workplace Team Meeting',
    explanation: 'In international English, use "I have a question" or "I would like some clarification" instead of "I have a doubt".',
  },
  {
    id: 'non-2',
    optionA: {
      text: 'Revert back to me as soon as possible.',
      isNatural: false,
      nuance: '"Revert" already implies returning to a former state. "Revert back" is redundant.',
    },
    optionB: {
      text: 'Please get back to me as soon as possible.',
      isNatural: true,
      nuance: 'Natural phrasal verb universally used in corporate email and speech.',
    },
    context: 'Email & Chat Follow-up',
    explanation: 'Use "get back to me" or "reply to me" rather than "revert back".',
  },
];

export const FORMAL_VS_CASUAL_ITEMS = [
  {
    id: 'fvc-1',
    casualVersion: 'Can you help me with this?',
    professionalVersion: 'Could you please assist me with this when you have a moment?',
    targetAudience: 'Senior Manager / Client',
    tip: 'Using "could" instead of "can" and adding "when you have a moment" softens the demand into a respectful request.',
  },
  {
    id: 'fvc-2',
    casualVersion: 'I cannot come to the meeting today.',
    professionalVersion: 'Unfortunately, I will be unable to attend today’s meeting due to a conflicting commitment.',
    targetAudience: 'Project Stakeholders',
    tip: '"Unfortunately, I will be unable to attend" sounds professional and polite.',
  },
];

export const PRONUNCIATION_MINIMAL_PAIRS = [
  {
    id: 'pmp-1',
    pairName: '/ɪ/ vs /iː/ (Short vs Long E)',
    wordA: { word: 'Ship', ipa: '/ʃɪp/', audioText: 'The big ship left the harbor.' },
    wordB: { word: 'Sheep', ipa: '/ʃiːp/', audioText: 'The white sheep grazed on the hill.' },
    mouthPositionTip: 'For "ship", keep your tongue relaxed and slightly lowered. For "sheep", stretch your lips into a smile and lengthen the vowel sound.',
  },
  {
    id: 'pmp-2',
    pairName: '/e/ vs /æ/ (Short E vs Short A)',
    wordA: { word: 'Bed', ipa: '/bed/', audioText: 'I went to bed early.' },
    wordB: { word: 'Bad', ipa: '/bæd/', audioText: 'That was a bad mistake.' },
    mouthPositionTip: 'For "bad", drop your jaw wider and flatten the tongue more than for "bed".',
  },
];

export const SHADOWING_EXERCISES = [
  {
    id: 'shad-1',
    title: 'Giving a Smooth Workplace Status Update',
    sentence: 'Good morning everyone, yesterday I completed the database indexing, and today I am working on security testing.',
    audioSpeedOptions: [0.8, 1.0, 1.2],
    keyStressWords: ['Good morning', 'database indexing', 'security testing'],
  },
  {
    id: 'shad-2',
    title: 'Ordering Politely at a Cafe',
    sentence: "Hi there, I'd like a hot cappuccino with oat milk, and could you please make it extra hot?",
    audioSpeedOptions: [0.8, 1.0, 1.2],
    keyStressWords: ['hot cappuccino', 'oat milk', 'extra hot'],
  },
];
