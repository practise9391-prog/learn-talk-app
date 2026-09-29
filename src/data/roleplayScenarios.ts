import { RoleplayScenario, RoleplayHistoryRecord } from '../types/roleplay';

export const ROLEPLAY_SCENARIOS: RoleplayScenario[] = [
  // ==========================================
  // 1. INTERVIEW SCENARIOS
  // ==========================================
  {
    id: 'rp-interview-intro',
    category: 'interview',
    title: 'Introduce Yourself (The Classic Starter)',
    description: 'Structure your professional introduction using Present → Past Experience/Education → Core Skills → Career Goal.',
    difficulty: 'Intermediate',
    userRole: 'Job Candidate',
    aiRole: 'Hiring Manager (Mr. Roberts)',
    estimatedDurationMin: 6,
    expectedSkills: ['Structured Self-Introduction', 'Past/Present Tense Precision', 'Confidence Building', 'Conciseness'],
    objective: 'Deliver an engaging 60-90 second self-introduction connecting background to the target role without rambling.',
    context: 'You are seated in a job interview at an innovative technology firm. The interviewer begins with the traditional opening question.',
    openingMessage: "Good morning! Thanks for making time to speak with us today. Let's start from the beginning: could you please tell me about yourself and your background?",
    vocabulary: ['expertise', 'background', 'currently specializing in', 'milestone', 'deliverable', 'collaborate'],
    grammarTargets: ['Present Continuous for current role', 'Present Perfect for accomplishments', 'Infinitive of purpose (to contribute)'],
    conversationSteps: [
      {
        stepIndex: 1,
        aiPrompt: "That gives me a solid high-level overview. What would you say is the single most rewarding project or achievement you've worked on recently?",
        expectedResponseConcept: 'Detailing a specific achievement, tools used, and measurable outcome.',
        hints: {
          wordHint: 'achievement, spearheaded, responsible for, impact',
          sentenceHint: 'Recently, I worked on a project where my primary responsibility was...',
          fullHint: 'Recently, I developed a web dashboard that helped our team track deliverables much faster.'
        },
        suggestedStarters: [
          'Recently, I had the opportunity to...',
          'One project I am particularly proud of is...',
          'In my previous role, I spearheaded...'
        ]
      },
      {
        stepIndex: 2,
        aiPrompt: "Impressive! And what specifically motivated you to apply for this particular position with our team?",
        expectedResponseConcept: 'Connecting company mission and job expectations to personal career aspirations.',
        hints: {
          wordHint: 'aligned with, growth opportunities, company reputation, contribute',
          sentenceHint: 'What drew me to your team is your focus on...',
          fullHint: 'I have been following your recent product launches, and I admire how user-centric your engineering culture is.'
        },
        suggestedStarters: [
          'What really attracted me to your company is...',
          'I noticed that your team values...',
          'My career goals align closely with your mission because...'
        ]
      }
    ],
    evaluationRules: [
      {
        criteria: 'Answer follows the 4-part structure (Present -> Experience -> Skills -> Goal)',
        recommendation: 'Ensure you bridge your past experience directly into what you want to achieve next.',
        recommendedLessonId: 'lesson-a2-u3-workplace',
        recommendedLessonTitle: 'Talking About Work and Experience'
      }
    ],
    bestAnswerComparisons: [
      {
        userSpokenHypothesis: "My name is John. I studied computer science and now looking for job.",
        naturalVersion: "I have a background in computer science, and I've spent the past year building web applications.",
        professionalVersion: "I hold a degree in computer science with a focus on web technologies, and I am eager to apply my technical background to your engineering team.",
        whyExplanation: "'Hold a degree' and 'apply my technical background' sound proactive and polished compared to a brief factual statement."
      }
    ]
  },
  {
    id: 'rp-interview-skills',
    category: 'interview',
    title: 'Skills You Are Working On',
    description: 'Explain technical or soft skills you are actively developing, how you practice, and why they matter for growth.',
    difficulty: 'Intermediate',
    userRole: 'Job Candidate',
    aiRole: 'Technical Interviewer',
    estimatedDurationMin: 5,
    expectedSkills: ['Continuous Learning Mindset', 'Self-Awareness', 'Giving Concrete Examples'],
    objective: 'Demonstrate initiative by articulating an active skill development journey with concrete practice habits.',
    context: 'The interviewer wants to assess whether you take initiative to update your knowledge.',
    openingMessage: "Technology and industry standards move fast. What is one specific professional or technical skill you are currently working to improve?",
    vocabulary: ['upskilling', 'hands-on practice', 'consistency', 'refining', 'curiosity'],
    grammarTargets: ['Present Continuous (I am currently reading/practicing)', 'Gerunds (practicing, building)'],
    conversationSteps: [
      {
        stepIndex: 1,
        aiPrompt: "That is a very relevant skill. How exactly do you structure your daily or weekly practice to make real progress?",
        expectedResponseConcept: 'Describing consistent habits, courses, side projects, or reading.',
        hints: {
          wordHint: 'dedicate, routine, practical exercises, mentorship',
          sentenceHint: 'I dedicate about 45 minutes every evening to...',
          fullHint: 'I set aside an hour each weekend to build small experimental apps and review documentation.'
        },
        suggestedStarters: [
          'I make it a habit to dedicate time each week to...',
          'My routine involves reading technical articles and then...',
          'I learn best by doing, so I consistently build...'
        ]
      }
    ],
    evaluationRules: [
      {
        criteria: 'Provides concrete practice habits rather than generic statements',
        recommendation: 'Always quantify your effort (e.g. 30 minutes daily or building a weekend demo).',
        recommendedLessonId: 'lesson-b1-u1-speaking'
      }
    ],
    bestAnswerComparisons: [
      {
        userSpokenHypothesis: "I am learning English speaking and cloud.",
        naturalVersion: "I'm actively working on my spoken English fluency and getting hands-on with cloud deployment.",
        professionalVersion: "I'm currently sharpening two key competencies: my verbal communication fluency and cloud architecture fundamentals.",
        whyExplanation: "'Sharpening competencies' demonstrates professionalism and intentional growth."
      }
    ]
  },
  {
    id: 'rp-interview-mistake',
    category: 'interview',
    title: 'Handling the Past Mistake Question',
    description: 'Master the 4-step framework: Situation → What Happened → What I Learned → What I Changed.',
    difficulty: 'Advanced',
    userRole: 'Candidate',
    aiRole: 'Hiring Director',
    estimatedDurationMin: 6,
    expectedSkills: ['Diplomatic Reflection', 'Accountability', 'Problem Solving', 'Structured Storytelling'],
    objective: 'Explain a low-stakes professional mistake constructively, focusing on personal accountability and lasting systemic change.',
    context: 'Behavioral interview question testing integrity, resilience, and maturity.',
    openingMessage: "We all make mistakes throughout our careers. Can you tell me about a time something didn't go according to plan, and what you learned from it?",
    vocabulary: ['oversight', 'miscommunication', 'retrospective', 'safeguard', 'accountability'],
    grammarTargets: ['Past Simple vs Past Continuous', 'Modal verbs in the past (should have checked)'],
    conversationSteps: [
      {
        stepIndex: 1,
        aiPrompt: "I appreciate your candor. Looking back, what specific safeguard or process did you put in place to ensure that never happened again?",
        expectedResponseConcept: 'Describing concrete preventative measures or checklists.',
        hints: {
          wordHint: 'checklist, peer review, reminder, double-check',
          sentenceHint: 'Since that incident, I always implement a...',
          fullHint: 'Since then, I established a quick 5-minute pre-release checklist to verify dependencies before deploying.'
        },
        suggestedStarters: [
          "To ensure it didn't recur, I introduced...",
          'That experience taught me to always...',
          'Now, my standard operating procedure is to...'
        ]
      }
    ],
    evaluationRules: [
      {
        criteria: 'Avoids blaming others; highlights personal learning and prevention',
        recommendation: 'Keep the mistake concise and spend 70% of your time explaining the solution and takeaway.'
      }
    ],
    bestAnswerComparisons: [
      {
        userSpokenHypothesis: "My colleague gave wrong file so client got angry.",
        naturalVersion: "There was a miscommunication on our team about file versions, which caused a client delay.",
        professionalVersion: "Early in my career, our team encountered a version mismatch due to unclear handoffs. I took ownership of clarifying our workflow.",
        whyExplanation: "Taking ownership shows leadership, whereas blaming colleagues damages interview rapport."
      }
    ]
  },
  {
    id: 'rp-interview-college-to-work',
    category: 'interview',
    title: 'Connecting College to Practical Work',
    description: 'Bridge classroom theory, group projects, and academic foundations into real business value.',
    difficulty: 'Intermediate',
    userRole: 'Recent Graduate / Junior Candidate',
    aiRole: 'Senior Team Lead',
    estimatedDurationMin: 5,
    expectedSkills: ['Theory-to-Practice Translation', 'Collaboration Examples', 'Professional Articulation'],
    objective: 'Explain how academic concepts and team projects directly translate into day-to-day workplace contributions.',
    context: 'Assessing how a college graduate will adapt to professional workflows.',
    openingMessage: "As someone transitioning from academics, how do you see what you studied in college applying to the daily work on our team?",
    vocabulary: ['foundational principles', 'collaborative projects', 'deadline-driven', 'translating theory'],
    grammarTargets: ['Connective adverbs (therefore, consequently, specifically)'],
    conversationSteps: [
      {
        stepIndex: 1,
        aiPrompt: "College projects are often academic. How did you handle situations where team members disagreed on project decisions?",
        expectedResponseConcept: 'Resolving academic disagreements through open dialogue and consensus.',
        hints: {
          wordHint: 'consensus, compromise, aligned, objective criteria',
          sentenceHint: 'Whenever we had conflicting ideas, we focused on...',
          fullHint: 'We evaluated ideas objectively against project requirements rather than personal preferences.'
        },
        suggestedStarters: [
          'In our capstone project, when opinions differed, we...',
          'I found that open communication helped us...',
          'We established clear roles early on so that...'
        ]
      }
    ],
    evaluationRules: [
      {
        criteria: 'Highlights collaboration and problem-solving beyond textbook memorization'
      }
    ],
    bestAnswerComparisons: [
      {
        userSpokenHypothesis: "College gave me syllabus marks and good grades.",
        naturalVersion: "My college coursework gave me strong fundamentals, while group projects taught me teamwork under tight deadlines.",
        professionalVersion: "My academic background provided a solid theoretical framework, while capstone projects trained me to deliver practical solutions under real deadlines.",
        whyExplanation: "'Theoretical framework' and 'capstone projects' reflect university-level professional English."
      }
    ]
  },
  {
    id: 'rp-interview-career-goals',
    category: 'interview',
    title: 'Where Do You See Yourself in 3-5 Years?',
    description: 'Articulate realistic ambition, commitment to skill mastery, and long-term organizational value.',
    difficulty: 'Intermediate',
    userRole: 'Candidate',
    aiRole: 'Department Head',
    estimatedDurationMin: 5,
    expectedSkills: ['Future Tenses', 'Career Terminology', 'Balancing Ambition & Realism'],
    objective: 'Share a 3-5 year vision demonstrating dedication to the domain without sounding unrealistically overconfident.',
    context: 'The company wants to understand your career trajectory and retention potential.',
    openingMessage: "Looking ahead, where do you envision yourself professionally over the next three to five years?",
    vocabulary: ['domain mastery', 'mentorship', 'contribute meaningfully', 'leadership trajectory'],
    grammarTargets: ['Future continuous (I see myself leading...)', 'Hope/aim to + verb'],
    conversationSteps: [
      {
        stepIndex: 1,
        aiPrompt: "That sounds like a solid trajectory. What steps are you taking currently to lay the groundwork for that leadership or specialist role?",
        expectedResponseConcept: 'Active steps such as taking ownership, seeking feedback, and expanding domain depth.',
        hints: {
          wordHint: 'proactive, taking ownership, seeking feedback, courses',
          sentenceHint: 'In the short term, I am focusing on mastering...',
          fullHint: 'I am concentrating on delivering consistent quality in my current tasks while learning how senior team members make decisions.'
        },
        suggestedStarters: [
          'Right now, my priority is to master...',
          'I actively seek constructive feedback so I can...',
          'I observe how senior leaders navigate complex problems...'
        ]
      }
    ],
    evaluationRules: [
      {
        criteria: 'Balances short-term execution with long-term ambition'
      }
    ],
    bestAnswerComparisons: [
      {
        userSpokenHypothesis: "In 5 years I want to become manager or CEO.",
        naturalVersion: "In three to five years, I hope to grow into a senior role where I can mentor others.",
        professionalVersion: "Over the next few years, I aim to achieve deep technical mastery in this domain and gradually transition into leading projects and mentoring junior teammates.",
        whyExplanation: "'Achieve deep mastery' and 'transition into leading projects' expresses healthy ambition without sounding entitled."
      }
    ]
  },
  {
    id: 'rp-interview-job-changes',
    category: 'interview',
    title: 'Explaining Career & Job Changes Professionally',
    description: 'Address transitions, job changes, or contract roles with diplomatic confidence and growth focus.',
    difficulty: 'Advanced',
    userRole: 'Candidate',
    aiRole: 'Senior HR Manager',
    estimatedDurationMin: 6,
    expectedSkills: ['Diplomatic Framing', 'Positive Spin', 'Career Coherence'],
    objective: 'Explain career changes honestly while emphasizing accumulated learning and commitment to long-term stability.',
    context: 'HR interviewer noticed changes on your resume and asks for context.',
    openingMessage: "I noticed you have moved between a few different roles or projects over the last couple of years. Could you share some context around those transitions?",
    vocabulary: ['growth trajectory', 'contract deliverables', 'pivoting', 'broadened perspective', 'seeking stability'],
    grammarTargets: ['Present Perfect (I have worked with...)', 'Contrastive linking words (while, however)'],
    conversationSteps: [
      {
        stepIndex: 1,
        aiPrompt: "That makes sense. Why do you feel our company is the right place for you to commit to for the long term now?",
        expectedResponseConcept: 'Highlighting stability, cultural alignment, and challenging problems.',
        hints: {
          wordHint: 'stability, alignment, long-term impact, scale',
          sentenceHint: 'Having gained varied experience, I am now seeking a company where...',
          fullHint: 'Having gained broad exposure across different environments, I am eager to settle in and make an enduring impact on a long-term product.'
        },
        suggestedStarters: [
          'Having built a versatile skillset, I am now focused on...',
          'Your team offers the scale and stability where I can...',
          'I want to dedicate the next phase of my career to...'
        ]
      }
    ],
    evaluationRules: [
      {
        criteria: 'Reframes changes as diverse learning rather than aimless hopping'
      }
    ],
    bestAnswerComparisons: [
      {
        userSpokenHypothesis: "My old boss was bad and company had less salary.",
        naturalVersion: "I felt I had reached a plateau in my previous position and was looking for new learning challenges.",
        professionalVersion: "While I learned a great deal in my previous roles, I recognized that my growth potential was capped, and I sought out opportunities with greater scope for ownership.",
        whyExplanation: "Never badmouth a previous employer. Focus on seeking greater scope and ownership."
      }
    ]
  },
  {
    id: 'rp-interview-govt-vs-private',
    category: 'interview',
    title: 'Discussion: Government vs Private Sector Careers',
    description: 'Engage in a balanced discussion roleplay on public sector stability versus private sector agility.',
    difficulty: 'Intermediate',
    userRole: 'Candidate / Speaker',
    aiRole: 'Panel Discussion Facilitator',
    estimatedDurationMin: 5,
    expectedSkills: ['Balanced Argumentation', 'Expressing Opinions Politely', 'Nuanced Vocabulary'],
    objective: 'Weigh both perspectives objectively using comparative expressions without ideological bias.',
    context: 'A group interview or panel discussion evaluating critical thinking and communication.',
    openingMessage: "Many graduates debate between careers in the public sector versus the private corporate sector. What factors do you think attract people most to government careers?",
    vocabulary: ['job security', 'public welfare', 'regulatory impact', 'bureaucracy vs innovation', 'performance incentives'],
    grammarTargets: ['Comparatives (more predictable than, faster-paced than)', 'Conditional structures (If someone prioritizes...)'],
    conversationSteps: [
      {
        stepIndex: 1,
        aiPrompt: "And on the flip side, what makes the private corporate sector compelling for high-growth professionals?",
        expectedResponseConcept: 'Speed of execution, meritocratic growth, modern tech stack, global exposure.',
        hints: {
          wordHint: 'merit-based, cutting-edge, agility, global scale',
          sentenceHint: 'In the private sector, professionals often appreciate...',
          fullHint: 'The private sector often offers faster meritocratic growth and exposure to cutting-edge technologies.'
        },
        suggestedStarters: [
          'On the other hand, the private sector offers...',
          'From a career velocity standpoint...',
          'Professionals who thrive in dynamic environments often favor...'
        ]
      }
    ],
    evaluationRules: [
      {
        criteria: 'Presents both viewpoints with balance and articulates personal values respectfully'
      }
    ],
    bestAnswerComparisons: [
      {
        userSpokenHypothesis: "Govt job means no work and private job means tension.",
        naturalVersion: "Government roles offer stability and public service, while private companies offer fast-paced learning and career agility.",
        professionalVersion: "Public sector roles provide enduring stability and civic impact, whereas private industry excels in fast meritocratic progression and technological innovation.",
        whyExplanation: "Sophisticated vocabulary ('enduring stability', 'meritocratic progression') elevates your professional stance."
      }
    ]
  },
  {
    id: 'rp-interview-salary',
    category: 'interview',
    title: 'Navigating Salary Expectations',
    description: 'Respond diplomatically to salary questions, emphasizing role value, research, and flexibility.',
    difficulty: 'Intermediate',
    userRole: 'Candidate',
    aiRole: 'Talent Acquisition Partner',
    estimatedDurationMin: 5,
    expectedSkills: ['Salary Negotiation Etiquette', 'Professional Flexibility', 'Market Awareness'],
    objective: 'State compensation expectations professionally without sounding rigid, abrupt, or under-confident.',
    context: 'The recruiter asks the standard compensation question at the end of an interview.',
    openingMessage: "We have had a very productive conversation today. To ensure we are aligned, could you share your compensation expectations for this position?",
    vocabulary: ['industry benchmark', 'commensurate with', 'comprehensive package', 'open to discussion'],
    grammarTargets: ['Polite modal qualifiers (I would expect, based on...)', 'Non-committal polite phrases'],
    conversationSteps: [
      {
        stepIndex: 1,
        aiPrompt: "That is helpful context. Beyond the base salary, are there specific elements of the overall package or benefits that matter most to you?",
        expectedResponseConcept: 'Health insurance, learning budget, flexible hours, annual bonuses.',
        hints: {
          wordHint: 'benefits, professional development, wellness, performance bonus',
          sentenceHint: 'I value a comprehensive package that includes...',
          fullHint: 'I place high value on continuous learning support, health coverage, and performance-based incentives.'
        },
        suggestedStarters: [
          'In addition to base salary, I care deeply about...',
          'Opportunities for professional development and mentorship...',
          'A competitive benefits package with health coverage is important...'
        ]
      }
    ],
    evaluationRules: [
      {
        criteria: 'Avoids one-word monetary demands; articulates range and total value proposition'
      }
    ],
    bestAnswerComparisons: [
      {
        userSpokenHypothesis: "I want 10 lakhs minimum. You pay how much?",
        naturalVersion: "Based on my research and current market rates, I am targeting around 10 LPA, but I am open to discussing the overall offer.",
        professionalVersion: "Based on the scope of responsibilities and standard industry benchmarks, I am targeting a package in the range of 10 to 12 LPA, though I am flexible depending on the complete benefits structure.",
        whyExplanation: "'Industry benchmarks' and 'scope of responsibilities' ground your number in market reality."
      }
    ]
  },
  {
    id: 'rp-interview-english-feedback',
    category: 'interview',
    title: 'Interviewer Notes Your English Needs Work',
    description: 'Respond with emotional composure, growth mindset, and concrete improvement efforts.',
    difficulty: 'Intermediate',
    userRole: 'Candidate',
    aiRole: 'Direct Interviewer',
    estimatedDurationMin: 5,
    expectedSkills: ['Grace Under Pressure', 'Constructive Receptivity', 'Demonstrating Growth Habits'],
    objective: 'Acknowledge language feedback calmly, outline daily speaking practice, and maintain interview momentum.',
    context: 'A high-stress moment: the interviewer openly remarks that your spoken English could be stronger.',
    openingMessage: "Your technical background looks promising, but your spoken English fluency seems a bit hesitant today. Communication is critical here. How are you working to address this?",
    vocabulary: ['constructive feedback', 'active speaking practice', 'clarity over perfection', 'dedication'],
    grammarTargets: ['Adverbial concessions (I appreciate your feedback, I am actively...)'],
    conversationSteps: [
      {
        stepIndex: 1,
        aiPrompt: "I appreciate your positive attitude. How will you ensure your communication doesn't cause misunderstandings in client or cross-team meetings?",
        expectedResponseConcept: 'Active listening, summarizing decisions, written confirmation, asking clarifying questions.',
        hints: {
          wordHint: 'active listening, summarize, written recap, confirm',
          sentenceHint: 'I always make it a practice to summarize key points in writing...',
          fullHint: 'I practice active listening and always send a concise written summary after syncs to ensure everyone is completely aligned.'
        },
        suggestedStarters: [
          'To prevent any ambiguity, I always...',
          'I rely on clear documentation and quick confirmation emails...',
          'I never hesitate to ask clarifying questions before starting work...'
        ]
      }
    ],
    evaluationRules: [
      {
        criteria: 'Displays maturity and concrete habits without becoming defensive'
      }
    ],
    bestAnswerComparisons: [
      {
        userSpokenHypothesis: "English is not my mother tongue. Don't reject me for that.",
        naturalVersion: "I appreciate your honesty. I'm actively practicing spoken English every day with AI partners and daily reading to build natural fluency.",
        professionalVersion: "Thank you for the constructive feedback. While English is my second language, I am committed to continuous improvement and dedicate time every day to speaking practice and professional vocabulary.",
        whyExplanation: "Acknowledging constructive feedback gracefully turns a potential vulnerability into proof of your dedication."
      }
    ]
  },

  // ==========================================
  // 2. OFFICE / CORPORATE SCENARIOS
  // ==========================================
  {
    id: 'rp-office-meeting',
    category: 'office',
    title: 'Scheduling & Rescheduling a Meeting',
    description: 'Propose meeting times, confirm agenda, handle schedule conflicts, and send polite confirmations.',
    difficulty: 'Beginner',
    userRole: 'Team Member',
    aiRole: 'Project Manager (Sarah)',
    estimatedDurationMin: 5,
    expectedSkills: ['Time Suggestions', 'Polite Modal Verbs', 'Handling Conflicts'],
    objective: 'Propose an available slot, agree on agenda, and navigate a sudden calendar conflict diplomatically.',
    context: 'You need to review sprint deliverables with your project manager.',
    openingMessage: "Hi! I got your message about syncing up on the upcoming feature release. Do you have some time tomorrow to walk through it?",
    vocabulary: ['touch base', 'conflict', 'reschedule', 'availability', 'agenda'],
    grammarTargets: ['Modal verbs (Could we, Would you be free, Shall we)'],
    conversationSteps: [
      {
        stepIndex: 1,
        aiPrompt: "Tomorrow at 2 PM works on my end. Actually, wait—a client demo just appeared on my calendar. Could we push it to Thursday morning instead?",
        expectedResponseConcept: 'Gracefully accepting the reschedule and confirming a Thursday morning time.',
        hints: {
          wordHint: 'Thursday morning, no problem, that works for me, calendar invite',
          sentenceHint: 'Thursday morning works perfectly. How about 10:30 AM?',
          fullHint: 'No problem at all! Thursday at 10:30 AM fits my schedule well. I will send over a calendar invite.'
        },
        suggestedStarters: [
          'No problem at all. Thursday morning works great...',
          'That completely fine. Shall we lock in 11 AM on Thursday?',
          'I understand. Let me check my calendar—Thursday looks clear...'
        ]
      }
    ],
    evaluationRules: [
      {
        criteria: 'Uses polite modal phrasing (Would Thursday work? instead of Come on Thursday)'
      }
    ],
    bestAnswerComparisons: [
      {
        userSpokenHypothesis: "Meet me at 2 PM tomorrow. Be ready.",
        naturalVersion: "Could we meet tomorrow at 2 PM to go over the feature?",
        professionalVersion: "Would you have 20 minutes tomorrow afternoon around 2 PM to review the release deliverables?",
        whyExplanation: "'Would you have 20 minutes...' respects the other person's busy calendar."
      }
    ]
  },
  {
    id: 'rp-office-new-colleague',
    category: 'office',
    title: 'Introduce Yourself to a New Colleague',
    description: 'Break the ice with a newly joined team member, explain your role, and offer welcoming support.',
    difficulty: 'Beginner',
    userRole: 'Existing Team Member',
    aiRole: 'New Colleague (Priya)',
    estimatedDurationMin: 5,
    expectedSkills: ['Warm Greetings', 'Explaining Roles Simply', 'Supportive Tone'],
    objective: 'Welcome a new hire warmly, explain what you work on, and create an open door for future questions.',
    context: 'It is Priya’s first week at your company and you meet her near the cafeteria or on a welcome Slack call.',
    openingMessage: "Hi there! I believe this is our first time meeting. I just joined the product team this Monday as an associate designer.",
    vocabulary: ['welcome aboard', 'onboarding', 'feel free to ping me', 'cross-functional'],
    grammarTargets: ['Present Simple for job roles', 'Imperatives for polite offers (Please let me know)'],
    conversationSteps: [
      {
        stepIndex: 1,
        aiPrompt: "Thanks so much for the warm welcome! Everyone has been so helpful. How long have you been with the company, and what are you currently focusing on?",
        expectedResponseConcept: 'Sharing tenure and current project focus in a friendly manner.',
        hints: {
          wordHint: 'been here for, primarily working on, collaborating',
          sentenceHint: 'I have been here for about a year, working on...',
          fullHint: 'I joined about a year ago and I am currently working on the backend payment integrations.'
        },
        suggestedStarters: [
          'I joined about eight months ago, and my main focus is...',
          'I have been with the team for nearly a year now...',
          'Welcome aboard! I primarily work on...'
        ]
      }
    ],
    evaluationRules: [
      {
        criteria: 'Uses warm, encouraging conversational tone'
      }
    ],
    bestAnswerComparisons: [
      {
        userSpokenHypothesis: "I am developer here. Ask me if doubt.",
        naturalVersion: "Welcome to the team! I'm on the engineering side, so feel free to ping me anytime you have questions.",
        professionalVersion: "A very warm welcome aboard! I work on the engineering team. If there's anything you need while settling into the onboarding process, please don't hesitate to reach out.",
        whyExplanation: "'Please don't hesitate to reach out' is the gold standard for office collegiality."
      }
    ]
  },
  {
    id: 'rp-office-late',
    category: 'office',
    title: 'Inform Manager You Will Be Arriving Late',
    description: 'Politely inform your manager about an unexpected commute delay, give estimated arrival, and assure task coverage.',
    difficulty: 'Intermediate',
    userRole: 'Employee',
    aiRole: 'Manager (Mr. Harrison)',
    estimatedDurationMin: 4,
    expectedSkills: ['Polite Notifications', 'Giving Realistic ETAs', 'Proactive Responsibility'],
    objective: 'Send a professional phone/voice update regarding a delay, with estimated arrival and reassurance on urgent tasks.',
    context: 'You are stuck in heavy traffic or faced a metro breakdown on Monday morning.',
    openingMessage: "Good morning. I noticed you haven't arrived for the morning standup yet. Is everything alright on your end?",
    vocabulary: ['unexpected delay', 'transit breakdown', 'estimated time of arrival (ETA)', 'covered', 'apologies'],
    grammarTargets: ['Present Continuous for current circumstances', 'Future with will for assurances'],
    conversationSteps: [
      {
        stepIndex: 1,
        aiPrompt: "Thanks for updating me promptly. We have a client deployment review at 10:30. Will you be in office and ready by then, or should someone else cover your slides?",
        expectedResponseConcept: 'Confirming arrival time or providing an alternative plan (e.g. logging on remotely).',
        hints: {
          wordHint: 'in person, dial in remotely, hot spot, slides ready',
          sentenceHint: 'I should arrive by 10:15, but I can join via phone if needed...',
          fullHint: 'I expect to reach by 10:15. If there is any delay, I will immediately dial in from my laptop to cover the slides.'
        },
        suggestedStarters: [
          'I expect to arrive by 10:15 at the latest...',
          'Just in case traffic stalls, I can log in remotely from my phone...',
          'My slides are completely ready, and I will be present...'
        ]
      }
    ],
    evaluationRules: [
      {
        criteria: 'Offers proactive solution alongside apology'
      }
    ],
    bestAnswerComparisons: [
      {
        userSpokenHypothesis: "Bus late. Coming 10:30.",
        naturalVersion: "Good morning! My bus was delayed, so I'll be in around 10:15. Apologies for the inconvenience.",
        professionalVersion: "Good morning, Mr. Harrison. I apologize for the delay; I encountered an unexpected transit breakdown. I estimate arriving by 10:15, and I am already monitoring emails on my phone.",
        whyExplanation: "Providing an ETA and noting you are monitoring emails reassures your manager that work isn't stalled."
      }
    ]
  },
  {
    id: 'rp-office-daily-talk',
    category: 'office',
    title: 'Daily Standup Talk with Manager',
    description: 'Deliver structured 3-part agile updates: What I completed → What I am doing today → Blockers.',
    difficulty: 'Intermediate',
    userRole: 'Team Member',
    aiRole: 'Engineering Manager (Deepa)',
    estimatedDurationMin: 5,
    expectedSkills: ['Concise Status Reporting', 'Blocker Articulation', 'Agile Terminology'],
    objective: 'Deliver a crisp 60-second standup report highlighting progress, current focus, and dependencies.',
    context: 'Your daily morning 15-minute team standup.',
    openingMessage: "Good morning everyone. Let's start our daily standup. What is your update today?",
    vocabulary: ['completed', 'currently tackling', 'blocker', 'dependency', 'PR review', 'staging'],
    grammarTargets: ['Past Simple for finished tasks', 'Present Continuous for today’s tasks'],
    conversationSteps: [
      {
        stepIndex: 1,
        aiPrompt: "Great progress on the database schema! Regarding the third-party API blocker you mentioned, do you want me to escalate that with their integration team?",
        expectedResponseConcept: 'Clarifying the exact support needed from the manager.',
        hints: {
          wordHint: 'escalate, API key, documentation, would be helpful',
          sentenceHint: 'Yes, an escalation would help because we are still waiting for...',
          fullHint: 'Yes, that would be very helpful. We have been waiting on their team for the sandbox credentials since yesterday.'
        },
        suggestedStarters: [
          'Yes, please, if you could escalate...',
          'That would be very helpful because...',
          'I think a quick email from your end would unblock us...'
        ]
      }
    ],
    evaluationRules: [
      {
        criteria: 'Covers finished work, today’s plan, and blockers cleanly'
      }
    ],
    bestAnswerComparisons: [
      {
        userSpokenHypothesis: "Yesterday did work. Today doing work. No blocker.",
        naturalVersion: "Yesterday I wrapped up the login bug. Today I'm working on the checkout screen, and I'm good on blockers.",
        professionalVersion: "Yesterday I completed the user authentication flow and submitted the PR. Today I am implementing the checkout screen. I have a minor dependency on the payment API credentials.",
        whyExplanation: "Naming specific components ('authentication flow', 'checkout screen') gives managers clear visibility."
      }
    ]
  },
  {
    id: 'rp-office-clarification',
    category: 'office',
    title: 'Ask Clarification About an Unclear Task',
    description: 'Clarify ambiguities in project requirements, deliverables, and deadlines without sounding clueless.',
    difficulty: 'Intermediate',
    userRole: 'Associate',
    aiRole: 'Team Lead (David)',
    estimatedDurationMin: 5,
    expectedSkills: ['Assertive Questioning', 'Scoping Work', 'Active Listening'],
    objective: 'Politely clarify scope, deadline, and expected output format when instructions are vague.',
    context: 'Your team lead asked you to "look into customer retention numbers" without giving specifics.',
    openingMessage: "Hey, thanks for following up. Did you have a chance to look over the customer retention request I mentioned earlier?",
    vocabulary: ['clarify scope', 'specific metrics', 'deliverable format', 'priority level', 'timeline'],
    grammarTargets: ['Indirect questions (Could you clarify whether, I wanted to confirm if)'],
    conversationSteps: [
      {
        stepIndex: 1,
        aiPrompt: "Good catch. I should have been clearer. We need a one-page summary highlighting churn for the last quarter. Can you have that ready by Thursday afternoon?",
        expectedResponseConcept: 'Confirming timeline and output format.',
        hints: {
          wordHint: 'Thursday afternoon, one-page summary, churn metrics, confirmed',
          sentenceHint: 'Thursday afternoon works well. I will focus on the Q3 churn breakdown...',
          fullHint: 'Thursday afternoon works for me. I will draft the one-page summary focusing on the Q3 churn metrics and send it for your review.'
        },
        suggestedStarters: [
          'Thursday afternoon is very doable. To confirm...',
          'That clarifies things nicely. I will put together...',
          'Understood. I will prepare the one-page overview by Thursday...'
        ]
      }
    ],
    evaluationRules: [
      {
        criteria: 'Uses polite indirect questions rather than abrupt confusion'
      }
    ],
    bestAnswerComparisons: [
      {
        userSpokenHypothesis: "What you mean? I don't understand your task.",
        naturalVersion: "Could you clarify what specific metrics you'd like me to focus on in the report?",
        professionalVersion: "I wanted to quickly align on the scope—could you clarify whether you need a detailed data export or a high-level summary of Q3 churn?",
        whyExplanation: "Offering two options ('detailed export or high-level summary') shows you understand the problem space."
      }
    ]
  },
  {
    id: 'rp-office-leave',
    category: 'office',
    title: 'Requesting Leave & Vacation Days',
    description: 'Submit a formal leave request with exact dates, concise reason, and task handover coverage.',
    difficulty: 'Beginner',
    userRole: 'Team Member',
    aiRole: 'Manager',
    estimatedDurationMin: 4,
    expectedSkills: ['Formal Request Phrasing', 'Handover Planning', 'Confirmation'],
    objective: 'Request upcoming personal or vacation leave, ensuring the manager is reassured about ongoing work handover.',
    context: 'You want to take two days off next week for family commitments.',
    openingMessage: "Hi! You mentioned you wanted to discuss something regarding your schedule for next week?",
    vocabulary: ['request leave', 'take time off', 'coverage', 'handover', 'emergencies'],
    grammarTargets: ['Polite requests (I would like to request, Would it be acceptable if)'],
    conversationSteps: [
      {
        stepIndex: 1,
        aiPrompt: "Next Monday and Tuesday shouldn't be an issue as long as the sprint items are taken care of. Have you arranged for anyone on the team to cover urgent queries while you're away?",
        expectedResponseConcept: 'Confirming handover partner and offline availability for emergencies.',
        hints: {
          wordHint: 'handover document, Rahul will cover, urgent calls, all caught up',
          sentenceHint: 'Yes, Rahul has agreed to cover my active tickets...',
          fullHint: 'Yes, Rahul agreed to monitor my tickets, and I will ensure my current tasks are merged before I log off on Friday.'
        },
        suggestedStarters: [
          'Yes, I have already briefed Rahul, and he will cover...',
          'I have prepared a quick handover doc, and my teammate will...',
          'All my deliverables will be wrapped up before I leave, and...'
        ]
      }
    ],
    evaluationRules: [
      {
        criteria: 'Specifies dates, reason, and handover plan respectfully'
      }
    ],
    bestAnswerComparisons: [
      {
        userSpokenHypothesis: "I won't come Monday and Tuesday. Taking holiday.",
        naturalVersion: "I'd like to request leave for next Monday and Tuesday for some family commitments.",
        professionalVersion: "I would like to request two days of annual leave for next Monday and Tuesday. I have already arranged for Rahul to cover urgent queries during my absence.",
        whyExplanation: "'I would like to request two days of leave' paired with proactive coverage reassurance creates immediate managerial trust."
      }
    ]
  },

  // ==========================================
  // 3. DAILY LIFE SCENARIOS
  // ==========================================
  {
    id: 'rp-daily-find-item',
    category: 'daily_life',
    title: 'Find an Item in a Supermarket',
    description: 'Ask store staff for help finding specific groceries, check other sizes or brands, and inquire about prices.',
    difficulty: 'Beginner',
    userRole: 'Customer',
    aiRole: 'Supermarket Associate',
    estimatedDurationMin: 4,
    expectedSkills: ['Polite Inquiries', 'Understanding Directions', 'Clarifying Quantities'],
    objective: 'Politely ask where an item is located, ask for an alternative brand/size, and thank the associate.',
    context: 'You are shopping in a large supermarket looking for green tea and almond milk.',
    openingMessage: "Hello! Welcome to FreshChoice Mart. Can I help you find anything today?",
    vocabulary: ['aisle', 'in stock', 'organic section', 'brand alternative', 'dairy-free'],
    grammarTargets: ['Excuse me, where can I find...', 'Do you happen to have...'],
    conversationSteps: [
      {
        stepIndex: 1,
        aiPrompt: "Green tea is right in Aisle 4 on the second shelf. We also have organic honey right next to it if you're interested!",
        expectedResponseConcept: 'Thanking the associate and asking for the second item (e.g. almond milk).',
        hints: {
          wordHint: 'thank you, aisle 4, almond milk, dairy alternative',
          sentenceHint: 'Thank you! Could you also point me toward the almond milk?',
          fullHint: 'Thank you so much! Could you also tell me where the almond milk or dairy-free options are kept?'
        },
        suggestedStarters: [
          'Thanks a lot! And where would I find...',
          'Great, thank you! Could you also check if you carry...',
          'Appreciate that! One more thing, do you have...'
        ]
      }
    ],
    evaluationRules: [
      {
        criteria: 'Uses polite inquiry formulas (Excuse me, Could you tell me where...)'
      }
    ],
    bestAnswerComparisons: [
      {
        userSpokenHypothesis: "Where green tea? Give me.",
        naturalVersion: "Excuse me, could you tell me where the green tea is?",
        professionalVersion: "Excuse me, could you point me in the direction of the herbal tea selection?",
        whyExplanation: "'Could you point me in the direction of...' sounds natural and friendly."
      }
    ]
  },
  {
    id: 'rp-daily-directions',
    category: 'daily_life',
    title: 'Ask for Street Directions',
    description: 'Politely ask a local for directions to a subway/railway station, confirm landmarks, and thank them.',
    difficulty: 'Beginner',
    userRole: 'Pedestrian / Tourist',
    aiRole: 'Local Resident',
    estimatedDurationMin: 4,
    expectedSkills: ['Location Prepositions', 'Confirming Directions', 'Street Politeness'],
    objective: 'Ask for directions to the nearest train station, repeat instructions to confirm, and thank the passerby.',
    context: 'Your phone battery died while you are walking in an unfamiliar city neighborhood.',
    openingMessage: "Hello! You look like you might be looking for something around here. Can I help you?",
    vocabulary: ['crosswalk', 'intersection', 'take a left', 'two blocks down', 'landmark'],
    grammarTargets: ['Prepositions of place (opposite, across from, past the...)'],
    conversationSteps: [
      {
        stepIndex: 1,
        aiPrompt: "Sure! Walk straight past the bakery, turn right at the traffic lights, and you will see the station entrance right opposite the pharmacy. It's about a 5-minute walk.",
        expectedResponseConcept: 'Repeating the directions to confirm understanding and thanking the person.',
        hints: {
          wordHint: 'past the bakery, turn right, opposite pharmacy, thank you',
          sentenceHint: 'So straight past the bakery, right at the light, opposite the pharmacy?',
          fullHint: 'So I go straight past the bakery, take a right at the lights, and it is right across from the pharmacy. Thank you so much for your help!'
        },
        suggestedStarters: [
          'Just to make sure I got that: straight past the bakery and...',
          'So it is a right turn at the traffic lights? Thank you!',
          'Understood, across from the pharmacy. Appreciate your time!'
        ]
      }
    ],
    evaluationRules: [
      {
        criteria: 'Confirms directions accurately before departing'
      }
    ],
    bestAnswerComparisons: [
      {
        userSpokenHypothesis: "Station where? How to go?",
        naturalVersion: "Excuse me, how do I get to the central railway station from here?",
        professionalVersion: "Pardon me, could you point me toward the nearest metro station? Is it within walking distance?",
        whyExplanation: "Asking 'Is it within walking distance?' provides immediate context on distance."
      }
    ]
  },
  {
    id: 'rp-daily-book-cab',
    category: 'daily_life',
    title: 'Booking a Cab / Talking to Driver',
    description: 'Confirm pickup point, destination, estimated fare, and provide clear gate or landmark instructions.',
    difficulty: 'Beginner',
    userRole: 'Passenger',
    aiRole: 'Cab Driver (Suresh)',
    estimatedDurationMin: 4,
    expectedSkills: ['Landmark Descriptions', 'Fare Clarification', 'Clear Enunciation'],
    objective: 'Confirm ride details with the driver over phone, explain pickup landmark, and ensure correct destination.',
    context: 'Your booked cab driver calls you to verify your pickup point in a busy tech park.',
    openingMessage: "Hello, sir/ma'am! I have reached the tech park. Where exactly are you standing for pickup?",
    vocabulary: ['main entrance', 'pillar number', 'terminal gate', 'luggage in trunk', 'drop-off'],
    grammarTargets: ['Prepositions (standing near, next to the gate)'],
    conversationSteps: [
      {
        stepIndex: 1,
        aiPrompt: "Got it, near Gate 2 by the coffee shop. I see you now in the red shirt. The map shows heavy traffic on the flyover; would it be okay if we take the ring road instead?",
        expectedResponseConcept: 'Confirming the alternate route and checking if it affects the fare/time.',
        hints: {
          wordHint: 'ring road, toll charges, estimated time, that is fine',
          sentenceHint: 'Yes, that is fine as long as we reach the airport on time...',
          fullHint: 'Yes, the ring road is fine. Will there be any extra toll charges, and what is our estimated arrival time?'
        },
        suggestedStarters: [
          'That works for me as long as it is faster...',
          'Sure, take whichever route has less traffic...',
          'That is fine. Will that change the fare or toll?'
        ]
      }
    ],
    evaluationRules: [
      {
        criteria: 'Gives clear landmarks and verifies route/fare logically'
      }
    ],
    bestAnswerComparisons: [
      {
        userSpokenHypothesis: "I am near building. Come fast.",
        naturalVersion: "I'm waiting right outside Gate 2, just next to the coffee shop.",
        professionalVersion: "I am standing directly outside Gate 2 by the main visitor parking area. You will spot me in a blue jacket.",
        whyExplanation: "Specifying a specific gate and your clothing color speeds up cab pickups instantly."
      }
    ]
  },
  {
    id: 'rp-daily-emergency',
    category: 'daily_life',
    title: 'Everyday Emergency Communication',
    description: 'Communicate clearly and calmly during an everyday emergency: state location, problem, and ask for assistance.',
    difficulty: 'Intermediate',
    userRole: 'Caller / Citizen',
    aiRole: 'Emergency Dispatcher',
    estimatedDurationMin: 4,
    expectedSkills: ['Calm Articulation Under Stress', 'Precise Location Giving', 'Concise Problem Description'],
    objective: 'State the nature of the situation, exact location, whether anyone is injured, and follow dispatcher questions.',
    context: 'You witnessed a minor two-vehicle collision on Main Street and need assistance.',
    openingMessage: "Emergency services. Do you require Police, Fire, or Ambulance assistance? What is your current location?",
    vocabulary: ['collision', 'intersection', 'minor injuries', 'conscious', 'dispatch assistance'],
    grammarTargets: ['Past and present state descriptions (There has been an accident, people are conscious)'],
    conversationSteps: [
      {
        stepIndex: 1,
        aiPrompt: "Understood, at the intersection of 5th Avenue and Oak Street. Is anyone trapped, and are the drivers conscious and breathing?",
        expectedResponseConcept: 'Confirming consciousness and lack of fire/trapped individuals.',
        hints: {
          wordHint: 'conscious, alert, no fire, minor scrapes, ambulance',
          sentenceHint: 'Both drivers are conscious and out of their cars...',
          fullHint: 'Both drivers are conscious and standing outside their vehicles. There is no fire, but an ambulance is needed for minor cuts.'
        },
        suggestedStarters: [
          'Both parties are conscious and alert...',
          'There are no severe injuries, but medical assistance is needed for...',
          'Everyone is out of their vehicles and breathing normally...'
        ]
      }
    ],
    evaluationRules: [
      {
        criteria: 'Provides clear facts without panic, avoids dangerous medical speculation'
      }
    ],
    bestAnswerComparisons: [
      {
        userSpokenHypothesis: "Big accident happen! Come fast fast!",
        naturalVersion: "There was a car collision at 5th and Oak. An ambulance is needed, but everyone is conscious.",
        professionalVersion: "I am reporting a two-car collision at the intersection of 5th Avenue and Oak Street. Both drivers are conscious, but medical personnel should examine them for injuries.",
        whyExplanation: "Calm, specific descriptions ('intersection of 5th and Oak', 'both conscious') allow dispatchers to act immediately."
      }
    ]
  },

  // ==========================================
  // 4. TRAVEL SCENARIOS
  // ==========================================
  {
    id: 'rp-travel-airport',
    category: 'travel',
    title: 'Airport Check-in & Baggage Counter',
    description: 'Check in for an international flight, request an aisle/window seat, check bags, and verify boarding gate.',
    difficulty: 'Beginner',
    userRole: 'Passenger',
    aiRole: 'Airline Counter Agent (Elena)',
    estimatedDurationMin: 5,
    expectedSkills: ['Flight Travel Phrases', 'Seat Preferences', 'Baggage Allowances'],
    objective: 'Complete check-in smoothly, present passport, verify luggage weight, and confirm boarding gate and time.',
    context: 'You are at the airline departure terminal checking in for your flight.',
    openingMessage: "Good afternoon! Where are you flying to today? May I see your passport and booking confirmation?",
    vocabulary: ['boarding pass', 'aisle seat', 'window seat', 'overhead baggage', 'gate number', 'transit'],
    grammarTargets: ['Polite requests (Could I please have an aisle seat?)', 'Prepositions of time'],
    conversationSteps: [
      {
        stepIndex: 1,
        aiPrompt: "Thank you. I have you confirmed for Flight 402 to London. Would you prefer a window or an aisle seat today?",
        expectedResponseConcept: 'Expressing seat preference politely and asking about baggage allowance.',
        hints: {
          wordHint: 'aisle seat, window seat, carry-on bag, allowance',
          sentenceHint: 'I would prefer an aisle seat if possible, please...',
          fullHint: 'Could I please have an aisle seat towards the front? Also, I have one checked suitcase and one carry-on backpack.'
        },
        suggestedStarters: [
          'Could I get an aisle seat, please?',
          'If available, I would love a window seat...',
          'An aisle seat would be wonderful, thank you.'
        ]
      },
      {
        stepIndex: 2,
        aiPrompt: "Here is your boarding pass. Gate 24B, boarding starts at 4:15 PM. Do you have any liquids or battery banks in your checked luggage?",
        expectedResponseConcept: 'Confirming no hazardous items and thanking the agent.',
        hints: {
          wordHint: 'no liquids, power bank in backpack, thank you, gate 24B',
          sentenceHint: 'No, my power bank is in my personal carry-on backpack...',
          fullHint: 'No, I have my power bank with me in my carry-on bag. Thank you very much, have a nice day!'
        },
        suggestedStarters: [
          'No liquids or batteries in the checked bag...',
          'Everything electronic is in my backpack. Thank you!',
          'All clear. Thank you for your help!'
        ]
      }
    ],
    evaluationRules: [
      {
        criteria: 'Confirms travel details with polite brevity'
      }
    ],
    bestAnswerComparisons: [
      {
        userSpokenHypothesis: "Give me window seat. London ticket.",
        naturalVersion: "I'm flying to London. Could I please have a window seat?",
        professionalVersion: "Good afternoon, I am checking in for London. Here is my passport. Could you check if there is an aisle seat available?",
        whyExplanation: "Handing over documents with a polite greeting establishes courteous travel rapport."
      }
    ]
  },
  {
    id: 'rp-travel-immigration',
    category: 'travel',
    title: 'Immigration & Border Control Conversation',
    description: 'Answer border control questions concisely: purpose of visit, length of stay, accommodation, and return ticket.',
    difficulty: 'Intermediate',
    userRole: 'Traveler',
    aiRole: 'Border Control Officer',
    estimatedDurationMin: 5,
    expectedSkills: ['Concise Factual Answers', 'Understanding Official Inquiries', 'Calm Confidence'],
    objective: 'Provide truthful, concise answers regarding trip duration, purpose, hotel stay, and return ticket.',
    context: 'You have landed at immigration control at Heathrow Airport.',
    openingMessage: "Good morning. Passport, please. What is the primary purpose of your visit to the United Kingdom?",
    vocabulary: ['tourism', 'leisure', 'conference', 'accommodation', 'return ticket', 'duration of stay'],
    grammarTargets: ['Present Continuous for intended stay (I am staying for 10 days)', 'Infinitive of purpose (To attend a conference)'],
    conversationSteps: [
      {
        stepIndex: 1,
        aiPrompt: "How long do you intend to stay, and where will you be residing during your visit?",
        expectedResponseConcept: 'Stating exact duration (e.g. 10 days) and hotel or address.',
        hints: {
          wordHint: 'ten days, staying at hotel, return flight booked',
          sentenceHint: 'I am staying for 10 days at the Hilton Hotel...',
          fullHint: 'I am staying for ten days. I have reservations at the Central Hotel, and my return flight is booked for next Sunday.'
        },
        suggestedStarters: [
          'I will be here for ten days, staying at...',
          'My stay is two weeks. I am booked at the...',
          'I am here for one week, and here is my hotel confirmation...'
        ]
      }
    ],
    evaluationRules: [
      {
        criteria: 'Provides direct, concise, factual answers without rambling or hesitation'
      }
    ],
    bestAnswerComparisons: [
      {
        userSpokenHypothesis: "I come for visiting place. Many days.",
        naturalVersion: "I'm here for tourism for two weeks, staying at a hotel near central station.",
        professionalVersion: "I am visiting for leisure and sightseeing for ten days. Here is my hotel booking and return flight itinerary.",
        whyExplanation: "Offering your booking document alongside a direct answer makes immigration frictionless."
      }
    ]
  },
  {
    id: 'rp-travel-hotel',
    category: 'travel',
    title: 'Hotel Check-in & Special Room Requests',
    description: 'Check in with your reservation code, request a quiet high floor room, confirm breakfast times, and Wi-Fi access.',
    difficulty: 'Beginner',
    userRole: 'Guest',
    aiRole: 'Hotel Receptionist (Marco)',
    estimatedDurationMin: 5,
    expectedSkills: ['Hospitality Exchanges', 'Modal Requests', 'Amenity Inquiries'],
    objective: 'Confirm your booking, request a quiet room politely, and clarify breakfast timings and Wi-Fi details.',
    context: 'You just arrived at your hotel lobby after a long travel day.',
    openingMessage: "Good evening! Welcome to the Grand Plaza Hotel. Are you checking in today?",
    vocabulary: ['reservation under the name of', 'high-floor room', 'complimentary breakfast', 'key card', 'Wi-Fi credentials'],
    grammarTargets: ['Polite requests (Would it be possible to get..., Could you confirm...)'],
    conversationSteps: [
      {
        stepIndex: 1,
        aiPrompt: "I found your reservation for three nights, Mr./Ms. Guest. I have assigned you Room 304. Would that be suitable, or do you have any room preferences?",
        expectedResponseConcept: 'Politely asking for a higher floor away from the street.',
        hints: {
          wordHint: 'higher floor, quiet room, away from elevator, street noise',
          sentenceHint: 'If possible, could I get a room on a higher floor?',
          fullHint: 'Would it be possible to get a room on a higher floor away from street noise? I am a light sleeper.'
        },
        suggestedStarters: [
          'If possible, could I request a room on a higher floor?',
          'Would you happen to have anything available on an upper floor?',
          'Could I ask for a quiet room away from the elevators?'
        ]
      }
    ],
    evaluationRules: [
      {
        criteria: 'Uses polite modal requests instead of abrupt demands'
      }
    ],
    bestAnswerComparisons: [
      {
        userSpokenHypothesis: "Room 304 no good. Give me high room with breakfast.",
        naturalVersion: "Could I please get a room on a higher floor? Also, is breakfast included?",
        professionalVersion: "Would it be possible to switch to a higher floor that is a bit quieter? Also, could you confirm the breakfast timings and location?",
        whyExplanation: "'Would it be possible to switch...' is respectful and very warmly received by hotel staff."
      }
    ]
  },

  // ==========================================
  // 5. RESTAURANT SCENARIOS
  // ==========================================
  {
    id: 'rp-rest-dining',
    category: 'restaurant',
    title: 'Restaurant Ordering & Dietary Preferences',
    description: 'Ask for recommendations, clarify vegetarian/vegan options or food allergies, and request the bill.',
    difficulty: 'Beginner',
    userRole: 'Diner',
    aiRole: 'Waiter (Chef Marco)',
    estimatedDurationMin: 5,
    expectedSkills: ['Ordering Food', 'Dietary Restrictions', 'Polite Inquiries'],
    objective: 'Order a meal, ask about vegetarian or allergy options (supporting branching), and politely ask for the check.',
    context: 'You are seated at an Italian bistro for dinner.',
    openingMessage: "Good evening! Welcome to Trattoria Bella. Are you ready to order, or would you like a few more minutes with the menu?",
    vocabulary: ['appetizer', 'main course', 'vegetarian options', 'allergy', 'check / bill', 'recommend'],
    grammarTargets: ['I will have the..., Could you recommend..., Does this dish contain...'],
    conversationSteps: [
      {
        stepIndex: 1,
        aiPrompt: "Our chef's special tonight is the seafood risotto with prawns and creamy parmesan sauce. How does that sound to you?",
        expectedResponseConcept: 'Accepting or mentioning vegetarian/allergy preferences.',
        hints: {
          wordHint: 'vegetarian, allergic to shellfish, alternative dish, recommend pasta',
          sentenceHint: 'That sounds delicious, but I am vegetarian / allergic to seafood...',
          fullHint: 'That sounds lovely, but I am actually vegetarian. Could you recommend a vegetarian pasta dish instead?'
        },
        suggestedStarters: [
          'That sounds great, but I am vegetarian. Do you have...',
          'Actually, I am allergic to shellfish. What would you suggest instead?',
          'I prefer vegetarian dishes tonight. Could you recommend...'
        ],
        branches: [
          {
            triggerKeywords: ['vegetarian', 'veg', 'vegan', 'meatless', 'plant'],
            nextAiPrompt: "Wonderful! We have our signature handmade Wild Mushroom Penne with truffle oil and roasted pine nuts. It is 100% vegetarian. Shall I put that in for you?"
          },
          {
            triggerKeywords: ['allergy', 'allergic', 'shellfish', 'nuts', 'dairy', 'gluten'],
            nextAiPrompt: "Thank you for informing me right away. We take food allergies very seriously. I will notify the kitchen. Let me recommend our allergen-safe roasted vegetable platter. Would that suit you?"
          }
        ]
      }
    ],
    evaluationRules: [
      {
        criteria: 'Communicates food preferences and dietary guidelines clearly'
      }
    ],
    bestAnswerComparisons: [
      {
        userSpokenHypothesis: "No meat for me. Bring food.",
        naturalVersion: "I'm vegetarian, so could you suggest some meat-free options?",
        professionalVersion: "I follow a strict vegetarian diet—could you kindly point out your vegetarian specialties?",
        whyExplanation: "'Kindly point out your vegetarian specialties' turns a restriction into an enjoyable culinary inquiry."
      }
    ]
  },

  // ==========================================
  // 6. CUSTOMER SERVICE SCENARIOS
  // ==========================================
  {
    id: 'rp-cs-order-issue',
    category: 'customer_service',
    title: 'Customer Service: Wrong Item & Delivery Issue',
    description: 'Politely explain an incorrect e-commerce shipment, provide order ID, and request replacement or refund.',
    difficulty: 'Intermediate',
    userRole: 'Customer',
    aiRole: 'Support Specialist (Alex)',
    alternativeUserRole: 'Support Specialist',
    alternativeAiRole: 'Frustrated Customer',
    estimatedDurationMin: 5,
    expectedSkills: ['Problem Explanation', 'Polite Assertiveness', 'Providing Tracking Proof'],
    objective: 'Explain that the wrong item was delivered, reference order number, and agree on a replacement resolution.',
    context: 'You ordered wireless headphones, but the package contained a phone case.',
    openingMessage: "Thank you for contacting Customer Support. My name is Alex. How can I assist you with your order today?",
    vocabulary: ['order number', 'incorrect item delivered', 'replacement', 'refund', 'tracking number', 'invoice'],
    grammarTargets: ['Passive voice (The wrong item was delivered)', 'Conditionals (I would like to request a replacement if...)'],
    conversationSteps: [
      {
        stepIndex: 1,
        aiPrompt: "I am truly sorry to hear that you received the wrong item! Could you share your order number and confirm whether the box was sealed upon arrival?",
        expectedResponseConcept: 'Providing an order ID and explaining condition of delivery.',
        hints: {
          wordHint: 'order number #48291, box was sealed, return label, replacement',
          sentenceHint: 'My order number is #84920, and the parcel was sealed...',
          fullHint: 'My order number is #84920. The package was sealed, but inside was a phone case instead of headphones. I would appreciate an expedited replacement.'
        },
        suggestedStarters: [
          'My order number is #84920. Here is what happened...',
          'The parcel was completely sealed. The order number is...',
          'I have the invoice right here. The order ID is...'
        ]
      }
    ],
    evaluationRules: [
      {
        criteria: 'Maintains polite firmness without angry outbursts'
      }
    ],
    bestAnswerComparisons: [
      {
        userSpokenHypothesis: "You sent wrong thing! Cheater company! Give money back!",
        naturalVersion: "I received the wrong item in my package. My order number is #84920, and I'd like a replacement.",
        professionalVersion: "I am writing to report a fulfillment error. My order #84920 was supposed to contain headphones, but a phone case arrived instead. Could you please arrange an exchange or refund?",
        whyExplanation: "'Fulfillment error' and 'arrange an exchange or refund' gets immediate sympathetic customer care action."
      }
    ]
  },

  // ==========================================
  // 7. PUBLIC SPEAKING & DIFFICULT CONVERSATIONS
  // ==========================================
  {
    id: 'rp-diff-disagree-politely',
    category: 'public_speaking',
    title: 'Disagreeing Politely in a Strategy Meeting',
    description: 'Voice a differing perspective during a team debate without sounding confrontational or disrespectful.',
    difficulty: 'Advanced',
    userRole: 'Team Contributor',
    aiRole: 'Product Director',
    estimatedDurationMin: 6,
    expectedSkills: ['Diplomatic Disagreement', 'Constructive Feedback', 'Evidence-Based Arguments'],
    objective: 'Acknowledge colleague’s proposal, respectfully present an alternate view with reasons, and propose a pilot.',
    context: 'The team wants to push a release date up by two weeks, but you know testing is incomplete.',
    openingMessage: "I think we should expedite the launch and release the app next Monday to beat our competitors. What are your thoughts on this accelerated timeline?",
    vocabulary: ['from another perspective', 'risk mitigation', 'thorough QA testing', 'compromise', 'pilot release'],
    grammarTargets: ['Diplomatic hedging (I see your point, however; While that is ambitious...)'],
    conversationSteps: [
      {
        stepIndex: 1,
        aiPrompt: "I understand there are risks, but if we delay, competitors might steal market share. How can we balance your quality concerns with speed to market?",
        expectedResponseConcept: 'Suggesting a phased rollout or beta release.',
        hints: {
          wordHint: 'beta test, phased rollout, critical bugs, soft launch',
          sentenceHint: 'What if we did a soft launch with a limited beta user group?',
          fullHint: 'What if we compromise with a phased rollout? We could launch a closed beta to 10% of users next week while finishing security testing for the broader release.'
        },
        suggestedStarters: [
          'What if we consider a phased rollout or beta release?',
          'A potential middle ground could be a soft launch where...',
          'I propose we release to a pilot group first so that...'
        ]
      }
    ],
    evaluationRules: [
      {
        criteria: 'Uses diplomatic framing (I see your point, but... instead of That is wrong)'
      }
    ],
    bestAnswerComparisons: [
      {
        userSpokenHypothesis: "No, Monday release is bad idea. Bugs will crash everything.",
        naturalVersion: "I understand the urgency, but launching Monday risks major bugs that could hurt our user trust.",
        professionalVersion: "I certainly appreciate the competitive urgency; however, releasing before completing critical QA could compromise user trust. Could we consider a phased beta release instead?",
        whyExplanation: "'I certainly appreciate the urgency; however...' validates the director's concern before introducing the risk."
      }
    ]
  }
];

