import axios from 'axios';
import { Platform } from 'react-native';

import * as SecureStoreModule from 'expo-secure-store';

const SecureStore = Platform.OS !== 'web' ? SecureStoreModule : null;

const BASE_URL = Platform.select({
  web: 'https://unipoint-b6h6h4cubncmafhh.polandcentral-01.azurewebsites.net',
  android: 'https://unipoint-b6h6h4cubncmafhh.polandcentral-01.azurewebsites.net',
  ios: 'https://unipoint-b6h6h4cubncmafhh.polandcentral-01.azurewebsites.net',
  default: 'https://unipoint-b6h6h4cubncmafhh.polandcentral-01.azurewebsites.net',
});

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
  timeout: 10000,
});

api.interceptors.request.use(
  config => {
    if (Platform.OS === 'web') {
      config.headers['Access-Control-Allow-Origin'] = '*';
      config.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE';
      config.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization';
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export interface RegisterData {
  userName: string;
  email: string;
  location: string;
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
  userName?: string;
  email?: string;
  location?: string;
  user?: {
    userName?: string;
    email?: string;
    location?: string;
  };
}

const storeSecureItem = async (key: string, value: string) => {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
  } else if (SecureStore) {
    await SecureStore.setItemAsync(key, value);
  }
};

const getSecureItem = async (key: string) => {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  } else if (SecureStore) {
    return await SecureStore.getItemAsync(key);
  }
  return null;
};

const removeSecureItem = async (key: string) => {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
  } else if (SecureStore) {
    await SecureStore.deleteItemAsync(key);
  }
};

const createMockAuthResponse = (userId: string) => {
  return {
    token: `mock-jwt-token-${Date.now()}`,
    message: "Mock authentication successful",
    userId: userId
  };
};

export const authService = {
  async register(userData: RegisterData) {
    console.log('Auth service: Attempting to register with data:', userData);

    try {
      const backendData = {
        ...userData,
        phoneNumber: userData.location
      };

      const response = await api.post('/api/Auth/register', backendData);
      console.log('Auth service: Registration success:', response.data);
      
      await storeSecureItem('userLocation', userData.location);
      console.log('Stored location during registration:', userData.location);
      
      return response.data;
    } catch (error: any) {
      console.error('Auth service: Registration failed', error.message);
      throw error;
    }
  },

  async login(credentials: LoginData) {
    console.log('Auth service: Attempting login with:', credentials.userNameOrEmail);

    try {
      const response = await api.post<AuthResponse>('/api/Auth/login', credentials);
      console.log('Auth service: Login successful');

      if (response.data.token) {
        await storeSecureItem('userToken', response.data.token);
        await storeSecureItem('userId', response.data.userId);
      }

      return response.data;
    } catch (error: any) {
      console.error('Auth service: Login failed', error.message);
      throw error;
    }
  },

  async logout() {
    try {
      await removeSecureItem('userToken');
      await removeSecureItem('userId');
      
      try {
        const response = await api.post('/api/Auth/logout');
        return response.data;
      } catch (apiError) {
        console.error('API logout failed:', apiError);
        return { message: "Logged out successfully" };
      }
    } catch (error) {
      console.error('Auth service: Local logout failed', error);
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      const token = await getSecureItem('userToken');
      return token ? true : false;
    } catch (error) {
      console.error('Error checking user auth status:', error);
      return false;
    }
  }
};