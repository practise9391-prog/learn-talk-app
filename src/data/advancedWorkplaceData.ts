// Part 18: Advanced Workplace, Business, Leadership & Professional Communication Datasets
import {
  WorkplaceRoadmapLevel,
  AudienceAwareScenario,
  ManagerScenario,
  ConflictScenario,
  FeedbackTrainingCase,
  ExecutiveBriefingCase,
  ClientCommunicationCase,
  TechBusinessTranslationCase,
  NegotiationSimulationCase,
  MeetingFacilitationCase,
  ThinkOnYourFeetDrill,
} from '../types/workplace';

// -------------------------------------------------------------------
// 1. 7-LEVEL ADVANCED CAREER ROADMAP
// -------------------------------------------------------------------
export const WORKPLACE_ROADMAP_LEVELS: WorkplaceRoadmapLevel[] = [
  {
    level: 1,
    title: 'Workplace Communication',
    focusArea: 'Daily standups, blocker escalations, peer collaboration & code reviews',
    consequences: 'Team velocity, peer trust, daily task clarity',
    audienceScope: 'Immediate teammates & direct colleagues',
    ambiguityLevel: 'low',
    timePressure: 'flexible',
    coreSkills: ['Clear blocker articulation', 'Status updates', 'Polite requests', 'Active listening'],
  },
  {
    level: 2,
    title: 'Professional Communication',
    focusArea: 'Formal cross-team emails, Slack etiquette, documentation & sprint reviews',
    consequences: 'Inter-departmental alignment, accountability, ticket hygiene',
    audienceScope: 'Adjacent teams, QA, Design, and Engineering managers',
    ambiguityLevel: 'low',
    timePressure: 'moderate',
    coreSkills: ['Async precision', 'Constructive pushback', 'Meeting summaries', 'Boundary setting'],
  },
  {
    level: 3,
    title: 'Business Communication',
    focusArea: 'Cost-benefit reasoning, business proposals, product tradeoff justifications',
    consequences: 'Resource allocation, project greenlights, operational expenditure',
    audienceScope: 'Product managers, Finance liaisons, and Operations directors',
    ambiguityLevel: 'moderate',
    timePressure: 'moderate',
    coreSkills: ['Value articulation', 'Data storytelling', 'Tradeoff frameworks', 'Proposal pitching'],
  },
  {
    level: 4,
    title: 'Client & Stakeholder Communication',
    focusArea: 'Requirement discovery, client demos, scope protection & managing tough questions',
    consequences: 'Client retention, commercial contracts, account relationships',
    audienceScope: 'Enterprise clients, external partners, customer advisory boards',
    ambiguityLevel: 'moderate',
    timePressure: 'high',
    coreSkills: ['Expectation calibration', 'Defusing dissatisfaction', 'Socratic questioning', 'Non-defensive empathy'],
  },
  {
    level: 5,
    title: 'Leadership Communication',
    focusArea: 'Vision casting, delegation without micromanagement, delivering critical feedback',
    consequences: 'Talent retention, psychological safety, team morale and culture',
    audienceScope: 'Direct reports, junior mentees, cross-functional leads',
    ambiguityLevel: 'high',
    timePressure: 'moderate',
    coreSkills: ['Actionable feedback', 'Contextual delegation', 'Conflict arbitration', 'Empathetic coaching'],
  },
  {
    level: 6,
    title: 'Executive Communication',
    focusArea: '30-second decision briefings, enterprise risk analysis, high-stakes trade-offs',
    consequences: 'Company strategy, capital expenditure, board confidence',
    audienceScope: 'VPs, C-Suite (CTO, CEO, CFO), Board members',
    ambiguityLevel: 'high',
    timePressure: 'immediate',
    coreSkills: ['Extreme brevity', 'Bottom-line-first (BLUF)', 'Decision forcing', 'Risk mitigation framing'],
  },
  {
    level: 7,
    title: 'Strategic Communication',
    focusArea: 'Crisis PR management, organizational transformations, multi-party diplomacy',
    consequences: 'Public reputation, company survival, global market positioning',
    audienceScope: 'Whole company, industry press, regulatory authorities, shareholders',
    ambiguityLevel: 'strategic',
    timePressure: 'immediate',
    coreSkills: ['Public composure', 'Diplomatic ambiguity & precision', 'Consensus rallying', 'Crisis leadership'],
  },
];

