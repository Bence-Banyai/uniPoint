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
  Modal
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

export default function ServiceDetailsScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const serviceId = params.id as string;
  const { isAuthenticated } = useAuth();
  
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
  
  useEffect(() => {
    loadServiceData();
  }, [serviceId]);

  useEffect(() => {
    if (service) {
      fetchAvailableTimeSlots();
    }
  }, [service, selectedDate]);
  
  const loadServiceData = async () => {
    try {
      setLoading(true);
      // Fetch the service details using the ID from params
      const serviceData = await fetchServiceById(parseInt(serviceId, 10));
      setService(serviceData);
      
      // Fetch categories to get the service's category
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

  const onRefresh = async () => {
    setRefreshing(true);
    await loadServiceData();
    await fetchAvailableTimeSlots();
    setRefreshing(false);
  };
  
  // Function to calculate available time slots based on service opening/closing times and duration
  const fetchAvailableTimeSlots = async () => {
    if (!service) return;

    setLoadingSlots(true);
    try {
      // Fetch all open appointments for this service
      const appointments = await fetchAppointments();
      
      // Filter just the open appointments for this service
      const openAppointments = appointments.filter(
        (appointment: {serviceId: number; status: AppointmentStatus; appointmentDate: string}) => 
          appointment.serviceId === parseInt(serviceId, 10) && 
          appointment.status === AppointmentStatus.OPEN &&
          appointment.appointmentDate.split('T')[0] === selectedDate
      );
      
      // Format the appointments into usable time slots
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
        // Sort by time
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
      
      // Show success message and redirect to search screen
      if (Platform.OS === 'web') {
        // For web: Show an alert and then redirect
        window.alert('Your appointment has been successfully booked!');
        router.replace('/(tabs)/search');
      } else {
        // For mobile: Use the existing Alert.alert with callback
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
      // Refresh the available slots to get the latest status
      fetchAvailableTimeSlots();
    } finally {
      setIsBooking(false);
    }
  };
  
  const formatPrice = (price: number | undefined) => {
    if (price === undefined) return "Price not available";
    return price.toLocaleString() + " HUF";
  };
  
  const formatOpeningHours = (hours: number | undefined) => {
    if (hours === undefined) return "Hours not available";
    return `${hours}:00 - 18:00`;
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
    // For web, prevent default behavior and stop propagation
    if (Platform.OS === 'web' && event.nativeEvent) {
      event.stopPropagation?.();
      event.preventDefault?.();
    }

    // Close the picker immediately on iOS and Android
    if (Platform.OS !== 'web') {
      setShowDatePicker(false);
    }
    
    if (event.type === 'dismissed') {
      return;
    }
    
    if (selectedDate) {
      setTempDate(selectedDate);
      
      // Only update the selected date if we're on web or if confirm is pressed on mobile
      if (Platform.OS === 'web' || event.type === 'set') {
        const dateStr = selectedDate.toISOString().split('T')[0];
        handleDateChange(dateStr);
      }
    }
  };
  
  const noAvailableSlots = availableSlots.length === 0 && !loadingSlots;

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
                      Open: {formatOpeningHours(service.openingHours)}
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
                            themeVariant="dark" // Add this for dark mode support
                            textColor="#EBD3F8" // Add this to set text color
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
                              // This will stop the event from propagating to the parent TouchableOpacity
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
                            
                            {/* For web, we'll use an HTML input type="date" with improved styling */}
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

              /* Calendar icon styling - make it match the app's color scheme */
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
              
              /* Text styling inside the date picker */
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
              
              /* Focus state - give it a nice glow effect like other elements */
              .custom-datepicker:focus {
                border-color: #31E1F7 !important;
                box-shadow: 0 0 0 3px rgba(49, 225, 247, 0.2) !important;
              }
              
              /* Make sure our calendar doesn't get cut off */
              input[type="date"]::-webkit-calendar-picker-indicator {
                margin-left: 8px !important;
              }
              
              /* Browser-specific overrides */
              @-moz-document url-prefix() {
                .custom-datepicker {
                  background-image: none !important;
                  padding-right: 12px !important;
                }
              }
              
              /* Dark mode calendar support */
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
});