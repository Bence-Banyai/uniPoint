import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Modal,
  TextInput
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { fetchServiceById, Service } from '@/services/serviceApi';
import { fetchAppointments, bookAppointment, AppointmentStatus } from '@/services/appointmentApi';
import { fetchCategories, Category as CategoryType } from '@/services/categoryApi';
import { useAuth } from './context/AuthContext';
import { fetchReviews, submitReview, Review } from '../services/reviewsApi';
import api from '../services/api';

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

export default function ServiceDetailsScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const serviceId = params.id as string;
  const { isAuthenticated, userId } = useAuth();
  
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [category, setCategory] = useState<CategoryType | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [availableSlots, setAvailableSlots] = useState<{id: number, time: string, available: boolean}[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [userReview, setUserReview] = useState({ rating: 0, comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  
  useEffect(() => {
    loadServiceData();
  }, [serviceId]);

  useEffect(() => {
    if (service) {
      fetchAvailableTimeSlots();
    }
  }, [service, selectedDate]);

  useEffect(() => {
    if (service) {
      loadReviews();
    }
  }, [service, isAuthenticated]);

  const loadServiceData = async () => {
    try {
      setLoading(true);
      const serviceData = await fetchServiceById(parseInt(serviceId, 10));
      setService(serviceData);
      
      const categoriesData = await fetchCategories();
      const serviceCategory = categoriesData.find(c => c.categoryId === serviceData.categoryId);
      setCategory(serviceCategory || null);
      
    } catch (error) {
      console.error('Failed to load service details:', error);
      Alert.alert(
        "Loading Error", 
        "Failed to load service details. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    if (!service) return;
    
    try {
      setLoadingReviews(true);
      const serviceReviews = await fetchReviews(parseInt(serviceId, 10));
      setReviews(serviceReviews);
      
      if (isAuthenticated && userId) {
        const hasReviewed = serviceReviews.some(review => review.userId === userId);
        setUserHasReviewed(hasReviewed);
      }
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadServiceData();
    await fetchAvailableTimeSlots();
    setRefreshing(false);
  };
  
  const fetchAvailableTimeSlots = async () => {
    if (!service) return;

    setLoadingSlots(true);
    try {
      const appointments = await fetchAppointments();
      
      const openAppointments = appointments.filter(
        (appointment: {serviceId: number; status: AppointmentStatus; appointmentDate: string}) => 
          appointment.serviceId === parseInt(serviceId, 10) && 
          appointment.status === AppointmentStatus.OPEN &&
          appointment.appointmentDate.split('T')[0] === selectedDate
      );
      
      const slots = openAppointments.map((appointment: {id: number; appointmentDate: string}) => {
        const date = new Date(appointment.appointmentDate);
        return {
          id: appointment.id,
          time: date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          }),
          available: true
        };
      });
      
      setAvailableSlots(slots.sort((a: {time: string}, b: {time: string}) => {
        return new Date('1/1/1970 ' + a.time).getTime() - new Date('1/1/1970 ' + b.time).getTime();
      }));
    } catch (error) {
      console.error('Failed to fetch available time slots:', error);
      Alert.alert(
        "Loading Error", 
        "Failed to load available time slots. Please try again."
      );
    } finally {
      setLoadingSlots(false);
    }
  };
  
  const handleBookAppointment = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        "Authentication Required",
        "Please log in to book an appointment.",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { 
            text: "Login", 
            onPress: () => router.push('/login')
          }
        ]
      );
      return;
    }
    
    if (!selectedSlot) {
      Alert.alert("Please Select Time", "Please select an available time slot for your appointment.");
      return;
    }
    
    try {
      setIsBooking(true);
      await bookAppointment(selectedSlot);
      
      if (Platform.OS === 'web') {
        window.alert('Your appointment has been successfully booked!');
        router.replace('/(tabs)/search');
      } else {
        Alert.alert(
          "Booking Successful", 
          `Your appointment for ${service?.serviceName} has been booked.`,
          [{ text: "OK", onPress: () => router.push('/(tabs)/appointments') }]
        );
      }
    } catch (error) {
      console.error('Failed to book appointment:', error);
      Alert.alert(
        "Booking Failed", 
        "There was an error booking your appointment. It may have been booked by someone else. Please try another time slot."
      );
      fetchAvailableTimeSlots();
    } finally {
      setIsBooking(false);
    }
  };
  
  const formatPrice = (price: number | undefined) => {
    if (price === undefined) return "Price not available";
    return price.toLocaleString() + " HUF";
  };
  
  const formatOpeningHours = (opensAt: string | undefined, closesAt: string | undefined) => {
    if (!opensAt || !closesAt) return "Hours not available";
    const formatTime = (t: string) => {
      const [h, m] = t.split(":");
      return `${h}:${m}`;
    };
    return `${formatTime(opensAt)} - ${formatTime(closesAt)}`;
  };
  
  const handleGoBack = () => {
    router.replace('/(tabs)/search');
  };
  
  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slotId: number) => {
    setSelectedSlot(slotId);
  };

  const handleDatePickerChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'web' && event.nativeEvent) {
      event.stopPropagation?.();
      event.preventDefault?.();
    }

    if (Platform.OS !== 'web') {
      setShowDatePicker(false);
    }
    
    if (event.type === 'dismissed') {
      return;
    }
    
    if (selectedDate) {
      setTempDate(selectedDate);
      
      if (Platform.OS === 'web' || event.type === 'set') {
        const dateStr = selectedDate.toISOString().split('T')[0];
        handleDateChange(dateStr);
      }
    }
  };
  
  const noAvailableSlots = availableSlots.length === 0 && !loadingSlots;

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        "Authentication Required",
        "Please log in to leave a review.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Login", onPress: () => router.push('/login') }
        ]
      );
      return;
    }
    
    if (userReview.rating === 0) {
      Alert.alert("Rating Required", "Please select a star rating before submitting.");
      return;
    }
    
    try {
      setIsSubmittingReview(true);
      setReviewError(null);
      
      const tokenValid = await checkAuthToken();
      
      if (!tokenValid) {
        Alert.alert(
          "Session Expired",
          "Your login session has expired. Please log in again.",
          [
            { text: "OK", onPress: () => router.push('/login') }
          ]
        );
        return;
      }
      
      await submitReview({
        serviceId: parseInt(serviceId, 10),
        score: userReview.rating,
        description: userReview.comment
      });
      
      setUserReview({ rating: 0, comment: '' });
      await loadReviews();
      
      Alert.alert("Success", "Your review has been submitted successfully.");
    } catch (error: any) { 
      console.error('Failed to submit review:', error);
      
      if (error.response && error.response.status === 401) {
        setReviewError("Authentication error. Please log in again.");
        setTimeout(() => router.push('/login'), 1500);
      } else {
        setReviewError("Failed to submit your review. Please try again later.");
      }
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const checkAuthToken = async () => {
    try {
      const currentUserId = userId;
      
      if (!currentUserId) {
        console.log('No user ID available, authentication required');
        return false;
      }
      
      await api.get(`/api/User/${currentUserId}`);
      return true;
    } catch (error: any) {
      if (!error.response || (error.response.status !== 401 && error.response.status !== 403)) {
        console.error('Auth token validation failed:', error);
      }
      return false;
    }
  };

  const averageRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + (r.score || 0), 0) / reviews.length) : 0;

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: false,
        }}
      />
      
      <LinearGradient
        colors={["#2E0249", "#570A57", "#A91079"]}
        style={styles.gradient}
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
            { paddingTop: insets.top + 10 }
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#31E1F7"]}
              tintColor="#31E1F7"
            />
          }
        >
          {/* Back button */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleGoBack}
          >
            <IconSymbol name="chevron.left" size={24} color="#31E1F7" />
            <ThemedText 
              style={styles.backButtonText}
              darkColor="#31E1F7" 
              lightColor="#31E1F7"
            >
              Back
            </ThemedText>
          </TouchableOpacity>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#31E1F7" />
              <ThemedText 
                style={styles.loadingText}
                darkColor="#EBD3F8" 
                lightColor="#EBD3F8"
              >
                Loading service details...
              </ThemedText>
            </View>
          ) : service ? (
            <>
              {/* Header with service name and price */}
              <View style={styles.header}>
                <ThemedText 
                  style={styles.serviceTitle}
                  darkColor="#fff" 
                  lightColor="#fff"
                >
                  {service.serviceName}
                </ThemedText>
                <View style={styles.priceBadge}>
                  <ThemedText 
                    style={styles.priceText}
                    darkColor="#fff" 
                    lightColor="#fff"
                  >
                    {formatPrice(service.price)}
                  </ThemedText>
                </View>
              </View>
              
              {/* Service images */}
              <View style={styles.imageContainer}>
                {service.imageUrls && service.imageUrls.length > 0 ? (
                  <Image 
                    source={{ uri: service.imageUrls[currentImageIndex] }}
                    style={styles.mainImage}
                    contentFit="cover"
                  />
                ) : (
                  <View style={styles.placeholderImage}>
                    <IconSymbol name="photo" size={50} color="rgba(235, 211, 248, 0.3)" />
                  </View>
                )}
                
                {/* Image thumbnails */}
                {service.imageUrls && service.imageUrls.length > 1 && (
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={styles.thumbnailsContainer}
                  >
                    {service.imageUrls.map((url, index) => (
                      <TouchableOpacity 
                        key={index}
                        onPress={() => setCurrentImageIndex(index)}
                        style={[
                          styles.thumbnailWrapper,
                          currentImageIndex === index && styles.activeThumbnail
                        ]}
                      >
                        <Image 
                          source={{ uri: url }}
                          style={styles.thumbnailImage}
                          contentFit="cover"
                        />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>
              
              {/* Provider info */}
              <View style={styles.providerCard}>
                <View style={styles.providerHeader}>
                  <View style={styles.providerImageContainer}>
                    {service.provider?.profilePictureUrl ? (
                      <Image 
                        source={{ uri: service.provider.profilePictureUrl }}
                        style={styles.providerImage}
                        contentFit="cover"
                      />
                    ) : (
                      <IconSymbol name="person.fill" size={30} color="#EBD3F8" />
                    )}
                  </View>
                  <View style={styles.providerInfo}>
                    <ThemedText 
                      style={styles.providerName}
                      darkColor="#fff" 
                      lightColor="#fff"
                    >
                      {service.provider?.userName || 'Unknown Provider'}
                    </ThemedText>
                    {category && (
                      <ThemedText 
                        style={styles.providerSubtitle}
                        darkColor="#EBD3F8" 
                        lightColor="#EBD3F8"
                      >
                        {category.name} Professional
                      </ThemedText>
                    )}
                  </View>
                </View>
                
                <ThemedText 
                  style={styles.aboutTitle}
                  darkColor="#fff" 
                  lightColor="#fff"
                >
                  About the Service
                </ThemedText>
                <ThemedText 
                  style={styles.descriptionText}
                  darkColor="#EBD3F8" 
                  lightColor="#EBD3F8"
                >
                  {service.description}
                </ThemedText>
                
                <View style={styles.detailsSection}>
                  <View style={styles.detailItem}>
                    <IconSymbol name="location.fill" size={16} color="#31E1F7" />
                    <ThemedText 
                      style={styles.detailText}
                      darkColor="#EBD3F8" 
                      lightColor="#EBD3F8"
                    >
                      {service.address || 'Address not provided'}
                    </ThemedText>
                  </View>
                  
                  {service.provider?.location && (
                    <View style={styles.detailItem}>
                      <IconSymbol name="house.fill" size={16} color="#31E1F7" />
                      <ThemedText 
                        style={styles.detailText}
                        darkColor="#EBD3F8" 
                        lightColor="#EBD3F8"
                      >
                        {service.provider.location}
                      </ThemedText>
                    </View>
                  )}
                  
                  {service.provider?.email && (
                    <View style={styles.detailItem}>
                      <IconSymbol name="envelope.fill" size={16} color="#31E1F7" />
                      <ThemedText 
                        style={styles.detailText}
                        darkColor="#EBD3F8" 
                        lightColor="#EBD3F8"
                      >
                        {service.provider.email}
                      </ThemedText>
                    </View>
                  )}
                </View>
              </View>
              
              {/* Service details card */}
              <View style={styles.detailsCard}>
                <ThemedText 
                  style={styles.cardTitle}
                  darkColor="#fff" 
                  lightColor="#fff"
                >
                  Service Details
                </ThemedText>
                
                <View style={styles.detailsGrid}>
                  <View style={styles.detailsGridItem}>
                    <IconSymbol name="clock.fill" size={16} color="#31E1F7" />
                    <ThemedText 
                      style={styles.detailsGridText}
                      darkColor="#EBD3F8" 
                      lightColor="#EBD3F8"
                    >
                      Duration: {service.duration} minutes
                    </ThemedText>
                  </View>
                  
                  <View style={styles.detailsGridItem}>
                    <IconSymbol name="tag.fill" size={16} color="#31E1F7" />
                    <ThemedText 
                      style={styles.detailsGridText}
                      darkColor="#EBD3F8" 
                      lightColor="#EBD3F8"
                    >
                      Price: {formatPrice(service.price)}
                    </ThemedText>
                  </View>
                  
                  <View style={styles.detailsGridItem}>
                    <IconSymbol name="calendar" size={16} color="#31E1F7" />
                    <ThemedText 
                      style={styles.detailsGridText}
                      darkColor="#EBD3F8" 
                      lightColor="#EBD3F8"
                    >
                      Open: {formatOpeningHours(service.opensAt, service.closesAt)}
                    </ThemedText>
                  </View>
                  
                  <View style={styles.detailsGridItem}>
                    <IconSymbol name="mappin.and.ellipse" size={16} color="#31E1F7" />
                    <ThemedText 
                      style={styles.detailsGridText}
                      darkColor="#EBD3F8" 
                      lightColor="#EBD3F8"
                    >
                      {service.address}
                    </ThemedText>
                  </View>
                </View>
              </View>
              
              {/* Booking section */}
              <View style={styles.bookingCard}>
                <ThemedText 
                  style={styles.cardTitle}
                  darkColor="#fff" 
                  lightColor="#fff"
                >
                  Book this Service
                </ThemedText>
                
                <ThemedText 
                  style={styles.dateLabel}
                  darkColor="#EBD3F8" 
                  lightColor="#EBD3F8"
                >
                  Select Date
                </ThemedText>
                
                {/* Date selection - improved implementation */}
                <View style={styles.dateContainer}>
                  {/* Date picker button */}
                  <TouchableOpacity 
                    style={styles.dateItem}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <View style={styles.dateDisplay}>
                      <IconSymbol name="calendar" size={20} color="#31E1F7" />
                      <ThemedText
                        style={styles.dateText}
                        darkColor="#EBD3F8"
                        lightColor="#EBD3F8"
                      >
                        {new Date(selectedDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric', 
                          month: 'long',
                          day: 'numeric'
                        })}
                      </ThemedText>
                    </View>
                    <IconSymbol name="chevron.right" size={16} color="#EBD3F8" />
                  </TouchableOpacity>
                  
                  {/* Quick date selection options */}
                  <View style={styles.quickDateContainer}>
                    {[0, 1, 2, 3, 7, 14].map((dayOffset) => {
                      const date = new Date();
                      date.setDate(date.getDate() + dayOffset);
                      const dateStr = date.toISOString().split('T')[0];
                      const isSelected = selectedDate === dateStr;
                      const dayLabel = dayOffset === 0 ? 'Today' : 
                                       dayOffset === 1 ? 'Tomorrow' : 
                                       dayOffset === 7 ? 'Next week' :
                                       dayOffset === 14 ? '+2 weeks' :
                                       date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
                      
                      return (
                        <TouchableOpacity 
                          key={dateStr}
                          style={[
                            styles.quickDateItem,
                            isSelected && styles.selectedDateItem
                          ]}
                          onPress={() => handleDateChange(dateStr)}
                        >
                          <ThemedText 
                            style={[
                              styles.dateText,
                              isSelected && styles.selectedDateText
                            ]}
                            darkColor={isSelected ? "#31E1F7" : "#EBD3F8"}
                            lightColor={isSelected ? "#31E1F7" : "#EBD3F8"}
                          >
                            {dayLabel}
                          </ThemedText>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Platform-specific date pickers */}
                  {showDatePicker && Platform.OS === 'ios' && (
                    <Modal
                      transparent={true}
                      animationType="slide"
                      visible={showDatePicker}
                      onRequestClose={() => setShowDatePicker(false)}
                    >
                      <TouchableOpacity 
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPress={() => setShowDatePicker(false)}
                      >
                        <View style={styles.modalContent}>
                          <View style={styles.datePickerHeader}>
                            <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                              <ThemedText style={styles.datePickerCancel} darkColor="#E91E63" lightColor="#E91E63">
                                Cancel
                              </ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                              handleDateChange(tempDate.toISOString().split('T')[0]);
                              setShowDatePicker(false);
                            }}>
                              <ThemedText style={styles.datePickerConfirm} darkColor="#31E1F7" lightColor="#31E1F7">
                                Confirm
                              </ThemedText>
                            </TouchableOpacity>
                          </View>
                          <DateTimePicker
                            value={tempDate}
                            mode="date"
                            display="spinner"
                            onChange={(event, date) => {
                              if (date) setTempDate(date);
                            }}
                            minimumDate={new Date()}
                            style={[styles.datePicker, { marginBottom: 20 }]}
                            themeVariant="dark"
                            textColor="#EBD3F8"
                          />
                        </View>
                      </TouchableOpacity>
                    </Modal>
                  )}

                  {showDatePicker && Platform.OS === 'android' && (
                    <DateTimePicker
                      value={tempDate}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (event.type !== 'dismissed' && selectedDate) {
                          setTempDate(selectedDate);
                          handleDateChange(selectedDate.toISOString().split('T')[0]);
                        }
                      }}
                      minimumDate={new Date()}
                    />
                  )}

                  {/* Web date picker */}
                  {showDatePicker && Platform.OS === 'web' && (
                    <Modal
                      transparent={true}
                      animationType="fade"
                      visible={showDatePicker}
                      onRequestClose={() => setShowDatePicker(false)}
                    >
                      <TouchableOpacity 
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPress={() => setShowDatePicker(false)}
                      >
                        <View style={styles.modalContent}>
                          <TouchableOpacity 
                            activeOpacity={1} 
                            onPress={(event) => {
                              event.stopPropagation();
                            }}
                          >
                            <View style={styles.datePickerHeader}>
                              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                                <ThemedText style={styles.datePickerCancel} darkColor="#E91E63" lightColor="#E91E63">
                                  Cancel
                                </ThemedText>
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => {
                                handleDateChange(tempDate.toISOString().split('T')[0]);
                                setShowDatePicker(false);
                              }}>
                                <ThemedText style={styles.datePickerConfirm} darkColor="#31E1F7" lightColor="#31E1F7">
                                  Confirm
                                </ThemedText>
                              </TouchableOpacity>
                            </View>
                            
                            <input
                              type="date"
                              value={tempDate.toISOString().split('T')[0]}
                              min={new Date().toISOString().split('T')[0]}
                              onChange={(e) => {
                                if (e.target.value) {
                                  setTempDate(new Date(e.target.value));
                                }
                              }}
                              style={{
                                backgroundColor: 'rgba(46, 2, 73, 0.8)',
                                color: '#EBD3F8',
                                border: '1px solid rgba(235, 211, 248, 0.3)',
                                borderRadius: 12,
                                padding: 12,
                                fontSize: 16,
                                width: '100%',
                                boxSizing: 'border-box',
                                marginTop: 10,
                                cursor: 'pointer',
                                maxWidth: '100%',
                                overflow: 'hidden',
                                outline: 'none',
                                fontFamily: 'sans-serif',
                                appearance: 'none',
                                WebkitAppearance: 'none',
                                MozAppearance: 'none'
                              }}
                              className="custom-datepicker"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    </Modal>
                  )}
                </View>
                
                <ThemedText 
                  style={styles.timeSlotLabel}
                  darkColor="#EBD3F8" 
                  lightColor="#EBD3F8"
                >
                  Select Time
                </ThemedText>
                
                {loadingSlots ? (
                  <View style={styles.loadingSlotsContainer}>
                    <ActivityIndicator size="small" color="#31E1F7" />
                    <ThemedText 
                      style={styles.loadingSlotsText}
                      darkColor="#EBD3F8" 
                      lightColor="#EBD3F8"
                    >
                      Loading available times...
                    </ThemedText>
                  </View>
                ) : noAvailableSlots ? (
                  <View style={styles.emptySlotContainer}>
                    <IconSymbol name="calendar.badge.exclamationmark" size={24} color="rgba(235, 211, 248, 0.5)" />
                    <ThemedText 
                      style={styles.emptySlotText}
                      darkColor="#EBD3F8" 
                      lightColor="#EBD3F8"
                    >
                      No appointments available for this date.
                    </ThemedText>
                  </View>
                ) : (
                  <View style={styles.timeSlotsContainer}>
                    {availableSlots.map((slot) => (
                      <TouchableOpacity 
                        key={slot.id}
                        style={[
                          styles.timeSlot,
                          selectedSlot === slot.id && styles.selectedTimeSlot,
                          !slot.available && styles.unavailableTimeSlot
                        ]}
                        onPress={() => handleSlotSelect(slot.id)}
                        disabled={!slot.available}
                      >
                        <ThemedText 
                          style={[
                            styles.timeSlotText,
                            selectedSlot === slot.id && styles.selectedTimeSlotText,
                            !slot.available && styles.unavailableTimeSlotText
                          ]}
                          darkColor="#EBD3F8" 
                          lightColor="#EBD3F8"
                        >
                          {slot.time}
                        </ThemedText>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                
                <TouchableOpacity 
                  style={[
                    styles.bookButton,
                    (isBooking || !selectedSlot) && styles.disabledBookButton
                  ]}
                  activeOpacity={0.7}
                  onPress={handleBookAppointment}
                  disabled={isBooking || !selectedSlot}
                >
                  <LinearGradient
                    colors={["#31E1F7", "#6EDCD9"]}
                    style={styles.bookButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {isBooking ? (
                      <ActivityIndicator size="small" color="#400D51" />
                    ) : (
                      <ThemedText 
                        style={styles.bookButtonText}
                        darkColor="#400D51" 
                        lightColor="#400D51"
                      >
                        Book Appointment
                      </ThemedText>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Reviews Section */}
              <View style={styles.reviewsCard}>
                <ThemedText 
                  style={styles.cardTitle}
                  darkColor="#fff" 
                  lightColor="#fff"
                >
                  Reviews
                </ThemedText>
                
                {/* Average Rating Display */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <View style={{ flexDirection: 'row', marginRight: 8 }}>
                    {[1,2,3,4,5].map(i => (
                      <IconSymbol
                        key={i}
                        name="star.fill"
                        size={18}
                        color={i <= Math.round(averageRating) ? '#FFC107' : 'rgba(255,255,255,0.2)'}
                      />
                    ))}
                  </View>
                  <ThemedText style={{ fontSize: 16, color: '#FFC107', fontWeight: 'bold', marginRight: 8 }}>
                    {averageRating.toFixed(1)}
                  </ThemedText>
                  <ThemedText style={{ fontSize: 14, color: '#EBD3F8' }}>
                    ({reviews.length} review{reviews.length === 1 ? '' : 's'})
                  </ThemedText>
                </View>

                {loadingReviews ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#31E1F7" />
                    <ThemedText 
                      style={styles.loadingText}
                      darkColor="#EBD3F8" 
                      lightColor="#EBD3F8"
                    >
                      Loading reviews...
                    </ThemedText>
                  </View>
                ) : reviews.length > 0 ? (
                  <View style={styles.reviewsList}>
                    {reviews.map((review) => (
                      <View key={review.reviewId} style={styles.reviewItem}>
                        <View style={styles.reviewHeader}>
                          <View style={styles.reviewerInfo}>
                            <View style={styles.avatarContainer}>
                              {review.reviewer?.profilePictureUrl ? (
                                <Image 
                                  source={{ uri: review.reviewer.profilePictureUrl }}
                                  style={styles.avatarImage}
                                  contentFit="cover"
                                />
                              ) : (
                                <IconSymbol name="person.fill" size={16} color="#EBD3F8" />
                              )}
                            </View>
                            <ThemedText 
                              style={styles.reviewerName}
                              darkColor="#fff" 
                              lightColor="#fff"
                            >
                              {review.reviewer?.userName || 'Anonymous User'}
                            </ThemedText>
                          </View>
                          <View style={styles.ratingContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <IconSymbol 
                                key={star}
                                name="star.fill"
                                size={14}
                                color={star <= review.score ? '#FFC107' : 'rgba(255, 255, 255, 0.2)'}
                              />
                            ))}
                          </View>
                        </View>
                        <ThemedText 
                          style={styles.reviewText}
                          darkColor="#EBD3F8" 
                          lightColor="#EBD3F8"
                        >
                          {review.description}
                        </ThemedText>
                        <ThemedText 
                          style={styles.reviewDate}
                          darkColor="rgba(235, 211, 248, 0.5)" 
                          lightColor="rgba(235, 211, 248, 0.5)"
                        >
                          {new Date(review.createdAt).toLocaleDateString()}
                        </ThemedText>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={styles.emptyReviewsContainer}>
                    <IconSymbol name="text.bubble" size={24} color="rgba(235, 211, 248, 0.5)" />
                    <ThemedText 
                      style={styles.emptyReviewsText}
                      darkColor="#EBD3F8" 
                      lightColor="#EBD3F8"
                    >
                      No reviews yet. Be the first to review this service!
                    </ThemedText>
                  </View>
                )}
                
                {!userHasReviewed && isAuthenticated && (
                  <View style={styles.writeReviewContainer}>
                    <ThemedText 
                      style={styles.writeReviewTitle}
                      darkColor="#fff" 
                      lightColor="#fff"
                    >
                      Write a Review
                    </ThemedText>
                    
                    <View style={styles.ratingInputContainer}>
                      <ThemedText 
                        style={styles.ratingLabel}
                        darkColor="#EBD3F8" 
                        lightColor="#EBD3F8"
                      >
                        Your Rating
                      </ThemedText>
                      <View style={styles.starsContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <TouchableOpacity
                            key={star}
                            onPress={() => setUserReview(prev => ({ ...prev, rating: star }))}
                          >
                            <IconSymbol 
                              name="star.fill"
                              size={24}
                              color={star <= userReview.rating ? '#FFC107' : 'rgba(255, 255, 255, 0.2)'}
                              style={styles.starIcon}
                            />
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                    
                    <View style={styles.commentInputContainer}>
                      <ThemedText 
                        style={styles.commentLabel}
                        darkColor="#EBD3F8" 
                        lightColor="#EBD3F8"
                      >
                        Your Review
                      </ThemedText>
                      <TextInput 
                        style={styles.commentInput}
                        value={userReview.comment}
                        onChangeText={(text) => setUserReview(prev => ({ ...prev, comment: text }))}
                        placeholder="Share your experience with this service..."
                        placeholderTextColor="rgba(235, 211, 248, 0.5)"
                        multiline
                        numberOfLines={4}
                        selectionColor="#31E1F7"
                      />
                    </View>
                    
                    {reviewError && (
                      <ThemedText 
                        style={styles.errorText}
                        darkColor="#E91E63" 
                        lightColor="#E91E63"
                      >
                        {reviewError}
                      </ThemedText>
                    )}
                    
                    <TouchableOpacity 
                      style={[
                        styles.submitReviewButton,
                        (isSubmittingReview || userReview.rating === 0) && styles.disabledBookButton
                      ]}
                      activeOpacity={0.7}
                      onPress={handleSubmitReview}
                      disabled={isSubmittingReview || userReview.rating === 0}
                    >
                      <LinearGradient
                        colors={["#31E1F7", "#6EDCD9"]}
                        style={styles.bookButtonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        {isSubmittingReview ? (
                          <ActivityIndicator size="small" color="#400D51" />
                        ) : (
                          <ThemedText 
                            style={styles.bookButtonText}
                            darkColor="#400D51" 
                            lightColor="#400D51"
                          >
                            Submit Review
                          </ThemedText>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                )}
                
                {userHasReviewed && (
                  <View style={styles.alreadyReviewedContainer}>
                    <ThemedText 
                      style={styles.alreadyReviewedText}
                      darkColor="#31E1F7" 
                      lightColor="#31E1F7"
                    >
                      You've already reviewed this service.
                    </ThemedText>
                  </View>
                )}
              </View>
            </>
          ) : (
            <View style={styles.errorContainer}>
              <IconSymbol name="exclamationmark.triangle.fill" size={50} color="#E91E63" />
              <ThemedText 
                style={styles.errorText}
                darkColor="#EBD3F8" 
                lightColor="#EBD3F8"
              >
                Could not load service details. Please try again later.
              </ThemedText>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={() => router.push('/search')}
              >
                <ThemedText 
                  style={styles.retryButtonText}
                  darkColor="#31E1F7" 
                  lightColor="#31E1F7"
                >
                  Return to Search
                </ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </LinearGradient>

      {/* Add global styles for date input customization */}
      {Platform.OS === 'web' && (
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Custom styling for the date picker on web */
              .custom-datepicker {
                background-color: rgba(46, 2, 73, 0.8) !important;
                color: #EBD3F8 !important;
                border: 1px solid rgba(235, 211, 248, 0.3) !important;
                border-radius: 12px !important;
                font-family: sans-serif !important;
                width: 100% !important;
                padding: 12px !important;
                box-sizing: border-box !important;
                outline: none !important;
                appearance: none !important;
                -webkit-appearance: none !important;
                -moz-appearance: none !important;
              }

              .custom-datepicker::-webkit-calendar-picker-indicator {
                filter: invert(1) brightness(80%) sepia(100%) saturate(300%) hue-rotate(160deg);
                opacity: 0.7;
                cursor: pointer;
                background-color: transparent !important;
                padding: 6px !important;
                border-radius: 6px !important;
                margin-right: 0 !important;
                transition: all 0.2s ease !important;
              }
              
              .custom-datepicker::-webkit-calendar-picker-indicator:hover {
                opacity: 1;
                filter: invert(1) brightness(80%) sepia(100%) saturate(400%) hue-rotate(140deg);
              }
              
              .custom-datepicker::-webkit-datetime-edit {
                color: #EBD3F8 !important;
                padding: 0 8px !important;
              }
              
              .custom-datepicker::-webkit-datetime-edit-fields-wrapper {
                color: #EBD3F8 !important;
              }
              
              .custom-datepicker::-webkit-datetime-edit-text {
                color: rgba(235, 211, 248, 0.7) !important;
              }
              
              .custom-datepicker::-webkit-datetime-edit-month-field,
              .custom-datepicker::-webkit-datetime-edit-day-field,
              .custom-datepicker::-webkit-datetime-edit-year-field {
                color: #31E1F7 !important;
                font-weight: 500 !important;
                padding: 2px !important;
              }
              
              .custom-datepicker:focus {
                border-color: #31E1F7 !important;
                box-shadow: 0 0 0 3px rgba(49, 225, 247, 0.2) !important;
              }
              
              input[type="date"]::-webkit-calendar-picker-indicator {
                margin-left: 8px !important;
              }
              
              @-moz-document url-prefix() {
                .custom-datepicker {
                  background-image: none !important;
                  padding-right: 12px !important;
                }
              }
              
              @media (prefers-color-scheme: dark) {
                .custom-datepicker {
                  background-color: rgba(46, 2, 73, 0.9) !important;
                }
              }
            `
          }}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: responsiveFontSize(16, 14, 18),
    marginLeft: 4,
    fontFamily: fontFamilies.button,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
    zIndex: 1,
  },
  loadingText: {
    marginTop: 12,
    fontSize: responsiveFontSize(16, 14, 18),
    fontFamily: fontFamilies.text,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    zIndex: 1,
  },
  serviceTitle: {
    fontSize: responsiveFontSize(22, 20, 28),
    fontWeight: '700',
    fontFamily: fontFamilies.title,
    flex: 1,
    marginRight: 8,
  },
  priceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#AE00FF',
    borderRadius: 16,
  },
  priceText: {
    fontSize: responsiveFontSize(14, 12, 16),
    fontWeight: '600',
    fontFamily: fontFamilies.button,
  },
  imageContainer: {
    marginBottom: 24,
    zIndex: 1,
  },
  mainImage: {
    width: '100%',
    height: 240,
    borderRadius: 16,
    backgroundColor: 'rgba(174, 0, 255, 0.1)',
  },
  placeholderImage: {
    width: '100%',
    height: 240,
    borderRadius: 16,
    backgroundColor: 'rgba(174, 0, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailsContainer: {
    marginTop: 12,
  },
  thumbnailWrapper: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  activeThumbnail: {
    borderColor: '#31E1F7',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  providerCard: {
    backgroundColor: 'rgba(174, 0, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(235, 211, 248, 0.2)',
    zIndex: 1,
  },
  providerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  providerImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#31E1F7',
  },
  providerImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: responsiveFontSize(18, 16, 22),
    fontWeight: '600',
    fontFamily: fontFamilies.subtitle,
    marginBottom: 4,
  },
  providerSubtitle: {
    fontSize: responsiveFontSize(14, 12, 16),
    fontFamily: fontFamilies.text,
    opacity: 0.8,
  },
  aboutTitle: {
    fontSize: responsiveFontSize(18, 16, 20),
    fontWeight: '600',
    fontFamily: fontFamilies.subtitle,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: responsiveFontSize(14, 13, 16),
    lineHeight: 22,
    fontFamily: fontFamilies.text,
    marginBottom: 16,
  },
  detailsSection: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: responsiveFontSize(14, 13, 16),
    fontFamily: fontFamilies.text,
  },
  detailsCard: {
    backgroundColor: 'rgba(174, 0, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(235, 211, 248, 0.2)',
    zIndex: 1,
  },
  cardTitle: {
    fontSize: responsiveFontSize(18, 16, 20),
    fontWeight: '600',
    fontFamily: fontFamilies.subtitle,
    marginBottom: 16,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  detailsGridItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '45%',
  },
  detailsGridText: {
    fontSize: responsiveFontSize(14, 13, 16),
    fontFamily: fontFamilies.text,
    flex: 1,
  },
  bookingCard: {
    backgroundColor: 'rgba(174, 0, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(235, 211, 248, 0.2)',
    zIndex: 1,
  },
  timeSlotLabel: {
    fontSize: responsiveFontSize(14, 12, 16),
    fontFamily: fontFamilies.text,
    marginBottom: 12,
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  timeSlot: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(49, 225, 247, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(49, 225, 247, 0.3)',
    minWidth: '30%',
    alignItems: 'center',
  },
  selectedTimeSlot: {
    backgroundColor: 'rgba(49, 225, 247, 0.2)',
    borderColor: '#31E1F7',
  },
  unavailableTimeSlot: {
    backgroundColor: 'rgba(174, 0, 255, 0.05)',
    borderColor: 'rgba(235, 211, 248, 0.1)',
  },
  timeSlotText: {
    fontSize: responsiveFontSize(14, 12, 16),
    fontFamily: fontFamilies.text,
    color: '#31E1F7',
  },
  selectedTimeSlotText: {
    color: '#31E1F7',
    fontWeight: '600',
  },
  unavailableTimeSlotText: {
    color: 'rgba(235, 211, 248, 0.4)',
  },
  bookButton: {
    borderRadius: 28,
    overflow: 'hidden',
    height: 56,
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
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
    zIndex: 1,
  },
  errorText: {
    fontSize: responsiveFontSize(16, 14, 18),
    fontFamily: fontFamilies.text,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(49, 225, 247, 0.1)',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(49, 225, 247, 0.3)',
  },
  retryButtonText: {
    fontSize: responsiveFontSize(16, 14, 18),
    fontWeight: '600',
    fontFamily: fontFamilies.button,
  },
  dateLabel: {
    fontSize: responsiveFontSize(14, 12, 16),
    fontFamily: fontFamilies.text,
    marginBottom: 12,
  },
  datePickerContainer: {
    marginBottom: 20,
  },
  datePickerButton: {
    backgroundColor: 'rgba(174, 0, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(235, 211, 248, 0.2)',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  dateText: {
    fontSize: responsiveFontSize(14, 12, 16),
    fontFamily: fontFamilies.text,
  },
  loadingSlotsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingSlotsText: {
    fontSize: responsiveFontSize(14, 12, 16),
    fontFamily: fontFamilies.text,
    marginTop: 8,
  },
  emptySlotContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    opacity: 0.6,
  },
  emptySlotText: {
    fontSize: responsiveFontSize(14, 12, 16),
    fontFamily: fontFamilies.text,
    marginTop: 8,
    textAlign: 'center',
  },
  disabledBookButton: {
    opacity: 0.5,
  },
  dateContainer: {
    marginBottom: 20,
  },
  dateItem: {
    backgroundColor: 'rgba(174, 0, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(235, 211, 248, 0.2)',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quickDateContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 10,
  },
  quickDateItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(174, 0, 255, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(235, 211, 248, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDateItem: {
    backgroundColor: 'rgba(49, 225, 247, 0.2)',
    borderColor: '#31E1F7',
  },
  selectedDateText: {
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(64, 13, 81, 0.95)',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: 'rgba(235, 211, 248, 0.3)',
    alignItems: 'center',
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  datePickerCancel: {
    fontSize: responsiveFontSize(16, 14, 18),
    fontWeight: '600',
    fontFamily: fontFamilies.button,
  },
  datePickerConfirm: {
    fontSize: responsiveFontSize(16, 14, 18),
    fontWeight: '600',
    fontFamily: fontFamilies.button,
  },
  datePicker: {
    height: 260,
    width: '100%',
    ...(Platform.OS === 'web' ? { 
      backgroundColor: 'transparent',
      color: '#EBD3F8',
    } : {
      marginHorizontal: 0,
      width: '95%',
    }),
  },
  reviewsCard: {
    backgroundColor: 'rgba(174, 0, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(235, 211, 248, 0.2)',
    zIndex: 1,
  },
  reviewsList: {
    gap: 20,
    marginBottom: 24,
  },
  reviewItem: {
    backgroundColor: 'rgba(174, 0, 255, 0.08)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(235, 211, 248, 0.1)',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(174, 0, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  reviewerName: {
    fontSize: responsiveFontSize(14, 12, 16),
    fontWeight: '500',
    fontFamily: fontFamilies.subtitle,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewText: {
    fontSize: responsiveFontSize(14, 12, 16),
    lineHeight: 20,
    fontFamily: fontFamilies.text,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: responsiveFontSize(12, 10, 14),
    fontFamily: fontFamilies.text,
    textAlign: 'right',
  },
  emptyReviewsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    opacity: 0.6,
  },
  emptyReviewsText: {
    fontSize: responsiveFontSize(14, 12, 16),
    fontFamily: fontFamilies.text,
    marginTop: 8,
    textAlign: 'center',
  },
  writeReviewContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(235, 211, 248, 0.1)',
    paddingTop: 16,
    marginTop: 8,
  },
  writeReviewTitle: {
    fontSize: responsiveFontSize(16, 14, 18),
    fontWeight: '600',
    fontFamily: fontFamilies.subtitle,
    marginBottom: 12,
  },
  ratingInputContainer: {
    marginBottom: 16,
  },
  ratingLabel: {
    fontSize: responsiveFontSize(14, 12, 16),
    fontFamily: fontFamilies.text,
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  starIcon: {
    marginRight: 2,
  },
  commentInputContainer: {
    marginBottom: 16,
  },
  commentLabel: {
    fontSize: responsiveFontSize(14, 12, 16),
    fontFamily: fontFamilies.text,
    marginBottom: 8,
  },
  commentInput: {
    backgroundColor: 'rgba(174, 0, 255, 0.08)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(235, 211, 248, 0.2)',
    color: '#EBD3F8',
    fontSize: responsiveFontSize(14, 12, 16),
    fontFamily: fontFamilies.text,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitReviewButton: {
    borderRadius: 28,
    overflow: 'hidden',
    height: 48,
    marginTop: 8,
  },
  alreadyReviewedContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(235, 211, 248, 0.1)',
    marginTop: 8,
  },
  alreadyReviewedText: {
    fontSize: responsiveFontSize(14, 12, 16),
    fontFamily: fontFamilies.text,
  },
});