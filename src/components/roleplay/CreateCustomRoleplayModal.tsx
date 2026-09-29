import React, { useState } from 'react';
import { RoleplayScenario, RoleplayDifficulty, RoleplayCategory } from '../../types/roleplay';
import { Sparkles, Plus, Target, User, Bot, AlertTriangle, ArrowRight } from 'lucide-react';

interface CreateCustomRoleplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (scenario: RoleplayScenario) => void;
}

export const CreateCustomRoleplayModal: React.FC<CreateCustomRoleplayModalProps> = ({
  isOpen,
  onClose,
  onCreated
}) => {
  const [topicPrompt, setTopicPrompt] = useState('');
  const [userRole, setUserRole] = useState('Employee');
  const [aiRole, setAiRole] = useState('Manager');
  const [category, setCategory] = useState<RoleplayCategory>('office');
  const [difficulty, setDifficulty] = useState<RoleplayDifficulty>('Intermediate');
  const [safetyError, setSafetyError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicPrompt.trim()) return;

    // Safety validation (Requirement 54: prevent harassment, unsafe or medical/legal advice imitation)
    const unsafeKeywords = ['hack', 'threaten', 'illegal', 'scam', 'abuse', 'poison'];
    if (unsafeKeywords.some((w) => topicPrompt.toLowerCase().includes(w))) {
      setSafetyError('Please keep scenarios focused on professional, everyday, and language learning situations.');
      return;
    }

    const customId = `custom-rp-${Date.now()}`;
    const generatedScenario: RoleplayScenario = {
      id: customId,
      category,
      title: topicPrompt.length > 40 ? `${topicPrompt.slice(0, 37)}...` : topicPrompt,
      description: `Custom practice scenario: ${topicPrompt}`,
      difficulty,
      userRole: userRole.trim() || 'Speaker',
      aiRole: aiRole.trim() || 'Partner',
      estimatedDurationMin: 6,
      expectedSkills: ['Spontaneous Speaking', 'Context Handling', 'Active Listening'],
      objective: `Successfully engage in a simulated conversation regarding: ${topicPrompt}`,
      context: `You are in a realistic dialogue practicing English: ${topicPrompt}`,
      openingMessage: `Hello! I understand you wanted to discuss "${topicPrompt}". How can we get started?`,
      vocabulary: ['specifically', 'deliverable', 'objective', 'clarification', 'next steps'],
      grammarTargets: ['Present Perfect for status', 'Polite indirect questions'],
      conversationSteps: [
        {
          stepIndex: 1,
          aiPrompt: `That gives good initial context. What specific outcome or timeline are you proposing as our next step?`,
          expectedResponseConcept: 'Detailing proposed action items and next steps.',
          hints: {
            wordHint: 'propose, timeline, deliverable, milestone',
            sentenceHint: 'I propose that we set a milestone for next week...',
            fullHint: 'I propose that we align on key milestones by Friday and review progress early next week.'
          },
          suggestedStarters: [
            'My recommendation is that we...',
            'From my perspective, the best approach would be...',
            'I suggest we establish a clear deadline for...'
          ]
        },
        {
          stepIndex: 2,
          aiPrompt: `That sounds constructive. Is there anything else we need to take into account before finalizing this?`,
          expectedResponseConcept: 'Summarizing agreement and confirming wrap-up.',
          hints: {
            wordHint: 'summary, confirmed, aligned, thank you',
            sentenceHint: 'I think that covers everything. Thank you for your time...',
            fullHint: 'I believe we have covered all key points. I will send a quick recap email. Thank you!'
          },
          suggestedStarters: [
            'That covers the essentials for now...',
            'I believe we are aligned. I will follow up in writing...',
            'Thank you for discussing this so openly.'
          ]
        }
      ],
      evaluationRules: [
        {
          criteria: 'Maintains polite assertiveness throughout custom scenario',
          recommendation: 'Use structured proposals to keep dialogue focused.'
        }
      ],
      bestAnswerComparisons: [
        {
          userSpokenHypothesis: `I want talk about ${topicPrompt}.`,
          naturalVersion: `I wanted to discuss ${topicPrompt} and explore our next steps.`,
          professionalVersion: `I appreciate you taking the time to discuss ${topicPrompt}. I would like to align on our strategy.`,
          whyExplanation: 'Polite framing sets a constructive foundation for any conversation.'
        }
      ]
    };

    onCreated(generatedScenario);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl bg-card border border-border p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-primary" />
            <h3 className="text-base font-black text-text">Create My Custom Roleplay</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-text-muted hover:text-text font-bold text-sm px-2 py-1"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-text-muted mb-1.5">
              What situation do you want to practice? *
            </label>
            <input
              type="text"
              required
              value={topicPrompt}
              onChange={(e) => {
                setTopicPrompt(e.target.value);
                setSafetyError('');
              }}
              placeholder="e.g. Talking to my manager about pushing back a project deadline"
              className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-xs sm:text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {safetyError && (
              <p className="text-[11px] font-bold text-rose-500 mt-1 flex items-center gap-1">
                <AlertTriangle size={12} />
                <span>{safetyError}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-text-muted mb-1">
                Your Role
              </label>
              <input
                type="text"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                placeholder="e.g. Employee, Candidate, Tourist"
                className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted mb-1">
                Jarvis Role
              </label>
              <input
                type="text"
                value={aiRole}
                onChange={(e) => setAiRole(e.target.value)}
                placeholder="e.g. Manager, Interviewer, Doctor"
                className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-text-muted mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as RoleplayCategory)}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none capitalize"
              >
                {[
                  'interview',
                  'office',
                  'daily_life',
                  'travel',
                  'shopping',
                  'restaurant',
                  'college',
                  'customer_service',
                  'social',
                  'public_speaking'
                ].map((c) => (
                  <option key={c} value={c}>
                    {c.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted mb-1">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as RoleplayDifficulty)}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs text-text focus:outline-none"
              >
                {(['Beginner', 'Intermediate', 'Advanced'] as RoleplayDifficulty[]).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-text-muted hover:bg-surface"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-black bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm flex items-center gap-1.5"
            >
              <Sparkles size={14} />
              <span>Generate & Start</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
