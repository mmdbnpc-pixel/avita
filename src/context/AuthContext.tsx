import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { User } from '@/types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (phone: string, data?: Partial<User>) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = 'avita_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setUser(JSON.parse(saved));
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: user !== null,
    login: (phone, data = {}) => {
      const newUser: User = {
        id: data.id ?? `u-${phone}`,
        firstName: data.firstName ?? 'کاربر',
        lastName: data.lastName ?? 'اویتا',
        phone,
        city: data.city ?? '',
        address: data.address ?? '',
        postalCode: data.postalCode ?? '',
        email: data.email,
        createdAt: data.createdAt ?? new Date().toISOString(),
      };
      setUser(newUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    },
    logout: () => {
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
    },
    updateUser: (data) => {
      setUser((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, ...data };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    },
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