export const INITIAL_ROLEPLAY_HISTORY: RoleplayHistoryRecord[] = [
  {
    id: 'hist-1',
    scenarioId: 'rp-interview-intro',
    scenarioTitle: 'Introduce Yourself (The Classic Starter)',
    category: 'interview',
    difficulty: 'Intermediate',
    date: 'Yesterday at 5:20 PM',
    score: 84,
    durationMin: 7,
    turnsCount: 6,
    feedback: {
      overallScore: 84,
      outcome: 'Complete',
      scores: {
        communication: { score: 86, explanation: 'Clear, structured responses that directly addressed the questions.' },
        grammar: { score: 80, explanation: 'Good use of Present Continuous; minor slip in past tense consistency.' },
        vocabulary: { score: 85, explanation: 'Appropriate technical and career terminology used throughout.' },
        pronunciation: { score: 82, explanation: 'Words enunciated clearly with natural sentence rhythm.' },
        fluency: { score: 81, explanation: 'Minimal unnatural pauses; speaking pace averaged 128 WPM.' },
        clarity: { score: 88, explanation: 'Main message was easily understood with structured points.' },
        contextHandling: { score: 87, explanation: 'Maintained candidate persona very effectively.' }
      },
      whatYouDidWell: [
        'Used a clear 4-step framework (Present → Experience → Skills → Goal).',
        'Maintained a confident, polite tone with the interviewer.',
        'Connected past projects directly to target job requirements.'
      ],
      areasToImprove: [
        'Watch out for overusing the filler word "basically" when formulating ideas.',
        'Use "hold a degree" rather than "studied syllabus" for more polish.'
      ],
      recommendedCurriculumLesson: {
        lessonId: 'lesson-a2-u3-workplace',
        title: 'Talking About Work and Experience',
        level: 'Intermediate Level 1',
        focus: 'Past and Present Perfect tense consistency in interviews'
      }
    },
    transcript: [
      {
        id: 't-1',
        sender: 'ai',
        text: "Good morning! Thanks for making time to speak with us today. Let's start from the beginning: could you please tell me about yourself and your background?",
        timestamp: '00:05'
      },
      {
        id: 't-2',
        sender: 'user',
        text: "Good morning. I hold a degree in computer science, and for the past year, I have been building modern web applications focusing on React and responsive design.",
        timestamp: '00:32'
      }
    ]
  },
  {
    id: 'rp-hotel-checkin-hist',
    scenarioId: 'rp-travel-hotel',
    scenarioTitle: 'Hotel Check-in & Special Room Requests',
    category: 'travel',
    difficulty: 'Beginner',
    date: '2 days ago',
    score: 79,
    durationMin: 5,
    turnsCount: 5,
    feedback: {
      overallScore: 79,
      outcome: 'Complete',
      scores: {
        communication: { score: 82, explanation: 'Successfully checked in and clarified breakfast timings.' },
        grammar: { score: 76, explanation: 'Some hesitation with modal verbs (Could I please have).' },
        vocabulary: { score: 80, explanation: 'Understood amenities, key cards, and reservation details.' },
        pronunciation: { score: 78, explanation: 'Clear enunciation on numbers and names.' },
        fluency: { score: 77, explanation: 'Short natural pauses when thinking of room preferences.' },
        clarity: { score: 83, explanation: 'Hotel staff had zero trouble understanding room preference.' },
        contextHandling: { score: 80, explanation: 'Polite guest register maintained throughout.' }
      },
      whatYouDidWell: [
        'Politely requested a room on a quiet high floor.',
        'Confirmed breakfast timings and Wi-Fi access without hesitation.'
      ],
      areasToImprove: [
        'Practice "Would it be possible to..." instead of "I want high room".'
      ],
      recommendedCurriculumLesson: {
        lessonId: 'lesson-a1-u4-requests',
        title: 'Polite Requests and Modal Verbs',
        level: 'Beginner Level 2',
        focus: 'Could I have / Would you mind'
      }
    },
    transcript: [
      {
        id: 'th-1',
        sender: 'ai',
        text: "Good evening! Welcome to the Grand Plaza Hotel. Are you checking in today?",
        timestamp: '00:04'
      }
    ]
  }
];
