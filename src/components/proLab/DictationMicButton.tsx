import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface DictationMicButtonProps {
  onTranscript: (transcript: string) => void;
  label?: string;
}

export const DictationMicButton: React.FC<DictationMicButtonProps> = ({
  onTranscript,
  label = 'Dictate',
}) => {
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your response.');
      return;
    }
    try {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => setIsListening(true);
      rec.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        if (text) onTranscript(text);
        setIsListening(false);
      };
      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
      rec.start();
    } catch {
      setIsListening(false);
    }
  };

  return (
    <button
      type="button"
      onClick={startListening}
      className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
        isListening
          ? 'bg-red-500 text-white border-red-500 animate-pulse'
          : 'bg-card border-border text-text-muted hover:text-text hover:border-primary/40'
      }`}
      title="Dictate speech with microphone"
    >
      {isListening ? <MicOff size={13} /> : <Mic size={13} />}
      <span>{isListening ? 'Listening...' : label}</span>
    </button>
  );
};
