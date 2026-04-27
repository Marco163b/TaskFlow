import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CustomButton } from '../../components/CustomButton';
import { CustomInput } from '../../components/CustomInput';
import { Header } from '../../components/Header';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { useTheme } from '../../hooks/useTheme';
import { TaskStackParamList } from '../../types/navigation';
import { TaskFormData, TaskPriority, TaskStatus } from '../../types/task';

type NavigationProps = NativeStackNavigationProp<TaskStackParamList, 'TaskForm'>;
type RouteProps = RouteProp<TaskStackParamList, 'TaskForm'>;

const statusOptions: TaskStatus[] = ['pendente', 'em_andamento', 'concluida'];
const priorityOptions: TaskPriority[] = ['baixa', 'media', 'alta'];

export function TaskFormScreen() {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<RouteProps>();
  const { addTask, updateTask, getTaskById } = useTasks();
  const { user } = useAuth();
  const { theme } = useTheme();

  const taskId = route.params?.taskId;
  const existingTask = taskId ? getTaskById(taskId) : undefined;
  const isEditing = Boolean(taskId);
  const isAdmin = user?.role === 'admin';
  const onlyStatusEdition = isEditing && !isAdmin;

  const [title, setTitle] = useState<string>(existingTask?.title ?? '');
  const [description, setDescription] = useState<string>(existingTask?.description ?? '');
  const [status, setStatus] = useState<TaskStatus>(existingTask?.status ?? 'pendente');
  const [priority, setPriority] = useState<TaskPriority>(existingTask?.priority ?? 'media');
  const [category, setCategory] = useState<string>(existingTask?.category ?? 'Geral');
  const [categoryIcon, setCategoryIcon] = useState<string>(existingTask?.categoryIcon ?? '📌');

  async function handleSave(): Promise<void> {
    if (!user) {
      Alert.alert('Erro', 'Usuário não encontrado.');
      return;
    }

    if (!title.trim()) {
      Alert.alert('Erro', 'O título é obrigatório.');
      return;
    }

    const data: TaskFormData = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      category: category.trim() || 'Geral',
      categoryIcon: categoryIcon.trim() || '📌',
    };

    if (taskId) {
      await updateTask(taskId, data, user);
      Alert.alert('Sucesso', onlyStatusEdition ? 'Status atualizado com sucesso.' : 'Tarefa atualizada com sucesso.');
    } else {
      await addTask(data, user);
      Alert.alert('Sucesso', 'Tarefa criada com sucesso.');
    }

    navigation.goBack();
  }

  function renderStatusOption(item: TaskStatus) {
    const labels: Record<TaskStatus, string> = {
      pendente: 'Pendente',
      em_andamento: 'Andamento',
      concluida: 'Concluída',
    };

    return (
      <TouchableOpacity
        key={item}
        style={[
          styles.option,
          {
            backgroundColor: status === item ? theme.primary : theme.card,
            borderColor: theme.border,
          },
        ]}
        onPress={() => setStatus(item)}
      >
        <Text style={[styles.optionText, { color: status === item ? '#ffffff' : theme.text }]}>
          {labels[item]}
        </Text>
      </TouchableOpacity>
    );
  }

  function renderPriorityOption(item: TaskPriority) {
    const labels: Record<TaskPriority, string> = {
      baixa: 'Baixa',
      media: 'Média',
      alta: 'Alta',
    };

    return (
      <TouchableOpacity
        key={item}
        disabled={onlyStatusEdition}
        style={[
          styles.option,
          {
            backgroundColor: priority === item ? theme.primary : theme.card,
            borderColor: theme.border,
            opacity: onlyStatusEdition ? 0.5 : 1,
          },
        ]}
        onPress={() => setPriority(item)}
      >
        <Text style={[styles.optionText, { color: priority === item ? '#ffffff' : theme.text }]}>
          {labels[item]}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.page, { backgroundColor: theme.background }]}>
      <Header />

      <ScrollView contentContainerStyle={styles.container}>
        {onlyStatusEdition ? (
          <View style={[styles.warning, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.warningText, { color: theme.subtitle }]}>
              Usuário comum pode editar apenas o status da tarefa.
            </Text>
          </View>
        ) : null}

        <Text style={[styles.label, { color: theme.text }]}>Título</Text>
        <CustomInput
          value={title}
          onChangeText={setTitle}
          placeholder="Ex: Estudar React Native"
          editable={!onlyStatusEdition}
        />

        <Text style={[styles.label, { color: theme.text }]}>Descrição</Text>
        <CustomInput
          value={description}
          onChangeText={setDescription}
          placeholder="Descreva a tarefa"
          multiline
          editable={!onlyStatusEdition}
          style={styles.textArea}
        />

        <Text style={[styles.label, { color: theme.text }]}>Status</Text>
        <View style={styles.options}>{statusOptions.map(renderStatusOption)}</View>

        <Text style={[styles.label, { color: theme.text }]}>Prioridade</Text>
        <View style={styles.options}>{priorityOptions.map(renderPriorityOption)}</View>

        <Text style={[styles.label, { color: theme.text }]}>Categoria</Text>
        <CustomInput
          value={category}
          onChangeText={setCategory}
          placeholder="Ex: Estudos"
          editable={!onlyStatusEdition}
        />

        <Text style={[styles.label, { color: theme.text }]}>Ícone</Text>
        <CustomInput
          value={categoryIcon}
          onChangeText={setCategoryIcon}
          placeholder="Ex: 📚"
          editable={!onlyStatusEdition}
        />

        <CustomButton title={onlyStatusEdition ? 'Atualizar status' : 'Salvar tarefa'} onPress={handleSave} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  warning: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  warningText: {
    fontSize: 14,
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  option: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  optionText: {
    fontWeight: '600',
    fontSize: 13,
  },
});