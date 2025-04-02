import { useState, useCallback } from "react";
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
} from "react-native";
import { Stack, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from './context/AuthContext';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("User"); // Default role
  
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

  const handleRegister = useCallback(async () => {
    setIsLoading(true);

    // Input validation
    if (!username || !email || !password || !phoneNumber) {
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

    // Phone number validation
    const phoneRegex = /^\+?[0-9]{6,15}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s+/g, ''))) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid phone number.');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Attempting to register user with data:', { username, email, phoneNumber });

      // Create user payload according to your backend requirements
      const userData = {
        userName: username,
        email: email,
        phoneNumber: phoneNumber,
        password: password,
        role: role, // Using the default 'User' role
      };

      // Call the register function from AuthContext
      console.log('Sending registration data:', userData);

      try {
        const result = await register(userData);
        console.log('Registration successful, result:', result);

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
      }
    } catch (error: any) {
      console.error('Registration process error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [username, email, password, phoneNumber, role, register, login, router]);

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

              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  { 
                    height: buttonHeight,
                    marginTop: isSmallDevice ? 25 : 35 
                  }
                ]}
                onPress={handleRegister}
                disabled={isLoading || authLoading || !username || !email || !password || !phoneNumber}
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
});