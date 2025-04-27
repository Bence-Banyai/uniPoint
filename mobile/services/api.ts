import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const BASE_URL = Platform.select({
  web: 'https://unipoint-b6h6h4cubncmafhh.polandcentral-01.azurewebsites.net',
  android: 'https://unipoint-b6h6h4cubncmafhh.polandcentral-01.azurewebsites.net',
  ios: 'https://unipoint-b6h6h4cubncmafhh.polandcentral-01.azurewebsites.net',
});

const getSecureItem = async (key: string) => {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
};

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
  withCredentials: false,
});

api.interceptors.request.use(
  async (config) => {
    const token = await getSecureItem('userToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Authorization header added to request');
    } else {
      console.log('No token found, request sent without Authorization header');
    }
    console.log(`Making API request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
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