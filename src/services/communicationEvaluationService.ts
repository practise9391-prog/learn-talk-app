import {
  WritingEvaluationResult,
  WritingCorrection,
  WritingPromptItem,
  WritingTone,
  ListeningSpeed,
} from '../types/communication';

export class CommunicationEvaluationService {
  /**
   * Synthesizes speech using the browser Web Speech API with speed adjustment.
   */
  public static speakText(
    text: string,
    speed: ListeningSpeed = '1x',
    voiceGender: 'male' | 'female' = 'female',
    onEnd?: () => void
  ): { cancel: () => void } {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      if (onEnd) onEnd();
      return { cancel: () => {} };
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    // Speed mapping
    let rate = 1.0;
    if (speed === '0.75x') rate = 0.75;
    else if (speed === '1.25x') rate = 1.25;
    else if (speed === '1.5x') rate = 1.45;
    utterance.rate = rate;

    // Pick voice if available
    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (voiceGender === 'female' ? /female|woman|samantha|zira|karen/i.test(v.name) : /male|david|george|alex/i.test(v.name))
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (targetVoice) {
      utterance.voice = targetVoice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    window.speechSynthesis.speak(utterance);

    return {
      cancel: () => window.speechSynthesis.cancel(),
    };
  }

  /**
   * Evaluates dictation by comparing learner text with the original sentence.
   */
  public static evaluateDictation(
    submittedText: string,
    originalText: string
  ): {
    accuracy: number;
    isExactMatch: boolean;
    differences: { word: string; status: 'correct' | 'missing' | 'incorrect' }[];
    feedback: string;
  } {
    const cleanSub = submittedText.trim().toLowerCase().replace(/[.,!?;:]/g, '');
    const cleanOrig = originalText.trim().toLowerCase().replace(/[.,!?;:]/g, '');

    const subWords = cleanSub.split(/\s+/).filter(Boolean);
    const origWords = cleanOrig.split(/\s+/).filter(Boolean);

    let matchCount = 0;
    const differences: { word: string; status: 'correct' | 'missing' | 'incorrect' }[] = [];

    origWords.forEach((origWord, idx) => {
      const subWord = subWords[idx];
      if (subWord === origWord) {
        matchCount++;
        differences.push({ word: origWord, status: 'correct' });
      } else if (!subWord) {
        differences.push({ word: origWord, status: 'missing' });
      } else {
        differences.push({ word: `${subWord} â†’ ${origWord}`, status: 'incorrect' });
      }
    });

    const accuracy = Math.round((matchCount / Math.max(1, origWords.length)) * 100);
    const isExactMatch = cleanSub === cleanOrig;

    let feedback = 'Excellent listening precision! Every word was accurately transcribed.';
    if (accuracy < 60) {
      feedback = 'Listen once more at 0.75x speed. Pay close attention to ending sounds and small prepositions.';
    } else if (accuracy < 90) {
      feedback = 'Very close! Check small tense forms or short words like articles.';
    }

    return { accuracy, isExactMatch, differences, feedback };
  }

  /**
   * Evaluates open-ended listening answers semantically.
   */
  public static evaluateOpenEndedListening(
    userAnswer: string,
    acceptableAnswers: string[] = [],
    keyEvidence: string
  ): {
    rating: 'correct' | 'acceptable' | 'partially_correct' | 'needs_review';
    score: number;
    explanation: string;
  } {
    const lowerUser = userAnswer.toLowerCase().trim();
    if (lowerUser.length < 3) {
      return {
        rating: 'needs_review',
        score: 25,
        explanation: 'Please provide a more complete answer based on what you heard.',
      };
    }

    // 1. Direct or fuzzy match with acceptable variants
    const matched = acceptableAnswers.some((ans) => {
      const lowerAns = ans.toLowerCase();
      return lowerUser.includes(lowerAns) || lowerAns.includes(lowerUser);
    });

    if (matched) {
      return {
        rating: 'correct',
        score: 95,
        explanation: `Spot on! You accurately captured the speaker's meaning: "${keyEvidence}".`,
      };
    }

    // 2. Keyword overlap check
    const keywords = keyEvidence.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    const matchedKeywords = keywords.filter((kw) => lowerUser.includes(kw));

    if (matchedKeywords.length >= 2) {
      return {
        rating: 'acceptable',
        score: 80,
        explanation: `Good understanding! You identified core details: ${matchedKeywords.join(', ')}.`,
      };
    }

    return {
      rating: 'partially_correct',
      score: 55,
      explanation: `Partially related, but check the audio evidence again: "${keyEvidence}".`,
    };
  }

  /**
   * Comprehensive Writing Evaluation Engine
   * Evaluates task completion, grammar, vocabulary, organization, and tone.
   */
  public static evaluateWriting(
    submissionText: string,
    prompt: WritingPromptItem
  ): WritingEvaluationResult {
    const words = submissionText.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const lowerText = submissionText.toLowerCase();

    const corrections: WritingCorrection[] = [];

    // 1. Common Grammar & Style Heuristics
    // A. Double negatives
    if (/don't\s+no|can't\s+no|didn't\s+no/i.test(submissionText)) {
      corrections.push({
        id: 'c-double-neg',
        originalSnippet: 'double negative phrase',
        suggestedCorrection: 'use single negative with "any"',
        issueType: 'Grammar',
        explanation: 'Avoid double negatives in standard English (e.g., "I don\'t have any" instead of "don\'t have no").',
        ruleName: 'Double Negatives',
      });
    }

    // B. Past tense with yesterday / ago
    if (/(yesterday|last\s+week|two\s+days\s+ago)\s+I\s+(go|see|buy|come|eat)/i.test(submissionText)) {
      corrections.push({
        id: 'c-past-tense',
        originalSnippet: 'present tense with past time word',
        suggestedCorrection: 'I went / I saw / I bought',
        issueType: 'Grammar',
        explanation: 'Specific past time markers like "yesterday" require the simple past tense.',
        ruleName: 'Past Tense Form',
      });
    }

    // C. Subject-Verb agreement with "He/She/It"
    if (/\b(he|she|it|everyone|someone)\s+(are|have|do|go|want)\b/i.test(submissionText)) {
      corrections.push({
        id: 'c-subj-verb',
        originalSnippet: 'subject verb mismatch',
        suggestedCorrection: 'he/she is, has, does, wants',
        issueType: 'Grammar',
        explanation: 'Third person singular subjects require the singular verb ending with -s.',
        ruleName: 'Subject-Verb Agreement',
      });
    }

    // D. Missing capitalization at start of sentences
    if (/(^|[.!?]\s+)([a-z])/.test(submissionText)) {
      corrections.push({
        id: 'c-cap',
        originalSnippet: 'lowercase sentence starter',
        suggestedCorrection: 'Capitalize the first letter of each sentence',
        issueType: 'Punctuation',
        explanation: 'Sentences in written English must begin with a capital letter.',
        ruleName: 'Capitalization',
      });
    }

    // E. Informal contractions in formal writing
    if (prompt.tone === 'formal' || prompt.tone === 'professional') {
      if (/\b(wanna|gonna|gotta|kinda|dunno|y'all)\b/i.test(submissionText)) {
        corrections.push({
          id: 'c-slang-tone',
          originalSnippet: 'casual spoken contraction',
          suggestedCorrection: 'want to / going to / have to',
          issueType: 'Tone',
          explanation: 'Colloquial speech contractions like "wanna" should be written out in formal business correspondence.',
          ruleName: 'Formal Register',
        });
      }
    }

    // 2. Task Completion & Keywords
    let keywordMatches = 0;
    prompt.targetKeywords.forEach((kw) => {
      if (lowerText.includes(kw.toLowerCase())) {
        keywordMatches++;
      }
    });

    const keywordRatio = prompt.targetKeywords.length > 0 ? keywordMatches / prompt.targetKeywords.length : 1;
    const lengthSatisfied =
      wordCount >= prompt.targetLengthWords.min && wordCount <= prompt.targetLengthWords.max * 1.5;

    // 3. Compute Rubric Scores
    const taskCompletionScore = Math.min(
      100,
      Math.round((lengthSatisfied ? 50 : 30) + keywordRatio * 50)
    );

    const grammarScore = Math.max(40, 100 - corrections.filter((c) => c.issueType === 'Grammar').length * 20);
    const vocabularyScore = Math.min(100, Math.round(50 + keywordMatches * 15 + Math.min(30, wordCount / 3)));
    const organizationScore = submissionText.includes('\n') || submissionText.includes('.') ? 85 : 60;
    const toneScore = corrections.some((c) => c.issueType === 'Tone') ? 65 : 90;

    const overallScore = Math.round(
      taskCompletionScore * 0.25 +
        grammarScore * 0.25 +
        vocabularyScore * 0.2 +
        organizationScore * 0.15 +
        toneScore * 0.15
    );

    let qualityTier: WritingEvaluationResult['qualityTier'] = 'acceptable';
    if (overallScore >= 90) qualityTier = 'professional';
    else if (overallScore >= 80) qualityTier = 'natural';
    else if (overallScore >= 60) qualityTier = 'acceptable';
    else qualityTier = 'needs_revision';

    let feedbackSummary = 'Good effort! Your ideas are clear and the core communication goal was fulfilled.';
    if (corrections.length > 0) {
      feedbackSummary = `Well written overall. Focus on refining ${corrections[0].issueType.toLowerCase()} to elevate naturalness.`;
    } else if (overallScore >= 88) {
      feedbackSummary = 'Excellent writing! Clear organization, accurate grammar, and an authentic professional tone.';
    }

    // 4. Generate Alternative Versions
    const betterAlternativeVersions = prompt.modelResponses.map((mr) => ({
      tone: mr.quality === 'professional' ? 'Polite & Professional' : 'Natural Conversational',
      text: mr.text,
      explanation: mr.explanation,
    }));

    return {
      overallScore,
      qualityTier,
      feedbackSummary,
      corrections,
      betterAlternativeVersions,
      rubricScores: {
        taskCompletion: taskCompletionScore,
        grammar: grammarScore,
        vocabulary: vocabularyScore,
        organization: organizationScore,
        tone: toneScore,
      },
    };
  }
}
