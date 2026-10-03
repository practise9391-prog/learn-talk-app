// Part 19: Professional English Lab Evaluation Service
import {
  WorkdayStage,
  EmailThreadCase,
  EmailEvaluationResult,
  MeetingEpisode,
  MeetingMinutesDraft,
  MeetingMinutesEvaluation,
  IncidentCase,
  DecisionLabCase,
  DecisionApproach,
  ReadinessScoreRecord,
} from '../types/proLab';

export interface StageEvaluationResult {
  score: number;
  clarityScore: number;
  elementsPresent: string[];
  elementsMissing: string[];
  toneFeedback: string;
  actionableFeedback: string[];
}

export interface IncidentEvaluationResult {
  score: number;
  hasFacts: boolean;
  hasInvestigation: boolean;
  hasImpact: boolean;
  hasNextUpdate: boolean;
  speculationFlagged: boolean;
  feedback: string[];
}

export class ProLabService {
  /**
   * Evaluate a Workday Stage response
   */
  static evaluateWorkdayStage(
    stage: WorkdayStage,
    userText: string
  ): StageEvaluationResult {
    const textLower = userText.toLowerCase().trim();
    const words = textLower.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    const elementsPresent: string[] = [];
    const elementsMissing: string[] = [];

    // Check required elements
    stage.requiredElements.forEach((elem) => {
      const keywords = elem.toLowerCase().split(/[\s/]+/);
      const isPresent = keywords.some((kw) => textLower.includes(kw));
      if (isPresent || wordCount > 35) {
        elementsPresent.push(elem);
      } else {
        elementsMissing.push(elem);
      }
    });

    let score = 70;
    if (wordCount >= 25 && wordCount <= 120) score += 15;
    else if (wordCount < 20) score -= 15;

    score += Math.round((elementsPresent.length / Math.max(stage.requiredElements.length, 1)) * 15);
    score = Math.min(Math.max(score, 50), 98);

    const actionableFeedback: string[] = [];
    if (wordCount < 25) {
      actionableFeedback.push('Expand your response with explicit context (status, rationale, and specific next steps).');
    }
    if (elementsMissing.length > 0) {
      actionableFeedback.push(`Consider mentioning: ${elementsMissing.join(', ')}.`);
    }
    if (!textLower.includes('will') && !textLower.includes('recommend') && !textLower.includes('suggest')) {
      actionableFeedback.push('Add an explicit recommendation or forward-looking action to demonstrate leadership.');
    }
    if (actionableFeedback.length === 0) {
      actionableFeedback.push('Excellent clarity and stakeholder awareness! Your response addressed the core tension directly.');
    }

    return {
      score,
      clarityScore: Math.min(score + 4, 98),
      elementsPresent,
      elementsMissing,
      toneFeedback:
        score >= 85
          ? 'Professional, calm, and highly credible.'
          : 'Understandable and constructive, with room for tighter structure.',
      actionableFeedback,
    };
  }

  /**
   * Evaluate an Email Thread reply
   */
  static evaluateEmailReply(
    caseStudy: EmailThreadCase,
    userEmail: string
  ): EmailEvaluationResult {
    const textLower = userEmail.toLowerCase().trim();
    const wordCount = textLower.split(/\s+/).filter(Boolean).length;

    let score = 65;
    const strengths: string[] = [];
    const improvements: string[] = [];

    // Check salutation and sign-off
    const hasGreeting = /^(hi|hello|dear|good morning|good afternoon)/i.test(userEmail.trim());
    const hasSignoff = /(best regards|sincerely|thanks|best|warm regards)/i.test(userEmail.trim());

    if (hasGreeting && hasSignoff) {
      score += 10;
      strengths.push('Proper business email etiquette with clear salutation and professional sign-off.');
    } else {
      improvements.push('Include a standard professional salutation (e.g. "Hi Marcus,") and closing sign-off.');
    }

    // Check accountability / acknowledgment
    if (textLower.includes('understand') || textLower.includes('apologize') || textLower.includes('investigate') || textLower.includes('appreciate')) {
      score += 10;
      strengths.push('Constructive and accountable opening that validates stakeholder concern.');
    } else {
      improvements.push('Open by acknowledging the stakeholder’s inquiry before diving into technical details.');
    }

    // Check timeline / commitments
    const hasSpecificCommitment = /\d{1,2}(:\d{2})?\s*(am|pm)|tonight|tomorrow|friday|monday/i.test(userEmail);
    if (hasSpecificCommitment) {
      score += 10;
      strengths.push('Included concrete commitments and specific timelines (e.g. exact delivery hour).');
    } else {
      improvements.push('Provide a concrete time commitment (e.g. "by 8:00 AM tomorrow") instead of vague assurances.');
    }

    if (wordCount >= 60 && wordCount <= 220) {
      score += 5;
    }

    score = Math.min(Math.max(score, 50), 98);

    return {
      score,
      clarity: Math.min(score + 2, 98),
      toneProfessionalism: hasGreeting && hasSignoff ? 92 : 78,
      actionableCommitments: hasSpecificCommitment,
      addressedAllQuestions: wordCount >= 70,
      feedback: [...strengths, ...improvements],
      strengths,
      improvements,
    };
  }

