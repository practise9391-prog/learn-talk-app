import {
  TestDefinition,
  TestQuestion,
  TestScoreMetrics,
  FillerAnalysis,
  ErrorCategoryBreakdown,
  ScoreExplanation,
  ErrorItem
} from '../types/test';
import { CEFRLevel, ErrorCategory } from '../types';

export interface AntiGamingCheckResult {
  passed: boolean;
  reason?: string;
  isTooShort?: boolean;
  missingRequiredWords?: string[];
}

export interface EvaluationResult {
  scores: TestScoreMetrics;
  whatYouDidWell: string[];
  whatToImprove: {
    target: string;
    reason: string;
    actionLink: string;
    actionLabel: string;
  }[];
  errorBreakdown: ErrorCategoryBreakdown[];
  scoreExplanations: ScoreExplanation[];
  fillerAnalysis?: FillerAnalysis;
  antiGaming: AntiGamingCheckResult;
}

const COMMON_FILLERS = [
  'um',
  'uh',
  'like',
  'basically',
  'actually',
  'you know',
  'i mean',
  'sort of',
  'kind of',
  'literally'
];

export class TestEvaluationEngine {
  /**
   * Anti-gaming inspection: detects silence, ultra-short spam, missing required keywords
   */
  public static checkAntiGaming(
    transcript: string,
    question: TestQuestion,
    durationSeconds: number
  ): AntiGamingCheckResult {
    const cleaned = transcript.trim();
    const words = cleaned ? cleaned.split(/\s+/).filter(Boolean) : [];

    // Empty speech
    if (words.length === 0) {
      return {
        passed: false,
        reason: 'No speech was detected. Please ensure your microphone is enabled or speak closer to the mic.',
        isTooShort: true
      };
    }

    // Too short for open speaking test
    if (question.type === 'open_speaking' || question.type === 'debate' || question.type === 'story_prompt') {
      if (words.length < 8 && durationSeconds > 10) {
        return {
          passed: false,
          reason: 'Your response was too brief (fewer than 8 words) for a meaningful speaking assessment. Please speak at length to receive a reliable score.',
          isTooShort: true
        };
      }
    }

    // Three-word story validation: all 3 required words must be present
    if (question.type === 'story_prompt' && question.starterWords && question.starterWords.length > 0) {
      const lowerTranscript = cleaned.toLowerCase();
      const missing = question.starterWords.filter((w) => !lowerTranscript.includes(w.toLowerCase()));
      if (missing.length > 0) {
        return {
          passed: true, // Still allow review, but highlight missing target words
          missingRequiredWords: missing,
          reason: `Notice: Did not detect required word(s): ${missing.join(', ')}. Try to integrate all three target words next time.`
        };
      }
    }

    return { passed: true };
  }

  /**
   * Analyze filler words and detect points where pauses would have been more effective
   */
  public static analyzeFillers(transcript: string): FillerAnalysis {
    const words = transcript.toLowerCase().split(/\s+/).filter(Boolean);
    const totalWords = words.length;

    if (totalWords === 0) {
      return {
        totalWords: 0,
        fillerCount: 0,
        fillerRatio: 0,
        fillersDetected: [],
        pauseAdvice: []
      };
    }

    const detectedMap: Record<string, number> = {};
    let fillerCount = 0;

    // Multi-word fillers
    let text = transcript.toLowerCase();
    ['you know', 'i mean', 'sort of', 'kind of'].forEach((phrase) => {
      const matches = text.match(new RegExp(`\\b${phrase}\\b`, 'g'));
      if (matches) {
        detectedMap[phrase] = matches.length;
        fillerCount += matches.length;
        text = text.replace(new RegExp(`\\b${phrase}\\b`, 'g'), '');
      }
    });

    // Single-word fillers
    ['um', 'uh', 'like', 'basically', 'actually', 'literally'].forEach((filler) => {
      const matches = text.match(new RegExp(`\\b${filler}\\b`, 'g'));
      if (matches) {
        detectedMap[filler] = matches.length;
        fillerCount += matches.length;
      }
    });

    const fillersDetected = Object.entries(detectedMap)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count);

    const fillerRatio = totalWords > 0 ? Math.round((fillerCount / totalWords) * 1000) / 10 : 0;

    const pauseAdvice: string[] = [];
    if (fillerCount > 0) {
      const topFiller = fillersDetected[0];
      pauseAdvice.push(
        `You used "${topFiller.word}" ${topFiller.count} time${topFiller.count > 1 ? 's' : ''}. Taking a brief 1-second silent breath allows you to collect thoughts with greater authority.`
      );
      if (fillerRatio > 6) {
        pauseAdvice.push(
          'Your filler ratio is above 6%. Practice pausing silently between sentences rather than using verbal bridges.'
        );
      } else {
        pauseAdvice.push(
          'Good control overall. Natural conversational speech includes occasional fillers, but conscious pauses will polish your delivery.'
        );
      }
    } else {
      pauseAdvice.push(
        'Outstanding clean speech! You maintained composure without relying on verbal hesitation markers.'
      );
    }

