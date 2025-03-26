// This file is a fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue, StyleProp, TextStyle, Text, StyleSheet, Platform } from 'react-native';

const MAPPING = {
  'house.fill': 'home',
  'magnifyingglass': 'search',
  'calendar': 'calendar-today',
  'person.fill': 'person',
  'bell.fill': 'notifications',
  'lock.fill': 'lock',
  'questionmark.circle': 'help',
  'chevron.right': 'chevron-right',
  'envelope.fill': 'email',
  'camera.fill': 'camera-alt',
  'checkmark.circle.fill': 'check-circle',
  'location': 'location-on',
};

export type SFSymbols6_0 = 
  | 'house.fill' 
  | 'magnifyingglass'
  | 'calendar'
  | 'person.fill'
  | 'bell.fill'
  | 'lock.fill'
  | 'questionmark.circle'
  | 'chevron.right'
  | 'envelope.fill'
  | 'camera.fill'
  | 'checkmark.circle.fill'
  | 'location';

interface IconSymbolProps {
  name: SFSymbols6_0;
  size?: number;
  color?: string;
  style?: any;
}

export function IconSymbol({
  name,
  size = 24,
  color = 'black',
  style,
}: IconSymbolProps) {
  if (Platform.OS === 'android' || Platform.OS === 'web') {
    const materialName = MAPPING[name] || 'circle';
    return <MaterialIcons name={materialName as keyof typeof MaterialIcons.glyphMap} size={size} color={color} style={style} />;
  }
  
  return (
    <Text style={[styles.icon, { fontSize: size, color }, style]}>
      {name === 'chevron.right' ? '›' : '•'}
    </Text>
  );
}

const styles = StyleSheet.create({
  icon: {
    fontWeight: 'bold',
  },
});
