import {
  CoreJourneyPlanItem,
  SentenceBuildingExercise,
  ThinkInEnglishItem,
  ConversationRecoveryCard,
  ConfidenceJournalEntry,
  FullMapLocation,
} from '../types/coreJourney';
import { CurriculumUnit } from '../types/curriculum';

// 1. Core Learning Journey Steps (Part 22)
export const CORE_JOURNEY_STEPS: CoreJourneyPlanItem[] = [
  {
    id: 'step-1-level',
    stepNumber: 1,
    stage: 'choose_level',
    title: 'Select Your Starting Level',
    subtitle: 'Beginner 1 to Advanced 2',
    description: 'Calibrate your learning journey from Zero/Beginner 1 through Advanced 2.',
    actionRequired: 'Review your calibrated proficiency level',
    completed: true,
    targetRoute: '/learn',
    routeTarget: '/learn',
    estimatedMinutes: 2,
  },
  {
    id: 'step-2-concept',
    stepNumber: 2,
    stage: 'learn_concept',
    title: 'Understand the Core Concept',
    subtitle: 'Rules without confusion',
    description: 'Learn the grammar formula, meaning, and why it matters in real conversation.',
    actionRequired: 'Read concise explanation with formula',
    completed: true,
    targetRoute: '/learn',
    routeTarget: '/learn',
    estimatedMinutes: 5,
  },
  {
    id: 'step-3-examples',
    stepNumber: 3,
    stage: 'understand_examples',
    title: 'Hear & Compare Real Examples',
    subtitle: 'Bilingual audio explanations',
    description: 'Listen to spoken native examples with Telugu and Hindi explanation support.',
    actionRequired: 'Listen to 3 real-world spoken models',
    completed: true,
    targetRoute: '/learn',
    routeTarget: '/learn',
    estimatedMinutes: 5,
  },
  {
    id: 'step-4-sentence-lab',
    stepNumber: 4,
    stage: 'sentence_building',
    title: 'Sentence-Building Laboratory',
    subtitle: 'Subject + Verb + Object blocks',
    description: 'Construct sentences from elements: Subject + Verb + Object + Polite endings.',
    actionRequired: 'Assemble sentence blocks in proper sequence',
    completed: false,
    targetRoute: '/sentence-lab',
    routeTarget: '/sentence-lab',
    estimatedMinutes: 8,
  },
  {
    id: 'step-5-speak-guided',
    stepNumber: 5,
    stage: 'speak_guided',
    title: 'Guided Speaking Practice',
    subtitle: 'Jarvis coach with scaffolding',
    description: 'Speak aloud using voice recognition with gentle AI scaffolding and hints.',
    actionRequired: 'Speak the target phrase with microphone',
    completed: false,
    targetRoute: '/talk/jarvis',
    routeTarget: '/talk/jarvis',
    estimatedMinutes: 10,
  },
  {
    id: 'step-6-feedback',
    stepNumber: 6,
    stage: 'receive_feedback',
    title: 'Detailed Feedback & Evidence',
    subtitle: 'Pronunciation & accuracy review',
    description: 'Review pronunciation, grammar accuracy, pacing, and vocabulary variety.',
    actionRequired: 'Review feedback breakdown and tips',
    completed: false,
    targetRoute: '/progress',
    routeTarget: '/progress',
    estimatedMinutes: 3,
  },
  {
    id: 'step-7-mistakes',
    stepNumber: 7,
    stage: 'correct_mistakes',
    title: 'Understand & Fix Mistakes',
    subtitle: 'Why is this wrong? explanations',
    description: 'Explore "Why is this wrong?" explanations instead of mere red crosses.',
    actionRequired: 'Review root-cause mistake explanations',
    completed: false,
    targetRoute: '/mistakes',
    routeTarget: '/mistakes',
    estimatedMinutes: 5,
  },
  {
    id: 'step-8-independent',
    stepNumber: 8,
    stage: 'repeat_independent',
    title: 'Speak Independently',
    subtitle: 'Spontaneous speech & roleplay',
    description: 'Produce original sentences and roleplay without pre-written sentence templates.',
    actionRequired: 'Complete open-ended scenario speaking',
    completed: false,
    targetRoute: '/roleplay',
    routeTarget: '/roleplay',
    estimatedMinutes: 10,
  },
  {
    id: 'step-9-test',
    stepNumber: 9,
    stage: 'take_test',
    title: 'Practical Check & Assessment',
    subtitle: 'Real-world transfer testing',
    description: 'Demonstrate transfer understanding in unexpected conversation checks.',
    actionRequired: 'Pass short mastery & transfer quiz',
    completed: false,
    targetRoute: '/test',
    routeTarget: '/test',
    estimatedMinutes: 8,
  },
  {
    id: 'step-10-progress',
    stepNumber: 10,
    stage: 'review_progress',
    title: 'Review Progress & Milestones',
    subtitle: 'Speaking & fluency analytics',
    description: 'Track evidence across speaking, listening, vocabulary, and grammar confidence.',
    actionRequired: 'Check CEFR level and fluency growth',
    completed: false,
    targetRoute: '/progress',
    routeTarget: '/progress',
    estimatedMinutes: 3,
  },
  {
    id: 'step-11-next',
    stepNumber: 11,
    stage: 'next_lesson',
    title: 'Advance to Next Lesson',
    subtitle: 'Continue progressive path',
    description: 'Seamlessly transition to the next unit on your personalized roadmap.',
    actionRequired: 'Unlock and launch the next unit',
    completed: false,
    targetRoute: '/learn',
    routeTarget: '/learn',
    estimatedMinutes: 2,
  },
];

