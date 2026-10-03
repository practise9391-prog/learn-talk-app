import {
  WorkplaceProfile,
  OnboardingScenario,
  AskingForHelpScenario,
  TaskUnderstandingCase,
  StandupDrill,
  ProjectStatusCase,
  DeadlineCommunicationCase,
  OneOnOneSession,
  FeedbackCase,
  DisagreementConflictCase,
  IncidentCommunicationCase,
  CustomerSimulationCase,
  BidiTechCase,
  MeetingScenarioCase,
  AsyncCommMatrixItem,
  BrainFreezeRecoveryPhrase,
  ProfessionalStoryItem,
  DelegationCase,
  ExecutiveBriefingCase,
  MultiDaySimState,
  CareerGrowthTrack,
  WorkplaceReadinessDimension,
} from '../types/workplaceMastery';

export const DEFAULT_WORKPLACE_PROFILE: WorkplaceProfile = {
  id: 'wp_profile_default',
  currentRole: 'Full Stack Engineer',
  industry: 'Fintech & Cloud Platforms',
  experienceLevel: 'team_member',
  teamType: 'hybrid',
  workMode: 'balanced',
  communicationFrequency: 'daily_syncs',
  managerCommunicationLevel: 'independent',
  clientCommunicationLevel: 'occasional',
  leadershipLevel: 'mentoring',
  technicalCommunicationLevel: 'intermediate',
  presentationFrequency: 'monthly',
  meetingFrequency: 'moderate',
  professionalGoals: [
    'Communicate project delays with proactive solutions',
    'Facilitate sprint planning meetings with high clarity',
    'Explain architectural trade-offs to business stakeholders',
    'Give constructive peer feedback with diplomacy',
  ],
};

export const ONBOARDING_SCENARIOS: OnboardingScenario[] = [
  {
    id: 'onboard_day1_intro',
    phase: 'first_day',
    title: 'First Morning Team Introduction',
    scenarioContext: 'You just logged into the primary team channel and your engineering manager invites you to introduce yourself.',
    interlocutor: {
      name: 'Sarah Lin',
      role: 'Engineering Manager',
    },
    promptMessage: "Welcome to the team! Everyone, please say hi to our new engineer. Would you like to introduce yourself and share a bit about what you'll be working on?",
    audienceType: 'team',
    recommendedStructure: [
      'Warm greeting & brief background',
      'What you are excited to contribute to',
      'Openness to questions and pairing',
    ],
    keySamplePhrases: [
      "Hi everyone, really excited to join the team today!",
      "I'll be focusing primarily on our core platform APIs and frontend integrations.",
      "Looking forward to collaborating and learning from everyone here.",
    ],
    hints: [
      'Keep it friendly, humble, and concise (under 45 seconds).',
      'Do not give a 10-minute autobiography; focus on shared goals.',
    ],
  },
  {
    id: 'onboard_day1_asking_where',
    phase: 'first_day',
    title: 'Locating Documentation & Setup Credentials',
    scenarioContext: 'Your local environment setup is missing the staging API token and internal architecture diagrams.',
    interlocutor: {
      name: 'David Chen',
      role: 'Onboarding Buddy & Senior Dev',
    },
    promptMessage: "Hey! How is the dev machine setup coming along? Let me know if you run into any blockers.",
    audienceType: 'team',
    recommendedStructure: [
      'Acknowledge what is working so far',
      'Specify the exact missing resource',
      'Polite ask with low friction',
    ],
    keySamplePhrases: [
      "The repo cloned smoothly, but I noticed the onboarding doc links to an expired staging key.",
      "Could you point me to where the current environment variables are stored?",
      "No rush at all, whenever you have a minute between meetings.",
    ],
    hints: ['State what you already checked before asking.'],
  },
  {
    id: 'onboard_week1_expectations',
    phase: 'first_week',
    title: 'First 1:1 Expectation Alignment',
    scenarioContext: 'End of your first week check-in with your direct manager.',
    interlocutor: {
      name: 'Sarah Lin',
      role: 'Engineering Manager',
    },
    promptMessage: "You've survived week one! How are you feeling about the team cadence and your 30-day goals?",
    audienceType: 'manager',
    recommendedStructure: [
      'Positive reflection on onboarding pace',
      'Recap of initial PRs or docs reviewed',
      'Proactive question regarding week-two priorities',
    ],
    keySamplePhrases: [
      "The onboarding docs were very clear, and I got my first PR merged yesterday.",
      "For next week, should my priority be picking up backlog bug tickets or deep-diving the billing service?",
    ],
    hints: ['Ask clarifying questions on what success looks like by Day 30.'],
  },
  {
    id: 'onboard_month1_feedback',
    phase: 'first_month',
    title: '30-Day Milestone & Feedback Request',
    scenarioContext: 'You completed your first sprint ticket and want structured feedback on communication and execution.',
    interlocutor: {
      name: 'Sarah Lin',
      role: 'Engineering Manager',
    },
    promptMessage: "Can you believe it's already been a month? Let's talk about how the first major feature launch went from your perspective.",
    audienceType: 'manager',
    recommendedStructure: [
      'Self-assessment of strengths and speed bumps',
      'Specific request for constructive feedback',
      'Action-oriented next steps',
    ],
    keySamplePhrases: [
      "I felt confident with the API refactor, but I'd appreciate your feedback on whether my pull request descriptions have enough context for the reviewers.",
      "Are there any areas where you'd like me to communicate more proactively?",
    ],
    hints: ['Show eagerness for refinement, not just validation.'],
  },
];