// -------------------------------------------------------------------
// 2. AUDIENCE-AWARE COMMUNICATION ("Say It to Different People")
// -------------------------------------------------------------------
export const AUDIENCE_AWARE_SCENARIOS: AudienceAwareScenario[] = [
  {
    id: 'sc-db-delay',
    situationTitle: 'Critical Database Migration Delayed by 3 Days',
    situationContext:
      'The scheduled PostgreSQL 16 migration hit an unexpected schema locking issue during load testing, which will push the production deployment past the promised Friday release date to Monday morning.',
    coreFacts: [
      'Root cause: Foreign key table lock duration exceeded safety thresholds on 10M+ rows.',
      'Safety measure: Aborted dry-run migration to avoid production downtime.',
      'Time required: 48 hours to partition tables and re-index before re-running.',
      'New release target: Monday 06:00 UTC.',
    ],
    audienceProfiles: {
      teammate: {
        roleTitle: 'Fellow Backend Developer',
        priorityFocus: 'Technical mechanics, shared workload, and debugging scripts',
        toneRecommendation: 'Direct, collaborative, pragmatic, peer-to-peer',
        modelPhrasing:
          'Hey folks, the dry-run locked the accounts table for 12 seconds because of unindexed foreign keys. I aborted to prevent production drops. I am partitioning the table tonight—could someone review my indexing PR before we re-test tomorrow?',
        keyPitfall: 'Do not be overly formal or hide the technical blocking issue.',
      },
      manager: {
        roleTitle: 'Engineering Manager',
        priorityFocus: 'Risk mitigation, revised timeline, and required approvals',
        toneRecommendation: 'Structured, proactive, transparent, solution-focused',
        modelPhrasing:
          'Quick update on the database migration: we encountered an unexpected lock threshold during load testing. To eliminate any downtime risk, we postponed execution to Monday at 06:00 UTC. The technical remedy is partitioning the tables today, with staging tests tomorrow. No customer data was impacted.',
        keyPitfall: 'Do not report delays without immediately providing the mitigation plan.',
      },
      customer: {
        roleTitle: 'Client Account Manager / End Users',
        priorityFocus: 'Service reliability, zero business disruption, and reassurance',
        toneRecommendation: 'Reassuring, professional, jargon-free, outcome-focused',
        modelPhrasing:
          'To ensure absolute data integrity and zero disruption during your peak weekend trading, we have rescheduled our backend platform enhancement to Monday early morning during our standard low-traffic maintenance window. All platform services will continue operating normally throughout the weekend.',
        keyPitfall: 'Never use alarming engineering jargon like "table locking" or "aborted crash".',
      },
      executive: {
        roleTitle: 'VP of Engineering / Chief Technology Officer',
        priorityFocus: 'Bottom-line business impact, risk containment, and SLA safety',
        toneRecommendation: 'Concise, high-level, decisive, ownership-driven',
        modelPhrasing:
          'BLUF: PostgreSQL migration shifted from Friday to Monday 06:00 UTC to prevent SLA risk identified during staging load tests. Zero client impact, zero data risk. Corrective schema partitioning is underway, and all SLA commitments remain fully green.',
        keyPitfall: 'Do not explain line-by-line debugging details; state the business bottom line.',
      },
      technical_expert: {
        roleTitle: 'Principal Database Architect',
        priorityFocus: 'I/O throughput, lock contention, isolation levels, and rollback plans',
        toneRecommendation: 'Technically precise, architectural, tradeoff-centered',
        modelPhrasing:
          'The ALTER TABLE ADD CONSTRAINT triggered an ACCESS EXCLUSIVE lock on the 14M row ledger table, spiking latency past our 500ms circuit breaker. We are rewriting the migration into concurrent ADD CONSTRAINT NOT VALID followed by background VALIDATE CONSTRAINT to eliminate the blocking lock.',
        keyPitfall: 'Do not speak in vague generalities like "there was a bug"; specify the lock type.',
      },
    },
  },
  {
    id: 'sc-auth-vulnerability',
    situationTitle: 'Zero-Day Vulnerability Patched in Authentication Service',
    situationContext:
      'A third-party JWT validation library had an algorithmic downgrade flaw discovered. The team applied a patched version and rotated signing keys with zero customer breach evidence.',
    coreFacts: [
      'Issue: Third-party CVE library flaw in JWT header parsing.',
      'Remediation: Patched dependency deployed and HMAC keys rotated.',
      'Investigation: Audit logs reviewed; zero unauthorized token forged.',
    ],
    audienceProfiles: {
      teammate: {
        roleTitle: 'Frontend Engineer',
        priorityFocus: 'Session invalidation behavior and frontend token refresh handling',
        toneRecommendation: 'Clear, direct, and actionable',
        modelPhrasing:
          'We just rotated JWT signing keys to patch a library CVE. Active sessions will require a single silent refresh. Let me know if you see 401 spikes on client routes.',
        keyPitfall: 'Forgetting to warn about token expiration side-effects on client state.',
      },
      manager: {
        roleTitle: 'Security & Engineering Director',
        priorityFocus: 'Compliance status, timeline of remediation, and audit log findings',
        toneRecommendation: 'Formal, precise, compliance-aligned',
        modelPhrasing:
          'Remediation complete for CVE-2024-auth: library updated, keys rotated, and staging regression passed. Log analysis across 45M requests confirmed zero exploitation. Post-mortem draft is scheduled for 2 PM review.',
        keyPitfall: 'Speculating on breach impact before audit confirmation.',
      },
      customer: {
        roleTitle: 'Enterprise Customer Information Security Officer',
        priorityFocus: 'Audit transparency, data safety verification, and compliance assurance',
        toneRecommendation: 'Calm, authoritative, security-first',
        modelPhrasing:
          'As part of our proactive threat monitoring, our automated security scanners patched a third-party dependency within 45 minutes of disclosure. Comprehensive access log verification confirmed that no customer data or session integrity was ever compromised.',
        keyPitfall: 'Over-promising that "vulnerabilities will never happen again".',
      },
      executive: {
        roleTitle: 'Chief Executive Officer',
        priorityFocus: 'Customer exposure, regulatory notification requirements, and brand risk',
        toneRecommendation: 'High-level reassurance, liability containment',
        modelPhrasing:
          'Security update: Third-party patch applied within 1 hour. Zero customer breach, zero regulatory reporting required. Our defense-in-depth posture performed as intended.',
        keyPitfall: 'Drowning the CEO in cryptographic algorithm jargon.',
      },
      technical_expert: {
        roleTitle: 'Chief Information Security Officer (CISO)',
        priorityFocus: 'Signature verification algorithms, replay attack protections, and key management',
        toneRecommendation: 'Rigorous, audit-grade, technically defensible',
        modelPhrasing:
          'Enforced explicit "alg": "ES256" validation in the middleware to reject "none" and cross-algorithm signature exploits. Vault automatic rotation completed for asymmetric signing pairs.',
        keyPitfall: 'Failing to cite the exact cryptographic enforcement mechanism.',
      },
    },
  },
];