// 2. Unit 0: Start from Zero — Alphabet, Letter Sounds & Everyday Foundations
export const ZERO_LEVEL_FOUNDATIONS_UNIT: CurriculumUnit = {
  id: 'b1-u0',
  levelId: 'beginner_1',
  unitNumber: 0,
  title: 'Unit 0 — Start from Zero: Alphabet, Phonics & First Words',
  subtitle: 'Letter recognition, phonics patterns, numbers, colors & saying your name',
  description: 'Gentle, zero-pressure starting point for absolute beginners, young children, and adult beginners learning English from the very beginning.',
  icon: '🔤',
  themeColor: '#0ea5e9',
  status: 'active',
  lessons: [
    {
      id: 'b1-u0-l1',
      unitId: 'b1-u0',
      lessonNumber: 1,
      title: 'The English Alphabet & Core Letter Sounds',
      subtitle: 'Recognize letters A to Z and their natural sounds',
      estimatedMinutes: 8,
      proficiencyLevel: 1,
      status: 'available',
      conceptSummary: 'Learn the 26 letters of the English alphabet, distinguishing vowels (A, E, I, O, U) from consonants.',
      whyItMatters: 'Every English word is made of these 26 letters and their sounds. Knowing the sounds gives you the power to pronounce any word clearly.',
      realLifeApplication: 'Spelling your name at a ticket counter, reading street signs, and pronouncing new words.',
      targetPhrases: ['A is for Apple', 'B is for Book', 'C is for Cat', 'Can you spell your name?'],
      grammarFocus: {
        topic: 'Letter Recognition & Vowels vs Consonants',
        rule: 'English has 26 letters. The 5 vowels are A, E, I, O, U. The other 21 letters are consonants.',
        formula: 'Letter + Sound + Example Word (e.g. "B" makes the /b/ sound as in "Ball")',
        whyExplanation: 'Vowels give words their open voice sounds, while consonants shape the beginnings and endings.',
        commonMistakes: [
          {
            incorrect: 'Confusing B and D sounds',
            correct: 'B has lips pressed together (/b/); D has tongue behind upper teeth (/d/)',
            why: 'Practicing mouth and tongue positions eliminates pronunciation confusion.'
          }
        ]
      },
      vocabulary: [
        {
          id: 'v-alphabet-letter',
          word: 'letter',
          meaning: 'A written symbol used to represent a speech sound.',
          simpleMeaning: 'A character like A, B, or C.',
          example: 'The English alphabet has 26 letters.',
          pronunciation: '/ˈlɛtər/',
          teluguTranslation: 'అక్షరం (Aksharam)',
          hindiTranslation: 'अक्षर (Akshar)',
          usageContext: 'Reading and spelling',
        },
        {
          id: 'v-alphabet-sound',
          word: 'sound',
          meaning: 'The noise made when speaking a letter or word.',
          simpleMeaning: 'What you hear when speaking.',
          example: 'Listen to the sound of the letter P.',
          pronunciation: '/saʊnd/',
          teluguTranslation: 'శబ్దం (Shabdam)',
          hindiTranslation: 'आवाज़ (Awaaz)',
          usageContext: 'Phonics and speaking',
        }
      ],
      audioExamples: [
        {
          text: "A - Apple, B - Book, C - Cup, D - Door",
          context: "Pronouncing beginning sounds clearly",
          speakerRole: "Teacher",
          highlightWord: "Apple, Book, Cup"
        }
      ],
      speakingPrompt: {
        id: 'sp-b1-u0-l1',
        promptText: "Say the sounds: 'A for Apple, B for Book, C for Cup'",
        modelAnswer: "A for Apple, B for Book, C for Cup",
        targetKeywords: ['Apple', 'Book', 'Cup'],
        hints: ['Speak slowly and clearly', 'Pronounce the first sound with open lips']
      },
      quickQuiz: [
        {
          id: 'qq-u0-l1',
          question: 'How many letters are there in the English alphabet?',
          options: ['24', '26', '28', '30'],
          correctIndex: 1,
          explanation: 'There are 26 letters in the English alphabet: 5 vowels and 21 consonants.'
        }
      ],
      exercises: [
        {
          id: 'ex-u0-l1-1',
          type: 'multiple_choice',
          instruction: 'Select the letter that makes the sound in "Apple":',
          question: 'Which letter starts the word "Apple"?',
          options: ['A', 'B', 'C', 'D'],
          correctAnswer: 'A',
          explanation: '"Apple" begins with the letter A (/æ/).'
        },
        {
          id: 'ex-u0-l1-2',
          type: 'repeat',
          instruction: 'Listen and repeat the letter sound clearly:',
          targetSentence: 'A is for Apple, B is for Book.',
          phoneticGuide: '/eɪ ɪz fɔːr ˈæpəl, biː ɪz fɔːr bʊk/',
          teluguTranslation: 'A అంటే ఆపిల్, B అంటే పుస్తకం',
          hindiTranslation: 'A से सेब, B से किताब',
          explanation: 'Practice pronouncing the beginning vowel and consonant sounds smoothly.',
        }
      ],
      conversationScenario: {
        scenarioTitle: 'First Greetings with Teacher Anna',
        context: 'Meet your patient English teacher and practice saying hello.',
        aiPartnerName: 'Teacher Anna',
        aiPartnerRole: 'Friendly Phonics Coach',
        aiAvatar: '👩‍🏫',
        initialMessage: 'Hello! Welcome to your first English lesson. Can you say: "Hello teacher"?',
        suggestedResponses: [
          'Hello teacher!',
          'Good morning teacher.',
          'Nice to meet you teacher Anna.'
        ]
      }
    },
    {
      id: 'b1-u0-l2',
      unitId: 'b1-u0',
      lessonNumber: 2,
      title: 'Saying Your Name: "My Name Is Ravi"',
      subtitle: 'Construct your very first English sentence with complete understanding',
      estimatedMinutes: 8,
      proficiencyLevel: 1,
      status: 'available',
      conceptSummary: 'Understand every single word in "My name is [Name]" so you can introduce yourself and family members independently.',
      whyItMatters: 'Introducing yourself is the most important sentence in any language. Knowing how each word works lets you create new sentences.',
      realLifeApplication: 'Meeting teachers, introducing yourself to new friends, and filling out basic registrations.',
      targetPhrases: ['My name is Ravi.', 'What is your name?', 'Nice to meet you.'],
      grammarFocus: {
        topic: 'Sentence Breakdown: My + Name + Is + [Name]',
        rule: '"My" shows belonging to the speaker. "Name" identifies the person. "Is" connects the subject to the identity.',
        formula: 'Possessive Pronoun ("My") + Noun ("name") + Linking Verb ("is") + Name ("Ravi")',
        whyExplanation: 'In English, sentences need a linking verb ("is") to connect the subject with who they are.',
        commonMistakes: [
          {
            incorrect: 'Myself Ravi.',
            correct: 'My name is Ravi. / I am Ravi.',
            why: '"Myself" is a reflexive pronoun and cannot stand alone as a subject in English.'
          },
          {
            incorrect: 'My name Ravi.',
            correct: 'My name is Ravi.',
            why: 'English requires the linking verb "is" to connect "my name" with "Ravi".'
          }
        ]
      },
      vocabulary: [
        {
          id: 'v-my-pronoun',
          word: 'my',
          meaning: 'Belonging to or associated with the speaker.',
          simpleMeaning: 'Belonging to me (నాది / मेरा).',
          example: 'My name is Anu.',
          pronunciation: '/maɪ/',
          teluguTranslation: 'నా (Naa)',
          hindiTranslation: 'मेरा / मेरी (Mera / Meri)',
          usageContext: 'Self-identification and possession',
        },
        {
          id: 'v-name-noun',
          word: 'name',
          meaning: 'A word or set of words by which a person, animal, place, or thing is known.',
          simpleMeaning: 'What a person or thing is called.',
          example: 'Her name is Priya.',
          pronunciation: '/neɪm/',
          teluguTranslation: 'పేరు (Peru)',
          hindiTranslation: 'नाम (Naam)',
          usageContext: 'Introductions and identity',
        }
      ],
      audioExamples: [
        {
          text: "Hello! My name is Ravi. What is your name?",
          context: "Friendly introductory conversation",
          speakerRole: "Learner",
          highlightWord: "My name is"
        }
      ],
      speakingPrompt: {
        id: 'sp-b1-u0-l2',
        promptText: "Introduce yourself: Say 'Hello! My name is [Your Name].'",
        modelAnswer: "Hello! My name is Ravi.",
        targetKeywords: ['Hello', 'My', 'name', 'is'],
        hints: ['Say "My name is" clearly before your name', 'End with a friendly tone']
      },
      quickQuiz: [
        {
          id: 'qq-u0-l2',
          question: 'Which sentence is grammatically correct and natural?',
          options: ['Myself Rahul', 'My name is Rahul', 'Me name Rahul', 'My name are Rahul'],
          correctIndex: 1,
          explanation: '"My name is Rahul" is correct. English uses "My name is" to state who you are.'
        }
      ],
      exercises: [
        {
          id: 'ex-u0-l2-1',
          type: 'rearrange',
          instruction: 'Arrange the words in proper English introduction order:',
          wordsToArrange: ['name', 'is', 'My', 'Ravi.'],
          correctOrder: ['My', 'name', 'is', 'Ravi.'],
          explanation: 'The natural introduction order is Subject (My name) + Verb (is) + Name (Ravi).'
        },
        {
          id: 'ex-u0-l2-2',
          type: 'repeat',
          instruction: 'Speak your introduction with confidence:',
          targetSentence: 'Hello! My name is Ravi. Nice to meet you.',
          phoneticGuide: '/həˈloʊ! maɪ neɪm ɪz ˈrɑːvi. naɪs tuː miːt juː/',
          teluguTranslation: 'నమస్కారం! నా పేరు రవి. మిమ్మల్ని కలవడం సంతోషం.',
          hindiTranslation: 'नमस्ते! मेरा नाम रवि है। आपसे मिलकर खुशी हुई।',
          explanation: 'Clear self-introductions create instant connection with new speakers.',
        }
      ],
      conversationScenario: {
        scenarioTitle: 'Introducing Yourself to a New Neighbor',
        context: 'Say hello to your neighbor who just moved next door.',
        aiPartnerName: 'Alex',
        aiPartnerRole: 'Friendly Neighbor',
        aiAvatar: '👋',
        initialMessage: 'Hi there! I am your new neighbor Alex. What is your name?',
        suggestedResponses: [
          'Hello! My name is Priya.',
          'Hi Alex! My name is Ravi, nice to meet you.',
          'Good morning Alex, welcome to the neighborhood!'
        ]
      }
    },
    {
      id: 'b1-u0-l3',
      unitId: 'b1-u0',
      lessonNumber: 3,
      title: 'Everyday Objects, Colors & Numbers (1 to 20)',
      subtitle: 'Identify things around you: cups, books, pens, red, blue, green',
      estimatedMinutes: 8,
      proficiencyLevel: 1,
      status: 'available',
      conceptSummary: 'Learn names of everyday objects, primary colors, and counting from 1 to 20.',
      whyItMatters: 'Naming objects and quantities lets you order tea, buy items at shops, and describe your surroundings.',
      realLifeApplication: 'Ordering "two cups of tea", asking for "a blue pen", and paying for groceries.',
      targetPhrases: ['This is a cup.', 'I have two books.', 'The pen is blue.'],
      grammarFocus: {
        topic: 'Singular "This is a..." vs Plural Numbers',
        rule: 'Use "This is a [object]" for one thing. Use numbers with plural nouns: "two cups", "three pens".',
        formula: 'Demonstrative ("This is") + Article ("a") + Object ("cup")',
        whyExplanation: 'English uses singular articles ("a/an") before singular countable objects.',
        commonMistakes: [
          {
            incorrect: 'This is cup.',
            correct: 'This is a cup.',
            why: 'Singular countable nouns require the article "a" in English.'
          }
        ]
      },
      vocabulary: [
        {
          id: 'v-cup',
          word: 'cup',
          meaning: 'A small bowl-shaped container used for drinking tea or coffee.',
          simpleMeaning: 'Drinking container.',
          example: 'I want a cup of tea.',
          pronunciation: '/kʌp/',
          teluguTranslation: 'కప్పు (Kappu)',
          hindiTranslation: 'प्याला / कप (Cup)',
          usageContext: 'Daily dining and tea shops',
        },
        {
          id: 'v-color',
          word: 'color',
          meaning: 'The property possessed by an object of producing different sensations on the eye (red, blue, yellow).',
          simpleMeaning: 'Visual appearance like red or green.',
          example: 'Blue is my favorite color.',
          pronunciation: '/ˈkʌlər/',
          teluguTranslation: 'రంగు (Rangu)',
          hindiTranslation: 'रंग (Rang)',
          usageContext: 'Describing objects',
        }
      ],
      audioExamples: [
        {
          text: "This is a blue pen. I have two books on the table.",
          context: "Describing items on a study table",
          speakerRole: "Student",
          highlightWord: "blue pen, two books"
        }
      ],
      speakingPrompt: {
        id: 'sp-b1-u0-l3',
        promptText: "Say: 'This is a cup. I would like one cup of water.'",
        modelAnswer: "This is a cup. I would like one cup of water.",
        targetKeywords: ['This', 'cup', 'one', 'water'],
        hints: ['Pronounce "a cup" smoothly', 'Speak with clear pace']
      },
      quickQuiz: [
        {
          id: 'qq-u0-l3',
          question: 'What is the correct way to describe one drinking cup?',
          options: ['This is cup', 'This is a cup', 'This are cups', 'This is one cups'],
          correctIndex: 1,
          explanation: '"This is a cup" is correct because singular countable items take the article "a".'
        }
      ],
      exercises: [
        {
          id: 'ex-u0-l3-1',
          type: 'fill_gap',
          instruction: 'Complete the sentence with the correct article:',
          sentenceWithGap: 'This is ___ cup of hot tea.',
          missingWord: 'a',
          options: ['a', 'an', 'the', 'two'],
          correctAnswer: 'a',
          explanation: 'Use "a" before singular countable nouns beginning with consonant sounds.'
        },
        {
          id: 'ex-u0-l3-2',
          type: 'repeat',
          instruction: 'Practice ordering items with numbers:',
          targetSentence: 'I would like two cups of tea, please.',
          phoneticGuide: '/aɪ wʊd laɪk tuː kʌps əv tiː, pliːz/',
          teluguTranslation: 'నాకు రెండు కప్పుల టీ కావాలి, దయచేసి.',
          hindiTranslation: 'मुझे कृपया दो कप चाय चाहिए।',
          explanation: 'Always end requests with "please" when ordering food and drinks.',
        }
      ],
      conversationScenario: {
        scenarioTitle: 'Ordering Two Teas at the Counter',
        context: 'Order tea and snacks politely at the tea counter.',
        aiPartnerName: 'Ramu',
        aiPartnerRole: 'Tea Stall Master',
        aiAvatar: '☕',
        initialMessage: 'Good morning! How many cups of tea would you like today?',
        suggestedResponses: [
          'I would like two cups of tea, please.',
          'One cup of tea with less sugar, please.',
          'Two teas and one bottle of water, please.'
        ]
      }
    }
  ]
};

