import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmModal({
  visible,
  title,
  message,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  const { theme } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.box, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.icon]}>⚠️</Text>
          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
          <Text style={[styles.message, { color: theme.subtitle }]}>{message}</Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.surfaceMuted }]}
              onPress={onCancel}
            >
              <Text style={[styles.cancelText, { color: theme.text }]}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.danger }]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  box: {
    width: '100%',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
  },
  icon: {
    fontSize: 34,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 22,
  },
  actions: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  cancelText: {
    fontWeight: '800',
  },
  confirmText: {
    color: '#ffffff',
    fontWeight: '800',
  },
});