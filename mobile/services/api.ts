import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Base URL is different depending on platform
const BASE_URL = Platform.select({
  web: 'http://localhost:5273', // For web
  android: 'http://10.0.2.2:5273', // For Android emulator
  ios: 'http://localhost:5273', // For iOS simulator
  default: 'http://localhost:5273',
});

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;