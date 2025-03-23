import useApiClient from "./useApiClient";

export default function useAuthApi() {
    const apiClient = useApiClient()
    
    return {
      // Register a new user
      register(userData: {
        userName: string;
        email: string;
        phoneNumber: string;
        password: string;
        role: string;
      }) {
        return apiClient.post('/api/Auth/register', userData)
      },
      
      // Login a user
      async login(credentials: {
        userNameOrEmail: string;
        password: string;
      }) {
        const response = await apiClient.post('/api/Auth/login', credentials)
        // Code to save token could be added here
        return response
      },
      
      // Logout the current user
      logout() {
        return apiClient.post('/api/Auth/logout', {})
      }
    }
  }