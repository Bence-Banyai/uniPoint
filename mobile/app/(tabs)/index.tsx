import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  FlatList,
  Text,
  ActivityIndicator
} from 'react-native';
import { Image } from 'expo-image';  // Replace the React Native Image import
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchCategories, Category as CategoryType } from '../../services/categoryApi';
import { fetchServices, Service } from '../../services/serviceApi';
import { fetchUserAppointments, AppointmentStatus, Appointment } from '../../services/appointmentApi';
import { useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

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

const featuredBanners: BannerItem[] = [
  {
    id: 'banner1',
    title: 'Special Offer',
    description: '20% off on all haircuts this week',
    action: 'Book Now',
    image: require('@/assets/images/adaptive-icon.png'),
    colors: ['#F806CC', '#8E05C2'] as [string, string],
    route: '/appointments' as const,
    categoryId: 2 // Beauty category
  },
  {
    id: 'banner2',
    title: 'New Services',
    description: 'Try our premium massage therapy',
    action: 'Explore',
    image: require('@/assets/images/adaptive-icon.png'),
    colors: ['#31E1F7', '#2979FF'] as [string, string],
    route: '/appointments' as const,
    categoryId: 2 // Beauty category
  },
  {
    id: 'banner3',
    title: 'Health Check',
    description: 'Book your annual checkup today',
    action: 'Schedule',
    image: require('@/assets/images/adaptive-icon.png'),
    colors: ['#4CAF50', '#8BC34A'] as [string, string],
    route: '/appointments' as const,
    categoryId: 1 // Health category
  },
];

const quickAccessItems = [
  { id: 'book', title: 'Book', icon: 'chevron.right', color: '#31E1F7', action: 'book' },
  { id: 'upcoming', title: 'Upcoming', icon: 'chevron.right', color: '#4CAF50', action: 'upcoming' },
  { id: 'past', title: 'History', icon: 'chevron.right', color: '#F806CC', action: 'past' },
  { id: 'profile', title: 'Profile', icon: 'chevron.right', color: '#FF9800', action: 'profile' },
];

const recommendedServices = [
  { 
    id: '1',
    title: 'Dental Cleaning',
    provider: 'Downtown Dental Clinic',
    category: 'dentist',
    image: require('@/assets/images/adaptive-icon.png'),
    color: '#2196F3'
  },
  { 
    id: '2',
    title: 'Men\'s Haircut',
    provider: 'City Style Salon',
    category: 'barber',
    image: require('@/assets/images/adaptive-icon.png'),
    color: '#FF9800'
  },
  { 
    id: '3',
    title: 'Full Body Massage',
    provider: 'Serenity Spa & Wellness',
    category: 'massage',
    image: require('@/assets/images/adaptive-icon.png'),
    color: '#E91E63'
  },
  { 
    id: '4',
    title: 'Personal Training',
    provider: 'Fitness Center',
    category: 'trainer',
    image: require('@/assets/images/adaptive-icon.png'),
    color: '#9C27B0'
  },
];

interface BannerItem {
  id: string;
  title: string;
  description: string;
  action: string;
  image: any;
  colors: [string, string];
  route: '/appointments' | '/profile' | '/' | '/login' | '/register';
  categoryId?: number; // Add this field to link banners to categories
}

interface BannerCarouselProps {
  data: BannerItem[];
  onBannerPress: (item: BannerItem) => void;
}

interface QuickAccessItem {
  id: string;
  title: string;
  icon: string;
  color: string;
  action: string;
}

interface QuickAccessCardProps {
  item: QuickAccessItem;
  onPress: () => void;
}

interface ServiceItem {
  id: string;
  title: string;
  provider: string;
  category: string;
  image: any;
  color: string;
}

interface ServiceCardProps {
  service: Service;
  onPress: () => void;
}

// Define the type for route params
interface HomeScreenParams {
  refresh?: number | string;
}

// Helper function to get gradient colors based on category ID
const getCategoryGradient = (categoryId: number): [string, string] => {
  const gradients: {[key: number]: [string, string]} = {
    1: ['#4CAF50', '#8BC34A'],   // Health
    2: ['#E91E63', '#F44336'],   // Beauty
    3: ['#2196F3', '#03A9F4'],   // Fitness
    4: ['#FF9800', '#FF5722'],   // Auto
    5: ['#9C27B0', '#673AB7'],   // Legal
    6: ['#3F51B5', '#2196F3'],   // Education
    7: ['#607D8B', '#455A64'],   // Tech
    8: ['#009688', '#4CAF50'],   // Cleaning
  };
  
  return gradients[categoryId] || ['#AE00FF', '#F806CC'];
};

// Add this function after getCategoryGradient
const getCategoryColor = (categoryId: number): string => {
  const colors: {[key: number]: string} = {
    1: '#4CAF50', // Health
    2: '#E91E63', // Beauty
    3: '#2196F3', // Fitness
    4: '#FF9800', // Auto
    5: '#9C27B0', // Legal
    6: '#3F51B5', // Education
    7: '#607D8B',   // Tech
    8: '#009688',   // Cleaning
  };
  
  return colors[categoryId] || '#AE00FF';
};

function BannerCarousel({ data, onBannerPress }: BannerCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<BannerItem>>(null);
  const screenWidth = Dimensions.get('window').width;
  const bannerWidth = screenWidth - 40; // Account for padding
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  
  useEffect(() => {
    if (data.length <= 1 || !isAutoScrolling) return;
    
    const interval = setInterval(() => {
      if (flatListRef.current) {
        const nextIndex = (activeIndex + 1) % data.length;
        flatListRef.current.scrollToOffset({
          animated: true,
          offset: nextIndex * bannerWidth,
        });
        setActiveIndex(nextIndex);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [activeIndex, bannerWidth, data.length, isAutoScrolling]);
  
  const handleScroll = (event: { nativeEvent: { contentOffset: { x: number } } }) => {
    if (!isAutoScrolling) return;
    
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / bannerWidth);
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < data.length) {
      setActiveIndex(newIndex);
    }
  };

  const getItemLayout = (_: any, index: number) => ({
    length: bannerWidth,
    offset: bannerWidth * index,
    index,
  });
  
  const handleBannerPress = (item: BannerItem) => {
    onBannerPress(item); // This was missing - now it will call the parent handler
  };
  
  const renderBanner = ({ item }: { item: BannerItem }) => (
    <TouchableOpacity 
      style={[styles.bannerContainer, { width: bannerWidth }]}
      activeOpacity={0.8}
      onPress={() => handleBannerPress(item)} // Call local handler which calls parent
    >
      <LinearGradient
        colors={item.colors}
        style={styles.bannerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.bannerContent}>
          <View style={styles.bannerTextContainer}>
            <ThemedText 
              style={styles.bannerTitle}
              darkColor="#fff" 
              lightColor="#fff"
            >
              {item.title}
            </ThemedText>
            <ThemedText 
              style={styles.bannerDescription}
              darkColor="#fff" 
              lightColor="#fff"
            >
              {item.description}
            </ThemedText>
            <View style={styles.actionButtonContainer}>
              <ThemedText 
                style={styles.actionButtonText}
                darkColor="#fff" 
                lightColor="#fff"
              >
                {item.action}
              </ThemedText>
              <IconSymbol name="chevron.right" size={16} color="#fff" />
            </View>
          </View>
          <Image 
            source={item.image}
            style={styles.bannerImage}
            resizeMode="contain"
          />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
  
  const handleScrollToIndexFailed = (info: { 
    index: number;
    highestMeasuredFrameIndex: number;
    averageItemLength: number;
  }) => {
    const wait = new Promise(resolve => setTimeout(resolve, 500));
    wait.then(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToOffset({
          offset: info.index * bannerWidth,
          animated: true
        });
      }
    });
  };

  return (
    <View style={styles.carouselContainer}>
      <FlatList<BannerItem>
        ref={flatListRef}
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderBanner}
        keyExtractor={item => item.id}
        onScroll={handleScroll}
        onScrollToIndexFailed={handleScrollToIndexFailed}
        getItemLayout={getItemLayout}
        snapToAlignment="center"
        snapToInterval={bannerWidth}
        decelerationRate="fast"
        contentContainerStyle={{ paddingRight: 20 }}
      />
      
      {data.length > 1 && (
        <View style={styles.paginationContainer}>
          {data.map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.paginationDot,
                index === activeIndex && styles.paginationDotActive
              ]} 
            />
          ))}
        </View>
      )}
    </View>
  );
}

