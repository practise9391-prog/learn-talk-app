import {
  ListeningContentItem,
  ReadingContentItem,
  WritingPromptItem,
  CommunicationChallenge,
  CommunicationSkillSummary,
} from '../types/communication';

export const INITIAL_COMMUNICATION_SUMMARY: CommunicationSkillSummary = {
  speaking: 74,
  listening: 78,
  reading: 82,
  writing: 68,
  grammar: 76,
  vocabulary: 72,
  pronunciation: 70,
  fluency: 64,
};

// -------------------------------------------------------------------
// 1. PRODUCTION LISTENING CONTENT
// -------------------------------------------------------------------
export const SAMPLE_LISTENING_CONTENT: ListeningContentItem[] = [
  {
    id: 'listen-workplace-sync',
    title: 'Scheduling an Urgent Team Sync',
    subtitle: 'Two colleagues coordinate calendars to resolve a software delivery blocker.',
    contentType: 'phone_call',
    cefrLevel: 'B1',
    difficultyPace: 'natural',
    durationSeconds: 110,
    contextPlace: 'Office',
    speakers: [
      { id: 'spk-1', name: 'Alex', role: 'Engineering Lead', voiceGender: 'male', accent: 'US' },
      { id: 'spk-2', name: 'Maya', role: 'Product Manager', voiceGender: 'female', accent: 'Neutral' },
    ],
    transcript: [
      {
        id: 't-1',
        speakerId: 'spk-1',
        speakerName: 'Alex',
        text: 'Hey Maya, do you have a quick minute? We hit an unexpected snag with the database migration.',
        timestamp: '00:03',
        startSeconds: 0,
        endSeconds: 6,
        hintKeywords: ['unexpected snag', 'database migration'],
        translation: 'Maya, thoda samay hai? Database migration mein ek achanak samasya aa gayi hai.',
      },
      {
        id: 't-2',
        speakerId: 'spk-2',
        speakerName: 'Maya',
        text: 'Sure Alex. I was just reviewing the sprint backlog. How severe is the issue?',
        timestamp: '00:08',
        startSeconds: 6,
        endSeconds: 12,
        hintKeywords: ['sprint backlog', 'severe'],
        translation: 'Haan Alex. Main sprint backlog dekh rahi thi. Samasya kitni gambhir hai?',
      },
      {
        id: 't-3',
        speakerId: 'spk-1',
        speakerName: 'Alex',
        text: 'Could you join a quick huddle at two thirty? The frontend team needs our input on error fallbacks.',
        timestamp: '00:15',
        startSeconds: 12,
        endSeconds: 19,
        hintKeywords: ['huddle', 'two thirty', 'fallbacks'],
        translation: 'Kya aap do tees par ek meeting join kar sakti hain? Frontend team ko hamara input chahiye.',
      },
      {
        id: 't-4',
        speakerId: 'spk-2',
        speakerName: 'Maya',
        text: 'Two thirty works for me. Let me send a calendar invite so everyone stays in the loop.',
        timestamp: '00:22',
        startSeconds: 19,
        endSeconds: 27,
        hintKeywords: ['in the loop', 'calendar invite'],
        translation: 'Do tees mere liye theek hai. Main calendar invite bhejti hoon taaki sabhi update rahein.',
      },
    ],
    dictationItems: [
      {
        id: 'dict-1',
        targetSentence: 'We hit an unexpected snag with the database migration.',
        audioSnippetText: 'We hit an unexpected snag with the database migration.',
        isPartial: false,
        grammarFocus: 'Past tense idiom: hit a snag',
        hint: 'Listen for the phrase meaning encountered an obstacle.',
      },
      {
        id: 'dict-2',
        targetSentence: 'Could you join a quick huddle at two thirty?',
        audioSnippetText: 'Could you join a quick huddle at two thirty?',
        isPartial: true,
        maskedTokens: ['join', 'two thirty'],
        grammarFocus: 'Polite request with could',
        hint: 'Missing the verb and time expression.',
      },
    ],
    minimalPairs: [
      {
        id: 'mp-1',
        wordA: 'snag',
        wordB: 'snake',
        targetWord: 'snag',
        phonemeContrast: '/Ã¦É¡/ vs /eÉªk/',
        explanation: '"Snag" ends with a voiced /g/ and short vowel /Ã¦/, meaning an obstacle.',
        audioSnippetText: 'We hit an unexpected snag.',
      },
      {
        id: 'mp-2',
        wordA: 'meet',
        wordB: 'mit',
        targetWord: 'meet',
        phonemeContrast: '/iË / vs /Éª/',
        explanation: 'Long tense /iË / as in "meeting" compared to short /Éª/ in "minute".',
        audioSnippetText: 'Let us meet at two thirty.',
      },
    ],
    connectedSpeechTips: [
      {
        id: 'cs-1',
        casualForm: 'Couldja join...',
        formalForm: 'Could you join...',
        ruleType: 'assimilation',
        explanation: 'In conversational speech, "could you" naturally blends into /kÊŠdÊ’uË /.',
        contextUsage: 'Very common in casual workplace meetings; perfectly natural.',
      },
      {
        id: 'cs-2',
        casualForm: 'Whaddya think?',
        formalForm: 'What do you think?',
        ruleType: 'reduction',
        explanation: '"What do you" reduces to /wÉ‘dÉ™jÉ™/.',
        contextUsage: 'Informal discussions with team members.',
      },
    ],
    questions: [
      {
        id: 'lq-1',
        question: 'Why did Alex reach out to Maya?',
        type: 'mcq',
        options: [
          'To ask for a vacation approval',
          'Because of an unexpected database migration problem',
          'To celebrate the sprint release',
          'To reschedule lunch plans',
        ],
        correctAnswer: 'Because of an unexpected database migration problem',
        explanation: 'Alex clearly states: "We hit an unexpected snag with the database migration."',
        evidenceQuote: 'We hit an unexpected snag with the database migration.',
      },
      {
        id: 'lq-2',
        question: 'What time did they agree to hold the huddle?',
        type: 'mcq',
        options: ['1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM'],
        correctAnswer: '2:30 PM',
        explanation: 'Alex suggested two thirty, and Maya confirmed: "Two thirty works for me."',
        evidenceQuote: 'Could you join a quick huddle at two thirty?',
      },
      {
        id: 'lq-3',
        question: 'What does the idiom "keep everyone in the loop" mean in this dialogue?',
        type: 'open_ended',
        correctAnswer: 'keep everyone informed and updated',
        acceptableAnswers: [
          'keep people informed',
          'keep everyone updated',
          'share information with everyone',
          'make sure everyone knows what is happening',
        ],
        explanation: '"In the loop" means ensuring all relevant team members are informed of progress.',
        evidenceQuote: 'so everyone stays in the loop.',
      },
    ],
    followUpCrossSkill: {
      type: 'speak_summary',
      prompt: 'In your own words, summarize Alex and Maya’s conversation in 2–3 sentences out loud.',
      guidance: 'Mention the problem, the meeting time, and the next action.',
    },
  },
  {
    id: 'listen-airport-boarding',
    title: 'Airport Gate Change & Priority Boarding',
    subtitle: 'Listen to an authentic airport public address announcement and extract flight details.',
    contentType: 'announcement',
    cefrLevel: 'A2',
    difficultyPace: 'slow',
    durationSeconds: 75,
    contextPlace: 'Airport',
    speakers: [
      { id: 'spk-announcer', name: 'Gate Agent', role: 'Airline Staff', voiceGender: 'female', accent: 'UK' },
    ],
    transcript: [
      {
        id: 't-air-1',
        speakerId: 'spk-announcer',
        speakerName: 'Gate Agent',
        text: 'Attention passengers on SkyWings Flight 402 with service to London Heathrow.',
        timestamp: '00:02',
        startSeconds: 0,
        endSeconds: 6,
        hintKeywords: ['Flight 402', 'London Heathrow'],
      },
      {
        id: 't-air-2',
        speakerId: 'spk-announcer',
        speakerName: 'Gate Agent',
        text: 'Due to ongoing maintenance at Gate 14, this flight has been relocated to Gate 22B.',
        timestamp: '00:08',
        startSeconds: 6,
        endSeconds: 14,
        hintKeywords: ['relocated', 'Gate 22B'],
      },
      {
        id: 't-air-3',
        speakerId: 'spk-announcer',
        speakerName: 'Gate Agent',
        text: 'Boarding will commence in approximately ten minutes. Please have your passport and boarding pass ready.',
        timestamp: '00:16',
        startSeconds: 14,
        endSeconds: 23,
        hintKeywords: ['Boarding', 'ten minutes', 'passport'],
      },
    ],
    dictationItems: [
      {
        id: 'dict-air-1',
        targetSentence: 'This flight has been relocated to Gate 22B.',
        audioSnippetText: 'This flight has been relocated to Gate 22B.',
        isPartial: false,
        grammarFocus: 'Present perfect passive: has been relocated',
        hint: 'Pay attention to the gate number and the past participle.',
      },
    ],
    questions: [
      {
        id: 'lq-air-1',
        question: 'Which gate is Flight 402 departing from now?',
        type: 'mcq',
        options: ['Gate 14', 'Gate 22B', 'Gate 42A', 'Gate 10'],
        correctAnswer: 'Gate 22B',
        explanation: 'The announcer explains that the flight was relocated from Gate 14 to Gate 22B.',
        evidenceQuote: 'this flight has been relocated to Gate 22B.',
      },
      {
        id: 'lq-air-2',
        question: 'What documents should passengers prepare for boarding?',
        type: 'mcq',
        options: ['Driver license and credit card', 'Passport and boarding pass', 'Baggage receipt only', 'Vaccination certificate'],
        correctAnswer: 'Passport and boarding pass',
        explanation: 'The announcement explicitly says: "Please have your passport and boarding pass ready."',
        evidenceQuote: 'Please have your passport and boarding pass ready.',
      },
    ],
    followUpCrossSkill: {
      type: 'roleplay_continue',
      prompt: 'Imagine you missed the gate change announcement. Approach the information desk and ask where Flight 402 is boarding.',
      guidance: 'Use polite question forms: "Excuse me, could you tell me...?"',
    },
  },
];

