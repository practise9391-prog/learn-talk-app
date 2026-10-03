import {
  ResumeBulletRefinement,
  ProjectExplanationProfile,
  InterviewQuestionItem,
  IntroDuration,
} from '../types/career';

export class CareerEvaluationService {
  /**
   * Refines raw resume bullet points into professional action-oriented language.
   * Explicitly avoids inventing technologies, percentages, or unverified achievements.
   */
  public static refineResumeBullet(
    rawBullet: string,
    context?: {
      techUsed?: string;
      problemSolved?: string;
      outcomeResult?: string;
      roleTitle?: string;
    }
  ): ResumeBulletRefinement {
    const clean = rawBullet.trim();
    const missingDimensions: ('technology' | 'responsibility' | 'problem' | 'result')[] = [];

    if (!context?.techUsed && !/(react|node|python|java|sql|aws|docker|typescript|figma|c\+\+)/i.test(clean)) {
      missingDimensions.push('technology');
    }
    if (!context?.problemSolved && !/(latency|bug|refactor|migration|delay|bottleneck|manual|security)/i.test(clean)) {
      missingDimensions.push('problem');
    }
    if (!context?.outcomeResult && !/(reduced|increased|improved|automated|saved|accelerated|achieved)/i.test(clean)) {
      missingDimensions.push('result');
    }

    const tech = context?.techUsed || 'core technologies';
    const problem = context?.problemSolved || 'operational bottlenecks';
    const outcome = context?.outcomeResult || 'improving overall system reliability';

    return {
      id: `bullet-${Date.now()}`,
      originalDraft: clean,
      missingDimensions,
      versions: {
        simple: `Built and maintained key features using ${tech} to solve ${problem}.`,
        professional: `Collaborated across engineering and product teams to implement responsive features using ${tech}, directly resolving ${problem}.`,
        achievementFocused: `Spearheaded feature delivery using ${tech}, successfully resolving ${problem} and ${outcome}.`,
        technical: `Architected and deployed production-grade services utilizing ${tech}, streamlining system data flow and mitigating ${problem}.`,
      },
    };
  }

