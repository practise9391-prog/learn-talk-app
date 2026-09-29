import React from 'react';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
  icon?: string;
}

interface FilterBarProps {
  options: FilterOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  options,
  selectedId,
  onSelect,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar ${className}`}>
      {options.map((opt) => {
        const isSelected = opt.id === selectedId;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelect(opt.id)}
            className={`
              inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all
              ${
                isSelected
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20 scale-100'
                  : 'bg-card text-text-muted hover:text-text border border-border hover:border-slate-300 dark:hover:border-slate-700'
              }
            `}
          >
            {opt.icon && <span>{opt.icon}</span>}
            <span>{opt.label}</span>
            {opt.count !== undefined && (
              <span
                className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-text-muted'
                }`}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
