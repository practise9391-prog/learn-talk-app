// Part 19: Professional English Lab Production Dataset
import {
  SimulatedOrganization,
  SimulatedProjectState,
  WorkdayScenario,
  EmailThreadCase,
  ChatThreadCase,
  MeetingEpisode,
  PresentationLabCase,
  DecisionLabCase,
  IncidentCase,
  BusinessCaseStudy,
  ReadinessScoreRecord,
} from '../types/proLab';

export const SIMULATED_ORGANIZATIONS: SimulatedOrganization[] = [
  {
    id: 'novapay',
    name: 'NovaPay Financial Services (Fictional)',
    industry: 'Fintech & Payment Infrastructure',
    department: 'Digital Wallet Engineering',
    culture: 'High compliance, audit-heavy, precise communication',
    communicationStyle: 'concise_async',
  },
  {
    id: 'apex_health',
    name: 'Apex Health Systems (Fictional)',
    industry: 'Health Tech & Telemedicine',
    department: 'Patient Experience Platform',
    culture: 'Patient-centric, cross-functional collaboration, empathetic tone',
    communicationStyle: 'collaborative_warm',
  },
  {
    id: 'cloudscale',
    name: 'CloudScale Networks (Fictional)',
    industry: 'Enterprise Cloud & DevOps',
    department: 'Global Gateway Infrastructure',
    culture: 'Fast-paced, data-oriented, SLA-critical',
    communicationStyle: 'formal_hierarchical',
  },
];

export const INITIAL_PROJECT_STATE: SimulatedProjectState = {
  id: 'proj_paystream',
  name: 'PayStream 2.0 Real-Time Settlement Engine',
  objective: 'Migrate legacy batch settlement to sub-second payment ledger across 4 partner banks.',
  deadline: 'October 28 (Sprint 6 Release)',
  currentSprint: 'Sprint 5 — Day 7',
  team: [
    { name: 'Dave Reynolds', role: 'Engineering Manager' },
    { name: 'Maya Chen', role: 'Staff Backend Engineer' },
    { name: 'Tariq Al-Mansoor', role: 'Lead QA Automation Engineer' },
    { name: 'Amanda Vance', role: 'Enterprise Client Success Director' },
    { name: 'Jordan Cole', role: 'VP of Product & Engineering' },
  ],
  tasks: [
    { id: 't1', title: 'Webhook retry backoff logic', status: 'completed' },
    { id: 't2', title: 'Partner Bank API latency optimization', status: 'in_progress' },
    { id: 't3', title: 'End-to-end reconciliation regression suite', status: 'blocked' },
    { id: 't4', title: 'Executive BLUF rollout summary', status: 'in_progress' },
  ],
  knownRisks: [
    'Partner Bank Alpha sandbox has intermittent 504 timeouts.',
    'Schema migration requires 15-minute maintenance window on weekend.',
  ],
  unresolvedIssues: [
    'Need approval on SLA penalty exception clause from legal.',
  ],
  clientRequests: [
    'Enterprise client requested automated daily CSV export feature.',
  ],
  recordedDecisions: [
    'Decided to throttle sync batches to 500 tx/sec to prevent downstream lock contention.',
  ],
};

