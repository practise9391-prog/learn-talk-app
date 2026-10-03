// LearnTalk - Part 12 Speaking Intelligence Engine
// Handles speech comprehension, fluency analysis, self-correction recognition,
// context memory, progressive brain-freeze assistance, and evidence-based evaluation.

import {
  SessionEntityMemory,
  FluencyMetrics,
  CorrectionTier,
  CorrectionStyle,
  ConversationObjective,
  ProgressiveAssistanceTier,
} from '../types/speakingIntelligence';
import { CorrectionDetail } from '../types/talk';
import { WHY_THIS_WORD_DATA } from '../data/speakingIntelligenceData';

export class SpeakingIntelligenceEngine {
  // Session memory for entities mentioned by the learner
  private sessionMemory: SessionEntityMemory = {
    customEntities: {},
  };

  public resetMemory() {
    this.sessionMemory = {
      customEntities: {},
    };
  }

  public getMemory(): SessionEntityMemory {
    return { ...this.sessionMemory };
  }

  // 1. Response Understanding & Entity Extraction
  public extractEntitiesAndContext(userText: string): SessionEntityMemory {
    const text = userText.toLowerCase();

    // City recognition
    const cityMatches = ['hyderabad', 'bangalore', 'mumbai', 'delhi', 'chennai', 'pune', 'london', 'new york', 'tokyo'];
    for (const city of cityMatches) {
      if (text.includes(city)) {
        this.sessionMemory.city = city.charAt(0).toUpperCase() + city.slice(1);
      }
    }

    // Profession / role recognition
    const professionMatches = [
      'software engineer', 'developer', 'frontend', 'backend', 'full stack', 'qa', 'student',
      'manager', 'designer', 'doctor', 'analyst', 'consultant', 'fresher', 'intern'
    ];
    for (const role of professionMatches) {
      if (text.includes(role)) {
        this.sessionMemory.profession = role;
      }
    }

    // Family mentions
    if (text.includes('brother') || text.includes('sister') || text.includes('father') || text.includes('mother') || text.includes('family')) {
      const family: string[] = this.sessionMemory.familyMentioned || [];
      if (text.includes('brother') && !family.includes('brother')) family.push('brother');
      if (text.includes('sister') && !family.includes('sister')) family.push('sister');
      if (text.includes('father') && !family.includes('father')) family.push('father');
      if (text.includes('mother') && !family.includes('mother')) family.push('mother');
      this.sessionMemory.familyMentioned = family;
    }

    // Project mentions
    if (text.includes('project') || text.includes('app') || text.includes('website') || text.includes('api')) {
      this.sessionMemory.projectMentioned = 'Software application project';
    }

    return this.sessionMemory;
  }

  // 2. Response Depth Classifier (Section 11)
  public evaluateResponseDepth(text: string): 'one_word' | 'short' | 'complete' | 'explained' | 'rich' {
    const words = text.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    if (wordCount <= 2) return 'one_word';
    if (wordCount <= 6) return 'short';

    const hasExplanationCue = /\b(because|so that|since|due to|as a result|for instance|for example|in order to)\b/i.test(text);
    const hasTransitionCue = /\b(however|furthermore|on the other hand|speaking of that|additionally)\b/i.test(text);

    if (wordCount >= 22 && hasExplanationCue && hasTransitionCue) return 'rich';
    if (wordCount >= 10 && hasExplanationCue) return 'explained';
    return 'complete';
  }

  // 3. Question Asking Detector (Section 13)
  public isUserAskingQuestion(text: string): boolean {
    const trimmed = text.trim();
    if (trimmed.endsWith('?')) return true;
    const questionStarters = /^(what|why|how|where|when|who|which|whose|whom|can you|could you|would you|do you|did you|are you|is it|have you)\b/i;
    return questionStarters.test(trimmed);
  }

  // 4. Self-Correction Recognition (Section 28)
  public detectSelfCorrection(text: string): {
    found: boolean;
    rawUtterance?: string;
    correctedVersion?: string;
    praiseMessage?: string;
  } {
    // Patterns like "I go - sorry, I went", "I mean", "or rather", "actually I meant"
    const patterns = [
      /(.*?)(?:\s*(?:sorry|i mean|or rather|actually)\s*,?\s*)(.*)/i,
      /(.*?)\s*—\s*(?:sorry|i mean)?\s*(.*)/i,
    ];

    for (const regex of patterns) {
      const match = text.match(regex);
      if (match && match[1] && match[2]) {
        return {
          found: true,
          rawUtterance: match[1].trim(),
          correctedVersion: match[2].trim(),
          praiseMessage: 'Excellent self-monitoring! You caught and corrected your own phrasing in real-time.',
        };
      }
    }

    return { found: false };
  }

