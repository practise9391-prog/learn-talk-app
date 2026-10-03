// Part 20: Career Intelligence Production Dataset
import {
  CareerGoalProfile,
  RoleRequirementMap,
  CareerRoadmapStage,
  JobDescriptionAnalysis,
  RecruiterSimulationCase,
  NetworkingSimulationCase,
  ApplicationTrackerItem,
  CareerTransferChallenge,
} from '../types/careerIntelligence';

export const DEFAULT_CAREER_GOAL_PROFILE: CareerGoalProfile = {
  targetRole: 'software_developer',
  customRoleTitle: 'Full Stack Software Engineer',
  industry: 'Fintech & Cloud Platforms',
  experienceLevel: 'mid_3_5_years',
  educationLevel: 'Bachelor of Computer Science',
  targetCompanyType: 'tech_product_company',
  targetCountry: 'United States / Remote Global',
  communicationGoal: 'Speak confidently in technical design reviews, recruiter screens, and executive interviews.',
  prioritySkills: ['Technical Explanation', 'Behavioral STAR Answers', 'Recruiter Negotiation', 'System Architecture'],
  lastUpdated: new Date().toISOString(),
};

export const ROLE_REQUIREMENT_MAPS: Record<string, RoleRequirementMap> = {
  software_developer: {
    role: 'software_developer',
    title: 'Software Developer / Engineer',
    communicationRequirements: [
      { skillName: 'Technical Architecture Explanation', importance: 'essential', benchmarkScore: 85, description: 'Explain distributed systems, state management, and trade-offs clearly.' },
      { skillName: 'Behavioral STAR Storytelling', importance: 'essential', benchmarkScore: 80, description: 'Narrate past engineering obstacles, conflicts, and resolutions concisely.' },
      { skillName: 'Recruiter Screening & Salary Comms', importance: 'high', benchmarkScore: 78, description: 'State timeline availability, compensation expectations, and motivation politely.' },
      { skillName: 'Daily Standup & Blocker Escalation', importance: 'essential', benchmarkScore: 85, description: 'Deliver crisp 60-second status reports without rambling.' },
      { skillName: 'Code Review & Constructive Feedback', importance: 'high', benchmarkScore: 82, description: 'Critique architectural PRs without accusatory language.' },
    ],
    careerRequirements: [
      { milestoneName: 'High-Impact Resume Bullets', deliverableType: 'resume', description: 'Action-verb-driven statements highlighting quantified scale and speed improvements.' },
      { milestoneName: 'Technical Project Deep Dive', deliverableType: 'interview', description: 'Problem -> Solution -> Tech Stack -> Your Role -> Challenges -> Outcome.' },
      { milestoneName: 'Recruiter Screening Call Mastery', deliverableType: 'recruiter_call', description: 'Professional introduction, visa status, and compensation alignment.' },
      { milestoneName: 'Post-Interview Thank You & Follow-up', deliverableType: 'workplace', description: 'Polite 24-hour follow-up referencing specific discussion points.' },
    ],
    typicalInterviewQuestions: [
      'Tell me about a complex technical challenge you diagnosed in production.',
      'How do you evaluate trade-offs when choosing between SQL and NoSQL databases?',
      'Describe a time you disagreed with a product manager on an engineering deadline.',
    ],
  },
  product_manager: {
    role: 'product_manager',
    title: 'Product Manager',
    communicationRequirements: [
      { skillName: 'Executive BLUF Briefings', importance: 'essential', benchmarkScore: 88, description: 'Bottom-line-up-front communication with clear ROI and strategic trade-offs.' },
      { skillName: 'Cross-Functional Stakeholder Alignment', importance: 'essential', benchmarkScore: 86, description: 'Facilitating consensus across conflicting engineering and business roadmaps.' },
      { skillName: 'Customer Empathy & Interviewing', importance: 'high', benchmarkScore: 85, description: 'Eliciting actionable feedback without asking leading questions.' },
    ],
    careerRequirements: [
      { milestoneName: 'Product Vision Portfolio', deliverableType: 'presentation', description: 'Market problem analysis, user personas, and phased feature launch plans.' },
      { milestoneName: 'Behavioral Conflict Resolution', deliverableType: 'interview', description: 'Managing tight deadlines, feature cuts, and engineering pushback.' },
    ],
    typicalInterviewQuestions: [
      'How do you prioritize competing requests from enterprise customers vs core platform health?',
      'Tell me about a product feature that failed post-launch and what you learned.',
    ],
  },
};

