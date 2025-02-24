'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export interface User {
  email: string;
  lastLogin?: Date;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    console.log('[AuthContext] User state changed:', user);
    console.log('[AuthContext] Current pathname:', pathname);
    if (user && (pathname === '/login' || pathname === '/register')) {
      console.log('[AuthContext] Redirecting authenticated user to dashboard');
      router.push('/dashboard');
    }
  }, [user, pathname, router]);

  const checkAuth = async () => {
    console.log('[AuthContext] Checking authentication status');
    try {
      const response = await fetch('http://localhost:3001/api/auth/check', {
        credentials: 'include',
      });
      
      console.log('[AuthContext] Auth check response:', {
        status: response.status,
        ok: response.ok,
      });

      if (response.ok) {
        const data = await response.json();
        setUser({
          email: data.email,
          lastLogin: data.lastLogin ? new Date(data.lastLogin) : undefined,
          isAdmin: data.email === 'apagu.hxi@gmail.com'
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('[AuthContext] Auth check error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    console.log('[AuthContext] Attempting login for:', email);
    try {
      setError(null);
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('[AuthContext] Login response:', {
        status: response.status,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        const data = await response.json();
        console.error('[AuthContext] Login failed:', data);
        throw new Error(data.error || 'Login failed');
      }

      const data = await response.json();
      console.log('[AuthContext] Login successful:', data);
      
      setUser({
        email: data.email,
        lastLogin: data.last_login ? new Date(data.last_login) : undefined,
        isAdmin: data.email === 'apagu.hxi@gmail.com'
      });
      
      // Check cookies after login
      console.log('[AuthContext] Cookies after login:', document.cookie);
      
      console.log('[AuthContext] Redirecting to dashboard');
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('[AuthContext] Login error:', error);
      setError(error instanceof Error ? error.message : 'Login failed');
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    console.log('[AuthContext] Attempting registration for:', email);
    try {
      setError(null);
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: { email, password } }),
      });

      console.log('[AuthContext] Registration response:', {
        status: response.status,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        const data = await response.json();
        console.error('[AuthContext] Registration failed:', data);
        throw new Error(data.errors?.[0] || data.error || 'Registration failed');
      }

      const data = await response.json();
      console.log('[AuthContext] Registration successful:', data);
      
      setUser({
        email: data.email,
        lastLogin: data.last_login ? new Date(data.last_login) : undefined,
        isAdmin: data.email === 'apagu.hxi@gmail.com'
      });
      
      console.log('[AuthContext] Redirecting to dashboard');
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('[AuthContext] Registration error:', error);
      setError(error instanceof Error ? error.message : 'Registration failed');
      throw error;
    }
  };

  const logout = async () => {
    console.log('[AuthContext] Attempting logout');
    try {
      const response = await fetch('http://localhost:3001/api/auth/logout', {
        method: 'DELETE',
        credentials: 'include',
      });

      console.log('[AuthContext] Logout response:', {
        status: response.status,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      console.log('[AuthContext] Logout successful');
      setUser(null);
      window.location.href = '/login';
    } catch (error) {
      console.error('[AuthContext] Logout error:', error);
      setError(error instanceof Error ? error.message : 'Logout failed');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, register, login, logout }}>
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