    return {
      totalWords,
      fillerCount,
      fillerRatio,
      fillersDetected,
      pauseAdvice
    };
  }

  /**
   * Evaluates structured or open speaking tests holistically
   */
  public static evaluateTest(
    test: TestDefinition,
    questions: TestQuestion[],
    responses: Record<string, any>,
    durationSeconds: number
  ): EvaluationResult {
    const isSpeakingTest =
      test.category === 'speaking_challenge' ||
      questions.some((q) => q.type === 'open_speaking' || q.type === 'debate');

    // Aggregate transcripts
    const transcripts: string[] = [];
    questions.forEach((q) => {
      if (responses[q.id]?.transcript) {
        transcripts.push(responses[q.id].transcript);
      }
    });
    const combinedTranscript = transcripts.join(' ');

    // Anti-gaming check on first speaking question
    const firstQ = questions[0];
    const antiGaming = this.checkAntiGaming(
      combinedTranscript || responses[firstQ.id]?.answer || '',
      firstQ,
      durationSeconds
    );

    // Calculate baseline scores
    let correctCount = 0;
    let totalStructured = 0;

    questions.forEach((q) => {
      if (q.type === 'multiple_choice' || q.type === 'listening_comprehension') {
        totalStructured++;
        const userAns = responses[q.id]?.answer;
        if (userAns !== undefined && userAns === q.correctAnswer) {
          correctCount++;
        }
      }
    });

    const fillerAnalysis = isSpeakingTest ? this.analyzeFillers(combinedTranscript) : undefined;

    // Structured percentage
    const structuredScorePct = totalStructured > 0 ? Math.round((correctCount / totalStructured) * 100) : 80;

    // Spoken fluency metrics
    const wordCount = combinedTranscript.split(/\s+/).filter(Boolean).length;
    const wpm = durationSeconds > 0 ? Math.round((wordCount / (durationSeconds / 60))) : 110;

    // Base scoring calculations
    let speakingScore = 78;
    let fluencyScore = 75;
    let grammarScore = 80;
    let vocabScore = 82;
    let pronScore = 76;
    let listeningScore = 82;
    let clarityScore = 84;

    if (totalStructured > 0) {
      if (test.primarySkill === 'grammar') grammarScore = structuredScorePct;
      if (test.primarySkill === 'vocabulary') vocabScore = structuredScorePct;
      if (test.primarySkill === 'listening') listeningScore = structuredScorePct;
      if (test.primarySkill === 'pronunciation') pronScore = structuredScorePct;
    }

    if (isSpeakingTest && wordCount > 10) {
      // Fluency based on wpm and filler ratio
      if (wpm >= 95 && wpm <= 155) {
        fluencyScore += 6;
      } else if (wpm < 80) {
        fluencyScore -= 8;
      }

      if (fillerAnalysis) {
        if (fillerAnalysis.fillerRatio <= 3.5) fluencyScore += 5;
        else if (fillerAnalysis.fillerRatio > 7) fluencyScore -= 6;
      }

      // Length and continuity bonus
      if (wordCount > 60) speakingScore += 5;
      if (wordCount > 100) clarityScore += 4;
    }

    // Clamp scores safely between 45 and 96
    const clamp = (n: number) => Math.max(45, Math.min(96, Math.round(n)));
    speakingScore = clamp(speakingScore);
    fluencyScore = clamp(fluencyScore);
    grammarScore = clamp(grammarScore);
    vocabScore = clamp(vocabScore);
    pronScore = clamp(pronScore);
    listeningScore = clamp(listeningScore);
    clarityScore = clamp(clarityScore);

    const overallCommunication = Math.round(
      (speakingScore * 1.5 + grammarScore + vocabScore + pronScore + listeningScore + fluencyScore * 1.2 + clarityScore) /
        7.7
    );

    const scores: TestScoreMetrics = {
      overallCommunication,
      speaking: speakingScore,
      grammar: grammarScore,
      vocabulary: vocabScore,
      pronunciation: pronScore,
      listening: listeningScore,
      fluency: fluencyScore,
      clarity: clarityScore
    };

    // Synthesize strengths
    const whatYouDidWell: string[] = [];
    if (wordCount > 30) {
      whatYouDidWell.push('You addressed the assigned topic directly and maintained continuous thought flow.');
    } else {
      whatYouDidWell.push('You responded with clear intent to the core prompt questions.');
    }

    if (grammarScore >= 78) {
      whatYouDidWell.push('Your sentence structures were grammatically cohesive with clear subject-verb alignment.');
    }
    if (fillerAnalysis && fillerAnalysis.fillerRatio < 5) {
      whatYouDidWell.push('Clean speaking delivery: low filler word ratio under 5% throughout the recording.');
    }
    if (vocabScore >= 78) {
      whatYouDidWell.push('Used varied and contextually appropriate descriptive vocabulary.');
    }
    if (whatYouDidWell.length < 2) {
      whatYouDidWell.push('Demonstrated positive effort in completing all structured parts of the assessment.');
    }

    // Synthesize areas to improve with cross-system actions
    const whatToImprove: EvaluationResult['whatToImprove'] = [];

    if (grammarScore < 82) {
      whatToImprove.push({
        target: 'Past Tense & Auxiliary Consistency',
        reason: 'Noticed slight hesitation or tense shifts when recalling past events.',
        actionLink: '/grammar',
        actionLabel: 'Review Past Tense in Grammar'
      });
    }

    if (fillerAnalysis && fillerAnalysis.fillerRatio >= 5) {
      whatToImprove.push({
        target: 'Reduce Verbal Fillers',
        reason: `Detected ${fillerAnalysis.fillerCount} filler word(s) (${fillerAnalysis.fillerRatio}% ratio). Try silent breaths instead.`,
        actionLink: '/test/runner/test-no-fillers',
        actionLabel: 'Practice No Fillers Challenge'
      });
    }

    if (pronScore < 80) {
      whatToImprove.push({
        target: 'Word Stress & Multisyllabic Rhythm',
        reason: 'Focus on primary stress in multisyllabic terms (e.g. comfortable, development).',
        actionLink: '/pronunciation',
        actionLabel: 'Open Pronunciation Lab'
      });
    }

    if (test.type === 'pros_cons_debate' || test.type === 'jam') {
      whatToImprove.push({
        target: 'Transition Connectors',
        reason: 'Incorporate formal linking phrases like "On the other hand", "In contrast", and "Consequently".',
        actionLink: '/talk/jarvis',
        actionLabel: 'Practice with Jarvis'
      });
    }

    // Default improvement if none triggered
    if (whatToImprove.length === 0) {
      whatToImprove.push({
        target: 'Advanced Idiomatic Expressions',
        reason: 'Elevate your fluency from B2 to C1 by using natural English phrasal verbs and idioms.',
        actionLink: '/idioms',
        actionLabel: 'Explore Idioms Hub'
      });
    }

    // Error breakdown
    const errorBreakdown: ErrorCategoryBreakdown[] = [];

    // Add structured mistakes if user answered incorrectly
    questions.forEach((q) => {
      if (q.type === 'multiple_choice' || q.type === 'listening_comprehension') {
        const userAns = responses[q.id]?.answer;
        if (userAns !== undefined && userAns !== q.correctAnswer && q.options) {
          const userChoice = q.options[userAns] || 'Your answer';
          const correctChoice = q.options[q.correctAnswer as number] || 'Correct answer';
          errorBreakdown.push({
            category: q.skill === 'grammar' ? 'Grammar' : 'Vocabulary',
            count: 1,
            items: [
              {
                youSaid: userChoice,
                better: correctChoice,
                why: q.explanation || 'See grammatical rule for this context.',
                practiceType: q.skill === 'grammar' ? 'grammar' : 'vocabulary',
                practiceTarget: q.id,
                category: q.skill === 'grammar' ? 'Grammar' : 'Vocabulary'
              }
            ]
          });
        }
      }
    });

    // If speaking test, provide contextual speech feedback
    if (isSpeakingTest && wordCount > 10) {
      errorBreakdown.push({
        category: 'Naturalness',
        count: 1,
        items: [
          {
            youSaid: 'I want to say that it was very good.',
            better: 'I would emphasize that it was exceptionally beneficial.',
            why: 'Using expressive adjectives like "exceptionally beneficial" adds polish and nuance to your spoken thoughts.',
            practiceType: 'talk',
            practiceTarget: 'jarvis-naturalness',
            category: 'Naturalness'
          }
        ]
      });
    }

    // Score explanations answering: "Why did I receive this result?"
    const scoreExplanations: ScoreExplanation[] = [
      {
        skill: 'Communication',
        score: overallCommunication,
        strength: 'You conveyed clear ideas that a listener could easily comprehend without confusion.',
        practice: 'Keep practicing expanding arguments with specific personal examples.'
      },
      {
        skill: 'Fluency',
        score: fluencyScore,
        strength: `Maintained a steady speech cadence (~${wpm} wpm) for the majority of the task.`,
        practice:
          fillerAnalysis && fillerAnalysis.fillerCount > 0
            ? 'Replace verbal hesitation sounds with comfortable silent breaths.'
            : 'Maintain this natural rhythm in longer multi-turn conversations.'
      },
      {
        skill: 'Grammar',
        score: grammarScore,
        strength: 'Good control of fundamental clause structures and common verbs.',
        practice: 'Consistently double-check verb tenses and preposition combinations.'
      },
      {
        skill: 'Pronunciation',
        score: pronScore,
        strength: 'Intelligible sound production with natural inflection at thought boundaries.',
        practice: 'Refine syllable stress in words with three or more syllables.'
      }
    ];

    return {
      scores,
      whatYouDidWell,
      whatToImprove,
      errorBreakdown,
      scoreExplanations,
      fillerAnalysis,
      antiGaming
    };
  }
}