export const CAREER_ROADMAP_STAGES: CareerRoadmapStage[] = [
  {
    stageNumber: 1,
    id: 'stage_self_intro',
    title: '1. Professional Self-Introduction',
    category: 'foundation',
    status: 'completed',
    description: 'Master your 60-second interview opener and 15-second elevator pitch tailored to your target role.',
    actionLabel: 'Practice Self-Introduction',
    prerequisites: [],
  },
  {
    stageNumber: 2,
    id: 'stage_resume_bullets',
    title: '2. Resume English & Bullet Training',
    category: 'foundation',
    status: 'completed',
    description: 'Transform weak duty descriptions into metric-ready accomplishment statements with power verbs.',
    actionLabel: 'Refine Resume Bullets',
    prerequisites: ['stage_self_intro'],
  },
  {
    stageNumber: 3,
    id: 'stage_job_description',
    title: '3. Job Description Analysis & Matching',
    category: 'application',
    status: 'in_progress',
    description: 'Extract critical keywords, responsibilities, and generate interview questions directly from job postings.',
    actionLabel: 'Analyze Job Posting',
    prerequisites: ['stage_resume_bullets'],
  },
  {
    stageNumber: 4,
    id: 'stage_cover_letter',
    title: '4. Cover Letter & Application Messaging',
    category: 'application',
    status: 'in_progress',
    description: 'Craft concise, high-conversion application notes that hook hiring managers in under 150 words.',
    actionLabel: 'Draft Application Note',
    prerequisites: ['stage_job_description'],
  },
  {
    stageNumber: 5,
    id: 'stage_recruiter_comms',
    title: '5. Recruiter Screening & Scheduling',
    category: 'recruiter',
    status: 'in_progress',
    description: 'Simulate recruiter screening calls, salary inquiries, notice period questions, and reschedule requests.',
    actionLabel: 'Practice Recruiter Call',
    prerequisites: ['stage_cover_letter'],
  },
  {
    stageNumber: 6,
    id: 'stage_networking',
    title: '6. Professional Networking & LinkedIn',
    category: 'recruiter',
    status: 'in_progress',
    description: 'Engage alumni, recruiters, and peers via coffee chat requests, event openers, and connection notes.',
    actionLabel: 'Practice Networking',
    prerequisites: ['stage_recruiter_comms'],
  },
  {
    stageNumber: 7,
    id: 'stage_behavioral_star',
    title: '7. Behavioral Interview Framework (STAR)',
    category: 'interview',
    status: 'in_progress',
    description: 'Structure challenges, conflicts, and failures using Situation -> Task -> Action -> Result.',
    actionLabel: 'Practice Behavioral Questions',
    prerequisites: ['stage_networking'],
  },
  {
    stageNumber: 8,
    id: 'stage_tech_explanation',
    title: '8. Technical Project Explanation',
    category: 'interview',
    status: 'in_progress',
    description: 'Explain system architecture, technical choices, and trade-offs at multiple levels of abstraction.',
    actionLabel: 'Deep Dive Project',
    prerequisites: ['stage_behavioral_star'],
  },
  {
    stageNumber: 9,
    id: 'stage_pressure_recovery',
    title: '9. Interview Pressure & Interruption Recovery',
    category: 'interview',
    status: 'locked',
    description: 'Handle polite interruptions, unexpected follow-ups, and master "I Don’t Know" uncertainty gracefully.',
    actionLabel: 'Launch Pressure Drill',
    prerequisites: ['stage_tech_explanation'],
  },
  {
    stageNumber: 10,
    id: 'stage_post_interview',
    title: '10. Post-Interview Follow-Up & Negotiation',
    category: 'interview',
    status: 'locked',
    description: 'Send high-signal 24-hour thank you notes, check on decision timelines, and negotiate offers respectfully.',
    actionLabel: 'Draft Follow-Up & Negotiation',
    prerequisites: ['stage_pressure_recovery'],
  },
  {
    stageNumber: 11,
    id: 'stage_workplace_onboarding',
    title: '11. Workplace Onboarding & First 30 Days',
    category: 'workplace',
    status: 'locked',
    description: 'Introduce yourself to team members, ask clarifying questions, and participate in daily standups.',
    actionLabel: 'Launch Onboarding Lab',
    prerequisites: ['stage_post_interview'],
  },
  {
    stageNumber: 12,
    id: 'stage_transfer_mastery',
    title: '12. Continuous Mastery & Transfer Challenges',
    category: 'workplace',
    status: 'locked',
    description: 'Demonstrate communication agility by explaining the same technical topic across 4 distinct audiences.',
    actionLabel: 'Start Transfer Challenge',
    prerequisites: ['stage_workplace_onboarding'],
  },
];

