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
  location?: string;
  createdAt?: string;
  profilePictureUrl?: string; // Add this line for profile picture support
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
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null); // Update your userInfo state declaration with a more precise type

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
        let extractedUserName = credentials.userNameOrEmail.includes('@') ? 
          credentials.userNameOrEmail.split('@')[0] : credentials.userNameOrEmail;
        let extractedEmail = credentials.userNameOrEmail.includes('@') ? 
          credentials.userNameOrEmail : `${credentials.userNameOrEmail}@example.com`;
        
        // Extract userName and email from response (simpler code)
        if (typedResponse.userName) extractedUserName = typedResponse.userName;
        else if (typedResponse.user?.userName) extractedUserName = typedResponse.user.userName;
        
        if (typedResponse.email) extractedEmail = typedResponse.email;
        else if (typedResponse.user?.email) extractedEmail = typedResponse.user.email;
        
        // Store extracted values - simplified
        await storeSecureItem('userName', extractedUserName);
        await storeSecureItem('email', extractedEmail);
        
        // Bypass API calls during login that might be failing
        // We'll do them later asynchronously
        setUserName(extractedUserName);
        setemail(extractedEmail);
        
        // Handle location separately with a safety check
        // Skip API calls for location if already getting stuck in loop
        if (typedResponse.location || typedResponse.user?.location) {
          const loc = typedResponse.location || typedResponse.user?.location;
          await storeSecureItem('userLocation', loc);
        }

        // Update the auth state
        setIsAuthenticated(true);
        setUserId(response.userId);
        
        // Instead of clearing userInfo which triggers loads of calls
        // Update it directly
        setUserInfo({
          userName: extractedUserName,
          email: extractedEmail,
          location: typedResponse.location || typedResponse.user?.location || '(Location not provided)'
        });

        // Fetch and store profile picture URL immediately after login
        try {
          const userInfo = await getUserInfo();
          if (userInfo.profilePictureUrl) {
            await storeSecureItem('profilePictureUrl', userInfo.profilePictureUrl);
          }
        } catch (e) {
          console.warn('Could not fetch profile picture after login:', e);
        }

        return response;
      }
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
      await removeSecureItem('userLocation');

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
    console.log("==== GETTING USER INFO ====");
    
    // Check for cached data first to prevent infinite loops
    if (userInfo) {
      console.log("Using cached user info");
      return userInfo;
    }
    
    // Add a timestamp to prevent excessive debug logging
    const now = new Date().toISOString();
    console.log(`${now} - Current storage state:`, {
      userToken: await getSecureItem('userToken') ? "exists" : "missing",
      userId: await getSecureItem('userId'),
      userName: await getSecureItem('userName'),
      userLocation: await getSecureItem('userLocation')
    });

    try {
      // First, try to get user info from stored values
      const storedUserName = await getSecureItem('userName');
      const storedEmail = await getSecureItem('email');
      let storedLocation = await getSecureItem('userLocation');
      
      // Only set placeholder location if truly missing
      if (!storedLocation) {
        // Skip setting a placeholder in storage to prevent loops
        // Just use in-memory placeholder
        storedLocation = "(Location needs to be set)";
        console.log("Using in-memory location placeholder");
      }
      
      console.log('Stored user info found:', { userName: storedUserName, email: storedEmail });
      
      // If we have stored values, use them first
      if (storedUserName && storedEmail) {
        const storedUserInfo = {
          userName: storedUserName,
          email: storedEmail,
          location: storedLocation,
        };
        console.log("Using stored user info");
        
        // Update state only if it has changed to prevent re-renders
        if (!userInfo || 
            (userInfo as UserInfo).userName !== storedUserName || 
            (userInfo as UserInfo).email !== storedEmail || 
            (userInfo as UserInfo).location !== storedLocation) {
          setUserInfo(storedUserInfo);
          setUserName(storedUserName);
          setemail(storedEmail);
        }
        
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
        console.log('Raw API response data:', response.data);
        console.log("eljut");
        
        // Handle response with type assertion
        const userData = response.data as any;
        console.log('API user data:', userData.userName);
        
        const newUserInfo: UserInfo = {
          userName: userData.userName || userData.username || 'Unknown User',
          email: userData.email || userData.emailAddress || 'unknown@example.com',
          location: userData.location, // Add the location field
          createdAt: userData.createdAt || userData.memberSince,
        };
        
        setUserInfo(newUserInfo);
        setUserName(newUserInfo.userName); // Update the context state
        setemail(newUserInfo.email); // Update the context state
        
        // Store the user info for future use
        await storeSecureItem('userName', newUserInfo.userName);
        await storeSecureItem('email', newUserInfo.email);
        if (newUserInfo.location) {
          await storeSecureItem('userLocation', newUserInfo.location);
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
        location: await getSecureItem('userLocation') || undefined, // Add this line
      };
      
      setUserInfo(fallbackUserInfo);
      if (!userName) setUserName(fallbackUserInfo.userName);
      if (!email) setemail(fallbackUserInfo.email);
      console.log(fallbackUserInfo);
      
      return fallbackUserInfo;
    }
  };

  // Update refreshUserInfo to always fetch from API and update all state/storage
  const refreshUserInfo = async (): Promise<UserInfo> => {
    setUserInfo(null);
    const token = await getSecureItem('userToken');
    const userId = await getSecureItem('userId');
    if (!token || !userId) throw new Error('No authentication token found');
    try {
      const response = await api.get(`/api/User/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = response.data as any;
      const newUserInfo: UserInfo = {
        userName: userData.userName || userData.username || 'Unknown User',
        email: userData.email || userData.emailAddress || 'unknown@example.com',
        location: userData.location,
        createdAt: userData.createdAt || userData.memberSince,
        profilePictureUrl: userData.profilePictureUrl,
      };
      setUserInfo(newUserInfo);
      setUserName(newUserInfo.userName);
      setemail(newUserInfo.email);
      await storeSecureItem('userName', newUserInfo.userName);
      await storeSecureItem('email', newUserInfo.email);
      if (newUserInfo.location) await storeSecureItem('userLocation', newUserInfo.location);
      if (newUserInfo.profilePictureUrl) await storeSecureItem('profilePictureUrl', newUserInfo.profilePictureUrl);
      return newUserInfo;
    } catch (error) {
      console.error('Failed to refresh user info from API:', error);
      throw error;
    }
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