import {
  ProfessionalIntroTemplate,
  TellMeAboutYourselfGuide,
  TechnicalConceptTopic,
  InterviewQuestionItem,
  GroupDiscussionScenario,
  ProfessionalPhraseItem,
} from '../types/career';

// -------------------------------------------------------------------
// 1. PROFESSIONAL SELF-INTRODUCTION TEMPLATES (15s, 30s, 60s, 2min)
// -------------------------------------------------------------------
export const PROFESSIONAL_INTRO_TEMPLATES: ProfessionalIntroTemplate[] = [
  {
    id: 'intro-15s-hook',
    duration: '15s',
    archetype: 'technical',
    title: '15-Second Elevator Pitch',
    targetSeconds: 15,
    structureSteps: ['Greeting & Name', 'Core Specialization', 'Primary Value Delivered'],
    modelScript:
      'Hi, I am Alex Kumar, a full-stack engineer specializing in responsive React interfaces and scalable Node.js microservices that keep user latency under 100 milliseconds.',
    tips: [
      'Speak at an unhurried, measured pace (~35 words).',
      'Focus on the value you create, not just your job title.',
    ],
  },
  {
    id: 'intro-30s-networking',
    duration: '30s',
    archetype: 'student',
    title: '30-Second Student / Graduate Hook',
    targetSeconds: 30,
    structureSteps: ['Name & Degree', 'Key Technical Competency', 'Practical Project Proof', 'Career Aspiration'],
    modelScript:
      'Hello, I am Maya Sharma, a recent Computer Science graduate passionate about data visualization and distributed systems. For my capstone, I engineered a real-time transit tracker using TypeScript and Python. I am eager to apply these problem-solving skills to build mission-critical enterprise software.',
    tips: [
      'Highlight concrete technologies and your capstone project.',
      'Connect academic training directly to industry problem-solving.',
    ],
  },
  {
    id: 'intro-60s-interview-standard',
    duration: '60s',
    archetype: 'experienced',
    title: '60-Second Gold Standard Interview Opener',
    targetSeconds: 60,
    structureSteps: [
      'Professional Identity & Years of Experience',
      'Recent Flagship Achievement',
      'Core Technical & Collaborative Strengths',
      'Why This Role Excites You',
    ],
    modelScript:
      'Hello and thank you for taking the time to meet with me today. My name is Alex, and for the past three years, I have worked as a software engineer focused on building robust client-facing web applications. Most recently at CloudNova, I led the frontend redesign of our analytics portal, which increased daily active session duration by 28% and cut page load times in half. My core strengths lie in TypeScript architecture, component-driven design systems, and cross-functional collaboration with product and design teams. What particularly excites me about this opportunity is your mission to make real-time communication accessible to millions of global users.',
    tips: [
      'Use the Present-Past-Future narrative arc.',
      'Cite at least one measurable business or performance outcome.',
      'Conclude by connecting your enthusiasm directly to the company’s vision.',
    ],
  },
  {
    id: 'intro-2min-panel',
    duration: '2min',
    archetype: 'career_switcher',
    title: '2-Minute Comprehensive Executive Panel Intro',
    targetSeconds: 120,
    structureSteps: [
      'Professional Trajectory & Transferable Foundation',
      'The Catalyst for Technical Transition',
      'Hands-on Project Portfolio & Tech Stack',
      'Leadership & Communication Philosophy',
      'Forward-Looking Value Proposition',
    ],
    modelScript:
      'Good morning, everyone. My name is David Chen. Over the past five years, my career has bridged business operations and modern software development. I originally began in operational logistics, where I managed supply chain workflows and learned first-hand how software friction creates expensive organizational bottlenecks. That insight motivated me to transition into software engineering, where I could build solutions rather than merely navigate workarounds.\n\nOver the past two years, I have immersed myself in full-stack development, architecting serverless APIs with PostgreSQL, AWS Lambda, and React. My flagship project was an automated inventory forecasting tool that replaced hours of manual spreadsheet entries with automated webhook alerts. Beyond technical execution, my previous background gives me a distinct advantage: I communicate fluently with non-technical stakeholders and translate ambiguous business needs into clean, maintainable engineering specifications.\n\nI am eager to bring this unique combination of analytical rigor, business intuition, and full-stack execution to this team.',
    tips: [
      'Acknowledge past experience as an asset rather than a distraction.',
      'Show how previous domain knowledge makes you a more empathetic engineer.',
    ],
  },
];

