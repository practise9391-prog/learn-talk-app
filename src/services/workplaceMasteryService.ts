import {
  AskingForHelpScenario,
  TaskUnderstandingCase,
  StandupDrill,
  ProjectStatusCase,
  FeedbackCase,
  DisagreementConflictCase,
  ExecutiveBriefingCase,
  MultiDaySimState,
  WorkplaceProfile,
  WorkplaceReadinessDimension,
} from '../types/workplaceMastery';

export interface EvaluationResult {
  score: number;
  isPassed: boolean;
  structureCheck: {
    label: string;
    passed: boolean;
    feedback: string;
  }[];
  overallFeedback: string;
  betterAlternative: string;
}

export const workplaceMasteryService = {
  // 1. Evaluate Asking For Help (4-Part Structure)
  evaluateHelpRequest(
    userText: string,
    scenario: AskingForHelpScenario
  ): EvaluationResult {
    const textLower = userText.toLowerCase();

    // Check Context
    const hasContext =
      textLower.includes('working on') ||
      textLower.includes('seeing') ||
      textLower.includes('staging') ||
      textLower.includes('problem') ||
      textLower.includes('issue') ||
      textLower.includes('import') ||
      textLower.length > 25;

    // Check What I Tried
    const hasTried =
      textLower.includes('tried') ||
      textLower.includes('checked') ||
      textLower.includes('verified') ||
      textLower.includes('reduced') ||
      textLower.includes('tested') ||
      textLower.includes('looked at');

    // Check What I Don't Understand / What's Missing
    const hasUnclear =
      textLower.includes('not sure') ||
      textLower.includes("don't understand") ||
      textLower.includes('wondering') ||
      textLower.includes('still') ||
      textLower.includes('why') ||
      textLower.includes('ignoring');

    // Check Specific Question / Polite Ask
    const hasSpecificAsk =
      textLower.includes('could you') ||
      textLower.includes('would you') ||
      textLower.includes('do you have') ||
      textLower.includes('help me') ||
      textLower.includes('point me') ||
      textLower.includes('?');

    const checks = [
      {
        label: 'Context Provided',
        passed: hasContext,
        feedback: hasContext
          ? 'Clear technical background provided.'
          : 'Missing concrete background on what environment or task you are working on.',
      },
      {
        label: '"What I Tried" Stated',
        passed: hasTried,
        feedback: hasTried
          ? 'Great job explaining the debugging or research steps you already performed.'
          : 'Always state what you already investigated so colleagues know you did your initial homework.',
      },
      {
        label: 'Root Uncertainty Articulated',
        passed: hasUnclear,
        feedback: hasUnclear
          ? 'Clearly highlighted the exact gap in understanding.'
          : 'State specifically what part of the system or behavior does not make sense.',
      },
      {
        label: 'Actionable Question & Low Friction',
        passed: hasSpecificAsk,
        feedback: hasSpecificAsk
          ? 'Polite, specific question that makes it effortless for them to reply.'
          : 'End with a crisp, low-friction question (e.g., "Do you have 5 minutes to point me in the right direction?").',
      },
    ];

    const passedCount = checks.filter((c) => c.passed).length;
    const score = Math.round((passedCount / checks.length) * 100);

    return {
      score,
      isPassed: score >= 75,
      structureCheck: checks,
      overallFeedback:
        score >= 75
          ? 'Outstanding workplace help request! It respects your colleague’s time while conveying deep professionalism.'
          : 'Good effort. Strengthen your message by explicitly detailing what you already tried before posing the question.',
      betterAlternative: scenario.modelAnswer,
    };
  },

  // 2. Evaluate Task Understanding Confirmation
  evaluateTaskConfirmation(
    userText: string,
    caseData: TaskUnderstandingCase
  ): EvaluationResult {
    const textLower = userText.toLowerCase();

    const mentionsDeliverable =
      textLower.includes('gateway') ||
      textLower.includes('jwt') ||
      textLower.includes('token') ||
      textLower.includes('session') ||
      textLower.includes('endpoint');

    const mentionsDeadline =
      textLower.includes('thursday') ||
      textLower.includes('sprint') ||
      textLower.includes('deadline');

    const mentionsDependency =
      textLower.includes('mobile') ||
      textLower.includes('backward') ||
      textLower.includes('compatibility') ||
      textLower.includes('team');

    const hasConfirmationTone =
      textLower.includes('confirm') ||
      textLower.includes('make sure') ||
      textLower.includes('understand') ||
      textLower.includes('recap');

    const checks = [
      {
        label: 'Deliverable Identified',
        passed: mentionsDeliverable,
        feedback: mentionsDeliverable
          ? 'Accurately recognized the core technical deliverable.'
          : 'Did not clearly state the key endpoint/JWT deprecation goal.',
      },
      {
        label: 'Timeline & Deadline Confirmed',
        passed: mentionsDeadline,
        feedback: mentionsDeadline
          ? 'Correctly noted the Thursday sprint deadline.'
          : 'Did not reference the sprint completion cutoff.',
      },
      {
        label: 'Dependencies & Risks Flagged',
        passed: mentionsDependency,
        feedback: mentionsDependency
          ? 'Flagged the crucial mobile app backward compatibility requirement.'
          : 'Missed the dependency on syncing with the mobile squad.',
      },
      {
        label: 'Professional Confirmation Opening',
        passed: hasConfirmationTone,
        feedback: hasConfirmationTone
          ? 'Used effective confirmation framing ("Just to confirm...").'
          : 'Start with explicit paraphrasing such as "Just to confirm I have the full picture...".',
      },
    ];

    const passedCount = checks.filter((c) => c.passed).length;
    const score = Math.round((passedCount / checks.length) * 100);

    return {
      score,
      isPassed: score >= 75,
      structureCheck: checks,
      overallFeedback:
        score >= 75
          ? 'Superb active listening! Paraphrasing manager instructions eliminates costly rework.'
          : 'Ensure all 3 key parameters (deliverable, timeline, dependencies) are echoed back.',
      betterAlternative: caseData.sampleConfirmationPhrasing,
    };
  },

  // 3. Evaluate Standup Update (Yesterday, Today, Blockers)
  evaluateStandup(userText: string, drill: StandupDrill): EvaluationResult {
    const textLower = userText.toLowerCase();

    const hasYesterday =
      textLower.includes('yesterday') ||
      textLower.includes('finished') ||
      textLower.includes('completed') ||
      textLower.includes('wrapped up');

    const hasToday =
      textLower.includes('today') ||
      textLower.includes('working on') ||
      textLower.includes('focusing on') ||
      textLower.includes('pairing');

    const hasBlockers =
      textLower.includes('blocker') ||
      textLower.includes('waiting') ||
      textLower.includes('no blocker') ||
      textLower.includes('blocked by') ||
      textLower.includes('impediment');

    const isConcise = userText.split(/\s+/).length <= 90;

    const checks = [
      {
        label: 'Yesterday’s Completed Work',
        passed: hasYesterday,
        feedback: hasYesterday
          ? 'Shared completed outcomes clearly.'
          : 'State what you finalized yesterday.',
      },
      {
        label: 'Today’s High-Priority Plan',
        passed: hasToday,
        feedback: hasToday
          ? 'Clear objective for today.'
          : 'Clarify your primary task for today.',
      },
      {
        label: 'Blockers Explicitly Addressed',
        passed: hasBlockers,
        feedback: hasBlockers
          ? 'Blockers or lack thereof explicitly communicated.'
          : 'Always state whether you have blockers ("No blockers today" or state the impediment).',
      },
      {
        label: 'Standup Brevity (<90 words)',
        passed: isConcise,
        feedback: isConcise
          ? 'Excellent brevity and punchy delivery.'
          : 'Slightly long for a quick daily standup. Keep details focused on outcomes.',
      },
    ];

    const passedCount = checks.filter((c) => c.passed).length;
    const score = Math.round((passedCount / checks.length) * 100);

    return {
      score,
      isPassed: score >= 75,
      structureCheck: checks,
      overallFeedback:
        score >= 75
          ? 'Ideal standup update! Respects the team’s time and provides transparent visibility.'
          : 'Remember the classic triad: Yesterday, Today, Blockers, spoken with crisp brevity.',
      betterAlternative: drill.modelDelivery,
    };
  },

  // 4. Evaluate Project Status (Green / Yellow / Red)
  evaluateProjectStatus(
    userText: string,
    caseData: ProjectStatusCase
  ): EvaluationResult {
    const textLower = userText.toLowerCase();

    const mentionsColor =
      textLower.includes('green') ||
      textLower.includes('yellow') ||
      textLower.includes('red');

    const mentionsProgress =
      textLower.includes('progress') ||
      textLower.includes('migrated') ||
      textLower.includes('completed') ||
      textLower.includes('testing') ||
      textLower.includes('%');

    const mentionsRisks =
      textLower.includes('risk') ||
      textLower.includes('latency') ||
      textLower.includes('delay') ||
      textLower.includes('timeout') ||
      textLower.includes('blocker');

    const mentionsNextStepsOrSupport =
      textLower.includes('recommend') ||
      textLower.includes('next step') ||
      textLower.includes('support') ||
      textLower.includes('approval') ||
      textLower.includes('action');

    const checks = [
      {
        label: 'Status Health Indicator (Green/Yellow/Red)',
        passed: mentionsColor,
        feedback: mentionsColor
          ? 'Explicit health indicator announced up front.'
          : 'Always lead with the project health color (e.g., "Project Billing V2 is YELLOW").',
      },
      {
        label: 'Progress & Completed Milestones',
        passed: mentionsProgress,
        feedback: mentionsProgress
          ? 'Shared factual progress and status.'
          : 'Include specific milestone metrics or percentages completed.',
      },
      {
        label: 'Transparent Risks & Dependencies',
        passed: mentionsRisks,
        feedback: mentionsRisks
          ? 'Transparently highlighted active risks without sugarcoating.'
          : 'Highlight delays, dependencies, or architectural risks early.',
      },
      {
        label: 'Next Action & Required Stakeholder Support',
        passed: mentionsNextStepsOrSupport,
        feedback: mentionsNextStepsOrSupport
          ? 'Clearly articulated next actions and support needed.'
          : 'Specify the decision or resource needed from stakeholders to get back to green.',
      },
    ];

    const passedCount = checks.filter((c) => c.passed).length;
    const score = Math.round((passedCount / checks.length) * 100);

    return {
      score,
      isPassed: score >= 75,
      structureCheck: checks,
      overallFeedback:
        score >= 75
          ? 'High-impact project status briefing! Balanced transparency with proactive solutioning.'
          : 'Ensure you clearly identify the health color, the core risk, and what decision or support you require.',
      betterAlternative: caseData.modelStatusReport,
    };
  },

  // 5. Evaluate Feedback Response (Receiving / Giving)
  evaluateFeedbackResponse(
    userText: string,
    caseData: FeedbackCase
  ): EvaluationResult {
    const textLower = userText.toLowerCase();

    if (caseData.type === 'receiving') {
      const nonDefensive =
        !textLower.includes('you are wrong') &&
        !textLower.includes('not my fault') &&
        !textLower.includes('whatever');

      const acknowledges =
        textLower.includes('thank') ||
        textLower.includes('appreciate') ||
        textLower.includes('understand') ||
        textLower.includes('agree');

      const clarifies =
        textLower.includes('could you') ||
        textLower.includes('which specific') ||
        textLower.includes('for example') ||
        textLower.includes('clarify') ||
        textLower.includes('?');

      const actionOriented =
        textLower.includes('happy to') ||
        textLower.includes('will update') ||
        textLower.includes('clean up') ||
        textLower.includes('refactor') ||
        textLower.includes('next time');

      const checks = [
        {
          label: 'Constructive & Non-Defensive Tone',
          passed: nonDefensive,
          feedback: 'Maintained professional composure.',
        },
        {
          label: 'Acknowledgement of Core Intent',
          passed: acknowledges,
          feedback: acknowledges
            ? 'Acknowledged reviewer intent and goal of code quality.'
            : 'Start by thanking the reviewer for their input and shared standard.',
        },
        {
          label: 'Specific Clarification Request',
          passed: clarifies,
          feedback: clarifies
            ? 'Asked targeted questions to deconstruct vague feedback.'
            : 'Ask politely for the exact pattern or module they would like simplified.',
        },
        {
          label: 'Solution & Action Readiness',
          passed: actionOriented,
          feedback: actionOriented
            ? 'Demonstrated readiness to improve the implementation.'
            : 'Propose an actionable refinement step.',
        },
      ];

      const passedCount = checks.filter((c) => c.passed).length;
      const score = Math.round((passedCount / checks.length) * 100);

      return {
        score,
        isPassed: score >= 75,
        structureCheck: checks,
        overallFeedback:
          score >= 75
            ? 'Masterclass in receiving vague feedback gracefully while turning it into clear technical action.'
            : 'Avoid becoming defensive; acknowledge the shared goal and ask targeted clarifying questions.',
        betterAlternative: caseData.modelResponse,
      };
    } else {
      // Giving feedback (SBI: Situation, Behavior, Impact, Next Step)
      const hasSituation =
        textLower.includes('noticed') ||
        textLower.includes('last') ||
        textLower.includes('recent') ||
        textLower.includes('on the');

      const hasImpact =
        textLower.includes('impact') ||
        textLower.includes('regressions') ||
        textLower.includes('production') ||
        textLower.includes('debug') ||
        textLower.includes('team');

      const hasSupport =
        textLower.includes('happy to') ||
        textLower.includes('pair') ||
        textLower.includes('help') ||
        textLower.includes('together') ||
        textLower.includes('let me know');

      const checks = [
        {
          label: 'Objective Situation & Behavior Observed',
          passed: hasSituation,
          feedback: hasSituation
            ? 'Grounds feedback in concrete observed work rather than personal traits.'
            : 'State the specific situation and work item objectively.',
        },
        {
          label: 'Clear Explanation of Team/System Impact',
          passed: hasImpact,
          feedback: hasImpact
            ? 'Clearly explains why this matters for team reliability.'
            : 'Explain the real-world impact (e.g. debugging difficulty, test coverage, client trust).',
        },
        {
          label: 'Offer of Support or Actionable Next Step',
          passed: hasSupport,
          feedback: hasSupport
            ? 'Encouraging offer of pairing and collaboration.'
            : 'Offer pairing or share guidelines to help them succeed.',
        },
      ];

      const passedCount = checks.filter((c) => c.passed).length;
      const score = Math.round((passedCount / checks.length) * 100);

      return {
        score,
        isPassed: score >= 75,
        structureCheck: checks,
        overallFeedback:
          score >= 75
            ? 'Exceptional constructive feedback! Empowers the colleague without generating resentment.'
            : 'Frame feedback around shared outcomes and offer to pair or guide next steps.',
        betterAlternative: caseData.modelResponse,
      };
    }
  },

  // 6. Evaluate Disagreement & Conflict Resolution
  evaluateDisagreement(
    userText: string,
    caseData: DisagreementConflictCase
  ): EvaluationResult {
    const textLower = userText.toLowerCase();

    const acknowledges =
      textLower.includes('agree') ||
      textLower.includes('see the value') ||
      textLower.includes('understand') ||
      textLower.includes('appreciate') ||
      textLower.includes('point');

    const usesEvidence =
      textLower.includes('caching') ||
      textLower.includes('cdn') ||
      textLower.includes('latency') ||
      textLower.includes('cost') ||
      textLower.includes('contract') ||
      textLower.includes('schema') ||
      textLower.includes('risk') ||
      textLower.includes('hours');

    const proposesAlternative =
      textLower.includes('could we') ||
      textLower.includes('alternative') ||
      textLower.includes('instead') ||
      textLower.includes('sparse') ||
      textLower.includes('freeze') ||
      textLower.includes('compromise');

    const alignsOnNextStep =
      textLower.includes("let's") ||
      textLower.includes('benchmark') ||
      textLower.includes('schedule') ||
      textLower.includes('test') ||
      textLower.includes('sync');

    const checks = [
      {
        label: 'Acknowledge Value of Counterpart’s Goal',
        passed: acknowledges,
        feedback: acknowledges
          ? 'Validated the other person’s intention before presenting divergence.'
          : 'Start by acknowledging the valid merits of their perspective.',
      },
      {
        label: 'Objective Evidence & Impact Articulated',
        passed: usesEvidence,
        feedback: usesEvidence
          ? 'Grounds disagreement in system constraints and business delivery dates.'
          : 'Explain the technical or schedule trade-off with concrete data.',
      },
      {
        label: 'Constructive Alternative Proposed',
        passed: proposesAlternative,
        feedback: proposesAlternative
          ? 'Proposes a third-path compromise that addresses both priorities.'
          : 'Suggest an actionable alternative that achieves their core goal.',
      },
      {
        label: 'Collaborative Alignment Step',
        passed: alignsOnNextStep,
        feedback: alignsOnNextStep
          ? 'Invites joint experimentation and next action.'
          : 'End with an invitation to benchmark or sync together.',
      },
    ];

    const passedCount = checks.filter((c) => c.passed).length;
    const score = Math.round((passedCount / checks.length) * 100);

    return {
      score,
      isPassed: score >= 75,
      structureCheck: checks,
      overallFeedback:
        score >= 75
          ? 'Exemplary professional diplomacy! Turns potential friction into high-trust collaboration.'
          : 'Structure disagreement into: Acknowledge $\\rightarrow$ Evidence $\\rightarrow$ Alternative $\\rightarrow$ Next Step.',
      betterAlternative: caseData.sampleDialogue,
    };
  },

  // 7. Evaluate Executive Briefing (BLUF)
  evaluateExecutiveBriefing(
    userText: string,
    caseData: ExecutiveBriefingCase
  ): EvaluationResult {
    const textLower = userText.toLowerCase();

    const hasBLUF =
      textLower.includes('bottom line') ||
      textLower.includes('bluf') ||
      textLower.includes('save') ||
      textLower.includes('reduce') ||
      textLower.includes('$');

    const hasBusinessImpact =
      textLower.includes('impact') ||
      textLower.includes('annual') ||
      textLower.includes('spend') ||
      textLower.includes('budget') ||
      textLower.includes('%');

    const hasClearAsk =
      textLower.includes('approval') ||
      textLower.includes('recommend') ||
      textLower.includes('decision') ||
      textLower.includes('dedicate') ||
      textLower.includes('sign off');

    const isConcise = userText.split(/\s+/).length <= 110;

    const checks = [
      {
        label: 'Bottom Line Up Front (BLUF) Delivery',
        passed: hasBLUF,
        feedback: hasBLUF
          ? 'Delivers the most vital financial/operational conclusion first.'
          : 'Executives require the conclusion in the first 15 seconds. State the bottom line first.',
      },
      {
        label: 'Quantified Business Outcome & Impact',
        passed: hasBusinessImpact,
        feedback: hasBusinessImpact
          ? 'Clear metric and financial impact articulated.'
          : 'Include specific numbers ($ saved, % reduction, time saved).',
      },
      {
        label: 'Concrete Recommendation & Decision Ask',
        passed: hasClearAsk,
        feedback: hasClearAsk
          ? 'Crystal-clear decision or sign-off requested.'
          : 'Explicitly state what action or decision you need from the executive.',
      },
      {
        label: 'Executive Brevity (<110 words)',
        passed: isConcise,
        feedback: isConcise
          ? 'Concise and respectful of executive attention.'
          : 'Streamline the wording; avoid technical minutiae in an executive brief.',
      },
    ];

    const passedCount = checks.filter((c) => c.passed).length;
    const score = Math.round((passedCount / checks.length) * 100);

    return {
      score,
      isPassed: score >= 75,
      structureCheck: checks,
      overallFeedback:
        score >= 75
          ? 'Sharp executive briefing! Strategic, outcome-oriented, and immediately actionable.'
          : 'Focus on BLUF: Lead with the financial/business conclusion, state the recommendation, and make the ask.',
      betterAlternative: caseData.keyPointBLUF + ' ' + caseData.recommendation + ' ' + caseData.decisionNeeded,
    };
  },

  // 8. Progress Multi-Day Workplace Simulation
  progressMultiDaySimulation(
    currentState: MultiDaySimState,
    completedActivity: string
  ): MultiDaySimState {
    const nextDay = Math.min(currentState.currentDay + 1, 20);

    // Update tasks
    const updatedTasks = currentState.activeSprintTasks.map((t, idx) => {
      if (idx === 0 && t.status === 'in_progress') {
        return { ...t, status: 'done' as const };
      }
      if (idx === 1 && t.status === 'todo') {
        return { ...t, status: 'in_progress' as const };
      }
      return t;
    });

    // Update trust level
    const updatedTrust = Math.min(100, currentState.managerTrustLevel + 4);

    return {
      ...currentState,
      currentDay: nextDay,
      activeSprintTasks: updatedTasks,
      managerTrustLevel: updatedTrust,
      completedEvents: [...currentState.completedEvents, completedActivity],
      recentFeedback: [
        ...currentState.recentFeedback,
        `Day ${currentState.currentDay} complete: Demonstrated strong communication in "${completedActivity}".`,
      ],
    };
  },

  // 9. Recommend Next Practice Drill
  recommendNextDrill(
    profile: WorkplaceProfile,
    dimensions: WorkplaceReadinessDimension[]
  ): { dimension: WorkplaceReadinessDimension; moduleKey: string; rationale: string } {
    // Find emerging or lowest evidence count
    const sorted = [...dimensions].sort((a, b) => {
      if (a.proficiencyLevel === 'emerging' && b.proficiencyLevel !== 'emerging') return -1;
      if (b.proficiencyLevel === 'emerging' && a.proficiencyLevel !== 'emerging') return 1;
      return a.evidenceCount - b.evidenceCount;
    });

    const target = sorted[0] || dimensions[0];

    const moduleMapping: Record<string, string> = {
      dim_speaking: 'standup',
      dim_listening: 'task_understanding',
      dim_writing: 'async_matrix',
      dim_meetings: 'meeting_mastery',
      dim_manager: 'one_on_one',
      dim_client: 'customer_sim',
      dim_technical: 'bidi_tech',
      dim_conflict: 'disagreement',
      dim_incident: 'incident_lab',
      dim_leadership: 'delegation',
      dim_executive: 'exec_briefing',
      dim_growth: 'storytelling',
    };

    return {
      dimension: target,
      moduleKey: moduleMapping[target.id] || 'standup',
      rationale: `Recommended because your "${target.name}" evidence indicates ${target.nextFocusArea}`,
    };
  },
};
