import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { HomeStackRoutes } from './HomeStackRoutes';
import { SettingsStackRoutes } from './SettingsStackRoutes';
import { TaskStackRoutes } from './TaskStackRoutes';

export type TabParamList = {
  Home: undefined;
  Tarefas: undefined;
  Configurações: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export function TabRoutes() {
  const { theme } = useTheme();
  const { user } = useAuth();

  const initialRouteName: keyof TabParamList =
    user?.role === 'admin' ? 'Configurações' : 'Home';

  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
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