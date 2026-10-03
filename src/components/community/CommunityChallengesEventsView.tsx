import React, { useState } from 'react';
import { useCommunity } from '../../context/CommunityContext';
import { useNavigation } from '../../context/NavigationContext';
import { PEER_SPEAKING_CHALLENGES } from '../../data/communityData';
import {
  Flame,
  Award,
  Calendar,
  Clock,
  Users2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  BookmarkCheck,
  Check,
} from 'lucide-react';

export const CommunityChallengesEventsView: React.FC = () => {
  const { challenge, toggleChallengeDay, events, toggleEventEnrollment, createPracticeRoom } = useCommunity();
  const { navigate } = useNavigation();

  const [activeSubTab, setActiveSubTab] = useState<'challenge' | 'events' | 'activities'>('challenge');

  const handleLaunchActivity = (act: typeof PEER_SPEAKING_CHALLENGES[0]) => {
    createPracticeRoom({
      title: act.title,
      topic: act.exampleStarter,
      category: 'Speaking Challenge',
      difficulty: 'normal',
      durationMinutes: 5,
      format: act.format as any,
      maxParticipants: 2,
    });
    navigate('/community/room');
  };

  return (
    <div className="space-y-5">
      {/* Sub Tabs */}
      <div className="p-1 rounded-2xl bg-surface border border-border flex max-w-md text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveSubTab('challenge')}
          className={`flex-1 py-2 rounded-xl transition-all ${
            activeSubTab === 'challenge'
              ? 'bg-card text-text shadow-2xs'
              : 'text-text-muted hover:text-text'
          }`}
        >
          7-Day Challenge
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('events')}
          className={`flex-1 py-2 rounded-xl transition-all ${
            activeSubTab === 'events'
              ? 'bg-card text-text shadow-2xs'
              : 'text-text-muted hover:text-text'
          }`}
        >
          Speaking Events ({events.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('activities')}
          className={`flex-1 py-2 rounded-xl transition-all ${
            activeSubTab === 'activities'
              ? 'bg-card text-text shadow-2xs'
              : 'text-text-muted hover:text-text'
          }`}
        >
          Peer Drills
        </button>
      </div>

      {/* 1. 7-Day Speaking Challenge */}
      {activeSubTab === 'challenge' && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-primary/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 flex items-center gap-1">
                  <Flame size={14} />
                  <span>Habit Builder</span>
                </span>
                <span className="text-xs text-text-muted">•</span>
                <span className="text-xs font-semibold text-text-muted">
                  +{challenge.rewardXP} XP Reward
                </span>
              </div>
              <h3 className="text-lg font-black text-text">{challenge.title}</h3>
              <p className="text-xs text-text-muted max-w-xl leading-relaxed">
                {challenge.description}
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-2xl font-black text-amber-500">
                {challenge.days.filter((d) => d.isCompleted).length} / {challenge.totalDays}
              </span>
              <span className="text-[11px] font-semibold text-text-muted block">Days Mastered</span>
            </div>
          </div>

          {/* Days Track */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {challenge.days.map((d) => (
              <div
                key={d.dayNumber}
                className={`p-4 rounded-3xl border transition-all flex items-start justify-between gap-3 ${
                  d.isCompleted
                    ? 'bg-emerald-500/5 border-emerald-500/20'
                    : 'bg-card border-border hover:border-primary/40'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      d.isCompleted
                        ? 'bg-emerald-500 text-white'
                        : 'bg-surface text-text-muted border border-border'
                    }`}>
                      Day {d.dayNumber}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                      {d.suggestedMode.toUpperCase()} MODE
                    </span>
                  </div>

                  <h4 className="text-xs font-black text-text">{d.title}</h4>
                  <p className="text-xs text-text-muted leading-relaxed">{d.task}</p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleChallengeDay(d.dayNumber)}
                  className={`p-2 rounded-2xl border transition-all shrink-0 ${
                    d.isCompleted
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : 'bg-surface text-text-muted border-border hover:text-text'
                  }`}
                  title={d.isCompleted ? 'Completed' : 'Mark as complete'}
                >
                  <Check size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Scheduled Community Events */}
      {activeSubTab === 'events' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="p-5 rounded-3xl bg-card border border-border shadow-xs hover:border-primary/40 transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      Level {evt.level}
                    </span>
                    <span className="text-xs font-semibold text-text-muted flex items-center gap-1">
                      <Clock size={12} />
                      {evt.startTime}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-text">{evt.title}</h4>
                    <p className="text-xs text-text-muted leading-relaxed mt-0.5">{evt.description}</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-surface border border-border space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-text-muted">
                      <span>Format: <strong>{evt.format}</strong></span>
                      <span>{evt.enrolledCount} / {evt.maxParticipants} Enrolled</span>
                    </div>
                    <p className="text-[11px] text-text-muted italic">Hosted by {evt.hostName}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {evt.tags.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded bg-surface text-[10px] text-text-muted">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleEventEnrollment(evt.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      evt.isEnrolled
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-primary text-white hover:bg-primary-hover shadow-2xs'
                    }`}
                  >
                    {evt.isEnrolled ? '✓ Enrolled' : 'Join Event'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Peer Drills */}
      {activeSubTab === 'activities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PEER_SPEAKING_CHALLENGES.map((act) => (
            <div
              key={act.id}
              className="p-5 rounded-3xl bg-card border border-border shadow-xs hover:border-primary/40 transition-all space-y-3.5 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                    {act.duration} Challenge
                  </span>
                  <span className="text-[10px] text-text-muted font-mono">{act.format}</span>
                </div>

                <h4 className="text-sm font-black text-text">{act.title}</h4>
                <p className="text-xs text-text-muted leading-relaxed">{act.description}</p>

                <div className="p-3 rounded-2xl bg-surface border border-border text-[11px] space-y-1">
                  <span className="font-bold text-text block">Starter Example:</span>
                  <p className="text-text-muted italic">{act.exampleStarter}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between">
                <span className="text-[10px] text-text-muted font-medium">{act.targetSkill}</span>
                <button
                  type="button"
                  onClick={() => handleLaunchActivity(act)}
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1.5 hover:bg-primary-hover shadow-2xs transition-all"
                >
                  <Zap size={12} />
                  <span>Start with Peer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
