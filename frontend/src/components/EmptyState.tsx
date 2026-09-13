import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography } from '../theme';
import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionTitle?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "You haven't started a Journey yet.",
  description = 'Proof turns the small moments you record into a quiet, undeniable story of how far you’ve come.',
  actionTitle = 'Start something worth remembering',
  onAction,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <MaterialIcons name="museum" size={32} color={colors.secondary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {onAction && actionTitle && (
        <Button
          title={actionTitle}
          onPress={onAction}
          variant="aurora"
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
    padding: 32,
    marginVertical: 40,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(22, 22, 22, 0.04)',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.secondaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    ...typography.headlineMd,
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
    marginBottom: 24,
  },
  button: {
    minWidth: 240,
  },
});
