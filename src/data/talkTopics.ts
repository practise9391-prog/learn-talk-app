import { ConversationTopic, SavedPhrase } from '../types/talk';

export const CONVERSATION_TOPICS: ConversationTopic[] = [
  {
    id: 'topic-my-day',
    title: 'My Day & Routine',
    category: 'daily',
    icon: '⏰',
    description: 'Talk about how your morning started, what tasks you tackled, and how you relax in the evening.',
    initialPrompt: "Hey! How has your day been treating you so far? Did you get off to an early start this morning?",
    followUpProgression: [
      "What was the most interesting or demanding thing you handled today?",
      "How do you usually unwind once your work or classes are done?",
      "Do you feel like you had a productive day, or was it a bit overwhelming?"
    ],
    brainFreezeIdeas: [
      "Talk about what time you woke up",
      "Mention your morning coffee or breakfast",
      "Describe one task or meeting you finished",
      "Share your evening dinner or relaxation plans"
    ],
    contextLockRules: "Keep discussion centered strictly on the user's daily habits, routine, schedule, and evening plans."
  },
  {
    id: 'topic-cricket',
    title: 'Cricket & Sports',
    category: 'interests',
    icon: '🏏',
    description: 'Discuss live matches, your favorite players, turning points, match predictions, and memorable victories.',
    initialPrompt: "I'm always up for some cricket talk! Have you been following the latest tournament? Who is your favorite player right now?",
    followUpProgression: [
      "What do you think makes their playing style or leadership so special?",
      "Do you prefer the intensity of T20s or the traditional strategy of Test matches?",
      "Tell me about the most memorable match you've ever watched live."
    ],
    brainFreezeIdeas: [
      "Name your favorite cricket team (e.g. India, CSK, RCB)",
      "Talk about a great batting or bowling spell",
      "Mention whether you like playing cricket yourself on weekends",
      "Predict who will win the next upcoming series"
    ],
    contextLockRules: "Lock conversation exclusively into cricket, sports tournaments, player performances, and match analysis."
  },
  {
    id: 'topic-interview',
    title: 'My First Job Interview',
    category: 'career',
    icon: '💼',
    description: 'Practice self-introductions, technical questions, explaining past projects, and handling interview anxiety.',
    initialPrompt: "Welcome to our practice interview. Let's start with the classic: Could you tell me a little bit about yourself and your background?",
    followUpProgression: [
      "That's great. What would you say has been your most impactful project or achievement so far?",
      "Can you describe a situation where you faced a tough technical blocker and how you resolved it?",
      "Where do you see yourself growing over the next two to three years?"
    ],
    brainFreezeIdeas: [
      "State your educational degree and graduation year",
      "Describe your primary technical or business skills",
      "Mention a real project you built and the tools used",
      "Highlight what excites you about this job role"
    ],
    contextLockRules: "Behave as a professional, encouraging hiring interviewer. Frame responses as questions evaluating competency."
  },
  {
    id: 'topic-office',
    title: 'Office & Workplace Communication',
    category: 'work',
    icon: '🏢',
    description: 'Standups, requesting assistance, clarifying deadlines, manager 1:1 syncs, and client updates.',
    initialPrompt: "Good morning! Thanks for joining our weekly sync. How are things looking on your current project deliverables?",
    followUpProgression: [
      "Are you running into any cross-team dependencies or blockers that we should escalate?",
      "How confident are you on meeting the Friday release deadline?",
      "Would it be helpful if we paired you with someone on the backend API integration?"
    ],
    brainFreezeIdeas: [
      "Give a status on what you completed yesterday",
      "Mention what task you are coding or designing today",
      "State if you are waiting for a code review or approval",
      "Propose scheduling a quick 10-minute sync"
    ],
    contextLockRules: "Maintain an agile corporate workplace register with concise updates, sprint goals, and blocker resolution."
  },
  {
    id: 'topic-college',
    title: 'College & University Life',
    category: 'daily',
    icon: '🎓',
    description: 'Classes, seminars, cafeteria hangouts, professors, exams, and future career plans.',
    initialPrompt: "Hey! How are your college classes going this semester? Are the subjects interesting or super hectic?",
    followUpProgression: [
      "Which professor or subject do you find most engaging?",
      "What do you and your friends usually do during lunch breaks or free periods?",
      "Are you preparing for any campus placement drives or final year projects?"
    ],
    brainFreezeIdeas: [
      "Name your major or degree course",
      "Talk about your favorite subject or lab",
      "Describe hanging out in the college canteen",
      "Share your thoughts on upcoming semester exams"
    ],
    contextLockRules: "Keep conversation focused on campus life, academic projects, friends, and college experiences."
  },
  {
    id: 'topic-movies',
    title: 'Movies & Cinema',
    category: 'interests',
    icon: '🎬',
    description: 'Favorite film genres, actors, directors, plot twists, and recommendations.',
    initialPrompt: "I love talking movies! What was the last film or web series you watched that completely hooked you?",
    followUpProgression: [
      "Without spoiling it, what was the most compelling part of the story?",
      "Do you prefer edge-of-the-seat thrillers or lighthearted comedy dramas?",
      "If you could recommend one movie everyone must watch, what would it be?"
    ],
    brainFreezeIdeas: [
      "Name a recent movie or Netflix show you watched",
      "Mention whether you loved the climax or acting",
      "Compare watching in an IMAX theater vs streaming at home",
      "Name your all-time favorite actor or director"
    ],
    contextLockRules: "Focus on cinema, reviews, storytelling, cinematography, and entertainment preferences."
  },
  {
    id: 'topic-travel',
    title: 'Travel & New Destinations',
    category: 'interests',
    icon: '✈️',
    description: 'Trips you have taken, dream bucket-list cities, cultural discoveries, and transit experiences.',
    initialPrompt: "Traveling is such an eye-opener! Tell me, what is one place you visited that left a lasting impression on you?",
    followUpProgression: [
      "What made that trip so special—the scenery, the local food, or the culture?",
      "Do you prefer relaxing beach destinations or exploring bustling historic cities?",
      "What is the next destination on your travel bucket list?"
    ],
    brainFreezeIdeas: [
      "Name a city or state you visited (e.g. Goa, Kerala, Ooty, Ladakh)",
      "Describe how you traveled there (train, road trip, flight)",
      "Mention one unique local dish you tried",
      "Share an unexpected funny moment from the trip"
    ],
    contextLockRules: "Lock conversation into travel destinations, itineraries, cultural experiences, and vacations."
  },
  {
    id: 'topic-food',
    title: 'Food & Cooking Delights',
    category: 'daily',
    icon: '🍛',
    description: 'Comfort foods, street food vs fine dining, cooking experiments, and authentic regional cuisines.',
    initialPrompt: "Food is the ultimate conversation starter! What is your absolute favorite comfort food when you've had a long day?",
    followUpProgression: [
      "Do you enjoy cooking yourself, or do you prefer exploring food stalls and restaurants?",
      "Are you more of a spicy food fan or do you lean towards mild flavors?",
      "What regional cuisine do you think is underrated?"
    ],
    brainFreezeIdeas: [
      "Name your favorite dish (e.g. Biryani, Dosa, Paneer Tikka)",
      "Describe whether you like cooking on weekends",
      "Talk about a famous local street food stall you love",
      "Describe the spices and flavors of your regional cuisine"
    ],
    contextLockRules: "Stay on culinary topics, recipes, favorite restaurants, flavors, and cooking traditions."
  },
  {
    id: 'topic-technology',
    title: 'Technology & AI In Our Lives',
    category: 'interests',
    icon: '📱',
    description: 'Smartphones, apps, artificial intelligence, gadgets, and how tech shapes our daily habits.',
    initialPrompt: "Technology evolves so fast! Which app or device on your phone do you find yourself relying on the most every day?",
    followUpProgression: [
      "Do you think AI and automation will make everyday work more creative or more complicated?",
      "How do you manage digital distractions or screen time when you need to focus?",
      "What piece of technology from science fiction do you wish existed right now?"
    ],
    brainFreezeIdeas: [
      "Mention your favorite smartphone apps (e.g. UPI, maps, music)",
      "Discuss how AI assistants help you learn English",
      "Talk about gaming, gadgets, or smartwatches",
      "Share your thoughts on remote working technology"
    ],
    contextLockRules: "Focus on gadgets, software, artificial intelligence, internet culture, and digital productivity."
  },
  {
    id: 'topic-career',
    title: 'Career Ambitions & Leadership',
    category: 'career',
    icon: '🎯',
    description: 'Professional growth, skills you want to master, mentorship, and building career momentum.',
    initialPrompt: "Let's talk about where you want to go in your career. What is a skill or milestone you are really striving toward right now?",
    followUpProgression: [
      "What steps are you taking weekly to move closer to that objective?",
      "Who has been an inspiring mentor or professional influence in your journey?",
      "How do you handle setbacks or difficult feedback when working on your goals?"
    ],
    brainFreezeIdeas: [
      "Mention your current job role or target industry",
      "Talk about wanting to become a confident English speaker for promotions",
      "Describe learning technical skills or leadership communication",
      "Share a 5-year vision for your professional life"
    ],
    contextLockRules: "Maintain professional mentorship tone focusing on career development, leadership, and ambition."
  }
];

