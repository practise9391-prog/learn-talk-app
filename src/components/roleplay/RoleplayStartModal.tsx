import React, { useState } from 'react';
import { RoleplayScenario, RoleplayDifficulty } from '../../types/roleplay';
import {
  Mic,
  MessageSquare,
  Award,
  Clock,
  Target,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  User,
  Bot
} from 'lucide-react';

interface RoleplayStartModalProps {
  scenario: RoleplayScenario;
  isOpen: boolean;
  onClose: () => void;
  onStart: (config: {
    scenario: RoleplayScenario;
    userRole: string;
    aiRole: string;
    difficulty: RoleplayDifficulty;
    mode: 'voice' | 'text';
  }) => void;
}

export const RoleplayStartModal: React.FC<RoleplayStartModalProps> = ({
  scenario,
  isOpen,
  onClose,
  onStart
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<RoleplayDifficulty>(scenario.difficulty);
  const [selectedUserRole, setSelectedUserRole] = useState<string>(scenario.userRole);
  const [selectedAiRole, setSelectedAiRole] = useState<string>(scenario.aiRole);
  const [mode, setMode] = useState<'voice' | 'text'>('voice');

  if (!isOpen) return null;

  const handleSwapRoles = () => {
    if (scenario.alternativeUserRole && scenario.alternativeAiRole) {
      if (selectedUserRole === scenario.userRole) {
        setSelectedUserRole(scenario.alternativeUserRole);
        setSelectedAiRole(scenario.alternativeAiRole);
      } else {
        setSelectedUserRole(scenario.userRole);
        setSelectedAiRole(scenario.aiRole);
      }
    }
  };

  const handleLaunch = () => {
    onStart({
      scenario,
      userRole: selectedUserRole,
      aiRole: selectedAiRole,
      difficulty: selectedDifficulty,
      mode
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl rounded-3xl bg-card border border-border p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-border">
          <div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
              {scenario.category.replace('_', ' ')}
            </span>
            <h3 className="text-xl font-black text-text mt-1.5 leading-snug">
              {scenario.title}
            </h3>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              {scenario.description}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-text-muted hover:text-text font-bold text-sm px-2 py-1 rounded-lg hover:bg-surface"
          >
            ✕
          </button>
        </div>

        {/* Roles Box */}
        <div className="p-4 rounded-2xl bg-surface border border-border/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-text-muted">
              Roleplay Roles
            </span>
            {scenario.alternativeUserRole && (
              <button
                type="button"
                onClick={handleSwapRoles}
                className="text-[11px] font-bold text-primary hover:underline inline-flex items-center gap-1"
              >
                <RefreshCw size={12} />
                <span>Switch Roles</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-card border border-border flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                <User size={18} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-text-muted">You are</p>
                <p className="text-xs font-black text-text">{selectedUserRole}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                <Bot size={18} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-text-muted">Jarvis is</p>
                <p className="text-xs font-black text-text">{selectedAiRole}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Difficulty Selection */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-text-muted mb-2">
            Difficulty Level
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['Beginner', 'Intermediate', 'Advanced'] as RoleplayDifficulty[]).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedDifficulty(lvl)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  selectedDifficulty === lvl
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-surface border border-border text-text-muted hover:text-text'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Practiced & Goal */}
        <div className="space-y-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-text-muted block mb-1">
              Skills Practiced
            </span>
            <div className="flex flex-wrap gap-1.5">
              {scenario.expectedSkills.map((sk) => (
                <span
                  key={sk}
                  className="px-2.5 py-1 rounded-lg bg-surface border border-border text-[11px] font-semibold text-text"
                >
                  ✓ {sk}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-primary/5 border border-primary/15 text-xs text-text flex items-start gap-2">
            <Target size={16} className="text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-text text-[11px] uppercase tracking-wider">
                Scenario Objective:
              </span>
              <p className="text-text-muted mt-0.5">{scenario.objective}</p>
            </div>
          </div>
        </div>

        {/* Experience Mode: Voice or Text */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-text-muted mb-2">
            Practice Mode
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMode('voice')}
              className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                mode === 'voice'
                  ? 'bg-primary/10 border-primary text-text shadow-xs'
                  : 'bg-surface border-border text-text-muted'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                <Mic size={16} />
              </div>
              <div>
                <p className="text-xs font-black text-text">Voice Speaking</p>
                <p className="text-[10px] text-text-muted">Speak aloud with mic</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setMode('text')}
              className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                mode === 'text'
                  ? 'bg-primary/10 border-primary text-text shadow-xs'
                  : 'bg-surface border-border text-text-muted'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-surface border border-border text-text flex items-center justify-center shrink-0">
                <MessageSquare size={16} />
              </div>
              <div>
                <p className="text-xs font-black text-text">Text Chat</p>
                <p className="text-[10px] text-text-muted">Type your responses</p>
              </div>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-text-muted hover:bg-surface"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleLaunch}
            className="px-6 py-2.5 rounded-xl text-xs font-black bg-primary text-primary-foreground hover:bg-primary-hover shadow-md flex items-center gap-2"
          >
            <Mic size={15} />
            <span>Start Roleplay</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