export const SAMPLE_JOB_DESCRIPTIONS: JobDescriptionAnalysis[] = [
  {
    id: 'jd_fintech_fullstack',
    title: 'Senior Full Stack Software Engineer',
    companyName: 'NovaPay Financial Technologies',
    rawText: `About the Role:
We are looking for a Senior Full Stack Software Engineer to build scalable payment processing ledgers and merchant dashboards. You will collaborate with cross-functional teams including product managers, compliance officers, and site reliability engineers.

Key Responsibilities:
- Design, develop, and maintain high-throughput RESTful and GraphQL APIs in Node.js and TypeScript.
- Architect real-time transaction processing pipelines handling over 5,000 requests per second.
- Collaborate with frontend engineers to build accessible, responsive user interfaces in React.
- Participate in agile sprint rituals, peer code reviews, and provide constructive technical mentoring.
- Drive root cause analysis during production incidents and implement automated safeguards.

Required Skills:
- 4+ years of professional software engineering experience.
- Proficiency in TypeScript, Node.js, and modern frontend frameworks (React).
- Strong understanding of database indexing, SQL optimization, and caching strategies (Redis).
- Proven ability to communicate technical trade-offs clearly to both engineering peers and business stakeholders.

Preferred Qualifications:
- Experience in fintech, payment gateways, or regulatory compliance (PCI-DSS, SOC-2).
- Familiarity with Kubernetes, Docker, and AWS cloud infrastructure.`,
    extractedRole: 'Senior Full Stack Software Engineer',
    keyResponsibilities: [
      'Design and maintain high-throughput payment processing APIs in TypeScript and Node.js.',
      'Architect real-time transaction processing pipelines handling 5,000+ requests/sec.',
      'Collaborate across cross-functional teams including product managers and compliance officers.',
      'Participate in agile sprint ceremonies, peer code reviews, and technical mentoring.',
      'Conduct root cause analysis during production incidents and deploy safeguards.',
    ],
    requiredSkills: [
      '4+ years full stack engineering experience',
      'Proficiency in TypeScript, Node.js, and React',
      'Database indexing & caching optimization (Redis/SQL)',
      'Clear communication of technical trade-offs to business stakeholders',
    ],
    preferredQualifications: [
      'Fintech payment gateway experience (PCI-DSS / SOC-2)',
      'Kubernetes & AWS cloud infrastructure',
    ],
    repeatedVocabulary: [
      { word: 'Cross-functional', meaning: 'Involving people or departments from different areas of an organization.', contextSentence: 'Collaborate with cross-functional teams including product and compliance.' },
      { word: 'High-throughput', meaning: 'Capable of handling a large volume of data or requests in a given time period.', contextSentence: 'Architect high-throughput transaction pipelines handling 5,000+ req/sec.' },
      { word: 'Trade-offs', meaning: 'Situations involving a compromise between two conflicting features or design choices.', contextSentence: 'Communicate technical trade-offs clearly to non-engineering stakeholders.' },
      { word: 'Root Cause Analysis', meaning: 'A structured method of problem-solving used for identifying the fundamental cause of faults.', contextSentence: 'Drive root cause analysis during production incidents.' },
    ],
    interviewQuestions: [
      'How have you architected an API or backend service to handle high-throughput traffic spikes?',
      'Describe a time you collaborated with a non-technical stakeholder to clarify ambiguous business requirements.',
      'Walk me through a production incident you diagnosed. What was your root cause analysis and mitigation?',
    ],
    suggestedActionVerbs: ['Architected', 'Engineered', 'Optimized', 'Collaborated', 'Diagnosed', 'Implemented'],
  },
];