export const INITIAL_SAVED_PHRASES: SavedPhrase[] = [
  {
    id: 'phrase-1',
    phrase: "Could you clarify that for me?",
    category: 'Work',
    naturalAlternative: "Could you please explain that point again?",
    contextUsage: "Asking a manager or colleague to explain an unclear project requirement without sounding confrontational.",
    whyThisWord: "Use 'clarify' when you want someone to make a confusing statement clearer.",
    savedAt: "Yesterday"
  },
  {
    id: 'phrase-2',
    phrase: "I'd like to touch base with you on the timeline.",
    category: 'Work',
    naturalAlternative: "Can we have a quick chat about our schedule?",
    contextUsage: "Polite corporate idiom used to request a short status update with a teammate.",
    whyThisWord: "'Touch base' is a standard friendly workplace idiom meaning to briefly check in.",
    savedAt: "2 days ago"
  },
  {
    id: 'phrase-3',
    phrase: "Could I have a cup of tea with less sugar, please?",
    category: 'Daily Life',
    naturalAlternative: "I'll take a tea, not too sweet, please.",
    contextUsage: "Ordering respectfully in cafes, restaurants, or street stalls.",
    whyThisWord: "'Could I have...' replaces the abrupt command 'I want'.",
    savedAt: "3 days ago"
  },
  {
    id: 'phrase-4',
    phrase: "Could you recommend a quiet spot nearby?",
    category: 'Travel',
    naturalAlternative: "Is there a nice peaceful place to sit around here?",
    contextUsage: "Asking hotel concierges or locals for hidden travel locations.",
    whyThisWord: "'Recommend' is the standard polite verb for soliciting advice.",
    savedAt: "1 week ago"
  }
];