export const WORKDAY_SCENARIOS: WorkdayScenario[] = [
  {
    id: 'workday_novapay_launch',
    title: 'A High-Stakes Day at NovaPay: Countdown to Launch',
    organization: SIMULATED_ORGANIZATIONS[0],
    initialProjectState: INITIAL_PROJECT_STATE,
    stages: [
      {
        id: 'stage_1_standup',
        timeSlot: '9:00 AM',
        stageType: 'standup',
        title: 'Morning Standup: Daily Sync with Backend Lead Maya',
        interlocutor: {
          name: 'Maya Chen',
          role: 'Staff Backend Engineer',
        },
        contextPrompt:
          'It is 9:00 AM. Maya is running the 10-minute standup. You need to report: what you wrapped up yesterday, what you are tackling today, and the blocker regarding Bank Alpha 504 timeouts.',
        initialDialogue:
          'Morning everyone! Let’s keep standup crisp. You are up next—give us yesterday’s progress, today’s focus, and any blockers.',
        guidingTips: [
          'State completed work concisely (e.g. "Yesterday, I finalized...").',
          'Clarify today’s core deliverable.',
          'State the blocker with clear ownership (who is helping or what needs unblocking).',
        ],
        modelResponse:
          'Yesterday, I completed the webhook retry backoff logic and pushed the PR for review. Today, I am optimizing the partner bank API connection pool. My only blocker is intermittent 504 timeouts on the Bank Alpha sandbox, which is currently stalling Tariq’s regression tests. I have pinged their tech contact and will follow up if unaddressed by 11:00 AM.',
        requiredElements: ['yesterday work', 'today focus', 'blocker status', 'owner/timeline'],
      },
      {
        id: 'stage_2_manager_sync',
        timeSlot: '10:30 AM',
        stageType: 'manager_sync',
        title: 'Manager 1-on-1: Scope Trade-off with Dave Reynolds',
        interlocutor: {
          name: 'Dave Reynolds',
          role: 'Engineering Manager',
        },
        contextPrompt:
          'Dave calls you into a quick sync. He heard about the Bank Alpha blocker and asks if we should push back the sprint deadline or cut the automated CSV export requested by the enterprise client.',
        initialDialogue:
          'Hey, I caught your standup update. If Bank Alpha stays flaky, we cannot run full regression and build the CSV export simultaneously. What is your recommendation? Do we push the release date or descope the CSV export?',
        choiceBranches: [
          {
            id: 'branch_descope',
            label: 'Recommend Descoping CSV Export to Sprint 7',
            summary: 'Protect the core ledger security and milestone deadline by deferring the secondary CSV export.',
            aiReaction: 'Good call. Security and ledger integrity must come first. Let’s protect the core launch.',
            impactOnProject: 'Release date preserved. CSV export moved to backlog item.',
            consequenceLevel: 'positive',
          },
          {
            id: 'branch_delay',
            label: 'Recommend Pushing Release Date by 1 Week',
            summary: 'Deliver 100% of the requested features including the client CSV export, at the cost of a delayed date.',
            aiReaction: 'Understood, but our leadership and the client may push back heavily on shifting the keynote release date.',
            impactOnProject: 'Timeline pushed to Nov 4. Leadership requires formal risk justification.',
            consequenceLevel: 'friction',
          },
        ],
        guidingTips: [
          'Give your recommendation upfront (BLUF).',
          'Explain the trade-off clearly (reliability vs non-essential feature).',
          'Propose the immediate next action.',
        ],
        modelResponse:
          'I recommend descoping the automated CSV export to Sprint 7 and holding our October 28 release date. The core settlement ledger and security protocols cannot be compromised, whereas the client can manually trigger manual exports in the interim. If you agree, I will notify Tariq so QA focuses exclusively on core settlement paths.',
        requiredElements: ['clear recommendation', 'trade-off rationale', 'next action'],
      },
      {
        id: 'stage_3_chat_thread',
        timeSlot: '1:00 PM',
        stageType: 'chat_thread',
        title: '#launch-war-room: Coordinating with QA Lead Tariq',
        interlocutor: {
          name: 'Tariq Al-Mansoor',
          role: 'Lead QA Automation Engineer',
        },
        contextPrompt:
          'Tariq pings the public war room channel: "Hey team, Bank Alpha sandbox is back online! Should I start the full regression suite now, or are there new PRs waiting to be merged?"',
        initialDialogue:
          '@channel Bank Alpha sandbox just recovered. I have the automated regression suite staged. Are we ready to kick it off, or is anyone touching the ledger service right now?',
        guidingTips: [
          'Be crisp and tag the right people.',
          'Confirm status of merged code.',
          'State when regression can start and expected runtime.',
        ],
        modelResponse:
          '@tariq PR #412 with the connection pool fix is merged and deployed to staging. No further ledger modifications are in flight today. You have a green light to initiate the full regression run now. Keep us posted if any test cases fail.',
        requiredElements: ['clear status confirmation', 'actionable green light', 'follow-up expectation'],
      },
      {
        id: 'stage_4_client_call',
        timeSlot: '2:30 PM',
        stageType: 'client_call',
        title: 'Client Stakeholder Sync: Addressing the Delayed CSV Feature',
        interlocutor: {
          name: 'Amanda Vance',
          role: 'Enterprise Client Success Director',
        },
        contextPrompt:
          'Amanda from the client side is on the line. She was informed that the automated CSV export is being postponed. She is frustrated and questions the engineering team’s delivery commitment.',
        initialDialogue:
          'We were promised that the daily automated CSV export would be in this release. Our finance department relies on that data every morning. Why was this suddenly pulled, and how are we supposed to reconcile accounts without it?',
        guidingTips: [
          'Acknowledge and validate her concern first without making defensive excuses.',
          'Explain the reason in terms of financial data safety and transaction reliability.',
          'Offer an immediate, workable interim solution.',
          'Recommit to a firm delivery timeline for the automated version.',
        ],
        modelResponse:
          'Amanda, I completely understand your frustration. Reliable reconciliation is critical for your finance team, and I appreciate why this feels disruptive. Our priority for this release is ensuring zero dropped transactions and total data integrity across the partner bank ledger. To ensure your finance team is not blocked, we have enabled on-demand one-click CSV downloads in the dashboard today, and we are committing to full automated daily delivery in Sprint 7 on November 10th. Would a 10-minute walkthrough with your finance lead this afternoon help ensure smooth operation?',
        requiredElements: ['empathy/validation', 'security/reliability rationale', 'interim workaround', 'firm next date'],
      },
      {
        id: 'stage_5_incident_alert',
        timeSlot: '3:45 PM',
        stageType: 'incident_alert',
        title: 'Incident Room: Sudden Staging Memory Spike',
        interlocutor: {
          name: 'Maya Chen',
          role: 'Staff Backend Engineer',
        },
        contextPrompt:
          'During Tariq’s regression test, the staging container memory spiked to 92%. A junior dev suggests restarting all services immediately. You need to broadcast a calm, structured status update to the incident channel.',
        initialDialogue:
          'Memory is climbing past 90% on staging node 2 during the 500 tx/sec load test! Junior dev suggested killing the pods. What should we broadcast to the engineering channel?',
        guidingTips: [
          'Follow: Facts Known -> What is Under Investigation -> Immediate Action -> Next Update Time.',
          'Differentiate what you KNOW from what you SUSPECT.',
          'Avoid sensational language or knee-jerk restarts that erase diagnostic logs.',
        ],
        modelResponse:
          '**[STAGING NOTICE — HIGH MEMORY UTILIZATION]**\n- **Facts Known**: Memory reached 92% on staging node 2 during the 500 tx/sec settlement load test. No user transactions dropped.\n- **Under Investigation**: Heap dump is being generated to identify if this is a connection pool leak or garbage collection delay.\n- **Immediate Action**: Paused load generation; keeping container alive to preserve profiling memory dumps. Do not restart pods.\n- **Next Update**: 4:15 PM or upon heap analysis completion.',
        requiredElements: ['facts known', 'under investigation', 'action taken', 'next update time'],
      },
      {
        id: 'stage_6_end_of_day_update',
        timeSlot: '5:00 PM',
        stageType: 'end_of_day_update',
        title: 'Executive End-of-Day Briefing for VP Jordan Cole',
        interlocutor: {
          name: 'Jordan Cole',
          role: 'VP of Product & Engineering',
        },
        contextPrompt:
          'It is 5:00 PM. Jordan Cole requests a 60-second summary before the executive committee meeting tonight. Summarize the day’s achievements, risks mitigated, and the launch readiness outlook for October 28.',
        initialDialogue:
          'I am walking into the leadership meeting in 3 minutes. Give me the high-level takeaway: where do we stand on the PayStream 2.0 October 28 release after today’s events?',
        guidingTips: [
          'Bottom Line Up Front: Confirm on-track status.',
          'Highlight major risk mitigated (Bank Alpha & memory diagnosis).',
          'Note client alignment achieved.',
          'Close with clear confidence statement.',
        ],
        modelResponse:
          'Jordan, the bottom line is we remain on track for the October 28 release. Today we resolved the Bank Alpha connectivity blocker, kicked off regression testing, and identified a connection pool tuning fix for staging memory. We also aligned with Amanda’s team on an interim manual export to protect our deadline without disrupting their finance operations. All high-priority ledger paths are green, and we have zero critical blockers heading into tomorrow.',
        requiredElements: ['BLUF status', 'key milestones achieved', 'risks handled', 'confidence summary'],
      },
    ],
  },
];

