import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Dimensions,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { IconSymbol } from "@/components/ui/IconSymbol";

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
  const colorScheme = useColorScheme() ?? "light";
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const isSmallDevice = screenWidth < 380;
  const isMediumDevice = screenWidth >= 380 && screenWidth < 768;
  const isLargeDevice = screenWidth >= 768;
  
  const buttonHeight = isLargeDevice ? 66 : isSmallDevice ? 50 : 56;
  const inputHeight = isLargeDevice ? 66 : isSmallDevice ? 50 : 56;
  const contentPadding = isLargeDevice ? 60 : isSmallDevice ? 20 : 30;
  const titleMargin = isLargeDevice ? 50 : isSmallDevice ? 30 : 40;
  
  const titleFontSize = responsiveFontSize(22, 22, 42);
  const labelFontSize = responsiveFontSize(16, 14, 18);
  const inputFontSize = responsiveFontSize(16, 14, 18);
  const buttonFontSize = responsiveFontSize(18, 16, 20);
  const forgotPasswordFontSize = responsiveFontSize(14, 12, 16);
  const footerFontSize = responsiveFontSize(12, 10, 14);
  const subtitleFontSize = responsiveFontSize(18, 16, 20);

  const handleSignIn = () => {
    setIsLoading(true);

    setTimeout(() => {
      try {
        setIsLoading(false);

        router.replace("/(tabs)");
      } catch (error) {
        console.error("Login failed:", error);
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleBack = () => {
    router.replace("/welcome");
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
              Sign In
            </ThemedText>

            <ThemedText
              style={[
                styles.subtitle,
                { 
                  fontSize: subtitleFontSize, 
                  marginBottom: titleMargin / 1.5 
                }
              ]}
              darkColor="#EBD3F8"
              lightColor="#EBD3F8"
            >
              Access your connected world
            </ThemedText>

            <View style={[
              styles.formContainer,
              { gap: isSmallDevice ? 20 : 24 }
            ]}>
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
                  autoCapitalize="none"
                  keyboardType="email-address"
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
                  style={[
                    styles.input, 
                    { 
                      color: "#EBD3F8",
                      fontSize: inputFontSize,
                      height: inputHeight,
                      paddingHorizontal: isSmallDevice ? 15 : 20
                    }
                  ]}
                  placeholder="Enter your password"
                  placeholderTextColor="rgba(235, 211, 248, 0.5)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  selectionColor="#31E1F7"
                />
              </View>

              <TouchableOpacity style={styles.forgotPassword}>
                <ThemedText
                  style={[
                    styles.forgotPasswordText,
                    { fontSize: forgotPasswordFontSize }
                  ]}
                  darkColor="#31E1F7"
                  lightColor="#31E1F7"
                >
                  Forgot Password?
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  { 
                    height: buttonHeight,
                    marginTop: isSmallDevice ? 30 : 40 
                  }
                ]}
                onPress={handleSignIn}
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
                    {isLoading ? "Signing in..." : "Sign In"}
                  </ThemedText>
                </LinearGradient>
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
              style={[styles.footerText, { fontSize: footerFontSize }]}
              darkColor="#E5B8F4"
              lightColor="#E5B8F4"
            >
              v1.0.0 • Secure Connection
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  forgotPasswordText: {
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
