import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Plus,
  Trash2,
  Star,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useCoreJourney } from '../../context/CoreJourneyContext';
import { ConfidenceJournalEntry } from '../../types/coreJourney';

interface SpeakingJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpeakingJournalModal: React.FC<SpeakingJournalModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { journalEntries, addJournalEntry, deleteJournalEntry } = useCoreJourney();
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [title, setTitle] = useState('');
  const [whatPracticed, setWhatPracticed] = useState('');
  const [whatFeltDifficult, setWhatFeltDifficult] = useState('');
  const [breakthrough, setBreakthrough] = useState('');
  const [confidenceRating, setConfidenceRating] = useState<number>(4);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !whatPracticed.trim()) return;

    addJournalEntry({
      title,
      whatPracticed,
      whatFeltDifficult,
      breakthrough,
      confidenceRating,
      notes,
    });

    // Reset form
    setTitle('');
    setWhatPracticed('');
    setWhatFeltDifficult('');
    setBreakthrough('');
    setConfidenceRating(4);
    setNotes('');
    setIsAddingNew(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-surface-hover/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">
                Private Speaking & Confidence Journal
              </h2>
              <p className="text-sm text-text-secondary">
                Track personal breakthroughs, difficult moments, and independent speaking growth
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-tertiary hover:text-text-primary rounded-lg hover:bg-surface-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Top Bar with Add Button */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              {journalEntries.length} Saved Entries
            </span>
            <button
              type="button"
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAddingNew ? 'View All Entries' : 'New Journal Entry'}</span>
            </button>
          </div>

          {/* New Entry Form */}
          {isAddingNew ? (
            <form onSubmit={handleSave} className="space-y-4 p-5 bg-surface-hover rounded-2xl border border-border">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary" /> Record a Speaking Reflection
              </h3>

              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">
                  Session Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Hotel Check-in Conversation or First Standup"
                  required
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">
                    What Did You Practice?
                  </label>
                  <textarea
                    rows={2}
                    value={whatPracticed}
                    onChange={(e) => setWhatPracticed(e.target.value)}
                    placeholder="e.g. Ordering tea without looking at hints"
                    required
                    className="w-full p-2.5 bg-background border border-border rounded-xl text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">
                    What Felt Difficult or Hesitant?
                  </label>
                  <textarea
                    rows={2}
                    value={whatFeltDifficult}
                    onChange={(e) => setWhatFeltDifficult(e.target.value)}
                    placeholder="e.g. Choosing between past and present tense"
                    className="w-full p-2.5 bg-background border border-border rounded-xl text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">
                  Your Breakthrough or Key Learning
                </label>
                <input
                  type="text"
                  value={breakthrough}
                  onChange={(e) => setBreakthrough(e.target.value)}
                  placeholder="e.g. Taking a 1-second pause eliminated my 'um' fillers!"
                  className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">
                    Confidence Level:
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setConfidenceRating(star)}
                        className="p-1"
                      >
                        <Star
                          size={18}
                          className={`${
                            star <= confidenceRating
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-text-tertiary'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold shadow-xs hover:bg-primary-hover transition-colors"
                >
                  Save Reflection (+25 XP)
                </button>
              </div>
            </form>
          ) : (
            /* Journal Entries List */
            <div className="space-y-3">
              {journalEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 bg-background border border-border rounded-2xl hover:border-primary/40 transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-text-primary">{entry.title}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-text-tertiary mt-0.5">
                        <Calendar size={12} />
                        <span>{entry.dateFormatted}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={12}
                            className={`${
                              s <= entry.confidenceRating
                                ? 'text-amber-500 fill-amber-500'
                                : 'text-text-tertiary'
                            }`}
                          />
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteJournalEntry(entry.id)}
                        className="text-text-tertiary hover:text-red-500 p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-surface rounded-xl border border-border/80">
                      <span className="font-semibold text-text-secondary block text-[10px] uppercase">
                        Practiced:
                      </span>
                      <p className="text-text-primary mt-0.5">{entry.whatPracticed}</p>
                    </div>
                    {entry.breakthrough && (
                      <div className="p-2.5 bg-emerald-500/5 rounded-xl border border-emerald-500/20">
                        <span className="font-semibold text-emerald-600 block text-[10px] uppercase">
                          Breakthrough:
                        </span>
                        <p className="text-text-primary mt-0.5">{entry.breakthrough}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

