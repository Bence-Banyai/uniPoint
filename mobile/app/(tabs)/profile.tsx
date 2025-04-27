import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  View,
  Switch,
  TextInput,
  Alert,
  Text,
  ActivityIndicator
} from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '../context/AuthContext';
import api from '../../services/api';
import { fetchUserAppointments, AppointmentStatus, Appointment } from '../../services/appointmentApi';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol, SFSymbols6_0 } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Image } from 'expo-image';

const responsiveFontSize = (size: number, minSize: number, maxSize: number) => {
  const { width, height } = Dimensions.get('window');
  const screenWidth = Math.min(width, height);
  const percent = screenWidth / 375;
  const responsiveSize = size * percent;
  return Math.max(minSize, Math.min(responsiveSize, maxSize));
};

const fontFamilies = {
  title: Platform.select({ ios: "Menlo", android: "monospace" }),
  subtitle: Platform.select({ ios: "Avenir-Medium", android: "sans-serif-medium" }),
  text: Platform.select({ ios: "Avenir", android: "sans-serif" }),
  button: Platform.select({ ios: "Avenir-Heavy", android: "sans-serif-medium" }),
};

const userProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  location: "123 Main St, Anytown, US 12345",
  profileImage: require('@/assets/images/adaptive-icon.png'),
  memberSince: "March 2023"
};


