'use client';

import React, { createContext, useContext, useReducer, useEffect, useRef, useMemo, useCallback } from 'react';
import { User, AuthState, LoginCredentials, RegisterData } from './types';
import { AuthApi, transformApiUserToFrontendUser } from '../api/endpoints';
import { TokenRefreshManager, storeTokens, clearTokens, getStoredTokens, isTokenExpired } from './tokenManager';
import { setErrorTrackingUser } from '../api/errorTracking';

// Helper function for better error messages
function getAuthErrorMessage(error: any): string {
  if (error.status === 401) {
    if (error.message?.includes('not active') || error.message?.includes('inactive')) {
      return 'Your account is inactive. Please contact support.';
    }
    if (error.message?.includes('not found') || error.message?.includes('invalid')) {
      return 'Invalid email or password. Please try again.';
    }
    return 'Invalid credentials. Please check your email and password.';
  }
  if (error.status === 429) {
    return 'Too many login attempts. Please wait a moment before trying again.';
  }
  if (error.status === 422) {
    return 'Please check your input and try again.';
  }
  if (error.status >= 500) {
    return 'Server error. Please try again later.';
  }
  return error.message || 'Login failed. Please try again.';
}

// Auth service - can be easily switched between mock and real
const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; accessToken: string; refreshToken?: string }> {
    const USE_MOCK_AUTH = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true';

    if (USE_MOCK_AUTH) {
      // Mock implementation for development
      await new Promise(resolve => setTimeout(resolve, 200));

      const mockUser: User = {
        id: Date.now().toString(),
        email: credentials.email,
        name: credentials.email === 'admin@vulhub.com' ? 'Admin User' : 'Student User',
        role: credentials.email === 'admin@vulhub.com' ? 'admin' : 'student',
        points: credentials.email === 'admin@vulhub.com' ? 0 : 1000,
        level: credentials.email === 'admin@vulhub.com' ? 1 : 3,
        joinDate: new Date(),
        lastActive: new Date(),
        completedActivities: [],
        pendingSubmissions: [],
        approvedSubmissions: []
      };

      return {
        user: mockUser,
        accessToken: 'mock_access_token',
        refreshToken: 'mock_refresh_token'
      };
    } else {
      // Real API implementation
      return AuthApi.login(credentials.email, credentials.password);
    }
  },

  async register(data: RegisterData): Promise<{ user: User; accessToken: string; refreshToken?: string }> {
    const USE_MOCK_AUTH = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true';

    if (USE_MOCK_AUTH) {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 300));

      const newUser: User = {
        id: Date.now().toString(),
        email: data.email,
        name: `${data.firstName} ${data.lastName}`,
        role: 'student',
        points: 0,
        level: 1,
        joinDate: new Date(),
        lastActive: new Date(),
        completedActivities: [],
        pendingSubmissions: [],
        approvedSubmissions: []
      };

      return {
        user: newUser,
        accessToken: 'mock_access_token',
        refreshToken: 'mock_refresh_token'
      };
    } else {
      // Real API implementation
      return AuthApi.register({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
        tenantId: 'default-tenant',
      });
    }
  },

  async logout(): Promise<void> {
    const USE_MOCK_AUTH = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true';

    if (!USE_MOCK_AUTH) {
      await AuthApi.logout();
    }
    // Mock logout does nothing
  },

  async me(): Promise<User> {
    const USE_MOCK_AUTH = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true';

    if (USE_MOCK_AUTH) {
      // Return the actual logged-in user from localStorage (not hardcoded)
      const storedUserData = localStorage.getItem('user_data');
      if (storedUserData) {
        try {
          const parsedUser = JSON.parse(storedUserData);
          // Return the actual user who logged in
          return parsedUser;
        } catch (error) {
          // If parse fails, fall through to default
        }
      }
      
      // Fallback only if no stored user (shouldn't happen in normal flow)
      const mockUser: User = {
        id: 'mock-user-id',
        email: 'student@vulhub.com',
        name: 'Mock Student',
        role: 'student',
        points: 500,
        level: 2,
        joinDate: new Date(),
        lastActive: new Date(),
        completedActivities: [],
        pendingSubmissions: [],
        approvedSubmissions: []
      };
      return mockUser;
    } else {
      return AuthApi.me();
    }
  }
};

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
  console.log('[authReducer] action:', action.type, 'current state:', { isAuthenticated: state.isAuthenticated, isLoading: state.isLoading });
  
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      console.log('[authReducer] LOGIN_SUCCESS - updating state to authenticated');
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
  isLoading: false, // Start with false - show form immediately
  error: null,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const tokenManagerRef = useRef<TokenRefreshManager | null>(null);

  // Check for existing session on mount - optimized for speed
  useEffect(() => {
    const checkAuth = async () => {
      const USE_MOCK_AUTH = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true';
      try {
        // Check if token exists and not expired
        const { accessToken } = getStoredTokens();
        
        // For mock auth, skip expiration check since mock token isn't a real JWT
        if (!accessToken) {
          clearTokens();
          localStorage.removeItem('user_data');
          dispatch({ type: 'SET_LOADING', payload: false });
          return;
        }

        if (!USE_MOCK_AUTH && isTokenExpired(accessToken)) {
          // Token expired (only check for real auth, not mock)
          clearTokens();
          localStorage.removeItem('user_data');
          dispatch({ type: 'SET_LOADING', payload: false });
          return;
        }

        // Validate token with server
        try {
          const user = await authService.me();

          // Transform API user to frontend User
          const frontendUser = transformApiUserToFrontendUser(user);

          // Token valid, user exists - set authenticated
          dispatch({ type: 'LOGIN_SUCCESS', payload: frontendUser });
          localStorage.setItem('user_data', JSON.stringify(frontendUser));
          
        } catch (error) {
          // Token invalid, user not found, or server error
          clearTokens();
          localStorage.removeItem('user_data');
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        // Unexpected error - clear state
        clearTokens();
        localStorage.removeItem('user_data');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, []);

  // Initialize token refresh manager
  useEffect(() => {
    const USE_MOCK_AUTH = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true';

    if (state.isAuthenticated && !USE_MOCK_AUTH) {
      const { refreshToken } = getStoredTokens();
      
      if (refreshToken) {
        // Create token manager
        tokenManagerRef.current = new TokenRefreshManager(
          refreshToken,
          (newAccessToken) => {
            // Token refreshed successfully - silent
            storeTokens(newAccessToken, refreshToken);
          },
          () => {
            // Token refresh failed - silent logout
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

  const login = useCallback(async (credentials: LoginCredentials) => {
    console.log('[AuthContext] login called with:', { email: credentials.email });
    dispatch({ type: 'LOGIN_START' });

    try {
      const response = await authService.login(credentials);
      console.log('[AuthContext] authService.login returned:', { user: response.user });

      // Store tokens and user data
      storeTokens(response.accessToken, response.refreshToken);
      localStorage.setItem('user_data', JSON.stringify(response.user));
      console.log('[AuthContext] Tokens and user data stored');

      dispatch({ type: 'LOGIN_SUCCESS', payload: response.user });
      console.log('[AuthContext] LOGIN_SUCCESS dispatched');

      // Set user in error tracking
      setErrorTrackingUser({
        id: response.user.id,
        email: response.user.email,
        username: response.user.email,
      });
    } catch (error: any) {
      console.log('[AuthContext] login error:', error);
      const errorMessage = getAuthErrorMessage(error);
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      throw error;
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const response = await authService.register(data);

      // Store tokens and user data
      storeTokens(response.accessToken, response.refreshToken);
      localStorage.setItem('user_data', JSON.stringify(response.user));

      dispatch({ type: 'LOGIN_SUCCESS', payload: response.user });
    } catch (error) {
      const errorMessage = getAuthErrorMessage(error);
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    // Stop token refresh
    if (tokenManagerRef.current) {
      tokenManagerRef.current.stop();
      tokenManagerRef.current = null;
    }

    try {
      await authService.logout();
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
  }, []);

  const updateUser = useCallback((userData: Partial<User>) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      dispatch({ type: 'UPDATE_USER', payload: userData });
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
    }
  }, [state.user]);

  const updateUserPoints = useCallback(async (userId: string, delta: number): Promise<number> => {
    if (state.user && state.user.id === userId) {
      const newPoints = Math.max(0, (state.user.points || 0) + (delta || 0));
      updateUser({ points: newPoints });
      return newPoints;
    }
    return (state.user?.points || 0) + (delta || 0);
  }, [state.user, updateUser]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<AuthContextType>(() => ({
    ...state,
    login,
    register,
    logout,
    updateUser,
    updateUserPoints,
  }), [state, login, register, logout, updateUser, updateUserPoints]);

  return (
    <AuthContext.Provider value={contextValue}>
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