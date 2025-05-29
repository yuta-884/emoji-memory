import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import type { ThemeMode } from '../contexts/ThemeContext';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Initialize theme from localStorage or default to 'system'
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    return savedTheme || 'system';
  });
  
  // Track whether dark mode is active
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Function to set theme and save to localStorage
  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };
  
  // Effect to apply theme to document and track system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Function to update dark mode based on theme setting
    const updateDarkMode = () => {
      const prefersDark = mediaQuery.matches;
      const shouldBeDark = theme === 'dark' || (theme === 'system' && prefersDark);
      
      setIsDarkMode(shouldBeDark);
      
      // Apply dark class to document
      if (shouldBeDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    
    // Initial update
    updateDarkMode();
    
    // Listen for system preference changes
    const listener = () => updateDarkMode();
    mediaQuery.addEventListener('change', listener);
    
    return () => {
      mediaQuery.removeEventListener('change', listener);
    };
  }, [theme]);
  
  const value = {
    theme,
    isDarkMode,
    setTheme
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