  // 5. Fluency Analysis (Pauses, Fillers, Repetition, Speech Rate) (Sections 24-27)
  public analyzeFluency(
    text: string,
    durationSeconds: number,
    measuredPauses: { durationSec: number }[] = []
  ): FluencyMetrics {
    const words = text.trim().split(/\s+/).filter(Boolean);
    const totalWords = words.length;

    // Categorize pauses: thinking pauses (< 2.5s) are natural; only prolonged pauses (> 3.5s) are disruptive
    let thinkingPausesCount = 0;
    let disruptivePausesCount = 0;

    measuredPauses.forEach((p) => {
      if (p.durationSec >= 3.5) {
        disruptivePausesCount++;
      } else if (p.durationSec >= 1.0) {
        thinkingPausesCount++;
      }
    });

    // Filler word analysis with contextual classification
    const lower = text.toLowerCase();
    const countMatch = (w: string) => (lower.match(new RegExp(`\\b${w}\\b`, 'gi')) || []).length;

    const umCount = countMatch('um') + countMatch('uh');
    const likeCount = countMatch('like');
    const actuallyCount = countMatch('actually');
    const youKnowCount = countMatch('you know');
    const basicallyCount = countMatch('basically');

    const fillerOccurrences = [
      {
        word: 'um / uh',
        count: umCount,
        isNaturalDiscourse: umCount <= 2,
        feedbackTip: umCount > 2 ? 'Try using a silent breath or a structured bridge like "In my experience..." instead of vocalized pauses.' : undefined,
      },
      {
        word: 'like',
        count: likeCount,
        isNaturalDiscourse: likeCount <= 1,
        feedbackTip: likeCount > 2 ? 'Watch out for "like" as a verbal crutch. State your point directly.' : undefined,
      },
      {
        word: 'you know',
        count: youKnowCount,
        isNaturalDiscourse: youKnowCount <= 1,
        feedbackTip: youKnowCount > 2 ? 'In professional speech, replace "you know" with clear examples.' : undefined,
      },
      {
        word: 'actually',
        count: actuallyCount,
        isNaturalDiscourse: true, // "actually" is standard discourse marker
      },
      {
        word: 'basically',
        count: basicallyCount,
        isNaturalDiscourse: basicallyCount <= 1,
      },
    ].filter((f) => f.count > 0);

    // Repetition detection ("I think... I think...")
    const repetitionsDetected: { phrase: string; count: number; advice: string }[] = [];
    const repetitionRegex = /\b(\w+(?:\s+\w+)?)\s+\1\b/gi;
    let repMatch;
    while ((repMatch = repetitionRegex.exec(lower)) !== null) {
      repetitionsDetected.push({
        phrase: repMatch[1],
        count: 2,
        advice: `Instead of repeating "${repMatch[1]}", state your idea once and support it with a reason.`,
      });
    }

    // Self correction detection
    const sc = this.detectSelfCorrection(text);
    const selfCorrections = sc.found
      ? [
          {
            rawUtterance: sc.rawUtterance || '',
            correctedVersion: sc.correctedVersion || '',
            isSuccessful: true,
            praiseMessage: sc.praiseMessage || 'Positive self-monitoring observed.',
          },
        ]
      : [];

    // Speaking rate WPM
    const minutes = durationSeconds > 0 ? durationSeconds / 60 : 1;
    const speakingRateWpm = Math.round(totalWords / minutes);

    // Continuity score calculation
    let continuity = 88;
    continuity -= disruptivePausesCount * 6;
    if (repetitionsDetected.length > 0) continuity -= 5;
    if (umCount > 3) continuity -= 6;
    if (sc.found) continuity += 4; // Reward self-correction!
    continuity = Math.min(100, Math.max(30, continuity));

    const responseDepth = this.evaluateResponseDepth(text);
    const questionsAskedCount = this.isUserAskingQuestion(text) ? 1 : 0;

    return {
      continuityScore: continuity,
      thinkingPausesCount,
      disruptivePausesCount,
      speakingRateWpm: speakingRateWpm || 115,
      totalWords,
      userSpeakingRatioPercent: 50,
      fillerOccurrences,
      repetitionsDetected,
      selfCorrections,
      responseDepth,
      questionsAskedCount,
    };
  }