// -------------------------------------------------------------------
// 3. MANAGER SCENARIOS & ROLEPLAY
// -------------------------------------------------------------------
export const MANAGER_SCENARIOS: ManagerScenario[] = [
  {
    id: 'mgr-delayed-task',
    topic: 'delay_reporting',
    title: 'Explaining a Delayed Deliverable to a Results-Driven Manager',
    context:
      'Your search autocomplete feature was estimated for Thursday, but third-party API rate limits have blocked integration testing.',
    managerPersona: {
      name: 'Marcus Vance',
      role: 'Director of Product Engineering',
      style: 'direct_results',
    },
    managerOpeningPrompt:
      '"We committed the search autocomplete feature to the VP for Friday demo. I see the ticket is still in code-review. Why is this slipping and what is the plan to hit the deadline?"',
    keyPrinciples: [
      'Own the update directly without blaming others defensively',
      'Quantify the specific technical obstacle',
      'Offer two concrete alternative paths forward with trade-offs',
      'Ask for the required manager decision',
    ],
    recommendedFramework: 'Acknowledge Commitment → State Blocker → Present 2 Options → Request Direction',
    modelResponse:
      'Marcus, I understand how critical Friday’s demo is. The UI and algorithm are complete, but during end-to-end testing, the third-party geo-API hit unanticipated rate limits that degraded response times to 2 seconds. We have two options: Option A is demoing with our local mock dataset on Friday, which showcases the full UX flawlessly. Option B is provisioning an enterprise API quota tier by tomorrow noon so we can ship live data. Which path do you prefer for Friday?',
  },
  {
    id: 'mgr-priority-disagreement',
    topic: 'priority_conflict',
    title: 'Disagreeing with a Manager on Feature Urgency vs Technical Debt',
    context:
      'Your manager wants to rush a new checkout discount banner before fixing a database connection leak that crashes the cart twice a week.',
    managerPersona: {
      name: 'Sarah Jenkins',
      role: 'Engineering Manager',
      style: 'analytical_skeptic',
    },
    managerOpeningPrompt:
      '"Marketing wants this discount banner deployed by Wednesday noon. I want you to drop your database connection clean-up and focus 100% on the banner HTML and styling."',
    keyPrinciples: [
      'Validate the business importance of marketing campaigns',
      'Frame the technical debt around business cost (cart crash = lost revenue)',
      'Propose a compromise or phased rollout',
    ],
    recommendedFramework: 'Acknowledge Goal → Frame Risk in Business Terms → Propose Phased Delivery',
    modelResponse:
      'I completely agree that maximizing marketing conversions for Wednesday is high priority. My concern is that the checkout database connection leak caused two customer cart outages last week during peak traffic. If the banner drives a 30% traffic surge, there is a high likelihood the checkout service will drop customer transactions entirely. Could we ship the discount banner with a temporary static cache, and take 4 hours tomorrow morning to patch the connection leak? That ensures we capture the revenue without crashing the store.',
  },
  {
    id: 'mgr-mistake-admission',
    topic: 'mistake_admission',
    title: 'Admitting a Costly Misconfiguration Promptly',
    context:
      'You accidentally left an unoptimized BigQuery cluster running overnight over the weekend, consuming $1,800 in extra cloud credits.',
    managerPersona: {
      name: 'Elena Rostova',
      role: 'VP of Engineering',
      style: 'supportive_coach',
    },
    managerOpeningPrompt:
      '"I was reviewing our AWS/GCP bill this morning and noticed a sudden $1,800 spike in our weekend query analytics. Do you know what happened here?"',
    keyPrinciples: [
      'State personal responsibility immediately without evasive passive language ("a query was left running")',
      'Report that the resource has already been terminated',
      'Explain the automated guardrail you implemented so it can never happen again',
    ],
    recommendedFramework: 'Direct Ownership → Immediate Remediation Taken → Systemic Prevention Guardrail',
    modelResponse:
      'Elena, that was my mistake. I initiated a full historical backfill query on Friday afternoon and failed to configure the auto-termination idle timeout before logging off. As soon as I detected the billing alert this morning at 8 AM, I killed the cluster. To ensure this cannot happen again, I opened a PR adding an automated budget alert at $100 and enforced a 60-minute hard shutdown policy in our Terraform configuration. I apologize for the oversight.',
  },
];