export const ASKING_FOR_HELP_SCENARIOS: AskingForHelpScenario[] = [
  {
    id: 'help_senior_tech',
    title: 'Asking a Senior Engineer for Debugging Assistance',
    targetPerson: 'senior',
    problemContext: 'A database query in production staging is timing out after 15 seconds during a bulk CSV import.',
    whatTriedContext: 'Checked the indexing on customer_id, reduced batch size from 500 to 100, and inspected query execution plans.',
    missingInformation: 'Understanding why PostgreSQL ignores the composite index on timestamp and tenant_id.',
    modelAnswer:
      "Hi Alex, do you have 5 minutes today? I'm seeing timeouts on the bulk CSV import in staging. I've already verified the foreign keys, reduced batch size to 100, and checked EXPLAIN ANALYZE, but the query planner is still running a sequential scan on the tenant table. Could you help me understand how our composite indexes are typically tuned for partitioned tables?",
  },
  {
    id: 'help_manager_workload',
    title: 'Asking Manager for Priority Guidance Under Multiple Deadlines',
    targetPerson: 'manager',
    problemContext: 'Two high-priority tickets arrived today: an urgent customer audit report and an end-of-sprint migration.',
    whatTriedContext: 'Estimated each task: audit takes 6 hours, migration takes 8 hours. Both cannot finish before Friday 5 PM.',
    missingInformation: 'Which stakeholder expectation should take precedence.',
    modelAnswer:
      "Hi Sarah, I wanted to quickly flag a capacity trade-off for Friday. I have the customer audit report (6 hours) and the database migration (8 hours). Since completing both before Friday 5 PM would compromise quality, which deliverable would you recommend prioritizing first? I can hand off the audit draft or defer the migration to Monday morning depending on client impact.",
  },
  {
    id: 'help_crossfunc_designer',
    title: 'Asking Product Designer for Spec Clarification',
    targetPerson: 'technical_expert',
    problemContext: 'Figma mockups show a mobile drawer, but the desktop tablet breakpoint is not specified.',
    whatTriedContext: 'Inspected the design system tokens and previous modal patterns on tablet views.',
    missingInformation: 'Whether tablet screens (768px-1024px) should render a bottom drawer or a centered popover.',
    modelAnswer:
      "Hey Maya, quick question on the new checkout flow. In Figma, I see the bottom sheet for mobile and the dialog for 1200px+ desktops. For the 768px tablet breakpoint, should we default to the centered dialog or the slide-up drawer? I want to make sure the keyboard interaction feels natural.",
  },
];

export const TASK_UNDERSTANDING_CASES: TaskUnderstandingCase[] = [
  {
    id: 'task_case_1_auth_refactor',
    managerName: 'Marcus Wright (Lead Architect)',
    audioPromptText:
      "Hey, before the end of the sprint on Thursday, we need to deprecate the legacy session token endpoint. Please update the API gateway routes to enforce Bearer JWT verification. Make sure you coordinate with the mobile team because their latest release still calls the v1 path, and we can't break existing user logins. High priority because of the upcoming compliance audit.",
    taskTitle: 'Deprecate Legacy Session Endpoint & Enforce JWT Gateway',
    correctDetails: {
      coreDeliverable: 'Update API Gateway routes to enforce Bearer JWT verification and deprecate v1 session tokens.',
      deadline: 'Thursday before end of current sprint',
      priority: 'urgent',
      keyDependencies: ['Coordination with mobile team to verify backward compatibility with v1 app releases'],
    },
    sampleConfirmationPhrasing:
      "Just to confirm I have the full picture: The core deliverable is routing API Gateway through Bearer JWT verification and deprecating v1 session endpoints by Thursday before sprint close. The top dependency is verifying mobile app backward compatibility so we don't break existing sessions. I'll sync with the mobile lead this afternoon and share a migration plan.",
  },
];

export const STANDUP_DRILLS: StandupDrill[] = [
  {
    id: 'standup_standard_dev',
    roleContext: 'Full Stack Engineer on payments checkout team',
    sprintGoal: 'Deliver Stripe 3D-Secure biometric verification',
    yesterdayActivities: [
      'Finalized webhook callback handlers',
      'Added unit tests covering card decline scenarios',
    ],
    todayPlan: [
      'Integrate frontend modal with the payment confirmation hook',
      'Pair with QA on sandbox testing with European test credit cards',
    ],
    blockerIssue: 'Waiting on sandbox API credentials from third-party vendor support.',
    isConciseFocus: true,
    modelDelivery:
      "Yesterday, I finished the webhook callback handlers and wrote unit tests for card decline scenarios. Today, I'm integrating the frontend confirmation modal and pairing with QA on sandbox testing. My only blocker is waiting on the vendor for European 3DS credentials; if that doesn't arrive by noon, I'll switch over to the analytics events.",
  },
  {
    id: 'standup_blocker_heavy',
    roleContext: 'Backend Developer on cloud data ingest pipeline',
    sprintGoal: 'Scale Kafka consumer throughput to 5,000 events/sec',
    yesterdayActivities: [
      'Benchmarked partition offsets and memory footprints under load',
    ],
    todayPlan: [
      'Tune batch commit intervals and investigate worker CPU spikes',
    ],
    blockerIssue: 'Staging Kubernetes cluster node autoscaler is running out of IP addresses.',
    isConciseFocus: false,
    modelDelivery:
      "Yesterday I benchmarked partition consumer throughput. Today I'm investigating CPU spikes during batch commits. Major blocker: our staging K8s node pool ran out of IP allocations this morning, which is preventing new worker pods from starting. I've opened a DevOps ticket, but if anyone has temporary permissions to prune stale pods, let me know right after standup.",
  },
];

