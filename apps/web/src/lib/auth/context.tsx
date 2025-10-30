'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, AuthState, LoginCredentials, RegisterData } from './types';
import { AuthApi } from '../api/endpoints';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  updateUserPoints: (userId: string, delta: number) => Promise<number>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'SET_LOADING'; payload: boolean };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try server first
        try {
          const me = await AuthApi.me();
          if (me) {
            dispatch({ type: 'LOGIN_SUCCESS', payload: normalizeUserDates(me) });
            localStorage.setItem('user_data', JSON.stringify(me));
            localStorage.setItem('auth_token', 'server');
            return;
          }
        } catch {}
        // Fallback to local session
        const userData = localStorage.getItem('user_data');
        if (userData) dispatch({ type: 'LOGIN_SUCCESS', payload: JSON.parse(userData) });
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      try {
        const user = await AuthApi.login(credentials.schoolId, credentials.password);
        localStorage.setItem('auth_token', 'server');
        localStorage.setItem('user_data', JSON.stringify(user));
        dispatch({ type: 'LOGIN_SUCCESS', payload: normalizeUserDates(user) });
        return;
      } catch {}
      // Fallback mock
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockUser: User = { id: '1', schoolId: credentials.schoolId, name: 'John Doe', email: `${credentials.schoolId}@school.edu`, role: 'student', points: 1250, level: 3, joinDate: new Date('2024-01-15'), lastActive: new Date(), completedActivities: ['vuln-001','vuln-002'], pendingSubmissions: [], approvedSubmissions: [] };
      localStorage.setItem('auth_token', 'mock_token');
      localStorage.setItem('user_data', JSON.stringify(mockUser));
      dispatch({ type: 'LOGIN_SUCCESS', payload: mockUser });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Invalid credentials' });
    }
  };

  const register = async (data: RegisterData) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      try {
        const user = await AuthApi.register({ schoolId: data.schoolId, name: data.name, password: data.password });
        localStorage.setItem('auth_token', 'server');
        localStorage.setItem('user_data', JSON.stringify(user));
        dispatch({ type: 'LOGIN_SUCCESS', payload: normalizeUserDates(user) });
        return;
      } catch {}
      // Fallback mock
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newUser: User = { id: Date.now().toString(), schoolId: data.schoolId, name: data.name, email: `${data.schoolId}@school.edu`, role: 'student', points: 0, level: 1, joinDate: new Date(), lastActive: new Date(), completedActivities: [], pendingSubmissions: [], approvedSubmissions: [] };
      localStorage.setItem('auth_token', 'mock_token');
      localStorage.setItem('user_data', JSON.stringify(newUser));
      dispatch({ type: 'LOGIN_SUCCESS', payload: newUser });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error instanceof Error ? error.message : 'Registration failed' });
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (userData: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
    
    // Update localStorage
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
    }
  };

  function normalizeUserDates(u: any): User {
    return { ...u, joinDate: new Date(u.joinDate), lastActive: new Date(u.lastActive) } as User;
  }

  const updateUserPoints = async (userId: string, delta: number): Promise<number> => {
    // In a real app, call API; here we adjust local storage if current user matches
    if (state.user && state.user.id === userId) {
      const newPoints = Math.max(0, (state.user.points || 0) + (delta || 0));
      const updated = { ...state.user, points: newPoints } as User;
      localStorage.setItem('user_data', JSON.stringify(updated));
      dispatch({ type: 'LOGIN_SUCCESS', payload: updated });
      return newPoints;
    }
    // For other users in mock mode, simply return current + delta
    return (state.user?.points || 0) + (delta || 0);
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateUser,
        updateUserPoints,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
