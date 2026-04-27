import { createContext, ReactNode, useEffect, useState } from 'react';
import { getThemeStorage, saveThemeStorage } from '../services/themeStorage';
import { AppTheme, ThemeMode } from '../types/theme';

interface ThemeContextData {
  theme: AppTheme;
  mode: ThemeMode;
  toggleTheme: () => Promise<void>;
}

interface ThemeProviderProps {
  children: ReactNode;
}

const lightTheme: AppTheme = {
  mode: 'light',
  background: '#f4f7fb',
  surface: '#ffffff',
  surfaceMuted: '#eef2ff',
  card: '#ffffff',
  text: '#0f172a',
  subtitle: '#64748b',
  border: '#dbe3ef',
  primary: '#4f46e5',
  primaryDark: '#3730a3',
  danger: '#dc2626',
  success: '#16a34a',
  warning: '#f59e0b',
};

const darkTheme: AppTheme = {
  mode: 'dark',
  background: '#020617',
  surface: '#0f172a',
  surfaceMuted: '#1e293b',
  card: '#111827',
  text: '#f8fafc',
  subtitle: '#cbd5e1',
  border: '#334155',
  primary: '#818cf8',
  primaryDark: '#6366f1',
  danger: '#ef4444',
  success: '#22c55e',
  warning: '#fbbf24',
};

export const ThemeContext = createContext({} as ThemeContextData);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>('light');

  const theme = mode === 'light' ? lightTheme : darkTheme;

  async function toggleTheme(): Promise<void> {
    const nextMode: ThemeMode = mode === 'light' ? 'dark' : 'light';

    setMode(nextMode);
    await saveThemeStorage(nextMode);
  }

  async function loadTheme(): Promise<void> {
    const storedTheme = await getThemeStorage();

    if (storedTheme) {
      setMode(storedTheme);
    }
  }

  useEffect(() => {
    loadTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}