export const PROJECT_STATUS_CASES: ProjectStatusCase[] = [
  {
    id: 'status_yellow_api_migration',
    projectName: 'Core Billing Engine V2 Migration',
    health: 'yellow',
    progressSummary: '80% of endpoints migrated, database shadow testing active.',
    risksIdentified: [
      'Latency in European region is 120ms higher than target SLA',
      'Third-party invoice sync service has intermittent 504 gateway timeouts',
    ],
    dependencies: ['DevOps multi-region Redis cache provisioning'],
    delays: ['Staging cluster downtime delayed stress testing by 2 days'],
    recommendedNextSteps: [
      'Implement circuit breaker on invoice sync to prevent queue buildup',
      'Deploy regional caching proxy in eu-central-1',
    ],
    requiredSupport: 'Approval for provisioning an EU caching instance from Infrastructure team.',
    modelStatusReport:
      "Project status for Billing V2 is currently YELLOW. We have successfully completed 80% of endpoints with shadow testing running. The primary risk is European latency exceeding our 200ms SLA due to cross-region database roundtrips. We have mitigated the code-level queries, but our recommended next step is provisioning an EU Redis read-replica. With Infrastructure approval by Wednesday, we remain on track for the target launch date.",
  },
  {
    id: 'status_red_compliance_audit',
    projectName: 'SOC2 Type II Access Governance Rollout',
    health: 'red',
    progressSummary: 'Identity provider SSO configuration completed for internal tools.',
    risksIdentified: [
      'Legacy database accounts lack individual audit logging',
      'External penetration test uncovered high-severity permission escalation',
    ],
    dependencies: ['Security team sign-off on database proxy architecture'],
    delays: ['Audit evidence deadline is in 4 business days; remediations require 7 business days'],
    recommendedNextSteps: [
      'Request a 5-day audit filing extension with legal compliance counsel',
      'Deploy short-term bastion host logging immediately',
    ],
    requiredSupport: 'Direct executive sponsor escalation to notify auditors of the revised filing timeline.',
    modelStatusReport:
      "Project status is RED. While SSO rollout is complete, our penetration test uncovered an escalation issue on legacy database accounts that requires architectural remediation. Since proper patching takes 7 days and our audit deadline is Friday, I recommend escalating to legal today to request a formal 5-day evidence submission window while we deploy bastion logging. Here is the exact remediation timeline for executive review.",
  },
];

export const DEADLINE_COMMUNICATION_CASES: DeadlineCommunicationCase[] = [
  {
    id: 'deadline_early_warning',
    taskTitle: 'Customer Data Export Feature',
    originalDeadline: 'Thursday end-of-day',
    delayReason: 'GDPR encryption requirements require streaming encryption rather than in-memory buffering to prevent memory crashes on 5GB+ files.',
    impactAssessment: 'Frontend UI is ready, but backend batch export will be incomplete by Thursday.',
    realisticNewDeadline: 'Monday 2:00 PM',
    mitigationActions: [
      'Pairing with senior backend dev tomorrow morning on streaming gzip pipeline',
      'Deploying frontend behind feature flag so other release items proceed unaffected',
    ],
    modelMessage:
      "Hi Sarah, I want to proactively flag a timeline adjustment for the Data Export feature. While testing with large 5GB customer datasets, we discovered that in-memory buffering risks out-of-memory errors, so we need to implement a streaming encryption pipe. Because of this architectural safeguard, the feature will not be ready by Thursday 5 PM. I can comfortably deliver it tested and reviewed by Monday at 2 PM. The rest of the sprint release can proceed on schedule behind a feature flag.",
  },
];

export const ONE_ON_ONE_SESSIONS: OneOnOneSession[] = [
  {
    id: 'one_on_one_career_progression',
    managerName: 'Rachel Vance (Director of Engineering)',
    managerStyle: 'supportive',
    mode: 'employee_led',
    topic: 'career_growth',
    discussionPrompts: [
      "What are the specific competencies you'd like to develop for Senior Engineer promotion?",
      "How can I create space on upcoming projects for you to lead technical architecture discussions?",
    ],
    talkingPointsGuide: [
      "Express gratitude for the project responsibilities given so far",
      "Highlight demonstrated technical and mentorship impact over the past 6 months",
      "Ask what gaps or evidence the promotion committee expects to see",
      "Agree on actionable milestones for the next quarterly review",
    ],
    modelDialogue: [
      {
        speaker: 'learner',
        text: "Thanks for making time today, Rachel. For this 1:1, I'd love to focus on my career trajectory and the roadmap toward Senior Engineer. Over the last two quarters, I've led the auth migration and mentored our two junior devs. What specific leadership or technical competencies do you see as the key differentiators for me to demonstrate next?",
      },
      {
        speaker: 'manager',
        text: "I really appreciate you bringing this up proactively. You've shown exceptional technical reliability. The main differentiator at the senior level is cross-functional influence—driving consensus across product, design, and multiple squads. Let's assign you as the technical anchor on the upcoming Q3 Checkout Redesign.",
      },
    ],
  },
  {
    id: 'one_on_one_workload_balance',
    managerName: 'Marcus Wright (Engineering Manager)',
    managerStyle: 'analytical',
    mode: 'employee_led',
    topic: 'workload_burnout',
    discussionPrompts: [
      "Let's review your active ticket volume and on-call paging frequency.",
    ],
    talkingPointsGuide: [
      "Share objective data on hours, on-call alert fatigue, and context switching",
      "Reaffirm commitment to quality over frantic output",
      "Propose specific task handoffs or sprint capacity rebalancing",
    ],
    modelDialogue: [
      {
        speaker: 'learner',
        text: "Marcus, I wanted to discuss current workload sustainability. Between handling tier-3 on-call alerts this week and carrying four concurrent sprint deliverables, I've noticed substantial context-switching that is slowing down deep engineering progress. Can we review the board and hand off the secondary bug tickets so I can maintain focus on the core reliability initiative?",
      },
      {
        speaker: 'manager',
        text: "Thanks for raising this with clarity before it affected your well-being or the code quality. Let's reassign the two secondary tickets to sprint backlog and tune the PagerDuty alerts so non-critical warnings don't wake you.",
      },
    ],
  },
];

