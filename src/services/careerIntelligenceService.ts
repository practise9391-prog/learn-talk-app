// Part 20: Career Intelligence Service
import {
  CareerGoalProfile,
  RoleRequirementMap,
  CareerSkillGapItem,
  JobDescriptionAnalysis,
  RecruiterSimulationCase,
  NetworkingSimulationCase,
  CareerDailyPlan,
} from '../types/careerIntelligence';
import { ROLE_REQUIREMENT_MAPS } from '../data/careerIntelligenceData';

export class CareerIntelligenceService {
  /**
   * Parse a raw Job Description into structured learning components
   */
  static parseJobDescription(
    rawText: string,
    roleTitle = 'Software Engineer',
    companyName = 'Target Company'
  ): JobDescriptionAnalysis {
    const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);

    // Heuristic extraction for responsibilities & skills
    const responsibilities: string[] = [];
    const requiredSkills: string[] = [];
    const preferredSkills: string[] = [];

    let currentSection = 'general';
    for (const line of lines) {
      const lower = line.toLowerCase();
      if (lower.includes('responsibilit') || lower.includes('what you will do') || lower.includes('role')) {
        currentSection = 'resp';
        continue;
      } else if (lower.includes('requirement') || lower.includes('required') || lower.includes('qualifications') || lower.includes('what you need')) {
        currentSection = 'req';
        continue;
      } else if (lower.includes('preferred') || lower.includes('bonus') || lower.includes('nice to have')) {
        currentSection = 'pref';
        continue;
      }

      if (line.startsWith('-') || line.startsWith('•') || line.startsWith('*')) {
        const cleaned = line.replace(/^[-•*]\s*/, '').trim();
        if (cleaned.length > 15) {
          if (currentSection === 'resp') responsibilities.push(cleaned);
          else if (currentSection === 'req') requiredSkills.push(cleaned);
          else if (currentSection === 'pref') preferredSkills.push(cleaned);
          else if (responsibilities.length < 5) responsibilities.push(cleaned);
        }
      }
    }

    // Default fallbacks if parsing is short
    if (responsibilities.length === 0) {
      responsibilities.push(
        'Collaborate with cross-functional product and engineering teams to deliver high-quality deliverables.',
        'Participate in agile sprint ceremonies, code reviews, and architectural planning discussions.',
        'Diagnose technical bottlenecks and optimize system reliability and user experience.'
      );
    }
    if (requiredSkills.length === 0) {
      requiredSkills.push(
        'Proven professional experience in core software development or technical domain.',
        'Strong verbal and written communication skills across technical and business stakeholders.',
        'Demonstrated ability to solve complex problems independently and in team environments.'
      );
    }

    // High-frequency professional vocabulary keywords
    const vocabBank = [
      { word: 'Cross-functional', meaning: 'Involving individuals or teams from diverse departments and specialties.', contextSentence: 'Collaborate with cross-functional stakeholders across product and design.' },
      { word: 'Scalability', meaning: 'The capacity of a system, network, or process to handle a growing amount of work.', contextSentence: 'Architect solutions with high scalability and sub-second latency.' },
      { word: 'Stakeholder', meaning: 'A person with an interest or concern in something, especially a business or project.', contextSentence: 'Align expectations with technical and executive stakeholders regularly.' },
      { word: 'Trade-off', meaning: 'A balance achieved between two desirable but incompatible features.', contextSentence: 'Explain engineering trade-offs between delivery speed and system maintainability.' },
      { word: 'Mitigation', meaning: 'The action of reducing the severity, seriousness, or painfulness of something.', contextSentence: 'Propose proactive risk mitigation strategies during release planning.' },
    ];

    const interviewQuestions = [
      `How does your past experience align with the core responsibilities outlined for this ${roleTitle} role?`,
      'Tell me about a time you collaborated across multiple teams with competing priorities to deliver a milestone.',
      'Walk me through a difficult technical or operational challenge you solved and how you measured its success.',
    ];

