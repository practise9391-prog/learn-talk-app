import { TestDefinition, TestQuestion, TestType } from '../types/test';

export const ALL_TEST_DEFINITIONS: TestDefinition[] = [
  {
    id: 'test-quick-speaking',
    type: 'quick_speaking',
    category: 'speaking_challenge',
    title: 'Quick Speaking Test',
    subtitle: 'Adaptive 3-prompt spoken fluency & coherence checkpoint',
    description: 'Answer 3 natural speaking prompts tailored to your current level. Get instant multi-metric feedback on your speaking continuity, grammar, and vocabulary range.',
    durationMinutes: 3,
    questionsCount: 3,
    primarySkill: 'speaking',
    level: 'B1',
    iconName: 'Mic',
    badge: '2–5 Mins',
    instructions: [
      'You will be given 3 speaking prompts sequentially.',
      'Spend 45–60 seconds responding naturally to each prompt.',
      'Focus on speaking smoothly with complete thoughts rather than rushing.',
      'Instant speech-to-text transcript and AI evaluation will follow.'
    ],
    evaluationCriteria: [
      'Relevance and directness of answer',
      'Sentence structure and grammatical accuracy',
      'Vocabulary variety and idiomatic collocations',
      'Pacing and natural pause distribution'
    ],
    allowRetake: true
  },
  {
    id: 'test-level-assessment',
    type: 'level_assessment',
    category: 'structured',
    title: 'English Level Assessment',
    subtitle: 'Comprehensive multi-skill diagnostic (A1 through C1)',
    description: 'Examines Grammar → Vocabulary → Listening → Speaking → Pronunciation → Conversation across progressive difficulty stages to generate your holistic CEFR profile.',
    durationMinutes: 12,
    questionsCount: 12,
    primarySkill: 'speaking',
    level: 'B1',
    iconName: 'Award',
    badge: 'Full Diagnostic',
    instructions: [
      'Progress through all 6 skill domains in sequence.',
      'Questions automatically adapt up or down based on your answers.',
      'No single question decides your level; scores represent holistic demonstrated performance.',
      'Provides a comprehensive breakdown of your verified competencies.'
    ],
    evaluationCriteria: [
      'Grammatical accuracy across simple and complex clauses',
      'Lexical precision in professional and daily contexts',
      'Listening comprehension for gist and specific details',
      'Spoken pronunciation intelligibility and word stress'
    ],
    allowRetake: true
  },
  {
    id: 'test-placement',
    type: 'placement',
    category: 'structured',
    title: 'Find My Level (Placement)',
    subtitle: 'Short diagnostic for new learners to calibrate curriculum',
    description: 'This short assessment helps personalize your learning path and assigns your baseline practice metrics without permanently locking your level.',
    durationMinutes: 8,
    questionsCount: 8,
    primarySkill: 'speaking',
    level: 'A2',
    iconName: 'Compass',
    badge: 'Personalization',
    instructions: [
      'Answer quick questions covering grammar, vocabulary, listening, and speaking.',
      'Helps recommend the ideal starting unit in your curriculum journey.',
      'Zero pressure: you can adjust or test out of any level at any time.'
    ],
    evaluationCriteria: [
      'Baseline CEFR alignment across core communication skills',
      'Vocabulary size and recognition of high-frequency words'
    ],
    allowRetake: true
  },
  {
    id: 'test-random-object-pitch',
    type: 'random_object_pitch',
    category: 'speaking_challenge',
    title: 'Random Object Pitch',
    subtitle: '60-second impromptu persuasion & sales challenge',
    description: 'Receive a surprise everyday object (e.g. Water Bottle, Smart Watch). Pitch it to the AI as if you are selling it, using features, benefits, and an irresistible call-to-action.',
    durationMinutes: 1,
    questionsCount: 1,
    primarySkill: 'professional',
    level: 'B1',
    iconName: 'Sparkles',
    badge: '60s Pitch',
    instructions: [
      'An everyday object will be revealed at the start.',
      'Speak for up to 60 seconds with enthusiasm and persuasion.',
      'Suggested flow: Introduction → Key Features → Practical Benefits → Why Someone Should Use It → Closing.',
      'Do not worry about sticking rigidly to the formula; natural flow is prioritized!'
    ],
    evaluationCriteria: [
      'Persuasive vocabulary and descriptive adjectives',
      'Fluency and speaking continuity',
      'Logical flow from problem to benefit to call to action',
      'Clarity and vocal enthusiasm'
    ],
    allowRetake: true
  },
  {
    id: 'test-no-fillers',
    type: 'no_fillers',
    category: 'speaking_challenge',
    title: 'No Fillers Challenge',
    subtitle: '60-second clean speech & pause mastery challenge',
    description: 'Speak continuously on a selected topic while minimizing unnecessary filler words like "um", "uh", "like", "basically", "actually", and "you know".',
    durationMinutes: 1,
    questionsCount: 1,
    primarySkill: 'fluency',
    level: 'B1',
    iconName: 'Zap',
    badge: '60s Clean',
    instructions: [
      'Speak continuously for 60 seconds on the assigned topic.',
      'When you need a moment to think, replace filler words with a confident silent pause.',
      'The AI detects filler frequencies without penalizing natural conversational rhythm.'
    ],
    evaluationCriteria: [
      'Filler ratio percentage relative to total spoken word count',
      'Effective use of short silent pauses instead of verbal placeholders',
      'Sentence completion and syntactic coherence'
    ],
    allowRetake: true
  },
  {
    id: 'test-pros-cons-debate',
    type: 'pros_cons_debate',
    category: 'speaking_challenge',
    title: 'Pros & Cons Debate',
    subtitle: 'Structured 30s For + 30s Against argumentative challenge',
    description: 'Defend both sides of a balanced topic (30 seconds arguing in favor, 30 seconds arguing in opposition) using clear connectors and transitions.',
    durationMinutes: 2,
    questionsCount: 1,
    primarySkill: 'conversation',
    level: 'B2',
    iconName: 'Scale',
    badge: 'Dual 30s',
    instructions: [
      'Phase 1 (30s): Present reasons and examples FOR the prompt.',
      'Phase 2 (30s): Smoothly transition to arguments AGAINST the prompt.',
      'Utilize connectors like "First...", "One advantage is...", "On the other hand...", "In contrast...".',
      'Scores reflect communication quality and balance, not your personal belief.'
    ],
    evaluationCriteria: [
      'Clarity of arguments and supporting points',
      'Quality of transition connectors (However, On the other hand, In contrast)',
      'Grammar variety and sentence complexity',
      'Speaking rhythm across both debate phases'
    ],
    allowRetake: true
  },
  {
    id: 'test-word-association',
    type: 'word_association',
    category: 'speaking_challenge',
    title: 'Word Association Chain',
    subtitle: '60-second rapid lexical recall & vocabulary chain',
    description: 'Start with a seed word (e.g. "Travel") and continuously speak related words and concepts without pausing or repeating previous words.',
    durationMinutes: 1,
    questionsCount: 1,
    primarySkill: 'vocabulary',
    level: 'A2',
    iconName: 'Link',
    badge: '60s Chain',
    instructions: [
      'Say words related to the current concept in quick succession.',
      'Keep the chain moving: Travel → Airport → Flight → Holiday → Beach → Ocean...',
      'Avoid long hesitations (> 3 seconds) or repeating previously spoken terms.'
    ],
    evaluationCriteria: [
      'Total valid related vocabulary words generated',
      'Response velocity and hesitation minimisation',
      'Semantic diversity and avoidance of direct duplicates'
    ],
    allowRetake: true
  },
  {
    id: 'test-three-word-story',
    type: 'three_word_story',
    category: 'speaking_challenge',
    title: 'Three-Word Story',
    subtitle: 'Impromptu narrative connecting 3 unrelated concepts',
    description: 'We give you three random words (e.g. "Train", "Coffee", "Rain"). Weave a compelling 60-second short story that naturally weaves in all three.',
    durationMinutes: 1,
    questionsCount: 1,
    primarySkill: 'speaking',
    level: 'B1',
    iconName: 'BookMarked',
    badge: 'Storytelling',
    instructions: [
      'Check the 3 displayed target words before speaking.',
      'Tell a creative story that organically incorporates all three words.',
      'The AI evaluates language coherence and grammar, not literary perfection!'
    ],
    evaluationCriteria: [
      'Integration of all 3 required words in correct grammatical context',
      'Narrative coherence and sequential connectors (suddenly, meanwhile, finally)',
      'Descriptive adjectives and past tense consistency'
    ],
    allowRetake: true
  },
  {
    id: 'test-picture-description',
    type: 'picture_description',
    category: 'speaking_challenge',
    title: 'Picture Description',
    subtitle: 'Visual scene description using present continuous & locations',
    description: 'Examine a rich illustrated scene (such as an Airport Departure Gate or Busy Cafe) and describe everything you observe with spatial prepositions.',
    durationMinutes: 2,
    questionsCount: 1,
    primarySkill: 'speaking',
    level: 'A2',
    iconName: 'Image',
    badge: 'Visual Task',
    instructions: [
      'Look closely at the scene details, people, actions, and objects.',
      'Use present continuous ("A traveler is rolling her suitcase...") and location phrases ("In the foreground...", "Near the counter...").',
      'Speak for 60–90 seconds describing both foreground and background elements.'
    ],
    evaluationCriteria: [
      'Accuracy of present continuous tense for actions',
      'Spatial prepositions (in front of, next to, in the background, between)',
      'Descriptive vocabulary richness',
      'Overall clarity and observation depth'
    ],
    allowRetake: true
  },
  {
    id: 'test-jam',
    type: 'jam',
    category: 'speaking_challenge',
    title: 'JAM — Just A Minute',
    subtitle: '60-second structured public speaking benchmark',
    description: 'Deliver a concise 1-minute speech on a surprise thought-provoking topic with three structured checkpoints: Introduction (0-15s), Main Idea (15-45s), and Conclusion (45-60s).',
    durationMinutes: 1,
    questionsCount: 1,
    primarySkill: 'fluency',
    level: 'B1',
    iconName: 'Clock',
    badge: '1 Min Speech',
    instructions: [
      'Read your topic and mentally outline your 3 speech segments.',
      '0–15s: Opening hook and topic introduction.',
      '15–45s: Core explanation, personal example, or supporting argument.',
      '45–60s: Memorable summary and concluding insight.',
      'The visual timer guides your pace gently without abrupt cutoff.'
    ],
    evaluationCriteria: [
      'Speech structure alignment across the 3 timed segments',
      'Continuity of ideas and natural transitions',
      'Fluency rate and confident vocal presence'
    ],
    allowRetake: true
  },
  {
    id: 'test-shadowing',
    type: 'shadowing',
    category: 'structured',
    title: 'Shadowing & Pronunciation Test',
    subtitle: 'Listen → Shadow → Record → Compare → Analyze',
    description: 'Listen to an authentic native audio passage, shadow the cadence, record your own version, and review AI acoustic feedback on word stress, rhythm, and clarity.',
    durationMinutes: 3,
    questionsCount: 2,
    primarySkill: 'pronunciation',
    level: 'B1',
    iconName: 'Headphones',
    badge: 'Echo Practice',
    instructions: [
      'Step 1 (Listen): Play the native speaker recording to hear rhythm and stress.',
      'Step 2 (Shadow): Speak along with the audio quietly.',
      'Step 3 (Record): Record your spoken attempt when ready.',
      'Step 4 (Compare): Receive instant feedback on syllables, stress, and pace.'
    ],
    evaluationCriteria: [
      'Syllable and sentence-level stress distribution',
      'Intonation contours in questions and declarative sentences',
      'Pacing (optimal 110–140 words per minute for clear communication)'
    ],
    allowRetake: true
  },
  {
    id: 'test-listening',
    type: 'listening',
    category: 'structured',
    title: 'Listening Test',
    subtitle: 'Audio comprehension spanning detail, gist & inference',
    description: 'Listen to dialogues, announcements, and short lectures. Answer multiple-choice, true/false, and gap-fill questions with gradual difficulty progression.',
    durationMinutes: 5,
    questionsCount: 5,
    primarySkill: 'listening',
    level: 'B1',
    iconName: 'Volume2',
    badge: 'Gradual Audio',
    instructions: [
      'Listen carefully to each audio excerpt (you may replay once).',
      'Answer questions targeting main ideas, specific factual details, or inferred speaker attitudes.',
      'Difficulty increases naturally as you advance through the test.'
    ],
    evaluationCriteria: [
      'Accurate identification of primary conversational gist',
      'Precision in extracting numerical, time, and name details',
      'Ability to infer tone and underlying speaker intent'
    ],
    allowRetake: true
  },
  {
    id: 'test-grammar',
    type: 'grammar',
    category: 'structured',
    title: 'Grammar Test',
    subtitle: 'Targeted assessment of tenses, articles & structures',
    description: 'Diagnose your grammatical strengths across multiple choice, sentence transformation, error correction, and situational usage with clear explanations for every item.',
    durationMinutes: 5,
    questionsCount: 6,
    primarySkill: 'grammar',
    level: 'B1',
    iconName: 'BookOpen',
    badge: 'Diagnostic',
    instructions: [
      'Select or type the grammatically sound answer for each prompt.',
      'Review why alternative choices are incorrect or unnatural.',
      'Items cover verb tenses, conditionals, prepositions, and article nuances.'
    ],
    evaluationCriteria: [
      'Correct tense selection in past, continuous, and perfect aspects',
      'Accurate prepositional pairings (e.g. depend on, arrive at)',
      'Subject-verb agreement in complex sentences'
    ],
    allowRetake: true
  },
  {
    id: 'test-vocabulary',
    type: 'vocabulary',
    category: 'structured',
    title: 'Vocabulary Test',
    subtitle: 'Collocations, synonyms, word families & contextual usage',
    description: 'Assess lexical breadth and nuance through sentence completions, collocations, and register-appropriate word choice.',
    durationMinutes: 4,
    questionsCount: 6,
    primarySkill: 'vocabulary',
    level: 'B1',
    iconName: 'Sparkles',
    badge: 'Lexical Breadth',
    instructions: [
      'Select the word or phrase that best fits the sentence context and tone.',
      'Learn why specific collocations sound natural to native speakers.',
      'Covers both professional and daily conversational terms.'
    ],
    evaluationCriteria: [
      'Understanding of natural collocations (e.g. make a decision vs do a decision)',
      'Precision in choosing synonyms suited to professional context',
      'Word family recognition (verb vs noun vs adjective forms)'
    ],
    allowRetake: true
  },
  {
    id: 'test-pronunciation',
    type: 'pronunciation',
    category: 'structured',
    title: 'Pronunciation Test',
    subtitle: 'Level-appropriate challenging words & multi-accent tolerance',
    description: 'Pronounce key multisyllabic words and tricky sound contrasts. Recognizes both standard UK and US varieties and never penalizes harmless regional accents.',
    durationMinutes: 3,
    questionsCount: 6,
    primarySkill: 'pronunciation',
    level: 'B1',
    iconName: 'Mic',
    badge: 'Accent-Friendly',
    instructions: [
      'Listen to the word sample in either US or UK pronunciation.',
      'Repeat the word clearly into the microphone.',
      'The engine focuses on intelligibility, syllable stress, and clear sound production.'
    ],
    evaluationCriteria: [
      'Correct primary syllable stress placement',
      'Clear articulation of consonant clusters and vowel contrasts',
      'Overall listener intelligibility'
    ],
    allowRetake: true
  },
  {
    id: 'test-fluency',
    type: 'fluency',
    category: 'speaking_challenge',
    title: 'Fluency Test',
    subtitle: 'Continuous speech analysis (1, 2, or 3 minute formats)',
    description: 'Speak at length on a rich personal or analytical topic. The engine analyzes speaking continuity, pause frequency, filler density, and words-per-minute rate.',
    durationMinutes: 2,
    questionsCount: 1,
    primarySkill: 'fluency',
    level: 'B1',
    iconName: 'Activity',
    badge: 'Speech Rate',
    instructions: [
      'Choose your duration (1, 2, or 3 minutes).',
      'Elaborate in depth with reasons, stories, and details.',
      'Fluency does not mean speaking as fast as possible; smooth continuity with natural breathing pauses is ideal.'
    ],
    evaluationCriteria: [
      'Speaking rate (ideal range: 110–150 words per minute)',
      'Pauses distribution and avoidance of mid-clause freezes',
      'Syntactic variety and thought completion'
    ],
    allowRetake: true
  },
  {
    id: 'test-conversation',
    type: 'conversation',
    category: 'speaking_challenge',
    title: 'Conversation Test',
    subtitle: 'Interactive AI-led dialog with Jarvis partner',
    description: 'Engage in an authentic 4-turn dialog where Jarvis asks open questions, listens to your reply, and dynamically tailors follow-ups based on what you actually said.',
    durationMinutes: 4,
    questionsCount: 4,
    primarySkill: 'conversation',
    level: 'B1',
    iconName: 'MessageSquare',
    badge: 'Adaptive AI',
    instructions: [
      'Jarvis will ask you a starting question.',
      'Answer openly and feel free to elaborate with personal opinions.',
      'Jarvis will listen and adapt follow-up questions to your responses.',
      'The entire conversation is scored holistically at the conclusion.'
    ],
    evaluationCriteria: [
      'Active listening and responsive conversational engagement',
      'Ability to sustain turn-taking and elaborate on ideas',
      'Spontaneous grammar and vocabulary usage under conversational flow'
    ],
    allowRetake: true
  }
];

