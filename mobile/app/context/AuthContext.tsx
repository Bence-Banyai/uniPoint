import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authService, LoginData, RegisterData } from '../../services/auth';

interface AuthContextData {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Check for existing token on app load
  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        const storedUserId = await SecureStore.getItemAsync('userId');
        
        if (token) {
          setIsAuthenticated(true);
          setUserId(storedUserId);
        }
      } catch (error) {
        console.error('Failed to load authentication token:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadToken();
  }, []);

  const login = async (data: LoginData) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      setIsAuthenticated(true);
      setUserId(response.userId);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      await authService.register(data);
      // After registration, you might want to log the user in automatically
      if (data.userName && data.password) {
        await login({ userNameOrEmail: data.userName, password: data.password });
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setUserId(null);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        isLoading,
        userId, 
        login, 
        register, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);