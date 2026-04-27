import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { ConfirmModal } from '../../components/ConfirmModal';
import { CustomButton } from '../../components/CustomButton';
import { EmptyState } from '../../components/EmptyState';
import { FilterBar, TaskFilter } from '../../components/FilterBar';
import { Header } from '../../components/Header';
import { TaskCard } from '../../components/TaskCard';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { useTheme } from '../../hooks/useTheme';
import { TaskStackParamList } from '../../types/navigation';
import { Task } from '../../types/task';

type NavigationProps = NativeStackNavigationProp<TaskStackParamList, 'TaskList'>;

export function TaskListScreen() {
  const { user } = useAuth();
  const { tasks, removeTask } = useTasks();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProps>();

  const [filter, setFilter] = useState<TaskFilter>('todas');
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const isAdmin = user?.role === 'admin';

  const filteredTasks = useMemo(() => {
    if (filter === 'todas') {
      return tasks;
    }

    return tasks.filter(task => task.status === filter);
  }, [filter, tasks]);

  const totalDone = tasks.filter(task => task.status === 'concluida').length;

  function openDeleteModal(taskId: string): void {
    if (!isAdmin) {
      return;
    }

    setTaskToDelete(taskId);
  }

  async function confirmDelete(): Promise<void> {
    if (!taskToDelete) {
      return;
    }

    await removeTask(taskToDelete);
    setTaskToDelete(null);
  }

  function renderItem({ item }: { item: Task }) {
    return (
      <TaskCard
        task={item}
        canDelete={isAdmin}
        onDelete={() => openDeleteModal(item.id)}
        onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
      />
    );
  }

  return (
    <View style={[styles.page, { backgroundColor: theme.background }]}>
      <Header />

      <View style={styles.container}>
        <View style={[styles.summary, { backgroundColor: theme.primary }]}>
          <Text style={styles.summaryTitle}>Resumo das tarefas</Text>
          <Text style={styles.summaryText}>{tasks.length} tarefas cadastradas</Text>
          <Text style={styles.summaryText}>{totalDone} concluídas</Text>
        </View>

        <FilterBar selected={filter} onChange={setFilter} />

        <FlatList
          data={filteredTasks}
          extraData={tasks}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              title="Nenhuma tarefa encontrada"
              description="Crie sua primeira tarefa para começar a organizar sua rotina."
            />
          }
          contentContainerStyle={filteredTasks.length === 0 ? styles.emptyList : styles.list}
        />

        <View style={[styles.footer, { backgroundColor: theme.background }]}>
          <CustomButton
            title="Nova tarefa"
            onPress={() => navigation.navigate('TaskForm', {})}
          />
        </View>
      </View>

      <ConfirmModal
        visible={taskToDelete !== null}
        title="Excluir tarefa"
        message="Tem certeza que deseja excluir esta tarefa? Essa ação não pode ser desfeita."
        onCancel={() => setTaskToDelete(null)}
        onConfirm={confirmDelete}
      />
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
  summary: {
    padding: 20,
    borderRadius: 24,
    marginBottom: 16,
  },
  summaryTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 8,
  },
  summaryText: {
    color: '#eef2ff',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  list: {
    paddingBottom: 110,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 110,
  },
  footer: {
    paddingTop: 12,
    paddingBottom: 6,
  },
});