// -------------------------------------------------------------------
// 2. "TELL ME ABOUT YOURSELF" DEEP-DIVE GUIDES ACROSS ARCHETYPES
// -------------------------------------------------------------------
export const TELL_ME_ABOUT_YOURSELF_GUIDES: TellMeAboutYourselfGuide[] = [
  {
    id: 'tmay-fresher',
    archetype: 'student',
    label: 'College Graduate / Fresher',
    interviewerIntent:
      'The interviewer wants to assess your foundational discipline, your passion for learning, and whether you can articulate project experience beyond textbook definitions.',
    whatToInclude: [
      'Your university, degree, and core specialization',
      '1–2 practical projects with tech stack and your individual contributions',
      'Self-directed learning (courses, hackathons, open-source)',
      'Why you want to begin your career at this specific firm',
    ],
    whatToAvoid: [
      'Reciting your high school history or childhood hobbies',
      'Listing 20 programming languages without demonstrating depth',
      'Speaking vaguely about teamwork without concrete examples',
    ],
    recommendedStructure:
      'Current Academic Status → Core Technical Focus → Notable Project Highlight → Extracurricular/Initiative → Alignment with Position',
    modelAnswer:
      'I recently graduated with a degree in Computer Science from National Institute of Technology. Throughout my studies, I focused on web architectures and distributed data. For my senior capstone, my team built a secure peer-to-peer file sharing platform using React, Node.js, and WebRTC. My specific role was engineering the real-time signaling mechanism and designing the responsive dashboard. Beyond university coursework, I regularly participate in open-source hackathons and practice clean coding principles. I am eager to join your team as a junior engineer because of your strong engineering mentorship culture and modern cloud stack.',
    weakAnswerExample:
      'My name is Rahul. I was born in Mumbai. I did my schooling in St. Xavier’s and then I did B.Tech. I know Java, Python, C++, HTML, CSS, SQL, and Machine Learning. I like reading books and watching movies. I want a job in a good reputed company.',
    weaknessExplanation:
      'Too biographical, lists technologies like a grocery shopping list with zero evidence of application, and states generic desires rather than what value you bring.',
  },
  {
    id: 'tmay-technical-engineer',
    archetype: 'technical',
    label: 'Software / Technical Engineer',
    interviewerIntent:
      'Evaluates technical depth, problem-solving maturity, how you deal with architectural trade-offs, and communication clarity.',
    whatToInclude: [
      'Years of engineering experience and core domain focus',
      'High-scale technical challenges you solved (latency, reliability, clean code)',
      'Collaboration style with product managers and code reviewers',
      'What technical problems you want to tackle next',
    ],
    whatToAvoid: [
      'Getting bogged down in tiny syntax trivia instead of system impact',
      'Claiming full credit for work delivered by a large team',
      'Neglecting to mention tests, CI/CD, or deployment standards',
    ],
    recommendedStructure:
      'Engineering Focus → Flagship Architecture Win → Cross-Functional Leadership → Why This Tech Challenge',
    modelAnswer:
      'I am a full-stack engineer with four years of experience designing high-throughput web applications. In my current role at FinTechCore, I own the payments processing service that handles over 20,000 transactions daily. Last quarter, I spearheaded our migration from a legacy monolithic endpoint to a decoupled event-driven architecture using Kafka and Node.js microservices. This initiative reduced transaction timeout rates by 42% and allowed our partner integrations to scale seamlessly. I value rigorous automated testing, clear documentation, and peer code reviews. I am looking to bring my background in high-reliability distributed systems to your payments engineering squad.',
    weakAnswerExample:
      'I am an engineer. I write code in JavaScript and React. My manager assigns Jira tickets and I complete them on time. I fix bugs and deploy code. I want to work here because your office is close to my home.',
    weaknessExplanation:
      'Passive tone ("tickets assigned to me"), mentions zero technical challenges or metrics, and reveals personal convenience as the motivation.',
  },
];

