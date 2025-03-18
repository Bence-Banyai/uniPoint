import {
  StyleSheet,
  Image,
  Platform,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ScrollView
} from 'react-native';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

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

// Sample data for popular searches
const popularSearches = [
  'Dentist', 'Hair Salon', 'Massage', 'Gym Trainer', 'Doctor', 'Spa'
];

// Sample data for providers
const providers = [
  {
    id: '1',
    name: 'Grand Medical Center',
    category: 'doctor',
    rating: 4.9,
    reviews: 127,
    distance: '1.2',
    image: require('@/assets/images/adaptive-icon.png'),
    color: '#4CAF50'
  },
  {
    id: '2',
    name: 'Downtown Dental Clinic',
    category: 'dentist',
    rating: 4.7,
    reviews: 98,
    distance: '0.8',
    image: require('@/assets/images/adaptive-icon.png'),
    color: '#2196F3'
  },
  {
    id: '3',
    name: 'City Style Salon',
    category: 'barber',
    rating: 4.8,
    reviews: 156,
    distance: '1.5',
    image: require('@/assets/images/adaptive-icon.png'),
    color: '#FF9800'
  },
  {
    id: '4',
    name: 'Serenity Spa & Wellness',
    category: 'massage',
    rating: 4.9,
    reviews: 210,
    distance: '2.3',
    image: require('@/assets/images/adaptive-icon.png'),
    color: '#E91E63'
  },
  {
    id: '5',
    name: 'Fitness Center',
    category: 'trainer',
    rating: 4.6,
    reviews: 89,
    distance: '1.7',
    image: require('@/assets/images/adaptive-icon.png'),
    color: '#9C27B0'
  },
];

// Category mapping
const categories = {
  doctor: { name: 'Doctor', color: '#4CAF50' },
  dentist: { name: 'Dentist', color: '#2196F3' },
  barber: { name: 'Barber', color: '#FF9800' },
  massage: { name: 'Massage', color: '#E91E63' },
  trainer: { name: 'Trainer', color: '#9C27B0' },
};