    return {
      id: `jd_${Date.now()}`,
      title: roleTitle,
      companyName,
      rawText,
      extractedRole: roleTitle,
      keyResponsibilities: responsibilities.slice(0, 5),
      requiredSkills: requiredSkills.slice(0, 5),
      preferredQualifications: preferredSkills.slice(0, 4),
      repeatedVocabulary: vocabBank,
      interviewQuestions,
      suggestedActionVerbs: ['Architected', 'Spearheaded', 'Optimized', 'Streamlined', 'Delivered', 'Collaborated'],
    };
  }

  /**
   * Calculate Skill Gap Analysis based on target role requirements
   */
  static calculateSkillGaps(
    roleKey: string,
    historyScores: { speaking?: number; writing?: number; interview?: number; tech?: number }
  ): CareerSkillGapItem[] {
    const roleReq = ROLE_REQUIREMENT_MAPS[roleKey] || ROLE_REQUIREMENT_MAPS.software_developer;

    return roleReq.communicationRequirements.map((req, idx) => {
      let currentScore = 75;
      if (req.skillName.toLowerCase().includes('speaking') || req.skillName.toLowerCase().includes('standup')) {
        currentScore = historyScores.speaking || 82;
      } else if (req.skillName.toLowerCase().includes('writing') || req.skillName.toLowerCase().includes('resume')) {
        currentScore = historyScores.writing || 78;
      } else if (req.skillName.toLowerCase().includes('interview') || req.skillName.toLowerCase().includes('behavioral')) {
        currentScore = historyScores.interview || 80;
      } else if (req.skillName.toLowerCase().includes('architecture') || req.skillName.toLowerCase().includes('technical')) {
        currentScore = historyScores.tech || 84;
      }

      let status: 'weak' | 'developing' | 'strong' | 'transfer_ready' = 'developing';
      if (currentScore >= req.benchmarkScore + 4) status = 'transfer_ready';
      else if (currentScore >= req.benchmarkScore) status = 'strong';
      else if (currentScore < req.benchmarkScore - 8) status = 'weak';

      let recommendation = `Target: ${req.benchmarkScore}%. Practice focused exercises in this area.`;
      if (status === 'transfer_ready') recommendation = 'Exceeds benchmark target! Ready for advanced transfer challenges.';
      else if (status === 'strong') recommendation = 'Meeting benchmark expectations consistently.';
      else if (status === 'weak') recommendation = 'Priority focus: complete dedicated simulations to elevate score.';

      return {
        skillName: req.skillName,
        status,
        currentScore,
        benchmarkScore: req.benchmarkScore,
        evidenceCount: 8 + idx * 3,
        recommendation,
      };
    });
  }

  /**
   * Evaluate Candidate's Recruiter Response
   */
  static evaluateRecruiterResponse(
    caseObj: RecruiterSimulationCase,
    userText: string
  ): {
    score: number;
    toneScore: number;
    clarityScore: number;
    feedback: string[];
    strengths: string[];
  } {
    const lower = userText.toLowerCase().trim();
    const wordCount = lower.split(/\s+/).filter(Boolean).length;

    let score = 70;
    const strengths: string[] = [];
    const feedback: string[] = [];

    // Check politeness & appreciation
    if (lower.includes('thank') || lower.includes('appreciate') || lower.includes('glad to') || lower.includes('excited')) {
      score += 10;
      strengths.push('Gracious, enthusiastic, and polite professional tone.');
    } else {
      feedback.push('Open by thanking the recruiter or expressing enthusiasm for the conversation.');
    }

    // Check flexibility / range
    if (caseObj.scenarioType === 'salary_expectations') {
      if (lower.includes('range') || lower.includes('flexible') || lower.includes('total comp') || lower.includes('budget')) {
        score += 10;
        strengths.push('Framed compensation as a flexible range and asked about company budgeted bands.');
      } else {
        feedback.push('Avoid rigid single-figure demands; state a flexible range and inquire about their budgeted band.');
      }
    }

    // Check specific availability or timeline
    if (lower.includes('week') || lower.includes('notice') || lower.includes('month') || lower.includes('immediately') || lower.includes('days')) {
      score += 10;
      strengths.push('Clearly stated notice period and transition availability.');
    }

    if (wordCount >= 25 && wordCount <= 120) {
      score += 5;
    }

    score = Math.min(Math.max(score, 50), 98);

    return {
      score,
      toneScore: Math.min(score + 3, 98),
      clarityScore: Math.min(score + 1, 98),
      feedback,
      strengths,
    };
  }

  /**
   * Evaluate Candidate's Networking Message
   */
  static evaluateNetworkingMessage(
    caseObj: NetworkingSimulationCase,
    userText: string
  ): { score: number; feedback: string[]; strengths: string[] } {
    const lower = userText.toLowerCase().trim();
    const words = lower.split(/\s+/).filter(Boolean).length;

    let score = 70;
    const strengths: string[] = [];
    const feedback: string[] = [];

    if (lower.includes('hi') || lower.includes('hello') || lower.includes('dear') || lower.includes('hope')) {
      score += 10;
      strengths.push('Proper conversational greeting.');
    }

    if (lower.includes('admire') || lower.includes('enjoyed') || lower.includes('work') || lower.includes('talk') || lower.includes('article')) {
      score += 10;
      strengths.push('Referenced specific work or common background.');
    }

    if (lower.includes('15') || lower.includes('coffee') || lower.includes('chat') || lower.includes('advice') || lower.includes('perspective')) {
      score += 10;
      strengths.push('Low-pressure, courteous ask for brief advice.');
    }

    if (words < 20) feedback.push('A bit too brief. Add specific shared context and context for why you are reaching out.');

    score = Math.min(Math.max(score, 50), 98);

    return {
      score,
      feedback,
      strengths,
    };
  }

  /**
   * Generate an adaptive daily career practice plan based on available minutes
   */
  static generateDailyPlan(availableMinutes = 30): CareerDailyPlan {
    if (availableMinutes <= 15) {
      return {
        totalMinutes: 15,
        tasks: [
          { id: 't1', durationMinutes: 5, category: 'Speaking', title: '60s Elevator Pitch Sprint', description: 'Rehearse your self-introduction once with voice recording.', completed: false },
          { id: 't2', durationMinutes: 5, category: 'Vocabulary', title: '5 High-Impact Career Collocations', description: 'Review cross-functional and trade-off phrasing.', completed: false },
          { id: 't3', durationMinutes: 5, category: 'Mistakes', title: 'Review 1 Common Interview Hesitation', description: 'Practice thinking-time bridging statements.', completed: false },
        ],
      };
    } else if (availableMinutes <= 30) {
      return {
        totalMinutes: 30,
        tasks: [
          { id: 't1', durationMinutes: 10, category: 'Interview Speaking', title: 'Behavioral STAR Simulation', description: 'Answer 1 behavioral challenge question with situation and outcome.', completed: false },
          { id: 't2', durationMinutes: 10, category: 'Recruiter Comms', title: 'Salary & Availability Call Simulation', description: 'Practice discussing compensation ranges and notice periods.', completed: false },
          { id: 't3', durationMinutes: 5, category: 'Writing', title: 'Refine 2 Resume Bullets', description: 'Add metrics and action verbs to past project statements.', completed: false },
          { id: 't4', durationMinutes: 5, category: 'Review', title: 'Saved Professional Phrases Flashcards', description: 'Review 5 saved negotiation and alignment expressions.', completed: false },
        ],
      };
    } else {
      return {
        totalMinutes: 60,
        tasks: [
          { id: 't1', durationMinutes: 15, category: 'Interview Simulation', title: 'Full Mock Interview Turn (3 Questions)', description: 'Complete a behavioral, technical, and trade-off question series.', completed: false },
          { id: 't2', durationMinutes: 15, category: 'Job Description Lab', title: 'Parse 1 New Job Posting', description: 'Extract keywords, responsibilities, and align resume bullets.', completed: false },
          { id: 't3', durationMinutes: 15, category: 'Transfer Challenge', title: '4-Audience Concept Explanation', description: 'Explain a technical concept to an interviewer, manager, client, and mentee.', completed: false },
          { id: 't4', durationMinutes: 10, category: 'Networking', title: 'Draft Alumni Coffee Chat Message', description: 'Craft a personalized 15-minute informational interview request.', completed: false },
          { id: 't5', durationMinutes: 5, category: 'Progress Review', title: 'Career Readiness Index Review', description: 'Inspect updated skill gap map and log completed activities.', completed: false },
        ],
      };
    }
  }
}
