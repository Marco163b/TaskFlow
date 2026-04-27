import { createContext, ReactNode, useEffect, useState } from 'react';
import { getTasksStorage, saveTasksStorage } from '../services/taskStorage';
import { Task, TaskFormData, TaskStatus } from '../types/task';
import { LoggedUser } from '../types/user';
import { generateId } from '../utils/generateId';

interface TaskContextData {
  tasks: Task[];
  loading: boolean;
  addTask: (data: TaskFormData, user: LoggedUser) => Promise<void>;
  updateTask: (id: string, data: TaskFormData, user: LoggedUser) => Promise<void>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  removeTask: (id: string, user: LoggedUser) => Promise<boolean>;
  getTaskById: (id: string) => Task | undefined;
  filterTasksByStatus: (status: TaskStatus | 'todas') => Task[];
}

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskContext = createContext({} as TaskContextData);

export function TaskProvider({ children }: TaskProviderProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  async function loadTasks(): Promise<void> {
    const storedTasks = await getTasksStorage();
    setTasks(storedTasks);
    setLoading(false);
  }

  async function addTask(data: TaskFormData, user: LoggedUser): Promise<void> {
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
      createdByUserId: user.id,
      createdByName: user.name,
      createdByRole: user.role,
    };

    const updatedTasks = [newTask, ...tasks];

    setTasks(updatedTasks);
    await saveTasksStorage(updatedTasks);
  }

  async function updateTask(id: string, data: TaskFormData, user: LoggedUser): Promise<void> {
    const updatedTasks = tasks.map(task => {
      if (task.id !== id) {
        return task;
      }

      if (user.role !== 'admin') {
        return {
          ...task,
          status: data.status,
          updatedAt: new Date().toISOString(),
        };
      }

      return {
        ...task,
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        category: data.category,
        categoryIcon: data.categoryIcon,
        updatedAt: new Date().toISOString(),
      };
    });

    setTasks(updatedTasks);
    await saveTasksStorage(updatedTasks);
  }

  async function updateTaskStatus(id: string, status: TaskStatus): Promise<void> {
    const updatedTasks = tasks.map(task => {
      if (task.id !== id) {
        return task;
      }

      return {
        ...task,
        status,
        updatedAt: new Date().toISOString(),
      };
    });

    setTasks(updatedTasks);
    await saveTasksStorage(updatedTasks);
  }

  async function removeTask(id: string, user: LoggedUser): Promise<boolean> {
    if (user.role !== 'admin') {
      return false;
    }

    const updatedTasks = tasks.filter(task => task.id !== id);

    setTasks(updatedTasks);
    await saveTasksStorage(updatedTasks);

    return true;
  }

  function getTaskById(id: string): Task | undefined {
    return tasks.find(task => task.id === id);
  }

  function filterTasksByStatus(status: TaskStatus | 'todas'): Task[] {
    if (status === 'todas') {
      return tasks;
    }

    return tasks.filter(task => task.status === status);
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
        filterTasksByStatus,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}