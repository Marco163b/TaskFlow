import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Task } from '../types/task';
import { formatDate } from '../utils/formatDate';
import { StatusBadge } from './StatusBadge';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onDelete?: () => void;
  canDelete?: boolean;
}

export function TaskCard({ task, onPress, onDelete, canDelete = false }: TaskCardProps) {
  const { theme } = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <Pressable onPress={onPress}>
        <View style={styles.header}>
          <View style={[styles.iconBox, { backgroundColor: theme.surfaceMuted }]}>
            <Text style={styles.icon}>{task.categoryIcon}</Text>
          </View>

          <View style={styles.info}>
            <Text style={[styles.title, { color: theme.text }]}>{task.title}</Text>
            <Text style={[styles.category, { color: theme.subtitle }]}>{task.category}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <StatusBadge status={task.status} />
          <Text style={[styles.priority, { color: theme.subtitle }]}>
            Prioridade: {task.priority}
          </Text>
        </View>

        <Text style={[styles.date, { color: theme.subtitle }]}>
          Criada por: {task.createdByName ?? 'Não identificado'}
        </Text>

        <Text style={[styles.date, { color: theme.subtitle }]}>
          Criada em: {formatDate(task.createdAt)}
        </Text>
      </Pressable>

      {canDelete ? (
        <TouchableOpacity style={[styles.deleteButton, { backgroundColor: theme.danger }]} onPress={onDelete}>
          <Text style={styles.deleteText}>Excluir tarefa</Text>
        </TouchableOpacity>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 25,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '900',
  },
  category: {
    fontSize: 13,
    marginTop: 3,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  priority: {
    fontSize: 13,
    marginLeft: 10,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    marginTop: 4,
  },
  deleteButton: {
    marginTop: 14,
    padding: 13,
    borderRadius: 14,
    alignItems: 'center',
  },
  deleteText: {
    color: '#ffffff',
    fontWeight: '900',
  },
});