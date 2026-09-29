export interface QuickTopic {
  id: string;
  title: string;
  category: string;
  icon: string;
  starterPrompt: string;
  hints: string[];
}

export const QUICK_TOPICS: QuickTopic[] = [
  {
    id: 'topic-1',
    title: 'My Favorite Weekend Habit',
    category: 'Lifestyle',
    icon: '☕',
    starterPrompt: "Tell me how you usually spend your Saturday mornings. Do you like sleeping in or waking up early?",
    hints: ['Start with: "On Saturday mornings, I usually..."', 'Mention your morning drink or breakfast', 'Talk about who you spend time with']
  },
  {
    id: 'topic-2',
    title: 'A Memorable Journey I Took',
    category: 'Travel',
    icon: '🚆',
    starterPrompt: "Think of a trip you remember clearly. Where did you go and what made it memorable?",
    hints: ['Start with: "A trip that really stands out to me was..."', 'Describe the journey and scenery', 'Share one unexpected event']
  },
  {
    id: 'topic-3',
    title: 'Why I Want to Master English',
    category: 'Personal Goal',
    icon: '🎯',
    starterPrompt: "What is your main motivation for speaking fluent English? How will it change your career or confidence?",
    hints: ['Start with: "I decided to focus on my English speaking because..."', 'Mention your professional aspirations', 'Describe how you want to feel speaking in public']
  },
  {
    id: 'topic-4',
    title: 'Technology That Changed My Routine',
    category: 'Technology',
    icon: '📱',
    starterPrompt: "Which app or gadget has had the biggest impact on your daily productivity?",
    hints: ['Start with: "One piece of technology I rely on every single day is..."', 'Explain how it saves time', 'Compare your routine before and after having it']
  }
];

export const SUPPORTED_LANGUAGES = [
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'en', name: 'English', nativeName: 'English' }
];

export const SAMPLE_TRANSLATION_EXAMPLES = [
  {
    sourceText: "నేను రేపు ఆఫీస్ కి కొంచెం ఆలస్యంగా వస్తాను",
    fromLanguage: "Telugu",
    toLanguage: "English",
    naturalEnglish: "I'll be arriving a bit late to the office tomorrow.",
    grammaticalEnglish: "I will come to office late tomorrow.",
    meaning: "Expressing an anticipated slight delay in workplace arrival with polite natural future phrasing.",
    phonetics: "Nēnu rēpu āphīs ki konceṁ ālasyaṅgā vastānu",
    usageContext: "Workplace email or message to a team lead",
    exampleSentence: "Good morning team, I'll be arriving a bit late to the office tomorrow due to a doctor's appointment."
  },
  {
    sourceText: "मुझे चाय में चीनी कम पसंद है",
    fromLanguage: "Hindi",
    toLanguage: "English",
    naturalEnglish: "I prefer my tea with less sugar.",
    grammaticalEnglish: "I like less sugar in tea.",
    meaning: "Stating a beverage preference politely and naturally.",
    phonetics: "Mujhe chai mein cheeni kam pasand hai",
    usageContext: "Ordering or when someone is serving tea",
    exampleSentence: "Thanks so much, but I prefer my tea with less sugar."
  }
];