// -------------------------------------------------------------------
// 3. TECHNICAL CONCEPTS 5-LEVEL EXPLANATIONS (Child → Principal Engineer)
// -------------------------------------------------------------------
export const TECHNICAL_CONCEPTS_LIBRARY: TechnicalConceptTopic[] = [
  {
    id: 'concept-api',
    conceptName: 'REST API',
    category: 'web',
    summary: 'Representational State Transfer Application Programming Interface for system interoperability.',
    levels: [
      {
        level: 1,
        levelName: 'Explain to a 7-Year-Old (Child)',
        keyAnalogy: 'A restaurant waiter taking an order to the kitchen',
        modelExplanation:
          'Imagine you are at a restaurant. You cannot walk directly into the hot kitchen to cook your own food. Instead, you tell the waiter what you want from the menu. The waiter walks to the kitchen, brings your food back to your table, and serves it. An API is like that polite waiter—it carries requests between your phone and giant computers far away!',
      },
      {
        level: 2,
        levelName: 'Explain to a Non-Technical Beginner',
        keyAnalogy: 'Standardized universal wall plug adapters',
        modelExplanation:
          'An API is a standardized bridge that lets two different software applications talk to each other without needing to know how the other was built. When you check the weather on your phone, the weather app does not measure atmospheric pressure itself; it uses an API to ask the National Weather Service for the temperature and displays the answer.',
      },
      {
        level: 3,
        levelName: 'Explain to a College Student',
        keyAnalogy: 'HTTP methods mapped to CRUD operations',
        modelExplanation:
          'A REST API is an architectural style for networked systems. It uses standard HTTP verbs—GET to read data, POST to create new records, PUT or PATCH to update, and DELETE to remove. Communication is stateless, meaning the server treats each request as independent without retaining client session state in server memory.',
      },
      {
        level: 4,
        levelName: 'Explain to a Technical Interviewer',
        keyAnalogy: 'Stateless resource-oriented contract',
        modelExplanation:
          'REST is a resource-oriented architectural paradigm operating over HTTP. Resources are identified by unambiguous URIs and represented via standardized formats like JSON. A compliant REST interface guarantees that GET, PUT, and DELETE operations are idempotent, while POST is not. It decouples client user-interface state from backend data persistence, optimizing horizontal scalability.',
      },
      {
        level: 5,
        levelName: 'Explain to a Principal / Staff Engineer',
        keyAnalogy: 'Distributed systems trade-offs: REST vs GraphQL vs gRPC',
        modelExplanation:
          'In production distributed architectures, REST provides cacheability via standard HTTP headers (ETags, Cache-Control) and broad CDN compatibility. However, in complex relational domain models, REST often suffers from over-fetching or N+1 network waterfall requests, leading teams to adopt GraphQL for client-driven aggregation or gRPC over HTTP/2 with Protocol Buffers for high-throughput, low-latency microservice-to-microservice RPCs.',
      },
    ],
  },
  {
    id: 'concept-db-index',
    conceptName: 'Database Indexing',
    category: 'database',
    summary: 'Data structures (typically B-Trees) that accelerate search queries at the cost of write overhead.',
    levels: [
      {
        level: 1,
        levelName: 'Explain to a 7-Year-Old (Child)',
        keyAnalogy: 'The alphabetical index at the back of a thick encyclopedia',
        modelExplanation:
          'If you have a giant book with 1,000 pages and you want to find "Dolphins", you do not turn every single page one by one from page 1. You flip directly to the back index, look under "D", see page 452, and jump straight there! That is what a database index does for computers.',
      },
      {
        level: 2,
        levelName: 'Explain to a Non-Technical Beginner',
        keyAnalogy: 'Organized library catalog drawers',
        modelExplanation:
          'Without an index, finding a customer record requires the database to perform a "full table scan"—reading millions of rows one by one. An index is an organized lookup table sorted in advance, allowing instantaneous search results even with hundreds of millions of users.',
      },
      {
        level: 3,
        levelName: 'Explain to a College Student',
        keyAnalogy: 'Self-balancing B-Tree search complexity: O(log N) vs O(N)',
        modelExplanation:
          'A database index is auxiliary metadata maintained on disk, typically structured as a balanced B-Tree or Hash Table. Instead of linear search time O(N), an index reduces search complexity to logarithmic time O(log N). However, every time you insert or update rows, the database must write to both the table and the index.',
      },
      {
        level: 4,
        levelName: 'Explain to a Technical Interviewer',
        keyAnalogy: 'Write amplification and memory trade-offs',
        modelExplanation:
          'Database indexes trade write throughput and storage footprint for read speed. We create clustered indexes for primary key lookup and non-clustered composite indexes for recurring multi-column WHERE and JOIN clauses. Crucially, we must avoid over-indexing because each additional index incurs write amplification on INSERTs and updates.',
      },
      {
        level: 5,
        levelName: 'Explain to a Principal / Staff Engineer',
        keyAnalogy: 'Covering indexes, selectivity, and query execution plans',
        modelExplanation:
          'When tuning queries at scale, we inspect EXPLAIN ANALYZE execution plans to verify index selectivity and avoid index skips. We design covering indexes using the INCLUDE clause to serve index-only scans, bypassing the heap table lookup entirely. In high-write append-only ingestion pipelines, we consider LSM-Trees or partial filtered indexes to mitigate B-Tree random-write page splits.',
      },
    ],
  },
];