export const FEEDBACK_CASES: FeedbackCase[] = [
  {
    id: 'feedback_receiving_vague',
    type: 'receiving',
    recipientOrGiver: 'Senior Teammate',
    feedbackFlavor: 'vague',
    situation: 'During a code review, a teammate leaves a comment: "This pull request feels too complex, please clean it up."',
    feedbackText: "This PR feels over-engineered and messy. Clean it up before we merge.",
    guidelines: [
      'Do not get defensive or dismissive',
      'Acknowledge the goal of codebase maintainability',
      'Ask specific clarifying questions to uncover the exact concern',
      'Offer actionable options',
    ],
    modelResponse:
      "Thanks for taking a look at the PR. I definitely want to ensure our codebase stays lean and maintainable. Could you point out which specific abstractions feel unnecessary—for example, the event emitter or the custom retry wrapper? I'm happy to flatten the helper functions if that simplifies review.",
  },
  {
    id: 'feedback_giving_constructive',
    type: 'giving',
    recipientOrGiver: 'Junior Colleague',
    feedbackFlavor: 'corrective',
    situation: 'A junior engineer frequently merges pull requests without adding unit tests or updating API documentation.',
    feedbackText: "",
    guidelines: [
      'Use SBI model: Situation, Behavior, Impact, Next Step',
      'Focus on the code quality impact, not personal traits',
      'Offer support or pairing',
    ],
    modelResponse:
      "Hey Jordan, I noticed on the last two user profile PRs that the new endpoints were merged without accompanying unit tests. When edge cases arise in production, having tests allows the team to debug rapidly without regressions. Moving forward, let's make sure test coverage is attached before asking for review. I'd be happy to pair with you tomorrow morning on our testing patterns if that would help!",
  },
];

export const DISAGREEMENT_CONFLICT_CASES: DisagreementConflictCase[] = [
  {
    id: 'disagree_tech_architecture',
    isConflict: false,
    topicTitle: 'Choosing between GraphQL vs REST for New Mobile App',
    counterpartRole: 'Frontend Lead',
    counterpartStance: 'Wants to adopt GraphQL immediately to eliminate over-fetching on mobile screens.',
    rootIssue: 'Our backend microservices and caching infrastructure are strictly optimized for REST with HTTP ETags.',
    recommendedSteps: {
      acknowledge: "I completely agree that minimizing mobile payload size and battery drain is a vital priority.",
      factsAndEvidence: "However, our existing CDN caching layer saves 60% of backend traffic, which GraphQL post requests would bypass without an expensive gateway setup.",
      impactExplanation: "Adopting GraphQL right now would require a 4-week infrastructure overhaul that jeopardizes our Q2 release date.",
      collaborativeAlternative: "Could we implement tailored JSON sparse fieldsets on the REST endpoints to achieve the exact payload reduction with zero infrastructure risk?",
      alignmentAction: "Let's benchmark a prototype with sparse fieldsets together this Thursday.",
    },
    sampleDialogue:
      "I see the huge value in avoiding over-fetching on cellular connections, and GraphQL makes UI queries clean. The risk I want to highlight is our caching architecture: our CDN saves 60% of database load through HTTP ETags, which GraphQL POST requests would bypass without an Apollo gateway. Could we test tailored REST sparse fieldsets first? That gives our mobile app the exact payload reduction without pushing back our Q2 delivery date.",
  },
  {
    id: 'conflict_missed_dependency',
    isConflict: true,
    topicTitle: 'Teammate Consistently Delays Shared API Contracts',
    counterpartRole: 'Backend Peer',
    counterpartStance: 'Defensive, stating backend logic is complex and frontend should just mock everything.',
    rootIssue: 'Frontend team is blocked for 3 days every sprint because mock schemas diverge from the eventual backend payload.',
    recommendedSteps: {
      acknowledge: "I understand that building business logic for complex queries takes deep focus.",
      factsAndEvidence: "Over the last two sprints, the contract changed twice after implementation started, causing 18 hours of frontend rework.",
      impactExplanation: "This puts our whole squad at risk of missing sprint commitments and creates mutual frustration.",
      collaborativeAlternative: "Can we agree to lock in an OpenAPI yaml schema on Day 1 of the sprint together, before either of us writes implementation code?",
      alignmentAction: "Let's review the schema for 20 minutes at sprint kickoff and treat it as our shared contract.",
    },
    sampleDialogue:
      "I know your team is handling heavy backend logic, and I appreciate the complexity. What I want to address is how our work connects: when the API schema shifts late in the sprint, our frontend engineers spend days refactoring instead of shipping. Could we schedule a 20-minute contract freeze on Monday morning to agree on the JSON shape before coding? That way both sides can work in parallel with total confidence.",
  },
];

