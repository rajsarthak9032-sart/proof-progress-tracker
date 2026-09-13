import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  PanResponder,
  LayoutChangeEvent,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, shadows } from '../theme';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  aspectRatio?: number;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'DAY 1 · Aug 1',
  afterLabel = 'DAY 30 · Aug 30',
  aspectRatio = 4 / 5,
}) => {
  const [containerWidth, setContainerWidth] = useState(340);
  const [splitPercent, setSplitPercent] = useState(50); // 0 to 100

  const updatePosition = (x: number) => {
    if (containerWidth <= 0) return;
    const clampedX = Math.max(0, Math.min(containerWidth, x));
    const pct = (clampedX / containerWidth) * 100;
    setSplitPercent(pct);
  };

  const panResponder = useMemo(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        updatePosition(evt.nativeEvent.locationX);
      },
      onPanResponderMove: (evt) => {
        updatePosition(evt.nativeEvent.locationX);
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [containerWidth]
  );

  const onLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  const dividerLeft = (splitPercent / 100) * containerWidth;

  return (
    <View style={styles.outer}>
      <View
        style={[styles.container, { aspectRatio }]}
        onLayout={onLayout}
        {...panResponder.panHandlers}
      >
        {/* Layer 1: After Image (Full background) */}
        <Image
          source={{ uri: afterImage }}
          style={styles.fullImage}
          resizeMode="cover"
        />
        <View style={styles.afterBadge}>
          <Text style={styles.badgeText}>{afterLabel}</Text>
        </View>

        {/* Layer 2: Before Image (Clipped from left to dividerLeft) */}
        <View style={[styles.beforeClipWrapper, { width: dividerLeft }]}>
          <Image
            source={{ uri: beforeImage }}
            style={[styles.fullImage, { width: containerWidth }]}
            resizeMode="cover"
          />
          <View style={styles.beforeBadge}>
            <Text style={styles.badgeText}>{beforeLabel}</Text>
          </View>
        </View>

        {/* Layer 3: Ultra-thin Vertical Hairline Divider & Draggable Handle */}
        <View
          style={[styles.dividerBar, { left: dividerLeft }]}
          pointerEvents="none"
        >
          <View style={[styles.handlePill, shadows.level2]}>
            <MaterialIcons name="compare-arrows" size={18} color={colors.onSurface} />
          </View>
        </View>

        {/* Bottom subtle metadata indicators */}
        <View style={styles.bottomScrim} pointerEvents="none">
          <View style={styles.tagPill}>
            <Text style={styles.tagText}>EARLY GESTURE</Text>
          </View>
          <View style={styles.tagPill}>
            <Text style={styles.tagText}>VOLUMETRIC REALISM</Text>
          </View>
        </View>
      </View>

      {/* Instruction subtitle */}
      <View style={styles.instructionRow}>
        <MaterialIcons name="drag-indicator" size={16} color={colors.onSurfaceVariant} />
        <Text style={styles.instructionText}>DRAG SLIDER ACROSS TIME HORIZON</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    width: '100%',
  },
  container: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainerHighest,
    position: 'relative',
    ...shadows.level2,
  },
  fullImage: {
    ...StyleSheet.absoluteFill,
    height: '100%',
  },
  beforeClipWrapper: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    overflow: 'hidden',
    zIndex: 2,
  },
  beforeBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    ...shadows.level1,
  },
  afterBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    ...shadows.level1,
  },
  badgeText: {
    ...typography.monoMetric,
    fontSize: 11,
    color: colors.onSurface,
    fontWeight: '600',
  },
  dividerBar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#FFFFFF',
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -1 }],
    ...Platform.select({
      web: {
        boxShadow: '0 0 10px rgba(0,0,0,0.35)',
      } as any,
    }),
  },
  handlePill: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(22, 22, 22, 0.08)',
  },
  bottomScrim: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 5,
  },
  tagPill: {
    backgroundColor: 'rgba(22, 22, 22, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    ...typography.monoMetric,
    fontSize: 9,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    gap: 4,
  },
  instructionText: {
    ...typography.labelCaps,
    color: colors.onSurfaceVariant,
    fontSize: 10,
  },
});
