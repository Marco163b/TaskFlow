import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../hooks/useTheme';
import { HomeStackRoutes } from './HomeStackRoutes';
import { SettingsStackRoutes } from './SettingsStackRoutes';
import { TaskStackRoutes } from './TaskStackRoutes';

const Tab = createBottomTabNavigator();

export function TabRoutes() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.subtitle,
      }}
    >
      <Tab.Screen name="Home" component={HomeStackRoutes} />
      <Tab.Screen name="Tarefas" component={TaskStackRoutes} />
      <Tab.Screen name="Configurações" component={SettingsStackRoutes} />
    </Tab.Navigator>
  );
}