// -------------------------------------------------------------------
// 2. PRODUCTION READING CONTENT
// -------------------------------------------------------------------
export const SAMPLE_READING_CONTENT: ReadingContentItem[] = [
  {
    id: 'read-workplace-email',
    title: 'Client Project Deadline Adjustment',
    topic: 'Professional Workplace Correspondence',
    contentType: 'email',
    cefrLevel: 'B1',
    estimatedMinutes: 5,
    wordCount: 165,
    passage: `Subject: Update Regarding Project Mercury Milestone Timeline

Dear Team,

I am writing to share an important update regarding our deliverables for Project Mercury. Following our steering committee meeting yesterday afternoon, our client requested an additional security audit before the initial rollout.

To accommodate this requirement without compromising code quality, we have agreed to adjust the staging deployment date from October 12th to October 19th. This seven-day buffer will give the infrastructure team sufficient bandwidth to implement encryption protocols thoroughly.

Please review your remaining task estimates in Jira by tomorrow noon. If your sub-tasks depend on the backend API completion, communicate directly with Alex on Slack.

Thank you for your adaptability and hard work. Let us maintain our focus on high standards rather than rushing unverified code.

Warm regards,
Maya Sharma
Senior Product Manager`,
    vocabularyAnnotations: [
      {
        word: 'deliverables',
        partOfSpeech: 'noun (plural)',
        definition: 'Tangible products or completed results that must be provided upon project completion.',
        simpleExplanation: 'The actual things you promised to finish and give to the client.',
        exampleSentence: 'Our primary deliverables for this quarter include the mobile app and documentation.',
        synonyms: ['outputs', 'results', 'products'],
        grammarNote: 'Countable noun, usually used in plural in business contexts.',
      },
      {
        word: 'accommodate',
        partOfSpeech: 'verb',
        definition: 'To adapt or provide what is needed to satisfy a requirement.',
        simpleExplanation: 'To adjust your plan so someone else’s need is fulfilled.',
        exampleSentence: 'We adjusted our schedule to accommodate the client’s request.',
        synonyms: ['adjust for', 'fit in', 'oblige'],
      },
      {
        word: 'bandwidth',
        partOfSpeech: 'noun (business idiom)',
        definition: 'The mental capacity, time, or resources available to handle additional work.',
        simpleExplanation: 'Free time and mental energy to do a task.',
        exampleSentence: 'I do not have the bandwidth to take on another project this week.',
        synonyms: ['capacity', 'time', 'availability'],
      },
      {
        word: 'adaptability',
        partOfSpeech: 'noun',
        definition: 'The quality of being able to adjust to new conditions or changes smoothly.',
        simpleExplanation: 'How well you handle sudden changes without panicking.',
        exampleSentence: 'Her adaptability made her an invaluable leader during company restructuring.',
        synonyms: ['flexibility', 'resilience', 'versatility'],
      },
    ],
    readingStrategies: [
      'Identifying Email Purpose in the Opening Paragraph',
      'Scanning for Concrete Dates & Timeline Alterations',
      'Understanding Action Items & Deadlines',
    ],
    questions: [
      {
        id: 'rq-1',
        question: 'What is the primary reason for adjusting the project milestone timeline?',
        type: 'main_idea',
        options: [
          'The backend engineer went on emergency leave',
          'The client requested an additional security audit before rollout',
          'The design assets were rejected by the team',
          'The servers crashed during testing',
        ],
        correctAnswer: 'The client requested an additional security audit before rollout',
        explanation: 'The second paragraph explains: "our client requested an additional security audit before the initial rollout."',
        passageEvidenceQuote: 'our client requested an additional security audit before the initial rollout.',
      },
      {
        id: 'rq-2',
        question: 'What is the new staging deployment date agreed upon?',
        type: 'detail',
        options: ['October 10th', 'October 12th', 'October 19th', 'October 25th'],
        correctAnswer: 'October 19th',
        explanation: 'The email explicitly states the date moved from October 12th to October 19th.',
        passageEvidenceQuote: 'we have agreed to adjust the staging deployment date from October 12th to October 19th.',
      },
      {
        id: 'rq-3',
        question: 'What action item must the team complete by tomorrow noon?',
        type: 'detail',
        options: [
          'Deploy the code to production',
          'Review remaining task estimates in Jira',
          'Email the client directly',
          'Submit vacation requests',
        ],
        correctAnswer: 'Review remaining task estimates in Jira',
        explanation: 'Paragraph 3 states: "Please review your remaining task estimates in Jira by tomorrow noon."',
        passageEvidenceQuote: 'Please review your remaining task estimates in Jira by tomorrow noon.',
      },
    ],
    readAloudPrompt: {
      targetParagraph:
        'Thank you for your adaptability and hard work. Let us maintain our focus on high standards rather than rushing unverified code.',
      fluencyGoalWPM: 120,
      pronunciationTargets: ['adaptability', 'standards', 'unverified'],
    },
    followUpCrossSkill: {
      type: 'written_reflection',
      prompt: 'Write a brief professional email reply to Maya confirming you updated your Jira tasks.',
    },
  },
  {
    id: 'read-psychology-habits',
    title: 'The Compound Power of Daily Speaking Practice',
    topic: 'Language Acquisition & Cognitive Science',
    contentType: 'article',
    cefrLevel: 'B2',
    estimatedMinutes: 6,
    wordCount: 210,
    passage: `Many second-language learners fall into the trap of passive study. They consume grammar rules and memorize vocabulary lists for hours, yet freeze when spoken to. Cognitive neuroscience explains why: passive recognition and active speech production rely on fundamentally distinct neural pathways.

When you read or listen, your brain engages in receptive decoding. You can infer meaning from contextual clues even when grammar recognition is vague. In contrast, spontaneous speech requires real-time formulation: retrieving lexical items, applying morphological rules, coordinating vocal articulators, and monitoring auditory feedback simultaneously.

This is why ten minutes of daily vocalization yields substantially higher communicative confidence than three hours of silent weekend cramming. Daily vocal practice transforms conscious deliberation into automatic procedural memory. The tongue, lips, and vocal cords develop physical muscle memory, while the prefrontal cortex reduces hesitation latency.

To achieve genuine English fluency, learners must embrace communicative friction. Making minor mistakes out loud provides the biological feedback loop necessary for neuroplastic adaptation. Fluency is not an innate gift; it is the compounded dividend of consistent spoken repetition.`,
    vocabularyAnnotations: [
      {
        word: 'passive recognition',
        partOfSpeech: 'noun phrase',
        definition: 'Understanding language when reading or hearing it without the ability to produce it spontaneously.',
        simpleExplanation: 'Knowing what a word means when someone says it, but forgetting it when you try to speak.',
        exampleSentence: 'Most learners possess a large passive vocabulary that they never use in speech.',
        synonyms: ['receptive understanding', 'passive recall'],
      },
      {
        word: 'latency',
        partOfSpeech: 'noun',
        definition: 'The delay between a stimulus and the resulting response.',
        simpleExplanation: 'The pause between thinking in your native language and saying the English words.',
        exampleSentence: 'Regular practice dramatically reduces speech latency.',
        synonyms: ['hesitation time', 'lag', 'delay'],
      },
      {
        word: 'neuroplastic',
        partOfSpeech: 'adjective',
        definition: 'Relating to the brain’s ability to rewire and form new neural connections through repetitive experience.',
        simpleExplanation: 'The brain changing its physical wiring because you practice every day.',
        exampleSentence: 'Language learning stimulates neuroplastic growth at any age.',
        synonyms: ['adaptable', 'moldable'],
      },
    ],
    readingStrategies: [
      'Synthesizing Academic Arguments',
      'Distinguishing Passive vs Active Processing',
      'Inferring Author Opinion from Rhetorical Language',
    ],
    questions: [
      {
        id: 'rq-psy-1',
        question: 'Why do learners who memorize vocabulary lists still freeze during real conversations?',
        type: 'main_idea',
        options: [
          'Because they lack natural talent',
          'Because receptive decoding and active vocal production rely on distinct neural pathways',
          'Because English grammar is impossible to master',
          'Because they do not listen to enough music',
        ],
        correctAnswer: 'Because receptive decoding and active vocal production rely on distinct neural pathways',
        explanation: 'Paragraph 1 and 2 explain that passive recognition and active speech production use different brain circuits.',
        passageEvidenceQuote: 'passive recognition and active speech production rely on fundamentally distinct neural pathways.',
      },
      {
        id: 'rq-psy-2',
        question: 'What does the author suggest is necessary for neuroplastic adaptation in language learning?',
        type: 'inference',
        options: [
          'Avoiding mistakes at all costs',
          'Embracing communicative friction and making minor mistakes out loud',
          'Studying silently for ten hours every Sunday',
          'Only speaking when your grammar is 100% perfect',
        ],
        correctAnswer: 'Embracing communicative friction and making minor mistakes out loud',
        explanation: 'Paragraph 4 emphasizes that making minor mistakes provides the necessary biological feedback.',
        passageEvidenceQuote: 'Making minor mistakes out loud provides the biological feedback loop necessary for neuroplastic adaptation.',
      },
    ],
    followUpCrossSkill: {
      type: 'verbal_summary',
      prompt: 'Explain the difference between passive and active English knowledge to Jarvis as if you were teaching a friend.',
    },
  },
];

