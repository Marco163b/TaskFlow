import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Header } from '../../components/Header';
import { getTreatmentStorage, saveTreatmentStorage, TreatmentPreference } from '../../services/settingsStorage';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

export function SettingsScreen() {
  const { user } = useAuth();
  const { theme, mode, toggleTheme } = useTheme();
  const [treatment, setTreatment] = useState<TreatmentPreference>('Sr.');

  async function changeTreatment(value: TreatmentPreference): Promise<void> {
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
          <Text style={[styles.cardTitle, { color: theme.text }]}>Perfil</Text>
          <Text style={[styles.text, { color: theme.subtitle }]}>Nome: {treatment} {user?.name}</Text>
          <Text style={[styles.text, { color: theme.subtitle }]}>Usuário: {user?.username}</Text>
          <Text style={[styles.text, { color: theme.subtitle }]}>Tipo: {user?.role}</Text>
          <Text style={[styles.text, { color: theme.subtitle }]}>
            Tema atual: {mode === 'light' ? 'Claro' : 'Escuro'}
          </Text>
        </View>

        <Text style={[styles.subtitle, { color: theme.text }]}>Tratamento</Text>

        <View style={styles.options}>
          {(['Sr.', 'Sra.', 'Srta.'] as TreatmentPreference[]).map(item => (
            <TouchableOpacity
              key={item}
              style={[
                styles.option,
                { backgroundColor: treatment === item ? theme.primary : theme.card, borderColor: theme.border },
              ]}
              onPress={() => changeTreatment(item)}
            >
              <Text style={[styles.optionText, { color: treatment === item ? '#ffffff' : theme.text }]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.themeButton, { backgroundColor: theme.primary }]}
          onPress={toggleTheme}
        >
          <Text style={styles.themeButtonText}>
            Alterar para tema {mode === 'light' ? 'escuro' : 'claro'}
          </Text>
        </TouchableOpacity>
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
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 18,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 10,
  },
  card: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 12,
  },
  text: {
    fontSize: 15,
    marginBottom: 8,
    fontWeight: '600',
  },
  options: {
    flexDirection: 'row',
    marginBottom: 22,
  },
  option: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 999,
    borderWidth: 1,
    marginRight: 8,
  },
  optionText: {
    fontWeight: '900',
  },
  themeButton: {
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeButtonText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 15,
  },
});