export const EMAIL_THREAD_CASES: EmailThreadCase[] = [
  {
    id: 'email_case_batch_latency',
    title: 'Batch Processing Latency & SLA Inquiry',
    category: 'client_concern',
    scenarioDescription:
      'Marcus Brody, CTO of partner client Horizon Logistics, noticed that recent nightly batch settlements took 42 minutes instead of the contractual 30 minutes. He is asking for an explanation and confirmation that SLA penalties will not apply.',
    participants: [
      { name: 'Marcus Brody', role: 'CTO, Horizon Logistics', email: 'mbrody@horizonlogistics.com' },
      { name: 'You', role: 'Technical Account Lead', email: 'you@novapay.com' },
      { name: 'Dave Reynolds', role: 'Engineering Manager', email: 'dreynolds@novapay.com' },
    ],
    initialThread: [
      {
        id: 'm1',
        sender: 'Marcus Brody',
        senderEmail: 'mbrody@horizonlogistics.com',
        recipient: 'you@novapay.com',
        timestamp: 'Oct 3, 2026, 08:30 AM',
        subject: 'URGENT: Settlement Batch SLA Breach (Oct 2 Run)',
        body:
          'Hello,\n\nOur data pipeline monitors reported that last night’s settlement batch finished at 03:42 AM, taking 42 minutes total. Under Section 4.2 of our Master Services Agreement, batch processing must complete within 30 minutes.\n\nCould you please explain what caused this delay, whether tonight’s run will be impacted, and what corrective actions have been applied?\n\nBest regards,\nMarcus Brody\nCTO, Horizon Logistics',
        isLearner: false,
      },
    ],
    learnerTask:
      'Draft a professional, accountability-driven reply to Marcus addressing the cause, tonight’s expectation, and mitigation actions.',
    keyRequirements: [
      'Acknowledge the 42-minute run factually without defensive excuses.',
      'Explain the root cause clearly (e.g., database index rebuilding maintenance).',
      'Provide assurance and exact timing expectations for tonight’s batch.',
      'Detail the permanent safeguard implemented.',
    ],
    modelReply:
      'Hi Marcus,\n\nThank you for reaching out, and I appreciate you bringing this to our attention. You are correct that last night’s batch settlement ran for 42 minutes, exceeding our 30-minute target.\n\nOur engineering team investigated this immediately. The delay was caused by an unindexed table scan triggered after an automated index maintenance job ran concurrently with the batch window. No transactions were dropped or corrupted.\n\nTo ensure this does not recur:\n1. We have rescheduled all background index maintenance outside the settlement processing window.\n2. We optimized query indexing, which reduced test replay runtimes back down to 19 minutes.\n3. We added dedicated threshold alerts at the 20-minute mark to notify on-call engineers proactively.\n\nTonight’s batch will execute under these safeguards, and we expect completion well within the 30-minute threshold. I will review tomorrow morning’s report personally and email you the execution metrics by 8:00 AM.\n\nPlease let me know if you would like a brief sync today to review the telemetry.\n\nBest regards,\nYour Name\nTechnical Account Lead, NovaPay',
    simulatedFollowUpReply:
      'Thanks for the transparent and rapid response. The root cause and safeguards make sense. Please send through tomorrow morning’s telemetry as promised. Good luck with tonight’s run.',
  },
];

