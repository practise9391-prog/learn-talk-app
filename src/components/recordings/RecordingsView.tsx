import React, { useState } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { useUser } from '../../context/UserContext';
import { AudioPlayer } from '../common/AudioPlayer';
import { Recording } from '../../types';
import {
  Mic,
  Shield,
  Trash2,
  FileText,
  Clock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Lock
} from 'lucide-react';

export const RecordingsView: React.FC = () => {
  const { recordings, deleteRecording, user } = useUser();
  const [selectedRec, setSelectedRec] = useState<Recording | null>(recordings[0] || null);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Spoken Audio Recordings"
        subtitle="Review your voice sessions, transcripts, and natural phrasing breakdowns"
        badge="Privacy-First"
      />

      {/* Privacy Notice Banner (Requirement 22) */}
      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800 flex items-start gap-3 text-xs">
        <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-emerald-800 dark:text-emerald-300">
            Privacy & Recording Safety
          </h4>
          <p className="text-emerald-700 dark:text-emerald-400 mt-0.5 leading-relaxed">
            LearnTalk never silently records you. Audio is processed solely for your personal practice feedback. You retain 100% control to review, replay, or permanently delete any recording at any moment.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recordings List */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Saved Sessions ({recordings.length})
            </span>
          </div>

          {recordings.length === 0 ? (
            <div className="p-6 rounded-2xl bg-card border border-border text-center text-xs text-text-muted">
              No recordings saved yet. Start a speaking session in Talk or Speaking World!
            </div>
          ) : (
            recordings.map((rec) => {
              const isSelected = selectedRec?.id === rec.id;
              return (
                <div
                  key={rec.id}
                  onClick={() => setSelectedRec(rec)}
                  className={`
                    p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between
                    ${
                      isSelected
                        ? 'bg-primary/10 border-primary ring-2 ring-primary/20 shadow-xs'
                        : 'bg-card border-border hover:bg-surface'
                    }
                  `}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-text truncate">
                      {rec.title}
                    </span>
                    <span className="text-[10px] text-text-muted shrink-0 flex items-center gap-1">
                      <Clock size={11} />
                      {Math.floor(rec.durationSeconds / 60)}m {rec.durationSeconds % 60}s
                    </span>
                  </div>

                  <span className="text-[11px] text-text-muted block truncate mb-3">
                    {rec.scenarioName}
                  </span>

                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-border">
                    <span className="text-text-muted">{rec.timestamp}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteRecording(rec.id);
                        if (selectedRec?.id === rec.id) setSelectedRec(null);
                      }}
                      className="p-1 text-text-muted hover:text-red-500 rounded-md transition-colors"
                      title="Permanently delete recording"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Recording Detail */}
        <div className="lg:col-span-2">
          {selectedRec ? (
            <div className="p-6 rounded-3xl bg-card border border-border shadow-sm flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
                <div>
                  <h3 className="text-lg font-black text-text">{selectedRec.title}</h3>
                  <p className="text-xs text-text-muted mt-0.5">
                    {selectedRec.scenarioName} • {selectedRec.timestamp}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    deleteRecording(selectedRec.id);
                    setSelectedRec(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-300 dark:border-red-900 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors self-start sm:self-auto"
                >
                  <Trash2 size={13} />
                  <span>Delete Recording</span>
                </button>
              </div>

              {/* Audio playback component */}
              <AudioPlayer
                title={selectedRec.title}
                duration={`${Math.floor(selectedRec.durationSeconds / 60)}:${String(
                  selectedRec.durationSeconds % 60
                ).padStart(2, '0')}`}
              />

              {/* Transcript Container */}
              <div className="p-4 rounded-2xl bg-surface border border-border">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">
                  Full Speech Transcript:
                </span>
                <p className="text-sm text-text leading-relaxed italic">
                  "{selectedRec.transcriptText}"
                </p>
              </div>

              {/* Session Metrics & Corrections count */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-surface border border-border">
                  <span className="text-[10px] font-bold text-text-muted uppercase">Duration</span>
                  <div className="text-sm font-black text-text mt-0.5">
                    {selectedRec.durationSeconds} seconds
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-surface border border-border">
                  <span className="text-[10px] font-bold text-text-muted uppercase">Phrasing Tips</span>
                  <div className="text-sm font-black text-amber-500 mt-0.5">
                    {selectedRec.correctionsCount} tips available
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-surface border border-border">
                  <span className="text-[10px] font-bold text-text-muted uppercase">Storage</span>
                  <div className="text-sm font-black text-emerald-500 mt-0.5 flex items-center gap-1">
                    <Lock size={12} /> Local on Device
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-card border border-border text-center text-sm text-text-muted">
              Select a recording from the left to listen and review transcript.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
