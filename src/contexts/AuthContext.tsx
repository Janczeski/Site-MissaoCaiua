import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { checkSession, getToken, login as apiLogin, setToken } from '@/lib/api';

interface AuthContextType {
  isAuthenticated: boolean;
  isChecking: boolean;
  login: (password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A senha fica só no servidor (variável ADMIN_PASSWORD); aqui guardamos apenas o token da sessão
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(Boolean(getToken()));

  useEffect(() => {
    if (getToken()) {
      checkSession()
        .then(({ valid }) => {
          if (!valid) setToken(null);
          setIsAuthenticated(valid);
        })
        .catch(() => setIsAuthenticated(false))
        .finally(() => setIsChecking(false));
    }

    const onExpired = () => setIsAuthenticated(false);
    window.addEventListener('admin-session-expired', onExpired);
    return () => window.removeEventListener('admin-session-expired', onExpired);
  }, []);

  const login = async (password: string) => {
    const { token } = await apiLogin(password);
    setToken(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isChecking, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