export const CHAT_THREAD_CASES: ChatThreadCase[] = [
  {
    id: 'chat_case_code_freeze',
    channelName: '#releases-q4',
    channelTopic: 'Release coordination, code freezes, and production readiness checks',
    situation:
      'Code freeze is scheduled for 5:00 PM today. At 3:15 PM, you discovered an edge-case bug in the user billing recalculation that affects approximately 0.5% of accounts. You need to communicate with the release manager Elena.',
    messages: [
      {
        id: 'c1',
        sender: 'Elena Rostova',
        role: 'Release Manager',
        avatarColor: 'bg-indigo-500',
        timestamp: '3:10 PM',
        content: '@channel Reminder: Final code freeze for v4.2 is at 5:00 PM sharp. Please ensure all approved PRs are merged by 4:30 PM.',
      },
    ],
    learnerGoal:
      'Post a concise, high-signal message alerting Elena to the billing edge case, proposing a rapid hotfix PR, and specifying whether freeze needs to be held.',
    quickReplyOptions: [
      'Flag edge case with PR link + propose 30-minute test window',
      'Request full freeze postponement until tomorrow',
      'Silently patch it after code freeze without informing channel',
    ],
    recommendedBestPractice:
      'Provide: 1. Specific defect summary, 2. Quantified impact (0.5% accounts), 3. Proposed resolution (PR ready by 4:00 PM), 4. Recommendation on whether to hold freeze.',
  },
];