export const INCIDENT_COMMUNICATION_CASES: IncidentCommunicationCase[] = [
  {
    id: 'incident_database_connection_pool',
    incidentTitle: 'Production Payment Service 500 Spike',
    severity: 'sev1_critical',
    rootCauseSummary: 'Exhausted database connection pool following a sudden traffic burst, causing 8% of checkout transactions to fail.',
    audienceBriefs: {
      team: 'Connection pool hit maximum 100 limit on pg_bouncer. We restarted pool workers, scaled max_connections to 250, and latency dropped to normal. Please monitor Grafana dashboard.',
      manager: 'Sev1 incident occurred at 14:10 due to connection pool saturation during the flash campaign. Total downtime was 14 minutes with an estimated 8% transaction drop. Mitigation is active, pool size increased, and we are preparing the post-mortem document.',
      customer: 'We experienced intermittent payment processing delays between 2:10 PM and 2:24 PM EST. All systems are fully restored, and queued transactions are safely processed. No double-charges occurred.',
      executive: 'At 14:10 EST, our checkout system experienced a 14-minute disruption affecting ~8% of payment attempts (~$12,000 in delayed orders). The engineering team expanded database throughput, fully restoring operations by 14:24. Preventative architectural safeguards are scheduled for deployment tomorrow.',
    },
  },
];

export const CUSTOMER_SIMULATION_CASES: CustomerSimulationCase[] = [
  {
    id: 'cust_frustrated_api_breaking_change',
    customerName: 'Eleanor Vance',
    companyName: 'Apex Logistics',
    customerStyle: 'frustrated',
    complaintOrRequest:
      "Your latest release broke our automated warehouse dispatch! Our drivers couldn't pull orders for two hours this morning. This is unacceptable, and your changelog mentioned nothing about mandatory header changes!",
    underlyingNeed: 'Immediate validation of their pain, urgent technical fix, and assurance that breaking changes will never occur unannounced.',
    handlingPhases: [
      'Acknowledge disruption with sincere empathy without defensiveness',
      'Explain the immediate workaround/hotfix clearly',
      'Provide root cause investigation and preventative policy',
    ],
    modelResponse:
      "Eleanor, I completely understand your frustration. A two-hour stoppage in warehouse dispatch is unacceptable, and I am deeply sorry for the disruption to your drivers this morning. We have just deployed a backward-compatible hotfix to accept legacy headers, so your automated dispatch is operational right now. Going forward, we are implementing a 30-day deprecation warning policy on all API headers with direct webhook alerts to your engineering lead so this can never recur.",
  },
];

export const BIDI_TECH_CASES: BidiTechCase[] = [
  {
    id: 'bidi_caching_and_redis',
    direction: 'tech_to_non_tech',
    title: 'Explaining In-Memory Caching to Business Stakeholders',
    rawInput: 'We added a Redis cluster with LRU eviction and a 300-second TTL to avoid slamming our Postgres primary DB.',
    variants: {
      technical:
        'We implemented an in-memory Redis key-value store with Least-Recently-Used eviction and 5-minute TTL to offload read queries from PostgreSQL.',
      professional:
        'We added a high-speed temporary memory layer that stores frequent search results so our main database avoids repetitive processing.',
      businessOutcome:
        'This upgrade reduces checkout page loading time by 65% and ensures our website stays up during high-traffic promotional sales without doubling server costs.',
      simpleAnalogy:
        'Think of it like keeping the top 10 best-selling items directly on the checkout counter instead of sending an employee to the basement warehouse every single time a customer asks.',
    },
  },
  {
    id: 'bidi_business_to_tech_compliance',
    direction: 'business_to_tech',
    title: 'Translating GDPR Data Deletion into Technical Architecture',
    rawInput: 'Business requirement: If a customer clicks Delete Account, we must legally remove all their private data within 30 days and provide proof.',
    variants: {
      technical:
        'Implement an asynchronous event-driven workflow (Kafka/RabbitMQ) triggering soft deletion flags, cascading foreign key anonymization on PII fields, archival backup purging after 30 days, and audit trail ledger generation.',
      professional:
        'When an account closure event fires, scrub personal records from all databases and third-party SaaS tools, while preserving anonymized transaction totals for accounting.',
      businessOutcome:
        'Meets EU GDPR compliance requirements, eliminating potential fine risks up to 4% of annual global turnover.',
      simpleAnalogy:
        'Erasing someone from the phonebook while keeping the receipt of sale with the name blacked out.',
    },
  },
];

export const MEETING_SCENARIO_CASES: MeetingScenarioCase[] = [
  {
    id: 'meeting_handling_interruptions',
    title: 'Regaining the Floor & Facilitating Topic Alignment',
    role: 'facilitator',
    agendaItems: [
      'Review Q3 Architecture Roadmap',
      'Decide on Database Sharding Strategy',
      'Assign Proof-of-Concept Owners',
    ],
    interruptionOrDerailment:
      'A colleague cuts in and starts debating the naming convention of Docker containers for 10 minutes.',
    politeInterventionPhrases: [
      "That's an important detail regarding container standards, but let's capture it in our parking lot so we don't run out of time on our core sharding decision.",
      "I want to make sure we honor everyone's time for the roadmap. Can we return to Alex's point on replication lag?",
      "Let's take container naming offline and close out the sharding decision in the remaining 15 minutes.",
    ],
    modelSummaryNote: {
      summary: 'Squad aligned on adopting horizontal range sharding for the transaction database.',
      decisions: [
        'Approved range sharding architecture with 4 initial partitions',
        'Deferred container naming conventions to DevOps guidelines channel',
      ],
      actionItems: [
        { task: 'Benchmark throughput with 10M records', owner: 'Dev Team', deadline: 'Next Friday' },
        { task: 'Prepare disaster recovery failover doc', owner: 'Alex M.', deadline: 'Oct 15' },
      ],
    },
  },
];

