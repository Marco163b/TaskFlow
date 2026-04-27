export type ThemeMode = 'light' | 'dark';

export interface AppTheme {
  mode: ThemeMode;
  background: string;
  surface: string;
  surfaceMuted: string;
  card: string;
  text: string;
  subtitle: string;
  border: string;
  primary: string;
  primaryDark: string;
  danger: string;
  success: string;
  warning: string;
}