// 3. Sentence-Building Laboratory Exercises (Part L requirement 18)
export const SENTENCE_BUILDING_EXERCISES: SentenceBuildingExercise[] = [
  {
    id: 'sb-tea-order',
    level: 'beginner',
    situationContext: 'You are at a local tea shop ordering tea politely from the shopkeeper.',
    intendedMeaning: 'I want a cup of tea, and I want to ask politely.',
    availableElements: [
      { id: 'el-1', type: 'subject', text: 'I', explanation: 'The speaker', teluguTranslation: 'నేను', hindiTranslation: 'मैं' },
      { id: 'el-2', type: 'verb', text: 'would like', explanation: 'Polite expression of wanting', teluguTranslation: 'కోరుకుంటున్నాను', hindiTranslation: 'चाहता हूँ' },
      { id: 'el-3', type: 'object', text: 'a cup of tea,', explanation: 'The item being requested', teluguTranslation: 'ఒక కప్పు టీ', hindiTranslation: 'एक कप चाय' },
      { id: 'el-4', type: 'polite_ending', text: 'please.', explanation: 'Courteous polite ending', teluguTranslation: 'దయచేసి', hindiTranslation: 'कृपया' },
    ],
    correctSequence: ['el-1', 'el-2', 'el-3', 'el-4'],
    standardSentence: 'I want a cup of tea, please.',
    naturalAlternative: "I'd like a cup of tea, please.",
    explanationWhyBetter:
      "While 'I want...' is understood, native speakers almost universally use 'I would like...' or the contraction \"I'd like...\" when ordering food or drink. It sounds warm and respectful rather than demanding.",
    teluguExplanation: "'I want' కంటే 'I'd like' అనడం చాలా మర్యాదగా మరియు సహజంగా ఉంటుంది.",
    hindiExplanation: "'I want' के बजाय 'I'd like' बोलना अधिक विनम्र और स्वाभाविक लगता है।",
  },
  {
    id: 'sb-help-request',
    level: 'intermediate',
    situationContext: 'You are lost in a railway station and asking a station officer for directions.',
    intendedMeaning: 'Can you tell me where platform number 3 is?',
    availableElements: [
      { id: 'el-c1', type: 'subject', text: 'Could you', explanation: 'Polite modal auxiliary question', teluguTranslation: 'మీరు చేయగలరా', hindiTranslation: 'क्या आप' },
      { id: 'el-c2', type: 'verb', text: 'please tell me', explanation: 'Requesting information politely', teluguTranslation: 'దయచేసి చెప్పగలరా', hindiTranslation: 'कृपया बता सकते हैं' },
      { id: 'el-c3', type: 'object', text: 'where platform three is?', explanation: 'Indirect question clause with correct word order', teluguTranslation: 'ప్లాట్‌ఫాం 3 ఎక్కడ ఉందో', hindiTranslation: 'प्लेटफॉर्म 3 कहाँ है' },
    ],
    correctSequence: ['el-c1', 'el-c2', 'el-c3'],
    standardSentence: 'Where is platform three?',
    naturalAlternative: 'Excuse me, could you please tell me where platform three is?',
    explanationWhyBetter:
      "Direct questions like 'Where is platform three?' can sound abrupt to busy staff. Prefacing with 'Excuse me' and using indirect question word order ('where platform three is' rather than 'where is platform three') is polite and professional.",
  },
  {
    id: 'sb-workplace-status',
    level: 'advanced',
    situationContext: 'In an engineering standup, explaining that you finished an API endpoint yesterday.',
    intendedMeaning: 'I completed the payment endpoint yesterday and tests are passing.',
    availableElements: [
      { id: 'el-w1', type: 'subject', text: 'Yesterday, I', explanation: 'Time anchor and subject', teluguTranslation: 'నిన్న నేను', hindiTranslation: 'कल मैंने' },
      { id: 'el-w2', type: 'verb', text: 'finalized', explanation: 'Strong action verb instead of weak "did"', teluguTranslation: 'పూర్తి చేసాను', hindiTranslation: 'पूरा किया' },
      { id: 'el-w3', type: 'object', text: 'the payment verification endpoint,', explanation: 'Specific deliverable', teluguTranslation: 'పేమెంట్ ఎండ్‌పాయింట్', hindiTranslation: 'पेमेंट एंडपॉइंट' },
      { id: 'el-w4', type: 'modifier', text: 'and all unit tests are green.', explanation: 'Quantified evidence of completion', teluguTranslation: 'మరియు టెస్టులన్నీ పాస్ అయ్యాయి', hindiTranslation: 'और सभी टेस्ट पास हैं' },
    ],
    correctSequence: ['el-w1', 'el-w2', 'el-w3', 'el-w4'],
    standardSentence: 'Yesterday I finished the payment endpoint and it works.',
    naturalAlternative: 'Yesterday, I finalized the payment verification endpoint, and all unit tests are green.',
    explanationWhyBetter:
      "Replacing 'finished and it works' with precise professional vocabulary like 'finalized' and 'unit tests are green' gives stakeholders immediate confidence without ambiguity.",
  },
];

