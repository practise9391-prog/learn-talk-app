import { CurriculumLevel, SmartRevisionItem } from '../types/curriculum';

export const SMART_REVISION_ITEMS: SmartRevisionItem[] = [
  {
    id: 'rev-past-tense',
    topic: 'Past Simple Verb Forms',
    category: 'tense',
    triggerReason: "You hesitated between 'went' and 'go' during yesterday's daily routine practice.",
    actionPrompt: "Practice 3 quick spoken sentences about what you completed yesterday.",
    lessonIdRef: 'b1-u2-l2',
    completed: false,
  },
  {
    id: 'rev-fillers',
    topic: 'No Fillers Challenge',
    category: 'fillers',
    triggerReason: "You used 'basically' and 'like' 4 times in your last conversation.",
    actionPrompt: "Speak for 60 seconds without filler words by taking silent 1-second pauses.",
    lessonIdRef: 'b2-u5-l1',
    completed: false,
  },
  {
    id: 'rev-articles',
    topic: 'Countable Noun Articles (a / an / the)',
    category: 'grammar',
    triggerReason: "You said 'I went to restaurant' instead of 'I went to a restaurant'.",
    actionPrompt: "Quick drill: practice naming places with correct singular indefinite articles.",
    lessonIdRef: 'b1-u3-l1',
    completed: false,
  },
  {
    id: 'rev-pronounce-th',
    topic: 'Clear "TH" Sound Articulation',
    category: 'pronunciation',
    triggerReason: "Tongue placement between teeth needed on words like 'Think', 'Through', 'Three'.",
    actionPrompt: "Shadowing drill: 5 common 'TH' sentences spoken with visual mouth cues.",
    completed: true,
  },
];