export const MEETING_EPISODES: MeetingEpisode[] = [
  {
    id: 'meeting_sprint_risk_review',
    seriesId: 'series_paystream_migration',
    episodeNumber: 1,
    title: 'PayStream 2.0 — Architecture & Milestone Risk Review',
    objective: 'Review critical path dependencies, reach consensus on third-party API timeout policies, and assign action items.',
    participants: ['Dave Reynolds (EM)', 'Maya Chen (Staff Eng)', 'Tariq Al-Mansoor (QA)', 'You (Lead)'],
    audioTranscript: [
      {
        speaker: 'Dave Reynolds',
        text: 'Thanks for jumping on quickly everyone. Our main goal today is settling how we handle bank timeouts during payment settlement. Maya, what did the bench tests show?',
      },
      {
        speaker: 'Maya Chen',
        text: 'If the bank API does not respond within 3 seconds, holding the user thread open causes cascading thread starvation. I propose a hard 2.5-second timeout followed by pushing to an asynchronous reconciliation queue.',
      },
      {
        speaker: 'Tariq Al-Mansoor',
        text: 'I agree, but QA needs mock test harnesses to simulate the async queue edge cases. If Maya can get the mock contracts ready by Wednesday afternoon, my team can validate by Thursday evening.',
      },
      {
        speaker: 'Dave Reynolds',
        text: 'That works. Let’s make that a formal decision: 2.5-second hard timeout with async queue. You will draft the updated architectural specification doc, and Tariq will deliver the test verification report on Thursday. Let’s ensure meeting minutes capture this.',
      },
    ],
    keyDecisionsMade: [
      'Approved 2.5-second hard timeout for bank APIs with automatic routing to async reconciliation queue.',
      'Confirmed QA test harness readiness dependent on Wednesday mock contracts.',
    ],
    actualActionItems: [
      { owner: 'Maya Chen', task: 'Deliver async queue mock API contracts', deadline: 'Wednesday 3:00 PM' },
      { owner: 'You', task: 'Update architectural specification document with timeout policy', deadline: 'Wednesday 5:00 PM' },
      { owner: 'Tariq Al-Mansoor', task: 'Complete async queue validation and test verification report', deadline: 'Thursday 6:00 PM' },
    ],
    unresolvedQuestions: [
      'How will customer support notify users whose transactions are routed to the async queue?',
    ],
  },
];

export const PRESENTATION_LAB_CASES: PresentationLabCase[] = [
  {
    id: 'pres_microservice_overview',
    title: 'Enterprise Microservice Ledger: Migration & Security Architecture',
    targetDurationMinutes: 5,
    audienceContext: 'Audience includes senior engineers, security officers, and the VP of Infrastructure.',
    slides: [
      {
        slideNumber: 1,
        title: 'Executive Summary & Legacy Limitations',
        keyBullets: [
          'Current monolithic ledger processes $12M daily with 99.4% uptime.',
          'Database locks cause 400ms peak latency bottlenecks.',
          'PayStream 2.0 distributes ledger across 3 isolated cloud regions.',
        ],
        speakerNotes:
          'Open with the business impact: our current revenue run-rate cannot tolerate 400ms latency spikes during holiday surges. Transition directly to distributed ledger architecture.',
        modelAudioTranscript:
          'Good morning everyone. Today I am presenting our architectural roadmap for PayStream 2.0. As our transaction volume approaches $12 million daily, our legacy monolithic ledger is encountering physical scaling boundaries. By decomposing this into distributed event-driven services, we eliminate single points of failure and reduce peak latency by 75%.',
      },
      {
        slideNumber: 2,
        title: 'Data Consistency & Idempotency Safeguards',
        keyBullets: [
          'Distributed consensus via Raft protocol.',
          'UUIDv4 idempotency keys prevent duplicate transaction processing.',
          'Automated dead-letter queue with sub-minute alert dispatch.',
        ],
        speakerNotes:
          'Reassure security and compliance officers about transaction duplication prevention. Highlight idempotency keys as the cornerstone.',
        modelAudioTranscript:
          'The primary concern in any distributed financial system is consistency. We have engineered two strict safeguards: first, strict idempotency enforcement via unique client transaction keys, ensuring zero double-charging; second, an automated dead-letter queue that flags any reconciliation discrepancy within 30 seconds.',
      },
    ],
    qaQuestions: [
      {
        id: 'q1',
        interviewerRole: 'Chief Security Officer',
        question: 'What happens if a rogue client sends the exact same idempotency key with different payload amounts?',
        questionIntent: 'Testing your understanding of payload hash validation and security boundaries.',
        uncertaintyHandlingTips: [
          'State clearly that payloads are cryptographically hashed against the key.',
          'If unsure of the exact HTTP error code, state: "The system flags the hash mismatch immediately; let me confirm whether it returns 400 or 409 and document it in today’s notes."',
        ],
        modelAnswer:
          'We compute a SHA-256 hash of the transaction body and store it alongside the idempotency key in Redis. If a request arrives with an existing key but a differing hash, the API rejects it with an Idempotency Conflict error (409) and logs an audit security event.',
        modelUncertaintyAnswer:
          'The core architecture validates that the payload hash strictly matches the stored key. While I know we reject mismatched payloads immediately to prevent tampering, let me double-check with the security team on our exact telemetry alerting threshold and follow up with you by 3:00 PM.',
      },
    ],
  },
];