// -------------------------------------------------------------------
// 4. CONFLICT RESOLUTION & PROFESSIONAL DISAGREEMENT
// -------------------------------------------------------------------
export const CONFLICT_SCENARIOS: ConflictScenario[] = [
  {
    id: 'conf-architecture-tech',
    category: 'technical_disagreement',
    title: 'Architectural Standoff: Monolith Extension vs New Microservice',
    partiesInvolved: ['Senior Backend Lead (Pro-Microservice)', 'You (Pro-Modular Monolith)'],
    underlyingTension:
      'The lead wants to spin up a standalone Kubernetes service with its own database, while you believe team velocity and operational overhead favor adding a clean bounded context inside the existing modular monolith.',
    frameworkSteps: {
      understand: 'Listen to their concerns regarding isolation, independent deployment, and scalability.',
      clarify: 'Ask about expected throughput and team ownership over the next 12 months.',
      explain: 'Articulate the operational costs: distributed tracing, deployment pipelines, and latency.',
      findCommonGround: 'Agree that domain separation and clean interfaces are non-negotiable.',
      proposeSolution: 'Build as an isolated module within the monolith with clean contracts; split later if traffic demands it.',
      confirmNextStep: 'Write a 1-page Architecture Decision Record (ADR) detailing trigger metrics for splitting.',
    },
    disagreementStyles: {
      direct:
        'I respect your goal of independent scaling, but launching a separate microservice now introduces significant Kubernetes overhead, distributed transaction complexity, and network latency that our 3-person team cannot afford to maintain.',
      diplomatic:
        'I see the long-term scalability benefits you are targeting with a microservice. Given our immediate Q3 deadline and current team bandwidth, what if we design this as a strictly isolated domain module within our existing codebase today, with defined interface boundaries so we can extract it into a microservice in under two days if throughput targets require it?',
      technical:
        'Our projected volume is 150 RPS. A modular monolith processes this in-memory in under 12ms, whereas inter-service gRPC hops will add 40ms and require distributed saga rollbacks for checkout transactions.',
    },
  },
  {
    id: 'conf-deadline-scope',
    category: 'deadline_conflict',
    title: 'Product Scope Creep 2 Weeks Before Production Launch',
    partiesInvolved: ['Product Manager', 'Engineering Team'],
    underlyingTension:
      'Product insists on adding multi-currency support right before launch without moving the fixed marketing launch date.',
    frameworkSteps: {
      understand: 'Acknowledge the commercial value of international customers.',
      clarify: 'Clarify whether foreign currency checkout is legally required for Day 1.',
      explain: 'Highlight that introducing foreign exchange APIs risks testing coverage of domestic checkout.',
      findCommonGround: 'Both teams want an uncompromised, zero-bug launch day.',
      proposeSolution: 'Launch Day 1 with USD/EUR, rollout multi-currency in Sprint 2 as a fast-follow.',
      confirmNextStep: 'Document the Sprint 2 backlog priority in writing with the executive sponsor.',
    },
    disagreementStyles: {
      direct:
        'We cannot add multi-currency in the remaining 10 days without skipping regression testing and jeopardizing our Day 1 launch reliability.',
      diplomatic:
        'I understand how valuable international customers are for our revenue targets. If we inject multi-currency into checkout this late, we will have to compress QA testing to zero. Let’s protect our launch date with USD and EUR first, and schedule the full currency rollout in our first sprint post-launch.',
      technical:
        'Currency conversion requires external FX rate webhooks, settlement reconciliation, and rounding edge cases that demand at least 80 engineering hours of test harness validation.',
    },
  },
];

