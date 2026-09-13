import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, shadows } from '../theme';

interface CardProps {
  children: React.ReactNode;
  level?: 1 | 2;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ children, level = 1, style }) => {
  return (
    <View
      style={[
        styles.base,
        level === 1 ? [styles.level1, shadows.level1] : [styles.level2, shadows.level2],
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  level1: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: 'rgba(22, 22, 22, 0.04)',
  },
  level2: {
    backgroundColor: colors.glassWhite,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
});
