import React, { useState } from 'react';
import { useCurriculumModule } from '../../context/CurriculumModuleContext';
import { useNavigation } from '../../context/NavigationContext';
import { GlobalSearchResult } from '../../types/curriculumModules';
import {
  Search,
  BookOpen,
  Sparkles,
  Compass,
  Layers,
  ArrowRight,
  X,
  Clock,
  CheckCircle2
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const { searchCurriculumGlobally } = useCurriculumModule();
  const { navigate } = useNavigation();

  const [query, setQuery] = useState<string>('');
  const results = searchCurriculumGlobally(query);

  if (!isOpen) return null;

  const handleSelectResult = (result: GlobalSearchResult) => {
    onClose();
    if (result.type === 'grammar') {
      navigate('/grammar');
    } else if (result.type === 'vocabulary') {
      navigate('/vocabulary');
    } else if (result.type === 'idiom') {
      navigate('/idioms');
    } else if (result.type === 'phrasal_verb') {
      navigate('/phrasal-verbs');
    } else {
      navigate('/learn');
    }
  };

  const getTypeIcon = (type: GlobalSearchResult['type']) => {
    switch (type) {
      case 'grammar':
        return <BookOpen size={15} className="text-primary" />;
      case 'vocabulary':
        return <Sparkles size={15} className="text-sky-500" />;
      case 'idiom':
        return <Compass size={15} className="text-amber-500" />;
      case 'phrasal_verb':
        return <Layers size={15} className="text-emerald-500" />;
      default:
        return <BookOpen size={15} className="text-text-muted" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-card border border-border w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[85vh] flex flex-col">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-border bg-surface/50 flex items-center gap-3 shrink-0">
          <Search size={20} className="text-primary shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search words, grammar rules, idioms, phrasal verbs, lessons..."
            className="flex-1 bg-transparent text-sm text-text font-semibold focus:outline-none placeholder:text-text-muted/60"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-xs text-text-muted hover:text-text px-2"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-text-muted hover:text-text hover:bg-surface"
          >
            <X size={18} />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 sm:p-5 space-y-2 overflow-y-auto">
          {!query.trim() ? (
            <div className="p-8 text-center text-xs text-text-muted space-y-2">
              <Search size={28} className="mx-auto text-text-muted/50 mb-1" />
              <p className="font-semibold text-text">Type to search across the entire curriculum</p>
              <p className="text-[11px] max-w-sm mx-auto">
                Try searching for words like "deadline", grammar topics like "present perfect", or idioms like "break the ice".
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-xs text-text-muted">
              No matching items found for "{query}". Try checking for spelling or searching for a synonym.
            </div>
          ) : (
            results.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectResult(item)}
                className="p-3.5 rounded-2xl bg-surface border border-border hover:border-primary/40 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center shrink-0">
                    {getTypeIcon(item.type)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <strong className="text-xs sm:text-sm font-black text-text group-hover:text-primary transition-colors truncate">
                        {item.title}
                      </strong>
                      <span className="text-[9px] font-black uppercase px-2 py-0.2 rounded-full bg-primary/10 text-primary">
                        {item.type.replace('_', ' ')}
                      </span>
                      <span className="text-[9px] font-bold text-text-muted">
                        Level {item.level}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-muted truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <ArrowRight size={14} className="text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