// 4. Think-in-English Visual & Speaking Progression (Part L requirement 17)
export const THINK_IN_ENGLISH_EXERCISES: ThinkInEnglishItem[] = [
  {
    id: 'tie-cup',
    objectName: 'Hot Cup of Chai',
    iconOrVisual: '☕',
    level: 'level1_see_say',
    targetWord: 'Cup',
    audioPromptSentence: 'Look at the picture. This is a cup.',
    audioQuestionPrompt: 'What is this?',
    modelSpokenResponse: 'This is a cup of hot tea.',
    teluguHelp: 'టీ కప్పు చూసి, వెంటనే ఇంగ్లీషులో ఆలోచించండి: "This is a cup."',
    hindiHelp: 'चाय के कप को देखकर सीधे अंग्रेजी में सोचें: "This is a cup."',
    conversationExtension: 'Do you drink tea in the morning or in the evening?',
  },
  {
    id: 'tie-clock',
    objectName: 'Clock on the Wall',
    iconOrVisual: '⏰',
    level: 'level2_describe',
    targetWord: 'Time',
    audioPromptSentence: 'Look at the clock. The time is seven o’clock.',
    audioQuestionPrompt: 'What time do you usually wake up?',
    modelSpokenResponse: 'I usually wake up at seven o’clock in the morning.',
    teluguHelp: 'సమయాన్ని చెప్పేటప్పుడు "at seven o’clock" అని ఇంగ్లీషులో అలవాటు చేసుకోండి.',
    hindiHelp: 'समय बताते समय "at seven o’clock" का उपयोग सीधे अंग्रेजी में करें।',
    conversationExtension: 'What is the first thing you do after waking up?',
  },
  {
    id: 'tie-umbrella',
    objectName: 'Rain & Umbrella',
    iconOrVisual: '☔',
    level: 'level3_opinion',
    targetWord: 'Rainy Weather',
    audioPromptSentence: 'Rain is falling outside. Someone is holding an umbrella.',
    audioQuestionPrompt: 'Do you like rainy days or sunny days, and why?',
    modelSpokenResponse: 'I prefer rainy days because the air feels cool and refreshing.',
    teluguHelp: 'వర్షం గురించి మీ ఆలోచనను చెప్పండి: "I like rainy days because..."',
    hindiHelp: 'बारिश के मौसम के बारे में अपने विचार बताएं: "I like rainy days because..."',
    conversationExtension: 'What food do people in your town love to eat when it rains?',
  },
];

