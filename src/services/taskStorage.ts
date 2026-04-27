import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types/task';

const TASK_STORAGE_KEY = '@taskflow:tasks';

export async function saveTasksStorage(tasks: Task[]): Promise<void> {
  await AsyncStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
}

export async function getTasksStorage(): Promise<Task[]> {
  const data = await AsyncStorage.getItem(TASK_STORAGE_KEY);

  if (!data) {
    return [];
  }

  const tasks = JSON.parse(data) as Task[];

  if (!Array.isArray(tasks)) {
    return [];
  }

  return tasks;
}