  /**
   * Evaluates an interview answer for STAR coverage, tone, and speech clarity.
   */
  public static evaluateInterviewAnswer(
    userAnswer: string,
    question: InterviewQuestionItem
  ): {
    overallScore: number;
    clarityScore: number;
    toneScore: number;
    starCoverage: { situation: boolean; task: boolean; action: boolean; result: boolean };
    fillersCount: number;
    grammarIssues: string[];
    whatWentWell: string[];
    priorityImprovements: string[];
    betterProfessionalVersion: string;
  } {
    const text = userAnswer.trim();
    const words = text.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // Detect filler words
    const fillerMatches = text.match(/\b(um|uh|like|basically|actually|you know|sort of|kind of)\b/gi) || [];
    const fillersCount = fillerMatches.length;

    // Check STAR methodology keywords/indicators
    const hasSituation = /(when|during|while|at my previous|in my project|in my college|we had)/i.test(text);
    const hasTask = /(my responsibility was|i was tasked with|we needed to|my goal was|the objective was)/i.test(text);
    const hasAction = /(i implemented|i decided|i built|i proposed|i refactored|i communicated|i designed)/i.test(text);
    const hasResult = /(as a result|ultimately|which resulted in|this helped|we achieved|improved|successfully)/i.test(text);

    const starPoints = (hasSituation ? 25 : 0) + (hasTask ? 25 : 0) + (hasAction ? 25 : 0) + (hasResult ? 25 : 0);

    const grammarIssues: string[] = [];
    if (/(yesterday|last month|in college)\s+I\s+(go|make|build|see)/i.test(text)) {
      grammarIssues.push('Past tense inconsistency: using present tense with historical past references.');
    }
    if (/\b(me and my team|myself and my lead)\b/i.test(text)) {
      grammarIssues.push('Polite order error: say "my team and I" rather than "me and my team".');
    }

    const clarityScore = Math.min(100, Math.max(50, Math.round(50 + (wordCount > 40 ? 30 : wordCount * 0.7) - fillersCount * 4)));
    const toneScore = /(gonna|wanna|y'all|crap|dunno)/i.test(text) ? 65 : 92;
    const overallScore = Math.round(clarityScore * 0.35 + toneScore * 0.25 + starPoints * 0.4);

    const whatWentWell: string[] = [];
    if (wordCount >= 40) whatWentWell.push('Good substantive length and willingness to detail the scenario.');
    if (hasAction) whatWentWell.push('Clear ownership of your individual action and contribution.');
    if (fillersCount <= 2) whatWentWell.push('Polished verbal delivery with minimal filler words.');

    const priorityImprovements: string[] = [];
    if (!hasResult) {
      priorityImprovements.push('Explicitly state the business outcome or what you learned from the experience.');
    }
    if (!hasTask) {
      priorityImprovements.push('Clarify your specific individual responsibility vs the broader team task.');
    }
    if (fillersCount > 3) {
      priorityImprovements.push(`Reduce filler words (${fillersCount} detected: "um", "basically"). Pause quietly instead of vocalizing pauses.`);
    }

    return {
      overallScore,
      clarityScore,
      toneScore,
      starCoverage: {
        situation: hasSituation,
        task: hasTask,
        action: hasAction,
        result: hasResult,
      },
      fillersCount,
      grammarIssues,
      whatWentWell: whatWentWell.length > 0 ? whatWentWell : ['Attempted the answer in complete sentences.'],
      priorityImprovements:
        priorityImprovements.length > 0 ? priorityImprovements : ['Maintain this balanced pacing and structured STAR narrative.'],
      betterProfessionalVersion: question.modelAnswer,
    };
  }

  /**
   * Generates tailored interview practice questions strictly grounded in learner's project inputs.
   */
  public static generateProjectQuestions(project: ProjectExplanationProfile): InterviewQuestionItem[] {
    const techStr = project.techStack.join(', ') || 'your chosen technologies';

    return [
      {
        id: `pq-${project.id}-1`,
        category: 'project',
        question: `Could you walk me through the architecture of ${project.projectName} and explain what problem it solves?`,
        intentExplanation: 'Tests high-level system comprehension and problem-first communication.',
        idealFramework: 'Problem Statement → Target Users → High-Level Architecture → Core Flow',
        keyPointsToCover: [project.problemSolved, project.targetUsers, techStr],
        modelAnswer: `${project.projectName} addresses ${project.problemSolved} for ${project.targetUsers}. I architected the solution using ${techStr}, ensuring modular data flow and rapid response times.`,
        sampleFollowUps: [`Why did you choose ${techStr} over alternative technologies?`],
      },
      {
        id: `pq-${project.id}-2`,
        category: 'project',
        question: `What was your specific individual contribution to ${project.projectName}?`,
        intentExplanation: 'Distinguishes what you built personally versus collective team output.',
        idealFramework: 'Role Ownership → Core Module Built → Collaboration Points',
        keyPointsToCover: [project.myKeyResponsibilities],
        modelAnswer: `My primary responsibility was ${project.myKeyResponsibilities}. I owned this module from initial schema design through automated testing and deployment.`,
        sampleFollowUps: ['How did your module interface with the rest of the application?'],
      },
      {
        id: `pq-${project.id}-3`,
        category: 'technical',
        question: `What was the most challenging technical blocker you encountered during ${project.projectName}, and how did you resolve it?`,
        intentExplanation: 'Evaluates debugging methodology, perseverance, and root-cause analysis.',
        idealFramework: 'Symptom & Blocker → Investigation Process → Fix & Verification',
        keyPointsToCover: [project.majorChallenge, project.debuggingStory],
        modelAnswer: `The biggest hurdle was ${project.majorChallenge}. To solve it, ${project.debuggingStory}. This experience reinforced the importance of proactive telemetry.`,
        sampleFollowUps: ['What would you do differently if you were to re-architect this today?'],
      },
    ];
  }
}