// -------------------------------------------------------------------
// 4. PRODUCTION INTERVIEW QUESTIONS (HR, Behavioral STAR, Technical)
// -------------------------------------------------------------------
export const SAMPLE_INTERVIEW_QUESTIONS: InterviewQuestionItem[] = [
  {
    id: 'iq-hr-weakness',
    category: 'hr',
    question: 'What do you consider to be your greatest area for professional growth or weakness?',
    intentExplanation:
      'The interviewer is testing genuine self-awareness, emotional maturity, and whether you proactively implement strategies to overcome shortcomings.',
    idealFramework: 'Acknowledge Authentic Challenge → Concrete Mitigation Strategy → Observed Improvement',
    keyPointsToCover: [
      'Never say "I am a perfectionist" or "I work too hard" (sounds rehearsed and insincere)',
      'Choose a real skill (e.g. public speaking, delegating, saying no to extra tasks)',
      'Explain the actionable tools/habits you use to manage it',
    ],
    modelAnswer:
      'In the past, I occasionally struggled with saying "no" to incoming requests, which sometimes led to overcommitting and spreading myself thin across too many secondary tasks. To address this, I started using an explicit prioritization framework with my team lead. Every Monday, I categorize my deliverables into critical milestones and secondary requests. If a new urgent request arrives, I transparently discuss trade-offs with my manager before accepting. This habit has dramatically improved my turnaround time and reduced context switching.',
    sampleFollowUps: [
      'Can you give an example of a time you had to push back on a stakeholder?',
      'How do you handle receiving critical feedback from your manager?',
    ],
  },
  {
    id: 'iq-star-conflict',
    category: 'behavioral',
    question: 'Tell me about a time you experienced a disagreement with a team member. How was it resolved?',
    intentExplanation:
      'Evaluates conflict diplomacy, emotional intelligence, active listening, and whether you prioritize company outcomes over personal ego.',
    idealFramework: 'STAR: Situation → Task → Action → Result',
    keyPointsToCover: [
      'Focus on professional disagreements about architecture or priorities, not personal clashes',
      'Explain how you listened to their perspective with an open mind',
      'Describe how you used objective data or prototyping to reach a consensus',
    ],
    modelAnswer:
      'During our mobile checkout redesign, a senior frontend colleague and I disagreed on whether to use client-side caching for user cart data. He favored aggressive local caching for speed, while I was concerned about stale inventory sync when multiple flash sales occurred simultaneously.\n\nMy responsibility was ensuring data integrity without degrading the user experience. Instead of debating in abstract meetings, I proposed building a quick benchmark prototype to measure synchronization error rates under simulated network latency.\n\nThe prototype revealed that a hybrid approach worked best: caching static product metadata locally while validating live inventory via a lightweight 50ms webhook. We presented the hybrid design together to the team, deployed on schedule, and achieved zero overselling incidents during Black Friday.',
    sampleFollowUps: [
      'What would you have done if the team lead overruled your benchmark results?',
      'How do you maintain positive rapport with colleagues after intense technical debates?',
    ],
  },
  {
    id: 'iq-tech-debugging',
    category: 'technical',
    question: 'Describe a difficult software bug or system failure you investigated. How did you diagnose and solve it?',
    intentExplanation:
      'Tests methodical diagnostic thinking, telemetry usage, calmness under production pressure, and post-incident prevention.',
    idealFramework: 'Symptom & Impact → Hypotheses & Isolation → Root Cause Discovery → Fix & Prevention',
    keyPointsToCover: [
      'Do not say "I just guessed until it worked"',
      'Describe telemetry tools (logs, metrics, profilers, APM traces)',
      'Explain the permanent systemic fix to prevent recurrence',
    ],
    modelAnswer:
      'We experienced an intermittent production incident where our background notification worker stalled every Tuesday at midnight. The service did not crash, but memory usage steadily climbed to 100%, causing task queues to back up.\n\nI began by inspecting Grafana dashboards and Datadog APM traces. I isolated the spike to a scheduled batch report that processed inactive customer accounts. By reproducing the script in our staging sandbox with database heap profilers, I discovered an unindexed database query combined with an unclosed file stream in a retry loop.\n\nI resolved the issue by rewriting the batch script to stream records in chunks of 500 rows and ensuring the file streams were cleanly closed inside a finally block. Furthermore, I added an alert threshold for memory leaks and integrated automated load tests in our CI pipeline.',
    sampleFollowUps: [
      'How did you communicate the outage timeline to customer support during the incident?',
      'What post-mortem documentation did you create for the engineering team?',
    ],
  },
];

