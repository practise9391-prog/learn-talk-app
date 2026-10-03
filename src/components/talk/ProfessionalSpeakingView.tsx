import React, { useState } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { ttsService, sttService } from '../../services/aiService';
import { useUser } from '../../context/UserContext';
import { useAdaptiveLearning } from '../../context/AdaptiveLearningContext';
import {
  Briefcase,
  Users,
  Presentation,
  Code2,
  Scale,
  Mic,
  Volume2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  Lightbulb,
} from 'lucide-react';

export const ProfessionalSpeakingView: React.FC = () => {
  const { addSpokenMinutes } = useUser();
  const { recordEvidence } = useAdaptiveLearning();

  const [activeCategory, setActiveCategory] = useState<'meetings' | 'presentations' | 'technical' | 'negotiation'>('meetings');
  const [selectedSubtopicIndex, setSelectedSubtopicIndex] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const categories = [
    { id: 'meetings', label: 'Workplace Meetings', icon: Users, desc: 'Standups, polite disagreement, interrupting smoothly' },
    { id: 'presentations', label: 'Presentations', icon: Presentation, desc: 'Openings, agenda walk-throughs, slide transitions' },
    { id: 'technical', label: 'Technical Speaking', icon: Code2, desc: 'System architecture, API trade-offs, code reviews' },
    { id: 'negotiation', label: 'Negotiation & Alignment', icon: Scale, desc: 'Deadlines, resource trade-offs, common ground' },
  ];

  const categoryData = {
    meetings: [
      {
        title: 'Daily Standup Update',
        scenario: 'You are sharing your 60-second status update with your engineering team and scrum master.',
        phrases: [
          'Yesterday, I focused on finalizing the user authentication flow...',
          'Today, my primary objective is to integrate the payment webhook...',
          'I currently have no blockers, but I might need 5 minutes with Alex later.',
        ],
        modelAnswer: 'Good morning everyone. Yesterday, I wrapped up the user authentication API. Today, I\'m tackling the payment webhooks and unit tests. No blockers on my end, though I\'d love a quick sync with frontend this afternoon.',
      },
      {
        title: 'Polite Disagreement in a Strategy Discussion',
        scenario: 'A colleague suggests postponing test automation to launch faster. You need to respectfully present an alternative.',
        phrases: [
          'I see where you\'re coming from regarding time constraints; however...',
          'From a risk perspective, skipping integration tests might lead to...',
          'Could we consider a phased approach where we test core flows first?',
        ],
        modelAnswer: 'I definitely understand the urgency to hit our launch target. However, from a stability standpoint, skipping automated tests could create critical production debt. What if we automate just the checkout flow first and phase in the rest next sprint?',
      },
      {
        title: 'Politely Interrupting to Clarify an Ambiguity',
        scenario: 'In a fast-paced client sync, a requirement was stated too quickly. You need to jump in smoothly.',
        phrases: [
          'Sorry to jump in, but could I double-check that last requirement?',
          'Before we move on to the next item, just to confirm...',
          'Could we take a quick second to clarify what you meant by real-time sync?',
        ],
        modelAnswer: 'Pardon the interruption, but before we move to the next slide, could we quickly clarify the expected latency for real-time synchronization? I want to ensure our architecture aligns with your team\'s expectations.',
      },
    ],
    presentations: [
      {
        title: 'Engaging Presentation Opening',
        scenario: 'Kicking off a quarterly demo to 20 cross-functional stakeholders.',
        phrases: [
          'Good morning everyone, thank you for taking the time to join today.',
          'Over the next 15 minutes, we are going to explore how...',
          'By the end of this session, you\'ll have a complete overview of...',
        ],
        modelAnswer: 'Good morning everyone, and thank you for being here today. Over the next fifteen minutes, we\'ll walk through the new voice-first features we developed this quarter and demonstrate how they drastically boost user engagement.',
      },
      {
        title: 'Smooth Slide Transition',
        scenario: 'Transitioning from the technical architecture diagram to customer performance metrics.',
        phrases: [
          'Now that we\'ve covered the backend pipeline, let\'s turn our attention to...',
          'This technical optimization directly ties into the business impact on...',
          'With those system changes in mind, let\'s look at how response times improved.',
        ],
        modelAnswer: 'Now that we\'ve looked at the underlying microservices architecture, let\'s turn our attention to what this actually means for our users. As you can see on the next chart, average page load latency dropped by 38 percent.',
      },
    ],
    technical: [
      {
        title: 'Explaining a System Architecture Decision',
        scenario: 'Explaining to a lead architect why you chose an asynchronous queue over synchronous REST calls.',
        phrases: [
          'We opted for an asynchronous message queue primarily to decouple...',
          'The trade-off was accepting eventual consistency in exchange for...',
          'Under high traffic spikes, this prevents our core service from failing.',
        ],
        modelAnswer: 'We opted for an asynchronous message queue using RabbitMQ because it decouples our notification service from the primary checkout transaction. While it introduces eventual consistency, it guarantees that high notification volumes won\'t bottleneck purchase processing.',
      },
      {
        title: 'Explaining a Tricky Bug in a Post-Mortem',
        scenario: 'Explaining the root cause of yesterday\'s server slowdown without sounding defensive.',
        phrases: [
          'The root cause stemmed from an unindexed database query during peak hours...',
          'As traffic climbed, connection pool exhaustion triggered timeouts...',
          'To mitigate this permanently, we added a compound composite index...',
        ],
        modelAnswer: 'The issue stemmed from an unindexed foreign key in our transactions table. Under peak morning traffic, sequential scans exhausted our database connection pool. We resolved the immediate incident by adding an index, and we have now instituted query-plan alerts across all endpoints.',
      },
    ],
    negotiation: [
      {
        title: 'Negotiating a Project Deadline',
        scenario: 'Your product manager asks for additional features without pushing back the release date.',
        phrases: [
          'We\'d love to deliver these additional features; however, with our current sprint capacity...',
          'If we include the new report export, we would need to push the release by four days.',
          'Alternatively, we can launch the core MVP on Friday and release the export as a fast follow.',
        ],
        modelAnswer: 'We\'d love to incorporate the advanced reporting feature. However, based on our current capacity, building that will require another three days of testing. If Friday\'s launch is strict, I suggest shipping the core dashboard first and delivering exports in Tuesday\'s patch.',
      },
    ],
  };

  const currentList = categoryData[activeCategory] || categoryData.meetings;
  const currentScenario = currentList[selectedSubtopicIndex] || currentList[0];

  const handleRecordToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
      setFeedback(null);
      sttService.start({
        onResult: (t) => {
          setTranscript(t);
        },
        onError: () => {
          setIsRecording(false);
        },
      });
    } else {
      sttService.stop();
      setIsRecording(false);
      addSpokenMinutes(1);
      setFeedback('Great delivery! Your phrasing sounded confident, well-structured, and appropriately courteous for a workplace setting.');

      recordEvidence({
        sourceType: 'talk',
        sourceTitle: currentScenario.title,
        targetSkill: 'professional_communication',
        accuracyScore: 95,
        difficulty: 'normal',
        hintsUsedCount: 0,
        contextType: 'spontaneous_speaking',
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-16">
      <PageHeader
        title="Professional & Technical Speaking"
        subtitle="Practice high-impact corporate workplace communication, meetings, architecture discussions & demos"
        badge="Executive Presence"
        showBack={true}
      />

      {/* Category selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {categories.map((c) => {
          const Icon = c.icon;
          const isSelected = activeCategory === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setActiveCategory(c.id as any);
                setSelectedSubtopicIndex(0);
                setTranscript('');
                setFeedback(null);
              }}
              className={`p-4 rounded-3xl border text-left transition-all ${
                isSelected
                  ? 'bg-primary/10 border-primary text-primary shadow-xs'
                  : 'bg-card border-border text-text hover:border-primary/40'
              }`}
            >
              <Icon size={20} className="mb-2" />
              <div className="text-xs font-black">{c.label}</div>
              <div className="text-[10px] text-text-secondary line-clamp-1 mt-0.5">{c.desc}</div>
            </button>
          );
        })}
      </div>

      {/* Scenario Subtopic Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {currentList.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setSelectedSubtopicIndex(idx);
              setTranscript('');
              setFeedback(null);
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-black border transition-all ${
              selectedSubtopicIndex === idx
                ? 'bg-secondary text-white border-secondary shadow-xs'
                : 'bg-surface border-border text-text-secondary hover:text-text'
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>

      {/* Active Scenario Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-primary block mb-1">
            Workplace Situation
          </span>
          <h3 className="text-xl font-black text-text">{currentScenario.title}</h3>
          <p className="text-xs text-text-secondary mt-1">{currentScenario.scenario}</p>
        </div>

        {/* Essential Professional Phrasing */}
        <div className="p-5 rounded-2xl bg-surface/70 border border-border space-y-3">
          <div className="text-xs font-black text-text uppercase tracking-wider">
            Key Phrasing & Bridging Templates:
          </div>
          <div className="space-y-2">
            {currentScenario.phrases.map((phrase, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-card border border-border flex items-center justify-between gap-3 text-xs"
              >
                <span className="font-semibold text-text">"{phrase}"</span>
                <button
                  type="button"
                  onClick={() => ttsService.speak(phrase)}
                  className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                >
                  <Volume2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Model Executive Delivery */}
        <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Model Professional Delivery:
            </span>
            <button
              type="button"
              onClick={() => ttsService.speak(currentScenario.modelAnswer)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-card border border-border text-xs font-bold text-text hover:bg-surface"
            >
              <Volume2 size={13} className="text-primary" />
              <span>Listen Full Model</span>
            </button>
          </div>
          <p className="text-xs text-text leading-relaxed italic">
            "{currentScenario.modelAnswer}"
          </p>
        </div>

        {/* Record Practice */}
        <div className="p-5 rounded-2xl bg-surface/40 border border-border space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-black text-text uppercase tracking-wider">Practice Your Response</h4>
              <p className="text-xs text-text-secondary">Deliver your version smoothly without rush.</p>
            </div>

            <button
              type="button"
              onClick={handleRecordToggle}
              className={`px-6 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all ${
                isRecording
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-primary text-white hover:bg-primary/90 shadow-xs'
              }`}
            >
              <Mic size={16} />
              <span>{isRecording ? 'Listening (Speak Now)...' : 'Record Speaking'}</span>
            </button>
          </div>

          {transcript && (
            <div className="p-3.5 rounded-xl bg-card border border-border text-xs text-text italic">
              "{transcript}"
            </div>
          )}

          {feedback && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-start gap-2.5">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              <span>{feedback}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
