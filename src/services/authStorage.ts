import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoggedUser } from '../types/user';

const AUTH_STORAGE_KEY = '@taskflow:user';

export async function saveUserStorage(user: LoggedUser): Promise<void> {
  await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export async function getUserStorage(): Promise<LoggedUser | null> {
  const data = await AsyncStorage.getItem(AUTH_STORAGE_KEY);

  if (!data) {
    return null;
  }

  return JSON.parse(data) as LoggedUser;
}

export async function removeUserStorage(): Promise<void> {
  await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
}