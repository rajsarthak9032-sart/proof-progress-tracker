import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, shadows } from '../theme';

export type ButtonVariant = 'primary' | 'aurora' | 'secondary' | 'ghost' | 'outline';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  icon,
  iconPosition = 'right',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const isAurora = variant === 'aurora';

  const content = (
    <View style={styles.contentRow}>
      {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' || variant === 'ghost' ? colors.onSurface : colors.onPrimary} />
      ) : (
        <Text
          style={[
            styles.baseText,
            variant === 'primary' && styles.primaryText,
            variant === 'aurora' && styles.auroraText,
            (variant === 'secondary' || variant === 'ghost') && styles.secondaryText,
            variant === 'outline' && styles.outlineText,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
      {icon && iconPosition === 'right' && !loading && <View style={styles.iconRight}>{icon}</View>}
    </View>
  );

  if (isAurora) {
    return (
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={onPress}
        disabled={disabled || loading}
        style={[styles.wrapper, shadows.auroraGlow, disabled && styles.disabled, style]}
      >
        <LinearGradient
          colors={[...colors.auroraGradient]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientContainer}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.wrapper,
        styles.solidContainer,
        variant === 'primary' && styles.primaryContainer,
        variant === 'secondary' && styles.secondaryContainer,
        variant === 'ghost' && styles.ghostContainer,
        variant === 'outline' && styles.outlineContainer,
        disabled && styles.disabled,
        style,
      ]}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 9999,
    overflow: 'hidden',
  },
  gradientContainer: {
    height: 52,
    borderRadius: 9999,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  solidContainer: {
    height: 52,
    borderRadius: 9999,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryContainer: {
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  secondaryContainer: {
    backgroundColor: colors.surfaceContainerLow,
  },
  ghostContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseText: {
    ...typography.headlineSm,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  primaryText: {
    color: colors.onPrimary,
  },
  auroraText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: colors.onSurface,
  },
  outlineText: {
    color: colors.onSurface,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  disabled: {
    opacity: 0.5,
  },
});
