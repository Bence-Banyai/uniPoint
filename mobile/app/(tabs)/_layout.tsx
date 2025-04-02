import { Tabs } from 'expo-router';
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from 'react-native';

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[
      styles.tabBarContainer, 
      { paddingBottom: Math.max(insets.bottom, 6) }
    ]}>
      <BlurView 
        intensity={90}
        tint="dark"
        style={StyleSheet.absoluteFill}
      />
      
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(46, 2, 73, 0.85)' }]} />
      
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.title;
          const isFocused = state.index === index;
          
          const getIcon = () => {
            switch (route.name) {
              case 'index':
                return 'house.fill';
              case 'search':
                return 'magnifyingglass';
              case 'appointments':
                return 'calendar';
              case 'profile':
                return 'person.fill';
              default:
                return 'house.fill';
            }
          };
          
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          
          return (
            <TouchableOpacity
              key={index}
              style={styles.tabButton}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
            >
              <View style={styles.tabContent}>
                <View style={styles.tabIconContainer}>
                  {isFocused && (
                    <View style={[
                      styles.activeIconBackground,
                      { backgroundColor: getGradientColors(index)[0] }
                    ]} />
                  )}
                  
                  <IconSymbol 
                    name={getIcon()} 
                    size={24} 
                    color={isFocused ? "#FFFFFF" : "rgba(235, 211, 248, 0.7)"} 
                  />
                </View>
                
                <ThemedText 
                  style={isFocused ? styles.tabLabelActive : styles.tabLabel}
                  darkColor={isFocused ? "#FFFFFF" : "rgba(235, 211, 248, 0.7)"}
                  lightColor={isFocused ? "#FFFFFF" : "rgba(235, 211, 248, 0.7)"}
                >
                  {label}
                </ThemedText>
                
                {isFocused && (
                  <LinearGradient
                    colors={getGradientColors(index)}
                    style={styles.activeTabUnderline}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const getGradientColors = (index: number): [string, string] => {
  switch (index) {
    case 0: // Home
      return ['#31E1F7', '#2979FF'];
    case 1: // Search
      return ['#F806CC', '#A91079'];
    case 2: // Appointments
      return ['#4CAF50', '#8BC34A'];
    case 3: // Profile
      return ['#FF9800', '#FF5722'];
    default:
      return ['#31E1F7', '#2979FF'];
  }
};

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Explore',
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: 'Appointments',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 0,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    height: 75,
    overflow: 'hidden',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    opacity: 0.95,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%',
    paddingTop: 0,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
    height: '100%',
    ...Platform.select({
      ios: {
        paddingTop: 20,
      },
      android: {
        paddingTop: 20,
      },
      default: {}
    }),
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: Platform.select({
      ios: 46,
      android: 46,
    }) || 46,
    position: 'relative',
  },
  tabIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: Platform.select({
      ios: 4,
      android: 4,
      default: 0
    })
  },
  activeIconBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 20,
    opacity: 0.2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
    fontFamily: Platform.select({
      ios: "Avenir-Medium",
      android: "sans-serif-medium",
      default: "Avenir-Medium"
    }),
  },
  tabLabelActive: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
    fontFamily: Platform.select({
      ios: "Avenir-Heavy",
      android: "sans-serif-medium",
      default: "Avenir-Heavy"
    }),
  },
  activeTabUnderline: {
    position: 'absolute',
    bottom: Platform.select({
      ios: -12,
      android: -12,
      web: -18,
      default: -14
    }),
    height: 3,
    width: 30,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 6,
  },
});