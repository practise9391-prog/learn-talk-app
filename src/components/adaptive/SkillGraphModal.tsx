import React, { useState } from 'react';
import { useAdaptiveLearning } from '../../context/AdaptiveLearningContext';
import { useNavigation } from '../../context/NavigationContext';
import { SkillDependencyNode } from '../../types/adaptive';
import {
  Network,
  X,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  Info,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface SkillGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SkillGraphModal: React.FC<SkillGraphModalProps> = ({ isOpen, onClose }) => {
  const { skillGraph } = useAdaptiveLearning();
  const { navigate } = useNavigation();
  const [selectedNode, setSelectedNode] = useState<SkillDependencyNode>(skillGraph[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-card border border-border w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col animate-scaleUp">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-border bg-surface/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary text-white">
              <Network size={18} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-text">
                Interconnected English Skill Graph
              </h2>
              <p className="text-[11px] text-text-muted">
                Understand prerequisites and why you are practicing each foundational concept
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto">
          {/* Interactive Graph Node Flow */}
          <div className="md:col-span-2 space-y-3">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
              Skill Learning Pipeline & Dependencies
            </span>

            <div className="space-y-2 relative">
              {skillGraph.map((node, idx) => {
                const isSelected = selectedNode.id === node.id;
                const isMastered = node.status === 'mastered';
                const isLocked = node.status === 'not_started';

                return (
                  <div key={node.id} className="relative">
                    <div
                      onClick={() => setSelectedNode(node)}
                      className={`
                        p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3
                        ${
                          isSelected
                            ? 'bg-primary/10 border-primary ring-2 ring-primary/20 shadow-xs'
                            : isMastered
                            ? 'bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-300 dark:border-emerald-800'
                            : 'bg-surface border-border hover:border-primary/40'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="text-2xl shrink-0 p-1 bg-card rounded-xl border border-border">
                          {node.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-text truncate">
                              {node.name}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-card border border-border text-text-muted">
                              {node.level}
                            </span>
                          </div>
                          <span className="text-[11px] text-text-muted capitalize block truncate">
                            {node.category.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isMastered ? (
                          <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 size={11} /> Mastered
                          </span>
                        ) : isLocked ? (
                          <span className="text-[10px] font-semibold text-text-muted bg-surface px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Lock size={11} /> Locked
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            In Progress
                          </span>
                        )}
                        <ChevronRight size={14} className="text-text-muted" />
                      </div>
                    </div>

                    {/* Connecting line to next node */}
                    {idx < skillGraph.length - 1 && (
                      <div className="w-0.5 h-3 bg-border mx-auto my-0.5" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Node Detail Inspector */}
          <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{selectedNode.icon}</span>
                <div>
                  <h3 className="text-sm font-black text-text">{selectedNode.name}</h3>
                  <span className="text-[11px] text-text-muted capitalize">
                    {selectedNode.category.replace('_', ' ')} â¢ {selectedNode.level}
                  </span>
                </div>
              </div>

              <div className="text-xs space-y-1">
                <strong className="text-text block font-bold">Concept Objective:</strong>
                <p className="text-text-muted leading-relaxed">{selectedNode.description}</p>
              </div>

              <div className="text-xs space-y-1 pt-2 border-t border-border">
                <strong className="text-text block font-bold">Prerequisites:</strong>
                {selectedNode.prerequisites.length === 0 ? (
                  <span className="text-emerald-500 font-semibold text-[11px]">
                    None (Foundation Skill)
                  </span>
                ) : (
                  <ul className="list-disc pl-4 space-y-0.5 text-text-muted text-[11px]">
                    {selectedNode.prerequisites.map((prereqId) => {
                      const found = skillGraph.find((g) => g.id === prereqId);
                      return <li key={prereqId}>{found?.name || prereqId}</li>;
                    })}
                  </ul>
                )}
              </div>

              <div className="p-3 rounded-xl bg-card border border-border text-[11px] text-text-muted leading-relaxed">
                <strong>Why this sequencing matters:</strong> Practicing this node ensures you have the structural grammar and vocabulary ready before attempting complex, spontaneous conversational situations.
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                navigate('/learn');
              }}
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm hover:bg-primary-hover transition-colors"
            >
              <span>Practice This Node</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
