import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Card({ 
  children, 
  style, 
  onPress,
  elevation = 2 
}) {
  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.card, styles[`elevation${elevation}`], style]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.card, styles[`elevation${elevation}`], style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  elevation1: {
    elevation: 1,
    shadowOpacity: 0.05,
  },
  elevation2: {
    elevation: 2,
  },
  elevation3: {
    elevation: 3,
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
});
