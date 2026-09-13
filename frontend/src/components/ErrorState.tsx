import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography } from '../theme';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to load records',
  message = 'Please check your connection and retry.',
  onRetry,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <MaterialIcons name="error-outline" size={28} color={colors.error} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <Button
          title="Retry"
          onPress={onRetry}
          variant="secondary"
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    marginVertical: 20,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(186, 26, 26, 0.1)',
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.errorContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    ...typography.headlineSm,
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: 4,
  },
  message: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 18,
  },
  button: {
    minWidth: 140,
  },
});