export const QUESTION_BANKS: Record<TestType, TestQuestion[]> = {
  quick_speaking: [
    {
      id: 'qs-1',
      type: 'open_speaking',
      skill: 'speaking',
      difficulty: 'A2',
      prompt: 'Tell me about your daily routine. What do you usually do in the morning and evening?',
      subtitle: 'Describe your typical day in 45–60 seconds using present simple and time connectors.',
      expectedDurationSeconds: 60,
      rubricCriteria: [
        { criteria: 'Direct answer covering morning and evening habits', weight: 30 },
        { criteria: 'Correct use of present simple verbs and time prepositions', weight: 30 },
        { criteria: 'Use of frequency adverbs (usually, often, rarely)', weight: 20 },
        { criteria: 'Speaking continuity and flow', weight: 20 }
      ]
    },
    {
      id: 'qs-2',
      type: 'open_speaking',
      skill: 'speaking',
      difficulty: 'B1',
      prompt: 'What do you enjoy doing in your free time, and why do you find it rewarding?',
      subtitle: 'Talk about a hobby, sport, or creative interest for about 60 seconds.',
      expectedDurationSeconds: 60,
      rubricCriteria: [
        { criteria: 'Clear description of leisure activity and personal rationale', weight: 35 },
        { criteria: 'Expressive adjectives and emotion vocabulary', weight: 25 },
        { criteria: 'Grammar and sentence linking', weight: 25 },
        { criteria: 'Clarity and pronunciation', weight: 15 }
      ]
    },
    {
      id: 'qs-3',
      type: 'open_speaking',
      skill: 'speaking',
      difficulty: 'B1',
      prompt: 'Describe a memorable experience or trip that had a meaningful impact on you.',
      subtitle: 'Share what happened, who was with you, and why it stays in your memory.',
      expectedDurationSeconds: 60,
      rubricCriteria: [
        { criteria: 'Past tense narrative consistency (went, saw, realized, felt)', weight: 35 },
        { criteria: 'Chronological connectors (at first, later on, suddenly, in the end)', weight: 25 },
        { criteria: 'Rich vocabulary describing scenery, emotions, or challenges', weight: 25 },
        { criteria: 'Natural pauses and confidence', weight: 15 }
      ]
    }
  ],

  level_assessment: [
    {
      id: 'la-grammar-1',
      type: 'multiple_choice',
      skill: 'grammar',
      difficulty: 'A2',
      prompt: 'I ___ to the supermarket yesterday because we had run out of milk.',
      options: ['go', 'went', 'going', 'goes'],
      correctAnswer: 1,
      explanation: "Use 'went' (simple past) because the action happened and concluded at a specific past time ('yesterday')."
    },
    {
      id: 'la-vocab-1',
      type: 'multiple_choice',
      skill: 'vocabulary',
      difficulty: 'B1',
      prompt: 'Could you please ___ this point? The instructions are still a bit ambiguous.',
      options: ['clarify', 'clarification', 'clarifyingly', 'clarifyment'],
      correctAnswer: 0,
      explanation: "'Clarify' is the verb needed after the modal auxiliary 'could'. It means to make something clear and understandable."
    },
    {
      id: 'la-listening-1',
      type: 'listening_comprehension',
      skill: 'listening',
      difficulty: 'B1',
      prompt: 'According to the announcement, why has Flight 412 to Chicago been delayed?',
      listeningScript: 'Attention passengers on Flight 412 to Chicago. Due to sudden heavy thunderstorm activity near our destination airport, air traffic control has implemented a temporary ground stop. Our new estimated departure time is 4:45 PM. Complimentary refreshments are available at Gate B12.',
      options: [
        'Mechanical maintenance issues with the engine',
        'Severe thunderstorm weather near Chicago',
        'A shortage of available cabin flight crew',
        'Heavy holiday traffic on the boarding runway'
      ],
      correctAnswer: 1,
      explanation: 'The speaker explicitly states the delay is "Due to sudden heavy thunderstorm activity near our destination airport".'
    },
    {
      id: 'la-speaking-1',
      type: 'open_speaking',
      skill: 'speaking',
      difficulty: 'B1',
      prompt: 'Describe your professional or academic goals for the upcoming year and what steps you plan to take to achieve them.',
      subtitle: 'Speak for 45–60 seconds using future intentions and conditional statements.',
      expectedDurationSeconds: 60
    },
    {
      id: 'la-pronunciation-1',
      type: 'pronunciation_repeat',
      skill: 'pronunciation',
      difficulty: 'B1',
      prompt: 'Pronounce the following word clearly: "comfortable"',
      targetWords: [
        {
          word: 'comfortable',
          phoneticsUK: '/ˈkʌmftəbl/',
          phoneticsUS: '/ˈkʌmftərbəl/',
          syllableStress: 'COM-for-ta-ble (3 syllables)',
          tips: 'Most native speakers pronounce this as 3 syllables: "KUMF-tuh-bul", rather than 4 distinct syllables.'
        }
      ]
    },
    {
      id: 'la-conversation-1',
      type: 'open_speaking',
      skill: 'conversation',
      difficulty: 'B2',
      prompt: 'If someone asked you for advice on how to stay motivated while learning a difficult skill, what would you suggest?',
      subtitle: 'Give 2–3 practical recommendations with supporting explanations.',
      expectedDurationSeconds: 60
    }
  ],

  placement: [
    {
      id: 'place-1',
      type: 'multiple_choice',
      skill: 'grammar',
      difficulty: 'A1',
      prompt: 'She ___ English classes twice a week on Tuesdays and Thursdays.',
      options: ['takes', 'take', 'taking', 'is take'],
      correctAnswer: 0,
      explanation: "Third-person singular 'She' in the simple present tense requires the verb suffix -s ('takes')."
    },
    {
      id: 'place-2',
      type: 'multiple_choice',
      skill: 'vocabulary',
      difficulty: 'A2',
      prompt: 'The manager asked the team to ___ the meeting until next Monday due to a scheduling conflict.',
      options: ['postpone', 'cancelation', 'hurry', 'discuss about'],
      correctAnswer: 0,
      explanation: "'Postpone' means to delay or reschedule an event to a later time."
    },
    {
      id: 'place-3',
      type: 'multiple_choice',
      skill: 'grammar',
      difficulty: 'B1',
      prompt: 'If I ___ more free time this weekend, I would gladly help you with the renovation.',
      options: ['had', 'have', 'will have', 'having'],
      correctAnswer: 0,
      explanation: 'In the second conditional (hypothetical present/future), the if-clause takes the simple past ("If I had...").'
    },
    {
      id: 'place-4',
      type: 'listening_comprehension',
      skill: 'listening',
      difficulty: 'A2',
      prompt: 'What time does the cafe close on Sundays?',
      listeningScript: 'Welcome to Sunrise Coffee! On weekdays we are open from 6:30 AM to 8:00 PM, on Saturdays from 7:00 AM to 7:00 PM, and on Sundays we close early at 5:00 PM.',
      options: ['8:00 PM', '7:00 PM', '5:00 PM', '6:30 AM'],
      correctAnswer: 2,
      explanation: 'The speaker states: "and on Sundays we close early at 5:00 PM."'
    },
    {
      id: 'place-5',
      type: 'open_speaking',
      skill: 'speaking',
      difficulty: 'A2',
      prompt: 'Introduce yourself in 45 seconds: where are you from, what do you do, and why do you want to master English?',
      subtitle: 'Speak naturally to help calibrate your personalized learning journey.',
      expectedDurationSeconds: 45
    }
  ],

  random_object_pitch: [
    {
      id: 'pitch-bottle',
      type: 'open_speaking',
      skill: 'professional',
      difficulty: 'B1',
      prompt: 'Pitch this product to me: "Insulated Stainless Steel Smart Water Bottle"',
      subtitle: 'Speak for 60 seconds as if selling this item. Structure: Hook → Features → Daily Benefits → Urgency / Call to Action.',
      imageScene: {
        title: 'Smart Stainless Steel Water Bottle',
        descriptionPrompt: 'A sleek matte-black vacuum-insulated water bottle with a digital LED temperature cap.',
        keyElements: ['24-hour temperature retention', 'LED temperature touch display', 'Leak-proof magnetic cap', 'Eco-friendly BPA-free stainless steel'],
        suggestedPhrases: ['Imagine never drinking lukewarm water again...', 'What sets this apart is...', 'Whether you are at the gym or in the office...', 'Invest in your hydration today.'],
        themeColor: 'emerald'
      },
      persuasionStructure: [
        'Introduction & Attention Grabber (0–12s)',
        'Unique Technical Features (12–28s)',
        'Tangible Daily Life Benefits (28–44s)',
        'Compelling Call to Action & Special Offer (44–60s)'
      ],
      expectedDurationSeconds: 60
    }
  ],

  no_fillers: [
    {
      id: 'nf-1',
      type: 'open_speaking',
      skill: 'fluency',
      difficulty: 'B1',
      prompt: 'Describe your favorite season of the year and explain why it brings out the best in you.',
      subtitle: 'Speak continuously for 60 seconds while keeping verbal fillers (um, uh, like, actually, basically, you know) to an absolute minimum.',
      expectedDurationSeconds: 60,
      rubricCriteria: [
        { criteria: 'Filler word ratio under 4% of total words', weight: 40 },
        { criteria: 'Use of calm silent pauses instead of verbal hesitation sounds', weight: 30 },
        { criteria: 'Sentence completeness and natural flow', weight: 30 }
      ]
    }
  ],

  pros_cons_debate: [
    {
      id: 'pcd-1',
      type: 'debate',
      skill: 'conversation',
      difficulty: 'B1',
      prompt: 'Is online remote learning superior to traditional in-person classroom learning?',
      subtitle: '30 seconds arguing in favor of online learning, then 30 seconds arguing in favor of physical classrooms.',
      debatePhases: [
        {
          phase: 'for',
          durationSeconds: 30,
          prompt: 'Argue FOR online learning (flexibility, global reach, personalized pacing, saving commute time).',
          suggestedConnectors: ['First and foremost...', 'One tremendous advantage is...', 'Furthermore...', 'For instance...']
        },
        {
          phase: 'against',
          durationSeconds: 30,
          prompt: 'Now smoothly transition and argue FOR classroom learning (human connection, peer collaboration, hands-on labs).',
          suggestedConnectors: ['However, on the other hand...', 'In stark contrast...', 'Nevertheless, one cannot overlook...', 'Therefore...']
        }
      ],
      expectedDurationSeconds: 60
    }
  ],

  word_association: [
    {
      id: 'wa-travel',
      type: 'word_chain',
      skill: 'vocabulary',
      difficulty: 'A2',
      prompt: 'Word Association Seed: "Travel"',
      subtitle: 'Speak related words continuously for 60 seconds (e.g. Airport → Luggage → Boarding Pass → Airplane → Destination → Hotel → Souvenir...).',
      starterWords: ['Travel', 'Airport', 'Flight', 'Passport', 'Adventure'],
      expectedDurationSeconds: 60
    }
  ],

  three_word_story: [
    {
      id: 'tws-1',
      type: 'story_prompt',
      skill: 'speaking',
      difficulty: 'B1',
      prompt: 'Create a 60-second story connecting these three words: "Train", "Coffee", "Rain"',
      subtitle: 'Ensure all three words are used naturally in your spoken narrative.',
      starterWords: ['Train', 'Coffee', 'Rain'],
      expectedDurationSeconds: 60,
      rubricCriteria: [
        { criteria: 'Natural inclusion of all three target words', weight: 30 },
        { criteria: 'Coherent storytelling arc (beginning, development, resolution)', weight: 30 },
        { criteria: 'Consistent past tenses and vivid sensory details', weight: 25 },
        { criteria: 'Pronunciation and emotional pacing', weight: 15 }
      ]
    }
  ],

  picture_description: [
    {
      id: 'pic-airport',
      type: 'picture',
      skill: 'speaking',
      difficulty: 'A2',
      prompt: 'Describe what you see in this bustling International Airport Gate scene.',
      subtitle: 'Speak for 60 seconds. Use present continuous ("is waiting", "are boarding") and location prepositions.',
      imageScene: {
        title: 'Modern International Departure Lounge',
        descriptionPrompt: 'A wide floor-to-ceiling glass airport terminal overlooking a parked jetliner at sunset. Passengers are waiting, reading, pulling rollaway luggage, and boarding at Gate 14.',
        keyElements: [
          'A traveler in a tan trenchcoat pulling rolling luggage',
          'A flight attendant scanning digital boarding passes at the counter',
          'Two business colleagues seated having coffee while discussing a laptop',
          'A parked twin-engine aircraft visible outside the expansive glass window',
          'A digital departure monitor displaying flight numbers and boarding gates'
        ],
        suggestedPhrases: [
          'In the foreground, a woman is standing near the check-in desk...',
          'To the right of the counter, passengers are queueing patiently...',
          'Through the massive glass window in the background, an airplane is being serviced...',
          'On the upper left, the electronic board is displaying scheduled departures...'
        ],
        themeColor: 'sky'
      },
      expectedDurationSeconds: 60
    }
  ],

  jam: [
    {
      id: 'jam-1',
      type: 'open_speaking',
      skill: 'fluency',
      difficulty: 'B1',
      prompt: 'The best piece of advice I have ever received.',
      subtitle: 'Deliver a structured 60-second speech without long pauses or hesitation.',
      persuasionStructure: [
        '0–15s: Introduction & the person who gave the advice',
        '15–45s: The core principle & how it helped in a real situation',
        '45–60s: Summary & why everyone should remember this lesson'
      ],
      expectedDurationSeconds: 60,
      rubricCriteria: [
        { criteria: 'Clear time management across the 3 visual phases', weight: 35 },
        { criteria: 'Natural spoken pace (110–145 words per minute)', weight: 35 },
        { criteria: 'Vocabulary richness and emotional connection', weight: 30 }
      ]
    }
  ],

  shadowing: [
    {
      id: 'sh-1',
      type: 'shadowing',
      skill: 'pronunciation',
      difficulty: 'B1',
      prompt: 'Shadow and record this passage on mindset and clear communication.',
      passageText: 'Learning English is not about speaking perfectly. It is about communicating clearly and becoming more comfortable expressing your ideas with confidence.',
      subtitle: 'Listen to the native model, shadow along, then record your spoken version for acoustic waveform comparison.',
      expectedDurationSeconds: 30,
      rubricCriteria: [
        { criteria: 'Word stress on "perfectly", "communicating", "comfortable", "confidence"', weight: 40 },
        { criteria: 'Rhythmic pausing after commas and periods', weight: 30 },
        { criteria: 'Natural pitch rise and fall at sentence boundaries', weight: 30 }
      ]
    }
  ],

  listening: [
    {
      id: 'lis-1',
      type: 'listening_comprehension',
      skill: 'listening',
      difficulty: 'A2',
      prompt: 'Where will the client meeting take place tomorrow morning?',
      listeningScript: 'Hi Michael, just a quick update regarding our quarterly review. Room 302 is booked for maintenance, so we have relocated the client briefing to Conference Room B on the fourth floor at 10:30 AM.',
      options: [
        'Room 302 on the third floor',
        'Conference Room B on the fourth floor',
        'The main lobby coffee area',
        'The client office across town'
      ],
      correctAnswer: 1,
      explanation: 'The speaker clarifies that Room 302 is unavailable, so they relocated to Conference Room B on the fourth floor.'
    }
  ],

  grammar: [
    {
      id: 'g-1',
      type: 'multiple_choice',
      skill: 'grammar',
      difficulty: 'A2',
      prompt: 'I ___ to work yesterday because my car broke down.',
      options: ['go', 'went', 'going', 'goes'],
      correctAnswer: 1,
      explanation: "'Went' is the simple past form of 'go'. It must be used here because the sentence describes a completed past event ('yesterday')."
    }
  ],

  vocabulary: [
    {
      id: 'v-1',
      type: 'multiple_choice',
      skill: 'vocabulary',
      difficulty: 'B1',
      prompt: 'Which word fits best?\n\nCould you please ___ this point? The instructions are not entirely clear.',
      options: ['clarify', 'clarifyment', 'clarificationing', 'clarifyingness'],
      correctAnswer: 0,
      explanation: "'Clarify' is the verb used when asking someone to make something clearer and easier to understand."
    }
  ],

  pronunciation: [
    {
      id: 'pr-1',
      type: 'pronunciation_repeat',
      skill: 'pronunciation',
      difficulty: 'A2',
      prompt: 'Repeat the word: "comfortable"',
      targetWords: [
        {
          word: 'comfortable',
          phoneticsUK: '/ˈkʌm.fə.tə.bəl/ or /ˈkʌmf.tə.bəl/',
          phoneticsUS: '/ˈkʌm.fɚ.t̬ə.bəl/ or /ˈkʌmf.tɚ.bəl/',
          syllableStress: 'COM-for-ta-ble (stressed on first syllable)',
          tips: 'Standard pronunciation blends into 3 syllables: "KUMF-tuh-bul". Never stress the "fort". Both UK and US varieties are accepted.'
        }
      ]
    }
  ],

  fluency: [
    {
      id: 'fl-1',
      type: 'open_speaking',
      skill: 'fluency',
      difficulty: 'B1',
      prompt: 'Talk about your hometown or a city you know well.',
      subtitle: 'Choose your desired speaking duration (1 min, 2 min, or 3 min). Focus on steady continuity and natural flow.',
      expectedDurationSeconds: 120,
      rubricCriteria: [
        { criteria: 'Continuous speech continuity without awkward mid-sentence freezes', weight: 35 },
        { criteria: 'Natural pace (target 110–145 words per minute)', weight: 30 },
        { criteria: 'Coherent paragraph transitions and sentence completion', weight: 35 }
      ]
    }
  ],

  conversation: [
    {
      id: 'conv-1',
      type: 'open_speaking',
      skill: 'conversation',
      difficulty: 'B1',
      prompt: 'AI-Led Conversation Assessment with Jarvis',
      subtitle: 'Jarvis will ask an opening question, listen to your answer, and follow up dynamically over 3 to 4 turns.',
      expectedDurationSeconds: 180,
      starterWords: [
        'Tell me about your hometown and what makes it unique.',
        'What do you like most about living there?',
        'If a close friend visited for a weekend, what special place would you recommend they see?'
      ]
    }
  ],

  challenge: []
};

