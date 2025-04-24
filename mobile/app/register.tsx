import 'react-native-get-random-values';
import { useState, useCallback, useEffect, useRef } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  View,
  Text,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Stack, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from './context/AuthContext';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as Location from 'expo-location';
import * as SecureStore from 'expo-secure-store';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { MaterialIcons } from '@expo/vector-icons';

// Add these interfaces at the top of your file
declare global {
  interface Window {
    google?: {
      maps?: {
        places: {
          Autocomplete: new (input: HTMLInputElement, options?: any) => any;
        };
      };
    };
  }
}

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

export default function RegisterScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("User"); // Default role
  const [location, setLocation] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isLocationValid, setIsLocationValid] = useState(false); // Add this state to track if the location is valid (selected from dropdown)
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, login, isLoading: authLoading } = useAuth();
  
  const isSmallDevice = screenWidth < 380;
  const isLargeDevice = screenWidth >= 768;
  
  const buttonHeight = isLargeDevice ? 66 : isSmallDevice ? 50 : 56;
  const inputHeight = isLargeDevice ? 66 : isSmallDevice ? 50 : 56;
  const contentPadding = isLargeDevice ? 60 : isSmallDevice ? 20 : 30;
  const titleMargin = isLargeDevice ? 50 : isSmallDevice ? 30 : 40;
  
  const titleFontSize = responsiveFontSize(22, 22, 42);
  const subtitleFontSize = responsiveFontSize(16, 14, 20);
  const labelFontSize = responsiveFontSize(16, 14, 18);
  const inputFontSize = responsiveFontSize(16, 14, 18);
  const buttonFontSize = responsiveFontSize(18, 16, 20);
  const footerFontSize = responsiveFontSize(14, 12, 16);

  const handleBack = useCallback(() => {
    router.replace('/welcome');
  }, []);

  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'web') return false;
    
    setIsGettingLocation(true);
    try {
      // Check if we already have permission before requesting it
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      
      // If we don't have permission yet, request it
      if (existingStatus !== 'granted') {
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          // User denied permission - show a more helpful message
          Alert.alert(
            'Location Permission',
            'Location permission is needed to automatically fill in your current location. You can still enter it manually.',
            [{ text: 'OK' }]
          );
          setIsGettingLocation(false);
          return false;
        }
      }
      
      // We have permission, get the current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced // Use balanced accuracy for faster results
      });
      const { latitude, longitude } = location.coords;
      
      // Get readable address using reverse geocoding
      try {
        const [address] = await Location.reverseGeocodeAsync({
          latitude,
          longitude
        });
        
        if (address) {
          // Format the location as requested: {city}, {postalCode}. {houseNumber}
          const { city, postalCode, streetNumber, street, region, country } = address;
          
          // Build a comprehensive location string
          const locationParts = [];
          
          // Add detailed location components with fallbacks
          if (street) {
            const streetWithNumber = streetNumber ? `${street} ${streetNumber}` : street;
            locationParts.push(streetWithNumber);
          }
          
          if (city) locationParts.push(city);
          if (postalCode) locationParts.push(postalCode);
          if (!city && region) locationParts.push(region);
          if (country) locationParts.push(country);
          
          let locationString = locationParts.join(', ');
          
          // If we couldn't get enough address details, fall back to coordinates
          if (!locationString) {
            locationString = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          }
          
          // Store location in state 
          setLocation(locationString);
          setIsLocationValid(true); // Mark as valid when using GPS
          
          // Directly update the GooglePlacesAutocomplete component with the location
          if (locationInputRef.current && locationInputRef.current.setAddressText) {
            locationInputRef.current.setAddressText(locationString);
          }
          
          setIsGettingLocation(false);
          return true;
        } else {
          // Fallback to coordinates if reverse geocoding returns no results
          const locationString = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setLocation(locationString);
          
          // Directly update the GooglePlacesAutocomplete component with the coordinates
          if (locationInputRef.current && locationInputRef.current.setAddressText) {
            locationInputRef.current.setAddressText(locationString);
          }
          
          setIsGettingLocation(false);
          return true;
        }
      } catch (geocodeError) {
        console.error('Error with geocoding:', geocodeError);
        // Fallback to coordinates
        const locationString = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        setLocation(locationString);
        setIsLocationValid(true); // Mark as valid when using GPS
        
        // Directly update the GooglePlacesAutocomplete component with the coordinates
        if (locationInputRef.current && locationInputRef.current.setAddressText) {
          locationInputRef.current.setAddressText(locationString);
        }
        
        setIsGettingLocation(false);
        return true;
      }
      
    } catch (err) {
      console.error('Error getting location:', err);
      Alert.alert('Error', 'Unable to get your location. Please enter it manually.');
      setIsGettingLocation(false);
      return false;
    }
  };

  const handleRegister = useCallback(async () => {
    setIsLoading(true);

    // Input validation
    if (!username || !email || !password || !location) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    // Location validation
    if (!location) {
      Alert.alert('Missing Location', 'Please enter your location or use the Get Location button.');
      setIsLoading(false);
      return;
    }
    
    // Add this check to ensure location is valid
    if (!isLocationValid) {
      Alert.alert(
        'Invalid Location', 
        'Please select a location from the dropdown suggestions or use the Get Location button.'
      );
      setIsLoading(false);
      return;
    }

    try {
      console.log('Sending registration data with location:', location);
      
      const userData = {
        userName: username,
        email: email,
        location: location,  // Add location as a property
        password: password,
        role: role
      };
      
      // Store location in SecureStore outside of the object definition
      if (Platform.OS === 'web') {
        localStorage.setItem('userLocation', location);
        console.log('Web: Saved location during registration:', location);
      } else {
        await SecureStore.setItemAsync('userLocation', location);
        console.log('Native: Saved location during registration:', location);
      }

      // Call the register function from AuthContext
      const result = await register(userData);

      // After successful registration, automatically log in
      try {
        console.log('Attempting automatic login after registration');
        const loginResult = await login({ 
          userNameOrEmail: username, 
          password: password 
        });
        
        // Update the navigation path after successful login
        if (loginResult) {
          console.log('Login successful, navigating directly');
          
          try {
            // Skip the alert entirely for now, just to confirm navigation works
            router.replace('/(tabs)');
            console.log('Navigation executed');
          } catch (navError) {
            console.error('Direct navigation error:', navError);
            
            // Try alternative navigation method
            try {
              console.log('Trying alternative navigation method');
              router.navigate('/(tabs)');
            } catch (altError) {
              console.error('Alternative navigation error:', altError);
            }
          }
        }
      } catch (loginError) {
        console.error('Auto-login failed after registration:', loginError);
        // If auto-login fails, fall back to redirecting to login screen
        Alert.alert('Account Created', 'Your account was created, but we couldn\'t log you in automatically. Please log in with your credentials.', [
          { 
            text: 'OK', 
            onPress: () => {
              router.replace('/login');
            } 
          },
        ]);
      }
    } catch (error: any) {
      console.error('Registration API error:', error);
      
      // If we're in development mode on web, show a special dialog
      if (Platform.OS === 'web' && process.env.NODE_ENV === 'development') {
        Alert.alert(
          'Development Mode',
          'Backend connection failed. Would you like to continue with mock registration?',
          [
            {
              text: 'Yes',
              onPress: async () => {
                console.log('Proceeding with mock registration');
                try {
                  // Attempt mock login after mock registration
                  await login({ userNameOrEmail: username, password: password });
                  router.replace('/');
                  console.log('Navigation successful');
                } catch (mockError) {
                  console.error('Mock login error:', mockError);
                  router.replace('/login');
                }
              },
            },
            { text: 'No' },
          ]
        );
      } else {
        // Normal error handling for production
        let errorMessage = 'Please check your information and try again.';
        if (error instanceof Error) {
          errorMessage = error.message || errorMessage;
        }
        Alert.alert('Registration Failed', errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [username, email, password, location, role, register, login, router]);

  const mapScriptLoaded = useRef(false);
  const autocompleteInitialized = useRef(false);
  const inputRef = useRef<TextInput>(null);
  const locationInputRef = useRef<any>(null); // Add this line for GooglePlacesAutocomplete

  // Add this useEffect to load and initialize Google Places Autocomplete for web
  useEffect(() => {
    if (Platform.OS === 'web' && !mapScriptLoaded.current) {
      mapScriptLoaded.current = true;
      
      // Add custom CSS for Google Places autocomplete dropdown
      const style = document.createElement('style');
      style.textContent = `
        .pac-container {
          background-color: rgba(64, 13, 81, 0.95) !important;
          border: 1px solid rgba(235, 211, 248, 0.3) !important;
          border-radius: 12px !important;
          box-shadow: 0 4px 8px rgba(248, 6, 204, 0.2) !important;
          padding: 5px !important;
          margin-top: 5px !important;
          z-index: 1000 !important;
          max-height: 220px !important;
          overflow-y: auto !important;
        }
        .pac-item {
          border-color: rgba(235, 211, 248, 0.15) !important;
          padding: 8px !important;
          cursor: pointer !important;
        }
        .pac-item:hover {
          background-color: rgba(174, 0, 255, 0.2) !important;
        }
        .pac-item-query, .pac-matched, .pac-item span:not(.pac-icon) {
          color: #EBD3F8 !important;
          font-family: ${fontFamilies.text} !important;
          font-size: ${inputFontSize * 0.9}px !important;
        }
        .pac-icon {
          filter: brightness(1.5) !important;
        }
      `;
      document.head.appendChild(style);
      
      // Create script element to load Google Maps API
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDNWQQy6PXKyZvdYyC8_MmLP8EVTIP6tAs&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log("Google Maps script loaded");
        // Add a slight delay to ensure component is fully rendered
        setTimeout(() => {
          initializeAutocomplete();
        }, 300);
      };
      
      document.head.appendChild(script);
      
      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      };
    }
  }, []);

  // Add this function to initialize Google Places Autocomplete on the web input
  const initializeAutocomplete = () => {
    if (Platform.OS !== 'web' || !inputRef.current || !window.google || !window.google.maps) return;
    
    try {
      // This approach will work more reliably in the web environment
      setTimeout(() => {
        // Find the input element by its placeholder text
        const inputElements = document.querySelectorAll('input');
        let locationInput = null;
        
        for (let i = 0; i < inputElements.length; i++) {
          const elem = inputElements[i];
          if (elem.placeholder === "Enter your location") {
            locationInput = elem;
            break;
          }
        }
        
        if (locationInput) {
          console.log("Found location input, initializing autocomplete");
          autocompleteInitialized.current = true;
          
          // Use type assertion to tell TypeScript you're sure these properties exist
          const autocomplete = new (window.google!.maps!.places.Autocomplete)(
            locationInput as HTMLInputElement,
            { types: ['geocode'] }
          );
          
          // Add listener for place selection
          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place && place.formatted_address) {
              setLocation(place.formatted_address);
              setIsLocationValid(true); // Mark as valid when selected from dropdown
              console.log("Selected location:", place.formatted_address);
            }
          });
        } else {
          console.error("Could not find location input element");
        }
      }, 500);
    } catch (error) {
      console.error("Error initializing autocomplete:", error);
    }
  };

  console.log('Button disabled due to:', {
    isLoading,
    authLoading,
    username: !username,
    email: !email,
    password: !password,
    location: !location,
    isLocationValid: !isLocationValid
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LinearGradient
        colors={["#2E0249", "#570A57", "#A91079"]}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Stack.Screen options={{ headerShown: false }} />
        
        <View
          style={[
            styles.glowCircle,
            { 
              top: -screenHeight * (isLargeDevice ? 0.15 : 0.2), 
              left: -screenWidth * (isLargeDevice ? 0.3 : 0.4) 
            },
          ]}
        />
        <View
          style={[
            styles.glowCircle2,
            { 
              bottom: -screenHeight * (isLargeDevice ? 0.1 : 0.15), 
              right: -screenWidth * (isLargeDevice ? 0.2 : 0.3) 
            },
          ]}
        />

        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            isLargeDevice && { paddingHorizontal: 40 }
          ]}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
        >
          <View style={[
            styles.header, 
            { 
              marginTop: insets.top || (isSmallDevice ? 10 : 20),
              paddingHorizontal: isSmallDevice ? 15 : 20
            }
          ]}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <IconSymbol
                name="chevron.right"
                size={isSmallDevice ? 18 : 20}
                style={{ transform: [{ rotate: "180deg" }] }}
                color="#EBD3F8"
              />
            </TouchableOpacity>
          </View>

          <View style={[
            styles.contentContainer, 
            { 
              paddingHorizontal: contentPadding,
              maxWidth: isLargeDevice ? 560 : 480
            }
          ]}>
            <ThemedText 
              style={[
                styles.title, 
                { 
                  fontSize: titleFontSize,
                  marginBottom: titleMargin / 2
                }
              ]} 
              darkColor="#fff" 
              lightColor="#fff"
            >
              Create Account
            </ThemedText>
            
            <ThemedText
              style={[
                styles.subtitle,
                { fontSize: subtitleFontSize, marginBottom: titleMargin / 1.5 }
              ]}
              darkColor="#EBD3F8"
              lightColor="#EBD3F8"
            >
              Join UniPoint and connect with your university community
            </ThemedText>

            <View style={[
              styles.formContainer,
              { gap: isSmallDevice ? 16 : 20 }
            ]}>
              <View style={styles.inputContainer}>
                <ThemedText
                  style={[styles.label, { fontSize: labelFontSize }]}
                  darkColor="#EBD3F8"
                  lightColor="#EBD3F8"
                >
                  Username
                </ThemedText>
                <TextInput
                  placeholder="Enter your username"
                  placeholderTextColor="rgba(235, 211, 248, 0.5)"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  selectionColor="#31E1F7"
                  style={[
                    styles.input, 
                    { 
                      color: "#EBD3F8",
                      fontSize: inputFontSize,
                      height: inputHeight,
                      paddingHorizontal: isSmallDevice ? 15 : 20
                    }
                  ]}
                />
              </View>

              <View style={styles.inputContainer}>
                <ThemedText
                  style={[styles.label, { fontSize: labelFontSize }]}
                  darkColor="#EBD3F8"
                  lightColor="#EBD3F8"
                >
                  Email
                </ThemedText>
                <TextInput
                  placeholder="Enter your email"
                  placeholderTextColor="rgba(235, 211, 248, 0.5)"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  selectionColor="#31E1F7"
                  style={[
                    styles.input, 
                    { 
                      color: "#EBD3F8",
                      fontSize: inputFontSize,
                      height: inputHeight,
                      paddingHorizontal: isSmallDevice ? 15 : 20
                    }
                  ]}
                />
              </View>

              <View style={styles.inputContainer}>
                <ThemedText
                  style={[styles.label, { fontSize: labelFontSize }]}
                  darkColor="#EBD3F8"
                  lightColor="#EBD3F8"
                >
                  Password
                </ThemedText>
                <View style={styles.passwordContainer}>
                  <TextInput
                    placeholder="Create a password"
                    placeholderTextColor="rgba(235, 211, 248, 0.5)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    selectionColor="#31E1F7"
                    style={[
                      styles.passwordInput, 
                      { 
                        color: "#EBD3F8",
                        fontSize: inputFontSize,
                        height: inputHeight,
                        paddingHorizontal: isSmallDevice ? 15 : 20
                      }
                    ]}
                  />
                  <TouchableOpacity 
                    style={styles.eyeButton} 
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <MaterialIcons 
                      name={showPassword ? "visibility-off" : "visibility"} 
                      size={24} 
                      color="#EBD3F8" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <ThemedText
                  style={[styles.label, { fontSize: labelFontSize }]}
                  darkColor="#EBD3F8"
                  lightColor="#EBD3F8"
                >
                  Location
                </ThemedText>
                
                {Platform.OS === 'web' ? (
                  // Improved web implementation with Google Places API
                  <View>
                    <TextInput
                      ref={inputRef}
                      placeholder="Enter your location"
                      placeholderTextColor="rgba(235, 211, 248, 0.5)"
                      value={location}
                      onChangeText={(text) => {
                        setLocation(text);
                        setIsLocationValid(text.length > 3); // Simple validation - at least 4 characters
                        
                        // Existing code - set to false initially for dropdown flow
                        if (text.length <= 3) {
                          setIsLocationValid(false);
                        }
                      }}
                      selectionColor="#31E1F7"
                      style={[
                        styles.input, 
                        { 
                          color: "#EBD3F8",
                          fontSize: inputFontSize,
                          height: inputHeight,
                          paddingHorizontal: isSmallDevice ? 15 : 20
                        }
                      ]}
                      onFocus={() => {
                        if (Platform.OS === 'web' && !autocompleteInitialized.current && window.google && window.google.maps) {
                          initializeAutocomplete();
                        }
                      }}
                    />
                    <ThemedText
                      style={{
                        fontSize: labelFontSize * 0.7,
                        marginTop: 8,
                        color: "#EBD3F8",
                        opacity: 0.7
                      }}
                      darkColor="#EBD3F8"
                      lightColor="#EBD3F8"
                    >
                      Start typing to see location suggestions
                    </ThemedText>
                  </View>
                ) : (
                  // Mobile implementation (unchanged)
                  <GooglePlacesAutocomplete
                    placeholder="Search for your location"
                    onPress={(data, details = null) => {
                      // 'details' is provided when fetchDetails = true
                      const locationString = data.description;
                      setLocation(locationString);
                      setIsLocationValid(true); // Mark location as valid when selected from dropdown
                    }}
                    fetchDetails={true}
                    enablePoweredByContainer={false} // Optional: removes the "Powered by Google" footer
                    // Add the following props
                    listViewDisplayed={false} // Only display the list when typing
                    keyboardShouldPersistTaps="handled"
                    disableScroll={true} // Important to prevent nested scrolling issues
                    query={{
                      key: 'AIzaSyDNWQQy6PXKyZvdYyC8_MmLP8EVTIP6tAs',
                      language: 'en',
                    }}
                    textInputProps={{
                      onFocus: async () => {
                        // When the user taps into the field, request location permission if no location
                        if (!location) {
                          await requestLocationPermission();
                          // No need for the setTimeout or extra steps - the function now
                          // directly updates the component via setAddressText
                        }
                      },
                      // Add this to invalidate the location when user types manually
                      onChangeText: (text) => {
                        // Allow manual entry by setting isLocationValid to true when text is long enough
                        setIsLocationValid(text.length > 3); // Simple validation - at least 4 characters
                        
                        // Existing code - set to false initially for dropdown flow
                        if (text.length <= 3) {
                          setIsLocationValid(false);
                        }
                      },
                      placeholderTextColor: "rgba(235, 211, 248, 0.5)",
                      selectionColor: "#31E1F7",
                    }}
                    styles={{
                      textInput: {
                        color: "#EBD3F8",
                        fontSize: inputFontSize,
                        height: inputHeight,
                        backgroundColor: "rgba(174, 0, 255, 0.1)",
                        borderWidth: 1,
                        borderColor: "rgba(235, 211, 248, 0.3)",
                        borderRadius: 28,
                        paddingHorizontal: isSmallDevice ? 15 : 20,
                        fontFamily: fontFamilies.text,
                      },
                      container: {
                        flex: 0,
                      },
                      listView: {
                        backgroundColor: 'rgba(64, 13, 81, 0.95)', // More transparent to see the glow circles
                        borderWidth: 1,
                        borderColor: 'rgba(235, 211, 248, 0.3)',
                        borderRadius: 12,
                        position: 'absolute',
                        top: inputHeight + 5,
                        left: 0,
                        right: 0,
                        zIndex: 1000,
                        maxHeight: 220, // Limit the height to prevent it from taking too much space
                        shadowColor: "#F806CC",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.2,
                        shadowRadius: 8,
                        elevation: 5,
                      },
                      row: {
                        backgroundColor: 'transparent', // Transparent to show the parent background
                        padding: 15,
                        height: 'auto',
                        minHeight: 48,
                        flexDirection: 'row',
                        alignItems: 'center',
                      },
                      separator: {
                        height: 1,
                        backgroundColor: "rgba(235, 211, 248, 0.15)", // Lighter separator
                      },
                      description: {
                        color: '#EBD3F8',
                        fontSize: inputFontSize * 0.9,
                        fontFamily: fontFamilies.text,
                      },
                      predefinedPlacesDescription: {
                        color: '#31E1F7', // Highlight color for predefined places
                      },
                      poweredContainer: {
                        backgroundColor: 'rgba(64, 13, 81, 0.8)',
                        borderBottomLeftRadius: 12,
                        borderBottomRightRadius: 12,
                        borderColor: 'rgba(235, 211, 248, 0.2)',
                        borderTopWidth: 0.5,
                        padding: 8,
                      },
                      powered: {
                        height: 14,
                        opacity: 0.8,
                      },
                    }}
                    renderRightButton={() => {
                      if (isGettingLocation) {
                        return (
                          <View style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingRight: 15
                          }}>
                            <ActivityIndicator size="small" color="#31E1F7" />
                          </View>
                        );
                      } 
                      
                      if (location) {
                        return (
                          <TouchableOpacity
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                              paddingRight: 15
                            }}
                            onPress={() => {
                              setLocation("");
                            }}
                          >
                            <IconSymbol
                              name="checkmark.circle.fill"  // Changed from xmark.circle.fill to an allowed icon
                              size={18}
                              color="rgba(235, 211, 248, 0.6)"
                            />
                          </TouchableOpacity>
                        );
                      }
                      
                      // Return an empty View instead of null
                      return <View style={{ width: 15 }} />;
                    }}
                    ref={(ref) => {
                      // Store a reference to the GooglePlacesAutocomplete component
                      locationInputRef.current = ref;
                    }}
                  />
                )}

                {!isLocationValid && location.length > 0 && (
                  <ThemedText
                    style={{
                      color: "#F806CC",
                      fontSize: labelFontSize * 0.7,
                      marginTop: 4
                    }}
                  >
                    Please select a location from suggestions or use Get Location
                  </ThemedText>
                )}
              </View>

              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  { 
                    height: buttonHeight,
                    marginTop: isSmallDevice ? 25 : 35,
                    opacity: (isLoading || authLoading || !username || !email || !password || !location || !isLocationValid) ? 0.5 : 1
                  }
                ]}
                onPress={handleRegister}
                disabled={isLoading || authLoading || !username || !email || !password || !location || !isLocationValid}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#31E1F7", "#6EDCD9"]}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <ThemedText
                    style={[styles.buttonText, { fontSize: buttonFontSize }]}
                    lightColor="#400D51"
                    darkColor="#400D51"
                  >
                    {isLoading || authLoading ? "Creating account..." : "Create Account"}
                  </ThemedText>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.signInContainer}
                onPress={() => {
                  console.log('Attempting to navigate to:', '/login');
                  try {
                    router.replace('/login');
                    console.log('Navigation successful');
                  } catch (navError) {
                    console.error('Navigation error:', navError);
                  }
                }}
              >
                <ThemedText
                  style={[styles.signInText, { fontSize: footerFontSize }]}
                  darkColor="#EBD3F8"
                  lightColor="#EBD3F8"
                >
                  Already have an account? <Text style={styles.signInLink}>Sign In</Text>
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={[
              styles.footerContainer,
              { marginBottom: insets.bottom || (isSmallDevice ? 10 : 20) },
            ]}
          >
            <ThemedText
              style={[styles.footerText, { fontSize: footerFontSize - 2 }]}
              darkColor="#E5B8F4"
              lightColor="#E5B8F4"
            >
              v1.0.0 • Create your future
            </ThemedText>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
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
  header: {
    paddingBottom: 10,
    zIndex: 1,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(174, 0, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    alignSelf: "center",
    zIndex: 1,
  },
  title: {
    fontWeight: "700",
    textAlign: "center",
    fontFamily: fontFamilies.title,
    textShadowColor: "#F806CC",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.8,
    textAlign: "center",
    fontFamily: fontFamilies.subtitle,
  },
  formContainer: {
    width: "100%",
  },
  inputContainer: {
    width: "100%",
  },
  label: {
    marginBottom: 8,
    fontFamily: fontFamilies.subtitle,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(235, 211, 248, 0.3)",
    borderRadius: 28,
    backgroundColor: "rgba(174, 0, 255, 0.1)",
    fontFamily: fontFamilies.text,
  },
  primaryButton: {
    width: "100%",
    borderRadius: 28,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#31E1F7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  buttonGradient: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontWeight: "bold",
    letterSpacing: 1,
    fontFamily: fontFamilies.button,
  },
  signInContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  signInText: {
    textAlign: "center",
    fontFamily: fontFamilies.text,
  },
  signInLink: {
    color: "#31E1F7",
    fontWeight: "600",
  },
  footerContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 15,
    zIndex: 1,
  },
  footerText: {
    opacity: 0.6,
    fontFamily: fontFamilies.text,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "rgba(235, 211, 248, 0.3)",
    borderRadius: 28,
    backgroundColor: "rgba(174, 0, 255, 0.1)",
  },
  passwordInput: {
    flex: 1,
    fontFamily: fontFamilies.text,
    borderRadius: 28,
  },
  eyeButton: {
    paddingHorizontal: 10,
  },
});