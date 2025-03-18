import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Platform,
  View,
  Switch,
  TextInput
} from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Add responsive font size utility
const responsiveFontSize = (size: number, minSize: number, maxSize: number) => {
  const { width, height } = Dimensions.get('window');
  const screenWidth = Math.min(width, height);
  const percent = screenWidth / 375;
  const responsiveSize = size * percent;
  return Math.max(minSize, Math.min(responsiveSize, maxSize));
};

// Font family definitions
const fontFamilies = {
  title: Platform.select({ ios: "Menlo", android: "monospace" }),
  subtitle: Platform.select({ ios: "Avenir-Medium", android: "sans-serif-medium" }),
  text: Platform.select({ ios: "Avenir", android: "sans-serif" }),
  button: Platform.select({ ios: "Avenir-Heavy", android: "sans-serif-medium" }),
};

// User data (placeholder)
const userProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  address: "123 Main St, Anytown, US 12345",
  profileImage: require('@/assets/images/adaptive-icon.png'),
  memberSince: "March 2023"
};

// Settings data - removed dark mode and payment methods
const settingsData = [
  {
    id: 'notifications',
    title: 'Push Notifications',
    icon: 'chevron.right',
    type: 'toggle',
    value: true
  },
  {
    id: 'privacy',
    title: 'Privacy Settings',
    icon: 'chevron.right',
    type: 'navigate',
    route: '/privacy'
  },
  {
    id: 'help',
    title: 'Help & Support',
    icon: 'chevron.right',
    type: 'navigate',
    route: '/help'
  }
];

