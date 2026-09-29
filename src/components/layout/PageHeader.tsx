import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  showBack?: boolean;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  showBack = false,
  actions,
  className = '',
}) => {
  const { goBack, canGoBack } = useNavigation();

  return (
    <div className={`mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${className}`}>
      <div className="flex items-start gap-3 min-w-0">
        {(showBack || canGoBack) && (
          <button
            type="button"
            onClick={goBack}
            className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-card border border-border mt-0.5 transition-colors shrink-0"
            aria-label="Go back to previous page"
            title="Go back"
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-text tracking-tight truncate">
              {title}
            </h1>
            {badge && (
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-text-muted mt-1 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
};
