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

export function TaskFormScreen() {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<RouteProps>();
  const { user } = useAuth();
  const { addTask, updateTask, updateTaskStatus, getTaskById } = useTasks();
  const { theme } = useTheme();

  const taskId = route.params?.taskId;
  const existingTask = taskId ? getTaskById(taskId) : undefined;
  const isEditing = Boolean(taskId);
  const isUserEditing = isEditing && user?.role === 'user';

  const [title, setTitle] = useState<string>(existingTask?.title ?? '');
  const [description, setDescription] = useState<string>(existingTask?.description ?? '');
  const [status, setStatus] = useState<TaskStatus>(existingTask?.status ?? 'pendente');
  const [priority, setPriority] = useState<TaskPriority>(existingTask?.priority ?? 'media');
  const [category, setCategory] = useState<string>(existingTask?.category ?? 'Geral');
  const [categoryIcon, setCategoryIcon] = useState<string>(existingTask?.categoryIcon ?? '📌');

  async function handleSave(): Promise<void> {
    if (isUserEditing && taskId) {
      await updateTaskStatus(taskId, status);
      Alert.alert('Sucesso', 'Status atualizado com sucesso.');
      navigation.goBack();
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
      await updateTask(taskId, data);
      Alert.alert('Sucesso', 'Tarefa atualizada com sucesso.');
    } else {
      await addTask(data);
      Alert.alert('Sucesso', 'Tarefa criada com sucesso.');
    }

    navigation.goBack();
  }

  return (
    <View style={[styles.page, { backgroundColor: theme.background }]}>
      <Header />

      <ScrollView contentContainerStyle={styles.container}>
        {isUserEditing ? (
          <View style={[styles.warning, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.warningText, { color: theme.subtitle }]}>
              Usuário comum pode editar apenas o status da tarefa.
            </Text>
          </View>
        ) : null}

        {!isUserEditing ? (
          <>
            <Text style={[styles.label, { color: theme.text }]}>Título</Text>
            <CustomInput value={title} onChangeText={setTitle} placeholder="Ex: Estudar React Native" />

            <Text style={[styles.label, { color: theme.text }]}>Descrição</Text>
            <CustomInput
              value={description}
              onChangeText={setDescription}
              placeholder="Descreva a tarefa"
              multiline
              style={styles.textArea}
            />
          </>
        ) : (
          <>
            <Text style={[styles.readonlyTitle, { color: theme.text }]}>{existingTask?.title}</Text>
            <Text style={[styles.readonlyText, { color: theme.subtitle }]}>
              {existingTask?.description || 'Sem descrição'}
            </Text>
          </>
        )}

        <Text style={[styles.label, { color: theme.text }]}>Status</Text>
        <View style={styles.options}>
          <TouchableOpacity
            style={[
              styles.option,
              { backgroundColor: theme.card, borderColor: theme.border },
              status === 'pendente' && { backgroundColor: theme.primary },
            ]}
            onPress={() => setStatus('pendente')}
          >
            <Text style={[styles.optionText, { color: status === 'pendente' ? '#ffffff' : theme.text }]}>
              Pendente
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.option,
              { backgroundColor: theme.card, borderColor: theme.border },
              status === 'em_andamento' && { backgroundColor: theme.primary },
            ]}
            onPress={() => setStatus('em_andamento')}
          >
            <Text style={[styles.optionText, { color: status === 'em_andamento' ? '#ffffff' : theme.text }]}>
              Andamento
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.option,
              { backgroundColor: theme.card, borderColor: theme.border },
              status === 'concluida' && { backgroundColor: theme.primary },
            ]}
            onPress={() => setStatus('concluida')}
          >
            <Text style={[styles.optionText, { color: status === 'concluida' ? '#ffffff' : theme.text }]}>
              Concluída
            </Text>
          </TouchableOpacity>
        </View>

        {!isUserEditing ? (
          <>
            <Text style={[styles.label, { color: theme.text }]}>Prioridade</Text>
            <View style={styles.options}>
              <TouchableOpacity
                style={[
                  styles.option,
                  { backgroundColor: theme.card, borderColor: theme.border },
                  priority === 'baixa' && { backgroundColor: theme.primary },
                ]}
                onPress={() => setPriority('baixa')}
              >
                <Text style={[styles.optionText, { color: priority === 'baixa' ? '#ffffff' : theme.text }]}>
                  Baixa
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.option,
                  { backgroundColor: theme.card, borderColor: theme.border },
                  priority === 'media' && { backgroundColor: theme.primary },
                ]}
                onPress={() => setPriority('media')}
              >
                <Text style={[styles.optionText, { color: priority === 'media' ? '#ffffff' : theme.text }]}>
                  Média
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.option,
                  { backgroundColor: theme.card, borderColor: theme.border },
                  priority === 'alta' && { backgroundColor: theme.primary },
                ]}
                onPress={() => setPriority('alta')}
              >
                <Text style={[styles.optionText, { color: priority === 'alta' ? '#ffffff' : theme.text }]}>
                  Alta
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, { color: theme.text }]}>Categoria</Text>
            <CustomInput value={category} onChangeText={setCategory} placeholder="Ex: Estudos" />

            <Text style={[styles.label, { color: theme.text }]}>Ícone</Text>
            <CustomInput value={categoryIcon} onChangeText={setCategoryIcon} placeholder="Ex: 📚" />
          </>
        ) : null}

        <CustomButton title={isUserEditing ? 'Salvar status' : 'Salvar tarefa'} onPress={handleSave} />
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
  warning: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  warningText: {
    fontSize: 14,
    lineHeight: 20,
  },
  readonlyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  readonlyText: {
    fontSize: 15,
    marginBottom: 18,
    lineHeight: 22,
  },
});