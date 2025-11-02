'use client';

import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { User, AuthState, LoginCredentials, RegisterData } from './types';
import { AuthApi } from '../api/endpoints';
import { TokenRefreshManager, storeTokens, clearTokens, getStoredTokens } from './tokenManager';
import { setErrorTrackingUser } from '../api/errorTracking';

// Toggle between mock and real API
const USE_MOCK_AUTH = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true';

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
  isLoading: false, // Start with false to prevent initial loading state
  error: null,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const tokenManagerRef = useRef<TokenRefreshManager | null>(null);

  // Check for existing session on mount - optimized for speed
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check local session first - this is instant
        const userData = localStorage.getItem('user_data');
        if (userData) {
          try {
            const parsedUser = JSON.parse(userData);
            // Validate user data structure
            if (parsedUser && parsedUser.id && parsedUser.name) {
              dispatch({ type: 'LOGIN_SUCCESS', payload: parsedUser });
              return;
            } else {
              // Invalid user data, clean up
              localStorage.removeItem('user_data');
              localStorage.removeItem('auth_token');
            }
          } catch (parseError) {
            // Invalid stored data - clear it silently
            localStorage.removeItem('user_data');
            localStorage.removeItem('auth_token');
          }
        }
        
        // No valid session found - ensure loading is false
        dispatch({ type: 'SET_LOADING', payload: false });
      } catch (error) {
        // Auth check failed silently
      }
    };

    // Run immediately, no async needed
    checkAuth();
  }, []);

  // Initialize token refresh manager
  useEffect(() => {
    if (state.isAuthenticated && !USE_MOCK_AUTH) {
      const { refreshToken } = getStoredTokens();
      
      if (refreshToken) {
        // Create token manager
        tokenManagerRef.current = new TokenRefreshManager(
          refreshToken,
          (newAccessToken) => {
            // On token refreshed
            console.log('Token refreshed successfully');
            storeTokens(newAccessToken, refreshToken);
          },
          () => {
            // On refresh failed
            console.error('Token refresh failed, logging out');
            logout();
          }
        );
        
        // Start automatic refresh
        tokenManagerRef.current.start();
      }
    } else {
      // Stop token manager if user logs out
      if (tokenManagerRef.current) {
        tokenManagerRef.current.stop();
        tokenManagerRef.current = null;
      }
    }

    // Cleanup on unmount or when user logs out
    return () => {
      if (tokenManagerRef.current) {
        tokenManagerRef.current.stop();
        tokenManagerRef.current = null;
      }
    };
  }, [state.isAuthenticated]);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      if (USE_MOCK_AUTH) {
        // MOCK AUTH - For development
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const mockUser: User = {
          id: Date.now().toString(),
          schoolId: credentials.schoolId,
          name: credentials.schoolId === 'admin' ? 'Admin User' : 'Student User',
          email: `${credentials.schoolId}@school.edu`,
          role: credentials.schoolId === 'admin' ? 'admin' : 'student',
          points: credentials.schoolId === 'admin' ? 0 : 1000,
          level: credentials.schoolId === 'admin' ? 1 : 3,
          joinDate: new Date(),
          lastActive: new Date(),
          completedActivities: [],
          pendingSubmissions: [],
          approvedSubmissions: []
        };
        
        localStorage.setItem('auth_token', 'mock_token');
        localStorage.setItem('user_data', JSON.stringify(mockUser));
        dispatch({ type: 'LOGIN_SUCCESS', payload: mockUser });
        
        // Set user in error tracking
        setErrorTrackingUser({
          id: mockUser.id,
          email: mockUser.email,
          username: mockUser.schoolId,
        });
      } else {
        // REAL API AUTH - For production
        const response = await AuthApi.login(credentials.schoolId, credentials.password);
        
        // Store tokens and user data
        storeTokens(response.accessToken, response.refreshToken);
        localStorage.setItem('user_data', JSON.stringify(response.user));
        
        dispatch({ type: 'LOGIN_SUCCESS', payload: response.user });
        
        // Set user in error tracking
        setErrorTrackingUser({
          id: response.user.id,
          email: response.user.email,
          username: response.user.schoolId,
        });
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Invalid credentials';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      if (USE_MOCK_AUTH) {
        // MOCK AUTH - For development
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const newUser: User = {
          id: Date.now().toString(),
          schoolId: data.schoolId,
          name: data.name,
          email: `${data.schoolId}@school.edu`,
          role: 'student',
          points: 0,
          level: 1,
          joinDate: new Date(),
          lastActive: new Date(),
          completedActivities: [],
          pendingSubmissions: [],
          approvedSubmissions: []
        };
        
        localStorage.setItem('auth_token', 'mock_token');
        localStorage.setItem('user_data', JSON.stringify(newUser));
        dispatch({ type: 'LOGIN_SUCCESS', payload: newUser });
      } else {
        // REAL API AUTH - For production
        const response = await AuthApi.register({
          schoolId: data.schoolId,
          name: data.name,
          password: data.password
        });
        
        // Store tokens and user data
        storeTokens(response.accessToken, response.refreshToken);
        localStorage.setItem('user_data', JSON.stringify(response.user));
        
        dispatch({ type: 'LOGIN_SUCCESS', payload: response.user });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const logout = async () => {
    // Stop token refresh
    if (tokenManagerRef.current) {
      tokenManagerRef.current.stop();
      tokenManagerRef.current = null;
    }

    try {
      if (!USE_MOCK_AUTH) {
        // Call real API logout
        await AuthApi.logout();
      }
    } catch (error) {
      // Continue with local logout even if API fails
    } finally {
      // Always clear all tokens and user data
      clearTokens();
      localStorage.removeItem('user_data');
      dispatch({ type: 'LOGOUT' });
      
      // Clear user from error tracking
      setErrorTrackingUser(null);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      dispatch({ type: 'UPDATE_USER', payload: userData });
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
    }
  };

  const updateUserPoints = async (userId: string, delta: number): Promise<number> => {
    if (state.user && state.user.id === userId) {
      const newPoints = Math.max(0, (state.user.points || 0) + (delta || 0));
      updateUser({ points: newPoints });
      return newPoints;
    }
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