// Provider card component
function ProviderCard({ provider, onPress }) {
  return (
    <TouchableOpacity 
      style={styles.providerCard}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.providerHeader}>
        <View style={[styles.providerImageContainer, { borderColor: provider.color }]}>
          <Image 
            source={provider.image}
            style={styles.providerImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.providerInfo}>
          <ThemedText 
            style={styles.providerName}
            darkColor="#fff" 
            lightColor="#fff"
          >
            {provider.name}
          </ThemedText>
          <View style={styles.categoryBadge}>
            <ThemedText 
              style={styles.categoryText}
              darkColor="#fff" 
              lightColor="#fff"
            >
              {categories[provider.category].name}
            </ThemedText>
          </View>
        </View>
      </View>
      
      <View style={styles.providerDetails}>
        <View style={styles.ratingContainer}>
          <IconSymbol name="chevron.right" size={16} color="#FFD700" />
          <ThemedText 
            style={styles.ratingText}
            darkColor="#EBD3F8" 
            lightColor="#EBD3F8"
          >
            {provider.rating} ({provider.reviews} reviews)
          </ThemedText>
        </View>
        <View style={styles.distanceContainer}>
          <IconSymbol name="chevron.right" size={16} color="#31E1F7" />
          <ThemedText 
            style={styles.distanceText}
            darkColor="#EBD3F8" 
            lightColor="#EBD3F8"
          >
            {provider.distance} miles away
          </ThemedText>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.bookButton}
        activeOpacity={0.7}
        onPress={onPress}
      >
        <LinearGradient
          colors={[provider.color, provider.color + '99']}
          style={styles.bookButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <ThemedText 
            style={styles.bookButtonText}
            darkColor="#fff" 
            lightColor="#fff"
          >
            Book Appointment
          </ThemedText>
        </LinearGradient>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState(['Haircut', 'Dental Cleaning']);
  
  // Calculate responsive sizes
  const screenWidth = Dimensions.get('window').width;
  const isSmallDevice = screenWidth < 380;
  const isLargeDevice = screenWidth >= 768;
  
  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Add to recent searches if not already included
      if (!recentSearches.includes(searchQuery.trim())) {
        setRecentSearches(prev => [searchQuery.trim(), ...prev.slice(0, 4)]);
      }
      console.log(`Searching for: ${searchQuery}`);
      // Actual search functionality would go here
    }
  };
  
  const handlePopularSearch = (term) => {
    setSearchQuery(term);
    handleSearch();
  };
  
  const handleProviderPress = (provider) => {
    console.log(`Selected provider: ${provider.name}`);
    router.push('/appointments');
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
        {/* Header with title */}
        <View style={styles.header}>
          <ThemedText 
            style={styles.headerTitle}
            darkColor="#fff" 
            lightColor="#fff"
          >
            Explore
          </ThemedText>
        </View>
        
        {/* Search bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <IconSymbol name="chevron.right" size={20} color="#EBD3F8" style={styles.searchIcon} />
            <TextInput
              placeholder="Search for services, providers..."
              placeholderTextColor="rgba(235, 211, 248, 0.6)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
              onSubmitEditing={handleSearch}
              selectionColor="#31E1F7"
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                onPress={() => setSearchQuery('')}
                style={styles.clearButton}
              >
                <IconSymbol name="chevron.right" size={16} color="#EBD3F8" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {/* Recent searches */}
        {recentSearches.length > 0 && (
          <View style={styles.recentSearchesContainer}>
            <View style={styles.sectionHeader}>
              <ThemedText 
                style={styles.sectionTitle}
                darkColor="#fff" 
                lightColor="#fff"
              >
                Recent Searches
              </ThemedText>
              <TouchableOpacity onPress={() => setRecentSearches([])}>
                <ThemedText 
                  style={styles.clearAllText}
                  darkColor="#31E1F7" 
                  lightColor="#31E1F7"
                >
                  Clear
                </ThemedText>
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recentSearchesList}
            >
              {recentSearches.map((item, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.recentSearchItem}
                  onPress={() => handlePopularSearch(item)}
                >
                  <IconSymbol name="chevron.right" size={14} color="#EBD3F8" style={styles.recentSearchIcon} />
                  <ThemedText 
                    style={styles.recentSearchText}
                    darkColor="#EBD3F8" 
                    lightColor="#EBD3F8"
                  >
                    {item}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        
        {/* Popular searches */}
        <View style={styles.popularSearchesContainer}>
          <ThemedText 
            style={styles.sectionTitle}
            darkColor="#fff" 
            lightColor="#fff"
          >
            Popular Searches
          </ThemedText>
          
          <View style={styles.popularSearchesList}>
            {popularSearches.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.popularSearchItem}
                onPress={() => handlePopularSearch(item)}
              >
                <ThemedText 
                  style={styles.popularSearchText}
                  darkColor="#EBD3F8" 
                  lightColor="#EBD3F8"
                >
                  {item}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Top providers */}
        <View style={styles.providersContainer}>
          <ThemedText 
            style={styles.sectionTitle}
            darkColor="#fff" 
            lightColor="#fff"
          >
            Top Providers Near You
          </ThemedText>
          
          <View style={styles.providersList}>
            {providers.map((provider) => (
              <ProviderCard 
                key={provider.id} 
                provider={provider}
                onPress={() => handleProviderPress(provider)}
              />
            ))}
          </View>
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
    marginBottom: 20,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: responsiveFontSize(22, 22, 34),
    fontWeight: '700',
    fontFamily: fontFamilies.title,
    textShadowColor: "#F806CC",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  searchContainer: {
    marginBottom: 24,
    zIndex: 1,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(174, 0, 255, 0.1)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(235, 211, 248, 0.3)',
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#EBD3F8',
    fontSize: responsiveFontSize(16, 14, 18),
    fontFamily: fontFamilies.text,
  },
  clearButton: {
    padding: 5,
  },
  recentSearchesContainer: {
    marginBottom: 24,
    zIndex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: responsiveFontSize(20, 18, 24),
    fontWeight: '600',
    marginBottom: 12,
    fontFamily: fontFamilies.subtitle,
  },
  clearAllText: {
    fontSize: responsiveFontSize(14, 12, 16),
    fontWeight: '500',
    fontFamily: fontFamilies.text,
  },
  recentSearchesList: {
    paddingRight: 20,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(174, 0, 255, 0.1)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(235, 211, 248, 0.2)',
  },
  recentSearchIcon: {
    marginRight: 5,
  },
  recentSearchText: {
    fontSize: responsiveFontSize(14, 12, 16),
    fontFamily: fontFamilies.text,
  },
  popularSearchesContainer: {
    marginBottom: 24,
    zIndex: 1,
  },
  popularSearchesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  popularSearchItem: {
    backgroundColor: 'rgba(174, 0, 255, 0.1)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(235, 211, 248, 0.2)',
  },
  popularSearchText: {
    fontSize: responsiveFontSize(14, 12, 16),
    fontFamily: fontFamilies.text,
  },
  providersContainer: {
    zIndex: 1,
  },
  providersList: {
    gap: 16,
  },
  providerCard: {
    backgroundColor: 'rgba(174, 0, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(235, 211, 248, 0.2)',
  },
  providerHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  providerImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 12,
  },
  providerImage: {
    width: 36,
    height: 36,
  },
  providerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  providerName: {
    fontSize: responsiveFontSize(16, 14, 18),
    fontWeight: '600',
    marginBottom: 6,
    fontFamily: fontFamilies.subtitle,
  },
  categoryBadge: {
    backgroundColor: 'rgba(49, 225, 247, 0.15)',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: responsiveFontSize(12, 10, 14),
    fontFamily: fontFamilies.text,
  },
  providerDetails: {
    marginBottom: 16,
    gap: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingText: {
    fontSize: responsiveFontSize(14, 13, 16),
    fontFamily: fontFamilies.text,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  distanceText: {
    fontSize: responsiveFontSize(14, 13, 16),
    fontFamily: fontFamilies.text,
  },
  bookButton: {
    borderRadius: 25,
    overflow: 'hidden',
    height: 44,
  },
  bookButtonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonText: {
    fontSize: responsiveFontSize(14, 13, 16),
    fontWeight: '600',
    fontFamily: fontFamilies.button,
  },
});