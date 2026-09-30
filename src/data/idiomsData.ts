import { IdiomItem } from '../types/curriculumModules';

export const IDIOMS_DATABASE: IdiomItem[] = [
  // ==========================================
  // BEGINNER IDIOMS
  // ==========================================
  {
    id: 'id-break-ice',
    phrase: 'Break the ice',
    literalMeaning: 'To physically shatter or crack frozen ice with force.',
    actualMeaning: 'To make people feel more relaxed, comfortable, and friendly when meeting for the first time.',
    simpleExplanation: 'Saying or doing something friendly to start a conversation with strangers.',
    level: 'beginner',
    category: 'social',
    formality: 'conversational',
    examples: [
      'I told a lighthearted joke at the start of the workshop to break the ice.',
      'Playing a quick trivia game is a great way to break the ice among new team members.'
    ],
    conversationSnippet: [
      { speaker: 'Rahul', text: 'Everyone in the conference room seemed so tense and silent.' },
      { speaker: 'Anita', text: 'I noticed! So I asked everyone where they were visiting from to break the ice.' }
    ],
    culturalContext: 'Originates from historic icebreaker ships that cleared paths through frozen harbors so normal vessels could trade together.',
    similarExpression: 'Warm up the room / get the ball rolling',
    oppositeExpression: 'Keep one’s distance / maintain a cold silence',
    speakingChallenge: 'Describe what you usually do to break the ice when meeting someone new at work or a party.',
    audioText: 'Break the ice.',
    masteryState: 'mastered'
  },
  {
    id: 'id-piece-of-cake',
    phrase: 'A piece of cake',
    literalMeaning: 'A slice of sweet baked dessert.',
    actualMeaning: 'Something that is exceptionally easy, straightforward, or effortless to accomplish.',
    simpleExplanation: 'Very easy to do.',
    level: 'beginner',
    category: 'daily',
    formality: 'casual',
    examples: [
      'Once you understand the basic formula, this math problem is a piece of cake.',
      'Don’t worry about driving on the highway; with GPS it is a piece of cake.'
    ],
    conversationSnippet: [
      { speaker: 'David', text: 'Are you nervous about the software installation tonight?' },
      { speaker: 'Elena', text: 'Not at all! We tested the automated scripts twice; it will be a piece of cake.' }
    ],
    culturalContext: 'Popularized in 1930s colloquial English implying that eating cake requires zero effort and brings pleasant ease.',
    similarExpression: 'A walk in the park / child’s play',
    oppositeExpression: 'An uphill battle / a tough nut to crack',
    speakingChallenge: 'Talk about a task or exam you thought was going to be difficult, but turned out to be a piece of cake.',
    audioText: 'A piece of cake.',
    masteryState: 'strong'
  },
  {
    id: 'id-under-weather',
    phrase: 'Under the weather',
    literalMeaning: 'Standing physically beneath clouds or rain.',
    actualMeaning: 'Feeling slightly sick, unwell, tired, or lacking energy.',
    simpleExplanation: 'Feeling a little sick or not 100% healthy.',
    level: 'beginner',
    category: 'health',
    formality: 'conversational',
    examples: [
      'I am feeling a bit under the weather today, so I will work from home.',
      'She looked slightly under the weather during the morning briefing.'
    ],
    conversationSnippet: [
      { speaker: 'Manager', text: 'You look a little exhausted today, Karthik. Are you alright?' },
      { speaker: 'Karthik', text: 'I am feeling slightly under the weather with a mild cold, but I can manage from my desk.' }
    ],
    culturalContext: 'Originated in maritime navigation when sick sailors would go below deck to protect themselves from adverse weather.',
    similarExpression: 'Feeling run-down / off-color',
    oppositeExpression: 'In the pink of health / fit as a fiddle',
    speakingChallenge: 'Inform your team politely in a voice note that you are feeling under the weather and will attend meetings remotely.',
    audioText: 'Under the weather.',
    masteryState: 'familiar'
  },

  // ==========================================
  // INTERMEDIATE IDIOMS
  // ==========================================
  {
    id: 'id-hit-nail-head',
    phrase: 'Hit the nail on the head',
    literalMeaning: 'Striking a metal nail precisely on its flat top with a hammer.',
    actualMeaning: 'To state or describe a situation, problem, or truth with exact accuracy.',
    simpleExplanation: 'To say exactly the right thing or pinpoint the exact truth.',
    level: 'intermediate',
    category: 'workplace',
    formality: 'professional',
    examples: [
      'Maya hit the nail on the head when she identified customer retention as our real challenge.',
      'His analysis hit the nail on the head regarding why the marketing campaign stalled.'
    ],
    conversationSnippet: [
      { speaker: 'Vikram', text: 'I think our users are leaving because the onboarding form has too many confusing questions.' },
      { speaker: 'Pooja', text: 'You hit the nail on the head! The data shows 60% drop off on that exact screen.' }
    ],
    similarExpression: 'Spot on / right on the mark',
    oppositeExpression: 'Wide of the mark / completely mistaken',
    speakingChallenge: 'Agree strongly with a colleague who just identified the root cause of an issue.',
    audioText: 'Hit the nail on the head.',
    masteryState: 'learning'
  },
  {
    id: 'id-call-it-day',
    phrase: 'Call it a day',
    literalMeaning: 'To pronounce or declare that the calendar day is over.',
    actualMeaning: 'To stop working on something for the rest of the day or to bring an activity to a conclusion.',
    simpleExplanation: 'To stop working and go home or rest.',
    level: 'intermediate',
    category: 'workplace',
    formality: 'conversational',
    examples: [
      'We have fixed the main bugs for the sprint; let’s call it a day and resume tomorrow.',
      'After eight hours of intense negotiation, both parties agreed to call it a day.'
    ],
    conversationSnippet: [
      { speaker: 'Sameer', text: 'My eyes are burning from staring at these spreadsheets.' },
      { speaker: 'Neha', text: 'Let’s call it a day. We can tackle the rest with fresh eyes tomorrow morning.' }
    ],
    similarExpression: 'Pack it in / wrap things up',
    oppositeExpression: 'Burn the midnight oil / keep pulling an all-nighter',
    speakingChallenge: 'Suggest to your study group that you have made good progress and it is time to call it a day.',
    audioText: 'Call it a day.',
    masteryState: 'familiar'
  },
  {
    id: 'id-burn-midnight-oil',
    phrase: 'Burn the midnight oil',
    literalMeaning: 'Keeping an oil lamp burning late into the night.',
    actualMeaning: 'To work or study late into the night or early morning hours.',
    simpleExplanation: 'Working very late at night.',
    level: 'intermediate',
    category: 'college',
    formality: 'conversational',
    examples: [
      'The engineering team burned the midnight oil to deploy the security update on schedule.',
      'College students often burn the midnight oil during semester exam week.'
    ],
    conversationSnippet: [
      { speaker: 'Kiran', text: 'How did you manage to build this entire demo in just two days?' },
      { speaker: 'Arjun', text: 'I had to burn the midnight oil on Thursday, but it was worth it!' }
    ],
    similarExpression: 'Pull an all-nighter / work late',
    oppositeExpression: 'Call it an early night',
    speakingChallenge: 'Talk about a memorable time when you had to burn the midnight oil to meet an important deadline.',
    audioText: 'Burn the midnight oil.',
    masteryState: 'learning'
  },

  // ==========================================
  // ADVANCED IDIOMS
  // ==========================================
  {
    id: 'id-bite-bullet',
    phrase: 'Bite the bullet',
    literalMeaning: 'Biting on a lead bullet to endure pain without anaesthesia during battlefield surgery.',
    actualMeaning: 'To force oneself to face a difficult, unpleasant, or painful situation with courage.',
    simpleExplanation: 'Accepting and doing something tough that you have been avoiding.',
    level: 'advanced',
    category: 'professional',
    formality: 'professional',
    examples: [
      'We have been delaying this system upgrade for months; we finally need to bite the bullet and do it.',
      'He bit the bullet and apologized to his manager for the oversight.'
    ],
    conversationSnippet: [
      { speaker: 'Director', text: 'Our legacy server architecture is costing us too much maintenance.' },
      { speaker: 'Architect', text: 'I agree. We need to bite the bullet and migrate the database to the cloud this quarter.' }
    ],
    culturalContext: 'Historic military practice where wounded soldiers bit down on soft lead bullets during surgery before modern anesthesia.',
    similarExpression: 'Face the music / take the plunge',
    oppositeExpression: 'Procrastinate / sweep under the carpet',
    speakingChallenge: 'Share a situation where a business or individual had to bite the bullet to achieve long-term growth.',
    audioText: 'Bite the bullet.',
    masteryState: 'available'
  },
  {
    id: 'id-ball-in-court',
    phrase: 'The ball is in your court',
    literalMeaning: 'In tennis, the ball is on your side of the net and it is your turn to hit it.',
    actualMeaning: 'It is now your decision, turn, or responsibility to take the next action or make a choice.',
    simpleExplanation: 'It is your turn to make the next move or decision.',
    level: 'advanced',
    category: 'professional',
    formality: 'professional',
    examples: [
      'We submitted our revised contract terms yesterday; the ball is in their court now.',
      'I answered all of your client’s technical questions; the ball is in your court to finalize the deal.'
    ],
    conversationSnippet: [
      { speaker: 'Vendor', text: 'Have you reviewed the revised price quote we sent over?' },
      { speaker: 'Procurement', text: 'Yes, our leadership reviewed it. The ball is in our court to schedule the final sign-off.' }
    ],
    similarExpression: 'The next move is yours / up to you',
    oppositeExpression: 'Waiting on others / ball in their court',
    speakingChallenge: 'Conclude a client proposal email by stating that you look forward to their response because the ball is in their court.',
    audioText: 'The ball is in your court.',
    masteryState: 'available'
  }
];
