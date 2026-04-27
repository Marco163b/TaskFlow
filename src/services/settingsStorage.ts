import AsyncStorage from '@react-native-async-storage/async-storage';

export type TreatmentPreference = 'Sr.' | 'Sra.' | 'Srta.';

const TREATMENT_STORAGE_KEY = '@taskflow:treatment';

export async function saveTreatmentStorage(treatment: TreatmentPreference): Promise<void> {
  await AsyncStorage.setItem(TREATMENT_STORAGE_KEY, treatment);
}

export async function getTreatmentStorage(): Promise<TreatmentPreference | null> {
  const treatment = await AsyncStorage.getItem(TREATMENT_STORAGE_KEY);

  if (treatment === 'Sr.' || treatment === 'Sra.' || treatment === 'Srta.') {
    return treatment;
  }

  return null;
}