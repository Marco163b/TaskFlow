import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ConfirmModal } from '../../components/ConfirmModal';
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
  const { user } = useAuth();
  const { getTaskById, removeTask } = useTasks();
  const { theme } = useTheme();

  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);

  const { taskId } = route.params;
  const task = getTaskById(taskId);
  const isAdmin = user?.role === 'admin';

  async function confirmDelete(): Promise<void> {
    await removeTask(taskId);
    setDeleteVisible(false);
    navigation.goBack();
  }

  if (!task) {
    return (
      <View style={[styles.page, { backgroundColor: theme.background }]}>
        <Header />

        <View style={styles.container}>
          <Text style={[styles.title, { color: theme.text }]}>Tarefa não encontrada</Text>
          <CustomButton title="Voltar" onPress={() => navigation.goBack()} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.page, { backgroundColor: theme.background }]}>
      <Header />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={[styles.iconBox, { backgroundColor: theme.surfaceMuted }]}>
            <Text style={styles.icon}>{task.categoryIcon}</Text>
          </View>

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
            {task.createdByName ?? 'Usuário não identificado'} {task.createdByRole ? `(${task.createdByRole})` : ''}
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

        {isAdmin ? (
          <>
            <View style={styles.space} />
            <CustomButton
              title="Excluir tarefa"
              variant="danger"
              onPress={() => setDeleteVisible(true)}
            />
          </>
        ) : null}
      </ScrollView>

      <ConfirmModal
        visible={deleteVisible}
        title="Excluir tarefa"
        message="Tem certeza que deseja excluir esta tarefa? Essa ação não pode ser desfeita."
        onCancel={() => setDeleteVisible(false)}
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
  scrollContent: {
    padding: 16,
    paddingBottom: 140,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
  },
  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    fontSize: 25,
    fontWeight: '900',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    marginTop: 18,
    marginBottom: 5,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
  },
  space: {
    height: 10,
  },
});