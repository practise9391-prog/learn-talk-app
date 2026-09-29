import React, { useState } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { RoleplayCategory, RoleplayScenario, RoleplayDifficulty } from '../../types/roleplay';
import { ROLEPLAY_SCENARIOS } from '../../data/roleplayScenarios';
import { RoleplayStartModal } from './RoleplayStartModal';
import { RoleplayEngineSessionView } from './RoleplayEngineSessionView';
import { RoleplayHistoryView } from './RoleplayHistoryView';
import { CreateCustomRoleplayModal } from './CreateCustomRoleplayModal';
import {
  Briefcase,
  Building,
  Coffee,
  Plane,
  ShoppingBag,
  UtensilsCrossed,
  GraduationCap,
  Headphones,
  Users2,
  Mic,
  Play,
  Clock,
  Sparkles,
  Plus,
  History,
  Target,
  Search,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

const CATEGORIES: { id: 'all' | RoleplayCategory; label: string; icon: string }[] = [
  { id: 'all', label: 'All Scenarios', icon: '🌎' },
  { id: 'interview', label: 'Interview', icon: '🎯' },
  { id: 'office', label: 'Office / Corporate', icon: '🏢' },
  { id: 'daily_life', label: 'Daily Life', icon: '🏠' },
  { id: 'travel', label: 'Travel', icon: '✈️' },
  { id: 'restaurant', label: 'Restaurant', icon: '🍽' },
  { id: 'customer_service', label: 'Customer Service', icon: '☎️' },
  { id: 'public_speaking', label: 'Public Speaking', icon: '🎤' },
  { id: 'shopping', label: 'Shopping', icon: '🛒' },
  { id: 'college', label: 'College', icon: '🎓' },
  { id: 'social', label: 'Social', icon: '🤝' }
];

export const RoleplayDirectoryView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'roleplay' | 'history'>('roleplay');
  const [selectedCategory, setSelectedCategory] = useState<'all' | RoleplayCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Scenarios catalog (including any custom created ones)
  const [scenarios, setScenarios] = useState<RoleplayScenario[]>(ROLEPLAY_SCENARIOS);

  // Active modal and session states
  const [selectedScenarioForStart, setSelectedScenarioForStart] = useState<RoleplayScenario | null>(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  // Active running session
  const [activeSessionConfig, setActiveSessionConfig] = useState<{
    scenario: RoleplayScenario;
    userRole: string;
    aiRole: string;
    difficulty: RoleplayDifficulty;
    mode: 'voice' | 'text';
  } | null>(null);

  const handleStartRoleplay = (config: {
    scenario: RoleplayScenario;
    userRole: string;
    aiRole: string;
    difficulty: RoleplayDifficulty;
    mode: 'voice' | 'text';
  }) => {
    setSelectedScenarioForStart(null);
    setActiveSessionConfig(config);
  };

  const handleCustomCreated = (newScenario: RoleplayScenario) => {
    setScenarios([newScenario, ...scenarios]);
    setIsCustomModalOpen(false);
    setSelectedScenarioForStart(newScenario);
  };

  const handleRetryScenario = (scenarioId: string, diff: RoleplayDifficulty) => {
    const matched = scenarios.find((s) => s.id === scenarioId) || ROLEPLAY_SCENARIOS[0];
    setActiveSessionConfig({
      scenario: matched,
      userRole: matched.userRole,
      aiRole: matched.aiRole,
      difficulty: diff,
      mode: 'voice'
    });
  };

  // If a roleplay session is active, render the full engine session view
  if (activeSessionConfig) {
    return (
      <RoleplayEngineSessionView
        scenario={activeSessionConfig.scenario}
        userRole={activeSessionConfig.userRole}
        aiRole={activeSessionConfig.aiRole}
        difficulty={activeSessionConfig.difficulty}
        initialMode={activeSessionConfig.mode}
        onExit={() => setActiveSessionConfig(null)}
      />
    );
  }

  const filteredScenarios = scenarios.filter((s) => {
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.expectedSkills.some((sk) => sk.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-16">
      {/* Page Header */}
      <PageHeader
        title="Practice English in Real Situations"
        subtitle="Choose a situation and start speaking — Jarvis stays strictly in character with instant coaching hints"
        badge="Realistic Roleplays"
        actions={
          <button
            type="button"
            onClick={() => setIsCustomModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-black text-xs rounded-xl shadow-sm hover:bg-primary-hover active:scale-95 transition-all"
          >
            <Plus size={16} />
            <span>Create My Roleplay</span>
          </button>
        }
      />

      {/* Main Two Primary Tabs: Roleplay | History (Requirement 1) */}
      <div className="flex items-center gap-2 p-1.5 bg-surface border border-border rounded-2xl w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('roleplay')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
            activeTab === 'roleplay'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-text-muted hover:text-text'
          }`}
        >
          <Sparkles size={14} />
          <span>Roleplay Scenarios</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-text-muted hover:text-text'
          }`}
        >
          <History size={14} />
          <span>Practice History</span>
        </button>
      </div>

      {/* Roleplay Tab Content */}
      {activeTab === 'roleplay' && (
        <div className="space-y-6">
          {/* Category Filter Pills (Requirement 2) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-card border border-border text-text-muted hover:text-text hover:bg-surface'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Search bar & Scenario Count */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 sm:max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by topic, interview question, or skill..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-xs sm:text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <p className="text-xs font-bold text-text-muted px-1">
              Showing {filteredScenarios.length} realistic scenarios
            </p>
          </div>

          {/* Scenario Cards Grid (Requirement 2) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredScenarios.map((scenario) => (
              <div
                key={scenario.id}
                className="p-5 rounded-3xl bg-card border border-border hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Category and Difficulty Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-surface border border-border text-text-muted">
                      {scenario.category.replace('_', ' ')}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        scenario.difficulty === 'Beginner'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : scenario.difficulty === 'Intermediate'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                          : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                      }`}
                    >
                      {scenario.difficulty}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h4 className="text-base font-black text-text group-hover:text-primary transition-colors leading-snug">
                    {scenario.title}
                  </h4>
                  <p className="text-xs text-text-muted mt-1.5 line-clamp-2 leading-relaxed">
                    {scenario.description}
                  </p>

                  {/* Roles and Duration */}
                  <div className="mt-3.5 pt-3 border-t border-border/70 flex items-center justify-between text-[11px] text-text-muted">
                    <span>
                      You: <strong className="text-text">{scenario.userRole}</strong>
                    </span>
                    <span className="flex items-center gap-1 font-semibold">
                      <Clock size={12} />
                      ~{scenario.estimatedDurationMin} mins
                    </span>
                  </div>

                  {/* Skills Practiced */}
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {scenario.expectedSkills.slice(0, 3).map((sk) => (
                      <span
                        key={sk}
                        className="px-2 py-0.5 rounded-md bg-surface text-[10px] font-semibold text-text-muted border border-border/50"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Start Button */}
                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-[11px] font-bold text-text-muted">
                    Jarvis: <span className="text-text font-semibold">{scenario.aiRole}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedScenarioForStart(scenario)}
                    className="px-4 py-2 bg-primary text-primary-foreground text-xs font-black rounded-xl hover:bg-primary-hover active:scale-95 transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Start</span>
                    <Play size={12} className="fill-current" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History Tab Content (Requirement 46) */}
      {activeTab === 'history' && (
        <RoleplayHistoryView onRetryScenario={handleRetryScenario} />
      )}

      {/* Scenario Start Screen Modal (Requirement 4) */}
      {selectedScenarioForStart && (
        <RoleplayStartModal
          scenario={selectedScenarioForStart}
          isOpen={true}
          onClose={() => setSelectedScenarioForStart(null)}
          onStart={handleStartRoleplay}
        />
      )}

      {/* Custom Roleplay Creator Modal (Requirement 51) */}
      {isCustomModalOpen && (
        <CreateCustomRoleplayModal
          isOpen={true}
          onClose={() => setIsCustomModalOpen(false)}
          onCreated={handleCustomCreated}
        />
      )}
    </div>
  );
};
