import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode } from '../types/theme';

const THEME_STORAGE_KEY = '@taskflow:theme';

export async function saveThemeStorage(theme: ThemeMode): Promise<void> {
  await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
}

export async function getThemeStorage(): Promise<ThemeMode | null> {
  const theme = await AsyncStorage.getItem(THEME_STORAGE_KEY);

  if (theme === 'light' || theme === 'dark') {
    return theme;
  }

  return null;
}