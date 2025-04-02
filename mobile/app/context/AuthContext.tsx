import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { authService, LoginData, RegisterData } from '../../services/auth';
import api from '../../services/api'; 

// This setting prevents Expo Router from treating this file as a route
export const unstable_settings = {
  isNotARoute: true,
};

interface AuthContextData {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
  userName: string | null; // Add userName to context
  email: string | null; // Add email to context
  login: (data: LoginData) => Promise<any>;
  register: (data: RegisterData) => Promise<any>;
  logout: () => Promise<void>;
  getUserInfo: () => Promise<UserInfo>;
  refreshUserInfo: () => Promise<UserInfo>; // Add a method to force refresh user info
}

interface UserInfo {
  userName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  createdAt?: string;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Helper functions for secure storage that work across platforms
const storeSecureItem = async (key: string, value: string) => {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

const getSecureItem = async (key: string) => {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
};

const removeSecureItem = async (key: string) => {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null); // Add state for userName
  const [email, setemail] = useState<string | null>(null); // Add state for email
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // Check for existing token on app load
  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await getSecureItem('userToken');
        const storedUserId = await getSecureItem('userId');
        const storedUserName = await getSecureItem('userName');
        const storedEmail = await getSecureItem('email');

        if (token) {
          setIsAuthenticated(true);
          setUserId(storedUserId);
          setUserName(storedUserName); // Set username from storage
          setemail(storedEmail); // Set email from storage
          
          // Initialize userInfo if we have the necessary data
          if (storedUserName && storedEmail) {
            setUserInfo({
              userName: storedUserName,
              email: storedEmail
            });
          }
        }
      } catch (error) {
        console.error('Failed to load authentication token:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadToken();
  }, []);