export const RECRUITER_SIMULATION_CASES: RecruiterSimulationCase[] = [
  {
    id: 'rec_screening_salary',
    recruiterName: 'Sarah Lin',
    recruiterCompany: 'Stripe Recruitment Lead',
    scenarioType: 'salary_expectations',
    title: 'Recruiter Screening: Salary Expectations & Timeline',
    contextPrompt:
      'Sarah Lin is conducting a 15-minute introductory screen. She is enthusiastic about your resume and asks what your compensation expectations and target timeline look like.',
    recruiterOpeningMessage:
      'Thanks for speaking with me today! Your full-stack experience aligns nicely with our platform team. Before we schedule the technical screen with the hiring manager, could you share your target salary expectations and what your current availability or notice period looks like?',
    guidingTips: [
      'Anchor on value and flexibility rather than throwing out a rigid single number.',
      'Inquire about their budgeted compensation range for the role level.',
      'State your notice period cleanly (e.g. "I can start within two weeks of receiving an offer").',
    ],
    modelResponse:
      'Thanks for bringing that up, Sarah. Based on my research on the market rate for Senior Full Stack roles in this space and the impact I look forward to delivering, I am targeting a base range around $140,000 to $155,000, but I am open to discussing the full total compensation package including equity and benefits. What is the typical budgeted range Stripe has set aside for this level? As for availability, I can comfortably transition within two to three weeks of receiving a formal offer.',
    keyEvaluationCriteria: ['Polite tone', 'Range rather than rigid ultimatum', 'Asked about company budget', 'Clear notice timeline'],
  },
  {
    id: 'rec_reschedule_request',
    recruiterName: 'David Miller',
    recruiterCompany: 'CloudScale Talent Partner',
    scenarioType: 'reschedule_request',
    title: 'Interview Rescheduling: Professional Courtesy',
    contextPrompt:
      'You have an interview scheduled for Thursday at 2:00 PM, but your current company scheduled an emergency all-hands customer triage at the exact same hour. You need to write/speak to David to reschedule respectfully.',
    recruiterOpeningMessage:
      'Hi there, just confirming our upcoming technical architecture interview this Thursday at 2:00 PM EST with Principal Engineer Elena.',
    guidingTips: [
      'Apologize sincerely for the short notice.',
      'State the unavoidable reason briefly without oversharing company drama.',
      'Offer 2-3 specific alternate time slots to make rescheduling effortless for them.',
    ],
    modelResponse:
      'Hi David, thank you for confirming. I sincerely apologize, but an urgent, unavoidable production commitment has arisen at my current company on Thursday at 2:00 PM. I am very enthusiastic about this conversation with Elena and want to ensure I have full focus for our discussion. Would it be possible to reschedule for Thursday anytime after 4:30 PM EST, or Friday between 10:00 AM and 2:00 PM EST? Thank you so much for your understanding and flexibility.',
    keyEvaluationCriteria: ['Timely apology', 'Professional business reason', 'Provided specific alternate slots', 'Reaffirmed enthusiasm'],
  },
];

export const NETWORKING_CASES: NetworkingSimulationCase[] = [
  {
    id: 'net_conference_opener',
    title: 'Tech Conference: In-Person Coffee Break Opener',
    contextType: 'conference',
    persona: { name: 'Alex Rivera', title: 'VP of Engineering', organization: 'Apex Health Systems' },
    situationPrompt:
      'You just watched Alex deliver a keynote presentation on distributed microservice security at AWS re:Invent. You meet him by the coffee station during the afternoon break.',
    modelMessage:
      'Hi Alex, excuse me—I really enjoyed your keynote on distributed ledger consistency this morning. Your point about using idempotency keys to prevent race conditions during network partitions really resonated with an issue my team recently tackled. I am curious: how did your team convince compliance to adopt Raft consensus over traditional relational locks?',
    recommendedStructure: [
      '1. Friendly greeting and context (reference their specific talk/work)',
      '2. Mention a specific point of shared technical resonance',
      '3. Ask an open-ended, insightful question that invites natural conversation',
    ],
  },
  {
    id: 'net_alumni_linkedin',
    title: 'LinkedIn Alumni Outreach: 15-Minute Informational Chat',
    contextType: 'alumni_outreach',
    persona: { name: 'Priya Sharma', title: 'Staff Software Engineer', organization: 'Google' },
    situationPrompt:
      'Priya graduated from your university 4 years ago and currently works on Google Cloud. You want to request a brief 15-minute informational chat about engineering culture.',
    modelMessage:
      'Hi Priya,\n\nI hope you are having a wonderful week! I noticed you are an alumnus of State University and currently an engineer on the Cloud team at Google. As a fellow alum preparing to transition into cloud systems engineering, I have really admired the technical work your team is publishing on distributed telemetry.\n\nIf your schedule permits, would you be open to a brief 15-minute virtual coffee chat in the next couple of weeks? I would love to hear your advice on navigating the shift from full-stack applications to large-scale infrastructure. No expectations whatsoever regarding job openings—just eager to learn from your career path.\n\nThank you so much for your time,\nYour Name',
    recommendedStructure: [
      '1. Shared alumni connection',
      '2. Compliment specific work / credibility',
      '3. Clear, low-pressure ask (15-min chat)',
      '4. Explicit statement of no immediate transactional expectation',
    ],
  },
];

