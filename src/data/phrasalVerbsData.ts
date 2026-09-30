import { PhrasalVerbItem } from '../types/curriculumModules';

export const PHRASAL_VERBS_DATABASE: PhrasalVerbItem[] = [
  {
    id: 'pv-find-out',
    phrase: 'find out',
    baseVerb: 'find',
    particle: 'out',
    meaning: 'To discover, obtain information, or learn a fact or truth through inquiry or observation.',
    simpleMeaning: 'To learn new information that you did not know before.',
    level: 'A2',
    category: 'everyday',
    grammarBehavior: {
      separable: true,
      transitive: true,
      pattern: 'find [something] out or find out [something]'
    },
    formalAlternative: 'discover / ascertain',
    examples: [
      'I found out that the morning train was cancelled due to track repairs.',
      'We need to find out why the customer cancelled their subscription.',
      'Did you find out his phone number?'
    ],
    conversationSnippet: [
      { speaker: 'Priya', text: 'Did you speak to the venue manager about the hall availability?' },
      { speaker: 'Vikram', text: 'Not yet, but I will call their office this afternoon to find out.' }
    ],
    comparisonDiff: [
      { word: 'know', explanation: '"Know" is a state of already possessing knowledge ("I know his name"). "Find out" is the act of getting that knowledge.' },
      { word: 'discover', explanation: '"Discover" is more formal or used for scientific/geographical discoveries.' }
    ],
    isBookmarked: true,
    masteryState: 'mastered'
  },
  {
    id: 'pv-look-into',
    phrase: 'look into',
    baseVerb: 'look',
    particle: 'into',
    meaning: 'To investigate, examine, or research the details of a problem or situation.',
    simpleMeaning: 'To investigate or research a problem to understand what happened.',
    level: 'B1',
    category: 'workplace',
    grammarBehavior: {
      separable: false,
      transitive: true,
      pattern: 'look into [something] (strictly inseparable)'
    },
    formalAlternative: 'investigate / examine',
    examples: [
      'Our engineering team is looking into the payment gateway error right now.',
      'Thank you for reporting this bug; I will personally look into it today.'
    ],
    conversationSnippet: [
      { speaker: 'Client', text: 'Our analytics dashboard has not synced data since yesterday.' },
      { speaker: 'Account Manager', text: 'I apologize for the inconvenience. Let me look into this immediately and update you in thirty minutes.' }
    ],
    comparisonDiff: [
      { word: 'investigate', explanation: '"Investigate" is formal and sounds like a legal or police inquiry. "Look into" is polite and standard in business.' }
    ],
    isBookmarked: false,
    masteryState: 'strong'
  },
  {
    id: 'pv-call-off',
    phrase: 'call off',
    baseVerb: 'call',
    particle: 'off',
    meaning: 'To cancel an event, arrangement, or scheduled plan permanently or before it starts.',
    simpleMeaning: 'To cancel something that was planned.',
    level: 'B1',
    category: 'workplace',
    grammarBehavior: {
      separable: true,
      transitive: true,
      pattern: 'call [something] off or call off [something]'
    },
    formalAlternative: 'cancel / terminate',
    examples: [
      'The outdoor match was called off because of heavy torrential rain.',
      'Management decided to call off the merger negotiations due to valuation disagreements.'
    ],
    conversationSnippet: [
      { speaker: 'Ananya', text: 'Is the team lunch still happening today?' },
      { speaker: 'Deepak', text: 'No, half the department is traveling, so we called it off until next week.' }
    ],
    comparisonDiff: [
      { word: 'postpone / put off', explanation: '"Call off" means cancel completely. "Put off" means delay to a later date.' }
    ],
    isBookmarked: false,
    masteryState: 'familiar'
  },
  {
    id: 'pv-put-off',
    phrase: 'put off',
    baseVerb: 'put',
    particle: 'off',
    meaning: 'To postpone an event or appointment to a later time; also means to delay doing something out of reluctance.',
    simpleMeaning: 'To postpone or delay something until later.',
    level: 'B1',
    category: 'everyday',
    grammarBehavior: {
      separable: true,
      transitive: true,
      pattern: 'put [something] off or put off [something]'
    },
    formalAlternative: 'postpone / defer',
    examples: [
      'Don’t put off studying until the night before the examination.',
      'We had to put off our trip until next summer because of travel restrictions.'
    ],
    conversationSnippet: [
      { speaker: 'Suresh', text: 'Have you scheduled your dental checkup yet?' },
      { speaker: 'Manoj', text: 'I keep putting it off because my calendar has been completely packed.' }
    ],
    comparisonDiff: [
      { word: 'call off', explanation: '"Put off" delays something. "Call off" cancels it entirely.' },
      { word: 'procrastinate', explanation: '"Procrastinate" is a formal Latinate verb describing the habit of putting things off.' }
    ],
    isBookmarked: true,
    masteryState: 'learning'
  },
  {
    id: 'pv-carry-on',
    phrase: 'carry on',
    baseVerb: 'carry',
    particle: 'on',
    meaning: 'To continue doing something despite difficulties, interruptions, or fatigue.',
    simpleMeaning: 'To continue doing what you were doing.',
    level: 'A2',
    category: 'everyday',
    grammarBehavior: {
      separable: false,
      transitive: false,
      pattern: 'carry on with [something] or carry on + [verb-ing]'
    },
    formalAlternative: 'continue / proceed / persist',
    examples: [
      'Even when the microphone failed, the speaker carried on with composure.',
      'Please carry on with your work; do not let me interrupt you.'
    ],
    conversationSnippet: [
      { speaker: 'Lead', text: 'Sorry for stepping in late. Please carry on with your presentation.' },
      { speaker: 'Presenter', text: 'Thank you. As I was mentioning on slide five...' }
    ],
    comparisonDiff: [
      { word: 'continue', explanation: '"Carry on" often emphasizes persisting through an interruption or difficulty.' }
    ],
    isBookmarked: false,
    masteryState: 'mastered'
  },
  {
    id: 'pv-figure-out',
    phrase: 'figure out',
    baseVerb: 'figure',
    particle: 'out',
    meaning: 'To understand or solve something by thinking carefully or calculating.',
    simpleMeaning: 'To solve a puzzle or understand how something works.',
    level: 'B1',
    category: 'workplace',
    grammarBehavior: {
      separable: true,
      transitive: true,
      pattern: 'figure [something] out or figure out [something]'
    },
    formalAlternative: 'deduce / resolve / determine',
    examples: [
      'It took our engineers two days to figure out why the mobile app was crashing on older phones.',
      'I cannot figure out how to configure these firewall rules.'
    ],
    conversationSnippet: [
      { speaker: 'Kavita', text: 'Are you still struggling with the monthly budget calculations?' },
      { speaker: 'Girish', text: 'I finally figured it out! There was an incorrect formula in row 42.' }
    ],
    comparisonDiff: [
      { word: 'understand', explanation: '"Understand" is passive comprehension. "Figure out" highlights the mental effort required to solve it.' }
    ],
    isBookmarked: true,
    masteryState: 'strong'
  },
  {
    id: 'pv-give-up',
    phrase: 'give up',
    baseVerb: 'give',
    particle: 'up',
    meaning: 'To cease making an effort; admit defeat; or stop doing a regular habit or pursuit.',
    simpleMeaning: 'To stop trying or quit a habit.',
    level: 'A2',
    category: 'everyday',
    grammarBehavior: {
      separable: true,
      transitive: true,
      pattern: 'give [something] up or give up'
    },
    formalAlternative: 'surrender / relinquish / abandon',
    examples: [
      'Never give up on your dreams, even when progress feels slow.',
      'He gave up drinking sugary sodas two months ago to improve his health.'
    ],
    conversationSnippet: [
      { speaker: 'Mentor', text: 'Learning to speak fluently takes consistent daily practice.' },
      { speaker: 'Student', text: 'I won’t give up! I am committed to practicing fifteen minutes every day.' }
    ],
    isBookmarked: false,
    masteryState: 'mastered'
  },
  {
    id: 'pv-bring-up',
    phrase: 'bring up',
    baseVerb: 'bring',
    particle: 'up',
    meaning: 'To mention a topic in conversation or meeting; also means to raise/care for a child until adulthood.',
    simpleMeaning: 'To mention or introduce a topic to talk about.',
    level: 'B2',
    category: 'workplace',
    grammarBehavior: {
      separable: true,
      transitive: true,
      pattern: 'bring [something] up or bring up [something]'
    },
    formalAlternative: 'introduce / mention / raise',
    examples: [
      'I will bring up the budget shortfall during our all-hands meeting on Tuesday.',
      'Why did you bring up that sensitive topic in front of the client?'
    ],
    conversationSnippet: [
      { speaker: 'Tanvi', text: 'Do you think the team is happy with the new remote work policy?' },
      { speaker: 'Rohan', text: 'Several people have concerns. I plan to bring it up with HR next week.' }
    ],
    isBookmarked: false,
    masteryState: 'familiar'
  }
];
