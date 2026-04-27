import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Header } from '../../components/Header';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { getMotivationalQuote, QuoteResponse } from '../../services/api';

export function HomeScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();

  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  async function loadQuote(): Promise<void> {
    try {
      setLoading(true);
      setError('');

      const data = await getMotivationalQuote();

      setQuote(data);
    } catch {
      setError('Não foi possível carregar a frase motivacional.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuote();
  }, []);

  return (
    <View style={[styles.page, { backgroundColor: theme.background }]}>
      <Header />

      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.text }]}>Olá, {user?.name}</Text>
        <Text style={[styles.text, { color: theme.subtitle }]}>Bem-vindo ao TaskFlow.</Text>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Frase motivacional do dia</Text>

          {loading ? (
            <ActivityIndicator />
          ) : error ? (
            <Text style={[styles.error, { color: theme.danger }]}>{error}</Text>
          ) : (
            <>
              <Text style={[styles.quote, { color: theme.subtitle }]}>
                "{quote?.quote}"
              </Text>
              <Text style={[styles.author, { color: theme.subtitle }]}>
                - {quote?.author}
              </Text>
            </>
          )}
        </View>

        <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.infoTitle, { color: theme.text }]}>Seu perfil</Text>
          <Text style={[styles.infoText, { color: theme.subtitle }]}>Usuário: {user?.username}</Text>
          <Text style={[styles.infoText, { color: theme.subtitle }]}>Tipo: {user?.role}</Text>
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
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 24,
  },
  card: {
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  quote: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
  author: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },
  error: {
    fontSize: 14,
  },
  infoCard: {
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 15,
    marginBottom: 6,
  },
});