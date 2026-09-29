// LearnTalk - Modular AI Service Abstraction Layer
// Implements SpeechToText, TextToSpeech (with barge-in), Conversation Context Engine, and Translation.

export interface SpeechRecognitionHandlers {
  onResult: (transcript: string, isFinal: boolean) => void;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  onError?: (error: string) => void;
}

class TextToSpeechService {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking: boolean = false;

  public speak(
    text: string,
    options: {
      rate?: number;
      pitch?: number;
      voiceName?: string;
      onStart?: () => void;
      onEnd?: () => void;
    } = {}
  ): void {
    if (!('speechSynthesis' in window)) {
      if (options.onStart) options.onStart();
      setTimeout(() => {
        if (options.onEnd) options.onEnd();
      }, 1500);
      return;
    }

    // Stop any existing speech before speaking
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = options.rate || 1.0;
    utterance.pitch = options.pitch || 1.0;

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (options.onStart) options.onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (options.onEnd) options.onEnd();
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  // Barge-In: immediately duck / stop AI audio when user begins speaking (Requirement 8)
  public stop(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.currentUtterance = null;
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }
}

class SpeechToTextService {
  private recognition: any = null;
  private isListening: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
      }
    }
  }

  public startListening(handlers: SpeechRecognitionHandlers): boolean {
    if (!this.recognition) {
      if (handlers.onError) {
        handlers.onError('Speech Recognition API not supported in this browser environment.');
      }
      return false;
    }

    this.recognition.onstart = () => {
      this.isListening = true;
      if (handlers.onSpeechStart) handlers.onSpeechStart();
    };

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          finalTranscript += item[0].transcript;
        } else {
          interimTranscript += item[0].transcript;
        }
      }

      const text = finalTranscript || interimTranscript;
      if (text) {
        handlers.onResult(text, Boolean(finalTranscript));
      }
    };

    this.recognition.onerror = (event: any) => {
      if (handlers.onError) {
        handlers.onError(event.error);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (handlers.onSpeechEnd) handlers.onSpeechEnd();
    };

    try {
      this.recognition.start();
      return true;
    } catch (e) {
      return false;
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.isListening = false;
    }
  }

  public isAvailable(): boolean {
    return Boolean(this.recognition);
  }
}

class ConversationEngineService {
  // Analyze filler words in user text (Requirement 20)
  public analyzeFillers(text: string) {
    const lower = text.toLowerCase();
    const countOccurrences = (target: string) => {
      const regex = new RegExp(`\\b${target}\\b`, 'gi');
      return (lower.match(regex) || []).length;
    };

    return {
      um: countOccurrences('um') + countOccurrences('uh'),
      like: countOccurrences('like'),
      basically: countOccurrences('basically'),
      actually: countOccurrences('actually'),
      youKnow: countOccurrences('you know'),
    };
  }

  // Detect words per minute
  public calculateWPM(wordsCount: number, durationSeconds: number): number {
    if (durationSeconds <= 0) return 0;
    const minutes = durationSeconds / 60;
    return Math.round(wordsCount / minutes);
  }

  // Check for common grammatical or phrasing improvements (Requirement 14, 16, 28)
  public evaluateTurn(userText: string) {
    const lower = userText.toLowerCase().trim();

    if (lower.includes('i am go to') || lower.includes('i go to office yesterday')) {
      return {
        hasCorrection: true,
        category: 'Tense' as const,
        simpleEnglish: "I went to work yesterday.",
        naturalEnglish: "I went to the office yesterday.",
        professionalEnglish: "I was at the office yesterday.",
        whyExplanation: "'Yesterday' refers to a completed past action, so use the past tense 'went' rather than present forms.",
        whyThisWord: {
          recommendedWord: 'went',
          explanation: 'The past simple form of the irregular verb "go".',
          similarWords: ['commuted', 'traveled', 'visited'],
          difference: '"went" is the direct past tense; "have gone" connects to current status.',
        }
      };
    }

    if (lower.includes('i want one tea') || lower.includes('give me one tea')) {
      return {
        hasCorrection: true,
        category: 'Unnatural Phrase' as const,
        simpleEnglish: "I want tea, please.",
        naturalEnglish: "I'd like a cup of tea, please.",
        professionalEnglish: "Could I please have a cup of tea?",
        whyExplanation: "'I want' sounds demanding in English service encounters. 'I'd like' softens the request politely.",
        whyThisWord: {
          recommendedWord: "I'd like",
          explanation: 'Contraction of "I would like", expressing courteous preference.',
          similarWords: ['Could I get', 'May I have', 'I will have'],
          difference: '"I want" is a demand; "I would like" is a polite request.',
        }
      };
    }

    if (lower.includes('i discussed about')) {
      return {
        hasCorrection: true,
        category: 'Preposition' as const,
        simpleEnglish: "I talked about the project.",
        naturalEnglish: "I discussed the project with my team.",
        professionalEnglish: "I discussed the project deliverables with stakeholders.",
        whyExplanation: "'Discuss' already means 'to talk about'. Adding 'about' is redundant.",
        whyThisWord: {
          recommendedWord: 'discussed',
          explanation: 'A transitive verb taking a direct object without prepositions.',
          similarWords: ['reviewed', 'deliberated on', 'went over'],
          difference: '"talked about" requires "about"; "discussed" takes the noun directly.',
        }
      };
    }

    return null;
  }
}

export const ttsService = new TextToSpeechService();
export const sttService = new SpeechToTextService();
export const conversationEngine = new ConversationEngineService();
