import React, { useState, useEffect } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { RAPID_FIRE_PROMPTS } from '../../data/speakingIntelligenceData';
import { ttsService, sttService } from '../../services/aiService';
import { useUser } from '../../context/UserContext';
import { useAdaptiveLearning } from '../../context/AdaptiveLearningContext';
import {
  Zap,
  Mic,
  Volume2,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Flame,
  Award,
} from 'lucide-react';

export const RapidResponseArenaView: React.FC = () => {
  const { addSpokenMinutes } = useUser();
  const { recordEvidence } = useAdaptiveLearning();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(10);

  const currentPrompt = RAPID_FIRE_PROMPTS[currentIndex];

  useEffect(() => {
    let interval: any;
    if (isRecording && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (isRecording && timerSeconds === 0) {
      handleStopRecord();
    }
    return () => clearInterval(interval);
  }, [isRecording, timerSeconds]);

  const handleStartPromptAudio = () => {
    ttsService.speak(currentPrompt.question, {
      onEnd: () => {
        handleStartRecord();
      },
    });
  };

  const handleStartRecord = () => {
    setIsRecording(true);
    setTimerSeconds(10);

    sttService.start({
      onResult: (transcript) => {
        setAnswers((prev) => ({ ...prev, [currentIndex]: transcript }));
      },
      onError: () => {
        setIsRecording(false);
      },
    });
  };

  const handleStopRecord = () => {
    sttService.stop();
    setIsRecording(false);

    if (!answers[currentIndex]) {
      setAnswers((prev) => ({
        ...prev,
        [currentIndex]: currentPrompt.quickSample,
      }));
    }

    if (currentIndex < RAPID_FIRE_PROMPTS.length - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setTimerSeconds(10);
      }, 800);
    } else {
      setIsFinished(true);
      addSpokenMinutes(2);
      recordEvidence({
        sourceType: 'talk',
        sourceTitle: 'Rapid Fire Response Drill',
        targetSkill: 'fluency',
        accuracyScore: 92,
        difficulty: 'normal',
        hintsUsedCount: 0,
        contextType: 'spontaneous_speaking',
      });
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setAnswers({});
    setIsFinished(false);
    setTimerSeconds(10);
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto pb-16">
      <PageHeader
        title="Rapid Fire Speaking Drill"
        subtitle="Eliminate mental translation delays by answering quickly under a 10s timer"
        badge="Zero-Hesitation"
        showBack={true}
      />

      {!isFinished ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-6">
          {/* Progress header */}
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-black uppercase">
              Question {currentIndex + 1} of {RAPID_FIRE_PROMPTS.length} • {currentPrompt.category}
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-text-secondary">
              <Zap size={14} className="text-amber-500" />
              <span>Target: Quick Formation</span>
            </div>
          </div>

          {/* Question Box */}
          <div className="p-6 rounded-3xl bg-surface/70 border border-border text-center space-y-3">
            <button
              type="button"
              onClick={() => ttsService.speak(currentPrompt.question)}
              className="p-3 rounded-2xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors mx-auto"
            >
              <Volume2 size={24} />
            </button>
            <h3 className="text-2xl sm:text-3xl font-black text-text leading-snug">
              "{currentPrompt.question}"
            </h3>
          </div>

          {/* Timer and Recording indicator */}
          <div className="flex flex-col items-center justify-center gap-4">
            {isRecording ? (
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-rose-500 text-white flex items-center justify-center mx-auto animate-pulse shadow-lg shadow-rose-500/30">
                  <Mic size={28} />
                </div>
                <div className="text-3xl font-black text-rose-500">{timerSeconds}s</div>
                <p className="text-xs font-bold text-text-secondary">
                  Speak now! Don't overthink grammar—just say the first sentence that comes to mind.
                </p>
                {answers[currentIndex] && (
                  <div className="p-3 rounded-xl bg-card border border-border text-xs text-text italic">
                    "{answers[currentIndex]}"
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleStopRecord}
                  className="px-5 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-text hover:bg-surface/80"
                >
                  Next Question
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleStartPromptAudio}
                  className="px-6 py-3 rounded-2xl bg-primary text-white text-xs font-black flex items-center gap-2 hover:bg-primary/90 transition-all shadow-xs"
                >
                  <Volume2 size={16} />
                  <span>Listen & Respond (Auto-start)</span>
                </button>
                <button
                  type="button"
                  onClick={handleStartRecord}
                  className="px-6 py-3 rounded-2xl bg-emerald-600 text-white text-xs font-black flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-xs"
                >
                  <Mic size={16} />
                  <span>Answer Right Away</span>
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Results screen */
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
            <Award size={32} />
          </div>
          <h3 className="text-2xl font-black text-text">Rapid Drill Completed!</h3>
          <p className="text-xs text-text-secondary max-w-md mx-auto">
            You responded to all 5 quick prompts without hesitating. You are actively training your brain to bypass mental translation!
          </p>

          <div className="space-y-3 text-left">
            {RAPID_FIRE_PROMPTS.map((p, idx) => (
              <div key={p.id} className="p-4 rounded-2xl bg-surface/70 border border-border space-y-1.5">
                <div className="text-xs font-bold text-text">{p.question}</div>
                <div className="text-xs text-primary font-medium italic">
                  Your Answer: "{answers[idx] || p.quickSample}"
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={handleRestart}
              className="px-6 py-3 rounded-2xl bg-primary text-white text-xs font-black flex items-center gap-2 hover:bg-primary/90 transition-all shadow-xs"
            >
              <RotateCcw size={16} />
              <span>Practice Another Round</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
