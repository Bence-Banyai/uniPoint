import api from './api';
import * as SecureStore from 'expo-secure-store';

export interface RegisterData {
  userName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: string;
}

export interface LoginData {
  userNameOrEmail: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  message: string;
  userId: string;
}

export const authService = {
  async register(userData: RegisterData) {
    const response = await api.post<{ message: string }>('/api/Auth/register', userData);
    return response.data;
  },

  async login(credentials: LoginData) {
    const response = await api.post<AuthResponse>('/api/Auth/login', credentials);
    
    // Save the token securely
    if (response.data.token) {
      await SecureStore.setItemAsync('userToken', response.data.token);
      await SecureStore.setItemAsync('userId', response.data.userId);
    }
    
    return response.data;
  },

  async logout() {
    const response = await api.post<{ message: string }>('/api/Auth/logout');
    // Remove stored credentials
    await SecureStore.deleteItemAsync('userToken');
    await SecureStore.deleteItemAsync('userId');
    return response.data;
  },

  async getCurrentUser() {
    const token = await SecureStore.getItemAsync('userToken');
    return token ? true : false;
  },
};