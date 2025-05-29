import { createContext } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  theme: ThemeMode;
  isDarkMode: boolean;
  setTheme: (theme: ThemeMode) => void;
}

// Create context with undefined default value
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
