import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeMode, ThemePalette } from '../types';

interface ThemeContextType {
  mode: ThemeMode;
  palette: ThemePalette;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  setPalette: (palette: ThemePalette) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('learntalk_theme_mode') as ThemeMode) || 'system';
  });

  const [palette, setPaletteState] = useState<ThemePalette>(() => {
    return (localStorage.getItem('learntalk_theme_palette') as ThemePalette) || 'purple';
  });

  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const root = document.documentElement;

    const checkSystemDark = () => {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    };

    let effectiveDark = false;
    if (mode === 'dark') {
      effectiveDark = true;
    } else if (mode === 'light') {
      effectiveDark = false;
    } else {
      effectiveDark = checkSystemDark();
    }

    setIsDark(effectiveDark);

    if (effectiveDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    root.setAttribute('data-theme', palette);
  }, [mode, palette]);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem('learntalk_theme_mode', newMode);
  };

  const setPalette = (newPalette: ThemePalette) => {
    setPaletteState(newPalette);
    localStorage.setItem('learntalk_theme_palette', newPalette);
  };

  return (
    <ThemeContext.Provider value={{ mode, palette, isDark, setMode, setPalette }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