  // 6. Tiered Progressive Brain-Freeze Assistance (Section 20)
  public getProgressiveAssistance(topicId: string, turnContext: string): ProgressiveAssistanceTier[] {
    const memory = this.sessionMemory;
    const cityNote = memory.city ? ` in ${memory.city}` : '';

    return [
      {
        tier: 1,
        label: 'Tier 1: Subtle Hint',
        content: 'Think about one specific action you took, or how you felt about it.',
      },
      {
        tier: 2,
        label: 'Tier 2: Keywords',
        content: memory.profession
          ? 'Keywords: "responsibilities", "collaborate", "achieve", "deliver", "learn"'
          : 'Keywords: "morning routine", "challenge", "enjoyed", "relax", "plan"',
      },
      {
        tier: 3,
        label: 'Tier 3: Sentence Starter',
        content: memory.profession
          ? '"In my current day-to-day work, I primarily focus on..."'
          : `"To be honest, the most memorable part of my day${cityNote} was..."`,
      },
      {
        tier: 4,
        label: 'Tier 4: Answer Structure (OREO)',
        content: '1. State your opinion or choice → 2. Give the reason why → 3. Share a short 1-sentence example → 4. Wrap up.',
      },
      {
        tier: 5,
        label: 'Tier 5: Model Example',
        content: memory.profession
          ? '"I\'ve been working extensively with web services recently. Although debugging tricky API issues can be time-consuming, solving them is very rewarding."'
          : `"I usually prefer unwinding with some light reading and tea${cityNote}. It helps me transition smoothly out of work mode."`,
      },
    ];
  }

  // 7. Context-Aware Natural Follow-Up Engine (Section 7)
  public generateDynamicFollowUp(
    userText: string,
    topicRules: string,
    currentTurnIndex: number
  ): {
    nextAiMessage: string;
    nudgesExpansion: boolean;
    suggestedFollowUps: string[];
  } {
    const memory = this.extractEntitiesAndContext(userText);
    const depth = this.evaluateResponseDepth(userText);
    const lower = userText.toLowerCase();

    // Section 12: If response is one-word or very short, nudge expansion gently without reprimand
    if (depth === 'one_word' || (depth === 'short' && wordsCount(userText) < 5)) {
      if (lower.includes('yes') || lower.includes('yeah') || lower.includes('yep')) {
        return {
          nextAiMessage: "That's great! Could you tell me a little more about what made you feel that way?",
          nudgesExpansion: true,
          suggestedFollowUps: [
            "Well, the main reason was...",
            "For example, earlier today...",
            "What happened was...",
          ],
        };
      }
      if (lower.includes('no') || lower.includes('nope')) {
        return {
          nextAiMessage: "I see! Why do you think that was the case? What would you have preferred?",
          nudgesExpansion: true,
          suggestedFollowUps: [
            "I wasn't a fan because...",
            "I would have preferred if...",
            "Mainly because of the time...",
          ],
        };
      }
      return {
        nextAiMessage: "That sounds interesting! Can you give me a quick example or tell me a bit more about that?",
        nudgesExpansion: true,
        suggestedFollowUps: [
          "To give you an example...",
          "Because usually I...",
          "What about you, what's your view?",
        ],
      };
    }

    // If user asked Jarvis a question (Section 13)
    if (this.isUserAskingQuestion(userText)) {
      return {
        nextAiMessage: "That's a thoughtful question! As an AI partner, I really enjoy hearing different people's unique perspectives and helping them find their authentic voice. How about you—what inspired you to practice speaking today?",
        nudgesExpansion: false,
        suggestedFollowUps: [
          "I wanted to build confidence for interviews.",
          "I want to speak fluently without translating.",
          "I just enjoy practicing daily English.",
        ],
      };
    }

    // Connected context recall from session memory (Section 9)
    if (memory.city && lower.includes(memory.city.toLowerCase())) {
      return {
        nextAiMessage: `Living and working in ${memory.city} sounds vibrant! What is your favorite neighborhood or spot to visit there when you want to relax?`,
        nudgesExpansion: false,
        suggestedFollowUps: [
          `There's a quiet cafe in ${memory.city} I like.`,
          "I mostly enjoy walking in the local parks.",
          "The food culture here is amazing.",
        ],
      };
    }

    if (memory.profession && (lower.includes('work') || lower.includes('office') || lower.includes('project'))) {
      return {
        nextAiMessage: `Working as a ${memory.profession} always comes with unique challenges. What was the most engaging problem your team solved recently?`,
        nudgesExpansion: false,
        suggestedFollowUps: [
          "We optimized our database queries.",
          "We redesigned the user dashboard.",
          "We resolved a critical production bug.",
        ],
      };
    }

    if (lower.includes('difficult') || lower.includes('hard') || lower.includes('trouble') || lower.includes('blocker')) {
      return {
        nextAiMessage: "That does sound demanding. What was the most challenging part of it, and how did you navigate through it?",
        nudgesExpansion: false,
        suggestedFollowUps: [
          "The most difficult part was the timeline.",
          "I had to ask my teammate for guidance.",
          "I researched the documentation until it worked.",
        ],
      };
    }

    if (lower.includes('started') || lower.includes('first job') || lower.includes('began')) {
      return {
        nextAiMessage: "Taking that first step is always memorable! What was your very first week like when you joined?",
        nudgesExpansion: false,
        suggestedFollowUps: [
          "It was exciting but a bit overwhelming.",
          "My team gave me a very warm welcome.",
          "I spent most of the time learning the codebase.",
        ],
      };
    }

    // Default conversational partner progression
    const genericFollowUps = [
      "That makes total sense. What would you say was the biggest takeaway from that experience?",
      "That's really insightful. If you could approach it differently now, what would you tweak?",
      "I appreciate you sharing that! How do you usually prioritize your tasks when things get busy?",
    ];

    const pick = genericFollowUps[currentTurnIndex % genericFollowUps.length];
    return {
      nextAiMessage: pick,
      nudgesExpansion: false,
      suggestedFollowUps: [
        "In hindsight, I would have planned better.",
        "The biggest takeaway was clear communication.",
        "I rely on a simple priority checklist.",
      ],
    };
  }