// Setting card component
function SettingCard({ setting, onToggle, onPress }) {
  return (
    <TouchableOpacity
      style={styles.settingCard}
      activeOpacity={setting.type === 'navigate' ? 0.7 : 1}
      onPress={setting.type === 'navigate' ? onPress : null}
    >
      <View style={styles.settingContent}>
        <IconSymbol name={setting.icon} size={20} color="#31E1F7" />
        <ThemedText
          style={styles.settingTitle}
          darkColor="#EBD3F8"
          lightColor="#EBD3F8"
        >
          {setting.title}
        </ThemedText>
      </View>
      
      {setting.type === 'toggle' ? (
        <Switch
          trackColor={{ false: 'rgba(174, 0, 255, 0.2)', true: 'rgba(49, 225, 247, 0.5)' }}
          thumbColor={setting.value ? '#31E1F7' : '#EBD3F8'}
          onValueChange={() => onToggle(setting.id)}
          value={setting.value}
          style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
        />
      ) : (
        <IconSymbol name="chevron.right" size={18} color="#EBD3F8" />
      )}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const [isEditMode, setIsEditMode] = useState(false);
  const [settings, setSettings] = useState(settingsData);
  const [profileData, setProfileData] = useState(userProfile);

  // Calculate responsive sizes
  const screenWidth = Dimensions.get('window').width;
  const isSmallDevice = screenWidth < 380;
  const isLargeDevice = screenWidth >= 768;
  
  // Handle logout
  const handleLogout = () => {
    // Show confirmation alert
    router.replace('/welcome');
  };

  // Handle toggle settings
  const handleToggleSetting = (id) => {
    setSettings(settings.map(setting => 
      setting.id === id 
        ? {...setting, value: !setting.value} 
        : setting
    ));
  };

  // Handle navigation to setting screens
  const handleSettingPress = (route) => {
    console.log(`Navigate to: ${route}`);
    // router.push(route);
  };

  // Handle edit profile
  const handleEditProfile = () => {
    setIsEditMode(!isEditMode);
  };

  return (
    <LinearGradient
      colors={["#2E0249", "#570A57", "#A91079"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Background effects */}
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
        {/* Header */}
        <View style={styles.header}>
          <ThemedText
            style={styles.headerTitle}
            darkColor="#fff" 
            lightColor="#fff"
          >
            Profile
          </ThemedText>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditProfile}
          >
            <ThemedText
              style={styles.editButtonText}
              darkColor="#31E1F7" 
              lightColor="#31E1F7"
            >
              {isEditMode ? 'Save' : 'Edit'}
            </ThemedText>
          </TouchableOpacity>
        </View>
        
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.profileImageContainer}>
              <Image
                source={profileData.profileImage}
                style={styles.profileImage}
              />
              {isEditMode && (
                <TouchableOpacity style={styles.changePhotoButton}>
                  <IconSymbol name="chevron.right" size={18} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.profileInfo}>
              {isEditMode ? (
                <TextInput
                  style={styles.nameInput}
                  value={profileData.name}
                  onChangeText={(text) => setProfileData({...profileData, name: text})}
                  selectionColor="#31E1F7"
                />
              ) : (
                <ThemedText
                  style={styles.profileName}
                  darkColor="#fff" 
                  lightColor="#fff"
                >
                  {profileData.name}
                </ThemedText>
              )}
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
            {/* Email */}
            <View style={styles.profileDetailItem}>
              <IconSymbol name="chevron.right" size={20} color="#31E1F7" />
              <View style={styles.detailContent}>
                <ThemedText
                  style={styles.detailLabel}
                  darkColor="#EBD3F8" 
                  lightColor="#EBD3F8"
                >
                  Email
                </ThemedText>
                {isEditMode ? (
                  <TextInput
                    style={styles.detailInput}
                    value={profileData.email}
                    onChangeText={(text) => setProfileData({...profileData, email: text})}
                    selectionColor="#31E1F7"
                    keyboardType="email-address"
                  />
                ) : (
                  <ThemedText
                    style={styles.detailValue}
                    darkColor="#fff" 
                    lightColor="#fff"
                  >
                    {profileData.email}
                  </ThemedText>
                )}
              </View>
            </View>
            
            {/* Address */}
            <View style={styles.profileDetailItem}>
              <IconSymbol name="chevron.right" size={20} color="#31E1F7" />
              <View style={styles.detailContent}>
                <ThemedText
                  style={styles.detailLabel}
                  darkColor="#EBD3F8" 
                  lightColor="#EBD3F8"
                >
                  Address
                </ThemedText>
                {isEditMode ? (
                  <TextInput
                    style={styles.detailInput}
                    value={profileData.address}
                    onChangeText={(text) => setProfileData({...profileData, address: text})}
                    selectionColor="#31E1F7"
                    multiline={true}
                  />
                ) : (
                  <ThemedText
                    style={styles.detailValue}
                    darkColor="#fff" 
                    lightColor="#fff"
                  >
                    {profileData.address}
                  </ThemedText>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* History stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <ThemedText
              style={styles.statValue}
              darkColor="#fff" 
              lightColor="#fff"
            >
              12
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
              2
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
              1
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
        
        {/* Settings section */}
        <View style={styles.settingsSection}>
          <ThemedText
            style={styles.sectionTitle}
            darkColor="#fff" 
            lightColor="#fff"
          >
            Settings
          </ThemedText>
          
          <View style={styles.settingsList}>
            {settings.map((setting) => (
              <SettingCard
                key={setting.id}
                setting={setting}
                onToggle={handleToggleSetting}
                onPress={() => handleSettingPress(setting.route)}
              />
            ))}
          </View>
        </View>
        
        {/* Logout button */}
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
        
        {/* App version */}
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
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  editButtonText: {
    fontSize: responsiveFontSize(16, 14, 18),
    fontWeight: '600',
    fontFamily: fontFamilies.button,
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
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#31E1F7',
  },
  changePhotoButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(49, 225, 247, 0.7)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
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
  nameInput: {
    fontSize: responsiveFontSize(22, 20, 26),
    fontWeight: '600',
    color: '#fff',
    fontFamily: fontFamilies.subtitle,
    borderBottomWidth: 1,
    borderBottomColor: '#31E1F7',
    paddingBottom: 4,
    marginBottom: 4,
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
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: 'rgba(174, 0, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(235, 211, 248, 0.2)',
    alignItems: 'center',
    width: '31%',
  },
  statValue: {
    fontSize: responsiveFontSize(20, 20, 28),
    fontWeight: 'bold',
    fontFamily: fontFamilies.subtitle,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: responsiveFontSize(12, 11, 14),
    fontFamily: fontFamilies.text,
  },
  settingsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: responsiveFontSize(20, 18, 24),
    fontWeight: '600',
    marginBottom: 16,
    fontFamily: fontFamilies.subtitle,
  },
  settingsList: {
    gap: 12,
  },
  settingCard: {
    backgroundColor: 'rgba(174, 0, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(235, 211, 248, 0.2)',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  settingTitle: {
    fontSize: responsiveFontSize(16, 14, 18),
    fontFamily: fontFamilies.subtitle,
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
  }
});