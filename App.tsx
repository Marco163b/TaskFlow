import { AuthProvider } from './src/context/AuthContext';
import { TaskProvider } from './src/context/TaskContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { AppRoutes } from './src/routes/AppRoutes';

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <TaskProvider>
          <AppRoutes />
        </TaskProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}