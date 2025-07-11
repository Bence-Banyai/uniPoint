import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  FlatList,
  Text,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect, useMemo } from 'react';
import { router } from 'expo-router';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { fetchCategories, Category as CategoryType } from '../../services/categoryApi';
import { fetchUserAppointments, AppointmentStatus, cancelAppointment } from '../../services/appointmentApi';
import { Image as ExpoImage } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

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

type CategoryProps = {
  category: CategoryType;
  onPress: (id: number) => void;
};

function CategoryCard({ category, onPress }: CategoryProps) {
  const getCategoryColor = (categoryId: number): string => {
    const colors: {[key: number]: string} = {
      1: '#4CAF50', // Health
      2: '#E91E63', // Beauty
      3: '#2196F3', // Fitness
      4: '#FF9800', // Auto
      5: '#9C27B0', // Legal
      6: '#3F51B5', // Education
      7: '#607D8B', // Tech
      8: '#009688', // Cleaning
    };
    
    return colors[categoryId] || '#AE00FF';
  };

  const color = getCategoryColor(category.categoryId);

  return (
    <TouchableOpacity 
      style={[styles.categoryCard, { borderColor: color }]}
      activeOpacity={0.7}
      onPress={() => onPress(category.categoryId)}
    >
      <View style={[styles.categoryIconContainer, { backgroundColor: `${color}20` }]}>
        {category.iconUrl ? (
          <ExpoImage 
            source={{ uri: category.iconUrl }}
            style={{
              width: 36, // Increase from 24 to better fill the 40px container
              height: 36, // Increase from 24 to better fill the 40px container
              borderRadius: 18, // Half of width/height
              overflow: 'hidden'
            }}
            contentFit="cover"
          />
        ) : (
          <IconSymbol name="chevron.right" size={20} color={color} />
        )}
      </View>
      <ThemedText 
        style={styles.categoryTitle}
        darkColor="#EBD3F8" 
        lightColor="#EBD3F8"
      >
        {category.name}
      </ThemedText>
    </TouchableOpacity>
  );
}

type AppointmentProps = {
  appointment: {
    id: string;
    title: string;
    provider: string;
    time: string;
    date: string;
    location: string;
    status: string;
    category: string;
  };
  onCancel: (id: string) => void;
  isPast?: boolean;
};

