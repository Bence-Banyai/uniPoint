import {
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  View,
  Text,
  Platform,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

// Add this utility function for responsive font sizes
const responsiveFontSize = (size: number, minSize: number, maxSize: number) => {
  const { width, height } = Dimensions.get("window");
  const screenWidth = Math.min(width, height);
  const percent = screenWidth / 375; // Base size for design (iPhone X width)
  const responsiveSize = size * percent;
  return Math.max(minSize, Math.min(responsiveSize, maxSize));
};

export default function WelcomeScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const insets = useSafeAreaInsets();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Detect if running on web platform
  const isWeb = Platform.OS === "web";

  // Responsive sizing calculations
  const isSmallDevice = screenWidth < 380;
  const isLargeDevice = screenWidth >= 768;
  const logoSize = isLargeDevice ? 0.4 : isSmallDevice ? 0.6 : 0.7;

  // Calculate responsive font sizes
  const titleFontSize = responsiveFontSize(24, 22, 42);
  const subtitleFontSize = responsiveFontSize(18, 16, 22);
  const buttonFontSize = responsiveFontSize(18, 16, 20);
  const orTextFontSize = responsiveFontSize(14, 12, 16);
  const footerFontSize = responsiveFontSize(12, 10, 14);

  // Check if user is already logged in when welcome screen loads
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await SecureStore.getItemAsync("userToken");

        if (token) {
          // User is already logged in, go directly to the main app
          router.replace("/(tabs)");
        }
      } catch (e) {
        console.error("Failed to check auth status", e);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    // Short delay to ensure proper navigation
    const timer = setTimeout(checkAuthStatus, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSignIn = () => {
    router.replace("/login");
  };

  const handleCreateAccount = () => {
    router.replace("/register");
  };

  // Show loading indicator while checking authentication
  if (isCheckingAuth) {
    return (
      <LinearGradient
        colors={["#2E0249", "#570A57", "#A91079"]}
        style={[styles.container, styles.loadingContainer]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ActivityIndicator size="large" color="#31E1F7" />
      </LinearGradient>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={["#2E0249", "#570A57", "#A91079"]}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Background elements */}
        <View
          style={[
            styles.glowCircle,
            { top: -screenHeight * 0.2, left: -screenWidth * 0.4 },
          ]}
        />
        <View
          style={[
            styles.glowCircle2,
            { bottom: -screenHeight * 0.15, right: -screenWidth * 0.3 },
          ]}
        />

        {/* Content container with flex layout */}
        <View style={styles.contentWrapper}>
          {/* Logo section - responsive sizing */}
          <View
            style={[
              styles.logoContainer,
              {
                marginTop: isWeb
                  ? isLargeDevice
                    ? 160
                    : 120 // Increased from 40/30 to 80/60
                  : insets.top, // Use safe area insets on mobile
                ...(isSmallDevice &&
                  !isWeb && {
                    marginTop: Math.max(10, insets.top - 15),
                  }),
              },
            ]}
          >
            <Image
              source={require("@/assets/images/LogoGoat.png")}
              style={{
                width: screenWidth * logoSize,
                height: screenHeight * (logoSize / 2.2),
                maxWidth: 480,
                maxHeight: 300,
              }}
              resizeMode="contain"
            />
          </View>

          {/* Main content */}
          <View style={styles.contentContainer}>
            <View style={styles.titleContainer}>
              <ThemedText
                style={[styles.title, { fontSize: titleFontSize }]}
                darkColor="#fff"
                lightColor="#fff"
              >
                Welcome to <Text style={styles.highlight}>uniPoint</Text>
              </ThemedText>
              <ThemedText
                style={[styles.subtitle, { fontSize: subtitleFontSize }]}
                darkColor="#EBD3F8"
                lightColor="#EBD3F8"
              >
                The future of connectivity
              </ThemedText>
            </View>

            <View
              style={[styles.authContainer, isLargeDevice && { maxWidth: 450 }]}
            >
              <TouchableOpacity
                style={[styles.primaryButton, isLargeDevice && { height: 66 }]}
                onPress={handleSignIn}
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
                    Sign In
                  </ThemedText>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <ThemedText
                  style={[styles.orText, { fontSize: orTextFontSize }]}
                  darkColor="#E5B8F4"
                  lightColor="#E5B8F4"
                >
                  OR
                </ThemedText>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={[
                  styles.secondaryButton,
                  isLargeDevice && { height: 66 },
                ]}
                onPress={handleCreateAccount}
              >
                <ThemedText
                  style={[
                    styles.secondaryButtonText,
                    { fontSize: buttonFontSize },
                  ]}
                  darkColor="#31E1F7"
                  lightColor="#31E1F7"
                >
                  Create Account
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View
            style={[
              styles.footerContainer,
              { marginBottom: insets.bottom || 20 },
            ]}
          >
            <ThemedText
              style={[styles.footerText, { fontSize: footerFontSize }]}
              darkColor="#E5B8F4"
              lightColor="#E5B8F4"
            >
              v1.0.0 • Explore the Future
            </ThemedText>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
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
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Platform.OS === "ios" ? 8 : 4,
    marginBottom: 15,
  },
  contentContainer: {
    width: "100%",
    paddingHorizontal: "5%",
    alignItems: "center",
    zIndex: 1,
    flex: 1,
    justifyContent: "center",
    paddingBottom: "10%",
    paddingTop: Platform.OS === "ios" ? 10 : 20,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: "8%",
    width: "100%",
    paddingTop: 10,
  },
  title: {
    fontWeight: "700",
    textAlign: "center",
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }),
    textShadowColor: "#F806CC",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  highlight: {
    color: "#31E1F7",
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.8,
    textAlign: "center",
    fontFamily: Platform.select({
      ios: "Avenir-Medium",
      android: "sans-serif-medium",
    }),
  },
  authContainer: {
    width: "90%",
    maxWidth: 360,
    alignItems: "center",
    marginTop: "4%",
  },
  primaryButton: {
    width: "100%",
    height: 56,
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
    fontFamily: Platform.select({
      ios: "Avenir-Heavy",
      android: "sans-serif-medium",
    }),
  },
  divider: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5B8F4",
    opacity: 0.3,
  },
  orText: {
    marginHorizontal: 12,
    opacity: 0.6,
    fontFamily: Platform.select({ ios: "Avenir", android: "sans-serif" }),
  },
  secondaryButton: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#31E1F7",
    backgroundColor: "rgba(49, 225, 247, 0.1)",
  },
  secondaryButtonText: {
    fontWeight: "bold",
    letterSpacing: 1,
    fontFamily: Platform.select({
      ios: "Avenir-Heavy",
      android: "sans-serif-medium",
    }),
  },
  footerContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 15,
  },
  footerText: {
    opacity: 0.6,
    fontFamily: Platform.select({ ios: "Avenir", android: "sans-serif" }),
  },
});