// -------------------------------------------------------------------
// 5. FEEDBACK TRAINING (Giving & Receiving)
// -------------------------------------------------------------------
export const FEEDBACK_TRAINING_CASES: FeedbackTrainingCase[] = [
  {
    id: 'fb-giving-code-review',
    direction: 'giving',
    situation: 'Giving feedback to a junior engineer who submitted a 1,200-line monolithic pull request without unit tests.',
    flawedDraft: 'Your PR is way too big and impossible to read. Why are there no tests? Don’t submit code like this again.',
    flawsIdentified: [
      'Personal attack ("Your PR is impossible to read") rather than code-focused',
      'Vague and non-actionable criticism',
      'Aggressive rhetorical question ("Why are there no tests?") that induces defensiveness',
      'Fails to provide guidance on how to fix it',
    ],
    professionalModel:
      'Thanks for tackling this feature, Jason! The core business logic in the parser looks very solid. To help us review thoroughly and ensure high test coverage, could we break this 1,200-line PR into two smaller parts? Specifically, Part 1 for the database schema models with unit tests, and Part 2 for the UI integration. Smaller PRs also prevent merge conflicts. Let me know if you would like to pair on writing the mock tests together!',
    actionableCriteria: [
      'Praise what was done well first',
      'Focus criticism on the artifact, not the individual',
      'Provide specific split points and offer collaborative support',
    ],
  },
  {
    id: 'fb-receiving-defensiveness',
    direction: 'receiving',
    situation:
      'A Senior Architect remarks in front of the team: "Your presentation spent too much time on basic definitions and didn’t give us enough architectural depth."',
    flawedDraft:
      'Well, half the people in the room aren’t engineers, so if I got too technical they would have been completely lost! You can’t please everyone.',
    flawsIdentified: [
      'Immediate defensive rationalization',
      'Blaming the audience ("half the people aren\'t engineers")',
      'Dismissive concluding remark ("You can\'t please everyone")',
      'Missed opportunity to extract constructive guidance',
    ],
    professionalModel:
      'Thank you for that feedback, Mark. You are right that I wanted to make sure our product partners were aligned on the vocabulary first, but I see how that limited the technical depth for the architecture team. In our next technical sync, I will provide the context as a pre-read so we can dedicate 80% of our live time directly to system design and latency benchmarks. Which specific subsystem would you like to dive deeper into next?',
    actionableCriteria: [
      'Acknowledge the core truth in the observation calmly',
      'Explain the original intention without arguing',
      'Propose a concrete future adjustment (pre-read)',
      'Invite immediate constructive input',
    ],
  },
];

