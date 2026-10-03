import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { CEFRLevel } from '../../types';
import { ContentType, ContentStatus, ManagedContentItem } from '../../types/admin';
import { ContentBlock, ContentRelationship, PublishingValidationReport } from '../../types/contentManagement';
import { contentManagementService } from '../../services/contentManagementService';
import {
  X,
  Save,
  Send,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  BookOpen,
  Volume2,
  Compass,
  ArrowRight,
  Plus,
  Trash2,
  Eye,
  ShieldCheck,
  Link2,
  FileText,
  Sliders,
  Check,
} from 'lucide-react';

interface ContentAuthoringModalProps {
  isOpen: boolean;
  onClose: () => void;
  editItem?: ManagedContentItem | null;
}

export const ContentAuthoringModal: React.FC<ContentAuthoringModalProps> = ({
  isOpen,
  onClose,
  editItem,
}) => {
  const {
    managedContent,
    createDraftContent,
    updateContentItem,
    publishContent,
    submitForReview,
    relationships,
    addRelationship,
    currentUserRole,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<'metadata' | 'blocks' | 'relationships' | 'checklist'>('metadata');

  // Core Metadata
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [type, setType] = useState<ContentType>('curriculum_lesson');
  const [level, setLevel] = useState<CEFRLevel>('B1');
  const [summary, setSummary] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(15);
  const [learningObjectives, setLearningObjectives] = useState<string[]>(['Master conversational workplace vocabulary']);
  const [newObjectiveInput, setNewObjectiveInput] = useState('');
  const [prerequisites, setPrerequisites] = useState<string[]>([]);
  const [newPrereqInput, setNewPrereqInput] = useState('');

  // Structured Blocks
  const [blocks, setBlocks] = useState<ContentBlock[]>([
    { id: 'blk-1', type: 'heading', order: 1, content: 'Overview & Context' },
    { id: 'blk-2', type: 'text', order: 2, content: 'In professional settings, natural pacing and polite structures define clear communication.' },
    { id: 'blk-3', type: 'example', order: 3, content: '"I would appreciate your insight on this proposal before the client call."', metadata: { speakerRole: 'Team Lead' } },
  ]);

  // Selected Target Relationships
  const [selectedRelType, setSelectedRelType] = useState<ContentRelationship['relationshipType']>('requires_grammar');
  const [selectedRelTargetTitle, setSelectedRelTargetTitle] = useState('Simple Present Tense Basics');

  // Warnings & Validation
  const [duplicateWarnings, setDuplicateWarnings] = useState<string[]>([]);
  const [cycleWarning, setCycleWarning] = useState<string | null>(null);
  const [validationReport, setValidationReport] = useState<PublishingValidationReport | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Populate form if editing
  useEffect(() => {
    if (editItem) {
      setTitle(editItem.title);
      setSlug(editItem.contentData?.slug || editItem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
      setType(editItem.type);
      setLevel(editItem.level);
      setSummary(editItem.summary);
      if (editItem.contentData?.learningObjectives) {
        setLearningObjectives(editItem.contentData.learningObjectives);
      }
      if (editItem.contentData?.sections?.[0]?.blocks) {
        setBlocks(editItem.contentData.sections[0].blocks);
      }
    } else {
      setTitle('');
      setSlug('');
      setType('curriculum_lesson');
      setLevel('B1');
      setSummary('');
    }
  }, [editItem]);

  // Live duplicate checking
  useEffect(() => {
    if (title.trim().length >= 4) {
      const generatedSlug = slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const warnings = contentManagementService.detectDuplicates(
        { title: title.trim(), slug: generatedSlug, type, id: editItem?.id },
        managedContent
      );
      setDuplicateWarnings(warnings);
    } else {
      setDuplicateWarnings([]);
    }
  }, [title, slug, type]);

  // Live prerequisite cycle check
  useEffect(() => {
    if (editItem && prerequisites.length > 0) {
      const cycleCheck = contentManagementService.detectPrerequisiteCycles(
        editItem.id,
        prerequisites,
        relationships
      );
      if (cycleCheck.hasCycle) {
        setCycleWarning(`Circular Prerequisite Loop detected: ${cycleCheck.cyclePath?.join(' → ')}`);
      } else {
        setCycleWarning(null);
      }
    } else {
      setCycleWarning(null);
    }
  }, [prerequisites]);

  if (!isOpen) return null;

  const handleAddObjective = () => {
    if (!newObjectiveInput.trim()) return;
    setLearningObjectives([...learningObjectives, newObjectiveInput.trim()]);
    setNewObjectiveInput('');
  };

  const handleRemoveObjective = (index: number) => {
    setLearningObjectives(learningObjectives.filter((_, i) => i !== index));
  };

  const handleAddBlock = (blockType: ContentBlock['type']) => {
    const newBlock: ContentBlock = {
      id: `blk-${Date.now()}`,
      type: blockType,
      order: blocks.length + 1,
      content: blockType === 'heading' ? 'New Section Heading' : 'Enter educational content here...',
    };
    setBlocks([...blocks, newBlock]);
  };

  const handleUpdateBlockContent = (id: string, content: string) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, content } : b)));
  };

  const handleRemoveBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  const runPublishingAudit = () => {
    const draftMock: any = {
      id: editItem?.id || 'temp-id',
      unitId: 'unit-preview',
      level,
      title: title.trim(),
      slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      difficulty: 'normal',
      estimatedMinutes,
      learningObjectives,
      prerequisites,
      tags: [type, level.toLowerCase()],
      status: 'draft',
      version: 1,
      author: 'Current Editor',
      sections: [
        {
          id: 'sec-main',
          name: 'explanation',
          order: 1,
          blocks,
        },
      ],
      relationships: relationships.filter((r) => r.sourceId === editItem?.id),
      translations: [],
      versions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const report = contentManagementService.validateForPublishing(draftMock);
    setValidationReport(report);
    setActiveTab('checklist');
  };

  const handleSaveDraft = () => {
    if (!title.trim()) return;

    const payload = {
      title: title.trim(),
      type,
      level,
      author: 'Current Editor',
      summary: summary.trim() || `Comprehensive module covering ${title}`,
      contentData: {
        slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        estimatedMinutes,
        learningObjectives,
        prerequisites,
        sections: [
          {
            name: 'explanation',
            order: 1,
            blocks,
          },
        ],
      },
    };

    if (editItem) {
      updateContentItem(editItem.id, payload, 'Updated content draft in CMS');
      setSaveSuccessMsg(`Content "${title}" saved successfully.`);
    } else {
      const newId = createDraftContent(payload);
      setSaveSuccessMsg(`New draft "${title}" created (ID: ${newId}).`);
    }

    setTimeout(() => {
      setSaveSuccessMsg(null);
      onClose();
    }, 1200);
  };

  const handlePublishDirectly = () => {
    if (editItem) {
      publishContent(editItem.id);
      setSaveSuccessMsg(`Content "${title}" published to live curriculum!`);
      setTimeout(() => {
        setSaveSuccessMsg(null);
        onClose();
      }, 1200);
    } else {
      handleSaveDraft();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-card border border-border shadow-2xl p-6 sm:p-8 my-8 text-text max-h-[90vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Layers size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-text">
                  {editItem ? `Edit: ${editItem.title}` : 'Author New Learning Content'}
                </h2>
                {editItem && (
                  <span className="px-2 py-0.5 rounded-full bg-surface border border-border text-[10px] font-mono font-bold">
                    v{editItem.version}
                  </span>
                )}
              </div>
              <p className="text-xs text-text-secondary">
                Curriculum, Canonical Knowledge, Block-Based Content & Publishing Validation
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-text-secondary hover:text-text hover:bg-surface transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Live Duplicate or Cycle Warning Banners */}
        {duplicateWarnings.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-700 dark:text-amber-400 space-y-1">
            <div className="flex items-center gap-2 font-black">
              <AlertTriangle size={15} />
              <span>Potential Duplicate Warning</span>
            </div>
            {duplicateWarnings.map((w, i) => (
              <p key={i} className="pl-6">{w}</p>
            ))}
          </div>
        )}

        {cycleWarning && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2 font-bold">
            <AlertTriangle size={16} className="shrink-0" />
            <span>{cycleWarning}</span>
          </div>
        )}

        {/* Tab navigation */}
        <div className="flex gap-2 border-b border-border pb-3">
          {[
            { id: 'metadata', label: '1. Metadata & Objectives' },
            { id: 'blocks', label: '2. Section Blocks Editor' },
            { id: 'relationships', label: '3. Knowledge Relationships' },
            { id: 'checklist', label: '4. Publishing Checklist' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface text-text-secondary hover:text-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Metadata */}
        {activeTab === 'metadata' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-text-secondary block mb-1">Content Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Present Continuous for Future Schedules"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-sm font-semibold text-text focus:outline-hidden focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-text-secondary block mb-1">Content Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-xs font-bold text-text focus:outline-hidden focus:border-primary"
                >
                  <option value="curriculum_lesson">Curriculum Lesson</option>
                  <option value="grammar_topic">Canonical Grammar</option>
                  <option value="vocabulary_item">Canonical Vocabulary</option>
                  <option value="idiom">Idiom</option>
                  <option value="phrasal_verb">Phrasal Verb</option>
                  <option value="roleplay_scenario">Roleplay Scenario</option>
                  <option value="speaking_test">Speaking Test</option>
                  <option value="practice_activity">Practice Activity</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-text-secondary block mb-1">URL Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="auto-generated-slug"
                  className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-xs font-mono text-text focus:outline-hidden focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-text-secondary block mb-1">Target CEFR Level</label>
                <div className="grid grid-cols-6 gap-1">
                  {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as CEFRLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setLevel(lvl)}
                      className={`py-1.5 rounded-lg text-xs font-black border transition-all ${
                        level === lvl ? 'bg-primary text-white border-primary' : 'bg-surface border-border text-text-secondary'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-text-secondary block mb-1">Estimated Effort (Mins)</label>
                <input
                  type="number"
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-xs font-semibold text-text focus:outline-hidden focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-text-secondary block mb-1">Summary / Concept Overview</label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={2}
                placeholder="Brief pedagogical summary explaining what the learner will master..."
                className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-xs text-text focus:outline-hidden focus:border-primary"
              />
            </div>

            {/* Learning Objectives */}
            <div className="p-4 rounded-2xl bg-surface/60 border border-border space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-text-secondary block">
                Learning Objectives
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newObjectiveInput}
                  onChange={(e) => setNewObjectiveInput(e.target.value)}
                  placeholder="Add clear measurable objective..."
                  className="flex-1 px-3 py-1.5 rounded-xl bg-card border border-border text-xs text-text"
                />
                <button
                  type="button"
                  onClick={handleAddObjective}
                  className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold"
                >
                  Add
                </button>
              </div>

              <div className="space-y-1.5">
                {learningObjectives.map((obj, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-card border border-border text-xs">
                    <span className="font-medium text-text">• {obj}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveObjective(i)}
                      className="text-text-secondary hover:text-rose-500"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Block-Based Content Editor */}
        {activeTab === 'blocks' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text-secondary">Reusable Content Blocks ({blocks.length}):</span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => handleAddBlock('heading')}
                  className="px-2.5 py-1 rounded-lg bg-surface border border-border text-xs font-bold hover:bg-card"
                >
                  + Heading
                </button>
                <button
                  type="button"
                  onClick={() => handleAddBlock('text')}
                  className="px-2.5 py-1 rounded-lg bg-surface border border-border text-xs font-bold hover:bg-card"
                >
                  + Text
                </button>
                <button
                  type="button"
                  onClick={() => handleAddBlock('example')}
                  className="px-2.5 py-1 rounded-lg bg-surface border border-border text-xs font-bold hover:bg-card"
                >
                  + Example
                </button>
                <button
                  type="button"
                  onClick={() => handleAddBlock('audio')}
                  className="px-2.5 py-1 rounded-lg bg-surface border border-border text-xs font-bold hover:bg-card"
                >
                  + Audio
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {blocks.map((block, index) => (
                <div key={block.id} className="p-4 rounded-2xl bg-surface/70 border border-border space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase">
                      Block {index + 1}: {block.type}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveBlock(block.id)}
                      className="text-text-secondary hover:text-rose-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <textarea
                    value={block.content}
                    onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                    rows={block.type === 'heading' ? 1 : 2}
                    className="w-full p-2.5 rounded-xl bg-card border border-border text-xs font-medium text-text focus:outline-hidden focus:border-primary"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Knowledge Relationships */}
        {activeTab === 'relationships' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-surface/70 border border-border space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-text-secondary block">
                Link to Canonical Knowledge Graph
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-text-secondary block mb-1">Relationship Type</label>
                  <select
                    value={selectedRelType}
                    onChange={(e) => setSelectedRelType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs font-bold"
                  >
                    <option value="requires_grammar">Requires Grammar Concept</option>
                    <option value="teaches_vocabulary">Teaches Canonical Vocabulary</option>
                    <option value="reinforced_by_roleplay">Reinforced by Roleplay</option>
                    <option value="tested_in">Tested In Assessment</option>
                    <option value="prerequisite_of">Prerequisite Of</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-text-secondary block mb-1">Target Concept Title</label>
                  <input
                    type="text"
                    value={selectedRelTargetTitle}
                    onChange={(e) => setSelectedRelTargetTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs font-semibold"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (editItem) {
                    addRelationship({
                      sourceId: editItem.id,
                      sourceType: type,
                      targetId: `target-${Date.now()}`,
                      targetType: 'grammar_topic',
                      relationshipType: selectedRelType,
                      targetTitle: selectedRelTargetTitle,
                    });
                  }
                }}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-black flex items-center gap-1.5"
              >
                <Link2 size={14} />
                <span>Link Dependency</span>
              </button>
            </div>

            {/* List of current relationships */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-text-secondary">Current Relationships:</span>
              {relationships
                .filter((r) => editItem && r.sourceId === editItem.id)
                .map((rel) => (
                  <div key={rel.id} className="p-3 rounded-xl bg-card border border-border flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-primary">{rel.relationshipType}</span> → {rel.targetTitle}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Tab 4: Publishing Checklist */}
        {activeTab === 'checklist' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-text">Pre-Publishing Validation Audit</h4>
                <p className="text-xs text-text-secondary">Ensures educational completeness, audio readiness, and error prevention</p>
              </div>

              <button
                type="button"
                onClick={runPublishingAudit}
                className="px-4 py-2 rounded-xl bg-surface border border-border text-xs font-bold hover:bg-card flex items-center gap-1.5"
              >
                <ShieldCheck size={14} className="text-primary" />
                <span>Run Audit</span>
              </button>
            </div>

            {validationReport ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface border border-border">
                  <span className="text-xs font-bold">Completeness Score:</span>
                  <span className={`text-base font-black ${validationReport.isValid ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {validationReport.score}/100
                  </span>
                </div>

                <div className="space-y-2">
                  {validationReport.checks.map((chk) => (
                    <div
                      key={chk.id}
                      className={`p-3 rounded-xl border flex items-start gap-3 text-xs ${
                        chk.status === 'passed'
                          ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                          : chk.status === 'warning'
                          ? 'bg-amber-500/5 border-amber-500/20 text-amber-700 dark:text-amber-400'
                          : 'bg-rose-500/5 border-rose-500/20 text-rose-700 dark:text-rose-400'
                      }`}
                    >
                      {chk.status === 'passed' ? (
                        <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-bold">{chk.label}</div>
                        <div className="opacity-90">{chk.message}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-surface/50 border border-dashed border-border text-center space-y-2">
                <ShieldCheck size={32} className="mx-auto text-primary opacity-60" />
                <p className="text-xs text-text-secondary">Click "Run Audit" to verify completeness before publishing.</p>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          {saveSuccessMsg ? (
            <div className="text-xs font-bold text-emerald-500 flex items-center gap-1.5">
              <CheckCircle2 size={15} />
              <span>{saveSuccessMsg}</span>
            </div>
          ) : (
            <span className="text-xs text-text-secondary">All changes versioned in audit trail</span>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-text-secondary hover:bg-surface"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-4 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-text hover:bg-card flex items-center gap-1.5"
            >
              <Save size={14} />
              <span>Save as Draft</span>
            </button>
            <button
              type="button"
              onClick={handlePublishDirectly}
              className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-black shadow-xs hover:bg-primary/90 flex items-center gap-1.5"
            >
              <Send size={14} />
              <span>Publish Content</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
