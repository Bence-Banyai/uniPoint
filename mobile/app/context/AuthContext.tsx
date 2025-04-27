import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { authService, LoginData, RegisterData } from '../../services/auth';
import api from '../../services/api'; 

export const unstable_settings = {
  isNotARoute: true,
};

interface AuthContextData {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
  userName: string | null;
  email: string | null;
  login: (data: LoginData) => Promise<any>;
  register: (data: RegisterData) => Promise<any>;
  logout: () => Promise<void>;
  getUserInfo: () => Promise<UserInfo>;
  refreshUserInfo: () => Promise<UserInfo>;
}

interface UserInfo {
  userName: string;
  email: string;
  location?: string;
  createdAt?: string;
  profilePictureUrl?: string;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

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
  const [userName, setUserName] = useState<string | null>(null);
  const [email, setemail] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

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
          setUserName(storedUserName);
          setemail(storedEmail);
          
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

      if (response.token) {
        await storeSecureItem('userToken', response.token);
        await storeSecureItem('userId', response.userId);
        
        const typedResponse = response as any;
        console.log('Response user data:', typedResponse.userName);
        
        let extractedUserName = credentials.userNameOrEmail.includes('@') ? 
          credentials.userNameOrEmail.split('@')[0] : credentials.userNameOrEmail;
        let extractedEmail = credentials.userNameOrEmail.includes('@') ? 
          credentials.userNameOrEmail : `${credentials.userNameOrEmail}@example.com`;
        
        if (typedResponse.userName) extractedUserName = typedResponse.userName;
        else if (typedResponse.user?.userName) extractedUserName = typedResponse.user.userName;
        
        if (typedResponse.email) extractedEmail = typedResponse.email;
        else if (typedResponse.user?.email) extractedEmail = typedResponse.user.email;
        
        await storeSecureItem('userName', extractedUserName);
        await storeSecureItem('email', extractedEmail);
        
        setUserName(extractedUserName);
        setemail(extractedEmail);
        
        if (typedResponse.location || typedResponse.user?.location) {
          const loc = typedResponse.location || typedResponse.user?.location;
          await storeSecureItem('userLocation', loc);
        }

        setIsAuthenticated(true);
        setUserId(response.userId);
        
        setUserInfo({
          userName: extractedUserName,
          email: extractedEmail,
          location: typedResponse.location || typedResponse.user?.location || '(Location not provided)'
        });

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
      try {
        await authService.logout();
      } catch (error) {
        console.error('API logout failed:', error);
      }

      await removeSecureItem('userToken');
      await removeSecureItem('userId');
      await removeSecureItem('userName');
      await removeSecureItem('email');
      await removeSecureItem('userLocation');

      setIsAuthenticated(false);
      setUserId(null);
      setUserName(null);
      setemail(null);
      setUserInfo(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserInfo = async (): Promise<UserInfo> => {
    console.log("==== GETTING USER INFO ====");
    
    if (userInfo) {
      console.log("Using cached user info");
      return userInfo;
    }
    
    const now = new Date().toISOString();
    console.log(`${now} - Current storage state:`, {
      userToken: await getSecureItem('userToken') ? "exists" : "missing",
      userId: await getSecureItem('userId'),
      userName: await getSecureItem('userName'),
      userLocation: await getSecureItem('userLocation')
    });

    try {
      const storedUserName = await getSecureItem('userName');
      const storedEmail = await getSecureItem('email');
      let storedLocation = await getSecureItem('userLocation');
      
      if (!storedLocation) {
        storedLocation = "(Location needs to be set)";
        console.log("Using in-memory location placeholder");
      }
      
      console.log('Stored user info found:', { userName: storedUserName, email: storedEmail });
      
      if (storedUserName && storedEmail) {
        const storedUserInfo = {
          userName: storedUserName,
          email: storedEmail,
          location: storedLocation,
        };
        console.log("Using stored user info");
        
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
      
      const token = await getSecureItem('userToken');
      const userId = await getSecureItem('userId');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      try {
        const response = await api.get(`/api/User/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Raw API response data:', response.data);
        console.log("eljut");
        
        const userData = response.data as any;
        console.log('API user data:', userData.userName);
        
        const newUserInfo: UserInfo = {
          userName: userData.userName || userData.username || 'Unknown User',
          email: userData.email || userData.emailAddress || 'unknown@example.com',
          location: userData.location,
          createdAt: userData.createdAt || userData.memberSince,
        };
        
        setUserInfo(newUserInfo);
        setUserName(newUserInfo.userName);
        setemail(newUserInfo.email);
        
        await storeSecureItem('userName', newUserInfo.userName);
        await storeSecureItem('email', newUserInfo.email);
        if (newUserInfo.location) {
          await storeSecureItem('userLocation', newUserInfo.location);
        }
        
        return newUserInfo;
      } catch (apiError) {
        console.error('API error fetching user data:', apiError);
        throw apiError;
      }
    } catch (error) {
      console.error('Failed to get user info:', error);
      
      const fallbackUserInfo = {
        userName: userName || `User-${userId?.substring(0, 5) || 'Unknown'}`,
        email: email || `user${email || 'unknown'}@example.com`,
        location: await getSecureItem('userLocation') || undefined,
      };
      
      setUserInfo(fallbackUserInfo);
      if (!userName) setUserName(fallbackUserInfo.userName);
      if (!email) setemail(fallbackUserInfo.email);
      console.log(fallbackUserInfo);
      
      return fallbackUserInfo;
    }
  };

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
      userName,
      email,
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

function AuthContextComponent() {
  return null;
}

export default AuthContextComponent;