import React, { useState } from 'react';
import { ActivityHistoryItem, TranscriptTurn, TimestampedFeedbackItem } from '../../types/history';
import { useNavigation } from '../../context/NavigationContext';
import { useHistory } from '../../context/HistoryContext';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  BookOpen,
  ArrowRight,
  Trash2,
  Download,
  Mic,
  Clock,
  Award,
} from 'lucide-react';

interface SessionDetailModalProps {
  activity: ActivityHistoryItem | null;
  onClose: () => void;
}

export const SessionDetailModal: React.FC<SessionDetailModalProps> = ({
  activity,
  onClose,
}) => {
  const { navigate } = useNavigation();
  const { deleteRecording } = useHistory();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSeconds, setPlaybackSeconds] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'transcript' | 'summary' | 'metrics'>('transcript');
  const [selectedTurnId, setSelectedTurnId] = useState<string | null>(null);

  if (!activity) return null;

  const totalDuration = activity.durationSeconds || 60;

  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
  };

  const handleJumpToTimestamp = (seconds: number, turnId?: string) => {
    setPlaybackSeconds(seconds);
    setIsPlaying(true);
    if (turnId) setSelectedTurnId(turnId);
  };

  const handleDeleteAudio = () => {
    if (confirm('Delete audio recording? Transcript and metrics will be preserved for your progress history.')) {
      deleteRecording(activity.id);
      activity.hasRecording = false;
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border w-full max-w-3xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-border flex items-start justify-between gap-4 bg-surface/50">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary">
                {activity.activityType.toUpperCase()}
              </span>
              <span className="text-xs text-text-muted">{activity.timestamp}</span>
              {activity.difficulty && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-surface border border-border text-text-muted">
                  {activity.difficulty}
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-black text-text">{activity.title}</h2>
            <p className="text-xs text-text-muted mt-0.5">{activity.subtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Audio Player Bar (if recorded) */}
        {activity.hasRecording && (
          <div className="px-6 py-4 bg-surface border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePlayToggle}
                className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all"
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} className="translate-x-0.5" />}
              </button>
              <div>
                <div className="text-xs font-bold text-text flex items-center gap-2">
                  <span>{formatTime(playbackSeconds)}</span>
                  <span className="text-text-muted">/</span>
                  <span className="text-text-muted">{formatTime(totalDuration)}</span>
                </div>
                <span className="text-[11px] text-text-muted">
                  {isPlaying ? 'Playing session audio...' : 'Audio recorded with consent'}
                </span>
              </div>
            </div>

            {/* Simulated Audio Waveform / Scrubber */}
            <div className="flex-1 max-w-xs mx-auto sm:mx-4 flex items-center gap-1.5 h-6">
              {[20, 45, 80, 50, 95, 30, 60, 40, 75, 85, 40, 60, 90, 70, 45, 30, 60, 80].map((h, i) => (
                <div
                  key={i}
                  onClick={() => handleJumpToTimestamp(Math.floor((i / 18) * totalDuration))}
                  className={`w-1 rounded-full cursor-pointer transition-all ${
                    (i / 18) * totalDuration <= playbackSeconds ? 'bg-primary' : 'bg-border'
                  }`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={handleDeleteAudio}
                className="px-2.5 py-1.5 text-xs text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors flex items-center gap-1.5"
                title="Delete Audio Recording"
              >
                <Trash2 size={13} />
                <span className="hidden sm:inline">Delete Audio</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-border bg-card">
          <button
            onClick={() => setActiveTab('transcript')}
            className={`pb-3 px-3 text-xs font-bold transition-all relative ${
              activeTab === 'transcript'
                ? 'text-primary'
                : 'text-text-muted hover:text-text'
            }`}
          >
            Interactive Transcript ({activity.transcriptSegments?.length || 0})
            {activeTab === 'transcript' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`pb-3 px-3 text-xs font-bold transition-all relative ${
              activeTab === 'summary'
                ? 'text-primary'
                : 'text-text-muted hover:text-text'
            }`}
          >
            Session Summary & Insights
            {activeTab === 'summary' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`pb-3 px-3 text-xs font-bold transition-all relative ${
              activeTab === 'metrics'
                ? 'text-primary'
                : 'text-text-muted hover:text-text'
            }`}
          >
            Performance Metrics ({activity.score}%)
            {activeTab === 'metrics' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'transcript' && (
            <div className="space-y-4">
              {/* Timestamped Feedback Quick Jumps */}
              {activity.timestampedFeedback && activity.timestampedFeedback.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                    Jump to Feedback Moments:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activity.timestampedFeedback.map((tf) => (
                      <button
                        key={tf.id}
                        type="button"
                        onClick={() => handleJumpToTimestamp(tf.timestampSeconds)}
                        className="px-3 py-1.5 rounded-xl bg-surface border border-border hover:border-primary/50 text-xs font-semibold text-text flex items-center gap-1.5 transition-all shadow-2xs group"
                      >
                        <span className="font-mono text-primary font-bold text-[10px]">
                          {tf.timestamp}
                        </span>
                        <span className="text-text-muted">•</span>
                        <span>{tf.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Turns */}
              {activity.transcriptSegments && activity.transcriptSegments.length > 0 ? (
                <div className="space-y-4 pt-2">
                  {activity.transcriptSegments.map((turn) => {
                    const isUser = turn.speaker === 'user';
                    const isSelected = selectedTurnId === turn.id;

                    return (
                      <div
                        key={turn.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          isUser
                            ? 'bg-card border-border ml-2 sm:ml-6'
                            : 'bg-surface/60 border-border mr-2 sm:mr-6'
                        } ${isSelected ? 'ring-2 ring-primary/40 border-primary' : ''}`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[11px] font-bold uppercase tracking-wider ${
                                isUser ? 'text-primary' : 'text-indigo-500'
                              }`}
                            >
                              {isUser ? 'You' : activity.personaName || 'AI Partner'}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleJumpToTimestamp(turn.timestampSeconds, turn.id)}
                              className="font-mono text-[10px] text-text-muted hover:text-primary transition-colors flex items-center gap-1"
                            >
                              <Clock size={10} />
                              {turn.timestamp}
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleJumpToTimestamp(turn.timestampSeconds, turn.id)}
                            className="p-1 rounded-lg text-text-muted hover:text-primary hover:bg-surface transition-colors"
                            title="Play this turn"
                          >
                            <Play size={11} />
                          </button>
                        </div>

                        <p className="text-sm text-text leading-relaxed font-medium">
                          {turn.text}
                        </p>

                        {/* Inline Feedback if present */}
                        {turn.feedback && (
                          <div className="mt-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1.5">
                            <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-400">
                              <Sparkles size={13} />
                              <span>{turn.feedback.title}</span>
                            </div>
                            <p className="text-text-muted leading-relaxed">
                              {turn.feedback.explanation}
                            </p>
                            <div className="pt-1 text-text">
                              <span className="text-text-muted font-semibold">More natural: </span>
                              <span className="font-bold text-primary">
                                "{turn.feedback.betterAlternative}"
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-text-muted">
                  <p className="text-sm">No synchronized transcript turns recorded for this exercise.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'summary' && (
            <div className="space-y-6">
              {activity.sessionSummary ? (
                <>
                  {/* What you did well */}
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                      <CheckCircle2 size={16} />
                      <h4>What You Did Well</h4>
                    </div>
                    <ul className="space-y-1.5 text-xs text-text font-medium pl-6 list-disc">
                      {activity.sessionSummary.whatYouDidWell.map((w, idx) => (
                        <li key={idx}>{w}</li>
                      ))}
                    </ul>
                  </div>

                  {/* What to improve */}
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm">
                      <AlertTriangle size={16} />
                      <h4>Key Areas to Improve</h4>
                    </div>
                    <ul className="space-y-1.5 text-xs text-text font-medium pl-6 list-disc">
                      {activity.sessionSummary.whatToImprove.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* New Words Encountered */}
                  {activity.sessionSummary.newWords && activity.sessionSummary.newWords.length > 0 && (
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">
                        New Words Encountered
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {activity.sessionSummary.newWords.map((nw, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-surface border border-border text-xs space-y-1"
                          >
                            <span className="font-bold text-primary text-sm">{nw.word}</span>
                            <p className="text-text-muted">{nw.meaning}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Next Practice */}
                  {activity.sessionSummary.recommendedPractice && (
                    <div className="space-y-2.5 pt-2">
                      <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">
                        Recommended Next Steps
                      </h4>
                      <div className="space-y-2">
                        {activity.sessionSummary.recommendedPractice.map((rec, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              onClose();
                              navigate(rec.route);
                            }}
                            className="p-3.5 rounded-2xl bg-card border border-border hover:border-primary/40 hover:bg-surface cursor-pointer transition-all flex items-center justify-between gap-3 group"
                          >
                            <div>
                              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                                {rec.type}
                              </span>
                              <h5 className="text-sm font-bold text-text group-hover:text-primary transition-colors">
                                {rec.title}
                              </h5>
                            </div>
                            <ArrowRight size={16} className="text-text-muted group-hover:text-primary transition-colors" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-8 text-center text-text-muted">
                  <p className="text-sm">Summary not available for this activity.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'metrics' && (
            <div className="space-y-6">
              {activity.metrics ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-surface border border-border text-center">
                      <span className="text-xs text-text-muted font-bold block mb-1">Grammar Accuracy</span>
                      <span className="text-2xl font-black text-text">{activity.metrics.grammar || 0}%</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-surface border border-border text-center">
                      <span className="text-xs text-text-muted font-bold block mb-1">Vocabulary Variety</span>
                      <span className="text-2xl font-black text-text">{activity.metrics.vocabulary || 0}%</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-surface border border-border text-center">
                      <span className="text-xs text-text-muted font-bold block mb-1">Fluency & Cadence</span>
                      <span className="text-2xl font-black text-text">{activity.metrics.fluency || 0}%</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-surface border border-border text-center">
                      <span className="text-xs text-text-muted font-bold block mb-1">Pronunciation Clarity</span>
                      <span className="text-2xl font-black text-text">{activity.metrics.pronunciation || 0}%</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-surface border border-border text-center">
                      <span className="text-xs text-text-muted font-bold block mb-1">Words Spoken</span>
                      <span className="text-2xl font-black text-text">{activity.metrics.wordsSpoken || 0}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-surface border border-border text-center">
                      <span className="text-xs text-text-muted font-bold block mb-1">Speech Rate</span>
                      <span className="text-2xl font-black text-text">{activity.metrics.speechRateWpm || 120} wpm</span>
                    </div>
                  </div>

                  {activity.metrics.fillerWordCount !== undefined && (
                    <div className="p-4 rounded-2xl bg-surface border border-border flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-text">Filler Words Detected</h4>
                        <p className="text-[11px] text-text-muted">Total filler instances across this session</p>
                      </div>
                      <span className="text-lg font-black text-amber-500">
                        {activity.metrics.fillerWordCount} fillers
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-8 text-center text-text-muted">
                  <p className="text-sm">Structured speaking metrics were not generated for this exercise type.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
