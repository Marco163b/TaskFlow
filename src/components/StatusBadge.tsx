import { StyleSheet, Text, View } from 'react-native';
import { TaskStatus } from '../types/task';

interface StatusBadgeProps {
  status: TaskStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const label: Record<TaskStatus, string> = {
    pendente: 'Pendente',
    em_andamento: 'Em andamento',
    concluida: 'Concluída',
  };

  return (
    <View style={[styles.badge, styles[status]]}>
      <Text style={styles.text}>{label[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pendente: {
    backgroundColor: '#f97316',
  },
  em_andamento: {
    backgroundColor: '#2563eb',
  },
  concluida: {
    backgroundColor: '#16a34a',
  },
  text: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});