export const ASYNC_COMM_MATRIX_ITEMS: AsyncCommMatrixItem[] = [
  {
    id: 'matrix_quick_clarification',
    scenario: 'You need to know which staging server branch contains the latest UI fixes.',
    recommendedChannel: 'chat',
    rationale: 'Low complexity, quick answer, does not require a paper trail or blocking anyone’s calendar.',
    templateFormat: 'Quick Slack/Teams DM or squad channel mention with specific context.',
    exampleDraft: 'Hey @DevTeam, which staging environment is currently running the UI fixes branch—is it staging-alpha or staging-beta?',
  },
  {
    id: 'matrix_complex_decision_tradeoff',
    scenario: 'Proposing an architectural migration that affects three squads and requires stakeholder budget approval.',
    recommendedChannel: 'document',
    rationale: 'High complexity with deep nuances. Asynchronous written RFC document allows thoughtful review before calling a meeting.',
    templateFormat: 'RFC (Request for Comments) with Context, Alternatives, Costs, Security, and Open Questions.',
    exampleDraft: 'RFC #42: Migrating Authentication from Session Tokens to OAuth2 PKCE. Please review and comment asynchronously by Thursday EOD.',
  },
  {
    id: 'matrix_emergency_production_down',
    scenario: 'Production payment gateway is throwing 500 errors and orders are failing.',
    recommendedChannel: 'meeting',
    rationale: 'Urgent, high-impact situation requiring real-time cross-functional synchronization without latency.',
    templateFormat: 'Immediate war-room video call link posted to #incident-response with incident commander identified.',
    exampleDraft: '🚨 SEV-1 PAYMENT INCIDENT: Checkout gateway error rate at 22%. War-room link: meet.company.com/inc-911. Lead dev and on-call please join.',
  },
  {
    id: 'matrix_formal_client_update',
    scenario: 'Providing quarterly progress and updated deliverables to enterprise corporate client stakeholders.',
    recommendedChannel: 'email',
    rationale: 'External stakeholders, formal accountability, permanent record, and multi-recipient tracking.',
    templateFormat: 'Executive email with bulleted executive summary, milestones accomplished, and attachments.',
    exampleDraft: 'Dear Apex Logistics Leadership, here is our Q3 Executive Progress Report highlighting completed security certifications and next quarter milestones.',
  },
];

export const BRAIN_FREEZE_RECOVERY_PHRASES: BrainFreezeRecoveryPhrase[] = [
  {
    id: 'rec_org_1',
    category: 'organize',
    phrase: 'Let me organize that into two key points.',
    whenToUse: 'When you started talking before structuring your thoughts and want to reset cleanly.',
  },
  {
    id: 'rec_rephrase_1',
    category: 'rephrase',
    phrase: 'Let me rephrase that to make it clearer.',
    whenToUse: 'When you stumble on a convoluted sentence or complex vocabulary.',
  },
  {
    id: 'rec_clarify_1',
    category: 'clarify',
    phrase: 'What I mean specifically is...',
    whenToUse: 'When you notice the listener looks confused or uncertain.',
  },
  {
    id: 'rec_example_1',
    category: 'give_example',
    phrase: 'Let me give you a concrete example to illustrate.',
    whenToUse: 'When an abstract explanation becomes difficult to explain verbally.',
  },
  {
    id: 'rec_restart_1',
    category: 'restart',
    phrase: 'Taking a step back, the core takeaway here is...',
    whenToUse: 'When you have gone off on a tangent and want to return to the executive point.',
  },
];

export const PROFESSIONAL_STORY_TEMPLATES: ProfessionalStoryItem[] = [
  {
    id: 'story_incident_turnaround',
    title: 'Recovering from a High-Pressure Production Outage',
    category: 'challenge_overcome',
    context: 'At my previous role, our payment service suffered a severe bottleneck during Black Friday.',
    challenge: 'Database locks spiked response times from 100ms to 9 seconds, threatening our largest sales day.',
    actionTaken: 'I led emergency triage, identified an unindexed order query, wrote a hotfix migration within 45 minutes, and established canary validation.',
    resultMetric: 'Latency restored to 120ms, preventing an estimated $80,000 in abandoned shopping carts.',
    keyLearning: 'This taught me the value of automated canary testing and pre-scaling connection pools before high-volume commercial events.',
  },
  {
    id: 'story_mentoring_impact',
    title: 'Mentoring Junior Engineers into Independent Contributors',
    category: 'leadership',
    context: 'Our engineering department hired three bootcamp graduates with limited production experience.',
    challenge: 'They were hesitant to push code to production and struggled with our testing harness.',
    actionTaken: 'I established weekly pair-programming sessions, built a step-by-step local development sandbox, and reviewed their PRs with detailed pedagogical feedback.',
    resultMetric: 'Within two months, all three developers were deploying independent PRs with zero critical regressions.',
    keyLearning: 'True senior leadership is measured not by how much code you write personally, but by how effectively you elevate the capability of those around you.',
  },
];

export const DELEGATION_CASES: DelegationCase[] = [
  {
    id: 'del_qa_automation',
    taskTitle: 'Build End-to-End Cypress Tests for Billing Portal',
    assigneeName: 'Priya Sharma',
    assigneeSeniority: 'mid_level',
    objective: 'Automate customer billing invoice download and credit card update tests to eliminate manual QA cycles.',
    expectedOutcome: 'A clean Cypress test suite running inside GitHub Actions with green status on PR builds.',
    hardDeadline: 'Next Wednesday by 4:00 PM before the staging release.',
    guardrails: [
      'Use existing test data fixtures rather than spinning up mock servers.',
      'Check in with me on Friday morning for a 15-minute architecture sanity check.',
    ],
    modelDelegationScript:
      "Hi Priya, I'd like to assign you ownership of our billing portal E2E test automation. The objective is to automate invoice downloads and card updates in Cypress so our squad can deploy without manual verification. We need this integrated into GitHub Actions by next Wednesday 4 PM. Please use our existing test fixtures, and let's schedule a quick 15-minute sync on Friday morning to review your test outline. How does that timeline feel to you?",
  },
];

