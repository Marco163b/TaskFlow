export type AppStackParamList = {
  Login: undefined;
  App: undefined;
};

export type TaskStackParamList = {
  TaskList: undefined;
  TaskForm: { taskId?: string };
  TaskDetail: { taskId: string };
};

export type HomeStackParamList = {
  HomeScreen: undefined;
};

export type SettingsStackParamList = {
  SettingsScreen: undefined;
};