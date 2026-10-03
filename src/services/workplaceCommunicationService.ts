// Part 18: Advanced Workplace Communication Evaluation Engine
import {
  AudienceAwareScenario,
  AudienceType,
  ManagerScenario,
  ConflictScenario,
  ExecutiveBriefingCase,
  ThinkOnYourFeetDrill,
} from '../types/workplace';

export interface AudienceEvaluationResult {
  overallScore: number;
  clarityScore: number;
  toneScore: number;
  audienceRelevanceScore: number;
  detectedStrengths: string[];
  priorityFixes: string[];
  suggestedAlternative: string;
}

export interface ManagerEvaluationResult {
  overallScore: number;
  directnessScore: number;
  solutionFocusScore: number;
  professionalismScore: number;
  feedbackSummary: string;
  betterAlternative: string;
}

export interface ExecutiveEvaluationResult {
  overallScore: number;
  concisenessScore: number;
  decisionClarityScore: number;
  impactScore: number;
  wordCount: number;
  verdict: string;
  improvedVersion: string;
}

export class WorkplaceCommunicationService {
  /**
   * Evaluates how effectively a message was tailored to a specific audience.
   */
  public static evaluateAudienceAdaptation(
    userText: string,
    scenario: AudienceAwareScenario,
    audience: AudienceType
  ): AudienceEvaluationResult {
    const text = userText.trim().toLowerCase();
    const words = text.split(/\s+/).filter(Boolean);
    const profile = scenario.audienceProfiles[audience];

    let clarity = 80;
    let tone = 80;
    let relevance = 80;
    const strengths: string[] = [];
    const fixes: string[] = [];

    // Audience-specific heuristic rules
    if (audience === 'customer') {
      const hasJargon = /(schema|foreign key|lock|latency|postgres|query|partition|cve)/i.test(text);
      if (hasJargon) {
        clarity -= 20;
        tone -= 15;
        fixes.push('Remove internal technical jargon; customers care about service availability and data safety.');
      } else {
        clarity += 10;
        strengths.push('Clean, non-alarming customer-facing language');
      }

      if (text.includes('ensure') || text.includes('safety') || text.includes('reliable') || text.includes('normal')) {
        tone += 10;
        strengths.push('Reassuring and professional tone');
      }
    } else if (audience === 'executive') {
      if (words.length > 55) {
        clarity -= 15;
        fixes.push(`Too verbose (${words.length} words). Executives need a 15–30 second BLUF (under 45 words).`);
      } else {
        clarity += 10;
        strengths.push('Concise, bottom-line executive framing');
      }

      if (text.includes('risk') || text.includes('sla') || text.includes('zero') || text.includes('impact') || text.includes('bottom line')) {
        relevance += 15;
        strengths.push('Focused on business risk and bottom-line impact');
      } else {
        fixes.push('Make sure to explicitly mention SLA risk or financial/operational consequence.');
      }
    } else if (audience === 'teammate') {
      if (text.includes('pr') || text.includes('review') || text.includes('table') || text.includes('lock') || text.includes('help') || text.includes('folks')) {
        relevance += 15;
        tone += 10;
        strengths.push('Pragmatic, peer-level collaborative tone with clear call-to-action');
      }
    } else if (audience === 'manager') {
      if (text.includes('plan') || text.includes('timeline') || text.includes('option') || text.includes('monday') || text.includes('rescheduled')) {
        relevance += 15;
        strengths.push('Proactively provided timeline and mitigation steps');
      } else {
        fixes.push('Always pair an escalation or delay notice with your proposed mitigation timeline.');
      }
    }

    const overallScore = Math.min(98, Math.max(50, Math.round((clarity + tone + relevance) / 3)));

    return {
      overallScore,
      clarityScore: Math.min(100, clarity),
      toneScore: Math.min(100, tone),
      audienceRelevanceScore: Math.min(100, relevance),
      detectedStrengths: strengths.length > 0 ? strengths : ['Professional engagement and clear communication'],
      priorityFixes: fixes.length > 0 ? fixes : ['Continue refining brevity and precision'],
      suggestedAlternative: profile.modelPhrasing,
    };
  }

  /**
   * Evaluates upward communication to a manager.
   */
  public static evaluateManagerResponse(
    userAnswer: string,
    scenario: ManagerScenario
  ): ManagerEvaluationResult {
    const text = userAnswer.trim().toLowerCase();
    let directness = 82;
    let solutionFocus = 80;
    let professionalism = 85;

    // Check for defensive words
    if (text.includes('not my fault') || text.includes('they didn\'t') || text.includes('someone else') || text.includes('you never told me')) {
      directness -= 25;
      professionalism -= 20;
    }

    // Check for options / proactive proposals
    if (text.includes('option') || text.includes('recommend') || text.includes('propose') || text.includes('instead') || text.includes('could we')) {
      solutionFocus += 15;
    }

    // Check for decision requests
    if (text.includes('which') || text.includes('prefer') || text.includes('direction') || text.includes('approve') || text.includes('thoughts')) {
      directness += 10;
    }

    const overallScore = Math.min(96, Math.max(55, Math.round((directness + solutionFocus + professionalism) / 3)));

    return {
      overallScore,
      directnessScore: Math.min(100, directness),
      solutionFocusScore: Math.min(100, solutionFocus),
      professionalismScore: Math.min(100, professionalism),
      feedbackSummary:
        overallScore >= 82
          ? 'Strong managerial communication: balanced accountability with actionable alternatives.'
          : 'Focus on leading with ownership and presenting concrete options rather than just describing friction.',
      betterAlternative: scenario.modelResponse,
    };
  }

  /**
   * Evaluates concise executive briefings.
   */
  public static evaluateExecutiveBriefing(
    userAnswer: string,
    briefingCase: ExecutiveBriefingCase
  ): ExecutiveEvaluationResult {
    const text = userAnswer.trim();
    const words = text.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // Target words based on duration
    const targetWords = briefingCase.duration === '15s' ? 35 : briefingCase.duration === '30s' ? 65 : 120;
    const isOverLimit = wordCount > targetWords * 1.3;

    let conciseness = isOverLimit ? Math.max(50, Math.round(100 - (wordCount - targetWords) * 1.5)) : 90;
    let decisionClarity = 80;
    let impact = 80;

    const lower = text.toLowerCase();
    if (lower.includes('saving') || lower.includes('cost') || lower.includes('risk') || lower.includes('sla') || lower.includes('%') || lower.includes('$')) {
      impact += 15;
    }

    if (lower.includes('approval') || lower.includes('decision') || lower.includes('recommend') || lower.includes('approve') || lower.includes('need your')) {
      decisionClarity += 15;
    }

    const overallScore = Math.min(98, Math.max(50, Math.round((conciseness + decisionClarity + impact) / 3)));

    return {
      overallScore,
      concisenessScore: conciseness,
      decisionClarityScore: Math.min(100, decisionClarity),
      impactScore: Math.min(100, impact),
      wordCount,
      verdict:
        overallScore >= 82
          ? 'High-impact executive framing. Direct, metric-focused, and decisive.'
          : 'Trim background context and lead with the bottom-line decision required.',
      improvedVersion: briefingCase.modelBriefing,
    };
  }
}