// -------------------------------------------------------------------
// 6. EXECUTIVE COMMUNICATION & BRIEFINGS
// -------------------------------------------------------------------
export const EXECUTIVE_BRIEFING_CASES: ExecutiveBriefingCase[] = [
  {
    id: 'exec-30s-cloud-spend',
    duration: '30s',
    topicTitle: '30-Second Executive Pitch: Cloud Infrastructure Optimization',
    verboseContext:
      'Our AWS bills have climbed from $12,000/mo to $28,000/mo over the past six months due to unreserved EC2 on-demand instances, oversized Redis caches, and uncompressed S3 logging buckets. By investing 2 weeks of engineering time to purchase 1-year Savings Plans, downsize Redis, and apply lifecycle storage rules, we can cut annual operating expenses by $110,000.',
    keyTakeaway: 'Invest 2 weeks of engineering time to save $110,000 annually in cloud operating costs.',
    quantifiedImpact: '$110,000 / year recurring savings with zero customer latency impact.',
    recommendedDecision: 'Approve a 2-week engineering focus sprint and authorize 1-year AWS Savings Plans commitment.',
    modelBriefing:
      'Executive summary: Our AWS infrastructure costs currently sit at $28,000 a month due to on-demand compute pricing. By dedicating two weeks of engineering bandwidth to right-size our Redis caches and commit to 1-year compute savings plans, we will reduce monthly cloud spend by 38%—saving the company $110,000 annually. There is zero risk to customer uptime. We need your approval today to schedule the sprint and authorize the 1-year reservation.',
  },
  {
    id: 'exec-15s-incident-bluf',
    duration: '15s',
    topicTitle: '15-Second Incident Briefing to CEO',
    verboseContext:
      'A third-party payment gateway had a 12-minute regional DNS outage impacting checkout for 4% of active users. The backup Stripe fallback kicked in automatically. Zero credit card numbers were exposed.',
    keyTakeaway: 'Incident contained in 12 minutes with automated fallback; zero financial or data loss.',
    quantifiedImpact: '4% user friction for 12 minutes, zero financial loss.',
    recommendedDecision: 'Inform executive team; no public disclosure necessary.',
    modelBriefing:
      'BLUF: The checkout payment glitch was resolved within 12 minutes via automated gateway fallback. Only 4% of transactions experienced retry prompts, zero transactions failed permanently, and no sensitive data was exposed. Systems are 100% operational.',
  },
];

// -------------------------------------------------------------------
// 7. CLIENT COMMUNICATION & PRODUCT DEMOS
// -------------------------------------------------------------------
export const CLIENT_COMMUNICATION_CASES: ClientCommunicationCase[] = [
  {
    id: 'client-demanding-delay',
    topic: 'handling_tough_questions',
    title: 'Responding to an Angry Enterprise Client on Milestone Slippage',
    clientPrompt:
      '"We signed this contract based on a June 1st delivery date. If your team cannot even deliver the reporting module on time, why should we trust you with our enterprise rollout in September?"',
    clientPersona: {
      name: 'Victoria Sterling',
      company: 'Apex Global Logistics',
      temperament: 'demanding',
    },
    fiveStepHandling: {
      acknowledge: 'I completely understand your frustration, Victoria, and you are 100% right that reliability is what you hired us for.',
      clarify: 'To be completely transparent about where we stand, our reporting engine is generating accurate data, but security stress tests revealed an encryption vulnerability in the CSV export.',
      explain: 'Rather than shipping insecure code to your production environment on June 1st, we chose to remediate the encryption so your company never faces regulatory audit risk.',
      setExpectation: 'The security patch completes on Wednesday, and independent penetration testing finishes Friday.',
      offerNextStep: 'I will personally deliver the sandbox walkthrough on Monday at 10 AM, and provide daily 1-page progress summaries between now and then.',
    },
    prohibitedPractices: [
      'Blaming individual junior developers or sub-contractors',
      'Making deceptive verbal promises that cannot be mathematically met',
      'Becoming defensive or citing internal company policies',
    ],
  },
];

