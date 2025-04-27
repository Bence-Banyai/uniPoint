import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Base URL is different depending on platform
const BASE_URL = Platform.select({
  web: 'https://unipoint-b6h6h4cubncmafhh.polandcentral-01.azurewebsites.net',
  android: 'https://unipoint-b6h6h4cubncmafhh.polandcentral-01.azurewebsites.net',
  ios: 'https://unipoint-b6h6h4cubncmafhh.polandcentral-01.azurewebsites.net',
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

// Helper to safely store in SecureStore
const storeSecureItem = async (key: string, value: string) => {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add these settings for CORS support
  withCredentials: false,
});

// Request interceptor to add the token
api.interceptors.request.use(
  async (config) => {
    // Use getAuthToken to find the token from any key
    const token = await getSecureItem('userToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Authorization header added to request'); // Add log
    } else {
      console.log('No token found, request sent without Authorization header'); // Add log
    }
    // Log the request being made
    console.log(`Making API request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error); // Add log
    return Promise.reject(error);
  }
);

// Response interceptor - REMOVE OR COMMENT OUT THE REFRESH LOGIC
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // console.log('Response error status:', error.response?.status); // Log status
    // console.log('Original request retry status:', originalRequest._retry); // Log retry status

    // REMOVE or COMMENT OUT this block for refresh token logic
    /*
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('Attempting token refresh...'); // Log refresh attempt
      const newToken = await refreshToken(); // This function should be removed
      if (newToken) {
        console.log('Token refreshed, retrying original request...'); // Log retry
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return api(originalRequest);
      } else {
        console.log('Token refresh failed.'); // Log refresh failure
        // Optionally handle logout here if refresh fails
        // await logout(); // Example: Call logout function from AuthContext
        // router.replace('/login');
      }
    }
    */
    console.error('API Response Error:', error.response?.status, error.message); // Log other errors
    return Promise.reject(error);
  }
);

export default api;