import React, { useState } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { useCommunicationSkills } from '../../context/CommunicationSkillsContext';
import { useNavigation } from '../../context/NavigationContext';
import { useUser } from '../../context/UserContext';
import {
  Volume2,
  BookOpen,
  Edit3,
  Mic,
  Sparkles,
  Play,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
  Award,
  Zap,
  TrendingUp,
  Filter,
} from 'lucide-react';
import { ListeningContentItem, ReadingContentItem, WritingPromptItem, CommunicationChallenge } from '../../types/communication';
import { ListeningSessionModal } from './ListeningSessionModal';
import { ReadingPassageModal } from './ReadingPassageModal';
import { WritingStudioModal } from './WritingStudioModal';

export const CommunicationHubView: React.FC = () => {
  const {
    listeningItems,
    readingItems,
    writingPrompts,
    communicationChallenges,
    communicationSkillSummary,
    completeChallengeStep,
  } = useCommunicationSkills();

  const { user } = useUser();
  const { navigate } = useNavigation();

  const [activeTab, setActiveTab] = useState<'overview' | 'listening' | 'reading' | 'writing' | 'challenges'>('overview');

  // Modal active items
  const [selectedListening, setSelectedListening] = useState<ListeningContentItem | null>(null);
  const [selectedReading, setSelectedReading] = useState<ReadingContentItem | null>(null);
  const [selectedWriting, setSelectedWriting] = useState<WritingPromptItem | null>(null);

  const skillsList = [
    { name: 'Listening', score: communicationSkillSummary.listening, icon: Volume2, color: 'text-indigo-500 bg-indigo-500/10' },
    { name: 'Reading', score: communicationSkillSummary.reading, icon: BookOpen, color: 'text-emerald-500 bg-emerald-500/10' },
    { name: 'Writing', score: communicationSkillSummary.writing, icon: Edit3, color: 'text-amber-500 bg-amber-500/10' },
    { name: 'Speaking', score: communicationSkillSummary.speaking, icon: Mic, color: 'text-primary bg-primary/10' },
    { name: 'Grammar', score: communicationSkillSummary.grammar, icon: CheckCircle2, color: 'text-rose-500 bg-rose-500/10' },
    { name: 'Vocabulary', score: communicationSkillSummary.vocabulary, icon: Sparkles, color: 'text-cyan-500 bg-cyan-500/10' },
    { name: 'Pronunciation', score: communicationSkillSummary.pronunciation, icon: Zap, color: 'text-purple-500 bg-purple-500/10' },
    { name: 'Fluency', score: communicationSkillSummary.fluency, icon: TrendingUp, color: 'text-blue-500 bg-blue-500/10' },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        title="Communication Skills Ecosystem"
        subtitle="Listen, Read, Write & Speak: An interconnected communication platform for real-world fluency"
        badge="Part 16 Core"
        showBack={true}
      />

      {/* Unified Communication Loop Visualizer */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/10 via-secondary/5 to-card border border-primary/20 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-text">
              The 4-Skill Unified Learning Loop
            </span>
          </div>
          <span className="text-xs font-bold text-primary">Interconnected System</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3.5 rounded-2xl bg-surface/80 border border-border">
            <Volume2 size={20} className="text-indigo-500 mx-auto mb-1.5" />
            <span className="text-xs font-bold text-text block">1. Listen</span>
            <span className="text-[10px] text-text-muted">Acoustic decoding & speech rhythm</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-surface/80 border border-border">
            <BookOpen size={20} className="text-emerald-500 mx-auto mb-1.5" />
            <span className="text-xs font-bold text-text block">2. Read</span>
            <span className="text-[10px] text-text-muted">Comprehension & lexical acquisition</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-surface/80 border border-border">
            <Edit3 size={20} className="text-amber-500 mx-auto mb-1.5" />
            <span className="text-xs font-bold text-text block">3. Write</span>
            <span className="text-[10px] text-text-muted">Sentence structure & deliberate thought</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-surface/80 border border-border">
            <Mic size={20} className="text-primary mx-auto mb-1.5" />
            <span className="text-xs font-bold text-text block">4. Speak</span>
            <span className="text-[10px] text-text-muted">Vocal production & real conversation</span>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'overview', label: 'Skills Overview', icon: Layers },
          { id: 'listening', label: `Listening Studio (${listeningItems.length})`, icon: Volume2 },
          { id: 'reading', label: `Reading Studio (${readingItems.length})`, icon: BookOpen },
          { id: 'writing', label: `Writing Studio (${writingPrompts.length})`, icon: Edit3 },
          { id: 'challenges', label: `Cross-Challenges (${communicationChallenges.length})`, icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 border ${
                isActive
                  ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                  : 'bg-card text-text-muted hover:text-text border-border hover:bg-surface'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 8-Skills Grid */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-text">8 Communication Dimensions</h3>
                <p className="text-xs text-text-muted">Evidence synthesized across listening, reading, writing, and speaking activities</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {skillsList.map((sk) => {
                const Icon = sk.icon;
                return (
                  <div key={sk.name} className="p-4 rounded-2xl bg-surface border border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${sk.color}`}>
                        <Icon size={16} />
                      </div>
                      <span className="font-mono font-black text-text text-sm">{sk.score}%</span>
                    </div>
                    <span className="text-xs font-bold text-text block">{sk.name}</span>
                    <div className="w-full bg-card h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-500"
                        style={{ width: `${sk.score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Start Next Activity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              onClick={() => setSelectedListening(listeningItems[0])}
              className="p-5 rounded-3xl bg-card border border-border hover:border-primary/40 cursor-pointer shadow-xs transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-500 text-[10px] font-bold uppercase tracking-wider">
                  Listening
                </span>
                <h4 className="text-sm font-bold text-text">{listeningItems[0].title}</h4>
                <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                  {listeningItems[0].subtitle}
                </p>
              </div>
              <span className="text-xs font-bold text-primary flex items-center gap-1">
                <span>Start Listening</span>
                <ArrowRight size={13} />
              </span>
            </div>

            <div
              onClick={() => setSelectedReading(readingItems[0])}
              className="p-5 rounded-3xl bg-card border border-border hover:border-primary/40 cursor-pointer shadow-xs transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">
                  Reading
                </span>
                <h4 className="text-sm font-bold text-text">{readingItems[0].title}</h4>
                <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                  Interactive passage with vocabulary inspection and comprehension test.
                </p>
              </div>
              <span className="text-xs font-bold text-primary flex items-center gap-1">
                <span>Read Passage</span>
                <ArrowRight size={13} />
              </span>
            </div>

            <div
              onClick={() => setSelectedWriting(writingPrompts[0])}
              className="p-5 rounded-3xl bg-card border border-border hover:border-primary/40 cursor-pointer shadow-xs transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-wider">
                  Writing
                </span>
                <h4 className="text-sm font-bold text-text">{writingPrompts[0].title}</h4>
                <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                  Interactive guided sentence builder with live AI rubric scoring.
                </p>
              </div>
              <span className="text-xs font-bold text-primary flex items-center gap-1">
                <span>Write Sentence</span>
                <ArrowRight size={13} />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB: LISTENING */}
      {activeTab === 'listening' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-text">Authentic Listening Library</h3>
              <p className="text-xs text-text-muted">Slow, natural, and real-world audio dialogues with dictation and connected speech analysis</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {listeningItems.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-card border border-border hover:border-primary/40 shadow-xs transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-surface border border-border text-[10px] font-bold uppercase text-text-muted">
                      {item.contentType.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-mono text-primary font-bold">
                      {item.cefrLevel} • {item.difficultyPace} pace
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-text">{item.title}</h4>
                  <p className="text-xs text-text-muted leading-relaxed">{item.subtitle}</p>

                  <div className="flex items-center gap-3 text-[11px] text-text-muted pt-1">
                    <span>{item.speakers.length} speakers ({item.speakers.map((s) => s.name).join(', ')})</span>
                    <span>•</span>
                    <span>{item.questions.length} questions</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedListening(item)}
                  className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:bg-primary-hover transition-colors flex items-center justify-center gap-2"
                >
                  <Play size={14} fill="currentColor" />
                  <span>Open Listening Studio</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: READING */}
      {activeTab === 'reading' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-text">Interactive Reading Studio</h3>
              <p className="text-xs text-text-muted">Clickable vocabulary, audio narration, read-aloud recording, and evidence-backed comprehension</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {readingItems.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-card border border-border hover:border-primary/40 shadow-xs transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-surface border border-border text-[10px] font-bold uppercase text-text-muted">
                      {item.contentType.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-mono text-primary font-bold">
                      {item.cefrLevel} • {item.estimatedMinutes} min read
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-text">{item.title}</h4>
                  <p className="text-xs text-text-muted leading-relaxed">{item.topic}</p>

                  <div className="flex items-center gap-2 flex-wrap text-[11px] pt-1">
                    <span className="text-text-muted">{item.vocabularyAnnotations.length} annotated terms</span>
                    <span className="text-text-muted">•</span>
                    <span className="text-primary font-semibold">Includes Read-Aloud Studio</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedReading(item)}
                  className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:bg-primary-hover transition-colors flex items-center justify-center gap-2"
                >
                  <BookOpen size={14} />
                  <span>Open Reading Studio</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: WRITING */}
      {activeTab === 'writing' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-text">Writing & Composition Studio</h3>
              <p className="text-xs text-text-muted">Sentence builder scaffolding, tone transformations, emails, and live AI rubric evaluation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {writingPrompts.map((prompt) => (
              <div
                key={prompt.id}
                className="p-5 rounded-3xl bg-card border border-border hover:border-primary/40 shadow-xs transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-surface border border-border text-[10px] font-bold uppercase text-text-muted">
                      {prompt.writingType.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-mono text-primary font-bold">
                      {prompt.cefrLevel} • {prompt.tone} tone
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-text">{prompt.title}</h4>
                  <p className="text-xs text-text-muted leading-relaxed">{prompt.instruction}</p>

                  <div className="text-[11px] text-text-muted pt-1">
                    Target: {prompt.targetLengthWords.min}–{prompt.targetLengthWords.max} words
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedWriting(prompt)}
                  className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:bg-primary-hover transition-colors flex items-center justify-center gap-2"
                >
                  <Edit3 size={14} />
                  <span>Start Writing Exercise</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: CROSS-CHALLENGES */}
      {activeTab === 'challenges' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-text">Integrated Multi-Skill Challenges</h3>
              <p className="text-xs text-text-muted">
                Complete all 4 communication dimensions (Listen â†’ Read â†’ Write â†’ Speak) in one cohesive real-world mission
              </p>
            </div>
          </div>

          {communicationChallenges.map((chal) => (
            <div key={chal.id} className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-black text-text">{chal.title}</h4>
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-xs">
                      {chal.cefrLevel}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">{chal.scenario}</p>
                </div>
                <span className="text-xs font-bold text-indigo-500 px-3 py-1 rounded-xl bg-indigo-500/10 shrink-0 self-start sm:self-auto">
                  +{chal.xpReward} XP Reward
                </span>
              </div>

              {/* Steps Progress */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {chal.steps.map((st) => (
                  <div
                    key={st.stepNumber}
                    className={`p-4 rounded-2xl border transition-all space-y-2 ${
                      st.completed ? 'bg-surface/50 border-emerald-500/30' : 'bg-surface border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-text">{st.label}</span>
                      {st.completed ? (
                        <span className="text-emerald-500 font-bold text-xs flex items-center gap-1">
                          <CheckCircle2 size={14} /> Completed
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase text-text-muted">Pending</span>
                      )}
                    </div>
                    <p className="text-[11px] text-text-muted leading-relaxed">{st.instruction}</p>

                    {!st.completed && (
                      <button
                        type="button"
                        onClick={() => completeChallengeStep(chal.id, st.stepNumber, 90)}
                        className="pt-2 text-xs font-bold text-primary hover:underline flex items-center gap-1"
                      >
                        <span>Complete Step</span>
                        <ArrowRight size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <ListeningSessionModal
        item={selectedListening}
        onClose={() => setSelectedListening(null)}
      />

      <ReadingPassageModal
        item={selectedReading}
        onClose={() => setSelectedReading(null)}
      />

      <WritingStudioModal
        prompt={selectedWriting}
        onClose={() => setSelectedWriting(null)}
      />
    </div>
  );
};