// -------------------------------------------------------------------
// 5. GROUP DISCUSSION ARENA SCENARIOS
// -------------------------------------------------------------------
export const SAMPLE_GD_SCENARIOS: GroupDiscussionScenario[] = [
  {
    id: 'gd-remote-work',
    topicTitle: 'Remote Work vs Return to Office: Productivity, Culture, and Innovation',
    category: 'workplace',
    starterPrompt:
      'Global organizations are divided: some mandate full in-office returns for spontaneous collaboration, while others champion fully distributed teams. What is the optimal balance for modern knowledge workers?',
    participantCount: 4,
    aiPeers: [
      {
        name: 'Sarah (Pro-In-Office)',
        stance: 'pro',
        openingStatement:
          'In my experience, spontaneous hallway conversations and whiteboarding in person spark creative breakthroughs that video meetings simply cannot replicate.',
      },
      {
        name: 'Carlos (Pro-Remote)',
        stance: 'con',
        openingStatement:
          'While in-person brainstorming has merits, eliminating commute fatigue and enabling uninterrupted focus time substantially increases deep engineering output.',
      },
    ],
    usefulPhrases: [
      { intent: 'agree', phrase: 'I completely agree with Carlos regarding the value of uninterrupted focus time.' },
      { intent: 'disagree', phrase: 'I see Sarah’s perspective, but we must also consider the commute burden on employee retention.' },
      { intent: 'interrupt_politely', phrase: 'Could I briefly add a point on how asynchronous documentation bridges this gap?' },
      { intent: 'summarize', phrase: 'To synthesize both viewpoints, it seems a structured hybrid model balances deep work with team alignment.' },
    ],
  },
];