export const DECISION_LAB_CASES: DecisionLabCase[] = [
  {
    id: 'decision_friday_release',
    situationTitle: 'Critical Security Vulnerability vs Friday 4:30 PM Release',
    dilemmaContext:
      'A third-party library patch addressing a moderate CVE security advisory was released at 3:30 PM on Friday. The marketing team has planned a customer announcement for Monday morning 9:00 AM. Pushing the patch now carries a 15% risk of deployment instability over the weekend.',
    stakeholdersInvolved: ['Security Lead', 'Marketing VP', 'DevOps On-Call', 'You'],
    urgency: 'high',
    approaches: [
      {
        id: 'app_proactive_delay',
        approachName: 'Deploy to Staging Now, Promote to Prod Monday 7:00 AM',
        rationale: 'Protect weekend operational stability while ensuring full automated testing before Monday launch.',
        pros: 'Avoids weekend on-call pager fatigue, eliminates risk of blind production failure.',
        cons: 'Requires 6:30 AM engineer availability Monday morning.',
        recommendedPhrasing:
          'I propose deploying and soak-testing the security patch on Staging throughout the weekend, then promoting to Production at 7:00 AM Monday prior to the 9:00 AM marketing announcement.',
      },
      {
        id: 'app_rush_friday',
        approachName: 'Push Direct to Production Friday at 5:00 PM',
        rationale: 'Zero exposure window over the weekend.',
        pros: 'Immediate closure of CVE vulnerability.',
        cons: 'High risk of weekend downtime with minimal staff available.',
        recommendedPhrasing:
          'We can deploy immediately at 5:00 PM if all on-call engineers agree to remain online for a 2-hour monitoring window.',
      },
    ],
    bestPracticeGuidance:
      'In professional communication, the best engineers balance technical safety with business priorities by proposing balanced mitigation rather than rigid ultimatums.',
  },
];

export const INCIDENT_CASES: IncidentCase[] = [
  {
    id: 'inc_payment_timeout',
    title: 'Incident 4091: Bank Alpha Settlement Gateway Timeout',
    severity: 'P1 - Critical Outage',
    factsKnown: [
      'Inbound payments via Bank Alpha are failing with 504 Gateway Timeout since 14:12 UTC.',
      'Volume affected: ~1,200 pending transactions ($340,000 in transit).',
      'Bank Alpha status page confirms upstream maintenance degradation.',
    ],
    factsUnderInvestigation: [
      'Whether pending transactions were debited on the user side before the timeout occurred.',
      'Exact estimated restoration time from Bank Alpha engineering.',
    ],
    impactSummary: 'Users attempting checkout via Bank Alpha see a "Transaction Processing" spinner.',
    currentMitigation:
      'Rerouted new checkouts to Bank Beta fallback rail. Suspended automated retries to prevent duplicate holds.',
    modelBroadcastMessage:
      '**[INCIDENT UPDATE #1 — P1 PAYMENT GATEWAY TIMEOUT]**\n- **Impact**: Inbound transactions via Bank Alpha experiencing timeouts since 14:12 UTC (~1,200 transactions affected). Other payment methods operate normally.\n- **What We Know**: Upstream Bank Alpha infrastructure is degraded per their status page. No customer duplicate charges identified.\n- **What We Are Investigating**: Reconciliation status of in-flight pending authorizations.\n- **Action Underway**: New checkout volume rerouted to Bank Beta fallback rail. Automated retries throttled.\n- **Next Update**: 15:00 UTC or upon status change.',
    pitfallsToAvoid: [
      'Do not say "The system is totally broken" or "Bank Alpha destroyed our service".',
      'Do not guarantee "This will be fixed in 5 minutes" before upstream confirms.',
      'Do not speculate on financial losses without verified audit logs.',
    ],
  },
];

