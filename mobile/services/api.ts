import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Base URL is different depending on platform
const BASE_URL = Platform.select({
  web: 'http://localhost:5273',
  android: 'http://10.0.2.2:5273',
  ios: 'http://localhost:5273',
});

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add these settings for CORS support
  withCredentials: false,
});

// Helper to safely access SecureStore
const getSecureItem = async (key: string) => {
  if (Platform.OS === 'web') {
    // Use localStorage as fallback for web
    return localStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
};

// Interceptor to add auth token to requests
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getSecureItem('userToken');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Add CORS headers for web platform
      if (Platform.OS === 'web') {
        config.headers['Access-Control-Allow-Origin'] = '*';
        config.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        config.headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept, Authorization';
      }
    } catch (error) {
      console.error('Error setting auth header:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;