import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, typography } from '../theme';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Gathering Proof records...' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.secondary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  message: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: 16,
    fontStyle: 'italic',
  },
});