  const login = async (credentials: LoginData) => {
    console.log('Auth service: Attempting login with:', credentials.userNameOrEmail);

    try {
      const response = await authService.login(credentials);
      console.log('Auth service: Login successful');

      // Save the token securely
      if (response.token) {
        await storeSecureItem('userToken', response.token);
        await storeSecureItem('userId', response.userId);
        
        // Use type assertion to access properties that might not be defined in the type
        const typedResponse = response as any;
        console.log('Response user data:', typedResponse.userName);
        
        // Initialize with default value to avoid undefined
        let extractedUserName = 'User';
        let extractedEmail = '';
        
        // Extract userName from various possible locations in the response
        if (typedResponse.userName) {
          extractedUserName = typedResponse.userName;
        } else if (typedResponse.user?.userName) {
          extractedUserName = typedResponse.user.userName;
        } else if (credentials.userNameOrEmail && credentials.userNameOrEmail.includes('@')) {
          // If login was with email, use first part of email
          extractedUserName = credentials.userNameOrEmail.split('@')[0];
        } else if (credentials.userNameOrEmail) {
          // If userName is not in response, use the login credential
          extractedUserName = credentials.userNameOrEmail;
        }
        
        // Extract email from various possible locations in the response
        if (typedResponse.email) {
          extractedEmail = typedResponse.email;
        } else if (typedResponse.user?.email) {
          extractedEmail = typedResponse.user.email;
        } else if (credentials.userNameOrEmail && credentials.userNameOrEmail.includes('@')) {
          // If login was with email, use it
          extractedEmail = credentials.userNameOrEmail;
        } else {
          // Try different API endpoints to fetch user data
          const token = response.token;
          const userId = response.userId;
          
          // Try multiple endpoints to find user data
          const possibleEndpoints = [
            `/api/User/${userId}`,
            `/api/User`,
            `/api/Auth/login`,
            `/api/Auth/register`,
            `/api/Auth/logout`
          ];
          
          let userData = null;
          
          for (const endpoint of possibleEndpoints) {
            try {
              console.log(`Trying to fetch user data from endpoint: ${endpoint}`);
              const userResponse = await api.get(endpoint, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              
              if (userResponse.data) {
                userData = userResponse.data;
                console.log('Successfully fetched user data from endpoint:', endpoint);
                break;
              }
            } catch (error) {
              const endpointError = error as { message: string };
              console.log(`Endpoint ${endpoint} failed:`, endpointError.message);
              // Continue to next endpoint
            }
          }
          
          if (userData && (userData.email || userData.emailAddress)) {
            extractedEmail = userData.email || userData.emailAddress;
            console.log('Fetched email from user API:', extractedEmail);
            
            // If we also found userName, update it
            if (userData.userName || userData.username) {
              extractedUserName = userData.userName || userData.username;
            }
          } else {
            console.log('Could not find user email after trying all endpoints');
            extractedEmail = `${extractedUserName}@example.com`;
          }
        }
        
        // Store extracted values
        await storeSecureItem('userName', extractedUserName);
        setUserName(extractedUserName);
        
        await storeSecureItem('email', extractedEmail);
        setemail(extractedEmail);
        
        // Store phone number if available
        if (typedResponse.phoneNumber || typedResponse.user?.phoneNumber) {
          const phone = typedResponse.phoneNumber || typedResponse.user?.phoneNumber;
          await storeSecureItem('userPhone', phone);
        }
      }

      // Update the auth state
      setIsAuthenticated(true);
      setUserId(response.userId);
      
      // Clear any previous user info to force fresh load
      setUserInfo(null);

      return response;
    } catch (error: any) {
      console.error('Auth service: Login failed', error.message);
      throw new Error(error.response?.data?.message || 'Invalid credentials');
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const result = await authService.register(data);
      console.log('Registration successful:', result);
      
      // Store username and email temporarily for potential future use
      if (data.userName) {
        await storeSecureItem('lastRegisteredUserName', data.userName);
      }
      if (data.email) {
        await storeSecureItem('lastRegisteredEmail', data.email);
      }
      
      return result;
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
      // Try to call logout API
      try {
        await authService.logout();
      } catch (error) {
        console.error('API logout failed:', error);
      }

      // Always remove all stored tokens and user info
      await removeSecureItem('userToken');
      await removeSecureItem('userId');
      await removeSecureItem('userName');
      await removeSecureItem('email');
      await removeSecureItem('userPhone');

      setIsAuthenticated(false);
      setUserId(null);
      setUserName(null); // Clear userName state
      setemail(null); // Clear email state
      setUserInfo(null); // Clear the user info state
    } catch (error) {
      console.error('Logout failed:', error);
      throw error; // Rethrow so we can handle it in the UI
    } finally {
      setIsLoading(false);
    }
  };

  const getUserInfo = async (): Promise<UserInfo> => {
    // If we already have user info in state, return it
    if (userInfo) {
      return userInfo;
    }

    try {
      // First, try to get user info from stored values
      const storedUserName = await getSecureItem('userName');
      const storedEmail = await getSecureItem('email');
      const storedPhone = await getSecureItem('userPhone');
      console.log('Stored user info:', storedEmail);
      
      
      // If we have stored values, use them first
      if (storedUserName && storedEmail) {
        const storedUserInfo = {
          userName: storedUserName,
          email: storedEmail,
          phoneNumber: storedPhone || undefined,
        };
        setUserInfo(storedUserInfo);
        setUserName(storedUserName); // Update the context state
        setemail(storedEmail); // Update the context state
        return storedUserInfo;
      }
      
      // Try to get user info from API only if we don't have stored values
      const token = await getSecureItem('userToken');
      const userId = await getSecureItem('userId');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      // Try API call with proper error handling
      try {
        // Only make the API call if we have a token
        const response = await api.get(`/api/User/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("eljut");
        
        // Handle response with type assertion
        const userData = response.data as any;
        console.log('API user data:', userData.userName);
        
        const newUserInfo: UserInfo = {
          userName: userData.userName || userData.username || 'Unknown User',
          email: userData.email || userData.emailAddress || 'unknown@example.com',
          phoneNumber: userData.phoneNumber || userData.phone,
          address: userData.address,
          createdAt: userData.createdAt || userData.memberSince,
        };
        
        setUserInfo(newUserInfo);
        setUserName(newUserInfo.userName); // Update the context state
        setemail(newUserInfo.email); // Update the context state
        
        // Store the user info for future use
        await storeSecureItem('userName', newUserInfo.userName);
        await storeSecureItem('email', newUserInfo.email);
        if (newUserInfo.phoneNumber) {
          await storeSecureItem('userPhone', newUserInfo.phoneNumber);
        }
        
        return newUserInfo;
      } catch (apiError) {
        console.error('API error fetching user data:', apiError);
        throw apiError; // Rethrow to be caught by outer catch
      }
    } catch (error) {
      console.error('Failed to get user info:', error);
      
      // Last resort fallback
      const fallbackUserInfo = {
        userName: userName || `User-${userId?.substring(0, 5) || 'Unknown'}`,
        email: email || `user${email || 'unknown'}@example.com`,
      };
      
      setUserInfo(fallbackUserInfo);
      if (!userName) setUserName(fallbackUserInfo.userName);
      if (!email) setemail(fallbackUserInfo.email);
      console.log(fallbackUserInfo);
      
      return fallbackUserInfo;
    }
  };

  // Force refresh user info from API
  const refreshUserInfo = async (): Promise<UserInfo> => {
    setUserInfo(null); // Clear cached user info
    return getUserInfo(); // This will now try to fetch from API
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading, 
      userId,
      userName, // Expose userName to components
      email, // Expose email to components
      login, 
      register, 
      logout,
      getUserInfo,
      refreshUserInfo
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Export a proper React component as default to satisfy Expo Router
function AuthContextComponent() {
  return null;
}

export default AuthContextComponent;