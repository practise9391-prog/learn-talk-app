import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import {
  X,
  Upload,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Copy,
  Check,
  ShieldCheck,
} from 'lucide-react';

interface ContentImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContentImportExportModal: React.FC<ContentImportExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { importContentJson, exportContentJson } = useAdmin();

  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [importJsonText, setImportJsonText] = useState('');
  const [importResult, setImportResult] = useState<{
    success: boolean;
    importedCount: number;
    errors: string[];
  } | null>(null);

  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const exportData = exportContentJson();

  const handleCopyExport = () => {
    navigator.clipboard.writeText(exportData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadExport = () => {
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `learntalk-curriculum-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRunImport = () => {
    if (!importJsonText.trim()) return;
    const result = importContentJson(importJsonText);
    setImportResult(result);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-card border border-border shadow-2xl p-6 sm:p-8 my-8 text-text max-h-[90vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Download size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-text">Content Import & Export Pipeline</h2>
              <p className="text-xs text-text-secondary">
                Curriculum backup, bulk migration, and sanitized data management
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

        {/* Tab switch */}
        <div className="flex gap-2 border-b border-border pb-3">
          <button
            type="button"
            onClick={() => {
              setActiveTab('export');
              setImportResult(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'export'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface text-text-secondary hover:text-text'
            }`}
          >
            Export Structured Curriculum
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('import');
              setImportResult(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'import'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface text-text-secondary hover:text-text'
            }`}
          >
            Import JSON Modules
          </button>
        </div>

        {activeTab === 'export' ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 text-xs text-emerald-700 dark:text-emerald-400">
              <ShieldCheck size={18} className="shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Zero Learner Data Leakage Guarantee</span>
                <p className="opacity-90">
                  Export includes exclusively educational definitions, canonical grammar, vocabulary, lessons, and tests. Private learner notes, recording audio, and personal scores are strictly omitted.
                </p>
              </div>
            </div>

            <div className="relative">
              <textarea
                readOnly
                value={exportData}
                rows={12}
                className="w-full p-4 rounded-2xl bg-surface border border-border font-mono text-[11px] text-text select-all"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCopyExport}
                className="px-4 py-2.5 rounded-xl bg-surface border border-border text-xs font-bold text-text hover:bg-card flex items-center gap-1.5"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy JSON'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadExport}
                className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-black flex items-center gap-1.5 hover:bg-primary/90 shadow-xs"
              >
                <Download size={14} />
                <span>Download .JSON File</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 text-xs text-text-secondary space-y-1">
              <div className="font-bold text-text">Pre-Insertion Validation Safety:</div>
              <p>
                All imported items are rigorously parsed and validated. Valid items always land in <strong>Draft</strong> status so content reviewers can inspect them before publishing to learners.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-text-secondary block mb-1">
                Paste JSON Array of Content Items:
              </label>
              <textarea
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                rows={10}
                placeholder={`[\n  {\n    "title": "Unit 5: Travel and Navigation",\n    "type": "curriculum_lesson",\n    "level": "A2",\n    "summary": "Asking for directions and hotel check-in."\n  }\n]`}
                className="w-full p-4 rounded-2xl bg-surface border border-border font-mono text-[11px] text-text focus:outline-hidden focus:border-primary"
              />
            </div>

            {importResult && (
              <div
                className={`p-4 rounded-2xl border text-xs ${
                  importResult.success
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-400'
                }`}
              >
                {importResult.success ? (
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 size={16} />
                    <span>Successfully imported {importResult.importedCount} item(s) into Drafts!</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-bold">
                      <AlertTriangle size={16} />
                      <span>Validation Failed. No invalid content was imported.</span>
                    </div>
                    {importResult.errors.map((err, i) => (
                      <p key={i} className="pl-6">• {err}</p>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-text-secondary hover:bg-surface"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRunImport}
                className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-black shadow-xs hover:bg-primary/90 flex items-center gap-1.5"
              >
                <Upload size={14} />
                <span>Validate & Import to Drafts</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