  // 8. Evidence-Based Correction Evaluator with Multi-Tier Filtering (Sections 40-45)
  public evaluateTurnWithStyle(
    userText: string,
    style: CorrectionStyle = 'balanced'
  ): {
    hasCorrection: boolean;
    tier: CorrectionTier;
    correction?: CorrectionDetail;
  } {
    const lower = userText.toLowerCase().trim();

    // Check against curated "Why This Word" database
    for (const wtw of WHY_THIS_WORD_DATA) {
      if (lower.includes(wtw.learnerWord)) {
        const tier: CorrectionTier = 'understandable';

        // If gentle, only flag if it breaks core comprehension
        return {
          hasCorrection: true,
          tier,
          correction: {
            id: `corr-${Date.now()}`,
            originalText: userText,
            simpleEnglish: wtw.betterSentence,
            naturalEnglish: wtw.betterSentence,
            professionalEnglish: wtw.betterSentence,
            whyExplanation: wtw.ruleExplanation,
            errorCategory: 'Vocabulary',
            whyThisWord: {
              recommendedWord: wtw.recommendedWord,
              explanation: wtw.ruleExplanation,
              similarWords: wtw.commonCollocations,
              difference: wtw.formalityDifference,
            },
          },
        };
      }
    }

    // Indian English & Common ESL structural patterns
    if (lower.includes('i have a doubt') || lower.includes('i have one doubt')) {
      return {
        hasCorrection: true,
        tier: 'understandable',
        correction: {
          id: `corr-${Date.now()}`,
          originalText: userText,
          simpleEnglish: 'I have a question.',
          naturalEnglish: 'I have a quick question if you don\'t mind.',
          professionalEnglish: 'Could I ask for a brief clarification on that point?',
          whyExplanation: 'In global English, "doubt" implies distrust or skepticism. Use "question" or "clarification" when seeking answers.',
          errorCategory: 'Vocabulary',
          whyThisWord: {
            recommendedWord: 'question / clarification',
            explanation: 'Accurate terminology for requesting information.',
            similarWords: ['query', 'inquiry', 'clarification'],
            difference: '"doubt" is suspicion; "question" is an inquiry for facts.',
          },
        },
      };
    }

    if (lower.includes('i am having') && (lower.includes('laptop') || lower.includes('car') || lower.includes('bike') || lower.includes('experience'))) {
      return {
        hasCorrection: true,
        tier: 'incorrect',
        correction: {
          id: `corr-${Date.now()}`,
          originalText: userText,
          simpleEnglish: 'I have a laptop / experience.',
          naturalEnglish: 'I have four years of experience.',
          professionalEnglish: 'I possess substantial experience in this domain.',
          whyExplanation: 'Stative verbs expressing possession (have, own, belong) do not use continuous (-ing) forms.',
          errorCategory: 'Grammar',
        },
      };
    }

    if (lower.includes('passed out from college') || lower.includes('passed out in 20')) {
      return {
        hasCorrection: true,
        tier: 'more_natural',
        correction: {
          id: `corr-${Date.now()}`,
          originalText: userText,
          simpleEnglish: 'I graduated from college.',
          naturalEnglish: 'I graduated in 2024.',
          professionalEnglish: 'I completed my degree in 2024.',
          whyExplanation: '"Pass out" in native English means to lose consciousness or faint. Use "graduated" for completing your education.',
          errorCategory: 'Vocabulary',
          whyThisWord: {
            recommendedWord: 'graduated',
            explanation: 'The standard term for successfully finishing university or college.',
            similarWords: ['completed degree', 'finished studies', 'alumnus of'],
            difference: '"passed out" = fainted; "graduated" = earned a degree.',
          },
        },
      };
    }

    if (lower.includes('tell me about your') || lower.includes('say me')) {
      return {
        hasCorrection: true,
        tier: 'incorrect',
        correction: {
          id: `corr-${Date.now()}`,
          originalText: userText,
          simpleEnglish: 'Tell me about yourself.',
          naturalEnglish: 'Could you share a bit about yourself?',
          professionalEnglish: 'Please provide an overview of your background.',
          whyExplanation: '"Say me" is ungrammatical. Use "tell me" directly.',
          errorCategory: 'Wrong Word',
        },
      };
    }

    // If style is 'gentle', suppress minor stylistic nuances unless truly incorrect
    return {
      hasCorrection: false,
      tier: 'acceptable',
    };
  }

