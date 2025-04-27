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
import { MaterialIcons } from '@expo/vector-icons';

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

export default function LoginScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const insets = useSafeAreaInsets();
  
  const [isLoading, setIsLoading] = useState(false);
  const [userNameOrEmail, setUserNameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, refreshUserInfo } = useAuth();
  
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
    console.log('Attempting to navigate to:', '/welcome');
    try {
      router.replace('/welcome');
      console.log('Navigation successful');
    } catch (navError) {
      console.error('Navigation error:', navError);
    }
  }, []);

  const handleLogin = useCallback(async () => {
    if (!userNameOrEmail || !password) {
      Alert.alert('Missing Information', 'Please enter your username/email and password.');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Attempting to login with:', userNameOrEmail);
      
      const result = await login({ userNameOrEmail, password });
      console.log('Login successful, result:', result);
      
      // Fetch user profile info (including profile picture) immediately after login
      try {
        await refreshUserInfo();
        console.log('User info refreshed successfully');
      } catch (refreshError) {
        console.error('Error refreshing user info:', refreshError);
        // Continue with navigation even if refresh fails
      }
      
      // Add a small delay on web platform before navigation
      if (Platform.OS === 'web') {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      console.log('Attempting to navigate to:', '/(tabs)');
      try {
        // First try replacing the route
        router.replace('/(tabs)');
        console.log('Navigation successful');
      } catch (navError) {
        console.error('Navigation error:', navError);
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      
      let errorMessage = 'Invalid credentials. Please check your username/email and password.';
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }
      
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [userNameOrEmail, password, login, refreshUserInfo]);

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
              Welcome Back
            </ThemedText>
            
            <ThemedText
              style={[
                styles.subtitle,
                { fontSize: subtitleFontSize, marginBottom: titleMargin / 1.5 }
              ]}
              darkColor="#EBD3F8"
              lightColor="#EBD3F8"
            >
              Log in to your UniPoint account
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
                  Username or Email
                </ThemedText>
                <TextInput
                  placeholder="Enter your username or email"
                  placeholderTextColor="rgba(235, 211, 248, 0.5)"
                  value={userNameOrEmail}
                  onChangeText={setUserNameOrEmail}
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
                    placeholder="Enter your password"
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

              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  { 
                    height: buttonHeight,
                    marginTop: isSmallDevice ? 25 : 35 
                  }
                ]}
                onPress={handleLogin}
                disabled={isLoading || !userNameOrEmail || !password}
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
                    {isLoading ? "Logging in..." : "Log In"}
                  </ThemedText>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.signInContainer}
                onPress={() => {
                  console.log('Attempting to navigate to:', '/register');
                  try {
                    router.replace('/register');
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
                  Don't have an account? <Text style={styles.signInLink}>Sign Up</Text>
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
              v1.0.0 • UniPoint
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