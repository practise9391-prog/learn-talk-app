import React, { createContext, useContext, useState } from 'react';

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
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<RouteState>({ path: '/home' });
  const [history, setHistory] = useState<RouteState[]>([{ path: '/home' }]);

  const navigate = (path: string, params?: Record<string, string>) => {
    const nextRoute = { path, params };
    setHistory((prev) => [...prev, nextRoute]);
    setCurrentRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (history.length > 1) {
      const nextHistory = [...history];
      nextHistory.pop(); // remove current
      const prevRoute = nextHistory[nextHistory.length - 1];
      setHistory(nextHistory);
      setCurrentRoute(prevRoute);
    } else {
      setCurrentRoute({ path: '/home' });
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
