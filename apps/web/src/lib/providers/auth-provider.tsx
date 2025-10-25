'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { User, LoginCredentials, RegisterCredentials } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  useEffect(() => {
    const initAuth = async () => {
      const token = Cookies.get('accessToken');
      if (token) {
        try {
          // Validate token and get user info
          const response = await fetch('/api/auth/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData.data);
          } else {
            // Token is invalid, try to refresh
            await refreshToken();
          }
        } catch (error) {
          console.error('Auth initialization failed:', error);
          Cookies.remove('accessToken');
          Cookies.remove('refreshToken');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      
      // Store tokens
      Cookies.set('accessToken', data.accessToken, { expires: 1 }); // 1 day
      Cookies.set('refreshToken', data.refreshToken, { expires: 7 }); // 7 days
      
      setUser(data.user);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      const data = await response.json();
      
      // Auto-login after registration
      await login({
        email: credentials.email,
        password: credentials.password,
      });
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    setUser(null);
    router.push('/');
  };

  const refreshToken = async () => {
    try {
      const refreshToken = Cookies.get('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      Cookies.set('accessToken', data.accessToken, { expires: 1 });
      Cookies.set('refreshToken', data.refreshToken, { expires: 7 });
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        refreshToken,
      }}
    >
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