// 5. Real-World Conversation Recovery Cards (Part L requirement 19)
export const CONVERSATION_RECOVERY_CARDS: ConversationRecoveryCard[] = [
  {
    id: 'rec-forgot-word',
    category: 'forgot_word',
    categoryTitle: 'When You Forget a Specific Word',
    situation: 'You are explaining something and suddenly blank on a vocabulary word.',
    primaryPhrase: "What's the word I'm looking for... It's like...",
    alternatives: [
      "I'm forgetting the exact term, but basically...",
      "The word has slipped my mind, but it is similar to...",
      "Let me describe it another way..."
    ],
    whenToUse: 'Use immediately instead of freezing silently. Native speakers do this all the time!',
    audioExampleText: "The word has slipped my mind, but basically it's an online payment scanner.",
  },
  {
    id: 'rec-speak-slowly',
    category: 'ask_speak_slowly',
    categoryTitle: 'When Someone Speaks Too Fast',
    situation: 'A native speaker or interviewer is speaking rapidly and you cannot catch every word.',
    primaryPhrase: "Could you say that a little more slowly, please?",
    alternatives: [
      "Would you mind slowing down just a bit?",
      "Could you please repeat that at a slightly slower pace?",
      "Sorry, could you speak a little slower for me?"
    ],
    whenToUse: 'Never pretend you understood when you did not. Asking someone to slow down shows confidence, not weakness.',
    audioExampleText: "Could you say that a little more slowly, please? I want to make sure I caught all the steps.",
  },
  {
    id: 'rec-did-not-understand',
    category: 'did_not_understand',
    categoryTitle: 'When You Do Not Understand a Question',
    situation: 'You did not catch the meaning of what someone asked you.',
    primaryPhrase: "Could you explain what you mean by that?",
    alternatives: [
      "Could you rephrase that for me?",
      "I'm not quite sure I understand. Are you asking about...",
      "Could you say that again in simpler words?"
    ],
    whenToUse: 'Clarifying is 100x better than guessing and answering the wrong thing.',
    audioExampleText: "Could you rephrase that for me? Are you asking about the cost or the timeline?",
  },
  {
    id: 'rec-buying-time',
    category: 'buying_thinking_time',
    categoryTitle: 'Buying Time to Think Natural Phrases',
    situation: 'You need 3 to 5 seconds to organize your thoughts before speaking.',
    primaryPhrase: "That is a great question. Let me think for a moment.",
    alternatives: [
      "Let me gather my thoughts on that for a second.",
      "To be honest, let me organize that into two points.",
      "That's an interesting question. Well, first of all..."
    ],
    whenToUse: 'Replaces uncomfortable silent pauses or repetitive "um / uh" fillers with confident presence.',
    audioExampleText: "That is an interesting question. Let me gather my thoughts for just a moment.",
  },
];