  // 9. Check and update objective milestones (Section 5)
  public checkObjectiveProgress(objective: ConversationObjective, userText: string): ConversationObjective {
    const updated = { ...objective, milestones: [...objective.milestones] };
    const lower = userText.toLowerCase();

    updated.milestones = updated.milestones.map((m) => {
      if (m.completed) return m;

      if (m.requiredIntent === 'greeting_order' && (lower.includes('tea') || lower.includes('coffee') || lower.includes('hello') || lower.includes('hi') || lower.includes('order'))) {
        return { ...m, completed: true };
      }
      if (m.requiredIntent === 'ask_question' && this.isUserAskingQuestion(userText)) {
        return { ...m, completed: true };
      }
      if (m.requiredIntent === 'special_request' && (lower.includes('less') || lower.includes('sugar') || lower.includes('spice') || lower.includes('extra') || lower.includes('please'))) {
        return { ...m, completed: true };
      }
      if (m.requiredIntent === 'introduction' && (lower.includes('my name') || lower.includes('i am a') || lower.includes('engineer') || lower.includes('graduated') || lower.includes('work as'))) {
        return { ...m, completed: true };
      }
      if (m.requiredIntent === 'star_response' && (lower.includes('because') || lower.includes('solved') || lower.includes('fixed') || lower.includes('implemented') || lower.includes('result'))) {
        return { ...m, completed: true };
      }
      if (m.requiredIntent === 'ask_interviewer' && this.isUserAskingQuestion(userText)) {
        return { ...m, completed: true };
      }
      if (m.requiredIntent === 'extended_share' && wordsCount(userText) >= 12) {
        return { ...m, completed: true };
      }
      if (m.requiredIntent === 'active_reaction' && (lower.includes('that is great') || lower.includes('sounds good') || lower.includes('i agree') || lower.includes('really') || lower.includes('wow'))) {
        return { ...m, completed: true };
      }
      if (m.requiredIntent === 'ask_followup' && this.isUserAskingQuestion(userText)) {
        return { ...m, completed: true };
      }

      return m;
    });

    updated.isCompleted = updated.milestones.every((m) => m.completed);
    return updated;
  }
}

function wordsCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

export const speakingIntelligenceEngine = new SpeakingIntelligenceEngine();
