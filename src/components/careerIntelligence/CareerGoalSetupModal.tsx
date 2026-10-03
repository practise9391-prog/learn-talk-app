import React, { useState } from 'react';
import {
  X,
  Target,
  Briefcase,
  Building2,
  Globe,
  Award,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useCareerIntelligence } from '../../context/CareerIntelligenceContext';
import {
  CareerGoalProfile,
  ExperienceLevel,
  CompanyTypePreference,
} from '../../types/careerIntelligence';
import { CareerRoleCategory } from '../../types/career';

interface CareerGoalSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ROLE_OPTIONS: Array<{ id: CareerRoleCategory; label: string }> = [
  { id: 'software_developer', label: 'Software Developer / Full Stack' },
  { id: 'frontend_developer', label: 'Frontend Developer' },
  { id: 'backend_developer', label: 'Backend / Systems Engineer' },
  { id: 'data_analyst', label: 'Data Analyst / Scientist' },
  { id: 'product_manager', label: 'Product Manager' },
  { id: 'qa_engineer', label: 'QA / Automation Engineer' },
  { id: 'student_fresher', label: 'Graduate / Fresher' },
  { id: 'business_analyst', label: 'Business Analyst' },
  { id: 'customer_success', label: 'Customer Success / Support Lead' },
  { id: 'general_professional', label: 'General Corporate Professional' },
];

const EXPERIENCE_OPTIONS: Array<{ id: ExperienceLevel; label: string }> = [
  { id: 'fresher_student', label: 'Student / Fresher (< 1 year)' },
  { id: 'junior_1_2_years', label: 'Junior (1–2 years)' },
  { id: 'mid_3_5_years', label: 'Mid-Level (3–5 years)' },
  { id: 'senior_6_plus_years', label: 'Senior (6+ years)' },
  { id: 'lead_manager', label: 'Team Lead / Manager' },
];

const COMPANY_OPTIONS: Array<{ id: CompanyTypePreference; label: string }> = [
  { id: 'tech_product_company', label: 'Tech Product Company (e.g. Stripe, Google)' },
  { id: 'fast_paced_startup', label: 'Fast-Paced Early/Growth Startup' },
  { id: 'global_enterprise', label: 'Global Multinational Enterprise' },
  { id: 'consulting_services', label: 'IT Services & Consulting' },
  { id: 'remote_international', label: 'Remote International Team' },
];

export const CareerGoalSetupModal: React.FC<CareerGoalSetupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { goalProfile, updateGoalProfile } = useCareerIntelligence();

  const [targetRole, setTargetRole] = useState<CareerRoleCategory>(goalProfile.targetRole);
  const [customTitle, setCustomTitle] = useState(goalProfile.customRoleTitle || '');
  const [industry, setIndustry] = useState(goalProfile.industry);
  const [expLevel, setExpLevel] = useState<ExperienceLevel>(goalProfile.experienceLevel);
  const [companyType, setCompanyType] = useState<CompanyTypePreference>(goalProfile.targetCompanyType);
  const [targetCountry, setTargetCountry] = useState(goalProfile.targetCountry);
  const [communicationGoal, setCommunicationGoal] = useState(goalProfile.communicationGoal);

  if (!isOpen) return null;

  const handleSave = () => {
    updateGoalProfile({
      targetRole,
      customRoleTitle: customTitle.trim() || undefined,
      industry,
      experienceLevel: expLevel,
      targetCompanyType: companyType,
      targetCountry,
      communicationGoal,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl max-h-[92vh] bg-surface rounded-3xl border border-border shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-card/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Target size={20} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                Career Goal Profile
              </span>
              <h2 className="text-base sm:text-lg font-black text-text">
                Target Role & Employment Objectives
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-card transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Target Role Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text">Primary Career Role</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value as CareerRoleCategory)}
                className="w-full px-3 py-2.5 rounded-xl bg-card border border-border text-xs font-medium text-text focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary"
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Job Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text">Specific Target Job Title</label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g. Senior Full Stack Engineer"
                className="w-full px-3 py-2.5 rounded-xl bg-card border border-border text-xs text-text focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary"
              />
            </div>

            {/* Experience Level */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text">Experience Level</label>
              <select
                value={expLevel}
                onChange={(e) => setExpLevel(e.target.value as ExperienceLevel)}
                className="w-full px-3 py-2.5 rounded-xl bg-card border border-border text-xs font-medium text-text focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary"
              >
                {EXPERIENCE_OPTIONS.map((exp) => (
                  <option key={exp.id} value={exp.id}>
                    {exp.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Company Type Preference */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text">Target Company Environment</label>
              <select
                value={companyType}
                onChange={(e) => setCompanyType(e.target.value as CompanyTypePreference)}
                className="w-full px-3 py-2.5 rounded-xl bg-card border border-border text-xs font-medium text-text focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary"
              >
                {COMPANY_OPTIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Industry */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text">Target Industry</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. Fintech, Healthcare, SaaS, E-Commerce"
                className="w-full px-3 py-2.5 rounded-xl bg-card border border-border text-xs text-text focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary"
              />
            </div>

            {/* Target Country / Remote */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text">Target Location / Country</label>
              <input
                type="text"
                value={targetCountry}
                onChange={(e) => setTargetCountry(e.target.value)}
                placeholder="e.g. United States, United Kingdom, Remote Global"
                className="w-full px-3 py-2.5 rounded-xl bg-card border border-border text-xs text-text focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary"
              />
            </div>
          </div>

          {/* Primary Communication Goal */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold text-text">Primary English Communication Goal</label>
            <textarea
              value={communicationGoal}
              onChange={(e) => setCommunicationGoal(e.target.value)}
              placeholder="What communication breakthrough would unlock your next career milestone?"
              rows={3}
              className="w-full p-3.5 rounded-xl bg-card border border-border text-xs text-text focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none leading-relaxed"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/20 text-xs text-text-muted leading-relaxed">
            💡 Updating your career goal updates your <b>Skill Gap Map</b> and generates tailored interview and recruiter scenarios without deleting your learning history.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-card/60 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-text hover:bg-surface"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-2 hover:opacity-90 shadow-xs"
          >
            <CheckCircle2 size={14} />
            <span>Update Career Goals</span>
          </button>
        </div>
      </div>
    </div>
  );
};
