import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../hooks/useTheme';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { SettingsStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export function SettingsStackRoutes() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.card,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          color: theme.text,
        },
        contentStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ title: 'Configurações' }} />
    </Stack.Navigator>
  );
}