// -------------------------------------------------------------------
// 6. PROFESSIONAL PHRASE BANK (Curated Workplace Formulae)
// -------------------------------------------------------------------
export const CAREER_PHRASES_MASTER: ProfessionalPhraseItem[] = [
  {
    id: 'phr-1',
    category: 'meetings',
    phrase: 'Could we circle back to this point once we have validated the metrics?',
    meaning: 'Postpone discussing a secondary topic until factual data is available.',
    formality: 'professional',
    contextUsage: 'Used during team standups or executive presentations when an unexpected debate derails the agenda.',
    casualAlternative: 'Let us talk about this later.',
    exampleSentence: 'That is a valid question, Priya. Could we circle back to this point once we have validated the user engagement metrics?',
    audioText: 'Could we circle back to this point once we have validated the metrics?',
  },
  {
    id: 'phr-2',
    category: 'disagreement',
    phrase: 'I see where you are coming from, though I have a slight reservation regarding the delivery timeline.',
    meaning: 'Polite, diplomatic disagreement that validates the colleague before introducing a constraint.',
    formality: 'executive',
    contextUsage: 'Workplace meetings with senior managers or engineering leads.',
    casualAlternative: 'I disagree with your timeline.',
    exampleSentence: 'I see where you are coming from, though I have a slight reservation regarding our testing bandwidth before next Friday.',
    audioText: 'I see where you are coming from, though I have a slight reservation regarding the delivery timeline.',
  },
  {
    id: 'phr-3',
    category: 'clarification',
    phrase: 'Just to ensure we are aligned, are you suggesting we prioritize the payment API over the profile page?',
    meaning: 'Confirms understanding of complex or ambiguous instructions.',
    formality: 'professional',
    contextUsage: 'Client calls and sprint planning sessions.',
    casualAlternative: 'What do you mean?',
    exampleSentence: 'Just to ensure we are aligned, are you suggesting we prioritize the payment API over the profile page for Sprint 14?',
    audioText: 'Just to ensure we are aligned, are you suggesting we prioritize the payment API over the profile page?',
  },
  {
    id: 'phr-4',
    category: 'emails',
    phrase: 'Please find attached the revised deployment plan for your review and feedback.',
    meaning: 'Standard professional email opening when sharing documents.',
    formality: 'professional',
    contextUsage: 'Official email correspondence with clients and managers.',
    casualAlternative: 'Here is the file.',
    exampleSentence: 'Dear Team, please find attached the revised deployment plan for your review and feedback by tomorrow afternoon.',
    audioText: 'Please find attached the revised deployment plan for your review and feedback.',
  },
  {
    id: 'phr-5',
    category: 'interviews',
    phrase: 'Could you tell me a little about the team dynamics and how cross-functional decisions are made here?',
    meaning: 'Thoughtful question for the candidate to ask the interviewer at the end of a session.',
    formality: 'executive',
    contextUsage: 'Closing minutes of HR or managerial interviews.',
    casualAlternative: 'How does your team work?',
    exampleSentence: 'Thank you for explaining the roadmap. Could you tell me a little about the team dynamics and how cross-functional decisions are made here?',
    audioText: 'Could you tell me a little about the team dynamics and how cross-functional decisions are made here?',
  },
];