  /**
   * Evaluate Meeting Minutes Draft
   */
  static evaluateMeetingMinutes(
    meeting: MeetingEpisode,
    draft: MeetingMinutesDraft
  ): MeetingMinutesEvaluation {
    const summaryLength = draft.summary.trim().split(/\s+/).filter(Boolean).length;
    const decisionsCount = draft.decisions.filter((d) => d.trim().length > 5).length;
    const actionItemsCount = draft.actionItems.filter(
      (a) => a.owner.trim().length > 1 && a.task.trim().length > 5
    ).length;

    let score = 60;
    const feedback: string[] = [];

    if (summaryLength >= 20) {
      score += 10;
      feedback.push('Executive summary provides solid high-level context of the discussion.');
    } else {
      feedback.push('Summary is too brief; outline the key technical topic and consensus reached.');
    }

    if (decisionsCount >= meeting.keyDecisionsMade.length) {
      score += 15;
      feedback.push(`Captured all ${meeting.keyDecisionsMade.length} core decisions made in the sync.`);
    } else {
      feedback.push(`Only captured ${decisionsCount} of ${meeting.keyDecisionsMade.length} key decisions.`);
    }

    // Check action item completeness (Who, What, When)
    let whoWhatWhenClarity = 70;
    const hasDeadlines = draft.actionItems.some((a) => a.deadline.trim().length > 2);
    if (hasDeadlines) {
      whoWhatWhenClarity += 15;
      score += 15;
      feedback.push('Action items contain explicit deadlines and owners.');
    } else {
      feedback.push('Ensure every action item includes a specific owner and deadline (e.g. "Wednesday 3:00 PM").');
    }

    score = Math.min(Math.max(score, 50), 98);

    return {
      score,
      capturedDecisionsCount: decisionsCount,
      totalDecisions: meeting.keyDecisionsMade.length,
      capturedActionItemsCount: actionItemsCount,
      totalActionItems: meeting.actualActionItems.length,
      whoWhatWhenClarityScore: Math.min(whoWhatWhenClarity, 98),
      feedback,
    };
  }

  /**
   * Evaluate an Incident Broadcast
   */
  static evaluateIncidentBroadcast(
    incident: IncidentCase,
    userBroadcast: string
  ): IncidentEvaluationResult {
    const textLower = userBroadcast.toLowerCase();
    const words = textLower.split(/\s+/).filter(Boolean);

    const hasFacts = textLower.includes('fact') || textLower.includes('know') || textLower.includes('impact') || textLower.includes('status');
    const hasInvestigation = textLower.includes('investigat') || textLower.includes('analyz') || textLower.includes('review') || textLower.includes('check');
    const hasImpact = textLower.includes('user') || textLower.includes('affect') || textLower.includes('transaction') || textLower.includes('service');
    const hasNextUpdate = textLower.includes('next update') || textLower.includes('utc') || textLower.includes('pm') || textLower.includes('am') || textLower.includes('min');

    // Check for panic / speculative words
    const panicKeywords = ['broken', 'destroyed', 'disaster', 'promise', 'guarantee in 5', 'impossible', 'panic'];
    const speculationFlagged = panicKeywords.some((kw) => textLower.includes(kw));

    let score = 65;
    const feedback: string[] = [];

    if (hasFacts) {
      score += 8;
      feedback.push('Clear distinction of verified facts.');
    } else {
      feedback.push('Explicitly state what is confirmed (e.g. "Facts Known:").');
    }

    if (hasInvestigation) {
      score += 8;
      feedback.push('Acknowledges active investigations without pretending to have all answers.');
    }

    if (hasImpact) {
      score += 8;
      feedback.push('Quantified or clarified scope of user/transaction impact.');
    }

    if (hasNextUpdate) {
      score += 10;
      feedback.push('Provided a definitive next update timestamp to keep stakeholders calm.');
    } else {
      feedback.push('Always include an explicit time for the next broadcast (e.g. "Next update at 15:00 UTC").');
    }

    if (speculationFlagged) {
      score -= 20;
      feedback.push('Avoid speculative or emotive phrasing ("guarantee", "disaster"). Stick to objective engineering status.');
    }

    score = Math.min(Math.max(score, 45), 98);

    return {
      score,
      hasFacts,
      hasInvestigation,
      hasImpact,
      hasNextUpdate,
      speculationFlagged,
      feedback,
    };
  }

  /**
   * Evaluate Communication Decision Choice and Spoken/Written Rationale
   */
  static evaluateDecisionResponse(
    decisionCase: DecisionLabCase,
    chosenApproach: DecisionApproach,
    userText: string
  ): { score: number; alignment: string; feedback: string[] } {
    const textLower = userText.toLowerCase();
    const wordCount = textLower.split(/\s+/).filter(Boolean).length;

    let score = 75;
    const feedback: string[] = [];

    feedback.push(`Strategy chosen: "${chosenApproach.approachName}".`);

    if (wordCount >= 25) {
      score += 15;
      feedback.push('Detailed justification provided with clear stakeholder framing.');
    } else {
      feedback.push('Expand your explanation to address risks and next steps.');
    }

    if (textLower.includes('because') || textLower.includes('ensure') || textLower.includes('protect') || textLower.includes('recommend')) {
      score += 8;
      feedback.push('Articulated clear cause-and-effect reasoning.');
    }

    score = Math.min(Math.max(score, 50), 98);

    return {
      score,
      alignment: `Strong alignment with ${chosenApproach.approachName}`,
      feedback,
    };
  }

  /**
   * Update Readiness Score Records based on new practice session
   */
  static updateReadinessScores(
    scores: ReadinessScoreRecord[],
    dimension: string,
    sessionScore: number
  ): ReadinessScoreRecord[] {
    return scores.map((item) => {
      if (item.dimension === dimension) {
        const newEvidenceCount = item.evidenceCount + 1;
        const updatedScore = Math.round(
          (item.score * item.evidenceCount + sessionScore) / newEvidenceCount
        );
        return {
          ...item,
          score: updatedScore,
          evidenceCount: newEvidenceCount,
        };
      }
      return item;
    });
  }
}