// -------------------------------------------------------------------
// 3. PRODUCTION WRITING PROMPTS & SCAFFOLDING
// -------------------------------------------------------------------
export const SAMPLE_WRITING_PROMPTS: WritingPromptItem[] = [
  {
    id: 'write-sentence-builder-1',
    title: 'Sentence Builder: Polite Workplace Request',
    writingType: 'sentence_builder',
    cefrLevel: 'A1',
    tone: 'professional',
    promptText: 'Construct a polite sentence asking a colleague for the presentation slides.',
    instruction: 'Tap or drag the words into the correct grammatical order. Then type the full sentence.',
    targetLengthWords: { min: 8, max: 12 },
    targetKeywords: ['could', 'please', 'presentation', 'slides'],
    targetGrammarRules: ['Polite Modal Verbs: Could you please + bare infinitive'],
    sentenceBuilder: {
      shuffledWords: ['you', 'the', 'Could', 'slides', 'send', 'please', 'presentation', 'me', '?'],
      targetSentence: 'Could you please send me the presentation slides?',
      hint: 'Start with the modal verb "Could". Place "please" after the subject.',
    },
    rubricCriteria: {
      taskCompletion: 30,
      grammarAccuracy: 35,
      vocabularyRichness: 10,
      coherenceOrganization: 15,
      toneAppropriateness: 10,
    },
    modelResponses: [
      {
        text: 'Could you please send me the presentation slides?',
        quality: 'professional',
        explanation: 'Standard polite workplace formula using modal "could" with respectful politeness marker.',
      },
      {
        text: 'Can you send me the presentation slides please?',
        quality: 'acceptable',
        explanation: 'Acceptable in casual settings, but "Could" is preferred for professional communications.',
      },
    ],
  },
  {
    id: 'write-transformation-casual-formal',
    title: 'Sentence Transformation: Casual to Professional',
    writingType: 'transformation',
    cefrLevel: 'B1',
    tone: 'professional',
    promptText: 'Transform casual, abrupt sentences into respectful, polished business English.',
    instruction: 'Rewrite the sentence below to make it polite, diplomatic, and suitable for an email to a client or manager.',
    targetLengthWords: { min: 8, max: 20 },
    targetKeywords: ['appreciate', 'possible', 'convenience', 'assist'],
    targetGrammarRules: ['Indirect Question Forms', 'Polite Conditional Clauses'],
    transformation: {
      originalSentence: 'Give me the report right now. I need it.',
      transformationGoal: 'Transform from demanding to diplomatic business request',
      modelExample: 'Could you please provide the report at your earliest convenience?',
    },
    rubricCriteria: {
      taskCompletion: 25,
      grammarAccuracy: 25,
      vocabularyRichness: 20,
      coherenceOrganization: 15,
      toneAppropriateness: 15,
    },
    modelResponses: [
      {
        text: 'Could you please provide the latest report as soon as possible?',
        quality: 'professional',
        explanation: 'Polite, clear, and maintains urgency without sounding aggressive.',
      },
      {
        text: 'I would greatly appreciate it if you could share the report at your earliest convenience.',
        quality: 'natural',
        explanation: 'Warm, highly diplomatic phrasing ideal for senior stakeholders.',
      },
    ],
  },
  {
    id: 'write-email-leave-request',
    title: 'Email: Requesting Two Days of Personal Leave',
    writingType: 'email',
    cefrLevel: 'B1',
    tone: 'professional',
    promptText: 'Write a short formal email to your manager requesting 2 days off for a family event.',
    instruction: 'Include a clear subject line, dates, reason, and an assurance that your responsibilities are covered.',
    targetLengthWords: { min: 45, max: 90 },
    targetKeywords: ['leave', 'absence', 'delegate', 'urgent', 'regards'],
    targetGrammarRules: ['Future plans with would like to', 'Present Continuous for coverage'],
    emailStructure: {
      subject: 'Leave Request: [Your Name] - [Dates]',
      greetingPlaceholder: 'Dear [Manager Name],',
      openingPlaceholder: 'I am writing to formally request two days of leave on [Date] and [Date]...',
      purposePlaceholder: 'The reason for this request is...',
      detailsPlaceholder: 'Prior to my departure, I will complete all urgent tasks...',
      requestPlaceholder: 'Colleague [Name] has kindly agreed to cover critical client inquiries...',
      closingPlaceholder: 'Thank you for understanding. Sincerely, [Your Name]',
    },
    rubricCriteria: {
      taskCompletion: 25,
      grammarAccuracy: 25,
      vocabularyRichness: 15,
      coherenceOrganization: 20,
      toneAppropriateness: 15,
    },
    modelResponses: [
      {
        text: `Subject: Leave Request: Alex Kumar - October 15-16

Dear Maya,

I am writing to request two days of personal leave on Thursday, October 15th, and Friday, October 16th, to attend a family wedding.

Before leaving, I will ensure all pending code reviews and milestone deliverables are completed. Sarah has agreed to cover any urgent client queries during my absence. I will have limited email access for emergencies.

Thank you for your consideration.

Warm regards,
Alex`,
        quality: 'professional',
        explanation: 'Covers all required elements clearly with professional courtesy and coverage reassurance.',
      },
    ],
    followUpCrossSkill: {
      type: 'talk_with_jarvis',
      prompt: 'Jarvis will act as your manager. Discuss the leave dates and answer any questions about who is covering your work.',
    },
  },
  {
    id: 'write-free-dream-job',
    title: 'Free Writing: Describing Your Ideal Career',
    writingType: 'opinion',
    cefrLevel: 'B2',
    tone: 'friendly',
    promptText: 'Describe your dream job. What kind of problems do you want to solve, and why does this work inspire you?',
    instruction: 'Write 80–140 words. Focus on varied sentence structures, expressive adjectives, and clear paragraphs.',
    targetLengthWords: { min: 80, max: 140 },
    targetKeywords: ['passion', 'impact', 'collaborative', 'growth', 'opportunity'],
    targetGrammarRules: ['Conditionals (would love to, if I had the opportunity)', 'Complex sentences with while and although'],
    rubricCriteria: {
      taskCompletion: 20,
      grammarAccuracy: 25,
      vocabularyRichness: 25,
      coherenceOrganization: 15,
      toneAppropriateness: 15,
    },
    modelResponses: [
      {
        text: `My ideal career combines technological innovation with meaningful human impact. Specifically, I aspire to work as an AI product strategist developing accessible educational tools for global learners.

In this role, I would collaborate with multidisciplinary teams of software engineers, behavioral psychologists, and educators. What excites me most is solving complex user experience hurdles—turning intimidating technical concepts into intuitive, empowering daily habits. 

Ultimately, true professional fulfillment comes from knowing that my daily work dismantles language barriers and opens economic doors for underserved communities worldwide.`,
        quality: 'professional',
        explanation: 'Rich vocabulary, elegant transitions, and compelling personal voice.',
      },
    ],
    followUpCrossSkill: {
      type: 'talk_with_jarvis',
      prompt: 'Share what you wrote with Jarvis. Explain your dream career out loud and answer follow-up questions.',
    },
  },
];

