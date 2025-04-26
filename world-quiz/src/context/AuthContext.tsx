import { createContext, useContext, useEffect, useState } from 'react';
import { getMe, login as loginApi, register as registerApi } from '@/api/auth';

export type User = {
  id: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const me = await getMe();
      setUser(me);
      setLoading(false);
    };
    void init();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await loginApi(email, password);
    if ('token' in res && res.token) {
      const me = await getMe();
      if (me) {
        setUser(me);
        return true;
      }
    }
    return false;
  };

  const register = async (email: string, password: string) => {
    const res = await registerApi(email, password);
    return 'message' in res;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