function AppointmentCard({ appointment, onCancel, isPast = false }: AppointmentProps) {
  const getStatusColor = (status: string): string => {
    switch(status) {
      case 'confirmed': return '#4CAF50';
      case 'completed': return '#8E44AD';
      case 'pending': return '#FF9800';
      case 'cancelled': return '#F44336';
      default: return '#808080';
    }
  };

  return (
    <TouchableOpacity 
      style={styles.appointmentCard}
      activeOpacity={0.8}
    >
      <View style={styles.appointmentHeader}>
        <ThemedText 
          style={styles.appointmentTitle}
          darkColor="#fff" 
          lightColor="#fff"
        >
          {appointment.title}
        </ThemedText>
        <View 
          style={[
            styles.statusIndicator,
            { backgroundColor: getStatusColor(appointment.status) }
          ]}
        />
      </View>
      
      <View style={styles.appointmentDetails}>
        <View style={styles.appointmentInfo}>
          <IconSymbol name="chevron.right" size={16} color="#31E1F7" />
          <ThemedText 
            style={styles.appointmentText}
            darkColor="#EBD3F8" 
            lightColor="#EBD3F8"
          >
            {appointment.provider}
          </ThemedText>
        </View>
        
        <View style={styles.appointmentInfo}>
          <IconSymbol name="chevron.right" size={16} color="#31E1F7" />
          <ThemedText 
            style={styles.appointmentText}
            darkColor="#EBD3F8" 
            lightColor="#EBD3F8"
          >
            {appointment.date} • {appointment.time}
          </ThemedText>
        </View>
        
        <View style={styles.appointmentInfo}>
          <IconSymbol name="chevron.right" size={16} color="#31E1F7" />
          <ThemedText 
            style={styles.appointmentText}
            darkColor="#EBD3F8" 
            lightColor="#EBD3F8"
          >
            {appointment.location}
          </ThemedText>
        </View>
      </View>
      
      {!isPast && appointment.status !== 'cancelled' && (
        <View style={styles.appointmentActions}>
          <TouchableOpacity 
            style={[styles.appointmentButton, styles.cancelButton]}
            activeOpacity={0.7}
            onPress={() => onCancel(appointment.id)}
          >
            <ThemedText 
              style={styles.buttonText}
              darkColor="#F806CC" 
              lightColor="#F806CC"
            >
              Cancel
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}
      
      {isPast && appointment.status === 'cancelled' && (
        <View style={styles.statusBadgeContainer}>
          <View style={styles.statusBadge}>
            <ThemedText 
              style={styles.statusBadgeText}
              darkColor="#EBD3F8" 
              lightColor="#EBD3F8"
            >
              Cancelled
            </ThemedText>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function AppointmentsScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const [activeTab, setActiveTab] = useState('upcoming'); 
  const { userName, getUserInfo } = useAuth();
  const [profileImage, setProfileImage] = useState(require('@/assets/images/adaptive-icon.png'));

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const userInfo = await getUserInfo();
        let url = userInfo.profilePictureUrl;
        if (url && typeof url === 'string' && url.trim() !== '') {
          const sep = url.includes('?') ? '&' : '?';
          url = url + sep + 't=' + Date.now();
          setProfileImage({ uri: url });
        } else {
          setProfileImage(require('@/assets/images/adaptive-icon.png'));
        }
      } catch {
        setProfileImage(require('@/assets/images/adaptive-icon.png'));
      }
    };
    fetchProfileImage();
  }, []);

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [showAllAppointments, setShowAllAppointments] = useState(false);
  const navigation = useNavigation();

  const filteredAppointments = useMemo(() => {
    const now = new Date();
    return appointments.map(appt => {
      if (
        appt.status === AppointmentStatus.SCHEDULED &&
        new Date(appt.appointmentDate) < now
      ) {
        return { ...appt, status: AppointmentStatus.DONE };
      }
      return appt;
    }).filter(appt => {
      if (activeTab === 'upcoming') {
        return appt.status === AppointmentStatus.SCHEDULED;
      } else {
        return (
          appt.status === AppointmentStatus.DONE ||
          appt.status === AppointmentStatus.CANCELLED_BY_USER ||
          appt.status === AppointmentStatus.CANCELLED_BY_SERVICE
        );
      }
    });
  }, [appointments, activeTab]);

  const displayedAppointments = useMemo(() => {
    return showAllAppointments ? filteredAppointments : filteredAppointments.slice(0, 3);
  }, [filteredAppointments, showAllAppointments]);

  const loadUserAppointments = async () => {
    try {
      setLoadingAppointments(true);
      const userAppointments = await fetchUserAppointments();
      setAppointments(userAppointments);
    } catch (err) {
      console.error('Failed to load user appointments:', err);
    } finally {
      setLoadingAppointments(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingCategories(true);
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoadingCategories(false);
      }
      
      await loadUserAppointments();
    };

    loadData();
  }, []);

  useEffect(() => {
    setShowAllAppointments(false);
  }, [activeTab]);

  const handleCancel = async (id: number) => {
    try {
      await cancelAppointment(id);
      
      await loadUserAppointments();
      
      try {
        await AsyncStorage.setItem('shouldRefreshHomeScreen', 'true');
      } catch (error) {
        console.log('Error setting refresh flag:', error);
      }
      
      Alert.alert(
        "Appointment Cancelled", 
        "Your appointment has been successfully cancelled."
      );
      
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
      Alert.alert(
        "Cancellation Failed", 
        "There was an error cancelling your appointment. Please try again."
      );
    }
  };

  const handleCategoryPress = (categoryId: number) => {
    router.push({
      pathname: '/(tabs)/search',
      params: { categoryId: categoryId.toString() }
    });
  };

  const handleBookNew = () => {
    router.push('/(tabs)/search');
  };

  const toggleShowAllAppointments = () => {
    setShowAllAppointments(prev => !prev);
  };

  const hasAppointments = displayedAppointments.length > 0;
  const hasMoreAppointments = filteredAppointments.length > 3;

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
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <ExpoImage
              source={profileImage}
              style={styles.avatar}
              contentFit="cover"
            />
            <View>
              <ThemedText 
                style={styles.greeting} 
                darkColor="#EBD3F8" 
                lightColor="#EBD3F8"
              >
                Good morning
              </ThemedText>
              <ThemedText 
                style={styles.username}
                darkColor="#fff" 
                lightColor="#fff"
              >
                {userName || 'User'}
              </ThemedText>
            </View>
          </View>
        </View>
        
        <View style={styles.categoriesContainer}>
          <ThemedText 
            style={styles.sectionTitle}
            darkColor="#fff" 
            lightColor="#fff"
          >
            Book an Appointment
          </ThemedText>
          
          {loadingCategories ? (
            <ActivityIndicator size="large" color="#31E1F7" />
          ) : (
            <FlatList
              data={categories}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesList}
              renderItem={({ item }) => (
                <CategoryCard 
                  category={item}
                  onPress={handleCategoryPress} 
                />
              )}
              keyExtractor={(item) => item.categoryId.toString()}
              ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            />
          )}
        </View>
        
        <View style={styles.appointmentsContainer}>
          <View style={styles.appointmentsHeader}>
            <ThemedText 
              style={styles.sectionTitle}
              darkColor="#fff" 
              lightColor="#fff"
            >
              Your Appointments
            </ThemedText>
            {hasMoreAppointments && (
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={toggleShowAllAppointments}
              >
                <ThemedText 
                  style={styles.viewAllText}
                  darkColor="#31E1F7" 
                  lightColor="#31E1F7"
                >
                  {showAllAppointments ? 'Show Less' : 'View All'}
                </ThemedText>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[
                styles.tab, 
                activeTab === 'upcoming' && styles.activeTab
              ]}
              onPress={() => setActiveTab('upcoming')}
            >
              <ThemedText 
                style={[
                  styles.tabText, 
                  activeTab === 'upcoming' && styles.activeTabText
                ]}
                darkColor={activeTab === 'upcoming' ? "#31E1F7" : "#EBD3F8"} 
                lightColor={activeTab === 'upcoming' ? "#31E1F7" : "#EBD3F8"}
              >
                Upcoming
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.tab, 
                activeTab === 'past' && styles.activeTab
              ]}
              onPress={() => setActiveTab('past')}
            >
              <ThemedText 
                style={[
                  styles.tabText, 
                  activeTab === 'past' && styles.activeTabText
                ]}
                darkColor={activeTab === 'past' ? "#31E1F7" : "#EBD3F8"} 
                lightColor={activeTab === 'past' ? "#31E1F7" : "#EBD3F8"}
              >
                Past
              </ThemedText>
            </TouchableOpacity>
          </View>
          
          {loadingAppointments ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#31E1F7" />
              <ThemedText 
                style={styles.loadingText}
                darkColor="#EBD3F8" 
                lightColor="#EBD3F8"
              >
                Loading appointments...
              </ThemedText>
            </View>
          ) : hasAppointments ? (
            <View style={styles.appointmentsList}>
              {displayedAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={{
                    id: appointment.id,
                    title: appointment.service?.serviceName || '',
                    provider: appointment.service?.provider?.userName || '',
                    time: new Date(appointment.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    date: new Date(appointment.appointmentDate).toLocaleDateString(),
                    location: appointment.service?.address || '',
                    status: getStatusLabel(appointment.status),
                    category: appointment.service?.category?.name || ''
                  }}
                  onCancel={() => handleCancel(appointment.id)}
                  isPast={activeTab === 'past'}
                />
              ))}
              
              {!showAllAppointments && hasMoreAppointments && (
                <TouchableOpacity 
                  style={styles.viewMoreButton}
                  onPress={toggleShowAllAppointments}
                >
                  <ThemedText 
                    style={styles.viewMoreText}
                    darkColor="#31E1F7" 
                    lightColor="#31E1F7"
                  >
                    View {filteredAppointments.length - 3} more {activeTab} appointments
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <IconSymbol
                name="calendar.badge.exclamationmark"
                size={60}
                color="rgba(235, 211, 248, 0.3)"
              />
              <ThemedText 
                style={styles.emptyStateText}
                darkColor="#EBD3F8" 
                lightColor="#EBD3F8"
              >
                No {activeTab} appointments.
              </ThemedText>
            </View>
          )}
        </View>
        
        <TouchableOpacity
          style={[styles.bookButton, { marginBottom: 10 }]}
          activeOpacity={0.8}
          onPress={handleBookNew}
        >
          <LinearGradient
            colors={["#31E1F7", "#6EDCD9"]}
            style={styles.bookButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <ThemedText
              style={styles.bookButtonText}
              lightColor="#400D51"
              darkColor="#400D51"
            >
              Book New Appointment
            </ThemedText>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

function getStatusLabel(status: AppointmentStatus): string {
  switch(status) {
    case AppointmentStatus.SCHEDULED: return 'confirmed';
    case AppointmentStatus.DONE: return 'completed';
    case AppointmentStatus.CANCELLED_BY_USER: return 'cancelled';
    case AppointmentStatus.CANCELLED_BY_SERVICE: return 'cancelled';
    case AppointmentStatus.OPEN: return 'open';
    default: return 'pending';
  }
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
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    zIndex: 1,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#31E1F7',
    backgroundColor: 'rgba(49, 225, 247, 0.1)',
  },
  greeting: {
    fontSize: responsiveFontSize(14, 12, 16),
    opacity: 0.8,
    fontFamily: fontFamilies.text,
  },
  username: {
    fontSize: responsiveFontSize(18, 16, 20),
    fontWeight: '600',
    fontFamily: fontFamilies.subtitle,
  },
  categoriesContainer: {
    marginBottom: 24,
    zIndex: 1,
  },
  sectionTitle: {
    fontSize: responsiveFontSize(20, 18, 24),
    fontWeight: '600',
    marginBottom: 16,
    fontFamily: fontFamilies.subtitle,
  },
  categoriesList: {
    paddingRight: 20,
  },
  categoryCard: {
    backgroundColor: 'rgba(174, 0, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(235, 211, 248, 0.3)',
    minWidth: 100,
    alignItems: 'center',
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: responsiveFontSize(14, 12, 16),
    fontFamily: fontFamilies.text,
    textAlign: 'center',
  },
  appointmentsContainer: {
    marginBottom: 24,
    zIndex: 1,
  },
  appointmentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    padding: 4,
  },
  viewAllText: {
    fontSize: responsiveFontSize(14, 12, 16),
    fontWeight: '600',
    fontFamily: fontFamilies.button,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(174, 0, 255, 0.15)',
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: 'rgba(49, 225, 247, 0.15)',
  },
  tabText: {
    fontSize: responsiveFontSize(14, 13, 16),
    fontWeight: '500',
    fontFamily: fontFamilies.text,
  },
  activeTabText: {
    fontWeight: '600',
    fontFamily: fontFamilies.subtitle,
  },
  appointmentsList: {
    gap: 16,
  },
  appointmentCard: {
    backgroundColor: 'rgba(174, 0, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(235, 211, 248, 0.2)',
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  appointmentTitle: {
    fontSize: responsiveFontSize(16, 14, 18),
    fontWeight: '600',
    fontFamily: fontFamilies.subtitle,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  appointmentDetails: {
    marginBottom: 16,
    gap: 8,
  },
  appointmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appointmentText: {
    fontSize: responsiveFontSize(14, 13, 16),
    fontFamily: fontFamilies.text,
  },
  appointmentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  appointmentButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  cancelButton: {
    borderColor: '#F806CC',
    backgroundColor: 'rgba(248, 6, 204, 0.1)',
  },
  buttonText: {
    fontSize: responsiveFontSize(12, 11, 14),
    fontWeight: '600',
    fontFamily: fontFamilies.button,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: responsiveFontSize(16, 14, 18),
    marginTop: 12,
    opacity: 0.6,
    fontFamily: fontFamilies.text,
  },
  bookButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#31E1F7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    marginTop: 8,
  },
  bookButtonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonText: {
    fontSize: responsiveFontSize(16, 14, 18),
    fontWeight: 'bold',
    letterSpacing: 0.5,
    fontFamily: fontFamilies.button,
  },
  statusBadgeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(244, 67, 54, 0.15)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(244, 67, 54, 0.3)',
  },
  statusBadgeText: {
    fontSize: responsiveFontSize(12, 11, 14),
    fontWeight: '500',
    fontFamily: fontFamilies.text,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: responsiveFontSize(16, 14, 18),
    marginTop: 12,
    opacity: 0.6,
    fontFamily: fontFamilies.text,
  },
  viewMoreButton: {
    padding: 12,
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: 'rgba(49, 225, 247, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(49, 225, 247, 0.3)',
    marginTop: 8,
  },
  viewMoreText: {
    fontSize: responsiveFontSize(14, 12, 16),
    fontWeight: '600',
    fontFamily: fontFamilies.button,
  },
});