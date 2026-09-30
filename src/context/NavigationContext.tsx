import React, { createContext, useContext, useState, useEffect } from 'react';

export interface RouteState {
  path: string;
  params?: Record<string, string>;
}

interface NavigationContextType {
  currentRoute: RouteState;
  history: RouteState[];
  navigate: (path: string, params?: Record<string, string>) => void;
  goBack: () => void;
  canGoBack: boolean;
  isActivityInProgress: boolean;
  setActivityInProgress: (inProgress: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<RouteState>({ path: '/home' });
  const [history, setHistory] = useState<RouteState[]>([{ path: '/home' }]);
  const [isActivityInProgress, setActivityInProgress] = useState<boolean>(false);

  // Sync with browser popstate (Back/Forward buttons)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (isActivityInProgress) {
        const confirmLeave = window.confirm(
          'You have an active learning session in progress. Are you sure you want to leave?'
        );
        if (!confirmLeave) {
          // Push current route back
          window.history.pushState(currentRoute, '', window.location.pathname);
          return;
        }
        setActivityInProgress(false);
      }

      if (event.state && event.state.path) {
        setCurrentRoute(event.state);
      } else {
        // Fallback: check location pathname
        const path = window.location.pathname || '/home';
        setCurrentRoute({ path });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isActivityInProgress, currentRoute]);

  const navigate = (path: string, params?: Record<string, string>) => {
    if (isActivityInProgress) {
      const confirmLeave = window.confirm(
        'You have an active session in progress. Leave and lose unsaved progress?'
      );
      if (!confirmLeave) return;
      setActivityInProgress(false);
    }

    const nextRoute: RouteState = { path, params };
    setHistory((prev) => [...prev, nextRoute]);
    setCurrentRoute(nextRoute);

    try {
      window.history.pushState(nextRoute, '', path);
    } catch {
      // Safe fallback in restricted sandboxes
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (isActivityInProgress) {
      const confirmLeave = window.confirm(
        'You have an active session in progress. Are you sure you want to return?'
      );
      if (!confirmLeave) return;
      setActivityInProgress(false);
    }

    if (history.length > 1) {
      const nextHistory = [...history];
      nextHistory.pop(); // remove current
      const prevRoute = nextHistory[nextHistory.length - 1];
      setHistory(nextHistory);
      setCurrentRoute(prevRoute);
      try {
        window.history.pushState(prevRoute, '', prevRoute.path);
      } catch {
        // Fallback
      }
    } else {
      const fallback = { path: '/home' };
      setCurrentRoute(fallback);
      try {
        window.history.pushState(fallback, '', '/home');
      } catch {
        // Fallback
      }
    }
  };

  return (
    <NavigationContext.Provider
      value={{
        currentRoute,
        history,
        navigate,
        goBack,
        canGoBack: history.length > 1 && currentRoute.path !== '/home',
        isActivityInProgress,
        setActivityInProgress,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) throw new Error('useNavigation must be used within NavigationProvider');
  return context;
};