export const EXECUTIVE_BRIEFING_CASES: ExecutiveBriefingCase[] = [
  {
    id: 'exec_cloud_cost_optimization',
    executiveTitle: 'Chief Technology Officer (CTO)',
    coreSituation: 'Cloud infrastructure spending increased by 35% last month due to uncompressed logging and idle staging clusters.',
    keyPointBLUF: 'Bottom Line Up Front: We can reduce monthly AWS spend by $14,000 without affecting system performance by implementing automated cluster shutdown and log lifecycle rules.',
    businessImpact: 'Saves ~$168,000 annualized and brings infrastructure costs back below our 8% of revenue target.',
    recommendation: 'Adopt Terraform lifecycle rules to turn off staging clusters outside 8 AM–7 PM and transition CloudWatch logs to S3 Glacier after 14 days.',
    decisionNeeded: 'Approval to dedicate 2 engineering days during Sprint 14 to deploy the Terraform cost policies.',
    rapidQuestions: [
      {
        question: "What is the risk to developer velocity if staging clusters turn off at night?",
        idealAnswer: "Zero risk—we've provided a simple Slack bot command that lets any engineer spin up their specific environment in 3 minutes if they need to work late.",
      },
      {
        question: "How soon do we see the financial savings?",
        idealAnswer: "Immediately on the next billing cycle. The day the policy merges, daily spend drops by $450.",
      },
    ],
  },
];

export const INITIAL_MULTI_DAY_SIM_STATE: MultiDaySimState = {
  currentDay: 1,
  simulatedOrgName: 'NovaPay Global Technologies',
  roleTitle: 'Full Stack Engineer',
  teamMembers: [
    { name: 'Sarah Lin', role: 'Engineering Manager', relationshipScore: 80 },
    { name: 'Alex Rivera', role: 'Senior Staff Engineer', relationshipScore: 75 },
    { name: 'Maya Patel', role: 'Product Manager', relationshipScore: 70 },
    { name: 'Jordan Hayes', role: 'Junior Frontend Dev', relationshipScore: 70 },
  ],
  activeSprintTasks: [
    { id: 'task-101', title: 'Onboarding & Local Dev Machine Setup', status: 'in_progress' },
    { id: 'task-102', title: 'Audit Token Refresh API Endpoint', status: 'todo' },
    { id: 'task-103', title: 'Resolve Redis Staging Cache Connection Spike', status: 'todo' },
  ],
  unresolvedBlockers: [],
  recordedDecisions: ['Completed Day 1 security orientation'],
  completedEvents: ['Welcome team introduction in Slack'],
  managerTrustLevel: 78,
  recentFeedback: [
    'Sarah noted: "Clear, humble introduction during the morning sync."',
  ],
};

export const CAREER_GROWTH_TRACKS: CareerGrowthTrack[] = [
  {
    id: 'track_a_new_employee',
    title: 'Track A: New Employee & Onboarding',
    subtitle: 'From Day 1 Introductions to 30-Day Autonomy',
    targetSeniority: 'New Hire / Junior / Fresher',
    keySkills: ['Introductions', 'Asking for Help', 'Task Understanding', 'Standup Delivery'],
    recommendedModules: ['onboarding', 'asking_help', 'standup', 'task_understanding'],
    progressPercent: 35,
  },
  {
    id: 'track_b_pro_comm',
    title: 'Track B: Professional Workplace Communication',
    subtitle: 'Cross-functional alignment, async excellence & status clarity',
    targetSeniority: 'Mid-Level Professional',
    keySkills: ['Status Reporting', 'Deadline Diplomacy', 'Async Matrix', '1:1 Syncs'],
    recommendedModules: ['status_lab', 'deadlines', 'async_matrix', 'one_on_one'],
    progressPercent: 20,
  },
  {
    id: 'track_c_tech_comm',
    title: 'Track C: Technical & Architectural Communication',
    subtitle: 'Bridge engineering complexity with product and business outcomes',
    targetSeniority: 'Software Engineer / Systems Specialist',
    keySkills: ['Tech-to-Non-Tech', 'RFC Writing', 'Code Review Diplomacy', 'Disagreements'],
    recommendedModules: ['bidi_tech', 'disagreement', 'incident_lab'],
    progressPercent: 15,
  },
  {
    id: 'track_d_client_comm',
    title: 'Track D: Client & Customer Communication',
    subtitle: 'Handle demanding enterprise clients, complaints, and requirement gathering',
    targetSeniority: 'Client-Facing Engineer / Consultant / PM',
    keySkills: ['Requirement Gathering', 'De-escalation', 'Demo Presentations', 'Empathy'],
    recommendedModules: ['customer_sim', 'incident_lab', 'bidi_tech'],
    progressPercent: 10,
  },
  {
    id: 'track_e_leadership',
    title: 'Track E: Team Leadership & Delegation',
    subtitle: 'Empower peers, give constructive feedback, and manage change',
    targetSeniority: 'Senior Engineer / Tech Lead',
    keySkills: ['Task Delegation', 'Constructive Feedback', 'Change Management', 'Mentoring'],
    recommendedModules: ['delegation', 'feedback_lab', 'disagreement'],
    progressPercent: 0,
  },
  {
    id: 'track_f_management',
    title: 'Track F: Engineering & People Management',
    subtitle: '1:1 Coaching, performance discussions, workload balance, and retention',
    targetSeniority: 'Engineering Manager / Team Lead',
    keySkills: ['1:1 Navigation', 'Performance Reviews', 'Workload Balancing', 'Conflict Resolution'],
    recommendedModules: ['one_on_one', 'feedback_lab', 'disagreement'],
    progressPercent: 0,
  },
  {
    id: 'track_g_executive_comm',
    title: 'Track G: Executive Briefings & Strategic Influence',
    subtitle: 'Concise BLUF updates, business trade-offs, and rapid CTO Q&A',
    targetSeniority: 'Staff / Principal / Director / VP',
    keySkills: ['BLUF Communication', 'Strategic Trade-offs', 'High-Pressure Q&A', 'Storytelling'],
    recommendedModules: ['exec_briefing', 'storytelling', 'status_lab'],
    progressPercent: 0,
  },
  {
    id: 'track_h_business_comm',
    title: 'Track H: Commercial & Cross-Cultural Mastery',
    subtitle: 'Negotiate deadlines, scope, and collaborate effortlessly across global teams',
    targetSeniority: 'Senior / Specialist / Global Consultant',
    keySkills: ['Principled Negotiation', 'Cross-Cultural Formality', 'Boundary Setting'],
    recommendedModules: ['async_matrix', 'disagreement', 'customer_sim'],
    progressPercent: 0,
  },
];