function QuickAccessCard({ item, onPress }: QuickAccessCardProps) {
  return (
    <TouchableOpacity 
      style={[styles.quickAccessCard, { backgroundColor: `${item.color}20` }]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={[styles.quickAccessIconContainer, { backgroundColor: `${item.color}30` }]}>
        <IconSymbol name="chevron.right" size={24} color={item.color} />
      </View>
      <ThemedText 
        style={styles.quickAccessTitle}
        darkColor="#EBD3F8" 
        lightColor="#EBD3F8"
      >
        {item.title}
      </ThemedText>
    </TouchableOpacity>
  );
}

function ServiceCard({ service, onPress }: { service: Service; onPress: () => void }) {
  const color = getCategoryColor(service.categoryId);
  
  return (
    <TouchableOpacity 
      style={styles.serviceCard}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={[styles.serviceImageContainer, { borderColor: color }]}>
        {service.imageUrls && service.imageUrls.length > 0 ? (
          <Image 
            source={{ uri: service.imageUrls[0] }}
            style={{
              width: 66, // Increase from 40 to better fill the 70px container
              height: 66, // Increase from 40 to better fill the 70px container
              borderRadius: 33, // Half of width/height for perfect circle
              overflow: 'hidden'
            }}
            contentFit="cover"
          />
        ) : (
          <IconSymbol name="chevron.right" size={24} color={color} />
        )}
      </View>
      <ThemedText 
        style={styles.serviceTitle}
        darkColor="#fff" 
        lightColor="#fff"
      >
        {service.serviceName}
      </ThemedText>
      <ThemedText 
        style={styles.serviceProvider}
        darkColor="#EBD3F8" 
        lightColor="#EBD3F8"
      >
        {service.provider ? service.provider.userName : 'Unknown Provider'}
      </ThemedText>
    </TouchableOpacity>
  );
}

function MyComponent() {
  const { userName, email } = useAuth();
  
  return (
    <View>
      <Text>Welcome, {userName || 'User'}!</Text>
      <Text>Email: {email || 'N/A'}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const route = useRoute<RouteProp<{ params: HomeScreenParams }, 'params'>>();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { userName } = useAuth();
  const [isWeb] = useState(Platform.OS === 'web');
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [nextAppointment, setNextAppointment] = useState<any | null>(null);
  const [loadingNextAppointment, setLoadingNextAppointment] = useState(true);
  
  const loadNextAppointment = async () => {
    try {
      setLoadingNextAppointment(true);
      const userAppointments = await fetchUserAppointments();
      
      const scheduledAppointments = userAppointments.filter((appt: Appointment) => 
        appt.status === AppointmentStatus.SCHEDULED
      );
      
      const sortedAppointments = scheduledAppointments.sort((a: Appointment, b: Appointment) => 
        new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()
      );
      
      const nextScheduled = sortedAppointments.length > 0 ? sortedAppointments[0] : null;
      setNextAppointment(nextScheduled);
    } catch (err) {
      console.error('Failed to load next appointment:', err);
    } finally {
      setLoadingNextAppointment(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingCategories(true);
        setLoadingServices(true);
        
        const [categoriesData, servicesData] = await Promise.all([
          fetchCategories(),
          fetchServices()
        ]);
        
        setCategories(categoriesData);
        
        const sortedServices = servicesData.sort((a, b) => b.price - a.price);
        setServices(sortedServices.slice(0, 5));
        
        // Always reload the next appointment data when the effect runs
        await loadNextAppointment();
        
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoadingCategories(false);
        setLoadingServices(false);
      }
    };

    loadData();
  }, [route.params]); // Use route.params directly without drilling into it

  useFocusEffect(
    useCallback(() => {
      // Check if we should refresh when tab becomes focused
      const checkRefreshFlag = async () => {
        try {
          const shouldRefresh = await AsyncStorage.getItem('shouldRefreshHomeScreen');
          if (shouldRefresh === 'true') {
            // Clear the flag
            await AsyncStorage.setItem('shouldRefreshHomeScreen', 'false');
            // Refresh the appointment data
            loadNextAppointment();
          }
        } catch (error) {
          console.log('Error checking refresh flag:', error);
        }
      };

      checkRefreshFlag();
      
      return () => {
        // Cleanup if needed
      };
    }, [])
  );

  const screenWidth = Dimensions.get('window').width;
  const isSmallDevice = screenWidth < 380;
  const isLargeDevice = screenWidth >= 768;
  
  const handleQuickAccess = (action: string) => {
    switch(action) {
      case 'book':
        router.push('/(tabs)/search');
        break;
      case 'upcoming':
        router.push('/(tabs)/appointments');
        break;
      case 'past':
        router.push('/(tabs)/appointments');
        break;
      case 'profile':
        router.push('/(tabs)/profile');
        break;
      default:
        console.log(`Action: ${action}`);
    }
  };
  
  const handleServicePress = (service: Service) => {
    console.log(`Selected service: ${service.serviceName}`);
    router.push({
      pathname: '/appointments',
      params: { serviceId: service.serviceId.toString() }
    });
  };
  
  const handleSeeAllServices = () => {
    router.push('/appointments');
  };

  const handleBannerPress = (banner: BannerItem) => {
    if (banner.categoryId) {
      router.push({
        pathname: '/(tabs)/search',
        params: { categoryId: banner.categoryId.toString() }
      });
    } else {
      const route = banner.route === '/appointments' ? '/(tabs)/search' : banner.route;
      
      if (isWeb) {
        setTimeout(() => {
          router.push(route);
        }, 300);
      } else {
        router.push(route);
      }
    }
  };

  const renderNextAppointment = () => {
    if (loadingNextAppointment) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#31E1F7" />
          <ThemedText 
            style={styles.loadingText}
            darkColor="#EBD3F8" 
            lightColor="#EBD3F8"
          >
            Loading next appointment...
          </ThemedText>
        </View>
      );
    }

    if (!nextAppointment) {
      return (
        <View style={styles.emptyAppointmentContainer}>
          <IconSymbol name="calendar.badge.exclamationmark" size={40} color="rgba(235, 211, 248, 0.3)" />
          <ThemedText 
            style={styles.emptyAppointmentText}
            darkColor="#EBD3F8" 
            lightColor="#EBD3F8"
          >
            No upcoming appointments
          </ThemedText>
          <TouchableOpacity 
            style={styles.bookNowButton}
            onPress={() => router.push('/(tabs)/search')}
          >
            <ThemedText 
              style={styles.bookNowText}
              darkColor="#31E1F7" 
              lightColor="#31E1F7"
            >
              Book Now
            </ThemedText>
          </TouchableOpacity>
        </View>
      );
    }

    const categoryColor = getCategoryColor(nextAppointment.service?.categoryId || 0);
    
    const appointmentDate = new Date(nextAppointment.appointmentDate);
    const dateStr = appointmentDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    const timeStr = appointmentDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    return (
      <TouchableOpacity 
        style={styles.nextAppointmentCard}
        activeOpacity={0.7}
        onPress={() => router.push('/(tabs)/appointments')}
      >
        <View style={[styles.appointmentColorBar, { backgroundColor: categoryColor }]} />
        <View style={styles.appointmentContent}>
          <View style={styles.appointmentHeader}>
            <ThemedText 
              style={styles.appointmentTitle}
              darkColor="#fff" 
              lightColor="#fff"
            >
              {nextAppointment.service?.serviceName || "Appointment"}
            </ThemedText>
            <View style={[styles.statusIndicator, { backgroundColor: categoryColor }]} />
          </View>
          
          <View style={styles.appointmentDetails}>
            <View style={styles.appointmentInfo}>
              <IconSymbol name="chevron.right" size={16} color="#31E1F7" />
              <ThemedText 
                style={styles.appointmentText}
                darkColor="#EBD3F8" 
                lightColor="#EBD3F8"
              >
                {nextAppointment.service?.provider?.userName || "Unknown Provider"}
              </ThemedText>
            </View>
            
            <View style={styles.appointmentInfo}>
              <IconSymbol name="chevron.right" size={16} color="#31E1F7" />
              <ThemedText 
                style={styles.appointmentText}
                darkColor="#EBD3F8" 
                lightColor="#EBD3F8"
              >
                {dateStr} • {timeStr}
              </ThemedText>
            </View>
            
            <View style={styles.appointmentInfo}>
              <IconSymbol name="chevron.right" size={16} color="#31E1F7" />
              <ThemedText 
                style={styles.appointmentText}
                darkColor="#EBD3F8" 
                lightColor="#EBD3F8"
              >
                {nextAppointment.service?.address || "No location specified"}
              </ThemedText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
            <Image 
              source={require('@/assets/images/adaptive-icon.png')}
              style={styles.avatar}
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
        
        <BannerCarousel 
          data={featuredBanners} 
          onBannerPress={handleBannerPress}
        />
        
        <View style={styles.nextAppointmentContainer}>
          <ThemedText 
            style={styles.sectionTitle}
            darkColor="#fff" 
            lightColor="#fff"
          >
            Next Appointment
          </ThemedText>
          {renderNextAppointment()}
        </View>
        
        <View style={styles.categoriesContainer}>
          <View style={styles.sectionHeader}>
            <ThemedText 
              style={styles.sectionTitle}
              darkColor="#fff" 
              lightColor="#fff"
            >
              Categories
            </ThemedText>
            <TouchableOpacity onPress={() => router.push('/search')}>
              <ThemedText 
                style={styles.seeAllText}
                darkColor="#31E1F7" 
                lightColor="#31E1F7"
              >
                See All
              </ThemedText>
            </TouchableOpacity>
          </View>
          
          {loadingCategories ? (
            <ActivityIndicator size="large" color="#31E1F7" />
          ) : (
            <View style={styles.categoriesGrid}>
              {categories.slice(0, 5).map((category) => (
                <TouchableOpacity 
                  key={category.categoryId}
                  style={styles.categoryButton}
                  onPress={() => router.push({
                    pathname: '/search',
                    params: { categoryId: category.categoryId.toString() }
                  })}
                >
                  <LinearGradient
                    colors={getCategoryGradient(category.categoryId)}
                    style={styles.categoryIcon}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.iconContainer}>
                      <Image 
                        source={{ uri: category.iconUrl }}
                        style={{
                          width: 60, // Increase from 32 to better fill the 64px container
                          height: 60, // Increase from 32 to better fill the 64px container
                          borderRadius: 30, // Half of width/height
                          overflow: 'hidden'
                        }}
                        contentFit="cover"
                        contentPosition="center"
                      />
                    </View>
                  </LinearGradient>
                  <ThemedText 
                    style={styles.categoryLabel}
                    darkColor="#EBD3F8" 
                    lightColor="#EBD3F8"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {category.name}
                  </ThemedText>
                </TouchableOpacity>
              ))}
              
              <TouchableOpacity 
                style={styles.categoryButton}
                onPress={() => router.push('/search')}
              >
                <LinearGradient
                  colors={['#9C27B0', '#673AB7']}
                  style={[styles.categoryIcon, styles.moreIcon]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.iconContainer}>
                    <IconSymbol name="chevron.right" size={28} color="#fff" />
                  </View>
                </LinearGradient>
                <ThemedText 
                  style={styles.categoryLabel}
                  darkColor="#EBD3F8" 
                  lightColor="#EBD3F8"
                >
                  More
                </ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        <View style={styles.servicesContainer}>
          <View style={styles.sectionHeader}>
            <ThemedText 
              style={styles.sectionTitle}
              darkColor="#fff" 
              lightColor="#fff"
            >
              Popular Services
            </ThemedText>
            <TouchableOpacity onPress={() => router.push('/search')}>
              <ThemedText 
                style={styles.seeAllText}
                darkColor="#31E1F7" 
                lightColor="#31E1F7"
              >
                See All
              </ThemedText>
            </TouchableOpacity>
          </View>
          
          {loadingServices ? (
            <ActivityIndicator size="large" color="#31E1F7" />
          ) : services.length === 0 ? (
            <ThemedText 
              style={[styles.serviceProvider, { textAlign: 'left', marginLeft: 10 }]}
              darkColor="#EBD3F8" 
              lightColor="#EBD3F8"
            >
              No services available
            </ThemedText>
          ) : (
            <FlatList
              data={services}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.servicesList}
              renderItem={({ item }) => (
                <ServiceCard 
                  service={item}
                  onPress={() => handleServicePress(item)} 
                />
              )}
              keyExtractor={(item) => item.serviceId.toString()}
              ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
            />
          )}
        </View>
        
        <TouchableOpacity
          style={[styles.bookButton, { marginBottom: 10, marginTop: 20 }]}
          activeOpacity={0.8}
          onPress={() => router.push('/(tabs)/search')}
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

const styles = StyleSheet.create({
  quickAccessCard: {
    backgroundColor: 'rgba(174, 0, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    width: '48%',
    marginBottom: 16,
  },
  quickAccessIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickAccessTitle: {
    fontSize: responsiveFontSize(16, 14, 18),
    fontWeight: '500',
    fontFamily: fontFamilies.subtitle,
  },
  
  carouselContainer: {
    marginBottom: 24,
    height: 160,
  },
  bannerContainer: {
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 10,
  },
  bannerGradient: {
    flex: 1,
    padding: 16,
  },
  bannerContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  bannerTitle: {
    fontSize: responsiveFontSize(18, 16, 22),
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: fontFamilies.subtitle,
  },
  bannerDescription: {
    fontSize: responsiveFontSize(14, 13, 16),
    marginBottom: 12,
    opacity: 0.9,
    fontFamily: fontFamilies.text,
  },
  actionButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: responsiveFontSize(14, 12, 16),
    fontWeight: '600',
    marginRight: 4,
    fontFamily: fontFamilies.button,
  },
  bannerImage: {
    width: 80,
    height: 80,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(235, 211, 248, 0.3)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#31E1F7',
    width: 16,
  },
  
  categoriesContainer: {
    marginBottom: 24,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryButton: {
    width: '31%',  // Slightly wider to better fit on the screen
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  moreIcon: {
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(108, 29, 146, 0.2)', 
  },
  categoryLabel: {
    fontSize: responsiveFontSize(12, 11, 14),
    fontFamily: fontFamilies.text,
    textAlign: 'center',
    width: '100%',  // This ensures text alignment works properly
    paddingHorizontal: 2,  // Adds some padding for longer text
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
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
  nextAppointmentContainer: {
    marginBottom: 24,
  },
  nextAppointmentCard: {
    backgroundColor: 'rgba(174, 0, 255, 0.1)',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(235, 211, 248, 0.2)',
    flexDirection: 'row',
  },
  appointmentColorBar: {
    width: 4,
    height: '100%',
  },
  appointmentContent: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: responsiveFontSize(20, 18, 24),
    fontWeight: '600',
    marginBottom: 16,
    fontFamily: fontFamilies.subtitle,
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
  servicesContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: responsiveFontSize(14, 12, 16),
    fontWeight: '600',
    fontFamily: fontFamilies.button,
  },
  servicesList: {
    paddingRight: 20,
  },
  serviceCard: {
    backgroundColor: 'rgba(174, 0, 255, 0.1)',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(235, 211, 248, 0.2)',
    width: 160,
    alignItems: 'center',
  },
  serviceImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    marginBottom: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  serviceImage: {
    width: 40,
    height: 40,
  },
  serviceTitle: {
    fontSize: responsiveFontSize(14, 13, 16),
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
    fontFamily: fontFamilies.subtitle,
  },
  serviceProvider: {
    fontSize: responsiveFontSize(12, 11, 14),
    opacity: 0.7,
    textAlign: 'center',
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: 'rgba(174, 0, 255, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(235, 211, 248, 0.2)',
  },
  loadingText: {
    fontSize: responsiveFontSize(14, 13, 16),
    marginTop: 10,
    fontFamily: fontFamilies.text,
  },
  emptyAppointmentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    backgroundColor: 'rgba(174, 0, 255, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(235, 211, 248, 0.2)',
  },
  emptyAppointmentText: {
    fontSize: responsiveFontSize(15, 14, 17),
    marginTop: 10,
    marginBottom: 15,
    fontFamily: fontFamilies.text,
  },
  bookNowButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(49, 225, 247, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(49, 225, 247, 0.3)',
  },
  bookNowText: {
    fontSize: responsiveFontSize(14, 12, 16),
    fontWeight: '600',
    fontFamily: fontFamilies.button,
  },
});