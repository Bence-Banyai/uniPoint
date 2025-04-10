import {
  StyleSheet,
  Platform,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useState, useEffect, useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { fetchCategories, Category as CategoryType } from '../../services/categoryApi';
import { fetchServices, Service } from '../../services/serviceApi';
import { bookAppointment } from '../../services/appointmentApi';

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

const popularSearches = [
  'Dentist', 'Hair Salon', 'Massage', 'Gym Trainer', 'Doctor', 'Spa'
];

// Convert backend service to provider format for display
const serviceToProvider = (service: Service): Provider => {
  const color = getCategoryColor(service.categoryId);
  
  return {
    id: service.serviceId.toString(),
    name: service.serviceName,
    categoryId: service.categoryId,
    rating: 4.5, // You could add this to your backend model in the future
    reviews: 0, // Default until you implement reviews in backend
    distance: "Nearby", // This could be calculated if you add coordinates to your backend
    image: service.imageUrls && service.imageUrls.length > 0 
      ? { uri: service.imageUrls[0] } 
      : require('@/assets/images/adaptive-icon.png'),
    color: color,
    providerName: service.provider?.userName || 'Unknown Provider',
    price: service.price || 0,
    description: service.description || '',
    address: service.address || 'No address provided'
  };
};

// Get color based on category ID
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

interface Provider {
  id: string;
  name: string;
  categoryId: number;
  rating: number;
  reviews: number;
  distance: string;
  image: any;
  color: string;
  providerName?: string;
  price?: number;
  description?: string;
  address?: string;
}

function ProviderCard({ provider, onPress, categories }: { 
  provider: Provider; 
  onPress: () => void;
  categories: CategoryType[];
}) {
  const category = categories.find(c => c.categoryId === provider.categoryId);
  
  const handleViewServiceDetails = () => {
    router.push({
      pathname: '/serviceDetails',
      params: { id: provider.id }
    });
  };

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
            contentFit="cover"
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
              {category ? category.name : 'Unknown Category'}
            </ThemedText>
          </View>
          {provider.description && (
            <ThemedText 
              style={styles.providerDescription}
              darkColor="#EBD3F8" 
              lightColor="#EBD3F8"
              numberOfLines={2}
            >
              {provider.description}
            </ThemedText>
          )}
        </View>
      </View>
      
      <View style={styles.providerDetails}>
        {provider.address && (
          <View style={styles.addressContainer}>
            <IconSymbol name="house.fill" size={16} color="#31E1F7" />
            <ThemedText 
              style={styles.addressText}
              darkColor="#EBD3F8" 
              lightColor="#EBD3F8"
            >
              {provider.address}
            </ThemedText>
          </View>
        )}
        <View style={styles.priceContainer}>
          <IconSymbol name="chevron.right" size={16} color="#4CAF50" />
          <ThemedText 
            style={styles.priceText}
            darkColor="#EBD3F8" 
            lightColor="#EBD3F8"
          >
            Price: {(provider.price || 0).toLocaleString()} HUF
          </ThemedText>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.bookButton}
        activeOpacity={0.7}
        onPress={handleViewServiceDetails}
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
            View Details
          </ThemedText>
        </LinearGradient>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const params = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(['Haircut', 'Dental Cleaning']);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingCategories(true);
        setLoadingServices(true);
        
        // Load categories and services in parallel
        const [categoriesData, servicesData] = await Promise.all([
          fetchCategories(),
          fetchServices()
        ]);
        
        setCategories(categoriesData);
        setServices(servicesData);
        
        // Convert services to provider format
        const providersData = servicesData.map(service => serviceToProvider(service));
        setProviders(providersData);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoadingCategories(false);
        setLoadingServices(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (params.categoryId) {
      const categoryId = parseInt(params.categoryId as string, 10);
      setSelectedCategoryId(categoryId);
    }
  }, [params.categoryId]);

  const handleCategoryFilter = (categoryId: number) => {
    if (selectedCategoryId === categoryId) {
      setSelectedCategoryId(null);
    } else {
      setSelectedCategoryId(categoryId);
      
      const category = categories.find(c => c.categoryId === categoryId);
      if (category) {
        setSearchQuery(category.name);
      }
    }
  };

  const filteredProviders = useMemo(() => {
    let result = [...providers];
    
    if (selectedCategoryId !== null) {
      result = result.filter(provider => provider.categoryId === selectedCategoryId);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(provider => 
        provider.name.toLowerCase().includes(query) || 
        provider.description?.toLowerCase().includes(query) ||
        provider.address?.toLowerCase().includes(query) ||
        provider.providerName?.toLowerCase().includes(query) ||
        categories.find(c => c.categoryId === provider.categoryId)?.name.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [providers, searchQuery, categories, selectedCategoryId]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      if (!recentSearches.includes(searchQuery.trim())) {
        setRecentSearches(prev => [searchQuery.trim(), ...prev.slice(0, 4)]);
      }
      console.log(`Searching for: ${searchQuery}`);
    }
  };
  
  const handlePopularSearch = (term: string) => {
    setSearchQuery(term);
    handleSearch();
  };
  
  const handleProviderPress = (provider: Provider) => {
    console.log(`Selected provider: ${provider.name}`);
    router.push({
      pathname: '/serviceDetails',
      params: { id: provider.id }
    });
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
          <ThemedText 
            style={styles.headerTitle}
            darkColor="#fff" 
            lightColor="#fff"
          >
            Explore
          </ThemedText>
        </View>
        
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

        <View style={styles.categoryFiltersContainer}>
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryFiltersList}
          >
            {categories.map((category) => (
              <TouchableOpacity 
                key={category.categoryId} 
                style={[
                  styles.categoryFilterChip,
                  selectedCategoryId === category.categoryId && { 
                    backgroundColor: `${getCategoryColor(category.categoryId)}40`,
                    borderColor: getCategoryColor(category.categoryId)
                  }
                ]}
                onPress={() => handleCategoryFilter(category.categoryId)}
              >
                <ThemedText 
                  style={styles.categoryFilterText}
                  darkColor={selectedCategoryId === category.categoryId ? 
                    getCategoryColor(category.categoryId) : "#EBD3F8"}
                  lightColor={selectedCategoryId === category.categoryId ? 
                    getCategoryColor(category.categoryId) : "#EBD3F8"}
                >
                  {category.name}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
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
        
        <View style={styles.providersContainer}>
          <ThemedText 
            style={styles.sectionTitle}
            darkColor="#fff" 
            lightColor="#fff"
          >
            {searchQuery ? 'Search Results' : 'Top Services Near You'}
          </ThemedText>
          
          {loadingServices ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#31E1F7" />
              <ThemedText 
                style={styles.loadingText}
                darkColor="#EBD3F8" 
                lightColor="#EBD3F8"
              >
                Loading services...
              </ThemedText>
            </View>
          ) : filteredProviders.length === 0 ? (
            <View style={styles.emptyResultsContainer}>
              <IconSymbol name="chevron.right" size={50} color="rgba(235, 211, 248, 0.3)" />
              <ThemedText 
                style={styles.emptyResultsText}
                darkColor="#EBD3F8" 
                lightColor="#EBD3F8"
              >
                {searchQuery ? 'No services match your search' : 'No services available'}
              </ThemedText>
            </View>
          ) : (
            <View style={styles.providersList}>
              {filteredProviders.map((provider) => (
                <ProviderCard 
                  key={provider.id} 
                  provider={provider}
                  categories={categories}
                  onPress={() => handleProviderPress(provider)}
                />
              ))}
            </View>
          )}
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
  categoryFiltersContainer: {
    marginBottom: 16,
    zIndex: 1,
  },
  categoryFiltersList: {
    paddingRight: 20,
  },
  categoryFilterChip: {
    backgroundColor: 'rgba(174, 0, 255, 0.1)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(235, 211, 248, 0.2)',
  },
  categoryFilterText: {
    fontSize: responsiveFontSize(14, 12, 16),
    fontFamily: fontFamilies.text,
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: responsiveFontSize(16, 14, 18),
    fontFamily: fontFamilies.text,
  },
  emptyResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyResultsText: {
    marginTop: 12,
    fontSize: responsiveFontSize(16, 14, 18),
    opacity: 0.6,
    fontFamily: fontFamilies.text,
    textAlign: 'center',
  },
  providerSubtitle: {
    fontSize: responsiveFontSize(12, 10, 14),
    marginTop: 2,
    fontFamily: fontFamilies.text,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceText: {
    fontSize: responsiveFontSize(14, 13, 16),
    fontFamily: fontFamilies.text,
  },
  providerDescription: {
    fontSize: responsiveFontSize(12, 10, 14),
    marginTop: 2,
    fontFamily: fontFamilies.text,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addressText: {
    fontSize: responsiveFontSize(14, 13, 16),
    fontFamily: fontFamilies.text,
  },
});