import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { CustomButton } from '../../components/CustomButton';
import { Header } from '../../components/Header';
import { StatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { useTheme } from '../../hooks/useTheme';
import { TaskStackParamList } from '../../types/navigation';
import { formatDate } from '../../utils/formatDate';

type NavigationProps = NativeStackNavigationProp<TaskStackParamList, 'TaskDetail'>;
type RouteProps = RouteProp<TaskStackParamList, 'TaskDetail'>;

export function TaskDetailScreen() {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<RouteProps>();
  const { getTaskById, removeTask } = useTasks();
  const { user } = useAuth();
  const { theme } = useTheme();

  const { taskId } = route.params;
  const task = getTaskById(taskId);
  const isAdmin = user?.role === 'admin';

  async function confirmDelete(): Promise<void> {
    if (!user) {
      Alert.alert('Erro', 'Usuário não encontrado.');
      return;
    }

    const deleted = await removeTask(taskId, user);

    if (!deleted) {
      Alert.alert('Ação não permitida', 'Apenas administradores podem excluir tarefas.');
      return;
    }

    Alert.alert('Sucesso', 'Tarefa excluída com sucesso.');
    navigation.navigate('TaskList');
  }

  function handleDelete(): void {
    Alert.alert('Excluir tarefa', 'Tem certeza que deseja excluir esta tarefa?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: confirmDelete },
    ]);
  }

  if (!task) {
    return (
      <View style={[styles.page, { backgroundColor: theme.background }]}>
        <Header />
        <View style={styles.container}>
          <Text style={[styles.title, { color: theme.text }]}>Tarefa não encontrada</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.page, { backgroundColor: theme.background }]}>
      <Header />

      <View style={styles.container}>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={styles.icon}>{task.categoryIcon}</Text>
          <Text style={[styles.title, { color: theme.text }]}>{task.title}</Text>
          <StatusBadge status={task.status} />

          <Text style={[styles.sectionTitle, { color: theme.text }]}>Descrição</Text>
          <Text style={[styles.text, { color: theme.subtitle }]}>
            {task.description || 'Sem descrição'}
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>Categoria</Text>
          <Text style={[styles.text, { color: theme.subtitle }]}>{task.category}</Text>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>Prioridade</Text>
          <Text style={[styles.text, { color: theme.subtitle }]}>{task.priority}</Text>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>Criada por</Text>
          <Text style={[styles.text, { color: theme.subtitle }]}>
            {task.createdByName} ({task.createdByRole})
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>Criada em</Text>
          <Text style={[styles.text, { color: theme.subtitle }]}>{formatDate(task.createdAt)}</Text>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>Atualizada em</Text>
          <Text style={[styles.text, { color: theme.subtitle }]}>{formatDate(task.updatedAt)}</Text>
        </View>

        <CustomButton
          title={isAdmin ? 'Editar tarefa' : 'Editar status'}
          onPress={() => navigation.navigate('TaskForm', { taskId })}
        />

        <View style={styles.space} />

        {isAdmin ? (
          <CustomButton title="Excluir tarefa" variant="danger" onPress={handleDelete} />
        ) : (
          <View style={[styles.permissionBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.permissionText, { color: theme.subtitle }]}>
              Apenas administradores podem excluir tarefas.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
  },
  icon: {
    fontSize: 36,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 4,
  },
  text: {
    fontSize: 15,
  },
  space: {
    height: 10,
  },
  permissionBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },
  permissionText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
});