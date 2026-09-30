import { GrammarTopic } from '../types/curriculumModules';

export const GRAMMAR_ROADMAP_TOPICS: GrammarTopic[] = [
  // ==========================================
  // LEVEL 1 — ABSOLUTE BEGINNER
  // ==========================================
  {
    id: 'gt-sentence-basics',
    title: 'Sentence Basics: Subject + Verb + Object',
    slug: 'sentence-basics',
    level: 'A1',
    category: 'sentence_basics',
    levelCategory: 'beginner',
    simpleExplanation: 'Every complete English thought needs someone who does the action (Subject) and the action itself (Verb).',
    detailedExplanation: 'English is fundamentally an S-V-O language (Subject-Verb-Object). Unlike languages where word order can be flexible, English relies strictly on order to identify who is acting upon what. Positive statements, negatives, questions, and commands each follow distinct syntactic frameworks.',
    structure: 'Subject + Verb + [Object / Complement]',
    formula: 'S + V + O',
    sentenceAnimation: {
      subject: 'The developer',
      verb: 'builds',
      object: 'the application',
      rest: 'every morning.'
    },
    examples: [
      {
        level: 'beginner',
        sentence: 'I drink water.',
        explanation: '"I" is the Subject, "drink" is the Verb, "water" is the Object.',
        naturalAlternative: 'I always have a glass of water when I wake up.'
      },
      {
        level: 'daily',
        sentence: 'She prepares breakfast for her family.',
        explanation: 'Subject (She) + Verb with -s (prepares) + Object (breakfast).'
      },
      {
        level: 'student',
        sentence: 'The students submitted their final research reports.',
        explanation: 'Subject (students) + Past Verb (submitted) + Object (reports).'
      },
      {
        level: 'office',
        sentence: 'Our team launched the new mobile update yesterday.',
        explanation: 'Workplace action with clear Subject, Verb, and Object.'
      },
      {
        level: 'professional',
        sentence: 'The executive committee approved the annual expansion strategy.',
        explanation: 'Executive clarity with unambiguous S-V-O alignment.'
      }
    ],
    whenToUse: [
      'Whenever expressing a clear, complete thought',
      'When making statements, requests, or explaining actions',
      'To ensure listeners immediately understand who performs an action'
    ],
    whenNotToUse: [
      'Do not omit the Subject in English (never say "Is raining", always say "It is raining")',
      'Avoid placing the object before the verb in standard statements'
    ],
    commonMistakes: [
      {
        mistake: 'Go to market yesterday.',
        correction: 'I went to the market yesterday.',
        why: 'English statements require an explicit subject (I) and correct past tense verb.'
      },
      {
        mistake: 'Like coffee she.',
        correction: 'She likes coffee.',
        why: 'Word order must strictly remain Subject (She) + Verb (likes) + Object (coffee).'
      }
    ],
    practiceExercises: [
      {
        id: 'ex-sb-1',
        type: 'rearrange',
        prompt: 'Arrange into a correct English sentence: [the manager] [emailed] [the report] [yesterday]',
        options: [
          'The manager emailed the report yesterday.',
          'Emailed the manager the report yesterday.',
          'The report the manager emailed yesterday.',
          'Yesterday emailed the report the manager.'
        ],
        correctAnswer: 0,
        explanation: 'Correct standard English order is Subject (The manager) + Verb (emailed) + Object (the report) + Time (yesterday).'
      },
      {
        id: 'ex-sb-2',
        type: 'mcq',
        prompt: 'Which sentence is a grammatically complete English thought?',
        options: [
          'Because the train was late.',
          'Sarah delivered the keynote speech.',
          'Walking in the park.',
          'Very happy with the result.'
        ],
        correctAnswer: 1,
        explanation: '"Sarah delivered the keynote speech" has an explicit subject and finite verb.'
      }
    ],
    speakingPrompt: {
      prompt: 'State what you usually do as soon as your workday or school day begins.',
      sampleAnswer: 'I review my daily task list and organize my priorities.',
      context: 'Daily routine S-V-O alignment'
    },
    conversationScenario: {
      characterName: 'Priya',
      characterRole: 'Colleague',
      starterPrompt: 'Hey! What are you working on right now?',
      targetUsage: 'Use a clear Subject + Verb + Object response.'
    },
    relatedTopics: ['nouns', 'be-verbs', 'simple-present'],
    status: 'familiar'
  },
  {
    id: 'gt-articles',
    title: 'Articles: A, An, The & Zero Article',
    slug: 'articles',
    level: 'A1',
    category: 'sentence_basics',
    levelCategory: 'beginner',
    simpleExplanation: 'Use "a/an" when talking about any non-specific item for the first time. Use "the" when both speaker and listener know exactly which specific item is meant.',
    detailedExplanation: 'English articles signify noun definiteness. "A" precedes singular countable nouns beginning with consonant sounds, while "an" precedes vowel sounds. "The" specifies known or unique entities. Uncountable nouns and plural general nouns frequently take zero article.',
    structure: 'a/an + singular countable noun | the + specific noun | Ø + plural/uncountable general noun',
    formula: 'A/An (General) vs The (Specific) vs Zero (Universal)',
    examples: [
      {
        level: 'beginner',
        sentence: 'I saw a dog in the street.',
        explanation: '"A dog" (any dog, first mention) + "the street" (the specific street we are on).'
      },
      {
        level: 'daily',
        sentence: 'Could you pass me the salt, please?',
        explanation: '"The salt" because there is one specific salt shaker on the dining table.'
      },
      {
        level: 'office',
        sentence: 'We scheduled a meeting to discuss the budget deficit.',
        explanation: '"A meeting" (one general meeting) + "the budget deficit" (the specific financial issue known to the company).'
      },
      {
        level: 'professional',
        sentence: 'Integrity is essential in corporate governance.',
        explanation: 'Zero article before abstract general nouns (Integrity, not "The integrity").'
      }
    ],
    whenToUse: [
      'Use "a/an" with singular countable nouns mentioned for the first time',
      'Use "the" when an item has already been mentioned or is uniquely obvious in the context',
      'Use zero article for plural generalizations (e.g. "Dogs are loyal animals")'
    ],
    whenNotToUse: [
      'Do not use "a/an" before uncountable nouns (never "an information", say "a piece of information")',
      'Do not use "the" with general names of countries (except those with plural or union names like The United States)'
    ],
    commonMistakes: [
      {
        mistake: 'I went to restaurant yesterday.',
        correction: 'I went to a restaurant yesterday.',
        why: '"Restaurant" is a singular countable noun and requires an article.'
      },
      {
        mistake: 'He gave me an useful advice.',
        correction: 'He gave me useful advice (or a piece of useful advice).',
        why: '"Advice" is uncountable. Also, "useful" begins with a /j/ consonant sound, taking "a" not "an".'
      }
    ],
    practiceExercises: [
      {
        id: 'ex-art-1',
        type: 'fill_blank',
        prompt: 'She has been working as ___ software architect for over ten years.',
        options: ['a', 'an', 'the', '(no article)'],
        correctAnswer: 0,
        explanation: 'Use "a" before professions starting with a consonant sound ("software").'
      },
      {
        id: 'ex-art-2',
        type: 'mcq',
        prompt: 'Select the sentence with correct article usage:',
        options: [
          'The honesty is always best policy.',
          'Honesty is always the best policy.',
          'A honesty is always a best policy.',
          'Honesty is always a best policy.'
        ],
        correctAnswer: 1,
        explanation: 'Abstract nouns take zero article ("Honesty"), and superlatives take "the" ("the best policy").'
      }
    ],
    speakingPrompt: {
      prompt: 'Describe an object in your room using "a" first, then explain why you like it using "the".',
      sampleAnswer: 'I have a mechanical keyboard on my desk. The keyboard helps me type faster and without wrist pain.',
      context: 'Demonstrate first mention (a) vs second mention (the).'
    },
    conversationScenario: {
      characterName: 'Arjun',
      characterRole: 'Roommate',
      starterPrompt: 'Did you find that document you were looking for?',
      targetUsage: 'Use "the document" or "a copy".'
    },
    relatedTopics: ['nouns', 'sentence-basics'],
    status: 'learning'
  },

  // ==========================================
  // COMPLETE 12 TENSES SYSTEM
  // ==========================================
  {
    id: 'gt-simple-present',
    title: 'Simple Present Tense',
    slug: 'simple-present',
    level: 'A1',
    category: 'tenses',
    levelCategory: 'tenses',
    simpleExplanation: 'Use Simple Present for habits, daily routines, permanent situations, and universal truths.',
    detailedExplanation: 'The simple present tense expresses habitual actions, states of being, general scientific truths, and scheduled timetables. In the third-person singular (he, she, it), verbs require the suffix -s or -es. Questions and negatives utilize auxiliary do/does.',
    structure: 'Subject + Verb(s/es) + Object | Do/Does + Subject + Base Verb?',
    formula: 'S + V1(s/es) + O',
    timelineAnimation: {
      past: 'Repeated yesterday',
      present: 'Habitual Now',
      future: 'Repeats tomorrow',
      highlight: 'present'
    },
    examples: [
      {
        level: 'beginner',
        sentence: 'I drink coffee every morning.',
        explanation: 'Habitual daily action with time frequency marker.',
        naturalAlternative: 'I usually grab a cup of coffee right after waking up.'
      },
      {
        level: 'daily',
        sentence: 'He catches the metro to work at 8:30 AM.',
        explanation: 'Third-person singular requires -es on "catch".'
      },
      {
        level: 'student',
        sentence: 'Water boils at 100 degrees Celsius.',
        explanation: 'Universal scientific fact.'
      },
      {
        level: 'office',
        sentence: 'Our department reviews incoming customer requests daily.',
        explanation: 'Standard workplace operating procedure.'
      },
      {
        level: 'professional',
        sentence: 'Our organization prioritizes data privacy across all client touchpoints.',
        explanation: 'Corporate ethos and permanent policy.'
      }
    ],
    whenToUse: [
      'Habits, routines, and repeated actions (every day, usually, often)',
      'Permanent facts and scientific truths',
      'Timetables and fixed schedules (e.g. "The train leaves at 9 PM")'
    ],
    whenNotToUse: [
      'Do not use simple present for actions happening right at this exact moment (use Present Continuous)'
    ],
    commonMistakes: [
      {
        mistake: 'He go to office every day.',
        correction: 'He goes to the office every day.',
        why: 'Third-person singular "He" requires the verb ending "-es" (goes).'
      },
      {
        mistake: 'I am knowing the solution.',
        correction: 'I know the solution.',
        why: '"Know" is a stative verb and is not used in continuous forms.'
      }
    ],
    practiceExercises: [
      {
        id: 'ex-sp-1',
        type: 'mcq',
        prompt: 'She ___ at a multinational technology consultancy in Hyderabad.',
        options: ['works', 'work', 'working', 'is work'],
        correctAnswer: 0,
        explanation: 'Third-person singular subject "She" requires the -s verb inflection "works".'
      },
      {
        id: 'ex-sp-2',
        type: 'error_fix',
        prompt: 'Fix the error: "Do she understand the instructions?"',
        options: [
          'Does she understand the instructions?',
          'Do she understands the instructions?',
          'Is she understand the instructions?',
          'Did she understands the instructions?'
        ],
        correctAnswer: 0,
        explanation: 'Third-person singular questions require auxiliary "Does", followed by the base form verb "understand".'
      }
    ],
    speakingPrompt: {
      prompt: 'Describe what you do on a typical Saturday afternoon.',
      sampleAnswer: 'On Saturday afternoons, I usually read books or meet friends at a local cafe.',
      context: 'Talk about routines using frequency adverbs.'
    },
    conversationScenario: {
      characterName: 'Jarvis',
      characterRole: 'Speaking Partner',
      starterPrompt: 'Tell me about your current role and what your team does.',
      targetUsage: 'Use simple present verbs to describe duties and operations.'
    },
    relatedTopics: ['present-continuous', 'sentence-basics'],
    status: 'mastered'
  },
  {
    id: 'gt-present-continuous',
    title: 'Present Continuous Tense',
    slug: 'present-continuous',
    level: 'A2',
    category: 'tenses',
    levelCategory: 'tenses',
    simpleExplanation: 'Use Present Continuous for actions happening right now, temporary situations, or confirmed future plans.',
    detailedExplanation: 'Constructed using the present forms of the auxiliary "be" (am/is/are) + present participle (-ing). It highlights ongoing, incomplete activity at the moment of speech or around the current time frame.',
    structure: 'Subject + am/is/are + Verb-ing + Object',
    formula: 'S + am/is/are + V-ing',
    timelineAnimation: {
      past: 'Started earlier',
      present: 'In Progress Right Now',
      future: 'Will finish later',
      highlight: 'continuous'
    },
    examples: [
      {
        level: 'beginner',
        sentence: 'I am studying English right now.',
        explanation: 'Action happening at the exact moment of speaking.'
      },
      {
        level: 'daily',
        sentence: 'They are renovating their kitchen this month.',
        explanation: 'A temporary ongoing project around the present time.'
      },
      {
        level: 'student',
        sentence: 'We are preparing for our semester examinations next week.',
        explanation: 'Ongoing preparation leading up to a fixed event.'
      },
      {
        level: 'office',
        sentence: 'The development team is deploying the security patch tonight.',
        explanation: 'Definite planned future workplace arrangement.'
      },
      {
        level: 'professional',
        sentence: 'We are actively restructuring our customer success workflows to reduce turnaround time.',
        explanation: 'Organizational transformation currently in progress.'
      }
    ],
    whenToUse: [
      'Actions occurring at the exact moment of speaking (now, right now, at the moment)',
      'Temporary ongoing situations (this week, this semester)',
      'Fixed upcoming personal arrangements (e.g. "I am meeting the client at 3 PM")'
    ],
    whenNotToUse: [
      'Do not use with stative verbs expressing thoughts, feelings, or senses (e.g. want, like, understand, believe)'
    ],
    commonMistakes: [
      {
        mistake: 'I am wanting a cup of coffee.',
        correction: 'I want a cup of coffee.',
        why: '"Want" is a stative verb expressing a desire, not an ongoing physical process.'
      },
      {
        mistake: 'Look! The bus come.',
        correction: 'Look! The bus is coming.',
        why: 'Observable live actions require the present continuous (is coming).'
      }
    ],
    practiceExercises: [
      {
        id: 'ex-pc-1',
        type: 'fill_blank',
        prompt: 'Listen! Someone ___ on the front door.',
        options: ['is knocking', 'knocks', 'are knocking', 'knocked'],
        correctAnswer: 0,
        explanation: '"Listen!" signals an action occurring in real-time right now.'
      }
    ],
    speakingPrompt: {
      prompt: 'Look around your room or desk and describe two actions happening right now.',
      sampleAnswer: 'My laptop fan is spinning quietly, and my phone is charging on the stand.',
      context: 'Observe real-time live surroundings.'
    },
    conversationScenario: {
      characterName: 'Manager Vikram',
      characterRole: 'Team Lead',
      starterPrompt: 'Could you give me a quick status update? What are you working on today?',
      targetUsage: 'Explain current ongoing tasks with present continuous.'
    },
    relatedTopics: ['simple-present', 'present-perfect'],
    status: 'practicing'
  },
  {
    id: 'gt-present-perfect',
    title: 'Present Perfect Tense',
    slug: 'present-perfect',
    level: 'B1',
    category: 'tenses',
    levelCategory: 'tenses',
    simpleExplanation: 'Connects the past to the present: life experiences, completed actions with present results, or unfinished time frames.',
    detailedExplanation: 'Formed with auxiliary "have/has" + past participle (V3). It is fundamentally distinct from Simple Past because the exact past time is either unspecified or the emphasis rests entirely on the present outcome or cumulative experience.',
    structure: 'Subject + have/has + Past Participle (V3) + Object',
    formula: 'S + have/has + V3',
    timelineAnimation: {
      past: 'Action in Past',
      present: 'Connected to Now',
      future: 'Ongoing possibility',
      highlight: 'perfect'
    },
    examples: [
      {
        level: 'beginner',
        sentence: 'I have visited London twice.',
        explanation: 'Cumulative life experience up to the present moment.'
      },
      {
        level: 'daily',
        sentence: 'I have lost my apartment keys; I cannot get inside.',
        explanation: 'Past action with direct present consequence.'
      },
      {
        level: 'office',
        sentence: 'She has already submitted the quarterly deliverables.',
        explanation: 'Completed task with "already".'
      },
      {
        level: 'professional',
        sentence: 'Our engineering group has successfully mitigated all high-severity vulnerabilities.',
        explanation: 'Completed milestone with present impact on system integrity.'
      }
    ],
    whenToUse: [
      'Life experiences (with ever, never, before)',
      'Recent completed actions with visible present results (just, already, yet)',
      'Actions starting in the past and continuing until now (with for, since)'
    ],
    whenNotToUse: [
      'NEVER use present perfect with finished past time words like "yesterday", "last week", "in 2020", "two hours ago" (use Simple Past instead)'
    ],
    commonMistakes: [
      {
        mistake: 'I have finished the report yesterday.',
        correction: 'I finished the report yesterday (or: I have already finished the report).',
        why: '"Yesterday" is a finished past time word and requires Simple Past.'
      },
      {
        mistake: 'I am living in this city for five years.',
        correction: 'I have lived in this city for five years (or: have been living).',
        why: 'Actions continuing from the past into the present require perfect aspect.'
      }
    ],
    practiceExercises: [
      {
        id: 'ex-pp-1',
        type: 'mcq',
        prompt: '___ you ever ___ an authentic Japanese tea ceremony?',
        options: [
          'Have / attended',
          'Did / attended',
          'Has / attend',
          'Were / attend'
        ],
        correctAnswer: 0,
        explanation: 'Questions about life experience use "Have you ever + V3".'
      }
    ],
    speakingPrompt: {
      prompt: 'Share one major achievement or milestone you have accomplished in your life so far.',
      sampleAnswer: 'I have earned a professional certification in cloud architecture and built multiple web platforms.',
      context: 'Life experience speaking challenge'
    },
    conversationScenario: {
      characterName: 'Interviewer Sarah',
      characterRole: 'Hiring Manager',
      starterPrompt: 'Have you ever managed a challenging project with tight deadlines?',
      targetUsage: 'Answer using present perfect to summarize experience, then simple past for details.'
    },
    relatedTopics: ['simple-past', 'present-perfect-continuous'],
    status: 'learning'
  },
  {
    id: 'gt-simple-past',
    title: 'Simple Past Tense',
    slug: 'simple-past',
    level: 'A2',
    category: 'tenses',
    levelCategory: 'tenses',
    simpleExplanation: 'Use Simple Past for completed actions that happened at a specific time in the past.',
    detailedExplanation: 'Regular verbs take the -ed suffix while irregular verbs undergo vowel shifts (go → went, see → saw). Negatives and questions use the auxiliary "did" with the bare infinitive.',
    structure: 'Subject + Past Verb (V2) + Object | Did + Subject + Base Verb?',
    formula: 'S + V2 + O',
    timelineAnimation: {
      past: 'Completed Event',
      present: 'Separated from Now',
      future: 'No effect',
      highlight: 'past'
    },
    examples: [
      {
        level: 'beginner',
        sentence: 'I went to work by bus yesterday.',
        explanation: 'Completed past event at a definite time.'
      },
      {
        level: 'office',
        sentence: 'We launched the product campaign last Thursday.',
        explanation: 'Definite business event in the past.'
      }
    ],
    whenToUse: [
      'Completed actions at a specific past time (yesterday, last night, in 2021, two days ago)',
      'Historical narratives and sequences of past events'
    ],
    whenNotToUse: [
      'Do not use when the action continues into the present'
    ],
    commonMistakes: [
      {
        mistake: 'I didn’t saw him yesterday.',
        correction: 'I didn’t see him yesterday.',
        why: 'After auxiliary "didn’t", always use the base form verb (see).'
      }
    ],
    practiceExercises: [
      {
        id: 'ex-pst-1',
        type: 'fill_blank',
        prompt: 'They ___ their quarterly targets last month.',
        options: ['achieved', 'achieve', 'have achieved', 'achieving'],
        correctAnswer: 0,
        explanation: '"Last month" demands Simple Past (achieved).'
      }
    ],
    speakingPrompt: {
      prompt: 'Describe how you spent your last vacation or weekend.',
      sampleAnswer: 'Last weekend I visited a historical museum and cooked dinner with my family.',
      context: 'Past storytelling.'
    },
    conversationScenario: {
      characterName: 'Alex',
      characterRole: 'Friend',
      starterPrompt: 'How was your weekend? Did you do anything exciting?',
      targetUsage: 'Narrate past events using simple past verbs.'
    },
    relatedTopics: ['past-continuous', 'present-perfect'],
    status: 'mastered'
  },

  // ==========================================
  // INTERMEDIATE GRAMMAR
  // ==========================================
  {
    id: 'gt-modals',
    title: 'Modal Verbs: Ability, Obligation & Politeness',
    slug: 'modals',
    level: 'B1',
    category: 'modals',
    levelCategory: 'intermediate',
    simpleExplanation: 'Modals (can, could, should, must, might, would) alter the tone and meaning: ability, permission, advice, possibility, or obligation.',
    detailedExplanation: 'Modal auxiliaries do not take third-person -s and are directly followed by the bare infinitive (without "to"). They express epistemic modality (probability/possibility) and deontic modality (permission/duty/politeness).',
    structure: 'Subject + Modal + Base Verb',
    formula: 'S + Modal + V1',
    examples: [
      {
        level: 'daily',
        sentence: 'Could you please repeat that more slowly?',
        explanation: 'Polite request using "could".'
      },
      {
        level: 'office',
        sentence: 'You should review the contract before signing.',
        explanation: 'Professional recommendation using "should".'
      },
      {
        level: 'professional',
        sentence: 'All attendees must submit security credentials prior to entry.',
        explanation: 'Mandatory obligation using "must".'
      }
    ],
    whenToUse: [
      'To soften requests and sound courteous in workplace communication',
      'To advise, recommend, or express probability'
    ],
    whenNotToUse: [
      'Never add "to" after core modals (never "I must to go", say "I must go")'
    ],
    commonMistakes: [
      {
        mistake: 'He can speaks English well.',
        correction: 'He can speak English well.',
        why: 'Modals take the bare infinitive without -s.'
      },
      {
        mistake: 'I must to submit the proposal.',
        correction: 'I must submit the proposal.',
        why: 'Do not place "to" after modal "must".'
      }
    ],
    practiceExercises: [
      {
        id: 'ex-mod-1',
        type: 'mcq',
        prompt: 'Which sentence represents the most polite workplace request?',
        options: [
          'Give me the file now.',
          'I want the file.',
          'Would you mind emailing me the file when you have a moment?',
          'You must give me the file.'
        ],
        correctAnswer: 2,
        explanation: '"Would you mind + V-ing" is the most courteous and natural professional phrasing.'
      }
    ],
    speakingPrompt: {
      prompt: 'Politely ask your colleague to reschedule a meeting to Friday afternoon.',
      sampleAnswer: 'Could we possibly reschedule our synchronization meeting to Friday afternoon if your calendar permits?',
      context: 'Polite workplace diplomacy'
    },
    conversationScenario: {
      characterName: 'Boss Maya',
      characterRole: 'Department Director',
      starterPrompt: 'Do you have time for a quick project review this afternoon?',
      targetUsage: 'Use modal verbs (could, would, might) to negotiate timings politely.'
    },
    relatedTopics: ['sentence-basics', 'conditionals'],
    status: 'learning'
  },

  // ==========================================
  // ADVANCED & PROFESSIONAL GRAMMAR
  // ==========================================
  {
    id: 'gt-conditionals',
    title: 'Conditionals: Zero, First, Second, Third & Mixed',
    slug: 'conditionals',
    level: 'B2',
    category: 'conditionals',
    levelCategory: 'advanced',
    simpleExplanation: 'Conditionals express what happens if a specific condition is met, from scientific facts to hypothetical dreams and past regrets.',
    detailedExplanation: '1st Conditional = Real future probability (If it rains, we will cancel). 2nd Conditional = Unreal/hypothetical present (If I had more time, I would learn Spanish). 3rd Conditional = Past counterfactual/regret (If we had started earlier, we would have met the deadline).',
    structure: 'Zero: If + present, present | 1st: If + present, will + V1 | 2nd: If + past, would + V1 | 3rd: If + had V3, would have V3',
    formula: 'Condition Clause + Consequence Clause',
    examples: [
      {
        level: 'daily',
        sentence: 'If it rains this evening, we will order dinner online.',
        explanation: '1st conditional: realistic future scenario.'
      },
      {
        level: 'student',
        sentence: 'If I had studied harder for the exam, I would have secured an A grade.',
        explanation: '3rd conditional: past regret.'
      },
      {
        level: 'office',
        sentence: 'If we automate this report, we will save four hours every Friday.',
        explanation: 'Practical workplace optimization projection.'
      },
      {
        level: 'professional',
        sentence: 'Had our risk management team identified the liquidity risk earlier, we would have restructured our assets.',
        explanation: 'Formal inverted conditional without "if".'
      }
    ],
    whenToUse: [
      'To discuss project risks, contingencies, and business scenarios',
      'To analyze past decisions constructively during post-mortems'
    ],
    whenNotToUse: [
      'Do not put "will" or "would" inside the if-clause itself (never "If I will go", say "If I go")'
    ],
    commonMistakes: [
      {
        mistake: 'If I will see him, I will tell him.',
        correction: 'If I see him, I will tell him.',
        why: 'In the first conditional, the if-clause uses the simple present tense.'
      }
    ],
    practiceExercises: [
      {
        id: 'ex-cond-1',
        type: 'fill_blank',
        prompt: 'If our budget ___ approved yesterday, we would begin hiring immediately.',
        options: ['had been', 'was', 'is', 'would be'],
        correctAnswer: 0,
        explanation: 'Mixed conditional connecting a past condition (had been) with a present consequence (would begin).'
      }
    ],
    speakingPrompt: {
      prompt: 'If you had unlimited resources and time, what company or project would you build?',
      sampleAnswer: 'If I had unlimited resources, I would establish an educational foundation providing AI coaching to rural students.',
      context: 'Second conditional hypothetical creativity'
    },
    conversationScenario: {
      characterName: 'Investor David',
      characterRole: 'Venture Partner',
      starterPrompt: 'What happens to your business model if customer acquisition costs double next quarter?',
      targetUsage: 'Analyze contingency plans using 1st and 2nd conditionals.'
    },
    relatedTopics: ['modals', 'simple-past'],
    status: 'familiar'
  },
  {
    id: 'gt-passive-voice',
    title: 'Passive Voice in Professional English',
    slug: 'passive-voice',
    level: 'B2',
    category: 'passive_voice',
    levelCategory: 'advanced',
    simpleExplanation: 'Use Passive Voice when the action or the receiver of the action is more important than who did it, or in objective workplace reporting.',
    detailedExplanation: 'Formed by: Subject + appropriate form of "be" + Past Participle (V3). Essential in technical reporting, diplomacy, and executive communication to maintain objectivity and avoid pointing personal blame.',
    structure: 'Object becomes Subject + be + V3 [+ by agent]',
    formula: 'S + be + V3',
    examples: [
      {
        level: 'office',
        sentence: 'The security vulnerability was patched within two hours.',
        explanation: 'The patch matters more than which engineer typed the code.'
      },
      {
        level: 'professional',
        sentence: 'A decision has been reached regarding the organizational merger.',
        explanation: 'Objective corporate neutrality.'
      }
    ],
    whenToUse: [
      'In scientific, engineering, and corporate documentation',
      'When the performer of the action is unknown or obvious',
      'To deliver bad news tactfully without directly blaming colleagues'
    ],
    whenNotToUse: [
      'Avoid excessive passive voice in informal conversational chats where it sounds overly stiff'
    ],
    commonMistakes: [
      {
        mistake: 'The report was wrote by me.',
        correction: 'The report was written by me.',
        why: 'Passive voice strictly requires the past participle (written, not wrote).'
      }
    ],
    practiceExercises: [
      {
        id: 'ex-pass-1',
        type: 'transform',
        prompt: 'Convert to professional passive: "Our team resolved all critical customer tickets."',
        options: [
          'All critical customer tickets were resolved by our team.',
          'All critical customer tickets was resolved.',
          'All critical customer tickets are resolve.',
          'Resolved were all customer tickets.'
        ],
        correctAnswer: 0,
        explanation: 'Plural subject "tickets" takes plural past auxiliary "were" + V3 "resolved".'
      }
    ],
    speakingPrompt: {
      prompt: 'Report a technical or operational problem that was resolved without blaming any individual.',
      sampleAnswer: 'The database server was temporarily overloaded, but traffic was rerouted and normal operations were restored.',
      context: 'Diplomatic corporate reporting'
    },
    conversationScenario: {
      characterName: 'Client Representative',
      characterRole: 'Client Partner',
      starterPrompt: 'Why was the delivery delayed this morning?',
      targetUsage: 'Explain the situation objectively using passive voice.'
    },
    relatedTopics: ['sentence-basics', 'modals'],
    status: 'learning'
  }
];
