import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  View,
  Text,
  Alert,
} from "react-native";
import { Stack, router } from "expo-router";
import { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Location from 'expo-location';
import { useAuth } from './context/AuthContext';

import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from '@/hooks/useColorScheme';

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
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [locationStatus, setLocationStatus] = useState("Not requested");
  const [locationDetails, setLocationDetails] = useState("");
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const { register, isLoading: authLoading } = useAuth();
  
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

  const handleRegister = async () => {
    setIsLoading(true);
    
    try {
      await register({
        userName: username,
        email: email,
        phoneNumber: phoneNumber,
        password: password,
        role: 'User' // Default role for new users
      });
      
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Registration failed:', error);
      Alert.alert('Registration Failed', 'Please check your information and try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBack = () => {
    router.replace('/welcome');
  };

  const requestLocationPermission = async () => {
    setIsLoading(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        setLocationStatus('Granted');
        const location = await Location.getCurrentPositionAsync({});

        const geocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (geocode && geocode.length > 0) {
          const address = geocode[0];
          const formattedAddress = `${address.postalCode || ''} ${address.city || ''}, ${address.street || ''} ${address.name || ''}`.trim();
          setLocationDetails(formattedAddress);
        } else {
          setLocationDetails(`Location found (${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)})`);
        }
      } else {
        setLocationStatus('Denied');
        Alert.alert(
          "Location Access Denied",
          "You can manually enter your location below.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error('Error getting location:', error);
      setLocationStatus('Error');
      Alert.alert("Error", "Could not access location services.");
    } finally {
      setIsLoading(false);
    }
  };

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
              Join the future of connectivity
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
                  Full Name
                </ThemedText>
                <TextInput
                  placeholder="Enter your full name"
                  placeholderTextColor="rgba(235, 211, 248, 0.5)"
                  value={fullName}
                  onChangeText={setFullName}
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
                  Username
                </ThemedText>
                <TextInput
                  placeholder="Enter your username"
                  placeholderTextColor="rgba(235, 211, 248, 0.5)"
                  value={username}
                  onChangeText={setUsername}
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
                <TextInput
                  placeholder="Create a password"
                  placeholderTextColor="rgba(235, 211, 248, 0.5)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
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
                  Phone Number
                </ThemedText>
                <TextInput
                  placeholder="Enter your phone number"
                  placeholderTextColor="rgba(235, 211, 248, 0.5)"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
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
                  Location
                </ThemedText>

                <TextInput
                  placeholder="Enter your location"
                  placeholderTextColor="rgba(235, 211, 248, 0.5)"
                  value={locationDetails}
                  onChangeText={setLocationDetails}
                  selectionColor="#31E1F7"
                  onFocus={Platform.OS === 'web' ? undefined : async () => {
                    const { status } = await Location.requestForegroundPermissionsAsync();

                    if (status === 'granted') {
                      setLocationStatus('Granted');
                      try {
                        const location = await Location.getCurrentPositionAsync({});
                        const geocode = await Location.reverseGeocodeAsync({
                          latitude: location.coords.latitude,
                          longitude: location.coords.longitude,
                        });

                        if (geocode && geocode.length > 0) {
                          const address = geocode[0];
                          const formattedAddress = `${address.postalCode || ''} ${address.city || ''}, ${address.street || ''} ${address.name || ''}`.trim();
                          setLocationDetails(formattedAddress);
                        } else {
                          setLocationDetails(`Lat: ${location.coords.latitude.toFixed(4)}, Lon: ${location.coords.longitude.toFixed(4)}`);
                        }
                      } catch (error) {
                        console.error("Error getting location:", error);
                        Alert.alert("Error", "Unable to retrieve location details.");
                      }
                    } else {
                      setLocationStatus('Denied');
                      Alert.alert(
                        "Permission Denied",
                        "You can manually enter your location below."
                      );
                    }
                  }}
                  style={[
                    styles.input,
                    {
                      color: "#EBD3F8",
                      fontSize: inputFontSize,
                      height: inputHeight,
                      paddingHorizontal: isSmallDevice ? 15 : 20,
                    },
                  ]}
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  { 
                    height: buttonHeight,
                    marginTop: isSmallDevice ? 25 : 35 
                  }
                ]}
                onPress={handleRegister}
                disabled={isLoading}
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
                    {isLoading ? "Creating account..." : "Create Account"}
                  </ThemedText>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.signInContainer}
                onPress={() => router.replace('/login')}
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
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  locationText: {
    fontFamily: fontFamilies.text,
    flex: 1,
  },
  locationButtonText: {
    fontFamily: fontFamilies.text,
    flex: 1,
  },
});