// 6. Initial Sample Confidence Journal Entries (Part L requirement 20)
export const INITIAL_CONFIDENCE_JOURNAL: ConfidenceJournalEntry[] = [
  {
    id: 'journal-1',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    dateFormatted: '2 days ago',
    title: 'First Full Ordering Conversation at Tea Shop',
    whatPracticed: 'Ordered tea, requested less sugar, and asked for samosas without looking at hints.',
    whatFeltDifficult: 'Hesitated on whether to say "less sugar" or "little sugar".',
    breakthrough: 'The shopkeeper understood me immediately! Felt proud speaking aloud.',
    confidenceRating: 4,
    notes: 'Remember: "less sugar" is uncountable and sounds completely natural.',
  },
  {
    id: 'journal-2',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    dateFormatted: 'Yesterday',
    title: 'Daily Standup Update in Guided Mode',
    whatPracticed: 'Explained yesterday tasks and today plan in under 60 seconds.',
    whatFeltDifficult: 'Using past tense verbs (went vs gone, finalized vs finished).',
    breakthrough: 'Used silent pauses instead of saying "basically" 5 times.',
    confidenceRating: 5,
    notes: 'Keep doing the 1-second pause technique before answering.',
  },
];

// 7. Full Map Destinations (Part 26 - All Categories)
export const FULL_MAP_LOCATIONS: FullMapLocation[] = [
  // EDUCATION
  {
    id: 'loc-classroom',
    name: 'Classroom & School',
    category: 'education',
    icon: '🏫',
    tagline: 'Teachers, Classmates & Daily Lessons',
    description: 'Ask the teacher questions, participate in discussions, and introduce yourself to classmates.',
    environmentDescription: 'A bright classroom with blackboards, desks, and student activity.',
    defaultPersonaId: 'mentor',
    greetingPhrase: 'Good morning! Please take your seat. What would you like to ask today?',
    coordinates: { x: 18, y: 22 },
    unlocked: true,
    scenarios: [
      { id: 'sc-class-intro', title: 'Introduce Yourself to the Class', difficulty: 'beginner', estimatedMinutes: 5, starterPrompt: "Stand up and say your name, age, and favorite subject.", samplePhrases: ["Good morning teacher, my name is...", "My favorite subject is..."], completed: true },
      { id: 'sc-class-doubt', title: 'Asking the Teacher to Clarify a Lesson', difficulty: 'intermediate', estimatedMinutes: 6, starterPrompt: "Raise your hand and ask the teacher to explain a difficult math or science problem.", samplePhrases: ["Excuse me, teacher. Could you please explain step two again?"], completed: false },
    ],
  },
  {
    id: 'loc-college-campus',
    name: 'College & University Campus',
    category: 'education',
    icon: '🎓',
    tagline: 'Lectures, Student Office & Group Projects',
    description: 'Interact with college professors, submit certificates at the student office, and collaborate on group presentations.',
    environmentDescription: 'A bustling university courtyard with students carrying backpacks and laptops.',
    defaultPersonaId: 'friendly_friend',
    greetingPhrase: 'Hey there! Are you looking for the seminar hall or the student affairs office?',
    coordinates: { x: 32, y: 16 },
    unlocked: true,
    scenarios: [
      { id: 'sc-student-office', title: 'Requesting Bonafide Certificate at Student Office', difficulty: 'intermediate', estimatedMinutes: 6, starterPrompt: "Ask the clerk for your semester marksheet and certificate.", samplePhrases: ["I would like to apply for my bonafide certificate, please."], completed: false },
      { id: 'sc-group-discuss', title: 'Brainstorming a Seminar Presentation', difficulty: 'advanced', estimatedMinutes: 8, starterPrompt: "Discuss division of work with your project group.", samplePhrases: ["I can take care of the introduction and research slides."], completed: false },
    ],
  },
  {
    id: 'loc-library',
    name: 'Central Library',
    category: 'education',
    icon: '📚',
    tagline: 'Quiet Study, Book Inquiries & Research',
    description: 'Speak in a quiet tone, locate research books, borrow literature, and request study desk passes.',
    environmentDescription: 'Serene rows of oak bookshelves with reading tables and soft whisper of turning pages.',
    defaultPersonaId: 'shopkeeper',
    greetingPhrase: 'Welcome to the library. Are you looking for reference books or fiction today?',
    coordinates: { x: 42, y: 28 },
    unlocked: true,
    scenarios: [
      { id: 'sc-borrow-book', title: 'Issuing a Library Book with Card', difficulty: 'beginner', estimatedMinutes: 5, starterPrompt: "Tell the librarian you want to borrow two books for two weeks.", samplePhrases: ["I'd like to check out these two books, please."], completed: true },
    ],
  },

  // EVERYDAY LIFE
  {
    id: 'loc-tea-stall',
    name: 'Tea Stall & Tiffin Shop',
    category: 'daily_life',
    icon: '☕',
    tagline: 'Morning Chai, Dosa, Idli & Local Chat',
    description: 'Order breakfast, request less spice/sugar, ask for hot sambar, and pay via mobile payments.',
    environmentDescription: 'A lively corner tea shop with sizzling tiffin griddles and warm neighborhood chatter.',
    defaultPersonaId: 'shopkeeper',
    greetingPhrase: 'Good morning! What can I get hot for you today? Tea, coffee, or breakfast?',
    coordinates: { x: 24, y: 44 },
    unlocked: true,
    scenarios: [
      { id: 'sc-order-chai', title: 'Ordering Tea with Custom Sugar', difficulty: 'beginner', estimatedMinutes: 4, starterPrompt: "Order two ginger teas with less sugar and one hot samosa.", samplePhrases: ["Two cups of ginger tea with less sugar, please."], completed: true },
      { id: 'sc-upi-payment', title: 'Paying Bill via QR Code', difficulty: 'beginner', estimatedMinutes: 3, starterPrompt: "Ask for the total bill and verify the QR scanner code.", samplePhrases: ["How much is the total?", "Can I scan your UPI QR code?"], completed: true },
    ],
  },
  {
    id: 'loc-grocery-market',
    name: 'Grocery Shop & Supermarket',
    category: 'daily_life',
    icon: '🛒',
    tagline: 'Fresh Vegetables, Packaged Goods & Billing',
    description: 'Ask for grocery weights, enquire about item availability, and check expiry dates with staff.',
    environmentDescription: 'A clean neighborhood supermarket with brightly organized shelves and checkout counters.',
    defaultPersonaId: 'shopkeeper',
    greetingPhrase: 'Welcome! Need a basket? Let me know if you are looking for specific spices or grains.',
    coordinates: { x: 15, y: 55 },
    unlocked: true,
    scenarios: [
      { id: 'sc-weigh-veggies', title: 'Buying Fresh Vegetables by the Kilo', difficulty: 'beginner', estimatedMinutes: 5, starterPrompt: "Ask for one kilogram of tomatoes and half a kilo of onions.", samplePhrases: ["Could you give me one kilo of fresh tomatoes?"], completed: false },
    ],
  },
  {
    id: 'loc-park-neighborhood',
    name: 'Neighborhood Park',
    category: 'daily_life',
    icon: '🌳',
    tagline: 'Morning Walks, Pet Chat & Community Small Talk',
    description: 'Greet morning joggers, ask about pets, discuss the weather, and make friendly small talk.',
    environmentDescription: 'Green walking trail with blooming bougainvillea, benches, and birds chirping.',
    defaultPersonaId: 'friendly_friend',
    greetingPhrase: 'Lovely morning for a walk, isn’t it? Do you come here every morning?',
    coordinates: { x: 38, y: 52 },
    unlocked: true,
    scenarios: [
      { id: 'sc-park-smalltalk', title: 'Friendly Weather & Exercise Small Talk', difficulty: 'beginner', estimatedMinutes: 5, starterPrompt: "Exchange friendly greetings with a neighbor walking their dog.", samplePhrases: ["Good morning! Beautiful weather today."], completed: false },
    ],
  },

  // TRAVEL
  {
    id: 'loc-railway-station',
    name: 'Railway & Metro Station',
    category: 'travel',
    icon: '🚆',
    tagline: 'Platforms, Ticket Counters & Train Announcements',
    description: 'Ask for platform numbers, enquire about arrival delays, and buy local transit tickets.',
    environmentDescription: 'High-ceiling train station with periodic loudspeaker announcements and passenger bustle.',
    defaultPersonaId: 'stranger',
    greetingPhrase: 'Next passenger, please! Which destination ticket are you purchasing?',
    coordinates: { x: 55, y: 35 },
    unlocked: true,
    scenarios: [
      { id: 'sc-ticket-counter', title: 'Buying a Reserved Train Ticket', difficulty: 'intermediate', estimatedMinutes: 6, starterPrompt: "Ask the clerk for two sleeper tickets to Hyderabad for tomorrow evening.", samplePhrases: ["I'd like two tickets for the 7 PM express to Hyderabad."], completed: true },
      { id: 'sc-platform-enquiry', title: 'Enquiring on Train Delay & Platform', difficulty: 'intermediate', estimatedMinutes: 5, starterPrompt: "Ask the enquiry desk if the train on platform 2 is running on time.", samplePhrases: ["Excuse me, is the intercity express running on schedule?"], completed: false },
    ],
  },
  {
    id: 'loc-airport',
    name: 'International Airport',
    category: 'travel',
    icon: '✈️',
    tagline: 'Check-In, Security, Immigration & Boarding',
    description: 'Check in baggage, request window seats, declare travel purpose at immigration, and locate gates.',
    environmentDescription: 'Polished terminal floors with flight display boards and wheeling luggage.',
    defaultPersonaId: 'stranger',
    greetingPhrase: 'Good afternoon. Passport and boarding pass, please. Where are you traveling today?',
    coordinates: { x: 70, y: 20 },
    unlocked: true,
    scenarios: [
      { id: 'sc-checkin-window', title: 'Baggage Check-In & Window Seat Request', difficulty: 'intermediate', estimatedMinutes: 6, starterPrompt: "Check in one suitcase and politely ask if a window seat is available.", samplePhrases: ["Could I check this suitcase and get a window seat, please?"], completed: true },
      { id: 'sc-immigration', title: 'Immigration & Purpose of Visit Questions', difficulty: 'advanced', estimatedMinutes: 7, starterPrompt: "Answer the immigration officer regarding travel duration and stay address.", samplePhrases: ["I am visiting for two weeks to attend a tech conference."], completed: false },
    ],
  },
  {
    id: 'loc-hotel-reception',
    name: 'Hotel & Tourist Desk',
    category: 'travel',
    icon: '🏨',
    tagline: 'Room Check-In, Amenities & Sightseeing Guidance',
    description: 'Check into your hotel room, ask for WiFi passwords, and request city tour recommendations.',
    environmentDescription: 'Elegant hotel lobby with marble columns and concierge reception desk.',
    defaultPersonaId: 'receptionist',
    greetingPhrase: 'Welcome to Grand Palm Hotel. Do you have a reservation under your name?',
    coordinates: { x: 82, y: 38 },
    unlocked: true,
    scenarios: [
      { id: 'sc-hotel-checkin', title: 'Checking In with Booking Confirmation', difficulty: 'intermediate', estimatedMinutes: 5, starterPrompt: "Present your booking confirmation code and ask about breakfast timings.", samplePhrases: ["I have a reservation under the name Priya Sharma."], completed: false },
    ],
  },

  // PROFESSIONAL LIFE
  {
    id: 'loc-corporate-office',
    name: 'Corporate Office & Meeting Room',
    category: 'professional',
    icon: '🏢',
    tagline: 'Standups, Presentations & Stakeholder Syncs',
    description: 'Participate in team meetings, report project status, and present proposals confidently.',
    environmentDescription: 'Modern tech office floor with glass meeting rooms and collaborative pods.',
    defaultPersonaId: 'colleague',
    greetingPhrase: 'Hi team, let’s begin our project sync. Who would like to start with their update?',
    coordinates: { x: 62, y: 62 },
    unlocked: true,
    scenarios: [
      { id: 'sc-meeting-standup', title: 'Giving Morning Standup Update', difficulty: 'intermediate', estimatedMinutes: 5, starterPrompt: "Explain yesterday's progress, today's plan, and flag one minor blocker.", samplePhrases: ["Yesterday I finalized the API, and today I am testing edge cases."], completed: true },
      { id: 'sc-interrupt-politely', title: 'Politely Intervening in Meeting Discussion', difficulty: 'advanced', estimatedMinutes: 6, starterPrompt: "Intervene politely when someone changes the discussion topic abruptly.", samplePhrases: ["That's a valid point, but let's park that to finish the sharding decision."], completed: false },
    ],
  },
  {
    id: 'loc-interview-room',
    name: 'Job Interview Room',
    category: 'professional',
    icon: '💼',
    tagline: 'HR, Behavioral STAR & Technical Q&A',
    description: 'Introduce yourself, structure behavioral stories (STAR), and ask thoughtful questions to interviewers.',
    environmentDescription: 'Professional conference room with panel interviewers and resume review tablet.',
    defaultPersonaId: 'interviewer',
    greetingPhrase: 'Welcome! Please have a seat. Let’s start with a brief overview of your background.',
    coordinates: { x: 75, y: 72 },
    unlocked: true,
    scenarios: [
      { id: 'sc-tell-me-about-you', title: 'Mastering "Tell Me About Yourself"', difficulty: 'advanced', estimatedMinutes: 7, starterPrompt: "Deliver a polished 60-second summary of your career, skills, and current goals.", samplePhrases: ["I am a full stack engineer with over three years of experience building..."], completed: true },
    ],
  },

  // CIVIC & COMMUNITY
  {
    id: 'loc-hospital-pharmacy',
    name: 'Hospital Reception & Pharmacy',
    category: 'civic_community',
    icon: '🏥',
    tagline: 'Doctor Appointments, Symptoms & Medicine Usage',
    description: 'Explain symptoms respectfully, book a doctor consultation, and ask pharmacist about dosages.',
    environmentDescription: 'Clean medical reception desk with consultation tokens and prescription counter.',
    defaultPersonaId: 'doctor',
    greetingPhrase: 'Hello. How can we help you today? Do you have an appointment with a physician?',
    coordinates: { x: 28, y: 78 },
    unlocked: true,
    scenarios: [
      { id: 'sc-describe-symptoms', title: 'Describing Cold and Fever Symptoms to Doctor', difficulty: 'beginner', estimatedMinutes: 5, starterPrompt: "Explain that you have had a mild fever and throat pain since yesterday.", samplePhrases: ["I have had a sore throat and slight fever since yesterday evening."], completed: false },
      { id: 'sc-pharmacy-dosage', title: 'Asking Pharmacist for Dosage Instructions', difficulty: 'intermediate', estimatedMinutes: 5, starterPrompt: "Ask whether the tablet should be taken before or after meals.", samplePhrases: ["Should I take this medicine before or after food?"], completed: false },
    ],
  },
  {
    id: 'loc-bank-branch',
    name: 'Bank Branch & Customer Service',
    category: 'civic_community',
    icon: '🏦',
    tagline: 'Account Opening, Deposits, Passbooks & Inquiries',
    description: 'Enquire about opening a savings account, update contact details, and resolve transaction issues.',
    environmentDescription: 'Orderly bank hall with token counter and customer relationship desks.',
    defaultPersonaId: 'shopkeeper',
    greetingPhrase: 'Welcome to the branch. Token number 42 please. How can I assist your banking today?',
    coordinates: { x: 48, y: 80 },
    unlocked: true,
    scenarios: [
      { id: 'sc-open-account', title: 'Enquiring on Documents Needed for Savings Account', difficulty: 'intermediate', estimatedMinutes: 6, starterPrompt: "Ask the officer what ID documents and minimum balance are required.", samplePhrases: ["What documents do I need to submit to open a savings account?"], completed: false },
    ],
  },
  {
    id: 'loc-temple-worship',
    name: 'Place of Worship & Cultural Center',
    category: 'civic_community',
    icon: '🛕',
    tagline: 'Heritage, Respectful Inquiries & Festivals',
    description: 'Enquire about ceremony timings, observe respectful cultural practices, and appreciate traditions.',
    environmentDescription: 'Peaceful temple courtyard with incense fragrance, floral garlands, and stone architecture.',
    defaultPersonaId: 'mentor',
    greetingPhrase: 'Namaste and welcome. The morning prayers will begin shortly. May peace be with you.',
    coordinates: { x: 88, y: 82 },
    unlocked: true,
    scenarios: [
      { id: 'sc-temple-timing', title: 'Asking About Prayer Timings & Etiquette', difficulty: 'beginner', estimatedMinutes: 4, starterPrompt: "Ask when the evening ceremony starts and where to leave footwear respectfully.", samplePhrases: ["Excuse me, what time does the evening prayer begin?"], completed: true },
    ],
  },
];
