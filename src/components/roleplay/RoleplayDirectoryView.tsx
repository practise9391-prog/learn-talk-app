import React, { useState } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { RoleplayTask } from '../../types';
import { AI_PERSONAS } from '../../data/personas';
import { FilterBar } from '../common/FilterBar';
import { useNavigation } from '../../context/NavigationContext';
import { Briefcase, Building, Coffee, Play, Target, Clock, Award } from 'lucide-react';

export const ROLEPLAY_TASKS: RoleplayTask[] = [
  {
    id: 'rp-software-interview',
    title: 'Software Engineer Behavioral Interview',
    category: 'interview',
    description: 'Explain past technical projects, handle "Tell me about yourself", and respond using the STAR method.',
    difficulty: 'B2',
    personaId: 'interviewer',
    expectedDurationMin: 15,
    goals: ['Clear introduction within 90 seconds', 'Explain technical tradeoffs calmly', 'Ask 2 thoughtful closing questions'],
  },
  {
    id: 'rp-manager-sync',
    title: 'Manager 1:1 Weekly Standup',
    category: 'corporate',
    description: 'Update your manager on blockers, justify deadlines, and negotiate bandwidth without feeling intimidated.',
    difficulty: 'B1',
    personaId: 'manager',
    expectedDurationMin: 10,
    goals: ['Provide concise status updates', 'State blocker clearly', 'Propose constructive solution'],
  },
  {
    id: 'rp-hotel-checkin',
    title: 'Hotel Check-in & Room Upgrade Request',
    category: 'daily_life',
    description: 'Politely request a quiet high-floor room, clarify breakfast timing, and handle luggage storage.',
    difficulty: 'A2',
    personaId: 'hotel_receptionist',
    expectedDurationMin: 8,
    goals: ['State booking name and reservation ID', 'Ask for amenities politely using modal verbs', 'Confirm checkout time'],
  },
  {
    id: 'rp-doctor-visit',
    title: 'Doctor Appointment & Describing Symptoms',
    category: 'daily_life',
    description: 'Explain duration of headache/fever, describe allergy history, and understand prescription directions.',
    difficulty: 'A2',
    personaId: 'supportive_coach',
    expectedDurationMin: 10,
    goals: ['Describe physical symptoms accurately', 'Ask about dosage before/after meals', 'Inquire about side effects'],
  },
  {
    id: 'rp-sales-pitch',
    title: 'Client Demo & Handling Price Objections',
    category: 'corporate',
    description: 'Present product value, articulate ROI, and answer customer hesitation without defensive language.',
    difficulty: 'C1',
    personaId: 'interviewer',
    expectedDurationMin: 15,
    goals: ['Summarize value proposition clearly', 'Acknowledge client budget concern gracefully', 'Propose next follow-up call'],
  },
];

export const RoleplayDirectoryView: React.FC = () => {
  const { navigate } = useNavigation();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Roleplays', count: ROLEPLAY_TASKS.length },
    { id: 'interview', label: 'Job Interviews', count: 1 },
    { id: 'corporate', label: 'Workplace & Corporate', count: 2 },
    { id: 'daily_life', label: 'Daily Life & Services', count: 2 },
  ];

  const filteredTasks = ROLEPLAY_TASKS.filter(
    (t) => activeCategory === 'all' || t.category === activeCategory
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Roleplay Speaking Simulator"
        subtitle="Simulate high-stakes interviews, workplace discussions, and real-life service scenarios"
        badge="Real World Scenarios"
      />

      <FilterBar
        options={categories}
        selectedId={activeCategory}
        onSelect={setActiveCategory}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTasks.map((task) => {
          const persona = AI_PERSONAS.find((p) => p.id === task.personaId) || AI_PERSONAS[0];

          return (
            <div
              key={task.id}
              className="p-6 rounded-3xl bg-card border border-border hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-wider">
                    {task.category.replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-text-muted flex items-center gap-1">
                      <Clock size={12} />
                      {task.expectedDurationMin}m
                    </span>
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-surface border border-border text-text">
                      {task.difficulty}
                    </span>
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-black text-text mb-1">
                  {task.title}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed mb-4">
                  {task.description}
                </p>

                {/* AI Partner Badge */}
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-surface border border-border mb-4">
                  <span className="text-xl">{persona.avatar}</span>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-text block truncate">
                      {persona.name}
                    </span>
                    <span className="text-[10px] text-text-muted">{persona.role}</span>
                  </div>
                </div>

                {/* Task Goals */}
                <div className="space-y-1.5 mb-5">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                    Key Objectives:
                  </span>
                  {task.goals.map((g, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-text">
                      <Target size={13} className="text-primary shrink-0 mt-0.5" />
                      <span>{g}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate('/talk/location/office', { personaId: task.personaId, taskTitle: task.title })
                }
                className="w-full py-3 bg-primary text-primary-foreground font-bold text-xs rounded-xl shadow-md shadow-primary/20 hover:bg-primary-hover active:scale-99 transition-all flex items-center justify-center gap-2"
              >
                <Play size={14} fill="currentColor" />
                <span>Launch Roleplay Session</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
