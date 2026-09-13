import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, shadows } from '../../src/theme';
import { ProofHeader, TimeTravelSlider, Button } from '../../src/components';
import { useAuth } from '../../src/context/AuthContext';
import { DEMO_EVIDENCE, DEMO_AI_INSIGHTS } from '../../src/services/demoData';
import { Evidence } from '../../src/types';

export default function TimeTravelHeroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  useAuth();

  const waypoints = [1, 7, 15, 23, 30];
  const [activeDay, setActiveDay] = useState<number>(15);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  // Find corresponding evidence capture for activeDay
  const currentEvidence: Evidence =
    DEMO_EVIDENCE.find((e) => e.day_number === activeDay) ||
    DEMO_EVIDENCE[Math.min(2, DEMO_EVIDENCE.length - 1)];

  // Previous & Next waypoint helpers
  const currentIdx = waypoints.indexOf(activeDay);
  const prevWaypoint = currentIdx > 0 ? waypoints[currentIdx - 1] : null;
  const nextWaypoint = currentIdx < waypoints.length - 1 ? waypoints[currentIdx + 1] : null;

  const handleStepPrev = () => {
    if (prevWaypoint !== null) setActiveDay(prevWaypoint);
  };

  const handleStepNext = () => {
    if (nextWaypoint !== null) setActiveDay(nextWaypoint);
  };

  return (
    <View style={styles.screen}>
      <ProofHeader
        title="Proof"
        subtitle="Time Travel"
        dayLabel={`DAY ${activeDay}`}
        onProfilePress={() => router.push('/(tabs)/profile')}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 96 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Subheader */}
        <View style={styles.topMeta}>
          <View style={styles.metaRow}>
            <View style={styles.metaLeft}>
              <View style={styles.pulseDot} />
              <Text style={styles.metaLabel}>MILESTONE CHRONOLOGY</Text>
            </View>
            <View style={styles.reviewPill}>
              <Text style={styles.reviewPillText}>#3 OF 5 WAYPOINTS</Text>
            </View>
          </View>
          <Text style={styles.title}>Time Travel</Text>
          <Text style={styles.subtitle}>Look back at how far you&apos;ve come.</Text>
        </View>

        {/* Viewport Hero Card */}
        <View style={[styles.viewportCard, shadows.level2]}>
          <View style={styles.imageBox}>
            <Image
              source={{ uri: currentEvidence.image_url }}
              style={[
                styles.heroImage,
                isZoomed && styles.zoomedImage,
              ]}
              resizeMode="cover"
            />
            <View style={styles.imageGradientScrim} />

            {/* Top Image Badges */}
            <View style={styles.topImageRow}>
              <View style={styles.dayGlassBadge}>
                <MaterialIcons name="history-toggle-off" size={16} color={colors.secondary} />
                <Text style={styles.dayGlassText}>DAY {currentEvidence.day_number}</Text>
                <View style={styles.glassDot} />
                <Text style={styles.dateGlassText}>Aug {currentEvidence.day_number}, 2024</Text>
              </View>

              <TouchableOpacity
                onPress={() => setIsZoomed(!isZoomed)}
                activeOpacity={0.85}
                style={styles.zoomButton}
              >
                <MaterialIcons
                  name={isZoomed ? 'zoom-out' : 'zoom-in'}
                  size={20}
                  color={colors.onSurface}
                />
              </TouchableOpacity>
            </View>

            {/* Bottom Image Info */}
            <View style={styles.bottomImageRow}>
              <View style={styles.pivotInfo}>
                <Text style={styles.pivotLabel}>MILESTONE PIVOT</Text>
                <Text style={styles.pivotTitle}>
                  {currentEvidence.day_number === 30
                    ? 'Sanctuary of Luminescence'
                    : currentEvidence.day_number === 15
                    ? 'Atmospheric Depth & Glow'
                    : currentEvidence.day_number === 7
                    ? 'Tonal Form Realization'
                    : 'Tentative Initial Marks'}
                </Text>
              </View>
              <View style={styles.progressPointPill}>
                <Text style={styles.progressPointText}>
                  {Math.round((currentEvidence.day_number / 30) * 100)}% Point
                </Text>
              </View>
            </View>
          </View>

          {/* Journal Reflection Note */}
          <View style={styles.reflectionSection}>
            <View style={styles.journalQuoteBox}>
              <View style={styles.verticalBar} />
              <Text style={styles.journalText}>
                “{currentEvidence.reflection}”
              </Text>
              <Text style={styles.journalMeta}>
                Artist Journal Log · {currentEvidence.prompt_spark || 'Recorded Proof'}
              </Text>
            </View>

            {/* Proof AI Lens */}
            <View style={styles.aiLensCard}>
              <View style={styles.aiIconCircle}>
                <MaterialIcons name="auto-awesome" size={18} color={colors.secondary} />
              </View>
              <View style={styles.aiTextCol}>
                <View style={styles.aiHeaderRow}>
                  <Text style={styles.aiLensTitle}>PROOF AI LENS</Text>
                  <View style={styles.aiDot} />
                  <Text style={styles.aiShiftLabel}>
                    {activeDay >= 15 ? 'Lighting Shift Detected' : 'Foundation Study'}
                  </Text>
                </View>
                <Text style={styles.aiBodyText}>
                  {activeDay === 30
                    ? 'Complete artistic synthesis: complex atmospheric lighting, reflection maps, and volumetric worldbuilding realized.'
                    : activeDay === 15
                    ? DEMO_AI_INSIGHTS.key_shift
                    : 'Establishing gesture pressure confidence and contour control without premature detailing.'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Timeline Scrubber Component */}
        <View style={styles.scrubberSection}>
          <TimeTravelSlider
            waypoints={waypoints}
            activeDay={activeDay}
            totalDays={30}
            onDayChange={setActiveDay}
          />

          {/* Prev / Next Step Buttons */}
          <View style={styles.stepButtonsRow}>
            <TouchableOpacity
              onPress={handleStepPrev}
              disabled={prevWaypoint === null}
              style={[
                styles.stepButton,
                prevWaypoint === null && styles.stepButtonDisabled,
              ]}
              activeOpacity={0.8}
            >
              <MaterialIcons name="arrow-back" size={18} color={colors.onSurface} />
              <Text style={styles.stepButtonText}>
                {prevWaypoint !== null ? `Day ${prevWaypoint}` : 'Start'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleStepNext}
              disabled={nextWaypoint === null}
              style={[
                styles.stepButton,
                nextWaypoint === null && styles.stepButtonDisabled,
              ]}
              activeOpacity={0.8}
            >
              <Text style={styles.stepButtonText}>
                {nextWaypoint !== null ? `Day ${nextWaypoint}` : 'End'}
              </Text>
              <MaterialIcons name="arrow-forward" size={18} color={colors.onSurface} />
            </TouchableOpacity>
          </View>

          {/* Compare with Day 1 Canvas Button */}
          <Button
            title="Compare with Day 1 Canvas"
            onPress={() => router.push('/compare/demo-journey-art')}
            variant="ghost"
            icon={<MaterialIcons name="compare" size={18} color={colors.secondary} />}
            iconPosition="left"
            style={styles.compareButton}
          />
        </View>

        {/* Export Retrospective Card */}
        <View style={[styles.exportCard, shadows.level1]}>
          <View style={styles.exportLeft}>
            <View style={styles.exportIconCircle}>
              <MaterialIcons name="movie-edit" size={20} color={colors.onSurface} />
            </View>
            <View style={styles.exportTextCol}>
              <Text style={styles.exportTitle}>Export Retrospective</Text>
              <Text style={styles.exportSubtitle}>
                Generate growth story from Day 1 to {activeDay}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/stories')}
            style={styles.createBtn}
            activeOpacity={0.88}
          >
            <Text style={styles.createBtnText}>Create</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  topMeta: {
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.secondaryContainer,
  },
  metaLabel: {
    ...typography.labelCaps,
    color: colors.onSurfaceVariant,
  },
  reviewPill: {
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  reviewPillText: {
    ...typography.monoMetric,
    fontSize: 10,
    color: colors.onSurfaceVariant,
  },
  title: {
    ...typography.headlineLg,
    color: colors.onSurface,
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  viewportCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(22, 22, 22, 0.04)',
    marginBottom: 20,
  },
  imageBox: {
    width: '100%',
    aspectRatio: 4 / 5,
    position: 'relative',
    backgroundColor: colors.surfaceContainerHigh,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  zoomedImage: {
    transform: [{ scale: 1.3 }],
  },
  imageGradientScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  topImageRow: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayGlassBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    gap: 6,
    ...shadows.level1,
  },
  dayGlassText: {
    ...typography.monoMetric,
    fontSize: 12,
    fontWeight: '700',
    color: colors.onSurface,
  },
  glassDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.outlineVariant,
  },
  dateGlassText: {
    ...typography.monoMetric,
    fontSize: 11,
    color: colors.onSurfaceVariant,
  },
  zoomButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.level1,
  },
  bottomImageRow: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  pivotInfo: {
    flex: 1,
  },
  pivotLabel: {
    ...typography.labelCaps,
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  pivotTitle: {
    ...typography.headlineSm,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  progressPointPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  progressPointText: {
    ...typography.monoMetric,
    fontSize: 11,
    color: '#FFFFFF',
  },
  reflectionSection: {
    padding: 20,
    gap: 16,
  },
  journalQuoteBox: {
    position: 'relative',
    paddingLeft: 14,
  },
  verticalBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderRadius: 1.5,
    backgroundColor: colors.secondary,
  },
  journalText: {
    ...typography.bodyMd,
    color: colors.onSurface,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  journalMeta: {
    ...typography.labelCaps,
    color: colors.onSurfaceVariant,
    marginTop: 6,
  },
  aiLensCard: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  aiIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.secondaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiTextCol: {
    flex: 1,
  },
  aiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  aiLensTitle: {
    ...typography.labelCaps,
    fontSize: 10,
    color: colors.secondary,
    fontWeight: '700',
  },
  aiDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.outlineVariant,
  },
  aiShiftLabel: {
    ...typography.monoMetric,
    fontSize: 10,
    color: colors.onSurfaceVariant,
  },
  aiBodyText: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    lineHeight: 18,
  },
  scrubberSection: {
    gap: 14,
    marginBottom: 20,
  },
  stepButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  stepButton: {
    flex: 1,
    height: 48,
    borderRadius: 9999,
    backgroundColor: colors.surfaceContainerHigh,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  stepButtonDisabled: {
    opacity: 0.4,
  },
  stepButtonText: {
    ...typography.labelCaps,
    color: colors.onSurface,
  },
  compareButton: {
    marginTop: 4,
  },
  exportCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exportLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  exportIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exportTextCol: {
    flex: 1,
  },
  exportTitle: {
    ...typography.headlineSm,
    fontSize: 14,
    color: colors.onSurface,
  },
  exportSubtitle: {
    ...typography.bodySm,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginTop: 1,
  },
  createBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
  },
  createBtnText: {
    ...typography.labelCaps,
    color: colors.onPrimary,
  },
});
