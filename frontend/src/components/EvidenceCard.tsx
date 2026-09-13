import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, typography, shadows } from '../theme';
import { Evidence } from '../types';

interface EvidenceCardProps {
  evidence: Evidence;
  isActive?: boolean;
  onPress?: () => void;
  width?: number;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({
  evidence,
  isActive = false,
  onPress,
  width = 110,
}) => {
  const height = width * 1.35; // 4:5 aspect ratio

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles.container, { width }]}
    >
      <View
        style={[
          styles.imageWrapper,
          { width, height },
          isActive && styles.activeImageWrapper,
          shadows.level1,
        ]}
      >
        <Image
          source={{ uri: evidence.image_url }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.scrim} />
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>D·{String(evidence.day_number).padStart(2, '0')}</Text>
        </View>
        {evidence.day_number === 30 && (
          <View style={styles.masterpieceDot} />
        )}
      </View>

      {/* Pin Node Waypoint Indicator */}
      <View style={styles.pinContainer}>
        <View style={[styles.outerPin, isActive ? styles.activeOuterPin : styles.inactiveOuterPin]}>
          <View style={[styles.innerPin, isActive ? styles.activeInnerPin : styles.inactiveInnerPin]} />
        </View>
      </View>

      {/* Label */}
      <Text style={[styles.dayLabel, isActive && styles.activeDayLabel]}>
        Day {evidence.day_number}
      </Text>
      <Text numberOfLines={1} style={styles.captionLabel}>
        {evidence.metrics_tag?.replace(/D·\d+\s*·\s*/, '') || 'Capture'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: 14,
  },
  imageWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainerHigh,
    position: 'relative',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeImageWrapper: {
    borderColor: colors.secondaryContainer,
    borderWidth: 2,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  badgeContainer: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    ...typography.monoMetric,
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  masterpieceDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.secondaryContainer,
  },
  pinContainer: {
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerPin: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  inactiveOuterPin: {
    borderColor: colors.outlineVariant,
  },
  activeOuterPin: {
    borderColor: colors.secondaryContainer,
  },
  innerPin: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  inactiveInnerPin: {
    backgroundColor: colors.outlineVariant,
  },
  activeInnerPin: {
    backgroundColor: colors.secondaryContainer,
  },
  dayLabel: {
    ...typography.labelCaps,
    fontSize: 11,
    color: colors.onSurface,
    marginTop: 4,
  },
  activeDayLabel: {
    color: colors.secondary,
    fontWeight: '700',
  },
  captionLabel: {
    ...typography.bodySm,
    fontSize: 11,
    color: colors.onSurfaceVariant,
    marginTop: 1,
    maxWidth: '100%',
  },
});
