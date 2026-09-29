import React, { useState, useEffect } from 'react';
import { RoleplayHistoryRecord, RoleplayCategory, RoleplayDifficulty } from '../../types/roleplay';
import { INITIAL_ROLEPLAY_HISTORY, ROLEPLAY_SCENARIOS } from '../../data/roleplayScenarios';
import {
  History,
  RotateCcw,
  Search,
  Filter,
  Award,
  Clock,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Trash2,
  FileText
} from 'lucide-react';

interface RoleplayHistoryViewProps {
  onRetryScenario: (scenarioId: string, difficulty: RoleplayDifficulty) => void;
}

export const RoleplayHistoryView: React.FC<RoleplayHistoryViewProps> = ({ onRetryScenario }) => {
  const [history, setHistory] = useState<RoleplayHistoryRecord[]>(() => {
    try {
      const saved = localStorage.getItem('learntalk_roleplay_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ROLEPLAY_HISTORY;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<RoleplayHistoryRecord | null>(null);

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your roleplay history?')) {
      localStorage.removeItem('learntalk_roleplay_history');
      setHistory([]);
    }
  };

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.scenarioTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || item.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="space-y-6">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search completed roleplays..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-xs sm:text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-card border border-border text-xs font-bold text-text focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="interview">Interview</option>
            <option value="office">Office / Corporate</option>
            <option value="daily_life">Daily Life</option>
            <option value="travel">Travel</option>
            <option value="restaurant">Restaurant</option>
            <option value="customer_service">Customer Service</option>
            <option value="public_speaking">Public Speaking</option>
          </select>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 rounded-xl bg-card border border-border text-xs font-bold text-text focus:outline-none"
          >
            <option value="all">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          {history.length > 0 && (
            <button
              type="button"
              onClick={handleClearHistory}
              className="p-2.5 rounded-xl bg-surface border border-border text-text-muted hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
              title="Clear History"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <div className="rounded-3xl bg-card border border-border p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center text-3xl mb-4 text-text-muted">
            📜
          </div>
          <h3 className="text-lg font-black text-text">No Roleplays Completed Yet</h3>
          <p className="text-xs sm:text-sm text-text-muted mt-1 max-w-md">
            Complete your first realistic scenario in the "Roleplay" tab to track your scores, improvements, and transcripts here!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-3xl bg-card border border-border hover:border-primary/40 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex flex-col items-center justify-center font-black shrink-0">
                  <span className="text-base">{item.score}</span>
                  <span className="text-[9px] uppercase font-bold tracking-tight text-text-muted">Score</span>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-base font-black text-text">{item.scenarioTitle}</h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-surface border border-border text-text-muted">
                      {item.category.replace('_', ' ')}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-primary/10 text-primary border border-primary/20">
                      {item.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-text-muted mt-1.5 font-medium">
                    <span>{item.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {item.durationMin} mins
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MessageSquare size={12} />
                      {item.turnsCount} turns
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => setSelectedRecord(item)}
                  className="px-3.5 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-text hover:bg-surface-hover transition-colors flex items-center gap-1.5"
                >
                  <FileText size={13} />
                  <span>Review Feedback</span>
                </button>

                <button
                  type="button"
                  onClick={() => onRetryScenario(item.scenarioId, item.difficulty)}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-black hover:bg-primary-hover transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <RotateCcw size={13} />
                  <span>Retry</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Saved History Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl rounded-3xl bg-card border border-border p-6 shadow-2xl max-h-[85vh] overflow-y-auto space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-lg font-black text-text">{selectedRecord.scenarioTitle}</h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Completed {selectedRecord.date} • Score: <strong>{selectedRecord.score}/100</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="text-text-muted hover:text-text font-bold text-sm px-2 py-1"
              >
                ✕
              </button>
            </div>

            {/* Scores summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {Object.entries(selectedRecord.feedback.scores).slice(0, 4).map(([k, item]) => (
                <div key={k} className="p-3 rounded-xl bg-surface border border-border text-center">
                  <span className="text-[10px] uppercase font-bold text-text-muted block">
                    {k}
                  </span>
                  <span className="text-base font-black text-text mt-0.5 block">
                    {item.score}%
                  </span>
                </div>
              ))}
            </div>

            {/* What you did well */}
            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-xs space-y-1.5">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 block uppercase tracking-wider text-[10px]">
                What You Did Well:
              </span>
              {selectedRecord.feedback.whatYouDidWell.map((w, idx) => (
                <p key={idx} className="text-text">✓ {w}</p>
              ))}
            </div>

            {/* Transcript Snippet */}
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-text-muted block mb-2">
                Transcript ({selectedRecord.transcript.length} turns)
              </span>
              <div className="space-y-2 max-h-48 overflow-y-auto p-2 bg-surface rounded-2xl border border-border">
                {selectedRecord.transcript.map((t) => (
                  <div key={t.id} className="text-xs p-2 rounded-xl bg-card border border-border/60">
                    <span className="font-bold text-text uppercase text-[10px] block mb-0.5">
                      {t.sender === 'ai' ? 'Jarvis' : 'You'}:
                    </span>
                    <p className="text-text-muted">{t.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-text-muted hover:bg-surface"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const sId = selectedRecord.scenarioId;
                  const diff = selectedRecord.difficulty;
                  setSelectedRecord(null);
                  onRetryScenario(sId, diff);
                }}
                className="px-5 py-2 rounded-xl text-xs font-black bg-primary text-primary-foreground hover:bg-primary-hover flex items-center gap-1.5 shadow-sm"
              >
                <RotateCcw size={13} />
                <span>Retry Scenario</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