export const CAREER_TRANSFER_CHALLENGES: CareerTransferChallenge[] = [
  {
    id: 'challenge_redis_cache',
    topicTitle: 'Distributed In-Memory Caching (Redis)',
    coreConcept:
      'Using an in-memory key-value store to cache expensive database queries and sub-second session state, with a TTL expiration policy.',
    audiences: [
      {
        targetAudience: 'technical_interviewer',
        audienceLabel: 'Senior Technical Interviewer',
        focusNeed: 'Data structures, eviction policies (LRU), cache invalidation, and thundering herd mitigation.',
        modelExplanation:
          'We implemented Redis as an in-memory read-through cache positioned in front of our PostgreSQL cluster. By caching query responses with a 15-minute sliding TTL and employing an LRU eviction strategy, we reduced database query read contention by 65% and lowered p99 API latency from 420ms to 28ms. To prevent cache stampede during high-traffic cache misses, we implemented probabilistic early expiration with distributed mutex locks.',
      },
      {
        targetAudience: 'business_manager',
        audienceLabel: 'Business / Product Manager',
        focusNeed: 'Customer page load speed, checkout conversion, and AWS server cost reduction.',
        modelExplanation:
          'By introducing an in-memory caching layer, we cut our checkout loading time from over four seconds down to a fraction of a second. This directly improved our user checkout completion rate by 8% and allowed us to scale through Black Friday peak traffic without needing to purchase costly additional database instances.',
      },
      {
        targetAudience: 'enterprise_client',
        audienceLabel: 'Enterprise Customer',
        focusNeed: 'High availability, reliability during sales surges, and zero stale balance data.',
        modelExplanation:
          'Our platform utilizes high-speed memory caching to ensure your inventory dashboards load instantly even during major flash sales. We also built instant invalidation safeguards, meaning that as soon as an item is purchased, all cached inventory counts update immediately with zero stale numbers.',
      },
      {
        targetAudience: 'junior_mentee',
        audienceLabel: 'Junior Developer Mentee',
        focusNeed: 'Conceptual intuition, why databases get slow, and how memory compares to disk storage.',
        modelExplanation:
          'Think of Redis like keeping the most frequently used textbooks directly on your desk instead of walking to the university basement library every time someone asks you a question. Memory is thousands of times faster than reading from a hard drive. We set an expiration timer on each item so the desk never gets cluttered with old, outdated notes.',
      },
    ],
  },
];

export const DEFAULT_APPLICATION_TRACKER_ITEMS: ApplicationTrackerItem[] = [
  {
    id: 'app_stripe',
    companyName: 'Stripe',
    jobTitle: 'Senior Backend Engineer',
    location: 'Remote / US',
    status: 'interview_scheduled',
    dateAdded: '2026-09-28',
    lastUpdated: '2026-10-02',
    interviewDate: 'Thursday, Oct 8 at 2:00 PM',
    linkedPracticeAction: {
      label: 'Prepare Technical Architecture Interview',
      actionType: 'interview',
    },
  },
  {
    id: 'app_datadog',
    companyName: 'Datadog',
    jobTitle: 'Full Stack Engineer (APM)',
    location: 'Boston, MA / Hybrid',
    status: 'recruiter_contact',
    dateAdded: '2026-10-01',
    lastUpdated: '2026-10-02',
    linkedPracticeAction: {
      label: 'Simulate Recruiter Screening Call',
      actionType: 'recruiter',
    },
  },
  {
    id: 'app_vercel',
    companyName: 'Vercel',
    jobTitle: 'Frontend Infrastructure Lead',
    location: 'Remote Global',
    status: 'applied',
    dateAdded: '2026-09-25',
    lastUpdated: '2026-09-29',
    linkedPracticeAction: {
      label: 'Draft Post-Application Follow-Up',
      actionType: 'follow_up',
    },
  },
];
