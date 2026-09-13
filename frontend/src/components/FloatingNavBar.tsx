import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, shadows } from '../theme';

export type TabName = 'journeys' | 'time-travel' | 'stories' | 'profile';

interface FloatingNavBarProps {
  activeTab: TabName;
  onTabChange: (tab: TabName) => void;
}

export const FloatingNavBar: React.FC<FloatingNavBarProps> = ({ activeTab, onTabChange }) => {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 12);

  return (
    <View style={[styles.floatingWrapper, { paddingBottom: bottomPadding }]}>
      <View style={[styles.navContainer, shadows.level2]}>
        {/* Tab 1: Journeys */}
        <TouchableOpacity
          onPress={() => onTabChange('journeys')}
          activeOpacity={0.85}
          style={styles.tabItem}
        >
          <MaterialIcons
            name="layers"
            size={22}
            color={activeTab === 'journeys' ? colors.primary : colors.onSurfaceVariant}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'journeys' && styles.activeTabLabel,
            ]}
          >
            Journeys
          </Text>
        </TouchableOpacity>

        {/* Center Hero: Retrospect / Time Travel */}
        <TouchableOpacity
          onPress={() => onTabChange('time-travel')}
          activeOpacity={0.88}
          style={styles.centerHeroButtonWrapper}
        >
          <LinearGradient
            colors={[...colors.auroraGradient]}
            style={styles.heroOuterGradient}
          >
            <View style={styles.heroInnerCircle}>
              <MaterialIcons
                name="history-toggle-off"
                size={26}
                color={colors.secondaryContainer}
              />
            </View>
          </LinearGradient>
          <Text
            style={[
              styles.tabLabel,
              styles.heroLabel,
              activeTab === 'time-travel' && styles.activeTabLabel,
            ]}
          >
            Retrospect
          </Text>
        </TouchableOpacity>

        {/* Tab 3: Stories */}
        <TouchableOpacity
          onPress={() => onTabChange('stories')}
          activeOpacity={0.85}
          style={styles.tabItem}
        >
          <MaterialIcons
            name="movie"
            size={22}
            color={activeTab === 'stories' ? colors.primary : colors.onSurfaceVariant}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'stories' && styles.activeTabLabel,
            ]}
          >
            Stories
          </Text>
        </TouchableOpacity>

        {/* Tab 4: Profile */}
        <TouchableOpacity
          onPress={() => onTabChange('profile')}
          activeOpacity={0.85}
          style={styles.tabItem}
        >
          <MaterialIcons
            name="person"
            size={22}
            color={activeTab === 'profile' ? colors.primary : colors.onSurfaceVariant}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'profile' && styles.activeTabLabel,
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 100,
    pointerEvents: 'box-none',
  },
  navContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.glassNav,
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: '100%',
    maxWidth: 420,
    borderWidth: 1,
    borderColor: 'rgba(22, 22, 22, 0.05)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)',
      } as any,
    }),
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    minHeight: 48,
  },
  tabLabel: {
    ...typography.labelCaps,
    fontSize: 10,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  activeTabLabel: {
    color: colors.primary,
    fontWeight: '700',
  },
  centerHeroButtonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -24,
    paddingHorizontal: 8,
  },
  heroOuterGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    padding: 2.5,
    ...shadows.auroraGlow,
  },
  heroInnerCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroLabel: {
    marginTop: 3,
  },
});