export const BUSINESS_CASE_STUDIES: BusinessCaseStudy[] = [
  {
    id: 'case_churn_reduction',
    title: 'Reducing 32% First-Month Drop-off for NovaPay Business Accounts',
    companyContext: 'NovaPay onboarded 10,000 small business merchants last quarter, but 3,200 stopped transacting within 30 days.',
    symptom: 'Merchants sign up, complete KYC, but abandon the platform before processing their 5th transaction.',
    dataPoints: [
      '68% of churned merchants reported difficulty integrating the API webhook within 48 hours.',
      'Support ticket response time for integration questions averaged 26 hours.',
      'Merchants who attended an interactive 15-minute onboarding demo had an 88% 90-day retention rate.',
    ],
    coreProblemQuestion: 'How should engineering, product, and developer relations restructure the onboarding experience to cut churn by half?',
    frameworkSteps: [
      '1. Problem Definition & Metric Baseline',
      '2. Root Cause Analysis (Friction Points)',
      '3. Strategic Options Evaluation',
      '4. Recommended Phased Implementation',
      '5. Risk Assessment & Resource Allocation',
      '6. Success Metrics & Telemetry Tracking',
    ],
    modelRecommendationSummary:
      'Recommend launching a "Zero-Friction Developer Kickstart" initiative: 1) Replace raw API documentation with interactive sandbox recipes reducing initial setup from 4 hours to 15 minutes; 2) Implement automated webhook simulation testing in dashboard; 3) Reassign two technical support engineers to a dedicated sub-2-hour SLA onboarding queue. Expected impact: decrease 30-day merchant churn from 32% to under 16% within two quarters.',
  },
];

export const INITIAL_READINESS_SCORES: ReadinessScoreRecord[] = [
  { dimension: 'speaking_fluency', label: 'Speaking Fluency & Pacing', score: 84, evidenceCount: 16, benchmarkTarget: 85, summary: 'Consistent delivery with low filler words; natural cadence in status updates.' },
  { dimension: 'listening_comprehension', label: 'Listening & Action Extraction', score: 88, evidenceCount: 12, benchmarkTarget: 85, summary: 'Accurately captures nuanced requirements and non-obvious constraints in meetings.' },
  { dimension: 'professional_writing', label: 'Executive & Email Writing', score: 82, evidenceCount: 14, benchmarkTarget: 80, summary: 'Clear BLUF structure, professional sign-offs, and explicit ownership dates.' },
  { dimension: 'workplace_clarity', label: 'Workplace & Standup Clarity', score: 90, evidenceCount: 22, benchmarkTarget: 85, summary: 'High-signal daily reporting, crisp blockers, and accountability.' },
  { dimension: 'meeting_participation', label: 'Meeting Leadership & Minutes', score: 79, evidenceCount: 9, benchmarkTarget: 80, summary: 'Strong meeting contributions; minutes could capture unresolved risks faster.' },
  { dimension: 'presentation_delivery', label: 'Technical Presentations & Slides', score: 81, evidenceCount: 7, benchmarkTarget: 80, summary: 'Engaging narrative flow; manages slide timing effectively.' },
  { dimension: 'client_communication', label: 'Client Facing & De-escalation', score: 76, evidenceCount: 11, benchmarkTarget: 80, summary: 'Good empathy; continue refining immediate interim workaround framing.' },
  { dimension: 'technical_explanation', label: 'Multi-Level Tech Explanations', score: 87, evidenceCount: 19, benchmarkTarget: 85, summary: 'Adapts architecture concepts smoothly across non-technical and executive audiences.' },
  { dimension: 'leadership_influence', label: 'Leadership & Conflict Mediation', score: 78, evidenceCount: 8, benchmarkTarget: 80, summary: 'Applies 6-step mediation protocol well; balances technical vs business priorities.' },
  { dimension: 'crisis_composure', label: 'Incident & Crisis Composure', score: 85, evidenceCount: 10, benchmarkTarget: 85, summary: 'Distinguishes facts from speculation calmly during high-pressure outages.' },
];