// -------------------------------------------------------------------
// 8. TECHNICAL <-> BUSINESS TRANSLATION
// -------------------------------------------------------------------
export const TECH_BUSINESS_TRANSLATION_CASES: TechBusinessTranslationCase[] = [
  {
    id: 'trans-latency-spike',
    direction: 'tech_to_business',
    scenarioTitle: 'Translating Database Connection Exhaustion',
    sourceStatement:
      'The API gateway is throwing 504 Gateway Timeouts because PostgreSQL max_connections was saturated by unpooled worker threads executing unindexed full-table scans.',
    developerVersion:
      'We saturated max_connections (100) because our background workers bypassed PgBouncer and ran full table scans on the orders table. We need connection pooling and an index on customer_id.',
    managerVersion:
      'Our servers ran out of database communication slots because background jobs were running heavy unoptimized queries without a shared connection pool. We are adding connection pooling to stabilize response times.',
    customerVersion:
      'Our platform is experiencing intermittent slowdowns due to heavy background data processing. Our engineering team is currently optimizing data traffic to restore instantaneous page loads.',
    executiveVersion:
      'System slowdowns during peak hours were caused by a database bottleneck. We implemented connection pooling and query optimization today, resolving the slowdown permanently with zero infrastructure cost increase.',
    jargonToAvoid: ['max_connections', 'PgBouncer', 'full-table scans', '504 Gateway Timeouts', 'PostgreSQL worker threads'],
  },
];

// -------------------------------------------------------------------
// 9. NEGOTIATION SIMULATION (Part 18 Masterclass)
// -------------------------------------------------------------------
export const NEGOTIATION_CASES: NegotiationSimulationCase[] = [
  {
    id: 'neg-scope-deadline',
    topic: 'project_scope',
    title: 'Negotiating Project Scope vs Immovable Release Deadline',
    backgroundContext:
      'Stakeholders demand 8 complex modules by October 1st for a trade show, but engineering capacity can only safely deliver 5 modules with full test coverage.',
    counterpartGoal: 'Wants all 8 features demonstrated live on stage to impress industry investors.',
    learnerObjective: 'Secure agreement on a 5-module core MVP for the live demo, scheduling the other 3 for Phase 2.',
    stages: [
      {
        stage: 'preparation',
        label: '1. Preparation & BATNA',
        guidingQuestions: [
          'What is non-negotiable for the trade show stage demo?',
          'What are the failure risks of an unstable 8-module live demo?',
        ],
        modelPhrases: [
          'Our shared objective is an impressive, flawless keynote demonstration that wins investor confidence.',
        ],
      },
      {
        stage: 'opening',
        label: '2. Professional Opening',
        guidingQuestions: ['How do you frame alignment before discussing constraints?'],
        modelPhrases: [
          'We are 100% committed to ensuring the keynote presentation positions our company as the market leader.',
        ],
      },
      {
        stage: 'proposal',
        label: '3. Strategic Proposal',
        guidingQuestions: ['How do you present the tradeoff as a win rather than a reduction?'],
        modelPhrases: [
          'To ensure the live demo is lightning-fast and 100% crash-proof, we propose showcasing the 5 most visually compelling features live, and presenting the remaining 3 as guided preview mockups in the booth.',
        ],
      },
      {
        stage: 'compromise',
        label: '4. Principled Compromise',
        guidingQuestions: ['How do you handle stakeholder pushback?'],
        modelPhrases: [
          'If Module 6 is mandatory for the keynote, we can swap out Module 4 to keep delivery on schedule without cutting testing.',
        ],
      },
      {
        stage: 'agreement',
        label: '5. Clear Agreement & Follow-up',
        guidingQuestions: ['How do you cement the scope lock in writing?'],
        modelPhrases: [
          'Let’s formalize this: Modules 1 through 5 will be frozen for keynote staging by September 20th. I will send an updated scope document by 5 PM today.',
        ],
      },
    ],
  },
];

