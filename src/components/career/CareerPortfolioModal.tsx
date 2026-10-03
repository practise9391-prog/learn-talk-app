import React, { useState } from 'react';
import {
  X,
  Bookmark,
  FolderOpen,
  Copy,
  Check,
  Trash2,
  Plus,
  Download,
  Tag,
  Calendar,
  FileText,
} from 'lucide-react';
import { useCareer } from '../../context/CareerContext';
import { CareerPortfolioItem } from '../../types/career';

interface CareerPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CareerPortfolioModal: React.FC<CareerPortfolioModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { portfolioItems, savePortfolioItem, deletePortfolioItem } = useCareer();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newItemType, setNewItemType] = useState<CareerPortfolioItem['itemType']>('self_intro');

  if (!isOpen) return null;

  const filteredItems = portfolioItems.filter((item) => {
    if (selectedType === 'all') return true;
    return item.itemType === selectedType;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    savePortfolioItem({
      itemType: newItemType,
      title: newTitle.trim(),
      content: newContent.trim(),
      tags: ['Custom', newItemType],
    });

    setNewTitle('');
    setNewContent('');
    setIsAddingNew(false);
  };

  const handleExportAll = () => {
    const markdown = portfolioItems
      .map(
        (item) => `## ${item.title} (${item.itemType})
Date: ${new Date(item.lastUpdated).toLocaleDateString()}
Tags: ${item.tags.join(', ')}

${item.content}

---`
      )
      .join('\n\n');

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Career-Portfolio-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-card border border-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <FolderOpen size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-text">Private Career Portfolio</h2>
              <p className="text-xs text-text-muted">
                Your personal vault of perfected introductions, resume bullets, project architectures, and answers
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: 'All Items' },
                { id: 'self_intro', label: 'Introductions' },
                { id: 'resume_bullet', label: 'Resume Bullets' },
                { id: 'project_summary', label: 'Projects' },
                { id: 'interview_answer', label: 'Interview Q&A' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedType(tab.id)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all ${
                    selectedType === tab.id
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'bg-surface hover:bg-card border border-border text-text'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAddingNew(!isAddingNew)}
                className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 hover:opacity-90 transition-opacity"
              >
                <Plus size={13} />
                <span>Add Entry</span>
              </button>

              <button
                type="button"
                onClick={handleExportAll}
                className="px-3 py-1.5 rounded-xl bg-surface border border-border font-bold text-xs text-text hover:bg-card flex items-center gap-1.5 transition-colors"
                title="Export all to Markdown"
              >
                <Download size={13} />
                <span>Export (.md)</span>
              </button>
            </div>
          </div>

          {/* New Item Form Drawer */}
          {isAddingNew && (
            <form
              onSubmit={handleCreateNew}
              className="p-5 rounded-2xl bg-surface border border-primary/30 space-y-3 animate-fadeIn"
            >
              <h4 className="text-xs font-black uppercase tracking-wider text-primary">
                Add Custom Portfolio Asset
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-text-muted block mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. 30s Product Pitch or Distributed Systems Story"
                    className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs text-text focus:outline-hidden focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-text-muted block mb-1">Category</label>
                  <select
                    value={newItemType}
                    onChange={(e) => setNewItemType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs text-text focus:outline-hidden focus:ring-1 focus:ring-primary"
                  >
                    <option value="self_intro">Self Introduction</option>
                    <option value="resume_bullet">Resume Bullet</option>
                    <option value="project_summary">Project Explanation</option>
                    <option value="interview_answer">Interview Answer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-text-muted block mb-1">Content</label>
                <textarea
                  required
                  rows={3}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Paste or write the polished text..."
                  className="w-full p-3 rounded-xl bg-card border border-border text-xs text-text focus:outline-hidden focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-3 py-1.5 rounded-xl bg-surface border border-border text-xs font-bold text-text hover:bg-card"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90"
                >
                  Save Entry
                </button>
              </div>
            </form>
          )}

          {/* Portfolio Items List */}
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-surface border border-border hover:border-border/80 transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">
                        {item.itemType.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-text-muted">
                        {new Date(item.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-sm font-black text-text">{item.title}</h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleCopy(item.id, item.content)}
                      className="p-1.5 rounded-lg bg-card border border-border text-text hover:text-primary transition-colors"
                      title="Copy to clipboard"
                    >
                      {copiedId === item.id ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => deletePortfolioItem(item.id)}
                      className="p-1.5 rounded-lg bg-card border border-border text-text hover:text-rose-500 transition-colors"
                      title="Delete item"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-text leading-relaxed whitespace-pre-line font-normal">
                  {item.content}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-card border border-border text-[10px] text-text-muted font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {filteredItems.length === 0 && (
              <div className="p-12 text-center text-xs text-text-muted rounded-2xl border border-dashed border-border">
                No items in this category yet. Practice introductions, refine resume bullets, or add entries above!
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-surface/30 flex items-center justify-between">
          <span className="text-xs text-text-muted">
            All career portfolio items remain private to your local learner profile.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-text hover:bg-card transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
