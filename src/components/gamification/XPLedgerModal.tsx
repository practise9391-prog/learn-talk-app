import React from 'react';
import { Sparkles, Clock, CheckCircle2, ShieldAlert, X, Filter } from 'lucide-react';
import { useGamification } from '../../context/GamificationContext';

export const XPLedgerModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { xpTransactions, gamificationSettings } = useGamification();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg p-6 sm:p-7 rounded-3xl bg-card border border-border shadow-2xl space-y-5 max-h-[85vh] flex flex-col">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface transition-colors"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-text">Learning XP Activity Log</h2>
            <p className="text-xs text-text-muted">
              Transparent record of points awarded for real conversational and study effort.
            </p>
          </div>
        </div>

        {/* Transactions list */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {xpTransactions.length === 0 ? (
            <div className="p-8 text-center text-xs text-text-muted">No practice XP logged yet.</div>
          ) : (
            xpTransactions.map((tx) => (
              <div
                key={tx.id}
                className="p-3.5 rounded-2xl bg-surface border border-border/80 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-text capitalize truncate">
                      {tx.eventType.replace(/_/g, ' ')}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-card border border-border text-text-muted">
                      {tx.sourceType}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-text-muted">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {tx.metadata?.durationSeconds && (
                      <span>{Math.round(tx.metadata.durationSeconds / 60)} min active</span>
                    )}
                    {tx.metadata?.accuracy && <span>{tx.metadata.accuracy}% accuracy</span>}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono font-black text-indigo-500 text-sm">
                    +{tx.xpAmount} XP
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-surface border border-border text-xs font-bold text-text hover:bg-card transition-colors"
        >
          Close Log
        </button>
      </div>
    </div>
  );
};
