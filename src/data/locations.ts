import { LocationScenario } from '../types';

export const SPEAKING_WORLD_LOCATIONS: LocationScenario[] = [
  {
    id: 'tea-shop',
    name: 'Tea Shop',
    category: 'daily_life',
    icon: '☕',
    tagline: 'Chai, Snacks & Friendly Banter',
    description: 'Order your favorite tea, customize sweetness, ask for hot snacks, and exchange morning pleasantries.',
    environmentDescription: 'A lively corner tea stall with fresh cardamom steam, bubbling brass pots, and neighborhood conversation.',
    defaultPersonaId: 'shopkeeper',
    greetingPhrase: "Hi! Welcome. What would you like to have today?",
    coordinates: { x: 22, y: 35 },
    unlocked: true,
    samplePhrases: [
      "I'd like a hot cup of ginger tea, please.",
      "Could you make it with less sugar?",
      "Do you have hot samosas ready?",
      "How much is the total?",
      "Can I pay with UPI?"
    ],
    conversationMilestones: [
      "Warm greeting & order choice",
      "Milk & sweetness customization",
      "Snack recommendation",
      "Payment and quick small talk"
    ]
  },
  {
    id: 'home',
    name: 'Home',
    category: 'daily_life',
    icon: '🏠',
    tagline: 'Family, Cooking & Cozy Daily Routine',
    description: 'Talk with family members, discuss meal plans, explain how your day went, and relax.',
    environmentDescription: 'A comfortable living room with dinner simmering in the kitchen.',
    defaultPersonaId: 'friendly_friend',
    greetingPhrase: "Welcome back! How was your day outside?",
    coordinates: { x: 12, y: 18 },
    unlocked: true,
    samplePhrases: [
      "I had a pretty productive day at work.",
      "What are we making for dinner?",
      "Could you pass me the TV remote?",
      "I'm feeling a bit tired, going to sleep early."
    ],
    conversationMilestones: [
      "Sharing how your day was",
      "Planning meals and chores",
      "Discussing tomorrow's schedule"
    ]
  },
  {
    id: 'restaurant',
    name: 'Restaurant',
    category: 'daily_life',
    icon: '🍽️',
    tagline: 'Table Booking, Menu Decisions & Dining Out',
    description: 'Request a table, ask for food recommendations, handle dietary preferences, and request the bill.',
    environmentDescription: 'An ambient dining room with soft jazz and cutlery clinking.',
    defaultPersonaId: 'customer',
    greetingPhrase: "Good evening! Welcome to Flavors. Do you have a reservation or would you like a table for two?",
    coordinates: { x: 40, y: 28 },
    unlocked: true,
    samplePhrases: [
      "We'd like a table for two, please.",
      "What do you recommend for the main course?",
      "Is this dish spicy?",
      "Could we have some extra napkins?",
      "Could we get the check, please?"
    ],
    conversationMilestones: [
      "Table seating & drinks order",
      "Menu clarification & recommendations",
      "Feedback during meal",
      "Bill & payment process"
    ]
  },
  {
    id: 'office',
    name: 'Office',
    category: 'work_study',
    icon: '🏢',
    tagline: 'Standups, Manager 1:1s & Colleague Updates',
    description: 'Update your manager on tasks, request feedback, participate in team syncs, and talk professionally.',
    environmentDescription: 'A modern bright workspace with laptops, whiteboard agendas, and meeting pods.',
    defaultPersonaId: 'manager',
    greetingPhrase: "Morning! Thanks for joining. Let's do a quick sync on the deliverables for this sprint.",
    coordinates: { x: 55, y: 20 },
    unlocked: true,
    samplePhrases: [
      "I completed the client report this morning.",
      "I'm currently blocked on the API authentication issue.",
      "Could we schedule 15 minutes to review the presentation?",
      "Let me follow up with the team and get back to you by 3 PM."
    ],
    conversationMilestones: [
      "Status update and progress check",
      "Handling blockers and dependencies",
      "Setting deadlines and next steps"
    ]
  },
  {
    id: 'school',
    name: 'School',
    category: 'work_study',
    icon: '🏫',
    tagline: 'Classroom Discussions, Teachers & Homework',
    description: 'Ask questions to teachers, discuss projects with classmates, and request clarification on topics.',
    environmentDescription: 'Sunlit corridor with school lockers, classroom boards, and student chatter.',
    defaultPersonaId: 'teacher',
    greetingPhrase: "Hello there! Do you have a question regarding today's English lesson?",
    coordinates: { x: 28, y: 15 },
    unlocked: true,
    samplePhrases: [
      "Excuse me, teacher, could you explain that rule once more?",
      "I have submitted my assignment on the portal.",
      "Which chapter should we prepare for tomorrow's quiz?"
    ],
    conversationMilestones: [
      "Clarifying grammar questions",
      "Discussing project group work",
      "Presenting ideas to class"
    ]
  },
  {
    id: 'hotel',
    name: 'Hotel',
    category: 'travel_transit',
    icon: '🏨',
    tagline: 'Check-in, Room Amenities & Concierge Help',
    description: 'Check in smoothly, ask about breakfast timings, Wi-Fi passwords, and request room service.',
    environmentDescription: 'An elegant marble lobby with a welcoming reception desk and luggage trolleys.',
    defaultPersonaId: 'hotel_receptionist',
    greetingPhrase: "Welcome to Grand Horizon Hotel. How may I assist you with your stay today?",
    coordinates: { x: 72, y: 32 },
    unlocked: true,
    samplePhrases: [
      "I have a reservation under the name Pavan.",
      "Could I get a quiet room on a higher floor?",
      "What time is breakfast served in the morning?",
      "Could I get an extra room key card, please?"
    ],
    conversationMilestones: [
      "Check-in verification and ID check",
      "Amenities and Wi-Fi explanation",
      "Luggage assistance and directions"
    ]
  },
  {
    id: 'airport',
    name: 'Airport',
    category: 'travel_transit',
    icon: '✈️',
    tagline: 'Check-in Counter, Security & Boarding Gate',
    description: 'Navigate terminal gates, answer passport control questions, and handle luggage inquiries.',
    environmentDescription: 'A soaring glass departures hall with digital flight schedule boards announcing boarding.',
    defaultPersonaId: 'travel_partner',
    greetingPhrase: "Good day. Please have your ticket and photo ID ready. Where are you flying to today?",
    coordinates: { x: 85, y: 22 },
    unlocked: true,
    samplePhrases: [
      "Here is my passport and boarding pass.",
      "Would it be possible to get a window seat?",
      "Which gate does flight 6E-204 depart from?",
      "Is this bag within the cabin carry-on weight limit?"
    ],
    conversationMilestones: [
      "Baggage drop and boarding pass issuance",
      "Security checkpoint instructions",
      "Gate changes and boarding announcements"
    ]
  },
  {
    id: 'supermarket',
    name: 'Supermarket',
    category: 'daily_life',
    icon: '🛒',
    tagline: 'Groceries, Fresh Produce & Checkout Line',
    description: 'Find groceries, inquire about discounts, ask for fresh items, and pay at the counter.',
    environmentDescription: 'A clean supermarket aisle stacked with fresh produce and cereals.',
    defaultPersonaId: 'shopkeeper',
    greetingPhrase: "Hello! Are you finding everything you need on your grocery list?",
    coordinates: { x: 30, y: 55 },
    unlocked: true,
    samplePhrases: [
      "Excuse me, which aisle can I find organic oats in?",
      "Are these mangoes ripe enough to eat today?",
      "Is there any discount offer on this brand?",
      "I brought my own cloth shopping bag."
    ],
    conversationMilestones: [
      "Locating grocery aisles",
      "Weighing produce and checking prices",
      "Cash register barcode scan and receipt"
    ]
  },
  {
    id: 'hospital',
    name: 'Hospital / Clinic',
    category: 'social_community',
    icon: '🏥',
    tagline: 'Doctor Consultations, Symptoms & Pharmacy',
    description: 'Explain your symptoms clearly, ask how to take medicine, and consult healthcare professionals.',
    environmentDescription: 'A tranquil reception desk in a clinic with doctors consulting rooms.',
    defaultPersonaId: 'supportive_coach',
    greetingPhrase: "Hello. Take a seat. How can the doctor assist you today? What symptoms are you experiencing?",
    coordinates: { x: 62, y: 52 },
    unlocked: true,
    samplePhrases: [
      "I've had a persistent dry cough for three days.",
      "I'm feeling a little feverish and fatigued.",
      "Should I take this medication before or after meals?",
      "Are there any side effects I should watch out for?"
    ],
    conversationMilestones: [
      "Describing symptoms and onset",
      "Doctor physical examination dialogue",
      "Prescription instructions and dosage"
    ]
  },
  {
    id: 'bank',
    name: 'Bank',
    category: 'work_study',
    icon: '🏦',
    tagline: 'Accounts, Forexf, Loans & Counter Services',
    description: 'Open a bank account, inquire about international wire transfers, cards, and bank statements.',
    environmentDescription: 'A secure financial institution counter with service tokens.',
    defaultPersonaId: 'interviewer',
    greetingPhrase: "Good morning. Welcome to First Global Bank. How can I help you today?",
    coordinates: { x: 45, y: 48 },
    unlocked: true,
    samplePhrases: [
      "I'd like to open a savings account.",
      "Could you explain the fees for international transactions?",
      "I need a certified bank statement for my visa application."
    ],
    conversationMilestones: [
      "Purpose of visit and KYC documents",
      "Account types and charges breakdown",
      "Application review and confirmation"
    ]
  },
  {
    id: 'railway-station',
    name: 'Railway Station',
    category: 'travel_transit',
    icon: '🚆',
    tagline: 'Platforms, Tickets & Intercity Travel',
    description: 'Ask for platform numbers, check seat confirmations, and find your coach.',
    environmentDescription: 'An active railway concourse with train announcement speakers and digital displays.',
    defaultPersonaId: 'travel_partner',
    greetingPhrase: "Passenger help desk here. Which train are you looking for?",
    coordinates: { x: 18, y: 68 },
    unlocked: true,
    samplePhrases: [
      "Which platform does the express to Bangalore arrive on?",
      "Is train number 12626 running on time?",
      "Where can I find coach B3 on this platform?"
    ],
    conversationMilestones: [
      "Ticket confirmation and platform query",
      "Delay inquiry and waiting lounge",
      "Boarding and seat locating"
    ]
  },
  {
    id: 'movie-theatre',
    name: 'Movie Theatre',
    category: 'social_community',
    icon: '🎬',
    tagline: 'Box Office, Popcorn & Cinema Discussions',
    description: 'Book seats, choose show timings, order snacks, and share reviews of movies.',
    environmentDescription: 'A cinema hall entrance glowing with movie posters and popcorn aroma.',
    defaultPersonaId: 'friendly_friend',
    greetingPhrase: "Hey! What movie are we watching tonight? The thriller or the sci-fi?",
    coordinates: { x: 75, y: 68 },
    unlocked: true,
    samplePhrases: [
      "Two tickets for the 7:30 PM IMAX screening, please.",
      "Are there any seats available in the middle rows?",
      "Can we get a large salted popcorn and two cold drinks?"
    ],
    conversationMilestones: [
      "Film selection and seat preference",
      "Snack counter combo order",
      "Post-movie review and thoughts"
    ]
  },
  {
    id: 'gym',
    name: 'Gym & Fitness',
    category: 'daily_life',
    icon: '🏋️',
    tagline: 'Trainers, Workouts & Fitness Goals',
    description: 'Ask a trainer for form advice, discuss fitness routines, and share progress.',
    environmentDescription: 'A high-energy gym with weights, treadmills, and upbeat music.',
    defaultPersonaId: 'strict_coach',
    greetingPhrase: "Ready to push yourself today? What muscle group are we targeting?",
    coordinates: { x: 38, y: 72 },
    unlocked: true,
    samplePhrases: [
      "Could you check if my posture is correct for this exercise?",
      "How many sets and reps do you recommend?",
      "Are you using this bench or can I work in with you?"
    ],
    conversationMilestones: [
      "Workout plan review",
      "Form correction & motivation",
      "Cool-down and hydration chat"
    ]
  },
  {
    id: 'library',
    name: 'Library & Study Hall',
    category: 'work_study',
    icon: '📚',
    tagline: 'Books, Quiet Study & Academic Research',
    description: 'Search for reference books, inquire about study rooms, and borrow materials.',
    environmentDescription: 'A serene historic library with rows of bookshelves and quiet study desks.',
    defaultPersonaId: 'teacher',
    greetingPhrase: "Shh, welcome to the quiet study zone. Are you looking for a specific section or book?",
    coordinates: { x: 50, y: 78 },
    unlocked: true,
    samplePhrases: [
      "Where can I find books on modern history and communication?",
      "How long can I borrow these two books?",
      "Can I reserve a quiet study cubicle for two hours?"
    ],
    conversationMilestones: [
      "Finding catalog subjects",
      "Issuing membership card",
      "Checking out books"
    ]
  },
  {
    id: 'shopping-mall',
    name: 'Shopping Mall',
    category: 'social_community',
    icon: '🏬',
    tagline: 'Brand Outlets, Fitting Rooms & Fashion',
    description: 'Try on clothes, ask for different sizes, compare styles, and check return policies.',
    environmentDescription: 'A spacious multi-level shopping atrium with apparel stores.',
    defaultPersonaId: 'shopkeeper',
    greetingPhrase: "Welcome to Urban Wear! Are you looking for casual clothes or formal attire?",
    coordinates: { x: 60, y: 38 },
    unlocked: true,
    samplePhrases: [
      "Do you have this jacket in medium size?",
      "Where are the trial rooms located?",
      "Does this shirt come in navy blue?",
      "What is your exchange and return policy?"
    ],
    conversationMilestones: [
      "Style and size inquiry",
      "Fitting room trial and feedback",
      "Billing and warranty check"
    ]
  },
  {
    id: 'foreign-country',
    name: 'Foreign Country',
    category: 'travel_transit',
    icon: '🌎',
    tagline: 'Immigration, Culture Shock & International English',
    description: 'Practice international English, talk to people from different cultures, and handle travel questions.',
    environmentDescription: 'An iconic cosmopolitan city street with international transit signs.',
    defaultPersonaId: 'travel_partner',
    greetingPhrase: "Welcome abroad! First time visiting our city, or have you been here before?",
    coordinates: { x: 88, y: 50 },
    unlocked: true,
    samplePhrases: [
      "I'm here for a week-long professional conference.",
      "Could you recommend authentic local spots to visit?",
      "What is the best way to get around using public transport?"
    ],
    conversationMilestones: [
      "Immigration officer interview",
      "Exchanging currency and SIM card",
      "Cultural etiquette discussion"
    ]
  },
  {
    id: 'tiffin-shop',
    name: 'Tiffin Shop',
    category: 'daily_life',
    icon: '🥞',
    tagline: 'Dosa, Idli & Fast Breakfast',
    description: 'Order fast breakfast, ask for extra chutney or sambar, and enjoy authentic quick meals.',
    environmentDescription: 'A bustling morning tiffin centre with sizzling dosa tawas.',
    defaultPersonaId: 'shopkeeper',
    greetingPhrase: "Crispy dosas and steaming hot idlis are ready! What can I pack for you?",
    coordinates: { x: 15, y: 45 },
    unlocked: true,
    samplePhrases: [
      "One plate of hot idli and a masala dosa, please.",
      "Could you give some extra coconut chutney?",
      "Is the filter coffee freshly brewed?"
    ],
    conversationMilestones: [
      "Selecting quick items",
      "Chutney/sambar preferences",
      "Token collection and takeaway"
    ]
  },
  {
    id: 'college',
    name: 'College / University',
    category: 'work_study',
    icon: '🎓',
    tagline: 'Campus Life, Seminars & Friends',
    description: 'Discuss campus events, career plans, project presentations, and hang out in the canteen.',
    environmentDescription: 'A bustling college quadrangle under trees with students discussing exams.',
    defaultPersonaId: 'friendly_friend',
    greetingPhrase: "Hey! Did you finish submitting the group project slides for the seminar?",
    coordinates: { x: 35, y: 10 },
    unlocked: true,
    samplePhrases: [
      "Our presentation is scheduled right after lunch.",
      "Let's meet up at the library to practice our speaking parts.",
      "Are you joining the campus debate club this semester?"
    ],
    conversationMilestones: [
      "Project coordination",
      "Debate topic discussion",
      "Post-class hangout"
    ]
  },
  {
    id: 'park',
    name: 'City Park',
    category: 'social_community',
    icon: '🌳',
    tagline: 'Morning Walks, Dogs & Leisure Small Talk',
    description: 'Start casual conversations with strangers, talk about pets, weather, and outdoor sports.',
    environmentDescription: 'A green park with jogging tracks, benches, and flowers.',
    defaultPersonaId: 'friendly_friend',
    greetingPhrase: "Beautiful morning for a walk, isn't it? The weather is so refreshing today!",
    coordinates: { x: 70, y: 12 },
    unlocked: true,
    samplePhrases: [
      "What a lovely dog! What breed is she?",
      "It feels like it might rain later this afternoon.",
      "Do you come jogging here every morning?"
    ],
    conversationMilestones: [
      "Weather opening phrase",
      "Pet or fitness small talk",
      "Polite farewell"
    ]
  },
  {
    id: 'taxi-stand',
    name: 'Taxi Stand / Cab Ride',
    category: 'travel_transit',
    icon: '🚕',
    tagline: 'Giving Directions, Fare & Navigation',
    description: 'Direct a driver, request AC adjustments, clarify shortcuts, and pay the fare.',
    environmentDescription: 'A yellow taxi waiting along a busy city junction.',
    defaultPersonaId: 'shopkeeper',
    greetingPhrase: "Where to, sir? Step in, let me reset the meter.",
    coordinates: { x: 82, y: 82 },
    unlocked: true,
    samplePhrases: [
      "Please take me to Cyber City tech park.",
      "Could you please turn on the air conditioning?",
      "Take the flyover to avoid the traffic signal.",
      "You can drop me right here by the gate."
    ],
    conversationMilestones: [
      "Confirming destination",
      "Route guidance",
      "Fare payment and change"
    ]
  }
];