export const MASTER_CURRICULUM: CurriculumLevel[] = [
  // ==========================================
  // 1. BEGINNER LEVEL 1 (Proficiency: Level 1 & 2)
  // ==========================================
  {
    id: 'beginner_1',
    title: 'Beginner Level 1',
    label: 'Beginner Level 1',
    category: 'Beginner',
    proficiencyRating: 1,
    proficiencyName: 'Absolute Beginner',
    description: 'Foundations of everyday spoken English: greetings, morning and evening routines, expressing needs, introducing family, asking questions, and expressing basic emotions.',
    competencyOutcome: 'Can understand and use familiar everyday expressions and basic phrases aimed at the satisfaction of concrete needs.',
    status: 'current',
    units: [
      // UNIT 1: GREETINGS
      {
        id: 'b1-u1',
        levelId: 'beginner_1',
        unitNumber: 1,
        title: 'Unit 1 — Greetings & Introductions',
        subtitle: 'Foundations of meeting people and polite small talk',
        description: 'Learn how to greet someone warmly in the morning, afternoon, or evening, introduce yourself, ask friendly questions, and handle formal vs informal situations.',
        icon: '👋',
        themeColor: '#6366f1',
        status: 'active',
        lessons: [
          {
            id: 'b1-u1-l1',
            unitId: 'b1-u1',
            lessonNumber: 1,
            title: 'Foundations of Saying Hello',
            subtitle: 'Morning, afternoon, evening greetings and polite check-ins',
            estimatedMinutes: 8,
            proficiencyLevel: 1,
            status: 'completed',
            conceptSummary: 'Master the difference between casual "Hey / Hi" and polite time-based greetings like "Good morning", "Good afternoon", and "Good evening".',
            whyItMatters: 'Using the right greeting immediately sets a welcoming and respectful tone, preventing awkwardness from the first second of speaking.',
            realLifeApplication: 'Greeting coworkers at 9 AM, meeting a neighbor, or greeting a shopkeeper.',
            targetPhrases: ['Good morning!', 'How are you doing?', 'I am doing well, thank you.'],
            grammarFocus: {
              topic: 'Greeting Formula & Time Boundaries',
              rule: 'Use "Good morning" until 12 PM (noon), "Good afternoon" from 12 PM to 5 PM, and "Good evening" after 5 PM. Never say "Good night" as a greeting; it is only a farewell!',
              formula: 'Greeting + Polite Question ("Good morning! How are you doing today?")',
              whyExplanation: 'In English, simply saying "Hello" is fine, but pairing it with a polite inquiry shows genuine engagement.',
              commonMistakes: [
                {
                  incorrect: 'Good night! How are you?',
                  correct: 'Good evening! How are you?',
                  why: '"Good night" is only used when leaving someone at night or going to bed, never when meeting someone.'
                },
                {
                  incorrect: 'I am fine. And you?',
                  correct: "I'm doing well, thank you! How about yourself?",
                  why: '"I am fine. And you?" is grammatically okay but sounds robotic and textbook-like.'
                }
              ]
            },
            vocabulary: [
              {
                id: 'v-greet',
                word: 'greet',
                meaning: 'To give a sign of welcome or recognition upon meeting someone.',
                simpleMeaning: 'Say hello to someone.',
                example: 'He always greets his colleagues with a warm smile.',
                pronunciation: '/ɡriːt/',
                teluguTranslation: 'పలకరించు (Palakarin̄cu)',
                hindiTranslation: 'अभिवादन करना (Abhivādan karnā)',
                usageContext: 'Everyday social and office encounters',
                collocations: ['greet warmly', 'greet by name'],
                synonyms: ['welcome', 'say hello']
              },
              {
                id: 'v-polite',
                word: 'polite',
                meaning: 'Having or showing behavior that is respectful and considerate of other people.',
                simpleMeaning: 'Respectful and well-mannered.',
                example: 'It is polite to say "please" and "thank you".',
                pronunciation: '/pəˈlaɪt/',
                teluguTranslation: 'మర్యాదపూర్వకమైన (Maryādapūrvakamaina)',
                hindiTranslation: 'विनम्र (Vinamra)',
                usageContext: 'Describing tone, communication, and demeanor',
                collocations: ['polite request', 'polite smile']
              }
            ],
            audioExamples: [
              {
                text: "Good morning, Priya! How are you doing today?",
                context: "Colleague arriving at office desk",
                speakerRole: "Team Lead",
                highlightWord: "Good morning"
              },
              {
                text: "I'm doing very well, thank you. How was your weekend?",
                context: "Colleague responding with reciprocal warmth",
                speakerRole: "Colleague",
                highlightWord: "doing very well"
              }
            ],
            speakingPrompt: {
              question: "Greet your teacher or coworker as you enter the room in the morning.",
              context: "You are stepping into a morning team meeting at 9:30 AM.",
              exampleAnswer: "Good morning everyone! How is everybody doing today?",
              suggestedStarters: ['Good morning...', "Morning! How's it...", "Hello everyone, hope you're..."]
            },
            exercises: [
              {
                id: 'ex-1',
                type: 'repeat',
                prompt: 'Listen and repeat clearly with rising morning intonation:',
                correctAnswer: 'Good morning! How are you doing today?',
                explanation: 'Notice how your pitch rises gently at the end of "today?".'
              },
              {
                id: 'ex-2',
                type: 'fill_gap',
                prompt: 'Complete the greeting for 3:00 PM: "Good ____, Mr. Rao!"',
                options: ['morning', 'afternoon', 'night'],
                correctAnswer: 'afternoon',
                explanation: '3:00 PM is after 12:00 noon, so "Good afternoon" is correct.'
              },
              {
                id: 'ex-3',
                type: 'rearrange',
                prompt: 'Arrange the words to form a polite response:',
                wordsForRearrange: ['doing', "I'm", 'well,', 'you.', 'thank'],
                correctAnswer: "I'm doing well, thank you.",
                explanation: "Subject + verb ('I am doing') followed by adverb ('well') and appreciation ('thank you')."
              },
              {
                id: 'ex-4',
                type: 'free_speak',
                prompt: 'Speak your own morning greeting to your AI conversation partner.',
                correctAnswer: 'Good morning! Nice to meet you today.',
                explanation: 'A great greeting sounds cheerful, audible, and confident.'
              }
            ],
            conversationScenario: {
              scenarioTitle: 'Morning Coffee Machine Encounter',
              context: 'You bump into Alex at the office pantry at 9:15 AM.',
              aiPartnerName: 'Alex',
              aiPartnerRole: 'Friendly Colleague',
              aiAvatar: '☕',
              initialMessage: "Hey there! Good morning. How are you holding up today?",
              suggestedResponses: [
                "Good morning, Alex! I'm doing great, just grabbing some coffee.",
                "Morning! A bit sleepy, but ready for the day. How about you?",
                "Hey! Doing well, thank you. Did you finish the report yesterday?"
              ]
            }
          },
          {
            id: 'b1-u1-l2',
            unitId: 'b1-u1',
            lessonNumber: 2,
            title: 'Meeting Someone for the First Time',
            subtitle: 'Names, origins, and natural introductions',
            estimatedMinutes: 10,
            proficiencyLevel: 1,
            status: 'available',
            conceptSummary: 'How to ask "What\'s your name?", say "Nice to meet you", and share where you are from without nervousness.',
            whyItMatters: 'Self-introductions happen in interviews, new jobs, college classes, and travel.',
            realLifeApplication: 'Introducing yourself to a new team member or at an event.',
            targetPhrases: ['Nice to meet you', 'May I know your name?', "I'm from Hyderabad."],
            grammarFocus: {
              topic: 'Verb "To Be" in Introductions',
              rule: 'Use "I am [Name]" or "My name is [Name]". Use "I am from [City/Country]" to express origin.',
              formula: 'Greeting + "My name is..." + "Pleased to meet you."',
              whyExplanation: 'Contracting "I am" to "I\'m" makes you sound instantly more natural and conversational.',
              commonMistakes: [
                {
                  incorrect: 'Myself Pavan.',
                  correct: "I'm Pavan. / My name is Pavan.",
                  why: '"Myself [Name]" is an incorrect Indian-English habit. Reflexive pronouns cannot stand alone as subjects.'
                }
              ]
            },
            vocabulary: [
              {
                id: 'v-introduce',
                word: 'introduce',
                meaning: 'To tell someone another person’s name or your own name upon first meeting.',
                simpleMeaning: 'Share who you are.',
                example: 'Allow me to introduce myself.',
                pronunciation: '/ˌɪn.trəˈdjuːs/',
                teluguTranslation: 'పరిచయం చేయు (Paricayaṁ cēyu)',
                hindiTranslation: 'परिचय कराना (Parichay karānā)',
                usageContext: 'First-time meetings and gatherings',
                collocations: ['introduce myself', 'introduce a friend']
              }
            ],
            audioExamples: [
              {
                text: "Hi, I'm Rahul. Nice to meet you!",
                context: "New colleague reaching out with a handshake",
                speakerRole: "Colleague",
                highlightWord: "Nice to meet you"
              }
            ],
            speakingPrompt: {
              question: "Introduce yourself: give your name and the city you come from.",
              context: "You just sat down next to someone at a seminar.",
              exampleAnswer: "Hi! My name is Pavan. I'm from Hyderabad. Nice to meet you!",
              suggestedStarters: ["Hi, I'm...", 'Hello, my name is...', 'Pleased to meet you, I am...']
            },
            exercises: [
              {
                id: 'ex-intro-1',
                type: 'repeat',
                prompt: 'Repeat out loud: "Hi, I\'m Pavan. Pleased to meet you!"',
                correctAnswer: "Hi, I'm Pavan. Pleased to meet you!",
                explanation: 'Keep a warm, smiling tone while saying "Pleased to meet you".'
              },
              {
                id: 'ex-intro-2',
                type: 'fill_gap',
                prompt: 'Fill in the blank: "____ to meet you!"',
                options: ['Nice', 'Happily', 'Fine'],
                correctAnswer: 'Nice',
                explanation: '"Nice to meet you" is the standard natural conversational idiom.'
              }
            ],
            conversationScenario: {
              scenarioTitle: 'First Day at Orientation',
              context: 'Sarah sits next to you and introduces herself.',
              aiPartnerName: 'Sarah',
              aiPartnerRole: 'Classmate / Colleague',
              aiAvatar: '👩‍💼',
              initialMessage: "Hi there! I think we're both new here. My name is Sarah. What's your name?",
              suggestedResponses: [
                "Hi Sarah! I'm Pavan. It's really nice to meet you.",
                "Hello Sarah! My name is Pavan. Are you also starting today?"
              ]
            }
          }
        ]
      },

      // UNIT 2: ME AND MY DAY
      {
        id: 'b1-u2',
        levelId: 'beginner_1',
        unitNumber: 2,
        title: 'Unit 2 — Me and My Day',
        subtitle: 'Student and office-employee daily routines',
        description: 'Describe your routine from morning coffee to bedtime. Compare student routines with office-worker schedules using simple present verbs, frequency adverbs, and time markers.',
        icon: '⏰',
        themeColor: '#0ea5e9',
        status: 'active',
        lessons: [
          {
            id: 'b1-u2-l1',
            unitId: 'b1-u2',
            lessonNumber: 1,
            title: 'Talking About My Morning Routine',
            subtitle: 'Waking up, getting ready, and having breakfast',
            estimatedMinutes: 10,
            proficiencyLevel: 1,
            status: 'learning',
            conceptSummary: 'Use Simple Present tense with time prepositions ("at 7 AM", "in the morning") to describe recurring daily habits.',
            whyItMatters: 'Daily routine is the #1 most common icebreaker in interviews, casual dates, and language exams.',
            realLifeApplication: 'Answering: "Tell me about your typical weekday."',
            targetPhrases: ['I wake up at...', 'I usually grab a coffee', 'Then I get ready for...'],
            grammarFocus: {
              topic: 'Simple Present + Time Prepositions (at / in / on)',
              rule: 'Use "at" with clock times (at 7:30). Use "in" with parts of the day (in the morning). Use frequency adverbs (always, usually, often, sometimes) before the main verb.',
              formula: 'Subject + Frequency Adverb + Verb + Time ("I usually wake up at 7 AM.")',
              visualDiagramType: 'commute_flow',
              whyExplanation: 'Simple present indicates a regular truth or habit, not an action happening right this second.',
              commonMistakes: [
                {
                  incorrect: 'I am waking up at 7 AM daily.',
                  correct: 'I wake up at 7 AM daily.',
                  why: 'Continuous tense (-ing) denotes right now. Habits require the simple present.'
                },
                {
                  incorrect: 'I wake up on 7 AM.',
                  correct: 'I wake up at 7 AM.',
                  why: 'Exact clock times always take the preposition "at".'
                }
              ]
            },
            vocabulary: [
              {
                id: 'v-routine',
                word: 'routine',
                meaning: 'A sequence of actions regularly followed; a fixed program.',
                simpleMeaning: 'Things you do regularly every day.',
                example: 'Exercise is an essential part of my morning routine.',
                pronunciation: '/ruːˈtiːn/',
                teluguTranslation: 'దినచర్య (Dinacarya)',
                hindiTranslation: 'दिनचर्या (Dincharyā)',
                usageContext: 'Daily habits and lifestyle',
                collocations: ['daily routine', 'morning routine', 'stick to a routine']
              },
              {
                id: 'v-commute',
                word: 'commute',
                meaning: 'Travel some distance between one’s home and place of work on a regular basis.',
                simpleMeaning: 'Travel to work or college and back.',
                example: 'I commute by metro train every morning.',
                pronunciation: '/kəˈmjuːt/',
                teluguTranslation: 'రోజూ ప్రయాణం చేయు (Rōjū prayāṇaṁ cēyu)',
                hindiTranslation: 'दैनिक यात्रा (Dainik yātrā)',
                usageContext: 'Workplace travel and transportation',
                collocations: ['daily commute', 'commute by bus', 'long commute']
              }
            ],
            audioExamples: [
              {
                text: "I usually wake up at 7 AM, brew a fresh cup of tea, and read the news for fifteen minutes.",
                context: "Describing morning habits naturally",
                speakerRole: "Office Worker",
                highlightWord: "wake up at"
              }
            ],
            speakingPrompt: {
              question: "What time do you usually wake up, and what is the very first thing you do?",
              context: "Your conversation partner asks about your morning habits.",
              exampleAnswer: "I usually wake up at 6:30 AM, drink a glass of water, and go for a quick walk.",
              suggestedStarters: ['Every morning I...', 'I usually wake up at...', 'The first thing I do is...']
            },
            exercises: [
              {
                id: 'ex-rout-1',
                type: 'fill_gap',
                prompt: 'Fill in the correct preposition: "I start my work ____ 9:00 AM."',
                options: ['at', 'in', 'on'],
                correctAnswer: 'at',
                explanation: 'Exact clock times always use "at".'
              },
              {
                id: 'ex-rout-2',
                type: 'rearrange',
                prompt: 'Rearrange into a natural morning routine sentence:',
                wordsForRearrange: ['usually', 'at', 'wake', 'up', 'I', '7:00.'],
                correctAnswer: 'I usually wake up at 7:00.',
                explanation: 'Frequency adverb "usually" goes right between subject "I" and verb "wake up".'
              }
            ],
            conversationScenario: {
              scenarioTitle: 'Comparing Daily Schedules',
              context: 'Elena asks you how your morning usually starts.',
              aiPartnerName: 'Elena',
              aiPartnerRole: 'Colleague',
              aiAvatar: '⏰',
              initialMessage: "Good morning! Tell me, are you a morning person? What time does your day usually start?",
              suggestedResponses: [
                "I'm definitely a morning person. I usually get up around 6 AM.",
                "Not really! I prefer sleeping in, so I wake up around 8 AM and hurry to work."
              ]
            }
          },
          {
            id: 'b1-u2-l2',
            unitId: 'b1-u2',
            lessonNumber: 2,
            title: 'Talking About Yesterday vs Today',
            subtitle: 'Moving between Present Simple and Past Simple',
            estimatedMinutes: 12,
            proficiencyLevel: 2,
            status: 'available',
            conceptSummary: 'Learn how verbs transform when you talk about yesterday ("I went", "I worked", "I saw") versus today ("I go", "I work").',
            whyItMatters: 'Mixing up past and present is the single most common reason beginners sound confusing.',
            realLifeApplication: 'Giving a standup update at work or telling a friend what you did yesterday.',
            targetPhrases: ['Yesterday I went to...', 'Last night I watched...', 'Today I have to...'],
            grammarFocus: {
              topic: 'Past Simple Irregular Verbs (go → went, see → saw, eat → ate)',
              rule: 'Completed past actions require the past tense form. Do not use "am" with past verbs (never "I am went").',
              formula: 'Yesterday / Last [time] + Subject + Past Verb ("Yesterday I went to office.")',
              visualDiagramType: 'tense_past',
              whyExplanation: 'Time words like "yesterday" anchor the action in the past, triggering past verb forms.',
              commonMistakes: [
                {
                  incorrect: 'Yesterday I am go to office.',
                  correct: 'Yesterday I went to the office.',
                  why: '"am go" is an impossible verb combination. Past tense of "go" is "went".'
                }
              ]
            },
            vocabulary: [
              {
                id: 'v-yesterday',
                word: 'yesterday',
                meaning: 'On the day before today.',
                simpleMeaning: 'The day before today.',
                example: 'Yesterday was a very productive day.',
                pronunciation: '/ˈjes.tə.deɪ/',
                teluguTranslation: 'నిన్న (Ninna)',
                hindiTranslation: 'कल / बीता हुआ कल (Kal)',
                usageContext: 'Past narratives',
                collocations: ['yesterday morning', 'yesterday afternoon']
              }
            ],
            audioExamples: [
              {
                text: "Yesterday I completed the client report and attended three team meetings.",
                context: "Workplace past update",
                speakerRole: "Software Engineer",
                highlightWord: "completed"
              }
            ],
            speakingPrompt: {
              question: "Tell me one thing you did yesterday evening after work or study.",
              context: "A friend asks how you spent your previous evening.",
              exampleAnswer: "Yesterday evening, I went to the gym and then had dinner with my family.",
              suggestedStarters: ['Yesterday I...', 'Last night I...', 'In the evening I went...']
            },
            exercises: [
              {
                id: 'ex-past-1',
                type: 'fill_gap',
                prompt: 'Choose the correct past verb: "Yesterday I ____ to the supermarket."',
                options: ['went', 'go', 'going'],
                correctAnswer: 'went',
                explanation: 'Past tense of "go" is "went".'
              }
            ],
            conversationScenario: {
              scenarioTitle: 'Catching Up After the Weekend',
              context: 'Alex asks what you did yesterday.',
              aiPartnerName: 'Alex',
              aiPartnerRole: 'Friend',
              aiAvatar: '😊',
              initialMessage: "Hey! How was your evening yesterday? Did you end up going anywhere exciting?",
              suggestedResponses: [
                "Yesterday I just stayed home and watched a documentary.",
                "I went to a new cafe with some friends, it was really nice!"
              ]
            }
          }
        ]
      },

      // UNIT 3: NEEDS AND WANTS
      {
        id: 'b1-u3',
        levelId: 'beginner_1',
        unitNumber: 3,
        title: 'Unit 3 — Needs and Wants',
        subtitle: 'Polite requests, ordering food, and asking for assistance',
        description: 'Transition from demanding phrasing like "I want" to polite native expressions: "I would like", "Could I have", "Can you help me", and "I need some information".',
        icon: '🛍️',
        themeColor: '#10b981',
        status: 'available',
        lessons: [
          {
            id: 'b1-u3-l1',
            unitId: 'b1-u3',
            lessonNumber: 1,
            title: 'Polite Ordering & "I Would Like"',
            subtitle: 'Replacing "I want" in cafes, shops, and restaurants',
            estimatedMinutes: 9,
            proficiencyLevel: 1,
            status: 'available',
            conceptSummary: 'Learn how to use "I\'d like..." (I would like) and "Could I have..." to sound polite, natural, and confident when asking for things.',
            whyItMatters: 'Saying "I want this" can sound rude or abrupt in English-speaking environments.',
            realLifeApplication: 'Ordering food, buying a train ticket, or requesting files at work.',
            targetPhrases: ["I'd like a cup of tea, please.", "Could I get the bill?", "Can you help me with this?"],
            grammarFocus: {
              topic: 'Modal Verbs for Politeness (Would like / Could / May)',
              rule: '"Would like" is a polite synonym for "want". "Could I" is a polite synonym for "Can I". Always add "please" at the end for courtesy.',
              formula: '"Could I please have [Item]?" OR "I\'d like [Item], please."',
              whyExplanation: 'Modal verbs soften the directness of a command, transforming it into a polite request.',
              commonMistakes: [
                {
                  incorrect: 'Give me one tea.',
                  correct: "Could I have a cup of tea, please? / I'd like a tea, please.",
                  why: '"Give me" sounds like an order/demand. Service workers expect polite modal phrasing.'
                }
              ]
            },
            vocabulary: [
              {
                id: 'v-request',
                word: 'request',
                meaning: 'An act of asking politely or formally for something.',
                simpleMeaning: 'Ask politely for something.',
                example: 'I submitted a request for leave.',
                pronunciation: '/rɪˈkwest/',
                teluguTranslation: 'అభ్యర్థన (Abhyarthana)',
                hindiTranslation: 'अनुरोध (Anurodh)',
                usageContext: 'Workplace and customer service',
                collocations: ['polite request', 'make a request']
              }
            ],
            audioExamples: [
              {
                text: "Hi, I'd like a hot cappuccino with oat milk, please.",
                context: "Ordering at a coffee shop counter",
                speakerRole: "Customer",
                highlightWord: "I'd like"
              }
            ],
            speakingPrompt: {
              question: "Order a drink and a snack politely at a cafe.",
              context: "The barista asks: 'What can I get started for you?'",
              exampleAnswer: "Could I please get an iced tea and a blueberry muffin?",
              suggestedStarters: ["I'd like...", 'Could I please have...', 'Can I get...']
            },
            exercises: [
              {
                id: 'ex-need-1',
                type: 'rearrange',
                prompt: 'Rearrange into a polite restaurant order:',
                wordsForRearrange: ['like', 'a', 'table', 'two,', "I'd", 'for', 'please.'],
                correctAnswer: "I'd like a table for two, please.",
                explanation: '"I\'d like" + object + "please" is the gold standard for polite requests.'
              }
            ],
            conversationScenario: {
              scenarioTitle: 'Ordering at a Cafe Counter',
              context: 'The cafe barista greets you with a notepad.',
              aiPartnerName: 'Barista',
              aiPartnerRole: 'Cafe Host',
              aiAvatar: '☕',
              initialMessage: "Welcome to Brew & Bean! What would you like to order today?",
              suggestedResponses: [
                "Hi! I'd like a black coffee with less sugar, please.",
                "Could I get a hot green tea and a sandwich?"
              ]
            }
          }
        ]
      },

      // UNIT 4: ME, MY FAMILY AND FRIENDS
      {
        id: 'b1-u4',
        levelId: 'beginner_1',
        unitNumber: 4,
        title: 'Unit 4 — Me, My Family & Friends',
        subtitle: 'Describing people, personalities, and relationships',
        description: 'Introduce family members and close friends. Describe what they do, their personalities, hobbies, appearance, and what you enjoy doing together.',
        icon: '👨‍👩‍👧',
        themeColor: '#f59e0b',
        status: 'available',
        lessons: [
          {
            id: 'b1-u4-l1',
            unitId: 'b1-u4',
            lessonNumber: 1,
            title: 'Describing People & Personalities',
            subtitle: 'Expanding simple descriptions into compound thoughts',
            estimatedMinutes: 10,
            proficiencyLevel: 1,
            status: 'available',
            conceptSummary: 'Transform basic short sentences ("He is my brother. He works in IT.") into natural connected sentences ("My brother works in an IT company, and we usually spend weekends playing cricket together.").',
            whyItMatters: 'Connecting sentences with "and", "but", and "because" is the bridge from beginner to conversational English.',
            realLifeApplication: 'Talking about your family during social chats, networking lunches, or interviews.',
            targetPhrases: ['He works as a...', 'She is very friendly and supportive', 'We usually spend time...'],
            grammarFocus: {
              topic: 'Conjunctions for Sentence Expansion (and, but, because)',
              rule: 'Use "and" to add information, "but" to show contrast, and "because" to give a reason.',
              formula: '[Sentence 1] + [Conjunction] + [Sentence 2]',
              whyExplanation: 'Strings of tiny 3-word sentences sound disjointed; conjunctions create smooth conversational flow.',
              commonMistakes: [
                {
                  incorrect: 'My brother he is working in Bangalore.',
                  correct: 'My brother works in Bangalore.',
                  why: 'Do not repeat the subject pronoun ("My brother he"). Use one subject only.'
                }
              ]
            },
            vocabulary: [
              {
                id: 'v-supportive',
                word: 'supportive',
                meaning: 'Providing encouragement or emotional help.',
                simpleMeaning: 'Always ready to help and encourage you.',
                example: 'My parents have always been very supportive of my career choices.',
                pronunciation: '/səˈpɔː.tɪv/',
                teluguTranslation: 'మద్దతు ఇచ్చే (Maddatu iccē)',
                hindiTranslation: 'सहायक / साथ देने वाला (Sahāyak)',
                usageContext: 'Describing family and friends',
                collocations: ['supportive friend', 'supportive family']
              }
            ],
            audioExamples: [
              {
                text: "My elder sister is a software architect, and she lives in Hyderabad with her family.",
                context: "Describing family member to a colleague",
                speakerRole: "Colleague",
                highlightWord: "and she lives"
              }
            ],
            speakingPrompt: {
              question: "Tell me about one close friend or family member: what do they do and what are they like?",
              context: "Your AI partner asks: 'Do you have siblings or close friends nearby?'",
              exampleAnswer: "My best friend is an engineer. He is very funny, and we love watching movies together on weekends.",
              suggestedStarters: ['My brother is...', 'One of my closest friends is...', 'My mother works as...']
            },
            exercises: [
              {
                id: 'ex-fam-1',
                type: 'fill_gap',
                prompt: 'Connect the sentences: "My brother likes sports, ____ I prefer reading books."',
                options: ['but', 'because', 'so'],
                correctAnswer: 'but',
                explanation: '"but" shows contrast between two different preferences.'
              }
            ],
            conversationScenario: {
              scenarioTitle: 'Sharing Weekend Plans with Friends',
              context: 'Alex asks about who you usually spend weekends with.',
              aiPartnerName: 'Alex',
              aiPartnerRole: 'Friend',
              aiAvatar: '👥',
              initialMessage: "Hey! Do you have family in town, or do you mostly hang out with your college friends?",
              suggestedResponses: [
                "My family lives nearby, so I usually visit them every Sunday for dinner.",
                "Most of my close friends work here, so we often grab dinner together on Saturdays."
              ]
            }
          }
        ]
      },

      // UNIT 5: TICK-TOCK TALK (QUESTION WORDS)
      {
        id: 'b1-u5',
        levelId: 'beginner_1',
        unitNumber: 5,
        title: 'Unit 5 — Tick-Tock Talk (Question Words)',
        subtitle: 'When, Where, What, Who, Why, How & How Often',
        description: 'Master how to ask sharp, clear questions. Understand the visual map of what each question word asks for: Time, Place, Reason, Manner, or Quantity.',
        icon: '❓',
        themeColor: '#8b5cf6',
        status: 'available',
        lessons: [
          {
            id: 'b1-u5-l1',
            unitId: 'b1-u5',
            lessonNumber: 1,
            title: 'Mastering the 5 Ws and H',
            subtitle: 'Asking about time, place, people, and reasons',
            estimatedMinutes: 10,
            proficiencyLevel: 2,
            status: 'available',
            conceptSummary: 'WHEN asks about time. WHERE asks about place. WHO asks about person. WHY asks about reason. HOW asks about method or quantity.',
            whyItMatters: 'A true conversation is a two-way street. You cannot be fluent if you can only answer questions but cannot ask them!',
            realLifeApplication: 'Asking interviewers questions, asking for directions, inquiring about project deadlines.',
            targetPhrases: ['When do you usually...?', 'Where is the nearest...?', 'Why did that happen?'],
            grammarFocus: {
              topic: 'Question Formation with Auxiliary Verbs (Do / Does / Is / Are)',
              rule: 'Question Word + Auxiliary Verb (Do/Does) + Subject + Base Verb? ("Where do you work?")',
              formula: 'Wh-Word + Aux + Subject + Verb? ("When do you wake up?")',
              visualDiagramType: 'question_word',
              whyExplanation: 'In English, question words require an auxiliary verb (do/does/is/are) before the subject.',
              commonMistakes: [
                {
                  incorrect: 'Where you are working?',
                  correct: 'Where do you work? / Where are you working?',
                  why: 'Questions require subject-auxiliary inversion (auxiliary before subject).'
                }
              ]
            },
            vocabulary: [
              {
                id: 'v-inquire',
                word: 'inquire',
                meaning: 'To ask for information from someone.',
                simpleMeaning: 'Ask a question.',
                example: 'I called the hotel to inquire about room availability.',
                pronunciation: '/ɪnˈkwaɪər/',
                teluguTranslation: 'విచారించు (Vicārin̄cu)',
                hindiTranslation: 'पूछताछ करना (Pūchhtāch karnā)',
                usageContext: 'Information gathering',
                collocations: ['inquire about', 'inquire politely']
              }
            ],
            audioExamples: [
              {
                text: "Where do you usually go for lunch around the office?",
                context: "Asking a colleague about local food spots",
                speakerRole: "Colleague",
                highlightWord: "Where do you"
              }
            ],
            speakingPrompt: {
              question: "Ask your AI partner 2 questions about their favorite place to visit.",
              context: "You want to learn more about where your partner likes to travel.",
              exampleAnswer: "Where is your favorite place to visit, and when do you usually travel there?",
              suggestedStarters: ['Where do you...', 'When is the best time to...', 'Why do you like...']
            },
            exercises: [
              {
                id: 'ex-q-1',
                type: 'fill_gap',
                prompt: 'Choose the question word for asking about location: "____ is the meeting room?"',
                options: ['Where', 'When', 'Why'],
                correctAnswer: 'Where',
                explanation: '"Where" asks about place or location.'
              }
            ],
            conversationScenario: {
              scenarioTitle: 'Asking for Office Guidance',
              context: 'You need information from David regarding office facilities.',
              aiPartnerName: 'David',
              aiPartnerRole: 'Office Guide',
              aiAvatar: '🏢',
              initialMessage: "Hi there! I'm here to help new team members. What questions do you have for me?",
              suggestedResponses: [
                "Where can I find the cafeteria?",
                "When does the team usually take lunch breaks?",
                "How do I book a conference room for afternoon meetings?"
              ]
            }
          }
        ]
      },

      // UNIT 6: VIBE CHECK (EMOTIONS & REACTIONS)
      {
        id: 'b1-u6',
        levelId: 'beginner_1',
        unitNumber: 6,
        title: 'Unit 6 — Vibe Check',
        subtitle: 'Expressing emotions, agreement, surprise & natural reactions',
        description: 'Stop saying "Yes" and "No" flatly. Learn natural conversational reactions: "That sounds awesome!", "I am a little tired", "Really?", "I don\'t think so", and "That makes total sense".',
        icon: '✨',
        themeColor: '#ec4899',
        status: 'available',
        lessons: [
          {
            id: 'b1-u6-l1',
            unitId: 'b1-u6',
            lessonNumber: 1,
            title: 'Conversational Reactions & Expressing Feelings',
            subtitle: 'Showing excitement, agreement, and gentle disagreement',
            estimatedMinutes: 9,
            proficiencyLevel: 2,
            status: 'available',
            conceptSummary: 'Learn expressive listening noises and reaction phrases so the speaker knows you are actively engaged.',
            whyItMatters: 'Native speakers react constantly while listening with phrases like "No way!", "That sounds great!", or "I see what you mean."',
            realLifeApplication: 'Chatting with friends, showing interest in a manager’s update, or reacting to good news.',
            targetPhrases: ['That sounds great!', "I'm a little tired today", "I don't think so", "Really? That is so interesting!"],
            grammarFocus: {
              topic: 'Sensory Verbs + Adjectives (sounds great, looks interesting, feels good)',
              rule: 'Verbs of perception (sound, look, feel, taste, smell) are followed directly by an adjective, not an adverb.',
              formula: '"That sounds [Adjective]!" ("That sounds amazing!")',
              whyExplanation: 'Using "That sounds..." validates what the other person just shared.',
              commonMistakes: [
                {
                  incorrect: 'That sounds nicely.',
                  correct: 'That sounds nice / great.',
                  why: 'Linking verbs take adjectives (nice), not adverbs (nicely).'
                }
              ]
            },
            vocabulary: [
              {
                id: 'v-exhausted',
                word: 'exhausted',
                meaning: 'Completely drained of physical or mental energy; extremely tired.',
                simpleMeaning: 'Very, very tired.',
                example: 'After the long flight, I was completely exhausted.',
                pronunciation: '/ɪɡˈzɔː.stɪd/',
                teluguTranslation: 'విశ్రాంతి లేని అలసట (Alasaṭa)',
                hindiTranslation: 'बहुत थका हुआ (Bahut thakā huā)',
                usageContext: 'Expressing fatigue naturally',
                collocations: ['completely exhausted', 'feel exhausted']
              }
            ],
            audioExamples: [
              {
                text: "That sounds like a wonderful plan! I'd love to join you guys.",
                context: "Reacting excitedly to a weekend plan",
                speakerRole: "Friend",
                highlightWord: "That sounds like"
              }
            ],
            speakingPrompt: {
              question: "React to a friend who just told you they won tickets to a concert.",
              context: "Your friend says: 'Guess what? I just won two free tickets to the A.R. Rahman concert!'",
              exampleAnswer: "No way! That is so exciting! Congratulations!",
              suggestedStarters: ['No way, that...', 'Really? That sounds...', 'Wow, I am so...']
            },
            exercises: [
              {
                id: 'ex-vibe-1',
                type: 'fill_gap',
                prompt: 'Choose the natural reaction to good news: "That ____ amazing!"',
                options: ['sounds', 'is hearing', 'listens'],
                correctAnswer: 'sounds',
                explanation: '"That sounds amazing" is the standard conversational reaction.'
              }
            ],
            conversationScenario: {
              scenarioTitle: 'Sharing Good News at Lunch',
              context: 'Maya shares an exciting update about her project.',
              aiPartnerName: 'Maya',
              aiPartnerRole: 'Colleague',
              aiAvatar: '🎉',
              initialMessage: "Pavan! You won't believe it — our client just approved the new product design with zero changes!",
              suggestedResponses: [
                "That's fantastic news! You worked so hard on that design.",
                "Really? Wow, that sounds incredible! Congratulations!"
              ]
            }
          }
        ]
      }
    ]
  },

  // ==========================================
  // 2. BEGINNER LEVEL 2 (Proficiency: Level 3)
  // ==========================================
  {
    id: 'beginner_2',
    title: 'Beginner Level 2',
    label: 'Beginner Level 2',
    category: 'Beginner',
    proficiencyRating: 3,
    proficiencyName: 'Elementary',
    description: 'Transition into active conversational flow: sports discussions, workplace tasks and status updates, making movie plans, navigating new travel destinations, and shopping bargaining.',
    competencyOutcome: 'Can communicate in simple and routine tasks requiring a direct exchange of information on familiar and routine matters.',
    status: 'locked',
    units: [
      {
        id: 'b2-u1',
        levelId: 'beginner_2',
        unitNumber: 1,
        title: 'Unit 1 — India Won the World Cup',
        subtitle: 'Sports, events, excitement, and storytelling',
        description: 'Learn how to talk about live sporting matches, describe thrilling moments, share passionate opinions, agree, disagree, and narrate events.',
        icon: '🏆',
        themeColor: '#f97316',
        status: 'locked',
        lessons: [
          {
            id: 'b2-u1-l1',
            unitId: 'b2-u1',
            lessonNumber: 1,
            title: 'Narrating a Thrilling Match',
            subtitle: 'Describing turning points and dramatic finishes',
            estimatedMinutes: 12,
            proficiencyLevel: 3,
            status: 'locked',
            conceptSummary: 'Use Past Continuous and Past Simple together ("While everyone was watching nervously, Kohli hit a boundary") to create narrative tension.',
            whyItMatters: 'Sports is the universal language of social small talk in offices, cafes, and rideshares across the world.',
            realLifeApplication: 'Chatting with colleagues about yesterday’s cricket or football match.',
            targetPhrases: ['Did you watch the match yesterday?', 'It was a nail-biter finish!', 'What a phenomenal shot!'],
            grammarFocus: {
              topic: 'Past Continuous + Past Simple Interruption',
              rule: 'Use Past Continuous (was/were + -ing) for background action, interrupted by Past Simple for the sudden event.',
              formula: 'While / As + [Past Continuous], [Past Simple]',
              whyExplanation: 'This grammar structure gives stories momentum and suspense.',
              commonMistakes: [
                {
                  incorrect: 'When match was going, he is hitting six.',
                  correct: 'While the match was going on, he hit a six.',
                  why: 'Keep tenses consistent in the past; use "hit" (past) rather than present continuous.'
                }
              ]
            },
            vocabulary: [
              {
                id: 'v-thrilling',
                word: 'thrilling',
                meaning: 'Causing excitement and a sudden wave of keen emotion.',
                simpleMeaning: 'Super exciting.',
                example: 'It was a thrilling victory in the final over.',
                pronunciation: '/ˈθrɪl.ɪŋ/',
                teluguTranslation: 'ఉత్కంఠభరితమైన (Utkaṇṭhabharitamaina)',
                hindiTranslation: 'रोमांचक (Romānchak)',
                usageContext: 'Sports and entertainment',
                collocations: ['thrilling match', 'thrilling experience']
              }
            ],
            audioExamples: [
              {
                text: "Did you catch the World Cup final last night? That last over was unbelievable!",
                context: "Opening sports small talk at work",
                speakerRole: "Colleague",
                highlightWord: "nail-biter"
              }
            ],
            speakingPrompt: {
              question: "Tell me about an exciting sports game or tournament you watched recently.",
              context: "Your coworker asks if you watched the recent tournament.",
              exampleAnswer: "Yes! India played brilliantly in the final overs. The bowling in the death overs was top notch.",
              suggestedStarters: ['I watched the match and...', 'It was such an exciting game because...']
            },
            exercises: [
              {
                id: 'ex-sport-1',
                type: 'fill_gap',
                prompt: 'Choose the idiom meaning extremely close and tense: "It was a real ____ finish!"',
                options: ['nail-biter', 'finger-cutter', 'time-saver'],
                correctAnswer: 'nail-biter',
                explanation: '"Nail-biter" describes an event where you are so nervous you bite your nails.'
              }
            ],
            conversationScenario: {
              scenarioTitle: 'Monday Morning Water Cooler Sports Talk',
              context: 'Ravi asks for your thoughts on yesterday\'s victory.',
              aiPartnerName: 'Ravi',
              aiPartnerRole: 'Colleague & Sports Fan',
              aiAvatar: '🏏',
              initialMessage: "Man, did you see that catch in the nineteenth over yesterday? What a comeback!",
              suggestedResponses: [
                "Absolutely unreal! I thought we were going to lose, but that catch changed everything.",
                "I missed the first half, but I watched the final three overs live. Pure adrenaline!"
              ]
            }
          }
        ]
      },
      {
        id: 'b2-u2',
        levelId: 'beginner_2',
        unitNumber: 2,
        title: 'Unit 2 — Office to Office',
        subtitle: 'Reports, presentations, meetings, and workplace etiquette',
        description: 'Focus heavily on workplace English: asking for report help, status updates, requesting files, asking for clarification, and politely scheduling meetings.',
        icon: '💼',
        themeColor: '#0284c7',
        status: 'locked',
        lessons: [
          {
            id: 'b2-u2-l1',
            unitId: 'b2-u2',
            lessonNumber: 1,
            title: 'Polite Workplace Requests & Status Updates',
            subtitle: 'Communicating clearly with managers and teammates',
            estimatedMinutes: 12,
            proficiencyLevel: 3,
            status: 'locked',
            conceptSummary: 'Master corporate email/message phrasing: "Could you send me the file?", "I have completed the task", "I need some clarification on this requirement."',
            whyItMatters: 'Clear professional phrasing builds your reputation as an articulate and dependable teammate.',
            realLifeApplication: 'Daily standups, Slack/Teams chats, and email communication.',
            targetPhrases: ['Could you please review this?', 'I am currently blocked on...', 'Let me follow up on that.'],
            grammarFocus: {
              topic: 'Present Perfect for Recent Achievements ("I have completed")',
              rule: 'Use "have / has + past participle" to announce completed work without naming an exact past time.',
              formula: 'Subject + have/has + past participle ("I have finished the presentation.")',
              whyExplanation: 'Present perfect connects past completion directly to present readiness.',
              commonMistakes: [
                {
                  incorrect: 'I completed the task just now yesterday.',
                  correct: 'I have completed the task.',
                  why: 'Do not mix "just now" with specific past dates.'
                }
              ]
            },
            vocabulary: [
              {
                id: 'v-clarification',
                word: 'clarification',
                meaning: 'The action of making a statement or situation less confused and more comprehensible.',
                simpleMeaning: 'Asking for clearer explanation.',
                example: 'Could you provide some clarification on the client requirements?',
                pronunciation: '/ˌklær.ɪ.fɪˈkeɪ.ʃən/',
                teluguTranslation: 'స్పష్టత (Spaṣṭata)',
                hindiTranslation: 'स्पष्टीकरण (Spaṣṭīkaraṇ)',
                usageContext: 'Meetings and email updates',
                collocations: ['seek clarification', 'provide clarification']
              }
            ],
            audioExamples: [
              {
                text: "Hi Priya, could you please review the slide deck before our client demo at 3 PM?",
                context: "Asking for peer review respectfully",
                speakerRole: "Project Lead",
                highlightWord: "could you please review"
              }
            ],
            speakingPrompt: {
              question: "Give a 30-second standup status update: what did you finish, and what are you working on today?",
              context: "Your manager asks: 'Pavan, what is your status for today?'",
              exampleAnswer: "Yesterday I completed the API integration. Today I'm testing edge cases. No blockers so far.",
              suggestedStarters: ['Yesterday I finished...', 'Today my focus is on...', 'I have completed...']
            },
            exercises: [
              {
                id: 'ex-off-1',
                type: 'fill_gap',
                prompt: 'Complete the status: "I have ____ the report for the finance team."',
                options: ['submitted', 'submit', 'submitting'],
                correctAnswer: 'submitted',
                explanation: 'Present perfect takes the past participle: "have submitted".'
              }
            ],
            conversationScenario: {
              scenarioTitle: 'Morning Sprint Standup',
              context: 'Elena conducts the sprint standup update.',
              aiPartnerName: 'Elena',
              aiPartnerRole: 'Project Manager',
              aiAvatar: '👩‍💼',
              initialMessage: "Good morning team. Pavan, could you give us a quick update on your deliverables?",
              suggestedResponses: [
                "Morning Elena! I have completed the database query fixes. Today I'll collaborate with design.",
                "Hi Elena. I've finished the draft slides. I just need quick clarification from product before publishing."
              ]
            }
          }
        ]
      },
      {
        id: 'b2-u3',
        levelId: 'beginner_2',
        unitNumber: 3,
        title: 'Unit 3 — Movie Night',
        subtitle: 'Making plans, suggestions, opinions & preferences',
        description: 'Plan an evening with friends: picking show timings, debating genres, ordering theater popcorn, and sharing movie reviews afterwards.',
        icon: '🎬',
        themeColor: '#a855f7',
        status: 'locked',
        lessons: []
      },
      {
        id: 'b2-u4',
        levelId: 'beginner_2',
        unitNumber: 4,
        title: 'Unit 4 — Visiting New Places',
        subtitle: 'Directions, transit, hotels & sightseeing',
        description: 'Navigate new cities: asking locals for landmarks, buying metro cards, checking in at hotels, and asking for restaurant recommendations.',
        icon: '🧭',
        themeColor: '#14b8a6',
        status: 'locked',
        lessons: []
      },
      {
        id: 'b2-u5',
        levelId: 'beginner_2',
        unitNumber: 5,
        title: 'Unit 5 — Chit Chat (Small Talk Mastery)',
        subtitle: 'The 5-step conversational loop',
        description: 'Master the universal small talk engine: Start conversation → Continue naturally → Ask follow-up question → Respond with empathy → End politely.',
        icon: '💬',
        themeColor: '#f43f5e',
        status: 'locked',
        lessons: []
      },
      {
        id: 'b2-u6',
        levelId: 'beginner_2',
        unitNumber: 6,
        title: 'Unit 6 — Shop Talk',
        subtitle: 'Bargaining, sizes, availability & returns',
        description: 'Interact with store clerks: asking for different colors or sizes, politely checking return policies, inquiring about discounts, and sorting billing issues.',
        icon: '🛒',
        themeColor: '#eab308',
        status: 'locked',
        lessons: []
      }
    ]
  },

  // ==========================================
  // 3. INTERMEDIATE LEVEL 1 (Proficiency: Level 4)
  // ==========================================
  {
    id: 'intermediate_1',
    title: 'Intermediate Level 1',
    label: 'Intermediate Level 1',
    category: 'Intermediate',
    proficiencyRating: 4,
    proficiencyName: 'Lower Intermediate',
    description: 'Developing fluency and personal voice: storytelling, food and lifestyle comparisons, trip planning, celebration invitations, and articulating long-term career ambitions.',
    competencyOutcome: 'Can enter unprepared into conversations on familiar topics, express personal opinions, and narrate a story or describe an experience.',
    status: 'locked',
    units: [
      {
        id: 'i1-u1',
        levelId: 'intermediate_1',
        unitNumber: 1,
        title: 'Unit 1 — Best Friend & Memories',
        subtitle: 'Storytelling, personalities, and shared life chapters',
        description: 'Narrate how you met your closest friends, share childhood memories, and describe personality traits using expressive adjectives.',
        icon: '🤝',
        themeColor: '#3b82f6',
        status: 'locked',
        lessons: []
      },
      {
        id: 'i1-u2',
        levelId: 'intermediate_1',
        unitNumber: 2,
        title: 'Unit 2 — Samosa or Salad?',
        subtitle: 'Preferences, health debates & comparative analysis',
        description: 'Debate street food versus healthy habits, compare lifestyles, justify choices with evidence, and respect opposing viewpoints.',
        icon: '🥗',
        themeColor: '#84cc16',
        status: 'locked',
        lessons: []
      },
      {
        id: 'i1-u3',
        levelId: 'intermediate_1',
        unitNumber: 3,
        title: 'Unit 3 — Let\'s Plan a Trip',
        subtitle: 'Budgeting, transportation, itinerary & problem solving',
        description: 'Collaborate on travel itineraries, evaluate flight vs train options, discuss hotel bookings, and handle sudden schedule changes.',
        icon: '✈️',
        themeColor: '#06b6d4',
        status: 'locked',
        lessons: []
      },
      {
        id: 'i1-u4',
        levelId: 'intermediate_1',
        unitNumber: 4,
        title: 'Unit 4 — Life is a Party',
        subtitle: 'Invitations, celebrations, and festive gatherings',
        description: 'Extend warm invitations, RSVP politely, toast achievements, mingle with unfamiliar guests, and share festive traditions.',
        icon: '🎉',
        themeColor: '#d946ef',
        status: 'locked',
        lessons: []
      },
      {
        id: 'i1-u5',
        levelId: 'intermediate_1',
        unitNumber: 5,
        title: 'Unit 5 — My Dream',
        subtitle: 'Ambitions, goals, future visions & long-form speaking',
        description: 'Speak for 2-3 uninterrupted minutes describing your personal vision, professional goals, and what motivates you to achieve them.',
        icon: '🚀',
        themeColor: '#f59e0b',
        status: 'locked',
        lessons: []
      }
    ]
  },

  // ==========================================
  // 4. INTERMEDIATE LEVEL 2 (Proficiency: Level 5)
  // ==========================================
  {
    id: 'intermediate_2',
    title: 'Intermediate Level 2',
    label: 'Intermediate Level 2',
    category: 'Intermediate',
    proficiencyRating: 5,
    proficiencyName: 'Intermediate',
    description: 'High-stakes practical communication: job interviews, professional workplace dynamics, digital communication on social media, and customer care diplomacy.',
    competencyOutcome: 'Can deal with most situations likely to arise, connect phrases in a unified way, and describe hopes, ambitions, and briefly give reasons for opinions.',
    status: 'locked',
    units: [
      {
        id: 'i2-u1',
        levelId: 'intermediate_2',
        unitNumber: 1,
        title: 'Unit 1 — My First Interview',
        subtitle: 'STAR method, strengths, weaknesses & career goals',
        description: 'Ace job interviews: master the 90-second self-introduction, frame weaknesses constructively, answer behavioral questions, and ask intelligent questions to the interviewer.',
        icon: '🎯',
        themeColor: '#6366f1',
        status: 'locked',
        lessons: []
      },
      {
        id: 'i2-u2',
        levelId: 'intermediate_2',
        unitNumber: 2,
        title: 'Unit 2 — My Professional Life',
        subtitle: 'Responsibilities, teamwork, deadlines & conflict',
        description: 'Communicate with authority in meetings, manage tight deadlines, request resource support from managers, and resolve team friction professionally.',
        icon: '🏢',
        themeColor: '#0ea5e9',
        status: 'locked',
        lessons: []
      },
      {
        id: 'i2-u3',
        levelId: 'intermediate_2',
        unitNumber: 3,
        title: 'Unit 3 — Friendship & Deeper Bonds',
        subtitle: 'Navigating disagreements, vulnerability & support',
        description: 'Engage in thoughtful, mature discussions: apologize when mistakes happen, express empathy during hard times, and maintain strong interpersonal relationships.',
        icon: '❤️',
        themeColor: '#ec4899',
        status: 'locked',
        lessons: []
      },
      {
        id: 'i2-u4',
        levelId: 'intermediate_2',
        unitNumber: 4,
        title: 'Unit 4 — Instagram & Digital Life',
        subtitle: 'Trends, creator culture & societal pros and cons',
        description: 'Discuss digital well-being, content algorithms, online marketing, and debate the social implications of living in an ultra-connected world.',
        icon: '📱',
        themeColor: '#f43f5e',
        status: 'locked',
        lessons: []
      },
      {
        id: 'i2-u5',
        levelId: 'intermediate_2',
        unitNumber: 5,
        title: 'Unit 5 — Customer Care & Diplomacy',
        subtitle: 'Handling complaints, empathy & finding solutions',
        description: 'Roleplay both sides of customer service: explain a billing or delivery defect politely yet firmly, and practice support agent empathy and problem-solving.',
        icon: '🎧',
        themeColor: '#10b981',
        status: 'locked',
        lessons: []
      }
    ]
  },

  // ==========================================
  // 5. ADVANCED LEVEL 1 (Proficiency: Level 6 & 7)
  // ==========================================
  {
    id: 'advanced_1',
    title: 'Advanced Level 1',
    label: 'Advanced Level 1',
    category: 'Advanced',
    proficiencyRating: 6,
    proficiencyName: 'Upper Intermediate',
    description: 'Polishing corporate influence and nuanced articulation: LinkedIn networking, work-life balance debates, structured discourse connectors, and international travel.',
    competencyOutcome: 'Can interact with a high degree of fluency and spontaneity, express viewpoints on topical issues giving advantages and disadvantages of various options.',
    status: 'locked',
    units: [
      {
        id: 'a1-u1',
        levelId: 'advanced_1',
        unitNumber: 1,
        title: 'Unit 1 — LinkedIn & Executive Networking',
        subtitle: 'Profiles, messaging recruiters & thought leadership',
        description: 'Write compelling connection notes, introduce yourself to senior executives, message recruiters with tact, and articulate career milestones.',
        icon: '🌐',
        themeColor: '#0284c7',
        status: 'locked',
        lessons: []
      },
      {
        id: 'a1-u2',
        levelId: 'advanced_1',
        unitNumber: 2,
        title: 'Unit 2 — Work-Life Balance',
        subtitle: 'Structured argumentation, evidence & corporate boundaries',
        description: 'Articulate nuanced opinions on remote work, burnout, productivity metrics, and leadership expectations using structured argument frameworks.',
        icon: '⚖️',
        themeColor: '#6366f1',
        status: 'locked',
        lessons: []
      },
      {
        id: 'a1-u3',
        levelId: 'advanced_1',
        unitNumber: 3,
        title: 'Unit 3 — Online vs Offline',
        subtitle: 'Debate connectors (In my opinion, On the other hand, Therefore)',
        description: 'Master advanced discourse markers to structure debates: comparing physical education with online learning, e-commerce with retail, and human interaction with AI.',
        icon: '💻',
        themeColor: '#8b5cf6',
        status: 'locked',
        lessons: []
      },
      {
        id: 'a1-u4',
        levelId: 'advanced_1',
        unitNumber: 4,
        title: 'Unit 4 — Movie or Web Series',
        subtitle: 'In-depth critique, character psychology & plot analysis',
        description: 'Analyze cinema and literature beyond basic likes: discuss pacing, character arcs, thematic motifs, and direct critiques without spoilers.',
        icon: '🎥',
        themeColor: '#a855f7',
        status: 'locked',
        lessons: []
      },
      {
        id: 'a1-u5',
        levelId: 'advanced_1',
        unitNumber: 5,
        title: 'Unit 5 — Checking in at a Hotel',
        subtitle: 'High-touch hospitality & resolving unexpected complications',
        description: 'Handle sophisticated international travel scenarios: requesting suite upgrades, resolving booking discrepancies, and clarifying conference venue logistics.',
        icon: '🏨',
        themeColor: '#059669',
        status: 'locked',
        lessons: []
      },
      {
        id: 'a1-u6',
        levelId: 'advanced_1',
        unitNumber: 6,
        title: 'Unit 6 — Jobs, Salary & Career Transitions',
        subtitle: 'Negotiations, promotions & strategic career planning',
        description: 'Negotiate compensation packages, discuss equity and perks, ask for well-deserved promotions, and discuss career pivots persuasively.',
        icon: '📈',
        themeColor: '#10b981',
        status: 'locked',
        lessons: []
      },
      {
        id: 'a1-u7',
        levelId: 'advanced_1',
        unitNumber: 7,
        title: 'Unit 7 — My Foreign Trip',
        subtitle: 'International immigration, transit & cross-cultural nuance',
        description: 'Answer border control questions calmly, adapt to global English accents, and navigate foreign transportation and dining etiquette effortlessly.',
        icon: '🌍',
        themeColor: '#f59e0b',
        status: 'locked',
        lessons: []
      }
    ]
  },

  // ==========================================
  // 6. ADVANCED LEVEL 2 (Proficiency: Level 8)
  // ==========================================
  {
    id: 'advanced_2',
    title: 'Advanced Level 2',
    label: 'Advanced Level 2',
    category: 'Advanced',
    proficiencyRating: 8,
    proficiencyName: 'Professional & Fluent',
    description: 'Executive speaking mastery: boardroom presentations, leadership persuasion, spontaneous debate, and simplifying complex abstract ideas effortlessly.',
    competencyOutcome: 'Can express oneself spontaneously, very fluently and precisely, differentiating finer shades of meaning even in more complex situations.',
    status: 'locked',
    units: [
      {
        id: 'a2-u1',
        levelId: 'advanced_2',
        unitNumber: 1,
        title: 'Unit 1 — Executive Boardroom Presentations',
        subtitle: 'Persuasion, storytelling, and defending proposals',
        description: 'Deliver crisp 5-minute business pitches, handle hostile questions from stakeholders with composure, and influence decisions using data storytelling.',
        icon: '📊',
        themeColor: '#4f46e5',
        status: 'locked',
        lessons: []
      },
      {
        id: 'a2-u2',
        levelId: 'advanced_2',
        unitNumber: 2,
        title: 'Unit 2 — Society, Ethics & Future Technology',
        subtitle: 'Abstract conversations, artificial intelligence & global trends',
        description: 'Articulate complex intellectual viewpoints on automation, biotechnology, environmental policy, and societal equity without hesitation.',
        icon: '🧬',
        themeColor: '#0284c7',
        status: 'locked',
        lessons: []
      },
      {
        id: 'a2-u3',
        levelId: 'advanced_2',
        unitNumber: 3,
        title: 'Unit 3 — Impromptu Speaking & High-Pressure Debate',
        subtitle: 'Thinking on your feet & explaining complex ideas simply',
        description: 'Master spontaneous 2-minute impromptu speaking drills: zero prep time, no filler words, logical structure, and memorable conclusions.',
        icon: '⚡',
        themeColor: '#e11d48',
        status: 'locked',
        lessons: []
      }
    ]
  }
];