// -------------------------------------------------------------------
// 4. CROSS-SKILL INTEGRATED CHALLENGES
// -------------------------------------------------------------------
export const SAMPLE_COMMUNICATION_CHALLENGES: CommunicationChallenge[] = [
  {
    id: 'chal-client-escalation',
    title: 'The Client Escalation Challenge',
    scenario: 'A major enterprise client is upset about a delayed software release. You must listen to the voicemail, read company policy, write a response email, and make a reassurance call.',
    context: 'Workplace Client Relations',
    cefrLevel: 'B1',
    estimatedMinutes: 14,
    xpReward: 160,
    completed: false,
    steps: [
      {
        stepNumber: 1,
        skill: 'listen',
        label: '1. Listen to Urgent Client Voicemail',
        instruction: 'Listen carefully to identify the client’s main frustration and requested timeline.',
        contentRefId: 'listen-workplace-sync',
        completed: true,
        score: 90,
      },
      {
        stepNumber: 2,
        skill: 'read',
        label: '2. Read Company Resolution Guidelines',
        instruction: 'Review the staging and security audit protocol to know what solutions are authorized.',
        contentRefId: 'read-workplace-email',
        completed: true,
        score: 85,
      },
      {
        stepNumber: 3,
        skill: 'write',
        label: '3. Draft Professional Reassurance Email',
        instruction: 'Write a calm, diplomatic reply addressing the client’s timeline concerns.',
        contentRefId: 'write-email-leave-request',
        completed: false,
      },
      {
        stepNumber: 4,
        skill: 'speak',
        label: '4. Voice Call with the Client (Jarvis)',
        instruction: 'Hop on a 2-minute phone call to verbally explain the solution with empathy and confidence.',
        contentRefId: 'talk-roleplay-escalation',
        completed: false,
      },
    ],
  },
];
