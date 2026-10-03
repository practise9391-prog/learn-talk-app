import React, { useState } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { PICTURE_SCENES_DATA } from '../../data/speakingIntelligenceData';
import { PictureSpeakingSceneItem } from '../../types/speakingIntelligence';
import { ttsService, sttService } from '../../services/aiService';
import { useUser } from '../../context/UserContext';
import {
  Image as ImageIcon,
  Mic,
  Volume2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Plane,
  Users,
  Lightbulb,
  Award,
} from 'lucide-react';

export const PictureSpeakingView: React.FC = () => {
  const { addSpokenMinutes } = useUser();
  const [selectedScene, setSelectedScene] = useState<PictureSpeakingSceneItem>(PICTURE_SCENES_DATA[0]);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [userSpeech, setUserSpeech] = useState<Record<number, string>>({});
  const [showModelAnswer, setShowModelAnswer] = useState<boolean>(false);

  const activeTask = selectedScene.tasks.find((t) => t.step === currentStep) || selectedScene.tasks[0];

  const handleRecordToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
      sttService.start({
        onResult: (transcript) => {
          setUserSpeech((prev) => ({ ...prev, [currentStep]: transcript }));
        },
        onError: () => {
          setIsRecording(false);
        },
      });
    } else {
      sttService.stop();
      setIsRecording(false);
      addSpokenMinutes(1);
    }
  };

  const handleListenScaffold = (phrase: string) => {
    ttsService.speak(phrase);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-16">
      <PageHeader
        title="Picture Description & Visual Speaking"
        subtitle="Observe visual scenes and progress through describing objects, actions, feelings & stories"
        badge="Visual Fluency"
        showBack={true}
      />

      {/* Scene Switcher */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {PICTURE_SCENES_DATA.map((scene) => (
          <button
            key={scene.id}
            type="button"
            onClick={() => {
              setSelectedScene(scene);
              setCurrentStep(1);
              setUserSpeech({});
              setShowModelAnswer(false);
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-black border transition-all ${
              selectedScene.id === scene.id
                ? 'bg-primary text-white border-primary shadow-xs'
                : 'bg-card border-border text-text hover:border-primary/30'
            }`}
          >
            {scene.title}
          </button>
        ))}
      </div>

      {/* Scene Visual & Description Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-br ${selectedScene.visualTheme} border border-border shadow-xs space-y-4`}>
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-card/80 text-text text-xs font-bold border border-border">
            {selectedScene.category}
          </span>
          <button
            type="button"
            onClick={() => ttsService.speak(selectedScene.scenePrompt)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-bold text-text hover:bg-surface"
          >
            <Volume2 size={14} className="text-primary" />
            <span>Narrate Scene</span>
          </button>
        </div>

        {/* Visual Scene Illustration container */}
        <div className="h-44 sm:h-56 rounded-2xl bg-card/60 border border-border/80 flex flex-col items-center justify-center text-center p-6 space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            {selectedScene.svgIconName === 'PlaneTakeoff' ? <Plane size={32} /> : <Users size={32} />}
          </div>
          <h4 className="text-base font-black text-text">{selectedScene.title}</h4>
          <p className="text-xs text-text-secondary max-w-lg leading-relaxed">
            {selectedScene.scenePrompt}
          </p>
        </div>
      </div>

      {/* 4-Step Interactive Task Navigation */}
      <div className="grid grid-cols-4 gap-2">
        {selectedScene.tasks.map((task) => {
          const isCurrent = task.step === currentStep;
          const isDone = Boolean(userSpeech[task.step]);
          return (
            <button
              key={task.step}
              type="button"
              onClick={() => setCurrentStep(task.step)}
              className={`p-3 rounded-2xl border text-center transition-all ${
                isCurrent
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : isDone
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                  : 'bg-card border-border text-text-secondary hover:text-text'
              }`}
            >
              <div className="text-[10px] uppercase font-black tracking-wider">Step {task.step}</div>
              <div className="text-xs font-bold truncate mt-0.5">{task.title.split(' ')[0]}</div>
            </button>
          );
        })}
      </div>

      {/* Active Task Workspace */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-primary block mb-1">
            Task {activeTask.step} of 4: {activeTask.title}
          </span>
          <h3 className="text-lg font-black text-text">{activeTask.instruction}</h3>
        </div>

        {/* Scaffolding Phrases */}
        <div className="p-4 rounded-2xl bg-surface/70 border border-border space-y-2">
          <div className="text-xs font-bold text-text-secondary">Useful Sentence Starters:</div>
          <div className="flex flex-wrap gap-2">
            {activeTask.scaffoldingPhrases.map((phrase, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleListenScaffold(phrase)}
                className="px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-medium text-text hover:border-primary flex items-center gap-1.5 transition-colors"
              >
                <Volume2 size={12} className="text-primary" />
                <span>"{phrase}"</span>
              </button>
            ))}
          </div>
        </div>

        {/* Speech input & live recognition */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-surface/40 border border-border min-h-[90px] flex items-center justify-center text-center">
            {isRecording ? (
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center mx-auto animate-pulse">
                  <Mic size={20} />
                </div>
                <div className="text-xs font-bold text-rose-500">Listening to your description...</div>
                <p className="text-xs text-text italic">
                  "{userSpeech[currentStep] || 'Speak your observation now...'}"
                </p>
              </div>
            ) : userSpeech[currentStep] ? (
              <div className="text-left w-full space-y-1">
                <span className="text-[10px] font-black uppercase text-emerald-500">Your Spoken Description:</span>
                <p className="text-sm font-semibold text-text">"{userSpeech[currentStep]}"</p>
              </div>
            ) : (
              <p className="text-xs text-text-secondary">
                Tap the record button below to speak your description for Step {currentStep}.
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleRecordToggle}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
                isRecording
                  ? 'bg-rose-500 text-white'
                  : 'bg-primary text-white hover:bg-primary/90 shadow-xs'
              }`}
            >
              <Mic size={16} />
              <span>{isRecording ? 'Stop Recording' : `Speak Step ${currentStep}`}</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowModelAnswer(!showModelAnswer)}
                className="px-4 py-2.5 rounded-2xl bg-surface border border-border text-xs font-bold text-text hover:bg-surface/80"
              >
                {showModelAnswer ? 'Hide Model Story' : 'View Model Story'}
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => (prev + 1) as any)}
                  className="px-5 py-2.5 rounded-2xl bg-secondary text-white text-xs font-black flex items-center gap-1.5 hover:bg-secondary/90 transition-all shadow-xs"
                >
                  <span>Next Step</span>
                  <ArrowRight size={14} />
                </button>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-black text-emerald-500 px-3 py-2 bg-emerald-500/10 rounded-2xl">
                  <CheckCircle2 size={16} />
                  <span>Scene Complete</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Model Story Accordion */}
        {showModelAnswer && (
          <div className="p-5 rounded-2xl bg-secondary/5 border border-secondary/20 space-y-3 animate-fade-in">
            <div className="text-xs font-black text-secondary uppercase tracking-wider">
              Native Model Narratives for this Scene:
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-card border border-border">
                <span className="font-bold text-text block mb-0.5">Beginner:</span>
                <p className="text-text-secondary">{selectedScene.modelNarratives.beginner}</p>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border">
                <span className="font-bold text-text block mb-0.5">Intermediate:</span>
                <p className="text-text-secondary">{selectedScene.modelNarratives.intermediate}</p>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border">
                <span className="font-bold text-text block mb-0.5">Advanced / Professional:</span>
                <p className="text-text-secondary">{selectedScene.modelNarratives.advanced}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
