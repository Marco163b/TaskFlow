import { createContext, ReactNode, useEffect, useState } from 'react';
import { LoggedUser, User } from '../types/user';
import { getUserStorage, removeUserStorage, saveUserStorage } from '../services/authStorage';

interface AuthContextData {
  user: LoggedUser | null;
  loading: boolean;
  error: string;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const users: User[] = [
  {
    id: 1,
    username: 'admin',
    password: '123',
    role: 'admin',
    name: 'Administrador',
  },
  {
    id: 2,
    username: 'user',
    password: '123',
    role: 'user',
    name: 'Usuário Comum',
  },
];

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<LoggedUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  async function login(username: string, password: string): Promise<void> {
    setError('');

    const foundUser = users.find(
      item => item.username === username && item.password === password
    );

    if (!foundUser) {
      setError('Usuário ou senha inválidos');
      return;
    }

    const loggedUser: LoggedUser = {
      id: foundUser.id,
      username: foundUser.username,
      role: foundUser.role,
      name: foundUser.name,
    };

    await saveUserStorage(loggedUser);
    setUser(loggedUser);
  }

  async function logout(): Promise<void> {
    await removeUserStorage();
    setUser(null);
  }

  async function loadUser(): Promise<void> {
    const storedUser = await getUserStorage();

    if (storedUser) {
      setUser(storedUser);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}