export default function ProfileScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { userId, userName, email, refreshUserInfo, isAuthenticated, logout } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [appointmentStats, setAppointmentStats] = useState({
    completed: 0,
    upcoming: 0,
    cancelled: 0
  });
  
  // Initialize with safer default values
  const [profileData, setProfileData] = useState({
    name: "Loading...",
    email: "loading@example.com",
    location: "",  // Empty string instead of undefined
    memberSince: new Date().toLocaleDateString(),
    profileImage: require("@/assets/images/adaptive-icon.png")
  });
  
  // Move fetchUserData out of useEffect so it can be called after upload
  const fetchUserData = async () => {
    if (!userId) return;
    try {
      const storedLocation = Platform.OS === 'web' 
        ? localStorage.getItem('userLocation') 
        : await SecureStore.getItemAsync('userLocation');
      if (storedLocation && !profileData.location) {
        setProfileData(prev => ({
          ...prev,
          location: storedLocation
        }));
      }
      try {
        const userInfoData = await refreshUserInfo();
        // Always use the backend profilePictureUrl if present, with cache-busting
        let profileImage = userInfoData.profilePictureUrl;
        if (profileImage && typeof profileImage === 'string' && profileImage.trim() !== '') {
          const sep = profileImage.includes('?') ? '&' : '?';
          profileImage = profileImage + sep + 't=' + Date.now();
        } else {
          profileImage = undefined;
        }
        
        // Format the memberSince date to only show the date part (not time)
        let formattedDate = new Date().toLocaleDateString();
        if (userInfoData.createdAt) {
          try {
            // Parse the ISO string and format it as a readable date
            const dateObj = new Date(userInfoData.createdAt);
            formattedDate = dateObj.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            });
          } catch (dateError) {
            console.warn('Error formatting date:', dateError);
          }
        }
        
        setProfileData({
          name: userInfoData.userName || `User ${userId.substring(0, 5)}`,
          email: userInfoData.email || `User${userId.substring(0, 5)}@example.com`,
          location: userInfoData.location || storedLocation || "(No location provided)",
          memberSince: formattedDate,
          profileImage
        });
      } catch (apiError) {
        console.error("Error getting user info from API:", apiError);
      }
    } catch (error) {
      console.error("Error in fetchUserData:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchUserData();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  useEffect(() => {
    const loadAppointmentStats = async () => {
      if (!isAuthenticated) return;
      
      try {
        const userAppointments = await fetchUserAppointments();
        
        // Calculate appointment counts by status
        const stats = {
          completed: 0,
          upcoming: 0,
          cancelled: 0
        };
        
        userAppointments.forEach((appointment: Appointment) => {
          // Treat SCHEDULED appointments in the past as DONE
          if (
            (appointment.status === AppointmentStatus.DONE) ||
            (appointment.status === AppointmentStatus.SCHEDULED && new Date(appointment.appointmentDate) < new Date())
          ) {
            stats.completed++;
          } else if (appointment.status === AppointmentStatus.SCHEDULED && new Date(appointment.appointmentDate) >= new Date()) {
            stats.upcoming++;
          } else if (
            appointment.status === AppointmentStatus.CANCELLED_BY_USER || 
            appointment.status === AppointmentStatus.CANCELLED_BY_SERVICE
          ) {
            stats.cancelled++;
          }
        });
        
        setAppointmentStats(stats);
      } catch (error) {
        console.error('Failed to load appointment statistics:', error);
      }
    };
    
    loadAppointmentStats();
  }, [isAuthenticated]);

  // Helper to pick image (web and native support)
  const pickImage = async () => {
    if (Platform.OS === 'web') {
      // Trigger file input click for web
      document.getElementById('web-profile-upload')?.click();
      return;
    }
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow access to your photos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      uploadProfilePicture(result.assets[0].uri);
    }
  };

  // Web file input handler
  const handleWebFileChange = (event: any) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      uploadProfilePicture(file);
    }
  };

  // Helper to upload image (uri for native, File for web)
  const uploadProfilePicture = async (fileOrUri: any) => {
    try {
      setUploading(true);
      // Use localStorage for token on web, SecureStore on native
      const token = Platform.OS === 'web'
        ? localStorage.getItem('userToken')
        : await SecureStore.getItemAsync('userToken');
      const formData = new FormData();
      if (Platform.OS === 'web') {
        formData.append('file', fileOrUri); // fileOrUri is a File object
      } else {
        formData.append('file', {
          uri: fileOrUri,
          name: 'profile.jpg',
          type: 'image/jpeg',
        } as any);
      }
      const response = await fetch(`${api.defaults.baseURL}/api/User/${userId}/upload-profile-picture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type for web, browser will set it with boundary
          ...(Platform.OS !== 'web' ? { 'Content-Type': 'multipart/form-data' } : {}),
          'accept': '*/*',
        },
        body: formData,
      });
      if (!response.ok) {
        const err = await response.text();
        throw new Error(err);
      }
      await fetchUserData(); // Refresh the page/profile after upload
      Alert.alert('Success', 'Profile picture updated!');
    } catch (e: any) {
      Alert.alert('Upload failed', e.message || 'Unknown error');
    } finally {
      setUploading(false);
    }
  };

  const screenWidth = Dimensions.get('window').width;
  const isSmallDevice = screenWidth < 380;
  const isLargeDevice = screenWidth >= 768;
  
  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/welcome');
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Logout Failed', 'An error occurred while trying to log out.');
    }
  };

  console.log('Current profile location:', profileData.location);

  return (
    <LinearGradient
      colors={["#2E0249", "#570A57", "#A91079"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={[
        styles.glowCircle,
        { top: -Dimensions.get("window").height * 0.2, left: -Dimensions.get("window").width * 0.4 },
      ]} />
      <View style={[
        styles.glowCircle2,
        { bottom: -Dimensions.get("window").height * 0.15, right: -Dimensions.get("window").width * 0.3 },
      ]} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { 
            paddingTop: insets.top + 10,
            paddingBottom: tabBarHeight + 20
          }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.profileImageContainer}>
              {/* Web file input (hidden) */}
              {Platform.OS === 'web' && (
                <input
                  id="web-profile-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleWebFileChange}
                />
              )}
              <TouchableOpacity onPress={pickImage} disabled={uploading} activeOpacity={0.7}>
                {profileData.profileImage && typeof profileData.profileImage === 'string' ? (
                  <Image
                    source={{ uri: profileData.profileImage }}
                    style={styles.profileImage}
                    contentFit="cover"
                  />
                ) : (
                  <View style={[styles.profileImage, {backgroundColor: 'rgba(174, 0, 255, 0.08)', justifyContent: 'center', alignItems: 'center'}]}>
                    <IconSymbol name="person.fill" size={48} color="#EBD3F8" />
                  </View>
                )}
                <View style={styles.cameraIconOverlay} pointerEvents="none">
                  <IconSymbol name="camera.fill" size={28} color="#fff" />
                </View>
                {uploading && (
                  <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 50 }}>
                    <ActivityIndicator color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.profileInfo}>
              <ThemedText
                style={styles.profileName}
                darkColor="#fff" 
                lightColor="#fff"
              >
                {profileData.name}
              </ThemedText>
              <ThemedText
                style={styles.memberSince}
                darkColor="#EBD3F8" 
                lightColor="#EBD3F8"
              >
                Member since {profileData.memberSince}
              </ThemedText>
            </View>
          </View>

          <View style={styles.profileDetailsList}>
            <View style={styles.profileDetailItem}>
              <IconSymbol name="envelope.fill" size={20} color="#31E1F7" />
              <View style={styles.detailContent}>
                <ThemedText
                  style={styles.detailLabel}
                  darkColor="#EBD3F8" 
                  lightColor="#EBD3F8"
                >
                  Email
                </ThemedText>
                <ThemedText
                  style={styles.detailValue}
                  darkColor="#fff" 
                  lightColor="#fff"
                >
                  {profileData.email}
                </ThemedText>
              </View>
            </View>

            <View style={styles.profileDetailItem}>
              <IconSymbol name="house.fill" size={20} color="#31E1F7" />
              <View style={styles.detailContent}>
                <ThemedText
                  style={styles.detailLabel}
                  darkColor="#EBD3F8" 
                  lightColor="#EBD3F8"
                >
                  Location
                </ThemedText>
                <ThemedText
                  style={styles.detailValue}
                  darkColor="#fff" 
                  lightColor="#fff"
                >
                  {profileData.location}
                </ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <ThemedText
                style={styles.statValue}
                darkColor="#fff" 
                lightColor="#fff"
              >
                {appointmentStats.completed}
              </ThemedText>
              <ThemedText
                style={styles.statLabel}
                darkColor="#EBD3F8" 
                lightColor="#EBD3F8"
              >
                Completed
              </ThemedText>
            </View>
            
            <View style={styles.statCard}>
              <ThemedText
                style={styles.statValue}
                darkColor="#fff" 
                lightColor="#fff"
              >
                {appointmentStats.upcoming}
              </ThemedText>
              <ThemedText
                style={styles.statLabel}
                darkColor="#EBD3F8" 
                lightColor="#EBD3F8"
              >
                Upcoming
              </ThemedText>
            </View>
            
            <View style={styles.statCard}>
              <ThemedText
                style={styles.statValue}
                darkColor="#fff" 
                lightColor="#fff"
              >
                {appointmentStats.cancelled}
              </ThemedText>
              <ThemedText
                style={styles.statLabel}
                darkColor="#EBD3F8" 
                lightColor="#EBD3F8"
              >
                Cancelled
              </ThemedText>
            </View>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={["rgba(244, 67, 54, 0.8)", "rgba(244, 67, 54, 0.6)"]}
            style={styles.logoutButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <ThemedText
              style={styles.logoutButtonText}
              lightColor="#fff"
              darkColor="#fff"
            >
              Logout
            </ThemedText>
          </LinearGradient>
        </TouchableOpacity>
        
        <View style={styles.versionContainer}>
          <ThemedText
            style={styles.versionText}
            darkColor="rgba(235, 211, 248, 0.5)" 
            lightColor="rgba(235, 211, 248, 0.5)"
          >
            UniPoint v1.0.0
          </ThemedText>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  glowCircle: {
    position: "absolute",
    width: Dimensions.get("window").width * 0.8,
    height: Dimensions.get("window").width * 0.8,
    borderRadius: Dimensions.get("window").width * 0.4,
    backgroundColor: "#8E05C2",
    opacity: 0.3,
    zIndex: 0,
  },
  glowCircle2: {
    position: "absolute",
    width: Dimensions.get("window").width * 0.7,
    height: Dimensions.get("window").width * 0.7,
    borderRadius: Dimensions.get("window").width * 0.35,
    backgroundColor: "#F806CC",
    opacity: 0.2,
    zIndex: 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: responsiveFontSize(22, 22, 34),
    fontWeight: '700',
    fontFamily: fontFamilies.title,
    textShadowColor: "#F806CC",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  profileCard: {
    backgroundColor: 'rgba(174, 0, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(235, 211, 248, 0.2)',
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#31E1F7',
  },
  cameraIconOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(49,225,247,0.85)',
    borderRadius: 16,
    padding: 4,
    zIndex: 2,
    elevation: 2,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: responsiveFontSize(22, 20, 26),
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: fontFamilies.subtitle,
  },
  memberSince: {
    fontSize: responsiveFontSize(14, 12, 16),
    opacity: 0.7,
    fontFamily: fontFamilies.text,
  },
  profileDetailsList: {
    gap: 16,
  },
  profileDetailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  detailContent: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(235, 211, 248, 0.1)',
    paddingBottom: 12,
  },
  detailLabel: {
    fontSize: responsiveFontSize(12, 11, 14),
    marginBottom: 4,
    opacity: 0.6,
    fontFamily: fontFamilies.text,
  },
  detailValue: {
    fontSize: responsiveFontSize(16, 14, 18),
    fontFamily: fontFamilies.text,
  },
  detailInput: {
    fontSize: responsiveFontSize(16, 14, 18),
    fontFamily: fontFamilies.text,
    color: '#fff',
    paddingVertical: 0,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,       // Add this line to create space above the stats
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: 'rgba(174, 0, 255, 0.1)',
    borderRadius: 16,
    padding: 14,             // Reduced from 16 to give more space for text
    borderWidth: 1,
    borderColor: 'rgba(235, 211, 248, 0.2)',
    alignItems: 'center',
    width: '31%',
    justifyContent: 'center', // Add for vertical centering
  },
  statValue: {
    fontSize: responsiveFontSize(20, 18, 28), // Reduced minimum size for small devices
    fontWeight: 'bold',
    fontFamily: fontFamilies.subtitle,
    marginBottom: 4,
    textAlign: 'center',     // Ensure center alignment
  },
  statLabel: {
    fontSize: responsiveFontSize(12, 10, 14), // Reduced minimum size for small devices
    fontFamily: fontFamilies.text,
    textAlign: 'center',     // Ensure center alignment
    flexShrink: 1,           // Allow text to shrink if needed
  },
  logoutButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    marginVertical: 8,
  },
  logoutButtonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    fontSize: responsiveFontSize(16, 14, 18),
    fontWeight: 'bold',
    letterSpacing: 0.5,
    fontFamily: fontFamilies.button,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  versionText: {
    fontSize: responsiveFontSize(12, 10, 14),
    fontFamily: fontFamilies.text,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  greeting: {
    fontSize: responsiveFontSize(16, 14, 18),
    fontWeight: 'bold',
  },
  username: {
    fontSize: responsiveFontSize(14, 12, 16),
    color: '#fff',
  },
});