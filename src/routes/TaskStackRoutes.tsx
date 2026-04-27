import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../hooks/useTheme';
import { TaskDetailScreen } from '../screens/tasks/TaskDetailScreen';
import { TaskFormScreen } from '../screens/tasks/TaskFormScreen';
import { TaskListScreen } from '../screens/tasks/TaskListScreen';
import { TaskStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<TaskStackParamList>();

export function TaskStackRoutes() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.card,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          color: theme.text,
        },
        contentStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
      <Stack.Screen name="TaskList" component={TaskListScreen} options={{ title: 'Tarefas' }} />
      <Stack.Screen name="TaskForm" component={TaskFormScreen} options={{ title: 'Cadastro/Edição' }} />
      <Stack.Screen name="TaskDetail" component={TaskDetailScreen} options={{ title: 'Detalhe da Tarefa' }} />
    </Stack.Navigator>
  );
}