export const DEFAULT_WORKPLACE_READINESS_DIMENSIONS: WorkplaceReadinessDimension[] = [
  {
    id: 'dim_speaking',
    name: 'Workplace Speaking & Spontaneity',
    category: 'core',
    evidenceCount: 6,
    proficiencyLevel: 'competent',
    strengthSummary: 'Clear standup updates and concise introductions with minimal hesitation.',
    nextFocusArea: 'Practice rapid recovery when interrupted during presentations.',
  },
  {
    id: 'dim_listening',
    name: 'Workplace Listening & Task Extraction',
    category: 'core',
    evidenceCount: 4,
    proficiencyLevel: 'competent',
    strengthSummary: 'Accurately captures deliverables, deadlines, and dependencies from spoken briefings.',
    nextFocusArea: 'Confirm implicit assumptions before executing vague tasks.',
  },
  {
    id: 'dim_writing',
    name: 'Professional Writing & Async Clarity',
    category: 'core',
    evidenceCount: 5,
    proficiencyLevel: 'fluent',
    strengthSummary: 'Strong message structure choosing the right channel for high vs low urgency.',
    nextFocusArea: 'Keep Slack updates even punchier with bulleted executive takeaways.',
  },
  {
    id: 'dim_meetings',
    name: 'Meeting Participation & Facilitation',
    category: 'collaboration',
    evidenceCount: 4,
    proficiencyLevel: 'competent',
    strengthSummary: 'Effective active listening and clear handoffs in sprint ceremonies.',
    nextFocusArea: 'Practice interjecting politely to guide derailed meetings back to the agenda.',
  },
  {
    id: 'dim_manager',
    name: 'Manager Communication & 1:1 Syncs',
    category: 'collaboration',
    evidenceCount: 5,
    proficiencyLevel: 'fluent',
    strengthSummary: 'Proactive early flagging of capacity constraints and honest risk appraisal.',
    nextFocusArea: 'Formulate specific career milestone requests during quarterly check-ins.',
  },
  {
    id: 'dim_client',
    name: 'Client & Stakeholder Communication',
    category: 'collaboration',
    evidenceCount: 3,
    proficiencyLevel: 'emerging',
    strengthSummary: 'Demonstrates professional empathy and transparent delivery estimates.',
    nextFocusArea: 'De-escalate frustrated enterprise customers without over-promising technical fixes.',
  },
  {
    id: 'dim_technical',
    name: 'Technical & Business Translation',
    category: 'advanced',
    evidenceCount: 5,
    proficiencyLevel: 'fluent',
    strengthSummary: 'Excels at explaining caching, databases, and microservices via concrete analogies.',
    nextFocusArea: 'Articulate financial cost impact alongside technical latency numbers.',
  },
  {
    id: 'dim_conflict',
    name: 'Constructive Disagreement & Conflict',
    category: 'advanced',
    evidenceCount: 3,
    proficiencyLevel: 'emerging',
    strengthSummary: 'Separates ideas from people and uses objective metrics to evaluate solutions.',
    nextFocusArea: 'Propose third-path compromises when two senior leads disagree on tooling.',
  },
  {
    id: 'dim_incident',
    name: 'High-Stakes Escalation & Incidents',
    category: 'advanced',
    evidenceCount: 4,
    proficiencyLevel: 'competent',
    strengthSummary: 'Succinct Sev-1 briefings tailored precisely to technical vs customer audiences.',
    nextFocusArea: 'Post-incident root cause documentation with blame-free retrospective tone.',
  },
  {
    id: 'dim_leadership',
    name: 'Leadership & Delegation',
    category: 'leadership',
    evidenceCount: 2,
    proficiencyLevel: 'emerging',
    strengthSummary: 'Sets clear success criteria and boundaries when delegating tasks.',
    nextFocusArea: 'Give feedback using the SBI framework without softening the core takeaway.',
  },
  {
    id: 'dim_executive',
    name: 'Executive Communication & BLUF',
    category: 'leadership',
    evidenceCount: 3,
    proficiencyLevel: 'competent',
    strengthSummary: 'Delivers Bottom-Line-Up-Front updates with concrete decision asks.',
    nextFocusArea: 'Handle unexpected CTO curveball questions with structured composure.',
  },
  {
    id: 'dim_growth',
    name: 'Career Advocacy & Storytelling',
    category: 'leadership',
    evidenceCount: 3,
    proficiencyLevel: 'competent',
    strengthSummary: 'Constructs compelling CARL stories (Context, Action, Result, Learning).',
    nextFocusArea: 'Advocate for promotions based on quantified team impact rather than tenure.',
  },
];