// -------------------------------------------------------------------
// 10. MEETING FACILITATION & REAL-TIME PRESSURE
// -------------------------------------------------------------------
export const MEETING_FACILITATION_CASES: MeetingFacilitationCase[] = [
  {
    id: 'meet-derailed-debate',
    meetingTitle: 'Sprint Retrospective: Refocusing a Derailed Blame Argument',
    agenda: ['Review Sprint Metrics', 'Analyze Deployment Hiccups', 'Action Items for Next Sprint'],
    difficultMoment: 'derailed_topic',
    contextDescription:
      'Two senior developers have spent 15 minutes arguing about which Git branching strategy caused a staging conflict, completely derailing the retrospective.',
    facilitatorInterventionPhrases: [
      'I want to pause our discussion here for a moment.',
      'Both perspectives on branching are valid and highlight real workflow challenges.',
      'However, our goal today is identifying team-wide retrospective action items within our remaining 20 minutes.',
      'Let’s take the branching strategy debate offline into an ADR working group, and bring our focus back to sprint velocity.',
    ],
    modelActionPlan:
      'Acknowledge both parties calmly → State the remaining time constraint → Propose a dedicated offline follow-up session → Re-anchor the group to the primary meeting objective.',
  },
  {
    id: 'meet-quiet-contributor',
    meetingTitle: 'Architecture Review: Drawing in a Quiet Junior Engineer',
    agenda: ['Database Sharding Review', 'Open Q&A and Risk Identification'],
    difficultMoment: 'quiet_participant',
    contextDescription:
      'The louder team leads have dominated the entire session, while the junior engineer who built the ingestion pipeline hasn’t had a chance to speak.',
    facilitatorInterventionPhrases: [
      'Marcus and Dave, those are great points on cache invalidation.',
      'I’d love to bring Priya into this conversation, as she spent the last sprint hands-on with the ingestion pipelines.',
      'Priya, from your experience with the write load, how do you see this sharding proposal impacting our consumer lag?',
    ],
    modelActionPlan:
      'Politely transition away from dominant voices → Specifically validate the quiet contributor’s unique context → Ask an open, inviting question grounded in their direct work.',
  },
];

// -------------------------------------------------------------------
// 11. "THINK ON YOUR FEET" & BRAIN-FREEZE DRILLS
// -------------------------------------------------------------------
export const THINK_ON_YOUR_FEET_DRILLS: ThinkOnYourFeetDrill[] = [
  {
    id: 'feet-guarantee-uptime',
    unexpectedQuestion:
      '"Can you give me a 100% guarantee that our checkout will not go down during Black Friday weekend?"',
    workplaceContext: 'High-stakes executive steering committee with the CEO and Head of Sales.',
    brainFreezeSupport: {
      firstPhrase: 'What I can guarantee is our rigorous defense-in-depth preparation...',
      keywords: ['Redundancy', 'Auto-scaling', 'Load testing', 'Automated failover', '24/7 War Room'],
      structureAnchor: 'Reframe 100% certainty into concrete risk controls and response times.',
      modelAnswer:
        'In distributed systems, no responsible engineer can promise 100.00% theoretical perfection. However, what I can definitively guarantee is our defense-in-depth architecture: we have load-tested the platform to 3.5 times our projected peak traffic, configured automatic multi-zone failover with 15-second health checks, and established a 24/7 dedicated engineering war room to remediate any anomaly within 60 seconds.',
    },
    targetSeconds: 45,
  },
  {
    id: 'feet-cut-budget',
    unexpectedQuestion:
      '"If the executive committee cuts your engineering budget by 30% tomorrow, which core project do you terminate?"',
    workplaceContext: 'Annual strategic roadmap evaluation with the CFO.',
    brainFreezeSupport: {
      firstPhrase: 'Our prioritization is strictly anchored to customer retention and direct revenue...',
      keywords: ['Core revenue', 'Experimental R&D', 'Phased deferral', 'Operational baseline'],
      structureAnchor: 'State the prioritization principle first, then name the specific deferral.',
      modelAnswer:
        'Our budget allocation is strictly prioritized around core transactional revenue first and speculative R&D second. If forced to absorb a 30% reduction, we would safeguard our core checkout and security infrastructure 100%, and temporarily pause the AI recommendation sandbox. That protects our revenue-generating baseline while minimizing long-term commercial disruption.',
    },
    targetSeconds: 45,
  },
];
