import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  LayoutChangeEvent,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors, typography, shadows } from '../theme';

interface TimeTravelSliderProps {
  waypoints: number[]; // e.g. [1, 7, 15, 23, 30]
  activeDay: number;
  totalDays: number;
  onDayChange: (day: number) => void;
}

export const TimeTravelSlider: React.FC<TimeTravelSliderProps> = ({
  waypoints,
  activeDay,
  totalDays = 30,
  onDayChange,
}) => {
  const [trackWidth, setTrackWidth] = useState(300);
  const lastHapticDayRef = useRef(activeDay);

  const triggerHaptic = (day: number) => {
    if (day !== lastHapticDayRef.current) {
      lastHapticDayRef.current = day;
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };

  const getDayFromPosition = (x: number) => {
    const clampedX = Math.max(0, Math.min(trackWidth, x));
    const ratio = clampedX / trackWidth;
    const rawDay = Math.round(1 + ratio * (totalDays - 1));
    let snappedDay = rawDay;
    for (const wp of waypoints) {
      if (Math.abs(wp - rawDay) <= 2) {
        snappedDay = wp;
        break;
      }
    }
    return snappedDay;
  };

  const panResponder = useRef(
    // eslint-disable-next-line react-hooks/refs
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const day = getDayFromPosition(evt.nativeEvent.locationX);
        triggerHaptic(day);
        onDayChange(day);
      },
      onPanResponderMove: (evt) => {
        const day = getDayFromPosition(evt.nativeEvent.locationX);
        triggerHaptic(day);
        onDayChange(day);
      },
      onPanResponderRelease: (evt) => {
        const day = getDayFromPosition(evt.nativeEvent.locationX);
        triggerHaptic(day);
        onDayChange(day);
      },
    })
  ).current;

  const onLayout = (e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
  };

  const currentRatio = Math.max(0, Math.min(1, (activeDay - 1) / (totalDays - 1)));
  const thumbPosition = currentRatio * trackWidth;

  return (
    <View style={styles.container}>
      {/* Header labels */}
      <View style={styles.header}>
        <View>
          <Text style={styles.labelCaps}>Waypoint Navigation</Text>
          <Text style={styles.headline}>Timeline Scrubber</Text>
        </View>
        <View style={styles.dayIndicator}>
          <Text style={styles.activeDayText}>Day {activeDay}</Text>
          <Text style={styles.totalDaysText}> / {totalDays}</Text>
        </View>
      </View>

      {/* Touch Track Container */}
      <View
        style={styles.trackTouchArea}
        onLayout={onLayout}
        // eslint-disable-next-line react-hooks/refs
        {...panResponder.panHandlers}
      >
        {/* Background Track Line */}
        <View style={styles.trackBackground}>
          <LinearGradient
            colors={[...colors.auroraGradient]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.trackFill, { width: `${currentRatio * 100}%` }]}
          />
        </View>

        {/* Notches for each waypoint */}
        <View style={styles.notchesRow} pointerEvents="none">
          {waypoints.map((wp) => {
            const ratio = (wp - 1) / (totalDays - 1);
            const isReached = wp <= activeDay;
            const isCurrent = wp === activeDay;

            return (
              <View
                key={wp}
                style={[
                  styles.notchWrapper,
                  { left: `${ratio * 100}%` },
                ]}
              >
                <View
                  style={[
                    styles.notchDot,
                    isReached ? styles.notchDotReached : styles.notchDotUnreached,
                    isCurrent && styles.notchDotCurrent,
                  ]}
                />
                <Text
                  style={[
                    styles.notchText,
                    isCurrent && styles.notchTextCurrent,
                  ]}
                >
                  D{wp}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Dual-Ring Scrubber Node */}
        <View
          style={[
            styles.scrubberNode,
            shadows.level2,
            { transform: [{ translateX: thumbPosition - 14 }] },
          ]}
          pointerEvents="none"
        >
          <LinearGradient
            colors={[...colors.auroraGradient]}
            style={styles.innerCore}
          />
        </View>
      </View>

      {/* Discrete Waypoint Taps */}
      <View style={styles.waypointsList}>
        {waypoints.map((wp) => (
          <TouchableOpacity
            key={wp}
            onPress={() => {
              triggerHaptic(wp);
              onDayChange(wp);
            }}
            style={[
              styles.waypointPill,
              activeDay === wp && styles.activeWaypointPill,
            ]}
          >
            <Text
              style={[
                styles.waypointPillText,
                activeDay === wp && styles.activeWaypointPillText,
              ]}
            >
              Day {wp}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 24,
    padding: 20,
    ...shadows.level1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  labelCaps: {
    ...typography.labelCaps,
    color: colors.onSurfaceVariant,
  },
  headline: {
    ...typography.headlineSm,
    color: colors.onSurface,
    marginTop: 2,
  },
  dayIndicator: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  activeDayText: {
    ...typography.monoMetric,
    fontSize: 16,
    fontWeight: '700',
    color: colors.secondary,
  },
  totalDaysText: {
    ...typography.monoMetric,
    fontSize: 13,
    color: colors.onSurfaceVariant,
  },
  trackTouchArea: {
    height: 48,
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 4,
  },
  trackBackground: {
    height: 6,
    backgroundColor: colors.surfaceContainer,
    borderRadius: 3,
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    borderRadius: 3,
  },
  notchesRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 24,
  },
  notchWrapper: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -10 }],
    width: 20,
  },
  notchDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  notchDotUnreached: {
    backgroundColor: colors.surfaceContainerHighest,
  },
  notchDotReached: {
    backgroundColor: colors.secondaryContainer,
  },
  notchDotCurrent: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.secondary,
  },
  notchText: {
    ...typography.monoMetric,
    fontSize: 10,
    color: colors.onSurfaceVariant,
    marginTop: 6,
  },
  notchTextCurrent: {
    color: colors.secondary,
    fontWeight: '700',
  },
  scrubberNode: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  innerCore: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  waypointsList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceContainerLow,
  },
  waypointPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.surfaceContainerLow,
  },
  activeWaypointPill: {
    backgroundColor: colors.primary,
  },
  waypointPillText: {
    ...typography.monoMetric,
    fontSize: 11,
    color: colors.onSurfaceVariant,
  },
  activeWaypointPillText: {
    color: colors.onPrimary,
    fontWeight: '600',
  },
});
