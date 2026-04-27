import { createContext, ReactNode, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getTasksStorage, saveTasksStorage } from '../services/taskStorage';
import { Task, TaskFormData, TaskStatus } from '../types/task';
import { generateId } from '../utils/generateId';

interface TaskContextData {
  tasks: Task[];
  loading: boolean;
  addTask: (data: TaskFormData) => Promise<void>;
  updateTask: (id: string, data: TaskFormData) => Promise<void>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  getTaskById: (id: string) => Task | undefined;
}

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskContext = createContext({} as TaskContextData);

export function TaskProvider({ children }: TaskProviderProps) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  async function loadTasks(): Promise<void> {
    const storedTasks = await getTasksStorage();
    setTasks(storedTasks);
    setLoading(false);
  }

  async function persistTasks(updatedTasks: Task[]): Promise<void> {
    setTasks(updatedTasks);
    await saveTasksStorage(updatedTasks);
  }

  async function addTask(data: TaskFormData): Promise<void> {
    const now = new Date().toISOString();

    const newTask: Task = {
      id: generateId(),
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      category: data.category,
      categoryIcon: data.categoryIcon,
      createdAt: now,
      updatedAt: now,
      createdByUserId: user?.id,
      createdByName: user?.name,
      createdByRole: user?.role,
    };

    await persistTasks([newTask, ...tasks]);
  }

  async function updateTask(id: string, data: TaskFormData): Promise<void> {
    const updatedTasks = tasks.map(task => {
      if (task.id !== id) {
        return task;
      }

      if (user?.role === 'user') {
        return {
          ...task,
          status: data.status,
          updatedAt: new Date().toISOString(),
        };
      }

      return {
        ...task,
        ...data,
        updatedAt: new Date().toISOString(),
      };
    });

    await persistTasks(updatedTasks);
  }

  async function updateTaskStatus(id: string, status: TaskStatus): Promise<void> {
    const updatedTasks = tasks.map(task =>
      task.id === id
        ? {
            ...task,
            status,
            updatedAt: new Date().toISOString(),
          }
        : task
    );

    await persistTasks(updatedTasks);
  }

  async function removeTask(id: string): Promise<void> {
    const updatedTasks = tasks.filter(task => task.id !== id);
    await persistTasks(updatedTasks);
  }

  function getTaskById(id: string): Task | undefined {
    return tasks.find(task => task.id === id);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        addTask,
        updateTask,
        updateTaskStatus,
        removeTask,
        getTaskById,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}