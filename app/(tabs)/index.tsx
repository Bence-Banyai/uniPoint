import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  FlatList
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useState, useRef, useEffect } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

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

// Featured banners data
const featuredBanners = [
  {
    id: 'banner1',
    title: 'Special Offer',
    description: '20% off on all haircuts this week',
    action: 'Book Now',
    image: require('@/assets/images/adaptive-icon.png'),
    colors: ['#F806CC', '#8E05C2'],
    route: '/appointments'
  },
  {
    id: 'banner2',
    title: 'New Services',
    description: 'Try our premium massage therapy',
    action: 'Explore',
    image: require('@/assets/images/adaptive-icon.png'),
    colors: ['#31E1F7', '#2979FF'],
    route: '/appointments'
  },
  {
    id: 'banner3',
    title: 'Health Check',
    description: 'Book your annual checkup today',
    action: 'Schedule',
    image: require('@/assets/images/adaptive-icon.png'),
    colors: ['#4CAF50', '#8BC34A'],
    route: '/appointments'
  },
];

// Quick access categories
const quickAccessItems = [
  { id: 'book', title: 'Book', icon: 'chevron.right', color: '#31E1F7', action: 'book' },
  { id: 'upcoming', title: 'Upcoming', icon: 'chevron.right', color: '#4CAF50', action: 'upcoming' },
  { id: 'past', title: 'History', icon: 'chevron.right', color: '#F806CC', action: 'past' },
  { id: 'profile', title: 'Profile', icon: 'chevron.right', color: '#FF9800', action: 'profile' },
];

// Recommended services
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

// Next appointment data (could be fetched from your database)
const nextAppointment = {
  id: '1',
  title: 'General Checkup',
  provider: 'Dr. Sarah Johnson',
  time: '10:00 AM',
  date: 'Today, 18 Mar',
  location: 'Grand Medical Center',
  status: 'confirmed',
  category: 'doctor',
  color: '#4CAF50'
};

