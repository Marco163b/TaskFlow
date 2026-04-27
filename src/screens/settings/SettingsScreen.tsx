import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Header } from '../../components/Header';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import {
  getTreatmentStorage,
  saveTreatmentStorage,
  TreatmentPreference,
} from '../../services/settingsStorage';

const treatments: TreatmentPreference[] = ['Sr.', 'Sra.', 'Srta.'];

export function SettingsScreen() {
  const { user } = useAuth();
  const { theme, mode, toggleTheme } = useTheme();
  const [treatment, setTreatment] = useState<TreatmentPreference>('Sr.');

  async function handleTreatmentChange(value: TreatmentPreference): Promise<void> {
    setTreatment(value);
    await saveTreatmentStorage(value);
  }

  async function loadTreatment(): Promise<void> {
    const storedTreatment = await getTreatmentStorage();

    if (storedTreatment) {
      setTreatment(storedTreatment);
    }
  }

  useEffect(() => {
    loadTreatment();
  }, []);

  return (
    <View style={[styles.page, { backgroundColor: theme.background }]}>
      <Header />

      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.text }]}>Configurações</Text>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.text, { color: theme.subtitle }]}>
            Nome: {treatment} {user?.name}
          </Text>
          <Text style={[styles.text, { color: theme.subtitle }]}>Usuário: {user?.username}</Text>
          <Text style={[styles.text, { color: theme.subtitle }]}>Perfil: {user?.role}</Text>
          <Text style={[styles.text, { color: theme.subtitle }]}>
            Tema atual: {mode === 'light' ? 'Claro' : 'Escuro'}
          </Text>
        </View>

        <Text style={[styles.subtitle, { color: theme.text }]}>Preferência de tratamento</Text>

        <View style={styles.options}>
          {treatments.map(item => (
            <TouchableOpacity
              key={item}
              style={[
                styles.option,
                {
                  backgroundColor: treatment === item ? theme.primary : theme.card,
                  borderColor: theme.border,
                },
              ]}
              onPress={() => handleTreatmentChange(item)}
            >
              <Text style={[styles.optionText, { color: treatment === item ? '#ffffff' : theme.text }]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={toggleTheme}
        >
          <Text style={styles.buttonText}>
            Alterar para tema {mode === 'light' ? 'escuro' : 'claro'}
          </Text>
        </TouchableOpacity>

        <View style={[styles.infoBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.infoText, { color: theme.subtitle }]}>
            Admin pode editar e excluir qualquer tarefa. Usuário comum pode criar tarefas e editar apenas o status.
          </Text>
        </View>
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
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  options: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  optionText: {
    fontWeight: 'bold',
  },
  button: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginTop: 20,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});