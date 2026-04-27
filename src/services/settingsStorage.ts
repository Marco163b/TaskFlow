import AsyncStorage from '@react-native-async-storage/async-storage';

export type TreatmentPreference = 'Sr.' | 'Sra.' | 'Srta.';

const TREATMENT_STORAGE_KEY = '@taskflow:treatment';

export async function saveTreatmentStorage(treatment: TreatmentPreference): Promise<void> {
  await AsyncStorage.setItem(TREATMENT_STORAGE_KEY, treatment);
}

export async function getTreatmentStorage(): Promise<TreatmentPreference | null> {
  const data = await AsyncStorage.getItem(TREATMENT_STORAGE_KEY);

  if (data === 'Sr.' || data === 'Sra.' || data === 'Srta.') {
    return data;
  }

  return null;
}