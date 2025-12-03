'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { verificarSesionBackend, User } from '../../redux/services/services/registro';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/app/redux/hooks';
import { setUser as setReduxUser, logout as logoutRedux } from '@/app/redux/slice/userSlice';

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('servineo_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Error leyendo usuario:', e);
      localStorage.removeItem('servineo_user');
    }

    const token = localStorage.getItem('servineo_token');
    if (!token) {
      setLoading(false);
      return;
    }

    verificarSesionBackend(token)
      .then((data) => {
        if (data.valid && data.user) {
          setUser((prev) => {
            const newUser = { ...prev, ...data.user };
            localStorage.setItem('servineo_user', JSON.stringify(newUser));
            return newUser;
          });
        } else {
          localStorage.removeItem('servineo_token');
          localStorage.removeItem('servineo_user');
          setUser(null);
        }
      })
      .catch(() => {
        localStorage.removeItem('servineo_token');
        localStorage.removeItem('servineo_user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user) {
      // Ensure _id exists
      const userWithId = { ...user, _id: user.id };
      localStorage.setItem('servineo_user', JSON.stringify(userWithId));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dispatch(setReduxUser(userWithId as any)); // Sync with Redux
    }
  }, [user, dispatch]);

  const logout = () => {
    localStorage.removeItem('servineo_token');
    localStorage.removeItem('servineo_user');
    setUser(null);
    dispatch(logoutRedux());
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