export const INITIAL_TEST_ATTEMPTS = [
  {
    id: 'att-jam-1',
    testId: 'test-jam',
    testType: 'jam' as TestType,
    testTitle: 'JAM — Just A Minute',
    timestamp: 'Today',
    dateIso: new Date().toISOString(),
    durationSeconds: 62,
    scores: {
      overallCommunication: 82,
      speaking: 84,
      grammar: 80,
      vocabulary: 83,
      pronunciation: 78,
      listening: 85,
      fluency: 82,
      clarity: 86
    },
    whatYouDidWell: [
      'You answered the topic directly with a compelling opening hook.',
      'Your pacing followed the 3 structured phases effectively (Intro → Core → Conclusion).',
      'You used several useful linking phrases (furthermore, as a consequence).'
    ],
    whatToImprove: [
      {
        target: 'Past Tense Consistency',
        reason: 'Shifted between simple present and past tense when narrating personal experiences.',
        actionLink: '/grammar',
        actionLabel: 'Review Past Tenses'
      }
    ],
    errorBreakdown: [],
    scoreExplanations: [
      {
        skill: 'Fluency',
        score: 82,
        strength: 'You maintained speech continuity without long awkward silence for the entire minute.',
        practice: 'Try taking deliberate 1-second silent breaths rather than vocalizing filler words.'
      }
    ],
    transcript: 'The best piece of advice I ever received came from my high school soccer coach. He told us that success is not about never making mistakes, but about learning quickly from them.',
    responses: {}
  }
];

export const INITIAL_WEAK_AREAS = [
  {
    id: 'wa-past-tense',
    topic: 'Past Tense Consistency',
    category: 'Grammar',
    sources: {
      lessonMistakes: 4,
      talkMistakes: 8,
      roleplayMistakes: 3,
      testMistakes: 5
    },
    totalMistakes: 20,
    severity: 'high' as const,
    lastEncountered: '2 hours ago',
    sampleMistake: {
      youSaid: 'I go to the store yesterday and buy some fruit.',
      better: 'I went to the store yesterday and bought some fruit.'
    },
    practiceAction: {
      type: 'grammar' as const,
      targetId: 'past-simple-unit',
      label: 'Practice Past Simple Lesson'
    }
  }
];

