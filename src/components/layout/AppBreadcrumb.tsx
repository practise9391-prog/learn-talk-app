import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';
import { MASTER_CURRICULUM } from '../../data/curriculumData';

export const AppBreadcrumb: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { currentRoute, navigate } = useNavigation();
  const path = currentRoute.path;
  const params = currentRoute.params || {};

  // Don't display breadcrumbs on root or home view
  if (path === '/' || path === '/home') {
    return null;
  }

  interface CrumbItem {
    label: string;
    path?: string;
    params?: Record<string, string>;
  }

  const crumbs: CrumbItem[] = [{ label: 'Home', path: '/home' }];

  if (path.startsWith('/learn/lesson/')) {
    const lessonId = path.replace('/learn/lesson/', '');
    let matchedUnitTitle = 'Unit';
    let matchedLessonTitle = 'Lesson';

    for (const lvl of MASTER_CURRICULUM) {
      for (const unit of lvl.units) {
        const found = unit.lessons.find((l) => l.id === lessonId);
        if (found) {
          matchedUnitTitle = unit.title;
          matchedLessonTitle = found.title;
          break;
        }
      }
    }

    crumbs.push({ label: 'Learn Curriculum', path: '/learn' });
    crumbs.push({ label: matchedUnitTitle, path: '/learn' });
    crumbs.push({ label: matchedLessonTitle });
  } else if (path === '/learn') {
    crumbs.push({ label: 'Learn Curriculum' });
  } else if (path === '/talk') {
    crumbs.push({ label: 'Talk & Jarvis' });
  } else if (path === '/talk/call') {
    crumbs.push({ label: 'Talk Hub', path: '/talk' });
    crumbs.push({ label: params.lessonContext ? `Practice: ${params.lessonContext}` : 'Spoken Conversation Call' });
  } else if (path === '/talk/jarvis') {
    crumbs.push({ label: 'Talk Hub', path: '/talk' });
    crumbs.push({ label: 'Jarvis Voice Partner' });
  } else if (path === '/talk/saved-phrases') {
    crumbs.push({ label: 'Talk Hub', path: '/talk' });
    crumbs.push({ label: 'My Saved Phrases' });
  } else if (path === '/talk/speed') {
    crumbs.push({ label: 'Talk Hub', path: '/talk' });
    crumbs.push({ label: 'Speed Practice' });
  } else if (path === '/talk/translate') {
    crumbs.push({ label: 'Talk Hub', path: '/talk' });
    crumbs.push({ label: 'Instant Translation' });
  } else if (path === '/practice') {
    crumbs.push({ label: 'Practice Arena' });
  } else if (path === '/roleplay') {
    crumbs.push({ label: 'Roleplay Scenarios' });
  } else if (path === '/test') {
    crumbs.push({ label: 'Tests & Assessments' });
  } else if (path === '/grammar') {
    crumbs.push({ label: 'Knowledge Bank', path: '/grammar' });
    crumbs.push({ label: 'Grammar Modules' });
  } else if (path === '/vocabulary') {
    crumbs.push({ label: 'Knowledge Bank', path: '/vocabulary' });
    crumbs.push({ label: 'Vocabulary Bank' });
  } else if (path === '/idioms') {
    crumbs.push({ label: 'Knowledge Bank', path: '/idioms' });
    crumbs.push({ label: 'Idioms & Metaphors' });
  } else if (path === '/phrasal-verbs') {
    crumbs.push({ label: 'Knowledge Bank', path: '/phrasal-verbs' });
    crumbs.push({ label: 'Phrasal Verbs' });
  } else if (path === '/pronunciation') {
    crumbs.push({ label: 'Knowledge Bank', path: '/pronunciation' });
    crumbs.push({ label: 'Pronunciation Lab' });
  } else if (path === '/history') {
    crumbs.push({ label: 'Progress & Analytics', path: '/progress' });
    crumbs.push({ label: 'Practice History' });
  } else if (path === '/mistakes') {
    crumbs.push({ label: 'Progress & Analytics', path: '/progress' });
    crumbs.push({ label: 'Common Mistakes' });
  } else if (path === '/progress') {
    crumbs.push({ label: 'Skills & Analytics' });
  } else if (path === '/recordings') {
    crumbs.push({ label: 'Progress & Analytics', path: '/progress' });
    crumbs.push({ label: 'Voice Recordings' });
  } else if (path === '/profile') {
    crumbs.push({ label: 'Learner Profile' });
  } else if (path === '/settings') {
    crumbs.push({ label: 'Settings & Preferences' });
  } else if (path === '/admin') {
    crumbs.push({ label: 'Admin CMS Console' });
  } else {
    // Default fallback
    const seg = path.replace('/', '').replace(/-/g, ' ');
    crumbs.push({ label: seg.charAt(0).toUpperCase() + seg.slice(1) });
  }

  return (
    <nav
      aria-label="Breadcrumb navigation"
      className={`flex items-center text-xs text-text-muted mb-4 overflow-x-auto py-1 scrollbar-none select-none ${className}`}
    >
      <ol className="flex items-center gap-1.5 whitespace-nowrap">
        {crumbs.map((crumb, idx) => {
          const isLast = idx === crumbs.length - 1;
          const isFirst = idx === 0;

          return (
            <li key={idx} className="flex items-center gap-1.5">
              {idx > 0 && (
                <ChevronRight size={13} className="text-text-muted/60 shrink-0" aria-hidden="true" />
              )}
              {isLast ? (
                <span
                  className="font-bold text-text truncate max-w-[200px] sm:max-w-xs"
                  aria-current="page"
                >
                  {crumb.label}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => crumb.path && navigate(crumb.path, crumb.params)}
                  className="hover:text-primary transition-colors font-medium flex items-center gap-1 hover:underline"
                >
                  {isFirst && <Home size={13} className="shrink-0" />}
                  <span>{crumb.label}</span>
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
