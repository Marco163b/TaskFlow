import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { TaskStatus } from '../types/task';

export type TaskFilter = TaskStatus | 'todas';

interface FilterBarProps {
  selected: TaskFilter;
  onChange: (filter: TaskFilter) => void;
}

const filters: TaskFilter[] = ['todas', 'pendente', 'em_andamento', 'concluida'];

const labels: Record<TaskFilter, string> = {
  todas: 'Todas',
  pendente: 'Pendentes',
  em_andamento: 'Andamento',
  concluida: 'Concluídas',
};

export function FilterBar({ selected, onChange }: FilterBarProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {filters.map(filter => (
        <TouchableOpacity
          key={filter}
          style={[
            styles.button,
            {
              backgroundColor: selected === filter ? theme.primary : theme.card,
              borderColor: theme.border,
            },
          ]}
          onPress={() => onChange(filter)}
        >
          <Text
            style={[
              styles.text,
              {
                color: selected === filter ? '#ffffff' : theme.text,
              },
            ]}
          >
            {labels[filter]}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});