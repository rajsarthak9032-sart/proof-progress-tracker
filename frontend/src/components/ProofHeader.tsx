import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography } from '../theme';
import { useAuth } from '../context/AuthContext';

interface ProofHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  onProfilePress?: () => void;
  dayLabel?: string;
}

export const ProofHeader: React.FC<ProofHeaderProps> = ({
  title = 'Proof',
  subtitle = 'Journeys',
  showBack = false,
  onBack,
  onProfilePress,
  dayLabel = 'DAY 30',
}) => {
  const insets = useSafeAreaInsets();
  const { isDemoMode } = useAuth();

  return (
    <View style={[styles.headerContainer, { paddingTop: Math.max(insets.top, 12) }]}>
      <View style={styles.headerContent}>
        {/* Left: Back or Brand glyph */}
        <View style={styles.leftSection}>
          {showBack ? (
            <TouchableOpacity
              onPress={onBack}
              activeOpacity={0.8}
              style={styles.backButton}
            >
              <MaterialIcons name="arrow-back-ios-new" size={18} color={colors.onSurface} />
            </TouchableOpacity>
          ) : (
            <View style={styles.brandGlyph}>
              <View style={[styles.ring, styles.ringLeft]} />
              <View style={[styles.ring, styles.ringRight]} />
            </View>
          )}

          <View style={styles.titleColumn}>
            <View style={styles.titleRow}>
              <Text numberOfLines={1} style={styles.titleText}>{title}</Text>
              {isDemoMode ? (
                <View style={styles.demoBadge}>
                  <Text style={styles.demoBadgeText}>DEMO</Text>
                </View>
              ) : (
                <View style={styles.liveBadge}>
                  <Text style={styles.liveBadgeText}>LIVE</Text>
                </View>
              )}
            </View>
            {subtitle && (
              <Text numberOfLines={1} style={styles.subtitleText}>{subtitle}</Text>
            )}
          </View>
        </View>

        {/* Right: Day Counter & Profile */}
        <View style={styles.rightSection}>
          {dayLabel && (
            <View style={styles.dayPill}>
              <Text style={styles.dayText}>{dayLabel}</Text>
            </View>
          )}
          <TouchableOpacity
            onPress={onProfilePress}
            activeOpacity={0.85}
            style={styles.avatarButton}
          >
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2A_-8aH7PYKu7bjCjnVw5CfF-CjOw1fQ1yayI5NNWhNR3PXAezpvg_FfynQf4Xa7q1epBzA1pN6X4t7OxI1DFiSJ1oN1HzYBNrl6M08qKVYdf67aLUA3E-Urcui6v9itVMSapWSjYQqwBrzRiSvrHYxnRphYaFlTJ2FRkRRWjbMMgGfNX1vb6f6n6bIiztzwGP7WRZJheVUUWs-L6fB7ytp5EqxQWXBc9q0k4HFcX-agDvYuwRxSHRw',
              }}
              style={styles.avatarImage}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'rgba(250, 249, 246, 0.92)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(22, 22, 22, 0.04)',
    zIndex: 50,
  },
  headerContent: {
    height: 56,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    backgroundColor: colors.surfaceContainerLow,
  },
  brandGlyph: {
    width: 32,
    height: 32,
    position: 'relative',
    marginRight: 10,
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2.5,
  },
  ringLeft: {
    left: 0,
    borderColor: colors.primary,
  },
  ringRight: {
    right: 0,
    borderColor: colors.secondaryContainer,
  },
  titleColumn: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  titleText: {
    ...typography.headlineSm,
    fontSize: 16,
    color: colors.onSurface,
  },
  subtitleText: {
    ...typography.labelCaps,
    fontSize: 10,
    color: colors.onSurfaceVariant,
    marginTop: 1,
  },
  liveBadge: {
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 9999,
  },
  liveBadgeText: {
    ...typography.monoMetric,
    fontSize: 9,
    color: colors.onSurfaceVariant,
  },
  demoBadge: {
    backgroundColor: colors.secondaryFixed,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 9999,
  },
  demoBadgeText: {
    ...typography.monoMetric,
    fontSize: 9,
    color: colors.onSecondaryFixed,
    fontWeight: '700',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dayPill: {
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  dayText: {
    ...typography.monoMetric,
    fontSize: 11,
    color: colors.onSurfaceVariant,
  },
  avatarButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.surfaceContainerHigh,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
});
