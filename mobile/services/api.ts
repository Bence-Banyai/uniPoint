import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Base URL is different depending on platform
const BASE_URL = Platform.select({
  web: 'https://unipoint-b6h6h4cubncmafhh.polandcentral-01.azurewebsites.net',
  android: 'https://unipoint-b6h6h4cubncmafhh.polandcentral-01.azurewebsites.net',
  ios: 'https://unipoint-b6h6h4cubncmafhh.polandcentral-01.azurewebsites.net',
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
        // Make sure the Authorization header is properly formatted
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Add debug log to see what URL is being requested
      console.log(`Making API request to: ${config.baseURL}${config.url}`);
      
      // Add CORS headers for web platform
      if (Platform.OS === 'web') {
        config.headers['Access-Control-Allow-Origin'] = '*';
        config.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        config.headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept, Authorization';
      }
    } catch (error) {
      console.error('API interceptor error:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add retry logic with multiple endpoint formats
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If we get a 404 on /api/User/{userId}, try alternative endpoints
    const originalRequest = error.config;
    
    // Only retry GET requests to specific endpoints once
    if (
      error.response?.status === 404 &&
      originalRequest.method === 'get' &&
      originalRequest.url.startsWith('/api/User/') &&
      !originalRequest._retried
    ) {
      originalRequest._retried = true;
      
      // Try alternative URL formats - your API might use different conventions
      const userId = originalRequest.url.split('/').pop();
      const alternativeEndpoints = [
        `/api/User/GetUser/${userId}`,
        `/api/User/getUserById/${userId}`,
        `/api/User/details/${userId}`,
        `/api/Auth/user/${userId}`,
      ];
      
      for (const endpoint of alternativeEndpoints) {
        try {
          console.log(`Trying alternative endpoint: ${endpoint}`);
          const response = await api.get(endpoint);
          if (response.status === 200) {
            return response;
          }
        } catch (retryError) {
          console.log(`Alternative endpoint ${endpoint} failed too`);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;