// Banner carousel component
function BannerCarousel({ data, onBannerPress }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  const screenWidth = Dimensions.get('window').width;
  const bannerWidth = screenWidth - 40; // Account for padding
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  
  // Auto scroll with manual approach instead of scrollToIndex
  useEffect(() => {
    if (data.length <= 1 || !isAutoScrolling) return; // Don't auto-scroll if only one banner
    
    const interval = setInterval(() => {
      if (flatListRef.current) {
        const nextIndex = (activeIndex + 1) % data.length;
        // Use scrollTo with calculated offset instead of scrollToIndex
        flatListRef.current.scrollToOffset({
          animated: true,
          offset: nextIndex * bannerWidth,
        });
        setActiveIndex(nextIndex);
      }
    }, 5000); // Change banner every 5 seconds
    
    return () => clearInterval(interval);
  }, [activeIndex, bannerWidth, isAutoScrolling]);
  
  const handleScroll = (event) => {
    if (!isAutoScrolling) return;
    
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / bannerWidth);
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < data.length) {
      setActiveIndex(newIndex);
    }
  };

  // Calculate item layout for better performance
  const getItemLayout = (_, index) => ({
    length: bannerWidth,
    offset: bannerWidth * index,
    index,
  });
  
  const handleBannerPress = (item) => {
    // Temporarily pause auto-scrolling
    setIsAutoScrolling(false);
    
    // Handle the press event
    onBannerPress(item);
    
    // Resume auto-scrolling after a delay
    setTimeout(() => {
      setIsAutoScrolling(true);
    }, 500);
  };
  
  const renderBanner = ({ item }) => (
    <TouchableOpacity 
      style={[styles.bannerContainer, { width: bannerWidth }]}
      activeOpacity={0.8}
      onPress={() => handleBannerPress(item)}
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
  
  // Handle scroll failures gracefully
  const handleScrollToIndexFailed = (info) => {
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
      <FlatList
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
      
      {/* Pagination dots */}
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

function QuickAccessCard({ item, onPress }) {
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

function ServiceCard({ service, onPress }) {
  return (
    <TouchableOpacity 
      style={styles.serviceCard}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={[styles.serviceImageContainer, { borderColor: service.color }]}>
        <Image 
          source={service.image}
          style={styles.serviceImage}
          resizeMode="cover"
        />
      </View>
      <ThemedText 
        style={styles.serviceTitle}
        darkColor="#fff" 
        lightColor="#fff"
      >
        {service.title}
      </ThemedText>
      <ThemedText 
        style={styles.serviceProvider}
        darkColor="#EBD3F8" 
        lightColor="#EBD3F8"
      >
        {service.provider}
      </ThemedText>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const [isWeb] = useState(Platform.OS === 'web');
  
  // Calculate responsive sizes
  const screenWidth = Dimensions.get('window').width;
  const isSmallDevice = screenWidth < 380;
  const isLargeDevice = screenWidth >= 768;
  
  const handleQuickAccess = (action) => {
    switch(action) {
      case 'book':
        router.push('/appointments');
        break;
      case 'upcoming':
        router.push('/appointments');
        break;
      case 'past':
        router.push('/appointments');
        break;
      case 'profile':
        router.push('/profile');
        break;
      default:
        console.log(`Action: ${action}`);
    }
  };
  
  const handleServicePress = (service) => {
    console.log(`Selected service: ${service.title}`);
    // Navigate to booking for this specific service
  };
  
  const handleSeeAllServices = () => {
    router.push('/appointments');
  };

  const handleBannerPress = (banner) => {
    // On web, add a small delay before navigation to allow the tap/click animation to show
    if (isWeb) {
      setTimeout(() => {
        router.push(banner.route);
      }, 300);
    } else {
      // On native, navigate immediately
      router.push(banner.route);
    }
  };

  return (
    <LinearGradient
      colors={["#2E0249", "#570A57", "#A91079"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Background elements */}
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
        {/* Header with profile and notification */}
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
                John Doe
              </ThemedText>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <View style={styles.notificationBadge} />
            <IconSymbol 
              name="chevron.right" 
              size={24} 
              color="#EBD3F8" 
            />
          </TouchableOpacity>
        </View>
        
        {/* Featured banners carousel (replaces quick access grid) */}
        <BannerCarousel 
          data={featuredBanners} 
          onBannerPress={handleBannerPress}
        />
        
        {/* Next appointment section */}
        <View style={styles.nextAppointmentContainer}>
          <ThemedText 
            style={styles.sectionTitle}
            darkColor="#fff" 
            lightColor="#fff"
          >
            Next Appointment
          </ThemedText>
          
          <TouchableOpacity 
            style={styles.nextAppointmentCard}
            activeOpacity={0.7}
            onPress={() => router.push('/appointments')}
          >
            <View style={[styles.appointmentColorBar, { backgroundColor: nextAppointment.color }]} />
            <View style={styles.appointmentContent}>
              <View style={styles.appointmentHeader}>
                <ThemedText 
                  style={styles.appointmentTitle}
                  darkColor="#fff" 
                  lightColor="#fff"
                >
                  {nextAppointment.title}
                </ThemedText>
                <View style={[styles.statusIndicator, { backgroundColor: nextAppointment.color }]} />
              </View>
              
              <View style={styles.appointmentDetails}>
                <View style={styles.appointmentInfo}>
                  <IconSymbol name="chevron.right" size={16} color="#31E1F7" />
                  <ThemedText 
                    style={styles.appointmentText}
                    darkColor="#EBD3F8" 
                    lightColor="#EBD3F8"
                  >
                    {nextAppointment.provider}
                  </ThemedText>
                </View>
                
                <View style={styles.appointmentInfo}>
                  <IconSymbol name="chevron.right" size={16} color="#31E1F7" />
                  <ThemedText 
                    style={styles.appointmentText}
                    darkColor="#EBD3F8" 
                    lightColor="#EBD3F8"
                  >
                    {nextAppointment.date} • {nextAppointment.time}
                  </ThemedText>
                </View>
                
                <View style={styles.appointmentInfo}>
                  <IconSymbol name="chevron.right" size={16} color="#31E1F7" />
                  <ThemedText 
                    style={styles.appointmentText}
                    darkColor="#EBD3F8" 
                    lightColor="#EBD3F8"
                  >
                    {nextAppointment.location}
                  </ThemedText>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Categories section */}
        <View style={styles.categoriesContainer}>
          <ThemedText 
            style={styles.sectionTitle}
            darkColor="#fff" 
            lightColor="#fff"
          >
            Categories
          </ThemedText>
          
          <View style={styles.categoriesGrid}>
            <TouchableOpacity 
              style={styles.categoryButton}
              onPress={() => router.push('/appointments')}
            >
              <LinearGradient
                colors={['#4CAF50', '#8BC34A']}
                style={styles.categoryIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <IconSymbol name="chevron.right" size={24} color="#fff" />
              </LinearGradient>
              <ThemedText 
                style={styles.categoryLabel}
                darkColor="#EBD3F8" 
                lightColor="#EBD3F8"
              >
                Doctor
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.categoryButton}
              onPress={() => router.push('/appointments')}
            >
              <LinearGradient
                colors={['#2196F3', '#03A9F4']}
                style={styles.categoryIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <IconSymbol name="chevron.right" size={24} color="#fff" />
              </LinearGradient>
              <ThemedText 
                style={styles.categoryLabel}
                darkColor="#EBD3F8" 
                lightColor="#EBD3F8"
              >
                Dentist
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.categoryButton}
              onPress={() => router.push('/appointments')}
            >
              <LinearGradient
                colors={['#FF9800', '#FF5722']}
                style={styles.categoryIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <IconSymbol name="chevron.right" size={24} color="#fff" />
              </LinearGradient>
              <ThemedText 
                style={styles.categoryLabel}
                darkColor="#EBD3F8" 
                lightColor="#EBD3F8"
              >
                Barber
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.categoryButton}
              onPress={() => router.push('/appointments')}
            >
              <LinearGradient
                colors={['#9C27B0', '#673AB7']}
                style={styles.categoryIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <IconSymbol name="chevron.right" size={24} color="#fff" />
              </LinearGradient>
              <ThemedText 
                style={styles.categoryLabel}
                darkColor="#EBD3F8" 
                lightColor="#EBD3F8"
              >
                Trainer
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.categoryButton}
              onPress={() => router.push('/appointments')}
            >
              <LinearGradient
                colors={['#E91E63', '#F44336']}
                style={styles.categoryIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <IconSymbol name="chevron.right" size={24} color="#fff" />
              </LinearGradient>
              <ThemedText 
                style={styles.categoryLabel}
                darkColor="#EBD3F8" 
                lightColor="#EBD3F8"
              >
                Massage
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.categoryButton}
              onPress={() => router.push('/appointments')}
            >
              <LinearGradient
                colors={['#607D8B', '#455A64']}
                style={styles.categoryIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <IconSymbol name="chevron.right" size={24} color="#fff" />
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
        </View>
        
        {/* Recommended services section */}
        <View style={styles.servicesContainer}>
          <View style={styles.sectionHeader}>
            <ThemedText 
              style={styles.sectionTitle}
              darkColor="#fff" 
              lightColor="#fff"
            >
              Popular Services
            </ThemedText>
            <TouchableOpacity onPress={handleSeeAllServices}>
              <ThemedText 
                style={styles.seeAllText}
                darkColor="#31E1F7" 
                lightColor="#31E1F7"
              >
                See All
              </ThemedText>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={recommendedServices}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.servicesList}
            renderItem={({ item }) => (
              <ServiceCard 
                service={item}
                onPress={() => handleServicePress(item)} 
              />
            )}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
          />
        </View>
        
        {/* Book appointment button */}
        <TouchableOpacity
          style={[styles.bookButton, { marginBottom: 10, marginTop: 20 }]}
          activeOpacity={0.8}
          onPress={() => router.push('/appointments')}
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
  // Keep existing styles...
  
  // New styles for the banner carousel
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
  
  // New styles for categories
  categoriesContainer: {
    marginBottom: 24,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryButton: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: responsiveFontSize(12, 11, 14),
    fontFamily: fontFamilies.text,
    textAlign: 'center',
  },
  
  // Keep all other styles...
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
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(174, 0, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F44336',
    zIndex: 1,
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
});